/**
 * Created by xuzhe 20160223
 */
$(document).ready(

function() {
	var newPage = {
		patientid : 0,
		isSend : false,

		// newPage->init
		init : function() {
			var self = this;

			// 左侧列表,查看
			self.showFuzhenHtmlClick();

		},

		// 列表页-查看 挂点击事件
		showFuzhenHtmlClick : function() {
			var self = this;
			$(".showFuzhenHtml").on("click", function(e) {
				$(".content-right").show();
				e.preventDefault();
				var me = $(this);
				var patientid = me.data("patientid");
				self.patientid = patientid;

				self.resetHtml();
				self.renderFuzhenHtml(patientid);
			});
		},

		resetHtml : function() {
			$("#FuzhenHtmlShell").html('');
		},

		// 患者基本信息区
		renderFuzhenHtml : function(patientid) {
			$.ajax({
				"type" : "get",
				"data" : {
					patientid : patientid
				},
				"dataType" : "html",
				"url" : "/appointmentmgr/fuzhenhtml",
				"success" : function(data) {
					$("#FuzhenHtmlShell").html(data);
				}
			});
		}

	};

	// 初始化页面所有事件
	newPage.init();

});

