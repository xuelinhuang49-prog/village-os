// 「村委班子」第一刀：从“干部成绩展示/管理驾驶舱”纠正为“村民找人办事”。
//   1. 页面切换为浅色政务风（gov-theme），顶部加“中堰村村委班子 + 找谁说明”
//   2. 六张干部卡片：删掉 本月事项/完成率/满意度 三个统计数字，删掉微信二维码/身份证展示
//      改为 职务 + 负责事项 + ☎ 联系电话(脱敏) + [查看职责][联系咨询]
//   3. 干部详情从“履职档案”大面板改为简洁弹窗（姓名/职务 + 主要负责 + 联系方式 + 联系咨询，右上角 × 由统一弹窗壳提供）
//   4. 数据瘦身为 通讯录字段（id/name/title/org/avatar/color/phone/dutyTags），去掉 stats/workLog/reviews/messages
//   5. 电话脱敏展示（maskPhone），真实号码仅用于 tel: 拨打
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }
function gsub(o, n) { const b = s; s = s.split(o).join(n); return s !== b; }
function cut(startMark, endMark, insert) {
  const i = s.indexOf(startMark);
  const j = s.indexOf(endMark, i);
  if (i < 0 || j < 0) { console.log('  cut fail: start=' + i + ' end=' + j); return false; }
  s = s.slice(0, i) + insert + s.slice(j);
  return true;
}

// ===== 1. content-area 浅色背景：governance 或 leadership 时变浅 =====
check('1-content-area-bg', gsub(
  `<div class="content-area" :style="{ background: currentPage === 'governance' ? '#F4F7FA' : '' }" ref="contentArea">`,
  `<div class="content-area" :style="{ background: (currentPage === 'governance' || currentPage === 'leadership') ? '#F4F7FA' : '' }" ref="contentArea">`));

// ===== 2. 村委班子整页模板重写（浅色 + 顶部说明 + 通讯录卡片，删除履职档案大面板） =====
const tplStart = `<div v-show="currentPage === 'leadership'" class="page-content" key="leadership">`;
const tplEnd = `        </div>

        <!-- ==================== PAGE: Device Center ==================== -->`;
const newTpl = `<div v-show="currentPage === 'leadership'" class="page-content gov-theme" key="leadership">
          <div class="panel" style="margin-bottom:14px;padding:16px 20px">
            <div style="font-size:20px;font-weight:700;color:#1F2D3D;margin-bottom:4px">🏘 中堰村村委班子</div>
            <div style="font-size:15px;color:#66788A;line-height:1.6">有事情不知道找谁？可按负责事项联系对应村干部。</div>
          </div>
          <div class="leader-grid-wrap">
            <div class="panel leader-card-panel" v-for="l in leaders" :key="l.id" @click="showLeaderDetail(l)">
              <div class="leader-avatar" :style="{background:'linear-gradient(135deg,'+l.color+',transparent)',boxShadow:'0 0 20px '+l.color+'44'}">{{ l.avatar }}</div>
              <h3 class="leader-name">{{ l.name }}</h3>
              <div class="leader-title" :style="{color:l.color}">{{ l.title }}</div>
              <div class="leader-duty">负责：{{ l.dutyTags.join('、') }}</div>
              <div class="leader-phone">☎ 联系电话：{{ l.phoneMasked }}</div>
              <div class="leader-actions">
                <button class="btn btn-outline btn-sm" @click.stop="showLeaderDetail(l)">查看职责</button>
                <button class="btn btn-primary btn-sm" @click.stop="contactLeader(l)">联系咨询</button>
              </div>
            </div>
          </div>`;
check('2-leadership-template', cut(tplStart, tplEnd, newTpl));

// ===== 3. 干部数据瘦身为通讯录字段 =====
const dataStart = `const leaders = [`;
const dataEnd = `\n\n// Settings`;
const newData = `const leaders = [
  { id: 'deng', name: '邓超', title: '党总支部书记、村委会主任', org: '中堰村党总支部', avatar: '邓', color: '#E05252', phone: '15929510089', dutyTags: ['村级全面工作', '重大事项协调', '村民重大问题协调'] },
  { id: 'huang', name: '黄尊海', title: '党总支部副书记', org: '中堰村党总支部', avatar: '黄', color: '#F8B400', phone: '15229151368', dutyTags: ['党建工作', '组织建设', '村务协助'] },
  { id: 'chen', name: '陈良敏', title: '村委会副主任', org: '中堰村村民委员会', avatar: '陈', color: '#19B98A', phone: '15389513886', dutyTags: ['村务管理', '基础设施建设', '人居环境整治'] },
  { id: 'liao', name: '廖邦洪', title: '村委会副主任', org: '中堰村村民委员会', avatar: '廖', color: '#22B573', phone: '13679151313', dutyTags: ['产业发展', '集体经济', '招商引资'] },
  { id: 'gong', name: '龚磊', title: '监委会主任', org: '中堰村监督委员会', avatar: '龚', color: '#8b5cf6', phone: '17889100100', dutyTags: ['村务监督', '财务审计', '村务公开'] },
  { id: 'li', name: '李强强', title: '村委会文书', org: '中堰村村民委员会', avatar: '李', color: '#0ea5e9', phone: '15991187663', dutyTags: ['材料办理', '证明开具', '档案管理'] }
]
// 联系电话脱敏展示（真实号码仅用于 tel: 拨打）
leaders.forEach(function(l) { l.phoneMasked = maskPhone(l.phone) })`;
check('3-leaders-data', cut(dataStart, dataEnd, newData));

