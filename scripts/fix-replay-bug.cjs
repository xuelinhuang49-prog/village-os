// Fix: clsMod timeout clearing opMod content + replay data + replay modal
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/ServicePage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// === 1. Fix clsMod/opMod race condition ===
const oldModal = `const mod = reactive({ vis: false, title: '', html: '', width: '' })
function opMod(title, html, width) {
  mod.title = title
  mod.html = html
  mod.width = width || ''
  mod.vis = true
}
function clsMod() {
  mod.vis = false
  setTimeout(() => { mod.title = ''; mod.html = ''; mod.width = '' }, 200)
}`;

const newModal = `const mod = reactive({ vis: false, title: '', html: '', width: '' })
let _clsTimer = null
function opMod(title, html, width) {
  if (_clsTimer) { clearTimeout(_clsTimer); _clsTimer = null }
  mod.title = title
  mod.html = html
  mod.width = width || ''
  mod.vis = true
}
function clsMod() {
  mod.vis = false
  if (_clsTimer) clearTimeout(_clsTimer)
  _clsTimer = setTimeout(() => { mod.title = ''; mod.html = ''; mod.width = ''; _clsTimer = null }, 200)
}`;

if (s.includes(oldModal)) { s = s.replace(oldModal, newModal); check('1-clsMod-race', true); }
else { check('1-clsMod-race', false); }

// === 2. Add replayStatus + replayUrl to historical course 51 ===
const old51 = `{ id: 51, title: '病虫害防治基础', teacher: '刘教授', date: '2026-06-12', time: '09:00', loc: '村委会培训室', duration: '约2小时', type: 'OFFLINE', joined: 22, limit: 30, status: '已完成', description: '常见农作物病虫害识别与防治方法，涵盖水稻、小麦、玉米等主要农作物的常见病虫害。', deadline: '2026-06-10', suitableFor: '全体农户', notes: '', materials: [{name:'病虫害识别手册.pdf',size:'2.3MB'},{name:'苹果常见病虫害防治要点.pdf',size:'1.8MB'}] }`;

const new51 = `{ id: 51, title: '病虫害防治基础', teacher: '刘教授', date: '2026-06-12', time: '09:00', loc: '村委会培训室', duration: '约1小时20分钟', type: 'OFFLINE', joined: 22, limit: 30, status: '已完成', description: '常见农作物病虫害识别与防治方法，涵盖水稻、小麦、玉米等主要农作物的常见病虫害。', deadline: '2026-06-10', suitableFor: '全体农户', notes: '', replayStatus:'PUBLISHED', replayUrl:'/media/training/plant-disease-01.mp4', materials: [{name:'苹果常见病虫害识别手册.pdf',size:'2.3MB'},{name:'病虫害防治技术要点.pdf',size:'1.8MB'}] }`;

if (s.includes(old51)) { s = s.replace(old51, new51); check('2-course51', true); }
else { check('2-course51', false); }

// === 3. Add replayStatus: NONE for course 52 (no replay yet) ===
const old52 = `{ id: 52, title: '智慧农业入门', teacher: '周老师', date: '2026-07-08', time: '14:00', loc: '村集体直播平台', duration: '约1.5小时', type: 'LIVE', joined: 35, limit: 50, status: '进行中', description: '智慧农业概念及应用场景介绍，包括物联网监控、智能灌溉、无人机植保等前沿技术。', deadline: '2026-07-06', suitableFor: '全体农户', notes: '', materials: [{name:'智慧农业导论.pdf',size:'4.1MB'}] }`;

const new52 = `{ id: 52, title: '智慧农业入门', teacher: '周老师', date: '2026-07-08', time: '14:00', loc: '村集体直播平台', duration: '约1.5小时', type: 'LIVE', joined: 35, limit: 50, status: '进行中', description: '智慧农业概念及应用场景介绍，包括物联网监控、智能灌溉、无人机植保等前沿技术。', deadline: '2026-07-06', suitableFor: '全体农户', notes: '', replayStatus:'NONE', replayUrl:'', materials: [{name:'智慧农业导论.pdf',size:'4.1MB'}] }`;

if (s.includes(old52)) { s = s.replace(old52, new52); check('3-course52', true); }
else { check('3-course52', false); }

