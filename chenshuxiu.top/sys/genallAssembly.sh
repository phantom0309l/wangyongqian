#! /bin/sh

assembly_path=$(cd `dirname $0`; pwd)"/"

echo "\n\nphp ${assembly_path}generatorAssembly.admin.php"
php ${assembly_path}generatorAssembly.admin.php

echo "\n\nphp ${assembly_path}generatorAssembly.cron.php"
php ${assembly_path}generatorAssembly.cron.php

echo "\n\nphp ${assembly_path}generatorAssembly.wx.php"
php ${assembly_path}generatorAssembly.wx.php
