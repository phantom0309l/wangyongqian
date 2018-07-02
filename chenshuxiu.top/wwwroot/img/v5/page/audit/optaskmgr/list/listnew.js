var current_showOptask = null;

$(function () {
    var app = {
        optaskid: 0,
        patientid: 0,
        canClick: true,
        canSend: true,
        init: function () {
            var self = this;
            $(".content-right").css({"visibility": "hidden"});
            self.initLayout();
            self.handleShowOptask();
            self.changeOptaskTplOrLevel();
            self.submitBtnSearch();
            self.submitKeyUpSearch();
            self.fixnotoptaskpatient();
            self.handleOneHistory();
            self.handleShowMoreHistory();
            $(".showOptask").eq(0).click().parents("div.task-block").addClass('divOnSelected');
            self.nextfollowBtnClick();
            self.modifyOptaskAudit_remarkBtnClick();
            self.changeAuditor();
            self.handleOptaskClick();
            self.handleTrackPipe();
            //sunflower项目出组
            self.outSunflower();
            //给患者打标签
            self.patientTagPost();
            self.doubtPost();
            // RevisitTkt_audit
            self.tktAuditPanelModifyTime();
            self.tktAuditPanelPass();
            self.tktAuditPanelRefuse();
            // RevisitTkt_remind
            self.tktRemindPanelModifyTime();
            self.tktRemindPanelConfirm();
            self.tktRemindPanelCancel();
            // BedTkt_audit
            self.bedtktAuditPlanTime();
            self.bedtktAuditPass();
            self.bedtktAuditRefuse();
            // Recipe_audit
            self.recipeAuditPass();
            // evaluate
            self.evaluateShow();
            // PatientMedicineSheet_audit
            self.pmsAuditRight();
            self.pmsAuditWrong();
            // PmSideEffect
            self.pmsideeffectAudit()
            //回复用户
            self.replyMsg();
            //点击tab显示量表详情
            self.handleShowOptaskPaperDetail();
            //点击tab显示住院详情
            self.handleShowOptaskBedTktDetail();

            // 操作任务
            self.handleOptaskHangup();
            self.handleOptaskChangeOpNode();
            self.handleOptaskFlowOpNode();
            self.handleOptaskClose();

            self.patientRecordListOfADHDTrigger();

            //方寸儿童管理服务平台添加运营备注
            self.addPatientRecordOfADHD();

            self.handlePatientRecordEdit();

            // ocrPicModel
            self.initOcrPicModel();
        },
        initLayout: function () {
            var H = $(window).height();
            var navH = $(".navbar").outerHeight(true);
            var footerH = $(".footer").outerHeight(true);
            var itemH = H - navH - footerH;
            $('.sectionItem').each(function () {
                var me = $(this);
                me.css({
                    height: itemH + "px",
                    overflow: "auto"
                });
            });
        },
        handleShowOptask: function () {
            var self = this;
            $(document).on("click", ".showOptask", function () {

                current_showOptask = this;

                var me = $(this);
                if (!self.canClick) {
                    return;
                }
                self.canClick = false;

                $("div.task-block").removeClass("divOnSelected");
                $(this).parents("div.task-block").addClass("divOnSelected");

                var patientid = self.patientid = me.data("patientid");
                var isHistory = me.hasClass("showHistory");
                $("#patientid").val(patientid);
                if (isHistory) {
                    var data = {
                        patientid: patientid
                    };
                    $("#oneHistoryPatientHtml").empty();
                    var node = $("#oneHistoryPatientHtml");
                    self.showOneHtmlBydata(data, "/optaskmgr/onehistorypatienthtml", me, node);
                    $("#optaskhistoryshell").empty();
                    var data = self.getDataForOneHistoryHtml();
                    var node = $("#optaskhistoryshell");
                    self.showOneHtmlBydata(data, "/optaskmgr/onehistoryhtml", me, node);
                } else {
                    var data = {
                        patientid: patientid
                    };
                    $(".onePatientHtml").empty();
                    var node = $(".onePatientHtml");
                    self.showOneHtmlBydata(data, "/optaskmgr/onepatienthtml", me, node);
                    $(".optaskshell").empty();
                    var node = $(".optaskshell");
                    self.showOneHtmlBydata(data, "/optaskmgr/onenewhtml", me, node);
                }
            })
        },
        changeOptaskTplOrLevel: function () {
            var self = this;
            $(".optasktplBox").on("change", function () {
                var queryString = self.getQueryString();
                window.location.href = "/optaskmgr/listnew" + queryString;
            });
            $(".levelBox").on("change", function () {
                var queryString = self.getQueryString();
                window.location.href = "/optaskmgr/listnew" + queryString;
            });
        },
        submitBtnSearch: function () {
            var self = this;
            $('#button-search-patient').on('click', function (e) {
                var queryString = self.getQueryString();
                window.location.href = "/optaskmgr/listnew" + queryString;
            });
        },
        submitKeyUpSearch: function () {
            var self = this;
            $('#input-search-patient').on('keyup', function (e) {
                if (e.keyCode == 13) {
                    var queryString = self.getQueryString();
                    window.location.href = "/optaskmgr/listnew" + queryString;
                }
            });
        },
        fixnotoptaskpatient: function () {
            var self = this;

            $('#button-fix-notoptask-patient').on('click', function (e) {
                $.ajax({
                    "type": "get",
                    "data": {},
                    "dataType": "html",
                    "url": "/optaskmgr/fixNotOpTaskPatientJson",
                    "success": function (data) {
                        alert("修复[" + data + "]条无任务患者");
                    }
                });
            });

        },
        handleOneHistory: function () {
            var self = this;
            $(document).on("click", ".oneHistory", function () {
                var me = $(this);
                if (!self.canClick) {
                    return;
                }
                self.canClick = false;

                $("#optaskhistoryshell").empty();
                self.changeBtnStyle(me);
                var data = self.getDataForOneHistoryHtml();
                if (!data.patientid) {
                    alert("请选择患者！");
                    self.canClick = true;
                    return;
                }
                var node = $("#optaskhistoryshell");
                self.showOneHtmlBydata(data, "/optaskmgr/onehistoryhtml", me, node);
            })
        },
        changeBtnStyle: function (node) {
            node.addClass("btn-primary").addClass("selected").siblings().removeClass("btn-primary").removeClass("selected");
            if (node.parent().hasClass("btnBox")) {
                $(".btnBox-follow").children().removeClass("btn-primary").removeClass("selected");
                if (node.hasClass("btn-follow")) {
                    $(".btnBox-follow").removeClass("none");
                } else {
                    $(".btnBox-follow").addClass("none");
                }
            } else {
                $(".btn-follow").removeClass("selected");
            }
        },
        handleShowMoreHistory: function () {
            var self = this;
            $(document).on("click", "#showMoreHistory", function () {
                var me = $(this);
                if (!self.canClick) {
                    return;
                }
                self.canClick = false;

                var data = self.getDataForOneHistoryHtml();
                if (!data.patientid) {
                    alert("请选择患者！");
                    self.canClick = true;
                    return;
                }
                var node = $("#optaskhistoryshell");
                self.showOneHtmlBydata(data, "/optaskmgr/onehistoryhtml", me, node);
            })
        },
        showOneHtmlBydata: function (data, url, btnNode, loadNode) {
            var self = this;
            var patientid = data.patientid;
            $.ajax({
                "type": "get",
                "data": data,
                "dataType": "html",
                "url": url,
                "success": function (data) {
                    self.canClick = true;
                    if (data) {
                        loadNode.append(data);
                        var optask = loadNode.find('.optask:last-child');
                        //console.log(optask.data('page') - '', optask.data('totalpage') - '');
                        var nextpage = optask.data('page') - '';
                        var totalpage = optask.data('totalpage') - '';
                        if (nextpage > totalpage) {
                            $('.showMore ').hide();
                        }
                        //$(".optaskOneShell").find(".pageTitle").hide();

                        //onePatientHtml加载完毕后，加载ADHD运营备注列表
                        if(loadNode.hasClass('onePatientHtml')){
                            self.showPatientRecordListOfADHD(patientid, 0);
                        }

                        var select2Nodes = loadNode.find(".js-select2");
                        select2Nodes.each(function () {
                            var select2Node = $(this);
                            select2Node.select2();
                        });
                    } else {
                        if (btnNode.hasClass("showMore")) {
                            alert("木有了！");
                            btnNode.hide();
                        }
                    }

                    // 因为异步加载页面元素，所以只能把这个popover的初始化，挪到这边了。
                    $('.onePatientHtml').find('[data-toggle="popover"], .js-popover').popover({
                        container: 'body',
                        animation: true,
                        trigger: 'hover'
                    });
                }
            });
        },
        getDataForOneHistoryHtml: function () {
            var data = {};
            data.pagesize = 10;
            data.patientid = $("#patientid").val();
            data.show_open_task = $('input[name="show_open_task"]:checked').val();
            var optasktplBox = $(".optasktplBox");
            var selectedOptasktpl = optasktplBox.find(".selected");
            if (selectedOptasktpl) {
                data.optasktplid = selectedOptasktpl.data("optasktplid");
                data.optasktplcode = selectedOptasktpl.data("code");
            }

            var offsetoptask = $("#optaskhistoryshell").children().last();
            if (offsetoptask) {
                data.page = offsetoptask.data("page");
            }
            return data;
        },
        handleTrackPipe: function () {
            $(document).on("click", ".trackPipe", function () {
                var me = $(this);
                var pipeid = me.data("pipeid");
                var patientid = $("#patientid").val();
                $.ajax({
                    "type": "get",
                    "data": {
                        patientid: patientid,
                        pipeid: pipeid,
                        istrack: true
                    },
                    "dataType": "html",
                    "url": "/pipemgr/listHtml_optask",
                    "success": function (data) {
                        $("#pipeShell").html(data);
                        setTimeout(function () {
                            var node = $(".content-right");
                            var h = node[0].scrollHeight;
                            node.scrollTop(h);
                        }, 0);
                    }
                });
            })
        },
        handledealwithtpl: function (dealwithtplid) {
            $.ajax({
                "type": "post",
                "url": "/dealwithtplmgr/sendcntjson",
                dataType: "text",
                data: {
                    dealwithtplid: dealwithtplid
                },
                "success": function (data) {
                }
            });
        },
        nextfollowBtnClick: function () {
            var self = this;
            $(document).on("click", ".nextfollowBtn", function () {
                var me = $(this);
                var pnode = me.parents(".optask-innershell");
                var textarea = pnode.find(".textarea_optlog_content");

                // var tbody_optlog = pnode.find(".tbody_optlog");
                var content = $.trim(textarea.val());

                if (content == "") {
                    alert("请填写跟进备注");
                    return;
                }
                if (!self.canClick) {
                    return;
                }
                self.canClick = false;

                $.ajax({
                    "type": "post",
                    "data": {
                        content: content,
                        optaskid: me.data("optaskid")
                    },
                    "dataType": "text",
                    "url": "/optlogmgr/addJson",
                    "success": function (data) {

                        $(".tbody_optlog").prepend(data);

                        textarea.val('');

                        self.canClick = true;
                        // me.text("已添加").removeClass('btn-default').addClass('btn-success');
                    }
                });
            })
        },
        modifyOptaskAudit_remarkBtnClick: function () {
            var self = this;
            $(document).on("click", ".modifyOptaskAudit_RemarkBtn", function () {
                var me = $(this);
                var pnode = me.parents(".optask-innershell");
                var textarea = pnode.find(".textarea");
                var content = $.trim(textarea.val());

                if (content == "") {
                    alert("请填写审核备注");
                    return;
                }

                $.ajax({
                    "type": "post",
                    "data": {
                        audit_remark: content,
                        optaskid: me.data("optaskid")
                    },
                    "dataType": "text",
                    "url": "/optaskmgr/modifyAuditRemarkJson",
                    "success": function (data) {
                        if (data == 'ok') {
                            alert("修改成功");
                        }
                    }
                });
            })
        },
        changeAuditor: function () {
            var self = this;
            $(document).on("change", ".changeAuditor", function () {
                var me = $(this);
                var val = me.val();
                if (val.length == 0) {
                    return;
                }
                $.ajax({
                    "type": "post",
                    "data": {
                        "optaskid": self.optaskid,
                        "auditorid": val
                    },
                    "url": "/optaskmgr/changeAuditorJson",
                    "success": function (data) {
                        $(".changeAuditorNotice").fadeIn('slow', function () {
                            $(this).fadeOut('1000');
                        });
                    }
                });
            });
        },
        getQueryString: function () {
            var node1 = $(".optasktplBox");
            var node2 = $(".levelBox");
            var nodes = $.merge(node1, node2);
            var arr = [];
            nodes.each(function () {
                var me = $(this);
                var key = me.attr("name");
                var value = me.val();
                arr.push(key + "=" + value);
            });
            var name = $("#input-search-patient").val();
            arr.push("patient_name=" + name);
            var daycntfrom = $(".daycntfrom option:selected").val();
            arr.push("daycntfrom=" + daycntfrom);
            var daycntto = $(".daycntto option:selected").val();
            arr.push("daycntto=" + daycntto);

            return "?" + arr.join("&");
        },
        renderStepSelect: function (typestr, afterFun) {
            var self = this;
            $(".stepSelect").show();
            $.ajax({
                "type": "get",
                "data": {
                    "typestr": typestr
                },
                "dataType": "json",
                "url": "/optaskmgr/geStepArrJson",
                "success": function (data) {
                    var str = '<option value="" selected>按任务阶段</option>';
                    $.each(data, function (i, v) {
                        str = str + '<option value="' + v + '">' + v + '</option>';
                    });
                    $(".stepSelect").html(str);
                }
            });
        },
        replyMsg: function () {
            var self = this;
            $(document).on("click", ".reply-paperbtn", function () {
                var me = $(this);
                var replyMsg = me.parents(".replyShell").find(".reply-msg");
                var val = $.trim(replyMsg.val());
                if (val.length == 0) {
                    alert("请填写内容");
                    return;
                }
                if (!self.canSend) {
                    return;
                }
                self.canSend = false;

                var dealwithtplid = 0;
                var dealwith = me.parents(".replyBox").find(".handleSelect");
                if (dealwith.length) {
                    dealwithtplid = dealwith.val();
                    self.handledealwithtpl(dealwithtplid);
                }

                $.ajax({
                    "type": "post",
                    "data": {
                        optaskid: me.data("optaskid"),
                        content: val,
                        isnote: self.getIsNote(me)
                    },
                    "dataType": "text",
                    "url": "/optaskmgr/replyMsgJson",
                    "success": function (data) {
                        self.canSend = true;
                        me.text("已发送").removeClass('btn-default').addClass('btn-success');
                    }
                });
            })
        },
        handleOptaskClick: function () {
            $(document).on("click", ".optask-t", function () {
                var me = $(this);
                me.parent('div.optask').siblings('div.optask').find('.optask-c').hide(100, function () {
                    $(this).siblings('.optask-t').find('i.angle').attr('class', 'fa fa-angle-right angle');
                    $(this).siblings('.optask-t').removeClass('optask-t-active');
                });
                var optaskc = me.siblings('.optask-c');
                if (optaskc.is(":hidden")) {
                    optaskc.show(100, function () {
                        me.addClass('optask-t-active');
                        me.find('i.angle').attr('class', 'fa fa-angle-down angle');
                    });
                } else {
                    optaskc.hide(100, function () {
                        me.find('i.angle').attr('class', 'fa fa-angle-right angle');
                        me.removeClass('optask-t-active');
                    });
                }
            })
        },
        handledealwithtpl: function (dealwithtplid) {
            $.ajax({
                "type": "post",
                "url": "/dealwithtplmgr/sendcntjson",
                dataType: "text",
                data: {
                    dealwithtplid: dealwithtplid
                },
                "success": function (data) {
                    if (data == 'ok') {
                    }
                }
            });
        },
        getIsNote: function (node) {
            var isnote = 0;
            var node = node.parents(".replyBox");
            noteBtn = node.find(".noteBtn");
            if (noteBtn.is(":checked")) {
                isnote = 1;
            }
            return isnote;
        },
        doubtPost: function () {
            var self = this;
            $(document).on("click", ".doubtBtn", function () {
                var me = $(this);
                var doubt_type = me.data("value");
                var patientid = self.patientid;

                $.ajax({
                    "type": "post",
                    "data": {
                        "patientid": patientid,
                        "doubt_type": doubt_type
                    },
                    "url": "/patientmgr/DoubtJson",
                    "success": function (data) {
                        if (doubt_type == 0) {
                            me.removeClass('btn-primary');
                            var defaultvalue = me.data("defaultvalue");
                            me.data("value", defaultvalue);
                        } else {
                            me.addClass('btn-primary');
                            me.data("value", 0);
                        }
                    }
                });
            });
        },
        outSunflower: function () {
            var self = this;
            $(document).on("click", ".sunflowerOutBtn", function () {
                var me = $(this);

                if (!self.canSend) {
                    return;
                }
                self.canSend = false;

                var has = me.hasClass('btn-primary');
                if (has) {
                    return;
                }

                var patientname = me.data("patientname");
                if (!confirm('确认' + patientname + '患者要退出sunflower项目吗？')) {
                    self.canSend = true;
                    return;
                }

                var patientid = self.patientid;
                var status = me.data("status");

                $.ajax({
                    "type": "post",
                    "data": {
                        "patientid": patientid,
                        "status": status,
                    },
                    "url": "/patient_hezuomgr/outJson",
                    "success": function (data) {
                        if (data == "ok") {
                            self.canSend = true;
                            me.addClass('btn-primary').siblings().removeClass("btn-primary");
                            if(4 == status){
                                $(".duetoDrugOutBtn-item").removeClass('hidden');
                            }
                        }
                    }
                });
            });
        },
        patientTagPost: function () {
            var self = this;
            $(document).on("click", ".patientTagBtn", function () {
                var me = $(this);
                var has = me.hasClass('btn-primary');
                if (has) {
                    me.removeClass('btn-primary');
                } else {
                    me.addClass('btn-primary');
                }
                var tagid = me.data("tagid");
                var patientid = self.patientid;

                $.ajax({
                    "type": "post",
                    "data": {
                        "patientid": patientid,
                        "tagid": tagid,
                        "isdelete": (has == true ? 1 : 0)
                    },
                    "url": "/optaskmgr/patientTagJson",
                    "success": function (data) {
                    }
                });
            });
        },
        tktAuditPanelModifyTime: function () {
            $(document).on("click", ".tktAuditPanelModifyTime", function () {
                var me = $(this);
                var revisittktid = me.parents('.tktAuditPanel').children('.revisittktid').val();
                var newtime = me.prev('.thedate').val();
                $.ajax({
                    "type": "post",
                    "url": "/revisittktmgr/modifythedateJson",
                    dataType: "text",
                    data: {
                        revisittktid: revisittktid,
                        thedate: newtime
                    },
                    "success": function (data) {
                        if (data == 'success') {
                            alert('修改成功');
                        } else {
                            alert(newtime + "不是一个有效日期");
                        }
                    }
                });
            })
        },
        tktAuditPanelPass: function () {
            $(document).on("click", ".tktAuditPanelPass", function () {
                var me = $(this);
                var revisittktid = me.parents('.tktAuditPanel').children('.revisittktid').val();
                $.ajax({
                    "type": "post",
                    "url": "/revisittktmgr/passJson",
                    dataType: "text",
                    data: {
                        revisittktid: revisittktid
                    },
                    "success": function (data) {
                        if (data == 'fine') {
                            alert('审核通过');
                            me.hide();
                            me.next().hide();
                        }
                    }
                });
            })
        },
        tktAuditPanelRefuse: function () {
            $(document).on("click", ".tktAuditPanelRefuse", function () {
                var me = $(this);
                var revisittktid = me.parents('.tktAuditPanel').children('.revisittktid').val();
                $.ajax({
                    "type": "post",
                    "url": "/revisittktmgr/refuseJson",
                    dataType: "text",
                    data: {
                        revisittktid: revisittktid
                    },
                    "success": function (data) {
                        if (data == 'fine') {
                            alert('审核拒绝');
                            me.hide();
                            me.prev().hide();
                        }
                    }
                });
            })

        },
        bedtktAuditPlanTime: function () {
            $(document).on("click", ".bedtktAuditPlanTime", function () {
                var me = $(this);
                var plan_date = me.prev('.plan_date').val();
                if (!confirm("确认把[" + plan_date + "]设置为应住日期吗？")) {
                    return;
                }

                var bedtktid = me.parents('.bedtktAuditPanel').children('.bedtktid').val();
                $.ajax({
                    "type": "post",
                    "url": "/bedtktmgr/setPlan_dateJson",
                    dataType: "text",
                    data: {
                        bedtktid: bedtktid,
                        plan_date: plan_date
                    },
                    "success": function (data) {
                        if (data == 'success') {
                            alert('设置成功');
                            $("#plan_date_show_" + bedtktid).text(plan_date);
                        } else {
                            alert(plan_date + "不是一个有效日期");
                        }
                    }
                });
            })
        },
        bedtktAuditPass: function () {
            $(document).on("click", ".bedtktAuditPass", function () {
                if (!confirm("确认通过吗？")) {
                    return;
                }

                var me = $(this);
                var bedtktid = me.parents('.bedtktAuditPanel').children('.bedtktid').val();
                $.ajax({
                    "type": "post",
                    "url": "/bedtktmgr/passJson",
                    dataType: "text",
                    data: {
                        bedtktid: bedtktid
                    },
                    "success": function (data) {
                        if (data == 'success') {
                            alert('已通过');
                            $("#auditor_status_show_" + bedtktid).text("运营通过");
                            $(".bedtktAuditPanel").hide();
                        }
                    }
                });
            })
        },
        bedtktAuditRefuse: function () {
            $(document).on("click", ".bedtktAuditRefuse", function () {
                if (!confirm("确认拒绝吗？")) {
                    return;
                }

                var me = $(this);
                var bedtktid = me.parents('.bedtktAuditPanel').children('.bedtktid').val();
                $.ajax({
                    "type": "post",
                    "url": "/bedtktmgr/refuseJson",
                    dataType: "text",
                    data: {
                        bedtktid: bedtktid
                    },
                    "success": function (data) {
                        if (data == 'success') {
                            alert('已拒绝');
                            $("#auditor_status_show_" + bedtktid).text("运营拒绝");
                            $(".bedtktAuditPanel").hide();
                        }
                    }
                });
            })

        },
        recipeAuditPass : function(){
            $(document).on("click", ".recipeAuditPass", function(){
                var me = $(this);
                if(me.hasClass('btn-success')){
                    return;
                }

                var recipeid = me.parents('.recipeAuditPanel').children('.recipeid').val();
                var thedate = me.parents('.recipeAuditPanel').find('.thedate').val();
                if('' == thedate){
                    alert("请选择处方日期！");
                    return;
                }
                $.ajax({
                    "type" : "post",
                    "url" : "/recipemgr/passJson",
                    dataType : "text",
                    data : {
                        recipeid : recipeid,
                        thedate : thedate,
                    },
                    "success" : function(data) {
                        if (data == 'success') {
                            me.text("已通过");
                            me.addClass("btn-success");
                        }
                    }
                });
            })
        },
        tktRemindPanelModifyTime : function(){
            $(document).on("click", ".tktRemindPanelModifyTime", function(){
                var me = $(this);
                var revisittktid = me.parents('.tktRemindPanel').children('.revisittktid').val();
                var newtime = me.prev('.thedate').val();
                $.ajax({
                    "type": "post",
                    "url": "/revisittktmgr/modifythedateJson",
                    dataType: "text",
                    data: {
                        revisittktid: revisittktid,
                        thedate: newtime
                    },
                    "success": function (data) {
                        if (data == 'success') {
                            alert('修改成功');
                        } else {
                            alert(newtime + "不是一个有效日期");
                        }
                    }
                });
            })
        },
        tktRemindPanelConfirm: function () {
            $(document).on("click", ".tktRemindPanelConfirm", function () {
                var me = $(this);
                var revisittktid = me.parents('.tktRemindPanel').children('.revisittktid').val();
                $.ajax({
                    "type": "post",
                    "url": "/revisittktmgr/confirmJson",
                    dataType: "text",
                    data: {
                        revisittktid: revisittktid
                    },
                    "success": function (data) {
                        if (data == 'fine') {
                            alert('已确认');
                            me.removeClass("btn-default");
                            me.addClass("btn-success");
                            me.next().removeClass("btn-success");
                            me.next().addClass("btn-default");
                        }
                    }
                });
            })
        },
        tktRemindPanelCancel: function () {
            $(document).on("click", ".tktRemindPanelCancel", function () {
                var me = $(this);
                var revisittktid = me.parents('.tktRemindPanel').children('.revisittktid').val();
                $.ajax({
                    "type": "post",
                    "url": "/revisittktmgr/cancelJson",
                    dataType: "text",
                    data: {
                        revisittktid: revisittktid
                    },
                    "success": function (data) {
                        if (data == 'fine') {
                            alert('已取消');
                            me.removeClass("btn-default");
                            me.addClass("btn-success");
                            me.prev().removeClass("btn-success");
                            me.prev().addClass("btn-default");
                        }
                    }
                });
            })
        },
        evaluateShow: function () {
            $(document).on("click", ".evaluate-box-title", function () {
                var me = $(this);
                me.next().toggle();
            })
        },
        pmsAuditRight: function () {
            $(document).on("click", ".pmsAuditRight", function () {
                var me = $(this);
                var patientmedicinesheetid = me.data("patientmedicinesheetid");
                $.ajax({
                    "type": "post",
                    "url": "/patientmedicinesheetmgr/auditrightJson",
                    dataType: "text",
                    data: {
                        patientmedicinesheetid: patientmedicinesheetid
                    },
                    "success": function (data) {
                        if (data == 'success') {
                            alert('已审核为正确');
                            me.hide();
                            me.next().hide();
                        }
                    }
                });
            })
        },
        pmsAuditWrong: function () {
            $(document).on("click", ".pmsAuditWrong", function () {
                var me = $(this);
                var patientmedicinesheetid = me.data("patientmedicinesheetid");
                $.ajax({
                    "type": "post",
                    "url": "/patientmedicinesheetmgr/auditwrongJson",
                    dataType: "text",
                    data: {
                        patientmedicinesheetid: patientmedicinesheetid
                    },
                    "success": function (data) {
                        if (data == 'success') {
                            alert('已审核为错误');
                            me.hide();
                            me.prev().hide();
                        }
                    }
                });
            })
        },
        pmsideeffectAudit: function () {
            $(document).on("click", ".pmsideeffectAudit", function () {
                var me = $(this);
                var result_status = me.data("resultstatus");
                var result_desc = me.data("resultdesc");
                var pmsideeffectid = me.data("pmsideeffectid");
                $.ajax({
                    "type": "post",
                    "url": "/pmsideeffectmgr/auditJson",
                    dataType: "text",
                    data: {
                        result_status: result_status,
                        pmsideeffectid: pmsideeffectid
                    },
                    "success": function (data) {
                        if (data == 'success') {
                            alert('已记录结果: ' + result_desc);
                        }
                    }
                });
            })
        },
        handleShowOptaskPaperDetail: function () {
            $(document).on("click", ".optask .paper-title", function () {
                var me = $(this);
                var paperid = me.data('paperid');
                $.ajax({
                    "type": "post",
                    "url": "/papermgr/detail4optaskhtml",
                    dataType: "text",
                    data: {
                        paperid: paperid
                    },
                    "success": function (data) {
                        me.siblings('.optask-c').find('.paper-detail').html(data)
                    }
                });
            })
        },
        handleShowOptaskBedTktDetail: function () {
            $(document).on("click", ".optask .bedtkt-title", function () {
                var me = $(this);
                var bedtktid = me.data('bedtktid');
                $.ajax({
                    "type": "post",
                    "url": "/bedtktlogmgr/list4bedtkthtml",
                    dataType: "text",
                    data: {
                        bedtktid: bedtktid
                    },
                    "success": function (data) {
                        me.siblings('.optask-c').find('.bedtkt-detail').html(data)
                    }
                });
            })
        },
        handleOptaskHangup: function () {
            $(document).on('click', '.hangupBtn', function () {
                var me = $(this);

                var optaskid = me.data('optaskid');
                var patientid = me.data('patientid');
                $.ajax({
                    "type": "get",
                    "data": {
                        optaskid: optaskid
                    },
                    "dataType": "text",
                    "url": "/optaskmgr/hangupjson",
                    "success": function (data) {
                        $(".patientid-" + patientid).click();
                        // window.location.href = location.href;
                    }
                });
            });
        },
        handleOptaskChangeOpNode: function () {
            $(document).on('change', '.to_opnodeid', function () {
                var to_opnodestr = $(this).val();
                var to_opnodearr = to_opnodestr.split('|');
                var opnodeflowid = to_opnodearr[0];
                var to_opnodetitle = to_opnodearr[1];
                // var objtype = to_opnodearr[2];
                var is_show_next_plantime = to_opnodearr[3];

                var parent = $(this).parents(".optask-handlebox");
                var optaskid = parent.data('optaskid');
                // var optasktplid = parent.data('optasktplid');

                $("#opnodeflowid-" + optaskid).val(opnodeflowid);
                $("#opnodetitle-" + optaskid).val(to_opnodetitle);
                $("#next_plantime-" + optaskid).val('');

                if (to_opnodetitle == 'doctor_apply') {
                	$("#audit_remark-" + optaskid).show();
                } else {
                    $("#audit_remark-" + optaskid).hide();
                }

                // // 血常规收集任务 完成时, 显示日期框[血常规检查日期], 用于生成下次收集任务
				// var opnodeflowid_arr1 = [ 458656776, 458656836, 458657136, 458657226 ];
                //
				// // 任务中，需要显示日期框的optasktplid
				// var optasktplid_need_dates = [445430496, 458705906];

                // if (to_opnodetitle == 'appoint_follow'
                //     || to_opnodetitle == 'audit_pass'
                //     || to_opnodetitle == 'doctor_apply'
                //     || to_opnodetitle == 'wbc_treat'
                //     || to_opnodetitle == 'wbc_observe'
                //     || to_opnodetitle == 'reaction_treat'
                //     || (objtype == "PADRMonitor" && to_opnodetitle == 'visit')
                //     || (objtype == "PADRMonitor" && to_opnodetitle == 'observe')
                //     || (objtype == "PADRMonitor" && to_opnodetitle == 'second_observe')
                //     || ($.inArray(parseInt(opnodeflowid), opnodeflowid_arr1) > -1)
                //     || (($.inArray(parseInt(optasktplid), optasktplid_need_dates) > -1) && to_opnodetitle == 'finish')
                // )
                if (is_show_next_plantime == 1)
                {
                    $("#next_plantime-" + optaskid).show();
                } else {
                    $("#next_plantime-" + optaskid).hide();
                }
            });
        },
        handleOptaskFlowOpNode: function () {
            $(document).on('click', '.flowBtn', function () {
                var me = $(this);
                var optaskid = me.data('optaskid');
                var patientid = me.data('patientid');
                var opnodeflowid = $("#opnodeflowid-" + optaskid).val();
                var next_plantime = $("#next_plantime-" + optaskid).val();
                var audit_remark = $("#txt_audit_remark-" + optaskid).val();

                var opnodetitle = $("#opnodetitle-" + optaskid).val();
                if (opnodetitle == 'appoint_follow') {
                    if (next_plantime == '') {
                        alert("下次跟进时间不能为空");
                        return false;
                    }
                }

                if (opnodeflowid <= 0) {
                    alert("必须选择节点");
                    return false;
                }

                if (!confirm("确认切换吗?")) {
                    return false;
                }

                $.ajax({
                    "type": "post",
                    "data": {
                        optaskid: optaskid,
                        opnodeflowid: opnodeflowid,
                        next_plantime: next_plantime,
                        audit_remark: audit_remark
                    },
                    "dataType": "json",
                    "url": "/optaskmgr/opnodeflowjson",
                    "success": function (data) {
                        if (data.errno = "0") {
                            $(".patientid-" + patientid).click();
                            // window.location.href = location.href;
                        } else {
                            alert(data.errmsg);
                        }
                    }, "error": function () {
                        alert('操作失败');
                    }
                });
            });
        },
        handleOptaskClose: function () {
            $(document).on('click', '.closeBtn', function () {
                var me = $(this);
                var optaskid = me.data("optaskid");
                var auditorid = me.data("auditorid");
                $.ajax({
                    "type": "post",
                    "data": {
                        "optaskid": optaskid,
                        "auditorid": auditorid
                    },
                    "url": "/optaskmgr/closeoptaskjson",
                    "success": function (data) {
                        me.addClass('btn-success').text("已关闭");
                        // window.location.href = location.href;
                    }
                });
            });
        },
        addPatientRecordOfADHD : function(){
            var self = this;
            $(document).on("click", ".patientRecordAddBox-btn", function(){
                var me = $(this);
                var boxNode = me.parents(".patientRecordAddBox");
                var boxItemNodes = boxNode.find(".patientRecordAddBox-item");

                var patientid = me.data("patientid");
                var data = [];

                boxItemNodes.each(function(){
                    var item = $(this);
                    var inputNode = item.find("input");
                    var val = $.trim(inputNode.val());
                    if(val){
                        var temp = {};
                        temp.content = val;
                        temp.patientrecordtplid = item.data("patientrecordtplid");
                        data.push(temp);
                    }
                })

                if(data.length == 0){
                    alert("请填写内容");
                    return;
                }

                if(!self.canClick){
                    return;
                }
                self.canClick = false;
                $.ajax({
                    "type" : "post",
                    "url" : "/patientrecordmgr/addJsonOfADHD",
                    dataType : "json",
                    data : {"patientid" : patientid, "data" : data},
                    "success" : function(d) {
                        if (d.errmsg == 'ok') {
                            //清空一下数据
                            boxNode.find("input").val("");
                            boxNode.find(".patientRecordAddNotice").fadeIn(0, function(){
                                $(this).fadeOut(1200, function(){
                                    $(".remarkBox-ADHD-listTriggerBtn").trigger('click');
                                    $(".patientRecordTplBox").find("label").eq(0).trigger("click");
                                });
                            });
                            self.canClick = true;
                        }
                    }
                });
            })
        },
        patientRecordListOfADHDTrigger : function(){
            var self = this;
            $(document).on("click", ".patientRecordTplBox-triggerBtn", function(){
                var me = $(this);
                var patientid = me.data("patientid");
                var patientrecordtplid = me.data("patientrecordtplid");
                self.showPatientRecordListOfADHD(patientid, patientrecordtplid);
                return false;
            })
        },
        showPatientRecordListOfADHD : function(patientid, patientrecordtplid){
            $.ajax({
                "type" : "get",
                "url" : "/patientrecordmgr/ListHtmlOfADHD",
                dataType : "html",
                data : {"patientid" : patientid, "patientrecordtplid" : patientrecordtplid},
                "success" : function(html) {
                    $(".patientRecordListOfADHD").html(html);
                }
            });
        },
        handlePatientRecordEdit : function(){
            var self = this;
            $(document).on("click", ".patientRecordEdit", function(){
                var me = $(this);
                var contentNode = me.parents(".patientRecordContent");
                var showAreaNode = contentNode.find(".patientRecordContent-show");
                var editAreaNode = contentNode.find(".patientRecordContent-edit");
                showAreaNode.hide();
                editAreaNode.show();
            });

            $(document).on("click", ".patientRecordSave", function(){
                var me = $(this);
                var editAreaNode = me.parents(".patientRecordContent-edit");
                var content = $.trim(editAreaNode.find("textarea").val());
                if(content == ""){
                    alert("请输入内容");
                    return;
                }
                var patientrecordid = me.data("patientrecordid");
                if(!self.canClick){
                    return;
                }
                self.canClick = false;
                $.ajax({
                    "type" : "post",
                    "url" : "/patientrecordmgr/modifyJsonOfADHD",
                    dataType : "json",
                    data : {"patientrecordid" : patientrecordid, "content" : content},
                    "success" : function(d) {
                        if (d.errmsg == 'ok') {
                            me.addClass('btn-danger');
                            me.find("span").text("已保存");
                            self.canClick = true;
                        }
                    }
                });
            })
        },
        initOcrPicModel : function () {
            $(document).on('click', ".ocr-btn", function () {
                var patientPicid = $(this).data('patient-pic-id');

                $.ajax ({
                    type    :   'get',
                    url     :   '/ocrtextmgr/ocrpicturemodelhtml?patientpicid='+patientPicid,
                    dateType:   'html',
                    success :   function (response) {
                        $('#picture-ocr .ocr-modal-content').html(response);
                        setTimeout(function () {
                            $(".img-big").viewer({
                                inline: true,
                                url: 'data-url',
                                navbar: false,
                                scalable: false,
                                fullscreen: false,
                                minZoomRatio: 0.5,
                                tooltip: false,
                                zoomRatio: false,
                                shown: function (e) {
                                },
                            });
                            $.mosaic.init($('#image'), $('#canvasb'));
                        },0);
                    }
                });
            });

            $(document).on('click', "#goMosaic", function () {
                var patientPicid = $(this).data('patient-pic-id');

                $.ajax ({
                    type    :   'get',
                    url     :   '/ocrtextmgr/ocrpicturemodelhtml?patientpicid='+patientPicid+'&isremovemosic=1',
                    dateType:   'html',
                    success :   function (response) {
                        $('#picture-ocr .ocr-modal-content').html(response);
                        setTimeout(function () {
                            $.mosaic.init($('#image'), $('#canvasb'));
                            $(".img-big").viewer({
                                inline: true,
                                url: 'data-url',
                                navbar: false,
                                scalable: false,
                                fullscreen: false,
                                minZoomRatio: 0.5,
                                tooltip: false,
                                zoomRatio: false,
                                shown: function (e) {
                                },
                            });
                        },0);
                    }
                });
            });

            function getOneHtml(url, picId, type, $that) {
                $("#table-box").html('');
                $.ajax({
                    'type': 'post',
                    'url': '/ocrtextmgr/ocrdataforonehtml',
                    'data': {
                        'url': url,
                        'type': type,
                        'picId': picId
                    },
                    'datatype': 'html',
                    'beforeSend': function () {
                        $('#progress-bar').parent('.progress').show();
                        $('#progress-bar').css('width', '40%');
                        $that.parent('div').children('button').attr('disabled', 'disabled');
                        $('#submit-checkuppicture').attr('disabled', 'disabled');
                    },
                    'success': function (data) {
                        $('#progress-bar').css('width', '80%');
                        $("#table-box").append(data);
                    },
                    'complete': function () {
                        $that.parent('div').children('button').removeAttr('disabled');
                        $('#submit-checkuppicture').removeAttr('disabled');
                        $('#progress-bar').css('width', '100%');
                        setTimeout(function () {
                            $('#progress-bar').parent('.progress').hide();
                        }, 600);
                    }
                });
            }

            $(document).on('click', 'button[name="get-ocr-html"]', function () {
                var type = $(this).data('category');
                var picId = $(".img-big").data('patient-pic-id');
                var url = $(".img-big").data('url');
                var $that = $(this);

                if ($("#table-box > div").html() != '') {
                    var msg = "重新识别后，数据会被置空！！请确认";
                    if (window.confirm(msg)) {
                        getOneHtml(url, picId, type, $that);
                    }
                } else {
                    getOneHtml(url, picId, type, $that);
                }
            });

            $(document).on('click', '#add-tr', function () {
                var type = $(this).attr('data-type');
                var $tds = $('table[name=' + type + '] tbody tr:first-child td');
                var trStr = '<tr>';
                $tds.each(function () {
                    var tempStr = "<td>" + $(this).html() + "</td>";
                    trStr += tempStr;
                });
                trStr += "</tr>";
                $('table[name=' + type + '] tbody').append(trStr);
                $('table[name=' + type + '] tbody tr:last-child td input').val('');
            });

            $(document).on('click', '#submit-checkuppicture', function () {
                var type = $("#picture_type").val();
                var patientInfoStr = $('form[name="patientInfo_form"]').serialize();
                var itemsStr = $('form[name="items_form"]').serialize();
                var drugNameStr = $('form[name="drugName_form"]').serialize();
                var drugListStr = $('form[name="drugList_form"]').serialize();
                var picId = $(".img-big").data('patient-pic-id');

                $.ajax({
                    'type': 'post',
                    'url': '/patientpicturemgr/changecontentpost',
                    'data': {
                        'type': type,
                        'patientInfo': patientInfoStr,
                        'items': itemsStr,
                        'drugName': drugNameStr,
                        'drugList': drugListStr,
                        'picId': picId
                    },
                    'dataType': 'html',
                    'beforeSend': function () {
                        $('#progress-bar').parent('.progress').show();
                        $('#progress-bar').css('width', '40%');
                    },
                    'success': function (data) {
                        $("#table-box").html(data);
                        $('#progress-bar').css('width', '100%');
                        setTimeout(function () {
                            $('#progress-bar').parent('.progress').hide();
                        }, 600);
                    }
                });
            });
        }

    };
    app.init();
});
