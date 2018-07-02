<?php

// ScheduleTplMgrAction
class ScheduleTplMgrAction extends AdminBaseAction
{
    public function doAdd() {
        $doctorid = XRequest::getValue('doctorid', 0);
        if (!$doctorid) {
            $this->returnError('请选择医生');
        }

        $doctordiseaserefs = DoctorDiseaseRefDao::getListByDoctorid($doctorid);

        $doctordiseaseref_arr = [];
        foreach ($doctordiseaserefs as $doctordiseaseref) {
            $doctordiseaseref_arr[] = $doctordiseaseref->toListJsonArray();
        }

        $op_hzs = ScheduleTpl::get_op_hzArray();
        $day_parts = ScheduleTpl::get_day_partArray();
        $op_types = ScheduleTpl::get_op_typeArray();

        $this->result['data'] = [
            'doctordiseaserefs' => $doctordiseaseref_arr,
            'op_hzs' => $op_hzs,
            'day_parts' => $day_parts,
            'op_types' => $op_types,
        ];
        return self::TEXTJSON;
    }

    public function doAddPost() {
        $doctorid = XRequest::getValue("doctorid", 0);
        $doctor = Doctor::getById($doctorid);
        if (false == $doctor instanceof Doctor) {
            $this->returnError('医生不存在');
        }

        $diseaseid = XRequest::getValue("diseaseid", 0);
        if ($diseaseid > 0) {
            $disease = Disease::getById($diseaseid);
            if (false == $disease instanceof Disease) {
                $this->returnError('未找到对应疾病');
            }
        }
        $op_hz = XRequest::getValue("op_hz", '');
        $op_date = XRequest::getValue("op_date", '0000-00-00');
        $day_part = XRequest::getValue("day_part", '');
        $op_type = XRequest::getValue("op_type", '');
        $scheduletpl_mobile = XRequest::getValue("scheduletpl_mobile", '');
        $scheduletpl_cost = XRequest::getValue("scheduletpl_cost", '');

        $hour_str = XRequest::getValue("hour_str", []);

        $wday = date("w", strtotime($op_date));
        $wday = ($wday == 0) ? 7 : $wday;

        $xprovinceid = XRequest::getValue("xprovinceid", 0);
        $xcityid = XRequest::getValue("xcityid", 0);
        $xcountyid = XRequest::getValue("xcountyid", 0);
        $content = XRequest::getValue("content", '');

        $tip = XRequest::getValue("tip", '');
        $maxcnt = XRequest::getValue("maxcnt", 0);

        $row = array();
        $row['doctorid'] = $doctorid;
        $row['diseaseid'] = $diseaseid;
        $row["op_hz"] = $op_hz;
        $row["op_date"] = $op_date;
        $row["day_part"] = $day_part;
        $row["op_type"] = $op_type;
        $row["scheduletpl_mobile"] = $scheduletpl_mobile;
        $row["scheduletpl_cost"] = $scheduletpl_cost;
        $row["begin_hour_str"] = $hour_str[0];
        $row["end_hour_str"] = $hour_str[1];
        $row["wday"] = $wday;
        $row["tip"] = $tip;
        $row["maxcnt"] = $maxcnt;
        $row["xprovinceid"] = $xprovinceid;
        $row["xcityid"] = $xcityid;
        $row["xcountyid"] = $xcountyid;
        $row["content"] = $content;
        $row["status"] = 1;
        $scheduletpl = ScheduleTpl::createByBiz($row);

        return self::TEXTJSON;
    }

    public function doList() {
        $doctorid = XRequest::getValue('doctorid', 0);
        if (!$doctorid) {
            $this->returnError('请选择医生');
        }

        $doctor = Doctor::getById($doctorid);
        if (false == $doctor instanceof Doctor) {
            $this->returnError('医生不存在');
        }

        $scheduletpls = ScheduleTplDao::getListByDoctorid($doctorid);

        $arr = [];
        foreach ($scheduletpls as $scheduletpl) {
            $arr[] = $scheduletpl->toListJsonArray();
        }

        $this->result['data'] = [
            'scheduletpls' => $arr
        ];
        return self::TEXTJSON;
    }

