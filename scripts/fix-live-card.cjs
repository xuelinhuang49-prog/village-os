// Fix: persistent live-stream floating card (replaces toast-based enterLiveRoom)
// + "进入直播" button in 我的培训 for currently-live courses
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/ServicePage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// === 1. Add isCourseLiveNow helper + liveCard state after training helpers ===
const oldAfterHelpers = `function getTypeLabel(course){ const map={OFFLINE:'线下培训',ONLINE:'线上课程',LIVE:'线上直播',HYBRID:'线下+线上'}; return map[course.type]||course.type }

const dataMap`;

const newAfterHelpers = `function getTypeLabel(course){ const map={OFFLINE:'线下培训',ONLINE:'线上课程',LIVE:'线上直播',HYBRID:'线下+线上'}; return map[course.type]||course.type }
function isCourseLiveNow(course){
  if(course.type!=='LIVE'&&course.type!=='ONLINE')return false
  const now=new Date(),start=new Date(course.date+'T'+course.time)
  const durMatch=course.duration.match(/(\\d+(\\.\\d+)?)/)
  const durHours=durMatch?parseFloat(durMatch[1]):1
  const end=new Date(start.getTime()+durHours*3600000)
  return now>=start&&now<=end
}
function findNextLiveCourse(){
  const now=new Date()
  const enrolledIds=trainingEnrollments.map(e=>e.courseId)
  const all=historicalEnrolledCourses.concat(trainingCourses)
  const upcoming=all.filter(c=>enrolledIds.includes(c.id)&&(c.type==='LIVE'||c.type==='ONLINE')&&new Date(c.date+'T'+c.time)>now)
  upcoming.sort((a,b)=>new Date(a.date+'T'+a.time)-new Date(b.date+'T'+b.time))
  return upcoming.length>0?upcoming[0]:null
}

// Live-stream floating card state
const liveCard = reactive({ vis: false, isLive: false, course: null, nextCourse: null })

const dataMap`;

if (s.includes(oldAfterHelpers)) { s = s.replace(oldAfterHelpers, newAfterHelpers); check('1-helpers+liveCard', true); }
else { check('1-helpers+liveCard', false); }

// === 2. Add isLive field to myTrainingList computed ===
const oldMTL = `    return { ...c, enrollment, displayStatus }
  })`;

const newMTL = `    const isLive=isCourseLiveNow(c)
    return { ...c, enrollment, displayStatus, isLive }
  })`;

if (s.includes(oldMTL)) { s = s.replace(oldMTL, newMTL); check('2-myTrainingList-isLive', true); }
else { check('2-myTrainingList-isLive', false); }

// === 3. Replace enterLiveRoom + add closeLiveCard/enterLiveStream ===
const oldEnterLive = `function enterLiveRoom(){
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
}`;

const newEnterLive = `function closeLiveCard(){ liveCard.vis=false }
function enterLiveStream(course){
  liveCard.vis=false
  toast('\\u{1F4FA} 正在进入直播：\\u300C'+course.title+'\\u300D','info')
}
function enterLiveRoom(){
  if(liveCard.vis){ liveCard.vis=false; return }
  const now=new Date()
  const enrolledIds=trainingEnrollments.map(e=>e.courseId)
  const allCourses=historicalEnrolledCourses.concat(trainingCourses)
  const live=allCourses.find(c=>{
    if(c.type!=='LIVE'&&c.type!=='ONLINE')return false
    if(!enrolledIds.includes(c.id))return false
    const start=new Date(c.date+'T'+c.time)
    const durMatch=c.duration.match(/(\\d+(\\.\\d+)?)/)
    const durHours=durMatch?parseFloat(durMatch[1]):1
    const end=new Date(start.getTime()+durHours*3600000)
    return now>=start&&now<=end
  })
  if(live){
    liveCard.isLive=true
    liveCard.course=live
    liveCard.nextCourse=null
  }else{
    liveCard.isLive=false
    liveCard.course=null
    liveCard.nextCourse=findNextLiveCourse()
  }
  liveCard.vis=true
}`;

