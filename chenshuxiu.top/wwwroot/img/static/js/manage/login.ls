window.w = innerWidth;
window.h = innerHeight;

log_reg=
  $id: "log_reg"
  left: (w-540)/2

  #被用户输入的属性值
  account: ""
  password: ""
  btitle: true

  waiting: ->
    $('.err_msg').hide()
    $('#waiting_err_log').fadeIn!


  log_sub: !->
    $('.err_msg').hide()
    lrm.account_check!
    unless lrm.account_check()
      $('#acc_err_log').fadeIn()
      return false
    unless lrm.pwd_check()
      $('#pwd_err_log').fadeIn()
      return false
    $.post "/man/login", acc: lrm.account, pwd: lrm.password,
      (data,status)!->
        if data is "fine"
          $('#log_suc').fadeIn "fast", !-> window.location.href='/manage/bt'
        else
          $('#pwdnmtch_err_log').fadeIn()

  #对用户的信息进行检查,若不合标准则报错并返回false,反之返回true

  account_check: ->
    Boolean(lrm.account)
  pwd_check: ->
    if lrm.password.length< 8 or lrm.password.length> 18
      false
    else
      true

window.lrm= avalon.define log_reg
