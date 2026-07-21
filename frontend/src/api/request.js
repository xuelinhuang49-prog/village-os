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
      if (status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        window.location.href = '/login'
      }
      ElMessage.error(error.response.data?.message || '请求失败')
    } else {
      ElMessage.error('网络异常，请检查后端是否启动')
    }
    return Promise.reject(error)
  }
)

export default request
