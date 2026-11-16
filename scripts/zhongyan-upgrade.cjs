// Upgrade subsidy module to 中堰村 formal sample — Shaanxi verified policy standards
const fs = require('fs');
const path = require('path');
const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0;

// === 1. Update availableSubsidies ===
const availOld = `const availableSubsidies = [
  { name: '耕地地力保护补贴', desc: '拥有耕地承包权的农户', amount: '¥120/亩', icon: '\\u{1F33E}' },
  { name: '农机购置补贴', desc: '新购农机具补贴', amount: '购机价35%', icon: '\\u{1F69C}' },
  { name: '低保补助', desc: '家庭人均收入低于标准', amount: '¥300/月', icon: '\\u{1F4B0}' },
  { name: '创业补贴', desc: '首次创业6个月内', amount: '最高¥8,000', icon: '\\u{1F3EA}' }
]`;
const availNew = `const availableSubsidies = [
  { name: '耕地地力保护补贴', desc: '拥有耕地承包权的种地农户', amount: '≥70元/亩', icon: '\\u{1F33E}' },
  { name: '农机购置补贴', desc: '新购农机具定额补贴', amount: '购机价≤30%', icon: '\\u{1F69C}' },
  { name: '低保补助', desc: '家庭人均收入低于当地标准', amount: '分档差额补助', icon: '\\u{1F4B0}' },
  { name: '创业补贴', desc: '首次创业满1年', amount: '¥10,000', icon: '\\u{1F3EA}' }
]`;
if (s.includes(availOld)) { s = s.replace(availOld, availNew); ok++; console.log('OK: 1-availableSubsidies'); }
else { console.log('FAIL: 1-availableSubsidies'); }

// === 2. Update subsidy sample data — keep as demo records, note Shaanxi context ===
const subOld = `const subsidy = reactive([
  { id:11, appNo:"SB20260615001", name:"王友德", type:"耕地地力保护补贴", amount:6200, status:"已发放", date:"2026-06-15", node:"已发放", nodes:["已提交","村级初审","乡镇审核","部门复核","待发放","已发放"], currentNodeIdx:5 },
  { id:12, appNo:"SB20260720002", name:"王友德", type:"农机购置补贴", amount:5000, status:"审核中", date:"2026-07-20", node:"乡镇审核", nodes:["已提交","村级初审","乡镇审核","部门复核","待发放","已发放"], currentNodeIdx:2 },
  { id:13, appNo:"SB20260701003", name:"王友德", type:"低保补助", amount:3600, status:"发放中", date:"2026-07-01", node:"待发放", nodes:["已提交","村级初审","乡镇审核","部门复核","待发放","已发放"], currentNodeIdx:4 }
])`;
const subNew = `const subsidy = reactive([
  { id:11, appNo:"SB20260615001", name:"王友德", type:"耕地地力保护补贴", amount:6650, status:"已发放", date:"2026-06-15", node:"已发放", nodes:["已提交","村级初审","乡镇审核","部门复核","待发放","已发放"], currentNodeIdx:5 },
  { id:12, appNo:"SB20260720002", name:"王友德", type:"农机购置补贴", amount:4800, status:"审核中", date:"2026-07-20", node:"乡镇审核", nodes:["已提交","村级初审","乡镇审核","部门复核","待发放","已发放"], currentNodeIdx:2 },
  { id:13, appNo:"SB20260701003", name:"王友德", type:"低保补助", amount:4260, status:"发放中", date:"2026-07-01", node:"待发放", nodes:["已提交","村级初审","乡镇审核","部门复核","待发放","已发放"], currentNodeIdx:4 }
])`;
if (s.includes(subOld)) { s = s.replace(subOld, subNew); ok++; console.log('OK: 2-subsidy data'); }
else { console.log('FAIL: 2-subsidy data — may already be updated'); }

// === 3. Update showSubsidyApply modal — item descriptions ===
const applyOld = `  const items=[
    {name:'耕地地力保护补贴',desc:'拥有耕地承包权的农户',amount:'¥120/亩',icon:'\\u{1F33E}',fn:'window._svc.showLandSubsidyForm()'},
    {name:'农机购置补贴',desc:'新购农机具补贴',amount:'购机价35%',icon:'\\u{1F69C}',fn:'window._svc.showMachineSubsidyForm()'},
    {name:'低保补助',desc:'家庭人均收入低于标准',amount:'¥300/月',icon:'💳',fn:'window._svc.showDibaoForm()'},
    {name:'创业补贴',desc:'首次创业6个月内',amount:'最高¥8,000',icon:'\\u{1F3EA}',fn:'window._svc.showBizSubsidyForm()'}
  ]`;
