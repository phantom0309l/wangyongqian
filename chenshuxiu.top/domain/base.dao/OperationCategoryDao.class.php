<?php
/*
 * OperationCategoryDao
 */
class OperationCategoryDao extends Dao
{

    public static function getParentListByDoctorid($doctorid) {
        $cond = " AND parentid = 0 AND doctorid = :doctorid ";
        $bind = [
            ':doctorid' => $doctorid
        ];

        return Dao::getEntityListByCond('OperationCategory', $cond, $bind);
    }

    public static function getListByParentid($parentid) {
        $cond = " AND parentid = :parentid ";
        $bind = [
            ':parentid' => $parentid
        ];

        return Dao::getEntityListByCond('OperationCategory', $cond, $bind);
    }
}