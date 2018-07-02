<?php

// ScheduleMgrAction
class ScheduleMgrAction extends AdminBaseAction
{
    public function doList() {
        $pagesize = XRequest::getValue('pagesize', 20);
        $pagenum = XRequest::getValue('pagenum', 1);

        $doctorid = XRequest::getValue('doctorid', 0);

        $start_date = XRequest::getValue('start_date');
        $end_date = XRequest::getValue('end_date', date('Y-m-d'));

        $scheduletplid = XRequest::getValue('scheduletplid', 0);

        $cond = "";
        $bind = [];

        if (!$doctorid) {
            $this->returnError('请选择医生');
        }

        $cond .= " AND doctorid = :doctorid ";
        $bind[':doctorid'] = $doctorid;

        if ($start_date) {
            $cond .= " AND thedate BETWEEN :start_date AND :end_date ";
            $bind[':start_date'] = $start_date;
            $bind[':end_date'] = $end_date;
        }

        if ($scheduletplid) {
            $cond .= " AND scheduletplid = :scheduletplid ";
            $bind[':scheduletplid'] = $scheduletplid;
        }

        $schedules = ScheduleDao::getListByCond4Page($pagesize, $pagenum, $cond, $bind);
        $arr = [];
        foreach ($schedules as $schedule) {
            $arr[] = $schedule->toListJsonArray();
        }

        $total_cnt = ScheduleDao::getCntByCond($cond, $bind);

        $this->result['data'] = [
            'schedules' => $arr,
            'total_cnt' => $total_cnt
        ];
        return self::TEXTJSON;
    }

    // 批量创建医生出诊
    public function doBatchAddPost() {
        $scheduletplid = XRequest::getValue('scheduletplid', 0);
        $scheduletpl = ScheduleTpl::getById($scheduletplid);

        if (false == $scheduletpl instanceof ScheduleTpl) {
            $this->returnError('门诊表不存在');
        }

        $start_date = XRequest::getValue('start_date', date('Y-m-d'));
        $end_date = XRequest::getValue('end_date', date('Y-m-d', strtotime('+1 year', strtotime($start_date))));
        $schedules = Schedule::batCreateByScheduleTpl($scheduletpl, $start_date, $end_date);

        return self::TEXTJSON;
    }

    public function doModify() {
        $scheduleid = XRequest::getValue('scheduleid', 0);
        $schedule = Schedule::getById($scheduleid);
        if (false == $schedule instanceof Schedule) {
            $this->returnError('门诊实例不存在');
        }

        $dayparts = Schedule::getDaypartArray();
        $tkttypes = Schedule::getTkttypeArray();

        $this->result['data'] = [
            'schedule' => $schedule->toOneJsonArray(),
            'dayparts' => $dayparts,
            'tkttypes' => $tkttypes,
        ];
        return self::TEXTJSON;
    }

    public function doModifyPost() {
        $scheduleid = XRequest::getValue('id', 0);
        $schedule = Schedule::getById($scheduleid);
        if (false == $schedule instanceof Schedule) {
            $this->returnError('门诊实例不存在');
        }

        $thedate = XRequest::getValue("thedate");
        $daypart = XRequest::getValue("daypart", '0000-00-00');
        $dow = XRequest::getValue("dow");
        $tkttype = XRequest::getValue("tkttype");
        $maxcnt = XRequest::getValue("maxcnt", 20);
        $status = XRequest::getValue("status", 1);

        $schedule->thedate = $thedate;
        $schedule->daypart = $daypart;
        $schedule->dow = $dow;
        $schedule->tkttype = $tkttype;
        $schedule->maxcnt = $maxcnt;
        $schedule->status = $status;

        return self::TEXTJSON;
    }

    public function doChangeStatusPost() {
        $scheduleid = XRequest::getValue('scheduleid', 0);
        $schedule = Schedule::getById($scheduleid);
        if (false == $schedule instanceof Schedule) {
            $this->returnError('门诊实例不存在');
        }

        $status = XRequest::getValue('status', 0);

        $schedule->status = $status;

        return self::TEXTJSON;
    }
}
