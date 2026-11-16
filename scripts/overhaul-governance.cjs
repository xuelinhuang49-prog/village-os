// Overhaul Governance Center: admin dashboard → farmer-facing portal
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. Replace governance template (lines 224-281) =====
const oldGovTemplate = `        <!-- ==================== PAGE: Governance ==================== -->
        <div v-show="currentPage === 'governance'" class="page-content" key="governance">
          <div class="stat-grid">
            <div class="stat-card r" v-for="s in govStats" :key="s.label" @click="openStatDetail(s.label, s.value)">
              <div><div class="sc-val">{{ s.value }}</div><div class="sc-lbl">{{ s.label }}</div><div class="sc-sub">{{ s.sub }}</div></div>
              <div class="sc-icon" :style="{background:s.iconBg}">{{ s.icon }}</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar"></span>📈 事件趋势（近7天）</div>
              <div class="panel-bd"><div ref="chartGovTrend" class="chart-box" style="height:180px"></div></div>
            </div>
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar g"></span>📊 事件分类统计</div>
              <div class="panel-bd"><div ref="chartGovPie" class="chart-box" style="height:180px"></div></div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar"></span>事件流转 — 待办事项</div>
              <div class="panel-bd" style="padding:8px">
                <table class="data-table">
                  <thead><tr><th>编号</th><th>类型</th><th>上报人</th><th>地点</th><th>状态</th><th>时间</th></tr></thead>
                  <tbody>
                    <tr v-for="e in eventItems" :key="e.id" @click="openEventDetail(e)">
                      <td>{{ e.id }}</td><td>{{ e.type }}</td><td>{{ e.reporter }}</td>
                      <td>{{ e.location }}</td><td><span class="st" :class="e.statusCls">{{ e.status }}</span></td><td>{{ e.time }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar g"></span>网格管理 · 五维数据库<span class="extra">人·房·地·事·物</span></div>
              <div class="panel-bd">
                <div class="five-grid">
                  <div class="svc-card" v-for="f in fiveDimData" :key="f.label" @click="openSvcDetail(f)">
                    <span class="sv">{{ f.icon }}</span><div class="sn">{{ f.label }}</div><div class="sd">{{ f.desc }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-hd"><span class="hd-bar y"></span>🤖 AI 乡村助手<span class="extra">Powered by 大语言模型</span></div>
            <div class="panel-bd">
              <div class="chat-wrapper">
                <div class="chat-area" ref="chatAreaRef">
                  <div v-for="(m,i) in chatMessages" :key="i" :class="['chat-msg', m.role]">{{ m.text }}</div>
                </div>
                <div class="chat-input-row">
                  <input class="input" v-model="chatInput" placeholder="输入您的问题..." @keyup.enter="sendChat" />
                  <button class="btn btn-primary" @click="sendChat">发送</button>
                </div>
              </div>
            </div>
          </div>
        </div>`;

