$(function(){
    var app ={
        init : function(){
            var self = this;
            self.changeLevel();
        },

        changeLevel : function(){
            var self = this;
			$(document).on("change", ".optask-level", function() {
                var me = $(this);
                var optaskLevelBox = me.parents(".optaskLevelBox");
                var optaskid = optaskLevelBox.data("optaskid");
                var levelNode = me.find("option:selected");

                var level = levelNode.val();
				$.ajax({
					"type" : "post",
					"data" : {
						"optaskid" : optaskid,
						"level" : level,
					},
					"url" : "/optaskmgr/changeLevelJson",
					"success" : function(data) {
						var txt = "";
						if (data == 'ok') {
							txt = "修改成功";
						}else {
                            txt = "修改失败";
						}
                        noticeNode = optaskLevelBox.find(".level-change-notice");
						noticeNode.text(txt).fadeIn(0, function() {
							$(this).fadeOut(2000, function(){
								noticeNode.text();
							});
						});
					}
				});
			});
        },

    };
    app.init();
})
