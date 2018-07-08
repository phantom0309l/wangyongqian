<?php
/**
 * Created by PhpStorm.
 * User: hades
 * Date: 2018/1/22
 * Time: 13:35
 */

$page_title = "预约详情";
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

    .picBox {
        position: relative;

    }

    .picBox-item {
        width: 100px;
        height: 100px;
        border: 1px solid #ddd;
        float: left;
        display: inline-block;
        margin: 5px;
        text-align: center;
        vertical-align: middle;
        position: relative;
    }

    .picBox-item .deletepic-btn {
        color: #fff;
        background: #EF4F4F;
        font-size: 18px;
        width: 25px;
        height: 25px;
        border-radius: 20px;
        text-align: center;
        vertical-align: middle;
        position: absolute;
        left: 65px;
        top: 10px;
        z-index: 100;
        cursor: pointer;
    }

    .picBox-item .deletepic-btn .deletepic-btn-x {
        position: absolute;
        left: 8px;
        top: -1px;
    }

    .selectpic-btn {
        cursor: pointer;
    }

    .selectpic-btn .selectpic-btn-span {
        position: absolute;
        font-size: 70px;
        color: #ddd;
        left: 30px;
        top: -10px;
    }

    button.inline-btn {
        width: 45.19vw;
        display: inline-block;
    }

    .weui-btn-area {
        text-align: center;
    }

    .weui-btn + .weui-btn {
        margin-top: 0;
    }

</style>
<div class="page js_show CURRENT_TPL_NAME">
    <!--    分层的话，头部写在page__hd-->
    <div class="page__hd"></div>
    <!--    主要内容-->
    <div class="page__bd">
        <input type="hidden" name="scheduleid" value="<?= $schedule->id ?>">
        <input type="hidden" name="orderid" id="orderid" value="<?= $order->id ?>">

        <div class="weui-cells weui-cells_form info">
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">当前状态</label></div>
                <div class="weui-cell__bd">
                    <?= $order->getStatusDesc() ?>
                </div>
            </div>
        </div>

        <div class="weui-cells__title">预约信息</div>
        <div class="weui-cells weui-cells_form info">
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">门诊日期</label></div>
                <div class="weui-cell__bd">
                    <?php if ($order->thedate != $schedule->thedate) { ?>
                        已改约到 <?= $order->thedate ?>
                    <?php } else { ?>
                        <?= "{$schedule->thedate} {$schedule->getDowStr()} {$schedule->getDaypartStr()}" ?>
                    <?php } ?>
                </div>
            </div>
            <!--                <div class="weui-cell">-->
            <!--                    <div class="weui-cell__hd"><label class="weui-label">门诊类型</label></div>-->
            <!--                    <div class="weui-cell__bd">-->
            <!--                        --><? //= $schedule->getTkttypeStr() . '门诊' ?>
            <!--                    </div>-->
            <!--                </div>-->
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">门诊电话</label></div>
                <div class="weui-cell__bd">
                    <?= $schedule->scheduletpl->scheduletpl_mobile ?>
                </div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">门诊地点</label></div>
                <div class="weui-cell__bd">
                    <?= $schedule->getAddress() ?>
                </div>
            </div>
        </div>

        <div class="weui-cells__title">拟行手术方式</div>
        <div class="weui-cells weui-cells_checkbox">
            <div class="weui-cell">
                <div class="weui-cell__bd">
                    <?= nl2br($order->operationcategory) ?>
                </div>
            </div>
        </div>

        <div class="weui-cells__title">门诊面诊凭证</div>
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell">
                <div class="weui-cell__bd">
                    <div class="weui-uploader">
                        <!--                            <div class="weui-uploader__hd">-->
                        <!--                                <p class="weui-uploader__title">请上传门诊挂号条、医生所写门诊病历</p>-->
                        <!--                            </div>-->
                        <div class="weui-uploader__bd">
                            <ul class="weui-uploader__files" id="uploaderFiles">
                                <?php
                                $voucher_picture = $order->voucher_picture;
                                if ($voucher_picture) { ?>
                                    <li class="weui-uploader__file" style="background-image:url('<?= $voucher_picture->getSrc(100, 100, true) ?>')"
                                        data-objpictureid="<?= $voucher_picture->id ?>" data-picurl="<?= $voucher_picture->getSrc() ?>">
                                    </li>
                                <?php } ?>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="weui-cells__title">备注</div>
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell">
                <div class="weui-cell__bd">
                    <?= $order->remark ?>
                </div>
            </div>
        </div>
        <!-- 按钮 -->
        <div class="weui-btn-area">
            <?php if ($order->isStepConfirm()) { ?>
                <button class="weui-btn weui-btn_default inline-btn" onclick="confirm(0)">不能如约就诊</button>
                <button class="weui-btn weui-btn_primary inline-btn" onclick="confirm(1)">可如约就诊</button>
            <?php } elseif ($order->status == 1 && $order->isclosed == 0 && $order->patient_confirm_status == 0) { ?>
                <button class="weui-btn weui-btn_default" href="javascript:" onclick="cancel()">取消预约</button>
            <?php } ?>
        </div>
    </div>
    <!--    小尾巴-->
    <?php include_once($tpl . "/_common/_taskeasy.tpl.php"); ?>
</div>

<script>
    function confirm(status) {
        $.showLoading('正在提交');
        $.ajax({
            "type": "post",
            "data": {orderid: $('#orderid').val(), status: status},
            "dataType": "json",
            "url": '/order/confirmpostjson',
            "success": function (response) {
                $.hideLoading();
                if (response.errno === "0") {
                    window.location.reload();
                } else {
                    $.alert(response.errmsg);
                }
            },
            "error": function () {
                $.hideLoading();
                if (status === 'timeout') {
                    $.alert('请求超时');
                } else {
                    $.alert('提交失败');
                }
            }
        });
    }

    function cancel() {
        $.showLoading('正在取消');
        $.ajax({
            "type": "post",
            "data": {orderid: $('#orderid').val()},
            "dataType": "json",
            "url": '/order/cancelpostjson',
            "success": function (response) {
                $.hideLoading();
                if (response.errno === "0") {
                    fc.showMsgSuccess({
                        title: '取消成功'
                    });
                } else {
                    $.alert(response.errmsg);
                }
            },
            "error": function () {
                $.hideLoading();
                if (status === 'timeout') {
                    $.alert('请求超时');
                } else {
                    $.alert('提交失败');
                }
            }
        });
    }

    $(document).ready(function () {
        var app = {
            init: function () {
                var self = this;

                self.showPic();
            },
            showPic: function () {
                $(document).on("click", ".weui-uploader__file", function (e) {
                    var me = $(this);

                    var picurl = me.data('picurl');

                    var urls = [];

                    var items = me.parent();
                    items.find('li').each(function () {
                        urls.push($(this).data('picurl'));
                    })

                    wx.previewImage({
                        current: picurl, // 当前显示图片的http链接
                        urls: urls // 需要预览的图片http链接列表
                    });
                    return false;

                    // var objtype = items.data("objtype");
                    //
                    // var galleryImg = $("#" + objtype + "galleryImg");
                    // galleryImg.css('backgroundImage', 'url("")');
                    // galleryImg.parent().show();
                    //
                    // var picurl = me.data('picurl');
                    // galleryImg.css('backgroundImage', "url('" + picurl + "')");
                    //
                    // return false;
                })
            },
        };

        app.init();
    });

</script>

<?php include_once($tpl . "/_common/_footer.tpl.php"); ?>

