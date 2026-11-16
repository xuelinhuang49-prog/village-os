// Comprehensive refactoring of 农技培训 tab in ServicePage.vue
const fs = require('fs');
const path = require('path');
const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0;
let total = 0;

function check(label, condition) {
  total++;
  if (condition) { ok++; console.log('OK:', label); }
  else { console.log('FAIL:', label); }
}

// ============================================================
// 1. Replace availableCourses + training data (lines 450-458)
// ============================================================
const oldData = `const availableCourses = reactive([
  { id: 41, title: '苹果夏季修剪技术培训', teacher: '李教授', date: '2026-08-15', time: '09:00', loc: '村委会培训室', duration: '3小时', type: '线下实操', joined: 18, limit: 30, status: '报名中' },
  { id: 42, title: '电商直播带货入门', teacher: '赵老师', date: '2026-08-20', time: '14:00', loc: '线上直播', duration: '2小时', type: '线下+线上', joined: 25, limit: 50, status: '报名中' },
  { id: 43, title: '有机蔬菜种植技术', teacher: '孙教授', date: '2026-09-05', time: '08:30', loc: '镇农技站', duration: '4小时', type: '线下讲座', joined: 20, limit: 40, status: '报名中' }
])
const training = reactive([
  { id: 51, title: '病虫害防治基础', teacher: '刘教授', date: '2026-06-12', time: '09:00', loc: '村委会培训室', duration: '2小时', type: '线下讲座', joined: 22, limit: 30, status: '已完成', progress: '100%' },
  { id: 52, title: '智慧农业入门', teacher: '周老师', date: '2026-07-08', time: '14:00', loc: '线上直播', duration: '1.5小时', type: '线下+线上', joined: 35, limit: 50, status: '进行中', progress: '60%' }
])`;

const newData = `// ---- Training data (restructured for admin API alignment) ----
// trainingCourses: master course catalog
const trainingCourses = reactive([
  { id: 41, title: '苹果夏季修剪技术培训', teacher: '李教授', date: '2026-08-15', time: '09:00', loc: '村委会培训室', duration: '约3小时', type: 'OFFLINE', joined: 18, limit: 30, status: '报名中', description: '本课程主要讲解苹果树夏季修剪的关键技术，包括疏枝、摘心、环剥等操作要点，适合有一定果树种植基础的农户参加。', deadline: '2026-08-14', suitableFor: '果树种植户、农技推广员', notes: '请携带修剪工具到场，实操环节需穿戴防护手套。如遇雨天顺延至次日。' },
  { id: 42, title: '电商直播带货入门', teacher: '赵老师', date: '2026-08-20', time: '14:00', loc: '线上直播', duration: '约2小时', type: 'LIVE', joined: 25, limit: 50, status: '报名中', description: '从零开始学习电商直播带货技巧，包括直播间搭建、选品策略、话术设计、流量获取等实用内容。', deadline: '2026-08-19', suitableFor: '有意开展电商销售的农户、返乡创业青年', notes: '请提前安装好抖音/快手APP，课程期间会有实操环节。直播链接将于开课前1天通过短信发送。' },
  { id: 43, title: '有机蔬菜种植技术', teacher: '孙教授', date: '2026-09-05', time: '08:30', loc: '镇农技站', duration: '约4小时', type: 'OFFLINE', joined: 20, limit: 40, status: '报名中', description: '系统讲解有机蔬菜种植的标准流程，涵盖土壤改良、有机肥料使用、病虫害绿色防控、认证申请等内容。', deadline: '2026-09-03', suitableFor: '蔬菜种植户、合作社技术员', notes: '课程含实地参观环节，请穿着适合户外活动的服装。中午提供简餐。' }
])

// trainingEnrollments: enrollment bridge table
const trainingEnrollments = reactive([
  { id: 101, courseId: 51, userId: 1, enrollDate: '2026-06-10', status: '已完成', progress: '100%', learningHours: 2.0 },
  { id: 102, courseId: 52, userId: 1, enrollDate: '2026-07-05', status: '进行中', progress: '60%', learningHours: 0.9 }
])

// trainingLearning: online learning time records
const trainingLearning = reactive([
  { id: 201, enrollmentId: 102, courseId: 52, watchedMinutes: 54, totalMinutes: 90, lastAccess: '2026-08-10' }
])

// trainingAttendance: offline check-in records
const trainingAttendance = reactive([
  { id: 301, enrollmentId: 101, courseId: 51, checkinTime: '2026-06-12 08:52', status: '已签到' }
])

// historicalEnrolledCourses: course details for previously enrolled courses
const historicalEnrolledCourses = [
  { id: 51, title: '病虫害防治基础', teacher: '刘教授', date: '2026-06-12', time: '09:00', loc: '村委会培训室', duration: '约2小时', type: 'OFFLINE', joined: 22, limit: 30, status: '已完成', description: '常见农作物病虫害识别与防治方法', deadline: '2026-06-10', suitableFor: '全体农户', notes: '' },
  { id: 52, title: '智慧农业入门', teacher: '周老师', date: '2026-07-08', time: '14:00', loc: '线上直播', duration: '约1.5小时', type: 'LIVE', joined: 35, limit: 50, status: '进行中', description: '智慧农业概念及应用场景介绍', deadline: '2026-07-06', suitableFor: '全体农户', notes: '' }
]`;

