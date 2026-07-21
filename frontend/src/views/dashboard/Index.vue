<template>
  <div class="dashboard">
    <Header />
    <div class="main">
      <aside class="side-l"><LeftPanel /></aside>
      <main class="map-col"><GisMap /></main>
      <aside class="side-r"><RightPanel /></aside>
    </div>
    <BottomTicker />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useGisStore } from '@/store/gisStore'
import Header from './components/Header.vue'
import LeftPanel from './components/LeftPanel.vue'
import GisMap from './components/GisMap.vue'
import RightPanel from './components/RightPanel.vue'
import BottomTicker from './components/BottomTicker.vue'

const store = useGisStore()
onMounted(() => store.loadPoints())
</script>

<style>
@import '@/styles/dashboard.css';
</style>

<style scoped>
.dashboard { width: 100vw; height: 100vh; display: flex; flex-direction: column; overflow: hidden;
  font-family: 'Microsoft YaHei','PingFang SC',sans-serif; background: #060e1a; color: #e0e6f0; }
.main { flex: 1; display: flex; padding: 6px; gap: 6px; overflow: hidden; min-height: 0; }
.side-l { width: 320px; flex-shrink: 0; overflow: hidden; }
.map-col { flex: 1; border: 1px solid rgba(0,180,255,.08); border-radius: 4px; overflow: hidden; min-width: 0; }
.side-r { width: 300px; flex-shrink: 0; overflow-y: auto;
  background: rgba(10,22,42,.7); border: 1px solid rgba(0,180,255,.08); border-radius: 4px; }
</style>
