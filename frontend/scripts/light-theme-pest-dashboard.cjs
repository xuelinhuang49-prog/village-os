// 智慧农业·病虫害监测(PestDashboard) 深色 → 浅色主题 批量转换脚本
const fs = require('fs');
const path = require('path');

const file = 'src/views/pest/PestDashboard.vue';

const map = [
  // ---- 强调色 ----
  ['#28C7FA', '#0EA5E9'],
  ['#28C76F', '#22B573'],
  ['#39D98A', '#22B573'],
  ['#E74C3C', '#E05252'],
  ['#F5B83D', '#F2A62B'],
  ['#f59e0b', '#F2A62B'],

  // ---- 文字色 ----
  ['#6F91A8', '#66788A'],
  ['#B7D3E8', '#475867'],

  // ---- 卡片/背景 ----
  ['rgba(5,25,48,.96)', '#FFFFFF'],
  ['rgba(6,22,46,.98)', '#FFFFFF'],
  ['rgba(10,36,68,.55)', '#F8FAFB'],
  ['rgba(10,60,130,.2)', '#F0F3F8'],
  ['rgba(57,217,138,.06)', '#FFFFFF'],
  ['rgba(190,214,234,.55)', '#E3EAF0'],

  // ---- 边框 ----
  ['rgba(40,199,111,.15)', '#E3EAF0'],
  ['rgba(40,199,111,.1)', '#E3EAF0'],
  ['rgba(40,199,111,.3)', '#D0D8E2'],
  ['rgba(14,165,233,.06)', '#EBEFF4'],

  // ---- 状态 tint ----
  ['rgba(231,76,60,.15)', 'rgba(224,82,82,.10)'],
  ['rgba(245,158,11,.15)', 'rgba(242,166,43,.12)'],
  ['rgba(16,214,160,.15)', 'rgba(34,181,115,.12)'],
  ['rgba(40,199,250,.12)', 'rgba(14,165,233,.12)'],

  // ---- 文字（最后；白字按钮稍后手工恢复）----
  ['#fff', '#1F2D3D'],
];

const root = path.resolve(__dirname, '..');
const fp = path.join(root, file);
let src = fs.readFileSync(fp, 'utf8');
let n = 0;
for (const [from, to] of map) {
  const before = src.length;
  src = src.split(from).join(to);
  if (src.length !== before) n += 1;
}
fs.writeFileSync(fp, src, 'utf8');
console.log(`${file}: ${n} 种颜色 token 已替换`);
