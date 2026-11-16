// Major refactor: Appointment tab — structured data, step-by-step booking, persistence, proper guides
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/ServicePage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ==================================================================================
// PART 1: Replace appointment data layer with structured services + persistent appointments
// ==================================================================================
const oldApptData = `const appointment = reactive([
  { id: 61, name: '王友德', type: '证件办理', item: '身份证换领', date: '2026-08-12', time: '09:30', status: '已预约', office: '户籍窗口' },
  { id: 62, name: '王友德', type: '补贴申请', item: '耕地补贴咨询', date: '2026-08-15', time: '14:00', status: '已预约', office: '农业窗口' },
  { id: 63, name: '王友德', type: '证明开具', item: '农业用地证明', date: '2026-07-20', time: '10:00', status: '已完成', office: '综合窗口' }
])`;

const newApptData = `// Government service catalog (item → window mapping)
const governmentServices = [
  { id:'S1', name:'身份证换领', category:'证件办理', window:'户籍窗口', duration:'30分钟', guide:'请携带原身份证、户口本原件及近期一寸免冠照片2张，本人前往户籍窗口办理。办理时限：15个工作日。咨询电话：12345。', materials:[{name:'身份证换领申请表',fmt:'PDF'},{name:'证件照要求说明',fmt:'PDF'}] },
  { id:'S2', name:'户口相关业务', category:'证件办理', window:'户籍窗口', duration:'30分钟', guide:'户口迁移、登记、注销等业务请携带相关证明材料。具体材料清单请查看材料模板。咨询电话：12345。', materials:[{name:'户口迁移申请表',fmt:'DOCX'},{name:'亲属关系证明模板',fmt:'DOCX'}] },
  { id:'S3', name:'耕地补贴咨询', category:'补贴申请', window:'农业窗口', duration:'20分钟', guide:'请携带土地承包经营权证、身份证原件。补贴标准以县级农业农村部门核定为准，通过惠民"一卡通"发放。咨询电话：12345。', materials:[{name:'耕地补贴申请表',fmt:'DOCX'},{name:'土地承包证明模板',fmt:'DOCX'}] },
  { id:'S4', name:'农业用地证明', category:'证明开具', window:'综合窗口', duration:'15分钟', guide:'请携带土地承包合同或村委会证明、身份证原件。办理时限：3个工作日。', materials:[{name:'农业用地证明申请表',fmt:'DOCX'},{name:'村委会证明模板',fmt:'DOCX'}] },
  { id:'S5', name:'低保业务咨询', category:'补贴申请', window:'综合窗口', duration:'20分钟', guide:'请携带身份证、户口本、收入证明等材料。低保标准根据当地政策执行，具体请咨询窗口工作人员。', materials:[{name:'低保申请表',fmt:'DOCX'},{name:'家庭收入申报表',fmt:'DOCX'}] },
  { id:'S6', name:'养老认证咨询', category:'其他', window:'综合窗口', duration:'15分钟', guide:'城乡居民养老保险待遇领取资格认证，每年一次。请携带身份证和社保卡。也可通过"陕西养老保险"APP自助认证。', materials:[{name:'养老认证操作指南',fmt:'PDF'}] }
]

// Appointments (persisted to localStorage)
const APPT_STORAGE_KEY = 'svc_appointments'
function loadPersistedAppointments() {
  try { const raw = localStorage.getItem(APPT_STORAGE_KEY); return raw ? JSON.parse(raw) : [] }
  catch(e) { return [] }
}
function persistAppointments() {
  localStorage.setItem(APPT_STORAGE_KEY, JSON.stringify(appointment))
}
const appointment = reactive((()=>{
  const saved = loadPersistedAppointments()
  if (saved.length > 0) return saved
  return [
    { id:61, serviceId:'S1', serviceName:'身份证换领', name:'王友德', phone:'138****5432', village:'中堰村', window:'户籍窗口', date:'2026-08-12', time:'09:30', status:'已预约', apptNo:'AP20260812001', createdAt:'2026-08-10' },
    { id:62, serviceId:'S3', serviceName:'耕地补贴咨询', name:'王友德', phone:'138****5432', village:'中堰村', window:'农业窗口', date:'2026-08-15', time:'14:00', status:'已预约', apptNo:'AP20260815001', createdAt:'2026-08-12' },
    { id:63, serviceId:'S4', serviceName:'农业用地证明', name:'王友德', phone:'138****5432', village:'中堰村', window:'综合窗口', date:'2026-07-20', time:'10:00', status:'已完成', apptNo:'AP20260720001', createdAt:'2026-07-18' }
  ]
})())
// Update uidCounter for persisted data
;(()=>{ const maxId = Math.max(...appointment.map(a=>a.id), 0); if (maxId >= uidCounter) uidCounter = maxId })()

// Time slot generation helper
function getAvailableSlots(windowName, dateStr) {
  const slots = []
  const hours = [{start:9,end:12},{start:14,end:17}]
  for (const block of hours) {
    for (let h = block.start; h < block.end; h++) {
      for (let m = 0; m < 60; m += 30) {
        const time = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0')
        const booked = appointment.some(a => a.window === windowName && a.date === dateStr && a.time === time && a.status !== '已取消')
        slots.push({ time, available: !booked })
      }
    }
  }
  return slots
}

function getServiceById(id) { return governmentServices.find(s => s.id === id) }`;

