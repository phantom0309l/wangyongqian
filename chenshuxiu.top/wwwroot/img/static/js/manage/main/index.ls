pmodel=
  $id: "patients"
  patients: []

  # visible
  msg_v: false
  # -------

  msgstr: ""

  # 寄存被选中的患者的Id
  sel_ps: []
  msgtar: false

  pcheck: (obj)!->
    if obj.checking
      obj.checking = false
      pvm.sel_ps.remove obj.id
    else
      obj.checking = true
      pvm.sel_ps.push obj.id

  all_check_swc: false
  all_check: !->
    pvm.sel_ps = []
    if pvm.all_check_swc
      for x in pvm.patients
        x.checking = false
    else
      for x in pvm.patients
        x.checking = true
        pvm.sel_ps.push x.id
    pvm.all_check_swc = !pvm.all_check_swc

  patients_update: (patients)!->
    for x in patients
      x["checking"] = false
    pvm.patients = patients

  create_uf: (e,p)->
    e.stopPropagation!
    cufvm.rec p
    false

  get_grouppatient: (groupstr)->
      $.get "/patientmgr/listbygroupjson?groupstr=#{groupstr}",
          (data,status)!->
              pvm.patients = data


  msg_in: (e,p)!->
    e.stopPropagation!
    if p
      pvm.msgtar = p
    else
      if pvm.sel_ps.length == 0
        alert "你不能对空气发消息"
        return false
    pvm.msg_v = true
  msg_off: !->
    pvm.msgstr = ""
    pvm.msgtar = false
    pvm.msg_v = false
  msg_send: !->
    if pvm.msgtar
      ps = pvm.msgtar.id
    else
      ps = pvm.sel_ps.join ","
    $.post "/patientmgr/groupmsgsend",
      (patientids: ps, content: pvm.msgstr),
      (data,status)!->
        if data == 'fine'
          pvm.msg_off!
          alert "消息发送成功"

filmodel=
  $id: 'pfil'

  dlock: false
  qrlock: false
  audlock: false
  sheetlock: false
  aptlock: false
  drulock: false

  uristr: ""

  dstr: ""
  drstr: ""

  doc_fil: !->
    if ftvm.dlock
      ftvm.dlock = false
      ftvm.uristr = ftvm.uristr.replace /doctor.*?&/,""
    else
      ftvm.dlock = true
      ftvm.uristr += "doctor_name=#{ftvm.dstr}&"

  qr_fil: !->
    str = "qrcode=t&"
    if ftvm.qrlock
      ftvm.qrlock = false
      ftvm.uristr = ftvm.uristr.replace str,""
    else
      ftvm.qrlock = true
      ftvm.uristr += str

  aud_fil: !->
    str = 'not_audited=t&'
    if ftvm.audlock
      ftvm.audlock = false
      ftvm.uristr = ftvm.uristr.replace str,""
    else
      ftvm.audlock = true
      ftvm.uristr += str

  asses_fil: !->
    str = 'asses=t&'
    if ftvm.sheetlock
      ftvm.sheetlock = false
      ftvm.uristr = ftvm.uristr.replace str,""
    else
      ftvm.sheetlock = true
      ftvm.uristr += str

  apt_fil: !->
    str = 'appointment=t&'
    if ftvm.aptlock
      ftvm.aptlock = false
      ftvm.uristr = ftvm.uristr.replace str,""
    else
      ftvm.aptlock = true
      ftvm.uristr += str

  dru_fil: !->
    if ftvm.drulock
      ftvm.drulock = false
      ftvm.uristr = ftvm.uristr.replace /drug.*?&/,""
    else
      ftvm.drulock = true
      ftvm.uristr += "drug=#{ftvm.dstr}&"

  dname_sync: !->
    ftvm.uristr = ftvm.uristr.replace /doctor_name=.*?&/, "doctor_name=#{ftvm.dstr}&"
  drname_sync: !->
    ftvm.uristr = ftvm.uristr.replace /drug=.*?&/, "drug=#{ftvm.drstr}&"

  nobubble:(e)!->
    e.stopPropagation!

  doit:!->
    url = '/patientmgr/listbyfilters?'+ ftvm.uristr
    $.get url, (data,status)!->
      pvm.patients_update data

