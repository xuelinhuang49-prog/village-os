// Fix hospital registration: date min + time slot filtering
const fs = require('fs');
const path = require('path');
const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0;

// === 1. Add today constant ===
const oldToday = `function showHospitalReg(){\n  const r=insurance[0]\n  const maskedName=r?r.name:'王友德'`;
const newToday = `function showHospitalReg(){\n  const r=insurance[0]\n  const maskedName=r?r.name:'王友德'\n  const today=new Date().toISOString().split('T')[0]`;
if (s.includes(oldToday)) { s = s.replace(oldToday, newToday); ok++; console.log('1-today OK'); }
else { console.log('1-today FAIL'); }

// === 2. Replace date input (position-based) ===
// Find: id="reg_date"
const dateAnchor = 'id="reg_date"';
const dateIdx = s.indexOf(dateAnchor);
if (dateIdx < 0) { console.log('2-date FAIL - anchor not found'); }
else {
  // Find the full <input ... > tag
  const tagStart = s.lastIndexOf('<input', dateIdx);
  const tagEnd = s.indexOf('>', dateIdx) + 1;
  const oldTag = s.substring(tagStart, tagEnd);

  // Build new tag: add min="'+today+'" and extend onchange with time slot filtering
  // The old tag: <input type="date" id="reg_date" onchange="...">
  // We insert min just before id, and add to the onchange

  // Find where to insert min (right after type="date")
  const insertPos = oldTag.indexOf('id="reg_date"');
  const withMin = oldTag.substring(0, insertPos) + 'min="\'+today+\'" ' + oldTag.substring(insertPos);

  // Extend onchange: find the closing "> of the onchange value
  // The onchange ends with: !!this.value)">
  const onchangeEnd = withMin.lastIndexOf('!!this.value)">');
  if (onchangeEnd < 0) { console.log('2-date FAIL - onchange end not found'); }
  else {
    const timeSlotLogic = `!!this.value);var sl=document.getElementById(\\'reg_time\\');if(sl){var n=new Date();var td=n.getFullYear()+\\'-\\'+String(n.getMonth()+1).padStart(2,\\'0\\')+\\'-\\'+String(n.getDate()).padStart(2,\\'0\\');if(this.value===td){var h=n.getHours();var opts=sl.options;for(var i=0;i<opts.length;i++){var v=opts[i].value;if(v&&v.indexOf(\\'上午\\')===0&&h>=12)opts[i].disabled=true;if(v&&v.indexOf(\\'下午\\')===0&&h>=17)opts[i].disabled=true}}else{for(var j=0;j<sl.options.length;j++)sl.options[j].disabled=false}}">`;

    const newTag = withMin.substring(0, onchangeEnd) + timeSlotLogic;

    if (s.includes(oldTag)) {
      s = s.replace(oldTag, newTag);
      ok++; console.log('2-date-min OK');
    } else { console.log('2-date FAIL - oldTag not matched'); console.log('oldTag excerpt:', oldTag.substring(0, 80)); }
  }
}

// === 3. confirmReg validation ===
const oldConfirm = `function confirmReg(){\n  const hosp=document.getElementById('reg_hosp').value\n  const dept=document.getElementById('reg_dept').value\n  const date=document.getElementById('reg_date').value\n  const time=document.getElementById('reg_time').value\n  if(!hosp||!dept||!date||!time){toast('请填写必填字段（带 * 号）','warn');return}\n  toast('挂号成功！'+hosp+' '+dept+' '+date+' '+time,'ok');clsMod()\n}`;

const newConfirm = `function confirmReg(){\n  const hosp=document.getElementById('reg_hosp').value\n  const dept=document.getElementById('reg_dept').value\n  const date=document.getElementById('reg_date').value\n  const time=document.getElementById('reg_time').value\n  if(!hosp||!dept||!date||!time){toast('请填写必填字段（带 * 号）','warn');return}\n  const now=new Date()\n  const today=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')\n  if(date<today){toast('预约日期不能早于今天','warn');return}\n  if(date===today){\n    const curHour=now.getHours()\n    if(time.indexOf('上午')===0&&curHour>=12){toast('上午时段已过，请选择下午时段','warn');return}\n    if(time.indexOf('下午')===0&&curHour>=17){toast('下午时段已过，请选择其他日期','warn');return}\n  }\n  toast('挂号成功！'+hosp+' '+dept+' '+date+' '+time,'ok');clsMod()\n}`;

if (s.includes(oldConfirm)) { s = s.replace(oldConfirm, newConfirm); ok++; console.log('3-confirm OK'); }
else { console.log('3-confirm FAIL'); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== FINAL ===');
console.log('Changes:', ok, '/ 3');
console.log('Length:', s.length);
