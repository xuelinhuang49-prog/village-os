// Fix training tab: label corrections, enrollment status, cancel in detail, learning page
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/ServicePage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;

function check(label, cond) { total++; if (cond) { ok++; console.log('OK:', label); } else { console.log('FAIL:', label); } }

// === 1. Update data — add materials, fix LIVE loc, normalize status ===
const oldData1 = `const historicalEnrolledCourses = [
  { id: 51, title: '病虫害防治基础', teacher: '刘教授', date: '2026-06-12', time: '09:00', loc: '村委会培训室', duration: '约2小时', type: 'OFFLINE', joined: 22, limit: 30, status: '已完成', description: '常见农作物病虫害识别与防治方法', deadline: '2026-06-10', suitableFor: '全体农户', notes: '' },
  { id: 52, title: '智慧农业入门', teacher: '周老师', date: '2026-07-08', time: '14:00', loc: '线上直播', duration: '约1.5小时', type: 'LIVE', joined: 35, limit: 50, status: '进行中', description: '智慧农业概念及应用场景介绍', deadline: '2026-07-06', suitableFor: '全体农户', notes: '' }
]`;

const newData1 = `const historicalEnrolledCourses = [
  { id: 51, title: '病虫害防治基础', teacher: '刘教授', date: '2026-06-12', time: '09:00', loc: '村委会培训室', duration: '约2小时', type: 'OFFLINE', joined: 22, limit: 30, status: '已完成', description: '常见农作物病虫害识别与防治方法，涵盖水稻、小麦、玉米等主要农作物的常见病虫害。', deadline: '2026-06-10', suitableFor: '全体农户', notes: '', materials: [{name:'病虫害识别手册.pdf',size:'2.3MB'},{name:'苹果常见病虫害防治要点.pdf',size:'1.8MB'}] },
  { id: 52, title: '智慧农业入门', teacher: '周老师', date: '2026-07-08', time: '14:00', loc: '村集体直播平台', duration: '约1.5小时', type: 'LIVE', joined: 35, limit: 50, status: '进行中', description: '智慧农业概念及应用场景介绍，包括物联网监控、智能灌溉、无人机植保等前沿技术。', deadline: '2026-07-06', suitableFor: '全体农户', notes: '', materials: [{name:'智慧农业导论.pdf',size:'4.1MB'}] }
]`;

const oldData2 = `  { id: 42, title: '电商直播带货入门', teacher: '赵老师', date: '2026-08-20', time: '14:00', loc: '线上直播', duration: '约2小时', type: 'LIVE', joined: 25, limit: 50, status: '报名中', description: '从零开始学习电商直播带货技巧，包括直播间搭建、选品策略、话术设计、流量获取等实用内容。', deadline: '2026-08-19', suitableFor: '有意开展电商销售的农户、返乡创业青年', notes: '请提前安装好抖音/快手APP，课程期间会有实操环节。直播链接将于开课前1天通过短信发送。' }`;

const newData2 = `  { id: 42, title: '电商直播带货入门', teacher: '赵老师', date: '2026-08-20', time: '14:00', loc: '村集体直播平台', duration: '约2小时', type: 'LIVE', joined: 25, limit: 50, status: '报名中', description: '从零开始学习电商直播带货技巧，包括直播间搭建、选品策略、话术设计、流量获取等实用内容。', deadline: '2026-08-19', suitableFor: '有意开展电商销售的农户、返乡创业青年', notes: '请提前安装好抖音/快手APP，课程期间会有实操环节。直播链接将于开课前1天通过短信发送。', materials: [] }`;

if (s.includes(oldData1)) { s = s.replace(oldData1, newData1); check('1a-historical', true); }
else { check('1a-historical', false); }
if (s.includes(oldData2)) { s = s.replace(oldData2, newData2); check('1b-course42', true); }
else { check('1b-course42', false); }

