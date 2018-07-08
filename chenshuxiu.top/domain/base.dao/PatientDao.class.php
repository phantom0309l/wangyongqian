<?php

/*
 * PatientDao
 */

class PatientDao extends Dao
{
    public static function getListByCond4Page($pagesize, $pagenum, $cond, $bind) {
        return Dao::getEntityListByCond4Page('Patient', $pagesize, $pagenum, $cond, $bind);
    }

    public static function getCntByCond($cond, $bind) {
        return Dao::queryValue("SELECT COUNT(*) FROM patients WHERE 1 = 1 {$cond} ", $bind);
    }

    public static function getByMobile($mobile) {
        $cond = " AND mobile = :mobile ";
        $bind = [
            ':mobile' => $mobile
        ];

        return Dao::getEntityByCond('Patient', $cond, $bind);
    }
}