<?php

// DoctorMgrAction
class DoctorMgrAction extends AdminBaseAction
{
    public function doSelectList() {
        $cond = " AND status = 1 ";
        $doctors = DoctorDao::getListByCond($cond);
        $arr = [];
        foreach ($doctors as $doctor) {
            $arr[] = $doctor->toSelectListJsonArray();
        }

        $this->result['data'] = [
            'doctors' => $arr
        ];

        return self::TEXTJSON;
    }

    public function doList() {
        $pagesize = XRequest::getValue('pagesize', 20);
        $pagenum = XRequest::getValue('pagenum', 1);
        $status = XRequest::getValue('status');
        $mobile = XRequest::getValue('mobile');
        $name = XRequest::getValue('name');
        $hospitalid = XRequest::getValue('hospitalid');

        $cond = "";
        $bind = [];
        if ($status > -1) {
            $cond = " AND status = :status ";
            $bind[':status'] = $status;
        }

        if ($mobile) {
            $cond .= " AND mobile = :mobile ";
            $bind[':mobile'] = "{$mobile}";
        }

        if ($name) {
            $cond .= " AND name LIKE :name ";
            $bind[':name'] = "%{$name}%";
        }

        if ($name) {
            $cond .= " AND hospitalid = :hospitalid ";
            $bind[':hospitalid'] = $hospitalid;
        }


        $doctors = DoctorDao::getListByCond4Page($pagesize, $pagenum, $cond, $bind);
        $arr = [];
        foreach ($doctors as $doctor) {
            $arr[] = $doctor->toListJsonArray();
        }

        $total_cnt = DoctorDao::getCntByCond($cond, $bind);

        $this->result['data'] = [
            'doctors' => $arr,
            'total_cnt' => $total_cnt,
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
