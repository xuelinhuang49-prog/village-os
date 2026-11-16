// Redesign Ecology Center to the same light-theme + font scale as Governance,
// but with a distinct "ecology green" (#22B573). Steps:
//   1. Add `eco-theme` class to the ecology wrapper
//   2. Split "42优" into "42" (big) + "优" (green tag)
//   3. 快捷操作: remove card bg, 4 buttons inline (发起巡检 solid, rest outline)
//   4. Lighten initEcoCharts (white tooltip, dark axis text, bigger fonts)
//   5. Append `.eco-theme` scoped override block (light skin + green + font scale)
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. Add eco-theme class to ecology wrapper =====
const oldWrap = `<div v-show="currentPage === 'ecology'" class="page-content" key="ecology">`;
const newWrap = `<div v-show="currentPage === 'ecology'" class="page-content eco-theme" key="ecology">`;
if (s.includes(oldWrap)) { s = s.replace(oldWrap, newWrap); check('1-eco-theme-class', true); }
else { check('1-eco-theme-class', false); }

// ===== 2. Split "42优" -> "42" + green tag in stat card value =====
const oldVal = `<div><div class="sc-val">{{ s.value }}</div><div class="sc-lbl">{{ s.label }}</div><div class="sc-sub">{{ s.sub }}</div></div>`;
const newVal = `<div><div class="sc-val">{{ s.value }}<span v-if="s.valueTag" class="sc-tag">{{ s.valueTag }}</span></div><div class="sc-lbl">{{ s.label }}</div><div class="sc-sub">{{ s.sub }}</div></div>`;
if (s.includes(oldVal)) { s = s.replace(oldVal, newVal); check('2-stat-value-tag', true); }
else { check('2-stat-value-tag', false); }

// ===== 3. ecoStats data: split value/valueTag =====
const oldStats = `const ecoStats = [
  { label: '空气质量指数', value: '42优', sub: 'PM2.5: 15μg/m³', icon: '🌬️', iconBg: 'rgba(57,217,138,0.12)' },
  { label: '水质综合指数', value: 'Ⅱ类', sub: '3号水塘需关注', icon: '💧', iconBg: 'rgba(14,165,233,.10)' },
  { label: '碳汇量估算', value: '860', sub: '吨CO₂当量/年', icon: '🌳', iconBg: '#FFF8E8' },
  { label: '秸秆综合利用率', value: '92%', sub: '↑5% 同比', icon: '♻️', iconBg: '#FDE8E8' }
]`;
const newStats = `const ecoStats = [
  { label: '空气质量指数', value: '42', valueTag: '优', sub: 'PM2.5: 15μg/m³', icon: '🌬️', iconBg: 'rgba(34,181,115,0.12)' },
  { label: '水质综合指数', value: 'Ⅱ类', sub: '3号水塘需关注', icon: '💧', iconBg: 'rgba(14,165,233,.10)' },
  { label: '碳汇量估算', value: '860', sub: '吨CO₂当量/年', icon: '🌳', iconBg: '#FFF8E8' },
  { label: '秸秆综合利用率', value: '92%', sub: '↑5% 同比', icon: '♻️', iconBg: '#FDE8E8' }
]`;
if (s.includes(oldStats)) { s = s.replace(oldStats, newStats); check('3-ecoStats-split', true); }
else { check('3-ecoStats-split', false); }

// ===== 4. 快捷操作: remove card bg, inline buttons =====
const oldQuick = `          <div class="panel" style="margin-bottom:10px">
            <div class="panel-hd"><span class="hd-bar g"></span>⚡ 快捷操作</div>
            <div class="panel-bd">
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <button class="btn btn-primary" @click="toast('环境巡检任务已下发','success')">🔍 发起巡检</button>
                <button class="btn btn-outline" @click="toast('数据已上报环保部门','info')">📤 上报数据</button>
                <button class="btn btn-outline" @click="toast('垃圾分类统计已生成','info')">♻️ 垃圾分类统计</button>
                <button class="btn btn-outline" @click="toast('碳汇核算报告已导出','info')">🌳 碳汇核算</button>
              </div>
            </div>
          </div>`;
