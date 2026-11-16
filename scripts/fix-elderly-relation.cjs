// Fix elderly care: add relation field, update card + modals for family-binding model
const fs = require('fs');
const path = require('path');
const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0;

// === 1. Update elderly data — add relation, update type ===
const dataOld = `const elderly = reactive([
  { id: 21, name: '王奶奶', age: 85, gender: '女', addr: '中堰村二组东侧', group: '二组', type: '独居', device: '智能手环', status: '重点关注', health: '高血压3级，需每日监测', heartRate: 88, sleep: 4.2, bloodPressure: '152/95', lastMeasure: '2026-08-11 07:30', activity: '今日步数：3,200步，活动时长：2.5h', recentAbnormal: '8月9日 06:42 心率异常偏高（105bpm）| 8月7日 03:15 睡眠不足3小时' },
  { id: 22, name: '周爷爷', age: 91, gender: '男', addr: '中堰村三组北侧', group: '三组', type: '与子女同住', device: '智能手表', status: '需关注', health: '糖尿病，血糖控制尚可', heartRate: 72, sleep: 6.5, bloodPressure: '138/86', lastMeasure: '2026-08-11 06:45', activity: '今日步数：1,800步，活动时长：1.2h', recentAbnormal: '暂无近期异常' }
])`;
const dataNew = `const elderly = reactive([
  { id: 21, name: '王奶奶', age: 85, gender: '女', relation: '母亲', addr: '二组东侧', group: '二组', living: '同住', device: '智能手环', status: '重点关注', health: '高血压3级，需每日监测', heartRate: 88, sleep: 4.2, bloodPressure: '152/95', lastMeasure: '2026-08-11 07:30', activity: '今日步数：3,200步，活动时长：2.5h', recentAbnormal: '8月9日 06:42 心率异常偏高（105bpm）| 8月7日 03:15 睡眠不足3小时' },
  { id: 22, name: '周爷爷', age: 91, gender: '男', relation: '岳父', addr: '三组北侧', group: '三组', living: '分住（同村）', device: '智能手表', status: '需关注', health: '糖尿病，血糖控制尚可', heartRate: 72, sleep: 6.5, bloodPressure: '138/86', lastMeasure: '2026-08-11 06:45', activity: '今日步数：1,800步，活动时长：1.2h', recentAbnormal: '暂无近期异常' }
])`;
if (s.includes(dataOld)) { s = s.replace(dataOld, dataNew); ok++; console.log('OK: 1-data'); }
else { console.log('FAIL: 1-data'); }

// === 2. Update elderly card template ===
const tmplOld = `                <div class="ec-avatar">{{ e.gender === '男' ? '&#x1F468;' : '&#x1F469;' }}</div>
                <div class="ec-info">
                  <div class="ec-name">{{ e.name }} <span style="font-size:10px;color:#6F91A8">{{ e.age }}岁</span></div>
                  <div class="ec-addr">{{ e.addr }}</div>
                  <div class="ec-meta">
                    <span class="tag" :class="e.status==='正常'?'g':e.status==='重点关注'?'r':'y'">{{ e.status }}</span>
                    <span style="font-size:10px;color:#6F91A8;margin-left:6px">{{ e.type }} | {{ e.device }}</span>
                  </div>
                </div>`;
const tmplNew = `                <div class="ec-avatar">{{ e.gender === '男' ? '&#x1F468;' : '&#x1F469;' }}</div>
                <div class="ec-info">
                  <div class="ec-name">{{ e.name }} <span style="font-size:10px;color:#6F91A8">{{ e.age }}岁</span><span class="ec-relation">{{ e.relation }}</span></div>
                  <div class="ec-addr">📍 {{ e.addr }}<span style="font-size:10px;color:#6F91A8;margin-left:6px">{{ e.living }}</span></div>
                  <div class="ec-meta">
                    <span class="tag" :class="e.status==='正常'?'g':e.status==='重点关注'?'r':'y'">{{ e.status }}</span>
                    <span style="font-size:10px;color:#6F91A8;margin-left:6px">{{ e.device }}</span>
                  </div>
                </div>`;
if (s.includes(tmplOld)) { s = s.replace(tmplOld, tmplNew); ok++; console.log('OK: 2-template'); }
else { console.log('FAIL: 2-template'); }

