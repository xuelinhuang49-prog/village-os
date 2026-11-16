// Fix elderly care module — modals, KPIs, emergency/location/report/alert
const fs = require('fs');
const path = require('path');
const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0;

// === 1. Update elderly data with richer fields ===
const elderlyDataOld = `const elderly = reactive([
  { id: 21, name: '王奶奶', age: 85, gender: '女', addr: '2组东侧', type: '独居', device: '智能手环', status: '重点关注', health: '高血压3级，需每日监测', heartRate: 88, sleep: 4.2 },
  { id: 22, name: '周爷爷', age: 91, gender: '男', addr: '3组北侧', type: '与子女同住', device: '智能手表', status: '需关注', health: '糖尿病，血糖控制尚可', heartRate: 72, sleep: 6.5 }
])`;
const elderlyDataNew = `const elderly = reactive([
  { id: 21, name: '王奶奶', age: 85, gender: '女', addr: '中堰村二组东侧', group: '二组', type: '独居', device: '智能手环', status: '重点关注', health: '高血压3级，需每日监测', heartRate: 88, sleep: 4.2, bloodPressure: '152/95', lastMeasure: '2026-08-11 07:30', activity: '今日步数：3,200步，活动时长：2.5h', recentAbnormal: '8月9日 06:42 心率异常偏高（105bpm）| 8月7日 03:15 睡眠不足3小时' },
  { id: 22, name: '周爷爷', age: 91, gender: '男', addr: '中堰村三组北侧', group: '三组', type: '与子女同住', device: '智能手表', status: '需关注', health: '糖尿病，血糖控制尚可', heartRate: 72, sleep: 6.5, bloodPressure: '138/86', lastMeasure: '2026-08-11 06:45', activity: '今日步数：1,800步，活动时长：1.2h', recentAbnormal: '暂无近期异常' }
])`;
if (s.includes(elderlyDataOld)) { s = s.replace(elderlyDataOld, elderlyDataNew); ok++; console.log('OK: 1-elderly data'); }
else { console.log('FAIL: 1-elderly data'); }

// === 2. Fix KPI cards for elderly tab ===
const kpiElderlyOld = `  if (key === 'elderly') {
    const alertCnt = elderly.filter(e=>e.status==='重点关注').length
    return [
      { icon:'\\u{1F474}', value:elderly.length+'人', label:'绑定老人', color:'g' },
      { icon:'\\u{2764}', value:elderly[0]?elderly[0].heartRate+'bpm':'--', label:'心率', color:'r' },
      { icon:'\\u{1F4CA}', value:elderly[0]?elderly[0].sleep+'h':'--', label:'睡眠', color:'b' },`;
const kpiElderlyNew = `  if (key === 'elderly') {
    const alertCnt = elderly.filter(e=>e.status==='重点关注').length
    const focusElder = elderly.find(e=>e.status==='重点关注')
    return [
      { icon:'\\u{1F474}', value:elderly.length+'人', label:'绑定老人', color:'g' },
      { icon:'\\u26A0', value:alertCnt+'人', label:'重点关注', color:'r' },
      { icon:'\\u{2764}', value:focusElder?focusElder.heartRate+'bpm':'--', label:focusElder?focusElder.name+' 心率':'心率', color:'r' },
      { icon:'\\u{1F4CA}', value:focusElder?focusElder.sleep+'h':'--', label:focusElder?focusElder.name+' 睡眠':'睡眠', color:'b' },`;
if (s.includes(kpiElderlyOld)) { s = s.replace(kpiElderlyOld, kpiElderlyNew); ok++; console.log('OK: 2-elderly KPI'); }
else { console.log('FAIL: 2-elderly KPI'); }

