<?php
/**
 * Created by PhpStorm.
 * User: hades
 * Date: 2017/9/25
 * Time: 13:00
 */
?>
<!DOCTYPE html>
<html lang="zh-cmn-Hans">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!--    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>-->
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0,viewport-fit=cover">
    <meta name="x5-fullscreen" content="true">
    <meta name="full-screen" content="yes">
    <meta content="yes" name="apple-mobile-web-app-capable"/>
    <meta content="black" name="apple-mobile-web-app-status-bar-style"/>
    <meta content="telephone=no" name="format-detection"/>
    <meta content="email=no" name="format-detection"/>

    <title><?= $page_title ?></title>

    <!-- jQuery-weui-->
    <!--    <link rel="stylesheet" href="//cdn.bootcss.com/weui/1.1.2/style/weui.min.css">-->
    <!--    <link rel="stylesheet" href="//cdn.bootcss.com/jquery-weui/1.2.0/css/jquery-weui.min.css">-->
    <link rel="stylesheet" href="<?= $img_uri ?>/v5/lib/weui-1.1.2.min.css">
    <link rel="stylesheet" href="<?= $img_uri ?>/v5/lib/jquery-weui.min.css">

    <link href="<?= $img_uri ?>/v5/page/wx/base.css?ver=2018062701" rel="stylesheet" type="text/css">

    <script src="<?= $img_uri ?>/static/js/jquery-2.1.4.min.js"></script>

    <script src='http://res.wx.qq.com/open/js/jweixin-1.2.0.js'></script>

    <!--    微信的组件和jq weui的样式冲突
    保留一下，怕还有其他冲突。
    -->
    <?php if (0) { ?>
        <link rel="stylesheet" href="<?= $img_uri ?>/v5/lib/weui-1.1.2.css?ver=2018011801">
    <?php } ?>
    <script src="<?= $img_uri ?>/v5/lib/weui.min.js?ver=2018011801"></script>

    <script src="<?= $img_uri ?>/v5/page/wx/base.js?ver=2018012901"></script>

    <style>
        .pagetail {
            color: #999;
            text-align: center;
            font-size: 13px;
            margin-bottom: 15px;
            margin-top: 15px;
        }
    </style>
</head>
<body ontouchstart>
<div class="container" id="container">
