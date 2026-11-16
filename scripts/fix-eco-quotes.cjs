// Fix nested single-quote escaping in the ecology service modal onclick handlers.
// The injection wrote `onclick="...window._toast('...')"` un-escaped; JS string
// literals need the inner quotes as \' (same pattern as the governance code).
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

const fixes = [
  ["window._toast && window._toast('已为您接通保洁员','info')", "window._toast && window._toast(\\'已为您接通保洁员\\',\\'info\\')"],
  ["window._svc.selectReportType('environment')", "window._svc.selectReportType(\\'environment\\')"],
  ["window._toast && window._toast('已通知水务员到场处理','success')", "window._toast && window._toast(\\'已通知水务员到场处理\\',\\'success\\')"],
  ["window._toast && window._toast('回收点已在地图标注','info')", "window._toast && window._toast(\\'回收点已在地图标注\\',\\'info\\')"],
];

for (const [a, b] of fixes) {
  if (s.includes(a)) { s = s.split(a).join(b); check(a.slice(0, 30), true); }
  else { check(a.slice(0, 30), false); }
}

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== ECO QUOTE FIX ===');
console.log('Passed:', ok, '/', total);
