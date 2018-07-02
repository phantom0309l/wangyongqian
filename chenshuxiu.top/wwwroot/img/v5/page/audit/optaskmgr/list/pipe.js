/**
 * Created by qiaoxiaojin , modify by sjp 20151210
 */
$(function () {
    var Page_PatientMgr_List = {
        patientid: 0,
        isSend: false,
        canInPgroup: true,
        canClick: true,
        flag: true,
        pipeid: 0,
        filter: {
            "pipetplids": [],
            "ischeckedall": 1,
            "ispiconly": 0
        },
        init: function () {
            var self = this;
            // 左侧列表,查看
            self.showPatientOneHtmlOnClick();

            //根据消息类型筛选
            self.showPipesByTypestr();

            // 查看更多
            self.showMoreOnClick();

            self.addOpsRemarkOnClick();
            self.addOpTaskOnClick();
            self.addThankLetterOnClick();
            self.addThankLetterQuickOnClick();
            self.bindLaydate();

            //顶部回复消息
            self.replyTopBtnOnClick();

            // 回复消息
            self.replyBtnOnClick();

            //触发显示下方回复
            self.replyTriggerBtnOnClick();
            self.replyCtrlEnter();

            //课程select筛选
            self.handleCourseSelect();
            //课文筛选
            self.handleLessonSelect();

            // 事件区
            self.handleTabClick();
            //self.showWxOpMsgMoreOnClick();
            self.pipeAllOnClick();
            self.replybtnwxopmsgOnClick();

            //展开收起答卷按钮
            self.TriggerBtnOnClick();
            self.handlePipeMainBox();
            self.handleBindTask();
            $(document).on("click", ".nextFollowTime", function () {
                if ($(this).data('laydate') != 'init') {
                    $(this).data('laydate', 'init');

                    var value = $(this).val();
                    if (value == '0000-00-00' || value == '0000-00-00 00:00:00') {
                        value = new Date();
                        $(this).val(value.Format('YYYY-MM-DD'));
                    }
                    laydate.render({
                        elem: this,
                        value: value,
                        show: true
                    });
                }
            });
        },
        // 列表页-查看 挂点击事件
        showPatientOneHtmlOnClick: function () {
            var self = this;
            $(document).on("click", ".showPatientOneHtml", function (e) {
                $(".content-right").css({"visibility": "visible"});
                $("#showMore").show();
                $("#showMorePicOnly").show();

                e.preventDefault();
                var me = $(this);
                var patientid = me.data("patientid");
                var diseaseid = me.data("diseaseid");
                self.patientid = patientid;

                var patientname = me.data("patientname");
                var statusstr = me.data("statusstr");
                self.patientname = patientname;
                $(".patient_name_title").text(patientname);
                $(".patient_name_title_statusstr").text(" [" + statusstr + "]");

                /* 异步加载4块 */
                self.resetHtml();
                self.renderPaperTplHtml(patientid);
                self.renderPipeListHtml(patientid, 10, self.filter);
                self.renderPicOnlyPipeListHtml(patientid, 10, self.filter);
                //self.renderPipeWxOpMsgListHtml(patientsid, 10);
            });

            var node = $(".patientList").find(".showPatientOneHtml");
            if (node.length == 1) {
                node.click();
            }
        },
        showPipesByTypestr: function () {
            var self = this;
            $(document).on("click", ".typestrItem", function () {
                var me = $(this);
                var items = me.parents(".typestrBox").find("input");
                if (self.hasUnCheckedType(items)) {
                    var allBtn = $(".typeAllBtn");
                    allBtn.data("ischecked", 0);
                    allBtn.addClass('btn-default').removeClass('btn-info');
                }
                var filter = self.getPipeFilter(items);
                self.renderPipeListHtml(self.patientid, 10, filter);
            });

            $(document).on("click", ".typeAllBtn", function () {
                $(".cancelAllBtn").addClass('btn-default').removeClass('btn-info');
                var me = $(this);
                me.data("ischecked", 1);
                me.addClass('btn-info').removeClass('btn-default');
                var items = me.parents(".typestrBox").find("input");
                items.prop('checked', 'checked');
                var filter = self.getPipeFilter(items);
                self.renderPipeListHtml(self.patientid, 10, filter);
            });

            $(document).on("click", ".cancelAllBtn", function () {
                var me = $(this);
                if (me.hasClass('btn-default')) {
                    me.addClass('btn-info').removeClass('btn-default');
                } else {
                    me.addClass('btn-default').removeClass('btn-info');
                }
                var items = me.parents(".typestrBox").find("input");
                items.prop('checked', false);
                var allBtn = $(".typeAllBtn");
                allBtn.data("ischecked", 0);
                allBtn.addClass('btn-default').removeClass('btn-info');
            });
        },
        getPipeFilter: function (inputs) {
            var self = this;
            var temp = [];
            inputs.each(function () {
                var me = $(this);
                if (me.is(":checked")) {
                    var value = me.val();
                    temp = temp.concat(value.split(","));
                }
            });

            self.filter['ischeckedall'] = $(".typeAllBtn").data("ischecked");
            self.filter['pipetplids'] = temp;
            return self.filter;
        },
        hasUnCheckedType: function (inputs) {
            var flag = false;
            inputs.each(function () {
                var me = $(this);
                if (!me.is(":checked")) {
                    flag = true;
                    return false;
                }
            });
            return flag;
        },
        // 通过微信查看
        showPatientOneHtmlByWX: function (patientid) {
            var self = this;
            $(".content-right").css({"visibility": "visible"});
            /* 异步加载4块 */
            self.resetHtml();
            self.renderPatientBaseHtml(patientid);
            self.renderPipeListHtml(patientid, 10, self.filter);
        },

        getWxpatientid: function () {
            return parseInt($("#wxpatientid").val());
        },

        resetHtml: function () {
            $("#papertplHtmlShell").html('');
            $("#pipeShell").html('');
            $("#picOnlyShell").html('');
        },

        //回复患者html
        renderPaperTplHtml: function (patientid) {
            $.ajax({
                "type": "get",
                "data": {
                    patientid: patientid
                },
                "dataType": "html",
                "url": "/optaskmgr/paperTplHtml",
                "success": function (data) {
                    $("#papertplHtmlShell").html(data);
                }
            });
        },

        // 医患交互流区
        renderPipeListHtml: function (patientid, page_size, filter) {
            $.ajax({
                "type": "get",
                "data": {
                    patientid: patientid,
                    page_size: page_size,
                    filter: filter
                },
                "dataType": "html",
                "url": "/pipemgr/listHtml_optask",
                "success": function (data) {
                    $("#pipeShell").html(data);
                    if ($('#pipeShell .viewer-toggle').length > 0) {
                        $('#pipeShell').viewer({
                            inline: false,
                            url: 'data-url',
                            class: 'viewer-toggle',
                            navbar: false,
                            scalable: false,
                            fullscreen: false,
                            shown: function (e) {
                            }
                        })
                        $('#pipeShell').viewer('update');
                    }
                }
            });
        },

        // 4131 只显示图片
        renderPicOnlyPipeListHtml: function (patientid, page_size, filter) {
            filter['ispiconly'] = 1;
            $.ajax({
                "type": "get",
                "data": {
                    patientid: patientid,
                    page_size: page_size,
                    filter: filter
                },
                "dataType": "html",
                "url": "/pipemgr/listHtml_optask",
                "success": function (data) {
                    $("#picOnlyShell").html(data);
                    if ($('#picOnlyShell .viewer-toggle').length > 0) {
                        $('#picOnlyShell').viewer({
                            inline: false,
                            url: 'data-url',
                            class: 'viewer-toggle',
                            navbar: false,
                            scalable: false,
                            fullscreen: false,
                            shown: function (e) {
                            }
                        })
                        $('#picOnlyShell').viewer('update');
                    }
                }
            });
            filter['ispiconly'] = 0;
        },

        // 医助交互区
        renderPipeWxOpMsgListHtml: function (patientid, page_size) {
            //var self = this;
            ////回复框显示
            //self.showWxOpMsgReply(patientid);
            ////流列表显示
            //self.showWxOpMsgDetail(patientid);
        },

        //医助的回复框
        //已经关闭此功能
        showWxOpMsgReply: function (patientid) {
            //$("#wxopmsgreply").html('');
            //$.ajax({
            //"type" : "get",
            //"data" : {
            //patientid : patientid,
            //},
            //"dataType" : "html",
            //"url" : "/wxopmsgmgr/replyoptask",
            //"success" : function(data){
            //$("#wxopmsgreply").html(data);
            //}
            //});
        },

        //医助流列表显示
        //已经关闭此功能
        showWxOpMsgDetail: function (patientid) {
            //$.ajax({
            //"type" : "get",
            //"data" : {
            //patientid : patientid,
            //page_size : 10
            //},
            //"dataType" : "html",
            //"url" : "/wxopmsgmgr/listHtml",
            //"success" : function(data){
            //$("#pipeWxOpMsgDetail").html(data);
            //}
            //});
        },

        // 更多按钮 挂点击事件
        showMoreOnClick: function () {
            var self = this;
            $(document).on("click", "#showMore", function () {

                var showType = $(this).attr('class');

                //全部流更多
                if (showType.indexOf("AP") >= 0) {
                    var offsetpipetime = self.getOffsetpipetime();
                    $.ajax({
                        "type": "get",
                        "data": {
                            patientid: self.patientid,
                            offsetpipetime: offsetpipetime,
                            page_size: 10,
                            filter: self.filter
                        },
                        "dataType": "html",
                        "url": "/pipemgr/listHtml_optask",
                        "success": function (data) {
                            if ($.trim(data) == "") {
                                $("#showMore").hide();
                            }
                            $("#pipeShell").append(data);
                            //必须得有图才能造viewer对象,否则会错误
                            if ($('#pipeShell .viewer-toggle').length > 0) {
                                $('#pipeShell').viewer({
                                    inline: false,
                                    url: 'data-url',
                                    class: 'viewer-toggle',
                                    navbar: false,
                                    scalable: false,
                                    fullscreen: false,
                                    shown: function (e) {
                                    }
                                })
                                $('#pipeShell').viewer('update');
                            }
                        }
                    });
                }

                //只看图片更多
                if (showType.indexOf("AO") >= 0) {
                    self.filter['ispiconly'] = 1;

                    //不能颠倒顺序 getOffsetpipetime需要判断this.filter
                    var offsetpipetime = self.getOffsetpipetime();

                    $.ajax({
                        "type": "get",
                        "data": {
                            patientid: self.patientid,
                            offsetpipetime: offsetpipetime,
                            page_size: 10,
                            filter: self.filter
                        },
                        "dataType": "html",
                        "url": "/pipemgr/listHtml_optask",
                        "success": function (data) {
                            if ($.trim(data) == "") {
                                $("#showMore").hide();
                            }
                            $("#picOnlyShell").append(data);
                            if ($('#picOnlyShell .viewer-toggle').length > 0) {
                                //其实只看图的话，是不需要构建对象的，但是为了保险起见
                                $('#picOnlyShell').viewer({
                                    inline: false,
                                    url: 'data-url',
                                    class: 'viewer-toggle',
                                    navbar: false,
                                    scalable: false,
                                    fullscreen: false,
                                    shown: function (e) {
                                    }
                                })
                                $('#picOnlyShell').viewer('update');
                            }
                        }
                    });
                    self.filter['ispiconly'] = 0;
                }

                ////医助流更多
                //if(showType.indexOf("AD") >= 0){
                //self.renderShowWxOpMsgMore();
                //}

            });
        },

        ////可能没有用了
        //renderShowWxOpMsgMore : function() {
        //var patientid = $(".reply-btn-wxopmsg").data("patientid");
        //var offsetcreatetime = $(".offsettime").last().data("offsetcreatetime");

        //$.ajax({
        //"type" : "get",
        //"data" : {
        //patientid : patientid,
        //page_size : 10,
        //offsetcreatetime : offsetcreatetime
        //},
        //"dataType" : "html",
        //"url" : "/wxopmsgmgr/listHtml",
        //"success" : function(data){
        //$("#pipeWxOpMsgDetail").append(data);
        //}
        //});
        //},

        ////医生交互总页面-医助流查看更多
        //showWxOpMsgMoreOnClick : function() {
        //var self = this;
        //$(document).on("click","#wxopmsgshowMore",function(){
        //self.renderShowWxOpMsgMore();
        //});
        //},

        // 获取最后一条流的createtime, 用于翻页
        getOffsetpipetime: function () {
            //解决加载更多时，只看图片流和全部流，时间冲突
            if (this.filter.ispiconly == 1) {
                return $("#picOnlyShell div.flow-item").last().data("offsetpipetime")
            } else {
                return $("#pipeShell div.flow-item").last().data("offsetpipetime");
            }
        },
        // 运营备注 挂点击事件
        addOpsRemarkOnClick: function () {
            var self = this;
            $(document).on("click", ".remarkBox-btn", function () {

                var val = $.trim($(".remarkBox-ta").val());
                if (val.length == 0) {
                    alert("请输入内容");
                    return;
                }

                var patientName = $("#patientName").val();
                var noticestr = "确定要修改" + patientName + "的备注吗？";
                if (confirm(noticestr)) {
                    $.ajax({
                        "type": "post",
                        "data": {
                            "patientid": self.patientid,
                            "content": val
                        },
                        "url": "/patientmgr/addOpsRemarkJson",
                        "success": function (data) {
                            if (data == 'ok') {
                                $(".remarkBox-notice").fadeIn(0, function () {
                                    $(this).fadeOut(1200);
                                });
                            }
                        }
                    });
                }
            });
        },

        // 创建跟进任务
        addOpTaskOnClick: function () {
            var self = this;
            $(document).on("click", ".optask-btn", function () {
                var optaskBox = $(".optaskBox");
                var contentNode = optaskBox.find(".optaskBox-content");
                var plantimeNode = optaskBox.find(".optaskBox-plantime");
                var typestrNode = optaskBox.find(".typestr");
                var levelNode = optaskBox.find(".level option:selected");

                var content = $.trim(contentNode.val());
                var plantime = $.trim(plantimeNode.val());
                var optasktplid = typestrNode.val();
                var level = levelNode.val();
                if (optasktplid.length == 0) {
                    alert("请选择任务类型");
                    return;
                }

                if (plantime.length == 0) {
                    alert("请输入下次跟进时间");
                    return;
                }

                if (!self.flag) {
                    return;
                }
                self.flag = false;

                $.ajax({
                    "type": "post",
                    "data": {
                        "patientid": self.patientid,
                        "content": content,
                        "plantime": plantime,
                        "optasktplid": optasktplid,
                        "level": level
                    },
                    "url": "/optaskmgr/addJson",
                    "success": function (data) {
                        self.flag = true;
                        var txt = "添加失败";
                        if (data == 'ok') {
                            txt = "添加成功";
                        }
                        $(".optaskBox-notice").text(txt).fadeIn(0, function () {
                            $(this).fadeOut(1200, function () {
                                contentNode.val("");
                                $('#optaskBox').modal('hide');
                            });
                        });
                        $(".optaskBox-plantime").val('');
                    }
                });
            });
        },

        // 创建感谢留言（感谢信）
        addThankLetterOnClick: function () {
            var self = this;
            $(document).on("click", ".thank-btn", function () {
                var thankBox = $("#thankBox");
                var contentNode = thankBox.find(".thankBox-content");
                var typestrNode = thankBox.find(".typestr");

                var content = $.trim(contentNode.val());
                var typestr = typestrNode.val();

                if (content.length == 0) {
                    alert("请输入内容");
                    return;
                }

                if (!self.flag) {
                    return;
                }
                self.flag = false;

                $.ajax({
                    "type": "post",
                    "data": {
                        "patientid": self.patientid,
                        "pipeid": self.pipeid,
                        "content": content,
                        "typestr": typestr
                    },
                    "url": "/lettermgr/addJson",
                    "success": function (data) {
                        self.flag = true;
                        self.pipeid = 0;
                        var txt = "添加失败";
                        if (data == 'ok') {
                            txt = "添加成功";
                        }
                        $(".thankBox-notice").text(txt).fadeIn(0, function () {
                            $(this).fadeOut(1200, function () {
                                contentNode.val("");
                                $('#thankBox').modal('hide');
                            });
                        });
                    }
                });
            });
        },

        // 快捷键创建感谢留言（感谢信）
        addThankLetterQuickOnClick: function () {
            var self = this;
            $(document).on("click", ".thankQuick", function () {
                var me = $(this);
                var flowItem = me.parents(".flow-item");
                self.pipeid = flowItem.data("pipeid");
                var content = $.trim(flowItem.find(".thankContent").text());
                var thankBox = $("#thankBox");
                thankBox.find(".thankBox-content").val(content);
            });
        },
        handleBindTask: function () {
            var self = this;
            $(document).on("click", ".bindTaskBtn", function () {
                var me = $(this);
                if (!self.canClick) {
                    return;
                }
                self.canClick = false;
                var optaskid = me.data("optaskid");
                var pipeid = me.data("pipeid");
                var status = me.data("status");
                $.ajax({
                    url: '/optaskpiperefmgr/bindOrUnbindJson',
                    type: 'post',
                    dataType: 'text',
                    data: {pipeid: pipeid, optaskid: optaskid, status: status}
                })
                    .done(function () {
                        if (me.hasClass('btn-primary')) {
                            me.removeClass('btn-primary');
                            me.data("status", 0);
                        } else {
                            me.addClass('btn-primary');
                            me.data("status", 1);
                        }
                    })
                    .fail(function () {
                    })
                    .always(function () {
                        self.canClick = true;
                    });
            })
        },

        bindLaydate: function () {
            // $(document).on("click", ".optaskBox-plantime", function(){
            // 	laydate();
            // })
        },

        handleCourseSelect: function () {

            $(document).on("change", ".courseSelect", function () {
                var me = $(this);
                var shellNode = me.parent().siblings().find(".lessonSelectShell");
                var courseid = me.val();
                if (!courseid) {
                    return;
                }

                $.getJSON("/coursemgr/getLessonsJson?courseid=" + courseid, function (jsondata) {
                    var str = '<select class="lessonSelect form-control">';
                    str += '<option value="">请选择课文...</option>';

                    $.each(jsondata, function (i, item) {
                        var brief = encodeURIComponent(item.brief);
                        str = str + '<option data-brief="' + brief + '" value="' + item.id + '">' + item.title + '</option>';
                    })

                    str += "\n</select>";
                    shellNode.html(str);
                })
            })
        },

        handleLessonSelect: function () {
            $(document).on("change", ".lessonSelect", function () {
                var me = $(this);
                var itemNode = me.closest(".tab-pane");
                var textareaNode = itemNode.find(".reply-msg");

                var selectedNode = me.find("option:selected");
                var brief = selectedNode.data("brief");
                if (brief) {
                    brief = decodeURIComponent(brief);
                    textareaNode.val(brief);
                }
            })
        },

        // 顶部回复消息 挂点击事件
        replyTopBtnOnClick: function () {
            var self = this;
            $(document).on("click", ".reply-topbtn", function (e) {
                e.preventDefault();
                var me = $(this);

                var open_id = $(".relation-group").val();
                var shellNode = me.parents('.ops-reply');
                var notice = shellNode.next(".reply-notice");
                var textareaNode = shellNode.find(".reply-msg");
                var msg = $.trim(textareaNode.val());
                if (!msg) {
                    notice.text("请输入发送信息或上传图片");
                    return;
                }

                if (!open_id) {
                    alert("未找到openid,无法发送!");
                    return;
                }

                var dealwithtplid = 0;

                var obj = {
                    "content": msg,
                    "open_id": open_id
                };
                if (!self.isSend) {
                    self.isSend = true;
                    self.sendDefaultMsg(obj, textareaNode, notice, dealwithtplid);
                }
            });
        },

        replyTriggerBtnOnClick: function () {
            $(document).on("click", ".reply-triggerBtn", function () {
                var me = $(this);
                var pnode = me.parents(".flow-item");
                var replySectionNode = pnode.find(".replySection");
                //me.hide();
                if (replySectionNode.is(':hidden')) {
                    replySectionNode.show().find('.tab-content .tab-pane:first-child textarea')[0].focus();
                    replySectionNode.find(".speech-input").speech();
                } else {
                    replySectionNode.hide();
                }

                var select2Nodes = pnode.find(".js-select2");
                select2Nodes.each(function () {
                    var select2Node = $(this);
                    select2Node.select2();
                });
            })
        },

        replyCtrlEnter: function () {
            $(document).on("keyup", ".replySection .tab-pane textarea", function (e) {
                var me = $(this);
                if ((e.ctrlKey || e.metaKey) && (e.keyCode == 13 || e.keyCode == 10)) {
                    me.siblings('p').find('.reply-btn').click();
                }
            })
        },

        // 回复消息 挂点击事件
        replyBtnOnClick: function () {
            var self = this;
            $(document).on("click", ".reply-btn", function (e) {
                e.preventDefault();
                var me = $(this);
                var type = me.data("type");
                var patientid = me.data("patientid");

                var shellNode = me.parents('.flow-item');

                var itemNode = me.closest(".tab-pane")
                var notice = me.siblings(".reply-notice");
                var textareaNode = itemNode.find(".reply-msg");
                var dealwithNode = itemNode.find(".handleSelect");
                var wenzhenNode = itemNode.find(".wenzhen");
                var picNode = itemNode.find("input[name='pictureid']");
                var lessonSelectNode = itemNode.find(".lessonSelect");

                var open_id = shellNode.data('openid');
                var msg = $.trim(textareaNode.val());
                var pictureid = Number(picNode.val());
                var papertpl_url = wenzhenNode.val();
                var dealwithtplid = dealwithNode.val();
                var lessonid = lessonSelectNode.val();

                if (!open_id) {
                    alert("未找到openid,无法发送!");
                    return;
                }

                if (!msg && type !== "Pic") {
                    notice.text("请输入发送信息");
                    return;
                }

                if (type === "Wenzhen") {
                    if (!papertpl_url) {
                        notice.text("请选择问诊量表");
                        return;
                    }
                }

                if (type === "Pic") {
                    if (!pictureid) {
                        notice.text("请选择图片");
                        return;
                    }
                }

                if (type === "Article") {
                    if (!lessonid) {
                        notice.text("请选择课文");
                        return;
                    }
                }

                var obj = {
                    "content": msg,
                    "open_id": open_id,
                    "pictureid": pictureid,
                    "papertpl_url": papertpl_url,
                    "lessonid": lessonid
                };
                if (!self.isSend) {
                    self.isSend = true;
                    if (type === "TxtMsg") {
                        self.sendTxtMsg(obj, textareaNode, notice, dealwithtplid);
                    }

                    if (type === "Pic") {
                        self.sendPicMsg(obj, textareaNode, notice);
                    }

                    if (type === "Wenzhen") {
                        self.sendWenzhenMsg(obj, textareaNode, notice);
                    }

                    if (type === "Article") {
                        self.sendArticleMsg(obj, textareaNode, notice);
                    }
                }
            });
        },

        sendTxtMsg: function (obj, textareaNode, notice, dealwithtplid) {
            var self = this;
            if (obj.content) {
                $.ajax({
                    "type": "post",
                    "data": obj,
                    "url": "/pipemgr/pushMsgByOpenidJson",
                    "success": function (response) {
                        if (response.errno === '0') {
                            if (dealwithtplid) {
                                self.handledealwithtpl(dealwithtplid);
                            }
                            self.afterSendMsg(textareaNode, notice, response);
                        } else {
                            alert("发送失败，请尝试刷新页面");

                        }
                    },
                    "error": function () {
                        self.isSend = false;
                        alert("发送失败，请尝试刷新页面");

                    }
                });
            }

        },

        sendPicMsg: function (obj, textareaNode, notice) {
            var self = this;
            if (obj.pictureid) {
                $.ajax({
                    "type": "post",
                    "data": obj,
                    "url": "/pipemgr/pushwxpicmsgjson",
                    "success": function (data) {
                        self.isSend = false;
                        if (data === 'ok') {
                            self.afterSendMsg(textareaNode, notice);
                        }
                    },
                    "error": function () {
                        self.isSend = false;
                    }
                });
            }
        },

        sendWenzhenMsg: function (obj, textareaNode, notice) {
            var self = this;
            $.ajax({
                "type": "post",
                "data": obj,
                "url": "/pipemgr/pushWenzhenMsgJson",
                "success": function (data) {
                    if (data === 'ok') {
                        self.afterSendMsg(textareaNode, notice);
                    }
                },
                "error": function () {
                    self.isSend = false;
                }
            });
        },

        sendArticleMsg: function (obj, textareaNode, notice) {
            var self = this;
            $.ajax({
                "type": "post",
                "data": obj,
                "url": "/pipemgr/pushLessonJson",
                "success": function (data) {
                    if (data === 'ok') {
                        self.afterSendMsg(textareaNode, notice);
                    }
                },
                "error": function () {
                    self.isSend = false;
                }
            });
        },

        sendWxOpMsg: function (patientid, content, textareaNode, notice) {
            var self = this;

            $.ajax({
                "type": "post",
                "url": "/wxopmsgmgr/replyJson",
                dataType: "text",
                data: {
                    patientid: patientid,
                    content: content
                },
                "success": function (data) {
                    if (data === 'fine') {
                        self.afterSendMsg(textareaNode, notice);
                        $(".patientid-" + patientid).click();
                    }
                },
                "error": function () {
                    self.isSend = false;
                }
            });
        },

        handledealwithtpl: function (dealwithtplid) {
            var self = this;
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

        afterSendMsg: function (textareaNode, notice, response) {
            var self = this;
            self.isSend = false;
            textareaNode.val("");
            notice.text("信息已发送");
            setTimeout(function () {
                notice.text("");
            }, 4000);

            var patientid = $(".removePatient").data("id");
            $("#new_" + patientid).text("").removeClass("red");
            $("#changeNew").text("加new!").removeClass("btn-primary").addClass("btn-default").data("value", 1);
            $(".divOnSelected").find('.showOptask').click();

            // 还是决定采用同步检查，怕异步检查请求还没返回，运营就离开了看不到。
            if (typeof response === 'object' && response.data.has_optask_of_quickconsult === '1') {
                let options = {
                    body: ' 当前患者还有未处理的快速咨询任务，请及时处理',
                    icon: 'fa fa-warning',
                    type: 'warning',
                    align: 'center',
                };
                ws.showOneUINotify(options);
            }
        },

        // 事件区tab
        handleTabClick: function () {
            $(document).on("click", ".tab-menu>li", function () {
                var me = $(this);
                var index = me.index();
                var tab = me.parents(".tab");
                var contents = tab.children(".tab-content").children(".tab-content-item");
                me.addClass("active").siblings().removeClass("active");
                contents.eq(index).show().siblings().hide();
            });
        },

        // pipeAll 挂点击事件
        pipeAllOnClick: function () {
            var self = this;
            $(document).on("click", "#pipeAll", function () {
                $("#showMore").show();
                self.renderPipeListHtml(self.patientid, 10);
            });
        },
        handlePipeMainBox: function () {
            //var items = $(".pipeMainBox-c-item");
            //$(".pipeMainBox-t>a").on("click", function(){
            //var me = $(this);
            //var index = me.index();
            //me.removeClass('btn-default').addClass('btn-success').siblings().removeClass('btn-default').removeClass('btn-success').addClass('btn-default');
            //items.hide();
            //items.eq(index).show();
            //})
        },
        //医助回复挂事件
        replybtnwxopmsgOnClick: function () {
            $(document).on("click", ".reply-btn-wxopmsg", function (e) {
                e.preventDefault();
                var me = $(this);

                var patientid = me.data("patientid");
                var content = $("#content").val();

                if (content.trim() == '') {
                    alert("回复内容不能 为空");
                } else {
                    $.ajax({
                        type: "post",
                        url: "/wxopmsgmgr/replyJson",
                        data: {
                            patientid: patientid,
                            content: content
                        },
                        dataType: "text",
                        success: function () {
                            var recordNum = $(".patientid-" + patientid).parent().prev().text();
                            $(".patientid-" + patientid).parent().prev().text(++recordNum);
                            //$(".pipesWxOpMsgTitle").removeClass("btn btn-success").addClass("tab-btn-highlight");
                            $(".patientid-" + patientid).click();
                        }
                    });
                }

            });
        },
        TriggerBtnOnClick: function () {
            $(document).on(
                "click",
                ".TriggerBtn",
                function () {
                    var me = $(this);
                    var TriggerContent = $(this).parents('.TriggerBox')
                        .find(".TriggerContent");
                    if (TriggerContent.is(":visible")) {
                        TriggerContent.hide();
                        me.text('展开');
                    } else {
                        TriggerContent.show();
                        me.text('收起');
                    }
                });
        }
    };

    // 初始化页面所有事件
    Page_PatientMgr_List.init();
});