if (s.includes(oldData)) {
  s = s.replace(oldData, newData);
  check('1-data-replace', true);
} else {
  check('1-data-replace', false);
}

// ============================================================
// 2. Update dataMap (line 474)
// ============================================================
const oldDataMap = `const dataMap = { insurance, subsidy, elderly, telemed, training, appointment }`;
const newDataMap = `const dataMap = { insurance, subsidy, elderly, telemed, training: trainingEnrollments, appointment }`;
if (s.includes(oldDataMap)) {
  s = s.replace(oldDataMap, newDataMap);
  check('2-dataMap', true);
} else {
  check('2-dataMap', false);
}

// ============================================================
// 3. Add helper functions after telemedStatus block (after line 472)
// ============================================================
const oldHelpers = `function isTelemedCompleted(r){ return r.status==='已完成' }
function isTelemedPending(r){ const s=telemedStatus(r); return s==='待就诊'||s==='已过期' }

const dataMap`;

const newHelpers = `function isTelemedCompleted(r){ return r.status==='已完成' }
function isTelemedPending(r){ const s=telemedStatus(r); return s==='待就诊'||s==='已过期' }

// ---- Training helpers ----
function isEnrolled(courseId){ return trainingEnrollments.some(e=>e.courseId===courseId) }
function getEnrollment(courseId){ return trainingEnrollments.find(e=>e.courseId===courseId) }
function getTypeLabel(course){ const map={OFFLINE:'线下培训',ONLINE:'线上课程',LIVE:'线上直播',HYBRID:'线下+线上'}; return map[course.type]||course.type }

const dataMap`;

if (s.includes(oldHelpers)) {
  s = s.replace(oldHelpers, newHelpers);
  check('3-helpers', true);
} else {
  check('3-helpers', false);
}

// ============================================================
// 4. Update KPI cards for training (lines 522-530)
// ============================================================
const oldKpi = `  if (key === 'training') {
    const done = training.filter(t=>t.status==='已完成').length
    const totalH = training.reduce((s,t)=>{const m=t.duration.match(/(\d+)/);return s+(m?Number(m[1]):0)},0)
    return [
      { icon:'\\u{1F393}', value:availableCourses.length+'个', label:'可报名', color:'g' },
      { icon:'\\u{1F4CB}', value:training.length+'个', label:'已报名', color:'b' },
      { icon:'✅', value:done+'个', label:'已完成', color:'y' },
      { icon:'\\u{23F1}', value:totalH+'h', label:'学习时长', color:'p' }
    ]
  }`;

const newKpi = `  if (key === 'training') {
    const canEnroll = trainingCourses.filter(c=>c.status==='报名中').length
    const enrolled = trainingEnrollments.length
    const done = trainingEnrollments.filter(e=>e.status==='已完成').length
    const totalLearningHours = trainingLearning.reduce((s,l)=>s+(l.watchedMinutes||0),0)/60
    return [
      { icon:'\\u{1F393}', value:canEnroll+'个', label:'可报名', color:'g' },
      { icon:'\\u{1F4CB}', value:enrolled+'个', label:'已报名', color:'b' },
      { icon:'✅', value:done+'个', label:'已完成', color:'y' },
      { icon:'\\u{23F1}', value:totalLearningHours.toFixed(1)+'h', label:'累计学习', color:'p' }
    ]
  }`;

