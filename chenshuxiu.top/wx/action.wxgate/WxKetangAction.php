<?php

/*
 * 方寸课堂, 方寸儿童管理服务平台
 */
class WxKetangAction extends WxGateBaseAction
{

    public function __construct () {
        parent::__construct();
        $this->wxshop = WxShop::getById(3);
    }

    protected function dueto_subscribe () {
        parent::dueto_subscribe();

        $wxuser = $this->wxuser;

        $wx_uri = Config::getConfig("wx_uri");
        $img_uri = Config::getConfig("img_uri");

        $wx_ref_code = substr($this->EventKey, 8);
        Debug::trace("=====[ scan ] [{$wx_ref_code}]fckt_dueto_subscribe");
        if ($wx_ref_code == 'ADHD_6_qianying' || $wx_ref_code == 'adhd_6_yl') {
            $str = "方寸课堂管理员";
            $content = "您好，为了更好的帮助您进行后续课程和训练，请完善信息并完成后续评估。";
            $openid = $wxuser->openid;

            $first = array(
                "value" => "",
                "color" => "#ff6600");
            $keywords = array(
                array(
                    "value" => $str,
                    "color" => "#aaa"),
                array(
                    "value" => $content,
                    "color" => "#ff6600"));
            $content = WxTemplateService::createTemplateContent($first, $keywords);

            $url = "{$wx_uri}/ketang/ktadd?openid={$openid}";

            PushMsgService::sendTplMsgToWxUserBySystem($wxuser, "adminNotice", $content, $url);
        } else {

            $kt_title = "一个天下父母都认同的习惯，却超过60%的家长没做到！";
            $kt_img = $img_uri . "/static/img/wxtask/banner.png";
            $kt_content = "";
            $kt_url = "http://mp.weixin.qq.com/s?__biz=MzI3NjA3MjU4NA==&mid=416696157&idx=1&sn=e6aa795cd556e50caa0599d1cc1403d6";
            $this->response_wxMsgBase4wxs[] = new SimpleWxMsg($kt_title, $kt_img, $kt_content, $kt_url);
            $content = $this->getSubscribeContent();
            $pushmsg = PushMsgService::sendTxtMsgToWxUserBySystem($wxuser, $content);
        }
    }

    protected function getSubscribeContent () {

        $str = "亲爱的家长，你来的太晚了！\n
快来看看方寸课堂为你精心准备的提升小朋友注意力水平的必修课！\n
点击屏幕下方的【家长课堂】，选择【家长课堂】，家长们可以在这里进行行为训练课程! 选择【注意力游戏】，小朋友们可以进行认知训练游戏！感统训练正在筹备当中，敬请期待！";
        $content = ($this->wxshop instanceof WxShop) ? $str : "";
        return $content;
    }

    // 扫码
    protected function dueto_SCAN () {
        Debug::trace("=====[ scan ] [{$this->EventKey}]fckt_dueto_SCAN");
        $wxuser = $this->wxuser;

        $wx_ref_code = trim($this->EventKey);
        if ($wx_ref_code == 'QY_TEST' || $wx_ref_code == 'ADHD_6_qianying') {
            $wxuser->wx_ref_code = $wx_ref_code;
        }

        Pipe::createByEntity($wxuser, "scan", $wxuser->id);
        Debug::trace("=====[ scan ] [ $wx_ref_code ]=====");
    }

