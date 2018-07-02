<!DOCTYPE html>
<html>
<head>
<META http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<meta content="yes" name="apple-mobile-web-app-capable" />
<meta content="black" name="apple-mobile-web-app-status-bar-style" />
<meta content="telephone=no" name="format-detection" />
<meta content="email=no" name="format-detection" />
<title><?=$wxshop->name ?></title>
<script src='<?= $img_uri ?>/static/js/jquery-1.11.1.min.js'></script>
<link href="<?= $img_uri ?>/static/css/wenzhen.css?201512261418" rel="stylesheet">
<style>
.notice{ margin:120px 0px 50px; text-align: center; font-size: 16px; color: #f66; line-height: 150%;}
body{ background: #f9efd5;}
</style>
</head>
<body>
    <div class="orange notice"><?= $noticestr ?></div>
    <script>
        $(function(){
            var closepage = <?= $closepage ? 1 : 0 ?>;
            var gourl = "<?= $gourl ?>";
            if( closepage ){
                setTimeout("WeixinJSBridge.call('closeWindow')", 2000);
            }else if( gourl ){
                setTimeout(function(){
                    window.location.href = gourl;
                }, 1000);
            }
        });
    </script>

<?php
include_once ($tpl . "/_illfooter.tpl.php");
?>