const applyNew = `  const items=[
    {name:'耕地地力保护补贴',desc:'拥有耕地承包权的种地农户',amount:'≥70元/亩',icon:'\\u{1F33E}',fn:'window._svc.showLandSubsidyForm()'},
    {name:'农机购置补贴',desc:'新购农机具定额补贴',amount:'购机价≤30%',icon:'\\u{1F69C}',fn:'window._svc.showMachineSubsidyForm()'},
    {name:'低保补助',desc:'家庭人均收入低于当地标准',amount:'分档差额补助',icon:'💳',fn:'window._svc.showDibaoForm()'},
    {name:'创业补贴',desc:'首次创业满1年',amount:'¥10,000',icon:'\\u{1F3EA}',fn:'window._svc.showBizSubsidyForm()'}
  ]`;
if (s.includes(applyOld)) { s = s.replace(applyOld, applyNew); ok++; console.log('OK: 3-showSubsidyApply'); }
else { console.log('SKIP: 3 (not found or already done)'); }

// === 4. Update showLandSubsidyForm — amount calc: ¥120→¥70, add policy note ===
const landFormOld = `function showLandSubsidyForm(){
  let h='<div class="mod-desc" style="display:flex;align-items:center;gap:6px"><span style="font-size:16px">👤</span><span style="color:#6F91A8;font-size:11px">本人信息 — 以下字段从当前登录账户自动带出，无需手动填写</span></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>姓名</label><input class="svc-self-field" value="王友德" readonly></div><div class="svc-fld"><label>身份证号</label><input class="svc-self-field" value="342***15**07" readonly></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>户籍所在地</label><input class="svc-self-field" value="刘圩村" readonly></div><div class="svc-fld"><label>联系电话</label><input class="svc-self-field" value="138****5432" readonly></div></div>'
  h+='<div class="mod-divider"></div><div class="mod-section-title">🌾 耕地信息</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>承包耕地面积（亩）<span style="color:#F44">*</span></label><input type="number" id="landArea" placeholder="请输入承包耕地面积" oninput="window._svc.calcLandAmount()" min="1" step="0.1"></div><div class="svc-fld"><label>地块位置<span style="color:#F44">*</span></label><input type="text" id="landLocation" placeholder="如：刘圩村三组"></div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>预估补贴金额</label><div id="landAmountDisplay" style="background:rgba(40,199,250,0.05);border:1px solid rgba(40,199,250,0.15);border-radius:6px;padding:10px 12px;font-size:18px;color:#28C76F;font-weight:700;text-align:center">¥0.00</div></div></div>'`;
const landFormNew = `function showLandSubsidyForm(){
  let h='<div class="mod-desc" style="display:flex;align-items:center;gap:6px"><span style="font-size:16px">👤</span><span style="color:#6F91A8;font-size:11px">本人信息 — 以下字段从当前登录账户自动带出，无需手动填写</span></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>姓名</label><input class="svc-self-field" value="王友德" readonly></div><div class="svc-fld"><label>身份证号</label><input class="svc-self-field" value="342***15**07" readonly></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>户籍所在地</label><input class="svc-self-field" value="中堰村" readonly></div><div class="svc-fld"><label>联系电话</label><input class="svc-self-field" value="138****5432" readonly></div></div>'
  h+='<div class="mod-divider"></div><div class="mod-section-title">🌾 耕地信息</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>承包耕地面积（亩）<span style="color:#F44">*</span></label><input type="number" id="landArea" placeholder="请输入确权耕地面积" oninput="window._svc.calcLandAmount()" min="1" step="0.1"></div><div class="svc-fld"><label>地块位置<span style="color:#F44">*</span></label><input type="text" id="landLocation" placeholder="如：中堰村三组"></div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>预估补贴金额（陕南 ≥60元/亩）</label><div id="landAmountDisplay" style="background:rgba(40,199,250,0.05);border:1px solid rgba(40,199,250,0.15);border-radius:6px;padding:10px 12px;font-size:18px;color:#28C76F;font-weight:700;text-align:center">¥0.00</div></div><div style="font-size:10px;color:#f59e0b;margin-top:4px">⚠ 实际补贴标准以县级农业农村部门核定为准，通过惠民"一卡通"发放</div></div>'`;
