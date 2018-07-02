<?php

class CommonAction extends WxUserAuthBaseAction
{
    // 构造函数，初始化了很多数据
    public function __construct () {
        parent::__construct();
    }

    //提交结果页
    public function doResult () {
        $noticestr = XRequest::getValue("noticestr", "已提交");
        $closepage = XRequest::getValue("closepage", 1);
        $gourl = XRequest::getValue("gourl", "");

        XContext::setValue("noticestr", $noticestr);
        XContext::setValue("closepage", $closepage);
        XContext::setValue("gourl", $gourl);
        return self::SUCCESS;
    }

    //提交结果页
    public function doTplMsgDetail () {
        $pushmsgid = XRequest::getValue("pushmsgid", 0);
        $template_id = XRequest::getValue("template_id", "");

        DBC::requireNotEmpty($template_id, "template_id为空");

        $pushmsg = PushMsg::getById($pushmsgid);
        $wxtemplate = WxTemplateDao::getByCode($template_id);
        $wxTemplateConfigArrr = WxTemplateService::getWxTemplateConfigArr();
        $configArrr = $wxTemplateConfigArrr[$wxtemplate->ename];
        DBC::requireNotEmpty($configArrr, "服务号:{$wxtemplate->wxshopid}下的{$wxtemplate->ename}模板没有在wxtemplateservice中配置");

        XContext::setValue("pushmsg", $pushmsg);
        XContext::setValue("wxtemplate", $wxtemplate);
        XContext::setValue("configArrr", $configArrr);
        return self::SUCCESS;
    }

    public function doSuccess() {
        $title = XRequest::getValue("title", "操作成功");
        $desc = XRequest::getValue("desc", "");

        XContext::setValue("title", $title);
        XContext::setValue("desc", $desc);
        return self::SUCCESS;
    }
}
