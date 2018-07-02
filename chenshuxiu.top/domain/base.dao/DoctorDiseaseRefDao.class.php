<?php

/*
 * DoctorDiseaseRefDao
 */

class DoctorDiseaseRefDao extends Dao
{
    public static function getListByDoctorid($doctorid) {
        $cond = " AND doctorid = :doctorid ";
        $bind = [
            ':doctorid' => $doctorid
        ];

        return Dao::getEntityListByCond('DoctorDiseaseRef', $cond, $bind);
    }
}