if (s.includes(landFormOld)) { s = s.replace(landFormOld, landFormNew); ok++; console.log('OK: 4-land form'); }
else { console.log('FAIL: 4-land form'); }

// === 5. Update calcLandAmount: 120→70 ===
const calcLandOld = `function calcLandAmount(){
  const area=parseFloat(document.getElementById('landArea')?.value)||0
  const display=document.getElementById('landAmountDisplay')
  if(display)display.textContent='¥'+(area*120).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2})
}`;
const calcLandNew = `function calcLandAmount(){
  const area=parseFloat(document.getElementById('landArea')?.value)||0
  const display=document.getElementById('landAmountDisplay')
  if(display)display.textContent='¥'+(area*70).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2})+'（参考，以核定为准）'
}`;
if (s.includes(calcLandOld)) { s = s.replace(calcLandOld, calcLandNew); ok++; console.log('OK: 5-calcLand'); }
else { console.log('FAIL: 5-calcLand'); }

// === 6. Update submitLandSubsidy: amount 120→70 ===
const submitLandOld2 = `  subsidy.push({id,appNo,name:'王友德',type:'耕地地力保护补贴',amount:Math.round(area*120),status:'审核中'`;
const submitLandNew2 = `  subsidy.push({id,appNo,name:'王友德',type:'耕地地力保护补贴',amount:Math.round(area*70),status:'审核中'`;
if (s.includes(submitLandOld2)) { s = s.replace(submitLandOld2, submitLandNew2); ok++; console.log('OK: 6-submitLand amount'); }
else { console.log('FAIL: 6-submitLand amount'); }

// === 7. Update showMachineSubsidyForm — 35%→30%, add policy note ===
const machineFormOld = `function showMachineSubsidyForm(){
  let h='<div class="mod-desc" style="display:flex;align-items:center;gap:6px"><span style="font-size:16px">👤</span><span style="color:#6F91A8;font-size:11px">本人信息 — 以下字段从当前登录账户自动带出，无需手动填写</span></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>姓名</label><input class="svc-self-field" value="王友德" readonly></div><div class="svc-fld"><label>身份证号</label><input class="svc-self-field" value="342***15**07" readonly></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>户籍所在地</label><input class="svc-self-field" value="刘圩村" readonly></div><div class="svc-fld"><label>联系电话</label><input class="svc-self-field" value="138****5432" readonly></div></div>'`;
const machineFormNew = `function showMachineSubsidyForm(){
  let h='<div class="mod-desc" style="display:flex;align-items:center;gap:6px"><span style="font-size:16px">👤</span><span style="color:#6F91A8;font-size:11px">本人信息 — 以下字段从当前登录账户自动带出，无需手动填写</span></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>姓名</label><input class="svc-self-field" value="王友德" readonly></div><div class="svc-fld"><label>身份证号</label><input class="svc-self-field" value="342***15**07" readonly></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>户籍所在地</label><input class="svc-self-field" value="中堰村" readonly></div><div class="svc-fld"><label>联系电话</label><input class="svc-self-field" value="138****5432" readonly></div></div>'`;
if (s.includes(machineFormOld)) { s = s.replace(machineFormOld, machineFormNew); ok++; console.log('OK: 7-machine form location'); }
else { console.log('FAIL: 7-machine form location'); }

// === 7b. Machine form: update amount display label 35%→30% ===
const machinePctOld = `h+='<div class="svc-form-row"><div class="svc-fld"><label>预估补贴金额（购机价格×35%）</label><div id="machineAmountDisplay"`;
const machinePctNew = `h+='<div class="svc-form-row"><div class="svc-fld"><label>预估补贴金额（购机价格×30%，以核定为准）</label><div id="machineAmountDisplay"`;
if (s.includes(machinePctOld)) { s = s.replace(machinePctOld, machinePctNew); ok++; console.log('OK: 7b-machine pct'); }
else { console.log('FAIL: 7b-machine pct'); }

// === 8. Update calcMachineAmount: 0.35→0.30 ===
const calcMachineOld = `function calcMachineAmount(){
  const price=parseFloat(document.getElementById('machinePrice')?.value)||0
  const display=document.getElementById('machineAmountDisplay')
  if(display)display.textContent='¥'+Math.round(price*0.35).toLocaleString('zh-CN')
}`;
const calcMachineNew = `function calcMachineAmount(){
  const price=parseFloat(document.getElementById('machinePrice')?.value)||0
  const display=document.getElementById('machineAmountDisplay')
  if(display)display.textContent='¥'+Math.round(price*0.30).toLocaleString('zh-CN')+'（参考，以核定为准）'
}`;
if (s.includes(calcMachineOld)) { s = s.replace(calcMachineOld, calcMachineNew); ok++; console.log('OK: 8-calcMachine'); }
else { console.log('FAIL: 8-calcMachine'); }