// === 4. Replace showReplayFor with final version ===
const oldR4 = `function showReplayFor(course){
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

const newR4 = `function showReplayFor(course){
  const hasReplay=course.replayStatus==='PUBLISHED'&&course.replayUrl
  const mats=course.materials||[]
  const learning=trainingLearning.find(l=>l.courseId===course.id)
  const watched=learning?learning.watchedMinutes:0
  const total=learning?learning.totalMinutes:90
  const pct=total>0?Math.round((watched/total)*100):0
  let h=''
  // Video area
  h+='<div style="background:#000;border-radius:12px;overflow:hidden;margin-bottom:16px;border:1px solid rgba(255,255,255,0.06)">'
  if(hasReplay){
    h+='<div style="position:relative;padding-top:56.25%;background:#0A0F14">'
    h+='<video controls style="position:absolute;top:0;left:0;width:100%;height:100%;outline:none" src="'+course.replayUrl+'" preload="metadata" onerror="this.style.display=\\'none\\';this.nextElementSibling.style.display=\\'flex\\'">'
    h+='<div style="display:none;position:absolute;top:0;left:0;width:100%;height:100%;align-items:center;justify-content:center;background:#0A0F14">'
    h+='<div style="text-align:center"><div style="font-size:28px;margin-bottom:8px">\\u26A0</div>'
    h+='<div style="font-size:12px;color:#E74C3C">视频加载失败，请稍后重试</div></div></div>'
    h+='</video></div>'
  }else{
    h+='<div style="padding:60px 20px;text-align:center">'
    h+='<div style="font-size:40px;margin-bottom:12px">\\u{1F4FA}</div>'
    h+='<div style="font-size:14px;color:#fff;font-weight:600;margin-bottom:6px">回放视频暂未上传</div>'
    h+='<div style="font-size:11px;color:#6F91A8">课程回放正在整理，请稍后查看</div>'
    h+='</div>'
  }
  h+='</div>'
  // Course info
  h+='<div style="margin-bottom:12px">'
  h+='<div style="font-size:15px;font-weight:600;color:#fff;margin-bottom:6px">'+course.title+'</div>'
  h+='<div style="display:flex;gap:16px;font-size:11px;color:#6F91A8;flex-wrap:wrap;margin-bottom:6px">'
  h+='<span>\\u{1F468}\\u200D\\u{1F3EB} '+course.teacher+'</span>'
  h+='<span>\\u{1F4FA} 线下培训回放</span>'
  h+='<span>\\u{23F1} '+course.duration+'</span>'
  h+='</div>'
  // Learning progress
  h+='<div class="mod-divider"></div>'
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">'
  h+='<span style="font-size:12px;color:#6F91A8">学习进度</span>'
  h+='<span style="font-size:12px;color:#28C7FA;font-weight:600">'+pct+'%</span>'
  h+='</div>'
  h+='<div class="progress-bar" style="height:8px;border-radius:4px"><div class="fill b" style="width:'+pct+'%"></div></div>'
  if(watched>0) h+='<div style="font-size:10px;color:#6F91A8;margin-top:4px">上次看到：'+Math.floor(watched/60)+'分'+(watched%60)+'秒</div>'
  h+='</div>'
  // Description
  h+='<div class="mod-divider"></div>'
  h+='<div style="margin-bottom:2px;font-size:12px;color:#6F91A8">课程简介</div>'
  h+='<div style="font-size:11px;color:#B7D3E8;line-height:1.6">'+course.description+'</div>'
  // Materials
  if(mats.length>0){
    h+='<div class="mod-divider"></div>'
    h+='<div style="margin-bottom:6px;font-size:12px;color:#6F91A8">配套资料</div>'
    mats.forEach(m=>{
      h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:rgba(10,36,68,0.40);border-radius:6px;margin-bottom:6px">'
      h+='<span style="font-size:12px;color:#D0E4F5">\\u{1F4C4} '+m.name+'</span>'
      h+='<span style="font-size:10px;color:#28C7FA;cursor:pointer">查看</span>'
      h+='</div>'
    })
  }
  opMod('\\u{1F4FA} 课程回放 \\u2014 '+course.title,h,'mod-lg')
}`;

if (s.includes(oldR4)) { s = s.replace(oldR4, newR4); check('4-showReplayFor', true); }
else { check('4-showReplayFor', false); }

// === 5. Fix showReplayList: allow replayable if replayStatus === PUBLISHED (not just completed) ===
const oldRL = `function showReplayList(){
  const replayable=myTrainingList.value.filter(c=>c.status==='已完成')
  if(!replayable.length){toast('暂无已完成的课程可回放','info');return}`;

const newRL = `function showReplayList(){
  const replayable=myTrainingList.value.filter(c=>c.replayStatus==='PUBLISHED'&&c.replayUrl)
  if(!replayable.length){toast('暂无课程回放','info');return}`;

if (s.includes(oldRL)) { s = s.replace(oldRL, newRL); check('5-replay-list-filter', true); }
else { check('5-replay-list-filter', false); }

// === 6. Update template: "已完成→查看回放" should use displayStatus and check replayStatus ===
const oldTplBtn = `<button v-if="r.displayStatus==='已完成'" class="btn btn-p btn-s" @click="showReplayFor(r)">查看回放</button>`;
const newTplBtn = `<button v-if="r.displayStatus==='已完成'&&r.replayStatus==='PUBLISHED'" class="btn btn-p btn-s" @click="showReplayFor(r)">查看回放</button>`;

if (s.includes(oldTplBtn)) { s = s.replace(oldTplBtn, newTplBtn); check('6-tpl-replay-btn', true); }
else { check('6-tpl-replay-btn', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== FINAL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
