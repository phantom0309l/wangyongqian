<?php

/*
 * Order
 */

class Order extends Entity
{

    const CONFIRM_AFTER_DAY = 7;

    protected function init_keys() {
        $this->_keys = self::getKeysDefine();
    }

    public static function getKeysDefine() {
        return array(
            'wxuserid'    //wxuserid
        , 'patientid'    //patientid
        , 'doctorid'    //doctorid
        , 'scheduleid'    //scheduleid
        , 'voucher_pictureid'    //门诊面诊凭证图片
        , 'operationcategory'    //拟行手术方式
        , 'thedate'    //预约日期
        , 'remark'    //患者备注
        , 'is_send_confirm'    //是否发送确认短信
        , 'patient_confirm_status'    //患者确认状态，0：未确认，1：确认来，2：确认不来
        , 'createby'    //创建人: Doctor,Patient, Auditor, System
        , 'is_mark_his'    //是否加号
        , 'status'    //状态, 无效: 0, 有效: 1
        , 'isclosed'    //是否关闭, 如果是取消,同时将status=0; 提交revisit 时, isclosed=1
        , 'closeby'    //关闭人: Doctor,Patient, Auditor, System
        , 'closeremark'    //关闭原因
        , 'yuyue_platform'    //预约途径(平台)
        , 'auditstatus'    //审核状态, 待审核: 0, 审核通过: 1 , 审核拒绝: 2
        , 'auditorid'    //auditorid
        , 'audittime'    //审核时间
        , 'auditremark'    //审核备注
        );
    }

    protected function init_keys_lock() {
        $this->_keys_lock = array(
            'wxuserid', 'patientid', 'doctorid', 'scheduleid', 'voucher_pictureid',);
    }

    protected function init_belongtos() {
        $this->_belongtos = array();

        $this->_belongtos["wxuser"] = array("type" => "WxUser", "key" => "wxuserid");
        $this->_belongtos["patient"] = array("type" => "Patient", "key" => "patientid");
        $this->_belongtos["doctor"] = array("type" => "Doctor", "key" => "doctorid");
        $this->_belongtos["schedule"] = array("type" => "Schedule", "key" => "scheduleid");
        $this->_belongtos["voucher_picture"] = array("type" => "Picture", "key" => "voucher_pictureid");
        $this->_belongtos["auditor"] = array("type" => "Auditor", "key" => "auditorid");
    }

    // $row = array(); 
    // $row["wxuserid"] = $wxuserid;
    // $row["patientid"] = $patientid;
    // $row["doctorid"] = $doctorid;
    // $row["scheduleid"] = $scheduleid;
    // $row["voucher_pictureid"] = $voucher_pictureid;
    // $row["operationcategory"] = $operationcategory;
    // $row["thedate"] = $thedate;
    // $row["remark"] = $remark;
    // $row["is_send_confirm"] = $is_send_confirm;
    // $row["patient_confirm_status"] = $patient_confirm_status;
    // $row["createby"] = $createby;
    // $row["is_mark_his"] = $is_mark_his;
    // $row["status"] = $status;
    // $row["isclosed"] = $isclosed;
    // $row["closeby"] = $closeby;
    // $row["closeremark"] = $closeremark;
    // $row["yuyue_platform"] = $yuyue_platform;
    // $row["auditstatus"] = $auditstatus;
    // $row["auditorid"] = $auditorid;
    // $row["audittime"] = $audittime;
    // $row["auditremark"] = $auditremark;
    public static function createByBiz($row) {
        DBC::requireNotEmpty($row, "Order::createByBiz row cannot empty");

        $default = array();
        $default["wxuserid"] = 0;
        $default["patientid"] = 0;
        $default["doctorid"] = 0;
        $default["scheduleid"] = 0;
        $default["voucher_pictureid"] = 0;
        $default["operationcategory"] = '';
        $default["thedate"] = '';
        $default["remark"] = '';
        $default["is_send_confirm"] = 0;
        $default["patient_confirm_status"] = 0;
        $default["createby"] = '';
        $default["is_mark_his"] = 0;
        $default["status"] = 0;
        $default["isclosed"] = 0;
        $default["closeby"] = '';
        $default["closeremark"] = '';
        $default["yuyue_platform"] = 'fangcun';
        $default["auditstatus"] = 0;
        $default["auditorid"] = 0;
        $default["audittime"] = '0000-00-00 00:00:00';
        $default["auditremark"] = '';

        $row += $default;
        return new self($row);
    }

    // ====================================
    // ------------ obj method ------------
    // ====================================
    public function toListJsonArray() {
        $arr = [
            'id' => $this->id,
            'createtime' => $this->createtime,
            'thedate' => $this->thedate,
            'patient' => [
                'name' => $this->patient->name,
                'sex_str' => $this->patient->getSexStr(),
                'birthday' => $this->patient->birthday,
                'mobile' => $this->patient->mobile,
                'email' => $this->patient->email,
            ],
            'status' => $this->status,
            'status_desc' => $this->getStatusDesc(),
            'auditstatus' => $this->auditstatus,
            'auditremark' => $this->auditremark,
        ];
        return $arr;
    }

