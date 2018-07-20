/**
 * Created by hades on 2017/11/20.
 */

var fc = {
    init: function() {
        var self = this;

        self._init_Date();
        self._init_popup();
    },
    _init_Date: function () {
        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1,
                "D+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S": this.getMilliseconds()
            };
            if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    },
    _init_popup: function () {
        var self = this;
        $(document).on('click', '.closepopup', function () {
            self.closePopup($(this).parents('.weui-popup__modal'));
        });
    },
    updateUrl: function (url, key) {
        var key = (key || 't') + '=';  //默认是"t"
        var reg = new RegExp(key + '\\d+');  //正则：t=1472286066028
        var timestamp = +new Date();
        if (url.indexOf(key) > -1) { //有时间戳，直接更新
            return url.replace(reg, key + timestamp);
        } else {  //没有时间戳，加上时间戳
            if (url.indexOf('\?') > -1) {
                var urlArr = url.split('\?');
                if (urlArr[1]) {
                    return urlArr[0] + '?' + key + timestamp + '&' + urlArr[1];
                } else {
                    return urlArr[0] + '?' + key + timestamp;
                }
            } else {
                if (url.indexOf('#') > -1) {
                    return url.split('#')[0] + '?' + key + timestamp + location.hash;
                } else {
                    return url + '?' + key + timestamp;
                }
            }
        }
    },
    weixin: {
        init(parameter, jsapilist, debug) {
            var defaults = {
                appId: '', // 必填，公众号的唯一标识
                timestamp: '', // 必填，生成签名的时间戳
                nonceStr: '', // 必填，生成签名的随机串
                signature: ''
            };

            var options = $.extend({}, defaults, parameter);

            jsapilist = jsapilist || ['chooseImage', 'uploadImage', 'downloadImage', 'previewImage'];

            debug = debug || false;
            wx.config({
                debug: debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: options.appId, // 必填，公众号的唯一标识
                timestamp: options.timestamp, // 必填，生成签名的时间戳
                nonceStr: options.nonceStr, // 必填，生成签名的随机串
                signature: options.signature, // 必填，签名，见附录1
                jsApiList: jsapilist // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

            wx.ready(function () {

            });

            wx.error(function (res) {
                console.log(res);
                $.alert("页面出错了");
            });
        },
        chooseImage: function (callback) {
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    localIds.forEach(function (value, index, array) {
                        wx.uploadImage({
                            localId: value, // 需要上传的图片的本地ID，由chooseImage接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function (res) {
                                var serverId = res.serverId; // 返回图片的服务器端ID
                                callback(serverId);
                            }, fail: function (error) {
                                $.alert("上传图片失败");
                            }
                        });
                    })
                }, fail: function (error) {
                    $.alert("获取本地图片失败");
                }
            })
        },
    },
    // 显示弹出窗口
    showPopup: function (target) {
        var el = $(target);
        el.removeClass('slideOutUp');
        el.addClass('js_show');
        el.addClass('slideInUp');
        setTimeout(function () {
            el.removeClass('slideOutUp');
        }, 300);
    },
    // 关闭弹出窗口
    closePopup: function (target) {
        var el = $(target);
        el.removeClass('slideInUp');
        el.addClass('slideOutUp');
        setTimeout(function () {
            el.removeClass('slideOutUp');
            el.removeClass('js_show');
        }, 500);
    },
    // 弹出成功窗口
    showMsgSuccess: function (parameter) {
        var self = this;

        var defaults = {
            title: "操作成功",  // 标题
            desc: "",   // 描述
            delay: 0,   // 延时关闭，单位ms
            z_index: 2, // z-index，
            container: null // 目标容器，默认为body
        };

        var options = $.extend({}, defaults, parameter);

        var msg_success = $(
            '<div id="fc_msg_success" class="page msg_success">' +
            '<div class="weui-msg">' +
            '<div class="weui-msg__icon-area"><i class="weui-icon-success weui-icon_msg"></i></div>' +
            '<div class="weui-msg__text-area">' +
            '<h2 class="weui-msg__title J_msg_title">' + options.title + '</h2>' +
            '<p class="weui-msg__desc J_msg_desc">' + options.desc + '</p>' +
            '</div>' +
            '<div class="weui-msg__opr-area">' +
            '<p class="weui-btn-area">' +
            '<a onclick="fc.closeWxBroswer()" class="weui-btn weui-btn_primary">返回微信</a>' +
            '</p>' +
            '</div>' +
            '<div class="weui-msg__extra-area">' +
            '<div class="weui-footer">' +
            '<p class="weui-footer__links">' +
            '<!-- <a href="javascript:void(0);" class="weui-footer__link"><?= $wxshop->name ?></a> -->' +
            '</p>' +
            '<p class="weui-footer__text"></p>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>');

        if (options.container != undefined && options.container != null) {
            options.container.append(msg_success);
        } else {
            $('body').append(msg_success);
        }

        msg_success.addClass('js_show');
        msg_success.addClass('slideInRight');
        msg_success.css('z-index', options.z_index);

        if (options.delay != undefined && options.delay != null && options.delay > 0) {
            self.closeWxBroswer(options.delay);
        }
    },
    // 关闭微信浏览器
    closeWxBroswer: function (delay) {
        if (delay != undefined && delay != null && delay > 0) {
            setTimeout(function () {
                WeixinJSBridge.call('closeWindow');
            }, delay);
        } else {
            WeixinJSBridge.call('closeWindow');
        }
    }
};

$(function () {
    fc.init();
});