// Ecology Center — 垃圾清运 becomes a status-driven panel with dynamic state + full closed loop.
//   1. Replace ecoGarbagePoints with unified data model (id/villageId/gridId/name/locationText/lat/lng/fillLevel/status/…)
//   2. status enum: NORMAL/WAITING/DELAYED/FULL/CLEANING/COMPLETED with per-status buttons
//   3. showGarbageService = panel (哪里 / 状态 / 我能做什么); openGarbagePoint = single detail (for 告警联动)
//   4. 告警 "垃圾清运延迟" -> garbagePointId -> openGarbagePointById (联动)
//   5. 上报问题 复用事件上报表单 + 自动带入 类型/子类型/地点/GPS/描述
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. ecoPill adds blue tone =====
const a1 = `  const map = {
    green: 'background:rgba(34,181,115,0.12);color:#22B573',
    amber: 'background:rgba(242,166,43,0.14);color:#C07C00',
    red: 'background:rgba(224,82,82,0.12);color:#E05252'
  }`;
const n1 = `  const map = {
    green: 'background:rgba(34,181,115,0.12);color:#22B573',
    amber: 'background:rgba(242,166,43,0.14);color:#C07C00',
    red: 'background:rgba(224,82,82,0.12);color:#E05252',
    blue: 'background:rgba(40,150,220,0.14);color:#1E88D0'
  }`;
if (s.includes(a1)) { s = s.replace(a1, n1); check('1-ecoPill-blue', true); }
else { check('1-ecoPill-blue', false); }

// ===== 2. Replace garbage data with unified model =====
const a2 = `const ecoGarbagePoints = ref([
  { name: '村东收集点', icon: '🏘️', status: '已清运', tone: 'green', today: '今日 07:30 已清运', expect: '明日 07:30 前', distance: '约 200m' },
  { name: '1组垃圾点', icon: '📍', status: '未清运', tone: 'amber', today: '今日未清运 · 已超 24h', expect: '预计 2 小时内', distance: '约 150m' },
  { name: '文化广场', icon: '🎭', status: '正常', tone: 'green', today: '今日 18:00 清运', expect: '今日 18:00', distance: '约 400m' }
])
const ecoGarbageReports = ref([])`;
const n2 = `const ecoGarbagePoints = ref([
  { id: 'TRASH_001', villageId: 'ZY001', gridId: 'GRID_03', name: '1组村口垃圾点', locationText: '中堰村1组村口', latitude: 34.1268, longitude: 108.2304, fillLevel: 10, status: 'COMPLETED', lastCleanedAt: '2026-08-13 09:20', plannedCleanAt: '2026-08-14 08:30' },
  { id: 'TRASH_002', villageId: 'ZY001', gridId: 'GRID_03', name: '3组晒场垃圾点', locationText: '中堰村3组晒场东侧', latitude: 34.1291, longitude: 108.2347, fillLevel: 80, status: 'WAITING', lastCleanedAt: '2026-08-12 17:00', plannedCleanAt: '2026-08-13 17:00' },
  { id: 'TRASH_003', villageId: 'ZY001', gridId: 'GRID_03', name: '村东路口垃圾点', locationText: '中堰村村东路口', latitude: 34.1315, longitude: 108.2389, fillLevel: 95, status: 'DELAYED', lastCleanedAt: '2026-08-12 07:00', plannedCleanAt: '2026-08-13 08:00', delayHours: 2 }
])`;
if (s.includes(a2)) { s = s.replace(a2, n2); check('2-garbage-data-model', true); }
else { check('2-garbage-data-model', false); }

