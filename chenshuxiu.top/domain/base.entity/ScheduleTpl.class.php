<?php

/*
 * ScheduleTpl
 */

class ScheduleTpl extends Entity
{

    protected function init_keys() {
        $this->_keys = self::getKeysDefine();
    }

    public static function getKeysDefine() {
        return array(
            'doctorid'    //doctorid
        , 'diseaseid'    //diseaseid
        , 'op_hz'    // weekly(每周） , interval（隔周）, temp（临时）
        , 'day_part'    // am 上午 , pm 下午 ,all_day 全天， night 晚上
        , 'op_type'    // normal, special, special
        , 'wday'    // 1-7
        , 'op_date'    // 临时和隔周是有意义的 2015-08-15
        , 'begin_hour_str'    //开始门诊时间点 例如8:00 用字符串
        , 'end_hour_str'    //开始门诊时间点 例如8:00 用字符串
        , 'tip'    //
        , 'maxcnt'    //最多预约数目
        , 'scheduletpl_mobile'    //门诊电话
        , 'scheduletpl_cost'    //门诊费用
        , 'status'    //状态
        , 'xprovinceid'    //省id
        , 'xcityid'    //市id
        , 'xcountyid'    //区id
        , 'content'    //详细地址
        );
    }

    protected function init_keys_lock() {
        $this->_keys_lock = array(
            'doctorid', 'diseaseid');
    }

    protected function init_belongtos() {
        $this->_belongtos = array();

        $this->_belongtos["doctor"] = array("type" => "Doctor", "key" => "doctorid");
        $this->_belongtos["disease"] = array("type" => "Disease", "key" => "diseaseid");
        $this->_belongtos["xprovince"] = array("type" => "XProvince", "key" => "xprovinceid");
        $this->_belongtos["xcity"] = array("type" => "XCity", "key" => "xcityid");
        $this->_belongtos["xcounty"] = array("type" => "XCounty", "key" => "xcountyid");
    }

    // $row = array(); 
    // $row["doctorid"] = $doctorid;
    // $row["diseaseid"] = $diseaseid;
    // $row["op_hz"] = $op_hz;
    // $row["day_part"] = $day_part;
    // $row["op_type"] = $op_type;
    // $row["wday"] = $wday;
    // $row["op_date"] = $op_date;
    // $row["begin_hour_str"] = $begin_hour_str;
    // $row["end_hour_str"] = $end_hour_str;
    // $row["tip"] = $tip;
    // $row["maxcnt"] = $maxcnt;
    // $row["scheduletpl_mobile"] = $scheduletpl_mobile;
    // $row["scheduletpl_cost"] = $scheduletpl_cost;
    // $row["status"] = $status;
    // $row["xprovinceid"] = $xprovinceid;
    // $row["xcityid"] = $xcityid;
    // $row["xcountyid"] = $xcountyid;
    // $row["content"] = $content;
    public static function createByBiz($row) {
        DBC::requireNotEmpty($row, "ScheduleTpl::createByBiz row cannot empty");

        $default = array();
        $default["doctorid"] = 0;
        $default["diseaseid"] = 0;
        $default["op_hz"] = '';
        $default["day_part"] = '';
        $default["op_type"] = '0000-00-00';
        $default["wday"] = 0;
        $default["op_date"] = '';
        $default["begin_hour_str"] = '';
        $default["end_hour_str"] = '';
        $default["tip"] = '';
        $default["maxcnt"] = 0;
        $default["scheduletpl_mobile"] = '';
        $default["scheduletpl_cost"] = '';
        $default["status"] = 0;
        $default["xprovinceid"] = 0;
        $default["xcityid"] = 0;
        $default["xcountyid"] = 0;
        $default["content"] = '';

        $row += $default;
        return new self($row);
    }

    // ====================================
    // ------------ obj method ------------
    // ====================================
    public function toSelectListJsonArray() {
        $arr = [
            'id' => $this->id,
            'desc' => $this->toStr()
        ];

        return $arr;
    }

    public function toListJsonArray() {
        $arr = [
            'id' => $this->id,
            'diseaseid' => $this->diseaseid,
            'disease_name' => $this->diseaseid > 0 ? $this->disease->name : '全部疾病',
            'op_hz' => $this->op_hz,
            'op_hz_str' => $this->getOpHzStr(),
            'op_date' => $this->op_date == '0000-00-00' ? '' : $this->op_date,
            'wday' => $this->wday,
            'wday_str' => $this->getWDayStr(),
            'day_part' => $this->day_part,
            'day_part_str' => $this->getDayPartStr(),
            'op_type' => $this->op_type,
            'op_type_str' => $this->getOpTypeStr(),
            'status' => $this->status,
            'status_str' => $this->getStatusStr(),
            'maxcnt' => $this->maxcnt,
            'schedule_cnt' => $this->getScheduleCnt(),
            'revisitrecord_cnt' => 0,
            'address' => $this->getAddress(),
        ];

        return $arr;
    }

