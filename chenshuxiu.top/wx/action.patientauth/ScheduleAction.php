<?php

class ScheduleAction extends PatientAuthBaseAction
{
    public function doList() {
        $mypatient = $this->mypatient;
        $doctor = $mypatient->doctor;
        if (false == $doctor instanceof Doctor) {
            XContext::setJumpPath("/error/error?e=请先扫描医生二维码");
            return self::BLANK;
        }

        // 看一下是否有患者主动预约的门诊
        $order_p = OrderDao::getLastOfPatient_Open($mypatient->id, $doctor->id, 'Patient');
        if ($order_p instanceof Order) {
            XContext::setJumpPath("/order/list");
            return self::BLANK;
        }

        XContext::setValue('doctor', $doctor);

        return self::SUCCESS;
    }

    public function doAjaxGetSchedules() {
        $mypatient = $this->mypatient;
        $doctor = $mypatient->doctor;

        if (false == $doctor instanceof Doctor) {
            $this->returnError('请先扫描医生二维码');
        }

        // 看一下是否有患者主动预约的门诊
        $order_p = OrderDao::getLastOfPatient_Open($mypatient->id, $doctor->id, 'Patient');
        if ($order_p instanceof Order) {
            $this->returnError('请不要重复预约');
        }

        $the_month = XRequest::getValue('the_month', date('Y-m'));
        if ($the_month < date('Y-m')) {
            $this->returnError('仅提供未来的门诊信息');
        }

        if ($the_month == date('Y-m')) { // 当月，从今天开始
            $fromdate = date('Y-m-d');
        } else { // 其他月，从1号开始
            $fromdate = $the_month . '-01';
        }

        $todate = date('Y-m-d', strtotime('-1 day', strtotime(date('Y-m-01', strtotime('+1 month', strtotime($fromdate))))));

        $schedules = ScheduleDao::getValidListByDoctorid($doctor->id, $fromdate, $todate);

        // 根据标签再筛一下可以展示的门诊
        $arr = [];
        foreach ($schedules as $schedule) {
            $scheduletpl = $schedule->scheduletpl;
            $thedate = $schedule->thedate;

            $idle_cnt = $schedule->getIdleCnt() ?? 0;

            $item = $arr[$thedate] ?? [];
            $item_idle_cnt = $item['item_idle_cnt'] ?? 0;
            $item_idle_cnt = $item_idle_cnt + $idle_cnt;
            $item['item_idle_cnt'] = $item_idle_cnt;

            if ($item_idle_cnt > 50) {
                $textColor = '#4472c5';
                $desc = '可约';
            } elseif ($item_idle_cnt < 1) {
                $textColor = '#ec536a';
                $desc = '已满';
            } else {
                $textColor = '#4472c5';
                $desc = '可约';
            }
            $item['textColor'] = $textColor;
            $item['desc'] = $desc;

            $detail = [];
            $detail['scheduleid'] = $schedule->id;
            $detail['thedate'] = $schedule->thedate;
            $detail['thedate'] = $schedule->thedate;
            $detail['idle_cnt'] = $idle_cnt;
            $detail['dow'] = $schedule->getDowStr();

            $daypartArr = Schedule::getDaypartArray();
            $detail['daypart'] = $daypartArr[$schedule->daypart];

            $tkttypeStr = $schedule->getTkttypeStr() ?? '';
            $detail['typestr'] = $tkttypeStr . '门诊';

            $detail['scheduletpl_mobile'] = $scheduletpl instanceof ScheduleTpl ? $scheduletpl->scheduletpl_mobile : '';

            $detail['scheduletpl_cost'] = $scheduletpl instanceof ScheduleTpl ? $scheduletpl->scheduletpl_cost . '元/人' : '';

            $detail['begin_hour_str'] = $scheduletpl instanceof ScheduleTpl ? $scheduletpl->getBegin_hour_str_Str() : '';

            if ($idle_cnt > 50) {
                $detail['idle_cnt_str'] = '可约';
            } elseif ($idle_cnt < 1) {
                $detail['idle_cnt_str'] = '已满';
            } else {
                $detail['idle_cnt_str'] = '余' . $idle_cnt . '个';
            }

            $detail['address'] = $scheduletpl instanceof ScheduleTpl ? $scheduletpl->getScheduleAddressStr() : '';

            $detail['tip'] = $scheduletpl->tip;

            $item['schedules'][] = $detail;

            $arr[$thedate] = $item;
        }

        $this->result['data'] = [
            'schedules' => $arr
        ];

        return self::TEXTJSON;
    }
}

?>