// Add materials to id 41 and 43
const oldData3 = `{ id: 41, title: '苹果夏季修剪技术培训', teacher: '李教授', date: '2026-08-15', time: '09:00', loc: '村委会培训室', duration: '约3小时', type: 'OFFLINE', joined: 18, limit: 30, status: '报名中', description: '本课程主要讲解苹果树夏季修剪的关键技术，包括疏枝、摘心、环剥等操作要点，适合有一定果树种植基础的农户参加。', deadline: '2026-08-14', suitableFor: '果树种植户、农技推广员', notes: '请携带修剪工具到场，实操环节需穿戴防护手套。如遇雨天顺延至次日。' }`;
const newData3 = `{ id: 41, title: '苹果夏季修剪技术培训', teacher: '李教授', date: '2026-08-15', time: '09:00', loc: '村委会培训室', duration: '约3小时', type: 'OFFLINE', joined: 18, limit: 30, status: '报名中', description: '本课程主要讲解苹果树夏季修剪的关键技术，包括疏枝、摘心、环剥等操作要点，适合有一定果树种植基础的农户参加。', deadline: '2026-08-14', suitableFor: '果树种植户、农技推广员', notes: '请携带修剪工具到场，实操环节需穿戴防护手套。如遇雨天顺延至次日。', materials: [] }`;
const oldData4 = `{ id: 43, title: '有机蔬菜种植技术', teacher: '孙教授', date: '2026-09-05', time: '08:30', loc: '镇农技站', duration: '约4小时', type: 'OFFLINE', joined: 20, limit: 40, status: '报名中', description: '系统讲解有机蔬菜种植的标准流程，涵盖土壤改良、有机肥料使用、病虫害绿色防控、认证申请等内容。', deadline: '2026-09-03', suitableFor: '蔬菜种植户、合作社技术员', notes: '课程含实地参观环节，请穿着适合户外活动的服装。中午提供简餐。' }`;
const newData4 = `{ id: 43, title: '有机蔬菜种植技术', teacher: '孙教授', date: '2026-09-05', time: '08:30', loc: '镇农技站', duration: '约4小时', type: 'OFFLINE', joined: 20, limit: 40, status: '报名中', description: '系统讲解有机蔬菜种植的标准流程，涵盖土壤改良、有机肥料使用、病虫害绿色防控、认证申请等内容。', deadline: '2026-09-03', suitableFor: '蔬菜种植户、合作社技术员', notes: '课程含实地参观环节，请穿着适合户外活动的服装。中午提供简餐。', materials: [] }`;

if (s.includes(oldData3)) { s = s.replace(oldData3, newData3); check('1c-course41', true); }
else { check('1c-course41', false); }
if (s.includes(oldData4)) { s = s.replace(oldData4, newData4); check('1d-course43', true); }
else { check('1d-course43', false); }

// === 2. Fix showCourseDetail: 剩余名额→报名人数, dynamic loc, cancel button ===
const oldDetail = `function showCourseDetail(c){
  const typeLabels={OFFLINE:'线下培训',ONLINE:'线上课程',LIVE:'线上直播',HYBRID:'线下+线上'}
  const typeLabel=typeLabels[c.type]||c.type
  const locLabel=(c.type==='LIVE'||c.type==='ONLINE')?'直播平台':'培训地点'
  const remaining=Math.max(0,c.limit-c.joined)
  const remainingClass=remaining<=5?'r':'g'
  const now=new Date()
  const courseDate=new Date(c.date+'T'+c.time)
  const isFuture=courseDate>now
  const enrolled=isEnrolled(c.id)
  let h='<div class="svc-result-card">'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">课程名称</span><span class="svc-rc-value" style="font-weight:600;font-size:14px">'+c.title+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">培训内容</span><span class="svc-rc-value">'+(c.description||'暂无详情')+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">讲师</span><span class="svc-rc-value">'+c.teacher+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">培训时间</span><span class="svc-rc-value">'+c.date+' '+c.time+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">'+locLabel+'</span><span class="svc-rc-value">'+c.loc+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">培训方式</span><span class="svc-rc-value">'+typeLabel+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">课程时长</span><span class="svc-rc-value">'+c.duration+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">适合人群</span><span class="svc-rc-value">'+(c.suitableFor||'不限')+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">报名截止</span><span class="svc-rc-value">'+(c.deadline||'开课前1天')+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">剩余名额</span><span class="svc-rc-value"><span class="tag '+remainingClass+'">'+remaining+'/'+c.limit+'</span></span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">注意事项</span><span class="svc-rc-value">'+(c.notes||'暂无')+'</span></div>'
  h+='</div>'
  if(isFuture&&c.status==='报名中'&&remaining>0&&!enrolled){
    h+='<div class="svc-form-actions" style="margin-top:16px">'
    h+='<button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()">取消</button>'
    h+='<button class="svc-btn svc-btn-primary" onclick="window._svc.confirmEnroll('+c.id+')">\\u2705 确认报名</button>'
    h+='</div>'
  }else if(enrolled){
    h+='<div style="text-align:center;margin-top:16px;color:#28C76F;font-weight:600;font-size:13px">\\u2705 您已报名此课程</div>'
  }else if(!isFuture){
    h+='<div style="text-align:center;margin-top:16px;color:#6F91A8;font-size:12px">该课程已开始，无法报名</div>'
  }
  opMod('\\u{1F393} 课程详情 \\u2014 '+c.title,h,'mod-md')
}`;

