// Generate ServicePage.vue v2 — farmer-oriented + dashboard-ready layout
const fs = require('fs');
const path = require('path');

const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');

const out = `<template>
  <div class="svc-page" :class="{embedded}">
    <!-- ===== HEADER ===== -->
    <header class="hdr" v-if="!embedded">
      <div class="hdr-l">
        <router-link to="/">&#x1F3E0; 返回首页</router-link> &#x1F91D; 数字服务中心
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
        <!-- Page Title -->
        <div class="page-title-bar">
          <div class="page-title">{{ activeTab.label }}</div>
          <div class="page-subtitle">{{ pageSubtitle }}</div>
        </div>

        <!-- KPI cards -->
        <div class="kpi-row">
          <div class="kpi-card" :class="c.color" v-for="c in kpiCards" :key="c.label">
            <div class="kpi-icon">{{ c.icon }}</div>
            <div class="kpi-info">
              <div class="kpi-val">{{ c.value }}</div>
              <div class="kpi-lbl">{{ c.label }}</div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="qa-label">快捷服务</div>
        <div class="qa-row">
          <button v-for="a in quickActions" :key="a.label" class="qa-btn" @click="a.action">{{ a.icon }} {{ a.label }}</button>
        </div>

        <!-- ===== Tab Content Areas ===== -->

        <!-- Insurance: 我的保障 + 就诊记录 -->
        <div v-if="curTab==='insurance'" class="tab-content">
          <div class="section-card">
            <div class="section-title">&#x1F4CB; 我的保障</div>
            <div class="insure-cards">
              <div class="insure-card" v-for="(info, idx) in myInsuranceCards" :key="idx">
                <div class="ic-left">
                  <div class="ic-type">{{ info.type }}</div>
                  <div class="ic-status" :class="info.status.includes('正常')?'g':'y'">● {{ info.status }}</div>
                  <div class="ic-year">当前年度：2026</div>
                </div>
                <div class="ic-right">
                  <div class="ic-extra" v-if="info.extra">{{ info.extra }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="section-card" style="margin-top:14px">
            <div class="section-title">&#x1F3E5; 最近就诊记录</div>
            <table class="data-table">
              <thead><tr><th>日期</th><th>医院</th><th>诊断</th><th>总费用</th><th>报销</th><th>个人支付</th></tr></thead>
              <tbody>
                <tr v-for="r in medicalRecords" :key="r.id" @click="showMedicalDetail(r)" style="cursor:pointer">
                  <td>{{ r.date }}</td><td>{{ r.hospital }}</td><td>{{ r.diagnosis }}</td>
                  <td style="font-family:monospace">&yen;{{ r.totalCost.toLocaleString() }}</td>
                  <td style="color:#28C76F;font-family:monospace">&yen;{{ r.reimburse.toLocaleString() }}</td>
                  <td style="color:#E74C3C;font-family:monospace">&yen;{{ r.personalPay.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Subsidy: 可申请补贴 + 我的申请 -->
        <div v-if="curTab==='subsidy'" class="tab-content">
          <div class="section-card">
            <div class="section-title">&#x1F4CB; 可申请补贴</div>
            <div class="subsidy-cards">
              <div class="subsidy-card" v-for="s in availableSubsidies" :key="s.name" @click="applySubsidy(s)">
                <div class="sc-icon">{{ s.icon }}</div>
                <div class="sc-info">
                  <div class="sc-name">{{ s.name }}</div>
                  <div class="sc-desc">{{ s.desc }}</div>
                </div>
                <div class="sc-amount">{{ s.amount }}</div>
              </div>
            </div>
          </div>
          <div class="section-card" style="margin-top:14px">
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
          </div>
        </div>

        <!-- Elderly: 家庭老人健康卡片 -->
        <div v-if="curTab==='elderly'" class="tab-content">
          <div class="section-card">
            <div class="section-title">&#x1F474; 家庭老人</div>
            <div class="elder-cards">
              <div class="elder-card" v-for="e in elderly" :key="e.id">
                <div class="ec-avatar">{{ e.gender === '男' ? '&#x1F468;' : '&#x1F469;' }}</div>
                <div class="ec-info">
                  <div class="ec-name">{{ e.name }} <span style="font-size:10px;color:#6F91A8">{{ e.age }}岁</span></div>
                  <div class="ec-addr">{{ e.addr }}</div>
                  <div class="ec-meta">
                    <span class="tag" :class="e.status==='正常'?'g':e.status==='重点关注'?'r':'y'">{{ e.status }}</span>
                    <span style="font-size:10px;color:#6F91A8;margin-left:6px">{{ e.type }} | {{ e.device }}</span>
                  </div>
                </div>
                <div class="ec-health">
                  <div class="ech-item"><div class="ech-val" style="color:#E74C3C">{{ e.heartRate }}</div><div class="ech-lbl">心率bpm</div></div>
                  <div class="ech-item"><div class="ech-val" style="color:#28C7FA">{{ e.sleep }}</div><div class="ech-lbl">睡眠h</div></div>
                </div>
                <div class="ec-actions">
                  <button class="btn btn-p btn-s" @click="showHealthReportFor(e)">健康报告</button>
                  <button class="btn btn-d btn-s" @click="emergencyCallFor(e)">一键呼救</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Telemed: 我的问诊记录 -->
        <div v-if="curTab==='telemed'" class="tab-content">
          <div class="section-card">
            <div class="section-title">&#x1F4F9; 我的问诊记录</div>
            <table class="data-table">
              <thead><tr><th>患者</th><th>医生</th><th>科室</th><th>时间</th><th>类型</th><th>诊断</th><th>状态</th></tr></thead>
              <tbody>
                <tr v-for="r in telemed" :key="r.id" @click="showTelemedDetail(r)" style="cursor:pointer">
                  <td>{{ r.patient }}</td><td>{{ r.doctor }}</td><td>{{ r.dept }}</td>
                  <td>{{ r.date }} {{ r.time }}</td><td>{{ r.type }}</td>
                  <td>{{ r.diagnosis }}</td>
                  <td><span class="tag" :class="r.status==='已完成'?'g':'y'">{{ r.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Training: 可报名课程 + 我的学习 -->
        <div v-if="curTab==='training'" class="tab-content">
          <div class="section-card">
            <div class="section-title">&#x1F393; 可报名课程</div>
            <div class="course-cards">
              <div class="course-card" v-for="c in availableCourses" :key="c.id">
                <div class="cc-header">
                  <span class="cc-title">{{ c.title }}</span>
                  <span class="tag g">{{ c.status }}</span>
                </div>
                <div class="cc-body">
                  <div class="cc-meta">{{ c.teacher }} | {{ c.date }} {{ c.time }} | {{ c.loc }}</div>
                  <div class="cc-meta">{{ c.duration }} | {{ c.type }} | 已报 {{ c.joined }}/{{ c.limit }}</div>
                </div>
                <button class="btn btn-p btn-s" @click="enrollCourse(c)">立即报名</button>
              </div>
            </div>
          </div>
          <div class="section-card" style="margin-top:14px">
            <div class="section-title">&#x1F4DA; 我的学习</div>
            <table class="data-table">
              <thead><tr><th>课程名称</th><th>讲师</th><th>日期</th><th>状态</th><th>进度</th></tr></thead>
              <tbody>
                <tr v-for="r in training" :key="r.id">
                  <td>{{ r.title }}</td><td>{{ r.teacher }}</td><td>{{ r.date }}</td>
                  <td><span class="tag" :class="r.status==='已完成'?'g':r.status==='进行中'?'b':'dim'">{{ r.status }}</span></td>
                  <td><div class="progress-bar" style="width:80px"><div class="fill" :class="r.status==='已完成'?'g':'b'" :style="{width:(r.progress||'0%')}"></div></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Appointment: 日历 + 我的预约 -->
        <div v-if="curTab==='appointment'" class="tab-content">
          <div class="section-card">
            <div class="apt-layout">
              <div class="apt-cal">
                <div class="cal-header">
                  <button class="btn btn-o btn-s" @click="calPrevMonth">&#x25C0;</button>
                  <span style="color:#fff;font-weight:600;font-size:13px;margin:0 8px">{{ calYear }}年{{ calMonth + 1 }}月</span>
                  <button class="btn btn-o btn-s" @click="calNextMonth">&#x25B6;</button>
                </div>
                <div class="cal-grid">
                  <div class="cal-day-hd" v-for="d in ['日','一','二','三','四','五','六']" :key="d">{{ d }}</div>
                  <div v-for="d in calendarDays" :key="d.key"
                    :class="['cal-day', { dim: !d.cur, selected: calSelected && calSelected.y===d.y && calSelected.m===d.m && calSelected.d===d.d, hasAppt: d.hasAppt }]"
                    @click="d.cur ? calPickDay(d.y, d.m, d.d) : null">
                    <span>{{ d.d }}</span>
                    <span class="lunar" v-if="d.lunar">{{ d.lunar }}</span>
                    <span class="cal-dot" v-if="d.hasAppt"></span>
                  </div>
                </div>
              </div>
              <div class="apt-list">
                <div class="section-title" style="margin-bottom:8px">&#x1F4C5; 我的预约</div>
                <div v-if="!appointment.length" style="color:#6F91A8;font-size:11px;padding:12px">暂无预约记录</div>
                <div v-for="r in appointment" :key="r.id" class="apt-item" @click="showApptDetail(r)" style="cursor:pointer">
                  <div class="apt-item-hd">
                    <span style="color:#fff;font-weight:600;font-size:12px">{{ r.item }}</span>
                    <span class="tag" :class="r.status==='已完成'?'g':'b'">{{ r.status }}</span>
                  </div>
                  <div class="apt-item-meta">{{ r.name }} | {{ r.date }} {{ r.time }} | {{ r.office }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart Area -->
        <div class="chart-block" v-if="curTab==='insurance'"><div id="chart_ins_trend" style="width:100%;height:200px"></div></div>
        <div class="chart-block" v-if="curTab==='subsidy'"><div id="chart_sub_pie" style="width:100%;height:200px"></div></div>
        <div class="chart-block" v-if="curTab==='elderly'"><div id="chart_elder_health" style="width:100%;height:200px"></div></div>
        <div class="chart-block" v-if="curTab==='telemed'"><div id="chart_tele_pie" style="width:100%;height:200px"></div></div>
        <div class="chart-block" v-if="curTab==='training'"><div id="chart_train_bar" style="width:100%;height:200px"></div></div>
        <div class="chart-block" v-if="curTab==='appointment'"><div id="chart_appt_pie" style="width:100%;height:200px"></div></div>
      </div>
    </div>

    <!-- ===== MODAL ===== -->
    <div class="mod-over" v-if="mod.vis" @click.self="clsMod">
      <div class="mod-box">
        <div class="mod-hd">
          <span v-html="mod.title"></span>
          <button class="mod-x" @click="clsMod">&times;</button>
        </div>
        <div class="mod-bd" v-html="mod.html"></div>
      </div>
    </div>

    <!-- ===== TOAST ===== -->
    <div class="toast-bar">
      <div v-for="t in toasts" :key="t.id" :class="['toast', t.type]">{{ t.msg }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({ embedded: { type: Boolean, default: false } })

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
const mod = reactive({ vis: false, title: '', html: '' })
function opMod(title, html) {
  mod.title = title
  mod.html = html
  mod.vis = true
}
function clsMod() {
  mod.vis = false
  setTimeout(() => { mod.title = ''; mod.html = '' }, 200)
}

// ===== TABS =====
const tabs = [
  { key: 'insurance', label: '医保社保查询', icon: '\\u{1F4C4}', color: 'b' },
  { key: 'subsidy',   label: '补贴申请',     icon: '\\u{1F4B0}', color: 'g' },
  { key: 'elderly',   label: '老人关爱',     icon: '\\u{1F474}', color: 'r' },
  { key: 'telemed',   label: '远程医疗',     icon: '\\u{1F3E5}', color: 'p' },
  { key: 'training',  label: '农技培训',     icon: '\\u{1F393}', color: 'y' },
  { key: 'appointment', label: '政务预约',    icon: '\\u{1F4C5}', color: 'b' }
]
const curTab = ref('insurance')
const activeTab = computed(() => tabs.find(t => t.key === curTab.value) || tabs[0])
function switchTab(key) { curTab.value = key }

// ===== MOCK DATA (农户端个人数据) =====
const myInsuranceCards = reactive([
  { type: '城乡居民医保', status: '正常参保', extra: '账户余额 ¥960' },
  { type: '养老保险', status: '正常领取', extra: '¥240/月' }
])
const medicalRecords = reactive([
  { id: 101, date: '2026-06-10', hospital: '汉滨区中医院', diagnosis: '腰椎间盘突出', totalCost: 2100, reimburse: 1250, personalPay: 850 },
  { id: 102, date: '2026-05-20', hospital: '安康市人民医院', diagnosis: '高血压复查', totalCost: 380, reimburse: 125, personalPay: 255 },
  { id: 103, date: '2026-04-15', hospital: '安康市中心医院', diagnosis: '糖尿病随访', totalCost: 1680, reimburse: 860, personalPay: 820 },
  { id: 104, date: '2026-03-08', hospital: '汉滨区人民医院', diagnosis: '急性肠胃炎', totalCost: 520, reimburse: 320, personalPay: 200 }
])
const insurance = reactive([
  { id: 1, name: '王友德', idCard: '610***********0034', medType: '城乡居民医保', medStatus: '正常参保', medBalance: '¥960', penStatus: '正常领取', penMonthly: '¥240', lastVisit: '2026-06-10', hospital: '汉滨区中医院', diagnosis: '腰椎间盘突出', reimburse: '¥1,250' }
])
const availableSubsidies = [
  { name: '耕地地力保护补贴', desc: '拥有耕地承包权的农户', amount: '¥120/亩', icon: '\\u{1F33E}' },
  { name: '农机购置补贴', desc: '新购农机具补贴', amount: '购机价35%', icon: '\\u{1F69C}' },
  { name: '低保补助', desc: '家庭人均收入低于标准', amount: '¥300/月', icon: '\\u{1F4B0}' },
  { name: '创业补贴', desc: '首次创业6个月内', amount: '最高¥8,000', icon: '\\u{1F3EA}' }
]
const subsidy = reactive([
  { id: 11, name: '王友德', type: '耕地地力保护补贴', amount: 6200, status: '已发放', date: '2026-06-15', progress: '100%' },
  { id: 12, name: '王友德', type: '农机购置补贴', amount: 5000, status: '审核中', date: '2026-07-20', progress: '65%' },
  { id: 13, name: '王友德', type: '低保补助', amount: 3600, status: '发放中', date: '2026-07-01', progress: '80%' }
])
const elderly = reactive([
  { id: 21, name: '王奶奶', age: 85, gender: '女', addr: '2组东侧', type: '独居', device: '智能手环', status: '重点关注', health: '高血压3级，需每日监测', heartRate: 88, sleep: 4.2 },
  { id: 22, name: '周爷爷', age: 91, gender: '男', addr: '3组北侧', type: '与子女同住', device: '智能手表', status: '需关注', health: '糖尿病，血糖控制尚可', heartRate: 72, sleep: 6.5 }
])
const telemed = reactive([
  { id: 31, patient: '王友德', doctor: '张医生', dept: '内科', date: '2026-06-15', time: '14:30', type: '视频问诊', diagnosis: '高血压复查，血压控制良好', status: '已完成', prescription: '硝苯地平 30mg qd' },
  { id: 32, patient: '王友德', doctor: '李医生', dept: '骨科', date: '2026-06-20', time: '09:00', type: '在线复诊', diagnosis: '腰椎间盘突出康复随访', status: '待就诊', prescription: '-' },
  { id: 33, patient: '王奶奶', doctor: '王医生', dept: '心内科', date: '2026-05-10', time: '10:00', type: '视频问诊', diagnosis: '高血压调整用药', status: '已完成', prescription: '氨氯地平 5mg qd' },
  { id: 34, patient: '周爷爷', doctor: '张医生', dept: '内科', date: '2026-04-22', time: '15:00', type: '视频问诊', diagnosis: '糖尿病随访，调整胰岛素剂量', status: '已完成', prescription: '胰岛素 12U tid' }
])
const availableCourses = reactive([
  { id: 41, title: '苹果夏季修剪技术培训', teacher: '李教授', date: '2026-08-15', time: '09:00', loc: '村委会培训室', duration: '3小时', type: '线下实操', joined: 18, limit: 30, status: '报名中' },
  { id: 42, title: '电商直播带货入门', teacher: '赵老师', date: '2026-08-20', time: '14:00', loc: '线上直播', duration: '2小时', type: '线下+线上', joined: 25, limit: 50, status: '报名中' },
  { id: 43, title: '有机蔬菜种植技术', teacher: '孙教授', date: '2026-09-05', time: '08:30', loc: '镇农技站', duration: '4小时', type: '线下讲座', joined: 20, limit: 40, status: '报名中' }
])
const training = reactive([
  { id: 51, title: '病虫害防治基础', teacher: '刘教授', date: '2026-06-12', time: '09:00', loc: '村委会培训室', duration: '2小时', type: '线下讲座', joined: 22, limit: 30, status: '已完成', progress: '100%' },
  { id: 52, title: '智慧农业入门', teacher: '周老师', date: '2026-07-08', time: '14:00', loc: '线上直播', duration: '1.5小时', type: '线下+线上', joined: 35, limit: 50, status: '进行中', progress: '60%' }
])
const appointment = reactive([
  { id: 61, name: '王友德', type: '证件办理', item: '身份证换领', date: '2026-08-12', time: '09:30', status: '已预约', office: '户籍窗口' },
  { id: 62, name: '王友德', type: '补贴申请', item: '耕地补贴咨询', date: '2026-08-15', time: '14:00', status: '已预约', office: '农业窗口' },
  { id: 63, name: '王友德', type: '证明开具', item: '农业用地证明', date: '2026-07-20', time: '10:00', status: '已完成', office: '综合窗口' }
])
const dataMap = { insurance, subsidy, elderly, telemed, training, appointment }
const currentData = computed(() => dataMap[curTab.value] || [])

// ===== KPI CARDS =====
const kpiCards = computed(() => {
  const key = curTab.value
  if (key === 'insurance') {
    const med = myInsuranceCards[0]
    const totalR = medicalRecords.reduce((s,r)=>s+r.reimburse,0)
    return [
      { icon:'\\u{1F4CB}', value:med?med.status:'--', label:'参保状态', color:'g' },
      { icon:'\\u{1F4B0}', value:med&&med.extra?med.extra:'--', label:'账户信息', color:'b' },
      { icon:'\\u{1F4C5}', value:medicalRecords.length+'次', label:'今年结算', color:'y' },
      { icon:'\\u{1F4C8}', value:'¥'+totalR.toLocaleString(), label:'累计报销', color:'p' }
    ]
  }
  if (key === 'subsidy') {
    const ing = subsidy.filter(s=>s.status!=='已发放').length
    const done = subsidy.filter(s=>s.status==='已发放').length
    const total = subsidy.reduce((s,r)=>s+Number(r.amount),0)
    return [
      { icon:'\\u{1F4CB}', value:availableSubsidies.length+'项', label:'可申请补贴', color:'g' },
      { icon:'\\u{23F3}', value:ing+'项', label:'申请中', color:'y' },
      { icon:'✅', value:done+'项', label:'已发放', color:'b' },
      { icon:'\\u{1F4B0}', value:'¥'+total.toLocaleString(), label:'累计获得', color:'p' }
    ]
  }
  if (key === 'elderly') {
    const alertCnt = elderly.filter(e=>e.status==='重点关注').length
    return [
      { icon:'\\u{1F474}', value:elderly.length+'人', label:'绑定老人', color:'g' },
      { icon:'\\u{2764}', value:elderly[0]?elderly[0].heartRate+'bpm':'--', label:'心率', color:'r' },
      { icon:'\\u{1F4CA}', value:elderly[0]?elderly[0].sleep+'h':'--', label:'睡眠', color:'b' },
      { icon:'\\u{26A0}', value:alertCnt, label:'异常预警', color:'y' }
    ]
  }
  if (key === 'telemed') {
    const done = telemed.filter(t=>t.status==='已完成').length
    const pending = telemed.filter(t=>t.status==='待就诊').length
    const hasRx = telemed.filter(t=>t.prescription&&t.prescription!=='-').length
    return [
      { icon:'\\u{1F4C5}', value:telemed.length+'次', label:'预约数', color:'g' },
      { icon:'✅', value:done+'次', label:'已完成', color:'b' },
      { icon:'\\u{23F3}', value:pending+'次', label:'待就诊', color:'y' },
      { icon:'\\u{1F48A}', value:hasRx+'个', label:'处方数', color:'p' }
    ]
  }
  if (key === 'training') {
    const done = training.filter(t=>t.status==='已完成').length
    const totalH = training.reduce((s,t)=>{const m=t.duration.match(/(\\d+)/);return s+(m?Number(m[1]):0)},0)
    return [
      { icon:'\\u{1F393}', value:availableCourses.length+'个', label:'可报名', color:'g' },
      { icon:'\\u{1F4CB}', value:training.length+'个', label:'已报名', color:'b' },
      { icon:'✅', value:done+'个', label:'已完成', color:'y' },
      { icon:'\\u{23F1}', value:totalH+'h', label:'学习时长', color:'p' }
    ]
  }
  if (key === 'appointment') {
    const done = appointment.filter(a=>a.status==='已完成').length
    const pending = appointment.filter(a=>a.status==='已预约').length
    return [
      { icon:'\\u{1F4CB}', value:'6项', label:'可办事项', color:'g' },
      { icon:'\\u{1F4C5}', value:pending+'项', label:'已预约', color:'b' },
      { icon:'✅', value:done+'项', label:'已办理', color:'y' },
      { icon:'\\u{2B50}', value:'1项', label:'待评价', color:'p' }
    ]
  }
  return []
})

// ===== PAGE SUBTITLE =====
const pageSubtitle = computed(() => {
  const map = {
    insurance: '为您提供个人医保、养老保险及就医服务',
    subsidy: '查看可申请补贴项目，跟踪申请进度',
    elderly: '关爱家庭老人健康，实时监测与预警',
    telemed: '在线预约远程问诊，查看病历与处方',
    training: '报名参加农技培训课程，随时学习',
    appointment: '在线预约政务服务，查询办理进度'
  }
  return map[curTab.value] || ''
})

// ===== QUICK ACTIONS =====
const quickActions = computed(() => {
  const key = curTab.value
  if (key === 'insurance') return [
    { icon:'\\u{1F50D}', label:'医保查询', action: showInsuranceBalance },
    { icon:'\\u{1F4C4}', label:'报销进度', action: showReimburseForm },
    { icon:'\\u{1F3E5}', label:'在线挂号', action: showHospitalReg },
    { icon:'\\u{1F4C3}', label:'缴费记录', action: showPaymentHistory },
    { icon:'\\u{1F30D}', label:'异地备案', action: showRemoteRecord }
  ]
  if (key === 'subsidy') return [
    { icon:'\\u{1F4DD}', label:'申请补贴', action: showSubsidyApply },
    { icon:'\\u{1F50D}', label:'进度查询', action: showSubsidyProgress },
    { icon:'\\u{1F4DC}', label:'政策查询', action: downloadPolicy },
    { icon:'\\u{1F4E5}', label:'材料下载', action: downloadTemplate }
  ]
  if (key === 'elderly') return [
    { icon:'\\u{1F4CA}', label:'健康报告', action: showHealthReport },
    { icon:'\\u{1F691}', label:'一键呼救', action: emergencyCall },
    { icon:'\\u{1F4CD}', label:'位置查看', action: showElderlyLocation },
    { icon:'\\u{2699}', label:'预警设置', action: dispatchAlert }
  ]
  if (key === 'telemed') return [
    { icon:'\\u{1F4F9}', label:'预约问诊', action: showTelemedForm },
    { icon:'\\u{25B6}', label:'进入诊室', action: enterVideoRoom },
    { icon:'\\u{1F4CB}', label:'病历档案', action: showMedicalRecords },
    { icon:'\\u{1F48A}', label:'处方查询', action: showPrescriptions }
  ]
  if (key === 'training') return [
    { icon:'\\u{1F4DD}', label:'课程报名', action: showTrainingReg },
    { icon:'\\u{25B6}', label:'进入直播', action: enterLiveRoom },
    { icon:'\\u{1F4FA}', label:'课程回放', action: showReplayList },
    { icon:'\\u{1F4AC}', label:'问专家', action: askExpert }
  ]
  if (key === 'appointment') return [
    { icon:'\\u{1F4C5}', label:'在线预约', action: showApptForm },
    { icon:'\\u{1F50D}', label:'进度查询', action: showApptProgress },
    { icon:'\\u{1F4DC}', label:'办事指南', action: downloadGuide },
    { icon:'\\u{1F4E5}', label:'材料模板', action: downloadTemplate }
  ]
  return []
})

// ===== LUNAR CALENDAR =====
const calYear = ref(new Date().getFullYear())
const calMonth = ref(new Date().getMonth())
const calSelected = ref(null)
const LUNAR_INFO = { '2026-8-12':'六月廿九','2026-8-15':'七月初三','2026-7-20':'六月初六','2026-8-5':'六月廿二','2026-8-18':'七月初六','2026-8-25':'七月十三' }
function getLunar(y,m,d) { const k=y+'-'+(m+1)+'-'+d; return LUNAR_INFO[k]||'' }
const calendarDays = computed(() => {
  const y=calYear.value, m=calMonth.value
  const first=new Date(y,m,1).getDay(), daysInMonth=new Date(y,m+1,0).getDate(), daysInPrev=new Date(y,m,0).getDate()
  const days=[]
  for(let i=first-1;i>=0;i--){ const d=daysInPrev-i; days.push({d,cur:false,y,m:m-1,key:'p'+d,lunar:''}) }
  for(let d=1;d<=daysInMonth;d++){
    const hasAppt=appointment.some(a=>{const p=a.date.split('-');return Number(p[0])===y&&Number(p[1])===m+1&&Number(p[2])===d})
    days.push({d,cur:true,y,m,key:d,lunar:getLunar(y,m,d),hasAppt})
  }
  let n=1; while(days.length<42){days.push({d:n,cur:false,y,m:m+1,key:'n'+n,lunar:''});n++}
  return days
})
function calPrevMonth(){let m=calMonth.value-1;if(m<0){m=11;calYear.value--}calMonth.value=m;calSelected.value=null}
function calNextMonth(){let m=calMonth.value+1;if(m>11){m=0;calYear.value++}calMonth.value=m;calSelected.value=null}
function calPickDay(y,m,d){calYear.value=y;calMonth.value=m;calSelected.value={y,m,d};showDayAppts(y,m,d)}
function showDayAppts(y,m,d){
  const ds=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0')
  const arr=appointment.filter(a=>a.date===ds)
  if(!arr.length){toast(ds+' 暂无预约','info');return}
  let h='';arr.forEach(a=>{h+='<div style="background:rgba(57,217,138,0.05);border-radius:8px;padding:10px;margin-bottom:6px"><div style="font-weight:600;color:#fff;font-size:12px">'+a.item+'</div><div style="font-size:10px;color:#6F91A8;margin-top:3px">'+a.name+' | '+a.time+' | '+a.office+'</div><span class="tag '+(a.status==='已完成'?'g':'b')+'">'+a.status+'</span></div>'})
  opMod(ds+' 预约列表',h)
}

// ===== TAB-SPECIFIC DETAIL FUNCTIONS =====
function showMedicalDetail(r){
  const h='<dl style="display:grid;grid-template-columns:1fr 2fr;gap:4px 12px;font-size:12px;margin-bottom:14px"><dt style="color:#6F91A8">就诊医院</dt><dd style="color:#fff;font-weight:500">'+r.hospital+'</dd><dt style="color:#6F91A8">就诊日期</dt><dd style="color:#fff;font-weight:500">'+r.date+'</dd><dt style="color:#6F91A8">诊断</dt><dd style="color:#fff;font-weight:500">'+r.diagnosis+'</dd><dt style="color:#6F91A8">总费用</dt><dd style="color:#28C76F;font-weight:600">¥'+r.totalCost.toLocaleString()+'</dd><dt style="color:#6F91A8">医保报销</dt><dd style="color:#28C76F;font-weight:600">¥'+r.reimburse.toLocaleString()+'</dd><dt style="color:#6F91A8">个人支付</dt><dd style="color:#E74C3C;font-weight:600">¥'+r.personalPay.toLocaleString()+'</dd></dl>'
  opMod('\\u{1F3E5} 就诊详情 — '+r.hospital,h)
}
function showTelemedDetail(r){
  let h='<dl style="display:grid;grid-template-columns:1fr 2fr;gap:4px 12px;font-size:12px;margin-bottom:14px">'
  Object.keys(r).forEach(k=>{if(k!=='id')h+='<dt style="color:#6F91A8">'+k+'</dt><dd style="color:#fff;font-weight:500">'+r[k]+'</dd>'})
  h+='</dl>'; opMod('\\u{1F4F9} 问诊详情 — '+r.doctor,h)
}
function showApptDetail(r){
  let h='<dl style="display:grid;grid-template-columns:1fr 2fr;gap:4px 12px;font-size:12px;margin-bottom:14px">'
  Object.keys(r).forEach(k=>{if(k!=='id')h+='<dt style="color:#6F91A8">'+k+'</dt><dd style="color:#fff;font-weight:500">'+r[k]+'</dd>'})
  h+='</dl>'; opMod('\\u{1F4C5} 预约详情 — '+r.item,h)
}
function applySubsidy(s){
  const h='<div style="font-size:12px;color:#fff;margin-bottom:12px">'+s.name+'</div><div style="font-size:11px;color:#6F91A8;margin-bottom:8px">'+s.desc+' | '+s.amount+'</div><div class="fld"><label>备注说明</label><input id="ap_note" placeholder="选填"></div><button class="btn btn-p" style="margin-top:8px" onclick="window._svc.confirmApply()">确认申请</button>'
  opMod('\\u{1F4DD} 申请 '+s.name,h)
}
function confirmApply(){
  subsidy.unshift({id:uid(),name:'王友德',type:'耕地地力保护补贴',amount:3720,status:'审核中',date:new Date().toISOString().split('T')[0],progress:'0%'})
  clsMod(); toast('申请已提交！','ok')
}
function showSubsidyApply(){
  let h=''; availableSubsidies.forEach(s=>{h+='<div style="background:rgba(10,36,68,0.55);padding:10px;border-radius:8px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center"><div><div style="color:#fff;font-weight:600;font-size:12px">'+s.name+'</div><div style="font-size:10px;color:#6F91A8">'+s.desc+' | '+s.amount+'</div></div><button class="btn btn-p btn-s" onclick="window._svc.applyFromList(\\''+s.name+'\\')">申请</button></div>'})
  opMod('\\u{1F4DD} 申请补贴',h)
}
function enrollCourse(c){
  if(confirm('确认报名：'+c.title+'？')){
    training.unshift({id:uid(),title:c.title,teacher:c.teacher,date:c.date,time:c.time,loc:c.loc,duration:c.duration,type:c.type,joined:c.joined+1,limit:c.limit,status:'进行中',progress:'0%'})
    c.joined++; toast('报名成功！','ok')
  }
}
function showTrainingReg(){
  let h=''; availableCourses.forEach(c=>{h+='<div style="background:rgba(10,36,68,0.55);padding:10px;border-radius:8px;margin-bottom:8px"><div style="display:flex;justify-content:space-between;align-items:center"><span style="color:#fff;font-weight:600;font-size:12px">'+c.title+'</span><span class="tag g">'+c.status+'</span></div><div style="font-size:10px;color:#6F91A8;margin-top:4px">'+c.teacher+' | '+c.date+' | '+c.loc+'</div><button class="btn btn-p btn-s" style="margin-top:6px" onclick="window._svc.enrollFromList(\\''+c.title+'\\')">报名</button></div>'})
  opMod('\\u{1F393} 课程报名',h)
}
function showHealthReportFor(e){
  let h='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px;margin-bottom:12px"><div style="text-align:center;background:rgba(10,36,68,0.55);padding:12px;border-radius:6px"><div style="font-size:20px;font-weight:700;color:#E74C3C">'+e.heartRate+'</div><div style="color:#6F91A8">心率 bpm</div></div><div style="text-align:center;background:rgba(10,36,68,0.55);padding:12px;border-radius:6px"><div style="font-size:20px;font-weight:700;color:#28C7FA">'+e.sleep+'h</div><div style="color:#6F91A8">睡眠时长</div></div></div><div style="font-size:11px;color:#6F91A8">健康摘要：'+e.health+'</div><div style="margin-top:8px"><button class="btn btn-p btn-s" onclick="window._svc.sendReport()">\\u{1F4F1} 发送详细报告</button></div>'
  opMod('\\u{1F4CA} 健康报告 — '+e.name,h)
}
function emergencyCallFor(e){if(confirm('确认呼叫急救中心？将发送 '+e.name+' 的位置和健康档案。')){toast('急救中心已响应，预计15分钟内到达','ok')}}

// ===== BUSINESS ACTION HANDLERS =====
function showInsuranceBalance(){
  let h='<div class="fld"><label>身份证号</label><input id="bal_idcard" placeholder="请输入身份证号"></div>'
  h+='<button class="btn btn-p" style="margin-top:8px" onclick="window._svc.queryBalance()">查询</button>'
  opMod('\\u{1F4B3} 医保余额查询',h)
}
function queryBalance(){
  const v=document.getElementById('bal_idcard').value
  if(!v){toast('请输入身份证号','warn');return}
  const r=insurance.find(x=>x.idCard.includes(v.substring(0,6)))
  if(r){toast(r.name+' — 医保余额：'+r.medBalance+' | 养老金：'+r.penMonthly+'/月','ok')}
  else{toast('未找到记录','warn')}
  clsMod()
}
function showReimburseForm(){
  let h='<div class="fld"><label>就诊医院</label><input id="rb_hosp" placeholder="请输入医院名称"></div>'
  h+='<div style="display:flex;gap:10px"><div class="fld" style="flex:1"><label>就诊日期</label><input id="rb_date" type="date"></div><div class="fld" style="flex:1"><label>金额</label><input id="rb_amt" type="number" placeholder="¥"></div></div>'
  h+='<button class="btn btn-p" style="margin-top:8px" onclick="window._svc.submitReimburse()">提交申请</button>'
  opMod('\\u{1F4CB} 报销申请',h)
}
function submitReimburse(){toast('报销申请已提交，预计3个工作日内审核','ok');clsMod()}
function showHospitalReg(){
  let h='<div class="fld"><label>选择医院</label><select><option>安康市人民医院</option><option>汉滨区中医院</option><option>汉滨区人民医院</option><option>安康市中心医院</option></select></div>'
  h+='<div class="fld"><label>科室</label><select><option>内科</option><option>外科</option><option>骨科</option><option>心内科</option></select></div>'
  h+='<div style="display:flex;gap:10px"><div class="fld" style="flex:1"><label>日期</label><input type="date"></div><div class="fld" style="flex:1"><label>时段</label><select><option>上午 08:00-12:00</option><option>下午 14:00-17:00</option></select></div></div>'
  h+='<button class="btn btn-p" style="margin-top:8px" onclick="window._svc.confirmReg()">确认挂号</button>'
  opMod('\\u{1F3E5} 在线挂号',h)
}
function confirmReg(){toast('挂号成功！请按时就诊','ok');clsMod()}
function showPaymentHistory(){
  let h='<table><thead><tr><th>时间</th><th>类型</th><th>金额</th><th>状态</th></tr></thead><tbody>'
  insurance.forEach(r=>{h+='<tr><td>'+r.lastVisit+'</td><td>医保缴费</td><td>¥380</td><td><span class="tag g">已缴纳</span></td></tr>'})
  h+='</tbody></table>'; opMod('\\u{1F4C4} 缴费记录',h)
}
function showRemoteRecord(){
  const h='<div class="fld"><label>就医地</label><select><option>安康市</option><option>西安市</option><option>其他</option></select></div><div class="fld"><label>备案原因</label><select><option>异地长期居住</option><option>转诊转院</option><option>异地急诊</option></select></div><div class="fld"><label>开始日期</label><input id="rr_date" type="date"></div><button class="btn btn-p" style="margin-top:8px" onclick="window._svc.submitRemote()">提交备案</button>'
  opMod('\\u{1F30D} 异地就医备案',h)
}
function submitRemote(){toast('异地就医备案已提交','ok');clsMod()}
function showSubsidyProgress(){
  let h=''; subsidy.forEach(r=>{h+='<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px"><span style="color:#fff;font-weight:600">'+r.name+' - '+r.type+'</span><span class="tag '+(r.status==='已发放'?'g':'y')+'">'+r.status+'</span></div><div class="progress-bar"><div class="fill '+(r.status==='已发放'?'g':'y')+'" style="width:'+(r.progress||'50%')+'"></div></div></div>'})
  opMod('\\u{1F50D} 补贴进度查询',h)
}
function downloadPolicy(){
  const csv='\\uFEFF政策类型,补贴标准,申请条件,联系方式\\n耕地地力保护补贴,120元/亩,拥有耕地承包权,村委会\\n农机购置补贴,购机价35%,新购农机具,农技站\\n低保补助,300元/月,家庭人均收入低于标准,民政局\\n创业补贴,最高8000元,首次创业6个月内,人社局'
  const b=new Blob([csv],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='惠农政策汇总.csv';a.click();toast('政策文件已下载','ok')
}
function emergencyCall(){
  const e=elderly[0]
  if(confirm('确认呼叫急救中心？将发送 '+(e?e.name:'老人')+' 的位置信息和健康档案。')){toast('急救中心已响应，预计15分钟内到达','ok')}
}
function showElderlyLocation(){
  const locs=elderly.map(e=>e.name+' — '+e.addr+' 距离村委会约'+(Math.floor(Math.random()*500+500))+'m')
  toast(locs.join(' | '),'info')
}
function showHealthReport(){
  const r=elderly[0]; if(!r){toast('暂无老人数据','warn');return}; showHealthReportFor(r)
}
function sendReport(){clsMod();toast('详细报告已发送至手机','ok')}
function dispatchAlert(){
  const h='<div style="font-size:11px;color:#6F91A8;margin-bottom:10px">设置预警阈值</div><div class="fld"><label>心率上限(bpm)</label><input id="al_hr" type="number" value="100"></div><div class="fld"><label>睡眠下限(h)</label><input id="al_sleep" type="number" value="5" step="0.5"></div><div class="fld"><label>异常不活动(h)</label><input id="al_inactive" type="number" value="3"></div><button class="btn btn-p" style="margin-top:8px" onclick="window._svc.saveAlert()">保存设置</button>'
  opMod('\\u{2699} 预警设置',h)
}
function saveAlert(){clsMod();toast('预警设置已保存','ok')}
function showTelemedForm(){
  let h='<div class="fld"><label>患者姓名</label><input id="tm_patient"></div>'
  h+='<div style="display:flex;gap:10px"><div class="fld" style="flex:1"><label>科室</label><select id="tm_dept"><option>内科</option><option>骨科</option><option>心内科</option></select></div><div class="fld" style="flex:1"><label>医生</label><select id="tm_doctor"><option>张医生</option><option>李医生</option><option>王医生</option></select></div></div>'
  h+='<div style="display:flex;gap:10px"><div class="fld" style="flex:1"><label>日期</label><input id="tm_date" type="date"></div><div class="fld" style="flex:1"><label>时间</label><input id="tm_time" type="time"></div></div>'
  h+='<button class="btn btn-p" style="margin-top:8px" onclick="window._svc.confirmTelemed()">确认预约</button>'
  opMod('\\u{1F4F9} 预约远程问诊',h)
}
function confirmTelemed(){toast('预约成功！请按时进入诊室','ok');clsMod()}
function enterVideoRoom(){
  let h='<div style="text-align:center;padding:20px"><div style="font-size:60px;margin-bottom:12px">\\u{1F4F9}</div>'
  h+='<div style="font-size:14px;color:#fff;font-weight:600;margin-bottom:4px">正在连接医生…</div>'
  h+='<div style="font-size:11px;color:#6F91A8">您的排班时间：今日 14:30 张医生 内科</div>'
  h+='<div style="margin-top:12px"><button class="btn btn-p" onclick="window._svc.enterRoom()">进入诊室</button></div></div>'
  opMod('\\u{25B6}\\u{FE0F} 视频诊室',h)
}
function enterRoom(){clsMod();toast('诊室连接成功','ok')}
function showMedicalRecords(){
  let h=''; telemed.forEach(r=>{h+='<div class="tl-item"><div class="tl-dot'+(r.status==='已完成'?' g':'')+'"></div><div class="tl-content"><div class="tlt">'+r.date+' '+r.time+' — '+r.doctor+'（'+r.dept+'）</div><div class="tld">诊断：'+r.diagnosis+' | 处方：'+r.prescription+'</div></div></div>'})
  opMod('\\u{1F4CB} 病历档案',h)
}
function showPrescriptions(){
  const arr=telemed.filter(r=>r.prescription&&r.prescription!=='-'); let h=''
  arr.forEach(r=>{h+='<div style="background:rgba(10,36,68,0.55);padding:10px;border-radius:8px;margin-bottom:8px"><div style="font-weight:600;color:#fff;font-size:12px">'+r.patient+' — '+r.doctor+'</div><div style="font-size:11px;color:#28C76F;margin-top:4px">\\u{1F48A} '+r.prescription+'</div><div style="font-size:10px;color:#6F91A8">'+r.date+'</div></div>'})
  opMod('\\u{1F48A} 处方查询',h||'<div style="color:#6F91A8">暂无处方记录</div>')
}
function enterLiveRoom(){toast('直播间：「苹果夏季修剪技术培训」正在直播中，观看人数：42人','info')}
function showReplayList(){toast('课程回放：① 病虫害防治基础(6/12) ② 电商直播入门(6/5) ③ 有机种植技术(5/28)','info')}
function askExpert(){const q=prompt('请输入您的问题：');if(q){toast('已提交问题给专家，预计24小时内回复','ok')}}
function showApptForm(){
  let h='<div class="fld"><label>姓名</label><input id="ap_name"></div>'
  h+='<div style="display:flex;gap:10px"><div class="fld" style="flex:1"><label>业务类型</label><select id="ap_type"><option>证件办理</option><option>补贴申请</option><option>证明开具</option></select></div><div class="fld" style="flex:1"><label>窗口</label><select id="ap_office"><option>户籍窗口</option><option>农业窗口</option><option>综合窗口</option></select></div></div>'
  h+='<div class="fld"><label>具体事项</label><input id="ap_item"></div>'
  h+='<div style="display:flex;gap:10px"><div class="fld" style="flex:1"><label>日期</label><input id="ap_date" type="date"></div><div class="fld" style="flex:1"><label>时间</label><input id="ap_time" type="time"></div></div>'
  h+='<button class="btn btn-p" style="margin-top:8px" onclick="window._svc.confirmAppt()">确认预约</button>'
  opMod('\\u{1F4C5} 在线预约',h)
}
function confirmAppt(){
  const n=document.getElementById('ap_name').value
  if(!n){toast('请填写姓名','warn');return}
  appointment.unshift({id:uid(),name:n,type:document.getElementById('ap_type').value,item:document.getElementById('ap_item').value,date:document.getElementById('ap_date').value,time:document.getElementById('ap_time').value,status:'已预约',office:document.getElementById('ap_office').value})
  clsMod();toast('预约成功！','ok')
}
function showApptProgress(){
  let h=''; appointment.forEach(r=>{h+='<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(14,165,233,0.06)"><div><span style="color:#fff;font-weight:600">'+r.item+'</span><span style="color:#6F91A8;font-size:10px;margin-left:8px">'+r.date+' '+r.time+'</span></div><span class="tag '+(r.status==='已完成'?'g':'b')+'">'+r.status+'</span></div>'})
  opMod('\\u{1F50D} 预约进度',h)
}
function downloadGuide(){
  const csv='\\uFEFF事项,所需材料,办理窗口,办理时限,咨询电话\\n身份证换领,原身份证+户口本,户籍窗口,15个工作日,12345\\n农业补贴申请,土地承包证+身份证,农业窗口,7个工作日,12345\\n农业用地证明,土地承包证+村委会证明,综合窗口,3个工作日,12345'
  const b=new Blob([csv],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='办事指南.csv';a.click();toast('办事指南已下载','ok')
}
function downloadTemplate(){
  const csv='\\uFEFF材料名称,模板说明,下载地址\\n农业补贴申请表,需村委盖章,村委会领取\\n身份证换领申请表,现场填写,户籍窗口\\n农业用地证明模板,村委统一格式,综合窗口'
  const b=new Blob([csv],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='材料模板列表.csv';a.click();toast('材料模板列表已下载','ok')
}

// ===== ECHARTS =====
let chartInstance=null
function disposeChart(){if(chartInstance){chartInstance.dispose();chartInstance=null}}
function initCurrentChart(){
  disposeChart();const key=curTab.value
  if(key==='insurance')initInsTrendChart()
  else if(key==='subsidy')initSubPieChart()
  else if(key==='elderly')initElderChart()
  else if(key==='telemed')initTelePieChart()
  else if(key==='training')initTrainChart()
  else if(key==='appointment')initApptPieChart()
}
function initInsTrendChart(){
  const el=document.getElementById('chart_ins_trend');if(!el)return;chartInstance=echarts.init(el)
  chartInstance.setOption({title:{text:'我的报销趋势（近6个月）',textStyle:{color:'#6b7a8d',fontSize:11,fontWeight:400},left:0,top:-6},tooltip:{trigger:'axis',backgroundColor:'#ffffff',borderColor:'rgba(57,217,138,0.30)',textStyle:{color:'#1e293b',fontSize:10}},grid:{left:8,right:20,top:28,bottom:24},xAxis:{type:'category',data:['1月','2月','3月','4月','5月','6月'],axisLabel:{color:'#6b7a8d',fontSize:9},axisLine:{lineStyle:{color:'rgba(4,62,107,0.12)'}}},yAxis:{type:'value',name:'¥',axisLabel:{color:'#6b7a8d',fontSize:9},splitLine:{lineStyle:{color:'rgba(14,165,233,0.06)'}}},series:[{type:'bar',data:[180,0,320,860,125,1250],barWidth:16,itemStyle:{borderRadius:[3,3,0,0],color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#28C7FA'},{offset:1,color:'rgba(57,217,138,0.20)'}])}},{type:'line',data:[180,0,320,860,125,1250],smooth:true,lineStyle:{color:'#39D98A',width:2},itemStyle:{color:'#39D98A'},symbol:'circle',symbolSize:6}]})
}
function initSubPieChart(){
  const el=document.getElementById('chart_sub_pie');if(!el)return;chartInstance=echarts.init(el)
  chartInstance.setOption({title:{text:'我的补贴构成',textStyle:{color:'#6b7a8d',fontSize:11,fontWeight:400},left:0,top:-6},tooltip:{trigger:'item',backgroundColor:'#ffffff',borderColor:'rgba(57,217,138,0.30)',textStyle:{color:'#1e293b',fontSize:10}},series:[{type:'pie',radius:['50%','72%'],center:['50%','50%'],itemStyle:{borderColor:'rgba(8,28,58,0.92)',borderWidth:2},label:{color:'#6b7a8d',fontSize:9},data:[{value:6200,name:'耕地补贴',itemStyle:{color:'#28C7FA'}},{value:5000,name:'农机补贴',itemStyle:{color:'#39D98A'}},{value:3600,name:'低保补助',itemStyle:{color:'#f59e0b'}}]}]})
}
function initElderChart(){
  const el=document.getElementById('chart_elder_health');if(!el)return;chartInstance=echarts.init(el)
  chartInstance.setOption({title:{text:'老人健康趋势（近7天）',textStyle:{color:'#6b7a8d',fontSize:11,fontWeight:400},left:0,top:-6},tooltip:{trigger:'axis',backgroundColor:'#ffffff',borderColor:'rgba(57,217,138,0.30)',textStyle:{color:'#1e293b',fontSize:10}},grid:{left:8,right:20,top:30,bottom:24},legend:{data:['心率','睡眠'],textStyle:{color:'#6b7a8d',fontSize:9},top:0,right:0},xAxis:{type:'category',data:['6/12','6/13','6/14','6/15','6/16','6/17','6/18'],axisLabel:{color:'#6b7a8d',fontSize:9}},yAxis:[{type:'value',name:'bpm',axisLabel:{color:'#6b7a8d',fontSize:9},splitLine:{lineStyle:{color:'rgba(14,165,233,0.06)'}}},{type:'value',name:'h',axisLabel:{color:'#6b7a8d',fontSize:9}}],series:[{name:'心率',type:'line',data:[72,75,70,78,88,95,88],yAxisIndex:0,smooth:true,lineStyle:{color:'#E74C3C',width:2},itemStyle:{color:'#E74C3C'}},{name:'睡眠',type:'bar',data:[6.5,6.2,5.8,5.5,4.2,5.1,5.0],yAxisIndex:1,barWidth:12,itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#28C7FA'},{offset:1,color:'rgba(139,92,246,.2)'}]),borderRadius:[3,3,0,0]}}]})
}
function initTelePieChart(){
  const el=document.getElementById('chart_tele_pie');if(!el)return;chartInstance=echarts.init(el)
  chartInstance.setOption({title:{text:'问诊科室分布',textStyle:{color:'#6b7a8d',fontSize:11,fontWeight:400},left:0,top:-6},tooltip:{trigger:'item',backgroundColor:'#ffffff',borderColor:'rgba(57,217,138,0.30)',textStyle:{color:'#1e293b',fontSize:10}},series:[{type:'pie',radius:['50%','72%'],center:['50%','50%'],itemStyle:{borderColor:'rgba(8,28,58,0.92)',borderWidth:2},label:{color:'#6b7a8d',fontSize:9},data:[{value:2,name:'内科',itemStyle:{color:'#28C7FA'}},{value:1,name:'骨科',itemStyle:{color:'#39D98A'}},{value:1,name:'心内科',itemStyle:{color:'#E74C3C'}}]}]})
}
function initTrainChart(){
  const el=document.getElementById('chart_train_bar');if(!el)return;chartInstance=echarts.init(el)
  chartInstance.setOption({title:{text:'课程报名情况',textStyle:{color:'#6b7a8d',fontSize:11,fontWeight:400},left:0,top:-6},tooltip:{trigger:'axis',backgroundColor:'#ffffff',borderColor:'rgba(57,217,138,0.30)',textStyle:{color:'#1e293b',fontSize:10}},grid:{left:8,right:30,top:28,bottom:24},xAxis:{type:'category',data:['病虫害防治','电商直播','智慧农业'],axisLabel:{color:'#6b7a8d',fontSize:9,rotate:15},axisLine:{lineStyle:{color:'rgba(4,62,107,0.12)'}}},yAxis:{type:'value',name:'人',axisLabel:{color:'#6b7a8d',fontSize:9},splitLine:{lineStyle:{color:'rgba(14,165,233,0.06)'}}},series:[{type:'bar',barWidth:28,itemStyle:{borderRadius:[3,3,0,0]},data:[{value:22,itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#28C7FA'},{offset:1,color:'rgba(57,217,138,0.20)'}])}},{value:35,itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#39D98A'},{offset:1,color:'rgba(16,214,160,.2)'}])}},{value:20,itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#28C7FA'},{offset:1,color:'rgba(139,92,246,.2)'}])}}]}]})
}
function initApptPieChart(){
  const el=document.getElementById('chart_appt_pie');if(!el)return;chartInstance=echarts.init(el)
  chartInstance.setOption({title:{text:'业务类型分布',textStyle:{color:'#6b7a8d',fontSize:11,fontWeight:400},left:0,top:-6},tooltip:{trigger:'item',backgroundColor:'#ffffff',borderColor:'rgba(57,217,138,0.30)',textStyle:{color:'#1e293b',fontSize:10}},series:[{type:'pie',radius:['50%','72%'],center:['50%','50%'],itemStyle:{borderColor:'rgba(8,28,58,0.92)',borderWidth:2},label:{color:'#6b7a8d',fontSize:9},data:[{value:1,name:'证件办理',itemStyle:{color:'#28C7FA'}},{value:1,name:'补贴申请',itemStyle:{color:'#39D98A'}},{value:1,name:'证明开具',itemStyle:{color:'#f59e0b'}}]}]})
}

// Watch tab changes
watch(curTab,async()=>{await nextTick();setTimeout(()=>initCurrentChart(),150)})

// ===== HASH ROUTING =====
function handleHash(){
  const hash=window.location.hash.replace('#','')
  if(!hash)return
  const validTabs=tabs.map(t=>t.key)
  if(validTabs.indexOf(hash)>=0&&hash!==curTab.value){switchTab(hash)}
}

// ===== EXPOSE HANDLERS =====
onMounted(()=>{
  window._svc={clsMod,queryBalance,submitReimburse,confirmReg,sendReport,confirmTelemed,enterRoom,confirmAppt,confirmApply,saveAlert,submitRemote,applyFromList:(name)=>{clsMod();const s=availableSubsidies.find(x=>x.name===name);if(s)applySubsidy(s)},enrollFromList:(title)=>{clsMod();const c=availableCourses.find(x=>x.title===title);if(c)enrollCourse(c)}}
  window.addEventListener('hashchange',handleHash);setTimeout(handleHash,100);nextTick(()=>setTimeout(()=>initCurrentChart(),200))
})
onUnmounted(()=>{disposeChart();delete window._svc;window.removeEventListener('hashchange',handleHash)})
</script>

<style scoped>
.svc-page { min-height:100vh; background:#071B2D; color:#B7D3E8; display:flex; flex-direction:column; }

/* Header */
.hdr { height:48px; display:flex; align-items:center; justify-content:space-between; padding:0 16px; background:linear-gradient(180deg,rgba(10,50,100,0.15),rgba(6,20,44,0.05)); border-bottom:1px solid rgba(0,0,0,0.06); flex-shrink:0; }
.hdr-l { font-size:14px; font-weight:700; color:#fff; letter-spacing:1px; display:flex; align-items:center; gap:10px; }
.hdr-l a,.hdr-r a { color:#6F91A8; text-decoration:none; }
.hdr-r { display:flex; align-items:center; gap:14px; font-size:10px; color:#6F91A8; }

/* Tab bar */
.tab-bar { display:flex; gap:0; padding:0 12px; background:rgba(10,36,68,0.40); border-bottom:1px solid rgba(0,0,0,0.12); overflow-x:auto; flex-shrink:0; }
.tab-btn { background:none; border:none; border-bottom:2px solid transparent; color:#6F91A8; font-size:13px; padding:12px 18px; cursor:pointer; white-space:nowrap; transition:all 0.2s; font-family:inherit; }
.tab-btn:hover { color:#B7D3E8; }
.tab-btn.on { color:#39D98A; border-bottom-color:#39D98A; }

/* Main content */
.main-content { flex:1; overflow-y:auto; padding:24px 28px 32px; }
.content { width:100%; }

/* Page Title */
.page-title-bar { margin-bottom:18px; }
.page-title { font-size:20px; font-weight:700; color:#fff; letter-spacing:0.5px; }
.page-subtitle { font-size:13px; color:#6F91A8; margin-top:4px; }

/* KPI */
.kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; }
.kpi-card { background:rgba(10,36,68,0.55); border:1px solid rgba(255,255,255,0.04); border-radius:12px; padding:18px 20px; display:flex; flex-direction:column; gap:8px; }
.kpi-icon { font-size:28px; line-height:1; }
.kpi-val { font-size:26px; font-weight:700; color:#fff; line-height:1.1; }
.kpi-lbl { font-size:12px; color:#6F91A8; }
.kpi-card.g .kpi-val { color:#28C76F; }
.kpi-card.b .kpi-val { color:#28C7FA; }
.kpi-card.y .kpi-val { color:#F5B83D; }
.kpi-card.r .kpi-val { color:#E74C3C; }
.kpi-card.p .kpi-val { color:#A78BFA; }

/* Quick Actions */
.qa-label { font-size:13px; font-weight:600; color:#6F91A8; margin-bottom:10px; }
.qa-row { display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap; }
.qa-btn { background:rgba(40,199,111,0.08); border:1px solid rgba(40,199,111,0.14); color:#39D98A; padding:10px 18px; border-radius:8px; font-size:13px; cursor:pointer; white-space:nowrap; transition:all 0.2s; font-family:inherit; }
.qa-btn:hover { background:rgba(40,199,111,0.16); border-color:rgba(40,199,111,0.30); }

/* Section card */
.section-card { background:rgba(10,36,68,0.55); border:1px solid rgba(255,255,255,0.04); border-radius:12px; padding:18px 20px; margin-bottom:14px; }

/* Section title */
.section-title { font-size:14px; font-weight:700; color:#B7D3E8; margin-bottom:12px; }

/* Data table */
.data-table { width:100%; border-collapse:collapse; font-size:13px; }
.data-table th { background:rgba(10,36,68,0.40); color:#6F91A8; font-size:11px; font-weight:600; padding:10px 12px; text-align:left; border-bottom:2px solid rgba(57,217,138,0.08); }
.data-table td { padding:10px 12px; border-bottom:1px solid rgba(14,165,233,0.06); color:#B7D3E8; }
.data-table tr:hover td { background:rgba(57,217,138,0.04); }

/* Tags */
.tag { font-size:11px; padding:2px 8px; border-radius:10px; font-weight:600; }
.tag.g { background:rgba(40,199,111,0.12); color:#28C76F; }
.tag.b { background:rgba(40,199,250,0.12); color:#28C7FA; }
.tag.y { background:rgba(245,184,61,0.12); color:#F5B83D; }
.tag.r { background:rgba(231,76,60,0.12); color:#E74C3C; }
.tag.dim { background:rgba(111,145,168,0.12); color:#6F91A8; }

/* Progress bar */
.progress-bar { height:6px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden; }
.progress-bar .fill { height:100%; border-radius:3px; transition:width 0.4s; }
.progress-bar .fill.g { background:linear-gradient(90deg,#28C76F,#39D98A); }
.progress-bar .fill.y { background:linear-gradient(90deg,#F5B83D,#f59e0b); }
.progress-bar .fill.b { background:linear-gradient(90deg,#28C7FA,#0EA5E9); }

/* Buttons */
.btn { border:none; border-radius:8px; padding:8px 18px; font-size:12px; cursor:pointer; font-family:inherit; transition:all 0.2s; }
.btn-p { background:rgba(57,217,138,0.15); color:#39D98A; }
.btn-p:hover { background:rgba(57,217,138,0.25); }
.btn-d { background:rgba(231,76,60,0.12); color:#E74C3C; }
.btn-d:hover { background:rgba(231,76,60,0.22); }
.btn-o { background:rgba(111,145,168,0.12); color:#6F91A8; }
.btn-o:hover { background:rgba(111,145,168,0.22); }
.btn-s { padding:5px 10px; font-size:10px; border-radius:6px; }

/* Form fields */
.fld { margin-bottom:8px; }
.fld label { display:block; font-size:10px; color:#6F91A8; margin-bottom:4px; }
.fld input,.fld select { width:100%; background:rgba(10,36,68,0.60); border:1px solid rgba(14,165,233,0.12); border-radius:6px; padding:7px 10px; color:#fff; font-size:12px; font-family:inherit; box-sizing:border-box; }
.fld input:focus,.fld select:focus { outline:none; border-color:rgba(57,217,138,0.40); }

/* Modal */
.mod-over { position:fixed; inset:0; background:rgba(0,0,0,0.72); display:flex; align-items:center; justify-content:center; z-index:999; }
.mod-box { background:#0A1E36; border:1px solid rgba(57,217,138,0.15); border-radius:14px; width:min(520px,90vw); max-height:75vh; overflow-y:auto; padding:20px; box-shadow:0 8px 32px rgba(0,0,0,0.55); }
.mod-hd { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; font-size:13px; font-weight:700; color:#fff; }
.mod-x { background:none; border:none; color:#6F91A8; font-size:20px; cursor:pointer; }

/* Toast */
.toast-bar { position:fixed; top:56px; right:16px; z-index:9999; display:flex; flex-direction:column; gap:6px; }
.toast { font-size:12px; padding:9px 18px; border-radius:8px; color:#fff; background:rgba(10,36,68,0.92); border:1px solid rgba(57,217,138,0.20); box-shadow:0 4px 16px rgba(0,0,0,0.30); min-width:160px; animation:toastIn 0.25s; }
.toast.ok { border-left:3px solid #28C76F; }
.toast.info { border-left:3px solid #28C7FA; }
.toast.warn { border-left:3px solid #F5B83D; }
@keyframes toastIn { from{opacity:0;transform:translateX(30px);} to{opacity:1;transform:translateX(0);} }

/* Timeline */
.tl-item { display:flex; gap:10px; padding:6px 0; }
.tl-dot { width:8px; height:8px; border-radius:50%; background:#28C7FA; margin-top:4px; flex-shrink:0; }
.tl-dot.g { background:#28C76F; }
.tlt { font-size:11px; color:#fff; }
.tld { font-size:10px; color:#6F91A8; margin-top:2px; }

/* Insurance cards */
.insure-cards { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
.insure-card { background:rgba(10,36,68,0.40); border:1px solid rgba(40,199,111,0.08); border-radius:12px; padding:16px 20px; display:flex; justify-content:space-between; align-items:center; }
.ic-type { font-size:15px; font-weight:700; color:#fff; }
.ic-status { font-size:11px; margin-top:4px; }
.ic-status.g { color:#28C76F; }
.ic-status.y { color:#F5B83D; }
.ic-year { font-size:11px; color:#6F91A8; margin-top:4px; }
.ic-extra { font-size:14px; color:#28C76F; font-weight:600; }

/* Subsidy cards */
.subsidy-cards { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
.subsidy-card { background:rgba(10,36,68,0.40); border:1px solid rgba(40,199,111,0.08); border-radius:12px; padding:14px 16px; display:flex; align-items:center; gap:12px; cursor:pointer; transition:all 0.2s; }
.subsidy-card:hover { background:rgba(40,199,111,0.06); border-color:rgba(40,199,111,0.18); }
.sc-icon { font-size:30px; }
.sc-info { flex:1; }
.sc-name { font-size:13px; font-weight:600; color:#fff; }
.sc-desc { font-size:11px; color:#6F91A8; margin-top:2px; }
.sc-amount { font-size:14px; font-weight:700; color:#28C76F; }

/* Elderly cards */
.elder-cards { display:flex; flex-direction:column; gap:10px; }
.elder-card { background:rgba(10,36,68,0.40); border:1px solid rgba(255,255,255,0.04); border-radius:12px; padding:16px 18px; display:flex; align-items:center; gap:16px; }
.ec-avatar { font-size:40px; }
.ec-info { flex:1; }
.ec-name { font-size:14px; font-weight:600; color:#fff; }
.ec-addr { font-size:11px; color:#6F91A8; margin-top:2px; }
.ec-meta { margin-top:4px; }
.ec-health { display:flex; gap:16px; }
.ech-item { text-align:center; }
.ech-val { font-size:18px; font-weight:700; }
.ech-lbl { font-size:10px; color:#6F91A8; }
.ec-actions { display:flex; flex-direction:column; gap:4px; }

/* Course cards */
.course-cards { display:flex; flex-direction:column; gap:10px; }
.course-card { background:rgba(10,36,68,0.40); border:1px solid rgba(255,255,255,0.04); border-radius:12px; padding:14px 16px; display:flex; align-items:center; gap:14px; }
.cc-header { display:flex; align-items:center; gap:8px; min-width:200px; }
.cc-title { font-size:13px; font-weight:600; color:#fff; }
.cc-body { flex:1; }
.cc-meta { font-size:11px; color:#6F91A8; }

/* Appointment layout */
.apt-layout { display:grid; grid-template-columns:280px 1fr; gap:20px; }
.apt-cal { background:rgba(10,36,68,0.40); border:1px solid rgba(255,255,255,0.04); border-radius:12px; padding:14px; }
.cal-header { display:flex; align-items:center; justify-content:center; margin-bottom:8px; }
.cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
.cal-day-hd { font-size:10px; color:#6F91A8; text-align:center; padding:4px 0; font-weight:600; }
.cal-day { font-size:12px; color:#B7D3E8; text-align:center; padding:5px 2px; border-radius:6px; cursor:pointer; position:relative; }
.cal-day.dim { color:#3a5068; cursor:default; }
.cal-day:hover:not(.dim) { background:rgba(57,217,138,0.08); }
.cal-day.selected { background:rgba(57,217,138,0.18); color:#39D98A; font-weight:700; }
.lunar { font-size:8px; display:block; color:#6F91A8; }
.cal-dot { width:4px; height:4px; background:#39D98A; border-radius:50%; display:block; margin:1px auto 0; }
.apt-item { background:rgba(10,36,68,0.45); border-radius:8px; padding:10px 12px; margin-bottom:6px; transition:background 0.2s; }
.apt-item:hover { background:rgba(57,217,138,0.05); }
.apt-item-hd { display:flex; justify-content:space-between; align-items:center; }
.apt-item-meta { font-size:11px; color:#6F91A8; margin-top:4px; }

/* Chart */
.chart-block { background:rgba(10,36,68,0.55); border:1px solid rgba(255,255,255,0.04); border-radius:12px; padding:18px 20px; margin-bottom:14px; }
</style>`;

fs.writeFileSync(fp, out, 'utf-8');
console.log('ServicePage.vue v2 generated:', out.length, 'chars');
