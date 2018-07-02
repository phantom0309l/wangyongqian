$(function(){
    var app ={
        init : function(){
            var self = this;
            self.handleSelect();
            self.handle_dealwith_group_Change();
        },

        handle_dealwith_group_Change : function(){
            var self = this;
            $(document).on("change", ".dealwith_group", function(){
                var me = $(this);
                var dealwith_group = me.val();

                var handleselect = me.parents(".replyBox").find(".dealwithTplSelect");

                handleselect.html('');

                $.ajax({
                    "type": "get",
                    "data": {
                        "dealwith_group": dealwith_group,
                    },
                    "url": "/dealwithtplmgr/getDealwithTplListJson",
                    "dataType": "json",
                    "success": function (data) {
                        handleselect.empty();

                        var str = '<option value="">请选择...</option>';
                        $.each(data, function (i, item) {
                            str = str + '<option value="' + escape(item.dealwithtplid) + '" data-msgcontent="' + escape(item.msgcontent) + '">' + item.title + '</option>';
                        });

                        handleselect.html(str);
                    }
                });
            })
        },

        handleSelect : function(){
            var self = this;
            $(document).on("change", ".handleSelect", function(){
                var me = $(this);
                var patient_name = self.getPatient_name();
                var doctor_name = $("#doctor_name").val();
                var disease_name = $("#disease_name").val();

                var msgcontent = me.find(":selected").data("msgcontent");

                msgcontent = unescape(msgcontent.replace(/pp/g,patient_name));
                msgcontent = unescape(msgcontent.replace(/dd/g,doctor_name));
                msgcontent = unescape(msgcontent.replace(/DD/g,disease_name));

                me.parents(".replyBox").find(".reply-msg").val( msgcontent );
            })
        },

        getPatient_name: function(){
            var patientName = $("#patientName").val();
            if(typeof(patientName) == "undefined"){
                patientName = $("#patientname").val();
            }
            return patientName;
        },
    };
    app.init();
})
