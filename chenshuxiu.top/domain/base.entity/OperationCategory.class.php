<?php

/*
 * OperationCategory
 */

class OperationCategory extends Entity
{

    protected function init_keys() {
        $this->_keys = self::getKeysDefine();
    }

    public static function getKeysDefine() {
        return array(
            'doctorid'    //doctorid
        , 'parentid'    //parentid
        , 'title'    //职称
        , 'remark'    //备注
        );
    }

    protected function init_keys_lock() {
        $this->_keys_lock = array(
            'doctorid', 'parentid',);
    }

    protected function init_belongtos() {
        $this->_belongtos = array();

        $this->_belongtos["doctor"] = array("type" => "Doctor", "key" => "doctorid");
        $this->_belongtos["parent"] = array("type" => "OperationCategory", "key" => "parentid");
    }

    // $row = array(); 
    // $row["doctorid"] = $doctorid;
    // $row["parentid"] = $parentid;
    // $row["title"] = $title;
    // $row["remark"] = $remark;
    public static function createByBiz($row) {
        DBC::requireNotEmpty($row, "OperationCategory::createByBiz row cannot empty");

        $default = array();
        $default["doctorid"] = 0;
        $default["parentid"] = 0;
        $default["title"] = '';
        $default["remark"] = '';

        $row += $default;
        return new self($row);
    }

    // ====================================
    // ------------ obj method ------------
    // ====================================
    public function toListJsonArray() {
        $children = [];
        $subs = $this->getSubs();
        foreach ($subs as $sub) {
            $children[] = [
                'title' => $sub->title,
            ];
        }
        $arr = [
            'title' => $this->title,
            'children' => $children
        ];

        return $arr;
    }

    public function getSubs() {
        return OperationCategoryDao::getListByParentid($this->id);
    }
}
