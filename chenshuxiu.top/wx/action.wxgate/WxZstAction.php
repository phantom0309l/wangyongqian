<?php

/*
 * 卓圣堂
 */
class WxZstAction extends WxGateBaseAction
{

    public function __construct () {
        parent::__construct();
        $this->wxshop = WxShop::getById(25);
    }
}
