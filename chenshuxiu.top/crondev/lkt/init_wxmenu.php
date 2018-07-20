<?php
/**
 * Created by PhpStorm.
 * User: hades
 * Date: 2018/7/14
 * Time: 14:49
 */
ini_set("arg_seperator.output", "&amp;");
ini_set("magic_quotes_gpc", 0);
ini_set("magic_quotes_sybase", 0);
ini_set("magic_quotes_runtime", 0);
ini_set('display_errors', 1);
ini_set("memory_limit", "2048M");
include_once(dirname(__FILE__) . "/../../sys/PathDefine.php");
include_once(ROOT_TOP_PATH . "/cron/Assembly.php");

mb_internal_encoding("UTF-8");

TheSystem::init(__FILE__);

$wxshop = WxShop::getById(1);
$wxmenu = new WxMenu();

$menu = '{
    "button": [
        {
            "type": "view",
            "name": "预约手术",
            "url": "http://wx.chenshuxiu.top/schedule/list",
            "sub_button": []
        },
    ],
}';

var_dump($wxmenu->createMenu($wxshop->id, $menu));