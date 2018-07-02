/**
 * Created by qiaoxiaojin , modify by sjp 20151210
 */
$(function() {
	var Page_WxUserMgr_ListForPipe = {
		wxuserid : 0,
		isSend : false,
		pipeid : 0,

		// Page_WxUserMgr_ListForPipe->init
		init : function() {
			var self = this;

			// 预挂点击事件 --begin--

			// 左侧列表,查看
			self.showWxUserOneHtmlOnClick();

			// 查看更多
			self.showMoreOnClick();

			//触发显示下方回复
			self.replyTriggerBtnOnClick();

			// 回复消息
			self.replyBtnOnClick();

			// 事件区
			self.handleTabClick();

			// 下载电话录音
			self.DownloadCdrMeetingOnClick();

			// 返回顶部
			if( $("#goTop").length ){
				self.goTopOnClick();
			}

		},

		// 列表页-查看 挂点击事件
		showWxUserOneHtmlOnClick : function() {
			var self = this;
			$(document).on("click", ".showWxUserOneHtml", function(e) {
				$(".content-right").css({"visibility" : "visible"});
				// $("#showMore").show();

				e.preventDefault();
				var me = $(this);
				var wxuserid = me.data("wxuserid");
				self.wxuserid = wxuserid;

				self.renderPipeListHtml(wxuserid, 10);
                $('body,html').animate({scrollTop:0},500);
			});

			var node = $(".wxuserList").find(".showWxUserOneHtml");
			if (node.length == 1) {
				node.click();
			}
		},

		// 医患交互流区
		renderPipeListHtml : function(wxuserid, page_size) {
			$.ajax({
				"type" : "get",
				"data" : {
					wxuserid : wxuserid,
					page_size : page_size
				},
				"dataType" : "html",
				"url" : "/pipemgr/listOfWxUserHtml",
				"success" : function(data) {
					$("#pipeShell").html(data);
				}
			});
		},

		// 更多按钮 挂点击事件
		showMoreOnClick : function() {
			var self = this;
			$(document).on("click", "#showMore", function() {
				//全部流更多
				var offsetpipetime = self.getOffsetpipetime();
				$.ajax({
					"type" : "get",
					"data" : {
						wxuserid : self.wxuserid,
						offsetpipetime : offsetpipetime,
						page_size : 10
					},
					"dataType" : "html",
					"url" : "/pipemgr/listOfWxUserHtml",
					"success" : function(data) {
						if ($.trim(data) == "") {
                            alert("没有更多数据了");
							//$("#showMore").hide();
                            return 
						}
						$("#pipeShell").append(data);
					}
				});

			});
		},

		// 获取最后一条流的createtime, 用于翻页
		getOffsetpipetime : function() {
			return $(".flow-item").last().data("offsetpipetime");
		},

		replyTriggerBtnOnClick : function(){
			$(document).on("click", ".reply-triggerBtn", function(){
				var me = $(this);
				var pnode = me.closest(".flow-item");
				var replySectionNode = pnode.find(".replySection");
                if (replySectionNode.is(":visible")) {
				    replySectionNode.hide(500);
                } else {
				    replySectionNode.show(500);
                }
                var select2Nodes = pnode.find(".js-select2");
                select2Nodes.each(function () {
                    var select2Node = $(this);
                    select2Node.select2();
                });
			})
		},

		// 回复消息 挂点击事件
		replyBtnOnClick : function() {
			var self = this;
			$(document).on("click", ".reply-btn", function(e) {
				e.preventDefault();
				var me = $(this);
				var type = me.data("type");
				var wxuserid = me.data("wxuserid");

				var shellNode = me.closest('.flow-item');
				var notice = shellNode.find(".reply-notice");

				var itemNode = me.closest(".tab-pane")
				var textareaNode = itemNode.find(".reply-msg");
				var dealwithNode = itemNode.find(".handleSelect");
                var picNode = itemNode.find("input[name='pictureid']");

				var open_id = shellNode.data('openid');
				var msg = $.trim(textareaNode.val());
                var pictureid = Number(picNode.val());
				var dealwithtplid = dealwithNode.val();

				if (!open_id) {
					alert("未找到openid,无法发送!");
					return;
				}

				if (!msg && type != "Pic") {
					notice.text("请输入发送信息");
					return;
				}

				if (type == "Pic") {
					if(!pictureid){
						notice.text("请选择图片");
						return;
					}
				}

				var obj = {
					"content" : msg,
					"open_id" : open_id,
                    "pictureid" : pictureid
				};
				if (!self.isSend) {
					self.isSend = true;
					if( type == "TxtMsg" ){
						self.sendTxtMsg(obj, textareaNode, notice, dealwithtplid);
					}

					if( type == "Pic" ){
						self.sendPicMsg(obj, textareaNode, notice);
					}
				}
			});
		},

		sendTxtMsg : function(obj, textareaNode, notice, dealwithtplid) {
			var self = this;
            if (obj.content) {
                $.ajax({
                    "type" : "post",
                    "data" : obj,
                    "url" : "/pipemgr/pushMsgByOpenidJson",
                    "success" : function(response) {
                        if (response.errno === '0') {
                            if (dealwithtplid) {
                                self.handledealwithtpl(dealwithtplid);
                            }
                            self.afterSendMsg(textareaNode, notice, response);
                        }else{
							alert("发送失败，请尝试刷新页面");

						}
                    },
                    "error" : function() {
                        self.isSend = false;
						alert("发送失败，请尝试刷新页面");

                    }
                });
            }

		},

		sendPicMsg : function(obj, textareaNode, notice) {
			var self = this;
            if (obj.pictureid) {
                $.ajax({
                    "type" : "post",
                    "data" : obj,
                    "url" : "/pipemgr/pushwxpicmsgjson",
                    "success" : function(data) {
                        self.isSend = false;
                        if (data == 'ok') {
                            self.afterSendMsg(textareaNode, notice);
                        }
                    },
                    "error" : function() {
                        self.isSend = false;
                    }
                });
            }
		},

		handledealwithtpl : function(dealwithtplid) {
			var self = this;
			$.ajax({
				"type" : "post",
				"url" : "/dealwithtplmgr/sendcntjson",
				dataType : "text",
				data : {
					dealwithtplid : dealwithtplid
				},
				"success" : function(data) {
					if (data == 'ok') {
					}
				}
			});
		},

		afterSendMsg : function(textareaNode, notice, response) {
			var self = this;
			self.isSend = false;
			textareaNode.val("");
			notice.text("信息已发送");
			setTimeout(function() {
				notice.text("");
			}, 4000);

			var patientid = $(".removePatient").data("id");
			$("#new_" + patientid).text("").removeClass("red");
			$("#changeNew").text("加new!").removeClass("btn-primary").addClass("btn-default").data("value", 1);

            if (response.has_optask_of_quickconsult === 1) {
                let options = {
                    body: '该患者当前还有未处理的快速咨询任务，请及时处理',
                    icon: 'fa fa-warning',
                    type: 'warning',
                };
                ws.showOneUINotify(options);
            }
		},

		// 事件区tab
		handleTabClick : function() {
			$(document).on("click", ".tab-menu>li", function() {
				var me = $(this);
				var index = me.index();
				var tab = me.parents(".tab");
				var contents = tab.find(".tab-content-item");
				me.addClass("active").siblings().removeClass("active");
				contents.eq(index).show().siblings().hide();
			});
		},

		// 下载天润融通录音文件
		DownloadCdrMeetingOnClick : function() {
			$(document).on("click", ".download-cdr", function() {
                alert('正在下载，请2分钟后刷新页面');
				var me = $(this);
				var cdrmeetingid = me.data("cdrmeetingid");
				$.ajax({
					"type" : "post",
					"data" : {
						"cdrmeetingid" : cdrmeetingid
					},
					"url" : "/pipemgr/downloadvoiceJson",
					"success" : function(data) {
						$(".download-cdr").hide();
					}
				});
			});
		},

		// 返回顶部
		goTopOnClick : function() {
			var left = $(".content-left");
			var offset = left.offset();
			var goTop = $("#goTop");
			goTop.css({
				"left" : offset.left + left.width()
			});
			goTop.on("click", function() {
				$(window).scrollTop(0);
			});
			$(window).on("scroll", function() {
				if ($(window).scrollTop() > 800) {
					goTop.show();
				} else {
					goTop.hide();
				}
			});
		}
	};

	// 初始化页面所有事件
	Page_WxUserMgr_ListForPipe.init();
});
