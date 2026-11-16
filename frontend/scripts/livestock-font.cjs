// 智慧养殖 子组件（环境监测/投喂管理/疫病预警）字号整体上调一档（+2px，图标/KPI 16px 以上不动）
const fs = require('fs');
const path = require('path');

const files = [
  'src/views/dashboard/tourism/EnvMonitor.vue',
  'src/views/dashboard/tourism/FeedingMonitor.vue',
  'src/views/dashboard/tourism/DiseaseWarning.vue',
];

// 从大到小替换，避免二次匹配
const map = [
  ['font-size:15px', 'font-size:17px'],
  ['font-size:14px', 'font-size:16px'],
  ['font-size:13px', 'font-size:15px'],
  ['font-size:12px', 'font-size:14px'],
  ['font-size:11px', 'font-size:13px'],
  ['font-size:10px', 'font-size:12px'],
  ['font-size:9px', 'font-size:11px'],
  ['font-size:8px', 'font-size:10px'],
  ['font-size:7px', 'font-size:9px'],
];

const root = path.resolve(__dirname, '..');
for (const file of files) {
  const fp = path.join(root, file);
  let src = fs.readFileSync(fp, 'utf8');
  for (const [from, to] of map) {
    src = src.split(from).join(to);
  }
  fs.writeFileSync(fp, src, 'utf8');
  console.log(`${file}: 字号已上调`);
}
