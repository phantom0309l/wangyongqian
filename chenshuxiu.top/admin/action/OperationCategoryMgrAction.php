<?php

// OperationCategoryMgrAction
class OperationCategoryMgrAction extends AdminBaseAction
{

    public function doList() {
        $doctorid = XRequest::getValue('doctorid');

        if (!$doctorid) {
            $this->returnError('请选择医生');
        }

        $doctor = Doctor::getById($doctorid);
        if (!$doctor instanceof Doctor) {
            $this->returnError('医生不存在');
        }

        $operationcategorys = OperationCategoryDao::getParentListByDoctorid($doctorid);
        $arr = [];
        foreach ($operationcategorys as $operationcategory) {
            $arr[] = $operationcategory->toListJsonArray();
        }

        $this->result['data'] = [
            'operationcategorys' => $arr
        ];

        return self::TEXTJSON;
    }

    public function doSavePost() {
        $doctorid = XRequest::getValue('doctorid');

        if (!$doctorid) {
            $this->returnError('请选择医生');
        }

        $doctor = Doctor::getById($doctorid);
        if (!$doctor instanceof Doctor) {
            $this->returnError('医生不存在');
        }

        $operationcategorys = OperationCategoryDao::getParentListByDoctorid($doctorid);
        foreach ($operationcategorys as $operationcategory) {
            $operationcategory->remove();
        }

        $operationcategorys = XRequest::getValue('operationcategorys', []);
        foreach ($operationcategorys as $operationcategory) {
            if ($operationcategory['title'] == '') {
                continue;
            }
            $row = [];
            $row["doctorid"] = $doctorid;
            $row["parentid"] = 0;
            $row["title"] = $operationcategory['title'];
            $parent = OperationCategory::createByBiz($row);

            $children = $operationcategory['children'];
            Debug::trace($children);
            if (!empty($children)) {
                foreach ($children as $child) {
                    if ($child['title'] == '') {
                        continue;
                    }

                    $child_row = [];
                    $child_row["doctorid"] = $doctorid;
                    $child_row["parentid"] = $parent->id;
                    $child_row["title"] = $child['title'];
                    $child = OperationCategory::createByBiz($child_row);
                }
            }
        }

        return self::TEXTJSON;
    }

    public function doModify() {
        return self::SUCCESS;
    }

    public function doModifyPost() {
        return self::SUCCESS;
    }
}
