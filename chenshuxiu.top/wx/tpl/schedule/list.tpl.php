<?php
/**
 * Created by PhpStorm.
 * User: hades
 * Date: 2017/12/22
 * Time: 10:35
 */

$page_title = "手术预约";
include_once($tpl . "/_common/_header.tpl.php"); ?>
    <style>
        html {
            font-size: 62.5% !important;
        }

        *:before, *:after {
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
        }

        body {
            font-family: 'microsoft Yahei', 'Montserrat', sans-serif !important;
            font-size: 16px;
            font-size: 1.6rem;
        }

        #app, #fccalendar {
            font-family: 'Avenir', Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-align: center;
            /* color: #2c3e50; */
            color: #353535;
            width: 100%;
        }

        .schedule-list {
            background-color: #e9ecf1;
        }

        .options-table td:first-child {
            word-break: keep-all;
        }

        .dot {
            width: 6px;
            height: 6px;
            border-radius: 6px;
            background-color: #4472c5;
            display: inline-block;
            vertical-align: middle;
            margin-left: 3px;
        }

        .fw-500 {
            font-weight: 500;
        }

        .content-box {
            text-align: left;
            list-style-type: circle;
        }

        .content-box > li > * {
            color: #333;
        }

        /* 按钮域 begin */
        .btn-area {
            padding: 15px;
            display: flex;
            justify-content: space-around;
        }

        /* 按钮域 end */
    </style>
    <style>
        .calendar {
            text-align: center;
            background: #fff;
            /*padding-bottom: 1rem;*/
            overflow: hidden;
            -webkit-transition: all 200ms;
            transition: all 200ms;
        }

        /*------- 日历头部模块 ------*/
        .calendar .cal-header {
            padding: 0 3%;
            border-bottom: 1px solid #eee;
            height: 5rem;
            line-height: 5rem;
            background: #4472c5;
            position: relative;
            z-index: 2;
        }

        .calendar .select-dep-wrap {
            display: inline-block;
            width: 14%;
            height: 5.5rem;
            position: absolute;
            margin-right: 1.2%;
            right: 0;
        }

        .calendar .select-deparment {
            display: inline-block;
            width: 2.6rem;
            height: 2.6rem;
            background: #1a85ff;
            border-radius: 100%;
            vertical-align: middle;
        }

        .calendar .date-wrap {
            position: relative;
            height: auto;
            top: 0px;
            /*transition: none;*/
            -webkit-transition: all 200ms;
            transition: all 200ms;
        }

        .calendar .cal-header .title-wrap {
            margin: 0 5%;
            font-size: 1.2em;
            color: #fff;
        }

        .calendar .cal-header .pre-mon, .calendar .cal-header .next-mon {
            display: inline-block;
            width: 4rem;
            height: 3rem;
            vertical-align: -.8rem;
            position: relative;
        }

        .calendar .cal-header .pre-mon:before, .calendar .cal-header .next-mon:before {
            content: '';
            display: block;
            width: 1.2rem;
            height: 1.2rem;
            border-left: 1px solid #fff;
            border-bottom: 1px solid #fff;
            position: absolute;
        }

        .calendar .cal-header .pre-mon:before {
            right: 1rem;
            top: .9rem;
            -webkit-transform: rotate(45deg);
            transform: rotate(45deg);
        }

        .calendar .cal-header .next-mon:before {
            top: .9rem;
            left: .6rem;
            -webkit-transform: rotate(-135deg);
            transform: rotate(-135deg);
        }

        /*------- 头部星期部分 ------*/
        .calendar .days {
            padding: .5rem 0;
            background: #fff;
            position: relative;
            z-index: 2;
            font-size: 0px;
        }

        .calendar .days span {
            display: inline-block;
            width: 14%;
            font-size: 14px;
        }

        /*------- 日历表模块 ------*/
        .calendar .oneweek {
            font-size: 0px;
        }

        .calendar .oneweek > .date {
            display: inline-block;
            width: 14%;
            position: relative;
            font-size: 0px;
            padding: 5px 0;
            margin: 6px 0;
            vertical-align: middle;
        }

        .calendar .oneweek .pre, .calendar .oneweek .next {
            color: #d9dbdd !important;
        }

        .calendar .date:after {
            border: 3px solid #4472c5;
        }

        .calendar .date span {
            display: inline-block;
            width: 95%;
            -webkit-transition: all 200ms;
            transition: all 200ms;
            font-size: 16px;
            text-align: center;
            /*padding: 5px 0 0;*/
        }

        .calendar .date .desc {
            font-size: 12px;
            font-weight: bolder;
            color: #4472c5;
            /*padding: 0 0 5px 0;*/
        }

        .calendar .date .today {
            font-weight: bolder;
            font-size: 14px;
            color: #4472c5;
        }

        .calendar .date.selected {
            background-color: #4472c5;
            color: #fff;
            border-radius: 5px;
        }

        .calendar .date.selected .desc, .calendar .date.selected .today {
            color: #fff;
        }

        .calendar .date.curr-date > span {
            color: #fff;
            background: #1a85ff;
        }

        .calendar .date.small-font {
            font-size: 1.3rem;
        }

        .calendar .tag:after {
            content: '';
            display: inline-block;
            width: 0.8rem;
            height: .8rem;
            border-radius: 100%;
            background: #b0ceee;
            position: absolute;
            left: 50%;
            margin-left: -.4rem;
            bottom: 0;
        }

        .calendar .my-tag:after {
            content: '';
            display: inline-block;
            width: 0.8rem;
            height: .8rem;
            border-radius: 100%;
            background: #eeb0b0;
            position: absolute;
            left: 50%;
            margin-left: -.4rem;
            bottom: .1rem;
        }
    </style>
    <div class="page schedule-list">
        <div class="page__bd">
            <div class="fc-bg_primary" style="padding: 5px 15px; margin-bottom: 3px;">
                <p style="color: #fff; font-size: 14px;">
                    <?php
                    if ($doctor->bulletin) {
                        echo $doctor->bulletin;
                    } else {
                        echo $doctor->name . '医生门诊需要提前预约, 复诊前1天会告知您就诊流程及注意事项，注意微信通知。';
                    }
                    ?>
                </p>
            </div>
            <div id="fccalendar">
                <div class="calendar cal">
                    <div class="cal-header">
                        <span class="pre-mon" @click="preMonth()"></span>
                        <span class="title-wrap">
                            <span class="year">{{$year}}</span> 年 <span class="month">{{$month}}</span> 月 <span
                                    class="head-text"></span>
                        </span>
                        <span class="next-mon" @click="nextMonth()"></span>
                    </div>
                    <div class="days">
                        <span>一</span>
                        <span>二</span>
                        <span>三</span>
                        <span>四</span>
                        <span>五</span>
                        <span>六</span>
                        <span>日</span>
                    </div>
                    <div class="date-wrap">
                        <template v-for="(week, weekIndex) in datesData.datesArr">
                            <div class="oneweek">
                                <template v-for="(day, dateIndex) in week">
                                    <div v-if="(weekIndex * 7 + dateIndex) < datesData.preMonthDates"
                                         class="date pre">
                                        <span>{{day}}</span>
                                        <!-- <span class="desc">{{getDescOfDay(day)}}</span> -->
                                    </div>
                                    <div v-else-if="(weekIndex * 7 + dateIndex) >= (datesData.datesArr.length * 7 - datesData.nextMonthDates)"
                                         class="date next">
                                        <span>{{day}}</span>
                                        <!-- <span class="desc">{{getDescOfDay(day)}}</span> -->
                                    </div>
                                    <div v-else
                                         class="date"
                                         :class="[{selected: isSelected(day)}]"
                                         @click="handleClickDate(day)">
                                        <span v-if="isToday(day)" class="fc-text_primary today">今天</span>
                                        <span v-else>{{day}}</span>
                                        <span class="desc" :style="{color: getTextColorOfDay(day)}">{{getDescOfDay(day)}}</span>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <div id="app">
                <div class="push-10-t push-10-b fc-bg_white" v-for="schedule in thedate_schedules">
                    <div class="text-left border-b pd-15">
                        <i class="dot"></i>
                        <span class="va-middle fw-500 fc-text_primary" style="margin-left: 7px;">{{schedule.thedate}}</span>
                        <span class="va-middle" style="font-size: 14px; margin-left: 5px;">{{schedule.dow}}</span>
                        <!--                        <span class="va-middle" style="font-size: 14px; margin-left: 5px;">{{schedule.dow}}{{schedule.daypart}}</span>-->
                        <!--                        <span class="va-middle" style="font-size: 14px; margin-left: 10px;">{{schedule.typestr}}</span>-->
                        <span class="va-middle" :style="{color: schedule.idle_cnt < 1 ? '#ec536a' : '#4472c5' }"
                              v-if="schedule.idle_cnt_str"
                              style="font-size: 14px; margin-left: 5px; margin-top: 1px; float: right;">{{schedule.idle_cnt_str}}</span>
                    </div>
                    <ul class="content-box fc-text_primary pd-15 pull-10-b">
                        <li class="push-20-l push-10-b">
                            <!--                            <div v-if="schedule.scheduletpl_cost">-->
                            <!--                                <p class="push-10-b">-->
                            <!--                                    费用：-->
                            <!--                                    {{schedule.scheduletpl_cost}}-->
                            <!--                                </p>-->
                            <!--                            </div>-->
                            <!--                            <div v-if="schedule.begin_hour_str">-->
                            <!--                                <p class="push-10-b">-->
                            <!--                                    时间：-->
                            <!--                                    {{schedule.begin_hour_str}}-->
                            <!--                                </p>-->
                            <!--                            </div>-->
                            <div v-if="schedule.scheduletpl_mobile">
                                <p class="push-10-b">
                                    电话：
                                    {{schedule.scheduletpl_mobile}}
                                </p>
                            </div>
                            <div v-if="schedule.address">
                                <p class="push-10-b">
                                    地点：
                                    {{schedule.address}}
                                </p>
                            </div>
                            <div v-if="schedule.tip">
                                <p class="push-10-b">
                                    公告：
                                    {{schedule.tip}}
                                </p>
                            </div>
                            <div v-if="schedule.idle_cnt > 0">
                                <a :href="'/order/add?scheduleid=' + schedule.scheduleid" class="fc-btn fc-btn_primary">立即预约</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <?php include_once($tpl . "/_common/_taskeasy.tpl.php"); ?>
    </div>
    <script src="<?= $img_uri ?>/v5/lib/vue.min.js"></script>
    <script>
        $(function () {
            var bus = new Vue();

            var vm1,
                vm2;

            var app = {
                init: function () {
                    var self = this;

                    self._init();

                    self._initCalendar();
                },
                _init: function () {
                    if ($("#app").length === 0) {
                        return;
                    }
                    vm1 = new Vue({
                        el: '#app',
                        data: {
                            patientid: '',
                            schedules: [],

                            thedate_schedules: null,
                            date: null,
                            theMonth: '',
                            selectedDate: ''
                        },
                        created: function () {
                            this.selectedDate = '';
                            this.thedate_schedules = null;
                            this.date = new Date();

                            this.setTheMonth(this.date.getFullYear(), this.date.getMonth() + 1);
                            this.fetchData();

                            $('.schedule-list').addClass('js_show');

                            bus.$on('clickDate', this.handleClickDate);
                            bus.$on('changeMonth', this.handleChangeMonth);
                            bus.$on('descOfDate', this.handleDescOfDate);
                            bus.$on('textColorOfDate', this.handleTextColorOfDate);
                        },
                        methods: {
                            setTheMonth: function (year, month) {
                                this.theMonth = year + '-';
                                if (month < 10) {
                                    this.theMonth += '0';
                                }
                                this.theMonth += month;
                            },
                            handleChangeMonth: function (year, month) {
                                this.selectedDate = '';
                                this.thedate_schedules = null;
                                this.setTheMonth(year, month);
                                this.fetchData();
                            },
                            handleClickDate: function (theDate) {
                                this.selectedDate = theDate;
                                if (theDate in this.schedules) {
                                    this.thedate_schedules = this.schedules[theDate]['schedules'];
                                } else {
                                    this.thedate_schedules = null;
                                }
                            },
                            handleDescOfDate: function (theDate, callback) {
                                var desc = null;
                                if (theDate in this.schedules) {
                                    desc = this.schedules[theDate].desc;
                                }
                                callback(desc);
                            },
                            handleTextColorOfDate: function (theDate, callback) {
                                var textColor = null;
                                if (theDate in this.schedules) {
                                    textColor = this.schedules[theDate].textColor;
                                }
                                callback(textColor);
                            },
                            fetchData: function () {
                                var self = this;
                                $.ajax({
                                    url: '/schedule/ajaxgetschedules',
                                    type: 'GET',
                                    dataType: 'json',
                                    data: {
                                        patientid: self.patientid,
                                        the_month: self.theMonth
                                    },
                                    beforeSend: function () {
                                        $(".loading").show();
                                        $(".mask").show();
                                    },
                                    success: function (response) {
                                        if (response.errno === "0") {
                                            self.schedules = response.data.schedules;
                                            bus.$emit('refresh');
                                        } else {
                                            alert(response.errmsg);
                                        }
                                    },
                                    error: function () {
                                        alert('系统错误');
                                    }
                                })
                            }
                        }
                    });
                },
                _initCalendar: function () {
                    if ($("#fccalendar").length === 0) {
                        return;
                    }
                    vm2 = new Vue({
                        el: '#fccalendar',
                        data: {
                            datesData: null,
                            $year: null,
                            $month: null,
                            selectedDate: ''
                        },
                        created: function () {
                            var theDate = vm1.date;
                            this.$year = theDate.getFullYear();
                            this.$month = theDate.getMonth() + 1;
                            this.datesData = this.getDatesData(this.$year, this.$month);

                            bus.$on('refresh', this.refresh);
                        },
                        methods: {
                            refresh: function () {
                                this.datesData = Object.assign({}, this.datesData);
                            },
                            isToday: function (day) {
                                var str = this.$year + '/' + this.$month + '/' + day;
                                var d = new Date(str);
                                var todaysDate = new Date();
                                if (d.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
                                    return true;
                                } else {
                                    return false;
                                }
                            },
                            isSelected: function (day) {
                                var theDate = this.getFullDate(this.$year, this.$month, day);
                                if (theDate == this.selectedDate) {
                                    return true;
                                } else {
                                    return false;
                                }
                            },
                            getFullDate: function (year, month, day) {
                                var fullDate = year + '-';
                                if (month < 10) {
                                    fullDate += '0';
                                }
                                fullDate += month + '-';
                                if (day < 10) {
                                    fullDate += '0';
                                }
                                fullDate += day;

                                return fullDate;
                            },
                            handleClickDate: function (day) {
                                this.selectedDate = this.getFullDate(this.$year, this.$month, day);
                                bus.$emit('clickDate', this.selectedDate);
                            },
                            getDescOfDay: function (day) {
                                var theDate = this.getFullDate(this.$year, this.$month, day);
                                var desc = ' ';
                                bus.$emit('descOfDate', theDate, function (_desc) {
                                    desc = _desc;
                                });
                                return desc;
                            },
                            getTextColorOfDay: function (day) {
                                var theDate = this.getFullDate(this.$year, this.$month, day);
                                var textColor = ' ';
                                bus.$emit('textColorOfDate', theDate, function (_textColor) {
                                    textColor = _textColor;
                                });
                                if (this.isSelected(day)) {
                                    textColor = '#ffffff';
                                }
                                return textColor;
                            },
                            preMonth: function () {
                                this.selectedDate = '';

                                this.$month--;
                                if (this.$month < 1) {
                                    this.$month = 12;
                                    this.$year--;
                                }

                                this.datesData = this.getDatesData(this.$year, this.$month);

                                bus.$emit('changeMonth', this.$year, this.$month);
                            },
                            nextMonth: function () {
                                this.selectedDate = '';

                                this.$month++;
                                if (this.$month > 12) {
                                    this.$month = 1;
                                    this.$year++;
                                }

                                this.datesData = this.getDatesData(this.$year, this.$month);

                                bus.$emit('changeMonth', this.$year, this.$month);
                            },

                            //获取某月的最后一天
                            getLastDate: function (year, month) {
                                return new Date(year, month, 0).getDate();
                            },

                            //取得当月日历表详细数据({arr: [], preMonthDates: number, nextMonthDates: number})
                            getDatesData: function (year, month) {
                                var datesArr = [],
                                    j = 1,
                                    k = 1,
                                    lastDate = this.getLastDate(year, month), //获取当月的最后一天是几号（也就是当月天数）
                                    preMonthDates = new Date(year, month - 1, 1).getDay(), //要显示上一个月的天数
                                    preMonthDates = preMonthDates == 0 ? 6 : preMonthDates - 1,
                                    all = lastDate + preMonthDates, //日历表显示的总天数
                                    nextMonthDates = (((Math.ceil(all / 7) + 1) * 7) - all) % 7; //要显示下一个月的天数

                                //日历上个月天数数组
                                var preMonthDatesArr = this.getPreMonthDates(year, month, preMonthDates);

                                //根据当月第一天星期几和最后一天来拼装当月天数数组
                                var week = [];
                                week = preMonthDatesArr.concat(week);
                                for (var i = 0; i < lastDate + nextMonthDates; i++) {
                                    // if (i < lastDate) {
                                    //     datesArr[i] = j++;
                                    // } else {
                                    //     datesArr[i] = k++;
                                    // }
                                    if (i < lastDate) {
                                        week.push(j++);
                                    } else {
                                        week.push(k++);
                                    }
                                    if (week.length === 7) {
                                        datesArr.push(week);
                                        week = [];
                                    }
                                }

                                return {
                                    datesArr: datesArr, //整个日历表天数
                                    lastDate: lastDate, //最后一天
                                    preMonthDates: preMonthDates, //日历表要显示的上个月天数
                                    nextMonthDates: nextMonthDates //日历表要显示的下个月天数
                                };
                            },

                            //获取日历表中要显示的上一个月数据
                            getPreMonthDates: function (year, month, preMonthDates) {
                                var datesArr = [],
                                    lastDate;

                                if (!preMonthDates || preMonthDates === 0) {
                                    return datesArr;
                                }

                                //上一个月的最后一天
                                lastDate = new Date(year, month - 1, 0).getDate();
                                //生成日历表中显示的上个月的日历天数
                                while (preMonthDates) {
                                    datesArr.unshift(lastDate--);
                                    preMonthDates--;
                                }

                                return datesArr;
                            }
                        }
                    });
                }
            };

            app.init();
        })
    </script>
<?php include_once($tpl . "/_common/_footer.tpl.php"); ?>