// Ecology Center — 水质问题 dynamic + 3号水塘 unified linkage (single source of truth).
//   1. ecoWaterBodies reactive source (3号水塘 carries a 处理进度 timeline)
//   2. Unified openWaterBodyDetail(name) — every 3号水塘 entry lands here
//   3. showWaterService dynamic list (copy garbage framework)
//   4. showWaterDetail -> openWaterBodyDetail('3号水塘')
//   5. openEcoAlertDetail(water) -> openWaterBodyDetail (via waterBody field)
//   6. water chart click -> openWaterBodyDetail('3号水塘')
//   7. openMonitorDetail -> context-aware 上报 (reportFromMonitor) + 水质详情 link
//   8. reportEnvironment(context) + selectReportType(type, context) + step-2 banner (context pre-fill)
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. Insert water source of truth after ecoGarbageReports =====
const a1 = `const ecoGarbageReports = ref([])`;
const n1 = `const ecoGarbageReports = ref([])
const ecoWaterBodies = ref([
  { name: '1号水塘', icon: '💧', status: '正常', tone: 'green', indicator: '溶解氧', value: '6.8mg/L', standard: '≥5mg/L', updateTime: '10分钟前', distance: '约 600m' },
  { name: '2号水塘', icon: '💧', status: '正常', tone: 'green', indicator: '溶解氧', value: '5.5mg/L', standard: '≥5mg/L', updateTime: '10分钟前', distance: '约 450m' },
  { name: '3号水塘', icon: '💧', status: '异常', tone: 'amber', indicator: '溶解氧', value: '3.2mg/L', standard: '≥5mg/L', updateTime: '1小时前', distance: '约 800m',
    timeline: [
      { t: '14:00', s: '已发现异常' },
      { t: '14:05', s: '系统生成告警' },
      { t: '14:20', s: '已通知网格员王大爷' },
      { t: '15:10', s: '已安排现场查看' }
    ] },
  { name: '村北河', icon: '🌊', status: '正常', tone: 'green', indicator: 'pH', value: '6.2', standard: '6.5-8.5', updateTime: '30分钟前', distance: '约 1.2km' }
])
let _currentWaterBody = null
let _currentMonitorRow = null`;
if (s.includes(a1)) { s = s.replace(a1, n1); check('1-water-source', true); }
else { check('1-water-source', false); }

// ===== 2. Declare _reportContext =====
const a2 = `let _myReportsFilter = '全部'`;
const n2 = `let _myReportsFilter = '全部'\nlet _reportContext = null`;
if (s.includes(a2)) { s = s.replace(a2, n2); check('2-report-context-decl', true); }
else { check('2-report-context-decl', false); }

// ===== 3. showEventReportForm resets context =====
const a3 = `function showEventReportForm() {
  _reportStep = 1; _reportType = ''; _reportDesc = ''; _reportLocation = ''; _reportPhotos = []
  _reportLat = null; _reportLng = null; _reportAccuracy = null; _reportGpsStatus = 'idle'
  renderReportForm()
}`;
const n3 = `function showEventReportForm() {
  _reportStep = 1; _reportType = ''; _reportDesc = ''; _reportLocation = ''; _reportPhotos = []
  _reportLat = null; _reportLng = null; _reportAccuracy = null; _reportGpsStatus = 'idle'
  _reportContext = null
  renderReportForm()
}`;
if (s.includes(a3)) { s = s.replace(a3, n3); check('3-reset-context', true); }
else { check('3-reset-context', false); }

// ===== 4. selectReportType accepts context =====
const a4 = `function selectReportType(type) {
  _reportType = type
  _reportStep = 2
  _reportDesc = ''; _reportLocation = ''; _reportPhotos = []
  _reportLat = null; _reportLng = null; _reportAccuracy = null; _reportGpsStatus = 'idle'
  renderReportForm()
}`;
const n4 = `function selectReportType(type, context) {
  _reportType = type
  _reportStep = 2
  _reportDesc = ''; _reportLocation = ''; _reportPhotos = []
  _reportLat = null; _reportLng = null; _reportAccuracy = null; _reportGpsStatus = 'idle'
  _reportContext = context || null
  if (context && context.location) _reportLocation = context.location
  renderReportForm()
}`;
if (s.includes(a4)) { s = s.replace(a4, n4); check('4-selectReportType-context', true); }
else { check('4-selectReportType-context', false); }