if (s.includes(oldEnterLive)) { s = s.replace(oldEnterLive, newEnterLive); check('3-enterLiveRoom', true); }
else { check('3-enterLiveRoom', false); }

// === 4. Add floating live card in template (after </header>) ===
const oldAfterHeader = `    </header>

    <!-- ===== TAB BAR ===== -->`;

const newAfterHeader = `    </header>

    <!-- ===== LIVE STREAM FLOATING CARD ===== -->
    <div v-if="liveCard.vis" class="live-float-card">
      <div class="lfc-header">
        <span>&#x1F4FA; 当前直播</span>
        <button class="lfc-close" @click="closeLiveCard">&times;</button>
      </div>
      <template v-if="liveCard.isLive">
        <div class="lfc-course-name">{{ liveCard.course.title }}</div>
        <div class="lfc-meta">
          <div>&#x1F468;&#x200D;&#x1F3EB; {{ liveCard.course.teacher }}</div>
          <div>&#x1F4C5; 今天 {{ liveCard.course.time }} 开始</div>
          <div>&#x1F4CD; {{ liveCard.course.loc }}</div>
        </div>
        <div class="lfc-status-live">&#x1F7E2; 直播状态：正在直播</div>
        <button class="lfc-btn lfc-btn-primary" @click="enterLiveStream(liveCard.course)">进入直播</button>
      </template>
      <template v-else>
        <div class="lfc-no-live">当前暂无正在进行的直播课程</div>
        <template v-if="liveCard.nextCourse">
          <div class="lfc-divider"></div>
          <div class="lfc-next-label">下一场：</div>
          <div class="lfc-course-name">{{ liveCard.nextCourse.title }}</div>
          <div class="lfc-meta" style="margin-bottom:12px">&#x1F4C5; {{ liveCard.nextCourse.date }} {{ liveCard.nextCourse.time }}</div>
          <button class="lfc-btn lfc-btn-outline" @click="showCourseDetail(liveCard.nextCourse);closeLiveCard()">查看课程详情</button>
        </template>
      </template>
    </div>

    <!-- ===== TAB BAR ===== -->`;

if (s.includes(oldAfterHeader)) { s = s.replace(oldAfterHeader, newAfterHeader); check('4-live-card-template', true); }
else { check('4-live-card-template', false); }

// === 5. Update "我的培训" table: show "进入直播" for currently-live courses ===
const oldTableBtns = `                    <button v-if="r.displayStatus==='已完成'&&r.replayStatus==='PUBLISHED'" class="btn btn-p btn-s" @click="showReplayFor(r)">查看回放</button>
                    <button v-if="r.displayStatus==='进行中'&&(r.type==='LIVE'||r.type==='ONLINE')" class="btn btn-p btn-s" @click="continueLearning(r)">继续学习</button>
                    <button class="btn btn-o btn-s" @click="showTrainingDetail(r)" style="margin-left:4px">查看详情</button>`;

const newTableBtns = `                    <button v-if="r.displayStatus==='已完成'&&r.replayStatus==='PUBLISHED'" class="btn btn-p btn-s" @click="showReplayFor(r)">查看回放</button>
                    <button v-if="r.displayStatus==='进行中'&&(r.type==='LIVE'||r.type==='ONLINE')&&r.isLive" class="btn btn-g btn-s" @click="enterLiveStream(r)">进入直播</button>
                    <button v-else-if="r.displayStatus==='进行中'&&(r.type==='LIVE'||r.type==='ONLINE')" class="btn btn-p btn-s" @click="continueLearning(r)">继续学习</button>
                    <button class="btn btn-o btn-s" @click="showTrainingDetail(r)" style="margin-left:4px">查看详情</button>`;

if (s.includes(oldTableBtns)) { s = s.replace(oldTableBtns, newTableBtns); check('5-table-buttons', true); }
else { check('5-table-buttons', false); }

