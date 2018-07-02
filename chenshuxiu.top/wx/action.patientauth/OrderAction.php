<?php
/**
 * Created by PhpStorm.
 * User: hades
 * Date: 2018/6/28
 * Time: 21:48
 */

class OrderAction extends PatientAuthBaseAction
{
    public function doList() {
        $mypatient = $this->mypatient;

        $orders = OrderDao::getListByPaitentid($mypatient->id);
        XContext::setValue('orders', $orders);
        return self::SUCCESS;
    }

    public function doAdd() {
        $scheduleid = XRequest::getValue('scheduleid', 0);

        $schedule = Schedule::getById($scheduleid);
        if (false == $schedule instanceof Schedule) {
            $this->returnError('门诊信息不存在');
        }

        $mypatient = $this->mypatient;
        $doctor = $mypatient->doctor;

        $count = OrderDao::getCountOfPatientid($mypatient->id, $doctor->id, 'Patient');
        if ($count >= $mypatient->max_order_cnt) {
            XContext::setJumpPath('/error/error?e=已达最大预约次数');
        }

        $operationcategorys = OperationCategoryDao::getParentListByDoctorid($doctor->id);

        XContext::setValue('operationcategorys', $operationcategorys);
        XContext::setValue('schedule', $schedule);
        XContext::setValue('mypatient', $mypatient);
        return self::SUCCESS;
    }

    public function doAddPostJson() {
        $wxuser = $this->wxuser;
        $mypatient = $this->mypatient;

        $doctor = $mypatient->doctor;

        $scheduleid = XRequest::getValue("scheduleid", 0);
        $category_parents = XRequest::getValue("category_parents", []);
        $category_childrens = XRequest::getValue("category_childrens", []);
        $remark = XRequest::getValue('remark', '');

        $schedule = Schedule::getById($scheduleid);
        $order_d = OrderDao::getLastOfPatient_Open($mypatient->id, $doctor->id, 'Doctor');
        $order_p = OrderDao::getLastOfPatient_Open($mypatient->id, $doctor->id, 'Patient');

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

        $count = OrderDao::getCountOfPatientid($mypatient->id, $doctor->id, 'Patient');
        if ($count >= $mypatient->max_order_cnt) {
            $this->returnError('已达最大预约次数');
        }

        $operationcategory = [];
        foreach ($category_parents as $category_parent) {
            Debug::trace($category_parent);
            $arr = [];
            $childrens = $category_childrens[$category_parent];
            Debug::trace($childrens);
            if (!empty($childrens)) {
                foreach ($childrens as $children) {
                    $arr[] = $children;
                }
            }

            $operationcategory[$category_parent] = $arr;
        }

        // 创建复诊预约
        $row = array();
        $row["wxuserid"] = $wxuser->id;
        $row["patientid"] = $mypatient->id;
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
        $pipe = Pipe::createByEntity($order, 'create', $this->wxuserid);

        $this->result['errmsg'] = '预约成功';
        return self::TEXTJSON;
    }
}