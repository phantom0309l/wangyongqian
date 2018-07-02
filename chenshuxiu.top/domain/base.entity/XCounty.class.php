<?php

/*
 * XCounty
 */

class XCounty extends Entity
{

    protected function init_keys() {
        $this->_keys = self::getKeysDefine();
    }

    public static function getKeysDefine() {
        return array(
            'xcityid'    //
        , 'name'    //中文名称
        );
    }

    protected function init_keys_lock() {
        $this->_keys_lock = array(
            'xcityid',);
    }

    protected function init_belongtos() {
        $this->_belongtos = array();

        $this->_belongtos["xcity"] = array("type" => "XCity", "key" => "xcityid");
    }

    // $row = array(); 
    // $row["xcityid"] = $xcityid;
    // $row["name"] = $name;
    public static function createByBiz($row) {
        DBC::requireNotEmpty($row, "XCounty::createByBiz row cannot empty");

        $default = array();
        $default["xcityid"] = 0;
        $default["name"] = '';

        $row += $default;
        return new self($row);
    }

    // ====================================
    // ------------ obj method ------------
    // ====================================
    public function toJsonArray() {
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }

}