// === 9. Update submitMachineSubsidy: 0.35→0.30 ===
const submitMachineOld2 = `  subsidy.push({id,appNo,name:'王友德',type:'农机购置补贴',amount:Math.round(price*0.35),status:'审核中'`;
const submitMachineNew2 = `  subsidy.push({id,appNo,name:'王友德',type:'农机购置补贴',amount:Math.round(price*0.30),status:'审核中'`;
if (s.includes(submitMachineOld2)) { s = s.replace(submitMachineOld2, submitMachineNew2); ok++; console.log('OK: 9-submitMachine amount'); }
else { console.log('FAIL: 9-submitMachine amount'); }

// === 10. Update showDibaoForm — 分档差额, ¥300→分档, location ===
const dibaoFormOld = `function showDibaoForm(){
  let h='<div class="mod-desc" style="display:flex;align-items:center;gap:6px"><span style="font-size:16px">👤</span><span style="color:#6F91A8;font-size:11px">本人信息 — 以下字段从当前登录账户自动带出，无需手动填写</span></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>姓名</label><input class="svc-self-field" value="王友德" readonly></div><div class="svc-fld"><label>身份证号</label><input class="svc-self-field" value="342***15**07" readonly></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>户籍所在地</label><input class="svc-self-field" value="刘圩村" readonly></div><div class="svc-fld"><label>联系电话</label><input class="svc-self-field" value="138****5432" readonly></div></div>'`;
const dibaoFormNew = `function showDibaoForm(){
  let h='<div class="mod-desc" style="display:flex;align-items:center;gap:6px"><span style="font-size:16px">👤</span><span style="color:#6F91A8;font-size:11px">本人信息 — 以下字段从当前登录账户自动带出，无需手动填写</span></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>姓名</label><input class="svc-self-field" value="王友德" readonly></div><div class="svc-fld"><label>身份证号</label><input class="svc-self-field" value="342***15**07" readonly></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>户籍所在地</label><input class="svc-self-field" value="中堰村" readonly></div><div class="svc-fld"><label>联系电话</label><input class="svc-self-field" value="138****5432" readonly></div></div>'`;
if (s.includes(dibaoFormOld)) { s = s.replace(dibaoFormOld, dibaoFormNew); ok++; console.log('OK: 10-dibao form location'); }
else { console.log('FAIL: 10-dibao form location'); }

// === 10b. Dibao: update amount labels ¥300→分档差额 ===
const dibaoAmountOld = `h+='<div class="svc-form-row"><div class="svc-fld" style="flex:1"><label>预估补助金额（¥300/人/月）</label><div id="dibaoAmountDisplay"`;
const dibaoAmountNew = `h+='<div class="svc-form-row"><div class="svc-fld" style="flex:1"><label>参考补助金额（分档差额，以民政核定为准）</label><div id="dibaoAmountDisplay"`;
if (s.includes(dibaoAmountOld)) { s = s.replace(dibaoAmountOld, dibaoAmountNew); ok++; console.log('OK: 10b-dibao amount label'); }
else { console.log('FAIL: 10b-dibao amount label'); }

// === 10c. Dibao per capita label update ===
const dibaoPerOld = `h+='<div class="svc-form-row"><div class="svc-fld" style="flex:1"><label>人均月收入</label><div id="dibaoPerCapita" style="background:rgba(40,199,250,0.05);border:1px solid rgba(40,199,250,0.15);border-radius:6px;padding:10px 12px;font-size:18px;color:#28C76F;font-weight:700;text-align:center">¥0.00</div></div></div>'`;
const dibaoPerNew = `h+='<div class="svc-form-row"><div class="svc-fld" style="flex:1"><label>人均月收入</label><div id="dibaoPerCapita" style="background:rgba(40,199,250,0.05);border:1px solid rgba(40,199,250,0.15);border-radius:6px;padding:10px 12px;font-size:18px;color:#28C76F;font-weight:700;text-align:center">¥0.00</div></div><div style="font-size:10px;color:#f59e0b;margin-top:4px">⚠ 陕南农村低保标准 ≥472元/人·月（5664元/年），实行分档差额补助</div></div>'`;
if (s.includes(dibaoPerOld)) { s = s.replace(dibaoPerOld, dibaoPerNew); ok++; console.log('OK: 10c-dibao per capita note'); }
else { console.log('FAIL: 10c-dibao per capita note'); }

