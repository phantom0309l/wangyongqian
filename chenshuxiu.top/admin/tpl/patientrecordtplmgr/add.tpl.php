<?php
$pagetitle = "运营备注类型新建";
$cssFiles = []; // 也可以引用第三方文件，注意数组顺序，后面的样式覆盖前面的样式
$jsFiles = []; // 填写完整地址
$pageStyle = <<<STYLE
STYLE;
$pageScript = <<<SCRIPT
SCRIPT;
$sideBarMini = false;
?>
<?php include_once $tpl . '/_header.new.tpl.php'; ?>
<div class="col-md-12">
    <section class="col-md-12">
        <form action="/patientrecordtplmgr/addpost" method="post">
            <div class="table-responsive">
                <table class="table table-bordered">
                <tr>
                    <td>diseasegroupid</td>
                    <td>
                        <?= HtmlCtr::getSelectCtrImp(CtrHelper::getDiseaseGroupCtrArray(),'diseasegroupid',0,'js-select2 form-control') ?>
                    </td>
                </tr>
                <tr>
                    <td>ename</td>
                    <td>
                        <input type="text" name="ename" value="" />
                    </td>
                </tr>
                <tr>
                    <td>title</td>
                    <td>
                        <input type="text" name="title" value="" />
                    </td>
                </tr>
                <tr>
                    <td>content</td>
                    <td>
                        <textarea rows="10" cols="120" name="content"></textarea>
                    </td>
                </tr>
                <tr>
                    <td>样式class</td>
                    <td>
                        <input type="text" name="style_class" value="" />
                    </td>
                </tr>

                <tr>
                    <td></td>
                    <td>
                        <input type="submit" class="btn btn-success" value="提交" />
                    </td>
                </tr>
            </table>
            </div>
        </form>
    </section>
</div>
<div class="clear"></div>
<?php
$footerScript = <<<STYLE

STYLE;
?>
<?php include_once $tpl . '/_footer.new.tpl.php'; ?>
