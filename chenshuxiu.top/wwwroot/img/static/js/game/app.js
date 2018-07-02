/**
 * Created by qiaoxiaojin on 15/6/20.
 */
var app = {
    startms : 0,
    doms : 0,
    score : 0,
    isright : 0,
    blocknum : 0,
    init : function(){
        var self = this
        //标示点击状态
        self.canClick = false
        //初始化level
        self.level = initLevel
        //可以玩的次数
        self.canTry = canTry
        self.initGame(self.level)
        self.initTopBar()
        //进行复原操作
        //根据.cellbh来复原
        self.back()

    },
    initGame : function(level){
        var self = this
        var config = levelConfig[level]
        //黑块数量
        self.BBNum = self.blocknum = config.blackBlock
        //绘制box
        self.drawBox( config )
        //随机出黑块
        self.randomBlackBlock( config )
        //看三秒隐藏
        setTimeout(function(){
            self.startms = self.getTime();
            self.hideCellb()
            self.canClick = true
        }, 3000)
    },
    initTopBar : function(){
        var self = this
        var topBar = $("#topBar")
        topBar.find(".bbnum").text( self.BBNum )
        topBar.find(".cantry").text( self.canTry )
        topBar.find(".maxLevel").text( maxLevel )
    },
    back : function(){
        var self = this
        $("#box").on("tap", ".cell", function(){
           if( !self.canClick ) return
           var me = $(this)
           if( me.hasClass("cellbh") ){
                //选择正确的操作
                self.addScores( scoreConfig.blackScore )
                self.BBNum--
                me.removeClass("cellbh")
                if( self.BBNum <= 0 ){
                    self.doms = self.getTime();
                    self.isright = 1;
                    //进入下一关操作
                    self.showNextNotice(1,self.initGame)
                    return
                }
           }else{
                if( !me.hasClass("cellb") ){
                    self.doms = self.getTime();
                    self.isright = 0;
                //选择错误的操作
                    self.showError( me )
                    setTimeout(function(){
                        $(".error").remove()
                        self.showNextNotice(-1,self.initGame)
                    },1000)
                }
           }
        })
    },
    showError : function(clickNode){
        var error = $('<span class="error">x</span>')
        error.css({
            width : clickNode.width(),
            height : clickNode.height(),
            lineHeight : clickNode.height() + "px",
            left : clickNode.css("left"),
            top : clickNode.css("top")
        })
        $("#box").append( error )
    },
    showNextNotice : function( num, callback ){
       var self = this
        self.canClick = false
        if( self.canTry > 0 ){
            if( self.level == 0 ) self.level = 1
        }
       self.canTry = self.canTry - 1
       var addedScores = num > 0 ? scoreConfig.levelScore[self.level] : 0
       self.addScores( addedScores )
       self.score = addedScores

       self.saveData( self.getObj() );
       if( self.canTry == 0 ){
            alert("游戏结束")
            window.location.href = "/game/gameonecnt?gameplayid=" + self.getGameplayid();
            return
       }
       var blackBlockNum = levelConfig[self.level].blackBlock + num == 0 ? 1 : levelConfig[self.level].blackBlock + num
       var str = '<div class="nextNotice"><p>得分：+' + addedScores + '分</p><p class="mt10">下一关：卡通数' + blackBlockNum + '</p></div>'
       var w = parseInt( $("#box").width()*0.8 )
       nextNotice = $(str).css({
            width : w,
            marginLeft : -parseInt(w/2)
       })
       $("#box").append( nextNotice )
       setTimeout(function(){
            nextNotice.remove()
            self.level = self.level + num == 0 ? 1 : self.level + num
            callback && callback.call(self, self.level)
            self.initTopBar()
       },2000)
    },
    drawBox : function(obj){
        var row = obj.row
        var col = obj.col
        var self = this
        var blackBlock = obj.blackBlock
        var box = $("#box")
        var space = 5
        var cellW = self.getCellWidth( col, space )
        //设置#box宽高位置
        var bw = col*cellW + (col-1)*space
        var bh = row*cellW + (row-1)*space
        box.css({
            width : bw,
            height : bh,
            marginTop : -parseInt(bh/2),
            marginLeft : -parseInt(bw/2)
        })
        //生成所需要的单元格html
        var createHtml = function(){
            var str = ''
            for( var n = 0; n < row; n++){
                for( var m = 0; m < col; m++){
                    str = str + '<span class="cell" style="width:' + cellW + 'px; height:' + cellW + 'px; left:' + (m*cellW + m*space) + 'px; top:' + (n*cellW + n*space) + 'px"></span>'
                }
            }
            return str
        }
        //渲染
        box.html( createHtml() )
        $(".cellb").css({"backgroundSize" : cellW + "px"});
    },
    getCellWidth : function(colNum, space){
        var winW = Math.min(window.innerWidth, window.innerHeight)
        var baseW = 50
        var diff = 10
        if( baseW*colNum + (colNum-1)*space > winW ){
            baseW = parseInt( ( winW - diff - (colNum-1)*space )/colNum )
        }
        return baseW
    },
    getBlackBlockIndex : function(obj){
        var row = obj.row
        var col = obj.col
        var blackBlock = obj.blackBlock
        var indexArr = []
        var addIndexArr = function(){
            var random = Math.floor( Math.random(1)*row*col )
            if( indexArr.length < blackBlock ){
                if( $.inArray(random, indexArr) < 0 ){
                    indexArr.push(random)
                }
                addIndexArr()
            }else{
                return indexArr
            }
        }
        addIndexArr()
        return indexArr
    },
    randomBlackBlock : function(obj){
        var me = this
        var indexArr = me.getBlackBlockIndex(obj)
        $.each(indexArr, function(i,v){
            $("#box").find(".cell").eq(v).addClass("cellb")
        })
    },
    hideCellb : function(){
        $("#box").find(".cellb").addClass("cellbh")
    },
    addScores : function(add){
        var scores = $("#topBar").find(".scores")
        var num = parseInt( scores.text() )
        scores.text( num + add )
    },
    saveData : function( obj ){
      $.ajax({
          "type" : "post",
          "data" : obj,
          "dataType" : "text",
          "url" : "/game/saveprocessdatajson",
          "success" : function(data){
          }
      })
    },
    getObj : function(){
        var self = this;
        var obj = {};
        obj.startms = self.startms;
        obj.doms = self.doms;
        obj.score = self.score;
        obj.blocknum = self.blocknum;
        obj.isright = self.isright;
        return { "gameplayid" : self.getGameplayid(), "dataArr" : obj };
    },
    getTime : function(){
        var d = new Date();
        return d.getTime();
    },
    getGameplayid : function(){
        var val = $("#gameplayid").val();
        return parseInt( val );
    }

}

app.init()
