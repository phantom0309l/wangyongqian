<?php
/**
 * Created by PhpStorm.
 * User: hades
 * Date: 2018/6/23
 * Time: 17:11
 */

class LoginMgrAction extends BaseAction
{
    public function doIsLogin() {
        return self::TEXTJSON;
        $myauditorid = XCookie::get("_myauditorid_");
        if ($myauditorid > 0) {
            $myauditor = Auditor::getById($myauditorid);
            if (false == $myauditor instanceof Auditor) {
                $this->returnError('未登录，请先登录');
            }
        } else {
            $this->returnError('未登录，请先登录');
        }

        return self::TEXTJSON;
    }

    public function doLoginPost() {
        $username = XRequest::getValue('username', '');
        $password = $pwd = XRequest::getValue('password', '');

        $myauditor = AuditorDao::getByUsername($username);

        if (false == $myauditor instanceof Auditor) {
            $this->returnError('用户不存在');
        }

        if ($myauditor->login_fail_cnt > 20) {
            $this->returnError('账号被锁定');
        }

        if (false == $myauditor->validatePassword($password)) {
            $myauditor->login_fail_cnt += 1;
            $this->returnError('密码错误');
        }

        // 设置登录cookie
        $this->setMyUserIdCookie($myauditor->id);

        $myauditor->last_login_time = date('Y-m-d H:i:s');
        $myauditor->login_fail_cnt = 0;

        $this->result['data'] = [
            'name' => $myauditor->name
        ];
        return self::TEXTJSON;
    }
}