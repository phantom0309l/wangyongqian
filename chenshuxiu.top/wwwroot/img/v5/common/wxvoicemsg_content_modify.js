$(function(){
    var app ={
        init : function(){
            var self = this;
            //修改语音识别文本
            self.modifyWxVoiceMsgContent();
        },
        modifyWxVoiceMsgContent : function(){
            var self = this;
            $(document).on("click", ".wxvoicemsg-btn", function(e) {
                e.preventDefault();
                var me = $(this);
                var wxvoicemsgid = me.data("wxvoicemsgid");

                var notice = me.siblings(".wxvoicemsg-notice");

                var itemNode = me.closest(".wxvoicemsg-block");
                var contentNode = itemNode.find(".wxvoicemsg-content");
                var content = $.trim(contentNode.val());

                if (!wxvoicemsgid) {
                    alert("未找到wxvoiceid,无法修改!");
                    return;
                };

                if (!content) {
                    notice.text("修改后内容不能为空");
                    return;
                };

                var obj = {
                    "wxvoicemsgid" : wxvoicemsgid,
                    "content" : content,
                };

                $.ajax({
                    "type" : "post",
                    "data" : obj,
                    "url" : "/wxvoicemsgmgr/modifycontentJson",
                    "success" : function(data) {
                        if (data == 'ok') {
                            notice.text("内容已变更");
                            setTimeout(function() {
                                notice.text("");
                            }, 3000);
                        }
                    },
                });
            });
        },
    };
    app.init();
})
