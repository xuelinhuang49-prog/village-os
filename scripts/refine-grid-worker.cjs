// Refine grid worker modal: masked phone, service hours, simplified stats, new buttons
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. Update gridWorker data =====
const oldGw = `const gridWorker = {
  name: '王大爷', role: '第3网格网格员', avatar: '王', phone: '138-xxxx-1234',
  grid: '第3网格', area: '村东片区 · 覆盖186户', dutyStart: '2023年3月',
  desc: '负责村东片区日常巡查、事件受理、矛盾调解、政策宣传等工作，熟悉片区每户情况，工作认真负责。',
  stats: { patrols: 128, events: 47, resolved: 45, satisfaction: 98 }
}`;

const newGw = `const gridWorker = {
  name: '王大爷', role: '第3网格网格员', avatar: '王',
  phone: '138****1234', realPhone: '13871251234',
  grid: '第3网格', area: '村东片区 · 覆盖186户', dutyStart: '2023年3月',
  serviceHours: '工作日 08:30–17:30',
  serviceNote: '紧急事项请联系村委会值班电话',
  desc: '负责村东片区日常巡查、事件受理、矛盾调解、政策宣传等工作，熟悉片区每户情况，工作认真负责。',
  stats: { resolved: 45, satisfaction: 98 },
  gridDetail: { id: 'G03', name: '第3网格', area: '村东片区', coverage: '186户', boundary: '东至村界、西至村主干道、南至灌溉渠、北至产业园' }
}`;

if (s.includes(oldGw)) {
  s = s.replace(oldGw, newGw);
  check('1-gridWorkerData', true);
} else { check('1-gridWorkerData', false); }

// ===== 2. Rewrite showGridWorkerInfo =====
const oldShowGw = `function showGridWorkerInfo() {
  const gw = gridWorker
  const c = '<div style="text-align:center;padding:12px 0"><div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#28C7FA,#39D98A);display:inline-flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:#fff;margin-bottom:10px">' + gw.avatar + '</div><h4 style="color:#fff;margin:0 0 2px 0;font-size:15px">' + gw.name + '</h4><p style="color:#28C7FA;font-size:11px;margin:0 0 12px 0">' + gw.role + '</p></div><div class="detail-section"><h4>基本信息</h4><div class="detail-field"><span class="df-lbl">联系电话</span><span class="df-val">' + gw.phone + '</span></div><div class="detail-field"><span class="df-lbl">所属网格</span><span class="df-val">' + gw.grid + '</span></div><div class="detail-field"><span class="df-lbl">管辖范围</span><span class="df-val">' + gw.area + '</span></div><div class="detail-field"><span class="df-lbl">任职时间</span><span class="df-val">' + gw.dutyStart + '</span></div></div><div class="detail-section"><h4>工作概况</h4><p style="font-size:11px;color:#B7D3E8;line-height:1.6">' + gw.desc + '</p></div><div class="detail-section"><h4>工作统计</h4><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div style="text-align:center;padding:8px;background:rgba(10,36,68,0.55);border-radius:6px"><div style="font-size:18px;font-weight:700;color:#28C7FA">' + gw.stats.patrols + '</div><div style="font-size:10px;color:#6F91A8">巡查次数</div></div><div style="text-align:center;padding:8px;background:rgba(10,36,68,0.55);border-radius:6px"><div style="font-size:18px;font-weight:700;color:#39D98A">' + gw.stats.events + '</div><div style="font-size:10px;color:#6F91A8">受理事件</div></div><div style="text-align:center;padding:8px;background:rgba(10,36,68,0.55);border-radius:6px"><div style="font-size:18px;font-weight:700;color:#39D98A">' + gw.stats.resolved + '</div><div style="font-size:10px;color:#6F91A8">已办结</div></div><div style="text-align:center;padding:8px;background:rgba(10,36,68,0.55);border-radius:6px"><div style="font-size:18px;font-weight:700;color:#f59e0b">' + gw.stats.satisfaction + '%</div><div style="font-size:10px;color:#6F91A8">满意度</div></div></div></div><div class="detail-actions"><button class="btn btn-primary" onclick="window._svc.callGridWorker()">📞 拨打电话</button><button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">关闭</button></div>'
  openModal('👤 网格员信息', c)
}`;

