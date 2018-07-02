$(function(){
    var app = {
        init : function(){
            var self = this;
            self.btnAddStandardMedicine();
            self.btnAddMedicine();
            self.btnAddHistoryMedicine();
            self.btnStopMedicine();
            self.btnModifyMedicine();

            self.addMedicine();
            self.addHistoryMedicine();
            self.addStandardMedicine();
            self.stopMedicine();
            self.modifyMedicine();

            self.deletePmSheetItem();
            self.deletePmTarget();
        },
        btnAddStandardMedicine : function(){
            $(".btn-add-standard-medicine").on("click", function(e){
                var me = $(this);
                var patientid = me.data("patientid");
                $.ajax({
                    url: '/patientmedicinetargetmgr/addstandardmedicinehtml',
                    type: 'get',
                    dataType: 'html',
                    data: {patientid: patientid}
                })
                .done(function(data) {
                    $("#modal-add-standard-medicine").html(data);
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });

            })
        },
        btnAddMedicine : function(){
            $(".btn-add-medicine").on("click", function(e){
                var me = $(this);
                var pmtargetid = me.data("pmtargetid");
                $.ajax({
                    url: '/patientmedicinetargetmgr/addmedicinehtml',
                    type: 'get',
                    dataType: 'html',
                    data: {pmtargetid: pmtargetid}
                })
                .done(function(data) {
                    $("#modal-add-medicine").html(data);
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });

            })
        },
        btnAddHistoryMedicine : function(){
            $(".btn-add-history-medicine").on("click", function(e){
                var me = $(this);
                var patientid = me.data("patientid");
                var doctorid = me.data("doctorid");
                $.ajax({
                    url: '/patientmedicinetargetmgr/addhistorymedicinehtml',
                    type: 'get',
                    dataType: 'html',
                    data: {
                        patientid: patientid,
                        doctorid: doctorid
                    }
                })
                .done(function(data) {
                    $("#modal-add-history-medicine").html(data);
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });

            })
        },
        btnModifyMedicine : function(){
            $(".btn-modify-medicine").on("click", function(e){
                var me = $(this);
                var pmtargetid = me.data("pmtargetid");
                $.ajax({
                    url: '/patientmedicinetargetmgr/modifymedicinehtml',
                    type: 'get',
                    dataType: 'html',
                    data: {pmtargetid: pmtargetid}
                })
                .done(function(data) {
                    $("#modal-modify-medicine").html(data);
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });

            })
        },
        btnStopMedicine : function(){
            $(".btn-stop-medicine").on("click", function(e){
                var me = $(this);
                var pmtargetid = me.data("pmtargetid");
                $.ajax({
                    url: '/patientmedicinetargetmgr/stopmedicinehtml',
                    type: 'get',
                    dataType: 'html',
                    data: {pmtargetid: pmtargetid}
                })
                .done(function(data) {
                    $("#modal-stop-medicine").html(data);
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });

            })
        },
        addStandardMedicine : function(){
            var self = this;
            $(document).on("click", '.addStandardMedicineSubmitBtn', function(){
                var me = $(this);
                if( true == self.checkData() ){
                    formNode = $('.drugBox:visible');
                    var dataArr = formNode.serializeArray();
                    var postData = self.getPostData(dataArr);
                    $.ajax({
                        url: '/patientmedicinetargetmgr/addStandardMedicineJson',
                        type: 'post',
                        dataType: 'text',
                        data: postData
                    })
                    .done(function(d) {
                        if (d == 'ok') {
                            alert("已提交");
                            window.location.href = location.href;
                        } else {
                            alert(d);
                        }
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
        addMedicine : function(){
            var self = this;
            $(document).on("click", '.addMedicineSubmitBtn', function(){
                var me = $(this);
                if( true == self.checkData() ){
                    formNode = $('.drugBox:visible');
                    var dataArr = formNode.serializeArray();
                    var postData = self.getPostData(dataArr);
                    $.ajax({
                        url: '/patientmedicinetargetmgr/addMedicineJson',
                        type: 'post',
                        dataType: 'text',
                        data: postData
                    })
                    .done(function(d) {
                        if (d == 'ok') {
                            alert("已提交");
                            window.location.href = location.href;
                        } else {
                            alert('操作失败');
                        }
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
        addHistoryMedicine : function(){
            var self = this;
            $(document).on("click", '.addHistoryMedicineSubmitBtn', function(){
                var me = $(this);
                if( true == self.checkData() ){
                    formNode = $('.drugBox:visible');
                    var dataArr = formNode.serializeArray();
                    var postData = self.getPostData(dataArr);
                    $.ajax({
                        url: '/patientmedicinetargetmgr/addHistoryMedicineJson',
                        type: 'post',
                        dataType: 'text',
                        data: postData
                    })
                    .done(function(d) {
                        if (d == 'ok') {
                            alert("已提交");
                            window.location.href = location.href;
                        } else {
                            alert('操作失败');
                        }
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
        stopMedicine : function(){
            var self = this;
            $(document).on("click", ".stopMedicineSubmitBtn", function(){
                var me = $(this);
                if( true == self.checkData() ){
                    var dataArr = $(".drugBox:visible").serializeArray();
                    console.log('dataArr', dataArr);
                    var postData = self.getPostData(dataArr);
                    console.log('postData', postData);
                    postData.type = me.data('type');
                    $.ajax({
                        url: '/patientmedicinetargetmgr/stopmedicinejson',
                        type: 'post',
                        dataType: 'text',
                        data: postData
                    })
                    .done(function(d) {
                        if (d == 'ok') {
                            alert("已提交");
                            window.location.href = location.href;
                        } else {
                            alert('操作失败');
                        }
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
        modifyMedicine : function(){
            var self = this;
            $(document).on("click", ".modifyMedicineSubmitBtn", function(){
                var me = $(this);
                if( true == self.checkData() ){
                    var dataArr = $(".drugBox:visible").serializeArray();
                    var postData = self.getPostData(dataArr);
                    $.ajax({
                        url: '/patientmedicinetargetmgr/modifymedicinejson',
                        type: 'post',
                        dataType: 'text',
                        data: postData
                    })
                    .done(function(d) {
                        if (d == 'ok') {
                            alert("已提交");
                            window.location.href = location.href;
                        } else {
                            alert('操作失败');
                        }
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
        deletePmSheetItem : function(){
            var self = this;
            $(".btn-delete-pmsitem").on("click", function(e){
                e.stopPropagation();
                if( confirm("确定要删除吗? 删除后会影响患者最新用药状态，需要重新审核患者的实际用药!") ){
                    var me = $(this);
                    var pmsitemid = me.data("pmsitemid");
                    $.ajax({
                        type: "post",
                        url: "/patientmedicinetargetmgr/deletepmsitemjson",
                        data:{"pmsitemid" : pmsitemid},
                        dataType: "text",
                        success : function(d){
                            if (d == 'ok') {
                                alert("删除成功");
                                window.location.href = location.href;
                            } else {
                                alert(d);
                            }
                        }
                    });
                }
            });
        },
        deletePmTarget : function(){
            var self = this;
            $(".btn-delete-pmtarget").on("click", function(e){
                e.stopPropagation();
                if(confirm("确定要删除吗? 删除后将不再核对该药 ") ){
                    var me = $(this);
                    var pmtargetid = me.data("pmtargetid");
                    $.ajax({
                        type: "post",
                        url: "/patientmedicinetargetmgr/deletejson",
                        data:{"pmtargetid" : pmtargetid},
                        dataType: "text",
                        success : function(d){
                            if (d == 'ok') {
                                alert("删除成功");
                                window.location.href = location.href;
                            } else {
                                alert(d);
                            }
                        }
                    });
                }
            });
        },
        checkData : function(){
            var flag = true;
            var dataArr = $(".drugBox:visible").serializeArray();
            $.each(dataArr, function(i,item){
                var name = item['name'];
                var value = $.trim(item['value']);
                if(name=='medicineid'){
                    if(value.length==0){
                        alert("请选择用药");
                        flag = false;
                        return false;
                    }
                }
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
