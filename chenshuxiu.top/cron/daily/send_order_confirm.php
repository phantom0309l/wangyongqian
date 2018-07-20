<?php
ini_set("arg_seperator.output", "&amp;");
ini_set("magic_quotes_gpc", 0);
ini_set("magic_quotes_sybase", 0);
ini_set("magic_quotes_runtime", 0);
ini_set('display_errors', 1);
ini_set("memory_limit", "2048M");
include_once(dirname(__FILE__) . "/../../sys/PathDefine.php");
include_once(ROOT_TOP_PATH . "/cron/Assembly.php");

mb_internal_encoding("UTF-8");

TheSystem::init(__FILE__);

// fhw address
class Send_order_confirm extends CronBase
{

    protected function getRowForCronTab() {
        $row = array();
        $row["type"] = CronTab::optask;
        $row["when"] = 'daily';
        $row["title"] = '每天, 10:00, 发送预约确认';
        return $row;
    }

    protected function needFlushXworklog() {
        return true;
    }

    protected function needCronlog() {
        return $this->cronlog_brief > 0;
    }

    protected function doworkImp() {
        $unitofwork = BeanFinder::get("UnitOfWork");

        $after_day = date('Y-m-d', time() + 86400 * Order::CONFIRM_AFTER_DAY);

        $sql = "SELECT a.* 
                FROM orders a
                WHERE 1 = 1
                AND thedate <= :thedate
                AND status = 1
                AND auditstatus = 1
                AND isclosed = 0
                AND patient_confirm_status = 0
                AND is_send_confirm = 0 ";

        $bind = [
            ':thedate' => $after_day
        ];

        $orders = Dao::loadEntityList('Order', $sql, $bind);

        $brief = 0;
        $logcontent = '';

        foreach ($orders as $order) {
            $mobile = $order->patient->mobile;
            $logcontent .= "\n{$order->id}, {$mobile}";

            $day = date('m月d日', strtotime($order->thedate));
            $sina_url = "http://api.t.sina.com.cn/short_url/shorten.json";
            $data = [
                'source' => '3271760578',
                'url_long' => "http://wx.chenshuxiu.top/order/one?orderid={$order->id}",
            ];
            $result = FUtil::curlPost($sina_url, http_build_query($data), 5);
            if (!empty($result)) {
                $result = json_decode($result, true);
                $short_url = $result[0]['url_short'];
                if (empty($short_url) || $short_url == '') {
                    $logcontent .= ', 未获取到短连接';
                    continue;
                }
                $content = "【王永前工作室】您预约的王永前主任{$day}门诊手术，现跟您核对是否能够如期前来，请点击{$short_url}进行确认";
                ShortMsg::sendManDaoTemplateSMS_j4now($mobile, $content);
                $logcontent .= ", " . $content;

                $order->is_send_confirm = 1;
            } else {
                $logcontent .= ', 未获取到短连接';
                continue;
            }

            $brief++;
        }

        $this->cronlog_brief = $brief;
        $this->cronlog_content = $logcontent;

        echo "{$this->cronlog_brief} {$this->cronlog_content} \n";

        $unitofwork->commitAndInit();
    }
}

$test = new Send_order_confirm(__FILE__);
$test->dowork();
