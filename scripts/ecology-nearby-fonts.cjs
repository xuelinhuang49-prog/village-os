// Ecology Center — add "🌱 我身边的环境" entry + final font polish.
//   1. Insert a prominent green "我身边的环境" entry above 快捷操作
//   2. Add showNearbyEnv / nearbyTile / viewWaterAlert functions
//   3. Register viewWaterAlert on window._svc
//   4. Font polish: title 18->20px, secondary 14->15px
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. Insert 我身边的环境 entry before 快捷操作 =====
const anchor = `          <!-- 快捷操作 — 村民生态服务入口 -->`;
const nearbyHtml = `          <!-- 我身边的环境 — 核心入口 -->
          <div @click="showNearbyEnv()" style="margin-bottom:10px;padding:14px 16px;background:linear-gradient(135deg,#22B573,#1BA366);border-radius:10px;color:#fff;cursor:pointer;display:flex;align-items:center;gap:12px;box-shadow:0 2px 8px rgba(34,181,115,0.25);transition:all .2s" onmouseover="this.style.boxShadow='0 4px 14px rgba(34,181,115,0.35)'" onmouseout="this.style.boxShadow='0 2px 8px rgba(34,181,115,0.25)'">
            <span style="font-size:26px">🌱</span>
            <div style="flex:1"><div style="font-size:17px;font-weight:700">我身边的环境</div><div style="font-size:14px;opacity:.92;margin-top:2px">查看我所在片区的空气、水质、垃圾点和告警</div></div>
            <span style="font-size:20px">›</span>
          </div>`;
if (s.includes(anchor)) { s = s.replace(anchor, nearbyHtml + '\n' + anchor); check('1-nearby-entry', true); }
else { check('1-nearby-entry', false); }

// ===== 2. Insert functions after openMonitorDetail =====
const anchor2 = `  openGovModal(r.name + ' · 监测详情', h)
}`;
const funcs = `${anchor2}

function showNearbyEnv() {
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><span style="font-size:15px;color:#66788A">📍 所在片区：</span><span style="font-size:16px;color:#1F2D3D;font-weight:700">1组片区 · 第2网格</span></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">' +
    nearbyTile('🌬️', '空气', '优', 'green', 'AQI 42') +
    nearbyTile('💧', '水质', '异常', 'red', '3号水塘 800m') +
    nearbyTile('🗑️', '垃圾点', '待清运', 'amber', '1组点 200m') +
    nearbyTile('⚠️', '告警', '1条', 'amber', '需关注') +
    '</div>' +
    '<div style="background:#FDECEC;border:1px solid #F5C4C4;border-radius:8px;padding:12px 14px;margin-bottom:16px">' +
    '<div style="font-size:16px;color:#C0392B;font-weight:700;margin-bottom:6px">⚠️ 距您最近的环境问题</div>' +
    '<div style="font-size:15px;color:#8A3F3A;line-height:1.7">3号水塘溶解氧偏低（约 800 米），请勿在附近取水饮用。</div></div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-outline" onclick="window._svc.viewWaterAlert()">查看告警</button>' +
    '<button class="btn btn-primary" onclick="window._svc.reportEnvironment()">📷 上报环境问题</button>' +
    '</div></div>'
  openGovModal('🌱 我身边的环境', h)
}
function nearbyTile(icon, label, val, tone, meta) {
  const color = tone === 'red' ? '#E05252' : tone === 'amber' ? '#F2A62B' : '#22B573'
  return '<div style="background:#FFFFFF;border:1px solid #E3EAF0;border-radius:8px;padding:12px"><div style="font-size:22px">' + icon + '</div><div style="font-size:15px;color:#1F2D3D;font-weight:700;margin-top:6px">' + label + '</div><div style="font-size:15px;font-weight:700;margin-top:2px;color:' + color + '">' + val + '</div><div style="font-size:14px;color:#66788A;margin-top:2px">' + meta + '</div></div>'
}
function viewWaterAlert() { openEcoAlertDetail(ecoAlerts[0]) }`;
if (s.includes(anchor2)) { s = s.replace(anchor2, funcs); check('2-insert-nearby-functions', true); }
else { check('2-insert-nearby-functions', false); }

// ===== 3. Register viewWaterAlert on window._svc =====
const oldSvc = `    showMyEventDetailById, filterMyReports, previewPhoto, requestGarbage, requestStraw, reportEnvironment,`;
const newSvc = `    showMyEventDetailById, filterMyReports, previewPhoto, requestGarbage, requestStraw, reportEnvironment, viewWaterAlert,`;
if (s.includes(oldSvc)) { s = s.replace(oldSvc, newSvc); check('3-register-viewWaterAlert', true); }
else { check('3-register-viewWaterAlert', false); }

// ===== 4. Font polish: title 18->20, secondary 14->15 =====
let a = 0;
if (s.includes('  --eco-title: 18px;')) { s = s.replace('  --eco-title: 18px;', '  --eco-title: 20px;'); a++; }
if (s.includes('  --eco-secondary: 14px;')) { s = s.replace('  --eco-secondary: 14px;', '  --eco-secondary: 15px;'); a++; }
check('4-font-polish (expected 2)', a === 2);

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== ECOLOGY NEARBY + FONTS ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
