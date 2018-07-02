/**
 * Created by Administrator on 2015/1/28.
 */

//loading
//设置动画队列
//根据高宽比设置背景
//根据比率设置元素的 left top width height
//scroll滚动
(function(){
	var root = this
	var up = {}
	root.up = up
	//loading
	//preloadList [Array]  图片预加载列表
	//callback [Function]  预加载列表加载完毕后回调
	up.loading = function(preloadList, callback){
		var loadedCount = 0
		var imgArr = preloadList
		var listLen = imgArr.length
		var loading = function(){
			for(var i  = 0;i < listLen; i++){
				var img = new Image();
				img.error = img.onload= function () {
					loadedCount++;
					$(this).remove();
					if(loadedCount === listLen){
						callback && callback()
						$("body").removeClass("prevLoad")
					}
				}
				img.src = imgArr[i];
			}
		}
		loading()
	}

	//处理css3动画队列
	//options [Object]
	//options.baseTime [Number] 设置一个基础时间，加上动画的animateTime作为setTimeout的间隔时间
	//options.list [Array] 动画队列，每个数组元素是一个对象，该对象属性有：
	//node [jQuery elem] 动画目标元素
	//animateTime [Number] 动画持续时间
	//callback 某一动画完成后的回调

	/*runAnimateList({
		baseTime : 200,
		list : [
			{
				"node" : $(".part1-logo"),
				"callback" : function( node ){
					node.addClass("ewCode-trans")
					myScroll.canScroll = true
				},
				"animateTime" : 3000
			}
		]
	})*/

	up.runAnimateList = function( options ){
		var baseTime = options.baseTime || 500
		var list = options.list
		var listLen = list.length
		var i = 0
		var fn=function(){
			var time = list[i]["animateTime"] + baseTime
			list[i]["callback"]( list[i]["node"] )
			if(i>=listLen-1){
				clearTimeout(fn.timer)
				return
			}
			i++
			fn.timer=setTimeout(arguments.callee,time)
		}
		fn()
	}


	//设置平铺背景
/*	var optionsArr = [
		{ node : $(".part1"), imgW : 640, imgH : 1009 },
		{ node : $(".part2"), imgW : 640, imgH : 1009 },
		{ node : $(".part3"), imgW : 640, imgH : 1008 }
	]*/
	var WH = $(window).height()
	var WW = $(window).width()

	up.setBackgroundSize = function( arr ){
		$.each(arr, function(i, options){
			var node = options.node
			var imgW = options.imgW
			var imgH = options.imgH
			var BRadio = imgH/imgW
			var WRadio = WH/WW
			if( BRadio > WRadio ){
				node.css({
					"backgroundSize" : WW + "px auto"
				})
			}else{
				node.css({
					"backgroundSize" : "auto " + WH + "px"
				})
			}
		})
	}

	up.setRatio = function( imgW, imgH){
		var BRadio = imgH/imgW
		var WRadio = WH/WW
		//return ( BRadio > WRadio ) ?  (WW / imgW) : (WH / imgH)
		return ( BRadio > WRadio ) ?  (WW / imgW) : (WH / imgH)
	}

	/*{
		'part1-logo' : {
			w : 416,
			h : 216,
			l : 138,
			t : 110
		},
		'part1-head' : {
			w : 156,
			h : 186,
			l : 257,
			t : 432
		}
	}*/
	up.setPosition = function( obj, S ){
		for(var i in obj){
			var item = obj[i];
			var cssObj = {
				width : item.w*S,
				height : item.h*S,
				backgroundSize : item.w*S
			}
			var posObj = {
				"left" : item.l,
				"top" : item.t,
				"right" : item.r,
				"bottom" : item.b
			}
			$.each( posObj, function(key, value){
				if( value !== undefined ){
					cssObj[key] = value*S
				}
			})
			$("."+i).css(cssObj);
		}
	}

  up.setPositionByHW = function( obj, W, H ){
		for(var i in obj){
			var item = obj[i];
      var ih = item.h*WH/H;
      var iw = item.w*ih/item.h;
			var cssObj = {
				width : iw,
				height : ih,
				backgroundSize : iw
			}
			var posObj = {
				"left" : item.l,
				"top" : item.t,
				"right" : item.r,
				"bottom" : item.b
			}
			$.each( posObj, function(key, value){
				if( value !== undefined ){
					if( key == "left" || key == "right"){
						//cssObj[key] =(value*WW/W);
					}else{
						cssObj[key] = value*WH/H;

            var r1 = value/H
            var r2 = cssObj[key]/WH

            if(item.l){
              if(item.c){
                cssObj["left"] = (WW-iw)/2;
              }else{
                var r3 = item.l/W
                cssObj["left"] = (r2*r3/r1)*WW;
              }
            }
            if(item.r){
              var r3 = item.r/W
              cssObj["right"] = (r2*r3/r1)*WW;
            }

					}
				}
			})
			$("."+i).css(cssObj);
		}
	}


	//up.swipe("left",function(){})
	up.swipe = function( position, callback ){
		// 上翻下翻
		var startx=0;
		var starty=0;
		var endx=0;
		var endy=0;
		var documentWidth= 320
		//事件监听器，触屏版事件,防止屏幕点击的bug
		document.addEventListener('touchstart',function(event){
			startx=event.touches[0].pageX;//touches.event
			starty=event.touches[0].pageY;
		});

		//阻止触摸时浏览器的缩放、滚动条滚动
		document.addEventListener('touchmove',function(event){
			event.preventDefault();
		});

		document.addEventListener('touchend',function(event){
			//changedTouches
			endx=event.changedTouches[0].pageX;//x
			endy=event.changedTouches[0].pageY;//y
			//手指离开的时候，判断移动的方向
			//先判断是x,y在判断正负方向

			var deltax=endx-startx;
			var deltay=endy-starty;
			//判断是否是点击,小于某个值，不是移动操作
			if(Math.abs(deltax)<0.3*documentWidth&&Math.abs(deltay)<0.3*documentWidth){
				return;
			}
			switch( position ){
				case "down":
					if( (Math.abs(deltax) < Math.abs(deltay))  && deltay>0 ){
						callback && callback()
					}
					break
				case "up":
					if( (Math.abs(deltax) < Math.abs(deltay))  && deltay<=0 ){
						callback && callback()
					}
					break
				case "right":
					if( (Math.abs(deltax) >= Math.abs(deltay))  && deltax>0 ){
						callback && callback()
					}
					break
				case "left":
					if( (Math.abs(deltax) >= Math.abs(deltay))  && deltax<=0 ){
						callback && callback()
					}
					break
			}
		})
	}



}.call(this))

