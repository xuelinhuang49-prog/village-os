// Fix file uploads in subsidy forms — add real file inputs, validation, status display
const fs = require('fs');
const path = require('path');
const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0;

// === 1. Replace land subsidy form upload ===
const landOld = `h+='<div class="svc-form-row"><div class="svc-fld"><button class="svc-upload-btn" onclick="window._svc.triggerLandProofUpload()">📄 上传土地承包经营权证</button><span class="svc-upload-hint" id="landProofStatus">未上传</span></div></div>'`;
const landNew = `h+='<div class="svc-form-row"><div class="svc-fld"><div class="svc-upload-block"><input type="file" id="landProofInput" accept=".pdf,.jpg,.jpeg,.png" style="display:none" onchange="window._svc.onUploadFile(this,\\'landProofStatus\\')"><button type="button" class="svc-upload-btn" onclick="document.getElementById(\\'landProofInput\\').click()">📄 上传土地承包经营权证</button><div class="svc-upload-status" id="landProofStatus">未上传</div></div></div></div>'`;
if (s.includes(landOld)) { s = s.replace(landOld, landNew); ok++; console.log('OK: 1-land upload'); }
else { console.log('FAIL: 1-land upload'); }

// === 2. Replace machine subsidy form upload ===
const machineOld = `h+='<div class="svc-form-row"><div class="svc-fld"><button class="svc-upload-btn" onclick="window._svc.triggerInvoiceUpload()">📄 上传购机发票</button><span class="svc-upload-hint" id="invoiceStatus">未上传</span></div><div class="svc-fld"><button class="svc-upload-btn" onclick="window._svc.triggerDiagnosisUpload()">🆔 上传身份证及人机合影</button><span class="svc-upload-hint" id="idPhotoStatus">未上传</span></div></div>'`;
const machineNew = `h+='<div class="svc-form-row"><div class="svc-fld"><div class="svc-upload-block"><input type="file" id="machineInvoiceInput" accept=".pdf,.jpg,.jpeg,.png" style="display:none" onchange="window._svc.onUploadFile(this,\\'invoiceStatus\\')"><button type="button" class="svc-upload-btn" onclick="document.getElementById(\\'machineInvoiceInput\\').click()">📄 上传购机发票</button><div class="svc-upload-status" id="invoiceStatus">未上传</div></div></div><div class="svc-fld"><div class="svc-upload-block"><input type="file" id="machineIdPhotoInput" accept=".pdf,.jpg,.jpeg,.png" style="display:none" onchange="window._svc.onUploadFile(this,\\'idPhotoStatus\\')"><button type="button" class="svc-upload-btn" onclick="document.getElementById(\\'machineIdPhotoInput\\').click()">🆔 上传身份证及人机合影</button><div class="svc-upload-status" id="idPhotoStatus">未上传</div></div></div></div>'`;
if (s.includes(machineOld)) { s = s.replace(machineOld, machineNew); ok++; console.log('OK: 2-machine upload'); }
else { console.log('FAIL: 2-machine upload'); }

