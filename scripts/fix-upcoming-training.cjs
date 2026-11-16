// Fix: upcomingTraining returns up to 3 items, template loops over them
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/ServicePage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// === 1. Replace upcomingTraining computed: array with up to 3 items ===
const oldComputed = `const upcomingTraining = computed(() => {
  const now = new Date()
  const enrolledCourseIds = trainingEnrollments.map(e => e.courseId)
  const allEnrolled = historicalEnrolledCourses.concat(
    trainingCourses.filter(c => enrolledCourseIds.includes(c.id))
  )
  const upcoming = allEnrolled
    .filter(c => new Date(c.date + 'T' + c.time) > now)
    .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
  return upcoming.length > 0 ? upcoming[0] : null
})`;

const newComputed = `const upcomingTraining = computed(() => {
  const now = new Date()
  const enrolledCourseIds = trainingEnrollments.map(e => e.courseId)
  const allEnrolled = historicalEnrolledCourses.concat(
    trainingCourses.filter(c => enrolledCourseIds.includes(c.id))
  )
  return allEnrolled
    .filter(c => new Date(c.date + 'T' + c.time) > now)
    .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
    .slice(0, 3)
})
const upcomingCount = computed(() => {
  const now = new Date()
  const enrolledCourseIds = trainingEnrollments.map(e => e.courseId)
  const allEnrolled = historicalEnrolledCourses.concat(
    trainingCourses.filter(c => enrolledCourseIds.includes(c.id))
  )
  return allEnrolled.filter(c => new Date(c.date + 'T' + c.time) > now).length
})`;

if (s.includes(oldComputed)) { s = s.replace(oldComputed, newComputed); check('1-upcomingTraining-computed', true); }
else { check('1-upcomingTraining-computed', false); }

// === 2. Replace template: v-for loop over upcomingTraining array ===
const oldTemplate = `            <div v-if="upcomingTraining" class="training-reminder">
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
            <div v-else style="color:#6F91A8;text-align:center;padding:30px 0;font-size:13px">近期暂无已报名培训</div>`;

const newTemplate = `            <div v-if="upcomingTraining.length>0" class="training-reminder">
              <div v-for="(t,idx) in upcomingTraining" :key="t.id" class="tr-card" :style="idx>0?'margin-top:8px':''">
                <div class="tr-info">
                  <div class="tr-course-name">{{ t.title }}</div>
                  <div class="tr-meta">
                    <span>&#x1F4C5; {{ t.date }} {{ t.time }}</span>
                    <span>&#x1F4CD; {{ t.loc }}</span>
                    <span>&#x1F468;‍&#x1F3EB; {{ t.teacher }}</span>
                  </div>
                  <div class="tr-hint">{{ t.type==='LIVE'?'&#x23F0; 您已报名，开课后可进入直播':'&#x23F0; 您已报名，请提前10分钟到场' }}</div>
                </div>
                <div class="tr-action">
                  <button class="btn btn-p btn-s" @click="showTrainingDetail(t)">查看详情</button>
                </div>
              </div>
              <div v-if="upcomingCount>3" style="text-align:center;margin-top:10px">
                <a href="javascript:void(0)" @click="scrollToMyTraining" style="color:#28C7FA;font-size:12px;text-decoration:none">查看全部培训 &#x2192;</a>
              </div>
            </div>
            <div v-else style="color:#6F91A8;text-align:center;padding:30px 0;font-size:13px">近期暂无已报名培训</div>`;

if (s.includes(oldTemplate)) { s = s.replace(oldTemplate, newTemplate); check('2-template-loop', true); }
else { check('2-template-loop', false); }

// === 3. Add scrollToMyTraining function ===
// Insert before scrollToCourses
const oldScrollAnchor = `// ---- Training actions ----
function scrollToCourses(){`;

const newScrollAnchor = `// ---- Training actions ----
function scrollToMyTraining(){
  const el=document.getElementById('my-training-section')
  if(el){
    el.scrollIntoView({behavior:'smooth',block:'start'})
    el.style.transition='box-shadow 0.3s'
    el.style.boxShadow='0 0 0 2px rgba(40,199,250,0.35)'
    setTimeout(()=>{el.style.boxShadow=''},1500)
  }
}
function scrollToCourses(){`;

if (s.includes(oldScrollAnchor)) { s = s.replace(oldScrollAnchor, newScrollAnchor); check('3-scrollToMyTraining', true); }
else { check('3-scrollToMyTraining', false); }

// === 4. Add id to "我的培训" section in template ===
// Find: "我的培训" section title and add id
const oldMyTrainingTitle = `<div class="section-title">\\u{1F4DA} 我的培训</div>`;
const newMyTrainingTitle = `<div class="section-title" id="my-training-section">\\u{1F4DA} 我的培训</div>`;

if (s.includes(oldMyTrainingTitle)) { s = s.replace(oldMyTrainingTitle, newMyTrainingTitle); check('4-my-training-id', true); }
else { check('4-my-training-id', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== FINAL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
