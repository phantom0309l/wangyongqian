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

    $('#add_rule').trigger('click');

    $(document).on('click', '.J_remove_rule', function () {
        if (confirm('确定删除吗？')) {
            $(this).parents('tr').remove();
        }
    })

    $('#form_submit').on('click', function () {
        var btn = this;
        var btnText = $(btn).text();
        $(btn).text('正在创建');
        $(btn).prop('disabled', true);
        $.ajax({
            url: '/adrmonitorrulemgr/ajaxaddpost',
            data: $('.myForm').serialize(),
            type: "post",
            dataType: "json",
            success: function(d) {
                if (d.errno == 0) {
                    alert('创建成功');
                    window.location.href = '/adrmonitorrulemgr/list';
                } else {
                    alert(d.errmsg);
                    $(btn).text(btnText);
                    $(btn).prop('disabled', false);
                }
            },
            error: function() {
                alert('创建失败');
                $(btn).text(btnText);
                $(btn).prop('disabled', false);
            }
        });
    })
})