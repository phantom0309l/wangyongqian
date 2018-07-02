<?php

/*
 * PAH院外管理, 肺动脉高压
 */
class WxPAHAction extends WxGateBaseAction
{

    public function __construct () {
        parent::__construct();
        $this->wxshop = WxShop::getById(22);
    }
}
