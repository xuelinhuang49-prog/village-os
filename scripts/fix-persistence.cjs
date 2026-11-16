// Fix: localStorage persistence for training enrollments
// All UI regions (可报名课程, 我的培训, 近期提醒, KPI stats) derive from trainingEnrollments
// → persisting enrollments automatically keeps everything in sync across refreshes
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/ServicePage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// === 1. Insert persistence layer after trainingEnrollments initialization ===
const oldAfterEnrollments = `const trainingEnrollments = reactive([
  { id: 101, courseId: 51, userId: 1, enrollDate: '2026-06-10', status: '已完成', progress: '100%', learningHours: 2.0 },
  { id: 102, courseId: 52, userId: 1, enrollDate: '2026-07-05', status: '进行中', progress: '60%', learningHours: 0.9 }
])

// trainingLearning:`;

const newAfterEnrollments = `const trainingEnrollments = reactive([
  { id: 101, courseId: 51, userId: 1, enrollDate: '2026-06-10', status: '已完成', progress: '100%', learningHours: 2.0 },
  { id: 102, courseId: 52, userId: 1, enrollDate: '2026-07-05', status: '进行中', progress: '60%', learningHours: 0.9 }
])

// ===== Training enrollment persistence (localStorage, API-ready) =====
// Reserved API interfaces:
//   POST   /api/training/enrollment        — create enrollment
//   GET    /api/training/enrollment/my     — list my enrollments
//   DELETE /api/training/enrollment/{id}   — cancel enrollment
const TRAINING_ENROLL_STORAGE_KEY = 'svc_training_enrollments'

function loadPersistedEnrollments() {
  try { const raw = localStorage.getItem(TRAINING_ENROLL_STORAGE_KEY); return raw ? JSON.parse(raw) : [] }
  catch(e) { return [] }
}

function persistEnrollments() {
  const runtime = trainingEnrollments.filter(e => e.courseId >= 41)
  localStorage.setItem(TRAINING_ENROLL_STORAGE_KEY, JSON.stringify(runtime))
}

;(function initTrainingPersistence() {
  const persisted = loadPersistedEnrollments()
  if (persisted.length === 0) return
  const maxId = Math.max(...persisted.map(e => e.id), 0)
  if (maxId >= uidCounter) uidCounter = maxId
  for (const p of persisted) {
    if (!trainingEnrollments.some(e => e.courseId === p.courseId)) {
      trainingEnrollments.unshift(p)
      const course = trainingCourses.find(c => c.id === p.courseId)
      if (course) course.joined++
    }
  }
})()

// trainingLearning:`;

if (s.includes(oldAfterEnrollments)) { s = s.replace(oldAfterEnrollments, newAfterEnrollments); check('1-persistence-layer', true); }
else { check('1-persistence-layer', false); }

// === 2. Add persistEnrollments() to confirmEnroll ===
const oldConfirmSave = `  c.joined++
  toast('\\u2705 报名成功 \\u2014 '+c.title+' | '+c.date+' '+c.time+' | '+c.loc,'ok')
  // Re-render detail modal to show enrolled state
  showCourseDetail(c)`;

const newConfirmSave = `  c.joined++
  persistEnrollments()
  toast('\\u2705 报名成功 \\u2014 '+c.title+' | '+c.date+' '+c.time+' | '+c.loc,'ok')
  // Re-render detail modal to show enrolled state
  showCourseDetail(c)`;

if (s.includes(oldConfirmSave)) { s = s.replace(oldConfirmSave, newConfirmSave); check('2-confirm-persist', true); }
else { check('2-confirm-persist', false); }

// === 3. Add persistEnrollments() to cancelEnroll ===
const oldCancelSave = `  trainingEnrollments.splice(idx,1)
  c.joined=Math.max(0,c.joined-1)
  toast('已取消报名','ok')`;

const newCancelSave = `  trainingEnrollments.splice(idx,1)
  c.joined=Math.max(0,c.joined-1)
  persistEnrollments()
  toast('已取消报名','ok')`;

if (s.includes(oldCancelSave)) { s = s.replace(oldCancelSave, newCancelSave); check('3-cancel-persist', true); }
else { check('3-cancel-persist', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== FINAL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