    public function doSelectList() {
        $doctorid = XRequest::getValue('doctorid', 0);
        if (!$doctorid) {
            $this->returnError('请选择医生');
        }

        $doctor = Doctor::getById($doctorid);
        if (false == $doctor instanceof Doctor) {
            $this->returnError('医生不存在');
        }

        $scheduletpls = ScheduleTplDao::getValidListByDoctorid($doctorid);

        $arr = [];
        foreach ($scheduletpls as $scheduletpl) {
            $arr[] = $scheduletpl->toSelectListJsonArray();
        }

        $this->result['data'] = [
            'scheduletpls' => $arr
        ];
        return self::TEXTJSON;
    }

    public function doModify() {
        $scheduletplid = XRequest::getValue('scheduletplid', 0);
        $scheduletpl = ScheduleTpl::getById($scheduletplid);
        if (false == $scheduletpl instanceof ScheduleTpl) {
            $this->returnError('门诊表不存在');
        }

        $doctordiseaserefs = DoctorDiseaseRefDao::getListByDoctorid($scheduletpl->doctorid);

        $doctordiseaseref_arr = [];
        foreach ($doctordiseaserefs as $doctordiseaseref) {
            $doctordiseaseref_arr[] = $doctordiseaseref->toListJsonArray();
        }

        $op_hzs = ScheduleTpl::get_op_hzArray();
        $day_parts = ScheduleTpl::get_day_partArray();
        $op_types = ScheduleTpl::get_op_typeArray();

        $this->result['data'] = [
            'scheduletpl' => $scheduletpl->toOneJsonArray(),
            'doctordiseaserefs' => $doctordiseaseref_arr,
            'op_hzs' => $op_hzs,
            'day_parts' => $day_parts,
            'op_types' => $op_types,
        ];
        return self::TEXTJSON;
    }

    public function doModifyPost() {
        $scheduletplid = XRequest::getValue('id', 0);
        $scheduletpl = ScheduleTpl::getById($scheduletplid);
        if (false == $scheduletpl instanceof ScheduleTpl) {
            $this->returnError('门诊表不存在');
        }

        $op_hz = XRequest::getValue("op_hz", '');
        $op_date = XRequest::getValue("op_date", '0000-00-00');
        $day_part = XRequest::getValue("day_part", '');
        $op_type = XRequest::getValue("op_type", '');
        $scheduletpl_mobile = XRequest::getValue("scheduletpl_mobile", '');
        $scheduletpl_cost = XRequest::getValue("scheduletpl_cost", '');

        $hour_str = XRequest::getValue("hour_str", []);

        $wday = date("w", strtotime($op_date));
        $wday = ($wday == 0) ? 7 : $wday;

        $xprovinceid = XRequest::getValue("xprovinceid", 0);
        $xcityid = XRequest::getValue("xcityid", 0);
        $xcountyid = XRequest::getValue("xcountyid", 0);
        $content = XRequest::getValue("content", '');

        $tip = XRequest::getValue("tip", '');
        $maxcnt = XRequest::getValue("maxcnt", 0);
        $status = XRequest::getValue("status", 1);

        $scheduletpl->op_hz = $op_hz;
        $scheduletpl->op_date = $op_date;
        $scheduletpl->day_part = $day_part;
        $scheduletpl->op_type = $op_type;
        $scheduletpl->scheduletpl_mobile = $scheduletpl_mobile;
        $scheduletpl->scheduletpl_cost = $scheduletpl_cost;
        $scheduletpl->begin_hour_str = $hour_str[0];
        $scheduletpl->end_hour_str = $hour_str[1];
        $scheduletpl->wday = $wday;
        $scheduletpl->tip = $tip;
        $scheduletpl->maxcnt = $maxcnt;
        $scheduletpl->xprovinceid = $xprovinceid;
        $scheduletpl->xcityid = $xcityid;
        $scheduletpl->xcountyid = $xcountyid;
        $scheduletpl->content = $content;
        $scheduletpl->status = $status;

        return self::TEXTJSON;
    }

    public function doChangeStatusPost() {
        $scheduletplid = XRequest::getValue('scheduletplid', 0);
        $scheduletpl = ScheduleTpl::getById($scheduletplid);
        if (false == $scheduletpl instanceof ScheduleTpl) {
            $this->returnError('门诊表不存在');
        }

        $status = XRequest::getValue('status', 0);

        $scheduletpl->status = $status;

        return self::TEXTJSON;
    }
}
