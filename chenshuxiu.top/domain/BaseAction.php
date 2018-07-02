<?php

class BaseAction extends XAction
{
    // json数据统一格式, TODO by sjp : 改名为 output ?
    protected $result = array();

    protected $action = null;

    protected $method = null;

    public function __construct () {
        $this->result['errno'] = 0;
        $this->result['errmsg'] = '';
        $this->result['data'] = '';

        // 域名
        XContext::setValue("website_domain", Config::getConfig("website_domain"));

        // 子系统uri
        XContext::setValue("admin_uri", Config::getConfig("admin_uri"));

        // 静态图片
        XContext::setValue("img_uri", Config::getConfig("img_uri"));

        // 图片数据，自动裁剪功能
        XContext::setValue("photo_uri", Config::getConfig("photo_uri"));

        // 上一个请求传过来的消息
        XContext::setValue("preMsg", XRequest::getValue("preMsg", ''));

        // theUrl 和 refererUrl
        $http = FUtil::isHttps() ? 'https' : 'http';
        $theUrl = $http . "://" . getenv('HTTP_HOST') . "" . getenv('REQUEST_URI');
        XContext::setValue("theUrl", urlencode($theUrl));
        XContext::setValue("refererUrl", urlencode(getenv('HTTP_REFERER')));

        // icp 和 company
        XContext::setValue("icp", Config::getConfig("icp"));
        XContext::setValue("company", Config::getConfig("company", '方寸技术实验室'));

        // 微信token
        XContext::setValue("weixin_token", Config::getConfig("weixin_token"));

        // 子域名
        $host = getenv('HTTP_HOST');
        $pos = strpos($host, '.');
        $xdomain = substr($host, 0, $pos);
        XContext::setValue("xdomain", strtolower($xdomain));

        XContext::setValue("the_domain", strtolower($host));

        // 全系统公共模板路径 domain/tpl , 特色场景
        XContext::setValue("dtpl", ROOT_TOP_PATH . "/domain/tpl");

        // 设置开发环境
        $dev_user = XRequest::getValue('dev_user', '');
        if ($dev_user) {
            $domain = Config::getConfig("website_domain");
            setcookie('dev_user', $dev_user, time() + 3600 * 24 * 365, '/', $domain);
        }
        XContext::setValue("dev_user", $dev_user);

        $this->action = XRequest::getValue('action', '');
        $this->method = XRequest::getValue('method', '');

        $vConsole = XRequest::getValue('vConsole', '');
        if ('wyq' == $vConsole) {
            XContext::setValue('vConsole', true);
            echo '<script src="https://res.wx.qq.com/mmbizwap/zh_CN/htmledition/js/vconsole/3.0.0/vconsole.min.js"></script>';
            echo '<script>window.vConsole = new window.VConsole();</script>';
        }

        // 初始化登录信息
        $this->initMyUser();
    }

    public function _hookActionFinish () {
        if (! XContext::getValue('json')) {
            XContext::setValue('json', $this->result);
        }
    }

    // 初始化登录信息, 各个系统都需要,但wx和m子系统可能会修正之
    protected function initMyUser () {
    }

    // 获取保存的myuserid
    protected function getCookieMyUserId () {
        return XCookie::get("_myuserid_");
    }

    // 保存登录
    protected function setMyUserIdCookie ($myuserid) {
        if ($myuserid) {
            XCookie::set("_myuserid_", $myuserid);
        }
    }

    // 退出登录
    protected function clearMyUserIdCookie () {
        XCookie::set0("_myuserid_", '', - 1);
        XCookie::set0("_diseaseid_", '', - 1);
    }

    // 获取设备类型
    public static function userAgent2deviceType () {
        $user_agent = strtolower(getenv('HTTP_USER_AGENT'));

        Debug::trace($user_agent);

        $is_ios = (strpos($user_agent, 'ios')) ? true : false;
        $is_iphone = (strpos($user_agent, 'iphone')) ? true : false;
        $is_ipad = (strpos($user_agent, 'ipad')) ? true : false;
        $is_itouch = (strpos($user_agent, 'itouch')) ? true : false;

        $is_android = (strpos($user_agent, 'android')) ? true : false;

        if ($is_ios || $is_iphone || $is_ipad || $is_itouch) {
            return "ios";
        }

        if ($is_android) {
            return "android";
        }

        if ($user_agent == 'okhttp/2.4.0') {
            return "android";
        }

        return 'pc';
    }

    protected function isAjax () {
        $display = XRequest::getValue('display', '');
        return $display == 'json';
    }

    protected function output () {
        header('Content-Type: application/javascript; charset=utf-8');
        $this->result['errno'] = $this->result['errno'] . '';
        echo json_encode($this->result, JSON_UNESCAPED_UNICODE);
        exit();
    }

    protected function returnError($errmsg = '', $errno = -1, $data = []) {
        $this->result['errmsg'] = $errmsg;
        $this->result['errno'] = $errno;
        $this->result['data'] = $data;
        $this->output();
    }
}
