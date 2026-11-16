// Ecology Center — make the 4 metric cards real functional entries.
// Each card opens an ecology-specific detail modal (not the generic admin panel).
// 1. Template: @click -> openEcoStatDetail(s)
// 2. Data: add `key` to each ecoStats entry
// 3. Add openEcoStatDetail + 4 detail modals + reportEnvironment alias
// 4. Register reportEnvironment on window._svc
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. Template click handler =====
const oldClick = `@click="openStatDetail(s.label, s.value)"`;
const newClick = `@click="openEcoStatDetail(s)"`;
if (s.includes(oldClick)) { s = s.replace(oldClick, newClick); check('1-stat-click-handler', true); }
else { check('1-stat-click-handler', false); }

// ===== 2. ecoStats: add key =====
const oldStats = `const ecoStats = [
  { label: '空气质量指数', value: '42', valueTag: '优', sub: 'PM2.5: 15μg/m³', icon: '🌬️', iconBg: 'rgba(34,181,115,0.12)' },
  { label: '水质综合指数', value: 'Ⅱ类', sub: '3号水塘需关注', icon: '💧', iconBg: 'rgba(14,165,233,.10)' },
  { label: '碳汇量估算', value: '860', sub: '吨CO₂当量/年', icon: '🌳', iconBg: '#FFF8E8' },
  { label: '秸秆综合利用率', value: '92%', sub: '↑5% 同比', icon: '♻️', iconBg: '#FDE8E8' }
]`;
const newStats = `const ecoStats = [
  { key: 'air', label: '空气质量指数', value: '42', valueTag: '优', sub: 'PM2.5: 15μg/m³', icon: '🌬️', iconBg: 'rgba(34,181,115,0.12)' },
  { key: 'water', label: '水质综合指数', value: 'Ⅱ类', sub: '3号水塘需关注', icon: '💧', iconBg: 'rgba(14,165,233,.10)' },
  { key: 'carbon', label: '碳汇量估算', value: '860', sub: '吨CO₂当量/年', icon: '🌳', iconBg: '#FFF8E8' },
  { key: 'straw', label: '秸秆综合利用率', value: '92%', sub: '↑5% 同比', icon: '♻️', iconBg: '#FDE8E8' }
]`;
if (s.includes(oldStats)) { s = s.replace(oldStats, newStats); check('2-ecoStats-keys', true); }
else { check('2-ecoStats-keys', false); }

// ===== 3. Insert detail functions after requestStraw =====
const anchor = `function requestStraw() {
  toast('上门回收申请已提交，回收队将联系您', 'success')
  closeModal()
}`;
const funcs = `${anchor}

function openEcoStatDetail(s) {
  const key = s.key || s.label
  if (key === 'air') showAirDetail()
  else if (key === 'water') showWaterDetail()
  else if (key === 'carbon') showCarbonDetail()
  else if (key === 'straw') showStrawDetail()
  else openStatDetail(s.label, s.value)
}
function reportEnvironment() { selectReportType('environment') }
function showAirDetail() {
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">' +
    '<div style="width:96px;height:96px;border-radius:50%;background:rgba(34,181,115,0.10);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#22B573;flex-shrink:0">' +
    '<span style="font-size:32px;font-weight:700;line-height:1">42</span><span style="font-size:15px;font-weight:600;margin-top:2px">优</span></div>' +
    '<div><div style="font-size:17px;color:#1F2D3D;font-weight:700;margin-bottom:6px">今日空气质量 · 优</div>' +
    '<div style="font-size:15px;color:#66788A;line-height:1.7">适合户外活动和开窗通风，老人儿童可正常外出。</div></div>' +
    '</div>' +
    '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">' +
    ecoRow('PM2.5', '15 μg/m³', 'green', '优') +
    ecoRow('PM10', '38 μg/m³', 'green', '优') +
    ecoRow('臭氧 O₃', '72 μg/m³', 'green', '良') +
    '</div>' +
    '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px">' +
    '<span style="font-size:15px;color:#1E7A54;line-height:1.6">💡 建议：空气优良，适宜晨练、晾晒和田间劳作。</span></div>' +
    '</div>'
  openGovModal('🌬️ 空气质量', h)
}
function showWaterDetail() {
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
}
function showCarbonDetail() {
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:baseline;gap:10px;margin-bottom:14px">' +
    '<span style="font-size:32px;font-weight:700;color:#1F2D3D">860</span>' +
    '<span style="font-size:15px;color:#66788A">吨CO₂当量/年</span></div>' +
    '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">' +
    ecoRow('🌲 林地面积', '1280 亩', 'green', '固碳主力') +
    ecoRow('🍎 果园碳汇', '520 吨/年', 'green', '稳定') +
    ecoRow('🌾 农田固碳', '340 吨/年', 'green', '稳定') +
    '</div>' +
    '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px">' +
    '<span style="font-size:15px;color:#1E7A54;line-height:1.6">🌱 本村碳汇较去年 ↑8%，主要来自果园与生态林。</span></div>' +
    '</div>'
  openGovModal('🌳 碳汇', h)
}
function showStrawDetail() {
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:baseline;gap:10px;margin-bottom:14px">' +
    '<span style="font-size:32px;font-weight:700;color:#1F2D3D">92%</span>' +
    '<span style="font-size:15px;color:#66788A">综合利用率 · 同比 ↑5%</span></div>' +
    '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">' +
    ecoRow('🌾 饲料化', '42%', 'green', '主要') +
    ecoRow('♻️ 还田利用', '30%', 'green', '稳定') +
    ecoRow('⚡ 秸秆发电', '20%', 'green', '稳定') +
    '</div>' +
    '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px;margin-bottom:14px">' +
    '<span style="font-size:15px;color:#1E7A54;line-height:1.6">🌱 秸秆就近还田或交售回收点，可获综合利用补贴。</span></div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end">' +
    '<button class="btn btn-primary" onclick="window._svc.requestStraw()">🚜 申请上门回收</button></div>' +
    '</div>'
  openGovModal('🌾 秸秆利用', h)
}`;
if (s.includes(anchor)) { s = s.replace(anchor, funcs); check('3-insert-stat-detail-functions', true); }
else { check('3-insert-stat-detail-functions', false); }

// ===== 4. Register reportEnvironment on window._svc =====
const oldSvc = `    showMyEventDetailById, filterMyReports, previewPhoto, requestGarbage, requestStraw,`;
const newSvc = `    showMyEventDetailById, filterMyReports, previewPhoto, requestGarbage, requestStraw, reportEnvironment,`;
if (s.includes(oldSvc)) { s = s.replace(oldSvc, newSvc); check('4-register-reportEnvironment', true); }
else { check('4-register-reportEnvironment', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== ECOLOGY STAT DETAILS ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
