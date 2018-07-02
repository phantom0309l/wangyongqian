(function(){
	var pvlog = {
		init : function(){
			if( !window.localStorage ){
				return;
			}
			var self = this;
			//如果链接中有menucode
			if ( self.hasMenuCode() ) {
				//如果有urldata数据
				if ( self.hasUrlData() ) {
					//提交数据
                    //创建新的urldata,在ajax返回后
					self.postUrlData();
				} else {
					//如果没有urldata数据
                    //创建新的urldata
					self.createNewUrlData();
				}
			} else {
				//如果没有menucode
                //有urldata数据
				if ( self.hasUrlData() ) {
					//追加一条urls数据
					self.addUrlItemData();
				} else {
					//如果没有urldata数据
					//do something
				}
			}

			self.bindUnload();
		},
		bindUnload : function(){
			var self = this;
			$(window).on("unload", function(){
				if( self.hasUrlData() ){
					var urldata = self.getUrlData();
					var urldata = JSON.parse(urldata);
					var urls = urldata["urls"];
					var length = urls.length;
					if(length){
						urldata["urls"][length-1]["out_time"] = (new Date()).getTime();
						window.localStorage.setItem("urldata", JSON.stringify(urldata));
					}
				}
			});
		},
		postUrlData : function(){
			var self = this;
			var urldata = self.getUrlData();
			$.ajax({
				url : '/pvlog/saveUrlDataJson',
				type : 'post',
				dataType : 'text',
				data : {urldata:urldata},
			})
			.done(function(){

			})
			.fail(function(){

			})
			.always(function(){
				self.createNewUrlData();
			});
		},
		createNewUrlData : function(){
			var self = this;
			var obj = self.getInitUrlData();
			var objItem = self.getInitUrlItemData();
			obj["urls"].push(objItem);
			window.localStorage.setItem("urldata", JSON.stringify(obj));
		},
		addUrlItemData : function(){
            var self = this;
            var urldata = self.getUrlData();
            var urldata = JSON.parse(urldata);
            //如果记录大于等于500条清空不处理
            if( urldata["urls"].length >= 500 ){
                self.removeUrlData();
                return;
            }

            var objItem = self.getInitUrlItemData();
            urldata["urls"].push( objItem );
            window.localStorage.setItem("urldata", JSON.stringify(urldata));
        },
        getMenuCode : function(){
            var search = location.search;
            var str = search.split("menucode=")[1];
            var str = str.split("&")[0];
            return str;
        },
        hasMenuCode : function(){
            return location.href.indexOf("menucode=") >= 0;
        },
        getUrlData : function(){
            return window.localStorage.getItem("urldata");
        },
        getInitUrlData : function(){
            var self = this;
            var menucode = "";
            if( self.hasMenuCode() ){
                menucode = self.getMenuCode();
            }

            var obj = {
                menucode : menucode,
                urls : []
            };
            return obj;
        },
        getInitUrlItemData : function(){
            var obj = {
                url : window.location.href,
                in_time : (new Date()).getTime(),
                out_time : 0
            };
            return obj;
        },
        hasUrlData : function(){
            var urldata = window.localStorage.getItem("urldata");
            return !!urldata;
        },
        removeUrlData : function(){
            window.localStorage.removeItem("urldata");
        }
	}
	pvlog.init();
})();
