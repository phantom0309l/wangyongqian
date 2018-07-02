$(document).ready(function(){
	var app = {
		leftnum : 0,
		init: function () {
			var self = this;

			var cur_objtype = $("#pp_objtype").data("objtype");
			if(cur_objtype == 'WxPicMsg'){
				self.getPicHtml();
			}

			self.bindDate();

			self.bindAddSheetTplHtml();
			self.bindModifySheetTplHtml();

			self.bindAddSheetHtml();

			self.saveSheetJson();
			self.deleteSheetJson();
		},
		getPicHtml: function () {
			var self = this;
			var data = $('#getppicbythedate-form').serialize();
			$.ajax({
				"type": "get",
				"data": data,
				"dataType": "html",
				"url": "/patientpicturemgr/ppiclisthtml",
				"success": function(d) {
					$("#ppiclisthtml-Box").html(d);
					self.initSheetsTpl();
				}
			});
		},
		bindDate: function(){
			$(document).on("click", ".getppicbythedate-btn", function(){
				var data = $('#getppicbythedate-form').serialize();
				$.ajax({
					"type": "get",
					"data": data,
					"dataType": "html",
					"url": "/patientpicturemgr/ppiclisthtml",
					"success": function(d) {
						$("#ppiclisthtml-Box").html(d);

					}
				});
			})
		},
		initSheetsTpl: function () {
			var self = this;
			var isinit = $("#ppiclisthtml-data").data('ismodifygroup');

			$.ajax({
				"type": "get",
				"data": {
					thisppid : $("#ppiclisthtml-data").data('thisppid')
				},
				"dataType": "html",
				"url": "/patientpicturemgr/sheettplhtml",
				"success": function(d) {
					$("#sheettpl-Box").html('');
					$("#sheettpl-Box").html(d);
					if( isinit ){
						self.initSheets();
					}
				}
			});
		},
		initSheets: function () {
			var thisppid = $("#thisppid").val();
			var targetppid = $("#targetppid").val();

			var sheetids = $("#sheetids").val();
			var sheetidarr = sheetids.split(',');

			for (var i = 0; i < sheetidarr.length; i++) {
				sheetid = sheetidarr[i];
				console.log(sheetid);

				$.ajax({
					"type": "get",
					"data": {
						thisppid : thisppid,
						targetppid : targetppid,
						picturedatasheetid : sheetid
					},
					"dataType": "html",
					"url": "/patientpicturemgr/sheethtml",
					"success": function(d) {
						$("#sheet-Box").append(d);
					}
				});
			}

		},
		bindAddSheetTplHtml: function(){
			$(document).on("click", ".addgroup-btn", function(){
				$.ajax({
					"type": "get",
					"data": {
						thisppid : $("#ppiclisthtml-data").data('thisppid')
					},
					"dataType": "html",
					"url": "/patientpicturemgr/sheettplhtml",
					"success": function(d) {
						$("#sheettpl-Box").html('');
						$("#sheettpl-Box").html(d);
					}
				});
			})
		},
		bindModifySheetTplHtml: function(){
			var self = this;
			$(document).on("click", ".modifygroup-btn", function(){
				$.ajax({
					"type": "get",
					"data": {
						thisppid : $("#ppiclisthtml-data").data('thisppid'),
						targetppid : $(this).data('targetppid')
					},
					"dataType": "html",
					"url": "/patientpicturemgr/sheettplhtml",
					"success": function(d) {
						$("#sheettpl-Box").html('');
						$("#sheettpl-Box").html(d);
						self.initSheets();

					}
				});
			})
		},
		bindAddSheetHtml: function(){
			$(document).on("click", ".addsheet-btn", function(){
				var me = $(this);
				$("#thistitle").val($("#thistitle").val() + me.data('title'));
				$.ajax({
					"type": "get",
					"data": {
						thisppid : $("#thisppid").val(),
						targetppid : $("#targetppid").val(),
						picturedatasheettplid : me.data('picturedatasheettplid')
					},
					"dataType": "html",
					"url": "/patientpicturemgr/sheethtml",
					"success": function(d) {
						$("#sheet-Box").append(d);
					}
				});
			})
		},
		saveSheetJson: function(){
			$(document).on("click", ".onesheetsave-btn", function(){
				var me = $(this);
				var thesheet = me.parents(".onesheet");

				var thisppid = thesheet.data('thisppid');
				var targetppid = thesheet.data('targetppid');
				var picturedatasheettplid = thesheet.data('picturedatasheettplid');
				var picturedatasheetid = thesheet.data('picturedatasheetid');
				var thedate = $(".getppicbythedate-date").val();
				var title = $("#thistitle").val();
				var sheetcontent = '';
				var content = $('#onesheetcontent').val();

				var sheetarr = new Array();

				thesheet.find(".pair").each(function() {
					sheetarr.push($(this).data("title") + "###" + $(this).val());
                });

				sheetcontent = sheetarr.join('&&&');

				$.ajax({
					"type": "post",
					"data": {
						thisppid : thisppid,
						targetppid : targetppid,
						picturedatasheettplid : picturedatasheettplid,
						picturedatasheetid : picturedatasheetid,
						thedate : thedate,
						title : title,
						sheetcontent : sheetcontent,
						content : content,
					},
					"dataType": "html",
					"url": "/patientpicturemgr/savesheetjson",
					"success": function(d) {
						if( d == 'ok' ){
							me.hide();
							thesheet.css({"background":"#f9e5ce"});
							$("#changestatusBox").html("[已归档]");
						}
					}
				});
			})
		},
		deleteSheetJson: function(){
			$(document).on("click", ".onesheetdelete-btn", function(){
				var me = $(this);
				var thesheet = me.parents(".onesheet");

				var picturedatasheetid = thesheet.data('picturedatasheetid');
				$.ajax({
					"type": "post",
					"data": {
						picturedatasheetid : picturedatasheetid
					},
					"dataType": "html",
					"url": "/patientpicturemgr/deletesheetjson",
					"success": function(d) {
						if( d == 'ok' ){
							thesheet.hide();
						}
					}
				});
			})
		},

	};

	app.init();

});
