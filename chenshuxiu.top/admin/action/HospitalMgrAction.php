<?php

// HospitalMgrAction
class HospitalMgrAction extends AdminBaseAction
{

    public function doSelectList() {
        $cond = " AND status = 1 ";
        $doctors = HospitalDao::getListByCond($cond);
        $arr = [];
        foreach ($doctors as $doctor) {
            $arr[] = $doctor->toSelectListJsonArray();
        }

        $this->result['data'] = [
            'hospitals' => $arr
        ];

        return self::TEXTJSON;
    }

    public function doList() {
        $pagesize = XRequest::getValue('pagesize', 20);
        $pagenum = XRequest::getValue('pagenum', 1);
        $name = XRequest::getValue('name');

        $cond = "";
        $bind = [];

        if ($name) {
            $cond .= " AND name LIKE :name ";
            $bind[':name'] = "%{$name}%";
        }

        $hospitals = HospitalDao::getListByCond4Page($pagesize, $pagenum, $cond, $bind);
        $arr = [];
        foreach ($hospitals as $hospital) {
            $arr[] = $hospital->toListJsonArray();
        }

        $total_cnt = HospitalDao::getCntByCond($cond, $bind);

        $this->result['data'] = [
            'hospitals' => $arr,
            'total_cnt' => $total_cnt,
        ];

        return self::TEXTJSON;
    }

    public function doAddPost() {
        $name = XRequest::getValue('name');
        $shortname = XRequest::getValue('shortname');
        $levelstr = XRequest::getValue('levelstr');
        $xprovinceid = XRequest::getValue('xprovinceid', 0);
        $xcityid = XRequest::getValue('xcityid', 0);
        $xcountyid = XRequest::getValue('xcountyid', 0);
        $content = XRequest::getValue('content');

        if (!$name) {
            $this->returnError('请输入医院名称');
        } elseif (!$shortname) {
            $this->returnError('请输入医院简称');
        } elseif (!$levelstr) {
            $this->returnError('请输入医院等级');
        } elseif (!$xprovinceid) {
            $this->returnError('请选择省份');
        } elseif (!$xcityid) {
            $this->returnError('请选择城市');
        } elseif (!$xcountyid) {
            $this->returnError('请选择地区');
        } elseif (!$content) {
            $this->returnError('请输入详细地址');
        }

        $row = [];
        $row["name"] = $name;
        $row["shortname"] = $shortname;
        $row["levelstr"] = $levelstr;
        $row["xprovinceid"] = $xprovinceid;
        $row["xcityid"] = $xcityid;
        $row["xcountyid"] = $xcountyid;
        $row["content"] = $content;
        $hospital = Hospital::createByBiz($row);

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
