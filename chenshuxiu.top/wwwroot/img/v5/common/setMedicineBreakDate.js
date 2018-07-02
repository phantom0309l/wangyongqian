$(function(){
    var app ={
        init : function(){
            var self = this;
            self.handleSave();
        },
        handleSave : function(){
            var self = this;
            $(document).on("click", ".medicine_break_date-save", function(){
                var me = $(this);
                var patientid = me.data("patientid");
                var medicine_break_date = $(this).parents(".medicine_break_date-box").find(".medicine_break_date").val();

                $.ajax({
                    "type": "get",
                    "data": {
                        patientid: patientid,
                        medicine_break_date: medicine_break_date
                    },
                    "dataType": "text",
                    "url": "/patientmgr/medicineBreakDateChangeJson",
                    "success": function (data) {
                        if (data == 'ok') {
                            alert("更新成功！");
                        }
                    }
                });
            });
        },
    };
    app.init();
})