if (s.includes(oldApptData)) { s = s.replace(oldApptData, newApptData); check('1-appt-data-layer', true); }
else { check('1-appt-data-layer', false); }

// ==================================================================================
// PART 2: Update KPI cards for appointment — dynamic counts
// ==================================================================================
const oldKpiAppt = `  if (key === 'appointment') {
    const done = appointment.filter(a=>a.status==='已完成').length
    const pending = appointment.filter(a=>a.status==='已预约').length
    return [
      { icon:'\\u{1F4CB}', value:'6项', label:'可办事项', color:'g' },
      { icon:'\\u{1F4C5}', value:pending+'项', label:'已预约', color:'b' },
      { icon:'✅', value:done+'项', label:'已办理', color:'y' },
      { icon:'\\u{2B50}', value:'1项', label:'待评价', color:'p' }
    ]
  }`;

const newKpiAppt = `  if (key === 'appointment') {
    const pending = appointment.filter(a=>a.status==='已预约').length
    const done = appointment.filter(a=>a.status==='已完成').length
    const inProgress = appointment.filter(a=>a.status==='待办理'||a.status==='办理中').length
    return [
      { icon:'\\u{1F4CB}', value:governmentServices.length+'项', label:'可办事项', color:'g' },
      { icon:'\\u{1F4C5}', value:pending+'项', label:'已预约', color:'b' },
      { icon:'✅', value:done+'项', label:'已办理', color:'y' },
      { icon:'\\u{23F3}', value:inProgress+'项', label:'办理中', color:'p' }
    ]
  }`;

if (s.includes(oldKpiAppt)) { s = s.replace(oldKpiAppt, newKpiAppt); check('2-kpi-appt', true); }
else { check('2-kpi-appt', false); }

// ==================================================================================
// PART 3: Rewrite showApptForm — step-by-step booking flow
// ==================================================================================
const oldShowApptForm = `function showApptForm(){
  let h='<div class="fld"><label>姓名</label><input id="ap_name"></div>'
  h+='<div style="display:flex;gap:10px"><div class="fld" style="flex:1"><label>业务类型</label><select id="ap_type"><option>证件办理</option><option>补贴申请</option><option>证明开具</option></select></div><div class="fld" style="flex:1"><label>窗口</label><select id="ap_office"><option>户籍窗口</option><option>农业窗口</option><option>综合窗口</option></select></div></div>'
  h+='<div class="fld"><label>具体事项</label><input id="ap_item"></div>'
  h+='<div style="display:flex;gap:10px"><div class="fld" style="flex:1"><label>日期</label><input id="ap_date" type="date"></div><div class="fld" style="flex:1"><label>时间</label><input id="ap_time" type="time"></div></div>'
  h+='<button class="btn btn-p" style="margin-top:8px" onclick="window._svc.confirmAppt()">确认预约</button>'
  opMod('\\u{1F4C5} 在线预约',h)
}`;

