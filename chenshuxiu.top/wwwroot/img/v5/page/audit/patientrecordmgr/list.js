$(function () {
    $(document).on('click', '.a-delete, .J_delete', function () {
        if (!confirm("确定删除吗？")) {
            return false;
        }
        var patientrecordid = $(this).data('patientrecordid');
        var url = $(this).data('href');
        $.ajax({
            "type": "post",
            "data": {patientrecordid: patientrecordid},
            "dataType": "json",
            "url": url,
            "success": function (res) {
                if (res.errno === '0') {
                    alert('删除成功');
                    window.location.reload();
                } else {
                    alert(res.errmsg);
                }
            },
            "error": function () {
                alert('操作失败');
            }
        })

    })
});
