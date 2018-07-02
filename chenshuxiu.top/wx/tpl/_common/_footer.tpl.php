<?php
/**
 * Created by PhpStorm.
 * User: hades
 * Date: 2017/9/25
 * Time: 13:21
 */
?>
</div>

<!-- fastclick-->
<script src="<?= $img_uri ?>/static/js/vendor/fastclick.js"></script>
<!---->
<script src="<?= $img_uri ?>/v5/lib/jquery-weui.min.js"></script>

<script>
    // 用于调用微信JSSDK
    var wx_jssdk_config = <?= $wx_jssdk_config ?>;
    $(function () {
        // 初始化微信JSSDK
        fc.weixin.init(wx_jssdk_config);

        FastClick.attach(document.body);
    })
</script>

</body>
</html>
