<?php

// XCityMgrAction
class XCityMgrAction extends AdminBaseAction
{
    public function doList() {
        $xprovinceid = XRequest::getValue('xprovinceid');
        if (!$xprovinceid) {
            $this->returnError('请先选择省份');
        }
        $xcitys = XCityDao::getListByXprovinceid($xprovinceid);

        $arr = [];
        foreach ($xcitys as $xcity) {
            $arr[] = $xcity->toJsonArray();
        }

        $this->result['data'] = [
            'xcitys' => $arr
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
