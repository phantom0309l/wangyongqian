<?php
include_once ($tpl . "/_header.tpl.php");
?>
<link href="<?=$img_uri?>/static/css/common.css?v=1.0" rel="stylesheet" type="text/css">
<script src='http://res.wx.qq.com/open/js/jweixin-1.0.0.js'></script>
<script src="<?=$img_uri?>/static/dist/js/mobiscroll.all.js"></script>
<script src='<?=$img_uri ?>/static/js/wx/baodao.js'></script>
<link href="<?=$img_uri?>/static/dist/css/mobiscroll.all.css" rel="stylesheet" type="text/css" />
<link href="<?=$img_uri ?>/static/css/wx/baodao.css" rel="stylesheet">
<style>
    .ta-l-c {
        text-align: center;
    }
    .submit-success-img {
        width: 150px;
    }
    .mg-t-60 {
        margin-top: 60px;
    }
</style>
<!-- <header class="title">
    <p style="font-size: 18px; margin: 10px;">报到成功</p>
</header>
-->
<div class="ta-l-c mg-t-60">
    <img class="submit-success-img" src="<?= $img_uri?>/static/img/baodao-submit-success.png"/>
</div>
<div style="text-align: center; color: #36b21a; margin-top: 20px">您已成功提交报到信息~</div>
<script type="text/javascript">
$(function(){
    setTimeout("WeixinJSBridge.call('closeWindow')", 3000);
});
</script>
