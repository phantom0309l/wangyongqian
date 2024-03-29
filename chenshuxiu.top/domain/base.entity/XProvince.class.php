<?php

/*
 * XProvince
 */

class XProvince extends Entity
{

    protected function init_keys() {
        $this->_keys = self::getKeysDefine();
    }

    public static function getKeysDefine() {
        return array(
            'name'    //中文名称
        );
    }

    protected function init_keys_lock() {
        $this->_keys_lock = array();
    }

    protected function init_belongtos() {
        $this->_belongtos = array();

    }

    // $row = array(); 
    // $row["name"] = $name;
    public static function createByBiz($row) {
        DBC::requireNotEmpty($row, "XProvince::createByBiz row cannot empty");

        $default = array();
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
