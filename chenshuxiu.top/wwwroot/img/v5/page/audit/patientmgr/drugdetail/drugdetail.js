$(function(){
    var app = {
        canClick : true,
        init : function(){
            var self = this;
            self.triggerAddDrugItem();
            self.triggerStopDrug();
            self.addDrugItem();
            self.addDrug();
            self.stopDrug();
            self.handleSearchMedicines();
            self.handleMedicineChoice();
            self.deleteDrugItem();
            self.deleteDrugSheet();
            self.handleTriggerAddDrugBtn();
            self.handleNoDrug();
        },
        triggerAddDrugItem : function(){
            $(".triggerAddDrugItem").on("click", function(){
                var me = $(this);
                var patientid = me.data("patientid");
                var medicineid = me.data("medicineid");
                $.ajax({
                    url: '/patientmgr/drugItemAddHtml',
                    type: 'get',
                    dataType: 'html',
                    data: {patientid: patientid, medicineid: medicineid}
                })
                .done(function(data) {
                    $("#drugItemAdd").html(data);
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });

            })
        },
        triggerStopDrug : function(){
            $(".triggerstopDrug").on("click", function(){
                var me = $(this);
                var patientid = me.data("patientid");
                var medicineid = me.data("medicineid");
                $.ajax({
                    url: '/patientmgr/drugstopHtml',
                    type: 'get',
                    dataType: 'html',
                    data: {patientid: patientid, medicineid: medicineid}
                })
                .done(function(data) {
                    $("#drugStop").html(data);
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });

            })
        },
        addDrugItem : function(){
            var self = this;
            self.addDrugItemImp(".addDrugItemBtn", ".drugBox");
        },
        addDrug : function(){
            var self = this;
            self.addDrugItemImp(".addDrugBtn", "#drugitemForm");
        },
        addDrugItemImp : function(btnstr, nodestr){
            var self = this;
            $(document).on("click", btnstr, function(){
                var me = $(this);
                if( true == self.checkData() ){
                    if(!self.canClick){
                        return;
                    }
                    self.canClick = false;
                    formNode = $(nodestr);
                    var dataArr = formNode.serializeArray();
                    var postData = self.getPostData(dataArr);
                    $.ajax({
                        url: '/patientmgr/addDrugItemJson',
                        type: 'post',
                        dataType: 'text',
                        data: postData
                    })
                    .done(function() {
                        alert("已提交");
                        self.canClick = true;
                        window.location.href = location.href;
                    })
                    .fail(function() {
                        console.log("error");
                    })
                    .always(function() {
                        console.log("complete");
                    });
                }
            })
        },
        stopDrug : function(){
            var self = this;
            $(document).on("click", ".stopDrugBtn", function(){
                var me = $(this);
                if( true == self.checkData() ){
                    if(!self.canClick){
                        return;
                    }
                    self.canClick = false;
                    var dataArr = $(".drugBox").serializeArray();
                    var postData = self.getPostData(dataArr);
                    $.ajax({
                        url: '/patientmgr/stopDrugJson',
                        type: 'post',
                        dataType: 'text',
                        data: postData
                    })
                    .done(function() {
                        alert("已提交");
                        self.canClick = true;
                        window.location.href = location.href;
                    })
                    .fail(function() {
                        console.log("error");
                    })
                    .always(function() {
                        console.log("complete");
                    });
                }
            })
        },
        deleteDrugItem : function(){
            var self = this;
            $(".deleteDrugItemBtn").on("click", function(){
                if( confirm("确定要删除吗? 删除后会影响患者最新用药状态，需要重新审核患者的当前用药!") ){
                    var me = $(this);
                    var drugitemid = me.data("drugitemid");
                    $.ajax({
                        type: "post",
                        url: "/drugitemmgr/deleteJson",
                        data:{"drugitemid" : drugitemid},
                        dataType: "text",
                        success : function(){
                            alert("删除成功");
                            window.location.href = location.href;
                        }
                    });
                }
            });
        },
        deleteDrugSheet : function(){
            var self = this;
            $(".deleteDrugSheetBtn").on("click", function(){
                if( confirm("确定要删除吗? ") ){
                    var me = $(this);
                    var drugsheetid = me.data("drugsheetid");
                    $.ajax({
                        type: "post",
                        url: "/drugsheetmgr/deleteJson",
                        data:{"drugsheetid" : drugsheetid},
                        dataType: "text",
                        success : function(){
                            alert("删除成功");
                            window.location.href = location.href;
                        }
                    });
                }
            });
        },
        handleTriggerAddDrugBtn : function(){
            $(".triggerAddDrugBtn").click(function(){
                var shellNode = $(".addDrugBoxShell");
                if(shellNode.is(":visible")){
                    shellNode.hide();
                }else{
                    shellNode.show();
                }
            })
        },
        handleSearchMedicines : function(){
            $(".searchMedicine").on("click", function(){
                var val = $.trim( $(".medicine_name").val() );
                if(val.length == 0){
                    alert("请输入药名");
                    return;
                }
                $.ajax({
                    type: "post",
                    url: "/medicinemgr/listOfSearchHtml",
                    data: {"medicine_name" : val},
                    dataType: "html",
                    success : function(data){
                        $(".medicineBox").html(data);
                    }
                });
            })
        },
        handleMedicineChoice : function(){
            $(document).on("click", ".medicineChoice", function(){
                var me = $(this);
                var form = $("#drugitemForm");
                var medicineidNode = form.find('.medicineid');
                var selectedDrugNameNode = form.find(".selectedDrugName");
                var medicineUnitNode = form.find(".medicineUnit");

                var medicineid = me.data("medicineid");
                var medicinename = me.data("medicinename")
                var unit = me.data("unit");
                medicineidNode.val(medicineid);
                selectedDrugNameNode.text(medicinename);
                medicineUnitNode.text(unit);
                form.show();
            })
        },
        handleNoDrug : function(){
            var self = this;
            $(".noDrugBtn").on("click", function(){
                if( confirm("确定要标记为不服药吗？") ){
                    var me = $(this);
                    var patientid = self.getPatientid();
                    $.ajax({
                        type: "post",
                        url: "/patientmgr/nodrugJson",
                        data:{"patientid" : patientid},
                        dataType: "text",
                        success : function(){
                            alert("标记成功");
                            me.text("已标记为不服药患者");
                        }
                    });
                }
            })
        },
        checkData : function(){
            var flag = true;
            var dataArr = $(".drugBox").serializeArray();
            $.each(dataArr, function(i,item){
                var name = item['name'];
                var value = $.trim(item['value']);
                if(name=='record_date'){
                    if(value.length==0){
                        alert("请填写日期");
                        flag = false;
                        return false;
                    }
                }
                if(name=='value' || name == 'drug_dose'){
                    if(value.length==0 || value==0){
                        alert("请填写正确的用药剂量");
                        flag = false;
                        return false;
                    }
                }
            })
            return flag;
        },
        getPostData : function(arr){
            var obj = {};
            $.each(arr, function(i,item){
                obj[item['name']] = item['value'];
            })
            return obj;
        },
        getPatientid : function(){
            return $("#patientid").val();
        }
    };
    app.init();
})
