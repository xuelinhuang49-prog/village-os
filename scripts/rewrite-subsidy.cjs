// Rewrite Subsidy Module in ServicePage.vue
const fs = require('fs');
const path = require('path');
const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');
let s = fs.readFileSync(fp, 'utf-8');

// Helper: replace between start marker (inclusive) and end marker (exclusive of end marker text)
function replaceBetween(startMarker, endMarker, newContent) {
  const i0 = s.indexOf(startMarker);
  if (i0 === -1) { console.error('START NOT FOUND:', startMarker.substring(0, 60)); process.exit(1); }
  const i1 = s.indexOf(endMarker, i0 + startMarker.length);
  if (i1 === -1) { console.error('END NOT FOUND:', endMarker.substring(0, 60)); process.exit(1); }
  s = s.substring(0, i0) + newContent + s.substring(i1);
}

// ===== 1. Update subsidy data — add 申请编号, 节点信息 =====
replaceBetween(
  'const subsidy = reactive([',
  '])',
`const subsidy = reactive([
  { id:11, appNo:'SB20260615001', name:'王友德', type:'耕地地力保护补贴', amount:6200, status:'已发放', date:'2026-06-15', node:'已发放', nodes:['已提交','村级初审','乡镇审核','部门复核','待发放','已发放'], currentNodeIdx:5 },
  { id:12, appNo:'SB20260720002', name:'王友德', type:'农机购置补贴', amount:5000, status:'审核中', date:'2026-07-20', node:'乡镇审核', nodes:['已提交','村级初审','乡镇审核','部门复核','待发放','已发放'], currentNodeIdx:2 },
  { id:13, appNo:'SB20260701003', name:'王友德', type:'低保补助', amount:3600, status:'发放中', date:'2026-07-01', node:'待发放', nodes:['已提交','村级初审','乡镇审核','部门复核','待发放','已发放'], currentNodeIdx:4 }
]`
);

// ===== 2. Update template: 我的申请 table =====
replaceBetween(
  '<div class="section-card" style="margin-top:14px">\n            <div class="section-title">📄 我的申请</div>\n            <table class="data-table">\n              <thead><tr><th>补贴类型</th><th>金额</th><th>申请日期</th><th>状态</th><th>进度</th></tr></thead>\n              <tbody>\n                <tr v-for="r in subsidy" :key="r.id">\n                  <td>{{ r.type }}</td>\n                  <td style="color:#28C76F;font-family:monospace">&yen;{{ Number(r.amount).toLocaleString() }}</td>\n                  <td>{{ r.date }}</td>\n                  <td><span class="tag" :class="r.status===\'已发放\'?\'g\':r.status===\'审核中\'?\'y\':\'b\'">{{ r.status }}</span></td>\n                  <td><div class="progress-bar" style="width:80px"><div class="fill" :class="r.status===\'已发放\'?\'g\':\'y\'" :style="{width:(r.progress||\'50%\')}"></div></div></td>\n                </tr>\n              </tbody>\n            </table>\n          </div>',
  '<!-- Elderly:',
`<div class="section-card" style="margin-top:14px">
            <div class="section-title">📄 我的申请</div>
            <table class="data-table">
              <thead><tr><th>申请编号</th><th>补贴类型</th><th>金额</th><th>申请日期</th><th>状态</th><th>进度</th><th>操作</th></tr></thead>
              <tbody>
                <tr v-for="r in subsidy" :key="r.id">
                  <td style="font-family:monospace;font-size:11px">{{ r.appNo }}</td>
                  <td>{{ r.type }}</td>
                  <td style="color:#28C76F;font-family:monospace">&yen;{{ Number(r.amount).toLocaleString() }}</td>
                  <td>{{ r.date }}</td>
                  <td><span class="tag" :class="r.status==='已发放'?'g':r.status==='审核中'?'y':r.status==='发放中'?'b':'dim'">{{ r.status }}</span></td>
                  <td><div class="progress-bar" style="width:80px"><div class="fill" :class="r.status==='已发放'?'g':'y'" :style="{width:(r.currentNodeIdx/r.nodes.length*100)+'%'}"></div></div></td>
                  <td>
                    <button class="btn btn-p btn-s" @click="showSubsidyDetail(r)" style="font-size:10px;padding:3px 8px;margin-right:3px">查看详情</button>
                    <button v-if="r.status==='审核中'" class="btn btn-d btn-s" @click="withdrawSubsidy(r)" style="font-size:10px;padding:3px 8px">撤回</button>
                    <button v-if="r.status==='需补材料'" class="btn btn-y btn-s" @click="supplementSubsidy(r)" style="font-size:10px;padding:3px 8px">补充材料</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>`
);

