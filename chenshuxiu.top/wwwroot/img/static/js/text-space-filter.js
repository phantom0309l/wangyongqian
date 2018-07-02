$(document).ready(function(){
    $('input, textarea').each(function(){
        if ($(this).attr('type') != 'hidden'){
            $(this).on('input', function(e){
                var value = $(this).val(); 
                var valueResult = "";
                if (typeof value == 'string') {
                    for (var i = 0; i < value.length; i++) {
                        var asciiCode = value.charCodeAt(i);
                        if (  asciiCode <= 31 || asciiCode == 127) {
                            continue;
                        }
                        valueResult += String.fromCharCode(asciiCode);
                    }
                    $(this).val(valueResult);
                }
            })
        };
    })
})