    protected function handleByQrcode ($wx_ref_code) {
        // 方寸课堂代言活动逻辑
        $wxuser = $this->wxuser;

        if ($wx_ref_code == 'QY_TEST' || $wx_ref_code == 'ADHD_6_qianying') {
            $wxuser->wx_ref_code = $wx_ref_code;
        }

        // 代言活动
        if (substr($wx_ref_code, 0, 3) == 'DY_') {
            $wxuser->ref_pcode = "Share[DY]";
            $wxuser->ref_objtype = "WxUser";
            $fromwxuserid = substr($wx_ref_code, 3);
            $wxuser->ref_objid = $fromwxuserid;

            $fromwxuser = WxUser::getById($fromwxuserid);
            $content = "用户『{$wxuser->nickname}』，通过您分享的二维码关注了『方寸课堂』";
            $pushmsg = PushMsgService::sendTxtMsgToWxUserBySystem($fromwxuser, $content);
        }

        // 21天睡前谈心计划
        if (substr($wx_ref_code, 0, 7) == 'WxTask_') {
            $wxuser->ref_pcode = "WxTask";
            $wxuser->ref_objtype = "WxUser";
            $fromwxuserid = substr($wx_ref_code, 7);
            $wxuser->ref_objid = $fromwxuserid;
        }

        // qq推广
        if (substr($wx_ref_code, 0, 3) == 'TG_') {
            $wxuser->ref_pcode = "Share[TG]";
            $wxuser->ref_objtype = "WxUser";
            $fromwxuserid = substr($wx_ref_code, 3);
            $wxuser->ref_objid = $fromwxuserid;

            $fromwxuser = WxUser::getById($fromwxuserid);
            $cnt = WxUserDao::getCntByRefobj3("Share[TG]", "WxUser", $fromwxuserid) + 1;
            $content = "用户『{$wxuser->nickname}』，通过您分享的二维码关注了『方寸课堂』,共{$cnt}人关注。";
            $pushmsg = PushMsgService::sendTxtMsgToWxUserBySystem($fromwxuser, $content);
        }
    }

    //
    // 针对具体消息类型的响应
    //

    // 关注
    /*
     * protected function dueto_subscribe () { }
     */

    // 取消关注
    protected function dueto_unsubscribe () {
        parent::dueto_unsubscribe();

        $wxuser = $this->wxuser;

        if ($wxuser->ref_pcode == "Share[TG]") {
            $fromwxuserid = $wxuser->ref_objid;
            $fromwxuser = WxUser::getById($fromwxuserid);

            if ($fromwxuser instanceof WxUser) {
                $cnt = WxUserDao::getCntByRefobj3("Share[TG]", "WxUser", $fromwxuserid) - 1;
                $content = "用户『{$wxuser->nickname}』，取消了关注, 共{$cnt}人关注。";
                $pushmsg = PushMsgService::sendTxtMsgToWxUserBySystem($fromwxuser, $content);
            }

        }
    }

    // 扫码
    /*
     * protected function dueto_scan () { }
     */