// === 6. Add CSS for live floating card ===
// Insert before the .svc-page closing or before a known CSS anchor
const oldCssAnchor = `.training-reminder { }`;

const newCssWithLiveCard = `/* Live-stream floating card */
.live-float-card { position:fixed; top:56px; right:16px; width:340px; max-width:calc(100vw - 32px); background:linear-gradient(180deg,#0B2D4F,#071B2D); border:1px solid rgba(40,199,250,0.15); border-radius:12px; padding:16px 18px; z-index:999; box-shadow:0 8px 32px rgba(0,0,0,0.45); font-size:12px; }
.lfc-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.lfc-header span { font-size:14px; font-weight:600; color:#fff; }
.lfc-close { background:none; border:none; color:#6F91A8; font-size:18px; cursor:pointer; padding:0; line-height:1; }
.lfc-close:hover { color:#fff; }
.lfc-course-name { font-size:14px; font-weight:600; color:#fff; margin-bottom:8px; line-height:1.4; }
.lfc-meta { font-size:11px; color:#6F91A8; line-height:1.8; margin-bottom:10px; }
.lfc-meta div { margin-bottom:2px; }
.lfc-status-live { font-size:12px; color:#28C76F; font-weight:600; margin-bottom:14px; }
.lfc-no-live { font-size:12px; color:#B7D3E8; margin-bottom:4px; }
.lfc-divider { height:1px; background:rgba(255,255,255,0.06); margin:12px 0; }
.lfc-next-label { font-size:11px; color:#6F91A8; margin-bottom:6px; }
.lfc-btn { display:block; width:100%; padding:10px 0; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; text-align:center; font-family:inherit; }
.lfc-btn-primary { background:#28C76F; color:#fff; }
.lfc-btn-primary:hover { background:#20B15A; }
.lfc-btn-outline { background:transparent; color:#28C7FA; border:1px solid rgba(40,199,250,0.30); }
.lfc-btn-outline:hover { background:rgba(40,199,250,0.08); }

.training-reminder { }`;

if (s.includes(oldCssAnchor)) { s = s.replace(oldCssAnchor, newCssWithLiveCard); check('6-css', true); }
else { check('6-css', false); }

// === 7. Add btn-g (green button) style if not exists ===
const oldBtnStyle = `.btn-p { background:#4A88F5; color:#fff; }
.btn-o { background:transparent; color:#6F91A8; border:1px solid rgba(111,145,168,0.25); }`;

const newBtnStyle = `.btn-p { background:#4A88F5; color:#fff; }
.btn-g { background:#28C76F; color:#fff; }
.btn-o { background:transparent; color:#6F91A8; border:1px solid rgba(111,145,168,0.25); }`;

if (s.includes(oldBtnStyle)) { s = s.replace(oldBtnStyle, newBtnStyle); check('7-btn-g-style', true); }
else { check('7-btn-g-style', false); }

// === 8. Update window._svc to expose closeLiveCard and enterLiveStream ===
const oldWindowSvc = `confirmEnroll:(courseId)=>{confirmEnroll(courseId)},cancelEnrollFromDetail:(courseId)=>{cancelEnrollFromDetail(courseId)},openResource:(url)=>{openResource(url)},showReplayForById:(id)=>{const c=myTrainingList.value.find(x=>x.id===id);if(c){clsMod();showReplayFor(c)}},toast:(m,t)=>{toast(m,t)}`;

const newWindowSvc = `confirmEnroll:(courseId)=>{confirmEnroll(courseId)},cancelEnrollFromDetail:(courseId)=>{cancelEnrollFromDetail(courseId)},openResource:(url)=>{openResource(url)},showReplayForById:(id)=>{const c=myTrainingList.value.find(x=>x.id===id);if(c){clsMod();showReplayFor(c)}},closeLiveCard:()=>{closeLiveCard()},toast:(m,t)=>{toast(m,t)}`;

if (s.includes(oldWindowSvc)) { s = s.replace(oldWindowSvc, newWindowSvc); check('8-window-svc', true); }
else { check('8-window-svc', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== FINAL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
