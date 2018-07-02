$(function(){
  $(".options").each(function(){
    $(this).find(".option").first().removeClass('option-center').addClass('option-left')
    $(this).find(".option").last().removeClass('option-center').addClass('option-right')
  })

  $(".option").on('tap', function(){
    var me = $(this);
    me.parent().find(".option-active").removeClass("option-active")
    me.addClass("option-active")

    var parents = me.parents(".options")
    if(me.text() == '其他'){
      parents.find(".options-full").addClass("options-shrink")
      parents.find(".option-text").show().find("input").focus()
    }else{
      parents.find(".options-full").removeClass("options-shrink");
      parents.find(".option-text").hide();
      //给隐藏域赋值
      var optionid = me.data("optionid");
      parents.find(".hiddenItem").val(optionid);
    }
  })

  $(".writer-item").on("tap", function(){
    var me = $(this)
    me.addClass("writer-itemActive").siblings().removeClass("writer-itemActive");
    $("#writer").val( me.text() );
  })

  var checkWriter = function(){
      var has = $(".writerBox").find(".writer-itemActive").length > 0
      if(!has){
         var notice = $(".writer-notice")
         notice.show()
         setTimeout(function(){
           $(window).scrollTop(0)
           notice.hide()
         },1000)
      }
      return has
  };

  //js form提交
  var canClick = true;
  $(".sheetSubmitBtn").on("tap", function(){

      if( !checkWriter() ){
          return
      }
      if( !canClick ) return
      canClick = false
      $("#form").submit();
  })

});

