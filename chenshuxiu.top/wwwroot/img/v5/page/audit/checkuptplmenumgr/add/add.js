/**
 * Created by hades on 2017/8/2.
 */
function submit(menus, btn, callback) {
    let doctorid = $(btn).data('doctorid');
    let diseaseids = [];
    $('.J_disease').each(function (index, value) {
        if($(value).is(':checked')) {
            diseaseids.push($(value).val());
        }
    })

    if (diseaseids.length == 0) {
        callback(false);
        alert('请选择疾病');
        return false;
    }

    $.ajax({
        type: "post",
        url: "/checkuptplmenumgr/ajaxAddOfDoctorPost",
        data: {
            diseaseids: diseaseids,
            menus: menus,
            doctorid: doctorid,
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