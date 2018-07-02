<?php

/*
 * PCI院外管理
 */
class WxPciAction extends WxGateBaseAction
{

    public function __construct () {
        parent::__construct();
        $this->wxshop = WxShop::getById(26);
    }
}
