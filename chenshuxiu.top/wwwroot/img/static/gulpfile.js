var gulp = require('gulp')

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');

//任务中用到的工具函数
var createNeedFiles = function(pre, simpleArr){
    return simpleArr.map(function(i){
        return ( pre+i )
    })
}

var processJsFile = function( needFiles, finalFileName ){
    gulp.src(needFiles)
        .pipe(concat( finalFileName + '.js' ))
        .pipe(gulp.dest('./dist/js'))
        .pipe(rename( finalFileName + '.min.js' ))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
}

var processCssFile = function( needFiles, finalFileName ){
    gulp.src(needFiles)
        .pipe(concat( finalFileName + '.css' ))
        .pipe(gulp.dest('./dist/css'))
        .pipe(rename( finalFileName + '.min.css' ))
        .pipe(minifycss())
        .pipe(gulp.dest('./dist/css'));
}

// 合并，压缩js文件

gulp.task('js-min', function(){
    var needProcessJsFiles = {
        "mobiscroll.all" : {
            "pre" : "./js/mobiscroll/js/",
            "sArr" : ["mobiscroll.core.js", "mobiscroll.frame.js", "mobiscroll.scroller.js", "mobiscroll.util.datetime.js", "mobiscroll.datetimebase.js", "mobiscroll.datetime.js", "mobiscroll.select.js", "mobiscroll.listbase.js", "mobiscroll.image.js", "mobiscroll.treelist.js", "mobiscroll.frame.android.js", "mobiscroll.frame.android-holo.js", "mobiscroll.frame.ios-classic.js", "mobiscroll.frame.ios.js", "mobiscroll.frame.jqm.js", "mobiscroll.frame.sense-ui.js", "mobiscroll.frame.wp.js", "mobiscroll.android-holo-light.js", "mobiscroll.wp-light.js", "mobiscroll-dark.js", "i18n/mobiscroll.i18n.zh.js"]
        }
    }
    for( var key in needProcessJsFiles ){
        var item = needProcessJsFiles[key]
        var jsArr = createNeedFiles(item.pre,item.sArr)
        processJsFile( jsArr, key )
    }
});

//合并，压缩css文件

gulp.task('css-min', function(){
    var needProcessCssFiles = {
        "mobiscroll.all" : {
            "pre" : "./js/mobiscroll/css/",
            "sArr" : [
                "mobiscroll.animation.css", "mobiscroll.icons.css", "mobiscroll.frame.css", "mobiscroll.frame.android.css", "mobiscroll.frame.android-holo.css", "mobiscroll.frame.ios-classic.css", "mobiscroll.frame.ios.css", "mobiscroll.frame.jqm.css", "mobiscroll.frame.sense-ui.css", "mobiscroll.frame.wp.css", "mobiscroll.scroller.css", "mobiscroll.scroller.android.css", "mobiscroll.scroller.android-holo.css", "mobiscroll.scroller.ios-classic.css", "mobiscroll.scroller.ios.css", "mobiscroll.scroller.jqm.css", "mobiscroll.scroller.sense-ui.css", "mobiscroll.scroller.wp.css", "mobiscroll.image.css", "mobiscroll.android-holo-light.css", "mobiscroll.wp-light.css", "mobiscroll-dark.css"
            ]
        }
    }
    for( var key in needProcessCssFiles ){
        var item = needProcessCssFiles[key]
        var cssArr = createNeedFiles(item.pre,item.sArr)
        processCssFile( cssArr, key )
    }
});

// 检查脚本
gulp.task('lint', function() {
    gulp.src('./js/*/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// 编译Sass
gulp.task('sass', function() {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});

// 默认任务
gulp.task('default', function(){
    gulp.start('js-min','css-min');
});
