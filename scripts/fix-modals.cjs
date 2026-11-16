// Rewrite ServicePage.vue modal functions with svc-modal namespace classes
const fs = require('fs');
const path = require('path');
const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');
let s = fs.readFileSync(fp, 'utf-8');

// Replace between start (inclusive) and end (exclusive of end marker text)
function replaceUpTo(startMarker, endMarker, newContent) {
  const i0 = s.indexOf(startMarker);
  if (i0 === -1) { console.error('START:', startMarker.substring(0,50)); process.exit(1); }
  const i1 = s.indexOf(endMarker, i0 + startMarker.length);
  if (i1 === -1) { console.error('END:', endMarker.substring(0,50)); process.exit(1); }
  s = s.substring(0, i0) + newContent + s.substring(i1);
}

// ===== 1. showInsuranceBalance + queryBalance =====
replaceUpTo(
  'function showInsuranceBalance(){',
  'function showReimburseForm(){',
`function showInsuranceBalance(){
  const r=insurance[0]
  const maskedId=r?r.idCard:'610***********0034'
  const maskedName=r?r.name:'王友德'
  let h='<div class="mod-desc">查询本人医保账户余额及养老金信息</div>'
  h+='<div class="svc-fld"><label>身份证号</label><input value="'+maskedId+'" readonly></div>'
  h+='<div class="svc-fld"><label>参保人</label><input value="'+maskedName+'" readonly></div>'
  h+='<div id="bal_result" class="svc-inline-result"></div>'
  h+='<div class="svc-form-actions"><button class="svc-btn svc-btn-primary" onclick="window._svc.queryBalance()">\\u{1F50D} 查询账户</button><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()">取消</button></div>'
  opMod('\\u{1F4B3} 医保账户查询',h,'mod-sm')
}
function queryBalance(){
  const r=insurance[0]
  const el=document.getElementById('bal_result');if(!el)return
  if(!r){el.innerHTML='<div style="color:#E74C3C;font-size:12px">未找到参保记录</div>';el.classList.add('show');return}
  let h='<div class="svc-result-card">'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">参保人</span><span class="svc-rc-value">'+r.name+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">医保类型</span><span class="svc-rc-value">'+r.medType+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">医保状态</span><span class="svc-rc-value" style="color:#28C76F">● '+r.medStatus+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">医保余额</span><span class="svc-rc-value" style="color:#28C76F;font-weight:700;font-size:15px">'+r.medBalance+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">养老金状态</span><span class="svc-rc-value" style="color:#28C7FA">'+r.penStatus+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">月度发放</span><span class="svc-rc-value" style="color:#28C76F;font-weight:700;font-size:15px">'+r.penMonthly+'/月</span></div>'
  h+='</div>'
  el.innerHTML=h;el.classList.add('show')
}
`);

// ===== 2. showReimburseForm + submitReimburse =====
replaceUpTo(
  'function showReimburseForm(){',
  'function showHospitalReg(){',
`function showReimburseForm(){
  let h='<div class="mod-desc">提交就诊发票与诊断证明，申请医保报销</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>就诊医院 <span style="color:#E74C3C">*</span></label><select id="rb_hosp"><option value="">请选择医院</option><option>安康市人民医院</option><option>汉滨区中医院</option><option>汉滨区人民医院</option><option>安康市中心医院</option></select></div><div class="svc-fld"><label>就诊日期 <span style="color:#E74C3C">*</span></label><input id="rb_date" type="date"></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>医疗总费用 <span style="color:#E74C3C">*</span></label><input id="rb_amt" type="number" placeholder="0.00" step="0.01"></div><div class="svc-fld"><label>报销类型</label><select id="rb_type"><option>门诊</option><option>住院</option><option>慢特病</option></select></div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="mod-section-title">\\u{1F4CE} 材料上传</div>'
  h+='<div class="svc-upload-row"><button class="svc-upload-btn" onclick="window._svc.toast(\\'发票上传功能已触发\\',\\'info\\')">\\u{1F4C4} 上传发票</button><button class="svc-upload-btn" onclick="window._svc.toast(\\'诊断证明上传功能已触发\\',\\'info\\')">\\u{1F4CB} 上传诊断证明</button></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="svc-fld"><label>备注</label><textarea id="rb_note" placeholder="选填说明"></textarea></div>'
  h+='<div class="svc-form-actions"><button class="svc-btn svc-btn-primary" onclick="window._svc.submitReimburse()">\\u{1F4E4} 提交申请</button><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()">取消</button></div>'
  opMod('\\u{1F4CB} 报销材料提交',h,'mod-lg')
}
function submitReimburse(){
  const hosp=document.getElementById('rb_hosp').value
  const date=document.getElementById('rb_date').value
  const amt=document.getElementById('rb_amt').value
  if(!hosp||!date||!amt){toast('请填写必填字段（带 * 号）','warn');return}
  toast('报销材料已提交，预计3个工作日内审核','ok');clsMod()
}
`);

