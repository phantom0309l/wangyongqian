<?php

/*
 * 方寸诊后服务平台
 */
class WxFuwupingtaiAction extends WxGateBaseAction
{

    public function __construct () {
        parent::__construct();
        $this->wxshop = WxShop::getById(13);
    }

    // 将返回消息内容注入关注响应
    protected function getSubscribeContent () {
        $wxuser = $this->wxuser;
        $wx_uri = Config::getConfig("wx_uri");

        $content = parent::getSubscribeContent();

        if ($wxuser->is_alk == 1) {
            $content = "您好！请点击“患者报到”，完善个人信息，以便您加入《ALK阳性肺癌患者支持项目》，得到针对性的院外指导。";
            $content .= "\n\n<a href=\"{$wx_uri}/baodao/baodao?openid={$wxuser->openid}\">>患者报到</a>";
        }

        return $content;
    }
}