const newShowApptForm = `// Step-based booking state
let _bookStep = 0, _bookServiceId = '', _bookDate = '', _bookTime = ''
function showApptForm(serviceId){
  // Reset state; if serviceId provided, jump to date selection
  _bookStep = 0; _bookServiceId = serviceId || ''; _bookDate = ''; _bookTime = ''
  if (serviceId) { _bookStep = 1; renderBookStep() }
  else renderBookStep()
}
function renderBookStep(){
  let h = '', title = '\\u{1F4C5} 在线预约'
  if (_bookStep === 0) {
    // Step 0: Select service
    title = '\\u{1F4C5} 选择办理事项'
    h += '<div class="mod-desc">请选择您要办理的事项</div>'
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">'
    governmentServices.forEach(svc => {
      h += '<div onclick="window._svc.bookStep1(\\''+svc.id+'\\')" style="background:rgba(10,36,68,0.50);border:1px solid rgba(40,199,250,0.10);border-radius:8px;padding:10px 12px;cursor:pointer;transition:all 0.2s" onmouseover="this.style.borderColor=\\'rgba(40,199,250,0.35)\\';this.style.background=\\'rgba(10,50,100,0.55)\\';" onmouseout="this.style.borderColor=\\'rgba(40,199,250,0.10)\\';this.style.background=\\'rgba(10,36,68,0.50)\\';" >'
      h += '<div style="font-size:13px;color:#fff;font-weight:600;margin-bottom:4px">'+svc.name+'</div>'
      h += '<div style="font-size:10px;color:#6F91A8">'+svc.window+' · '+svc.duration+'</div>'
      h += '</div>'
    })
    h += '</div>'
  } else if (_bookStep === 1) {
    // Step 1: Select date
    const svc = getServiceById(_bookServiceId)
    title = '\\u{1F4C5} '+svc.name+' — 选择日期'
    h += '<div class="mod-desc"><span style="color:#28C7FA;font-weight:600">'+svc.name+'</span> | '+svc.window+' | '+svc.duration+'</div>'
    h += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:10px">'
    const days = ['日','一','二','三','四','五','六']
    days.forEach(d => { h += '<div style="text-align:center;font-size:10px;color:#6F91A8;padding:4px 0">'+d+'</div>' })
    const today = new Date()
    for (let i = 0; i < 14; i++) {
      const dt = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
      const ds = dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(dt.getDate()).padStart(2,'0')
      const dow = dt.getDay()
      const isWeekend = dow === 0 || dow === 6
      const dayLabel = i === 0 ? '今天' : (i === 1 ? '明天' : String(dt.getMonth()+1)+'/'+String(dt.getDate()))
      const slots = getAvailableSlots(svc.window, ds)
      const availCount = slots.filter(sl => sl.available).length
      h += '<div onclick="window._svc.bookStep2(\\''+ds+'\\')" style="text-align:center;padding:8px 4px;border-radius:8px;cursor:pointer;font-size:11px;background:'+(availCount>0?'rgba(40,199,250,0.10)':'rgba(111,145,168,0.06)')+';border:1px solid '+(availCount>0?'rgba(40,199,250,0.15)':'rgba(111,145,168,0.08)')+';color:'+(availCount>0?'#fff':'#6F91A8')+'" onmouseover="this.style.borderColor=\\'rgba(40,199,250,0.40)\\';" onmouseout="this.style.borderColor=\\''+(availCount>0?'rgba(40,199,250,0.15)':'rgba(111,145,168,0.08)')+'\\';">'
      h += '<div style="font-weight:600">'+dayLabel+'</div>'
      h += '<div style="font-size:9px;margin-top:2px">'+ds.slice(5)+'</div>'
      h += '<div style="font-size:9px;color:'+(availCount>0?'#28C76F':'#6F91A8')+';margin-top:1px">'+availCount+'个时段</div>'
      h += '</div>'
    }
    h += '</div>'
  } else if (_bookStep === 2) {
    // Step 2: Select time slot
    const svc = getServiceById(_bookServiceId)
    title = '\\u{1F4C5} '+svc.name+' — 选择时间'
    h += '<div class="mod-desc"><span style="color:#28C7FA;font-weight:600">'+svc.name+'</span> | '+_bookDate+' | '+svc.window+'</div>'
    const slots = getAvailableSlots(svc.window, _bookDate)
    const morningSlots = slots.filter(sl => sl.time < '12:00')
    const afternoonSlots = slots.filter(sl => sl.time >= '12:00')
    function renderSlotGroup(label, group) {
      h += '<div style="font-size:11px;color:#6F91A8;margin:10px 0 6px">'+label+'</div>'
      h += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">'
      group.forEach(sl => {
        if (sl.available) {
          h += '<div onclick="window._svc.bookStep3(\\''+sl.time+'\\')" style="text-align:center;padding:8px 4px;border-radius:6px;cursor:pointer;background:rgba(40,199,250,0.08);border:1px solid rgba(40,199,250,0.15);color:#fff;font-size:12px;font-weight:500" onmouseover="this.style.background=\\'rgba(40,199,250,0.18)\\';" onmouseout="this.style.background=\\'rgba(40,199,250,0.08)\\';" >'+sl.time+'</div>'
        } else {
          h += '<div style="text-align:center;padding:8px 4px;border-radius:6px;background:rgba(111,145,168,0.04);border:1px solid rgba(111,145,168,0.05);color:#4A5E6E;font-size:12px;text-decoration:line-through">'+sl.time+'</div>'
        }
      })
      h += '</div>'
    }
    renderSlotGroup('\\u{1F31E} 上午', morningSlots)
    renderSlotGroup('\\u{1F319} 下午', afternoonSlots)
  } else if (_bookStep === 3) {
    // Step 3: Confirm
    const svc = getServiceById(_bookServiceId)
    title = '\\u{1F4C5} 确认预约信息'
    h += '<div class="svc-result-card">'
    h += '<div class="svc-rc-row"><span class="svc-rc-label">办理事项</span><span class="svc-rc-value" style="font-weight:600;color:#28C7FA">'+svc.name+'</span></div>'
    h += '<div class="svc-rc-row"><span class="svc-rc-label">办理窗口</span><span class="svc-rc-value">'+svc.window+'</span></div>'
    h += '<div class="svc-rc-row"><span class="svc-rc-label">预约日期</span><span class="svc-rc-value" style="font-weight:600;color:#fff">'+_bookDate+'</span></div>'
    h += '<div class="svc-rc-row"><span class="svc-rc-label">预约时间</span><span class="svc-rc-value" style="font-weight:600;color:#fff">'+_bookTime+'</span></div>'
    h += '<div class="svc-rc-row"><span class="svc-rc-label">预计时长</span><span class="svc-rc-value">'+svc.duration+'</span></div>'
    h += '</div>'
    h += '<div class="mod-divider"></div>'
    h += '<div style="font-size:12px;color:#6F91A8;margin-bottom:8px">\\u{1F464} 预约人信息（系统自动带出）</div>'
    h += '<div class="svc-result-card">'
    h += '<div class="svc-rc-row"><span class="svc-rc-label">姓名</span><span class="svc-rc-value" style="color:#fff">王友德</span></div>'
    h += '<div class="svc-rc-row"><span class="svc-rc-label">联系电话</span><span class="svc-rc-value">138****5432</span></div>'
    h += '<div class="svc-rc-row"><span class="svc-rc-label">所属村</span><span class="svc-rc-value">中堰村</span></div>'
    h += '</div>'
    h += '<div class="svc-form-actions" style="margin-top:14px">'
    h += '<button class="svc-btn svc-btn-secondary" onclick="window._svc.bookBack()">上一步</button>'
    h += '<button class="svc-btn svc-btn-primary" onclick="window._svc.doConfirmAppt()">\\u2705 确认预约</button>'
    h += '</div>'
    return opMod(title, h, 'mod-md')
  }
  h += _bookStep > 0 ? '<div class="svc-form-actions" style="margin-top:12px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.bookBack()">'+( _bookStep===1?'返回选择事项':'上一步')+'</button></div>' : ''
  opMod(title, h, 'mod-md')
}`;