    protected function dueto_CLICK () {
        $eventkey = $this->EventKey;
        $wxuser = $this->wxuser;

        $this->response_wxMsgBase4wxs = array();

        $www_uri = Config::getConfig("www_uri");
        $wx_uri = Config::getConfig("wx_uri");
        $img_uri = Config::getConfig("img_uri");

        if ($eventkey == "KTTEST") {
            $kt_title = "给娃寻找『异父不同母』的亲兄妹！";
            $kt_img = "{$img_uri}/static/img/zhuanti/face/face.png";
            $kt_content = "";
            $kt_url = "{$wx_uri}/zhuanti/facefromwx?openid={$wxuser->openid}";
            $this->response_wxMsgBase4wxs[] = new SimpleWxMsg($kt_title, $kt_img, $kt_content, $kt_url);

            $kt_title = "我家小朋友是『多动症』吗？";
            $kt_img = "{$img_uri}/static/img/fckt/adhdtest.jpg";
            $kt_content = "";
            $kt_url = "{$wx_uri}/paper/ktscale?openid={$wxuser->openid}&ename=adhd_iv";
            $this->response_wxMsgBase4wxs[] = new SimpleWxMsg($kt_title, $kt_img, $kt_content, $kt_url);
            $kt_title = "你是『好妈妈』吗？";
            $kt_img = "{$img_uri}/static/img/hmm_07.png";
            $kt_content = "";
            $kt_url = "{$www_uri}/zhuanti/haomama";
            $this->response_wxMsgBase4wxs[] = new SimpleWxMsg($kt_title, $kt_img, $kt_content, $kt_url);
        }
        if ($eventkey == "SHORTLESSON") {

            $kt_title = "细数七零八零后父母和孩子沟通的大坑(二)";
            $kt_img = "{$img_uri}/static/img/sfbt/sfbt07.jpg";
            $kt_content = "";
            $kt_url = "{$wx_uri}/sfbt/one?lessonid=102140531&openid={$wxuser->openid}";
            $this->response_wxMsgBase4wxs[] = new SimpleWxMsg($kt_title, $kt_img, $kt_content, $kt_url);

            $kt_title = "细数七零八零后父母和孩子沟通的大坑(一)";
            $kt_img = "{$img_uri}/static/img/sfbt/sfbt06.jpg";
            $kt_content = "";
            $kt_url = "{$wx_uri}/sfbt/one?lessonid=102137825&openid={$wxuser->openid}";
            $this->response_wxMsgBase4wxs[] = new SimpleWxMsg($kt_title, $kt_img, $kt_content, $kt_url);

            $kt_title = "据说看过这篇文章后，90%家长都会和孩子谈心了";
            $kt_img = "{$img_uri}/static/img/sfbt/sfbt05.jpg";
            $kt_content = "";
            $kt_url = "{$wx_uri}/sfbt/one?lessonid=102040509&openid={$wxuser->openid}";
            $this->response_wxMsgBase4wxs[] = new SimpleWxMsg($kt_title, $kt_img, $kt_content, $kt_url);

            $kt_title = "让“熊孩子”不再“熊”，so easy！";
            $kt_img = "{$img_uri}/static/img/sfbt/sfbt04.jpg";
            $kt_content = "";
            $kt_url = "{$wx_uri}/sfbt/one?lessonid=101939993&openid={$wxuser->openid}";
            $this->response_wxMsgBase4wxs[] = new SimpleWxMsg($kt_title, $kt_img, $kt_content, $kt_url);

            $kt_title = "孩子对着干，家长该咋办？";
            $kt_img = "{$img_uri}/static/img/sfbt/sfbt03.jpg";
            $kt_content = "";
            $kt_url = "{$wx_uri}/sfbt/one?lessonid=101853357&openid={$wxuser->openid}";
            $this->response_wxMsgBase4wxs[] = new SimpleWxMsg($kt_title, $kt_img, $kt_content, $kt_url);

            $kt_title = "孩子“知错了”，作为家长我们应如何对待？";
            $kt_img = "{$img_uri}/static/img/sfbt/sfbt01.jpg";
            $kt_content = "";
            $kt_url = "{$wx_uri}/sfbt/one?lessonid=101818449&openid={$wxuser->openid}";
            $this->response_wxMsgBase4wxs[] = new SimpleWxMsg($kt_title, $kt_img, $kt_content, $kt_url);
        }
    }

    protected function fetchHeadimg () {
        $wxuser = $this->wxuser;

        if ($wxuser->headimgpictureid == 0) {
            fastcgi_finish_request();
            $wxuser->fetchHeadImgPicture();
        }
    }

