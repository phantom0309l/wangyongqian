<?php

/*
 * WxUser
 */
class WxUser extends Entity
{

    protected function init_keys () {
        $this->_keys = self::getKeysDefine();
    }

    public static function getKeysDefine () {
        return array(
            'woy'    //week of year
        ,'doctorid'    //是医生就>0
        ,'patientid'    //是患者就>0
        ,'wxshopid'    //wxshopid
        ,'openid'    //用户的标识，对当前公众号唯一
        ,'unionid'    //只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段。
        ,'wx_ref_code'    //扫描的二维码
        ,'nickname'    //
        ,'sex'    //性别, 值为1时是男性，值为2时是女性，值为0时是未知 
        ,'language'    //
        ,'headimgurl'    //
        ,'headimgpictureid'    //headimgpictureid
        ,'subscribe'    //状态
        ,'subscribe_time'    //订阅时间
        ,'unsubscribe_time'    //退订时间
        ,'city'    //
        ,'province'    //
        ,'country'    //
        ,'groupid'    //用户所在的分组ID
        ,'remark'    //公众号备注
        ,'lastpipe_createtime'    //最后一次用户行为时间
        ,'last_login_time'    //上次登录时间
        ,'last_activity_time'    //上次活跃时间
        ,'ref_pcode'    //来源pcode
        ,'ref_objtype'    //来源objtype
        ,'ref_objid'    //来源objid
        ,'is_ops'    //运营监控消息是否推送
            );
    }

    protected function init_keys_lock () {
        $this->_keys_lock = array(
            'doctorid' ,'patientid' ,'wxshopid' ,'headimgpictureid' ,'ref_objid' ,);
    }

    protected function init_belongtos () {
        $this->_belongtos = array();
        
    $this->_belongtos["doctor"] = array ("type" => "Doctor", "key" => "doctorid" );
    $this->_belongtos["patient"] = array ("type" => "Patient", "key" => "patientid" );
    $this->_belongtos["wxshop"] = array ("type" => "WxShop", "key" => "wxshopid" );
    $this->_belongtos["headimgpicture"] = array ("type" => "Picture", "key" => "headimgpictureid" );
    $this->_belongtos["ref_obj"] = array ("type" => "Ref_obj", "key" => "ref_objid" );
    }

    // $row = array(); 
    // $row["woy"] = $woy;
    // $row["doctorid"] = $doctorid;
    // $row["patientid"] = $patientid;
    // $row["wxshopid"] = $wxshopid;
    // $row["openid"] = $openid;
    // $row["unionid"] = $unionid;
    // $row["wx_ref_code"] = $wx_ref_code;
    // $row["nickname"] = $nickname;
    // $row["sex"] = $sex;
    // $row["language"] = $language;
    // $row["headimgurl"] = $headimgurl;
    // $row["headimgpictureid"] = $headimgpictureid;
    // $row["subscribe"] = $subscribe;
    // $row["subscribe_time"] = $subscribe_time;
    // $row["unsubscribe_time"] = $unsubscribe_time;
    // $row["city"] = $city;
    // $row["province"] = $province;
    // $row["country"] = $country;
    // $row["groupid"] = $groupid;
    // $row["remark"] = $remark;
    // $row["lastpipe_createtime"] = $lastpipe_createtime;
    // $row["last_login_time"] = $last_login_time;
    // $row["last_activity_time"] = $last_activity_time;
    // $row["ref_pcode"] = $ref_pcode;
    // $row["ref_objtype"] = $ref_objtype;
    // $row["ref_objid"] = $ref_objid;
    // $row["is_ops"] = $is_ops;
    public static function createByBiz ($row) {
        DBC::requireNotEmpty($row, "WxUser::createByBiz row cannot empty");

        $default = array();
        $default["woy"] =  0;
        $default["doctorid"] =  0;
        $default["patientid"] =  0;
        $default["wxshopid"] =  0;
        $default["openid"] = '';
        $default["unionid"] = '';
        $default["wx_ref_code"] = '';
        $default["nickname"] = '';
        $default["sex"] =  0;
        $default["language"] = '';
        $default["headimgurl"] = '';
        $default["headimgpictureid"] =  0;
        $default["subscribe"] =  0;
        $default["subscribe_time"] = '';
        $default["unsubscribe_time"] = '';
        $default["city"] = '';
        $default["province"] = '';
        $default["country"] = '';
        $default["groupid"] = '';
        $default["remark"] = '';
        $default["lastpipe_createtime"] = '';
        $default["last_login_time"] = '';
        $default["last_activity_time"] = '';
        $default["ref_pcode"] = '';
        $default["ref_objtype"] = '';
        $default["ref_objid"] =  0;
        $default["is_ops"] =  0;

        $row += $default;
        return new self($row);
    }

    // ====================================
    // ------------ obj method ------------
    // ====================================

    // 修正 wxuser->patientid
    public function fixPatientId ($patientid) {
        if (empty($patientid)) {
            $patientid = 0;
        }
        $this->set4lock('patientid', $patientid);
    }

    // createByOpenid
    public static function getOrCreateByOpenid ($openid, $wxshopid = 1, $eventKey = "") {
        if (empty($openid)) {
            return null;
        }

        // 避免重复创建
        $wxuser = WxUserDao::getByOpenid($openid);
        if ($wxuser instanceof WxUser) {
            $wxuser->subscribe = 1;

            return $wxuser;
        }

        $row = array();
        $row["userid"] = 0;
        $row["patientid"] = 0;
        $row["wxshopid"] = $wxshopid;
        $row["openid"] = $openid;
        $row["subscribe"] = 1;
        $row["subscribe_time"] = XDateTime::now();
        if ($eventKey && substr($eventKey, 0, 8) == 'qrscene_') {
            $wx_ref_code = substr($eventKey, 8);
            $doctor = DoctorDao::getByCode($wx_ref_code);
            if ($doctor instanceof Doctor) {
                $row['ref_pcode'] = 'DoctorCard';
                $row['ref_objtype'] = 'Doctor';
                $row['ref_objid'] = $doctor->id;
                $row['doctorid'] = $doctor->id;
            }
        }

        $wxuser = self::createByBiz($row);
        Pipe::createByEntity($wxuser, "create", $wxuser->id);

        return $wxuser;
    }
}