if (s.includes(oldShowApptForm)) { s = s.replace(oldShowApptForm, newShowApptForm); check('3-show-appt-form', true); }
else { check('3-show-appt-form', false); }

// ==================================================================================
// PART 4: Rewrite confirmAppt + add booking step helpers
// ==================================================================================
const oldConfirmAppt = `function confirmAppt(){
  const n=document.getElementById('ap_name').value
  if(!n){toast('请填写姓名','warn');return}
  appointment.unshift({id:uid(),name:n,type:document.getElementById('ap_type').value,item:document.getElementById('ap_item').value,date:document.getElementById('ap_date').value,time:document.getElementById('ap_time').value,status:'已预约',office:document.getElementById('ap_office').value})
  clsMod();toast('预约成功！','ok')
}`;

const newConfirmAppt = `function doConfirmAppt(){
  const svc = getServiceById(_bookServiceId)
  if(!svc) return
  const now = new Date()
  const apptNo = 'AP'+now.getFullYear()+String(now.getMonth()+1).padStart(2,'0')+String(now.getDate()).padStart(2,'0')+String(Math.floor(Math.random()*900+100))
  appointment.unshift({
    id:uid(), serviceId:svc.id, serviceName:svc.name,
    name:'王友德', phone:'138****5432', village:'中堰村',
    window:svc.window, date:_bookDate, time:_bookTime, status:'已预约',
    apptNo, createdAt:now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')
  })
  persistAppointments()
  clsMod()
  toast('\\u2705 预约成功 — '+svc.name+' | '+_bookDate+' '+_bookTime+' | '+svc.window,'ok')
  _bookStep = 0; _bookServiceId = ''; _bookDate = ''; _bookTime = ''
}

// Booking step helpers (exposed to window._svc)
function bookStep1(sid) { _bookServiceId = sid; _bookStep = 1; renderBookStep() }
function bookStep2(ds) { _bookDate = ds; _bookStep = 2; renderBookStep() }
function bookStep3(tm) { _bookTime = tm; _bookStep = 3; renderBookStep() }
function bookBack() {
  if (_bookStep <= 1) { showApptForm(); return }
  _bookStep--; renderBookStep()
}`;

