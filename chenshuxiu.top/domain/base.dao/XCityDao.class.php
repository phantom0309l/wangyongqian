<?php

/*
 * XCityDao
 */

class XCityDao extends Dao
{
    public static function getListByXprovinceid($xprovinceid) {
        $cond = " AND xprovinceid = :xprovinceid ";
        $bind = [
            ':xprovinceid' => $xprovinceid
        ];
        return Dao::getEntityListByCond('XCity', $cond, $bind);
    }

}