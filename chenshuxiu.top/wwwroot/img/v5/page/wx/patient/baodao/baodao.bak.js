$(document).ready(function(){
    var app = {
        canClick : true,
        init : function(){
            var self = this;
            self.handleSubmit();
            self.setMobiscroll();
            self.handleIsCheckChange();
            self.handleIsAgree();
            self.handleDisclaimer();

            self.initBaodaoData();
        },
        setMobiscroll : function(){
            var self = this;
            var currYear = (new Date()).getFullYear();
            var opt = {};
            opt.date = {preset: 'date'};
            opt.datetime = {preset: 'datetime'};
            opt.time = {preset: 'time'};
            opt.default = {
                theme: 'ios', //皮肤样式
                display: 'modal', //显示方式
                mode: 'scroller', //日期选择模式
                dateFormat: 'yyyy-mm-dd',
                lang: 'zh',
                startYear: currYear - 116, //开始年份
                endYear: currYear,  //结束年份
                maxDate: self.getNeedDate(-30)
            };
            $(".datectr").mobiscroll($.extend(opt['date'], opt['default']));
            self.setDefaultDateValue( $(".datectr") );
        },
        handleSubmit : function(){
            var self = this;
            $(".submit-btn").on("click",function(){

                if( !self.check() ){
                    return;
                }
                if( !self.canClick ){
                    return;
                }
                self.canClick = false;
                self.removeBaodaoData();
                $("#theform").submit();
            });
        },
        checkFunction : {
            checkIDCard : function( node ){
                var flag = true;
                var reg=/^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
                var val = node.val();
                var errorNode = node.parents(".weui_cell").next();
                if( val && !reg.test(val) ){
                    errorNode.show();
                    flag = false;
                }else{
                    errorNode.hide();
                }
                return flag;
            },
            checkMobile : function( node ){
                var flag = true;
                var reg=/^1[34578]\d{9}$/;
                var val = node.val();
                var errorNode = node.parents(".weui_cell").next();
                if( val && !reg.test(val) ){
                    errorNode.show();
                    flag = false;
                }else{
                    errorNode.hide();
                }
                return flag;
            },
            checkFill : function( node ){
                var flag = true;
                var errorNode = node.parents(".weui_cell").next();
                if(node.val() == '' || node.val() == null){
                    errorNode.show();
                    flag = false;
                }else{
                    errorNode.hide();
                }
                return flag;
            },
        },
        check : function(){
            var self = this;
            var flag = true;
            //必填项验证
            var ischecks = $(".ischeck");
            $.each(ischecks,function(){
                var me = $(this);
                var val = $.trim( me.val() );
                if( val.length==0 || (me.attr('id') == 'diseaseid' && val == 0)){
                    //如果是报到项,则滚动到上部
                    if( me.attr("name") == "name" ){
                        $(window).scrollTop(0);
                    }
                    var errorNode = me.parents(".weui_cell").next();
                    errorNode.show();
                    flag = false;
                    return false;
                }
            });

            if( flag == false ){
                return false;
            }

            //身份证号验证
            var prcrid_input = $(".prcrid_input");
            if( prcrid_input.length ){
                flag = self.checkFunction.checkIDCard( prcrid_input );
            }

            if( flag == false ){
                return false;
            }

            //手机号验证
            var mobile = $("input[name='mobile']");
            if( mobile.length ){
                flag = self.checkFunction.checkMobile( mobile );
            }

            if( flag == false ){
                return false;
            }

            //阅读条款验证
            if($("#isagree").hasClass("isagree-checked") == false){
                $(".disclaimerError").show();
                flag = false;
            }

            if( flag == false ){
                return false;
            }

            return flag;
        },
        handleIsCheckChange : function(){
            var self = this;
            $(document).on("change", ".ischeck", function(){
                var me = $(this);
                self.checkFunction.checkFill( me );
                var name = me.attr("name");
                if( name == "prcrid" ){
                    self.checkFunction.checkIDCard( me );
                }
                if( name == "mobile" ){
                    self.checkFunction.checkMobile( me );
                }
                var val = me.val();
            });
        },
        handleIsAgree : function(){
            $("#isagree").on("click",function(){
                $("#isagree").children().toggleClass("blue-box-selected");
                $("#isagree").toggleClass("isagree-checked");
                var disclaimerError = $(".disclaimerError");
                if( $("#isagree").hasClass("isagree-checked") ){
                    disclaimerError.hide();
                }else{
                    disclaimerError.show();
                }
            })
        },
        handleDisclaimer : function(){
            var self = this;
            $(".disclaimerLink").on("click", function(e){
                e.preventDefault();
                self.setBaodaoData();
                window.location.href = $(this).attr("href");
            })
        },
        initBaodaoData : function(){
            var self = this;
            var data = self.getBaodaoData();
            $.each(data, function(k,v){
                if(v == ""){
                    return true;
                }
                var item = $("input[name='" + k + "']");
                item.val(v);
                if( k=="complicationids" ){
                    var checkboxIds = v.split(",");
                    if( checkboxIds.length ){
                        $(".multiselect").hide();
                        $(".multioptions-box").show();
                    }
                    $.each(checkboxIds,function(i,vv){
                        var a = $("#checkbox_"+vv);
                        if(a.length){
                            a.prop('checked', 'checked');
                        }
                    })
                }
            })
        },
        getBaodaoData : function(){
            var data = {};
            if( window.localStorage ){
                var baodaoData = window.localStorage.getItem("baodaoData");
                if(baodaoData){
                    data = JSON.parse(baodaoData);
                }
            }
            return data;
        },
        setBaodaoData : function(){
            var self = this;
            var obj = self.getFormData();
            if( window.localStorage ){
                var baodaoData = JSON.stringify(obj);
                window.localStorage.setItem("baodaoData", baodaoData);
            }
        },
        removeBaodaoData : function(){
            if( window.localStorage ){
                var baodaoData = window.localStorage.getItem("baodaoData");
                if(baodaoData){
                    window.localStorage.removeItem("baodaoData");
                }
            }
        },
        getFormData : function(){
            var obj = {};
            var items = $("#theform").find("input");
            items.each(function(){
                var me = $(this);
                var name = me.attr("name");
                if(name){
                    obj[name] = me.val();
                }
            })
            return obj;
        },
        setDefaultDateValue : function( datenode ){
            if( datenode.length == 0 ){
                return false;
            }
            var val = datenode.val();
            var valArr = val.split("-");
            if( valArr.length == 3 ){
                datenode.mobiscroll('setVal', new Date(valArr[0],parseInt(valArr[1])-1,valArr[2]) );
                return;
            }
            var self = this;
            var wxshopid = self.getWxShopid();
            if( wxshopid <= 3 ){
                datenode.mobiscroll('setVal', new Date(2008,5,15) );
            }else{
                datenode.mobiscroll('setVal', new Date(1970,5,15) );
            }
        },
        getNeedDate : function(daycnt){
            var d = new Date();
            d.setDate( d.getDate() + daycnt );
            var y = d.getFullYear();
            var m = d.getMonth();
            var tian = d.getDate();
            return new Date(y,m,tian);
        },
        getWxShopid : function(){
            return $("#wxshopid").val();
        }
    };

    app.init();
});
