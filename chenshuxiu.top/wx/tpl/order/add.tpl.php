<?php
/**
 * Created by PhpStorm.
 * User: hades
 * Date: 2018/1/22
 * Time: 13:35
 */

$page_title = "预约手术";
include_once($tpl . "/_common/_header.tpl.php");
?>
<style>
    .subs {
        padding-left: 30px;
        /*background-color: #e9ecf1;*/
    }

    .info label {
        width: 80px;
        color: #999;
    }
</style>
<div class="page js_show CURRENT_TPL_NAME">
    <!--    分层的话，头部写在page__hd-->
    <div class="page__hd"></div>
    <!--    主要内容-->
    <div class="page__bd">
        <form id="form" onsubmit="return false;">
            <input type="hidden" name="scheduleid" value="<?= $schedule->id ?>">
            <div class="weui-cells__title">门诊信息</div>
            <div class="weui-cells weui-cells_form info">
                <div class="weui-cell">
                    <div class="weui-cell__hd"><label class="weui-label">门诊日期</label></div>
                    <div class="weui-cell__bd">
                        <?= "{$schedule->thedate} {$schedule->getDowStr()} {$schedule->getDaypartStr()}" ?>
                    </div>
                </div>
                <div class="weui-cell">
                    <div class="weui-cell__hd"><label class="weui-label">门诊类型</label></div>
                    <div class="weui-cell__bd">
                        <?= $schedule->getTkttypeStr() . '门诊' ?>
                    </div>
                </div>
                <div class="weui-cell">
                    <div class="weui-cell__hd"><label class="weui-label">电话</label></div>
                    <div class="weui-cell__bd">
                        <?= $schedule->scheduletpl->scheduletpl_mobile ?>
                    </div>
                </div>
                <div class="weui-cell">
                    <div class="weui-cell__hd"><label class="weui-label">地点</label></div>
                    <div class="weui-cell__bd">
                        <?= $schedule->getAddress() ?>
                    </div>
                </div>
            </div>

            <div class="weui-cells__title">个人信息</div>
            <div class="weui-cells weui-cells_form info">
                <div class="weui-cell">
                    <div class="weui-cell__hd"><label class="weui-label">姓名</label></div>
                    <div class="weui-cell__bd">
                        <?= $mypatient->name ?>
                    </div>
                </div>
                <div class="weui-cell">
                    <div class="weui-cell__hd"><label class="weui-label">性别</label></div>
                    <div class="weui-cell__bd">
                        <?= $mypatient->getSexStr() ?>
                    </div>
                </div>
                <div class="weui-cell">
                    <div class="weui-cell__hd"><label class="weui-label">手机号</label></div>
                    <div class="weui-cell__bd">
                        <?= $mypatient->mobile ?>
                    </div>
                </div>
                <div class="weui-cell">
                    <div class="weui-cell__hd"><label class="weui-label">邮箱</label></div>
                    <div class="weui-cell__bd">
                        <?= $mypatient->email ?>
                    </div>
                </div>
            </div>

            <div class="weui-cells__title">拟行手术方式</div>
            <div class="weui-cells weui-cells_checkbox">
                <?php foreach ($operationcategorys as $operationcategory) { ?>
                    <div>
                        <label class="weui-cell weui-check__label" for="p<?= $operationcategory->id ?>">
                            <div class="weui-cell__hd">
                                <input type="checkbox" class="weui-check parent" name="category_parents[]"
                                       id="p<?= $operationcategory->id ?>"
                                       value="<?= $operationcategory->title ?>"
                                >
                                <i class="weui-icon-checked"></i>
                            </div>
                            <div class="weui-cell__bd">
                                <p><?= $operationcategory->title ?></p>
                            </div>
                        </label>
                        <div class="pull-30-l subs">
                            <?php
                            $subs = $operationcategory->getSubs();
                            foreach ($subs as $sub) { ?>
                                <label class="weui-cell weui-check__label" for="s<?= $sub->id ?>">
                                    <div class="weui-cell__hd">
                                        <input type="checkbox" class="weui-check sub" name="category_childrens[<?= $operationcategory->title ?>][]"
                                               id="s<?= $sub->id ?>"
                                               value="<?= $sub->title ?>"
                                        >
                                        <i class="weui-icon-checked"></i>
                                    </div>
                                    <div class="weui-cell__bd">
                                        <p><?= $sub->title ?></p>
                                    </div>
                                </label>
                            <?php } ?>
                        </div>
                    </div>
                <?php } ?>
            </div>

            <div class="weui-cells__title">门诊面诊凭证</div>
            <div class="weui-cells weui-cells_form">
                <div class="weui-cell">
                    <div class="weui-cell__bd">
                        <div class="weui-uploader">
                            <div class="weui-uploader__hd">
                                <p class="weui-uploader__title">请上传门诊挂号条、医生所写门诊病历</p>
                            </div>
                            <div class="weui-uploader__bd">
                                <ul class="weui-uploader__files" id="uploaderFiles">
                                </ul>
                                <div class="weui-uploader__input-box">
                                    <input id="uploaderInput" class="weui-uploader__input" type="file" accept="image/*" multiple="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="weui-cells__title">备注</div>
            <div class="weui-cells weui-cells_form">
                <div class="weui-cell">
                    <div class="weui-cell__bd">
                        <textarea class="weui-textarea" name="remark" placeholder="如有特殊需求，请输入备注" rows="3"></textarea>
                    </div>
                </div>
            </div>
            <!-- 按钮 -->
            <div class="weui-btn-area">
                <button type="submit" class="submit-btn weui-btn weui-btn_primary" href="javascript:">提交</button>
            </div>
        </form>
    </div>
    <!--    小尾巴-->
    <?php include_once($tpl . "/_common/_taskeasy.tpl.php"); ?>
</div>

<script>
    $(function () {
        $("#form").submit(function () {
            var picBoxs = $(this).find(".weui-uploader__files");
            var picnum = picBoxs.data("picnum");
            var must = picBoxs.data("must");
            if (must == 1 && picnum == 0) {	// 是否必填
                var title = picBoxs.data("title");
                $.alert("请上传" + title);
                return false;
            }

            $.showLoading();

            var data = $(this).serialize();
            $.ajax({
                "type": "post",
                "data": data,
                "dataType": "json",
                "url": '/order/addpostjson',
                "success": function (response) {
                    $.hideLoading();
                    if (response.errno === "0") {
                        $.alert(response.errmsg, function () {
                            //点击确认后的回调函数
                            // window.location.reload();
                        });
                    } else if (response.errno === "3001") {
                        window.location.href = '/order/list';
                    } else {
                        $.alert(response.errmsg);
                    }
                },
                "error": function (data) {
                    $.hideLoading();
                    if (status === 'timeout') {
                        $.alert('请求超时');
                    } else {
                        $.alert('提交失败');
                    }
                }
            });

            return false;
        });
    })
</script>

<?php include_once($tpl . "/_common/_footer.tpl.php"); ?>