// ===== 3. Rewrite garbage functions (status-driven panel + detail + actions) =====
const a3 = String.raw`function showGarbageService() {
  const pts = ecoGarbagePoints.value
  let rows = ''
  pts.forEach(function(p, i) {
    rows += '<div onclick="window._svc.openGarbagePoint(' + i + ')" style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:#FFFFFF;border:1px solid #E3EAF0;border-radius:8px;cursor:pointer;margin-bottom:8px;transition:all .2s" onmouseover="this.style.borderColor=\'#22B573\';this.style.background=\'rgba(34,181,115,0.04)\'" onmouseout="this.style.borderColor=\'#E3EAF0\';this.style.background=\'#FFFFFF\'">' +
      '<span style="font-size:22px">' + p.icon + '</span>' +
      '<div style="flex:1;min-width:0"><div style="font-size:16px;font-weight:600;color:#1F2D3D">' + p.name + '<span style="font-size:13px;color:#66788A;font-weight:400;margin-left:6px">' + p.distance + '</span></div>' +
      '<div style="font-size:14px;color:#66788A;margin-top:3px">🕐 预计清运：' + p.expect + '</div></div>' +
      ecoPill(p.status, p.tone) +
      '</div>'
  })
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><span style="font-size:15px;color:#66788A">📍 所在片区：</span><span style="font-size:16px;color:#1F2D3D;font-weight:700">1组片区 · 第2网格</span></div>' +
    '<p style="color:#66788A;font-size:15px;margin:0 0 12px 0;line-height:1.6">本片区垃圾点今日清运状态，垃圾满溢或未清运可点击报告。</p>' +
    rows +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-outline" onclick="window._toast && window._toast(\'已为您接通保洁员\',\'info\')">📞 联系保洁员</button>' +
    '<button class="btn btn-primary" onclick="window._svc.openGarbagePoint(1)">🗑 查看待清运点</button>' +
    '</div></div>'
  openGovModal('🗑 垃圾清运', h)
}
function openGarbagePoint(idx) {
  const p = ecoGarbagePoints.value[idx]
  if (!p) return
  const reports = ecoGarbageReports.value.filter(function(r) { return r.pointIdx === idx })
  let reportHtml = ''
  reports.forEach(function(r) {
    reportHtml += '<div style="padding:10px 0;border-bottom:1px solid #F0F3F5"><div style="font-size:14px;color:#1F2D3D;font-weight:600">🗑 ' + r.type + '</div><div style="font-size:13px;color:#66788A;margin-top:3px">' + r.time + ' · ' + r.status + '</div></div>'
  })
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><span style="font-size:26px">' + p.icon + '</span><div><div style="font-size:17px;color:#1F2D3D;font-weight:700">' + p.name + '</div><div style="font-size:14px;color:#66788A">' + p.distance + '</div></div>' +
    '<span style="margin-left:auto">' + ecoPill(p.status, p.tone) + '</span></div>' +
    '<div style="display:flex;flex-direction:column;margin-bottom:16px">' +
    ecoAlertField('🗑 今日清运状态', p.today) +
    ecoAlertField('🕐 预计清运时间', p.expect) +
    '</div>' +
    (reportHtml ? '<div style="margin-bottom:16px"><div style="font-size:15px;color:#1F2D3D;font-weight:700;margin-bottom:6px">📋 我的报告</div>' + reportHtml + '</div>' : '') +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-outline" onclick="window._svc.openGarbageReport(' + idx + ')">🗑 报告满溢/未清运</button>' +
    '<button class="btn btn-primary" onclick="window._toast && window._toast(\'已为您接通保洁员\',\'info\')">📞 联系保洁员</button>' +
    '</div></div>'
  openGovModal(p.name + ' · 垃圾点', h)
}
function openGarbageReport(idx) {
  const p = ecoGarbagePoints.value[idx]
  if (!p) return
  const h = '<div style="padding:12px 0">' +
    '<p style="color:#66788A;font-size:15px;margin:0 0 14px 0;line-height:1.6">报告「' + p.name + '」的垃圾问题，选择类型后保洁员将尽快处理。</p>' +
    '<div style="display:flex;gap:8px;margin-bottom:14px">' +
    '<button class="btn btn-primary btn-sm" onclick="window._svc.submitGarbageReport(' + idx + ',0)">🗑 垃圾满溢</button>' +
    '<button class="btn btn-outline btn-sm" onclick="window._svc.submitGarbageReport(' + idx + ',1)">⏳ 未清运</button>' +
    '</div>' +
    '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:10px 12px">' +
    '<span style="font-size:14px;color:#1E7A54">💡 报告后将自动通知网格员与保洁员。</span></div>' +
    '</div>'
  openGovModal('报告垃圾问题', h)
}
function submitGarbageReport(idx, typeCode) {
  const p = ecoGarbagePoints.value[idx]
  if (!p) return
  const typeName = typeCode === 0 ? '垃圾满溢' : '未清运'
  p.status = '已上报·待处理'
  p.tone = 'amber'
  ecoGarbageReports.value.push({ pointIdx: idx, type: typeName, time: '刚刚', status: '已通知网格员王大爷' })
  toast(typeName + ' 已上报，保洁员将尽快处理', 'success')
  openGarbagePoint(idx)
}`;

