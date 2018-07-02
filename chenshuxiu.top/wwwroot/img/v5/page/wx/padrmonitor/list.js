$(document).ready(function () {
    var app = {
        init: function () {
            var self = this;

            self.selectFile();
            self.deletePic();
            self.showPic();

            $('.collapse').on('click', function () {
                var me = this;

                $('.collapse').each(function () {
                    if (me != this) {
                        self.collapseClose(this);
                    }
                });

                if ($(me).hasClass("collapse_close")) {
                    self.collapseClose(me);
                } else {
                    self.collapseOpen(me);
                }
            });

            $(".J_form").submit(function () {
                var check_date = $(this).find("input[name='check_date']");
                var check_date_val = check_date.val();

                var date = new Date(check_date_val);
                var now = new Date();

                if (check_date_val === '' || check_date_val === null || check_date_val === undefined) {
                    $.alert(check_date.attr("placeholder"));
                    return false;
                } else if (date > now) {
                    $.alert("请选择正确的检查日期");
                    return false;
                }

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
                    "url": '/padrmonitor/ajaxsubmit',
                    "success": function (response) {
                        $.hideLoading();
                        if (response.errno == "0") {
                            $.alert(response.errmsg, function () {
                                //点击确认后的回调函数
                                window.location.reload();
                            });
                        } else {
                            $.alert(response.errmsg);
                        }
                    },
                    "error": function (data) {
                        $.hideLoading();
                        if (status == 'timeout') {
                            $.alert('请求超时');
                        } else {
                            $.alert('提交失败');
                        }
                    }
                });

                return false;
            });

        },
        collapseClose: function (item) {
            var parent = $(item).parent();
            var height = $(item).outerHeight();
            $(item).removeClass("collapse_close");
            $(item).addClass("collapse_open");
            parent.height(height);
        },
        collapseOpen: function (item) {
            var parent = $(item).parent();
            var height = $(item).outerHeight();
            $(item).removeClass("collapse_open");
            $(item).addClass("collapse_close");

            height += parent.find('.J_form').outerHeight(true);
            parent.height(height);
        },
        selectFile: function () {
            var self = this;
            $(document).on("click", ".J_uploader", function (e) {
                e.preventDefault();
                var picBox = $(this).parent().prev();
                var padrmonitorid = $(this).data("padrmonitorid");
                fc.weixin.chooseImage(function (media_id) {
                    $.showLoading();
                    $.ajax({
                        type: "post",
                        url: '/padrmonitor/createpic',
                        data: {
                            'media_id': media_id,
                            'padrmonitorid': padrmonitorid,
                        },
                        dataType: "json",
                        success: function (response) {
                            $.hideLoading();
                            if (response.errno == "0") {
                                var data = response.data;
                                var thumb_url = data.thumb_url;
                                var picurl = data.url;
                                var objpictureid = data.objpictureid;
                                var picdiv = '<li class="weui-uploader__file" style="width: 60px; height:60px; background-image:url(' + thumb_url + ')"  data-objpictureid="' + objpictureid + '" data-picurl="' + picurl + '"><input type="hidden" class="J_uploader__file" name="imgfiles[]" value="' + objpictureid + '" /><div class="deletepic-btn"><span class="deletepic-btn-x">x</span></div></li>'
                                picBox.append(picdiv);

                                var picnum = picBox.data("picnum");
                                picBox.data("picnum", picnum + 1);

                                self.collapseOpen(picBox.parents(".monitor-item").find(".collapse"));
                            } else {
                                $.alert(response.errmsg);
                            }
                        },
                        error: function (error, status) {
                            console.error(error);
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
            var self = this;
            $(document).on("click", ".weui-uploader__file .deletepic-btn", function (e) {
                var me = $(this);
                $.confirm("确定要删除吗?", function () {
                    $.showLoading();

                    var item = me.parent();

                    var picBox = item.parent();
                    var ename = picBox.data("ename");
                    var url = "/padrmonitor/deletepic";

                    var objpictureid = item.data('objpictureid');

                    $.ajax({
                        "type": "post",
                        "data": {
                            'objpictureid': objpictureid,
                            'ename': ename,
                        },
                        "dataType": "json",
                        "url": url,
                        "success": function (response) {
                            $.hideLoading();
                            if (response.errno == "0") {
                                item.remove();
                                var picnum = picBox.data("picnum");
                                picBox.data("picnum", picnum - 1);

                                self.collapseOpen(picBox.parents(".monitor-item").find(".collapse"));
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
    };

    app.init();

});
