<?php

/*
 * ILD院外管理, 肺间质纤维化
 */
class WxPfAction extends WxGateBaseAction
{

    public function __construct () {
        parent::__construct();
        $this->wxshop = WxShop::getById(6);
    }

    protected function getSubscribeContent () {
        $wxshop = $this->wxshop;
        $wxuser = $this->wxuser;

        $wx_uri = Config::getConfig("wx_uri");
        $content = ($wxshop instanceof WxShop) ? "欢迎关注[{$wxshop->name}],\n请点:<a href='{$wx_uri}/baodao/baodao?openid={$wxuser->openid}'>我要报到</a>，完善报到信息，以便接受院外管理。" : "";
        return $content;
    }
}
