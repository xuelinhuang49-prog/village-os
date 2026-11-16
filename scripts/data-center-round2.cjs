// 数据中心第二轮优化：从「静态说明页」推进到「能查询、能追溯、能办事」。
//   1. 我的基本信息：户主/所在区域/家庭人口/家庭成员(可展开)/联系电话/数据更新时间；身份证不展示
//   2. 我的产业数据 与 土地与产业 区分：我的=王友德家(承包地/确权面积/当前种植/养殖/农产品)，土地与产业=全村汇总
//   3. 本村公开数据统一「标题+核心指标卡+明细列表+更新时间/来源+查看详情」；村务公开=目录+最近更新
//   4. 生态环境加 最近更新时间/数据来源 + 查看6个监测点
//   5. 基础设施行可点进设施列表/地图
//   6. 我的补贴/权益：金额+发放日期，仅本人可见
//   7. 我的办事记录：汇总全平台(留言/上报/秸秆回收/数据纠错/办事申请)，全部/办理中/已完成/已撤回
//   8. 数据纠错完整闭环：选择错误数据→当前数据→正确信息→说明原因→上传证明→提交→村委审核→修改完成；编号 SJJC+日期+序号
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

// ===== 1. 我的留言 演示数据（让「我的办事记录」能跨模块汇总）=====
check('1-myMessages-seed', gsub(
`const myMessages = ref([])`,
`const myMessages = ref([
  // 演示数据（正式由后台按 farmer_id 下发，仅本人可见；顺序为新→旧）
  { message_id: 'LY202608010001', village_id: 'zhongyan', farmer_id: currentUser.farmerId, staff_id: 'chen', staff_name: '陈良敏', staff_title: '村委会副主任', category: '基础设施', content: '村东口有两盏路灯不亮了，晚上出行不方便，麻烦安排维修。', images: [], preferred_reply_type: 'platform', status: '已回复', created_at: '2026-08-01T09:20:00+08:00', timeText: '8月1日 09:20', replied_at: '2026-08-02T10:00:00+08:00', replyTimeText: '8月2日 10:00', reply_content: '已安排电工检查，计划本周内完成维修，请留意。', closed_at: null },
  { message_id: 'LY202607150002', village_id: 'zhongyan', farmer_id: currentUser.farmerId, staff_id: 'liao', staff_name: '廖邦洪', staff_title: '村委会副主任', category: '产业发展', content: '想咨询阳光玫瑰葡萄的种植补贴政策，需要准备哪些材料？', images: [], preferred_reply_type: 'phone', status: '已办结', created_at: '2026-07-15T14:30:00+08:00', timeText: '7月15日 14:30', replied_at: '2026-07-16T09:10:00+08:00', replyTimeText: '7月16日 09:10', reply_content: '已电话告知相关政策与所需材料清单。', closed_at: '2026-07-16T09:15:00+08:00' }
])`));

// ===== 2. 秸秆回收 演示数据 =====
check('2-straw-seed', gsub(
`const ecoStrawApplications = ref([])`,
`const ecoStrawApplications = ref([
  // 演示数据（正式由后台下发）
  { id: 'JG20260710001', applicant: currentUser.name, village: currentUser.village, phone: currentUser.phone, type: '玉米秸秆', quantity: '约 2 吨', location: '3组晒场旁', latitude: null, longitude: null, expectTime: '7月10日', remark: '', status: '已回收', createdAt: '7月10日 15:40', timeline: [{ time: '7月10日 15:40', status: '已回收', desc: '回收人员已上门回收完毕' }] }
])`));

