<?php

/*
 * E康达
 */
class WxEKangDaAction extends WxGateBaseAction
{

    public function __construct () {
        parent::__construct();
        $this->wxshop = WxShop::getById(31);
    }
}
