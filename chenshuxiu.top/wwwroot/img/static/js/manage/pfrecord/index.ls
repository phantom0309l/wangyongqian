pfmodel=
  $id: 'pf'
  visible: false

  jobs: sourcejobs

  job: false
  tree: []

  remark: ""

  jobcheck: (job)!->
    if Number(job.baseopjobid)
      $.get "/opjob/treeQueryNomeJson?sourceid=#{job.baseopjobid}&meid=#{job.id}", (data,status)!->
        pfvm.tree = data
    pfvm.job = job
    pfvm.open_window!

  job_sub: !->
    unless pfvm.remark
      alert "你的操作记录呢?"
      return
    $.post "/opjob/donejson",
      opjobid: pfvm.job.id
      remark: pfvm.remark,
      (data,status)!->
        if data is 'fine'
          alert "跟进记录提交成功"
          pfvm.jobs.remove pfvm.job
          pfvm.close_window!

  job_append: !->
    unless pfvm.remark
      alert "你的操作记录呢?"
      return
    $.post "/opjob/donejson",
      opjobid: pfvm.job.id
      remark: pfvm.remark
      treeneed: 't',
      (data,status)!->
        if data
            alert "本次记录提交成功"
            apfvm.tree = if data.length is 0 then [] else data
            apfvm.rec_and_open pfvm.job
            pfvm.jobs.remove pfvm.job
            pfvm.close_window!

  open_window: !->
    pfvm.visible = true

  close_window: !->
    pfvm.visible = false
    pfvm.pf = false
    pfvm.record = ""
    pfvm.tree = false

apfmodel=
  $id:  'apf'
  visible: false
  sublock: false

  type: false
  title: false
  title_tmp: ""

  domode: "tel"

  dotime: ""
  content: ""

  alarm_times: 1

  job: false
  tree: []

  type_check: (type,title)!->
    apfvm.type = type
    apfvm.title = title
  custom_type: !->
    apfvm.type = 'E'
    apfvm.title = apfvm.title_tmp

  domode_check: (str)!->
    apfvm.domode = str

  misssub: !->
    if apfvm.sublock
      return
    unless apfvm.type and apfvm.dotime
      alert "你必须选择一个日期或者任务类型"
      return
    apfvm.sublock = true
    $.post "/opjob/addJson",
      patientid: apfvm.job.patientid
      dotime: apfvm.dotime
      content: apfvm.content
      type: apfvm.type
      title: apfvm.title
      domode: apfvm.domode
      baseopjobid: if Number(apfvm.job.baseopjobid) then that else Number(apfvm.job.id),
      (data,status)!->
        if data is 'fine'
          alert "任务添加成功"
          apfvm.sublock = false
          apfvm.visible = false
          apfvm.init!
          $.get "/opjob/listTodayJson", (data,status)!->
            pfvm.jobs = data

  rec_and_open: (job)!->
    apfvm.visible = true
    apfvm.job = job

  init: !->
    apfvm.job= false
    apfvm.type = false
    apfvm.title = false
    apfvm.dotime = ""
    apfvm.content = ""
    apfvm.alarm_times = 3

  close_window: !->
    if apfvm.alarm_times != 0
      alert "一旦你关闭了这个窗口，你将无法再自行针对此跟进任务创建二次跟进记录，你还须确认#{apfvm.alarm_times - 1}次，方可关闭该窗口"
      apfvm.alarm_times -= 1
      return
    apfvm.visible = false
    apfvm.init!

pfvm = avalon.define pfmodel
apfvm = avalon.define apfmodel
