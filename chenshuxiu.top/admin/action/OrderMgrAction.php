<?php

/**
 * Created by PhpStorm.
 * User: hades
 * Date: 2018/6/29
 * Time: 23:13
 */

class OrderMgrAction extends AdminBaseAction
{

    public function doListByScheduleTpl() {
        $scheduletplid = XRequest::getValue('scheduletplid');

        $cond = "";
        $bind = [];

        $sql = "SELECT a.* 
                FROM orders a
                LEFT JOIN patients b ON b.id = a.patientid
                WHERE 1 = 1 ";

        if ($scheduletplid) {
            $cond .= " AND a.scheduletplid = :scheduletplid ";
            $bind[':scheduletplid'] = $scheduletplid;
        }

        $sql .= $cond;
        $orders = OrderDao::getListBySql($sql, $bind);
        $arr = [];
        foreach ($orders as $order) {
            $arr[] = $order->toListJsonArray();
        }

        $this->result['data'] = [
            'orders' => $arr,
        ];

        return self::TEXTJSON;
    }

    public function doList() {
        $pagesize = XRequest::getValue('pagesize', 20);
        $pagenum = XRequest::getValue('pagenum', 1);
        $status = XRequest::getValue('status', 0);
        $name = XRequest::getValue('name');
        $mobile = XRequest::getValue('mobile');
        $birthday = XRequest::getValue('birthday');
        $dates = XRequest::getValue('dates', []);
        if (!empty($dates)) {
            $start_date = $dates[0];
            $end_date = $dates[1];
        }

        $cond = "";
        $bind = [];

        $sql = "SELECT a.* 
                FROM orders a
                LEFT JOIN patients b ON b.id = a.patientid
                WHERE 1 = 1 ";

        switch ($status) {
            case 0:
                break;
            case 1: // 待审核
                $cond .= " AND a.auditstatus = 0 ";
                break;
            case 2: // 审核通过
                $cond .= " AND a.auditstatus = 1 ";
                break;
            case 3: // 审核拒绝
                $cond .= " AND a.auditstatus = 2 ";
                break;
            case 4: // 下线
                $cond .= " AND a.auditstatus = 3 ";
                break;
            default:
                break;
        }

        if ($name) {
            $cond .= " AND b.name LIKE :name ";
            $bind[':name'] = "%{$name}%";
        }

        if ($mobile) {
            $cond .= " AND b.mobile = :mobile ";
            $bind[':mobile'] = "{$mobile}";
        }

        if ($birthday) {
            $cond .= " AND b.birthday = :birthday ";
            $bind[':birthday'] = "{$birthday}";
        }

        if ($start_date && $end_date) {
            $cond .= " AND a.thedate BETWEEN :start_date AND :end_date ";
            $bind[':start_date'] = $start_date;
            $bind[':end_date'] = $end_date;
        }

        $sql .= $cond;
        $sql .= " ORDER BY id DESC ";

        $orders = OrderDao::getListBySql4Page($sql, $pagesize, $pagenum, $bind);
        $arr = [];
        foreach ($orders as $order) {
            $arr[] = $order->toListJsonArray();
        }

        $count_sql = "SELECT COUNT(a.id)
                FROM orders a
                LEFT JOIN patients b ON b.id = a.patientid
                WHERE 1 = 1 ";
        $count_sql .= $cond;
        $total_cnt = Dao::queryValue($count_sql, $bind) ?? 0;

        $this->result['data'] = [
            'orders' => $arr,
            'total_cnt' => $total_cnt,
        ];

        return self::TEXTJSON;
    }

    public function doAuditPost() {
        $status = XRequest::getValue('status', 0);
        $remark = XRequest::getValue('remark', '');
        $orderid = XRequest::getValue('orderid', 0);

        $order = Order::getById($orderid);
        if (false == $order instanceof Order) {
            $this->returnError('预约不存在');
        }

        if ($status == 1 && $order->auditstatus != 1) {
            $order->pass($remark);
        } elseif ($status == 2) {
            $order->refuse($remark);
        }
        $order->auditorid = $this->myauditor->id;

        return self::TEXTJSON;
    }

    public function doChangeStatusPost() {
        $orderid = XRequest::getValue('orderid', 0);
        $status = XRequest::getValue('status', 0);

        $order = Order::getById($orderid);
        if (false == $order instanceof Order) {
            $this->returnError('预约不存在');
        }

        if ($status == 1) {
            $order->auditOnline();
        } else {
            $order->auditOffline();
        }

        $order->status = $status;

        return self::TEXTJSON;
    }

