// 农户端统一身份规则：当前登录农户 = 王友德，所有“本人办理”业务统一从 currentUser 读取身份，
// 不再写死 name:'张大姐'/farmer_id:'farmer_001' 等演示数据。
//   1. currentArea + currentFarmer 合并为单一 currentUser（姓名/手机号/farmerId/村/村组/网格）
//   2. 秸秆表单自动带入增加“村组/网格”
//   3. 事件上报 farmer_id 改从 currentUser 读取
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }
function gsub(oldStr, newStr) { const before = s; s = s.split(oldStr).join(newStr); return s !== before; }

// ===== 1. currentArea → currentUser（单一身份源） =====
const a1 = `// 当前登录农户的定位/档案（统一数据源 — 各页面共用，避免各写一套片区）
const currentArea = { village: '中堰村', zone: '1组片区', grid: '第2网格', gridId: 'GRID_02' }`;
const n1 = `// 当前登录农户身份（统一数据源 — 所有“本人办理”业务都从这里取，不写死演示数据）
const currentUser = { name: '王友德', phone: '138****5678', farmerId: 'farmer_001', village: '中堰村', zone: '1组片区', grid: '第2网格', gridId: 'GRID_02' }`;
if (s.includes(a1)) { s = s.replace(a1, n1); check('1-currentUser', true); }
else { check('1-currentUser', false); }

// ===== 2. currentArea.* 引用 → currentUser.* =====
check('2-currentArea-refs', gsub(`currentArea.`, `currentUser.`));

// ===== 3. 移除重复的 currentFarmer 定义 =====
const a3 = `// 当前登录农户档案（统一数据源 — 姓名/村/手机号脱敏展示）
const currentFarmer = { name: '张大姐', village: '中堰村', phone: '138****5678' }
`;
if (s.includes(a3)) { s = s.replace(a3, ''); check('3-remove-currentFarmer', true); }
else { check('3-remove-currentFarmer', false); }

// ===== 4. currentFarmer.* 引用 → currentUser.* =====
check('4-currentFarmer-refs', gsub(`currentFarmer.`, `currentUser.`));

// ===== 5. 秸秆表单自动带入增加“村组/网格” =====
const a5 = `  h += '<div style="font-size:12px;color:#475867">🏘 所属村：' + currentUser.village + '</div>'
  h += '<div style="font-size:12px;color:#475867">📱 联系电话：' + currentUser.phone + '（脱敏）</div>'`;
const n5 = `  h += '<div style="font-size:12px;color:#475867">🏘 所属村：' + currentUser.village + '</div>'
  h += '<div style="font-size:12px;color:#475867">🗺 村组/网格：' + currentUser.zone + ' · ' + currentUser.grid + '</div>'
  h += '<div style="font-size:12px;color:#475867">📱 联系电话：' + currentUser.phone + '（脱敏）</div>'`;
if (s.includes(a5)) { s = s.replace(a5, n5); check('5-straw-zone-grid', true); }
else { check('5-straw-zone-grid', false); }

// ===== 6. 事件上报 farmer_id 从 currentUser 读取 =====
const a6 = `    farmer_id: 'farmer_001',`;
const n6 = `    farmer_id: currentUser.farmerId,`;
if (s.includes(a6)) { s = s.replace(a6, n6); check('6-farmer-id', true); }
else { check('6-farmer-id', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== FARMER IDENTITY UNIFY ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
