$(document).ready(function(){
    $(".groupstr-panel-on").on("click", function(){
        $(".groupstr-panel").toggle();
    });
    $(".groupstr-btn").on("click", function(){
        var me = $(this);
        var groupstr = me.data('groupstr');
        $(".groupstr-input").val(groupstr);
        $(".groupstr-panel").hide();
    });

});