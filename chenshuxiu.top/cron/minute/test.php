<?php
ini_set("arg_seperator.output", "&amp;");
ini_set("magic_quotes_gpc", 0);
ini_set("magic_quotes_sybase", 0);
ini_set("magic_quotes_runtime", 0);
ini_set('display_errors', 1);
ini_set("memory_limit", "2048M");
include_once (dirname(__FILE__) . "/../../sys/PathDefine.php");
include_once (ROOT_TOP_PATH . "/cron/Assembly.php");
mb_internal_encoding("UTF-8");

TheSystem::init(__FILE__);

class Test extends CronBase
{

    private $cnt = 0;

    // getRowForCronTab, 重载
    protected function getRowForCronTab () {
        $row = array();
        $row["type"] = CronTab::dbfix;
        $row["when"] = 'minute';
        $row["title"] = '每1钟, 抓取没有详情的wxusers';
        return $row;
    }

    // 是否记xworklog, 重载
    protected function needFlushXworklog () {
        return false;
    }

    // 是否记cronlog, 重载
    protected function needCronlog () {
        return $this->cnt > 3;
    }

    // 模板方法的实现, 重载
    public function doworkImp () {

        $unitofwork = BeanFinder::get("UnitOfWork");
        $auditor = Auditor::getById(1000);
        $auditor->remark = date('Y-m-d');
        $unitofwork->commitAndInit();

        echo "\n{$auditor->id}-{$auditor->version}: {$auditor->remark}";
    }

}

// //////////////////////////////////////////////////////

$process = new Test(__FILE__);
$cnt = $process->dowork();
