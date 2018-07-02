$(function(){
    var app ={
        canSend : true,
        init : function(){
            var self = this;
            self.replyMsg();
            self.replyMsg_studyplan();
            self.handleisok();
            self.handleActItemTClick();

            //运营把患者加入sunflower项目
            self.joinSunflower();
            //非sunflower项目
            self.notJoinSunflower();
            //运营给合作患者推荐某类分组
            self.haveSubtypestr();
            //运营给合作患者设置入组时服用择思达时长
            self.handleDrugMonthcntBtn();
        },
        handleActItemTClick : function(){
            $(document).on("click", ".actItem-t", function(){
                var me = $(this);
                var actItemShell = me.parents( ".actItemShell" );
                actItemShell.find(".actItem-c").hide();
                actItemShell.find(".replyShell").hide();
                actItemShell.find(".okBtnShell").hide();
                me.parents(".actItem").find(".actItem-c").show();
                me.parents(".actItem").find(".replyShell").show();
                me.parents(".actItem").find(".okBtnShell").show();
            })
        },
        replyMsg : function(){
            var self = this;
            $(document).on("click", ".reply-pgroupbtn", function(){
                var me = $(this);
                var replyMsg = me.parents(".replyShell").find(".reply-msg");
                var val = $.trim( replyMsg.val() );
                if( val.length == 0 ){
                    alert("请填写内容");
                    return;
                }
                if(!self.canSend){
                    self.canSend = false;
                    return;
                }

                var dealwithtplid = 0;
                var dealwith = me.parents(".replyBox").find(".handleSelect");
                if (dealwith.length) {
                    dealwithtplid = dealwith.val();
                    self.handledealwithtpl(dealwithtplid);
                }

                $.ajax({
    				"type" : "post",
    				"data" : {
    					patientid : self.getPatientid(),
                        content : val,
                        patientpgroupactitemid : self.getPatientpgroupactitemid(me)
    				},
    				"dataType" : "text",
    				"url" : "/patientpgroupactitemmgr/replyMsgJson",
    				"success" : function(data) {
                        self.canSend = true;
                        me.text("已发送").removeClass('btn-default').addClass('btn-success');
    				}
    			});
            })
        },
        replyMsg_studyplan : function(){
            var self = this;
            $(document).on("click", ".reply-studyplanbtn", function(){
                var me = $(this);
                var replyMsg = me.parents(".replyShell").find(".reply-msg");
                var val = $.trim( replyMsg.val() );
                if( val.length == 0 ){
                    alert("请填写内容");
                    return;
                }
                if(!self.canSend){
                    self.canSend = false;
                    return;
                }

                var dealwithtplid = 0;
                var dealwith = me.parents(".replyBox").find(".handleSelect");
                if (dealwith.length) {
                    dealwithtplid = dealwith.val();
                    self.handledealwithtpl(dealwithtplid);
                }

                var patientpgrouprefid = me.parents(".replyBox").find(".patientpgrouprefid").val();

                $.ajax({
    				"type" : "post",
    				"data" : {
                        content : val,
                        patientpgrouprefid : patientpgrouprefid
    				},
    				"dataType" : "text",
    				"url" : "/studyplanmgr/replyMsgJson",
    				"success" : function(data) {
                        self.canSend = true;
                        me.text("已发送").removeClass('btn-default').addClass('btn-success');
    				}
    			});
            })
        },
        handledealwithtpl : function(dealwithtplid) {
            $.ajax({
                "type" : "post",
                "url" : "/dealwithtplmgr/sendcntjson",
                dataType : "text",
                data : {
                    dealwithtplid : dealwithtplid
                },
                "success" : function(data) {
                }
            });
        },
        joinSunflower : function(){
            var self = this;
            $(document).on("click", ".sunflowerBtn", function(){
                var me = $(this);
                if( !self.canSend || me.hasClass("btn-primary") ){
                    return;
                }
                var patientid = me.data("patientid");

                if (!confirm("确认此患者符合进入sunflower项目的条件吗？")) {
                    return;
                }
                self.canSend = false;
                $(".notSunflowerBtn").addClass("none");
                $(".choicePgroup-block").removeClass("none");

                $.ajax({
                    "type" : "post",
                    "url" : "/patient_hezuomgr/addjson",
                    dataType : "text",
                    data : {
                        patientid : patientid
                    },
                    "success" : function(data) {
                        me.text("已添加").addClass('btn-primary');
                        if(data == "hadCreate"){
                            alert("患者已入过sunflower项目！");
                        }
                        if(data == "hadSuggestCourses"){
                            $(".choicePgroups").addClass("btn-primary");
                        }
                        self.canSend = true;
                    }
                });
            });
        },
        notJoinSunflower : function(){
            var self = this;
            $(document).on("click", ".notSunflowerBtn", function(){
                var me = $(this);
                if(me.hasClass("btn-primary") ){
                    return;
                }

                $(".sunflowerBtn").addClass("none");
                $(".notSunflowerTag-block").removeClass("none");
                me.addClass('btn-primary');
            });
        },
        haveSubtypestr : function(){
            var self = this;
            $(document).on("click", ".choicePgroups", function(){
                var me = $(this);
                if( !self.canSend ){
                    return;
                }
                self.canSend = false;
                me.toggleClass('btn-primary');
                var patientid = me.data("patientid");
                var btns = me.parent().children();

                var arr = new Array();
                btns.each(function() {
                    var btn = $(this);
                    if(btn.hasClass("btn-primary")){
                        arr.push(btn.data("subtypestr"));
                    }
                });

                var pgroup_subtypestrs = arr.join(",");
                // alert(subtypestrs);
                $.ajax({
                    "type" : "post",
                    "url" : "/patient_hezuomgr/choicePgroupsJson",
                    dataType : "text",
                    data : {
                        patientid : patientid,
                        pgroup_subtypestrs : pgroup_subtypestrs
                    },
                    "success" : function(data) {
                        self.canSend = true;
                    }
                });
            });
        },
        handleDrugMonthcntBtn : function(){
            var self = this;
            $(document).on("click", ".drugMonthcntBtn", function(){
                var me = $(this);
                if( !self.canSend ){
                    return;
                }
                self.canSend = false;
                var patientid = me.data("patientid");
                var drug_monthcnt_when_create = me.parents(".monthcntShell").find(".monthcnt").val();
                $.ajax({
                    "type" : "post",
                    "url" : "/patient_hezuomgr/setDrugMonthcntJson",
                    dataType : "text",
                    data : {
                        patientid : patientid,
                        drug_monthcnt_when_create : drug_monthcnt_when_create
                    },
                    "success" : function(data) {
                        if('ok' == data){
                            self.canSend = true;
                            alert("设置成功！");
                        }
                    }
                });
            });
        },
        handleisok : function(){
            var self = this;
            $(document).on("click", ".isokBtn", function(){
                var me = $(this);
                var isok = me.data("isok");
                var patientpgroupactitemid = self.getPatientpgroupactitemid(me);

                if(!self.canSend || me.hasClass("btn-primary") ){
                    return;
                }
                self.canSend = false;

                $.ajax({
                    "type" : "post",
                    "url" : "/patientpgroupactitemmgr/modifyisokjson",
                    dataType : "text",
                    data : {
                        isok : isok,
                        patientpgroupactitemid : patientpgroupactitemid
                    },
                    "success" : function(data) {
                        if (data == 'ok') {
                            self.afterHandleIsok(isok, me);
                            self.canSend = true;
                        }
                    }
                });
                self.refreshSatisfied(isok);

            });
        },
        afterHandleIsok : function(isok, isokBtnNode){
            var self = this;
            var actitem = isokBtnNode.parents(".actItem").find(".red");

            isokBtnNode.addClass('btn-primary');
            isokBtnNode.siblings().removeClass('btn-primary');
            if(isok == 1){
                actitem.text("(符合)");
            }else{
                actitem.text("(不符合)");
            }
        },
        refreshSatisfied : function (status) {
            var self = this;
            var satisfied_parse = $("#satisfied").html();

            var satisfied_before = satisfied_parse.split("/")[0];
            var else_string = satisfied_parse.split("/")[1];

            var satisfied_before_num = satisfied_before.split("：")[1];
            var status = parseInt(status);
            var satisfied_before = parseInt(satisfied_before_num);

            if(status == 1){
                var satisfied = satisfied_before + 1;
            }else{
                var satisfied = satisfied_before - 1;
            }

            $("#satisfied").text("(符合程度：" + satisfied + "/" + else_string );
        },
        getIsNote: function(node){
            var isnote = 0 ;
            var node = node.parents(".actItem");
            noteBtn = node.find(".noteBtn");
            if( noteBtn.is(":checked")){
                isnote = 1;
            }
            return isnote;
        },
        getPatientid: function(){
            return parseInt($("#patientid").val());
        },
        getPatientpgroupactitemid: function(node){
            var node = node.parents(".actItem");
            return node.find(".patientpgroupactitemid").val();
        }
    };
    app.init();
})