const newDetail = `function showCourseDetail(c){
  const typeLabels={OFFLINE:'线下培训',ONLINE:'线上课程',LIVE:'线上直播',HYBRID:'线下+线上'}
  const typeLabel=typeLabels[c.type]||c.type
  const now=new Date()
  const courseDate=new Date(c.date+'T'+c.time)
  const isFuture=courseDate>now
  const enrolled=isEnrolled(c.id)
  const enrollment=getEnrollment(c.id)
  const remaining=Math.max(0,c.limit-c.joined)
  const joinedClass=c.joined>=c.limit?'r':'g'
  const canCancel=enrolled&&isFuture&&(!c.deadline||new Date()<=new Date(c.deadline))
  // Build location row dynamically — hide if loc value duplicates type label
  let locRow=''
  if(c.type==='LIVE'){
    if(c.loc!=='线上直播') locRow='<div class="svc-rc-row"><span class="svc-rc-label">直播平台</span><span class="svc-rc-value">'+c.loc+'</span></div>'
  }else if(c.type==='ONLINE'){
    locRow='<div class="svc-rc-row"><span class="svc-rc-label">学习平台</span><span class="svc-rc-value">'+c.loc+'</span></div>'
  }else{
    locRow='<div class="svc-rc-row"><span class="svc-rc-label">培训地点</span><span class="svc-rc-value">'+c.loc+'</span></div>'
  }
  let h='<div class="svc-result-card">'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">课程名称</span><span class="svc-rc-value" style="font-weight:600;font-size:14px">'+c.title+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">培训内容</span><span class="svc-rc-value">'+(c.description||'暂无详情')+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">讲师</span><span class="svc-rc-value">'+c.teacher+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">培训时间</span><span class="svc-rc-value">'+c.date+' '+c.time+'</span></div>'
  if(locRow) h+=locRow
  h+='<div class="svc-rc-row"><span class="svc-rc-label">培训方式</span><span class="svc-rc-value">'+typeLabel+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">课程时长</span><span class="svc-rc-value">'+c.duration+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">适合人群</span><span class="svc-rc-value">'+(c.suitableFor||'不限')+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">报名截止</span><span class="svc-rc-value">'+(c.deadline||'开课前1天')+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">报名人数</span><span class="svc-rc-value"><span class="tag '+joinedClass+'">'+c.joined+'/'+c.limit+'人</span></span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">注意事项</span><span class="svc-rc-value">'+(c.notes||'暂无')+'</span></div>'
  h+='</div>'
  // Action buttons
  if(enrolled&&canCancel){
    h+='<div class="mod-divider"></div>'
    h+='<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">'
    h+='<span style="color:#28C76F;font-weight:600;font-size:13px">\\u2705 已报名</span>'
    h+='<button class="svc-btn svc-btn-danger" onclick="window._svc.cancelEnrollFromDetail('+c.id+')" style="flex:none">取消报名</button>'
    h+='</div>'
  }else if(enrolled&&!canCancel){
    h+='<div style="text-align:center;margin-top:16px;color:#28C76F;font-weight:600;font-size:13px">\\u2705 您已报名此课程</div>'
  }else if(!isFuture){
    h+='<div style="text-align:center;margin-top:16px;color:#6F91A8;font-size:12px">该课程已开始，无法报名</div>'
  }else if(!enrolled&&isFuture&&c.status==='报名中'&&remaining>0){
    h+='<div class="svc-form-actions" style="margin-top:16px">'
    h+='<button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()">取消</button>'
    h+='<button class="svc-btn svc-btn-primary" onclick="window._svc.confirmEnroll('+c.id+')">\\u2705 确认报名</button>'
    h+='</div>'
  }
  opMod('\\u{1F393} 课程详情 \\u2014 '+c.title,h,'mod-md')
}
function cancelEnrollFromDetail(courseId){
  const c=trainingCourses.find(x=>x.id===courseId)||historicalEnrolledCourses.find(x=>x.id===courseId)
  if(!c)return
  if(!confirm('确定取消\\u300C'+c.title+'\\u300D的报名吗？'))return
  cancelEnroll(c)
  clsMod()
}`;

