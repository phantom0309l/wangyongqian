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
                        生日
                    </label>
                </div>
                <div class="weui-cell__bd weui-cell_primary">
                    <input class="text-color weui-input J_form_input"
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

            <div class="weui-cell">
                <div class="weui-cell__hd">
                    <label class="weui-label">
                        邮箱 <span style="color: red;">*</span>
                    </label>
                </div>
                <div class="weui-cell__bd weui-cell_primary">
                    <input class="text-color weui-input J_form_input J_form_input_must"
                           type="text"
                           id="email"
                           name="email"
                           value=""
                           placeholder="请输入邮箱"
                           data-type="text"
                           data-ismust="1"
                           data-code="email"
                           data-name="邮箱">
                </div>
            </div>

        </div>

        <!-- 协议 -->
        <!--        <div class="disclaimerBox">-->
        <!--            <div>-->
        <!--                <div id='isagree' class="blue-box">-->
        <!--                    <div class=""></div>-->
        <!--                </div>-->
        <!--                <span>我已阅读并同意</span><a href="/baodao/disclaimer" class="disclaimerLink">《项目入组知情同意书》</a>-->
        <!--            </div>-->
        <!--            <div class="disclaimerError none">请您勾选服务协议</div>-->
        <!--        </div>-->

        <!-- 按钮 -->
        <div class="weui-btn-area">
            <a class="submit-btn weui-btn weui-btn_primary" href="javascript:">提交</a>
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
    })
</script>
<?php include_once($tpl . "/_common/_footer.tpl.php"); ?>
