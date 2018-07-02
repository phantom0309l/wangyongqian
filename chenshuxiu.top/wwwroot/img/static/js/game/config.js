/**
 * Created by qiaoxiaojin on 15/6/20.
 */

//全局数据设置
//起始关
var initLevel = 3
//最大关数，及可玩次数
var maxLevel = canTry = 12

//每关设置
/*
* 关   黑子数  行   列
*
* 1    1      2    2
* 2    2      2    3
* 3    3      3    3
* 4    4      3    4
* */
var levelConfig = (function(){
    var row = 1
    var col = 2
    var levelConfig = {}
    for( var i=1; i<=maxLevel; i++ ){
        var obj = {}
        obj.blackBlock = i
        if(i%2 == 0){
            col++
        }else{
            row++
        }
        obj.col = col
        obj.row = row
        levelConfig[i] = obj
    }
    return levelConfig
})();

//得分设置
//每选中一个黑子得1分
//每过一关，获得该关对应的分数。现在实现为：过了第5关 得5分
var scoreConfig = (function(){
    var scoreConfig = {}
    scoreConfig.blackScore = 1
    var levelScore = {}
    for( var i=1; i<=maxLevel; i++ ){
        levelScore[i] = i
    }
    scoreConfig.levelScore = levelScore
    return scoreConfig
})();
