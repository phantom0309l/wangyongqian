<?php

/*
 * 爱延续肺动脉高压患者全程关爱 肺动脉高压
 */
class WxFeiGaoYaAction extends WxGateBaseAction
{

    public function __construct () {
        parent::__construct();
        $this->wxshop = WxShop::getById(30);
    }

    // 将返回消息内容注入关注响应
    protected function getSubscribeContent () {
        $wx_uri = Config::getConfig("wx_uri");
        $content = ($this->wxshop instanceof WxShop) ? "欢迎关注[爱·延续·肺动脉高压患者全程关爱]服务平台,\n请点:<a href='{$wx_uri}/actelion_baodao/baodao?openid={$this->wxuser->openid}'>关爱起航</a>，加入服务。" : "";
        return $content;
    }

    // 将返回消息内容注入扫码响应
    protected function getScanContent () {
        $wx_uri = Config::getConfig("wx_uri");
        $content = ($this->wxshop instanceof WxShop) ? "欢迎关注[爱·延续·肺动脉高压患者全程关爱]服务平台,\n请点:<a href='{$wx_uri}/actelion_baodao/baodao?openid={$this->wxuser->openid}'>关爱起航</a>，加入服务。" : "";
        return $content;
    }
}
