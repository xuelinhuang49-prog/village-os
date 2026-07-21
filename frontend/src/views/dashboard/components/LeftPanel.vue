<template>
  <div class="lp">
    <div class="card">
      <div class="card-head">产业分布</div>
      <div ref="ringRef" class="chart"></div>
    </div>
    <div class="card">
      <div class="card-head">各产业年收入（万元）</div>
      <div ref="barRef" class="chart"></div>
    </div>
    <div class="card">
      <div class="card-head">近7日客流</div>
      <div ref="lineRef" class="chart"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const ringRef = ref(null), barRef = ref(null), lineRef = ref(null)

onMounted(() => {
  const ring = echarts.init(ringRef.value)
  ring.setOption({
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', radius: ['50%', '75%'], center: ['50%', '50%'],
      label: { color: '#8a93a6', fontSize: 10 },
      data: [
        { value: 35, name: '农业', itemStyle: { color: '#00d4ff' } },
        { value: 25, name: '养殖', itemStyle: { color: '#00ff88' } },
        { value: 20, name: '文旅', itemStyle: { color: '#f0a500' } },
        { value: 20, name: '民生', itemStyle: { color: '#a78bfa' } }
      ]
    }]
  })

  const bar = echarts.init(barRef.value)
  bar.setOption({
    grid: { top: 8, right: 8, bottom: 16, left: 34 },
    xAxis: { type: 'category', data: ['农业','养殖','文旅','民生'], axisLabel: { color: '#64748b', fontSize: 9 } },
    yAxis: { type: 'value', axisLabel: { color: '#64748b', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)' } } },
    series: [{ type: 'bar', barWidth: 14, itemStyle: { borderRadius: [4,4,0,0] },
      data: [{ value: 47, itemStyle: { color: '#00d4ff' } }, { value: 20, itemStyle: { color: '#00ff88' } }, { value: 24, itemStyle: { color: '#f0a500' } }, { value: 13, itemStyle: { color: '#a78bfa' } }]
    }]
  })

  const line = echarts.init(lineRef.value)
  line.setOption({
    grid: { top: 8, right: 8, bottom: 16, left: 34 },
    xAxis: { type: 'category', data: ['24','25','26','27','28','29','30'], axisLabel: { color: '#64748b', fontSize: 9 } },
    yAxis: { type: 'value', axisLabel: { color: '#64748b', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)' } } },
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 4, lineStyle: { color: '#00d4ff', width: 2 },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(0,212,255,.2)' }, { offset: 1, color: 'rgba(0,212,255,0)' }]) },
      data: [210, 245, 198, 287, 256, 312, 290]
    }]
  })
})
</script>

<style scoped>
.lp { display: flex; flex-direction: column; gap: 6px; height: 100%; }
.card { flex: 1; background: rgba(10,22,42,.7); border: 1px solid rgba(0,180,255,.08); border-radius: 4px; display: flex; flex-direction: column; min-height: 0; }
.card-head { font-size: 12px; color: #7dc4fc; padding: 8px 12px; border-bottom: 1px solid rgba(0,180,255,.06); flex-shrink: 0; }
.chart { flex: 1; min-height: 0; }
</style>