if (s.includes(oldConfirmAppt)) { s = s.replace(oldConfirmAppt, newConfirmAppt); check('4-confirm-appt', true); }
else { check('4-confirm-appt', false); }

// ==================================================================================
// PART 5: Rewrite showApptProgress — enhanced display
// ==================================================================================
const oldShowApptProgress = `function showApptProgress(){
  let h=''; appointment.forEach(r=>{h+='<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(14,165,233,0.06)"><div><span style="color:#fff;font-weight:600">'+r.item+'</span><span style="color:#6F91A8;font-size:10px;margin-left:8px">'+r.date+' '+r.time+'</span></div><span class="tag '+(r.status==='已完成'?'g':'b')+'">'+r.status+'</span></div>'})
  opMod('\\u{1F50D} 预约进度',h)
}`;

const newShowApptProgress = `function showApptProgress(){
  if(!appointment.length){ toast('暂无预约记录','info'); return }
  let h='<div class="mod-desc">共 '+appointment.length+' 条预约记录</div>'
  const statusMap = { '已预约':'b', '待办理':'b', '办理中':'y', '已完成':'g', '已取消':'dim', '已失约':'r' }
  appointment.forEach(r=>{
    const tagCls = statusMap[r.status] || 'dim'
    h+='<div style="background:rgba(10,36,68,0.50);border:1px solid rgba(40,199,250,0.08);border-radius:8px;padding:12px;margin-top:8px">'
    h+='<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">'
    h+='<div><span style="color:#fff;font-weight:600;font-size:13px">'+r.serviceName+'</span>'
    h+='<span style="color:#6F91A8;font-size:9px;margin-left:6px">#'+r.apptNo+'</span></div>'
    h+='<span class="tag '+tagCls+'">'+r.status+'</span></div>'
    h+='<div style="font-size:10px;color:#6F91A8;line-height:1.6">'
    h+='<span>\\u{1F4C5} '+r.date+' '+r.time+'</span>'
    h+='<span style="margin-left:10px">\\u{1F3E2} '+r.window+'</span>'
    h+='</div></div>'
  })
  opMod('\\u{1F50D} 预约进度查询',h,'mod-md')
}`;

if (s.includes(oldShowApptProgress)) { s = s.replace(oldShowApptProgress, newShowApptProgress); check('5-appt-progress', true); }
else { check('5-appt-progress', false); }

// ==================================================================================
// PART 6: Rewrite showApptDetail — proper field display
// ==================================================================================
const oldShowApptDetail = `function showApptDetail(r){
  let h='<dl style="display:grid;grid-template-columns:1fr 2fr;gap:4px 12px;font-size:12px;margin-bottom:14px">'
  Object.keys(r).forEach(k=>{if(k!=='id')h+='<dt style="color:#6F91A8">'+k+'</dt><dd style="color:#fff;font-weight:500">'+r[k]+'</dd>'})
  h+='</dl>'; opMod('\\u{1F4C5} 预约详情 — '+r.item,h)
}`;

const newShowApptDetail = `function showApptDetail(r){
  const statusMap = { '已预约':'b', '待办理':'b', '办理中':'y', '已完成':'g', '已取消':'dim', '已失约':'r' }
  const tagCls = statusMap[r.status] || 'dim'
  let h='<div class="svc-result-card">'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">预约编号</span><span class="svc-rc-value">'+r.apptNo+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">办理事项</span><span class="svc-rc-value" style="font-weight:600;color:#28C7FA">'+r.serviceName+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">办理窗口</span><span class="svc-rc-value">'+r.window+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">预约时间</span><span class="svc-rc-value" style="color:#fff">'+r.date+' '+r.time+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">预约人</span><span class="svc-rc-value">'+r.name+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">联系电话</span><span class="svc-rc-value">'+r.phone+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">所属村</span><span class="svc-rc-value">'+r.village+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">当前状态</span><span class="svc-rc-value"><span class="tag '+tagCls+'">'+r.status+'</span></span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">创建时间</span><span class="svc-rc-value">'+r.createdAt+'</span></div>'
  h+='</div>'
  if (r.status === '已预约') {
    h+='<div class="svc-form-actions" style="margin-top:12px">'
    h+='<button class="svc-btn svc-btn-danger" onclick="window._svc.cancelAppointment('+r.id+')">取消预约</button>'
    h+='</div>'
  }
  opMod('\\u{1F4C5} 预约详情 — '+r.serviceName,h,'mod-md')
}
function cancelAppointment(id){
  const idx = appointment.findIndex(a => a.id === id)
  if (idx === -1) return
  if (!confirm('确定取消此预约吗？')) return
  appointment[idx].status = '已取消'
  persistAppointments()
  clsMod()
  toast('预约已取消','ok')
}`;

