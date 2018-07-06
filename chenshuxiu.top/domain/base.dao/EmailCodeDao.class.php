<?php

/*
 * EmailCodeDao
 */

class EmailCodeDao extends Dao
{

    public static function getOneByEmail($email) {
        $cond = " AND email = :email ";
        $bind = [
            ':email' => $email
        ];

        return Dao::getEntityByCond('EmailCode', $cond, $bind);
    }

}