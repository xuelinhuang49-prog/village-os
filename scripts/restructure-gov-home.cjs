// Restructure governance homepage into a clear farmer-facing hierarchy:
//   ① 事件上报 → ② 我的上报 → ③ 村务提醒 + ④ 网格员 → ⑤ AI
// Cuts: delete the big 我的上报 table (duplicate), delete the 4 action buttons
// (duplicate nav), compress 事件上报 cards, compress 网格员 to a compact card.
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. 事件上报 panel: drop desc + drop the 4 action buttons + shorten subtitle =====
const oldReport = `          <!-- Event report quick-service area (prominent) -->
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
const newReport = `          <!-- ① 事件上报 — 快速上报入口 -->
          <div class="panel" style="margin-bottom:10px">
            <div class="panel-hd"><span class="hd-bar"></span>📝 事件上报<span class="extra">发现问题，随手拍、马上报</span></div>
            <div class="panel-bd" style="padding:8px">
              <div class="report-cat-grid">
                <div class="report-cat" v-for="t in reportTypes" :key="t.value" @click="selectReportType(t.value)">
                  <span class="rc-icon">{{ t.icon }}</span>
                  <span class="rc-label">{{ t.label }}</span>
                </div>
              </div>
            </div>
          </div>`;
if (s.includes(oldReport)) { s = s.replace(oldReport, newReport); check('1-event-report-compact', true); }
else { check('1-event-report-compact', false); }

// ===== 2. Replace 我的上报 table + 近期上报/村务提醒 grid + 网格员 panel with new hierarchy =====
const startMark = '          <!-- My events table -->';
const endMark = '          <!-- AI Assistant (kept for farmers) -->';
const startIdx = s.indexOf(startMark);
const endIdx = s.indexOf(endMark);
if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
  check('2-middle-restructure', false);
} else {
  const newMiddle = `          <!-- ② 我的上报 — 最近3条 -->
          <div class="panel" style="margin-bottom:10px">
            <div class="panel-hd"><span class="hd-bar"></span>📋 我的上报<span class="extra" style="cursor:pointer;color:#19B98A;font-size:11px" @click="showMyReports()">查看全部 ›</span></div>
            <div class="panel-bd" style="padding:8px">
              <div v-if="recentReports.length > 0">
                <div v-for="r in recentReports" :key="r.id" class="gov-news-item" @click="showMyEventDetail(r)">
                  <div class="gni-left"><span class="gni-type" :style="{background:r.typeBg}">{{ r.icon }} {{ r.type }}</span></div>
                  <div class="gni-mid">
                    <div class="gni-loc">{{ r.location }}</div>
                    <div class="gni-time">{{ r.time }}</div>
                  </div>
                  <div class="gni-right"><span class="st" :class="r.statusCls" style="font-size:10px">{{ r.status }}</span></div>
                </div>
              </div>
              <div v-else style="text-align:center;padding:20px 0;color:#66788A;font-size:11px">暂无上报记录</div>
            </div>
          </div>

          <!-- ③④ 村务提醒 + 我的网格员 -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar y"></span>📢 村务提醒<span class="extra" style="cursor:pointer;color:#19B98A;font-size:11px" @click="showVillageNotices()">查看全部 ›</span></div>
              <div class="panel-bd" style="padding:8px">
                <div v-if="villageNotices.length > 0">
                  <div v-for="n in villageNotices" :key="n.id" class="gov-news-item" @click="showNoticeDetail(n)">
                    <div class="gni-left"><span class="gni-icon-big">{{ n.icon }}</span></div>
                    <div class="gni-mid">
                      <div class="gni-loc">{{ n.title }}<span v-if="n.tag" style="display:inline-block;padding:1px 6px;border-radius:6px;font-size:8px;font-weight:600;margin-left:5px;color:#E05252;background:rgba(224,82,82,0.10);vertical-align:middle">{{ n.tag }}</span></div>
                      <div class="gni-time">{{ n.date }} · {{ n.source }}</div>
                    </div>
                    <div class="gni-right"><span style="font-size:10px;color:#19B98A">查看 →</span></div>
                  </div>
                </div>
                <div v-else style="text-align:center;padding:20px 0;color:#66788A;font-size:11px">暂无村务提醒</div>
              </div>
            </div>
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar"></span>👤 我的网格员</div>
              <div class="panel-bd" style="padding:8px">
                <div class="grid-worker-card">
                  <div class="gw-avatar">{{ gridWorker.avatar }}</div>
                  <div class="gw-info">
                    <div class="gw-name">{{ gridWorker.name }} <span class="gw-role">{{ gridWorker.role }}</span></div>
                    <div class="gw-meta">
                      <span>🏘️ {{ gridWorker.grid }}</span>
                      <span>📍 {{ gridWorker.area }}</span>
                    </div>
                  </div>
                  <div class="gw-actions">
                    <button class="btn btn-primary btn-sm" @click="callGridWorker()">📞 联系</button>
                    <button class="btn btn-outline btn-sm" @click="showGridWorkerInfo()">查看详情</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
