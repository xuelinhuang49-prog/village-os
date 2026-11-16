// Ecology Center — charts interactive + table "查看" column.
//   1. Water chart: mark 3号水塘 with an "⚠ 异常" label + click handler
//   2. Bump eco chart axis/legend fonts 12 -> 13
//   3. Table: add 查看 column opening a monitoring detail modal
//   4. Add openMonitorDetail function
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. 3号水塘 abnormal label =====
const oldBar = `          { value: 3.2, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#E05252' }, { offset: 1, color: 'rgba(239,68,68,.2)' }]) } },`;
const newBar = `          { value: 3.2, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#E05252' }, { offset: 1, color: 'rgba(239,68,68,.2)' }]) }, label: { show: true, position: 'top', color: '#E05252', fontSize: 13, fontWeight: 700, formatter: '⚠ 异常' } },`;
if (s.includes(oldBar)) { s = s.replace(oldBar, newBar); check('1-water-3rd-abnormal-label', true); }
else { check('1-water-3rd-abnormal-label', false); }

// ===== 2. Capture water chart instance =====
const oldMake = `    makeChart(chartEcoWater.value, {`;
const newMake = `    const _ecoWaterChart = makeChart(chartEcoWater.value, {`;
if (s.includes(oldMake)) { s = s.replace(oldMake, newMake); check('2-capture-water-chart', true); }
else { check('2-capture-water-chart', false); }

// ===== 3. Attach click handler to water chart =====
const oldClose = `    })\n  }\n  if (chartEcoCarbon.value) {`;
const newClose = `    })\n    _ecoWaterChart.on('click', function(params) {\n      if (params.name === '3号水塘') openEcoAlertDetail(ecoAlerts[0])\n      else toast(params.name + ' 水质正常', 'info')\n    })\n  }\n  if (chartEcoCarbon.value) {`;
if (s.includes(oldClose)) { s = s.replace(oldClose, newClose); check('3-water-click-handler', true); }
else { check('3-water-click-handler', false); }

// ===== 4. Bump eco chart fonts 12 -> 13 (scoped to initEcoCharts) =====
const ecoStart = s.indexOf('function initEcoCharts() {');
const iotStart = s.indexOf('function initIotCharts() {');
if (ecoStart === -1 || iotStart === -1 || iotStart <= ecoStart) {
  check('4-chart-fonts-13', false);
} else {
  let eco = s.substring(ecoStart, iotStart);
  const cnt = (eco.match(/fontSize: 12/g) || []).length;
  eco = eco.split('fontSize: 12').join('fontSize: 13');
  s = s.substring(0, ecoStart) + eco + s.substring(iotStart);
  check('4-chart-fonts-13 (' + cnt + ' replaced)', cnt > 0);
}

// ===== 5. Table: add 查看 column =====
const oldTable = `              <table class="data-table">
                <thead><tr><th>监测点</th><th>类型</th><th>当前值</th><th>标准值</th><th>状态</th><th>更新时间</th></tr></thead>
                <tbody>
                  <tr v-for="r in ecoTableData" :key="r.name">
                    <td>{{ r.name }}</td><td>{{ r.type }}</td><td>{{ r.value }}</td>
                    <td>{{ r.standard }}</td><td><span class="st" :class="r.statusCls">{{ r.status }}</span></td><td>{{ r.updateTime }}</td>
                  </tr>
                </tbody>
              </table>`;
const newTable = `              <table class="data-table">
                <thead><tr><th>监测点</th><th>类型</th><th>当前值</th><th>标准值</th><th>状态</th><th>更新时间</th><th></th></tr></thead>
                <tbody>
                  <tr v-for="r in ecoTableData" :key="r.name">
                    <td>{{ r.name }}</td><td>{{ r.type }}</td><td>{{ r.value }}</td>
                    <td>{{ r.standard }}</td><td><span class="st" :class="r.statusCls">{{ r.status }}</span></td><td>{{ r.updateTime }}</td>
                    <td><button class="btn btn-outline btn-sm" @click="openMonitorDetail(r)">查看</button></td>
                  </tr>
                </tbody>
              </table>`;
if (s.includes(oldTable)) { s = s.replace(oldTable, newTable); check('5-table-view-column', true); }
else { check('5-table-view-column', false); }

// ===== 6. Insert openMonitorDetail after openEcoAlertDetail =====
const anchor = `  openGovModal(a.title, h)
}`;
const funcs = `${anchor}

function openMonitorDetail(r) {
  const abnormal = r.status !== '正常'
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><span style="font-size:24px">📡</span><span style="font-size:17px;color:#1F2D3D;font-weight:700">' + r.name + '</span></div>' +
    '<div style="display:flex;flex-direction:column;margin-bottom:16px">' +
    ecoAlertField('📋 监测类型', r.type) +
    ecoAlertField('📊 当前值', r.value) +
    ecoAlertField('✅ 标准值', r.standard) +
    ecoAlertField('🕐 更新时间', r.updateTime) +
    '</div>' +
    '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px;margin-bottom:16px">' +
    '<span style="font-size:15px;color:#1E7A54;line-height:1.6">' + (abnormal ? '⚠️ 该监测点数据异常，请关注相关告警。' : '✅ 该监测点运行正常，数据处于标准范围内。') + '</span></div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    (abnormal ? '<button class="btn btn-primary" onclick="window._svc.viewWaterAlert()">🚨 查看告警</button>'
              : '<button class="btn btn-primary" onclick="window._svc.reportEnvironment()">📷 上报问题</button>') +
    '</div></div>'
  openGovModal(r.name + ' · 监测详情', h)
}`;
if (s.includes(anchor)) { s = s.replace(anchor, funcs); check('6-insert-monitor-detail', true); }
else { check('6-insert-monitor-detail', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== ECOLOGY CHARTS + TABLE ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
