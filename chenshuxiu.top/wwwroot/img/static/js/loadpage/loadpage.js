/**
 * Created by lijie on 16-4-14.
 */

var loadpage = function(obj){
    this.canScroll = true;
    this.tourl = obj.tourl;         //后台加载json数据的action的url地址
    this.pagesize = obj.pagesize;   //每次需要加载的数据条数
    this.type = obj.type;
    this.lessonid = obj.lessonid;
    this.itemBox_id = obj.itemBox_id;

    this.init();
}
loadpage.prototype = {
    init : function(obj){
        $('#'+self.itemBox_id ).html("");
        $(".nolessonShell").hide();
        this.addTopics();
        this.handleScroll();
    },
    handleScroll : function(){
        var self = this;
        $(window).on("scroll", function(){
            var DH = self.getDocumentH();
            var WH = self.getWindowH();
            if( !self.canScroll ){
                return
            }
            var me = $(this);
            var nowH = WH + me.scrollTop();
            if( DH - nowH <= 100 ){
                $(".loading").show();
                self.canScroll = false;
                self.addTopics();
            }
        })
    },
    addTopics : function(){
        var self = this;
        var topicid = self.getLastTopicid();
        $.ajax({
            "type" : "post",
            "url" : self.tourl,
            dataType : "json",
            data : {
                topicid : topicid,
                pagesize : self.pagesize,
                type : self.type,
                lessonid : self.lessonid
            },
            "beforeSend" : function(){
                if( $(".item").length == 0 ){
                    $(".loading").show();
                }
            },
            "success" : function(data) {
                $(".loading").hide();
                if( data.status == "none" ){
                    $(".nolessonShell").show();
                    self.canScroll = false;
                    return;
                }
                if( data.status == "loaded" ){
                    $(".loading").text("已无更多数据").show();
                    self.canScroll = false;
                    return;
                }
                var html = self.getTopicHtml( data );
                $('#'+self.itemBox_id ).append( html );
                self.canScroll = true;
                self.initHeadImg();
            }
        });
    },
    initHeadImg : function(){
        $(".headimg").each(function(){
            var me = $(this);
            if( me.data("hasload") == 1 ){
                return;
            }
            var url = me.data("url");

            if( url ){
	            var finalurl = url.substr(0,url.length-1) + '132';
	            me.css({ "backgroundImage" : "url(" + finalurl + ")"})
	            me.data("hasload",1);
            }
        })
    },
    getTopicHtml : function( data ){
        var data = {
            list : data
        };
        var tpl = document.getElementById('tpl').innerHTML;
        //alert(tpl);
        //alert(data);
        return juicer(tpl, data);
    },
    getDocumentH : function(){
        return $(document).height();
    },
    getWindowH : function(){
        return $(window).height();
    },
    getLastTopicid : function(){
        if( $(".item").length == 0 ){
            return 0;
        }else{
            return $(".item").last().data("topicid");
        }
    }
}
