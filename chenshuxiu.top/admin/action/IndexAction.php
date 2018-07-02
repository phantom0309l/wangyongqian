<?php
/**
 * Created by PhpStorm.
 * User: hades
 * Date: 2018/6/23
 * Time: 17:11
 */

class IndexAction extends AdminBaseAction
{
    public function doIndex() {
        return self::TEXTJSON;
    }
}