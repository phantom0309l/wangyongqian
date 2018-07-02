<?php

/*
 * XCity
 */

class XCity extends Entity
{

    protected function init_keys() {
        $this->_keys = self::getKeysDefine();
    }

    public static function getKeysDefine() {
        return array(
            'xprovinceid'    //
        , 'name'    //中文名称
        );
    }

    protected function init_keys_lock() {
        $this->_keys_lock = array(
            'xprovinceid',);
    }

    protected function init_belongtos() {
        $this->_belongtos = array();

        $this->_belongtos["xprovince"] = array("type" => "XProvince", "key" => "xprovinceid");
    }

    // $row = array(); 
    // $row["xprovinceid"] = $xprovinceid;
    // $row["name"] = $name;
    public static function createByBiz($row) {
        DBC::requireNotEmpty($row, "XCity::createByBiz row cannot empty");

        $default = array();
        $default["xprovinceid"] = 0;
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
            'children' => []
        ];
    }

}
