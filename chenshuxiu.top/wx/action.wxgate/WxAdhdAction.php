<?php

/*
 * 方寸儿童管理服务平台,方寸儿童管理服务平台
 */
class WxAdhdAction extends WxGateBaseAction
{

    public function __construct () {
        parent::__construct();
        $this->wxshop = WxShop::getById(1);
    }

    protected function dueto_subscribe () {
        parent::dueto_subscribe();
    }

    protected function getXmlobj(){
        $msg_signature = $_GET["msg_signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];
        $postdata = FUtil::getBodyXML();
        $xmlstr = WxApi::decryptMsg($this->wxshop, $msg_signature, $timestamp, $nonce, $postdata);
        $xmlobj = simplexml_load_string($xmlstr, 'SimpleXMLElement', LIBXML_NOCDATA);
        Debug::trace("=== decryptMsged xml{$xmlstr}===");
        return $xmlobj;
    }

    protected function getResponseStr(){
        // 将向微信返回的内容包装为xml并echo (即向微信响应)
        $responseStr = '';
        if (count($this->response_wxMsgBase4wxs) > 0) {
            $responseStr = WxApi::xiangyingNewsMsg($this->ToUserName, $this->FromUserName, $this->response_wxMsgBase4wxs);
        } elseif (! empty($this->media_id)) {
            $responseStr = WxApi::xiangyingImageMsg($this->ToUserName, $this->FromUserName, $this->media_id);
        } elseif ($this->response_content) {
            $responseStr = WxApi::xiangyingTextMsg($this->ToUserName, $this->FromUserName, $this->response_content);
        }

        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];
        $responseStr = WxApi::encryptMsg($this->wxshop, $timestamp, $nonce, $responseStr);

        return $responseStr;
    }

    protected function getCommonResponseContent () {
        $str = "";
        return $str;
        if( FUtil::isHoliday() ){
            $tel = Config::getConfig("tel_adhd");
            $str = "亲爱的家长，您发送的消息我们已经收到，助理将在1个工作日内给您回复。";
        }
        return $str;
    }

    // 将返回消息内容注入关注响应
    protected function getSubscribeContent () {
        $wxuser = $this->wxuser;
        $wxshop = $this->wxshop;

        $content = "";
        if( $wxuser->wx_ref_code ){
            $wx_uri = Config::getConfig("wx_uri");
            $baodao_url = "<a href=\"{$wx_uri}/baodao/baodao?openid={$wxuser->openid}\">『报到』</a>";
            $arr = array(
                '#baodao_url#' => $baodao_url,
            );

            $content = MsgTemplateService::getMsgContentByWxUserEname($wxuser, 'adhd_subscribe', $arr);
        }else{
            $content = "欢迎关注[{$wxshop->name}]";
        }
        return $content;
    }

    protected function handleTxtSendByWxuser ($txt) {
        parent::handleTxtSendByWxuser($txt);

        $wxuser = $this->wxuser;
        $doctor = $wxuser->doctor;
        $wx_uri = Config::getConfig("wx_uri");
        $img_uri = Config::getConfig("img_uri");

        if ($txt == '图文响应消息') {
            $this->response_wxMsgBase4wxs = array();
            $this->response_wxMsgBase4wxs[] = new SimpleWxMsg($wxuser->nickname, $wxuser->headimgurl, '世上无难事,只怕有心人', 'http://www.baidu.com');
        }

        if( $doctor instanceof Doctor ){
            if ($txt == '出诊表') {
                $this->response_wxMsgBase4wxs = array();
                $kt_title = "{$doctor->name}医生出诊表";
                $kt_img = "{$img_uri}/static/img/hmm_07.png";
                $kt_content = "";
                $kt_url = "{$wx_uri}/scheduletpl/index?openid={$wxuser->openid}&doctorid={$doctor->id}";
                $this->response_wxMsgBase4wxs[] = new SimpleWxMsg($kt_title, $kt_img, $kt_content, $kt_url);
            }

            if ($txt == '开药门诊' && $doctor->menzhen_offset_daycnt > 0) {
                $this->response_wxMsgBase4wxs = array();
                $kt_title = "开药门诊";
                $kt_img = "{$img_uri}/static/img/menzhen.png";
                $kt_content = "";
                $kt_url = "{$wx_uri}/shopmedicine/menzhen?openid={$wxuser->openid}";
                $this->response_wxMsgBase4wxs[] = new SimpleWxMsg($kt_title, $kt_img, $kt_content, $kt_url);
            }
        }

        $this->marketManagerGetDoctorPassWord($txt);
        $this->auditorResetPassword($txt);
        $this->getWxTxtMsgList($txt);
    }

    //市场经理获取医生密码操作
    private function marketManagerGetDoctorPassWord($txt){
        $txt = trim($txt);
        $regex = '/^(.+)密码$/';
        if(preg_match($regex,$txt,$match)){
            $wxuser = $this->wxuser;

            //市场经理判断
            if( 103214613 != $wxuser->id ){
                return;
            }

            //是否离职判断
            $user = $wxuser->user;
            if( false == $user->isAuditor() ){
                return;
            }

            //是否医生判断
            $doctorname = $match[1];
            $doctor = DoctorDao::getByName($doctorname);
            if( $doctor instanceof Doctor ){
                $doctor_user = $doctor->user;
                $username = $doctor_user->username;
                $sasdrowp = $doctor_user->sasdrowp;

                $content = "账号：{$username}\n密码：{$sasdrowp}";
                $pushmsg = PushMsgService::sendTxtMsgToWxUserBySystem($wxuser, $content);
            }
        }
    }

    //员工重置密码
    private function auditorResetPassword($txt){
        $txt = trim($txt);
        $regex = '/^芝麻开门$/';
        if(preg_match($regex,$txt,$match)){
            $wxuser = $this->wxuser;
            //是否在职员工
            $user = $wxuser->user;
            if( false == $user->isAuditor() ){
                $content = "轻轻的我走了，\n正如我轻轻的来，\n我挥一挥衣袖，\n不带走一片云彩。";
                $pushmsg = PushMsgService::sendTxtMsgToWxUserBySystem($wxuser, $content);
                return;
            }

            $password = FUtil::getRandStr(6);
            $user->modifyPassword($password);

            $content = "账号：{$user->username}\n密码：{$password}";
            $pushmsg = PushMsgService::sendTxtMsgToWxUserBySystem($wxuser, $content);
        }
    }

    //获取当天用户发来的消息
    private function getWxTxtMsgList($txt){
        $txt = trim($txt);
        $regex = '/^商城$/';
        if(preg_match($regex,$txt,$match)){
            $wxuser = $this->wxuser;
            //是否在职员工
            $user = $wxuser->user;
            if( false == $user->isAuditor() ){
                return;
            }
            $openid = $wxuser->openid;
            $wx_uri = Config::getConfig("wx_uri");
            $url = $wx_uri . "/wxmall/showwxtxtmsg?openid={$openid}";
            $str = "医生助理";
            $content = "点击查看~~~~，168卡卡就是发!";
            $first = array(
                "value" => "",
                "color" => "#ff6600");
            $keywords = array(
                array(
                    "value" => $str,
                    "color" => "#aaa"),
                array(
                    "value" => $content,
                    "color" => "#ff6600"));
            $content = WxTemplateService::createTemplateContent($first, $keywords);

            PushMsgService::sendTplMsgToWxUserBySystem($wxuser, "adminNotice", $content, $url);
        }
    }

}