if (s.includes(oldKpi)) {
  s = s.replace(oldKpi, newKpi);
  check('4-kpi', true);
} else {
  check('4-kpi', false);
  console.log('--- oldKpi not found, trying alternate match ---');
}

// ============================================================
// 5. Update quick actions (lines 586-591)
// ============================================================
const oldQA = `  if (key === 'training') return [
    { icon:'\\u{1F4DD}', label:'课程报名', action: showTrainingReg },
    { icon:'\\u{25B6}', label:'进入直播', action: enterLiveRoom },
    { icon:'\\u{1F4FA}', label:'课程回放', action: showReplayList },
    { icon:'\\u{1F4AC}', label:'问专家', action: askExpert }
  ]`;

const newQA = `  if (key === 'training') return [
    { icon:'\\u{1F4DD}', label:'课程报名', action: scrollToCourses },
    { icon:'\\u{25B6}', label:'当前直播', action: enterLiveRoom },
    { icon:'\\u{1F4FA}', label:'课程回放', action: showReplayList }
  ]`;

if (s.includes(oldQA)) {
  s = s.replace(oldQA, newQA);
  check('5-quick-actions', true);
} else {
  check('5-quick-actions', false);
}

// ============================================================
// 6. Update pageSubtitle (line 552)
// ============================================================
const oldSub = `training: '报名参加农技培训课程，随时学习'`;
const newSub = `training: '报名参加农技培训课程，随时随地学习最新农业技术'`;
if (s.includes(oldSub)) {
  s = s.replace(oldSub, newSub);
  check('6-subtitle', true);
} else {
  check('6-subtitle', false);
}

// ============================================================
// 7. Rewrite template block (lines 169-200)
// ============================================================
const oldTemplate = `        <!-- Training: 可报名课程 + 我的学习 -->
        <div v-if="curTab==='training'" class="tab-content">
          <div class="section-card">
            <div class="section-title">&#x1F393; 可报名课程</div>
            <div class="course-cards">
              <div class="course-card" v-for="c in availableCourses" :key="c.id">
                <div class="cc-header">
                  <span class="cc-title">{{ c.title }}</span>
                  <span class="tag g">{{ c.status }}</span>
                </div>
                <div class="cc-body">
                  <div class="cc-meta">{{ c.teacher }} | {{ c.date }} {{ c.time }} | {{ c.loc }}</div>
                  <div class="cc-meta">{{ c.duration }} | {{ c.type }} | 已报 {{ c.joined }}/{{ c.limit }}</div>
                </div>
                <button class="btn btn-p btn-s" @click="enrollCourse(c)">立即报名</button>
              </div>
            </div>
          </div>
          <div class="section-card" style="margin-top:14px">
            <div class="section-title">&#x1F4DA; 我的学习</div>
            <table class="data-table">
              <thead><tr><th>课程名称</th><th>讲师</th><th>日期</th><th>状态</th><th>进度</th></tr></thead>
              <tbody>
                <tr v-for="r in training" :key="r.id">
                  <td>{{ r.title }}</td><td>{{ r.teacher }}</td><td>{{ r.date }}</td>
                  <td><span class="tag" :class="r.status==='已完成'?'g':r.status==='进行中'?'b':'dim'">{{ r.status }}</span></td>
                  <td><div class="progress-bar" style="width:80px"><div class="fill" :class="r.status==='已完成'?'g':'b'" :style="{width:(r.progress||'0%')}"></div></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>`;

