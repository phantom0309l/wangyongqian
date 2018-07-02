/*
     * 基于localstorage的缓存
     * @author taoxiaojin
     * @created 2018-03-10
 */
(function(window, undefined){
    var config={
        canSetExpire : true, //是否开启过期时间
    	expire : 120,  //缓存数据默认120分钟失效
    	debug  : false
    }


    function setCache(key,obj){
       var data = JSON.stringify(obj);
       var time = new Date().getTime();
       var jsonData={"data":obj,"cacheTime":time};
       if(config.debug){
    		console.log("设置缓存数据："+data);
    	}
       return localStorage.setItem(key, JSON.stringify(jsonData));
    }

    function getCache(key){
    	if(!key){
    		if(config.debug){
    			console.log("key为空，key=【"+key+"】");
    		}
    		return "";
    	}
    	var jsonData=JSON.parse(localStorage.getItem(key));
    	if(!jsonData){
    		if(config.debug){
    			console.log("【"+key+"】缓存的数据不存在");
    		}
    		return "";
    	}
    	if(config.debug){
    		console.log("【"+key+"】获取到的缓存数据："+jsonData.data);
    	}
    	return jsonData.data;
    }

    function removeCache(key){
        var has = hasCache(key);
        if (has) {
            window.localStorage.removeItem(key);
        }
    }


    //判断是否过期
    function cacheIsExpire(key){
        var has = hasCache(key);
        if(has && config.canSetExpire){
        	var jsonData=JSON.parse(localStorage.getItem(key));
        	var nowDate=new Date().getTime();
        	var cacheTime=new Date(jsonData.cacheTime).getTime();
        	if(apartMinutes(cacheTime,nowDate)>config.expire){
        		return true;
        	}else{
                return false;
            }
        }else{
            return false;
        }
    }

    function setCacheItem(key,subObj){
        var obj = {};
        var has = hasCache(key);
        if(has){
            obj = getCache(key);
        }

        var obj = $.extend(obj, subObj);
        return setCache(key, obj);
    }

    function removeCacheItem(key,optionName){
        var has = hasCache(key);
        if(has){
            obj = getCache(key);
            delete obj[optionName];
            return setCache(key, obj);
        }else{
            return null;
        }
    }

    function hasCache(key){
        return !!window.localStorage.getItem(key);
    }

    function apartMinutes(date1,date2){
    	var date3=date2 - date1;
        var minutes=Math.floor(date3/(60*1000));
        if(config.debug){
    		console.log("数据已缓存时间："+minutes+"分钟");
    	}
        return minutes;
    }

    var xcache =  {
    	getCache: getCache,
    	setCache: setCache,
        removeCache: removeCache,
        hasCache: hasCache,
        cacheIsExpire: cacheIsExpire,
        setCacheItem: setCacheItem,
        removeCacheItem: removeCacheItem,
    	configCache: function(obj) {
    		$.extend(config, obj);
    	}
    };

    window.jQuery && ($.extend(window.jQuery, xcache));

})(window);
