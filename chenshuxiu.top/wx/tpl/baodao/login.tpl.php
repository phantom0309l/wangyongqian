<?php
$page_title = '登录';
include_once($tpl . "/_common/_header.tpl.php");
?>
<link href="<?= $img_uri ?>/static/css/common.css?v=1.0" rel="stylesheet" type="text/css">
<link href="<?= $img_uri ?>/v5/page/wx/patient/baodao/baodao.css?v=2018072701" rel="stylesheet">
<script src='<?= $img_uri ?>/v5/common/pvlog.js?v=20171116'></script>
<script src='<?= $img_uri ?>/v5/common/base.js?v=20171116'></script>
<script src='<?= $img_uri ?>/v5/page/wx/patient/baodao/login.js?v=2018062802'></script>
<style>
</style>
<div class="page js_show baodaoimp">
    <form id="theform" method="post" action="/baodao/loginpost" style="margin-top: 0;">
        <input type="hidden" name="redirect_url" id="redirect_url" value="<?= $redirect_url ?>">
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell">
                <div class="weui-cell__hd">
                    <label class="weui-label">
                        手机号 <span style="color: red;">*</span>
                    </label>
                </div>
                <div class="weui-cell__bd weui-cell_primary">
                    <input class="text-color weui-input J_form_input J_form_input_must"
                           type="text"
                           id="mobile"
                           name="mobile"
                           value=""
                           placeholder="请输入手机号"
                           data-type="text"
                           data-ismust="1"
                           data-code="mobile"
                           data-name="手机号">
                </div>
            </div>

            <div class="weui-cell">
                <div class="weui-cell__hd">
                    <label class="weui-label">
                        密码 <span style="color: red;">*</span>
                    </label>
                </div>
                <div class="weui-cell__bd weui-cell_primary">
                    <input class="text-color weui-input J_form_input J_form_input_must"
                           type="password"
                           id="password"
                           name="password"
                           value=""
                           placeholder="请输入密码"
                           data-type="text"
                           data-ismust="1"
                           data-code="password"
                           data-name="密码">
                </div>
            </div>

        </div>

        <!-- 按钮 -->
        <div class="weui-btn-area">
            <a class="submit-btn weui-btn weui-btn_primary" href="javascript:">登录</a>
            <a class="baodao-btn weui-btn weui-btn_default" href="/baodao/baodao?redirect_url=<?= $redirect_url ?>">立即注册</a>
        </div>

        <!--    小尾巴-->
        <?php include_once($tpl . "/_common/_taskeasy.tpl.php"); ?>
    </form>
</div>

<script>
    $(function () {
    })
</script>
<?php include_once($tpl . "/_common/_footer.tpl.php"); ?>
