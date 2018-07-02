<?php

// XCountyMgrAction
class XCountyMgrAction extends AdminBaseAction
{
    public function doList() {
        $xcityid = XRequest::getValue('xcityid');
        if (!$xcityid) {
            $this->returnError('请先选择城市');
        }
        $xcountys = XCountyDao::getListByXcityid($xcityid);

        $arr = [];
        foreach ($xcountys as $xcounty) {
            $arr[] = $xcounty->toJsonArray();
        }

        $this->result['data'] = [
            'xcountys' => $arr
        ];
        return self::TEXTJSON;
    }

    public function doOne() {
        return self::SUCCESS;
    }

    public function doModify() {
        return self::SUCCESS;
    }

    public function doModifyPost() {
        return self::SUCCESS;
    }
}
