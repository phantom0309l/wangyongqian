$(function () {
    function doctor_initAutoComplete() {
        $("#doctor-word").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "/commonservice/suggest/doctor/",
                    type: 'get',
                    dataType: 'json',
                    data: {
                        k: request.term,
                    },
                    success: function (d) {
                        if (d.length == 0) {
                            $('#doctorid').val('');
                        }
                        response($.map(d, function (item) {
                            return {
                                label: item.name + " (" + item.disease_name + ") <span class='text-gray'>" + item.id + "</span>",
                                value: item.name,
                                id: item.id
                            }
                        }));
                    },
                    complete: function (r, d) {
                        //$('#doctorid').val('');
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                $('#doctorid').val(ui.item.id);
            }
        }).focus(function () {
            $(this).autocomplete("search");
        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            return $("<li></li>")
                .data("item.autocomplete", item)
                .append("<div>" + item.label + "</div>")
                .appendTo(ul);
        };
    }

    doctor_initAutoComplete();
});