`;
  s = s.substring(0, startIdx) + newMiddle + s.substring(endIdx);
  check('2-middle-restructure', true);
}

// ===== 3. recentReports: add icon field for emoji in type badge =====
const oldRecent = `const recentReports = [
  { id: 'R001', type: '基础设施', typeBg: '#19B98A', location: '村东口路灯不亮', time: '7月12日', status: '处理中', statusCls: 'warning' },
  { id: 'R002', type: '环境卫生', typeBg: '#22B573', location: '3组晒场旁垃圾堆积', time: '7月8日', status: '已办结', statusCls: 'online' },
  { id: 'R003', type: '农业生产', typeBg: '#F2A62B', location: '苹果园区灌溉水压不足', time: '6月25日', status: '已办结', statusCls: 'online' }
]`;
const newRecent = `const recentReports = [
  { id: 'R001', type: '基础设施', icon: '🚧', typeBg: '#19B98A', location: '村东口路灯不亮', time: '7月12日', status: '处理中', statusCls: 'warning' },
  { id: 'R002', type: '环境卫生', icon: '🧹', typeBg: '#22B573', location: '3组晒场旁垃圾堆积', time: '7月8日', status: '已办结', statusCls: 'online' },
  { id: 'R003', type: '农业生产', icon: '🌾', typeBg: '#F2A62B', location: '苹果园区灌溉水压不足', time: '6月25日', status: '已办结', statusCls: 'online' }
]`;
if (s.includes(oldRecent)) { s = s.replace(oldRecent, newRecent); check('3-recentReports-icon', true); }
else { check('3-recentReports-icon', false); }

// ===== 4. CSS: compress report-cat, drop rc-desc + report-actions =====
const oldCss = `.report-cat {
  display:flex; flex-direction:column; align-items:center; gap:5px;
  padding:14px 10px; background:#FFFFFF; border:1px solid #E3EAF0; border-radius:10px;
  cursor:pointer; transition:all .2s; text-align:center;
}
.report-cat:hover { background:rgba(25,185,138,0.05); border-color:#19B98A; transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.06) }
.report-cat .rc-icon { font-size:26px; line-height:1 }
.report-cat .rc-label { font-size:13px; font-weight:600; color:#1F2D3D }
.report-cat .rc-desc { font-size:10px; color:#66788A }
.report-actions { display:flex; gap:10px; justify-content:center; margin-top:14px; flex-wrap:wrap }`;
const newCss = `.report-cat {
  display:flex; flex-direction:column; align-items:center; gap:4px;
  padding:10px 8px; background:#FFFFFF; border:1px solid #E3EAF0; border-radius:10px;
  cursor:pointer; transition:all .2s; text-align:center;
}
.report-cat:hover { background:rgba(25,185,138,0.05); border-color:#19B98A; transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.06) }
.report-cat .rc-icon { font-size:24px; line-height:1 }
.report-cat .rc-label { font-size:12px; font-weight:600; color:#1F2D3D }`;
if (s.includes(oldCss)) { s = s.replace(oldCss, newCss); check('4-report-cat-css', true); }
else { check('4-report-cat-css', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== GOV HOME RESTRUCTURE ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