// ===== 3. Update subsidy KPI cards — dynamic computation =====
replaceBetween(
  "if (key === 'subsidy') {\n    const ing = subsidy.filter(s=>s.status!=='已发放').length\n    const done = subsidy.filter(s=>s.status==='已发放').length\n    const total = subsidy.reduce((s,r)=>s+Number(r.amount),0)\n    return [\n      { icon:'📋', value:availableSubsidies.length+'项', label:'可申请补贴', color:'g' },\n      { icon:'⏳', value:ing+'项', label:'申请中', color:'y' },\n      { icon:'✅', value:done+'项', label:'已发放', color:'b' },\n      { icon:'💰', value:'¥'+total.toLocaleString(), label:'累计获得', color:'p' }\n    ]\n  }",
  "if (key === 'elderly') {"
);
// Replace the end marker approach - put the new code before elderly
const elderlyIdx = s.indexOf("if (key === 'elderly') {");
const newKpiCode = `if (key === 'subsidy') {
    const ing = subsidy.filter(s=>s.status==='审核中'||s.status==='发放中').length
    const done = subsidy.filter(s=>s.status==='已发放').length
    const total = subsidy.reduce((s,r)=>s+Number(r.amount),0)
    return [
      { icon:'📋', value:availableSubsidies.length+'项', label:'可申请补贴', color:'g' },
      { icon:'⏳', value:ing+'项', label:'申请中', color:'y' },
      { icon:'✅', value:done+'项', label:'已发放', color:'b' },
      { icon:'💰', value:'¥'+total.toLocaleString(), label:'累计获得', color:'p' }
    ]
  }
  `;
s = s.substring(0, elderlyIdx - 1) + newKpiCode + s.substring(elderlyIdx);

