<!DOCTYPE html>
<html>
<head>
    <META http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <meta content="yes" name="apple-mobile-web-app-capable"/>
    <meta content="black" name="apple-mobile-web-app-status-bar-style"/>
    <meta content="telephone=no" name="format-detection"/>
    <meta content="email=no" name="format-detection"/>
    <title><?= $errorTitle ?></title>
    <link rel="stylesheet" href="<?= $img_uri ?>/static/css/cpt_ax.css">
    <link href="<?= $img_uri ?>/static/css/fbt.css" rel="stylesheet">
    <style type='text/css'>
        .pagetail {
            color: #ccc;
            text-align: center;
            font-size: 13px;
            margin-bottom: 6px;
            margin-top: 24px;
        }

        .msg {
            text-align: center;
            margin-top: 24px;
            margin-bottom: 100px;
            color: #777
        }

        #lg {
            background-color: #4472c5;
        }

        #main {
            position: relative;
            margin-top: 48px;
            padding: 15px;
            width: auto;
            margin-left: 0;
        }

        .pgtline {
            border: none;
            border-bottom: 1px solid #ddd;
            width: 30%;
            margin-left: 35%;
            margin-top: 15px;
        }
    </style>
</head>
<body>
<div id="topbar">
    <p id='lg'><?= $wxshop->id != 30 ? '王永前门诊手术预约' : '' ?></p>
</div>
<div id="main">
<!--    <h3 id="pgtitle">出错了</h3>-->
<!--    <hr class="pgtline">-->
    <div id="topcmt">
        <p class="msg"><?= $errorMsg; ?></p>
    </div>
</div>
<div class='pagetail'>
    <p>© 王永前门诊手术预约</p>
</div>
</body>
</html>