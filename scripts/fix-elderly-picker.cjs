// Fix elderly: add elder picker for quick actions + per-elder alert settings
const fs = require('fs');
const path = require('path');
const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0;

// ===== 1. Add elderAlertSettings store after elderly data =====
const dataEnd = `  { id: 22, name: '周爷爷', age: 91, gender: '男', relation: '岳父', addr: '三组北侧', group: '三组', living: '分住（同村）', device: '智能手表', status: '需关注', health: '糖尿病，血糖控制尚可', heartRate: 72, sleep: 6.5, bloodPressure: '138/86', lastMeasure: '2026-08-11 06:45', activity: '今日步数：1,800步，活动时长：1.2h', recentAbnormal: '暂无近期异常' }
])`;
const dataWithStore = dataEnd + `
const elderAlertSettings = reactive({})
let _pendingElderAction = null`;
if (s.includes(dataEnd) && !s.includes('elderAlertSettings')) {
  s = s.replace(dataEnd, dataWithStore);
  ok++; console.log('OK: 1-elderAlertSettings store');
} else { console.log('FAIL: 1-elderAlertSettings store'); }

// ===== 2. Insert new functions before showHealthReportFor (before line 760) =====
const beforeShowHR = `function showHealthReportFor(e){`;
const newFunctions = `// ===== Elderly picker & per-elder helpers =====
function elderPicker(actionFn, title){
  _pendingElderAction = actionFn
  let h = '<div style="font-size:12px;color:#6F91A8;margin-bottom:14px">请选择要操作的老人</div>'
  elderly.forEach(e => {
    const icon = e.gender === '男' ? '\\u{1F468}' : '\\u{1F469}'
    h += '<div onclick="window._svc.elderPickerSelect(' + e.id + ')" style="cursor:pointer;background:rgba(10,36,68,0.55);border:1px solid rgba(40,199,250,0.08);border-radius:10px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;gap:12px;transition:all 0.2s" onmouseover="this.style.borderColor=\\'rgba(40,199,250,0.35)\\';this.style.background=\\'rgba(40,199,250,0.06)\\';" onmouseout="this.style.borderColor=\\'rgba(40,199,250,0.08)\\';this.style.background=\\'rgba(10,36,68,0.55)\\';"><div style="font-size:28px">' + icon + '</div><div style="flex:1"><div style="color:#fff;font-weight:600;font-size:13px;margin-bottom:3px">' + e.name + ' <span style="font-size:10px;color:#6F91A8">' + e.age + '岁</span><span class="ec-relation" style="margin-left:4px">' + e.relation + '</span></div><div style="font-size:10px;color:#6F91A8">\\u{1F4CD} ' + e.addr + ' <span style="margin-left:6px">' + e.living + '</span></div></div><span class="tag ' + (e.status === '重点关注' ? 'r' : 'y') + '">' + e.status + '</span></div>'
  })
  h += '<div style="text-align:center;margin-top:12px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="flex:none;width:auto">取消</button></div>'
  opMod(title, h, 'mod-sm')
}
function elderPickerSelect(eid){
  const e = elderly.find(x => x.id === eid)
  if (e && _pendingElderAction) {
    const fn = _pendingElderAction
    _pendingElderAction = null
    clsMod()
    setTimeout(function(){ fn(e) }, 80)
  }
}
function showLocationFor(e){
  const dist = Math.floor(Math.random() * 400 + 300)
  const now = new Date()
  const ts = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes() - Math.floor(Math.random() * 30)).padStart(2, '0')
  let h = '<div style="font-size:11px;color:#6F91A8;margin-bottom:14px">' + e.name + ' 最近一次定位</div>'
  h += '<div style="background:rgba(10,36,68,0.55);border:1px solid rgba(40,199,250,0.10);border-radius:10px;padding:12px 14px;margin-bottom:10px">'
  h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="color:#fff;font-weight:600;font-size:14px">' + e.name + '</span><span style="color:#6F91A8;font-size:11px">' + e.relation + '</span><span class="tag ' + (e.status === '重点关注' ? 'r' : 'y') + '">' + e.status + '</span></div>'
  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px">'
  h += '<div><span style="color:#6F91A8">所在组</span><div style="color:#D0E4F5">' + e.group + '</div></div>'
  h += '<div><span style="color:#6F91A8">定位描述</span><div style="color:#D0E4F5">' + e.addr + '</div></div>'
  h += '<div><span style="color:#6F91A8">距村委会</span><div style="color:#28C7FA;font-weight:600">约 ' + dist + 'm</div></div>'
  h += '<div><span style="color:#6F91A8">最后定位</span><div style="color:#D0E4F5">' + ts + '</div></div>'
  h += '</div></div>'
  h += '<div style="font-size:10px;color:#6F91A8;text-align:center;margin-top:8px">\\u{1F4CD} 基于智能穿戴设备定位，精度约15m（后续版本将接入地图）</div>'
  opMod('\\u{1F4CD} 老人位置 — ' + e.name, h, 'mod-md')
}
function showAlertSettingsFor(e){
  const s = elderAlertSettings[e.id] || { hr: 100, sleep: 5, inactive: 3 }
  let h = '<div style="font-size:12px;color:#6F91A8;margin-bottom:12px">为 <span style="color:#fff;font-weight:600">' + e.name + '</span>（<span style="color:#28C7FA">' + e.relation + '</span>）设置健康预警阈值</div>'
  h += '<div class="svc-form-row"><div class="svc-fld"><label>心率上限（bpm）</label><input type="number" id="al_hr" value="' + s.hr + '" min="60" max="200"><div style="font-size:10px;color:#6F91A8;margin-top:3px">正常范围 60-100，建议上限 100-120</div></div></div>'
  h += '<div class="svc-form-row"><div class="svc-fld"><label>睡眠下限（小时）</label><input type="number" id="al_sleep" value="' + s.sleep + '" min="2" max="12" step="0.5"><div style="font-size:10px;color:#6F91A8;margin-top:3px">低于此值触发预警，建议 ≥4 小时</div></div></div>'
  h += '<div class="svc-form-row"><div class="svc-fld"><label>异常不活动时长（小时）</label><input type="number" id="al_inactive" value="' + s.inactive + '" min="1" max="24" step="0.5"><div style="font-size:10px;color:#6F91A8;margin-top:3px">持续无活动超过此时长触发预警</div></div></div>'
  h += '<div class="svc-form-actions" style="margin-top:20px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="flex:none;width:auto">取消</button><button class="svc-btn svc-btn-primary" onclick="window._svc.saveAlertSettingsFor(' + e.id + ')" style="flex:none;width:auto">\\u2713 保存设置</button></div>'
  // store current elder id for save
  h += '<input type="hidden" id="al_eid" value="' + e.id + '">'
  opMod('\\u2699 预警设置 — ' + e.name, h, 'mod-md')
}
function saveAlertSettingsFor(eid){
  const hr = parseInt(document.getElementById('al_hr')?.value) || 0
  const sl = parseFloat(document.getElementById('al_sleep')?.value) || 0
  const ia = parseFloat(document.getElementById('al_inactive')?.value) || 0
  if (hr < 60 || hr > 200) { toast('心率上限需在 60-200 bpm 之间', 'err'); return }
  if (sl < 2 || sl > 12) { toast('睡眠下限需在 2-12 小时之间', 'err'); return }
  if (ia < 1 || ia > 24) { toast('不活动时长需在 1-24 小时之间', 'err'); return }
  elderAlertSettings[eid] = { hr, sleep: sl, inactive: ia }
  const e = elderly.find(x => x.id === eid)
  toast('\\u2713 ' + (e ? e.name : '') + ' 预警设置已保存\\n心率上限：' + hr + ' bpm | 睡眠下限：' + sl + 'h | 不活动：' + ia + 'h', 'ok')
  clsMod()
}

function showHealthReportFor(e){`;
if (s.includes(beforeShowHR)) {
  s = s.replace(beforeShowHR, newFunctions);
  ok++; console.log('OK: 2-new functions inserted');
} else { console.log('FAIL: 2-new functions'); }