// === 3. Replace dibao form upload ===
const dibaoOld = `h+='<div class="svc-form-row"><div class="svc-fld"><button class="svc-upload-btn" onclick="window._svc.triggerInvoiceUpload()">🆔 上传身份证及户口本</button><span class="svc-upload-hint" id="dibaoIdStatus">未上传</span></div><div class="svc-fld"><button class="svc-upload-btn" onclick="window._svc.triggerDiagnosisUpload()">📄 上传收入及财产证明</button><span class="svc-upload-hint" id="dibaoIncomeStatus">未上传</span></div></div>'`;
const dibaoNew = `h+='<div class="svc-form-row"><div class="svc-fld"><div class="svc-upload-block"><input type="file" id="dibaoIdInput" accept=".pdf,.jpg,.jpeg,.png" style="display:none" onchange="window._svc.onUploadFile(this,\\'dibaoIdStatus\\')"><button type="button" class="svc-upload-btn" onclick="document.getElementById(\\'dibaoIdInput\\').click()">🆔 上传身份证及户口本</button><div class="svc-upload-status" id="dibaoIdStatus">未上传</div></div></div><div class="svc-fld"><div class="svc-upload-block"><input type="file" id="dibaoIncomeInput" accept=".pdf,.jpg,.jpeg,.png" style="display:none" onchange="window._svc.onUploadFile(this,\\'dibaoIncomeStatus\\')"><button type="button" class="svc-upload-btn" onclick="document.getElementById(\\'dibaoIncomeInput\\').click()">📄 上传收入及财产证明</button><div class="svc-upload-status" id="dibaoIncomeStatus">未上传</div></div></div></div>'`;
if (s.includes(dibaoOld)) { s = s.replace(dibaoOld, dibaoNew); ok++; console.log('OK: 3-dibao upload'); }
else { console.log('FAIL: 3-dibao upload'); }

// === 4. Replace biz subsidy form upload ===
const bizOld = `h+='<div class="svc-form-row"><div class="svc-fld"><button class="svc-upload-btn" onclick="window._svc.triggerInvoiceUpload()">📄 上传营业执照</button><span class="svc-upload-hint" id="bizLicenseStatus">未上传</span></div><div class="svc-fld"><button class="svc-upload-btn" onclick="window._svc.triggerDiagnosisUpload()">📄 上传创业计划书</button><span class="svc-upload-hint" id="bizPlanStatus">未上传</span></div></div>'`;
const bizNew = `h+='<div class="svc-form-row"><div class="svc-fld"><div class="svc-upload-block"><input type="file" id="bizLicenseInput" accept=".pdf,.jpg,.jpeg,.png" style="display:none" onchange="window._svc.onUploadFile(this,\\'bizLicenseStatus\\')"><button type="button" class="svc-upload-btn" onclick="document.getElementById(\\'bizLicenseInput\\').click()">📄 上传营业执照</button><div class="svc-upload-status" id="bizLicenseStatus">未上传</div></div></div><div class="svc-fld"><div class="svc-upload-block"><input type="file" id="bizPlanInput" accept=".pdf,.jpg,.jpeg,.png" style="display:none" onchange="window._svc.onUploadFile(this,\\'bizPlanStatus\\')"><button type="button" class="svc-upload-btn" onclick="document.getElementById(\\'bizPlanInput\\').click()">📄 上传创业计划书</button><div class="svc-upload-status" id="bizPlanStatus">未上传</div></div></div></div>'`;
if (s.includes(bizOld)) { s = s.replace(bizOld, bizNew); ok++; console.log('OK: 4-biz upload'); }
else { console.log('FAIL: 4-biz upload'); }

// === 5. Replace submitLandSubsidy to check for upload ===
const submitLandOld = `function submitLandSubsidy(){
  const area=parseFloat(document.getElementById('landArea')?.value)||0
  if(!area||area<1){toast('请输入有效的承包耕地面积（≥1亩）','err');return}
  if(!document.getElementById('landLocation')?.value.trim()){toast('请输入地块位置','err');return}
  const now=new Date()`;
const submitLandNew = `function submitLandSubsidy(){
  const area=parseFloat(document.getElementById('landArea')?.value)||0
  if(!area||area<1){toast('请输入有效的承包耕地面积（≥1亩）','err');return}
  if(!document.getElementById('landLocation')?.value.trim()){toast('请输入地块位置','err');return}
  if(!hasUpload('landProofInput')){toast('请先上传土地承包经营权证','err');return}
  const now=new Date()`;
if (s.includes(submitLandOld)) { s = s.replace(submitLandOld, submitLandNew); ok++; console.log('OK: 5-submitLand validation'); }
else { console.log('FAIL: 5-submitLand validation'); }

