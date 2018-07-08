$(document).ready(function () {
    var app = {
        canClick: true,
        init: function () {
            var self = this;
            self.handleSubmit();
        },
        handleSubmit: function () {
            var self = this;
            $(".submit-btn").on("click", function () {

                if (!self.check()) {
                    return;
                }

                var password = $('#password').val();
                if (password.length < 6) {
                    $.alert('密码不能少于6位');
                    return;
                }

                // 防止重复提交
                if (!self.canClick) {
                    return;
                }
                $.showLoading('正在登录');
                $.ajax({
                    url: '/baodao/loginpost',
                    data: $('#theform').serialize(),
                    dataType: 'json',
                    type: 'post',
                    success: function (response) {
                        $.hideLoading();
                        if (response.errno === '0') {
                            self.canClick = false;

                            $.toast('登录成功');

                            var redirect_url = $('#redirect_url').val();
                            if (redirect_url !== '' && redirect_url !== null && redirect_url !== undefined) {
                                window.location.href = redirect_url;
                            } else {
                                fc.closeWxBroswer();
                            }
                        } else {
                            $.alert(response.errmsg);
                        }
                    },
                    error: function () {
                        $.hideLoading();
                        $.alert('请求失败');
                    }
                });
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
        getWxShopid: function () {
            return $("#wxshopid").val();
        }
    };

    app.init();
});
