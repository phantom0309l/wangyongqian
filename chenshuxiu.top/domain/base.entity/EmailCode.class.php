<?php

/*
 * EmailCode
 */

class EmailCode extends Entity
{

    protected function init_keys() {
        $this->_keys = self::getKeysDefine();
    }

    public static function getKeysDefine() {
        return array(
            'email'    //邮箱
        , 'expires_in'    //凭证有效时间，单位：秒
        , 'code'    //验证码
        );
    }

    protected function init_keys_lock() {
        $this->_keys_lock = array();
    }

    protected function init_belongtos() {
        $this->_belongtos = array();

    }

    // $row = array(); 
    // $row["email"] = $email;
    // $row["expires_in"] = $expires_in;
    // $row["code"] = $code;
    public static function createByBiz($row) {
        DBC::requireNotEmpty($row, "EmailCode::createByBiz row cannot empty");

        $default = array();
        $default["email"] = '';
        $default["expires_in"] = 0;
        $default["code"] = '';

        $row += $default;
        return new self($row);
    }

    // ====================================
    // ------------ obj method ------------
    // ====================================
    public function auth($code) {
        if ($this->code != $code) {
            return false;
        }

        $nowTime = time();
        if (($this->expires_in + 600) > $nowTime) {
            return true;
        } else {
            return false;
        }
    }
}
