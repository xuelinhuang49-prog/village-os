// Fix telemed: status logic across renderMedicalRecords, showMedicalRecords, enterVideoRoom
const fs = require('fs');
const path = require('path');
const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0;

// === 1. renderMedicalRecords: status tag line ===
const old1 = `h+='<span class="tag '+(r.status==='已完成'?'g':'y')+'">'+r.status+'</span>'`;
const new1 = `const ds=telemedStatus(r);const completed=r.status==='已完成';h+='<span class="tag '+(ds==='已完成'?'g':ds==='已过期'?'r':'y')+'">'+ds+'</span>'`;
if (s.includes(old1)) { s = s.replace(old1, new1); ok++; console.log('1-render-status OK'); }
else { console.log('1-render-status FAIL'); }

// === 2. renderMedicalRecords: diagnosis line (replace diagnosis with symptom) ===
const old2 = `h+='<div style="font-size:11px;color:#6F91A8">就诊人：'+r.patient+' | 类型：'+r.type+(r.diagnosis!=='待诊断'?' | 诊断：'+r.diagnosis:'')+'</div>'`;
const new2 = `h+='<div style="font-size:11px;color:#6F91A8">就诊人：'+r.patient+' | 类型：'+r.type+(completed&&r.diagnosis!=='待诊断'?' | 诊断：'+r.diagnosis:'')+'</div>';if(r.symptom&&r.symptom!=='-')h+='<div style="font-size:11px;color:#B7D3E8;margin-top:2px">主诉：'+r.symptom+'</div>'`;
if (s.includes(old2)) { s = s.replace(old2, new2); ok++; console.log('2-render-diag OK'); }
else { console.log('2-render-diag FAIL'); }

// === 3. renderMedicalRecords: prescription only for completed ===
const old3 = `if(r.prescription&&r.prescription!=='-') h+='<div style="font-size:11px;color:#28C7FA;margin-top:3px">`;
const new3 = `if(completed&&r.prescription&&r.prescription!=='-') h+='<div style="font-size:11px;color:#28C7FA;margin-top:3px">`;
if (s.includes(old3)) { s = s.replace(old3, new3); ok++; console.log('3-render-rx OK'); }
else { console.log('3-render-rx FAIL'); }

// === 4. showMedicalRecords: same changes ===
const old4 = `h+='<span class="tag '+(r.status==='已完成'?'g':'y')+'">'+r.status+'</span>'`;
if (s.includes(old4)) { s = s.replace(old4, new1); ok++; console.log('4-show-status OK (duplicate)'); }
else { console.log('4-show-status already replaced or FAIL'); }

const old5 = `h+='<div style="font-size:11px;color:#6F91A8">就诊人：'+r.patient+' | 类型：'+r.type+(r.diagnosis!=='待诊断'?' | 诊断：'+r.diagnosis:'')+'</div>'`;
if (s.includes(old5)) { s = s.replace(old5, new2); ok++; console.log('5-show-diag OK'); }
else { console.log('5-show-diag already replaced or FAIL'); }

const old6 = `if(r.prescription&&r.prescription!=='-') h+='<div style="font-size:11px;color:#28C7FA;margin-top:3px">`;
if (s.includes(old6)) { s = s.replace(old6, new3); ok++; console.log('6-show-rx OK'); }
else { console.log('6-show-rx already replaced or FAIL'); }

// === 5. enterVideoRoom: check for auto-expired status ===
const old7 = `const pending=telemed.filter(t=>t.status==='待就诊')`;
const new7 = `const pending=telemed.filter(t=>t.status==='待就诊'&&telemedStatus(t)==='待就诊')`;
if (s.includes(old7)) { s = s.replace(old7, new7); ok++; console.log('7-video-pending OK'); }
else { console.log('7-video-pending FAIL'); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== FINAL ===');
console.log('Changes:', ok, '/ 7');
console.log('Length:', s.length);