const newShowGw = `function showGridWorkerInfo() {
  const gw = gridWorker
  var h = ''
  // Avatar + name + role
  h += '<div style="text-align:center;padding:8px 0 14px 0">'
  h += '<div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#28C7FA,#39D98A);display:inline-flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:#fff;margin-bottom:10px;box-shadow:0 0 20px rgba(40,199,111,0.20)">' + gw.avatar + '</div>'
  h += '<h4 style="color:#fff;margin:0 0 2px 0;font-size:15px">' + gw.name + '</h4>'
  h += '<p style="color:#28C7FA;font-size:11px;margin:0">' + gw.role + '</p>'
  h += '</div>'
  // Basic info
  h += '<div style="margin-bottom:14px;background:rgba(10,36,68,0.30);border:1px solid rgba(40,199,111,0.08);border-radius:8px;overflow:hidden">'
  h += '<div style="display:flex;justify-content:space-between;padding:10px 14px;border-bottom:1px solid rgba(40,199,111,0.06);font-size:12px"><span style="color:#6F91A8">所属网格</span><span style="color:#D0E4F5;font-weight:500">' + gw.grid + '</span></div>'
  h += '<div style="display:flex;justify-content:space-between;padding:10px 14px;border-bottom:1px solid rgba(40,199,111,0.06);font-size:12px"><span style="color:#6F91A8">管辖范围</span><span style="color:#D0E4F5;font-weight:500">' + gw.area + '</span></div>'
  h += '<div style="display:flex;justify-content:space-between;padding:10px 14px;border-bottom:1px solid rgba(40,199,111,0.06);font-size:12px"><span style="color:#6F91A8">联系电话</span><span style="color:#D0E4F5;font-weight:500">' + gw.phone + '</span></div>'
  h += '<div style="display:flex;justify-content:space-between;padding:10px 14px;border-bottom:1px solid rgba(40,199,111,0.06);font-size:12px"><span style="color:#6F91A8">服务时间</span><span style="color:#D0E4F5;font-weight:500">' + gw.serviceHours + '</span></div>'
  h += '<div style="padding:10px 14px;font-size:11px;color:#6F91A8">' + gw.serviceNote + '</div>'
  h += '</div>'
  // Work overview
  h += '<div style="margin-bottom:14px"><h4 style="font-size:12px;font-weight:700;color:#39D98A;margin:0 0 8px 0;display:flex;align-items:center;gap:6px"><span style="display:inline-block;width:3px;height:12px;background:#39D98A;border-radius:2px"></span>工作概况</h4>'
  h += '<p style="font-size:11px;color:#B7D3E8;line-height:1.6;margin:0">' + gw.desc + '</p>'
  h += '</div>'
  // Stats — simplified: only 2 farmer-relevant numbers
  h += '<div style="margin-bottom:14px"><h4 style="font-size:12px;font-weight:700;color:#39D98A;margin:0 0 8px 0;display:flex;align-items:center;gap:6px"><span style="display:inline-block;width:3px;height:12px;background:#39D98A;border-radius:2px"></span>服务数据</h4>'
  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
  h += '<div style="text-align:center;padding:12px 8px;background:rgba(10,36,68,0.55);border-radius:8px"><div style="font-size:22px;font-weight:700;color:#39D98A">' + gw.stats.resolved + '</div><div style="font-size:10px;color:#6F91A8;margin-top:2px">已处理事件</div></div>'
  h += '<div style="text-align:center;padding:12px 8px;background:rgba(10,36,68,0.55);border-radius:8px"><div style="font-size:22px;font-weight:700;color:#f59e0b">' + gw.stats.satisfaction + '%</div><div style="font-size:10px;color:#6F91A8;margin-top:2px">服务评价</div></div>'
  h += '</div></div>'
  // Action buttons
  h += '<div style="display:flex;gap:10px;margin-top:8px">'
  h += '<button class="btn btn-primary" onclick="window._svc.callGridWorker()" style="flex:1;justify-content:center">📞 拨打电话</button>'
  h += '<button class="btn btn-outline" onclick="window._svc.showMyGrid()" style="flex:1;justify-content:center">🗺️ 查看我的网格</button>'
  h += '</div>'
  openModal('👤 网格员信息', h)
}`;