// ===== 4. Replace applySubsidy and confirmApply with 4 separate form functions =====
replaceBetween(
  'function applySubsidy(s){',
  'function showSubsidyApply(){',
`
// ===== 4 SEPARATE SUBSIDY APPLICATION FORMS =====
function showLandSubsidyForm(){
  const r=subsidy[0]||{name:'王友德'}
  let h='<div class="svc-self-badge">👤 申请人信息 — 从当前登录账户自动带出</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>申请人</label><input value="'+r.name+'" readonly class="svc-self-field"></div><div class="svc-fld"><label>身份证号</label><input value="610***********0034" readonly class="svc-self-field"></div></div>'
  h+='<div class="svc-fld"><label>所属村</label><input value="汉滨区大同镇王家村" readonly class="svc-self-field"></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="mod-section-title">📋 耕地信息</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>承包/确权耕地面积（亩） <span style="color:#E74C3C">*</span></label><input id="land_area" type="number" step="0.01" placeholder="请输入确权面积"></div><div class="svc-fld"><label>申报补贴面积（亩） <span style="color:#E74C3C">*</span></label><input id="land_apply_area" type="number" step="0.01" placeholder="请输入申报面积" oninput="window._svc.calcLandAmount()"></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>补贴标准</label><input value="¥120/亩" readonly class="svc-self-field"></div><div class="svc-fld"><label>预计补贴金额</label><input id="land_est_amount" value="¥0" readonly style="color:#28C76F;font-weight:700;font-size:14px"></div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="mod-section-title">📎 材料上传</div>'
  h+='<div style="font-size:10px;color:#50738A;margin-bottom:12px">支持 JPG、PNG、PDF 格式，单个文件不超过 10MB</div>'
  h+='<div class="svc-upload-row"><button type="button" class="svc-upload-btn" onclick="window._svc.triggerLandProofUpload()">📄 上传土地确权/承包证明</button><span id="land_proof_status"></span></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="svc-fld"><label>备注</label><textarea id="land_note" placeholder="选填说明"></textarea></div>'
  h+='<div class="svc-form-actions"><button class="svc-btn svc-btn-primary" onclick="window._svc.submitLandSubsidy()">📤 提交申请</button><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()">取消</button></div>'
  opMod('🌾 耕地地力保护补贴申请',h,'mod-lg')
}
function calcLandAmount(){
  const area=parseFloat(document.getElementById('land_apply_area')?.value)||0
  const el=document.getElementById('land_est_amount');if(el)el.value='¥'+(area*120).toLocaleString()
}
function submitLandSubsidy(){
  const area=document.getElementById('land_apply_area')?.value
  const certArea=document.getElementById('land_area')?.value
  if(!certArea||!area||parseFloat(area)<=0){toast('请填写必填字段（带 * 号）','warn');return}
  const amt=Math.round(parseFloat(area)*120)
  const now=new Date();const appNo='SB'+now.getFullYear()+String(now.getMonth()+1).padStart(2,'0')+String(now.getDate()).padStart(2,'0')+String(Math.floor(Math.random()*900+100))
  subsidy.unshift({id:uid(),appNo,name:'王友德',type:'耕地地力保护补贴',amount:amt,status:'审核中',date:now.toISOString().split('T')[0],node:'已提交',nodes:['已提交','村级初审','乡镇审核','部门复核','待发放','已发放'],currentNodeIdx:0})
  clsMod();toast('申请已提交！编号：'+appNo,'ok')
}
function showMachineSubsidyForm(){
  const r=subsidy[0]||{name:'王友德'}
  let h='<div class="svc-self-badge">👤 申请人信息 — 从当前登录账户自动带出</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>申请人</label><input value="'+r.name+'" readonly class="svc-self-field"></div><div class="svc-fld"><label>身份证号</label><input value="610***********0034" readonly class="svc-self-field"></div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="mod-section-title">🚜 机具信息</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>农机类别 <span style="color:#E74C3C">*</span></label><select id="mc_type"><option value="">请选择</option><option>拖拉机</option><option>收割机</option><option>插秧机</option><option>播种机</option><option>植保机械</option></select></div><div class="svc-fld"><label>机具名称 <span style="color:#E74C3C">*</span></label><input id="mc_name" placeholder="如：东方红LX1504"></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>生产厂家</label><input id="mc_mfr" placeholder="如：中国一拖"></div><div class="svc-fld"><label>型号</label><input id="mc_model" placeholder="如：LX1504"></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>购机日期 <span style="color:#E74C3C">*</span></label><div class="svc-date-wrap" onclick="var d=this.querySelector(\'input[type=date]\');d.showPicker?d.showPicker():d.focus()"><input type="text" placeholder="请选择日期" readonly><input type="date" id="mc_date" onchange="var t=this.parentElement.querySelector(\'input[type=text]\');t.value=this.value;this.parentElement.classList.toggle(\'has-val\',!!this.value)"></div></div><div class="svc-fld"><label>购机价格（元） <span style="color:#E74C3C">*</span></label><input id="mc_price" type="number" step="0.01" placeholder="0.00" oninput="window._svc.calcMachineAmount()"></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>补贴比例</label><input value="35%" readonly class="svc-self-field"></div><div class="svc-fld"><label>预计补贴金额</label><input id="mc_est_amount" value="¥0" readonly style="color:#28C76F;font-weight:700;font-size:14px"></div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="mod-section-title">📎 材料上传</div>'
  h+='<div style="font-size:10px;color:#50738A;margin-bottom:12px">支持 JPG、PNG、PDF 格式，单个文件不超过 10MB</div>'
  h+='<div class="svc-upload-row"><button type="button" class="svc-upload-btn" onclick="window._svc.triggerInvoiceUpload()">📄 上传购机发票</button><span id="rb_invoice_status"></span></div>'
  h+='<div class="svc-upload-row" style="margin-top:8px"><button type="button" class="svc-upload-btn" onclick="window._svc.triggerDiagnosisUpload()">🪪 上传身份证明</button><span id="rb_diag_status"></span></div>'
  h+='<div class="svc-upload-row" style="margin-top:8px"><button type="button" class="svc-upload-btn" onclick="window._svc.toast(\'机具照片上传功能已触发\',\'info\')">📷 上传机具照片</button><span></span></div>'
  h+='<div class="svc-form-actions"><button class="svc-btn svc-btn-primary" onclick="window._svc.submitMachineSubsidy()">📤 提交申请</button><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()">取消</button></div>'
  opMod('🚜 农机购置补贴申请',h,'mod-lg')
}
function calcMachineAmount(){
  const price=parseFloat(document.getElementById('mc_price')?.value)||0
  const el=document.getElementById('mc_est_amount');if(el)el.value='¥'+Math.round(price*0.35).toLocaleString()
}
function submitMachineSubsidy(){
  const type=document.getElementById('mc_type')?.value
  const name=document.getElementById('mc_name')?.value
  const date=document.getElementById('mc_date')?.value
  const price=document.getElementById('mc_price')?.value
  if(!type||!name||!date||!price||parseFloat(price)<=0){toast('请填写必填字段（带 * 号）','warn');return}
  const amt=Math.round(parseFloat(price)*0.35)
  const now=new Date();const appNo='SB'+now.getFullYear()+String(now.getMonth()+1).padStart(2,'0')+String(now.getDate()).padStart(2,'0')+String(Math.floor(Math.random()*900+100))
  subsidy.unshift({id:uid(),appNo,name:'王友德',type:'农机购置补贴',amount:amt,status:'审核中',date:now.toISOString().split('T')[0],node:'已提交',nodes:['已提交','村级初审','乡镇审核','部门复核','待发放','已发放'],currentNodeIdx:0})
  clsMod();toast('申请已提交！编号：'+appNo,'ok')
}
function showDibaoForm(){
  const r=subsidy[0]||{name:'王友德'}
  let h='<div class="svc-self-badge">👤 申请人信息 — 从当前登录账户自动带出</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>申请人</label><input value="'+r.name+'" readonly class="svc-self-field"></div><div class="svc-fld"><label>身份证号</label><input value="610***********0034" readonly class="svc-self-field"></div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="mod-section-title">👨‍👩‍👧 家庭信息</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>家庭人口 <span style="color:#E74C3C">*</span></label><input id="db_pop" type="number" placeholder="如：4" oninput="window._svc.calcDibaoIncome()"></div><div class="svc-fld"><label>家庭月收入（元） <span style="color:#E74C3C">*</span></label><input id="db_month_income" type="number" step="0.01" placeholder="0.00" oninput="window._svc.calcDibaoIncome()"></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>家庭年收入（元）</label><input id="db_year_income" placeholder="自动计算" readonly></div><div class="svc-fld"><label>家庭人均收入（元/月）</label><input id="db_per_capita" placeholder="自动计算" readonly></div></div>'
  h+='<div class="svc-self-badge" style="margin-top:8px">💡 补助标准参考：家庭人均月收入低于当地低保标准（约 ¥600/月），可申请低保补助。实际补助金额以民政部门审核结果为准。</div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="svc-fld"><label>困难情况说明 <span style="color:#E74C3C">*</span></label><textarea id="db_reason" placeholder="请详细说明家庭困难情况"></textarea></div>'
  h+='<div class="svc-fld"><label>家庭成员信息 <span style="color:#E74C3C">*</span></label><textarea id="db_members" placeholder="姓名、与申请人关系、年龄、收入情况等"></textarea></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="mod-section-title">📎 材料上传</div>'
  h+='<div style="font-size:10px;color:#50738A;margin-bottom:12px">支持 JPG、PNG、PDF 格式，单个文件不超过 10MB</div>'
  h+='<div class="svc-upload-row"><button type="button" class="svc-upload-btn" onclick="window._svc.triggerDiagnosisUpload()">🪪 上传身份证明</button><span id="rb_diag_status"></span></div>'
  h+='<div class="svc-upload-row" style="margin-top:8px"><button type="button" class="svc-upload-btn" onclick="window._svc.toast(\'收入证明上传功能已触发\',\'info\')">📄 上传收入证明</button><span></span></div>'
  h+='<div class="svc-upload-row" style="margin-top:8px"><button type="button" class="svc-upload-btn" onclick="window._svc.toast(\'困难证明上传功能已触发\',\'info\')">📋 上传困难证明材料</button><span></span></div>'
  h+='<div class="svc-form-actions"><button class="svc-btn svc-btn-primary" onclick="window._svc.submitDibao()">📤 提交申请</button><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()">取消</button></div>'
  opMod('💰 低保补助申请',h,'mod-lg')
}
function calcDibaoIncome(){
  const pop=parseInt(document.getElementById('db_pop')?.value)||0
  const monthInc=parseFloat(document.getElementById('db_month_income')?.value)||0
  const yearEl=document.getElementById('db_year_income');if(yearEl)yearEl.value='¥'+(monthInc*12).toLocaleString()
  const perEl=document.getElementById('db_per_capita');if(perEl)perEl.value=pop>0?'¥'+Math.round(monthInc/pop).toLocaleString()+'/月':'自动计算'
}
function submitDibao(){
  const pop=document.getElementById('db_pop')?.value
  const inc=document.getElementById('db_month_income')?.value
  const reason=document.getElementById('db_reason')?.value
  const members=document.getElementById('db_members')?.value
  if(!pop||!inc||!reason||!members){toast('请填写必填字段（带 * 号）','warn');return}
  const now=new Date();const appNo='SB'+now.getFullYear()+String(now.getMonth()+1).padStart(2,'0')+String(now.getDate()).padStart(2,'0')+String(Math.floor(Math.random()*900+100))
  subsidy.unshift({id:uid(),appNo,name:'王友德',type:'低保补助',amount:3600,status:'审核中',date:now.toISOString().split('T')[0],node:'已提交',nodes:['已提交','村级初审','乡镇审核','部门复核','待发放','已发放'],currentNodeIdx:0})
  clsMod();toast('申请已提交！编号：'+appNo,'ok')
}
function showBizSubsidyForm(){
  const r=subsidy[0]||{name:'王友德'}
  let h='<div class="svc-self-badge">👤 申请人信息 — 从当前登录账户自动带出</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>申请人</label><input value="'+r.name+'" readonly class="svc-self-field"></div><div class="svc-fld"><label>身份证号</label><input value="610***********0034" readonly class="svc-self-field"></div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="mod-section-title">🏪 创业信息</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>创业主体名称 <span style="color:#E74C3C">*</span></label><input id="biz_name" placeholder="如：王家村农家乐"></div><div class="svc-fld"><label>统一社会信用代码 <span style="color:#E74C3C">*</span></label><input id="biz_code" placeholder="如：92610902MA..."></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>创业时间 <span style="color:#E74C3C">*</span></label><div class="svc-date-wrap" onclick="var d=this.querySelector(\'input[type=date]\');d.showPicker?d.showPicker():d.focus()"><input type="text" placeholder="请选择日期" readonly><input type="date" id="biz_start_date" onchange="var t=this.parentElement.querySelector(\'input[type=text]\');t.value=this.value;this.parentElement.classList.toggle(\'has-val\',!!this.value)"></div></div><div class="svc-fld"><label>经营地址 <span style="color:#E74C3C">*</span></label><input id="biz_addr" placeholder="如：汉滨区大同镇王家村2组"></div></div>'
  h+='<div class="svc-fld"><label>经营项目 <span style="color:#E74C3C">*</span></label><textarea id="biz_project" placeholder="请描述经营项目内容"></textarea></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>申请金额（元） <span style="color:#E74C3C">*</span></label><input id="biz_amount" type="number" step="100" placeholder="不超过8000元"></div><div class="svc-fld"><label>收款账户 <span style="color:#E74C3C">*</span></label><input id="biz_account" placeholder="银行账号"></div></div>'
  h+='<div class="svc-self-badge" style="margin-top:8px">💡 政策提示：首次创业6个月内可申请创业补贴，最高 ¥8,000。实际补助金额以人社部门审核结果为准。</div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="mod-section-title">📎 材料上传</div>'
  h+='<div style="font-size:10px;color:#50738A;margin-bottom:12px">支持 JPG、PNG、PDF 格式，单个文件不超过 10MB</div>'
  h+='<div class="svc-upload-row"><button type="button" class="svc-upload-btn" onclick="window._svc.toast(\'营业执照上传功能已触发\',\'info\')">📄 上传营业执照</button><span></span></div>'
  h+='<div class="svc-upload-row" style="margin-top:8px"><button type="button" class="svc-upload-btn" onclick="window._svc.triggerDiagnosisUpload()">🪪 上传身份证明</button><span id="rb_diag_status"></span></div>'
  h+='<div class="svc-upload-row" style="margin-top:8px"><button type="button" class="svc-upload-btn" onclick="window._svc.toast(\'证明材料上传功能已触发\',\'info\')">📋 上传相关证明材料</button><span></span></div>'
  h+='<div class="svc-form-actions"><button class="svc-btn svc-btn-primary" onclick="window._svc.submitBizSubsidy()">📤 提交申请</button><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()">取消</button></div>'
  opMod('🏪 创业补贴申请',h,'mod-lg')
}
function submitBizSubsidy(){
  const name=document.getElementById('biz_name')?.value
  const code=document.getElementById('biz_code')?.value
  const date=document.getElementById('biz_start_date')?.value
  const addr=document.getElementById('biz_addr')?.value
  const project=document.getElementById('biz_project')?.value
  const amount=document.getElementById('biz_amount')?.value
  const account=document.getElementById('biz_account')?.value
  if(!name||!code||!date||!addr||!project||!amount||!account){toast('请填写必填字段（带 * 号）','warn');return}
  const amt=Math.min(parseInt(amount)||0,8000)
  const now=new Date();const appNo='SB'+now.getFullYear()+String(now.getMonth()+1).padStart(2,'0')+String(now.getDate()).padStart(2,'0')+String(Math.floor(Math.random()*900+100))
  subsidy.unshift({id:uid(),appNo,name:'王友德',type:'创业补贴',amount:amt,status:'审核中',date:now.toISOString().split('T')[0],node:'已提交',nodes:['已提交','村级初审','乡镇审核','部门复核','待发放','已发放'],currentNodeIdx:0})
  clsMod();toast('申请已提交！编号：'+appNo,'ok')
}
function applySubsidy(s){
  if(s.name==='耕地地力保护补贴'){showLandSubsidyForm();return}
  if(s.name==='农机购置补贴'){showMachineSubsidyForm();return}
  if(s.name==='低保补助'){showDibaoForm();return}
  if(s.name==='创业补贴'){showBizSubsidyForm();return}
}
`
);

