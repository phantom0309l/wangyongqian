<?php

class BaodaoAction extends WxAuthBaseAction
{

    // 报到页
    public function doBaodao() {
        $doctor = Doctor::getById(Doctor::WYQ);

        // 已经报到
        if ($this->mypatient instanceof Patient) {
            UrlFor::jump302("/patient/registed");
        }

        XContext::setValue('doctor', $doctor);
        return self::SUCCESS;
    }

    // 报到页,提交
    public function doAddPost() {
        // 防止重复提交
        if ($this->mypatient instanceof Patient) {
            $this->setJumpPathAfterBaodao();
            return self::BLANK;
        }

        $doctorid = XRequest::getValue("doctorid", 0);
        $name = XRequest::getValue("name", '');
        $sex = XRequest::getValue("sex", 0);
        $birthday = XRequest::getValue("birthday", '');
        $mobile = XRequest::getValue("mobile", '');
        $email = XRequest::getValue("email", '');
        $code = XRequest::getValue("code", '');

        $doctor = Doctor::getById($doctorid);
        if (false == $doctor instanceof Doctor) {
            XContext::setJumpPath("/baodao/baodao");
            return self::BLANK;
        }

        if ($name == "") {
            XContext::setJumpPath("/baodao/baodao");
            return self::BLANK;
        }

        $emailcode = EmailCodeDao::getOneByEmail($email);
        if (!$emailcode->auth($code)) {
            XContext::setJumpPath("/baodao/baodao?preMsg=验证码错误");
            return self::BLANK;
        }

        // 创建患者
        $row = array();
        $row["doctorid"] = $doctorid;
        $row["first_doctorid"] = $doctorid;
        $row["name"] = $name;
        $row["sex"] = $sex;
        $row["birthday"] = $birthday;
        $row["mobile"] = $mobile;
        $row["email"] = $email;
        $this->mypatient = $mypatient = Patient::createByBiz($row);

        Pipe::createByEntity($mypatient, "baodao");

        // 根据业务进行跳转
        $this->setJumpPathAfterBaodao();
        return self::BLANK;
    }

    private function setJumpPathAfterBaodao() {
        XContext::setJumpPath('/patient/one');
    }
}
