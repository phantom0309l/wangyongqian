<?php

/*
 * Patient
 */

class Patient extends Entity
{

    protected function init_keys() {
        $this->_keys = self::getKeysDefine();
    }

    public static function getKeysDefine() {
        return array(
            'doctorid'    //doctorid, pcard
        , 'first_doctorid'    //first_doctorid
        , 'diseaseid'    //pcard
        , 'woy'    //week of year
        , 'name'    //
        , 'prcrid'    //身份证
        , 'sex'    //性别, 值为1时是男性，值为2时是女性，值为0时是未知
        , 'birthday'    //生日
        , 'status'    //状态
        , 'auditstatus'    //审核状态
        , 'auditremark'    //审核备注
        , 'audittime'    //审核通过时间
        , 'is_test'    //是否测试患者，0：默认不是；1：是
        , 'subscribe_cnt'    //关注数
        , 'wxuser_cnt'    //wxuser总数
        , 'lastpipeid'    //最后流id, pcard
        , 'lastpipe_createtime'    //最后一次用户行为时间, pcard
        , 'lastactivitydate'    //上次活跃日期
        , 'isactivity'    //活跃状态
        , 'mobile'    //电话
        , 'other_contacts'    //备用联系人
        , 'email'    //邮箱
        , 'max_order_cnt'    //最大预约次数
        , 'password'    //密码
        );
    }

    protected function init_keys_lock() {
        $this->_keys_lock = array(
            'doctorid', 'first_doctorid', 'diseaseid',);
    }

    protected function init_belongtos() {
        $this->_belongtos = array();

        $this->_belongtos["doctor"] = array("type" => "Doctor", "key" => "doctorid");
        $this->_belongtos["first_doctor"] = array("type" => "Doctor", "key" => "first_doctorid");
        $this->_belongtos["disease"] = array("type" => "Disease", "key" => "diseaseid");
        $this->_belongtos["subscribe_c"] = array("type" => "Subscribe_c", "key" => "subscribe_cnt");
        $this->_belongtos["wxuser"] = array("type" => "WxUser", "key" => "wxuser_cnt");
        $this->_belongtos["lastpipe"] = array("type" => "Pipe", "key" => "lastpipeid");
    }

    // $row = array(); 
    // $row["doctorid"] = $doctorid;
    // $row["first_doctorid"] = $doctorid;
    // $row["name"] = $name;
    // $row["sex"] = $sex;
    // $row["birthday"] = $birthday;
    // $row["mobile"] = $mobile;
    // $row["email"] = $email;
    public static function createByBiz($row) {
        DBC::requireNotEmpty($row, "Patient::createByBiz row cannot empty");

        $default = array();
        $default["doctorid"] = 0;
        $default["first_doctorid"] = 0;
        $default["diseaseid"] = 0;
        $default["woy"] = 0;
        $default["name"] = '';
        $default["prcrid"] = '';
        $default["sex"] = 0;
        $default["birthday"] = '';
        $default["status"] = 0;
        $default["auditstatus"] = 0;
        $default["auditremark"] = '';
        $default["audittime"] = '0000-00-00 00:00:00';
        $default["is_test"] = 0;
        $default["subscribe_cnt"] = 1;
        $default["wxuser_cnt"] = 1;
        $default["lastpipeid"] = 0;
        $default["lastpipe_createtime"] = '0000-00-00 00:00:00';
        $default["lastactivitydate"] = '0000-00-00';
        $default["isactivity"] = 0;
        $default["mobile"] = '';
        $default["other_contacts"] = '';
        $default["email"] = '';
        $default["max_order_cnt"] = 20;
        $default["password"] = '';

        $row += $default;
        return new self($row);
    }

    public static function getPatientStatusDescArray () {
        return array(
            'all' => '全部',
            '00' => '待审核',
            '01' => '下线患者',
            '02' => '审核拒绝',
            '11' => '审核通过',);
    }

    // 患者状态字符串
    public function getStatusStr () {
        return self::getPatientStatusDesc($this);
    }

    public function getPatientStatusStr () {
        return $this->status . "" . $this->auditstatus;
    }

    // 患者状态描述
    public static function getPatientStatusDesc (Patient $patient) {
        $statusStr = $patient->getPatientStatusStr();
        $arr = self::getPatientStatusDescArray();
        $str = $arr[$statusStr];
        if (empty($str)) {
            Debug::warn("PatientStatusService::getPatientStatusDesc[{$patient->id}][{$statusStr}]");
            $str = $statusStr;
        }

        return $str;
    }

    // ====================================
    // ------------ obj method ------------
    // ====================================

    public function toListJsonArray() {
        $arr = [
            'id' => $this->id,
            'createtime' => substr($this->createtime, 0, 10),
            'doctor_name' => $this->doctor->name,
            'name' => $this->name,
            'prcrid' => $this->prcrid,
            'sex' => $this->sex,
            'sex_str' => $this->getSexStr(),
            'birthday' => $this->birthday,
            'status' => $this->status,
            'status_str' => $this->getStatusStr(),
            'auditstatus' => $this->auditstatus,
            'auditremark' => $this->auditremark,
            'mobile' => $this->mobile,
            'email' => $this->email,
        ];
        return $arr;
    }

    public function toOneJsonArray() {
        $arr = [
            'id' => $this->id,
            'createtime' => substr($this->createtime, 0, 10),
            'doctor_name' => $this->doctor->name,
            'name' => $this->name,
            'prcrid' => $this->prcrid,
            'sex' => $this->sex,
            'sex_str' => $this->getSexStr(),
            'birthday' => $this->birthday,
            'status' => $this->status,
            'status_str' => $this->getStatusStr(),
            'auditstatus' => $this->auditstatus,
            'auditremark' => $this->auditremark,
            'mobile' => $this->mobile,
            'email' => $this->email,
            'max_order_cnt' => $this->max_order_cnt,
            'order_cnt' => $this->getOrderCnt(),
        ];
        return $arr;
    }

    public function getOrderCnt() {
        return 0;
    }

    public function getSexStr() {
        return $this->sex == 1 ? '男' : ($this->sex == 2 ? '女' : '未知');
    }
}
