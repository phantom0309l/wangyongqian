<?php
/*
 * WxUserDao
 */
class WxUserDao extends Dao
{
    // 名称: getByOpenid
    public static function getByOpenid ($openid) {
        $cond = " and openid = :openid ";

        $bind = [];
        $bind[':openid'] = $openid;

        return Dao::getEntityByCond('WxUser', $cond, $bind);
    }

    // 名称: getByOpenid
    public static function getListByPaitentid ($patientid) {
        $cond = " AND patientid = :patientid ";

        $bind = [];
        $bind[':patientid'] = $patientid;

        return Dao::getEntityListByCond('WxUser', $cond, $bind);
    }

    // 名称: getByOpenid
    public static function getByPaitentid ($patientid) {
        $cond = " AND patientid = :patientid ";

        $bind = [];
        $bind[':patientid'] = $patientid;

        return Dao::getEntityByCond('WxUser', $cond, $bind);
    }
}