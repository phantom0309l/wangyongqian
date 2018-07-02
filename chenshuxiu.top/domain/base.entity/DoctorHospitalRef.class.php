<?php

/*
 * DoctorDiseaseRef
 */

class DoctorHospitalRef extends Entity
{

    protected function init_keys() {
        $this->_keys = self::getKeysDefine();
    }

    public static function getKeysDefine() {
        return array(
            'doctorid'    //doctorid
        , 'hospitalid'    //hospitalid
        );
    }

    protected function init_keys_lock() {
        $this->_keys_lock = array(
            'doctorid', 'hospitalid',);
    }

    protected function init_belongtos() {
        $this->_belongtos = array();

        $this->_belongtos["doctor"] = array("type" => "Doctor", "key" => "doctorid");
        $this->_belongtos["hospital"] = array("type" => "Hospital", "key" => "hospitalid");
    }

    // $row = array(); 
    // $row["doctorid"] = $doctorid;
    // $row["hospitalid"] = $hospitalid;
    public static function createByBiz($row) {
        DBC::requireNotEmpty($row, "DoctorHospitalRef::createByBiz row cannot empty");

        $default = array();
        $default["doctorid"] = 0;
        $default["hospitalid"] = 0;

        $row += $default;
        return new self($row);
    }

    // ====================================
    // ------------ obj method ------------
    // ====================================
    public function toListJsonArray() {
        $arr = [
            'id' => $this->id,
            'hospitalid' => $this->hospitalid,
            'hospital_name' => $this->hospital->name
        ];

        return $arr;
    }

}
