<?php
include_once (ROOT_TOP_PATH . "/../core/tools/AESCrypt.php");
class WxShopAction extends BaseAction
{
    public function __construct () {
        parent::__construct();
    }

	// 此方法用于测试环境接收提供线上的access_token
    public function doRecieveJson () {
        $wxshopid = XRequest::getValue('wxshopid', 0);
        $access_token = XRequest::getValue('access_token', '');
        $access_in = XRequest::getValue('access_in', 0);
        $expires_in = XRequest::getValue('expires_in', 0);
        $wxshop = WxShop::getById($wxshopid);

        DBC::requireNotEmpty($wxshop, "微信号为空");

		$aes = new AESCrypt(WxShop::$aeskey);
		$access_token = $aes->decrypt($access_token);

        if('development' == Config::getConfig('env')){
            $wxshop->access_token = $access_token;
            $wxshop->access_in = $access_in;
            $wxshop->expires_in = $expires_in;
        }

        echo 'ok';
        return self::BLANK;
    }
}