// ===== 3. Replace showHealthReport() to use picker =====
const oldShowHR = `function showHealthReport(){
  const r=elderly[0]; if(!r){toast('暂无老人数据','warn');return}; showHealthReportFor(r)
}`;
const newShowHR = `function showHealthReport(){
  if(elderly.length===0){toast('暂无绑定老人','warn');return}
  if(elderly.length===1){showHealthReportFor(elderly[0]);return}
  elderPicker(showHealthReportFor,'选择老人 · 查看健康报告')
}`;
if (s.includes(oldShowHR)) {
  s = s.replace(oldShowHR, newShowHR);
  ok++; console.log('OK: 3-showHealthReport');
} else { console.log('FAIL: 3-showHealthReport'); }

// ===== 4. Replace emergencyCall() to use picker =====
const oldEC = `function emergencyCall(){
  const e=elderly.find(x=>x.status==='重点关注')||elderly[0]
  if(e) emergencyCallFor(e); else toast('暂无老人数据','warn')
}`;
const newEC = `function emergencyCall(){
  if(elderly.length===0){toast('暂无绑定老人','warn');return}
  if(elderly.length===1){emergencyCallFor(elderly[0]);return}
  elderPicker(emergencyCallFor,'选择呼救对象')
}`;
if (s.includes(oldEC)) {
  s = s.replace(oldEC, newEC);
  ok++; console.log('OK: 4-emergencyCall');
} else { console.log('FAIL: 4-emergencyCall'); }

