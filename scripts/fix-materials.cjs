// Fix: materials with real URLs + clickable "查看" + placeholder PDFs
const fs = require('fs');
const path = require('path');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/ServicePage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// === 1. Update course 51 materials with url ===
const oldM1 = `materials: [{name:'苹果常见病虫害识别手册.pdf',size:'2.3MB'},{name:'病虫害防治技术要点.pdf',size:'1.8MB'}]`;
const newM1 = `materials: [{id:1,name:'苹果常见病虫害识别手册.pdf',size:'2.3MB',url:'/files/苹果常见病虫害识别手册.pdf'},{id:2,name:'病虫害防治技术要点.pdf',size:'1.8MB',url:'/files/病虫害防治技术要点.pdf'}]`;

if (s.includes(oldM1)) { s = s.replace(oldM1, newM1); check('1-mat-51', true); }
else { check('1-mat-51', false); }

// === 2. Update course 52 materials with url ===
const oldM2 = `materials: [{name:'智慧农业导论.pdf',size:'4.1MB'}]`;
const newM2 = `materials: [{id:3,name:'智慧农业导论.pdf',size:'4.1MB',url:'/files/智慧农业导论.pdf'}]`;

if (s.includes(oldM2)) { s = s.replace(oldM2, newM2); check('2-mat-52', true); }
else { check('2-mat-52', false); }

// === 3. Fix the "查看" span in showReplayFor to actually open the URL ===
const oldView = `h+='<span style="font-size:10px;color:#28C7FA;cursor:pointer">查看</span>'`;
const newView = `h+='<span style="font-size:10px;color:#28C7FA;cursor:pointer" onclick="window._svc.openResource(\\''+m.url+'\\')">查看</span>'`;

if (s.includes(oldView)) { s = s.replace(oldView, newView); check('3-view-btn', true); }
else { check('3-view-btn', false); }

// === 4. Add openResource function (add before showReplayFor) ===
const oldORAnchor = `function showReplayFor(course){`;
const newORFunc = `function openResource(url){
  if(!url){toast('资料暂未上传','info');return}
  window.open(url,'_blank')
}
function showReplayFor(course){`;

if (s.includes(oldORAnchor)) { s = s.replace(oldORAnchor, newORFunc); check('4-openResource', true); }
else { check('4-openResource', false); }

// === 5. Expose openResource in onMounted ===
const oldMount3 = `showReplayForById:(id)=>{const c=myTrainingList.value.find(x=>x.id===id);if(c){clsMod();showReplayFor(c)}}`;
const newMount3 = `openResource:(url)=>{openResource(url)},showReplayForById:(id)=>{const c=myTrainingList.value.find(x=>x.id===id);if(c){clsMod();showReplayFor(c)}}`;

if (s.includes(oldMount3)) { s = s.replace(oldMount3, newMount3); check('5-mount-openResource', true); }
else { check('5-mount-openResource', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== FINAL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
