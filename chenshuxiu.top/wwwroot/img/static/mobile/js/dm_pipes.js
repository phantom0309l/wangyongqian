/**
 * Created by qiaoxiaojin on 15/5/15.
 */
$(document).ready(function() {

	var page = {
		patientid : 0,
		can_scroll : true,
		isSend : true,
		init : function() {
			var self = this;
			var patientid = self.getPatientId();

			self.patientid = patientid;

			// 加载第一批数据
			self.showMoreFlow(patientid);

			// 处理回复
			self.handleReply();

			// 查看更多
			self.handleScroll(patientid);
			
			self.triggerBtnClick();

		},

		getPatientId : function() {
			return $(".patientid").data("patientid");
		},

		// 获取最后一条流的createtime, 用于翻页
		getOffsetpipetime : function() {
			return $(".flow-item").last().data("offsetpipetime");
		},

		handleScroll : function(patientid) {
			var self = this;
			$(document).on("scroll", function() {
				var h = $(window).height();
				var dh = $(document).height();
				var s = $(window).scrollTop();
				if (h + s > dh - 150) {
					if (!self.can_scroll) {
						return;
					}
					self.can_scroll = false;
					self.showLoading();
					self.showMoreFlow(patientid);
				}
			});
		},

		showMoreFlow : function(patientid) {
			var self = this;
			var offsetpipetime = self.getOffsetpipetime();
			$.ajax({
				"type" : "get",
				"data" : {
					patientid : patientid,
					offsetpipetime : offsetpipetime,
					page_size : 10
				},
				"dataType" : "html",
				"url" : "/app/pipeHtml",
				"success" : function(data) {
					$("#flows").append(data);
					self.hideLoading();
				}
			});
		},
		
		// 标记事件 按钮
		triggerBtnClick : function() {
			$(document).on("click", ".TriggerBtn", function() {
				var me  = $(this);
				var TriggerContent = $(this).parents('.TriggerBox').find(".TriggerContent");
				if(TriggerContent.is(":visible")){
					TriggerContent.hide();
					me.text('展开答卷');
				}else{
					TriggerContent.show();
					me.text('隐藏答卷');
				}
			});
		},
		
		showReplyNotice : function(){
            if(/isReply=true/.test(location.search)){
                $("#replyNotice").fadeIn(300, function(){
                    $(this).fadeOut(800);
                });
            }
        },

        handleReply : function(){
            var self = this;
            var mask = $(".mask");
            var rp = $(".replyBox");
            var ta = rp.find("textarea");
            var submitBtn = rp.find(".replySubmit");
            var closeBtn = rp.find(".replyClose");
            var noticeBtn = rp.find(".replyNotice");
            var data = {};
            data.submitBtn = submitBtn;
            data.noticeBtn = noticeBtn;
            data.ta = ta;
            data.mask = mask;
            data.rp = rp;
            $(document).on("click", ".replyBtn", function(){
                mask.show();
                rp.show();
                ta.text("").focus();
                data.openid = $(this).data("openid");
                data.top = $(this).offset().top;
            });
            closeBtn.on("click", function(){
                mask.hide();
                rp.hide();
                $(document).scrollTop( data.top -150 );
            });
            self.setMessage(data);
        },

        setMessage : function(d){
            var self = this;
            d.submitBtn.on("click", function(e){
                var textareaNode = d.ta;
                var msg = $.trim( textareaNode.val() );
                if(!msg){
                    alert("请输入发送信息");
                    return;
                }
                if( !self.isSend ) return;
                self.isSend = false;
                $.ajax({
                    "type" : "post",
                    "data" : {
                        content : msg,
                        open_id : d.openid,
                    },
                    "url" : "/json/pushMsgByOpenidJson",
                    "success" : function(data){
                        if( data == 'ok'){
                            window.location.href = window.location.href + '&isReply=true';
                            return;
                            textareaNode.val("");
                            notice.show().text("信息已发送");
                            var dh = $(document).height();
                            $(document).scrollTop( d.top -150 );
                            setTimeout(function(){
                                notice.hide();
                                d.rp.hide();
                                d.mask.hide();

                            },2000);
                        }
                    },
                    "error" : function(){
                        self.isSend = true;
                    }
                });

            });
        },

		showLoading : function() {
			$("#loading").show();
		},

		hideLoading : function() {
			$("#loading").hide();
		},
	};

	page.init();
});