const newQuick = `          <!-- 快捷操作 — 无卡片背景，按钮内联 -->
          <div style="margin-bottom:10px">
            <div class="panel-hd" style="padding:0 2px 6px"><span class="hd-bar g"></span>⚡ 快捷操作</div>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn btn-primary" @click="toast('环境巡检任务已下发','success')">🔍 发起巡检</button>
              <button class="btn btn-outline" @click="toast('数据已上报环保部门','info')">📤 上报数据</button>
              <button class="btn btn-outline" @click="toast('垃圾分类统计已生成','info')">♻️ 垃圾分类统计</button>
              <button class="btn btn-outline" @click="toast('碳汇核算报告已导出','info')">🌳 碳汇核算</button>
            </div>
          </div>`;
if (s.includes(oldQuick)) { s = s.replace(oldQuick, newQuick); check('4-quick-actions-inline', true); }
else { check('4-quick-actions-inline', false); }

// ===== 5. Lighten initEcoCharts (scoped to this function only) =====
const ecoStart = s.indexOf('function initEcoCharts() {');
const iotStart = s.indexOf('function initIotCharts() {');
if (ecoStart === -1 || iotStart === -1 || iotStart <= ecoStart) {
  check('5-eco-chart-colors', false);
} else {
  let eco = s.substring(ecoStart, iotStart);
  const pairs = [
    ["backgroundColor: 'rgba(4,18,40,0.95)', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#c8daea', fontSize: 10 }",
     "backgroundColor: '#FFFFFF', borderColor: '#E3EAF0', textStyle: { color: '#1F2D3D', fontSize: 12 }"],
    ["textStyle: { color: '#5e7a9a', fontSize: 9 }",
     "textStyle: { color: '#66788A', fontSize: 12 }"],
    ["axisLabel: { color: '#5e7a9a', fontSize: 9, rotate: 15 }",
     "axisLabel: { color: '#66788A', fontSize: 12, rotate: 15 }"],
    ["axisLabel: { color: '#5e7a9a', fontSize: 9 }",
     "axisLabel: { color: '#66788A', fontSize: 12 }"],
    ["splitLine: { lineStyle: { color: 'rgba(14,165,233,0.06)' } }",
     "splitLine: { lineStyle: { color: '#EEF2F6' } }"],
    ["fontSize: 9, color: '#F2A62B'",
     "fontSize: 12, color: '#F2A62B'"],
  ];
  let cnt = 0;
  for (const [a, b] of pairs) {
    while (eco.includes(a)) { eco = eco.replace(a, b); cnt++; }
  }
  s = s.substring(0, ecoStart) + eco + s.substring(iotStart);
  check('5-eco-chart-colors (' + cnt + ' replacements)', cnt >= 8);
}

