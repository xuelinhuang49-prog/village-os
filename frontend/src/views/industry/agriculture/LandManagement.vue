<template>
  <div class="land-page">
    <div class="page-header">
      <div>
        <h2>地块管理</h2>
        <p>中堰村农业地块信息管理</p>
      </div>
      <button class="back-btn" @click="router.back()">返回</button>
    </div>

    <div class="stats">
      <div class="stat-card"><strong>{{ plots.length }}</strong><span>地块总数</span></div>
      <div class="stat-card"><strong>{{ totalArea }}亩</strong><span>总面积</span></div>
      <div class="stat-card"><strong>{{ irrigatedCount }}块</strong><span>灌溉覆盖</span></div>
    </div>

    <div class="content-card">
      <h3>地块列表</h3>
      <table>
        <thead><tr><th>地块名称</th><th>面积</th><th>土壤</th><th>作物</th><th>状态</th><th>灌溉</th></tr></thead>
        <tbody>
          <tr v-for="item in plots" :key="item.id">
            <td style="font-weight:600;color:#fff">{{ item.name }}</td>
            <td>{{ item.area }}亩</td>
            <td>{{ item.soil }}</td>
            <td>{{ item.crop }}</td>
            <td><span :class="'tag '+(item.status==='盛果期'||item.status==='采收中'?'g':'b')">{{ item.status }}</span></td>
            <td>{{ item.irrigation ? '✅' : '❌' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const plots = reactive([
  { id:1, name:'蜂糖李基地', area:100, soil:'褐土', crop:'蜂糖李', status:'盛果期', irrigation:true, date:'2023-03-15' },
  { id:2, name:'富硒黄桃园', area:150, soil:'潮土', crop:'富硒黄桃', status:'盛果期', irrigation:true, date:'2023-04-01' },
  { id:3, name:'阳光玫瑰葡萄园', area:50, soil:'褐土', crop:'阳光玫瑰葡萄', status:'生长期', irrigation:true, date:'2024-02-20' },
  { id:4, name:'智能温室大棚', area:100, soil:'基质', crop:'高架草莓/圣女果', status:'采收中', irrigation:true, date:'2024-09-01' },
  { id:5, name:'荷花种植区', area:50, soil:'水域', crop:'荷花/荷虾混养', status:'生长期', irrigation:true, date:'2024-05-01' },
  { id:6, name:'油葵种植区', area:150, soil:'潮土', crop:'油葵', status:'生长期', irrigation:false, date:'2025-03-01' }
])

const totalArea = computed(() => plots.reduce((s, p) => s + p.area, 0))
const irrigatedCount = computed(() => plots.filter(p => p.irrigation).length)
</script>

<style scoped>
.land-page { min-height: 100vh; padding: 24px; background: #06192b; color: #fff; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-header h2 { margin: 0 0 6px; }
.page-header p { margin: 0; color: #7f9bb0; }
.back-btn { padding: 9px 18px; color: #fff; background: #0d815d; border: 0; border-radius: 8px; cursor: pointer; }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 18px; }
.stat-card, .content-card { background: rgba(5,25,48,0.96); border: 1px solid rgba(190,214,234,0.65); border-radius: 10px; }
.stat-card { display: flex; flex-direction: column; padding: 20px; }
.stat-card strong { color: #18df91; font-size: 28px; }
.stat-card span { margin-top: 6px; color: #7f9bb0; }
.content-card { padding: 20px; }
.content-card h3 { margin-bottom: 14px; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 14px; text-align: left; border-bottom: 1px solid rgba(138,171,194,0.18); }
th { color: #9db9cc; }
.tag { display: inline-block; padding: 3px 10px; border-radius: 10px; font-size: 11px; font-weight: 600; }
.tag.g { background: rgba(22,210,150,.15); color: #16d296; }
.tag.b { background: rgba(40,199,111,.12); color: #28c76f; }
</style>
