// Ecology Center — 完成农户端核心闭环 + 统一片区 + 事件来源区分 + 上报成功进“我的上报”。
//   1. 片区统一：currentArea 单一数据源（中堰村 → 1组片区 → 第2网格），垃圾点 gridId=GRID_02
//   2. 事件来源区分：environment_event.source = MANUAL_REPORT | MONITOR_ALERT_SUPPLEMENT
//   3. 上报成功 → 事件编号 ST... + 待受理 + 落入 myEvents（“我的上报”可跟踪）
//   4. “环境问题上报”入口 = 我要上报 + 我的上报
//   5. 提醒清运改名“提醒一下” + 防重复（reminded）
//   6. 联系保洁员不暴露私人手机号（公开服务热线，后台按 village_id+grid_id 配置）
//   7. 问题描述占位文字按类型动态化
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }
function gsub(oldStr, newStr) { const before = s; s = s.split(oldStr).join(newStr); return s !== before; }

// ===== 1. 模块级变量：事件来源 + 序号 + 最近事件编号 =====
const a1 = `let _reportContext = null`;
const n1 = `let _reportContext = null
let _reportSource = 'MANUAL_REPORT' // 事件来源：MANUAL_REPORT 农户主动上报 | MONITOR_ALERT_SUPPLEMENT 监测告警补充
let _reportSeq = 0
let _lastReportId = ''`;
if (s.includes(a1)) { s = s.replace(a1, n1); check('1-report-vars', true); }
else { check('1-report-vars', false); }

// ===== 2. 动态占位文字 helper（按类型） =====
const a2 = `function renderReportForm() {`;
const n2 = `function reportPlaceholder() {
  if (_reportContext && _reportContext.problemType === '水质问题') return '例如：水体有异味、颜色异常、发现漂浮物等'
  const map = {
    infrastructure: '例如：路灯不亮、道路破损、水管漏水等',
    environment: '例如：村口垃圾堆积、污水外溢、绿化受损等',
    safety: '例如：井盖缺失、电线裸露、消防通道堵塞等',
    agriculture: '例如：灌溉水压不足、作物虫害、施肥困难等',
    elderly: '例如：独居老人需要上门帮助、代买药品等',
    other: '请详细描述您遇到的问题'
  }
  return map[_reportType] || '请详细描述您遇到的问题'
}
function renderReportForm() {`;
if (s.includes(a2)) { s = s.replace(a2, n2); check('2-reportPlaceholder-helper', true); }
else { check('2-reportPlaceholder-helper', false); }

// ===== 3. 问题描述 textarea 占位文字动态化 =====
const a3 = `placeholder="请详细描述您遇到的问题，例如：路灯不亮已持续3天，影响夜间出行安全..."`;
const n3 = `placeholder="' + reportPlaceholder() + '"`;
if (s.includes(a3)) { s = s.replace(a3, n3); check('3-dynamic-placeholder', true); }
else { check('3-dynamic-placeholder', false); }

// ===== 4. 上报成功页：事件编号 + 待受理 + 我的上报入口 =====
const a4 = `  } else if (_reportStep === 3) {
    let h = '<div style="text-align:center;padding:24px 0"><div style="font-size:48px;margin-bottom:12px">✅</div>'
    h += '<h4 style="color:#22B573;margin:0 0 8px 0;font-size:15px">上报成功！</h4>'
    h += '<p style="color:#475867;font-size:12px;margin:0 0 4px 0">您的事件已提交，网格员将尽快处理</p>'
    h += '<p style="color:#66788A;font-size:11px;margin:0 0 20px 0">事件编号：<span style="color:#19B98A">#EV' + String(new Date().getMonth() + 1).padStart(2, '0') + String(new Date().getDate()).padStart(2, '0') + '</span></p>'
    h += '<button class="btn btn-primary" onclick="window._svc.closeAndRefresh()">查看我的上报</button></div>'
    openGovModal('事件上报', h)
  }`;