// ===== 5. Replace showSubsidyApply with 4-item list routing to separate forms =====
replaceBetween(
  'function showSubsidyApply(){',
  'function enrollCourse(c){',
`function showSubsidyApply(){
  let h='<div class="mod-desc">选择您要申请的补贴类型，进入对应申请表单</div>'
  const items=[
    {name:'耕地地力保护补贴',desc:'拥有耕地承包权的农户',amount:'¥120/亩',icon:'🌾',fn:'window._svc.showLandSubsidyForm()'},
    {name:'农机购置补贴',desc:'新购农机具补贴',amount:'购机价35%',icon:'🚜',fn:'window._svc.showMachineSubsidyForm()'},
    {name:'低保补助',desc:'家庭人均收入低于标准',amount:'¥300/月',icon:'💰',fn:'window._svc.showDibaoForm()'},
    {name:'创业补贴',desc:'首次创业6个月内',amount:'最高¥8,000',icon:'🏪',fn:'window._svc.showBizSubsidyForm()'}
  ]
  items.forEach(s=>{
    h+='<div class="svc-sub-list-item" onclick="'+s.fn+'"><div class="svc-sub-list-icon">'+s.icon+'</div><div class="svc-sub-list-info"><div class="svc-sub-list-name">'+s.name+'</div><div class="svc-sub-list-desc">'+s.desc+'</div></div><div class="svc-sub-list-amount">'+s.amount+'</div><div style="color:#28C7FA;margin-left:8px;flex-shrink:0">申请 ▶</div></div>'
  })
  opMod('📝 申请补贴',h,'mod-md')
}
`
);

