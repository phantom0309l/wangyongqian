/**
 * Created by qiaoxiaojin on 15/5/6.
 */

(function(win){
    var FC = {}
    //切换内容
    FC.changeContent = function( navNode, contentNodes ){

        navNode.on("click", "li", function(){
            var me = $(this)
            me.addClass("active").siblings().removeClass("active")
            var index = me.index()
            contentNodes.eq( index ).show().siblings().hide()
        })

        var show = $("#J-show").val()
        navNode.find("li").each(function(){
            var me = $(this)
            var idPart = me.attr("id").split("-")[1]
            if( show === idPart ){
                me.trigger("click")
                return false
            }
        })
    }

    win.FC = FC

})(window)
