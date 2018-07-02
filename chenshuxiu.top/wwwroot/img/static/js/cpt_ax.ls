# 关卡开始后的有效监听时间
listening_time = 1500
# 关卡间隔时间
waiting_time = 1500

ass_atom = ['B' to 'W']
steps = []

while steps.length < 30
  if (2 * Math.random! |> Math.floor) == 0
    steps.push 'A'
    if steps.length < 30
      if (2 * Math.random! |> Math.floor) == 0
        steps.push 'X'
      else
        steps.push ass_atom[22 * Math.random! |> Math.floor]
  else
    steps.push ass_atom[22 * Math.random! |> Math.floor]


class TimeKeeper

  # 测试开始时间
  start_time: 0
  # 关卡开始时间
  begin_time: 0
  clicks: []
  responses: []

  clicked: false
  recording: false

  listen: (date)!->
    @begin_time = date

  capture: (mole)!->
    now = new Date
    dif = now - @begin_time
    @clicks.push {mole: mole, time: now}
    if @recording
      @responses.push {mole: mole, time: now, delay: dif}
      @recording = false
      @clicked = true

  step_end: !->
    unless @clicked
      @clicks.push null
      @responses.push null
      zilean.recording = false




pre =
  $id: 'pre'

  cover: true

  vstr: "开始测试"
  vstr_act: "准备"

  second: ""
  activating: false

  sinit: !->
    pvm.second = 3

  sec2begin: !->
    ic = setInterval(
      !->
        pvm.second -= 1
        if pvm.second < 1
          pvm.cover = false
        if pvm.second < 0
          clearInterval ic
          begin!
      1000
    )

  be_activating: !->
    unless pvm.activating
      pvm.activating = true
      pvm.sinit!
      pvm.sec2begin!


root =
  $id: 'root'

  vstr: ""


btn=
  $id: 'btn'

  listening: false

  kick_mole: (which)!->
    zilean.capture which


effect =
  $id: 'effect'

  cover: false

  all:0
  lbtn:0
  rbtn:0
  dif:0

  dif_comp: ->
    r = 0
    c = 0
    for x in zilean.responses
      if x and x.delay
        r += 1
        c += x.delay
    if (c/r/1000) then that.toFixed 3 else 0

  btn_comp: (which)->
    c = 0
    for x in zilean.responses
      if x and x.mole and (x.mole == which)
        c += 1
    c

  result_gen: !->
    evm.cover= true
    evm.all = zilean.clicks.length
    evm.dif = evm.dif_comp!
    evm.lbtn = evm.btn_comp 'o'
    evm.rbtn = evm.btn_comp 'x'



pvm = avalon.define pre
rvm = avalon.define root
bvm = avalon.define btn
evm = avalon.define effect


zilean = new TimeKeeper

step_checkout = (num)!->
  zilean.recording = true
  bvm.listening = true
  zilean.clicked = false
  rvm.vstr = steps[num]
  zilean.listen new Date

  # 数字展示后何时消失
  window.setTimeout(
    !->
      rvm.vstr = ""
    150
  )

  window.setTimeout(
    !->
      bvm.listening = false
      zilean.step_end!
    listening_time)

begin = !->
  zilean.start_time = new Date!
  step_checkout 0
  curstep = 1
  intervalc = window.setInterval(
    !->
      step_checkout curstep
      curstep += 1
      if curstep > 29
        window.clearInterval intervalc
        setTimeout(
          !->
            evm.result_gen!
          listening_time+150
        )
    listening_time+150
  )