if (s.includes(oldShowApptDetail)) { s = s.replace(oldShowApptDetail, newShowApptDetail); check('6-appt-detail', true); }
else { check('6-appt-detail', false); }

// ==================================================================================
// PART 7: Replace CSV downloads with proper modals
// ==================================================================================
const oldDownloadGuide = `function downloadGuide(){
  const csv='\\uFEFF事项,所需材料,办理窗口,办理时限,咨询电话\\n身份证换领,原身份证+户口本,户籍窗口,15个工作日,12345\\n农业补贴申请,土地承包证+身份证,农业窗口,7个工作日,12345\\n农业用地证明,土地承包证+村委会证明,综合窗口,3个工作日,12345'
  const b=new Blob([csv],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='办事指南.csv';a.click();toast('办事指南已下载','ok')
}

function downloadTemplate(){
  const csv='\\uFEFF业务类型,所需材料,份数,备注\\n身份证换领,原身份证+户口本+近期证件照,各1份,本人到场办理\\n农业补贴申请,身份证+土地承包证+申请表,各1份,申请表需村委会盖章\\n农业用地证明,身份证+土地承包证+村委会证明,各1份,3个工作日内办结\\n'
  const b=new Blob([csv],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='政务材料模板清单.csv';a.click();toast('材料模板清单已下载','ok')
}`;

const newDownloadGuide = `function downloadGuide(){
  let h='<div class="mod-desc">各事项办理指南，点击查看详情</div>'
  governmentServices.forEach(svc => {
    h+='<div style="background:rgba(10,36,68,0.50);border:1px solid rgba(40,199,250,0.08);border-radius:8px;padding:12px;margin-top:8px;cursor:pointer" onclick="window._svc.showServiceGuide(\\''+svc.id+'\\')">'
    h+='<div style="display:flex;justify-content:space-between;align-items:center">'
    h+='<div><span style="color:#fff;font-weight:600;font-size:13px">\\u{1F4C4} '+svc.name+'</span>'
    h+='<span style="color:#6F91A8;font-size:10px;margin-left:8px">'+svc.window+'</span></div>'
    h+='<span style="color:#28C7FA;font-size:11px">查看指南 \\u25B6</span>'
    h+='</div></div>'
  })
  opMod('\\u{1F4DC} 办事指南',h,'mod-md')
}
function showServiceGuide(sid){
  const svc = getServiceById(sid)
  if(!svc) return
  let h='<div class="svc-result-card">'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">事项名称</span><span class="svc-rc-value" style="font-weight:600;color:#fff">'+svc.name+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">办理窗口</span><span class="svc-rc-value">'+svc.window+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">预计时长</span><span class="svc-rc-value">'+svc.duration+'</span></div>'
  h+='</div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="mod-section-title">\\u{1F4DC} 办理指南</div>'
  h+='<div style="font-size:12px;color:#B7D3E8;line-height:1.8;padding:8px 0">'+svc.guide+'</div>'
  if(svc.materials&&svc.materials.length>0){
    h+='<div class="mod-divider"></div>'
    h+='<div class="mod-section-title">\\u{1F4CE} 所需材料</div>'
    svc.materials.forEach(m=>{
      h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:rgba(10,36,68,0.40);border-radius:6px;margin-bottom:4px">'
      h+='<span style="font-size:11px;color:#D0E4F5">\\u{1F4C4} '+m.name+'</span>'
      h+='<span style="font-size:10px;color:#28C7FA">'+m.fmt+'</span>'
      h+='</div>'
    })
  }
  opMod('\\u{1F4DC} '+svc.name+' — 办事指南',h,'mod-md')
}

function downloadTemplate(){
  let h='<div class="mod-desc">按事项下载申请材料模板（PDF/DOCX 格式）</div>'
  governmentServices.forEach(svc => {
    h+='<div style="background:rgba(10,36,68,0.50);border:1px solid rgba(40,199,250,0.08);border-radius:8px;padding:12px;margin-top:8px">'
    h+='<div style="color:#fff;font-weight:600;font-size:12px;margin-bottom:6px">'+svc.name+'</div>'
    if(svc.materials&&svc.materials.length>0){
      svc.materials.forEach(m=>{
        h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 8px;background:rgba(10,36,68,0.40);border-radius:4px;margin-bottom:3px">'
        h+='<span style="font-size:11px;color:#D0E4F5">\\u{1F4C4} '+m.name+'</span>'
        h+='<span style="font-size:10px;color:#6F91A8;margin:0 8px">'+m.fmt+'</span>'
        h+='<span style="font-size:10px;color:#28C7FA;cursor:pointer;flex-shrink:0" onclick="event.stopPropagation();window._svc.toast(\\'模板文件加载中，请稍后重试\\',\\'info\\')">\\u{2B07} 下载</span>'
        h+='</div>'
      })
    }
    h+='</div>'
  })
  opMod('\\u{1F4E5} 材料模板下载',h,'mod-lg')
}`;

