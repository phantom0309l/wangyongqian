$(function () {
    var listOfAuditor = {
        init: function () {
            var self = this;
            self.today = $('#wq-time').val();
            self.date = $('#wq-time').val();
            self.auditorId = $('#hide_auditor_id').val();
            this.initQuestion();
            this.clickAuditorItem();
            this.changeLaydate();
            this.initWorkEfficiency(self.auditorId);
            this.initCheckItem();
            this.initLaydate();
            this.clickCheckButton();
            this.submitCheck();
            this.changeLaydateOfBeforeAndAfter();
            this.initWorkQuality(self.auditorId, 0, self.date);

        },
        initPieEchart: function (optask_list_data, cdrmeeting_list_data) {
            //以下代码为EChart控件代码，
            // 路径配置
            require.config({
                paths: {
                    echarts: "https://img.fangcunyisheng.com/v5/plugin/echarts"
                }
            });

            // 使用
            require(
                [
                    'echarts',
                    'echarts/chart/pie',
                    'echarts/chart/funnel'
                ],
                function (ec) {
                    var pie_optask_list = {
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'horizontal',
                            x: 'left',
                            y: 'bottom',
                            orient: 'horizontal',
                            data: optask_list_data
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: {show: true},
                                dataView: {show: true, readOnly: false},
                                magicType: {
                                    show: true,
                                    type: ['pie', 'funnel'],
                                    option: {
                                        funnel: {
                                            x: '25%',
                                            width: '50%',
                                            funnelAlign: 'left',
                                            max: 1548
                                        }
                                    }
                                },
                                restore: {show: true},
                                saveAsImage: {show: true}
                            }
                        },
                        calculable: true,
                        series: [
                            {
                                name: '关闭任务总数',
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '30%'],
                                data: optask_list_data
                            }
                        ]
                    };

                    var pie_cdrmeeting_list = {
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'horizontal',
                            x: 'left',
                            y: 'bottom',
                            orient: 'horizontal',
                            data: cdrmeeting_list_data
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: {show: true},
                                dataView: {show: true, readOnly: false},
                                magicType: {
                                    show: true,
                                    type: ['pie', 'funnel'],
                                    option: {
                                        funnel: {
                                            x: '25%',
                                            width: '50%',
                                            funnelAlign: 'left',
                                            max: 1548
                                        }
                                    }
                                },
                                restore: {show: true},
                                saveAsImage: {show: true}
                            }
                        },
                        calculable: true,
                        series: [
                            {
                                name: '呼叫接通的通话时长',
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '30%'],
                                data: cdrmeeting_list_data
                            }
                        ]

                    };

                    var optask_list = ec.init(document.getElementById('optask_list'));
                    var cdrmeeting_out_list = ec.init(document.getElementById('cdrmeeting_out_list'));

                    optask_list.setOption(pie_optask_list);
                    cdrmeeting_out_list.setOption(pie_cdrmeeting_list);
                }
            );
        },

        initBarEchart: function (optack_quality_data, date) {
            //以下代码为EChart控件代码，
            // 路径配置
            require.config({
                paths: {
                    echarts: "https://img.fangcunyisheng.com/v5/plugin/echarts"
                }
            });

            // 使用
            require(
                [
                    'echarts/echarts',
                    'echarts/chart/bar',
                    'echarts/chart/line',
                ],
                function (ec) {
                    var bar_optack_quality_list = {
                        title: {
                            text: '周质量整体概况（' + date + '）',
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: {show: true},
                                dataView: {show: true, readOnly: false},
                                magicType: {show: true, type: ['line', 'bar']},
                                restore: {show: true},
                                saveAsImage: {show: true}
                            }
                        },
                        calculable: true,
                        xAxis: [
                            {
                                type: 'category',
                                data: optack_quality_data.name
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: '周质量整体概况',
                                type: 'bar',
                                barWidth: 30,//柱图宽度
                                barMaxWidth: 30,//最大宽度
                                data: optack_quality_data.value,

                            }
                        ]
                    };
                    var wq_bar_box = ec.init(document.getElementById('wq-bar-box'));
                    wq_bar_box.setOption(bar_optack_quality_list);
                }
            );
        },

        initWorkEfficiency: function (auditor_id, start_time, end_time) {
            var self = this;
            $.ajax({
                url: '/optaskcheckmgr/getworkefficiencyjson',
                type: 'post',
                data: {
                    'auditor_id': auditor_id,
                    'startTime': start_time,
                    'endTime': end_time
                },
                dataType: 'json',
                success: function (response) {
                    $('.optask_cnt').children('span').html(response.optask.cnt);
                    $('.cdrmeeting_cnt_list').find('.cnt_call_out span').html(response.cdrMeeting.cntOfCallOut);
                    $('.cdrmeeting_cnt_list').find('.cnt_call_out_succ span').html(response.cdrMeeting.cntOfCallOutSucc);
                    $('.cdrmeeting_cnt_list').find('.avg_call_out span').html(response.cdrMeeting.avgOfCallOut);
                    $('.cdrmeeting_cnt_list').find('.cnt_call_in span').html(response.cdrMeeting.cntOfCallInSucc);
                    $('.cdrmeeting_cnt_list').find('.avg_call_in span').html(response.cdrMeeting.avgOfCallIn);
                    $('.cdrmeeting_cnt_list').find('.last_meeting span').html(response.cdrMeeting.lastMeetingTime);
                    $('.push_msg_list').find('.cnt span').html(response.pushMsg.cntPushMsg);
                    $('.push_msg_list').find('.last_msg span').html(response.pushMsg.lastPushMsgTime);

                    $('.optask_list , .cdrmeeting_out_list').show();

                    self.initPieEchart(response.optask.list, response.cdrMeeting.list);

                    laydate.render({
                        elem: '.we-time-slot',
                        range: true,
                        btns: ['clear', 'confirm'],
                        value: response.startTime + ' - ' + response.endTime
                    });
                }
            });
        },

        initCheckContent: function (auditor_id, optaskcheck_id, offset) {
            var self = this;
            $.ajax({
                url: '/optaskchecktplmgr/oneoptaskcheckhtml?auditor_id' + auditor_id + '&optaskcheck_id=' + optaskcheck_id,
                type: 'get',
                data: {
                    'auditor_id': auditor_id,
                    'optaskcheck_id': optaskcheck_id
                },
                dataType: 'html',
                success: function (response) {
                    $('#check-box').html(response);
                    setTimeout(function () {
                        $('.showOptask:eq(' + offset + ')').trigger('click');
                        $('.showPatientOneHtml:eq(' + offset + ')').trigger('click');
                    }, 0);
                }
            });
        },

        initWorkQuality: function (auditor_id, offset, time, is_now) {
            var self = this;
            $.ajax({
                url: '/optaskcheckmgr/getqualityjson?auditor_id=' + auditor_id + '&time=' + time + '&isnow='+ is_now,
                type: 'get',
                dataType: 'json',
                success: function (response) {
                    $('#check-item-list').html('');
                    var time = response.date.weekStart + '  -  ' + response.date.weekEnd;

                    if (response.errno == 1) {
                        var item = null;
                        var patientid = 0;
                        var optaskcheck_id = 0;
                        for (var key in response.data) {
                            item = response.data[key];
                            if (key == 0) {
                                patientid = item.patientId;
                                optaskcheck_id = item.optaskCheckId;
                            }

                            $('#showOptask').data('patientid', patientid);
                            self.appendHtml('check-item-list', item, key);
                        }
                        self.initBarEchart(response.qualityOpTaskCheckCnt, time);
                        setTimeout(function () {
                            self.initCheckContent(auditor_id, optaskcheck_id, offset);
                        }, 0);
                    } else if (response.errno == 0) {
                        $('#check-box').html('');
                        self.initBarEchart(response.qualityOpTaskCheckCnt, time);
                    }
                    self.date = response.date.now;
                    laydate.render({
                        elem: '#wq-time',
                        btns: ['clear', 'confirm'],
                        value: response.date.now
                    });
                    if(!self.diffDate(response.date.now)){
                        $('.time_after').hide();
                    }else {
                        $('.time_after').show();
                    }
                }
            });
        },

        clickAuditorItem: function () {
            var self = this;
            $(document).on('click', '.auditor-item', function () {
                $(this).addClass('active-item');
                $(this).siblings('.auditor-item').removeClass('active-item');
                var auditor_id = $(this).data('auditor-id');
                self.auditorId = auditor_id;
                $('#hide_auditor_id').val(auditor_id);
                self.initWorkEfficiency(auditor_id);
                self.initWorkQuality(auditor_id, 0, self.today);

                laydate.render({
                    elem: '#wq-time',
                    btns: ['clear', 'confirm'],
                    value: self.today
                });
            });
        },

        initCheckItem: function () {
            var self = this;
            $(document).on('mouseenter', '.check-item', function () {
                $(this).siblings('.check-item').find('div.optask-t').hide();
                $(this).find('div.optask-t').show();
                var width_all = $(document).width();
                var width_left = $(this).offset().left;
                if (width_left > 400 && width_all - width_left < 400) {
                    $(this).find('div.optask-t').css('left', '-300px');
                } else if (width_left < 400 && width_all - width_left < 400) {
                    $(this).find('div.optask-t').css('left', '0px');
                }
            });

            $(document).on('mouseleave', '.check-item', function () {
                $(this).find('div.optask-t').hide();
            });

            $(document).on('click', '.check-item', function () {
                $(this).siblings('.check-item').removeClass('check-item-active');
                $(this).addClass('check-item-active');
            });
        },

        changeLaydate: function () {
            var self = this;
            laydate.render({
                elem: '.we-time-slot',
                range: true,
                btns: ['clear', 'confirm'],
                change: function (value, date, endDate) {
                    date = date.year + '-' + date.month + '-' + date.date;
                    endDate = endDate.year + '-' + endDate.month + '-' + endDate.date;
                    var dateUnix = Date.parse(new Date(date));
                    var endDateUnix = Date.parse(new Date(endDate));

                    if ((endDateUnix + 3600 * 24) - dateUnix > 31 * 86400 * 1000) {
                        alert('抱歉！选择的时间跨度不能超过31天');
                        $('span[lay-type="confirm"]').hide();
                    } else {
                        $('span[lay-type="confirm"]').show();
                    }
                },
                done: function (value, date, endDate) {
                    date = date.year + '-' + date.month + '-' + date.date + ' 00:00:00';
                    endDate = endDate.year + '-' + endDate.month + '-' + endDate.date + ' 00:00:00';
                    var auditor_id = $('.auditor-item.active-item').attr('data-auditor-id');
                    self.initWorkEfficiency(auditor_id, date, endDate);
                }
            });

            laydate.render({
                elem: '.we-time-slot',
                btns: ['clear', 'confirm'],
                value: ''
            });
        },

        initLaydate: function () {
            var self = this;
            laydate.render({
                elem: '#wq-time',
                btns: ['clear', 'confirm'],
                done: function (value, date) {
                    date = date.year + '-' + date.month + '-' + date.date;
                    var auditor_id = $('.auditor-item.active-item').attr('data-auditor-id');
                    self.date = date;
                    self.initWorkQuality(auditor_id, 0, date);
                }
            });

            laydate.render({
                elem: '#wq-time',
                btns: ['clear', 'confirm'],
                value: ''
            });
        },

        clickCheckButton: function () {
            $(document).on('click', '.question-list .question-item input[type="button"]', function () {
                var index = $(this).data('index');

                $(this).siblings('input[type="hidden"]').val($(this).attr('id'));
                if (index == 1) {
                    $(this).siblings('input[type="button"]').removeClass('btn-danger').removeClass('btn-info').removeClass('btn-warning');
                    $(this).addClass('btn-success');
                } else if (index == 2) {
                    $(this).siblings('input[type="button"]').removeClass('btn-success').removeClass('btn-info').removeClass('btn-warning');
                    $(this).addClass('btn-danger');
                } else if (index == 3) {
                    $(this).siblings('input[type="button"]').removeClass('btn-success').removeClass('btn-danger').removeClass('btn-warning');
                    $(this).addClass('btn-info');
                }
            });
        },

        submitCheck: function () {
            var self = this;
            $(document).on('submit', 'form[name="optaskCheckForm"]', function (e) {
                e.preventDefault();
                $("#btn-submit").attr('disabled',true);
                var optask_check_id = $('#optask_check_id').val();
                var inputs = $('.question-list .question-item input[type="hidden"]');
                var isSend = true;
                inputs.each(function (key) {
                    if ($(this).val() == '0') {
                        isSend = false;
                        alert('请选择完整');
                        $("#btn-submit").attr('disabled',false);
                        return false;
                    }
                });

                if (isSend) {
                    var data = decodeURI($('form[name="optaskCheckForm"]').serialize());
                    $.ajax({
                        url: '/optaskcheckmgr/checkpost',
                        type: 'post',
                        data: data,
                        success: function (response) {
                            var index = $('.check-item-active').data('index');
                            self.initWorkQuality(self.auditorId, index, self.date);
                        }
                    })
                }
            })
        },

        appendHtml: function (domId, data, index) {
            var str = '<div class="check-item showOptask showPatientOneHtml col-xs-1 block draggable-item block-content block-content-full"  data-check-id="' + data.optaskCheckId + '" data-patientid="' + data.patientId + '" data-index="' + index + '">' +
                '<div style="position: relative;">';
            if (data.is_checked == 1) {
                str +=  '<i class="fa fa-bookmark-o fa-2x" style=""></i>';
            }else {
                str +=  '<i class="fa fa-bookmark-o fa-2x none"></i>';
            }

            str += '   <p class="patient-name">' +
                '        <span>' + data.patientName + '</span>' +
                '   </p>' +
                '   <p class="optask-name" style="height:45px;overflow: hidden;">' +
                '        <span>' + data.optaskTplTitle + '</span>' +
                '   </p>' +
                '</div>'+
                '<div class="optask-t">' +
                '   <div class="clear" style="height: 50px;position: relative">' +
                '       <p class="fl">患者：<span>' + data.patientName + '</span></p>' +
                '       <p class="fr" style="margin-right: 20px;">关闭：<span>' + data.thedate + '</span></p>'+
                '   </div>' +
                '   <div>' +
                '       <span>计划完成时间：' + data.plantime + '</span>' +
                '       <span>[' + data.createAuditorName + ']</span>' +
                '       <span>' + data.optaskTplTitle + '</span>' +
                '       <span>' + data.shipstr + '</span>' +
                '   </div>' +
                '</div></div>';
            $('#' + domId + '').append(str);
        },

        initQuestion: function () {
            var self = this;
            $(document).on('click', '.showPatientOneHtml', function () {
                var optaskcheckid = $(this).data('check-id');
                $.ajax({
                    url: '/optaskchecktplmgr/questionsheethtml?optaskcheckid=' + optaskcheckid,
                    type: 'get',
                    dataType: 'html',
                    success: function (response) {
                        $('.question-sheet-box').html(response);
                    }
                });

            });
        },

        changeLaydateOfBeforeAndAfter : function () {
            var self = this;
            $(document).on('click', '.time_before', function () {
                self.initWorkQuality(self.auditorId, 0,self.date,-1)
            });

            $(document).on('click', '.time_after', function () {
                self.initWorkQuality(self.auditorId, 0,self.date,1)
            });
        },

        diffDate : function (evalue) {
            var dB = new Date(evalue.replace(/-/g, "/"));

            if (new Date() > Date.parse(dB)) {
                return 1;
            }
            return 0;

        }
    };

    listOfAuditor.init();
});

