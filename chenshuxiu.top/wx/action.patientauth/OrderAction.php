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

    public function doOne() {
        $orderid = XRequest::getValue('orderid', 0);
        $order = Order::getById($orderid);
        if (false == $order instanceof Order) {
            XContext::setJumpPath("/error/error?e=预约不存在");
            return self::BLANK;
        }

        if ($order->patientid != $this->mypatient->id) {
            XContext::setJumpPath("/error/error?e=无权查看");
            return self::BLANK;
        }

        XContext::setValue('order', $order);
        XContext::setValue('schedule', $order->schedule);
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

        $order_d = OrderDao::getLastOfPatient_Open($mypatient->id, $doctor->id, 'Doctor');
        $order_p = OrderDao::getLastOfPatient_Open($mypatient->id, $doctor->id, 'Patient');
        if ($order_p instanceof Order) {
            XContext::setJumpPath("/order/one?orderid={$order_p->id}");
            return self::BLANK;
        } elseif ($order_d instanceof Order) {
            XContext::setJumpPath("/order/one?orderid={$order_d->id}");
            return self::BLANK;
        }

        $mypatient = $this->mypatient;
        $doctor = $mypatient->doctor;

        $count = OrderDao::getCountOfPatientid($mypatient->id, $doctor->id, 'Patient');
        if ($count >= $mypatient->max_order_cnt) {
            XContext::setJumpPath('/error/error?e=已达最大预约次数');
            return self::BLANK;
        }

        if ($schedule->getIdleCnt() < 1) {
            XContext::setJumpPath('/error/error?e=当前预约日期已约满');
            return self::BLANK;
        }

        $operationcategorys = OperationCategoryDao::getParentListByDoctorid($doctor->id);

        XContext::setValue('operationcategorys', $operationcategorys);
        XContext::setValue('schedule', $schedule);
        XContext::setValue('mypatient', $mypatient);
        return self::SUCCESS;
    }

    public function doAddPostJson() {
        $mypatient = $this->mypatient;

        $doctor = $mypatient->doctor;

        $scheduleid = XRequest::getValue("scheduleid", 0);
        $voucher_pictureid = XRequest::getValue("voucher_pictureid", 0);
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
            $this->returnError('存在有效的预约', 3001, ['orderid' => $order_p->id]);
        }

        // 如果医生给患者预约了，则也会直接进入list页
        if ($order_d instanceof Order) {
            if ($order_d->scheduleid == $scheduleid) {
                $this->returnError('存在有效的预约', 3001, ['orderid' => $order_d->id]);
            }
        }

        if ($schedule->thedate < date('Y-m-d')) { // 预约日期小于今天
            $this->returnError('已失效');
        }

        $count = OrderDao::getCountOfPatientid($mypatient->id, $doctor->id, 'Patient');
        if ($count >= $mypatient->max_order_cnt) {
            $this->returnError('已达最大预约次数');
        }

        $voucher_picture = Picture::getById($voucher_pictureid);
        if (false == $voucher_picture instanceof Picture) {
            $this->returnError('请上传门诊面诊凭证');
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

        $operationcategory_str = '';
        if ($operationcategory) {
            foreach ($operationcategory as $key => $arr) {
                $operationcategory_str .= "{$key}：";
                $operationcategory_str .= implode($arr, '、');
                $operationcategory_str .= ";\n";
            }
        }

        // 创建复诊预约
        $row = array();
        $row["patientid"] = $mypatient->id;
        $row["doctorid"] = $doctor->id;
        $row["scheduleid"] = $scheduleid;
        $row["voucher_pictureid"] = $voucher_pictureid;
        $row["operationcategory"] = $operationcategory_str;
        $row["thedate"] = $schedule->thedate;
        $row["createby"] = 'Patient';
        $row["status"] = 1;
        $row["isclosed"] = 0;
        $row["auditstatus"] = 0;
        $row["remark"] = $remark;
        $order = Order::createByBiz($row);
        $pipe = Pipe::createByEntity($order, 'create');

        $this->result['errmsg'] = '预约成功';
        return self::TEXTJSON;
    }

    public function doCreatePic() {
        $media_id = XRequest::getValue("media_id");
        DBC::requireNotNull($media_id, 'media_id不存在');

        $picture = Picture::createByFetchWXOfMediaid($media_id);
        DBC::requireNotEmpty($picture, "图片上传失败");

        Debug::trace("=====Picture {$picture->id}=====");

        $data = [
            'errno' => 0,
            'errmsg' => '',
            'data' => [
                'objpictureid' => $picture->id,
                'thumb_url' => $picture->getSrc(100, 100, true),
                'url' => $picture->getSrc()]];

        Debug::trace($data);

        XContext::setValue("json", $data);
        return self::TEXTJSON;
    }

    public function doDeletePic() {
        $objpictureid = XRequest::getValue("objpictureid", 0);

        $objpicture = Picture::getById($objpictureid);

        $objpicture->remove();

        $data = [
            'errno' => 0,
            'errmsg' => '',
            'data' => []];

        XContext::setValue("json", $data);
        return self::TEXTJSON;
    }

    public function doShowPic() {
        $objpictureid = XRequest::getValue("objpictureid", 0);

        $objpicture = Picture::getById($objpictureid);

        DBC::requireTrue($objpicture instanceof Entity, '图片不存在');

        $data = [
            'errno' => 0,
            'errmsg' => '',
            'data' => [
                'url' => $objpicture->picture->getSrc()]];

        XContext::setValue("json", $data);
        return self::TEXTJSON;
    }

    public function doCancelPostJson() {
        $orderid = XRequest::getValue('orderid', 0);
        $order = Order::getById($orderid);
        if (false == $order instanceof Order) {
            $this->returnError('预约不存在');
        }

        $order->isclosed = 1;
        $order->closeby = 'Patient';
        $order->status = 0;

        return self::TEXTJSON;
    }

    public function doConfirmPostJson() {
        $orderid = XRequest::getValue('orderid', 0);
        $status = XRequest::getValue('status', 0);

        $order = Order::getById($orderid);
        if (false == $order instanceof Order) {
            $this->returnError('预约不存在');
        }

        if ($status) {
            $order->patient_confirm_status = 1;
        } else {
            $order->patient_confirm_status = 2;
            $order->isclosed = 1;

            $order->status = 0;
            $order->closeby = 'Patient';
        }

        return self::TEXTJSON;
    }
}