// ===== 5. prevReportStep resets context =====
const a5 = `function prevReportStep() {
  _reportStep = 1
  _reportType = ''
  renderReportForm()
}`;
const n5 = `function prevReportStep() {
  _reportStep = 1
  _reportType = ''
  _reportContext = null
  renderReportForm()
}`;
if (s.includes(a5)) { s = s.replace(a5, n5); check('5-prev-reset-context', true); }
else { check('5-prev-reset-context', false); }

// ===== 6. Step-2 context banner =====
const a6 = `    // Problem description`;
const n6 = `    // Auto-filled context (from 监测点 / 水体详情)
    if (_reportContext) {
      h += '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:10px 12px;margin-bottom:12px">'
      h += '<div style="font-size:12px;color:#1E7A54;font-weight:700;margin-bottom:4px">✅ 已自动带入以下信息</div>'
      if (_reportContext.source) h += '<div style="font-size:12px;color:#475867">📍 问题来源：' + _reportContext.source + '</div>'
      if (_reportContext.monitorType) h += '<div style="font-size:12px;color:#475867">📋 监测类型：' + _reportContext.monitorType + '</div>'
      if (_reportContext.problemType) h += '<div style="font-size:12px;color:#475867">📋 问题类型：' + _reportContext.problemType + '</div>'
      if (_reportContext.indicator) h += '<div style="font-size:12px;color:#475867">📊 异常指标：' + _reportContext.indicator + '</div>'
      if (_reportContext.value) h += '<div style="font-size:12px;color:#475867">🔢 当前监测值：' + _reportContext.value + '</div>'
      h += '</div>'
    }
    // Problem description`;
if (s.includes(a6)) { s = s.replace(a6, n6); check('6-context-banner', true); }
else { check('6-context-banner', false); }

// ===== 7. reportEnvironment accepts context =====
const a7 = `function reportEnvironment() { selectReportType('environment') }`;
const n7 = `function reportEnvironment(context) { selectReportType('environment', context) }`;
if (s.includes(a7)) { s = s.replace(a7, n7); check('7-reportEnvironment-context', true); }
else { check('7-reportEnvironment-context', false); }