    public function toOneJsonArray() {
        $arr = [
            'id' => $this->id,
            'diseaseid' => $this->diseaseid,
            'disease_name' => $this->diseaseid > 0 ? $this->disease->name : '全部疾病',
            'op_hz' => $this->op_hz,
            'op_hz_str' => $this->getOpHzStr(),
            'op_date' => $this->op_date == '0000-00-00' ? '' : $this->op_date,
            'wday' => $this->wday,
            'wday_str' => $this->getWDayStr(),
            'day_part' => $this->day_part,
            'day_part_str' => $this->getDayPartStr(),
            'op_type' => $this->op_type,
            'op_type_str' => $this->getOpTypeStr(),
            'status' => $this->status,
            'status_str' => $this->getStatusStr(),
            'begin_hour_str' => $this->begin_hour_str,
            'end_hour_str' => $this->end_hour_str,
            'hour_str' => [$this->begin_hour_str, $this->end_hour_str],
            'tip' => $this->tip,
            'scheduletpl_mobile' => $this->scheduletpl_mobile,
            'scheduletpl_cost' => $this->scheduletpl_cost,
            'maxcnt' => $this->maxcnt,
            'schedule_cnt' => $this->getScheduleCnt(),
            'revisitrecord_cnt' => 0,
            'address' => [
                $this->xprovinceid,
                $this->xcityid,
                $this->xcountyid,
            ],
            'xprovinceid' => $this->xprovinceid,
            'xcityid' => $this->xcityid,
            'xcountyid' => $this->xcountyid,
            'content' => $this->content,
        ];

        return $arr;
    }

    public function getScheduleCnt() {
        $cond = " AND scheduletplid = :scheduletplid ";
        $bind[':scheduletplid'] = $this->id;
        return ScheduleDao::getCntByCond($cond, $bind);
    }

    public function isOnline() {
        return $this->status == 1 && false == $this->opdateIsPass();
    }

    // 临时出诊有用
    public function opdateIsPass() {
        if ($this->op_hz != 'temp') {
            return false;
        }

        $optime = strtotime($this->op_date);
        $todaytime = strtotime(date("Y-m-d"));

        return $optime < $todaytime;
    }

    // 获取简单格式 ：专家(每周)
    public function toSimpleStr() {
        $str = $this->getOpTypeStr() . "(" . $this->getOpHzStr() . ")";

        if ('temp' == $this->op_hz) {
            $str .= " " . $this->op_date;
        }

        if ($this->diseaseid > 0) {
            $str .= " ({$this->disease->name})";
        } else {
            $str .= " (全部疾病)";
        }

        return $str;
    }

    // 获取简单格式 ：每周周一上午 普通门诊
    public function toStr() {
        $str = $this->getOpHzStr();

        if ('temp' == $this->op_hz) {
            $str .= "({$this->op_date})";
        }

        $str .= " " . $this->getWDayStr();
//        $str .= " " . $this->getDayPartStr();
//        $str .= " " . $this->getOpTypeStr();
//        if ($this->diseaseid > 0) {
//            $str .= " ({$this->disease->name})";
//        } else {
//            $str .= " (全部疾病)";
//        }

        return $str;
    }

    public function getAddress() {
        if ($this->xprovinceid) {
            return $this->xprovince->name . $this->xcity->name . $this->xcounty->name . $this->content;
        } else {
            return $this->content;
        }
    }

    public function getOpHzStr() {
        return self::get_op_hzArray()[$this->op_hz];
    }

    public function getWDayStr() {
        return self::get_wdayArray()[$this->wday];
    }

    public function getDayPartStr() {
        return self::get_day_partArray()[$this->day_part];
    }

    public function getOpTypeStr() {
        return self::get_op_typeArray()[$this->op_type];
    }

    public function getBegin_hour_str_Str() {
        $begin_hour_str_Arr = json_decode($this->begin_hour_str, true);

        if (isset($begin_hour_str_Arr['begin']) || isset($begin_hour_str_Arr['end'])) {
            $result = isset($begin_hour_str_Arr['begin']) ? $begin_hour_str_Arr['begin'] : '';
            if (empty($result)) {
                $result = isset($begin_hour_str_Arr['end']) ? $begin_hour_str_Arr['end'] : '';
            } else {
                $result .= isset($begin_hour_str_Arr['end']) && $begin_hour_str_Arr['end'] != '' ? '-' . $begin_hour_str_Arr['end'] : '';
            }
            return $result;
        }

        $begin_hour_str_Arr[0] = $begin_hour_str_Arr[0] ? $begin_hour_str_Arr[0] : '';
        $begin_hour_str_Arr[1] = $begin_hour_str_Arr[1] ? $begin_hour_str_Arr[1] : '';

        if ($begin_hour_str_Arr[0] && $begin_hour_str_Arr[1]) {
            return $begin_hour_str_Arr[0] . "-" . $begin_hour_str_Arr[1];
        } else {
            $str = $begin_hour_str_Arr[0] == '' ? $begin_hour_str_Arr[1] : $begin_hour_str_Arr[0];

            return $str;
        }
    }

    // 获取门诊地址
    public function getScheduleAddressStr() {
        $four = [110000, 120000, 310000, 500000];
        if (in_array($this->xprovinceid, $four)) {
            $xprovince_name = $this->xprovince->name;
            $xcity_name = "";
        } else {
            $xprovince_name = $this->xprovince->name;
            $xcity_name = $this->xcity->name;
        }
        $xcounty_name = $this->xcounty->name;
        $content = $this->content;

        return "{$xprovince_name}{$xcity_name}{$xcounty_name}{$content}";
    }

    // =====================================
    // ----------- static method -----------
    // =====================================
    public static function get_op_hzArray() {
        $arr = array(
            'weekly' => '每周',
            'interval' => '隔周',
            'temp' => '临时');

        return $arr;
    }

    public static function get_wdayArray() {
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

    public static function get_day_partArray() {
        $arr = array(
            'am' => '上午',
            'pm' => '下午',
            'all_day' => '全天',
            'night' => '晚上');
        return $arr;
    }

    public static function get_op_typeArray() {
        $arr = array(
            'normal' => '普通',
            'expert' => '专家',
            'special' => '特需');
        return $arr;
    }
}
