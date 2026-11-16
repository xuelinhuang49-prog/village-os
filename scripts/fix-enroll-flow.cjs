// Fix: auto-populated farmer identity in enrollment confirmation
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/ServicePage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// === 1. Add enrollment info section (readonly name/phone/village + checkbox) in showCourseDetail ===
// Insert between the "注意事项" closing and the action buttons
const oldAfterNotes = `h+='<div class="svc-rc-row"><span class="svc-rc-label">注意事项</span><span class="svc-rc-value">'+(c.notes||'暂无')+'</span></div>'
  h+='</div>'
  // Action buttons
  if(enrolled&&canCancel){`;

const newAfterNotes = `h+='<div class="svc-rc-row"><span class="svc-rc-label">注意事项</span><span class="svc-rc-value">'+(c.notes||'暂无')+'</span></div>'
  h+='</div>'
  // Enrollment info section (auto-populated from login profile)
  if(!enrolled&&isFuture&&c.status==='报名中'&&remaining>0){
    h+='<div class="mod-divider"></div>'
    h+='<div style="font-size:12px;color:#6F91A8;margin-bottom:10px">\\u{1F464} 报名信息确认</div>'
    h+='<div class="svc-rc-row"><span class="svc-rc-label">报名人</span><span class="svc-rc-value" style="color:#fff">王友德</span></div>'
    h+='<div class="svc-rc-row"><span class="svc-rc-label">联系电话</span><span class="svc-rc-value">138****5432</span></div>'
    h+='<div class="svc-rc-row"><span class="svc-rc-label">所属村</span><span class="svc-rc-value">中堰村</span></div>'
    h+='<div style="margin-top:12px;display:flex;align-items:flex-start;gap:8px">'
    h+='<input type="checkbox" id="chk_enroll_confirm" style="margin-top:2px;accent-color:#28C7FA;width:14px;height:14px;flex-shrink:0;cursor:pointer">'
    h+='<label for="chk_enroll_confirm" style="font-size:12px;color:#B7D3E8;line-height:1.5;cursor:pointer">我已了解培训时间、地点及注意事项</label>'
    h+='</div>'
  }
  // Action buttons
  if(enrolled&&canCancel){`;

if (s.includes(oldAfterNotes)) { s = s.replace(oldAfterNotes, newAfterNotes); check('1-enroll-info-section', true); }
else { check('1-enroll-info-section', false); }

// === 2. Update confirmEnroll: checkbox validation + mobile_snapshot/farmer_id/village_id + rich toast + re-render ===
const oldConfirmEnroll = `function confirmEnroll(courseId){
  const c=trainingCourses.find(x=>x.id===courseId)
  if(!c)return
  if(c.deadline){
    const dl=new Date(c.deadline)
    if(new Date()>dl){toast('报名已截止','warn');return}
  }
  if(c.joined>=c.limit){toast('名额已满，无法报名','warn');return}
  if(isEnrolled(courseId)){toast('您已报名此课程','info');return}
  const now=new Date()
  trainingEnrollments.unshift({
    id:uid(),courseId:c.id,userId:1,
    enrollDate:now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0'),
    status:'进行中',progress:'0%',learningHours:0
  })
  c.joined++
  toast('报名成功！','ok')
  clsMod()
}`;

const newConfirmEnroll = `function confirmEnroll(courseId){
  const c=trainingCourses.find(x=>x.id===courseId)
  if(!c)return
  // Check confirmation checkbox
  const chk=document.getElementById('chk_enroll_confirm')
  if(chk&&!chk.checked){toast('\\u26A0 请先勾选确认信息','warn');return}
  if(c.deadline){
    const dl=new Date(c.deadline)
    if(new Date()>dl){toast('报名已截止','warn');return}
  }
  if(c.joined>=c.limit){toast('名额已满，无法报名','warn');return}
  if(isEnrolled(courseId)){toast('您已报名此课程','info');return}
  const now=new Date()
  trainingEnrollments.unshift({
    id:uid(),courseId:c.id,userId:1,
    enrollDate:now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0'),
    status:'进行中',progress:'0%',learningHours:0,
    mobile_snapshot:'138****5432',farmer_id:1,village_id:'中堰村'
  })
  c.joined++
  toast('\\u2705 报名成功 \\u2014 '+c.title+' | '+c.date+' '+c.time+' | '+c.loc,'ok')
  // Re-render detail modal to show enrolled state
  showCourseDetail(c)
}`;

if (s.includes(oldConfirmEnroll)) { s = s.replace(oldConfirmEnroll, newConfirmEnroll); check('2-confirm-enroll', true); }
else { check('2-confirm-enroll', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== FINAL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
