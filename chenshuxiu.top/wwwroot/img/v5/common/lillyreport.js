var lillyreport = {
    init : function(url, fc){
        var self = this;
        self.handleDraw(url, fc);
        self.draw(url, fc);
    },
    handleDraw : function(url, fc){
        var self = this;
        $(".draw").on("click", function(){
            var me = $(this);
            if(me.hasClass('process')){
                return
            }
            me.addClass('process');
            me.text('正在绘制，请稍等....');

            self.draw(url, fc);

            me.removeClass('process');
            me.text('绘制');
        })
    },
    // 为echarts对象加载数据
    draw : function(url, fc){
        var thedate = $("#thedate").val();
        $.ajax({
            url: url,
            timeout: 200000,
            type: 'get',
            dataType: 'json',
            data: {thedate: thedate,}
        })
        .done(function(data) {
            fc(data);
        })
        .fail(function() {
            console.log("error");
        })
    },
};