const newTemplate = `        <!-- Training: 可报名课程 + 我的培训 + 近期培训提醒 -->
        <div v-if="curTab==='training'" class="tab-content">
          <!-- 可报名课程 -->
          <div class="section-card" id="available-courses-section">
            <div class="section-title">&#x1F393; 可报名课程</div>
            <div class="course-cards">
              <div class="course-card" v-for="c in availableCoursesComputed" :key="c.id">
                <div class="cc-left">
                  <div class="cc-header">
                    <span class="cc-title">{{ c.title }}</span>
                    <span class="tag" :class="c.status==='报名中'?'g':'dim'">{{ c.status }}</span>
                  </div>
                  <div class="cc-body">
                    <div class="cc-meta-row">
                      <span class="cc-meta-label">培训方式</span>
                      <span class="cc-meta-val">{{ getTypeLabel(c) }}</span>
                      <span class="cc-meta-label">培训时间</span>
                      <span class="cc-meta-val">{{ c.date }} {{ c.time }}</span>
                    </div>
                    <div class="cc-meta-row">
                      <span class="cc-meta-label">{{ c.type==='LIVE'||c.type==='ONLINE'?'直播平台':'地点' }}</span>
                      <span class="cc-meta-val">{{ c.loc }}</span>
                      <span class="cc-meta-label">讲师</span>
                      <span class="cc-meta-val">{{ c.teacher }}</span>
                    </div>
                    <div class="cc-meta-row">
                      <span class="cc-meta-label">课程时长</span>
                      <span class="cc-meta-val">{{ c.duration }}</span>
                      <span class="cc-meta-label">报名人数</span>
                      <span class="cc-meta-val">已报{{ c.joined }}/{{ c.limit }}人</span>
                    </div>
                  </div>
                </div>
                <div class="cc-right">
                  <button v-if="!isEnrolled(c.id)" class="btn btn-p btn-s" @click="showCourseDetail(c)">查看详情</button>
                  <button v-if="!isEnrolled(c.id)" class="btn btn-p btn-s" style="margin-top:6px" @click="showCourseDetail(c)">立即报名</button>
                  <template v-if="isEnrolled(c.id)">
                    <span class="tag g" style="margin-bottom:6px">已报名</span>
                    <button v-if="canCancelEnroll(c)" class="btn btn-d btn-s" @click="cancelEnroll(c)">取消报名</button>
                  </template>
                </div>
              </div>
              <div v-if="!availableCoursesComputed.length" style="color:#6F91A8;text-align:center;padding:30px 0;font-size:13px">暂无可报名课程</div>
            </div>
          </div>

          <!-- 我的培训 -->
          <div class="section-card" style="margin-top:14px">
            <div class="section-title">&#x1F4DA; 我的培训</div>
            <table class="data-table">
              <thead><tr><th>课程名称</th><th>培训方式</th><th>培训时间</th><th>状态</th><th>操作</th></tr></thead>
              <tbody>
                <tr v-for="r in myTrainingList" :key="r.id">
                  <td>{{ r.title }}</td>
                  <td>{{ getTypeLabel(r) }}</td>
                  <td>{{ r.date }} {{ r.time }}</td>
                  <td><span class="tag" :class="r.status==='已完成'?'g':r.status==='进行中'?'b':'dim'">{{ r.status }}</span></td>
                  <td>
                    <button v-if="r.status==='已完成'" class="btn btn-p btn-s" @click="showReplayFor(r)">查看回放</button>
                    <button v-if="r.status==='进行中'&&(r.type==='LIVE'||r.type==='ONLINE')" class="btn btn-p btn-s" @click="continueLearning(r)">继续学习</button>
                    <button class="btn btn-o btn-s" @click="showTrainingDetail(r)" style="margin-left:4px">查看详情</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="!myTrainingList.length" style="color:#6F91A8;text-align:center;padding:30px 0;font-size:13px">暂无培训记录</div>
          </div>

          <!-- 近期培训提醒 -->
          <div class="section-card" style="margin-top:14px">
            <div class="section-title">&#x1F4C5; 近期培训提醒</div>
            <div v-if="upcomingTraining" class="training-reminder">
              <div class="tr-card">
                <div class="tr-info">
                  <div class="tr-course-name">{{ upcomingTraining.title }}</div>
                  <div class="tr-meta">
                    <span>&#x1F4C5; {{ upcomingTraining.date }} {{ upcomingTraining.time }}</span>
                    <span>&#x1F4CD; {{ upcomingTraining.loc }}</span>
                    <span>&#x1F468;‍&#x1F3EB; {{ upcomingTraining.teacher }}</span>
                  </div>
                  <div class="tr-hint">&#x23F0; 您已报名，请提前10分钟到场</div>
                </div>
                <div class="tr-action">
                  <button class="btn btn-p btn-s" @click="showTrainingDetail(upcomingTraining)">查看详情</button>
                </div>
              </div>
            </div>
            <div v-else style="color:#6F91A8;text-align:center;padding:30px 0;font-size:13px">近期暂无已报名培训</div>
          </div>
        </div>`;

