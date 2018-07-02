<?php

/*
 * Doctor
 */

class Doctor extends Entity
{
    const WYQ = 10000;

    protected function init_keys() {
        $this->_keys = self::getKeysDefine();
    }

    public static function getKeysDefine() {
        return array(
            'hospitalid'    //hospitalid
        , 'name'    //姓名
        , 'sex'    //性别, 值为1时是男性，值为2时是女性，值为0时是未知
        , 'title'    //职称
        , 'department'    //部门科室
        , 'headimg_pictureid'    //头像图片id
        , 'code'    //编码
        , 'brief'    //
        , 'be_good_at'    //擅长
        , 'tip'    //
        , 'bulletin'    //公告
        , 'is_bulletin_show'    //门诊公告是否展示
        , 'is_treatment_notice'    //是否开启就诊须知。0：没有；1：有
        , 'auditorid_createby'    //创建人
        , 'status'    //状态
        , 'auditstatus'    //审核状态
        , 'auditremark'    //审核备注
        , 'service_remark'    //服务备注
        , 'mobile'    //医生手机号
        , 'email'    //email
        , 'remark'    //备注
        );
    }

    protected function init_keys_lock() {
        $this->_keys_lock = array(
            'hospitalid', 'headimg_pictureid', 'auditorid_createby',);
    }

    protected function init_belongtos() {
        $this->_belongtos = array();

        $this->_belongtos["hospital"] = array("type" => "Hospital", "key" => "hospitalid");
        $this->_belongtos["headimg_picture"] = array("type" => "Picture", "key" => "headimg_pictureid");
        $this->_belongtos["auditorid_create"] = array("type" => "Auditor", "key" => "auditorid_createby");
    }

    // $row = array(); 
    // $row["hospitalid"] = $hospitalid;
    // $row["name"] = $name;
    // $row["sex"] = $sex;
    // $row["title"] = $title;
    // $row["department"] = $department;
    // $row["headimg_pictureid"] = $headimg_pictureid;
    // $row["code"] = $code;
    // $row["brief"] = $brief;
    // $row["be_good_at"] = $be_good_at;
    // $row["tip"] = $tip;
    // $row["bulletin"] = $bulletin;
    // $row["is_bulletin_show"] = $is_bulletin_show;
    // $row["is_treatment_notice"] = $is_treatment_notice;
    // $row["auditorid_createby"] = $auditorid_createby;
    // $row["status"] = $status;
    // $row["auditstatus"] = $auditstatus;
    // $row["auditremark"] = $auditremark;
    // $row["service_remark"] = $service_remark;
    // $row["mobile"] = $mobile;
    // $row["email"] = $email;
    // $row["remark"] = $remark;
    public static function createByBiz($row) {
        DBC::requireNotEmpty($row, "Doctor::createByBiz row cannot empty");

        $default = array();
        $default["hospitalid"] = 0;
        $default["name"] = '';
        $default["sex"] = 0;
        $default["title"] = '';
        $default["department"] = '';
        $default["headimg_pictureid"] = 0;
        $default["code"] = '';
        $default["brief"] = '';
        $default["be_good_at"] = '';
        $default["tip"] = '';
        $default["bulletin"] = '';
        $default["is_bulletin_show"] = 0;
        $default["is_treatment_notice"] = 0;
        $default["auditorid_createby"] = 0;
        $default["status"] = 1;
        $default["auditstatus"] = 0;
        $default["auditremark"] = '';
        $default["service_remark"] = '';
        $default["mobile"] = '';
        $default["email"] = '';
        $default["remark"] = '';

        $row += $default;
        return new self($row);
    }

    // ====================================
    // ------------ obj method ------------
    // ====================================
    public function toSelectListJsonArray() {
        $arr = [
            'id' => $this->id,
            'name' => $this->name
        ];

        return $arr;
    }

    public function toListJsonArray() {
        $arr = [
            'id' => $this->id,
            'name' => $this->name,
            'createtime' => substr($this->createtime, 0, 10),
            'sex' => $this->sex,
            'sex_str' => $this->getSexStr(),
            'hospitalid' => $this->hospitalid,
            'hospital_name' => $this->hospital->name,
            'code' => $this->code,
            'mobile' => $this->mobile,
            'email' => $this->email,
            'status' => $this->status,
            'status_str' => $this->getStatusStr(),
        ];

        return $arr;
    }

    public function getSexStr() {
        return $this->sex == 1 ? '男' : ($this->sex == 2 ? '女' : '未知');
    }
}
