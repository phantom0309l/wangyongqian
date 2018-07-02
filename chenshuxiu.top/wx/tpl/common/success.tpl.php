<?php
/**
 * Created by PhpStorm.
 * User: hades
 * Date: 2017/9/27
 * Time: 13:19
 */

$page_title = $wxshop->name;
include_once($tpl . "/_common/_header.tpl.php");
?>
<div class="page msg_success js_show">
    <div class="weui-msg">
        <div class="weui-msg__icon-area"><i class="weui-icon-success weui-icon_msg"></i></div>
        <div class="weui-msg__text-area">
            <h2 class="weui-msg__title"><?= $title ?></h2>
            <p class="weui-msg__desc"><?= $desc ?></p>
        </div>
        <div class="weui-msg__opr-area">
            <p class="weui-btn-area">
                <a href="javascript:WeixinJSBridge.call('closeWindow');" class="weui-btn weui-btn_primary">返回微信</a>
                <!--                <a href="javascript:;" class="weui-btn weui-btn_default">辅助操作</a>-->
            </p>
        </div>
        <div class="weui-msg__extra-area">
            <div class="weui-footer">
                <p class="weui-footer__links">
<!--                    <a href="javascript:void(0);" class="weui-footer__link">--><?//= $wxshop->name ?><!--</a>-->
                </p>
                <p class="weui-footer__text"></p>
            </div>
        </div>
    </div>
</div>
<script>
    $(function () {
        setTimeout("WeixinJSBridge.call('closeWindow')", 2000);
    });
</script>
<?php
include_once($tpl . "/_common/_footer.tpl.php"); ?>