// ===== 6. Replace showSubsidyProgress =====
replaceBetween(
  'function showSubsidyProgress(){',
  'function downloadPolicy(){',
`function showSubsidyProgress(){
  if(subsidy.length===0){opMod('🔍 补贴进度查询','<div style="color:#6F91A8;text-align:center;padding:30px 0">暂无申请记录</div>','mod-sm');return}
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
  opMod('🔍 补贴进度查询',h,'mod-lg')
}
`
);

// ===== 7. Replace downloadPolicy with showPolicyQuery =====
replaceBetween(
  'function downloadPolicy(){',
  'function emergencyCall(){',
`function showPolicyQuery(){
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
  h+='<div style="text-align:center;margin-top:16px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.downloadPolicyFile()" style="flex:none;width:auto">📥 下载完整政策文件（PDF）</button></div>'
  opMod('📜 惠农补贴政策',h,'mod-lg')
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
  h+='<div style="text-align:center;margin-top:16px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.downloadPolicyFile()" style="flex:none;width:auto">📥 下载该政策文件（PDF）</button></div>'
  opMod('📜 '+p.type+' — 政策详情',h,'mod-md')
}
function downloadPolicyFile(){
  toast('政策文件（PDF）已开始下载','ok')
}
`
);

// ===== 8. Replace downloadTemplate with showMaterialDownload =====
replaceBetween(
  'function downloadTemplate(){',
  '// =====',
`function showMaterialDownload(){
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
      h+='<div class="svc-dl-item"><div><span style="color:#D0E4F5;font-size:12px">📄 '+f.name+'</span><span class="svc-dl-fmt">'+f.fmt+'</span></div><button class="svc-btn svc-btn-secondary" style="flex:none;width:auto;height:32px;padding:0 14px;font-size:11px" onclick="window._svc.downloadMaterial(\''+f.name+'.'+f.fmt.toLowerCase()+'\')">⬇ 下载</button></div>'
    })
    h+='</div>'
  })
  opMod('📥 材料模板下载',h,'mod-lg')
}
function downloadMaterial(filename){
  toast('正在下载：'+filename,'ok')
}
`
);

