<template>
  <div class="header">
    <div class="title">🌾 中堰村数字乡村驾驶舱</div>
    <div class="kpi">
      <span v-for="k in kpis" :key="k.label">
        <em :style="{ color: k.color }">{{ k.value }}</em> {{ k.label }}
      </span>
    </div>
    <div class="time">{{ time }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGisStore } from '@/store/gisStore'

const store = useGisStore()
const time = ref('')
onMounted(() => { setInterval(() => { time.value = new Date().toLocaleString('zh-CN', { hour12: false }) }, 1000) })

const kpis = computed(() => [
  { label: '点位', value: store.stats.totalPoints, color: '#00d4ff' },
  { label: '年收入', value: (store.stats.incomeTotal / 10000).toFixed(0) + '万', color: '#f0a500' },
  { label: '在线率', value: '96.8%', color: '#00ff88' },
  { label: '预警', value: store.stats.warning, color: '#ff6b6b' }
])
</script>

<style scoped>
.header { height: 48px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px;
  background: rgba(10,22,40,.95); border-bottom: 1px solid rgba(0,180,255,.08); flex-shrink: 0; }
.title { font-size: 18px; font-weight: 700; color: #e0e6f0; letter-spacing: 2px; }
.kpi { display: flex; gap: 24px; font-size: 12px; color: #64748b; }
.kpi em { font-style: normal; font-weight: 700; font-size: 15px; font-family: 'DIN Alternate',sans-serif; margin-right: 2px; }
.time { font-size: 12px; color: #4a5568; font-family: monospace; }
</style>