const n4 = `  } else if (_reportStep === 3) {
    let h = '<div style="text-align:center;padding:24px 0"><div style="font-size:48px;margin-bottom:12px">✅</div>'
    h += '<h4 style="color:#22B573;margin:0 0 8px 0;font-size:15px">上报成功</h4>'
    h += '<p style="color:#66788A;font-size:12px;margin:0 0 4px 0">事件编号：<span style="color:#1F2D3D;font-weight:700">' + (_lastReportId || '') + '</span></p>'
    h += '<p style="color:#66788A;font-size:12px;margin:0 0 4px 0">当前状态：<span style="color:#19B98A;font-weight:600">待受理</span></p>'
    h += '<p style="color:#66788A;font-size:11px;margin:0 0 20px 0">可在「我的上报」查看处理进度</p>'
    h += '<button class="btn btn-primary" onclick="window._svc.closeAndRefresh()">查看我的上报</button></div>'
    openGovModal('事件上报', h)
  }`;
if (s.includes(a4)) { s = s.replace(a4, n4); check('4-success-step', true); }
else { check('4-success-step', false); }

// ===== 5. selectReportType：记录事件来源 =====
const a5 = `  _reportContext = context || null
  if (context && context.location) _reportLocation = context.location`;
const n5 = `  _reportContext = context || null
  _reportSource = (context && context.eventSource) || 'MANUAL_REPORT'
  if (context && context.location) _reportLocation = context.location`;
if (s.includes(a5)) { s = s.replace(a5, n5); check('5-selectReportType-source', true); }
else { check('5-selectReportType-source', false); }

// ===== 6. submitReport：生成 ST 编号 + 落入 myEvents =====
const a6 = `  _reportDesc = desc
  _reportLocation = loc
  // Build report data (reserved for API)
  const reportData = {
    event_id: '#EV' + String(new Date().getMonth() + 1).padStart(2, '0') + String(new Date().getDate()).padStart(2, '0'),
    village_id: 'zhongyan',
    farmer_id: 'farmer_001',
    category: _reportType,
    description: _reportDesc,
    location_text: _reportLocation,
    latitude: _reportLat,
    longitude: _reportLng,
    location_accuracy: _reportAccuracy,
    photos: _reportPhotos.map(function(p) { return { name: p.name, size: p.size } }),
    status: '已提交',
    created_at: new Date().toISOString()
  }
  console.log('Event report submitted:', reportData)
  _reportStep = 3
  renderReportForm()
  toast('事件上报成功！', 'success')
}`;
const n6 = `  _reportDesc = desc
  _reportLocation = loc
  // 生成事件编号 + 统一环境事件（source 区分 农户主动 / 监测告警补充）
  _reportSeq++
  const now = new Date()
  const ymd = String(now.getFullYear()) + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0')
  const eventId = 'ST' + ymd + String(_reportSeq).padStart(3, '0')
  const timeStr = (now.getMonth() + 1) + '月' + now.getDate() + '日 ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')
  const typeLabelMap = { infrastructure: '基础设施', environment: '环境卫生', safety: '安全隐患', agriculture: '农业生产', elderly: '老人关怀', other: '其他事项' }
  const typeLabel = typeLabelMap[_reportType] || '其他事项'
  _lastReportId = eventId
  // 统一环境事件对象（保留供后端 API 使用）
  const reportData = {
    event_id: eventId,
    source: _reportSource,
    village_id: 'zhongyan',
    farmer_id: 'farmer_001',
    category: _reportType,
    description: _reportDesc,
    location_text: _reportLocation,
    latitude: _reportLat,
    longitude: _reportLng,
    location_accuracy: _reportAccuracy,
    photos: _reportPhotos.map(function(p) { return { name: p.name, size: p.size } }),
    status: '待受理',
    created_at: now.toISOString()
  }
  // 落入“我的上报”，形成闭环：上报 → 待受理 → 处理中 → 已办结
  myEvents.unshift({
    id: eventId,
    source: _reportSource,
    type: typeLabel,
    location: _reportLocation,
    description: _reportDesc,
    status: '待受理',
    time: timeStr,
    latitude: _reportLat,
    longitude: _reportLng,
    photos: _reportPhotos,
    timeline: [{ time: timeStr, status: '已提交', desc: '您已成功提交事件上报' }]
  })
  console.log('Event report submitted:', reportData)
  _reportStep = 3
  renderReportForm()
  toast('事件上报成功！', 'success')
}`;
if (s.includes(a6)) { s = s.replace(a6, n6); check('6-submitReport-closed-loop', true); }
else { check('6-submitReport-closed-loop', false); }

