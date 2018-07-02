<?php

/*
 * 任联
 */
class WxRenLianAction extends WxGateBaseAction
{

    public function __construct () {
        parent::__construct();
        $this->wxshop = WxShop::getById(28);
    }
}