// === 3. Update emergencyCallFor — change "类型" to "与本人关系" ===
const emOld = `  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#6F91A8">类型</span><span style="color:#fff">'+e.type+'</span></div>'`;
const emNew = `  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#6F91A8">与本人关系</span><span style="color:#fff">'+e.relation+'</span></div>'`;
if (s.includes(emOld)) { s = s.replace(emOld, emNew); ok++; console.log('OK: 3-emergencyCallFor relation'); }
else { console.log('FAIL: 3-emergencyCallFor relation'); }

// === 4. Update emergencyCallFor — pass relation instead of type to confirmEmergencyCall ===
const emCallOld = `window._svc.confirmEmergencyCall(\\''+e.name+'\\',\\''+e.addr+'\\',\\''+e.type+'\\')`;
const emCallNew = `window._svc.confirmEmergencyCall(\\''+e.name+'\\',\\''+e.addr+'\\',\\''+e.relation+'\\')`;
if (s.includes(emCallOld)) { s = s.replace(emCallOld, emCallNew); ok++; console.log('OK: 4-emergencyCallFor-param'); }
else { console.log('FAIL: 4-emergencyCallFor-param'); }

// === 5. Update confirmEmergencyCall — rename param type→relation, add to display ===
const cfmOld = `function confirmEmergencyCall(name,addr,type){`;
const cfmNew = `function confirmEmergencyCall(name,addr,relation){`;
if (s.includes(cfmOld)) { s = s.replace(cfmOld, cfmNew); ok++; console.log('OK: 5-confirmEmergencyCall signature'); }
else { console.log('FAIL: 5-confirmEmergencyCall signature'); }

// === 6. Update showElderlyLocation — add relation to location card ===
const locCardOld = `h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="color:#fff;font-weight:600;font-size:13px">'+e.name+'</span><span class="tag '+(e.status==='重点关注'?'r':'y')+'">'+e.status+'</span></div>'`;
const locCardNew = `h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="color:#fff;font-weight:600;font-size:13px">'+e.name+'</span><span style="color:#6F91A8;font-size:11px">'+e.relation+'</span><span class="tag '+(e.status==='重点关注'?'r':'y')+'">'+e.status+'</span></div>'`;
if (s.includes(locCardOld)) { s = s.replace(locCardOld, locCardNew); ok++; console.log('OK: 6-location card'); }
else { console.log('FAIL: 6-location card'); }

// === 7. Add CSS for ec-relation badge ===
const cssOld = `.ec-name { font-size:14px; font-weight:600; color:#fff; }`;
const cssNew = `.ec-name { font-size:14px; font-weight:600; color:#fff; display:flex;align-items:center;gap:6px;flex-wrap:wrap; }
.ec-relation { font-size:10px;font-weight:500;color:#28C7FA;background:rgba(40,199,250,0.08);border:1px solid rgba(40,199,250,0.15);padding:1px 7px;border-radius:10px;white-space:nowrap; }`;
if (s.includes(cssOld)) { s = s.replace(cssOld, cssNew); ok++; console.log('OK: 7-CSS'); }
else { console.log('FAIL: 7-CSS'); }

// === 8. Update KPI labels — change label to include relation hint ===
const kpiLabelOld = `      { icon:'\\u{1F474}', value:elderly.length+'人', label:'绑定老人', color:'g' },`;
const kpiLabelNew = `      { icon:'\\u{1F474}', value:elderly.length+'人', label:'绑定家庭老人', color:'g' },`;
if (s.includes(kpiLabelOld)) { s = s.replace(kpiLabelOld, kpiLabelNew); ok++; console.log('OK: 8-KPI label'); }
else { console.log('FAIL: 8-KPI label'); }

// === 9. Also update the "家庭老人" title to clarify family context ===
const titleOld = `<div class="section-title">&#x1F474; 家庭老人</div>`;
const titleNew = `<div class="section-title">&#x1F474; 我的家庭老人</div>`;
if (s.includes(titleOld)) { s = s.replace(titleOld, titleNew); ok++; console.log('OK: 9-title'); }
else { console.log('FAIL: 9-title'); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== FINAL ===');
console.log('Changes:', ok, 'Length:', s.length);