if (s.includes(oldDetail)) { s = s.replace(oldDetail, newDetail); check('2-detail', true); }
else { check('2-detail', false); }

// === 3. Fix showReplayList text ===
const oldReplayDesc = `let h='<div class="mod-desc">已完成课程的录制回放</div>'`;
const newReplayDesc = `let h='<div class="mod-desc">可观看的培训课程回放</div>'`;
if (s.includes(oldReplayDesc)) { s = s.replace(oldReplayDesc, newReplayDesc); check('3-replay-text', true); }
else { check('3-replay-text', false); }

// === 4. Replace showReplayFor toast with learning page modal ===
const oldReplayFor = `function showReplayFor(course){
  toast('正在加载回放：\\u300C'+course.title+'\\u300D','info')
}`;

const newReplayFor = `function showReplayFor(course){
  const mats=course.materials||[]
  const learning=trainingLearning.find(l=>l.courseId===course.id)
  const watched=learning?learning.watchedMinutes:0
  const total=learning?learning.totalMinutes:(parseFloat(course.duration)*60||90)
  const pct=total>0?Math.round((watched/total)*100):0
  let h=''
  // Video player placeholder
  h+='<div style="background:rgba(0,0,0,0.50);border-radius:10px;height:200px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;border:1px solid rgba(255,255,255,0.06)">'
  h+='<div style="text-align:center"><div style="font-size:36px;margin-bottom:6px">\\u25B6</div><div style="font-size:12px;color:#6F91A8">视频播放器区域</div></div></div>'
  // Course info
  h+='<div style="margin-bottom:14px">'
  h+='<div style="font-size:14px;font-weight:600;color:#fff;margin-bottom:8px">'+course.title+'</div>'
  h+='<div style="font-size:11px;color:#B7D3E8;margin-bottom:4px">'+course.description+'</div>'
  h+='<div style="display:flex;gap:20px;font-size:11px;color:#6F91A8;flex-wrap:wrap">'
  h+='<span>\\u{1F468}\\u200D\\u{1F3EB} 讲师：'+course.teacher+'</span>'
  h+='<span>\\u{23F1} 课程时长：'+course.duration+'</span>'
  if(watched>0) h+='<span>\\u{1F4CA} 已学习：'+watched+'/'+total+'分钟</span>'
  h+='</div></div>'
  // Materials
  if(mats.length>0){
    h+='<div class="mod-divider"></div>'
    h+='<div class="mod-section-title">\\u{1F4CE} 配套资料</div>'
    mats.forEach(m=>{
      h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:rgba(10,36,68,0.40);border-radius:6px;margin-bottom:6px">'
      h+='<span style="font-size:12px;color:#D0E4F5">\\u{1F4C4} '+m.name+'</span>'
      h+='<span style="font-size:10px;color:#6F91A8">'+m.size+'</span>'
      h+='</div>'
    })
  }
  // Progress
  h+='<div class="mod-divider"></div>'
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">'
  h+='<span style="font-size:12px;color:#6F91A8">学习进度</span>'
  h+='<span style="font-size:12px;color:#28C7FA;font-weight:600">'+pct+'%</span>'
  h+='</div>'
  h+='<div class="progress-bar" style="height:8px;border-radius:4px"><div class="fill b" style="width:'+pct+'%"></div></div>'
  opMod('\\u{1F4FA} 课程学习 \\u2014 '+course.title,h,'mod-lg')
}`;

if (s.includes(oldReplayFor)) { s = s.replace(oldReplayFor, newReplayFor); check('4-replay-for', true); }
else { check('4-replay-for', false); }

// === 5. Fix myTrainingList: add displayStatus that separates course status from enrollment status ===
const oldMTL = `const myTrainingList = computed(() => {
  const enrolledCourseIds = trainingEnrollments.map(e => e.courseId)
  const allEnrolled = historicalEnrolledCourses.concat(
    trainingCourses.filter(c => enrolledCourseIds.includes(c.id))
  )
  return allEnrolled.map(c => ({ ...c, enrollment: trainingEnrollments.find(e => e.courseId === c.id) || null }))
})`;

