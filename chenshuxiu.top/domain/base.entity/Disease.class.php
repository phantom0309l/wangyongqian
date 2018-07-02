<?php

/*
 * Disease
 */
class Disease extends Entity
{

    protected function init_keys () {
        $this->_keys = self::getKeysDefine();
    }

    public static function getKeysDefine () {
        return array(
            'name'    //疾病名
        ,'code'    //code
            );
    }

    protected function init_keys_lock () {
        $this->_keys_lock = array(
            );
    }

    protected function init_belongtos () {
        $this->_belongtos = array();
        
    }

    // $row = array(); 
    // $row["name"] = $name;
    // $row["code"] = $code;
    public static function createByBiz ($row) {
        DBC::requireNotEmpty($row, "Disease::createByBiz row cannot empty");

        $default = array();
        $default["name"] = '';
        $default["code"] = '';

        $row += $default;
        return new self($row);
    }

    // ====================================
    // ------------ obj method ------------
    // ====================================

}
