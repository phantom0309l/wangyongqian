/**
 * Created by hades on 2017/8/2.
 */
function submit(menus, btn, callback) {
    let doctorid = $(btn).data('doctorid');
    let checkuptplmenuid = $(btn).data('checkuptplmenuid');

    $.ajax({
        type: "post",
        url: "/checkuptplmenumgr/ajaxModifyOfDoctorPost",
        data: {
            menus: menus,
            doctorid: doctorid,
            checkuptplmenuid: checkuptplmenuid
        },
        dataType: "json",
        success: function (d) {
            if (d.errno == 0) {
                alert('保存成功');
            } else {
                alert('保存失败');
            }
        },
        complete: function () {
            callback(false);
        }
    });
}