if (s.includes(oldShowGw)) {
  s = s.replace(oldShowGw, newShowGw);
  check('2-showGridWorker', true);
} else { check('2-showGridWorker', false); }

// ===== 3. Rewrite callGridWorker with real phone =====
const oldCallGw = `function callGridWorker() {
  toast('正在拨打 ' + gridWorker.name + ' 电话：' + gridWorker.phone, 'info')
}`;

const newCallGw = `function callGridWorker() {
  toast('正在拨打 ' + gridWorker.name + ' 电话…', 'info')
  // Use real phone number (hidden from UI)
  setTimeout(function() {
    window.open('tel:' + gridWorker.realPhone, '_self')
  }, 300)
}`;

if (s.includes(oldCallGw)) {
  s = s.replace(oldCallGw, newCallGw);
  check('3-callGridWorker', true);
} else { check('3-callGridWorker', false); }

// ===== 4. Add showMyGrid function before showVillageNotices =====
const oldShowNotices = `function showVillageNotices() {`;

const newShowMyGrid = `function showMyGrid() {
  var gd = gridWorker.gridDetail
  var h = ''
  h += '<div style="text-align:center;padding:8px 0 14px 0">'
  h += '<span style="font-size:40px">🗺️</span>'
  h += '<h4 style="color:#fff;margin:8px 0 2px 0;font-size:15px">' + gd.name + '</h4>'
  h += '<p style="color:#6F91A8;font-size:11px;margin:0">' + gridWorker.name + ' 负责区域</p>'
  h += '</div>'
  h += '<div style="background:rgba(10,36,68,0.30);border:1px solid rgba(40,199,111,0.08);border-radius:8px;overflow:hidden;margin-bottom:14px">'
  h += '<div style="display:flex;justify-content:space-between;padding:10px 14px;border-bottom:1px solid rgba(40,199,111,0.06);font-size:12px"><span style="color:#6F91A8">网格编号</span><span style="color:#D0E4F5;font-weight:500">' + gd.id + '</span></div>'
  h += '<div style="display:flex;justify-content:space-between;padding:10px 14px;border-bottom:1px solid rgba(40,199,111,0.06);font-size:12px"><span style="color:#6F91A8">负责区域</span><span style="color:#D0E4F5;font-weight:500">' + gd.area + '</span></div>'
  h += '<div style="display:flex;justify-content:space-between;padding:10px 14px;border-bottom:1px solid rgba(40,199,111,0.06);font-size:12px"><span style="color:#6F91A8">覆盖户数</span><span style="color:#D0E4F5;font-weight:500">' + gd.coverage + '</span></div>'
  h += '<div style="display:flex;justify-content:space-between;padding:10px 14px;font-size:12px"><span style="color:#6F91A8">四至范围</span><span style="color:#D0E4F5;font-weight:500;text-align:right;max-width:220px">' + gd.boundary + '</span></div>'
  h += '</div>'
  h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()" style="width:100%;justify-content:center">关闭</button>'
  openModal('🗺️ 我的网格', h)
}

function showVillageNotices() {`;

if (s.includes(oldShowNotices)) {
  s = s.replace(oldShowNotices, newShowMyGrid);
  check('4-showMyGrid', true);
} else { check('4-showMyGrid', false); }

// ===== 5. Update _svc handlers =====
const oldSvc = `    submitReport, closeAndRefresh, callGridWorker, showNoticeDetailById,`;
const newSvc = `    submitReport, closeAndRefresh, callGridWorker, showMyGrid, showNoticeDetailById,`;
if (s.includes(oldSvc)) {
  s = s.replace(oldSvc, newSvc);
  check('5-svcHandlers', true);
} else { check('5-svcHandlers', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== GRID WORKER REFINE FINAL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
