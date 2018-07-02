$(function(){
    // 设置
    var continous = true,
        autoplay = true;

    var audio, timeout, isPlaying;

    // 播放
    var play = function(){
        audio.play();
        $('.playback').addClass('playing');
        timeout = setInterval(updateProgress, 500);
        isPlaying = true;
    };

    // 暂停
    var pause = function(){
        audio.pause();
        $('.playback').removeClass('playing');
        clearInterval(updateProgress);
        isPlaying = false;
    };

    // 添加播放记录playlog
    var postMsg = function(){
        var lessonid = $("#lessonid").val();
        var duration = audio.currentTime;
        var total_duration = audio.duration;
        $.ajax({
            "type": "post",
            "data": {
                objtype: "Lesson",
                objid: lessonid,
                duration: duration,
                total_duration: total_duration
            },
            "dataType": "json",
            "url": "/playlog/addjson",
            "success": function (data) {
            }
        });
    };

    // 设置进度
    var setProgress = function(value){
        var currentSec = parseInt(value%60) < 10 ? '0' + parseInt(value%60) : parseInt(value%60),
            ratio = value / audio.duration * 100;

        $('.timer').html(parseInt(value/60)+':'+currentSec);
        $('.duration').html(parseInt(audio.duration/60)+':'+parseInt(audio.duration%60));
        $('.progress .pace').css('width', ratio + '%');
        $('.progress .slider a').css('left', ratio + '%');
    };

    // 更新进度
    var updateProgress = function(){
        setProgress(audio.currentTime);
    };

    // 进度滑动
    $('.progress .slider').slider({step: 0.1, slide: function(event, ui){
        $(this).addClass('enable');
        setProgress(audio.duration * ui.value / 100);
        clearInterval(timeout);
    }, stop: function(event, ui){
        audio.currentTime = audio.duration * ui.value / 100;
        $(this).removeClass('enable');
        timeout = setInterval(updateProgress, 500);
    }});

    // 轨道结束重播
    var ended = function(){
        pause();
        postMsg();
        audio.currentTime = 0;
        if (continous == true) isPlaying = true;
        play();
    };

    //
    var beforeLoad = function(){
        var endVal = this.seekable && this.seekable.length ? this.seekable.end(0) : 0;
        $('.progress .loaded').css('width', (100 / (this.duration || 1) * endVal) +'%');
    };

    // 完全加载后播放
    var afterLoad = function(){
        if (autoplay == true) play();
    };

    // 添加监听事件
    var loadMusic = function(){
        audiojs.events.ready(function() {
            var newaudio = audiojs.createAll();

            audio = $('#audio')[0];
            audio.addEventListener('progress', beforeLoad, false);
            audio.addEventListener('durationchange', beforeLoad, false);
            audio.addEventListener('canplay', afterLoad, false);
            audio.addEventListener('ended', ended, false);

            $('.playback').addClass('pk-dingActive');
            $('.playback').addClass('pk-ding');
        });
    };
    loadMusic();
    $('.playback').on('click', function(){
        if ($(this).hasClass('playing')){
            pause();
            $(this).addClass('pk-ding');
            $(this).removeClass('pk-dingActive');
        } else {
            play();
            $(this).addClass('pk-dingActive');
            $(this).addClass('pk-ding');
        }
    });
    $(window).bind('unload', function() {
        postMsg();
    });

    var bool=false;
    setTimeout(function(){
        bool=true;
    },1000);
    pushHistory();
    window.addEventListener('popstate', function() {
        if(bool)
        {
            postMsg();
            window.history.back();
        }
    }, false);
    function pushHistory() {
        var state = {
            title: "title",
            url: "#"
        };
        window.history.pushState(state, "title", "#");
    }
});