// ===== 9. Add showSubsidyDetail, withdrawSubsidy, supplementSubsidy functions =====
// Insert before the chart section
replaceBetween(
  '// Watch tab changes',
  'watch(curTab,async()=>{await nextTick();setTimeout(()=>{initCurrentChart();if(chartInstance)chartInstance.resize()},200)})',
`function showSubsidyDetail(r){
  let h='<div class="svc-result-card">'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">申请编号</span><span class="svc-rc-value" style="font-family:monospace">'+r.appNo+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">补贴类型</span><span class="svc-rc-value">'+r.type+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">申请日期</span><span class="svc-rc-value">'+r.date+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">申请金额</span><span class="svc-rc-value" style="color:#28C76F;font-weight:600">&yen;'+Number(r.amount).toLocaleString()+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">当前状态</span><span class="svc-rc-value">'+r.status+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">当前节点</span><span class="svc-rc-value" style="color:#28C7FA">'+r.node+'</span></div>'
  h+='</div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="mod-section-title">📋 审批进度</div>'
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
  opMod('📋 申请详情 — '+r.type,h,'mod-md')
}
function withdrawSubsidy(r){
  if(confirm('确认撤回申请 '+r.appNo+'？')){const idx=subsidy.findIndex(s=>s.id===r.id);if(idx!==-1)subsidy.splice(idx,1);toast('申请已撤回','ok');clsMod()}
}
function supplementSubsidy(r){
  toast('材料补充功能已打开，请上传补充材料\n申请编号：'+r.appNo,'info')
}

// Watch tab changes
`
);

