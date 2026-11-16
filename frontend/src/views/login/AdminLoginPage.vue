<template>
  <div class="adm-login">
    <div class="login-card">
      <div class="icon">⚙️</div>
      <h1>管理员登录</h1>
      <p class="sub">中堰村蓝匠数智数字乡村平台 · 管理后台</p>
      <input v-model="username" type="text" placeholder="管理员账号" autocomplete="off" @keyup.enter="doLogin" />
      <input v-model="password" type="password" placeholder="密码" @keyup.enter="doLogin" />
      <div class="err">{{ err }}</div>
      <button class="btn-login" :disabled="loading" @click="doLogin">{{ loading ? '登录中…' : '登 录' }}</button>
      <div class="hint">演示账号：admin/admin123（超级管理员）· cungan/123456（村干部）· wange1/123456（网格员）· hezuoshe/123456（经营主体）</div>
      <router-link to="/" class="back">← 返回首页</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const username = ref('')
const password = ref('')
const err = ref('')
const loading = ref(false)

// 四类层级演示账号（与农户登录 /login 分离）：role 为前端展示用中文，roleCode 由后端下发
const ADMINS = [
  { u: 'admin', p: 'admin123', n: '黄雪琳', r: '管理员', rc: 'SUPER_ADMIN', org: '平台运营方' },
  { u: 'cungan', p: '123456', n: '洪梦冉', r: '村干部', rc: 'VILLAGE_ADMIN', org: '村党支部' },
  { u: 'wange1', p: '123456', n: '赵大哥', r: '网格员', rc: 'GRID_WORKER', org: '中堰村1组片区' },
  { u: 'hezuoshe', p: '123456', n: '陈国平', r: '经营主体', rc: 'BUSINESS_ENTITY', org: '中堰村绿源农业合作社' }
]

// 后端角色代号 → 前端展示用中文键
const ROLE_KEY = { SUPER_ADMIN: '管理员', VILLAGE_ADMIN: '村干部', GRID_WORKER: '网格员', FARMER: '村民', BUSINESS_ENTITY: '经营主体' }

async function doLogin() {
  const u = username.value.trim()
  const p = password.value.trim()
  if (!u || !p) { err.value = '请输入账号和密码'; return }
  const found = ADMINS.find(a => a.u === u && a.p === p)
  if (!found) { err.value = '账号或密码错误'; return }
  if (loading.value) return
  loading.value = true
  err.value = ''
  // 优先向后端 /api/login 换取真实 JWT 与角色；后端不可用则退回演示映射
  let token = 'admin-' + found.u
  let name = found.n
  let role = found.r
  let roleCode = found.rc
  let gridId = null
  let org = found.org
  try {
    const res = await axios.post('/api/login', { username: u, password: p }, { timeout: 4000 })
    const body = res.data
    if (body && body.code === 200 && body.data && body.data.token) {
      token = body.data.token
      name = body.data.name || name
      role = ROLE_KEY[body.data.role] || role
      roleCode = body.data.role || roleCode
      gridId = body.data.gridId || null
      org = body.data.org || org
    }
  } catch (e) { /* 后端未启动：使用演示账号映射，真实接口自动降级 */ }
  // 写入登录态：token 满足路由守卫，adminUser 驱动 currentUser 变为对应管理端角色
  localStorage.setItem('token', token)
  localStorage.setItem('adminUser', JSON.stringify({
    name, role, roleCode, gridId, org,
    village: '中堰村',
    zone: role === '网格员' ? (gridId === 'GRID_01' ? '1组片区' : '2组片区') : '全村',
    grid: role === '网格员' ? (gridId === 'GRID_01' ? '第1网格' : '第2网格') : '—'
  }))
  localStorage.removeItem('farmerUser')
  loading.value = false
  router.push('/dashboard')
}
</script>

<style scoped>
.adm-login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #1a3a5c 0%, #2d6a4f 50%, #1a3a5c 100%);
}
.login-card {
  width: 400px;
  padding: 44px 40px;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}
.icon { font-size: 44px; margin-bottom: 8px; }
h1 { font-size: 22px; color: #1a3a5c; margin: 0 0 4px; letter-spacing: 2px; }
.sub { font-size: 12px; color: #909399; margin: 0 0 28px; }
input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 13px;
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
  color: #1f2d3d;
  outline: none;
  margin-bottom: 12px;
  box-sizing: border-box;
  transition: .2s;
}
input:focus { border-color: #22B573; box-shadow: 0 0 0 3px rgba(34, 181, 115, 0.12); }
.err { color: #e05252; font-size: 11px; min-height: 18px; margin-bottom: 6px; }
.btn-login {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  background: linear-gradient(135deg, #39D98A, #22B573);
  color: #fff;
  letter-spacing: 2px;
  transition: .2s;
}
.btn-login:hover { opacity: .92; }
.btn-login:disabled { opacity: .6; cursor: not-allowed; }
.hint { font-size: 11px; color: #909399; margin-top: 16px; }
.back { display: inline-block; margin-top: 14px; font-size: 12px; color: #66788a; text-decoration: none; }
.back:hover { color: #22B573; }
</style>
