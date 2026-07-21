<template>
  <div class="svc-page">
    <!-- ===== HEADER ===== -->
    <header class="hdr">
      <div class="hdr-l">
        <router-link to="/dashboard">&#x25C0; 返回驾驶舱</router-link> &#x1F91D; 数字服务中心
      </div>
      <div class="hdr-r">
        <router-link to="/">&#x1F3E0; 首页</router-link>
        <span>{{ clock }}</span>
      </div>
    </header>

    <!-- ===== TAB BAR ===== -->
    <div class="tab-bar">
      <button
        v-for="t in tabs"
        :key="t.key"
        :class="['tab-btn', { on: curTab === t.key }]"
        @click="switchTab(t.key)"
      >{{ t.icon }} {{ t.label }}</button>
    </div>

    <!-- ===== MAIN CONTENT ===== -->
    <div class="main-content">
      <div class="content" :key="curTab">
        <!-- Breadcrumb -->
        <div class="bc">
          <router-link to="/">首页</router-link> / <span>数字服务中心</span> /
          <span style="color:#fff">{{ activeTab.label }}</span>
        </div>
        <div class="pg-tt">{{ activeTab.label }}</div>

        <!-- 1. KPI STATS -->
        <div class="srow">
          <div
            v-for="(s, i) in kpiCards"
            :key="i"
            class="scard"
            :class="s.cls"
            @click="s.onClick ? s.onClick() : undefined"
          >
            <div class="sv">{{ s.value }}</div>
            <div class="sl">{{ s.label }}</div>
          </div>
        </div>

        <!-- 2. QUICK ACTIONS -->
        <div class="panel">
          <div class="tt">&#x26A1; 快捷操作</div>
          <div class="act-group">
            <button
              v-for="(a, i) in quickActions"
              :key="i"
              :class="['act-btn', a.cls || '']"
              @click="a.handler()"
            >{{ a.label }}</button>
          </div>
        </div>

        <!-- 3. BUSINESS CONTENT (Dual Column: Chart + List) -->
        <div class="grid2">
          <!-- Insurance -->
          <template v-if="curTab === 'insurance'">
            <div class="panel">
              <div class="tt">&#x1F4C8; 报销趋势（近6个月）</div>
              <div id="chart_ins_trend" style="height:200px"></div>
            </div>
            <div class="panel">
              <div class="tt">&#x1F3E5; 最近就诊记录</div>
              <div style="max-height:200px;overflow-y:auto">
                <div
                  v-for="r in insurance"
                  :key="r.id"
                  class="tl-item"
                  @click="toast('查看完整病历','info')"
                >
                  <div class="tl-dot g"></div>
                  <div class="tl-content">
                    <div class="tlt">{{ r.hospital }} — {{ r.diagnosis }}</div>
                    <div class="tld">{{ r.lastVisit }} | 报销：{{ r.reimburse }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Subsidy -->
          <template v-if="curTab === 'subsidy'">
            <div class="panel">
              <div class="tt">&#x1F4CA; 补贴分类统计</div>
              <div id="chart_sub_pie" style="height:200px"></div>
            </div>
            <div class="panel">
              <div class="tt">&#x1F4CB; 申请进度</div>
              <div style="max-height:200px;overflow-y:auto">
                <div
                  v-for="r in subsidy"
                  :key="r.id"
                  style="margin-bottom:10px;cursor:pointer"
                  @click="toast('查看申请详情','info')"
                >
                  <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px">
                    <span style="color:#fff;font-weight:600">{{ r.name }} — {{ r.type }}</span>
                    <span :class="['tag', r.status === '已发放' ? 'g' : 'y']">{{ r.status }}</span>
                  </div>
                  <div class="progress-bar">
                    <div
                      :class="['fill', r.status === '已发放' ? 'g' : 'y']"
                      :style="{ width: (parseInt(r.progress) || 0) + '%' }"
                    ></div>
                  </div>
                  <div style="font-size:10px;color:#6F91A8;margin-top:2px">
                    ¥{{ r.amount.toLocaleString() }} | {{ r.date }}
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Elderly -->
          <template v-if="curTab === 'elderly'">
            <div class="panel">
              <div class="tt">&#x1F4E1; 实时监测面板</div>
              <div id="chart_elder_health" style="height:200px"></div>
            </div>
            <div class="panel">
              <div class="tt">&#x26A0;&#xFE0F; 异常告警</div>
              <div class="alert-feed">
                <div
                  v-for="r in elderly"
                  :key="r.id"
                  :class="['alert-row', r.status === '重点关注' ? 'danger' : r.status === '需关注' ? 'warn' : '']"
                  @click="toast('查看' + r.name + '详情','info')"
                >
                  <span class="ar-icon">{{ r.status === '重点关注' ? '&#x1F534;' : r.status === '需关注' ? '&#x1F7E1;' : '&#x1F7E2;' }}</span>
                  <div class="ar-body">
                    <div style="color:#fff;font-weight:600">{{ r.name }} — {{ r.health }}</div>
                    <div style="font-size:10px;color:#6F91A8">心率：{{ r.heartRate }} | 睡眠：{{ r.sleep }} | {{ r.lastActive }}</div>
                  </div>
                  <span class="ar-time">{{ r.lastActive }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- Telemed -->
          <template v-if="curTab === 'telemed'">
            <div class="panel">
              <div class="tt">&#x1F4CA; 科室分布</div>
              <div id="chart_tele_pie" style="height:200px"></div>
            </div>
            <div class="panel">
              <div class="tt">&#x1F468;&#x200D;&#x2695;&#xFE0F; 今日排班</div>
              <div style="max-height:200px;overflow-y:auto">
                <div
                  v-for="doc in doctorSchedule"
                  :key="doc.doctor"
                  class="tl-item"
                  @click="toast('预约' + doc.doctor,'info')"
                >
                  <div :class="['tl-dot', doc.avail === '可预约' ? 'g' : 'r']"></div>
                  <div class="tl-content">
                    <div class="tlt">{{ doc.doctor }} — {{ doc.dept }}</div>
                    <div class="tld">{{ doc.time }} | 剩余号源：{{ doc.slots || '已满' }}</div>
                  </div>
                  <span :class="['tag', doc.avail === '可预约' ? 'g' : 'r']" style="flex-shrink:0">{{ doc.avail }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- Training -->
          <template v-if="curTab === 'training'">
            <div class="panel">
              <div class="tt">&#x1F4C8; 报名趋势 &amp; 课程热度</div>
              <div id="chart_train_bar" style="height:200px"></div>
            </div>
            <div class="panel">
              <div class="tt">&#x1F4C5; 近期课程</div>
              <div style="max-height:200px;overflow-y:auto">
                <div
                  v-for="r in training"
                  :key="r.id"
                  class="tl-item"
                  @click="showTrainingDetail(r)"
                >
                  <div :class="['tl-dot', r.status === '报名中' ? 'g' : 'y']"></div>
                  <div class="tl-content">
                    <div class="tlt">{{ r.title }}</div>
                    <div class="tld">{{ r.teacher }} | {{ r.date }} {{ r.time }} | {{ r.loc }}</div>
                    <div class="tltm">{{ r.duration }} | {{ r.type }}</div>
                  </div>
                  <span :class="['tag', r.status === '报名中' ? 'g' : 'dim']" style="flex-shrink:0;margin-left:4px">{{ r.joined }}/{{ r.limit }}人</span>
                </div>
              </div>
            </div>
          </template>

          <!-- Appointment -->
          <template v-if="curTab === 'appointment'">
            <div class="panel">
              <div class="tt">&#x1F4CA; 服务类型分布</div>
              <div id="chart_appt_pie" style="height:200px"></div>
            </div>
            <div class="panel">
              <div class="tt">&#x1F4C5; 预约日历</div>
              <!-- Lunar Calendar -->
              <div class="cal-wrap">
                <div class="cal-month-row">
                  <span class="cal-arrow" @click="calShift(-1)">&#8249;</span>
                  <span class="cal-month-text">{{ calYear }}年{{ calMonth + 1 }}月</span>
                  <span class="cal-arrow" @click="calShift(1)">&#8250;</span>
                </div>
                <div class="cal-week-bar">
                  <span class="we">日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span class="we">六</span>
                </div>
                <div class="cal-grid">
                  <div
                    v-for="(cell, idx) in calendarDays"
                    :key="idx"
                    :class="cell.cls"
                    @click="cell.clickable ? calPickDay(cell.year, cell.month, cell.day) : undefined"
                  >
                    <span class="cnum">{{ cell.day }}</span>
                    <span v-if="cell.lunar" :class="cell.lunarCls">{{ cell.lunar }}</span>
                    <span v-if="cell.hasAppt" class="cdot"></span>
                  </div>
                </div>
                <div class="cal-legends">
                  <span><span class="ldot g"></span>可预约</span>
                  <span><span class="ldot d"></span>已约满</span>
                  <span><span class="ldot b"></span>今日</span>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- 4. DATA TABLE -->
        <div class="panel">
          <div class="tt">
            &#x1F4CB; {{ activeTab.label }}档案
            <span style="font-size:10px;color:#6F91A8;font-weight:400;margin-left:8px">共 {{ filteredData.length }} 条</span>
          </div>
          <div class="toolbar-row">
            <button class="btn btn-p btn-s" @click="showAddForm">&#x2795; 新增</button>
            <button class="btn btn-o btn-s" @click="exportCSV">&#x1F4E4; 导出CSV</button>
            <span class="spacer"></span>
            <input
              v-model="filterText"
              placeholder="&#x1F50D; 搜索..."
              @input="pageNum = 1"
            >
          </div>
          <table>
            <thead>
              <tr>
                <th v-for="col in tableColumns" :key="col.label">{{ col.label }}</th>
                <th style="width:80px">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="r in pagedData"
                :key="r.id"
                @click="showDetail(r)"
              >
                <td v-for="col in tableColumns" :key="col.label" v-html="formatCell(col.key, r)"></td>
                <td>
                  <button class="btn btn-s btn-p" @click.stop="showEditForm(r)">编辑</button>
                  <button class="btn btn-s btn-d" @click.stop="delItem(r)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pg">
            <span style="color:#6F91A8">{{ pageNum }}/{{ totalPagesCount }} 页</span>
            <button
              v-for="p in totalPagesCount"
              :key="p"
              class="pg-btn"
              :style="{ color: p === pageNum ? '#28C76F' : '', fontWeight: p === pageNum ? '600' : '' }"
              @click="pageNum = p"
            >{{ p }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MODAL ===== -->
    <div v-if="modal.show" class="modal-overlay" @click.self="clsMod">
      <div class="modal-box">
        <button class="modal-close-btn" @click="clsMod">&#x2715;</button>
        <h3>{{ modal.title }}</h3>
        <div v-html="modal.body"></div>
      </div>
    </div>

    <!-- ===== TOAST ===== -->
    <div class="toast-area">
      <div
        v-for="t in toasts"
        :key="t.id"
        :class="['toast', t.type]"
      >{{ t.msg }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'

// ===== UTILS =====
let uidCounter = 200
function uid() { return ++uidCounter }

const clock = ref('')
let clockTimer = null
onMounted(() => {
  clockTimer = setInterval(() => {
    const d = new Date()
    clock.value = String(d.getHours()).padStart(2, '0') + ':' +
      String(d.getMinutes()).padStart(2, '0') + ':' +
      String(d.getSeconds()).padStart(2, '0')
  }, 1000)
})
onUnmounted(() => { clearInterval(clockTimer) })

// ===== TOAST =====
const toasts = ref([])
function toast(msg, type) {
  type = type || 'info'
  const id = Date.now() + Math.random()
  toasts.value.push({ id, msg, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 2300)
}

// ===== MODAL =====
const modal = reactive({ show: false, title: '', body: '' })
function opMod(title, body) {
  modal.title = title
  modal.body = body
  modal.show = true
}
function clsMod() { modal.show = false }

// ===== TABS =====
const tabs = [
  { key: 'insurance', label: '医保社保查询', icon: '\u{1F4C4}', color: 'b' },
  { key: 'subsidy',   label: '补贴申请',     icon: '\u{1F4B0}', color: 'g' },
  { key: 'elderly',   label: '老人关爱系统', icon: '\u{1F474}', color: 'r' },
  { key: 'telemed',   label: '远程医疗',     icon: '\u{1F3E5}', color: 'p' },
  { key: 'training',  label: '农技培训',     icon: '\u{1F393}', color: 'y' },
  { key: 'appointment', label: '政务预约',    icon: '\u{1F4C5}', color: 'b' }
]
const curTab = ref('insurance')
const filterText = ref('')
const pageNum = ref(1)
const pageSize = 6

const activeTab = computed(() => tabs.find(t => t.key === curTab.value) || tabs[0])

function switchTab(key) {
  curTab.value = key
  pageNum.value = 1
  filterText.value = ''
}

// ===== MOCK DATA =====
const insurance = reactive([
  { id: 1, name: '张大爷', idCard: '610***********0012', medType: '城乡居民医保', medStatus: '正常参保', medBalance: '¥1,280', penStatus: '正常领取', penMonthly: '¥300', lastVisit: '2026-05-20', hospital: '安康市人民医院', diagnosis: '高血压复查', reimburse: '¥860' },
  { id: 2, name: '李婶',   idCard: '610***********0023', medType: '城乡居民医保', medStatus: '正常参保', medBalance: '¥960',   penStatus: '正常领取', penMonthly: '¥240', lastVisit: '2026-06-10', hospital: '汉滨区中医院',   diagnosis: '腰椎间盘突出', reimburse: '¥1,250' },
  { id: 3, name: '王大爷', idCard: '610***********0034', medType: '职工医保',     medStatus: '正常参保', medBalance: '¥3,520', penStatus: '正常领取', penMonthly: '¥2,400', lastVisit: '2026-04-15', hospital: '安康市中心医院', diagnosis: '糖尿病随访',   reimburse: '¥1,680' },
  { id: 4, name: '赵大哥', idCard: '610***********0045', medType: '城乡居民医保', medStatus: '正常参保', medBalance: '¥720',   penStatus: '参保中',   penMonthly: '-',     lastVisit: '2026-06-01', hospital: '汉滨区人民医院', diagnosis: '感冒发烧',     reimburse: '¥180' }
])

const subsidy = reactive([
  { id: 1, name: '张大爷', type: '耕地地力保护补贴', amount: 1200, status: '已发放', date: '2026-03-20', progress: '100%' },
  { id: 2, name: '李婶',   type: '农机购置补贴',     amount: 5000, status: '已发放', date: '2026-04-10', progress: '100%' },
  { id: 3, name: '王大爷', type: '低保补助',         amount: 3600, status: '发放中', date: '2026-01-01', progress: '80%' },
  { id: 4, name: '赵大哥', type: '耕地地力保护补贴', amount: 3000, status: '审核中', date: '2026-06-01', progress: '45%' },
  { id: 5, name: '肖子微', type: '创业补贴',         amount: 8000, status: '审核中', date: '2026-06-10', progress: '20%' }
])

const elderly = reactive([
  { id: 1, name: '张奶奶', age: 82, gender: '女', addr: '2组', type: '独居', device: '智能手环', status: '正常', lastActive: '10分钟前', health: '高血压、关节炎', heartRate: '72bpm', sleep: '6.5h' },
  { id: 2, name: '王奶奶', age: 85, gender: '女', addr: '3组', type: '独居', device: '无',       status: '需关注', lastActive: '2小时前',  health: '心脏病',         heartRate: '88bpm', sleep: '4.2h' },
  { id: 3, name: '周爷爷', age: 91, gender: '男', addr: '3组', type: '独居', device: '智能手环', status: '重点关注', lastActive: '30分钟前', health: '心脏病、糖尿病', heartRate: '95bpm', sleep: '5.1h' }
])

const telemed = reactive([
  { id: 1, patient: '张奶奶', doctor: '张医生', dept: '内科',   date: '2026-06-18', time: '14:30', type: '视频问诊', diagnosis: '高血压调整用药', status: '已完成', prescription: '硝苯地平 30mg qd' },
  { id: 2, patient: '李婶',   doctor: '李医生', dept: '骨科',   date: '2026-06-20', time: '10:00', type: '在线复诊', diagnosis: '待诊断',         status: '待就诊', prescription: '-' },
  { id: 3, patient: '王大爷', doctor: '王医生', dept: '心内科', date: '2026-06-15', time: '09:00', type: '视频问诊', diagnosis: '冠心病随访',     status: '已完成', prescription: '阿司匹林 100mg qd' }
])

const training = reactive([
  { id: 1, title: '苹果夏季修剪技术培训', teacher: '县植保站 陈老师', date: '2026-07-02', time: '14:30', joined: 18, limit: 50, status: '报名中', loc: '苹果园区A区', duration: '2小时', type: '线下实操' },
  { id: 2, title: '电商直播带货实战',     teacher: '电商中心 刘老师', date: '2026-07-15', time: '10:00', joined: 25, limit: 40, status: '报名中', loc: '村委会会议室', duration: '3小时', type: '线下讲座' },
  { id: 3, title: '智慧农业应用培训',     teacher: '黄雪琳书记',       date: '2026-07-25', time: '09:00', joined: 20, limit: 50, status: '报名中', loc: '村委会会议室', duration: '半天', type: '线下+线上' }
])

const appointment = reactive([
  { id: 1, name: '张大爷', type: '证件办理', item: '身份证换领',     date: '2026-06-20', time: '09:00-10:00', status: '已预约', office: '户籍窗口' },
  { id: 2, name: '李婶',   type: '补贴申请', item: '农业补贴咨询',   date: '2026-06-19', time: '10:00-11:00', status: '已完成', office: '农业窗口' },
  { id: 3, name: '赵大哥', type: '证明开具', item: '农业用地证明',   date: '2026-06-21', time: '14:00-15:00', status: '已预约', office: '综合窗口' }
])

const dataMap = { insurance, subsidy, elderly, telemed, training, appointment }
const currentData = computed(() => dataMap[curTab.value] || [])

// ===== 1. KPI CARDS =====
const kpiCards = computed(() => {
  const arr = currentData.value
  const key = curTab.value
  if (key === 'insurance') {
    const insuredCount = arr.filter(x => x.medStatus === '正常参保').length
    const totalReimburse = arr.reduce((s, x) => s + (parseFloat(String(x.reimburse).replace('¥', '')) || 0), 0)
    return [
      { label: '累计参保人数', value: insuredCount + '人', cls: '', onClick: () => toast('查看参保详情', 'info') },
      { label: '医保覆盖率', value: '98.5%', cls: 'g', onClick: () => toast('医保覆盖率98.5%', 'info') },
      { label: '本月报销次数', value: arr.filter(x => x.lastVisit !== '-').length + '次', cls: 'y' },
      { label: '累计报销金额', value: '¥' + totalReimburse.toLocaleString(), cls: 'g' }
    ]
  }
  if (key === 'subsidy') {
    const done = arr.filter(x => x.status === '已发放').length
    const pending = arr.filter(x => x.status === '审核中' || x.status === '发放中').length
    const totalAmt = arr.reduce((s, x) => s + x.amount, 0)
    const rate = Math.round(done / arr.length * 100)
    return [
      { label: '已发放', value: done + '项', cls: 'g', onClick: () => toast('查看已发放明细', 'info') },
      { label: '进行中', value: pending + '项', cls: 'y' },
      { label: '补贴总额', value: '¥' + totalAmt.toLocaleString(), cls: 'g' },
      { label: '发放率', value: rate + '%', cls: '' }
    ]
  }
  if (key === 'elderly') {
    const focusCount = arr.filter(x => x.status === '重点关注' || x.status === '需关注').length
    const aloneCount = arr.filter(x => x.type === '独居').length
    const deviceCount = arr.filter(x => x.device !== '无').length
    return [
      { label: '关怀对象', value: arr.length + '人', cls: '', onClick: () => toast('关怀对象详情', 'info') },
      { label: '重点关注', value: focusCount + '人', cls: 'r' },
      { label: '独居老人', value: aloneCount + '人', cls: 'y' },
      { label: '在线设备', value: deviceCount + '台', cls: 'g' }
    ]
  }
  if (key === 'telemed') {
    const doneCount = arr.filter(x => x.status === '已完成').length
    const waiting = arr.filter(x => x.status === '待就诊').length
    return [
      { label: '问诊总量', value: arr.length + '次', cls: '' },
      { label: '已完成', value: doneCount + '次', cls: 'g' },
      { label: '待就诊', value: waiting + '次', cls: 'y' },
      { label: '在线医生', value: '3人', cls: 'p' }
    ]
  }
  if (key === 'training') {
    const totalJoined = arr.reduce((s, x) => s + x.joined, 0)
    const enrolling = arr.filter(x => x.status === '报名中').length
    return [
      { label: '培训课程', value: arr.length + '门', cls: '' },
      { label: '已报名', value: totalJoined + '人', cls: 'g' },
      { label: '报名中', value: enrolling + '门', cls: 'y' },
      { label: '本月已完成', value: '2场', cls: '' }
    ]
  }
  if (key === 'appointment') {
    const doneCount = arr.filter(x => x.status === '已完成').length
    const waiting = arr.filter(x => x.status === '已预约').length
    return [
      { label: '预约总量', value: arr.length + '项', cls: '' },
      { label: '已办结', value: doneCount + '项', cls: 'g' },
      { label: '待办理', value: waiting + '项', cls: 'y' },
      { label: '平均办结时间', value: '1.5天', cls: '', onClick: () => toast('平均用时1.5个工作日', 'info') }
    ]
  }
  return []
})

// ===== 2. QUICK ACTIONS =====
const quickActions = computed(() => {
  const key = curTab.value
  const actions = {
    insurance: [
      { label: '\u{1F4B3} 查询余额', cls: 'primary', handler: showInsuranceBalance },
      { label: '\u{1F4CB} 报销申请', cls: '', handler: showReimburseForm },
      { label: '\u{1F3E5} 在线挂号', cls: '', handler: showHospitalReg },
      { label: '\u{1F4C4} 缴费记录', cls: '', handler: showPaymentHistory },
      { label: '\u{1F310} 异地就医', cls: '', handler: () => toast('异地就医备案：请携带身份证到村委会办理', 'info') }
    ],
    subsidy: [
      { label: '\u{1F4DD} 申请补贴', cls: 'primary', handler: () => showAddForm() },
      { label: '\u{1F50D} 查询进度', cls: '', handler: showSubsidyProgress },
      { label: '\u{2705} 资格预审', cls: '', handler: () => toast('资格预审：请填写耕地面积+作物类型信息', 'info') },
      { label: '\u{1F4CB} 政策文件', cls: 'warn', handler: downloadPolicy }
    ],
    elderly: [
      { label: '\u{1F198} 一键呼叫', cls: 'primary', handler: emergencyCall },
      { label: '\u{1F4CD} 位置查看', cls: '', handler: showElderlyLocation },
      { label: '\u{1F4CA} 健康报告', cls: '', handler: showHealthReport },
      { label: '\u{26A0}\u{FE0F} 异常处置', cls: 'danger', handler: dispatchAlert },
      { label: '\u{2795} 添加关怀对象', cls: '', handler: () => { curTab.value = 'elderly'; showAddForm() } }
    ],
    telemed: [
      { label: '\u{1F4F9} 预约问诊', cls: 'primary', handler: showTelemedForm },
      { label: '\u{25B6}\u{FE0F} 进入诊室', cls: '', handler: enterVideoRoom },
      { label: '\u{1F4CB} 查看病历', cls: '', handler: showMedicalRecords },
      { label: '\u{1F48A} 处方查询', cls: '', handler: showPrescriptions }
    ],
    training: [
      { label: '\u{1F4DD} 报名培训', cls: 'primary', handler: () => { curTab.value = 'training'; showAddForm() } },
      { label: '\u{25B6}\u{FE0F} 观看直播', cls: '', handler: enterLiveRoom },
      { label: '\u{1F4FA} 课程回放', cls: '', handler: showReplayList },
      { label: '\u{1F3A4} 专家答疑', cls: 'warn', handler: askExpert }
    ],
    appointment: [
      { label: '\u{1F4C5} 在线预约', cls: 'primary', handler: showApptForm },
      { label: '\u{1F50D} 查询进度', cls: '', handler: showApptProgress },
      { label: '\u{1F4D6} 办事指南', cls: '', handler: downloadGuide },
      { label: '\u{1F4E5} 材料下载', cls: '', handler: downloadTemplate }
    ]
  }
  return actions[key] || []
})

// ===== 3. BUSINESS CONTENT: Doctor Schedule =====
const doctorSchedule = [
  { doctor: '张医生', dept: '内科', time: '08:00-17:00', avail: '可预约', slots: 3 },
  { doctor: '李医生', dept: '骨科', time: '09:00-18:00', avail: '可预约', slots: 2 },
  { doctor: '王医生', dept: '心内科', time: '08:30-16:30', avail: '已满', slots: 0 }
]

// ===== LUNAR CALENDAR =====
const LM = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊']
const LD = ['', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十']
const termMap = { '107': '小寒', '120': '大寒', '203': '立春', '218': '雨水', '305': '惊蛰', '320': '春分', '404': '清明', '419': '谷雨', '505': '立夏', '520': '小满', '605': '芒种', '621': '夏至', '706': '小暑', '722': '大暑', '807': '立秋', '822': '处暑', '907': '白露', '922': '秋分', '1008': '寒露', '1023': '霜降', '1107': '立冬', '1121': '小雪', '1207': '大雪', '1221': '冬至' }
const termNames = ['大', '小', '立', '雨', '春', '夏', '秋', '冬', '雪', '露', '霜', '蛰', '明', '满', '种', '暑']

function getLunar(d, m, y) {
  const moKey = String(m + 1).padStart(2, '0') + String(d).padStart(2, '0')
  if (termMap[moKey]) return termMap[moKey]
  const doy = Math.floor((new Date(y, m, d) - new Date(y, 0, 0)) / 86400000)
  const seed = doy * 7 + 13
  const ld = (seed % 30) + 1
  if (ld === 1) return LM[m % 12] + '月'
  return LD[ld] || ''
}

function isTermName(s) {
  return termNames.some(t => s.indexOf(t) >= 0)
}

const calYear = ref(new Date().getFullYear())
const calMonth = ref(new Date().getMonth())
const calSelected = ref(null)

const calendarDays = computed(() => {
  const y = calYear.value
  const m = calMonth.value
  const now = new Date()
  const today = now.getDate()
  const todayY = now.getFullYear()
  const todayM = now.getMonth()
  const firstDay = new Date(y, m, 1).getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const prevDays = new Date(y, m, 0).getDate()
  const apptDates = appointment.map(a => parseInt(a.date.split('-')[2]))
  const days = []

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevDays - i, lunar: '', lunarCls: 'clunar', hasAppt: false, cls: 'cal-cell other', year: y, month: m - 1, clickable: false })
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const lunar = getLunar(d, m, y)
    let cls = 'cal-cell'
    if (d === today && y === todayY && m === todayM) cls += ' today'
    if (calSelected.value && calSelected.value.d === d && calSelected.value.m === m && calSelected.value.y === y) cls += ' selected'
    let lunarCls = 'clunar'
    if (lunar && isTermName(lunar)) lunarCls = 'clunar term'
    const hasAppt = apptDates.indexOf(d) >= 0
    days.push({ day: d, lunar, lunarCls, hasAppt, cls, year: y, month: m, clickable: true })
  }
  return days
})

function calShift(dir) {
  let m = calMonth.value + dir
  if (m < 0) { m = 11; calYear.value-- }
  else if (m > 11) { m = 0; calYear.value++ }
  calMonth.value = m
  calSelected.value = null
}

function calPickDay(y, m, d) {
  calYear.value = y
  calMonth.value = m
  calSelected.value = { y, m, d }
  showDayAppts(y, m, d)
}

function showDayAppts(y, m, d) {
  const dateStr = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0')
  const arr = appointment.filter(a => a.date === dateStr)
  if (!arr.length) { toast(dateStr + ' 暂无预约', 'info'); return }
  let h = ''
  arr.forEach(a => {
    h += '<div style="background:rgba(57,217,138,0.05);border-radius:8px;padding:10px;margin-bottom:6px">' +
      '<div style="font-weight:600;color:#fff;font-size:12px">' + a.item + '</div>' +
      '<div style="font-size:10px;color:#6F91A8;margin-top:3px">' + a.name + ' | ' + a.time + ' | ' + a.office + '</div>' +
      '<span class="tag ' + (a.status === '已完成' ? 'g' : 'b') + '">' + a.status + '</span></div>'
  })
  opMod(dateStr + ' 预约列表', h)
}

// ===== 4. DATA TABLE =====
const filteredData = computed(() => {
  const arr = currentData.value
  if (!filterText.value) return arr
  const f = filterText.value.toLowerCase()
  return arr.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(f)))
})

const totalPagesCount = computed(() => Math.max(1, Math.ceil(filteredData.value.length / pageSize)))

const pagedData = computed(() => {
  return filteredData.value.slice((pageNum.value - 1) * pageSize, pageNum.value * pageSize)
})

const tableColumns = computed(() => {
  const key = curTab.value
  const defs = {
    insurance: [
      { label: '姓名', key: 'name' }, { label: '身份证号', key: 'idCard' },
      { label: '医保类型', key: 'medType' }, { label: '医保余额', key: 'medBalance' },
      { label: '养老金', key: 'penStatus' }, { label: '最近就诊', key: 'lastVisit' },
      { label: '报销金额', key: 'reimburse' }
    ],
    subsidy: [
      { label: '姓名', key: 'name' }, { label: '补贴类型', key: 'type' },
      { label: '金额', key: 'amount' }, { label: '状态', key: 'status' },
      { label: '日期', key: 'date' }
    ],
    elderly: [
      { label: '姓名', key: 'name' }, { label: '年龄', key: 'age' },
      { label: '性别', key: 'gender' }, { label: '地址', key: 'addr' },
      { label: '居住类型', key: 'type' }, { label: '设备', key: 'device' },
      { label: '状态', key: 'status' }, { label: '健康状况', key: 'health' }
    ],
    telemed: [
      { label: '患者', key: 'patient' }, { label: '医生', key: 'doctor' },
      { label: '科室', key: 'dept' }, { label: '时间', key: 'date' },
      { label: '类型', key: 'type' }, { label: '诊断', key: 'diagnosis' },
      { label: '状态', key: 'status' }
    ],
    training: [
      { label: '课程名称', key: 'title' }, { label: '讲师', key: 'teacher' },
      { label: '日期', key: 'date' }, { label: '报名/名额', key: 'joined' },
      { label: '地点', key: 'loc' }, { label: '状态', key: 'status' }
    ],
    appointment: [
      { label: '姓名', key: 'name' }, { label: '类型', key: 'type' },
      { label: '事项', key: 'item' }, { label: '预约时间', key: 'date' },
      { label: '状态', key: 'status' }
    ]
  }
  return defs[key] || []
})

function formatCell(colKey, r) {
  const key = curTab.value
  const v = r[colKey] !== undefined ? r[colKey] : '--'

  if (key === 'insurance') {
    if (colKey === 'medType') return '<span class="tag ' + (v === '职工医保' ? 'b' : 'g') + '">' + v + '</span>'
    if (colKey === 'medBalance') return '<span style="color:#28C76F">' + v + '</span>'
    if (colKey === 'penStatus') return '<span class="tag ' + (v === '正常领取' ? 'g' : 'y') + '">' + v + '</span>'
    if (colKey === 'reimburse') return '<span style="color:#28C76F">' + v + '</span>'
    if (colKey === 'penMonthly') return v
    if (colKey === 'lastVisit') return v
    if (colKey === 'hospital') return v
    if (colKey === 'diagnosis') return v
    return v
  }
  if (key === 'subsidy') {
    if (colKey === 'amount') return '<span style="color:#28C76F">¥' + Number(v).toLocaleString() + '</span>'
    if (colKey === 'status') {
      const cls = v === '已发放' ? 'g' : v === '审核中' ? 'y' : 'b'
      return '<span class="tag ' + cls + '">' + v + '</span>'
    }
    return v
  }
  if (key === 'elderly') {
    if (colKey === 'status') {
      const cls = v === '正常' ? 'g' : v === '重点关注' ? 'r' : 'y'
      return '<span class="tag ' + cls + '">' + v + '</span>'
    }
    return v
  }
  if (key === 'telemed') {
    if (colKey === 'status') return '<span class="tag ' + (v === '已完成' ? 'g' : 'y') + '">' + v + '</span>'
    if (colKey === 'date') return r.date + ' ' + (r.time || '')
    return v
  }
  if (key === 'training') {
    if (colKey === 'status') return '<span class="tag ' + (v === '报名中' ? 'g' : 'dim') + '">' + v + '</span>'
    if (colKey === 'joined') return r.joined + '/' + r.limit
    return v
  }
  if (key === 'appointment') {
    if (colKey === 'status') return '<span class="tag ' + (v === '已完成' ? 'g' : 'b') + '">' + v + '</span>'
    if (colKey === 'date') return r.date + ' ' + (r.time || '')
    return v
  }
  return v
}

// ===== CRUD =====
function getFields(key) {
  if (key === 'insurance') return [
    { n: '姓名', k: 'name' }, { n: '身份证号', k: 'idCard' },
    { n: '医保类型', k: 'medType', o: ['城乡居民医保', '职工医保'] },
    { n: '医保状态', k: 'medStatus', o: ['正常参保', '暂停参保'] },
    { n: '医保余额', k: 'medBalance' },
    { n: '养老金状态', k: 'penStatus', o: ['正常领取', '参保中', '暂停'] },
    { n: '月养老金', k: 'penMonthly' }, { n: '最近就诊日期', k: 'lastVisit' },
    { n: '就诊医院', k: 'hospital' }, { n: '诊断', k: 'diagnosis' },
    { n: '报销金额', k: 'reimburse' }
  ]
  if (key === 'subsidy') return [
    { n: '姓名', k: 'name' },
    { n: '补贴类型', k: 'type', o: ['耕地地力保护补贴', '农机购置补贴', '低保补助', '创业补贴'] },
    { n: '金额', k: 'amount', t: 'number' },
    { n: '状态', k: 'status', o: ['审核中', '发放中', '已发放'] },
    { n: '日期', k: 'date' }, { n: '进度', k: 'progress' }
  ]
  if (key === 'elderly') return [
    { n: '姓名', k: 'name' }, { n: '年龄', k: 'age', t: 'number' },
    { n: '性别', k: 'gender', o: ['男', '女'] }, { n: '地址', k: 'addr' },
    { n: '居住类型', k: 'type', o: ['独居', '与子女同住'] },
    { n: '设备', k: 'device', o: ['智能手环', '智能手表', '无'] },
    { n: '状态', k: 'status', o: ['正常', '需关注', '重点关注'] },
    { n: '健康状况', k: 'health' }, { n: '心率', k: 'heartRate' }, { n: '睡眠', k: 'sleep' }
  ]
  if (key === 'telemed') return [
    { n: '患者', k: 'patient' }, { n: '医生', k: 'doctor' },
    { n: '科室', k: 'dept', o: ['内科', '骨科', '心内科'] },
    { n: '日期', k: 'date' }, { n: '时间', k: 'time' },
    { n: '类型', k: 'type', o: ['视频问诊', '在线复诊'] },
    { n: '诊断', k: 'diagnosis' },
    { n: '状态', k: 'status', o: ['待就诊', '已完成'] },
    { n: '处方', k: 'prescription' }
  ]
  if (key === 'training') return [
    { n: '课程名称', k: 'title' }, { n: '讲师', k: 'teacher' },
    { n: '日期', k: 'date' }, { n: '时间', k: 'time' },
    { n: '已报名', k: 'joined', t: 'number' }, { n: '名额', k: 'limit', t: 'number' },
    { n: '状态', k: 'status', o: ['报名中', '进行中', '已结束'] },
    { n: '地点', k: 'loc' }, { n: '时长', k: 'duration' },
    { n: '类型', k: 'type', o: ['线下实操', '线下讲座', '线下+线上'] }
  ]
  if (key === 'appointment') return [
    { n: '姓名', k: 'name' },
    { n: '类型', k: 'type', o: ['证件办理', '补贴申请', '证明开具'] },
    { n: '事项', k: 'item' }, { n: '日期', k: 'date' },
    { n: '时间', k: 'time' },
    { n: '状态', k: 'status', o: ['已预约', '已完成'] },
    { n: '窗口', k: 'office' }
  ]
  return []
}

function showDetail(r) {
  const key = curTab.value
  const label = activeTab.value.label
  let h = '<dl style="display:grid;grid-template-columns:1fr 2fr;gap:4px 12px;font-size:12px;margin-bottom:14px">'
  Object.keys(r).forEach(k => {
    if (k !== 'id') h += '<dt style="color:#6F91A8">' + k + '</dt><dd style="color:#fff;font-weight:500">' + r[k] + '</dd>'
  })
  h += '</dl><div style="display:flex;gap:6px"><button class="btn btn-p btn-s" onclick="window._svc.editFromDetail(\'' + key + '\',' + r.id + ')">编辑</button><button class="btn btn-d btn-s" onclick="window._svc.delFromDetail(\'' + key + '\',' + r.id + ')">删除</button></div>'
  opMod(label + ' — ' + r.name, h)
}

function showAddForm() {
  const key = curTab.value
  const label = activeTab.value.label
  const fields = getFields(key)
  let h = ''
  fields.forEach(f => {
    h += '<div class="fld"><label>' + f.n + '</label>'
    if (f.o) {
      h += '<select id="ff_' + f.k + '">'
      f.o.forEach(o => { h += '<option>' + o + '</option>' })
      h += '</select>'
    } else {
      h += '<input id="ff_' + f.k + '" type="' + (f.t || 'text') + '" value="">'
    }
    h += '</div>'
  })
  h += '<div style="margin-top:12px"><button class="btn btn-p" onclick="window._svc.saveForm(\'' + key + '\',0)">保存</button> <button class="btn btn-o" onclick="window._svc.clsMod()">取消</button></div>'
  opMod('新增 ' + label, h)
}

function showEditForm(r) {
  const key = curTab.value
  const label = activeTab.value.label
  const fields = getFields(key)
  const item = r
  let h = ''
  fields.forEach(f => {
    h += '<div class="fld"><label>' + f.n + '</label>'
    if (f.o) {
      h += '<select id="ff_' + f.k + '">'
      f.o.forEach(o => { h += '<option ' + (item && item[f.k] === o ? 'selected' : '') + '>' + o + '</option>' })
      h += '</select>'
    } else {
      h += '<input id="ff_' + f.k + '" type="' + (f.t || 'text') + '" value="' + (item ? (item[f.k] || '') : '') + '">'
    }
    h += '</div>'
  })
  h += '<div style="margin-top:12px"><button class="btn btn-p" onclick="window._svc.saveForm(\'' + key + '\',' + (r ? r.id : 0) + ')">保存</button> <button class="btn btn-o" onclick="window._svc.clsMod()">取消</button></div>'
  opMod('编辑 ' + label, h)
}

function saveForm(key, editId) {
  const arr = dataMap[key]
  const fields = getFields(key)
  const obj = {}
  fields.forEach(f => {
    const el = document.getElementById('ff_' + f.k)
    obj[f.k] = el ? el.value : ''
  })
  if (editId) {
    const item = arr.find(x => x.id === editId)
    if (item) Object.assign(item, obj)
  } else {
    obj.id = uid()
    arr.unshift(obj)
  }
  clsMod()
  toast('已保存', 'ok')
}

function delItem(r) {
  if (!confirm('确定删除？')) return
  const arr = currentData.value
  const i = arr.findIndex(x => x.id === r.id)
  if (i >= 0) { arr.splice(i, 1); toast('已删除', 'ok') }
}

function downloadCSV(csv, filename) {
  if (window.showSaveFilePicker) {
    window.showSaveFilePicker({ suggestedName: filename, types: [{ description: 'CSV', accept: { 'text/csv': ['.csv'] } }] })
      .then(h => h.createWritable().then(w => w.write(csv).then(() => w.close())))
      .then(() => toast('导出成功', 'ok'))
      .catch(e => { if (e.name !== 'AbortError') { const b = new Blob([csv],{type:'text/csv;charset=utf-8'}); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = filename; a.click(); URL.revokeObjectURL(a.href); toast('导出成功', 'ok') } })
  } else {
    const b = new Blob([csv], { type: 'text/csv;charset=utf-8' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = filename; a.click(); URL.revokeObjectURL(a.href); toast('导出成功', 'ok')
  }
}
function exportCSV() {
  const arr = currentData.value
  const fields = getFields(curTab.value)
  if (!arr.length) { toast('无数据', 'warn'); return }
  let h = '﻿' + fields.map(f => f.n).join(',') + '\n'
  arr.forEach(r => { h += fields.map(f => { let v = r[f.k] || ''; if (typeof v === 'string' && v.includes(',')) v = '"' + v + '"'; return v }).join(',') + '\n' })
  downloadCSV(h, activeTab.value.label + '_' + new Date().toISOString().split('T')[0] + '.csv')
}

// ===== BUSINESS ACTION HANDLERS =====
function showInsuranceBalance() {
  let h = '<div class="fld"><label>身份证号</label><input id="bal_idcard" placeholder="请输入身份证号"></div>'
  h += '<button class="btn btn-p" style="margin-top:8px" onclick="window._svc.queryBalance()">查询</button>'
  opMod('\u{1F4B3} 医保余额查询', h)
}
function queryBalance() {
  const v = document.getElementById('bal_idcard').value
  if (!v) { toast('请输入身份证号', 'warn'); return }
  const r = insurance.find(x => x.idCard.includes(v.substring(0, 6)))
  if (r) { toast(r.name + ' — 医保余额：' + r.medBalance + ' | 养老金：' + r.penMonthly + '/月', 'ok') }
  else { toast('未找到记录', 'warn') }
  clsMod()
}

function showReimburseForm() {
  let h = '<div class="fld"><label>就诊医院</label><input id="rb_hosp" placeholder="请输入医院名称"></div>'
  h += '<div style="display:flex;gap:10px"><div class="fld" style="flex:1"><label>就诊日期</label><input id="rb_date" type="date"></div>'
  h += '<div class="fld" style="flex:1"><label>金额</label><input id="rb_amt" type="number" placeholder="¥"></div></div>'
  h += '<button class="btn btn-p" style="margin-top:8px" onclick="window._svc.submitReimburse()">提交申请</button>'
  opMod('\u{1F4CB} 报销申请', h)
}
function submitReimburse() {
  toast('报销申请已提交，预计3个工作日内审核', 'ok')
  clsMod()
}

function showHospitalReg() {
  let h = '<div class="fld"><label>选择医院</label><select><option>安康市人民医院</option><option>汉滨区中医院</option><option>汉滨区人民医院</option><option>安康市中心医院</option></select></div>'
  h += '<div class="fld"><label>科室</label><select><option>内科</option><option>外科</option><option>骨科</option><option>心内科</option></select></div>'
  h += '<div style="display:flex;gap:10px"><div class="fld" style="flex:1"><label>日期</label><input type="date"></div>'
  h += '<div class="fld" style="flex:1"><label>时段</label><select><option>上午 08:00-12:00</option><option>下午 14:00-17:00</option></select></div></div>'
  h += '<button class="btn btn-p" style="margin-top:8px" onclick="window._svc.confirmReg()">确认挂号</button>'
  opMod('\u{1F3E5} 在线挂号', h)
}
function confirmReg() { toast('挂号成功！请按时就诊', 'ok'); clsMod() }

function showPaymentHistory() {
  let h = '<table><thead><tr><th>时间</th><th>类型</th><th>金额</th><th>状态</th></tr></thead><tbody>'
  insurance.forEach(r => {
    h += '<tr><td>' + r.lastVisit + '</td><td>医保缴费</td><td>¥380</td><td><span class="tag g">已缴纳</span></td></tr>'
  })
  h += '</tbody></table>'
  opMod('\u{1F4C4} 缴费记录', h)
}

function showSubsidyProgress() {
  let h = ''
  subsidy.forEach(r => {
    h += '<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px">'
    h += '<span style="color:#fff;font-weight:600">' + r.name + ' - ' + r.type + '</span>'
    h += '<span class="tag ' + (r.status === '已发放' ? 'g' : 'y') + '">' + r.status + '</span></div>'
    h += '<div class="progress-bar"><div class="fill ' + (r.status === '已发放' ? 'g' : 'y') + '" style="width:' + (r.progress || '50%') + '"></div></div></div>'
  })
  opMod('\u{1F50D} 补贴进度查询', h)
}

function downloadPolicy() {
  const csv = '﻿政策类型,补贴标准,申请条件,联系方式\n耕地地力保护补贴,120元/亩,拥有耕地承包权,村委会\n农机购置补贴,购机价35%,新购农机具,农技站\n低保补助,300元/月,家庭人均收入低于标准,民政局\n创业补贴,最高8000元,首次创业6个月内,人社局'
  const b = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(b)
  a.download = '惠农政策汇总.csv'
  a.click()
  toast('政策文件已下载', 'ok')
}

function emergencyCall() {
  if (confirm('确认呼叫急救中心？此操作将发送老人的位置信息和健康档案。')) {
    toast('急救中心已响应，预计15分钟内到达', 'ok')
  }
}

function showElderlyLocation() {
  toast('张奶奶 — 2组东侧 距离村委会800m | 王奶奶 — 3组南侧 距离村委会1.2km | 周爷爷 — 3组北侧 距离村委会900m', 'info')
}

function showHealthReport() {
  const r = elderly[0]
  let h = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px;margin-bottom:12px">'
  h += '<div style="text-align:center;background:rgba(10,36,68,0.55);padding:12px;border-radius:6px"><div style="font-size:20px;font-weight:700;color:#28C76F">' + r.heartRate + '</div><div style="color:#6F91A8">心率</div></div>'
  h += '<div style="text-align:center;background:rgba(10,36,68,0.55);padding:12px;border-radius:6px"><div style="font-size:20px;font-weight:700;color:#28C76F">' + r.sleep + '</div><div style="color:#6F91A8">睡眠时长</div></div></div>'
  h += '<div style="font-size:11px;color:#6F91A8">健康摘要：' + r.health + '</div>'
  h += '<div style="margin-top:8px"><button class="btn btn-p btn-s" onclick="window._svc.sendReport()">\u{1F4F1} 发送详细报告</button></div>'
  opMod('\u{1F4CA} 健康报告 — ' + r.name, h)
}
function sendReport() { clsMod(); toast('详细报告已发送至手机', 'ok') }

function dispatchAlert() {
  const sel = prompt('选择处置对象：\n1. 王奶奶(85岁，2小时未活动)\n2. 周爷爷(91岁，心率偏高)', '1')
  if (sel) { toast('已派单给网格员，预计30分钟内上门查看', 'ok') }
}

function showTelemedForm() {
  let h = '<div class="fld"><label>患者姓名</label><input id="tm_patient"></div>'
  h += '<div style="display:flex;gap:10px"><div class="fld" style="flex:1"><label>科室</label><select id="tm_dept"><option>内科</option><option>骨科</option><option>心内科</option></select></div>'
  h += '<div class="fld" style="flex:1"><label>医生</label><select id="tm_doctor"><option>张医生</option><option>李医生</option><option>王医生</option></select></div></div>'
  h += '<div style="display:flex;gap:10px"><div class="fld" style="flex:1"><label>日期</label><input id="tm_date" type="date"></div>'
  h += '<div class="fld" style="flex:1"><label>时间</label><input id="tm_time" type="time"></div></div>'
  h += '<button class="btn btn-p" style="margin-top:8px" onclick="window._svc.confirmTelemed()">确认预约</button>'
  opMod('\u{1F4F9} 预约远程问诊', h)
}
function confirmTelemed() { toast('预约成功！请按时进入诊室', 'ok'); clsMod() }

function enterVideoRoom() {
  let h = '<div style="text-align:center;padding:20px"><div style="font-size:60px;margin-bottom:12px">\u{1F4F9}</div>'
  h += '<div style="font-size:14px;color:#fff;font-weight:600;margin-bottom:4px">正在连接医生…</div>'
  h += '<div style="font-size:11px;color:#6F91A8">您的排班时间：今日 14:30 张医生 内科</div>'
  h += '<div style="margin-top:12px"><button class="btn btn-p" onclick="window._svc.enterRoom()">进入诊室</button></div></div>'
  opMod('\u{25B6}\u{FE0F} 视频诊室', h)
}
function enterRoom() { clsMod(); toast('诊室连接成功', 'ok') }

function showMedicalRecords() {
  let h = ''
  telemed.forEach(r => {
    h += '<div class="tl-item"><div class="tl-dot' + (r.status === '已完成' ? ' g' : '') + '"></div>'
    h += '<div class="tl-content"><div class="tlt">' + r.date + ' ' + r.time + ' — ' + r.doctor + '（' + r.dept + '）</div>'
    h += '<div class="tld">诊断：' + r.diagnosis + ' | 处方：' + r.prescription + '</div></div></div>'
  })
  opMod('\u{1F4CB} 病历档案', h)
}

function showPrescriptions() {
  const arr = telemed.filter(r => r.prescription && r.prescription !== '-')
  let h = ''
  arr.forEach(r => {
    h += '<div style="background:rgba(10,36,68,0.55);padding:10px;border-radius:8px;margin-bottom:8px">'
    h += '<div style="font-weight:600;color:#fff;font-size:12px">' + r.patient + ' — ' + r.doctor + '</div>'
    h += '<div style="font-size:11px;color:#28C76F;margin-top:4px">\u{1F48A} ' + r.prescription + '</div>'
    h += '<div style="font-size:10px;color:#6F91A8">' + r.date + '</div></div>'
  })
  opMod('\u{1F48A} 处方查询', h || '<div style="color:#6F91A8">暂无处方记录</div>')
}

function showTrainingDetail(r) { showDetail(r) }

function enterLiveRoom() {
  toast('直播间：「苹果夏季修剪技术培训」正在直播中，观看人数：42人', 'info')
}

function showReplayList() {
  toast('课程回放：\u{2460} 病虫害防治基础(6/12) \u{2461} 电商直播入门(6/5) \u{2462} 有机种植技术(5/28)', 'info')
}

function askExpert() {
  const q = prompt('请输入您的问题：')
  if (q) { toast('已提交问题给专家，预计24小时内回复', 'ok') }
}

function showApptForm() {
  let h = '<div class="fld"><label>姓名</label><input id="ap_name"></div>'
  h += '<div style="display:flex;gap:10px"><div class="fld" style="flex:1"><label>业务类型</label><select id="ap_type"><option>证件办理</option><option>补贴申请</option><option>证明开具</option></select></div>'
  h += '<div class="fld" style="flex:1"><label>窗口</label><select id="ap_office"><option>户籍窗口</option><option>农业窗口</option><option>综合窗口</option></select></div></div>'
  h += '<div class="fld"><label>具体事项</label><input id="ap_item"></div>'
  h += '<div style="display:flex;gap:10px"><div class="fld" style="flex:1"><label>日期</label><input id="ap_date" type="date"></div>'
  h += '<div class="fld" style="flex:1"><label>时间</label><input id="ap_time" type="time"></div></div>'
  h += '<button class="btn btn-p" style="margin-top:8px" onclick="window._svc.confirmAppt()">确认预约</button>'
  opMod('\u{1F4C5} 在线预约', h)
}
function confirmAppt() {
  const n = document.getElementById('ap_name').value
  if (!n) { toast('请填写姓名', 'warn'); return }
  appointment.unshift({
    id: uid(), name: n,
    type: document.getElementById('ap_type').value,
    item: document.getElementById('ap_item').value,
    date: document.getElementById('ap_date').value,
    time: document.getElementById('ap_time').value,
    status: '已预约',
    office: document.getElementById('ap_office').value
  })
  clsMod()
  toast('预约成功！', 'ok')
}

function showApptProgress() {
  let h = ''
  appointment.forEach(r => {
    h += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(14,165,233,0.06)">'
    h += '<div><span style="color:#fff;font-weight:600">' + r.item + '</span><span style="color:#6F91A8;font-size:10px;margin-left:8px">' + r.date + ' ' + r.time + '</span></div>'
    h += '<span class="tag ' + (r.status === '已完成' ? 'g' : 'b') + '">' + r.status + '</span></div>'
  })
  opMod('\u{1F50D} 预约进度', h)
}

function downloadGuide() {
  const csv = '﻿事项,所需材料,办理窗口,办理时限,咨询电话\n身份证换领,原身份证+户口本,户籍窗口,15个工作日,12345\n农业补贴申请,土地承包证+身份证,农业窗口,7个工作日,12345\n农业用地证明,土地承包证+村委会证明,综合窗口,3个工作日,12345'
  const b = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(b)
  a.download = '办事指南.csv'
  a.click()
  toast('办事指南已下载', 'ok')
}

function downloadTemplate() {
  const csv = '﻿材料名称,模板说明,下载地址\n农业补贴申请表,需村委盖章,村委会领取\n身份证换领申请表,现场填写,户籍窗口\n农业用地证明模板,村委统一格式,综合窗口'
  const b = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(b)
  a.download = '材料模板列表.csv'
  a.click()
  toast('材料模板列表已下载', 'ok')
}

// Detail modal helpers (called from v-html via window._svc)
function editFromDetail(key, id) {
  clsMod()
  const arr = dataMap[key]
  const r = arr.find(x => x.id === id)
  if (r) { curTab.value = key; nextTick(() => showEditForm(r)) }
}
function delFromDetail(key, id) {
  clsMod()
  const arr = dataMap[key]
  const i = arr.findIndex(x => x.id === id)
  if (i >= 0) { arr.splice(i, 1); toast('已删除', 'ok') }
}

// ===== ECHARTS =====
let chartInstance = null

function disposeChart() {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
}

function initCurrentChart() {
  disposeChart()
  const key = curTab.value
  if (key === 'insurance') initInsTrendChart()
  else if (key === 'subsidy') initSubPieChart()
  else if (key === 'elderly') initElderChart()
  else if (key === 'telemed') initTelePieChart()
  else if (key === 'training') initTrainChart()
  else if (key === 'appointment') initApptPieChart()
}

function initInsTrendChart() {
  const el = document.getElementById('chart_ins_trend')
  if (!el) return
  chartInstance = echarts.init(el)
  chartInstance.setOption({
    tooltip: { trigger: 'axis', backgroundColor: '#ffffff', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#1e293b', fontSize: 10 } },
    grid: { left: 8, right: 20, top: 10, bottom: 24 },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'], axisLabel: { color: '#6b7a8d', fontSize: 9 }, axisLine: { lineStyle: { color: 'rgba(4,62,107,0.12)' } } },
    yAxis: { type: 'value', name: '¥', axisLabel: { color: '#6b7a8d', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(14,165,233,0.06)' } } },
    series: [
      { type: 'bar', data: [2100, 1800, 3200, 2800, 3600, 2970], barWidth: 16, itemStyle: { borderRadius: [3, 3, 0, 0], color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#28C7FA' }, { offset: 1, color: 'rgba(57,217,138,0.20)' }]) } },
      { type: 'line', data: [2100, 1800, 3200, 2800, 3600, 2970], smooth: true, lineStyle: { color: '#39D98A', width: 2 }, itemStyle: { color: '#39D98A' }, symbol: 'circle', symbolSize: 6 }
    ]
  })
}

function initSubPieChart() {
  const el = document.getElementById('chart_sub_pie')
  if (!el) return
  chartInstance = echarts.init(el)
  chartInstance.setOption({
    tooltip: { trigger: 'item', backgroundColor: '#ffffff', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#1e293b', fontSize: 10 } },
    series: [{ type: 'pie', radius: ['50%', '72%'], center: ['50%', '50%'], itemStyle: { borderColor: 'rgba(8,28,58,0.92)', borderWidth: 2 }, label: { color: '#6b7a8d', fontSize: 9 },
      data: [{ value: 6200, name: '耕地补贴', itemStyle: { color: '#28C7FA' } }, { value: 5000, name: '农机补贴', itemStyle: { color: '#39D98A' } }, { value: 3600, name: '低保补助', itemStyle: { color: '#f59e0b' } }, { value: 8000, name: '创业补贴', itemStyle: { color: '#28C7FA' } }]
    }]
  })
}

function initElderChart() {
  const el = document.getElementById('chart_elder_health')
  if (!el) return
  chartInstance = echarts.init(el)
  chartInstance.setOption({
    tooltip: { trigger: 'axis', backgroundColor: '#ffffff', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#1e293b', fontSize: 10 } },
    grid: { left: 8, right: 20, top: 30, bottom: 24 },
    legend: { data: ['心率', '睡眠'], textStyle: { color: '#6b7a8d', fontSize: 9 }, top: 0, right: 0 },
    xAxis: { type: 'category', data: ['6/12', '6/13', '6/14', '6/15', '6/16', '6/17', '6/18'], axisLabel: { color: '#6b7a8d', fontSize: 9 } },
    yAxis: [
      { type: 'value', name: 'bpm', axisLabel: { color: '#6b7a8d', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(14,165,233,0.06)' } } },
      { type: 'value', name: 'h', axisLabel: { color: '#6b7a8d', fontSize: 9 } }
    ],
    series: [
      { name: '心率', type: 'line', data: [72, 75, 70, 78, 88, 95, 88], yAxisIndex: 0, smooth: true, lineStyle: { color: '#E74C3C', width: 2 }, itemStyle: { color: '#E74C3C' } },
      { name: '睡眠', type: 'bar', data: [6.5, 6.2, 5.8, 5.5, 4.2, 5.1, 5.0], yAxisIndex: 1, barWidth: 12, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#28C7FA' }, { offset: 1, color: 'rgba(139,92,246,.2)' }]), borderRadius: [3, 3, 0, 0] } }
    ]
  })
}

function initTelePieChart() {
  const el = document.getElementById('chart_tele_pie')
  if (!el) return
  chartInstance = echarts.init(el)
  chartInstance.setOption({
    tooltip: { trigger: 'item', backgroundColor: '#ffffff', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#1e293b', fontSize: 10 } },
    series: [{ type: 'pie', radius: ['50%', '72%'], center: ['50%', '50%'], itemStyle: { borderColor: 'rgba(8,28,58,0.92)', borderWidth: 2 }, label: { color: '#6b7a8d', fontSize: 9 },
      data: [{ value: 15, name: '内科', itemStyle: { color: '#28C7FA' } }, { value: 8, name: '骨科', itemStyle: { color: '#39D98A' } }, { value: 10, name: '心内科', itemStyle: { color: '#E74C3C' } }, { value: 5, name: '其他', itemStyle: { color: '#28C7FA' } }]
    }]
  })
}

function initTrainChart() {
  const el = document.getElementById('chart_train_bar')
  if (!el) return
  chartInstance = echarts.init(el)
  chartInstance.setOption({
    tooltip: { trigger: 'axis', backgroundColor: '#ffffff', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#1e293b', fontSize: 10 } },
    grid: { left: 8, right: 30, top: 10, bottom: 24 },
    xAxis: { type: 'category', data: ['病虫害防治', '电商直播', '智慧农业'], axisLabel: { color: '#6b7a8d', fontSize: 9, rotate: 15 } },
    yAxis: { type: 'value', name: '人', axisLabel: { color: '#6b7a8d', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(14,165,233,0.06)' } } },
    series: [{
      type: 'bar', barWidth: 28, itemStyle: { borderRadius: [3, 3, 0, 0] },
      data: [
        { value: 18, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#28C7FA' }, { offset: 1, color: 'rgba(57,217,138,0.20)' }]) } },
        { value: 25, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#39D98A' }, { offset: 1, color: 'rgba(16,214,160,.2)' }]) } },
        { value: 20, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#28C7FA' }, { offset: 1, color: 'rgba(139,92,246,.2)' }]) } }
      ],
      markLine: { silent: true, data: [{ yAxis: 25, label: { formatter: '平均', fontSize: 9, color: '#f59e0b' }, lineStyle: { color: '#f59e0b', type: 'dashed' } }] }
    }]
  })
}

function initApptPieChart() {
  const el = document.getElementById('chart_appt_pie')
  if (!el) return
  chartInstance = echarts.init(el)
  chartInstance.setOption({
    tooltip: { trigger: 'item', backgroundColor: '#ffffff', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#1e293b', fontSize: 10 } },
    series: [{ type: 'pie', radius: ['50%', '72%'], center: ['50%', '50%'], itemStyle: { borderColor: 'rgba(8,28,58,0.92)', borderWidth: 2 }, label: { color: '#6b7a8d', fontSize: 9 },
      data: [{ value: 8, name: '证件办理', itemStyle: { color: '#28C7FA' } }, { value: 5, name: '补贴申请', itemStyle: { color: '#39D98A' } }, { value: 3, name: '证明开具', itemStyle: { color: '#f59e0b' } }, { value: 2, name: '其他', itemStyle: { color: '#28C7FA' } }]
    }]
  })
}

// Watch tab changes to re-init charts
watch(curTab, async () => {
  await nextTick()
  setTimeout(() => initCurrentChart(), 150)
})

// ===== HASH ROUTING =====
function handleHash() {
  const hash = window.location.hash.replace('#', '')
  if (!hash) return
  const validTabs = tabs.map(t => t.key)
  if (validTabs.indexOf(hash) >= 0 && hash !== curTab.value) {
    switchTab(hash)
  }
}

// ===== EXPOSE HANDLERS TO WINDOW (for v-html onclick) =====
onMounted(() => {
  window._svc = {
    clsMod,
    saveForm,
    queryBalance,
    submitReimburse,
    confirmReg,
    sendReport,
    confirmTelemed,
    enterRoom,
    confirmAppt,
    editFromDetail,
    delFromDetail
  }
  window.addEventListener('hashchange', handleHash)
  setTimeout(handleHash, 100)
  // Init first chart
  nextTick(() => setTimeout(() => initCurrentChart(), 200))
})

onUnmounted(() => {
  disposeChart()
  delete window._svc
  window.removeEventListener('hashchange', handleHash)
})
</script>

<style scoped>
.svc-page {
  min-height: 100vh;
  background: #071B2D;
  color: #B7D3E8;
  display: flex;
  flex-direction: column;
}

/* Header */
.hdr {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: linear-gradient(180deg, rgba(10,50,100,0.15), rgba(6,20,44,0.05));
  border-bottom: 1px solid rgba(0,0,0,0.06);
  flex-shrink: 0;
}
.hdr-l {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.hdr-l a, .hdr-r a {
  color: #6F91A8;
  text-decoration: none;
}
.hdr-r {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 10px;
  color: #6F91A8;
}

/* Tab Bar */
.tab-bar {
  flex-shrink: 0;
  display: flex;
  gap: 0;
  background: rgba(8,28,58,0.65);
  border-bottom: 1px solid #E8F8EF;
  padding: 0 16px;
}
.tab-btn {
  padding: 10px 18px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  color: #6F91A8;
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  transition: all .2s;
  font-family: inherit;
  letter-spacing: .5px;
}
.tab-btn:hover { color: #B7D3E8; }
.tab-btn.on { color: #28C76F; border-bottom-color: #39D98A; }

/* Main */
.main-content { flex: 1; display: flex; min-height: 0; overflow: hidden; }
.content {
  flex: 1;
  overflow-y: scroll;
  padding: 14px 18px;
  min-height: 0;
}
.content::-webkit-scrollbar { width: 4px; }
.content::-webkit-scrollbar-thumb { background: rgba(57,217,138,0.12); border-radius: 2px; }

/* Breadcrumb */
.bc { font-size: 10px; color: #6F91A8; margin-bottom: 4px; }
.bc a { color: #6F91A8; text-decoration: none; }
.bc span { color: #28C76F; }
.pg-tt { font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 12px; }

/* KPI Cards */
.srow { display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
.scard {
  flex: 1;
  min-width: 130px;
  background: rgba(8,24,48,0.88);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(40,199,111,0.10);
  border-radius: 18px;
  padding: 12px 16px;
  cursor: pointer;
  transition: .25s;
}
.scard:hover { background: rgba(57,217,138,0.12); transform: translateY(-2px); }
.scard .sv {
  font-size: 22px;
  font-weight: 700;
  color: #28C76F;
  font-family: "SF Mono", Consolas, monospace;
}
.scard .sl { font-size: 10px; color: #6F91A8; margin-top: 2px; }
.scard.g .sv { color: #28C76F; }
.scard.y .sv { color: #F5B83D; }
.scard.r .sv { color: #E74C3C; }
.scard.p .sv { color: #A77BFF; }

/* Panel */
.panel {
  background: rgba(8,24,48,0.88);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(40,199,111,0.10);
  border-radius: 18px;
  padding: 14px 18px;
  margin-bottom: 12px;
}
.panel .tt {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 1px;
}
.panel .tt::before {
  content: '';
  width: 3px;
  height: 13px;
  border-radius: 2px;
  background: #28C76F;
}

/* Action Buttons */
.act-group { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
.act-btn {
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-family: inherit;
  letter-spacing: .5px;
  transition: all .2s;
  background: rgba(14,165,233,.10);
  color: #28C76F;
  border: 1px solid rgba(57,217,138,0.20);
}
.act-btn:hover { background: #c8e6d8; border-color: rgba(57,217,138,0.30); transform: translateY(-1px); }
.act-btn.primary { background: linear-gradient(135deg, #39D98A, #28C76F); color: #fff; box-shadow: 0 2px 8px rgba(57,217,138,0.20); }
.act-btn.warn { background: #FFF8E8; color: #F5B83D; border-color: rgba(245,158,11,.2); }
.act-btn.danger { background: #FDE8E8; color: #E74C3C; border-color: rgba(239,68,68,.2); }

/* Grid */
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* Table */
.toolbar-row {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  align-items: center;
}
.spacer { flex: 1; }
.toolbar-row input {
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-family: inherit;
  background: rgba(57,217,138,0.06);
  border: 1px solid rgba(4,62,107,0.12);
  color: #B7D3E8;
  outline: none;
  width: 200px;
}
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 8px 12px; text-align: left; font-size: 11px; }
th {
  background: rgba(10,36,68,0.55);
  font-weight: 600;
  color: #6F91A8;
  border-bottom: 2px solid #E8F8EF;
  font-size: 10px;
  letter-spacing: .5px;
}
td { border-bottom: 1px solid rgba(14,165,233,0.06); }
tr:hover td { background: #e8f8ef; cursor: pointer; }

/* Tags */
.tag { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; }
.tag.g { background: rgba(16,214,160,.15); color: #28C76F; }
.tag.b { background: rgba(57,217,138,0.12); color: #28C76F; }
.tag.y { background: rgba(245,158,11,.15); color: #F5B83D; }
.tag.r { background: rgba(239,68,68,.15); color: #E74C3C; }
.tag.dim { background: rgba(100,120,140,.15); color: #6F91A8; }

/* Timeline */
.tl-item {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(14,165,233,0.06);
  align-items: flex-start;
}
.tl-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #28C76F;
  flex-shrink: 0;
  margin-top: 4px;
}
.tl-dot.g { background: #28C76F; }
.tl-dot.y { background: #F5B83D; }
.tl-dot.r { background: #E74C3C; }
.tl-content { flex: 1; font-size: 11px; }
.tl-content .tlt { color: #fff; font-weight: 600; }
.tl-content .tld { color: #6F91A8; font-size: 10px; margin-top: 1px; }
.tl-content .tltm { color: #6F91A8; font-size: 9px; }

/* Progress */
.progress-bar {
  height: 6px;
  background: rgba(57,217,138,0.06);
  border-radius: 6px;
  overflow: hidden;
  margin: 4px 0;
}
.progress-bar .fill { height: 100%; border-radius: 6px; transition: width .6s ease; }
.fill.g { background: linear-gradient(90deg, #39D98A, #34d399); }
.fill.y { background: linear-gradient(90deg, #f59e0b, #fbbf24); }

/* Alert Feed */
.alert-feed { max-height: 200px; overflow-y: auto; }
.alert-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 8px;
  margin-bottom: 4px;
  background: rgba(10,36,68,0.55);
  border-left: 4px solid #28C76F;
  font-size: 11px;
  cursor: pointer;
  transition: .2s;
}
.alert-row:hover { background: rgba(14,165,233,.08); }
.alert-row.warn { border-left-color: #F5B83D; }
.alert-row.danger { border-left-color: #E74C3C; }
.alert-row .ar-icon { font-size: 15px; flex-shrink: 0; }
.alert-row .ar-body { flex: 1; }
.alert-row .ar-time { font-size: 9px; color: #6F91A8; flex-shrink: 0; }

/* Calendar */
.cal-wrap {
  border-radius: 24px;
  background: linear-gradient(180deg, #122746, #0E2038);
  border: 1px solid rgba(255,255,255,.06);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.03), 0 10px 40px rgba(0,0,0,.35);
  overflow: hidden;
  backdrop-filter: blur(18px);
}
.cal-month-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px 0 10px;
}
.cal-month-row .cal-arrow {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255,255,255,.45);
  font-size: 18px;
  background: rgba(21,42,71,0.8);
  border: 1px solid rgba(255,255,255,.08);
  transition: all .25s;
  user-select: none;
}
.cal-month-row .cal-arrow:hover {
  background: rgba(14,165,233,.20);
  border-color: rgba(14,165,233,.45);
  color: #fff;
  box-shadow: 0 0 16px rgba(14,165,233,.20);
}
.cal-month-row .cal-month-text {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
  min-width: 150px;
  text-align: center;
}
.cal-week-bar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
  margin: 8px 16px 6px;
  height: 44px;
  align-items: center;
  border-radius: 14px;
  background: rgba(255,255,255,.04);
  backdrop-filter: blur(10px);
  padding: 0 4px;
}
.cal-week-bar span {
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,.38);
}
.cal-week-bar span.we { color: rgba(52,211,153,.55); }
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  padding: 0 16px 10px;
}
.cal-cell {
  min-height: 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 8px;
  border-radius: 14px;
  cursor: pointer;
  background: linear-gradient(180deg, rgba(23,43,73,0.7), rgba(20,36,61,0.7));
  border: 1px solid rgba(255,255,255,.06);
  transition: all .25s cubic-bezier(.4,0,.2,1);
  position: relative;
}
.cal-cell:hover { transform: translateY(-3px); border-color: #22d3ee; box-shadow: 0 0 20px rgba(34,211,238,.18); z-index: 2; }
.cal-cell:active { transform: scale(.96); }
.cal-cell .cnum { font-size: 16px; font-weight: 600; color: rgba(255,255,255,.88); line-height: 1.2; }
.cal-cell .clunar {
  font-size: 13px;
  color: rgba(255,255,255,.40);
  line-height: 1.3;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
.cal-cell .clunar.term { color: #fbbf24; }
.cal-cell .cdot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #34D399;
  margin-top: 4px;
  box-shadow: 0 0 10px #34D399;
}
.cal-cell.today { border-color: rgba(14,165,233,.55); box-shadow: 0 0 18px rgba(14,165,233,.15); }
.cal-cell.today .cnum { color: #fff; font-weight: 700; }
.cal-cell.selected {
  background: linear-gradient(180deg, #1BCFB4, #2DD4BF);
  border-color: rgba(52,211,153,.5);
  box-shadow: 0 0 30px rgba(52,211,153,.35), inset 0 1px 0 rgba(255,255,255,.20);
}
.cal-cell.selected .cnum { color: #fff; font-weight: 700; }
.cal-cell.selected .clunar { color: rgba(255,255,255,.7); }
.cal-cell.selected .cdot { background: #fff; box-shadow: 0 0 8px #fff; }
.cal-cell.empty { cursor: default; pointer-events: none; border-color: transparent; background: transparent; }
.cal-cell.empty:hover { transform: none; box-shadow: none; border-color: transparent; }
.cal-cell.other { opacity: .22; pointer-events: none; background: transparent; }
.cal-cell.other:hover { transform: none; box-shadow: none; border-color: transparent; }
.cal-legends {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 6px 16px 16px;
  font-size: 11px;
  color: rgba(255,255,255,.42);
}
.cal-legends span { display: flex; align-items: center; gap: 5px; }
.cal-legends .ldot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.cal-legends .ldot.g { background: #34D399; box-shadow: 0 0 10px #34D399; }
.cal-legends .ldot.b { background: #0EA5E9; box-shadow: 0 0 8px rgba(14,165,233,0.5); }
.cal-legends .ldot.d { background: rgba(255,255,255,0.20); }

/* Buttons */
.btn {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-family: inherit;
  letter-spacing: .5px;
}
.btn-p { background: linear-gradient(135deg, #39D98A, #28C76F); color: #fff; box-shadow: 0 2px 8px rgba(57,217,138,0.20); }
.btn-p:hover { box-shadow: 0 4px 12px rgba(57,217,138,0.30); }
.btn-o { background: transparent; border: 1px solid rgba(14,165,233,0.28); color: #28C76F; }
.btn-d { background: rgba(239,68,68,.15); border: 1px solid rgba(239,68,68,.25); color: #E74C3C; }
.btn-s { padding: 3px 9px; font-size: 10px; }

/* Pagination */
.pg {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 10px;
  font-size: 11px;
  align-items: center;
}
.pg-btn {
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(57,217,138,0.06);
  border: 1px solid rgba(4,62,107,0.12);
  color: #6F91A8;
  cursor: pointer;
}
.pg-btn:hover { color: #B7D3E8; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-box {
  position: relative;
  background: rgba(8,24,48,0.88);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(40,199,111,0.20);
  border-radius: 8px;
  padding: 20px 24px;
  width: 520px;
  max-width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,.6);
}
.modal-close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(10,60,130,.2);
  color: #B7D3E8;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-box h3 { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 16px; }

/* Toast */
.toast-area {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;
}
.toast {
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  animation: toast-in .3s ease, toast-out .3s ease 2s forwards;
  pointer-events: auto;
}
.toast.ok { background: linear-gradient(135deg, #059669, #39D98A); }
.toast.info { background: linear-gradient(135deg, #39D98A, #28C76F); }
.toast.warn { background: linear-gradient(135deg, #d97706, #f59e0b); }
@keyframes toast-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes toast-out { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
</style>

<!-- Non-scoped styles for v-html modal content -->
<style>
.modal-box .fld { margin-bottom: 10px; }
.modal-box .fld label { display: block; font-size: 11px; color: #6F91A8; margin-bottom: 3px; }
.modal-box .fld input,
.modal-box .fld select,
.modal-box .fld textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-family: inherit;
  background: rgba(57,217,138,0.06);
  border: 1px solid rgba(4,62,107,0.12);
  color: #B7D3E8;
  outline: none;
}
.modal-box .btn { margin-right: 6px; }
.modal-box .btn-p { background: linear-gradient(135deg, #39D98A, #28C76F); color: #fff; box-shadow: 0 2px 8px rgba(57,217,138,0.20); }
.modal-box .btn-o { background: transparent; border: 1px solid rgba(14,165,233,0.28); color: #28C76F; }
.modal-box .btn-d { background: rgba(239,68,68,.15); border: 1px solid rgba(239,68,68,.25); color: #E74C3C; }
.modal-box .btn-s { padding: 3px 9px; font-size: 10px; }
.modal-box .btn { display: inline-block; padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer; border: none; font-family: inherit; letter-spacing: .5px; }
.modal-box table { width: 100%; border-collapse: collapse; font-size: 12px; }
.modal-box th, .modal-box td { padding: 8px 12px; text-align: left; font-size: 11px; }
.modal-box th { background: rgba(10,36,68,0.55); font-weight: 600; color: #6F91A8; border-bottom: 2px solid #E8F8EF; font-size: 10px; letter-spacing: .5px; }
.modal-box td { border-bottom: 1px solid rgba(14,165,233,0.06); }
.modal-box .tag { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; }
.modal-box .tag.g { background: rgba(16,214,160,.15); color: #28C76F; }
.modal-box .tag.b { background: rgba(57,217,138,0.12); color: #28C76F; }
.modal-box .tag.y { background: rgba(245,158,11,.15); color: #F5B83D; }
.modal-box .tag.r { background: rgba(239,68,68,.15); color: #E74C3C; }
.modal-box .tl-item { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px solid rgba(14,165,233,0.06); align-items: flex-start; }
.modal-box .tl-dot { width: 8px; height: 8px; border-radius: 50%; background: #28C76F; flex-shrink: 0; margin-top: 4px; }
.modal-box .tl-dot.g { background: #28C76F; }
.modal-box .tl-dot.r { background: #E74C3C; }
.modal-box .tl-content { flex: 1; font-size: 11px; }
.modal-box .tl-content .tlt { color: #fff; font-weight: 600; }
.modal-box .tl-content .tld { color: #6F91A8; font-size: 10px; margin-top: 1px; }
.modal-box .progress-bar { height: 6px; background: rgba(57,217,138,0.06); border-radius: 6px; overflow: hidden; margin: 4px 0; }
.modal-box .progress-bar .fill { height: 100%; border-radius: 6px; transition: width .6s ease; }
.modal-box .fill.g { background: linear-gradient(90deg, #39D98A, #34d399); }
.modal-box .fill.y { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
</style>