// ===== 8. Rewrite showWaterService (dynamic list) =====
const a8 = String.raw`function showWaterService() {
  const h = '<div style="padding:12px 0">' +
    '<p style="color:#66788A;font-size:15px;margin:0 0 14px 0;line-height:1.6">本村各水塘、河道水质情况，异常点位已标注。</p>' +
    '<div style="background:#FDECEC;border:1px solid #F5C4C4;border-radius:8px;padding:14px;margin-bottom:14px">' +
    '<div style="display:flex;align-items:center;gap:8px;font-size:16px;color:#C0392B;font-weight:700;margin-bottom:8px">💧 3号水塘 · 溶解氧偏低</div>' +
    '<div style="font-size:15px;color:#8A3F3A;line-height:1.7">当前值 3.2mg/L，标准应 ≥5mg/L。溶解氧偏低可能影响鱼虾存活，请勿在附近取水饮用。</div>' +
    '</div>' +
    '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">' +
    ecoRow('1号水塘', '溶解氧 6.8mg/L', 'green', '正常') +
    ecoRow('2号水塘', '溶解氧 5.5mg/L', 'green', '正常') +
    ecoRow('村北河', 'pH 6.2', 'green', '正常') +
    '</div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-outline" onclick="window._svc.selectReportType(\'environment\')">📷 上报水质问题</button>' +
    '<button class="btn btn-primary" onclick="window._toast && window._toast(\'已通知水务员到场处理\',\'success\')">🚨 通知处理</button>' +
    '</div></div>'
  openGovModal('💧 水质问题', h)
}`;
const n8 = String.raw`function showWaterService() {
  const wbs = ecoWaterBodies.value
  let abIdx = -1
  wbs.forEach(function(w, i) { if (w.status !== '正常' && abIdx === -1) abIdx = i })
  let alertHtml = ''
  if (abIdx >= 0) {
    const a = wbs[abIdx]
    alertHtml = '<div style="background:#FDECEC;border:1px solid #F5C4C4;border-radius:8px;padding:14px;margin-bottom:14px;cursor:pointer" onclick="window._svc.openWaterBodyByIdx(' + abIdx + ')">' +
      '<div style="display:flex;align-items:center;gap:8px;font-size:16px;color:#C0392B;font-weight:700;margin-bottom:6px">💧 ' + a.name + ' · ' + a.indicator + '偏低</div>' +
      '<div style="font-size:15px;color:#8A3F3A;line-height:1.7">当前 ' + a.value + '（标准 ' + a.standard + '），请勿在附近取水饮用。点击查看处理进度 ›</div></div>'
  }
  let rows = ''
  wbs.forEach(function(w, i) {
    rows += '<div onclick="window._svc.openWaterBodyByIdx(' + i + ')" style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:#FFFFFF;border:1px solid #E3EAF0;border-radius:8px;cursor:pointer;margin-bottom:8px;transition:all .2s" onmouseover="this.style.borderColor=\'#22B573\';this.style.background=\'rgba(34,181,115,0.04)\'" onmouseout="this.style.borderColor=\'#E3EAF0\';this.style.background=\'#FFFFFF\'">' +
      '<span style="font-size:22px">' + w.icon + '</span>' +
      '<div style="flex:1;min-width:0"><div style="font-size:16px;font-weight:600;color:#1F2D3D">' + w.name + '<span style="font-size:13px;color:#66788A;font-weight:400;margin-left:6px">' + w.distance + '</span></div>' +
      '<div style="font-size:14px;color:#66788A;margin-top:3px">' + w.indicator + ' ' + w.value + '</div></div>' +
      ecoPill(w.status, w.tone) +
      '</div>'
  })
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><span style="font-size:15px;color:#66788A">📍 所在片区：</span><span style="font-size:16px;color:#1F2D3D;font-weight:700">1组片区 · 第2网格</span></div>' +
    '<p style="color:#66788A;font-size:15px;margin:0 0 12px 0;line-height:1.6">本村各水塘、河道水质监测情况，异常点位已标注，点击查看详情与处理进度。</p>' +
    alertHtml +
    rows +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-outline" onclick="window._svc.reportEnvironment()">📷 上报水质问题</button>' +
    (abIdx >= 0 ? '<button class="btn btn-primary" onclick="window._svc.openWaterBodyByIdx(' + abIdx + ')">💧 查看异常水塘</button>'
                : '<button class="btn btn-primary" onclick="window._svc.reportEnvironment()">📷 上报水质问题</button>') +
    '</div></div>'
  openGovModal('💧 水质问题', h)
}`;
if (s.includes(a8)) { s = s.replace(a8, n8); check('8-water-service-dynamic', true); }
else { check('8-water-service-dynamic', false); }

// ===== 9. showWaterDetail -> unified 3号水塘 =====
const a9 = `function showWaterDetail() {
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:baseline;gap:12px;margin-bottom:14px">' +
    '<span style="font-size:32px;font-weight:700;color:#1F2D3D">Ⅱ类</span>' +
    '<span style="font-size:15px;color:#66788A">水质综合指数 · 总体良好</span></div>' +
    '<div style="background:#FDECEC;border:1px solid #F5C4C4;border-radius:8px;padding:12px 14px;margin-bottom:14px">' +
    '<div style="font-size:16px;color:#C0392B;font-weight:700;margin-bottom:6px">💧 3号水塘 · 溶解氧偏低</div>' +
    '<div style="font-size:15px;color:#8A3F3A;line-height:1.7">当前 3.2mg/L（标准 ≥5mg/L），请勿在附近取水饮用。</div></div>' +
    '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">' +
    ecoRow('1号水塘', '溶解氧 6.8mg/L', 'green', '正常') +
    ecoRow('2号水塘', '溶解氧 5.5mg/L', 'green', '正常') +
    ecoRow('村北河', 'pH 6.2', 'green', '正常') +
    '</div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end">' +
    '<button class="btn btn-primary" onclick="window._svc.reportEnvironment()">📷 上报水质问题</button></div>' +
    '</div>'
  openGovModal('💧 水质', h)
}`;
const n9 = `function showWaterDetail() { openWaterBodyDetail('3号水塘') }`;
if (s.includes(a9)) { s = s.replace(a9, n9); check('9-water-detail-unified', true); }
else { check('9-water-detail-unified', false); }

