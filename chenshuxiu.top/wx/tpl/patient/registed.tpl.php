<?php
$page_title = "基本资料";
include_once($tpl . "/_common/_header.tpl.php");
?>
<link rel="stylesheet" href="<?= $img_uri; ?>/static/css/wx/wxbase.css?v=2017041903"/>
<style>
    .list {
        background: #fff;
    }

    .list-item {
        padding: 12px 0px;
        border-bottom: 1px solid #f1f1f1;
    }

    .list-item-l {
        float: left;
        color: #666;
    }

    .list-item-r {
        float: right;
    }

    .container {
        padding: 0px 15px 10px;
    }

    .title {
        font-size: 16px;
        color: #337ab7;
        margin-top: 20px;
    }

    .pcard {
        margin: 15px 0px;
        border-radius: 6px;
        padding: 10px 5px 10px 10px;
        color: #333;
        border: 1px solid #e5e5e5;
        box-shadow: -1px 1px 3px 1px #e5e5e5;
        position: relative;
    }

    .pcardnew {
        background: #F7ECDA;
        border: 1px solid #F2D7AF;
        box-shadow: -1px 1px 3px 1px #e5e5e5;
    }

    .pcardTip {
        text-align: right;
        font-size: 14px;
        color: #f60;
        position: absolute;
        right: 10px;
        top: 10px;
        color: #337ab7;
    }

    body {
        background-color: #eee;
    }

    .section {
        background-color: #fff;
    }

    ul {
        list-style: none;
        margin: 0px -15px;
    }

    .desc-text {
        font-size: 14px;
        color: #666;
        font-weight: 200;
    }

    .title-text {
        color: #4472c5;
        font-size: 18px;
        padding-left: 10px;
    }

    .fc-flex {
        display: flex;
        align-items: center;
    }

    .bottom-shadow {
        box-shadow: 0px 10px 4px #ccc;
    }

    .clear-pd {
        padding； 0 0;
    }

    .pd-5 {
        padding: 5px;
    }

    .pd-10 {
        padding: 10px;
    }

    .pd-15 {
        padding: 15px;
    }

    .mg-lr--15 {
        margin-left: -15px;
        margin-right: -15px;
    }

    .mg-l-10 {
        margin-left: 10px;
    }

    .mg-l-5 {
        margin-left: 5px;
    }

    .mg-t-10 {
        margin-top: 10px;
    }

    .patient-head {
        margin: auto;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #eee;
        width: 100px;
        height: 100px;
        border-radius: 2px
    }

    .item-left {
        align-self: stretch;
        flex-wrap: wrap;
        justify-content: center;
        border-right: 1px solid #eee;
    }

    .item-right {

    }

    .master-tag {
        align-self: flex-end;
        text-align: center;
        font-size: 14px;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 5px 5px;
        box-sizing: border-box;
        color: #fff;
        background-color: #57a81c;
    }

    ul {
        background-color: #fff;
    }

    .point-icon {
        content: " ";
        display: inline-block;
        height: 10px;
        width: 10px;
        border-width: 1px 1px 0 0;
        border-color: #C8C8CD;
        border-style: solid;
        -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        position: relative;
        top: -2px;
        top: 50%;
        right: 15px;
        margin-top: -4px;
    }

    .patientregisted {
        padding: 0 15px;
    }
</style>
<div class="page js_show patientregisted">
    <div class="section fc-flex pd-10" style="margin: 0px -15px;border-bottom: 1px solid #e1e1e1;">
        <img src="<?= $img_uri ?>/static/img/info_icon.png" style="height:25px;">
        <span class="title-text">患者信息</span>
    </div>
    <div class="section fc-flex pd-10" style="  margin: 0px -15px">
        <div style="flex: 1">
            <div class="patient-head">
                <img src="<?= $img_uri ?>/static/img/patient_head.png" style="width: 65px"/>
            </div>
        </div>
        <div style="flex:2">
            <div class="fc-flex pd-5 desc-text"><img style="width: 16px"
                                                     src="<?= $img_uri ?>/static/img/patient_name_icon.png"><span
                        class="mg-l-10">姓名:&nbsp;&nbsp;&nbsp;<?= $mypatient->name ?></span></div>
            <div class="fc-flex pd-5 desc-text"><img style="width: 16px" src="<?= $img_uri ?>/static/img/sex_icon.png"><span
                        class="mg-l-10"></span>性别:&nbsp;&nbsp;&nbsp;<?= $mypatient->sex == 0 ? "未知" : ($mypatient->sex == '1' ? "男" : "女") ?>
            </div>
            <div class="fc-flex pd-5 desc-text"><img style="width: 16px" src="<?= $img_uri ?>/static/img/birthday_icon.png"><span
                        class="mg-l-10">出生日期:&nbsp;&nbsp;&nbsp;<?= $mypatient->birthday ?></span></div>
        </div>
    </div>

    <div class="weui-cells weui-cells_form info" style="margin-left: -15px; margin-right: -15px">
        <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">手机号</label></div>
            <div class="weui-cell__bd">
                <?= $mypatient->mobile ?>
            </div>
        </div>
        <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">邮箱</label></div>
            <div class="weui-cell__bd">
                <?= $mypatient->email ?>
            </div>
        </div>
    </div>
    <?php if (0) { ?>
        <div>
            <div class="section fc-flex mg-lr--15 mg-t-10 pd-10" style=" border-bottom: 1px solid #e1e1e1; padding: 10px 15px">
                <img src="<?= $img_uri ?>/static/img/info_icon.png" style="height:25px;">
                <span class="title-text">就诊医生信息</span>
            </div>
            <ul>
                <?php foreach ($pcards as $key => $pcard) { ?>
                    <a class="" href="/patient/doctorSetting?thedoctorid=<?= $pcard->doctor->id ?>">
                        <li class="fc-flex clear-pd"
                            style="background-color: <?= $key == 0 ? '#f5ffee' : '' ?>;border-bottom: 1px solid #e1e1e1">
                            <div class="fc-flex item-left" style="flex:3.5;position:relative">
                                <img src="<?= $key == 0 ? $img_uri . "/static/img/master_doctor.png" : $img_uri . "/static/img/not_master_doctor_icon.png" ?>"
                                     style="width:22px"/>
                                <?php if ($key == 0) { ?>
                                    <span class="master-tag">主诊医生</span>
                                <?php } ?>
                            </div>
                            <div class="pd-15 item-right" style="flex:9;">
                                <div style="margin-bottom:10px">
                                    <span style="font-size: 17px; color: #333"><?= $pcard->doctor->name ?></span>
                                    <span class="desc-text">(<?= $pcard->diseasename_show ? $pcard->diseasename_show : $pcard->disease->name ?>
                                        )</span>
                                </div>
                                <div class="desc-text" style="display:flex">
                        <span>所属医院:<span>
                        <span><?= $pcard->doctor->hospital->name ?><span>
                                </div>
                                <div class="desc-text" style="display:flex">
                        <span>就诊时间:<span>
                        <span><?= substr($pcard->createtime, 0, 10) ?><span>
                                </div>
                            </div>
                            <div class="point-icon">
                            </div>
                        </li>
                    </a>
                <?php } ?>
            </ul>
            <?php if ($mypatient->doctor->isHezuo("Lilly")) { ?>
                <p class="tc pt15 red">如以上信息有误，请联系关爱专员</p>
            <?php } else { ?>
                <p class="tc pt15 red">如以上信息有误，请联系医生助理</p>
            <?php } ?>
        </div>
    <?php } ?>
</div>
<?php
include_once($tpl . "/_common/_footer.tpl.php"); ?>