if (s.includes(oldGovTemplate)) {
  const newGovTemplate = `        <!-- ==================== PAGE: Governance ==================== -->
        <div v-show="currentPage === 'governance'" class="page-content" key="governance">
          <!-- Farmer-personal stats -->
          <div class="stat-grid">
            <div class="stat-card r" @click="showMyReports()">
              <div><div class="sc-val">{{ govStats[0].value }}</div><div class="sc-lbl">{{ govStats[0].label }}</div><div class="sc-sub">{{ govStats[0].sub }}</div></div>
              <div class="sc-icon" :style="{background:govStats[0].iconBg}">{{ govStats[0].icon }}</div>
            </div>
            <div class="stat-card y" @click="showMyReports()">
              <div><div class="sc-val">{{ govStats[1].value }}</div><div class="sc-lbl">{{ govStats[1].label }}</div><div class="sc-sub">{{ govStats[1].sub }}</div></div>
              <div class="sc-icon" :style="{background:govStats[1].iconBg}">{{ govStats[1].icon }}</div>
            </div>
            <div class="stat-card g" @click="showMyReports()">
              <div><div class="sc-val">{{ govStats[2].value }}</div><div class="sc-lbl">{{ govStats[2].label }}</div><div class="sc-sub">{{ govStats[2].sub }}</div></div>
              <div class="sc-icon" :style="{background:govStats[2].iconBg}">{{ govStats[2].icon }}</div>
            </div>
            <div class="stat-card" @click="showGridWorkerInfo()">
              <div><div class="sc-val">{{ govStats[3].value }}</div><div class="sc-lbl">{{ govStats[3].label }}</div><div class="sc-sub">{{ govStats[3].sub }}</div></div>
              <div class="sc-icon" :style="{background:govStats[3].iconBg}">{{ govStats[3].icon }}</div>
            </div>
          </div>
          <!-- Quick services bar -->
          <div class="gov-quick-bar">
            <button class="gov-qbtn primary" @click="showEventReportForm()"><span class="qbtn-icon">📝</span>事件上报</button>
            <button class="gov-qbtn" @click="showMyReports()"><span class="qbtn-icon">📋</span>我的上报</button>
            <button class="gov-qbtn" @click="showGridWorkerInfo()"><span class="qbtn-icon">📞</span>网格员联系</button>
            <button class="gov-qbtn" @click="showVillageNotices()"><span class="qbtn-icon">📢</span>村务公告</button>
          </div>
          <!-- My events table -->
          <div class="panel" style="margin-bottom:10px">
            <div class="panel-hd"><span class="hd-bar"></span>📋 我的上报<span class="extra">共 {{ myEvents.length }} 条</span></div>
            <div class="panel-bd" style="padding:8px">
              <table class="data-table" v-if="myEvents.length > 0">
                <thead><tr><th>编号</th><th>事项</th><th>地点</th><th>上报时间</th><th>状态</th><th>操作</th></tr></thead>
                <tbody>
                  <tr v-for="e in myEvents" :key="e.id">
                    <td>{{ e.id }}</td><td>{{ e.type }}</td>
                    <td>{{ e.location }}</td><td>{{ e.time }}</td>
                    <td><span class="st" :class="e.statusCls">{{ e.status }}</span></td>
                    <td><button class="btn btn-outline btn-xs" @click="showMyEventDetail(e)">查看</button></td>
                  </tr>
                </tbody>
              </table>
              <div v-else style="text-align:center;padding:30px 0;color:#6F91A8;font-size:12px">
                📭 暂无上报记录<br><span style="font-size:10px;margin-top:4px;display:inline-block">点击上方「事件上报」按钮提交您的第一个事件</span>
              </div>
            </div>
          </div>
          <!-- Recent reports + Village notices side by side -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar g"></span>📌 近期上报</div>
              <div class="panel-bd" style="padding:8px">
                <div v-if="recentReports.length > 0">
                  <div v-for="r in recentReports" :key="r.id" class="gov-news-item" @click="showMyEventDetail(r)">
                    <div class="gni-left">
                      <span class="gni-type" :style="{background:r.typeBg}">{{ r.type }}</span>
                    </div>
                    <div class="gni-mid">
                      <div class="gni-loc">{{ r.location }}</div>
                      <div class="gni-time">{{ r.time }}</div>
                    </div>
                    <div class="gni-right">
                      <span class="st" :class="r.statusCls" style="font-size:10px">{{ r.status }}</span>
                    </div>
                  </div>
                </div>
                <div v-else style="text-align:center;padding:20px 0;color:#6F91A8;font-size:11px">暂无近期上报</div>
              </div>
            </div>
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar y"></span>🔔 村务提醒</div>
              <div class="panel-bd" style="padding:8px">
                <div v-if="villageNotices.length > 0">
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
                </div>
                <div v-else style="text-align:center;padding:20px 0;color:#6F91A8;font-size:11px">暂无村务提醒</div>
              </div>
            </div>
          </div>
          <!-- Grid worker info -->
          <div class="panel" style="margin-bottom:10px">
            <div class="panel-hd"><span class="hd-bar"></span>👤 我的网格员</div>
            <div class="panel-bd">
              <div class="grid-worker-card">
                <div class="gw-avatar">{{ gridWorker.avatar }}</div>
                <div class="gw-info">
                  <div class="gw-name">{{ gridWorker.name }} <span class="gw-role">{{ gridWorker.role }}</span></div>
                  <div class="gw-meta">
                    <span>📞 {{ gridWorker.phone }}</span>
                    <span>🏘️ {{ gridWorker.grid }}</span>
                    <span>📍 {{ gridWorker.area }}</span>
                  </div>
                </div>
                <div class="gw-actions">
                  <button class="btn btn-primary btn-sm" @click="callGridWorker()">📞 联系网格员</button>
                  <button class="btn btn-outline btn-sm" @click="showGridWorkerInfo()">查看详情</button>
                </div>
              </div>
            </div>
          </div>
          <!-- AI Assistant (kept for farmers) -->
          <div class="panel">
            <div class="panel-hd"><span class="hd-bar y"></span>🤖 AI 乡村助手<span class="extra">有问题随时问我</span></div>
            <div class="panel-bd">
              <div class="chat-wrapper">
                <div class="chat-area" ref="chatAreaRef">
                  <div v-for="(m,i) in chatMessages" :key="i" :class="['chat-msg', m.role]">{{ m.text }}</div>
                </div>
                <div class="chat-input-row">
                  <input class="input" v-model="chatInput" placeholder="输入您的问题..." @keyup.enter="sendChat" />
                  <button class="btn btn-primary" @click="sendChat">发送</button>
                </div>
              </div>
            </div>
          </div>
        </div>`;
  s = s.replace(oldGovTemplate, newGovTemplate);
  check('1-template', true);
} else { check('1-template', false); }

