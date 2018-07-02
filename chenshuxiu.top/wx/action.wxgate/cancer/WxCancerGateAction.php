<?php

/*
 * 肿瘤统一网关 wxcancergate
 */
class WxCancerGateAction extends WxGateBaseAction
{

    public function __construct () {
        parent::__construct();
    }

    // 将返回消息内容注入关注响应
    protected function getSubscribeContent () {
        $wxuser = $this->wxuser;
        $wxshop = $this->wxshop;
        $wx_uri = Config::getConfig("wx_uri");

        $doctor_name = '';
        if ($wxuser->wx_ref_code) {
            $doctor = DoctorDao::getByCode($wxuser->wx_ref_code);
            $doctor_name = $doctor->name;
        }

//         $str = "[王永前门诊手术预约诊后管理服务平台]";
//         if ($wxshop->id == 23) {
//             $str = "[内六科诊后管理服务平台]";
//         }

//         $content = "您好，欢迎关注{$str}在这里您可以免费接受{$doctor_name}医生及其医生助理的多项院外管理服务。";
//         $content .= "请您及时进行报到，报到成功后即可开始管理服务同时会有医生助理专门负责。";
//         $content .= "您可以通过点击详情或直接点击右下角的<a href=\"{$wx_uri}/baodao/baodao?openid={$wxuser->openid}\">『报到』</a>";
//         $content .= "进行报到操作。如有问题请咨询医生或拨到电话010-60648881。";

        $content = "您好！请点击\"患者报到\",完善个人信息，以便您与{$doctor_name}医生团队联系，得到针对性的院外指导。";
        $content .= "\n\n<a href=\"{$wx_uri}/baodao/baodao?openid={$wxuser->openid}\">>患者报到</a>";

        return $content;
    }
}