// === 11. Update calcDibaoIncome: ¥300→use average reference ===
const calcDibaoOld = `function calcDibaoIncome(){
  const pop=parseInt(document.getElementById('dibaoPop')?.value)||0
  const income=parseFloat(document.getElementById('dibaoIncome')?.value)||0
  const perCap=pop>0?Math.round(income/pop):0
  const perCapEl=document.getElementById('dibaoPerCapita')
  if(perCapEl)perCapEl.textContent='¥'+perCap.toLocaleString('zh-CN')
  const amountEl=document.getElementById('dibaoAmountDisplay')
  if(amountEl)amountEl.textContent='¥'+(pop*300).toLocaleString('zh-CN')
}`;
const calcDibaoNew = `function calcDibaoIncome(){
  const pop=parseInt(document.getElementById('dibaoPop')?.value)||0
  const income=parseFloat(document.getElementById('dibaoIncome')?.value)||0
  const perCap=pop>0?Math.round(income/pop):0
  const perCapEl=document.getElementById('dibaoPerCapita')
  if(perCapEl)perCapEl.textContent='¥'+perCap.toLocaleString('zh-CN')+(perCap>0&&perCap<472?'（低于保障线）':'')
  const amountEl=document.getElementById('dibaoAmountDisplay')
  if(amountEl)amountEl.textContent='以民政部门分档核定为准（参考：一档最高约¥480/人·月）'
}`;
if (s.includes(calcDibaoOld)) { s = s.replace(calcDibaoOld, calcDibaoNew); ok++; console.log('OK: 11-calcDibao'); }
else { console.log('FAIL: 11-calcDibao'); }

// === 12. Update submitDibao: income threshold 600→472, amount calc ===
const submitDibaoOld2 = `  if(perCap>=600){toast('经核算，家庭人均月收入 ¥'+perCap.toLocaleString()+' ≥ ¥600，不符合低保申请条件','err');return}`;
const submitDibaoNew2 = `  if(perCap>=472){toast('经核算，家庭人均月收入 ¥'+perCap.toLocaleString()+' ≥ ¥472（陕南保障线），暂不符合低保申请条件','err');return}`;
if (s.includes(submitDibaoOld2)) { s = s.replace(submitDibaoOld2, submitDibaoNew2); ok++; console.log('OK: 12-submitDibao threshold'); }
else { console.log('FAIL: 12-submitDibao threshold'); }

const submitDibaoOld3 = `  subsidy.push({id,appNo,name:'王友德',type:'低保补助',amount:pop*300,status:'审核中'`;
const submitDibaoNew3 = `  subsidy.push({id,appNo,name:'王友德',type:'低保补助',amount:pop*355,status:'审核中'`;
if (s.includes(submitDibaoOld3)) { s = s.replace(submitDibaoOld3, submitDibaoNew3); ok++; console.log('OK: 12b-submitDibao amount'); }
else { console.log('FAIL: 12b-submitDibao amount'); }

// === 13. Update showBizSubsidyForm — ¥8,000→¥10,000, 6个月→1年, location ===
const bizFormOld = `function showBizSubsidyForm(){
  let h='<div class="mod-desc" style="display:flex;align-items:center;gap:6px"><span style="font-size:16px">👤</span><span style="color:#6F91A8;font-size:11px">本人信息 — 以下字段从当前登录账户自动带出，无需手动填写</span></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>姓名</label><input class="svc-self-field" value="王友德" readonly></div><div class="svc-fld"><label>身份证号</label><input class="svc-self-field" value="342***15**07" readonly></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>户籍所在地</label><input class="svc-self-field" value="刘圩村" readonly></div><div class="svc-fld"><label>联系电话</label><input class="svc-self-field" value="138****5432" readonly></div></div>'`;
const bizFormNew = `function showBizSubsidyForm(){
  let h='<div class="mod-desc" style="display:flex;align-items:center;gap:6px"><span style="font-size:16px">👤</span><span style="color:#6F91A8;font-size:11px">本人信息 — 以下字段从当前登录账户自动带出，无需手动填写</span></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>姓名</label><input class="svc-self-field" value="王友德" readonly></div><div class="svc-fld"><label>身份证号</label><input class="svc-self-field" value="342***15**07" readonly></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>户籍所在地</label><input class="svc-self-field" value="中堰村" readonly></div><div class="svc-fld"><label>联系电话</label><input class="svc-self-field" value="138****5432" readonly></div></div>'`;
