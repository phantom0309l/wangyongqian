<?php

/*
 * 非adhd的服务号基类
 */

class WxGateBaseAction extends BaseAction
{

    protected $wxshop = null;

    protected $wxuser = null;

    protected $myuser = null;

    protected $mypatient = null;

    protected $mypcard = null;

    protected $MsgId = null;

    protected $MsgType = null;

    protected $FromUserName = null;

    protected $ToUserName = null;

    protected $Event = null;

    protected $EventKey = null;

    protected $response_content = "";

    protected $response_wxMsgBase4wxs = array();

    protected $media_id = null;

    public function __construct() {
        parent::__construct();

        // 放弃版本号的检查
        Config::setConfig("update_need_check_version", false);
    }

    // 检查签名
    protected function checkSignature() {
        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];

        $token = XContext::getValue('weixin_token');

        $tmpArr = array(
            $token,
            $timestamp,
            $nonce);
        sort($tmpArr, SORT_STRING);
        $tmpStr = implode($tmpArr);
        $tmpStr = sha1($tmpStr);
        return ($tmpStr == $signature) ? true : false;
    }

    // 对接微信的网关，多个公众号
    public function doGate() {
        // 验证是否是合法的微信请求
        // f (! $this->checkSignature ()) {
        // DBC::requireTrue ( false, '微信网关签名错误' );
        // return self::BLANK;
        //

        // 应对微信的第三方服务器归属验证
        if (isset($_GET['echostr']) && $_GET['echostr']) {
            echo $_GET["echostr"];
            return self::BLANK;
        }
        // 通常情况下对微信请求进行响应的部分
        $this->anaPostData();

        // 将向微信返回的内容包装为xml并echo (即向微信响应)
        $responseStr = $this->getResponseStr();
        echo $responseStr;
        return self::BLANK;
    }

    protected function getResponseStr() {
        // 将向微信返回的内容包装为xml并echo (即向微信响应)
        $responseStr = '';
        if (count($this->response_wxMsgBase4wxs) > 0) {
            $responseStr = WxApi::xiangyingNewsMsg($this->ToUserName, $this->FromUserName, $this->response_wxMsgBase4wxs);
        } elseif (!empty($this->media_id)) {
            $responseStr = WxApi::xiangyingImageMsg($this->ToUserName, $this->FromUserName, $this->media_id);
        } elseif ($this->response_content) {
            $responseStr = WxApi::xiangyingTextMsg($this->ToUserName, $this->FromUserName, $this->response_content);
        }

        Debug::trace($responseStr);
        return $responseStr;
    }

    protected function anaPostData() {
        $xmlobj = $this->getXmlobj();

        // ---- 将xml对象的字段转为函数内局部变量 ----
        $MsgId = $this->MsgId = $xmlobj->MsgId;
        $MsgType = $this->MsgType = $xmlobj->MsgType;
        $FromUserName = $this->FromUserName = $xmlobj->FromUserName;
        $ToUserName = $this->ToUserName = trim($xmlobj->ToUserName);
        $Event = $this->Event = strtolower($xmlobj->Event); // 纯小写
        $EventKey = $this->EventKey = trim($xmlobj->EventKey ? $xmlobj->EventKey : $xmlobj->Content);

        // --------------------------------------------

        // ---- 用户所关注的公众号的wxshop对象 ----
        $openid = $FromUserName;
        $this->wxshop = WxShopDao::getByGh($ToUserName);
        $wxshop = $this->wxshop; // 子类必须于构造函数中对此变量赋值

        // --------------------------------------------

        // 获取或创建该用户的wxuser
        $this->wxuser = $wxuser = WxUser::getOrCreateByOpenid($openid, $wxshop->id, $EventKey);

        // ---- 针对消息的类型做不同的处理 ----
        $this->response_content = ""; // 向微信所返回的xml所封装的核心内容

        if (WxApi::isCommonMsg($MsgType)) {
        } else {
            // 根据$Event的值执行对应的函数应对微信请求
            $procname = "dueto_{$Event}"; // ex: scan :-> dueto_scan
            if (method_exists($this, $procname)) {
                $this->$procname(); // x: $this->dueto_scan
            } else {
                // TODO
            }
        }
        // ------------------------------------
    }

    protected function getXmlobj() {
        // 所有的参数数据被微信以xml格式封装于请求的body中, 故以此函数取出body中的xml对象
        $xmlobj = FUtil::bodyXMLToObj();
        return $xmlobj;
    }

    //
    // 针对具体消息类型的响应 (default)
    //

    // 关注
    protected function dueto_subscribe() {
        $this->response_content = $this->getSubscribeContent();
    }

    // 取消关注
    protected function dueto_unsubscribe() {
    }

    // 可以重载
    protected function handleByQrcode($wx_ref_code) {
    }

    // 扫码
    protected function dueto_SCAN() {
    }

    // TODO
    protected function dueto_CLICK() {
    }

    protected function dueto_masssendjobfinish() {
    }

    protected function dueto_LOCATION() {
    }

    // 将返回消息内容注入关注响应
    protected function getSubscribeContent() {
        $content = "预约手术请注意:\n1.整形外科医院有八大处院区（北院）、国贸门诊部、北京医科医疗亚运村店（北院）等院区，王永前主任会在不同日期在各院区进行手术，预约时请注意区分。\n2.月经期内不能行手术，请您选择预约日期时避开月经期。\n3.预约成功后，将在预约日期前一周与您短信确认是否可按期手术，请注意确认手术，否则手术预约自动取消。\n4.面诊后才能预约手术。\n\n<a href='http://wx.chenshuxiu.top/schedule/list'>预约手术>>></a>";
        return $content;
    }

    // 将返回消息内容注入扫码响应
    protected function getScanContent() {
        return "";
    }
}
