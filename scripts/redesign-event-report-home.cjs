// Redesign governance homepage 事件上报 quick-service area:
// 1. Extract shared reportTypes const (icon/label/desc split; 基础设施 uses 🚧 per user mockup)
// 2. Refactor renderReportForm step-1 to use reportTypes
// 3. Make selectReportType a safe direct-entry (resets state -> step 2)
// 4. Replace gov-quick-bar with prominent 6-category panel + 我要上报 + 3 outline action buttons
// 5. Add scoped CSS for category card grid
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. Add shared reportTypes const before GOVERNANCE FUNCTIONS =====
const anchor = '// ==================== GOVERNANCE FUNCTIONS ====================';
const reportTypes = `// Report type categories — shared by homepage quick cards + step-1 selection modal
const reportTypes = [
  { value: 'infrastructure', icon: '🚧', label: '基础设施', desc: '道路、路灯、水电等' },
  { value: 'environment', icon: '🧹', label: '环境卫生', desc: '垃圾、污水、绿化等' },
  { value: 'safety', icon: '⚠️', label: '安全隐患', desc: '井盖、电线、消防等' },
  { value: 'agriculture', icon: '🌾', label: '农业生产', desc: '灌溉、虫害、施肥等' },
  { value: 'elderly', icon: '👴', label: '老人关怀', desc: '独居老人、困难户等' },
  { value: 'other', icon: '📌', label: '其他事项', desc: '其他需要上报的问题' }
]

${anchor}`;
if (s.includes(anchor)) { s = s.replace(anchor, reportTypes); check('1-add-reportTypes-const', true); }
else { check('1-add-reportTypes-const', false); }

// ===== 2. Remove local `types` array in renderReportForm step-1 =====
const oldTypesBlock = `    const types = [
      { value: 'infrastructure', label: '🏗️ 基础设施', desc: '道路、路灯、水电等' },
      { value: 'environment', label: '🧹 环境卫生', desc: '垃圾、污水、绿化等' },
      { value: 'safety', label: '⚠️ 安全隐患', desc: '井盖、电线、消防等' },
      { value: 'agriculture', label: '🌾 农业生产', desc: '灌溉、虫害、施肥等' },
      { value: 'elderly', label: '👴 老人关怀', desc: '独居老人、困难户等' },
      { value: 'other', label: '📌 其他事项', desc: '其他需要上报的问题' }
    ]
    let h = `;
if (s.includes(oldTypesBlock)) { s = s.replace(oldTypesBlock, '    let h = '); check('2-remove-local-types', true); }
else { check('2-remove-local-types', false); }

// ===== 3. types.forEach -> reportTypes.forEach =====
if (s.includes('    types.forEach(t => {')) { s = s.replace('    types.forEach(t => {', '    reportTypes.forEach(t => {'); check('3-reportTypes-forEach', true); }
else { check('3-reportTypes-forEach', false); }

// ===== 4. step-1 label render: t.label -> t.icon + ' ' + t.label =====
const oldLabelSpan = `h += '<span style="font-size:13px;color:#1F2D3D;font-weight:600">' + t.label + '</span>'`;
const newLabelSpan = `h += '<span style="font-size:13px;color:#1F2D3D;font-weight:600">' + t.icon + ' ' + t.label + '</span>'`;
if (s.includes(oldLabelSpan)) { s = s.replace(oldLabelSpan, newLabelSpan); check('4-step1-label-icon', true); }
else { check('4-step1-label-icon', false); }

// ===== 5. step-2 typeLabels: 基础设施 🏗️ -> 🚧 (keep consistent with reportTypes) =====
const oldTypeLabels = `const typeLabels = { infrastructure: '🏗️ 基础设施', environment: '🧹 环境卫生'`;
const newTypeLabels = `const typeLabels = { infrastructure: '🚧 基础设施', environment: '🧹 环境卫生'`;
if (s.includes(oldTypeLabels)) { s = s.replace(oldTypeLabels, newTypeLabels); check('5-typeLabels-infra-icon', true); }
else { check('5-typeLabels-infra-icon', false); }