// ===== 3. 本村公开数据明细：从 rows 二维数组升级为「指标卡+明细+更新时间/来源+子详情」=====
check('3-villageDataDetail', cut(
`const villageDataDetail = {`,
`// —— 我的数据与授权 ——`,
`const villageDataDetail = {
  population: {
    title: '人口概况', icon: '👥', intro: '本村人口公开统计（不含个人身份信息）',
    metrics: [
      { label: '全村户数', value: '816 户' },
      { label: '常住人口', value: '1,286 人' },
      { label: '户籍人口', value: '1,342 人' }
    ],
    rows: [
      { label: '年龄结构', value: '0–17岁 18% · 18–59岁 56% · 60岁以上 26%' },
      { label: '男女比例', value: '男 52% · 女 48%' },
      { label: '劳动力人口', value: '736 人' }
    ],
    updatedAt: '2026-08-10', source: '中堰村村委会 · 户籍登记'
  },
  land: {
    title: '土地与产业', icon: '🌾', intro: '本村土地与产业公开概况（全村汇总，区别于个人产业数据）',
    metrics: [
      { label: '耕地面积', value: '2,860 亩' },
      { label: '集体土地', value: '320 亩' },
      { label: '特色产业', value: '4 项' }
    ],
    rows: [
      { label: '主要作物', value: '油葵、玉米、阳光玫瑰葡萄' },
      { label: '种植结构', value: '粮食 62% · 油料 20% · 果蔬 18%' },
      { label: '集体经济收入', value: '¥ 300万（2025年）' }
    ],
    updatedAt: '2026-08-10', source: '中堰村村委会 · 农经统计'
  },
  eco: {
    title: '生态环境', icon: '🌱', intro: '本村生态环境公开监测概况',
    metrics: [
      { label: '空气质量', value: '优良 · AQI 42' },
      { label: '绿化覆盖率', value: '38%' },
      { label: '环境监测点', value: '6 处' }
    ],
    rows: [
      { label: '水质监测', value: '3号水塘水质正常' },
      { label: '生活污水处理率', value: '92%' }
    ],
    updatedAt: '2026-08-14 08:30', source: '中堰村生态环境监测站',
    monitors: [
      { name: '1号空气监测点', loc: '村委会大院', value: 'AQI 42 · 优良', status: '正常' },
      { name: '2号空气监测点', loc: '产业园东侧', value: 'AQI 45 · 优良', status: '正常' },
      { name: '3号水塘水质监测点', loc: '3号水塘', value: '溶解氧 6.8mg/L', status: '正常' },
      { name: '4号灌溉渠水质监测点', loc: '南坡灌溉渠', value: '浊度正常', status: '正常' },
      { name: '5号土壤监测点', loc: '阳光玫瑰葡萄园', value: '墒情适宜', status: '正常' },
      { name: '6号噪声监测点', loc: '村口主干道', value: '52dB · 达标', status: '正常' }
    ]
  },
  infra: {
    title: '基础设施', icon: '🏠', intro: '本村基础设施公开概况（点击可查看设施明细）',
    metrics: [
      { label: '硬化道路', value: '12.6 公里' },
      { label: '路灯', value: '218 盏' },
      { label: '集中供水', value: '覆盖 100%' }
    ],
    rows: [
      { label: '文化广场', value: '3 处', action: 'facility' },
      { label: '卫生室', value: '1 个', action: 'facility' },
      { label: '公厕', value: '8 座', action: 'facility' }
    ],
    updatedAt: '2026-08-08', source: '中堰村村委会 · 基础设施台账',
    facilities: {
      '道路': [
        { name: '村主干道', detail: '硬化 3.2公里 · 宽 5米', loc: '贯穿全村' },
        { name: '东沟机耕道', detail: '硬化 2.1公里', loc: '村东片区' },
        { name: '南坡生产路', detail: '硬化 1.8公里', loc: '村南片区' }
      ],
      '路灯': [
        { name: '村主干道路灯', detail: '86 盏 · 太阳能', loc: '村主干道两侧' },
        { name: '巷道路灯', detail: '102 盏', loc: '各组巷道' },
        { name: '广场路灯', detail: '30 盏', loc: '3处文化广场' }
      ],
      '公共场所': [
        { name: '文化广场', detail: '3 处 · 健身器材齐全', loc: '村委会旁 / 东组 / 南组' },
        { name: '党群服务中心', detail: '1 处 · 二楼会议室', loc: '村委会' }
      ],
      '医疗卫生': [
        { name: '村卫生室', detail: '1 个 · 1名乡村医生', loc: '村委会西侧' }
      ],
      '供水': [
        { name: '集中供水站', detail: '覆盖 816 户 · 100%', loc: '村北高位水池' }
      ]
    }
  },
  finance: {
    title: '村务公开', icon: '💰', intro: '村务公开信息目录（财务、政策、集体资产、重大事项）',
    metrics: [
      { label: '公开事项', value: '35 项' },
      { label: '公开期数', value: '12 期' },
      { label: '村民代表会议', value: '4 次' }
    ],
    directory: [
      { label: '财务公开', count: '12 期' },
      { label: '惠农政策', count: '8 条' },
      { label: '集体资产', count: '6 项' },
      { label: '重大事项', count: '5 项' },
      { label: '村民代表会议', count: '4 次' }
    ],
    recent: [
      { title: '2026年7月村级财务收支明细', date: '2026-08-05', tag: '财务公开' },
      { title: '2026年惠农补贴发放名单公示', date: '2026-07-28', tag: '惠农政策' },
      { title: '集体厂房租赁招标结果公示', date: '2026-07-20', tag: '集体资产' },
      { title: '村文化广场改造项目决策公示', date: '2026-07-12', tag: '重大事项' }
    ],
    updatedAt: '2026-08-05', source: '中堰村监督委员会'
  }
}

`));

