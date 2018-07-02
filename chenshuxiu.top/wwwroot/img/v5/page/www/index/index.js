$(function(){
    var app = {
        canClick : true,
        init : function(){
            var self = this;
            //about页面tab
            self.handleTab(".aboutBox-menu li", ".aboutBox");
            //join页面tab
            self.handleTab(".join-l-c li", ".join");

            //首页滚动
            var indexOptions = self.getIndexOptions();
            self.slide(indexOptions);

            //医生页面滚动
            var doctorOptions = self.getDoctorOptions();
            self.slide(doctorOptions);

            //患者页面滚动
            var patientOptions = self.getPatientOptions();
            self.slide(patientOptions);

            //医生页面提交申请
            self.handleDoctorApply();

            self.fixForPhoneShow();


        },
        handleTab : function(clickNodeStr, parentNodeStr){
            $(document).on("click", clickNodeStr, function() {
                var me = $(this);
                var index = me.index();
                var contents = me.parents(parentNodeStr).find(".J-tabContentItem");
                me.addClass("active").siblings().removeClass("active");
                contents.eq(index).show().siblings().hide();
            });
        },
        getIndexOptions : function(){
            var options = {
                leftBtn : $(".slideBox-l"),
                rightBtn : $(".slideBox-r"),
                cInnerNode : $(".slideBox-cInner"),
                tipItems : $(".slideBox-text-item"),
                tips : 2,
                rightBeforeScroll : function(){
                    var bigImgNode = $(".slideBox-cInner").find(".slideBox-c-bigImg");
                    bigImgNode.removeClass("slideBox-c-bigImg").next().addClass("slideBox-c-bigImg");
                },
                leftBeforeScroll : function(){
                    var bigImgNode = $(".slideBox-cInner").find(".slideBox-c-bigImg");
                    bigImgNode.removeClass("slideBox-c-bigImg").prev().addClass("slideBox-c-bigImg");
                }
            };
            return options;
        },
        getDoctorOptions : function(){
            var options = {
                leftBtn : $(".doctorListBox-l"),
                rightBtn : $(".doctorListBox-r"),
                cInnerNode : $(".doctorListBox-cInner"),
                tips : 0
            };
            return options;
        },
        getPatientOptions : function(){
            var options = {
                leftBtn : $(".letterBox-l"),
                rightBtn : $(".letterBox-r"),
                cInnerNode : $(".letterBox-cInner"),
                tips : 1,
                rightBeforeScroll : function(){
                    var bigImgNode = $(".letterBox-cInner").find(".letterBox-c-bigItem");
                    bigImgNode.removeClass("letterBox-c-bigItem");
                },
                leftBeforeScroll : function(){
                    var bigImgNode = $(".letterBox-cInner").find(".letterBox-c-bigItem");
                    bigImgNode.removeClass("letterBox-c-bigItem");
                },
                rightOnScroll : function(){
                    $(".letterBox-cInner").find(".letterBox-c-item").eq(2).addClass("letterBox-c-bigItem");
                },
                leftOnScroll : function(){
                    $(".letterBox-cInner").find(".letterBox-c-item").eq(1).addClass("letterBox-c-bigItem");
                }
            };
            return options;
        },
        slide : function(options){
            var slideItems = {
                canClick : true,
                tips : 0,
                timer : null,
                myOptions : {},
                init : function(options){
                    var me = this
                    var myOptions = me.myOptions = me.setOptions(options);
                    me.tips = myOptions["tips"];
                    var left = myOptions["leftBtn"];
                    var right = myOptions["rightBtn"];
                    me.innerInit();
                    left.on( "click", function(){
                        me.doMove("left")
                    } )
                    right.on( "click", function(){
                        me.doMove("right")
                    } )
                },
                setOptions : function( options ){
                    var defaultOptions = {
                        items : null,
                        leftBtn : null,
                        rightBtn : null,
                        tipItems : null,
                        rightBeforeScroll : null,
                        leftBeforeScroll : null,
                        rightOnScroll : null,
                        leftOnScroll : null
                    }
                    return $.extend( defaultOptions, options || {} )
                },

                innerInit : function(){
                    var me = this;
                    var cInnerNode = me.myOptions["cInnerNode"];
                    var nodes = cInnerNode.children();
                    var W = 0;
                    $.each(nodes, function(i,node){
                        W += $(node).outerWidth(true);
                    });
                    cInnerNode.width(W);
                },
                doMove : function( direction ){
                    var me = this

                    if(!me.canClick){
                        return;
                    }
                    me.canClick = false;
                    var cInnerNode = me.myOptions["cInnerNode"];
                    var first = cInnerNode.children().first();
                    var last = cInnerNode.children().last();
                    var baseW = first.outerWidth(true);
                    if( direction === "right" ){
                        var rightBeforeScroll = me.myOptions["rightBeforeScroll"];
                        rightBeforeScroll && rightBeforeScroll();

                        cInnerNode.stop(true, true).animate({"marginLeft" : "-" + baseW + "px"}, function(){
                            var rightOnScroll = me.myOptions["rightOnScroll"];
                            rightOnScroll && rightOnScroll();
                            cInnerNode.append(first);
                            cInnerNode.css("marginLeft", "0px");
                            me.canClick = true;

                        });
                    }else{
                        var leftBeforeScroll = me.myOptions["leftBeforeScroll"];
                        leftBeforeScroll && leftBeforeScroll();

                        last.insertBefore(first);
                        cInnerNode.css("marginLeft", "-" + baseW + "px");
                        cInnerNode.stop(true, true).animate({"marginLeft" : "0px"}, function(){
                            var leftOnScroll = me.myOptions["leftOnScroll"];
                            leftOnScroll && leftOnScroll();

                            me.canClick = true;
                        });
                    }
                    me.showDetails( direction )
                },
                showDetails : function( direction ){
                    var me = this;
                    var tipItems = me.myOptions["tipItems"];
                    if(tipItems == null){
                        return;
                    }
                    var len = tipItems.length;

                    if( direction === "right" ){
                        me.tips++;
                        if( me.tips>=len ){ me.tips=0 }
                    }else{
                        me.tips--;
                        if( me.tips<0 ){ me.tips=len-1 }
                    }
                    tipItems.hide().eq(me.tips).show()
                }
            }
            slideItems.init(options);
        },
        handleDoctorApply : function(){
            var self = this;
            var boxNode = $(".doctorApplyBox");
            $(".doctorBanner-btn").on("click", function(){
                boxNode.show();
            });

            $(".doctorApplyBox-close").on("click", function(){
                boxNode.hide();
            });

            //处理提交
            $(".doctorApply-submitBtn").on("click", function(){
                if(!self.checkFun()){
                    return false;
                }

                if(!self.canClick){
                    return false;
                }
                self.canClick = false;

                var postData = {
                    doctor_name : $("#doctor_name").val(),
                    hospital_name : $("#hospital_name").val(),
                    department_name : $("#department_name").val(),
                    mobile : $("#mobile").val()
                };
                $.ajax({
                    "type": "post",
                    "data": postData,
                    "dataType": "json",
                    "url": "/index/doctorApplyJson",
                    "success": function (data) {
                        self.canClick = true;
                        $(".doctorApplyBoxInner1").hide();
                        $(".doctorApplyBoxInner2").show();
                    }
                });

            });
        },
        checkFun : function(){
            var self = this;
            var doctor_name_val = $.trim( $("#doctor_name").val() );
            var hospital_name_val = $.trim( $("#hospital_name").val() );
            var department_name_val = $.trim( $("#department_name").val() );
            var mobile_val = $.trim( $("#mobile").val() );

            if(doctor_name_val == "" ){
                alert("医生姓名不能为空");
                return false;
            }
            if(hospital_name_val == "" ){
                alert("所属医院不能为空");
                return false;
            }
            if(department_name_val == "" ){
                alert("所属科室不能为空");
                return false;
            }
            if(mobile_val == "" ){
                alert("手机号不能为空");
                return false;
            }

            if(!self.checkMobile(mobile_val)){
                alert("请输入正确的手机号");
                return false;
            }
            return true;

        },
        checkMobile: function (val) {
            var flag = true;
            var reg = /^1\d{10}$/;
            if (val && !reg.test(val)) {
                flag = false;
            }
            return flag;
        },
        fixForPhoneShow: function(){
            if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                $(".doctorService-intro-bg").css({"marginLeft" : "-240px", "width" : "800px", "top" : "75px"});
            }
        }
    };

    app.init();
})
