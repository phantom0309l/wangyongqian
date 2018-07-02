<?php
/*
 * XProvinceDao
 */
class XProvinceDao extends Dao
{
    public static function getAll() {
        return Dao::getEntityListByCond('XProvince');
    }
}