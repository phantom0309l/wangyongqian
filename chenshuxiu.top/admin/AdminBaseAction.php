<?php

class AdminBaseAction extends BaseAction
{
    protected $myauditor = null;

    public function __construct() {
        parent::__construct();

        if (false == $this->myauditor instanceof Auditor) {
            // TODO: - 上线需修正
            $this->myauditor = Auditor::getById(1000);
//            $this->returnError('未登录，请先登录', 1001);
        }
    }

    // 保存登录
    protected function initMyUser() {
        $myauditor = null;

        // 登录判断2: 判断cookie设置 myauditor
        $myauditorid = $this->getCookieMyUserId();
        if ($myauditorid > 0) {
            $myauditor = Auditor::getById($myauditorid);
        }

        // 重新种cookie : _myuserid_
        if ($myauditor instanceof Auditor && $myauditorid != $myauditor->id) {
            $this->setMyUserIdCookie($myauditor->id);

            if ($myauditorid > 0) {
                Debug::warn("setMyUserIdCookie({$myauditorid} => {$myauditor->id} )");
            }
        }

        $this->myauditor = $myauditor;
        XContext::setValue("myauditor", $myauditor);
    }

}
