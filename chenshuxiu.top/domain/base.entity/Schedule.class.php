<?php

/*
 * Schedule
 */

class Schedule extends Entity
{

    protected function init_keys() {
        $this->_keys = self::getKeysDefine();
    }

    public static function getKeysDefine() {
        return array(
            'doctorid'    //doctorid
        , 'diseaseid'    //diseaseid
        , 'scheduletplid'    //暂时是 doctorschedule->id
        , 'thedate'    //
        , 'daypart'    //
        , 'dow'    //周几
        , 'tkttype'    //类型
        , 'maxcnt'    //最多预约数目
        , 'status'    //状态
        );
    }

    protected function init_keys_lock() {
        $this->_keys_lock = array(
            'doctorid', 'diseaseid', 'scheduletplid',);
    }

    protected function init_belongtos() {
        $this->_belongtos = array();

        $this->_belongtos["doctor"] = array("type" => "Doctor", "key" => "doctorid");
        $this->_belongtos["disease"] = array("type" => "Disease", "key" => "diseaseid");
        $this->_belongtos["scheduletpl"] = array("type" => "ScheduleTpl", "key" => "scheduletplid");
    }

    // $row = array(); 
    // $row["doctorid"] = $doctorid;
    // $row["diseaseid"] = $diseaseid;
    // $row["scheduletplid"] = $scheduletplid;
    // $row["thedate"] = $thedate;
    // $row["daypart"] = $daypart;
    // $row["dow"] = $dow;
    // $row["tkttype"] = $tkttype;
    // $row["maxcnt"] = $maxcnt;
    // $row["status"] = $status;
    public static function createByBiz($row) {
        DBC::requireNotEmpty($row, "Schedule::createByBiz row cannot empty");

        $entity = Schedule::getByScheduleTplidAndThedate($row["scheduletplid"], $row["thedate"]);
        if ($entity instanceof Schedule) {
            return $entity;
        }

        $default = array();
        $default["doctorid"] = 0;
        $default["diseaseid"] = 0;
        $default["scheduletplid"] = 0;
        $default["thedate"] = '0000-00-00';
        $default["daypart"] = '';
        $default["dow"] = 0;
        $default["tkttype"] = '';
        $default["maxcnt"] = 0;
        $default["status"] = 1;

        $row += $default;
        return new self($row);
    }

    // ====================================
    // ------------ obj method ------------
    // ====================================
    public function toListJsonArray() {
        $arr = [
            'id' => $this->id,
            'diseaseid' => $this->diseaseid,
            'disease_name' => $this->diseaseid > 0 ? $this->disease->name : '全部疾病',
            'thedate' => $this->thedate,
            'dow' => $this->dow,
            'dow_str' => $this->getDowStr(),
            'daypart' => $this->daypart,
            'daypart_str' => $this->getDayPartStr(),
            'tkttype' => $this->tkttype,
            'tkttype_str' => $this->getTktTypeStr(),
            'maxcnt' => $this->maxcnt,
            'valid_cnt' => $this->getValidCnt(),
            'total_cnt' => $this->getTotalCnt(),
            'status' => $this->status,
            'status_str' => $this->getStatusStr(),
            'address' => $this->getAddress(),
        ];

        return $arr;
    }

    public function toOneJsonArray() {
        $arr = [
            'scheduletpl' => [
                'id' => $this->scheduletpl->id,
                'begin_hour_str' => $this->scheduletpl->begin_hour_str,
                'end_hour_str' => $this->scheduletpl->end_hour_str,
                'hour_str' => [$this->scheduletpl->begin_hour_str, $this->scheduletpl->end_hour_str],
                'tip' => $this->scheduletpl->tip,
                'scheduletpl_mobile' => $this->scheduletpl->scheduletpl_mobile,
                'scheduletpl_cost' => $this->scheduletpl->scheduletpl_cost,
                'revisitrecord_cnt' => 0,
                'address' => $this->getAddress(),
            ],
            'id' => $this->id,
            'diseaseid' => $this->diseaseid,
            'disease_name' => $this->diseaseid > 0 ? $this->disease->name : '全部疾病',
            'thedate' => $this->thedate,
            'dow' => $this->dow,
            'daypart' => $this->daypart,
            'tkttype' => $this->tkttype,
            'maxcnt' => $this->maxcnt,
            'valid_cnt' => $this->getValidCnt(),
            'total_cnt' => $this->getTotalCnt(),
            'status' => $this->status,
        ];

        return $arr;
    }

