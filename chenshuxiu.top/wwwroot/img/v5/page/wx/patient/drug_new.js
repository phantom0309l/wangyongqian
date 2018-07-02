$(function () {

    var tooltips = {
        index: 1,
        init: function (options) {
            var self = this;
            var index = self.index;
            var srcNode = options.srcNode;
            if (srcNode.data("hastipnode")) {
                self.showTipNode(srcNode.data("hastipnode"));
                return;
            }
            var errMsg = options.errMsg;
            var cLeft = options.cLeft || 0;
            var cTop = options.cTop || 0;
            var tipNode = self.createTipNode(index, errMsg);
            self.setTipNodePosition(srcNode, tipNode, cLeft, cTop);
            $("body").append(tipNode);
            self.showTipNode(index);
            srcNode.data("hastipnode", self.index);
            self.index++;

        },
        createTipNode: function (index, errMsg) {
            var str = '<div class="yitip white topMiddle" id="yitip-' + index + '">\
                        <div class="yitip-content">' + errMsg + '</div>\
                        <div class="yitip-trigon-border"></div>\
                        <div class="yitip-trigon"></div>\
                    </div>';
            return $(str);
        },
        setTipNodePosition: function (srcNode, tipNode, cLeft, cTop) {
            var offsetObj = srcNode.offset();
            var left = offsetObj.left - cLeft;
            var top = offsetObj.top - 35 - cTop;
            tipNode.css({
                left: left,
                top: top
            });
        },
        showTipNode: function (index) {
            var tipNode = $("#yitip-" + index);
            tipNode.fadeIn(500, function () {
                setTimeout(function () {
                    tipNode.fadeOut(400);
                }, 1200);
            });
        }
    };
    var app = {
        canClick: true,
        drugResult : {},
        otherContent : "",
        preSaveDrug : "",
        init: function () {
            var self = this;
            self.handleTab();
            self.initSomething();
            self.drugPreSave();
            self.goNext();
            self.handleDrugCheck();
            self.handleDrugDose();
            self.renderDrugTableView();
        },
        initSomething : function(){
            var self = this;
            self.initDrugResult();
            self.setDrugcnt();
            self.setLayout();
            //给已添加的药添加 drugMenu-active
            $(".drugMenu").find("li").each(function(i){
                var me = $(this);
                var medicineid = me.data("medicineid");
                if( self.isPreSaved(medicineid) ){
                    me.addClass('drugMenu-hasSave');
                    var preSaveDrug = self.preSaveDrug;
                    if(medicineid>0){
                        $(".drugItem").eq(i).find(".drugDose").val(preSaveDrug["drug_dose"]);
                    }else{
                        $(".drugItemOther").find(".content").val(preSaveDrug["content"]);
                    }
                }
            });
            var hasSaveNodes = $(".drugMenu-hasSave");
            if(hasSaveNodes.length){
                hasSaveNodes.eq(0).click();
            }else{
                $(".drugMenu").find("li").eq(0).click();
            }
        },
        isPreSaved : function(medicineid){
            var self = this;
            var d = self.drugResult;
            var flag = false;
            for( var k in d ){
                if( d[k][0]["medicineid"] == medicineid ){
                    flag = true;
                    self.preSaveDrug = d[k][0];
                    break;
                }
            }
            return flag;
        },
        setLayout : function(){
            var H = $(window).height();
            var h = H - 56 - 45;
            $(".drugBox-l").css({"height" : h});
            $(".drugBox-r").css({"height" : h});
            $(".drugBox").css({"height" : h});
        },
        handleTab: function () {
            var self = this;
            var drugItemBox = $(".drugItemBox");
            $(".drugMenu>li").on("click", function () {
                var me = $(this);
                var index = me.index();
                drugItemBox.show();
                me.addClass("drugMenu-active").siblings().removeClass("drugMenu-active");
                drugItemBox.find(".drugItem").eq(index).show().siblings().hide();
            });
        },
        handleDrugCheck: function () {
            var self = this;
            $(".drugCheckBtn").on("click", function () {
                var me = $(this);
                var is_hezuo_doctor = self.isHezuoDoctor();
                var is_from_baodao = self.isFromBaodao();
                //防止重复提交
                if (!self.canClick) {
                    return;
                }
                self.canClick = false;
                var drugdata = self.getDrugData();
                //提交数据
                $.ajax({
                    type: "POST",
                    url: "/patient/drugcheckjson",
                    data : { "drugdata" : drugdata},
                    dataType: "text",
                    success: function (data) {
                        self.removeDrugData();
                        if ( is_from_baodao ) {
                            if(is_hezuo_doctor && "closeFirstTel"!=data){
                                var url = "/info/noticelilly";
                            }else {
                                var url = "/common/result?noticestr=孩子的治疗情况已提交成功！&closepage=1";
                            }
                        }else{
                            var url = "/paper/scale?ename=adhd_iv";
                        }
                        window.location.href = url;
                    },
                    error: function () {
                    }
                })
            })
        },
        goNext: function () {
            var self = this;
            $(".goNext").on("click", function () {
                var me = $(this);
                if( me.hasClass('goNextDefault')){
                    alert("请填写用药信息!");
                    return;
                }
                var cntnode = $("#drugcnt");
                if (cntnode.length && parseInt(cntnode.text()) > 0) {
                    //有的手机键盘弹起，其它的保存会误解，做下自动保存处理
                    self.otherAutoPreSave();
                    self.setDrugData();
                    window.location.href = "/patient/drugcheck";
                }else{
                    alert("请填写用药信息!");
                }
            })
        },
        otherAutoPreSave: function(){
            var otherNode = $(".drugItemOther");
            var contentNode = otherNode.find(".content");
            var preSaveNode = otherNode.find(".drugPreSave");
            var val = $.trim(contentNode.val());
            if(val.length){
                preSaveNode.click();
            }
        },
        drugPreSave: function () {
            var self = this;
            $(".drugPreSave").on("click", function () {
                var me = $(this);
                //验证数据
                if (!self.checkData(me)) {
                    return;
                }
                //防止重复提交
                if (!self.canClick) {
                    return;
                }
                self.canClick = false;
                var obj = self.getData(me);
                self.addDrugResult(obj);
                self.afterSaveLocal(me);
                self.canClick = true;
            })
        },
        afterSaveLocal: function (node) {
            var self = this;
            node.text("已添加");
            $(".drugMenu-active").addClass('drugMenu-hasSave');
            $(".stopDrugRemark").hide();
            self.setDrugcnt();
        },
        setDrugcnt : function(){
            var self = this;
            var cnt = self.getmedicineCnt();
            if(cnt==0){
                $(".goNext").addClass('goNextDefault');
            }else{
                $(".goNext").removeClass('goNextDefault');
            }
            $("#drugcnt").text(cnt);
        },
        getmedicineCnt : function(){
            var self = this;
            var cnt = self.getObjLen( self.drugResult );
            return cnt;
        },
        checkData: function (node) {
            var self = this;
            var flag = true;
            var formNode = node.parents(".am-form");
            var isother = self.isOther(formNode);

            if(isother){
                var content = formNode.find(".content");
                var val = $.trim(content.val());
                if ( val.length == 0 ) {
                    tooltips.init({
                        srcNode: content,
                        errMsg: "请填写用药信息",
                        cLeft: 0
                    })
                    flag = false;
                }

            }else{
                var drugDose = formNode.find(".drugDose");
                var drugDoseVal = $.trim(drugDose.val());
                var reg = /\d+\.?\d*/;
                if (!reg.test(drugDoseVal)) {
                    tooltips.init({
                        srcNode: drugDose,
                        errMsg: "请填写正确的数字格式",
                        cLeft: 0
                    })
                    flag = false;
                }
            }
            return flag;
        },
        handleDrugDose : function(){
            $(document).on("blur", ".drugDose", function(){
                var me = $(this);
                var pnode = me.parents(".am-form");
                var remarkNode = pnode.find(".stopDrugRemark");
                var contentNode = remarkNode.find(".content");
                var val = parseInt(me.val());
                if( val == 0 ){
                    remarkNode.show();
                }else{
                    remarkNode.hide();
                    contentNode.val("");
                }
            })
        },
        isOther : function(node){
            return node.hasClass('drugItemOther');
        },
        getData: function (node) {
            var self = this;
            var formNode = node.parents(".am-form");
            var content = $.trim( formNode.find(".content").val() );
            if( formNode.hasClass('drugItemOther') ){
                return {
                    "medicineid": 0,
                    "medicine_name": "other",
                    "drug_dose": "",
                    "content": content
                };
            }else{
                var drugDose = formNode.find(".drugDose");
                var medicineid = formNode.data("medicineid");
                var medicine_name = formNode.data("medicinename");
                var unit = formNode.data("unit");
                return {
                    "medicineid": medicineid,
                    "medicine_name": medicine_name,
                    "drug_dose": drugDose.val(),
                    "content": content,
                    "unit" : unit
                };
            }
        },
        isFromBaodao: function () {
            var val = 0;
            var node = $("#is_from_baodao");
            if (node.length) {
                val = parseInt(node.val());
            }
            return val > 0;
        },
        isHezuoDoctor: function () {
            var val = 0;
            var node = $("#is_hezuo_doctor");
            if (node.length) {
                val = parseInt(node.val());
            }
            return val > 0;
        },
        createViewTrstr : function(arr){
            var self = this;
            var str = "";
            $.each(arr, function(i,v){
                if( v["medicine_name"] == "other" ){
                    self.otherContent = v["content"];
                    return true;
                }
                var a = v["drug_dose"] + v["unit"];
                str = str + '<tr>\
                    <td>' + v["medicine_name"] + '</td>\
                    <td>' + a + '</td>\
                    </tr>';
            });
            return str;
        },
        renderDrugTableView : function(){
            var self = this;
            var drugTableView = $(".drugTableView");
            var str = "";
            if( self.hasDrugData() ){
                var drugdata = self.getDrugData();
                if(drugdata){
                    $.each(drugdata, function(k,arr){
                        str = str + self.createViewTrstr(arr);
                    })
                }
            }
            drugTableView.find("tbody").html(str);
            if(self.otherContent){
                $(".otherDrugBox").find(".otherDrug").html(self.otherContent);
                $(".otherDrugBox").show();
            }
        },
        addDrugResult : function(obj){
            var medicine_name = obj.medicine_name;
            var self = this;
            if( !self.drugResult[medicine_name] ){
                self.drugResult[medicine_name] = [];
            }
            self.drugResult[medicine_name][0] = obj;
            return obj;
        },
        initDrugResult : function(){
            var self = this;
            if( self.hasDrugData() ){
                var d = self.getDrugData();
                self.drugResult = d;
            }
        },
        hasDrugData : function(){
            var drugdata = window.localStorage.getItem("drugdata");
            return !!drugdata;
        },
        setDrugData : function(){
            var self = this;
            var obj = self.drugResult;
            window.localStorage.setItem("drugdata", JSON.stringify(obj));
        },
        getDrugData : function(){
            var drugdata = window.localStorage.getItem("drugdata");
            return JSON.parse(drugdata);
        },
        removeDrugData : function(){
            window.localStorage.removeItem("drugdata");
        },
        getObjLen : function(obj){
            var n = 0;
            for(var i in obj){
                if(obj[i].length==0){
                    continue;
                }
                n++;
            }
            return n;
        }
    };

    app.init();

})