const n3 = String.raw`function garbageStatusMeta(status) {
  const map = {
    NORMAL: { text: '正常', tone: 'green', icon: '✅' },
    WAITING: { text: '待清运', tone: 'amber', icon: '🟠' },
    DELAYED: { text: '清运延迟', tone: 'red', icon: '🔴' },
    FULL: { text: '垃圾满溢', tone: 'red', icon: '🔴' },
    CLEANING: { text: '清运中', tone: 'blue', icon: '🚚' },
    COMPLETED: { text: '已清运', tone: 'green', icon: '✅' }
  }
  return map[status] || { text: status, tone: 'green', icon: '✅' }
}
function formatGarbageTime(dt) {
  if (!dt) return '待定'
  const d = dt.split(' ')[0]
  const t = (dt.split(' ')[1] || '').slice(0, 5)
  if (d === '2026-08-13') return '今天 ' + t
  if (d === '2026-08-14') return t < '12:00' ? '明天上午' : '明天 ' + t
  return d + ' ' + t
}
function garbageActions(p, i) {
  if (p.status === 'COMPLETED') return '<button class="btn btn-outline btn-sm" onclick="event.stopPropagation();window._svc.viewGarbageLocation(' + i + ')">📍 查看位置</button>'
  if (p.status === 'WAITING') return '<button class="btn btn-outline btn-sm" onclick="event.stopPropagation();window._svc.viewGarbageLocation(' + i + ')">📍 查看位置</button><button class="btn btn-outline btn-sm" onclick="event.stopPropagation();window._svc.remindClean(' + i + ')">🔔 提醒清运</button>'
  if (p.status === 'DELAYED') return '<button class="btn btn-outline btn-sm" onclick="event.stopPropagation();window._svc.viewGarbageLocation(' + i + ')">📍 查看位置</button><button class="btn btn-outline btn-sm" onclick="event.stopPropagation();window._svc.reportGarbage(' + i + ')">📷 上报问题</button>'
  if (p.status === 'FULL') return '<button class="btn btn-outline btn-sm" onclick="event.stopPropagation();window._svc.viewGarbageLocation(' + i + ')">📍 查看位置</button><button class="btn btn-primary btn-sm" onclick="event.stopPropagation();window._svc.reportGarbage(' + i + ')">🚨 立即上报</button>'
  return '<span style="font-size:13px;color:#1E88D0;font-weight:600">🚚 正在清运</span>'
}
function garbageMetaLine(p) {
  if (p.status === 'COMPLETED') return '🕐 最近清运：' + formatGarbageTime(p.lastCleanedAt) + ' · 下次计划：' + formatGarbageTime(p.plannedCleanAt)
  if (p.status === 'WAITING') return '📦 已满载 ' + p.fillLevel + '% · 🕐 预计清运：' + formatGarbageTime(p.plannedCleanAt)
  if (p.status === 'DELAYED') return '⚠️ 已超过计划清运时间 ' + (p.delayHours || 2) + ' 小时'
  if (p.status === 'FULL') return '⚠️ 垃圾已满溢（' + p.fillLevel + '%），请及时处理'
  return '🚚 保洁员正在清运中…'
}
function showGarbageService() {
  const pts = ecoGarbagePoints.value
  let rows = ''
  pts.forEach(function(p, i) {
    const m = garbageStatusMeta(p.status)
    const metaColor = (p.status === 'DELAYED' || p.status === 'FULL') ? '#E05252' : (p.status === 'CLEANING' ? '#1E88D0' : '#66788A')
    rows += '<div onclick="window._svc.openGarbagePoint(' + i + ')" style="background:#FFFFFF;border:1px solid #E3EAF0;border-radius:10px;padding:14px;margin-bottom:10px;cursor:pointer;transition:all .2s" onmouseover="this.style.borderColor=\'#22B573\';this.style.background=\'rgba(34,181,115,0.03)\'" onmouseout="this.style.borderColor=\'#E3EAF0\';this.style.background=\'#FFFFFF\'">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:16px;font-weight:600;color:#1F2D3D">' + p.name + '</span><span style="margin-left:auto">' + ecoPill(m.icon + ' ' + m.text, m.tone) + '</span></div>' +
      '<div style="font-size:14px;color:' + metaColor + '">' + garbageMetaLine(p) + '</div>' +
      '<div style="display:flex;gap:8px;margin-top:10px;padding-top:10px;border-top:1px dashed #E3EAF0">' + garbageActions(p, i) + '</div>' +
      '</div>'
  })
  const h = '<div style="padding:12px 0">' +
    '<div style="font-size:16px;color:#1F2D3D;font-weight:700;margin-bottom:4px">📍 所在区域：中堰村 第3网格</div>' +
    '<div style="font-size:13px;color:#66788A;margin-bottom:14px">🕐 更新时间：今天 15:40</div>' +
    '<div style="font-size:15px;color:#1F2D3D;font-weight:700;margin:0 0 10px 0">垃圾点状态</div>' +
    rows +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-outline" onclick="window._toast && window._toast(\'已为您接通保洁员\',\'info\')">📞 联系保洁员</button>' +
    '</div></div>'
  openGovModal('🗑 垃圾清运', h)
}
function openGarbagePoint(idx) {
  const p = ecoGarbagePoints.value[idx]
  if (!p) return
  const m = garbageStatusMeta(p.status)
  let meta = ''
  if (p.status === 'COMPLETED') {
    meta = ecoAlertField('🕐 最近清运', formatGarbageTime(p.lastCleanedAt)) + ecoAlertField('🗓 下次计划', formatGarbageTime(p.plannedCleanAt))
  } else if (p.status === 'WAITING') {
    meta = ecoAlertField('📦 已满载', p.fillLevel + '%') + ecoAlertField('🕐 预计清运', formatGarbageTime(p.plannedCleanAt))
  } else if (p.status === 'DELAYED') {
    meta = ecoAlertField('⏰ 已延迟', '超过计划时间 ' + (p.delayHours || 2) + ' 小时') + ecoAlertField('📦 已满载', p.fillLevel + '%')
  } else if (p.status === 'FULL') {
    meta = ecoAlertField('🚨 状态', '垃圾满溢') + ecoAlertField('📦 已满载', p.fillLevel + '%')
  } else {
    meta = ecoAlertField('🚚 状态', '清运中') + ecoAlertField('🕐 预计清运', formatGarbageTime(p.plannedCleanAt))
  }
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px"><span style="font-size:17px;color:#1F2D3D;font-weight:700">' + p.name + '</span><span style="margin-left:auto">' + ecoPill(m.icon + ' ' + m.text, m.tone) + '</span></div>' +
    '<div style="font-size:13px;color:#66788A;margin-bottom:14px">📍 ' + p.locationText + '</div>' +
    '<div style="display:flex;flex-direction:column;margin-bottom:16px">' + meta + '</div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' + garbageActions(p, idx) + '</div></div>'
  openGovModal(p.name, h)
}
function viewGarbageLocation(idx) {
  const p = ecoGarbagePoints.value[idx]
  if (!p) return
  toast('已打开地图定位「' + p.locationText + '」', 'info')
}
function remindClean(idx) {
  const p = ecoGarbagePoints.value[idx]
  if (!p) return
  toast('已提醒保洁员清运「' + p.name + '」，预计 ' + formatGarbageTime(p.plannedCleanAt) + ' 到达', 'success')
}
function reportGarbage(idx) {
  const p = ecoGarbagePoints.value[idx]
  if (!p) { reportEnvironment(); return }
  const desc = p.status === 'FULL' ? '该垃圾点存在垃圾满溢情况，请及时清运。'
             : p.status === 'DELAYED' ? '该垃圾点存在清运延迟情况，请及时清运。'
             : '该垃圾点已接近满载，请及时清运。'
  reportEnvironment({ location: p.name, source: '环境卫生', subType: '垃圾清运', desc: desc, lat: p.latitude, lng: p.longitude })
}
function openGarbagePointById(id) {
  const p = ecoGarbagePoints.value.find(function(x) { return x.id === id })
  if (p) openGarbagePoint(ecoGarbagePoints.value.indexOf(p))
}`;

