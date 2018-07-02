<?php

/*
 * DoctorDiseaseRef
 */

class DoctorDiseaseRef extends Entity
{

    protected function init_keys() {
        $this->_keys = self::getKeysDefine();
    }

    public static function getKeysDefine() {
        return array(
            'doctorid'    //doctorid
        , 'diseaseid'    //diseaseid
        );
    }

    protected function init_keys_lock() {
        $this->_keys_lock = array(
            'doctorid', 'diseaseid',);
    }

    protected function init_belongtos() {
        $this->_belongtos = array();

        $this->_belongtos["doctor"] = array("type" => "Doctor", "key" => "doctorid");
        $this->_belongtos["disease"] = array("type" => "Disease", "key" => "diseaseid");
    }

    // $row = array(); 
    // $row["doctorid"] = $doctorid;
    // $row["diseaseid"] = $diseaseid;
    public static function createByBiz($row) {
        DBC::requireNotEmpty($row, "DoctorDiseaseRef::createByBiz row cannot empty");

        $default = array();
        $default["doctorid"] = 0;
        $default["diseaseid"] = 0;

        $row += $default;
        return new self($row);
    }

    // ====================================
    // ------------ obj method ------------
    // ====================================
    public function toListJsonArray() {
        $arr = [
            'id' => $this->id,
            'diseaseid' => $this->diseaseid,
            'disease_name' => $this->disease->name
        ];

        return $arr;
    }

}
