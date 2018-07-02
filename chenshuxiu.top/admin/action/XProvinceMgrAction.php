<?php

// XProvinceMgrAction
class XProvinceMgrAction extends AdminBaseAction
{
    public function doList() {
        $xprovinces = XProvinceDao::getAll();

        $arr = [];
        foreach ($xprovinces as $xprovince) {
            $arr[] = $xprovince->toJsonArray();
        }

        $this->result['data'] = [
            'xprovinces' => $arr
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