    protected function handleTxtSendByWxuser ($txt) {
        parent::handleTxtSendByWxuser($txt);

        $wxshop = $this->wxshop;
        $wxuser = $this->wxuser;

        $access_token = $wxshop->getAccessToken();

        $www_uri = Config::getConfig("www_uri");
        $wx_uri = Config::getConfig("wx_uri");
        $img_uri = Config::getConfig("img_uri");

        // 方寸课堂账号，回复『好妈妈』查看问题答案
        if ($txt == '好妈妈') {
            $this->response_wxMsgBase4wxs = array();
            $kt_title = "好妈妈测试答案";
            $kt_img = "{$img_uri}/static/img/hmm_07.png";
            $kt_content = "您也可以加入我们的优质课程，与孩子一起成长；在这里你会得到我们专业人员的指导，以及其它家长的课程经验分享！";
            $kt_url = "{$wx_uri}/zhuanti/haomamaAnswer";
            $this->response_wxMsgBase4wxs[] = new SimpleWxMsg($kt_title, $kt_img, $kt_content, $kt_url);
        }

        if ($txt == '食谱') {
            $this->response_wxMsgBase4wxs = array();
            $kt_title = "开胃食谱";
            $kt_img = "{$img_uri}/static/img/zhuanti/kw01.jpg";
            $kt_content = "";
            $kt_url = "{$wx_uri}/zhuanti/kaiwei";
            $this->response_wxMsgBase4wxs[] = new SimpleWxMsg($kt_title, $kt_img, $kt_content, $kt_url);
        }

        if ($txt == '睡前谈心') {

            $wxtask = WxTaskDao::getLastByEname($wxuser->id, "listen");
            $wxtaskitem = WxTaskItemDao::getLastSigned($wxtask->id);

            $wxtaskmedia = new WxTaskMedia();
            $mediaid = $wxtaskmedia->getMediaId($wxuser, $wxtaskitem, $access_token);

            $openid = $wxuser->openid;
            $errcode = WxApi::kefuImageMsg($wxshop, $openid, $mediaid);

            // 发患教文章
            $pos = $wxtaskitem->pos;
            $wxtaskarticle = new WxTaskArticle();
            $article = $wxtaskarticle->getArticlesByPos($wxuser, $pos);
            if (count($article) > 0) {
                WxApi::kefuNewsMsg($wxshop, $openid, $article);
            }
        }

        if ($txt == '结果') {
            $this->response_wxMsgBase4wxs = array();
            $kt_title = "『我为方寸课堂代言』排行榜";
            $kt_img = "{$img_uri}/static/img/zhuanti/dybg.png";
            $kt_content = "前5名，将会获得由方寸课堂送出的，提升小朋友注意力的丛书《I SPY 视觉大发现》一套。本次活动截止时间为：2016-3-3 24:00。";
            $kt_url = "{$wx_uri}/zhuanti/dylist";
            $this->response_wxMsgBase4wxs[] = new SimpleWxMsg($kt_title, $kt_img, $kt_content, $kt_url);
        }

        if ($txt == '推广') {
            $obj = $wxuser;
            $objcode = "Share[TG]";
            $imgprev = "TG";
            $wxmedia = new WxMedia();
            $qrcodepicture = $wxmedia->getQrCodePicture($wxuser, "Share[TG]", "TG_");
            $imgs = $this->getNeedImgs($qrcodepicture);
            $this->media_id = $wxmedia->getMediaId($obj, $access_token, $objcode, $imgprev, $imgs);

        }

        if ($txt == '代言') {
            // 断是否已有分享二维码
            $qr = WxQrcode::getByPcodeObj($wxshop->id, "Share[DY]", $wxuser);

            if (empty($qr)) {
                $scene_str = "DY_{$wxuser->id}";
                $row = array();
                $row["wxshopid"] = $wxshop->id;
                $row["action_name"] = "QR_LIMIT_STR_SCENE";
                $row["scene_str"] = $scene_str;
                $row["pcode"] = "Share[DY]";
                $row["objtype"] = get_class($wxuser);
                $row["objid"] = $wxuser->id;
                $qr = WxQrcode::createByBiz($row);

                $ticket = WxApi::getQrTicket($access_token, $scene_str);
                $qr->ticket = $ticket;
                $qr->url = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" . "{$ticket}";
                // 取生成的二维码图片
                $picture = Picture::createByFetchWX($qr->url);
                $qr->pictureid = $picture->id;

                $this->createFinalImg($wxuser, $picture);
            }

            $this->handleMediaId($wxuser, $access_token);

            $content = "这是一张属于你的代言卡，上面印着您的专属二维码，请将它分享到『朋友』或者『朋友圈』，使更多人扫描你的二维码关注方寸课堂，来赢取管理员送出的礼品吧。发送“结果”，随时查看当前排名，排行榜前五名，将会收到管理员送出的《I SPY 视觉大发现》一套。本次活动截止时间为：2016-3-3 24:00。";
            $pushmsg = PushMsgService::sendTxtMsgToWxUserBySystem($wxuser, $content);
        }
    }

    private function getNeedImgs ($picture) {
        // 接最终图
        $imgs = array(
            'dst' => ROOT_TOP_PATH . "/wwwroot/img/static/img/qrcode/tgbg.png",
            'src' => array(
                array(
                    "url" => "/home/xdata/xphoto/" . "{$picture->picname}" . ".{$picture->picext}",
                    "fw" => 302,
                    "fh" => 302,
                    "left" => 224,
                    "top" => 900)));
        return $imgs;
    }

