// Ecology Center — 垃圾清运 becomes a truly dynamic feature (single source of truth).
//   1. Add reactive ecoGarbagePoints / ecoGarbageReports (single source of truth)
//   2. Rewrite showGarbageService: list points + today status + expected time; each clickable
//   3. openGarbagePoint(idx): point detail + my reports + submit
//   4. submitGarbageReport(idx, typeCode): state change -> feedback -> closed loop
//   5. Link 环境告警"垃圾清运延迟" -> 1组垃圾点 detail (数据联动)
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. Insert reactive data before ecoStats =====
const anchor = `// Ecology
const ecoStats = [`;
const dataInsert = String.raw`// Ecology dynamic data (single source of truth — drives 垃圾清运 / 水质 / 监测点)
const ecoGarbagePoints = ref([
  { name: '村东收集点', icon: '🏘️', status: '已清运', tone: 'green', today: '今日 07:30 已清运', expect: '明日 07:30 前', distance: '约 200m' },
  { name: '1组垃圾点', icon: '📍', status: '未清运', tone: 'amber', today: '今日未清运 · 已超 24h', expect: '预计 2 小时内', distance: '约 150m' },
  { name: '文化广场', icon: '🎭', status: '正常', tone: 'green', today: '今日 18:00 清运', expect: '今日 18:00', distance: '约 400m' }
])
const ecoGarbageReports = ref([])

// Ecology
const ecoStats = [`;
if (s.includes(anchor)) { s = s.replace(anchor, dataInsert); check('1-reactive-data', true); }
else { check('1-reactive-data', false); }

// ===== 2. Rewrite showGarbageService + requestGarbage =====
const oldFuncs = String.raw`function showGarbageService() {
  const h = '<div style="padding:12px 0">' +
    '<p style="color:#66788A;font-size:15px;margin:0 0 14px 0;line-height:1.6">查看本村各垃圾点清运情况，堆积可一键申请清运。</p>' +
    '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">' +
    ecoRow('🏘️ 村东收集点', '今日 07:30 已清运', 'green', '已清运') +
    ecoRow('📍 1组垃圾点', '已超 24h 未清运', 'amber', '待清运') +
    ecoRow('🎭 文化广场', '今日 18:00 清运', 'green', '正常') +
    '</div>' +
    '<div style="background:#FFF8EC;border:1px solid #F5E3C4;border-radius:8px;padding:12px 14px;margin-bottom:16px">' +
    '<span style="font-size:15px;color:#B37B1E;line-height:1.6">⚠️ 1组垃圾点已超 24 小时未清运，建议尽快申请清运。</span></div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-outline" onclick="window._toast && window._toast(\'已为您接通保洁员\',\'info\')">📞 联系保洁员</button>' +
    '<button class="btn btn-primary" onclick="window._svc.requestGarbage()">🚚 申请清运</button>' +
    '</div></div>'
  openGovModal('🗑 垃圾清运', h)
}
function requestGarbage() {
  toast('清运申请已提交，保洁员将尽快处理', 'success')
  closeModal()
}`;

const newFuncs = String.raw`function showGarbageService() {
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

if (s.includes(oldFuncs)) { s = s.replace(oldFuncs, newFuncs); check('2-rewrite-garbage-functions', true); }
else { check('2-rewrite-garbage-functions', false); }

// ===== 3. Link 告警 id=3 -> 1组垃圾点 detail =====
const oldAlertBtn = `      ? '<button class="btn btn-primary" onclick="window._svc.requestGarbage()">🚚 申请清运</button>'`;
const newAlertBtn = `      ? '<button class="btn btn-primary" onclick="window._svc.openGarbagePoint(1)">🚚 查看清运情况</button>'`;
if (s.includes(oldAlertBtn)) { s = s.replace(oldAlertBtn, newAlertBtn); check('3-link-alert-to-point', true); }
else { check('3-link-alert-to-point', false); }

// ===== 4. Register new handlers on window._svc =====
const oldSvc = `    showMyEventDetailById, filterMyReports, previewPhoto, requestGarbage, requestStraw, reportEnvironment, viewWaterAlert,`;
const newSvc = `    showMyEventDetailById, filterMyReports, previewPhoto, openGarbagePoint, openGarbageReport, submitGarbageReport, requestStraw, reportEnvironment, viewWaterAlert,`;
if (s.includes(oldSvc)) { s = s.replace(oldSvc, newSvc); check('4-register-garbage-handlers', true); }
else { check('4-register-garbage-handlers', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== ECOLOGY GARBAGE DYNAMIC ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
