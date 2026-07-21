<template>
  <div class="bt">
    <span class="bt-live">● LIVE</span>
    <div class="bt-track"><div class="bt-scroll">
      <span v-for="(e,i) in msgs" :key="i">{{ e.msg }} <i>|</i></span>
    </div></div>
  </div>
</template>

<script setup>
const msgs = [
  { msg: '智慧大棚传感器正常 温度28.5°C 湿度65%' },
  { msg: '笃敬产业园今日接待12人 设备运行正常' },
  { msg: '荷虾混养区pH7.8 略高于标准 已通知管理员' },
  { msg: '智慧市集今日交易103笔 总额¥3,650' },
  { msg: '气象站：未来3小时晴 气温26-32°C' },
  { msg: '人才公寓入住率66.7% 空余16间' },
  { msg: '半日闲舍今日入住率100% 评分4.8' },
  { msg: '设备巡检完成 4台IoT全部在线' }
]
</script>

<style scoped>
.bt { height: 34px; display: flex; align-items: center; gap: 12px; padding: 0 16px;
  background: rgba(10,22,40,.95); border-top: 1px solid rgba(0,180,255,.08); flex-shrink: 0; }
.bt-live { color: #00ff88; font-size: 11px; font-weight: 600; flex-shrink: 0; animation: pulse-glow 2s infinite; }
.bt-track { flex: 1; overflow: hidden; white-space: nowrap; }
.bt-scroll { display: inline-block; animation: scroll-left 30s linear infinite; font-size: 11px; color: #64748b; }
.bt-scroll span { margin-right: 24px; }
.bt-scroll i { color: #4a5568; margin-left: 24px; }
@keyframes scroll-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
</style>
