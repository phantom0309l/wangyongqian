<?php
$page_title = '报到';
include_once($tpl . "/_common/_header.tpl.php");
?>
<link href="<?= $img_uri ?>/static/css/common.css?v=1.0" rel="stylesheet" type="text/css">
<link href="<?= $img_uri ?>/v5/page/wx/patient/baodao/baodao.css?v=2018072701" rel="stylesheet">
<script src='<?= $img_uri ?>/v5/common/pvlog.js?v=20171116'></script>
<script src='<?= $img_uri ?>/v5/common/base.js?v=20171116'></script>
<script src='<?= $img_uri ?>/v5/page/wx/patient/baodao/baodao.js?v=2018062802'></script>
<style>
</style>
<div class="page js_show baodaoimp">
    <form id="theform" method="post" action="/baodao/addpost" style="margin-top: 0;">
        <input type="hidden" name="doctorid" value="<?= $doctor->id ?>">
        <input type="hidden" name="redirect_url" id="redirect_url" value="<?= $redirect_url ?>">
        <div class="weui-cells__title">基本信息</div>
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell">
                <div class="weui-cell__hd">
                    <label class="weui-label">
                        姓名 <span style="color: red;">*</span>
                    </label>
                </div>
                <div class="weui-cell__bd weui-cell_primary">
                    <input class="text-color weui-input J_form_input J_form_input_must"
                           type="text"
                           id="name"
                           name="name"
                           value=""
                           placeholder="请输入姓名"
                           data-type="text"
                           data-ismust="1"
                           data-code="name"
                           data-name="姓名">
                </div>
            </div>

            <div class="weui-cell weui-cell_select weui-cell_select-after">
                <div class="weui-cell__hd">
                    <label for="" class="weui-label">
                        性别 <span style="color: red;">*</span>
                    </label>
                </div>
                <div class="weui-cell__bd weui-cell_primary">
                    <select class="weui-select J_form_input J_form_input_must" name="sex"
                            data-type="select"
                            data-ismust="1"
                            data-code="sex"
                            data-name="性别">
                        <option value="1">男</option>
                        <option value="2">女</option>
                    </select>
                </div>
            </div>

            <div class="weui-cell">
                <div class="weui-cell__hd">
                    <label class="weui-label">
                        生日 <span style="color: red;">*</span>
                    </label>
                </div>
                <div class="weui-cell__bd weui-cell_primary">
                    <input class="text-color weui-input J_form_input J_form_input_must"
                           type="text"
                           id="birthday"
                           name="birthday"
                           value=""
                           readonly
                           placeholder="请选择生日"
                           data-type="text"
                           data-ismust="0"
                           data-code="birthday"
                           data-name="生日">
                </div>
            </div>
        </div>

        <div class="weui-cells__title">我们会通过您预留的联系方式与您确认具体手术事项</div>
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell">
                <div class="weui-cell__hd">
                    <label class="weui-label">
                        手机号 <span style="color: red;">*</span>
                    </label>
                </div>
                <div class="weui-cell__bd weui-cell_primary">
                    <input class="text-color weui-input J_form_input J_form_input_must"
                           type="number"
                           id="mobile"
                           name="mobile"
                           value=""
                           placeholder="请输入手机号"
                           data-type="number"
                           data-ismust="1"
                           data-code="mobile"
                           data-name="手机号">
                </div>
            </div>

<!--            <div class="weui-cell">-->
<!--                <div class="weui-cell__hd">-->
<!--                    <label class="weui-label">-->
<!--                        邮箱 <span style="color: red;">*</span>-->
<!--                    </label>-->
<!--                </div>-->
<!--                <div class="weui-cell__bd weui-cell_primary">-->
<!--                    <input class="text-color weui-input J_form_input J_form_input_must"-->
<!--                           type="text"-->
<!--                           id="email"-->
<!--                           name="email"-->
<!--                           value=""-->
<!--                           placeholder="请输入邮箱"-->
<!--                           data-type="text"-->
<!--                           data-ismust="1"-->
<!--                           data-code="email"-->
<!--                           data-name="邮箱">-->
<!--                </div>-->
<!--            </div>-->

<!--            <div class="weui-cell weui-cell_vcode">-->
<!--                <div class="weui-cell__hd">-->
<!--                    <label class="weui-label">验证码 <span style="color: red;">*</span></label>-->
<!--                </div>-->
<!--                <div class="weui-cell__bd">-->
<!--                    <input class="weui-input J_form_input J_form_input_must"-->
<!--                           type="text"-->
<!--                           id="code"-->
<!--                           name="code"-->
<!--                           value=""-->
<!--                           placeholder="请输入验证码"-->
<!--                           data-type="text"-->
<!--                           data-ismust="1"-->
<!--                           data-code="code"-->
<!--                           data-name="验证码">-->
<!--                </div>-->
<!--                <div class="weui-cell__ft">-->
<!--                    <a class="weui-vcode-btn J_get_code">获取验证码</a>-->
<!--                </div>-->
<!--            </div>-->

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
            <a class="submit-btn weui-btn weui-btn_primary" href="javascript:">提交</a>
            <a class="login-btn weui-btn weui-btn_default" href="/baodao/login?redirect_url=<?= $redirect_url ?>">已有账号，立即登录</a>
        </div>

        <!--    小尾巴-->
        <?php include_once($tpl . "/_common/_taskeasy.tpl.php"); ?>
    </form>
</div>

<script>
    $(function () {
        $("#birthday").on('click', function () {
            setTimeout(function () {
                $('.weui-mask').addClass('weui-mask--visible');
            }, 10);
            var defaultValue = [1990, 5, 15];

            if ($(this).val() !== '') {
                defaultValue = $(this).val().split('-');
            }
            weui.datePicker({
                id: 'birthday',
                start: 1900,
                end: new Date().getFullYear(),
                defaultValue: defaultValue,
                onChange: function (result) {
                },
                onConfirm: function (result) {
                    $("#birthday").val(result.join('-'));
                }
            });
        });

        $('.J_get_code').on('click', function () {
            var me = $(this);
            var email = $('#email').val();

            if (me.attr('disabled')) {
                return false;
            }

            var reg = /^((([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})[; ,])*(([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})))$/;
            if (!reg.test(email)) {
                alert('请输入正确的邮箱地址');
                return false;
            }

            $.showLoading();
            $.ajax({
                url: '/emailcode/sendcode',
                data: {email: email},
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    $.hideLoading();
                    if (response.errno === '0') {
                        $.alert('验证码已发送，请登录邮箱查看验证码');

                        me.attr('disabled', true);
                        var countdown = 60;
                        var timer = setInterval(function () {
                            if (countdown === 0) {
                                me.attr('disabled', false);
                                me.text("获取验证码");
                                countdown = 60;
                                clearInterval(timer);
                            } else {
                                countdown--;
                                me.text(countdown + 's');
                            }
                        }, 1000);
                    } else {
                        $.alert(response.errmsg);
                    }
                },
                error: function () {
                    $.hideLoading();
                    $.alert('请求失败');
                }
            })
        })
    })
</script>
<?php include_once($tpl . "/_common/_footer.tpl.php"); ?>
