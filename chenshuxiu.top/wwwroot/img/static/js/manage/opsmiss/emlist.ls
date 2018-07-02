m1model=
  $id: "m1"

  misses: gon.misses

  deltmp: 0

  tanchor_trans: (anchor)->
    switch anchor
    case "audited" then "审核通过时间"
    case "nextDrug" then "预计复诊/开药时间"
    case "nextVisit" then "预约复诊时间"

  tsway_trans: (sw)->
    switch sw
    case "normal" then "标准"
    case "wechat" then "仅微信"
    case "message" then '仅短信'

  missdel: (miss)!->
    if miss.id != m1vm.deltmp
      alert "你正在进行一个危险的操作，你需要确认后重复操作方可生效"
      m1vm.deltmp = miss.id
      return
    $.post "/man/opsmiss/dump", id: miss.id, (data,status)!->
      if data is "fine"
        m1vm.misses.remove miss

m1vm = avalon.define m1model