// ===== 10. Add waterBody to ecoAlerts[0] =====
const a10 = `  { id: 1, icon: '💧', title: '3号水塘溶解氧偏低', desc: '当前值 3.2mg/L，标准≥5mg/L', time: '1小时前 · 已派单', actionLabel: '查看详情',`;
const n10 = `  { id: 1, icon: '💧', title: '3号水塘溶解氧偏低', desc: '当前值 3.2mg/L，标准≥5mg/L', time: '1小时前 · 已派单', actionLabel: '查看详情', waterBody: '3号水塘',`;
if (s.includes(a10)) { s = s.replace(a10, n10); check('10-alert-waterBody', true); }
else { check('10-alert-waterBody', false); }

// ===== 11. openEcoAlertDetail redirects water alerts =====
const a11 = `function openEcoAlertDetail(a) {
  const h = '<div style="padding:12px 0">' +`;
const n11 = `function openEcoAlertDetail(a) {
  if (a.waterBody) { openWaterBodyDetail(a.waterBody); return }
  const h = '<div style="padding:12px 0">' +`;
if (s.includes(a11)) { s = s.replace(a11, n11); check('11-alert-redirect', true); }
else { check('11-alert-redirect', false); }

// ===== 12. openMonitorDetail dynamic + context =====
const a12 = `function openMonitorDetail(r) {
  const abnormal = r.status !== '正常'
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><span style="font-size:24px">📡</span><span style="font-size:17px;color:#1F2D3D;font-weight:700">' + r.name + '</span></div>' +
    '<div style="display:flex;flex-direction:column;margin-bottom:16px">' +
    ecoAlertField('📋 监测类型', r.type) +
    ecoAlertField('📊 当前值', r.value) +
    ecoAlertField('✅ 标准值', r.standard) +
    ecoAlertField('🕐 更新时间', r.updateTime) +
    '</div>' +
    '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px;margin-bottom:16px">' +
    '<span style="font-size:15px;color:#1E7A54;line-height:1.6">' + (abnormal ? '⚠️ 该监测点数据异常，请关注相关告警。' : '✅ 该监测点运行正常，数据处于标准范围内。') + '</span></div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    (abnormal ? '<button class="btn btn-primary" onclick="window._svc.viewWaterAlert()">🚨 查看告警</button>'
              : '<button class="btn btn-primary" onclick="window._svc.reportEnvironment()">📷 上报问题</button>') +
    '</div></div>'
  openGovModal(r.name + ' · 监测详情', h)
}`;
const n12 = `function openMonitorDetail(r) {
  _currentMonitorRow = r
  const abnormal = r.status !== '正常'
  const isWater = r.name === '3号水塘'
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><span style="font-size:24px">📡</span><span style="font-size:17px;color:#1F2D3D;font-weight:700">' + r.name + '</span></div>' +
    '<div style="display:flex;flex-direction:column;margin-bottom:16px">' +
    ecoAlertField('📋 监测类型', r.type) +
    ecoAlertField('📊 当前值', r.value) +
    ecoAlertField('✅ 标准值', r.standard) +
    ecoAlertField('🕐 更新时间', r.updateTime) +
    '</div>' +
    '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px;margin-bottom:16px">' +
    '<span style="font-size:15px;color:#1E7A54;line-height:1.6">' + (abnormal ? '⚠️ 该监测点数据异常，请关注相关告警。' : '✅ 该监测点运行正常，数据处于标准范围内。') + '</span></div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    (isWater ? '<button class="btn btn-outline" onclick="window._svc.viewWaterAlert()">💧 查看水质详情</button>'
             : (abnormal ? '<button class="btn btn-outline" onclick="window._svc.viewWaterAlert()">🚨 查看告警</button>' : '')) +
    '<button class="btn btn-primary" onclick="window._svc.reportFromMonitor()">📷 上报问题</button>' +
    '</div></div>'
  openGovModal(r.name + ' · 监测详情', h)
}`;
if (s.includes(a12)) { s = s.replace(a12, n12); check('12-monitor-detail-dynamic', true); }
else { check('12-monitor-detail-dynamic', false); }

