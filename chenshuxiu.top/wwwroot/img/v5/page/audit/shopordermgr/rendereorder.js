function renderEorder(shoppkgid, printBoxNode){
    $.ajax({
        "type" : "get",
        "data" : {
            shoppkgid : shoppkgid
        },
        "dataType" : "json",
        "url" : "/shoppkgmgr/createEOrderJson",
        "success" : function(d) {
            var errno = d.errno;
            if(errno == 0){
                otherPrint(shoppkgid, d.express_no, printBoxNode);
            }else{
                alert("打印订单失败，请刷新页面");
            }
        }
    });
}

function firstPrint(d, printBoxNode){
    var ResultCode = d.ResultCode;
    if(ResultCode && ResultCode == "100"){
        var PrintTemplate = d.PrintTemplate;
        var PrintTemplate = PrintTemplate.replace("顺丰标快", "顺丰特惠");
        printBoxNode.html(PrintTemplate);
        printBoxNode.find("table").eq(0).addClass("topLogo");
        var topLogoNode = printBoxNode.find(".topLogo");
        topLogoNode.find("tr").eq(0).attr("height", "52");
        createEorder3(printBoxNode);

        var print_paper_31_node = printBoxNode.find(".print_paper_31");
        var print_paper_32_node = printBoxNode.find(".print_paper_32");

        var linkmanNameNode = print_paper_31_node.find(".linkmanName");
        var OrderCodeNode = print_paper_31_node.find(".OrderCode");
        var LogisticCodeNode = print_paper_31_node.find(".LogisticCode");
        var medicineStrNode = print_paper_32_node.find(".medicineStr");
        OrderCodeNode.text(d.Order.OrderCode);
        LogisticCodeNode.text(d.Order.LogisticCode);
        medicineStrNode.html(d.medicineStr);
        linkmanNameNode.text(d.linkmanName);
    }else{
        var Reason = d.Reason;
        printBoxNode.html(Reason);
    }
}

function otherPrint(shoppkgid, express_no, printBoxNode){
    $.ajax({
        "type" : "get",
        "data" : {
            shoppkgid : shoppkgid
        },
        "dataType" : "html",
        "url" : "/shoppkgmgr/createEOrderHtml",
        "success" : function(htmlstr) {
            printBoxNode.html(htmlstr);
            //渲染条形码
            renderBarcode(express_no);
        }
    });
}

function renderBarcode(express_no){
    var nodes = ["#imgcode_big_"+express_no, "#imgcode_small_"+express_no];
    $.each(nodes, function(i, v){
        JsBarcode(v, express_no, {
            displayValue: false,
            margin: 0
        });
    })
}

//后追电子运单第三联
function createEorder3(node){
    var html = '<table class="print_paper table_first print_paper_31">\
        <tbody><tr height="30">\
            <td class="xx10">\
                <div style="padding-left:5px;">收件人:<span class="linkmanName"></span></div>\
            </td>\
            <td class="xx10 bln">\
                <div style="padding-left:5px;">订单号:<span class="OrderCode">123456789</span></div>\
            </td>\
            <td class="xx10 bln">\
                <div style="padding-left:5px;">快递单:<span class="LogisticCode">123456789</span></div>\
            </td>\
        </tr>\
    </tbody></table>\
    <table class="print_paper print_paper_32">\
        <tbody><tr height="190" style="overflow:hidden;">\
            <td class="xx10">\
                <div style="padding:0px 10px;" class="medicineStr">\
                </div>\
            </td>\
        </tr>\
    </tbody></table>';
    node.append(html);
}