// ===== 2. Remove chartGovTrend and chartGovPie refs =====
const oldChartRefs = `const chartGovTrend = ref(null)
const chartGovPie = ref(null)
const chartEcoAir`;
const newChartRefs = `const chartEcoAir`;
if (s.includes(oldChartRefs)) {
  s = s.replace(oldChartRefs, newChartRefs);
  check('2-chart-refs', true);
} else { check('2-chart-refs', false); }

// ===== 3. Replace openEventDetail with farmer-focused version =====
const oldOpenEvent = `function openEventDetail(e) {
  const c = '<div class="detail-section"><h4>事件详情</h4><div class="detail-field"><span class="df-lbl">事件编号</span><span class="df-val">' + e.id + '</span></div><div class="detail-field"><span class="df-lbl">事件类型</span><span class="df-val">' + e.type + '</span></div><div class="detail-field"><span class="df-lbl">上报人</span><span class="df-val">' + e.reporter + '</span></div><div class="detail-field"><span class="df-lbl">地点</span><span class="df-val">' + e.location + '</span></div><div class="detail-field"><span class="df-lbl">当前状态</span><span class="df-val">' + e.status + '</span></div></div><div class="detail-actions"><button class="btn btn-primary" onclick="window._toast && window._toast(\\'事件处理中…\\',\\'success\\')">处理事件</button><button class="btn btn-outline" onclick="window._toast && window._toast(\\'已转交乡镇部门\\',\\'info\\')">转交上级</button></div>'
  openDetail('事件 ' + e.id, c)
}`;

const newOpenEvent = `function openEventDetail(e) {
  showMyEventDetail(e)
}`;
if (s.includes(oldOpenEvent)) {
  s = s.replace(oldOpenEvent, newOpenEvent);
  check('3-openEventDetail', true);
} else { check('3-openEventDetail', false); }

// ===== 4. Replace initGovCharts with no-op =====
const oldInitGov = `function initGovCharts() {
  if (chartGovTrend.value) {
    makeChart(chartGovTrend.value, {
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(4,18,40,0.95)', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#c8daea', fontSize: 10 } },
      grid: { left: 8, right: 20, top: 10, bottom: 24 },
      xAxis: { type: 'category', data: ['6/12', '6/13', '6/14', '6/15', '6/16', '6/17', '6/18'], axisLabel: { color: '#5e7a9a', fontSize: 9 } },
      yAxis: { type: 'value', axisLabel: { color: '#5e7a9a', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(14,165,233,0.06)' } } },
      series: [
        { type: 'bar', data: [8, 12, 5, 9, 7, 6, 10], barWidth: 16, itemStyle: { borderRadius: [3, 3, 0, 0], color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#28C7FA' }, { offset: 1, color: 'rgba(57,217,138,0.20)' }]) } },
        { type: 'line', data: [8, 12, 5, 9, 7, 6, 10], smooth: true, lineStyle: { color: '#39D98A', width: 2 }, itemStyle: { color: '#39D98A' }, symbol: 'circle', symbolSize: 6 }
      ]
    })
  }
  if (chartGovPie.value) {
    makeChart(chartGovPie.value, {
      tooltip: { trigger: 'item', backgroundColor: 'rgba(4,18,40,0.95)', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#c8daea', fontSize: 10 } },
      series: [{ type: 'pie', radius: ['50%', '72%'], center: ['50%', '50%'], itemStyle: { borderColor: 'rgba(8,28,58,0.92)', borderWidth: 2 }, label: { color: '#5e7a9a', fontSize: 9 },
        data: [
          { value: 18, name: '基础设施', itemStyle: { color: '#28C7FA' } }, { value: 12, name: '环境卫生', itemStyle: { color: '#39D98A' } },
          { value: 8, name: '老人关怀', itemStyle: { color: '#f59e0b' } }, { value: 5, name: '农业生产', itemStyle: { color: '#E74C3C' } }, { value: 4, name: '其他', itemStyle: { color: '#28C7FA' } }
        ]
      }]
    })
  }
}`;

const newInitGov = `function initGovCharts() {
  // Governance charts removed — farmer-facing portal uses stat cards instead of ECharts
  // Admin-level charts (event trends, category breakdown) preserved for future admin dashboard
}`;
if (s.includes(oldInitGov)) {
  s = s.replace(oldInitGov, newInitGov);
  check('4-initGovCharts', true);
} else { check('4-initGovCharts', false); }