if (s.includes(bizFormOld)) { s = s.replace(bizFormOld, bizFormNew); ok++; console.log('OK: 13-biz form location'); }
else { console.log('FAIL: 13-biz form location'); }

// === 13b. Biz: ¥8,000→¥10,000 ===
const bizMaxOld = `h+='<div class="svc-form-row"><div class="svc-fld"><label>申请补贴金额（元）<span style="color:#F44">*</span></label><input type="number" id="bizAmount" placeholder="最高¥8,000" min="1" max="8000"><div style="font-size:10px;color:#f59e0b;margin-top:3px">⚠ 最高不超过¥8,000，以实际审批金额为准</div></div>`;
const bizMaxNew = `h+='<div class="svc-form-row"><div class="svc-fld"><label>申请补贴金额（元）<span style="color:#F44">*</span></label><input type="number" id="bizAmount" placeholder="¥10,000" min="1" max="10000"><div style="font-size:10px;color:#f59e0b;margin-top:3px">⚠ 陕西省一次性创业补贴标准为¥10,000，以人社部门审批为准</div></div>`;
if (s.includes(bizMaxOld)) { s = s.replace(bizMaxOld, bizMaxNew); ok++; console.log('OK: 13b-biz max'); }
else { console.log('FAIL: 13b-biz max'); }

// === 14. Update submitBizSubsidy: 8000→10000 ===
const submitBizOld2 = `  if(bizAmount>8000){toast('申请金额最高不超过¥8,000','err');return}`;
const submitBizNew2 = `  if(bizAmount>10000){toast('申请金额最高不超过¥10,000','err');return}`;
if (s.includes(submitBizOld2)) { s = s.replace(submitBizOld2, submitBizNew2); ok++; console.log('OK: 14-submitBiz max'); }
else { console.log('FAIL: 14-submitBiz max'); }

const submitBizOld3 = `  subsidy.push({id,appNo,name:'王友德',type:'创业补贴',amount:Math.min(bizAmount,8000),status:'审核中'`;
const submitBizNew3 = `  subsidy.push({id,appNo,name:'王友德',type:'创业补贴',amount:Math.min(bizAmount,10000),status:'审核中'`;
if (s.includes(submitBizOld3)) { s = s.replace(submitBizOld3, submitBizNew3); ok++; console.log('OK: 14b-submitBiz amount'); }
else { console.log('FAIL: 14b-submitBiz amount'); }

// === 15. Update policy content — showPolicyQuery ===
const polQueryOld = `function showPolicyQuery(){
  const policies=[
    {type:'耕地地力保护补贴',target:'拥有耕地承包权的种地农民',condition:'承包耕地面积≥1亩且未撂荒',standard:'¥120/亩/年',materials:'身份证、土地承包经营权证、耕地地力保护补贴申请表',process:'农户申报 → 村级公示 → 乡镇审核 → 县级复核 → 发放',basis:'《农业生产发展资金管理办法》《耕地地力保护补贴实施方案》'},
    {type:'农机购置补贴',target:'从事农业生产的个人和经营组织',condition:'新购纳入补贴目录的农机具',standard:'购机价格的30%-35%',materials:'身份证、购机发票、机具合格证、农机购置补贴申请表、人机合影',process:'购机 → 申报 → 乡镇审核 → 县级复核 → 公示 → 发放',basis:'《农业机械购置补贴专项资金管理办法》'},
    {type:'低保补助',target:'家庭人均收入低于当地低保标准的困难群众',condition:'家庭人均月收入低于¥600',standard:'¥300/人/月（差额补助）',materials:'身份证、户口本、收入证明、财产状况证明、低保申请表',process:'个人申请 → 村级评议 → 乡镇审核 → 县级审批 → 公示 → 发放',basis:'《社会救助暂行办法》《最低生活保障审核确认办法》'},
    {type:'创业补贴',target:'首次创业的农村转移就业劳动者',condition:'首次创办小微企业或从事个体经营且正常经营6个月以上',standard:'最高¥8,000（一次性）',materials:'身份证、营业执照、创业计划书、经营场所证明、创业补贴申请表',process:'个人申请 → 乡镇初审 → 人社部门审核 → 公示 → 发放',basis:'《就业补助资金管理办法》《关于进一步做好农民工创业补贴工作的通知》'}
  ]`;
