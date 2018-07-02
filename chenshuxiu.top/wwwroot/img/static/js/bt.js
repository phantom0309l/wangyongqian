$(function(){
    var tool = {
        getAjaxData : function(option){
            var defaultOption = {
                type : "get",
                url : "",
                data : "",
                dataType : "json"
            }
            option = $.extend(defaultOption, option||{})
            return $.ajax( option )
        }
    }
    var flowPage = {
        init : function(){
            var self = this
            self.handleTab()
            self.sendMessage()
            self.showFlow()
            self.showMoreFlow()
        },
        showFlow : function(){
            var self = this
            $(document).on("click",".show-flow", function(){
                var me = $(this)
                me.parents("tr").addClass("clicked").siblings().removeClass("clicked")
                var patientid = me.data("patientid")
                var flowData = self.flowData( patientid )
                flowData.done(function(data){
                    //展示relation组
                    //self.showRelation(data.guardians)
                    //展示患者信息
                    self.showPatientDetail(data)
                    //给showmore添加必要数据
                    $(".showMore").show().data("patientid",patientid).data("pagenum",0)
                    var hw = ""
                    var qs = ""
                    $.each(data.homework, function(i,obj){
                        hw = hw + self.createHtml(obj, true)
                    })
                    $.each(data.question, function(i,obj){
                        qs = qs + self.createHtml(obj, false)
                    })
                    $(".homeworkshell").html( hw )
                    $(".questionshell").html( qs )
                    if( data.homework.length < 10 ){
                        $(".homeworkshell").parent().find(".showMore").hide()
                    }
                    if( data.question.length < 10 ){
                        $(".questionshell").parent().find(".showMore").hide()
                    }
                    $(".content-right").show()
                })
            })
        },
        showMoreFlow : function(){
            var self = this
            $(document).on("click", ".showMore", function(){
                var me = $(this)
                var isHw = !!me.parents(".tab-content-item").find(".homeworkshell").length
                var pagenum = me.data("pagenum") + 1
                me.data("pagenum", pagenum)
                var moreFlowData = self.moreFlowData( me.data("patientid"), pagenum, isHw )
                moreFlowData.done(function(data){
                    if( data && data.length == 0 ) {
                        me.hide()
                        return
                    }
                    var html = ""
                    $.each(data, function(i,obj){
                        html = html + self.createHtml(obj, isHw)
                    })
                    $( isHw ? ".homeworkshell" : ".questionshell" ).append( $(html) )
                })
            })
        },
        moreFlowData : function(patient_id, page_num, isHw){
            var url = isHw ? "/manage/bt/more_homeworks" : "manage/bt/more_faqs"
            return $.ajax({
                "type" : "get",
                "data" : { "page_num" : page_num, "page_size" : 10, "pid" : patient_id},
                "url" : url,
                "dataType" : "json"
            })
        },
        createHtml : function(data,isHw){
            var hw = qs = data
            var createReplyHtml = function(){
                return '<div class="replyBox clearfix">\
                        <div class="col-md-10 ops-reply-l none">\
                            <textarea name="reply-msg" class="reply-msg" cols="30" rows="6"></textarea>\
                        </div>\
                        <div class="col-md-2 ops-reply-r"><a href="#" class="btn btn-default reply-btn">回复</a></div>\
                    </div>\
                    <p class="red reply-notice"></p>'
            }
            var createOpsHtml = function(replies){
                var str = ""
                $.each(replies, function(i,obj){
                    str = str + '<div class="mt5"><span class="fb">' + obj.replier_title + '回复：</span>' + obj.content + '</div>'
                })
                return str
            }
            var createhwHtml = function(hw){
               return '<div class="flow-item" data-hwkid="' + hw._id.$oid + '">\
                    <h4>第' + hw.lesson_id + '课 <span class="flow-time">' + hw.bind_date + '</span></h4>\
                    <div class="flow-content">\
                        <span class="btn btn-default showHomework" data-hwkid="' + hw._id.$oid + '">查看详情</span>' + createOpsHtml(hw.replies) + '</div>' + createReplyHtml() + '</div>'
            }
            var createqsHtml = function(hw){
               return '<div class="flow-item" data-questionid="' + qs._id.$oid + '">\
                    <h4>家长提问 <span class="flow-time">' + qs.created_at.split("T")[0] + '</span></h4>\
                    <div class="flow-content">\
                        <div class="mt5"><span class="fb">问题：</span>' + qs.question + '</div>' + createOpsHtml(qs.replies) + '</div>' + createReplyHtml() + '</div>'
            }
            return isHw ? createhwHtml(hw) : createqsHtml(qs)
        },
        flowData : function(patient_id){
            return $.ajax({
                "type" : "get",
                "data" : { "page_size" : 10},
                "url" : "/manage/bt/patient_detail?pid=" + patient_id,
                "dataType" : "json"
            })
        },
        showPatientDetail : function(data){
            $("#p-name").text( data.name )
            $("#p-doctor").text( data.doctor )
        },
        showRelation : function(relations){
           var selectNode = $('.relation-group')
           var str = ''
           $.each(relations, function(k,v){
                var selected = k == 0 ? 'selected' : ''
                str = str + '<option ' + selected + ' value="' + v.open_id + '">' + v.relation + '</option>'
           })
           selectNode.html( str )
        },
        sendMessage : function(){
            $(document).on("click", ".reply-btn", function(e){
                e.preventDefault()
                var me = $(this)
                var isSend = false
                var getReplyBtn = function(){
                    var replyBox = me.parents('.replyBox')
                    replyBox.find('.ops-reply-l').show()
                    return replyBox
                }
                var replyBtn = getReplyBtn()
                var notice = replyBtn.next(".reply-notice")
                var textareaNode = replyBtn.find(".reply-msg")
                var msg = $.trim( textareaNode.val() )
                if(!msg){
                    notice.text("请输入发送信息")
                    return
                }
                var url = ""
                var getData = function(){
                    var data = { content : msg }
                    var flowItem = me.parents(".flow-item")
                    var hwkid = flowItem.data("hwkid")
                    var question_id = flowItem.data("questionid")
                    if( hwkid ){
                        data.hwkid = hwkid
                        url = "/manage/bt/hwkreply"
                    }else if( question_id ){
                        data.question_id = question_id
                        url = "/manage/bt/faqreply"
                    }
                    return data
                }
                if(!isSend ){
                    isSend = true
                    $.ajax({
                        "type" : "post",
                        "data" : getData(),
                        "url" : url,
                        "success" : function(data){
                            if( data == 'fine'){
                                isSend = false
                                textareaNode.val("")
                                notice.text("信息已发送")
                                setTimeout(function(){
                                    notice.text("")
                                },4000)
                            }
                        },
                        "error" : function(){
                            isSend = false
                        }
                    })
                }
            })
        },
        handleTab : function(){
            var menuNodes = $(".tab-menu").find("li")
            var contents = $(".tab-content-item")
            menuNodes.off("click").on("click", function(){
                $(this).addClass("active").siblings().removeClass("active")
                var index = $(this).index()
                contents.eq(index).show().siblings().hide()
            })
        }
    }

    flowPage.init()
    var app = {
        init : function(){
            var self = this
            self.handleGroup()

            $(".cgd-date").on("click", function(){
                if ($(this).data('laydate') != 'init') {
                    $(this).data('laydate', 'init');

                    var value = $(this).val();
                    if (value == '0000-00-00' || value == '0000-00-00 00:00:00') {
                        value = new Date();
                        $(this).val(value.Format('YYYY-MM-DD'));
                    }
                    laydate.render({
                        elem: this,
                        value: value,
                        show: true
                    });
                }
            })
        },
        handleGroup : function(){
           var cgdNode = $(".createGroupDetails")
           $(".createGroup").on("click", function(){
                if( cgdNode.is(":visible") ){
                    cgdNode.hide()
                    return
                }
                $(".patientBox").html("")
                var me = $(this)
                var h = me.outerHeight()
                var offset = $(this).offset()
                cgdNode.css({
                    left : offset.left,
                    top : offset.top + h + 10
                }).show()
           })
        },
        getNeedPatients : function(){
            $(".searchPatient").on("click", function(){
                var textNode = $(".cgd-search")
                var val = $.trim( textNode.val() )
                if( !val.length ){
                    alert("请按规则输入患者姓名")
                    return
                }
                var returnObj = tool.getAjaxObj({
                    url : "/api/get_group_patients",
                    data : { patient_name : val }
                })
                returnObj.done(function(data){
                    // data struct
                    //[{"patient_name":"张三","patient_id":2},{"patient_name":"张三","patient_id":2}]
                    var ids = []
                    var createHtml = function(data){
                        var str = ""
                        if( data && data.length ){
                           $.each(data, function(k, obj){
                                str = str + '<span class="btn btn-default">' + obj.patient_name + '</span>'
                                ids.push(obj.patient_id)
                           })
                        }
                        return str
                    }
                    var patientBox = $(".patientBox")
                    patientBox.html( createHtml(data) )
                    patientBox.data("ids",ids.join("|"))
                })
            })
        },
        createGroup : function(){
            var returnObj = tool.getAjaxObj({
                url : "/api/create_patient_group",
                data : { start_time : "2015-06-15", head : "陈敏", patient_id : "23|34|44|55" }
            })
            returnObj.done(function(data){
              window.location.href = window.location.href
            })
        }
    }

    app.init()
})
$(function(){
    var answersheet = $("#answersheet")
    $(document).on('click', ".showHomework", function(e){
        var me = $(this)
        var hwkid = me.data("hwkid")
        $.getJSON('/bt/homework/check?can_render=true&hwkid=' + hwkid, function(data){
            $("#answersheet-title").text( data['purpose'] )
            $("#details").height( $(window).height() - 150 )
            var halfH = answersheet.height()/2
            var halfW = answersheet.width()/2
            answersheet.css({
                margin : '-' + halfH+ 'px 0px 0px -' + halfW + 'px'
            })
            var answer_html = "<div class='mt5'>"
            $.each(data['questions'], function(i, q){
                var vhtml = ""
                switch(q["type"]){
                    case "TodoClock":
                    var v3 = q["value"][2]
                    if(q["write"]){
                        var status = ["提前","按时","拖延"][v3]
                    }else{
                        var status = ["","拖延"][v3]
                    }
                    vhtml = '<div>' + q["value"][0] + '，用时' + q["value"][1] + '分钟 ' + status + '</div>'
                    break
                    case "H3":
                    vhtml='<div class="mt5">' + q["content"] + '</div>'
                    break
                    case "TodoList":
                        if(q["readonly"]){
                            vhtml = '<div class="mt5">' + q["content"] + '</div>' + '<div>答：' + ['未做到','已做到'][q["value"]] + '</div>'
                        }else{
                            if(q["value"][1] == -1){
                                vhtml = '<div class="mt5">' + q["content"] + '</div><div>' +q["value"][0] + '</div>'
                            }else{
                                vhtml = '<div class="mt5">' + q["content"] + '</div>' + '<div>' + q["value"][0]+ '</div><div>答：' + ['未做到','已做到'][q["value"][1]] + '</div>'
                            }
                        }
                    break
                    case "SectionList":
                        vhtml = '<div class="mt5">' + q["content"] + '</div>' + '<div>答：' + ['未做到','已做到'][q["value"]] + '</div>'
                    break
                    case "Todo_10":
                        if(q["value"][1] == 'has_event'){
                            vhtml = '<div class="mt5">' + q["content"] + '</div>' + '<div>答：' + ['未做到','已做到'][q["value"][0]] + '</div>'
                        }else{
                            if(q["value"][0] == -1){
                                vhtml = ''
                            }else{
                                vhtml = '<div class="mt5">' + q["content"] + '</div>' + '<div>答：' + ['无变化','有减少'][q["value"][0]] + '</div>'
                            }
                        }
                    break
                    default:
                    vhtml = '<div class="mt5">' + q["content"] + '</div>' + '<div>答：' +q["value"]+ '</div>'
                }
                answer_html = answer_html + vhtml

            })
            answer_html += '</div>'

            $("#details").html(answer_html)
            answersheet.show()
        })
    })

    $("#answersheet-close").on('click', function(){
        answersheet.hide()
    })

})
