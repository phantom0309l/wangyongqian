$(function() {
    initSWFJs();
});
function initSWFJs()
{
//    var fls= flashChecker();
//    if(!fls.f){
//        if(confirm("您的浏览器不支持Flash,无法进行图片上传,是否安装?"))
//        {
//            window.open("http://get2.adobe.com/cn/flashplayer/");
//        }
//        haveFlash = false;
//        return;
//    }
//    if(fls.v < 9){
//        alert("您的浏览器Flash Player版本太低,无法进行图片上传操作,请更新Adobe Flash Player.");
//        haveFlash = false;
//        return;
//    }

    var queueNum = 0;
    $('#file_upload').uploadify({
        'fileObjName': 'imgurl',
        'auto': true,
        'multi': true,
        'removeCompleted': true,
        'buttonClass': 'uploadifyButton',
        'fileSizeLimit': '5000KB',
        'fileTypeExts': '*.jpg;*.jpeg;*.gif;*.png',
        'buttonText': '开始上传',
        'width': 66,
        'height': 44,
        'swf': swfUrl,
        'uploader': uploadImageUrl,
        'overrideEvents': ['onSelectError', 'onDialogClose'],
        'onSelectError': function(file, errorCode, errorMsg) {
            switch (errorCode) {
                case -110:
                    alert("图片 [" + file.name + "] 大小超出系统限制的" + $('#file_upload').uploadify('settings', 'fileSizeLimit') + "大小！");
                    break;
            }
            return false;
        },
        'onDialogClose': function(queueData) {
        },
        'onUploadStart': function(file) {
        },
        'onUploadSuccess': function(file, data, response) {
            addImage(data);
        },
        'onClearQueue': function(queueItemCount) {
        }
    });
}

function addImage(data)
{
    var imageObj = eval('(' + data + ')');
    alert(imageObj.msg);
    var imageSrc = imageObj.domain + imageObj.dir + "/" + imageObj.url;
    var width = imageObj.thumbWidth;
    var height = imageObj.thumbHeight;
    imgType = imageObj.imgType;


    $('#preview').attr('src', imageSrc);
    $('#preview').val('true');
    $('#imageBox').html("<img src='" + imageSrc + "' width='" + width + "' height='" + height + "'>");

}
