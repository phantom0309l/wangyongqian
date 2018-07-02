<?php

/*
 * XCountyDao
 */

class XCountyDao extends Dao
{
    public static function getListByXcityid($xcityid) {
        $cond = " AND xcityid = :xcityid ";
        $bind = [
            ':xcityid' => $xcityid
        ];
        return Dao::getEntityListByCond('XCounty', $cond, $bind);
    }

}