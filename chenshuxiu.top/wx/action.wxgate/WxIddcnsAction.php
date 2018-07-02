<?php

/*
 * MSNMO院外管理,炎性脱髓鞘病
 */
class WxIddcnsAction extends WxGateBaseAction
{

    public function __construct () {
        parent::__construct();
        $this->wxshop = WxShop::getById(7);
    }

    protected function getSubscribeContent () {
        $wxshop = $this->wxshop;
        $wxuser = $this->wxuser;

        $wx_uri = Config::getConfig("wx_uri");
        $content = ($wxshop instanceof WxShop) ? "欢迎关注[{$this->wxshop->name}],\n请点:<a href='{$wx_uri}/baodao/baodao?openid={$this->wxuser->openid}'>我要报到</a>，完善报到信息，以便接受院外管理。" : "";
        return $content;
    }
}
