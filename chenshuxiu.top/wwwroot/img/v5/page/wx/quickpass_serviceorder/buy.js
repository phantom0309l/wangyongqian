$(document).ready(function () {
    var app = {
        init: function () {
            var self = this;

            self.submit();
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
                        $.showLoading();
                        // 获取有效期
                        $.ajax({
                            "type": "post",
                            "data": {type: 'quickpass'},
                            "dataType": "json",
                            "url": '/serviceorder/ajaxGetEndTime',
                            "success": function (response) {
                                $.hideLoading();
                                if (response.errno === '0') {
                                    var endtime = response.data.endtime;
                                    fc.showMsgSuccess({
                                        title: '支付成功',
                                        desc: '快速通行证有效期至' + endtime,
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
            $(".buy-btn").on('click', function () {
                var el = $('input[name="serviceproductid"]:checked');
                if (el === undefined || el === null || el.length === 0) {
                    $.alert('请选择购买时长');
                    return false;
                }

                $.showLoading('正在提交');

                var data = $('.J_form').serialize();
                $.ajax({
                    "type": "post",
                    "data": data,
                    "dataType": "json",
                    "url": '/serviceorder/prepayjson',
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
    }

    app.init();
});
