// Final fixes for governance light theme:
// 1. Fix CSS specificity — scoped original dark styles were beating the unscoped .gov-theme overrides.
//    Fix: re-append the .gov-theme block into the END of the <style scoped> block so it becomes
//    .gov-theme .foo[data-v-xxx] (0,3,0) which beats .foo[data-v-xxx] (0,2,0).
// 2. Replace remaining 4 openModal() → openGovModal() calls.
// 3. Fix a white heading that would be invisible on the light modal.
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ---- 1. Extract the existing .gov-theme override block ----
const startMarker = '/* ========== GOVERNANCE LIGHT THEME ========== */';
const endMarker = '/* Governance light modal */';
const gStart = s.indexOf(startMarker);
const gEnd = s.indexOf(endMarker);
if (gStart === -1 || gEnd === -1 || gEnd <= gStart) {
  console.log('ERROR: gov-theme block boundaries not found');
  process.exit(1);
}
const govThemeCSS = s.substring(gStart, gEnd).replace(/\s+$/, '');
check('1-extract-gov-theme', govThemeCSS.includes('.gov-theme .btn-primary'));

// ---- 2. Append the block into the END of the scoped style block ----
const lastStyleClose = s.lastIndexOf('</style>');
if (lastStyleClose === -1) { console.log('ERROR: no </style>'); process.exit(1); }
const scopedAppend = '\n\n/* ========== GOVERNANCE LIGHT THEME (scoped, high specificity) ========== */\n' + govThemeCSS;
s = s.substring(0, lastStyleClose) + scopedAppend + s.substring(lastStyleClose);
check('2-append-scoped-gov-theme', true);

// ---- 3. Replace remaining openModal() calls in governance functions ----
const beforeCount = (s.match(/openModal\('事件上报', h\)/g) || []).length;
s = s.split("openModal('事件上报', h)").join("openGovModal('事件上报', h)");
const afterEvent = (s.match(/openGovModal\('事件上报', h\)/g) || []).length;
check('3a-openModal-event-report (expected 3)', beforeCount === 3 && afterEvent === 3);

const beforeNotice = (s.match(/openModal\('公告详情', h\)/g) || []).length;
s = s.split("openModal('公告详情', h)").join("openGovModal('公告详情', h)");
const afterNotice = (s.match(/openGovModal\('公告详情', h\)/g) || []).length;
check('3b-openModal-notice-detail (expected 1)', beforeNotice === 1 && afterNotice === 1);

// ---- 4. Fix white heading invisible on light modal (showMyGrid) ----
const oldWhite = "<h4 style=\"color:#fff;margin:8px 0 2px 0;font-size:15px\">";
const newWhite = "<h4 style=\"color:#1F2D3D;margin:8px 0 2px 0;font-size:15px\">";
if (s.includes(oldWhite)) { s = s.replace(oldWhite, newWhite); check('4-white-heading-fix', true); }
else { check('4-white-heading-fix', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== GOV THEME FINAL FIX ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