    private function createFinalImg ($wxuser, $picture) {
        // 接最终图
        $imgs = array(
            'dst' => ROOT_TOP_PATH . "/wwwroot/img/static/img/qrcode/bgnew2.png",
            'src' => array(
                array(
                    "url" => "/home/xdata/xphoto/" . "{$picture->picname}" . ".{$picture->picext}",
                    "fw" => 268,
                    "fh" => 268,
                    "left" => 240,
                    "top" => 1032)));

        if ($wxuser->headimgpictureid > 0) {
            $headarr = array(
                "url" => "/home/xdata/xphoto/" . "{$wxuser->headimgpicture->picname}" . ".{$wxuser->headimgpicture->picext}",
                "fw" => 115,
                "fh" => 115,
                "left" => 534,
                "top" => 30);
            $imgs['src'][] = $headarr;
        }
        $this->mergeImg($imgs, $wxuser);
    }

    private function handleMediaId ($wxuser, $access_token) {
        $media = MediaDao::getOneByObj3("WxUser", $wxuser->id, "Share[DY]");
        if ($media instanceof Media) {
            $now = time();
            $created_at = $media->created_at;
            if ($now - $created_at < 259000) {
                $this->media_id = $media->media_id;
            } else {
                $mediajson = $this->getMediaReturnJson($access_token);
                if (empty($mediajson['errcode'])) {
                    $this->media_id = $mediajson['media_id'];
                    $media->media_id = $mediajson['media_id'];
                    $media->media_type = $mediajson['type'];
                    $media->created_at = $mediajson['created_at'];
                }
            }
        } else {
            $mediajson = $this->getMediaReturnJson($access_token);

            if (! empty($mediajson)) {
                $this->media_id = $mediajson['media_id'];
                $row = array();
                $row['media_id'] = $mediajson['media_id'];
                $row['media_type'] = $mediajson['type'];
                $row['created_at'] = $mediajson['created_at'];
                $row['objtype'] = "WxUser";
                $row['objid'] = $wxuser->id;
                $row['objcode'] = "Share[DY]";
                Media::createByBiz($row);
            }
        }
    }

    private function getFinalUrl () {
        return "/home/xdata/xphoto/qrcode/{$this->wxuser->id}.jpg";
    }

    private function getMediaReturnJson ($access_token) {
        // {"type":"TYPE","media_id":"MEDIA_ID","created_at":123456789}
        $arr = array();
        $filename = $this->getFinalUrl();
        $mediaidjson = WxApi::uploadimg($access_token, $filename);
        if (empty($mediaidjson['errcode'])) {
            $arr = $mediaidjson;
        }
        return $arr;
    }

    private function mergeImg ($imgs, $wxuser) {
        list ($max_width, $max_height) = getimagesize($imgs['dst']);
        $canvas = imagecreatetruecolor($max_width, $max_height);

        $dst_im = imagecreatefrompng($imgs['dst']);
        imagecopy($canvas, $dst_im, 0, 0, 0, 0, $max_width, $max_height);
        imagedestroy($dst_im);

        $srcs = $imgs['src'];
        foreach ($srcs as $src) {
            $url = $src['url'];
            $left = $src['left'];
            $top = $src['top'];
            $fw = $src['fw'];
            $fh = $src['fh'];
            $src_info = getimagesize($url);
            $fileType = $src_info[2];
            if ($fileType == 2) {
                // 原图是 jpg 类型
                $src_im = imagecreatefromjpeg($url);
            } else
                if ($fileType == 3) {
                    // 原图是 png 类型
                    $src_im = imagecreatefrompng($url);
                } else {
                    // 无法识别的类型
                    $src_im = imagecreatefrompng($url);
                }

            $tempcanvas = imagecreatetruecolor($fw, $fh);
            imagecopyresampled($tempcanvas, $src_im, 0, 0, 0, 0, $fw, $fh, $src_info['0'], $src_info['1']);

            imagecopy($canvas, $tempcanvas, $left, $top, 0, 0, $fw, $fh);
            imagedestroy($src_im);
            imagedestroy($tempcanvas);
        }

        imagejpeg($canvas, "/home/xdata/xphoto/qrcode/{$wxuser->id}.jpg");
    }

    /*
     * protected function dueto_view () { $this->response_content =
     * $this->EventKey; } protected function dueto_masssendjobfinish () {}
     * protected function dueto_LOCATION () {}
     */

}