// ===== 4. 干部详情函数：履职档案 → 简洁弹窗 + 联系咨询 =====
const fnStart = `function showLeaderDetail(l) {`;
const fnEnd = `function sendChat() {`;
const newFn = `let _currentLeader = null // 当前查看的干部（供详情弹窗内「联系咨询」使用）
function showLeaderDetail(l) {
  _currentLeader = l
  let h = '<div style="padding:4px 0">'
  h += '<div style="text-align:center;padding:4px 0 14px 0">'
  h += '<div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,' + l.color + ',transparent);display:inline-flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:#fff;margin-bottom:10px">' + l.avatar + '</div>'
  h += '<h4 style="color:#1F2D3D;margin:0 0 4px 0;font-size:17px">' + l.name + '</h4>'
  h += '<p style="color:#66788A;font-size:13px;margin:0">' + l.title + '</p>'
  h += '</div>'
  h += '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px;margin-bottom:14px">'
  h += '<div style="font-size:13px;color:#1E7A54;font-weight:700;margin-bottom:6px">主要负责</div>'
  var tags = l.dutyTags || []
  tags.forEach(function(t) { h += '<div style="font-size:14px;color:#1F2D3D;padding:3px 0">· ' + t + '</div>' })
  h += '</div>'
  h += '<div style="display:flex;align-items:center;justify-content:space-between;background:#F0F3F6;border:1px solid #EBEFF4;border-radius:8px;padding:12px 14px;margin-bottom:16px">'
  h += '<span style="font-size:13px;color:#66788A">☎ 联系电话</span>'
  h += '<span style="font-size:14px;color:#1F2D3D;font-weight:700">' + l.phoneMasked + '</span>'
  h += '</div>'
  h += '<div style="display:flex;gap:8px;justify-content:flex-end">'
  h += '<button class="btn btn-primary" onclick="window._svc.contactCurrentLeader()" style="justify-content:center">📞 联系咨询</button>'
  h += '</div></div>'
  openGovModal('👤 干部信息', h)
}

// 联系电话脱敏：15929510089 → 159****0089（仅展示，真实号码用于 tel: 拨打）
function maskPhone(p) { return p ? p.slice(0, 3) + '****' + p.slice(-4) : p }

// 联系咨询：拨打干部公开工作电话（后台按 village_id + staff_id 配置，前端展示脱敏号码）
function contactLeader(l) {
  toast('正在为您接通 ' + l.name + '（' + l.title + '）…', 'info')
  setTimeout(function() { window.open('tel:' + l.phone, '_self') }, 300)
}
function contactCurrentLeader() { if (_currentLeader) contactLeader(_currentLeader) }

`;
check('4-leader-detail-fn', cut(fnStart, fnEnd, newFn));

// ===== 5. 干部卡片浅色样式（去掉 org/qr/stats，新增 duty/actions） =====
check('5-leader-css', gsub(
`.leader-grid-wrap { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:14px; margin-bottom:14px }
.leader-card-panel { padding:20px; text-align:center; cursor:pointer; transition:all .3s }
.leader-card-panel:hover { border-color:rgba(57,217,138,0.3)!important; box-shadow:0 8px 30px rgba(0,0,0,.3); transform:translateY(-3px) }
.leader-avatar {
  width:80px; height:80px; border-radius:50%; display:flex; align-items:center;
  justify-content:center; margin:0 auto 10px; font-size:30px; font-weight:800; color:#fff;
}
.leader-name { font-size:16px; font-weight:700; color:var(--tb); margin-bottom:3px }
.leader-title { font-size:11px; font-weight:600; margin-bottom:2px }
.leader-org { font-size:10px; color:var(--td); margin-bottom:4px }
.leader-phone { font-size:10px; color:var(--td); margin-bottom:4px }
.leader-qr { font-size:9px; color:var(--accent2); cursor:pointer; margin-bottom:8px }
.leader-qr:hover { text-decoration:underline }
.leader-stats { display:flex; gap:8px; justify-content:center }
.ls-v { font-size:15px; font-weight:700 }
.ls-l { font-size:9px; color:var(--td) }
.ls-div { width:1px; background:rgba(57,217,138,0.12) }`,
`.leader-grid-wrap { display:grid; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); gap:14px; margin-bottom:14px }
.leader-card-panel { padding:20px; text-align:center; cursor:pointer; transition:all .3s }
.leader-card-panel:hover { border-color:rgba(25,185,138,0.35)!important; box-shadow:0 8px 24px rgba(0,0,0,0.10); transform:translateY(-3px) }
.leader-avatar {
  width:80px; height:80px; border-radius:50%; display:flex; align-items:center;
  justify-content:center; margin:0 auto 10px; font-size:30px; font-weight:800; color:#fff;
}
.leader-name { font-size:17px; font-weight:700; color:#1F2D3D; margin-bottom:3px }
.leader-title { font-size:12px; font-weight:600; margin-bottom:8px }
.leader-duty { font-size:13px; color:#475867; margin-bottom:8px; line-height:1.55; padding:0 6px }
.leader-phone { font-size:13px; color:#66788A; margin-bottom:12px }
.leader-actions { display:flex; gap:8px; justify-content:center }`));

// ===== 6. _svc 注册 contactCurrentLeader =====
check('6-svc-contact', gsub(
  `    openWaterBodyByIdx, reportWaterSupplement, viewWaterLocation, reportFromMonitor, setStrawType, setStrawExpect, getStrawLocation, submitStrawApply, openStrawApp, backToGarbage, strawFormBack, backToMyReports,`,
  `    openWaterBodyByIdx, reportWaterSupplement, viewWaterLocation, reportFromMonitor, setStrawType, setStrawExpect, getStrawLocation, submitStrawApply, openStrawApp, backToGarbage, strawFormBack, backToMyReports, contactCurrentLeader,`));

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== LEADERSHIP REFRAME ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
