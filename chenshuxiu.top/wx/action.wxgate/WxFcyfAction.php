<?php

/*
 * 方寸研发,测试服务号
 */
class WxFcyfAction extends WxGateBaseAction
{

    public function __construct () {
        parent::__construct();
        $this->wxshop = WxShop::getById(8);
    }

    protected function dueto_subscribe () {
        parent::dueto_subscribe();
        $wxuser = $this->wxuser;
        $doctor = $wxuser->doctor;
        if ($doctor instanceof Doctor) {
            // 患者根据医生进入不同分组
            $doctorid_arr = array(
                11);
            if (in_array($doctor->id, $doctorid_arr)) {
                WxApi::MvWxuserToGroup($wxuser, 100);
            }
        }
    }

    protected function getXmlobj () {
        $msg_signature = $_GET["msg_signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];
        $postdata = FUtil::getBodyXML();
        $xmlstr = WxApi::decryptMsg($this->wxshop, $msg_signature, $timestamp, $nonce, $postdata);
        $xmlobj = simplexml_load_string($xmlstr, 'SimpleXMLElement', LIBXML_NOCDATA);
        Debug::trace("=== decryptMsged xml{$xmlstr}===");
        return $xmlobj;
    }

    protected function getResponseStr () {
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
        if (FUtil::isHoliday()) {
            $str = "假期工作辛苦了!";
        }
        return $str;
    }

    // 将返回消息内容注入关注响应
    protected function getSubscribeContent () {
        $wxuser = $this->wxuser;
        $wxshop = $this->wxshop;
        $wx_uri = Config::getConfig("wx_uri");
        $baodao_url = "<a href=\"{$wx_uri}/baodao/baodao?openid={$wxuser->openid}\">『报到』</a>";
        $content = "";
        if ($wxuser->wx_ref_code) {
            $doctor = DoctorDao::getByCode($wxuser->wx_ref_code);
            $doctorname = "";
            $hospitalname = "";
            if ($doctor instanceof Doctor) {
                $doctorname = $doctor->name;
                $hospitalname = $doctor->hospital->name;
            }
            $arr = array(
                '#baodao_url#' => $baodao_url);
            $content = MsgTemplateService::getMsgContentByWxUserEname($wxuser, 'adhd_subscribe', $arr);
        } else {
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
        Debug::trace("======[1]=====");
        if ($doctor instanceof Doctor) {
            Debug::trace("======2[{$doctor->id}]=====");
            if ($txt == '出诊表') {
                Debug::trace("======[3]=====");
                $this->response_wxMsgBase4wxs = array();
                $kt_title = "{$doctor->name}医生出诊表";
                $kt_img = "{$img_uri}/static/img/hmm_07.png";
                $kt_content = "";
                $kt_url = "{$wx_uri}/scheduletpl/index?openid={$wxuser->openid}&doctorid={$doctor->id}";
                $this->response_wxMsgBase4wxs[] = new SimpleWxMsg($kt_title, $kt_img, $kt_content, $kt_url);
                Debug::trace("======[3]=====");
            }
        }

        $this->marketManagerGetDoctorPassWord($txt);

        $this->auditorResetPassword($txt);
    }

    // 市场经理获取医生密码操作
    private function marketManagerGetDoctorPassWord ($txt) {
        $txt = trim($txt);
        $regex = '/^(.+)密码$/';
        if (preg_match($regex, $txt, $match)) {
            $wxuser = $this->wxuser;

            // 市场经理判断
            if ($wxuser->id != 104563191) {
                return;
            }

            // 是否离职判断
            $user = $wxuser->user;
            if (false == $user->isAuditor()) {
                return;
            }

            // 是否医生判断
            $doctorname = $match[1];
            $doctor = DoctorDao::getByName($doctorname);
            if ($doctor instanceof Doctor) {
                $doctor_user = $doctor->user;
                $username = $doctor_user->username;
                $sasdrowp = $doctor_user->sasdrowp;

                $content = "账号：{$username}\n密码：{$sasdrowp}";
                $pushmsg = PushMsgService::sendTxtMsgToWxUserBySystem($wxuser, $content);
            }
        }
    }

    // 员工重置密码
    private function auditorResetPassword ($txt) {
        $txt = trim($txt);
        $regex = '/^芝麻开门$/';
        if (preg_match($regex, $txt, $match)) {
            $wxuser = $this->wxuser;
            // 是否在职员工
            $user = $wxuser->user;
            if (false == $user->isAuditor()) {
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
}