if (s.includes(oldDownloadGuide)) { s = s.replace(oldDownloadGuide, newDownloadGuide); check('7-csv-to-modals', true); }
else { check('7-csv-to-modals', false); }

// ==================================================================================
// PART 8: Rewrite showDayAppts — functional calendar filtering
// ==================================================================================
const oldShowDayAppts = `function showDayAppts(y,m,d){
  const ds=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0')
  const arr=appointment.filter(a=>a.date===ds)
  if(!arr.length){toast(ds+' 暂无预约','info');return}
  let h='';arr.forEach(a=>{h+='<div style="background:rgba(57,217,138,0.05);border-radius:8px;padding:10px;margin-bottom:6px"><div style="font-weight:600;color:#fff;font-size:12px">'+a.item+'</div><div style="font-size:10px;color:#6F91A8;margin-top:3px">'+a.name+' | '+a.time+' | '+a.office+'</div><span class="tag '+(a.status==='已完成'?'g':'b')+'">'+a.status+'</span></div>'})
  opMod(ds+' 预约列表',h)
}`;

const newShowDayAppts = `function showDayAppts(y,m,d){
  const ds=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0')
  const arr=appointment.filter(a=>a.date===ds)
  if(!arr.length){ toast(ds+' 暂无预约','info'); return }
  const statusMap = { '已预约':'b', '待办理':'b', '办理中':'y', '已完成':'g', '已取消':'dim', '已失约':'r' }
  let h='<div class="mod-desc">'+ds+' 共 '+arr.length+' 条预约</div>'
  arr.sort((a,b)=>a.time.localeCompare(b.time))
  arr.forEach(a=>{
    const tagCls = statusMap[a.status] || 'dim'
    h+='<div style="background:rgba(10,36,68,0.50);border:1px solid rgba(40,199,250,0.08);border-radius:8px;padding:10px;margin-top:6px;cursor:pointer" onclick="window._svc.showApptDetailById('+a.id+')">'
    h+='<div style="display:flex;justify-content:space-between;align-items:center">'
    h+='<div><span style="color:#fff;font-weight:600;font-size:12px">'+a.serviceName+'</span>'
    h+='<span style="color:#6F91A8;font-size:10px;margin-left:6px">'+a.time+'</span></div>'
    h+='<span class="tag '+tagCls+'">'+a.status+'</span>'
    h+='</div><div style="font-size:9px;color:#6F91A8;margin-top:3px">'+a.window+'</div></div>'
  })
  opMod('\\u{1F4C5} '+ds+' 预约列表',h,'mod-md')
}
function showApptDetailById(id){
  const a = appointment.find(x=>x.id===id)
  if(a) showApptDetail(a)
}`;

if (s.includes(oldShowDayAppts)) { s = s.replace(oldShowDayAppts, newShowDayAppts); check('8-show-day-appts', true); }
else { check('8-show-day-appts', false); }

// ==================================================================================
// PART 9: Add service catalog section to template (before "我的预约")
// ==================================================================================
const oldMyApptSection = `              <div class="apt-list">
                <div class="section-title" style="margin-bottom:8px">&#x1F4C5; 我的预约</div>
                <div v-if="!appointment.length" style="color:#6F91A8;font-size:11px;padding:12px">暂无预约记录</div>
                <div v-for="r in appointment" :key="r.id" class="apt-item" @click="showApptDetail(r)" style="cursor:pointer">
                  <div class="apt-item-hd">
                    <span style="color:#fff;font-weight:600;font-size:12px">{{ r.item }}</span>
                    <span class="tag" :class="r.status==='已完成'?'g':'b'">{{ r.status }}</span>
                  </div>
                  <div class="apt-item-meta">{{ r.name }} | {{ r.date }} {{ r.time }} | {{ r.office }}</div>
                </div>
              </div>`;

