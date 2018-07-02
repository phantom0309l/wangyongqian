<?php

/*
 * ScheduleDao
 */

class ScheduleDao extends Dao
{
    public static function getListByCond4Page($pagesize, $pagenum, $cond, $bind) {
        return Dao::getEntityListByCond4Page('Schedule', $pagesize, $pagenum, $cond, $bind);
    }

    public static function getCntByCond($cond, $bind) {
        return Dao::queryValue("SELECT COUNT(*) FROM schedules WHERE 1 = 1 {$cond} ", $bind);
    }

    // 名称: getValidListByDoctor
    // 备注:实例列表 of Doctor
    // 创建:chenning
    // 修改:
    public static function getValidListByDoctorid($doctorid, $fromdate, $todate, $diseaseid = null) {

        $cond = " and doctorid=:doctorid and thedate>=:fromdate and thedate<=:todate and status = 1";
        $bind = array(
            ':doctorid' => $doctorid,
            ':fromdate' => $fromdate,
            ':todate' => $todate
        );
        if (!empty($diseaseid)) {
            $cond .= " and diseaseid = :diseaseid ";
            $bind[':diseaseid'] = $diseaseid;
        }
        $cond .= " order by thedate, daypart ";

        return Dao::getEntityListByCond('Schedule', $cond, $bind);
    }
}