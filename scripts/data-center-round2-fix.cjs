// 修复：上一轮脚本里模板字面量把 \' 吃成了 ''，修复脚本又误写成字面量 \x27。
// 这里把文件里的字面量 \x27（反斜杠 + x + 2 + 7）替换成正确的 \'（反斜杠 + 单引号）。
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
const before = s;
s = s.split('\\x27').join("\\'");
const count = (before.match(/\\x27/g) || []).length;
fs.writeFileSync(fp, s, 'utf-8');
console.log('replaced', count, 'occurrences; length', s.length);
