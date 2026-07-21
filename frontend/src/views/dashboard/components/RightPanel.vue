<template>
  <div class="rp">
    <template v-if="store.selectedPoint">
      <div class="rp-hero">
        <span class="rp-tag" :style="{ background: tc(store.selectedPoint.type), boxShadow: `0 0 12px ${tc(store.selectedPoint.type)}44` }">
          {{ tl(store.selectedPoint.type) }}
        </span>
        <h2 class="rp-name">{{ store.selectedPoint.name }}</h2>
      </div>
      <div class="rp-grid">
        <div class="rp-row"><span>负责人</span><b>{{ store.selectedPoint.manager || '--' }}</b></div>
        <div class="rp-row"><span>地址</span><b>{{ store.selectedPoint.address || '--' }}</b></div>
        <div class="rp-row"><span>年收入</span><b class="gold">¥{{ (store.selectedPoint.income || 0).toLocaleString() }}</b></div>
        <div class="rp-row"><span>产量</span><b>{{ store.selectedPoint.output > 0 ? store.selectedPoint.output + ' 吨' : '--' }}</b></div>
        <div class="rp-row"><span>状态</span><b :class="store.selectedPoint.status === 'normal' ? 'ok' : 'warn'">● {{ store.selectedPoint.status === 'normal' ? '正常' : '预警' }}</b></div>
      </div>
      <div class="rp-iot" v-if="store.selectedPoint.iot">
        <div class="rp-iot-head">实时传感器</div>
        <div class="rp-iot-row" v-for="s in iotBars" :key="s.label">
          <span>{{ s.label }}</span><div class="bar"><i :style="{ width: s.pct + '%', background: s.color }"></i></div><b>{{ s.val }}</b>
        </div>
      </div>
    </template>
    <div class="rp-empty" v-else>
      <div class="empty-icon">📍</div><p>点击地图点位</p><span>查看详细信息</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGisStore } from '@/store/gisStore'

const store = useGisStore()
const T = [
  { v: 'gov', l: '政务', c: '#e74c3c' }, { v: 'agriculture', l: '农业', c: '#00d4ff' },
  { v: 'aquaculture', l: '养殖', c: '#00ff88' }, { v: 'tourism', l: '文旅', c: '#f0a500' },
  { v: 'residence', l: '民生', c: '#a78bfa' }, { v: 'commerce', l: '商业', c: '#fb7185' }
]
function tc(t) { return T.find(x => x.v === t)?.c || '#666' }
function tl(t) { return T.find(x => x.v === t)?.l || t }

const iotBars = computed(() => store.selectedPoint?.iot ? [
  { label: '温度', val: store.selectedPoint.iot.temperature + '°C', pct: store.selectedPoint.iot.temperature / 50 * 100, color: '#00d4ff' },
  { label: '湿度', val: store.selectedPoint.iot.humidity + '%', pct: store.selectedPoint.iot.humidity, color: '#00ff88' },
  { label: '土壤', val: store.selectedPoint.iot.soil + '%', pct: store.selectedPoint.iot.soil, color: '#a78bfa' }
] : [])
</script>

<style scoped>
.rp { padding: 12px; }
.rp-hero { margin-bottom: 12px; }
.rp-tag { display: inline-block; color: #fff; padding: 3px 12px; border-radius: 3px; font-size: 11px; font-weight: 600; margin-bottom: 6px; }
.rp-name { font-size: 20px; font-weight: 700; color: #e0e6f0; margin: 0; }
.rp-grid { margin-bottom: 10px; }
.rp-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,.03); font-size: 12px; }
.rp-row span { color: #64748b; }
.rp-row b { color: #cbd5e1; font-weight: 500; }
.rp-row b.gold { color: #f0a500; }
.rp-row b.ok { color: #00ff88; }
.rp-row b.warn { color: #f0a500; }
.rp-iot { background: rgba(0,212,255,.04); border: 1px solid rgba(0,212,255,.06); border-radius: 4px; padding: 10px; }
.rp-iot-head { font-size: 11px; color: #00d4ff; margin-bottom: 8px; font-weight: 600; }
.rp-iot-row { display: flex; align-items: center; gap: 6px; margin: 5px 0; font-size: 11px; }
.rp-iot-row span { width: 26px; color: #8a93a6; }
.rp-iot-row .bar { flex: 1; height: 5px; background: rgba(255,255,255,.05); border-radius: 3px; overflow: hidden; }
.rp-iot-row .bar i { display: block; height: 100%; border-radius: 3px; }
.rp-iot-row b { width: 46px; text-align: right; color: #e0e6f0; font-weight: 600; }
.rp-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 200px; color: #475569; }
.empty-icon { font-size: 36px; opacity: .4; margin-bottom: 8px; }
.rp-empty p { font-size: 13px; color: #8a93a6; }
.rp-empty span { font-size: 11px; }
</style>
