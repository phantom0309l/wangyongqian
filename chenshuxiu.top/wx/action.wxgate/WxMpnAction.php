<?php

/*
 * MPN诊后管理, 骨髓增殖性肿瘤
 */
class WxMpnAction extends WxGateBaseAction
{

    public function __construct () {
        parent::__construct();
        $this->wxshop = WxShop::getById(10);
    }
}
