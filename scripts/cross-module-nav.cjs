// Cross-module navigation: governance → service center subsidy
const fs = require('fs');

// ===== SERVICEPAGE.VUE =====
const spFp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/ServicePage.vue';
let sp = fs.readFileSync(spFp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// 1a. Add "节水灌溉设施补贴" to availableSubsidies
const oldSubsidies = `const availableSubsidies = [
  { name: '耕地地力保护补贴', desc: '拥有耕地承包权的种地农户', amount: '≥70元/亩', icon: '\\u{1F33E}' },
  { name: '农机购置补贴', desc: '新购农机具定额补贴', amount: '购机价≤30%', icon: '\\u{1F69C}' },
  { name: '低保补助', desc: '家庭人均收入低于当地标准', amount: '分档差额补助', icon: '\\u{1F4B0}' },
  { name: '创业补贴', desc: '首次创业满1年', amount: '¥10,000', icon: '\\u{1F3EA}' }
]`;

const newSubsidies = `const availableSubsidies = [
  { name: '耕地地力保护补贴', desc: '拥有耕地承包权的种地农户', amount: '≥70元/亩', icon: '\\u{1F33E}' },
  { name: '农机购置补贴', desc: '新购农机具定额补贴', amount: '购机价≤30%', icon: '\\u{1F69C}' },
  { name: '节水灌溉设施补贴', desc: '新建或改造滴灌、喷灌等节水设施', amount: '≤800元/亩', icon: '\\u{1F4A7}' },
  { name: '低保补助', desc: '家庭人均收入低于当地标准', amount: '分档差额补助', icon: '\\u{1F4B0}' },
  { name: '创业补贴', desc: '首次创业满1年', amount: '¥10,000', icon: '\\u{1F3EA}' }
]`;
if (sp.includes(oldSubsidies)) {
  sp = sp.replace(oldSubsidies, newSubsidies);
  check('sp-1a-subsidies', true);
} else { check('sp-1a-subsidies', false); }

// 1b. Add navigateToService function + showWaterSavingForm before the EXPOSE HANDLERS section
const oldExposeSection = `
// ===== EXPOSE HANDLERS =====
onMounted(()=>{`;
const newExposeSection = `
// ===== CROSS-MODULE NAVIGATION =====
function navigateToService(tab, action, businessId){
  curTab.value = tab || 'subsidy'
  if (action === 'applySubsidy' && businessId) {
    nextTick(() => {
      const match = availableSubsidies.find(function(s) {
        // Match by businessId or fuzzy name match
        if (businessId === 'water-saving-irrigation') return s.name.indexOf('节水灌溉') !== -1
        if (businessId === 'land-protection') return s.name.indexOf('耕地地力') !== -1
        if (businessId === 'machine-purchase') return s.name.indexOf('农机购置') !== -1
        return s.name.indexOf(businessId) !== -1
      })
      if (match) { applySubsidy(match) }
    })
  }
  // Scroll subsidy section into view
  nextTick(() => {
    const el = document.querySelector('.subsidy-cards')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  })
}
// ===== 节水灌溉设施补贴 =====
function showWaterSavingForm(){
  let h='<div class="mod-desc" style="display:flex;align-items:center;gap:6px"><span style="font-size:16px">👤</span><span style="color:#6F91A8;font-size:11px">本人信息 — 以下字段从当前登录账户自动带出</span></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>姓名</label><input class="svc-self-field" value="王友德" readonly></div><div class="svc-fld"><label>身份证号</label><input class="svc-self-field" value="342***15**07" readonly></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>户籍所在地</label><input class="svc-self-field" value="中堰村" readonly></div><div class="svc-fld"><label>联系电话</label><input class="svc-self-field" value="138****5432" readonly></div></div>'
  h+='<div class="mod-divider"></div><div class="mod-section-title">💧 灌溉设施信息</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>灌溉面积（亩）<span style="color:#F44">*</span></label><input type="number" id="irrigationArea" placeholder="请输入拟建设节水灌溉的耕地面积" oninput="window._svc.calcIrrigationAmount()" min="1" step="0.1"></div><div class="svc-fld"><label>设施类型<span style="color:#F44">*</span></label><select id="irrigationType" style="width:100%;background:rgba(10,36,68,0.55);border:1px solid rgba(40,199,111,0.18);border-radius:6px;color:#D0E4F5;padding:10px 12px;font-size:12px;font-family:inherit"><option value="">请选择</option><option value="drip">滴灌系统</option><option value="sprinkler">喷灌系统</option><option value="micro">微喷灌系统</option></select></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>地块位置<span style="color:#F44">*</span></label><input type="text" id="irrigationLocation" placeholder="如：中堰村东片区"></div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>预估补贴金额（≤800元/亩）</label><div id="irrigationAmountDisplay" style="background:rgba(40,199,250,0.05);border:1px solid rgba(40,199,250,0.15);border-radius:6px;padding:10px 12px;font-size:18px;color:#28C76F;font-weight:700;text-align:center">¥0.00</div></div><div style="font-size:10px;color:#f59e0b;margin-top:4px">⚠ 每户最高补贴5亩，实际标准以县级农业农村部门核定为准</div></div>'
  h+='<div class="mod-divider"></div><div class="mod-section-title">📎 材料上传</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><div class="svc-upload-block"><input type="file" id="irrigationProofInput" accept=".pdf,.jpg,.jpeg,.png" style="display:none" onchange="window._svc.onUploadFile(this,\\'irrigationProofStatus\\')"><button type="button" class="svc-upload-btn" onclick="document.getElementById(\\'irrigationProofInput\\').click()">📄 上传土地承包合同</button><div class="svc-upload-status" id="irrigationProofStatus">未上传</div></div></div></div>'
  h+='<div class="svc-form-row" style="margin-top:16px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="flex:none;width:auto">取消</button><button class="svc-btn svc-btn-primary" onclick="window._svc.submitIrrigationSubsidy()" style="flex:none;width:auto">✓ 提交申请</button></div>'
  opMod('💧 节水灌溉设施补贴申请',h,'mod-md')
}
function calcIrrigationAmount(){
  const area=parseFloat(document.getElementById('irrigationArea')?.value)||0
  const display=document.getElementById('irrigationAmountDisplay')
  const capped=Math.min(area,5)
  if(display)display.textContent='¥'+Math.round(capped*800).toLocaleString()+'（参考，以核定为准）'
}
function submitIrrigationSubsidy(){
  const area=parseFloat(document.getElementById('irrigationArea')?.value)||0
  const type=document.getElementById('irrigationType')?.value||''
  const loc=document.getElementById('irrigationLocation')?.value||''
  if(!area||area<1){toast('请输入有效的灌溉面积','warn');return}
  if(!type){toast('请选择设施类型','warn');return}
  if(!loc){toast('请填写地块位置','warn');return}
  subsidy.unshift({id:Date.now(),appNo:'SB'+new Date().toISOString().slice(0,10).replace(/-/g,'')+String(Math.floor(Math.random()*900+100)),name:'王友德',type:'节水灌溉设施补贴',amount:Math.round(Math.min(area,5)*800),status:'已提交',date:new Date().toISOString().slice(0,10),node:'已提交',nodes:['已提交','村级初审','乡镇审核','部门复核','待发放','已发放'],currentNodeIdx:0})
  persistData('subsidy')
  clsMod()
  toast('节水灌溉补贴申请已提交','success')
}

// ===== EXPOSE HANDLERS =====
defineExpose({ navigateToService })
onMounted(()=>{`;
if (sp.includes(oldExposeSection)) {
  sp = sp.replace(oldExposeSection, newExposeSection);
  check('sp-1b-expose', true);
} else { check('sp-1b-expose', false); }

// 1c. Update _svc to include new handlers
const oldSvcSp = `window._svc={clsMod,queryBalance,submitReimburse,confirmReg,confirmTelemed,enterRoom,doConfirmAppt,cancelAppointment,cancelApptFromProgress,rateAppointment,setApptFilter,bookStep1,bookStep2,bookStep3,bookBack,showServiceGuide,showApptDetailById,submitRemote,triggerInvoiceUpload,triggerDiagnosisUpload,filterPayments,showTelemedForm,showTelemedDetailById,renderMedicalRecords,showLandSubsidyForm,showMachineSubsidyForm,showDibaoForm,showBizSubsidyForm,calcLandAmount,calcMachineAmount,calcDibaoIncome,submitLandSubsidy,submitMachineSubsidy,submitDibao,submitBizSubsidy,showSubsidyApply,showSubsidyProgress,showPolicyQuery,showMaterialDownload,downloadMaterial,downloadPolicyFile,showPolicyDetail,showSubsidyDetail,withdrawSubsidy,supplementSubsidy,onUploadFile,removeUploadFile,hasUpload,confirmEmergencyCall,sendHealthReport,elderPickerSelect,saveAlertSettingsFor,applyFromList:(name)=>{clsMod();if(name==='耕地地力保护补贴')showLandSubsidyForm();else if(name==='农机购置补贴')showMachineSubsidyForm();else if(name==='低保补助')showDibaoForm();else if(name==='创业补贴')showBizSubsidyForm()},confirmEnroll:(courseId)=>{confirmEnroll(courseId)},cancelEnrollFromDetail:(courseId)=>{cancelEnrollFromDetail(courseId)},openResource:(url)=>{openResource(url)},downloadFile:(url,name)=>{downloadFile(url,name)},showReplayForById:(id)=>{const c=myTrainingList.value.find(x=>x.id===id);if(c){clsMod();showReplayFor(c)}},closeLiveCard:()=>{closeLiveCard()},toast:(m,t)=>{toast(m,t)}}`;
const newSvcSp = `window._svc={clsMod,queryBalance,submitReimburse,confirmReg,confirmTelemed,enterRoom,doConfirmAppt,cancelAppointment,cancelApptFromProgress,rateAppointment,setApptFilter,bookStep1,bookStep2,bookStep3,bookBack,showServiceGuide,showApptDetailById,submitRemote,triggerInvoiceUpload,triggerDiagnosisUpload,filterPayments,showTelemedForm,showTelemedDetailById,renderMedicalRecords,showLandSubsidyForm,showMachineSubsidyForm,showWaterSavingForm,showDibaoForm,showBizSubsidyForm,calcLandAmount,calcMachineAmount,calcDibaoIncome,calcIrrigationAmount,submitLandSubsidy,submitMachineSubsidy,submitDibao,submitBizSubsidy,submitIrrigationSubsidy,showSubsidyApply,showSubsidyProgress,showPolicyQuery,showMaterialDownload,downloadMaterial,downloadPolicyFile,showPolicyDetail,showSubsidyDetail,withdrawSubsidy,supplementSubsidy,onUploadFile,removeUploadFile,hasUpload,confirmEmergencyCall,sendHealthReport,elderPickerSelect,saveAlertSettingsFor,applyFromList:(name)=>{clsMod();if(name==='耕地地力保护补贴')showLandSubsidyForm();else if(name==='农机购置补贴')showMachineSubsidyForm();else if(name==='节水灌溉设施补贴')showWaterSavingForm();else if(name==='低保补助')showDibaoForm();else if(name==='创业补贴')showBizSubsidyForm()},confirmEnroll:(courseId)=>{confirmEnroll(courseId)},cancelEnrollFromDetail:(courseId)=>{cancelEnrollFromDetail(courseId)},openResource:(url)=>{openResource(url)},downloadFile:(url,name)=>{downloadFile(url,name)},showReplayForById:(id)=>{const c=myTrainingList.value.find(x=>x.id===id);if(c){clsMod();showReplayFor(c)}},closeLiveCard:()=>{closeLiveCard()},toast:(m,t)=>{toast(m,t)}}`;
if (sp.includes(oldSvcSp)) {
  sp = sp.replace(oldSvcSp, newSvcSp);
  check('sp-1c-svc', true);
} else {
  // Try partial match
  if (sp.includes('showLandSubsidyForm,showMachineSubsidyForm,showDibaoForm,showBizSubsidyForm')) {
    sp = sp.replace('showLandSubsidyForm,showMachineSubsidyForm,showDibaoForm,showBizSubsidyForm', 'showLandSubsidyForm,showMachineSubsidyForm,showWaterSavingForm,showDibaoForm,showBizSubsidyForm');
    sp = sp.replace('calcLandAmount,calcMachineAmount,calcDibaoIncome,submitLandSubsidy', 'calcLandAmount,calcMachineAmount,calcDibaoIncome,calcIrrigationAmount,submitLandSubsidy');
    sp = sp.replace('submitMachineSubsidy,submitDibao,submitBizSubsidy', 'submitMachineSubsidy,submitDibao,submitBizSubsidy,submitIrrigationSubsidy');
    sp = sp.replace("else if(name==='低保补助')showDibaoForm()", "else if(name==='节水灌溉设施补贴')showWaterSavingForm();else if(name==='低保补助')showDibaoForm()");
    check('sp-1c-svc-partial', true);
  } else {
    check('sp-1c-svc', false);
  }
}

fs.writeFileSync(spFp, sp, 'utf-8');
console.log('ServicePage: ' + ok + '/' + total + ' passed, length=' + sp.length);

// ===== DASHBOARDPAGE.VUE =====
const dpFp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let dp = fs.readFileSync(dpFp, 'utf-8');
let ok2 = 0, total2 = 0;
function check2(l, c) { total2++; if (c) { ok2++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// 2a. Add servicePageRef and ref on component
const oldRefLine = `const leaderDetailSection = ref(null)`;
const newRefLine = `const leaderDetailSection = ref(null)
const servicePageRef = ref(null)`;
if (dp.includes(oldRefLine)) {
  dp = dp.replace(oldRefLine, newRefLine);
  check2('dp-2a-ref', true);
} else { check2('dp-2a-ref', false); }

const oldServiceTag = `<ServicePage :embedded="true" />`;
const newServiceTag = `<ServicePage ref="servicePageRef" :embedded="true" />`;
if (dp.includes(oldServiceTag)) {
  dp = dp.replace(oldServiceTag, newServiceTag);
  check2('dp-2a-tag', true);
} else { check2('dp-2a-tag', false); }

// 2b. Update notice data with structured action fields
const oldN002 = `{ id: 'N002', icon: '💧', title: '节水灌溉补贴申请通知', tag: '重要', tagColor: '#F5B83D',
    date: '2026-07-01', source: '乡镇水利站',
    content: '根据县农业农村局关于推广节水灌溉技术的工作部署，现开展2026年度节水灌溉设施建设补贴申请工作。\\\\n\\\\n📅 申请时间：2026年7月1日–7月31日\\\\n👥 申请对象：中堰村从事农业种植的农户\\\\n📋 补贴条件：新建或改造滴灌、喷灌等节水灌溉设施，面积不低于1亩\\\\n💰 补贴标准：每亩最高补贴800元，每户最高补贴5亩\\\\n📄 所需材料：身份证复印件、土地承包合同、灌溉设施购置发票或施工合同\\\\n📍 办理地点：村委会一楼便民服务大厅\\\\n⏰ 截止日期：2026年7月31日\\\\n\\\\n请符合条件的农户抓紧时间申请，逾期不再受理。',
    action: 'apply_subsidy' }`;

const newN002 = `{ id: 'N002', icon: '💧', title: '节水灌溉补贴申请通知', tag: '重要', tagColor: '#F5B83D',
    date: '2026-07-01', source: '乡镇水利站',
    content: '根据县农业农村局关于推广节水灌溉技术的工作部署，现开展2026年度节水灌溉设施建设补贴申请工作。\\\\n\\\\n📅 申请时间：2026年7月1日–7月31日\\\\n👥 申请对象：中堰村从事农业种植的农户\\\\n📋 补贴条件：新建或改造滴灌、喷灌等节水灌溉设施，面积不低于1亩\\\\n💰 补贴标准：每亩最高补贴800元，每户最高补贴5亩\\\\n📄 所需材料：身份证复印件、土地承包合同、灌溉设施购置发票或施工合同\\\\n📍 办理地点：村委会一楼便民服务大厅\\\\n⏰ 截止日期：2026年7月31日\\\\n\\\\n请符合条件的农户抓紧时间申请，逾期不再受理。',
    actionType: 'SERVICE', actionText: '立即申请', targetModule: 'subsidy', targetBusinessId: 'water-saving-irrigation' }`;

if (dp.includes(oldN002)) {
  dp = dp.replace(oldN002, newN002);
  check2('dp-2b-n002', true);
} else {
  // Try simpler match
  const oldN002Simple = "action: 'apply_subsidy' },\n  { id: 'N003'";
  const newN002Simple = "actionType: 'SERVICE', actionText: '立即申请', targetModule: 'subsidy', targetBusinessId: 'water-saving-irrigation' },\n  { id: 'N003'";
  if (dp.includes(oldN002Simple)) {
    dp = dp.replace(oldN002Simple, newN002Simple);
    check2('dp-2b-n002-simple', true);
  } else {
    check2('dp-2b-n002', false);
  }
}

// Also update N001 with structured action
const oldN001 = `{ id: 'N001', icon: '🏥', title: '65岁以上老人免费体检', tag: '进行中', tagColor: '#39D98A',
    date: '2026-07-15', source: '乡镇卫生院',
    content: '为做好老年人健康管理工作，中堰村将组织65岁以上老年人免费健康体检。请符合条件的村民携带相关材料按时参加。\\\\n\\\\n📅 体检时间：7月18日（周六）上午 8:00–11:30\\\\n📍 体检地点：中堰村村委会一楼大厅\\\\n👴 服务对象：中堰村65岁及以上常住居民（1959年及以前出生）\\\\n📋 携带材料：本人身份证、医保卡\\\\n📞 咨询方式：联系本村第3网格网格员王大爷\\\\n\\\\n注意事项：\\\\n1. 体检当天需空腹，请勿吃早餐\\\\n2. 行动不便的老人可由家属陪同\\\\n3. 如无法按时参加，请提前联系网格员另行安排',
    action: 'contact_grid' }`;

const newN001 = `{ id: 'N001', icon: '🏥', title: '65岁以上老人免费体检', tag: '进行中', tagColor: '#39D98A',
    date: '2026-07-15', source: '乡镇卫生院',
    content: '为做好老年人健康管理工作，中堰村将组织65岁以上老年人免费健康体检。请符合条件的村民携带相关材料按时参加。\\\\n\\\\n📅 体检时间：7月18日（周六）上午 8:00–11:30\\\\n📍 体检地点：中堰村村委会一楼大厅\\\\n👴 服务对象：中堰村65岁及以上常住居民（1959年及以前出生）\\\\n📋 携带材料：本人身份证、医保卡\\\\n📞 咨询方式：联系本村第3网格网格员王大爷\\\\n\\\\n注意事项：\\\\n1. 体检当天需空腹，请勿吃早餐\\\\n2. 行动不便的老人可由家属陪同\\\\n3. 如无法按时参加，请提前联系网格员另行安排',
    actionType: 'CONTACT', actionText: '联系网格员', targetModule: null, targetBusinessId: null }`;

if (dp.includes(oldN001)) {
  dp = dp.replace(oldN001, newN001);
  check2('dp-2b-n001', true);
} else {
  const oldN001Simple = "action: 'contact_grid' },\n  { id: 'N002'";
  const newN001Simple = "actionType: 'CONTACT', actionText: '联系网格员', targetModule: null, targetBusinessId: null },\n  { id: 'N002'";
  if (dp.includes(oldN001Simple)) {
    dp = dp.replace(oldN001Simple, newN001Simple);
    check2('dp-2b-n001-simple', true);
  } else {
    check2('dp-2b-n001', false);
  }
}

// Also update N003, N004 with structured null action
const oldN003N004 = `{ id: 'N003', icon: '⚠️', title: '夏季秸秆禁烧与防火通知', tag: '重要', tagColor: '#E74C3C',
    date: '2026-07-05', source: '村委会',
    content: '当前正值夏季高温季节，为做好秸秆禁烧和防火安全工作，现将有关事项通知如下：\\\\n\\\\n一、严禁任何单位和个人在田间地头、路边沟渠焚烧农作物秸秆、杂草和垃圾。\\\\n二、提倡秸秆还田、秸秆饲料化等综合利用方式，村委会可协助联系秸秆回收企业。\\\\n三、各农户需注意用火用电安全，及时清理房前屋后可燃物。\\\\n四、发现火情请立即拨打119，并第一时间通知网格员或村委会。\\\\n五、对违反禁烧规定的，将依法依规处理。\\\\n\\\\n请广大村民相互转告，共同维护安全生活环境。',
    action: null },
  { id: 'N004', icon: '📢', title: '7月党员活动日通知', tag: null, tagColor: null,
    date: '2026-07-10', source: '村党支部',
    content: '各位党员同志：\\\\n\\\\n根据镇党委统一安排，7月份党员活动日定于7月12日（周日）上午9:00在村党群服务中心二楼会议室举行。\\\\n\\\\n📋 活动内容：\\\\n1. 学习党的二十届三中全会精神\\\\n2. 开展"我为群众办实事"实践活动总结\\\\n3. 讨论下半年村级重点工作计划\\\\n\\\\n请全体党员准时参加，佩戴党徽，携带学习笔记本。如有特殊情况不能参加，须提前向支部书记请假。',
    action: null }`;

const newN003N004 = `{ id: 'N003', icon: '⚠️', title: '夏季秸秆禁烧与防火通知', tag: '重要', tagColor: '#E74C3C',
    date: '2026-07-05', source: '村委会',
    content: '当前正值夏季高温季节，为做好秸秆禁烧和防火安全工作，现将有关事项通知如下：\\\\n\\\\n一、严禁任何单位和个人在田间地头、路边沟渠焚烧农作物秸秆、杂草和垃圾。\\\\n二、提倡秸秆还田、秸秆饲料化等综合利用方式，村委会可协助联系秸秆回收企业。\\\\n三、各农户需注意用火用电安全，及时清理房前屋后可燃物。\\\\n四、发现火情请立即拨打119，并第一时间通知网格员或村委会。\\\\n五、对违反禁烧规定的，将依法依规处理。\\\\n\\\\n请广大村民相互转告，共同维护安全生活环境。',
    actionType: null, actionText: null, targetModule: null, targetBusinessId: null },
  { id: 'N004', icon: '📢', title: '7月党员活动日通知', tag: null, tagColor: null,
    date: '2026-07-10', source: '村党支部',
    content: '各位党员同志：\\\\n\\\\n根据镇党委统一安排，7月份党员活动日定于7月12日（周日）上午9:00在村党群服务中心二楼会议室举行。\\\\n\\\\n📋 活动内容：\\\\n1. 学习党的二十届三中全会精神\\\\n2. 开展"我为群众办实事"实践活动总结\\\\n3. 讨论下半年村级重点工作计划\\\\n\\\\n请全体党员准时参加，佩戴党徽，携带学习笔记本。如有特殊情况不能参加，须提前向支部书记请假。',
    actionType: null, actionText: null, targetModule: null, targetBusinessId: null }`;

// Try matching the old N003/N004 block
const oldN003Simple = "action: null },\n  { id: 'N004'";
if (dp.includes(oldN003Simple)) {
  dp = dp.replace(oldN003Simple, "actionType: null, actionText: null, targetModule: null, targetBusinessId: null },\n  { id: 'N004'");
  // Also fix N004
  const oldN004End = "action: null }\n]";
  const newN004End = "actionType: null, actionText: null, targetModule: null, targetBusinessId: null }\n]";
  if (dp.includes(oldN004End)) {
    dp = dp.replace(oldN004End, newN004End);
    check2('dp-2b-n003n004', true);
  } else { check2('dp-2b-n003n004', false); }
} else { check2('dp-2b-n003n004', false); }

// 2c. Rewrite showNoticeDetail to use structured action fields
const oldDetailAction = `  // Action buttons
  h += '<div style="display:flex;gap:8px">'
  if (n.action === 'contact_grid') {
    h += '<button class="btn btn-primary" onclick="window._svc.showGridWorkerInfo()" style="flex:1;justify-content:center">📞 联系网格员</button>'
  } else if (n.action === 'apply_subsidy') {
    h += '<button class="btn btn-primary" onclick="window._svc.goToSubsidy()" style="flex:1;justify-content:center">📝 立即申请</button>'
  }
  h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()" style="' + (n.action ? '' : 'flex:1;') + 'justify-content:center">关闭</button>'
  h += '</div>'`;

const newDetailAction = `  // Action buttons — data-driven from notice fields
  h += '<div style="display:flex;gap:8px">'
  if (n.actionType === 'CONTACT') {
    h += '<button class="btn btn-primary" onclick="window._svc.showGridWorkerInfo()" style="flex:1;justify-content:center">📞 ' + (n.actionText || '联系网格员') + '</button>'
  } else if (n.actionType === 'SERVICE' && n.targetModule === 'subsidy') {
    h += '<button class="btn btn-primary" onclick="window._svc.goToSubsidy(\\'' + (n.targetBusinessId || '') + '\\')" style="flex:1;justify-content:center">📝 ' + (n.actionText || '立即申请') + '</button>'
  }
  h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()" style="' + (n.actionType ? '' : 'flex:1;') + 'justify-content:center">关闭</button>'
  h += '</div>'`;

if (dp.includes(oldDetailAction)) {
  dp = dp.replace(oldDetailAction, newDetailAction);
  check2('dp-2c-detailAction', true);
} else { check2('dp-2c-detailAction', false); }

// 2d. Rewrite goToSubsidy to use servicePageRef
const oldGoToSubsidy = `function goToSubsidy() {
  closeModal()
  // Switch to service center — subsidy section
  toast('正在跳转到补贴申请页面…', 'info')
  if (typeof switchPage === 'function') {
    switchPage('service')
    setTimeout(function() {
      var el = document.querySelector('[data-section="subsidy"]')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 500)
  }
}`;

const newGoToSubsidy = `function goToSubsidy(businessId) {
  closeModal()
  toast('正在跳转到补贴申请页面…', 'info')
  switchPage('service')
  // Cross-module navigation via ServicePage ref
  setTimeout(function() {
    if (servicePageRef.value && typeof servicePageRef.value.navigateToService === 'function') {
      servicePageRef.value.navigateToService('subsidy', 'applySubsidy', businessId || 'water-saving-irrigation')
    }
  }, 400)
}`;

if (dp.includes(oldGoToSubsidy)) {
  dp = dp.replace(oldGoToSubsidy, newGoToSubsidy);
  check2('dp-2d-goToSubsidy', true);
} else { check2('dp-2d-goToSubsidy', false); }

fs.writeFileSync(dpFp, dp, 'utf-8');
console.log('DashboardPage: ' + ok2 + '/' + total2 + ' passed, length=' + dp.length);
console.log('\\n=== CROSS-MODULE NAVIGATION FINAL ===');
