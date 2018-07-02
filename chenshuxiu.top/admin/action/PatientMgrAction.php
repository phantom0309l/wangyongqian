<?php

// PatientMgrAction
class PatientMgrAction extends AdminBaseAction
{
    public function doList() {
        $pagesize = XRequest::getValue('pagesize', 20);
        $pagenum = XRequest::getValue('pagenum', 1);
        $status = XRequest::getValue('status', 0);
        $name = XRequest::getValue('name');
        $mobile = XRequest::getValue('mobile');
        $birthday = XRequest::getValue('birthday');

        $cond = "";
        $bind = [];

        switch ($status) {
            case 0:
                break;
            case 1: // 待审核
                $cond .= " AND status = 0 AND auditstatus = 0 ";
                break;
            case 2: // 审核通过
                $cond .= " AND status = 1 AND auditstatus = 1 ";
                break;
            case 3: // 审核拒绝
                $cond .= " AND status = 0 AND auditstatus = 2 ";
                break;
            case 4: // 下线
                $cond .= " AND status = 0 AND auditstatus = 1 ";
                break;
            default:
                break;
        }

        if ($name) {
            $cond .= " AND name LIKE :name ";
            $bind[':name'] = "%{$name}%";
        }

        if ($mobile) {
            $cond .= " AND mobile = :mobile ";
            $bind[':mobile'] = "{$mobile}";
        }

        if ($birthday) {
            $cond .= " AND birthday = :birthday ";
            $bind[':birthday'] = "{$birthday}";
        }

        $patients = PatientDao::getListByCond4Page($pagesize, $pagenum, $cond, $bind);
        $arr = [];
        foreach ($patients as $patient) {
            $arr[] = $patient->toListJsonArray();
        }

        $total_cnt = PatientDao::getCntByCond($cond, $bind);

        $this->result['data'] = [
            'patients' => $arr,
            'total_cnt' => $total_cnt,
        ];

        return self::TEXTJSON;
    }

    public function doAuditPost() {
        $status = XRequest::getValue('status', 0);
        $remark = XRequest::getValue('remark', '');
        $patientid = XRequest::getValue('patientid', 0);

        $patient = Patient::getById($patientid);
        if (false == $patient instanceof Patient) {
            $this->returnError('患者不存在');
        }

        $patient->auditstatus = $status;
        $patient->auditremark = $remark;

        if ($status == 1) {
            $patient->status = 1;
        }

        return self::TEXTJSON;
    }

    public function doChangeStatusPost() {
        $patientid = XRequest::getValue('patientid', 0);
        $status = XRequest::getValue('status', 0);

        $patient = Patient::getById($patientid);
        if (false == $patient instanceof Patient) {
            $this->returnError('患者不存在');
        }

        $patient->status = $status;

        return self::TEXTJSON;
    }

    public function doOne() {
        $patientid = XRequest::getValue('patientid', 0);

        $patient = Patient::getById($patientid);
        if (false == $patient instanceof Patient) {
            $this->returnError('患者不存在');
        }

        $this->result['data'] = ['patient' => $patient->toOneJsonArray()];
        return self::TEXTJSON;
    }

    public function doModify() {
        return self::SUCCESS;
    }

    public function doModifyPost() {
        $patientid = XRequest::getValue('id', 0);
        $name = XRequest::getValue('name', 0);
        $sex = XRequest::getValue('sex', 0);
        $birthday = XRequest::getValue('birthday', 0);
        $mobile = XRequest::getValue('mobile', 0);
        $email = XRequest::getValue('email', 0);
        $max_order_cnt = XRequest::getValue('max_order_cnt', 0);
        $status = XRequest::getValue('status', 0);

        $patient = Patient::getById($patientid);
        if (false == $patient instanceof Patient) {
            $this->returnError('患者不存在');
        }

        $patient->name = $name;
        $patient->sex = $sex;
        $patient->birthday = $birthday;
        $patient->mobile = $mobile;
        $patient->email = $email;
        $patient->max_order_cnt = $max_order_cnt;
        $patient->status = $status;

        return self::TEXTJSON;
    }
}
