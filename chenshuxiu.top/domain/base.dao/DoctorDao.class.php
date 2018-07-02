<?php

/*
 * DoctorDao
 */

class DoctorDao extends Dao
{

    public static function getListByCond($cond, $bind = []) {
        return Dao::getEntityListByCond('Doctor', $cond, $bind);
    }

    public static function getListByCond4Page($pagesize, $pagenum, $cond, $bind) {
        return Dao::getEntityListByCond4Page('Doctor', $pagesize, $pagenum, $cond, $bind);
    }

    public static function getCntByCond($cond, $bind) {
        return Dao::queryValue("SELECT COUNT(*) FROM doctors WHERE 1 = 1 {$cond} ", $bind);
    }

}