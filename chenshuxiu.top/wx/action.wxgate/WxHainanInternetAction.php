<?php

/*
 * 海南互联网
 */
class WxHainanInternetAction extends WxGateBaseAction
{

    public function __construct () {
        parent::__construct();
        $this->wxshop = WxShop::getById(29);
    }
}
