m1model=
  $id: "m1"
  visible: false
  sublock: false

  deltmp: 0

  misses: gon.misses

  mistitle: ""
  miscontent: ""

  telpf: false
  msgpf: false

  tel_check: !->
    m1vm.telpf = !m1vm.telpf
  msg_check: !->
    m1vm.msgpf = !m1vm.msgpf

  init: !->
    m1vm.mistitle = ""
    m1vm.miscontent = ""

  missdel: (miss)!->
    if miss.id != m1vm.deltmp
      alert "你正在进行一个危险的操作，你需要确认后重复操作方可生效"
      m1vm.deltmp = miss.id
      return
    $.post "/man/opsmiss/del", id: miss.id, (data,status)!->
      if data is "fine"
        m1vm.misses.remove miss

  misssub: !->
    unless m1vm.mistitle and m1vm.miscontent
      alert "你在逗我?"
      return
    m1vm.sublock = true
    $.post "/man/opsmiss/create",
      title: m1vm.mistitle
      content: m1vm.miscontent,
      (data,status)!->
        if data
          alert "任务创建成功"
          m1vm.misses = data
          m1vm.close_window!
          m1vm.sublock = false

  send2em: (miss)!->
    emvm.rec miss

  open_window: !->
    m1vm.visible = true

  close_window: !->
    m1vm.visible = false
    m1vm.init!

emmodel=
  $id: "em"
  visible: false
  sublock: false

  miss: false

  anchor: "audited"
  tskew: ""
  skew_to: "+"
  pg: []
  sendway: "normal"
  pftype: "none"

  check_anchor: (anchor)!->
    emvm.anchor = anchor
  check_sk2: (skew)!->
    emvm.skew_to = skew
  check_sendway: (sendway)!->
    emvm.sendway = sendway
  check_pftype: (pftype)!->
    emvm.pftype = pftype

  execsub:!->
    if (emvm.pg.length is 0) or !emvm.tskew or (emvm.tskew.match /[^\d]/)
      alert "不选用户组和合法日期偏移值还要归档任务，你逗我?"
      return
    $.post "/man/opsmiss/file",
      mid: emvm.miss.id
      anchor: emvm.anchor
      time_skew: emvm.tskew
      skew_to: emvm.skew_to
      pg: emvm.pg.join!
      sendway: emvm.sendway
      pftype: emvm.pftype,
      (data,status)!->
        if data is 'fine'
          alert "任务归档成功"
          emvm.visible=false

  rec: (miss)!->
    emvm.miss = miss
    emvm.visible = true

  close_window: !->
    emvm.visible = false

m1vm = avalon.define m1model
emvm = avalon.define emmodel
