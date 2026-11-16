// Fix: update step 2 template replacement with correct HTML entities
const fs = require('fs');
const path = require('path');
const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');
let s = fs.readFileSync(fp, 'utf-8');

// Step 2: Replace 我的申请 table
const tmplOld = `          <div class="section-card" style="margin-top:14px">
            <div class="section-title">&#x1F4C4; 我的申请</div>
            <table class="data-table">
              <thead><tr><th>补贴类型</th><th>金额</th><th>申请日期</th><th>状态</th><th>进度</th></tr></thead>
              <tbody>
                <tr v-for="r in subsidy" :key="r.id">
                  <td>{{ r.type }}</td>
                  <td style="color:#28C76F;font-family:monospace">&yen;{{ Number(r.amount).toLocaleString() }}</td>
                  <td>{{ r.date }}</td>
                  <td><span class="tag" :class="r.status==='已发放'?'g':r.status==='审核中'?'y':'b'">{{ r.status }}</span></td>
                  <td><div class="progress-bar" style="width:80px"><div class="fill" :class="r.status==='已发放'?'g':'y'" :style="{width:(r.progress||'50%')}"></div></div></td>
                </tr>
              </tbody>
            </table>
          </div>`;

const tmplNew = `          <div class="section-card" style="margin-top:14px">
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

if (!s.includes(tmplOld)) {
  console.log('TEMPLATE NOT FOUND. Checking...');
  // Try to locate the issue
  const idx = s.indexOf('我的申请</div>');
  console.log('Found at index:', idx);
  console.log('Context:', JSON.stringify(s.substring(idx-30, idx+50)));
  process.exit(1);
}

s = s.replace(tmplOld, tmplNew);
console.log('Step 2 (template) done.');

// Step 3: Update subsidy data
const dataOld = `const subsidy = reactive([
  { id: 11, name: '王友德', type: '耕地地力保护补贴', amount: 6200, status: '已发放', date: '2026-06-15', progress: '100%' },
  { id: 12, name: '王友德', type: '农机购置补贴', amount: 5000, status: '审核中', date: '2026-07-20', progress: '65%' },
  { id: 13, name: '王友德', type: '低保补助', amount: 3600, status: '发放中', date: '2026-07-01', progress: '80%' }
])`;
const dataNew = `const subsidy = reactive([
  { id:11, appNo:'SB20260615001', name:'王友德', type:'耕地地力保护补贴', amount:6200, status:'已发放', date:'2026-06-15', node:'已发放', nodes:['已提交','村级初审','乡镇审核','部门复核','待发放','已发放'], currentNodeIdx:5 },
  { id:12, appNo:'SB20260720002', name:'王友德', type:'农机购置补贴', amount:5000, status:'审核中', date:'2026-07-20', node:'乡镇审核', nodes:['已提交','村级初审','乡镇审核','部门复核','待发放','已发放'], currentNodeIdx:2 },
  { id:13, appNo:'SB20260701003', name:'王友德', type:'低保补助', amount:3600, status:'发放中', date:'2026-07-01', node:'待发放', nodes:['已提交','村级初审','乡镇审核','部门复核','待发放','已发放'], currentNodeIdx:4 }
])`;
if (s.includes(dataOld)) { s = s.replace(dataOld, dataNew); console.log('Step 3 (data) done.'); }
else { console.log('Step 3 SKIPPED - data already updated or not found'); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('Part 1 done. File length:', s.length);