    public function toOneJsonArray() {
        $arr = [
            'id' => $this->id,
            'thedate' => $this->thedate,
            'patient' => [
                'name' => $this->patient->name,
                'sex_str' => $this->patient->getSexStr(),
                'birthday' => $this->patient->birthday,
                'mobile' => $this->patient->mobile,
                'email' => $this->patient->email,
            ],
            'createby_str' => $this->getCreatebyStr(),
            'voucher_picture_src' => $this->voucher_picture ? $this->voucher_picture->getSrc() : '',
            'operationcategory_str' => $this->operationcategory,
            'status' => $this->status,
            'status_desc' => $this->getStatusDesc(),
            'auditstatus' => $this->auditstatus,
            'auditremark' => $this->auditremark,
            'remark' => $this->remark,
        ];
        return $arr;
    }

    // 创建人
    public function getCreatebyStr() {
        $arr = self::getCreatebyArray();
        return $arr[$this->createby];
    }

    // 通过
    public function pass($auditremark) {
        $this->auditstatus = 1;
        $this->auditremark = $auditremark;
        $this->audittime = date('Y-m-d H:i:s');
        $this->status = 1;
        $this->isclosed = 0;

        $content = "您的手术预约医生已审核通过，我们将在术前1周再次短信和您确认是否可如期手术，请留意信息";
        ShortMsg::sendManDaoTemplateSMS_j4now($this->patient->mobile, $content);
    }

    // 拒绝
    public function refuse($auditremark = '') {
        $this->auditstatus = 2;
        $this->auditremark = $auditremark;
        $this->audittime = date('Y-m-d H:i:s');
        $this->status = 0;
        $this->isclosed = 1;

        $content = "您的手术预约医生未审核通过，请您保持电话畅通，我们将电话和您核实情况";
        ShortMsg::sendManDaoTemplateSMS_j4now($this->patient->mobile, $content);
    }

    // 运营上线
    public function auditOnline() {
        $this->auditstatus = 1;
        $this->audittime = date('Y-m-d H:i:s');
        $this->closeby = 'Auditor';
        $this->status = 1;
        $this->isclosed = 0;
    }

    // 运营下线
    public function auditOffline() {
        $this->auditstatus = 3;
        $this->audittime = date('Y-m-d H:i:s');
        $this->closeby = 'Auditor';
        $this->status = 0;
        $this->isclosed = 1;
    }

    // getIsclosedStr
    public function getIsclosedStr() {
        if ($this->isclosed) {
            return '关闭';
        } else {
            return '未关闭';
        }
    }

    public function getStatusDesc() {
        $patient_confirm_status = $this->patient_confirm_status;
        $status = $this->status;
        $isclosed = $this->isclosed;
        $auditstatus = $this->auditstatus;

        if ($auditstatus == 3) {
            return "运营下线";
        }

        if ($auditstatus == 2) {
            return "审核拒绝";
        }

        if ($auditstatus == 0) {
            return "等待审核";
        }

        if ($status == 0 && $isclosed == 1) {
            if ($this->closeby == 'Patient') {
                return "患者取消";
            } elseif ($this->closeby == 'Auditor') {
                return "运营关闭";
            }
            return "取消";
        }

        if ($status == 1 && $isclosed == 1) {
            return "已完成";
        }

        if ($patient_confirm_status == 0) {
            if (!$this->isStepConfirm()) {
                $d = date('Y-m-d', strtotime('-7 day', strtotime($this->thedate)));
                return "审核通过，{$d}进行最后确认";
            }
            return "等待患者确认";
        }

        if ($patient_confirm_status == 1) {
            return "患者确认如约就诊";
        }

        if ($patient_confirm_status == 2) {
            return "患者不能如约就诊";
        }

        if ($this->thedate >= date('Y-m-d')) {
            return "进行中";
        }

        return "过期";
    }

    public function getOperationCategoryStr() {
        $operationcategory = json_decode($this->operationcategory, true);
        $str = '';
        if ($operationcategory) {
            foreach ($operationcategory as $key => $arr) {
                $str .= "{$key}：";
                $str .= implode($arr, '、');
                $str .= ";\n";
            }
        }

        return $str;
    }

    /**
     * 是否到了患者确认步骤
     * 倒计时第7天发送确认
     * @return bool
     */
    public function isStepConfirm() {
        $time1 = strtotime(date('Y-m-d'));
        $time2 = strtotime($this->thedate);
        $diff = ($time2 - $time1) / 86400;
        return $this->status == 1
            && $this->auditstatus == 1
            && $this->isclosed == 0
            && $this->patient_confirm_status == 0
            && $diff <= Order::CONFIRM_AFTER_DAY;
    }

    // ====================================
    // ----------- static method ----------
    // ====================================

    // 创建人
    public static function getCreatebyArray() {
        $arr = [
            'Doctor' => '医生',
            'Patient' => '患者',
            'Auditor' => '运营'
        ];
        return $arr;
    }
}
