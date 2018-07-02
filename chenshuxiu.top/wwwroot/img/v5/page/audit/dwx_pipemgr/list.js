function over(tr) {
    $(tr).addClass('trOnMouseOver');
}

function out(tr) {
    $(tr).removeClass('trOnMouseOver');
}

$(function () {
    App.initHelper('select2');

    $('.select-doctor').hide();

    $('.deleteNew').on('click', function () {
        var me = $(this);
        var doctorid = me.data('doctorid');
        $.ajax({
            type: "get",
            url: "/doctormgr/deletenewjson",
            dataType: "html",
            data: {
                "doctorid": doctorid
            },
            success: function (d) {
                $("#shownew-" + doctorid).text('');
            },
            error: function (e) {
                alert("操作失败!");
            }
        });
    });

    // 点击查看
    $(document).on("click", ".showDwxPipeHtml", function () {
        $("tr.trOnSeleted").removeClass("trOnSeleted").removeClass("trOnMouseOver");
        $(this).parents("tr").addClass("trOnSeleted");

        $("#content_repty").val('');

        var me = $(this);
        var doctorid = me.data("doctorid");
        var doctorname = me.data("doctorname");

        // 流列表
        $("#list-timeline").html('');
        $(".showDwxPipeMore").show();
        $("#select_doctorid").val(doctorid);
        $("#select_doctor_name").text(doctorname);
        $.ajax({
            "type": "get",
            "data": {
                doctorid: doctorid
            },
            "dataType": "html",
            "url": "/dwx_pipemgr/pipelisthtml",
            "success": function (data) {
                $(".list-timeline").html(data);
            }
        });
    });

    // 查看更多
    $(document).on("click", ".showDwxPipeMore", function () {
        //页面显示最后流的日期
        var doctorid = $("#select_doctorid").val();
        var offsetpipetime = $(".list-timeline-time").last().text();
        $.ajax({
            "type": "get",
            "data": {
                doctorid: doctorid,
                offsetpipetime: offsetpipetime,
                page_size: 10
            },
            "dataType": "html",
            "url": "/dwx_pipemgr/pipelisthtml",
            "success": function (data) {
                $(".list-timeline").append(data);

                var timestamp = Date.parse(new Date(offsetpipetime)) / 1000;
                var pipecnt = $("#pipe_cnt_" + timestamp).val();
                if (pipecnt === "0") {
                    alert("没有更多了!");
                    $(".showDwxPipeMore").hide();
                }
            }
        });
    });

    // 给医生发消息
    $(document).on('click', '#auditor_reply_to_doctor', function (event) {
        event.preventDefault();
        /* Act on the event */

        var doctorid = $("#select_doctorid").val();
        var content = $("#content_repty").val();
        if (content === '') {
            alert("回复内容不能为空!");
        } else {
            $.ajax({
                url: '/dwx_pipemgr/auditorToDoctorForDwxJson',
                type: 'get',
                dataType: 'text',
                data: {
                    doctorid: doctorid,
                    content: content
                }
            }).done(function (data) {
                if (data === 'nowxuser') {
                    alert("医生没有关注方寸管理端");
                } else {
                    console.log("success");
                    alert("回复成功");
                    $("#doctorid-" + doctorid).click();
                }
            }).fail(function () {
                console.log("error");
            }).always(function () {
                console.log("complete");
            });

        }
    });

    // 给医生发图片
    $(document).on('click', '#JS_reply_pic', function (event) {
        event.preventDefault();
        /* Act on the event */

        var doctorid = $("#select_doctorid").val();

        var pictureids = [];
        $("input[name='dwxpicmsg[]']").each(function(){
            pictureids.push($(this).val());
            console.log($(this).val())
        });

        console.log(pictureids);
        if (pictureids.length < 1) {
            alert("图片不能为空!");
        } else {
            $(this).find("span").text("正在发送中");
            $(this).attr("disabled", true);

            var self = $(this);

            $.ajax({
                url: '/dwx_pipemgr/sendAuditor2DoctorPicJson',
                type: 'get',
                dataType: 'json',
                data: {
                    doctorid: doctorid,
                    pictureids: pictureids
                }
            }).done(function (response) {
                if (response.errno == 0) {
                    alert("回复成功");
                    $("#doctorid-" + doctorid).click();
                } else {
                    alert(response.errmsg);
                }
            }).fail(function () {
                console.log("error");
            }).always(function () {
                console.log("complete");
                self.find("span").text("回复");
                self.attr("disabled", false);
                $("#showimg_dwxpicmsg").html("");

                $("#doctorid-" + doctorid).click();
            });

        }
    });

    $("#pipeDwxPipeListHtml").show();
    $("#dwx_pipeshowMore").show();
    $(".showDwxPipeMore").hide();

    $('.showDwxPipeHtml').first().click();

    // oneUI
    App.initHelpers('magnific-popup');
});