// ===== 10. Update subsidy pie chart — shorter height, center text, legend =====
replaceBetween(
  'function initSubPieChart(){',
  'function initElderChart(){',
`function initSubPieChart(){
  const el=document.getElementById('chart_sub_pie');if(!el)return;chartInstance=echarts.init(el)
  const total=subsidy.reduce((s,r)=>s+Number(r.amount),0)
  chartInstance.setOption({
    title:{text:'补贴构成',textStyle:{color:'#6b7a8d',fontSize:11,fontWeight:400},left:0,top:-6},
    tooltip:{trigger:'item',backgroundColor:'rgba(7,27,45,0.95)',borderColor:'rgba(14,165,233,0.30)',textStyle:{color:'#D0E4F5',fontSize:11},formatter:'{b}: ¥{c} ({d}%)'},
    legend:{orient:'vertical',right:10,top:'middle',textStyle:{color:'#6F91A8',fontSize:10},itemWidth:10,itemHeight:10,itemGap:12},
    series:[
      {type:'pie',radius:['55%','72%'],center:['35%','50%'],itemStyle:{borderColor:'rgba(8,28,58,0.92)',borderWidth:2},label:{show:false},emphasis:{label:{show:true,fontSize:14,fontWeight:'bold'}},
       data:[
         {value:subsidy.find(s=>s.type.includes('耕地'))?.amount||0,name:'耕地补贴',itemStyle:{color:'#28C7FA'}},
         {value:subsidy.find(s=>s.type.includes('农机'))?.amount||0,name:'农机补贴',itemStyle:{color:'#39D98A'}},
         {value:subsidy.find(s=>s.type.includes('低保'))?.amount||0,name:'低保补助',itemStyle:{color:'#f59e0b'}},
         {value:subsidy.find(s=>s.type.includes('创业'))?.amount||0,name:'创业补贴',itemStyle:{color:'#a78bfa'}}
       ].filter(d=>d.value>0)
      },
      {type:'pie',radius:['0%','0%'],center:['35%','50%'],label:{show:true,position:'center',formatter:'累计获得\\n¥{c}',fontSize:12,color:'#D0E4F5',lineHeight:18},data:[{value:total,name:''}]}
    ]
  })
}
`
);

