<?php

class WxUserAuthBaseAction extends BaseAction
{

    // ######################################
    // #
    // 凡成员变量的修改要注册XContext变量 #
    // #
    // ######################################
    // 二级页面或客服消息的需要(发消息和拼url)
    protected $openid = '';
    // 二级页面或客服消息的需要(发消息和拼url)
    protected $wxuserid = 0;
    // 服务号
    protected $wxshop = null;
    // 我登录的微信号(wxuser)(关注)
    protected $wxuser = null;
    // 患者基本资料: 姓名,年龄,籍贯等
    protected $mypatient = null;

    public function __construct () {
        parent::__construct();
        XContext::setValue("tpl", ROOT_TOP_PATH . "/wx/tpl");

        // 初始化 $wxshop , $wxuser 和 $mypatient
        $this->initWxshopWxuserMypatient();
    }

    // 初始化
    protected function initWxshopWxuserMypatient () {
        // ----0------------------------------------------------------------
        // ---- 初始化重要变量 ----
        $openid = '';
        $wxshop = null;
        $wxuser = null;
        $mypatient = null;

        // ----1------------------------------------------------------------
        // ---- url获取 openid 和 gh 和 code ----

        // ---- url获取openid, 不一定是正确的, 以下是有问题的情况 ----
        // from=singlemessage 单个转发
        // from=groupmessage 群转发
        // from=timeline 朋友圈转发
        $openid = XRequest::getValue('openid', '');

        // ---- 从url中获取必要参数, 该值不可存于cookie ----
        $gh = XRequest::getValue('gh', '');
        $code = XRequest::getValue('code', '');
        $visitDstTime = XRequest::getValue('visitDstTime', '');

        // ----2------------------------------------------------------------
        // ---- 第一次获取 wxshop, 通过菜单传过来的 gh 或 url 传过来的 openid ----

        if ($gh) {
            $wxshop = $this->wxshop = WxShopDao::getByGh($gh);
        } else {
            // ---- 若url中有openid(不再可靠), 获取可能的wxshop(不一定可靠)
            if ($openid) {
                $maybeWxUser = WxUserDao::getByOpenid($openid);
                $wxshop = $maybeWxUser->wxshop;

                // MARK: - 开发环境不能通过微信授权，因为微信授权域名只能设置一个
                $env = Config::getConfig("env");
                if ('development' == $env) {
                    $wxuser = $maybeWxUser;
                    $this->setWxUserIdCookie($wxuser->id, 0);
                }
                Debug::trace("openid[{$openid}] => wxshop[{$wxshop->id}] ");
            }
        }
        $wxshop = WxShop::getById(1);

        if ($openid) {
//            $maybeWxUser = WxUserDao::getByOpenid($openid);
            $maybeWxUser = WxUser::getOrCreateByOpenid($openid, $this->wxshop->id);
            $wxshop = $maybeWxUser->wxshop;

            // MARK: - 开发环境不能通过微信授权，因为微信授权域名只能设置一个
            $env = Config::getConfig("env");
            Debug::trace($env);
            if ('development' == $env) {
                $wxuser = $maybeWxUser;
                $this->setWxUserIdCookie($wxuser->id, 0);
            }
            Debug::trace("openid[{$openid}] => wxshop[{$wxshop->id}] ");
        }

        $_wxuserid_ = $this->getCookieWxUserId($wxshop->id, true);

        if ($_wxuserid_ > 0) {
            // wxshop[0]时, 不一定是正确的
            $wxuser = WxUser::getById($_wxuserid_);
        }

        // 不一致时重置wxuser, 这个时候信任了wxshop
        if ($wxshop instanceof WxShop && $wxuser instanceof WxUser && $wxshop->id != $wxuser->wxshopid) {
            Debug::trace("wxshop->id[{$wxshop->id}] <> wxuser->wxshopid[{$wxuser->wxshopid}]");
            $wxuser = null;
        }

        // ----4------------------------------------------------------------
        // ---- 获取 wxuser, 以 code 换取 openid, 菜单点击过来的情况 或 通过静默授权 ----

        if ($code && $wxshop instanceof WxShop) {
            if ($visitDstTime == "") {
                // 以code换取openid
                $_openid = WxApi::getOpenidByCode($wxshop->appid, $wxshop->secret, $code);

                if ($_openid) {
                    // 覆盖cookie里取来的wxuser
                    $wxuser = WxUserDao::getByOpenid($_openid);

                    // cookie 种 _wxuserid_
                    if ($wxuser instanceof WxUser) {
                        // wxshop[0]
                        $this->setWxUserIdCookie($wxuser->id, 0);

                        // wxshop[x]
                        $_wxuserid_ = $this->getCookieWxUserId($wxuser->wxshopid, false);

                        if ($wxuser->id != $_wxuserid_) {
                            $this->setWxUserIdCookie($wxuser->id, $wxuser->wxshopid);

                            if ($_wxuserid_ > 0) {
                                Debug::warn("setWxUserIdCookie(wxshop[{$wxuser->wxshopid}] {$_wxuserid_} => {$wxuser->id})");
                            }
                        }
                    } else {
                        Debug::trace("===== wxuser not find : ( WxShop[{$wxshop->id}], openid = {$_openid} ) =====");
                    }
                } else {
                    Debug::trace("===== getOpenidByCode fail [{$code}], retry jump302_qq_oauth2 =====");
                    $this->jump302_qq_oauth2($wxshop, true);
                }
            } else {
                Debug::warn("===== [出现有visitDstTime参数的情况], retry jump302_qq_oauth2 =====");
                $this->jump302_qq_oauth2($wxshop, true);
            }
        }

        // ----5------------------------------------------------------------
        // ---- 如果没有获取到了 wxuser, 需要跳转到微信授权页 ----

        if (false == $wxuser instanceof WxUser) {
            if ($wxshop instanceof WxShop) {
                Debug::trace("===== jump302_qq_oauth2 =====");
                $this->jump302_qq_oauth2($wxshop);
            } else {
                Debug::trace(" wxshop is null ");
                UrlFor::jump302(Config::getConfig('wx_uri') . "/nowxuser/notice");
            }
        } elseif ($openid && $wxuser->openid != $openid) {
            // ---- 若url中有openid, 检查正确性
            Debug::info("url泄漏, wxuser->openid[{$wxuser->openid}] <> [{$openid}]");
        }

        // ----6------------------------------------------------------------
        // ---- 最终取得 wxuser, 初始化系列变量 ----

        // ---- 初始化对象变量 ----
        $this->openid = $wxuser->openid;
        $this->wxuserid = $wxuser->id;

        $this->wxshop = $wxshop = $wxuser->wxshop;
        $this->wxuser = $wxuser;

        $this->mypatient = $wxuser->patient;

        // ---- 模板变量注册 ----
        XContext::setValue('openid', $wxuser->openid);
        XContext::setValue("wxshop", $wxshop);
        XContext::setValue("wxuser", $wxuser);
        XContext::setValue("mywxuser", $wxuser); // 重复注册一个,用于答卷提交
        XContext::setValue("mypatient", $mypatient);

        XContext::setValue("wx_jssdk_config", WxShop::getJSSDKConfigJson());    // 用于模板使用微信jssdk
    }

