$(document).ready(function () {
    var app = {
        canClick: true,
        init: function () {
            var self = this;
            self.handleSubmit();
            self.handleIsAgree();
            self.handleDisclaimer();

            self.initBaodaoData();
        },
        handleSubmit: function () {
            var self = this;
            $(".submit-btn").on("click", function () {

                if (!self.check()) {
                    return;
                }

                // 防止重复提交
                if (!self.canClick) {
                    return;
                }
                self.canClick = false;
                self.removeBaodaoData();
                $("#theform").submit();
            });
        },
        checkFunction: {
            checkIDCard: function (val) {
                var flag = true;
                var reg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
                if (val && !reg.test(val)) {
                    flag = false;
                }
                return flag;
            },
            checkMobile: function (val) {
                var flag = true;
                var reg = /^1[34578]\d{9}$/;
                if (val && !reg.test(val)) {
                    flag = false;
                }
                return flag;
            },
            checkFill: function (node) {
                var flag = true;
                var errorNode = node.parents(".weui_cell").next();
                if (node.val() == '' || node.val() == null) {
                    errorNode.show();
                    flag = false;
                } else {
                    errorNode.hide();
                }
                return flag;
            },
        },
        check: function () {
            var self = this,
                flag = true,
                message = '';

            // 必填项验证
            $('.J_form_input').each(function () {
                var me = $(this),
                    value = me.val(),
                    ismust = me.data('ismust'),
                    type = me.data('type'),
                    code = me.data('code');

                if (ismust === 1) {
                    if (value === undefined || value === '' || value === null ||   // 空值判断
                        (type === 'select' && (value === 0 || value === '0'))      // 下拉框判断
                    ) {
                        message = me.prop('placeholder');
                        if (!message) {
                            var name = me.data("name");
                            message = '请选择' + name;
                        }
                        return false;
                    }
                }

                if (code === 'prcrid' && value !== '' && !self.checkFunction.checkIDCard(value)) { //身份证号验证
                    message = "请输入正确的身份证号";
                    return false;
                } else if (code === 'mobile' && value !== '' && !self.checkFunction.checkMobile(value)) { //手机号验证
                    message = "请输入正确的手机号";
                    return false;
                }
            });

            if (message !== '') {
                $.alert(message);
                flag = false;
                return flag;
            }

            if (message !== '') {
                $.alert(message);
                flag = false;
            }

            return flag;
        },
        handleIsAgree: function () {
            $("#isagree").on("click", function () {
                $("#isagree").children().toggleClass("blue-box-selected");
                $("#isagree").toggleClass("isagree-checked");
                var disclaimerError = $(".disclaimerError");
                if ($("#isagree").hasClass("isagree-checked")) {
                    disclaimerError.hide();
                } else {
                    disclaimerError.show();
                }
            })
        },
        handleDisclaimer: function () {
            var self = this;
            $(".disclaimerLink").on("click", function (e) {
                e.preventDefault();
                self.setBaodaoData();
                window.location.href = $(this).attr("href");
            })
        },
        initBaodaoData: function () {
            var self = this;
            var data = self.getBaodaoData();
            $.each(data, function (k, v) {
                // 过滤掉diseaseid，因为肿瘤的option value有重复
                if (v == "" || k === 'diseaseid') {
                    return true;
                }
                var item = $("input[name='" + k + "'], select[name='" + k + "']");
                item.val(v);
            })
        },
        getBaodaoData: function () {
            var data = {};
            if (window.localStorage) {
                var baodaoData = window.localStorage.getItem("baodaoData");
                if (baodaoData) {
                    data = JSON.parse(baodaoData);
                }
            }
            return data;
        },
        setBaodaoData: function () {
            var self = this;
            var obj = self.getFormData();
            if (window.localStorage) {
                var baodaoData = JSON.stringify(obj);
                window.localStorage.setItem("baodaoData", baodaoData);
            }
        },
        removeBaodaoData: function () {
            if (window.localStorage) {
                var baodaoData = window.localStorage.getItem("baodaoData");
                if (baodaoData) {
                    window.localStorage.removeItem("baodaoData");
                }
            }
        },
        getFormData: function () {
            var obj = {};
            var items = $("#theform").find("input, select");
            items.each(function () {
                var me = $(this);
                var name = me.attr("name");
                if (name) {
                    obj[name] = me.val();
                }
            })
            return obj;
        },
        getWxShopid: function () {
            return $("#wxshopid").val();
        }
    };

    app.init();
});
