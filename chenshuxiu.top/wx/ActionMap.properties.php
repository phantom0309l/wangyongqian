<?php

$rewrites = array();

// 首页模式
$rewrites["/^\/*$/i"] = "/index.php?action=index&method=index";

// 缺省模式 /action/method/
$rewrites["/\/xpay\/(.*?)_(.*?)\/*$/i"] = "/index.php?action=\${1}&method=\${2}";
$rewrites["/\/(.*?)\/(.*?)\/*$/i"] = "/index.php?action=\${1}&method=\${2}";

$actionMaps = array();
$actionMaps['default_interceptor'] = array(
    'ApplicationSessionModifyInterceptor');
$actionMaps['default_class'] = "index";
$actionMaps['default_method'] = "404";