// ===== 5. Remove governance from initCharts chartsMap =====
const oldChartsMap = `  const chartsMap = {
    dashboard: initDashboardCharts,
    governance: initGovCharts,
    ecology: initEcoCharts,
    iot: initIotCharts
  }`;
const newChartsMap = `  const chartsMap = {
    dashboard: initDashboardCharts,
    ecology: initEcoCharts,
    iot: initIotCharts
  }`;
if (s.includes(oldChartsMap)) {
  s = s.replace(oldChartsMap, newChartsMap);
  check('5-chartsMap', true);
} else { check('5-chartsMap', false); }

// ===== 6. Replace governance data (govStats, eventItems, fiveDimData) =====
const oldGovData = `// Governance
const govStats = [
  { label: '待处理事件', value: '3', sub: '↓40% 较上月', icon: '📋', iconBg: '#FDE8E8' },
  { label: '本月处理事件', value: '47', sub: '处理率 96%', icon: '✅', iconBg: 'rgba(57,217,138,0.12)' },
  { label: '网格员巡查次数', value: '128', sub: '覆盖率 100%', icon: '🚶', iconBg: '#FFF8E8' },
  { label: '网格分区', value: '10', sub: '10名网格员', icon: '🗺️', iconBg: 'rgba(14,165,233,.10)' }
]
const eventItems = [
  { id: '#EV0617', type: '基础设施', reporter: '王大爷', location: '村东口路灯', status: '处理中', statusCls: 'warning', time: '09:30' },
  { id: '#EV0616', type: '环境卫生', reporter: '刘阿姨', location: '3组晒场旁', status: '已完成', statusCls: 'online', time: '昨天' },
  { id: '#EV0615', type: '水管破裂', reporter: '张大叔', location: '村南灌溉渠', status: '已完成', statusCls: 'online', time: '6/15' },
  { id: '#EV0614', type: '老人关怀', reporter: '系统自动', location: '2组李奶奶家', status: '已完成', statusCls: 'online', time: '6/14' },
  { id: '#EV0613', type: '农业生产', reporter: '赵大哥', location: '苹果园区', status: '已完成', statusCls: 'online', time: '6/13' }
]
const fiveDimData = [
  { icon: '👤', label: '人口管理', desc: '2,910人建档' }, { icon: '🏠', label: '房屋管理', desc: '816户登记' },
  { icon: '🌍', label: '土地管理', desc: '3,850亩耕地' }, { icon: '📌', label: '事件管理', desc: '47件/月' },
  { icon: '📦', label: '物品管理', desc: '集体资产台账' }, { icon: '👴', label: '特殊群体', desc: '38人关怀' }
]`;

