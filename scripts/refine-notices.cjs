// Refine village notices: full content, tags, action buttons, reorder for daily-life priority
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. Replace villageNotices data =====
const oldNotices = `const villageNotices = [
  { id: 'N001', icon: '📢', title: '7月党员活动日通知', date: '7月10日', source: '村党支部' },
  { id: 'N002', icon: '🏥', title: '65岁以上老人免费体检', date: '7月15日', source: '乡镇卫生院' },
  { id: 'N003', icon: '🌾', title: '夏季秸秆禁烧宣传', date: '7月5日', source: '村委会' },
  { id: 'N004', icon: '💧', title: '节水灌溉补贴申请通知', date: '7月1日', source: '乡镇水利站' }
]`;

const newNotices = `const villageNotices = [
  { id: 'N001', icon: '🏥', title: '65岁以上老人免费体检', tag: '进行中', tagColor: '#39D98A',
    date: '2026-07-15', source: '乡镇卫生院',
    content: '为做好老年人健康管理工作，中堰村将组织65岁以上老年人免费健康体检。请符合条件的村民携带相关材料按时参加。\\n\\n📅 体检时间：7月18日（周六）上午 8:00–11:30\\n📍 体检地点：中堰村村委会一楼大厅\\n👴 服务对象：中堰村65岁及以上常住居民（1959年及以前出生）\\n📋 携带材料：本人身份证、医保卡\\n📞 咨询方式：联系本村第3网格网格员王大爷\\n\\n注意事项：\\n1. 体检当天需空腹，请勿吃早餐\\n2. 行动不便的老人可由家属陪同\\n3. 如无法按时参加，请提前联系网格员另行安排',
    action: 'contact_grid' },
  { id: 'N002', icon: '💧', title: '节水灌溉补贴申请通知', tag: '重要', tagColor: '#F5B83D',
    date: '2026-07-01', source: '乡镇水利站',
    content: '根据县农业农村局关于推广节水灌溉技术的工作部署，现开展2026年度节水灌溉设施建设补贴申请工作。\\n\\n📅 申请时间：2026年7月1日–7月31日\\n👥 申请对象：中堰村从事农业种植的农户\\n📋 补贴条件：新建或改造滴灌、喷灌等节水灌溉设施，面积不低于1亩\\n💰 补贴标准：每亩最高补贴800元，每户最高补贴5亩\\n📄 所需材料：身份证复印件、土地承包合同、灌溉设施购置发票或施工合同\\n📍 办理地点：村委会一楼便民服务大厅\\n⏰ 截止日期：2026年7月31日\\n\\n请符合条件的农户抓紧时间申请，逾期不再受理。',
    action: 'apply_subsidy' },
  { id: 'N003', icon: '⚠️', title: '夏季秸秆禁烧与防火通知', tag: '重要', tagColor: '#E74C3C',
    date: '2026-07-05', source: '村委会',
    content: '当前正值夏季高温季节，为做好秸秆禁烧和防火安全工作，现将有关事项通知如下：\\n\\n一、严禁任何单位和个人在田间地头、路边沟渠焚烧农作物秸秆、杂草和垃圾。\\n二、提倡秸秆还田、秸秆饲料化等综合利用方式，村委会可协助联系秸秆回收企业。\\n三、各农户需注意用火用电安全，及时清理房前屋后可燃物。\\n四、发现火情请立即拨打119，并第一时间通知网格员或村委会。\\n五、对违反禁烧规定的，将依法依规处理。\\n\\n请广大村民相互转告，共同维护安全生活环境。',
    action: null },
  { id: 'N004', icon: '📢', title: '7月党员活动日通知', tag: null, tagColor: null,
    date: '2026-07-10', source: '村党支部',
    content: '各位党员同志：\\n\\n根据镇党委统一安排，7月份党员活动日定于7月12日（周日）上午9:00在村党群服务中心二楼会议室举行。\\n\\n📋 活动内容：\\n1. 学习党的二十届三中全会精神\\n2. 开展"我为群众办实事"实践活动总结\\n3. 讨论下半年村级重点工作计划\\n\\n请全体党员准时参加，佩戴党徽，携带学习笔记本。如有特殊情况不能参加，须提前向支部书记请假。',
    action: null }
]`;

if (s.includes(oldNotices)) {
  s = s.replace(oldNotices, newNotices);
  check('1-noticeData', true);
} else { check('1-noticeData', false); }

