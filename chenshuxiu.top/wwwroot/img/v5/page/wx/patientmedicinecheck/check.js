/**
 * Created by hades on 2017/9/25.
 */
$(document).ready(function () {
    var app = {
        changedSelectValue: null,
        untoward_effects: [
            {
                title: "腹泻",
                items: [
                    "排便次数比治疗前增加<4次/天；造瘘的便量轻度增加",
                    "较治疗前增加4-6次/天；需持续静脉输液<24小时；造瘘的便量中度增加",
                    "每天增加≥7次大便；便失禁；静脉输液≥24小时；需住院治疗；造瘘的便量明显增加，影响日常生活",
                    "危及生命（如血流动力学改变）",
                ]
            },
            {
                title: "皮肤",
                items: [
                    "无症状斑丘疹",
                    "斑丘疹/红斑伴瘙痒",
                    "严重全身性的红皮，或丘斑疹，疱疹；脱屑≥50%皮肤总表面积（BSA）",
                    "全身性的表皮脱落，溃疡或大疱性皮炎",
                ]
            },
            {
                title: "高血压",
                items: [
                    "收缩压在140-159mmHG，舒张压在90-99mmHG；需要医学干预；反复或持久的（≥24小时），有症状的收缩压大于20mmHG或既往正常范围增加大于140/90mmHG；需要单药治疗",
                    "收缩压≥160mmHG，舒张压≥100mmHG；需要医学干预；需要多种药物治疗",
                    "危及生命（如恶性高血压，一次性或持久性神经损伤，高血压危象）；需要紧急治疗",
                ]
            },
            {
                title: "甲沟炎",
                items: [
                    "甲褶水肿或红斑；角质层受损",
                    "需要局部治疗；口服药物治疗（例如：抗生素，抗真菌，抗病毒治疗）；甲褶水肿或痛性红斑；指甲脱落或指甲板分离；影响日常生活工具性活动",
                    "需要外科手术治疗或静脉给予抗生素治疗；影响个人日常生活活动",
                ]
            },
            {
                title: "结膜炎",
                items: [
                    "有症状；需要局部治疗（例如：抗生素治疗）；影响工具性日常生活活动",
                    "影响个人日常生活活动",
                ]
            },
            {
                title: "丙氨酸氨基转移酶（ALT）",
                items: [
                    "＞40且＜100U/L",
                    "≥100且＜800U/L",
                    "≥800U/L",
                ]
            },
            {
                title: "天门冬氨酸氨基转移酶（AST）",
                items: [
                    "＞35U/L且＜87.5",
                    "≥87.5且＜175",
                    "≥175且＜700",
                    "≥700",
                ]
            },
            {
                title: "尿蛋白",
                items: [
                    "（+）或＞0.15且≤1.0g/24h",
                    "（+-++）或＞1.0且≤3.5g/24h",
                    "（++）或＞3.5g/24h",
                    "肾病综合征",
                ]
            },
            {
                title: "口腔粘膜炎",
                items: [
                    "中度疼痛；不影响经口进食；需要调整饮食",
                    "重度疼痛；影响经口进食",
                    "危及生命；需要紧急治疗",
                ]
            },
        ],
        init: function () {
            var self = this;

            self.initUntowardEffectSelect();
            self.initTabBtn();
            self.initDrug();
            // self.initEvaluate();
        },
        initUntowardEffectSelect: function () {
            var self = this;
            var untoward_effect_box = $("#untoward_effect_box");

            for (var i = 0; i < self.untoward_effects.length; i++) {
                var untoward_effect = self.untoward_effects[i];

                var id = "J_untoward_effect_" + i;

                var cell = '<div class="weui-cell weui-cell_access">' +
                    '<div class="weui-cell__hd"><label for="name" class="weui-label text-content">' + untoward_effect.title + '</label></div>' +
                    '<div class="weui-cell__bd">' +
                    '<textarea id="' + id + '" class="weui-textarea text-title J_untoward_effect" data-title="' + untoward_effect.title + '" style="background-color: transparent; text-align: right;" placeholder="" rows="1"></textarea>' +
                    '</div>' +
                    '<div class="weui-cell__ft"></div>' +
                    '</div>';

                untoward_effect_box.append(cell);

                untoward_effect.onOpen = function () {
                    self.changedSelectValue = null;
                };

                untoward_effect.onChange = function () {
                    var textarea = this.$input[0];

                    $(textarea).css('height', "16px");

                    $(textarea).css('height', textarea.scrollHeight);

                    self.changedSelectValue = $(textarea).val();
                };

                untoward_effect.beforeClose = function () {
                    var textarea = this.$input[0];
                    // 这个主要是为了处理取消选择，因为点击按钮没有回调，都走统一的close
                    if (self.changedSelectValue === null) {
                        $(textarea).prop('value', '');
                        $(textarea).data('values', '');

                        $(textarea).css('height', "16px");
                    }
                };

                untoward_effect.closeText = "取消选择";
                $("#" + id).select(untoward_effect);
            }

            // 给cell绑定点击事件弹出select
            $(untoward_effect_box).on('click', '.weui-cell', function () {
                $(this).find('.weui-textarea').select("open");
            });
        },
        initTabBtn: function () {
            var self = this;

            $('.fix-bottom-button').on('click', function () {
                if (this.id == 'tab1_btn1') {
                    if ($('#J_drug_confirm').is(":checked") == false) {
                        var drug_content = $('.J_drug_content').val();
                        if (drug_content == '' || drug_content == null) {
                            $.alert("请填写实际用药情况");
                            return;
                        }
                    }
                    $('#nav_untoward_effect').click();
                } else if (this.id == 'tab2_btn1') {
                    $('#nav_drug').click();
                } else if (this.id == 'tab2_btn2') {
                    // $('#nav_evaluate').click();
                    self.submit();
                } else if (this.id == 'tab3_btn1') {
                    $('#nav_untoward_effect').click();
                } else if (this.id == 'tab3_btn2') {
                    self.submit();
                }
            })
        },
        initDrug: function () {
            $('#J_drug_confirm').on('change', function () {
                if ($(this).is(":checked")) {
                    $('.J_drug_content_box').hide();
                } else {
                    $('.J_drug_content_box').show();
                }
            })
        },
        initEvaluate: function () {
            $('#J_evaluate').on('change', function () {
                if ($(this).is(":checked")) {
                    $('.J_evaluate_ex').show();
                } else {
                    $('.J_evaluate_ex').hide();
                }
            })
        },
        submit: function () {
            var data = {};

            data.optaskid = optaskid;

            if ($('#J_drug_confirm').is(":checked") == false) {
                var drug_content = $('.J_drug_content').val();
                if (drug_content == '' || drug_content == null) {
                    $.alert("请填写实际用药情况");
                    return;
                }
                data.drug = {
                    'confirm': 0,
                    'content': drug_content
                };
            } else {
                data.drug = {
                    'confirm': 1,
                    'content': ''
                };
            }

            var untoward_effects = [];
            $('.J_untoward_effect').each(function () {
                var content = $(this).val();
                if (content != '' && content != null && content != undefined) {
                    untoward_effects.push({
                        'title': $(this).data('title'),
                        'content': content
                    })
                }
            });
            data.untoward_effects = untoward_effects;

            // if ($("#J_evaluate").is(":checked")) {
            //     var evaluate_thedate = $("#evaluate_thedate").val();
            //     if (evaluate_thedate == '' || evaluate_thedate == null) {
            //         $.alert("请选择评估日期");
            //         return;
            //     }
            //     data.evaluate = {
            //         "thedate": evaluate_thedate,
            //         "content": $("#evaluate_content").val()
            //     }
            // }

            $.showLoading();
            $.ajax({
                "type": "post",
                "data": data,
                "dataType": "json",
                "url": '/patientmedicinecheck/ajaxsubmit',
                "success": function (response) {
                    $.hideLoading();
                    if (response.errno == "0") {
                        fc.showMsgSuccess({
                            title: "提交成功",
                            desc: "感谢您的支持与配合，我们会尽快进行查看。如有问题我们会第一时间与您联系。"
                        });
                    } else {
                        $.alert(response.errmsg);
                    }
                },
                "error": function (data) {
                    $.hideLoading();
                }
            });
        }
    };
    app.init();
});