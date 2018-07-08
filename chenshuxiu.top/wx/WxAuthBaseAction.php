<?php

class WxAuthBaseAction extends BaseAction
{

    // ######################################
    // #
    // 凡成员变量的修改要注册XContext变量 #
    // #
    // ######################################
    // 二级页面或客服消息的需要(发消息和拼url)
    protected $wxshop = null;
    // 患者基本资料: 姓名,年龄,籍贯等
    protected $mypatient = null;

    public function __construct() {
        parent::__construct();
        XContext::setValue("tpl", ROOT_TOP_PATH . "/wx/tpl");

        // 初始化 $wxshop 和 $mypatient
        $this->initMyPatientWxshop();
    }

    // 初始化
    protected function initMyPatientWxshop() {
        // ----0------------------------------------------------------------
        // ---- 初始化重要变量 ----
        $wxshop = null;
        $mypatient = null;

        $wxshop = WxShop::getById(1);

        // 登录判断2: 判断cookie设置 myauditor
        $mypatientid = $this->getCookieMyUserId();
        if ($mypatientid > 0) {
            $mypatient = Patient::getById($mypatientid);
        }

        // 重新种cookie : _mypatientid_
        if ($mypatient instanceof Patient && $mypatientid != $mypatient->id) {
            $this->setMyUserIdCookie($mypatient->id);

            if ($mypatientid > 0) {
                Debug::warn("setMyUserIdCookie({$mypatientid} => {$mypatient->id} )");
            }
        }

        // ---- 初始化对象变量 ----
        $this->wxshop = $wxshop;
        $this->mypatient = $mypatient;

        // ---- 模板变量注册 ----
        XContext::setValue("wxshop", $wxshop);
        XContext::setValue("mypatient", $mypatient);

        XContext::setValue("wx_jssdk_config", WxShop::getJSSDKConfigJson());    // 用于模板使用微信jssdk
    }

    // 获取保存的myuserid
    protected function getCookieMyUserId() {
        return XCookie::get("_mypatientid_");
    }

    // 保存登录
    protected function setMyUserIdCookie($mypatientid) {
        if ($mypatientid) {
            XCookie::set("_mypatientid_", $mypatientid);
        }
    }

    // 退出登录
    protected function clearMyUserIdCookie() {
        XCookie::set0("_mypatientid_", '', -1);
    }

    public function setJumpPathResultPage ($noticestr, $closepage = 1, $gourl = "") {
        XContext::setJumpPath("/common/result?noticestr={$noticestr}&closepage={$closepage}&gourl={$gourl}");
    }

    public function jump302ResultPage ($noticestr, $closepage = 1, $gourl = "") {
        UrlFor::jump302(Config::getConfig('wx_uri') . "/common/result?noticestr={$noticestr}&closepage={$closepage}&gourl={$gourl}");
    }

}