// ===== 2. Rewrite showNoticeDetail with full content and action buttons =====
const oldDetail = `function showNoticeDetail(n) {
  const c = '<div class="detail-section"><h4>' + n.icon + ' ' + n.title + '</h4><div class="detail-field"><span class="df-lbl">发布日期</span><span class="df-val">' + n.date + '</span></div><div class="detail-field"><span class="df-lbl">发布来源</span><span class="df-val">' + n.source + '</span></div></div><div class="detail-section"><h4>公告内容</h4><p style="font-size:11px;color:#B7D3E8;line-height:1.6">详情请到村委会公告栏或通过村级服务平台查看完整内容。如有疑问请联系网格员或拨打村委会电话。</p></div><div class="detail-actions"><button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">关闭</button></div>'
  openModal('村务公告详情', c)
}`;

const newDetail = `function showNoticeDetail(n) {
  var contentHtml = n.content.replace(/\\n/g, '<br>')
  var h = ''
  // Title + tag
  h += '<div style="margin-bottom:14px">'
  h += '<h3 style="color:#fff;margin:0 0 6px 0;font-size:16px">' + n.icon + ' ' + n.title + '</h3>'
  if (n.tag) h += '<span style="display:inline-block;padding:2px 10px;border-radius:10px;font-size:10px;font-weight:600;color:' + n.tagColor + ';background:' + n.tagColor.replace(')', ',0.12)').replace('rgb', 'rgba').replace(')', ',0.12)') + '">' + n.tag + '</span>'
  h += '</div>'
  // Meta info
  h += '<div style="background:rgba(10,36,68,0.30);border:1px solid rgba(40,199,111,0.08);border-radius:8px;overflow:hidden;margin-bottom:14px">'
  h += '<div style="display:flex;justify-content:space-between;padding:9px 14px;border-bottom:1px solid rgba(40,199,111,0.06);font-size:11px"><span style="color:#6F91A8">发布时间</span><span style="color:#D0E4F5">' + n.date + '</span></div>'
  h += '<div style="display:flex;justify-content:space-between;padding:9px 14px;font-size:11px"><span style="color:#6F91A8">发布单位</span><span style="color:#D0E4F5">' + n.source + '</span></div>'
  h += '</div>'
  // Full content body
  h += '<div style="margin-bottom:14px"><h4 style="font-size:12px;font-weight:700;color:#39D98A;margin:0 0 10px 0;display:flex;align-items:center;gap:6px"><span style="display:inline-block;width:3px;height:12px;background:#39D98A;border-radius:2px"></span>公告内容</h4>'
  h += '<div style="font-size:12px;color:#B7D3E8;line-height:1.85;background:rgba(10,36,68,0.30);border:1px solid rgba(40,199,111,0.06);border-radius:8px;padding:14px 16px">' + contentHtml + '</div>'
  h += '</div>'
  // Action buttons
  h += '<div style="display:flex;gap:8px">'
  if (n.action === 'contact_grid') {
    h += '<button class="btn btn-primary" onclick="window._svc.showGridWorkerInfo()" style="flex:1;justify-content:center">📞 联系网格员</button>'
  } else if (n.action === 'apply_subsidy') {
    h += '<button class="btn btn-primary" onclick="window._svc.goToSubsidy()" style="flex:1;justify-content:center">📝 立即申请</button>'
  }
  h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()" style="' + (n.action ? '' : 'flex:1;') + 'justify-content:center">关闭</button>'
  h += '</div>'
  openModal('公告详情', h)
}`;

if (s.includes(oldDetail)) {
  s = s.replace(oldDetail, newDetail);
  check('2-noticeDetail', true);
} else { check('2-noticeDetail', false); }

// ===== 3. Update showVillageNotices to show tags =====
const oldList = `function showVillageNotices() {
  let h = '<div style="padding:8px 0"><h4 style="color:#fff;margin:0 0 12px 0;font-size:14px">📢 村务公告</h4>'
  villageNotices.forEach(n => {
    h += '<div onclick="window._svc.showNoticeDetailById(\\'' + n.id + '\\')" style="padding:10px 12px;background:rgba(10,36,68,0.55);border-radius:6px;margin-bottom:6px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:10px" onmouseover="this.style.background=\\'rgba(40,199,111,0.10)\\'" onmouseout="this.style.background=\\'rgba(10,36,68,0.55)\\'">'
    h += '<span style="font-size:20px">' + n.icon + '</span>'
    h += '<div style="flex:1"><div style="font-size:12px;color:#D0E4F5;font-weight:600">' + n.title + '</div><div style="font-size:10px;color:#6F91A8">' + n.date + ' · ' + n.source + '</div></div>'
    h += '<span style="font-size:10px;color:#28C7FA">查看 →</span>'
    h += '</div>'
  })
  h += '</div>'
  openModal('村务公告', h)
}`;

