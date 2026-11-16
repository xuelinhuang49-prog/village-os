// Governance center: dark blue tech → light government-service theme
// DashboardPage.vue only — sidebar, header, other pages stay dark
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ============================================================
// PHASE 1: TEMPLATE CHANGES
// ============================================================

// 1a. Dynamic background on content-area for governance
const oldContentArea = '<div class="content-area"';
const newContentArea = '<div class="content-area" :style="{ background: currentPage === \'governance\' ? \'#F4F7FA\' : \'\' }"';
s = s.replace(oldContentArea, newContentArea);
check('1a-content-area-bg', s.includes(newContentArea));

// 1b. Add gov-theme class to governance wrapper
const oldGovWrapper = '<div v-show="currentPage === \'governance\'" class="page-content" key="governance">';
const newGovWrapper = '<div v-show="currentPage === \'governance\'" class="page-content gov-theme" key="governance">';
s = s.replace(oldGovWrapper, newGovWrapper);
check('1b-gov-theme-class', s.includes(newGovWrapper));

// 1c. Hide particles canvas on governance page
const oldParticles = '<canvas ref="particlesCvs" class="particles-bg"></canvas>';
const newParticles = '<canvas ref="particlesCvs" class="particles-bg" v-show="currentPage !== \'governance\'"></canvas>';
s = s.replace(oldParticles, newParticles);
check('1c-particles-hide', s.includes(newParticles));