const polQueryNew = `function showPolicyQuery(){
  const policies=[
    {type:'耕地地力保护补贴',target:'拥有耕地承包权且实际耕种的农户',condition:'确权耕地面积且未撂荒、非"非粮化"',standard:'关中≥70 陕南≥60 陕北≥50元/亩·年',materials:'身份证、土地承包经营权证（或确权证明）、补贴申请表',process:'农户申报 → 村级公示 → 乡镇审核 → 县级核定 → 惠民"一卡通"发放',basis:'陕农计财〔2025〕8号《陕西省耕地地力保护补贴实施方案》'},
    {type:'农机购置补贴',target:'从事农业生产的个人和经营组织',condition:'新购纳入陕西省补贴目录的农机具',standard:'购机价≤30%（优机优补≤35%）',materials:'身份证、购机发票、机具合格证、农机购置补贴申请表、人机合影',process:'自主购机 → 县级申请 → 审核公示 → 直补到卡',basis:'陕农发〔2024〕63号《2024-2026年陕西省农机购置与应用补贴实施方案》'},
    {type:'低保补助',target:'家庭人均收入低于当地低保标准的困难群众',condition:'家庭人均月收入低于当地保障线',standard:'分档差额补助（陕南参考：≥472元/人·月）',materials:'身份证、户口本、收入证明、财产状况证明、低保申请表',process:'个人申请 → 村级评议 → 乡镇审核 → 县级民政审批 → 公示 → 发放',basis:'《陕西省最低生活保障工作规程》（2025年10月起提标4.88%）'},
    {type:'创业补贴',target:'返乡入乡农民工首次创业',condition:'首次创办小微企业或个体经营且正常运营满1年',standard:'¥10,000（一次性）',materials:'身份证、营业执照、经营场所证明、创业补贴申请表',process:'个人申请 → 县级人社部门审核 → 公示 → 发放至社保卡',basis:'陕财办社〔2025〕81号《陕西省就业补助资金管理实施办法》'}
  ]`;
if (s.includes(polQueryOld)) { s = s.replace(polQueryOld, polQueryNew); ok++; console.log('OK: 15-policy query'); }
else { console.log('FAIL: 15-policy query'); }

// === 16. Update policy detail (showPolicyDetail) ===
const polDetailOld = `function showPolicyDetail(idx){
  const policies=[
    {type:'耕地地力保护补贴',target:'拥有耕地承包权的种地农民',condition:'承包耕地面积≥1亩且未撂荒',standard:'¥120/亩/年',materials:'身份证、土地承包经营权证、耕地地力保护补贴申请表',process:'农户申报 → 村级公示 → 乡镇审核 → 县级复核 → 发放',basis:'《农业生产发展资金管理办法》《耕地地力保护补贴实施方案》'},
    {type:'农机购置补贴',target:'从事农业生产的个人和经营组织',condition:'新购纳入补贴目录的农机具',standard:'购机价格的30%-35%',materials:'身份证、购机发票、机具合格证、农机购置补贴申请表、人机合影',process:'购机 → 申报 → 乡镇审核 → 县级复核 → 公示 → 发放',basis:'《农业机械购置补贴专项资金管理办法》'},
    {type:'低保补助',target:'家庭人均收入低于当地低保标准的困难群众',condition:'家庭人均月收入低于¥600',standard:'¥300/人/月（差额补助）',materials:'身份证、户口本、收入证明、财产状况证明、低保申请表',process:'个人申请 → 村级评议 → 乡镇审核 → 县级审批 → 公示 → 发放',basis:'《社会救助暂行办法》《最低生活保障审核确认办法》'},
    {type:'创业补贴',target:'首次创业的农村转移就业劳动者',condition:'首次创办小微企业或从事个体经营且正常经营6个月以上',standard:'最高¥8,000（一次性）',materials:'身份证、营业执照、创业计划书、经营场所证明、创业补贴申请表',process:'个人申请 → 乡镇初审 → 人社部门审核 → 公示 → 发放',basis:'《就业补助资金管理办法》《关于进一步做好农民工创业补贴工作的通知》'}
  ]`;
