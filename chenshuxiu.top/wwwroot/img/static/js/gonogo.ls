g_cases = ["grb" "glb"]
r_cases = ["rrb" "rlb"]
steps = []
while steps.length <= 12
  if (3 * Math.random! |> Math.floor) == 0
    steps.push r_cases[2 * Math.random! |> Math.floor]
  else
    steps.push g_cases[2 * Math.random! |> Math.floor]

waiting_time = 1000
listening_time = 1000

class TimeKeeper

  # 游戏开始时间
  start_time: 0
  # 关卡开始时间
  begin_time: 0
  click_times: []
  response_times: []

  clicked: false
  recording: false

  listen: (date)!->
    @begin_time = date

  capture: (mole)!->
    now = new Date
    dif = now - @begin_time
    @click_times.push {mole: mole, time: now}
    if @recording
      @response_times.push {mole: mole, time: now, delay: dif}
      @recording = false
      @clicked = true

  step_end: !->
    unless @clicked
      @click_times.push null
      @response_times.push null
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


###   --- 
root =
  $id: 'root'

  lbc: "sil"
  rbc: "sil"

  color_init: !->
    rvm.lbc = 'sil'
    rvm.rbc = 'sil'

  color_activate: (ada)!->
    switch ada
    case 'rrb'
      rvm.rbc = 'ra'
    case 'grb'
      rvm.rbc = 'ga'
    case 'rlb'
      rvm.lbc = 'ra'
    case 'glb'
      rvm.lbc = 'ga'

  color_infer: (which,bc)->
    if bc == 'sil'
      return null
    if which == 'left'
      if bc == 'ra'
        'rlb'
      else
        'glb'
    else
      if bc == 'ra'
        'rrb'
      else
        'grb'

  kick_mole: (which,bc)!->
    zilean.capture rvm.color_infer(which,bc)

effect =
  $id: 'effect'

  cover: false

  all:0
  green:0
  red:0
  dif:0

  dif_comp: ->
    r = 0
    c = 0
    for x in zilean.response_times
      if x and x.delay
        r += 1
        c += x.delay
    if (c/r/1000) then that.toFixed 3 else 0

  color_comp: (color)->
    c = 0
    for x in zilean.response_times
      if x and x.mole and (x.mole[0] == color)
        c += 1
    c

  result_gen: !->
    evm.cover= true
    evm.all = zilean.click_times.length
    evm.dif = evm.dif_comp!
    evm.green = evm.color_comp 'g'
    evm.red = evm.color_comp 'r'

rvm = avalon.define root
pvm = avalon.define pre
evm = avalon.define effect
###   ---

zilean = new TimeKeeper

step_checkout = (num)!->
  zilean.recording = true
  zilean.clicked = false
  rvm.color_activate steps[num]
  window.action = steps[num]
  zilean.listen new Date
  window.setTimeout(
    !->
      rvm.color_init!
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
          waiting_time+listening_time
        )
    waiting_time+listening_time
  )
