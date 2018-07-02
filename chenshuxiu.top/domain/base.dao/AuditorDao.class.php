<?php

/*
 * AuditorDao
 */

class AuditorDao extends Dao
{
    // 名称: getByUsername
    public static function getByUsername($username) {
        $username = trim($username);
        if (empty($username)) {
            return null;
        }

        $cond = " AND ( (username = :username) OR (username <> '' AND mobile = :mobile) ) ";

        $bind = [];
        $bind[':username'] = $username;
        $bind[':mobile'] = $username;

        return Dao::getEntityByCond("Auditor", $cond, $bind);
    }

}