// ===== 3. showHospitalReg + confirmReg =====
replaceUpTo(
  'function showHospitalReg(){',
  'function showPaymentHistory(){',
`function showHospitalReg(){
  const r=insurance[0]
  const maskedName=r?r.name:'王友德'
  let h='<div class="mod-desc">选择医院、科室与时段，在线预约挂号</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>医院 <span style="color:#E74C3C">*</span></label><select id="reg_hosp"><option value="">请选择</option><option>安康市人民医院</option><option>汉滨区中医院</option><option>汉滨区人民医院</option><option>安康市中心医院</option></select></div><div class="svc-fld"><label>科室 <span style="color:#E74C3C">*</span></label><select id="reg_dept"><option value="">请选择</option><option>内科</option><option>外科</option><option>骨科</option><option>心内科</option><option>儿科</option></select></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>预约日期 <span style="color:#E74C3C">*</span></label><input id="reg_date" type="date"></div><div class="svc-fld"><label>就诊时段 <span style="color:#E74C3C">*</span></label><select id="reg_time"><option value="">请选择</option><option>上午 08:00-12:00</option><option>下午 14:00-17:00</option></select></div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="svc-fld"><label>就诊人</label><input value="'+maskedName+'" readonly></div>'
  h+='<div class="svc-form-actions"><button class="svc-btn svc-btn-primary" onclick="window._svc.confirmReg()">\\u2705 确认预约</button><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()">取消</button></div>'
  opMod('\\u{1F3E5} 在线挂号',h,'mod-md')
}
function confirmReg(){
  const hosp=document.getElementById('reg_hosp').value
  const dept=document.getElementById('reg_dept').value
  const date=document.getElementById('reg_date').value
  const time=document.getElementById('reg_time').value
  if(!hosp||!dept||!date||!time){toast('请填写必填字段（带 * 号）','warn');return}
  toast('挂号成功！'+hosp+' '+dept+' '+date+' '+time,'ok');clsMod()
}
`);

// ===== 4. showPaymentHistory =====
replaceUpTo(
  'function showPaymentHistory(){',
  'function showRemoteRecord(){',
`function showPaymentHistory(){
  let h='<div class="mod-desc">城乡居民医保年度缴费记录</div>'
  h+='<div class="svc-fld"><label>筛选年份</label><select onchange="window._svc.toast(\\'已筛选：\\'+this.value,\\'info\\')"><option>2026 年</option><option>2025 年</option><option>2024 年</option></select></div>'
  h+='<div class="mod-divider"></div>'
  h+='<table class="svc-pay-table"><thead><tr><th>缴费日期</th><th>缴费类型</th><th style="text-align:right">金额</th><th style="text-align:center">状态</th></tr></thead><tbody>'
  const years=[2026,2025,2024,2023]
  years.forEach(y=>{
    h+='<tr><td>'+y+'-06-10</td><td>城乡居民医保</td><td class="svc-pay-amount" style="text-align:right">&yen;380</td><td style="text-align:center"><span class="svc-tag green">已缴纳</span></td></tr>'
  })
  h+='</tbody></table>'
  h+='<div class="svc-pay-footer">共 4 条记录 &middot; 累计缴费 <b style="color:#28C76F">&yen;1,520</b></div>'
  opMod('\\u{1F4C4} 缴费记录',h,'mod-sm')
}
`);

// ===== 5. showRemoteRecord + submitRemote =====
replaceUpTo(
  'function showRemoteRecord(){',
  'function showSubsidyProgress(){',
`function showRemoteRecord(){
  const r=insurance[0]
  const maskedPhone=r&&r.idCard?'138****5678':''
  let h='<div class="mod-desc">长期外地居住或转诊就医前需办理异地备案</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>就医地区 <span style="color:#E74C3C">*</span></label><select id="rr_region"><option value="">请选择</option><option>陕西省西安市</option><option>陕西省宝鸡市</option><option>陕西省汉中市</option><option>其他省份</option></select></div><div class="svc-fld"><label>备案原因 <span style="color:#E74C3C">*</span></label><select id="rr_reason"><option value="">请选择</option><option>异地长期居住</option><option>转诊转院</option><option>异地急诊</option></select></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>开始日期 <span style="color:#E74C3C">*</span></label><input id="rr_start" type="date"></div><div class="svc-fld"><label>预计结束日期</label><input id="rr_end" type="date"></div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="svc-fld"><label>联系电话</label><input id="rr_phone" value="'+maskedPhone+'" placeholder="请输入联系电话"></div>'
  h+='<div class="svc-fld"><label>备注</label><textarea id="rr_note" placeholder="选填说明"></textarea></div>'
  h+='<div class="svc-form-actions"><button class="svc-btn svc-btn-primary" onclick="window._svc.submitRemote()">\\u{1F4E4} 提交备案</button><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()">取消</button></div>'
  opMod('\\u{1F30D} 异地就医备案',h,'mod-md')
}
function submitRemote(){
  const region=document.getElementById('rr_region').value
  const reason=document.getElementById('rr_reason').value
  const start=document.getElementById('rr_start').value
  if(!region||!reason||!start){toast('请填写必填字段（带 * 号）','warn');return}
  toast('异地就医备案已提交，审核结果将以短信通知','ok');clsMod()
}
`);

fs.writeFileSync(fp, s, 'utf-8');
console.log('Done. File length:', s.length, 'chars');
