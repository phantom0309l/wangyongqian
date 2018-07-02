(function ($) {
    function fetchData(url, request, response) {
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: {
                k: request.term
            },
            success: function (d) {
                response($.map(d, function (item) {
                    return {
                        label: item.name + " (" + item.disease_name + ") <span class='text-gray'>" + item.id + "</span>",
                        value: item.name,
                        id: item.id,
                        type: request.type
                    }
                }));
            },
            complete: function () {

            }
        });
    }

    function onChange(settings, event, ui) {
        var callback = settings.change;
        if (typeof callback === 'function') {
            callback(event, ui);
        }
    }

    function onSelect(settings, event, ui) {
        if (settings.partner !== null) {
            setPartnerValue(settings.partner, ui.item.id);
        }

        var callback = settings.select;
        if (typeof callback === 'function') {
            callback(event, ui);
        }
    }

    function onClose(settings, event, ui) {
        var callback = settings.close;
        if (typeof callback === 'function') {
            callback(event, ui);
        }
    }

    function setPartnerValue(partner, value) {
        if (partner === null) {
            return false;
        }

        $(partner).val(value);
    }

    function initAutoComplete(settings) {
        $(settings.target).autocomplete({
            source: function (request, response) {
                if (settings.type === 'all') {
                    var first_char = request.term.substr(0, 1);
                    request.term = request.term.substr(1);
                    if (first_char === '@') { // 患者
                        request.type = 'patient';
                        fetchData('/commonservice/suggest/patient/', request, response);
                    } else if (first_char === '$') { // 医生
                        request.type = 'doctor';
                        fetchData('/commonservice/suggest/doctor/', request, response);
                    }
                } else {
                    request.type = settings.type;
                    fetchData('/commonservice/suggest/' + settings.type + '/', request, response);
                }
            },

            minLength: 1,

            change: function (event, ui) {
                onChange(settings, event, ui)
            },

            close: function (event, ui) {
                onClose(settings, event, ui);
            },

            select: function (event, ui) {
                onSelect(settings, event, ui);
            }

        }).focus(function () {
            $(this).autocomplete("search");
        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            return $("<li></li>")
                .data("item.autocomplete", item)
                .append("<div>" + item.label + "</div>")
                .appendTo(ul);
        };

        $(settings.target).on('keyup', function (event) {
            // partner存在的话，就顺便清空partner的value
            if (settings.partner !== null) {
                setPartnerValue(settings.partner, '');
            }
        });
    }

    $.fn.extend({
        "autoComplete": function (options) {
            var defaults = {
                type: '', // patient | doctor | all
                partner: null, // 小兄弟元素
                change: null,
                close: null, // 面板close事件
                select: null // select事件
            };

            var settings = $.extend(defaults, options);
            if (settings.type === '') {
                console.error('请设置autoComplete的type值');
                return false;
            }

            settings.target = this;
            initAutoComplete(settings);
        }
    })
})(jQuery);