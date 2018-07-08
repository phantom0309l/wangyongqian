<?php

/*
 * EmailCodeDao
 */

class EmailCodeDao extends Dao
{

    public static function getLastOneByEmail($email) {
        $cond = " AND email = :email ORDER BY id DESC";
        $bind = [
            ':email' => $email
        ];

        return Dao::getEntityByCond('EmailCode', $cond, $bind);
    }

}