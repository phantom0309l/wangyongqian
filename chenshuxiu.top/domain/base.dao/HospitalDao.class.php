<?php
/*
 * HospitalDao
 */
class HospitalDao extends Dao
{
    public static function getListByCond($cond = "", $bind = []) {
        return Dao::getEntityListByCond('Hospital', $cond, $bind);
    }

    public static function getListByCond4Page($pagesize, $pagenum, $cond, $bind) {
        return Dao::getEntityListByCond4Page('Hospital', $pagesize, $pagenum, $cond, $bind);
    }

    public static function getCntByCond($cond, $bind) {
        return Dao::queryValue("SELECT COUNT(*) FROM hospitals WHERE 1 = 1 {$cond} ", $bind);
    }
}