const newMyApptSection = `              <div class="apt-list">
                <div class="section-title" style="margin-bottom:8px">&#x1F4C5; 我的预约</div>
                <div v-if="!appointment.length" style="color:#6F91A8;font-size:11px;padding:12px">暂无预约记录</div>
                <div v-for="r in appointment" :key="r.id" class="apt-item" @click="showApptDetail(r)" style="cursor:pointer">
                  <div class="apt-item-hd">
                    <span style="color:#fff;font-weight:600;font-size:12px">{{ r.serviceName }}</span>
                    <span class="tag" :class="r.status==='已完成'?'g':r.status==='已预约'?'b':r.status==='已取消'?'dim':'y'">{{ r.status }}</span>
                  </div>
                  <div class="apt-item-meta">{{ r.date }} {{ r.time }} | {{ r.window }}</div>
                </div>
              </div>`;

if (s.includes(oldMyApptSection)) { s = s.replace(oldMyApptSection, newMyApptSection); check('9-my-appt-template', true); }
else { check('9-my-appt-template', false); }

// ==================================================================================
// PART 10: Add "可预约事项" section before the calendar
// ==================================================================================
const oldAptLayout = `          <div class="section-card">
            <div class="apt-layout">`;

const newAptLayout = `          <!-- 可预约事项 -->
          <div class="section-card" style="margin-bottom:14px">
            <div class="section-title">&#x1F4CB; 可预约事项</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:4px">
              <div v-for="svc in governmentServices" :key="svc.id" class="svc-service-card">
                <div class="svc-sc-name">{{ svc.name }}</div>
                <div class="svc-sc-meta">{{ svc.window }} · {{ svc.duration }}</div>
                <div style="display:flex;gap:6px;margin-top:8px">
                  <button class="btn btn-o btn-s" @click="showServiceGuide(svc.id)">查看指南</button>
                  <button class="btn btn-p btn-s" @click="showApptForm(svc.id)">立即预约</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 预约日历 + 我的预约 -->
          <div class="section-card">
            <div class="apt-layout">`;

if (s.includes(oldAptLayout)) { s = s.replace(oldAptLayout, newAptLayout); check('10-service-catalog', true); }
else { check('10-service-catalog', false); }

// ==================================================================================
// PART 11: Update quick actions — remove CSV, keep proper actions
// ==================================================================================
const oldQuickAppt = `  if (key === 'appointment') return [
    { icon:'\\u{1F4C5}', label:'在线预约', action: showApptForm },
    { icon:'\\u{1F50D}', label:'进度查询', action: showApptProgress },
    { icon:'\\u{1F4DC}', label:'办事指南', action: downloadGuide },
    { icon:'\\u{1F4E5}', label:'材料模板', action: downloadTemplate }
  ]`;

// Same actions but now pointing to working functions
if (s.includes(oldQuickAppt)) { check('11-quick-actions-unchanged', true); }
else { check('11-quick-actions-unchanged', false); }

// ==================================================================================
// PART 12: Update window._svc — expose new functions
// ==================================================================================
const oldWindowSvc12 = `confirmAppt,submitRemote`;

const newWindowSvc12 = `doConfirmAppt,cancelAppointment,bookStep1,bookStep2,bookStep3,bookBack,showServiceGuide,showApptDetailById,submitRemote`;

if (s.includes(oldWindowSvc12)) { s = s.replace(oldWindowSvc12, newWindowSvc12); check('12-window-svc', true); }
else { check('12-window-svc', false); }

// ==================================================================================
// PART 13: Add CSS for service catalog cards
// ==================================================================================
const oldCssAnchor = `.apt-item-meta { font-size:10px; color:#6F91A8; margin-top:3px; }`;

const newCssIncludingService = `.apt-item-meta { font-size:10px; color:#6F91A8; margin-top:3px; }

/* Service catalog cards */
.svc-service-card { background:rgba(10,36,68,0.50); border:1px solid rgba(40,199,250,0.08); border-radius:10px; padding:12px 14px; transition:all 0.2s; }
.svc-service-card:hover { border-color:rgba(40,199,250,0.20); background:rgba(10,50,100,0.45); }
.svc-sc-name { font-size:13px; font-weight:600; color:#fff; margin-bottom:4px; }
.svc-sc-meta { font-size:10px; color:#6F91A8; }`;

if (s.includes(oldCssAnchor)) { s = s.replace(oldCssAnchor, newCssIncludingService); check('13-css-service-cards', true); }
else { check('13-css-service-cards', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== FINAL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
