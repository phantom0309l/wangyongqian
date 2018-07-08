<?php

/**
 * Created by PhpStorm.
 * User: hades
 * Date: 2018/7/6
 * Time: 22:53
 */
class EmailCodeAction extends WxAuthBaseAction
{
    public function doSendCode() {
        $email = XRequest::getValue('email');

        $code = mt_rand(100000, 999999);

        $row = array();
        $row["email"] = $email;
        $row["expires_in"] = time() + 600;
        $row["code"] = $code;
        EmailCode::createByBiz($row);

//        if (!$this->sendEmail($email, $code) === true) {
//            $this->returnError('发送失败');
//        }

        return self::TEXTJSON;
    }

    private function sendEmail($email, $body) {
        $mail = new PHPMailer();

        $mail->IsSMTP(); // send via SMTP
        $mail->Host = 'smtp.163.com'; // SMTP servers
        $mail->SMTPAuth = true; // turn on SMTP authentication
        $mail->Username = 'wangyq_shoushu@163.com'; // SMTP username 注意：普通邮件认证不需要加 @域名
        $mail->Password = 'abc123def'; // SMTP password
        $mail->SMTPSecure = "ssl";// 使用ssl协议方式
        $mail->Port = 994;// 163邮箱的ssl协议方式端口号是465/994
        $mail->SetFrom('wangyq_shoushu@163.com', '王永前门诊手术预约');

        $mail->CharSet = "UTF8";
        $mail->Encoding = "base64";

        $mail->AddAddress($email, ""); // 收件人邮箱和姓名

        $mail->IsHTML(true); // send as HTML
        $mail->Body = $body;
        $mail->AltBody = "text/html";

        if (!$mail->send()) {// 发送邮件
            Debug::info($mail->ErrorInfo);
//            return $mail->ErrorInfo;
            return false;
        } else {
            return true;
        }
    }
}