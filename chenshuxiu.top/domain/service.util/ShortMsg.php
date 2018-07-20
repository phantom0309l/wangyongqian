<?php

class ShortMsg extends MsgBase
{
    //漫道管理后台登陆地址   http://newself.zucp.net/login.html

    private static $mandao_sn = "SDK-BBX-010-28153";
    private static $mandao_pwd = "6^e-^dbd-49";

    public static function sendmsg_asyn($userid, $patientid, $content, $appendarr = array()) {
        $row = array(
            "userid" => $userid,
            "patientid" => $patientid,
            "sendway" => "sms",
            "content" => $content);
        $row += $appendarr;
        $row += parent::$defaultsrcarr;
        $pushMsg = PushMsg::createByBiz($row);
        return $pushMsg;
    }

    /**
     * 发送模板短信（漫道）
     *
     * @param $mobile   手机号 多个用英文的逗号隔开 post理论没有长度限制.推荐群发一次小于等于10000个手机号
     * @param $content    短信内容
     * @return mixed|SimpleXMLElement
     */
    public static function sendManDaoTemplateSMS_j4now($mobile, $content, $ext = '') {
        $sn = self::$mandao_sn;
        $pwd = self::$mandao_pwd;

        $data = array(
            'sn' => $sn, //提供的账号
            'pwd' => strtoupper(md5($sn . $pwd)), //此处密码需要加密 加密方式为 md5(sn+password) 32位大写
            'mobile' => $mobile, //手机号 多个用英文的逗号隔开 post理论没有长度限制.推荐群发一次小于等于10000个手机号
            'content' => htmlspecialchars($content), //短信内容 htmlspecialchars() 函数把一些预定义的字符转换为 HTML 实体。
            'ext' => $ext,  //默认为空发走发验证码通道；1为发送营销短信通道（除验证码以外的短信）；
            'stime' => '', //定时时间 格式为2011-6-29 11:09:21
            'rrid' => '',//默认空 如果空返回系统生成的标识串 如果传值保证值唯一 成功则返回传入的值
            'msgfmt' => ''
        );
        Debug::trace($data);

        $url = "http://sdk.entinfo.cn:8061/webservice.asmx/mdsmssend";

        $result = FUtil::curlPost($url, http_build_query($data), 5);
        var_dump($result);

        $result = str_replace("<?xml version=\"1.0\" encoding=\"utf-8\"?>", "", $result);
        $result = str_replace("<string xmlns=\"http://tempuri.org/\">", "", $result);
        $result = str_replace("<string xmlns=\"http://entinfo.cn/\">", "", $result);
        $result = str_replace("</string>", "", $result);
        return $result;
    }

}
