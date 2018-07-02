$(document).ready(function () {
    var app = {
        bedtktid: 0,
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
                var eleId = $(this).attr('id');
                if (eleId == 'want_date' || eleId == 'shoushuriqi') {
                    var msgStr = eleId == 'want_date' ? '入住日期' : '手术日期';
                    var dateVal = $(this).val();
                    var date = new Date();
                    var dateNow = date.Format('YYYY-MM-DD');
                    if (dateVal < dateNow) {
                        //$.alert(msgStr + '错误,请重新填写(预约日期应在本日之后)');
                        return;
                    }
                }
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
                var objtype = $(this).data("objtype");
                fc.weixin.chooseImage(function (media_id) {
                    $.showLoading();
                    $.ajax({
                        type: "post",
                        url: '/bedtkt/createpic',
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
                                var picdiv = '<li class="weui-uploader__file" style="background-image:url(' + thumb_url + ')"  data-objpictureid="' + objpictureid + '" data-picurl="' + picurl + '"> <div class="deletepic-btn"><span class="deletepic-btn-x">x</span> </div> </li>'
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
                var me = $(this);
                $.confirm("确定要删除吗?", function() {
                    $.showLoading();

                    var item = me.parent();

                    var items = item.parent();
                    var objtype = items.data("objtype");
                    var url = "/bedtkt/deletepic";

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
        submitBedTkt: function () {
            var self = this;
            $(document).on("click", "#subtmitBedTkt", function () {

                //#5110验证手术日期和入住日期不能为过去的时间 
                var want_date = $('#want_date').val();
                var shoushu_date = $('#shoushuriqi').val();
                var date = new Date();
                var dateNow = date.Format('YYYY-MM-DD');
                if (want_date < dateNow) {
                    $(this).val('');
                    $.alert('入住日期错误,请重新填写(预约日期应在今日之后)');
                    return;
                }
                if (shoushu_date < dateNow) {
                    $(this).val('');
                    $.alert('手术日期错误,请重新填写(预约日期应在今日之后)');
                    return;
                }

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

                if (message !== '') {
                    $.alert(message);
                    return;
                }

                var inputs = $(".J_form_input");
                inputs.each(function () {
                    var must = $(this).data("must");
                    var value = $(this).val();
                    if (must == 1 && (value === '' || value === null)) {	// 是否必填
                        message = $(this).prop('placeholder');
                        if (!message) {
                            var title = $(this).data("title");
                            message = '请选择' + title;
                        }
                        return false;
                    }
                });

                if (message !== '') {
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
