// 农产品电商(EcommercePage) 字号整体上调一档（+2px，图标/KPI/标题 18px 以上不动）
const fs = require('fs');
const path = require('path');

const file = 'src/views/industry/EcommercePage.vue';

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
const fp = path.join(root, file);
let src = fs.readFileSync(fp, 'utf8');
let n = 0;
for (const [from, to] of map) {
  const before = src.length;
  src = src.split(from).join(to);
  if (src.length !== before) n += 1;
}
fs.writeFileSync(fp, src, 'utf8');
console.log(`${file}: ${n} 种字号已上调`);
