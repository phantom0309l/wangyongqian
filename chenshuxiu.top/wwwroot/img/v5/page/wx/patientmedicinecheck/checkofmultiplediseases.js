$(document).ready(function () {
    var app = {
        init: function () {
            var self = this;

            self.selectFile();
            self.deletePic();
            self.showPic();

            $('#inconformity_btn').on('click', function () {
                $.modal({
                    title: "",
                    text: '<ul class="tip-ul">' +
                    '<li style="margin: 0 0 0 15px;">如果在此期间医生给您调整了用药，请点击【医嘱变更】</li>' +
                    '<li style="margin: 0 0 0 15px;">如果您的服药情况与医嘱不同，请点击【错服漏服】</li>' +
                    '</ul>',
                    buttons: [
                        {
                            text: "医嘱变更",
                            className: "fc-text_primary",
                            onClick: function () {
                                fc.showPopup($('#popup1'));
                            }
                        },
                        {
                            text: "错服漏服",
                            className: "fc-text_primary",
                            onClick: function () {
                                fc.showPopup($('#popup2'));
                            }
                        },
                        {
                            text: "取消",
                            className: "default",
                            onClick: function () {

                            }
                        },
                    ]
                });
            });

            $(".J_form").submit(function () {
                let type = $(this).data('type');

                if ("doctor_advice_change" === type) {
                    let picBoxs = $(".weui-uploader__files");
                    let picnum = picBoxs.data("picnum");
                    let must = picBoxs.data("must");

                    let advice_change_content = $('#advice_change_content').val();
                    if ((must == 1 && picnum == 0) && (advice_change_content === '' || advice_change_content === null || advice_change_content === undefined)) {	// 是否必填
                        $.alert('请填写用药医嘱 或 上传用药医嘱照片');
                        return false;
                    }
                } else if ("wrong_drug" === type) {
                    let drug_content = $("#drug_content").val();
                    if (drug_content === '' || drug_content === null || drug_content === undefined) {
                        $.alert("请填写错服/漏服情况");
                        return false;
                    }
                }

                $.showLoading();

                let data = $(this).serialize();
                $.ajax({
                    "type": "post",
                    "data": data,
                    "dataType": "json",
                    "url": '/patientmedicinecheck/ajaxSubmitOfMultipleDiseases',
                    "success": function (response) {
                        $.hideLoading();
                        if (response.errno == "0") {
                            fc.showMsgSuccess({
                                title: "提交成功",
                                delay: 2000,
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

                return false;
            });
        },
        selectFile: function () {
            var self = this;
            $(document).on("click", ".J_uploader", function (e) {
                e.preventDefault();
                var picBox = $(this).parent().prev();
                var patientmedicinecheckid = $("#patientmedicinecheckid").val();
                fc.weixin.chooseImage(function (media_id) {
                    $.showLoading();
                    $.ajax({
                        type: "post",
                        url: '/patientmedicinecheck/createpic',
                        data: {
                            'media_id': media_id,
                            'patientmedicinecheckid': patientmedicinecheckid,
                        },
                        dataType: "json",
                        success: function (response) {
                            $.hideLoading();
                            if (response.errno == "0") {
                                var data = response.data;
                                var thumb_url = data.thumb_url;
                                var picurl = data.url;
                                var objpictureid = data.objpictureid;
                                var picdiv = '<li class="weui-uploader__file" style="width: 60px; height:60px; background-image:url(' + thumb_url + ')"  data-objpictureid="' + objpictureid + '" data-picurl="' + picurl + '"> <input type="hidden" class="J_uploader__file" name="imgfiles[]" value="' + objpictureid + '" /> <div class="deletepic-btn"><span class="deletepic-btn-x">x</span> </div> </li>'
                                picBox.append(picdiv);

                                var picnum = picBox.data("picnum");
                                picBox.data("picnum", picnum + 1);
                            } else {
                                $.alert(response.errmsg);
                            }
                        },
                        error: function (error, status) {
                            console.error(error);
                            console.log('ajax error');
                            $.hideLoading();
                            if (status === 'timeout') {
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
                    var url = "/patientmedicinecheck/deletepic";

                    var objpictureid = item.data('objpictureid');

                    $.ajax({
                        "type": "get",
                        "data": {
                            'objpictureid': objpictureid,
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
            $(document).on("click", ".weui-uploader__file", function () {
                var me = $(this);

                var picurl = me.data('picurl');

                var urls = [];

                var items = me.parent();
                items.find('li').each(function () {
                    urls.push($(this).data('picurl'));
                });

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
