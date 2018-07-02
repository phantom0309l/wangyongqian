var tooltips = {
    index : 1,
    init : function(options){
        var self = this;
        var index = self.index;
        var errMsg = options.errMsg;
        var srcNode = options.srcNode;
        if( srcNode.data("hastipnode") ){
            self.showTipNode( srcNode.data("hastipnode"),errMsg )
            return
        }
        var cLeft = options.cLeft || 0;
        var cTop = options.cTop || 0;
        var tipNode = self.createTipNode(index,errMsg);
        self.setTipNodePosition(srcNode, tipNode, cLeft, cTop);
        $("body").append(tipNode);
        self.showTipNode( index )
        srcNode.data("hastipnode",self.index)
        self.index++;

    },
    createTipNode : function( index, errMsg ){
        var str = '<div class="yitip white topMiddle" id="yitip-' + index + '">\
                        <div class="yitip-content">' + errMsg + '</div>\
                        <div class="yitip-trigon-border"></div>\
                        <div class="yitip-trigon"></div>\
                    </div>';
        return $(str);
    },
    setTipNodePosition : function(srcNode, tipNode, cLeft, cTop){
        var offsetObj = srcNode.offset();
        var left = offsetObj.left - cLeft;
        var top = offsetObj.top - 35 -cTop;
        tipNode.css({
            left : left,
            top : top
        })
    },
    showTipNode : function( index,errMsg ){
        var tipNode = $("#yitip-"+index);
        if( errMsg ){
            tipNode.find(".yitip-content").text(errMsg);
        }
        tipNode.fadeIn(500,function(){
            setTimeout(function(){
                tipNode.fadeOut(400);
            },1200)
        })
    }
};

var changeStatus = function(rules){
    $.each(rules, function(i,rule){
        var clickNode = rule.node;
        var showClass = $.trim( rule.showClass );
        var hideClass = $.trim( rule.hideClass );
        clickNode.on("click", function(){
            var me = $(this);
            var index = me.index();
            me.parent().find(".btn").removeClass("btn-active");
            me.addClass("btn-active");
            if( showClass != "" ){
                $("."+showClass).show();
            }
            if( hideClass != "" ){
                $("."+hideClass).hide();
            }
         })
    })
};

var hasCheckedYes = function(patientNode,activeClass){
    var activeClass = activeClass || "btn-active";
    var node = patientNode.find("."+activeClass);
    if( node.length && node.hasClass("yesBtn") ){
        return true;
    }
    return false;
};

//获取数据
var dataHelper = function(root){
    var textNodes = root.find("[data-dtype='text']");
    var checkedNodes = root.find("[data-dtype='checked']");
    var checkboxNodes = root.find("[data-dtype='checkbox']");
    var obj = {};
    textNodes.each(function(){
        var item = $(this);
        if(item.is(":visible")){
            var name = item.attr("name");
            var val = $.trim( item.val() );
            if( val ){
                obj[name] = val;
            }
        }
    })
    checkedNodes.each(function(){
        var item = $(this);
        if(item.is(":visible")){
            var name = item.data("name");
            var val = item.find(".btn-active").data("value");
            if( val ){
                obj[name] = val;
            }
        }
    })
    checkboxNodes.each(function(){
        var item = $(this);
        if(item.is(":visible")){
            var name = item.data("name");
            var actives = item.find("."+name+"Btn-active");
            var arr = [];
            actives.each(function(){
                var val = $(this).data("value");
                arr.push(val);
            })
            if(arr.length){
                obj[name] = arr.join("|") ;
            }
        }
    })
    return obj;
};

var checkFun = {
    "isChecked" : function(node){
        var activeClass = node.data("activeclass") || "btn-active";
        var activeNode = node.find("."+activeClass);
        if( activeNode.length === 0 ){
            tooltips.init({
                srcNode : node,
                errMsg : "请选择一项",
                cLeft : -40
            })
            return false;
        }
        return true;
    },
    "isFilled" : function(node){
        var inputbase = node.find(".inputbase");
        if( $.trim( inputbase.val() ) === "" ){
            tooltips.init({
                srcNode : node,
                errMsg : "不能为空!",
                cLeft : -40
            })
            return false;
        }
        return true;
    }
};

var checkItems = function(rules){
    var flag = true;
    $.each(rules,function(i,obj){
       var node = obj.node;
       var fun = obj.checkFun;
       if( node.length && node.is(":visible") ){
          flag = checkFun[fun](node);
          if( flag == false ){
              return false;
          }
       }
    })
    return flag;
};
var sendData = function(url){
    var baseData = dataHelper( $(".shell") );
    console.log( baseData );
    //return;
    //提交数据
    $.ajax({
        type: "POST",
        url: url,
        data: baseData,
        dataType: "text",
        success: function(re) {
            if(re == 'ok'){
              $(".notice").show();
              setTimeout(function(){
                  window.location.href = "/paper/index?openid=" + $("#openid").val();
              },1000);
            }
        },
        error: function(){
            canClick = true;
        }
    })
};

$(function(){
    var setDefault = function(type){
        var ndate = new Date();
        var currYear = ndate.getFullYear();
        var currMonth = ndate.getMonth();
        var currDate = ndate.getDate();
        var startYear = currYear - 15;
        var endYear = currYear;
        var obj = {
            theme: 'ios', //皮肤样式
            mode: 'scroller', //日期选择模式
            display: 'bottom', //显示方式
            dateFormat: 'yyyy-mm-dd',
            lang: 'zh',
            startYear: startYear, //开始年份
            endYear: endYear  //结束年份
        };

        //if(type=="#firstDrugDate"){
            obj = $.extend(obj,{ maxDate: new Date(currYear,currMonth,currDate) })
        //}
        return obj;

    }
    var handleArr = ["#firstDrugDate",".date1"];
    $.each(handleArr, function(i,v){
        var d = setDefault(v);
        $(v).mobiscroll().date(d);
    })

    $(".listBox-t").on("click", function(){
        var me = $(this);
        var next = me.next();
        $(".listBox").find(".listBox-c").hide();
        $(".listBox").find(".listBox-t").not(me).removeClass("listBox-tActive");
        me.addClass("listBox-tActive");
        next.show();
    })
})