    protected function jump302_qq_oauth2 (WxShop $wxshop, $reTry = false) {
        $current_url = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
        $redirect_uri = urlencode($current_url);

        if ($reTry) {
            $current_url_arr = explode("&code=", $current_url);
            $redirect_uri = urlencode($current_url_arr[0]);
        }

        $code_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid={$wxshop->appid}&redirect_uri={$redirect_uri}&response_type=code&scope=snsapi_base&state=#wechat_redirect";
        UrlFor::jump302($code_url);
    }

    // 获取cookie保存的wxuserid
    protected function getCookieWxUserId ($wxshopid = 0, $try_wxshop_0 = true) {
        $_wxuserid_ = 0;

        // wxshop[x]
        if ($wxshopid > 0) {
            $key = "_wxuserid_{$wxshopid}_";
            $_wxuserid_ = XCookie::get($key);
        }

        // wxshop[0]
        if (empty($_wxuserid_) && $try_wxshop_0) {
            $key = "_wxuserid_0_";
            $_wxuserid_ = XCookie::get($key);
        }

        return $_wxuserid_;
    }

    // cookie保存wxuserid
    protected function setWxUserIdCookie ($wxuserid, $wxshopid = 0) {
        $key = "_wxuserid_{$wxshopid}_";
        XCookie::set($key, $wxuserid, time() + 86400 * 365 * 100);

        Debug::trace("setWxUserIdCookie(wxshop[{$wxshopid}] {$wxuserid})");
    }

    public function setJumpPathResultPage ($noticestr, $closepage = 1, $gourl = "") {
        XContext::setJumpPath("/common/result?noticestr={$noticestr}&closepage={$closepage}&gourl={$gourl}");
    }

    public function jump302ResultPage ($noticestr, $closepage = 1, $gourl = "") {
        UrlFor::jump302(Config::getConfig('wx_uri') . "/common/result?noticestr={$noticestr}&closepage={$closepage}&gourl={$gourl}");
    }
}
