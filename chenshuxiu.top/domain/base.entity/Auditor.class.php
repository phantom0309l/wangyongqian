<?php

/*
 * Auditor
 */
class Auditor extends Entity
{

    protected function init_keys () {
        $this->_keys = self::getKeysDefine();
    }

    public static function getKeysDefine () {
        return array(
            'username'    //用户名，可空
        ,'password'    //密码
        ,'mobile'    //
        ,'name'    //
        ,'type'    //类型，1.医生，2医生助理
        ,'status'    //
        ,'can_send_msg'    //是否能够发消息
        ,'remark'    //
        ,'login_fail_cnt'    //失败登陆次数
        ,'last_login_time'    //最后一次登陆时间
        ,'last_modifypassword_time'    //最后一次修改密码时间
        ,'sasdrowp'    //
            );
    }

    protected function init_keys_lock () {
        $this->_keys_lock = array();
    }

    protected function init_belongtos () {
        $this->_belongtos = array();
        
    $this->_belongtos["login_fail_c"] = array ("type" => "Login_fail_c", "key" => "login_fail_cnt" );
    }

    // $row = array(); 
    // $row["username"] = $username;
    // $row["password"] = $password;
    // $row["mobile"] = $mobile;
    // $row["name"] = $name;
    // $row["type"] = $type;
    // $row["status"] = $status;
    // $row["can_send_msg"] = $can_send_msg;
    // $row["remark"] = $remark;
    // $row["login_fail_cnt"] = $login_fail_cnt;
    // $row["last_login_time"] = $last_login_time;
    // $row["last_modifypassword_time"] = $last_modifypassword_time;
    // $row["sasdrowp"] = $sasdrowp;
    public static function createByBiz ($row) {
        DBC::requireNotEmpty($row, "Auditor::createByBiz row cannot empty");

        $default = array();
        $default["username"] = '';
        $default["password"] = '';
        $default["mobile"] = '';
        $default["name"] = '';
        $default["type"] =  0;
        $default["status"] =  0;
        $default["can_send_msg"] =  0;
        $default["remark"] = '';
        $default["login_fail_cnt"] =  0;
        $default["last_login_time"] = '';
        $default["last_modifypassword_time"] = '';
        $default["sasdrowp"] = '';

        $row += $default;
        return new self($row);
    }

    // ====================================
    // ------------ obj method ------------
    // ====================================

    // 验证密码
    public function validatePassword ($password) {
        $password = trim($password);
        if (empty($password)) {
            return false;
        }

        if ($this->password == $password) {
            return true;
        }

        $password = self::encryptPassword($password);

        if ($this->password == $password) {
            return true;
        }

        return false;
    }

    // ====================================
    // ----------- static method ----------
    // ====================================
    public static function encryptPassword ($password) {
        if (! empty($password)) {
            $password = md5("lkt_" . $password);
        }
        return $password;
    }
}