// === 6. Replace submitMachineSubsidy to check uploads ===
const submitMachineOld = `function submitMachineSubsidy(){
  const cat=document.getElementById('machineCat')?.value
  const name=document.getElementById('machineName')?.value.trim()
  const mfr=document.getElementById('machineMfr')?.value.trim()
  const model=document.getElementById('machineModel')?.value.trim()
  const date=document.getElementById('machineDate')?.value
  const price=parseFloat(document.getElementById('machinePrice')?.value)||0
  if(!cat||!name||!mfr||!model||!date||!price){toast('请填写所有必填字段','err');return}
  const now=new Date()`;
const submitMachineNew = `function submitMachineSubsidy(){
  const cat=document.getElementById('machineCat')?.value
  const name=document.getElementById('machineName')?.value.trim()
  const mfr=document.getElementById('machineMfr')?.value.trim()
  const model=document.getElementById('machineModel')?.value.trim()
  const date=document.getElementById('machineDate')?.value
  const price=parseFloat(document.getElementById('machinePrice')?.value)||0
  if(!cat||!name||!mfr||!model||!date||!price){toast('请填写所有必填字段','err');return}
  if(!hasUpload('machineInvoiceInput')){toast('请先上传购机发票','err');return}
  if(!hasUpload('machineIdPhotoInput')){toast('请先上传身份证及人机合影','err');return}
  const now=new Date()`;
if (s.includes(submitMachineOld)) { s = s.replace(submitMachineOld, submitMachineNew); ok++; console.log('OK: 6-submitMachine validation'); }
else { console.log('FAIL: 6-submitMachine validation'); }

// === 7. Replace submitDibao to check uploads ===
const submitDibaoOld = `function submitDibao(){
  const pop=parseInt(document.getElementById('dibaoPop')?.value)||0
  const income=parseFloat(document.getElementById('dibaoIncome')?.value)||0
  if(!pop||pop<1){toast('请输入有效的家庭人口数','err');return}
  if(!income){toast('请输入家庭月总收入','err');return}
  if(!document.getElementById('dibaoDesc')?.value.trim()){toast('请描述家庭困难情况','err');return}
  const perCap=Math.round(income/pop)`;
const submitDibaoNew = `function submitDibao(){
  const pop=parseInt(document.getElementById('dibaoPop')?.value)||0
  const income=parseFloat(document.getElementById('dibaoIncome')?.value)||0
  if(!pop||pop<1){toast('请输入有效的家庭人口数','err');return}
  if(!income){toast('请输入家庭月总收入','err');return}
  if(!document.getElementById('dibaoDesc')?.value.trim()){toast('请描述家庭困难情况','err');return}
  if(!hasUpload('dibaoIdInput')){toast('请先上传身份证及户口本','err');return}
  if(!hasUpload('dibaoIncomeInput')){toast('请先上传收入及财产证明','err');return}
  const perCap=Math.round(income/pop)`;
if (s.includes(submitDibaoOld)) { s = s.replace(submitDibaoOld, submitDibaoNew); ok++; console.log('OK: 7-submitDibao validation'); }
else { console.log('FAIL: 7-submitDibao validation'); }

// === 8. Replace submitBizSubsidy to check uploads ===
const submitBizOld = `function submitBizSubsidy(){
  const bizName=document.getElementById('bizName')?.value.trim()
  const bizCode=document.getElementById('bizCode')?.value.trim()
  const bizDate=document.getElementById('bizDate')?.value
  const bizAddress=document.getElementById('bizAddress')?.value.trim()
  const bizProject=document.getElementById('bizProject')?.value.trim()
  const bizAmount=parseFloat(document.getElementById('bizAmount')?.value)||0
  const bizBank=document.getElementById('bizBank')?.value.trim()
  if(!bizName||!bizCode||!bizDate||!bizAddress||!bizProject||!bizAmount||!bizBank){toast('请填写所有必填字段','err');return}
  if(bizAmount>8000){toast('申请金额最高不超过¥8,000','err');return}
  const now=new Date()`;