if (s.includes(oldTemplate)) {
  s = s.replace(oldTemplate, newTemplate);
  check('7-template', true);
} else {
  check('7-template', false);
}

// ============================================================
// 8. Delete chart block for training (line 266)
// ============================================================
const oldChart = `        <div class="chart-block" v-if="curTab==='training'"><div id="chart_train_bar" style="width:100%;height:200px"></div></div>\n`;
if (s.includes(oldChart)) {
  s = s.replace(oldChart, '');
  check('8-chart-html', true);
} else {
  check('8-chart-html', false);
}

// ============================================================
// 9. Delete old functions + add new functions
// Replace enrollCourse + showTrainingReg with new training functions
// ============================================================
const oldFuncs = `function enrollCourse(c){
  if(confirm('确认报名：'+c.title+'？')){
    training.unshift({id:uid(),title:c.title,teacher:c.teacher,date:c.date,time:c.time,loc:c.loc,duration:c.duration,type:c.type,joined:c.joined+1,limit:c.limit,status:'进行中',progress:'0%'})
    c.joined++; toast('报名成功！','ok')
  }
}
function showTrainingReg(){
  let h=''; availableCourses.forEach(c=>{h+='<div style="background:rgba(10,36,68,0.55);padding:10px;border-radius:8px;margin-bottom:8px"><div style="display:flex;justify-content:space-between;align-items:center"><span style="color:#fff;font-weight:600;font-size:12px">'+c.title+'</span><span class="tag g">'+c.status+'</span></div><div style="font-size:10px;color:#6F91A8;margin-top:4px">'+c.teacher+' | '+c.date+' | '+c.loc+'</div><button class="btn btn-p btn-s" style="margin-top:6px" onclick="window._svc.enrollFromList(\\''+c.title+'\\')">报名</button></div>'})
  opMod('\\u{1F393} 课程报名',h)
}`;

const newFuncs = `// ---- Training actions ----
function scrollToCourses(){
  const el=document.getElementById('available-courses-section')
  if(el){
    el.scrollIntoView({behavior:'smooth',block:'start'})
    el.style.transition='box-shadow 0.3s'
    el.style.boxShadow='0 0 0 2px rgba(40,199,250,0.35)'
    setTimeout(()=>{el.style.boxShadow=''},1500)
  }
}
function showCourseDetail(c){
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
}
function confirmEnroll(courseId){
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
}
function canCancelEnroll(c){
  if(!c.deadline)return true
  return new Date()<=new Date(c.deadline)
}
function cancelEnroll(c){
  const idx=trainingEnrollments.findIndex(e=>e.courseId===c.id)
  if(idx===-1)return
  trainingEnrollments.splice(idx,1)
  c.joined=Math.max(0,c.joined-1)
  toast('已取消报名','ok')
}
function continueLearning(course){
  const learning=trainingLearning.find(l=>l.courseId===course.id)
  const watched=learning?learning.watchedMinutes:0
  const total=learning?learning.totalMinutes:(parseFloat(course.duration)*60||60)
  const pct=Math.round((watched/total)*100)
  toast('继续学习：\\u300C'+course.title+'\\u300D 已学习 '+pct+'%','info')
}
function showReplayFor(course){
  toast('正在加载回放：\\u300C'+course.title+'\\u300D','info')
}
function showTrainingDetail(course){
  showCourseDetail(course)
}`;

if (s.includes(oldFuncs)) {
  s = s.replace(oldFuncs, newFuncs);
  check('9-funcs', true);
} else {
  check('9-funcs', false);
}

// ============================================================
// 10. Replace askExpert + enterLiveRoom + showReplayList (lines 1398-1400)
// ============================================================
const oldLive = `function enterLiveRoom(){toast('直播间：「苹果夏季修剪技术培训」正在直播中，观看人数：42人','info')}
function showReplayList(){toast('课程回放：① 病虫害防治基础(6/12) ② 电商直播入门(6/5) ③ 有机种植技术(5/28)','info')}
function askExpert(){const q=prompt('请输入您的问题：');if(q){toast('已提交问题给专家，预计24小时内回复','ok')}}`;

