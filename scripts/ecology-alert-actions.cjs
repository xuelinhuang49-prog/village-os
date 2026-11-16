// Ecology Center — make 环境告警 actionable, not just display.
//   1. Enrich ecoAlerts with where/current/standard/risk/advice + actionLabel
//   2. Alert list: add right-side action button
//   3. Add openEcoAlertDetail (哪里异常→当前→标准→危险→村民该做什么)
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. Enrich ecoAlerts =====
const oldAlerts = `const ecoAlerts = [
  { id: 1, icon: '💧', title: '3号水塘溶解氧偏低', desc: '当前值 3.2mg/L，标准≥5mg/L', time: '1小时前 · 已派单' },
  { id: 2, icon: '🌫️', title: 'PM10浓度接近预警值', desc: '当前值 48μg/m³，预警线50μg/m³', time: '2小时前 · 持续监测' },
  { id: 3, icon: '🗑️', title: '垃圾清运延迟提醒', desc: '1组垃圾点超过24h未清运', time: '3小时前 · 已通知保洁' }
]`;
const newAlerts = `const ecoAlerts = [
  { id: 1, icon: '💧', title: '3号水塘溶解氧偏低', desc: '当前值 3.2mg/L，标准≥5mg/L', time: '1小时前 · 已派单', actionLabel: '查看详情',
    where: '3号水塘', current: '溶解氧 3.2mg/L', standard: '≥5mg/L', risk: '中度风险：可能影响鱼虾存活', advice: '请勿在附近取水饮用或放牧饮水，已通知水务员处理' },
  { id: 2, icon: '🌫️', title: 'PM10浓度接近预警值', desc: '当前值 48μg/m³，预警线50μg/m³', time: '2小时前 · 持续监测', actionLabel: '查看详情',
    where: '全村空气质量', current: 'PM10 48μg/m³', standard: '预警线 50μg/m³', risk: '轻度风险：敏感人群注意', advice: '老人儿童减少户外长时间活动，粉尘作业注意防护' },
  { id: 3, icon: '🗑️', title: '垃圾清运延迟提醒', desc: '1组垃圾点超过24h未清运', time: '3小时前 · 已通知保洁', actionLabel: '查看清运情况',
    where: '1组垃圾点', current: '已超 24h 未清运', standard: '日产日清', risk: '轻度风险：蚊虫滋生隐患', advice: '生活垃圾请打包扎紧，可申请加急清运' }
]`;
if (s.includes(oldAlerts)) { s = s.replace(oldAlerts, newAlerts); check('1-enrich-ecoAlerts', true); }
else { check('1-enrich-ecoAlerts', false); }

// ===== 2. Alert list: add right-side action button =====
const oldList = `                  <div class="alert-item r" v-for="a in ecoAlerts" :key="a.id" @click="openAlertDetail(a)">
                    <span class="ai-ico">{{ a.icon }}</span>
                    <div><div class="ai-title">{{ a.title }}</div><div class="ai-desc">{{ a.desc }}</div><div class="ai-time">{{ a.time }}</div></div>
                  </div>`;
const newList = `                  <div class="alert-item r" v-for="a in ecoAlerts" :key="a.id" @click="openEcoAlertDetail(a)">
                    <span class="ai-ico">{{ a.icon }}</span>
                    <div style="flex:1;min-width:0"><div class="ai-title">{{ a.title }}</div><div class="ai-desc">{{ a.desc }}</div><div class="ai-time">{{ a.time }}</div></div>
                    <button class="btn btn-outline btn-sm" style="flex-shrink:0" @click.stop="openEcoAlertDetail(a)">{{ a.actionLabel }}</button>
                  </div>`;
if (s.includes(oldList)) { s = s.replace(oldList, newList); check('2-alert-action-button', true); }
else { check('2-alert-action-button', false); }

// ===== 3. Insert openEcoAlertDetail after showStrawDetail =====
const anchor = `  openGovModal('🌾 秸秆利用', h)
}`;
const funcs = `${anchor}

function ecoAlertField(lbl, val) {
  return '<div style="display:flex;align-items:flex-start;gap:12px;padding:11px 0;border-bottom:1px solid #F0F3F5"><span style="font-size:15px;color:#66788A;flex-shrink:0">' + lbl + '</span><span style="font-size:15px;color:#1F2D3D;font-weight:600;margin-left:auto;text-align:right">' + val + '</span></div>'
}
function openEcoAlertDetail(a) {
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><span style="font-size:24px">' + a.icon + '</span><span style="font-size:17px;color:#1F2D3D;font-weight:700">' + a.title + '</span></div>' +
    '<div style="display:flex;flex-direction:column;margin-bottom:16px">' +
    ecoAlertField('📍 哪里异常', a.where) +
    ecoAlertField('📊 当前值', a.current) +
    ecoAlertField('✅ 正常范围', a.standard) +
    ecoAlertField('⚠️ 危险程度', a.risk) +
    '</div>' +
    '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px;margin-bottom:16px">' +
    '<span style="font-size:15px;color:#1E7A54;line-height:1.6">👨‍🌾 您可以：' + a.advice + '</span></div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    (a.id === 3
      ? '<button class="btn btn-primary" onclick="window._svc.requestGarbage()">🚚 申请清运</button>'
      : '<button class="btn btn-primary" onclick="window._svc.reportEnvironment()">📷 上报问题</button>') +
    '</div></div>'
  openGovModal(a.title, h)
}`;
if (s.includes(anchor)) { s = s.replace(anchor, funcs); check('3-insert-alert-detail', true); }
else { check('3-insert-alert-detail', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== ECOLOGY ALERT ACTIONS ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
