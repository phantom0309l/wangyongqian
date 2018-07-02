<!DOCTYPE html>
<html>
<head>
<META http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<meta content="yes" name="apple-mobile-web-app-capable" />
<meta content="black" name="apple-mobile-web-app-status-bar-style" />
<meta content="telephone=no" name="format-detection" />
<meta content="email=no" name="format-detection" />
<title><?= $wxshop->name ?></title>
<script src='<?=$img_uri ?>/static/js/jquery-1.11.1.min.js'></script>
<script src='<?=$img_uri ?>/static/js/vendor/jquery.ui.widget.js'></script>
<script src='<?=$img_uri ?>/static/js/vendor/jquery.iframe-transport.js'></script>
<script src='<?=$img_uri ?>/static/js/vendor/jquery.fileupload.js'></script>
<link rel="stylesheet" href="<?=$img_uri ?>/static/css/cpt_ax.css">
<script src='<?=$img_uri ?>/static/js/avalon.js'></script>
<link href="//libs.baidu.com/fontawesome/4.0.3/css/font-awesome.min.css" rel="stylesheet">
<link href="<?=$img_uri ?>/static/css/fbt.css" rel="stylesheet">
</head>
<body>
    <div id="topbar">
        <p id='lg'><?= $wxshop->id != 30 ? '王永前门诊手术预约' : '' ?></p>
    </div>
    <div id="main">
        <h3 id="pgtitle">ERROR</h3>
        <hr class="pgtline">
        <div id="topcmt">
            <p style='text-align: center; margin-top: 24px; margin-bottom: 100px; color: #777'><?php echo $errorMsg;?></p>
        </div>
    </div>
    <style type='text/css'>
.pagetail {
	color: #ccc;
	text-align: center;
	font-size: 13px;
	margin-bottom: 6px;
	margin-top: 24px;
}
</style>
    <div class='pagetail'>
        <p><?= $wxshop->id != 30 ? '© 王永前门诊手术预约' : '' ?></p>
    </div>
</body>
</html>