const newGovData = `// Governance — Farmer-facing portal
const govStats = [
  { label: '我的上报', value: '5', sub: '本月累计', icon: '📝', iconBg: '#FDE8E8' },
  { label: '处理中', value: '1', sub: '等待处理', icon: '⏳', iconBg: '#FFF8E8' },
  { label: '已办结', value: '3', sub: '本月办结', icon: '✅', iconBg: 'rgba(57,217,138,0.12)' },
  { label: '所在网格', value: '第3网格', sub: '网格员：王大爷', icon: '🗺️', iconBg: 'rgba(14,165,233,.10)' }
]
const myEvents = [
  { id: '#EV0712', type: '基础设施', location: '村东口路灯不亮', status: '处理中', statusCls: 'warning', time: '7月12日 09:30', timeline: [
    { time: '7月12日 09:30', status: '已提交', desc: '您已成功提交事件上报' },
    { time: '7月12日 10:15', status: '已受理', desc: '网格员王大爷已受理您的事件' },
    { time: '7月12日 14:00', status: '处理中', desc: '已安排电工前往维修' }
  ]},
  { id: '#EV0708', type: '环境卫生', location: '3组晒场旁垃圾堆积', status: '已办结', statusCls: 'online', time: '7月8日 14:20', timeline: [
    { time: '7月8日 14:20', status: '已提交', desc: '您已成功提交事件上报' },
    { time: '7月8日 15:00', status: '已受理', desc: '网格员王大爷已受理您的事件' },
    { time: '7月9日 10:30', status: '已办结', desc: '保洁员已清理完毕，事件办结' }
  ]},
  { id: '#EV0625', type: '农业生产', location: '苹果园区灌溉水压不足', status: '已办结', statusCls: 'online', time: '6月25日 08:15', timeline: [
    { time: '6月25日 08:15', status: '已提交', desc: '您已成功提交事件上报' },
    { time: '6月25日 09:00', status: '已受理', desc: '网格员王大爷已受理您的事件' },
    { time: '6月25日 11:30', status: '处理中', desc: '维修人员已到场检修水泵' },
    { time: '6月25日 16:00', status: '已办结', desc: '水泵已修复，水压恢复正常' }
  ]},
  { id: '#EV0618', type: '安全隐患', location: '3组主干道井盖破损', status: '已办结', statusCls: 'online', time: '6月18日 16:40', timeline: [
    { time: '6月18日 16:40', status: '已提交', desc: '您已成功提交事件上报' },
    { time: '6月18日 17:20', status: '已受理', desc: '网格员王大爷已受理，设置临时警示' },
    { time: '6月19日 09:00', status: '已办结', desc: '新井盖已更换完毕' }
  ]},
  { id: '#EV0520', type: '公共设施', location: '村文化广场健身器材损坏', status: '已驳回', statusCls: 'offline', time: '5月20日 10:00', timeline: [
    { time: '5月20日 10:00', status: '已提交', desc: '您已成功提交事件上报' },
    { time: '5月20日 14:30', status: '已驳回', desc: '该器材已纳入下月统一更换计划，暂不受理' }
  ]}
]
const recentReports = [
  { id: 'R001', type: '基础设施', typeBg: '#28C7FA', location: '村东口路灯不亮', time: '7月12日', status: '处理中', statusCls: 'warning' },
  { id: 'R002', type: '环境卫生', typeBg: '#39D98A', location: '3组晒场旁垃圾堆积', time: '7月8日', status: '已办结', statusCls: 'online' },
  { id: 'R003', type: '农业生产', typeBg: '#f59e0b', location: '苹果园区灌溉水压不足', time: '6月25日', status: '已办结', statusCls: 'online' }
]
const villageNotices = [
  { id: 'N001', icon: '📢', title: '7月党员活动日通知', date: '7月10日', source: '村党支部' },
  { id: 'N002', icon: '🏥', title: '65岁以上老人免费体检', date: '7月15日', source: '乡镇卫生院' },
  { id: 'N003', icon: '🌾', title: '夏季秸秆禁烧宣传', date: '7月5日', source: '村委会' },
  { id: 'N004', icon: '💧', title: '节水灌溉补贴申请通知', date: '7月1日', source: '乡镇水利站' }
]
const gridWorker = {
  name: '王大爷', role: '第3网格网格员', avatar: '王', phone: '138-xxxx-1234',
  grid: '第3网格', area: '村东片区 · 覆盖186户', dutyStart: '2023年3月',
  desc: '负责村东片区日常巡查、事件受理、矛盾调解、政策宣传等工作，熟悉片区每户情况，工作认真负责。',
  stats: { patrols: 128, events: 47, resolved: 45, satisfaction: 98 }
}`;
if (s.includes(oldGovData)) {
  s = s.replace(oldGovData, newGovData);
  check('6-govData', true);
} else { check('6-govData', false); }

// ===== 7. Add new governance functions before the chatbot section =====
const oldChatbotSection = `const chatMessages = reactive([
  { role: 'ai', text: '👋 您好！我是中堰村AI助手，您可以问我：<br>• 村里有多少低保户？  • 今年补贴资金发放情况？<br>• 帮我生成本月会议纪要。  • 最新的惠农政策有哪些？' }
])`;