// ===== 5. Replace showElderlyLocation() to use picker =====
const oldLoc = `function showElderlyLocation(){
  let h='<div style="font-size:11px;color:#6F91A8;margin-bottom:14px">当前绑定老人实时位置（最近一次定位）</div>'
  elderly.forEach(e=>{
    const dist=Math.floor(Math.random()*400+300)
    const now=new Date();const ts=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')+' '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()-Math.floor(Math.random()*30)).padStart(2,'0')
    h+='<div style="background:rgba(10,36,68,0.55);border:1px solid rgba(40,199,250,0.08);border-radius:10px;padding:12px 14px;margin-bottom:10px">'
    h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="color:#fff;font-weight:600;font-size:13px">'+e.name+'</span><span style="color:#6F91A8;font-size:11px">'+e.relation+'</span><span class="tag '+(e.status==='重点关注'?'r':'y')+'">'+e.status+'</span></div>'
    h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px">'
    h+='<div><span style="color:#6F91A8">所在组</span><div style="color:#D0E4F5">'+e.group+'</div></div>'
    h+='<div><span style="color:#6F91A8">定位描述</span><div style="color:#D0E4F5">'+e.addr+'</div></div>'
    h+='<div><span style="color:#6F91A8">距村委会</span><div style="color:#28C7FA;font-weight:600">约 '+dist+'m</div></div>'
    h+='<div><span style="color:#6F91A8">最后定位</span><div style="color:#D0E4F5">'+ts+'</div></div>'
    h+='</div></div>'
  })
  h+='<div style="font-size:10px;color:#6F91A8;text-align:center;margin-top:8px">📍 基于智能穿戴设备定位，精度约15m（后续版本将接入地图）</div>'
  opMod('📍 老人位置',h,'mod-md')
}`;
const newLoc = `function showElderlyLocation(){
  if(elderly.length===0){toast('暂无绑定老人','warn');return}
  if(elderly.length===1){showLocationFor(elderly[0]);return}
  elderPicker(showLocationFor,'选择老人 · 查看位置')
}`;
if (s.includes(oldLoc)) {
  s = s.replace(oldLoc, newLoc);
  ok++; console.log('OK: 5-showElderlyLocation');
} else { console.log('FAIL: 5-showElderlyLocation'); }

// ===== 6. Replace dispatchAlert() to use picker =====
const oldDA = `function dispatchAlert(){
  let h='<div class="mod-desc">设置老人健康预警阈值，超过阈值自动推送预警通知</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>心率上限（bpm）</label><input type="number" id="al_hr" value="100" min="60" max="200"><div style="font-size:10px;color:#6F91A8;margin-top:3px">正常范围 60-100，建议上限 100-120</div></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>睡眠下限（小时）</label><input type="number" id="al_sleep" value="5" min="2" max="12" step="0.5"><div style="font-size:10px;color:#6F91A8;margin-top:3px">低于此值触发预警，建议 ≥4 小时</div></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>异常不活动时长（小时）</label><input type="number" id="al_inactive" value="3" min="1" max="24" step="0.5"><div style="font-size:10px;color:#6F91A8;margin-top:3px">持续无活动超过此时长触发预警</div></div></div>'
  h+='<div class="svc-form-actions" style="margin-top:20px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="flex:none;width:auto">取消</button><button class="svc-btn svc-btn-primary" onclick="window._svc.saveAlertSettings()" style="flex:none;width:auto">✓ 保存设置</button></div>'
  opMod('⚙ 预警设置',h,'mod-md')
}`;
const newDA = `function dispatchAlert(){
  if(elderly.length===0){toast('暂无绑定老人','warn');return}
  if(elderly.length===1){showAlertSettingsFor(elderly[0]);return}
  elderPicker(showAlertSettingsFor,'选择老人 · 预警设置')
}`;
if (s.includes(oldDA)) {
  s = s.replace(oldDA, newDA);
  ok++; console.log('OK: 6-dispatchAlert');
} else { console.log('FAIL: 6-dispatchAlert'); }

// ===== 7. Update window._svc =====
const svcOld = `,saveAlertSettings,applyFromList`;
const svcNew = `,elderPickerSelect,saveAlertSettingsFor,applyFromList`;
if (s.includes(svcOld)) {
  s = s.replace(svcOld, svcNew);
  ok++; console.log('OK: 7-window._svc');
} else { console.log('FAIL: 7-window._svc'); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== FINAL ===');
console.log('Changes:', ok, '/ 7');
console.log('Length:', s.length);