// ===== 7. “环境问题上报”入口 → 我要上报 + 我的上报；新增 currentArea 统一片区 =====
const a7 = `function showEcoReportForm() {
  // 环境问题上报 — 复用事件上报流程，直接进入第2步并预设“环境卫生”类型
  selectReportType('environment')
}`;
const n7 = `// 当前登录农户的定位/档案（统一数据源 — 各页面共用，避免各写一套片区）
const currentArea = { village: '中堰村', zone: '1组片区', grid: '第2网格', gridId: 'GRID_02' }
function showEcoReportForm() {
  // 环境问题上报入口 — 提供“我要上报”和“我的上报”两个选项
  const h = '<div style="padding:12px 0">' +
    '<p style="color:#66788A;font-size:15px;margin:0 0 16px 0;line-height:1.6">反映身边的环境卫生问题，或查看您已上报事项的处理进度。</p>' +
    '<div style="display:flex;flex-direction:column;gap:10px">' +
    '<button class="btn btn-primary" onclick="window._svc.startEnvReport()" style="justify-content:flex-start;padding:14px 16px;font-size:15px">📷 我要上报<span style="margin-left:auto;font-size:13px;font-weight:400;opacity:.85">上报环境卫生问题</span></button>' +
    '<button class="btn btn-outline" onclick="window._svc.showMyReports()" style="justify-content:flex-start;padding:14px 16px;font-size:15px;background:#FFFFFF">📋 我的上报<span style="margin-left:auto;font-size:13px;opacity:.7">查看处理进度</span></button>' +
    '</div></div>'
  openGovModal('📷 环境问题上报', h)
}
function startEnvReport() { selectReportType('environment') }`;
if (s.includes(a7)) { s = s.replace(a7, n7); check('7-eco-report-entry', true); }
else { check('7-eco-report-entry', false); }

// ===== 8. 垃圾清运面板头部 → 统一片区 =====
const a8 = `📍 所在区域：中堰村 第3网格`;
const n8 = `📍 所在区域：' + currentArea.village + ' ' + currentArea.zone + ' · ' + currentArea.grid + '`;
if (s.includes(a8)) { s = s.replace(a8, n8); check('8-garbage-header-area', true); }
else { check('8-garbage-header-area', false); }

// ===== 9. 水质/我身边的环境头部 → 统一片区（两处相同） =====
const a9 = `>1组片区 · 第2网格</span>`;
const n9 = `>' + currentArea.village + ' ' + currentArea.zone + ' · ' + currentArea.grid + '</span>`;
check('9-water-nearby-header', gsub(a9, n9));

// ===== 10. 垃圾点 gridId 统一为第2网格 =====
check('10-garbage-gridId', gsub(`gridId: 'GRID_03'`, `gridId: 'GRID_02'`));

