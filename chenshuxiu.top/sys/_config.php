<?php

// $domain = "fangcunyisheng.com";
// $domain = "fangcunyisheng.cn";
// $domain = "fangcunhulian.com";
// $domain = "fangcunhulian.cn";
$ipdev = "127.0.0.1"; // 开发测试库 mainDB, xworkdb
$ip001 = "127.0.0.1"; // 新生产环境主库, mainDB

$maindb_ip = '0.0.0.0';
$statdb_ip = '0.0.0.0';
$xworkdb_ip = '0.0.0.0';
$nsqd_ip = '0.0.0.0';

$http = 'http';

if ('chenshuxiu.top' == $domain) {
    // 开发环境
    $env = 'development';
    $http = 'http';

    $maindb_ip = $ipdev;
    $statdb_ip = $ipdev;
    $xworkdb_ip = $ipdev;
    $nsqd_ip = $ipdev;
    $redis_ip = $ipdev;
} elseif ('chenshuxiu.top' == $domain) {
    // 生产环境
    $env = 'production';
    $http = 'http';

    $maindb_ip = $ipdev;
    $statdb_ip = $ipdev;
    $xworkdb_ip = $ipdev;
    $nsqd_ip = $ipdev;
    $redis_ip = $ipdev;
} else {
    echo $domain;
    exit();
}

// config init
$config = array();
$config['env'] = $env;
$config['website_domain'] = $domain;


// ===== database settings begin =====
//系统日志和sql日志的开关
$config['log_level'] = LogLevel::LEVEL_INFO; //default LEVEL_INFO
//$config['open_sql_log'] = false; //default true
//$config['open_sys_log'] = false; //default true
//$config['open_xworkdev_log'] = true; //default false
//$config['open_color_log'] = false; //default true

// 初始化一个静态变量,中心库名称/默认库名称
DaoBase::init_defaultdb_name('mainDB');

// database init
$config["database"] = array();

// mainDB init 中心库, 默认库
$config["database"]["mainDB"] = array();
// mainDB master
$config["database"]["mainDB"]["master"] = array(
    'db_host' => $maindb_ip,
    "db_database" => "mainDB",
    "db_username" => "chenshuxiu",
    "db_password" => "FlzxSqc",
    "db_port" => "3306");

// mainDB slaves
$config["database"]["mainDB"]["slaves"] = [];
$config["database"]["mainDB"]["slaves"][] = array(
    'db_host' => $maindb_ip,
    "db_database" => "mainDB",
    "db_username" => "chenshuxiu",
    "db_password" => "FlzxSqc",
    "db_hitratio" => 1,
    "db_port" => "3306");

// xworkdb init 框架日志库
$config["database"]["xworkdb"] = array();
// xworkdb master
$config["database"]["xworkdb"]["master"] = array(
    'db_host' => $xworkdb_ip,
    "db_database" => "xworkdb",
    "db_username" => "chenshuxiu",
    "db_password" => "FlzxSqc",
    "db_port" => "3306");
// xworkdb slaves
$config["database"]["xworkdb"]["slaves"] = [];
$config["database"]["xworkdb"]["slaves"][] = array(
    'db_host' => $xworkdb_ip,
    "db_database" => "xworkdb",
    "db_username" => "chenshuxiu",
    "db_password" => "FlzxSqc",
    "db_hitratio" => 1,
    "db_port" => "3306");

// ===== database settings end =====

// 框架统计服务开关
$config['xworkdbOpen'] = true;

$config['needDBC'] = true;
$config['needUrlRewrite'] = false;

$config['cacheOpen'] = false; // open memcached?
$config["mem_cached_cluster"][] = array(
    "host" => '127.0.0.1',
    "port" => '11211');
$config["key_prefix"] = $domain;
$config["cacheExpireTime"] = 3600;
$config["entityCacheOpen"] = false; // 如果打开各个系统都需要打开,否则会造成数据不一致
$config["entityCacheExpireTime"] = 7200;
$config["idListCacheOpen"] = true;
$config["idListCacheExpireTime"] = 600;

// 更新语句版本号检查
$config["update_need_check_version"] = true;

$config['debug'] = 'Dev1';
$config['debugkey'] = 'fcqx20170904';
$config['debug_ouput'] = 'web';
$config['debug_trace'] = false;
$config['debug_errlog'] = true;
$config['debug_logpath'] = ROOT_TOP_PATH . "/../xworklog/" . $domain;
$config['debug_sqllog_close'] = false;

$subsys_arr = array(
    'admin',
    'wx',
    'img');

foreach ($subsys_arr as $subsys) {
    $config["{$subsys}_uri"] = "{$http}://{$subsys}.{$domain}";
}

// 公众号或小应用
$config['wx_uri'] = "http://wx.{$domain}";

// 都用线上的图片库
$config['photo_uri'] = "https://photo.{$domain}";
$config['upload_uri'] = "http://123.56.0.27/upload";

// 图片存储本地路径
$config['xphoto_path'] = '/home/xdata/xphoto';

// 多个微信号统一token
$config['weixin_token'] = 'qwer0325';

// icp
$config['icp'] = '京ICP备15024348号';

// company
$config['company'] = '王永前门诊手术预约平台';
