<?php

/*
 * Hospital
 */

class Hospital extends Entity
{

    protected function init_keys() {
        $this->_keys = self::getKeysDefine();
    }

    public static function getKeysDefine() {
        return array(
            'name'    //医院名称
        , 'shortname'    //短名称
        , 'logo_pictureid'    //医院logo图片
        , 'levelstr'    //等级
        , 'xprovinceid'    //省id
        , 'xcityid'    //市id
        , 'xcountyid'    //区id
        , 'content'    //详细地址
        , 'status'    //状态
        , 'remark'    //备注
        );
    }

    protected function init_keys_lock() {
        $this->_keys_lock = array(
            'logo_pictureid', 'xprovinceid', 'xcityid', 'xcountyid',);
    }

    protected function init_belongtos() {
        $this->_belongtos = array();

        $this->_belongtos["logo_picture"] = array("type" => "Logo_picture", "key" => "logo_pictureid");
        $this->_belongtos["xprovince"] = array("type" => "XProvince", "key" => "xprovinceid");
        $this->_belongtos["xcity"] = array("type" => "XCity", "key" => "xcityid");
        $this->_belongtos["xcounty"] = array("type" => "XCounty", "key" => "xcountyid");
    }

    // $row = array(); 
    // $row["name"] = $name;
    // $row["shortname"] = $shortname;
    // $row["logo_pictureid"] = $logo_pictureid;
    // $row["levelstr"] = $levelstr;
    // $row["xprovinceid"] = $xprovinceid;
    // $row["xcityid"] = $xcityid;
    // $row["xcountyid"] = $xcountyid;
    // $row["content"] = $content;
    // $row["status"] = $status;
    // $row["remark"] = $remark;
    public static function createByBiz($row) {
        DBC::requireNotEmpty($row, "Hospital::createByBiz row cannot empty");

        $default = array();
        $default["name"] = '';
        $default["shortname"] = '';
        $default["logo_pictureid"] = 0;
        $default["levelstr"] = '';
        $default["xprovinceid"] = 0;
        $default["xcityid"] = 0;
        $default["xcountyid"] = 0;
        $default["content"] = '';
        $default["status"] = 1;
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
            'createtime' => substr($this->createtime, 0, 10),
            'name' => $this->name,
            'address' => $this->getAddress(),
            'levelstr' => $this->levelstr,
            'doctor_cnt' => $this->getDoctorCnt(),
            'status' => $this->status,
            'status_str' => $this->getStatusStr(),
        ];

        return $arr;
    }

    public function getDoctorCnt() {
        return 0;
    }

    public function getAddress() {
        if ($this->xprovinceid) {
            return $this->xprovince->name . $this->xcity->name . $this->xcounty->name . $this->content;
        } else {
            return $this->content;
        }
    }
}