const newLive = `function enterLiveRoom(){
  const now=new Date()
  const enrolledCourseIds=trainingEnrollments.map(e=>e.courseId)
  const allCourses=historicalEnrolledCourses.concat(trainingCourses)
  const liveCourse=allCourses.find(c=>{
    if(c.type!=='LIVE'&&c.type!=='ONLINE')return false
    if(!enrolledCourseIds.includes(c.id))return false
    const courseStart=new Date(c.date+'T'+c.time)
    const durMatch=c.duration.match(/(\\d+(\\.\\d+)?)/)
    const durHours=durMatch?parseFloat(durMatch[1]):1
    const courseEnd=new Date(courseStart.getTime()+durHours*3600000)
    return now>=courseStart&&now<=courseEnd
  })
  if(liveCourse){toast('正在进入直播：\\u300C'+liveCourse.title+'\\u300D','info')}
  else{toast('暂无直播','info')}
}
function showReplayList(){
  const replayable=myTrainingList.value.filter(c=>c.status==='已完成')
  if(!replayable.length){toast('暂无已完成的课程可回放','info');return}
  let h='<div class="mod-desc">已完成课程的录制回放</div>'
  replayable.forEach(c=>{
    h+='<div class="svc-policy-item" onclick="window._svc.showReplayForById('+c.id+')" style="cursor:pointer">'
    h+='<div class="svc-policy-item-header"><span style="color:#fff;font-weight:600;font-size:13px">'+c.title+'</span>'
    h+='<span class="tag g">已完成</span></div>'
    h+='<div style="font-size:11px;color:#6F91A8;margin-top:4px">'+c.teacher+' | '+c.date+' | '+getTypeLabel(c)+'</div>'
    h+='<div style="color:#28C7FA;font-size:10px;margin-top:4px">\\u25B6 点击查看回放</div></div>'
  })
  opMod('\\u{1F4FA} 课程回放',h,'mod-md')
}`;

if (s.includes(oldLive)) {
  s = s.replace(oldLive, newLive);
  check('10-live-replay', true);
} else {
  check('10-live-replay', false);
}

// ============================================================
// 11. Remove initTrainChart from initCurrentChart (line 1469)
// ============================================================
const oldChartInit = `  else if(key==='training')initTrainChart()
  else if(key==='appointment')initApptPieChart()`;
const newChartInit = `  else if(key==='appointment')initApptPieChart()`;
if (s.includes(oldChartInit)) {
  s = s.replace(oldChartInit, newChartInit);
  check('11-chart-init', true);
} else {
  check('11-chart-init', false);
}

// ============================================================
// 12. Delete initTrainChart function (lines 1505-1508)
// ============================================================
const oldTrainChart = `function initTrainChart(){
  const el=document.getElementById('chart_train_bar');if(!el)return;chartInstance=echarts.init(el)
  chartInstance.setOption({title:{text:'课程报名情况',textStyle:{color:'#6b7a8d',fontSize:11,fontWeight:400},left:0,top:-6},tooltip:{trigger:'axis',backgroundColor:'#ffffff',borderColor:'rgba(57,217,138,0.30)',textStyle:{color:'#1e293b',fontSize:10}},grid:{left:8,right:30,top:28,bottom:24},xAxis:{type:'category',data:['病虫害防治','电商直播','智慧农业'],axisLabel:{color:'#6b7a8d',fontSize:9,rotate:15},axisLine:{lineStyle:{color:'rgba(4,62,107,0.12)'}}},yAxis:{type:'value',name:'人',axisLabel:{color:'#6b7a8d',fontSize:9},splitLine:{lineStyle:{color:'rgba(14,165,233,0.06)'}}},series:[{type:'bar',barWidth:28,itemStyle:{borderRadius:[3,3,0,0]},data:[{value:22,itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#28C7FA'},{offset:1,color:'rgba(57,217,138,0.20)'}])}},{value:35,itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#39D98A'},{offset:1,color:'rgba(16,214,160,.2)'}])}},{value:20,itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#28C7FA'},{offset:1,color:'rgba(139,92,246,.2)'}])}}]}]})
}`;

if (s.includes(oldTrainChart)) {
  s = s.replace(oldTrainChart, '');
  check('12-delete-chart-func', true);
} else {
  check('12-delete-chart-func', false);
}

// ============================================================
// 13. Update onMounted global handlers (line 1588)
// ============================================================
const oldMount = `enrollFromList:(title)=>{clsMod();const c=availableCourses.find(x=>x.title===title);if(c)enrollCourse(c)}`;