// ===== 6. selectReportType: reset report state (safe direct entry from homepage) =====
const oldSelect = `function selectReportType(type) {
  _reportType = type
  _reportStep = 2
  renderReportForm()
}`;
const newSelect = `function selectReportType(type) {
  _reportType = type
  _reportStep = 2
  _reportDesc = ''; _reportLocation = ''; _reportPhotos = []
  _reportLat = null; _reportLng = null; _reportAccuracy = null; _reportGpsStatus = 'idle'
  renderReportForm()
}`;
if (s.includes(oldSelect)) { s = s.replace(oldSelect, newSelect); check('6-selectReportType-reset', true); }
else { check('6-selectReportType-reset', false); }

// ===== 7. Replace gov-quick-bar with prominent 事件上报 panel =====
const oldQuickBar = `          <!-- Quick services bar -->
          <div class="gov-quick-bar">
            <button class="gov-qbtn primary" @click="showEventReportForm()"><span class="qbtn-icon">📝</span>事件上报</button>
            <button class="gov-qbtn" @click="showMyReports()"><span class="qbtn-icon">📋</span>我的上报</button>
            <button class="gov-qbtn" @click="showGridWorkerInfo()"><span class="qbtn-icon">📞</span>网格员联系</button>
            <button class="gov-qbtn" @click="showVillageNotices()"><span class="qbtn-icon">📢</span>村务公告</button>
          </div>`;
const newQuickBar = `          <!-- Event report quick-service area (prominent) -->
          <div class="panel" style="margin-bottom:10px">
            <div class="panel-hd"><span class="hd-bar"></span>📝 事件上报<span class="extra">发现村里问题，随手拍、马上报</span></div>
            <div class="panel-bd" style="padding:8px">
              <div class="report-cat-grid">
                <div class="report-cat" v-for="t in reportTypes" :key="t.value" @click="selectReportType(t.value)">
                  <span class="rc-icon">{{ t.icon }}</span>
                  <span class="rc-label">{{ t.label }}</span>
                  <span class="rc-desc">{{ t.desc }}</span>
                </div>
              </div>
              <div class="report-actions">
                <button class="btn btn-primary" @click="showEventReportForm()">📝 我要上报</button>
                <button class="btn btn-outline" @click="showMyReports()">📋 我的上报</button>
                <button class="btn btn-outline" @click="showGridWorkerInfo()">📞 网格员联系</button>
                <button class="btn btn-outline" @click="showVillageNotices()">📢 村务公告</button>
              </div>
            </div>
          </div>`;
if (s.includes(oldQuickBar)) { s = s.replace(oldQuickBar, newQuickBar); check('7-replace-quick-bar', true); }
else { check('7-replace-quick-bar', false); }

// ===== 8. Add scoped CSS for report category grid =====
const cssAnchor = `.qbtn-icon { font-size:16px }`;
const cssAdd = `.qbtn-icon { font-size:16px }

/* ========== REPORT QUICK CATEGORIES ========== */
.report-cat-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:10px }
.report-cat {
  display:flex; flex-direction:column; align-items:center; gap:5px;
  padding:14px 10px; background:#FFFFFF; border:1px solid #E3EAF0; border-radius:10px;
  cursor:pointer; transition:all .2s; text-align:center;
}
.report-cat:hover { background:rgba(25,185,138,0.05); border-color:#19B98A; transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.06) }
.report-cat .rc-icon { font-size:26px; line-height:1 }
.report-cat .rc-label { font-size:13px; font-weight:600; color:#1F2D3D }
.report-cat .rc-desc { font-size:10px; color:#66788A }
.report-actions { display:flex; gap:10px; justify-content:center; margin-top:14px; flex-wrap:wrap }
@media (max-width:640px) { .report-cat-grid { grid-template-columns:repeat(2, 1fr) } }`;
if (s.includes(cssAnchor)) { s = s.replace(cssAnchor, cssAdd); check('8-add-report-cat-css', true); }
else { check('8-add-report-cat-css', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== EVENT REPORT HOME REDESIGN ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
