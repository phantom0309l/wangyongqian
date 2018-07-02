$(function(){

    window.Sheet = {
      init : function(){
        this.handleClick("havesub");
      },
      handleClick : function(className){
        $(document).on("click", "."+className, function(){
            var me = $(this);
            me.css({"cursor" : "pointer"});
            var showgroup = (me.data("showgroup")+"").split(",");
            var hidegroup = (me.data("hidegroup")+"").split(",");
            $.each(showgroup, function(i,itemstr){
                if(itemstr !==""){
                    $("."+itemstr).show();
                }
            });
            $.each(hidegroup, function(i,itemstr){
                if(itemstr !==""){
                    $("."+itemstr).hide();
                }
            });
        });
      },
      resetHideInputs : function(){
        $("input:hidden").each(function(){
            var me = $(this);
            if( me.attr("type") !== "hidden"){
                if( me.attr("type") == "radio" ){
                    me.attr("checked","");
                }else{
                    me.val("");
                }
            }
        });

        $("textarea:hidden").each(function(){
            $(this).val("");
        });

        $("checkbox:hidden").each(function(){
            $(this).attr("checked","");
        });
      }
    };

    window.Sheet.init();
    $(".sheetSubmitBtn").on("click", function(){
        //resetHideInputs();
        //$("#form").submit();
    });
});
