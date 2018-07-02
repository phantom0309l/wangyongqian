var xwenda = window.xwenda || {};
xwenda = (function() {
    //私有函数
    var __showOrHide = function() {
        var me = $(this);
        me.css({
            "cursor": "pointer"
        });
        var showgroup = (me.data("showgroup") + "").split(",");
        var hidegroup = (me.data("hidegroup") + "").split(",");
        if (me.attr("type") == "checkbox") {
            if (me.is(":checked")) {
                showAndHide(showgroup, "show");
            } else {
                showAndHide(showgroup, "hide");
            }
        } else {
            showAndHide(showgroup, "show");
            showAndHide(hidegroup, "hide");
        }
    }

    var showAndHide = function(items, showOrHide) {
        if (items == undefined || items.length == 0) {
            return;
        }
        $.each(items, function(i, itemstr) {
            itemstr = $.trim(itemstr);
            if (itemstr !== "") {
                var tmp = itemstr.split("---");
                var start = $.trim(tmp[0]);
                var end = $.trim(tmp[1]) || "";
                var color = "";
                if (start == "") {
                    return true;//continue;
                }
                if (end == "") {//独立控制
                    if (showOrHide == "show") {
                        $("." + start).show();
                        color = "red";
                    } else {
                        //TODO
                        $("." + start).hide();
                        color = "yellow";
                    }
                    //$("." + start).show().find(".sheet-question-box").css("background", color);
                } else {//start end 范围控制
                    var next = $("." + start).prev();
                    while(true) {
                        next = next.next();
                        if (next.length == 0) {
                            break;
                        }
                        if (!next.hasClass("questionDiv")) {
                            continue;
                        } else {
                            //console.log(next.attr("class"));
                            if (showOrHide == "show") {
                                next.show();
                                color = "red";
                            } else {
                                next.hide();
                                color = "yellow";
                            }
                            //next.show().find(".sheet-question-box").css("background", color);
                        }
                        //找到了最后一个
                        if (next.hasClass(end)) {
                            break;
                        }
                    }
                }
            }
        });
    }

    //外露接口函数================================================================
    var hide4NdChecked = function(e) {
        e.parent().siblings().hide();
        $('.havesub').each(function() {
            var showgroup = ($(this).data("showgroup") + "").split(",");
            var hidegroup = ($(this).data("hidegroup") + "").split(",");
            $.each(showgroup, function(i, itemstr) {
                if (itemstr !== "") {
                    $("." + itemstr).hide();
                }
            });
            $.each(hidegroup, function(i, itemstr) {
                if (itemstr !== "") {
                    $("." + itemstr).hide();
                }
            });
        });
    }

    function handleSelectChange(className) {
        $('.sheet-question-select').each(function(index, item){
            var option = $(this).find("option."+className+":checked");
            if (option.length == 0) {
                return true;//continue;
            }
            $(item).bind("change", function(){
                var selectedOption = $(this).find("option").eq($(this).get(0).selectedIndex);
                var showgroup = selectedOption.data("showgroup").split(",");
                var hidegroup = selectedOption.data("hidegroup").split(",");

                showAndHide(showgroup, "show");
                showAndHide(hidegroup, "hide");
            });
        });
    }

    var subClick = function(className) {
        $(document).on("click", "." + className, __showOrHide);
        //由于select的option不能响应事件
        handleSelectChange(className)
        //初始化默认选中的级联show/hide
        $("."+className).each(function(){
            if ($(this).is(":checked")) {
                var showgroup = ($(this).data("showgroup") + "").split(",");
                var hidegroup = ($(this).data("hidegroup") + "").split(",");
                //console.log($(this).attr("id"), $(this).attr("class"), "========show", showgroup);
                showAndHide(showgroup, "show");
                //console.log($(this).attr("id"), $(this).attr("class"), "========hide", hidegroup);
                showAndHide(hidegroup, "hide");
            }
        });
    }

    var resetHideInputs = function() {
        $("input:hidden").each(function() {
            var me = $(this);
            if (me.attr("type") !== "hidden") {
                if (me.attr("type") == "radio") {
                    me.attr("checked", "");
                } else {
                    me.val("");
                }
            }
        });

        $("textarea:hidden").each(function() {
            $(this).val("");
        });

        $("checkbox:hidden").each(function() {
            $(this).attr("checked", "");
        });
    }

    var inputNdOnClick = function() {
        $(document).on("click", ".input-nd", function() {
            if ($(this).is(':checked')) {
                hide4NdChecked($(this));
            } else {
                $(this).parent().siblings().show();
                $('.havesub').each(function() {
                    if ($(this).is(':checked')) {
                        var showgroup = ($(this).data("showgroup") + "").split(",");
                        $.each(showgroup, function(i, itemstr) {
                            if (itemstr !== "") {
                                $("." + itemstr).show();
                            }
                        });
                    }
                });
            }
        });
    }

    var provinceCity = {
        createAddressSelect: function(classname, parentNode) {
            var str = '<select class="' + classname + '_province"></select><select class="' + classname + '_city none"></select>';
            parentNode.html(str);
        },
        createOption: function(value) {
            return "<option value='" + value + "'>" + value + "</option>";
        },
        appendHtmlToSelect: function(node, data, otherstr) {
            var self = this;
            var optionHtml = otherstr || "";
            $.each(data, function(i, item) {
                optionHtml += self.createOption(item.name);
            });
            node.append(optionHtml);
        },
        getListByName: function(name) {
            var list = [];
            $.each(cityData, function(i, item) {
                if (item.name == name) {
                    list = item.list;
                    return false;
                }
            });
            return list;
        },
        giveAddressSelectBindEvent: function(province, city) {
            //var province = $(".select_province");
            //var city = $(".select_city");
            var self = this;

            self.appendHtmlToSelect(province, cityData, "<option value=''>请选择省份</option>");

            province.on("change", function() {
                if (city) {
                    city.html("");
                    var me = $(this);
                    var name = me.val();
                    if (name == "") {
                        city.hide()
                    } else {
                        var list = self.getListByName(name);
                        self.appendHtmlToSelect(city, list, "<option value=''>请选择地区</option>");
                        city.show()
                    }
                    me.parents(".J-selectShell").prev().val("");
                } else {
                    $(this).parents(".J-selectShell").prev().val($(this).val());
                }
            });

            if (city) {
                city.on("change", function() {
                    var city = $(this);
                    var pnode = city.parents(".J-selectShell");
                    var province = pnode.find(".select_province");
                    var v = province.val() + "-" + city.val();
                    pnode.prev().val(v);
                });
            }
        },

        initAddressSelect: function(classname, parentNode, needCity) {
            var self = this;
            self.createAddressSelect(classname, parentNode);
            var province = parentNode.find("." + classname + "_province");
            if (needCity) {
                var city = parentNode.find("." + classname + "_city");
            } else {
                city = '';
            }
            self.giveAddressSelectBindEvent(province, city);
        },
        init: function() {
            var self = this;
            $(".sheet-question-provincecity").each(function() {
                var me = $(this);
                var shell = $("<div class='J-selectShell'></div>");
                self.initAddressSelect("select", shell, true);
                me.parent().append(shell);
            });
            $(".sheet-question-province").each(function() {
                var me = $(this);
                var shell = $("<div class='J-selectShell'></div>");
                self.initAddressSelect("select", shell, false);
                me.parent().append(shell);
            });
        },
        show: function() {
            var self = this;
            $('.sheet-question-provincecity').each(function() {
                var data = $(this).val();
                if (data) {
                    var d = $(this).val().split("-");
                    $(this).next().find('.select_province').val(d[0]);
                    var city = $(this).next().find('.select_city');
                    var name = d[0];
                    var list = self.getListByName(name);
                    self.appendHtmlToSelect(city, list, "<option value=''>请选择地区</option>");
                    city.val(d[1]);
                    city.show()
                }
            });
            $('.sheet-question-province').each(function() {
                var data = $(this).val();
                if (data) {
                    $(this).next().find('.select_province').val(data);
                }
            });
        }
    };

    return {
        subClick: subClick,
        resetHideInputs: resetHideInputs,
        inputNdOnClick: inputNdOnClick,
        hide4NdChecked: hide4NdChecked,
        provinceCity: provinceCity
    }
}());

$(function() {
    xwenda.subClick('havesub');
    xwenda.resetHideInputs();
    xwenda.inputNdOnClick();
    $('.input-nd').each(function() {
        if ($(this).is(':checked')) {
            xwenda.hide4NdChecked($(this));
        }
    });
});
