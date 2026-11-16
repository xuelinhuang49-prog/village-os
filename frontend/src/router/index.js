import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/HomePage.vue'),
    meta: { title: '蓝匠数智数字乡村平台 · 中堰村' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginPage.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardPage.vue'),
    meta: { title: '数字乡村驾驶舱', requiresAuth: true }
  },
  {
    path: '/industry',
    name: 'Industry',
    component: () => import('@/views/dashboard/IndustryPage.vue'),
    meta: { title: '数字产业中心', requiresAuth: true }
  },
  {
    path: '/industry/agriculture/land',
    name: 'LandManagement',
    component: () => import('@/views/industry/agriculture/LandManagement.vue'),
    meta: { title: '地块管理', requiresAuth: true }
  },
  { path: '/industry/agriculture/pest-warning', redirect: '/dashboard' },
  { path: '/industry/agriculture', redirect: '/dashboard' },
  { path: '/industry/aquaculture', redirect: '/dashboard' },
  {
    path: '/industry/ecommerce',
    name: 'EcommercePage',
    component: () => import('@/views/industry/EcommercePage.vue'),
    meta: { title: '农产品电商中心', requiresAuth: true }
  },
  {
    path: '/service',
    name: 'Service',
    component: () => import('@/views/dashboard/ServicePage.vue'),
    meta: { title: '数字服务中心', requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminLogin',
    component: () => import('@/views/login/AdminLoginPage.vue'),
    meta: { title: '管理员登录' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '数字乡村综合运营平台'
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
