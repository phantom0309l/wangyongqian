<?php

class BaodaoAction extends WxUserAuthBaseAction
{

    // 报到页
    public function doBaodao() {
        $wxshop = $this->wxshop;
        $wxuser = $this->wxuser;
        $doctor = Doctor::getById(Doctor::WYQ);

        // 已经报到
        if ($this->mypatient instanceof Patient) {
            UrlFor::jump302("/patient/registed?openid={$wxuser->openid}");
        }

        Debug::trace("+++++++++++ wxshopid:{$wxshop->id} doctorid:{$doctor->id}");

        XContext::setValue('doctor', $doctor);
        return self::SUCCESS;
    }

    // 选择医生
    public function doSelectDoctorJson() {
        $wxuser = $this->wxuser;
        $doctorid = XRequest::getValue("doctorid", 0);

        // 修正 doctorid
        $doctor = Doctor::getById($doctorid);
        if ($doctor instanceof Doctor && $doctor->hasPdoctor()) {
            $doctorid = $doctor->pdoctorid;
        }
        $wxuser->doctorid = $doctorid;

        echo "ok";
        return self::BLANK;
    }

    // 报到页,提交
    public function doAddPost() {
        $wxuser = $this->wxuser;

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

        $doctor = Doctor::getById($doctorid);
        if (false == $doctor instanceof Doctor) {
            XContext::setJumpPath("/baodao/baodao");
            return self::BLANK;
        }

        if ($name == "") {
            XContext::setJumpPath("/baodao/baodao");
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

        Pipe::createByEntity($mypatient, "baodao", $wxuser->id);

        // 修正 wxuser->patientid, 加强修正
        $wxuser->fixPatientId($mypatient->id);

        // 根据业务进行跳转
        $this->setJumpPathAfterBaodao();
        return self::BLANK;
    }

    private function setJumpPathAfterBaodao() {
        XContext::setJumpPath('/patient/one');
    }
}