// ===== 11. 提醒清运 → “提醒一下” + 已提醒状态 =====
const a11 = `  if (p.status === 'WAITING') return '<button class="btn btn-outline btn-sm" onclick="event.stopPropagation();window._svc.viewGarbageLocation(' + i + ')">📍 查看位置</button><button class="btn btn-outline btn-sm" onclick="event.stopPropagation();window._svc.remindClean(' + i + ')">🔔 提醒清运</button>'`;
const n11 = `  if (p.status === 'WAITING') {
    const remindBtn = p.reminded ? '<span style="font-size:13px;color:#22B573;font-weight:600">✅ 已提醒</span>' : '<button class="btn btn-outline btn-sm" onclick="event.stopPropagation();window._svc.remindClean(' + i + ')">🔔 提醒一下</button>'
    return '<button class="btn btn-outline btn-sm" onclick="event.stopPropagation();window._svc.viewGarbageLocation(' + i + ')">📍 查看位置</button>' + remindBtn
  }`;
if (s.includes(a11)) { s = s.replace(a11, n11); check('11-remind-rename', true); }
else { check('11-remind-rename', false); }

// ===== 12. remindClean：防重复 + 重渲染 =====
const a12 = `function remindClean(idx) {
  const p = ecoGarbagePoints.value[idx]
  if (!p) return
  toast('已提醒保洁员清运「' + p.name + '」，预计 ' + formatGarbageTime(p.plannedCleanAt) + ' 到达', 'success')
}`;
const n12 = `function remindClean(idx) {
  const p = ecoGarbagePoints.value[idx]
  if (!p || p.reminded) return
  p.reminded = true // 防重复：点一次后置为已提醒，真实环境按时间窗口重置
  toast('已提醒保洁员，稍后将优先清运「' + p.name + '」', 'success')
  showGarbageService()
}`;
if (s.includes(a12)) { s = s.replace(a12, n12); check('12-remindClean-dedupe', true); }
else { check('12-remindClean-dedupe', false); }

// ===== 13. 新增 contactCleaner（公开服务热线，不写死私人手机号） =====
const a13 = `function openGarbagePointById(id) {
  const p = ecoGarbagePoints.value.find(function(x) { return x.id === id })
  if (p) openGarbagePoint(ecoGarbagePoints.value.indexOf(p))
}`;
const n13 = `function openGarbagePointById(id) {
  const p = ecoGarbagePoints.value.find(function(x) { return x.id === id })
  if (p) openGarbagePoint(ecoGarbagePoints.value.indexOf(p))
}
// 联系保洁员 — 展示本村公开服务热线（实际号码应由后台按 village_id + grid_id 配置，前端不写死私人手机号）
function contactCleaner() {
  toast('已接通本村保洁服务热线，工作时间内将尽快响应', 'info')
}`;
if (s.includes(a13)) { s = s.replace(a13, n13); check('13-contactCleaner-fn', true); }
else { check('13-contactCleaner-fn', false); }

// ===== 14. 联系保洁员按钮 → contactCleaner =====
const a14 = String.raw`<button class="btn btn-outline" onclick="window._toast && window._toast(\'已为您接通保洁员\',\'info\')">📞 联系保洁员</button>`;
const n14 = `<button class="btn btn-outline" onclick="window._svc.contactCleaner()">📞 联系保洁员</button>`;
if (s.includes(a14)) { s = s.replace(a14, n14); check('14-contactCleaner-btn', true); }
else { check('14-contactCleaner-btn', false); }

// ===== 15. 水质/监测补充上报 → 标记 MONITOR_ALERT_SUPPLEMENT =====
const a15a = `  reportEnvironment({ location: wb.name, problemType: '水质问题', indicator: wb.indicator, value: wb.value })`;
const n15a = `  reportEnvironment({ location: wb.name, eventSource: 'MONITOR_ALERT_SUPPLEMENT', problemType: '水质问题', indicator: wb.indicator, value: wb.value })`;
if (s.includes(a15a)) { s = s.replace(a15a, n15a); check('15a-water-supplement-source', true); }
else { check('15a-water-supplement-source', false); }

