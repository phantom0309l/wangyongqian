$(document).ready(function () {
    var app = {
        init: function () {
            var self = this;

            self.selectFile();
            self.deletePic();
            self.showPic();

            self.saveInfo();
            self.submitBedTkt();

            self.bedtktid = $("#bedtktid").val();

        },
        saveInfo: function () {
            var self = this;
            $(document).on("change", ".J_form_async_input", function () {
                $.showLoading();
                var me = this;

                var name = $(me).prop('name');
                var value = $(me).val();
                var data = {
                    'bedtktid': self.bedtktid,
                };
                data[name] = value;
                $.ajax({
                    "type": "get",
                    "data": data,
                    "dataType": "json",
                    "url": '/bedtkt/savebedtktinfo',
                    "success": function (response) {
                        $.hideLoading();
                    },
                    "error": function (data) {
                        $.hideLoading();
                    }
                });
            })
        },
        selectFile: function () {
            var self = this;
            $(document).on("click", ".J_uploader", function (e) {
                e.preventDefault();
                var picBox = $(this).parent().prev();
                var patientcollectionid = $("#patientcollectionid").val();
                fc.weixin.chooseImage(function (media_id) {
                    $.showLoading();
                    $.ajax({
                        type: "post",
                        url: '/patientcollection/createBasicpicturejson',
                        data: {
                            'patientcollectionid': patientcollectionid,
                            'media_id': media_id
                        },
                        dataType: "json",
                        success: function (response) {
                            $.hideLoading();
                            console.log(response);
                            if (response.errno == "0") {
                                var data = response.data;
                                var thumb_url = data.thumb_url;
                                var picurl = data.url;
                                var objpictureid = data.objpictureid;
                                var picdiv = '<li class="weui-uploader__file" style="background-image:url(' + thumb_url + ')"  data-objpictureid="' + objpictureid + '" data-picurl="' + picurl + '"> <div class="deletepic-btn"><span class="deletepic-btn-x">x</span></div><input class="picturedata" style="display:none" type="text" name="basicpictureids[]" value="' + objpictureid + '"/></li>'
                                picBox.append(picdiv);

                                var picnum = picBox.data("picnum");
                                picBox.data("picnum", picnum + 1);
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
                console.log('deletePic');
                var me = $(this);
                $.confirm("确定要删除吗?", function() {
                    $.showLoading();

                    var item = me.parent();
                    console.log('item', item);

                    var items = item.parent();
                    console.log('xxxx');
                    console.log('items', items);
                    var patientcollectionid = items.data("patientcollectionid");
                    var url = "/patientcollection/deletebasicpicturejson";

                    var objpictureid = item.data('objpictureid');

                    $.ajax({
                        "type": "get",
                        "data": {
                            'basicpictureid': objpictureid,
                            'patientcollectionid': patientcollectionid,
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

            })
        },
        submitBedTkt: function () {
            var self = this;
            $(document).on("tap", "#subtmitBedTkt", function () {
                var message = '';
                var bedtktid = $("#bedtktid").val();
                if (bedtktid == 0) {
                    message = '提交失败';
                }

                var picBoxs = $(".weui-uploader__files");
                picBoxs.each(function () {
                    var picnum = $(this).data("picnum");
                    var must = $(this).data("must");
                    if (must == 1 && picnum == 0) {	// 是否必填
                        var title = $(this).data("title");
                        message = '请上传' + title;
                        return false;
                    }
                });

                if (message != '') {
                    $.alert(message);
                    return;
                }

                var inputs = $(".J_form_input");
                inputs.each(function () {
                    var must = $(this).data("must");
                    if (must == 1 && '' == $(this).val()) {	// 是否必填
                        message = $(this).prop('placeholder');
                        if (!message) {
                            var title = $(this).data("title");
                            message = '请选择' + title;
                        }
                        return false;
                    }
                });

                if (message != '') {
                    $.alert(message);
                    return;
                }

                $.showLoading();
                $("#subtmitBedTkt-form").submit();

                return false;
            })
        },
    };

    app.init();

});
