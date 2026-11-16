const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/ServicePage.vue';
let s = fs.readFileSync(fp, 'utf-8');

// Find the exact old string by position
const anchor = "if (key === 'training') {";
const idx = s.indexOf(anchor);
if (idx < 0) { console.log('FAIL: anchor not found'); process.exit(1); }

// Find the start of this if-block
const blockStart = s.lastIndexOf('if (key ===', idx);
const blockEnd = s.indexOf('if (key ===', idx + anchor.length);
if (blockEnd < 0) { console.log('FAIL: next block not found'); process.exit(1); }

// Find the closing of the previous block and opening of next
// Actually, let's find exact lines
const lines = s.split('\n');
let found = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("if (key === 'training')")) {
    const oldBlock = lines.slice(i, i + 9).join('\n');
    console.log('Found training KPI block at line', i+1);
    console.log('---OLD---');
    console.log(oldBlock);

    const newBlock = [
      "  if (key === 'training') {",
      "    const canEnroll = trainingCourses.filter(c=>c.status==='报名中').length",
      "    const enrolled = trainingEnrollments.length",
      "    const done = trainingEnrollments.filter(e=>e.status==='已完成').length",
      "    const totalLearningHours = trainingLearning.reduce((s,l)=>s+(l.watchedMinutes||0),0)/60",
      "    return [",
      "      { icon:'\\u{1F393}', value:canEnroll+'个', label:'可报名', color:'g' },",
      "      { icon:'\\u{1F4CB}', value:enrolled+'个', label:'已报名', color:'b' },",
      "      { icon:'✅', value:done+'个', label:'已完成', color:'y' },",
      "      { icon:'\\u{23F1}', value:totalLearningHours.toFixed(1)+'h', label:'累计学习', color:'p' }",
      "    ]",
      "  }",
    ].join('\n');

    s = s.replace(oldBlock, newBlock);
    console.log('Replaced OK');
    found = true;
    break;
  }
}

if (!found) { console.log('FAIL: training KPI block not found by line scan'); process.exit(1); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('Done, length:', s.length);
