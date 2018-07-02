(function(root){
    var g = {};

    //提交验证提示
    //调用方式
    /*g.tooltips.init({
        srcNode : $("#name"), //作用元素
        errMsg : "请填写孩子姓名", //错误提示信息
        cLeft : 80 //距离屏幕左边界距离
    });*/
    g.tooltips = {
        index : 1,
        init : function(options){
            var self = this;
            var index = self.index;
            var srcNode = options.srcNode;
            if( srcNode.data("hastipnode") ){
                self.showTipNode( srcNode.data("hastipnode") );
                return;
            }
            var errMsg = options.errMsg;
            var cLeft = options.cLeft || 0;
            var cTop = options.cTop || 0;
            var tipNode = self.createTipNode(index,errMsg);
            self.setTipNodePosition(srcNode, tipNode, cLeft, cTop);
            $("body").append(tipNode);
            self.showTipNode( index );
            srcNode.data("hastipnode",self.index);
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
            var left = offsetObj.left + cLeft;
            var top = offsetObj.top - 35 + cTop;
            tipNode.css({
                left : left,
                top : top
            });
        },
        showTipNode : function( index ){
            var tipNode = $("#yitip-"+index);
            tipNode.fadeIn(500,function(){
                setTimeout(function(){
                    tipNode.fadeOut(400);
                },1200);
            });
        }
    };

    //关闭微信页面
    g.closeWxPage = function(time){
        var time = time || 3000;
        setTimeout("WeixinJSBridge.call('closeWindow')", time);
    }

    root.g = g;
})(window);