// === 3. Rewrite showHealthReportFor — full vitals modal ===
const reportForOld = `function showHealthReportFor(e){
  let h='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px;margin-bottom:12px"><div style="text-align:center;background:rgba(10,36,68,0.55);padding:12px;border-radius:6px"><div style="font-size:20px;font-weight:700;color:#E74C3C">'+e.heartRate+'</div><div style="color:#6F91A8">心率 bpm</div></div><div style="text-align:center;background:rgba(10,36,68,0.55);padding:12px;border-radius:6px"><div style="font-size:20px;font-weight:700;color:#28C7FA">'+e.sleep+'h</div><div style="color:#6F91A8">睡眠时长</div></div></div><div style="font-size:11px;color:#6F91A8">健康摘要：'+e.health+'</div><div style="margin-top:8px"><button class="btn btn-p btn-s" onclick="window._svc.sendReport()">\\u{1F4F1} 发送详细报告</button></div>'
  opMod('\\u{1F4CA} 健康报告 — '+e.name,h)
}`;
const reportForNew = `function showHealthReportFor(e){
  const bp = e.bloodPressure || '--/--'
  let h='<div style="background:rgba(40,199,250,0.04);border:1px solid rgba(40,199,250,0.10);border-radius:8px;padding:12px 14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center"><span style="color:#6F91A8;font-size:11px">最近测量</span><span style="color:#D0E4F5;font-size:12px">'+e.lastMeasure+'</span></div>'
  // Vitals grid (4 cells)
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px;margin-bottom:12px">'
  h+='<div style="text-align:center;background:rgba(10,36,68,0.55);padding:14px 10px;border-radius:8px;border:1px solid rgba(231,76,60,0.08)"><div style="font-size:22px;font-weight:700;color:#E74C3C">'+e.heartRate+'</div><div style="color:#6F91A8;font-size:10px">心率（bpm）</div></div>'
  h+='<div style="text-align:center;background:rgba(10,36,68,0.55);padding:14px 10px;border-radius:8px;border:1px solid rgba(231,76,60,0.08)"><div style="font-size:22px;font-weight:700;color:#E74C3C">'+bp+'</div><div style="color:#6F91A8;font-size:10px">血压（mmHg）</div></div>'
  h+='<div style="text-align:center;background:rgba(10,36,68,0.55);padding:14px 10px;border-radius:8px;border:1px solid rgba(40,199,250,0.08)"><div style="font-size:22px;font-weight:700;color:#28C7FA">'+e.sleep+'h</div><div style="color:#6F91A8;font-size:10px">昨夜睡眠</div></div>'
  h+='<div style="text-align:center;background:rgba(10,36,68,0.55);padding:14px 10px;border-radius:8px;border:1px solid rgba(40,199,250,0.08)"><div style="font-size:22px;font-weight:700;color:#28C7FA">'+e.device+'</div><div style="color:#6F91A8;font-size:10px">监测设备</div></div>'
  h+='</div>'
  // Health summary
  h+='<div class="mod-divider"></div><div class="mod-section-title">📋 健康摘要</div>'
  h+='<div style="font-size:12px;color:#D0E4F5;background:rgba(10,36,68,0.55);border-radius:6px;padding:10px 12px;margin-bottom:8px">'+e.health+'</div>'
  // Activity
  h+='<div class="mod-section-title">🚶 活动情况</div>'
  h+='<div style="font-size:12px;color:#B7D3E8;background:rgba(10,36,68,0.55);border-radius:6px;padding:10px 12px;margin-bottom:8px">'+e.activity+'</div>'
  // Recent abnormal
  h+='<div class="mod-section-title">⚠ 近期异常记录</div>'
  h+='<div style="font-size:12px;color:#F5B83D;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.12);border-radius:6px;padding:10px 12px;margin-bottom:12px">'+e.recentAbnormal+'</div>'
  // Actions
  h+='<div class="svc-form-actions"><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="flex:none;width:auto">关闭</button><button class="svc-btn svc-btn-primary" onclick="window._svc.sendHealthReport(\\''+e.name+'\\','+e.id+')" style="flex:none;width:auto">📱 发送到手机</button></div>'
  opMod('📊 健康报告 — '+e.name,h,'mod-md')
}`;
if (s.includes(reportForOld)) { s = s.replace(reportForOld, reportForNew); ok++; console.log('OK: 3-health report'); }
else { console.log('FAIL: 3-health report'); }

// === 4. Replace sendReport with sendHealthReport ===
const sendReportOld = `function sendReport(){clsMod();toast('详细报告已发送至手机','ok')}`;
const sendReportNew = `function sendHealthReport(name,id){
  const now=new Date();const ts=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')+' '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0')
  toast('✓ '+name+' 健康报告已发送至绑定手机（'+ts+'）','ok');clsMod()
}`;
if (s.includes(sendReportOld)) { s = s.replace(sendReportOld, sendReportNew); ok++; console.log('OK: 4-sendReport'); }
else { console.log('FAIL: 4-sendReport'); }

