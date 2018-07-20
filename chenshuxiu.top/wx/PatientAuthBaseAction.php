<?php

class PatientAuthBaseAction extends WxAuthBaseAction
{

    // ########################################
    // # #
    // # 凡于Base类中的302跳转 务必携带openid #
    // # #
    // ########################################

    public function __construct() {
        parent::__construct();
        $this->patientCheck();
    }

    protected function patientCheck() {
        $mypatient = $this->mypatient;
        if (false == $mypatient instanceof Patient) {
            $theUrl = XContext::getValue("theUrl");
            $this->clearMyUserIdCookie();
            if ($this->action == 'order' && $this->method == 'one') {
                UrlFor::jump302("/baodao/login?redirect_url=" . urlencode($theUrl));
            } else {
                UrlFor::jump302("/baodao/baodao?redirect_url=" . urlencode($theUrl));
            }
        } else {
            if (1 != $mypatient->status) {
                $this->jump302ResultPage("报到信息已提交，等待审核", 0);
            }
        }
    }

}
