// Complete subsidy rewrite - all steps
const fs = require('fs');
const path = require('path');
const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0;

function replaceFunc(funcName, newCode) {
  const start = s.indexOf('function ' + funcName + '(');
  if (start === -1) { console.log('NOT FOUND:', funcName); return false; }
  let depth = 0, end = start;
  for (let i = start; i < s.length; i++) {
    if (s[i] === '{') depth++;
    if (s[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  s = s.substring(0, start) + newCode.trimEnd() + '\n' + s.substring(end + 1);
  ok++; console.log('OK:', funcName); return true;
}

// STEP 1: Update subsidy data
const dataOld = `const subsidy = reactive([
  { id: 11, name: '王友德', type: '耕地地力保护补贴', amount: 6200, status: '已发放', date: '2026-06-15', progress: '100%' },
  { id: 12, name: '王友德', type: '农机购置补贴', amount: 5000, status: '审核中', date: '2026-07-20', progress: '65%' },
  { id: 13, name: '王友德', type: '低保补助', amount: 3600, status: '发放中', date: '2026-07-01', progress: '80%' }
])`;
if (s.includes(dataOld)) {
  const dataNew = `const subsidy = reactive([
  { id:11, appNo:'SB20260615001', name:'王友德', type:'耕地地力保护补贴', amount:6200, status:'已发放', date:'2026-06-15', node:'已发放', nodes:['已提交','村级初审','乡镇审核','部门复核','待发放','已发放'], currentNodeIdx:5 },
  { id:12, appNo:'SB20260720002', name:'王友德', type:'农机购置补贴', amount:5000, status:'审核中', date:'2026-07-20', node:'乡镇审核', nodes:['已提交','村级初审','乡镇审核','部门复核','待发放','已发放'], currentNodeIdx:2 },
  { id:13, appNo:'SB20260701003', name:'王友德', type:'低保补助', amount:3600, status:'发放中', date:'2026-07-01', node:'待发放', nodes:['已提交','村级初审','乡镇审核','部门复核','待发放','已发放'], currentNodeIdx:4 }
])`;
  s = s.replace(dataOld, dataNew); ok++; console.log('OK: 1-subsidy data');
} else { console.log('SKIP: 1 (already done)'); }

// STEP 2: Replace 我的申请 table template
const anchors = [...s.matchAll(/&#x1F4C4; 我的申请<\/div>/g)];
if (anchors.length >= 2) {
  const anchorIdx = anchors[1].index; // second occurrence (in subsidy section, not the header comment)
  const cardStart = s.lastIndexOf('<div class="section-card" style="margin-top:14px">', anchorIdx);
  let depth = 0, cardEnd = -1;
  for (let i = cardStart; i < s.length; i++) {
    if (s.substring(i, i + 5) === '<div ' || s.substring(i, i + 4) === '<div>') depth++;
    else if (s.substring(i, i + 6) === '</div>') { depth--; if (depth === 0) { cardEnd = i + 6; break; } }
  }
  const oldTmpl = s.substring(cardStart, cardEnd);
  if (oldTmpl.includes('补贴类型</th><th>金额</th><th>申请日期</th><th>状态</th><th>进度</th>')) {
    const newTmpl = `          <div class="section-card" style="margin-top:14px">
            <div class="section-title">&#x1F4C4; 我的申请</div>
            <table class="data-table">
              <thead><tr><th>申请编号</th><th>补贴类型</th><th>金额</th><th>申请日期</th><th>状态</th><th>进度</th><th>操作</th></tr></thead>
              <tbody>
                <tr v-for="r in subsidy" :key="r.id">
                  <td style="font-family:monospace;font-size:11px">{{ r.appNo }}</td>
                  <td>{{ r.type }}</td>
                  <td style="color:#28C76F;font-family:monospace">&yen;{{ Number(r.amount).toLocaleString() }}</td>
                  <td>{{ r.date }}</td>
                  <td><span class="tag" :class="r.status==='已发放'?'g':r.status==='审核中'?'y':r.status==='发放中'?'b':'dim'">{{ r.status }}</span></td>
                  <td><div class="progress-bar" style="width:80px"><div class="fill" :class="r.status==='已发放'?'g':'y'" :style="{width:(r.currentNodeIdx/r.nodes.length*100)+'%'}"></div></div></td>
                  <td>
                    <button class="btn btn-p btn-s" @click="showSubsidyDetail(r)" style="font-size:10px;padding:3px 8px;margin-right:3px">查看详情</button>
                    <button v-if="r.status==='审核中'" class="btn btn-d btn-s" @click="withdrawSubsidy(r)" style="font-size:10px;padding:3px 8px">撤回</button>
                    <button v-if="r.status==='需补材料'" class="btn btn-y btn-s" @click="supplementSubsidy(r)" style="font-size:10px;padding:3px 8px">补充材料</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>`;
    s = s.substring(0, cardStart) + newTmpl + s.substring(cardEnd);
    ok++; console.log('OK: 2-template table');
  } else { console.log('SKIP: 2 (template already changed)'); }
} else { console.log('FAIL: 2 (anchor not found)'); }

// STEP 3: KPI cards for subsidy
const kpiStart = s.indexOf("if (key === 'subsidy') {");
if (kpiStart !== -1) {
  let depth = 0, kpiEnd = -1;
  for (let i = kpiStart; i < s.length; i++) {
    if (s[i] === '{') depth++;
    if (s[i] === '}') { depth--; if (depth === 0) { kpiEnd = i + 1; break; } }
  }
  const kpiOld = s.substring(kpiStart, kpiEnd);
  if (kpiOld.includes("s.status!=='已发放'")) {
    const kpiNew = `if (key === 'subsidy') {
    const ing = subsidy.filter(s=>s.status==='审核中'||s.status==='发放中').length
    const done = subsidy.filter(s=>s.status==='已发放').length
    const total = subsidy.reduce((s,r)=>s+Number(r.amount),0)
    return [
      { icon:'\\u{1F4CB}', value:availableSubsidies.length+'项', label:'可申请补贴', color:'g' },
      { icon:'\\u{23F3}', value:ing+'项', label:'申请中', color:'y' },
      { icon:'✅', value:done+'项', label:'已发放', color:'b' },
      { icon:'\\u{1F4B0}', value:'¥'+total.toLocaleString(), label:'累计获得', color:'p' }
    ]
  }`;
    s = s.substring(0, kpiStart) + kpiNew.trimEnd() + '\n' + s.substring(kpiEnd);
    ok++; console.log('OK: 3-KPI');
  } else { console.log('SKIP: 3 (already done)'); }
} else { console.log('FAIL: 3 (start not found)'); }

// Write intermediate result
fs.writeFileSync(fp, s, 'utf-8');
console.log('Steps 1-3 done. Changes:', ok, 'Length:', s.length);
