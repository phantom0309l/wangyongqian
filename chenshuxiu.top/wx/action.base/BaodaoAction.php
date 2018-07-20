<?php

class BaodaoAction extends WxAuthBaseAction
{
    public function doLogin() {
        $redirect_url = XRequest::getValue("redirect_url", 'http://wx.chenshuxiu.top/schedule/list');
        $redirect_url = urldecode($redirect_url);
        // 已经报到
        if ($this->mypatient instanceof Patient) {
            UrlFor::jump302($redirect_url);
        }

        XContext::setValue('redirect_url', $redirect_url);
        return self::SUCCESS;
    }

    public function doLoginPost() {
        $mobile = XRequest::getValue("mobile", '');
        $password = XRequest::getValue("password", '');

        $patient = PatientDao::getByMobile($mobile);
        if (false == $patient instanceof Patient) {
            $this->returnError('手机号不存在');
            return self::TEXTJSON;
        }

        if ($patient->password != $password) {
            $this->returnError('密码错误');
            return self::TEXTJSON;
        }

        $this->setMyUserIdCookie($patient->id);

        return self::TEXTJSON;
    }

    // 报到页
    public function doBaodao() {
        $redirect_url = XRequest::getValue("redirect_url", 'http://wx.chenshuxiu.top/schedule/list');
        $redirect_url = urldecode($redirect_url);
        $doctor = Doctor::getById(Doctor::WYQ);

        // 已经报到
        if ($this->mypatient instanceof Patient) {
            UrlFor::jump302($redirect_url);
        }

        XContext::setValue('doctor', $doctor);
        XContext::setValue('redirect_url', $redirect_url);
        return self::SUCCESS;
    }

    // 报到页,提交
    public function doAddPost() {
        $doctorid = XRequest::getValue("doctorid", 0);
        $name = XRequest::getValue("name", '');
        $sex = XRequest::getValue("sex", 0);
        $birthday = XRequest::getValue("birthday", '');
        $mobile = XRequest::getValue("mobile", '');
//        $email = XRequest::getValue("email", '');
//        $code = XRequest::getValue("code", '');
        $password = XRequest::getValue("password", '');

        $doctor = Doctor::getById($doctorid);
        if (false == $doctor instanceof Doctor) {
            $this->returnError('请输入选择医生');
            return self::TEXTJSON;
        }

        if ($name == "") {
            $this->returnError('请输入姓名');
            return self::TEXTJSON;
        }

        // 防止重复提交
        $patient = PatientDao::getByMobile($mobile);
        if ($patient instanceof Patient) {
            $this->returnError('该手机号已被使用');
            return self::TEXTJSON;
        }

//        $emailcode = EmailCodeDao::getLastOneByEmail($email);
//        if (false == $emailcode instanceof EmailCode || !$emailcode->auth($code)) {
//            $this->returnError('验证码错误');
//            return self::TEXTJSON;
//        }

        // 创建患者
        $row = array();
        $row["doctorid"] = $doctorid;
        $row["first_doctorid"] = $doctorid;
        $row["name"] = $name;
        $row["sex"] = $sex;
        $row["birthday"] = $birthday;
        $row["mobile"] = $mobile;
//        $row["email"] = $email;
        $row["password"] = $password;
        $row["auditstatus"] = 1;
        $row["auditremark"] = '系统自动审核通过';
        $row["status"] = 1;
        $this->mypatient = $mypatient = Patient::createByBiz($row);

        Pipe::createByEntity($mypatient, "baodao");

        $this->setMyUserIdCookie($this->mypatient->id);

        // 根据业务进行跳转
        return self::TEXTJSON;
    }

}
