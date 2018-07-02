<?php

/*
 * 孤独症
 */
class WxAsdAction extends WxGateBaseAction
{

    public function __construct () {
        parent::__construct();
        $this->wxshop = WxShop::getById(24);
    }
}
