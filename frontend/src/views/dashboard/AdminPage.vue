<template>
  <div class="adm-page">
    <!-- Toast notifications -->
    <div v-for="t in toasts" :key="t.id" class="toast" :class="t.type">{{ t.msg }}</div>

    <!-- Login -->
    <div v-if="!loggedIn" class="login-page">
      <div class="login-card">
        <div class="icon">⚙️</div>
        <h2>管理后台</h2>
        <div class="sub">中堰村蓝匠数智数字乡村平台</div>
        <input v-model="loginUser" type="text" placeholder="管理员账号" autocomplete="off" @keyup.enter="doLogin">
        <input v-model="loginPass" type="password" placeholder="管理员密码" @keyup.enter="doLogin">
        <div class="login-err">{{ loginErr }}</div>
        <button class="btn-login" @click="doLogin">登 录</button>
        <div class="hint">admin / admin123</div>
      </div>
    </div>

    <!-- App -->
    <div v-else class="admin-app">
      <div class="topbar">
        <div class="tl">
          <router-link to="/dashboard" style="color:#28C76F;text-decoration:none;font-size:13px;margin-right:8px">&#9664; 返回驾驶舱</router-link>
          ⚙️ 管理后台 · 中堰村
        </div>
        <div class="tr">
          <span>{{ curUserName }}</span>
          <router-link to="/">🏠 首页</router-link>
          <a href="#" @click.prevent="logout" style="color:#E74C3C">退出</a>
          <span>{{ clock }}</span>
        </div>
      </div>
      <div class="main-row">
        <div class="sidebar">
          <div
            v-for="p in adminPages"
            :key="p.id"
            class="side-item"
            :class="{ on: curPage === p.id }"
            @click="goPage(p.id)"
          >
            <span>{{ p.icon }}</span> {{ p.label }}
          </div>
        </div>
        <div class="content">
          <!-- ==================== DASHBOARD ==================== -->
          <div v-if="curPage === 'dashboard'">
            <div class="row">
              <div v-for="c in dashStats" :key="c.label" class="card" :class="c.cls">
                <div class="v">{{ c.value }}</div>
                <div class="l">{{ c.label }}</div>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
              <div class="panel">
                <div class="tt">📈 订单趋势（近7天）</div>
                <div id="chart_admin_orders" style="height:200px"></div>
              </div>
              <div class="panel">
                <div class="tt">📊 交易额统计</div>
                <div id="chart_admin_revenue" style="height:200px"></div>
              </div>
            </div>
            <div class="panel">
              <div class="tt">👥 在线用户</div>
              <table>
                <thead><tr><th>用户</th><th>角色</th><th>状态</th><th>最后活跃</th></tr></thead>
                <tbody>
                  <tr v-for="u in Musers" :key="u.id">
                    <td>
                      <div style="display:flex;align-items:center;gap:8px">
                        <div class="av" :style="{ background: u.cl }">{{ u.av }}</div>
                        {{ u.n }}
                      </div>
                    </td>
                    <td>{{ u.role }}</td>
                    <td><span class="tag" :class="u.st === '在线' ? 'g' : 'dim'">{{ u.st }}</span></td>
                    <td>{{ u.ll }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="panel">
              <div class="tt">🔔 待审核事项</div>
              <table>
                <thead><tr><th>类型</th><th>项目</th><th>申请人</th><th>日期</th><th>操作</th></tr></thead>
                <tbody>
                  <tr v-for="a in Maudits" :key="a.id">
                    <td><span class="tag y">{{ a.tp }}</span></td>
                    <td>{{ a.item }}</td>
                    <td>{{ a.ap }}</td>
                    <td>{{ a.dt }}</td>
                    <td>
                      <button class="btn btn-s btn-p" @click="doApprove(a.id)">通过</button>
                      <button class="btn btn-s btn-d">驳回</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ==================== USERS ==================== -->
          <div v-if="curPage === 'users'">
            <div class="row">
              <div class="card"><div class="v">{{ Musers.length }}</div><div class="l">总用户</div></div>
              <div class="card g"><div class="v">{{ Musers.filter(u => u.st === '在线').length }}</div><div class="l">在线</div></div>
              <div class="card y"><div class="v">{{ ADMINS.length }}</div><div class="l">管理员</div></div>
            </div>
            <div class="panel">
              <div class="tt">用户列表</div>
              <div style="display:flex;gap:8px;margin-bottom:10px">
                <button class="btn btn-p btn-s" @click="addUser">+ 新增用户</button>
                <button class="btn btn-o btn-s" @click="exportAdminUsers">📥 导出用户</button>
              </div>
              <table>
                <thead><tr><th>用户</th><th>角色</th><th>组织</th><th>权限</th><th>状态</th><th>最后登录</th><th>操作</th></tr></thead>
                <tbody>
                  <tr v-for="u in Musers" :key="u.id">
                    <td>
                      <div style="display:flex;align-items:center;gap:8px">
                        <div class="av" :style="{ background: u.cl }">{{ u.av }}</div>
                        <div>
                          <div style="color:#fff;font-weight:600">{{ u.n }}</div>
                          <div style="font-size:10px;color:#6F91A8">{{ u.ph }}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="tag" :class="u.role === '超级管理员' ? 'r' : u.role === '管理员' ? 'y' : 'b'">{{ u.role }}</span>
                    </td>
                    <td>{{ u.org }}</td>
                    <td style="font-size:10px">{{ u.perm }}</td>
                    <td><span class="tag" :class="u.st === '在线' ? 'g' : 'dim'">{{ u.st }}</span></td>
                    <td style="font-size:10px">{{ u.ll }}</td>
                    <td>
                      <button class="btn btn-s btn-p" @click="editUser(u.id)">编辑</button>
                      <button class="btn btn-s btn-d" @click="delUser(u.id)">删除</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ==================== B&B ==================== -->
          <div v-if="curPage === 'bnb'">
            <div class="row">
              <div class="card"><div class="v">{{ Mbnbs.length }}</div><div class="l">民宿总数</div></div>
              <div class="card g"><div class="v">{{ Mbnbs.filter(b => b.st === '营业中').length }}</div><div class="l">营业中</div></div>
              <div class="card y"><div class="v">{{ Mbnbs.filter(b => b.st === '审核中').length }}</div><div class="l">待审核</div></div>
            </div>
            <div class="panel">
              <div class="tt">民宿列表</div>
              <table>
                <thead><tr><th>民宿</th><th>业主</th><th>房间</th><th>价格</th><th>评分</th><th>预订</th><th>月营收</th><th>状态</th><th>操作</th></tr></thead>
                <tbody>
                  <tr v-for="b in Mbnbs" :key="b.id">
                    <td style="font-weight:600;color:#fff">{{ b.n }}</td>
                    <td>{{ b.o }}</td>
                    <td>{{ b.rm }}间</td>
                    <td>¥{{ b.pr }}</td>
                    <td>⭐{{ b.rt }}</td>
                    <td>{{ b.bk }}</td>
                    <td style="color:#28C76F">{{ b.rv }}</td>
                    <td><span class="tag" :class="b.st === '营业中' ? 'g' : 'y'">{{ b.st }}</span></td>
                    <td>
                      <button v-if="b.st === '审核中'" class="btn btn-s btn-p" @click="approveBnb(b.id)">通过</button>
                      <button v-else class="btn btn-s btn-d">下架</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ==================== ORDERS ==================== -->
          <div v-if="curPage === 'orders'">
            <div class="row">
              <div class="card"><div class="v">{{ Mords.length }}</div><div class="l">总订单</div></div>
              <div class="card y"><div class="v">{{ Mords.filter(o => o.st === '待支付').length }}</div><div class="l">待支付</div></div>
              <div class="card g"><div class="v">{{ Mords.filter(o => o.st === '已支付').length }}</div><div class="l">已支付</div></div>
              <div class="card"><div class="v">¥{{ totalOrderAmt.toLocaleString() }}</div><div class="l">订单总额</div></div>
            </div>
            <div class="panel">
              <div class="tt">全部订单</div>
              <table>
                <thead><tr><th>订单号</th><th>类型</th><th>项目</th><th>买家</th><th>金额</th><th>日期</th><th>状态</th></tr></thead>
                <tbody>
                  <tr v-for="o in Mords" :key="o.id">
                    <td>{{ o.id }}</td>
                    <td>
                      <span class="tag" :class="o.tp === '民宿' ? 'b' : o.tp === '门票' ? 'g' : 'y'">{{ o.tp }}</span>
                    </td>
                    <td>{{ o.item }}</td>
                    <td>{{ o.by }}</td>
                    <td style="color:#28C76F;font-weight:600">¥{{ o.amt.toLocaleString() }}</td>
                    <td>{{ o.dt }}</td>
                    <td>
                      <span class="tag" :class="o.st === '已支付' ? 'g' : o.st === '待支付' ? 'y' : o.st === '审核中' ? 'b' : 'dim'">{{ o.st }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ==================== AUDIT ==================== -->
          <div v-if="curPage === 'audit'">
            <div class="row">
              <div class="card"><div class="v">{{ Maudits.length }}</div><div class="l">审核总数</div></div>
              <div class="card y"><div class="v">{{ Maudits.filter(a => a.st === '待审核').length }}</div><div class="l">待审核</div></div>
              <div class="card g"><div class="v">{{ Maudits.filter(a => a.st === '已通过').length }}</div><div class="l">已通过</div></div>
            </div>
            <div class="panel">
              <div class="tt">审核列表</div>
              <table>
                <thead><tr><th>类型</th><th>项目</th><th>申请人</th><th>日期</th><th>状态</th><th>操作</th></tr></thead>
                <tbody>
                  <tr v-for="a in Maudits" :key="a.id">
                    <td><span class="tag b">{{ a.tp }}</span></td>
                    <td>{{ a.item }}</td>
                    <td>{{ a.ap }}</td>
                    <td>{{ a.dt }}</td>
                    <td><span class="tag" :class="a.st === '待审核' ? 'y' : 'g'">{{ a.st }}</span></td>
                    <td>
                      <template v-if="a.st === '待审核'">
                        <button class="btn btn-s btn-p" @click="doApprove(a.id)">通过</button>
                        <button class="btn btn-s btn-d">驳回</button>
                      </template>
                      <span v-else style="font-size:11px;color:#6F91A8">已处理</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ==================== LOGS ==================== -->
          <div v-if="curPage === 'logs'">
            <div class="panel">
              <div class="tt">系统操作日志</div>
              <table>
                <thead><tr><th>时间</th><th>用户</th><th>操作内容</th><th>类型</th><th>IP</th></tr></thead>
                <tbody>
                  <tr v-for="l in Mlogs" :key="l.id">
                    <td>{{ l.tm }}</td>
                    <td>{{ l.u }}</td>
                    <td>{{ l.act }}</td>
                    <td>
                      <span class="tag" :class="l.tp === '系统' ? 'b' : l.tp === '审核' ? 'y' : l.tp === '订单' ? 'r' : 'g'">{{ l.tp }}</span>
                    </td>
                    <td style="font-size:10px">{{ l.ip }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ==================== SETTINGS ==================== -->
          <div v-if="curPage === 'settings'">
            <div class="panel">
              <div class="tt">基本设置</div>
              <div style="margin-bottom:12px">
                <label style="display:block;font-size:11px;color:#6F91A8;margin-bottom:4px">平台名称</label>
                <input v-model="cfgName" style="width:100%;padding:9px 12px;border-radius:8px;font-size:12px;background:rgba(57,217,138,0.06);border:1px solid rgba(4,62,107,0.12);color:#B7D3E8;outline:none;box-sizing:border-box">
              </div>
              <div style="display:flex;gap:10px;margin-bottom:12px">
                <div style="flex:1">
                  <label style="display:block;font-size:11px;color:#6F91A8;margin-bottom:4px">自动备份</label>
                  <select v-model="cfgBackup" style="width:100%;padding:9px 12px;border-radius:8px;font-size:12px;background:rgba(57,217,138,0.06);border:1px solid rgba(4,62,107,0.12);color:#B7D3E8;outline:none;box-sizing:border-box">
                    <option>每天 02:00</option>
                    <option>每周一 02:00</option>
                  </select>
                </div>
                <div style="flex:1">
                  <label style="display:block;font-size:11px;color:#6F91A8;margin-bottom:4px">数据保留(天)</label>
                  <input v-model="cfgRetain" type="number" style="width:100%;padding:9px 12px;border-radius:8px;font-size:12px;background:rgba(57,217,138,0.06);border:1px solid rgba(4,62,107,0.12);color:#B7D3E8;outline:none;box-sizing:border-box">
                </div>
              </div>
              <button class="btn btn-p" @click="saveSettings">💾 保存设置</button>
            </div>

            <div class="panel">
              <div class="tt">数据管理</div>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <button class="btn btn-o" @click="exportAdminReport">📥 导出运营报表</button>
                <button class="btn btn-o" @click="exportAdminUsers">📥 导出用户数据</button>
                <button class="btn btn-d" @click="clearAdminCache">🗑️ 清除缓存</button>
              </div>
            </div>

            <div class="panel">
              <div class="tt">管理员账号</div>
              <table>
                <thead><tr><th>账号</th><th>姓名</th><th>角色</th></tr></thead>
                <tbody>
                  <tr v-for="a in ADMINS" :key="a.u">
                    <td>{{ a.u }}</td>
                    <td>{{ a.n }}</td>
                    <td><span class="tag" :class="a.r === '超级管理员' ? 'r' : 'y'">{{ a.r }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'

// ========== CLOCK ==========
const clock = ref('')
let clockTimer = null
function updateClock() {
  const d = new Date()
  clock.value = String(d.getHours()).padStart(2, '0') + ':' +
    String(d.getMinutes()).padStart(2, '0') + ':' +
    String(d.getSeconds()).padStart(2, '0')
}

// ========== TOAST ==========
const toasts = reactive([])
let toastId = 0
function toastMsg(msg, type) {
  const id = ++toastId
  toasts.push({ id, msg, type: type || 'info' })
  setTimeout(() => {
    const idx = toasts.findIndex(t => t.id === id)
    if (idx !== -1) toasts.splice(idx, 1)
  }, 2300)
}

// ========== AUTH ==========
const ADMINS = [
  { u: 'admin', p: 'admin123', n: '邓超', r: '超级管理员' },
  { u: 'hong', p: 'hong123', n: '黄尊海', r: '管理员' },
  { u: 'wang', p: 'wang123', n: '陈良敏', r: '运营经理' }
]
const loggedIn = ref(false)
const loginUser = ref('')
const loginPass = ref('')
const loginErr = ref('')
const curUserName = ref('')

function doLogin() {
  const u = loginUser.value.trim()
  const p = loginPass.value.trim()
  if (!u || !p) { loginErr.value = '请输入账号和密码'; return }
  const found = ADMINS.find(a => a.u === u && a.p === p)
  if (!found) { loginErr.value = '账号或密码错误'; return }
  loggedIn.value = true
  curUserName.value = found.n
  loginErr.value = ''
  localStorage.setItem('adm', JSON.stringify(found))
  toastMsg('登录成功，欢迎 ' + found.n, 'ok')
}

function logout() {
  loggedIn.value = false
  loginUser.value = ''
  loginPass.value = ''
  localStorage.removeItem('adm')
  disposeCharts()
}

// ========== NAVIGATION ==========
const curPage = ref('dashboard')
const adminPages = [
  { id: 'dashboard', icon: '📊', label: '系统概览' },
  { id: 'users', icon: '👥', label: '用户管理' },
  { id: 'bnb', icon: '🏡', label: '民宿管理' },
  { id: 'orders', icon: '📋', label: '订单管理' },
  { id: 'audit', icon: '🔔', label: '审核中心' },
  { id: 'logs', icon: '📝', label: '操作日志' },
  { id: 'settings', icon: '⚙️', label: '系统设置' }
]
function goPage(id) { curPage.value = id }

// ========== MOCK DATA ==========
const Musers = reactive([
  { id: 1, n: '黄雪琳', role: '超级管理员', org: '村党支部', ph: '138****0001', st: '在线', ll: '2026-06-23 08:30', av: '黄', cl: '#ef4444', perm: '全部' },
  { id: 2, n: '洪梦冉', role: '管理员', org: '村党支部', ph: '138****0002', st: '在线', ll: '2026-06-23 09:00', av: '洪', cl: '#f59e0b', perm: '内容、用户' },
  { id: 3, n: '王雍皓', role: '运营经理', org: '村民委员会', ph: '138****0003', st: '离线', ll: '2026-06-22 17:30', av: '王', cl: '#39D98A', perm: '订单、民宿' },
  { id: 4, n: '小王', role: '操作员', org: '村委会', ph: '138****0004', st: '在线', ll: '2026-06-23 07:45', av: '王', cl: '#39D98A', perm: '政务、补贴' },
  { id: 5, n: '小刘', role: '操作员', org: '村委会', ph: '138****0005', st: '离线', ll: '2026-06-22 18:00', av: '刘', cl: '#39D98A', perm: '医保、补贴' }
])

const Mbnbs = reactive([
  { id: 1, n: '半日闲舍', o: '村集体', rm: 6, pr: 288, rt: 4.9, bk: 520, rv: '¥8.5万', st: '营业中', sd: '2023-06' },
  { id: 2, n: '凤鸣锦舍', o: '村集体', rm: 5, pr: 358, rt: 4.8, bk: 380, rv: '¥6.8万', st: '营业中', sd: '2024-03' }
])

const Mords = reactive([
  { id: 'BNB0701', tp: '民宿', item: '半日闲舍·标准间', by: '张女士', amt: 576, st: '已支付', dt: '2026-07-01' },
  { id: 'TK002', tp: '门票', item: '灯光音乐节×2', by: '李先生', amt: 60, st: '已支付', dt: '2026-07-14' },
  { id: 'ACT001', tp: '活动', item: '垂钓大赛报名', by: '赵大哥', amt: 40, st: '已支付', dt: '2026-06-18' },
  { id: 'BNB0702', tp: '民宿', item: '凤鸣锦舍·景观房', by: '王女士', amt: 716, st: '待支付', dt: '2026-07-02' },
  { id: 'SUB001', tp: '补贴', item: '耕地地力保护补贴', by: '肖子微', amt: 1200, st: '审核中', dt: '2026-06-10' }
])

const Maudits = reactive([
  { id: 1, tp: '民宿审核', item: '凤鸣锦舍', ap: '村集体', dt: '2026-06-20', st: '待审核' },
  { id: 2, tp: '补贴审核', item: '耕地力保护补贴', ap: '肖子微', dt: '2026-06-10', st: '待审核' },
  { id: 3, tp: '项目审核', item: '智慧市集运营方案', ap: '村集体', dt: '2026-07-01', st: '待审核' }
])

const Mlogs = reactive([
  { id: 1, tm: '2026-06-23 10:30', u: '黄雪琳', act: '审核通过民宿"云栖小筑"', tp: '审核', ip: '192.168.1.1' },
  { id: 2, tm: '2026-06-23 09:45', u: '洪梦冉', act: '新增培训课程', tp: '内容', ip: '192.168.1.2' },
  { id: 3, tm: '2026-06-23 08:30', u: '黄雪琳', act: '管理员登录', tp: '系统', ip: '192.168.1.1' },
  { id: 4, tm: '2026-06-22 17:30', u: '王雍皓', act: '处理退款申请', tp: '订单', ip: '192.168.1.3' },
  { id: 5, tm: '2026-06-22 16:00', u: '小王', act: '新增政务预约5条', tp: '内容', ip: '192.168.1.4' },
  { id: 6, tm: '2026-06-22 14:20', u: '黄雪琳', act: '导出运营报表', tp: '系统', ip: '192.168.1.1' },
  { id: 7, tm: '2026-06-22 10:00', u: '小刘', act: '审核补贴申请3条', tp: '审核', ip: '192.168.1.5' }
])

// ========== COMPUTED ==========
const totalOrderAmt = computed(() => Mords.reduce((s, o) => s + o.amt, 0))
const dashStats = computed(() => {
  const onlineCount = Musers.filter(u => u.st === '在线').length
  const pendingAuditCount = Maudits.filter(a => a.st === '待审核').length
  return [
    { label: '平台用户', value: Musers.length, cls: '' },
    { label: '在线用户', value: onlineCount, cls: 'g' },
    { label: '民宿总数', value: Mbnbs.length, cls: '' },
    { label: '本月订单', value: Mords.length, cls: 'y' },
    { label: '本月交易额', value: '¥' + totalOrderAmt.value.toLocaleString(), cls: 'g' },
    { label: '待审核', value: pendingAuditCount, cls: 'r' }
  ]
})

// ========== ECHARTS ==========
let chartOrdersInstance = null
let chartRevenueInstance = null

function initCharts() {
  const oe = document.getElementById('chart_admin_orders')
  if (oe && !chartOrdersInstance) {
    chartOrdersInstance = echarts.init(oe)
    chartOrdersInstance.setOption({
      tooltip: { trigger: 'axis', backgroundColor: '#ffffff', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#1e293b', fontSize: 10 } },
      grid: { left: 8, right: 20, top: 10, bottom: 24 },
      xAxis: { type: 'category', data: ['6/12', '6/13', '6/14', '6/15', '6/16', '6/17', '6/18'], axisLabel: { color: '#6b7a8d', fontSize: 9 } },
      yAxis: { type: 'value', axisLabel: { color: '#6b7a8d', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(14,165,233,0.06)' } } },
      series: [
        {
          type: 'bar', data: [8, 12, 10, 15, 18, 12, 16], barWidth: 16,
          itemStyle: { borderRadius: [3, 3, 0, 0], color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#28C7FA' }, { offset: 1, color: 'rgba(57,217,138,0.20)' }]) }
        },
        {
          type: 'line', data: [8, 12, 10, 15, 18, 12, 16], smooth: true,
          lineStyle: { color: '#39D98A', width: 2 }, itemStyle: { color: '#39D98A' }, symbol: 'circle', symbolSize: 6
        }
      ]
    })
  }
  const re = document.getElementById('chart_admin_revenue')
  if (re && !chartRevenueInstance) {
    chartRevenueInstance = echarts.init(re)
    chartRevenueInstance.setOption({
      tooltip: { trigger: 'axis', backgroundColor: '#ffffff', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#1e293b', fontSize: 10 } },
      grid: { left: 8, right: 20, top: 10, bottom: 24 },
      xAxis: { type: 'category', data: ['6/12', '6/13', '6/14', '6/15', '6/16', '6/17', '6/18'], axisLabel: { color: '#6b7a8d', fontSize: 9 } },
      yAxis: { type: 'value', name: '¥', axisLabel: { color: '#6b7a8d', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(14,165,233,0.06)' } } },
      series: [{
        type: 'line', data: [3200, 4800, 5600, 7200, 8500, 6800, 9100], smooth: true,
        lineStyle: { color: '#f59e0b', width: 2 }, itemStyle: { color: '#f59e0b' }, symbol: 'circle', symbolSize: 8,
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(245,158,11,.3)' }, { offset: 1, color: 'rgba(245,158,11,.02)' }]) }
      }]
    })
  }
}

function disposeCharts() {
  if (chartOrdersInstance) { chartOrdersInstance.dispose(); chartOrdersInstance = null }
  if (chartRevenueInstance) { chartRevenueInstance.dispose(); chartRevenueInstance = null }
}

// Watch page changes to init/dispose charts
watch(curPage, async (newPage, oldPage) => {
  if (oldPage === 'dashboard') disposeCharts()
  if (newPage === 'dashboard') {
    await nextTick()
    setTimeout(initCharts, 200)
  }
})

// ========== USER CRUD ==========
function addUser() {
  const n = prompt('请输入姓名：')
  if (!n) return
  Musers.push({
    id: Date.now(), n, role: '操作员', org: '村委会', ph: '-',
    st: '离线', ll: '-', av: n[0], cl: '#39D98A', perm: '-'
  })
  toastMsg('已新增：' + n, 'ok')
  goPage('users')
}

function editUser(id) {
  const u = Musers.find(x => x.id === id)
  if (!u) return
  const r = prompt('修改角色（超级管理员/管理员/运营经理/操作员）：', u.role)
  if (r) { u.role = r; toastMsg('已更新', 'ok') }
}

function delUser(id) {
  const u = Musers.find(x => x.id === id)
  if (!u) return
  if (u.role === '超级管理员') { toastMsg('无法删除超级管理员', 'warn'); return }
  if (!confirm('确定删除 ' + u.n + '？')) return
  const idx = Musers.findIndex(x => x.id === id)
  if (idx !== -1) Musers.splice(idx, 1)
  toastMsg('已删除', 'ok')
}

// ========== APPROVE ==========
function doApprove(id) {
  const a = Maudits.find(x => x.id === id)
  if (!a) return
  a.st = '已通过'
  Mlogs.unshift({
    id: Date.now(),
    tm: new Date().toLocaleString('zh-CN', { hour12: false }),
    u: curUserName.value || '管理员',
    act: '审核通过：' + a.item,
    tp: '审核',
    ip: '192.168.1.1'
  })
  toastMsg('已通过：' + a.item, 'ok')
}

function approveBnb(id) {
  const b = Mbnbs.find(x => x.id === id)
  if (!b) return
  b.st = '营业中'
  Mlogs.unshift({
    id: Date.now(),
    tm: new Date().toLocaleString('zh-CN', { hour12: false }),
    u: curUserName.value || '管理员',
    act: '审核通过民宿：' + b.n,
    tp: '审核',
    ip: '192.168.1.1'
  })
  toastMsg('已通过：' + b.n, 'ok')
}

// ========== SETTINGS ==========
const cfgName = ref(localStorage.getItem('adm_cfg_name') || '中堰村蓝匠数智数字乡村平台')
const cfgBackup = ref(localStorage.getItem('adm_cfg_backup') || '每天 02:00')
const cfgRetain = ref(localStorage.getItem('adm_cfg_retain') || '365')

function saveSettings() {
  localStorage.setItem('adm_cfg_name', cfgName.value)
  localStorage.setItem('adm_cfg_backup', cfgBackup.value)
  localStorage.setItem('adm_cfg_retain', cfgRetain.value)
  toastMsg('设置已保存到本地', 'ok')
}

function exportAdminReport() {
  const csv = '指标,数值\n' +
    '平台用户,' + Musers.length + '\n' +
    '在线用户,' + Musers.filter(u => u.st === '在线').length + '\n' +
    '民宿总数,' + Mbnbs.length + '\n' +
    '本月订单,' + Mords.length + '\n' +
    '交易总额,' + totalOrderAmt.value + '\n' +
    '待审核,' + Maudits.filter(a => a.st === '待审核').length
  downloadCSV(csv, '运营报表_' + new Date().toISOString().split('T')[0] + '.csv')
  toastMsg('报表已导出', 'ok')
}

function exportAdminUsers() {
  const csv = '姓名,角色,组织,电话,状态,最后登录\n' +
    Musers.map(u => u.n + ',' + u.role + ',' + u.org + ',' + u.ph + ',' + u.st + ',' + u.ll).join('\n')
  downloadCSV(csv, '用户数据_' + new Date().toISOString().split('T')[0] + '.csv')
  toastMsg('用户数据已导出', 'ok')
}

function downloadCSV(csv, filename) {
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  if (window.showSaveFilePicker) {
    window.showSaveFilePicker({ suggestedName: filename, types: [{ description: 'CSV', accept: { 'text/csv': ['.csv'] } }] })
      .then(h => h.createWritable().then(w => w.write('﻿' + csv).then(() => w.close())))
      .catch(e => { if (e.name !== 'AbortError') { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click(); URL.revokeObjectURL(a.href) } })
  } else {
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click(); URL.revokeObjectURL(a.href)
  }
}

function clearAdminCache() {
  if (!confirm('确定清除所有缓存数据？这将重置设置和登录状态。')) return
  localStorage.clear()
  toastMsg('缓存已清除，页面将刷新', 'ok')
  setTimeout(() => { location.reload() }, 1000)
}

// ========== LIFECYCLE ==========
onMounted(() => {
  // Clock
  updateClock()
  clockTimer = setInterval(updateClock, 1000)

  // Auto-login
  try {
    const saved = localStorage.getItem('adm')
    if (saved) {
      const a = JSON.parse(saved)
      curUserName.value = a.n
      loggedIn.value = true
    }
  } catch (e) { /* ignore */ }

  // Init charts if dashboard is default page
  if (loggedIn.value && curPage.value === 'dashboard') {
    nextTick(() => { setTimeout(initCharts, 200) })
  }
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
  disposeCharts()
})
</script>

<style scoped>
@import '@/../public/design-tokens.css';

.adm-page {
  min-height: 100vh;
  background: #071B2D;
  color: #B7D3E8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* ========== TOAST ========== */
.toast {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  animation: toastIn 0.3s ease, toastOut 0.3s ease 2s forwards;
  box-shadow: 0 8px 24px rgba(0, 0, 0, .4);
  pointer-events: none;
}
.toast.ok { background: linear-gradient(135deg, #059669, #39D98A); }
.toast.info { background: linear-gradient(135deg, #39D98A, #28C76F); }
.toast.warn { background: linear-gradient(135deg, #d97706, #f59e0b); }
@keyframes toastIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes toastOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }

/* ========== LOGIN ========== */
.login-page {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: linear-gradient(160deg, #020c1c, #043e6b, #020c1c);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.login-card {
  background: rgba(8, 28, 58, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.10);
  border-radius: 12px;
  padding: 40px 36px;
  width: 380px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, .5);
}
.login-card .icon { font-size: 48px; margin-bottom: 8px; }
.login-card h2 {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 3px;
  margin-bottom: 4px;
}
.login-card .sub { font-size: 11px; color: #6F91A8; margin-bottom: 24px; }
.login-card input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 6px;
  font-size: 13px;
  background: rgba(57, 217, 138, 0.06);
  border: 1px solid rgba(40, 199, 111, 0.12);
  color: #B7D3E8;
  outline: none;
  margin-bottom: 12px;
  transition: .2s;
  box-sizing: border-box;
}
.login-card input:focus {
  border-color: #39D98A;
  box-shadow: 0 0 12px rgba(57, 217, 138, 0.15);
}
.login-err { color: #ef4444; font-size: 11px; margin-bottom: 8px; min-height: 18px; }
.btn-login {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  background: linear-gradient(135deg, #39D98A, #28C76F);
  color: #fff;
  letter-spacing: 2px;
  box-shadow: 0 4px 16px rgba(40, 199, 111, 0.25);
  transition: .3s;
  margin-top: 8px;
}
.btn-login:hover { box-shadow: 0 6px 24px rgba(57, 217, 138, 0.30); }
.login-card .hint { font-size: 10px; color: #6F91A8; margin-top: 16px; }

/* ========== APP LAYOUT ========== */
.admin-app { display: flex; min-height: 100vh; flex-direction: column; }
.topbar {
  flex-shrink: 0;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: linear-gradient(180deg, rgba(10, 50, 100, 0.15), rgba(6, 20, 44, 0.05));
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.topbar .tl { font-size: 15px; font-weight: 700; color: #fff; letter-spacing: 2px; }
.topbar .tr { display: flex; align-items: center; gap: 16px; font-size: 11px; color: #6F91A8; }
.topbar .tr a { color: #6F91A8; text-decoration: none; }
.topbar .tr a:hover { color: #B7D3E8; }

.main-row { flex: 1; display: flex; min-height: 0; overflow: hidden; }
.sidebar {
  width: 200px;
  flex-shrink: 0;
  background: rgba(8, 24, 48, 0.88);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  overflow-y: auto;
  padding: 8px 0;
}
.side-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  margin: 1px 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  color: #6b7a8d;
  transition: all .2s;
  white-space: nowrap;
  user-select: none;
}
.side-item:hover { background: rgba(40, 199, 111, 0.06); color: #B7D3E8; }
.side-item.on {
  background: rgba(40, 199, 111, 0.10);
  color: #fff;
  font-weight: 600;
  border-left: 4px solid #28C76F;
}

.content { flex: 1; overflow-y: auto; padding: 16px 20px; min-height: 0; }

/* ========== CARDS ========== */
.row { display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
.card {
  flex: 1;
  min-width: 140px;
  background: rgba(8, 24, 48, 0.88);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(40, 199, 111, 0.10);
  border-radius: 6px;
  padding: 14px 18px;
  cursor: pointer;
  transition: .25s;
}
.card:hover { transform: translateY(-2px); }
.card .v {
  font-size: 22px;
  font-weight: 700;
  color: #28C76F;
  font-family: 'SF Mono', Consolas, monospace;
}
.card .l { font-size: 10px; color: #6F91A8; margin-top: 4px; }
.card.g .v { color: #28C76F; }
.card.y .v { color: #F5B83D; }
.card.r .v { color: #E74C3C; }

/* ========== PANELS ========== */
.panel {
  background: rgba(8, 24, 48, 0.88);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(40, 199, 111, 0.10);
  border-radius: 6px;
  padding: 16px 20px;
  margin-bottom: 14px;
}
.panel .tt {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 14px;
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

/* ========== TABLES ========== */
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 9px 12px; text-align: left; font-size: 11px; }
th {
  background: rgba(10, 36, 68, 0.55);
  font-weight: 600;
  color: #6F91A8;
  border-bottom: 2px solid rgba(40, 199, 111, 0.10);
  font-size: 10px;
}
td { border-bottom: 1px solid rgba(14, 165, 233, 0.06); }

/* ========== TAGS ========== */
.tag {
  display: inline-block;
  padding: 3px 9px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}
.tag.g { background: rgba(40, 199, 111, 0.12); color: #28C76F; }
.tag.b { background: rgba(40, 199, 111, 0.10); color: #28C76F; }
.tag.y { background: rgba(245, 184, 61, 0.12); color: #F5B83D; }
.tag.r { background: rgba(231, 76, 60, 0.15); color: #E74C3C; }
.tag.dim { background: rgba(100, 120, 140, .15); color: #6F91A8; }

/* ========== BUTTONS ========== */
.btn {
  display: inline-block;
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  letter-spacing: .5px;
  transition: .2s;
}
.btn-p {
  background: linear-gradient(135deg, #39D98A, #28C76F);
  color: #fff;
  box-shadow: 0 2px 10px rgba(57, 217, 138, 0.25);
}
.btn-p:hover { box-shadow: 0 3px 14px rgba(57, 217, 138, 0.35); }
.btn-o {
  background: transparent;
  border: 1px solid rgba(40, 199, 111, 0.28);
  color: #28C76F;
}
.btn-o:hover { background: rgba(40, 199, 111, 0.06); }
.btn-d {
  background: rgba(231, 76, 60, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #E74C3C;
}
.btn-d:hover { background: rgba(231, 76, 60, 0.18); }
.btn-s { padding: 4px 10px; font-size: 10px; }

/* ========== AVATAR ========== */
.av {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

/* ========== SETTINGS ========== */
select option {
  background: #081830;
  color: #B7D3E8;
}
</style>