// ===== 6. Append .eco-theme override block before last </style> =====
const lastClose = s.lastIndexOf('</style>');
const ecoCss = `
/* ========== ECOLOGY LIGHT THEME (生态绿 #22B573) ========== */
.eco-theme { background:#F4F7FA }
.eco-theme .panel {
  background:#FFFFFF; border:1px solid #E3EAF0;
  box-shadow:0 1px 4px rgba(0,0,0,0.06); backdrop-filter:none;
}
.eco-theme .panel-hd { color:#1F2D3D }
.eco-theme .panel-hd .extra { color:#66788A }

/* hd-bars — ecology green primary */
.eco-theme .hd-bar { background:#22B573; box-shadow:0 0 7px rgba(34,181,115,0.20) }
.eco-theme .hd-bar.g { background:#22B573; box-shadow:0 0 7px rgba(34,181,115,0.20) }
.eco-theme .hd-bar.y { background:#F2A62B; box-shadow:0 0 7px rgba(242,166,43,0.20) }
.eco-theme .hd-bar.r { background:#E05252; box-shadow:0 0 7px rgba(224,82,82,0.20) }

/* stat cards */
.eco-theme .stat-card {
  background:#FFFFFF; border:1px solid #E3EAF0;
  box-shadow:0 1px 3px rgba(0,0,0,0.05); backdrop-filter:none;
}
.eco-theme .stat-card:hover { background:rgba(34,181,115,0.04); border-color:#22B573; box-shadow:0 4px 12px rgba(0,0,0,0.08) }
.eco-theme .sc-val { color:#1F2D3D }
.eco-theme .sc-lbl { color:#66788A }
.eco-theme .sc-sub { color:#66788A; opacity:.65 }
.eco-theme .stat-card.g .sc-val { color:#22B573 }
.eco-theme .stat-card.y .sc-val { color:#F2A62B }
.eco-theme .stat-card.r .sc-val { color:#E05252 }

/* value tag (优) */
.eco-theme .sc-tag {
  display:inline-block; margin-left:8px; padding:2px 10px; border-radius:8px;
  font-size:14px; font-weight:600; vertical-align:middle; line-height:1.4;
  background:rgba(34,181,115,0.12); color:#22B573;
}

/* buttons */
.eco-theme .btn-primary { background:linear-gradient(135deg,#22B573,#1BA366); color:#fff; box-shadow:0 2px 8px rgba(34,181,115,0.25) }
.eco-theme .btn-primary:hover { box-shadow:0 4px 14px rgba(34,181,115,0.35); transform:translateY(-2px) }
.eco-theme .btn-outline { background:#FFFFFF; border:1px solid #C8D4E0; color:#66788A }
.eco-theme .btn-outline:hover { background:rgba(34,181,115,0.06); border-color:#22B573; color:#22B573 }

/* alert list */
.eco-theme .alert-item { background:#FFFFFF; border-left:2px solid #F2A62B }
.eco-theme .alert-item.r { border-left-color:#E05252 }
.eco-theme .alert-item:hover { background:rgba(34,181,115,0.04) }
.eco-theme .ai-title { color:#1F2D3D }
.eco-theme .ai-desc { color:#66788A }
.eco-theme .ai-time { color:#66788A; opacity:.6 }

/* data-table */
.eco-theme .data-table th { background:#F0F3F8; color:#66788A; border-bottom:2px solid #E3EAF0 }
.eco-theme .data-table td { border-bottom:1px solid #EBEFF4; color:#1F2D3D }
.eco-theme .data-table tr:hover td { background:rgba(34,181,115,0.04) }

/* status badges */
.eco-theme .st.online, .eco-theme .st.info { background:rgba(34,181,115,0.10); color:#22B573 }
.eco-theme .st.warning { background:rgba(242,166,43,0.10); color:#F2A62B }
.eco-theme .st.offline { background:rgba(224,82,82,0.10); color:#E05252 }

/* 生态中心统计栏：4 张卡等宽铺满整行 */
.eco-theme .stat-grid { grid-template-columns:repeat(4,1fr); gap:10px }
@media (max-width:1200px) { .eco-theme .stat-grid { grid-template-columns:repeat(2,1fr) } }

/* ========== ECOLOGY FONT SCALE — 村民可读字号 ========== */
.eco-theme {
  --eco-title: 18px;
  --eco-body: 16px;
  --eco-secondary: 14px;
  --eco-button: 15px;
  --eco-stat-num: 32px;
  --eco-stat-lbl: 17px;
  line-height: 1.55;
}
.eco-theme .panel-hd { font-size: var(--eco-title); letter-spacing: 0 }
.eco-theme .panel-hd .extra { font-size: var(--eco-secondary) }
.eco-theme .stat-card { padding: 16px 20px }
.eco-theme .sc-val { font-size: var(--eco-stat-num) }
.eco-theme .sc-lbl { font-size: var(--eco-stat-lbl) }
.eco-theme .sc-sub { font-size: var(--eco-secondary) }
.eco-theme .sc-icon { font-size: 22px; width: 46px; height: 46px }
.eco-theme .alert-item { padding: 11px 12px }
.eco-theme .ai-ico { font-size: 20px }
.eco-theme .ai-title { font-size: var(--eco-body) }
.eco-theme .ai-desc { font-size: var(--eco-secondary) }
.eco-theme .ai-time { font-size: var(--eco-secondary) }
.eco-theme .data-table th, .eco-theme .data-table td { font-size: var(--eco-body) }
.eco-theme .st { font-size: var(--eco-secondary); padding: 4px 12px }
.eco-theme .btn { font-size: var(--eco-button) }`;
if (lastClose !== -1) {
  s = s.substring(0, lastClose) + ecoCss + '\n' + s.substring(lastClose);
  check('6-append-eco-theme-css', true);
} else { check('6-append-eco-theme-css', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== ECOLOGY REDESIGN ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