if (s.includes(a3)) { s = s.replace(a3, n3); check('3-garbage-functions', true); }
else { check('3-garbage-functions', false); }

// ===== 4. Garbage alert -> link by garbagePointId =====
const a4 = `  { id: 3, icon: '🗑️', title: '垃圾清运延迟提醒', desc: '1组垃圾点超过24h未清运', time: '3小时前 · 已通知保洁', actionLabel: '查看清运情况',
    where: '1组垃圾点', current: '已超 24h 未清运', standard: '日产日清', risk: '轻度风险：蚊虫滋生隐患', advice: '生活垃圾请打包扎紧，可申请加急清运' }`;
const n4 = `  { id: 3, icon: '🗑️', title: '垃圾清运延迟提醒', desc: '村东路口垃圾点超过计划时间未清运', time: '3小时前 · 已通知保洁', actionLabel: '查看清运情况', garbagePointId: 'TRASH_003',
    where: '村东路口垃圾点', current: '已超计划时间 2 小时', standard: '日产日清', risk: '轻度风险：蚊虫滋生隐患', advice: '生活垃圾请打包扎紧，可申请加急清运' }`;
if (s.includes(a4)) { s = s.replace(a4, n4); check('4-garbage-alert-link', true); }
else { check('4-garbage-alert-link', false); }

// ===== 5a. openEcoAlertDetail redirects garbage alerts =====
const a5a = `function openEcoAlertDetail(a) {
  if (a.waterBody) { openWaterBodyDetail(a.waterBody); return }
  const h = '<div style="padding:12px 0">' +`;
