// Subsidy rewrite part 2 — steps 4-14
const fs = require('fs');
const path = require('path');
const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0;

function replaceFunc(funcName, newCode) {
  const start = s.indexOf('function ' + funcName + '(');
  if (start === -1) { console.log('NOT FOUND:', funcName); return false; }
  let depth = 0, end = start;
  for (let i = start; i < s.length; i++) {
    if (s[i] === '{') depth++;
    if (s[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  s = s.substring(0, start) + newCode + '\n' + s.substring(end + 1);
  ok++; console.log('OK:', funcName); return true;
}

function deleteFunc(funcName) {
  const start = s.indexOf('function ' + funcName + '(');
  if (start === -1) { console.log('SKIP delete:', funcName); return; }
  let depth = 0, end = start;
  for (let i = start; i < s.length; i++) {
    if (s[i] === '{') depth++;
    if (s[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  s = s.substring(0, start) + s.substring(end + 1);
  ok++; console.log('DEL:', funcName);
}

// STEP 4: Replace applySubsidy + delete confirmApply
// Read them from external files for cleaner escaping
const newForms = fs.readFileSync(path.resolve(__dirname, 'subsidy-forms.txt'), 'utf-8');
replaceFunc('applySubsidy', newForms);
deleteFunc('confirmApply');

// STEP 5: Replace showSubsidyApply
const newShowApply = `function showSubsidyApply(){
  let h='<div class="mod-desc">选择您要申请的补贴类型，进入对应申请表单</div>'
  const items=[
    {name:'耕地地力保护补贴',desc:'拥有耕地承包权的农户',amount:'¥120/亩',icon:'\\u{1F33E}',fn:'window._svc.showLandSubsidyForm()'},
    {name:'农机购置补贴',desc:'新购农机具补贴',amount:'购机价35%',icon:'\\u{1F69C}',fn:'window._svc.showMachineSubsidyForm()'},
    {name:'低保补助',desc:'家庭人均收入低于标准',amount:'¥300/月',icon:'💳',fn:'window._svc.showDibaoForm()'},
    {name:'创业补贴',desc:'首次创业6个月内',amount:'最高¥8,000',icon:'\\u{1F3EA}',fn:'window._svc.showBizSubsidyForm()'}
  ]
  items.forEach(s=>{
    h+='<div class="svc-sub-list-item" onclick="'+s.fn+'"><div class="svc-sub-list-icon">'+s.icon+'</div><div class="svc-sub-list-info"><div class="svc-sub-list-name">'+s.name+'</div><div class="svc-sub-list-desc">'+s.desc+'</div></div><div class="svc-sub-list-amount">'+s.amount+'</div><div style="color:#28C7FA;margin-left:8px;flex-shrink:0">申请 ▶</div></div>'
  })
  opMod('\\u{1F4DD} 申请补贴',h,'mod-md')
}`;
replaceFunc('showSubsidyApply', newShowApply);

// STEP 6: Replace showSubsidyProgress
const newProgress = `function showSubsidyProgress(){
  if(subsidy.length===0){opMod('\\u{1F50D} 补贴进度查询','<div style="color:#6F91A8;text-align:center;padding:30px 0">暂无申请记录</div>','mod-sm');return}
  let h=''
  subsidy.forEach(r=>{
    h+='<div class="svc-progress-card">'
    h+='<div class="svc-progress-header"><div><span style="color:#fff;font-weight:600;font-size:13px">'+r.type+'</span><span style="color:#6F91A8;font-size:10px;margin-left:8px">'+r.appNo+'</span></div><span class="tag '+(r.status==='已发放'?'g':r.status==='审核中'?'y':'b')+'">'+r.status+'</span></div>'
    h+='<div class="svc-progress-meta">申请日期：'+r.date+' | 金额：<b style="color:#28C76F">&yen;'+Number(r.amount).toLocaleString()+'</b> | 当前节点：<b style="color:#28C7FA">'+r.node+'</b></div>'
    h+='<div class="svc-node-chain">'
    r.nodes.forEach((n,i)=>{
      const done=i<=r.currentNodeIdx
      const active=i===r.currentNodeIdx
      h+='<div class="svc-node-item '+(done?'done':'')+' '+(active?'active':'')+'">'
      h+='<div class="svc-node-dot">'+(done?'✓':(i+1))+'</div>'
      h+='<div class="svc-node-label">'+n+'</div>'
      if(i<r.nodes.length-1) h+='<div class="svc-node-line '+(i<r.currentNodeIdx?'done':'')+'"></div>'
      h+='</div>'
    })
    h+='</div></div>'
  })
  opMod('\\u{1F50D} 补贴进度查询',h,'mod-lg')
}`;
replaceFunc('showSubsidyProgress', newProgress);

// STEP 7: Replace downloadPolicy
const newPolicy = `function showPolicyQuery(){
  const policies=[
    {type:'耕地地力保护补贴',target:'拥有耕地承包权的种地农民',condition:'承包耕地面积≥1亩且未撂荒',standard:'¥120/亩/年',materials:'身份证、土地承包经营权证、耕地地力保护补贴申请表',process:'农户申报 → 村级公示 → 乡镇审核 → 县级复核 → 发放',basis:'《农业生产发展资金管理办法》《耕地地力保护补贴实施方案》'},
    {type:'农机购置补贴',target:'从事农业生产的个人和经营组织',condition:'新购纳入补贴目录的农机具',standard:'购机价格的30%-35%',materials:'身份证、购机发票、机具合格证、农机购置补贴申请表、人机合影',process:'购机 → 申报 → 乡镇审核 → 县级复核 → 公示 → 发放',basis:'《农业机械购置补贴专项资金管理办法》'},
    {type:'低保补助',target:'家庭人均收入低于当地低保标准的困难群众',condition:'家庭人均月收入低于¥600',standard:'¥300/人/月（差额补助）',materials:'身份证、户口本、收入证明、财产状况证明、低保申请表',process:'个人申请 → 村级评议 → 乡镇审核 → 县级审批 → 公示 → 发放',basis:'《社会救助暂行办法》《最低生活保障审核确认办法》'},
    {type:'创业补贴',target:'首次创业的农村转移就业劳动者',condition:'首次创办小微企业或从事个体经营且正常经营6个月以上',standard:'最高¥8,000（一次性）',materials:'身份证、营业执照、创业计划书、经营场所证明、创业补贴申请表',process:'个人申请 → 乡镇初审 → 人社部门审核 → 公示 → 发放',basis:'《就业补助资金管理办法》《关于进一步做好农民工创业补贴工作的通知》'}
  ]
  let h='<div class="mod-desc">惠农补贴政策查询，点击政策类型查看详情，或下载完整政策文件</div>'
  policies.forEach((p,i)=>{
    h+='<div class="svc-policy-item" onclick="window._svc.showPolicyDetail('+i+')"><div class="svc-policy-item-header"><span style="color:#fff;font-weight:600;font-size:13px">'+p.type+'</span><span style="color:#6F91A8;font-size:10px">'+p.standard+'</span></div><div style="font-size:11px;color:#50738A;margin-top:3px">适用对象：'+p.target+'</div><div style="color:#28C7FA;font-size:10px;margin-top:4px">点击查看详情 ▶</div></div>'
  })
  h+='<div style="text-align:center;margin-top:16px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.downloadPolicyFile()" style="flex:none;width:auto">\\u{1F4E5} 下载完整政策文件（PDF）</button></div>'
  opMod('\\u{1F4DC} 惠农补贴政策',h,'mod-lg')
}
function showPolicyDetail(idx){
  const policies=[
    {type:'耕地地力保护补贴',target:'拥有耕地承包权的种地农民',condition:'承包耕地面积≥1亩且未撂荒',standard:'¥120/亩/年',materials:'身份证、土地承包经营权证、耕地地力保护补贴申请表',process:'农户申报 → 村级公示 → 乡镇审核 → 县级复核 → 发放',basis:'《农业生产发展资金管理办法》《耕地地力保护补贴实施方案》'},
    {type:'农机购置补贴',target:'从事农业生产的个人和经营组织',condition:'新购纳入补贴目录的农机具',standard:'购机价格的30%-35%',materials:'身份证、购机发票、机具合格证、农机购置补贴申请表、人机合影',process:'购机 → 申报 → 乡镇审核 → 县级复核 → 公示 → 发放',basis:'《农业机械购置补贴专项资金管理办法》'},
    {type:'低保补助',target:'家庭人均收入低于当地低保标准的困难群众',condition:'家庭人均月收入低于¥600',standard:'¥300/人/月（差额补助）',materials:'身份证、户口本、收入证明、财产状况证明、低保申请表',process:'个人申请 → 村级评议 → 乡镇审核 → 县级审批 → 公示 → 发放',basis:'《社会救助暂行办法》《最低生活保障审核确认办法》'},
    {type:'创业补贴',target:'首次创业的农村转移就业劳动者',condition:'首次创办小微企业或从事个体经营且正常经营6个月以上',standard:'最高¥8,000（一次性）',materials:'身份证、营业执照、创业计划书、经营场所证明、创业补贴申请表',process:'个人申请 → 乡镇初审 → 人社部门审核 → 公示 → 发放',basis:'《就业补助资金管理办法》《关于进一步做好农民工创业补贴工作的通知》'}
  ]
  const p=policies[idx];if(!p)return
  let h='<div class="svc-policy-detail">'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">补贴类型</span><span class="svc-rc-value">'+p.type+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">适用对象</span><span class="svc-rc-value">'+p.target+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">申请条件</span><span class="svc-rc-value">'+p.condition+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">补贴标准</span><span class="svc-rc-value" style="color:#28C76F;font-weight:600">'+p.standard+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">所需材料</span><span class="svc-rc-value">'+p.materials+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">办理流程</span><span class="svc-rc-value">'+p.process+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">政策依据</span><span class="svc-rc-value">'+p.basis+'</span></div>'
  h+='</div>'
  h+='<div style="text-align:center;margin-top:16px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.downloadPolicyFile()" style="flex:none;width:auto">\\u{1F4E5} 下载该政策文件（PDF）</button></div>'
  opMod('\\u{1F4DC} '+p.type+' — 政策详情',h,'mod-md')
}
function downloadPolicyFile(){
  toast('政策文件（PDF）已开始下载','ok')
}`;
replaceFunc('downloadPolicy', newPolicy);

// STEP 8: downloadTemplate → showMaterialDownload (may already be done)
if (s.includes('function downloadTemplate(')) {
  const dtmpl = `function showMaterialDownload(){
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
  ]
  let h='<div class="mod-desc">按补贴项目下载申请材料模板（DOCX/PDF 格式）</div>'
  items.forEach(item=>{
    h+='<div class="svc-dl-group"><div class="svc-dl-group-title">'+item.type+'</div>'
    item.files.forEach(f=>{
      h+='<div class="svc-dl-item"><div><span style="color:#D0E4F5;font-size:12px">\\u{1F4C4} '+f.name+'</span><span class="svc-dl-fmt">'+f.fmt+'</span></div><button class="svc-btn svc-btn-secondary" style="flex:none;width:auto;height:32px;padding:0 14px;font-size:11px" onclick="window._svc.downloadMaterial(\\''+f.name+'.'+f.fmt.toLowerCase()+'\\')">⬇ 下载</button></div>'
    })
    h+='</div>'
  })
  opMod('\\u{1F4E5} 材料模板下载',h,'mod-lg')
}
function downloadMaterial(filename){
  toast('正在下载：'+filename,'ok')
}`;
  replaceFunc('downloadTemplate', dtmpl);
} else {
  console.log('SKIP: 8 (downloadTemplate already replaced)');
}

// STEP 9: Add detail/withdraw/supplement functions before // Watch tab changes
const watchMarker = '// Watch tab changes';
if (s.includes(watchMarker)) {
  const newDetails = `
// ===== DETAIL FUNCTIONS =====

function showSubsidyDetail(r){
  let h='<div class="svc-result-card">'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">申请编号</span><span class="svc-rc-value" style="font-family:monospace">'+r.appNo+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">补贴类型</span><span class="svc-rc-value">'+r.type+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">申请日期</span><span class="svc-rc-value">'+r.date+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">申请金额</span><span class="svc-rc-value" style="color:#28C76F;font-weight:600">&yen;'+Number(r.amount).toLocaleString()+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">当前状态</span><span class="svc-rc-value">'+r.status+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">当前节点</span><span class="svc-rc-value" style="color:#28C7FA">'+r.node+'</span></div>'
  h+='</div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="mod-section-title">\\u{1F4CB} 审批进度</div>'
  h+='<div class="svc-node-chain" style="flex-wrap:wrap">'
  r.nodes.forEach((n,i)=>{
    const done=i<=r.currentNodeIdx
    const active=i===r.currentNodeIdx
    h+='<div class="svc-node-item '+(done?'done':'')+' '+(active?'active':'')+'">'
    h+='<div class="svc-node-dot">'+(done?'✓':(i+1))+'</div>'
    h+='<div class="svc-node-label">'+n+'</div>'
    if(i<r.nodes.length-1) h+='<div class="svc-node-line '+(i<r.currentNodeIdx?'done':'')+'"></div>'
    h+='</div>'
  })
  h+='</div>'
  opMod('\\u{1F4CB} 申请详情 — '+r.type,h,'mod-md')
}
function withdrawSubsidy(r){
  if(confirm('确认撤回申请 '+r.appNo+'？')){const idx=subsidy.findIndex(s=>s.id===r.id);if(idx!==-1)subsidy.splice(idx,1);toast('申请已撤回','ok');clsMod()}
}
function supplementSubsidy(r){
  toast('材料补充功能已打开，请上传补充材料\\n申请编号：'+r.appNo,'info')
}
`;
  // Insert before // Watch tab changes
  const idx = s.indexOf(watchMarker);
  // Find the start of the line
  const lineStart = s.lastIndexOf('\n', idx);
  s = s.substring(0, lineStart + 1) + newDetails + '\n' + s.substring(lineStart + 1);
  ok++; console.log('OK: 9-details/withdraw/supplement');
} else { console.log('FAIL: 9 (Watch tab changes not found)'); }

// STEP 10: Update pie chart
const chartStart = s.indexOf('function initSubPieChart(){');
if (chartStart !== -1) {
  let depth = 0, chartEnd = chartStart;
  for (let i = chartStart; i < s.length; i++) {
    if (s[i] === '{') depth++;
    if (s[i] === '}') { depth--; if (depth === 0) { chartEnd = i; break; } }
  }
  const newChart = `function initSubPieChart(){
  const el=document.getElementById('chart_sub_pie');if(!el)return;chartInstance=echarts.init(el)
  const total=subsidy.reduce((s,r)=>s+Number(r.amount),0)
  const data=[
    {value:subsidy.find(s=>s.type.includes('耕地'))?.amount||0,name:'耕地补贴',itemStyle:{color:'#28C7FA'}},
    {value:subsidy.find(s=>s.type.includes('农机'))?.amount||0,name:'农机补贴',itemStyle:{color:'#39D98A'}},
    {value:subsidy.find(s=>s.type.includes('低保'))?.amount||0,name:'低保补助',itemStyle:{color:'#f59e0b'}},
    {value:subsidy.find(s=>s.type.includes('创业'))?.amount||0,name:'创业补贴',itemStyle:{color:'#a78bfa'}}
  ].filter(d=>d.value>0)
  chartInstance.setOption({
    title:{text:'补贴构成',textStyle:{color:'#6b7a8d',fontSize:11,fontWeight:400},left:0,top:-6},
    tooltip:{trigger:'item',backgroundColor:'rgba(7,27,45,0.95)',borderColor:'rgba(14,165,233,0.30)',textStyle:{color:'#D0E4F5',fontSize:11},formatter:'{b}: ¥{c} ({d}%)'},
    legend:{orient:'vertical',right:10,top:'middle',textStyle:{color:'#6F91A8',fontSize:10},itemWidth:10,itemHeight:10,itemGap:12},
    series:[
      {type:'pie',radius:['55%','72%'],center:['35%','50%'],itemStyle:{borderColor:'rgba(8,28,58,0.92)',borderWidth:2},label:{show:false},emphasis:{label:{show:true,fontSize:14,fontWeight:'bold'}},data:data},
      {type:'pie',radius:['0%','0%'],center:['35%','50%'],label:{show:true,position:'center',formatter:'累计获得\\n¥{c}',fontSize:12,color:'#D0E4F5',lineHeight:18},data:[{value:total,name:''}]}
    ]
  })
}`;
  s = s.substring(0, chartStart) + newChart + '\n' + s.substring(chartEnd + 1);
  ok++; console.log('OK: 10-chart');
} else { console.log('FAIL: 10 (chart not found)'); }

// STEP 11: Chart block height
const chartBlock = `<div class="chart-block" v-if="curTab==='subsidy'"><div id="chart_sub_pie" style="width:100%;height:200px"></div></div>`;
if (s.includes(chartBlock)) {
  s = s.replace(chartBlock, `<div class="chart-block chart-block-sm" v-if="curTab==='subsidy'"><div id="chart_sub_pie" style="width:100%;height:180px"></div></div>`);
  ok++; console.log('OK: 11-chart height');
} else { console.log('SKIP: 11 (already done or not found)'); }

// STEP 12: Quick actions for subsidy
const qaOld = `if (key === 'subsidy') return [
    { icon:'\\u{1F4DD}', label:'申请补贴', action: showSubsidyApply },
    { icon:'\\u{1F50D}', label:'进度查询', action: showSubsidyProgress },
    { icon:'\\u{1F4DC}', label:'政策查询', action: downloadPolicy },
    { icon:'\\u{1F4E5}', label:'材料下载', action: downloadTemplate }
  ]`;
if (s.includes(qaOld)) {
  const qaNew = `if (key === 'subsidy') return [
    { icon:'\\u{1F4DD}', label:'申请补贴', action: showSubsidyApply },
    { icon:'\\u{1F50D}', label:'进度查询', action: showSubsidyProgress },
    { icon:'\\u{1F4DC}', label:'政策查询', action: showPolicyQuery },
    { icon:'\\u{1F4E5}', label:'材料下载', action: showMaterialDownload }
  ]`;
  s = s.replace(qaOld, qaNew); ok++; console.log('OK: 12-quick actions');
} else { console.log('FAIL: 12 (quick actions not found)'); }

// STEP 13: Update window._svc
const svcOld = `window._svc={clsMod,queryBalance,submitReimburse,confirmReg,sendReport,confirmTelemed,enterRoom,confirmAppt,confirmApply,saveAlert,submitRemote,triggerInvoiceUpload,triggerDiagnosisUpload,filterPayments,applyFromList:(name)=>{clsMod();const s=availableSubsidies.find(x=>x.name===name);if(s)applySubsidy(s)},enrollFromList:(title)=>{clsMod();const c=availableCourses.find(x=>x.title===title);if(c)enrollCourse(c)},toast:(m,t)=>{toast(m,t)}}`;
if (s.includes(svcOld)) {
  const svcNew = `window._svc={clsMod,queryBalance,submitReimburse,confirmReg,sendReport,confirmTelemed,enterRoom,confirmAppt,saveAlert,submitRemote,triggerInvoiceUpload,triggerDiagnosisUpload,filterPayments,showLandSubsidyForm,showMachineSubsidyForm,showDibaoForm,showBizSubsidyForm,calcLandAmount,calcMachineAmount,calcDibaoIncome,submitLandSubsidy,submitMachineSubsidy,submitDibao,submitBizSubsidy,showSubsidyApply,showSubsidyProgress,showPolicyQuery,showMaterialDownload,downloadMaterial,downloadPolicyFile,showPolicyDetail,showSubsidyDetail,withdrawSubsidy,supplementSubsidy,applyFromList:(name)=>{clsMod();if(name==='耕地地力保护补贴')showLandSubsidyForm();else if(name==='农机购置补贴')showMachineSubsidyForm();else if(name==='低保补助')showDibaoForm();else if(name==='创业补贴')showBizSubsidyForm()},enrollFromList:(title)=>{clsMod();const c=availableCourses.find(x=>x.title===title);if(c)enrollCourse(c)},toast:(m,t)=>{toast(m,t)}}`;
  s = s.replace(svcOld, svcNew); ok++; console.log('OK: 13-window._svc');
} else { console.log('FAIL: 13 (window._svc not found)'); }

// STEP 14: Add CSS
const cssMarker = '.svc-modal .svc-uploaded-file { color:#D0E4F5; font-size:11px; }';
const newCss = `
/* Subsidy application list items */
.svc-modal .svc-sub-list-item { display:flex;align-items:center;background:rgba(7,27,45,0.55);border:1px solid rgba(14,165,233,0.10);border-radius:8px;padding:12px 14px;margin-bottom:8px;cursor:pointer;transition:all 0.2s; }
.svc-modal .svc-sub-list-item:hover { background:rgba(14,165,233,0.08);border-color:rgba(14,165,233,0.22); }
.svc-modal .svc-sub-list-icon { font-size:24px;margin-right:12px;flex-shrink:0; }
.svc-modal .svc-sub-list-info { flex:1; }
.svc-modal .svc-sub-list-name { color:#D0E4F5;font-weight:600;font-size:13px; }
.svc-modal .svc-sub-list-desc { color:#50738A;font-size:11px;margin-top:2px; }
.svc-modal .svc-sub-list-amount { color:#28C76F;font-weight:600;font-size:13px;margin-right:4px; }

/* Progress cards */
.svc-modal .svc-progress-card { background:rgba(7,27,45,0.55);border:1px solid rgba(14,165,233,0.10);border-radius:10px;padding:14px 16px;margin-bottom:12px; }
.svc-modal .svc-progress-header { display:flex;justify-content:space-between;align-items:center;margin-bottom:6px; }
.svc-modal .svc-progress-meta { font-size:11px;color:#6F91A8;margin-bottom:12px; }

/* Node chain */
.svc-modal .svc-node-chain { display:flex;align-items:flex-start;gap:0;overflow-x:auto;padding:4px 0; }
.svc-modal .svc-node-item { display:flex;flex-direction:column;align-items:center;position:relative;flex-shrink:0;min-width:48px; }
.svc-modal .svc-node-dot { width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;background:rgba(7,27,45,0.80);border:2px solid rgba(111,145,168,0.30);color:#6F91A8;transition:all 0.3s; }
.svc-modal .svc-node-item.done .svc-node-dot { background:#28C76F;border-color:#28C76F;color:#fff; }
.svc-modal .svc-node-item.active .svc-node-dot { background:#28C7FA;border-color:#28C7FA;color:#fff;box-shadow:0 0 8px rgba(40,199,250,0.40); }
.svc-modal .svc-node-label { font-size:9px;color:#6F91A8;margin-top:4px;text-align:center;white-space:nowrap;max-width:56px;overflow:hidden;text-overflow:ellipsis; }
.svc-modal .svc-node-item.done .svc-node-label,
.svc-modal .svc-node-item.active .svc-node-label { color:#D0E4F5; }
.svc-modal .svc-node-line { width:28px;height:2px;background:rgba(111,145,168,0.20);margin:0 -2px;position:absolute;top:11px;left:calc(50% + 11px); }
.svc-modal .svc-node-line.done { background:#28C76F; }

/* Policy items */
.svc-modal .svc-policy-item { background:rgba(7,27,45,0.55);border:1px solid rgba(14,165,233,0.10);border-radius:8px;padding:10px 14px;margin-bottom:8px;cursor:pointer;transition:all 0.2s; }
.svc-modal .svc-policy-item:hover { background:rgba(14,165,233,0.08);border-color:rgba(14,165,233,0.22); }
.svc-modal .svc-policy-item-header { display:flex;justify-content:space-between;align-items:center; }
.svc-modal .svc-policy-detail { display:flex;flex-direction:column;gap:0; }

/* Download groups */
.svc-modal .svc-dl-group { margin-bottom:14px; }
.svc-modal .svc-dl-group-title { color:#28C7FA;font-weight:600;font-size:12px;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid rgba(14,165,233,0.10); }
.svc-modal .svc-dl-item { display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(14,165,233,0.05); }
.svc-modal .svc-dl-fmt { display:inline-block;background:rgba(40,199,250,0.08);color:#28C7FA;font-size:9px;padding:2px 6px;border-radius:3px;margin-left:6px; }

/* Chart block compact */
.chart-block-sm { padding:14px 20px !important; }
`;
s = s.replace(cssMarker, cssMarker + newCss);
ok++; console.log('OK: 14-CSS');

// Write final result
fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== FINAL ===');
console.log('Changes:', ok, 'Length:', s.length);
