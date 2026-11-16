<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">数字乡村综合运营平台</h1>
      <p class="login-subtitle">Village OS</p>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
      <p class="login-hint">账号：姓名拼音+123，初始密码 123456（示例：wangyoude123 / 123456）</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const formRef = ref(null)

// 农户登录：账号=姓名拼音+123，初始密码 123456，走后端 /api/farmer/login 签发真实 JWT
const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function handleLogin() {
  const u = (form.username || '').trim()
  const p = (form.password || '').trim()
  if (!u || !p) { ElMessage.warning('请输入用户名和密码'); return }
  if (loading.value) return
  loading.value = true
  try {
    const res = await axios.post('/api/farmer/login', { username: u, password: p }, { timeout: 5000 })
    const body = res.data || {}
    if (body.code === 200 && body.data && body.data.token) {
      const d = body.data
      // 写入登录态：token 满足路由守卫，farmerUser 驱动 currentUser 变为该农户
      localStorage.setItem('token', d.token)
      localStorage.setItem('farmerUser', JSON.stringify({
        name: d.name, phone: d.phone, farmerId: d.farmerId,
        village: d.village, zone: d.zone, grid: d.grid, gridId: d.gridId,
        role: '村民', username: d.username
      }))
      localStorage.removeItem('adminUser')
      localStorage.removeItem('userInfo')
      ElMessage.success('登录成功，欢迎 ' + d.name)
      loading.value = false
      router.push('/dashboard')
      return
    }
    ElMessage.error((body && body.message) || '账号或密码错误')
  } catch (e) {
    const msg = (e && e.response && e.response.data && e.response.data.message) || '无法连接服务器，请确认后端已启动'
    ElMessage.error(msg)
  }
  loading.value = false
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #1a3a5c 0%, #2d6a4f 50%, #1a3a5c 100%);
}
.login-card {
  width: 420px;
  padding: 48px 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
.login-title {
  text-align: center;
  font-size: 24px;
  color: #1a3a5c;
  margin-bottom: 4px;
}
.login-subtitle {
  text-align: center;
  font-size: 14px;
  color: #909399;
  margin-bottom: 32px;
  letter-spacing: 4px;
}
.login-btn {
  width: 100%;
}
.login-hint {
  text-align: center;
  font-size: 12px;
  color: #909399;
  margin: 16px 0 0;
}
</style>