// ===== 4. 数据中心交互函数整块重写 =====
const fnStart = `// ==================== 数据中心（农户端）交互 ====================`;
const fnEnd = `// Settings`;
const newFn = `// ==================== 数据中心（农户端）交互 ====================
// 我的办事记录条数（咨询留言 + 事件上报；补贴/申请在服务中心，跨模块）
const myRecordsCount = computed(function() { return myMessages.value.length + myEvents.length })

// 我的个人数据档案（演示占位；正式由后台按 farmer_id 下发，仅本人可见；姓名/村组来自登录态 currentUser，不写死演示姓名）
const myProfile = {
  householder: currentUser.name, // 户主
  household: 4,
  members: [
    { name: currentUser.name, relation: '户主' },
    { name: '张秀英', relation: '配偶' },
    { name: '王小明', relation: '长子' },
    { name: '王小丽', relation: '长女' }
  ],
  landBlocks: 3,             // 承包地（块）
  confirmedArea: '8.6亩',    // 确权面积
  crops: [                   // 当前种植
    { name: '油菜', area: '4.2亩' },
    { name: '玉米', area: '4.4亩' }
  ],
  livestock: '暂无',         // 养殖情况
  products: ['阳光玫瑰葡萄'], // 农产品
  updatedAt: '2026-08-14 09:00', // 数据更新时间
  landPlots: [               // 土地详情（点击「查看土地详情」）
    { name: '东沟地块', area: '2.6亩', crop: '油菜', location: '村东 · 东沟', type: '承包地（确权）' },
    { name: '南坡地块', area: '2.4亩', crop: '玉米', location: '村南 · 南坡', type: '承包地（确权）' },
    { name: '场边地块', area: '3.6亩', crop: '玉米', location: '村西 · 晒场旁', type: '承包地（确权）' }
  ],
  benefits: [               // 补贴/权益（本人可查，权限仅本人）
    { name: '耕地地力保护补贴', amount: '¥ 560', date: '2026-06-30', status: '已发放' },
    { name: '城乡居民养老保险', amount: '¥ 145/月', date: '2026-07-15', status: '正常领取' },
    { name: '城乡居民基本医疗保险', amount: '已参保', date: '2026-01-01', status: '正常参保' }
  ]
}

function infoRow(label, value) {
  return '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #F0F3F5"><span style="font-size:13px;color:#66788A;flex-shrink:0">' + label + '</span><span style="font-size:14px;color:#1F2D3D;font-weight:600;text-align:right">' + value + '</span></div>'
}
function secTitle(text) {
  return '<div style="font-size:13px;font-weight:700;color:#22B573;margin:14px 0 4px">' + text + '</div>'
}

// —— 公共数据类统一组件：标题 + 核心指标卡 + 明细列表 + 更新时间/来源 + 查看详情 ——
function metricCard(label, value) {
  return '<div style="flex:1;min-width:0;background:#F7FAF9;border:1px solid #E6F0EA;border-radius:8px;padding:10px 12px"><div style="font-size:11px;color:#66788A;margin-bottom:3px">' + label + '</div><div style="font-size:16px;font-weight:700;color:#1F2D3D">' + value + '</div></div>'
}
function pubHeader(d) {
  let h = '<div style="text-align:center;padding:4px 0 14px 0"><div style="font-size:32px;margin-bottom:6px">' + d.icon + '</div>'
  h += '<div style="font-size:17px;font-weight:700;color:#1F2D3D">' + d.title + '</div>'
  h += '<div style="font-size:12px;color:#66788A;margin-top:4px">' + d.intro + '</div></div>'
  return h
}
function pubMetrics(metrics) {
  let h = '<div style="display:flex;gap:8px;margin-bottom:12px">'
  metrics.forEach(function(m) { h += metricCard(m.label, m.value) })
  h += '</div>'
  return h
}
function pubFooter(d, subAction) {
  let h = '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding-top:10px;border-top:1px dashed #E3EAF0">'
  h += '<div style="font-size:11px;color:#8A97A5">' + (d.updatedAt ? '🕘 ' + d.updatedAt + ' 更新' : '') + (d.source ? ' · ' + d.source : '') + '</div>'
  if (subAction) h += '<span style="font-size:12px;color:#22B573;font-weight:600;cursor:pointer" onclick="' + subAction + '">查看详情 ›</span>'
  h += '</div>'
  return h
}

function openMyData(key) {
  if (key === 'basic') renderMyBasicInfo()
  else if (key === 'industry') renderMyIndustryData()
  else if (key === 'records') renderMyRecords()
  else if (key === 'benefits') renderMyBenefits()
}
function renderMyBasicInfo() {
  let h = '<div style="padding:6px 0">'
  h += '<div style="text-align:center;padding:4px 0 12px 0"><div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#22B573,#1BA366);display:inline-flex;align-items:center;justify-content:center;font-size:24px;color:#fff;margin-bottom:10px">👤</div>'
  h += '<div style="font-size:18px;font-weight:700;color:#1F2D3D">' + currentUser.name + '</div>'
  h += '<div style="font-size:13px;color:#66788A;margin-top:2px">' + currentUser.village + ' · ' + currentUser.zone + ' · ' + currentUser.grid + '</div></div>'
  h += infoRow('👤 户主', myProfile.householder)
  h += infoRow('📍 所在区域', currentUser.village + ' · ' + currentUser.zone)
  h += infoRow('🏠 家庭人口', myProfile.household + ' 人')
  // 家庭成员可展开
  h += '<div onclick="window._svc.showFamilyMembers()" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #F0F3F5;cursor:pointer"><span style="font-size:13px;color:#66788A">👥 家庭成员</span><span style="font-size:14px;color:#1F2D3D;font-weight:600;display:flex;align-items:center;gap:6px">' + myProfile.household + ' 人 <span style="color:#22B573">›</span></span></div>'
  h += infoRow('📱 联系电话', currentUser.phone)
  h += infoRow('🕘 数据更新时间', myProfile.updatedAt)
  h += '<div style="text-align:center;font-size:12px;color:#8A97A5;margin-top:14px">身份证号等敏感信息不在此展示；如信息有误，可前往「数据纠错」提交修改</div>'
  h += '</div>'
  openGovModal('👤 我的基本信息', h)
}
function showFamilyMembers() {
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">户主 ' + myProfile.householder + ' · 共 ' + myProfile.household + ' 人</div>'
  myProfile.members.forEach(function(m) {
    h += '<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fff;border:1px solid #E3EAF0;border-radius:8px;margin-bottom:8px"><span style="font-size:18px">' + (m.relation === '户主' ? '👨‍🌾' : '👤') + '</span><div style="flex:1"><div style="font-size:14px;font-weight:600;color:#1F2D3D">' + m.name + '</div><div style="font-size:12px;color:#66788A;margin-top:2px">与户主关系：' + m.relation + '</div></div></div>'
  })
  h += '<div style="text-align:center;font-size:12px;color:#8A97A5;margin-top:8px">家庭信息仅本人可见，如与实际不符可提交数据纠错</div>'
  h += '</div>'
  openGovModal('👥 家庭成员', h)
}
function renderMyIndustryData() {
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">以下为本人（' + currentUser.name + '）家庭的土地与产业数据</div>'
  h += pubMetrics([
    { label: '承包地', value: myProfile.landBlocks + ' 块' },
    { label: '确权面积', value: myProfile.confirmedArea },
    { label: '养殖', value: myProfile.livestock }
  ])
  h += secTitle('🌾 当前种植')
  myProfile.crops.forEach(function(c) { h += infoRow(c.name, c.area) })
  h += secTitle('🥬 农产品')
  myProfile.products.forEach(function(p) { h += infoRow('农产品', p) })
  h += '<div style="text-align:center;margin-top:16px"><button class="btn btn-primary" onclick="window._svc.showLandDetail()">🗺 查看土地详情</button></div>'
  h += '<div style="text-align:center;font-size:12px;color:#8A97A5;margin-top:8px">产业数据如与实际不符，可前往「数据纠错」提交修改</div>'
  h += '</div>'
  openGovModal('🌾 我的产业数据', h)
}
function showLandDetail() {
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">本人承包地共 ' + myProfile.landBlocks + ' 块 · 确权面积 ' + myProfile.confirmedArea + '</div>'
  myProfile.landPlots.forEach(function(p) {
    h += '<div style="background:#fff;border:1px solid #E3EAF0;border-radius:8px;padding:12px 14px;margin-bottom:8px">'
    h += '<div style="display:flex;align-items:center;justify-content:space-between"><span style="font-size:14px;font-weight:600;color:#1F2D3D">' + p.name + '</span><span style="font-size:14px;font-weight:700;color:#22B573">' + p.area + '</span></div>'
    h += '<div style="font-size:12px;color:#66788A;margin-top:6px">📍 ' + p.location + ' · 当前种植 ' + p.crop + '</div>'
    h += '<div style="font-size:11px;color:#8A97A5;margin-top:4px">' + p.type + '</div>'
    h += '</div>'
  })
  h += '<div style="text-align:center;font-size:12px;color:#8A97A5;margin-top:8px">地块信息如与实际不符，可提交数据纠错</div>'
  h += '</div>'
  openGovModal('🗺 土地详情', h)
}

// —— 我的办事记录：汇总全平台本人办理事项（留言/上报/秸秆回收/数据纠错/办事申请）——
function activityGroup(status) {
  if (status === '已办结' || status === '已回收' || status === '已更新') return '已完成'
  if (status === '已撤回' || status === '已驳回') return '已撤回'
  return '办理中' // 待受理/处理中/待回复/已回复/待联系/村委审核中/待确认/待上门
}
function toSortable(t) {
  if (!t) return '0'
  var str = String(t)
  var m = str.match(/(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/)
  if (m) return m[1] + m[2] + m[3] + m[4] + m[5]
  m = str.match(/(\d{1,2})月(\d{1,2})日\s+(\d{1,2}):(\d{2})/)
  if (m) return '2026' + String(m[1]).padStart(2, '0') + String(m[2]).padStart(2, '0') + String(m[3]).padStart(2, '0') + m[4]
  return '0'
}
const allActivities = computed(function() {
  var list = []
  myMessages.value.forEach(function(m) {
    list.push({ kind: '留言', icon: '💬', title: m.category + ' · ' + (m.staff_name || ''), desc: m.content, status: m.status, timeText: fmtMsgDateTime(m.created_at), sort: toSortable(m.created_at), open: 'window._svc.openMessageDetailBy(\'' + m.message_id + '\')' })
  })
  myEvents.forEach(function(e) {
    list.push({ kind: '上报', icon: '📝', title: e.type, desc: e.location, status: e.status, timeText: e.time, sort: toSortable(e.time), open: 'window._svc.showMyEventDetailById(\'' + e.id + '\')' })
  })
  ecoStrawApplications.value.forEach(function(a) {
    list.push({ kind: '回收', icon: '🌾', title: '秸秆回收申请', desc: a.type + ' · ' + a.location, status: a.status, timeText: a.createdAt, sort: toSortable(a.createdAt), open: 'window._svc.openStrawApp()' })
  })
  dataCorrections.value.forEach(function(c) {
    list.push({ kind: '纠错', icon: '📝', title: '数据纠错 · ' + c.type, desc: c.desc, status: c.status, timeText: c.timeText, sort: toSortable(c.created_at), open: 'window._svc.showMyCorrections()' })
  })
  list.sort(function(a, b) { return b.sort.localeCompare(a.sort) })
  return list
})
let _activityFilter = '全部'
function setActivityFilter(f) { _activityFilter = f; renderMyRecords() }
function activityStatusColor(status) {
  const g = activityGroup(status)
  if (g === '已完成') return '#22B573'
  if (g === '已撤回') return '#8A97A5'
  return '#F2A62B'
}
function renderMyRecords() {
  const tabs = ['全部', '办理中', '已完成', '已撤回']
  const countOf = function(s) {
    if (s === '全部') return allActivities.value.length
    return allActivities.value.filter(function(a) { return activityGroup(a.status) === s }).length
  }
  const filtered = _activityFilter === '全部' ? allActivities.value : allActivities.value.filter(function(a) { return activityGroup(a.status) === _activityFilter })
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">汇总本人（' + currentUser.name + '）在平台的留言、上报、申请、纠错等全部办理事项</div>'
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">'
  tabs.forEach(function(t) {
    const on = _activityFilter === t
    h += '<span onclick="window._svc.setActivityFilter(\'' + t + '\')" style="cursor:pointer;padding:6px 14px;border-radius:16px;font-size:12px;font-weight:600;' + (on ? 'background:#22B573;color:#fff;' : 'background:#F0F3F6;color:#66788A;') + '">' + t + ' ' + countOf(t) + '</span>'
  })
  h += '</div>'
  if (filtered.length === 0) {
    h += '<div style="text-align:center;padding:40px 0;color:#66788A"><div style="font-size:36px;margin-bottom:10px">📋</div><div style="font-size:14px">该状态下暂无办事记录</div></div>'
  } else {
    filtered.forEach(function(a) {
      const c = activityStatusColor(a.status)
      h += '<div onclick="' + a.open + '" style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fff;border:1px solid #E3EAF0;border-radius:8px;cursor:pointer;margin-bottom:8px">'
      h += '<span style="font-size:20px;flex-shrink:0">' + a.icon + '</span>'
      h += '<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:600;color:#1F2D3D;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + a.title + '</div>'
      h += '<div style="font-size:12px;color:#66788A;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + a.desc + '</div></div>'
      h += '<div style="flex-shrink:0;text-align:right"><span style="display:inline-block;font-size:11px;color:' + c + ';background:' + c + '1A;padding:3px 10px;border-radius:10px;font-weight:600">' + a.status + '</span>'
      h += '<div style="font-size:10px;color:#8A97A5;margin-top:4px">' + a.timeText + '</div></div>'
      h += '</div>'
    })
  }
  h += '</div>'
  openGovModal('📋 我的办事记录', h)
}
function renderMyBenefits() {
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">以下为本人（' + currentUser.name + '）的补贴与权益记录，仅本人可见</div>'
  myProfile.benefits.forEach(function(b) {
    h += '<div style="background:#fff;border:1px solid #E3EAF0;border-radius:8px;padding:12px 14px;margin-bottom:8px">'
    h += '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><span style="font-size:14px;font-weight:600;color:#1F2D3D">' + b.name + '</span><span style="font-size:15px;font-weight:700;color:#22B573;flex-shrink:0">' + b.amount + '</span></div>'
    h += '<div style="font-size:12px;color:#66788A;margin-top:6px">发放/更新：' + b.date + '</div>'
    h += '<div style="margin-top:6px"><span style="font-size:11px;color:#22B573;background:rgba(34,181,115,0.12);padding:3px 10px;border-radius:10px;font-weight:600">' + b.status + '</span></div>'
    h += '</div>'
  })
  h += '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:10px 12px;margin-top:10px;font-size:12px;color:#1E7A54;line-height:1.6">🔒 补贴与权益涉及个人隐私，仅本人可查看；更多补贴政策可在「数字产业中心 / 服务中心」查询。</div>'
  h += '</div>'
  openGovModal('💰 我的补贴/权益', h)
}

function openVillageData(key) {
  const d = villageDataDetail[key]
  if (!d) return
  let h = '<div style="padding:6px 0">'
  h += pubHeader(d)
  h += pubMetrics(d.metrics || [])
  ;(d.rows || []).forEach(function(r) {
    const right = r.value + (r.action ? ' <span style="color:#22B573;font-size:14px;cursor:pointer" onclick="window._svc.openVillageSub(\'' + key + '\')">›</span>' : '')
    h += '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #F0F3F5"><span style="font-size:13px;color:#66788A">' + r.label + '</span><span style="font-size:14px;color:#1F2D3D;font-weight:600;text-align:right">' + right + '</span></div>'
  })
  if (d.directory) {
    h += secTitle('📂 公开目录')
    d.directory.forEach(function(it) {
      h += '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F0F3F5"><span style="font-size:13px;color:#1F2D3D;font-weight:600">' + it.label + '</span><span style="font-size:13px;color:#22B573;font-weight:600">' + it.count + ' ›</span></div>'
    })
    h += secTitle('🕘 最近更新')
    d.recent.forEach(function(r) {
      h += '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #F0F3F5"><span style="flex-shrink:0;font-size:11px;color:#22B573;background:rgba(34,181,115,0.12);padding:3px 8px;border-radius:6px">' + r.tag + '</span><span style="flex:1;font-size:13px;color:#1F2D3D;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + r.title + '</span><span style="flex-shrink:0;font-size:11px;color:#8A97A5">' + r.date + '</span></div>'
    })
  }
  if (d.monitors) {
    h += '<div style="text-align:center;margin-top:14px"><button class="btn btn-primary" onclick="window._svc.openVillageSub(\'' + key + '\')">📍 查看 ' + d.monitors.length + ' 个监测点</button></div>'
  }
  h += pubFooter(d, (key === 'infra') ? 'window._svc.openVillageSub(\'infra\')' : null)
  h += '</div>'
  openGovModal(d.icon + ' ' + d.title, h)
}
function openVillageSub(key) {
  const d = villageDataDetail[key]
  if (!d) return
  if (d.monitors) renderMonitorPoints(d)
  else if (d.facilities) renderFacilities(d)
}
function renderMonitorPoints(d) {
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">本村共 ' + d.monitors.length + ' 个环境监测点</div>'
  d.monitors.forEach(function(m) {
    h += '<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fff;border:1px solid #E3EAF0;border-radius:8px;margin-bottom:8px"><span style="font-size:20px">📡</span><div style="flex:1"><div style="font-size:14px;font-weight:600;color:#1F2D3D">' + m.name + '</div><div style="font-size:12px;color:#66788A;margin-top:3px">📍 ' + m.loc + '</div></div><div style="text-align:right"><div style="font-size:12px;font-weight:600;color:#1F2D3D">' + m.value + '</div><div style="font-size:11px;color:#22B573;margin-top:3px">● ' + m.status + '</div></div></div>'
  })
  h += pubFooter(d)
  h += '</div>'
  openGovModal('🌱 环境监测点', h)
}
function renderFacilities(d) {
  let h = '<div style="padding:6px 0">'
  Object.keys(d.facilities).forEach(function(cat) {
    h += secTitle(cat)
    d.facilities[cat].forEach(function(f) {
      h += '<div style="background:#fff;border:1px solid #E3EAF0;border-radius:8px;padding:12px 14px;margin-bottom:8px"><div style="display:flex;align-items:center;justify-content:space-between"><span style="font-size:14px;font-weight:600;color:#1F2D3D">' + f.name + '</span><span style="font-size:11px;color:#22B573;cursor:pointer" onclick="window._svc.viewFacilityLocation(\'' + f.name + '\')">📍 地图</span></div><div style="font-size:12px;color:#66788A;margin-top:6px">' + f.detail + '</div><div style="font-size:11px;color:#8A97A5;margin-top:4px">📍 ' + f.loc + '</div></div>'
    })
  })
  h += pubFooter(d)
  h += '</div>'
  openGovModal('🏠 基础设施明细', h)
}
function viewFacilityLocation(name) { toast('「' + name + '」位置已在地图标注', 'info') }

function openVillageDataMore() {
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">本村公开数据查询目录（仅公开统计，不含个人隐私）</div>'
  Object.keys(villageDataDetail).forEach(function(k) {
    const d = villageDataDetail[k]
    h += '<div onclick="window._svc.openVillageData(\'' + k + '\')" style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fff;border:1px solid #E3EAF0;border-radius:8px;cursor:pointer;margin-bottom:8px"><span style="font-size:20px">' + d.icon + '</span><div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:600;color:#1F2D3D">' + d.title + '</div><div style="font-size:12px;color:#66788A">' + d.intro + '</div></div><span style="font-size:13px;color:#22B573;font-weight:600;flex-shrink:0">查看 ›</span></div>'
  })
  h += '<div style="text-align:center;font-size:12px;color:#8A97A5;margin-top:8px">更多公开数据将陆续接入</div>'
  h += '</div>'
  openGovModal('📂 本村公开数据', h)
}

function openDataAuth() {
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">平台保存了本人（' + currentUser.name + '）以下信息，用于对应服务</div>'
  dataAuthItems.forEach(function(a) {
    h += '<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fff;border:1px solid #E3EAF0;border-radius:8px;margin-bottom:10px"><span style="font-size:18px">🔐</span><div style="flex:1"><div style="font-size:14px;font-weight:600;color:#1F2D3D">' + a.field + '</div><div style="font-size:12px;color:#66788A;margin-top:2px">' + a.use + '</div></div></div>'
  })
  h += '<div style="display:flex;gap:8px;justify-content:center;margin-top:14px">'
  h += '<button class="btn btn-outline" onclick="window._svc.showDataUsage()">查看数据使用说明</button>'
  h += '<button class="btn btn-primary" onclick="window._svc.startDataCorrection()">数据有误？去纠错</button>'
  h += '</div></div>'
  openGovModal('🔐 我的数据与授权', h)
}
function showDataUsage() {
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;line-height:1.8;margin-bottom:8px">平台遵循「最小必要」原则收集和使用数据：</div>'
  const usages = [
    ['基本身份信息', '用于登录身份确认与基础服务，如办事通知、身份核验'],
    ['土地信息', '用于产业服务，如惠农补贴测算、农技指导'],
    ['联系方式', '用于办事进度通知、干部回复提醒'],
    ['办事记录', '用于查询本人上报、申请、留言的办理进度']
  ]
  usages.forEach(function(r) {
    h += '<div style="padding:8px 0;border-bottom:1px solid #F0F3F5"><div style="font-size:13px;font-weight:600;color:#1F2D3D">' + r[0] + '</div><div style="font-size:12px;color:#66788A;margin-top:2px">' + r[1] + '</div></div>'
  })
  h += '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px;margin-top:14px;font-size:12px;color:#1E7A54;line-height:1.7">您的个人信息仅用于本村平台服务，不会向无关第三方泄露；未经授权，其他村民无法查看您的个人数据。</div>'
  h += '</div>'
  openGovModal('📖 数据使用说明', h)
}

// ===== 数据纠错申请（选择错误数据 → 当前数据 → 正确信息 → 说明原因 → 上传证明 → 提交 → 村委审核 → 修改完成）=====
let _corrType = '', _corrCurrent = '', _corrCorrect = '', _corrReason = '', _corrPhotos = [], _corrSeq = 0
const corrTypes = ['基本身份信息', '家庭人口', '土地信息', '产业数据', '联系方式', '补贴/权益', '其他']
function startDataCorrection() { _corrType = ''; _corrCurrent = ''; _corrCorrect = ''; _corrReason = ''; _corrPhotos = []; renderCorrectionForm() }
function snapshotCorr() {
  const cur = document.getElementById('corr-current'); if (cur) _corrCurrent = cur.value
  const cor = document.getElementById('corr-correct'); if (cor) _corrCorrect = cor.value
  const rea = document.getElementById('corr-reason'); if (rea) _corrReason = rea.value
}
function setCorrType(t) { snapshotCorr(); _corrType = t; renderCorrectionForm() }
function renderCorrectionForm() {
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">发现本人数据有误，可在此提交纠错申请，村委审核后更新</div>'
  h += '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:8px">1. 选择错误数据</div>'
  h += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px">'
  corrTypes.forEach(function(t) {
    const on = _corrType === t
    h += '<span onclick="window._svc.setCorrType(\'' + t + '\')" style="cursor:pointer;padding:6px 14px;border-radius:16px;font-size:13px;font-weight:600;' + (on ? 'background:#22B573;color:#fff;' : 'background:#F0F3F6;color:#66788A;') + '">' + t + '</span>'
  })
  h += '</div>'
  h += '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:8px">2. 当前数据（平台里显示的信息）</div>'
  h += '<input id="corr-current" placeholder="例如：家庭人口显示 3 人" value="' + _corrCurrent + '" style="width:100%;box-sizing:border-box;border:1px solid #D0D8E2;border-radius:8px;padding:10px 12px;font-size:14px;font-family:inherit;color:#1F2D3D;margin-bottom:16px">'
  h += '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:8px">3. 正确信息</div>'
  h += '<input id="corr-correct" placeholder="例如：实际应为 4 人" value="' + _corrCorrect + '" style="width:100%;box-sizing:border-box;border:1px solid #D0D8E2;border-radius:8px;padding:10px 12px;font-size:14px;font-family:inherit;color:#1F2D3D;margin-bottom:16px">'
  h += '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:8px">4. 说明原因</div>'
  h += '<textarea id="corr-reason" placeholder="请简要说明为什么数据有误（选填）" style="width:100%;box-sizing:border-box;min-height:70px;border:1px solid #D0D8E2;border-radius:8px;padding:10px 12px;font-size:14px;font-family:inherit;color:#1F2D3D;resize:vertical;margin-bottom:16px">' + _corrReason + '</textarea>'
  h += '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:8px">5. 上传证明（选填，最多 3 张）</div>'
  h += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">'
  _corrPhotos.forEach(function(p, i) {
    h += '<div style="position:relative;width:60px;height:60px;border-radius:8px;overflow:hidden;border:1px solid #E3EAF0">' + (p.dataUrl ? '<img src="' + p.dataUrl + '" style="width:100%;height:100%;object-fit:cover">' : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:12px;color:#8A97A5">…</div>') + '<span onclick="window._svc.removeCorrPhoto(' + i + ')" style="position:absolute;top:0;right:0;width:18px;height:18px;background:rgba(0,0,0,.5);color:#fff;font-size:12px;line-height:18px;text-align:center;cursor:pointer">×</span></div>'
  })
  if (_corrPhotos.length < 3) {
    h += '<div onclick="window._svc.triggerCorrPhotoUpload()" style="width:60px;height:60px;border:1px dashed #C8D4E0;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:22px;color:#8A97A5;cursor:pointer">＋</div>'
  }
  h += '<input type="file" id="corr-photo-input" accept="image/*" style="display:none" onchange="window._svc.handleCorrPhotoSelected(event)">'
  h += '</div>'
  h += '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">'
  h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">取消</button>'
  h += '<button class="btn btn-primary" onclick="window._svc.submitCorrection()">提交申请</button>'
  h += '</div></div>'
  openGovModal('📝 数据纠错申请', h)
}
function triggerCorrPhotoUpload() { snapshotCorr(); document.getElementById('corr-photo-input').click() }
function handleCorrPhotoSelected(ev) {
  const file = ev.target.files && ev.target.files[0]
  if (!file) return
  if (_corrPhotos.length >= 3) { toast('最多上传 3 张证明', 'info'); return }
  const reader = new FileReader()
  reader.onload = function(e) { _corrPhotos.push({ name: file.name, dataUrl: e.target.result }); renderCorrectionForm() }
  reader.readAsDataURL(file)
  ev.target.value = ''
}
function removeCorrPhoto(i) { snapshotCorr(); _corrPhotos.splice(i, 1); renderCorrectionForm() }
function submitCorrection() {
  snapshotCorr()
  if (!_corrType) { toast('请选择数据类型', 'info'); return }
  if (!_corrCurrent.trim()) { toast('请填写当前数据', 'info'); return }
  if (!_corrCorrect.trim()) { toast('请填写正确信息', 'info'); return }
  const now = new Date()
  const ymd = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0')
  _corrSeq += 1
  const id = 'SJJC' + ymd + String(_corrSeq).padStart(3, '0')
  const rec = {
    id: id,
    village_id: 'zhongyan',
    farmer_id: currentUser.farmerId,
    farmer_name: currentUser.name,
    type: _corrType,
    current: _corrCurrent.trim(),
    correct: _corrCorrect.trim(),
    reason: _corrReason.trim(),
    desc: _corrCurrent.trim() + ' → ' + _corrCorrect.trim(),
    images: _corrPhotos.map(function(p) { return { name: p.name, dataUrl: p.dataUrl } }),
    status: '村委审核中',
    created_at: now.toISOString(),
    timeText: fmtMsgTime(now)
  }
  dataCorrections.value.unshift(rec)
  renderCorrectionSuccess(rec)
}
function renderCorrectionSuccess(rec) {
  let h = '<div style="text-align:center;padding:16px 0"><div style="font-size:48px;margin-bottom:12px">✅</div>'
  h += '<h4 style="color:#22B573;margin:0 0 16px 0;font-size:17px">纠错申请已提交</h4>'
  h += '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:14px;margin-bottom:16px;text-align:left">'
  h += '<div style="font-size:14px;color:#475867;line-height:2">纠错编号：<span style="color:#1F2D3D;font-weight:700">' + rec.id + '</span><br>'
  h += '数据类型：<span style="color:#1F2D3D;font-weight:700">' + rec.type + '</span><br>'
  h += '当前状态：<span style="color:#F2A62B;font-weight:700">村委审核中</span></div></div>'
  h += '<div style="font-size:13px;color:#66788A;text-align:center;margin-bottom:20px">提交后已自动进入「我的办事记录」，村委审核通过后会更新您的数据。</div>'
  h += '<div style="display:flex;gap:8px;justify-content:center">'
  h += '<button class="btn btn-primary" onclick="window._svc.showMyCorrections()">查看处理进度</button>'
  h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">完成</button>'
  h += '</div></div>'
  openGovModal('纠错申请已提交', h)
}
function showMyCorrections() {
  const list = dataCorrections.value
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">本人（' + currentUser.name + '）提交的数据纠错记录</div>'
  if (list.length === 0) {
    h += '<div style="text-align:center;padding:40px 0;color:#66788A"><div style="font-size:36px;margin-bottom:10px">📝</div><div style="font-size:14px">暂无纠错记录</div><div style="font-size:12px;margin-top:4px">提交纠错申请后会显示在这里</div></div>'
  } else {
    list.forEach(function(r) {
      const c = r.status === '已更新' ? '#22B573' : (r.status === '已驳回' ? '#E05252' : '#F2A62B')
      h += '<div style="background:#fff;border:1px solid #E3EAF0;border-radius:8px;padding:12px 14px;margin-bottom:8px">'
      h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px"><span style="font-size:13px;font-weight:600;color:#1F2D3D">' + r.type + '</span><span style="flex-shrink:0;font-size:11px;color:' + c + ';background:' + c + '1A;padding:3px 10px;border-radius:10px;font-weight:600">' + r.status + '</span></div>'
      h += '<div style="font-size:12px;color:#66788A;line-height:1.7">' + (r.current || '') + ' <span style="color:#22B573">→</span> ' + (r.correct || '') + '</div>'
      h += '<div style="font-size:11px;color:#8A97A5;margin-top:6px">' + r.id + ' · ' + r.timeText + '</div>'
      h += '</div>'
    })
  }
  h += '</div>'
  openGovModal('📝 我的纠错记录', h)
}

`;
check('4-data-center-fns', cut(fnStart, fnEnd, newFn));

// ===== 5. _svc 注册新函数 =====
check('5-svc-register', gsub(
`submitCorrection, showMyCorrections,`,
`submitCorrection, showMyCorrections, showFamilyMembers, showLandDetail, setActivityFilter, openVillageSub, viewFacilityLocation,`));

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== DATA CENTER ROUND 2 ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