const n5a = `function openEcoAlertDetail(a) {
  if (a.waterBody) { openWaterBodyDetail(a.waterBody); return }
  if (a.garbagePointId) { openGarbagePointById(a.garbagePointId); return }
  const h = '<div style="padding:12px 0">' +`;
if (s.includes(a5a)) { s = s.replace(a5a, n5a); check('5a-alert-garbage-redirect', true); }
else { check('5a-alert-garbage-redirect', false); }

// ===== 5b. Simplify alert button (drop dead id===3 branch) =====
const a5b = `    (a.id === 3
      ? '<button class="btn btn-primary" onclick="window._svc.openGarbagePoint(1)">🚚 查看清运情况</button>'
      : '<button class="btn btn-primary" onclick="window._svc.reportEnvironment()">📷 上报问题</button>') +`;
const n5b = `    '<button class="btn btn-primary" onclick="window._svc.reportEnvironment()">📷 上报问题</button>' +`;
if (s.includes(a5b)) { s = s.replace(a5b, n5b); check('5b-alert-button-simplify', true); }
else { check('5b-alert-button-simplify', false); }

// ===== 6. selectReportType pre-fills GPS + desc =====
const a6 = `  _reportContext = context || null
  if (context && context.location) _reportLocation = context.location
  renderReportForm()
}`;
const n6 = `  _reportContext = context || null
  if (context && context.location) _reportLocation = context.location
  if (context && context.desc) _reportDesc = context.desc
  if (context && context.lat != null && context.lng != null) {
    _reportLat = context.lat
    _reportLng = context.lng
    _reportGpsStatus = 'located'
  }
  renderReportForm()
}`;
if (s.includes(a6)) { s = s.replace(a6, n6); check('6-selectReportType-gps-desc', true); }
else { check('6-selectReportType-gps-desc', false); }

// ===== 7. Textarea pre-fill description =====
const a7 = `    h += '<textarea id="reportDescInput" placeholder="请详细描述您遇到的问题，例如：路灯不亮已持续3天，影响夜间出行安全..." style="width:100%;height:100px;background:#FFFFFF;border:1px solid #D4DCE6;border-radius:8px;color:#1F2D3D;padding:10px 12px;font-size:12px;font-family:inherit;resize:vertical;box-sizing:border-box"></textarea></div>'`;
const n7 = `    h += '<textarea id="reportDescInput" placeholder="请详细描述您遇到的问题，例如：路灯不亮已持续3天，影响夜间出行安全..." style="width:100%;height:100px;background:#FFFFFF;border:1px solid #D4DCE6;border-radius:8px;color:#1F2D3D;padding:10px 12px;font-size:12px;font-family:inherit;resize:vertical;box-sizing:border-box">' + (_reportDesc || '') + '</textarea></div>'`;
if (s.includes(a7)) { s = s.replace(a7, n7); check('7-textarea-desc-prefill', true); }
else { check('7-textarea-desc-prefill', false); }

// ===== 8. Add subType to context banner =====
const a8 = `      if (_reportContext.problemType) h += '<div style="font-size:12px;color:#475867">📋 问题类型：' + _reportContext.problemType + '</div>'`;
const n8 = `      if (_reportContext.problemType) h += '<div style="font-size:12px;color:#475867">📋 问题类型：' + _reportContext.problemType + '</div>'
      if (_reportContext.subType) h += '<div style="font-size:12px;color:#475867">🏷️ 子类型：' + _reportContext.subType + '</div>'`;
if (s.includes(a8)) { s = s.replace(a8, n8); check('8-banner-subtype', true); }
else { check('8-banner-subtype', false); }

// ===== 9. Register new handlers =====
const a9 = `    showMyEventDetailById, filterMyReports, previewPhoto, openGarbagePoint, openGarbageReport, submitGarbageReport, requestStraw, reportEnvironment, viewWaterAlert,
    openWaterBodyByIdx, reportWaterSupplement, viewWaterLocation, reportFromMonitor,`;
const n9 = `    showMyEventDetailById, filterMyReports, previewPhoto, openGarbagePoint, openGarbagePointById, viewGarbageLocation, remindClean, reportGarbage, requestStraw, reportEnvironment, viewWaterAlert,
    openWaterBodyByIdx, reportWaterSupplement, viewWaterLocation, reportFromMonitor,`;
if (s.includes(a9)) { s = s.replace(a9, n9); check('9-register-garbage-handlers', true); }
else { check('9-register-garbage-handlers', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== ECOLOGY GARBAGE PANEL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
