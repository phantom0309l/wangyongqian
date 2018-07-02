/**
 * Created by hades on 2017/8/2.
 */

// MRAK: - link=parent_default、sub_default为默认值，link=parent_node为父菜单，link=xxx为普通一级菜单
// 之所以用default，不用空字符串，是因为检查报告本身的link有可能就是空字符串
$(function () {
    // 根据自己的菜单数据生成菜单
    myData.forEach(function (value, index, array) {
        // 生成父菜单
        var ul = $('#menus');
        let item = getParentMenuItem(value);
        ul.append(item);

        // 检查是否有子菜单
        let submenus = value.submenus;
        if (submenus != null && submenus.length > 0) {
            // 生成父菜单下的子菜单
            let subUl = item.find('ul');
            submenus.forEach(function (subValue, subIndex, subArray) {
                let subItem = getSubMenuItem(subValue);
                subUl.append(subItem);
            })
        }
    })

    // 初始化S2控件
    $(".js-select2-parent").select2({
        data: data,
        placeholder: "选择检查报告",
    })
    $(".js-select2-sub").select2({
        data: subData,
        placeholder: "选择检查报告",
    })

    // 父菜单检查报告改变
    $(document).on("change", '.js-select2-parent', function (e) {
        var item = $(this).parent();
        item.data('name', '');
        let res = $(this).select2("data")[0];
        if (res != undefined && res != null) {
            item.data('link', res.id);
        }

        var menu_parent_name = item.find('.menu-parent-name');
        var menu_add = item.find('.menu-add');
        if (res.id == 'parent_node') {
            menu_parent_name.show();
            menu_add.prop('disabled', false);
            item.data('submenus', true);
        } else {
            menu_parent_name.val('');
            menu_parent_name.hide();
            menu_add.prop('disabled', true);
            item.next().find('li').remove();
            item.data('submenus', false);
        }
    });

    // 父菜单输入框改变
    $(document).on("change", '.menu-parent-name', function (e) {
        var item = $(this).parent();
        item.data('name', $(this).val());
    });

    // 子菜单检查报告改变
    $(document).on("change", '.js-select2-sub', function (e) {
        var item = $(this).parent();
        let res = $(this).select2("data")[0];
        if (res != undefined && res != null) {
            item.data('link', res.id);
        }
    });

    // 增加子菜单
    $(document).on('click', '.menu-add', function (e) {
        var ul = $(this).parent().parent().next();
        var item = getSubMenuItem();
        ul.append(item);

        item.find(".js-select2-sub").select2({
            data: subData,
            placeholder: "选择检查报告",
        })
    })

    // 删除按钮点击
    $(document).on('click', '.menu-remove', function (e) {
        var confirm_message = '确定删除当前菜单吗？';
        if (!confirm(confirm_message)) {
            return;
        }
        $(this).parent().parent().parent().remove();
    })

    // 创建父菜单按钮点击
    $('#create_parent_menu').on('click', function (e) {
        var ul = $('#menus');
        var item = getParentMenuItem();
        ul.append(item);

        item.find(".js-select2-parent").select2({
            data: data,
            placeholder: "选择检查报告",
        })
    })

    // 保存按钮点击
    $(document).on('click', '.J_submit', function (e) {
        var self = this;

        sending(self, true);

        // 遍历菜单，组织菜单数据
        var menus = [];
        let errMsg = '';
        $('#menus li.open').each(function (index, li) {
            let parentMenu = {};
            let parent = $(li).find('.menu-parent');

            let link = parent.data('link');

            if (link == undefined || link == null || link == 'parent_default' || link == '') {
                errMsg = '请选择父菜单检查报告';
                return false;
            }
            if (link == 'parent_node') {    // 父菜单
                let name = parent.data('name');
                if (name == '') {
                    errMsg = '请输入父菜单名称';
                    return false;
                }
                parentMenu.link = '';
                parentMenu.name = name;
            } else {
                let strArr = link.split('-_-');
                parentMenu.link = strArr[1];
                parentMenu.name = strArr[0];
            }

            let submenus = parent.data('submenus');
            let subMenus = [];
            let sub = parent.next();
            if (submenus == true) {
                if (sub.find('li').length == 0) {
                    errMsg = '请设置子菜单';
                    return false;
                }
                sub.find('li').each(function (index, li) {
                    let sub = $(li).find('.menu-sub');

                    let _link = sub.data('link');

                    if (_link == undefined || _link == null || _link == 'sub_default' || _link == '') {
                        errMsg = '请选择子菜单检查报告';
                        return false;
                    }

                    let subMenu = {};
                    subMenu.show = 1;

                    let strArr = _link.split('-_-');
                    subMenu.link = strArr[1];
                    subMenu.name = strArr[0];

                    subMenus.push(subMenu)
                })
                if (errMsg != '') {
                    return false;
                }
                parentMenu.submenus = subMenus;
            } else {
                parentMenu.show = 1;
            }
            menus.push(parentMenu)
        })

        if (errMsg != '') {
            sending(self, false);
            alert(errMsg);
            return false;
        }

        submit(menus, self, function (disabled) {
            sending(self, disabled);
        });
    });
});

// 生成父菜单
function getParentMenuItem(value) {
    // 默认值
    let text = '';
    let id = 'parent_default';
    let submenus = false;

    if (value != null && value != undefined) {  // value有效
        id = value.id;
        text = value.text;

        if (value.submenus != null && value.submenus.length > 0) {  // 有子菜单
            id = 'parent_node';
            submenus = true;
        }
    }

    let item = $(
        `<li class="open">
                    <div class="menu-item menu-parent">
                        <input class="js-select2-parent form-control" value="${id}"/>
                        <input type="text" class="form-control menu-parent-name" style="${id == 'parent_node' ? '' : 'display: none'}" placeholder="请输入父菜单名称" value="${text}"/>
                        <div class="btn-group" role="group">
                            <button class="btn btn-default menu-remove" type="button">
                                <i class="fa fa-minus"></i>
                            </button>
                            <button class="btn btn-default menu-add" type="button" ${id != 'parent_node' ? 'disabled' : ''}>
                                <i class="fa fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <ul></ul>
                </li>`);

    item.find('.menu-parent').data('name', text);
    item.find('.menu-parent').data('link', id);
    item.find('.menu-parent').data('submenus', submenus);

    return item;
}

// 生成子菜单
function getSubMenuItem(value) {
    // 默认值
    let id = 'sub_default';
    if (value != null && value != undefined) {  // value有效
        id = value.id;
    }

    let item = $(
        `<li>
                    <div class="menu-item menu-sub">
                        <input class="js-select2-sub form-control" value="${id}"/>
                        <div class="btn-group" role="group">
                            <button class="btn btn-default menu-remove" type="button">
                                <i class="fa fa-minus"></i>
                            </button>
                        </div>
                    </div>
                </li>`);

    item.find('.menu-sub').data('link', id);

    return item;
}

// 发送状态
function sending(btn, disabled) {
    $(btn).prop('disabled', disabled);

    var i = $(btn).find('i').eq(0);
    if (disabled) {
        i.addClass('fa-refresh');
        i.addClass('fa-spin');
    } else {
        i.removeClass('fa-refresh');
        i.removeClass('fa-spin');
    }
}