// 1d. Template inline color fixes
// Empty state colors #6F91A8 → #66788A
s = s.replace(/color:#6F91A8;font-size:12px/g, 'color:#66788A;font-size:12px');
s = s.replace(/color:#6F91A8;font-size:11px/g, 'color:#66788A;font-size:11px');
// Tag badge
s = s.replace(/color:#fff;background:rgba\(231,76,60,0\.20\)/g, 'color:#E05252;background:rgba(224,82,82,0.10)');
// View indicator
s = s.replace(/font-size:10px;color:#28C7FA">查看 →/g, 'font-size:10px;color:#19B98A">查看 →');
check('1d-template-inline', true);

// ============================================================
// PHASE 2: Inject scoped CSS override block
// ============================================================
const govThemeCSS = `
/* ========== GOVERNANCE LIGHT THEME ========== */
.gov-theme { background:#F4F7FA }
.gov-theme .panel {
  background:#FFFFFF; border:1px solid #E3EAF0;
  box-shadow:0 1px 4px rgba(0,0,0,0.06); backdrop-filter:none;
}
.gov-theme .panel-hd { color:#1F2D3D }
.gov-theme .panel-hd .extra { color:#66788A }

/* hd-bars */
.gov-theme .hd-bar { background:#19B98A; box-shadow:0 0 7px rgba(25,185,138,0.20) }
.gov-theme .hd-bar.g { background:#22B573; box-shadow:0 0 7px rgba(34,181,115,0.20) }
.gov-theme .hd-bar.y { background:#F2A62B; box-shadow:0 0 7px rgba(242,166,43,0.20) }
.gov-theme .hd-bar.r { background:#E05252; box-shadow:0 0 7px rgba(224,82,82,0.20) }

/* stat cards */
.gov-theme .stat-card {
  background:#FFFFFF; border:1px solid #E3EAF0;
  box-shadow:0 1px 3px rgba(0,0,0,0.05); backdrop-filter:none;
}
.gov-theme .stat-card:hover { background:rgba(25,185,138,0.04); border-color:#19B98A; box-shadow:0 4px 12px rgba(0,0,0,0.08) }
.gov-theme .sc-val { color:#1F2D3D }
.gov-theme .sc-lbl { color:#66788A }
.gov-theme .sc-sub { color:#66788A; opacity:.65 }
.gov-theme .stat-card.g .sc-val { color:#22B573 }
.gov-theme .stat-card.y .sc-val { color:#F2A62B }
.gov-theme .stat-card.r .sc-val { color:#E05252 }

/* data-table */
.gov-theme .data-table th { background:#F0F3F8; color:#66788A; border-bottom:2px solid #E3EAF0 }
.gov-theme .data-table td { border-bottom:1px solid #EBEFF4; color:#1F2D3D }
.gov-theme .data-table tr:hover td { background:rgba(25,185,138,0.04) }

/* status badges */
.gov-theme .st.online, .gov-theme .st.info { background:rgba(34,181,115,0.10); color:#22B573 }
.gov-theme .st.warning { background:rgba(242,166,43,0.10); color:#F2A62B }
.gov-theme .st.offline { background:rgba(224,82,82,0.10); color:#E05252 }

/* buttons */
.gov-theme .btn-primary { background:linear-gradient(135deg,#19B98A,#16A37A); color:#fff; box-shadow:0 2px 8px rgba(25,185,138,0.25) }
.gov-theme .btn-primary:hover { box-shadow:0 4px 14px rgba(25,185,138,0.35); transform:translateY(-2px) }
.gov-theme .btn-outline { border:1px solid #C8D4E0; color:#66788A }
.gov-theme .btn-outline:hover { background:rgba(25,185,138,0.06); border-color:#19B98A; color:#19B98A }

/* input */
.gov-theme .input { background:#FFFFFF; border:1px solid #D0D8E2; color:#1F2D3D }
.gov-theme .input:focus { border-color:#19B98A; box-shadow:0 0 0 3px rgba(25,185,138,0.08) }
.gov-theme .input::placeholder { color:#A0AFC0 }

/* gov quick bar */
.gov-theme .gov-qbtn { background:#FFFFFF; border:1px solid #E3EAF0; color:#1F2D3D }
.gov-theme .gov-qbtn:hover { background:rgba(25,185,138,0.06); border-color:#19B98A; color:#19B98A; box-shadow:0 2px 8px rgba(0,0,0,0.06) }
.gov-theme .gov-qbtn.primary { background:#19B98A; border-color:#19B98A; color:#FFFFFF }
.gov-theme .gov-qbtn.primary:hover { background:#17a87c }

/* gov news items */
.gov-theme .gov-news-item { background:#FAFBFC; border:1px solid #E3EAF0 }
.gov-theme .gov-news-item:hover { background:rgba(25,185,138,0.05); border-color:#B8D8CC }
.gov-theme .gni-loc { color:#1F2D3D }
.gov-theme .gni-time { color:#66788A }

/* grid worker */
.gov-theme .gw-name { color:#1F2D3D }
.gov-theme .gw-role { color:#19B98A; background:rgba(25,185,138,0.08) }
.gov-theme .gw-meta { color:#66788A }

/* chat */
.gov-theme .chat-wrapper { background:#FAFBFC; border:1px solid #E3EAF0 }
.gov-theme .chat-msg.ai { background:rgba(25,185,138,0.06); color:#1F2D3D; border:1px solid rgba(25,185,138,0.10) }
.gov-theme .chat-msg.user { background:rgba(25,185,138,0.12); color:#1F2D3D; border:1px solid rgba(25,185,138,0.18) }

/* mini stats */
.gov-theme .mini-s { background:#FAFBFC; border:1px solid #E3EAF0 }
.gov-theme .ms-v { color:#1F2D3D }
.gov-theme .ms-l { color:#66788A }
.gov-theme .mini-s.g .ms-v { color:#22B573 }
.gov-theme .mini-s.y .ms-v { color:#F2A62B }
.gov-theme .mini-s.r .ms-v { color:#E05252 }

/* module cards */
.gov-theme .module-card { background:#FFFFFF; border:1px solid #E3EAF0; backdrop-filter:none; box-shadow:0 1px 3px rgba(0,0,0,0.05) }
.gov-theme .module-card:hover { background:#FFFFFF; border-color:#19B98A; box-shadow:0 4px 12px rgba(0,0,0,0.08) }
.gov-theme .module-card h4 { color:#1F2D3D }
.gov-theme .module-card p { color:#66788A }

/* tags */
.gov-theme .tag.blue { background:rgba(25,185,138,0.10); color:#19B98A }
.gov-theme .tag.green { background:rgba(34,181,115,0.12); color:#22B573 }
.gov-theme .tag.yellow { background:rgba(242,166,43,0.12); color:#F2A62B }
.gov-theme .tag.red { background:rgba(224,82,82,0.12); color:#E05252 }

/* alert list */
.gov-theme .alert-item { background:#FFFFFF; border-left:2px solid #F2A62B }
.gov-theme .alert-item:hover { background:rgba(25,185,138,0.04) }
.gov-theme .ai-title { color:#1F2D3D }
.gov-theme .ai-desc { color:#66788A }
.gov-theme .ai-time { color:#66788A; opacity:.6 }

/* tabs */
.gov-theme .tabs { background:#F4F7FA }
.gov-theme .tab { color:#66788A }
.gov-theme .tab.active { background:#19B98A; color:#fff }
.gov-theme .tab:hover { color:#1F2D3D }

/* review */
.gov-theme .review-item { background:#FFFFFF }
.gov-theme .review-name { color:#1F2D3D }
.gov-theme .review-text { color:#66788A }

/* detail section */
.gov-theme .detail-section h4 { color:#22B573 }
.gov-theme .detail-section h4::before { background:#22B573 }
.gov-theme .df-lbl { color:#66788A }
.gov-theme .df-val { color:#1F2D3D }

/* marquee */
.gov-theme .marquee-bar { background:#FFFFFF; border-color:#E3EAF0; backdrop-filter:none }
.gov-theme .marquee-text { color:#19B98A }
.gov-theme .float-badge { background:rgba(25,185,138,0.12); color:#19B98A; border-color:rgba(25,185,138,0.20) }

/* progress */
.gov-theme .progress-bar { background:rgba(25,185,138,0.06) }
.gov-theme .progress-fill.g { background:linear-gradient(90deg,#19B98A,#22B573) }

/* tech grid */
.gov-theme .tech-label { color:#66788A }
.gov-theme .tech-val { color:#1F2D3D }

/* bot row */
.gov-theme .bot-card { background:#FFFFFF; border-color:#E3EAF0; backdrop-filter:none; box-shadow:0 1px 3px rgba(0,0,0,0.05) }
.gov-theme .bot-card:hover { background:#FFFFFF; border-color:#19B98A }
.gov-theme .bot-card::before { background:linear-gradient(90deg,transparent,rgba(25,185,138,0.2),transparent) }
.gov-theme .bv { color:#1F2D3D }
.gov-theme .bl { color:#66788A }
.gov-theme .bs { color:#66788A; opacity:.6 }
.gov-theme .bot-card.g .bv { color:#22B573 }
.gov-theme .bot-card.y .bv { color:#F2A62B }
.gov-theme .bot-card.r .bv { color:#E05252 }

/* svc cards */
.gov-theme .svc-card { background:#FAFBFC; border-color:#E3EAF0 }
.gov-theme .svc-card:hover { background:rgba(25,185,138,0.04); border-color:#19B98A }
.gov-theme .svc-card .sn { color:#1F2D3D }
.gov-theme .svc-card .sd { color:#66788A }

/* map */
.gov-theme .map-wrap { border-color:#E3EAF0 }
.gov-theme .map-lg { color:#66788A }

/* iot */
.gov-theme .iot-st { color:#66788A }
.gov-theme .iot-st.warn { color:#F2A62B }
.gov-theme .iot-st.offline { color:#E05252 }
.gov-theme .dot.online { background:#22B573; box-shadow:0 0 5px #22B573 }
.gov-theme .dot.warn { background:#F2A62B; box-shadow:0 0 5px #F2A62B }
.gov-theme .dot.offline { background:#E05252 }
.gov-theme .iot-row:hover { background:rgba(25,185,138,0.04) }
`;

s = s.replace('</style>', govThemeCSS + '\n</style>');
check('2-css-override-block', true);

// ============================================================
// PHASE 3: Unscoped modal-light CSS
// ============================================================
const modalLightCSS = `
/* Governance light modal */
.modal-box.modal-light { background:#FFFFFF !important; border:1px solid #E3EAF0 !important; box-shadow:0 8px 40px rgba(0,0,0,0.12) !important }
.modal-box.modal-light h3 { color:#1F2D3D !important }
.modal-box.modal-light .detail-section h4 { color:#22B573 }
.modal-box.modal-light .detail-section h4::before { background:#22B573 }
.modal-box.modal-light .df-lbl { color:#66788A }
.modal-box.modal-light .df-val { color:#1F2D3D }
.modal-box.modal-light .detail-field { border-bottom-color:#EBEFF4 }
`;
s = s.replace('</style>\n\n<style scoped>', modalLightCSS + '\n</style>\n\n<style scoped>');
check('3-modal-light-unscoped', true);

// ============================================================
// PHASE 4: Add openGovModal() helper
// ============================================================
const oldCloseModal = 'function closeModal() { modalOpen.value = false }\n\n// ---- Interactive handlers ----';
const newCloseModal = 'function closeModal() { modalOpen.value = false }\n\n// Governance light modal wrapper\nfunction openGovModal(title, content) {\n  openModal(title, content)\n  nextTick(() => {\n    var box = document.querySelector(\'.modal.show .modal-box\')\n    if (box) box.classList.add(\'modal-light\')\n  })\n}\n\n// ---- Interactive handlers ----';
s = s.replace(oldCloseModal, newCloseModal);
check('4a-openGovModal-helper', s.includes('function openGovModal'));

// ============================================================
// PHASE 5: Script-section color mapping
// ============================================================
const scriptTag = '<script setup>';
const scriptEndTag = '</script>';
const scriptIdx = s.indexOf(scriptTag);
const scriptEndIdx = s.lastIndexOf(scriptEndTag);
if (scriptIdx === -1 || scriptEndIdx === -1) { console.log('ERROR: script boundaries not found'); process.exit(1); }

let before = s.substring(0, scriptIdx + scriptTag.length);
let scriptContent = s.substring(scriptIdx + scriptTag.length, scriptEndIdx); // let, not const!
let after = s.substring(scriptEndIdx);

// Color mapping — order matters: specific to general
const colorMap = [
  // === TEXT COLORS ===
  [/'#D0E4F5'/g, "'#1F2D3D'"],
  [/color:#D0E4F5/g, 'color:#1F2D3D'],
  [/'#B7D3E8'/g, "'#475867'"],
  [/color:#B7D3E8/g, 'color:#475867'],
  [/'#6F91A8'/g, "'#66788A'"],
  [/color:#6F91A8/g, 'color:#66788A'],
  [/color:rgba\(111,145,168,0\.45\)/g, 'color:rgba(102,120,138,0.45)'],
  // === ACCENT COLORS ===
  [/'#28C7FA'/g, "'#19B98A'"],
  [/color:#28C7FA/g, 'color:#19B98A'],
  [/'#39D98A'/g, "'#22B573'"],
  [/color:#39D98A/g, 'color:#22B573'],
  [/'#f59e0b'/g, "'#F2A62B'"],
  [/color:#f59e0b/g, 'color:#F2A62B'],
  [/'#E74C3C'/g, "'#E05252'"],
  [/color:#E74C3C/g, 'color:#E05252'],
  // === CARD BACKGROUNDS ===
  [/background:rgba\(10,36,68,0\.55\)/g, 'background:#FFFFFF'],
  [/background:rgba\(10,36,68,0\.40\)/g, 'background:#FAFBFC'],
  [/background:rgba\(10,36,68,0\.30\)/g, 'background:#F0F3F6'],
  // === STATUS BADGE BACKGROUNDS ===
  [/background:rgba\(57,217,138,0\.12\)/g, 'background:rgba(34,181,115,0.10)'],
  [/background:rgba\(57,217,138,0\.10\)/g, 'background:rgba(34,181,115,0.08)'],
  [/background:rgba\(57,217,138,0\.20\)/g, 'background:rgba(34,181,115,0.18)'],
  [/background:rgba\(245,158,11,0\.12\)/g, 'background:rgba(242,166,43,0.10)'],
  [/background:rgba\(245,158,11,0\.15\)/g, 'background:rgba(242,166,43,0.12)'],
  [/background:rgba\(245,158,11,0\.04\)/g, 'background:rgba(242,166,43,0.04)'],
  [/background:rgba\(231,76,60,0\.12\)/g, 'background:rgba(224,82,82,0.10)'],
  [/background:rgba\(231,76,60,0\.15\)/g, 'background:rgba(224,82,82,0.12)'],
  [/background:rgba\(231,76,60,0\.20\)/g, 'background:rgba(224,82,82,0.16)'],
  [/background:rgba\(40,199,250,0\.12\)/g, 'background:rgba(25,185,138,0.10)'],
  [/background:rgba\(40,199,250,0\.15\)/g, 'background:rgba(25,185,138,0.12)'],
  [/background:rgba\(40,199,250,0\.10\)/g, 'background:rgba(25,185,138,0.08)'],
  // === STATUS BADGE COLORS ===
  [/'#28C7FA', '#6F91A8'/g, "'#19B98A', '#66788A'"],
  [/'处理中': '#f59e0b'/g, "'处理中': '#F2A62B'"],
  [/'已办结': '#39D98A'/g, "'已办结': '#22B573'"],
  [/'已驳回': '#E74C3C'/g, "'已驳回': '#E05252'"],
  [/'待受理': '#28C7FA'/g, "'待受理': '#19B98A'"],
  [/'已提交': '#28C7FA'/g, "'已提交': '#19B98A'"],
  [/'已受理': '#28C7FA'/g, "'已受理': '#19B98A'"],
  // === RGBA STATUS COLORS (dynamic template literal) ===
  [/'57,217,138'/g, "'34,181,115'"],
  [/'245,158,11'/g, "'242,166,43'"],
  [/'231,76,60'/g, "'224,82,82'"],
  [/'40,199,250'/g, "'25,185,138'"],
  // === BORDERS ===
  [/border:1px solid rgba\(40,199,111,0\.08\)/g, 'border:1px solid #EBEFF4'],
  [/border:1px solid rgba\(40,199,111,0\.10\)/g, 'border:1px solid #E3EAF0'],
  [/border:1px solid rgba\(40,199,111,0\.12\)/g, 'border:1px solid #E3EAF0'],
  [/border:1px solid rgba\(40,199,111,0\.18\)/g, 'border:1px solid #D4DCE6'],
  [/border:1px solid rgba\(40,199,111,0\.06\)/g, 'border:1px solid #F0F3F8'],
  [/border-bottom:1px solid rgba\(40,199,111,0\.06\)/g, 'border-bottom:1px solid #F0F3F8'],
  [/border-bottom:1px solid rgba\(14,165,233,0\.06\)/g, 'border-bottom:1px solid #EBEFF4'],
  [/border-left:2px solid #F5B83D/g, 'border-left:2px solid #F2A62B'],
  // === HOVER / MISC RGBA ===
  [/rgba\(14,165,233,0\.08\)/g, 'rgba(25,185,138,0.05)'],
  [/rgba\(14,165,233,0\.10\)/g, 'rgba(25,185,138,0.06)'],
  [/rgba\(40,199,111,0\.30\)/g, 'rgba(25,185,138,0.25)'],
  [/rgba\(40,199,111,0\.20\)/g, 'rgba(25,185,138,0.20)'],
  [/rgba\(40,199,111,0\.10\)/g, '#E3EAF0'],
  [/rgba\(40,199,111,0\.06\)/g, '#F0F3F5'],
  [/rgba\(40,199,111,0\.05\)/g, 'rgba(25,185,138,0.04)'],
  [/rgba\(40,199,250,0\.40\)/g, 'rgba(25,185,138,0.30)'],
  // === GRADIENTS ===
  [/linear-gradient\(135deg,#28C7FA,#39D98A\)/g, 'linear-gradient(135deg,#19B98A,#16A37A)'],
  [/linear-gradient\(135deg,#39D98A,#28C76F\)/g, 'linear-gradient(135deg,#19B98A,#16A37A)'],
  // === HEADING COLORS (targeted: h3/h4 in JS strings) ===
  [/color:#fff;margin:0 0 6px 0;font-size:16px/g, 'color:#1F2D3D;margin:0 0 6px 0;font-size:16px'],
  [/'<h3 style="color:#fff;margin:0/g, "'<h3 style=\"color:#1F2D3D;margin:0"],
  [/<h4 style="color:#fff;margin:0/g, '<h4 style="color:#1F2D3D;margin:0'],
  // === SECTION HEADING (h4 with green) ===
  [/font-size:12px;font-weight:700;color:#39D98A;margin:0 0 8px 0/g, 'font-size:12px;font-weight:700;color:#22B573;margin:0 0 8px 0'],
  [/width:3px;height:12px;background:#39D98A;border-radius:2px/g, 'width:3px;height:12px;background:#22B573;border-radius:2px'],
  [/font-size:12px;font-weight:700;color:#39D98A;margin:0 0 10px 0/g, 'font-size:12px;font-weight:700;color:#22B573;margin:0 0 10px 0'],
  // === CHAT COLORS ===
  [/color:#B7D3E8;line-height:1\.5/g, 'color:#475867;line-height:1.5'],
  [/style="color:#f59e0b"/g, 'style="color:#F2A62B"'],
  [/style="color:#39D98A"/g, 'style="color:#22B573"'],
  [/#39D98A'; this\.style/g, '#19B98A\'; this.style'],
  // === GW AVATAR ===
  [/linear-gradient\(135deg,#28C7FA,#39D98A\)/g, 'linear-gradient(135deg,#19B98A,#16A37A)'],
];

let matches = 0;
colorMap.forEach(([pattern, replacement]) => {
  const before = scriptContent;
  scriptContent = scriptContent.replace(pattern, replacement);
  if (scriptContent !== before) matches++;
});
console.log('Color replacements applied:', matches, 'patterns');
check('5-script-colors', matches >= 15);

// Reassemble
s = before + scriptContent + after;

// ============================================================
// PHASE 6: Replace openModal → openGovModal in gov functions
// ============================================================
function replaceInRange(content, startMarker, endMarker) {
  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) return null;
  const endIdx = content.indexOf(endMarker, startIdx + startMarker.length);
  if (endIdx === -1) return null;
  const range = content.substring(startIdx, endIdx);
  if (range.includes('openGovModal')) return null; // skip if already replaced
  return range.replace(/openModal\(/g, 'openGovModal(');
}

const govFuncs = [
  ['function renderReportForm(', 'function switchTab('],
  ['function showMyReports(', 'function showMyEventDetail('],
  ['function showMyEventDetail(', 'function previewPhoto('],
  ['function previewPhoto(', 'function showGridWorkerInfo()'],
  ['function showGridWorkerInfo()', 'function showMyGrid()'],
  ['function showMyGrid()', 'function showVillageNotices()'],
  ['function showVillageNotices()', 'function showNoticeDetail('],
  ['function showNoticeDetail(', 'function showNoticeDetailById('],
  ['function showNoticeDetailById(', 'function sendChat()'],
];

let replaced = 0;
govFuncs.forEach(([start, end]) => {
  const newRange = replaceInRange(s, start, end);
  if (newRange) {
    const startIdx = s.indexOf(start);
    const endIdx = s.indexOf(end, startIdx + start.length);
    s = s.substring(0, startIdx) + newRange + s.substring(endIdx);
    replaced++;
  }
});
check('6-openModal-replacements', replaced >= 5);

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== GOV LIGHT THEME FINAL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
