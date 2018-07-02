$(document).ready(function(){
    var currYear = (new Date()).getFullYear();
    var opt={};
    opt.date = {preset : 'date'};
    opt.datetime = {preset : 'datetime'};
    opt.time = {preset : 'time'};
    opt.default = {
        theme: 'ios', //皮肤样式
        display: 'modal', //显示方式
        mode: 'scroller', //日期选择模式
        dateFormat: 'yyyy-mm-dd',
        lang: 'zh',
        startYear: currYear - 90, //开始年份
        endYear: currYear + 3  //结束年份
    };
    $(".datectr").mobiscroll($.extend(opt['date'], opt['default']));

    var canClick = true;
    $(".submit-btn").on("click",function(){
        var ischecks = $(".ischeck");
        var isreturn = false;
        $.each(ischecks,function(){
            if($(this).val() == '' || $(this).val() == null){
                isreturn = true;
            }
        });

        if( isreturn ){
            alert("请填写必填项");
            return;
        }

        if( !canClick ){
            return;
        }
        canClick = false;
        $("#theform").submit();
//        $(".sucshow").show();
//        setTimeout("WeixinJSBridge.call('closeWindow')", 3000);
    });

    $("#disclaimer_part_control").on("click",function(){
        $("#disclaimer_part").show();
        $("#baodao_part").hide();
        $(window).scrollTop($("#disclaimer_part").offset().top);
    });
    $("#baodao_part_control").on("click",function(){
        $("#disclaimer_part").hide();
        $("#baodao_part").show();
        $(window).scrollTop($("#baodao_part").offset().top);
    });

    $(document).ready(function(){
        $("#isagree").on("click",function(){
            $("#isagree").children().toggleClass("blue-box-selected");
            $("#isagree").toggleClass("isagree-checked");
        })
    });
});