gopmodel=
  $id: "gop"

  confirm_v:false

  quri: ""

  register_urge:!->
    gopvm.quri = "/patientmgr/registerurge"
    gopvm.confirm_v = true

  asses_urge:!->
    gopvm.quri = "/patientmgr/assesurge"
    gopvm.confirm_v = true

  homework_urge:!->
    gopvm.quri = "/api/gopr/homework_urge"
    gopvm.confirm_v = true

  confirm_continue:!->
    $.get gopvm.quri, (data,status)!->
      null
    gopvm.confirm_v = false
    alert "操作成功，在微信中接收结果反馈"
  confirm_cancel: !->
    gopvm.confirm_v = false

cufmodel=
  $id: "cuf"
  visible: false
  sublock: false

  patient: false

  type: false
  title: false
  title_tmp: ""

  domode: "tel"

  dotime: ""
  comment: ""

  init: !->
    cufvm.patient= false
    cufvm.type = false
    cufvm.title = false
    cufvm.dotime = ""
    cufvm.comment = ""
  close_and_init: !->
    cufvm.close_window!
    cufvm.init!

  type_check: (type, title)!->
    cufvm.type = type
    cufvm.title = title

  custom_type: !->
    cufvm.type = 'E'
    cufvm.title = cufvm.title_tmp

  exway_check: (str)!->
    cufvm.exway = str

  misssub: !->
    if cufvm.sublock
      return
    unless cufvm.type and cufvm.dotime
      alert "你必须选择一个日期或者任务类型"
      return
    cufvm.sublock = true
    $.post "/opjob/addjson",
      patientid: cufvm.patient.id
      dotime: cufvm.dotime
      content: cufvm.content
      type: cufvm.type
      domode: cufvm.domode
      title: cufvm.title,
      (data,status)!->
        if data is 'fine'
          alert "任务添加成功"
          cufvm.sublock = false

  rec: (p)!->
    if p.is_audited is '0'
        alert "你只能对一个审核过的用户进行该操作"
        return
    cufvm.init!
    cufvm.patient = p
    cufvm.visible = true

  close_window: !->
    cufvm.visible = false


pjgmodel =
  $id: "pjgrp"
  visible: false

  patient: false
  grp_checked_desc: "未选择"
  grp_checked: false

  init: !->
    pjgvm.grp_checked_desc = "未选择"
    pjgvm.grp_checked = false

  grp_check: (desc,pra)!->
    pjgvm.grp_checked_desc = desc
    pjgvm.grp_checked = pra

  send2cuf: (aid)!->
    cufvm.rec pjgvm.patient
    $(aid).click!


  next_patient: !->
    unless pjgvm.grp_checked
      alert "You must check one group at least"
      return
    $.post "/patientmgr/joingroupJson",{patientid: pjgvm.patient.id, groupstr: pjgvm.grp_checked}, (data,status)!->
      if data == 'fine'
        pjgvm.init!
        pjgvm.open_window!
        pjgvm.patient=data
      else
        alert "分组失败"

  open_window: !->
      $.get "/patientmgr/getNoGroupPatientJson", (data,status)->
          if data != 'null'
              pjgvm.patient = data
              pjgvm.visible = true
          else
              alert "Here is no more patient"

  close_window: !->
    pjgvm.visible = false

pjgvm = avalon.define pjgmodel
cufvm = avalon.define cufmodel
pvm = avalon.define pmodel
ftvm = avalon.define filmodel
gopvm = avalon.define gopmodel
pvm.patients_update patients_createbyphp

