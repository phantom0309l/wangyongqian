<?php

/*
 * ScheduleTplDao
 */

class ScheduleTplDao extends Dao
{
    public static function getListByDoctorid($doctorid) {
        $cond = " AND doctorid = :doctorid ";
        $bind = [
            ':doctorid' => $doctorid
        ];
        return ScheduleDao::getEntityListByCond('ScheduleTpl', $cond, $bind);
    }

    public static function getValidListByDoctorid($doctorid) {
        $cond = " AND doctorid = :doctorid AND status = 1 ";
        $bind = [
            ':doctorid' => $doctorid
        ];
        return ScheduleDao::getEntityListByCond('ScheduleTpl', $cond, $bind);
    }

}