const polDetailNew = `function showPolicyDetail(idx){
  const policies=[
    {type:'耕地地力保护补贴',target:'拥有耕地承包权且实际耕种的农户',condition:'确权耕地面积且未撂荒、非"非粮化"',standard:'关中≥70 陕南≥60 陕北≥50元/亩·年',materials:'身份证、土地承包经营权证（或确权证明）、补贴申请表',process:'农户申报 → 村级公示 → 乡镇审核 → 县级核定 → 惠民"一卡通"发放',basis:'陕农计财〔2025〕8号《陕西省耕地地力保护补贴实施方案》'},
    {type:'农机购置补贴',target:'从事农业生产的个人和经营组织',condition:'新购纳入陕西省补贴目录的农机具',standard:'购机价≤30%（优机优补≤35%）',materials:'身份证、购机发票、机具合格证、农机购置补贴申请表、人机合影',process:'自主购机 → 县级申请 → 审核公示 → 直补到卡',basis:'陕农发〔2024〕63号《2024-2026年陕西省农机购置与应用补贴实施方案》'},
    {type:'低保补助',target:'家庭人均收入低于当地低保标准的困难群众',condition:'家庭人均月收入低于当地保障线',standard:'分档差额补助（陕南参考：≥472元/人·月）',materials:'身份证、户口本、收入证明、财产状况证明、低保申请表',process:'个人申请 → 村级评议 → 乡镇审核 → 县级民政审批 → 公示 → 发放',basis:'《陕西省最低生活保障工作规程》（2025年10月起提标4.88%）'},
    {type:'创业补贴',target:'返乡入乡农民工首次创业',condition:'首次创办小微企业或个体经营且正常运营满1年',standard:'¥10,000（一次性）',materials:'身份证、营业执照、经营场所证明、创业补贴申请表',process:'个人申请 → 县级人社部门审核 → 公示 → 发放至社保卡',basis:'陕财办社〔2025〕81号《陕西省就业补助资金管理实施办法》'}
  ]`;
if (s.includes(polDetailOld)) { s = s.replace(polDetailOld, polDetailNew); ok++; console.log('OK: 16-policy detail'); }
else { console.log('FAIL: 16-policy detail'); }

// === 17. Update material download list ===
const matDlOld = `function showMaterialDownload(){
  const items=[
    {type:'耕地地力保护补贴',files:[
      {name:'耕地地力保护补贴申请表',fmt:'DOCX'},
      {name:'耕地承包权承诺书',fmt:'DOCX'},
      {name:'耕地地力保护补贴材料清单',fmt:'PDF'}
    ]},
    {type:'农机购置补贴',files:[
      {name:'农机购置补贴申请表',fmt:'DOCX'},
      {name:'农机购置承诺书',fmt:'DOCX'},
      {name:'农机购置补贴材料清单',fmt:'PDF'}
    ]},
    {type:'低保补助',files:[
      {name:'最低生活保障申请表',fmt:'DOCX'},
      {name:'家庭经济状况申报表',fmt:'DOCX'},
      {name:'低保申请材料清单',fmt:'PDF'}
    ]},
    {type:'创业补贴',files:[
      {name:'创业补贴申请表',fmt:'DOCX'},
      {name:'创业计划书模板',fmt:'DOCX'},
      {name:'创业补贴材料清单',fmt:'PDF'}
    ]}
  ]`;
const matDlNew = `function showMaterialDownload(){
  const items=[
    {type:'耕地地力保护补贴',files:[
      {name:'耕地地力保护补贴申请表（陕南版）',fmt:'DOCX'},
      {name:'耕地承包权确权证明模板',fmt:'DOCX'},
      {name:'陕西省耕地地力保护补贴申请指南',fmt:'PDF'}
    ]},
    {type:'农机购置补贴',files:[
      {name:'陕西省农机购置补贴申请表',fmt:'DOCX'},
      {name:'农机购置承诺书',fmt:'DOCX'},
      {name:'2024-2026年陕西省农机补贴一览表',fmt:'PDF'}
    ]},
    {type:'低保补助',files:[
      {name:'陕西省最低生活保障申请表',fmt:'DOCX'},
      {name:'家庭经济状况申报表',fmt:'DOCX'},
      {name:'陕西省低保申请须知',fmt:'PDF'}
    ]},
    {type:'创业补贴',files:[
      {name:'陕西省一次性创业补贴申请表',fmt:'DOCX'},
      {name:'创业计划书参考模板',fmt:'DOCX'},
      {name:'陕西省创业补贴申请指南',fmt:'PDF'}
    ]}
  ]`;
if (s.includes(matDlOld)) { s = s.replace(matDlOld, matDlNew); ok++; console.log('OK: 17-material download'); }
else { console.log('FAIL: 17-material download'); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== FINAL ===');
console.log('Changes:', ok, 'Length:', s.length);