    public function doAdd() {
        $patientid = XRequest::getValue('patientid', 0);

        $patient = Patient::getById($patientid);
        if (false == $patient instanceof Patient) {
            $this->returnError('患者不存在');
        }

        $operationcategorys = OperationCategoryDao::getParentListByDoctorid($patient->id);
        $arr = [];
        foreach ($operationcategorys as $operationcategory) {
            $arr[] = $operationcategory->toListJsonArray();
        }

        $this->result['data'] = [
            'operationcategorys' => $arr,
            'patient' => $patient,
        ];
        return self::TEXTJSON;
    }

    public function doAddPost() {
        $patientid = XRequest::getValue('patientid', 0);

        $patient = Patient::getById($patientid);
        if (false == $patient instanceof Patient) {
            $this->returnError('患者不存在');
        }

        $doctor = $patient->doctor;

        $scheduleid = XRequest::getValue("scheduleid", 0);
        $category_parents = XRequest::getValue("category_parents", []);
        $category_childrens = XRequest::getValue("category_childrens", []);
        $remark = XRequest::getValue('remark', '');

        $schedule = Schedule::getById($scheduleid);
        $order_d = OrderDao::getLastOfPatient_Open($patient->id, $doctor->id, 'Doctor');
        $order_p = OrderDao::getLastOfPatient_Open($patient->id, $doctor->id, 'Patient');

        // 检验 剩余门诊数
        $cnt = $schedule->getIdleCnt();
        if ($cnt <= 0) {
            $this->returnError('已预约满');
        }

        // 如果患者最后一次打开的有效复诊预约存在，则不作任何动作（实际不存在这种情况，如果患者有未来的有效预约，则患者会直接进入list页，不会有机会再次预约）
        if ($order_p instanceof Order) {
            $this->returnError('存在有效的预约', 3001);
        }

        // 如果医生给患者预约了，则也会直接进入list页
        if ($order_d instanceof Order) {
            if ($order_d->scheduleid == $scheduleid) {
                $this->returnError('存在有效的预约', 3001);
            }
        }

        if ($schedule->thedate < date('Y-m-d')) { // 预约日期小于今天
            $this->returnError('已失效');
        }

        $count = OrderDao::getCountOfPatientid($patient->id, $doctor->id, 'Patient');
        if ($count >= $patient->max_order_cnt) {
            $this->returnError('已达最大预约次数');
        }

        $operationcategory = [];
        foreach ($category_parents as $category_parent) {
            $arr = [];
            $childrens = $category_childrens[$category_parent];
            if (!empty($childrens)) {
                foreach ($childrens as $children) {
                    $arr[] = $children;
                }
            }

            $operationcategory[$category_parent] = $arr;
        }

        $wxuser = WxUserDao::getByPaitentid($patient->id);

        // 创建复诊预约
        $row = array();
        $row["wxuserid"] = $wxuser->id;
        $row["patientid"] = $patient->id;
        $row["doctorid"] = $doctor->id;
        $row["scheduleid"] = $scheduleid;
        $row["operationcategory"] = json_encode($operationcategory, JSON_UNESCAPED_UNICODE);
        $row["thedate"] = $schedule->thedate;
        $row["createby"] = 'Patient';
        $row["status"] = 1;
        $row["isclosed"] = 0;
        $row["auditstatus"] = 0;
        $row["remark"] = $remark;
        $order = Order::createByBiz($row);
        $pipe = Pipe::createByEntity($order, 'create', $wxuser->id);

        $this->result['errmsg'] = '预约成功';
        return self::TEXTJSON;
    }

    public function doModify() {
        $orderid = XRequest::getValue('orderid', 0);

        $order = Order::getById($orderid);
        if (false == $order instanceof Order) {
            $this->returnError('预约不存在');
        }

        $this->result['data'] = [
            'order' => $order->toOneJsonArray()
        ];
        return self::TEXTJSON;
    }

    public function doModifyPost() {
        $orderid = XRequest::getValue('id', 0);
        $thedate = XRequest::getValue('thedate', 0);
        $remark = XRequest::getValue('remark', '');
        $status = XRequest::getValue('status', 1);

        $order = Order::getById($orderid);
        if (false == $order instanceof Order) {
            $this->returnError('预约不存在');
        }

        $order->thedate = $thedate;
        $order->remark = $remark;
        $order->status = $status;

        return self::TEXTJSON;
    }
}