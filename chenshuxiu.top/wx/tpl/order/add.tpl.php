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

    .weui-uploader__file {
        width: 77px;
        height: 77px;
        background-color: #eee;
    }

    .deletepic-btn {
        position: absolute;
        right: 3px;
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
                    <label class="weui-cell weui-check__label" for="p<?= $operationcategory->id ?>"
                           onclick="showSubs(<?= $operationcategory->id ?>)">
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
                    <div class="pull-30-l subs" id="subs-<?= $operationcategory->id ?>" style="display: none">
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
    function showSubs(id) {
        if ($('#p' + id).prop('checked')) {
            $('#subs-' + id).show();
        } else {
            $('#subs-' + id).hide();
        }
    }

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
                        fc.showMsgSuccess({
                            title: '预约成功，等待审核'
                        });
                        // $.alert(response.errmsg, function () {
                        //     //点击确认后的回调函数
                        //     // window.location.reload();
                        // });
                    } else if (response.errno === "3001") {
                        window.location.href = '/order/one?orderid=' + response.data.orderid;
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
    });

    $(document).ready(function () {
        var app = {
            init: function () {
                var self = this;

                self.selectFile();
                self.deletePic();
                self.showPic();
            },
            selectFile: function () {
                var self = this;
                $(document).on("click", "#uploaderInput", function (e) {
                    e.preventDefault();
                    var picBox = $(this).parent().prev();
                    var objtype = $(this).data("objtype");
                    fc.weixin.chooseImage(function (media_id) {
                        $.showLoading();
                        $.ajax({
                            type: "post",
                            url: '/order/createpic',
                            data: {
                                'media_id': media_id,
                                'bedtktid': self.bedtktid,
                                'objtype': objtype,
                            },
                            dataType: "json",
                            success: function (response) {
                                $.hideLoading();
                                if (response.errno == "0") {
                                    var data = response.data;
                                    var thumb_url = data.thumb_url;
                                    var picurl = data.url;
                                    var objpictureid = data.objpictureid;
                                    var picdiv = '<li class="weui-uploader__file" style="background-image:url(' + thumb_url + ')"  data-objpictureid="' + objpictureid + '" data-picurl="' + picurl + '"> <input type="hidden" name="voucher_pictureid" value="' + objpictureid + '"> <div class="deletepic-btn"><i class="weui-icon-cancel"></i></div> </li>'
                                    // picBox.append(picdiv);
                                    picBox.html(picdiv);

                                    // var picnum = picBox.data("picnum");
                                    // picBox.data("picnum", picnum + 1);
                                } else {
                                    $.alert(response.errmsg);
                                }
                            },
                            error: function (error, status) {
                                console.log('ajax error');
                                $.hideLoading();
                                if (status == 'timeout') {
                                    $.alert('获取远程图片超时');
                                } else {
                                    $.alert('获取远程图片失败');
                                }
                            }
                        });
                    });
                    return false;
                })
            },
            deletePic: function () {
                $(document).on("click", ".weui-uploader__file .deletepic-btn", function (e) {
                    var me = $(this);
                    $.confirm("确定要删除吗?", function () {
                        $.showLoading();

                        var item = me.parent();

                        var items = item.parent();
                        var objtype = items.data("objtype");
                        var url = "/order/deletepic";

                        var objpictureid = item.data('objpictureid');

                        $.ajax({
                            "type": "get",
                            "data": {
                                'objpictureid': objpictureid,
                                'objtype': objtype,
                            },
                            "dataType": "json",
                            "url": url,
                            "success": function (response) {
                                $.hideLoading();
                                if (response.errno == "0") {
                                    item.remove();
                                    var picnum = items.data("picnum");
                                    items.data("picnum", picnum - 1);
                                } else {
                                    $.alert(response.errmsg);
                                }
                            },
                            "error": function (data) {
                                $.hideLoading();
                            }
                        });
                    }, function () {
                        //取消操作
                    });

                    return false;
                })
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