const submitBizNew = `function submitBizSubsidy(){
  const bizName=document.getElementById('bizName')?.value.trim()
  const bizCode=document.getElementById('bizCode')?.value.trim()
  const bizDate=document.getElementById('bizDate')?.value
  const bizAddress=document.getElementById('bizAddress')?.value.trim()
  const bizProject=document.getElementById('bizProject')?.value.trim()
  const bizAmount=parseFloat(document.getElementById('bizAmount')?.value)||0
  const bizBank=document.getElementById('bizBank')?.value.trim()
  if(!bizName||!bizCode||!bizDate||!bizAddress||!bizProject||!bizAmount||!bizBank){toast('请填写所有必填字段','err');return}
  if(bizAmount>8000){toast('申请金额最高不超过¥8,000','err');return}
  if(!hasUpload('bizLicenseInput')){toast('请先上传营业执照','err');return}
  if(!hasUpload('bizPlanInput')){toast('请先上传创业计划书','err');return}
  const now=new Date()`;
if (s.includes(submitBizOld)) { s = s.replace(submitBizOld, submitBizNew); ok++; console.log('OK: 8-submitBiz validation'); }
else { console.log('FAIL: 8-submitBiz validation'); }

// === 9. Add JS helper functions before the "DETAIL FUNCTIONS" section ===
const detailAnchor = '// ===== DETAIL FUNCTIONS =====';
if (s.includes(detailAnchor)) {
  const uploadHelpers = `// ===== FILE UPLOAD HELPERS =====
function formatSize(bytes){if(bytes<1024)return bytes+' B';if(bytes<1024*1024)return (bytes/1024).toFixed(1)+' KB';return (bytes/1024/1024).toFixed(1)+' MB'}
const uploadStore={}
function onUploadFile(input,statusId){
  const status=document.getElementById(statusId);if(!status)return
  const file=input.files[0]
  if(!file){status.innerHTML='<span class="svc-upload-pending">未上传</span>';delete uploadStore[input.id];return}
  const ext='.'+file.name.split('.').pop().toLowerCase()
  if(!['.pdf','.jpg','.jpeg','.png'].includes(ext)&&!['application/pdf','image/jpeg','image/png'].includes(file.type)){toast('仅支持 PDF、JPG、JPEG、PNG 格式','err');input.value='';return}
  if(file.size>10*1024*1024){toast('文件大小不能超过 10MB','err');input.value='';return}
  uploadStore[input.id]=file
  status.innerHTML='<span class="svc-upload-ok">✓ '+file.name+'（'+formatSize(file.size)+'）</span>'
    +'<a href="javascript:void(0)" class="svc-upload-retry" onclick="document.getElementById(\\''+input.id+'\\').click()">重新上传</a>'
    +'<a href="javascript:void(0)" class="svc-upload-del" onclick="window._svc.removeUploadFile(\\''+input.id+'\\',\\''+statusId+'\\')">删除</a>'
}
function removeUploadFile(inputId,statusId){
  const input=document.getElementById(inputId);const status=document.getElementById(statusId)
  if(input)input.value='';delete uploadStore[inputId]
  if(status)status.innerHTML='<span class="svc-upload-pending">未上传</span>'
}
function hasUpload(inputId){const input=document.getElementById(inputId);return input&&input.files&&input.files.length>0}

`;
  s = s.replace(detailAnchor, uploadHelpers + detailAnchor);
  ok++; console.log('OK: 9-upload helpers');
} else { console.log('FAIL: 9-upload helpers anchor'); }