const newMount = `confirmEnroll:(courseId)=>{confirmEnroll(courseId)},showReplayForById:(id)=>{const c=myTrainingList.value.find(x=>x.id===id);if(c){clsMod();showReplayFor(c)}}`;

if (s.includes(oldMount)) {
  s = s.replace(oldMount, newMount);
  check('13-mount-handlers', true);
} else {
  check('13-mount-handlers', false);
}

// ============================================================
// 14. Add computed properties after the helper functions (before KPI)
// We'll insert them right before "// ===== KPI CARDS ====="
// ============================================================
const oldKpiComment = `// ===== KPI CARDS =====`;
const newComputedBlock = `// ---- Training computed ----
const availableCoursesComputed = computed(() => trainingCourses.filter(c => c.status === '报名中'))

const myTrainingList = computed(() => {
  const enrolledCourseIds = trainingEnrollments.map(e => e.courseId)
  const allEnrolled = historicalEnrolledCourses.concat(
    trainingCourses.filter(c => enrolledCourseIds.includes(c.id))
  )
  return allEnrolled.map(c => ({ ...c, enrollment: trainingEnrollments.find(e => e.courseId === c.id) || null }))
})

const upcomingTraining = computed(() => {
  const now = new Date()
  const enrolledCourseIds = trainingEnrollments.map(e => e.courseId)
  const allEnrolled = historicalEnrolledCourses.concat(
    trainingCourses.filter(c => enrolledCourseIds.includes(c.id))
  )
  const upcoming = allEnrolled
    .filter(c => new Date(c.date + 'T' + c.time) > now)
    .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
  return upcoming.length > 0 ? upcoming[0] : null
})

// ===== KPI CARDS =====`;

if (s.includes(oldKpiComment)) {
  s = s.replace(oldKpiComment, newComputedBlock);
  check('14-computed', true);
} else {
  check('14-computed', false);
}

// ============================================================
// 15. Update CSS (lines 1736-1742)
// ============================================================
const oldCSS = `/* Course cards */
.course-cards { display:flex; flex-direction:column; gap:10px; }
.course-card { background:rgba(10,36,68,0.40); border:1px solid rgba(255,255,255,0.04); border-radius:12px; padding:14px 16px; display:flex; align-items:center; gap:14px; }
.cc-header { display:flex; align-items:center; gap:8px; min-width:200px; }
.cc-title { font-size:13px; font-weight:600; color:#fff; }
.cc-body { flex:1; }
.cc-meta { font-size:11px; color:#6F91A8; }`;

const newCSS = `/* Course cards (training tab) */
.course-cards { display:flex; flex-direction:column; gap:10px; }
.course-card { background:rgba(10,36,68,0.40); border:1px solid rgba(255,255,255,0.04); border-radius:12px; padding:14px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
.cc-left { flex:1; min-width:0; }
.cc-header { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
.cc-title { font-size:14px; font-weight:600; color:#fff; }
.cc-body { display:flex; flex-direction:column; gap:3px; }
.cc-meta-row { display:flex; align-items:center; gap:8px; font-size:11px; flex-wrap:wrap; }
.cc-meta-label { color:#50738A; white-space:nowrap; }
.cc-meta-val { color:#B7D3E8; white-space:nowrap; }
.cc-meta-row .cc-meta-label + .cc-meta-val { margin-right:14px; }
.cc-right { display:flex; flex-direction:column; align-items:center; flex-shrink:0; min-width:80px; }

/* Training reminder card */
.training-reminder { }
.tr-card { background:rgba(40,199,111,0.05); border:1px solid rgba(40,199,111,0.10); border-radius:10px; padding:14px 16px; display:flex; align-items:center; justify-content:space-between; gap:14px; }
.tr-info { flex:1; min-width:0; }
.tr-course-name { font-size:14px; font-weight:600; color:#fff; margin-bottom:6px; }
.tr-meta { display:flex; gap:16px; font-size:11px; color:#6F91A8; flex-wrap:wrap; margin-bottom:6px; }
.tr-hint { font-size:11px; color:#F5B83D; }
.tr-action { flex-shrink:0; }`;

if (s.includes(oldCSS)) {
  s = s.replace(oldCSS, newCSS);
  check('15-css', true);
} else {
  check('15-css', false);
}

// ============================================================
// Write result
// ============================================================
fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== FINAL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
