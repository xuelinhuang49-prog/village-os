<template>
  <nav class="sidebar">
    <div class="sb-logo" @click="$router.push('/dashboard')">🏘️ 数字乡村</div>
    <div class="sb-section">产业中心</div>
    <div
      v-for="item in navItems"
      :key="item.path"
      class="sb-item"
      :class="{ active: currentPath === item.path }"
      @click="navigate(item.path)"
    >
      <span class="sb-icon">{{ item.icon }}</span>
      <span class="sb-label">{{ item.label }}</span>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const currentPath = computed(() => route.path)

const navItems = [
  { path: '/dashboard',       icon: '📊', label: '驾驶舱' },
  { path: '/industry', icon: '🌾', label: '智慧农业' },
  { path: '/industry', icon: '🛒', label: '农产品电商' },
  { path: '/industry', icon: '🏨', label: '乡村文旅' },
  { path: '/industry', icon: '🐟', label: '智慧养殖' }
]

function navigate(path) {
  router.push(path)
}
</script>

<style scoped>
.sidebar { width: 140px; background: rgba(8,18,34,.98); border-right: 1px solid rgba(0,180,255,.08);
  display: flex; flex-direction: column; flex-shrink: 0; overflow-y: auto; }
.sb-logo { padding: 14px 12px; font-size: 13px; font-weight: 700; color: #e0e6f0; cursor: pointer;
  border-bottom: 1px solid rgba(0,180,255,.08); text-align: center; }
.sb-section { font-size: 10px; color: #475569; padding: 10px 12px 4px; text-transform: uppercase; letter-spacing: 1px; }
.sb-item { display: flex; align-items: center; gap: 8px; padding: 9px 14px; cursor: pointer;
  font-size: 12px; color: #8a93a6; transition: all .15s; border-left: 2px solid transparent; }
.sb-item:hover { color: #e0e6f0; background: rgba(0,180,255,.06); }
.sb-item.active { color: #00d4ff; background: rgba(0,180,255,.08); border-left-color: #00d4ff; }
.sb-icon { font-size: 14px; flex-shrink: 0; }
.sb-label { white-space: nowrap; }
</style>
