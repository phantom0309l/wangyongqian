<?php

class PatientAction extends PatientAuthBaseAction
{

    // 已经报到过了, 应该显示注册的信息
    public function doRegisted() {
        $mypatient = $this->mypatient;

        XContext::setValue('mypatient', $mypatient);
        return self::SUCCESS;
    }

    public function doOne() {
        return self::SUCCESS;
    }

    // 报到成功展示页
    public function doBaodaoOk() {
        $isnew = XRequest::getValue("isnew", 0);
        XContext::setValue("isnew", $isnew);
        return self::SUCCESS;
    }

}
