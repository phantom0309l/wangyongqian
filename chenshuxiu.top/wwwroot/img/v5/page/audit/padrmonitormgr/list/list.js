/**
 * @param {{errmsg:string, errno:int}} d
 */
$(function () {
    $('#modal-modify').on('click', '.J_modal_submit', function () {
        let btn = this;
        let btnText = $(btn).text();
        $(btn).text('正在保存');
        $(btn).prop('disabled', true);

        $.ajax({
            type: "post",
            url: "/padrmonitormgr/ajaxmodifypost",
            data: $('#modify_form').serialize(),
            dataType: "json",
            success: function (d) {
                if (d.errno === "0") {
                    window.location.reload();
                } else {
                    alert(d.errmsg);
                    $(btn).text(btnText);
                    $(btn).prop('disabled', false);
                }
            },
            error: function () {
                alert('保存失败');
                $(btn).text(btnText);
                $(btn).prop('disabled', false);
            }
        });
    })
});


$(function () {
    let patientPictures_loaded = false;

    $('#addLeftImg').after(`<li class="li_last" id="select_patientPictures">
                                          <div class="last_img uploadifyImg">
                                              <div class="uploadify" style="height: 44px; width: 66px;">
                                                  <button type="button" data-backdrop="static" data-toggle="modal" data-target="#modal-patientPictures" class="J_patientPictures_button"></button>
                                              </div>
                                              <div class="addImg" style="padding-top: 17px;">选择患者图片</div>
                                          </div>
                                  </li>`);

    // 删除图片
    $(document).on('click', '.J_upload_delPic', function (e) {
        let patientpictureid = $(this).data('patientpictureid');
        let el = $('#patientPicture_' + patientpictureid);
        el.data('selected', false);
        el.find('.img-container').find('.fa-check-circle-o').eq(0).hide();
        $('#del_' + patientpictureid).remove();
    });

    // 修改-模态框 显示事件
    $('#modal-modify').on('show.bs.modal', function (event) {
        App.blocks('#modal-modify .block', 'state_loading');

        $('#addLeftImg').siblings('.li_pic').remove();

        let btn = event.relatedTarget;

        let padrmonitorid = btn.dataset.padrmonitorid;
        $(this).find("input[name='padrmonitorid']").val(padrmonitorid);
        $(this).find("input[name='thedate']").val(btn.dataset.thedate);

        $('.J_modal_modify_title').text(btn.dataset.enamestr);

        $.ajax({
            "type": "get",
            "url": "/padrmonitormgr/ajaxobjpictures",
            dataType: "json",
            data: {
                'padrmonitorid': padrmonitorid,
            },
            "success": function (d) {
                /**
                 * @param {{objpictures:string}} data
                 */
                if (d.errno === "0") {
                    d.data.objpictures.forEach(function (value) {
                        /**
                         * @param {{patientpictureid:string, thumburl:string}} value
                         */
                        let pictureid = value.pictureid;
                        let patientpictureid = value.patientpictureid;

                        if ($('#del_' + patientpictureid).length === 0) {
                            let thumburl = value.thumburl;
                            let li = createPictureLi(patientpictureid, pictureid, thumburl);
                            $('#addLeftImg').before(li);
                        }
                    })
                }
            },
            "error": function () {
                $(this).find('.block-content').html('<div class="text-center p20">' +
                    '<span class="text-danger mr5">加载失败 </span>' +
                    '<button id="modal-refresh" class="btn btn-sm btn-danger" type="button"><i class="fa fa-refresh"></i> 重试</button>' +
                    '</div>');
            },
            "complete": function () {
                App.blocks('#modal-modify .block', 'state_normal');
            }
        });
    });

    // 创建li节点
    function createPictureLi(patientpictureid, pictureid, thumburl) {
        return '<li class="li_pic" id="del_' + patientpictureid + '">' +
            '<input type="hidden" name="pictureids[]" value="' + pictureid + '">' +
            '<p class="setting_thumbimg" style="margin-bottom: 0;">' +
            '<img path="' + pictureid + '" src="' + thumburl + '">' +
            '</p> ' +
            '<p class="setting_title" style="margin-bottom: 0;">' +
            '<span>患者图片</span>' +
            '<input type="text" name="multiImageTitle[]">' +
            '</p>' +
            '<a class="J_upload_delPic" data-patientpictureid="' + patientpictureid + '">' +
            '<img src="' + img_uri + '/m/img/close.jpg" width="18" height="18"></a>' +
            '</li>';
    }

    // 患者图片按钮点击事件
    $(document).on('click', '.J_patientPictures_button', function () {
        if (patientPictures_loaded) {   // 已经加载过了
            return false;
        }

        let data = {"patientid": patientid, "doctorid": doctorid};
        let block_content = $('#modal-patientPictures').find('.block-content');
        $.ajax({
            "type": "get",
            "url": "/reportmgr/ajaxpatientpictures",
            dataType: "html",
            data: data,
            "success": function (d) {
                try {
                    let response = eval('(' + d + ')');
                    if (response.errno) {
                        block_content.html('<div class="text-center p20">' +
                            '<span class="text-danger">' + response.errmsg + '</span>' +
                            '</div>');
                    } else {
                        patientPictures_loaded = true;
                        block_content.html(d);
                        updateSelected();
                    }
                } catch (e) {
                    patientPictures_loaded = true;
                    block_content.html(d);
                    updateSelected();
                }
            },
            "error": function () {
                block_content.html('<div class="text-center p20">' +
                    '<span class="text-danger mr5">加载失败 </span>' +
                    '<button id="modal-refresh" class="btn btn-sm btn-danger" type="button"><i class="fa fa-refresh"></i> 重试</button>' +
                    '</div>');
            }
        });
    });

    // 患者图片-模态框
    let modal_patientPictures = $('#modal-patientPictures');

    // 患者图片-模态框 显示事件
    modal_patientPictures.on('show.bs.modal', function () {
        updateSelected();
    });

    function updateSelected() {
        // 回显选中状态
        modal_patientPictures.find('.patientPictures-Box').find('.patientPicture-item').each(function (index, value) {
            let patientpictureid = $(value).data('patientpictureid');

            let icon = $(value).find('.img-container').find('.fa-check-circle-o').eq(0);
            if ($('#del_' + patientpictureid).length === 0) {
                $(value).removeClass('selected');
                $(value).data('selected', false);
                icon.hide();
            } else {
                $(value).addClass('selected');
                $(value).data('selected', true);
                icon.show();
            }
        });
    }

    // 患者图片-模态框 点击图片
    modal_patientPictures.on('click', '.patientPicture-item', function () {
        let selected = $(this).data('selected');
        let icon = $(this).find('.img-container').find('.fa-check-circle-o').eq(0);
        if (selected) {
            $(this).removeClass('selected');
            $(this).data('selected', false);
            icon.hide();
        } else {
            $(this).addClass('selected');
            $(this).data('selected', true);
            icon.show();
        }
    });

    // 患者图片-模态框 保存
    modal_patientPictures.on('click', ' .J_modal_submit', function () {
        modal_patientPictures.find('.patientPictures-Box').find('.patientPicture-item').each(function (index, value) {
            let pictureid = $(value).data('pictureid');
            let patientpictureid = $(value).data('patientpictureid');

            let selected = $(value).data('selected');
            if (selected) {
                if ($('#del_' + patientpictureid).length === 0) {
                    let thumburl = $(value).data('thumburl');
                    let li = createPictureLi(patientpictureid, pictureid, thumburl);
                    $('#addLeftImg').before(li);
                }
            } else {
                $('#del_' + patientpictureid).remove();
            }
        });
        modal_patientPictures.modal('hide');
    });
});