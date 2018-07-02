<?php

/*
 * Dementia院外管理, 痴呆
 */
class WxChiDaiAction extends WxGateBaseAction
{

    public function __construct () {
        parent::__construct();
        $this->wxshop = WxShop::getById(20);
    }
}