const newMTL = `const myTrainingList = computed(() => {
  const enrolledCourseIds = trainingEnrollments.map(e => e.courseId)
  const allEnrolled = historicalEnrolledCourses.concat(
    trainingCourses.filter(c => enrolledCourseIds.includes(c.id))
  )
  return allEnrolled.map(c => {
    const enrollment = trainingEnrollments.find(e => e.courseId === c.id) || null
    // Derive display status from enrollment, not course
    let displayStatus = '已报名'
    if (enrollment) {
      if (enrollment.status === '已完成') displayStatus = '已完成'
      else if (enrollment.status === '进行中') {
        const now = new Date()
        const courseStart = new Date(c.date + 'T' + c.time)
        displayStatus = now < courseStart ? '已报名' : '进行中'
      }
    }
    return { ...c, enrollment, displayStatus }
  })
})`;

if (s.includes(oldMTL)) { s = s.replace(oldMTL, newMTL); check('5-myTrainingList', true); }
else { check('5-myTrainingList', false); }

// === 6. Template: use displayStatus in 我的培训 table ===
const oldTplStatus = `                  <td><span class="tag" :class="r.status==='已完成'?'g':r.status==='进行中'?'b':'dim'">{{ r.status }}</span></td>`;
// Only match the one in 我的培训 section (second occurrence is in 可报名课程 which is different)
// Use a more specific context
const oldTplContext = `<td>{{ getTypeLabel(r) }}</td>
                  <td>{{ r.date }} {{ r.time }}</td>
                  <td><span class="tag" :class="r.status==='已完成'?'g':r.status==='进行中'?'b':'dim'">{{ r.status }}</span></td>
                  <td>
                    <button v-if="r.status==='已完成'" class="btn btn-p btn-s" @click="showReplayFor(r)">查看回放</button>
                    <button v-if="r.status==='进行中'&&(r.type==='LIVE'||r.type==='ONLINE')" class="btn btn-p btn-s" @click="continueLearning(r)">继续学习</button>`;

const newTplContext = `<td>{{ getTypeLabel(r) }}</td>
                  <td>{{ r.date }} {{ r.time }}</td>
                  <td><span class="tag" :class="r.displayStatus==='已完成'?'g':r.displayStatus==='进行中'?'b':'y'">{{ r.displayStatus }}</span></td>
                  <td>
                    <button v-if="r.displayStatus==='已完成'" class="btn btn-p btn-s" @click="showReplayFor(r)">查看回放</button>
                    <button v-if="r.displayStatus==='进行中'&&(r.type==='LIVE'||r.type==='ONLINE')" class="btn btn-p btn-s" @click="continueLearning(r)">继续学习</button>`;

if (s.includes(oldTplContext)) { s = s.replace(oldTplContext, newTplContext); check('6-template-status', true); }
else { check('6-template-status', false); }

// === 7. Update onMounted handlers: add cancelEnrollFromDetail ===
const oldMount2 = `confirmEnroll:(courseId)=>{confirmEnroll(courseId)},showReplayForById:(id)=>{const c=myTrainingList.value.find(x=>x.id===id);if(c){clsMod();showReplayFor(c)}}`;
const newMount2 = `confirmEnroll:(courseId)=>{confirmEnroll(courseId)},cancelEnrollFromDetail:(courseId)=>{cancelEnrollFromDetail(courseId)},showReplayForById:(id)=>{const c=myTrainingList.value.find(x=>x.id===id);if(c){clsMod();showReplayFor(c)}}`;

if (s.includes(oldMount2)) { s = s.replace(oldMount2, newMount2); check('7-mount', true); }
else { check('7-mount', false); }

// === 8. CSS: add svc-btn-danger style if not present ===
if (!s.includes('.svc-btn-danger')) {
  const cssInsert = '.svc-btn-secondary {';
  const dangerCSS = '.svc-btn-danger { padding:8px 18px; border-radius:6px; border:1px solid rgba(231,76,60,0.30); background:rgba(231,76,60,0.10); color:#E74C3C; cursor:pointer; font-size:12px; font-family:inherit; transition:all 0.2s; } .svc-btn-danger:hover { background:rgba(231,76,60,0.20); border-color:rgba(231,76,60,0.45); }\n';
  if (s.includes(cssInsert)) {
    s = s.replace(cssInsert, dangerCSS + cssInsert);
    check('8-css-danger', true);
  } else { check('8-css-danger', false); }
} else { check('8-css-danger', true); console.log('  (already present)'); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== FINAL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
