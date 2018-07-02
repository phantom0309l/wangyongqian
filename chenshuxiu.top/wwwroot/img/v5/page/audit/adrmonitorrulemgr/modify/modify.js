/**
 * Created by hades on 2017/8/22.
 */
$(function () {

    var rule_tpl = $('#rule_table tr.hide');

    var index = 0;

    $('#add_rule').on('click', function () {
        var tpl = rule_tpl.clone();
        tpl.removeClass('hide');

        tpl.find('input').each(function () {
            var name = $(this).data('name');
            if ('items' == name) {
                $(this).prop("name", "rules[" + index + "][" + name + "][]");
            } else {
                $(this).prop("name", "rules[" + index + "][" + name + "]");
            }
        })
        $('#rule_table').append(tpl);
        index++;
    })

    $(document).on('click', '.J_remove_rule', function () {
        if (confirm('确定删除吗？')) {
            $(this).parents('tr').remove();
        }
    })

    $('#form_submit').on('click', function () {
        $("select").prop("disabled", false);
        var btn = this;
        var btnText = $(btn).text();
        $(btn).text('正在修改');
        $(btn).prop('disabled', true);
        $.ajax({
            url: '/adrmonitorrulemgr/ajaxmodifypost',
            data: $('.myForm').serialize(),
            type: "post",
            dataType: "json",
            success: function(d) {
                if (d.errno == 0) {
                    alert('修改成功');
                    window.location.reload();
                } else {
                    alert(d.errmsg);
                    $(btn).text(btnText);
                    $(btn).prop('disabled', false);
                    $("select").prop("disabled", true);
                }
            },
            error: function() {
                alert('修改失败');
                $(btn).text(btnText);
                $(btn).prop('disabled', false);
                $("select").prop("disabled", true);
            }
        });
    })
})