// === 5. Rewrite emergencyCallFor — dark modal instead of native confirm ===
const emCallForOld = `function emergencyCallFor(e){if(confirm('确认呼叫急救中心？将发送 '+e.name+' 的位置和健康档案。')){toast('急救中心已响应，预计15分钟内到达','ok')}}`;
const emCallForNew = `function emergencyCallFor(e){
  let h='<div style="text-align:center;padding:8px 0"><div style="font-size:40px;margin-bottom:12px">🚑</div><div style="color:#fff;font-size:15px;font-weight:700;margin-bottom:6px">确认紧急呼救</div><div style="color:#6F91A8;font-size:12px;margin-bottom:16px">将向紧急联系人发送 '+e.name+' 的位置和健康档案</div>'
  h+='<div style="background:rgba(231,76,60,0.06);border:1px solid rgba(231,76,60,0.12);border-radius:8px;padding:10px 14px;margin-bottom:16px;text-align:left">'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#6F91A8">老人</span><span style="color:#fff">'+e.name+'（'+e.age+'岁）</span></div>'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#6F91A8">位置</span><span style="color:#fff">中堰村'+e.addr+'</span></div>'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#6F91A8">类型</span><span style="color:#fff">'+e.type+'</span></div>'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#6F91A8">健康状况</span><span style="color:#F5B83D">'+e.health+'</span></div>'
  h+='</div>'
  h+='<div class="svc-form-actions"><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="flex:none;width:auto">取消</button><button class="svc-btn svc-btn-primary" onclick="window._svc.confirmEmergencyCall(\\''+e.name+'\\',\\''+e.addr+'\\',\\''+e.type+'\\')" style="flex:none;width:auto;background:linear-gradient(135deg,#E74C3C,#c0392b)">确认呼救</button></div>'
  opMod('🚑 紧急呼救',h,'mod-sm')
}`;
if (s.includes(emCallForOld)) { s = s.replace(emCallForOld, emCallForNew); ok++; console.log('OK: 5-emergencyCallFor'); }
else { console.log('FAIL: 5-emergencyCallFor'); }

// === 6. Add confirmEmergencyCall function ===
const emCallOld = `function emergencyCall(){
  const e=elderly[0]
  if(confirm('确认呼叫急救中心？将发送 '+(e?e.name:'老人')+' 的位置信息和健康档案。')){toast('急救中心已响应，预计15分钟内到达','ok')}
}`;
const emCallNew = `function emergencyCall(){
  const e=elderly.find(x=>x.status==='重点关注')||elderly[0]
  if(e) emergencyCallFor(e); else toast('暂无老人数据','warn')
}
function confirmEmergencyCall(name,addr,type){
  const now=new Date();const ts=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')+' '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0')
  let h='<div style="text-align:center;padding:8px 0"><div style="font-size:40px;margin-bottom:12px">✅</div><div style="color:#28C76F;font-size:15px;font-weight:700;margin-bottom:6px">呼救已发出</div><div style="color:#6F91A8;font-size:12px;margin-bottom:16px">紧急联系人已通知，请保持电话畅通</div>'
  h+='<div style="background:rgba(40,199,111,0.05);border:1px solid rgba(40,199,111,0.10);border-radius:8px;padding:10px 14px;margin-bottom:12px;text-align:left">'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#6F91A8">呼救对象</span><span style="color:#fff">'+name+'</span></div>'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#6F91A8">所在位置</span><span style="color:#fff">中堰村'+addr+'</span></div>'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#6F91A8">呼救时间</span><span style="color:#fff">'+ts+'</span></div>'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#6F91A8">联系人通知</span><span style="color:#28C76F">✓ 已通知（子女）</span></div>'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#6F91A8">村卫生室</span><span style="color:#28C76F">✓ 已通知</span></div>'
  h+='</div>'
  h+='<div style="font-size:10px;color:#f59e0b;text-align:center;margin-bottom:12px">⚠ 演示系统：以上为模拟通知流程，实际紧急情况请直接拨打120</div>'
  h+='<button class="svc-btn svc-btn-primary" onclick="window._svc.clsMod()" style="width:100%">我知道了</button></div>'
  opMod('🚑 呼救状态',h,'mod-sm')
}`;
if (s.includes(emCallOld)) { s = s.replace(emCallOld, emCallNew); ok++; console.log('OK: 6-emergencyCall'); }
else { console.log('FAIL: 6-emergencyCall'); }

