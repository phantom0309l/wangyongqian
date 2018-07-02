$(function () {
    function patient_initAutoComplete() {
        $("#patient-listcond-word").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "/commonservice/suggest/patient/",
                    type: 'get',
                    dataType: 'json',
                    data: {
                        k: request.term,
                    },
                    success: function (d) {
                        response($.map(d, function (item) {
                            return {
                                label: item.name + " (" + item.disease_name + ") <span class='text-gray'>" + item.id + "</span>",
                                value: item.name,
                                id: item.id
                            }
                        }));
                    },
                    complete: function (d) {
                        $('#patientid').val('');
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                $('#patientid').val(ui.item.id);
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

    patient_initAutoComplete();
});