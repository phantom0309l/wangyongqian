<?php

/*
 * DoctorDiseaseRefDao
 */

class DoctorHospitalRefDao extends Dao
{
    public static function getListByDoctorid($doctorid) {
        $cond = " AND doctorid = :doctorid ";
        $bind = [
            ':doctorid' => $doctorid
        ];

        return Dao::getEntityListByCond('DoctorHospitalRef', $cond, $bind);
    }
}