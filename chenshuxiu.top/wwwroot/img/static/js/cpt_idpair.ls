# 关卡开始后的有效监听时间
listening_time = 1500
# 关卡间隔时间
waiting_time = 1500

steps = []
while steps.length <= 30
  item = [0 to 3].map((x)-> 10 * Math.random! |> Math.floor)
  steps.push item
  if (4 * Math.random! |> Math.floor) is 0
    steps.push item



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

  capture: !->
    now = new Date
    dif = now - @begin_time
    @clicks.push {time: now}
    if @recording
      @responses.push {time: now, delay: dif}
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

  vnumstr: ""

  arr2str: (arr)->
    result = ""
    for x in arr
      result += x
    result

btn=
  $id: 'btn'

  listening: false

  kick_mole: !->
    zilean.capture!


effect =
  $id: 'effect'

  cover: false

  all:0
  vcount:0
  dif:0

  dif_comp: ->
    r = 0
    c = 0
    for x in zilean.responses
      if x and x.delay
        r += 1
        c += x.delay
    if (c/r/1000) then that.toFixed 3 else 0

  result_gen: !->
    evm.cover= true
    evm.all = zilean.clicks.length
    evm.dif = evm.dif_comp!


rvm = avalon.define root
bvm = avalon.define btn
pvm = avalon.define pre
evm = avalon.define effect

zilean = new TimeKeeper

step_checkout = (num)!->
  zilean.recording = true
  bvm.listening = true
  zilean.clicked = false
  rvm.vnumstr = rvm.arr2str steps[num]
  zilean.listen new Date

  # 数字展示后何时消失
  window.setTimeout(
    !->
      rvm.vnumstr = ""
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
