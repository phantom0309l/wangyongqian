$(document).ready(function(){
    $('.datectr').mobiscroll().date({
        theme: 'ios',
        display: 'center',
        circular:true,
        dateFormat: 'yyyy-mm-dd',
        lang: 'zh'
    });

    var datestr = $('.datectr').attr('value');

    if( datestr != ''){
        var year = datestr.substring(0,4);
        var month = datestr.substring(5,7);
        var day = datestr.substring(8,10);

        var yearnum = parseInt(year);
        var monthnum = parseInt(month) - 1;
        var daynum = parseInt(day);

        $('.datectr').mobiscroll('setVal', new Date(yearnum,monthnum,daynum) );
    }

    xwenda.subClick("havesub");

    $(".sheetSubmitBtn").on("click", function(){
        xwenda.resetHideInputs();
        $("#form").submit();
    });

    $(".checkbox-item").each(function(){
        var me = $(this);
        var parentsNode = me.parents(".checkBox");
        var items = parentsNode.find(".checkbox-item");
        var hiddenNodes = parentsNode.find(".hiddenItem");
        var index = items.index(me);
        if( me.hasClass("checkbox-itemActive") ){
            var optionid = me.data("optionid");
            hiddenNodes.eq(index).val(optionid);
        }
    });

    $(".checkbox-item").on("click", function(){
        var me = $(this);
        var parentsNode = me.parents(".checkBox");
        var items = parentsNode.find(".checkbox-item");
        var hiddenNodes = parentsNode.find(".hiddenItem");
        var index = items.index(me);
        var activeClass = "checkbox-itemActive";
        if( me.hasClass(activeClass) ){
            me.removeClass("checkbox-itemActive");
            hiddenNodes.eq(index).val("");
        }else{
            me.addClass("checkbox-itemActive");
            var optionid = me.data("optionid");
            hiddenNodes.eq(index).val(optionid);
        }
    });

    $(".radio-item").on("click", function(){
        var me = $(this);
        me.addClass("radio-itemActive").siblings().removeClass("radio-itemActive");
        var optionid = me.data("optionid");
        me.parents(".answerpart").find(".hiddenItem").val(optionid);
    });

    $(".radio-itemActive").each(function(){
        var me = $(this);
        var optionid = me.data("optionid");
        me.parents(".answerpart").find(".hiddenItem").val(optionid);
    });

});
