<?php

/*
 * 非adhd的服务号基类
 */
class WxGateBaseAction extends BaseAction
{

    protected $wxshop = null;

    protected $wxuser = null;

    protected $myuser = null;

    protected $mypatient = null;

    protected $mypcard = null;

    protected $MsgId = null;

    protected $MsgType = null;

    protected $FromUserName = null;

    protected $ToUserName = null;

    protected $Event = null;

    protected $EventKey = null;

    protected $response_content = "";

    protected $response_wxMsgBase4wxs = array();

    protected $media_id = null;

    public function __construct () {
        parent::__construct();

        // 放弃版本号的检查
        Config::setConfig("update_need_check_version", false);
    }

    // 检查签名
    protected function checkSignature () {
        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];

        $token = XContext::getValue('weixin_token');

        $tmpArr = array(
            $token,
            $timestamp,
            $nonce);
        sort($tmpArr, SORT_STRING);
        $tmpStr = implode($tmpArr);
        $tmpStr = sha1($tmpStr);
        return ($tmpStr == $signature) ? true : false;
    }

    // 对接微信的网关，多个公众号
    public function doGate () {
        // 验证是否是合法的微信请求
        // f (! $this->checkSignature ()) {
        // DBC::requireTrue ( false, '微信网关签名错误' );
        // return self::BLANK;
        //

        // 应对微信的第三方服务器归属验证
        if (isset($_GET['echostr']) && $_GET['echostr']) {
            echo $_GET["echostr"];
            return self::BLANK;
        }
        // 通常情况下对微信请求进行响应的部分
        $this->anaPostData();

        // 将向微信返回的内容包装为xml并echo (即向微信响应)
        $responseStr = $this->getResponseStr();
        echo $responseStr;
        return self::BLANK;
    }

    protected function getResponseStr () {
        // 将向微信返回的内容包装为xml并echo (即向微信响应)
        $responseStr = '';
        if (count($this->response_wxMsgBase4wxs) > 0) {
            $responseStr = WxApi::xiangyingNewsMsg($this->ToUserName, $this->FromUserName, $this->response_wxMsgBase4wxs);
        } elseif (! empty($this->media_id)) {
            $responseStr = WxApi::xiangyingImageMsg($this->ToUserName, $this->FromUserName, $this->media_id);
        } elseif ($this->response_content) {
            $responseStr = WxApi::xiangyingTextMsg($this->ToUserName, $this->FromUserName, $this->response_content);
        }

        Debug::trace($responseStr);
        return $responseStr;
    }

    protected function anaPostData () {
        $xmlobj = $this->getXmlobj();

        // ---- 将xml对象的字段转为函数内局部变量 ----
        $MsgId = $this->MsgId = $xmlobj->MsgId;
        $MsgType = $this->MsgType = $xmlobj->MsgType;
        $FromUserName = $this->FromUserName = $xmlobj->FromUserName;
        $ToUserName = $this->ToUserName = trim($xmlobj->ToUserName);
        $Event = $this->Event = strtolower($xmlobj->Event); // 纯小写
        $EventKey = $this->EventKey = trim($xmlobj->EventKey ? $xmlobj->EventKey : $xmlobj->Content);

        // --------------------------------------------

        // ---- 用户所关注的公众号的wxshop对象 ----
        $openid = $FromUserName;
        $this->wxshop = WxShopDao::getByGh($ToUserName);
        $wxshop = $this->wxshop; // 子类必须于构造函数中对此变量赋值

        // --------------------------------------------

        // 获取或创建该用户的wxuser
        $this->wxuser = $wxuser = WxUser::getOrCreateByOpenid($openid, $this->wxshop->id, $EventKey);

        // 如果wxuser中有存在的user则获取
        $this->myuser = $myuser = $wxuser->user;

        $mypatient = null;
        // 如果myuser存在,则尝试获取patient
        if ($myuser instanceof User) {
            $this->mypatient = $mypatient = $myuser->patient;
        }

        // 如果mypatient存在,则尝试获取pcard
        if ($mypatient instanceof Patient) {
            // 20170419 TODO by sjp : 只能取最新扫码的pcard
            $this->mypcard = $mypcard = $mypatient->getOnePcardByWxshopid($this->wxshop->id);
        }

        // ---- 针对消息的类型做不同的处理 ----
        $this->response_content = ""; // 向微信所返回的xml所封装的核心内容

        if (WxApi::isCommonMsg($MsgType)) {
            $commonmsg = WxApi::insertCommonMsg($xmlobj);
            // 入流
            $pipe = Pipe::createByEntity($commonmsg, 'create', $wxuser->id);

            // 患者对象
            $patient = $commonmsg->patient;

            if ($patient instanceof Patient) {

                // #5655 肿瘤组, 开通开药门诊, 加入 商业组
                if ($patient->getDiseaseGroup()->name == '肿瘤组' && $patient->doctor->menzhen_offset_daycnt > 0) {

                    // 患者入商业组
                    $patientgroup_biz = PatientGroupDao::getByTitle('商业组');

                    // 图片消息
                    if ($commonmsg instanceof WxPicMsg) {
                        $mypatient->patientgroupid = $patientgroup_biz->id ?? 0;
                    }

                    // 文本消息
                    if ($commonmsg instanceof WxTxtMsg) {
                        // #6120 去掉 血常规、升白
                        $pattern = "/(白细胞|血小板|溃疡|恶心|吐)/";
                        if (preg_match($pattern, $commonmsg->content, $matches) > 0) {
                            $mypatient->patientgroupid = $patientgroup_biz->id ?? 0;
                        }
                    }
                }

                // 患者身上是否还有未关闭的快速通行证任务（就算快速通行证服务过期了，也要等这条任务处理完了，才算失效）
                $optask = OpTaskDao::getOneByPatientUnicode($patient, 'PatientMsg:quickpass_msg');
                if ($optask instanceof OpTask || $patient->has_valid_quickpass_service()) {
                    QuickPassService::patientReply($patient, $wxuser, $pipe);
                } else {
                    // 生成消息任务
                    // 生成任务: 患者消息, 同一个患者只保留一个未关闭消息任务
                    $optasks = OpTaskDao::getListByPatientUnicodeStatus($patient, 'PatientMsg:message', 0);
                    if (count($optasks) < 1) {
                        $arr = [];
                        $arr['pipeid'] = $pipe->id;
                        // #5648 不论是否支付成功，只要有过下单行为，消息的级别，均调整到L3级别
                        if ($patient->getDiseaseGroup()->id == 3 && $patient->hadBuyForCancer()) {
                            $arr['level'] = 3;
                            $arr['level_remark'] = '#5648 肿瘤 不论是否支付成功，只要有过下单行为，消息的级别，均调整到L3级别';
                        }

                        // 精确到时分秒
                        $plantime = date('Y-m-d H:i:s');
                        $optask = OpTaskService::createWxUserOpTask($wxuser, 'PatientMsg:message', $patient, $plantime, 0, $arr);

                        // if ($this->isWorkTime() &&
                        // Disease::isCancer($patient->diseaseid)) {
                        // /*
                        // #5658 一个消息任务，发一次排队信息 暂时不上
                        // * */
                        // $cancer_diseaseidstr =
                        // Disease::getCancerDiseaseidsStr();
                        // $sql = "select count(*) from optasks where diseaseid
                        // in ({$cancer_diseaseidstr}) and status in (0, 2) and
                        // optasktplid = 123261855 ";
                        // $cancer_not_close_optask_cnt = Dao::queryValue($sql);
                        // $is_vip = $patient->has_valid_quickpass_service(); //
                        // 等待快速通行证 #5767 完成之后，修改 tody by fhw
                        // if ($cancer_not_close_optask_cnt > 0) {
                        // if ($is_vip) {
                        // $content =
                        // "你好，目前有{$cancer_not_close_optask_cnt}人正在排队咨询等待回复，由于你开通了“快速通行证”服务，已为你联系医生助理优先处理。";
                        // } else {
                        // $content =
                        // "你好，目前有{$cancer_not_close_optask_cnt}人正在排队咨询等待回复，医生助理会尽快回复你，请耐心等待。";
                        // }
                        //
                        // PushMsgService::sendTxtMsgToWxUserBySystem($wxuser,
                        // $content);
                        // }
                        // }
                    } else {
                        $optask = array_shift($optasks);
                    }
                }

                // 方寸儿童管理服务平台 生成pipelevel
                if (1 == $wxshop->id && $commonmsg instanceof WxTxtMsg) {
                    if ($pipe->canCreatePipeLevel()) {
                        $arr = [];
                        $arr['pipeid'] = $pipe->id;
                        $arr['optaskid'] = $optask instanceof OpTask ? $optask->id : 0;
                        PipeLevel::createByBiz($arr);
                    }
                }
            }

            // 获取并整理向运营的微信发送通知消息
            $msg_content = WxApi::getContent4OpsAlarm($xmlobj);
            $msg_content .= "\n\n[{$mypatient->name}, {$wxuser->nickname} , {$mypcard->doctor->name}]";

            $remark = "";
            if ($mypatient instanceof Patient) {
                $pcard = $mypatient->getMasterPcard();
                $pcard->has_update = 1;
                $remark = Config::getConfig("audit_uri") . "/patientmgr/list?wxpatientid={$mypatient->id}";
            }

            // TODO 加入所属医生
            $appendarr = array(
                "objtype" => get_class($commonmsg),
                "objid" => $commonmsg->id,
                "remark" => $remark);
            PushMsgService::sendMsgToAuditorBySystem('commonmsg', $this->wxshop->id, $msg_content, $appendarr);
            // 写入向用户回应内容
            $this->response_content = $this->getCommonResponseContent();

            // 如果患者没报到，发送消息
            if ($wxuser->user->patientid == 0) {
                $wx_uri = Config::getConfig("wx_uri");

                $content = "您还没有提交个人信息，无法与{$wxuser->doctor->name}医生团队交流。";
                $content .= "\n\n<a href=\"{$wx_uri}/baodao/baodao?openid={$wxuser->openid}\">>点击这里提交个人信息</a>";

                $this->response_content = $content;
            }

            if ($commonmsg instanceof WxTxtMsg) {
                $txt = $commonmsg->content;

                // 可重载的钩子调用
                $this->handleTxtSendByWxuser($txt);

                // 员工绑定
                $str2 = strtolower($txt);
                if (0 === strpos($str2, 'binda:')) {
                    $this->bindAuditor($str2);
                }
            }

            // #5212
            // 患者发消息时，唤醒所有的挂起任务（包含关联了【定时消息】的任务）。如果任务关联了【定时消息】且并未发送，则将【定时消息】的状态改为手动发送。
            $optasks = [];
            if ($mypatient instanceof Patient) {
                $optasks = OpTaskDao::getListByPaitentStatus($mypatient, 2);
            }

            foreach ($optasks as $optask) {
                OpTaskStatusService::changeStatus($optask, 0);
            }

            $unsent_list = Plan_txtMsgDao::getTodayUnsentListByPatientid($patient->id);
            foreach ($unsent_list as $plantxtmsg) {
                $plantxtmsg->type = 2;
            }

            // #5636 取消失访标记
            if ($mypatient instanceof Patient) {
                $mypatient->cancelLose();
            }
        } else {

            // 根据$Event的值执行对应的函数应对微信请求
            $procname = "dueto_{$Event}"; // ex: scan :-> dueto_scan
            if (method_exists($this, $procname)) {
                $this->$procname(); // x: $this->dueto_scan
            } else {
                // TODO
            }
        }
        // ------------------------------------
    }

    protected function getXmlobj () {
        // 所有的参数数据被微信以xml格式封装于请求的body中, 故以此函数取出body中的xml对象
        $xmlobj = FUtil::bodyXMLToObj();
        return $xmlobj;
    }

    protected function handleTxtSendByWxuser ($txt) {
        if ($txt == 'QXBD') {
            $myuser = $this->myuser;
            if ($myuser instanceof User) {
                if ($myuser->isAuditor()) {
                    $myuser->fixPatientId(0);
                }
            }
        }
    }

    // 员工绑定
    protected function bindAuditor ($txt) {

        // 检查格式
        list ($cmd, $username, $mobile) = explode(':', $txt);
        if ($cmd != 'binda' || empty($username) || empty($mobile)) {
            $this->response_content = '格式错误';
            return;
        }

        // 非员工user, 不绑定
        $user = UserDao::getByUsername($username);
        if (false == $user instanceof User || false == $user->isAuditor()) {
            $this->response_content = '非员工';
            return;
        }

        // 手机号错误
        if ($mobile != $user->mobile) {
            $this->response_content = '手机号错误';
            return;
        }

        // 目标员工已被他人绑定
        $wxusers = $user->getWxUsers();
        if (count($wxusers) > 0) {
            $this->response_content = '目标员工已被他人绑定';
            return;
        }

        // 你已绑定过员工
        $oldUser = $this->wxuser->user;
        if ($oldUser->isAuditor()) {
            $this->response_content = '你已绑定过员工';
            return;
        }

        $this->response_content = "员工已绑定[{$oldUser->id} => {$user->id}]";

        $wxusers = $oldUser->getWxUsers();
        foreach ($wxusers as $w) {
            $w->fixUserId($user->id);
        }

        $user->unionid = $oldUser->unionid;
        $user->createwxuserid = $oldUser->createwxuserid;
        $user->fixPatientId ($oldUser->patientid);

        if ($this->mypatient instanceof Patient) {
            $this->mypatient->createuserid = $user->id;
        }

        $oldUser->remove();

        $this->myuser = $user;
    }

    //
    // 针对具体消息类型的响应 (default)
    //

    // 关注
    protected function dueto_subscribe () {
        $wxuser = $this->wxuser;

        // 更改wxuser状态为关注
        $wxuser->modifySubscribeInfo();

        // 向微信服务器获取最新的用户资料并更新
        $wxuser->updateInfo_safe();

        // 找到user,没有则创建，代码不能往下挪，下方handleByQrcode逻辑(setWx_ref_code)会用到user
        $this->bindUser($wxuser);

        $mypatient = $this->mypatient;
        $mypcard = $this->mypcard;
        $doctor = $wxuser->doctor;

        if ($mypatient instanceof Patient) {
            $mypatient->subscribe_cnt ++;
            $mypatient->wxuser_cnt ++;

            $nowtime = date("Y-m-d H:i:s", time());
            $mypatient->auditremark .= "关注[wxuserid={$wxuser->id}][{$nowtime}]\n";

            if ($doctor instanceof Doctor) {
                $mypcard = $mypatient->getPcardByDoctorid($doctor->id);
            } else {
                // 20170419 TODO by sjp : 只能取最新扫码的pcard
                $mypcard = $mypatient->getOnePcardByWxshopid($this->wxshop->id);
            }

            if ($mypcard instanceof Pcard) {
                $this->mypcard = $mypcard;
            } else {
                $mypcard = $this->mypcard;
            }

            // #5636 取消失访标记
            $mypatient->cancelLose();

            // #5671 取消关注患者再关注生成消息任务
            if ($wxuser->unsubscribe_time != '0000-00-00 00:00:00' && Disease::isCancer($this->mypatient->diseaseid)) {
                $arr = [];
                $arr['content'] = '患者取消关注后再关注';
                OpTaskService::createWxUserOpTask($wxuser, 'PatientMsg:message', null, date('Y-m-d'), 1, $arr);
            }

            $this->moveGroup($wxuser, $mypatient->doctorid, $mypatient->doctorid);
        }

        // 判断是否为扫描关注,若是,则修正二维码
        $EventKey = $this->EventKey;
        if (substr($EventKey, 0, 8) == 'qrscene_') {
            $wx_ref_code = substr($EventKey, 8);
            if ($wx_ref_code) {
                $this->handleByQrcode($wx_ref_code);
            }
        }

        $pipe = Pipe::createByEntity($wxuser, "subscribe", $wxuser->id);

        if ($doctor instanceof Doctor) {
            $pipe->content = "扫{$doctor->name}医生二维码关注[{$doctor->id}]";
        }

        $this->response_content = $this->getSubscribeContent();

        $content = "[提醒] [微信用户 {$wxuser->nickname} wxuserid: {$wxuser->id} , 患者 {$mypatient->name} , 医生 {$mypcard->doctor->name} ] 关注了该公众号。";
        PushMsgService::sendMsgToAuditorBySystem('WxUser', $this->wxshop->id, $content);
    }

    // 取消关注
    protected function dueto_unsubscribe () {
        $wxuser = $this->wxuser;
        $mypatient = $this->mypatient;
        $mypcard = $this->mypcard;

        $wxuser->subscribe = 0;
        $wxuser->groupid = 0;
        $wxuser->unsubscribe_time = XDateTime::now();
        Pipe::createByEntity($wxuser, "unsubscribe", $wxuser->id);

        if ($mypatient instanceof Patient) {
            if ($mypatient->subscribe_cnt > 0) {
                $mypatient->subscribe_cnt --;
            }

            $nowtime = date("Y-m-d H:i:s", time());
            $mypatient->auditremark .= "取关[wxuserid={$wxuser->id}][{$nowtime}]\n";

            // 生成任务: 取消微信关注跟进
            OpTaskService::createWxUserOpTask($wxuser, 'unsubscribe:WxUser', $wxuser);
        }

        $patientname = ($mypatient instanceof Patient) ? $mypatient->name : "无患者";
        $content = "[提醒] [{$patientname} , {$wxuser->nickname} , {$mypcard->doctor->name}] 取消了关注。此患者还有{$mypatient->subscribe_cnt}个关注中的微信.";
        PushMsgService::sendMsgToAuditorBySystem('WxUser', $this->wxshop->id, $content);
    }

    private function bindUser ($wxuser) {
        // 1、先根据unionid寻找是否有user
        // 2、再根据unionid寻找是否有wxuser
        $unionid = $wxuser->unionid;
        $myuser = UserDao::getByUnionid($unionid);
        if (false == $myuser instanceof User) {
            $old_wxusers = WxUserDao::getListByUnionId($unionid);
            $old_wxuser = $old_wxusers[0];
            if ($old_wxuser instanceof WxUser) {
                $myuser = $old_wxuser->user;
            }
        }

        if (false == $myuser instanceof User) {
            $row = array(
                "createwxuserid" => $wxuser->id,
                "unionid" => $unionid,
                "name" => $wxuser->nickname);
            $myuser = User::createByBiz($row);
        }

        // 修正 wxuser->userid
        $wxuser->fixUserId($myuser->id);

        // 修正 wxuser->patientid
        $wxuser->fixPatientId($myuser->patientid);

        $this->myuser = $myuser;
        $this->mypatient = $this->myuser->patient;
    }

    // 可以重载
    protected function handleByQrcode ($wx_ref_code) {
        $wxuser = $this->wxuser;
        $wxuser->wx_ref_code = $wx_ref_code;

        // 尝试修正pcard, 有可能有新创建的pcard by sjp 20160729
        $mypcard = XContext::getValue("mypcard");
        if ($mypcard instanceof Pcard) {
            $this->mypcard = $mypcard;
        } else {
            $mypcard = $this->mypcard;
        }
    }

    // 扫码
    protected function dueto_SCAN () {
        $doctorid_old = 0; // 扫码前doctorid
        $doctorid_new = 0; // 扫码后doctorid

        $wxuser = $this->wxuser;
        $doctorid_old = $wxuser->doctor->id;

        $wx_ref_code = trim($this->EventKey);
        $wxuser->wx_ref_code = $wx_ref_code;
        $doctorid_new = $wxuser->doctor->id;

        // #5251 进入ALK项目流程
        if ($this->wxshop->id == 13 && $doctorid_new == 1591) {
            $wxuser->is_alk = 1;
        }

        // 尝试修正pcard, 有可能有新创建的pcard by sjp 20160729
        // 在wxuser setWx_ref_code 方法里，有patient时会重新设置mypcard值
        $mypcard = XContext::getValue("mypcard");
        if ($mypcard instanceof Pcard) {
            $this->mypcard = $mypcard;
            $diseaseid = $mypcard->diseaseid;

            if ($doctorid_old != $doctorid_new || $diseaseid == 0) {
                $this->response_content = $this->getScanContent();
            }
        }

        $pipe = Pipe::createByEntity($wxuser, "scan", $wxuser->id);
        $doctor = $wxuser->doctor;
        if ($doctor instanceof Doctor) {
            $pipe->content = "扫了{$doctor->name}医生二维码[{$doctor->id}]";

            $this->moveGroup($wxuser, $doctorid_old, $doctorid_new);
        }
        Debug::trace("=====[ scan ] [ {$wx_ref_code} ]=====");
    }

    // TODO
    protected function dueto_CLICK () {}

    protected function dueto_masssendjobfinish () {}

    protected function dueto_LOCATION () {}

    //
    // 响应部分函数 (default)
    //

    // 供子类覆写
    protected function getCommonResponseContent () {
        $str = '';

        switch ($this->wxshop->id) {
            case 12:
            case 13:
            case 14:
            case 15:
            case 19:
            case 21:
            case 23:
                $str = $this->getCommonResponseContentForNoWorkTime('010-60648881');
                break;
            default:
                break;
        }

        return $str;
    }

    // 非工作时间, 响应消息
    protected function getCommonResponseContentForNoWorkTime ($tel = '010-60648881') {
        $str = '';
        if (! $this->isWorkTime()) {
            $str = "您好！随访组工作时间为工作日的早上10:00至晚上19:00，节假日咨询将在工作时间统一回复。紧急情况可拨打随访组电话：{$tel}";
        }

        return $str;
    }

    /**
     * 是否为工作时间
     *
     * @return bool
     */
    private function isWorkTime () {
        $hour_mintue_int = date('Hi');
        $hour_mintue_int = intval($hour_mintue_int);

        $is_holiday = FUtil::isHoliday();
        // 2018-02-11 王宫瑜让改成了10:00-19:00
        if ($is_holiday || $hour_mintue_int > 1900 || $hour_mintue_int < 1000) {
            return false;
        }
        return true;
    }

    // 将返回消息内容注入关注响应
    protected function getSubscribeContent () {
        $wx_uri = Config::getConfig("wx_uri");
        $content = ($this->wxshop instanceof WxShop) ? "欢迎关注[{$this->wxshop->name}]服务平台,\n请点:<a href='{$wx_uri}/baodao/baodao?openid={$this->wxuser->openid}'>我要报到</a>，提交就诊信息，加入院外管理服务组。" : "";
        return $content;
    }

    // 将返回消息内容注入扫码响应
    protected function getScanContent () {
        $wx_uri = Config::getConfig("wx_uri");
        $content = ($this->wxshop instanceof WxShop) ? "欢迎关注[{$this->wxshop->name}]服务平台,\n请点:<a href='{$wx_uri}/pcard/selectDisease?openid={$this->wxuser->openid}'>完善信息</a>，以便接受更好的院外管理服务。" : "";
        return $content;
    }

    // 移动分组
    private function moveGroup(WxUser $wxuser, $doctorid_old, $doctorid_new) {
        // #4141，1207为李琳，19为Cancer院外管理, 101为李琳定制分组id
        $ll_groupid = 101;
        $ll_doctorid = 1207;
        if ($doctorid_new == $ll_doctorid && $this->wxshop->id == 19) {
            $errmsg = WxApi::batchTagging($this->wxshop, [
                $wxuser], $ll_groupid);
            if ($errmsg != 'ok') {
                Debug::warn("微信用户{$wxuser->id}扫码并打标签({$ll_groupid})失败");
            }
        } elseif ($doctorid_old == $ll_doctorid) { // 如果之前是李琳患者，后来变更了则取消特定分组
            $errmsg = WxApi::DeleteGroup($this->wxuser, $ll_groupid);
            if ($errmsg != 'ok') {
                Debug::warn("微信用户{$wxuser->id}扫码并取消标签({$ll_groupid})失败");
            }
        }

        // #4507，360为段明辉，10为MPN诊后管理，101为段明辉定制分组id
        $dmh_groupid = 101;
        $dmh_doctorid = 360;
        if ($doctorid_new == $dmh_doctorid && $this->wxshop->id == 10) {
            $errmsg = WxApi::batchTagging($this->wxshop, [
                $wxuser], $dmh_groupid);
            if ($errmsg != 'ok') {
                Debug::warn("微信用户{$wxuser->id}扫码并打标签({$dmh_groupid})失败");
            }
        } elseif ($doctorid_old == $dmh_doctorid) { // 如果之前是段明辉患者，后来变更了则取消特定分组
            $errmsg = WxApi::DeleteGroup($this->wxuser, $dmh_groupid);
            if ($errmsg != 'ok') {
                Debug::warn("微信用户{$wxuser->id}扫码并取消标签({$dmh_groupid})失败");
            }
        }

        // #6166 1895为水滴医生，19位方寸院外管理，109为水滴医生定制分组id
        $drip_groupid = 109;
        $drip_doctorid = 1895;
        if ($doctorid_new == $drip_doctorid && $this->wxshop->id == 19) {
            $errmsg = WxApi::batchTagging($this->wxshop, [$wxuser], $drip_groupid);
            if ($errmsg != 'ok') {
                Debug::warn("微信用户{$wxuser->id}扫码并打标签({$drip_groupid})失败");
            }
        } elseif ($doctorid_old == $drip_doctorid) { // 如果之前是水滴医生的患者，后来变更了则取消特定分组
            $errmsg = WxApi::DeleteGroup($this->wxuser, $drip_groupid);
            if ($errmsg != 'ok') {
                Debug::warn("微信用户{$wxuser->id}扫码并取消标签({$drip_groupid})失败");
            }
        }
    }
}
