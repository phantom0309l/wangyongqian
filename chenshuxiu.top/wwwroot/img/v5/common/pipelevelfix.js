$(function(){
    var app ={
        init : function(){
            var self = this;
            self.pipelevelFixBtnOnClick();
            self.fixPipeLevel();
        },

        pipelevelFixBtnOnClick : function() {
			var self = this;
			$(document).on("click", ".pipelevelFixBtn", function() {
				var me = $(this);
                var pipelevelid = me.data("pipelevelid");
                var isurgent = me.data("isurgent");
                var flowItem = me.parents(".flow-item");
				var content = $.trim(flowItem.find(".wxtxtmsgContent").text());

				var pipelevelFixBox = $("#pipelevelFixBox");
				pipelevelFixBox.find(".pipelevelFixBox-content").val( content );

                var pipelevelfixBtn = pipelevelFixBox.find(".pipelevelfix-btn");
                pipelevelfixBtn.data('pipelevelid', pipelevelid);
                if (2 == isurgent) {
                    pipelevelfixBtn.data('isurgentfix', '1');
                    pipelevelfixBtn.text('不紧急');
                } else {
                    pipelevelfixBtn.data('isurgentfix', '2');
                    pipelevelfixBtn.text('紧急');
                }
			});
		},

        fixPipeLevel : function(){
            var self = this;
			$(document).on("click", ".pipelevelfix-btn", function() {
                var me = $(this);
                var pipelevelid = me.data("pipelevelid");
                var is_urgent_fix = me.data("isurgentfix");

				$.ajax({
					"type" : "post",
					"data" : {
						"pipelevelid" : pipelevelid,
						"is_urgent_fix" : is_urgent_fix,
					},
					"url" : "/pipelevelmgr/fixjson",
					"success" : function(data) {
						var txt = "反馈失败";
						if (data == 'ok') {
							txt = "反馈成功";
						}
						$(".pipelevelFixBox-notice").text(txt).fadeIn(0, function() {
							$(this).fadeOut(1200, function(){
								$('#pipelevelFixBox').modal('hide');
							});
						});
					}
				});
			});
        },

    };
    app.init();
})
