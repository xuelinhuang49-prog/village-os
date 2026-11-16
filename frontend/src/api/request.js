import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api/v1',
  timeout: 10000
})

// 请求拦截：自动带 JWT Token
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截：统一错误处理
request.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      const { status } = error.response
      // 登录态失效（token 无效/过期，后端返回 403 Forbidden）或未授权：清空本地身份并回登录页，
      // 避免带着旧 token 反复弹「请求失败」。后端对未认证的 /api/** 默认回 403，故这里 403 与 401 同等对待。
      if (status === 401 || status === 403) {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('adminUser')
        localStorage.removeItem('farmerUser')
        window.location.href = '/login'
        return Promise.reject(error)
      }
      ElMessage.error(error.response.data?.message || '请求失败')
    } else {
      ElMessage.error('网络异常，请检查后端是否启动')
    }
    return Promise.reject(error)
  }
)

export default request