    public function getAddress() {
        $scheduletpl = $this->scheduletpl;
        if ($scheduletpl->xprovinceid) {
            return $scheduletpl->xprovince->name . $scheduletpl->xcity->name . $scheduletpl->xcounty->name . $scheduletpl->content;
        } else {
            return $scheduletpl->content;
        }
    }

    public function getValidCnt() {
        return 0;
    }

    public function getTotalCnt() {
        return 0;
    }

    public function getDowStr() {
        return self::getDowArray()[$this->dow];
    }

    public function getTktTypeStr() {
        return self::getTkttypeArray()[$this->tkttype];
    }

    public function getDayPartStr() {
        return self::getDaypartArray()[$this->daypart];
    }

    public function getIsHaveCnt() {
        $cnt = $this->maxcnt - $this->getIdleCnt();
        if ($cnt < 0) {
            $cnt = 0;
        }
        return $cnt;
    }

    public function getIdleCnt() {
        $cnt = OrderDao::getCntByScheduleidDoctorid($this->id, $this->doctorid);
        $maxcnt = $this->maxcnt;

        if ($maxcnt > 0) {
            return $maxcnt - $cnt;
        }

        return 10000;
    }


    // ====================================
    // ------------ static method ------------
    // ====================================

    // 2元式
    public static function getByScheduleTplidAndThedate($scheduletplidd, $thedate) {
        $cond = ' AND scheduletplid = :scheduletplid AND thedate = :thedate ';
        $bind = [];
        $bind[':scheduletplid'] = $scheduletplidd;
        $bind[':thedate'] = $thedate;

        return Dao::getEntityByCond('Schedule', $cond, $bind);
    }

    public static function getDaypartArray() {
        $arr = array(
            'am' => '上午 ',
            'pm' => '下午 ',
            'all_day' => '全天',
            'night' => '晚上');
        return $arr;
    }

    public static function getDowArray() {
        $arr = array(
            '周日',
            '周一',
            '周二',
            '周三',
            '周四',
            '周五',
            '周六',
            '周日');
        return $arr;
    }

    public static function getTkttypeArray() {
        $arr = array(
            'normal' => '普通',
            'expert' => '专家',
            'special' => '特需');
        return $arr;
    }

    // 批量创建
    public static function batCreateByScheduleTpl(ScheduleTpl $scheduletpl, $start_date = null, $end_date = null) {
        if (empty($start_date)) {
            $start_date = date('Y-m-d');
        }

        if (empty($end_date)) {
            $end_date = date('Y-m-d', strtotime('+1 year', strtotime($start_date)));
        }

        $w1 = XDateTime::getWFromFirstDate($start_date);
        $w2 = XDateTime::getWFromFirstDate($end_date);
        $wcnt = $w2 - $w1;

        $arr = ScheduleTplService::getDateArray($scheduletpl, $wcnt, $start_date);

        $schedules = [];
        foreach ($arr as $date) {
            $row = array();
            $row["doctorid"] = $scheduletpl->doctorid;
            $row["diseaseid"] = $scheduletpl->diseaseid;
            $row["scheduletplid"] = $scheduletpl->id;
            $row["thedate"] = $date;
            $row["daypart"] = $scheduletpl->day_part;
            $row["dow"] = $scheduletpl->wday;
            $row["tkttype"] = $scheduletpl->op_type;
            $row["maxcnt"] = $scheduletpl->maxcnt;

            $schedules[] = Schedule::createByBiz($row);
        }

        return $schedules;
    }

}
