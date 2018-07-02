$(document).ready(function () {
    var app = {
        init: function () {
            var self = this;

            self.submit();
            self.selectFile();
            self.deletePic();
            self.showPic();
        },
        //调用微信JS api 支付
        jsApiCall: function (obj) {
            $.hideLoading();
            var jsApiParameters = obj.jsApiParameters;
            var fangcun_trade_no = obj.fangcun_trade_no;
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                jsApiParameters,
                function (res) {
                    console.log(res);
                    if (res.err_msg === 'get_brand_wcpay_request:ok') {
                        fc.showMsgSuccess({
                            title: '支付完成',
                            desc: '请保持电话和网络通畅，稍后会有专人通过微信或电话与你联系。',
                        });
                    } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {  // 支付取消
                        $.toast("支付取消", "text");
                    } else {
                        $.alert('支付失败');
                    }
                }
            );
        },
        callpay: function (obj) {
            var self = this;
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', function () {
                        self.jsApiCall(obj)
                    }, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', function () {
                        self.jsApiCall(obj)
                    });
                    document.attachEvent('onWeixinJSBridgeReady', function () {
                        self.jsApiCall(obj)
                    });
                }
            } else {
                self.jsApiCall(obj);
            }
        },
        submit: function () {
            var self = this;
            $(".submit-btn").on('click', function () {
                var content = $('#content').val();
                if (content === '' || content === null || content === undefined) {	// 是否必填
                    $.alert('请填写要咨询的问题');
                    return false;
                }

                $.showLoading('正在提交');

                var data = $('.J_form').serialize();
                $.ajax({
                    "type": "post",
                    "data": data,
                    "dataType": "json",
                    "url": '/quickconsultorder/prepayjson',
                    "success": function (response) {
                        $.hideLoading();
                        if (response.errno === '0') {
                            var fangcun_err_msg = response.data.fangcun_err_msg;
                            if (fangcun_err_msg) {
                                $.alert(fangcun_err_msg);
                            } else {
                                $.showLoading('正在发起支付');
                                self.callpay(response.data);
                            }
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
                var quickconsultorderid = $("#quickconsultorderid").val();
                fc.weixin.chooseImage(function (media_id) {
                    $.showLoading();
                    $.ajax({
                        type: "post",
                        url: '/quickconsultorder/createpic',
                        data: {
                            'media_id': media_id,
                            'quickconsultorderid': quickconsultorderid,
                        },
                        dataType: "json",
                        success: function (response) {
                            $.hideLoading();
                            if (response.errno == "0") {
                                var data = response.data;
                                var thumb_url = data.thumb_url;
                                var picurl = data.url;
                                var objpictureid = data.objpictureid;
                                var picdiv = '<li class="weui-uploader__file" style="width: 77px; height:77px; background-image:url(' + thumb_url + ')"  data-objpictureid="' + objpictureid + '" data-picurl="' + picurl + '"><input type="hidden" class="J_uploader__file" name="imgfiles[]" value="' + objpictureid + '" /><div class="deletepic-btn"><i class="deletepic-btn-x"></i></div></li>'
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
                    var url = "/quickconsultorder/deletepic";

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
    }

    app.init();
});
