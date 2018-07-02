<?php

/*
 * RA院外管理, 类风湿性关节炎
 */
class WxRaAction extends WxGateBaseAction
{

    public function __construct () {
        parent::__construct();
        $this->wxshop = WxShop::getById(9);
    }
}
