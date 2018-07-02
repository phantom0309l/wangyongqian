var cym = {
	theInputNode : null, // 日期(年-月)输入框

	// 参数 inputClassName : 日期(年-月)输入框,指定的样式
	init : function(inputClassName, startY, endY) {
		var self = this;

		// 生成一个隐藏的日历div
		var divhtml = self.getDivHtml(startY, endY);

		// 先在页面body的末尾追加这个div
		$("body").append(divhtml);

		// 所有符合的input挂点击事件
		self.inputNodesClick(inputClassName);

		// 日历弹层的确定按钮,挂上点击事件
		self.calenderSubmitBtnClick();
	},

	// 日历弹层的确定按钮,挂上点击事件
	calenderSubmitBtnClick : function() {
		var self = this;
		$(".cym-btn").on("click", function() {
			$(".cym-box").hide();
			$year = $(".cym-y").val();
			$month = $(".cym-m").val();

			var stateDate = new Date($year, $month - 1);
			var inputNode = self.theInputNode;
			inputNode.val(stateDate.pattern("yyyy-MM"));
		});
	},

	// 有指定class的input,全部挂上点击事件
	inputNodesClick : function(inputClassName) {
		var self = this;

		$(document).on("click", inputClassName, function(e) {
			e.preventDefault();

			var me = $(this);

			// 成员变量保存当前input,用于保存的目标
			self.theInputNode = me;

			// 修正日历控件的默认年月选中项
			var d = self.getDefaultDate(me);

			$(".cym-y").val(d[0]);
			$(".cym-m").val(d[1]);

			// 显示日历控件
			self.showCalender(me);
		});
	},

	// 获取默认日期,input有值用input的,否则取当前年月
	getDefaultDate : function(inputNode) {
		var arr = [];

		// alert(inputNode.val());

		if ($.trim(inputNode.val()) != "") {
			arr = inputNode.val().split("-");
		} else {
			var d = new Date();
			var m = d.getMonth() + 1;
			var mStr = (m < 10) ? ('0' + m) : m;
			arr = [ d.getFullYear(), mStr ];
		}
		return arr;
	},

	// 在input下方,显示日历控件
	showCalender : function(inputNode) {
		var offset = inputNode.offset();
		$('.cym-box').css('left', offset.left + 'px').css('top',
				offset.top + inputNode.height() + 6 + 'px').show();
	},

	// 生成一个隐藏的日历div
	getDivHtml : function(startY, endY) {
		var self = this;

		var yArr = self.getYearDateArr(startY, endY);
		var mArr = self.getMonthDateArr();

		var yHtml = self.createOptionHtml(yArr);
		var mHtml = self.createOptionHtml(mArr);

		var str = '<div class="cym-box" style="\
        	align: center;\
        	color: #000000;\
        	padding: 8px 8px 8px 8px;\
        	margin: 0px 0px;\
        	border-radius: 2px;\
        	border: 1px solid #00cccc;\
        	background-color: #99ccff;\
        	position: absolute;\
        	z-index: 99;\
        	display: none;">';
		str = str
				+ (' <select style="font-size:16px;" class="cym-y">' + yHtml + '</select>');
		str = str
				+ (' <select style="font-size:16px;" class="cym-m">' + mHtml + '</select>');
		str = str
				+ ' <input style="font-size:14px;" type="button" class="cym-btn" value="确定"></div>';
		return str;
	},

	// 用数组构造optionHtml
	createOptionHtml : function(dataArr) {
		var str = "";
		$.each(dataArr, function(i, v) {
			str = str + '<option value="' + v + '">' + v + '</option>';
		});
		return str;
	},

	// 生成年的数组
	getYearDateArr : function(startY, endY) {
		var arr = [];
		for ( var i = startY; i <= endY; i++) {
			arr.push(i);
		}
		return arr;
	},

	// 生成月的数组
	getMonthDateArr : function() {
		return [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
				'11', '12' ];
	},
};

/**
 * 对Date的扩展，将 Date 转化为指定格式的String 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 * 可以用 1-2 个占位符 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) eg: (new
 * Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 (new
 * Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04 (new
 * Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04 (new
 * Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04 (new
 * Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern = function(fmt) {
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, // 小时
		"H+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	var week = {
		"0" : "\u65e5",
		"1" : "\u4e00",
		"2" : "\u4e8c",
		"3" : "\u4e09",
		"4" : "\u56db",
		"5" : "\u4e94",
		"6" : "\u516d"
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt
				.replace(
						RegExp.$1,
						((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f"
								: "\u5468")
								: "")
								+ week[this.getDay() + ""]);
	}
	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
};