const newList = `function showVillageNotices() {
  let h = '<div style="padding:8px 0"><h4 style="color:#fff;margin:0 0 12px 0;font-size:14px">📢 村务公告</h4>'
  villageNotices.forEach(n => {
    h += '<div onclick="window._svc.showNoticeDetailById(\\'' + n.id + '\\')" style="padding:10px 12px;background:rgba(10,36,68,0.55);border-radius:6px;margin-bottom:6px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:10px" onmouseover="this.style.background=\\'rgba(40,199,111,0.10)\\'" onmouseout="this.style.background=\\'rgba(10,36,68,0.55)\\'">'
    h += '<span style="font-size:20px;flex-shrink:0">' + n.icon + '</span>'
    h += '<div style="flex:1;min-width:0">'
    h += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">'
    h += '<span style="font-size:12px;color:#D0E4F5;font-weight:600">' + n.title + '</span>'
    if (n.tag) h += '<span style="display:inline-block;padding:1px 7px;border-radius:8px;font-size:9px;font-weight:600;color:' + n.tagColor + ';background:' + n.tagColor.replace(')', ',0.12)') + ';flex-shrink:0">' + n.tag + '</span>'
    h += '</div>'
    h += '<div style="font-size:10px;color:#6F91A8">' + n.date + ' · ' + n.source + '</div></div>'
    h += '<span style="font-size:10px;color:#28C7FA;flex-shrink:0">查看 →</span>'
    h += '</div>'
  })
  h += '</div>'
  openModal('村务公告', h)
}`;

if (s.includes(oldList)) {
  s = s.replace(oldList, newList);
  check('3-noticeList', true);
} else { check('3-noticeList', false); }

// ===== 4. Add goToSubsidy function =====
const oldCallGw2 = `function callGridWorker() {
  toast('正在拨打 ' + gridWorker.name + ' 电话…', 'info')
  // Use real phone number (hidden from UI)
  setTimeout(function() {
    window.open('tel:' + gridWorker.realPhone, '_self')
  }, 300)
}`;

const newCallGw2 = `function callGridWorker() {
  toast('正在拨打 ' + gridWorker.name + ' 电话…', 'info')
  setTimeout(function() {
    window.open('tel:' + gridWorker.realPhone, '_self')
  }, 300)
}

function goToSubsidy() {
  closeModal()
  // Switch to service center — subsidy section
  toast('正在跳转到补贴申请页面…', 'info')
  if (typeof switchPage === 'function') {
    switchPage('service')
    setTimeout(function() {
      var el = document.querySelector('[data-section="subsidy"]')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 500)
  }
}`;

if (s.includes(oldCallGw2)) {
  s = s.replace(oldCallGw2, newCallGw2);
  check('4-goToSubsidy', true);
} else { check('4-goToSubsidy', false); }

// ===== 5. Update _svc handlers =====
const oldSvc = `    submitReport, closeAndRefresh, callGridWorker, showMyGrid, showNoticeDetailById,`;
const newSvc = `    submitReport, closeAndRefresh, callGridWorker, showMyGrid, showNoticeDetailById, goToSubsidy,`;
if (s.includes(oldSvc)) {
  s = s.replace(oldSvc, newSvc);
  check('5-svcHandlers', true);
} else { check('5-svcHandlers', false); }

// ===== 6. Also update the governance page inline notice list (village notices sidebar) =====
const oldGovNotices = `                <div v-if="villageNotices.length > 0">
                  <div v-for="n in villageNotices" :key="n.id" class="gov-news-item" @click="showNoticeDetail(n)">
                    <div class="gni-left">
                      <span class="gni-icon-big">{{ n.icon }}</span>
                    </div>
                    <div class="gni-mid">
                      <div class="gni-loc">{{ n.title }}</div>
                      <div class="gni-time">{{ n.date }}</div>
                    </div>
                    <div class="gni-right">
                      <span style="font-size:10px;color:#6F91A8">{{ n.source }}</span>
                    </div>
                  </div>
                </div>`;

const newGovNotices = `                <div v-if="villageNotices.length > 0">
                  <div v-for="n in villageNotices" :key="n.id" class="gov-news-item" @click="showNoticeDetail(n)">
                    <div class="gni-left">
                      <span class="gni-icon-big">{{ n.icon }}</span>
                    </div>
                    <div class="gni-mid">
                      <div class="gni-loc">{{ n.title }}<span v-if="n.tag" style="display:inline-block;padding:1px 6px;border-radius:6px;font-size:8px;font-weight:600;margin-left:5px;color:#fff;background:rgba(231,76,60,0.20);vertical-align:middle">{{ n.tag }}</span></div>
                      <div class="gni-time">{{ n.date }} · {{ n.source }}</div>
                    </div>
                    <div class="gni-right">
                      <span style="font-size:10px;color:#28C7FA">查看 →</span>
                    </div>
                  </div>
                </div>`;

if (s.includes(oldGovNotices)) {
  s = s.replace(oldGovNotices, newGovNotices);
  check('6-govNoticesTemplate', true);
} else { check('6-govNoticesTemplate', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== NOTICE DETAIL REFINE FINAL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