const a15b = `    reportEnvironment({ location: '3号水塘', problemType: '水质问题', indicator: '溶解氧', value: '3.2mg/L' })`;
const n15b = `    reportEnvironment({ location: '3号水塘', eventSource: 'MONITOR_ALERT_SUPPLEMENT', problemType: '水质问题', indicator: '溶解氧', value: '3.2mg/L' })`;
if (s.includes(a15b)) { s = s.replace(a15b, n15b); check('15b-monitor-water-source', true); }
else { check('15b-monitor-water-source', false); }

const a15c = `    reportEnvironment({ location: r.name, problemType: '水质问题', indicator: '水质指标', value: r.value })`;
const n15c = `    reportEnvironment({ location: r.name, eventSource: 'MONITOR_ALERT_SUPPLEMENT', problemType: '水质问题', indicator: '水质指标', value: r.value })`;
if (s.includes(a15c)) { s = s.replace(a15c, n15c); check('15c-monitor-generic-source', true); }
else { check('15c-monitor-generic-source', false); }

const a15d = `    reportEnvironment({ location: r.name, source: '环境监测', monitorType: r.type, value: r.value })`;
const n15d = `    reportEnvironment({ location: r.name, eventSource: 'MONITOR_ALERT_SUPPLEMENT', source: '环境监测', monitorType: r.type, value: r.value })`;
if (s.includes(a15d)) { s = s.replace(a15d, n15d); check('15d-monitor-else-source', true); }
else { check('15d-monitor-else-source', false); }

// ===== 16. 事件详情显示“上报来源” =====
const a16 = `  h += '<div style="display:flex;padding:10px 16px;border-bottom:1px solid #E6ECF2;font-size:12px"><span style="flex-shrink:0;width:76px;color:#66788A">问题类型</span><span style="color:#1F2D3D;font-weight:500">' + e.type + '</span></div>'
  h += '<div style="display:flex;padding:10px 16px;border-bottom:1px solid #E6ECF2;font-size:12px"><span style="flex-shrink:0;width:76px;color:#66788A">发生地点</span><span style="color:#1F2D3D;font-weight:500">📍 ' + e.location + '</span></div>'`;
const n16 = `  h += '<div style="display:flex;padding:10px 16px;border-bottom:1px solid #E6ECF2;font-size:12px"><span style="flex-shrink:0;width:76px;color:#66788A">问题类型</span><span style="color:#1F2D3D;font-weight:500">' + e.type + '</span></div>'
  if (e.source) h += '<div style="display:flex;padding:10px 16px;border-bottom:1px solid #E6ECF2;font-size:12px"><span style="flex-shrink:0;width:76px;color:#66788A">上报来源</span><span style="color:#1F2D3D;font-weight:500">' + (e.source === 'MONITOR_ALERT_SUPPLEMENT' ? '监测告警补充上报' : '农户主动上报') + '</span></div>'
  h += '<div style="display:flex;padding:10px 16px;border-bottom:1px solid #E6ECF2;font-size:12px"><span style="flex-shrink:0;width:76px;color:#66788A">发生地点</span><span style="color:#1F2D3D;font-weight:500">📍 ' + e.location + '</span></div>'`;
if (s.includes(a16)) { s = s.replace(a16, n16); check('16-event-source-line', true); }
else { check('16-event-source-line', false); }

// ===== 17. 注册新增 handler =====
const a17 = `    showMyEventDetailById, filterMyReports, previewPhoto, openGarbagePoint, openGarbagePointById, viewGarbageLocation, remindClean, reportGarbage, requestStraw, reportEnvironment, viewWaterAlert,`;
const n17 = `    showMyReports, startEnvReport, showMyEventDetailById, filterMyReports, previewPhoto, openGarbagePoint, openGarbagePointById, viewGarbageLocation, remindClean, reportGarbage, contactCleaner, requestStraw, reportEnvironment, viewWaterAlert,`;
if (s.includes(a17)) { s = s.replace(a17, n17); check('17-register-handlers', true); }
else { check('17-register-handlers', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== ECOLOGY REPORT CLOSED LOOP ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
