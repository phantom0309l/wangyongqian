<?php
$domain = "chenshuxiu.top";
include dirname(__FILE__) . "/_config.php";

//$config['photo_uri'] = "http://photo.{$domain}";
$config['photo_uri'] = "http://photo.chenshuxiu.top";
$config['img_uri'] = "http://img.{$domain}";

$config['icp'] = isset($_COOKIE['dev_user']) ? 'dev_user=' . $_COOKIE['dev_user'] : "icp";
$config['company'] = '王永前门诊手术预约平台-开发环境';

$config['xworkdbOpen'] = false;
$config['log_level'] = LogLevel::LEVEL_TRACE;
