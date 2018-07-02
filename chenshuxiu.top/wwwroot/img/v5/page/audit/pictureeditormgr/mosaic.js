$(function () {
    $.mosaic = {
        selection : {},
        originWidth : 0,
        originHeight : 0,
        imageDataStack : [],
        cropItemStack : [],
        mosaicSize : 30,
        $image : null,
        $canvas : null,
        init : function ($image, $canvasb) {
            this.$image = $image;
            this.$canvas = $canvasb;
            this.originWidth = this.$image.width();
            this.originHeight = this.$image.height();
            this.imageDataStack = [];
            this.cropItemStack = [];
            $canvasb.width(this.originWidth);
            $canvasb.height(this.originHeight);
            this.initJrac();
            this.bindSave();
            this.bindMosaic();
            this.bindUndo();
            this.bindResizeImage();
            this.bindSetMosaicSize();
            this.bindGoOcr();
            this.bindCertainGoocr();
            this.bindRotateBtn();
        },

        initJrac : function () {
            var self = this;
            $('.pane img').jrac({
                'crop_width': 100,
                'crop_height': 50,
                'crop_x': 100,
                'crop_y': 100,
                'image_width': this.originWidth,
                'viewport_onload': function() {
                    var $viewport = this;
                    var inputs = $viewport.$container.parent('.pane').find('.coords input:text');
                    var events = ['jrac_crop_x','jrac_crop_y','jrac_crop_width','jrac_crop_height','jrac_image_width','jrac_image_height'];
                    for (var i = 0; i < events.length; i++) {
                        var event_name = events[i];
                        // Register an event with an element.
                        $viewport.observator.register(event_name, inputs.eq(i));
                        // Attach a handler to that event for the element.
                        inputs.eq(i).bind(event_name, function(event, $viewport, value) {
                            var eventName = event.type;
                            if (eventName == 'jrac_crop_x') {
                                self.selection.x1 = value;
                            } else if (eventName == "jrac_crop_y") {
                                self.selection.y1 = value;
                            } else if (eventName == "jrac_crop_width") {
                                self.selection.width = value
                            } else if (eventName == "jrac_crop_height") {
                                self.selection.height = value
                            }
                            self.selection.x2 = self.selection.x1 + self.selection.width;
                            self.selection.y2 = self.selection.y1 + self.selection.height;
                            $(this).val(value);
                        })
                        // Attach a handler for the built-in jQuery change event, handler
                        // which read user input and apply it to relevent viewport object.
                            .change(event_name, function(event) {
                                var event_name = event.data;
                                $viewport.$image.scale_proportion_locked = $viewport.$container.parent('.pane').find('.coords input:checkbox').is(':checked');
                                $viewport.observator.set_property(event_name, $(this).val());
                            });
                    }
                    $viewport.$container.append('<div>图片原始大小: '
                        +$viewport.$image.originalWidth+' x '
                        +$viewport.$image.originalHeight+'</div>')
                }
            })
            // React on all viewport events.
                .bind('jrac_events', function(event, $viewport) {
                    var width = $('#image').width();
                    var height = $('#image').height();
                    $('#canvasb').width(width);
                    $('#canvasb').height(height);

                    var inputs = $(this).parents('.pane').find('.coords input');
                    inputs.css('background-color',($viewport.observator.crop_consistent())?'#46c37b':'#d26a5c');
                });
        },

        mosaicEffect : function (selection) {
            var img = this.$image[0];
            var ratio = this.originWidth/img.width;
            selection.x1 = Math.floor(selection.x1 *ratio);
            selection.y1 = Math.floor(selection.y1 *ratio);
            selection.x2 = Math.floor(selection.x2 *ratio);
            selection.y2 = Math.floor(selection.y2 *ratio);

            //img.crossOrigin = "Anonymous";
            var canvasb = this.$canvas[0];
            var ctxb = canvasb.getContext("2d");
            if (this.isCanvasBlank(canvasb)) {
                ctxb.drawImage(img, 0, 0, this.originWidth, this.originHeight);
            }

            var tmpImageData = ctxb.getImageData(0, 0, canvasb.width, canvasb.height);
            var tmpPixelData = tmpImageData.data;
            this.imageDataStack.push(tmpImageData);

            var imageData = this.copyImageData(tmpImageData);
            var pixelData = imageData.data;
            //定义为一块的边长是多少(这个图像宽高的整数倍)
            var size = this.mosaicSize;
            var totalnum = size * size;
            for (var i = selection.y1; i < selection.y2; i += size) {
                for (var j = selection.x1; j < selection.x2; j += size) {
                    //这块是计算每一块全部的像素值--平均值
                    var totalr = 0, totalg = 0, totalb = 0;
                    for (var dx = 0; dx < size; dx++)
                        for (var dy = 0; dy < size; dy++) {

                            var x = i + dx;
                            var y = j + dy;

                            var p = x * canvasb.width + y;
                            totalr += tmpPixelData[p * 4 + 0];
                            totalg += tmpPixelData[p * 4 + 1];
                            totalb += tmpPixelData[p * 4 + 2];
                        }

                    var p = i * canvasb.width + j;
                    var resr = totalr / totalnum;
                    var resg = totalg / totalnum;
                    var resb = totalb / totalnum;

                    //这个快像素的值=它的平均值
                    for (var dx = 0; dx < size; dx++) {
                        for (var dy = 0; dy < size; dy++) {
                            var x = i + dx;
                            var y = j + dy;

                            var p = x * canvasb.width + y;
                            pixelData[p * 4 + 0] = resr;
                            pixelData[p * 4 + 1] = resg;
                            pixelData[p * 4 + 2] = resb;
                        }
                    }
                }
            }
            ctxb.putImageData(imageData, 0, 0, 0, 0, canvasb.width, canvasb.height);
        },

        isCanvasBlank : function (canvas) {
            var blank = document.createElement('canvas');
            blank.width = canvas.width;
            blank.height = canvas.height;

            return canvas.toDataURL() == blank.toDataURL();
        },

        copyImageData : function (imagedata) {
            return new ImageData(new Uint8ClampedArray(imagedata.data),imagedata.width,imagedata.height);
        },

        bindUndo : function () {
            var self = this;
            $('#undo').on('click', function() {
                var canvasb = document.getElementById("canvasb");
                var ctxb = canvasb.getContext("2d");
                var imageData = self.imageDataStack.pop();
                if (imageData) {
                    ctxb.putImageData(imageData, 0, 0, 0, 0, canvasb.width, canvasb.height);
                }
                cropItem = self.cropItemStack.pop();
                if (cropItem) {
                    cropItem.remove();
                }
            });
        },

        bindMosaic : function () {
            var self = this;
            $('#mosaic').on('click', function(){
                $("#save").show();
                self.mosaicEffect(self.selection);
                $('.jrac_crop ').css({'z-index':2});
                var cropItem = $('.jrac_crop.ui-resizable').clone().removeClass('ui-resizable');
                self.cropItemStack.push(cropItem);
                cropItem.css({
                    'position':'absolute',
                    'border': '1px solid #333',
                    'background': '#fff',
                    'opacity': '0.5',
                    'z-index': 1
                }).appendTo($('.jrac_viewport '))
            });
        },

        bindSave : function () {
            var self = this;
            $('#save').on('click', function (e) {
                if(self.imageDataStack.length == 0) {
                    alert("请先进行图片模糊化");
                    return false;
                }
                var that = this;
                $(this).attr('disabled',true);
                var canvasb = self.$canvas[0];
                canvasb.toBlob(function(blob){
                    var formData = new FormData();
                    formData.append('imgurl', blob);
                    $.ajax({
                        "type": "post",
                        "url": "/picture/uploadimagepost?ismosaic=true&pictureid="+self.$image.data('picture-id')+"&rotate="+$('#image').data('rotate'),
                        dataType: "json",
                        processData: false,
                        contentType: false,
                        data: formData,
                        dataType: 'json', //服务器返回的格式，可以是json
                        beforeSend : function () {
                            $('#progress-bar').parent('.progress').show();
                            $('#progress-bar').css('width', '40%');
                        },
                        "success": function (res) {
                            console.log(res);
                            $(that).removeAttr('disabled');
                            $('#progress-bar').css('width', '100%');
                            setTimeout(function () {
                                $('#progress-bar').parent('.progress').hide();
                            }, 600);

                            if (res.msg == undefined) {
                                 alert('上传成功');
                            }else {
                               alert(res.msg);
                            }

                        },
                        "error": function () {
                            alert('保存失败');
                        }
                    });
                })
            });
        },

        bindResizeImage : function () {
            var self = this;
            $("#btn-reset-image").on('click', function() {
                $('.pane').find('.coords input:text').eq(4).val(self.originWidth);
                $('.pane').find('.coords input:text').eq(5).val(self.originHeight).trigger('change');
            });
        },

        bindSetMosaicSize : function () {
            var self = this;
            $('#set-mosaic-size').on('click', function() {
                var v = $('#inp-mosaic-size').val();
                if (v < 1 || v > 100) {
                    alert("必须在1-100范围内");
                }
                self.mosaicSize = v - '';
            });
        },

        bindGoOcr : function () {
            var self = this;
            $('#goocr').on('click', function () {
                var patientPicid = self.$image.data('patient-pic-id');

                $.ajax ({
                    type    :   'get',
                    url     :   '/ocrtextmgr/ocrpicturemodelhtml?patientpicid='+patientPicid,
                    dateType:   'html',
                    success :   function (response) {
                        $('#picture-ocr .ocr-modal-content').html(response);

                        setTimeout(function () {
                            $.mosaic.init($('#image'), $('#canvasb'));
                            $(".img-big").viewer({
                                inline: true,
                                url: 'data-url',
                                navbar: false,
                                scalable: false,
                                fullscreen: false,
                                minZoomRatio: 0.5,
                                tooltip: false,
                                zoomRatio: false,
                                shown: function (e) {
                                },
                            });
                        },0);
                    }
                });
            });
        },

        bindCertainGoocr : function () {
            var self = this;
            $('#certainGoocr').on('click', function () {
                var patientPicid = self.$image.data('patient-pic-id');

                $.ajax ({
                    type    :   'get',
                    url     :   '/ocrtextmgr/ocrpicturemodelhtml?patientpicid='+patientPicid+'&isCertain=1',
                    dateType:   'html',
                    success :   function (response) {
                        $('#picture-ocr .ocr-modal-content').html(response);

                        setTimeout(function () {
                            $.mosaic.init($('#image'), $('#canvasb'));
                            $(".img-big").viewer({
                                inline: true,
                                url: 'data-url',
                                navbar: false,
                                scalable: false,
                                fullscreen: false,
                                minZoomRatio: 0.5,
                                tooltip: false,
                                zoomRatio: false,
                                shown: function (e) {
                                },
                            });
                        },0);
                    }
                });
            });
        },

        bindRotateBtn : function () {
            var self = this;
            $('#rotateL').on('click', function () {
                self.changeRotate('left', 90);
            });

            $('#rotateR').on('click', function () {
                self.changeRotate('right', 90);
            });
        },

        changeRotate : function (direction, rotate) {
            var self = this;
            var canvasb = this.$canvas[0];
            var ctxb = canvasb.getContext("2d");
            ctxb.clearRect(0,0,canvasb.width,canvasb.height);

            var url = $('#image').attr('src');
            var width = $('#image').width();
            var height = $('#image').height();
            var rotate_origin = $('#image').attr('data-rotate');

            $('#image').width(height);
            $('#image').height(width);
            self.originWidth = height;
            self.originHeight = width;
            self.$canvas[0].width = height;
            self.$canvas[0].height = width;
            $('#canvasb').width(height);
            $('#canvasb').height(width);

            $("#btn-reset-image").trigger('click');

            var rotate_result = 0;
            if (direction == 'left') {
                rotate_result = parseInt(rotate_origin) + rotate;
            }

            if (direction == 'right') {
                rotate_result = parseInt(rotate_origin) - rotate;
            }

            if(rotate_result >= 360) {
                rotate_result -= 360;
            }
            if (rotate_result < 0) {
                rotate_result += 360;
            }

            var urlResult = '';
            $('#image').attr('data-rotate', rotate_result);
            if(url.indexOf('rotate') == -1){
                urlResult = url+'?rotate='+rotate_result;
            }else {
                urlResult = url.replace('rotate='+rotate_origin, 'rotate='+rotate_result);
            }
            $('#image').attr('src', urlResult);
        }
    };
});