const newGovFunctions = `// ==================== GOVERNANCE FUNCTIONS ====================
let _reportStep = 0, _reportType = '', _reportDesc = '', _reportLocation = '', _reportPhotos = []

function showEventReportForm() {
  _reportStep = 1; _reportType = ''; _reportDesc = ''; _reportLocation = ''; _reportPhotos = []
  renderReportForm()
}

function renderReportForm() {
  if (_reportStep === 1) {
    const types = [
      { value: 'infrastructure', label: '🏗️ 基础设施', desc: '道路、路灯、水电等' },
      { value: 'environment', label: '🧹 环境卫生', desc: '垃圾、污水、绿化等' },
      { value: 'safety', label: '⚠️ 安全隐患', desc: '井盖、电线、消防等' },
      { value: 'agriculture', label: '🌾 农业生产', desc: '灌溉、虫害、施肥等' },
      { value: 'elderly', label: '👴 老人关怀', desc: '独居老人、困难户等' },
      { value: 'other', label: '📌 其他事项', desc: '其他需要上报的问题' }
    ]
    let h = '<div style="padding:12px 0"><h4 style="color:#fff;margin:0 0 4px 0;font-size:14px">📝 事件上报 — 第1步：选择问题类型</h4><p style="color:#6F91A8;font-size:11px;margin:0 0 14px 0">请选择您要上报的问题类型</p>'
    h += '<div style="display:flex;flex-direction:column;gap:8px">'
    types.forEach(t => {
      h += '<div onclick="window._svc.selectReportType(\\'' + t.value + '\\')" style="padding:12px 16px;background:rgba(10,36,68,0.55);border:1px solid rgba(40,199,111,0.12);border-radius:8px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:10px" onmouseover="this.style.background=\\'rgba(40,199,111,0.10)\\';this.style.borderColor=\\'rgba(40,199,111,0.30)\\'" onmouseout="this.style.background=\\'rgba(10,36,68,0.55)\\';this.style.borderColor=\\'rgba(40,199,111,0.12)\\'">'
      h += '<span style="font-size:13px;color:#D0E4F5;font-weight:600">' + t.label + '</span>'
      h += '<span style="font-size:10px;color:#6F91A8;margin-left:auto">' + t.desc + '</span>'
      h += '</div>'
    })
    h += '</div></div>'
    opMod('事件上报', h, 480)
  } else if (_reportStep === 2) {
    const typeLabels = { infrastructure: '🏗️ 基础设施', environment: '🧹 环境卫生', safety: '⚠️ 安全隐患', agriculture: '🌾 农业生产', elderly: '👴 老人关怀', other: '📌 其他事项' }
    let h = '<div style="padding:12px 0"><h4 style="color:#fff;margin:0 0 4px 0;font-size:14px">📝 事件上报 — 第2步：填写详情</h4><p style="color:#6F91A8;font-size:11px;margin:0 0 14px 0">类型：' + (typeLabels[_reportType] || _reportType) + '</p>'
    h += '<div style="margin-bottom:12px"><label style="display:block;font-size:11px;color:#B7D3E8;margin-bottom:4px">问题描述 <span style="color:#E74C3C">*</span></label>'
    h += '<textarea id="reportDescInput" placeholder="请详细描述您遇到的问题..." style="width:100%;height:100px;background:rgba(10,36,68,0.55);border:1px solid rgba(40,199,111,0.18);border-radius:6px;color:#D0E4F5;padding:8px 10px;font-size:12px;font-family:inherit;resize:vertical;box-sizing:border-box"></textarea></div>'
    h += '<div style="margin-bottom:12px"><label style="display:block;font-size:11px;color:#B7D3E8;margin-bottom:4px">发生地点 <span style="color:#E74C3C">*</span></label>'
    h += '<input id="reportLocInput" placeholder="例如：村东口路灯旁" style="width:100%;background:rgba(10,36,68,0.55);border:1px solid rgba(40,199,111,0.18);border-radius:6px;color:#D0E4F5;padding:8px 10px;font-size:12px;font-family:inherit;box-sizing:border-box" /></div>'
    h += '<div style="margin-bottom:12px"><label style="display:block;font-size:11px;color:#B7D3E8;margin-bottom:4px">现场照片（最多3张，选填）</label>'
    h += '<div style="display:flex;gap:8px;flex-wrap:wrap"><div onclick="window._svc.addReportPhoto()" style="width:64px;height:64px;border:1px dashed rgba(40,199,111,0.30);border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:24px;color:#6F91A8;transition:all 0.2s" onmouseover="this.style.borderColor=\\'#39D98A\\';this.style.color=\\'#39D98A\\'" onmouseout="this.style.borderColor=\\'rgba(40,199,111,0.30)\\';this.style.color=\\'#6F91A8\\'">📷</div>'
    for (let i = 0; i < _reportPhotos.length; i++) {
      h += '<div style="width:64px;height:64px;background:rgba(10,36,68,0.55);border:1px solid rgba(40,199,111,0.18);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;position:relative">📸<span onclick="window._svc.removeReportPhoto(' + i + ')" style="position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:#E74C3C;color:#fff;font-size:10px;display:flex;align-items:center;justify-content:center;cursor:pointer">✕</span></div>'
    }
    h += '</div></div>'
    h += '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px">'
    h += '<button class="btn btn-outline" onclick="window._svc.prevReportStep()">上一步</button>'
    h += '<button class="btn btn-primary" onclick="window._svc.submitReport()">提交上报</button>'
    h += '</div></div>'
    opMod('事件上报', h, 500)
  } else if (_reportStep === 3) {
    let h = '<div style="text-align:center;padding:24px 0"><div style="font-size:48px;margin-bottom:12px">✅</div>'
    h += '<h4 style="color:#39D98A;margin:0 0 8px 0;font-size:15px">上报成功！</h4>'
    h += '<p style="color:#B7D3E8;font-size:12px;margin:0 0 4px 0">您的事件已提交，网格员将尽快处理</p>'
    h += '<p style="color:#6F91A8;font-size:11px;margin:0 0 20px 0">事件编号：<span style="color:#28C7FA">#EV' + String(new Date().getMonth() + 1).padStart(2, '0') + String(new Date().getDate()).padStart(2, '0') + '</span></p>'
    h += '<button class="btn btn-primary" onclick="window._svc.closeAndRefresh()">查看我的上报</button></div>'
    opMod('事件上报', h, 420)
  }
}

function selectReportType(type) {
  _reportType = type
  _reportStep = 2
  renderReportForm()
}

function prevReportStep() {
  _reportStep = 1
  _reportType = ''
  renderReportForm()
}

function addReportPhoto() {
  if (_reportPhotos.length >= 3) { toast('最多上传3张照片', 'warn'); return }
  _reportPhotos.push({ name: 'photo_' + (_reportPhotos.length + 1) })
  renderReportForm()
  toast('照片已添加（演示）', 'info')
}

function removeReportPhoto(idx) {
  _reportPhotos.splice(idx, 1)
  renderReportForm()
}

function submitReport() {
  const descEl = document.getElementById('reportDescInput')
  const locEl = document.getElementById('reportLocInput')
  const desc = descEl ? descEl.value.trim() : ''
  const loc = locEl ? locEl.value.trim() : ''
  if (!desc) { toast('请填写问题描述', 'warn'); return }
  if (!loc) { toast('请填写发生地点', 'warn'); return }
  _reportDesc = desc
  _reportLocation = loc
  _reportStep = 3
  renderReportForm()
  toast('事件上报成功！', 'success')
}

function closeAndRefresh() {
  clsMod()
  showMyReports()
}

function showMyReports() {
  const el = document.querySelector('.page-content[key="governance"]')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  toast('共 ' + myEvents.length + ' 条上报记录', 'info')
}

function showMyEventDetail(e) {
  const statusColors = { '处理中': '#f59e0b', '已办结': '#39D98A', '已驳回': '#E74C3C', '已提交': '#28C7FA', '已受理': '#28C7FA' }
  let timelineHtml = ''
  if (e.timeline && e.timeline.length > 0) {
    timelineHtml = '<div class="detail-section"><h4>流转记录</h4><div style="position:relative;padding-left:16px">'
    e.timeline.forEach((t, i) => {
      const isLast = i === e.timeline.length - 1
      const color = statusColors[t.status] || '#6F91A8'
      timelineHtml += '<div style="position:relative;padding-bottom:' + (isLast ? '0' : '16px') + '">'
      if (!isLast) timelineHtml += '<div style="position:absolute;left:-13px;top:8px;bottom:-8px;width:2px;background:rgba(40,199,111,0.12)"></div>'
      timelineHtml += '<div style="position:absolute;left:-16px;top:4px;width:8px;height:8px;border-radius:50%;background:' + color + ';box-shadow:0 0 6px ' + color + '"></div>'
      timelineHtml += '<div style="font-size:11px;color:#6F91A8;margin-bottom:2px">' + t.time + '</div>'
      timelineHtml += '<div style="font-size:12px;color:#D0E4F5"><span style="color:' + color + ';font-weight:600">' + t.status + '</span> · ' + t.desc + '</div>'
      timelineHtml += '</div>'
    })
    timelineHtml += '</div></div>'
  }
  const c = '<div class="detail-section"><h4>事件详情</h4><div class="detail-field"><span class="df-lbl">事件编号</span><span class="df-val">' + e.id + '</span></div><div class="detail-field"><span class="df-lbl">事项类型</span><span class="df-val">' + e.type + '</span></div><div class="detail-field"><span class="df-lbl">发生地点</span><span class="df-val">' + e.location + '</span></div><div class="detail-field"><span class="df-lbl">上报时间</span><span class="df-val">' + e.time + '</span></div><div class="detail-field"><span class="df-lbl">当前状态</span><span class="df-val"><span class="st ' + e.statusCls + '">' + e.status + '</span></span></div></div>' + timelineHtml + '<div class="detail-actions"><button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">关闭</button></div>'
  openDetail('事件 ' + e.id, c)
}

function showGridWorkerInfo() {
  const gw = gridWorker
  const c = '<div style="text-align:center;padding:12px 0"><div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#28C7FA,#39D98A);display:inline-flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:#fff;margin-bottom:10px">' + gw.avatar + '</div><h4 style="color:#fff;margin:0 0 2px 0;font-size:15px">' + gw.name + '</h4><p style="color:#28C7FA;font-size:11px;margin:0 0 12px 0">' + gw.role + '</p></div><div class="detail-section"><h4>基本信息</h4><div class="detail-field"><span class="df-lbl">联系电话</span><span class="df-val">' + gw.phone + '</span></div><div class="detail-field"><span class="df-lbl">所属网格</span><span class="df-val">' + gw.grid + '</span></div><div class="detail-field"><span class="df-lbl">管辖范围</span><span class="df-val">' + gw.area + '</span></div><div class="detail-field"><span class="df-lbl">任职时间</span><span class="df-val">' + gw.dutyStart + '</span></div></div><div class="detail-section"><h4>工作概况</h4><p style="font-size:11px;color:#B7D3E8;line-height:1.6">' + gw.desc + '</p></div><div class="detail-section"><h4>工作统计</h4><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div style="text-align:center;padding:8px;background:rgba(10,36,68,0.55);border-radius:6px"><div style="font-size:18px;font-weight:700;color:#28C7FA">' + gw.stats.patrols + '</div><div style="font-size:10px;color:#6F91A8">巡查次数</div></div><div style="text-align:center;padding:8px;background:rgba(10,36,68,0.55);border-radius:6px"><div style="font-size:18px;font-weight:700;color:#39D98A">' + gw.stats.events + '</div><div style="font-size:10px;color:#6F91A8">受理事件</div></div><div style="text-align:center;padding:8px;background:rgba(10,36,68,0.55);border-radius:6px"><div style="font-size:18px;font-weight:700;color:#39D98A">' + gw.stats.resolved + '</div><div style="font-size:10px;color:#6F91A8">已办结</div></div><div style="text-align:center;padding:8px;background:rgba(10,36,68,0.55);border-radius:6px"><div style="font-size:18px;font-weight:700;color:#f59e0b">' + gw.stats.satisfaction + '%</div><div style="font-size:10px;color:#6F91A8">满意度</div></div></div></div><div class="detail-actions"><button class="btn btn-primary" onclick="window._svc.callGridWorker()">📞 拨打电话</button><button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">关闭</button></div>'
  opMod('👤 网格员信息', c, 460)
}

function callGridWorker() {
  toast('正在拨打 ' + gridWorker.name + ' 电话：' + gridWorker.phone, 'info')
}

function showVillageNotices() {
  let h = '<div style="padding:8px 0"><h4 style="color:#fff;margin:0 0 12px 0;font-size:14px">📢 村务公告</h4>'
  villageNotices.forEach(n => {
    h += '<div onclick="window._svc.showNoticeDetailById(\\'' + n.id + '\\')" style="padding:10px 12px;background:rgba(10,36,68,0.55);border-radius:6px;margin-bottom:6px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:10px" onmouseover="this.style.background=\\'rgba(40,199,111,0.10)\\'" onmouseout="this.style.background=\\'rgba(10,36,68,0.55)\\'">'
    h += '<span style="font-size:20px">' + n.icon + '</span>'
    h += '<div style="flex:1"><div style="font-size:12px;color:#D0E4F5;font-weight:600">' + n.title + '</div><div style="font-size:10px;color:#6F91A8">' + n.date + ' · ' + n.source + '</div></div>'
    h += '<span style="font-size:10px;color:#28C7FA">查看 →</span>'
    h += '</div>'
  })
  h += '</div>'
  opMod('村务公告', h, 480)
}

function showNoticeDetailById(id) {
  const n = villageNotices.find(x => x.id === id)
  if (n) showNoticeDetail(n)
}

function showNoticeDetail(n) {
  const c = '<div class="detail-section"><h4>' + n.icon + ' ' + n.title + '</h4><div class="detail-field"><span class="df-lbl">发布日期</span><span class="df-val">' + n.date + '</span></div><div class="detail-field"><span class="df-lbl">发布来源</span><span class="df-val">' + n.source + '</span></div></div><div class="detail-section"><h4>公告内容</h4><p style="font-size:11px;color:#B7D3E8;line-height:1.6">详情请到村委会公告栏或通过村级服务平台查看完整内容。如有疑问请联系网格员或拨打村委会电话。</p></div><div class="detail-actions"><button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">关闭</button></div>'
  opMod('村务公告详情', c, 420)
}

// Update chatbot message for farmer context
const chatMessages = reactive([
  { role: 'ai', text: '👋 您好！我是中堰村AI助手，您可以问我：<br>• 我上报的事件处理进度如何？  • 村里最近有什么通知？<br>• 我的网格员是谁？  • 今年的惠农政策有哪些？' }
])`;

if (s.includes(oldChatbotSection)) {
  s = s.replace(oldChatbotSection, newGovFunctions);
  check('7-govFunctions', true);
} else { check('7-govFunctions', false); }

// ===== 8. Register _svc handlers on window =====
const oldWindowHandlers = `  window._toast = toast
  window._closeModal = closeModal`;
const newWindowHandlers = `  window._toast = toast
  window._closeModal = closeModal
  window._svc = {
    selectReportType, prevReportStep, addReportPhoto, removeReportPhoto,
    submitReport, closeAndRefresh, callGridWorker, showNoticeDetailById,
    toast, openResource: function(url) { toast('打开资源：' + url, 'info') }
  }`;
if (s.includes(oldWindowHandlers)) {
  s = s.replace(oldWindowHandlers, newWindowHandlers);
  check('8-windowHandlers', true);
} else { check('8-windowHandlers', false); }

// ===== Write =====
fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== GOVERNANCE OVERHAUL FINAL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
