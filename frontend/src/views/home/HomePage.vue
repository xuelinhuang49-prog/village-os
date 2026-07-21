<template>
  <div class="home">
    <!-- 导航栏 -->
    <nav class="navbar" :class="{ scrolled }" id="navbar">
      <div class="nav-container">
        <a href="#hero" class="nav-brand"><i class="fa-solid fa-leaf"></i><span>蓝匠数智数字乡村平台</span></a>
        <ul class="nav-menu">
          <li><a href="#hero" class="nav-link" :class="{ active: activeSection === 'hero' }"><i class="fa-solid fa-gauge-high"></i> 首页</a></li>
          <li><a href="#intro" class="nav-link" :class="{ active: activeSection === 'intro' }"><i class="fa-solid fa-layer-group"></i> 平台介绍</a></li>
          <li><a href="#arch" class="nav-link" :class="{ active: activeSection === 'arch' }"><i class="fa-solid fa-sitemap"></i> 架构设计</a></li>
          <li><a href="#features" class="nav-link" :class="{ active: activeSection === 'features' }"><i class="fa-solid fa-star"></i> 核心功能</a></li>
          <li><a href="#modules" class="nav-link" :class="{ active: activeSection === 'modules' }"><i class="fa-solid fa-table-cells-large"></i> 应用模块</a></li>
          <li><router-link to="/dashboard" class="nav-link nav-cta"><i class="fa-solid fa-arrow-right"></i> 进入平台</router-link></li>
        </ul>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero" id="hero">
      <div class="hero-bg-layer active" id="heroLayerA" :style="{ backgroundImage: 'url(' + heroImages[0] + ')' }"></div>
      <div class="hero-bg-layer" id="heroLayerB" :style="{ backgroundImage: 'url(' + heroImages[1 % heroImages.length] + ')' }"></div>
      <div class="hero-overlay"></div>
      <div class="hero-grid"></div>
      <div class="hero-scan"></div>
      <div class="hero-glow"></div>
      <div class="hero-dots" id="heroDots">
        <span v-for="(_, i) in heroImages" :key="i" :class="{ active: i === currentBgIndex }" @click="crossfade(i)"></span>
      </div>
      <div class="hero-particles" ref="particlesRef"></div>
      <div class="hero-content">
        <div class="hero-badge"><i class="fa-solid fa-gauge-high"></i> 中堰村 · 数字乡村一张图</div>
        <h1 class="hero-title"><span>1个平台</span> + 4大中心 + N个应用<br>打造数字乡村操作系统</h1>
        <p class="hero-subtitle">数据汇聚 · 智能决策 · 产业服务 · 基层治理</p>
        <p class="hero-desc">菜单式、模块化、可演进的一体化数字乡村综合服务平台</p>
        <div class="hero-buttons">
          <router-link to="/dashboard" class="hero-btn-primary"><i class="fa-solid fa-gauge-high"></i> 进入驾驶舱</router-link>
          <router-link to="/dashboard" class="hero-btn-outline"><i class="fa-solid fa-chart-pie"></i> 数据大屏</router-link>
          <a href="#intro" class="hero-btn-outline"><i class="fa-solid fa-circle-info"></i> 了解平台</a>
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat-card" v-for="stat in stats" :key="stat.label">
          <div class="stat-icon"><i :class="stat.icon"></i></div>
          <div class="stat-num">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
      <div class="hero-scroll-indicator">更 多 精 彩 <a href="#intro">下滑<span class="scroll-arrow"></span></a></div>
    </section>

    <!-- 平台介绍 -->
    <section class="section" id="intro">
      <div class="container">
        <div class="section-header"><span class="section-tag"><i class="fa-solid fa-layer-group"></i> 平台介绍</span><h2>一站式乡村综合服务平台</h2><p>紧紧围绕"三农"工作，将数字治理、数字兴业、数字惠民融合到一个平台，整合多系统功能，实现数据资源向乡村下沉。</p></div>
        <div class="intro-grid">
          <div class="intro-panel">
            <h3>"1+4+N"乡村综合服务体系</h3>
            <p>平台以统一数字底座为核心，通过数据中心、治理中心、产业中心、服务中心四大能力中台，支撑多个业务应用模块灵活组合。</p>
            <p>面向不同类型村庄，可按需配置智慧农业、电商溯源、村务治理、养老关怀、教育培训、GIS一张图等能力，持续改善农村人居环境、兴旺农村产业经济、便捷农民生产生活。</p>
          </div>
          <div class="visual-panel"><div><div class="big-icon"><i class="fa-solid fa-map-location-dot"></i></div><div class="visual-title">中堰村全域态势感知</div><div class="visual-desc">GIS数字孪生 · 52个监测节点 · 一屏观全村</div></div></div>
        </div>
      </div>
    </section>

    <!-- 平台架构 -->
    <section class="section white" id="arch">
      <div class="container">
        <div class="section-header"><span class="section-tag"><i class="fa-solid fa-sitemap"></i> 平台架构</span><h2>1个平台 + 4大中心 + N个应用</h2><p>统一底座、菜单模块、乡村大脑、持续运营，形成可复制、可扩展、可落地的数字乡村平台架构。</p></div>
        <div class="arch-box">
          <div class="arch-top"><i class="fa-solid fa-house-signal"></i> 数字乡村综合平台</div>
          <div class="arch-arrow">↓</div>
          <div class="arch-row">
            <div class="arch-card" v-for="center in centers" :key="center.title">
              <div class="card-icon">{{ center.icon }}</div>
              <h4>{{ center.title }}</h4>
              <p>{{ center.desc }}</p>
            </div>
          </div>
          <div class="arch-bottom">N个业务应用模块 — 菜单式自由组合，按村庄类型灵活配置</div>
        </div>
      </div>
    </section>

    <!-- 核心功能 -->
    <section class="section" id="features">
      <div class="container">
        <div class="section-header"><span class="section-tag"><i class="fa-solid fa-star"></i> 核心亮点</span><h2>六大创新能力</h2><p>以统一的卡片体系呈现能力模块，保持同一套政务驾驶舱视觉语言。</p></div>
        <div class="pillar-grid">
          <div class="pillar-card" v-for="pillar in pillars" :key="pillar.title">
            <div class="p-icon" :style="{ background: pillar.bg }"><i :class="pillar.icon"></i></div>
            <h4>{{ pillar.title }}</h4>
            <p class="p-desc">{{ pillar.desc }}</p>
            <div class="p-links">
              <span v-for="tag in pillar.tags" :key="tag.text" class="p-link" :class="{ highlight: tag.highlight }">{{ tag.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 应用模块 -->
    <section class="section white" id="modules">
      <div class="container">
        <div class="section-header"><span class="section-tag"><i class="fa-solid fa-table-cells-large"></i> 应用模块</span><h2>菜单式模块 · 按需组合</h2><p>采用统一的浅色卡片与模块布局，与整体设计语言保持一致。</p></div>
        <div class="modules-grid">
          <router-link v-for="mod in modules" :key="mod.title" :to="mod.to" class="module-block">
            <div class="mb-icon" :style="{ background: mod.iconBg, color: mod.iconColor }"><i :class="mod.icon"></i></div>
            <div><h4>{{ mod.title }}</h4><p>{{ mod.desc }}</p></div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 多端覆盖 -->
    <section class="section" id="terminal">
      <div class="container">
        <div class="section-header"><span class="section-tag"><i class="fa-solid fa-display"></i> 多端覆盖</span><h2>全场景数字化覆盖</h2><p>终端入口统一采用简洁的卡片风格，清晰、统一、同系统感更强。</p></div>
        <div class="capability-bar">
          <div class="cap-item" v-for="item in terminals" :key="item.title">
            <i :class="item.icon"></i>
            <div class="c-title">{{ item.title }}</div>
            <div class="c-desc">{{ item.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <h2>开启数字化乡村综合服务</h2>
      <p>从乡村驾驶舱开始，逐步构建完整的数字乡村操作系统</p>
      <router-link to="/dashboard" class="hero-btn-primary"><i class="fa-solid fa-arrow-right"></i> 立即进入平台</router-link>
    </section>

    <!-- Footer -->
    <footer class="footer"><p>&copy; 2026 蓝匠数智数字乡村平台 · 中堰村</p></footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// ===== 导航滚动效果 =====
const scrolled = ref(false)
const activeSection = ref('hero')

function onScroll() {
  scrolled.value = window.scrollY > 80

  // 检测当前所处的 section
  const sections = ['hero', 'intro', 'arch', 'features', 'modules']
  const scrollPos = window.scrollY + 120
  for (let i = sections.length - 1; i >= 0; i--) {
    const el = document.getElementById(sections[i])
    if (el && el.offsetTop <= scrollPos) {
      activeSection.value = sections[i]
      break
    }
  }
}

// ===== Hero 数据 =====
const heroImages = [
  'img-hero-1.jpg',
  'img-hero-2.jpg'
]

const currentBgIndex = ref(0)
let switching = false
let slideshowTimer = null
const INTERVAL = 5000

// ===== Hero 统计数据 =====
const stats = [
  { icon: 'fa-solid fa-users', value: '2910', label: '户籍人口' },
  { icon: 'fa-solid fa-coins', value: '300', label: '集体经济收入（万元）' },
  { icon: 'fa-solid fa-microchip', value: '80+', label: 'IoT设备接入（台）' },
  { icon: 'fa-solid fa-circle-check', value: '96%', label: '事件处理率' }
]

// ===== 四大中心 =====
const centers = [
  { icon: '📊', title: '数据中心', desc: '统一数据汇聚<br>86张表 · 14个业务域' },
  { icon: '🏛️', title: '治理中心', desc: '基层治理数字化<br>五维数据库 · 网格管理' },
  { icon: '🌾', title: '产业中心', desc: '智慧农业 + 电商<br>农作物 · 品牌溯源' },
  { icon: '🤝', title: '服务中心', desc: '便民惠民服务<br>医疗 · 养老 · 教育' }
]

// ===== 六大能力 =====
const pillars = [
  { icon: 'fa-solid fa-puzzle-piece', bg: 'linear-gradient(135deg,#043e6b,#065a9a)', title: '🧩 菜单式模块化', desc: '一个平台、多个模块，自由组合，适配苹果村、养殖村、文旅村等不同场景。', tags: [{ text: '核心创新', highlight: true }, { text: '灵活部署' }] },
  { icon: 'fa-solid fa-robot', bg: 'linear-gradient(135deg,#39cf7b,#2bb866)', title: '🤖 AI乡村助手', desc: '村干部可自然语言查询低保户数量、补贴发放、会议纪要等业务信息。', tags: [{ text: '智能问答', highlight: true }, { text: '辅助办公' }] },
  { icon: 'fa-solid fa-satellite-dish', bg: 'linear-gradient(135deg,#f5a623,#e74c3c)', title: '📡 物联网接入', desc: '统一接入气象站、土壤传感器、水质监测仪、监控摄像头等设备。', tags: [{ text: 'IoT实时', highlight: true }, { text: '52节点' }] },
  { icon: 'fa-solid fa-map', bg: 'linear-gradient(135deg,#8b5cf6,#4facfe)', title: '🗺️ GIS数字孪生', desc: '人、房、地、事、物五维数据库一张图管理，村庄态势一目了然。', tags: [{ text: 'GIS', highlight: true }, { text: '一张图' }] },
  { icon: 'fa-solid fa-triangle-exclamation', bg: 'linear-gradient(135deg,#e74c3c,#f093fb)', title: '⚠️ 智能预警系统', desc: '病虫害、极端天气、独居老人异常、水质超标等风险主动预警。', tags: [{ text: 'AI预警', highlight: true }, { text: '主动防控' }] },
  { icon: 'fa-solid fa-mobile-screen', bg: 'linear-gradient(135deg,#4facfe,#00f2fe)', title: '📱 多终端覆盖', desc: 'PC后台、大屏驾驶舱、微信小程序、触摸一体机覆盖不同使用场景。', tags: [{ text: '三端覆盖', highlight: true }, { text: '分级权限' }] }
]

// ===== 应用模块 =====
const modules = [
  { icon: 'fa-solid fa-chart-pie', iconBg: '#e8f1fb', iconColor: '#043e6b', title: '乡村驾驶舱', desc: '村情总览 · GIS数字孪生 · 实时监测 · 风险预警', to: '/dashboard' },
  { icon: 'fa-solid fa-wheat-awn', iconBg: '#e8f8ef', iconColor: '#1a8a4a', title: '智慧农业', desc: '地块管理 · 作物档案 · 农事记录 · 水肥管理', to: '/dashboard' },
  { icon: 'fa-solid fa-cart-shopping', iconBg: '#fff4df', iconColor: '#b66b00', title: '农产品电商', desc: '在线商城 · 直播带货 · 品牌溯源 · 物流追踪', to: '/dashboard' },
  { icon: 'fa-solid fa-building-columns', iconBg: '#f1eefe', iconColor: '#6d45c5', title: '村务治理', desc: '事件上报流转 · 网格管理 · 五维数据库', to: '/dashboard' },
  { icon: 'fa-solid fa-heart-pulse', iconBg: '#fdecec', iconColor: '#c0392b', title: '养老关怀', desc: '一键呼救 · 异常预警 · 健康档案 · 智能手环', to: '/dashboard' },
  { icon: 'fa-solid fa-graduation-cap', iconBg: '#e8f1fb', iconColor: '#065a9a', title: '农技培训', desc: '直播课堂 · 技能培训 · 政策宣传 · 专家答疑', to: '/dashboard' }
]

// ===== 多端覆盖 =====
const terminals = [
  { icon: 'fa-solid fa-desktop', title: 'PC管理后台', desc: '数据管理 / 事件处理' },
  { icon: 'fa-solid fa-tv', title: '大屏驾驶舱', desc: 'GIS一张图 / 实时态势' },
  { icon: 'fa-solid fa-mobile-screen', title: '微信小程序', desc: '办事 / 查询 / 上报' },
  { icon: 'fa-solid fa-tablet-screen-button', title: '触摸一体机', desc: '自助查询 / 政务办理' }
]

// ===== 粒子效果 =====
const particlesRef = ref(null)
function createParticles() {
  const container = particlesRef.value
  if (!container) return
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div')
    p.className = 'particle'
    const s = Math.random() * 4 + 2
    p.style.width = s + 'px'
    p.style.height = s + 'px'
    p.style.left = Math.random() * 100 + '%'
    p.style.animationDuration = (Math.random() * 12 + 8) + 's'
    p.style.animationDelay = (Math.random() * 10) + 's'
    container.appendChild(p)
  }
}

// ===== 背景轮播 =====
function crossfade(toIdx) {
  if (switching || toIdx === currentBgIndex.value) return
  switching = true

  const layerA = document.getElementById('heroLayerA')
  const layerB = document.getElementById('heroLayerB')
  const curEl = currentBgIndex.value === 0 ? layerA : layerB
  const nextEl = toIdx === 0 ? layerA : layerB

  // 设置下一张背景
  nextEl.style.backgroundImage = 'url(' + heroImages[toIdx] + ')'
  nextEl.style.filter = 'blur(3px)'
  nextEl.style.opacity = '0'
  nextEl.classList.remove('fading-out')
  nextEl.classList.add('active')
  void nextEl.offsetHeight

  let start = null
  const dur = 2000
  function anim(ts) {
    if (!start) start = ts
    const p = Math.min((ts - start) / dur, 1)
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
    curEl.style.opacity = (0.95 * (1 - ease)).toFixed(3)
    curEl.style.filter = 'blur(' + (3 * ease).toFixed(1) + 'px)'
    if (!curEl.classList.contains('fading-out')) curEl.classList.add('fading-out')
    nextEl.style.opacity = (0.95 * ease).toFixed(3)
    nextEl.style.filter = 'blur(' + (3 * (1 - ease)).toFixed(1) + 'px)'
    if (p < 1) {
      requestAnimationFrame(anim)
    } else {
      curEl.style.opacity = '0'
      curEl.classList.remove('active')
      curEl.style.animation = 'none'
      nextEl.style.opacity = '0.95'
      nextEl.style.filter = 'blur(0)'
      nextEl.style.animation = 'kenBurnsIn 12s cubic-bezier(.25,.1,.25,1) infinite alternate'
      currentBgIndex.value = toIdx
      switching = false
    }
  }
  requestAnimationFrame(anim)
}

function startSlideshow() {
  slideshowTimer = setInterval(() => {
    if (!switching) crossfade((currentBgIndex.value + 1) % heroImages.length)
  }, INTERVAL)
}

// ===== 生命周期 =====
onMounted(() => {
  window.addEventListener('scroll', onScroll)
  onScroll()
  createParticles()
  startSlideshow()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (slideshowTimer) clearInterval(slideshowTimer)
})
</script>

<style>
/* 全局样式 - 影响整个应用的 scoped 限制 */
.home {
  font-family: "PingFang SC","Microsoft YaHei","Helvetica Neue",Arial,sans-serif;
  background: #f5f7fa;
  color: #1e293b;
  line-height: 1.7;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
.home a { text-decoration: none; color: inherit; }
.home .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

/* 导航栏 */
.home .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; height: 80px;
  background: rgba(4,62,107,.96); backdrop-filter: blur(14px);
  box-shadow: 0 2px 16px rgba(4,62,107,.12); transition: .3s; }
.home .navbar.scrolled { height: 72px; background: rgba(4,62,107,.98); box-shadow: 0 4px 24px rgba(4,62,107,.18); }
.home .nav-container { max-width: 1280px; margin: 0 auto; height: 100%; display: flex;
  align-items: center; justify-content: space-between; padding: 0 28px; }
.home .nav-brand { display: flex; align-items: center; gap: 10px; color: #fff;
  font-size: 1.15rem; font-weight: 600; letter-spacing: 1px; }
.home .nav-brand i { font-size: 1.25rem; color: #39cf7b; }
.home .nav-menu { display: flex; align-items: center; gap: 4px; list-style: none; }
.home .nav-link { display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,.82);
  padding: 10px 13px; border-radius: 8px; font-size: .9rem; transition: .25s; }
.home .nav-link:hover, .home .nav-link.active { background: rgba(255,255,255,.12); color: #fff; }
.home .nav-link i { font-size: .9rem; }
.home .nav-cta { margin-left: 8px; background: #39cf7b; color: #fff !important;
  border-radius: 20px; padding: 9px 18px; box-shadow: 0 4px 16px rgba(57,207,123,.24); }
.home .nav-cta:hover { background: #2bb866; transform: translateY(-2px); }

/* Hero */
.home .hero { height: calc(100vh - 0px); min-height: 700px; position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center; text-align: center; background: #043e6b; }
.home .hero-bg-layer { position: absolute; inset: -5%; background-size: cover; background-position: center;
  will-change: transform,opacity,filter; backface-visibility: hidden; opacity: 0;
  filter: blur(3px); transition: opacity 2s ease, filter 2s ease; }
.home .hero-bg-layer.active { opacity: .95; filter: blur(0); z-index: 1;
  animation: kenBurnsIn 15s ease-in-out infinite alternate; }
.home .hero-bg-layer.fading-out { opacity: 0; filter: blur(5px); z-index: 0; animation: none; }
.home .hero-overlay { position: absolute; inset: 0;
  background: linear-gradient(135deg,rgba(4,62,107,.25),rgba(6,90,154,.18) 48%,rgba(10,22,40,.20)); z-index: 2; }
.home .hero-grid { position: absolute; inset: 0; z-index: 3;
  background-image: linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to bottom,rgba(0,0,0,.85),rgba(0,0,0,.15)); pointer-events: none; }
.home .hero-scan { position: absolute; top: 0; left: -100%; width: 60%; height: 100%; z-index: 3;
  background: linear-gradient(90deg,transparent,rgba(57,207,123,0.06),transparent);
  animation: scanLine 8s ease-in-out infinite; pointer-events: none; }
.home .hero-glow { position: absolute; width: 600px; height: 600px; right: 5%; top: 12%; z-index: 3;
  background: radial-gradient(circle,rgba(57,207,123,.18),transparent 65%);
  filter: blur(12px); animation: glowPulse 5s ease-in-out infinite alternate; }
.home .hero-dots { position: absolute; bottom: 90px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 10px; z-index: 6; }
.home .hero-dots span { width: 8px; height: 8px; border-radius: 50%;
  background: rgba(255,255,255,.25); cursor: pointer; transition: all .4s; }
.home .hero-dots span.active { background: #39cf7b; box-shadow: 0 0 10px rgba(57,207,123,.5);
  width: 24px; border-radius: 4px; }
.home .hero-particles { position: absolute; inset: 0; z-index: 3; pointer-events: none; }
.home .particle { position: absolute; bottom: -20px; border-radius: 50%;
  background: rgba(255,255,255,.55); animation: particleRise linear infinite; }
.home .particle:nth-child(odd) { background: rgba(57,207,123,.35); }

@keyframes kenBurnsIn {
  0% { transform: scale(1) translate(0,0); }
  33% { transform: scale(1.05) translate(-1%,-0.5%); }
  66% { transform: scale(1.10) translate(0.8%,0.3%); }
  100% { transform: scale(1.12) translate(-0.3%,0.6%); }
}
@keyframes scanLine { 0% { left: -100%; } 50% { left: 150%; } 100% { left: 150%; } }
@keyframes glowPulse { 0% { opacity: .6; transform: scale(1); } 100% { opacity: 1; transform: scale(1.15); } }
@keyframes particleRise {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  10% { opacity: .6; } 90% { opacity: .2; }
  100% { transform: translateY(-110vh) rotate(720deg); opacity: 0; }
}

.home .hero-content { position: relative; z-index: 5; max-width: 1000px; padding: 0 24px; color: #fff; }
.home .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 7px 18px;
  border-radius: 30px; background: rgba(57,207,123,.16); border: 1px solid rgba(57,207,123,.35);
  color: #baf7d1; font-size: .85rem; letter-spacing: 2px; margin-bottom: 20px; }
.home .hero-title { font-size: 3.15rem; line-height: 1.25; font-weight: 700;
  letter-spacing: 2px; margin-bottom: 16px; text-shadow: 0 6px 28px rgba(0,0,0,.28); }
.home .hero-title span { color: #39cf7b; }
.home .hero-subtitle { font-size: 1.2rem; color: rgba(255,255,255,.88); margin-bottom: 8px; }
.home .hero-desc { font-size: .98rem; color: rgba(230,245,255,.75); margin-bottom: 30px; }
.home .hero-buttons { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.home .hero-btn-primary, .home .hero-btn-outline { display: inline-flex; align-items: center;
  gap: 8px; padding: 12px 26px; border-radius: 28px; font-size: .96rem; transition: .3s; }
.home .hero-btn-primary { background: #39cf7b; color: #fff; box-shadow: 0 8px 28px rgba(57,207,123,.35); }
.home .hero-btn-primary:hover { background: #2bb866; transform: translateY(-3px);
  box-shadow: 0 14px 36px rgba(57,207,123,.42); }
.home .hero-btn-outline { border: 1px solid rgba(255,255,255,.42); color: #fff;
  background: rgba(255,255,255,.08); backdrop-filter: blur(8px); }
.home .hero-btn-outline:hover { background: rgba(255,255,255,.16); transform: translateY(-3px); }
.home .hero-stats { position: absolute; left: 50%; bottom: 54px; transform: translateX(-50%);
  z-index: 6; width: min(1120px,calc(100% - 40px)); display: grid;
  grid-template-columns: repeat(4,1fr); gap: 14px; }
.home .stat-card { background: rgba(255,255,255,.13); border: 1px solid rgba(255,255,255,.18);
  border-radius: 12px; padding: 18px 16px; color: #fff; backdrop-filter: blur(14px);
  box-shadow: 0 10px 28px rgba(0,0,0,.12); }
.home .stat-card .stat-icon { color: #39cf7b; font-size: 1.05rem; margin-bottom: 6px; }
.home .stat-num { font-size: 1.9rem; font-weight: 700; line-height: 1.1; }
.home .stat-label { font-size: .78rem; color: rgba(255,255,255,.72); margin-top: 6px; }
.home .hero-scroll-indicator { position: absolute; z-index: 6; left: 50%; bottom: 16px;
  transform: translateX(-50%); font-size: .75rem; color: rgba(255,255,255,.58); letter-spacing: 2px; }
.home .scroll-arrow { display: inline-block; width: 10px; height: 10px;
  border-right: 1px solid currentColor; border-bottom: 1px solid currentColor;
  transform: rotate(45deg); margin-left: 8px; animation: down 1.5s infinite; }
@keyframes down {
  0%,100% { transform: rotate(45deg) translate(0,0); }
  50% { transform: rotate(45deg) translate(4px,4px); }
}

/* 章节 */
.home .section { padding: 70px 0; }
.home .section.white { background: #fff; }
.home .section-header { text-align: center; margin-bottom: 36px; }
.home .section-header h2 { font-size: 1.8rem; color: #043e6b; font-weight: 500; margin-bottom: 10px; }
.home .section-header p { max-width: 760px; margin: 0 auto; color: #6b7a8d; font-size: .94rem; line-height: 1.9; }
.home .section-tag { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px;
  border-radius: 16px; background: #e8f8ef; color: #1a8a4a; font-size: .75rem;
  margin-bottom: 10px; border: 1px solid rgba(57,207,123,.25); }

/* 平台介绍 */
.home .intro-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 28px; align-items: stretch; }
.home .intro-panel, .home .visual-panel { background: #fff; border-radius: 12px;
  border: 1px solid #eef1f5; box-shadow: 0 2px 16px rgba(4,62,107,.05); padding: 30px; }
.home .intro-panel h3 { font-size: 1.4rem; color: #043e6b; margin-bottom: 14px; font-weight: 500; }
.home .intro-panel p { color: #6b7a8d; font-size: .92rem; line-height: 1.9; margin-bottom: 10px; }
.home .visual-panel { background: linear-gradient(135deg,#043e6b,#065a9a);
  display: flex; align-items: center; justify-content: center; text-align: center;
  color: #fff; min-height: 260px; position: relative; overflow: hidden; }
.home .visual-panel:before { content: ""; position: absolute; inset: 0;
  background-image: radial-gradient(rgba(255,255,255,.16) 1px,transparent 1px);
  background-size: 18px 18px; opacity: .4; }
.home .visual-panel>div { position: relative; }
.home .visual-panel .big-icon { font-size: 3.8rem; margin-bottom: 12px; color: #39cf7b; }
.home .visual-title { font-size: 1.15rem; letter-spacing: 2px; }
.home .visual-desc { font-size: .78rem; color: rgba(255,255,255,.68); margin-top: 8px; }

/* 核心功能卡片 */
.home .pillar-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
.home .pillar-card { background: #fff; border-radius: 12px; padding: 28px 18px 22px;
  text-align: center; box-shadow: 0 2px 16px rgba(4,62,107,.05); border: 1px solid #eef1f5;
  position: relative; overflow: hidden; transition: all .3s; color: inherit; display: block; }
.home .pillar-card:hover { transform: translateY(-6px); box-shadow: 0 12px 36px rgba(4,62,107,.12); }
.home .pillar-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; }
.home .pillar-card:nth-child(1)::before { background: #043e6b; }
.home .pillar-card:nth-child(2)::before { background: #39cf7b; }
.home .pillar-card:nth-child(3)::before { background: #f5a623; }
.home .pillar-card:nth-child(4)::before { background: #e74c3c; }
.home .pillar-card:nth-child(5)::before { background: #4facfe; }
.home .pillar-card:nth-child(6)::before { background: #8b5cf6; }
.home .p-icon { width: 56px; height: 56px; border-radius: 14px; display: flex;
  align-items: center; justify-content: center; margin: 0 auto 14px; font-size: 1.35rem; color: #fff; }
.home .pillar-card h4 { font-size: 1.05rem; color: #043e6b; margin-bottom: 8px; font-weight: 500; }
.home .p-desc { font-size: .82rem; color: #6b7a8d; line-height: 1.7; margin-bottom: 14px; }
.home .p-links { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.home .p-link { padding: 4px 10px; background: #f5f7fa; border-radius: 4px;
  font-size: .73rem; color: #6b7a8d; border: 1px solid #eef1f5; }
.home .p-link.highlight { background: #e8f8ef; color: #1a8a4a; border-color: #39cf7b; }

/* 架构 */
.home .arch-box { background: #fff; border-radius: 12px; border: 1px solid #eef1f5;
  box-shadow: 0 2px 16px rgba(4,62,107,.05); padding: 32px; }
.home .arch-top { max-width: 520px; margin: 0 auto 20px; background: #e8f8ef;
  border: 1px solid rgba(57,207,123,.32); border-radius: 10px; padding: 16px 22px;
  text-align: center; color: #1a8a4a; font-weight: 500; letter-spacing: 2px; }
.home .arch-arrow { text-align: center; color: #39cf7b; font-size: 1.45rem; margin: 4px 0 16px; }
.home .arch-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.home .arch-card { background: #f8fafc; border: 1px solid #eef1f5;
  border-radius: 12px; text-align: center; padding: 22px 12px; transition: .3s; }
.home .arch-card:hover { background: #fff; transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(4,62,107,.1); }
.home .card-icon { font-size: 2rem; margin-bottom: 8px; }
.home .arch-card h4 { font-size: .98rem; color: #043e6b; font-weight: 500; margin-bottom: 6px; }
.home .arch-card p { font-size: .76rem; color: #6b7a8d; line-height: 1.6; }
.home .arch-bottom { margin: 18px auto 0; max-width: 760px; background: #f5f7fa;
  border: 1px dashed #d8e1ea; border-radius: 10px; padding: 14px 18px;
  text-align: center; color: #6b7a8d; font-size: .88rem; }

/* 模块 */
.home .modules-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
.home .module-block { background: #fff; border-radius: 12px; padding: 22px;
  display: flex; gap: 14px; align-items: flex-start; box-shadow: 0 2px 16px rgba(4,62,107,.05);
  border: 1px solid #eef1f5; transition: .3s; color: inherit; }
.home .module-block:hover { transform: translateY(-6px); box-shadow: 0 12px 36px rgba(4,62,107,.12); }
.home .mb-icon { width: 48px; height: 48px; border-radius: 12px; display: flex;
  align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.35rem; }
.home .module-block h4 { font-size: 1rem; color: #043e6b; margin-bottom: 4px; font-weight: 500; }
.home .module-block p { font-size: .8rem; color: #6b7a8d; line-height: 1.6; }
.home .capability-bar { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.home .cap-item { background: #fff; border-radius: 10px; padding: 22px 14px; text-align: center;
  box-shadow: 0 2px 12px rgba(4,62,107,.04); border: 1px solid #eef1f5; transition: .3s; }
.home .cap-item:hover { transform: translateY(-5px); box-shadow: 0 10px 28px rgba(4,62,107,.1); }
.home .cap-item i { font-size: 1.55rem; color: #39cf7b; margin-bottom: 8px; display: block; }
.home .c-title { font-size: .9rem; color: #043e6b; font-weight: 500; }
.home .c-desc { font-size: .75rem; color: #6b7a8d; margin-top: 4px; }

.home .cta-section { padding: 72px 20px; text-align: center;
  background: linear-gradient(135deg,rgba(4,62,107,.94),rgba(6,90,154,.9)); color: #fff; }
.home .cta-section h2 { font-size: 1.8rem; font-weight: 500; margin-bottom: 10px; }
.home .cta-section p { color: rgba(255,255,255,.78); margin-bottom: 22px; }
.home .footer { background: #043e6b; color: rgba(255,255,255,.68);
  padding: 42px 20px; text-align: center; font-size: .82rem; }
.home .footer a { color: #baf7d1; }

@media(max-width:1024px) {
  .home .nav-menu { display: none; }
  .home .hero-title { font-size: 2.3rem; }
  .home .hero-stats { grid-template-columns: repeat(2,1fr); bottom: 32px; }
  .home .intro-grid, .home .pillar-grid, .home .modules-grid { grid-template-columns: 1fr 1fr; }
  .home .arch-row, .home .capability-bar { grid-template-columns: repeat(2,1fr); }
  .home .section { padding: 56px 0; }
}
@media(max-width:640px) {
  .home .navbar { height: 68px; }
  .home .nav-container { padding: 0 16px; }
  .home .hero { min-height: 760px; }
  .home .hero-title { font-size: 1.7rem; }
  .home .hero-subtitle { font-size: 1rem; }
  .home .hero-stats { position: relative; left: auto; bottom: auto; transform: none;
    width: calc(100% - 32px); margin: 26px auto 0; grid-template-columns: 1fr 1fr; }
  .home .hero-content { margin-top: 50px; }
  .home .intro-grid, .home .pillar-grid, .home .modules-grid,
  .home .arch-row, .home .capability-bar { grid-template-columns: 1fr; }
  .home .section-header h2 { font-size: 1.45rem; }
  .home .stat-num { font-size: 1.45rem; }
}
</style>
