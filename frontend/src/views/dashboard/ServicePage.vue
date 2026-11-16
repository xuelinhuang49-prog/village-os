<template>
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

    <!-- ===== LIVE STREAM FLOATING CARD ===== -->
    <div v-if="liveCard.vis" class="live-float-card">
      <div class="lfc-header">
        <span>&#x1F4FA; 当前直播</span>
        <button class="lfc-close" @click="closeLiveCard">&times;</button>
      </div>
      <template v-if="liveCard.isLive">
        <div class="lfc-course-name">{{ liveCard.course.title }}</div>
        <div class="lfc-meta">
          <div>&#x1F468;&#x200D;&#x1F3EB; {{ liveCard.course.teacher }}</div>
          <div>&#x1F4C5; 今天 {{ liveCard.course.time }} 开始</div>
          <div>&#x1F4CD; {{ liveCard.course.loc }}</div>
        </div>
        <div class="lfc-status-live">&#x1F7E2; 直播状态：正在直播</div>
        <button class="lfc-btn lfc-btn-primary" @click="enterLiveStream(liveCard.course)">进入直播</button>
      </template>
      <template v-else>
        <div class="lfc-no-live">当前暂无正在进行的直播课程</div>
        <template v-if="liveCard.nextCourse">
          <div class="lfc-divider"></div>
          <div class="lfc-next-label">下一场：</div>
          <div class="lfc-course-name">{{ liveCard.nextCourse.title }}</div>
          <div class="lfc-meta" style="margin-bottom:12px">&#x1F4C5; {{ liveCard.nextCourse.date }} {{ liveCard.nextCourse.time }}</div>
          <button class="lfc-btn lfc-btn-outline" @click="showCourseDetail(liveCard.nextCourse);closeLiveCard()">查看课程详情</button>
        </template>
      </template>
    </div>

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
                  <td style="color:#22B573;font-family:monospace">&yen;{{ r.reimburse.toLocaleString() }}</td>
                  <td style="color:#E05252;font-family:monospace">&yen;{{ r.personalPay.toLocaleString() }}</td>
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
              <thead><tr><th>申请编号</th><th>补贴类型</th><th>金额</th><th>申请日期</th><th>状态</th><th>进度</th><th>操作</th></tr></thead>
              <tbody>
                <tr v-for="r in subsidy" :key="r.id">
                  <td style="font-family:monospace;font-size:11px">{{ r.appNo }}</td>
                  <td>{{ r.type }}</td>
                  <td style="color:#22B573;font-family:monospace">&yen;{{ Number(r.amount).toLocaleString() }}</td>
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
          </div>
        </div>

        <!-- Elderly: 家庭老人健康卡片 -->
        <div v-if="curTab==='elderly'" class="tab-content">
          <div class="section-card">
            <div class="section-title">&#x1F474; 我的家庭老人</div>
            <div class="elder-cards">
              <div class="elder-card" v-for="e in elderly" :key="e.id">
                <div class="ec-avatar">{{ e.gender === '男' ? '&#x1F468;' : '&#x1F469;' }}</div>
                <div class="ec-info">
                  <div class="ec-name">{{ e.name }} <span style="font-size:10px;color:#66788A">{{ e.age }}岁</span><span class="ec-relation">{{ e.relation }}</span></div>
                  <div class="ec-addr">📍 {{ e.addr }}<span style="font-size:10px;color:#66788A;margin-left:6px">{{ e.living }}</span></div>
                  <div class="ec-meta">
                    <span class="tag" :class="e.status==='正常'?'g':e.status==='重点关注'?'r':'y'">{{ e.status }}</span>
                    <span style="font-size:10px;color:#66788A;margin-left:6px">{{ e.device }}</span>
                  </div>
                </div>
                <div class="ec-health">
                  <div class="ech-item"><div class="ech-val" style="color:#E05252">{{ e.heartRate }}</div><div class="ech-lbl">心率bpm</div></div>
                  <div class="ech-item"><div class="ech-val" style="color:#0EA5E9">{{ e.sleep }}</div><div class="ech-lbl">睡眠h</div></div>
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
                  <td>{{ r.status==='已完成' ? r.diagnosis : r.symptom }}</td>
                  <td><span class="tag" :class="telemedStatus(r)==='已完成'?'g':telemedStatus(r)==='已过期'?'r':'y'">{{ telemedStatus(r) }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Training: 可报名课程 + 我的培训 + 近期培训提醒 -->
        <div v-if="curTab==='training'" class="tab-content">
          <!-- 可报名课程 -->
          <div class="section-card" id="available-courses-section">
            <div class="section-title">&#x1F393; 可报名课程</div>
            <div class="course-cards">
              <div class="course-card" v-for="c in availableCoursesComputed" :key="c.id">
                <div class="cc-left">
                  <div class="cc-header">
                    <span class="cc-title">{{ c.title }}</span>
                    <span class="tag" :class="c.status==='报名中'?'g':'dim'">{{ c.status }}</span>
                  </div>
                  <div class="cc-body">
                    <div class="cc-meta-row">
                      <span class="cc-meta-label">培训方式</span>
                      <span class="cc-meta-val">{{ getTypeLabel(c) }}</span>
                      <span class="cc-meta-label">培训时间</span>
                      <span class="cc-meta-val">{{ c.date }} {{ c.time }}</span>
                    </div>
                    <div class="cc-meta-row">
                      <span class="cc-meta-label">{{ c.type==='LIVE'||c.type==='ONLINE'?'直播平台':'地点' }}</span>
                      <span class="cc-meta-val">{{ c.loc }}</span>
                      <span class="cc-meta-label">讲师</span>
                      <span class="cc-meta-val">{{ c.teacher }}</span>
                    </div>
                    <div class="cc-meta-row">
                      <span class="cc-meta-label">课程时长</span>
                      <span class="cc-meta-val">{{ c.duration }}</span>
                      <span class="cc-meta-label">报名人数</span>
                      <span class="cc-meta-val">已报{{ c.joined }}/{{ c.limit }}人</span>
                    </div>
                  </div>
                </div>
                <div class="cc-right">
                  <button v-if="!isEnrolled(c.id)" class="btn btn-p btn-s" @click="showCourseDetail(c)">查看详情</button>
                  <button v-if="!isEnrolled(c.id)" class="btn btn-p btn-s" style="margin-top:6px" @click="showCourseDetail(c)">立即报名</button>
                  <template v-if="isEnrolled(c.id)">
                    <span class="tag g" style="margin-bottom:6px">已报名</span>
                    <button v-if="canCancelEnroll(c)" class="btn btn-d btn-s" @click="cancelEnroll(c)">取消报名</button>
                  </template>
                </div>
              </div>
              <div v-if="!availableCoursesComputed.length" style="color:#66788A;text-align:center;padding:30px 0;font-size:13px">暂无可报名课程</div>
            </div>
          </div>

          <!-- 我的培训 -->
          <div class="section-card" style="margin-top:14px">
            <div class="section-title" id="my-training-section">&#x1F4DA; 我的培训</div>
            <table class="data-table">
              <thead><tr><th>课程名称</th><th>培训方式</th><th>培训时间</th><th>状态</th><th>操作</th></tr></thead>
              <tbody>
                <tr v-for="r in myTrainingList" :key="r.id">
                  <td>{{ r.title }}</td>
                  <td>{{ getTypeLabel(r) }}</td>
                  <td>{{ r.date }} {{ r.time }}</td>
                  <td><span class="tag" :class="r.displayStatus==='已完成'?'g':r.displayStatus==='进行中'?'b':'y'">{{ r.displayStatus }}</span></td>
                  <td>
                    <button v-if="r.displayStatus==='已完成'&&r.replayStatus==='PUBLISHED'" class="btn btn-p btn-s" @click="showReplayFor(r)">查看回放</button>
                    <button v-if="r.displayStatus==='进行中'&&(r.type==='LIVE'||r.type==='ONLINE')&&r.isLive" class="btn btn-g btn-s" @click="enterLiveStream(r)">进入直播</button>
                    <button v-else-if="r.displayStatus==='进行中'&&(r.type==='LIVE'||r.type==='ONLINE')" class="btn btn-p btn-s" @click="continueLearning(r)">继续学习</button>
                    <button class="btn btn-o btn-s" @click="showTrainingDetail(r)" style="margin-left:4px">查看详情</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="!myTrainingList.length" style="color:#66788A;text-align:center;padding:30px 0;font-size:13px">暂无培训记录</div>
          </div>

          <!-- 近期培训提醒 -->
          <div class="section-card" style="margin-top:14px">
            <div class="section-title">&#x1F4C5; 近期培训提醒</div>
            <div v-if="upcomingTraining.length>0" class="training-reminder">
              <div v-for="(t,idx) in upcomingTraining" :key="t.id" class="tr-card" :style="idx>0?'margin-top:8px':''">
                <div class="tr-info">
                  <div class="tr-course-name">{{ t.title }}</div>
                  <div class="tr-meta">
                    <span>&#x1F4C5; {{ t.date }} {{ t.time }}</span>
                    <span>&#x1F4CD; {{ t.loc }}</span>
                    <span>&#x1F468;‍&#x1F3EB; {{ t.teacher }}</span>
                  </div>
                  <div class="tr-hint">{{ t.type==='LIVE'?'&#x23F0; 您已报名，开课后可进入直播':'&#x23F0; 您已报名，请提前10分钟到场' }}</div>
                </div>
                <div class="tr-action">
                  <button class="btn btn-p btn-s" @click="showTrainingDetail(t)">查看详情</button>
                </div>
              </div>
              <div v-if="upcomingCount>3" style="text-align:center;margin-top:10px">
                <a href="javascript:void(0)" @click="scrollToMyTraining" style="color:#0EA5E9;font-size:12px;text-decoration:none">查看全部培训 &#x2192;</a>
              </div>
            </div>
            <div v-else style="color:#66788A;text-align:center;padding:30px 0;font-size:13px">近期暂无已报名培训</div>
          </div>
        </div>

        <!-- Appointment: 日历 + 我的预约 -->
        <div v-if="curTab==='appointment'" class="tab-content">
          <!-- 可预约事项 -->
          <div class="section-card" style="margin-bottom:14px">
            <div class="section-title">&#x1F4CB; 可预约事项</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:4px">
              <div v-for="svc in governmentServices" :key="svc.id" class="svc-service-card">
                <div class="svc-sc-name">{{ svc.name }}</div>
                <div class="svc-sc-meta">{{ svc.window }} · {{ svc.duration }}</div>
                <div style="display:flex;gap:6px;margin-top:8px">
                  <button class="btn btn-o btn-s" @click="showServiceGuide(svc.id)">查看指南</button>
                  <button class="btn btn-p btn-s" @click="showApptForm(svc.id)">立即预约</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 预约日历 + 我的预约 -->
          <div class="section-card">
            <div class="apt-layout">
              <div class="apt-cal">
                <div class="cal-header">
                  <button class="btn btn-o btn-s" @click="calPrevMonth">&#x25C0;</button>
                  <span style="color:#1F2D3D;font-weight:600;font-size:13px;margin:0 8px">{{ calYear }}年{{ calMonth + 1 }}月</span>
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
                <div v-if="!appointment.length" style="color:#66788A;font-size:11px;padding:12px">暂无预约记录</div>
                <div v-for="r in appointment" :key="r.id" class="apt-item" @click="showApptDetail(r)" style="cursor:pointer">
                  <div class="apt-item-hd">
                    <span style="color:#1F2D3D;font-weight:600;font-size:12px">{{ r.serviceName }}</span>
                    <span class="tag" :class="r.status==='已完成'?'g':r.status==='已预约'?'b':r.status==='已取消'?'dim':'y'">{{ r.status }}</span>
                  </div>
                  <div class="apt-item-meta">{{ r.date }} {{ r.time }} | {{ r.window }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart Area -->
        <div class="chart-block" v-if="curTab==='insurance'"><div id="chart_ins_trend" style="width:100%;height:240px"></div></div>
        <div class="chart-block chart-block-sm" v-if="curTab==='subsidy'" style="display:flex;align-items:center;gap:20px;padding:14px 20px">
          <div id="chart_sub_pie" style="width:170px;height:170px;flex-shrink:0"></div>
          <div class="subsidy-chart-detail" style="flex:1;min-width:0">
            <div v-for="d in subsidyChartDetail" :key="d.name" style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid #EBEFF4">
              <span style="font-size:12px;color:#1F2D3D"><span :style="{display:'inline-block',width:'8px',height:'8px',borderRadius:'2px',background:d.color,marginRight:'8px'}"></span>{{ d.name }}</span>
              <span style="text-align:right;font-size:12px"><span style="color:#1F2D3D;font-family:monospace">&yen;{{ d.amount.toLocaleString() }}</span> <span style="color:#66788A;font-size:10px;margin-left:4px">{{ d.pct }}%</span></span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;font-weight:600;font-size:13px;color:#1F2D3D;border-top:1px solid #E3EAF0;margin-top:2px">
              <span>累计获得</span><span style="font-family:monospace">&yen;{{ subsidyTotal.toLocaleString() }}</span>
            </div>
          </div>
        </div>
        <div class="chart-block" v-if="curTab==='elderly'">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
            <div style="display:flex;align-items:center;gap:14px">
              <span style="font-size:14px;font-weight:600;color:#1F2D3D">{{ selectedChartElderName }} · 近7天健康趋势</span>
              <span style="display:flex;align-items:center;gap:4px;font-size:10px;color:#E05252;white-space:nowrap"><span style="display:inline-block;width:14px;height:2px;background:#E05252;border-radius:1px"></span>心率</span>
              <span style="display:flex;align-items:center;gap:4px;font-size:10px;color:#0EA5E9;white-space:nowrap"><span style="display:inline-block;width:10px;height:10px;background:#D0D8E2;border:1px solid #D0D8E2;border-radius:2px"></span>睡眠时长</span>
            </div>
            <select v-model="selectedChartElderId" @change="onChartElderSwitch" style="background:#FFFFFF;border:1px solid rgba(14,165,233,0.15);color:#1F2D3D;padding:4px 10px;border-radius:4px;font-size:11px;font-family:inherit;cursor:pointer;outline:none">
              <option v-for="e in elderly" :key="e.id" :value="e.id">{{ e.name }}（{{ e.relation }}）</option>
            </select>
          </div>
          <div id="chart_elder_health" style="width:100%;height:310px"></div>
        </div>
        <div class="chart-block" v-if="curTab==='telemed'"><div id="chart_tele_pie" style="width:100%;height:200px"></div></div>
        <div class="chart-block" v-if="curTab==='appointment'"><div id="chart_appt_pie" style="width:100%;height:200px"></div></div>
      </div>
    </div>

    <!-- ===== MODAL ===== -->
    <div class="mod-over" v-if="mod.vis" @click.self="clsMod">
      <div class="mod-box svc-modal" :class="mod.width">
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

    <!-- Hidden file inputs for reimbursement upload -->
    <input ref="invoiceInput" type="file" accept=".jpg,.jpeg,.png,.pdf" style="display:none" @change="handleInvoiceUpload">
    <input ref="diagnosisInput" type="file" accept=".jpg,.jpeg,.png,.pdf" style="display:none" @change="handleDiagnosisUpload">
    <!-- Shared hidden file input for subsidy material uploads -->
    <input ref="sharedFileInput" type="file" accept=".pdf,.jpg,.jpeg,.png" style="display:none" @change="onSharedFileSelected">
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import { listTrainingCourses } from '@/api/training'

const props = defineProps({ embedded: { type: Boolean, default: false } })

// ===== FILE UPLOAD STATE =====
const invoiceInput = ref(null)
const diagnosisInput = ref(null)
const invoiceFile = ref(null)
const diagnosisFile = ref(null)
const ALLOWED_TYPES = ['image/jpeg','image/png','application/pdf']
const MAX_SIZE = 10 * 1024 * 1024

function handleInvoiceUpload(e){
  const file = e.target.files?.[0]
  if(!file) return
  if(!ALLOWED_TYPES.includes(file.type)){ toast('仅支持 JPG/PNG/PDF 格式','warn'); return }
  if(file.size > MAX_SIZE){ toast('文件不能超过 10MB','warn'); return }
  invoiceFile.value = file
  const el = document.getElementById('rb_invoice_status')
  if(el){ el.innerHTML = '<span class="svc-uploaded-file">\\u{1F4C4} '+file.name+' <span style="color:#22B573;font-size:11px">\\u2714 已上传</span></span>' }
}
function handleDiagnosisUpload(e){
  const file = e.target.files?.[0]
  if(!file) return
  if(!ALLOWED_TYPES.includes(file.type)){ toast('仅支持 JPG/PNG/PDF 格式','warn'); return }
  if(file.size > MAX_SIZE){ toast('文件不能超过 10MB','warn'); return }
  diagnosisFile.value = file
  const el = document.getElementById('rb_diag_status')
  if(el){ el.innerHTML = '<span class="svc-uploaded-file">\\u{1F4CB} '+file.name+' <span style="color:#22B573;font-size:11px">\\u2714 已上传</span></span>' }
}
function triggerInvoiceUpload(){ invoiceFile.value = null; const el = document.getElementById('rb_invoice_status'); if(el) el.innerHTML = ''; invoiceInput.value?.click() }
function triggerDiagnosisUpload(){ diagnosisFile.value = null; const el = document.getElementById('rb_diag_status'); if(el) el.innerHTML = ''; diagnosisInput.value?.click() }

// ===== UTILS =====
let uidCounter = 200
function uid() { return ++uidCounter }

const clock = ref('')
let clockTimer = null
onMounted(() => {
  loadTrainingCourses()
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
const mod = reactive({ vis: false, title: '', html: '', width: '' })
let _clsTimer = null
function opMod(title, html, width) {
  if (_clsTimer) { clearTimeout(_clsTimer); _clsTimer = null }
  mod.title = title
  mod.html = html
  mod.width = width || ''
  mod.vis = true
}
function clsMod() {
  mod.vis = false
  for (const k in uploadStore) delete uploadStore[k]
  if (_clsTimer) clearTimeout(_clsTimer)
  _clsTimer = setTimeout(() => { mod.title = ''; mod.html = ''; mod.width = ''; _clsTimer = null }, 200)
}

// ===== TABS =====
const tabs = [
  { key: 'insurance', label: '医保社保查询', icon: '\u{1F4C4}', color: 'b' },
  { key: 'subsidy',   label: '补贴申请',     icon: '\u{1F4B0}', color: 'g' },
  { key: 'elderly',   label: '老人关爱',     icon: '\u{1F474}', color: 'r' },
  { key: 'telemed',   label: '远程医疗',     icon: '\u{1F3E5}', color: 'p' },
  { key: 'training',  label: '农技培训',     icon: '\u{1F393}', color: 'y' },
  { key: 'appointment', label: '政务预约',    icon: '\u{1F4C5}', color: 'b' }
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
  { name: '耕地地力保护补贴', desc: '拥有耕地承包权的种地农户', amount: '≥70元/亩', icon: '\u{1F33E}' },
  { name: '农机购置补贴', desc: '新购农机具定额补贴', amount: '购机价≤30%', icon: '\u{1F69C}' },
  { name: '节水灌溉设施补贴', desc: '新建或改造滴灌、喷灌等节水设施', amount: '≤800元/亩', icon: '\u{1F4A7}' },
  { name: '低保补助', desc: '家庭人均收入低于当地标准', amount: '分档差额补助', icon: '\u{1F4B0}' },
  { name: '创业补贴', desc: '首次创业满1年', amount: '¥10,000', icon: '\u{1F3EA}' }
]
const subsidy = reactive([
  { id:11, appNo:"SB20260615001", name:"王友德", type:"耕地地力保护补贴", amount:6650, status:"已发放", date:"2026-06-15", node:"已发放", nodes:["已提交","村级初审","乡镇审核","部门复核","待发放","已发放"], currentNodeIdx:5 },
  { id:12, appNo:"SB20260720002", name:"王友德", type:"农机购置补贴", amount:4800, status:"审核中", date:"2026-07-20", node:"乡镇审核", nodes:["已提交","村级初审","乡镇审核","部门复核","待发放","已发放"], currentNodeIdx:2 },
  { id:13, appNo:"SB20260701003", name:"王友德", type:"低保补助", amount:4260, status:"发放中", date:"2026-07-01", node:"待发放", nodes:["已提交","村级初审","乡镇审核","部门复核","待发放","已发放"], currentNodeIdx:4 }
])
const subsidyTotal = computed(() => subsidy.reduce((s, r) => s + Number(r.amount), 0))
const subsidyChartDetail = computed(() => {
  const groups = {}
  subsidy.forEach(r => { const k = r.type; if (!groups[k]) groups[k] = 0; groups[k] += Number(r.amount) })
  const colors = { '耕地地力保护补贴': '#0EA5E9', '农机购置补贴': '#22B573', '低保补助': '#F2A62B', '创业补贴': '#8B5CF6' }
  const total = subsidyTotal.value || 1
  return Object.entries(groups).map(([name, amount]) => ({
    name, amount, pct: ((amount / total) * 100).toFixed(1), color: colors[name] || '#66788A'
  })).sort((a, b) => b.amount - a.amount)
})
const elderly = reactive([
  { id: 21, name: '王奶奶', age: 85, gender: '女', relation: '母亲', addr: '二组东侧', group: '二组', living: '同住', device: '智能手环', status: '重点关注', trend: { heartRate: [72,75,70,78,88,95,88], sleep: [6.5,6.2,5.8,5.5,4.2,5.1,5.0] }, health: '高血压3级，需每日监测', heartRate: 88, sleep: 4.2, bloodPressure: '152/95', lastMeasure: '2026-08-11 07:30', activity: '今日步数：3,200步，活动时长：2.5h', recentAbnormal: '8月9日 06:42 心率异常偏高（105bpm）| 8月7日 03:15 睡眠不足3小时' },
  { id: 22, name: '周爷爷', age: 91, gender: '男', relation: '岳父', addr: '三组北侧', group: '三组', living: '分住（同村）', device: '智能手表', status: '需关注', trend: { heartRate: [68,70,67,72,70,73,72], sleep: [7.0,6.8,7.2,6.5,7.0,6.8,6.5] }, health: '糖尿病，血糖控制尚可', heartRate: 72, sleep: 6.5, bloodPressure: '138/86', lastMeasure: '2026-08-11 06:45', activity: '今日步数：1,800步，活动时长：1.2h', recentAbnormal: '暂无近期异常' }
])
const elderAlertSettings = reactive({})
let _pendingElderAction = null
const selectedChartElderId = ref(21)
const selectedChartElderName = computed(() => {
  const e = elderly.find(x => x.id === selectedChartElderId.value)
  return e ? e.name : ''
})
function onChartElderSwitch(){
  setTimeout(() => {
    const el = document.getElementById('chart_elder_health')
    if (el && chartInstance) {
      const e = elderly.find(x => x.id === selectedChartElderId.value)
      if (e) {
        chartInstance.setOption({
          series: [
            { data: e.trend.heartRate },
            { data: e.trend.sleep }
          ]
        })
      }
    }
  }, 50)
}
const telemed = reactive([
  { id: 31, patient: '王友德', doctor: '张医生', dept: '内科', date: '2026-06-15', time: '14:30', type: '视频问诊', diagnosis: '高血压复查，血压控制良好', status: '已完成', prescription: '硝苯地平 30mg qd', rxStatus: '已取药', rxDate: '2026-06-15', symptom: '头晕、血压偏高', advice: '低盐饮食，每日监测血压，不适随诊' },
  { id: 32, patient: '王友德', doctor: '李医生', dept: '骨科', date: '2026-06-20', time: '09:00', type: '在线复诊', diagnosis: '待诊断', status: '待就诊', prescription: '-', rxStatus: '无处方', rxDate: '-', symptom: '腰部酸痛、活动受限', advice: '-' },
  { id: 33, patient: '王奶奶', doctor: '王医生', dept: '心内科', date: '2026-05-10', time: '10:00', type: '视频问诊', diagnosis: '高血压调整用药', status: '已完成', prescription: '氨氯地平 5mg qd', rxStatus: '已取药', rxDate: '2026-05-10', symptom: '心悸、血压波动', advice: '按时服药，每周测血压2-3次，避免情绪激动' },
  { id: 34, patient: '周爷爷', doctor: '张医生', dept: '内科', date: '2026-04-22', time: '15:00', type: '视频问诊', diagnosis: '糖尿病随访，调整胰岛素剂量', status: '已完成', prescription: '胰岛素 12U tid', rxStatus: '待取药', rxDate: '2026-04-22', symptom: '血糖偏高、乏力、口渴', advice: '控制主食摄入，每日监测血糖，定期复查糖化血红蛋白' },
  { id: 35, patient: '王友德', doctor: '李医生', dept: '骨科', date: '2026-02-18', time: '11:00', type: '视频问诊', diagnosis: '腰肌劳损', status: '已完成', prescription: '双氯芬酸钠 50mg bid', rxStatus: '已失效', rxDate: '2026-02-18', symptom: '腰部剧烈疼痛、活动困难', advice: '卧床休息3天，避免重体力劳动2周' }
])
// ---- Training data（真实后端 /api/v1/training-courses） ----
// trainingCourses: 培训课程目录（后端加载；报名记录暂存本地 localStorage，后续接报名接口）
const trainingCourses = reactive([])
function mapTrainingCourse(t) {
  const fmt = t.formatType || ''
  let type = 'OFFLINE'
  if (fmt.includes('直播')) type = fmt.includes('线下') ? 'HYBRID' : 'LIVE'
  else if (fmt.includes('线上')) type = 'ONLINE'
  return {
    id: t.id, title: t.title, teacher: t.teacher, date: t.date, time: t.time,
    loc: t.location, duration: t.duration, type,
    joined: t.joined || 0, limit: t.limitCount || 0, status: t.status,
    description: t.description, suitableFor: t.category || '不限',
    deadline: t.date, notes: '暂无', materials: []
  }
}
async function loadTrainingCourses() {
  try {
    const res = await listTrainingCourses()
    if (res && res.code === 200 && Array.isArray(res.data)) {
      trainingCourses.splice(0, trainingCourses.length, ...res.data.map(mapTrainingCourse))
    }
  } catch (e) { /* 请求失败时保留空列表，页面显示「暂无可报名课程」 */ }
}

// trainingEnrollments: enrollment bridge table
const trainingEnrollments = reactive([
  { id: 101, courseId: 51, userId: 1, enrollDate: '2026-06-10', status: '已完成', progress: '100%', learningHours: 2.0 },
  { id: 102, courseId: 52, userId: 1, enrollDate: '2026-07-05', status: '进行中', progress: '60%', learningHours: 0.9 }
])

// ===== Training enrollment persistence (localStorage, API-ready) =====
// Reserved API interfaces:
//   POST   /api/training/enrollment        — create enrollment
//   GET    /api/training/enrollment/my     — list my enrollments
//   DELETE /api/training/enrollment/{id}   — cancel enrollment
const TRAINING_ENROLL_STORAGE_KEY = 'svc_training_enrollments'

function loadPersistedEnrollments() {
  try { const raw = localStorage.getItem(TRAINING_ENROLL_STORAGE_KEY); return raw ? JSON.parse(raw) : [] }
  catch(e) { return [] }
}

function persistEnrollments() {
  const runtime = trainingEnrollments.filter(e => e.courseId >= 41)
  localStorage.setItem(TRAINING_ENROLL_STORAGE_KEY, JSON.stringify(runtime))
}

;(function initTrainingPersistence() {
  const persisted = loadPersistedEnrollments()
  if (persisted.length === 0) return
  const maxId = Math.max(...persisted.map(e => e.id), 0)
  if (maxId >= uidCounter) uidCounter = maxId
  for (const p of persisted) {
    if (!trainingEnrollments.some(e => e.courseId === p.courseId)) {
      trainingEnrollments.unshift(p)
      const course = trainingCourses.find(c => c.id === p.courseId)
      if (course) course.joined++
    }
  }
})()

// trainingLearning: online learning time records
const trainingLearning = reactive([
  { id: 201, enrollmentId: 102, courseId: 52, watchedMinutes: 54, totalMinutes: 90, lastAccess: '2026-08-10' }
])

// trainingAttendance: offline check-in records
const trainingAttendance = reactive([
  { id: 301, enrollmentId: 101, courseId: 51, checkinTime: '2026-06-12 08:52', status: '已签到' }
])

// historicalEnrolledCourses: course details for previously enrolled courses
const historicalEnrolledCourses = [
  { id: 51, title: '病虫害防治基础', teacher: '刘教授', date: '2026-06-12', time: '09:00', loc: '村委会培训室', duration: '约1小时20分钟', type: 'OFFLINE', joined: 22, limit: 30, status: '已完成', description: '常见农作物病虫害识别与防治方法，涵盖水稻、小麦、玉米等主要农作物的常见病虫害。', deadline: '2026-06-10', suitableFor: '全体农户', notes: '', replayStatus:'PUBLISHED', replayUrl:'/media/training/plant-disease-01.mp4', materials: [{id:1,name:'苹果常见病虫害识别手册.pdf',size:'2.3MB',url:'/files/苹果常见病虫害识别手册.pdf'},{id:2,name:'病虫害防治技术要点.pdf',size:'1.8MB',url:'/files/病虫害防治技术要点.pdf'}] },
  { id: 52, title: '智慧农业入门', teacher: '周老师', date: '2026-07-08', time: '14:00', loc: '村集体直播平台', duration: '约1.5小时', type: 'LIVE', joined: 35, limit: 50, status: '进行中', description: '智慧农业概念及应用场景介绍，包括物联网监控、智能灌溉、无人机植保等前沿技术。', deadline: '2026-07-06', suitableFor: '全体农户', notes: '', replayStatus:'NONE', replayUrl:'', materials: [{id:3,name:'智慧农业导论.pdf',size:'4.1MB',url:'/files/智慧农业导论.pdf'}] }
]
// Government service catalog (item → window mapping)
const governmentServices = [
  { id:'S1', name:'身份证换领', category:'证件办理', window:'户籍窗口', duration:'30分钟', guide:'请携带原身份证、户口本原件及近期一寸免冠照片2张，本人前往户籍窗口办理。办理时限：15个工作日。咨询电话：12345。', materials:[{name:'身份证换领申请表',fmt:'PDF',url:'/files/id-card-application.pdf'},{name:'证件照要求说明',fmt:'PDF',url:'/files/photo-requirements.pdf'}] },
  { id:'S2', name:'户口相关业务', category:'证件办理', window:'户籍窗口', duration:'30分钟', guide:'户口迁移、登记、注销等业务请携带相关证明材料。具体材料清单请查看材料模板。咨询电话：12345。', materials:[{name:'户口迁移申请表',fmt:'DOCX',url:'/files/hukou-transfer-application.docx'},{name:'亲属关系证明模板',fmt:'DOCX',url:'/files/kinship-certificate-template.docx'}] },
  { id:'S3', name:'耕地补贴咨询', category:'补贴申请', window:'农业窗口', duration:'20分钟', guide:'请携带土地承包经营权证、身份证原件。补贴标准以县级农业农村部门核定为准，通过惠民"一卡通"发放。咨询电话：12345。', materials:[{name:'耕地补贴申请表',fmt:'DOCX',url:'/files/farmland-subsidy-application.docx'},{name:'土地承包证明模板',fmt:'DOCX',url:'/files/land-contract-certificate.docx'}] },
  { id:'S4', name:'农业用地证明', category:'证明开具', window:'综合窗口', duration:'15分钟', guide:'请携带土地承包合同或村委会证明、身份证原件。办理时限：3个工作日。', materials:[{name:'农业用地证明申请表',fmt:'DOCX',url:'/files/ag-land-cert-application.docx'},{name:'村委会证明模板',fmt:'DOCX',url:'/files/village-committee-cert.docx'}] },
  { id:'S5', name:'低保业务咨询', category:'补贴申请', window:'综合窗口', duration:'20分钟', guide:'请携带身份证、户口本、收入证明等材料。低保标准根据当地政策执行，具体请咨询窗口工作人员。', materials:[{name:'低保申请表',fmt:'DOCX',url:'/files/dibao-application.docx'},{name:'家庭收入申报表',fmt:'DOCX',url:'/files/household-income-form.docx'}] },
  { id:'S6', name:'养老认证咨询', category:'其他', window:'综合窗口', duration:'15分钟', guide:'城乡居民养老保险待遇领取资格认证，每年一次。请携带身份证和社保卡。也可通过"陕西养老保险"APP自助认证。', materials:[{name:'养老认证操作指南',fmt:'PDF',url:'/files/pension-auth-guide.pdf'}] }
]

// Appointments (persisted to localStorage)
const APPT_STORAGE_KEY = 'svc_appointments'
function loadPersistedAppointments() {
  try { const raw = localStorage.getItem(APPT_STORAGE_KEY); return raw ? JSON.parse(raw) : [] }
  catch(e) { return [] }
}
function persistAppointments() {
  localStorage.setItem(APPT_STORAGE_KEY, JSON.stringify(appointment))
}
const appointment = reactive((()=>{
  const saved = loadPersistedAppointments()
  if (saved.length > 0) return saved
  return [
    { id:61, serviceId:'S1', serviceName:'身份证换领', name:'王友德', phone:'138****5432', village:'中堰村', window:'户籍窗口', date:'2026-08-12', time:'09:30', status:'已预约', apptNo:'AP20260812001', createdAt:'2026-08-10' },
    { id:62, serviceId:'S3', serviceName:'耕地补贴咨询', name:'王友德', phone:'138****5432', village:'中堰村', window:'农业窗口', date:'2026-08-15', time:'14:00', status:'已预约', apptNo:'AP20260815001', createdAt:'2026-08-12' },
    { id:63, serviceId:'S4', serviceName:'农业用地证明', name:'王友德', phone:'138****5432', village:'中堰村', window:'综合窗口', date:'2026-07-20', time:'10:00', status:'已完成', apptNo:'AP20260720001', createdAt:'2026-07-18' }
  ]
})())
// Update uidCounter for persisted data
;(()=>{ const maxId = Math.max(...appointment.map(a=>a.id), 0); if (maxId >= uidCounter) uidCounter = maxId })()

// Time slot generation helper
function getAvailableSlots(windowName, dateStr) {
  const slots = []
  const now = new Date()
  const todayStr = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')
  const hours = [{start:9,end:12},{start:14,end:17}]
  for (const block of hours) {
    for (let h = block.start; h < block.end; h++) {
      for (let m = 0; m < 60; m += 30) {
        const time = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0')
        const booked = appointment.some(a => a.window === windowName && a.date === dateStr && a.time === time && a.status !== '已取消')
        const isPast = dateStr === todayStr && (h < now.getHours() || (h === now.getHours() && m <= now.getMinutes()))
        slots.push({ time, available: !booked && !isPast })
      }
    }
  }
  return slots
}

function getServiceById(id) { return governmentServices.find(s => s.id === id) }
function telemedStatus(r){
  if(r.status==='待就诊'){
    const apptDate=new Date(r.date+'T'+r.time+':00')
    if(apptDate<new Date()) return '已过期'
  }
  return r.status
}
function isTelemedCompleted(r){ return r.status==='已完成' }
function isTelemedPending(r){ const s=telemedStatus(r); return s==='待就诊'||s==='已过期' }

// ---- Training helpers ----
function isEnrolled(courseId){ return trainingEnrollments.some(e=>e.courseId===courseId) }
function getEnrollment(courseId){ return trainingEnrollments.find(e=>e.courseId===courseId) }
function getTypeLabel(course){ const map={OFFLINE:'线下培训',ONLINE:'线上课程',LIVE:'线上直播',HYBRID:'线下+线上'}; return map[course.type]||course.type }
function isCourseLiveNow(course){
  if(course.type!=='LIVE'&&course.type!=='ONLINE')return false
  const now=new Date(),start=new Date(course.date+'T'+course.time)
  const durMatch=course.duration.match(/(\d+(\.\d+)?)/)
  const durHours=durMatch?parseFloat(durMatch[1]):1
  const end=new Date(start.getTime()+durHours*3600000)
  return now>=start&&now<=end
}
function findNextLiveCourse(){
  const now=new Date()
  const enrolledIds=trainingEnrollments.map(e=>e.courseId)
  const all=historicalEnrolledCourses.concat(trainingCourses)
  const upcoming=all.filter(c=>enrolledIds.includes(c.id)&&(c.type==='LIVE'||c.type==='ONLINE')&&new Date(c.date+'T'+c.time)>now)
  upcoming.sort((a,b)=>new Date(a.date+'T'+a.time)-new Date(b.date+'T'+b.time))
  return upcoming.length>0?upcoming[0]:null
}

// Live-stream floating card state
const liveCard = reactive({ vis: false, isLive: false, course: null, nextCourse: null })

const dataMap = { insurance, subsidy, elderly, telemed, training: trainingEnrollments, appointment }
const currentData = computed(() => dataMap[curTab.value] || [])

// ---- Training computed ----
const availableCoursesComputed = computed(() => trainingCourses.filter(c => c.status === '报名中'))

const myTrainingList = computed(() => {
  const enrolledCourseIds = trainingEnrollments.map(e => e.courseId)
  const allEnrolled = historicalEnrolledCourses.concat(
    trainingCourses.filter(c => enrolledCourseIds.includes(c.id))
  )
  return allEnrolled.map(c => {
    const enrollment = trainingEnrollments.find(e => e.courseId === c.id) || null
    // Derive display status from enrollment, not course
    let displayStatus = '已报名'
    if (enrollment) {
      if (enrollment.status === '已完成') displayStatus = '已完成'
      else if (enrollment.status === '进行中') {
        const now = new Date()
        const courseStart = new Date(c.date + 'T' + c.time)
        displayStatus = now < courseStart ? '已报名' : '进行中'
      }
    }
    const isLive=isCourseLiveNow(c)
    return { ...c, enrollment, displayStatus, isLive }
  })
})

const upcomingTraining = computed(() => {
  const now = new Date()
  const enrolledCourseIds = trainingEnrollments.map(e => e.courseId)
  const allEnrolled = historicalEnrolledCourses.concat(
    trainingCourses.filter(c => enrolledCourseIds.includes(c.id))
  )
  return allEnrolled
    .filter(c => new Date(c.date + 'T' + c.time) > now)
    .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
    .slice(0, 3)
})
const upcomingCount = computed(() => {
  const now = new Date()
  const enrolledCourseIds = trainingEnrollments.map(e => e.courseId)
  const allEnrolled = historicalEnrolledCourses.concat(
    trainingCourses.filter(c => enrolledCourseIds.includes(c.id))
  )
  return allEnrolled.filter(c => new Date(c.date + 'T' + c.time) > now).length
})

// ===== KPI CARDS =====
const kpiCards = computed(() => {
  const key = curTab.value
  if (key === 'insurance') {
    const med = myInsuranceCards[0]
    const totalR = medicalRecords.reduce((s,r)=>s+r.reimburse,0)
    return [
      { icon:'\u{1F4CB}', value:med?med.status:'--', label:'参保状态', color:'g' },
      { icon:'\u{1F4B0}', value:med&&med.extra?med.extra:'--', label:'账户信息', color:'b' },
      { icon:'\u{1F4C5}', value:medicalRecords.length+'次', label:'今年结算', color:'y' },
      { icon:'\u{1F4C8}', value:'¥'+totalR.toLocaleString(), label:'累计报销', color:'p' }
    ]
  }
  if (key === 'subsidy') {
    const ing = subsidy.filter(s=>s.status==='审核中'||s.status==='发放中').length
    const done = subsidy.filter(s=>s.status==='已发放').length
    const total = subsidy.reduce((s,r)=>s+Number(r.amount),0)
    return [
      { icon:'\u{1F4CB}', value:availableSubsidies.length+'项', label:'可申请补贴', color:'g' },
      { icon:'\u{23F3}', value:ing+'项', label:'申请中', color:'y' },
      { icon:'✅', value:done+'项', label:'已发放', color:'b' },
      { icon:'\u{1F4B0}', value:'¥'+total.toLocaleString(), label:'累计获得', color:'p' }
    ]
  }
  if (key === 'elderly') {
    const alertCnt = elderly.filter(e=>e.status==='重点关注').length
    const focusElder = elderly.find(e=>e.status==='重点关注')
    return [
      { icon:'\u{1F474}', value:elderly.length+'人', label:'绑定家庭老人', color:'g' },
      { icon:'\u26A0', value:alertCnt+'人', label:'重点关注', color:'r' },
      { icon:'\u{2764}', value:focusElder?focusElder.heartRate+'bpm':'--', label:focusElder?focusElder.name+' 心率':'心率', color:'r' },
      { icon:'\u{1F4CA}', value:focusElder?focusElder.sleep+'h':'--', label:focusElder?focusElder.name+' 睡眠':'睡眠', color:'b' },
    ]
  }
  if (key === 'telemed') {
    const done = telemed.filter(t=>t.status==='已完成').length
    const pending = telemed.filter(t=>telemedStatus(t)==='待就诊').length
    const hasRx = telemed.filter(t=>t.status==='已完成'&&t.prescription&&t.prescription!=='-').length
    return [
      { icon:'\u{1F4C5}', value:telemed.length+'次', label:'预约数', color:'g' },
      { icon:'✅', value:done+'次', label:'已完成', color:'b' },
      { icon:'\u{23F3}', value:pending+'次', label:'待就诊', color:'y' },
      { icon:'\u{1F48A}', value:hasRx+'个', label:'处方数', color:'p' }
    ]
  }
  if (key === 'training') {
    const enrolledIds = trainingEnrollments.map(e=>e.courseId)
    const canEnroll = trainingCourses.filter(c=>c.status==='报名中'&&!enrolledIds.includes(c.id)).length
    const enrolled = trainingEnrollments.filter(e=>e.status==='进行中').length
    const done = trainingEnrollments.filter(e=>e.status==='已完成').length
    const totalLearningHours = trainingLearning.reduce((s,l)=>s+(l.watchedMinutes||0),0)/60
    return [
      { icon:'\u{1F393}', value:canEnroll+'个', label:'可报名', color:'g' },
      { icon:'\u{1F4CB}', value:enrolled+'个', label:'已报名', color:'b' },
      { icon:'✅', value:done+'个', label:'已完成', color:'y' },
      { icon:'\u{23F1}', value:totalLearningHours.toFixed(1)+'h', label:'累计学习', color:'p' }
    ]
  }
  if (key === 'appointment') {
    const pending = appointment.filter(a=>a.status==='已预约').length
    const done = appointment.filter(a=>a.status==='已完成').length
    const inProgress = appointment.filter(a=>a.status==='待办理'||a.status==='办理中').length
    return [
      { icon:'\u{1F4CB}', value:governmentServices.length+'项', label:'可办事项', color:'g' },
      { icon:'\u{1F4C5}', value:pending+'项', label:'已预约', color:'b' },
      { icon:'✅', value:done+'项', label:'已办理', color:'y' },
      { icon:'\u{23F3}', value:inProgress+'项', label:'办理中', color:'p' }
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
    training: '报名参加农技培训课程，随时随地学习最新农业技术',
    appointment: '在线预约政务服务，查询办理进度'
  }
  return map[curTab.value] || ''
})

// ===== QUICK ACTIONS =====
const quickActions = computed(() => {
  const key = curTab.value
  if (key === 'insurance') return [
    { icon:'\u{1F50D}', label:'医保查询', action: showInsuranceBalance },
    { icon:'\u{1F4C4}', label:'报销进度', action: showReimburseForm },
    { icon:'\u{1F3E5}', label:'在线挂号', action: showHospitalReg },
    { icon:'\u{1F4C3}', label:'缴费记录', action: showPaymentHistory },
    { icon:'\u{1F30D}', label:'异地备案', action: showRemoteRecord }
  ]
  if (key === 'subsidy') return [
    { icon:'\u{1F4DD}', label:'申请补贴', action: showSubsidyApply },
    { icon:'\u{1F50D}', label:'进度查询', action: showSubsidyProgress },
    { icon:'\u{1F4DC}', label:'政策查询', action: showPolicyQuery },
    { icon:'\u{1F4E5}', label:'材料下载', action: showMaterialDownload }
  ]
  if (key === 'elderly') return [
    { icon:'\u{1F4CA}', label:'健康报告', action: showHealthReport },
    { icon:'\u{1F691}', label:'一键呼救', action: emergencyCall },
    { icon:'\u{1F4CD}', label:'位置查看', action: showElderlyLocation },
    { icon:'\u{2699}', label:'预警设置', action: dispatchAlert }
  ]
  if (key === 'telemed') return [
    { icon:'\u{1F4F9}', label:'预约问诊', action: showTelemedForm },
    { icon:'\u{25B6}', label:'进入诊室', action: enterVideoRoom },
    { icon:'\u{1F4CB}', label:'病历档案', action: showMedicalRecords },
    { icon:'\u{1F48A}', label:'处方查询', action: showPrescriptions }
  ]
  if (key === 'training') return [
    { icon:'\u{1F4DD}', label:'课程报名', action: scrollToCourses },
    { icon:'\u{25B6}', label:'当前直播', action: enterLiveRoom },
    { icon:'\u{1F4FA}', label:'课程回放', action: showReplayList }
  ]
  if (key === 'appointment') return [
    { icon:'\u{1F4C5}', label:'在线预约', action: () => showApptForm() },
    { icon:'\u{1F50D}', label:'进度查询', action: showApptProgress },
    { icon:'\u{1F4DC}', label:'办事指南', action: downloadGuide },
    { icon:'\u{1F4E5}', label:'材料模板', action: downloadTemplate }
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
  if(!arr.length){ toast(ds+' 暂无预约','info'); return }
  const statusMap = { '已预约':'b', '待办理':'b', '办理中':'y', '已完成':'g', '已取消':'dim', '已失约':'r' }
  let h='<div class="mod-desc">'+ds+' 共 '+arr.length+' 条预约</div>'
  arr.sort((a,b)=>a.time.localeCompare(b.time))
  arr.forEach(a=>{
    const tagCls = statusMap[a.status] || 'dim'
    h+='<div style="background:#FFFFFF;border:1px solid #EBEFF4;border-radius:8px;padding:10px;margin-top:6px;cursor:pointer" onclick="window._svc.showApptDetailById('+a.id+')">'
    h+='<div style="display:flex;justify-content:space-between;align-items:center">'
    h+='<div><span style="color:#1F2D3D;font-weight:600;font-size:12px">'+a.serviceName+'</span>'
    h+='<span style="color:#66788A;font-size:10px;margin-left:6px">'+a.time+'</span></div>'
    h+='<span class="tag '+tagCls+'">'+a.status+'</span>'
    h+='</div><div style="font-size:9px;color:#66788A;margin-top:3px">'+a.window+'</div></div>'
  })
  opMod('\u{1F4C5} '+ds+' 预约列表',h,'mod-md')
}
function showApptDetailById(id){
  const a = appointment.find(x=>x.id===id)
  if(a) showApptDetail(a)
}

// ===== TAB-SPECIFIC DETAIL FUNCTIONS =====
function showMedicalDetail(r){
  const h='<dl style="display:grid;grid-template-columns:1fr 2fr;gap:4px 12px;font-size:12px;margin-bottom:14px"><dt style="color:#66788A">就诊医院</dt><dd style="color:#1F2D3D;font-weight:500">'+r.hospital+'</dd><dt style="color:#66788A">就诊日期</dt><dd style="color:#1F2D3D;font-weight:500">'+r.date+'</dd><dt style="color:#66788A">诊断</dt><dd style="color:#1F2D3D;font-weight:500">'+r.diagnosis+'</dd><dt style="color:#66788A">总费用</dt><dd style="color:#22B573;font-weight:600">¥'+r.totalCost.toLocaleString()+'</dd><dt style="color:#66788A">医保报销</dt><dd style="color:#22B573;font-weight:600">¥'+r.reimburse.toLocaleString()+'</dd><dt style="color:#66788A">个人支付</dt><dd style="color:#E05252;font-weight:600">¥'+r.personalPay.toLocaleString()+'</dd></dl>'
  opMod('\u{1F3E5} 就诊详情 — '+r.hospital,h)
}
function showTelemedDetail(r){
  const completed=r.status==='已完成'
  const ds=telemedStatus(r)
  const tagClass=ds==='已完成'?'g':ds==='已过期'?'r':'y'
  let h='<div class="svc-result-card">'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">就诊人</span><span class="svc-rc-value">'+r.patient+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">就诊医生</span><span class="svc-rc-value">'+r.doctor+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">所属科室</span><span class="svc-rc-value">'+r.dept+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">预约日期</span><span class="svc-rc-value">'+r.date+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">预约时间</span><span class="svc-rc-value">'+r.time+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">问诊类型</span><span class="svc-rc-value">'+r.type+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">就诊状态</span><span class="svc-rc-value"><span class="tag '+tagClass+'">'+ds+'</span></span></div>'
  if(r.symptom&&r.symptom!=='-') h+='<div class="svc-rc-row"><span class="svc-rc-label">主诉症状</span><span class="svc-rc-value">'+r.symptom+'</span></div>'
  h+='</div>'
  if(completed){
    h+='<div class="mod-divider"></div>'
    h+='<div class="mod-section-title">🩺 诊断信息</div>'
    h+='<div class="svc-result-card">'
    h+='<div class="svc-rc-row"><span class="svc-rc-label">诊断结果</span><span class="svc-rc-value" style="font-weight:600">'+r.diagnosis+'</span></div>'
    if(r.advice&&r.advice!=='-') h+='<div class="svc-rc-row"><span class="svc-rc-label">医嘱建议</span><span class="svc-rc-value" style="color:#F2A62B">'+r.advice+'</span></div>'
    h+='</div>'
    h+='<div class="mod-divider"></div>'
    h+='<div class="mod-section-title">💊 处方信息</div>'
    if(r.prescription&&r.prescription!=='-'){
      h+='<div class="svc-result-card">'
      h+='<div class="svc-rc-row"><span class="svc-rc-label">处方内容</span><span class="svc-rc-value" style="color:#0EA5E9;font-weight:500">'+r.prescription+'</span></div>'
      if(r.rxStatus) h+='<div class="svc-rc-row"><span class="svc-rc-label">处方状态</span><span class="svc-rc-value"><span class="tag '+(r.rxStatus==='已取药'?'g':r.rxStatus==='已失效'?'r':'y')+'">'+r.rxStatus+'</span></span></div>'
      if(r.rxDate&&r.rxDate!=='-') h+='<div class="svc-rc-row"><span class="svc-rc-label">开具日期</span><span class="svc-rc-value">'+r.rxDate+'</span></div>'
      h+='</div>'
    } else {
      h+='<div class="svc-result-card">'
      h+='<div class="svc-rc-row"><span class="svc-rc-label">处方状态</span><span class="svc-rc-value" style="color:#66788A">本次未开具处方</span></div>'
      h+='</div>'
    }
  }
  opMod('\u{1F4F9} 问诊详情 — '+r.doctor+' · '+r.dept,h,'mod-md')
}
function showApptDetail(r){
  const statusMap = { '已预约':'b', '待办理':'b', '办理中':'y', '已完成':'g', '已取消':'dim', '已失约':'r' }
  const tagCls = statusMap[r.status] || 'dim'
  let h='<div class="svc-result-card">'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">预约编号</span><span class="svc-rc-value">'+r.apptNo+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">办理事项</span><span class="svc-rc-value" style="font-weight:600;color:#0EA5E9">'+r.serviceName+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">办理窗口</span><span class="svc-rc-value">'+r.window+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">预约时间</span><span class="svc-rc-value" style="color:#1F2D3D">'+r.date+' '+r.time+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">预约人</span><span class="svc-rc-value">'+r.name+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">联系电话</span><span class="svc-rc-value">'+r.phone+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">所属村</span><span class="svc-rc-value">'+r.village+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">当前状态</span><span class="svc-rc-value"><span class="tag '+tagCls+'">'+r.status+'</span></span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">创建时间</span><span class="svc-rc-value">'+r.createdAt+'</span></div>'
  h+='</div>'
  if (r.status === '已预约') {
    h+='<div class="svc-form-actions" style="margin-top:12px">'
    h+='<button class="svc-btn svc-btn-danger" onclick="window._svc.cancelAppointment('+r.id+')">取消预约</button>'
    h+='</div>'
  }
  opMod('\u{1F4C5} 预约详情 — '+r.serviceName,h,'mod-md')
}
function cancelAppointment(id){
  const idx = appointment.findIndex(a => a.id === id)
  if (idx === -1) return
  if (!confirm('确定取消此预约吗？')) return
  appointment[idx].status = '已取消'
  persistAppointments()
  clsMod()
  toast('预约已取消','ok')
}
function applySubsidy(s){
  if(s.name==='耕地地力保护补贴') showLandSubsidyForm()
  else if(s.name==='农机购置补贴') showMachineSubsidyForm()
  else if(s.name==='低保补助') showDibaoForm()
  else if(s.name==='创业补贴') showBizSubsidyForm()
}
// ===== 耕地地力保护补贴 =====
function showLandSubsidyForm(){
  let h='<div class="mod-desc" style="display:flex;align-items:center;gap:6px"><span style="font-size:16px">👤</span><span style="color:#66788A;font-size:11px">本人信息 — 以下字段从当前登录账户自动带出，无需手动填写</span></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>姓名</label><input class="svc-self-field" value="王友德" readonly></div><div class="svc-fld"><label>身份证号</label><input class="svc-self-field" value="342***15**07" readonly></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>户籍所在地</label><input class="svc-self-field" value="中堰村" readonly></div><div class="svc-fld"><label>联系电话</label><input class="svc-self-field" value="138****5432" readonly></div></div>'
  h+='<div class="mod-divider"></div><div class="mod-section-title">🌾 耕地信息</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>承包耕地面积（亩）<span style="color:#E05252">*</span></label><input type="number" id="landArea" placeholder="请输入确权耕地面积" oninput="window._svc.calcLandAmount()" min="1" step="0.1"></div><div class="svc-fld"><label>地块位置<span style="color:#E05252">*</span></label><input type="text" id="landLocation" placeholder="如：中堰村三组"></div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>预估补贴金额（陕南 ≥60元/亩）</label><div id="landAmountDisplay" style="background:#EBEFF4;border:1px solid rgba(14,165,233,0.15);border-radius:6px;padding:10px 12px;font-size:18px;color:#22B573;font-weight:700;text-align:center">¥0.00</div></div><div style="font-size:10px;color:#F2A62B;margin-top:4px">⚠ 实际补贴标准以县级农业农村部门核定为准，通过惠民"一卡通"发放</div></div>'
  h+='<div class="mod-divider"></div><div class="mod-section-title">📎 材料上传</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><div class="svc-upload-block"><button type="button" class="svc-upload-btn" onclick="window._svc.triggerUpload(\'landProofInput\',\'landProofStatus\')">📄 上传土地承包经营权证</button><div class="svc-upload-status" id="landProofStatus">未上传</div></div></div></div>'
  h+='<div class="svc-form-row" style="margin-top:16px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="flex:none;width:auto">取消</button><button class="svc-btn svc-btn-primary" onclick="window._svc.submitLandSubsidy()" style="flex:none;width:auto">✓ 提交申请</button></div>'
  opMod('🌾 耕地地力保护补贴申请',h,'mod-md')
}
function calcLandAmount(){
  const area=parseFloat(document.getElementById('landArea')?.value)||0
  const display=document.getElementById('landAmountDisplay')
  if(display)display.textContent='¥'+(area*70).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2})+'（参考，以核定为准）'
}
function submitLandSubsidy(){
  const area=parseFloat(document.getElementById('landArea')?.value)||0
  if(!area||area<1){toast('请输入有效的承包耕地面积（≥1亩）','err');return}
  if(!document.getElementById('landLocation')?.value.trim()){toast('请输入地块位置','err');return}
  if(!hasUpload('landProofInput')){toast('请先上传土地承包经营权证','err');return}
  const now=new Date()
  const appNo='SB'+now.getFullYear()+String(now.getMonth()+1).padStart(2,'0')+String(now.getDate()).padStart(2,'0')+String(Math.floor(Math.random()*900)+100)
  const id=Date.now()
  subsidy.push({id,appNo,name:'王友德',type:'耕地地力保护补贴',amount:Math.round(area*70),status:'审核中',date:now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0'),node:'已提交',nodes:['已提交','村级初审','乡镇审核','部门复核','待发放','已发放'],currentNodeIdx:0})
  toast('申请已提交！编号：'+appNo,'ok');clsMod()
}
// ===== 农机购置补贴 =====
function showMachineSubsidyForm(){
  let h='<div class="mod-desc" style="display:flex;align-items:center;gap:6px"><span style="font-size:16px">👤</span><span style="color:#66788A;font-size:11px">本人信息 — 以下字段从当前登录账户自动带出，无需手动填写</span></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>姓名</label><input class="svc-self-field" value="王友德" readonly></div><div class="svc-fld"><label>身份证号</label><input class="svc-self-field" value="342***15**07" readonly></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>户籍所在地</label><input class="svc-self-field" value="中堰村" readonly></div><div class="svc-fld"><label>联系电话</label><input class="svc-self-field" value="138****5432" readonly></div></div>'
  h+='<div class="mod-divider"></div><div class="mod-section-title">🚜 机具信息</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>机具大类<span style="color:#E05252">*</span></label><select id="machineCat" onchange="window._svc.calcMachineAmount()"><option value="">请选择</option><option value="耕整地机械">耕整地机械</option><option value="种植施肥机械">种植施肥机械</option><option value="收获机械">收获机械</option><option value="动力机械">动力机械</option></select></div><div class="svc-fld"><label>机具名称<span style="color:#E05252">*</span></label><input type="text" id="machineName" placeholder="如：轮式拖拉机"></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>生产企业<span style="color:#E05252">*</span></label><input type="text" id="machineMfr" placeholder="生产企业全称"></div><div class="svc-fld"><label>机具型号<span style="color:#E05252">*</span></label><input type="text" id="machineModel" placeholder="规格型号"></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld">'
  h+='<label>购置日期<span style="color:#E05252">*</span></label>'
  h+='<div class="svc-date-wrap" onclick="var d=this.querySelector(\'input[type=date]\');d.showPicker?d.showPicker():d.focus()"><input type="text" placeholder="请选择日期" readonly><input type="date" id="machineDate" onchange="var t=this.parentElement.querySelector(\'input[type=text]\');t.value=this.value;this.parentElement.classList.toggle(\'has-val\',!!this.value);window._svc.calcMachineAmount()"></div>'
  h+='</div><div class="svc-fld"><label>购置价格（元）<span style="color:#E05252">*</span></label><input type="number" id="machinePrice" placeholder="输入购置价格" oninput="window._svc.calcMachineAmount()" min="0"></div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>预估补贴金额（购机价格×30%，以核定为准）</label><div id="machineAmountDisplay" style="background:#EBEFF4;border:1px solid rgba(14,165,233,0.15);border-radius:6px;padding:10px 12px;font-size:18px;color:#22B573;font-weight:700;text-align:center">¥0.00</div></div></div>'
  h+='<div class="mod-divider"></div><div class="mod-section-title">📎 材料上传</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><div class="svc-upload-block"><button type="button" class="svc-upload-btn" onclick="window._svc.triggerUpload(\'machineInvoiceInput\',\'invoiceStatus\')">📄 上传购机发票</button><div class="svc-upload-status" id="invoiceStatus">未上传</div></div></div><div class="svc-fld"><div class="svc-upload-block"><button type="button" class="svc-upload-btn" onclick="window._svc.triggerUpload(\'machineIdPhotoInput\',\'idPhotoStatus\')">🆔 上传身份证及人机合影</button><div class="svc-upload-status" id="idPhotoStatus">未上传</div></div></div></div>'
  h+='<div class="svc-form-row" style="margin-top:16px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="flex:none;width:auto">取消</button><button class="svc-btn svc-btn-primary" onclick="window._svc.submitMachineSubsidy()" style="flex:none;width:auto">✓ 提交申请</button></div>'
  opMod('🚜 农机购置补贴申请',h,'mod-md')
}
function calcMachineAmount(){
  const price=parseFloat(document.getElementById('machinePrice')?.value)||0
  const display=document.getElementById('machineAmountDisplay')
  if(display)display.textContent='¥'+Math.round(price*0.30).toLocaleString('zh-CN')+'（参考，以核定为准）'
}
function submitMachineSubsidy(){
  const cat=document.getElementById('machineCat')?.value
  const name=document.getElementById('machineName')?.value.trim()
  const mfr=document.getElementById('machineMfr')?.value.trim()
  const model=document.getElementById('machineModel')?.value.trim()
  const date=document.getElementById('machineDate')?.value
  const price=parseFloat(document.getElementById('machinePrice')?.value)||0
  if(!cat||!name||!mfr||!model||!date||!price){toast('请填写所有必填字段','err');return}
  if(!hasUpload('machineInvoiceInput')){toast('请先上传购机发票','err');return}
  if(!hasUpload('machineIdPhotoInput')){toast('请先上传身份证及人机合影','err');return}
  const now=new Date()
  const appNo='SB'+now.getFullYear()+String(now.getMonth()+1).padStart(2,'0')+String(now.getDate()).padStart(2,'0')+String(Math.floor(Math.random()*900)+100)
  const id=Date.now()
  subsidy.push({id,appNo,name:'王友德',type:'农机购置补贴',amount:Math.round(price*0.30),status:'审核中',date:now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0'),node:'已提交',nodes:['已提交','村级初审','乡镇审核','部门复核','待发放','已发放'],currentNodeIdx:0})
  toast('申请已提交！编号：'+appNo,'ok');clsMod()
}
// ===== 低保补助 =====
function showDibaoForm(){
  let h='<div class="mod-desc" style="display:flex;align-items:center;gap:6px"><span style="font-size:16px">👤</span><span style="color:#66788A;font-size:11px">本人信息 — 以下字段从当前登录账户自动带出，无需手动填写</span></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>姓名</label><input class="svc-self-field" value="王友德" readonly></div><div class="svc-fld"><label>身份证号</label><input class="svc-self-field" value="342***15**07" readonly></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>户籍所在地</label><input class="svc-self-field" value="中堰村" readonly></div><div class="svc-fld"><label>联系电话</label><input class="svc-self-field" value="138****5432" readonly></div></div>'
  h+='<div class="mod-divider"></div><div class="mod-section-title">👨‍👩‍👧‍👦 家庭信息</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>家庭人口<span style="color:#E05252">*</span></label><input type="number" id="dibaoPop" placeholder="家庭实际人口数" oninput="window._svc.calcDibaoIncome()" min="1"></div><div class="svc-fld"><label>家庭月总收入（元）<span style="color:#E05252">*</span></label><input type="number" id="dibaoIncome" placeholder="所有家庭成员月收入合计" oninput="window._svc.calcDibaoIncome()" min="0"></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld" style="flex:1"><label>人均月收入</label><div id="dibaoPerCapita" style="background:#EBEFF4;border:1px solid rgba(14,165,233,0.15);border-radius:6px;padding:10px 12px;font-size:18px;color:#22B573;font-weight:700;text-align:center">¥0.00</div></div><div style="font-size:10px;color:#F2A62B;margin-top:4px">⚠ 陕南农村低保标准 ≥472元/人·月（5664元/年），实行分档差额补助</div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="svc-form-row"><div class="svc-fld" style="flex:1"><label>参考补助金额（分档差额，以民政核定为准）</label><div id="dibaoAmountDisplay" style="background:#EBEFF4;border:1px solid rgba(14,165,233,0.15);border-radius:6px;padding:10px 12px;font-size:18px;color:#22B573;font-weight:700;text-align:center">¥0.00</div></div></div>'
  h+='<div class="mod-divider"></div><div class="mod-section-title">📝 困难描述</div>'
  h+='<div class="svc-form-row"><div class="svc-fld" style="flex:1"><textarea id="dibaoDesc" placeholder="请描述家庭困难情况（如疾病、残疾、失业等），以便审核人员评估..." rows="3" style="width:100%"></textarea></div></div>'
  h+='<div class="mod-divider"></div><div class="mod-section-title">📎 材料上传</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><div class="svc-upload-block"><button type="button" class="svc-upload-btn" onclick="window._svc.triggerUpload(\'dibaoIdInput\',\'dibaoIdStatus\')">🆔 上传身份证及户口本</button><div class="svc-upload-status" id="dibaoIdStatus">未上传</div></div></div><div class="svc-fld"><div class="svc-upload-block"><button type="button" class="svc-upload-btn" onclick="window._svc.triggerUpload(\'dibaoIncomeInput\',\'dibaoIncomeStatus\')">📄 上传收入及财产证明</button><div class="svc-upload-status" id="dibaoIncomeStatus">未上传</div></div></div></div>'
  h+='<div class="svc-form-row" style="margin-top:16px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="flex:none;width:auto">取消</button><button class="svc-btn svc-btn-primary" onclick="window._svc.submitDibao()" style="flex:none;width:auto">✓ 提交申请</button></div>'
  opMod('💳 低保补助申请',h,'mod-md')
}
function calcDibaoIncome(){
  const pop=parseInt(document.getElementById('dibaoPop')?.value)||0
  const income=parseFloat(document.getElementById('dibaoIncome')?.value)||0
  const perCap=pop>0?Math.round(income/pop):0
  const perCapEl=document.getElementById('dibaoPerCapita')
  if(perCapEl)perCapEl.textContent='¥'+perCap.toLocaleString('zh-CN')+(perCap>0&&perCap<472?'（低于保障线）':'')
  const amountEl=document.getElementById('dibaoAmountDisplay')
  if(amountEl)amountEl.textContent='以民政部门分档核定为准（参考：一档最高约¥480/人·月）'
}
function submitDibao(){
  const pop=parseInt(document.getElementById('dibaoPop')?.value)||0
  const income=parseFloat(document.getElementById('dibaoIncome')?.value)||0
  if(!pop||pop<1){toast('请输入有效的家庭人口数','err');return}
  if(!income){toast('请输入家庭月总收入','err');return}
  if(!document.getElementById('dibaoDesc')?.value.trim()){toast('请描述家庭困难情况','err');return}
  if(!hasUpload('dibaoIdInput')){toast('请先上传身份证及户口本','err');return}
  if(!hasUpload('dibaoIncomeInput')){toast('请先上传收入及财产证明','err');return}
  const perCap=Math.round(income/pop)
  if(perCap>=472){toast('经核算，家庭人均月收入 ¥'+perCap.toLocaleString()+' ≥ ¥472（陕南保障线），暂不符合低保申请条件','err');return}
  const now=new Date()
  const appNo='SB'+now.getFullYear()+String(now.getMonth()+1).padStart(2,'0')+String(now.getDate()).padStart(2,'0')+String(Math.floor(Math.random()*900)+100)
  const id=Date.now()
  subsidy.push({id,appNo,name:'王友德',type:'低保补助',amount:pop*355,status:'审核中',date:now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0'),node:'已提交',nodes:['已提交','村级初审','乡镇审核','部门复核','待发放','已发放'],currentNodeIdx:0})
  toast('申请已提交！编号：'+appNo,'ok');clsMod()
}
// ===== 创业补贴 =====
function showBizSubsidyForm(){
  let h='<div class="mod-desc" style="display:flex;align-items:center;gap:6px"><span style="font-size:16px">👤</span><span style="color:#66788A;font-size:11px">本人信息 — 以下字段从当前登录账户自动带出，无需手动填写</span></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>姓名</label><input class="svc-self-field" value="王友德" readonly></div><div class="svc-fld"><label>身份证号</label><input class="svc-self-field" value="342***15**07" readonly></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>户籍所在地</label><input class="svc-self-field" value="中堰村" readonly></div><div class="svc-fld"><label>联系电话</label><input class="svc-self-field" value="138****5432" readonly></div></div>'
  h+='<div class="mod-divider"></div><div class="mod-section-title">🏢 创业信息</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>经营主体名称<span style="color:#E05252">*</span></label><input type="text" id="bizName" placeholder="个体工商户或企业全称"></div><div class="svc-fld"><label>统一社会信用代码<span style="color:#E05252">*</span></label><input type="text" id="bizCode" placeholder="18位统一社会信用代码"></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld">'
  h+='<label>成立日期<span style="color:#E05252">*</span></label>'
  h+='<div class="svc-date-wrap" onclick="var d=this.querySelector(\'input[type=date]\');d.showPicker?d.showPicker():d.focus()"><input type="text" placeholder="请选择日期" readonly><input type="date" id="bizDate" onchange="var t=this.parentElement.querySelector(\'input[type=text]\');t.value=this.value;this.parentElement.classList.toggle(\'has-val\',!!this.value)"></div>'
  h+='</div><div class="svc-fld"><label>经营地址<span style="color:#E05252">*</span></label><input type="text" id="bizAddress" placeholder="经营场所详细地址"></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld" style="flex:1"><label>经营项目（简述）<span style="color:#E05252">*</span></label><textarea id="bizProject" placeholder="描述经营内容和规模..." rows="2" style="width:100%"></textarea></div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>申请补贴金额（元）<span style="color:#E05252">*</span></label><input type="number" id="bizAmount" placeholder="¥10,000" min="1" max="10000"><div style="font-size:10px;color:#F2A62B;margin-top:3px">⚠ 陕西省一次性创业补贴标准为¥10,000，以人社部门审批为准</div></div><div class="svc-fld"><label>银行账号<span style="color:#E05252">*</span></label><input type="text" id="bizBank" placeholder="收款银行账号"></div></div>'
  h+='<div class="mod-divider"></div><div class="mod-section-title">📎 材料上传</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><div class="svc-upload-block"><button type="button" class="svc-upload-btn" onclick="window._svc.triggerUpload(\'bizLicenseInput\',\'bizLicenseStatus\')">📄 上传营业执照</button><div class="svc-upload-status" id="bizLicenseStatus">未上传</div></div></div><div class="svc-fld"><div class="svc-upload-block"><button type="button" class="svc-upload-btn" onclick="window._svc.triggerUpload(\'bizPlanInput\',\'bizPlanStatus\')">📄 上传创业计划书</button><div class="svc-upload-status" id="bizPlanStatus">未上传</div></div></div></div>'
  h+='<div class="svc-form-row" style="margin-top:16px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="flex:none;width:auto">取消</button><button class="svc-btn svc-btn-primary" onclick="window._svc.submitBizSubsidy()" style="flex:none;width:auto">✓ 提交申请</button></div>'
  opMod('🏢 创业补贴申请',h,'mod-md')
}
function submitBizSubsidy(){
  const bizName=document.getElementById('bizName')?.value.trim()
  const bizCode=document.getElementById('bizCode')?.value.trim()
  const bizDate=document.getElementById('bizDate')?.value
  const bizAddress=document.getElementById('bizAddress')?.value.trim()
  const bizProject=document.getElementById('bizProject')?.value.trim()
  const bizAmount=parseFloat(document.getElementById('bizAmount')?.value)||0
  const bizBank=document.getElementById('bizBank')?.value.trim()
  if(!bizName||!bizCode||!bizDate||!bizAddress||!bizProject||!bizAmount||!bizBank){toast('请填写所有必填字段','err');return}
  if(bizAmount>10000){toast('申请金额最高不超过¥10,000','err');return}
  if(!hasUpload('bizLicenseInput')){toast('请先上传营业执照','err');return}
  if(!hasUpload('bizPlanInput')){toast('请先上传创业计划书','err');return}
  const now=new Date()
  const appNo='SB'+now.getFullYear()+String(now.getMonth()+1).padStart(2,'0')+String(now.getDate()).padStart(2,'0')+String(Math.floor(Math.random()*900)+100)
  const id=Date.now()
  subsidy.push({id,appNo,name:'王友德',type:'创业补贴',amount:Math.min(bizAmount,10000),status:'审核中',date:now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0'),node:'已提交',nodes:['已提交','村级初审','乡镇审核','部门复核','待发放','已发放'],currentNodeIdx:0})
  toast('申请已提交！编号：'+appNo,'ok');clsMod()
}



function showSubsidyApply(){
  let h='<div class="mod-desc">选择您要申请的补贴类型，进入对应申请表单</div>'
  const items=[
    {name:'耕地地力保护补贴',desc:'拥有耕地承包权的种地农户',amount:'≥70元/亩',icon:'\u{1F33E}',fn:'window._svc.showLandSubsidyForm()'},
    {name:'农机购置补贴',desc:'新购农机具定额补贴',amount:'购机价≤30%',icon:'\u{1F69C}',fn:'window._svc.showMachineSubsidyForm()'},
    {name:'低保补助',desc:'家庭人均收入低于当地标准',amount:'分档差额补助',icon:'💳',fn:'window._svc.showDibaoForm()'},
    {name:'创业补贴',desc:'首次创业满1年',amount:'¥10,000',icon:'\u{1F3EA}',fn:'window._svc.showBizSubsidyForm()'}
  ]
  items.forEach(s=>{
    h+='<div class="svc-sub-list-item" onclick="'+s.fn+'"><div class="svc-sub-list-icon">'+s.icon+'</div><div class="svc-sub-list-info"><div class="svc-sub-list-name">'+s.name+'</div><div class="svc-sub-list-desc">'+s.desc+'</div></div><div class="svc-sub-list-amount">'+s.amount+'</div><div style="color:#0EA5E9;margin-left:8px;flex-shrink:0">申请 ▶</div></div>'
  })
  opMod('\u{1F4DD} 申请补贴',h,'mod-md')
}

// ---- Training actions ----
function scrollToMyTraining(){
  const el=document.getElementById('my-training-section')
  if(el){
    el.scrollIntoView({behavior:'smooth',block:'start'})
    el.style.transition='box-shadow 0.3s'
    el.style.boxShadow='0 0 0 2px rgba(14,165,233,0.35)'
    setTimeout(()=>{el.style.boxShadow=''},1500)
  }
}
function scrollToCourses(){
  const el=document.getElementById('available-courses-section')
  if(el){
    el.scrollIntoView({behavior:'smooth',block:'start'})
    el.style.transition='box-shadow 0.3s'
    el.style.boxShadow='0 0 0 2px rgba(14,165,233,0.35)'
    setTimeout(()=>{el.style.boxShadow=''},1500)
  }
}
function showCourseDetail(c){
  const typeLabels={OFFLINE:'线下培训',ONLINE:'线上课程',LIVE:'线上直播',HYBRID:'线下+线上'}
  const typeLabel=typeLabels[c.type]||c.type
  const now=new Date()
  const courseDate=new Date(c.date+'T'+c.time)
  const isFuture=courseDate>now
  const enrolled=isEnrolled(c.id)
  const enrollment=getEnrollment(c.id)
  const remaining=Math.max(0,c.limit-c.joined)
  const joinedClass=c.joined>=c.limit?'r':'g'
  const canCancel=enrolled&&isFuture&&(!c.deadline||new Date()<=new Date(c.deadline))
  // Build location row dynamically — hide if loc value duplicates type label
  let locRow=''
  if(c.type==='LIVE'){
    if(c.loc!=='线上直播') locRow='<div class="svc-rc-row"><span class="svc-rc-label">直播平台</span><span class="svc-rc-value">'+c.loc+'</span></div>'
  }else if(c.type==='ONLINE'){
    locRow='<div class="svc-rc-row"><span class="svc-rc-label">学习平台</span><span class="svc-rc-value">'+c.loc+'</span></div>'
  }else{
    locRow='<div class="svc-rc-row"><span class="svc-rc-label">培训地点</span><span class="svc-rc-value">'+c.loc+'</span></div>'
  }
  let h='<div class="svc-result-card">'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">课程名称</span><span class="svc-rc-value" style="font-weight:600;font-size:14px">'+c.title+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">培训内容</span><span class="svc-rc-value">'+(c.description||'暂无详情')+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">讲师</span><span class="svc-rc-value">'+c.teacher+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">培训时间</span><span class="svc-rc-value">'+c.date+' '+c.time+'</span></div>'
  if(locRow) h+=locRow
  h+='<div class="svc-rc-row"><span class="svc-rc-label">培训方式</span><span class="svc-rc-value">'+typeLabel+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">课程时长</span><span class="svc-rc-value">'+c.duration+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">适合人群</span><span class="svc-rc-value">'+(c.suitableFor||'不限')+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">报名截止</span><span class="svc-rc-value">'+(c.deadline||'开课前1天')+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">报名人数</span><span class="svc-rc-value"><span class="tag '+joinedClass+'">'+c.joined+'/'+c.limit+'人</span></span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">注意事项</span><span class="svc-rc-value">'+(c.notes||'暂无')+'</span></div>'
  h+='</div>'
  // Enrollment info section (auto-populated from login profile)
  if(!enrolled&&isFuture&&c.status==='报名中'&&remaining>0){
    h+='<div class="mod-divider"></div>'
    h+='<div style="font-size:12px;color:#66788A;margin-bottom:10px">\u{1F464} 报名信息确认</div>'
    h+='<div class="svc-rc-row"><span class="svc-rc-label">报名人</span><span class="svc-rc-value" style="color:#1F2D3D">王友德</span></div>'
    h+='<div class="svc-rc-row"><span class="svc-rc-label">联系电话</span><span class="svc-rc-value">138****5432</span></div>'
    h+='<div class="svc-rc-row"><span class="svc-rc-label">所属村</span><span class="svc-rc-value">中堰村</span></div>'
    h+='<div style="margin-top:12px;display:flex;align-items:flex-start;gap:8px">'
    h+='<input type="checkbox" id="chk_enroll_confirm" style="margin-top:2px;accent-color:#0EA5E9;width:14px;height:14px;flex-shrink:0;cursor:pointer">'
    h+='<label for="chk_enroll_confirm" style="font-size:12px;color:#475867;line-height:1.5;cursor:pointer">我已了解培训时间、地点及注意事项</label>'
    h+='</div>'
  }
  // Action buttons
  if(enrolled&&canCancel){
    h+='<div class="mod-divider"></div>'
    h+='<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">'
    h+='<span style="color:#22B573;font-weight:600;font-size:13px">\u2705 已报名</span>'
    h+='<button class="svc-btn svc-btn-danger" onclick="window._svc.cancelEnrollFromDetail('+c.id+')" style="flex:none">取消报名</button>'
    h+='</div>'
  }else if(enrolled&&!canCancel){
    h+='<div style="text-align:center;margin-top:16px;color:#22B573;font-weight:600;font-size:13px">\u2705 您已报名此课程</div>'
  }else if(!isFuture){
    h+='<div style="text-align:center;margin-top:16px;color:#66788A;font-size:12px">该课程已开始，无法报名</div>'
  }else if(!enrolled&&isFuture&&c.status==='报名中'&&remaining>0){
    h+='<div class="svc-form-actions" style="margin-top:16px">'
    h+='<button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()">取消</button>'
    h+='<button class="svc-btn svc-btn-primary" onclick="window._svc.confirmEnroll('+c.id+')">\u2705 确认报名</button>'
    h+='</div>'
  }
  opMod('\u{1F393} 课程详情 \u2014 '+c.title,h,'mod-md')
}
function cancelEnrollFromDetail(courseId){
  const c=trainingCourses.find(x=>x.id===courseId)||historicalEnrolledCourses.find(x=>x.id===courseId)
  if(!c)return
  if(!confirm('确定取消\u300C'+c.title+'\u300D的报名吗？'))return
  cancelEnroll(c)
  clsMod()
}
function confirmEnroll(courseId){
  const c=trainingCourses.find(x=>x.id===courseId)
  if(!c)return
  // Check confirmation checkbox
  const chk=document.getElementById('chk_enroll_confirm')
  if(chk&&!chk.checked){toast('\u26A0 请先勾选确认信息','warn');return}
  if(c.deadline){
    const dl=new Date(c.deadline)
    if(new Date()>dl){toast('报名已截止','warn');return}
  }
  if(c.joined>=c.limit){toast('名额已满，无法报名','warn');return}
  if(isEnrolled(courseId)){toast('您已报名此课程','info');return}
  const now=new Date()
  trainingEnrollments.unshift({
    id:uid(),courseId:c.id,userId:1,
    enrollDate:now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0'),
    status:'进行中',progress:'0%',learningHours:0,
    mobile_snapshot:'138****5432',farmer_id:1,village_id:'中堰村'
  })
  c.joined++
  persistEnrollments()
  toast('\u2705 报名成功 \u2014 '+c.title+' | '+c.date+' '+c.time+' | '+c.loc,'ok')
  // Re-render detail modal to show enrolled state
  showCourseDetail(c)
}
function canCancelEnroll(c){
  if(!c.deadline)return true
  return new Date()<=new Date(c.deadline)
}
function cancelEnroll(c){
  const idx=trainingEnrollments.findIndex(e=>e.courseId===c.id)
  if(idx===-1)return
  trainingEnrollments.splice(idx,1)
  c.joined=Math.max(0,c.joined-1)
  persistEnrollments()
  toast('已取消报名','ok')
}
function continueLearning(course){
  const learning=trainingLearning.find(l=>l.courseId===course.id)
  const watched=learning?learning.watchedMinutes:0
  const total=learning?learning.totalMinutes:(parseFloat(course.duration)*60||60)
  const pct=Math.round((watched/total)*100)
  toast('继续学习：\u300C'+course.title+'\u300D 已学习 '+pct+'%','info')
}
function openResource(url){
  if(!url){toast('资料暂未上传','info');return}
  window.open(url,'_blank')
}
function downloadFile(url, filename){
  if(!url){toast('资料暂未上传','info');return}
  const a=document.createElement('a')
  a.href=url;a.download=filename||''
  document.body.appendChild(a);a.click();document.body.removeChild(a)
}
function showReplayFor(course){
  const hasReplay=course.replayStatus==='PUBLISHED'&&course.replayUrl
  const mats=course.materials||[]
  const learning=trainingLearning.find(l=>l.courseId===course.id)
  const watched=learning?learning.watchedMinutes:0
  const total=learning?learning.totalMinutes:90
  const pct=total>0?Math.round((watched/total)*100):0
  let h=''
  // Video area
  h+='<div style="background:#F0F3F8;border-radius:12px;overflow:hidden;margin-bottom:16px;border:1px solid #EBEFF4">'
  if(hasReplay){
    h+='<div style="position:relative;padding-top:56.25%;background:#F0F3F8">'
    h+='<video controls style="position:absolute;top:0;left:0;width:100%;height:100%;outline:none" src="'+course.replayUrl+'" preload="metadata" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
    h+='<div style="display:none;position:absolute;top:0;left:0;width:100%;height:100%;align-items:center;justify-content:center;background:#F0F3F8">'
    h+='<div style="text-align:center"><div style="font-size:28px;margin-bottom:8px">\u26A0</div>'
    h+='<div style="font-size:12px;color:#E05252">视频加载失败，请稍后重试</div></div></div>'
    h+='</video></div>'
  }else{
    h+='<div style="padding:60px 20px;text-align:center">'
    h+='<div style="font-size:40px;margin-bottom:12px">\u{1F4FA}</div>'
    h+='<div style="font-size:14px;color:#1F2D3D;font-weight:600;margin-bottom:6px">回放视频暂未上传</div>'
    h+='<div style="font-size:11px;color:#66788A">课程回放正在整理，请稍后查看</div>'
    h+='</div>'
  }
  h+='</div>'
  // Course info
  h+='<div style="margin-bottom:12px">'
  h+='<div style="font-size:15px;font-weight:600;color:#1F2D3D;margin-bottom:6px">'+course.title+'</div>'
  h+='<div style="display:flex;gap:16px;font-size:11px;color:#66788A;flex-wrap:wrap;margin-bottom:6px">'
  h+='<span>\u{1F468}\u200D\u{1F3EB} '+course.teacher+'</span>'
  h+='<span>\u{1F4FA} 线下培训回放</span>'
  h+='<span>\u{23F1} '+course.duration+'</span>'
  h+='</div>'
  // Learning progress
  h+='<div class="mod-divider"></div>'
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">'
  h+='<span style="font-size:12px;color:#66788A">学习进度</span>'
  h+='<span style="font-size:12px;color:#0EA5E9;font-weight:600">'+pct+'%</span>'
  h+='</div>'
  h+='<div class="progress-bar" style="height:8px;border-radius:4px"><div class="fill b" style="width:'+pct+'%"></div></div>'
  if(watched>0) h+='<div style="font-size:10px;color:#66788A;margin-top:4px">上次看到：'+Math.floor(watched/60)+'分'+(watched%60)+'秒</div>'
  h+='</div>'
  // Description
  h+='<div class="mod-divider"></div>'
  h+='<div style="margin-bottom:2px;font-size:12px;color:#66788A">课程简介</div>'
  h+='<div style="font-size:11px;color:#475867;line-height:1.6">'+course.description+'</div>'
  // Materials
  if(mats.length>0){
    h+='<div class="mod-divider"></div>'
    h+='<div style="margin-bottom:6px;font-size:12px;color:#66788A">配套资料</div>'
    mats.forEach(m=>{
      if(m.url){
        h+='<div onclick="window._svc.openResource(\''+m.url+'\')" style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#FFFFFF;border-radius:6px;margin-bottom:6px;cursor:pointer;transition:background 0.2s" onmouseover="this.style.background=\'#E3EAF0\';this.style.borderColor=\'rgba(14,165,233,0.25)\'" onmouseout="this.style.background=\'#FFFFFF\';this.style.borderColor=\'transparent\'">'
        h+='<span style="font-size:12px;color:#1F2D3D">📄 '+m.name+'</span>'
        h+='<span style="font-size:10px;color:#0EA5E9">查看</span>'
      }else{
        h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#FFFFFF;border-radius:6px;margin-bottom:6px">'
        h+='<span style="font-size:12px;color:#1F2D3D">📄 '+m.name+'</span>'
        h+='<span style="font-size:10px;color:#66788A">暂未上传</span>'
      }
      h+='</div>'
    })
  }
  opMod('\u{1F4FA} 课程回放 \u2014 '+course.title,h,'mod-lg')
}
function showTrainingDetail(course){
  showCourseDetail(course)
}
// ===== Elderly picker & per-elder helpers =====
function elderPicker(actionFn, title){
  _pendingElderAction = actionFn
  let h = '<div style="font-size:12px;color:#66788A;margin-bottom:14px">请选择要操作的老人</div>'
  elderly.forEach(e => {
    const icon = e.gender === '男' ? '\u{1F468}' : '\u{1F469}'
    h += '<div onclick="window._svc.elderPickerSelect(' + e.id + ')" style="cursor:pointer;background:#FFFFFF;border:1px solid #EBEFF4;border-radius:10px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;gap:12px;transition:all 0.2s" onmouseover="this.style.borderColor=\'rgba(14,165,233,0.35)\';this.style.background=\'#EBEFF4\';" onmouseout="this.style.borderColor=\'#EBEFF4\';this.style.background=\'#FFFFFF\';"><div style="font-size:28px">' + icon + '</div><div style="flex:1"><div style="color:#1F2D3D;font-weight:600;font-size:13px;margin-bottom:3px">' + e.name + ' <span style="font-size:10px;color:#66788A">' + e.age + '岁</span><span class="ec-relation" style="margin-left:4px">' + e.relation + '</span></div><div style="font-size:10px;color:#66788A">\u{1F4CD} ' + e.addr + ' <span style="margin-left:6px">' + e.living + '</span></div></div><span class="tag ' + (e.status === '重点关注' ? 'r' : 'y') + '">' + e.status + '</span></div>'
  })
  h += '<div style="text-align:center;margin-top:12px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="flex:none;width:auto">取消</button></div>'
  opMod(title, h, 'mod-sm')
}
function elderPickerSelect(eid){
  const e = elderly.find(x => x.id === eid)
  if (e && _pendingElderAction) {
    const fn = _pendingElderAction
    _pendingElderAction = null
    fn(e)
  }
}
function showLocationFor(e){
  const dist = Math.floor(Math.random() * 400 + 300)
  const now = new Date()
  const ts = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes() - Math.floor(Math.random() * 30)).padStart(2, '0')
  let h = '<div style="font-size:11px;color:#66788A;margin-bottom:14px">' + e.name + ' 最近一次定位</div>'
  h += '<div style="background:#FFFFFF;border:1px solid #E3EAF0;border-radius:10px;padding:12px 14px;margin-bottom:10px">'
  h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="color:#1F2D3D;font-weight:600;font-size:14px">' + e.name + '</span><span style="color:#66788A;font-size:11px">' + e.relation + '</span><span class="tag ' + (e.status === '重点关注' ? 'r' : 'y') + '">' + e.status + '</span></div>'
  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px">'
  h += '<div><span style="color:#66788A">所在组</span><div style="color:#1F2D3D">' + e.group + '</div></div>'
  h += '<div><span style="color:#66788A">定位描述</span><div style="color:#1F2D3D">' + e.addr + '</div></div>'
  h += '<div><span style="color:#66788A">距村委会</span><div style="color:#0EA5E9;font-weight:600">约 ' + dist + 'm</div></div>'
  h += '<div><span style="color:#66788A">最后定位</span><div style="color:#1F2D3D">' + ts + '</div></div>'
  h += '</div></div>'
  h += '<div style="font-size:10px;color:#66788A;text-align:center;margin-top:8px">\u{1F4CD} 基于智能穿戴设备定位，精度约15m（后续版本将接入地图）</div>'
  opMod('\u{1F4CD} 老人位置 — ' + e.name, h, 'mod-md')
}
function showAlertSettingsFor(e){
  const s = elderAlertSettings[e.id] || { hr: 100, sleep: 5, inactive: 3 }
  let h = '<div style="font-size:12px;color:#66788A;margin-bottom:12px">为 <span style="color:#1F2D3D;font-weight:600">' + e.name + '</span>（<span style="color:#0EA5E9">' + e.relation + '</span>）设置健康预警阈值</div>'
  h += '<div class="svc-form-row"><div class="svc-fld"><label>心率上限（bpm）</label><input type="number" id="al_hr" value="' + s.hr + '" min="60" max="200"><div style="font-size:10px;color:#66788A;margin-top:3px">正常范围 60-100，建议上限 100-120</div></div></div>'
  h += '<div class="svc-form-row"><div class="svc-fld"><label>睡眠下限（小时）</label><input type="number" id="al_sleep" value="' + s.sleep + '" min="2" max="12" step="0.5"><div style="font-size:10px;color:#66788A;margin-top:3px">低于此值触发预警，建议 ≥4 小时</div></div></div>'
  h += '<div class="svc-form-row"><div class="svc-fld"><label>异常不活动时长（小时）</label><input type="number" id="al_inactive" value="' + s.inactive + '" min="1" max="24" step="0.5"><div style="font-size:10px;color:#66788A;margin-top:3px">持续无活动超过此时长触发预警</div></div></div>'
  h += '<div class="svc-form-actions" style="margin-top:20px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="flex:none;width:auto">取消</button><button class="svc-btn svc-btn-primary" onclick="window._svc.saveAlertSettingsFor(' + e.id + ')" style="flex:none;width:auto">\u2713 保存设置</button></div>'
  // store current elder id for save
  h += '<input type="hidden" id="al_eid" value="' + e.id + '">'
  opMod('\u2699 预警设置 — ' + e.name, h, 'mod-md')
}
function saveAlertSettingsFor(eid){
  const hr = parseInt(document.getElementById('al_hr')?.value) || 0
  const sl = parseFloat(document.getElementById('al_sleep')?.value) || 0
  const ia = parseFloat(document.getElementById('al_inactive')?.value) || 0
  if (hr < 60 || hr > 200) { toast('心率上限需在 60-200 bpm 之间', 'err'); return }
  if (sl < 2 || sl > 12) { toast('睡眠下限需在 2-12 小时之间', 'err'); return }
  if (ia < 1 || ia > 24) { toast('不活动时长需在 1-24 小时之间', 'err'); return }
  elderAlertSettings[eid] = { hr, sleep: sl, inactive: ia }
  const e = elderly.find(x => x.id === eid)
  toast('\u2713 ' + (e ? e.name : '') + ' 预警设置已保存\n心率上限：' + hr + ' bpm | 睡眠下限：' + sl + 'h | 不活动：' + ia + 'h', 'ok')
  clsMod()
}

function showHealthReportFor(e){
  const bp = e.bloodPressure || '--/--'
  let h='<div style="background:#EBEFF4;border:1px solid #E3EAF0;border-radius:8px;padding:12px 14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center"><span style="color:#66788A;font-size:11px">最近测量</span><span style="color:#1F2D3D;font-size:12px">'+e.lastMeasure+'</span></div>'
  // Vitals grid (4 cells)
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px;margin-bottom:12px">'
  h+='<div style="text-align:center;background:#FFFFFF;padding:14px 10px;border-radius:8px;border:1px solid rgba(224,82,82,0.08)"><div style="font-size:22px;font-weight:700;color:#E05252">'+e.heartRate+'</div><div style="color:#66788A;font-size:10px">心率（bpm）</div></div>'
  h+='<div style="text-align:center;background:#FFFFFF;padding:14px 10px;border-radius:8px;border:1px solid rgba(224,82,82,0.08)"><div style="font-size:22px;font-weight:700;color:#E05252">'+bp+'</div><div style="color:#66788A;font-size:10px">血压（mmHg）</div></div>'
  h+='<div style="text-align:center;background:#FFFFFF;padding:14px 10px;border-radius:8px;border:1px solid #EBEFF4"><div style="font-size:22px;font-weight:700;color:#0EA5E9">'+e.sleep+'h</div><div style="color:#66788A;font-size:10px">昨夜睡眠</div></div>'
  h+='<div style="text-align:center;background:#FFFFFF;padding:14px 10px;border-radius:8px;border:1px solid #EBEFF4"><div style="font-size:22px;font-weight:700;color:#0EA5E9">'+e.device+'</div><div style="color:#66788A;font-size:10px">监测设备</div></div>'
  h+='</div>'
  // Health summary
  h+='<div class="mod-divider"></div><div class="mod-section-title">📋 健康摘要</div>'
  h+='<div style="font-size:12px;color:#1F2D3D;background:#FFFFFF;border-radius:6px;padding:10px 12px;margin-bottom:8px">'+e.health+'</div>'
  // Activity
  h+='<div class="mod-section-title">🚶 活动情况</div>'
  h+='<div style="font-size:12px;color:#475867;background:#FFFFFF;border-radius:6px;padding:10px 12px;margin-bottom:8px">'+e.activity+'</div>'
  // Recent abnormal
  h+='<div class="mod-section-title">⚠ 近期异常记录</div>'
  h+='<div style="font-size:12px;color:#F2A62B;background:rgba(242,166,43,0.06);border:1px solid rgba(242,166,43,0.12);border-radius:6px;padding:10px 12px;margin-bottom:12px">'+e.recentAbnormal+'</div>'
  // Actions
  h+='<div class="svc-form-actions"><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="flex:none;width:auto">关闭</button><button class="svc-btn svc-btn-primary" onclick="window._svc.sendHealthReport(\''+e.name+'\','+e.id+')" style="flex:none;width:auto">📱 发送到手机</button></div>'
  opMod('📊 健康报告 — '+e.name,h,'mod-md')
}
function emergencyCallFor(e){
  let h='<div style="text-align:center;padding:8px 0"><div style="font-size:40px;margin-bottom:12px">🚑</div><div style="color:#1F2D3D;font-size:15px;font-weight:700;margin-bottom:6px">确认紧急呼救</div><div style="color:#66788A;font-size:12px;margin-bottom:16px">将向紧急联系人发送 '+e.name+' 的位置和健康档案</div>'
  h+='<div style="background:rgba(224,82,82,0.06);border:1px solid rgba(224,82,82,0.12);border-radius:8px;padding:10px 14px;margin-bottom:16px;text-align:left">'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#66788A">老人</span><span style="color:#1F2D3D">'+e.name+'（'+e.age+'岁）</span></div>'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#66788A">位置</span><span style="color:#1F2D3D">中堰村'+e.addr+'</span></div>'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#66788A">与本人关系</span><span style="color:#1F2D3D">'+e.relation+'</span></div>'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#66788A">健康状况</span><span style="color:#F2A62B">'+e.health+'</span></div>'
  h+='</div>'
  h+='<div class="svc-form-actions"><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="flex:none;width:auto">取消</button><button class="svc-btn svc-btn-primary" onclick="window._svc.confirmEmergencyCall(\''+e.name+'\',\''+e.addr+'\',\''+e.relation+'\')" style="flex:none;width:auto;background:linear-gradient(135deg,#E05252,#E05252)">确认呼救</button></div>'
  opMod('🚑 紧急呼救',h,'mod-sm')
}

// ===== BUSINESS ACTION HANDLERS =====
function showInsuranceBalance(){
  const r=insurance[0]
  const maskedId=r?r.idCard:'610***********0034'
  const maskedName=r?r.name:'王友德'
  let h='<div class="mod-desc">查询本人医保账户余额及养老金信息</div>'
  h+='<div class="svc-self-badge">\u{1F464} 本人信息 — 以下字段从当前登录账户自动带出，无需手动填写</div>'
  h+='<div class="svc-fld"><label>身份证号</label><input value="'+maskedId+'" readonly class="svc-self-field"></div>'
  h+='<div class="svc-fld"><label>参保人</label><input value="'+maskedName+'" readonly class="svc-self-field"></div>'
  h+='<div id="bal_result" class="svc-inline-result"></div>'
  h+='<div class="svc-form-actions"><button id="bal_query_btn" class="svc-btn svc-btn-primary" onclick="window._svc.queryBalance()">\u{1F50D} 查询账户</button><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()">取消</button></div>'
  opMod('\u{1F4B3} 医保账户查询',h,'mod-sm')
}
function queryBalance(){
  const btn=document.getElementById('bal_query_btn')
  if(btn&&btn.dataset.loading==='1')return
  if(btn){btn.dataset.loading='1';btn.textContent='⏳ 查询中...';btn.style.pointerEvents='none';btn.style.opacity='0.7'}
  const r=insurance[0]
  const el=document.getElementById('bal_result');if(!el)return
  setTimeout(()=>{
    if(!r){el.innerHTML='<div style="color:#E05252;font-size:13px;padding:12px 0">⚠️ 未找到参保记录，请联系社保中心核实</div>';el.classList.add('show')}
    else{
      let h='<div class="svc-result-card">'
      h+='<div class="svc-rc-row"><span class="svc-rc-label">参保人</span><span class="svc-rc-value">'+r.name+'</span></div>'
      h+='<div class="svc-rc-row"><span class="svc-rc-label">医保类型</span><span class="svc-rc-value">'+r.medType+'</span></div>'
      h+='<div class="svc-rc-row"><span class="svc-rc-label">医保状态</span><span class="svc-rc-value" style="color:#22B573">● '+r.medStatus+'</span></div>'
      h+='<div class="svc-rc-row"><span class="svc-rc-label">医保余额</span><span class="svc-rc-value" style="color:#22B573;font-weight:700;font-size:15px">'+r.medBalance+'</span></div>'
      h+='<div class="svc-rc-row"><span class="svc-rc-label">养老金状态</span><span class="svc-rc-value" style="color:#0EA5E9">'+r.penStatus+'</span></div>'
      h+='<div class="svc-rc-row"><span class="svc-rc-label">月度发放</span><span class="svc-rc-value" style="color:#22B573;font-weight:700;font-size:15px">'+r.penMonthly+'/月</span></div>'
      h+='</div>'
      el.innerHTML=h;el.classList.add('show')
    }
    if(btn){btn.dataset.loading='0';btn.textContent='\u{1F50D} 查询账户';btn.style.pointerEvents='';btn.style.opacity=''}
  },800)
}
function showReimburseForm(){
  let h='<div class="mod-desc">提交就诊发票与诊断证明，申请医保报销</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>就诊医院 <span style="color:#E05252">*</span></label><select id="rb_hosp"><option value="">请选择医院</option><option>安康市人民医院</option><option>汉滨区中医院</option><option>汉滨区人民医院</option><option>安康市中心医院</option></select></div><div class="svc-fld"><label>就诊日期 <span style="color:#E05252">*</span></label><div class="svc-date-wrap" onclick="var d=this.querySelector(\'input[type=date]\');d.showPicker?d.showPicker():d.focus()"><input type="text" placeholder="请选择日期" readonly><input type="date" id="rb_date" onchange="var t=this.parentElement.querySelector(\'input[type=text]\');t.value=this.value;this.parentElement.classList.toggle(\'has-val\',!!this.value)"></div></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>医疗总费用 <span style="color:#E05252">*</span></label><input id="rb_amt" type="number" placeholder="0.00" step="0.01"></div><div class="svc-fld"><label>报销类型</label><select id="rb_type"><option>门诊</option><option>住院</option><option>慢特病</option></select></div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="mod-section-title">\u{1F4CE} 材料上传</div>'
  h+='<div style="font-size:10px;color:#66788A;margin-bottom:12px">支持 JPG、PNG、PDF 格式，单个文件不超过 10MB</div>'
  h+='<div class="svc-upload-row"><button type="button" class="svc-upload-btn" onclick="window._svc.triggerInvoiceUpload()">\u{1F4C4} 上传发票</button><span id="rb_invoice_status"></span></div>'
  h+='<div class="svc-upload-row" style="margin-top:8px"><button type="button" class="svc-upload-btn" onclick="window._svc.triggerDiagnosisUpload()">\u{1F4CB} 上传诊断证明</button><span id="rb_diag_status"></span></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="svc-fld"><label>备注</label><textarea id="rb_note" placeholder="选填说明"></textarea></div>'
  h+='<div class="svc-form-actions"><button class="svc-btn svc-btn-primary" onclick="window._svc.submitReimburse()">\u{1F4E4} 提交申请</button><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()">取消</button></div>'
  opMod('\u{1F4CB} 报销材料提交',h,'mod-lg')
}
function submitReimburse(){
  const hosp=document.getElementById('rb_hosp').value
  const date=document.getElementById('rb_date').value
  const amt=document.getElementById('rb_amt').value
  if(!hosp||!date||!amt){toast('请填写必填字段（带 * 号）','warn');return}
  const files=[]
  if(invoiceFile.value) files.push('发票')
  if(diagnosisFile.value) files.push('诊断证明')
  const extra=files.length?'（已上传：'+files.join('、')+'）':''
  toast('报销材料已提交，预计3个工作日内审核'+extra,'ok')
  invoiceFile.value=null; diagnosisFile.value=null
  clsMod()
}
function showHospitalReg(){
  const r=insurance[0]
  const maskedName=r?r.name:'王友德'
  const today=new Date().toISOString().split('T')[0]
  let h='<div class="mod-desc">选择医院、科室与时段，在线预约挂号</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>医院 <span style="color:#E05252">*</span></label><select id="reg_hosp"><option value="">请选择</option><option>安康市人民医院</option><option>汉滨区中医院</option><option>汉滨区人民医院</option><option>安康市中心医院</option></select></div><div class="svc-fld"><label>科室 <span style="color:#E05252">*</span></label><select id="reg_dept"><option value="">请选择</option><option>内科</option><option>外科</option><option>骨科</option><option>心内科</option><option>儿科</option></select></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>预约日期 <span style="color:#E05252">*</span></label><div class="svc-date-wrap" onclick="var d=this.querySelector(\'input[type=date]\');d.showPicker?d.showPicker():d.focus()"><input type="text" placeholder="请选择日期" readonly><input type="date" min="'+today+'" id="reg_date" onchange="var t=this.parentElement.querySelector(\'input[type=text]\');t.value=this.value;this.parentElement.classList.toggle(\'has-val\',!!this.value);var sl=document.getElementById(\'reg_time\');if(sl){var n=new Date();var td=n.getFullYear()+\'-\'+String(n.getMonth()+1).padStart(2,\'0\')+\'-\'+String(n.getDate()).padStart(2,\'0\');if(this.value===td){var h=n.getHours();var opts=sl.options;for(var i=0;i<opts.length;i++){var v=opts[i].value;if(v&&v.indexOf(\'上午\')===0&&h>=12)opts[i].disabled=true;if(v&&v.indexOf(\'下午\')===0&&h>=17)opts[i].disabled=true}}else{for(var j=0;j<sl.options.length;j++)sl.options[j].disabled=false}}"></div></div><div class="svc-fld"><label>就诊时段 <span style="color:#E05252">*</span></label><select id="reg_time"><option value="">请选择</option><option>上午 08:00-12:00</option><option>下午 14:00-17:00</option></select></div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="svc-fld"><label>就诊人</label><input value="'+maskedName+'" readonly></div>'
  h+='<div class="svc-form-actions"><button class="svc-btn svc-btn-primary" onclick="window._svc.confirmReg()">\u2705 确认预约</button><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()">取消</button></div>'
  opMod('\u{1F3E5} 在线挂号',h,'mod-md')
}
function confirmReg(){
  const hosp=document.getElementById('reg_hosp').value
  const dept=document.getElementById('reg_dept').value
  const date=document.getElementById('reg_date').value
  const time=document.getElementById('reg_time').value
  if(!hosp||!dept||!date||!time){toast('请填写必填字段（带 * 号）','warn');return}
  const now=new Date()
  const today=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')
  if(date<today){toast('预约日期不能早于今天','warn');return}
  if(date===today){
    const curHour=now.getHours()
    if(time.indexOf('上午')===0&&curHour>=12){toast('上午时段已过，请选择下午时段','warn');return}
    if(time.indexOf('下午')===0&&curHour>=17){toast('下午时段已过，请选择其他日期','warn');return}
  }
  toast('挂号成功！'+hosp+' '+dept+' '+date+' '+time,'ok');clsMod()
}
function showPaymentHistory(){
  const payments=[
    {date:'2026-08-10',type:'城乡居民医保',amount:380,status:'已缴纳'},
    {date:'2026-06-15',type:'大病补充保险',amount:150,status:'已缴纳'},
    {date:'2025-06-10',type:'城乡居民医保',amount:380,status:'已缴纳'},
    {date:'2025-03-20',type:'大病补充保险',amount:150,status:'已缴纳'},
    {date:'2024-06-10',type:'城乡居民医保',amount:380,status:'已缴纳'},
    {date:'2024-01-15',type:'大病补充保险',amount:120,status:'已缴纳'},
    {date:'2023-06-10',type:'城乡居民医保',amount:350,status:'已缴纳'},
  ]
  window._svc._payments=payments
  let h='<div class="mod-desc">城乡居民医保缴费记录，支持按年份和月份筛选</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>年份</label><select id="pay_year" onchange="window._svc.filterPayments()"><option value="">全部年份</option><option value="2026">2026 年</option><option value="2025">2025 年</option><option value="2024">2024 年</option><option value="2023">2023 年</option></select></div><div class="svc-fld"><label>月份</label><select id="pay_month" onchange="window._svc.filterPayments()"><option value="">全部月份</option>'
  for(let m=1;m<=12;m++) h+='<option value="'+m+'">'+m+'月</option>'
  h+='</select></div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div id="pay_table_wrap">'
  h+='<table class="svc-pay-table"><thead><tr><th>缴费日期</th><th>缴费类型</th><th style="text-align:right">金额</th><th style="text-align:center">状态</th></tr></thead><tbody id="pay_tbody">'
  payments.forEach(p=>{
    h+='<tr><td>'+p.date+'</td><td>'+p.type+'</td><td class="svc-pay-amount" style="text-align:right">&yen;'+p.amount+'</td><td style="text-align:center"><span class="svc-tag green">'+p.status+'</span></td></tr>'
  })
  h+='</tbody></table></div>'
  const total=payments.reduce((s,p)=>s+p.amount,0)
  h+='<div class="svc-pay-footer" id="pay_footer">共 '+payments.length+' 条记录 &middot; 累计缴费 <b style="color:#22B573">&yen;'+total.toLocaleString()+'</b></div>'
  opMod('\u{1F4C4} 缴费记录',h,'mod-md')
}
function filterPayments(){
  const payments=window._svc._payments||[]
  const year=document.getElementById('pay_year')?.value||''
  const month=document.getElementById('pay_month')?.value||''
  const tbody=document.getElementById('pay_tbody')
  const footer=document.getElementById('pay_footer')
  if(!tbody||!footer)return
  let filtered=payments
  if(year) filtered=filtered.filter(p=>p.date.startsWith(year))
  if(month) filtered=filtered.filter(p=>parseInt(p.date.split('-')[1])===parseInt(month))
  let rows=''
  if(filtered.length===0){
    rows='<tr><td colspan="4" style="text-align:center;color:#66788A;padding:28px 0">暂无符合条件的缴费记录</td></tr>'
  }else{
    filtered.forEach(p=>{
      rows+='<tr><td>'+p.date+'</td><td>'+p.type+'</td><td class="svc-pay-amount" style="text-align:right">&yen;'+p.amount+'</td><td style="text-align:center"><span class="svc-tag green">'+p.status+'</span></td></tr>'
    })
  }
  tbody.innerHTML=rows
  const total=filtered.reduce((s,p)=>s+p.amount,0)
  footer.innerHTML='共 '+filtered.length+' 条记录 &middot; 累计缴费 <b style="color:#22B573">&yen;'+total.toLocaleString()+'</b>'
}
function showRemoteRecord(){
  const r=insurance[0]
  const maskedPhone=r&&r.idCard?'138****5678':''
  let h='<div class="mod-desc">长期外地居住或转诊就医前需办理异地备案</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>就医地区 <span style="color:#E05252">*</span></label><select id="rr_region"><option value="">请选择</option><option>陕西省西安市</option><option>陕西省宝鸡市</option><option>陕西省汉中市</option><option>其他省份</option></select></div><div class="svc-fld"><label>备案原因 <span style="color:#E05252">*</span></label><select id="rr_reason"><option value="">请选择</option><option>异地长期居住</option><option>转诊转院</option><option>异地急诊</option></select></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>开始日期 <span style="color:#E05252">*</span></label><div class="svc-date-wrap" onclick="var d=this.querySelector(\'input[type=date]\');d.showPicker?d.showPicker():d.focus()"><input type="text" placeholder="请选择日期" readonly><input type="date" id="rr_start" onchange="var t=this.parentElement.querySelector(\'input[type=text]\');t.value=this.value;this.parentElement.classList.toggle(\'has-val\',!!this.value)"></div></div><div class="svc-fld"><label>预计结束日期</label><div class="svc-date-wrap" onclick="var d=this.querySelector(\'input[type=date]\');d.showPicker?d.showPicker():d.focus()"><input type="text" placeholder="请选择日期" readonly><input type="date" id="rr_end" onchange="var t=this.parentElement.querySelector(\'input[type=text]\');t.value=this.value;this.parentElement.classList.toggle(\'has-val\',!!this.value)"></div></div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="svc-fld"><label>联系电话</label><input id="rr_phone" value="'+maskedPhone+'" placeholder="请输入联系电话"></div>'
  h+='<div class="svc-fld"><label>备注</label><textarea id="rr_note" placeholder="选填说明"></textarea></div>'
  h+='<div class="svc-form-actions"><button class="svc-btn svc-btn-primary" onclick="window._svc.submitRemote()">\u{1F4E4} 提交备案</button><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()">取消</button></div>'
  opMod('\u{1F30D} 异地就医备案',h,'mod-md')
}
function submitRemote(){
  const region=document.getElementById('rr_region').value
  const reason=document.getElementById('rr_reason').value
  const start=document.getElementById('rr_start').value
  if(!region||!reason||!start){toast('请填写必填字段（带 * 号）','warn');return}
  toast('异地就医备案已提交，审核结果将以短信通知','ok');clsMod()
}
function showSubsidyProgress(){
  if(subsidy.length===0){opMod('\u{1F50D} 补贴进度查询','<div style="color:#66788A;text-align:center;padding:30px 0">暂无申请记录</div>','mod-sm');return}
  let h=''
  subsidy.forEach(r=>{
    h+='<div class="svc-progress-card">'
    h+='<div class="svc-progress-header"><div><span style="color:#1F2D3D;font-weight:600;font-size:13px">'+r.type+'</span><span style="color:#66788A;font-size:10px;margin-left:8px">'+r.appNo+'</span></div><span class="tag '+(r.status==='已发放'?'g':r.status==='审核中'?'y':'b')+'">'+r.status+'</span></div>'
    h+='<div class="svc-progress-meta">申请日期：'+r.date+' | 金额：<b style="color:#22B573">&yen;'+Number(r.amount).toLocaleString()+'</b> | 当前节点：<b style="color:#0EA5E9">'+r.node+'</b></div>'
    h+='<div class="svc-node-chain">'
    r.nodes.forEach((n,i)=>{
      const done=i<=r.currentNodeIdx
      const active=i===r.currentNodeIdx
      h+='<div class="svc-node-item '+(done?'done':'')+' '+(active?'active':'')+'">'
      h+='<div class="svc-node-dot">'+(done?'✓':(i+1))+'</div>'
      h+='<div class="svc-node-label">'+n+'</div>'
      if(i<r.nodes.length-1) h+='<div class="svc-node-line '+(i<r.currentNodeIdx?'done':'')+'"></div>'
      h+='</div>'
    })
    h+='</div></div>'
  })
  opMod('\u{1F50D} 补贴进度查询',h,'mod-lg')
}

function showPolicyQuery(){
  const policies=[
    {type:'耕地地力保护补贴',target:'拥有耕地承包权且实际耕种的农户',condition:'确权耕地面积且未撂荒、非"非粮化"',standard:'关中≥70 陕南≥60 陕北≥50元/亩·年',materials:'身份证、土地承包经营权证（或确权证明）、补贴申请表',process:'农户申报 → 村级公示 → 乡镇审核 → 县级核定 → 惠民"一卡通"发放',basis:'陕农计财〔2025〕8号《陕西省耕地地力保护补贴实施方案》'},
    {type:'农机购置补贴',target:'从事农业生产的个人和经营组织',condition:'新购纳入陕西省补贴目录的农机具',standard:'购机价≤30%（优机优补≤35%）',materials:'身份证、购机发票、机具合格证、农机购置补贴申请表、人机合影',process:'自主购机 → 县级申请 → 审核公示 → 直补到卡',basis:'陕农发〔2024〕63号《2024-2026年陕西省农机购置与应用补贴实施方案》'},
    {type:'低保补助',target:'家庭人均收入低于当地低保标准的困难群众',condition:'家庭人均月收入低于当地保障线',standard:'分档差额补助（陕南参考：≥472元/人·月）',materials:'身份证、户口本、收入证明、财产状况证明、低保申请表',process:'个人申请 → 村级评议 → 乡镇审核 → 县级民政审批 → 公示 → 发放',basis:'《陕西省最低生活保障工作规程》（2025年10月起提标4.88%）'},
    {type:'创业补贴',target:'返乡入乡农民工首次创业',condition:'首次创办小微企业或个体经营且正常运营满1年',standard:'¥10,000（一次性）',materials:'身份证、营业执照、经营场所证明、创业补贴申请表',process:'个人申请 → 县级人社部门审核 → 公示 → 发放至社保卡',basis:'陕财办社〔2025〕81号《陕西省就业补助资金管理实施办法》'}
  ]
  let h='<div class="mod-desc">惠农补贴政策查询，点击政策类型查看详情，或下载完整政策文件</div>'
  policies.forEach((p,i)=>{
    h+='<div class="svc-policy-item" onclick="window._svc.showSvcPolicyDetail('+i+')"><div class="svc-policy-item-header"><span style="color:#1F2D3D;font-weight:600;font-size:13px">'+p.type+'</span><span style="color:#66788A;font-size:10px">'+p.standard+'</span></div><div style="font-size:11px;color:#66788A;margin-top:3px">适用对象：'+p.target+'</div><div style="color:#0EA5E9;font-size:10px;margin-top:4px">点击查看详情 ▶</div></div>'
  })
  h+='<div style="text-align:center;margin-top:16px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.downloadPolicyFile()" style="flex:none;width:auto">\u{1F4E5} 下载完整政策文件（PDF）</button></div>'
  opMod('\u{1F4DC} 惠农补贴政策',h,'mod-lg')
}
function showPolicyDetail(idx){
  const policies=[
    {type:'耕地地力保护补贴',target:'拥有耕地承包权且实际耕种的农户',condition:'确权耕地面积且未撂荒、非"非粮化"',standard:'关中≥70 陕南≥60 陕北≥50元/亩·年',materials:'身份证、土地承包经营权证（或确权证明）、补贴申请表',process:'农户申报 → 村级公示 → 乡镇审核 → 县级核定 → 惠民"一卡通"发放',basis:'陕农计财〔2025〕8号《陕西省耕地地力保护补贴实施方案》'},
    {type:'农机购置补贴',target:'从事农业生产的个人和经营组织',condition:'新购纳入陕西省补贴目录的农机具',standard:'购机价≤30%（优机优补≤35%）',materials:'身份证、购机发票、机具合格证、农机购置补贴申请表、人机合影',process:'自主购机 → 县级申请 → 审核公示 → 直补到卡',basis:'陕农发〔2024〕63号《2024-2026年陕西省农机购置与应用补贴实施方案》'},
    {type:'低保补助',target:'家庭人均收入低于当地低保标准的困难群众',condition:'家庭人均月收入低于当地保障线',standard:'分档差额补助（陕南参考：≥472元/人·月）',materials:'身份证、户口本、收入证明、财产状况证明、低保申请表',process:'个人申请 → 村级评议 → 乡镇审核 → 县级民政审批 → 公示 → 发放',basis:'《陕西省最低生活保障工作规程》（2025年10月起提标4.88%）'},
    {type:'创业补贴',target:'返乡入乡农民工首次创业',condition:'首次创办小微企业或个体经营且正常运营满1年',standard:'¥10,000（一次性）',materials:'身份证、营业执照、经营场所证明、创业补贴申请表',process:'个人申请 → 县级人社部门审核 → 公示 → 发放至社保卡',basis:'陕财办社〔2025〕81号《陕西省就业补助资金管理实施办法》'}
  ]
  const p=policies[idx];if(!p)return
  let h='<div class="svc-policy-detail">'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">补贴类型</span><span class="svc-rc-value">'+p.type+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">适用对象</span><span class="svc-rc-value">'+p.target+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">申请条件</span><span class="svc-rc-value">'+p.condition+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">补贴标准</span><span class="svc-rc-value" style="color:#22B573;font-weight:600">'+p.standard+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">所需材料</span><span class="svc-rc-value">'+p.materials+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">办理流程</span><span class="svc-rc-value">'+p.process+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">政策依据</span><span class="svc-rc-value">'+p.basis+'</span></div>'
  h+='</div>'
  h+='<div style="text-align:center;margin-top:16px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.downloadPolicyFile()" style="flex:none;width:auto">\u{1F4E5} 下载该政策文件（PDF）</button></div>'
  opMod('\u{1F4DC} '+p.type+' — 政策详情',h,'mod-md')
}
function downloadPolicyFile(){
  toast('政策文件（PDF）已开始下载','ok')
}

function emergencyCall(){
  if(elderly.length===0){toast('暂无绑定老人','warn');return}
  if(elderly.length===1){emergencyCallFor(elderly[0]);return}
  elderPicker(emergencyCallFor,'选择呼救对象')
}
function confirmEmergencyCall(name,addr,relation){
  const now=new Date();const ts=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')+' '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0')
  let h='<div style="text-align:center;padding:8px 0"><div style="font-size:40px;margin-bottom:12px">✅</div><div style="color:#22B573;font-size:15px;font-weight:700;margin-bottom:6px">呼救已发出</div><div style="color:#66788A;font-size:12px;margin-bottom:16px">紧急联系人已通知，请保持电话畅通</div>'
  h+='<div style="background:#EBEFF4;border:1px solid #E3EAF0;border-radius:8px;padding:10px 14px;margin-bottom:12px;text-align:left">'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#66788A">呼救对象</span><span style="color:#1F2D3D">'+name+'</span></div>'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#66788A">所在位置</span><span style="color:#1F2D3D">中堰村'+addr+'</span></div>'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#66788A">呼救时间</span><span style="color:#1F2D3D">'+ts+'</span></div>'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#66788A">联系人通知</span><span style="color:#22B573">✓ 已通知（子女）</span></div>'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#66788A">村卫生室</span><span style="color:#22B573">✓ 已通知</span></div>'
  h+='</div>'
  h+='<div style="font-size:10px;color:#F2A62B;text-align:center;margin-bottom:12px">⚠ 演示系统：以上为模拟通知流程，实际紧急情况请直接拨打120</div>'
  h+='<button class="svc-btn svc-btn-primary" onclick="window._svc.clsMod()" style="width:100%">我知道了</button></div>'
  opMod('🚑 呼救状态',h,'mod-sm')
}
function showElderlyLocation(){
  if(elderly.length===0){toast('暂无绑定老人','warn');return}
  if(elderly.length===1){showLocationFor(elderly[0]);return}
  elderPicker(showLocationFor,'选择老人 · 查看位置')
}
function showHealthReport(){
  if(elderly.length===0){toast('暂无绑定老人','warn');return}
  if(elderly.length===1){showHealthReportFor(elderly[0]);return}
  elderPicker(showHealthReportFor,'选择老人 · 查看健康报告')
}
function sendHealthReport(name,id){
  const now=new Date();const ts=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')+' '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0')
  toast('✓ '+name+' 健康报告已发送至绑定手机（'+ts+'）','ok');clsMod()
}
function dispatchAlert(){
  if(elderly.length===0){toast('暂无绑定老人','warn');return}
  if(elderly.length===1){showAlertSettingsFor(elderly[0]);return}
  elderPicker(showAlertSettingsFor,'选择老人 · 预警设置')
}
// saveAlertSettings replaced by per-elder saveAlertSettingsFor(eid)
function showTelemedForm(){
  const today=new Date().toISOString().split('T')[0]
  const nowH=String(new Date().getHours()).padStart(2,'0')
  const nowM=String(new Date().getMinutes()).padStart(2,'0')
  const nowTime=nowH+':'+nowM
  let h='<div class="svc-form-row"><div class="svc-fld"><label>就诊人</label><select id="tm_patient">'
  h+='<option value="王友德">王友德（本人）</option>'
  elderly.forEach(e=>{h+='<option value="'+e.name+'">'+e.name+'（'+e.relation+'）</option>'})
  h+='</select><div style="font-size:10px;color:#66788A;margin-top:4px">本人及已绑定的家庭成员</div></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>选择科室</label><select id="tm_dept"><option value="内科">内科</option><option value="骨科">骨科</option><option value="心内科">心内科</option><option value="皮肤科">皮肤科</option><option value="儿科">儿科</option></select></div><div class="svc-fld"><label>选择医生</label><select id="tm_doctor"><option value="张医生">张医生（内科）</option><option value="李医生">李医生（骨科）</option><option value="王医生">王医生（心内科）</option></select></div></div>'
  h+='<div class="svc-form-row">'
  h+='<div class="svc-fld"><label>预约日期</label>'
  h+='<div style="position:relative;height:44px">'
  h+='<input id="tm_date_display" type="text" placeholder="请选择日期" readonly style="width:100%;height:44px;background:#FFFFFF;border:1px solid #E3EAF0;border-radius:8px;padding:0 38px 0 12px;color:#1F2D3D;font-size:13px;font-family:inherit;box-sizing:border-box;cursor:pointer;outline:none">'
  h+='<span style="position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:16px;pointer-events:none;color:#66788A;line-height:1">📅</span>'
  h+='<input id="tm_date" type="date" min="'+today+'" onchange="var d=document.getElementById(\'tm_date_display\');if(d)d.value=this.value;var ti=document.getElementById(\'tm_time\');if(ti){var n=new Date();var td=n.getFullYear()+\'-\'+String(n.getMonth()+1).padStart(2,\'0\')+\'-\'+String(n.getDate()).padStart(2,\'0\');if(this.value===td){ti.min=String(n.getHours()).padStart(2,\'0\')+\':\'+String(n.getMinutes()).padStart(2,\'0\')}else{ti.min=\'\'}}" onclick="this.showPicker()" style="position:absolute;inset:0;opacity:0;cursor:pointer;color-scheme:dark;border:none!important;background:transparent!important;padding:0!important;width:100%!important;height:100%!important">'
  h+='</div></div>'
  h+='<div class="svc-fld"><label>预约时间</label>'
  h+='<div style="position:relative;height:44px">'
  h+='<input id="tm_time_display" type="text" placeholder="请选择时间" readonly style="width:100%;height:44px;background:#FFFFFF;border:1px solid #E3EAF0;border-radius:8px;padding:0 38px 0 12px;color:#1F2D3D;font-size:13px;font-family:inherit;box-sizing:border-box;cursor:pointer;outline:none">'
  h+='<span style="position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:16px;pointer-events:none;color:#66788A;line-height:1">🕐</span>'
  h+='<input id="tm_time" type="time" min="'+nowTime+'" onchange="var d=document.getElementById(\'tm_time_display\');if(d)d.value=this.value" onclick="this.showPicker()" style="position:absolute;inset:0;opacity:0;cursor:pointer;color-scheme:dark;border:none!important;background:transparent!important;padding:0!important;width:100%!important;height:100%!important">'
  h+='</div></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>问诊类型</label><select id="tm_type"><option value="视频问诊">视频问诊</option><option value="在线复诊">在线复诊</option><option value="图文问诊">图文问诊</option></select></div><div class="svc-fld"><label>主要症状</label><input id="tm_symptom" placeholder="请简要描述症状"></div></div>'
  h+='<div class="svc-form-actions" style="margin-top:20px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="flex:none;width:auto">取消</button><button class="svc-btn svc-btn-primary" onclick="window._svc.confirmTelemed()" style="flex:none;width:auto">✓ 确认预约</button></div>'
  opMod('\u{1F4F9} 预约远程问诊',h,'mod-md')
}
function confirmTelemed(){
  const patient=document.getElementById('tm_patient')?.value?.trim()
  const date=document.getElementById('tm_date')?.value?.trim()
  const time=document.getElementById('tm_time')?.value?.trim()
  if(!patient){toast('请选择就诊人','warn');return}
  if(!date){toast('请选择预约日期','warn');return}
  if(!time){toast('请选择预约时间','warn');return}
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){toast('日期格式应为 YYYY-MM-DD','warn');return}
  if(!/^\d{2}:\d{2}$/.test(time)){toast('时间格式应为 HH:mm','warn');return}
  const now=new Date()
  const today=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')
  if(date<today){toast('预约日期不能早于今天','warn');return}
  if(date===today){
    const[h,m]=time.split(':').map(Number)
    if(h*60+m<=now.getHours()*60+now.getMinutes()){toast('预约时间不能早于当前时间','warn');return}
  }
  const dept=document.getElementById('tm_dept')?.value||'内科'
  const doctor=document.getElementById('tm_doctor')?.value||'张医生'
  const type=document.getElementById('tm_type')?.value||'视频问诊'
  const symptom=document.getElementById('tm_symptom')?.value?.trim()||'-'
  telemed.unshift({id:uid(),patient,doctor,dept,date,time,type,diagnosis:'待诊断',status:'待就诊',prescription:'-',rxStatus:'无处方',rxDate:'-',symptom,advice:'-'})
  clsMod();toast('✓ 预约成功！'+date+' '+time+' '+doctor+'（'+dept+'）','ok')
}
function enterVideoRoom(){
  const pending=telemed.filter(t=>t.status==='待就诊'&&telemedStatus(t)==='待就诊')
  if(pending.length===0){
    let h='<div style="text-align:center;padding:16px"><div style="font-size:52px;margin-bottom:12px">⏳</div>'
    h+='<div style="font-size:15px;color:#1F2D3D;font-weight:700;margin-bottom:6px">暂无待就诊的预约</div>'
    h+='<div style="font-size:12px;color:#66788A;margin-bottom:18px">请先预约远程问诊后再进入诊室</div>'
    h+='<button class="svc-btn svc-btn-primary" onclick="window._svc.clsMod();window._svc.showTelemedForm()" style="width:100%">📹 立即预约问诊</button></div>'
    opMod('▶️ 视频诊室',h,'mod-sm')
    return
  }
  const appt=pending[0]
  // Time-based access check
  const apptDateTime=new Date(appt.date+'T'+appt.time+':00')
  const now=new Date()
  const diffMs=now-apptDateTime
  const diffMin=Math.floor(diffMs/60000)
  const earlyOpenMin=-15  // 15 min before
  const lateCloseMin=60   // 60 min after
  let accessStatus=''
  if(diffMin<earlyOpenMin){
    const waitMin=Math.abs(diffMin)
    accessStatus='early'
  } else if(diffMin>lateCloseMin){
    accessStatus='expired'
  } else {
    accessStatus='ok'
  }
  let h='<div style="text-align:center;padding:6px"><div style="font-size:56px;margin-bottom:8px">📹</div>'
  h+='<div style="font-size:14px;color:#1F2D3D;font-weight:700;margin-bottom:12px">视频诊室</div>'
  h+='<div style="background:#FFFFFF;border:1px solid #E3EAF0;border-radius:10px;padding:12px 16px;margin-bottom:16px;text-align:left">'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#66788A">患者</span><span style="color:#1F2D3D">'+appt.patient+'</span></div>'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#66788A">医生</span><span style="color:#1F2D3D">'+appt.doctor+'</span></div>'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#66788A">科室</span><span style="color:#1F2D3D">'+appt.dept+'</span></div>'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#66788A">预约时间</span><span style="color:#1F2D3D">'+appt.date+' '+appt.time+'</span></div>'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#66788A">问诊类型</span><span style="color:#1F2D3D">'+appt.type+'</span></div>'
  h+='<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#66788A">状态</span><span class="tag y">待就诊</span></div>'
  h+='</div>'
  if(accessStatus==='early'){
    h+='<div style="background:rgba(242,166,43,0.06);border:1px solid rgba(242,166,43,0.15);border-radius:8px;padding:10px 14px;margin-bottom:16px;text-align:center">'
    h+='<div style="color:#F2A62B;font-size:12px;font-weight:600;margin-bottom:4px">⏰ 预约时间未到</div>'
    h+='<div style="color:#66788A;font-size:11px">请在预约时间前15分钟进入诊室</div>'
    h+='</div>'
    h+='<button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="width:100%">关闭</button>'
  } else if(accessStatus==='expired'){
    h+='<div style="background:rgba(224,82,82,0.06);border:1px solid rgba(224,82,82,0.15);border-radius:8px;padding:10px 14px;margin-bottom:16px;text-align:center">'
    h+='<div style="color:#E05252;font-size:12px;font-weight:600;margin-bottom:4px">⏰ 预约已过期</div>'
    h+='<div style="color:#66788A;font-size:11px">就诊时间已过，请重新预约</div>'
    h+='</div>'
    h+='<div style="display:flex;gap:10px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="flex:none;flex:1">关闭</button><button class="svc-btn svc-btn-primary" onclick="window._svc.clsMod();window._svc.showTelemedForm()" style="flex:none;flex:1">重新预约</button></div>'
  } else {
    h+='<div style="background:#EBEFF4;border:1px solid #E3EAF0;border-radius:8px;padding:8px 14px;margin-bottom:16px;text-align:center">'
    h+='<div style="color:#22B573;font-size:11px">✓ 当前在就诊时间范围内，可进入诊室</div>'
    h+='</div>'
    h+='<div style="display:flex;gap:10px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="flex:none;flex:1">取消</button><button class="svc-btn svc-btn-primary" onclick="window._svc.enterRoom()" style="flex:none;flex:1">▶ 进入诊室</button></div>'
  }
  h+='</div>'
  opMod('▶️ 视频诊室',h,'mod-sm')
}
function showTelemedDetailById(id){
  const r=telemed.find(t=>t.id===id)
  if(r)showTelemedDetail(r)
}
function enterRoom(){clsMod();toast('诊室连接成功','ok')}
function renderMedicalRecords(filterPatient, filterYear){
  const modBody=document.querySelector('.svc-modal .mod-bd')
  if(!modBody)return
  let list=telemed
  if(filterPatient&&filterPatient!=='全部') list=list.filter(r=>r.patient===filterPatient)
  if(filterYear&&filterYear!=='全部') list=list.filter(r=>r.date.startsWith(filterYear))
  let h=renderMedicalFilterBar(filterPatient||'全部', filterYear||'全部')
  if(list.length===0){
    h+='<div style="color:#66788A;text-align:center;padding:24px 0">暂无匹配的病历记录</div>'
  } else {
    list.forEach(r=>{
      h+='<div onclick="window._svc.showTelemedDetailById('+r.id+')" style="cursor:pointer;background:#FFFFFF;border:1px solid #EBEFF4;border-radius:10px;padding:14px 16px;margin-bottom:10px;transition:all 0.2s" onmouseover="this.style.borderColor=\'rgba(14,165,233,0.25)\';this.style.background=\'#EBEFF4\'" onmouseout="this.style.borderColor=\'#EBEFF4\';this.style.background=\'#FFFFFF\'">'
      h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">'
      h+='<div><span style="color:#1F2D3D;font-weight:600;font-size:13px">'+r.date+'</span><span style="color:#66788A;font-size:11px;margin-left:8px">'+r.dept+' · '+r.doctor+'</span></div>'
      const ds=telemedStatus(r);const completed=r.status==='已完成';h+='<span class="tag '+(ds==='已完成'?'g':ds==='已过期'?'r':'y')+'">'+ds+'</span>'
      h+='</div>'
      h+='<div style="font-size:11px;color:#66788A">就诊人：'+r.patient+' | 类型：'+r.type+(completed&&r.diagnosis!=='待诊断'?' | 诊断：'+r.diagnosis:'')+'</div>';if(r.symptom&&r.symptom!=='-')h+='<div style="font-size:11px;color:#475867;margin-top:2px">主诉：'+r.symptom+'</div>'
      if(completed&&r.prescription&&r.prescription!=='-') h+='<div style="font-size:11px;color:#0EA5E9;margin-top:3px">💊 '+r.prescription+'</div>'
      h+='<div style="font-size:10px;color:#0EA5E9;margin-top:6px">▶ 点击查看完整详情</div>'
      h+='</div>'
    })
  }
  modBody.innerHTML=h
}
function renderMedicalFilterBar(selPatient, selYear){
  const patients=['全部','王友德','王奶奶','周爷爷']
  const years=['全部','2026','2025']
  let h='<div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap">'
  h+='<select id="mr_filter_patient" onchange="window._svc.renderMedicalRecords(this.value,document.getElementById(\'mr_filter_year\').value)" style="background:#FFFFFF;border:1px solid rgba(14,165,233,0.15);color:#1F2D3D;padding:6px 12px;border-radius:6px;font-size:11px;font-family:inherit;cursor:pointer;outline:none">'
  patients.forEach(p=>{h+='<option value="'+p+'"'+(p===selPatient?' selected':'')+'>'+p+(p==='全部'?'就诊人':'')+'</option>'})
  h+='</select>'
  h+='<select id="mr_filter_year" onchange="window._svc.renderMedicalRecords(document.getElementById(\'mr_filter_patient\').value,this.value)" style="background:#FFFFFF;border:1px solid rgba(14,165,233,0.15);color:#1F2D3D;padding:6px 12px;border-radius:6px;font-size:11px;font-family:inherit;cursor:pointer;outline:none">'
  years.forEach(y=>{h+='<option value="'+y+'"'+(y===selYear?' selected':'')+'>'+y+(y==='全部'?'年份':'年')+'</option>'})
  h+='</select>'
  h+='<span style="font-size:10px;color:#66788A;display:flex;align-items:center">共 '+telemed.length+' 条记录</span>'
  h+='</div>'
  return h
}
function showMedicalRecords(){
  let h=renderMedicalFilterBar('全部','全部')
  telemed.forEach((r,i)=>{
    h+='<div onclick="window._svc.showTelemedDetailById('+r.id+')" style="cursor:pointer;background:#FFFFFF;border:1px solid #EBEFF4;border-radius:10px;padding:14px 16px;margin-bottom:10px;transition:all 0.2s" onmouseover="this.style.borderColor=\'rgba(14,165,233,0.25)\';this.style.background=\'#EBEFF4\'" onmouseout="this.style.borderColor=\'#EBEFF4\';this.style.background=\'#FFFFFF\'">'
    h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">'
    h+='<div><span style="color:#1F2D3D;font-weight:600;font-size:13px">'+r.date+'</span><span style="color:#66788A;font-size:11px;margin-left:8px">'+r.dept+' · '+r.doctor+'</span></div>'
    const ds=telemedStatus(r);const completed=r.status==='已完成';h+='<span class="tag '+(ds==='已完成'?'g':ds==='已过期'?'r':'y')+'">'+ds+'</span>'
    h+='</div>'
    h+='<div style="font-size:11px;color:#66788A">就诊人：'+r.patient+' | 类型：'+r.type+(completed&&r.diagnosis!=='待诊断'?' | 诊断：'+r.diagnosis:'')+'</div>';if(r.symptom&&r.symptom!=='-')h+='<div style="font-size:11px;color:#475867;margin-top:2px">主诉：'+r.symptom+'</div>'
    if(completed&&r.prescription&&r.prescription!=='-') h+='<div style="font-size:11px;color:#0EA5E9;margin-top:3px">💊 '+r.prescription+'</div>'
    h+='<div style="font-size:10px;color:#0EA5E9;margin-top:6px">▶ 点击查看完整详情</div>'
    h+='</div>'
  })
  opMod('\u{1F4CB} 病历档案',h||'<div style="color:#66788A;text-align:center;padding:30px 0">暂无病历记录</div>','mod-md')
}
function showPrescriptions(){
  const arr=telemed.filter(r=>r.prescription&&r.prescription!=='-')
  let h=''
  if(arr.length===0){h='<div style="color:#66788A;text-align:center;padding:30px 0">暂无处方记录</div>'}
  else {
    arr.forEach(r=>{
      const rxDate=r.rxDate&&r.rxDate!=='-'?r.rxDate:r.date
      const rxStatus=r.rxStatus||(r.status==='已完成'?'已取药':'待取药')
      const statusColor=rxStatus==='已取药'?'g':rxStatus==='已失效'?'r':'y'
      h+='<div style="background:#FFFFFF;border:1px solid #EBEFF4;border-radius:10px;padding:14px 16px;margin-bottom:10px">'
      h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'
      h+='<div><span style="color:#1F2D3D;font-weight:600;font-size:13px">'+r.patient+'</span><span style="color:#66788A;font-size:11px;margin-left:8px">'+r.doctor+' · '+r.dept+'</span></div>'
      h+='<span class="tag '+statusColor+'">'+rxStatus+'</span>'
      h+='</div>'
      h+='<div style="font-size:12px;color:#0EA5E9;margin:6px 0;font-weight:500">💊 '+r.prescription+'</div>'
      h+='<div style="display:flex;justify-content:space-between;font-size:10px;color:#66788A">'
      h+='<span>开具日期：'+rxDate+'</span>'
      h+='<span>诊断：'+r.diagnosis+'</span>'
      h+='</div></div>'
    })
  }
  opMod('\u{1F48A} 处方查询',h,'mod-md')
}
function closeLiveCard(){ liveCard.vis=false }
function enterLiveStream(course){
  liveCard.vis=false
  toast('\u{1F4FA} 正在进入直播：\u300C'+course.title+'\u300D','info')
}
function enterLiveRoom(){
  if(liveCard.vis){ liveCard.vis=false; return }
  const now=new Date()
  const enrolledIds=trainingEnrollments.map(e=>e.courseId)
  const allCourses=historicalEnrolledCourses.concat(trainingCourses)
  const live=allCourses.find(c=>{
    if(c.type!=='LIVE'&&c.type!=='ONLINE')return false
    if(!enrolledIds.includes(c.id))return false
    const start=new Date(c.date+'T'+c.time)
    const durMatch=c.duration.match(/(\d+(\.\d+)?)/)
    const durHours=durMatch?parseFloat(durMatch[1]):1
    const end=new Date(start.getTime()+durHours*3600000)
    return now>=start&&now<=end
  })
  if(live){
    liveCard.isLive=true
    liveCard.course=live
    liveCard.nextCourse=null
  }else{
    liveCard.isLive=false
    liveCard.course=null
    liveCard.nextCourse=findNextLiveCourse()
  }
  liveCard.vis=true
}
function showReplayList(){
  const replayable=myTrainingList.value.filter(c=>c.replayStatus==='PUBLISHED'&&c.replayUrl)
  if(!replayable.length){toast('暂无课程回放','info');return}
  let h='<div class="mod-desc">可观看的培训课程回放</div>'
  replayable.forEach(c=>{
    h+='<div class="svc-policy-item" onclick="window._svc.showReplayForById('+c.id+')" style="cursor:pointer">'
    h+='<div class="svc-policy-item-header"><span style="color:#1F2D3D;font-weight:600;font-size:13px">'+c.title+'</span>'
    h+='<span class="tag g">已完成</span></div>'
    h+='<div style="font-size:11px;color:#66788A;margin-top:4px">'+c.teacher+' | '+c.date+' | '+getTypeLabel(c)+'</div>'
    h+='<div style="color:#0EA5E9;font-size:10px;margin-top:4px">\u25B6 点击查看回放</div></div>'
  })
  opMod('\u{1F4FA} 课程回放',h,'mod-md')
}
// Step-based booking state
let _bookStep = 0, _bookServiceId = '', _bookDate = '', _bookTime = ''
function showApptForm(serviceId){
  // Reset state; if serviceId provided, jump to date selection
  _bookStep = 0; _bookServiceId = serviceId || ''; _bookDate = ''; _bookTime = ''
  if (serviceId) { _bookStep = 1; renderBookStep() }
  else renderBookStep()
}
function renderBookStep(){
  let h = '', title = '\u{1F4C5} 在线预约'
  if (_bookStep === 0) {
    // Step 0: Select service
    title = '\u{1F4C5} 选择办理事项'
    h += '<div class="mod-desc">请选择您要办理的事项</div>'
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">'
    governmentServices.forEach(svc => {
      h += '<div onclick="window._svc.bookStep1(\''+svc.id+'\')" style="background:#FFFFFF;border:1px solid #E3EAF0;border-radius:8px;padding:10px 12px;cursor:pointer;transition:all 0.2s" onmouseover="this.style.borderColor=\'rgba(14,165,233,0.35)\';this.style.background=\'#F8FAFB\';" onmouseout="this.style.borderColor=\'#E3EAF0\';this.style.background=\'#FFFFFF\';" >'
      h += '<div style="font-size:13px;color:#1F2D3D;font-weight:600;margin-bottom:4px">'+svc.name+'</div>'
      h += '<div style="font-size:10px;color:#66788A">'+svc.window+' · '+svc.duration+'</div>'
      h += '</div>'
    })
    h += '</div>'
  } else if (_bookStep === 1) {
    // Step 1: Select date
    const svc = getServiceById(_bookServiceId)
    title = '\u{1F4C5} '+svc.name+' — 选择日期'
    h += '<div class="mod-desc"><span style="color:#0EA5E9;font-weight:600">'+svc.name+'</span> | '+svc.window+' | '+svc.duration+'</div>'
    h += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:10px">'
    const days = ['日','一','二','三','四','五','六']
    days.forEach(d => { h += '<div style="text-align:center;font-size:10px;color:#66788A;padding:4px 0">'+d+'</div>' })
    const today = new Date()
    for (let i = 0; i < 14; i++) {
      const dt = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
      const ds = dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(dt.getDate()).padStart(2,'0')
      const dow = dt.getDay()
      const isWeekend = dow === 0 || dow === 6
      const dayLabel = i === 0 ? '今天' : (i === 1 ? '明天' : String(dt.getMonth()+1)+'/'+String(dt.getDate()))
      const slots = getAvailableSlots(svc.window, ds)
      const availCount = slots.filter(sl => sl.available).length
      h += '<div onclick="window._svc.bookStep2(\''+ds+'\')" style="text-align:center;padding:8px 4px;border-radius:8px;cursor:pointer;font-size:11px;background:'+(availCount>0?'#E3EAF0':'#F0F3F8')+';border:1px solid '+(availCount>0?'rgba(14,165,233,0.15)':'#F0F3F8')+';color:'+(availCount>0?'#1F2D3D':'#66788A')+'" onmouseover="this.style.borderColor=\'rgba(14,165,233,0.40)\';" onmouseout="this.style.borderColor=\''+(availCount>0?'rgba(14,165,233,0.15)':'#F0F3F8')+'\';">'
      h += '<div style="font-weight:600">'+dayLabel+'</div>'
      h += '<div style="font-size:9px;margin-top:2px">'+ds.slice(5)+'</div>'
      h += '<div style="font-size:9px;color:'+(availCount>0?'#22B573':'#66788A')+';margin-top:1px">'+availCount+'个时段</div>'
      h += '</div>'
    }
    h += '</div>'
  } else if (_bookStep === 2) {
    // Step 2: Select time slot
    const svc = getServiceById(_bookServiceId)
    title = '\u{1F4C5} '+svc.name+' — 选择时间'
    h += '<div class="mod-desc"><span style="color:#0EA5E9;font-weight:600">'+svc.name+'</span> | '+_bookDate+' | '+svc.window+'</div>'
    const slots = getAvailableSlots(svc.window, _bookDate)
    const morningSlots = slots.filter(sl => sl.time < '12:00')
    const afternoonSlots = slots.filter(sl => sl.time >= '12:00')
    function renderSlotGroup(label, group) {
      h += '<div style="font-size:11px;color:#66788A;margin:10px 0 6px">'+label+'</div>'
      h += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">'
      group.forEach(sl => {
        if (sl.available) {
          h += '<div onclick="window._svc.bookStep3(\''+sl.time+'\')" style="text-align:center;padding:8px 4px;border-radius:6px;cursor:pointer;background:#EBEFF4;border:1px solid rgba(14,165,233,0.15);color:#1F2D3D;font-size:12px;font-weight:500" onmouseover="this.style.background=\'#D0D8E2\';" onmouseout="this.style.background=\'#EBEFF4\';" >'+sl.time+'</div>'
        } else {
          h += '<div style="text-align:center;padding:8px 4px;border-radius:6px;background:#F0F3F8;border:1px solid #F0F3F8;color:#66788A;font-size:12px;text-decoration:line-through">'+sl.time+'</div>'
        }
      })
      h += '</div>'
    }
    renderSlotGroup('\u{1F31E} 上午', morningSlots)
    renderSlotGroup('\u{1F319} 下午', afternoonSlots)
  } else if (_bookStep === 3) {
    // Step 3: Confirm
    const svc = getServiceById(_bookServiceId)
    title = '\u{1F4C5} 确认预约信息'
    h += '<div class="svc-result-card">'
    h += '<div class="svc-rc-row"><span class="svc-rc-label">办理事项</span><span class="svc-rc-value" style="font-weight:600;color:#0EA5E9">'+svc.name+'</span></div>'
    h += '<div class="svc-rc-row"><span class="svc-rc-label">办理窗口</span><span class="svc-rc-value">'+svc.window+'</span></div>'
    h += '<div class="svc-rc-row"><span class="svc-rc-label">预约日期</span><span class="svc-rc-value" style="font-weight:600;color:#1F2D3D">'+_bookDate+'</span></div>'
    h += '<div class="svc-rc-row"><span class="svc-rc-label">预约时间</span><span class="svc-rc-value" style="font-weight:600;color:#1F2D3D">'+_bookTime+'</span></div>'
    h += '<div class="svc-rc-row"><span class="svc-rc-label">预计时长</span><span class="svc-rc-value">'+svc.duration+'</span></div>'
    h += '</div>'
    h += '<div class="mod-divider"></div>'
    h += '<div style="font-size:12px;color:#66788A;margin-bottom:8px">\u{1F464} 预约人信息（系统自动带出）</div>'
    h += '<div class="svc-result-card">'
    h += '<div class="svc-rc-row"><span class="svc-rc-label">姓名</span><span class="svc-rc-value" style="color:#1F2D3D">王友德</span></div>'
    h += '<div class="svc-rc-row"><span class="svc-rc-label">联系电话</span><span class="svc-rc-value">138****5432</span></div>'
    h += '<div class="svc-rc-row"><span class="svc-rc-label">所属村</span><span class="svc-rc-value">中堰村</span></div>'
    h += '</div>'
    h += '<div class="svc-form-actions" style="margin-top:14px">'
    h += '<button class="svc-btn svc-btn-secondary" onclick="window._svc.bookBack()">上一步</button>'
    h += '<button class="svc-btn svc-btn-primary" onclick="window._svc.doConfirmAppt()">\u2705 确认预约</button>'
    h += '</div>'
    return opMod(title, h, 'mod-md')
  }
  h += _bookStep > 0 ? '<div class="svc-form-actions" style="margin-top:12px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.bookBack()">'+( _bookStep===1?'返回选择事项':'上一步')+'</button></div>' : ''
  opMod(title, h, 'mod-md')
}
function doConfirmAppt(){
  const svc = getServiceById(_bookServiceId)
  if(!svc) return
  const now = new Date()
  const apptNo = 'AP'+now.getFullYear()+String(now.getMonth()+1).padStart(2,'0')+String(now.getDate()).padStart(2,'0')+String(Math.floor(Math.random()*900+100))
  appointment.unshift({
    id:uid(), serviceId:svc.id, serviceName:svc.name,
    name:'王友德', phone:'138****5432', village:'中堰村',
    window:svc.window, date:_bookDate, time:_bookTime, status:'已预约',
    apptNo, createdAt:now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')
  })
  persistAppointments()
  clsMod()
  toast('\u2705 预约成功 — '+svc.name+' | '+_bookDate+' '+_bookTime+' | '+svc.window,'ok')
  _bookStep = 0; _bookServiceId = ''; _bookDate = ''; _bookTime = ''
}

// Booking step helpers (exposed to window._svc)
function bookStep1(sid) { _bookServiceId = sid; _bookStep = 1; renderBookStep() }
function bookStep2(ds) { _bookDate = ds; _bookStep = 2; renderBookStep() }
function bookStep3(tm) { _bookTime = tm; _bookStep = 3; renderBookStep() }
function bookBack() {
  if (_bookStep <= 1) { showApptForm(); return }
  _bookStep--; renderBookStep()
}
let _apptFilter = '全部'
function showApptProgress(){
  if(!appointment.length){ toast('暂无预约记录','info'); return }
  _apptFilter = '全部'
  renderApptProgress()
}
function renderApptProgress(){
  const statusMap = { '已预约':'b', '待办理':'b', '办理中':'y', '已完成':'g', '已取消':'dim', '已失约':'r' }
  const filtered = _apptFilter === '全部' ? [...appointment] : appointment.filter(a => a.status === _apptFilter)
  let h = ''
  // Filter tabs
  const filters = ['全部','已预约','已完成','已取消']
  h += '<div style="display:flex;gap:6px;margin-bottom:12px">'
  filters.forEach(f => {
    const active = _apptFilter === f
    h += '<span onclick="window._svc.setApptFilter(\''+f+'\')" style="display:inline-block;padding:5px 14px;border-radius:14px;font-size:11px;cursor:pointer;transition:all 0.2s;'+(active?'background:rgba(14,165,233,0.15);color:#0EA5E9;font-weight:600;border:1px solid rgba(14,165,233,0.25)':'background:#FFFFFF;color:#66788A;border:1px solid #E3EAF0')+'" onmouseover="if(!'+active+')this.style.borderColor=\'rgba(14,165,233,0.25)\';this.style.color=\'#475867\'" onmouseout="if(!'+active+'){this.style.borderColor=\'#E3EAF0\';this.style.color=\'#66788A\'}">'+f+'</span>'
  })
  h += '</div>'
  h += '<div class="mod-desc">共 '+filtered.length+' 条预约记录</div>'
  if (filtered.length === 0) {
    h += '<div style="text-align:center;padding:28px;color:#66788A;font-size:12px">暂无该状态的预约记录</div>'
  }
  filtered.forEach(r=>{
    const tagCls = statusMap[r.status] || 'dim'
    h+='<div style="background:#FFFFFF;border:1px solid #EBEFF4;border-radius:8px;padding:12px;margin-top:8px">'
    // Row 1: service name + status tag
    h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">'
    h+='<span style="color:#1F2D3D;font-weight:600;font-size:13px">'+r.serviceName+'</span>'
    h+='<span class="tag '+tagCls+'" style="font-size:11px;padding:4px 10px">'+r.status+'</span>'
    h+='</div>'
    // Row 2: date/time + window
    h+='<div style="font-size:11px;color:#66788A;line-height:1.6;margin-bottom:4px">'
    h+='<span>\u{1F4C5} '+r.date+' '+r.time+'</span>'
    h+='<span style="margin-left:12px">\u{1F3E2} '+r.window+'</span>'
    h+='</div>'
    // Row 3: appointment number (small, gray)
    h+='<div style="font-size:10px;color:#66788A;margin-bottom:8px">预约编号：'+r.apptNo+'</div>'
    // Row 4: action buttons
    h+='<div style="display:flex;gap:6px">'
    h+='<button class="btn btn-o btn-s" onclick="window._svc.showApptDetailById('+r.id+')">查看详情</button>'
    if (r.status === '已预约') {
      h+='<button class="btn btn-s" style="background:rgba(224,82,82,0.10);color:#E05252;border:1px solid rgba(224,82,82,0.18);font-family:inherit" onclick="window._svc.cancelApptFromProgress('+r.id+')">取消预约</button>'
    }
    if (r.status === '已完成') {
      h+='<button class="btn btn-p btn-s" onclick="window._svc.rateAppointment('+r.id+')">去评价</button>'
    }
    h+='</div>'
    h+='</div>'
  })
  opMod('\u{1F50D} 预约进度查询',h,'mod-md')
}
function setApptFilter(f) { _apptFilter = f; renderApptProgress() }
function rateAppointment(id) { toast('评价功能即将上线','info') }
function cancelApptFromProgress(id) {
  const idx = appointment.findIndex(a => a.id === id)
  if (idx === -1) return
  if (!confirm('确定取消此预约吗？')) return
  appointment[idx].status = '已取消'
  persistAppointments()
  toast('预约已取消','ok')
  renderApptProgress()
}
function downloadGuide(){
  let h='<div class="mod-desc">各事项办理指南，点击查看详情</div>'
  governmentServices.forEach(svc => {
    h+='<div style="background:#FFFFFF;border:1px solid #EBEFF4;border-radius:8px;padding:12px;margin-top:8px;cursor:pointer" onclick="window._svc.showServiceGuide(\''+svc.id+'\')" onmouseover="this.style.borderColor=\'rgba(14,165,233,0.25)\'" onmouseout="this.style.borderColor=\'#EBEFF4\'">'
    h+='<div style="display:flex;justify-content:space-between;align-items:flex-start">'
    h+='<div>'
    h+='<div style="color:#1F2D3D;font-weight:600;font-size:13px;margin-bottom:3px">📄 '+svc.name+'</div>'
    h+='<div style="color:#66788A;font-size:10px">'+svc.window+'</div>'
    h+='<div style="color:#66788A;font-size:10px;margin-top:2px">预计'+svc.duration+' · 可预约</div>'
    h+='</div>'
    h+='<span style="color:#0EA5E9;font-size:11px;flex-shrink:0;margin-top:2px">查看指南 ▶</span>'
    h+='</div></div>'
  })
  opMod('📜 办事指南',h,'mod-md')
}
function showServiceGuide(sid){
  const svc = getServiceById(sid)
  if(!svc) return
  let h='<div class="svc-result-card">'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">事项名称</span><span class="svc-rc-value" style="font-weight:600;color:#1F2D3D">'+svc.name+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">办理窗口</span><span class="svc-rc-value">'+svc.window+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">预计时长</span><span class="svc-rc-value">'+svc.duration+'</span></div>'
  h+='</div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="mod-section-title">📜 办理指南</div>'
  h+='<div style="font-size:12px;color:#475867;line-height:1.8;padding:8px 0">'+svc.guide+'</div>'
  if(svc.materials&&svc.materials.length>0){
    h+='<div class="mod-divider"></div>'
    h+='<div class="mod-section-title">📎 所需材料</div>'
    svc.materials.forEach(m=>{
      if(m.url){
        h+='<div onclick="window._svc.openResource(\''+m.url+'\')" style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:#FFFFFF;border-radius:6px;margin-bottom:4px;cursor:pointer;transition:background 0.2s" onmouseover="this.style.background=\'#E3EAF0\';this.style.borderColor=\'#D0D8E2\';this.style.border=\'1px solid #D0D8E2\'" onmouseout="this.style.background=\'#FFFFFF\';this.style.borderColor=\'transparent\';this.style.border=\'1px solid transparent\'">'
        h+='<span style="font-size:11px;color:#1F2D3D">📄 '+m.name+'</span>'
        h+='<span style="font-size:10px;color:#0EA5E9">'+m.fmt+'</span>'
      }else{
        h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:#FFFFFF;border-radius:6px;margin-bottom:4px">'
        h+='<span style="font-size:11px;color:#1F2D3D">📄 '+m.name+'</span>'
        h+='<span style="font-size:10px;color:#66788A">暂未上传</span>'
      }
      h+='</div>'
    })
  }
  h+='<div class="svc-form-actions" style="margin-top:12px">'
  h+='<button class="svc-btn svc-btn-primary" onclick="window._svc.clsMod();window._svc.bookStep1(\''+svc.id+'\')">📅 立即预约</button>'
  h+='</div>'
  opMod('📜 '+svc.name+' — 办事指南',h,'mod-md')
}

function downloadTemplate(){
  let h='<div class="mod-desc">按办事事项查看或下载所需材料</div>'
  governmentServices.forEach(svc => {
    h+='<div style="background:#FFFFFF;border:1px solid #EBEFF4;border-radius:8px;padding:12px;margin-top:8px">'
    h+='<div style="color:#1F2D3D;font-weight:600;font-size:12px;margin-bottom:6px">'+svc.name+'</div>'
    if(svc.materials&&svc.materials.length>0){
      svc.materials.forEach(m=>{
        h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 8px;background:#FFFFFF;border-radius:4px;margin-bottom:3px">'
        h+='<span style="font-size:11px;color:#1F2D3D;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">📄 '+m.name+'</span>'
        h+='<span style="font-size:10px;color:#66788A;margin:0 8px;flex-shrink:0">'+m.fmt+'</span>'
        if(m.url){
          if(m.fmt==='PDF'){
            h+='<span style="font-size:10px;color:#0EA5E9;cursor:pointer;flex-shrink:0;margin-right:10px" onclick="event.stopPropagation();window._svc.openResource(\''+m.url+'\')">预览</span>'
            h+='<span style="font-size:10px;color:#0EA5E9;cursor:pointer;flex-shrink:0" onclick="event.stopPropagation();window._svc.downloadFile(\''+m.url+'\',\''+m.name+'.pdf\')">\u{2B07} 下载</span>'
          }else{
            h+='<span style="font-size:10px;color:#0EA5E9;cursor:pointer;flex-shrink:0" onclick="event.stopPropagation();window._svc.downloadFile(\''+m.url+'\',\''+m.name+'.'+m.fmt.toLowerCase()+'\')">\u{2B07} 下载</span>'
          }
        }else{
          h+='<span style="font-size:10px;color:#66788A;flex-shrink:0">暂未上传</span>'
        }
        h+='</div>'
      })
    }
    h+='</div>'
  })
  opMod('📥 材料模板下载',h,'mod-lg')
}
function showMaterialDownload(){
  const items=[
    {type:"耕地地力保护补贴",files:[
      {name:"耕地地力保护补贴申请表（陕南版）",fmt:"DOCX"},
      {name:"耕地承包权确权证明模板",fmt:"DOCX"},
      {name:"陕西省耕地地力保护补贴申请指南",fmt:"PDF"}
    ]},
    {type:"农机购置补贴",files:[
      {name:"陕西省农机购置补贴申请表",fmt:"DOCX"},
      {name:"农机购置承诺书",fmt:"DOCX"},
      {name:"2024-2026年陕西省农机补贴一览表",fmt:"PDF"}
    ]},
    {type:"低保补助",files:[
      {name:"陕西省最低生活保障申请表",fmt:"DOCX"},
      {name:"家庭经济状况申报表",fmt:"DOCX"},
      {name:"陕西省低保申请须知",fmt:"PDF"}
    ]},
    {type:"创业补贴",files:[
      {name:"陕西省一次性创业补贴申请表",fmt:"DOCX"},
      {name:"创业计划书参考模板",fmt:"DOCX"},
      {name:"陕西省创业补贴申请指南",fmt:"PDF"}
    ]}
  ]
  let h="<div class=\"mod-desc\">按补贴项目下载申请材料模板（DOCX/PDF 格式）</div>"
  items.forEach(item=>{
    h+="<div class=\"svc-dl-group\"><div class=\"svc-dl-group-title\">"+item.type+"</div>"
    item.files.forEach(f=>{
      h+="<div class=\"svc-dl-item\"><div><span style=\"color:#1F2D3D;font-size:12px\">📄 "+f.name+"</span><span class=\"svc-dl-fmt\">"+f.fmt+"</span></div><button class=\"svc-btn svc-btn-secondary\" style=\"flex:none;width:auto;height:32px;padding:0 14px;font-size:11px\" onclick=\"window._svc.downloadMaterial(\""+f.name+"."+f.fmt.toLowerCase()+"\")\">⬇ 下载</button></div>"
    })
    h+="</div>"
  })
  opMod("📥 材料模板下载",h,"mod-lg")
}
function downloadMaterial(filename){
  toast("正在下载："+filename,"ok")
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
  else if(key==='appointment')initApptPieChart()
}
function initInsTrendChart(){
  const el=document.getElementById('chart_ins_trend');if(!el)return;chartInstance=echarts.init(el)
  chartInstance.setOption({title:{text:'近6个月医保报销趋势',textStyle:{color:'#1F2D3D',fontSize:13,fontWeight:600},left:0,top:0},tooltip:{trigger:'axis',backgroundColor:'#FFFFFF',borderColor:'#D0D8E2',textStyle:{color:'#1F2D3D',fontSize:11},formatter:function(p){return p[0].axisValue+'<br/>'+p[0].marker+' 报销金额：\u00a5'+p[0].value.toLocaleString()}},grid:{left:80,right:24,top:44,bottom:30},xAxis:{type:'category',boundaryGap:true,data:['1月','2月','3月','4月','5月','6月'],axisLabel:{color:'#66788A',fontSize:10},axisTick:{show:false},axisLine:{lineStyle:{color:'#E3EAF0'}}},yAxis:{type:'value',name:'金额（元）',nameTextStyle:{color:'#66788A',fontSize:10},nameGap:12,min:0,max:2000,interval:500,axisLabel:{color:'#66788A',fontSize:10,formatter:function(v){return '\u00a5'+v}},splitLine:{lineStyle:{color:'#EBEFF4'}}},series:[{name:'医保报销',type:'bar',data:[180,0,320,860,125,1250],barWidth:'40%',barMaxWidth:60,itemStyle:{borderRadius:[4,4,0,0],color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#0EA5E9'},{offset:1,color:'rgba(14,165,233,0.15)'}])}}]})
}
function initSubPieChart(){
  const el=document.getElementById('chart_sub_pie');if(!el)return;chartInstance=echarts.init(el)
  const total=subsidy.reduce((s,r)=>s+Number(r.amount),0)
  const data=[
    {value:subsidy.find(s=>s.type.includes('耕地'))?.amount||0,name:'耕地补贴',itemStyle:{color:'#0EA5E9'}},
    {value:subsidy.find(s=>s.type.includes('农机'))?.amount||0,name:'农机补贴',itemStyle:{color:'#22B573'}},
    {value:subsidy.find(s=>s.type.includes('低保'))?.amount||0,name:'低保补助',itemStyle:{color:'#F2A62B'}},
    {value:subsidy.find(s=>s.type.includes('创业'))?.amount||0,name:'创业补贴',itemStyle:{color:'#8B5CF6'}}
  ].filter(d=>d.value>0)
  chartInstance.setOption({
    tooltip:{trigger:'item',backgroundColor:'#FFFFFF',borderColor:'#D0D8E2',textStyle:{color:'#1F2D3D',fontSize:11},formatter:'{b}: \u00a5{c} ({d}%)'},
    series:[
      {type:'pie',radius:['60%','80%'],center:['50%','50%'],itemStyle:{borderColor:'#FFFFFF',borderWidth:2},label:{show:false},emphasis:{label:{show:true,fontSize:14,fontWeight:'bold'}},data:data},
      {type:'pie',radius:['0%','0%'],center:['50%','50%'],label:{show:true,position:'center',formatter:'累计获得\n\u00a5{c}',fontSize:12,color:'#1F2D3D',lineHeight:18,fontWeight:600},data:[{value:total,name:''}]}
    ]
  })
}

function initElderChart(){
  const el=document.getElementById('chart_elder_health');if(!el)return;chartInstance=echarts.init(el)
  const e=elderly.find(x=>x.id===selectedChartElderId.value)||elderly[0]
  const hrData=e.trend?e.trend.heartRate:[72,75,70,78,88,95,88]
  const slData=e.trend?e.trend.sleep:[6.5,6.2,5.8,5.5,4.2,5.1,5.0]
  chartInstance.setOption({tooltip:{trigger:'axis',backgroundColor:'#FFFFFF',borderColor:'#D0D8E2',textStyle:{color:'#1F2D3D',fontSize:11},formatter:function(p){var r=p[0].axisValue;for(var i=0;i<p.length;i++){r+=p[i].marker+' '+p[i].seriesName+'：'+p[i].value+' '+(p[i].seriesName==='心率'?'bpm':'h')}return r}},grid:{left:56,right:56,top:28,bottom:28},xAxis:{type:'category',data:['6/12','6/13','6/14','6/15','6/16','6/17','6/18'],axisLabel:{color:'#66788A',fontSize:10},axisTick:{show:false},axisLine:{lineStyle:{color:'#E3EAF0'}}},yAxis:[{type:'value',name:'心率 (bpm)',nameTextStyle:{color:'#E05252',fontSize:10},nameGap:16,min:60,max:100,interval:10,axisLabel:{color:'#E05252',fontSize:10},splitLine:{show:true,lineStyle:{color:'#EBEFF4'}}},{type:'value',name:'睡眠时长 (h)',nameTextStyle:{color:'#0EA5E9',fontSize:10},nameGap:16,min:0,max:8,interval:2,axisLabel:{color:'#0EA5E9',fontSize:10},splitLine:{show:false}}],series:[{name:'心率',type:'line',data:hrData,yAxisIndex:0,smooth:true,symbol:'circle',symbolSize:5,lineStyle:{color:'#E05252',width:1.5},itemStyle:{color:'#E05252'},z:2},{name:'睡眠时长',type:'bar',data:slData,yAxisIndex:1,barWidth:10,barGap:'40%',itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#D0D8E2'},{offset:1,color:'#EBEFF4'}]),borderRadius:[3,3,0,0],borderColor:'rgba(14,165,233,0.14)',borderWidth:1},z:1}]})
}
function initTelePieChart(){
  const el=document.getElementById('chart_tele_pie');if(!el)return;chartInstance=echarts.init(el)
  chartInstance.setOption({title:{text:'问诊科室分布',textStyle:{color:'#1F2D3D',fontSize:13,fontWeight:600},left:0,top:0},tooltip:{trigger:'item',backgroundColor:'#FFFFFF',borderColor:'#D0D8E2',textStyle:{color:'#1F2D3D',fontSize:11},formatter:'{b}: {c}次 ({d}%)'},series:[{type:'pie',radius:['55%','75%'],center:['50%','55%'],itemStyle:{borderColor:'#FFFFFF',borderWidth:2},label:{color:'#66788A',fontSize:10},data:[{value:2,name:'内科',itemStyle:{color:'#0EA5E9'}},{value:2,name:'骨科',itemStyle:{color:'#22B573'}},{value:1,name:'心内科',itemStyle:{color:'#E05252'}}]}]})
}

function initApptPieChart(){
  const el=document.getElementById('chart_appt_pie');if(!el)return;chartInstance=echarts.init(el)
  chartInstance.setOption({title:{text:'业务类型分布',textStyle:{color:'#66788A',fontSize:11,fontWeight:400},left:0,top:-6},tooltip:{trigger:'item',backgroundColor:'#FFFFFF',borderColor:'#D0D8E2',textStyle:{color:'#1F2D3D',fontSize:10}},series:[{type:'pie',radius:['50%','72%'],center:['50%','50%'],itemStyle:{borderColor:'#FFFFFF',borderWidth:2},label:{color:'#66788A',fontSize:9},data:[{value:1,name:'证件办理',itemStyle:{color:'#0EA5E9'}},{value:1,name:'补贴申请',itemStyle:{color:'#22B573'}},{value:1,name:'证明开具',itemStyle:{color:'#F2A62B'}}]}]})
}


// ===== FILE UPLOAD HELPERS =====
function formatSize(bytes){if(bytes<1024)return bytes+' B';if(bytes<1024*1024)return (bytes/1024).toFixed(1)+' KB';return (bytes/1024/1024).toFixed(1)+' MB'}
const uploadStore={}
const sharedFileInput = ref(null)
let _pendingUploadInputId = ''
let _pendingUploadStatusId = ''
function triggerUpload(inputId, statusId){
  _pendingUploadInputId = inputId
  _pendingUploadStatusId = statusId
  const el = sharedFileInput.value
  if (el) { el.value = ''; el.click() }
}
function onSharedFileSelected(e){
  const inputId = _pendingUploadInputId
  const statusId = _pendingUploadStatusId
  const status = document.getElementById(statusId)
  if (!status) return
  const file = e.target.files && e.target.files[0]
  if (!file) { status.innerHTML='<span class="svc-upload-pending">未上传</span>'; delete uploadStore[inputId]; return }
  const ext = '.' + file.name.split('.').pop().toLowerCase()
  if (!['.pdf','.jpg','.jpeg','.png'].includes(ext) && !['application/pdf','image/jpeg','image/png'].includes(file.type)) { toast('仅支持 PDF、JPG、JPEG、PNG 格式','err'); e.target.value=''; return }
  if (file.size > 10*1024*1024) { toast('文件大小不能超过 10MB','err'); e.target.value=''; return }
  uploadStore[inputId] = file
  status.innerHTML='<span class="svc-upload-ok">✓ '+file.name+'（'+formatSize(file.size)+'）</span>'
    +'<a href="javascript:void(0)" class="svc-upload-retry" onclick="window._svc.triggerUpload(\''+inputId+'\',\''+statusId+'\')">重新上传</a>'
    +'<a href="javascript:void(0)" class="svc-upload-del" onclick="window._svc.removeUploadFile(\''+inputId+'\',\''+statusId+'\')">删除</a>'
}
function removeUploadFile(inputId, statusId){
  delete uploadStore[inputId]
  const status = document.getElementById(statusId)
  if (status) status.innerHTML='<span class="svc-upload-pending">未上传</span>'
}
function hasUpload(inputId){ return !!uploadStore[inputId] }

// ===== DETAIL FUNCTIONS =====

function showSubsidyDetail(r){
  let h='<div class="svc-result-card">'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">申请编号</span><span class="svc-rc-value" style="font-family:monospace">'+r.appNo+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">补贴类型</span><span class="svc-rc-value">'+r.type+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">申请日期</span><span class="svc-rc-value">'+r.date+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">申请金额</span><span class="svc-rc-value" style="color:#22B573;font-weight:600">&yen;'+Number(r.amount).toLocaleString()+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">当前状态</span><span class="svc-rc-value">'+r.status+'</span></div>'
  h+='<div class="svc-rc-row"><span class="svc-rc-label">当前节点</span><span class="svc-rc-value" style="color:#0EA5E9">'+r.node+'</span></div>'
  h+='</div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="mod-section-title">\u{1F4CB} 审批进度</div>'
  h+='<div class="svc-node-chain" style="flex-wrap:wrap">'
  r.nodes.forEach((n,i)=>{
    const done=i<=r.currentNodeIdx
    const active=i===r.currentNodeIdx
    h+='<div class="svc-node-item '+(done?'done':'')+' '+(active?'active':'')+'">'
    h+='<div class="svc-node-dot">'+(done?'✓':(i+1))+'</div>'
    h+='<div class="svc-node-label">'+n+'</div>'
    if(i<r.nodes.length-1) h+='<div class="svc-node-line '+(i<r.currentNodeIdx?'done':'')+'"></div>'
    h+='</div>'
  })
  h+='</div>'
  opMod('\u{1F4CB} 申请详情 — '+r.type,h,'mod-md')
}
function withdrawSubsidy(r){
  if(confirm('确认撤回申请 '+r.appNo+'？')){const idx=subsidy.findIndex(s=>s.id===r.id);if(idx!==-1)subsidy.splice(idx,1);toast('申请已撤回','ok');clsMod()}
}
function supplementSubsidy(r){
  toast('材料补充功能已打开，请上传补充材料\n申请编号：'+r.appNo,'info')
}

// Watch tab changes
watch(curTab,async()=>{await nextTick();setTimeout(()=>{initCurrentChart();if(chartInstance)chartInstance.resize()},200)})

// Chart resize handler
function onResize(){if(chartInstance){chartInstance.resize()}}
let resizeTimer=null
function debouncedResize(){clearTimeout(resizeTimer);resizeTimer=setTimeout(onResize,150)}

// ===== HASH ROUTING =====
function handleHash(){
  const hash=window.location.hash.replace('#','')
  if(!hash)return
  const validTabs=tabs.map(t=>t.key)
  if(validTabs.indexOf(hash)>=0&&hash!==curTab.value){switchTab(hash)}
}

// ===== CROSS-MODULE NAVIGATION =====
function navigateToService(tab, action, businessId){
  curTab.value = tab || 'subsidy'
  if (action === 'applySubsidy' && businessId) {
    nextTick(() => {
      const match = availableSubsidies.find(function(s) {
        // Match by businessId or fuzzy name match
        if (businessId === 'water-saving-irrigation') return s.name.indexOf('节水灌溉') !== -1
        if (businessId === 'land-protection') return s.name.indexOf('耕地地力') !== -1
        if (businessId === 'machine-purchase') return s.name.indexOf('农机购置') !== -1
        return s.name.indexOf(businessId) !== -1
      })
      if (match) { applySubsidy(match) }
    })
  }
  // Scroll subsidy section into view
  nextTick(() => {
    const el = document.querySelector('.subsidy-cards')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  })
}
// ===== 节水灌溉设施补贴 =====
function showWaterSavingForm(){
  let h='<div class="mod-desc" style="display:flex;align-items:center;gap:6px"><span style="font-size:16px">👤</span><span style="color:#66788A;font-size:11px">本人信息 — 以下字段从当前登录账户自动带出</span></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>姓名</label><input class="svc-self-field" value="王友德" readonly></div><div class="svc-fld"><label>身份证号</label><input class="svc-self-field" value="342***15**07" readonly></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>户籍所在地</label><input class="svc-self-field" value="中堰村" readonly></div><div class="svc-fld"><label>联系电话</label><input class="svc-self-field" value="138****5432" readonly></div></div>'
  h+='<div class="mod-divider"></div><div class="mod-section-title">💧 灌溉设施信息</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>灌溉面积（亩）<span style="color:#E05252">*</span></label><input type="number" id="irrigationArea" placeholder="请输入拟建设节水灌溉的耕地面积" oninput="window._svc.calcIrrigationAmount()" min="1" step="0.1"></div><div class="svc-fld"><label>设施类型<span style="color:#E05252">*</span></label><select id="irrigationType" style="width:100%;background:#FFFFFF;border:1px solid #D0D8E2;border-radius:6px;color:#1F2D3D;padding:10px 12px;font-size:12px;font-family:inherit"><option value="">请选择</option><option value="drip">滴灌系统</option><option value="sprinkler">喷灌系统</option><option value="micro">微喷灌系统</option></select></div></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>地块位置<span style="color:#E05252">*</span></label><input type="text" id="irrigationLocation" placeholder="如：中堰村东片区"></div></div>'
  h+='<div class="mod-divider"></div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><label>预估补贴金额（≤800元/亩）</label><div id="irrigationAmountDisplay" style="background:#EBEFF4;border:1px solid rgba(14,165,233,0.15);border-radius:6px;padding:10px 12px;font-size:18px;color:#22B573;font-weight:700;text-align:center">¥0.00</div></div><div style="font-size:10px;color:#F2A62B;margin-top:4px">⚠ 每户最高补贴5亩，实际标准以县级农业农村部门核定为准</div></div>'
  h+='<div class="mod-divider"></div><div class="mod-section-title">📎 材料上传</div>'
  h+='<div class="svc-form-row"><div class="svc-fld"><div class="svc-upload-block"><button type="button" class="svc-upload-btn" onclick="window._svc.triggerUpload(\'irrigationProofInput\',\'irrigationProofStatus\')">📄 上传土地承包合同</button><div class="svc-upload-status" id="irrigationProofStatus">未上传</div></div></div></div>'
  h+='<div class="svc-form-row" style="margin-top:16px"><button class="svc-btn svc-btn-secondary" onclick="window._svc.clsMod()" style="flex:none;width:auto">取消</button><button class="svc-btn svc-btn-primary" onclick="window._svc.submitIrrigationSubsidy()" style="flex:none;width:auto">✓ 提交申请</button></div>'
  opMod('💧 节水灌溉设施补贴申请',h,'mod-md')
}
function calcIrrigationAmount(){
  const area=parseFloat(document.getElementById('irrigationArea')?.value)||0
  const display=document.getElementById('irrigationAmountDisplay')
  const capped=Math.min(area,5)
  if(display)display.textContent='¥'+Math.round(capped*800).toLocaleString()+'（参考，以核定为准）'
}
function submitIrrigationSubsidy(){
  const area=parseFloat(document.getElementById('irrigationArea')?.value)||0
  const type=document.getElementById('irrigationType')?.value||''
  const loc=document.getElementById('irrigationLocation')?.value||''
  if(!area||area<1){toast('请输入有效的灌溉面积','warn');return}
  if(!type){toast('请选择设施类型','warn');return}
  if(!loc){toast('请填写地块位置','warn');return}
  subsidy.unshift({id:Date.now(),appNo:'SB'+new Date().toISOString().slice(0,10).replace(/-/g,'')+String(Math.floor(Math.random()*900+100)),name:'王友德',type:'节水灌溉设施补贴',amount:Math.round(Math.min(area,5)*800),status:'已提交',date:new Date().toISOString().slice(0,10),node:'已提交',nodes:['已提交','村级初审','乡镇审核','部门复核','待发放','已发放'],currentNodeIdx:0})
  persistData('subsidy')
  clsMod()
  toast('节水灌溉补贴申请已提交','success')
}

// ===== EXPOSE HANDLERS =====
defineExpose({ navigateToService })
onMounted(()=>{
  window._svc={clsMod,queryBalance,submitReimburse,confirmReg,confirmTelemed,enterRoom,doConfirmAppt,cancelAppointment,cancelApptFromProgress,rateAppointment,setApptFilter,bookStep1,bookStep2,bookStep3,bookBack,showServiceGuide,showApptDetailById,submitRemote,triggerInvoiceUpload,triggerDiagnosisUpload,filterPayments,showTelemedForm,showTelemedDetailById,renderMedicalRecords,showLandSubsidyForm,showMachineSubsidyForm,showWaterSavingForm,showDibaoForm,showBizSubsidyForm,calcLandAmount,calcMachineAmount,calcDibaoIncome,calcIrrigationAmount,submitLandSubsidy,submitMachineSubsidy,submitDibao,submitBizSubsidy,submitIrrigationSubsidy,showSubsidyApply,showSubsidyProgress,showPolicyQuery,showMaterialDownload,downloadMaterial,downloadPolicyFile,showSvcPolicyDetail:showPolicyDetail,showSubsidyDetail,withdrawSubsidy,supplementSubsidy,triggerUpload,removeUploadFile,hasUpload,confirmEmergencyCall,sendHealthReport,elderPickerSelect,saveAlertSettingsFor,applyFromList:(name)=>{clsMod();if(name==='耕地地力保护补贴')showLandSubsidyForm();else if(name==='农机购置补贴')showMachineSubsidyForm();else if(name==='节水灌溉设施补贴')showWaterSavingForm();else if(name==='低保补助')showDibaoForm();else if(name==='创业补贴')showBizSubsidyForm()},confirmEnroll:(courseId)=>{confirmEnroll(courseId)},cancelEnrollFromDetail:(courseId)=>{cancelEnrollFromDetail(courseId)},openResource:(url)=>{openResource(url)},downloadFile:(url,name)=>{downloadFile(url,name)},showReplayForById:(id)=>{const c=myTrainingList.value.find(x=>x.id===id);if(c){clsMod();showReplayFor(c)}},closeLiveCard:()=>{closeLiveCard()}}
  // ServicePage 是 DashboardPage 的内嵌子组件（v-show 常驻挂载），子组件 mounted 先于父组件执行；
  // 父组件随后用 `window._svc = {...}` 整体覆盖，会把本页的 triggerUpload / triggerInvoiceUpload 等句柄冲掉，
  // 导致服务页内联 onclick 点击无响应。这里在父组件覆盖之后（下一个宏任务）把本页句柄合并回去，避免互相覆盖。
  const _svcHandlers=window._svc
  setTimeout(()=>{window._svc=Object.assign({},window._svc,_svcHandlers)},0)
  window.addEventListener('hashchange',handleHash);setTimeout(handleHash,100);nextTick(()=>setTimeout(()=>{initCurrentChart();if(chartInstance)chartInstance.resize()},300))
  window.addEventListener('resize',debouncedResize)
})
onUnmounted(()=>{disposeChart();delete window._svc;window.removeEventListener('hashchange',handleHash);window.removeEventListener('resize',debouncedResize)})
</script>

<style scoped>
.svc-page { min-height:100vh; background:#F5F7FA; color:#475867; display:flex; flex-direction:column; }

/* Header */
.hdr { height:48px; display:flex; align-items:center; justify-content:space-between; padding:0 16px; background:linear-gradient(180deg,#FFFFFF,#FFFFFF); border-bottom:1px solid rgba(0,0,0,0.06); flex-shrink:0; }
.hdr-l { font-size:14px; font-weight:700; color:#1F2D3D; letter-spacing:1px; display:flex; align-items:center; gap:10px; }
.hdr-l a,.hdr-r a { color:#66788A; text-decoration:none; }
.hdr-r { display:flex; align-items:center; gap:14px; font-size:10px; color:#66788A; }

/* Tab bar */
.tab-bar { display:flex; gap:0; padding:0 12px; background:#FFFFFF; border-bottom:1px solid rgba(0,0,0,0.12); overflow-x:auto; flex-shrink:0; }
.tab-btn { background:none; border:none; border-bottom:2px solid transparent; color:#66788A; font-size:13px; padding:12px 18px; cursor:pointer; white-space:nowrap; transition:all 0.2s; font-family:inherit; }
.tab-btn:hover { color:#475867; }
.tab-btn.on { color:#22B573; border-bottom-color:#22B573; }

/* Main content */
.main-content { flex:1; overflow-y:auto; padding:24px 28px 32px; }
.content { width:100%; }

/* Page Title */
.page-title-bar { margin-bottom:18px; }
.page-title { font-size:20px; font-weight:700; color:#1F2D3D; letter-spacing:0.5px; }
.page-subtitle { font-size:13px; color:#66788A; margin-top:4px; }

/* KPI */
.kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; }
.kpi-card { background:#FFFFFF; border:1px solid #EBEFF4; border-radius:12px; padding:18px 20px; display:flex; flex-direction:column; gap:8px; }
.kpi-icon { font-size:28px; line-height:1; }
.kpi-val { font-size:26px; font-weight:700; color:#1F2D3D; line-height:1.1; }
.kpi-lbl { font-size:12px; color:#66788A; }
.kpi-card.g .kpi-val { color:#22B573; }
.kpi-card.b .kpi-val { color:#0EA5E9; }
.kpi-card.y .kpi-val { color:#F2A62B; }
.kpi-card.r .kpi-val { color:#E05252; }
.kpi-card.p .kpi-val { color:#8B5CF6; }

/* Quick Actions */
.qa-label { font-size:13px; font-weight:600; color:#66788A; margin-bottom:10px; }
.qa-row { display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap; }
.qa-btn { background:#EBEFF4; border:1px solid rgba(34,181,115,0.14); color:#22B573; padding:10px 18px; border-radius:8px; font-size:13px; cursor:pointer; white-space:nowrap; transition:all 0.2s; font-family:inherit; }
.qa-btn:hover { background:rgba(34,181,115,0.16); border-color:rgba(34,181,115,0.30); }

/* Section card */
.section-card { background:#FFFFFF; border:1px solid #EBEFF4; border-radius:12px; padding:18px 20px; margin-bottom:14px; }

/* Section title */
.section-title { font-size:14px; font-weight:700; color:#475867; margin-bottom:12px; }

/* Data table */
.data-table { width:100%; border-collapse:collapse; font-size:13px; }
.data-table th { background:#FFFFFF; color:#66788A; font-size:11px; font-weight:600; padding:10px 12px; text-align:left; border-bottom:2px solid rgba(34,181,115,0.08); }
.data-table td { padding:10px 12px; border-bottom:1px solid #EBEFF4; color:#475867; }
.data-table tr:hover td { background:rgba(34,181,115,0.04); }

/* Tags */
.tag { font-size:11px; padding:2px 8px; border-radius:10px; font-weight:600; }
.tag.g { background:#E3EAF0; color:#22B573; }
.tag.b { background:#E3EAF0; color:#0EA5E9; }
.tag.y { background:rgba(242,166,43,0.12); color:#F2A62B; }
.tag.r { background:rgba(224,82,82,0.12); color:#E05252; }
.tag.dim { background:#E3EAF0; color:#66788A; }

/* Progress bar */
.progress-bar { height:6px; background:#EBEFF4; border-radius:3px; overflow:hidden; }
.progress-bar .fill { height:100%; border-radius:3px; transition:width 0.4s; }
.progress-bar .fill.g { background:linear-gradient(90deg,#22B573,#22B573); }
.progress-bar .fill.y { background:linear-gradient(90deg,#F2A62B,#F2A62B); }
.progress-bar .fill.b { background:linear-gradient(90deg,#0EA5E9,#0EA5E9); }

/* Buttons */
.btn { border:none; border-radius:8px; padding:8px 18px; font-size:12px; cursor:pointer; font-family:inherit; transition:all 0.2s; }
.btn-p { background:rgba(34,181,115,0.15); color:#22B573; }
.btn-p:hover { background:rgba(34,181,115,0.25); }
.btn-g { background:#22B573; color:#fff; }
.btn-g:hover { background:#22B573; }
.btn-d { background:rgba(224,82,82,0.12); color:#E05252; }
.btn-d:hover { background:rgba(224,82,82,0.22); }
.btn-o { background:#E3EAF0; color:#66788A; }
.btn-o:hover { background:#D0D8E2; }
.btn-s { padding:5px 10px; font-size:10px; border-radius:6px; }

/* Form fields */
.fld { margin-bottom:8px; }
.fld label { display:block; font-size:10px; color:#66788A; margin-bottom:4px; }
.fld input,.fld select { width:100%; background:#F8FAFB; border:1px solid #E3EAF0; border-radius:6px; padding:7px 10px; color:#1F2D3D; font-size:12px; font-family:inherit; box-sizing:border-box; }
.fld input:focus,.fld select:focus { outline:none; border-color:rgba(34,181,115,0.40); }

/* Modal */
.mod-over { position:fixed; inset:0; background:rgba(0,0,0,0.72); display:flex; align-items:center; justify-content:center; z-index:999; }
.mod-box { background:#FFFFFF; border:1px solid rgba(34,181,115,0.15); border-radius:14px; width:min(520px,90vw); max-height:75vh; overflow-y:auto; padding:20px; box-shadow:0 8px 32px rgba(0,0,0,0.55); }
.mod-hd { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; font-size:13px; font-weight:700; color:#1F2D3D; }
.mod-x { background:none; border:none; color:#66788A; font-size:20px; cursor:pointer; }

/* Toast */
.toast-bar { position:fixed; top:56px; right:16px; z-index:9999; display:flex; flex-direction:column; gap:6px; }
.toast { font-size:12px; padding:9px 18px; border-radius:8px; color:#1F2D3D; background:#FFFFFF; border:1px solid rgba(34,181,115,0.20); box-shadow:0 4px 16px rgba(0,0,0,0.30); min-width:160px; animation:toastIn 0.25s; }
.toast.ok { border-left:3px solid #22B573; }
.toast.info { border-left:3px solid #0EA5E9; }
.toast.warn { border-left:3px solid #F2A62B; }
@keyframes toastIn { from{opacity:0;transform:translateX(30px);} to{opacity:1;transform:translateX(0);} }

/* Timeline */
.tl-item { display:flex; gap:10px; padding:6px 0; }
.tl-dot { width:8px; height:8px; border-radius:50%; background:#0EA5E9; margin-top:4px; flex-shrink:0; }
.tl-dot.g { background:#22B573; }
.tlt { font-size:11px; color:#1F2D3D; }
.tld { font-size:10px; color:#66788A; margin-top:2px; }

/* Insurance cards */
.insure-cards { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
.insure-card { background:#FFFFFF; border:1px solid #EBEFF4; border-radius:12px; padding:16px 20px; display:flex; justify-content:space-between; align-items:center; }
.ic-type { font-size:15px; font-weight:700; color:#1F2D3D; }
.ic-status { font-size:11px; margin-top:4px; }
.ic-status.g { color:#22B573; }
.ic-status.y { color:#F2A62B; }
.ic-year { font-size:11px; color:#66788A; margin-top:4px; }
.ic-extra { font-size:14px; color:#22B573; font-weight:600; }

/* Subsidy cards */
.subsidy-cards { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
.subsidy-card { background:#FFFFFF; border:1px solid #EBEFF4; border-radius:12px; padding:14px 16px; display:flex; align-items:center; gap:12px; cursor:pointer; transition:all 0.2s; }
.subsidy-card:hover { background:#EBEFF4; border-color:#D0D8E2; }
.sc-icon { font-size:30px; }
.sc-info { flex:1; }
.sc-name { font-size:13px; font-weight:600; color:#1F2D3D; }
.sc-desc { font-size:11px; color:#66788A; margin-top:2px; }
.sc-amount { font-size:14px; font-weight:700; color:#22B573; }

/* Elderly cards */
.elder-cards { display:flex; flex-direction:column; gap:10px; }
.elder-card { background:#FFFFFF; border:1px solid #EBEFF4; border-radius:12px; padding:16px 18px; display:flex; align-items:center; gap:16px; }
.ec-avatar { font-size:40px; }
.ec-info { flex:1; }
.ec-name { font-size:14px; font-weight:600; color:#1F2D3D; display:flex;align-items:center;gap:6px;flex-wrap:wrap; }
.ec-relation { font-size:10px;font-weight:500;color:#0EA5E9;background:#EBEFF4;border:1px solid rgba(14,165,233,0.15);padding:1px 7px;border-radius:10px;white-space:nowrap; }
.ec-addr { font-size:11px; color:#66788A; margin-top:2px; }
.ec-meta { margin-top:4px; }
.ec-health { display:flex; gap:16px; }
.ech-item { text-align:center; }
.ech-val { font-size:18px; font-weight:700; }
.ech-lbl { font-size:10px; color:#66788A; }
.ec-actions { display:flex; flex-direction:column; gap:4px; }

/* Course cards (training tab) */
.course-cards { display:flex; flex-direction:column; gap:10px; }
.course-card { background:#FFFFFF; border:1px solid #EBEFF4; border-radius:12px; padding:14px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
.cc-left { flex:1; min-width:0; }
.cc-header { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
.cc-title { font-size:14px; font-weight:600; color:#1F2D3D; }
.cc-body { display:flex; flex-direction:column; gap:3px; }
.cc-meta-row { display:flex; align-items:center; gap:8px; font-size:11px; flex-wrap:wrap; }
.cc-meta-label { color:#66788A; white-space:nowrap; }
.cc-meta-val { color:#475867; white-space:nowrap; }
.cc-meta-row .cc-meta-label + .cc-meta-val { margin-right:14px; }
.cc-right { display:flex; flex-direction:column; align-items:center; flex-shrink:0; min-width:80px; }

/* Training reminder card */
/* Live-stream floating card */
.live-float-card { position:fixed; top:56px; right:16px; width:340px; max-width:calc(100vw - 32px); background:linear-gradient(180deg,#FFFFFF,#F5F7FA); border:1px solid rgba(14,165,233,0.15); border-radius:12px; padding:16px 18px; z-index:999; box-shadow:0 8px 32px rgba(0,0,0,0.45); font-size:12px; }
.lfc-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.lfc-header span { font-size:14px; font-weight:600; color:#1F2D3D; }
.lfc-close { background:none; border:none; color:#66788A; font-size:18px; cursor:pointer; padding:0; line-height:1; }
.lfc-close:hover { color:#1F2D3D; }
.lfc-course-name { font-size:14px; font-weight:600; color:#1F2D3D; margin-bottom:8px; line-height:1.4; }
.lfc-meta { font-size:11px; color:#66788A; line-height:1.8; margin-bottom:10px; }
.lfc-meta div { margin-bottom:2px; }
.lfc-status-live { font-size:12px; color:#22B573; font-weight:600; margin-bottom:14px; }
.lfc-no-live { font-size:12px; color:#475867; margin-bottom:4px; }
.lfc-divider { height:1px; background:#EBEFF4; margin:12px 0; }
.lfc-next-label { font-size:11px; color:#66788A; margin-bottom:6px; }
.lfc-btn { display:block; width:100%; padding:10px 0; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; text-align:center; font-family:inherit; }
.lfc-btn-primary { background:#22B573; color:#fff; }
.lfc-btn-primary:hover { background:#22B573; }
.lfc-btn-outline { background:transparent; color:#0EA5E9; border:1px solid #D0D8E2; }
.lfc-btn-outline:hover { background:#EBEFF4; }

.training-reminder { }
.tr-card { background:#EBEFF4; border:1px solid #E3EAF0; border-radius:10px; padding:14px 16px; display:flex; align-items:center; justify-content:space-between; gap:14px; }
.tr-info { flex:1; min-width:0; }
.tr-course-name { font-size:14px; font-weight:600; color:#1F2D3D; margin-bottom:6px; }
.tr-meta { display:flex; gap:16px; font-size:11px; color:#66788A; flex-wrap:wrap; margin-bottom:6px; }
.tr-hint { font-size:11px; color:#F2A62B; }
.tr-action { flex-shrink:0; }

/* Appointment layout */
.apt-layout { display:grid; grid-template-columns:280px 1fr; gap:20px; }
.apt-cal { background:#FFFFFF; border:1px solid #EBEFF4; border-radius:12px; padding:14px; }
.cal-header { display:flex; align-items:center; justify-content:center; margin-bottom:8px; }
.cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
.cal-day-hd { font-size:10px; color:#66788A; text-align:center; padding:4px 0; font-weight:600; }
.cal-day { font-size:12px; color:#475867; text-align:center; padding:5px 2px; border-radius:6px; cursor:pointer; position:relative; }
.cal-day.dim { color:#66788A; cursor:default; }
.cal-day:hover:not(.dim) { background:rgba(34,181,115,0.08); }
.cal-day.selected { background:rgba(34,181,115,0.18); color:#22B573; font-weight:700; }
.lunar { font-size:8px; display:block; color:#66788A; }
.cal-dot { width:4px; height:4px; background:#22B573; border-radius:50%; display:block; margin:1px auto 0; }
.apt-item { background:#F8FAFB; border-radius:8px; padding:10px 12px; margin-bottom:6px; transition:background 0.2s; }
.apt-item:hover { background:rgba(34,181,115,0.05); }
.apt-item-hd { display:flex; justify-content:space-between; align-items:center; }
.apt-item-meta { font-size:11px; color:#66788A; margin-top:4px; }

/* Service catalog cards */
.svc-service-card { background:#FFFFFF; border:1px solid #EBEFF4; border-radius:10px; padding:12px 14px; transition:all 0.2s; }
.svc-service-card:hover { border-color:#D0D8E2; background:#F8FAFB; }
.svc-sc-name { font-size:13px; font-weight:600; color:#1F2D3D; margin-bottom:4px; }
.svc-sc-meta { font-size:10px; color:#66788A; }

/* Chart */
.chart-block { background:#FFFFFF; border:1px solid #EBEFF4; border-radius:12px; padding:18px 20px; margin-bottom:14px; }
</style>

<!-- ── Service Center Modal Styles (unscoped, namespaced → works on v-html) ── -->
<style>
.svc-modal { font-family:inherit; }
.svc-modal .mod-desc { font-size:12px; color:#66788A; margin-bottom:18px; line-height:1.5; }
.svc-modal .mod-divider { height:1px; background:#EBEFF4; margin:16px 0; }
.svc-modal .mod-section-title { font-size:12px; font-weight:600; color:#22B573; margin-bottom:12px; }

/* Field */
.svc-modal .svc-fld { margin-bottom:14px; }
.svc-modal .svc-fld > label { display:block; font-size:12px; color:#66788A; margin-bottom:6px; font-weight:500; }
.svc-modal .svc-fld input,
.svc-modal .svc-fld select,
.svc-modal .svc-fld textarea {
  width:100%; height:44px;
  background:#FFFFFF; border:1px solid #E3EAF0;
  border-radius:8px; padding:0 12px; color:#1F2D3D; font-size:13px;
  font-family:inherit; box-sizing:border-box; outline:none; transition:border-color 0.2s;
  letter-spacing:0.3px;
}
.svc-modal .svc-fld textarea { height:72px; padding:10px 12px; resize:vertical; }
.svc-modal .svc-fld input::placeholder,
.svc-modal .svc-fld textarea::placeholder { color:#66788A; }
.svc-modal .svc-fld input:focus,
.svc-modal .svc-fld select:focus,
.svc-modal .svc-fld textarea:focus { border-color:rgba(34,181,115,0.50); box-shadow:0 0 0 2px rgba(34,181,115,0.08); }
.svc-modal .svc-fld input[readonly] { color:#66788A; letter-spacing:1px; }
/* Self-info badge — indicates fields are auto-loaded from current account */
.svc-modal .svc-self-badge {
  background:#EBEFF4; border:1px solid rgba(14,165,233,0.15);
  border-radius:8px; padding:10px 14px; margin-bottom:16px;
  color:#0EA5E9; font-size:12px; font-weight:500; text-align:center;
}
/* Self-info readonly fields — clearly auto-filled, not disabled */
.svc-modal .svc-fld input.svc-self-field {
  color:#475867; background:#EBEFF4;
  border-color:#E3EAF0; letter-spacing:1px; cursor:default;
}
/* Date input wrapper — text input for display, hidden date input for native picker */
.svc-modal .svc-date-wrap { position:relative; cursor:pointer; }
/* Visible text input — displays placeholder or selected date */
.svc-modal .svc-date-wrap input[type="text"] {
  width:100%; cursor:pointer; color:#1F2D3D;
  background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236F91A8' stroke-width='1.8'%3e%3crect x='3' y='4' width='18' height='18' rx='2'/%3e%3cline x1='16' y1='2' x2='16' y2='6'/%3e%3cline x1='8' y1='2' x2='8' y2='6'/%3e%3cline x1='3' y1='10' x2='21' y2='10'/%3e%3c/svg%3e");
  background-repeat:no-repeat; background-position:right 12px center; background-size:15px;
  padding-right:36px;
}
.svc-modal .svc-date-wrap input[type="text"]::placeholder { color:#66788A; }
/* Hidden real date input — provides native picker via showPicker(), stays invisible */
.svc-modal .svc-date-wrap input[type="date"] {
  position:absolute !important; top:0; left:0; width:100% !important; height:100% !important;
  opacity:0; pointer-events:none; z-index:0; color-scheme:dark;
  border:none !important; background:none !important; padding:0 !important; margin:0 !important;
}
.svc-modal .svc-fld select {
  appearance:none; -webkit-appearance:none;
  background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236F91A8' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
  background-repeat:no-repeat; background-position:right 12px center; background-size:12px; padding-right:36px;
  cursor:pointer;
}
.svc-modal .svc-fld select option { background:#FFFFFF; color:#1F2D3D; }

/* Form row (2-col) */
.svc-modal .svc-form-row { display:flex; gap:14px; }
.svc-modal .svc-form-row > .svc-fld { flex:1; }
@media (max-width:520px) { .svc-modal .svc-form-row { flex-direction:column; gap:0; } }

/* Form actions */
.svc-modal .svc-form-actions { display:flex; gap:12px; margin-top:20px; }

/* Buttons */
.svc-modal .svc-btn { border:none; border-radius:8px; height:42px; padding:0 24px; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit; transition:all 0.2s; white-space:nowrap; }
.svc-modal .svc-btn-primary { background:linear-gradient(135deg,#22B573,#1BA366); color:#fff; flex:1; }
.svc-modal .svc-btn-primary:hover { background:linear-gradient(135deg,#22B573,#22B573); box-shadow:0 2px 12px rgba(34,181,115,0.25); }
.svc-modal .svc-btn-danger { padding:8px 18px; border-radius:6px; border:1px solid rgba(224,82,82,0.30); background:rgba(224,82,82,0.10); color:#E05252; cursor:pointer; font-size:12px; font-family:inherit; transition:all 0.2s; } .svc-btn-danger:hover { background:rgba(224,82,82,0.20); border-color:rgba(224,82,82,0.45); }
.svc-btn-secondary { background:#FFFFFF; border:1px solid #D0D8E2; color:#66788A; flex:1; }
.svc-modal .svc-btn-secondary:hover { background:#EBEFF4; border-color:rgba(14,165,233,0.40); color:#475867; }

/* Upload */
.svc-modal .svc-upload-row { display:flex; gap:10px; flex-wrap:wrap; }
.svc-modal .svc-upload-btn { background:#EBEFF4; border:1px dashed #E3EAF0; color:#0EA5E9; padding:10px 18px; border-radius:8px; font-size:12px; cursor:pointer; font-family:inherit; transition:all 0.2s; }
.svc-modal .svc-upload-btn:hover { background:#E3EAF0; border-color:#D0D8E2; }
.svc-modal .svc-uploaded-file { display:inline-flex; align-items:center; gap:6px; font-size:12px; color:#475867; padding:8px 14px; background:#EBEFF4; border:1px solid #E3EAF0; border-radius:8px; }

/* Upload block (subsidy forms) */
.svc-modal .svc-upload-block { display:flex;flex-direction:column;gap:8px; }
.svc-modal .svc-upload-status { font-size:11px;min-height:18px; }
.svc-modal .svc-upload-pending { color:#66788A; }
.svc-modal .svc-upload-ok { color:#22B573; }
.svc-modal .svc-upload-retry { color:#0EA5E9;font-size:10px;margin-left:4px;text-decoration:none; }
.svc-modal .svc-upload-retry:hover { text-decoration:underline; }
.svc-modal .svc-upload-del { color:#E05252;font-size:10px;margin-left:2px;text-decoration:none; }
.svc-modal .svc-upload-del:hover { text-decoration:underline; }

/* Result card */
.svc-modal .svc-result-card { background:#EBEFF4; border:1px solid #E3EAF0; border-radius:10px; padding:14px 16px; margin-top:14px; }
.svc-modal .svc-result-card .svc-rc-row { display:flex; justify-content:space-between; align-items:center; padding:7px 0; font-size:13px; border-bottom:1px solid #EBEFF4; }
.svc-modal .svc-result-card .svc-rc-row:last-child { border-bottom:none; }
.svc-modal .svc-result-card .svc-rc-label { color:#66788A; }
.svc-modal .svc-result-card .svc-rc-value { color:#1F2D3D; font-weight:500; }

/* Inline result toggle */
.svc-modal .svc-inline-result { display:none; margin-top:14px; }
.svc-modal .svc-inline-result.show { display:block; }

/* Payment table */
.svc-modal .svc-pay-table { width:100%; border-collapse:collapse; font-size:13px; margin-top:2px; }
.svc-modal .svc-pay-table th { background:#FFFFFF; color:#66788A; font-size:11px; font-weight:600; padding:12px 14px; text-align:left; border-bottom:2px solid rgba(34,181,115,0.08); }
.svc-modal .svc-pay-table td { padding:12px 14px; border-bottom:1px solid #EBEFF4; color:#475867; }
.svc-modal .svc-pay-table tbody tr:hover td { background:rgba(34,181,115,0.03); }
.svc-modal .svc-pay-table .svc-pay-amount { color:#22B573; font-weight:600; font-family:monospace; }
.svc-modal .svc-pay-footer { text-align:center; margin-top:14px; font-size:11px; color:#66788A; }

/* Tags inside modal */
.svc-modal .svc-tag { display:inline-block; font-size:11px; padding:3px 10px; border-radius:10px; font-weight:600; }
.svc-modal .svc-tag.green { background:#E3EAF0; color:#22B573; }
.svc-modal .svc-tag.blue { background:#E3EAF0; color:#0EA5E9; }
.svc-modal .svc-tag.yellow { background:rgba(242,166,43,0.12); color:#F2A62B; }
.svc-modal .svc-tag.red { background:rgba(224,82,82,0.12); color:#E05252; }

/* Width variants */
.svc-modal.mod-sm { width:min(560px,92vw); }
.svc-modal.mod-md { width:min(680px,92vw); }
.svc-modal.mod-lg { width:min(720px,92vw); }

/* ===== Subsidy application list items ===== */
.svc-modal .svc-sub-list-item { display:flex;align-items:center;background:#FFFFFF;border:1px solid #E3EAF0;border-radius:8px;padding:12px 14px;margin-bottom:8px;cursor:pointer;transition:all 0.2s; }
.svc-modal .svc-sub-list-item:hover { background:#EBEFF4;border-color:#D0D8E2; }
.svc-modal .svc-sub-list-icon { font-size:24px;margin-right:12px;flex-shrink:0; }
.svc-modal .svc-sub-list-info { flex:1; }
.svc-modal .svc-sub-list-name { color:#1F2D3D;font-weight:600;font-size:13px; }
.svc-modal .svc-sub-list-desc { color:#66788A;font-size:11px;margin-top:2px; }
.svc-modal .svc-sub-list-amount { color:#22B573;font-weight:600;font-size:13px;margin-right:4px; }

/* Progress cards */
.svc-modal .svc-progress-card { background:#FFFFFF;border:1px solid #E3EAF0;border-radius:10px;padding:14px 16px;margin-bottom:12px; }
.svc-modal .svc-progress-header { display:flex;justify-content:space-between;align-items:center;margin-bottom:6px; }
.svc-modal .svc-progress-meta { font-size:11px;color:#66788A;margin-bottom:12px; }

/* Node chain */
.svc-modal .svc-node-chain { display:flex;align-items:flex-start;gap:0;overflow-x:auto;padding:4px 0; }
.svc-modal .svc-node-item { display:flex;flex-direction:column;align-items:center;position:relative;flex-shrink:0;min-width:48px; }
.svc-modal .svc-node-dot { width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;background:#FFFFFF;border:2px solid #D0D8E2;color:#66788A;transition:all 0.3s; }
.svc-modal .svc-node-item.done .svc-node-dot { background:#22B573;border-color:#22B573;color:#fff; }
.svc-modal .svc-node-item.active .svc-node-dot { background:#0EA5E9;border-color:#0EA5E9;color:#fff;box-shadow:0 0 8px rgba(14,165,233,0.40); }
.svc-modal .svc-node-label { font-size:9px;color:#66788A;margin-top:4px;text-align:center;white-space:nowrap;max-width:56px;overflow:hidden;text-overflow:ellipsis; }
.svc-modal .svc-node-item.done .svc-node-label,
.svc-modal .svc-node-item.active .svc-node-label { color:#1F2D3D; }
.svc-modal .svc-node-line { width:28px;height:2px;background:#D0D8E2;margin:0 -2px;position:absolute;top:11px;left:calc(50% + 11px); }
.svc-modal .svc-node-line.done { background:#22B573; }

/* Policy items */
.svc-modal .svc-policy-item { background:#FFFFFF;border:1px solid #E3EAF0;border-radius:8px;padding:10px 14px;margin-bottom:8px;cursor:pointer;transition:all 0.2s; }
.svc-modal .svc-policy-item:hover { background:#EBEFF4;border-color:#D0D8E2; }
.svc-modal .svc-policy-item-header { display:flex;justify-content:space-between;align-items:center; }
.svc-modal .svc-policy-detail { display:flex;flex-direction:column;gap:0; }

/* Download groups */
.svc-modal .svc-dl-group { margin-bottom:14px; }
.svc-modal .svc-dl-group-title { color:#0EA5E9;font-weight:600;font-size:12px;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid #E3EAF0; }
.svc-modal .svc-dl-item { display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #EBEFF4; }
.svc-modal .svc-dl-fmt { display:inline-block;background:#EBEFF4;color:#0EA5E9;font-size:9px;padding:2px 6px;border-radius:3px;margin-left:6px; }

/* Chart block compact */
.chart-block-sm { padding:14px 20px !important; }
.subsidy-chart-detail { min-width:0; }

/* Scroll */
.svc-modal .mod-bd { max-height:calc(85vh - 70px); overflow-y:auto; }
</style>
