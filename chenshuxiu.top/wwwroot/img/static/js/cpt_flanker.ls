rand_atom_all = ['l' 'r' 's']
rand_atom_center = ['l' 'r']
cpexchange =
  l: "←"
  r: "→"
  s: "—"
  "→": "r"
  "←": "l"
  "—": "s"

rand_seq_gen = ->
  result = [rand_atom_all[3 * Math.random! |> Math.floor] for [0 to 4]]
  result[2] = rand_atom_center[2 * Math.random! |> Math.floor]
  result

# 关卡开始后的有效监听时间
listening_time = 1500
# 关卡间隔时间
waiting_time = 1500
# 指示字符串展示时长
picvtime = 150
# 十字间隔展示时长
initpic_time = 150

steps = [rand_seq_gen! for [0 to 11]].map(
  (x)-> [[true false][2 * Math.random! |> Math.floor],x])



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

  activating_b: false
  activating_l: false

  actstr: ""

  initpic: false

  fresh_str: !->
    result = ""
    for x in rvm.activating_l
      result += cpexchange[x]
    rvm.actstr = result

  init_pic: !->
    rvm.initpic= true
    window.setTimeout(
      !->
        rvm.initpic = false
      initpic_time
    )

  step_end: !->
    unless @clicked
      @clicks.push null
      @responses.push null
      zilean.recording = false

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
    evm.lbtn = evm.btn_comp 'l'
    evm.rbtn = evm.btn_comp 'r'


btn=
  $id: 'btn'
  listening: false

  kick_mole: (which)!->
    zilean.capture which

rvm = avalon.define root
bvm = avalon.define btn
pvm = avalon.define pre
evm = avalon.define effect

zilean = new TimeKeeper

step_checkout = (num)!->
  zilean.recording = true
  bvm.listening = true
  zilean.clicked = false
  [rvm.activating_b,rvm.activating_l] = steps[num]
  rvm.fresh_str!
  zilean.listen new Date
  # 图片展示后何时消失
  window.setTimeout(
    !->
      rvm.actstr = ""
    picvtime
  )

  window.setTimeout(
    !->
      bvm.listening = false
      rvm.init_pic!
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
      if curstep > 11
        window.clearInterval intervalc
        setTimeout(
          !->
            evm.result_gen!
          waiting_time+listening_time+100
        )
    waiting_time+listening_time+100
  )

