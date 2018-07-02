<?php

/*
 * OrderDao
 */

class OrderDao extends Dao
{
    public static function getListBySql4Page($sql, $pagesize, $pagenum, $bind) {
        return Dao::loadEntityList4Page('Order', $sql, $pagesize, $pagenum, $bind);
    }

    public static function getListBySql($sql, $bind) {
        return Dao::loadEntityList('Order', $sql, $bind);
    }

    public static function getListByPaitentid($patientid) {
        $cond = " AND patientid = :patientid ";
        $bind = [
            ':patientid' => $patientid
        ];

        return Dao::getEntityListByCond('Order', $cond, $bind);
    }

    public static function getCountOfPatientid($patientid, $doctorid = 0, $createby = null) {
        $cond = "";
        $bind = [];

        $sql = "SELECT COUNT(*) FROM orders WHERE 1 = 1 ";

        if ($createby != null) {
            $cond .= ' and createby = :createby ';
            $bind[':createby'] = $createby;
        }

        if ($doctorid > 0) {
            $cond .= ' and doctorid = :doctorid ';
            $bind[':doctorid'] = $doctorid;
        }

        $cond .= " and patientid = :patientid ";

        $sql .= $cond;

        $bind[':patientid'] = $patientid;

        return Dao::queryValue($sql, $bind);
    }

    // 名称: getLastOfPatient_Open
    // 备注: 获取患者的最后一个打开的加号单
    public static function getLastOfPatient_Open($patientid, $doctorid = 0, $createby = null) {
        $cond = "";
        $bind = [];

        if ($createby != null) {
            $cond .= ' and createby = :createby ';
            $bind[':createby'] = $createby;
        }

        if ($doctorid > 0) {
            $cond .= ' and doctorid = :doctorid ';
            $bind[':doctorid'] = $doctorid;
        }

        $cond .= " and patientid = :patientid and isclosed = 0
            order by id desc
            limit 1 ";

        $bind[':patientid'] = $patientid;

        return Dao::getEntityByCond("Order", $cond, $bind);
    }

    // 名称: getCntByScheduleidDoctorid
    // 备注: 获取已约出去数目
    public static function getCntByScheduleidDoctorid($scheduleid, $doctorid, $yuyue_platform = 'fangcun') {
        $sql = "select count(*)
                from orders
                where scheduleid = :scheduleid 
                and doctorid = :doctorid
                and yuyue_platform = :yuyue_platform
                and isclosed = 0 
                and patientid > 0
                and status = 1 
                and auditstatus in (0,1) ";

        $bind = array(
            ":scheduleid" => $scheduleid,
            ":doctorid" => $doctorid,
            ":yuyue_platform" => $yuyue_platform);

        return Dao::queryValue($sql, $bind);
    }

}