// === 10. Add upload CSS after .svc-uploaded-file ===
const cssAnchor = '.svc-modal .svc-uploaded-file { display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#B7D3E8;padding:8px 14px;background:rgba(40,199,111,0.06);border:1px solid rgba(40,199,111,0.12);border-radius:8px; }';
if (s.includes(cssAnchor)) {
  const uploadCSS = `
/* Upload block (subsidy forms) */
.svc-modal .svc-upload-block { display:flex;flex-direction:column;gap:8px; }
.svc-modal .svc-upload-status { font-size:11px;min-height:18px; }
.svc-modal .svc-upload-pending { color:#6F91A8; }
.svc-modal .svc-upload-ok { color:#28C76F; }
.svc-modal .svc-upload-retry { color:#28C7FA;font-size:10px;margin-left:4px;text-decoration:none; }
.svc-modal .svc-upload-retry:hover { text-decoration:underline; }
.svc-modal .svc-upload-del { color:#E74C3C;font-size:10px;margin-left:2px;text-decoration:none; }
.svc-modal .svc-upload-del:hover { text-decoration:underline; }
`;
  s = s.replace(cssAnchor, cssAnchor + uploadCSS);
  ok++; console.log('OK: 10-upload CSS');
} else { console.log('FAIL: 10-upload CSS anchor'); }

// === 11. Update window._svc ===
const svcOld = `window._svc={clsMod,queryBalance,submitReimburse,confirmReg,sendReport,confirmTelemed,enterRoom,confirmAppt,saveAlert,submitRemote,triggerInvoiceUpload,triggerDiagnosisUpload,filterPayments,showLandSubsidyForm,showMachineSubsidyForm,showDibaoForm,showBizSubsidyForm,calcLandAmount,calcMachineAmount,calcDibaoIncome,submitLandSubsidy,submitMachineSubsidy,submitDibao,submitBizSubsidy,showSubsidyApply,showSubsidyProgress,showPolicyQuery,showMaterialDownload,downloadMaterial,downloadPolicyFile,showPolicyDetail,showSubsidyDetail,withdrawSubsidy,supplementSubsidy,applyFromList:(name)=>{clsMod();if(name==='耕地地力保护补贴')showLandSubsidyForm();else if(name==='农机购置补贴')showMachineSubsidyForm();else if(name==='低保补助')showDibaoForm();else if(name==='创业补贴')showBizSubsidyForm()},enrollFromList:(title)=>{clsMod();const c=availableCourses.find(x=>x.title===title);if(c)enrollCourse(c)},toast:(m,t)=>{toast(m,t)}}`;
if (s.includes(svcOld)) {
  const svcNew = `window._svc={clsMod,queryBalance,submitReimburse,confirmReg,sendReport,confirmTelemed,enterRoom,confirmAppt,saveAlert,submitRemote,triggerInvoiceUpload,triggerDiagnosisUpload,filterPayments,showLandSubsidyForm,showMachineSubsidyForm,showDibaoForm,showBizSubsidyForm,calcLandAmount,calcMachineAmount,calcDibaoIncome,submitLandSubsidy,submitMachineSubsidy,submitDibao,submitBizSubsidy,showSubsidyApply,showSubsidyProgress,showPolicyQuery,showMaterialDownload,downloadMaterial,downloadPolicyFile,showPolicyDetail,showSubsidyDetail,withdrawSubsidy,supplementSubsidy,onUploadFile,removeUploadFile,hasUpload,applyFromList:(name)=>{clsMod();if(name==='耕地地力保护补贴')showLandSubsidyForm();else if(name==='农机购置补贴')showMachineSubsidyForm();else if(name==='低保补助')showDibaoForm();else if(name==='创业补贴')showBizSubsidyForm()},enrollFromList:(title)=>{clsMod();const c=availableCourses.find(x=>x.title===title);if(c)enrollCourse(c)},toast:(m,t)=>{toast(m,t)}}`;
  s = s.replace(svcOld, svcNew); ok++; console.log('OK: 11-window._svc');
} else { console.log('FAIL: 11-window._svc'); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== DONE ===');
console.log('Changes:', ok, 'Length:', s.length);
