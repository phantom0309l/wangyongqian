<?php
// please enable the line below if you are having memory problems
// ini_set('memory_limit', "16M");
// just to make php use &amp; as the separator when adding the PHPSESSID
// variable to our requests // aa
ini_set("arg_seperator.output", "&amp;");
ini_set("magic_quotes_gpc", 0);
ini_set("magic_quotes_sybase", 0);
ini_set("magic_quotes_runtime", 0);
// 不允许打开！！学会看php错误日志+nginx错误日志
// ini_set('display_errors', 1);

// phpinfo();
// error_reporting(E_ALL ^ E_NOTICE ^ E_DEPRECATED ^ E_STRICT);

if ($_GET['debug'] == 'fcqx' || $_GET['debugkey'] == 'fcqx') {
    error_reporting(E_ALL ^ E_NOTICE);
    // ini_set('display_errors', 1);
}
// load Config and Assembly
include_once (dirname(__FILE__) . "/../../sys/PathDefine.php");
include_once (ROOT_TOP_PATH . "/admin/Assembly.php");
mb_internal_encoding("UTF-8");

TheSystem::init(__FILE__, true);

Config::setConfig('innerSystem', true);

$memory_start = memory_get_usage();
XContext::setValue("memory_start", $memory_start);

Config::setConfig("cacheNeedReload", true);
if (isset($_GET["nocache"]) || isset($_GET["cacheNeedReload"])) {
    Config::setConfig("cacheNeedReload", true);
}

Config::setConfig("needUrlRewrite", true);
$tplPath = ROOT_TOP_PATH . "/admin/tpl/";

$mapFile = ROOT_TOP_PATH . "/admin/ActionMap.properties.php";
$controller = new XController($mapFile, $tplPath);
$controller->process();

if (! empty($echoTime))
    echo "<br>" . XContext::getValue("AllCostTime");