// ===== 13. Repoint viewWaterAlert + insert unified water functions =====
const a13 = `function viewWaterAlert() { openEcoAlertDetail(ecoAlerts[0]) }`;
const n13 = `function viewWaterAlert() { openWaterBodyDetail('3号水塘') }
function openWaterBodyDetail(name) {
  const wb = ecoWaterBodies.value.find(function(x) { return x.name === name })
  if (!wb) { toast(name + ' 水质正常', 'info'); return }
  _currentWaterBody = wb
  const abnormal = wb.status !== '正常'
  let timelineHtml = ''
  if (wb.timeline && wb.timeline.length) {
    wb.timeline.forEach(function(st, i) {
      const isLast = i === wb.timeline.length - 1
      timelineHtml += '<div style="display:flex;gap:10px;align-items:flex-start"><div style="text-align:center;flex-shrink:0;width:14px"><div style="width:10px;height:10px;border-radius:50%;background:' + (isLast ? '#F2A62B' : '#22B573') + ';margin:5px auto 0"></div>' + (isLast ? '' : '<div style="width:1px;height:24px;background:#E3EAF0;margin:0 auto"></div>') + '</div><div style="padding-bottom:14px;flex:1"><span style="font-size:13px;color:#66788A;margin-right:10px">' + st.t + '</span><span style="font-size:14px;color:#1F2D3D;font-weight:500">' + st.s + '</span></div></div>'
    })
  }
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><span style="font-size:24px">' + wb.icon + '</span><span style="font-size:17px;color:#1F2D3D;font-weight:700">' + wb.name + ' · 水质详情</span>' +
    '<span style="margin-left:auto">' + ecoPill(abnormal ? '异常' : '正常', wb.tone) + '</span></div>' +
    '<div style="display:flex;flex-direction:column;margin-bottom:16px">' +
    ecoAlertField('📊 ' + wb.indicator, wb.value) +
    ecoAlertField('✅ 正常标准', wb.standard) +
    ecoAlertField('🕐 更新时间', wb.updateTime) +
    '</div>' +
    (timelineHtml ? '<div style="margin-bottom:16px"><div style="font-size:15px;color:#1F2D3D;font-weight:700;margin-bottom:8px">📋 处理进度</div>' + timelineHtml + '</div>' : '') +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-outline" onclick="window._svc.viewWaterLocation()">📍 查看位置</button>' +
    '<button class="btn btn-primary" onclick="window._svc.reportWaterSupplement()">📝 我要上报补充情况</button>' +
    '</div></div>'
  openGovModal(wb.name + ' · 水质详情', h)
}
function openWaterBodyByIdx(idx) {
  const wb = ecoWaterBodies.value[idx]
  if (wb) openWaterBodyDetail(wb.name)
}
function viewWaterLocation() {
  const wb = _currentWaterBody
  toast('已打开地图定位「' + (wb ? wb.name : '该水体') + '」', 'info')
}
function reportWaterSupplement() {
  const wb = _currentWaterBody
  if (!wb) { reportEnvironment(); return }
  reportEnvironment({ location: wb.name, problemType: '水质问题', indicator: wb.indicator, value: wb.value })
}
function reportFromMonitor() {
  const r = _currentMonitorRow
  if (!r) { reportEnvironment(); return }
  if (r.name === '3号水塘') {
    reportEnvironment({ location: '3号水塘', problemType: '水质问题', indicator: '溶解氧', value: '3.2mg/L' })
  } else if (r.type === '水质监测') {
    reportEnvironment({ location: r.name, problemType: '水质问题', indicator: '水质指标', value: r.value })
  } else {
    reportEnvironment({ location: r.name, source: '环境监测', monitorType: r.type, value: r.value })
  }
}`;
if (s.includes(a13)) { s = s.replace(a13, n13); check('13-unified-water-functions', true); }
else { check('13-unified-water-functions', false); }

// ===== 14. Water chart click -> unified =====
const a14 = `      if (params.name === '3号水塘') openEcoAlertDetail(ecoAlerts[0])`;
const n14 = `      if (params.name === '3号水塘') openWaterBodyDetail('3号水塘')`;
if (s.includes(a14)) { s = s.replace(a14, n14); check('14-water-chart-click', true); }
else { check('14-water-chart-click', false); }

// ===== 15. Register new handlers =====
const a15 = `    showMyEventDetailById, filterMyReports, previewPhoto, openGarbagePoint, openGarbageReport, submitGarbageReport, requestStraw, reportEnvironment, viewWaterAlert,`;
const n15 = `    showMyEventDetailById, filterMyReports, previewPhoto, openGarbagePoint, openGarbageReport, submitGarbageReport, requestStraw, reportEnvironment, viewWaterAlert,
    openWaterBodyByIdx, reportWaterSupplement, viewWaterLocation, reportFromMonitor,`;
if (s.includes(a15)) { s = s.replace(a15, n15); check('15-register-water-handlers', true); }
else { check('15-register-water-handlers', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== ECOLOGY WATER LINKAGE ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