// === 7. Rewrite showElderlyLocation — proper modal ===
const locOld = `function showElderlyLocation(){
  const locs=elderly.map(e=>e.name+' — '+e.addr+' 距离村委会约'+(Math.floor(Math.random()*500+500))+'m')
  toast(locs.join(' | '),'info')
}`;
const locNew = `function showElderlyLocation(){
  let h='<div style="font-size:11px;color:#6F91A8;margin-bottom:14px">当前绑定老人实时位置（最近一次定位）</div>'
  elderly.forEach(e=>{
    const dist=Math.floor(Math.random()*400+300)
    const now=new Date();const ts=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')+' '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()-Math.floor(Math.random()*30)).padStart(2,'0')
    h+='<div style="background:rgba(10,36,68,0.55);border:1px solid rgba(40,199,250,0.08);border-radius:10px;padding:12px 14px;margin-bottom:10px">'
    h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="color:#fff;font-weight:600;font-size:13px">'+e.name+'</span><span class="tag '+(e.status==='重点关注'?'r':'y')+'">'+e.status+'</span></div>'
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
if (s.includes(locOld)) { s = s.replace(locOld, locNew); ok++; console.log('OK: 7-location'); }
else { console.log('FAIL: 7-location'); }

// === 8. Fix location footer reference ===
// The location function has a bug — let me fix the footer line
const locFooterOld = `  h+='<div style="font-size:10px;color:#6F91A8;text-align:center;margin-top:8px">📍 基于 '+e.elderly&&elderly[0]?elderly[0].device:''+' 设备定位，精度约15m（后续版本将接入地图）</div>'`;
const locFooterNew = `  h+='<div style="font-size:10px;color:#6F91A8;text-align:center;margin-top:8px">📍 基于智能穿戴设备定位，精度约15m（后续版本将接入地图）</div>'`;
if (s.includes(locFooterOld)) { s = s.replace(locFooterOld, locFooterNew); ok++; console.log('OK: 8-location footer fix'); }
else { console.log('SKIP: 8-location footer (may be fine)'); }

// === 9. Rewrite dispatchAlert — dark form modal ===
const alertOld = `function dispatchAlert(){
  const h='<div style="font-size:11px;color:#6F91A8;margin-bottom:10px">设置预警阈值</div><div class="fld"><label>心率上限(bpm)</label><input id="al_hr" type="number" value="100"></div><div class="fld"><label>睡眠下限(h)</label><input id="al_sleep" type="number" value="5" step="0.5"></div><div class="fld"><label>异常不活动(h)</label><input id="al_inactive" type="number" value="3"></div><button class="btn btn-p" style="margin-top:8px" onclick="window._svc.saveAlert()">保存设置</button>'
  opMod('\\u{2699} 预警设置',h)
}`;
const alertNew = `function dispatchAlert(){
  let h='<div class="mod-desc">设置老人健康预警阈值，超过阈值自动推送预警通知</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>心率上限（bpm）</label><input type="number" id="al_hr" value="100" min="60" max="200"><div style="font-size:10px;color:#6F91A8;margin-top:3px">正常范围 60-100，建议上限 100-120</div></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>睡眠下限（小时）</label><input type="number" id="al_sleep" value="5" min="2" max="12" step="0.5"><div style="font-size:10px;color:#6F91A8;margin-top:3px">低于此值触发预警，建议 ≥4 小时</div></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>异常不活动时长（小时）</label><input type="number" id="al_inactive" value="3" min="1" max="24" step="0.5"><div style="font-size:10px;color:#6F91A8;margin-top:3px">持续无活动超过此时长触发预警</div></div></div>'
  h+='<div class="svc-form-actions" style="margin-top:20px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="flex:none;width:auto">取消</button><button class="svc-btn svc-btn-primary" onclick="window._svc.saveAlertSettings()" style="flex:none;width:auto">✓ 保存设置</button></div>'
  opMod('⚙ 预警设置',h,'mod-md')
}`;
if (s.includes(alertOld)) { s = s.replace(alertOld, alertNew); ok++; console.log('OK: 9-alert settings'); }
else { console.log('FAIL: 9-alert settings'); }

// === 10. Replace saveAlert with saveAlertSettings (with validation) ===
const saveAlertOld = `function saveAlert(){clsMod();toast('预警设置已保存','ok')}`;
const saveAlertNew = `function saveAlertSettings(){
  const hr=parseInt(document.getElementById('al_hr')?.value)||0
  const sleep=parseFloat(document.getElementById('al_sleep')?.value)||0
  const inactive=parseFloat(document.getElementById('al_inactive')?.value)||0
  if(hr<60||hr>200){toast('心率上限需在 60-200 bpm 之间','err');return}
  if(sleep<2||sleep>12){toast('睡眠下限需在 2-12 小时之间','err');return}
  if(inactive<1||inactive>24){toast('不活动时长需在 1-24 小时之间','err');return}
  toast('✓ 预警设置已保存\\n心率上限：'+hr+' bpm | 睡眠下限：'+sleep+'h | 不活动：'+inactive+'h','ok');clsMod()
}`;
if (s.includes(saveAlertOld)) { s = s.replace(saveAlertOld, saveAlertNew); ok++; console.log('OK: 10-saveAlertSettings'); }
else { console.log('FAIL: 10-saveAlertSettings'); }

// === 11. Update window._svc ===
const svcOld = `window._svc={clsMod,queryBalance,submitReimburse,confirmReg,sendReport,confirmTelemed,enterRoom,confirmAppt,saveAlert,submitRemote,triggerInvoiceUpload,triggerDiagnosisUpload,filterPayments,showLandSubsidyForm,showMachineSubsidyForm,showDibaoForm,showBizSubsidyForm,calcLandAmount,calcMachineAmount,calcDibaoIncome,submitLandSubsidy,submitMachineSubsidy,submitDibao,submitBizSubsidy,showSubsidyApply,showSubsidyProgress,showPolicyQuery,showMaterialDownload,downloadMaterial,downloadPolicyFile,showPolicyDetail,showSubsidyDetail,withdrawSubsidy,supplementSubsidy,onUploadFile,removeUploadFile,hasUpload,applyFromList:(name)=>{clsMod();if(name==='耕地地力保护补贴')showLandSubsidyForm();else if(name==='农机购置补贴')showMachineSubsidyForm();else if(name==='低保补助')showDibaoForm();else if(name==='创业补贴')showBizSubsidyForm()},enrollFromList:(title)=>{clsMod();const c=availableCourses.find(x=>x.title===title);if(c)enrollCourse(c)},toast:(m,t)=>{toast(m,t)}}`;
if (s.includes(svcOld)) {
  const svcNew = `window._svc={clsMod,queryBalance,submitReimburse,confirmReg,sendReport,confirmTelemed,enterRoom,confirmAppt,saveAlert,submitRemote,triggerInvoiceUpload,triggerDiagnosisUpload,filterPayments,showLandSubsidyForm,showMachineSubsidyForm,showDibaoForm,showBizSubsidyForm,calcLandAmount,calcMachineAmount,calcDibaoIncome,submitLandSubsidy,submitMachineSubsidy,submitDibao,submitBizSubsidy,showSubsidyApply,showSubsidyProgress,showPolicyQuery,showMaterialDownload,downloadMaterial,downloadPolicyFile,showPolicyDetail,showSubsidyDetail,withdrawSubsidy,supplementSubsidy,onUploadFile,removeUploadFile,hasUpload,confirmEmergencyCall,sendHealthReport,saveAlertSettings,applyFromList:(name)=>{clsMod();if(name==='耕地地力保护补贴')showLandSubsidyForm();else if(name==='农机购置补贴')showMachineSubsidyForm();else if(name==='低保补助')showDibaoForm();else if(name==='创业补贴')showBizSubsidyForm()},enrollFromList:(title)=>{clsMod();const c=availableCourses.find(x=>x.title===title);if(c)enrollCourse(c)},toast:(m,t)=>{toast(m,t)}}`;
  s = s.replace(svcOld, svcNew); ok++; console.log('OK: 11-window._svc');
} else { console.log('FAIL: 11-window._svc'); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== FINAL ===');
console.log('Changes:', ok, 'Length:', s.length);
