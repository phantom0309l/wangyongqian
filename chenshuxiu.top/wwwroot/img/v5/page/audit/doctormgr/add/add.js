/*
 *  Document   : base_forms_validation.js
 *  Author     : pixelcave
 *  Description: Custom JS code used in Form Validation Page
 */

var DoctorAddValidation = function() {
    // Init Bootstrap Forms Validation, for more examples you can check out https://github.com/jzaefferer/jquery-validation
    var initValidationBootstrap = function(){//{{{
        jQuery('.js-validation-bootstrap').validate({
            errorClass: 'help-block animated fadeInDown',
            errorElement: 'div',
            errorPlacement: function(error, e) {
                jQuery(e).parents('.form-group > div').append(error);
            },
            highlight: function(e) {
                jQuery(e).closest('.form-group').removeClass('has-error').addClass('has-error');
                jQuery(e).closest('.help-block').remove();
            },
            success: function(e) {
                jQuery(e).closest('.form-group').removeClass('has-error');
                jQuery(e).closest('.help-block').remove();
            },
            rules: {
                'name': {
                    required: true,
                    maxlength: 15
                },
                'title': {
                    required: false
                },
                'hospitalid': {
                    required: true
                },
                'diseaseid': {
                    required: true
                },
                'username': {
                    required: true
                },
                'status': {
                    required: false
                },
                'auditorid_yunying': {
                    required: true,
                    min: 1
                },
                'auditorid_market': {
                    required: true,
                    min: 1
                }
            },
            messages: {
                'name': {
                    required: '请输入医生姓名',
                    maxlength: '最大长度不能超过15个字符',
                },
                'title': '请输入职称',
                'hospitalid': {
                    required: '请选择医院',
                },
                'diseaseid': {
                    required: '请选择疾病',
                },
                'username': '请输入登录名',
                'auditorid_yunying': {
                    required: '请选择运营负责人',
                    min: '请选择运营负责人',
                },
                'auditorid_market': {
                    required: '请选择市场负责人',
                    min: '请选择市场负责人',
                },
            }
        });
    };//}}}

    return {
        init: function () {
            // Init Bootstrap Forms Validation
            initValidationBootstrap();
        }
    };
}();

// Initialize when page loads
jQuery(function(){ DoctorAddValidation.init(); });
