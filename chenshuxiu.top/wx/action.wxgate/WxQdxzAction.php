<?php

/*
 * 气道狭窄诊后管理平台
 */
class WxQdxzAction extends WxGateBaseAction
{

    public function __construct () {
        parent::__construct();
        $this->wxshop = WxShop::getById(27);
    }
}
