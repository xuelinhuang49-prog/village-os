// Uniformly enlarge governance-center fonts for villager readability.
// Principle: 16px body base, 14px secondary, 18-20px titles, 32px stat numbers.
// 1. Append a .gov-theme font-scale override block (CSS variables).
// 2. Fix inline small font-sizes in the governance template.
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. Append font-scale override block before last </style> =====
const lastClose = s.lastIndexOf('</style>');
const fontCss = `
/* ========== GOVERNANCE FONT SCALE — 村民可读字号 ========== */
.gov-theme {
  --gv-title: 18px;
  --gv-body: 16px;
  --gv-secondary: 14px;
  --gv-button: 15px;
  --gv-stat-num: 32px;
  --gv-stat-lbl: 17px;
  line-height: 1.55;
}
.gov-theme .panel-hd { font-size: var(--gv-title); letter-spacing: 0 }
.gov-theme .panel-hd .extra { font-size: var(--gv-secondary) }
.gov-theme .stat-card { padding: 16px 20px }
.gov-theme .sc-val { font-size: var(--gv-stat-num) }
.gov-theme .sc-lbl { font-size: var(--gv-stat-lbl) }
.gov-theme .sc-sub { font-size: var(--gv-secondary) }
.gov-theme .sc-icon { font-size: 22px; width: 46px; height: 46px }
.gov-theme .report-cat { padding: 14px 10px }
.gov-theme .report-cat .rc-icon { font-size: 30px }
.gov-theme .report-cat .rc-label { font-size: var(--gv-title) }
.gov-theme .gov-news-item { padding: 11px 10px }
.gov-theme .gni-loc { font-size: var(--gv-body) }
.gov-theme .gni-time { font-size: var(--gv-secondary) }
.gov-theme .gni-type { font-size: var(--gv-secondary); padding: 3px 10px }
.gov-theme .gni-icon-big { font-size: 24px }
.gov-theme .st { font-size: var(--gv-secondary); padding: 4px 12px }
.gov-theme .gw-name { font-size: 20px }
.gov-theme .gw-role { font-size: var(--gv-secondary) }
.gov-theme .gw-meta { font-size: 15px }
.gov-theme .gw-avatar { font-size: 22px }
.gov-theme .btn { font-size: var(--gv-button) }
.gov-theme .btn-sm { font-size: var(--gv-button); padding: 8px 16px }
.gov-theme .chat-msg { font-size: var(--gv-secondary) }
.gov-theme .input { font-size: var(--gv-button) }`;
if (lastClose !== -1) {
  s = s.substring(0, lastClose) + fontCss + '\n' + s.substring(lastClose);
  check('1-append-font-scale', true);
} else { check('1-append-font-scale', false); }

// ===== 2. 查看全部 links: 11px -> 15px (2 places) =====
let a = 0;
const viewAll1 = `<span class="extra" style="cursor:pointer;color:#19B98A;font-size:11px" @click="showMyReports()">查看全部 ›</span>`;
const viewAll1n = `<span class="extra" style="cursor:pointer;color:#19B98A;font-size:15px" @click="showMyReports()">查看全部 ›</span>`;
if (s.includes(viewAll1)) { s = s.replace(viewAll1, viewAll1n); a++; }
const viewAll2 = `<span class="extra" style="cursor:pointer;color:#19B98A;font-size:11px" @click="showVillageNotices()">查看全部 ›</span>`;
const viewAll2n = `<span class="extra" style="cursor:pointer;color:#19B98A;font-size:15px" @click="showVillageNotices()">查看全部 ›</span>`;
if (s.includes(viewAll2)) { s = s.replace(viewAll2, viewAll2n); a++; }
check('2-view-all-links (expected 2)', a === 2);

// ===== 3. 我的上报 status tag: drop inline font-size =====
const oldSt = `<div class="gni-right"><span class="st" :class="r.statusCls" style="font-size:10px">{{ r.status }}</span></div>`;
const newSt = `<div class="gni-right"><span class="st" :class="r.statusCls">{{ r.status }}</span></div>`;
if (s.includes(oldSt)) { s = s.replace(oldSt, newSt); check('3-my-report-status', true); }
else { check('3-my-report-status', false); }

// ===== 4. 村务提醒 tag badge: 8px -> 13px =====
const oldTag = `<span v-if="n.tag" style="display:inline-block;padding:1px 6px;border-radius:6px;font-size:8px;font-weight:600;margin-left:5px;color:#E05252;background:rgba(224,82,82,0.10);vertical-align:middle">{{ n.tag }}</span>`;
const newTag = `<span v-if="n.tag" style="display:inline-block;padding:2px 8px;border-radius:6px;font-size:13px;font-weight:600;margin-left:5px;color:#E05252;background:rgba(224,82,82,0.10);vertical-align:middle">{{ n.tag }}</span>`;
if (s.includes(oldTag)) { s = s.replace(oldTag, newTag); check('4-notice-tag-badge', true); }
else { check('4-notice-tag-badge', false); }

// ===== 5. 村务提醒 查看 →: 10px -> 15px =====
const oldView = `<div class="gni-right"><span style="font-size:10px;color:#19B98A">查看 →</span></div>`;
const newView = `<div class="gni-right"><span style="font-size:15px;color:#19B98A">查看 →</span></div>`;
if (s.includes(oldView)) { s = s.replace(oldView, newView); check('5-notice-view-link', true); }
else { check('5-notice-view-link', false); }

// ===== 6. empty-state text: 11px -> 14px (2 places) =====
let b = 0;
if (s.includes('font-size:11px">暂无上报记录')) { s = s.replace('font-size:11px">暂无上报记录', 'font-size:14px">暂无上报记录'); b++; }
if (s.includes('font-size:11px">暂无村务提醒')) { s = s.replace('font-size:11px">暂无村务提醒', 'font-size:14px">暂无村务提醒'); b++; }
check('6-empty-states (expected 2)', b === 2);

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== GOV FONT ENLARGE ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