// ===== 11. Update chart block height for subsidy =====
s = s.replace(
  `<div class="chart-block" v-if="curTab==='subsidy'"><div id="chart_sub_pie" style="width:100%;height:200px"></div></div>`,
  `<div class="chart-block chart-block-sm" v-if="curTab==='subsidy'"><div id="chart_sub_pie" style="width:100%;height:180px"></div></div>`
);

// ===== 12. Add CSS for new subsidy components =====
// Find the end of unscoped style block (right before scoped style)
const styleEndMarker = `/* Uploaded file status */
.svc-modal .svc-uploaded-file { color:#D0E4F5; font-size:11px; }`;
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
s = s.replace(styleEndMarker, styleEndMarker + newCss);

// ===== 13. Update window._svc with new functions =====
replaceBetween(
  'window._svc={clsMod,queryBalance,submitReimburse,confirmReg,sendReport,confirmTelemed,enterRoom,confirmAppt,confirmApply,saveAlert,submitRemote,triggerInvoiceUpload,triggerDiagnosisUpload,filterPayments,applyFromList:',
  ',enrollFromList:',
  ',showLandSubsidyForm,showMachineSubsidyForm,showDibaoForm,showBizSubsidyForm,calcLandAmount,calcMachineAmount,calcDibaoIncome,submitLandSubsidy,submitMachineSubsidy,submitDibao,submitBizSubsidy,showSubsidyApply,showSubsidyProgress,showPolicyQuery,showMaterialDownload,downloadMaterial,downloadPolicyFile,showPolicyDetail,showSubsidyDetail,withdrawSubsidy,supplementSubsidy,applyFromList:'
);
// Also replace the old confirmApply reference
s = s.replace(',confirmApply,', ',');

// ===== 14. Update quick actions for subsidy =====
replaceBetween(
  "if (key === 'subsidy') return [\n    { icon:'📝', label:'申请补贴', action: showSubsidyApply },\n    { icon:'🔍', label:'进度查询', action: showSubsidyProgress },\n    { icon:'📜', label:'政策查询', action: downloadPolicy },\n    { icon:'📥', label:'材料下载', action: downloadTemplate }\n  ]",
  "if (key === 'elderly') return [",
  ''
);
// Rebuild the quick actions section
const qaSubsidyNew = `if (key === 'subsidy') return [
    { icon:'📝', label:'申请补贴', action: showSubsidyApply },
    { icon:'🔍', label:'进度查询', action: showSubsidyProgress },
    { icon:'📜', label:'政策查询', action: showPolicyQuery },
    { icon:'📥', label:'材料下载', action: showMaterialDownload }
  ]
  `;
const qaElderlyIdx = s.indexOf("if (key === 'elderly') return [");
s = s.substring(0, qaElderlyIdx - 1) + qaSubsidyNew + s.substring(qaElderlyIdx);

// ===== 15. Update the subsidy cards onclick to use the applySubsidy router =====
// The template already calls applySubsidy(s) which routes to the right form

fs.writeFileSync(fp, s, 'utf-8');
console.log('Done. File length:', s.length, 'chars');
