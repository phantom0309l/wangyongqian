<?php
/**
 * Created by PhpStorm.
 * User: lijie
 * Date: 2018/1/22
 * Time: 13:19
 */

$page_title = $wxshop->name;
include_once($tpl . "/_common/_header.tpl.php");
?>
<style>
body{ background: #eee;}
p{margin: 8px 0px; color: #666;}
pre{margin: 0px 0px;}
.block{display: inline-block;}
.box{background: white; padding: 10px; margin: 5px 5px; border-radius: 5px;height: 100%;overflow: auto;}
.title{margin: 10px; padding-bottom: 20px; color: #333;font-size: 16px;}
.time{font-size: 12px; color: #ccc;}
.first{margin: 5px 0px 0px 0px; font-size: 13px; color: #666;}
.notice{ margin:20px 10px 20px 10px; text-align: left; font-size: 14px; color: #333;}
.black{color: black;}
.top-dashed{border-top: dashed 1px #eee;}
.bottom-dashed{border-bottom: dashed 1px #eee;}
.keword-title{width: 65px; color: #888;}
.pre-content{word-wrap: break-word; white-space: pre-wrap; white-space: -moz-pre-wrap; line-height: 180%;}
.remark{padding-top: 10px;}
</style>
    <div class="box">
        <?php if($pushmsg instanceof PushMsg){ ?>
            <?php
            if("wechat_template" == $pushmsg->sendway){
                $content = $pushmsg->content;
            }else {
                $content = $wxtemplate->getContentOfAdminNoticeOrFollowupNotice($pushmsg->wxuser->user->patient, "医生随访团队", $pushmsg->content);
            }
            $data = json_decode($content, JSON_UNESCAPED_UNICODE);
            ?>
            <div class="title bottom-dashed">
                <?= $wxtemplate->title ?>
                <div class="time"><?= substr($pushmsg->createtime, 5) ?></div>
                <p class="first"><?= $data["first"]["value"] ?></p>
            </div>
            <div class="notice">
                <?php
                foreach ($configArrr["keywords"] as $k => $v) {
                    if(isset($data["keyword" . ($k + 1)])){
                    ?>
                        <div><span class="keword-title block black"><?= $v["title"] . ":" ?></span><pre class="block pre-content"><?= $data["keyword" . ($k + 1)]["value"] ?></pre></div>
                    <?php
                    }
                }
                ?>
                <p class="remark black <?= empty($data["remark"]["value"]) ? "" : "top-dashed" ?>"><?= $data["remark"]["value"] ?></p>
            </div>
        <?php }else { ?>
            <div>页面已过期！
            </div>
        <?php } ?>
    </div>
<?php include_once($tpl . "/_common/_footer.tpl.php"); ?>
