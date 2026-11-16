<template>
  <div class="dashboard-shell" :class="{ 'dashboard-fullscreen': isFullscreen }" :style="{ '--sidebar-w': sidebarCollapsed && !isMobile ? '0px' : '220px' }">
    <!-- Particles Background -->
    <canvas ref="particlesCvs" class="particles-bg" v-show="currentPage !== 'governance' && currentPage !== 'settings' && currentPage !== 'industry' && currentPage !== 'service' && currentPage !== 'home' && currentPage !== 'myfarm'"></canvas>

    <!-- Overlay (mobile) -->
    <div class="overlay" :class="{ show: sidebarOpen }" @click="closeSidebar"></div>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed && !isMobile, open: sidebarOpen }">
      <div class="side-hd">
        <div class="side-logo">🏘️</div>
        <span class="side-title">蓝匠数智数字乡村平台</span>
      </div>
      <nav class="side-nav">
        <!-- 村民端导航：我的视角（办我的事、看我的东西） -->
        <template v-if="isVillager">
          <div class="nav-item" :class="{ active: currentPage === 'home' }" @click="switchPage('home')">
            <span class="ni-icon">🏠</span>我的工作台
          </div>
          <div class="nav-item" :class="{ active: currentPage === 'myfarm' }" @click="switchPage('myfarm')">
            <span class="ni-icon">🌾</span>我的产业
          </div>
          <div class="nav-item" :class="{ active: currentPage === 'sell' }" @click="switchPage('sell')">
            <span class="ni-icon">🛒</span>我要卖
          </div>
          <div class="nav-item" :class="{ active: currentPage === 'service' }" @click="switchPage('service')">
            <span class="ni-icon">🤝</span>办事大厅
          </div>
          <div class="nav-item" :class="{ active: currentPage === 'leadership' }" @click="switchPage('leadership')">
            <span class="ni-icon">👥</span>找谁办事
          </div>
          <div class="nav-divider"></div>
          <div class="nav-item" :class="{ active: currentPage === 'data' }" @click="switchPage('data')">
            <span class="ni-icon">🗄️</span>我的数据
          </div>
          <div class="nav-divider"></div>
          <div class="nav-item" :class="{ active: currentPage === 'settings' }" @click="switchPage('settings')">
            <span class="ni-icon">⚙️</span>{{ settingsNavLabel }}
          </div>
        </template>

        <!-- 经营主体导航：我的经营视角（产品 + 办事 + 设置） -->
        <template v-else-if="isBusinessEntity">
          <div class="nav-item" :class="{ active: currentPage === 'business' }" @click="switchPage('business')">
            <span class="ni-icon">🏪</span>经营主体工作台
          </div>
          <div class="nav-item" :class="{ active: currentPage === 'industry' }" @click="switchPage('industry')">
            <span class="ni-icon">🏭</span>产业中心
          </div>
          <div class="nav-item" :class="{ active: currentPage === 'service' }" @click="switchPage('service')">
            <span class="ni-icon">🤝</span>办事大厅
          </div>
          <div class="nav-divider"></div>
          <div class="nav-item" :class="{ active: currentPage === 'settings' }" @click="switchPage('settings')">
            <span class="ni-icon">⚙️</span>{{ settingsNavLabel }}
          </div>
        </template>

        <!-- 管理端导航：全村视角（台账 + 审批 + 系统管理） -->
        <template v-else>
          <div class="nav-item" :class="{ active: currentPage === 'dashboard' }" @click="switchPage('dashboard')">
            <span class="ni-icon">📊</span>乡村驾驶舱
          </div>
          <div class="nav-divider"></div>
          <div class="nav-item" :class="{ active: currentPage === 'industry' }" @click="switchPage('industry')">
            <span class="ni-icon">🏭</span>数字产业中心
          </div>
          <div class="nav-item" :class="{ active: currentPage === 'review' }" @click="switchPage('review')">
            <span class="ni-icon">🛒</span>产品审核<span v-if="reviewPendingCount > 0" class="nav-badge">{{ reviewPendingCount }}</span>
          </div>
          <div class="nav-item" :class="{ active: currentPage === 'service' }" @click="switchPage('service')">
            <span class="ni-icon">🤝</span>数字服务中心
          </div>
          <div class="nav-item" :class="{ active: currentPage === 'governance' }" @click="switchPage('governance')">
            <span class="ni-icon">🏛️</span>数字治理中心
          </div>
          <div class="nav-item" :class="{ active: currentPage === 'ecology' }" @click="switchPage('ecology')">
            <span class="ni-icon">🌿</span>生态治理中心
          </div>
          <div class="nav-item" :class="{ active: currentPage === 'leadership' }" @click="switchPage('leadership')">
            <span class="ni-icon">👥</span>村委班子
          </div>
          <div class="nav-divider"></div>
          <div class="nav-item" :class="{ active: currentPage === 'data' }" @click="switchPage('data')">
            <span class="ni-icon">🗄️</span>数据中心
          </div>
          <div class="nav-divider"></div>
          <div class="nav-tree-group">
            <div class="nav-item nav-tree-parent" :class="{ open: treeOpen, active: currentPage === 'device' }" @click="openDeviceOverview()">
              <span class="ni-icon">📶</span>设备中心<span class="nav-arrow">▶</span>
            </div>
            <div class="nav-tree-children" :class="{ open: treeOpen }">
              <div class="nav-sub" :class="{ active: currentPage === 'device' }" @click="switchPage('device')">
                <span class="ni-icon">⚪</span>设备总览
              </div>
              <div class="nav-sub" :class="{ active: currentPage === 'iot' }" @click="switchPage('iot')">
                <span class="ni-icon">🔵</span>IoT设备感知<span class="nav-badge">82</span>
              </div>
              <div class="nav-sub" :class="{ active: currentPage === 'monitor' }" @click="switchPage('monitor')">
                <span class="ni-icon">🟢</span>视频监控中心<span class="nav-badge">32</span>
              </div>
            </div>
          </div>
          <div class="nav-divider"></div>
          <div class="nav-item" :class="{ active: currentPage === 'settings' }" @click="switchPage('settings')">
            <span class="ni-icon">⚙️</span>{{ settingsNavLabel }}
          </div>
        </template>
      </nav>
      <div class="side-ft" v-show="!isFullscreen">
        <div class="side-user">
          <div class="side-av" :style="{ background: sideUser.color }">{{ sideUser.initial }}</div>
          <div>
            <div class="side-un">{{ sideUser.name }}</div>
            <div class="side-ur">{{ sideUser.title }}</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Area -->
    <div class="main-wrap" :class="{ expanded: sidebarCollapsed && !isMobile }">
      <!-- Header -->
      <header class="header">
        <div class="hdr-left">
          <button class="btn-icon" @click="toggleSidebar" title="菜单">☰</button>
          <router-link to="/" class="hdr-link">🏠 返回首页</router-link>
          <a href="#" class="hdr-link" @click.prevent="!isVillager ? switchPage('settings') : router.push('/admin')">⚙️ 管理</a>
          <div class="breadcrumb"> / <span>{{ pageTitle }}</span></div>
        </div>
        <div class="hdr-right">
          <button v-if="isAdmin" class="btn-icon" title="退出管理员登录" @click="logoutAdmin">🚪</button>
          <button v-if="isVillager" class="btn-icon" title="退出登录" @click="logoutFarmer">🚪</button>
          <button v-if="isBusinessEntity" class="btn-icon" title="退出经营主体登录" @click="logoutBusinessEntity">🚪</button>
          <button class="btn-icon btn-bell" title="消息" @click="toast('您有3条新消息', 'info')">🔔</button>
          <button class="btn-icon btn-fs" :title="isFullscreen ? '退出全屏' : '全屏'" @click="toggleFullscreen">{{ isFullscreen ? '⛶ 退出全屏' : '⛶ 全屏' }}</button>
          <div class="hdr-time">
            <div class="tm">{{ clockTime }}</div>
            <div>{{ clockDate }}</div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="content-area" :style="{ background: (currentPage === 'settings' || currentPage === 'industry' || currentPage === 'service' || currentPage === 'home' || currentPage === 'myfarm') ? '#F5F7FA' : (['governance','data','device','iot','monitor'].includes(currentPage)) ? '#F4F7FA' : '' }" ref="contentArea">

        <!-- ==================== PAGE: Farmer Home（我的工作台 · 村民端） ==================== -->
        <div v-show="currentPage === 'home'" class="page-content gov-theme farmer-home" key="home">
          <div style="max-width:1120px;margin:0 auto;padding:20px 24px">
            <!-- 问候 -->
            <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
              <div style="width:54px;height:54px;border-radius:14px;background:linear-gradient(135deg,#39D98A,#28C76F);display:flex;align-items:center;justify-content:center;font-size:26px;color:#fff;flex-shrink:0">{{ currentUser.name.charAt(0) }}</div>
              <div>
                <div style="font-size:20px;font-weight:700;color:#1F2D3D">你好，{{ currentUser.name }}</div>
                <div style="font-size:13px;color:#66788A;margin-top:3px">{{ currentUser.village }} · {{ currentUser.zone }} · {{ currentUser.grid }}</div>
              </div>
            </div>

            <!-- 我的待办 -->
            <div class="panel" style="margin-bottom:14px">
              <div class="panel-hd"><span class="hd-bar"></span>📌 我的待办</div>
              <div class="panel-bd" style="padding:8px 16px">
                <div v-for="t in farmerTodos" :key="t.title" style="display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid #EBEFF4">
                  <span style="width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;background:rgba(34,181,115,.10);font-size:17px;flex-shrink:0">{{ t.icon }}</span>
                  <div style="flex:1;min-width:0">
                    <div style="font-size:14px;color:#1F2D3D;font-weight:600">{{ t.title }}</div>
                    <div style="font-size:12px;color:#66788A;margin-top:2px">{{ t.desc }}</div>
                  </div>
                  <button class="btn btn-outline btn-sm" style="flex-shrink:0" @click="t.action">{{ t.actionLabel }}</button>
                </div>
              </div>
            </div>

            <!-- 通知公告 -->
            <div class="panel" style="margin-bottom:14px">
              <div class="panel-hd"><span class="hd-bar y"></span>📢 通知公告<span class="extra" style="cursor:pointer;color:#19B98A;font-size:15px" @click="showVillageNotices()">查看全部 ›</span></div>
              <div class="panel-bd" style="padding:8px">
                <div v-for="n in villageNotices.slice(0,3)" :key="n.id" class="gov-news-item" @click="showNoticeDetail(n)">
                  <div class="gni-left"><span class="gni-icon-big">{{ n.icon }}</span></div>
                  <div class="gni-mid">
                    <div class="gni-loc">{{ n.title }}<span v-if="n.tag" style="display:inline-block;padding:2px 8px;border-radius:6px;font-size:14px;font-weight:600;margin-left:5px;color:#E05252;background:rgba(224,82,82,0.10);vertical-align:middle">{{ n.tag }}</span></div>
                    <div class="gni-time">{{ n.date }} · {{ n.source }}</div>
                  </div>
                  <div class="gni-right"><span style="font-size:15px;color:#19B98A">查看 →</span></div>
                </div>
              </div>
            </div>

            <!-- 我的概览 -->
            <div class="module-grid" style="margin-bottom:14px">
              <div class="module-card" v-for="c in farmerOverview" :key="c.label" @click="c.action">
                <div class="mc-icon" :style="{background:c.iconBg}">{{ c.icon }}</div>
                <h4>{{ c.value }}</h4><p>{{ c.label }}</p>
                <span class="mc-arrow">→</span>
              </div>
            </div>

            <!-- 我要办事 -->
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar g"></span>⚡ 我要办事</div>
              <div class="panel-bd" style="padding:16px;display:flex;gap:10px;flex-wrap:wrap">
                <button class="btn btn-primary" @click="openServiceTab('subsidy')">🧾 申请补贴</button>
                <button class="btn btn-outline" @click="openServiceTab('insurance')">💊 医保报销</button>
                <button class="btn btn-outline" @click="openServiceTab('training')">📚 预约培训</button>
                <button class="btn btn-outline" @click="switchPage('leadership')">📞 找谁办事</button>
                <button class="btn btn-outline" @click="switchPage('data')">🗄️ 我的数据</button>
                <button class="btn btn-outline" @click="showEcoReportForm()">📷 环境上报</button>
                <button class="btn btn-outline" @click="showGarbageService()">🗑 垃圾清运</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== PAGE: 经营主体 · 工作台（我的产品） ==================== -->
        <div v-show="currentPage === 'business'" class="page-content gov-theme farmer-home" key="business">
          <div style="max-width:1120px;margin:0 auto;padding:20px 24px">
            <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
              <div style="width:54px;height:54px;border-radius:14px;background:linear-gradient(135deg,#9B59B6,#7D3C98);display:flex;align-items:center;justify-content:center;font-size:26px;color:#fff;flex-shrink:0">{{ currentUser.name.charAt(0) }}</div>
              <div>
                <div style="font-size:20px;font-weight:700;color:#1F2D3D">{{ currentUser.name }} · 经营主体工作台</div>
                <div style="font-size:13px;color:#66788A;margin-top:3px">{{ currentUser.org || '经营主体' }} · 仅展示本主体自己的产品数据</div>
              </div>
            </div>

            <div class="module-grid" style="margin-bottom:14px">
              <div class="module-card">
                <div class="mc-icon" style="background:rgba(155,89,182,.14)">📦</div>
                <h4>{{ bizProducts.length }}</h4><p>在售产品</p>
              </div>
              <div class="module-card">
                <div class="mc-icon" style="background:rgba(34,181,115,.14)">📊</div>
                <h4>{{ bizTotalStock }}</h4><p>总库存</p>
              </div>
              <div class="module-card">
                <div class="mc-icon" style="background:rgba(248,180,0,.14)">💰</div>
                <h4>{{ bizTotalSales }}</h4><p>累计销量</p>
              </div>
            </div>

            <div class="panel">
              <div class="panel-hd"><span class="hd-bar"></span>📦 我的产品<span class="extra" style="cursor:pointer;color:#9B59B6;font-size:15px" @click="bizAddOpen = !bizAddOpen">{{ bizAddOpen ? '收起' : '+ 添加产品' }}</span></div>
              <div class="panel-bd" style="padding:16px">
                <div v-if="bizAddOpen" style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px;padding:14px;background:#F8F6FB;border-radius:10px">
                  <input v-model="bizForm.name" placeholder="产品名称" style="flex:2;min-width:160px;padding:9px 12px;border:1px solid #E3EAF0;border-radius:8px;font-size:13px">
                  <input v-model="bizForm.category" placeholder="类别（如 水果类）" style="flex:1;min-width:120px;padding:9px 12px;border:1px solid #E3EAF0;border-radius:8px;font-size:13px">
                  <input v-model.number="bizForm.price" type="number" placeholder="单价" style="flex:1;min-width:90px;padding:9px 12px;border:1px solid #E3EAF0;border-radius:8px;font-size:13px">
                  <input v-model="bizForm.unit" placeholder="单位（斤/箱）" style="flex:1;min-width:100px;padding:9px 12px;border:1px solid #E3EAF0;border-radius:8px;font-size:13px">
                  <input v-model.number="bizForm.stock" type="number" placeholder="库存" style="flex:1;min-width:90px;padding:9px 12px;border:1px solid #E3EAF0;border-radius:8px;font-size:13px">
                  <button class="btn btn-primary btn-sm" @click="submitBizProduct">保存</button>
                </div>
                <table style="width:100%;border-collapse:collapse;font-size:13px">
                  <thead><tr style="color:#66788A;text-align:left;border-bottom:1px solid #EBEFF4">
                    <th style="padding:8px">产品</th><th>类别</th><th>单价</th><th>库存</th><th>销量</th><th>状态</th><th style="text-align:right">操作</th>
                  </tr></thead>
                  <tbody>
                    <tr v-for="p in bizProducts" :key="p.id" style="border-bottom:1px solid #F1F4F8">
                      <td style="padding:10px 8px;font-weight:600;color:#1F2D3D">{{ p.name }}</td>
                      <td>{{ p.category }}</td>
                      <td>¥{{ p.price }}<span style="color:#999;font-size:11px">/{{ p.unit }}</span></td>
                      <td>{{ p.stock }}</td>
                      <td>{{ p.sales }}</td>
                      <td><span style="padding:2px 8px;border-radius:6px;font-size:12px;color:#19B98A;background:rgba(25,185,138,.12)">{{ p.status }}</span></td>
                      <td style="padding:10px 8px;text-align:right"><button class="btn btn-outline btn-sm" @click="removeBizProduct(p.id)">删除</button></td>
                    </tr>
                    <tr v-if="bizProducts.length === 0"><td colspan="7" style="padding:24px;text-align:center;color:#999">暂无产品，点击右上角「添加产品」录入</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== PAGE: Farmer · 我要卖（我的农产品） ==================== -->
        <div v-show="currentPage === 'sell'" class="page-content gov-theme farmer-home" key="sell">
          <div style="max-width:1120px;margin:0 auto;padding:20px 24px">
            <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
              <div style="width:54px;height:54px;border-radius:14px;background:linear-gradient(135deg,#22B573,#17965C);display:flex;align-items:center;justify-content:center;font-size:26px;color:#fff;flex-shrink:0">{{ currentUser.name.charAt(0) }}</div>
              <div>
                <div style="font-size:20px;font-weight:700;color:#1F2D3D">{{ currentUser.name }} · 我要卖</div>
                <div style="font-size:13px;color:#66788A;margin-top:3px">把自家农产品挂上平台卖，只展示和管理自己挂售的货</div>
              </div>
            </div>

            <div class="module-grid" style="margin-bottom:14px">
              <div class="module-card">
                <div class="mc-icon" style="background:rgba(34,181,115,.14)">🛒</div>
                <h4>{{ sellProducts.length }}</h4><p>在售产品</p>
              </div>
              <div class="module-card">
                <div class="mc-icon" style="background:rgba(14,165,233,.14)">📊</div>
                <h4>{{ sellTotalStock }}</h4><p>总库存</p>
              </div>
              <div class="module-card">
                <div class="mc-icon" style="background:rgba(248,180,0,.14)">💰</div>
                <h4>{{ sellTotalSales }}</h4><p>累计售出</p>
              </div>
            </div>

            <div class="panel">
              <div class="panel-hd"><span class="hd-bar"></span>🛒 我挂售的农产品<button class="btn btn-primary btn-sm" style="margin-left:auto" @click="sellAddOpen = !sellAddOpen">{{ sellAddOpen ? '收起' : '＋ 上架产品' }}</button></div>
              <div class="panel-bd" style="padding:16px">
                <div style="font-size:12px;color:#8A6D3B;margin-bottom:12px;padding:10px 12px;background:#FFF8E6;border:1px solid #F5E6C8;border-radius:8px">📌 上架流程：提交产品 → 村干部审核通过 → 正式对外销售。审核结果会显示在下方状态里。</div>
                <div v-if="sellAddOpen" style="margin-bottom:16px;padding:18px;background:#F0FAF4;border:1px solid #D6EFE2;border-radius:12px">
                  <div style="font-weight:700;color:#1F2D3D;margin-bottom:14px;font-size:14px">🌱 填写产品信息（带 <em style="color:#F56C6C;font-style:normal">*</em> 必填，能点选就不打字）</div>
                  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px">
                    <label style="display:flex;flex-direction:column;gap:6px;font-size:12px;color:#66788A;font-weight:600">产品名称 <em style="color:#F56C6C;font-style:normal">*</em>
                      <input v-model="sellForm.name" placeholder="如：农家土鸡蛋" style="padding:10px 12px;border:1px solid #D9E1EA;border-radius:8px;font-size:14px;font-weight:400;color:#1F2D3D">
                    </label>
                    <label style="display:flex;flex-direction:column;gap:6px;font-size:12px;color:#66788A;font-weight:600">类别 <em style="color:#F56C6C;font-style:normal">*</em>
                      <select v-model="sellForm.category" style="padding:10px 12px;border:1px solid #D9E1EA;border-radius:8px;font-size:14px;font-weight:400;color:#1F2D3D;background:#fff">
                        <option value="" disabled>请选择类别</option>
                        <option v-for="c in sellCategories" :key="c" :value="c">{{ c }}</option>
                      </select>
                    </label>
                    <label style="display:flex;flex-direction:column;gap:6px;font-size:12px;color:#66788A;font-weight:600">单价（元） <em style="color:#F56C6C;font-style:normal">*</em>
                      <input v-model.number="sellForm.price" type="number" min="0" placeholder="如 35" style="padding:10px 12px;border:1px solid #D9E1EA;border-radius:8px;font-size:14px;font-weight:400;color:#1F2D3D">
                    </label>
                    <label style="display:flex;flex-direction:column;gap:6px;font-size:12px;color:#66788A;font-weight:600">单位 <em style="color:#F56C6C;font-style:normal">*</em>
                      <select v-model="sellForm.unit" style="padding:10px 12px;border:1px solid #D9E1EA;border-radius:8px;font-size:14px;font-weight:400;color:#1F2D3D;background:#fff">
                        <option value="" disabled>请选择单位</option>
                        <option v-for="u in sellUnits" :key="u" :value="u">{{ u }}</option>
                      </select>
                    </label>
                    <label style="display:flex;flex-direction:column;gap:6px;font-size:12px;color:#66788A;font-weight:600">库存数量 <em style="color:#F56C6C;font-style:normal">*</em>
                      <input v-model.number="sellForm.stock" type="number" min="0" placeholder="如 50" style="padding:10px 12px;border:1px solid #D9E1EA;border-radius:8px;font-size:14px;font-weight:400;color:#1F2D3D">
                    </label>
                    <label style="display:flex;flex-direction:column;gap:6px;font-size:12px;color:#66788A;font-weight:600">产品说明 <em style="color:#C0C8D1;font-style:normal;font-weight:400">（选填）</em>
                      <input v-model="sellForm.description" placeholder="如：自家散养、当天捡蛋" style="padding:10px 12px;border:1px solid #D9E1EA;border-radius:8px;font-size:14px;font-weight:400;color:#1F2D3D">
                    </label>
                  </div>
                  <div style="margin-top:16px;display:flex;gap:10px;justify-content:flex-end">
                    <button class="btn btn-outline" @click="sellAddOpen=false">取消</button>
                    <button class="btn btn-primary" style="min-width:132px;font-size:14px;padding:10px 18px" @click="submitSellProduct">📤 提交审核</button>
                  </div>
                </div>
                <table style="width:100%;border-collapse:collapse;font-size:13px">
                  <thead><tr style="color:#66788A;text-align:left;border-bottom:1px solid #EBEFF4">
                    <th style="padding:8px">产品</th><th>类别</th><th>单价</th><th>库存</th><th>售出</th><th>状态</th><th style="text-align:right">操作</th>
                  </tr></thead>
                  <tbody>
                    <tr v-for="p in sellProducts" :key="p.id" style="border-bottom:1px solid #F1F4F8">
                      <td style="padding:10px 8px;font-weight:600;color:#1F2D3D">{{ p.name }}<div v-if="p.description" style="font-weight:400;color:#98A2B3;font-size:11px;margin-top:2px">{{ p.description }}</div></td>
                      <td>{{ p.category }}</td>
                      <td>¥{{ p.price }}<span style="color:#999;font-size:11px">/{{ p.unit }}</span></td>
                      <td>{{ p.stock }}</td>
                      <td>{{ p.sales }}</td>
                      <td><span :style="sellStatusStyle(p.status)">{{ p.status }}</span><div v-if="p.status === '已驳回' && p.reviewNote" style="font-size:11px;color:#E05252;margin-top:3px">原因：{{ p.reviewNote }}</div></td>
                      <td style="padding:10px 8px;text-align:right"><button class="btn btn-outline btn-sm" @click="removeSellProduct(p.id)">下架</button></td>
                    </tr>
                    <tr v-if="sellProducts.length === 0"><td colspan="7" style="padding:24px;text-align:center;color:#999">还没有在卖的产品，点右上角 <button class="btn btn-primary btn-sm" style="vertical-align:middle" @click="sellAddOpen = true">＋ 上架产品</button> 开始卖货</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== PAGE: Admin · 产品审核（村民上架审批） ==================== -->
        <div v-show="currentPage === 'review'" class="page-content gov-theme" key="review">
          <div style="padding:20px;max-width:1200px;margin:0 auto">
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar"></span>🛒 村民上架审核<span style="margin-left:auto;font-size:12px;color:#66788A;font-weight:400">待审核 {{ reviewProducts.length }} 条</span></div>
              <div class="panel-bd" style="padding:16px">
                <div style="font-size:12px;color:#66788A;margin-bottom:14px;padding:10px 12px;background:#F0FAF4;border-radius:8px">💡 村民提交的农产品先到这里，<b>审核通过</b>后才会对外销售；<b>驳回</b>需填写原因，村民端能看到。</div>
                <table style="width:100%;border-collapse:collapse;font-size:13px">
                  <thead><tr style="color:#66788A;text-align:left;border-bottom:1px solid #EBEFF4">
                    <th style="padding:8px">产品</th><th>类别</th><th>单价</th><th>库存</th><th>提交村民</th><th>产品说明</th><th style="text-align:right">操作</th>
                  </tr></thead>
                  <tbody>
                    <tr v-for="p in reviewProducts" :key="p.id" style="border-bottom:1px solid #F1F4F8;vertical-align:top">
                      <td style="padding:10px 8px;font-weight:600;color:#1F2D3D">{{ p.name }}</td>
                      <td style="padding:10px 8px">{{ p.category }}</td>
                      <td style="padding:10px 8px">¥{{ p.price }}<span style="color:#999;font-size:11px">/{{ p.unit }}</span></td>
                      <td style="padding:10px 8px">{{ p.stock }}</td>
                      <td style="padding:10px 8px">{{ p.farmer || '村民' }}</td>
                      <td style="padding:10px 8px;color:#66788A;max-width:240px">{{ p.description || '—' }}</td>
                      <td style="padding:10px 8px;text-align:right;white-space:nowrap">
                        <button class="btn btn-primary btn-sm" @click="approveReviewProduct(p)">✅ 通过</button>
                        <button class="btn btn-outline btn-sm" style="color:#E05252;border-color:#E05252;margin-left:6px" @click="reviewRejectId = (reviewRejectId === p.id ? null : p.id)">驳回</button>
                      </td>
                    </tr>
                    <tr v-if="reviewRejectId" style="background:#FFF7F7">
                      <td colspan="7" style="padding:12px 8px">
                        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
                          <span style="font-size:12px;color:#E05252;font-weight:600;white-space:nowrap">驳回原因（村民可见）：</span>
                          <input v-model="reviewRejectNote" placeholder="如：图片不清晰 / 信息不完整 / 价格异常" style="flex:1;min-width:220px;padding:8px 12px;border:1px solid #F1C7C7;border-radius:8px;font-size:13px">
                          <button class="btn btn-outline btn-sm" @click="reviewRejectId = null">取消</button>
                          <button class="btn btn-primary btn-sm" style="background:#E05252;box-shadow:none" @click="confirmRejectReview">确认驳回</button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="reviewProducts.length === 0"><td colspan="7" style="padding:36px;text-align:center;color:#999">暂无待审核的产品 🎉</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== PAGE: Farmer · 我的产业（个人产业工作台） ==================== -->
        <div v-show="currentPage === 'myfarm'" class="page-content gov-theme farmer-home" key="myfarm">
          <div class="farm-wrap">
            <!-- 头部 -->
            <div class="farm-head">
              <div class="farm-title">我的产业</div>
              <div class="farm-sub">我的地 · 我的作物 · 我的养殖 · 我的灌溉（仅显示本人，第一人称视角）</div>
            </div>

            <!-- 总览层：4 个汇总指标 -->
            <div class="stat-grid farm-stats">
              <div v-for="s in myFarmSummary" :key="s.label" class="stat-card" :class="s.cls">
                <div>
                  <div class="sc-val">{{ s.value }}</div>
                  <div class="sc-lbl">{{ s.label }}</div>
                  <div class="sc-sub">{{ s.sub }}</div>
                </div>
                <div class="sc-icon" :style="{background:s.iconBg}">{{ s.icon }}</div>
              </div>
            </div>

            <!-- 入口 tab -->
            <div class="farm-tabs">
              <button v-for="t in myFarmTabs" :key="t.key" class="farm-tab" :class="{ on: myFarmTab === t.key }" @click="switchMyFarmTab(t.key)">
                <span class="ft-icon">{{ t.icon }}</span>
                <span class="ft-text">
                  <span class="ft-label">{{ t.label }}</span>
                  <span class="ft-sub">{{ t.sub }}</span>
                </span>
              </button>
            </div>

            <!-- 我的地 -->
            <template v-if="myFarmTab === 'lands'">
              <div class="farm-sec-head">
                <span class="fsh-title">🌾 我的地块</span>
                <span class="fsh-link" @click="showLandMap()">查看地图 ›</span>
              </div>
              <div class="farm-card-grid">
                <div v-for="l in myLandRows" :key="l.id" class="farm-card">
                  <div class="fc-top">
                    <span class="fc-emoji">{{ cropEmoji(l.crop) }}</span>
                    <span class="fc-name">{{ l.name }}</span>
                    <span class="fc-tag">{{ l.status }}</span>
                  </div>
                  <div class="fc-area">{{ l.area }}<small>亩</small></div>
                  <div class="fc-rows">
                    <div class="fc-row"><span class="lr-l">种植作物</span><span class="lr-v">{{ l.crop }}</span></div>
                    <div class="fc-row"><span class="lr-l">土壤类型</span><span class="lr-v">{{ l.soilType }}</span></div>
                    <div class="fc-row"><span class="lr-l">灌溉</span><span class="lr-v" :class="l.irrigation ? 'ok' : 'warn'">{{ l.irrigation ? '已覆盖滴灌' : '未覆盖' }}</span></div>
                  </div>
                  <div class="fc-foot" @click="showMyLandDetail(l)">查看详情 →</div>
                </div>
              </div>

              <div class="farm-bottom">
                <div class="panel" style="margin:0">
                  <div class="panel-hd"><span class="hd-bar"></span>🌱 当前生产情况</div>
                  <div class="panel-bd" style="padding:6px 16px 14px">
                    <div v-for="s in cropStats" :key="s.name" class="stage-row">
                      <span class="sr-name">{{ s.name }}</span>
                      <span class="sr-bar"><span class="sr-fill" :style="{ width: (s.count / myLandRows.length * 100) + '%' }"></span></span>
                      <span class="sr-count">{{ s.count }} 块</span>
                    </div>
                  </div>
                </div>
                <div class="panel" style="margin:0">
                  <div class="panel-hd"><span class="hd-bar y"></span>⚠ 需要关注</div>
                  <div class="panel-bd" style="padding:6px 16px 14px">
                    <div v-for="(a, i) in attentionItems" :key="i" class="att-item">
                      <div class="att-title">{{ a.title }}</div>
                      <div class="att-desc">{{ a.desc }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- 我的作物 -->
            <template v-else-if="myFarmTab === 'crops'">
              <div class="farm-sec-head">
                <span class="fsh-title">🌱 我的作物</span>
                <span class="fsh-link" @click="toast('作物档案详情开发中', 'info')">查看档案 ›</span>
              </div>
              <div class="farm-card-grid">
                <div v-for="c in myCropRows" :key="c.id" class="farm-card">
                  <div class="fc-top">
                    <span class="fc-emoji">{{ cropEmoji(c.name) }}</span>
                    <span class="fc-name">{{ c.name }}</span>
                    <span class="fc-tag">{{ c.stage }}</span>
                  </div>
                  <div class="fc-area">{{ c.expectedYield }}<small>预计产量</small></div>
                  <div class="fc-rows">
                    <div class="fc-row"><span class="lr-l">品种</span><span class="lr-v">{{ c.variety }}</span></div>
                    <div class="fc-row"><span class="lr-l">定植时间</span><span class="lr-v">{{ c.plantDate }}</span></div>
                    <div class="fc-row"><span class="lr-l">生长周期</span><span class="lr-v">{{ c.cycle }} · {{ c.area }} 亩</span></div>
                  </div>
                  <div class="fc-foot" @click="showMyCropDetail(c)">查看详情 →</div>
                </div>
              </div>
            </template>

            <!-- 我的养殖 -->
            <template v-else-if="myFarmTab === 'livestock'">
              <div class="farm-sec-head">
                <span class="fsh-title">🐓 我的养殖</span>
                <span class="fsh-link" @click="toast('养殖档案详情开发中', 'info')">查看档案 ›</span>
              </div>
              <div class="farm-card-grid">
                <div v-for="v in myLivestockRows" :key="v.id" class="farm-card">
                  <div class="fc-top">
                    <span class="fc-emoji">{{ livestockEmoji(v.type, v.breed, v.batchName) }}</span>
                    <span class="fc-name">{{ v.batchName || v.batchNo }}</span>
                    <span class="fc-tag">{{ v.category }}</span>
                  </div>
                  <div class="fc-area">{{ v.count }}<small>{{ v.unit || '存栏' }}</small></div>
                  <div class="fc-rows">
                    <div class="fc-row"><span class="lr-l">健康状态</span><span class="lr-v ok">{{ v.health }}</span></div>
                    <div class="fc-row"><span class="lr-l">饲养阶段</span><span class="lr-v">{{ v.stage }}</span></div>
                    <div class="fc-row"><span class="lr-l">最近更新</span><span class="lr-v">{{ v.updatedAt }}</span></div>
                  </div>
                  <div class="fc-foot" @click="showMyLivestockDetail(v)">查看详情 →</div>
                </div>
              </div>
            </template>

            <!-- 我的灌溉 -->
            <template v-else-if="myFarmTab === 'irrigation'">
              <div class="panel" style="margin-bottom:12px">
                <div class="panel-hd"><span class="hd-bar"></span>💧 灌溉控制</div>
                <div class="panel-bd" style="padding:14px 16px;display:flex;align-items:center;gap:14px;flex-wrap:wrap">
                  <div style="flex:1;min-width:240px">
                    <div style="font-size:15px;font-weight:700;color:#1F2D3D">{{ irrigationRunning ? '🟢 正在灌溉 · 蜂糖李园滴灌' : '⏸ 当前未灌溉' }}</div>
                    <div style="font-size:12px;color:#66788A;margin-top:4px">演示模拟 · 正式接入后端需农户登录鉴权（Phase 3）</div>
                  </div>
                  <button class="btn" :class="irrigationRunning ? 'btn-outline' : 'btn-primary'" @click="toggleIrrigation">{{ irrigationRunning ? '⏹ 停止' : '▶ 启动灌溉' }}</button>
                </div>
              </div>
              <div class="panel">
                <div class="panel-hd"><span class="hd-bar g"></span>📋 我的灌溉记录</div>
                <div class="panel-bd" style="padding:4px 16px">
                  <div v-for="r in myIrrigationRecords" :key="r.id" style="display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid #EBEFF4">
                    <span style="font-size:16px">💧</span>
                    <div style="flex:1;min-width:0">
                      <div style="font-size:14px;color:#1F2D3D;font-weight:600">{{ r.device }}</div>
                      <div style="font-size:12px;color:#66788A;margin-top:2px">{{ r.start }} · 时长 {{ r.duration }}</div>
                    </div>
                    <div style="text-align:right">
                      <div style="font-size:14px;color:#1F2D3D;font-weight:600">{{ r.water }}</div>
                      <div style="font-size:12px;color:#22B573">{{ r.status }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- ==================== PAGE: Dashboard ==================== -->
        <div v-show="currentPage === 'dashboard'" class="page-content page-dashboard" key="dashboard">
          <div class="dash-top">
            <div class="dt-line">
              <div class="dt-rule dt-rule-l">
                <span class="dr-text">ZHONGYAN · DIGITAL TWIN</span>
                <span class="dr-line"><i class="dr-tick"></i></span>
              </div>
              <b class="dr-node"></b>
              <div class="dt-rule dt-rule-r">
                <span class="dr-line"><i class="dr-tick"></i></span>
                <span class="dr-text">{{ clockDateEn }} · <em class="dt-live">● ONLINE</em></span>
              </div>
            </div>
            <div class="dt-title">
              <div class="dt-main">中堰村数字乡村综合态势大屏</div>
              <div class="dt-sub">ZHONGYAN DIGITAL VILLAGE</div>
            </div>
            <div class="dt-sep"></div>
          </div>
          <div class="dash-grid">
            <!-- LEFT COLUMN -->
            <div class="dash-col">
              <div class="panel c-blue" style="flex:48 1 0">
                <div class="panel-hd"><span class="hd-bar"></span>人口概况<span class="extra">常住1,286 · 户籍2,910</span></div>
                <div class="panel-bd" style="display:flex;flex-direction:column">
                  <div class="mini-row">
                    <div class="mini-s"><div class="ms-v">2,910</div><div class="ms-l">户籍人口</div></div>
                    <div class="mini-s g"><div class="ms-v">816</div><div class="ms-l">总户数（估）</div></div>
                  </div>
                  <div class="mini-row">
                    <div class="mini-s y"><div class="ms-v">15.2%</div><div class="ms-l">老龄化率</div></div>
                    <div class="mini-s r"><div class="ms-v">68</div><div class="ms-l">重点关怀（估）</div></div>
                  </div>
                  <div class="age-hd">
                    <span class="age-hd-t">年龄结构</span>
                    <span class="age-legend"><i class="lg-dot" style="background:#5c7cff"></i>男<i class="lg-dot" style="background:#19d98b"></i>女</span>
                  </div>
                  <div ref="chartDashAge" class="chart-box" style="flex:1;min-height:0"></div>
                </div>
              </div>
              <div class="panel" style="flex:31 1 0">
                <div class="panel-hd"><span class="hd-bar"></span>产业产值</div>
                <div class="panel-bd" style="display:flex;flex-direction:column"><div ref="chartDashIndustry" class="chart-box" style="flex:1;min-height:0"></div></div>
              </div>
              <div class="panel c-green" style="flex:0 0 auto;height:176px">
                <div class="panel-hd"><span class="hd-bar"></span>环境实时监测</div>
                <div class="panel-bd">
                  <div class="mini-row">
                    <div class="mini-s"><div class="ms-v">26.5°C</div><div class="ms-l">气温</div></div>
                    <div class="mini-s g"><div class="ms-v">42 AQI</div><div class="ms-l">空气质量</div></div>
                  </div>
                  <div class="mini-row">
                    <div class="mini-s y"><div class="ms-v">Ⅱ类</div><div class="ms-l">水质等级</div></div>
                    <div class="mini-s g"><div class="ms-v">28%</div><div class="ms-l">土壤湿度</div></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- CENTER: GIS Map -->
            <div class="dash-center">
              <div class="panel" style="flex:1">
                <div class="panel-hd"><span class="hd-bar"></span>GIS 数字孪生 · 中堰村全域态势感知<span class="extra">天地图 · 15节点</span></div>
                <div class="panel-bd" style="padding:0;flex:1;position:relative">
                  <div class="map-wrap" ref="mapBox">
                    <a href="#" class="map-monitor-link" @click.prevent="switchPage('monitor')" title="监控中心">📡 监控中心</a>
                    <div ref="leafletMap" class="leaflet-map"></div>
                    <div class="map-legend">
                      <div class="map-lg"><span class="dot" style="background:#19d98b;box-shadow:0 0 5px #19d98b"></span>正常</div>
                      <div class="map-lg"><span class="dot" style="background:#ffcc33;box-shadow:0 0 5px #ffcc33"></span>预警</div>
                      <div class="map-lg"><span class="dot" style="background:#ff4d5a;box-shadow:0 0 5px #ff4d5a"></span>异常</div>
                      <div class="map-lg"><span class="dot" style="background:#5c7cff;box-shadow:0 0 5px #5c7cff"></span>公共设施</div>
                    </div>
                    <span class="float-badge" style="top:18%;left:24%">📍 村委会</span>
                    <span class="float-badge" style="top:22%;left:55%;animation-delay:.6s">🌱 苹果园区 26.5°C</span>
                    <span class="float-badge" style="top:62%;left:42%;animation-delay:1.2s">🐖 养殖场 在线</span>
                    <span class="float-badge" style="top:38%;left:78%;animation-delay:1.8s">⚠️ 水质监测 异常</span>
                  </div>
                </div>
              </div>
              <div class="marquee-bar">
                <span class="marquee-text">
                  📢 系统通知：今日空气质量优良 | 周三农技培训《苹果夏季修剪技术》14:30开始 | 3号水塘水质异常已派单处理 | 6月份补贴已到账 | 村东口路灯维修预计明天完成 | 智慧农业平台 v2.4.1
                </span>
              </div>
            </div>
            <!-- RIGHT COLUMN -->
            <div class="dash-col">
              <div class="panel c-yellow" style="flex:1">
                <div class="panel-hd"><span class="hd-bar y"></span>实时预警<span class="extra">{{ alertItems.length }}条</span></div>
                <div class="panel-bd">
                  <div class="alert-list">
                    <div class="alert-scroll" :style="{ animationDuration: (alertItems.length * 2.5) + 's' }">
                      <div class="alert-item" v-for="(a, i) in alertScrollItems" :key="i" :class="['lvl-' + (a.level || 'warning'), { active: activeAlert === a.id }]" @click="openAlertDetail(a)">
                        <span class="ai-ico">{{ a.icon }}</span>
                        <div class="ai-body">
                          <div class="ai-title">{{ a.title }}</div>
                          <div class="ai-meta"><span class="ai-desc">{{ a.desc }}</span><span class="ai-time">{{ a.time }}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="panel c-purple" style="flex:1">
                <div class="panel-hd"><span class="hd-bar"></span>🤖 AI 智能研判<span class="extra" id="aiRefresh">30s刷新</span></div>
                <div class="panel-bd ai-panel">
                  <div class="ai-hud">
                    <div class="ai-ring"><div class="ai-ring-core">AI</div></div>
                    <div class="ai-stats">
                      <div class="ai-stat" v-for="s in aiStats" :key="s.label">
                        <div class="ai-stat-l">{{ s.label }}</div>
                        <div class="ai-stat-v" :style="{color:s.color}">{{ s.value }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="ai-conclusion">
                    <div class="ac-label">AI 研判结论</div>
                    <div class="ac-text">{{ aiConclusion }}</div>
                  </div>
                </div>
              </div>
              <div class="panel c-green" style="flex:0 0 auto;height:190px">
                <div class="panel-hd"><span class="hd-bar g"></span>IoT设备状态<span class="extra">在线率90.4%</span></div>
                <div class="panel-bd" style="font-size:10px">
                  <div class="iot-list">
                    <div class="iot-scroll" :style="{ animationDuration: (iotDeviceList.length * 2.5) + 's' }">
                      <div class="iot-row" v-for="(d, i) in iotScrollItems" :key="i" @click="toast('设备: '+d.name+' - '+d.statusText, 'info')">
                        <span class="dot" :class="d.status"></span>{{ d.name }}<span class="iot-st" :class="d.status">{{ d.statusText }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Bottom row -->
          <div class="bot-row">
            <div class="bot-item" v-for="m in bottomMetrics" :key="m.label" @click="openStatDetail(m.label, m.value)">
              <span class="bl">{{ m.label }}</span>
              <span class="bv">{{ m.value }}</span>
              <span class="bt" :class="m.tone">{{ m.trend }}</span>
            </div>
          </div>
        </div>

        <!-- ==================== PAGE: Industry ==================== -->
        <div v-show="currentPage === 'industry'" class="page-content page-industry-embed" key="industry">
          <IndustryPage :embedded="true" :activeTab="activeSubTab" />
        </div>

        <!-- ==================== PAGE: Pest Warning Center ==================== -->
        <div v-show="currentPage === 'pest'" class="page-content" key="pest">
          <PestWarningCenter embedded />
        </div>

        <!-- ==================== PAGE: Governance ==================== -->
        <div v-show="currentPage === 'governance'" class="page-content gov-theme" key="governance">
          <!-- Farmer-personal stats -->
          <div class="stat-grid">
            <div class="stat-card r" @click="showMyReports()">
              <div><div class="sc-val">{{ govStats[0].value }}</div><div class="sc-lbl">{{ govStats[0].label }}</div><div class="sc-sub">{{ govStats[0].sub }}</div></div>
              <div class="sc-icon" :style="{background:govStats[0].iconBg}">{{ govStats[0].icon }}</div>
            </div>
            <div class="stat-card y" @click="showMyReports()">
              <div><div class="sc-val">{{ govStats[1].value }}</div><div class="sc-lbl">{{ govStats[1].label }}</div><div class="sc-sub">{{ govStats[1].sub }}</div></div>
              <div class="sc-icon" :style="{background:govStats[1].iconBg}">{{ govStats[1].icon }}</div>
            </div>
            <div class="stat-card g" @click="showMyReports()">
              <div><div class="sc-val">{{ govStats[2].value }}</div><div class="sc-lbl">{{ govStats[2].label }}</div><div class="sc-sub">{{ govStats[2].sub }}</div></div>
              <div class="sc-icon" :style="{background:govStats[2].iconBg}">{{ govStats[2].icon }}</div>
            </div>
            <div class="stat-card" @click="showGridWorkerInfo()">
              <div><div class="sc-val">{{ govStats[3].value }}</div><div class="sc-lbl">{{ govStats[3].label }}</div><div class="sc-sub">{{ govStats[3].sub }}</div></div>
              <div class="sc-icon" :style="{background:govStats[3].iconBg}">{{ govStats[3].icon }}</div>
            </div>
          </div>
          <!-- ① 事件上报 — 快速上报入口 -->
          <div class="panel" style="margin-bottom:10px">
            <div class="panel-hd"><span class="hd-bar"></span>📝 事件上报<span class="extra">发现问题，随手拍、马上报</span></div>
            <div class="panel-bd" style="padding:8px">
              <div class="report-cat-grid">
                <div class="report-cat" v-for="t in reportTypes" :key="t.value" @click="selectReportType(t.value)">
                  <span class="rc-icon">{{ t.icon }}</span>
                  <span class="rc-label">{{ t.label }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- ② 我的上报 — 最近3条 -->
          <div class="panel" style="margin-bottom:10px">
            <div class="panel-hd"><span class="hd-bar"></span>📋 我的上报<span class="extra" style="cursor:pointer;color:#19B98A;font-size:15px" @click="showMyReports()">查看全部 ›</span></div>
            <div class="panel-bd" style="padding:8px">
              <div v-if="recentReports.length > 0">
                <div v-for="r in recentReports" :key="r.id" class="gov-news-item" @click="showMyEventDetailById(r.ref)">
                  <div class="gni-left"><span class="gni-type" :style="{background:r.typeBg}">{{ r.icon }} {{ r.type }}</span></div>
                  <div class="gni-mid">
                    <div class="gni-loc">{{ r.location }}</div>
                    <div class="gni-time">{{ r.time }}</div>
                  </div>
                  <div class="gni-right"><span class="st" :class="r.statusCls">{{ r.status }}</span></div>
                </div>
              </div>
              <div v-else style="text-align:center;padding:20px 0;color:#66788A;font-size:14px">暂无上报记录</div>
            </div>
          </div>

          <!-- ③④ 村务提醒 + 我的网格员 -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar y"></span>📢 村务提醒<span class="extra" style="cursor:pointer;color:#19B98A;font-size:15px" @click="showVillageNotices()">查看全部 ›</span></div>
              <div class="panel-bd" style="padding:8px">
                <div v-if="villageNotices.length > 0">
                  <div v-for="n in villageNotices" :key="n.id" class="gov-news-item" @click="showNoticeDetail(n)">
                    <div class="gni-left"><span class="gni-icon-big">{{ n.icon }}</span></div>
                    <div class="gni-mid">
                      <div class="gni-loc">{{ n.title }}<span v-if="n.tag" style="display:inline-block;padding:2px 8px;border-radius:6px;font-size:14px;font-weight:600;margin-left:5px;color:#E05252;background:rgba(224,82,82,0.10);vertical-align:middle">{{ n.tag }}</span></div>
                      <div class="gni-time">{{ n.date }} · {{ n.source }}</div>
                    </div>
                    <div class="gni-right"><span style="font-size:15px;color:#19B98A">查看 →</span></div>
                  </div>
                </div>
                <div v-else style="text-align:center;padding:20px 0;color:#66788A;font-size:14px">暂无村务提醒</div>
              </div>
            </div>
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar"></span>👤 我的网格员</div>
              <div class="panel-bd" style="padding:8px">
                <div class="grid-worker-card">
                  <div class="gw-avatar">{{ gridWorker.avatar }}</div>
                  <div class="gw-info">
                    <div class="gw-name">{{ gridWorker.name }} <span class="gw-role">{{ gridWorker.role }}</span></div>
                    <div class="gw-meta">
                      <span>🏘️ {{ gridWorker.grid }}</span>
                      <span>📍 {{ gridWorker.area }}</span>
                    </div>
                  </div>
                  <div class="gw-actions">
                    <button class="btn btn-primary btn-sm" @click="callGridWorker()">📞 联系</button>
                    <button class="btn btn-outline btn-sm" @click="showGridWorkerInfo()">查看详情</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- AI Assistant (kept for farmers) -->
          <div class="panel">
            <div class="panel-hd"><span class="hd-bar y"></span>🤖 AI 乡村助手<span class="extra">有问题随时问我</span></div>
            <div class="panel-bd">
              <div class="chat-wrapper">
                <div class="chat-area" ref="chatAreaRef">
                  <div v-for="(m,i) in chatMessages" :key="i" :class="['chat-msg', m.role]"><span v-html="m.text"></span></div>
                </div>
                <div class="chat-input-row">
                  <input class="input" v-model="chatInput" placeholder="输入您的问题..." @keyup.enter="sendChat" />
                  <button class="btn btn-primary" @click="sendChat">发送</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== PAGE: Ecology ==================== -->
        <div v-show="currentPage === 'ecology'" class="page-content eco-theme" key="ecology">
          <div class="stat-grid">
            <div class="stat-card g" v-for="s in ecoStats" :key="s.label" @click="openEcoStatDetail(s)">
              <div><div class="sc-val">{{ s.value }}<span v-if="s.valueTag" class="sc-tag">{{ s.valueTag }}</span></div><div class="sc-lbl">{{ s.label }}</div><div class="sc-sub">{{ s.sub }}</div></div>
              <div class="sc-icon" :style="{background:s.iconBg}">{{ s.icon }}</div>
            </div>
          </div>
          <!-- 我身边的环境 — 核心入口 -->
          <div @click="showNearbyEnv()" style="margin-bottom:10px;padding:14px 16px;background:linear-gradient(135deg,#22B573,#1BA366);border-radius:10px;color:#fff;cursor:pointer;display:flex;align-items:center;gap:12px;box-shadow:0 2px 8px rgba(34,181,115,0.25);transition:all .2s" onmouseover="this.style.boxShadow='0 4px 14px rgba(34,181,115,0.35)'" onmouseout="this.style.boxShadow='0 2px 8px rgba(34,181,115,0.25)'">
            <span style="font-size:26px">🌱</span>
            <div style="flex:1"><div style="font-size:17px;font-weight:700">我身边的环境</div><div style="font-size:14px;opacity:.92;margin-top:2px">查看我所在片区的空气、水质、垃圾点和告警</div></div>
            <span style="font-size:20px">›</span>
          </div>
          <!-- 快捷操作 — 村民生态服务入口 -->
          <div style="margin-bottom:10px">
            <div class="panel-hd" style="padding:0 2px 6px"><span class="hd-bar g"></span>⚡ 快捷操作</div>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn btn-primary" @click="showEcoReportForm()">📷 环境问题上报</button>
              <button class="btn btn-outline" @click="showGarbageService()">🗑 垃圾清运</button>
              <button class="btn btn-outline" @click="showWaterService()">💧 水质问题</button>
              <button class="btn btn-outline" @click="showStrawService()">🌾 秸秆处理</button>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar"></span>🌬️ 空气质量趋势（近7天）</div>
              <div class="panel-bd"><div ref="chartEcoAir" class="chart-box" style="height:180px"></div></div>
            </div>
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar g"></span>💧 水质监测（各监测点）</div>
              <div class="panel-bd"><div ref="chartEcoWater" class="chart-box" style="height:180px"></div></div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar r"></span>⚠️ 环境告警</div>
              <div class="panel-bd">
                <div class="alert-list">
                  <div class="alert-item r" v-for="a in ecoAlerts" :key="a.id" @click="openEcoAlertDetail(a)">
                    <span class="ai-ico">{{ a.icon }}</span>
                    <div style="flex:1;min-width:0"><div class="ai-title">{{ a.title }}</div><div class="ai-desc">{{ a.desc }}</div><div class="ai-time">{{ a.time }}</div></div>
                    <button class="btn btn-outline btn-sm" style="flex-shrink:0" @click.stop="openEcoAlertDetail(a)">{{ a.actionLabel }}</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar y"></span>📊 碳汇与废弃物统计</div>
              <div class="panel-bd"><div ref="chartEcoCarbon" class="chart-box" style="height:180px"></div></div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-hd"><span class="hd-bar"></span>📋 环境监测数据</div>
            <div class="panel-bd" style="padding:8px">
              <table class="data-table">
                <thead><tr><th>监测点</th><th>类型</th><th>当前值</th><th>标准值</th><th>状态</th><th>更新时间</th><th></th></tr></thead>
                <tbody>
                  <tr v-for="r in ecoTableData" :key="r.name">
                    <td>{{ r.name }}</td><td>{{ r.type }}</td><td>{{ r.value }}</td>
                    <td>{{ r.standard }}</td><td><span class="st" :class="r.statusCls">{{ r.status }}</span></td><td>{{ r.updateTime }}</td>
                    <td><button class="btn btn-outline btn-sm" @click="openMonitorDetail(r)">查看</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ==================== PAGE: Service ==================== -->
        <div v-show="currentPage === 'service'" class="page-content page-industry-embed" key="service">
          <ServicePage ref="servicePageRef" :embedded="true" />
        </div>

        <!-- ==================== PAGE: IoT ==================== -->
        <div v-show="currentPage === 'iot'" class="page-content eco-theme" key="iot">
          <div style="padding:6px 4px 12px">
            <div style="margin-bottom:16px">
              <div style="font-size:22px;font-weight:700;color:#1F2D3D">📡 IoT设备感知</div>
              <div style="font-size:15px;color:#66788A;margin-top:4px">全村传感器与物联网设备运行情况</div>
            </div>
            <!-- 统计 -->
            <div class="stat-grid">
              <div class="stat-card"><div><div class="sc-val">82</div><div class="sc-lbl">全部设备</div><div class="sc-sub">4 类物联设备</div></div><div class="sc-icon" style="background:rgba(14,165,233,.10)">🔌</div></div>
              <div class="stat-card g"><div><div class="sc-val">78</div><div class="sc-lbl">在线</div><div class="sc-sub">在线率 95.1%</div></div><div class="sc-icon" style="background:rgba(57,217,138,0.12)">🟢</div></div>
              <div class="stat-card y"><div><div class="sc-val">3</div><div class="sc-lbl">异常</div><div class="sc-sub">需关注</div></div><div class="sc-icon" style="background:rgba(245,158,11,0.12)">⚠️</div></div>
              <div class="stat-card r"><div><div class="sc-val">1</div><div class="sc-lbl">离线</div><div class="sc-sub">待排查</div></div><div class="sc-icon" style="background:rgba(239,68,68,0.12)">🔴</div></div>
            </div>
            <!-- 筛选 + 搜索 -->
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;flex-wrap:wrap">
              <div class="device-filter-tabs">
                <button v-for="c in iotCategories" :key="c" class="device-filter-btn" :class="{active: iotFilter === c}" @click="iotFilter = c">{{ c }}</button>
              </div>
              <div class="device-search">
                <span>🔍</span><input v-model="iotSearch" placeholder="搜索设备名称 / 编号" />
              </div>
            </div>
            <!-- 设备宫格 -->
            <div class="device-grid">
              <div class="device-card" v-for="d in filteredIotDevices" :key="d.id" @click="showIotDetail(d)">
                <div class="devc-head">
                  <div class="devc-icon" :style="{background: d.status==='在线' ? 'rgba(57,217,138,0.12)' : d.status==='异常' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)'}">{{ d.icon }}</div>
                  <span class="st" :class="d.statusCls">{{ d.status }}</span>
                </div>
                <div class="devc-name">{{ d.name }}</div>
                <div class="devc-meta">{{ d.id }}｜{{ d.location }}</div>
                <div class="devc-metric">{{ d.metric }}</div>
                <div class="devc-foot">
                  <span class="devc-time">最后上报 {{ d.lastReport }}</span>
                  <span class="devc-go">查看详情 ›</span>
                </div>
              </div>
              <div v-if="filteredIotDevices.length === 0" class="device-empty">未找到匹配的设备</div>
            </div>
            <div style="text-align:center;font-size:14px;color:#8A97A5;margin-top:6px">演示数据：列表展示代表设备，全村共部署 82 台，完整台账正式接入后展示全部</div>
          </div>
        </div>

        <!-- ==================== PAGE: Data Center ==================== -->
        <div v-show="currentPage === 'data'" class="page-content eco-theme" key="data">
          <!-- 标题 -->
          <div class="panel" style="margin-bottom:14px;padding:16px 20px">
            <div style="font-size:20px;font-weight:700;color:#1F2D3D;margin-bottom:4px">📊 数据中心</div>
            <div style="font-size:15px;color:#66788A;line-height:1.6">查看与我有关的数据和本村公开数据</div>
          </div>

          <!-- ① 我的数据（登录者本人数据，仅本人可见） -->
          <div class="dc-sec">
            <div class="dc-sec-hd">👤 我的数据<span class="dc-sec-sub">登录的是谁，就只能看到谁自己的数据</span></div>
            <div class="dc-my-grid">
              <div class="dc-card" v-for="c in myDataCards" :key="c.key" @click="openMyData(c.key)">
                <div class="dc-card-ic">{{ c.icon }}</div>
                <div class="dc-card-t">{{ c.title }}</div>
                <div class="dc-card-d">{{ c.desc }}</div>
                <div class="dc-card-ft">
                  <span v-if="c.key === 'records'" class="dc-card-n">{{ myRecordsCount }} 条</span>
                  <span class="dc-card-go">查看 ›</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ② 本村公开数据（仅公开统计，不展示个人隐私） -->
          <div class="dc-sec">
            <div class="dc-sec-hd">📊 本村公开数据<span class="dc-sec-sub">仅公开统计信息，不展示村民个人隐私</span></div>
            <div class="dc-pub-grid">
              <div class="dc-pub" v-for="p in villagePublicData" :key="p.key" @click="openVillageData(p.key)">
                <div class="dc-pub-ic">{{ p.icon }}</div>
                <div class="dc-pub-name">{{ p.label }}</div>
              </div>
              <div class="dc-pub dc-pub-more" @click="openVillageDataMore()">
                <div class="dc-pub-ic">📂</div>
                <div class="dc-pub-name">查看更多</div>
              </div>
            </div>
          </div>

          <!-- ③ 我的数据与授权 -->
          <div class="dc-rowcard" @click="openDataAuth()">
            <div class="dc-row-ic">🔐</div>
            <div class="dc-row-body">
              <div class="dc-row-t">我的数据与授权</div>
              <div class="dc-row-d">查看平台保存了我的哪些信息，以及用于什么服务</div>
            </div>
            <span class="dc-row-go">查看 ›</span>
          </div>

          <!-- ④ 数据纠错 -->
          <div class="dc-rowcard" @click="startDataCorrection()">
            <div class="dc-row-ic">📝</div>
            <div class="dc-row-body">
              <div class="dc-row-t">数据纠错</div>
              <div class="dc-row-d">发现家庭、土地等个人数据有误？可提交纠错申请</div>
            </div>
            <span class="dc-row-go">申请纠错 ›</span>
          </div>
        </div>

        <!-- ==================== PAGE: Leadership ==================== -->
        <div v-show="currentPage === 'leadership'" class="page-content eco-theme" key="leadership">
          <!-- 第一层：标题 + 今日值班小卡 -->
          <div class="panel" style="margin-bottom:14px;padding:16px 20px">
            <div style="font-size:20px;font-weight:700;color:#1F2D3D;margin-bottom:4px">🏠 中堰村村委班子</div>
            <div style="font-size:15px;color:#66788A;line-height:1.6;margin-bottom:12px">有事情不知道找谁？根据事项快速联系对应干部。</div>
            <div class="duty-strip">
              <span class="duty-label">📅 今日值班</span>
              <span class="duty-name">{{ dutyLeader.name }}</span>
              <span class="duty-title">{{ dutyLeader.title }}</span>
              <span class="duty-phone">☎ {{ dutyLeader.phoneMasked }}</span>
              <button class="btn btn-primary btn-sm" @click="showContactLeader(dutyLeader)">联系值班干部</button>
            </div>
          </div>

          <!-- 第二层：快速找人（核心） -->
          <div class="panel guide-panel">
            <div class="guide-title">🔍 快速找人</div>
            <div class="guide-sub">我想办理：</div>
            <div class="guide-grid">
              <div class="guide-item" v-for="g in commonGuides" :key="g.category" @click="openGuide(g)">
                <div class="gi-top">
                  <span class="gi-icon">{{ g.icon }}</span>
                  <span class="gi-label">{{ g.label }}</span>
                </div>
                <div class="gi-bottom">
                  <span class="gi-officer">负责干部：<span class="gi-name">{{ leaderById(g.staffId).name }}</span></span>
                  <span class="gi-arrow">→</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 第三层：村委干部 -->
          <div class="leader-grid-wrap">
            <div class="panel leader-card-panel" v-for="l in leaders" :key="l.id" @click="showLeaderDetail(l)">
              <img class="leader-photo" :src="l.photo" :alt="l.name">
              <div class="leader-info">
                <div class="leader-name">{{ l.name }}</div>
                <div class="leader-title">{{ l.title }}</div>
                <div class="leader-duty">负责：{{ l.dutyTags.join('、') }}</div>
                <div class="leader-actions">
                  <button class="btn btn-primary btn-sm" @click.stop="showLeaveMessage(l)">💬 留言咨询</button>
                  <button class="btn btn-outline btn-sm" @click.stop="showContactLeader(l)">☎ 联系</button>
                  <button class="btn btn-outline btn-sm" @click.stop="showLeaderDetail(l)">详情</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 第四层：我的留言（个人办事记录，首页最多展示3条） -->
          <div class="panel my-msg-card">
            <div class="mmc-head" @click="showMyMessages">
              <span class="mmc-title">💬 我的留言</span>
              <span class="mmc-all">查看全部 ›</span>
            </div>
            <div class="mmc-stats">
              <span class="mmc-stat">待回复 <b>{{ pendingMsgCount }}</b></span>
              <span class="mmc-sep">｜</span>
              <span class="mmc-stat">已回复 <b>{{ repliedMsgCount }}</b></span>
              <span class="mmc-sep">｜</span>
              <span class="mmc-stat">已办结 <b>{{ resolvedMsgCount }}</b></span>
            </div>
            <div v-if="recentMessages.length === 0" class="mmc-empty">暂无留言，有事可点干部卡片「💬 留言咨询」</div>
            <div v-else class="mmc-list">
              <div class="mmc-item" v-for="m in recentMessages" :key="m.message_id" @click="openMessageDetailBy(m.message_id)">
                <div class="mmc-item-top">
                  <span class="mmc-cat">{{ m.category }} · {{ m.staff_name }}</span>
                  <span class="mmc-pill" :style="{ color: msgStatusColor(m.status), background: msgStatusColor(m.status) + '1A' }">{{ m.status }}</span>
                </div>
                <div class="mmc-content">{{ m.content }}</div>
                <div class="mmc-item-bottom">
                  <span class="mmc-time">{{ m.timeText }}</span>
                  <span v-if="m.status === '已回复' || m.status === '已办结'" class="mmc-link">查看回复 ›</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 第五层：村委信息（横向信息卡，压缩为单/双行） -->
          <div class="panel village-office-card">
            <div class="vo-title">🏠 {{ villageOffice.name }}</div>
            <div class="vo-meta">
              <span class="vo-item"><span class="vo-ic">📍</span>办公地址：{{ villageOffice.address }}</span>
              <span class="vo-item"><span class="vo-ic">☎</span>值班电话：{{ villagePhone }}</span>
              <span class="vo-item"><span class="vo-ic">🕘</span>{{ villageOffice.hours }}</span>
            </div>
            <div class="vo-foot">
              <span class="vo-tip">💬 办事提示：{{ villageOffice.tip }}</span>
              <span class="vo-actions">
                <button class="btn btn-outline" @click="viewVillageLocation">📍 查看位置</button>
                <button class="btn btn-primary" @click="callVillage">☎ 联系村委</button>
              </span>
            </div>
          </div>
        </div>

        <!-- ==================== PAGE: Device Center (运行总览) ==================== -->
        <div v-show="currentPage === 'device'" class="page-content eco-theme" key="device">
          <div style="padding:6px 4px 12px">
            <div style="margin-bottom:16px">
              <div style="font-size:22px;font-weight:700;color:#1F2D3D">📡 设备中心</div>
              <div style="font-size:15px;color:#66788A;margin-top:4px">全村物联设备、视频监控与运行告警统一管理</div>
            </div>
            <!-- 第一排：4 统计卡 -->
            <div class="stat-grid">
              <div class="stat-card" :class="s.cls" v-for="s in deviceOverviewStats" :key="s.label">
                <div><div class="sc-val">{{ s.value }}</div><div class="sc-lbl">{{ s.label }}</div><div class="sc-sub">{{ s.sub }}</div></div>
                <div class="sc-icon" :style="{background:s.iconBg}">{{ s.icon }}</div>
              </div>
            </div>
            <!-- 第二排：两个业务入口（各 50%） -->
            <div class="device-entry-grid">
              <div class="device-entry" @click="switchPage('iot')">
                <div class="de-icon" style="background:rgba(79,172,254,.12)">📡</div>
                <div class="de-body">
                  <div class="de-title">IoT设备感知</div>
                  <div class="de-count">82 台设备</div>
                  <div class="de-status"><span style="color:#22B573">在线 78</span>｜<span style="color:#F2A62B">异常 3</span>｜<span style="color:#E05252">离线 1</span></div>
                  <div class="de-desc">环境监测、农业传感、水利设施、公共设施</div>
                </div>
                <span class="de-arrow">进入设备管理 →</span>
              </div>
              <div class="device-entry" @click="switchPage('monitor')">
                <div class="de-icon" style="background:rgba(57,207,123,.12)">📷</div>
                <div class="de-body">
                  <div class="de-title">视频监控中心</div>
                  <div class="de-count">32 路摄像头</div>
                  <div class="de-status"><span style="color:#22B573">在线 30</span>｜<span style="color:#E05252">离线 2</span></div>
                  <div class="de-desc">村口、产业园、村委会、公共区域</div>
                </div>
                <span class="de-arrow">进入监控中心 →</span>
              </div>
            </div>
            <!-- 第三排：当前异常 -->
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar y"></span>⚠️ 当前异常<span class="extra" style="cursor:pointer;color:#F2A62B;font-weight:600" @click="showAllDeviceAlerts()">查看全部告警 →</span></div>
              <div class="panel-bd" style="padding:2px 14px 10px">
                <div class="device-alert-item" v-for="a in deviceAlerts.slice(0,3)" :key="a.device">
                  <span class="dai-dot" :class="a.severity"></span>
                  <span class="dai-device">{{ a.device }}</span>
                  <span class="dai-issue">{{ a.issue }}</span>
                  <span class="dai-time">{{ a.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== PAGE: Settings ==================== -->
        <div v-show="currentPage === 'settings'" class="page-content eco-theme settings-page" key="settings">

          <!-- 首页：功能入口卡片（按角色区分） -->
          <div v-if="settingsView === 'home'">
            <div v-if="!isVillager && currentUser.role !== '管理员'" style="font-size:13px;color:var(--text-dim);margin-bottom:12px;line-height:1.6">当前角色「{{ currentUser.role }}」：以下为可操作模块，<span style="color:var(--accent)">数据备份、安全设置</span>等高权限功能仅管理员可见。</div>
            <div class="module-grid settings-grid">
              <div class="module-card" v-for="s in (isVillager ? profileModules : visibleAdminModules)" :key="s.label" @click="openSettingsDetail(s)">
                <div class="mc-icon" :style="{background:s.iconBg}">{{ s.icon }}</div>
                <h4>{{ s.label }}</h4><p>{{ s.desc }}</p>
                <div class="mc-tags"><span class="tag" v-for="t in s.tags" :key="t.text" :class="t.cls">{{ t.text }}</span></div>
                <span class="mc-arrow">→</span>
              </div>
            </div>
          </div>

          <!-- 个人设置 · 账号与资料 -->
          <div v-else-if="settingsView === 'account'" class="settings-panel">
            <div class="sp-hd">
              <button class="sp-back" @click="settingsBack()">← 返回个人设置</button>
              <div class="sp-title">👤 账号与资料</div>
              <div class="sp-desc">查看本人账号与家庭关联信息（部分资料需申请纠错）</div>
            </div>
            <div style="display:flex;align-items:center;gap:14px;padding:14px;background:#FFFFFF;border:1px solid #E3EAF0;border-radius:10px;margin-bottom:16px">
              <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#39D98A,#28C76F);display:flex;align-items:center;justify-content:center;font-size:26px;color:#fff;flex-shrink:0">{{ currentUser.name.charAt(0) }}</div>
              <div>
                <div style="font-size:17px;font-weight:700;color:var(--text-bright)">{{ currentUser.name }}</div>
                <div style="font-size:12px;color:var(--text-dim);margin-top:2px">{{ currentUser.village }} · {{ currentUser.zone }} · {{ currentUser.grid }}</div>
              </div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">基本资料</div>
              <div class="sp-form-row"><span class="sp-form-lbl">姓名</span><span class="sp-form-val">{{ currentUser.name }}</span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">所属村组</span><span class="sp-form-val">{{ currentUser.village }} · {{ currentUser.zone }}</span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">所属网格</span><span class="sp-form-val">{{ currentUser.grid }}</span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">手机号</span><span class="sp-form-val">{{ currentUser.phone }}（脱敏）</span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">身份证</span><span class="sp-form-val">6101**********2468（脱敏）</span></div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">家庭关联信息</div>
              <div class="sp-form-row"><span class="sp-form-lbl">户主</span><span class="sp-form-val">{{ currentUser.name }}</span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">家庭人口</span><span class="sp-form-val">4 人（含本人）</span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">家庭成员</span><span class="sp-form-val">3 人（配偶、长子、长女）</span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">家庭住址</span><span class="sp-form-val">{{ currentUser.zone }} · 第 2 网格</span></div>
            </div>
            <div style="font-size:11px;color:var(--text-dim);margin:4px 0 12px">⚠️ 姓名、手机号、家庭成员等资料如需更正，请提交纠错申请，由村委会核实后更新。</div>
            <div class="sp-actions"><button class="btn btn-primary" @click="toast('资料纠错申请功能开发中，可先到「数据中心」查看本人档案','info')">申请资料纠错</button><button class="btn btn-outline" @click="switchPage('data')">查看完整个人数据</button></div>
          </div>

          <!-- 个人设置 · 消息通知 -->
          <div v-else-if="settingsView === 'pnotify'" class="settings-panel">
            <div class="sp-hd">
              <button class="sp-back" @click="settingsBack()">← 返回个人设置</button>
              <div class="sp-title">🔔 消息通知</div>
              <div class="sp-desc">设置各类消息的通知开关</div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">通知类型</div>
              <div style="display:flex;gap:8px;margin:0 0 10px"><button class="btn btn-outline btn-sm" @click="setAllNotifications(true)">全部开启</button><button class="btn btn-outline btn-sm" @click="setAllNotifications(false)">全部关闭</button></div>
              <div class="sp-form-row"><span class="sp-form-lbl">📢 村务公告</span><span class="sp-form-val"><span class="sp-switch" :class="{ on: profileNotif.announcement }" @click="profileNotif.announcement = !profileNotif.announcement"><i></i></span></span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">📝 办事进度</span><span class="sp-form-val"><span class="sp-switch" :class="{ on: profileNotif.progress }" @click="profileNotif.progress = !profileNotif.progress"><i></i></span></span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">🌾 农业预警</span><span class="sp-form-val"><span class="sp-switch" :class="{ on: profileNotif.agriWarn }" @click="profileNotif.agriWarn = !profileNotif.agriWarn"><i></i></span></span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">📡 设备提醒</span><span class="sp-form-val"><span class="sp-switch" :class="{ on: profileNotif.deviceWarn }" @click="profileNotif.deviceWarn = !profileNotif.deviceWarn"><i></i></span></span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">🌿 生态提醒</span><span class="sp-form-val"><span class="sp-switch" :class="{ on: profileNotif.ecoWarn }" @click="profileNotif.ecoWarn = !profileNotif.ecoWarn"><i></i></span></span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">🎉 活动通知</span><span class="sp-form-val"><span class="sp-switch" :class="{ on: profileNotif.activity }" @click="profileNotif.activity = !profileNotif.activity"><i></i></span></span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">🔐 账号与安全</span><span class="sp-form-val"><span class="tag red" style="margin-right:8px">始终开启</span><span style="font-size:12px;color:var(--text-dim)">新设备登录、手机号变更、密码修改</span></span></div>
            </div>
            <div style="font-size:12px;color:var(--text-dim);margin-bottom:12px">🔐「账号与安全」通知涉及账号安全，不可关闭。</div>
            <div class="sp-actions"><button class="btn btn-primary" @click="toast('通知设置已保存','success')">保存设置</button></div>
          </div>

          <!-- 个人设置 · 账号安全 -->
          <div v-else-if="settingsView === 'psecurity'" class="settings-panel">
            <div class="sp-hd">
              <button class="sp-back" @click="settingsBack()">← 返回个人设置</button>
              <div class="sp-title">🔐 账号安全</div>
              <div class="sp-desc">修改密码、绑定手机号、异常登录提醒</div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">修改密码</div>
              <div class="sp-form-row"><span class="sp-form-lbl">当前密码</span><span class="sp-form-val"><input type="password" class="input sp-search" placeholder="请输入当前密码" /></span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">新密码</span><span class="sp-form-val"><input type="password" class="input sp-search" placeholder="8-20 位，含字母和数字" /></span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">确认新密码</span><span class="sp-form-val"><input type="password" class="input sp-search" placeholder="再次输入新密码" /></span></div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">绑定手机号</div>
              <div class="sp-form-row"><span class="sp-form-lbl">当前绑定</span><span class="sp-form-val">{{ currentUser.phone }}</span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">更换绑定</span><span class="sp-form-val"><button class="btn btn-outline btn-sm" @click="toast('更换绑定手机号需短信验证，功能开发中','info')">更换手机号</button></span></div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">登录安全</div>
              <div class="sp-form-row"><span class="sp-form-lbl">异常登录提醒</span><span class="sp-form-val"><span class="sp-switch" :class="{ on: profileSecurity.abnormalAlert }" @click="profileSecurity.abnormalAlert = !profileSecurity.abnormalAlert"><i></i></span><span style="margin-left:8px">异地 / 新设备登录时短信提醒</span></span></div>
            </div>
            <div class="sp-actions"><button class="btn btn-primary" @click="toast('密码修改功能开发中','info')">确认修改密码</button></div>
          </div>

          <!-- 个人设置 · 隐私与授权 -->
          <div v-else-if="settingsView === 'privacy'" class="settings-panel">
            <div class="sp-hd">
              <button class="sp-back" @click="settingsBack()">← 返回个人设置</button>
              <div class="sp-title">🛡️ 隐私与授权</div>
              <div class="sp-desc">平台保存了哪些个人信息、被哪些业务使用</div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">① 个人信息使用概览</div>
              <table class="data-table sp-table">
                <thead><tr><th>信息项</th><th>使用业务</th><th>授权状态</th></tr></thead>
                <tbody>
                  <tr v-for="p in privacyOverview" :key="p.item"><td>{{ p.item }}</td><td>{{ p.business }}</td><td><span class="st online">已授权</span></td></tr>
                </tbody>
              </table>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">② 隐私设置</div>
              <div class="sp-form-row" v-for="p in privacyPrefs" :key="p.item"><span class="sp-form-lbl">{{ p.item }}</span><span class="sp-form-val">{{ p.value }} <span style="margin-left:8px;font-size:11px;color:var(--text-dim)">平台统一规则</span></span></div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">③ 授权管理</div>
              <div class="sp-form-row"><span class="sp-form-lbl">已授权业务</span><span class="sp-form-val">4 项（身份认证、农业服务、数字治理、生态设备）</span></div>
            </div>
            <div style="font-size:12px;color:var(--text-dim);line-height:1.7;margin-bottom:12px">平台对个人信息进行脱敏处理，仅用于对应服务办理。完整的数据使用明细与授权管理，请前往「数据中心 → 我的数据与授权」。</div>
            <div class="sp-actions"><button class="btn btn-primary" @click="switchPage('data')">查看完整授权记录</button></div>
          </div>

          <!-- 个人设置 · 登录与设备 -->
          <div v-else-if="settingsView === 'devices'" class="settings-panel">
            <div class="sp-hd">
              <button class="sp-back" @click="settingsBack()">← 返回个人设置</button>
              <div class="sp-title">📱 登录与设备</div>
              <div class="sp-desc">最近登录与登录设备管理</div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">登录设备</div>
              <div class="sp-mod-list">
                <div class="sp-mod-card" v-for="d in loginDevices" :key="d.time">
                  <div class="sp-mod-top">
                    <div>
                      <div class="sp-mod-name">{{ d.device }} <span v-if="d.current" class="tag green" style="margin-left:6px">当前设备</span></div>
                      <div class="sp-mod-desc">{{ d.location }} · {{ d.time }}</div>
                    </div>
                    <div class="sp-mod-right">
                      <button v-if="!d.current" class="btn btn-outline btn-sm" @click="logoutDevice(d)">退出</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="sp-actions"><button class="btn btn-outline" @click="logoutOtherDevices()">退出全部其他设备</button></div>
          </div>

          <!-- 个人设置 · 帮助与反馈 -->
          <div v-else-if="settingsView === 'help'" class="settings-panel">
            <div class="sp-hd">
              <button class="sp-back" @click="settingsBack()">← 返回个人设置</button>
              <div class="sp-title">❓ 帮助与反馈</div>
              <div class="sp-desc">使用帮助、问题反馈与处理进度</div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">使用帮助</div>
              <div class="sp-mod-list">
                <div class="sp-mod-card" v-for="h in helpTopics" :key="h.q">
                  <div class="sp-mod-name">{{ h.q }}</div>
                  <div class="sp-mod-desc">{{ h.a }}</div>
                </div>
              </div>
            </div>
            <div class="sp-actions"><button class="btn btn-primary" @click="openFeedbackForm()">问题反馈</button><button class="btn btn-outline" @click="openMyFeedback()">我的反馈</button><button class="btn btn-outline" @click="switchPage('leadership')">联系村委会</button></div>
          </div>

          <!-- 个人设置 · 问题反馈 -->
          <div v-else-if="settingsView === 'feedback'" class="settings-panel">
            <div class="sp-hd">
              <button class="sp-back" @click="backToHelp()">← 返回帮助与反馈</button>
              <div class="sp-title">📝 问题反馈</div>
              <div class="sp-desc">描述遇到的问题，村委会或平台将尽快处理</div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">问题类型</div>
              <div style="display:flex;flex-wrap:wrap;gap:8px">
                <button v-for="t in feedbackTypes" :key="t" class="btn btn-sm" :class="feedbackForm.type === t ? 'btn-primary' : 'btn-outline'" @click="feedbackForm.type = t">{{ t }}</button>
              </div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">问题描述</div>
              <textarea v-model="feedbackForm.desc" class="input" style="width:100%;box-sizing:border-box;min-height:120px;resize:vertical;background:#FFFFFF;color:#1F2D3D;border:1px solid #D0D8E2;border-radius:8px;padding:10px 12px;font-size:13px;font-family:inherit" placeholder="请描述遇到的问题（建议 10 字以上）"></textarea>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">补充信息</div>
              <div class="sp-form-row"><span class="sp-form-lbl">上传截图</span><span class="sp-form-val"><button class="btn btn-outline btn-sm" @click="toast('截图上传功能开发中（最多 3 张）','info')">📷 上传截图（最多 3 张）</button></span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">联系方式</span><span class="sp-form-val"><input class="input sp-search" v-model="feedbackForm.contact" placeholder="手机号，便于回复" /></span></div>
            </div>
            <div class="sp-actions"><button class="btn btn-primary" @click="submitFeedback()">提交反馈</button><button class="btn btn-outline" @click="backToHelp()">取消</button></div>
          </div>

          <!-- 个人设置 · 我的反馈 -->
          <div v-else-if="settingsView === 'myfeedback'" class="settings-panel">
            <div class="sp-hd">
              <button class="sp-back" @click="backToHelp()">← 返回帮助与反馈</button>
              <div class="sp-title">📋 我的反馈</div>
              <div class="sp-desc">查看反馈处理进度</div>
            </div>
            <div v-if="myFeedbacks.length === 0" style="font-size:13px;color:var(--text-dim);padding:28px 0;text-align:center">暂无反馈记录</div>
            <div class="sp-mod-list">
              <div class="sp-mod-card" v-for="f in myFeedbacks" :key="f.id">
                <div class="sp-mod-name">{{ f.id }} · {{ f.type }} <span class="st" :class="feedbackStatusCls(f.status)" style="margin-left:6px">{{ f.status }}</span></div>
                <div class="sp-mod-desc" style="margin-top:6px">{{ f.desc }}</div>
                <div class="sp-mod-desc" style="margin-top:6px">提交时间：{{ f.time }}</div>
                <div v-if="f.reply" style="margin-top:8px;padding:8px 12px;background:rgba(40,199,111,0.06);border-left:2px solid var(--accent);border-radius:6px;font-size:12px;color:var(--text)"><span style="color:var(--accent);font-weight:600">回复：</span>{{ f.reply }}</div>
              </div>
            </div>
            <div class="sp-actions"><button class="btn btn-outline" @click="backToHelp()">← 返回帮助与反馈</button><button class="btn btn-primary" @click="openFeedbackForm()">＋ 新建反馈</button></div>
          </div>

          <!-- 用户管理 -->
          <div v-else-if="settingsView === 'users'" class="settings-panel">
            <div class="sp-hd">
              <button class="sp-back" @click="settingsBack()">← 返回系统设置</button>
              <div class="sp-title">👥 用户管理</div>
              <div class="sp-desc">账号、角色、权限、状态管理</div>
            </div>
            <div class="sp-toolbar">
              <input class="input sp-search" v-model="userSearch" placeholder="🔍 搜索姓名 / 手机号 / 区域" />
              <select class="sp-select" v-model="userRoleFilter"><option v-for="r in userRoles" :key="r" :value="r">{{ r === '全部' ? '全部角色' : r }}</option></select>
              <select class="sp-select" v-model="userStatusFilter"><option v-for="s in userStatuses" :key="s" :value="s">{{ s === '全部' ? '全部状态' : s }}</option></select>
              <button class="btn btn-primary" @click="openAddUser()">＋ 新增用户</button>
            </div>
            <table class="data-table sp-table">
              <thead><tr><th>姓名</th><th>手机号</th><th>所属区域</th><th>角色</th><th>账号状态</th><th>最后登录</th><th>操作</th></tr></thead>
              <tbody>
                <tr v-for="u in filteredSettingsUsers" :key="u.name" @click="showUserDetail(u)">
                  <td class="sp-name">{{ u.name }}</td>
                  <td>{{ u.phone }}</td>
                  <td>{{ u.area }}</td>
                  <td>{{ u.role }}</td>
                  <td><span class="st" :class="u.status === '正常' ? 'online' : 'offline'">{{ u.status }}</span></td>
                  <td>{{ u.lastLogin }}</td>
                  <td><span class="sp-link">查看 ›</span></td>
                </tr>
                <tr v-if="filteredSettingsUsers.length === 0"><td colspan="7" style="text-align:center;color:var(--text-dim);padding:30px">未找到匹配的用户</td></tr>
              </tbody>
            </table>
          </div>

          <!-- 模块配置 -->
          <div v-else-if="settingsView === 'modules'" class="settings-panel">
            <div class="sp-hd">
              <button class="sp-back" @click="settingsBack()">← 返回系统设置</button>
              <div class="sp-title">🧩 模块配置</div>
              <div class="sp-desc">控制平台业务模块启用与适用角色</div>
            </div>
            <div class="sp-mod-list">
              <div class="sp-mod-card" v-for="m in moduleConfigs" :key="m.name" :class="{ disabled: !m.configurable }">
                <div class="sp-mod-top">
                  <div>
                    <div class="sp-mod-name">{{ m.name }} <span v-if="m.tag" class="tag yellow" style="margin-left:6px">{{ m.tag }}</span></div>
                    <div class="sp-mod-desc">{{ m.desc }}</div>
                  </div>
                  <div class="sp-mod-right">
                    <span class="sp-mod-status" :class="m.enabled ? 'on' : 'off'">{{ m.enabled ? '已启用' : '未启用' }}</span>
                    <span class="sp-switch" :class="{ on: m.enabled, dis: !m.configurable }" @click="toggleModuleConfig(m)"><i></i></span>
                  </div>
                </div>
                <div class="sp-mod-roles">
                  <span class="sp-role-lbl">适用角色：</span>
                  <span class="sp-role-chip" :class="{ on: m.roles.villager }" @click="toggleModuleRole(m, 'villager')">村民</span>
                  <span class="sp-role-chip" :class="{ on: m.roles.cadre }" @click="toggleModuleRole(m, 'cadre')">村干部</span>
                  <span class="sp-role-chip" :class="{ on: m.roles.admin }" @click="toggleModuleRole(m, 'admin')">管理员</span>
                  <span v-if="!m.configurable" class="sp-role-hint">（建设中 / 规划中模块暂不可配置）</span>
                </div>
              </div>
            </div>
            <div class="sp-actions"><button class="btn btn-primary" @click="toast('模块配置已保存','success')">保存配置</button></div>
          </div>

          <!-- 通知设置 -->
          <div v-else-if="settingsView === 'notify'" class="settings-panel">
            <div class="sp-hd">
              <button class="sp-back" @click="settingsBack()">← 返回系统设置</button>
              <div class="sp-title">🔔 通知设置</div>
              <div class="sp-desc">通知渠道、通知规则、接收对象与时段策略</div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">通知渠道</div>
              <div class="sp-channel-grid">
                <div class="sp-channel" v-for="ch in channelList" :key="ch.key">
                  <span class="sp-channel-icon">{{ ch.icon }}</span>
                  <span class="sp-channel-name">{{ ch.name }}</span>
                  <span class="sp-switch" :class="{ on: notifyChannels[ch.key] }" @click="notifyChannels[ch.key] = !notifyChannels[ch.key]"><i></i></span>
                </div>
              </div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">通知规则</div>
              <div class="sp-toolbar">
                <span style="font-size:12px;color:var(--text-dim)">共 {{ notifyRules.length }} 条规则</span>
                <button class="btn btn-primary" style="margin-left:auto" @click="openNotifyRuleForm(null)">＋ 新增规则</button>
              </div>
              <table class="data-table sp-table">
                <thead><tr><th>通知事件</th><th>通知渠道</th><th>接收对象</th><th>操作</th></tr></thead>
                <tbody>
                  <tr v-for="r in notifyRules" :key="r.id">
                    <td>{{ r.event }}</td>
                    <td>{{ r.channels.join(' + ') }}</td>
                    <td>{{ r.targets }}</td>
                    <td>
                      <button class="btn btn-outline btn-sm" @click="openNotifyRuleForm(r)">编辑</button>
                      <button class="btn btn-outline btn-sm" style="color:#E05252;border-color:#E05252" @click="deleteNotifyRule(r.id)">删除</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">高级策略</div>
              <div class="sp-form-row"><span class="sp-form-lbl">免打扰时间</span><span class="sp-form-val"><span class="sp-switch" :class="{ on: notifyDnd.enabled }" @click="notifyDnd.enabled = !notifyDnd.enabled"><i></i></span><span style="margin:0 8px">{{ notifyDnd.start }} - {{ notifyDnd.end }}</span></span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">重复通知间隔</span><span class="sp-form-val">每 {{ notifyRepeat }} 分钟</span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">紧急通知例外</span><span class="sp-form-val"><span class="sp-switch" :class="{ on: notifyUrgent }" @click="notifyUrgent = !notifyUrgent"><i></i></span><span style="margin-left:8px">紧急事件不受免打扰限制</span></span></div>
            </div>
            <div class="sp-actions"><button class="btn btn-primary" @click="toast('通知设置已保存','success')">保存设置</button></div>
          </div>

          <!-- 操作日志 -->
          <div v-else-if="settingsView === 'logs'" class="settings-panel">
            <div class="sp-hd">
              <button class="sp-back" @click="settingsBack()">← 返回系统设置</button>
              <div class="sp-title">📋 操作日志</div>
              <div class="sp-desc">审计、操作记录、数据变更记录查询</div>
            </div>
            <div class="tabs"><button v-for="t in logTabs" :key="t" class="tab" :class="{ active: logTab === t }" @click="logTab = t">{{ t }}</button></div>
            <div class="sp-toolbar">
              <input class="input sp-search" v-model="logSearch" placeholder="🔍 搜索操作人 / 内容 / 模块" />
              <select class="sp-select" v-model="logOperatorFilter"><option v-for="o in logOperators" :key="o" :value="o">{{ o === '全部' ? '全部操作人' : o }}</option></select>
              <select class="sp-select" v-model="logModuleFilter"><option v-for="m in logModules" :key="m" :value="m">{{ m === '全部' ? '全部模块' : m }}</option></select>
              <select class="sp-select" v-model="logResultFilter"><option v-for="r in logResults" :key="r" :value="r">{{ r === '全部' ? '全部结果' : r }}</option></select>
            </div>
            <table class="data-table sp-table">
              <thead><tr><th>时间</th><th>操作人</th><th>角色</th><th>操作模块</th><th>操作内容</th><th>结果</th><th>IP / 设备</th><th>操作</th></tr></thead>
              <tbody>
                <tr v-for="l in filteredSettingsLogs" :key="l.time + l.content" @click="showLogDetail(l)">
                  <td>{{ l.time }}</td>
                  <td>{{ l.operator }}</td>
                  <td>{{ l.role }}</td>
                  <td>{{ l.module }}</td>
                  <td>{{ l.content }}</td>
                  <td><span class="st" :class="l.result === '成功' ? 'online' : 'offline'">{{ l.result }}</span></td>
                  <td>{{ l.ip }}</td>
                  <td><span class="sp-link">查看 ›</span></td>
                </tr>
                <tr v-if="filteredSettingsLogs.length === 0"><td colspan="8" style="text-align:center;color:var(--text-dim);padding:30px">未找到匹配的日志</td></tr>
              </tbody>
            </table>
          </div>

          <!-- 安全设置 -->
          <div v-else-if="settingsView === 'security'" class="settings-panel">
            <div class="sp-hd">
              <button class="sp-back" @click="settingsBack()">← 返回系统设置</button>
              <div class="sp-title">🔐 安全设置</div>
              <div class="sp-desc">登录安全、密码策略、访问控制与隐私保护</div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">账号安全</div>
              <div class="sp-form-row"><span class="sp-form-lbl">密码最小长度</span><span class="sp-form-val">{{ securitySettings.pwdMinLen }} 位</span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">密码复杂度</span><span class="sp-form-val"><span class="sp-switch" :class="{ on: securitySettings.pwdComplexity }" @click="securitySettings.pwdComplexity = !securitySettings.pwdComplexity"><i></i></span><span style="margin-left:8px">字母 + 数字 + 特殊字符</span></span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">密码有效期</span><span class="sp-form-val">{{ securitySettings.pwdExpiry }} 天</span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">首次登录修改密码</span><span class="sp-form-val"><span class="sp-switch" :class="{ on: securitySettings.firstLoginChange }" @click="securitySettings.firstLoginChange = !securitySettings.firstLoginChange"><i></i></span></span></div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">登录安全</div>
              <div class="sp-form-row"><span class="sp-form-lbl">连续登录失败锁定</span><span class="sp-form-val">失败 {{ securitySettings.loginFailLock }} 次锁定 {{ securitySettings.loginFailLockMinutes }} 分钟</span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">异地登录提醒</span><span class="sp-form-val"><span class="sp-switch" :class="{ on: securitySettings.remoteLoginAlert }" @click="securitySettings.remoteLoginAlert = !securitySettings.remoteLoginAlert"><i></i></span></span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">管理员二次验证</span><span class="sp-form-val"><span class="sp-switch" :class="{ on: securitySettings.adminSecondVerify }" @click="securitySettings.adminSecondVerify = !securitySettings.adminSecondVerify"><i></i></span></span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">登录超时时间</span><span class="sp-form-val">{{ securitySettings.loginTimeout }} 分钟</span></div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">访问控制</div>
              <div class="sp-form-row"><span class="sp-form-lbl">后台访问限制</span><span class="sp-form-val"><span class="sp-switch" :class="{ on: securitySettings.adminAccessRestrict }" @click="securitySettings.adminAccessRestrict = !securitySettings.adminAccessRestrict"><i></i></span><span style="margin-left:8px">仅白名单 IP / 内网访问</span></span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">敏感操作二次确认</span><span class="sp-form-val"><span class="sp-switch" :class="{ on: securitySettings.sensitiveOpConfirm }" @click="securitySettings.sensitiveOpConfirm = !securitySettings.sensitiveOpConfirm"><i></i></span></span></div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">隐私与数据</div>
              <div class="sp-form-row"><span class="sp-form-lbl">手机号脱敏</span><span class="sp-form-val"><span class="sp-switch" :class="{ on: securitySettings.phoneMask }" @click="securitySettings.phoneMask = !securitySettings.phoneMask"><i></i></span></span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">身份证脱敏</span><span class="sp-form-val"><span class="sp-switch" :class="{ on: securitySettings.idCardMask }" @click="securitySettings.idCardMask = !securitySettings.idCardMask"><i></i></span></span></div>
              <div class="sp-form-row"><span class="sp-form-lbl">敏感数据导出权限</span><span class="sp-form-val"><span class="sp-switch" :class="{ on: securitySettings.sensitiveExportAuth }" @click="securitySettings.sensitiveExportAuth = !securitySettings.sensitiveExportAuth"><i></i></span><span style="margin-left:8px">仅管理员可导出</span></span></div>
            </div>
            <div class="sp-actions"><button class="btn btn-primary" @click="toast('安全设置已保存','success')">保存设置</button></div>
          </div>

          <!-- 数据备份 -->
          <div v-else-if="settingsView === 'backup'" class="settings-panel">
            <div class="sp-hd">
              <button class="sp-back" @click="settingsBack()">← 返回系统设置</button>
              <div class="sp-title">💾 数据备份</div>
              <div class="sp-desc">自动备份、手动备份、恢复记录</div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">自动备份</div>
              <div class="sp-backup-status">
                <div class="sp-backup-line"><span class="sp-form-lbl">状态</span><span class="sp-form-val" style="color:var(--accent)">● {{ backupAuto.enabled ? '已开启' : '已关闭' }}</span></div>
                <div class="sp-backup-line"><span class="sp-form-lbl">频率</span><span class="sp-form-val">{{ backupAuto.freq }}</span></div>
                <div class="sp-backup-line"><span class="sp-form-lbl">保留周期</span><span class="sp-form-val">{{ backupAuto.retain }}</span></div>
                <div class="sp-backup-line"><span class="sp-form-lbl">最近备份</span><span class="sp-form-val">{{ backupAuto.lastTime }}</span></div>
                <div class="sp-backup-line"><span class="sp-form-lbl">最近结果</span><span class="sp-form-val" style="color:var(--accent)">✓ {{ backupAuto.lastResult }}</span></div>
              </div>
              <div class="sp-actions"><button class="btn btn-primary" @click="doBackup()">立即备份</button></div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">备份记录</div>
              <div class="sp-toolbar">
                <span style="font-size:12px;color:var(--text-dim)">共 {{ backupRecords.length }} 条备份记录</span>
                <button class="btn btn-outline" style="margin-left:auto" @click="exportBackupRecords()">⬇ 导出记录</button>
              </div>
              <table class="data-table sp-table">
                <thead><tr><th>备份时间</th><th>类型</th><th>大小</th><th>状态</th><th>操作</th></tr></thead>
                <tbody>
                  <tr v-for="b in backupRecords" :key="b.time">
                    <td>{{ b.time }}</td>
                    <td>{{ b.type }}</td>
                    <td>{{ b.size }}</td>
                    <td><span class="st" :class="b.status === '成功' ? 'online' : 'offline'">{{ b.status }}</span></td>
                    <td><span class="sp-link" @click.stop="showRestore(b)">恢复</span></td>
                  </tr>
                </tbody>
              </table>
              <div style="font-size:11px;color:var(--text-dim);margin-top:8px">⚠️ 数据恢复为高风险操作，需二次确认后执行，恢复期间系统短暂不可用。</div>
            </div>
          </div>

          <!-- 民宿管理 -->
          <div v-else-if="settingsView === 'bnb'" class="settings-panel">
            <div class="sp-hd">
              <button class="sp-back" @click="settingsBack()">← 返回系统设置</button>
              <div class="sp-title">🏡 民宿管理</div>
              <div class="sp-desc">民宿上架、审核、经营状态管理</div>
            </div>
            <div class="stat-grid" style="margin-bottom:14px">
              <div class="stat-card"><div><div class="sc-val">{{ settingsBnbs.length }}</div><div class="sc-lbl">民宿总数</div><div class="sc-sub">村域文旅</div></div><div class="sc-icon" style="background:rgba(57,217,138,0.12)">🏡</div></div>
              <div class="stat-card g"><div><div class="sc-val">{{ settingsBnbs.filter(b => b.status === '营业中').length }}</div><div class="sc-lbl">营业中</div><div class="sc-sub">正常经营</div></div><div class="sc-icon" style="background:rgba(57,217,138,0.12)">🟢</div></div>
              <div class="stat-card y"><div><div class="sc-val">{{ settingsBnbs.filter(b => b.status === '审核中').length }}</div><div class="sc-lbl">待审核</div><div class="sc-sub">待处理</div></div><div class="sc-icon" style="background:rgba(245,184,61,0.14)">🟡</div></div>
            </div>
            <table class="data-table sp-table">
              <thead><tr><th>民宿</th><th>业主</th><th>房间</th><th>价格</th><th>评分</th><th>预订</th><th>月营收</th><th>状态</th><th>操作</th></tr></thead>
              <tbody>
                <tr v-for="b in settingsBnbs" :key="b.id">
                  <td class="sp-name">{{ b.name }}</td>
                  <td>{{ b.owner }}</td>
                  <td>{{ b.rooms }}间</td>
                  <td>¥{{ b.price }}</td>
                  <td>⭐{{ b.rating }}</td>
                  <td>{{ b.bookings }}</td>
                  <td style="color:var(--accent);font-weight:600">{{ b.revenue }}</td>
                  <td><span class="st" :class="bnbStatusCls[b.status] || 'offline'">{{ b.status }}</span></td>
                  <td><button v-if="b.status === '审核中'" class="btn btn-primary btn-sm" @click="approveBnb(b.id)">通过</button><button v-else-if="b.status === '营业中'" class="btn btn-outline btn-sm" @click="offlineBnb(b.id)">下架</button><button v-else class="btn btn-primary btn-sm" @click="relistBnb(b.id)">重新上架</button></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 订单管理 -->
          <div v-else-if="settingsView === 'orders'" class="settings-panel">
            <div class="sp-hd">
              <button class="sp-back" @click="settingsBack()">← 返回系统设置</button>
              <div class="sp-title">📋 订单管理</div>
              <div class="sp-desc">民宿、门票、活动订单查询与汇总</div>
            </div>
            <div class="stat-grid" style="margin-bottom:14px">
              <div class="stat-card"><div><div class="sc-val">{{ settingsOrders.length }}</div><div class="sc-lbl">总订单</div><div class="sc-sub">全部交易</div></div><div class="sc-icon" style="background:rgba(14,165,233,.10)">📋</div></div>
              <div class="stat-card y"><div><div class="sc-val">{{ settingsOrders.filter(o => o.status === '待支付').length }}</div><div class="sc-lbl">待支付</div><div class="sc-sub">待处理</div></div><div class="sc-icon" style="background:rgba(245,184,61,0.14)">🟡</div></div>
              <div class="stat-card g"><div><div class="sc-val">{{ settingsOrders.filter(o => o.status === '已支付').length }}</div><div class="sc-lbl">已支付</div><div class="sc-sub">已完成</div></div><div class="sc-icon" style="background:rgba(57,217,138,0.12)">🟢</div></div>
              <div class="stat-card"><div><div class="sc-val">¥{{ settingsOrderTotal.toLocaleString() }}</div><div class="sc-lbl">订单总额</div><div class="sc-sub">累计</div></div><div class="sc-icon" style="background:rgba(139,92,246,.12)">💰</div></div>
            </div>
            <div class="sp-toolbar">
              <span style="font-size:12px;color:var(--text-dim)">共 {{ settingsOrders.length }} 笔订单 · 已支付订单可退款</span>
              <button class="btn btn-outline" style="margin-left:auto" @click="exportOrders()">⬇ 导出报表</button>
            </div>
            <table class="data-table sp-table">
              <thead><tr><th>订单号</th><th>类型</th><th>项目</th><th>买家</th><th>金额</th><th>日期</th><th>状态</th><th>操作</th></tr></thead>
              <tbody>
                <tr v-for="o in settingsOrders" :key="o.id">
                  <td>{{ o.id }}</td>
                  <td><span class="tag blue">{{ o.type }}</span></td>
                  <td>{{ o.item }}</td>
                  <td>{{ o.buyer }}</td>
                  <td style="color:var(--accent);font-weight:600">¥{{ o.amt.toLocaleString() }}</td>
                  <td>{{ o.date }}</td>
                  <td><span class="st" :class="orderStatusCls[o.status] || 'offline'">{{ o.status }}</span></td>
                  <td>
                    <button v-if="o.status === '已支付'" class="btn btn-outline btn-sm" @click="refundOrder(o.id)">退款</button>
                    <span v-else style="font-size:11px;color:var(--text-dim)">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 审核中心 -->
          <div v-else-if="settingsView === 'audit'" class="settings-panel">
            <div class="sp-hd">
              <button class="sp-back" @click="settingsBack()">← 返回系统设置</button>
              <div class="sp-title">🔔 审核中心</div>
              <div class="sp-desc">民宿、补贴、项目等审核事项处理</div>
            </div>
            <div class="stat-grid" style="margin-bottom:14px">
              <div class="stat-card"><div><div class="sc-val">{{ settingsAudits.length }}</div><div class="sc-lbl">审核总数</div><div class="sc-sub">全部事项</div></div><div class="sc-icon" style="background:rgba(14,165,233,.10)">🔔</div></div>
              <div class="stat-card y"><div><div class="sc-val">{{ settingsAudits.filter(a => a.status === '待审核').length }}</div><div class="sc-lbl">待审核</div><div class="sc-sub">待处理</div></div><div class="sc-icon" style="background:rgba(245,184,61,0.14)">🟡</div></div>
              <div class="stat-card g"><div><div class="sc-val">{{ settingsAudits.filter(a => a.status === '已通过').length }}</div><div class="sc-lbl">已通过</div><div class="sc-sub">已完成</div></div><div class="sc-icon" style="background:rgba(57,217,138,0.12)">🟢</div></div>
              <div class="stat-card r"><div><div class="sc-val">{{ settingsAudits.filter(a => a.status === '已驳回').length }}</div><div class="sc-lbl">已驳回</div><div class="sc-sub">已处理</div></div><div class="sc-icon" style="background:rgba(239,68,68,0.12)">🔴</div></div>
            </div>
            <div class="sp-toolbar">
              <span style="font-size:12px;color:var(--text-dim)">已选 {{ auditSelected.length }} 项待审核 · 点击项目名查看详情</span>
              <button class="btn btn-primary" style="margin-left:auto" @click="batchApproveAudits()">✓ 批量通过</button>
            </div>
            <table class="data-table sp-table">
              <thead>
                <tr>
                  <th style="width:36px"><input type="checkbox" :checked="allSelected" @change="toggleAuditSelectAll()" /></th>
                  <th>类型</th><th>项目</th><th>申请人</th><th>日期</th><th>状态</th><th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="a in settingsAudits" :key="a.id">
                  <td><input v-if="a.status === '待审核'" type="checkbox" :checked="auditSelected.includes(a.id)" @change="toggleAuditSelect(a.id)" /><span v-else style="color:var(--text-dim)">—</span></td>
                  <td><span class="tag blue">{{ a.type }}</span></td>
                  <td><span class="sp-link" style="font-weight:600" @click="showAuditDetail(a)">{{ a.item }}</span></td>
                  <td>{{ a.applicant }}</td>
                  <td>{{ a.date }}</td>
                  <td><span class="st" :class="auditStatusCls[a.status] || 'offline'">{{ a.status }}</span></td>
                  <td>
                    <template v-if="a.status === '待审核'">
                      <button class="btn btn-primary btn-sm" @click="approveAudit(a.id)">通过</button>
                      <button class="btn btn-outline btn-sm" @click="rejectAudit(a.id)">驳回</button>
                    </template>
                    <span v-else style="font-size:11px;color:var(--text-dim)">已处理</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 系统运行（旧技术数据 · 管理员专属） -->
          <div v-else-if="settingsView === 'runtime'" class="settings-panel">
            <div class="sp-hd">
              <button class="sp-back" @click="settingsBack()">← 返回系统设置</button>
              <div class="sp-title">🗄️ 系统运行</div>
              <div class="sp-desc">数据资产、累计订单、民宿营收等运行指标</div>
              <button class="sp-back" style="margin-left:auto" @click="runtimeLoaded = false; loadRuntimeStats()">⟳ 刷新</button>
            </div>
            <div class="stat-grid" style="margin-bottom:14px">
              <div class="stat-card" v-for="s in dataStats" :key="s.label"><div><div class="sc-val">{{ s.value }}</div><div class="sc-lbl">{{ s.label }}</div><div class="sc-sub">{{ s.sub }}</div></div><div class="sc-icon" :style="{background:s.iconBg}">{{ s.icon }}</div></div>
            </div>
            <div class="sp-section">
              <div class="sp-section-hd">数据资产覆盖</div>
              <div class="sp-form-row" v-for="a in dataAssets" :key="a.label">
                <span class="sp-form-lbl">{{ a.label }}</span>
                <span class="sp-form-val" style="flex:1;display:flex;align-items:center;gap:10px">
                  <span style="width:160px;height:8px;background:#E8EEF3;border-radius:999px;overflow:hidden;display:inline-block"><span :style="{ display:'block', height:'100%', width: a.pct + '%', background: a.pct >= 80 ? '#22B573' : a.pct >= 60 ? '#0EA5E9' : '#F2A62B', borderRadius:'999px' }"></span></span>
                  <span style="font-size:12px;color:var(--text-dim)">{{ a.count }} · {{ a.pct }}%</span>
                </span>
              </div>
            </div>
            <div style="font-size:11px;color:var(--text-dim);line-height:1.7">{{ runtimeLoading ? '正在从后端加载实时统计…' : (runtimeLoaded ? '以上数据来自后端实时统计接口（/api/v1/stats）。' : '后端接口未连接，当前显示静态技术指标。') }}仅供管理员参考，农户端数据中心不展示技术架构指标。</div>
          </div>

        </div>

        <!-- ==================== PAGE: Monitor (监控宫格) ==================== -->
        <div v-show="currentPage === 'monitor'" class="page-content eco-theme" key="monitor">
          <div style="padding:6px 4px 12px">
            <div style="margin-bottom:16px">
              <div style="font-size:22px;font-weight:700;color:#1F2D3D">📷 视频监控中心</div>
              <div style="font-size:15px;color:#66788A;margin-top:4px">32路视频监控 · 实时状态 · 异常告警</div>
            </div>
            <!-- 统计 -->
            <div class="stat-grid">
              <div class="stat-card"><div><div class="sc-val">32</div><div class="sc-lbl">监控路数</div><div class="sc-sub">覆盖全村重点区域</div></div><div class="sc-icon" style="background:rgba(14,165,233,.10)">📹</div></div>
              <div class="stat-card g"><div><div class="sc-val">30</div><div class="sc-lbl">在线</div><div class="sc-sub">在线率 93.8%</div></div><div class="sc-icon" style="background:rgba(57,217,138,0.12)">🟢</div></div>
              <div class="stat-card r"><div><div class="sc-val">2</div><div class="sc-lbl">离线</div><div class="sc-sub">待排查</div></div><div class="sc-icon" style="background:rgba(239,68,68,0.12)">🔴</div></div>
            </div>
            <!-- 筛选 + 搜索 -->
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;flex-wrap:wrap">
              <div class="device-filter-tabs">
                <button v-for="c in camCategories" :key="c" class="device-filter-btn" :class="{active: camFilter === c}" @click="camFilter = c">{{ c }}</button>
              </div>
              <div class="device-search">
                <span>🔍</span><input v-model="camSearch" placeholder="搜索摄像头" />
              </div>
            </div>
            <!-- 监控宫格 -->
            <div class="camera-grid">
              <div class="camera-card" v-for="c in filteredCameras" :key="c.id" @click="showCameraDetail(c)">
                <div class="cam-preview">
                  <div class="cam-scene" v-html="cctvScene(c)"></div>
                  <div class="cam-osd">
                    <div class="cam-osd-top">
                      <span class="cam-osd-id">{{ c.id }}</span>
                      <span class="cam-osd-live" :class="c.status === '在线' ? 'on' : 'off'"><i class="dot"></i>{{ c.status === '在线' ? 'LIVE' : '离线' }}</span>
                    </div>
                    <div class="cam-osd-bot">
                      <span class="cam-osd-time">{{ clockTime }}</span>
                      <span class="cam-osd-res">{{ c.resolution }}</span>
                    </div>
                  </div>
                </div>
                <div class="cam-foot">
                  <div class="cam-name">{{ c.name }}</div>
                  <div class="cam-loc">{{ c.location }}</div>
                  <span class="cam-btn">查看实时画面 ›</span>
                </div>
              </div>
              <div v-if="filteredCameras.length === 0" class="device-empty">未找到匹配的摄像头</div>
              <div style="grid-column:1/-1;text-align:center;font-size:14px;color:#8A97A5;margin-top:2px">演示数据：列表展示代表摄像头，全村共 32 路，完整台账正式接入后展示全部</div>
            </div>
          </div>
        </div>

      </div><!-- /content-area -->
    </div><!-- /main-wrap -->

    <!-- Detail Panel (slide-in right) -->
    <div class="detail-panel" :class="{ open: detailOpen }">
      <div class="detail-hd">
        <h3>{{ detailTitle }}</h3>
        <button class="detail-close" @click="closeDetail">✕</button>
      </div>
      <div class="detail-bd" v-html="detailContent"></div>
    </div>

    <!-- Modal -->
    <div class="modal" :class="{ show: modalOpen }">
      <div class="modal-bg" @click="closeModal"></div>
      <div class="modal-box" v-html="modalContent"></div>
    </div>

    <!-- Toast Container -->
    <div class="toast-container">
      <div v-for="t in toasts" :key="t.id" :class="['toast', 'toast-'+t.type]">{{ t.msg }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import * as echarts from 'echarts'
import PestWarningCenter from '@/views/industry/agriculture/PestWarningCenter.vue'
import IndustryPage from '@/views/dashboard/IndustryPage.vue'
import ServicePage from '@/views/dashboard/ServicePage.vue'
import { getStats } from '@/api/stats'
import { submitServiceRequest, listMyServiceRequests, listAllServiceRequests, replyServiceRequest } from '@/api/serviceRequest'
import { listPolicies } from '@/api/policy'
import { listLand } from '@/api/land'
import { listCrop } from '@/api/crop'
import { listSubsidy } from '@/api/subsidy'
import { listInsurance } from '@/api/insurance'
import { listLivestock } from '@/api/livestock'
import { listMyProducts, addProduct, deleteProduct } from '@/api/business'
import { listMySaleProducts, addSaleProduct, deleteSaleProduct } from '@/api/farmerBiz'
import { listPendingProducts, approveProduct, rejectProduct } from '@/api/productReview'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
const route = useRoute()
const activeSubTab = ref('lands')

function handleIndustryCard(m) {
  const label = m.label || m.title || ''
  const map = {'地块管理':'lands','作物档案':'crops','农事记录':'records','生长监测':'monitor','水肥管理':'irrigation','病虫害预警':'pest','农产品商城':'products','品牌溯源':'trace','物流管理':'products','运营分析':'products','订单中心':'orders','直播带货':'products','景区管理':'spots','民宿管理':'bnbs','活动管理':'activities','数字非遗':'spots','养殖档案':'records2','环境监测':'env','疫病预警':'pest','出栏预测':'records2'}
  if (map[label]) activeSubTab.value = map[label]
  if (label) { switchPage('industry'); return }
  openModuleDetail(m)
}

// ---- State ----
const sidebarCollapsed = ref(false)
const sidebarOpen = ref(false)
const isMobile = ref(false)
const isFullscreen = ref(false)
let _preFullscreenSidebar = null
const treeOpen = ref(false)
const currentPage = ref('dashboard')
const pageTitle = ref('乡村驾驶舱')
const clockTime = ref('00:00:00')
const clockDate = ref('')
const clockDateEn = ref('')
const chatInput = ref('')
const toasts = ref([])
let toastId = 0

const detailOpen = ref(false)
const detailTitle = ref('')
const detailContent = ref('')
const modalOpen = ref(false)
const modalContent = ref('')

const aiStats = [
  { label: '发现异常', value: 4, color: '#ff4d5a' },
  { label: '自动研判', value: 3, color: '#ffcc33' },
  { label: '待确认', value: 1, color: '#00eaff' }
]
const aiConclusion = ref('农业用水存在异常波动，建议关注3号水塘水质及灌溉水压')

const industryTab = ref('farming')

// 设备中心筛选状态（IoT / 视频监控）
const iotFilter = ref('全部')
const iotSearch = ref('')
const camFilter = ref('全部')
const camSearch = ref('')

// ---- Refs ----
const particlesCvs = ref(null)
const contentArea = ref(null)
const leafletMap = ref(null)
const mapBox = ref(null)
const chatAreaRef = ref(null)
const servicePageRef = ref(null)

// Chart refs
const chartDashAge = ref(null)
const chartDashIndustry = ref(null)
const chartEcoAir = ref(null)
const chartEcoWater = ref(null)
const chartEcoCarbon = ref(null)
const chartIotStatus = ref(null)
const chartIotFlow = ref(null)

// ---- Page titles ----
const pageTitles = {
  home: '我的工作台', myfarm: '我的产业', sell: '我要卖', business: '经营主体工作台', dashboard: '乡村驾驶舱', industry: '数字产业中心', governance: '数字治理中心',
  ecology: '生态治理中心', service: '数字服务中心', iot: 'IoT设备感知',
  data: '数据中心', leadership: '村委班子', device: '设备中心', settings: '系统设置', monitor: '视频监控中心', pest: 'AI病虫害预警中心', review: '产品审核'
}

// 村民「我的工作台」待办与概览：由后端真实数据（按 farmer_id 行级过滤）动态汇总
const farmerTodos = computed(() => {
  const list = []
  // 被驳回的挂售产品 → 提醒修改
  sellProducts.value.filter(p => p.status === '已驳回').forEach(p => {
    list.push({ icon: '🛒', title: `「${p.name}」上架被驳回`, desc: p.reviewNote || '请修改信息后重新提交', actionLabel: '去修改', action: () => switchPage('sell') })
  })
  // 待审核的挂售产品
  sellProducts.value.filter(p => p.status === '待审核').forEach(p => {
    list.push({ icon: '🛒', title: `「${p.name}」待村干部审核`, desc: '已提交，审核通过后自动上架', actionLabel: '查看', action: () => switchPage('sell') })
  })
  // 办理中的诉求
  const srTypeLabel = { infrastructure: '基础设施', environment: '环境卫生', safety: '安全隐患', agriculture: '农业生产', elderly: '老人关怀', other: '其他事项' }
  myServiceRequests.value.filter(r => r.status === 'PENDING' || r.status === 'PROCESSING').forEach(r => {
    const typeLabel = srTypeLabel[r.requestType] || r.requestType || '诉求'
    list.push({ icon: '📝', title: `${typeLabel}办理中`, desc: '村委已受理，请留意回复', actionLabel: '查进度', action: () => switchPage('data') })
  })
  // 尚未发放的补贴
  mySubsidyRows.value.filter(s => s.status !== '已发放' && s.status !== '已到账').forEach(s => {
    list.push({ icon: '🧾', title: `${s.type || '惠农补贴'}待发放`, desc: s.status || '材料审核中', actionLabel: '去办理', action: () => openServiceTab('subsidy') })
  })
  if (!list.length) list.push({ icon: '✅', title: '暂无待办事项', desc: '您的业务均已处理完毕', actionLabel: '去办事', action: () => switchPage('service') })
  return list
})
const farmerOverview = computed(() => {
  const lands = myLandRows.value
  const subsidies = mySubsidyRows.value
  const insurances = myInsuranceRows.value
  const totalArea = lands.reduce((s, l) => s + (Number(l.area) || 0), 0)
  const paidAmount = subsidies.filter(s => s.status === '已发放' || s.status === '已到账').reduce((sum, s) => sum + (Number(s.amount) || 0), 0)
  const insured = insurances.some(i => (i.medStatus && i.medStatus !== '未参保') || (i.penStatus && i.penStatus !== '未领取'))
  const bizCount = myServiceRequests.value.length
  return [
    { icon: '💰', iconBg: 'rgba(34,181,115,.12)', value: '¥' + paidAmount.toLocaleString('zh-CN'), label: '我的补贴（已到账）', action: () => switchPage('data') },
    { icon: '💊', iconBg: 'rgba(14,165,233,.12)', value: insured ? '已参保' : '未参保', label: '我的医保', action: () => switchPage('data') },
    { icon: '📝', iconBg: 'rgba(139,92,246,.12)', value: bizCount + ' 件', label: '我的办事记录', action: () => switchPage('data') },
    { icon: '🌾', iconBg: 'rgba(242,166,43,.14)', value: totalArea > 0 ? totalArea.toFixed(1) + ' 亩' : '—', label: '我的地块', action: () => switchPage('myfarm') }
  ]
})

// 村民「我的产业」—— 我的地 / 我的作物 / 我的养殖 / 我的灌溉（仅本人，演示样板）
const myFarmTab = ref('lands')
const myFarmTabs = [
  { key: 'lands', icon: '🌾', label: '我的地', sub: '地块与面积' },
  { key: 'crops', icon: '🌱', label: '我的作物', sub: '品种与长势' },
  { key: 'livestock', icon: '🐓', label: '我的养殖', sub: '存栏与健康' },
  { key: 'irrigation', icon: '💧', label: '我的灌溉', sub: '控制与记录' }
]
function switchMyFarmTab(key) { myFarmTab.value = key }
// 我的产业数据源：直接复用后端真实接口返回的本人数据（myLandRows / myCropRows / myLivestockRows）
function cropEmoji(name) {
  const n = name || ''
  if (n.includes('玉米')) return '🌽'
  if (n.includes('油菜')) return '🌼'
  if (n.includes('水稻') || n.includes('稻')) return '🌾'
  if (n.includes('苹果')) return '🍎'
  if (n.includes('桃') || n.includes('李')) return '🍑'
  if (n.includes('樱桃')) return '🍒'
  if (n.includes('蔬菜') || n.includes('菜') || n.includes('番茄') || n.includes('黄瓜')) return '🥬'
  return '🌱'
}
function livestockEmoji(type, breed, batchName) {
  const s = `${type || ''}${breed || ''}${batchName || ''}`
  if (s.includes('鸡')) return '🐓'
  if (s.includes('猪')) return '🐖'
  if (s.includes('牛')) return '🐂'
  if (s.includes('羊')) return '🐑'
  if (s.includes('鸭')) return '🦆'
  if (s.includes('鱼') || s.includes('虾') || s.includes('鲈')) return '🐟'
  return '🐄'
}
const myIrrigationRecords = [
  { id: 'IR1', device: '蜂糖李园滴灌', start: '2026-08-14 06:00', duration: '2.5 小时', water: '18.6 m³', status: '已完成' },
  { id: 'IR2', device: '富硒黄桃园滴灌', start: '2026-08-12 05:30', duration: '1.8 小时', water: '13.2 m³', status: '已完成' },
  { id: 'IR3', device: '蜂糖李园滴灌', start: '2026-08-09 06:00', duration: '2.2 小时', water: '16.4 m³', status: '已完成' }
]
// 总览层：由后端本人地块/作物数据自动汇总
const myFarmSummary = computed(() => {
  const lands = myLandRows.value, crops = myCropRows.value
  const totalArea = lands.reduce((s, l) => s + (Number(l.area) || 0), 0)
  const irrigated = lands.filter(l => l.irrigation).length
  const coverage = lands.length ? Math.round(irrigated / lands.length * 1000) / 10 : 0
  return [
    { icon: '🌾', iconBg: 'rgba(34,181,115,.12)', value: `${lands.length} 块`, label: '我的地块', sub: '自有耕地', cls: 'g' },
    { icon: '📐', iconBg: 'rgba(14,165,233,.12)', value: `${totalArea.toFixed(1)} 亩`, label: '土地面积', sub: '合计', cls: '' },
    { icon: '🌱', iconBg: 'rgba(139,92,246,.12)', value: `${crops.length} 类`, label: '在种作物', sub: '经济作物', cls: '' },
    { icon: '💧', iconBg: 'rgba(242,166,43,.14)', value: `${coverage}%`, label: '灌溉覆盖率', sub: `${irrigated}/${lands.length} 块已覆盖`, cls: 'y' }
  ]
})
// 当前生产情况：按种植作物分布统计地块数
const cropStats = computed(() => {
  const map = {}
  myLandRows.value.forEach(l => { const k = l.crop || '未登记'; map[k] = (map[k] || 0) + 1 })
  return Object.entries(map).map(([name, count]) => ({ name, count }))
})
const attentionItems = computed(() => {
  const list = myLandRows.value.filter(l => !l.irrigation).map(l => ({ title: `${l.name}未覆盖灌溉`, desc: '建议完善滴灌设施，避免旱季减产' }))
  if (!list.length) list.push({ title: '各生产单元运行正常', desc: '暂无风险项，继续保持' })
  return list
})
function showLandMap() { toast('地块 GIS 分布图开发中 · 后续接入', 'info') }
function showMyLandDetail(l) {
  let h = '<div style="padding:6px 0">'
  h += infoRow('种植作物', l.crop || '—')
  h += infoRow('土壤类型', l.soilType || '—')
  h += infoRow('地块位置', l.location || '—')
  h += infoRow('生产状态', l.status || '—')
  h += infoRow('灌溉', l.irrigation ? '已覆盖滴灌' : '未覆盖')
  h += '</div>'
  openGovModal(`🌾 ${l.name}（${l.area || '—'} 亩）`, h)
}
function showMyCropDetail(c) {
  let h = '<div style="padding:6px 0">'
  h += infoRow('品种', c.variety || '—')
  h += infoRow('定植时间', c.plantDate || '—')
  h += infoRow('生长周期', c.cycle || '—')
  h += infoRow('预计产量', c.expectedYield || '—')
  h += infoRow('当前阶段', c.stage || '—')
  h += infoRow('施肥管理', c.fertilizer || '—')
  h += '</div>'
  openGovModal(`🌱 ${c.name}`, h)
}
function showMyLivestockDetail(v) {
  let h = '<div style="padding:6px 0">'
  h += infoRow('批次', v.batchName || v.batchNo || '—')
  h += infoRow('品类', `${v.type || '—'} · ${v.breed || ''}`)
  h += infoRow('存栏量', `${v.count != null ? v.count : '—'} ${v.unit || ''}`)
  h += infoRow('健康状态', v.health || '—')
  h += infoRow('饲养阶段', v.stage || '—')
  h += infoRow('所在区域', v.area || '—')
  h += infoRow('来源', v.source || '—')
  h += '</div>'
  openGovModal('🐓 养殖档案', h)
}
const irrigationRunning = ref(false)
function toggleIrrigation() {
  irrigationRunning.value = !irrigationRunning.value
  toast(irrigationRunning.value ? '已启动灌溉 · 蜂糖李园滴灌' : '已停止灌溉', irrigationRunning.value ? 'success' : 'info')
}

// ---- Toast ----
function toast(msg, type = 'info') {
  const id = ++toastId; toasts.value.push({ id, msg, type })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 2600)
}

// ---- Sidebar ----
function toggleSidebar() {
  if (isMobile.value) { sidebarOpen.value = !sidebarOpen.value }
  else { sidebarCollapsed.value = !sidebarCollapsed.value }
}
function closeSidebar() { sidebarOpen.value = false }

// ---- Page switching ----
function switchPage(key) {
  currentPage.value = key
  pageTitle.value = key === 'settings' ? settingsNavLabel.value : (pageTitles[key] || key)
  sidebarOpen.value = false
  if (contentArea.value) contentArea.value.scrollTop = 0
  nextTick(() => { initCharts(); if (key === 'dashboard') initMap() })
}

// 办事大厅入口：精准定位到指定业务 tab（补贴/医保/培训…），而非默认政务预约
function openServiceTab(tab) {
  switchPage('service')
  nextTick(() => {
    if (servicePageRef.value && typeof servicePageRef.value.navigateToService === 'function') {
      servicePageRef.value.navigateToService(tab)
    }
  })
}

// 设备中心一级菜单：进入总览并展开子菜单（区别于子项独立页面）
function openDeviceOverview() {
  treeOpen.value = true
  switchPage('device')
}

// ---- Fullscreen ----
async function toggleFullscreen() {
  // 已在浏览器全屏 → 退出
  if (document.fullscreenElement) { await document.exitFullscreen(); return }
  // 已在页面沉浸模式（非浏览器全屏）→ 退出沉浸
  if (isFullscreen.value) { isFullscreen.value = false; applyFullscreenLayout(); return }
  // 尝试真正全屏；不支持或被拒绝时回退页面沉浸模式
  if (document.documentElement.requestFullscreen) {
    try { await document.documentElement.requestFullscreen(); return } catch (e) { /* 回退沉浸 */ }
  }
  isFullscreen.value = true
  applyFullscreenLayout()
}
function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
  applyFullscreenLayout()
}
function applyFullscreenLayout() {
  if (isFullscreen.value) {
    if (!isMobile.value) { _preFullscreenSidebar = sidebarCollapsed.value; sidebarCollapsed.value = true }
  } else if (_preFullscreenSidebar !== null) {
    sidebarCollapsed.value = _preFullscreenSidebar
    _preFullscreenSidebar = null
  }
  // 全屏切换后地图/图表重新自适应宽高
  nextTick(() => { setTimeout(() => onResize(), 300) })
}

// ---- Detail Panel ----
function openDetail(title, content) {
  detailTitle.value = title; detailContent.value = content
  detailOpen.value = true
}
function closeDetail() { detailOpen.value = false }

// ---- Modal ----
function openModal(title, content) {
  // 统一弹窗壳：标题 + 右上角固定关闭 ×（所有弹窗共用；× = 退出整个流程回主页面）
  modalContent.value = '<h3 style="padding-right:36px">' + title + '</h3><button class="modal-x" onclick="window._closeModal && window._closeModal()" title="关闭" aria-label="关闭">✕</button>' + content
  modalOpen.value = true
}
function closeModal() { modalOpen.value = false }

// Governance light modal wrapper
function openGovModal(title, content) {
  openModal(title, content)
  nextTick(() => {
    var box = document.querySelector('.modal.show .modal-box')
    if (box) {
      box.classList.add('modal-light')
      // reset any pinned dimensions from a previous modal (avoid stale height/width leaking)
      box.style.width = ''; box.style.maxWidth = ''; box.style.height = ''
      box.style.maxHeight = ''; box.style.overflow = ''; box.style.padding = ''; box.style.boxSizing = ''
    }
  })
}
// 大尺寸「列表工作区」弹窗（我的留言 / 村民留言处理等长期记录中心，非提示弹窗）
function openLargeGovModal(title, content) {
  openGovModal(title, content)
  nextTick(() => {
    var box = document.querySelector('.modal.show .modal-box')
    if (box) box.classList.add('modal-lg')
  })
}

// ---- Interactive handlers ----
function openStatDetail(label, value) {
  // 「待处理事件」直达管理员诉求处理（全村 service_request 列表 + 回复/办结）
  if (label === '待处理事件') { showAdminServiceRequests(); return }
  const c = '<div class="detail-section"><h4>数据概览</h4><div class="detail-field"><span class="df-lbl">指标</span><span class="df-val">' + label + '</span></div><div class="detail-field"><span class="df-lbl">当前值</span><span class="df-val">' + value + '</span></div></div><div class="detail-actions"><button class="btn btn-primary" onclick="window._toast && window._toast(\'趋势分析加载中…\',\'success\')">查看趋势</button><button class="btn btn-outline" onclick="window._toast && window._toast(\'报表导出中…\',\'info\')">导出数据</button></div>'
  openDetail(label, c)
}

function openModuleDetail(m) {
  const tagsHtml = m.tags ? m.tags.map(t => '<span class="tag ' + t.cls + '">' + t.text + '</span>').join('') : ''
  const c = '<div class="detail-section"><h4>基本信息</h4><div class="detail-field"><span class="df-lbl">模块名称</span><span class="df-val">' + m.label + '</span></div><div class="detail-field"><span class="df-lbl">状态</span><span class="df-val">运行中</span></div><div class="detail-field"><span class="df-lbl">标签</span><span class="df-val">' + tagsHtml + '</span></div></div><div class="detail-section"><h4>功能描述</h4><p style="font-size:11px;color:#66788A;line-height:1.6">' + (m.desc || '暂无描述') + '</p></div><div class="detail-actions"><button class="btn btn-primary" onclick="window._toast && window._toast(\'进入管理页面\',\'success\')">进入管理</button><button class="btn btn-outline" onclick="window._toast && window._toast(\'更多操作\',\'info\')">更多操作</button></div>'
  openDetail(m.label, c)
  toast('已打开：' + m.label, 'info')
}

function openAlertDetail(a) {
  activeAlert.value = a.id
  if (map && a.lat != null && a.lng != null) map.flyTo([a.lat, a.lng], Math.max(map.getZoom(), 16), { duration: 0.7 })

  const lvl = { info: { t: '一般', c: '#00eaff' }, warning: { t: '重要', c: '#ffcc33' }, danger: { t: '紧急', c: '#ff4d5a' } }[a.level] || { t: '一般', c: '#00eaff' }
  const st = { pending: { t: '未派单', c: '#ffcc33', bg: 'rgba(255,204,51,0.10)' }, dispatched: { t: '已派单', c: '#00eaff', bg: 'rgba(0,234,255,0.10)' }, done: { t: '已完成', c: '#19d98b', bg: 'rgba(25,217,139,0.10)' } }[a.status] || { t: '未派单', c: '#ffcc33', bg: 'rgba(255,204,51,0.10)' }

  const fd = (l, v) => '<div class="ad-field"><span class="ad-lbl">' + l + '</span><span class="ad-val">' + v + '</span></div>'
  let rows = fd('预警类型', a.title)
    + fd('预警级别', '<span style="color:' + lvl.c + ';font-weight:600">⚠ ' + lvl.t + '</span>')
    + fd('发生时间', a.time)
    + (a.duration ? fd('持续时间', a.duration) : '')
    + (a.device ? fd('设备名称', a.device) : '')
    + (a.location ? fd('位置', a.location) : '')

  const steps = ['未派单', '待处理', '已完成']
  const cur = a.status === 'pending' ? 0 : a.status === 'dispatched' ? 1 : 2
  let prog = '<div class="ad-prog">'
  steps.forEach((s, i) => {
    const on = i <= cur
    prog += '<div class="ad-step"><span class="ad-dot" style="' + (on ? 'background:' + st.c + ';box-shadow:0 0 8px ' + st.c + ';' : '') + '"></span>'
      + '<span class="ad-step-t" style="' + (on ? 'color:#eaf6ff;' : 'color:rgba(109,138,168,0.65);') + '">' + s + '</span></div>'
    if (i < steps.length - 1) prog += '<span class="ad-line" style="' + (i < cur ? 'background:' + st.c + ';' : '') + '"></span>'
  })
  prog += '</div>'

  let btns
  if (a.status === 'pending') {
    btns = '<button class="btn btn-primary" onclick="window._svc.dispatchAlert(' + a.id + ')">派单处理</button>'
      + '<button class="btn btn-outline" onclick="window._svc.markAlertRead(' + a.id + ')">标记已读</button>'
  } else if (a.status === 'dispatched') {
    btns = '<button class="btn btn-primary" onclick="window._svc.viewAlertProgress(' + a.id + ')">查看处理进度</button>'
      + '<button class="btn btn-outline" onclick="window._svc.markAlertRead(' + a.id + ')">标记已读</button>'
  } else {
    btns = '<button class="btn btn-primary" onclick="window._svc.viewAlertResult(' + a.id + ')">查看处理结果</button>'
  }

  const html = '<div class="ad-modal">'
    + '<div class="ad-head"><span class="ad-ico">' + a.icon + '</span><span class="ad-title">' + a.title + '</span>'
    + '<span class="ad-badge" style="color:' + st.c + ';border-color:' + st.c + ';background:' + st.bg + '">' + st.t + '</span></div>'
    + '<div class="ad-sec"><div class="ad-sec-hd">预警详情</div>' + rows + '</div>'
    + '<div class="ad-sec"><div class="ad-sec-hd">处理状态</div>' + prog + '</div>'
    + '<div class="ad-actions">' + btns + '</div>'
    + '</div>'

  openAlertModal(html)
}

function openAlertModal(html) {
  modalContent.value = '<button class="modal-x" onclick="window._closeModal && window._closeModal()" title="关闭" aria-label="关闭">✕</button>' + html
  modalOpen.value = true
  nextTick(() => {
    const box = document.querySelector('.modal.show .modal-box')
    if (box) {
      box.classList.remove('modal-light', 'modal-lg')
      box.classList.add('modal-alert')
      box.style.width = '430px'; box.style.maxWidth = '92vw'
      box.style.height = ''; box.style.maxHeight = '80vh'; box.style.overflow = 'auto'
      box.style.padding = ''; box.style.boxSizing = ''
    }
  })
}

function dispatchAlert(id) {
  const a = alertItems.find(x => x.id === id)
  if (a) { a.status = 'dispatched'; toast('已派单处理', 'success'); openAlertDetail(a) }
}
function markAlertRead(id) {
  toast('已标记为已读', 'info')
}
function viewAlertProgress(id) {
  toast('处理进度：已派单 → 待处理', 'info')
}
function viewAlertResult(id) {
  toast('处理结果：已完成', 'success')
}

function openAgeCare(age) {
  const list = careGroups[age] || []
  const linked = list.find(c => c.alertId)
  activeAlert.value = linked ? linked.alertId : null
  const stStyle = (s) => s === '异常' ? { bg: 'rgba(224,82,82,0.10)', color: '#E05252' } : s === '随访' ? { bg: 'rgba(242,166,43,0.12)', color: '#F2A62B' } : { bg: 'rgba(34,181,115,0.10)', color: '#22B573' }
  let rows = ''
  list.forEach(c => {
    const st = stStyle(c.status)
    rows += '<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px dashed #E8EDF2">'
      + '<div style="flex:1"><div style="font-size:15px;font-weight:700;color:#1F2D3D">' + c.name + '</div>'
      + '<div style="font-size:12px;color:#66788A;margin-top:2px">' + c.event + '</div></div>'
      + '<span style="font-size:11px;padding:3px 9px;border-radius:10px;background:' + st.bg + ';color:' + st.color + '">' + c.status + '</span>'
      + '</div>'
  })
  const html = '<div class="detail-section"><h4>' + age + ' · 关怀名单</h4>'
    + '<div style="font-size:11px;color:#66788A;margin:4px 0 8px">共 ' + list.length + ' 项关怀对象/事项</div>' + rows + '</div>'
    + '<div class="detail-actions"><button class="btn btn-primary" onclick="window._toast && window._toast(\'已生成关怀工单\',\'success\')">生成关怀工单</button>'
    + '<button class="btn btn-outline" onclick="window._toast && window._toast(\'已查看人员档案\',\'info\')">查看人员档案</button></div>'
  openDetail(age + ' · 关怀名单', html)
}

function openEventDetail(e) {
  showMyEventDetail(e)
}

function openSvcDetail(s) {
  const c = '<div class="detail-section"><h4>服务详情</h4><div class="detail-field"><span class="df-lbl">服务名称</span><span class="df-val">' + s.label + '</span></div><div class="detail-field"><span class="df-lbl">当前状态</span><span class="df-val">' + s.desc + '</span></div></div><div class="detail-actions"><button class="btn btn-primary" onclick="window._toast && window._toast(\'正在打开…\',\'success\')">立即办理</button><button class="btn btn-outline" onclick="window._toast && window._toast(\'进度查询中…\',\'info\')">查询进度</button></div>'
  openDetail(s.label, c)
  toast('已打开服务：' + s.label, 'info')
}

function openSettingsDetail(s) {
  const map = {
    '用户管理': 'users', '民宿管理': 'bnb', '订单管理': 'orders', '审核中心': 'audit', '模块配置': 'modules', '通知设置': 'notify', '操作日志': 'logs', '安全设置': 'security', '数据备份': 'backup', '系统运行': 'runtime',
    '账号与资料': 'account', '消息通知': 'pnotify', '账号安全': 'psecurity', '隐私与授权': 'privacy', '登录与设备': 'devices', '帮助与反馈': 'help'
  }
  const key = map[s.label] || 'home'
  const adminKeys = ['users', 'bnb', 'orders', 'audit', 'modules', 'notify', 'logs', 'security', 'backup', 'runtime']
  if (adminKeys.includes(key) && !canManageModule(key)) {
    toast('当前角色无权访问该功能', 'info')
    return
  }
  settingsView.value = key
  if (contentArea.value) contentArea.value.scrollTop = 0
}
function settingsBack() { settingsView.value = 'home' }

let _currentLeader = null // 当前查看的干部（供详情弹窗内「联系咨询」使用）
function showLeaderDetail(l) {
  _currentLeader = l
  let h = '<div style="padding:4px 0">'
  h += '<div style="text-align:center;padding:4px 0 14px 0">'
  h += '<img src="' + l.photo + '" alt="' + l.name + '" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #22B573;margin-bottom:10px">'
  h += '<h4 style="color:#1F2D3D;margin:0 0 4px 0;font-size:18px">' + l.name + '</h4>'
  h += '<p style="color:#66788A;font-size:14px;margin:0">' + l.title + '</p>'
  h += '</div>'
  h += '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px;margin-bottom:12px">'
  h += '<div style="font-size:14px;color:#1E7A54;font-weight:700;margin-bottom:6px">主要负责</div>'
  var tags = l.dutyTags || []
  tags.forEach(function(t) { h += '<div style="font-size:15px;color:#1F2D3D;padding:3px 0">· ' + t + '</div>' })
  h += '</div>'
  h += '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px;margin-bottom:12px">'
  h += '<div style="font-size:14px;color:#1E7A54;font-weight:700;margin-bottom:8px">可以找我办理/咨询</div>'
  h += '<div style="display:flex;flex-wrap:wrap;gap:6px">'
  var st = l.serviceTags || []
  st.forEach(function(t) { h += '<span style="display:inline-block;padding:4px 10px;background:#fff;border:1px solid #CBE4D8;border-radius:14px;font-size:13px;color:#1E7A54">' + t + '</span>' })
  h += '</div></div>'
  h += '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px;margin-bottom:12px">'
  h += '<div style="font-size:14px;color:#1E7A54;font-weight:700;margin-bottom:6px">常见事项</div>'
  var cm = l.commonMatters || []
  cm.forEach(function(t) { h += '<div style="font-size:15px;color:#1F2D3D;padding:3px 0">· ' + t + '</div>' })
  h += '</div>'
  h += '<div style="display:flex;align-items:center;justify-content:space-between;background:#F0F3F6;border:1px solid #EBEFF4;border-radius:8px;padding:12px 14px;margin-bottom:16px">'
  h += '<span style="font-size:14px;color:#66788A">☎ 联系电话</span>'
  h += '<span style="font-size:15px;color:#1F2D3D;font-weight:700">' + l.phoneMasked + '</span>'
  h += '</div>'
  h += '<div style="display:flex;gap:8px;justify-content:flex-end">'
  h += '<button class="btn btn-primary" onclick="window._svc.showContactCurrent()" style="justify-content:center">📞 联系咨询</button>'
  h += '</div></div>'
  openGovModal('👤 干部信息', h)
}

// 联系电话脱敏：15929510089 → 159****0089（仅展示，真实号码用于 tel: 拨打）
function maskPhone(p) { return p ? p.slice(0, 3) + '****' + p.slice(-4) : p }

// 联系咨询：站内弹窗（工作电话 + 微信二维码），不再直接唤起浏览器拨号
function showContactLeader(l) {
  _currentLeader = l
  let h = '<div style="padding:4px 0">'
  h += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">'
  h += '<img src="' + l.photo + '" alt="' + l.name + '" style="width:52px;height:52px;border-radius:50%;object-fit:cover;border:2px solid #22B573">'
  h += '<div><div style="font-size:17px;font-weight:700;color:#1F2D3D">' + l.name + '</div>'
  h += '<div style="font-size:13px;color:#66788A">' + l.title + '</div></div>'
  h += '</div>'
  h += '<div style="display:flex;align-items:center;justify-content:space-between;background:#F0F3F6;border:1px solid #EBEFF4;border-radius:8px;padding:12px 14px;margin-bottom:16px">'
  h += '<div><div style="font-size:13px;color:#66788A">☎ 工作电话</div><div style="font-size:16px;color:#1F2D3D;font-weight:700">' + l.phoneMasked + '</div></div>'
  h += '<button class="btn btn-primary btn-sm" onclick="window._svc.callLeader(\'' + l.id + '\')" style="justify-content:center">拨打电话</button>'
  h += '</div>'
  h += '<div style="text-align:center;margin-bottom:16px">'
  h += '<div style="font-size:14px;font-weight:700;color:#1F2D3D;margin-bottom:10px">微信联系</div>'
  h += '<img src="' + l.qr + '" alt="' + l.name + ' 微信二维码" style="width:150px;height:150px;object-fit:contain;background:#fff;border:1px solid #EBEFF4;border-radius:10px;padding:6px">'
  h += '<div style="font-size:13px;color:#66788A;margin-top:10px">使用微信扫一扫，添加/联系本人</div>'
  h += '</div>'
  h += '<div style="display:flex;gap:8px;justify-content:center">'
  h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">关闭</button>'
  h += '</div></div>'
  openGovModal('📞 联系 ' + l.name, h)
}
function showContactCurrent() { if (_currentLeader) showContactLeader(_currentLeader) }
function callLeader(id) {
  const l = leaders.find(function(x) { return x.id === id })
  if (l) { toast('正在为您接通 ' + l.name + '…', 'info'); setTimeout(function() { window.open('tel:' + l.phone, '_self') }, 300) }
}
// 村委便民联系：查看位置 / 联系村委（实际号码与坐标由后台按 village_id 下发，前端不写死）
function viewVillageLocation() {
  toast('已打开地图定位「' + villageOffice.name + '」', 'info')
}
function callVillage() {
  toast('已接通村委值班电话，工作时间内将尽快响应', 'info')
}

// ===== 快速找人：点事项 → 明确「这件事找谁」 → 联系/留言 =====
function openGuide(g) {
  const l = leaderById(g.staffId)
  if (!l) return
  let h = '<div style="padding:6px 0">'
  h += '<div style="text-align:center;padding:4px 0 14px 0">'
  h += '<img src="' + l.photo + '" alt="' + l.name + '" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:2px solid #22B573">'
  h += '<div style="font-size:18px;font-weight:700;color:#1F2D3D;margin-top:10px">' + l.name + '</div>'
  h += '<div style="font-size:13px;color:#66788A;margin-top:2px">' + l.title + '</div>'
  h += '</div>'
  h += '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:14px 16px;margin-bottom:16px">'
  h += '<div style="font-size:13px;color:#1E7A54;margin-bottom:6px">您咨询的是</div>'
  h += '<div style="font-size:16px;font-weight:700;color:#1F2D3D">' + g.icon + ' ' + g.label + '</div>'
  h += '<div style="font-size:13px;color:#66788A;margin-top:8px">负责干部：<span style="color:#1F2D3D;font-weight:700">' + l.name + '</span></div>'
  h += '</div>'
  h += '<div style="display:flex;gap:8px;justify-content:center">'
  h += '<button class="btn btn-outline" onclick="window._svc.guideContactById(\'' + g.staffId + '\')" style="justify-content:center">☎ 电话咨询</button>'
  h += '<button class="btn btn-primary" onclick="window._svc.guideLeaveById(\'' + g.staffId + '\')" style="justify-content:center">💬 留言咨询</button>'
  h += '</div></div>'
  openGovModal('🔍 快速找人', h)
}
// 快速找人弹窗按钮：按 staff_id 回查干部（村委班子只负责「找人」，不代办事项）
function guideContactById(staffId) { const l = leaderById(staffId); if (l) showContactLeader(l) }
function guideLeaveById(staffId) { const l = leaderById(staffId); if (l) showLeaveMessage(l) }

// 留言状态徽标（待回复 → 已回复 → 已办结 / 已撤回）
function msgPill(status) {
  const map = { '待回复': '#F2A62B', '已回复': '#1890FF', '已办结': '#22B573', '已撤回': '#8A97A5' }
  const c = map[status] || '#8A97A5'
  return '<span style="flex-shrink:0;font-size:11px;color:' + c + ';background:' + c + '1A;padding:3px 10px;border-radius:12px;font-weight:600">' + status + '</span>'
}
// 时间显示：今天/昨天 HH:MM，其余 M月D日 HH:MM
function fmtMsgTime(d) {
  const now = new Date()
  const yday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
  const hm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
  const sameDay = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  const isYday = d.getFullYear() === yday.getFullYear() && d.getMonth() === yday.getMonth() && d.getDate() === yday.getDate()
  if (sameDay) return '今天 ' + hm
  if (isYday) return '昨天 ' + hm
  return (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + hm
}

// 打开「给某干部留言」表单
function showLeaveMessage(l) {
  _msgStaff = l
  _msgType = (l.msgCategories && l.msgCategories[0]) || '村务咨询' // 留言类型随干部职责联动，默认取该干部第一类
  _msgContent = ''
  _msgPhotos = []
  _msgReplyType = '平台回复'
  renderLeaveMessage()
}
// 重渲染前把用户已填内容回存，避免输入丢失
function snapshotMsgForm() {
  const cEl = document.getElementById('msgContentInput')
  if (cEl) _msgContent = cEl.value
  const tEl = document.getElementById('msgTypeSelect')
  if (tEl) _msgType = tEl.value
  const rEl = document.getElementById('msgReplySelect')
  if (rEl) _msgReplyType = rEl.value
}
function renderLeaveMessage() {
  const l = _msgStaff
  if (!l) return
  let h = '<div style="padding:6px 0">'
  h += '<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;margin-bottom:14px">'
  h += '<img src="' + l.photo + '" alt="' + l.name + '" style="width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid #22B573;flex-shrink:0">'
  h += '<div><div style="font-size:15px;font-weight:700;color:#1F2D3D">' + l.name + '</div><div style="font-size:12px;color:#66788A;margin-top:2px">' + l.title + '</div></div>'
  h += '</div>'
  h += '<div style="margin-bottom:12px"><label style="display:block;font-size:13px;color:#1F2D3D;margin-bottom:6px;font-weight:600">留言类型 <span style="color:#E05252">*</span></label>'
  h += '<select id="msgTypeSelect" style="width:100%;background:#fff;border:1px solid #D4DCE6;border-radius:8px;color:#1F2D3D;padding:10px 12px;font-size:14px;font-family:inherit;box-sizing:border-box">'
  var _cats = (l.msgCategories && l.msgCategories.length) ? l.msgCategories : msgTypes
  _cats.forEach(function(t) { h += '<option value="' + t + '"' + (t === _msgType ? ' selected' : '') + '>' + t + '</option>' })
  h += '</select></div>'
  h += '<div style="margin-bottom:12px"><label style="display:block;font-size:13px;color:#1F2D3D;margin-bottom:6px;font-weight:600">留言内容 <span style="color:#E05252">*</span></label>'
  h += '<textarea id="msgContentInput" maxlength="500" placeholder="请描述您要办理或咨询的事情，尽量写清楚" style="width:100%;height:110px;background:#fff;border:1px solid #D4DCE6;border-radius:8px;color:#1F2D3D;padding:10px 12px;font-size:14px;font-family:inherit;resize:vertical;box-sizing:border-box">' + (_msgContent || '') + '</textarea>'
  h += '<div style="font-size:11px;color:#66788A;text-align:right;margin-top:4px">最多500字</div></div>'
  h += '<div style="margin-bottom:12px"><label style="display:block;font-size:13px;color:#1F2D3D;margin-bottom:6px;font-weight:600">现场照片 <span style="font-size:11px;color:#66788A;font-weight:400">（最多3张，选填）</span></label>'
  h += '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-start">'
  for (let i = 0; i < _msgPhotos.length; i++) {
    const p = _msgPhotos[i]
    if (p.dataUrl) {
      h += '<div style="width:72px;height:72px;border-radius:8px;overflow:hidden;position:relative;border:1px solid #D4DCE6"><img src="' + p.dataUrl + '" style="width:100%;height:100%;object-fit:cover"><span onclick="window._svc.removeMsgPhoto(' + i + ')" style="position:absolute;top:2px;right:2px;width:20px;height:20px;border-radius:50%;background:rgba(0,0,0,0.7);color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center;cursor:pointer;line-height:1">✕</span>'
      if (p.uploadStatus === 'uploading') h += '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff">上传中...</div>'
      h += '</div>'
    }
  }
  if (_msgPhotos.length < 3) {
    h += '<div onclick="window._svc.triggerMsgPhotoUpload()" style="width:72px;height:72px;border:1px dashed #CBE4D8;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;font-size:20px;color:#66788A;gap:2px">📷<span style="font-size:9px">拍照/上传</span></div>'
  }
  h += '</div></div>'
  h += '<div style="margin-bottom:12px"><label style="display:block;font-size:13px;color:#1F2D3D;margin-bottom:6px;font-weight:600">希望回复方式</label>'
  h += '<select id="msgReplySelect" style="width:100%;background:#fff;border:1px solid #D4DCE6;border-radius:8px;color:#1F2D3D;padding:10px 12px;font-size:14px;font-family:inherit;box-sizing:border-box">'
  h += '<option value="平台回复"' + (_msgReplyType === '平台回复' ? ' selected' : '') + '>平台回复（在「我的留言」查看）</option>'
  h += '<option value="电话回复"' + (_msgReplyType === '电话回复' ? ' selected' : '') + '>电话回复</option>'
  h += '</select></div>'
  h += '<div style="display:flex;align-items:center;justify-content:space-between;background:#F0F3F6;border:1px solid #EBEFF4;border-radius:8px;padding:10px 12px;margin-bottom:12px">'
  h += '<div style="font-size:12px;color:#66788A">👤 留言人 · 联系电话（已自动带入）</div>'
  h += '<div style="font-size:13px;color:#1F2D3D;font-weight:600">' + currentUser.name + ' · ' + currentUser.phone + '</div>'
  h += '</div>'
  h += '<div style="font-size:11px;color:#8A6D3B;line-height:1.6;background:#FFF7E6;border:1px solid #F5E0B8;border-radius:8px;padding:8px 12px;margin-bottom:14px">⚠️ 留言不用于紧急事项处理。如遇火灾、人身安全、严重纠纷等紧急情况，请直接联系村委值班电话或相关应急电话。</div>'
  h += '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">'
  h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">取消</button>'
  h += '<button class="btn btn-primary" onclick="window._svc.submitLeaveMessage()">提交留言</button>'
  h += '</div></div>'
  openGovModal('给' + l.name + '留言', h)
  setTimeout(ensureMsgFileInput, 100)
}
function ensureMsgFileInput() {
  let fi = document.getElementById('msgPhotoFileInput')
  if (!fi) {
    fi = document.createElement('input')
    fi.type = 'file'; fi.id = 'msgPhotoFileInput'; fi.accept = 'image/*'
    fi.multiple = false; fi.style.display = 'none'
    fi.onchange = function(e) { if (this.files && this.files[0]) window._svc.handleMsgPhotoSelected(this.files[0]) }
    document.body.appendChild(fi)
  }
}
function triggerMsgPhotoUpload() {
  if (_msgPhotos.length >= 3) { toast('最多上传3张照片', 'warn'); return }
  const fi = document.getElementById('msgPhotoFileInput')
  if (fi) { fi.value = ''; fi.click() }
}
function handleMsgPhotoSelected(file) {
  if (!file) return
  if (_msgPhotos.length >= 3) { toast('最多上传3张照片', 'warn'); return }
  if (file.size > 10 * 1024 * 1024) { toast('图片不能超过10MB', 'warn'); return }
  snapshotMsgForm()
  const idx = _msgPhotos.length
  _msgPhotos.push({ name: file.name, size: file.size, dataUrl: '', uploadStatus: 'uploading' })
  renderLeaveMessage()
  const reader = new FileReader()
  reader.onload = function(e) {
    const img = new Image()
    img.onload = function() {
      const maxW = 1280, maxH = 1280
      let w = img.width, h = img.height
      if (w > maxW || h > maxH) { if (w > h) { h = Math.round(h * maxW / w); w = maxW } else { w = Math.round(w * maxH / h); h = maxH } }
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      _msgPhotos[idx].dataUrl = canvas.toDataURL('image/jpeg', 0.80)
      _msgPhotos[idx].uploadStatus = 'done'
      snapshotMsgForm()
      renderLeaveMessage()
    }
    img.src = e.target.result
  }
  reader.onerror = function() {
    _msgPhotos[idx].uploadStatus = 'failed'
    renderLeaveMessage()
    toast('照片读取失败，请重试', 'error')
  }
  reader.readAsDataURL(file)
}
function removeMsgPhoto(idx) {
  if (idx >= 0 && idx < _msgPhotos.length) {
    snapshotMsgForm()
    _msgPhotos.splice(idx, 1)
    renderLeaveMessage()
  }
}
function submitLeaveMessage() {
  snapshotMsgForm()
  const content = _msgContent.trim()
  if (!content) { toast('请填写留言内容', 'warn'); return }
  const failed = _msgPhotos.filter(function(p) { return p.uploadStatus === 'failed' })
  if (failed.length > 0) { toast('有照片上传失败，请删除后重新上传', 'warn'); return }
  const now = new Date()
  const ymd = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0')
  _msgSeq += 1
  const messageId = 'LY' + ymd + String(_msgSeq).padStart(4, '0')
  // 提交字段对齐后台：留言编号(message_id)/村(village_id)/留言人ID(farmer_id)/干部ID(staff_id)/类型/内容/图片/提交时间/状态/回复内容/回复时间
  // village_id、farmer_id、staff_id 为隐藏技术字段，页面只展示姓名，农户不可见、不可改
  const msg = {
    message_id: messageId,
    village_id: 'zhongyan',
    farmer_id: currentUser.farmerId,
    staff_id: _msgStaff.id,
    staff_name: _msgStaff.name,
    staff_title: _msgStaff.title,
    category: _msgType,
    content: content,
    images: _msgPhotos.map(function(p) { return { name: p.name, dataUrl: p.dataUrl } }),
    preferred_reply_type: _msgReplyType === '电话回复' ? 'phone' : 'platform',
    status: '待回复',
    created_at: now.toISOString(),
    timeText: fmtMsgTime(now),
    replied_at: null,
    replyTimeText: '',
    reply_content: '',
    closed_at: null
  }
  myMessages.value.unshift(msg)
  renderMsgSuccess(msg)
}
function renderMsgSuccess(msg) {
  let h = '<div style="text-align:center;padding:16px 0"><div style="font-size:48px;margin-bottom:12px">✅</div>'
  h += '<h4 style="color:#22B573;margin:0 0 16px 0;font-size:17px">留言已提交</h4>'
  h += '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:14px;margin-bottom:16px;text-align:left">'
  h += '<div style="font-size:14px;color:#475867;line-height:2">已提交给：<span style="color:#1F2D3D;font-weight:700">' + msg.staff_name + '</span><br>'
  h += '留言编号：<span style="color:#1F2D3D;font-weight:700">' + msg.message_id + '</span><br>'
  h += '当前状态：<span style="color:#F2A62B;font-weight:700">待回复</span></div></div>'
  h += '<div style="font-size:13px;color:#66788A;text-align:center;margin-bottom:20px">您可以在「我的留言」中查看处理进度。</div>'
  h += '<div style="display:flex;gap:8px;justify-content:center">'
  h += '<button class="btn btn-primary" onclick="window._svc.showMyMessages()">查看我的留言</button>'
  h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">返回村委班子</button>'
  h += '</div></div>'
  openGovModal('留言已提交', h)
}

// 「我的留言」= 长期使用的个人记录中心（大尺寸列表工作区，非提示弹窗）
// 仅展示当前登录农户自己的记录；固定标题+筛选栏，内容区内部滚动，底部分页，不无限滚动
let _msgFilter = '全部'
let _msgPage = 1
const _msgPageSize = 10
function showMyMessages() { _msgFilter = '全部'; _msgPage = 1; renderMyMessages() }
function setMsgFilter(f) { _msgFilter = f; _msgPage = 1; renderMyMessages() }
function setMsgPage(p) { _msgPage = p; renderMyMessages() }
// 完整日期时间：YYYY-MM-DD HH:mm
function fmtMsgDateTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
}
function renderMyMessages() {
  const msgs = myMessages.value
  const tabs = ['全部', '待回复', '已回复', '已办结', '已撤回']
  const countOf = function(s) { return s === '全部' ? msgs.length : msgs.filter(function(m) { return m.status === s }).length }
  const filtered = _msgFilter === '全部' ? msgs : msgs.filter(function(m) { return m.status === _msgFilter })
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / _msgPageSize))
  if (_msgPage > totalPages) _msgPage = totalPages
  const pageList = filtered.slice((_msgPage - 1) * _msgPageSize, _msgPage * _msgPageSize)

  let h = '<div class="msg-center">'
  h += '<div class="msgc-sub">仅展示本人（' + currentUser.name + '）的留言记录，点击任意一条查看详情与回复</div>'
  h += '<div class="msgc-tabs">'
  tabs.forEach(function(t) {
    const active = _msgFilter === t
    h += '<span class="msgc-tab" onclick="window._svc.setMsgFilter(\'' + t + '\')" style="' + (active ? 'background:#19B98A;color:#fff;' : 'background:#F0F3F6;color:#66788A;') + '">' + t + ' ' + countOf(t) + '</span>'
  })
  h += '</div>'
  if (total === 0) {
    h += '<div class="msgc-empty"><div class="msgc-empty-ic">💬</div><div class="msgc-empty-t">暂无留言记录</div><div class="msgc-empty-s">您向村干部提交的留言会显示在这里</div></div>'
  } else {
    h += '<div class="msgc-list">'
    pageList.forEach(function(m) {
      const idx = msgs.indexOf(m)
      h += '<div class="msgc-item" onclick="window._svc.openMessageDetail(' + idx + ')">'
      h += '<div class="msgc-row1"><span class="msgc-left"><span class="msgc-cat">' + m.category + '</span><span class="msgc-staff">' + m.staff_name + '</span></span>' + msgPill(m.status) + '</div>'
      h += '<div class="msgc-content">' + m.content + '</div>'
      h += '<div class="msgc-row3"><span class="msgc-time">' + fmtMsgDateTime(m.created_at) + '</span><span class="msgc-link">' + (m.status === '已回复' ? '查看回复 ›' : '查看详情 ›') + '</span></div>'
      h += '</div>'
    })
    h += '</div>'
    h += '<div class="msgc-pager">'
    h += '<span class="msgc-total">共 ' + total + ' 条</span>'
    h += '<div class="msgc-pages">'
    h += '<span class="msgc-pg' + (_msgPage <= 1 ? ' msgc-pg-dis' : '') + '" onclick="' + (_msgPage > 1 ? 'window._svc.setMsgPage(' + (_msgPage - 1) + ')' : '') + '">‹</span>'
    for (let p = 1; p <= totalPages; p++) {
      h += '<span class="msgc-pg' + (p === _msgPage ? ' msgc-pg-on' : '') + '" onclick="window._svc.setMsgPage(' + p + ')">' + p + '</span>'
    }
    h += '<span class="msgc-pg' + (_msgPage >= totalPages ? ' msgc-pg-dis' : '') + '" onclick="' + (_msgPage < totalPages ? 'window._svc.setMsgPage(' + (_msgPage + 1) + ')' : '') + '">›</span>'
    h += '</div></div>'
  }
  h += '</div>'
  openLargeGovModal('💬 我的留言', h)
}

// 留言详情（一问一答）
function openMessageDetail(idx) {
  const m = myMessages.value[idx]
  if (m) renderMessageDetail(m)
}
function renderMessageDetail(m) {
  let h = '<div style="padding:6px 0">'
  h += '<div style="margin-bottom:14px">'
  h += '<div style="font-size:11px;color:#66788A;margin-bottom:6px">我的留言 · ' + m.timeText + '</div>'
  h += '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:10px;padding:12px 14px;font-size:14px;color:#1F2D3D;line-height:1.6">' + m.content + '</div>'
  h += '<div style="font-size:11px;color:#66788A;margin-top:6px">留言类型：' + m.category + ' · 接收人：' + m.staff_name + '</div>'
  h += '</div>'
  if (m.status === '已回复' || m.status === '已办结') {
    h += '<div style="margin-bottom:14px">'
    h += '<div style="font-size:11px;color:#66788A;margin-bottom:6px">' + m.staff_name + '回复 · ' + (m.replyTimeText || '') + '</div>'
    h += '<div style="background:#fff;border:1px solid #E3EAF0;border-radius:10px;padding:12px 14px;font-size:14px;color:#1F2D3D;line-height:1.6">' + m.reply_content + '</div>'
    h += '</div>'
  } else {
    h += '<div style="text-align:center;padding:14px;background:#F0F3F6;border-radius:8px;margin-bottom:14px;font-size:12px;color:#66788A">⏳ 等待干部回复中…</div>'
  }
  h += '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">'
  if (m.status === '待回复') {
    h += '<button class="btn btn-outline" onclick="window._svc.withdrawMessage(\'' + m.message_id + '\')">撤回留言</button>'
  } else if (m.status === '已回复') {
    h += '<button class="btn btn-outline" onclick="window._svc.supplementMessage(\'' + m.message_id + '\')">还有问题</button>'
    h += '<button class="btn btn-primary" onclick="window._svc.resolveMessage(\'' + m.message_id + '\')">已解决</button>'
  } else {
    h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">关闭</button>'
  }
  h += '</div></div>'
  openGovModal('💬 留言详情', h)
}
function resolveMessage(messageId) {
  const m = myMessages.value.find(function(x) { return x.message_id === messageId })
  if (!m) return
  m.status = '已办结'
  m.closed_at = new Date().toISOString()
  toast('已标记为「已办结」', 'success')
  renderMessageDetail(m)
}
function withdrawMessage(messageId) {
  const m = myMessages.value.find(function(x) { return x.message_id === messageId })
  if (!m) return
  if (m.status !== '待回复') { toast('干部已回复，无法撤回', 'warn'); return }
  m.status = '已撤回'
  toast('留言已撤回', 'info')
  renderMessageDetail(m)
}
function supplementMessage(messageId) {
  const m = myMessages.value.find(function(x) { return x.message_id === messageId })
  if (!m) return
  _supplementMsgId = messageId
  let h = '<div style="padding:6px 0"><label style="display:block;font-size:13px;color:#1F2D3D;margin-bottom:6px;font-weight:600">补充说明</label>'
  h += '<textarea id="supplementInput" maxlength="500" placeholder="请补充您还需要说明的内容…" style="width:100%;height:110px;background:#fff;border:1px solid #D4DCE6;border-radius:8px;color:#1F2D3D;padding:10px 12px;font-size:14px;font-family:inherit;resize:vertical;box-sizing:border-box"></textarea>'
  h += '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px;border-top:1px solid #F0F3F5;padding-top:14px">'
  h += '<button class="btn btn-outline" onclick="window._svc.openMessageDetailBy(\'' + messageId + '\')">取消</button>'
  h += '<button class="btn btn-primary" onclick="window._svc.submitSupplement()">提交补充</button>'
  h += '</div></div>'
  openGovModal('补充留言', h)
}
function openMessageDetailBy(messageId) {
  const m = myMessages.value.find(function(x) { return x.message_id === messageId })
  if (m) renderMessageDetail(m)
}
function submitSupplement() {
  const el = document.getElementById('supplementInput')
  const text = el ? el.value.trim() : ''
  if (!text) { toast('请填写补充内容', 'warn'); return }
  const m = myMessages.value.find(function(x) { return x.message_id === _supplementMsgId })
  if (!m) return
  m.content = m.content + '\n【补充】' + text
  m.status = '待回复'
  m.reply_content = ''
  m.replied_at = null
  m.replyTimeText = ''
  m.closed_at = null
  toast('已补充并重新提交，等待干部回复', 'success')
  renderMessageDetail(m)
}

function sendChat() {
  const q = chatInput.value.trim()
  if (!q) return
  chatMessages.value.push({ role: 'user', text: q })
  chatInput.value = ''

  // Keyword matching — prioritize actions over text replies
  const ql = q.toLowerCase()
  let reply = ''
  let actionDelay = 800

  if (ql.includes('上报') || ql.includes('事件') || ql.includes('进度') || ql.includes('处理')) {
    reply = '正在为您打开<b>我的上报</b>记录…<br><span style="font-size:10px;color:#66788A">共 ' + myEvents.length + ' 条上报记录，最近一条：' + (myEvents[0] ? myEvents[0].type + '（' + myEvents[0].status + '）' : '无') + '</span>'
    setTimeout(() => { closeModal(); showMyReports() }, actionDelay)
  }
  else if (ql.includes('通知') || ql.includes('公告') || ql.includes('村里最近')) {
    reply = '正在为您打开<b>村务公告</b>…<br><span style="font-size:10px;color:#66788A">共 ' + villageNotices.length + ' 条公告</span>'
    setTimeout(() => { closeModal(); showVillageNotices() }, actionDelay)
  }
  else if (ql.includes('网格') || ql.includes('网格员') || ql.includes('王大爷')) {
    reply = '正在为您打开<b>网格员信息</b>…<br><span style="font-size:10px;color:#66788A">第2网格 · 网格员：' + gridWorker.name + '</span>'
    setTimeout(() => { closeModal(); showGridWorkerInfo() }, actionDelay)
  }
  else if (ql.includes('政策') || ql.includes('惠农') || ql.includes('补贴')) {
    reply = '近期惠农政策速览：<br>• <b>2026年农机补贴</b>：补贴比例提高至35%<br>• <b>数字乡村试点</b>：省财政安排专项资金<br>• <b>农村电商扶持</b>：物流补贴+免费培训<br>• <b>耕地保护补贴</b>：每亩120元标准<br><br><span style="display:inline-block;padding:4px 12px;background:rgba(25,185,138,0.08);border:1px solid rgba(40,199,250,0.20);border-radius:4px;font-size:10px;color:#19B98A;margin-top:4px">💡 如需申请补贴，可在<b>数字服务中心 → 补贴申请</b>办理</span>'
  }
  else if (ql.includes('低保')) {
    reply = '根据系统数据，中堰村目前共有 <b style="color:#F2A62B">24户 38人</b> 享受低保待遇。其中：<br>• 1组：8户 12人<br>• 2组：10户 16人<br>• 3组：6户 10人<br>最新审核日期：2026年6月。'
  }
  else if (ql.includes('会议') || ql.includes('纪要')) {
    reply = '<b>中堰村2026年6月工作例会纪要</b><br>时间：6月15日 14:00<br>主持：邓超书记<br><br>一、上月工作总结<br>1. 小麦收割工作全面完成<br>2. 电商平台上线运行正常<br><br>二、本月工作安排<br>1. 蜂糖李夏季管护培训<br>2. 澳洲龙虾基地水质监测<br>3. 留守老人关爱走访'
  }
  else {
    reply = '收到您的问题，我可以帮您查询以下内容：<br><br>' +
      '<span style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span style="color:#22B573">▸</span> <b>我上报的事件</b> — 查看处理进度</span>' +
      '<span style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span style="color:#22B573">▸</span> <b>村务公告</b> — 获取最新通知</span>' +
      '<span style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span style="color:#22B573">▸</span> <b>网格员</b> — 联系服务人员</span>' +
      '<span style="display:flex;align-items:center;gap:6px"><span style="color:#22B573">▸</span> <b>惠农政策</b> — 了解补贴信息</span>' +
      '<br><span style="font-size:10px;color:#66788A">请输入以上关键词，我会为您快速查询</span>'
  }

  setTimeout(() => {
    chatMessages.value.push({ role: 'ai', text: reply })
    nextTick(() => { if (chatAreaRef.value) chatAreaRef.value.scrollTop = chatAreaRef.value.scrollHeight })
  }, 400 + Math.random() * 500)
}

// ==================== CLOCK ====================
let clockTimer
function updateClock() {
  const n = new Date()
  clockTime.value = String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0') + ':' + String(n.getSeconds()).padStart(2, '0')
  clockDate.value = n.getFullYear() + '年' + (n.getMonth() + 1) + '月' + n.getDate() + '日 星期' + ['日', '一', '二', '三', '四', '五', '六'][n.getDay()]
  clockDateEn.value = n.getFullYear() + '.' + String(n.getMonth() + 1).padStart(2, '0') + '.' + String(n.getDate()).padStart(2, '0') + ' ' + ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][n.getDay()]
}

// ==================== PARTICLES ====================
let animId
function initParticles() {
  const cvs = particlesCvs.value; if (!cvs) return
  const ctx = cvs.getContext('2d'); let W, H
  function resize() { W = cvs.width = window.innerWidth; H = cvs.height = window.innerHeight }
  resize(); window.addEventListener('resize', resize)
  const pts = []
  for (let i = 0; i < 90; i++) {
    pts.push({ x: Math.random() * W, y: Math.random() * H, r: 0.2 + Math.random() * 1.1, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, a: 0.15 + Math.random() * 0.45 })
  }
  function draw() {
    ctx.clearRect(0, 0, W, H)
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(150,205,240,' + p.a + ')'; ctx.fill()
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 105) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y)
          ctx.strokeStyle = 'rgba(110,180,230,' + (0.045 * (1 - d / 105)) + ')'
          ctx.lineWidth = 0.5; ctx.stroke()
        }
      }
    }
    animId = requestAnimationFrame(draw)
  }
  draw()
}

// ==================== ECHARTS ====================
let chartInstances = []

function makeChart(container, option) {
  if (!container) return
  const instance = echarts.init(container)
  instance.setOption(option)
  chartInstances.push(instance)
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => { try { instance.resize() } catch (e) {} })
    ro.observe(container)
  }
  return instance
}

function initDashboardCharts() {
  if (chartDashAge.value) {
    const ageChart = makeChart(chartDashAge.value, {
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(4,18,40,0.95)', borderColor: 'rgba(0,234,255,0.30)', textStyle: { color: '#c8daea', fontSize: 10 },
        formatter: (ps) => {
          let s = ps[0].name + '<br/>'
          ps.forEach(p => { s += p.marker + p.seriesName + ' ' + Math.abs(p.value) + '人<br/>' })
          return s
        }
      },
      grid: { left: 8, right: 8, top: 4, bottom: 4, containLabel: true },
      xAxis: {
        type: 'value', min: -320, max: 320,
        axisLabel: { formatter: v => Math.abs(v), color: '#5e7a9a', fontSize: 9 },
        splitLine: { lineStyle: { color: 'rgba(0,234,255,0.05)', type: 'dashed' } },
        axisLine: { lineStyle: { color: 'rgba(0,234,255,0.25)' } }, axisTick: { show: false }
      },
      yAxis: {
        type: 'category', data: ['65岁以上', '41-65岁', '18-40岁', '0-17岁'],
        axisLabel: { color: '#c8daea', fontSize: 12 }, axisLine: { show: false }, axisTick: { show: false }
      },
      series: [
        {
          name: '男', type: 'bar', barWidth: 10, data: [-106, -128, -288, -122],
          label: { show: true, position: 'left', color: '#9db8d4', fontSize: 11, formatter: p => Math.abs(p.value) },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{ offset: 0, color: 'rgba(92,124,255,.15)' }, { offset: 1, color: '#5c7cff' }]),
            borderRadius: [3, 0, 0, 3], shadowBlur: 6, shadowColor: 'rgba(92,124,255,0.40)'
          }
        },
        {
          name: '女', type: 'bar', barWidth: 10, data: [132, 122, 274, 114],
          label: { show: true, position: 'right', color: '#9db8d4', fontSize: 11 },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: 'rgba(25,217,139,.15)' }, { offset: 1, color: '#19d98b' }]),
            borderRadius: [0, 3, 3, 0], shadowBlur: 6, shadowColor: 'rgba(25,217,139,0.40)'
          }
        }
      ]
    })
    ageChart.on('click', (params) => {
      if (params.componentType === 'series' && params.name) openAgeCare(params.name)
    })
  }
  if (chartDashIndustry.value) {
    const _cyan = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      { offset: 0, color: 'rgba(0,234,255,.10)' },
      { offset: 0.55, color: '#00eaff' },
      { offset: 1, color: '#5c7cff' }
    ])
    makeChart(chartDashIndustry.value, {
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(4,18,40,0.95)', borderColor: 'rgba(0,234,255,0.30)', textStyle: { color: '#c8daea', fontSize: 10 },
        formatter: (ps) => { const p = ps[0]; return p.marker + ' ' + p.name + '　产值 ' + p.value + ' 万元' }
      },
      grid: { left: 96, right: 44, top: 8, bottom: 20 },
      xAxis: {
        type: 'value', max: 300, interval: 100, axisLine: { show: false }, axisTick: { show: false },
        splitLine: { lineStyle: { color: 'rgba(0,234,255,0.05)' } }, axisLabel: { color: '#5e7a9a', fontSize: 10 }
      },
      yAxis: {
        type: 'category', data: ['🧩 其他', '🌼 油菜', '🌽 玉米', '🍇 阳光玫瑰葡萄'],
        axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#c8daea', fontSize: 12 },
        splitLine: { lineStyle: { color: 'rgba(0,234,255,0.04)' } }
      },
      series: [{
        type: 'bar', barWidth: 15, barCategoryGap: '30%',
        showBackground: true, backgroundStyle: { color: 'rgba(0,234,255,0.05)', borderRadius: 4 },
        label: { show: true, position: 'right', color: '#00eaff', fontSize: 10, fontWeight: 700, formatter: '¥{c}万', textShadowColor: 'rgba(0,234,255,0.55)', textShadowBlur: 5 },
        data: [
          { value: 48, name: '🧩 其他', itemStyle: { color: _cyan, borderRadius: 4, shadowBlur: 6, shadowColor: 'rgba(0,234,255,0.36)' } },
          { value: 52, name: '🌼 油菜', itemStyle: { color: _cyan, borderRadius: 4, shadowBlur: 6, shadowColor: 'rgba(0,234,255,0.36)' } },
          { value: 178, name: '🌽 玉米', itemStyle: { color: _cyan, borderRadius: 4, shadowBlur: 6, shadowColor: 'rgba(0,234,255,0.36)' } },
          { value: 245, name: '🍇 阳光玫瑰葡萄', itemStyle: { color: '#00eaff', borderRadius: 4, shadowBlur: 11, shadowColor: 'rgba(0,234,255,0.68)' }, label: { color: '#00eaff', fontWeight: 800 } }
        ]
      }]
    })
  }
}

function initGovCharts() {
  // Governance charts removed — farmer-facing portal uses stat cards instead of ECharts
  // Admin-level charts (event trends, category breakdown) preserved for future admin dashboard
}

function initEcoCharts() {
  if (chartEcoAir.value) {
    makeChart(chartEcoAir.value, {
      tooltip: { trigger: 'axis', backgroundColor: '#FFFFFF', borderColor: '#E3EAF0', textStyle: { color: '#1F2D3D', fontSize: 13 } },
      grid: { left: 8, right: 20, top: 10, bottom: 24 }, legend: { data: ['AQI', 'PM2.5'], textStyle: { color: '#66788A', fontSize: 13 }, top: 0, right: 0 },
      xAxis: { type: 'category', data: ['6/12', '6/13', '6/14', '6/15', '6/16', '6/17', '6/18'], axisLabel: { color: '#66788A', fontSize: 13 } },
      yAxis: [{ type: 'value', name: 'AQI', axisLabel: { color: '#66788A', fontSize: 13 }, splitLine: { lineStyle: { color: '#EEF2F6' } } }, { type: 'value', name: 'μg/m³', axisLabel: { color: '#66788A', fontSize: 13 } }],
      series: [
        { name: 'AQI', type: 'line', data: [38, 45, 42, 48, 40, 44, 42], yAxisIndex: 0, smooth: true, lineStyle: { color: '#22B573', width: 2 }, itemStyle: { color: '#22B573' } },
        { name: 'PM2.5', type: 'bar', data: [12, 16, 15, 18, 14, 17, 15], yAxisIndex: 1, barWidth: 12, itemStyle: { borderRadius: [3, 3, 0, 0], color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#19B98A' }, { offset: 1, color: 'rgba(57,217,138,0.20)' }]) } }
      ]
    })
  }
  if (chartEcoWater.value) {
    const _ecoWaterChart = makeChart(chartEcoWater.value, {
      tooltip: { trigger: 'axis', backgroundColor: '#FFFFFF', borderColor: '#E3EAF0', textStyle: { color: '#1F2D3D', fontSize: 13 } },
      grid: { left: 8, right: 20, top: 10, bottom: 24 },
      xAxis: { type: 'category', data: ['1号水塘', '2号水塘', '3号水塘', '灌溉渠', '村北河'], axisLabel: { color: '#66788A', fontSize: 13, rotate: 15 } },
      yAxis: { type: 'value', name: 'mg/L', axisLabel: { color: '#66788A', fontSize: 13 }, splitLine: { lineStyle: { color: '#EEF2F6' } } },
      series: [{
        type: 'bar', barWidth: 20, itemStyle: { borderRadius: [3, 3, 0, 0] },
        data: [
          { value: 6.8, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#22B573' }, { offset: 1, color: 'rgba(16,214,160,.2)' }]) } },
          { value: 5.5, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#22B573' }, { offset: 1, color: 'rgba(16,214,160,.2)' }]) } },
          { value: 3.2, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#E05252' }, { offset: 1, color: 'rgba(239,68,68,.2)' }]) }, label: { show: true, position: 'top', color: '#E05252', fontSize: 13, fontWeight: 700, formatter: '⚠ 异常' } },
          { value: 7.2, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#22B573' }, { offset: 1, color: 'rgba(16,214,160,.2)' }]) } },
          { value: 6.2, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#19B98A' }, { offset: 1, color: 'rgba(57,217,138,0.20)' }]) } }
        ],
        markLine: { silent: true, data: [{ yAxis: 5, label: { formatter: '标准线(5mg/L)', fontSize: 13, color: '#F2A62B' }, lineStyle: { color: '#F2A62B', type: 'dashed' } }] }
      }]
    })
    _ecoWaterChart.on('click', function(params) {
      if (params.name === '3号水塘') openWaterBodyDetail('3号水塘')
      else toast(params.name + ' 水质正常', 'info')
    })
  }
  if (chartEcoCarbon.value) {
    makeChart(chartEcoCarbon.value, {
      tooltip: { trigger: 'axis', backgroundColor: '#FFFFFF', borderColor: '#E3EAF0', textStyle: { color: '#1F2D3D', fontSize: 13 } },
      grid: { left: 8, right: 20, top: 10, bottom: 24 },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'], axisLabel: { color: '#66788A', fontSize: 13 } },
      yAxis: { type: 'value', name: '吨', axisLabel: { color: '#66788A', fontSize: 13 }, splitLine: { lineStyle: { color: '#EEF2F6' } } },
      series: [
        { name: '碳汇量', type: 'bar', stack: 'total', data: [68, 72, 75, 70, 80, 86], barWidth: 20, itemStyle: { color: '#22B573', borderRadius: [3, 3, 0, 0] } },
        { name: '废弃物回收', type: 'bar', stack: 'total', data: [45, 48, 52, 50, 55, 58], barWidth: 20, itemStyle: { color: '#19B98A' } }
      ]
    })
  }
}

function initIotCharts() {
  if (chartIotStatus.value) {
    makeChart(chartIotStatus.value, {
      tooltip: { trigger: 'item', backgroundColor: 'rgba(4,18,40,0.95)', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#c8daea', fontSize: 10 } },
      series: [{ type: 'pie', radius: ['55%', '75%'], center: ['50%', '50%'], itemStyle: { borderColor: 'rgba(8,28,58,0.92)', borderWidth: 2 }, label: { color: '#5e7a9a', fontSize: 10, formatter: '{b}: {c}台' },
        data: [{ value: 47, name: '在线', itemStyle: { color: '#22B573' } }, { value: 3, name: '异常', itemStyle: { color: '#F2A62B' } }, { value: 2, name: '离线', itemStyle: { color: '#E05252' } }]
      }]
    })
  }
  if (chartIotFlow.value) {
    const hours = []; for (let i = 0; i < 24; i++) hours.push(i + '时')
    const vals = []; for (let i = 0; i < 24; i++) vals.push(800 + Math.floor(Math.random() * 500))
    makeChart(chartIotFlow.value, {
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(4,18,40,0.95)', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#c8daea', fontSize: 10 } },
      grid: { left: 8, right: 20, top: 10, bottom: 24 },
      xAxis: { type: 'category', data: hours, axisLabel: { color: '#5e7a9a', fontSize: 8 }, axisLine: { lineStyle: { color: 'rgba(14,165,233,0.18)' } } },
      yAxis: { type: 'value', name: '次', axisLabel: { color: '#5e7a9a', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(14,165,233,0.06)' } } },
      series: [{ type: 'line', data: vals, smooth: true, lineStyle: { color: '#19B98A', width: 2 }, itemStyle: { color: '#19B98A' }, symbol: 'none', areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(57,217,138,0.25)' }, { offset: 1, color: 'rgba(14,165,233,.02)' }]) } }]
    })
  }
}

function initCharts() {
  const chartsMap = {
    dashboard: initDashboardCharts,
    ecology: initEcoCharts,
    iot: initIotCharts
  }
  const fn = chartsMap[currentPage.value]
  if (fn) nextTick(() => { disposeCharts(); fn() })
}

function disposeCharts() {
  chartInstances.forEach(c => { try { c.dispose() } catch (e) { /* ignore */ } })
  chartInstances = []
}

// ==================== GIS MAP ====================
let map
let mapStylesAdded = false

function makeDot(color, size, alert) {
  if (alert) {
    // 预警/异常节点：大核心 + 双层扩散雷达光环，明显区别于普通节点
    return L.divIcon({
      html:
        '<div style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:' + color + ';box-shadow:0 0 18px ' + color + ',0 0 40px ' + color + ';position:relative;animation:dotBreathe 1.2s ease-in-out infinite">' +
          '<div style="position:absolute;inset:-8px;border-radius:50%;border:3px solid ' + color + ';animation:alertPulse 1.2s ease-out infinite"></div>' +
          '<div style="position:absolute;inset:-16px;border-radius:50%;border:2px solid ' + color + ';animation:alertPulse 1.2s ease-out .35s infinite"></div>' +
        '</div>',
      className: '', iconSize: [size + 32, size + 32], iconAnchor: [(size + 32) / 2, (size + 32) / 2]
    })
  }
  return L.divIcon({
    html: '<div style="background:' + color + ';width:' + size + 'px;height:' + size + 'px;border-radius:50%;box-shadow:0 0 10px ' + color + ';position:relative;animation:dotBreathe 3s ease-in-out infinite"><div style="position:absolute;inset:-5px;border-radius:50%;border:2px solid ' + color + ';animation:livePulse 3s ease-out infinite"></div></div>',
    className: '', iconSize: [size + 10, size + 10], iconAnchor: [(size + 10) / 2, (size + 10) / 2]
  })
}

function initMap() {
  const mapEl = leafletMap.value
  if (!mapEl) return
  if (map) { map.remove(); map = null }

  map = L.map(mapEl, { center: [32.695, 109.025], zoom: 15, zoomControl: false, attributionControl: false })

  // 天地图底图（国家地理信息公共服务平台：国界规范 + 中文注记 + 无坐标偏移，替代高德瓦片）
  const TD_KEY = '95612d93a08fd560faaaeec5c4b9b0d7'
  const TD_SUBS = ['0', '1', '2', '3', '4', '5', '6', '7']
  const tdBase = (lyr) => `https://t{s}.tianditu.gov.cn/${lyr}_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${lyr}&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TD_KEY}`
  L.tileLayer(tdBase('vec'), { subdomains: TD_SUBS, maxZoom: 18 }).addTo(map)
  L.tileLayer(tdBase('cva'), { subdomains: TD_SUBS, maxZoom: 18 }).addTo(map)

  // 村域边界（发光虚线轮廓，数字孪生感）
  const boundary = [
    [32.6995, 109.0185], [32.7008, 109.0250], [32.6998, 109.0310],
    [32.6965, 109.0340], [32.6912, 109.0315], [32.6902, 109.0240],
    [32.6918, 109.0180], [32.6960, 109.0178]
  ]
  L.polygon(boundary, { color: 'rgba(0,234,255,0.16)', weight: 7, fillColor: 'rgba(0,234,255,0.04)', fillOpacity: 1, dashArray: '8 6', lineJoin: 'round' }).addTo(map)
  L.polygon(boundary, { color: '#00eaff', weight: 1.5, fill: false, dashArray: '8 6', lineJoin: 'round', opacity: 0.85, className: 'boundary-flow' }).addTo(map)

  const STATUS = { normal: '#19d98b', warn: '#ffcc33', error: '#ff4d5a', infra: '#5c7cff' }
  const pois = [
    { lat: 32.695, lng: 109.025, label: '村委会', icon: '🏛️', status: 'infra' },
    { lat: 32.697, lng: 109.028, label: '蜂糖李基地', icon: '🍎', status: 'normal' },
    { lat: 32.696, lng: 109.030, label: '富硒黄桃园', icon: '🍎', status: 'normal' },
    { lat: 32.693, lng: 109.027, label: '油葵种植区', icon: '🌾', status: 'normal' },
    { lat: 32.698, lng: 109.022, label: '阳光玫瑰葡萄园', icon: '🌰', status: 'normal' },
    { lat: 32.694, lng: 109.032, label: '荷花种植区', icon: '🍒', status: 'normal' },
    { lat: 32.692, lng: 109.023, label: '智能温室大棚', icon: '🥬', status: 'normal' },
    { lat: 32.696, lng: 109.020, label: '澳洲龙虾基地', icon: '🐖', status: 'normal' },
    { lat: 32.695, lng: 109.022, label: '1组居住区', icon: '🏠', status: 'normal' },
    { lat: 32.693, lng: 109.029, label: '2组居住区', icon: '🏠', status: 'normal' },
    { lat: 32.698, lng: 109.026, label: '3组居住区', icon: '🏠', status: 'normal' },
    { lat: 32.697, lng: 109.025, label: '气象监测站', icon: '📡', status: 'infra' },
    { lat: 32.694, lng: 109.026, label: '土壤传感器#2', icon: '📡', status: 'infra' },
    { lat: 32.692, lng: 109.030, label: '3号水塘', icon: '💧', status: 'warn' },
    { lat: 32.699, lng: 109.028, label: '观景台', icon: '🏞️', status: 'infra' }
  ]

  pois.forEach(p => {
    const color = STATUS[p.status] || '#19d98b'
    const alert = p.status === 'warn' || p.status === 'error'
    const size = p.status === 'infra' ? 6 : (alert ? 14 : 8)
    const marker = L.marker([p.lat, p.lng], { icon: makeDot(color, size, alert) }).addTo(map)
    marker.bindTooltip(p.icon + ' ' + p.label, { permanent: true, direction: 'top', offset: [0, -10], className: 'map-tooltip' })
    const statusText = p.status === 'normal' ? '正常' : p.status === 'warn' ? '预警' : p.status === 'error' ? '异常' : '公共设施'
    marker.bindPopup('<div style="font-family:PingFang SC,Microsoft YaHei,sans-serif;font-size:13px"><b>' + p.icon + ' ' + p.label + '</b><br><span style="color:' + color + ';font-size:11px">状态：' + statusText + '</span></div>')
    marker.on('click', () => {
      const hit = alertItems.find(x => x.lat === p.lat && x.lng === p.lng)
      activeAlert.value = hit ? hit.id : null
      map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), alert ? 16 : 15), { duration: 0.6 })
      setTimeout(() => marker.openPopup(), 650)
    })
  })

  const govIcon = L.divIcon({
    html: '<div style="background:#5c7cff;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;box-shadow:0 0 20px rgba(92,124,255,.7);border:3px solid #fff">🏛️</div>',
    className: '', iconSize: [36, 36], iconAnchor: [18, 18]
  })
  L.marker([32.695, 109.025], { icon: govIcon }).addTo(map)

  L.control.scale({ position: 'bottomright', imperial: false, maxWidth: 120 }).addTo(map)

  const farmCircles = [
    { lat: 32.697, lng: 109.028, radius: 500, label: '苹果园区' },
    { lat: 32.696, lng: 109.030, radius: 350, label: '富硒黄桃园' },
    { lat: 32.693, lng: 109.027, radius: 600, label: '油葵种植区' },
    { lat: 32.698, lng: 109.022, radius: 400, label: '阳光玫瑰葡萄林' },
    { lat: 32.694, lng: 109.032, radius: 300, label: '荷花种植区' },
    { lat: 32.692, lng: 109.023, radius: 350, label: '蔬菜大棚' },
    { lat: 32.696, lng: 109.020, radius: 250, label: '养殖场' }
  ]
  farmCircles.forEach(f => {
    L.circle([f.lat, f.lng], { radius: f.radius, color: '#22B573', fillColor: '#22B573', fillOpacity: 0.08, weight: 1.5, dashArray: '6 4' })
      .addTo(map).bindTooltip(f.label, { direction: 'center', className: 'map-tooltip' })
  })

  if (!mapStylesAdded) {
    const style = document.createElement('style')
    style.textContent = '.map-tooltip{background:rgba(8,28,58,0.92)!important;border:1px solid rgba(14,165,233,0.28)!important;border-radius:8px!important;color:#c8daea!important;font-size:11px!important;padding:2px 8px!important;font-family:"PingFang SC","Microsoft YaHei",sans-serif!important;box-shadow:0 2px 8px rgba(0,0,0,.4)!important}.leaflet-popup-content-wrapper{background:rgba(4,18,40,0.95)!important;border:1px solid rgba(14,165,233,0.28)!important;color:#c8daea!important;border-radius:6px!important}.leaflet-popup-tip{background:rgba(4,18,40,0.95)!important}'
    document.head.appendChild(style)
    mapStylesAdded = true
  }

  setTimeout(() => map.invalidateSize(), 300)
}

// ==================== AI Refresh ====================
let aiRefreshTimer
function refreshAI() {
  const conclusions = [
    '农业用水存在异常波动，建议关注3号水塘水质及灌溉水压',
    '苹果园区蚜虫风险上升，建议48小时内开展防治',
    '独居老人活动异常已自动研判，建议网格员上门核查',
    '当前态势平稳，各监测点位运行正常'
  ]
  aiConclusion.value = conclusions[Math.floor(Math.random() * conclusions.length)]
}

// ==================== KEYBOARD SHORTCUTS ====================
function onKeydown(e) {
  if (e.key === 'Escape') {
    if (isFullscreen.value && !document.fullscreenElement) { isFullscreen.value = false; applyFullscreenLayout(); return }
    closeDetail(); closeModal()
  }
}

// ==================== RESIZE HANDLER ====================
function onResize() {
  isMobile.value = window.innerWidth <= 1200
  chartInstances.forEach(c => { try { c.resize() } catch (e) { /* ignore */ } })
  if (map) { try { map.invalidateSize() } catch (e) { /* ignore */ } }
}

// ==================== LIFECYCLE ====================
onMounted(() => {
  window._toast = toast
  window._closeModal = closeModal
  window._svc = {
    selectReportType, prevReportStep, addReportPhoto, removeReportPhoto,
    triggerPhotoUpload, handlePhotoSelected, getCurrentLocation,
    submitReport, closeAndRefresh, callGridWorker, showGridWorkerInfo, showMyGrid, showNoticeDetailById, goToSubsidy,
    showMyReports, startEnvReport, showMyEventDetailById, showServiceRequestDetailById, filterMyReports, previewPhoto, openGarbagePoint, openGarbagePointById, viewGarbageLocation, remindClean, reportGarbage, contactCleaner, requestStraw, reportEnvironment, viewWaterAlert,
    openWaterBodyByIdx, reportWaterSupplement, viewWaterLocation, reportFromMonitor, setStrawType, setStrawExpect, getStrawLocation, submitStrawApply, openStrawApp, backToGarbage, strawFormBack, backToMyReports, showContactCurrent, callLeader, guideContactById, guideLeaveById, showLeaveMessage, submitLeaveMessage, triggerMsgPhotoUpload, handleMsgPhotoSelected, removeMsgPhoto, showMyMessages, openMessageDetail, resolveMessage, withdrawMessage, supplementMessage, openMessageDetailBy, submitSupplement, setMsgFilter, setMsgPage, openMyData, openVillageData, openVillageDataMore, openDataAuth, showDataUsage, startDataCorrection, setCorrType, triggerCorrPhotoUpload, handleCorrPhotoSelected, removeCorrPhoto, submitCorrection, showMyCorrections, showFamilyMembers, showLandDetail, setActivityFilter, openVillageSub, viewFacilityLocation, openFinanceCategory, showPolicyList, setPolicyFilter, showPolicyDetail, backToPolicyList, setIndustryYear, setBenefitYear, openSubsidyDetail, openInsuranceDetail, viewPlotLocation, showIotHistory, showIotAlerts, camAction,
    toast, executeRestore, dispatchAlert, markAlertRead, viewAlertProgress, viewAlertResult, openResource: function(url) { toast('打开资源：' + url, 'info') },
    offlineBnb, relistBnb, openAddUser, submitNewUser, editUserRole, submitUserRole, toggleUserStatus,
    refundOrder, confirmRefund, exportOrders, showAuditDetail, confirmRejectAudit,
    toggleNotifyRuleChannel, submitNotifyRule, confirmDeleteNotifyRule,
    showAdminServiceRequests, setAdminSrFilter, refreshAdminSr, openAdminSrReply, setAdminSrReplyStatus, backToAdminSr, submitAdminSrReply
  }
  isMobile.value = window.innerWidth <= 1200
  if (isVillager.value) loadMyServiceRequests()
  if (isVillager.value) loadSellProducts()
  if (isVillager.value) loadMyIndustry()
  if (isVillager.value) loadMyBenefits()
  if (isBusinessEntity.value) loadBizProducts()
  if (isAdmin.value) loadReviewProducts()
  initParticles()
  updateClock()
  clockTimer = setInterval(updateClock, 1000)
  aiRefreshTimer = setInterval(refreshAI, 30000)
  window.addEventListener('resize', onResize)
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('fullscreenchange', onFullscreenChange)
  // 从首页「数据大屏」进入 → 直接进入全屏沉浸大屏（不依赖浏览器全屏授权）
  if (route.query.fullscreen === '1') {
    isFullscreen.value = true
    applyFullscreenLayout()
  }
  nextTick(() => {
    initDashboardCharts(); initMap()
    setTimeout(() => { chartInstances.forEach(c => { try { c.resize() } catch (e) {} }); if (map) { try { map.invalidateSize() } catch (e) {} } }, 80)
    setTimeout(() => { chartInstances.forEach(c => { try { c.resize() } catch (e) {} }) }, 300)
  })
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  if (clockTimer) clearInterval(clockTimer)
  if (aiRefreshTimer) clearInterval(aiRefreshTimer)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  disposeCharts()
  if (map) { map.remove(); map = null }
})

// ==================== DATA ====================

// Alert items
const activeAlert = ref(null)
const alertItems = [
  { id: 1, icon: '🌧️', title: '未来3天降雨概率80%', desc: '建议暂停灌溉', time: '10分钟前', lat: 32.697, lng: 109.025, level: 'warning', status: 'dispatched', duration: '持续监测', device: '村气象站', location: '全村范围' },
  { id: 2, icon: '🐛', title: '苹果园区蚜虫预警', desc: '建议48h内防治', time: '25分钟前', lat: 32.697, lng: 109.028, level: 'warning', status: 'pending', duration: '新发现', device: '植保监测点', location: '苹果园区' },
  { id: 3, icon: '👴', title: '独居老人异常-张奶奶', desc: '24h未检测到活动', time: '1小时前', lat: 32.695, lng: 109.022, level: 'danger', status: 'pending', duration: '24小时', device: '居家安全监测', location: '2组 · 张奶奶户' },
  { id: 4, icon: '💧', title: '3号水塘水质异常', desc: '溶解氧偏低', time: '2小时前', lat: 32.692, lng: 109.030, level: 'warning', status: 'dispatched', duration: '2小时', device: '水质监测器', location: '3号水塘' },
  { id: 5, icon: '🔥', title: '秸秆焚烧烟雾预警', desc: '村北监控发现烟雾', time: '3小时前', lat: 32.693, lng: 109.027, level: 'danger', status: 'pending', duration: '即时', device: '烟雾监控', location: '村北 · 3号地块' },
  { id: 6, icon: '📶', title: '土壤传感器离线', desc: '设备数据已中断', time: '4小时前', lat: 32.694, lng: 109.026, level: 'info', status: 'dispatched', duration: '30分钟', device: '2号土壤传感器', location: '东片区 / 2号地块' },
  { id: 7, icon: '🚜', title: '农资车辆占道', desc: '影响进村主干道通行', time: '5小时前', lat: 32.695, lng: 109.025, level: 'info', status: 'done', duration: '已处置', device: '道路监控', location: '进村主干道' }
]
const alertScrollItems = [...alertItems, ...alertItems]

// 人口关怀名单（按年龄段分组，联动金字塔点击）
const careGroups = {
  '65岁以上': [
    { name: '张奶奶', tag: '独居', status: '异常', event: '24h未检测到活动', alertId: 3 },
    { name: '李建国', tag: '独居', status: '随访', event: '高血压·本周上门随访' },
    { name: '王秀英', tag: '失能', status: '照护', event: '每日2次上门照护' }
  ],
  '41-65岁': [
    { name: '慢病随访', tag: '26人', status: '随访', event: '季度血压/血糖监测' }
  ],
  '18-40岁': [
    { name: '外出务工', tag: '412人', status: '跟踪', event: '社保续缴提醒已发送' },
    { name: '返乡创业', tag: '12人', status: '扶持', event: '创业补贴申报进行中' }
  ],
  '0-17岁': [
    { name: '留守儿童', tag: '3人', status: '看护', event: '暑期集中看护中' },
    { name: '助学名单', tag: '5人', status: '待办', event: '秋季助学申请待审核' }
  ]
}

// IoT device list
const iotDeviceList = [
  { id: 1, name: '1号气象站', status: 'online', statusText: '在线' },
  { id: 2, name: '2号土壤传感器', status: 'online', statusText: '在线' },
  { id: 3, name: '1号水质监测仪', status: 'warn', statusText: '异常' },
  { id: 4, name: '村口监控摄像头', status: 'online', statusText: '在线' },
  { id: 5, name: '养殖场环境传感器', status: 'online', statusText: '在线' },
  { id: 6, name: '4号土壤传感器', status: 'offline', statusText: '离线' }
]
const iotScrollItems = [...iotDeviceList, ...iotDeviceList]

// Bottom cards (single row of key metrics)
const bottomMetrics = [
  { label: '今日办事量', value: '156', trend: '+18%', tone: 'up' },
  { label: '今日电商订单', value: '128', trend: '+12%', tone: 'up' },
  { label: '本月游客', value: '3,200', trend: '+22%', tone: 'up' },
  { label: '待处理事件', value: '3件', trend: '-40%', tone: 'good' },
  { label: '村民留言', value: '8条', trend: '+3条', tone: 'up' }
]

// Industry
const industryStats = [
  { label: '今日电商订单', value: '128', sub: '↑12% 较昨日', icon: '🛒', iconBg: 'rgba(57,217,138,0.12)' },
  { label: '在产农作物', value: '10类', sub: '蜂糖李/富硒黄桃/阳光玫瑰/油葵/荷花', icon: '🌱', iconBg: 'rgba(14,165,233,.10)' },
  { label: '本月游客', value: '3,200', sub: '灯光音乐节/垂钓大赛', icon: '🎒', iconBg: '#FFF8E8' },
  { label: '集体经济收入', value: '¥300万', sub: '全市第三 全县第一', icon: '📦', iconBg: 'rgba(14,165,233,.10)' }
]
const industryTabs = [
  { key: 'farming', label: '智慧农业' }, { key: 'ecommerce', label: '农产品电商' },
  { key: 'tourism', label: '乡村文旅' }, { key: 'livestock', label: '智慧养殖' }
]
const industryModules = {
  farming: [
    { label: '地块管理', icon: '🗂️', iconBg: 'rgba(14,165,233,.10)', desc: '地块信息录入、分类管理、土壤检测记录、种植历史追溯', tags: [{ text: 'GIS标注', cls: 'blue' }, { text: '已上线', cls: 'green' }] },
    { label: '作物档案', icon: '📋', iconBg: 'rgba(57,217,138,0.12)', desc: '品种信息、播种日期、生长周期、预计产量全程追溯', tags: [{ text: '扫码溯源', cls: 'blue' }, { text: '已上线', cls: 'green' }] },
    { label: '农事记录', icon: '📝', iconBg: '#FFF8E8', desc: '施肥、浇水、打药、修剪等农事操作数字化记录与智能提醒', tags: [{ text: '已上线', cls: 'green' }, { text: 'AI建议', cls: 'blue' }] },
    { label: '生长监测', icon: '📷', iconBg: 'rgba(139,92,246,.12)', desc: '物联网传感器+无人机遥感，实时监测作物生长状态', tags: [{ text: 'AI分析', cls: 'blue' }, { text: '已上线', cls: 'green' }] },
    { label: '水肥管理', icon: '💧', iconBg: '#FDE8E8', desc: '智能灌溉系统，根据土壤墒情和气象数据自动调控水肥', tags: [{ text: 'IoT控制', cls: 'blue' }, { text: '已上线', cls: 'green' }] },
    { label: '病虫害预警', icon: '🐛', iconBg: 'rgba(14,165,233,.10)', desc: 'AI图像识别+气象数据分析，提前预警病虫害风险', tags: [{ text: 'AI预警', cls: 'blue' }, { text: '已上线', cls: 'green' }] }
  ],
  ecommerce: [
    { label: '农产品商城', icon: '🛍️', iconBg: 'rgba(57,217,138,0.12)', desc: '商品管理、分类管理、在线下单、销量排行', tags: [{ text: '已上线', cls: 'green' }] },
    { label: '品牌溯源', icon: '🏷️', iconBg: 'rgba(14,165,233,.10)', desc: '全生命周期追溯、区块链存证、检测报告查询', tags: [{ text: '区块链', cls: 'blue' }, { text: '已上线', cls: 'green' }] },
    { label: '物流管理', icon: '📦', iconBg: '#FFF8E8', desc: '订单配送监控、路线优化、配送效率分析', tags: [{ text: '已上线', cls: 'green' }] },
    { label: '运营分析', icon: '📊', iconBg: '#FDE8E8', desc: '销售趋势、热销排行、用户画像、收益分析', tags: [{ text: '数据看板', cls: 'blue' }, { text: '已上线', cls: 'green' }] },
    { label: '订单中心', icon: '📋', iconBg: 'rgba(139,92,246,.12)', desc: '订单全流程管理、发货处理、导出报表', tags: [{ text: '已上线', cls: 'green' }] },
    { label: '直播带货', icon: '📺', iconBg: '#FDE8E8', desc: '直播管理、观看趋势、销售转化率分析', tags: [{ text: '直播', cls: 'blue' }, { text: '已上线', cls: 'green' }] }
  ],
  tourism: [
    { label: '景区管理', icon: '🏞️', iconBg: 'rgba(57,217,138,0.12)', desc: '景区信息、门票管理、游客统计、设施维护', tags: [{ text: '已上线', cls: 'green' }] },
    { label: '民宿管理', icon: '🏡', iconBg: 'rgba(14,165,233,.10)', desc: '民宿列表、预订管理、评价统计、收益分析', tags: [{ text: '已上线', cls: 'green' }] },
    { label: '活动管理', icon: '🎉', iconBg: '#FFF8E8', desc: '采摘节、赏花季、摄影大赛等乡村活动运营', tags: [{ text: '已上线', cls: 'green' }] },
    { label: '数字非遗', icon: '🎭', iconBg: 'rgba(139,92,246,.12)', desc: '本地非遗文化数字化保护、展示与传承平台', tags: [{ text: '规划中', cls: 'yellow' }] }
  ],
  livestock: [
    { label: '养殖档案', icon: '🐖', iconBg: '#FFF8E8', desc: '畜禽品种、存栏量、繁育记录、疫苗接种全程管理', tags: [{ text: '已上线', cls: 'green' }] },
    { label: '环境监测', icon: '🌡️', iconBg: '#FDE8E8', desc: '温湿度、氨气浓度、光照等环境参数实时监控', tags: [{ text: 'IoT实时', cls: 'blue' }, { text: '已上线', cls: 'green' }] },
    { label: '疫病预警', icon: '🩺', iconBg: 'rgba(14,165,233,.10)', desc: 'AI行为监测+环境数据，疫病风险自动告警', tags: [{ text: 'AI预警', cls: 'blue' }] },
    { label: '出栏预测', icon: '📈', iconBg: 'rgba(57,217,138,0.12)', desc: '生长模型+市场数据，智能预测最佳出栏时机', tags: [{ text: '即将上线', cls: 'yellow' }] }
  ]
}
const currentIndustryModules = computed(() => industryModules[industryTab.value] || [])

// Governance — Farmer-facing portal
const govStats = [
  { label: '我的上报', value: '5', sub: '本月累计', icon: '📝', iconBg: '#FDE8E8' },
  { label: '处理中', value: '1', sub: '等待处理', icon: '⏳', iconBg: '#FFF8E8' },
  { label: '已办结', value: '3', sub: '本月办结', icon: '✅', iconBg: 'rgba(57,217,138,0.12)' },
  { label: '所在网格', value: '第2网格', sub: '网格员：王大爷', icon: '🗺️', iconBg: 'rgba(14,165,233,.10)' }
]
const myEvents = [
  { id: '#EV0712', type: '基础设施', location: '村东口路灯不亮', status: '处理中', statusCls: 'warning', time: '7月12日 09:30', timeline: [
    { time: '7月12日 09:30', status: '已提交', desc: '您已成功提交事件上报' },
    { time: '7月12日 10:15', status: '已受理', desc: '网格员王大爷已受理您的事件' },
    { time: '7月12日 14:00', status: '处理中', desc: '已安排电工前往维修' }
  ]},
  { id: '#EV0708', type: '环境卫生', location: '3组晒场旁垃圾堆积', status: '已办结', statusCls: 'online', time: '7月8日 14:20', timeline: [
    { time: '7月8日 14:20', status: '已提交', desc: '您已成功提交事件上报' },
    { time: '7月8日 15:00', status: '已受理', desc: '网格员王大爷已受理您的事件' },
    { time: '7月9日 10:30', status: '已办结', desc: '保洁员已清理完毕，事件办结' }
  ]},
  { id: '#EV0625', type: '农业生产', location: '苹果园区灌溉水压不足', status: '已办结', statusCls: 'online', time: '6月25日 08:15', timeline: [
    { time: '6月25日 08:15', status: '已提交', desc: '您已成功提交事件上报' },
    { time: '6月25日 09:00', status: '已受理', desc: '网格员王大爷已受理您的事件' },
    { time: '6月25日 11:30', status: '处理中', desc: '维修人员已到场检修水泵' },
    { time: '6月25日 16:00', status: '已办结', desc: '水泵已修复，水压恢复正常' }
  ]},
  { id: '#EV0618', type: '安全隐患', location: '3组主干道井盖破损', status: '已办结', statusCls: 'online', time: '6月18日 16:40', timeline: [
    { time: '6月18日 16:40', status: '已提交', desc: '您已成功提交事件上报' },
    { time: '6月18日 17:20', status: '已受理', desc: '网格员王大爷已受理，设置临时警示' },
    { time: '6月19日 09:00', status: '已办结', desc: '新井盖已更换完毕' }
  ]},
  { id: '#EV0520', type: '公共设施', location: '村文化广场健身器材损坏', status: '已驳回', statusCls: 'offline', time: '5月20日 10:00', timeline: [
    { time: '5月20日 10:00', status: '已提交', desc: '您已成功提交事件上报' },
    { time: '5月20日 14:30', status: '已驳回', desc: '该器材已纳入下月统一更换计划，暂不受理' }
  ]}
]
const recentReports = [
  { id: 'R001', ref: '#EV0712', type: '基础设施', icon: '🚧', typeBg: '#19B98A', location: '村东口路灯不亮', time: '7月12日', status: '处理中', statusCls: 'warning' },
  { id: 'R002', ref: '#EV0708', type: '环境卫生', icon: '🧹', typeBg: '#22B573', location: '3组晒场旁垃圾堆积', time: '7月8日', status: '已办结', statusCls: 'online' },
  { id: 'R003', ref: '#EV0625', type: '农业生产', icon: '🌾', typeBg: '#F2A62B', location: '苹果园区灌溉水压不足', time: '6月25日', status: '已办结', statusCls: 'online' }
]
const villageNotices = [
  { id: 'N001', icon: '🏥', title: '65岁以上老人免费体检', tag: '进行中', tagColor: '#22B573', tagBg: 'rgba(34,181,115,0.12)',
    date: '2026-07-15', source: '乡镇卫生院',
    content: '为做好老年人健康管理工作，中堰村将组织65岁以上老年人免费健康体检。请符合条件的村民携带相关材料按时参加。\n\n📅 体检时间：7月18日（周六）上午 8:00–11:30\n📍 体检地点：中堰村村委会一楼大厅\n👴 服务对象：中堰村65岁及以上常住居民（1959年及以前出生）\n📋 携带材料：本人身份证、医保卡\n📞 咨询方式：联系本村第2网格网格员王大爷\n\n注意事项：\n1. 体检当天需空腹，请勿吃早餐\n2. 行动不便的老人可由家属陪同\n3. 如无法按时参加，请提前联系网格员另行安排',
    actionType: 'CONTACT', actionText: '联系网格员', targetModule: null, targetBusinessId: null },
  { id: 'N002', icon: '💧', title: '节水灌溉补贴申请通知', tag: '重要', tagColor: '#F5B83D', tagBg: 'rgba(245,184,61,0.12)',
    date: '2026-07-01', source: '乡镇水利站',
    content: '根据县农业农村局关于推广节水灌溉技术的工作部署，现开展2026年度节水灌溉设施建设补贴申请工作。\n\n📅 申请时间：2026年7月1日–7月31日\n👥 申请对象：中堰村从事农业种植的农户\n📋 补贴条件：新建或改造滴灌、喷灌等节水灌溉设施，面积不低于1亩\n💰 补贴标准：每亩最高补贴800元，每户最高补贴5亩\n📄 所需材料：身份证复印件、土地承包合同、灌溉设施购置发票或施工合同\n📍 办理地点：村委会一楼便民服务大厅\n⏰ 截止日期：2026年7月31日\n\n请符合条件的农户抓紧时间申请，逾期不再受理。',
    actionType: 'SERVICE', actionText: '立即申请', targetModule: 'subsidy', targetBusinessId: 'water-saving-irrigation' },
  { id: 'N003', icon: '⚠️', title: '夏季秸秆禁烧与防火通知', tag: '重要', tagColor: '#E05252', tagBg: 'rgba(224,82,82,0.12)',
    date: '2026-07-05', source: '村委会',
    content: '当前正值夏季高温季节，为做好秸秆禁烧和防火安全工作，现将有关事项通知如下：\n\n一、严禁任何单位和个人在田间地头、路边沟渠焚烧农作物秸秆、杂草和垃圾。\n二、提倡秸秆还田、秸秆饲料化等综合利用方式，村委会可协助联系秸秆回收企业。\n三、各农户需注意用火用电安全，及时清理房前屋后可燃物。\n四、发现火情请立即拨打119，并第一时间通知网格员或村委会。\n五、对违反禁烧规定的，将依法依规处理。\n\n请广大村民相互转告，共同维护安全生活环境。',
    actionType: null, actionText: null, targetModule: null, targetBusinessId: null },
  { id: 'N004', icon: '📢', title: '7月党员活动日通知', tag: null, tagColor: null,
    date: '2026-07-10', source: '村党支部',
    content: '各位党员同志：\n\n根据镇党委统一安排，7月份党员活动日定于7月12日（周日）上午9:00在村党群服务中心二楼会议室举行。\n\n📋 活动内容：\n1. 学习党的二十届三中全会精神\n2. 开展"我为群众办实事"实践活动总结\n3. 讨论下半年村级重点工作计划\n\n请全体党员准时参加，佩戴党徽，携带学习笔记本。如有特殊情况不能参加，须提前向支部书记请假。',
    actionType: null, actionText: null, targetModule: null, targetBusinessId: null }
]
const gridWorker = {
  name: '王大爷', role: '第2网格网格员', avatar: '王',
  phone: '138****1234', realPhone: '13871251234',
  grid: '第2网格', area: '1组片区 · 覆盖186户', dutyStart: '2023年3月',
  serviceHours: '工作日 08:30–17:30',
  serviceNote: '紧急事项请联系村委会值班电话',
  desc: '负责1组片区日常巡查、事件受理、矛盾调解、政策宣传等工作，熟悉片区每户情况，工作认真负责。',
  stats: { resolved: 45, satisfaction: 98 },
  gridDetail: { id: 'GRID_02', name: '第2网格', area: '1组片区', coverage: '186户', boundary: '东至村界、西至村主干道、南至灌溉渠、北至产业园' }
}
// Report type categories — shared by homepage quick cards + step-1 selection modal
const reportTypes = [
  { value: 'infrastructure', icon: '🚧', label: '基础设施', desc: '道路、路灯、水电等' },
  { value: 'environment', icon: '🧹', label: '环境卫生', desc: '垃圾、污水、绿化等' },
  { value: 'safety', icon: '⚠️', label: '安全隐患', desc: '井盖、电线、消防等' },
  { value: 'agriculture', icon: '🌾', label: '农业生产', desc: '灌溉、虫害、施肥等' },
  { value: 'elderly', icon: '👴', label: '老人关怀', desc: '独居老人、困难户等' },
  { value: 'other', icon: '📌', label: '其他事项', desc: '其他需要上报的问题' }
]

// ==================== GOVERNANCE FUNCTIONS ====================
let _reportStep = 0, _reportType = '', _reportDesc = '', _reportLocation = '', _reportPhotos = []
let _reportLat = null, _reportLng = null, _reportAccuracy = null, _reportGpsStatus = 'idle' // idle | locating | located | failed
let _reportPhotoInputId = 'reportPhotoInput_' + Date.now()
let _myReportsFilter = '全部'
let _reportContext = null
let _reportSource = 'MANUAL_REPORT' // 事件来源：MANUAL_REPORT 农户主动上报 | MONITOR_ALERT_SUPPLEMENT 监测告警补充
let _reportSeq = 0
let _lastReportId = ''

function showEventReportForm() {
  _reportStep = 1; _reportType = ''; _reportDesc = ''; _reportLocation = ''; _reportPhotos = []
  _reportLat = null; _reportLng = null; _reportAccuracy = null; _reportGpsStatus = 'idle'
  _reportContext = null
  renderReportForm()
}

function reportPlaceholder() {
  if (_reportContext && _reportContext.problemType === '水质问题') return '例如：水体有异味、颜色异常、发现漂浮物等'
  const map = {
    infrastructure: '例如：路灯不亮、道路破损、水管漏水等',
    environment: '例如：村口垃圾堆积、污水外溢、绿化受损等',
    safety: '例如：井盖缺失、电线裸露、消防通道堵塞等',
    agriculture: '例如：灌溉水压不足、作物虫害、施肥困难等',
    elderly: '例如：独居老人需要上门帮助、代买药品等',
    other: '请详细描述您遇到的问题'
  }
  return map[_reportType] || '请详细描述您遇到的问题'
}
function renderReportForm() {
  if (_reportStep === 1) {
    let h = '<div style="padding:12px 0"><h4 style="color:#1F2D3D;margin:0 0 4px 0;font-size:14px">📝 事件上报 — 第1步：选择问题类型</h4><p style="color:#66788A;font-size:11px;margin:0 0 14px 0">请选择您要上报的问题类型</p>'
    h += '<div style="display:flex;flex-direction:column;gap:8px">'
    reportTypes.forEach(t => {
      h += '<div onclick="window._svc.selectReportType(\'' + t.value + '\')" style="padding:12px 16px;background:#FFFFFF;border:1px solid #E3EAF0;border-radius:8px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:10px" onmouseover="this.style.background=\'rgba(25,185,138,0.06)\';this.style.borderColor=\'rgba(25,185,138,0.35)\'" onmouseout="this.style.background=\'#FFFFFF\';this.style.borderColor=\'#E3EAF0\'">'
      h += '<span style="font-size:13px;color:#1F2D3D;font-weight:600">' + t.icon + ' ' + t.label + '</span>'
      h += '<span style="font-size:10px;color:#66788A;margin-left:auto">' + t.desc + '</span>'
      h += '</div>'
    })
    h += '</div></div>'
    openGovModal('事件上报', h)
  } else if (_reportStep === 2) {
    const typeLabels = { infrastructure: '🚧 基础设施', environment: '🧹 环境卫生', safety: '⚠️ 安全隐患', agriculture: '🌾 农业生产', elderly: '👴 老人关怀', other: '📌 其他事项' }
    let h = '<div style="padding:12px 0"><h4 style="color:#1F2D3D;margin:0 0 4px 0;font-size:14px">📝 事件上报 — 第2步：填写详情</h4><p style="color:#66788A;font-size:11px;margin:0 0 14px 0">类型：' + (typeLabels[_reportType] || _reportType) + '</p>'
    // Auto-filled context (from 监测点 / 水体详情)
    if (_reportContext) {
      h += '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:10px 12px;margin-bottom:12px">'
      h += '<div style="font-size:12px;color:#1E7A54;font-weight:700;margin-bottom:4px">✅ 已自动带入以下信息</div>'
      if (_reportContext.source) h += '<div style="font-size:12px;color:#475867">📍 问题来源：' + _reportContext.source + '</div>'
      if (_reportContext.monitorType) h += '<div style="font-size:12px;color:#475867">📋 监测类型：' + _reportContext.monitorType + '</div>'
      if (_reportContext.problemType) h += '<div style="font-size:12px;color:#475867">📋 问题类型：' + _reportContext.problemType + '</div>'
      if (_reportContext.subType) h += '<div style="font-size:12px;color:#475867">🏷️ 子类型：' + _reportContext.subType + '</div>'
      if (_reportContext.indicator) h += '<div style="font-size:12px;color:#475867">📊 异常指标：' + _reportContext.indicator + '</div>'
      if (_reportContext.value) h += '<div style="font-size:12px;color:#475867">🔢 当前监测值：' + _reportContext.value + '</div>'
      h += '</div>'
    }
    // Problem description
    h += '<div style="margin-bottom:12px"><label style="display:block;font-size:12px;color:#1F2D3D;margin-bottom:6px;font-weight:600">📄 问题描述 <span style="color:#E05252">*</span></label>'
    h += '<textarea id="reportDescInput" placeholder="' + reportPlaceholder() + '" style="width:100%;height:100px;background:#FFFFFF;border:1px solid #D4DCE6;border-radius:8px;color:#1F2D3D;padding:10px 12px;font-size:12px;font-family:inherit;resize:vertical;box-sizing:border-box">' + (_reportDesc || '') + '</textarea></div>'
    // Location text
    h += '<div style="margin-bottom:12px"><label style="display:block;font-size:12px;color:#1F2D3D;margin-bottom:6px;font-weight:600">📍 发生地点 <span style="color:#E05252">*</span></label>'
    h += '<input id="reportLocInput" placeholder="例如：村东口路灯旁" value="' + (_reportLocation || '') + '" style="width:100%;background:#FFFFFF;border:1px solid #D4DCE6;border-radius:8px;color:#1F2D3D;padding:10px 12px;font-size:12px;font-family:inherit;box-sizing:border-box" />'
    h += '<span style="font-size:10px;color:#66788A;margin-top:4px;display:block">填写人能看懂的文字位置，方便网格员快速找到</span></div>'
    // GPS board
    h += '<div style="margin-bottom:12px;background:#F0F3F6;border:1px solid #E3EAF0;border-radius:8px;padding:12px"><label style="display:flex;align-items:center;gap:6px;font-size:12px;color:#1F2D3D;margin-bottom:8px;font-weight:600">🛰️ GPS 定位</label>'
    if (_reportGpsStatus === 'idle') {
      h += '<button class="btn btn-primary btn-sm" onclick="window._svc.getCurrentLocation()" style="margin-bottom:4px">📍 获取当前位置</button>'
    } else if (_reportGpsStatus === 'locating') {
      h += '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;color:#19B98A;font-size:12px"><span style="display:inline-block;width:14px;height:14px;border:2px solid #28C7FA;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite"></span>正在获取位置...</div>'
    } else if (_reportGpsStatus === 'located') {
      const latStr = _reportLat !== null ? _reportLat.toFixed(6) : '--'
      const lngStr = _reportLng !== null ? _reportLng.toFixed(6) : '--'
      const accStr = _reportAccuracy !== null ? '±' + Math.round(_reportAccuracy) + 'm' : ''
      h += '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><span style="display:inline-flex;align-items:center;gap:4px;background:rgba(34,181,115,0.10);color:#22B573;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600">✅ 已定位</span><span style="font-size:11px;color:#475867">' + latStr + ', ' + lngStr + '</span><span style="font-size:10px;color:#66788A">' + accStr + '</span><button class="btn btn-outline btn-xs" onclick="window._svc.getCurrentLocation()" style="margin-left:4px">重新定位</button></div>'
    } else if (_reportGpsStatus === 'failed') {
      h += '<div style="margin-bottom:6px"><span style="display:inline-flex;align-items:center;gap:4px;background:rgba(242,166,43,0.10);color:#F2A62B;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600">⚠️ 定位失败</span><span style="font-size:11px;color:#66788A;margin-left:6px">未能获取当前位置，请检查浏览器定位权限，或手动填写发生地点</span></div>'
      h += '<button class="btn btn-outline btn-xs" onclick="window._svc.getCurrentLocation()">🔄 重新获取</button>'
    }
    h += '<div style="font-size:10px;color:#66788A;margin-top:8px;display:flex;align-items:center;gap:4px"><span>🔒</span> 定位仅用于帮助工作人员快速找到问题位置，不会用于其他用途</div></div>'
    // Photos
    h += '<div style="margin-bottom:12px"><label style="display:block;font-size:12px;color:#1F2D3D;margin-bottom:6px;font-weight:600">📸 现场照片<span style="font-size:10px;color:#66788A;font-weight:400">（最多3张，选填）</span></label>'
    h += '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-start">'
    // Photo thumbnails
    for (let i = 0; i < _reportPhotos.length; i++) {
      const p = _reportPhotos[i]
      if (p.dataUrl) {
        h += '<div style="width:72px;height:72px;border-radius:8px;overflow:hidden;position:relative;border:1px solid #D4DCE6"><img src="' + p.dataUrl + '" style="width:100%;height:100%;object-fit:cover"><span onclick="window._svc.removeReportPhoto(' + i + ')" style="position:absolute;top:2px;right:2px;width:20px;height:20px;border-radius:50%;background:rgba(0,0,0,0.7);color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center;cursor:pointer;line-height:1" title="删除此照片">✕</span>'
        if (p.uploadStatus === 'uploading') h += '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff">上传中...</div>'
        if (p.uploadStatus === 'failed') h += '<div style="position:absolute;bottom:0;left:0;right:0;background:rgba(231,76,60,0.85);font-size:9px;color:#fff;text-align:center;padding:2px">上传失败</div>'
        h += '</div>'
      }
    }
    // Add photo button
    if (_reportPhotos.length < 3) {
      h += '<div onclick="window._svc.triggerPhotoUpload()" style="width:72px;height:72px;border:1px dashed rgba(25,185,138,0.25);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;font-size:22px;color:#66788A;transition:all 0.2s;gap:2px" onmouseover="this.style.borderColor=\'#39D98A\';this.style.color=\'#39D98A\';this.style.background=\'rgba(25,185,138,0.04)\'" onmouseout="this.style.borderColor=\'rgba(25,185,138,0.25)\';this.style.color=\'#6F91A8\';this.style.background=\'transparent\'">📷<span style="font-size:9px">拍照/上传</span></div>'
    }
    h += '</div><span style="font-size:9px;color:#66788A;margin-top:4px;display:block">支持手机拍照或相册选择，大图自动压缩</span></div>'
    // Buttons
    h += '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px;border-top:1px solid #F0F3F5;padding-top:14px">'
    h += '<button class="btn btn-outline" onclick="window._svc.prevReportStep()">← 上一步</button>'
    h += '<button class="btn btn-primary" onclick="window._svc.submitReport()" ' + (_reportGpsStatus === 'locating' ? 'disabled style="opacity:0.5;cursor:not-allowed"' : '') + '>提交上报</button>'
    h += '</div></div>'
    openGovModal('事件上报', h)
    // Create hidden file input after modal renders
    setTimeout(() => {
      let fi = document.getElementById('reportPhotoFileInput')
      if (!fi) {
        fi = document.createElement('input')
        fi.type = 'file'; fi.id = 'reportPhotoFileInput'; fi.accept = 'image/*'
        fi.multiple = false; fi.style.display = 'none'
        fi.onchange = function(e) { if (this.files && this.files[0]) window._svc.handlePhotoSelected(this.files[0]) }
        document.body.appendChild(fi)
      }
    }, 100)
  } else if (_reportStep === 3) {
    let h = '<div style="text-align:center;padding:24px 0"><div style="font-size:48px;margin-bottom:12px">✅</div>'
    h += '<h4 style="color:#22B573;margin:0 0 8px 0;font-size:15px">上报成功</h4>'
    h += '<p style="color:#66788A;font-size:12px;margin:0 0 4px 0">事件编号：<span style="color:#1F2D3D;font-weight:700">' + (_lastReportId || '') + '</span></p>'
    h += '<p style="color:#66788A;font-size:12px;margin:0 0 4px 0">当前状态：<span style="color:#19B98A;font-weight:600">待受理</span></p>'
    h += '<p style="color:#66788A;font-size:11px;margin:0 0 20px 0">可在「我的上报」查看处理进度</p>'
    h += '<div style="display:flex;gap:8px;justify-content:center"><button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">完成</button><button class="btn btn-primary" onclick="window._svc.closeAndRefresh()">查看我的上报</button></div></div>'
    openGovModal('事件上报', h)
  }
}

function selectReportType(type, context) {
  _reportType = type
  _reportStep = 2
  _reportDesc = ''; _reportLocation = ''; _reportPhotos = []
  _reportLat = null; _reportLng = null; _reportAccuracy = null; _reportGpsStatus = 'idle'
  _reportContext = context || null
  _reportSource = (context && context.eventSource) || 'MANUAL_REPORT'
  if (context && context.location) _reportLocation = context.location
  if (context && context.desc) _reportDesc = context.desc
  if (context && context.lat != null && context.lng != null) {
    _reportLat = context.lat
    _reportLng = context.lng
    _reportGpsStatus = 'located'
  }
  renderReportForm()
}

function getCurrentLocation() {
  _reportGpsStatus = 'locating'
  renderReportForm()
  if (!navigator.geolocation) {
    _reportGpsStatus = 'failed'
    renderReportForm()
    toast('浏览器不支持GPS定位，请手动填写位置', 'warn')
    return
  }
  navigator.geolocation.getCurrentPosition(
    function(pos) {
      _reportLat = pos.coords.latitude
      _reportLng = pos.coords.longitude
      _reportAccuracy = pos.coords.accuracy
      _reportGpsStatus = 'located'
      renderReportForm()
      toast('定位成功（精度：±' + Math.round(pos.coords.accuracy) + 'm）', 'success')
    },
    function(err) {
      _reportGpsStatus = 'failed'
      renderReportForm()
      const msgs = { 1: '定位被拒绝，请在浏览器设置中允许定位权限', 2: '定位暂时不可用，请检查GPS或网络', 3: '定位超时，请重试' }
      toast(msgs[err.code] || '定位失败，请手动填写位置', 'warn')
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
  )
}

function prevReportStep() {
  _reportStep = 1
  _reportType = ''
  _reportContext = null
  renderReportForm()
}

function triggerPhotoUpload() {
  if (_reportPhotos.length >= 3) { toast('最多上传3张照片', 'warn'); return }
  const fi = document.getElementById('reportPhotoFileInput')
  if (fi) { fi.value = ''; fi.click() }
}

function handlePhotoSelected(file) {
  if (!file) return
  if (_reportPhotos.length >= 3) { toast('最多上传3张照片', 'warn'); return }
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) { toast('图片不能超过10MB', 'warn'); return }
  const idx = _reportPhotos.length
  _reportPhotos.push({ name: file.name, size: file.size, dataUrl: '', uploadStatus: 'uploading' })
  renderReportForm()
  // Compress and read
  const reader = new FileReader()
  reader.onload = function(e) {
    const img = new Image()
    img.onload = function() {
      const maxW = 1280, maxH = 1280
      let w = img.width, h = img.height
      if (w > maxW || h > maxH) {
        if (w > h) { h = Math.round(h * maxW / w); w = maxW }
        else { w = Math.round(w * maxH / h); h = maxH }
      }
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      const compressed = canvas.toDataURL('image/jpeg', 0.80)
      _reportPhotos[idx].dataUrl = compressed
      _reportPhotos[idx].uploadStatus = 'done'
      renderReportForm()
    }
    img.src = e.target.result
  }
  reader.onerror = function() {
    _reportPhotos[idx].uploadStatus = 'failed'
    renderReportForm()
    toast('照片读取失败，请重试', 'error')
  }
  reader.readAsDataURL(file)
}

function removeReportPhoto(idx) {
  if (idx >= 0 && idx < _reportPhotos.length) {
    _reportPhotos.splice(idx, 1)
    renderReportForm()
  }
}

function addReportPhoto() {
  triggerPhotoUpload()
}

async function submitReport() {
  const descEl = document.getElementById('reportDescInput')
  const locEl = document.getElementById('reportLocInput')
  const desc = descEl ? descEl.value.trim() : ''
  const loc = locEl ? locEl.value.trim() : ''
  if (!desc) { toast('请填写问题描述', 'warn'); return }
  if (!loc) { toast('请填写发生地点', 'warn'); return }
  // Check photo upload status
  const failedPhotos = _reportPhotos.filter(function(p) { return p.uploadStatus === 'failed' })
  if (failedPhotos.length > 0) {
    toast('第' + (_reportPhotos.indexOf(failedPhotos[0]) + 1) + '张照片上传失败，请删除后重新上传', 'warn')
    return
  }
  const uploadingPhotos = _reportPhotos.filter(function(p) { return p.uploadStatus === 'uploading' })
  if (uploadingPhotos.length > 0) {
    toast('还有照片正在处理中，请稍候...', 'warn')
    return
  }
  _reportDesc = desc
  _reportLocation = loc
  const typeLabelMap = { infrastructure: '基础设施', environment: '环境卫生', safety: '安全隐患', agriculture: '农业生产', elderly: '老人关怀', other: '其他事项' }
  const typeLabel = typeLabelMap[_reportType] || '其他事项'
  // 调用后端提交诉求：farmer_id 由后端从 token 解析，前端不传，防止篡改
  try {
    const res = await submitServiceRequest({
      requestType: typeLabel,
      content: '地点：' + loc + '；描述：' + desc,
      contactPhone: currentUser.phone
    })
    if (res && res.code === 200 && res.data) {
      _lastReportId = res.data.id
      _reportStep = 3
      renderReportForm()
      toast('诉求已提交', 'success')
      loadMyServiceRequests() // 提交后刷新我的办事记录
    } else if (res && res.code === 403) {
      toast(res.message || '请以农户身份登录后提交', 'warn')
    } else {
      toast((res && res.message) || '提交失败，请稍后重试', 'error')
    }
  } catch (e) {
    // 请求失败已由 request.js 拦截器提示或跳转登录页，此处静默
  }
}

function closeAndRefresh() {
  closeModal()
  showMyReports()
}

function showMyReports(filter) {
  if (filter) _myReportsFilter = filter
  var filters = ['全部', '待受理', '处理中', '已办结', '已驳回']
  var statusMap = { '待受理': '待受理', '处理中': '处理中', '已办结': '已办结', '已驳回': '已驳回' }
  var filtered = myEvents
  if (_myReportsFilter !== '全部') {
    filtered = myEvents.filter(function(e) { return e.status === statusMap[_myReportsFilter] })
  }
  // ===== INLINE-STYLE CONTAINER — all styles inline because scoped CSS cannot reach v-html =====
  var CONTAINER_H = 500 // px — fixed height (same across filter states)
  // Count bar
  var h = '<div style="flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 0 10px 0">'
  h += '<span style="font-size:13px;color:#475867">共 <b style="color:#22B573">' + filtered.length + '</b> 条记录' + (_myReportsFilter !== '全部' ? '<span style="font-size:10px;color:#66788A;margin-left:4px">（已筛选）</span>' : '') + '</span>'
  h += '</div>'
  // Filter tabs — inline pill buttons
  h += '<div style="flex-shrink:0;display:flex;gap:6px;flex-wrap:wrap;padding:0 0 12px 0">'
  filters.forEach(function(f) {
    var isActive = _myReportsFilter === f
    var count = f === '全部' ? myEvents.length : myEvents.filter(function(e) { return e.status === statusMap[f] }).length
    var pillBg = isActive ? 'rgba(25,185,138,0.12)' : '#FFFFFF'
    var pillBorder = isActive ? '1px solid #19B98A' : '1px solid #E3EAF0'
    var pillColor = isActive ? '#19B98A' : '#475867'
    var pillWeight = isActive ? '700' : '500'
    h += '<button onclick="window._svc.filterMyReports(\'' + f + '\')" style="padding:6px 14px;border-radius:16px;font-size:11px;font-weight:' + pillWeight + ';cursor:pointer;font-family:inherit;transition:all 0.2s;border:' + pillBorder + ';background:' + pillBg + ';color:' + pillColor + ';line-height:1.4" onmouseover="if(this.dataset.active===\'false\'){this.style.borderColor=\'rgba(25,185,138,0.30)\';this.style.background=\'rgba(25,185,138,0.06)\'}" onmouseout="if(this.dataset.active===\'false\'){this.style.borderColor=\'#E3EAF0\';this.style.background=\'#FFFFFF\'}" data-active="' + isActive + '">' + f + ' <span style="font-size:10px;opacity:0.65;margin-left:2px">' + count + '</span></button>'
  })
  h += '</div>'
  // Scrollable list — fills remaining height
  h += '<div style="flex:1 1 0;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:8px">'
  if (filtered.length === 0) {
    h += '<div style="flex:1;display:flex;align-items:center;justify-content:center;color:#66788A;font-size:13px">📭 ' + (_myReportsFilter !== '全部' ? '该状态下暂无上报记录' : '暂无上报记录') + '</div>'
  } else {
    filtered.forEach(function(e) {
      var sc = { '处理中': '#F2A62B', '已办结': '#22B573', '已驳回': '#E05252', '待受理': '#19B98A', '已提交': '#19B98A', '已受理': '#19B98A' }
      var color = sc[e.status] || '#66788A'
      h += '<div onclick="window._svc.showMyEventDetailById(\'' + e.id + '\')" style="flex-shrink:0;padding:12px 14px;background:#FAFBFC;border:1px solid #EBEFF4;border-radius:8px;cursor:pointer;transition:all 0.2s" onmouseover="this.style.background=\'rgba(25,185,138,0.05)\';this.style.borderColor=\'rgba(25,185,138,0.20)\'" onmouseout="this.style.background=\'#FAFBFC\';this.style.borderColor=\'#EBEFF4\'">'
      h += '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">'
      h += '<div style="flex:1;min-width:0">'
      h += '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:4px">' + e.type + '</div>'
      h += '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:10px;color:#66788A">'
      h += '<span>📅 ' + e.time + '</span><span>📍 ' + e.location + '</span>'
      if (e.latitude && e.longitude) h += '<span style="color:#22B573">🛰️ 已定位</span>'
      if (e.photos && e.photos.length > 0) h += '<span>📸 ' + e.photos.length + '张</span>'
      h += '</div></div>'
      h += '<div style="flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:4px">'
      h += '<span style="display:inline-block;padding:3px 10px;border-radius:10px;font-size:10px;font-weight:600;background:rgba(' + (e.status === '已办结' ? '34,181,115' : e.status === '处理中' ? '242,166,43' : e.status === '已驳回' ? '224,82,82' : '25,185,138') + ',0.12);color:' + color + '">' + e.status + '</span>'
      h += '<span style="font-size:9px;color:#66788A">查看详情 →</span>'
      h += '</div></div></div>'
    })
    h += '<div style="flex-shrink:0;text-align:center;font-size:10px;color:rgba(102,120,138,0.45);padding:6px 0 2px 0">— 共 ' + filtered.length + ' 条记录 —</div>'
  }
  h += '</div>'
  // Wrap in flex column with explicit height
  h = '<div style="display:flex;flex-direction:column;width:100%;height:' + CONTAINER_H + 'px;overflow:hidden;box-sizing:border-box">' + h + '</div>'
  openGovModal('📋 我的上报', h)
  // Pin modal-box dimensions — override default 500px width + overflow-y:auto
  setTimeout(function() {
    var box = document.querySelector('.modal.show .modal-box')
    if (box) {
      box.style.width = '760px'
      box.style.maxWidth = '90vw'
      box.style.height = (CONTAINER_H + 72) + 'px' // 72 = h3 + padding
      box.style.maxHeight = '85vh'
      box.style.overflow = 'hidden'
      box.style.padding = '20px 24px'
      box.style.boxSizing = 'border-box'
    }
  }, 30)
}

function filterMyReports(filter) {
  showMyReports(filter)
}


function showMyEventDetailById(id) {
  var e = myEvents.find(function(x) { return x.id === id })
  if (e) showMyEventDetail(e)
  // Reset modal box to default for event detail
  setTimeout(function() {
    var box = document.querySelector('.modal.show .modal-box')
    if (box) {
      box.style.width = ''; box.style.maxWidth = ''; box.style.height = ''
      box.style.maxHeight = ''; box.style.overflow = ''; box.style.padding = ''
      box.style.boxSizing = ''
    }
  }, 30)
}

function showMyEventDetail(e) {
  var colors = { '处理中': '#F2A62B', '已办结': '#22B573', '已驳回': '#E05252', '待受理': '#19B98A', '已提交': '#19B98A', '已受理': '#19B98A' }
  var h = ''
  // Header: event ID + type
  h += '<div style="text-align:center;padding:8px 0 16px 0">'
  h += '<div style="font-size:11px;color:#66788A;margin-bottom:4px">' + e.id + '</div>'
  h += '<h3 style="color:#1F2D3D;margin:0;font-size:15px">' + e.type + '</h3>'
  h += '</div>'
  // Unified basic info card (label left, value right, full-width)
  var statusColor = colors[e.status] || '#66788A'
  var gpsText = (e.latitude && e.longitude) ? '已定位（' + e.latitude.toFixed(6) + ', ' + e.longitude.toFixed(6) + '）' : '未获取'
  h += '<div style="background:#F0F3F6;border:1px solid #EBEFF4;border-radius:8px;overflow:hidden;margin-bottom:16px">'
  h += '<div style="display:flex;padding:10px 16px;border-bottom:1px solid #E6ECF2;font-size:12px"><span style="flex-shrink:0;width:76px;color:#66788A">问题类型</span><span style="color:#1F2D3D;font-weight:500">' + e.type + '</span></div>'
  if (e.source) h += '<div style="display:flex;padding:10px 16px;border-bottom:1px solid #E6ECF2;font-size:12px"><span style="flex-shrink:0;width:76px;color:#66788A">上报来源</span><span style="color:#1F2D3D;font-weight:500">' + (e.source === 'MONITOR_ALERT_SUPPLEMENT' ? '监测告警补充上报' : '农户主动上报') + '</span></div>'
  h += '<div style="display:flex;padding:10px 16px;border-bottom:1px solid #E6ECF2;font-size:12px"><span style="flex-shrink:0;width:76px;color:#66788A">发生地点</span><span style="color:#1F2D3D;font-weight:500">📍 ' + e.location + '</span></div>'
  if (e.description) h += '<div style="display:flex;padding:10px 16px;border-bottom:1px solid #E6ECF2;font-size:12px"><span style="flex-shrink:0;width:76px;color:#66788A">问题描述</span><span style="color:#1F2D3D;font-weight:500;flex:1">' + e.description + '</span></div>'
  h += '<div style="display:flex;padding:10px 16px;border-bottom:1px solid #E6ECF2;font-size:12px"><span style="flex-shrink:0;width:76px;color:#66788A">上报时间</span><span style="color:#1F2D3D;font-weight:500">' + e.time + '</span></div>'
  h += '<div style="display:flex;padding:10px 16px;border-bottom:1px solid #E6ECF2;font-size:12px"><span style="flex-shrink:0;width:76px;color:#66788A">当前状态</span><span style="color:' + statusColor + ';font-weight:600">● ' + e.status + '</span></div>'
  h += '<div style="display:flex;padding:10px 16px;font-size:12px"><span style="flex-shrink:0;width:76px;color:#66788A">GPS位置</span><span style="color:#1F2D3D;font-weight:500">' + gpsText + '</span></div>'
  h += '</div>'

  // Photos section
  if (e.photos && e.photos.length > 0) {
    h += '<div class="detail-section"><h4>📸 现场照片（' + e.photos.length + '张）</h4>'
    h += '<div style="display:flex;gap:8px;flex-wrap:wrap">'
    e.photos.forEach(function(p) {
      if (p.dataUrl) {
        h += '<div style="width:80px;height:80px;border-radius:6px;overflow:hidden;border:1px solid #D4DCE6"><img src="' + p.dataUrl + '" style="width:100%;height:100%;object-fit:cover" onclick="window._svc.previewPhoto(\'' + p.dataUrl.replace(/'/g, "\'") + '\')" /></div>'
      } else {
        h += '<div style="width:80px;height:80px;border-radius:6px;background:#FFFFFF;border:1px solid #E3EAF0;display:flex;align-items:center;justify-content:center;font-size:24px">📄</div>'
      }
    })
    h += '</div></div>'
  }
  // Timeline section
  if (e.timeline && e.timeline.length > 0) {
    h += '<div class="detail-section"><h4>📋 处理进度</h4>'
    h += '<div style="position:relative;padding-left:20px">'
    e.timeline.forEach(function(t, i) {
      var isLast = i === e.timeline.length - 1
      var color = colors[t.status] || '#66788A'
      h += '<div style="position:relative;padding-bottom:' + (isLast ? '4px' : '20px') + '">'
      if (!isLast) h += '<div style="position:absolute;left:-17px;top:10px;bottom:-10px;width:2px;background:#E3EAF0"></div>'
      // Dot
      h += '<div style="position:absolute;left:-20px;top:6px;width:8px;height:8px;border-radius:50%;background:' + color + ';box-shadow:0 0 8px ' + color + '"></div>'
      // Content
      h += '<div style="font-size:10px;color:#66788A;margin-bottom:2px">' + t.time + '</div>'
      h += '<div style="font-size:11px;color:#1F2D3D"><span style="display:inline-block;padding:1px 8px;border-radius:10px;font-size:9px;font-weight:600;color:' + color + ';margin-right:6px">● ' + t.status + '</span>' + t.desc + '</div>'
      h += '</div>'
    })
    h += '</div></div>'
  }
  // Action buttons
  h += '<div class="detail-actions">'
  h += '<button class="btn btn-outline" onclick="window._svc.backToMyReports()">← 返回我的上报</button>'
  if (e.status === '处理中' || e.status === '待受理') {
    h += '<button class="btn btn-outline" onclick="window._svc.toast(\'催办已发送\',\'info\')" style="color:#F2A62B;border-color:rgba(245,158,11,0.3)">⏳ 催办</button>'
  }
  h += '</div>'
  openGovModal('事件详情', h)
}

// 事件详情 → 返回「我的上报」列表（关闭 × 才是退出整个流程）
function backToMyReports() { showMyReports(_myReportsFilter) }

function previewPhoto(dataUrl) {
  var h = '<div style="text-align:center"><img src="' + dataUrl + '" style="max-width:100%;max-height:70vh;border-radius:8px" /></div>'
  h += '<div style="text-align:center;margin-top:10px"><button class="btn btn-outline btn-sm" onclick="window._closeModal && window._closeModal()">关闭</button></div>'
  openGovModal('📸 照片预览', h)
}

function showGridWorkerInfo() {
  const gw = gridWorker
  var h = ''
  // Avatar + name + role
  h += '<div style="text-align:center;padding:8px 0 14px 0">'
  h += '<div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#19B98A,#16A37A);display:inline-flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:#fff;margin-bottom:10px;box-shadow:0 0 20px rgba(25,185,138,0.20)">' + gw.avatar + '</div>'
  h += '<h4 style="color:#1F2D3D;margin:0 0 2px 0;font-size:15px">' + gw.name + '</h4>'
  h += '<p style="color:#19B98A;font-size:11px;margin:0">' + gw.role + '</p>'
  h += '</div>'
  // Basic info
  h += '<div style="margin-bottom:14px;background:#F0F3F6;border:1px solid #EBEFF4;border-radius:8px;overflow:hidden">'
  h += '<div style="display:flex;justify-content:space-between;padding:10px 14px;border-bottom:1px solid #F0F3F8;font-size:12px"><span style="color:#66788A">所属网格</span><span style="color:#1F2D3D;font-weight:500">' + gw.grid + '</span></div>'
  h += '<div style="display:flex;justify-content:space-between;padding:10px 14px;border-bottom:1px solid #F0F3F8;font-size:12px"><span style="color:#66788A">管辖范围</span><span style="color:#1F2D3D;font-weight:500">' + gw.area + '</span></div>'
  h += '<div style="display:flex;justify-content:space-between;padding:10px 14px;border-bottom:1px solid #F0F3F8;font-size:12px"><span style="color:#66788A">联系电话</span><span style="color:#1F2D3D;font-weight:500">' + gw.phone + '</span></div>'
  h += '<div style="display:flex;justify-content:space-between;padding:10px 14px;border-bottom:1px solid #F0F3F8;font-size:12px"><span style="color:#66788A">服务时间</span><span style="color:#1F2D3D;font-weight:500">' + gw.serviceHours + '</span></div>'
  h += '<div style="padding:10px 14px;font-size:11px;color:#66788A">' + gw.serviceNote + '</div>'
  h += '</div>'
  // Work overview
  h += '<div style="margin-bottom:14px"><h4 style="font-size:12px;font-weight:700;color:#22B573;margin:0 0 8px 0;display:flex;align-items:center;gap:6px"><span style="display:inline-block;width:3px;height:12px;background:#22B573;border-radius:2px"></span>工作概况</h4>'
  h += '<p style="font-size:11px;color:#475867;line-height:1.6;margin:0">' + gw.desc + '</p>'
  h += '</div>'
  // Stats — simplified: only 2 farmer-relevant numbers
  h += '<div style="margin-bottom:14px"><h4 style="font-size:12px;font-weight:700;color:#22B573;margin:0 0 8px 0;display:flex;align-items:center;gap:6px"><span style="display:inline-block;width:3px;height:12px;background:#22B573;border-radius:2px"></span>服务数据</h4>'
  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
  h += '<div style="text-align:center;padding:12px 8px;background:#FFFFFF;border-radius:8px"><div style="font-size:22px;font-weight:700;color:#22B573">' + gw.stats.resolved + '</div><div style="font-size:10px;color:#66788A;margin-top:2px">已处理事件</div></div>'
  h += '<div style="text-align:center;padding:12px 8px;background:#FFFFFF;border-radius:8px"><div style="font-size:22px;font-weight:700;color:#F2A62B">' + gw.stats.satisfaction + '%</div><div style="font-size:10px;color:#66788A;margin-top:2px">服务评价</div></div>'
  h += '</div></div>'
  // Action buttons
  h += '<div style="display:flex;gap:10px;margin-top:8px">'
  h += '<button class="btn btn-primary" onclick="window._svc.callGridWorker()" style="flex:1;justify-content:center">📞 拨打电话</button>'
  h += '<button class="btn btn-outline" onclick="window._svc.showMyGrid()" style="flex:1;justify-content:center;background:#FFFFFF;border:1px solid #19B98A;color:#19B98A">🗺️ 查看我的网格</button>'
  h += '</div>'
  openGovModal('👤 网格员信息', h)
}

function callGridWorker() {
  toast('正在拨打 ' + gridWorker.name + ' 电话…', 'info')
  setTimeout(function() {
    window.open('tel:' + gridWorker.realPhone, '_self')
  }, 300)
}

function goToSubsidy(businessId) {
  closeModal()
  toast('正在跳转到补贴申请页面…', 'info')
  switchPage('service')
  // Cross-module navigation via ServicePage ref
  setTimeout(function() {
    if (servicePageRef.value && typeof servicePageRef.value.navigateToService === 'function') {
      servicePageRef.value.navigateToService('subsidy', 'applySubsidy', businessId || 'water-saving-irrigation')
    }
  }, 400)
}

function showMyGrid() {
  var gd = gridWorker.gridDetail
  var h = ''
  h += '<div style="text-align:center;padding:8px 0 14px 0">'
  h += '<span style="font-size:40px">🗺️</span>'
  h += '<h4 style="color:#1F2D3D;margin:8px 0 2px 0;font-size:15px">' + gd.name + '</h4>'
  h += '<p style="color:#66788A;font-size:11px;margin:0">' + gridWorker.name + ' 负责区域</p>'
  h += '</div>'
  h += '<div style="background:#F0F3F6;border:1px solid #EBEFF4;border-radius:8px;overflow:hidden;margin-bottom:14px">'
  h += '<div style="display:flex;justify-content:space-between;padding:10px 14px;border-bottom:1px solid #F0F3F8;font-size:12px"><span style="color:#66788A">网格编号</span><span style="color:#1F2D3D;font-weight:500">' + gd.id + '</span></div>'
  h += '<div style="display:flex;justify-content:space-between;padding:10px 14px;border-bottom:1px solid #F0F3F8;font-size:12px"><span style="color:#66788A">负责区域</span><span style="color:#1F2D3D;font-weight:500">' + gd.area + '</span></div>'
  h += '<div style="display:flex;justify-content:space-between;padding:10px 14px;border-bottom:1px solid #F0F3F8;font-size:12px"><span style="color:#66788A">覆盖户数</span><span style="color:#1F2D3D;font-weight:500">' + gd.coverage + '</span></div>'
  h += '<div style="display:flex;justify-content:space-between;padding:10px 14px;font-size:12px"><span style="color:#66788A">四至范围</span><span style="color:#1F2D3D;font-weight:500;text-align:right;max-width:220px">' + gd.boundary + '</span></div>'
  h += '</div>'
  h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()" style="width:100%;justify-content:center">关闭</button>'
  openGovModal('🗺️ 我的网格', h)
}

function showVillageNotices() {
  let h = '<div style="padding:8px 0"><h4 style="color:#1F2D3D;margin:0 0 12px 0;font-size:14px">📢 村务公告</h4>'
  villageNotices.forEach(n => {
    h += '<div onclick="window._svc.showNoticeDetailById(\'' + n.id + '\')" style="padding:10px 12px;background:#FFFFFF;border-radius:6px;margin-bottom:6px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:10px" onmouseover="this.style.background=\'rgba(25,185,138,0.05)\'" onmouseout="this.style.background=\'#FFFFFF\'">'
    h += '<span style="font-size:20px;flex-shrink:0">' + n.icon + '</span>'
    h += '<div style="flex:1;min-width:0">'
    h += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">'
    h += '<span style="font-size:12px;color:#1F2D3D;font-weight:600">' + n.title + '</span>'
    if (n.tag) h += '<span style="display:inline-block;padding:1px 7px;border-radius:8px;font-size:9px;font-weight:600;color:' + n.tagColor + ';background:' + (n.tagBg || 'rgba(100,120,140,0.10)') + ';flex-shrink:0">' + n.tag + '</span>'
    h += '</div>'
    h += '<div style="font-size:10px;color:#66788A">' + n.date + ' · ' + n.source + '</div></div>'
    h += '<span style="font-size:10px;color:#19B98A;flex-shrink:0">查看 →</span>'
    h += '</div>'
  })
  h += '</div>'
  openGovModal('村务公告', h)
}

function showNoticeDetailById(id) {
  const n = villageNotices.find(x => x.id === id)
  if (n) showNoticeDetail(n)
}

function showNoticeDetail(n) {
  var contentHtml = n.content.replace(/\n/g, '<br>')
  var h = ''
  // Title + tag
  h += '<div style="margin-bottom:14px">'
  h += '<h3 style="color:#1F2D3D;margin:0 0 6px 0;font-size:16px">' + n.icon + ' ' + n.title + '</h3>'
  if (n.tag) h += '<span style="display:inline-block;padding:2px 10px;border-radius:10px;font-size:10px;font-weight:600;color:' + n.tagColor + ';background:' + (n.tagBg || 'rgba(100,120,140,0.10)') + '">' + n.tag + '</span>'
  h += '</div>'
  // Meta info
  h += '<div style="background:#F0F3F6;border:1px solid #EBEFF4;border-radius:8px;overflow:hidden;margin-bottom:14px">'
  h += '<div style="display:flex;justify-content:space-between;padding:9px 14px;border-bottom:1px solid #F0F3F8;font-size:11px"><span style="color:#66788A">发布时间</span><span style="color:#1F2D3D">' + n.date + '</span></div>'
  h += '<div style="display:flex;justify-content:space-between;padding:9px 14px;font-size:11px"><span style="color:#66788A">发布单位</span><span style="color:#1F2D3D">' + n.source + '</span></div>'
  h += '</div>'
  // Full content body
  h += '<div style="margin-bottom:14px"><h4 style="font-size:12px;font-weight:700;color:#22B573;margin:0 0 10px 0;display:flex;align-items:center;gap:6px"><span style="display:inline-block;width:3px;height:12px;background:#22B573;border-radius:2px"></span>公告内容</h4>'
  h += '<div style="font-size:12px;color:#475867;line-height:1.85;background:#F0F3F6;border:1px solid #F0F3F8;border-radius:8px;padding:14px 16px">' + contentHtml + '</div>'
  h += '</div>'
  // Action buttons — data-driven from notice fields
  h += '<div style="display:flex;gap:8px">'
  if (n.actionType === 'CONTACT') {
    h += '<button class="btn btn-primary" onclick="window._svc.showGridWorkerInfo()" style="flex:1;justify-content:center">📞 ' + (n.actionText || '联系网格员') + '</button>'
  } else if (n.actionType === 'SERVICE' && n.targetModule === 'subsidy') {
    h += '<button class="btn btn-primary" onclick="window._svc.goToSubsidy(\'' + (n.targetBusinessId || '') + '\')" style="flex:1;justify-content:center">📝 ' + (n.actionText || '立即申请') + '</button>'
  }
  h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()" style="' + (n.actionType ? '' : 'flex:1;') + 'justify-content:center">关闭</button>'
  h += '</div>'
  openGovModal('公告详情', h)
}

// Update chatbot message for farmer context — MUST be ref() not reactive() for .value.push()
const chatIntroHtml = '<div style="font-size:13px;margin-bottom:10px"><span style="font-size:18px">👋</span> <b>您好！</b>我是中堰村AI助手，您可以问我：</div>' +
  '<div style="display:flex;flex-direction:column;gap:5px;font-size:11px;color:#475867;line-height:1.5">' +
  '<span style="display:flex;align-items:center;gap:6px"><span style="color:#22B573">▸</span> 我上报的事件处理进度如何？</span>' +
  '<span style="display:flex;align-items:center;gap:6px"><span style="color:#22B573">▸</span> 村里最近有什么通知？</span>' +
  '<span style="display:flex;align-items:center;gap:6px"><span style="color:#22B573">▸</span> 我的网格员是谁？</span>' +
  '<span style="display:flex;align-items:center;gap:6px"><span style="color:#22B573">▸</span> 今年的惠农政策有哪些？</span>' +
  '</div>'
const chatMessages = ref([
  { role: 'ai', text: chatIntroHtml }
])

// ==================== ECOLOGY SERVICE FUNCTIONS ====================
function ecoPill(text, tone) {
  const map = {
    green: 'background:rgba(34,181,115,0.12);color:#22B573',
    amber: 'background:rgba(242,166,43,0.14);color:#C07C00',
    red: 'background:rgba(224,82,82,0.12);color:#E05252',
    blue: 'background:rgba(40,150,220,0.14);color:#1E88D0'
  }
  return '<span style="display:inline-block;padding:3px 11px;border-radius:10px;font-size:14px;font-weight:600;' + map[tone] + '">' + text + '</span>'
}
function ecoRow(name, meta, tone, status) {
  return '<div style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:#FFFFFF;border:1px solid #E3EAF0;border-radius:8px">' +
    '<span style="font-size:16px;font-weight:600;color:#1F2D3D">' + name + '</span>' +
    '<span style="font-size:15px;color:#66788A;margin-left:auto">' + meta + '</span>' +
    ecoPill(status, tone) +
    '</div>'
}
// 当前登录农户身份（统一数据源 — 所有“本人办理”业务都从这里取，不写死演示数据）
// role 决定左侧底部入口与后台权限：村民=个人设置，村干部=管理设置（有限），管理员=系统管理（完整）
// 正式由后台按 token/session 下发角色；roleAdminModules 定义各角色在后台可操作的模块
// 演示期：currentUser 为 reactive，头部角色切换器仅提供「村民 / 村干部」两档；管理员另走 /admin 登录页
// 管理员登录态：管理员登录页写入 adminUser，此处据此把身份置为管理员（含姓名），否则默认村民
const _adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null')
const _farmerUser = JSON.parse(localStorage.getItem('farmerUser') || 'null')
const currentUser = reactive(_adminUser
  ? { name: _adminUser.name, phone: '—', farmerId: 'admin', village: _adminUser.village || '中堰村', zone: _adminUser.zone || '全村', grid: _adminUser.grid || '—', gridId: _adminUser.gridId || 'ADMIN', org: _adminUser.org || '', role: _adminUser.role, roleCode: _adminUser.roleCode || '' }
  : (_farmerUser ? { name: _farmerUser.name, phone: _farmerUser.phone || '—', farmerId: _farmerUser.farmerId, village: _farmerUser.village, zone: _farmerUser.zone, grid: _farmerUser.grid, gridId: _farmerUser.gridId, role: '村民', roleCode: 'FARMER' }
  : { name: '王友德', phone: '138****5678', farmerId: 'farmer_001', village: '中堰村', zone: '1组片区', grid: '第2网格', gridId: 'GRID_02', role: '村民', roleCode: 'FARMER' }))
const isVillager = computed(() => currentUser.role === '村民')
const isGridWorker = computed(() => currentUser.role === '网格员')
const isVillageAdmin = computed(() => currentUser.role === '村干部')
const isSuperAdmin = computed(() => currentUser.role === '管理员')
const isBusinessEntity = computed(() => currentUser.role === '经营主体')
const isAdmin = computed(() => isSuperAdmin.value || isVillageAdmin.value || isGridWorker.value)
// —— 经营主体工作台：我的产品（后端按 owner_id 行级隔离，只返回本主体自己的产品）——
const bizProducts = ref([])
const bizAddOpen = ref(false)
const bizForm = reactive({ name: '', category: '', price: null, unit: '', stock: null })
const bizTotalStock = computed(() => bizProducts.value.reduce((s, p) => s + (p.stock || 0), 0))
const bizTotalSales = computed(() => bizProducts.value.reduce((s, p) => s + (p.sales || 0), 0))
async function loadBizProducts() {
  try {
    const res = await listMyProducts()
    if (res && res.code === 200 && Array.isArray(res.data)) bizProducts.value = res.data
  } catch (e) { /* 后端未启动时保持为空，表格显示空态 */ }
}
async function submitBizProduct() {
  if (!bizForm.name) { toast('请填写产品名称', 'info'); return }
  try {
    const res = await addProduct({ ...bizForm })
    if (res && res.code === 200) {
      toast('已添加产品', 'success')
      bizAddOpen.value = false
      Object.assign(bizForm, { name: '', category: '', price: null, unit: '', stock: null })
      loadBizProducts()
    }
  } catch (e) { /* 错误已在拦截器统一提示 */ }
}
async function removeBizProduct(id) {
  try {
    const res = await deleteProduct(id)
    if (res && res.code === 200) { toast('已删除', 'success'); loadBizProducts() }
  } catch (e) { /* 错误已在拦截器统一提示 */ }
}
// —— 村民「我要卖」：我挂售的农产品（后端按 farmer_id 行级隔离）——
const sellProducts = ref([])
const sellAddOpen = ref(false)
const sellForm = reactive({ name: '', category: '', price: null, unit: '', stock: null, description: '' })
const sellCategories = ['蔬菜类', '粮食类', '禽蛋类', '水果类', '水产类', '畜禽类', '土特产', '其他']
const sellUnits = ['斤', '公斤', '箱', '袋', '盒', '个', '只', '把', '篮', '桶']
const sellTotalStock = computed(() => sellProducts.value.reduce((s, p) => s + (p.stock || 0), 0))
const sellTotalSales = computed(() => sellProducts.value.reduce((s, p) => s + (p.sales || 0), 0))
async function loadSellProducts() {
  try {
    const res = await listMySaleProducts()
    if (res && res.code === 200 && Array.isArray(res.data)) sellProducts.value = res.data
  } catch (e) { /* 后端未启动时保持空态 */ }
}
async function submitSellProduct() {
  if (!sellForm.name) { toast('请填写产品名称', 'info'); return }
  if (!sellForm.category) { toast('请选择产品类别', 'info'); return }
  if (!sellForm.unit) { toast('请选择单位', 'info'); return }
  if (sellForm.price == null || sellForm.price <= 0) { toast('请填写正确的单价', 'info'); return }
  if (sellForm.stock == null || sellForm.stock < 0) { toast('请填写库存数量', 'info'); return }
  try {
    const res = await addSaleProduct({ ...sellForm })
    if (res && res.code === 200) {
      toast('已提交，等待村干部审核', 'success')
      sellAddOpen.value = false
      Object.assign(sellForm, { name: '', category: '', price: null, unit: '', stock: null, description: '' })
      loadSellProducts()
    }
  } catch (e) { /* 错误已在拦截器统一提示 */ }
}
async function removeSellProduct(id) {
  try {
    const res = await deleteSaleProduct(id)
    if (res && res.code === 200) { toast('已下架', 'success'); loadSellProducts() }
  } catch (e) { /* 错误已在拦截器统一提示 */ }
}

// —— 村民上架审核（管理端）——
const reviewProducts = ref([])
const reviewRejectId = ref(null)
const reviewRejectNote = ref('')
const reviewPendingCount = computed(() => reviewProducts.value.length)
async function loadReviewProducts() {
  try {
    const res = await listPendingProducts()
    if (res && res.code === 200 && Array.isArray(res.data)) reviewProducts.value = res.data
  } catch (e) { /* 无权限或未启动时保持空态 */ }
}
async function approveReviewProduct(p) {
  try {
    const res = await approveProduct(p.id)
    if (res && res.code === 200) { toast('已通过，产品上架', 'success'); loadReviewProducts() }
  } catch (e) { /* 错误已在拦截器统一提示 */ }
}
async function confirmRejectReview() {
  if (!reviewRejectNote.value.trim()) { toast('请填写驳回原因', 'info'); return }
  try {
    const res = await rejectProduct(reviewRejectId.value, reviewRejectNote.value.trim())
    if (res && res.code === 200) { toast('已驳回', 'success'); reviewRejectId.value = null; reviewRejectNote.value = ''; loadReviewProducts() }
  } catch (e) { /* 错误已在拦截器统一提示 */ }
}
function sellStatusStyle(status) {
  const m = {
    '待审核': { color: '#F2A62B', bg: 'rgba(242,166,43,.14)' },
    '在售': { color: '#19B98A', bg: 'rgba(25,185,138,.12)' },
    '已驳回': { color: '#E05252', bg: 'rgba(224,82,82,.12)' }
  }
  const s = m[status] || { color: '#66788A', bg: 'rgba(102,120,138,.12)' }
  return { color: s.color, background: s.bg, padding: '2px 8px', borderRadius: '6px', fontSize: '12px' }
}
// 按角色设默认首页：村民进「我的工作台」，经营主体进「经营主体工作台」，管理员进「乡村驾驶舱」大屏
if (isBusinessEntity.value) { currentPage.value = 'business'; pageTitle.value = pageTitles.business }
else if (!isAdmin.value) { currentPage.value = 'home'; pageTitle.value = pageTitles.home }
// 退出管理员：清登录态并重置为村民身份
function logoutAdmin() {
  localStorage.removeItem('token')
  localStorage.removeItem('adminUser')
  localStorage.removeItem('farmerUser')
  currentUser.name = '王友德'
  currentUser.phone = '138****5678'
  currentUser.farmerId = 'farmer_001'
  currentUser.village = '中堰村'
  currentUser.zone = '1组片区'
  currentUser.grid = '第2网格'
  currentUser.gridId = 'GRID_02'
  currentUser.role = '村民'
  toast('已退出管理员，当前为村民身份', 'info')
}
// 退出农户登录：清登录态回登录页（可换账号登录）
function logoutFarmer() {
  localStorage.removeItem('token')
  localStorage.removeItem('farmerUser')
  router.push('/login')
}
// 退出经营主体登录：清登录态回管理员登录页（经营主体从 /admin 登录）
function logoutBusinessEntity() {
  localStorage.removeItem('token')
  localStorage.removeItem('adminUser')
  router.push('/admin')
}
// 侧栏底部当前登录人（与 currentUser 联动）
const sideUser = computed(() => {
  const meta = {
    '村民': { color: '#22B573', title: '中堰村村民 · ' + currentUser.zone },
    '网格员': { color: '#0EA5E9', title: '中堰村网格员 · ' + currentUser.grid },
    '村干部': { color: '#F8B400', title: '中堰村村级管理员' },
    '管理员': { color: '#E74C3C', title: '平台超级管理员 · 系统管理' },
    '经营主体': { color: '#9B59B6', title: '中堰村经营主体 · 产业经营' }
  }[currentUser.role] || { color: '#66788A', title: currentUser.role }
  return {
    initial: currentUser.name.charAt(0),
    color: meta.color,
    name: currentUser.name + ' · ' + currentUser.role,
    title: meta.title
  }
})
const settingsNavLabel = computed(() => isVillager.value ? '个人设置' : (isBusinessEntity.value ? '经营主体工作台' : (isGridWorker.value ? '网格工作台' : (isSuperAdmin.value ? '系统管理' : '管理设置'))))
const roleAdminModules = {
  '网格员': ['notify', 'logs'],
  '村干部': ['users', 'modules', 'notify', 'logs', 'audit'],
  '管理员': ['users', 'modules', 'notify', 'logs', 'security', 'backup', 'bnb', 'orders', 'audit', 'runtime']
}
function canManageModule(key) { return (roleAdminModules[currentUser.role] || []).includes(key) }
function showEcoReportForm() {
  // 环境问题上报入口 — 提供“我要上报”和“我的上报”两个选项
  const h = '<div style="padding:12px 0">' +
    '<p style="color:#66788A;font-size:15px;margin:0 0 16px 0;line-height:1.6">反映身边的环境卫生问题，或查看您已上报事项的处理进度。</p>' +
    '<div style="display:flex;flex-direction:column;gap:10px">' +
    '<button class="btn btn-primary" onclick="window._svc.startEnvReport()" style="justify-content:flex-start;padding:14px 16px;font-size:15px">📷 我要上报<span style="margin-left:auto;font-size:13px;font-weight:400;opacity:.85">上报环境卫生问题</span></button>' +
    '<button class="btn btn-outline" onclick="window._svc.showMyReports()" style="justify-content:flex-start;padding:14px 16px;font-size:15px;background:#FFFFFF">📋 我的上报<span style="margin-left:auto;font-size:13px;opacity:.7">查看处理进度</span></button>' +
    '</div></div>'
  openGovModal('📷 环境问题上报', h)
}
function startEnvReport() { selectReportType('environment') }
function garbageStatusMeta(status) {
  const map = {
    NORMAL: { text: '正常', tone: 'green', icon: '✅' },
    WAITING: { text: '待清运', tone: 'amber', icon: '🟠' },
    DELAYED: { text: '清运延迟', tone: 'red', icon: '🔴' },
    FULL: { text: '垃圾满溢', tone: 'red', icon: '🔴' },
    CLEANING: { text: '清运中', tone: 'blue', icon: '🚚' },
    COMPLETED: { text: '已清运', tone: 'green', icon: '✅' }
  }
  return map[status] || { text: status, tone: 'green', icon: '✅' }
}
function formatGarbageTime(dt) {
  if (!dt) return '待定'
  const d = dt.split(' ')[0]
  const t = (dt.split(' ')[1] || '').slice(0, 5)
  if (d === '2026-08-13') return '今天 ' + t
  if (d === '2026-08-14') return t < '12:00' ? '明天上午' : '明天 ' + t
  return d + ' ' + t
}
function garbageActions(p, i) {
  if (p.status === 'COMPLETED') return '<button class="btn btn-outline btn-sm" onclick="event.stopPropagation();window._svc.viewGarbageLocation(' + i + ')">📍 查看位置</button>'
  if (p.status === 'WAITING') {
    const remindBtn = p.reminded ? '<span style="font-size:13px;color:#22B573;font-weight:600">✅ 已提醒</span>' : '<button class="btn btn-outline btn-sm" onclick="event.stopPropagation();window._svc.remindClean(' + i + ')">🔔 提醒一下</button>'
    return '<button class="btn btn-outline btn-sm" onclick="event.stopPropagation();window._svc.viewGarbageLocation(' + i + ')">📍 查看位置</button>' + remindBtn
  }
  if (p.status === 'DELAYED') return '<button class="btn btn-outline btn-sm" onclick="event.stopPropagation();window._svc.viewGarbageLocation(' + i + ')">📍 查看位置</button><button class="btn btn-outline btn-sm" onclick="event.stopPropagation();window._svc.reportGarbage(' + i + ')">📷 上报问题</button>'
  if (p.status === 'FULL') return '<button class="btn btn-outline btn-sm" onclick="event.stopPropagation();window._svc.viewGarbageLocation(' + i + ')">📍 查看位置</button><button class="btn btn-primary btn-sm" onclick="event.stopPropagation();window._svc.reportGarbage(' + i + ')">🚨 立即上报</button>'
  return '<span style="font-size:13px;color:#1E88D0;font-weight:600">🚚 正在清运</span>'
}
function garbageMetaLine(p) {
  if (p.status === 'COMPLETED') return '🕐 最近清运：' + formatGarbageTime(p.lastCleanedAt) + ' · 下次计划：' + formatGarbageTime(p.plannedCleanAt)
  if (p.status === 'WAITING') return '📦 已满载 ' + p.fillLevel + '% · 🕐 预计清运：' + formatGarbageTime(p.plannedCleanAt)
  if (p.status === 'DELAYED') return '⚠️ 已超过计划清运时间 ' + (p.delayHours || 2) + ' 小时'
  if (p.status === 'FULL') return '⚠️ 垃圾已满溢（' + p.fillLevel + '%），请及时处理'
  return '🚚 保洁员正在清运中…'
}
function showGarbageService() {
  const pts = ecoGarbagePoints.value
  let rows = ''
  pts.forEach(function(p, i) {
    const m = garbageStatusMeta(p.status)
    const metaColor = (p.status === 'DELAYED' || p.status === 'FULL') ? '#E05252' : (p.status === 'CLEANING' ? '#1E88D0' : '#66788A')
    rows += '<div onclick="window._svc.openGarbagePoint(' + i + ')" style="background:#FFFFFF;border:1px solid #E3EAF0;border-radius:10px;padding:14px;margin-bottom:10px;cursor:pointer;transition:all .2s" onmouseover="this.style.borderColor=\'#22B573\';this.style.background=\'rgba(34,181,115,0.03)\'" onmouseout="this.style.borderColor=\'#E3EAF0\';this.style.background=\'#FFFFFF\'">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:16px;font-weight:600;color:#1F2D3D">' + p.name + '</span><span style="margin-left:auto">' + ecoPill(m.icon + ' ' + m.text, m.tone) + '</span></div>' +
      '<div style="font-size:14px;color:' + metaColor + '">' + garbageMetaLine(p) + '</div>' +
      '<div style="display:flex;gap:8px;margin-top:10px;padding-top:10px;border-top:1px dashed #E3EAF0">' + garbageActions(p, i) + '</div>' +
      '</div>'
  })
  const h = '<div style="padding:12px 0">' +
    '<div style="font-size:16px;color:#1F2D3D;font-weight:700;margin-bottom:4px">📍 所在区域：' + currentUser.village + ' ' + currentUser.zone + ' · ' + currentUser.grid + '</div>' +
    '<div style="font-size:13px;color:#66788A;margin-bottom:14px">🕐 更新时间：今天 15:40</div>' +
    '<div style="font-size:15px;color:#1F2D3D;font-weight:700;margin:0 0 10px 0">垃圾点状态</div>' +
    rows +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-outline" onclick="window._svc.contactCleaner()">📞 联系保洁员</button>' +
    '</div></div>'
  openGovModal('🗑 垃圾清运', h)
}
function openGarbagePoint(idx) {
  const p = ecoGarbagePoints.value[idx]
  if (!p) return
  const m = garbageStatusMeta(p.status)
  let meta = ''
  if (p.status === 'COMPLETED') {
    meta = ecoAlertField('🕐 最近清运', formatGarbageTime(p.lastCleanedAt)) + ecoAlertField('🗓 下次计划', formatGarbageTime(p.plannedCleanAt))
  } else if (p.status === 'WAITING') {
    meta = ecoAlertField('📦 已满载', p.fillLevel + '%') + ecoAlertField('🕐 预计清运', formatGarbageTime(p.plannedCleanAt))
  } else if (p.status === 'DELAYED') {
    meta = ecoAlertField('⏰ 已延迟', '超过计划时间 ' + (p.delayHours || 2) + ' 小时') + ecoAlertField('📦 已满载', p.fillLevel + '%')
  } else if (p.status === 'FULL') {
    meta = ecoAlertField('🚨 状态', '垃圾满溢') + ecoAlertField('📦 已满载', p.fillLevel + '%')
  } else {
    meta = ecoAlertField('🚚 状态', '清运中') + ecoAlertField('🕐 预计清运', formatGarbageTime(p.plannedCleanAt))
  }
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px"><span style="font-size:17px;color:#1F2D3D;font-weight:700">' + p.name + '</span><span style="margin-left:auto">' + ecoPill(m.icon + ' ' + m.text, m.tone) + '</span></div>' +
    '<div style="font-size:13px;color:#66788A;margin-bottom:14px">📍 ' + p.locationText + '</div>' +
    '<div style="display:flex;flex-direction:column;margin-bottom:16px">' + meta + '</div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-outline" onclick="window._svc.backToGarbage()">← 返回垃圾清运</button>' + garbageActions(p, idx) + '</div></div>'
  openGovModal(p.name, h)
}
function viewGarbageLocation(idx) {
  const p = ecoGarbagePoints.value[idx]
  if (!p) return
  toast('已打开地图定位「' + p.locationText + '」', 'info')
}
function remindClean(idx) {
  const p = ecoGarbagePoints.value[idx]
  if (!p || p.reminded) return
  p.reminded = true // 防重复：点一次后置为已提醒，真实环境按时间窗口重置
  toast('已提醒保洁员，稍后将优先清运「' + p.name + '」', 'success')
  showGarbageService()
}
function reportGarbage(idx) {
  const p = ecoGarbagePoints.value[idx]
  if (!p) { reportEnvironment(); return }
  const desc = p.status === 'FULL' ? '该垃圾点存在垃圾满溢情况，请及时清运。'
             : p.status === 'DELAYED' ? '该垃圾点存在清运延迟情况，请及时清运。'
             : '该垃圾点已接近满载，请及时清运。'
  reportEnvironment({ location: p.name, source: '环境卫生', subType: '垃圾清运', desc: desc, lat: p.latitude, lng: p.longitude })
}
function openGarbagePointById(id) {
  const p = ecoGarbagePoints.value.find(function(x) { return x.id === id })
  if (p) openGarbagePoint(ecoGarbagePoints.value.indexOf(p))
}
// 垃圾点详情 → 返回「垃圾清运」列表（关闭 × 才是退出整个流程）
function backToGarbage() { showGarbageService() }
// 联系保洁员 — 展示本村公开服务热线（实际号码应由后台按 village_id + grid_id 配置，前端不写死私人手机号）
function contactCleaner() {
  toast('已接通本村保洁服务热线，工作时间内将尽快响应', 'info')
}
function showWaterService() {
  const wbs = ecoWaterBodies.value
  let abIdx = -1
  wbs.forEach(function(w, i) { if (w.status !== '正常' && abIdx === -1) abIdx = i })
  let alertHtml = ''
  if (abIdx >= 0) {
    const a = wbs[abIdx]
    alertHtml = '<div style="background:#FDECEC;border:1px solid #F5C4C4;border-radius:8px;padding:14px;margin-bottom:14px;cursor:pointer" onclick="window._svc.openWaterBodyByIdx(' + abIdx + ')">' +
      '<div style="display:flex;align-items:center;gap:8px;font-size:16px;color:#C0392B;font-weight:700;margin-bottom:6px">💧 ' + a.name + ' · ' + a.indicator + '偏低</div>' +
      '<div style="font-size:15px;color:#8A3F3A;line-height:1.7">当前 ' + a.value + '（标准 ' + a.standard + '），请勿在附近取水饮用。点击查看处理进度 ›</div></div>'
  }
  let rows = ''
  wbs.forEach(function(w, i) {
    rows += '<div onclick="window._svc.openWaterBodyByIdx(' + i + ')" style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:#FFFFFF;border:1px solid #E3EAF0;border-radius:8px;cursor:pointer;margin-bottom:8px;transition:all .2s" onmouseover="this.style.borderColor=\'#22B573\';this.style.background=\'rgba(34,181,115,0.04)\'" onmouseout="this.style.borderColor=\'#E3EAF0\';this.style.background=\'#FFFFFF\'">' +
      '<span style="font-size:22px">' + w.icon + '</span>' +
      '<div style="flex:1;min-width:0"><div style="font-size:16px;font-weight:600;color:#1F2D3D">' + w.name + '<span style="font-size:13px;color:#66788A;font-weight:400;margin-left:6px">' + w.distance + '</span></div>' +
      '<div style="font-size:14px;color:#66788A;margin-top:3px">' + w.indicator + ' ' + w.value + '</div></div>' +
      ecoPill(w.status, w.tone) +
      '</div>'
  })
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><span style="font-size:15px;color:#66788A">📍 所在片区：</span><span style="font-size:16px;color:#1F2D3D;font-weight:700">' + currentUser.village + ' ' + currentUser.zone + ' · ' + currentUser.grid + '</span></div>' +
    '<p style="color:#66788A;font-size:15px;margin:0 0 12px 0;line-height:1.6">本村各水塘、河道水质监测情况，异常点位已标注，点击查看详情与处理进度。</p>' +
    alertHtml +
    rows +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-outline" onclick="window._svc.reportEnvironment()">📷 上报水质问题</button>' +
    (abIdx >= 0 ? '<button class="btn btn-primary" onclick="window._svc.openWaterBodyByIdx(' + abIdx + ')">💧 查看异常水塘</button>'
                : '<button class="btn btn-primary" onclick="window._svc.reportEnvironment()">📷 上报水质问题</button>') +
    '</div></div>'
  openGovModal('💧 水质问题', h)
}
// 秸秆上门回收申请（农户端当前会话，后续状态由管理员端推进）
const ecoStrawApplications = ref([
  // 演示数据（正式由后台下发）
  { id: 'JG20260710001', applicant: currentUser.name, village: currentUser.village, phone: currentUser.phone, type: '玉米秸秆', quantity: '约 2 吨', location: '3组晒场旁', latitude: null, longitude: null, expectTime: '7月10日', remark: '', status: '已回收', createdAt: '7月10日 15:40', timeline: [{ time: '7月10日 15:40', status: '已回收', desc: '回收人员已上门回收完毕' }] }
])
let _strawSeq = 0
let _strawType = '玉米秸秆'
let _strawQty = ''
let _strawLoc = ''
let _strawExpect = '今天'
let _strawRemark = ''
let _strawLat = null, _strawLng = null, _strawGpsStatus = 'idle' // idle | locating | located

function showStrawService() {
  const active = ecoStrawApplications.value.find(function(a) { return a.status !== '已回收' })
  const recycleRow = active
    ? '<div onclick="window._svc.openStrawApp()" style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:#FFFFFF;border:1px solid #E3EAF0;border-radius:8px;cursor:pointer;transition:all .2s" onmouseover="this.style.borderColor=\'#F2A62B\';this.style.background=\'rgba(242,166,43,0.04)\'" onmouseout="this.style.borderColor=\'#E3EAF0\';this.style.background=\'#FFFFFF\'">' +
      '<span style="font-size:16px;font-weight:600;color:#1F2D3D">📞 回收服务</span>' +
      '<span style="font-size:15px;color:#66788A;margin-left:auto">已有申请</span>' +
      ecoPill('待联系', 'amber') +
      '</div>'
    : ecoRow('📞 回收服务', '支持上门打包回收', 'green', '可预约')
  const h = '<div style="padding:12px 0">' +
    '<p style="color:#66788A;font-size:15px;margin:0 0 14px 0;line-height:1.6">本村秸秆综合利用率已达 92%，秸秆可回收作饲料、还田或发电。</p>' +
    '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">' +
    ecoRow('🚜 秸秆回收点', '村南晒场东侧', 'green', '开放中') +
    recycleRow +
    '</div>' +
    '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px;margin-bottom:16px">' +
    '<span style="font-size:15px;color:#1E7A54;line-height:1.6">🌱 就近还田或交售回收点，可获秸秆综合利用补贴。</span></div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-outline" onclick="window._toast && window._toast(\'回收点已在地图标注\',\'info\')">📍 查看回收点</button>' +
    '<button class="btn btn-primary" onclick="window._svc.requestStraw()">🚜 申请上门回收</button>' +
    '</div></div>'
  openGovModal('🌾 秸秆处理', h)
}
function requestStraw() {
  const active = ecoStrawApplications.value.find(function(a) { return a.status !== '已回收' })
  if (active) { openStrawApp(); return }
  showStrawApplyForm()
}
function showStrawApplyForm() {
  _strawType = '玉米秸秆'; _strawQty = ''; _strawLoc = ''; _strawExpect = '今天'; _strawRemark = ''
  _strawLat = null; _strawLng = null; _strawGpsStatus = 'idle'
  renderStrawForm()
}
// 申请表单 → 返回「秸秆处理」详情（关闭 × 才是退出整个流程）
function strawFormBack() { showStrawService() }
function _syncStrawInputs() {
  const q = document.getElementById('strawQtyInput'); if (q) _strawQty = q.value
  const l = document.getElementById('strawLocInput'); if (l) _strawLoc = l.value
  const r = document.getElementById('strawRemarkInput'); if (r) _strawRemark = r.value
}
function renderStrawForm() {
  const types = ['玉米秸秆', '小麦秸秆', '油菜秸秆', '其他']
  const expects = ['今天', '明天', '其他日期']
  let typeBtns = ''
  types.forEach(function(t) {
    const act = _strawType === t
    typeBtns += '<button onclick="window._svc.setStrawType(\'' + t + '\')" style="flex:1;padding:9px 0;border-radius:8px;font-size:13px;font-weight:' + (act ? '700' : '500') + ';cursor:pointer;font-family:inherit;border:1px solid ' + (act ? '#19B98A' : '#D4DCE6') + ';background:' + (act ? 'rgba(25,185,138,0.10)' : '#FFFFFF') + ';color:' + (act ? '#19B98A' : '#475867') + '">' + t + '</button>'
  })
  let expectBtns = ''
  expects.forEach(function(t) {
    const act = _strawExpect === t
    expectBtns += '<button onclick="window._svc.setStrawExpect(\'' + t + '\')" style="flex:1;padding:9px 0;border-radius:8px;font-size:13px;font-weight:' + (act ? '700' : '500') + ';cursor:pointer;font-family:inherit;border:1px solid ' + (act ? '#19B98A' : '#D4DCE6') + ';background:' + (act ? 'rgba(25,185,138,0.10)' : '#FFFFFF') + ';color:' + (act ? '#19B98A' : '#475867') + '">' + t + '</button>'
  })
  const gpsHtml = _strawGpsStatus === 'located'
    ? '<div style="display:flex;align-items:center;gap:6px"><span style="display:inline-flex;align-items:center;gap:4px;background:rgba(34,181,115,0.10);color:#22B573;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:600">✅ 已定位</span><span style="font-size:11px;color:#475867">' + _strawLat.toFixed(6) + ', ' + _strawLng.toFixed(6) + '</span></div>'
    : (_strawGpsStatus === 'locating' ? '<span style="font-size:12px;color:#19B98A">📍 正在定位…</span>' : '<button class="btn btn-outline btn-sm" onclick="window._svc.getStrawLocation()">📍 获取当前位置</button>')
  let h = '<div style="padding:12px 0">'
  h += '<p style="color:#66788A;font-size:14px;margin:0 0 14px 0;line-height:1.6">申请后回收人员将与您联系并安排上门，以下信息已为您自动带入。</p>'
  h += '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:10px 12px;margin-bottom:14px">'
  h += '<div style="font-size:11px;color:#1E7A54;font-weight:700;margin-bottom:6px">✅ 已自动带入</div>'
  h += '<div style="font-size:12px;color:#475867">👤 申请人：' + currentUser.name + '</div>'
  h += '<div style="font-size:12px;color:#475867">🏘 所属村：' + currentUser.village + '</div>'
  h += '<div style="font-size:12px;color:#475867">🗺 村组/网格：' + currentUser.zone + ' · ' + currentUser.grid + '</div>'
  h += '<div style="font-size:12px;color:#475867">📱 联系电话：' + currentUser.phone + '（脱敏）</div>'
  h += '</div>'
  h += '<div style="margin-bottom:14px"><label style="display:block;font-size:12px;color:#1F2D3D;margin-bottom:6px;font-weight:600">🌾 秸秆类型 <span style="color:#E05252">*</span></label>'
  h += '<div style="display:flex;gap:6px">' + typeBtns + '</div></div>'
  h += '<div style="margin-bottom:14px"><label style="display:block;font-size:12px;color:#1F2D3D;margin-bottom:6px;font-weight:600">📦 预计数量 <span style="color:#E05252">*</span></label>'
  h += '<input id="strawQtyInput" placeholder="例如：约500公斤 或 约2亩" value="' + (_strawQty || '') + '" style="width:100%;background:#FFFFFF;border:1px solid #D4DCE6;border-radius:8px;color:#1F2D3D;padding:10px 12px;font-size:12px;font-family:inherit;box-sizing:border-box" /></div>'
  h += '<div style="margin-bottom:14px"><label style="display:block;font-size:12px;color:#1F2D3D;margin-bottom:6px;font-weight:600">📍 堆放地点 <span style="color:#E05252">*</span></label>'
  h += '<input id="strawLocInput" placeholder="例如：中堰村3组晒场旁" value="' + (_strawLoc || '') + '" style="width:100%;background:#FFFFFF;border:1px solid #D4DCE6;border-radius:8px;color:#1F2D3D;padding:10px 12px;font-size:12px;font-family:inherit;box-sizing:border-box" /></div>'
  h += '<div style="margin-bottom:14px"><label style="display:block;font-size:12px;color:#1F2D3D;margin-bottom:6px;font-weight:600">🛰️ GPS 定位（选填）</label>' + gpsHtml + '</div>'
  h += '<div style="margin-bottom:14px"><label style="display:block;font-size:12px;color:#1F2D3D;margin-bottom:6px;font-weight:600">🗓 期望回收时间</label>'
  h += '<div style="display:flex;gap:6px">' + expectBtns + '</div>'
  if (_strawExpect === '其他日期') h += '<input id="strawDateInput" placeholder="请填写具体日期，如 8月15日" style="width:100%;margin-top:8px;background:#FFFFFF;border:1px solid #D4DCE6;border-radius:8px;color:#1F2D3D;padding:10px 12px;font-size:12px;font-family:inherit;box-sizing:border-box" />'
  h += '</div>'
  h += '<div style="margin-bottom:14px"><label style="display:block;font-size:12px;color:#1F2D3D;margin-bottom:6px;font-weight:600">📝 备注（选填）</label>'
  h += '<textarea id="strawRemarkInput" placeholder="例如：秸秆已打包，请电话联系" style="width:100%;height:60px;background:#FFFFFF;border:1px solid #D4DCE6;border-radius:8px;color:#1F2D3D;padding:10px 12px;font-size:12px;font-family:inherit;resize:vertical;box-sizing:border-box">' + (_strawRemark || '') + '</textarea></div>'
  h += '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">'
  h += '<button class="btn btn-outline" onclick="window._svc.strawFormBack()">← 上一步</button>'
  h += '<button class="btn btn-primary" onclick="window._svc.submitStrawApply()">提交申请</button>'
  h += '</div></div>'
  openGovModal('🌾 申请秸秆上门回收', h)
}
function setStrawType(t) { _syncStrawInputs(); _strawType = t; renderStrawForm() }
function setStrawExpect(t) { _syncStrawInputs(); _strawExpect = t; renderStrawForm() }
function getStrawLocation() {
  if (!navigator.geolocation) { toast('浏览器不支持GPS定位，请手动填写地点', 'warn'); return }
  _syncStrawInputs()
  _strawGpsStatus = 'locating'
  renderStrawForm()
  navigator.geolocation.getCurrentPosition(
    function(pos) { _strawLat = pos.coords.latitude; _strawLng = pos.coords.longitude; _strawGpsStatus = 'located'; renderStrawForm(); toast('定位成功', 'success') },
    function() { _strawGpsStatus = 'idle'; renderStrawForm(); toast('定位失败，可跳过', 'warn') },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
  )
}
function submitStrawApply() {
  const qty = (document.getElementById('strawQtyInput') ? document.getElementById('strawQtyInput').value : '').trim()
  const loc = (document.getElementById('strawLocInput') ? document.getElementById('strawLocInput').value : '').trim()
  const remark = (document.getElementById('strawRemarkInput') ? document.getElementById('strawRemarkInput').value : '').trim()
  if (!qty) { toast('请填写预计数量', 'warn'); return }
  if (!loc) { toast('请填写堆放地点', 'warn'); return }
  let expectTime = _strawExpect
  if (_strawExpect === '其他日期') {
    const d = document.getElementById('strawDateInput') ? document.getElementById('strawDateInput').value.trim() : ''
    if (!d) { toast('请填写具体日期', 'warn'); return }
    expectTime = d
  }
  _strawSeq++
  const now = new Date()
  const ymd = String(now.getFullYear()) + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0')
  const appId = 'JG' + ymd + String(_strawSeq).padStart(3, '0')
  const timeStr = (now.getMonth() + 1) + '月' + now.getDate() + '日 ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')
  ecoStrawApplications.value.unshift({
    id: appId, applicant: currentUser.name, village: currentUser.village, phone: currentUser.phone,
    type: _strawType, quantity: qty, location: loc, latitude: _strawLat, longitude: _strawLng,
    expectTime: expectTime, remark: remark, status: '待联系', createdAt: timeStr,
    timeline: [{ time: timeStr, status: '待联系', desc: '申请已提交，等待回收人员联系' }]
  })
  // 成功提示（不结束，明确告知编号与状态）
  const h = '<div style="text-align:center;padding:20px 0"><div style="font-size:48px;margin-bottom:12px">✅</div>' +
    '<h4 style="color:#22B573;margin:0 0 8px 0;font-size:15px">上门回收申请已提交</h4>' +
    '<p style="color:#66788A;font-size:12px;margin:0 0 4px 0">申请编号：<span style="color:#1F2D3D;font-weight:700">' + appId + '</span></p>' +
    '<p style="color:#66788A;font-size:12px;margin:0 0 16px 0">当前状态：<span style="color:#19B98A;font-weight:600">待联系</span></p>' +
    '<p style="color:#66788A;font-size:11px;margin:0 0 20px 0">回收人员确认后将与您联系。</p>' +
    '<div style="display:flex;gap:8px;justify-content:center"><button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">完成</button><button class="btn btn-primary" onclick="window._svc.openStrawApp()">查看申请进度</button></div></div>'
  openGovModal('🌾 申请秸秆上门回收', h)
}
function strawStepper(status) {
  const steps = ['待联系', '已确认', '待上门', '已回收']
  const curIdx = steps.indexOf(status)
  let html = '<div style="display:flex;align-items:flex-start">'
  steps.forEach(function(s, i) {
    const done = i < curIdx, cur = i === curIdx
    const color = (done || cur) ? '#22B573' : '#C4CDD6'
    html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center">'
    html += '<div style="display:flex;align-items:center;width:100%">'
    if (i > 0) html += '<div style="flex:1;height:2px;background:' + (i <= curIdx ? '#22B573' : '#E3EAF0') + '"></div>'
    html += '<div style="width:22px;height:22px;border-radius:50%;background:' + (cur ? '#22B573' : (done ? 'rgba(34,181,115,0.20)' : '#F0F3F6')) + ';border:2px solid ' + color + ';display:flex;align-items:center;justify-content:center;font-size:11px;color:' + (cur ? '#fff' : color) + ';flex-shrink:0">' + (done ? '✓' : (i + 1)) + '</div>'
    if (i < steps.length - 1) html += '<div style="flex:1;height:2px;background:' + (i < curIdx ? '#22B573' : '#E3EAF0') + '"></div>'
    html += '</div>'
    html += '<div style="font-size:11px;color:' + (cur ? '#1F2D3D' : '#66788A') + ';font-weight:' + (cur ? '700' : '400') + ';margin-top:5px">' + s + '</div>'
    html += '</div>'
  })
  html += '</div>'
  return html
}
function openStrawApp() {
  const a = ecoStrawApplications.value.find(function(x) { return x.status !== '已回收' }) || ecoStrawApplications.value[0]
  if (!a) { showStrawApplyForm(); return }
  let h = '<div style="padding:12px 0">'
  h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px"><span style="font-size:11px;color:#66788A">申请编号：' + a.id + '</span>' + ecoPill(a.status, a.status === '已回收' ? 'green' : 'amber') + '</div>'
  h += '<div style="background:#F0F3F6;border:1px solid #EBEFF4;border-radius:10px;padding:16px 12px;margin-bottom:16px">' + strawStepper(a.status) + '</div>'
  h += '<div style="display:flex;flex-direction:column;margin-bottom:16px">'
  h += ecoAlertField('👤 申请人', a.applicant)
  h += ecoAlertField('🏘 所属村', a.village)
  h += ecoAlertField('📱 联系电话', a.phone)
  h += ecoAlertField('🌾 秸秆类型', a.type)
  h += ecoAlertField('📦 预计数量', a.quantity)
  h += ecoAlertField('📍 堆放地点', a.location)
  h += ecoAlertField('🗓 期望时间', a.expectTime)
  if (a.remark) h += ecoAlertField('📝 备注', a.remark)
  h += '</div>'
  h += '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:10px 12px;margin-bottom:16px">'
  h += '<span style="font-size:13px;color:#1E7A54;line-height:1.6">💡 回收人员确认后将与您联系，请保持电话畅通。</span></div>'
  h += '<div style="display:flex;gap:8px;justify-content:flex-end">'
  h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">关闭</button>'
  h += '</div></div>'
  openGovModal('🌾 回收申请进度', h)
}

function openEcoStatDetail(s) {
  const key = s.key || s.label
  if (key === 'air') showAirDetail()
  else if (key === 'water') showWaterDetail()
  else if (key === 'carbon') showCarbonDetail()
  else if (key === 'straw') showStrawDetail()
  else openStatDetail(s.label, s.value)
}
function reportEnvironment(context) { selectReportType('environment', context) }
function showAirDetail() {
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">' +
    '<div style="width:96px;height:96px;border-radius:50%;background:rgba(34,181,115,0.10);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#22B573;flex-shrink:0">' +
    '<span style="font-size:32px;font-weight:700;line-height:1">42</span><span style="font-size:15px;font-weight:600;margin-top:2px">优</span></div>' +
    '<div><div style="font-size:17px;color:#1F2D3D;font-weight:700;margin-bottom:6px">今日空气质量 · 优</div>' +
    '<div style="font-size:15px;color:#66788A;line-height:1.7">适合户外活动和开窗通风，老人儿童可正常外出。</div></div>' +
    '</div>' +
    '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">' +
    ecoRow('PM2.5', '15 μg/m³', 'green', '优') +
    ecoRow('PM10', '38 μg/m³', 'green', '优') +
    ecoRow('臭氧 O₃', '72 μg/m³', 'green', '良') +
    '</div>' +
    '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px">' +
    '<span style="font-size:15px;color:#1E7A54;line-height:1.6">💡 建议：空气优良，适宜晨练、晾晒和田间劳作。</span></div>' +
    '</div>'
  openGovModal('🌬️ 空气质量', h)
}
function showWaterDetail() { openWaterBodyDetail('3号水塘') }
function showCarbonDetail() {
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:baseline;gap:10px;margin-bottom:14px">' +
    '<span style="font-size:32px;font-weight:700;color:#1F2D3D">860</span>' +
    '<span style="font-size:15px;color:#66788A">吨CO₂当量/年</span></div>' +
    '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">' +
    ecoRow('🌲 林地面积', '1280 亩', 'green', '固碳主力') +
    ecoRow('🍎 果园碳汇', '520 吨/年', 'green', '稳定') +
    ecoRow('🌾 农田固碳', '340 吨/年', 'green', '稳定') +
    '</div>' +
    '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px">' +
    '<span style="font-size:15px;color:#1E7A54;line-height:1.6">🌱 本村碳汇较去年 ↑8%，主要来自果园与生态林。</span></div>' +
    '</div>'
  openGovModal('🌳 碳汇', h)
}
function showStrawDetail() {
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:baseline;gap:10px;margin-bottom:14px">' +
    '<span style="font-size:32px;font-weight:700;color:#1F2D3D">92%</span>' +
    '<span style="font-size:15px;color:#66788A">综合利用率 · 同比 ↑5%</span></div>' +
    '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">' +
    ecoRow('🌾 饲料化', '42%', 'green', '主要') +
    ecoRow('♻️ 还田利用', '30%', 'green', '稳定') +
    ecoRow('⚡ 秸秆发电', '20%', 'green', '稳定') +
    '</div>' +
    '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px;margin-bottom:14px">' +
    '<span style="font-size:15px;color:#1E7A54;line-height:1.6">🌱 秸秆就近还田或交售回收点，可获综合利用补贴。</span></div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end">' +
    '<button class="btn btn-primary" onclick="window._svc.requestStraw()">🚜 申请上门回收</button></div>' +
    '</div>'
  openGovModal('🌾 秸秆利用', h)
}

function ecoAlertField(lbl, val) {
  return '<div style="display:flex;align-items:flex-start;gap:12px;padding:11px 0;border-bottom:1px solid #F0F3F5"><span style="font-size:15px;color:#66788A;flex-shrink:0">' + lbl + '</span><span style="font-size:15px;color:#1F2D3D;font-weight:600;margin-left:auto;text-align:right">' + val + '</span></div>'
}
function openEcoAlertDetail(a) {
  if (a.waterBody) { openWaterBodyDetail(a.waterBody); return }
  if (a.garbagePointId) { openGarbagePointById(a.garbagePointId); return }
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><span style="font-size:24px">' + a.icon + '</span><span style="font-size:17px;color:#1F2D3D;font-weight:700">' + a.title + '</span></div>' +
    '<div style="display:flex;flex-direction:column;margin-bottom:16px">' +
    ecoAlertField('📍 哪里异常', a.where) +
    ecoAlertField('📊 当前值', a.current) +
    ecoAlertField('✅ 正常范围', a.standard) +
    ecoAlertField('⚠️ 危险程度', a.risk) +
    '</div>' +
    '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px;margin-bottom:16px">' +
    '<span style="font-size:15px;color:#1E7A54;line-height:1.6">👨‍🌾 您可以：' + a.advice + '</span></div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-primary" onclick="window._svc.reportEnvironment()">📷 上报问题</button>' +
    '</div></div>'
  openGovModal(a.title, h)
}

function openMonitorDetail(r) {
  _currentMonitorRow = r
  const abnormal = r.status !== '正常'
  const isWater = r.name === '3号水塘'
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><span style="font-size:24px">📡</span><span style="font-size:17px;color:#1F2D3D;font-weight:700">' + r.name + '</span></div>' +
    '<div style="display:flex;flex-direction:column;margin-bottom:16px">' +
    ecoAlertField('📋 监测类型', r.type) +
    ecoAlertField('📊 当前值', r.value) +
    ecoAlertField('✅ 标准值', r.standard) +
    ecoAlertField('🕐 更新时间', r.updateTime) +
    '</div>' +
    '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px;margin-bottom:16px">' +
    '<span style="font-size:15px;color:#1E7A54;line-height:1.6">' + (abnormal ? '⚠️ 该监测点数据异常，请关注相关告警。' : '✅ 该监测点运行正常，数据处于标准范围内。') + '</span></div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    (isWater ? '<button class="btn btn-outline" onclick="window._svc.viewWaterAlert()">💧 查看水质详情</button>'
             : (abnormal ? '<button class="btn btn-outline" onclick="window._svc.viewWaterAlert()">🚨 查看告警</button>' : '')) +
    '<button class="btn btn-primary" onclick="window._svc.reportFromMonitor()">📷 上报问题</button>' +
    '</div></div>'
  openGovModal(r.name + ' · 监测详情', h)
}

function showNearbyEnv() {
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><span style="font-size:15px;color:#66788A">📍 所在片区：</span><span style="font-size:16px;color:#1F2D3D;font-weight:700">' + currentUser.village + ' ' + currentUser.zone + ' · ' + currentUser.grid + '</span></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">' +
    nearbyTile('🌬️', '空气', '优', 'green', 'AQI 42') +
    nearbyTile('💧', '水质', '异常', 'red', '3号水塘 800m') +
    nearbyTile('🗑️', '垃圾点', '待清运', 'amber', '1组点 200m') +
    nearbyTile('⚠️', '告警', '1条', 'amber', '需关注') +
    '</div>' +
    '<div style="background:#FDECEC;border:1px solid #F5C4C4;border-radius:8px;padding:12px 14px;margin-bottom:16px">' +
    '<div style="font-size:16px;color:#C0392B;font-weight:700;margin-bottom:6px">⚠️ 距您最近的环境问题</div>' +
    '<div style="font-size:15px;color:#8A3F3A;line-height:1.7">3号水塘溶解氧偏低（约 800 米），请勿在附近取水饮用。</div></div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-outline" onclick="window._svc.viewWaterAlert()">查看告警</button>' +
    '<button class="btn btn-primary" onclick="window._svc.reportEnvironment()">📷 上报环境问题</button>' +
    '</div></div>'
  openGovModal('🌱 我身边的环境', h)
}
function nearbyTile(icon, label, val, tone, meta) {
  const color = tone === 'red' ? '#E05252' : tone === 'amber' ? '#F2A62B' : '#22B573'
  return '<div style="background:#FFFFFF;border:1px solid #E3EAF0;border-radius:8px;padding:12px"><div style="font-size:22px">' + icon + '</div><div style="font-size:15px;color:#1F2D3D;font-weight:700;margin-top:6px">' + label + '</div><div style="font-size:15px;font-weight:700;margin-top:2px;color:' + color + '">' + val + '</div><div style="font-size:14px;color:#66788A;margin-top:2px">' + meta + '</div></div>'
}
function viewWaterAlert() { openWaterBodyDetail('3号水塘') }
function openWaterBodyDetail(name) {
  const wb = ecoWaterBodies.value.find(function(x) { return x.name === name })
  if (!wb) { toast(name + ' 水质正常', 'info'); return }
  _currentWaterBody = wb
  const abnormal = wb.status !== '正常'
  let timelineHtml = ''
  if (wb.timeline && wb.timeline.length) {
    wb.timeline.forEach(function(st, i) {
      const isLast = i === wb.timeline.length - 1
      timelineHtml += '<div style="display:flex;gap:10px;align-items:flex-start"><div style="text-align:center;flex-shrink:0;width:14px"><div style="width:10px;height:10px;border-radius:50%;background:' + (isLast ? '#F2A62B' : '#22B573') + ';margin:5px auto 0"></div>' + (isLast ? '' : '<div style="width:1px;height:24px;background:#E3EAF0;margin:0 auto"></div>') + '</div><div style="padding-bottom:14px;flex:1"><span style="font-size:13px;color:#66788A;margin-right:10px">' + st.t + '</span><span style="font-size:14px;color:#1F2D3D;font-weight:500">' + st.s + '</span></div></div>'
    })
  }
  const h = '<div style="padding:12px 0">' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><span style="font-size:24px">' + wb.icon + '</span><span style="font-size:17px;color:#1F2D3D;font-weight:700">' + wb.name + ' · 水质详情</span>' +
    '<span style="margin-left:auto">' + ecoPill(abnormal ? '异常' : '正常', wb.tone) + '</span></div>' +
    '<div style="display:flex;flex-direction:column;margin-bottom:16px">' +
    ecoAlertField('📊 ' + wb.indicator, wb.value) +
    ecoAlertField('✅ 正常标准', wb.standard) +
    ecoAlertField('🕐 更新时间', wb.updateTime) +
    '</div>' +
    (timelineHtml ? '<div style="margin-bottom:16px"><div style="font-size:15px;color:#1F2D3D;font-weight:700;margin-bottom:8px">📋 处理进度</div>' + timelineHtml + '</div>' : '') +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-outline" onclick="window._svc.viewWaterLocation()">📍 查看位置</button>' +
    '<button class="btn btn-primary" onclick="window._svc.reportWaterSupplement()">📝 我要上报补充情况</button>' +
    '</div></div>'
  openGovModal(wb.name + ' · 水质详情', h)
}
function openWaterBodyByIdx(idx) {
  const wb = ecoWaterBodies.value[idx]
  if (wb) openWaterBodyDetail(wb.name)
}
function viewWaterLocation() {
  const wb = _currentWaterBody
  toast('已打开地图定位「' + (wb ? wb.name : '该水体') + '」', 'info')
}
function reportWaterSupplement() {
  const wb = _currentWaterBody
  if (!wb) { reportEnvironment(); return }
  reportEnvironment({ location: wb.name, eventSource: 'MONITOR_ALERT_SUPPLEMENT', problemType: '水质问题', indicator: wb.indicator, value: wb.value })
}
function reportFromMonitor() {
  const r = _currentMonitorRow
  if (!r) { reportEnvironment(); return }
  if (r.name === '3号水塘') {
    reportEnvironment({ location: '3号水塘', eventSource: 'MONITOR_ALERT_SUPPLEMENT', problemType: '水质问题', indicator: '溶解氧', value: '3.2mg/L' })
  } else if (r.type === '水质监测') {
    reportEnvironment({ location: r.name, eventSource: 'MONITOR_ALERT_SUPPLEMENT', problemType: '水质问题', indicator: '水质指标', value: r.value })
  } else {
    reportEnvironment({ location: r.name, eventSource: 'MONITOR_ALERT_SUPPLEMENT', source: '环境监测', monitorType: r.type, value: r.value })
  }
}

// Ecology dynamic data (single source of truth — drives 垃圾清运 / 水质 / 监测点)
const ecoGarbagePoints = ref([
  { id: 'TRASH_001', villageId: 'ZY001', gridId: 'GRID_02', name: '1组村口垃圾点', locationText: '中堰村1组村口', latitude: 34.1268, longitude: 108.2304, fillLevel: 10, status: 'COMPLETED', lastCleanedAt: '2026-08-13 09:20', plannedCleanAt: '2026-08-14 08:30' },
  { id: 'TRASH_002', villageId: 'ZY001', gridId: 'GRID_02', name: '3组晒场垃圾点', locationText: '中堰村3组晒场东侧', latitude: 34.1291, longitude: 108.2347, fillLevel: 80, status: 'WAITING', lastCleanedAt: '2026-08-12 17:00', plannedCleanAt: '2026-08-13 17:00' },
  { id: 'TRASH_003', villageId: 'ZY001', gridId: 'GRID_02', name: '村东路口垃圾点', locationText: '中堰村村东路口', latitude: 34.1315, longitude: 108.2389, fillLevel: 95, status: 'DELAYED', lastCleanedAt: '2026-08-12 07:00', plannedCleanAt: '2026-08-13 08:00', delayHours: 2 }
])
const ecoWaterBodies = ref([
  { name: '1号水塘', icon: '💧', status: '正常', tone: 'green', indicator: '溶解氧', value: '6.8mg/L', standard: '≥5mg/L', updateTime: '10分钟前', distance: '约 600m' },
  { name: '2号水塘', icon: '💧', status: '正常', tone: 'green', indicator: '溶解氧', value: '5.5mg/L', standard: '≥5mg/L', updateTime: '10分钟前', distance: '约 450m' },
  { name: '3号水塘', icon: '💧', status: '异常', tone: 'amber', indicator: '溶解氧', value: '3.2mg/L', standard: '≥5mg/L', updateTime: '1小时前', distance: '约 800m',
    timeline: [
      { t: '14:00', s: '已发现异常' },
      { t: '14:05', s: '系统生成告警' },
      { t: '14:20', s: '已通知网格员王大爷' },
      { t: '15:10', s: '已安排现场查看' }
    ] },
  { name: '村北河', icon: '🌊', status: '正常', tone: 'green', indicator: 'pH', value: '6.2', standard: '6.5-8.5', updateTime: '30分钟前', distance: '约 1.2km' }
])
let _currentWaterBody = null
let _currentMonitorRow = null

// Ecology
const ecoStats = [
  { key: 'air', label: '空气质量指数', value: '42', valueTag: '优', sub: 'PM2.5: 15μg/m³', icon: '🌬️', iconBg: 'rgba(34,181,115,0.12)' },
  { key: 'water', label: '水质综合指数', value: 'Ⅱ类', sub: '3号水塘需关注', icon: '💧', iconBg: 'rgba(14,165,233,.10)' },
  { key: 'carbon', label: '碳汇量估算', value: '860', sub: '吨CO₂当量/年', icon: '🌳', iconBg: '#FFF8E8' },
  { key: 'straw', label: '秸秆综合利用率', value: '92%', sub: '↑5% 同比', icon: '♻️', iconBg: '#FDE8E8' }
]
const ecoAlerts = [
  { id: 1, icon: '💧', title: '3号水塘溶解氧偏低', desc: '当前值 3.2mg/L，标准≥5mg/L', time: '1小时前 · 已派单', actionLabel: '查看详情', waterBody: '3号水塘',
    where: '3号水塘', current: '溶解氧 3.2mg/L', standard: '≥5mg/L', risk: '中度风险：可能影响鱼虾存活', advice: '请勿在附近取水饮用或放牧饮水，已通知水务员处理' },
  { id: 2, icon: '🌫️', title: 'PM10浓度接近预警值', desc: '当前值 48μg/m³，预警线50μg/m³', time: '2小时前 · 持续监测', actionLabel: '查看详情',
    where: '全村空气质量', current: 'PM10 48μg/m³', standard: '预警线 50μg/m³', risk: '轻度风险：敏感人群注意', advice: '老人儿童减少户外长时间活动，粉尘作业注意防护' },
  { id: 3, icon: '🗑️', title: '垃圾清运延迟提醒', desc: '村东路口垃圾点超过计划时间未清运', time: '3小时前 · 已通知保洁', actionLabel: '查看清运情况', garbagePointId: 'TRASH_003',
    where: '村东路口垃圾点', current: '已超计划时间 2 小时', standard: '日产日清', risk: '轻度风险：蚊虫滋生隐患', advice: '生活垃圾请打包扎紧，可申请加急清运' }
]
const ecoTableData = [
  { name: '村东果园站', type: '空气质量', value: 'AQI 42', standard: '≤50 优', status: '正常', statusCls: 'online', updateTime: '5分钟前' },
  { name: '油葵种植区站', type: '土壤监测', value: '湿度 28%', standard: '20%-35%', status: '正常', statusCls: 'online', updateTime: '5分钟前' },
  { name: '3号水塘', type: '水质监测', value: 'DO 3.2mg/L', standard: '≥5mg/L', status: '异常', statusCls: 'warning', updateTime: '1小时前' },
  { name: '村南灌溉渠', type: '水质监测', value: 'pH 7.2', standard: '6.5-8.5', status: '正常', statusCls: 'online', updateTime: '10分钟前' },
  { name: '养猪场A区', type: '废气监测', value: 'NH₃ 5.2ppm', standard: '≤20ppm', status: '正常', statusCls: 'online', updateTime: '2分钟前' }
]

// Service
const svcStats = [
  { label: '本月便民服务', value: '156', sub: '↑18% 环比', icon: '🤝', iconBg: 'rgba(14,165,233,.10)' },
  { label: '在线问诊', value: '42', sub: '↑25% 环比', icon: '🏥', iconBg: 'rgba(57,217,138,0.12)' },
  { label: '培训参与人次', value: '2.96', sub: '2024年数据', icon: '📚', iconBg: '#FFF8E8' },
  { label: '重点关怀老人', value: '68', sub: '智能监测覆盖', icon: '👴', iconBg: '#FDE8E8' }
]
const svcModules = [
  { label: '医保社保查询', icon: '🏥', iconBg: 'rgba(14,165,233,.10)', desc: '在线查询医保缴费记录、社保发放情况、一键办理业务', tags: [{ text: '对接政务', cls: 'blue' }, { text: '已上线', cls: 'green' }] },
  { label: '补贴申请', icon: '📝', iconBg: 'rgba(57,217,138,0.12)', desc: '农业补贴、低保申请、残疾补贴等在线申请与进度查询', tags: [{ text: '已上线', cls: 'green' }] },
  { label: '老人关爱系统', icon: '👴', iconBg: '#FDE8E8', desc: '一键呼救、异常预警、定位服务、健康档案智能监测', tags: [{ text: '智能手环', cls: 'blue' }, { text: '已上线', cls: 'green' }] },
  { label: '远程医疗', icon: '🩺', iconBg: '#FFF8E8', desc: '在线问诊、远程会诊、电子病历管理、健康数据监测', tags: [{ text: '视频问诊', cls: 'blue' }, { text: '已上线', cls: 'green' }] },
  { label: '农技培训', icon: '🎓', iconBg: 'rgba(139,92,246,.12)', desc: '直播课堂、技能培训视频、政策宣传、专家在线答疑', tags: [{ text: '直播', cls: 'blue' }, { text: '已上线', cls: 'green' }] },
  { label: '政务预约', icon: '📅', iconBg: 'rgba(14,165,233,.10)', desc: '村委会业务预约、证件办理预约，减少跑腿次数', tags: [{ text: '已上线', cls: 'green' }] }
]

// IoT
// ==================== 设备中心（村级物联设备管理）====================
// 定位：物联设备 / 视频监控 / 运行告警的统一入口；与生态治理中心（环境、水质）、数字产业中心（农业传感）、
// 数据中心（历史数据）、治理中心（异常告警→分派处置）形成数据联动（告警处置链路正式接入后闭环）

// —— 运行总览（设备中心首页）——
const deviceOverviewStats = [
  { label: '全部设备', value: '114', sub: 'IoT 82 + 监控 32', icon: '🔌', iconBg: 'rgba(14,165,233,.10)', cls: '' },
  { label: '在线', value: '108', sub: '在线率 94.7%', icon: '🟢', iconBg: 'rgba(57,217,138,0.12)', cls: 'g' },
  { label: '异常/告警', value: '3', sub: '需关注', icon: '⚠️', iconBg: 'rgba(245,158,11,0.12)', cls: 'y' },
  { label: '离线', value: '3', sub: '待排查', icon: '🔴', iconBg: 'rgba(239,68,68,0.12)', cls: 'r' }
]

// —— 当前异常 / 告警（演示数据；正式由 IoT 网关告警 + 视频离线检测实时推送）——
const deviceAlerts = [
  { device: '村东灌溉水压传感器', issue: '水压偏低', time: '14:26', severity: 'warning', module: '水利监测' },
  { device: '3号水塘水质监测器', issue: '数据异常', time: '13:48', severity: 'warning', module: '生态环境' },
  { device: '停车场监控', issue: '设备离线', time: '12:31', severity: 'offline', module: '公共区域' },
  { device: '南坡灌溉渠水位计', issue: '水位偏低', time: '11:05', severity: 'warning', module: '水利监测' },
  { device: '集中供水站液位计', issue: '设备离线', time: '09:42', severity: 'offline', module: '公共设施' },
  { device: '产业园冷库监控', issue: '设备离线', time: '08:18', severity: 'offline', module: '产业园' }
]

// —— IoT 设备（演示台账：代表设备，正式接入后展示全部 82 台）——
const iotCategories = ['全部', '农业生产', '水利监测', '生态环境', '公共设施']
function genTrend(base, amp) {
  const arr = []
  for (let i = 0; i < 12; i++) arr.push(Math.round((base + Math.sin(i / 1.6) * amp) * 10) / 10)
  return arr
}
const iotDevices = [
  { id: 'IOT-001', name: '产业园温湿度传感器', icon: '🌡️', category: '农业生产', location: '产业园', status: '在线', statusCls: 'online', metric: '温度 26.8℃ · 湿度 61%', lastReport: '16:40', installTime: '2026-02-18', lastComm: '2026-08-14 16:40', trendLabel: '温度(℃)', realtime: [{ label: '温度', value: '26.8℃', ok: true }, { label: '湿度', value: '61%', ok: true }], trend: genTrend(26.5, 1.4) },
  { id: 'IOT-002', name: '阳光玫瑰葡萄园土壤墒情', icon: '🌱', category: '农业生产', location: '葡萄园', status: '在线', statusCls: 'online', metric: '墒情适宜 · 24.6%', lastReport: '16:38', installTime: '2026-03-02', lastComm: '2026-08-14 16:38', trendLabel: '土壤湿度(%)', realtime: [{ label: '土壤湿度', value: '24.6%', ok: true }, { label: 'PH', value: '6.8', ok: true }], trend: genTrend(24.5, 2.5) },
  { id: 'IOT-003', name: '油葵种植区土壤传感器', icon: '🌱', category: '农业生产', location: '油葵种植区', status: '在线', statusCls: 'online', metric: '墒情适宜', lastReport: '16:35', installTime: '2026-03-02', lastComm: '2026-08-14 16:35', trendLabel: '土壤湿度(%)', realtime: [{ label: '土壤湿度', value: '23.8%', ok: true }], trend: genTrend(23.5, 2.2) },
  { id: 'IOT-004', name: '蔬菜大棚环境监测', icon: '🌡️', category: '农业生产', location: '蔬菜大棚', status: '在线', statusCls: 'online', metric: '31.2℃ · 湿度 72%', lastReport: '16:33', installTime: '2026-01-20', lastComm: '2026-08-14 16:33', trendLabel: '温度(℃)', realtime: [{ label: '温度', value: '31.2℃', ok: true }, { label: '湿度', value: '72%', ok: true }], trend: genTrend(31, 2) },
  { id: 'IOT-005', name: '养猪场环境传感器', icon: '🐖', category: '农业生产', location: '养猪场A区', status: '在线', statusCls: 'online', metric: '氨气浓度正常', lastReport: '16:30', installTime: '2026-02-10', lastComm: '2026-08-14 16:30', trendLabel: '氨气(ppm)', realtime: [{ label: '氨气浓度', value: '8ppm', ok: true }, { label: '温度', value: '28.4℃', ok: true }], trend: genTrend(8, 3) },
  { id: 'IOT-018', name: '3号水塘水质监测器', icon: '💧', category: '生态环境', location: '3号水塘', status: '异常', statusCls: 'warning', metric: 'PH 7.2 · 溶氧 6.8mg/L', lastReport: '13:48', installTime: '2026-03-12', lastComm: '2026-08-14 13:48', trendLabel: '溶解氧(mg/L)', realtime: [{ label: 'PH', value: '7.2', ok: true }, { label: '溶氧', value: '6.8mg/L', ok: false }, { label: '水温', value: '24.6℃', ok: true }, { label: '浊度', value: '偏高', ok: false }], trend: genTrend(7.2, 1.2) },
  { id: 'IOT-019', name: '南坡灌溉渠水位计', icon: '🌊', category: '水利监测', location: '南坡灌溉渠', status: '异常', statusCls: 'warning', metric: '水位 0.28m · 偏低', lastReport: '11:05', installTime: '2026-04-05', lastComm: '2026-08-14 11:05', trendLabel: '水位(m)', realtime: [{ label: '水位', value: '0.28m', ok: false }], trend: genTrend(0.32, 0.08) },
  { id: 'IOT-026', name: '村东供水压力传感器', icon: '🚰', category: '水利监测', location: '村东', status: '在线', statusCls: 'online', metric: '压力 0.31MPa', lastReport: '16:41', installTime: '2026-02-28', lastComm: '2026-08-14 16:41', trendLabel: '压力(MPa)', realtime: [{ label: '当前压力', value: '0.31MPa', ok: true }], trend: genTrend(0.31, 0.03) },
  { id: 'IOT-027', name: '村东灌溉水压传感器', icon: '🚿', category: '水利监测', location: '村东', status: '异常', statusCls: 'warning', metric: '水压偏低', lastReport: '14:26', installTime: '2026-03-18', lastComm: '2026-08-14 14:26', trendLabel: '压力(MPa)', realtime: [{ label: '当前压力', value: '0.16MPa', ok: false }], trend: genTrend(0.2, 0.05) },
  { id: 'IOT-010', name: '村口空气监测站', icon: '🌬️', category: '生态环境', location: '村口', status: '在线', statusCls: 'online', metric: 'AQI 42 · 优良', lastReport: '16:45', installTime: '2026-01-15', lastComm: '2026-08-14 16:45', trendLabel: 'AQI', realtime: [{ label: 'AQI', value: '42', ok: true }, { label: 'PM2.5', value: '18', ok: true }], trend: genTrend(42, 10) },
  { id: 'IOT-012', name: '村口噪声监测点', icon: '🔊', category: '生态环境', location: '村口主干道', status: '在线', statusCls: 'online', metric: '52dB · 达标', lastReport: '16:42', installTime: '2026-01-15', lastComm: '2026-08-14 16:42', trendLabel: '噪声(dB)', realtime: [{ label: '噪声', value: '52dB', ok: true }], trend: genTrend(52, 6) },
  { id: 'IOT-013', name: '灌溉渠水质监测点', icon: '💧', category: '生态环境', location: '南坡灌溉渠', status: '在线', statusCls: 'online', metric: '浊度正常', lastReport: '16:40', installTime: '2026-04-05', lastComm: '2026-08-14 16:40', trendLabel: '浊度(NTU)', realtime: [{ label: '浊度', value: '正常', ok: true }], trend: genTrend(3, 1) },
  { id: 'IOT-020', name: '村口路灯控制器', icon: '💡', category: '公共设施', location: '村口', status: '在线', statusCls: 'online', metric: '运行正常', lastReport: '16:47', installTime: '2026-02-01', lastComm: '2026-08-14 16:47', trendLabel: '电流(A)', realtime: [{ label: '运行状态', value: '正常', ok: true }], trend: genTrend(1.2, 0.3) },
  { id: 'IOT-021', name: '集中供水站液位计', icon: '🗼', category: '公共设施', location: '村北高位水池', status: '离线', statusCls: 'offline', metric: '液位信号中断', lastReport: '09:42', installTime: '2026-02-01', lastComm: '2026-08-14 09:42', trendLabel: '液位(m)', realtime: [{ label: '液位', value: '—', ok: false }], trend: genTrend(3.5, 0.4) },
  { id: 'IOT-022', name: '停车场道闸控制器', icon: '🅿️', category: '公共设施', location: '停车场', status: '在线', statusCls: 'online', metric: '运行正常', lastReport: '16:46', installTime: '2026-02-01', lastComm: '2026-08-14 16:46', trendLabel: '电流(A)', realtime: [{ label: '运行状态', value: '正常', ok: true }], trend: genTrend(0.8, 0.2) }
]

// ===== 数据中心（农户端）=====
// 定位：我的数据 / 本村公开数据查询入口，不做技术架构展示、不做数据大屏（综合态势大屏后续迁到管理员端/村干部端）
// 登录者只能看到自己的数据（与 currentUser 绑定；正式由后台按 token/session 定身份，前端绝不传 userId 查询）

// —— 系统运行（管理员端「系统管理 / 系统运行」）：优先接入后端 /api/v1/stats 真实统计，
//    后端未启动或返回异常时回退到下方静态技术指标，农户端数据中心不再展示 ——
const dataStats = ref([
  { label: '数据总量', value: '1.8GB', sub: '日增 ~5MB', icon: '🗄️', iconBg: 'rgba(14,165,233,.10)' },
  { label: '数据表', value: '86', sub: '14个业务域', icon: '📊', iconBg: 'rgba(57,217,138,0.12)' },
  { label: 'API接口', value: '124', sub: '日均2.3万次调用', icon: '🔌', iconBg: '#FFF8E8' }
])
const dataAssets = ref([
  { label: '人口数据', pct: 100, count: '1,286条' }, { label: '土地数据', pct: 78, count: '852条' },
  { label: '产业数据', pct: 65, count: '634条' }, { label: '环境数据', pct: 45, count: '2.4万条' },
  { label: 'IoT数据', pct: 92, count: '18.6万条' }
])
const runtimeLoaded = ref(false)
const runtimeLoading = ref(false)

function fmtWan(v) {
  const w = (v || 0) / 10000
  return w >= 1 ? '¥' + (Math.round(w * 10) / 10) + '万' : '¥' + Math.round(v || 0)
}
// 从后端拉取真实运行指标（成功则替换静态指标，失败静默保留静态数据）
async function loadRuntimeStats() {
  if (runtimeLoaded.value || runtimeLoading.value) return
  runtimeLoading.value = true
  try {
    const res = await getStats()
    if (res && res.code === 200 && res.data) {
      const d = res.data
      const assetsTotal = (d.lands_count || 0) + (d.crops_count || 0) + (d.products_count || 0) + (d.orders_count || 0) + (d.bnbs_count || 0) + (d.elders_count || 0)
      dataStats.value = [
        { label: '数据资产总量', value: String(assetsTotal), sub: '6个业务域 · 实时', icon: '🗄️', iconBg: 'rgba(14,165,233,.10)' },
        { label: '累计订单金额', value: '¥' + (d.orders_total || 0).toLocaleString(), sub: (d.orders_count || 0) + ' 笔订单', icon: '🧾', iconBg: 'rgba(57,217,138,0.12)' },
        { label: '民宿累计营收', value: fmtWan(d.bnbs_revenue), sub: (d.bnbs_count || 0) + ' 家民宿', icon: '🏡', iconBg: '#FFF8E8' }
      ]
      const rows = [
        { label: '地块数据', count: d.lands_count || 0 },
        { label: '种植作物', count: d.crops_count || 0 },
        { label: '农产品', count: d.products_count || 0 },
        { label: '电商订单', count: d.orders_count || 0 },
        { label: '民宿档案', count: d.bnbs_count || 0 },
        { label: '老人档案', count: d.elders_count || 0 }
      ]
      const max = Math.max(...rows.map(r => r.count), 1)
      dataAssets.value = rows.map(r => ({
        label: r.label,
        pct: Math.round(r.count / max * 100),
        count: r.count + ' 条'
      }))
      runtimeLoaded.value = true
    }
  } catch (e) {
    // 后端未启动：保留静态技术指标，不报错
  } finally {
    runtimeLoading.value = false
  }
}

// —— 农户端「我的数据」4 卡 ——
const myDataCards = [
  { key: 'basic', icon: '👤', title: '我的基本信息', desc: '姓名、所在村组、家庭信息' },
  { key: 'industry', icon: '🌾', title: '我的产业数据', desc: '土地、种植、养殖、农产品' },
  { key: 'records', icon: '📋', title: '我的办事记录', desc: '事件上报、申请记录、咨询留言' },
  { key: 'benefits', icon: '💰', title: '我的补贴/权益', desc: '惠农补贴、养老、医保' }
]

// —— 本村公开数据（仅公开统计，不展示个人隐私）——
const villagePublicData = [
  { key: 'population', icon: '👥', label: '人口概况' },
  { key: 'land', icon: '🌾', label: '土地与产业' },
  { key: 'eco', icon: '🌱', label: '生态环境' },
  { key: 'infra', icon: '🏠', label: '基础设施' },
  { key: 'finance', icon: '💰', label: '村务公开' },
  { key: 'policy', icon: '📜', label: '惠农政策' }
]

// —— 本村公开数据明细（统计口径，不含个人身份/联系方式/家庭档案）——
const villageDataDetail = {
  population: {
    title: '人口概况', icon: '👥', intro: '本村人口公开统计（不含个人身份信息）',
    metrics: [
      { label: '全村户数', value: '816 户' },
      { label: '常住人口', value: '1,286 人' },
      { label: '户籍人口', value: '1,342 人' }
    ],
    rows: [
      { label: '年龄结构', value: '0–17岁 18% · 18–59岁 56% · 60岁以上 26%' },
      { label: '男女比例', value: '男 52% · 女 48%' },
      { label: '劳动力人口', value: '736 人' }
    ],
    updatedAt: '2026-08-10', source: '中堰村村委会 · 户籍登记'
  },
  land: {
    title: '土地与产业', icon: '🌾', intro: '本村土地与产业公开概况（全村汇总，区别于个人产业数据）',
    metrics: [
      { label: '耕地面积', value: '2,860 亩' },
      { label: '集体土地', value: '320 亩' },
      { label: '特色产业', value: '4 项' }
    ],
    rows: [
      { label: '主要作物', value: '油葵、玉米、阳光玫瑰葡萄' },
      { label: '种植结构', value: '粮食 62% · 油料 20% · 果蔬 18%' },
      { label: '集体经济收入', value: '¥ 300万（2025年）' }
    ],
    updatedAt: '2026-08-10', source: '中堰村村委会 · 农经统计'
  },
  eco: {
    title: '生态环境', icon: '🌱', intro: '本村生态环境公开监测概况',
    metrics: [
      { label: '空气质量', value: '优良 · AQI 42' },
      { label: '绿化覆盖率', value: '38%' },
      { label: '环境监测点', value: '6 处' }
    ],
    rows: [
      { label: '水质监测', value: '3号水塘水质正常' },
      { label: '生活污水处理率', value: '92%' }
    ],
    updatedAt: '2026-08-14 08:30', source: '中堰村生态环境监测站',
    monitors: [
      { name: '1号空气监测点', loc: '村委会大院', value: 'AQI 42 · 优良', status: '正常' },
      { name: '2号空气监测点', loc: '产业园东侧', value: 'AQI 45 · 优良', status: '正常' },
      { name: '3号水塘水质监测点', loc: '3号水塘', value: '溶解氧 6.8mg/L', status: '正常' },
      { name: '4号灌溉渠水质监测点', loc: '南坡灌溉渠', value: '浊度正常', status: '正常' },
      { name: '5号土壤监测点', loc: '阳光玫瑰葡萄园', value: '墒情适宜', status: '正常' },
      { name: '6号噪声监测点', loc: '村口主干道', value: '52dB · 达标', status: '正常' }
    ]
  },
  infra: {
    title: '基础设施', icon: '🏠', intro: '本村基础设施公开概况（点击可查看设施明细）',
    metrics: [
      { label: '硬化道路', value: '12.6 公里', onclick: "window._svc.openVillageSub('infra')" },
      { label: '路灯', value: '218 盏', onclick: "window._svc.openVillageSub('infra')" },
      { label: '集中供水', value: '覆盖 100%', onclick: "window._svc.openVillageSub('infra')" }
    ],
    rows: [
      { label: '文化广场', value: '3 处', action: 'facility' },
      { label: '卫生室', value: '1 个', action: 'facility' },
      { label: '公厕', value: '8 座', action: 'facility' }
    ],
    updatedAt: '2026-08-08', source: '中堰村村委会 · 基础设施台账',
    facilities: {
      '道路': [
        { name: '村主干道', detail: '硬化 3.2公里 · 宽 5米', loc: '贯穿全村' },
        { name: '东沟机耕道', detail: '硬化 2.1公里', loc: '村东片区' },
        { name: '南坡生产路', detail: '硬化 1.8公里', loc: '村南片区' }
      ],
      '路灯': [
        { name: '村主干道路灯', detail: '86 盏 · 太阳能', loc: '村主干道两侧' },
        { name: '巷道路灯', detail: '102 盏', loc: '各组巷道' },
        { name: '广场路灯', detail: '30 盏', loc: '3处文化广场' }
      ],
      '公共场所': [
        { name: '文化广场', detail: '3 处 · 健身器材齐全', loc: '村委会旁 / 东组 / 南组' },
        { name: '党群服务中心', detail: '1 处 · 二楼会议室', loc: '村委会' }
      ],
      '医疗卫生': [
        { name: '村卫生室', detail: '1 个 · 1名乡村医生', loc: '村委会西侧' }
      ],
      '供水': [
        { name: '集中供水站', detail: '覆盖 816 户 · 100%', loc: '村北高位水池' }
      ]
    }
  },
  finance: {
    title: '村务公开', icon: '💰', intro: '村务公开信息目录（财务、政策、集体资产、重大事项）',
    metrics: [
      { label: '公开事项', value: '35 项' },
      { label: '公开期数', value: '12 期' },
      { label: '村民代表会议', value: '4 次' }
    ],
    directory: [
      { label: '财务公开', count: '12 期' },
      { label: '惠农政策', count: '8 条' },
      { label: '集体资产', count: '6 项' },
      { label: '重大事项', count: '5 项' },
      { label: '村民代表会议', count: '4 次' }
    ],
    recent: [
      { title: '2026年7月村级财务收支明细', date: '2026-08-05', tag: '财务公开' },
      { title: '2026年惠农补贴发放名单公示', date: '2026-07-28', tag: '惠农政策' },
      { title: '集体厂房租赁招标结果公示', date: '2026-07-20', tag: '集体资产' },
      { title: '村文化广场改造项目决策公示', date: '2026-07-12', tag: '重大事项' }
    ],
    detail: {
      '财务公开': [
        { title: '2026年7月村级财务收支明细', date: '2026-08-05' },
        { title: '2026年6月村级财务收支明细', date: '2026-07-05' },
        { title: '2026年第二季度财务收支汇总', date: '2026-07-05' }
      ],
      '惠农政策': [
        { title: '耕地地力保护补贴政策', date: '2026-03-15' },
        { title: '节水灌溉设施建设补贴', date: '2026-07-01' },
        { title: '秸秆综合利用补贴办法', date: '2026-05-20' }
      ],
      '集体资产': [
        { title: '村集体厂房 2 处（租赁经营）', date: '2026-06-30' },
        { title: '集体土地 320 亩', date: '2026-06-30' },
        { title: '集体果园 80 亩', date: '2026-06-30' }
      ],
      '重大事项': [
        { title: '村文化广场改造项目', date: '2026-07-12' },
        { title: '村主干道路灯升级', date: '2026-06-20' },
        { title: '阳光玫瑰葡萄园扩建', date: '2026-05-28' }
      ],
      '村民代表会议': [
        { title: '2026年第二次村民代表会议', date: '2026-07-10' },
        { title: '2026年第一次村民代表会议', date: '2026-04-08' }
      ]
    },
    updatedAt: '2026-08-05', source: '中堰村监督委员会'
  }
}

// —— 我的数据与授权 ——
const dataAuthItems = [
  { field: '基本身份信息', use: '平台基础服务使用' },
  { field: '土地信息', use: '产业服务使用' },
  { field: '联系方式', use: '办事通知使用' }
]

// 数据纠错申请记录（本人提交的纠错申请）
const dataCorrections = ref([])

// Leadership
const leaders = [
  { id: 'deng', name: '邓超', title: '党总支部书记、村委会主任', org: '中堰村党总支部', photo: 'leader-deng.jpg', qr: 'qr-deng.jpg', phone: '15929510089', dutyTags: ['村级全面工作', '重大事项协调', '村民重大问题协调'], serviceTags: ['村务协调', '重大事项', '村民问题'], msgCategories: ['村务咨询', '重大事项协调', '其他事项'], commonMatters: ['村级重大事项协调', '村民重大问题协调', '其他干部职责不明确事项'] },
  { id: 'huang', name: '黄尊海', title: '党总支部副书记', org: '中堰村党总支部', photo: 'leader-huang.jpg', qr: 'qr-huang.jpg', phone: '15229151368', dutyTags: ['党建工作', '组织建设', '村务协助'], serviceTags: ['入党咨询', '组织关系', '村务协助'], msgCategories: ['入党咨询', '组织关系', '其他事项'], commonMatters: ['入党申请', '组织关系转接', '党费缴纳'] },
  { id: 'chen', name: '陈良敏', title: '村委会副主任', org: '中堰村村民委员会', photo: 'leader-chen.jpg', qr: 'qr-chen.jpg', phone: '15389513886', dutyTags: ['村务管理', '基础设施建设', '人居环境整治'], serviceTags: ['村务办理', '基础设施', '人居环境'], msgCategories: ['宅基地', '基础设施', '环境卫生', '其他事项'], commonMatters: ['宅基地申请', '基础设施报修', '环境卫生整治'] },
  { id: 'liao', name: '廖邦洪', title: '村委会副主任', org: '中堰村村民委员会', photo: 'leader-liao.jpg', qr: 'qr-liao.jpg', phone: '13679151313', dutyTags: ['产业发展', '集体经济', '招商引资'], serviceTags: ['产业扶持', '集体经济', '招商引资'], msgCategories: ['产业发展', '集体经济', '招商相关', '其他事项'], commonMatters: ['产业扶持申请', '集体经济咨询', '招商引资对接'] },
  { id: 'gong', name: '龚磊', title: '监委会主任', org: '中堰村监督委员会', photo: 'leader-gong.jpg', qr: 'qr-gong.jpg', phone: '17889100100', dutyTags: ['村务监督', '财务审计', '村务公开'], serviceTags: ['村务监督', '财务公开', '问题反映'], msgCategories: ['财务公开', '村务监督', '其他事项'], commonMatters: ['财务公开查询', '村务监督反映', '集体资产监督'] },
  { id: 'li', name: '李强强', title: '村委会文书', org: '中堰村村民委员会', photo: 'leader-li.jpg', qr: 'qr-li.jpg', phone: '15991187663', dutyTags: ['材料办理', '证明开具', '档案管理'], serviceTags: ['材料办理', '证明开具', '档案查询'], msgCategories: ['证明材料', '材料咨询', '其他事项'], commonMatters: ['证明开具', '材料办理', '档案查询'] }
]
// 联系电话脱敏展示（真实号码仅用于 tel: 拨打）
leaders.forEach(function(l) { l.phoneMasked = maskPhone(l.phone) })

// 村委便民联系（按 village_id 读取当前村村委信息；当前为演示占位，正式由后台下发，不写死真实号码/坐标）
const villageOffice = {
  name: '中堰村村委会',
  address: '陕西省中堰村村委会',
  phone: '', // 未配置时前端显示「暂未公布」，正式由后台按 village_id 下发；不把后台占位文字展示给村民
  hours: '工作日 8:30–12:00 / 14:00–17:30',
  tip: '不清楚该找哪位干部，可联系今日值班干部。'
}
const villagePhone = computed(function() { return villageOffice.phone || '暂未公布' })

// 今日值班干部（后台按 village_id + 排班下发，演示占位）
const dutyLeaderId = 'huang'
const dutyLeader = computed(function() { return leaders.find(function(x) { return x.id === dutyLeaderId }) || leaders[0] })

// 常见事情找谁（service category → staff_id，后台按 village_id 配置）
// 快速找人：service_category → staff_id 映射，后续由管理员端配置、按 village_id 下发，前端不写死
const commonGuides = [
  { category: 'certificate', label: '证明材料', staffId: 'li', icon: '📄' },
  { category: 'homestead', label: '宅基地/建房', staffId: 'chen', icon: '🏠' },
  { category: 'industry', label: '产业发展', staffId: 'liao', icon: '🌱' },
  { category: 'finance', label: '财务公开', staffId: 'gong', icon: '💰' },
  { category: 'environment', label: '环境卫生', staffId: 'chen', icon: '🌿' }
]

// 村民留言类型
const msgTypes = ['村务咨询', '证明办理', '困难求助', '环境问题', '产业生产', '其他']

// 村民留言（核心字段：message_id/village_id/farmer_id/staff_id/category/content/images/preferred_reply_type/status/created_at/replied_at/reply_content/closed_at）
// farmer_id 一律取 currentUser，staff_id 取所点干部，前端不手填；管理员端按 staff_id 分流
const myMessages = ref([
  // 演示数据（正式由后台按 farmer_id 下发，仅本人可见；顺序为新→旧）
  { message_id: 'LY202608010001', village_id: 'zhongyan', farmer_id: currentUser.farmerId, staff_id: 'chen', staff_name: '陈良敏', staff_title: '村委会副主任', category: '基础设施', content: '村东口有两盏路灯不亮了，晚上出行不方便，麻烦安排维修。', images: [], preferred_reply_type: 'platform', status: '已回复', created_at: '2026-08-01T09:20:00+08:00', timeText: '8月1日 09:20', replied_at: '2026-08-02T10:00:00+08:00', replyTimeText: '8月2日 10:00', reply_content: '已安排电工检查，计划本周内完成维修，请留意。', closed_at: null },
  { message_id: 'LY202607150002', village_id: 'zhongyan', farmer_id: currentUser.farmerId, staff_id: 'liao', staff_name: '廖邦洪', staff_title: '村委会副主任', category: '产业发展', content: '想咨询阳光玫瑰葡萄的种植补贴政策，需要准备哪些材料？', images: [], preferred_reply_type: 'phone', status: '已办结', created_at: '2026-07-15T14:30:00+08:00', timeText: '7月15日 14:30', replied_at: '2026-07-16T09:10:00+08:00', replyTimeText: '7月16日 09:10', reply_content: '已电话告知相关政策与所需材料清单。', closed_at: '2026-07-16T09:15:00+08:00' }
])
const pendingMsgCount = computed(function() { return myMessages.value.filter(function(m) { return m.status === '待回复' }).length })
const repliedMsgCount = computed(function() { return myMessages.value.filter(function(m) { return m.status === '已回复' }).length })
const resolvedMsgCount = computed(function() { return myMessages.value.filter(function(m) { return m.status === '已办结' }).length })
// 首页「我的留言」只展示最近3条，避免动态数据越来越多把主页越拉越长；点「查看全部」进弹窗看完整记录
const recentMessages = computed(function() { return myMessages.value.slice(0, 3) })
function msgStatusColor(status) {
  const map = { '待回复': '#F2A62B', '已回复': '#1890FF', '已办结': '#22B573', '已撤回': '#8A97A5' }
  return map[status] || '#8A97A5'
}
let _msgStaff = null, _msgType = '村务咨询', _msgContent = '', _msgPhotos = [], _msgReplyType = '平台回复', _msgSeq = 0
let _supplementMsgId = null
function leaderById(id) { return leaders.find(function(x) { return x.id === id }) }

// ==================== 数据中心（农户端）交互 ====================
// 我的办事记录条数（咨询留言 + 事件上报；补贴/申请在服务中心，跨模块）
const myRecordsCount = computed(function() { return myMessages.value.length + myEvents.length })

// 我的个人数据档案（演示占位；正式由后台按 farmer_id 下发，仅本人可见；姓名/村组来自登录态 currentUser，不写死演示姓名）
const myProfile = {
  householder: currentUser.name, // 户主
  household: 4,
  members: [
    { name: currentUser.name, relation: '户主' },
    { name: '张秀英', relation: '配偶' },
    { name: '王小明', relation: '长子' },
    { name: '王小丽', relation: '长女' }
  ],
  landBlocks: 3,             // 承包地（块）
  confirmedArea: '8.6亩',    // 确权面积
  plantedArea: '8.6亩',      // 当前种植面积（=确权面积，油菜+玉米全覆盖）
  crops: [                   // 当前种植（承包地内）
    { name: '油菜', area: '4.2亩' },
    { name: '玉米', area: '4.4亩' }
  ],
  livestock: '暂无',         // 养殖情况（暂无也保留字段，结构完整）
  products: [                // 家庭农产品（家庭经营，非承包地）
    { name: '阳光玫瑰葡萄', mode: '家庭经营 · 非承包地' }
  ],
  updatedAt: '2026-08-14 09:00', // 数据更新时间
  landPlots: [               // 土地详情（3块，面积合计8.6亩=确权面积，作物与当前种植一致）
    { no: '1号地块', area: '4.2亩', crop: '油菜', location: '村东 · 东沟', type: '承包地（确权）' },
    { no: '2号地块', area: '2.4亩', crop: '玉米', location: '村南 · 南坡', type: '承包地（确权）' },
    { no: '3号地块', area: '2.0亩', crop: '玉米', location: '村西 · 晒场旁', type: '承包地（确权）' }
  ],
  benefits: [               // 补贴/权益（本人可查，权限仅本人）
    {
      name: '耕地地力保护补贴', status: '已发放', year: '2026年度',
      rows: [
        { label: '补贴金额', value: '¥560' },
        { label: '补贴面积', value: '8.6亩' },
        { label: '发放日期', value: '2026-06-30' }
      ],
      detail: [
        { label: '补贴名称', value: '耕地地力保护补贴' },
        { label: '补贴年度', value: '2026年度' },
        { label: '补贴面积', value: '8.6亩（与确权面积一致）' },
        { label: '补贴金额', value: '¥560' },
        { label: '发放状态', value: '已发放' },
        { label: '发放日期', value: '2026-06-30' },
        { label: '发放方式', value: '惠民惠农财政补贴资金“一卡通”' }
      ]
    },
    {
      name: '城乡居民养老保险', status: '正常领取', year: '2026年度',
      rows: [
        { label: '每月待遇金额', value: '¥145/月' },
        { label: '最近发放', value: '2026-07-15' }
      ],
      detail: [
        { label: '待遇项目', value: '城乡居民基本养老保险待遇' },
        { label: '待遇年度', value: '2026年度' },
        { label: '每月待遇金额', value: '¥145/月（领取待遇）' },
        { label: '领取状态', value: '正常领取' },
        { label: '最近发放日期', value: '2026-07-15' }
      ]
    },
    {
      name: '城乡居民基本医疗保险', status: '正常', year: '2026年度',
      rows: [
        { label: '参保年度', value: '2026年度' },
        { label: '参保状态', value: '正常' },
        { label: '更新时间', value: '2026-01-01' }
      ],
      detail: [
        { label: '参保险种', value: '城乡居民基本医疗保险' },
        { label: '参保年度', value: '2026年度' },
        { label: '参保状态', value: '正常' },
        { label: '更新时间', value: '2026-01-01' }
      ]
    }
  ]
}
let _industryYear = '2026'
let _benefitYear = '2026'

function infoRow(label, value) {
  return '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #F0F3F5"><span style="font-size:13px;color:#66788A;flex-shrink:0">' + label + '</span><span style="font-size:14px;color:#1F2D3D;font-weight:600;text-align:right">' + value + '</span></div>'
}
function secTitle(text) {
  return '<div style="font-size:13px;font-weight:700;color:#22B573;margin:14px 0 4px">' + text + '</div>'
}

// —— 公共数据类统一组件：标题 + 核心指标卡 + 明细列表 + 更新时间/来源 + 查看详情 ——
function metricCard(label, value, onclick) {
  const base = 'flex:1;min-width:0;background:#F7FAF9;border:1px solid #E6F0EA;border-radius:8px;padding:10px 12px'
  const style = onclick ? base + ';cursor:pointer;transition:border-color .2s' : base
  const click = onclick ? ' onclick="' + onclick + '"' : ''
  return '<div' + click + ' style="' + style + '"><div style="font-size:11px;color:#66788A;margin-bottom:3px">' + label + '</div><div style="font-size:16px;font-weight:700;color:#1F2D3D">' + value + (onclick ? ' <span style="font-size:12px;color:#22B573">›</span>' : '') + '</div></div>'
}
function pubHeader(d) {
  let h = '<div style="text-align:center;padding:4px 0 14px 0"><div style="font-size:32px;margin-bottom:6px">' + d.icon + '</div>'
  h += '<div style="font-size:17px;font-weight:700;color:#1F2D3D">' + d.title + '</div>'
  h += '<div style="font-size:12px;color:#66788A;margin-top:4px">' + d.intro + '</div></div>'
  return h
}
function pubMetrics(metrics) {
  let h = '<div style="display:flex;gap:8px;margin-bottom:12px">'
  metrics.forEach(function(m) { h += metricCard(m.label, m.value, m.onclick) })
  h += '</div>'
  return h
}
function pubFooter(d, subAction) {
  let h = '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding-top:10px;border-top:1px dashed #E3EAF0">'
  h += '<div style="font-size:11px;color:#8A97A5">' + (d.updatedAt ? '🕘 ' + d.updatedAt + ' 更新' : '') + (d.source ? ' · ' + d.source : '') + '</div>'
  if (subAction) h += '<span style="font-size:12px;color:#22B573;font-weight:600;cursor:pointer" onclick="' + subAction + '">查看详情 ›</span>'
  h += '</div>'
  return h
}

function openMyData(key) {
  if (key === 'basic') renderMyBasicInfo()
  else if (key === 'industry') renderMyIndustryData()
  else if (key === 'records') { _activityFilter = '全部'; renderMyRecords() }
  else if (key === 'benefits') renderMyBenefits()
}
function renderMyBasicInfo() {
  const famRelations = myProfile.members.filter(function(m) { return m.relation !== '户主' }).map(function(m) { return m.relation }).join('、')
  const cadre = leaderById('chen') // 对应片区干部（演示：包组干部，正式由后台按 village_id + 组下发）
  const group = currentUser.village + currentUser.zone.replace('片区', '') // 村民小组：中堰村1组
  let h = '<div style="padding:6px 0">'
  // ① 顶部身份概览
  h += '<div style="text-align:center;padding:4px 0 16px 0">'
  h += '<div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#22B573,#1BA366);display:inline-flex;align-items:center;justify-content:center;font-size:28px;color:#fff;margin-bottom:10px;box-shadow:0 4px 14px rgba(34,181,115,0.25)">👤</div>'
  h += '<div style="font-size:20px;font-weight:700;color:#1F2D3D">' + currentUser.name + '</div>'
  h += '<div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin-top:8px">'
  h += '<span style="font-size:12px;color:#1F2D3D;background:#F0F7F3;border:1px solid #DFEFE7;border-radius:999px;padding:3px 10px">中堰村村民</span>'
  h += '<span style="font-size:12px;color:#1F2D3D;background:#F0F7F3;border:1px solid #DFEFE7;border-radius:999px;padding:3px 10px">' + currentUser.zone + ' · ' + currentUser.grid + '</span>'
  h += '<span style="font-size:12px;color:#22B573;background:rgba(34,181,115,0.10);border:1px solid rgba(34,181,115,0.20);border-radius:999px;padding:3px 10px">家庭户主</span>'
  h += '</div></div>'
  // ② 个人基础信息
  h += secTitle('👤 个人基础信息')
  h += infoRow('村民身份', '本村村民')
  h += infoRow('所在区域', currentUser.village + ' · ' + currentUser.zone)
  h += infoRow('所属网格', currentUser.grid)
  h += infoRow('联系电话', currentUser.phone)
  h += infoRow('居住状态', '常住')
  h += infoRow('数据更新时间', myProfile.updatedAt)
  // ③ 家庭概况
  h += secTitle('🏠 家庭概况')
  h += '<div style="background:#F7FAF9;border:1px solid #E6F0EA;border-radius:10px;padding:2px 14px">'
  h += infoRow('户主', myProfile.householder)
  h += infoRow('家庭人口', myProfile.household + ' 人')
  h += infoRow('常住人口', myProfile.household + ' 人')
  h += infoRow('所在组', currentUser.zone.replace('片区', ''))
  h += '<div onclick="window._svc.showFamilyMembers()" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;cursor:pointer"><span style="font-size:13px;color:#66788A;flex-shrink:0">家庭成员</span><span style="font-size:14px;color:#1F2D3D;font-weight:600;display:flex;align-items:center;gap:6px">' + famRelations + ' <span style="color:#22B573">查看详情 ›</span></span></div>'
  h += '</div>'
  // ④ 我的村级关联
  h += secTitle('🔗 我的村级关联')
  h += infoRow('所属网格', currentUser.grid)
  h += '<div onclick="window._svc.showGridWorkerInfo()" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #F0F3F5;cursor:pointer"><span style="font-size:13px;color:#66788A;flex-shrink:0">网格员</span><span style="font-size:14px;color:#1F2D3D;font-weight:600;display:flex;align-items:center;gap:6px">' + gridWorker.name + ' <span style="color:#22B573">联系 ›</span></span></div>'
  h += infoRow('村民小组', group)
  h += '<div onclick="window._svc.guideContactById(\'' + cadre.id + '\')" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #F0F3F5;cursor:pointer"><span style="font-size:13px;color:#66788A;flex-shrink:0">对应片区干部</span><span style="font-size:14px;color:#1F2D3D;font-weight:600;display:flex;align-items:center;gap:6px">' + cadre.name + ' <span style="color:#22B573">联系 ›</span></span></div>'
  h += infoRow('家庭档案状态', '<span style="color:#22B573">正常</span>')
  // ⑤ 我的关联数据
  h += secTitle('📊 我的关联数据')
  h += '<div style="display:flex;gap:8px;margin-bottom:4px">'
  h += '<div onclick="window._svc.openMyData(\'industry\')" style="flex:1;min-width:0;background:#F7FAF9;border:1px solid #E6F0EA;border-radius:8px;padding:12px 6px;cursor:pointer;text-align:center"><div style="font-size:20px;margin-bottom:4px">🌾</div><div style="font-size:14px;font-weight:700;color:#1F2D3D">' + myProfile.landBlocks + '块/' + myProfile.confirmedArea + '</div><div style="font-size:11px;color:#66788A;margin-top:3px">土地产业 <span style="color:#22B573">›</span></div></div>'
  h += '<div onclick="window._svc.openMyData(\'benefits\')" style="flex:1;min-width:0;background:#F7FAF9;border:1px solid #E6F0EA;border-radius:8px;padding:12px 6px;cursor:pointer;text-align:center"><div style="font-size:20px;margin-bottom:4px">💰</div><div style="font-size:14px;font-weight:700;color:#1F2D3D">' + myProfile.benefits.length + ' 项</div><div style="font-size:11px;color:#66788A;margin-top:3px">补贴权益 <span style="color:#22B573">›</span></div></div>'
  h += '<div onclick="window._svc.openMyData(\'records\')" style="flex:1;min-width:0;background:#F7FAF9;border:1px solid #E6F0EA;border-radius:8px;padding:12px 6px;cursor:pointer;text-align:center"><div style="font-size:20px;margin-bottom:4px">📋</div><div style="font-size:14px;font-weight:700;color:#1F2D3D">' + allActivities.value.length + ' 条</div><div style="font-size:11px;color:#66788A;margin-top:3px">办事记录 <span style="color:#22B573">›</span></div></div>'
  h += '</div>'
  // ⑥ 数据与隐私
  h += '<div style="margin-top:14px;background:rgba(34,181,115,0.06);border:1px solid rgba(34,181,115,0.16);border-radius:8px;padding:12px 14px">'
  h += '<div style="font-size:12px;font-weight:700;color:#1F2D3D;margin-bottom:4px">🔒 数据与隐私</div>'
  h += '<div style="font-size:12px;color:#66788A;line-height:1.6">本页面仅展示本人基础信息，不展示身份证号等敏感信息。</div>'
  h += '<div onclick="window._svc.startDataCorrection()" style="font-size:13px;color:#22B573;font-weight:600;margin-top:8px;cursor:pointer">信息有误？申请数据纠错 ›</div>'
  h += '</div>'
  h += '</div>'
  openGovModal('👤 个人基础档案', h)
}
function showFamilyMembers() {
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">户主 ' + myProfile.householder + ' · 共 ' + myProfile.household + ' 人</div>'
  myProfile.members.forEach(function(m) {
    h += '<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fff;border:1px solid #E3EAF0;border-radius:8px;margin-bottom:8px"><span style="font-size:18px">' + (m.relation === '户主' ? '👨‍🌾' : '👤') + '</span><div style="flex:1"><div style="font-size:14px;font-weight:600;color:#1F2D3D">' + m.name + '</div><div style="font-size:12px;color:#66788A;margin-top:2px">与户主关系：' + m.relation + '</div></div></div>'
  })
  h += '<div style="text-align:center;font-size:12px;color:#8A97A5;margin-top:8px">家庭信息仅本人可见，如与实际不符可提交数据纠错</div>'
  h += '</div>'
  openGovModal('👥 家庭成员', h)
}
// —— 农户端「我的产业数据 / 补贴权益」真实接口数据（后端按 farmer_id 行级过滤）——
const myLandRows = ref([])
const myCropRows = ref([])
const myLivestockRows = ref([])
const mySubsidyRows = ref([])
const myInsuranceRows = ref([])
function _arr(res) { return (res && res.code === 200 && Array.isArray(res.data)) ? res.data : [] }
async function loadMyIndustry() {
  const [l, c, ls] = await Promise.allSettled([listLand(), listCrop(), listLivestock()])
  myLandRows.value = l.status === 'fulfilled' ? _arr(l.value) : []
  myCropRows.value = c.status === 'fulfilled' ? _arr(c.value) : []
  myLivestockRows.value = ls.status === 'fulfilled' ? _arr(ls.value) : []
}
async function loadMyBenefits() {
  const [s, i] = await Promise.allSettled([listSubsidy(), listInsurance()])
  mySubsidyRows.value = s.status === 'fulfilled' ? _arr(s.value) : []
  myInsuranceRows.value = i.status === 'fulfilled' ? _arr(i.value) : []
}
function _emptyInl(text) { return '<div style="text-align:center;padding:14px 0;color:#8A97A5;font-size:12px">' + text + '</div>' }

async function renderMyIndustryData() {
  openGovModal('🌾 我的产业数据', '<div style="padding:40px 0;text-align:center;color:#66788A">数据加载中…</div>')
  await loadMyIndustry()
  const lands = myLandRows.value, crops = myCropRows.value, lss = myLivestockRows.value
  const totalArea = lands.reduce(function(s, l) { return s + (Number(l.area) || 0) }, 0)
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">以下为本人（' + currentUser.name + '）家庭的土地与产业数据（后端实时）</div>'
  h += pubMetrics([
    { label: '承包地', value: lands.length + ' 块' },
    { label: '确权/种植面积', value: totalArea > 0 ? totalArea.toFixed(1) + ' 亩' : '—' },
    { label: '在种作物', value: crops.length + ' 种' },
    { label: '养殖', value: lss.length ? lss.length + ' 批' : '暂无' }
  ])
  h += secTitle('🌾 我的承包地块')
  if (lands.length === 0) h += _emptyInl('暂无本人地块数据')
  else lands.forEach(function(l) { h += infoRow(l.name + '（' + (l.crop || '—') + '）', (l.area || '—') + ' 亩 · ' + (l.status || '—')) })
  h += secTitle('🌱 在种作物')
  if (crops.length === 0) h += _emptyInl('暂无在种作物')
  else crops.forEach(function(c) { h += infoRow(c.name + ' · ' + (c.variety || ''), (c.stage || '—') + ' · ' + (c.area || '—') + ' 亩') })
  h += secTitle('🐖 养殖档案')
  if (lss.length === 0) h += _emptyInl('暂无养殖档案')
  else lss.forEach(function(ls) { h += infoRow(ls.batchName || ls.batchNo, (ls.count != null ? ls.count : '—') + ' ' + (ls.unit || '') + ' · ' + (ls.health || '—')) })
  h += '<div style="text-align:center;margin-top:16px"><button class="btn btn-primary" onclick="window._svc.showLandDetail()">🗺 查看土地详情</button></div>'
  h += '<div style="text-align:center;font-size:12px;color:#8A97A5;margin-top:8px">产业数据如与实际不符，可前往 <span style="color:#22B573;font-weight:600;cursor:pointer" onclick="window._svc.startDataCorrection()">数据纠错</span> 提交修改</div>'
  h += '</div>'
  openGovModal('🌾 我的产业数据', h)
}
function showLandDetail() {
  const lands = myLandRows.value
  const total = lands.reduce(function(s, l) { return s + (Number(l.area) || 0) }, 0)
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">本人承包地共 ' + lands.length + ' 块 · 面积合计 ' + (total > 0 ? total.toFixed(1) : '0') + ' 亩</div>'
  if (lands.length === 0) {
    h += _emptyInl('暂无本人地块')
  } else {
    lands.forEach(function(p) {
      h += '<div style="background:#fff;border:1px solid #E3EAF0;border-radius:8px;padding:12px 14px;margin-bottom:8px">'
      h += '<div style="display:flex;align-items:center;justify-content:space-between"><span style="font-size:14px;font-weight:600;color:#1F2D3D">' + p.name + '</span><span style="font-size:14px;font-weight:700;color:#22B573">' + (p.area || '—') + ' 亩 · ' + (p.crop || '—') + '</span></div>'
      h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px"><span style="font-size:12px;color:#66788A">📍 ' + (p.location || '—') + '</span><span style="font-size:12px;color:#22B573;font-weight:600;cursor:pointer" onclick="window._svc.viewPlotLocation(\'' + p.name + '\')">位置 ›</span></div>'
      h += '<div style="font-size:11px;color:#8A97A5;margin-top:4px">' + (p.soilType || '—') + ' · ' + (p.status || '—') + (p.irrigation ? ' · 已灌溉' : '') + '</div>'
      h += '</div>'
    })
  }
  h += '<div style="text-align:center;font-size:12px;color:#8A97A5;margin-top:8px">地块信息如与实际不符，可前往 <span style="color:#22B573;font-weight:600;cursor:pointer" onclick="window._svc.startDataCorrection()">数据纠错</span> 提交修改</div>'
  h += '</div>'
  openGovModal('🗺 土地详情', h)
}

// —— 我的办事记录：汇总全平台本人办理事项（留言/上报/秸秆回收/数据纠错/办事申请）——
function activityGroup(status) {
  if (status === '已办结' || status === '已回收' || status === '已更新') return '已完成'
  if (status === '已撤回' || status === '已驳回') return '已撤回'
  return '办理中' // 待受理/处理中/待回复/已回复/待联系/村委审核中/待确认/待上门
}
function toSortable(t) {
  if (!t) return '0'
  var str = String(t)
  var m = str.match(/(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/)
  if (m) return m[1] + m[2] + m[3] + m[4] + m[5]
  m = str.match(/(\d{1,2})月(\d{1,2})日\s+(\d{1,2}):(\d{2})/)
  if (m) return '2026' + String(m[1]).padStart(2, '0') + String(m[2]).padStart(2, '0') + String(m[3]).padStart(2, '0') + m[4]
  return '0'
}
// —— 村民诉求上报（后端 service_request）：我的诉求列表 + 详情 ——
const myServiceRequests = ref([])
const srStatusMap = { PENDING: '待受理', PROCESSING: '处理中', FINISHED: '已办结', CLOSED: '已驳回' }
async function loadMyServiceRequests() {
  try {
    const res = await listMyServiceRequests()
    if (res && res.code === 200 && Array.isArray(res.data)) {
      myServiceRequests.value = res.data
    }
  } catch (e) { /* 未登录或请求失败时静默，保留现有数据 */ }
}
function showServiceRequestDetailById(id) {
  const r = myServiceRequests.value.find(function(x) { return String(x.id) === String(id) })
  if (!r) return
  const status = srStatusMap[r.status] || r.status
  const color = { PENDING: '#19B98A', PROCESSING: '#F2A62B', FINISHED: '#22B573', CLOSED: '#8A97A5' }[r.status] || '#66788A'
  let h = '<div style="padding:6px 0">'
  h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">'
  h += '<span style="font-size:12px;color:#66788A">诉求编号：#' + r.id + '</span>'
  h += '<span style="display:inline-block;padding:3px 10px;border-radius:10px;font-size:11px;font-weight:600;color:' + color + ';background:' + color + '1A">' + status + '</span></div>'
  h += '<div style="font-size:14px;font-weight:700;color:#1F2D3D;margin-bottom:8px">' + (r.requestType || '诉求') + '</div>'
  h += '<div style="font-size:13px;color:#475867;line-height:1.7;background:#F7FAF9;border:1px solid #E6F0EA;border-radius:8px;padding:12px 14px;margin-bottom:12px">' + (r.content || '') + '</div>'
  if (r.adminReply) {
    h += '<div style="font-size:12px;color:#1F2D3D;font-weight:700;margin-bottom:4px">📣 村委回复</div>'
    h += '<div style="font-size:13px;color:#475867;line-height:1.7;background:rgba(14,165,233,0.06);border:1px solid rgba(14,165,233,0.16);border-radius:8px;padding:12px 14px;margin-bottom:12px">' + r.adminReply + '</div>'
  } else {
    h += '<div style="font-size:12px;color:#8A97A5;text-align:center;padding:8px 0">暂未回复，请耐心等待村委处理</div>'
  }
  h += '<div style="font-size:11px;color:#8A97A5">🕘 ' + fmtMsgDateTime(r.createTime) + ' 提交</div>'
  h += '</div>'
  openGovModal('📝 诉求详情', h)
}
// —— 管理员：全村诉求管理（列表 + 状态筛选 + 回复/办结）——
const adminSrList = ref([])
let _adminSrFilter = '全部'
let _adminSrReplyId = null
let _adminSrReplyStatus = 'FINISHED'
const ADMIN_SR_STATUS_CN = { PENDING: '待受理', PROCESSING: '处理中', FINISHED: '已办结', CLOSED: '已驳回' }
const ADMIN_SR_STATUS_COLOR = { PENDING: '#19B98A', PROCESSING: '#F2A62B', FINISHED: '#22B573', CLOSED: '#8A97A5' }
async function loadAdminServiceRequests() {
  try {
    const res = await listAllServiceRequests(null)
    if (res && res.code === 200 && Array.isArray(res.data)) {
      adminSrList.value = res.data
    }
  } catch (e) { /* 请求失败由拦截器提示，静默保留现有数据 */ }
}
async function showAdminServiceRequests() {
  _adminSrFilter = '全部'
  _adminSrReplyId = null
  await loadAdminServiceRequests()
  renderAdminServiceRequests()
}
function setAdminSrFilter(f) {
  _adminSrFilter = f
  renderAdminServiceRequests()
}
function renderAdminServiceRequests() {
  const statuses = ['全部', '待受理', '处理中', '已办结', '已驳回']
  const list = _adminSrFilter === '全部'
    ? adminSrList.value
    : adminSrList.value.filter(function(r) { return (ADMIN_SR_STATUS_CN[r.status] || r.status) === _adminSrFilter })
  let h = '<div style="display:flex;flex-direction:column;height:500px;overflow:hidden;box-sizing:border-box">'
  h += '<div style="flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 0 10px 0">'
  h += '<span style="font-size:13px;color:#475867">共 <b style="color:#22B573">' + list.length + '</b> 条诉求</span>'
  h += '<button onclick="window._svc.refreshAdminSr()" style="font-size:12px;color:#19B98A;font-weight:600;cursor:pointer;background:none;border:none;font-family:inherit">⟳ 刷新</button></div>'
  h += '<div style="flex-shrink:0;display:flex;gap:6px;flex-wrap:wrap;padding:0 0 12px 0">'
  statuses.forEach(function(f) {
    const active = _adminSrFilter === f
    const count = f === '全部' ? adminSrList.value.length : adminSrList.value.filter(function(r) { return (ADMIN_SR_STATUS_CN[r.status] || r.status) === f }).length
    h += '<button onclick="window._svc.setAdminSrFilter(\'' + f + '\')" style="padding:6px 14px;border-radius:16px;font-size:11px;font-weight:' + (active ? '700' : '500') + ';cursor:pointer;font-family:inherit;border:' + (active ? '1px solid #19B98A' : '1px solid #E3EAF0') + ';background:' + (active ? 'rgba(25,185,138,0.12)' : '#FFFFFF') + ';color:' + (active ? '#19B98A' : '#475867') + '">' + f + ' <span style="font-size:10px;opacity:0.65">' + count + '</span></button>'
  })
  h += '</div>'
  h += '<div style="flex:1 1 0;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:8px">'
  if (list.length === 0) {
    h += '<div style="flex:1;display:flex;align-items:center;justify-content:center;color:#66788A;font-size:13px">📭 暂无诉求</div>'
  } else {
    list.forEach(function(r) {
      const cn = ADMIN_SR_STATUS_CN[r.status] || r.status
      const color = ADMIN_SR_STATUS_COLOR[r.status] || '#66788A'
      h += '<div style="flex-shrink:0;padding:12px 14px;background:#FAFBFC;border:1px solid #EBEFF4;border-radius:8px">'
      h += '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">'
      h += '<div style="flex:1;min-width:0">'
      h += '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:4px">' + (r.requestType || '诉求') + ' · <span style="font-weight:500;color:#475867">' + (r.farmerName || ('#' + r.farmerId)) + '</span></div>'
      h += '<div style="font-size:12px;color:#475867;line-height:1.6;margin-bottom:6px">' + (r.content || '') + '</div>'
      h += '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:10px;color:#66788A">'
      h += '<span>🕘 ' + fmtMsgDateTime(r.createTime) + '</span>'
      if (r.contactPhone) h += '<span>📞 ' + r.contactPhone + '</span>'
      if (r.adminReply) h += '<span style="color:#0EA5E9">📣 已回复</span>'
      h += '</div></div>'
      h += '<div style="flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:6px">'
      h += '<span style="display:inline-block;padding:3px 10px;border-radius:10px;font-size:10px;font-weight:600;color:' + color + ';background:' + color + '1A">' + cn + '</span>'
      h += '<button onclick="window._svc.openAdminSrReply(' + r.id + ')" style="font-size:12px;color:#fff;background:#19B98A;border:none;border-radius:6px;padding:5px 12px;cursor:pointer;font-family:inherit">' + (r.status === 'PENDING' ? '受理' : '回复/办结') + '</button>'
      h += '</div></div></div>'
    })
  }
  h += '</div></div>'
  openGovModal('🏛️ 村民诉求管理', h)
  setTimeout(function() {
    var box = document.querySelector('.modal.show .modal-box')
    if (box) { box.style.width = '760px'; box.style.maxWidth = '90vw'; box.style.height = '570px'; box.style.maxHeight = '85vh'; box.style.overflow = 'hidden'; box.style.padding = '20px 24px'; box.style.boxSizing = 'border-box' }
  }, 30)
}
function refreshAdminSr() {
  loadAdminServiceRequests().then(function() { renderAdminServiceRequests() })
}
function openAdminSrReply(id) {
  const r = adminSrList.value.find(function(x) { return String(x.id) === String(id) })
  if (!r) return
  _adminSrReplyId = id
  _adminSrReplyStatus = 'FINISHED'
  const cn = ADMIN_SR_STATUS_CN[r.status] || r.status
  const color = ADMIN_SR_STATUS_COLOR[r.status] || '#66788A'
  let h = '<div style="display:flex;flex-direction:column;height:460px;overflow:hidden;box-sizing:border-box">'
  h += '<div style="flex-shrink:0;padding-bottom:10px;border-bottom:1px dashed #E3EAF0">'
  h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">'
  h += '<span style="font-size:13px;font-weight:700;color:#1F2D3D">' + (r.requestType || '诉求') + ' · ' + (r.farmerName || ('#' + r.farmerId)) + '</span>'
  h += '<span style="display:inline-block;padding:3px 10px;border-radius:10px;font-size:10px;font-weight:600;color:' + color + ';background:' + color + '1A">' + cn + '</span></div>'
  h += '<div style="font-size:12px;color:#475867;line-height:1.6">' + (r.content || '') + '</div>'
  h += '<div style="font-size:10px;color:#66788A;margin-top:4px">🕘 ' + fmtMsgDateTime(r.createTime) + (r.contactPhone ? ' · 📞 ' + r.contactPhone : '') + '</div></div>'
  h += '<div style="flex-shrink:0;padding:12px 0 8px 0;font-size:12px;color:#1F2D3D;font-weight:600">处理状态</div>'
  h += '<div style="flex-shrink:0;display:flex;gap:8px;padding-bottom:12px">'
  ;['处理中', '已办结', '已驳回'].forEach(function(s) {
    const en = { '处理中': 'PROCESSING', '已办结': 'FINISHED', '已驳回': 'CLOSED' }[s]
    const active = _adminSrReplyStatus === en
    h += '<button onclick="window._svc.setAdminSrReplyStatus(\'' + en + '\')" style="padding:6px 14px;border-radius:16px;font-size:12px;font-weight:' + (active ? '700' : '500') + ';cursor:pointer;font-family:inherit;border:' + (active ? '1px solid #19B98A' : '1px solid #E3EAF0') + ';background:' + (active ? 'rgba(25,185,138,0.12)' : '#FFFFFF') + ';color:' + (active ? '#19B98A' : '#475867') + '">' + s + '</button>'
  })
  h += '</div>'
  h += '<div style="flex-shrink:0;font-size:12px;color:#1F2D3D;font-weight:600;padding-bottom:6px">回复内容</div>'
  h += '<textarea id="adminSrReplyText" placeholder="填写回复内容，将同步展示给该村民…" style="flex:1 1 0;min-height:0;width:100%;background:#FFFFFF;border:1px solid #D4DCE6;border-radius:8px;color:#1F2D3D;padding:10px 12px;font-size:12px;font-family:inherit;resize:none;box-sizing:border-box">' + (r.adminReply || '') + '</textarea>'
  h += '<div style="flex-shrink:0;display:flex;gap:8px;justify-content:flex-end;padding-top:12px">'
  h += '<button onclick="window._svc.backToAdminSr()" style="font-size:12px;color:#475867;background:#F0F3F6;border:none;border-radius:6px;padding:8px 16px;cursor:pointer;font-family:inherit">返回</button>'
  h += '<button onclick="window._svc.submitAdminSrReply()" style="font-size:12px;color:#fff;background:#19B98A;border:none;border-radius:6px;padding:8px 16px;cursor:pointer;font-family:inherit">提交回复</button>'
  h += '</div></div>'
  openGovModal('📣 诉求处理', h)
  setTimeout(function() {
    var box = document.querySelector('.modal.show .modal-box')
    if (box) { box.style.width = '620px'; box.style.maxWidth = '90vw'; box.style.height = '520px'; box.style.maxHeight = '85vh'; box.style.overflow = 'hidden'; box.style.padding = '20px 24px'; box.style.boxSizing = 'border-box' }
  }, 30)
}
function setAdminSrReplyStatus(s) {
  _adminSrReplyStatus = s
  openAdminSrReply(_adminSrReplyId)
}
function backToAdminSr() {
  renderAdminServiceRequests()
}
async function submitAdminSrReply() {
  if (!_adminSrReplyId) return
  const el = document.getElementById('adminSrReplyText')
  const text = el ? el.value.trim() : ''
  try {
    const res = await replyServiceRequest(_adminSrReplyId, { status: _adminSrReplyStatus, adminReply: text })
    if (res && res.code === 200) {
      toast('已提交处理', 'success')
      await loadAdminServiceRequests()
      _adminSrReplyId = null
      renderAdminServiceRequests()
    } else {
      toast((res && res.message) || '操作失败，请稍后重试', 'error')
    }
  } catch (e) { /* 拦截器已提示 */ }
}
const allActivities = computed(function() {
  var list = []
  myMessages.value.forEach(function(m) {
    list.push({ kind: '留言', icon: '💬', title: m.category + ' · ' + (m.staff_name || ''), desc: m.content, status: m.status, timeText: fmtMsgDateTime(m.created_at), sort: toSortable(m.created_at), open: 'window._svc.openMessageDetailBy(\'' + m.message_id + '\')' })
  })
  myEvents.forEach(function(e) {
    list.push({ kind: '上报', icon: '📝', title: e.type, desc: e.location, status: e.status, timeText: e.time, sort: toSortable(e.time), open: 'window._svc.showMyEventDetailById(\'' + e.id + '\')' })
  })
  myServiceRequests.value.forEach(function(r) {
    list.push({ kind: '诉求', icon: '📝', title: r.requestType || '诉求', desc: r.content, status: srStatusMap[r.status] || r.status, timeText: fmtMsgDateTime(r.createTime), sort: toSortable(r.createTime), open: 'window._svc.showServiceRequestDetailById(\'' + r.id + '\')' })
  })
  ecoStrawApplications.value.forEach(function(a) {
    list.push({ kind: '回收', icon: '🌾', title: '秸秆回收申请', desc: a.type + ' · ' + a.location, status: a.status, timeText: a.createdAt, sort: toSortable(a.createdAt), open: 'window._svc.openStrawApp()' })
  })
  dataCorrections.value.forEach(function(c) {
    list.push({ kind: '纠错', icon: '📝', title: '数据纠错 · ' + c.type, desc: c.desc, status: c.status, timeText: c.timeText, sort: toSortable(c.created_at), open: 'window._svc.showMyCorrections()' })
  })
  list.sort(function(a, b) { return b.sort.localeCompare(a.sort) })
  return list
})
let _activityFilter = '全部'
function setActivityFilter(f) { _activityFilter = f; renderMyRecords() }
function activityStatusColor(status) {
  const g = activityGroup(status)
  if (g === '已完成') return '#22B573'
  if (g === '已撤回') return '#8A97A5'
  return '#F2A62B'
}
function renderMyRecords() {
  const tabs = ['全部', '办理中', '已完成', '已撤回']
  const countOf = function(s) {
    if (s === '全部') return allActivities.value.length
    return allActivities.value.filter(function(a) { return activityGroup(a.status) === s }).length
  }
  const filtered = _activityFilter === '全部' ? allActivities.value : allActivities.value.filter(function(a) { return activityGroup(a.status) === _activityFilter })
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">汇总本人（' + currentUser.name + '）在平台的留言、上报、申请、纠错等全部办理事项</div>'
  h += '<div style="display:flex;justify-content:center;gap:8px;margin-bottom:12px">'
  tabs.forEach(function(t) {
    const on = _activityFilter === t
    h += '<span onclick="window._svc.setActivityFilter(\'' + t + '\')" style="width:105px;height:42px;border-radius:21px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;font-weight:600;flex-shrink:0;white-space:nowrap;' + (on ? 'background:#22B573;color:#fff;' : 'background:#F0F3F6;color:#66788A;') + '">' + t + ' ' + countOf(t) + '</span>'
  })
  h += '</div>'
  h += '<div style="height:420px;overflow-y:auto;padding-right:4px">'
  if (filtered.length === 0) {
    h += '<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#66788A"><div style="font-size:36px;margin-bottom:10px">📋</div><div style="font-size:14px">该状态下暂无办事记录</div></div>'
  } else {
    filtered.forEach(function(a) {
      const c = activityStatusColor(a.status)
      h += '<div onclick="' + a.open + '" style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fff;border:1px solid #E3EAF0;border-radius:8px;cursor:pointer;margin-bottom:8px">'
      h += '<span style="font-size:20px;flex-shrink:0">' + a.icon + '</span>'
      h += '<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:600;color:#1F2D3D;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + a.title + '</div>'
      h += '<div style="font-size:12px;color:#66788A;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + a.desc + '</div></div>'
      h += '<div style="flex-shrink:0;text-align:right"><span style="display:inline-block;font-size:11px;color:' + c + ';background:' + c + '1A;padding:3px 10px;border-radius:10px;font-weight:600">' + a.status + '</span>'
      h += '<div style="font-size:10px;color:#8A97A5;margin-top:4px">' + a.timeText + '</div></div>'
      h += '</div>'
    })
  }
  h += '</div>'
  h += '</div>'
  openGovModal('📋 我的办事记录', h)
}
async function renderMyBenefits() {
  openGovModal('💰 我的补贴/权益', '<div style="padding:40px 0;text-align:center;color:#66788A">数据加载中…</div>')
  await loadMyBenefits()
  const subs = mySubsidyRows.value, ins = myInsuranceRows.value
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">以下为本人（' + currentUser.name + '）的补贴与权益记录，仅本人可见（后端实时）</div>'
  h += secTitle('💰 惠农补贴')
  if (subs.length === 0) h += _emptyInl('暂无本人补贴记录')
  else subs.forEach(function(s, idx) {
    h += '<div onclick="window._svc.openSubsidyDetail(' + idx + ')" style="background:#fff;border:1px solid #E3EAF0;border-radius:8px;padding:12px 14px;margin-bottom:8px;cursor:pointer;transition:border-color .2s">'
    h += '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><span style="font-size:14px;font-weight:600;color:#1F2D3D">' + (s.type || s.name) + '</span><span style="flex-shrink:0;font-size:11px;color:#22B573;background:rgba(34,181,115,0.12);padding:3px 10px;border-radius:10px;font-weight:600">' + (s.status || '') + '</span></div>'
    h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px"><span style="font-size:12px;color:#66788A">补贴金额</span><span style="font-size:13px;color:#1F2D3D;font-weight:600">¥' + (s.amount != null ? s.amount : '—') + '</span></div>'
    h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px"><span style="font-size:12px;color:#66788A">发放日期</span><span style="font-size:13px;color:#1F2D3D;font-weight:600">' + (s.date || '—') + '</span></div>'
    h += '<div style="text-align:right;font-size:11px;color:#8A97A5;margin-top:8px">查看详情 ›</div>'
    h += '</div>'
  })
  h += secTitle('🩺 医保养老')
  if (ins.length === 0) h += _emptyInl('暂无本人医保养老记录')
  else ins.forEach(function(it, idx) {
    h += '<div onclick="window._svc.openInsuranceDetail(' + idx + ')" style="background:#fff;border:1px solid #E3EAF0;border-radius:8px;padding:12px 14px;margin-bottom:8px;cursor:pointer;transition:border-color .2s">'
    h += '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><span style="font-size:14px;font-weight:600;color:#1F2D3D">' + (it.medType || '医保') + ' / ' + (it.pensionType || '养老') + '</span><span style="flex-shrink:0;font-size:11px;color:#22B573;background:rgba(34,181,115,0.12);padding:3px 10px;border-radius:10px;font-weight:600">' + (it.medStatus || '') + '</span></div>'
    h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px"><span style="font-size:12px;color:#66788A">医保余额</span><span style="font-size:13px;color:#1F2D3D;font-weight:600">' + (it.medBalance || '—') + '</span></div>'
    h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px"><span style="font-size:12px;color:#66788A">养老待遇</span><span style="font-size:13px;color:#1F2D3D;font-weight:600">' + (it.penMonthly || '—') + '</span></div>'
    h += '<div style="text-align:right;font-size:11px;color:#8A97A5;margin-top:8px">查看详情 ›</div>'
    h += '</div>'
  })
  h += '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:10px 12px;margin-top:10px;font-size:12px;color:#1E7A54;line-height:1.6">🔒 补贴与权益涉及个人隐私，仅本人可查看；更多补贴政策可在「惠农政策」栏目查询。</div>'
  h += '</div>'
  openGovModal('💰 我的补贴/权益', h)
}
function yearSelector(currentYear, onChange) {
  const opts = ['2026', '2025', '2024']
  let s = '<select onchange="' + onChange + '(this.value)" style="padding:4px 10px;border:1px solid #E3EAF0;border-radius:14px;font-size:12px;color:#1F2D3D;background:#fff;cursor:pointer;outline:none">'
  opts.forEach(function(y) {
    s += '<option value="' + y + '"' + (y === currentYear ? ' selected' : '') + '>' + y + '年度</option>'
  })
  s += '</select>'
  return s
}
function yearEmptyState(scope) {
  return '<div style="height:300px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#8A97A5"><div style="font-size:32px;margin-bottom:10px">🗓️</div><div style="font-size:14px">该年度暂无' + scope + '数据</div><div style="font-size:11px;margin-top:6px">历史数据接入前暂为模拟/待接入</div></div>'
}
function setIndustryYear(y) { _industryYear = y; renderMyIndustryData() }
function setBenefitYear(y) { _benefitYear = y; renderMyBenefits() }
function openSubsidyDetail(idx) {
  const s = mySubsidyRows.value[idx]
  if (!s) return
  let h = '<div style="padding:6px 0">'
  h += '<div style="text-align:center;padding:4px 0 12px 0"><div style="font-size:26px;margin-bottom:6px">💰</div>'
  h += '<div style="font-size:16px;font-weight:700;color:#1F2D3D">' + (s.type || s.name) + '</div></div>'
  h += infoRow('补贴对象', s.name || currentUser.name)
  h += infoRow('补贴金额', '¥' + (s.amount != null ? s.amount : '—'))
  h += infoRow('发放状态', s.status || '—')
  h += infoRow('发放日期', s.date || '—')
  h += infoRow('经办单位', s.handler || '—')
  h += infoRow('所需材料', s.material || '—')
  h += '<div style="margin-top:12px;background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:10px 12px;font-size:11px;color:#1E7A54;line-height:1.6">🔒 以上信息仅本人可见。</div>'
  h += '</div>'
  openGovModal('💰 ' + (s.type || '补贴详情'), h)
}
function openInsuranceDetail(idx) {
  const it = myInsuranceRows.value[idx]
  if (!it) return
  let h = '<div style="padding:6px 0">'
  h += '<div style="text-align:center;padding:4px 0 12px 0"><div style="font-size:26px;margin-bottom:6px">🩺</div>'
  h += '<div style="font-size:16px;font-weight:700;color:#1F2D3D">医保养老详情</div></div>'
  h += secTitle('🩺 医疗保险')
  h += infoRow('险种', it.medType || '—')
  h += infoRow('参保状态', it.medStatus || '—')
  h += infoRow('账户余额', it.medBalance || '—')
  h += infoRow('最近就诊', it.lastVisit || '—')
  h += secTitle('👴 养老保险')
  h += infoRow('险种', it.pensionType || '—')
  h += infoRow('领取状态', it.penStatus || '—')
  h += infoRow('每月待遇', it.penMonthly || '—')
  h += infoRow('账户累计', it.penBalance || '—')
  h += '<div style="margin-top:12px;background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:10px 12px;font-size:11px;color:#1E7A54;line-height:1.6">🔒 以上信息仅本人可见。</div>'
  h += '</div>'
  openGovModal('🩺 医保养老详情', h)
}
function viewPlotLocation(no) { toast('「' + no + '」位置将在地图标注', 'info') }

function openVillageData(key) {
  if (key === 'policy') { showPolicyList(); return }
  const d = villageDataDetail[key]
  if (!d) return
  let h = '<div style="padding:6px 0">'
  h += pubHeader(d)
  h += pubMetrics(d.metrics || [])
  ;(d.rows || []).forEach(function(r) {
    const right = r.value + (r.action ? ' <span style="color:#22B573;font-size:14px;cursor:pointer" onclick="window._svc.openVillageSub(\'' + key + '\')">›</span>' : '')
    h += '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #F0F3F5"><span style="font-size:13px;color:#66788A">' + r.label + '</span><span style="font-size:14px;color:#1F2D3D;font-weight:600;text-align:right">' + right + '</span></div>'
  })
  if (d.directory) {
    h += secTitle('📂 公开目录')
    d.directory.forEach(function(it) {
      h += '<div onclick="window._svc.openFinanceCategory(\'' + it.label + '\')" style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F0F3F5;cursor:pointer"><span style="font-size:13px;color:#1F2D3D;font-weight:600">' + it.label + '</span><span style="font-size:13px;color:#22B573;font-weight:600">' + it.count + ' ›</span></div>'
    })
    h += secTitle('🕘 最近更新')
    d.recent.forEach(function(r) {
      h += '<div onclick="window._svc.openFinanceCategory(\'' + r.tag + '\')" style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #F0F3F5;cursor:pointer"><span style="flex-shrink:0;font-size:11px;color:#22B573;background:rgba(34,181,115,0.12);padding:3px 8px;border-radius:6px">' + r.tag + '</span><span style="flex:1;font-size:13px;color:#1F2D3D;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + r.title + '</span><span style="flex-shrink:0;font-size:11px;color:#8A97A5">' + r.date + '</span></div>'
    })
  }
  if (d.monitors) {
    h += '<div style="text-align:center;margin-top:14px"><button class="btn btn-primary" onclick="window._svc.openVillageSub(\'' + key + '\')">📍 查看 ' + d.monitors.length + ' 个监测点</button></div>'
  }
  h += pubFooter(d, (key === 'infra') ? 'window._svc.openVillageSub(\'infra\')' : null)
  h += '</div>'
  openGovModal(d.icon + ' ' + d.title, h)
}
function openVillageSub(key) {
  const d = villageDataDetail[key]
  if (!d) return
  if (d.monitors) renderMonitorPoints(d)
  else if (d.facilities) renderFacilities(d)
}
function renderMonitorPoints(d) {
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">本村共 ' + d.monitors.length + ' 个环境监测点</div>'
  d.monitors.forEach(function(m) {
    h += '<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fff;border:1px solid #E3EAF0;border-radius:8px;margin-bottom:8px"><span style="font-size:20px">📡</span><div style="flex:1"><div style="font-size:14px;font-weight:600;color:#1F2D3D">' + m.name + '</div><div style="font-size:12px;color:#66788A;margin-top:3px">📍 ' + m.loc + '</div></div><div style="text-align:right"><div style="font-size:12px;font-weight:600;color:#1F2D3D">' + m.value + '</div><div style="font-size:11px;color:#22B573;margin-top:3px">● ' + m.status + '</div></div></div>'
  })
  h += pubFooter(d)
  h += '</div>'
  openGovModal('🌱 环境监测点', h)
}
function renderFacilities(d) {
  let h = '<div style="padding:6px 0">'
  Object.keys(d.facilities).forEach(function(cat) {
    h += secTitle(cat)
    d.facilities[cat].forEach(function(f) {
      h += '<div style="background:#fff;border:1px solid #E3EAF0;border-radius:8px;padding:12px 14px;margin-bottom:8px"><div style="display:flex;align-items:center;justify-content:space-between"><span style="font-size:14px;font-weight:600;color:#1F2D3D">' + f.name + '</span><span style="font-size:11px;color:#22B573;cursor:pointer" onclick="window._svc.viewFacilityLocation(\'' + f.name + '\')">📍 地图</span></div><div style="font-size:12px;color:#66788A;margin-top:6px">' + f.detail + '</div><div style="font-size:11px;color:#8A97A5;margin-top:4px">📍 ' + f.loc + '</div></div>'
    })
  })
  h += pubFooter(d)
  h += '</div>'
  openGovModal('🏠 基础设施明细', h)
}
function viewFacilityLocation(name) { toast('「' + name + '」位置已在地图标注', 'info') }
function openFinanceCategory(label) {
  const d = villageDataDetail.finance
  const items = (d.detail && d.detail[label]) || []
  const dirItem = (d.directory || []).find(function(x) { return x.label === label })
  const count = dirItem ? dirItem.count : (items.length + ' 条')
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">' + label + '（' + count + '）</div>'
  if (items.length === 0) {
    h += '<div style="text-align:center;padding:30px 0;color:#66788A">该分类暂无明细</div>'
  } else {
    items.forEach(function(it) {
      h += '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:#fff;border:1px solid #E3EAF0;border-radius:8px;margin-bottom:8px"><span style="flex:1;font-size:13px;color:#1F2D3D;font-weight:600">' + it.title + '</span><span style="flex-shrink:0;font-size:11px;color:#8A97A5">' + it.date + '</span></div>'
    })
  }
  h += '<div style="text-align:center;font-size:12px;color:#8A97A5;margin-top:8px">具体内容可到村委会「村务公开栏」查阅</div>'
  h += '</div>'
  openGovModal('💰 ' + label, h)
}

// —— 惠农政策（公域数据）：后端 policy 表，公开可查、无需登录 ——
let _policyList = []
let _policyFilter = '全部'
async function loadPolicies() {
  _policyList = []
  try {
    const res = await listPolicies()
    if (res && res.code === 200 && Array.isArray(res.data)) _policyList = res.data
  } catch (e) { /* 后端未启动或网络异常时保持空列表 */ }
}
function policyCategories() {
  const cats = []
  ;(_policyList || []).forEach(function(p) { if (p.category && cats.indexOf(p.category) === -1) cats.push(p.category) })
  return cats
}
function renderPolicyList() {
  const list = (_policyFilter === '全部') ? _policyList : _policyList.filter(function(p) { return p.category === _policyFilter })
  let h = '<div style="padding:6px 0">'
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">'
  ;['全部'].concat(policyCategories()).forEach(function(c) {
    const on = _policyFilter === c
    h += '<span onclick="window._svc.setPolicyFilter(\'' + c + '\')" style="cursor:pointer;padding:6px 14px;border-radius:16px;font-size:12px;font-weight:' + (on ? '700' : '500') + ';background:' + (on ? 'rgba(34,181,115,0.12)' : '#F0F3F6') + ';color:' + (on ? '#22B573' : '#66788A') + ';border:1px solid ' + (on ? 'rgba(34,181,115,0.35)' : 'transparent') + '">' + c + '</span>'
  })
  h += '</div>'
  if (list.length === 0) {
    h += '<div style="text-align:center;padding:30px 0;color:#66788A">该分类暂无政策，请稍后重试或刷新</div>'
  } else {
    list.forEach(function(p) {
      h += '<div onclick="window._svc.showPolicyDetail(\'' + p.id + '\')" style="background:#fff;border:1px solid #E3EAF0;border-radius:10px;padding:14px;margin-bottom:10px;cursor:pointer;transition:border-color .2s" onmouseover="this.style.borderColor=\'#22B573\'" onmouseout="this.style.borderColor=\'#E3EAF0\'">'
      h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:11px;color:#22B573;background:rgba(34,181,115,0.10);border:1px solid rgba(34,181,115,0.20);border-radius:999px;padding:2px 10px;flex-shrink:0">' + (p.category || '') + '</span><span style="font-size:15px;font-weight:700;color:#1F2D3D;flex:1;line-height:1.4">' + p.title + '</span></div>'
      h += '<div style="font-size:12px;color:#66788A;line-height:1.6;margin-bottom:8px">' + (p.summary || '') + '</div>'
      h += '<div style="display:flex;align-items:center;justify-content:space-between;font-size:11px;color:#8A97A5"><span>🕘 ' + (p.publishDate || '') + '</span><span>' + (p.source || '') + '</span></div>'
      h += '</div>'
    })
  }
  h += '<div style="text-align:center;font-size:12px;color:#8A97A5;margin-top:8px">政策数据来源于政府公开渠道，供查阅参考</div>'
  h += '</div>'
  return h
}
async function showPolicyList() {
  openGovModal('📜 惠农政策', '<div style="padding:30px 0;text-align:center;color:#66788A">政策加载中…</div>')
  await loadPolicies()
  _policyFilter = '全部'
  openGovModal('📜 惠农政策', renderPolicyList())
}
function setPolicyFilter(c) {
  _policyFilter = c
  openGovModal('📜 惠农政策', renderPolicyList())
}
function showPolicyDetail(id) {
  const p = _policyList.find(function(x) { return String(x.id) === String(id) })
  if (!p) return
  let h = '<div style="padding:6px 0">'
  h += '<div style="text-align:center;padding:4px 0 14px 0"><div style="font-size:32px;margin-bottom:6px">📜</div>'
  h += '<div style="font-size:17px;font-weight:700;color:#1F2D3D;line-height:1.5">' + p.title + '</div>'
  h += '<div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin-top:10px">'
  h += '<span style="font-size:12px;color:#22B573;background:rgba(34,181,115,0.10);border:1px solid rgba(34,181,115,0.20);border-radius:999px;padding:3px 10px">' + (p.category || '') + '</span>'
  if (p.status) h += '<span style="font-size:12px;color:#66788A;background:#F0F3F6;border-radius:999px;padding:3px 10px">' + p.status + '</span>'
  h += '</div></div>'
  h += infoRow('发布机构', p.source || '—')
  h += infoRow('发布日期', p.publishDate || '—')
  h += secTitle('📋 政策内容')
  h += '<div style="font-size:13px;color:#1F2D3D;line-height:1.9;white-space:pre-wrap;background:#fff;border:1px solid #E3EAF0;border-radius:10px;padding:14px">' + (p.content || '') + '</div>'
  h += '<div style="text-align:center;margin-top:14px"><button class="btn btn-outline" onclick="window._svc.backToPolicyList()">← 返回政策列表</button></div>'
  h += '</div>'
  openGovModal('📜 ' + p.title, h)
}
function backToPolicyList() {
  openGovModal('📜 惠农政策', renderPolicyList())
}

function openVillageDataMore() {
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">本村公开数据查询目录（仅公开统计，不含个人隐私）</div>'
  Object.keys(villageDataDetail).forEach(function(k) {
    const d = villageDataDetail[k]
    h += '<div onclick="window._svc.openVillageData(\'' + k + '\')" style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fff;border:1px solid #E3EAF0;border-radius:8px;cursor:pointer;margin-bottom:8px"><span style="font-size:20px">' + d.icon + '</span><div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:600;color:#1F2D3D">' + d.title + '</div><div style="font-size:12px;color:#66788A">' + d.intro + '</div></div><span style="font-size:13px;color:#22B573;font-weight:600;flex-shrink:0">查看 ›</span></div>'
  })
  h += '<div style="text-align:center;font-size:12px;color:#8A97A5;margin-top:8px">更多公开数据将陆续接入</div>'
  h += '</div>'
  openGovModal('📂 本村公开数据', h)
}

function openDataAuth() {
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">平台保存了本人（' + currentUser.name + '）以下信息，用于对应服务</div>'
  dataAuthItems.forEach(function(a) {
    h += '<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fff;border:1px solid #E3EAF0;border-radius:8px;margin-bottom:10px"><span style="font-size:18px">🔐</span><div style="flex:1"><div style="font-size:14px;font-weight:600;color:#1F2D3D">' + a.field + '</div><div style="font-size:12px;color:#66788A;margin-top:2px">' + a.use + '</div></div></div>'
  })
  h += '<div style="display:flex;gap:8px;justify-content:center;margin-top:14px">'
  h += '<button class="btn btn-outline" onclick="window._svc.showDataUsage()">查看数据使用说明</button>'
  h += '<button class="btn btn-primary" onclick="window._svc.startDataCorrection()">数据有误？去纠错</button>'
  h += '</div></div>'
  openGovModal('🔐 我的数据与授权', h)
}
function showDataUsage() {
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;line-height:1.8;margin-bottom:8px">平台遵循「最小必要」原则收集和使用数据：</div>'
  const usages = [
    ['基本身份信息', '用于登录身份确认与基础服务，如办事通知、身份核验'],
    ['土地信息', '用于产业服务，如惠农补贴测算、农技指导'],
    ['联系方式', '用于办事进度通知、干部回复提醒'],
    ['办事记录', '用于查询本人上报、申请、留言的办理进度']
  ]
  usages.forEach(function(r) {
    h += '<div style="padding:8px 0;border-bottom:1px solid #F0F3F5"><div style="font-size:13px;font-weight:600;color:#1F2D3D">' + r[0] + '</div><div style="font-size:12px;color:#66788A;margin-top:2px">' + r[1] + '</div></div>'
  })
  h += '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px;margin-top:14px;font-size:12px;color:#1E7A54;line-height:1.7">您的个人信息仅用于本村平台服务，不会向无关第三方泄露；未经授权，其他村民无法查看您的个人数据。</div>'
  h += '</div>'
  openGovModal('📖 数据使用说明', h)
}

// ===== 数据纠错申请（选择错误数据 → 当前数据 → 正确信息 → 说明原因 → 上传证明 → 提交 → 村委审核 → 修改完成）=====
let _corrType = '', _corrCurrent = '', _corrCorrect = '', _corrReason = '', _corrPhotos = [], _corrSeq = 0
const corrTypes = ['基本身份信息', '家庭人口', '土地信息', '产业数据', '联系方式', '补贴/权益', '其他']
function startDataCorrection() { _corrType = ''; _corrCurrent = ''; _corrCorrect = ''; _corrReason = ''; _corrPhotos = []; renderCorrectionForm() }
function snapshotCorr() {
  const cur = document.getElementById('corr-current'); if (cur) _corrCurrent = cur.value
  const cor = document.getElementById('corr-correct'); if (cor) _corrCorrect = cor.value
  const rea = document.getElementById('corr-reason'); if (rea) _corrReason = rea.value
}
function setCorrType(t) { snapshotCorr(); _corrType = t; renderCorrectionForm() }
function renderCorrectionForm() {
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">发现本人数据有误，可在此提交纠错申请，村委审核后更新</div>'
  h += '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:8px">1. 选择错误数据</div>'
  h += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px">'
  corrTypes.forEach(function(t) {
    const on = _corrType === t
    h += '<span onclick="window._svc.setCorrType(\'' + t + '\')" style="cursor:pointer;padding:6px 14px;border-radius:16px;font-size:13px;font-weight:600;' + (on ? 'background:#22B573;color:#fff;' : 'background:#F0F3F6;color:#66788A;') + '">' + t + '</span>'
  })
  h += '</div>'
  h += '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:8px">2. 当前数据（平台里显示的信息）</div>'
  h += '<input id="corr-current" placeholder="例如：家庭人口显示 3 人" value="' + _corrCurrent + '" style="width:100%;box-sizing:border-box;border:1px solid #D0D8E2;border-radius:8px;padding:10px 12px;font-size:14px;font-family:inherit;color:#1F2D3D;margin-bottom:16px">'
  h += '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:8px">3. 正确信息</div>'
  h += '<input id="corr-correct" placeholder="例如：实际应为 4 人" value="' + _corrCorrect + '" style="width:100%;box-sizing:border-box;border:1px solid #D0D8E2;border-radius:8px;padding:10px 12px;font-size:14px;font-family:inherit;color:#1F2D3D;margin-bottom:16px">'
  h += '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:8px">4. 说明原因</div>'
  h += '<textarea id="corr-reason" placeholder="请简要说明为什么数据有误（选填）" style="width:100%;box-sizing:border-box;min-height:70px;border:1px solid #D0D8E2;border-radius:8px;padding:10px 12px;font-size:14px;font-family:inherit;color:#1F2D3D;resize:vertical;margin-bottom:16px">' + _corrReason + '</textarea>'
  h += '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:8px">5. 上传证明（选填，最多 3 张）</div>'
  h += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">'
  _corrPhotos.forEach(function(p, i) {
    h += '<div style="position:relative;width:60px;height:60px;border-radius:8px;overflow:hidden;border:1px solid #E3EAF0">' + (p.dataUrl ? '<img src="' + p.dataUrl + '" style="width:100%;height:100%;object-fit:cover">' : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:12px;color:#8A97A5">…</div>') + '<span onclick="window._svc.removeCorrPhoto(' + i + ')" style="position:absolute;top:0;right:0;width:18px;height:18px;background:rgba(0,0,0,.5);color:#fff;font-size:12px;line-height:18px;text-align:center;cursor:pointer">×</span></div>'
  })
  if (_corrPhotos.length < 3) {
    h += '<div onclick="window._svc.triggerCorrPhotoUpload()" style="width:60px;height:60px;border:1px dashed #C8D4E0;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:22px;color:#8A97A5;cursor:pointer">＋</div>'
  }
  h += '<input type="file" id="corr-photo-input" accept="image/*" style="display:none" onchange="window._svc.handleCorrPhotoSelected(event)">'
  h += '</div>'
  h += '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">'
  h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">取消</button>'
  h += '<button class="btn btn-primary" onclick="window._svc.submitCorrection()">提交申请</button>'
  h += '</div></div>'
  openGovModal('📝 数据纠错申请', h)
}
function triggerCorrPhotoUpload() { snapshotCorr(); document.getElementById('corr-photo-input').click() }
function handleCorrPhotoSelected(ev) {
  const file = ev.target.files && ev.target.files[0]
  if (!file) return
  if (_corrPhotos.length >= 3) { toast('最多上传 3 张证明', 'info'); return }
  const reader = new FileReader()
  reader.onload = function(e) { _corrPhotos.push({ name: file.name, dataUrl: e.target.result }); renderCorrectionForm() }
  reader.readAsDataURL(file)
  ev.target.value = ''
}
function removeCorrPhoto(i) { snapshotCorr(); _corrPhotos.splice(i, 1); renderCorrectionForm() }
function submitCorrection() {
  snapshotCorr()
  if (!_corrType) { toast('请选择数据类型', 'info'); return }
  if (!_corrCurrent.trim()) { toast('请填写当前数据', 'info'); return }
  if (!_corrCorrect.trim()) { toast('请填写正确信息', 'info'); return }
  const now = new Date()
  const ymd = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0')
  _corrSeq += 1
  const id = 'SJJC' + ymd + String(_corrSeq).padStart(3, '0')
  const rec = {
    id: id,
    village_id: 'zhongyan',
    farmer_id: currentUser.farmerId,
    farmer_name: currentUser.name,
    type: _corrType,
    current: _corrCurrent.trim(),
    correct: _corrCorrect.trim(),
    reason: _corrReason.trim(),
    desc: _corrCurrent.trim() + ' → ' + _corrCorrect.trim(),
    images: _corrPhotos.map(function(p) { return { name: p.name, dataUrl: p.dataUrl } }),
    status: '村委审核中',
    created_at: now.toISOString(),
    timeText: fmtMsgTime(now)
  }
  dataCorrections.value.unshift(rec)
  renderCorrectionSuccess(rec)
}
function renderCorrectionSuccess(rec) {
  let h = '<div style="text-align:center;padding:16px 0"><div style="font-size:48px;margin-bottom:12px">✅</div>'
  h += '<h4 style="color:#22B573;margin:0 0 16px 0;font-size:17px">纠错申请已提交</h4>'
  h += '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:14px;margin-bottom:16px;text-align:left">'
  h += '<div style="font-size:14px;color:#475867;line-height:2">纠错编号：<span style="color:#1F2D3D;font-weight:700">' + rec.id + '</span><br>'
  h += '数据类型：<span style="color:#1F2D3D;font-weight:700">' + rec.type + '</span><br>'
  h += '当前状态：<span style="color:#F2A62B;font-weight:700">村委审核中</span></div></div>'
  h += '<div style="font-size:13px;color:#66788A;text-align:center;margin-bottom:20px">提交后已自动进入「我的办事记录」，村委审核通过后会更新您的数据。</div>'
  h += '<div style="display:flex;gap:8px;justify-content:center">'
  h += '<button class="btn btn-primary" onclick="window._svc.showMyCorrections()">查看处理进度</button>'
  h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">完成</button>'
  h += '</div></div>'
  openGovModal('纠错申请已提交', h)
}
function showMyCorrections() {
  const list = dataCorrections.value
  let h = '<div style="padding:6px 0">'
  h += '<div style="font-size:12px;color:#66788A;margin-bottom:12px">本人（' + currentUser.name + '）提交的数据纠错记录</div>'
  if (list.length === 0) {
    h += '<div style="text-align:center;padding:40px 0;color:#66788A"><div style="font-size:36px;margin-bottom:10px">📝</div><div style="font-size:14px">暂无纠错记录</div><div style="font-size:12px;margin-top:4px">提交纠错申请后会显示在这里</div></div>'
  } else {
    list.forEach(function(r) {
      const c = r.status === '已更新' ? '#22B573' : (r.status === '已驳回' ? '#E05252' : '#F2A62B')
      h += '<div style="background:#fff;border:1px solid #E3EAF0;border-radius:8px;padding:12px 14px;margin-bottom:8px">'
      h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px"><span style="font-size:13px;font-weight:600;color:#1F2D3D">' + r.type + '</span><span style="flex-shrink:0;font-size:11px;color:' + c + ';background:' + c + '1A;padding:3px 10px;border-radius:10px;font-weight:600">' + r.status + '</span></div>'
      h += '<div style="font-size:12px;color:#66788A;line-height:1.7">' + (r.current || '') + ' <span style="color:#22B573">→</span> ' + (r.correct || '') + '</div>'
      h += '<div style="font-size:11px;color:#8A97A5;margin-top:6px">' + r.id + ' · ' + r.timeText + '</div>'
      h += '</div>'
    })
  }
  h += '</div>'
  openGovModal('📝 我的纠错记录', h)
}

// ===== 系统设置（管理员端后台配置中心）=====
const settingsView = ref('home')
// 进入「系统运行」时接入后端真实统计接口
watch(settingsView, v => { if (v === 'runtime') loadRuntimeStats() })

const settingsModules = [
  { key: 'users', label: '用户管理', icon: '👥', iconBg: 'rgba(14,165,233,.10)', desc: '账号、角色、权限、状态', tags: [{ text: '账号权限', cls: 'blue' }] },
  { key: 'bnb', label: '民宿管理', icon: '🏡', iconBg: 'rgba(57,217,138,0.12)', desc: '民宿上架、审核、经营状态', tags: [{ text: '文旅运营', cls: 'green' }] },
  { key: 'orders', label: '订单管理', icon: '📋', iconBg: 'rgba(14,165,233,.10)', desc: '民宿、门票、活动订单查询', tags: [{ text: '交易订单', cls: 'blue' }] },
  { key: 'audit', label: '审核中心', icon: '🔔', iconBg: '#FFF8E8', desc: '民宿、补贴、项目审核处理', tags: [{ text: '待办审批', cls: 'yellow' }] },
  { key: 'modules', label: '模块配置', icon: '🧩', iconBg: 'rgba(57,217,138,0.12)', desc: '控制平台哪些业务模块启用', tags: [{ text: '模块开关', cls: 'green' }] },
  { key: 'notify', label: '通知设置', icon: '🔔', iconBg: '#FFF8E8', desc: '通知渠道、通知规则、接收对象', tags: [{ text: '消息推送', cls: 'yellow' }] },
  { key: 'logs', label: '操作日志', icon: '📋', iconBg: 'rgba(139,92,246,.12)', desc: '审计、操作记录、数据变更记录', tags: [{ text: '审计查询', cls: 'blue' }] },
  { key: 'security', label: '安全设置', icon: '🔐', iconBg: '#FDE8E8', desc: '登录安全、密码策略、访问控制', tags: [{ text: '安全策略', cls: 'red' }] },
  { key: 'backup', label: '数据备份', icon: '💾', iconBg: 'rgba(14,165,233,.10)', desc: '自动备份、手动备份、恢复记录', tags: [{ text: '运维备份', cls: 'blue' }] },
  { key: 'runtime', label: '系统运行', icon: '🗄️', iconBg: 'rgba(139,92,246,.12)', desc: '数据总量、数据资产、接口调用', tags: [{ text: '技术架构', cls: 'blue' }] }
]
const visibleAdminModules = computed(() => settingsModules.filter(m => (roleAdminModules[currentUser.role] || []).includes(m.key)))

// 后台操作时间戳（MM-DD HH:mm，与操作日志格式一致）
function nowStamp() {
  const n = new Date()
  const p = function (x) { return String(x).padStart(2, '0') }
  return p(n.getMonth() + 1) + '-' + p(n.getDate()) + ' ' + p(n.getHours()) + ':' + p(n.getMinutes())
}

// —— 民宿管理（由原 /admin 管理后台迁入系统管理）——
const settingsBnbs = reactive([
  { id: 1, name: '半日闲舍', owner: '村集体', rooms: 6, price: 288, rating: 4.9, bookings: 520, revenue: '¥8.5万', status: '营业中', since: '2023-06' },
  { id: 2, name: '凤鸣锦舍', owner: '村集体', rooms: 5, price: 358, rating: 4.8, bookings: 380, revenue: '¥6.8万', status: '营业中', since: '2024-03' },
  { id: 3, name: '云栖小筑', owner: '村民自营', rooms: 4, price: 268, rating: 4.6, bookings: 210, revenue: '¥3.2万', status: '审核中', since: '2026-07' }
])
const bnbStatusCls = computed(() => ({ '营业中': 'online', '审核中': 'warning', '已下架': 'offline' }))
function approveBnb(id) {
  const b = settingsBnbs.find(x => x.id === id)
  if (!b) return
  b.status = '营业中'
  settingsLogs.unshift({ time: nowStamp(), operator: currentUser.name, role: currentUser.role, module: '民宿管理', content: '审核通过民宿「' + b.name + '」', result: '成功', ip: '后台终端', type: '操作日志' })
  toast('已通过：' + b.name, 'success')
}
function offlineBnb(id) {
  const b = settingsBnbs.find(x => x.id === id)
  if (!b) return
  b.status = '已下架'
  settingsLogs.unshift({ time: nowStamp(), operator: currentUser.name, role: currentUser.role, module: '民宿管理', content: '下架民宿「' + b.name + '」', result: '成功', ip: '后台终端', type: '操作日志' })
  toast('已下架：' + b.name, 'info')
}
function relistBnb(id) {
  const b = settingsBnbs.find(x => x.id === id)
  if (!b) return
  b.status = '营业中'
  settingsLogs.unshift({ time: nowStamp(), operator: currentUser.name, role: currentUser.role, module: '民宿管理', content: '重新上架民宿「' + b.name + '」', result: '成功', ip: '后台终端', type: '操作日志' })
  toast('已重新上架：' + b.name, 'success')
}

// —— 订单管理 ——
const settingsOrders = reactive([
  { id: 'BNB0701', type: '民宿', item: '半日闲舍·标准间', buyer: '张女士', amt: 576, status: '已支付', date: '2026-07-01' },
  { id: 'TK002', type: '门票', item: '灯光音乐节×2', buyer: '李先生', amt: 60, status: '已支付', date: '2026-07-14' },
  { id: 'ACT001', type: '活动', item: '垂钓大赛报名', buyer: '赵大哥', amt: 40, status: '已支付', date: '2026-06-18' },
  { id: 'BNB0702', type: '民宿', item: '凤鸣锦舍·景观房', buyer: '王女士', amt: 716, status: '待支付', date: '2026-07-02' },
  { id: 'SUB001', type: '补贴', item: '耕地地力保护补贴', buyer: '肖子微', amt: 1200, status: '审核中', date: '2026-06-10' }
])
const settingsOrderTotal = computed(() => settingsOrders.reduce((s, o) => s + o.amt, 0))
const orderStatusCls = computed(() => ({ '已支付': 'online', '待支付': 'warning', '审核中': 'info', '已退款': 'offline' }))

// —— 订单管理：退款 / 导出 ——
function csvCell(v) {
  v = String(v)
  return (v.includes(',') || v.includes('"') || v.includes('\n')) ? '"' + v.replace(/"/g, '""') + '"' : v
}
function exportOrders() {
  const header = ['订单号', '类型', '项目', '买家', '金额', '日期', '状态']
  const lines = [header.join(',')]
  settingsOrders.forEach(function (o) {
    lines.push([o.id, o.type, o.item, o.buyer, o.amt, o.date, o.status].map(csvCell).join(','))
  })
  const csv = '﻿' + lines.join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '中堰村订单报表.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  settingsLogs.unshift({ time: nowStamp(), operator: currentUser.name, role: currentUser.role, module: '订单管理', content: '导出订单报表（' + settingsOrders.length + ' 条）', result: '成功', ip: '后台终端', type: '操作日志' })
  toast('订单报表已导出', 'success')
}
function refundOrder(id) {
  const o = settingsOrders.find(x => x.id === id)
  if (!o || o.status !== '已支付') return
  const c = '<div class="detail-section"><h4>退款确认</h4>'
    + '<div class="detail-field"><span class="df-lbl">订单号</span><span class="df-val">' + o.id + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">项目</span><span class="df-val">' + o.item + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">买家</span><span class="df-val">' + o.buyer + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">金额</span><span class="df-val">¥' + o.amt.toLocaleString() + '</span></div>'
    + '</div>'
    + '<div style="background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:12px;margin-bottom:10px;font-size:12px;color:#f0b9b5;line-height:1.6">⚠️ 退款将原路退回至买家账户，且不可撤销。请确认后执行。</div>'
    + '<div class="detail-actions"><button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">取消</button><button class="btn btn-primary" style="background:linear-gradient(135deg,#E74C3C,#c0392b)" onclick="window._svc.confirmRefund(\'' + o.id + '\')">确认退款</button></div>'
  openModal('订单退款 · 二次确认', c)
}
function confirmRefund(id) {
  const o = settingsOrders.find(x => x.id === id)
  if (!o) return
  o.status = '已退款'
  settingsLogs.unshift({ time: nowStamp(), operator: currentUser.name, role: currentUser.role, module: '订单管理', content: '退款订单「' + o.id + '」¥' + o.amt.toLocaleString(), result: '成功', ip: '后台终端', type: '操作日志' })
  closeModal()
  toast('已退款：' + o.id, 'success')
}

// —— 审核中心 ——
const settingsAudits = reactive([
  { id: 1, type: '民宿审核', item: '云栖小筑', applicant: '村民自营', date: '2026-07-15', status: '待审核', amount: '¥268/晚 · 4间', desc: '村民自营民宿上架申请，含4间客房，已提交营业执照与卫生许可材料。', reason: '' },
  { id: 2, type: '补贴审核', item: '耕地地力保护补贴', applicant: '肖子微', date: '2026-06-10', status: '待审核', amount: '¥1,200', desc: '耕地地力保护补贴申报，涉及3.2亩耕地，材料齐全待村委核实。', reason: '' },
  { id: 3, type: '项目审核', item: '智慧市集运营方案', applicant: '村集体', date: '2026-07-01', status: '待审核', amount: '预算 ¥15万', desc: '智慧市集运营方案立项申请，含预算、选址及年度运营计划。', reason: '' },
  { id: 4, type: '民宿审核', item: '凤鸣锦舍', applicant: '村集体', date: '2026-06-20', status: '已通过', amount: '¥358/晚 · 5间', desc: '村集体民宿上架申请，已审核通过并纳入文旅运营。', reason: '' }
])
const auditStatusCls = computed(() => ({ '待审核': 'warning', '已通过': 'online', '已驳回': 'offline' }))
const auditSelected = ref([])
const pendingAudits = computed(() => settingsAudits.filter(a => a.status === '待审核'))
const allSelected = computed(() => pendingAudits.value.length > 0 && auditSelected.value.length === pendingAudits.value.length)
function toggleAuditSelect(id) {
  const i = auditSelected.value.indexOf(id)
  if (i >= 0) auditSelected.value.splice(i, 1)
  else auditSelected.value.push(id)
}
function toggleAuditSelectAll() {
  if (allSelected.value) auditSelected.value = []
  else auditSelected.value = pendingAudits.value.map(a => a.id)
}
function approveAudit(id) {
  const a = settingsAudits.find(x => x.id === id)
  if (!a) return
  a.status = '已通过'
  settingsLogs.unshift({ time: nowStamp(), operator: currentUser.name, role: currentUser.role, module: '审核中心', content: '审核通过：' + a.item, result: '成功', ip: '后台终端', type: '操作日志' })
  toast('已通过：' + a.item, 'success')
}
function batchApproveAudits() {
  const sel = auditSelected.value.filter(id => settingsAudits.some(a => a.id === id && a.status === '待审核'))
  if (!sel.length) { toast('请先勾选待审核事项', 'info'); return }
  settingsAudits.forEach(function (a) { if (sel.includes(a.id)) a.status = '已通过' })
  settingsLogs.unshift({ time: nowStamp(), operator: currentUser.name, role: currentUser.role, module: '审核中心', content: '批量通过 ' + sel.length + ' 项审核', result: '成功', ip: '后台终端', type: '操作日志' })
  auditSelected.value = []
  toast('已批量通过 ' + sel.length + ' 项', 'success')
}
function showAuditDetail(a) {
  const reasonRow = (a.status === '已驳回' && a.reason) ? '<div class="detail-field"><span class="df-lbl">驳回理由</span><span class="df-val">' + a.reason + '</span></div>' : ''
  const c = '<div class="detail-section"><h4>审核详情</h4>'
    + '<div class="detail-field"><span class="df-lbl">类型</span><span class="df-val">' + a.type + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">项目</span><span class="df-val">' + a.item + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">申请人</span><span class="df-val">' + a.applicant + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">金额 / 规模</span><span class="df-val">' + a.amount + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">申请日期</span><span class="df-val">' + a.date + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">状态</span><span class="df-val">' + a.status + '</span></div>'
    + reasonRow
    + '</div>'
    + '<div class="detail-section"><h4>申请说明</h4><p style="font-size:11px;color:#6F91A8;line-height:1.7;margin:0">' + (a.desc || '—') + '</p></div>'
    + '<div class="detail-actions"><button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">关闭</button></div>'
  openModal('审核详情 · ' + a.item, c)
}
function rejectAudit(id) {
  const a = settingsAudits.find(x => x.id === id)
  if (!a) return
  const h = '<div style="padding:6px 0">'
    + '<div style="font-size:12px;color:#66788A;margin-bottom:14px">驳回「' + a.item + '」· 请填写驳回理由</div>'
    + '<textarea id="reject-reason" placeholder="请输入驳回理由（选填）" style="width:100%;box-sizing:border-box;min-height:80px;border:1px solid #D0D8E2;border-radius:8px;padding:10px 12px;font-size:14px;font-family:inherit;color:#1F2D3D;resize:vertical;margin-bottom:14px"></textarea>'
    + '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">'
    + '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">取消</button>'
    + '<button class="btn btn-primary" style="background:linear-gradient(135deg,#E74C3C,#c0392b)" onclick="window._svc.confirmRejectAudit(' + id + ')">确认驳回</button>'
    + '</div></div>'
  openGovModal('驳回 · ' + a.item, h)
}
function confirmRejectAudit(id) {
  const a = settingsAudits.find(x => x.id === id)
  if (!a) return
  const el = document.getElementById('reject-reason')
  const reason = (el ? el.value : '').trim()
  a.status = '已驳回'
  a.reason = reason || '未填写理由'
  settingsLogs.unshift({ time: nowStamp(), operator: currentUser.name, role: currentUser.role, module: '审核中心', content: '驳回：' + a.item + (reason ? '（' + reason + '）' : ''), result: '成功', ip: '后台终端', type: '操作日志' })
  closeModal()
  toast('已驳回：' + a.item, 'info')
}

// —— 村民端「个人设置」——
const profileModules = [
  { label: '账号与资料', icon: '👤', iconBg: 'rgba(14,165,233,.10)', desc: '查看个人资料、家庭关联信息', tags: [{ text: '个人资料', cls: 'blue' }] },
  { label: '消息通知', icon: '🔔', iconBg: '#FFF8E8', desc: '管理各类消息接收设置', tags: [{ text: '通知开关', cls: 'yellow' }] },
  { label: '账号安全', icon: '🔐', iconBg: '#FDE8E8', desc: '修改密码、手机号与安全提醒', tags: [{ text: '账号安全', cls: 'red' }] },
  { label: '隐私与授权', icon: '🛡️', iconBg: 'rgba(139,92,246,.12)', desc: '查看个人信息使用与授权情况', tags: [{ text: '隐私', cls: 'blue' }] },
  { label: '登录与设备', icon: '📱', iconBg: 'rgba(57,217,138,0.12)', desc: '查看和管理已登录设备', tags: [{ text: '设备管理', cls: 'green' }] },
  { label: '帮助与反馈', icon: '❓', iconBg: 'rgba(14,165,233,.10)', desc: '使用帮助、问题反馈与处理进度', tags: [{ text: '帮助', cls: 'yellow' }] }
]
const profileNotif = reactive({ announcement: true, progress: true, agriWarn: true, deviceWarn: true, ecoWarn: false, activity: false, security: true })
const profileSecurity = reactive({ abnormalAlert: true })
const privacyOverview = [
  { item: '姓名 / 手机号 / 身份证', business: '身份认证、办事登记' },
  { item: '土地 / 产业数据', business: '农业服务、补贴发放' },
  { item: '办事 / 留言记录', business: '数字治理、村委班子' },
  { item: '设备 / 环境数据', business: '生态治理、设备中心' }
]
const privacyPrefs = [
  { item: '手机号展示', value: '脱敏' },
  { item: '身份证展示', value: '脱敏' },
  { item: '家庭信息', value: '仅本人可见' }
]
const loginDevices = ref([
  { device: '华为 P60 · 微信小程序', location: '陕西 · 中堰村', time: '08-15 19:26', current: true },
  { device: '小米 14 · APP', location: '陕西 · 中堰村', time: '08-12 08:40', current: false },
  { device: '网页端 · Chrome', location: '陕西 · 中堰村', time: '08-10 14:05', current: false }
])
const helpTopics = [
  { q: '如何查看我的补贴到账？', a: '前往「数据中心 → 补贴与权益」查看本人补贴记录与到账状态。' },
  { q: '办事提交后怎么查进度？', a: '前往「数字服务中心」或「数据中心 → 办事记录」查看办理进度。' },
  { q: '资料有误怎么改？', a: '在「数据中心」提交数据纠错申请，村委会核实后更新。' },
  { q: '有问题找谁？', a: '可到「村委班子」查看干部通讯录并留言咨询。' }
]
// 个人设置交互：通知全部开关 / 设备退出 / 反馈闭环
function setAllNotifications(on) {
  ;['announcement', 'progress', 'agriWarn', 'deviceWarn', 'ecoWarn', 'activity'].forEach(function (k) { profileNotif[k] = on })
}
function logoutDevice(d) {
  loginDevices.value = loginDevices.value.filter(function (x) { return x !== d })
  toast('已退出该设备', 'success')
}
function logoutOtherDevices() {
  loginDevices.value = loginDevices.value.filter(function (x) { return x.current })
  toast('已退出全部其他设备', 'success')
}
const feedbackTypes = ['功能异常', '数据有误', '办事问题', '使用建议', '其他']
const feedbackForm = reactive({ type: '功能异常', desc: '', contact: currentUser.phone })
const myFeedbacks = ref([
  { id: 'FK20260730001', type: '使用建议', desc: '希望在公告里增加语音播报，方便不识字的长辈。', status: '已回复', time: '2026-07-30 14:05', reply: '建议已收到，正在评估上线。' },
  { id: 'FK20260812001', type: '数据有误', desc: '我的补贴金额显示有误，请核实。', status: '已解决', time: '2026-08-12 10:20', reply: '已核实并更正，感谢反馈。' }
])
let feedbackSeq = 0
function feedbackStatusCls(s) {
  const m = { '待处理': 'warning', '处理中': 'info', '已回复': 'info', '已解决': 'online' }
  return m[s] || 'warning'
}
function openFeedbackForm() { feedbackForm.desc = ''; feedbackForm.type = '功能异常'; settingsView.value = 'feedback' }
function openMyFeedback() { settingsView.value = 'myfeedback' }
function backToHelp() { settingsView.value = 'help' }
function submitFeedback() {
  const desc = feedbackForm.desc.trim()
  if (!desc) { toast('请先填写问题描述', 'info'); return }
  const now = new Date()
  const p2 = function (n) { return String(n).padStart(2, '0') }
  feedbackSeq += 1
  const id = 'FK' + now.getFullYear() + p2(now.getMonth() + 1) + p2(now.getDate()) + String(feedbackSeq).padStart(3, '0')
  myFeedbacks.value.unshift({
    id: id,
    type: feedbackForm.type,
    desc: desc,
    status: '待处理',
    time: now.getFullYear() + '-' + p2(now.getMonth() + 1) + '-' + p2(now.getDate()) + ' ' + p2(now.getHours()) + ':' + p2(now.getMinutes()),
    reply: ''
  })
  feedbackForm.desc = ''
  toast('反馈已提交，编号 ' + id, 'success')
  settingsView.value = 'myfeedback'
}

// —— 用户管理 ——
const settingsUsers = reactive([
  { name: '邓超', phone: '138****1234', area: '中堰村', role: '书记', status: '正常', lastLogin: '08-15 21:03', idCard: '6101**********1234', region: '全村', since: '2020-03-01' },
  { name: '黄尊海', phone: '139****5678', area: '中堰村', role: '副书记', status: '正常', lastLogin: '08-15 20:41', idCard: '6101**********5678', region: '全村', since: '2020-06-15' },
  { name: '王友德', phone: '137****2468', area: '中堰村·1组', role: '村民', status: '正常', lastLogin: '08-15 19:26', idCard: '6101**********2468', region: '1组', since: '2022-01-10' },
  { name: '李秀兰', phone: '136****8899', area: '中堰村·2组', role: '网格员', status: '正常', lastLogin: '08-15 18:52', idCard: '6101**********8899', region: '2组', since: '2021-04-01' },
  { name: '赵建国', phone: '135****3344', area: '中堰村·3组', role: '村民', status: '正常', lastLogin: '08-14 16:10', idCard: '6101**********3344', region: '3组', since: '2022-03-20' },
  { name: '设备管理员', phone: '—', area: '中堰村', role: '设备管理员', status: '正常', lastLogin: '08-15 20:30', idCard: '—', region: '全村设备', since: '2021-09-01' },
  { name: '陈晓', phone: '134****7788', area: '中堰村·1组', role: '村民', status: '停用', lastLogin: '07-30 09:12', idCard: '6101**********7788', region: '1组', since: '2022-06-01' },
  { name: '乡镇管理员', phone: '—', area: '乡镇', role: '管理员', status: '正常', lastLogin: '08-15 22:00', idCard: '—', region: '全镇', since: '2019-12-01' }
])
const userSearch = ref('')
const userRoleFilter = ref('全部')
const userStatusFilter = ref('全部')
const userRoles = ['全部', '书记', '副书记', '网格员', '村民', '设备管理员', '管理员']
const userStatuses = ['全部', '正常', '停用']
const filteredSettingsUsers = computed(() => {
  const kw = userSearch.value.trim()
  return settingsUsers.filter(u => {
    const mKw = !kw || u.name.includes(kw) || u.phone.includes(kw) || u.area.includes(kw)
    const mRole = userRoleFilter.value === '全部' || u.role === userRoleFilter.value
    const mStatus = userStatusFilter.value === '全部' || u.status === userStatusFilter.value
    return mKw && mRole && mStatus
  })
})
function showUserDetail(u) {
  const c = '<div style="padding:4px 0">'
    + '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">'
    + '<div style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#39D98A,#28C76F);display:flex;align-items:center;justify-content:center;font-size:22px;color:#fff">' + u.name.charAt(0) + '</div>'
    + '<div><div style="font-size:17px;font-weight:700;color:#fff">' + u.name + '</div><div style="font-size:12px;color:#6F91A8;margin-top:2px">' + u.role + ' · ' + u.area + '</div></div>'
    + '</div>'
    + '<div class="detail-section"><h4>基本资料</h4>'
    + '<div class="detail-field"><span class="df-lbl">手机号</span><span class="df-val">' + u.phone + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">身份证</span><span class="df-val">' + u.idCard + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">所属区域</span><span class="df-val">' + u.area + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">负责区域</span><span class="df-val">' + u.region + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">注册 / 任职时间</span><span class="df-val">' + u.since + '</span></div>'
    + '</div>'
    + '<div class="detail-section"><h4>账号与权限</h4>'
    + '<div class="detail-field"><span class="df-lbl">角色</span><span class="df-val">' + u.role + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">账号状态</span><span class="df-val">' + u.status + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">最近登录</span><span class="df-val">' + u.lastLogin + '</span></div>'
    + '</div>'
    + '<div class="detail-actions">'
    + '<button class="btn btn-primary" onclick="window._svc.editUserRole(\'' + u.name + '\')">编辑权限</button>'
    + '<button class="btn btn-outline" onclick="window._svc.toggleUserStatus(\'' + u.name + '\')">' + (u.status === '正常' ? '停用账号' : '启用账号') + '</button>'
    + '</div></div>'
  openModal('用户详情 · ' + u.name, c)
}

// —— 用户管理：新增 / 编辑权限 / 启用停用 ——
function openAddUser() {
  const roleOpts = ['村民', '村干部', '网格员', '设备管理员', '管理员'].map(function (r) { return '<option value="' + r + '">' + r + '</option>' }).join('')
  const h = '<div style="padding:6px 0">'
    + '<div style="font-size:12px;color:#66788A;margin-bottom:14px">为平台新增账号，分配角色与所属区域</div>'
    + '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:8px">姓名</div>'
    + '<input id="nu-name" placeholder="请输入姓名" style="width:100%;box-sizing:border-box;border:1px solid #D0D8E2;border-radius:8px;padding:10px 12px;font-size:14px;font-family:inherit;color:#1F2D3D;margin-bottom:14px">'
    + '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:8px">手机号</div>'
    + '<input id="nu-phone" placeholder="请输入手机号" style="width:100%;box-sizing:border-box;border:1px solid #D0D8E2;border-radius:8px;padding:10px 12px;font-size:14px;font-family:inherit;color:#1F2D3D;margin-bottom:14px">'
    + '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:8px">角色</div>'
    + '<select id="nu-role" style="width:100%;box-sizing:border-box;border:1px solid #D0D8E2;border-radius:8px;padding:10px 12px;font-size:14px;font-family:inherit;color:#1F2D3D;background:#fff;margin-bottom:14px">' + roleOpts + '</select>'
    + '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:8px">所属区域</div>'
    + '<input id="nu-area" placeholder="如：中堰村·1组" style="width:100%;box-sizing:border-box;border:1px solid #D0D8E2;border-radius:8px;padding:10px 12px;font-size:14px;font-family:inherit;color:#1F2D3D;margin-bottom:14px">'
    + '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:8px">账号状态</div>'
    + '<select id="nu-status" style="width:100%;box-sizing:border-box;border:1px solid #D0D8E2;border-radius:8px;padding:10px 12px;font-size:14px;font-family:inherit;color:#1F2D3D;background:#fff;margin-bottom:14px"><option value="正常">正常</option><option value="停用">停用</option></select>'
    + '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">'
    + '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">取消</button>'
    + '<button class="btn btn-primary" onclick="window._svc.submitNewUser()">保存</button>'
    + '</div></div>'
  openGovModal('＋ 新增用户', h)
}
function submitNewUser() {
  const nameEl = document.getElementById('nu-name'); const name = (nameEl ? nameEl.value : '').trim()
  const phoneEl = document.getElementById('nu-phone'); const phone = (phoneEl ? phoneEl.value : '').trim()
  const roleEl = document.getElementById('nu-role'); const role = roleEl ? roleEl.value : '村民'
  const areaEl = document.getElementById('nu-area'); const area = ((areaEl ? areaEl.value : '').trim()) || '中堰村'
  const statusEl = document.getElementById('nu-status'); const status = statusEl ? statusEl.value : '正常'
  if (!name) { toast('请输入姓名', 'info'); return }
  if (!phone) { toast('请输入手机号', 'info'); return }
  if (settingsUsers.some(function (u) { return u.name === name })) { toast('该姓名已存在', 'info'); return }
  const n = new Date()
  const p2 = function (x) { return String(x).padStart(2, '0') }
  settingsUsers.push({ name: name, phone: phone, area: area, role: role, status: status, lastLogin: '—', idCard: '—', region: area, since: n.getFullYear() + '-' + p2(n.getMonth() + 1) + '-' + p2(n.getDate()) })
  settingsLogs.unshift({ time: nowStamp(), operator: currentUser.name, role: currentUser.role, module: '用户管理', content: '新增用户「' + name + '」', result: '成功', ip: '后台终端', type: '操作日志' })
  closeModal()
  toast('已新增用户：' + name, 'success')
}
function editUserRole(name) {
  const u = settingsUsers.find(function (x) { return x.name === name })
  if (!u) return
  const roleOpts = ['村民', '村干部', '网格员', '设备管理员', '管理员'].map(function (r) { return '<option value="' + r + '"' + (u.role === r ? ' selected' : '') + '>' + r + '</option>' }).join('')
  const h = '<div style="padding:6px 0">'
    + '<div style="font-size:12px;color:#66788A;margin-bottom:14px">调整「' + u.name + '」的角色权限</div>'
    + '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:8px">角色</div>'
    + '<select id="ur-role" style="width:100%;box-sizing:border-box;border:1px solid #D0D8E2;border-radius:8px;padding:10px 12px;font-size:14px;font-family:inherit;color:#1F2D3D;background:#fff;margin-bottom:14px">' + roleOpts + '</select>'
    + '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">'
    + '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">取消</button>'
    + '<button class="btn btn-primary" onclick="window._svc.submitUserRole(\'' + name + '\')">保存</button>'
    + '</div></div>'
  openGovModal('编辑权限 · ' + name, h)
}
function submitUserRole(name) {
  const u = settingsUsers.find(function (x) { return x.name === name })
  if (!u) return
  const el = document.getElementById('ur-role')
  const role = el ? el.value : u.role
  const old = u.role
  u.role = role
  settingsLogs.unshift({ time: nowStamp(), operator: currentUser.name, role: currentUser.role, module: '用户管理', content: '修改「' + name + '」角色：' + old + ' → ' + role, result: '成功', ip: '后台终端', type: '操作日志' })
  closeModal()
  toast('已更新「' + name + '」角色为 ' + role, 'success')
}
function toggleUserStatus(name) {
  const u = settingsUsers.find(function (x) { return x.name === name })
  if (!u) return
  const next = u.status === '正常' ? '停用' : '正常'
  u.status = next
  settingsLogs.unshift({ time: nowStamp(), operator: currentUser.name, role: currentUser.role, module: '用户管理', content: (next === '停用' ? '停用账号' : '启用账号') + '「' + name + '」', result: '成功', ip: '后台终端', type: '操作日志' })
  closeModal()
  toast((next === '停用' ? '已停用' : '已启用') + '：' + name, next === '停用' ? 'info' : 'success')
}

// —— 模块配置 ——
const moduleConfigs = reactive([
  { name: '智慧农业', desc: '农业生产、农情监测、农技服务', enabled: true, configurable: true, roles: { villager: true, cadre: true, admin: true } },
  { name: '农产品电商', desc: '农产品展示、供需信息、电商服务', enabled: true, configurable: true, roles: { villager: true, cadre: true, admin: true } },
  { name: '乡村文旅', desc: '村庄介绍、乡村旅游、特色资源', enabled: false, configurable: true, roles: { villager: true, cadre: true, admin: false } },
  { name: '养老监测', desc: '老人健康监测、异常告警、关爱服务', enabled: false, configurable: false, roles: { villager: false, cadre: true, admin: true }, tag: '建设中' },
  { name: '碳汇管理', desc: '碳汇核算、交易登记、生态补偿', enabled: false, configurable: false, roles: { villager: false, cadre: false, admin: true }, tag: '规划中' }
])
function toggleModuleConfig(m) { if (m.configurable) m.enabled = !m.enabled }
function toggleModuleRole(m, r) { if (m.configurable) m.roles[r] = !m.roles[r] }

// —— 通知设置 ——
const channelList = [
  { key: 'sms', icon: '📱', name: '短信' },
  { key: 'app', icon: '📲', name: 'APP 推送' },
  { key: 'wechat', icon: '💬', name: '微信' },
  { key: 'phone', icon: '☎️', name: '电话' }
]
const notifyChannels = reactive({ sms: true, app: true, wechat: true, phone: false })
const notifyRules = reactive([
  { id: 1, event: '病虫害预警', channels: ['APP', '短信'], targets: '农户 / 村干部' },
  { id: 2, event: '设备异常', channels: ['APP'], targets: '设备管理员' },
  { id: 3, event: '治理事件超时', channels: ['APP', '短信'], targets: '网格员 / 村干部' },
  { id: 4, event: '重要公告', channels: ['APP', '微信'], targets: '全体村民' }
])
const notifyChannelOptions = ['APP', '短信', '微信', '电话']
const notifyRuleForm = reactive({ id: null, event: '', channels: [], targets: '' })
function openNotifyRuleForm(rule) {
  if (rule) {
    notifyRuleForm.id = rule.id
    notifyRuleForm.event = rule.event
    notifyRuleForm.channels = rule.channels.slice()
    notifyRuleForm.targets = rule.targets
  } else {
    notifyRuleForm.id = null
    notifyRuleForm.event = ''
    notifyRuleForm.channels = []
    notifyRuleForm.targets = ''
  }
  renderNotifyRuleForm()
}
function toggleNotifyRuleChannel(ch) {
  const i = notifyRuleForm.channels.indexOf(ch)
  if (i >= 0) notifyRuleForm.channels.splice(i, 1)
  else notifyRuleForm.channels.push(ch)
}
function renderNotifyRuleForm() {
  const chk = notifyChannelOptions.map(function (ch) {
    const on = notifyRuleForm.channels.includes(ch)
    return '<label style="display:inline-flex;align-items:center;gap:6px;margin-right:16px;font-size:13px;color:#1F2D3D;cursor:pointer"><input type="checkbox" ' + (on ? 'checked' : '') + ' onclick="window._svc.toggleNotifyRuleChannel(\'' + ch + '\')" style="accent-color:#22B573" />' + ch + '</label>'
  }).join('')
  const h = '<div style="padding:6px 0">'
    + '<div style="font-size:12px;color:#66788A;margin-bottom:14px">' + (notifyRuleForm.id ? '编辑通知规则' : '新增通知规则') + '</div>'
    + '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:8px">通知事件</div>'
    + '<input id="nrule-event" placeholder="例如：病虫害预警" value="' + notifyRuleForm.event + '" style="width:100%;box-sizing:border-box;border:1px solid #D0D8E2;border-radius:8px;padding:10px 12px;font-size:14px;font-family:inherit;color:#1F2D3D;margin-bottom:14px">'
    + '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:8px">通知渠道</div>'
    + '<div style="margin-bottom:14px">' + chk + '</div>'
    + '<div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:8px">接收对象</div>'
    + '<input id="nrule-targets" placeholder="例如：农户 / 村干部" value="' + notifyRuleForm.targets + '" style="width:100%;box-sizing:border-box;border:1px solid #D0D8E2;border-radius:8px;padding:10px 12px;font-size:14px;font-family:inherit;color:#1F2D3D;margin-bottom:14px">'
    + '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">'
    + '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">取消</button>'
    + '<button class="btn btn-primary" onclick="window._svc.submitNotifyRule()">保存</button>'
    + '</div></div>'
  openGovModal((notifyRuleForm.id ? '编辑规则' : '新增规则'), h)
}
function submitNotifyRule() {
  const evEl = document.getElementById('nrule-event'); const event = (evEl ? evEl.value : '').trim()
  const tgEl = document.getElementById('nrule-targets'); const targets = (tgEl ? tgEl.value : '').trim()
  if (!event) { toast('请输入通知事件', 'info'); return }
  if (!notifyRuleForm.channels.length) { toast('请至少选择一种通知渠道', 'info'); return }
  if (!targets) { toast('请输入接收对象', 'info'); return }
  if (notifyRuleForm.id) {
    const r = notifyRules.find(x => x.id === notifyRuleForm.id)
    if (r) {
      r.event = event
      r.channels = notifyRuleForm.channels.slice()
      r.targets = targets
      settingsLogs.unshift({ time: nowStamp(), operator: currentUser.name, role: currentUser.role, module: '通知设置', content: '修改通知规则：' + event, result: '成功', ip: '后台终端', type: '操作日志' })
      toast('规则已更新：' + event, 'success')
    }
  } else {
    const id = notifyRules.length ? Math.max.apply(null, notifyRules.map(r => r.id)) + 1 : 1
    notifyRules.push({ id: id, event: event, channels: notifyRuleForm.channels.slice(), targets: targets })
    settingsLogs.unshift({ time: nowStamp(), operator: currentUser.name, role: currentUser.role, module: '通知设置', content: '新增通知规则：' + event, result: '成功', ip: '后台终端', type: '操作日志' })
    toast('已新增规则：' + event, 'success')
  }
  closeModal()
}
function deleteNotifyRule(id) {
  const r = notifyRules.find(x => x.id === id)
  if (!r) return
  const c = '<div style="padding:4px 0">'
    + '<div style="font-size:13px;color:#1F2D3D;margin-bottom:8px">确定删除通知规则「' + r.event + '」？</div>'
    + '<div style="font-size:12px;color:#66788A">删除后不可恢复。</div>'
    + '<div class="detail-actions"><button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">取消</button><button class="btn btn-primary" style="background:linear-gradient(135deg,#E74C3C,#c0392b)" onclick="window._svc.confirmDeleteNotifyRule(' + id + ')">确认删除</button></div></div>'
  openGovModal('删除规则 · 二次确认', c)
}
function confirmDeleteNotifyRule(id) {
  const r = notifyRules.find(x => x.id === id)
  if (!r) return
  const idx = notifyRules.indexOf(r)
  if (idx >= 0) notifyRules.splice(idx, 1)
  settingsLogs.unshift({ time: nowStamp(), operator: currentUser.name, role: currentUser.role, module: '通知设置', content: '删除通知规则：' + r.event, result: '成功', ip: '后台终端', type: '操作日志' })
  closeModal()
  toast('已删除规则：' + r.event, 'info')
}
const notifyDnd = reactive({ enabled: true, start: '22:00', end: '07:00' })
const notifyRepeat = ref(30)
const notifyUrgent = ref(true)

// —— 操作日志 ——
const logTabs = ['全部', '登录日志', '操作日志', '数据变更', '安全日志']
const logTab = ref('全部')
const logSearch = ref('')
const logOperatorFilter = ref('全部')
const logModuleFilter = ref('全部')
const logResultFilter = ref('全部')
const logOperators = ['全部', '邓超', '黄尊海', '管理员', '王友德', '李秀兰', '赵建国', '设备管理员', '系统', '未知']
const logModules = ['全部', '登录', '村务公开', '数据中心', '用户管理', '数字治理', '数据备份', '设备中心']
const logResults = ['全部', '成功', '失败']
const settingsLogs = reactive([
  { time: '08-15 21:36', operator: '邓超', role: '书记', module: '村务公开', content: '发布村务公告', result: '成功', ip: '192.168.1.23', type: '操作日志' },
  { time: '08-15 20:14', operator: '黄尊海', role: '副书记', module: '数据中心', content: '修改土地数据', result: '成功', ip: '192.168.1.18', type: '数据变更' },
  { time: '08-15 19:42', operator: '管理员', role: '管理员', module: '用户管理', content: '禁用账号「陈晓」', result: '成功', ip: '后台终端', type: '操作日志' },
  { time: '08-15 19:26', operator: '王友德', role: '村民', module: '登录', content: '登录成功', result: '成功', ip: '192.168.1.45', type: '登录日志' },
  { time: '08-15 18:03', operator: '李秀兰', role: '网格员', module: '数字治理', content: '上报事件「路灯损坏」', result: '成功', ip: '192.168.1.31', type: '操作日志' },
  { time: '08-15 16:50', operator: '系统', role: '系统', module: '数据备份', content: '自动备份完成', result: '成功', ip: '—', type: '操作日志' },
  { time: '08-15 11:22', operator: '设备管理员', role: '设备管理员', module: '设备中心', content: '批量重启离线设备', result: '成功', ip: '192.168.1.9', type: '操作日志' },
  { time: '08-15 09:15', operator: '未知', role: '—', module: '登录', content: '连续登录失败 5 次', result: '失败', ip: '203.0.113.7', type: '安全日志' },
  { time: '08-14 21:08', operator: '赵建国', role: '村民', module: '登录', content: '登录成功', result: '成功', ip: '192.168.1.52', type: '登录日志' }
])
const filteredSettingsLogs = computed(() => {
  const kw = logSearch.value.trim()
  return settingsLogs.filter(l => {
    const mTab = logTab.value === '全部' || l.type === logTab.value
    const mKw = !kw || l.operator.includes(kw) || l.content.includes(kw) || l.module.includes(kw)
    const mOp = logOperatorFilter.value === '全部' || l.operator === logOperatorFilter.value
    const mMod = logModuleFilter.value === '全部' || l.module === logModuleFilter.value
    const mRes = logResultFilter.value === '全部' || l.result === logResultFilter.value
    return mTab && mKw && mOp && mMod && mRes
  })
})
function showLogDetail(l) {
  const c = '<div class="detail-section"><h4>日志详情</h4>'
    + '<div class="detail-field"><span class="df-lbl">时间</span><span class="df-val">' + l.time + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">操作人</span><span class="df-val">' + l.operator + '（' + l.role + '）</span></div>'
    + '<div class="detail-field"><span class="df-lbl">操作模块</span><span class="df-val">' + l.module + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">操作内容</span><span class="df-val">' + l.content + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">结果</span><span class="df-val">' + l.result + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">IP / 设备</span><span class="df-val">' + l.ip + '</span></div>'
    + '</div>'
    + '<div class="detail-actions"><button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">关闭</button></div>'
  openModal('日志详情', c)
}

// —— 安全设置 ——
const securitySettings = reactive({
  pwdMinLen: 8, pwdComplexity: true, pwdExpiry: 90, firstLoginChange: true,
  loginFailLock: 5, loginFailLockMinutes: 15, remoteLoginAlert: true, adminSecondVerify: true, loginTimeout: 30,
  adminAccessRestrict: true, sensitiveOpConfirm: true,
  phoneMask: true, idCardMask: true, sensitiveExportAuth: false
})

// —— 数据备份 ——
const backupAuto = reactive({ enabled: true, freq: '每天 02:00', retain: '30 天', lastTime: '2026-08-15 02:00', lastResult: '成功' })
const backupRecords = reactive([
  { time: '2026-08-15 02:00', type: '自动备份', size: '128 MB', status: '成功' },
  { time: '2026-08-14 02:00', type: '自动备份', size: '127 MB', status: '成功' },
  { time: '2026-08-13 02:00', type: '自动备份', size: '126 MB', status: '成功' },
  { time: '2026-08-10 15:20', type: '手动备份', size: '125 MB', status: '成功' },
  { time: '2026-08-05 02:00', type: '自动备份', size: '124 MB', status: '成功' },
  { time: '2026-07-30 02:00', type: '自动备份', size: '121 MB', status: '失败' }
])
function doBackup() {
  const n = new Date()
  const p2 = function (x) { return String(x).padStart(2, '0') }
  const now = n.getFullYear() + '-' + p2(n.getMonth() + 1) + '-' + p2(n.getDate()) + ' ' + p2(n.getHours()) + ':' + p2(n.getMinutes())
  toast('已发起手动备份，请稍候…', 'info')
  setTimeout(function () {
    backupRecords.unshift({ time: now, type: '手动备份', size: '128 MB', status: '成功' })
    backupAuto.lastTime = now
    backupAuto.lastResult = '成功'
    settingsLogs.unshift({ time: nowStamp(), operator: currentUser.name, role: currentUser.role, module: '数据备份', content: '手动备份完成', result: '成功', ip: '后台终端', type: '操作日志' })
    toast('手动备份完成', 'success')
  }, 1200)
}
function exportBackupRecords() {
  const header = ['备份时间', '类型', '大小', '状态']
  const lines = [header.join(',')]
  backupRecords.forEach(function (b) {
    lines.push([b.time, b.type, b.size, b.status].map(csvCell).join(','))
  })
  const csv = '﻿' + lines.join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '中堰村备份记录.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  settingsLogs.unshift({ time: nowStamp(), operator: currentUser.name, role: currentUser.role, module: '数据备份', content: '导出备份记录（' + backupRecords.length + ' 条）', result: '成功', ip: '后台终端', type: '操作日志' })
  toast('备份记录已导出', 'success')
}
let _restoreTarget = null
function showRestore(b) {
  _restoreTarget = b
  const c = '<div class="detail-section"><h4>备份信息</h4>'
    + '<div class="detail-field"><span class="df-lbl">备份时间</span><span class="df-val">' + b.time + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">类型</span><span class="df-val">' + b.type + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">大小</span><span class="df-val">' + b.size + '</span></div>'
    + '<div class="detail-field"><span class="df-lbl">状态</span><span class="df-val">' + b.status + '</span></div>'
    + '</div>'
    + '<div style="background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:12px;margin-bottom:10px;font-size:12px;color:#f0b9b5;line-height:1.6">⚠️ 恢复将覆盖当前全部数据，且恢复期间系统短暂不可用。此为高风险操作，请确认已了解后果。</div>'
    + '<div class="detail-actions"><button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">取消</button><button class="btn btn-primary" style="background:linear-gradient(135deg,#E74C3C,#c0392b)" onclick="window._svc.executeRestore()">确认恢复</button></div>'
  openModal('数据恢复 · 二次确认', c)
}
function executeRestore() {
  const b = _restoreTarget
  closeModal()
  toast('数据恢复已开始，请勿关闭页面…', 'info')
  setTimeout(function () {
    settingsLogs.unshift({ time: nowStamp(), operator: currentUser.name, role: currentUser.role, module: '数据备份', content: '恢复数据（' + (b ? b.time : '—') + '）', result: '成功', ip: '后台终端', type: '操作日志' })
    toast('数据恢复完成，系统已恢复正常', 'success')
    _restoreTarget = null
  }, 1800)
}

// Monitor cameras
// —— 视频监控（演示台账：代表摄像头，正式接入后展示全部 32 路）——
const camCategories = ['全部', '村口道路', '产业园', '公共区域', '水利设施']
const monitorCameras = [
  { id: 'CAM-ZY-001', name: '村口主摄像头', location: '村东入口', resolution: '1080P', status: '在线', category: '村口道路', hb: '16:41:32' },
  { id: 'CAM-ZY-002', name: '村东次干道监控', location: '村东次干道', resolution: '1080P', status: '在线', category: '村口道路', hb: '16:40:18' },
  { id: 'CAM-ZY-003', name: '村西路口监控', location: '村西路口', resolution: '720P', status: '在线', category: '村口道路', hb: '16:39:55' },
  { id: 'CAM-ZY-004', name: '主干道中段监控', location: '村主干道', resolution: '1080P', status: '在线', category: '村口道路', hb: '16:41:02' },
  { id: 'CAM-ZY-005', name: '产业园全景', location: '葡萄产业园', resolution: '4K', status: '在线', category: '产业园', hb: '16:41:10' },
  { id: 'CAM-ZY-006', name: '产业园大门监控', location: '产业园入口', resolution: '1080P', status: '在线', category: '产业园', hb: '16:40:40' },
  { id: 'CAM-ZY-007', name: '产业园冷库监控', location: '产业园冷库', resolution: '1080P', status: '离线', category: '产业园', hb: '08:18:44' },
  { id: 'CAM-ZY-008', name: '村委会大院监控', location: '村委会', resolution: '1080P', status: '在线', category: '公共区域', hb: '16:41:22' },
  { id: 'CAM-ZY-009', name: '停车场监控', location: '村停车场', resolution: '720P', status: '离线', category: '公共区域', hb: '12:31:05' },
  { id: 'CAM-ZY-010', name: '文化广场监控', location: '文化广场', resolution: '1080P', status: '在线', category: '公共区域', hb: '16:40:28' },
  { id: 'CAM-ZY-011', name: '3号水塘监控', location: '3号水塘', resolution: '1080P', status: '在线', category: '水利设施', hb: '16:40:51' },
  { id: 'CAM-ZY-012', name: '灌溉渠泵站监控', location: '南坡灌溉渠', resolution: '1080P', status: '在线', category: '水利设施', hb: '16:39:12' }
]

const filteredIotDevices = computed(function() {
  const kw = iotSearch.value.trim()
  return iotDevices.filter(function(d) {
    if (iotFilter.value !== '全部' && d.category !== iotFilter.value) return false
    if (kw && d.name.indexOf(kw) === -1 && d.id.toLowerCase().indexOf(kw.toLowerCase()) === -1) return false
    return true
  })
})
const filteredCameras = computed(function() {
  const kw = camSearch.value.trim()
  return monitorCameras.filter(function(c) {
    if (camFilter.value !== '全部' && c.category !== camFilter.value) return false
    if (kw && c.name.indexOf(kw) === -1 && c.id.toLowerCase().indexOf(kw.toLowerCase()) === -1) return false
    return true
  })
})

// —— 设备中心弹窗（浅色主题，走 openGovModal）——
function dRow(label, value) {
  return '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #EBEFF4"><span style="font-size:15px;color:#66788A;flex-shrink:0">' + label + '</span><span style="font-size:16px;color:#1F2D3D;font-weight:600;text-align:right">' + value + '</span></div>'
}
function sparklineSVG(points, color) {
  if (!points || points.length < 2) return ''
  const w = 300, h = 64, pad = 4
  let min = points[0], max = points[0]
  for (let i = 1; i < points.length; i++) { if (points[i] < min) min = points[i]; if (points[i] > max) max = points[i] }
  const range = (max - min) || 1
  const step = (w - pad * 2) / (points.length - 1)
  let line = '', area = ''
  for (let i = 0; i < points.length; i++) {
    const x = pad + i * step
    const y = h - pad - ((points[i] - min) / range) * (h - pad * 2)
    const xy = x.toFixed(1) + ',' + y.toFixed(1)
    if (i > 0) { line += ' '; area += ' ' }
    line += xy; area += xy
  }
  area += ' ' + (w - pad).toFixed(1) + ',' + h + ' ' + pad.toFixed(1) + ',' + h
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" style="width:100%;height:' + h + 'px;display:block">'
    + '<polygon fill="' + color + '" fill-opacity="0.10" points="' + area + '"/>'
    + '<polyline fill="none" stroke="' + color + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" points="' + line + '"/>'
    + '</svg>'
}
function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}
function camTimeStamp() {
  const n = new Date()
  const p = function(x) { return String(x).padStart(2, '0') }
  return n.getFullYear() + '-' + p(n.getMonth() + 1) + '-' + p(n.getDate()) + ' ' + p(n.getHours()) + ':' + p(n.getMinutes()) + ':' + p(n.getSeconds())
}
// 模拟监控实景画面（未接视频流时的占位）：黑色夜景村道 + 噪点 + 暗角
function cctvScene(c) {
  const seed = hashStr(c.id || 'cam')
  if (c.status !== '在线') {
    return '<svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%">'
      + '<defs><filter id="ns' + seed + '"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs>'
      + '<rect width="640" height="360" fill="#0a0c0e"/>'
      + '<rect width="640" height="360" filter="url(#ns' + seed + ')" opacity="0.16"/>'
      + '<text x="320" y="178" text-anchor="middle" font-size="28" font-family="Microsoft YaHei,sans-serif" fill="#4a535b" letter-spacing="3">无视频信号</text>'
      + '<text x="320" y="210" text-anchor="middle" font-size="13" font-family="Consolas,monospace" fill="#333b42" letter-spacing="2">NO SIGNAL</text>'
      + '</svg>'
  }
  const horizon = 236
  const vx = 316 + (seed % 37) - 18
  let s = '<svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%">'
  s += '<defs>'
  s += '<linearGradient id="sky' + seed + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1f24"/><stop offset="1" stop-color="#0b0e11"/></linearGradient>'
  s += '<linearGradient id="gd' + seed + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#12161a"/><stop offset="1" stop-color="#090b0d"/></linearGradient>'
  s += '<linearGradient id="rd' + seed + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1e23"/><stop offset="1" stop-color="#0f1215"/></linearGradient>'
  s += '<radialGradient id="vg' + seed + '" cx="0.5" cy="0.45" r="0.8"><stop offset="0.5" stop-color="rgba(0,0,0,0)"/><stop offset="1" stop-color="rgba(0,0,0,0.55)"/></radialGradient>'
  s += '<radialGradient id="moon' + seed + '" cx="0.76" cy="0.18" r="0.5"><stop offset="0" stop-color="rgba(150,170,190,0.18)"/><stop offset="0.4" stop-color="rgba(150,170,190,0)"/></radialGradient>'
  s += '<filter id="nz' + seed + '"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>'
  s += '</defs>'
  s += '<rect width="640" height="' + horizon + '" fill="url(#sky' + seed + ')"/>'
  s += '<rect width="640" height="' + horizon + '" fill="url(#moon' + seed + ')"/>'
  s += '<path d="M0 ' + horizon + ' L70 ' + (horizon - 46) + ' L150 ' + (horizon - 18) + ' L250 ' + (horizon - 52) + ' L350 ' + (horizon - 20) + ' L470 ' + (horizon - 48) + ' L580 ' + (horizon - 16) + ' L640 ' + (horizon - 34) + ' L640 ' + horizon + ' Z" fill="#0a0d10"/>'
  s += '<rect y="' + horizon + '" width="640" height="' + (360 - horizon) + '" fill="url(#gd' + seed + ')"/>'
  s += '<polygon points="' + (vx - 13) + ',' + horizon + ' ' + (vx + 13) + ',' + horizon + ' 470,360 170,360" fill="url(#rd' + seed + ')"/>'
  s += '<line x1="' + vx + '" y1="' + (horizon + 4) + '" x2="320" y2="360" stroke="#2b3137" stroke-width="2" stroke-dasharray="14 18" opacity="0.5"/>'
  const bl = 46 + (seed % 20), bw = 92 + (seed % 24), bt = horizon - 78 - (seed % 20)
  s += '<rect x="' + bl + '" y="' + bt + '" width="' + bw + '" height="' + (horizon - bt) + '" fill="#15191d"/>'
  for (let r = 0; r < 2; r++) for (let col = 0; col < 3; col++) {
    if ((seed + r * 3 + col) % 4 === 0) continue
    s += '<rect x="' + (bl + 10 + col * (bw / 3)) + '" y="' + (bt + 12 + r * 26) + '" width="12" height="14" fill="#e8c97a" opacity="0.8"/>'
  }
  const br = 470 + (seed % 16), bw2 = 110 + (seed % 20), bt2 = horizon - 66 - (seed % 16)
  s += '<rect x="' + br + '" y="' + bt2 + '" width="' + bw2 + '" height="' + (horizon - bt2) + '" fill="#0f1215"/>'
  for (let r = 0; r < 2; r++) for (let col = 0; col < 3; col++) {
    if ((seed + 1 + r * 3 + col) % 3 === 0) continue
    s += '<rect x="' + (br + 12 + col * (bw2 / 3)) + '" y="' + (bt2 + 12 + r * 24) + '" width="13" height="15" fill="#e8c97a" opacity="0.75"/>'
  }
  s += '<rect x="' + (vx - 82) + '" y="' + (horizon + 30) + '" width="4" height="90" fill="#07090b"/>'
  s += '<circle cx="' + (vx - 80) + '" cy="' + (horizon + 30) + '" r="16" fill="#f5e9b8" opacity="0.16"/>'
  s += '<circle cx="' + (vx - 80) + '" cy="' + (horizon + 30) + '" r="7" fill="#f5e9b8" opacity="0.95"/>'
  s += '<rect x="' + (vx + 120) + '" y="' + (horizon + 46) + '" width="5" height="60" fill="#07090b"/>'
  s += '<circle cx="' + (vx + 122) + '" cy="' + (horizon + 40) + '" r="20" fill="#141a16"/>'
  s += '<circle cx="' + (vx + 104) + '" cy="' + (horizon + 52) + '" r="16" fill="#0f140f"/>'
  s += '<rect width="640" height="360" filter="url(#nz' + seed + ')" opacity="0.06"/>'
  s += '<rect width="640" height="360" fill="url(#vg' + seed + ')"/>'
  s += '</svg>'
  return s
}
function showIotDetail(d) {
  const statusColor = d.status === '在线' ? '#22B573' : d.status === '异常' ? '#F2A62B' : '#E05252'
  let h = '<div style="text-align:center;padding:2px 0 14px">'
  h += '<div style="font-size:30px;margin-bottom:8px">' + d.icon + '</div>'
  h += '<div style="font-size:18px;font-weight:700;color:#1F2D3D">' + d.name + '</div>'
  h += '<div style="font-size:14px;color:#66788A;margin-top:4px">设备详情</div>'
  h += '</div>'
  h += '<div style="background:#F8FAFB;border:1px solid #E3EAF0;border-radius:8px;padding:2px 14px;margin-bottom:14px">'
  h += dRow('设备状态', '<span style="color:' + statusColor + '">● ' + d.status + '</span>')
  h += dRow('设备编号', d.id)
  h += dRow('安装位置', d.location)
  h += dRow('所属类型', d.category)
  h += dRow('安装时间', d.installTime)
  h += dRow('最后通信', d.lastComm)
  h += '</div>'
  h += '<div style="font-size:16px;font-weight:700;color:#1F2D3D;margin-bottom:8px">实时数据</div>'
  h += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px">'
  d.realtime.forEach(function(r) {
    h += '<div style="flex:1;min-width:72px;background:#F8FAFB;border:1px solid #E3EAF0;border-radius:8px;padding:10px 8px;text-align:center"><div style="font-size:14px;color:#66788A;margin-bottom:4px">' + r.label + '</div><div style="font-size:16px;font-weight:700;color:' + (r.ok ? '#1F2D3D' : '#F2A62B') + '">' + r.value + '</div></div>'
  })
  h += '</div>'
  h += '<div style="font-size:16px;font-weight:700;color:#1F2D3D;margin-bottom:8px">近24小时趋势<span style="font-size:14px;color:#66788A;font-weight:400;margin-left:6px">' + d.trendLabel + '</span></div>'
  h += '<div style="background:#F8FAFB;border:1px solid #E3EAF0;border-radius:8px;padding:12px;margin-bottom:14px">' + sparklineSVG(d.trend, statusColor) + '</div>'
  h += '<div style="display:flex;gap:10px">'
  h += '<button class="btn btn-outline" onclick="window._svc.showIotHistory(\'' + d.id + '\')" style="flex:1;justify-content:center">📊 查看历史数据</button>'
  h += '<button class="btn btn-outline" onclick="window._svc.showIotAlerts(\'' + d.id + '\')" style="flex:1;justify-content:center">🔔 查看告警记录</button>'
  h += '</div>'
  openGovModal('📡 设备详情', h)
}
function showIotHistory(id) {
  const d = iotDevices.find(function(x) { return x.id === id })
  if (!d) return
  let h = '<div style="padding:2px 0">'
  h += '<div style="font-size:15px;color:#66788A;margin-bottom:12px">' + d.icon + ' ' + d.name + ' · 近7天趋势</div>'
  h += '<div style="background:#F8FAFB;border:1px solid #E3EAF0;border-radius:8px;padding:14px;margin-bottom:14px">' + sparklineSVG(genTrend(d.trend[0] || 20, 1.6), '#22B573') + '</div>'
  h += '<div style="font-size:16px;font-weight:700;color:#1F2D3D;margin-bottom:8px">最近读数</div>'
  h += '<div style="background:#F8FAFB;border:1px solid #E3EAF0;border-radius:8px;overflow:hidden">'
  h += '<table style="width:100%;border-collapse:collapse"><thead><tr style="background:#F0F3F8"><th style="padding:8px 12px;font-size:15px;color:#66788A;text-align:left">时间</th><th style="padding:8px 12px;font-size:15px;color:#66788A;text-align:left">' + (d.trendLabel || '读数') + '</th></tr></thead><tbody>'
  for (let i = 0; i < 6; i++) {
    h += '<tr style="border-bottom:1px solid #EBEFF4"><td style="padding:8px 12px;font-size:15px;color:#475867">' + (6 - i) + ' 小时前</td><td style="padding:8px 12px;font-size:15px;color:#1F2D3D;font-weight:600">' + d.trend[11 - i] + '</td></tr>'
  }
  h += '</tbody></table></div>'
  h += '<div style="text-align:center;font-size:14px;color:#8A97A5;margin-top:12px">完整历史数据待接入设备台账系统</div>'
  h += '</div>'
  openGovModal('📊 历史数据', h)
}
function showIotAlerts(id) {
  const d = iotDevices.find(function(x) { return x.id === id })
  if (!d) return
  const related = deviceAlerts.filter(function(a) { return a.device === d.name })
  let h = '<div style="padding:2px 0">'
  h += '<div style="font-size:15px;color:#66788A;margin-bottom:12px">' + d.icon + ' ' + d.name + ' · 告警记录</div>'
  if (related.length === 0) {
    h += '<div style="text-align:center;padding:30px 0;color:#66788A;font-size:15px">该设备近期无告警记录</div>'
  } else {
    related.forEach(function(a) {
      const c = a.severity === 'offline' ? '#E05252' : '#F2A62B'
      h += '<div style="display:flex;align-items:center;gap:10px;padding:11px 12px;background:#F8FAFB;border:1px solid #E3EAF0;border-radius:8px;margin-bottom:8px"><span style="width:8px;height:8px;border-radius:50%;background:' + c + ';flex-shrink:0"></span><div style="flex:1"><div style="font-size:16px;color:#1F2D3D;font-weight:600">' + a.issue + '</div><div style="font-size:14px;color:#66788A;margin-top:2px">' + a.module + '</div></div><span style="font-size:14px;color:#66788A">' + a.time + '</span></div>'
    })
  }
  h += '<div style="text-align:center;font-size:14px;color:#8A97A5;margin-top:12px">告警处置联动治理中心派单（待接入）</div>'
  h += '</div>'
  openGovModal('🔔 告警记录', h)
}
function showCameraDetail(c) {
  const on = c.status === '在线'
  const statusColor = on ? '#22B573' : '#E05252'
  let h = '<div style="padding:2px 0">'
  h += '<div style="position:relative;aspect-ratio:16/9;background:#0a0d10;border:1px solid #E3EAF0;border-radius:8px;overflow:hidden;margin-bottom:12px">'
  h += cctvScene(c)
  h += '<div style="position:absolute;inset:0;padding:10px 12px;display:flex;flex-direction:column;justify-content:space-between;pointer-events:none">'
  h += '<div style="display:flex;align-items:center;justify-content:space-between">'
  h += '<span style="font-size:13px;font-family:Consolas,monospace;color:#fff;background:rgba(0,0,0,0.5);padding:2px 8px;border-radius:3px;letter-spacing:.5px">' + c.id + '</span>'
  h += '<span style="font-size:13px;font-weight:700;color:#fff;display:inline-flex;align-items:center;gap:5px;background:rgba(0,0,0,0.5);padding:2px 8px;border-radius:3px"><i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + (on ? '#ff4d4f' : '#9aa7b0') + '"></i>' + (on ? 'LIVE' : '离线') + '</span>'
  h += '</div>'
  h += '<div style="display:flex;align-items:center;justify-content:space-between">'
  h += '<span style="font-size:13px;font-family:Consolas,monospace;color:#fff;background:rgba(0,0,0,0.5);padding:2px 8px;border-radius:3px;letter-spacing:.5px">' + camTimeStamp() + '</span>'
  h += '<span style="font-size:13px;color:#fff;background:rgba(0,0,0,0.5);padding:2px 8px;border-radius:3px">' + c.resolution + '</span>'
  h += '</div>'
  h += '</div>'
  h += '</div>'
  h += '<div style="display:flex;gap:8px;margin-bottom:14px">'
  h += '<button class="btn btn-outline" onclick="window._svc.camAction(\'fullscreen\', \'' + c.id + '\')" style="flex:1;justify-content:center">🔍 全屏查看</button>'
  h += '<button class="btn btn-outline" onclick="window._svc.camAction(\'screenshot\', \'' + c.id + '\')" style="flex:1;justify-content:center">📸 截图</button>'
  h += '<button class="btn btn-outline" onclick="window._svc.camAction(\'records\', \'' + c.id + '\')" style="flex:1;justify-content:center">📋 查看记录</button>'
  h += '</div>'
  h += '<div style="background:#F8FAFB;border:1px solid #E3EAF0;border-radius:8px;padding:2px 14px">'
  h += dRow('位置', c.location)
  h += dRow('状态', '<span style="color:' + statusColor + '">● ' + c.status + '</span>')
  h += dRow('分辨率', c.resolution)
  h += dRow('最后心跳', c.hb)
  h += dRow('存储状态', on ? '正常' : '未知')
  h += '</div>'
  h += '<div style="text-align:center;font-size:14px;color:#8A97A5;margin-top:12px">接入 RTSP/HLS/GB28181 后替换上方视频区域</div>'
  h += '</div>'
  openGovModal('📷 ' + c.name, h)
}
function camAction(action, id) {
  if (action === 'records') {
    const c = monitorCameras.find(function(x) { return x.id === id })
    toast('暂无录像记录（待接入存储），当前设备：' + (c ? c.name : id), 'info')
  } else if (action === 'screenshot') {
    toast('截图功能待接入视频流', 'info')
  } else {
    toast('全屏查看待接入视频流', 'info')
  }
}
function showAllDeviceAlerts() {
  let h = '<div style="padding:2px 0">'
  h += '<div style="font-size:15px;color:#66788A;margin-bottom:12px">全村设备当前异常 / 告警（演示数据，正式由网关实时推送）</div>'
  deviceAlerts.forEach(function(a) {
    const c = a.severity === 'offline' ? '#E05252' : '#F2A62B'
    const sevText = a.severity === 'offline' ? '离线' : '异常'
    h += '<div style="display:flex;align-items:center;gap:10px;padding:11px 12px;background:#F8FAFB;border:1px solid #E3EAF0;border-radius:8px;margin-bottom:8px"><span style="width:8px;height:8px;border-radius:50%;background:' + c + ';flex-shrink:0"></span><div style="flex:1"><div style="font-size:16px;color:#1F2D3D;font-weight:600">' + a.device + '</div><div style="font-size:14px;color:#66788A;margin-top:2px">' + a.issue + ' · ' + a.module + '</div></div><div style="text-align:right"><span style="font-size:13px;color:' + c + ';border:1px solid ' + c + ';border-radius:4px;padding:1px 6px">' + sevText + '</span><div style="font-size:14px;color:#66788A;margin-top:4px">' + a.time + '</div></div></div>'
  })
  h += '<div style="text-align:center;font-size:14px;color:#8A97A5;margin-top:12px">异常设备已联动治理中心生成待办，处理记录归入数据中心</div>'
  h += '</div>'
  openGovModal('⚠️ 当前异常告警', h)
}

console.log('🏘️ 中堰村 · 蓝匠数智数字乡村平台 Vue3 全部功能已就绪')
</script>

<style>
@import '@/../public/design-tokens.css';

:root {
  --bg: #06172c; --panel-bg: rgba(7,27,52,0.82);
  --panel-border: rgba(0,234,255,0.14); --accent: #19d98b;
  --accent2: #19d98b; --accent3: #ffcc33; --accent4: #ff4d5a; --accent5: #5c7cff;
  --cyan: #00eaff;
  --text: #a8c4dd; --text-dim: #6d8aa8; --text-bright: #eaf6ff;
  --sidebar-w: 220px; --header-h: 52px;
  --pri: #19d98b; --td: #6d8aa8; --tb: #fff;
}

.dashboard-shell {
  width: 100vw; height: 100vh; overflow: hidden;
  background: var(--bg); color: var(--text);
  font-family: "Microsoft YaHei","PingFang SC",sans-serif;
  position: relative;
}

/* 统一产业中心卡片风格 */
.page-industry-embed .scard,
.page-industry-embed .srow > div,
.page-industry-embed .stat-card,
.page-industry-embed .module-card,
.page-industry-embed .module-grid > div,
.page-industry-embed .panel {
  background: #FFFFFF !important;
  border: 1px solid #E3EAF0 !important;
  border-radius: 10px !important;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06) !important;
  animation: none !important;
}
.page-industry-embed .scard,
.page-industry-embed .stat-card {
  height: 145px !important;
  min-height: auto !important;
  padding: 24px !important;
}
.page-industry-embed .module-card,
.page-industry-embed .module-grid > div {
  min-height: 205px !important;
  padding: 22px !important;
  box-sizing: border-box !important;
}
.page-industry-embed .scard:hover,
.page-industry-embed .stat-card:hover,
.page-industry-embed .module-card:hover,
.page-industry-embed .module-grid > div:hover {
  border-color: #22B573 !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
  transform: translateY(-2px);
}
.page-industry-embed .srow,
.page-industry-embed .module-grid {
  gap: 14px !important;
}

/* ========== GOVERNANCE LIGHT THEME ========== */
.gov-theme { background:#F4F7FA }
.gov-theme .panel {
  background:#FFFFFF; border:1px solid #E3EAF0;
  box-shadow:0 1px 4px rgba(0,0,0,0.06); backdrop-filter:none;
}
.gov-theme .panel-hd { color:#1F2D3D }
.gov-theme .panel-hd .extra { color:#66788A }

/* hd-bars */
.gov-theme .hd-bar { background:#19B98A; box-shadow:0 0 7px rgba(25,185,138,0.20) }
.gov-theme .hd-bar.g { background:#22B573; box-shadow:0 0 7px rgba(34,181,115,0.20) }
.gov-theme .hd-bar.y { background:#F2A62B; box-shadow:0 0 7px rgba(242,166,43,0.20) }
.gov-theme .hd-bar.r { background:#E05252; box-shadow:0 0 7px rgba(224,82,82,0.20) }

/* stat cards */
.gov-theme .stat-card {
  background:#FFFFFF; border:1px solid #E3EAF0;
  box-shadow:0 1px 3px rgba(0,0,0,0.05); backdrop-filter:none;
}
.gov-theme .stat-card:hover { background:rgba(25,185,138,0.04); border-color:#19B98A; box-shadow:0 4px 12px rgba(0,0,0,0.08) }
.gov-theme .sc-val { color:#1F2D3D }
.gov-theme .sc-lbl { color:#66788A }
.gov-theme .sc-sub { color:#66788A; opacity:.65 }
.gov-theme .stat-card.g .sc-val { color:#22B573 }
.gov-theme .stat-card.y .sc-val { color:#F2A62B }
.gov-theme .stat-card.r .sc-val { color:#E05252 }

/* data-table */
.gov-theme .data-table th { background:#F0F3F8; color:#66788A; border-bottom:2px solid #E3EAF0 }
.gov-theme .data-table td { border-bottom:1px solid #EBEFF4; color:#1F2D3D }
.gov-theme .data-table tr:hover td { background:rgba(25,185,138,0.04) }

/* status badges */
.gov-theme .st.online, .gov-theme .st.info { background:rgba(34,181,115,0.10); color:#22B573 }
.gov-theme .st.warning { background:rgba(242,166,43,0.10); color:#F2A62B }
.gov-theme .st.offline { background:rgba(224,82,82,0.10); color:#E05252 }

/* buttons */
.gov-theme .btn-primary { background:linear-gradient(135deg,#19B98A,#16A37A); color:#fff; box-shadow:0 2px 8px rgba(25,185,138,0.25) }
.gov-theme .btn-primary:hover { box-shadow:0 4px 14px rgba(25,185,138,0.35); transform:translateY(-2px) }
.gov-theme .btn-outline { border:1px solid #C8D4E0; color:#66788A }
.gov-theme .btn-outline:hover { background:rgba(25,185,138,0.06); border-color:#19B98A; color:#19B98A }

/* input */
.gov-theme .input { background:#FFFFFF; border:1px solid #D0D8E2; color:#1F2D3D }
.gov-theme .input:focus { border-color:#19B98A; box-shadow:0 0 0 3px rgba(25,185,138,0.08) }
.gov-theme .input::placeholder { color:#A0AFC0 }

/* gov quick bar */
.gov-theme .gov-qbtn { background:#FFFFFF; border:1px solid #E3EAF0; color:#1F2D3D }
.gov-theme .gov-qbtn:hover { background:rgba(25,185,138,0.06); border-color:#19B98A; color:#19B98A; box-shadow:0 2px 8px rgba(0,0,0,0.06) }
.gov-theme .gov-qbtn.primary { background:#19B98A; border-color:#19B98A; color:#FFFFFF }
.gov-theme .gov-qbtn.primary:hover { background:#17a87c }

/* gov news items */
.gov-theme .gov-news-item { background:#FAFBFC; border:1px solid #E3EAF0 }
.gov-theme .gov-news-item:hover { background:rgba(25,185,138,0.05); border-color:#B8D8CC }
.gov-theme .gni-loc { color:#1F2D3D }
.gov-theme .gni-time { color:#66788A }

/* grid worker */
.gov-theme .gw-name { color:#1F2D3D }
.gov-theme .gw-role { color:#19B98A; background:rgba(25,185,138,0.08) }
.gov-theme .gw-meta { color:#66788A }

/* chat */
.gov-theme .chat-wrapper { background:#FAFBFC; border:1px solid #E3EAF0 }
.gov-theme .chat-msg.ai { background:rgba(25,185,138,0.06); color:#1F2D3D; border:1px solid rgba(25,185,138,0.10) }
.gov-theme .chat-msg.user { background:rgba(25,185,138,0.12); color:#1F2D3D; border:1px solid rgba(25,185,138,0.18) }

/* mini stats */
.gov-theme .mini-s { background:#FAFBFC; border:1px solid #E3EAF0 }
.gov-theme .ms-v { color:#1F2D3D }
.gov-theme .ms-l { color:#66788A }
.gov-theme .mini-s.g .ms-v { color:#22B573 }
.gov-theme .mini-s.y .ms-v { color:#F2A62B }
.gov-theme .mini-s.r .ms-v { color:#E05252 }

/* module cards */
.gov-theme .module-card { background:#FFFFFF; border:1px solid #E3EAF0; backdrop-filter:none; box-shadow:0 1px 3px rgba(0,0,0,0.05) }
.gov-theme .module-card:hover { background:#FFFFFF; border-color:#19B98A; box-shadow:0 4px 12px rgba(0,0,0,0.08) }
.gov-theme .module-card h4 { color:#1F2D3D }
.gov-theme .module-card p { color:#66788A }

/* tags */
.gov-theme .tag.blue { background:rgba(25,185,138,0.10); color:#19B98A }
.gov-theme .tag.green { background:rgba(34,181,115,0.12); color:#22B573 }
.gov-theme .tag.yellow { background:rgba(242,166,43,0.12); color:#F2A62B }
.gov-theme .tag.red { background:rgba(224,82,82,0.12); color:#E05252 }

/* alert list */
.gov-theme .alert-item { background:#FFFFFF; border-left:2px solid #F2A62B }
.gov-theme .alert-item:hover { background:rgba(25,185,138,0.04) }
.gov-theme .ai-title { color:#1F2D3D }
.gov-theme .ai-desc { color:#66788A }
.gov-theme .ai-time { color:#66788A; opacity:.6 }

/* tabs */
.gov-theme .tabs { background:#F4F7FA }
.gov-theme .tab { color:#66788A }
.gov-theme .tab.active { background:#19B98A; color:#fff }
.gov-theme .tab:hover { color:#1F2D3D }

/* review */
.gov-theme .review-item { background:#FFFFFF }
.gov-theme .review-name { color:#1F2D3D }
.gov-theme .review-text { color:#66788A }

/* detail section */
.gov-theme .detail-section h4 { color:#22B573 }
.gov-theme .detail-section h4::before { background:#22B573 }
.gov-theme .df-lbl { color:#66788A }
.gov-theme .df-val { color:#1F2D3D }

/* marquee */
.gov-theme .marquee-bar { background:#FFFFFF; border-color:#E3EAF0; backdrop-filter:none }
.gov-theme .marquee-text { color:#19B98A }
.gov-theme .float-badge { background:rgba(25,185,138,0.12); color:#19B98A; border-color:rgba(25,185,138,0.20) }

/* progress */
.gov-theme .progress-bar { background:rgba(25,185,138,0.06) }
.gov-theme .progress-fill.g { background:linear-gradient(90deg,#19B98A,#22B573) }

/* tech grid */
.gov-theme .tech-label { color:#66788A }
.gov-theme .tech-val { color:#1F2D3D }

/* bot row */
.gov-theme .bot-card { background:#FFFFFF; border-color:#E3EAF0; backdrop-filter:none; box-shadow:0 1px 3px rgba(0,0,0,0.05) }
.gov-theme .bot-card:hover { background:#FFFFFF; border-color:#19B98A }
.gov-theme .bot-card::before { background:linear-gradient(90deg,transparent,rgba(25,185,138,0.2),transparent) }
.gov-theme .bv { color:#1F2D3D }
.gov-theme .bl { color:#66788A }
.gov-theme .bs { color:#66788A; opacity:.6 }
.gov-theme .bot-card.g .bv { color:#22B573 }
.gov-theme .bot-card.y .bv { color:#F2A62B }
.gov-theme .bot-card.r .bv { color:#E05252 }

/* svc cards */
.gov-theme .svc-card { background:#FAFBFC; border-color:#E3EAF0 }
.gov-theme .svc-card:hover { background:rgba(25,185,138,0.04); border-color:#19B98A }
.gov-theme .svc-card .sn { color:#1F2D3D }
.gov-theme .svc-card .sd { color:#66788A }

/* map */
.gov-theme .map-wrap { border-color:#E3EAF0 }
.gov-theme .map-lg { color:#66788A }

/* iot */
.gov-theme .iot-st { color:#66788A }
.gov-theme .iot-st.warn { color:#F2A62B }
.gov-theme .iot-st.offline { color:#E05252 }
.gov-theme .dot.online { background:#22B573; box-shadow:0 0 5px #22B573 }
.gov-theme .dot.warn { background:#F2A62B; box-shadow:0 0 5px #F2A62B }
.gov-theme .dot.offline { background:#E05252 }
.gov-theme .iot-row:hover { background:rgba(25,185,138,0.04) }


/* Governance light modal */
.modal-box.modal-light { background:#FFFFFF !important; border:1px solid #E3EAF0 !important; box-shadow:0 8px 40px rgba(0,0,0,0.12) !important }
.modal-box.modal-light h3 { color:#1F2D3D !important }
.modal-box.modal-light .detail-section h4 { color:#22B573 }
.modal-box.modal-light .detail-section h4::before { background:#22B573 }
.modal-box.modal-light .df-lbl { color:#66788A }
.modal-box.modal-light .df-val { color:#1F2D3D }
.modal-box.modal-light .detail-field { border-bottom-color:#EBEFF4 }
.modal-box.modal-light .btn-outline { background:#FFFFFF; border:1px solid #C8D4E0; color:#1F2D3D }
.modal-box.modal-light .btn-outline:hover { background:#FFFFFF; border-color:#19B98A; color:#19B98A }
.modal-box.modal-light .btn-primary { background:linear-gradient(135deg,#19B98A,#16A37A); color:#fff; box-shadow:0 2px 8px rgba(25,185,138,0.25) }
.modal-box.modal-light .btn-primary:hover { box-shadow:0 4px 14px rgba(25,185,138,0.35) }

/* ===== 统一弹窗关闭 ×（右上角固定，所有弹窗共用）===== */
.modal-x { position:absolute; top:16px; right:16px; width:30px; height:30px; border:none; border-radius:50%; cursor:pointer; font-size:16px; line-height:30px; text-align:center; padding:0; background:rgba(255,255,255,0.08); color:#9FB0C0; transition:all .2s; z-index:20; font-family:inherit }
.modal-x:hover { background:rgba(255,255,255,0.18); color:#fff }
.modal-box.modal-light .modal-x { background:#F0F3F6; color:#66788A }
.modal-box.modal-light .modal-x:hover { background:#E3EAF0; color:#1F2D3D }

/* ===== 大尺寸「列表工作区」弹窗（我的留言 / 村民留言处理等长期记录中心）===== */
.modal-box.modal-lg { width:min(1200px, 88vw); max-width:88vw; height:82vh; max-height:85vh; padding:0; overflow:hidden; display:flex; flex-direction:column; border-radius:10px }
.modal-box.modal-lg h3 { padding:20px 24px 6px; margin-bottom:0; flex-shrink:0; font-size:18px }
.modal-box.modal-lg .modal-x { top:18px; right:20px }

.msg-center { display:flex; flex-direction:column; flex:1; min-height:0; padding:0 24px 20px }
.msgc-sub { font-size:12px; color:#66788A; margin:8px 0 12px; flex-shrink:0 }
.msgc-tabs { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; flex-shrink:0 }
.msgc-tab { cursor:pointer; padding:5px 14px; border-radius:14px; font-size:13px; font-weight:600; white-space:nowrap }
.msgc-list { flex:1; overflow-y:auto; min-height:0; border-top:1px solid #EBEFF4 }
.msgc-item { padding:12px 2px; border-bottom:1px solid #EBEFF4; cursor:pointer; transition:background .15s }
.msgc-item:hover { background:#F7FAF9 }
.msgc-row1 { display:flex; align-items:center; justify-content:space-between; gap:10px }
.msgc-left { display:flex; align-items:center; gap:8px; min-width:0 }
.msgc-cat { font-size:13px; font-weight:700; color:#1F2D3D; white-space:nowrap }
.msgc-staff { font-size:12px; color:#66788A; white-space:nowrap }
.msgc-content { font-size:14px; color:#475867; margin-top:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis }
.msgc-row3 { display:flex; align-items:center; justify-content:space-between; margin-top:6px }
.msgc-time { font-size:12px; color:#8A97A5 }
.msgc-link { font-size:12px; color:#19B98A; font-weight:600 }
.msgc-empty { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 0 }
.msgc-empty-ic { font-size:32px; margin-bottom:10px }
.msgc-empty-t { font-size:15px; font-weight:700; color:#475867; margin-bottom:6px }
.msgc-empty-s { font-size:13px; color:#8A97A5 }
.msgc-pager { display:flex; align-items:center; justify-content:space-between; padding-top:12px; flex-shrink:0 }
.msgc-total { font-size:12px; color:#66788A }
.msgc-pages { display:flex; gap:4px; align-items:center }
.msgc-pg { min-width:28px; height:28px; padding:0 6px; display:inline-flex; align-items:center; justify-content:center; border-radius:6px; cursor:pointer; font-size:13px; color:#475867; background:#F0F3F6 }
.msgc-pg:hover { background:#E3EAF0 }
.msgc-pg-on { background:#19B98A; color:#fff; cursor:default }
.msgc-pg-on:hover { background:#19B98A }
.msgc-pg-dis { opacity:.4; cursor:default }
.msgc-pg-dis:hover { background:#F0F3F6 }

/* ===== 全局动画关键帧（供 JS 注入的内联 animation 引用，不能放 scoped 块） ===== */
@keyframes dotBreathe { 0%, 100% { transform:scale(1); opacity:1 } 50% { transform:scale(1.3); opacity:.8 } }
@keyframes livePulse { 0% { transform:scale(1); opacity:1 } 100% { transform:scale(2.5); opacity:0 } }
@keyframes alertPulse { 0% { transform:scale(.5); opacity:.9 } 100% { transform:scale(3); opacity:0 } }
@keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
.boundary-flow { animation: dashFlow 3s linear infinite; }
@keyframes dashFlow { to { stroke-dashoffset: -28; } }

</style>

<style scoped>
/* ========== PARTICLES ========== */
.particles-bg { position:fixed; top:0; left:0; width:100%; height:100%; z-index:0; pointer-events:none }

/* ========== OVERLAY ========== */
.overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:190; opacity:0; pointer-events:none; transition:opacity .3s }
.overlay.show { opacity:1; pointer-events:auto }

/* ========== SIDEBAR ========== */
.sidebar {
  position:fixed; top:0; left:0; bottom:0; width:var(--sidebar-w); z-index:100;
  background:linear-gradient(180deg,rgba(8,38,58,0.97),rgba(12,32,52,0.95));
  backdrop-filter:blur(20px); border-right:1px solid rgba(40,199,111,0.12);
  display:flex; flex-direction:column; transition:transform .3s;
}
.sidebar.collapsed { transform:translateX(calc(var(--sidebar-w) * -1)); overflow:hidden }
.side-hd {
  flex-shrink:0; height:var(--header-h); display:flex; align-items:center; gap:10px;
  padding:0 14px; border-bottom:2px solid var(--accent); position:relative;
}
.side-hd::after {
  content:''; position:absolute; bottom:-1px; left:8px; right:8px; height:1px;
  background:linear-gradient(90deg,transparent,rgba(79,172,254,.15),transparent)
}
.side-logo {
  width:34px; height:34px; border-radius:8px;
  background:linear-gradient(135deg,#4FACFE,#39CF7B);
  display:flex; align-items:center; justify-content:center; font-size:16px;
  box-shadow:0 0 20px rgba(57,217,138,0.35); flex-shrink:0
}
.side-title { font-size:15px; font-weight:700; color:#e8f0f8; letter-spacing:1.5px; white-space:nowrap }
.side-nav { flex:1; overflow-y:auto; padding:6px 0 }
.side-nav::-webkit-scrollbar { width:3px }
.side-nav::-webkit-scrollbar-thumb { background:rgba(79,172,254,.12); border-radius:2px }

.nav-item {
  display:flex; align-items:center; gap:9px; padding:9px 10px; border-radius:8px;
  cursor:pointer; transition:all .25s ease; font-size:12px; color:#a0bcd0; margin:1px 0;
  white-space:nowrap; position:relative; border:1px solid transparent;
}
.nav-item:hover { background:rgba(57,217,138,0.08); color:#c8daea; border-color:rgba(79,172,254,.08) }
.nav-item.active { background:rgba(57,217,138,0.12); color:#f0f4fa; font-weight:600; border-color:rgba(79,172,254,.15); box-shadow:0 0 16px rgba(79,172,254,.06) }
.nav-item.active::before { content:''; position:absolute; left:-8px; top:8px; bottom:8px; width:3px; background:var(--pri); border-radius:0 2px 2px 0; box-shadow:0 0 8px rgba(57,217,138,.35) }
.ni-icon { font-size:16px; width:20px; text-align:center; flex-shrink:0 }
.nav-divider { height:1px; background:rgba(79,172,254,.06); margin:6px 16px }

.nav-tree-group { margin:1px 0 }
.nav-tree-parent .nav-arrow { font-size:8px; margin-left:auto; transition:transform .25s ease; opacity:.4 }
.nav-tree-parent.open .nav-arrow { transform:rotate(90deg); opacity:.8 }
.nav-tree-children { overflow:hidden; max-height:0; transition:max-height .35s ease }
.nav-tree-children.open { max-height:200px }
.nav-sub {
  padding:8px 10px 8px 36px!important; font-size:13px!important;
  color:rgba(180,200,220,.50)!important; margin:0 8px!important;
}
.nav-sub:hover { color:rgba(210,230,245,.80)!important; background:rgba(79,172,254,.05)!important }
.nav-sub.active { color:var(--accent)!important; font-weight:600; background:rgba(14,165,233,.1) }
.nav-badge { font-size:11px; background:rgba(79,172,254,.10); color:rgba(180,210,240,.60); padding:2px 8px; border-radius:10px; margin-left:auto; font-weight:500 }

.side-ft { flex-shrink:0; padding:10px; border-top:1px solid rgba(57,217,138,0.08) }
.side-user { display:flex; align-items:center; gap:8px; padding:6px; border-radius:8px; cursor:pointer; transition:.2s }
.side-user:hover { background:rgba(57,217,138,0.08) }
.side-av { width:30px; height:30px; border-radius:50%; background:var(--accent2); display:flex; align-items:center; justify-content:center; font-size:12px; color:#fff; font-weight:600; flex-shrink:0 }
.side-un { font-size:11px; color:var(--text-bright); font-weight:500 }
.side-ur { font-size:9px; color:var(--text-dim) }

/* ========== MAIN ========== */
.main-wrap { margin-left:var(--sidebar-w); height:100vh; display:flex; flex-direction:column; position:relative; z-index:1; transition:margin .3s; overflow:hidden }
.main-wrap.expanded { margin-left:0 }

/* ========== FULLSCREEN / IMMERSIVE ========== */
.btn-fs { width:auto; padding:0 12px; gap:6px; font-size:12px; white-space:nowrap }
.dashboard-fullscreen .sidebar { display:none !important }
.dashboard-fullscreen .hdr-left { display:none }
.dashboard-fullscreen .role-switcher { display:none }
.dashboard-fullscreen .btn-bell { display:none }
.dashboard-fullscreen .hdr-time { display:none }

/* ========== HEADER ========== */
.header {
  flex-shrink:0; height:var(--header-h); display:flex; align-items:center; justify-content:space-between;
  padding:0 16px; background:linear-gradient(180deg,rgba(10,60,130,0.2) 0%,rgba(6,24,52,0.05) 100%);
  border-bottom:1px solid rgba(0,0,0,0.06); position:relative;
}
.hdr-left { display:flex; align-items:center; gap:12px }
.hdr-right { display:flex; align-items:center; gap:16px }
.role-switcher {
  background:rgba(10,60,130,.15); border:1px solid rgba(14,165,233,0.22); color:var(--text);
  border-radius:8px; padding:6px 10px; font-size:11px; font-family:inherit; cursor:pointer; outline:none;
}
.role-switcher:hover { border-color:rgba(57,217,138,0.5) }
.role-switcher option { background:#0a2430; color:#B7D3E8 }
.btn-icon {
  width:32px; height:32px; border-radius:8px; border:1px solid rgba(14,165,233,0.18);
  background:rgba(10,60,130,.15); color:var(--text); cursor:pointer;
  display:flex; align-items:center; justify-content:center; font-size:14px; transition:all .2s;
}
.btn-icon:hover { background:rgba(57,217,138,0.20); border-color:#39D98A }
.hdr-link { color:#8aa0b8; text-decoration:none; font-size:11px; display:flex; align-items:center; gap:4px }
.breadcrumb { font-size:11px; color:var(--text-dim) }
.breadcrumb span { color:var(--text-bright); font-weight:600 }
.hdr-time { font-size:11px; color:var(--text-dim); text-align:right }
.hdr-time .tm { font-size:17px; font-weight:600; color:var(--text-bright); font-family:"SF Mono","DIN Alternate","Consolas",monospace }

/* ========== CONTENT ========== */
.content-area { flex:1; overflow-y:scroll; overflow-x:hidden; padding:10px 14px; min-height:0 }
.content-area::-webkit-scrollbar { width:4px }
.content-area::-webkit-scrollbar-thumb { background:rgba(57,217,138,0.12); border-radius:2px }

/* ========== PANELS ========== */
.panel {
  background-color:rgba(8,30,58,0.85); backdrop-filter:blur(16px);
  border:1px solid rgba(0,234,255,0.15); border-radius:0;
  box-shadow:0 0 6px rgba(0,234,255,0.05), 0 8px 28px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(0,234,255,0.04);
  display:flex; flex-direction:column; overflow:hidden; position:relative;
  background-image:
    linear-gradient(180deg, rgba(15,46,88,0.5), rgba(6,20,40,0.3)),
    linear-gradient(90deg, rgba(0,234,255,.72), rgba(0,234,255,.72)),
    linear-gradient(0deg, rgba(0,234,255,.72), rgba(0,234,255,.72)),
    linear-gradient(90deg, rgba(0,234,255,.72), rgba(0,234,255,.72)),
    linear-gradient(0deg, rgba(0,234,255,.72), rgba(0,234,255,.72)),
    linear-gradient(90deg, rgba(0,234,255,.28), rgba(0,234,255,.28)),
    linear-gradient(0deg, rgba(0,234,255,.28), rgba(0,234,255,.28)),
    linear-gradient(90deg, rgba(0,234,255,.28), rgba(0,234,255,.28)),
    linear-gradient(0deg, rgba(0,234,255,.28), rgba(0,234,255,.28));
  background-repeat:no-repeat;
  background-size:100% 100%, 14px 1px, 1px 14px, 14px 1px, 1px 14px, 14px 1px, 1px 14px, 14px 1px, 1px 14px;
  background-position:center, top left, top left, top right, top right, bottom left, bottom left, bottom right, bottom right;
}
.panel-hd {
  flex-shrink:0; padding:10px 14px 8px; font-size:13px; font-weight:700;
  color:var(--text-bright); display:flex; align-items:center; gap:7px; letter-spacing:1px;
  position:relative; white-space:nowrap;
  background:linear-gradient(90deg, rgba(0,234,255,0.16), transparent 72%);
}
.panel-hd::after {
  content:''; position:absolute; left:14px; right:14px; bottom:0; height:1px;
  background:linear-gradient(90deg, rgba(0,234,255,0.85), rgba(0,234,255,0.10));
}
.hd-bar { width:4px; height:14px; border-radius:0; background:var(--cyan); box-shadow:0 0 8px rgba(0,234,255,0.55); flex-shrink:0 }
.hd-bar.g { background:var(--accent); box-shadow:0 0 8px rgba(25,217,139,.55) }
.hd-bar.y { background:var(--accent3); box-shadow:0 0 8px rgba(255,204,51,.55) }
.hd-bar.r { background:var(--accent4); box-shadow:0 0 8px rgba(255,77,90,.55) }

/* ===== 面板功能色（区分模块） ===== */
.panel.c-blue { border-color:rgba(92,124,255,0.32) }
.panel.c-blue .panel-hd { background:linear-gradient(90deg, rgba(92,124,255,0.16), transparent 72%) }
.panel.c-blue .panel-hd::after { background:linear-gradient(90deg, rgba(92,124,255,0.85), rgba(92,124,255,0.10)) }
.panel.c-blue .hd-bar { background:#5c7cff; box-shadow:0 0 8px rgba(92,124,255,.55) }
.panel.c-green { border-color:rgba(25,217,139,0.32) }
.panel.c-green .panel-hd { background:linear-gradient(90deg, rgba(25,217,139,0.16), transparent 72%) }
.panel.c-green .panel-hd::after { background:linear-gradient(90deg, rgba(25,217,139,0.85), rgba(25,217,139,0.10)) }
.panel.c-green .hd-bar { background:#19d98b; box-shadow:0 0 8px rgba(25,217,139,.55) }
.panel.c-yellow { border-color:rgba(255,204,51,0.32) }
.panel.c-yellow .panel-hd { background:linear-gradient(90deg, rgba(255,204,51,0.16), transparent 72%) }
.panel.c-yellow .panel-hd::after { background:linear-gradient(90deg, rgba(255,204,51,0.85), rgba(255,204,51,0.10)) }
.panel.c-yellow .hd-bar { background:#ffcc33; box-shadow:0 0 8px rgba(255,204,51,.55) }
.panel.c-purple { border-color:rgba(139,92,246,0.32) }
.panel.c-purple .panel-hd { background:linear-gradient(90deg, rgba(139,92,246,0.16), transparent 72%) }
.panel.c-purple .panel-hd::after { background:linear-gradient(90deg, rgba(139,92,246,0.85), rgba(139,92,246,0.10)) }
.panel.c-purple .hd-bar { background:#8b5cf6; box-shadow:0 0 8px rgba(139,92,246,.55) }
.panel-hd .extra { font-size:10px; color:var(--text-dim); font-weight:400; margin-left:auto }
.panel-bd { flex:1; padding:6px 14px 10px; overflow:hidden; min-height:0 }

/* ========== STAT CARDS ========== */
.stat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:10px; margin-bottom:10px }
.stat-card {
  background:rgba(8,24,48,0.88); backdrop-filter:blur(12px);
  border:1px solid rgba(40,199,111,0.10); border-radius:8px;
  padding:14px 18px; display:flex; justify-content:space-between; align-items:center;
  cursor:pointer; transition:all .25s ease;
}
.stat-card:hover { background:rgba(14,165,233,.10); border-color:rgba(14,165,233,.30); transform:translateY(-2px); box-shadow:0 4px 20px rgba(0,0,0,.30) }
.sc-val { font-size:24px; font-weight:700; color:var(--accent); font-family:"SF Mono","DIN Alternate","Consolas",monospace }
.sc-lbl { font-size:11px; color:var(--text-dim); margin-top:2px }
.sc-sub { font-size:10px; color:var(--text-dim); opacity:.6 }
.sc-icon { width:42px; height:42px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0 }
.stat-card.g .sc-val { color:var(--accent2) }
.stat-card.y .sc-val { color:var(--accent3) }
.stat-card.r .sc-val { color:var(--accent4) }

/* ========== DASHBOARD GRID ========== */
.dash-grid { display:flex; gap:12px; margin-bottom:8px; min-height:0 }
.dash-col { display:flex; flex-direction:column; gap:12px; min-height:0; width:20%; flex-shrink:0 }
.dash-center { flex:1; display:flex; flex-direction:column; gap:12px; min-width:0 }
.page-dashboard {
  height:100%; display:flex; flex-direction:column; margin-top:-10px; position:relative;
  background:
    radial-gradient(1100px 560px at 50% 42%, rgba(0,234,255,0.055), transparent 62%),
    radial-gradient(rgba(0,234,255,0.028) 1px, transparent 1px),
    linear-gradient(rgba(0,234,255,0.012) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,234,255,0.012) 1px, transparent 1px),
    #06172c;
  background-size:auto, 26px 26px, 52px 52px, 52px 52px, auto;
}
.page-dashboard::before {
  content:''; position:absolute; left:0; right:0; top:0; height:150px;
  background:linear-gradient(180deg, rgba(0,234,255,0) 0%, rgba(0,234,255,0.05) 50%, rgba(0,234,255,0) 100%);
  pointer-events:none; z-index:5000; opacity:0.7;
  animation:dashScan 48s linear infinite;
}
@keyframes dashScan {
  0% { transform:translateY(-150px); }
  100% { transform:translateY(100vh); }
}
.page-dashboard .dash-grid { flex:1 }
/* ========== DASH TITLE（冠头/顶梁） ========== */
.dash-top { flex-shrink:0; padding:0 4px 0 }
.dt-line { display:flex; align-items:center; margin-top:7px; }
.dt-rule { flex:1; display:flex; align-items:center; height:12px; min-width:0; }
.dr-text {
  font-size:10px; color:rgba(120,160,200,0.5); letter-spacing:1px; white-space:nowrap;
  font-family:"Times New Roman","Times",serif;
}
.dr-line {
  flex:1; height:1px; margin:0 14px; position:relative;
  background:linear-gradient(90deg, rgba(0,234,255,0.05), rgba(0,234,255,0.8));
  box-shadow:0 0 6px rgba(0,234,255,0.4);
}
.dt-rule-r .dr-line { background:linear-gradient(90deg, rgba(0,234,255,0.8), rgba(0,234,255,0.05)); }
.dr-tick { position:absolute; top:-3px; left:50%; width:1px; height:7px; background:rgba(0,234,255,0.5); }
.dr-node {
  width:9px; height:9px; background:rgba(0,234,255,0.95); transform:rotate(45deg);
  box-shadow:0 0 12px rgba(0,234,255,0.9); flex-shrink:0; margin:0 5px;
}
.dt-title { text-align:center; margin-top:2px; }
.dt-main {
  font-size:30px; font-weight:800; color:var(--text-bright); letter-spacing:6px;
  text-shadow:0 0 10px rgba(180,230,255,.32), 0 0 2px rgba(0,234,255,.35); white-space:nowrap; line-height:1.12;
}
.dt-sub {
  font-size:11px; color:var(--text-dim); letter-spacing:4px; margin-top:2px;
  font-family:"Times New Roman","Times",serif;
}
.dt-live { color:var(--cyan); font-style:normal; }
.dt-sep {
  height:1px; margin:7px 0 9px;
  background:linear-gradient(90deg, transparent, rgba(0,234,255,0.45), rgba(0,234,255,0.85), rgba(0,234,255,0.45), transparent);
  box-shadow:0 0 8px rgba(0,234,255,0.35);
}
.chart-box { width:100%; min-height:0 }
.mini-row { display:flex; gap:6px; margin-bottom:5px }
.mini-row:last-child { margin-bottom:0 }
.mini-s {
  flex:1; text-align:center; background:rgba(10,36,68,0.55);
  border:1px solid rgba(0,234,255,0.18); border-radius:6px; padding:4px 4px;
  position:relative; overflow:hidden;
  box-shadow:inset 0 0 12px rgba(0,234,255,0.06);
}
.mini-s::before {
  content:''; position:absolute; top:0; left:14%; right:14%; height:2px;
  background:linear-gradient(90deg, transparent, rgba(0,234,255,0.72), transparent);
}
.ms-v { font-size:14px; font-weight:700; color:var(--cyan); font-family:"Times New Roman","Times","Microsoft YaHei","PingFang SC",serif; text-shadow:0 0 8px rgba(0,234,255,0.30) }
.ms-l { font-size:8px; color:var(--text-dim); margin-top:0 }
.age-hd {
  display:flex; align-items:center; justify-content:space-between;
  margin:3px 0 3px; flex-shrink:0;
}
.age-hd-t { font-size:11px; color:var(--text-bright); font-weight:600; letter-spacing:1px }
.age-legend { font-size:9px; color:var(--text-dim); display:flex; align-items:center; gap:2px }
.lg-dot { width:8px; height:8px; display:inline-block; border-radius:2px; margin-left:8px; flex-shrink:0 }
.lg-dot:first-child { margin-left:0 }
.mini-s.g { border-color:rgba(25,217,139,0.34); box-shadow:inset 0 0 12px rgba(25,217,139,0.07) }
.mini-s.g::before { background:linear-gradient(90deg, transparent, var(--accent2), transparent) }
.mini-s.y { border-color:rgba(255,204,51,0.38); box-shadow:inset 0 0 12px rgba(255,204,51,0.07) }
.mini-s.y::before { background:linear-gradient(90deg, transparent, var(--accent3), transparent) }
.mini-s.r { border-color:rgba(255,77,90,0.38); box-shadow:inset 0 0 12px rgba(255,77,90,0.07) }
.mini-s.r::before { background:linear-gradient(90deg, transparent, var(--accent4), transparent) }
.mini-s.g .ms-v { color:var(--accent2) }
.mini-s.y .ms-v { color:var(--accent3) }
.mini-s.r .ms-v { color:var(--accent4) }

/* ========== MAP ========== */
.map-wrap {
  position:absolute; inset:0; overflow:hidden; background:#06172c;
  border:1px solid rgba(0,234,255,0.22);
  box-shadow:inset 0 0 26px rgba(0,234,255,0.07), inset 0 0 0 1px rgba(0,234,255,0.05);
}
.map-wrap::after {
  content:''; position:absolute; inset:0; z-index:450; pointer-events:none;
  background:radial-gradient(ellipse at center, transparent 52%, rgba(6,23,44,0.68) 100%);
}
.leaflet-map { width:100%; height:100%; position:absolute; top:0; left:0; background:#06172c; }
.leaflet-map .leaflet-tile { filter: invert(1) hue-rotate(180deg) brightness(0.76) contrast(0.88) saturate(0.38); }
.map-monitor-link {
  position:absolute; top:10px; left:10px; z-index:999;
  background:rgba(0,0,0,0.7); color:#00eaff; padding:6px 12px;
  border-radius:6px; font-size:11px; text-decoration:none;
  border:1px solid rgba(0,234,255,0.3); backdrop-filter:blur(8px)
}
.map-legend { position:absolute; top:10px; right:10px; display:flex; flex-direction:column; gap:6px; pointer-events:none; z-index:900; align-items:flex-end }
.map-lg { display:flex; align-items:center; gap:4px; font-size:9px; color:var(--text-dim) }
.map-lg .dot { width:7px; height:7px; border-radius:50% }

@keyframes livePulse {
  0% { transform:scale(1); opacity:1 }
  100% { transform:scale(2.5); opacity:0 }
}
@keyframes dotBreathe {
  0%, 100% { transform:scale(1); opacity:1 }
  50% { transform:scale(1.3); opacity:0.8 }
}

.marquee-bar {
  flex-shrink:0; height:24px; display:flex; align-items:center;
  background:rgba(8,24,48,0.88); backdrop-filter:blur(12px);
  border:1px solid var(--panel-border); border-radius:6px; padding:0 12px; overflow:hidden;
}
.marquee-text { font-size:10px; color:var(--cyan); white-space:nowrap; animation:marquee 28s linear infinite }
@keyframes marquee {
  0% { transform:translateX(0) }
  100% { transform:translateX(-50%) }
}

/* ========== FLOAT BADGES ========== */
.float-badge {
  position:absolute; background:rgba(0,180,240,.15); color:var(--accent);
  font-size:9px; padding:2px 8px; border-radius:10px;
  border:1px solid rgba(0,180,240,.25); pointer-events:none;
  animation:float 3s ease-in-out infinite;
}
@keyframes float {
  0%,100% { transform:translateY(0) }
  50% { transform:translateY(-4px) }
}

/* ========== ALERT LIST ========== */
.alert-list { height:100%; overflow:hidden; }
.alert-scroll { display:flex; flex-direction:column; animation:alertUp 12s linear infinite; }
.alert-scroll:hover { animation-play-state:paused; }
.alert-item {
  display:flex; align-items:flex-start; gap:8px; padding:6px 9px; margin-bottom:6px; border-radius:6px;
  background:rgba(10,36,68,0.55); border-left:2px solid var(--cyan); cursor:pointer; transition:.2s; flex-shrink:0;
}
.alert-item:hover { background:rgba(14,165,233,.08) }
.alert-item.active { background:rgba(0,234,255,.12); border-left-color:var(--cyan); box-shadow:inset 0 0 12px rgba(0,234,255,.15) }
.alert-item.lvl-info { border-left-color:var(--cyan) }
.alert-item.lvl-warning { border-left-color:var(--accent3) }
.alert-item.lvl-danger { border-left-color:var(--accent4) }
.ai-ico { font-size:14px; flex-shrink:0; line-height:1.3 }
.ai-body { flex:1; min-width:0 }
.ai-title { font-size:11px; font-weight:600; color:var(--text-bright); white-space:nowrap; overflow:hidden; text-overflow:ellipsis }
.ai-meta { display:flex; align-items:center; justify-content:space-between; gap:6px; margin-top:2px }
.ai-desc { font-size:10px; color:var(--text-dim); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0 }
.ai-time { font-size:9px; color:var(--text-dim); opacity:.5; flex-shrink:0 }
@keyframes alertUp { 0% { transform:translateY(0) } 100% { transform:translateY(-50%) } }

/* ========== AI PANEL ========== */
.ai-panel { display:flex; flex-direction:column; gap:8px }
.ai-hud { display:flex; align-items:center; gap:10px }
.ai-ring {
  width:50px; height:50px; border-radius:50%; flex-shrink:0;
  border:2px solid rgba(0,234,255,0.28); position:relative;
  display:flex; align-items:center; justify-content:center;
  background:radial-gradient(circle at 50% 38%, rgba(0,234,255,0.18), rgba(6,23,44,0.35) 72%);
  box-shadow:0 0 14px rgba(0,234,255,0.35), inset 0 0 10px rgba(0,234,255,0.16);
}
.ai-ring::before {
  content:''; position:absolute; inset:-4px; border-radius:50%;
  border:2px solid transparent;
  border-top-color:var(--cyan); border-right-color:rgba(0,234,255,0.35);
  animation:spin 2.6s linear infinite;
}
.ai-ring::after {
  content:''; position:absolute; inset:3px; border-radius:50%;
  border:1px solid transparent;
  border-bottom-color:rgba(92,124,255,0.75); border-left-color:rgba(92,124,255,0.3);
  animation:spin 1.8s linear infinite reverse;
}
.ai-ring-core { font-size:13px; font-weight:800; color:var(--cyan); letter-spacing:1px; font-family:"Times New Roman","Times",serif; text-shadow:0 0 8px rgba(0,234,255,0.8) }
.ai-stats { flex:1; display:flex; gap:8px; min-width:0 }
.ai-stat {
  flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px;
  padding:8px 2px; background:rgba(12,40,74,0.45); border:1px solid rgba(0,234,255,0.14); border-radius:6px;
}
.ai-stat-l { font-size:10px; color:var(--text-dim) }
.ai-stat-v { font-size:20px; font-weight:700; font-family:"Times New Roman","Times","Microsoft YaHei","PingFang SC",serif; text-shadow:0 0 8px rgba(0,234,255,0.25) }
.ai-conclusion { background:rgba(0,234,255,0.06); border:1px solid rgba(0,234,255,0.20); border-radius:6px; padding:8px 10px; margin-top:2px }
.ac-label { font-size:9px; color:var(--cyan); font-weight:600; margin-bottom:3px; letter-spacing:1px }
.ac-text { font-size:10px; color:var(--text-bright); line-height:1.5 }

/* ========== IOT ROW ========== */
.iot-list { height:100%; overflow:hidden; }
.iot-scroll { display:flex; flex-direction:column; animation:iotUp 15s linear infinite; }
.iot-scroll:hover { animation-play-state:paused; }
.iot-row { display:flex; align-items:center; gap:6px; padding:3px 0; cursor:pointer; flex-shrink:0 }
@keyframes iotUp { 0% { transform:translateY(0) } 100% { transform:translateY(-50%) } }
.iot-row:hover { background:rgba(14,165,233,.05); border-radius:4px }
.iot-st { margin-left:auto; color:var(--text-dim) }
.iot-st.warn { color:var(--accent3) }
.iot-st.offline { color:var(--accent4) }
.dot { width:7px; height:7px; border-radius:50%; flex-shrink:0 }
.dot.online { background:var(--accent2); box-shadow:0 0 5px var(--accent2); animation:dotBreathe 2.4s ease-in-out infinite }
.dot.warn { background:var(--accent3); box-shadow:0 0 5px var(--accent3) }
.dot.offline { background:var(--accent4) }

/* ========== BOTTOM ROW (HUD DATA BAND) ========== */
.bot-row {
  display:flex; height:80px; flex-shrink:0;
  background:linear-gradient(180deg, rgba(11,36,70,0.55), rgba(5,18,38,0.45)); backdrop-filter:blur(14px);
  position:relative;
}
.bot-row::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg, transparent, rgba(0,234,255,.5), transparent) }
.bot-row::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1px; background:linear-gradient(90deg, transparent, rgba(0,234,255,.3), transparent) }
.bot-item {
  flex:1; display:flex; align-items:center; justify-content:center; gap:10px;
  cursor:pointer; transition:background .2s; border-left:1px solid rgba(0,234,255,.12);
}
.bot-item:first-child { border-left:none }
.bot-item:hover { background:rgba(0,234,255,.06) }
.bl { font-size:11px; color:rgba(109,138,168,0.8) }
.bv { font-size:28px; font-weight:700; color:var(--cyan); font-family:"Times New Roman","Times","Microsoft YaHei","PingFang SC",serif; text-shadow:0 0 12px rgba(0,234,255,.35) }
.bt { font-size:12px; font-weight:600 }
.bt.up { color:var(--accent) }
.bt.good { color:var(--accent) }
.bt.flat { color:var(--text-dim) }
.bt.down { color:var(--accent4) }

/* ========== MODULE CARDS ========== */
.module-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:10px }
.module-card {
  background:rgba(8,24,48,0.88); backdrop-filter:blur(12px);
  border:1px solid rgba(40,199,111,0.08); border-radius:8px;
  padding:18px; cursor:pointer; transition:all .3s; position:relative; overflow:hidden;
}
.module-card:hover { background:rgba(14,165,233,.08); border-color:rgba(14,165,233,.3); transform:translateY(-2px); box-shadow:0 8px 30px rgba(0,0,0,.3) }
.module-card h4 { font-size:14px; font-weight:700; color:var(--text-bright); margin-bottom:4px }
.module-card p { font-size:11px; color:var(--text-dim); line-height:1.5; margin-bottom:10px }
.mc-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:10px }
.mc-tags { display:flex; flex-wrap:wrap; gap:5px }
.mc-arrow { position:absolute; right:16px; top:50%; transform:translateY(-50%); color:var(--accent); font-size:18px; opacity:0; transition:.3s }
.module-card:hover .mc-arrow { opacity:1; right:12px }

.tag { padding:3px 8px; border-radius:10px; font-size:10px; font-weight:500 }
.tag.blue { background:rgba(57,217,138,0.12); color:var(--accent) }
.tag.green { background:rgba(16,214,160,.15); color:var(--accent2) }
.tag.yellow { background:rgba(245,158,11,.15); color:var(--accent3) }
.tag.red { background:rgba(239,68,68,.15); color:var(--accent4) }

/* ========== TABS ========== */
.tabs { display:flex; gap:3px; background:rgba(10,60,130,.1); padding:3px; border-radius:8px; margin-bottom:12px }
.tab {
  padding:6px 16px; border-radius:6px; font-size:11px; cursor:pointer; transition:all .2s;
  border:none; background:none; color:var(--text-dim); font-weight:500; font-family:inherit;
}
.tab.active { background:rgba(57,217,138,0.20); color:var(--accent); font-weight:700 }
.tab:hover { color:var(--text) }

/* ========== TABLES ========== */
.data-table { width:100%; border-collapse:collapse }
.data-table th, .data-table td { padding:10px 14px; text-align:left; font-size:11px }
.data-table th { background:rgba(10,100,180,.1); font-weight:600; color:var(--text-dim); border-bottom:2px solid rgba(57,217,138,0.10); font-size:10px; letter-spacing:.5px }
.data-table td { border-bottom:1px solid rgba(255,255,255,0.03) }
.data-table tr:hover td { background:rgba(14,165,233,.05); cursor:pointer }

.st { display:inline-block; padding:3px 9px; border-radius:10px; font-size:10px; font-weight:600 }
.st.online { background:rgba(16,214,160,.15); color:var(--accent2) }
.st.offline { background:rgba(239,68,68,.15); color:var(--accent4) }
.st.warning { background:rgba(245,158,11,.15); color:var(--accent3) }
.st.info { background:rgba(57,217,138,0.12); color:var(--accent) }

/* ========== SERVICE GRID ========== */
.five-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px }
.svc-card {
  text-align:center; padding:16px 10px; background:rgba(10,36,68,0.55);
  border:1px solid rgba(40,199,111,0.08); border-radius:8px; cursor:pointer; transition:all .25s;
}
.svc-card:hover { background:rgba(14,165,233,.08); border-color:rgba(57,217,138,0.25); transform:translateY(-2px) }
.svc-card .sv { font-size:30px; display:block; margin-bottom:6px }
.svc-card .sn { font-size:12px; font-weight:600; color:var(--text-bright) }
.svc-card .sd { font-size:10px; color:var(--text-dim); margin-top:3px }

/* ========== CHAT ========== */
.chat-wrapper { background:rgba(10,36,68,0.55); border-radius:8px; padding:16px; min-height:80px }
.chat-area { display:flex; flex-direction:column; gap:8px; max-height:200px; overflow-y:auto; margin-bottom:10px }
.chat-msg { padding:8px 12px; border-radius:8px; font-size:11px; max-width:85%; line-height:1.5 }
.chat-msg.ai { align-self:flex-start; background:rgba(57,217,138,0.10); color:#f0f4fa; border:1px solid rgba(57,217,138,0.12); border-radius:10px 10px 10px 2px }
.chat-msg.user { align-self:flex-end; background:rgba(57,217,138,0.18); color:#f0f4fa; border:1px solid rgba(57,217,138,0.20); border-radius:10px 10px 2px 10px }
.chat-input-row { display:flex; gap:8px }

.input {
  flex:1; background:rgba(10,60,130,.15); border:1px solid rgba(14,165,233,0.18);
  border-radius:20px; padding:8px 12px; font-size:12px; color:var(--text);
  outline:none; transition:.2s; font-family:inherit;
}
.input:focus { border-color:rgba(14,165,233,.5); box-shadow:0 0 8px rgba(14,165,233,0.1) }
.input::placeholder { color:var(--text-dim) }

.btn {
  display:inline-flex; align-items:center; gap:6px; padding:8px 18px; border-radius:20px;
  font-size:12px; font-weight:600; cursor:pointer; transition:all .25s ease;
  border:none; font-family:inherit; letter-spacing:.5px; line-height:1.4;
}
.btn-primary { background:linear-gradient(135deg,#39D98A,#28C76F); color:#fff; box-shadow:0 2px 10px rgba(57,217,138,0.25) }
.btn-primary:hover { box-shadow:0 4px 20px rgba(57,217,138,0.40); transform:translateY(-2px) }
.btn-outline { background:transparent; border:1px solid rgba(14,165,233,0.28); color:var(--accent) }
.btn-outline:hover { background:rgba(14,165,233,.08) }

/* ========== IOT ACTIONS ========== */
.iot-actions { display:flex; flex-direction:column; gap:8px }
.iot-actions .btn { width:100%; text-align:left; font-size:11px; border-radius:8px; justify-content:flex-start }

/* ========== ASSETS ========== */
.asset-list { display:flex; flex-direction:column; gap:10px }
.asset-row { display:flex; align-items:center; gap:10px }
.asset-row span { width:80px; text-align:right; font-size:11px; color:var(--text-dim) }
.asset-row b { font-size:11px; font-weight:600; color:var(--text-bright) }

.progress-bar { flex:1; height:7px; background:rgba(14,165,233,0.08); border-radius:6px; overflow:hidden }
.progress-fill { display:block; height:100%; border-radius:6px; transition:width .8s ease }
.progress-fill.g { background:linear-gradient(90deg,var(--accent),#22d3ee) }

/* ========== TECH GRID ========== */
.tech-grid { display:grid; grid-template-columns:1fr 1fr; gap:4px 16px }
.tech-label { color:var(--text-dim) }
.tech-val { color:var(--text-bright) }

/* ========== LEADERSHIP ========== */
.leader-grid-wrap { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:16px }
.leader-card-panel { padding:20px; display:flex; gap:16px; align-items:stretch; min-height:300px; cursor:pointer; transition:all .3s; text-align:left }
.leader-card-panel:hover { border-color:rgba(34,181,115,0.35)!important; box-shadow:0 8px 24px rgba(0,0,0,0.10); transform:translateY(-3px) }
.leader-photo { width:88px; height:88px; border-radius:50%; object-fit:cover; flex-shrink:0; align-self:flex-start; border:2px solid #E3EAF0; background:#F0F3F6 }
.leader-info { flex:1; min-width:0; display:flex; flex-direction:column }
.leader-name { font-size:18px; font-weight:700; color:#1F2D3D; margin-bottom:6px; line-height:1.3 }
.leader-title { font-size:14px; font-weight:600; color:#475867; margin-bottom:10px; line-height:1.5 }
.leader-duty { font-size:15px; color:#475867; margin-bottom:10px; line-height:1.6 }
.leader-phone { font-size:14px; color:#66788A; margin-bottom:14px }
.leader-actions { display:flex; gap:8px; margin-top:auto; padding-top:12px; flex-wrap:wrap }

/* 村委便民联系（底部横向卡：信息在左，操作在右） */
.village-office-card { display:flex; flex-direction:column; gap:10px; padding:14px 20px }
.vo-title { font-size:16px; font-weight:700; color:#1F2D3D }
.vo-meta { display:flex; flex-wrap:wrap; gap:6px 22px; font-size:13px; color:#475867 }
.vo-item { display:inline-flex; align-items:center; gap:4px; white-space:nowrap }
.vo-ic { color:#66788A }
.vo-foot { display:flex; align-items:center; gap:12px; justify-content:space-between; flex-wrap:wrap }
.vo-tip { font-size:12px; color:#66788A; flex:1; min-width:0 }
.vo-actions { display:flex; gap:8px; flex-shrink:0 }

/* 今日值班（标题下小卡） */
.duty-strip { display:flex; align-items:center; gap:10px; flex-wrap:wrap; background:#F0F7F3; border:1px solid #CBE4D8; border-radius:8px; padding:10px 14px }
.duty-strip .btn { margin-left:auto }
.duty-label { font-size:13px; font-weight:700; color:#1E7A54 }
.duty-name { font-size:15px; font-weight:700; color:#1F2D3D }
.duty-title { font-size:13px; color:#66788A }
.duty-phone { font-size:14px; color:#475867 }

/* 快速找人（核心） */
.guide-panel { padding:18px 20px; margin-bottom:16px }
.guide-title { font-size:16px; font-weight:700; color:#1F2D3D; margin-bottom:4px }
.guide-sub { font-size:13px; color:#66788A; margin-bottom:12px }
.guide-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:10px }
.guide-item { display:flex; flex-direction:column; gap:8px; padding:12px 14px; background:#F7FAF9; border:1px solid #E3EAF0; border-radius:8px; cursor:pointer; transition:all .2s }
.guide-item:hover { border-color:#22B573; background:rgba(34,181,115,0.06); transform:translateY(-2px) }
.gi-top { display:flex; align-items:center; gap:6px; min-width:0 }
.gi-icon { font-size:16px; flex-shrink:0 }
.gi-label { font-size:14px; color:#1F2D3D; font-weight:700; white-space:nowrap }
.gi-bottom { display:flex; align-items:center; gap:6px; min-width:0 }
.gi-officer { font-size:12px; color:#66788A; white-space:nowrap; overflow:hidden; text-overflow:ellipsis }
.gi-name { font-size:12px; color:#22B573; font-weight:700 }
.gi-arrow { font-size:13px; color:#22B573; font-weight:700; margin-left:auto; flex-shrink:0 }

/* 我的留言（个人办事记录，首页最多3条） */
.my-msg-card { padding:16px 20px 6px; margin-bottom:14px }
.mmc-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; cursor:pointer }
.mmc-title { font-size:16px; font-weight:700; color:#1F2D3D }
.mmc-all { font-size:13px; color:#19B98A; font-weight:600 }
.mmc-stats { display:flex; align-items:center; gap:8px; font-size:13px; color:#66788A; margin-bottom:10px }
.mmc-stat b { color:#1F2D3D; font-weight:700; margin-left:2px }
.mmc-sep { color:#D0D7DE }
.mmc-empty { padding:18px 0; text-align:center; font-size:13px; color:#66788A }
.mmc-list { border-top:1px solid #F0F3F5 }
.mmc-item { padding:12px 0; border-bottom:1px solid #F0F3F5; cursor:pointer }
.mmc-item:last-child { border-bottom:none }
.mmc-item-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px }
.mmc-cat { font-size:12px; color:#66788A }
.mmc-pill { font-size:11px; font-weight:600; padding:2px 10px; border-radius:12px }
.mmc-content { font-size:14px; color:#1F2D3D; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:6px }
.mmc-item-bottom { display:flex; align-items:center; justify-content:space-between }
.mmc-time { font-size:12px; color:#8A97A5 }
.mmc-link { font-size:12px; color:#19B98A; font-weight:600 }

.leader-detail-section { animation:pageIn .45s cubic-bezier(.25,.46,.45,.94) }
.section-label { font-size:12px; font-weight:700; color:var(--tb); margin-bottom:6px }

/* ========== REVIEW ITEMS ========== */
.review-item { background:rgba(10,36,68,0.55); border-radius:8px; padding:10px 12px; margin-bottom:8px }
.review-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:4px }
.review-name { font-size:12px; font-weight:600; color:var(--text-bright) }
.review-stars { color:var(--accent3); font-size:11px }
.review-text { font-size:11px; color:var(--text-dim) }

/* ========== DEVICE CENTER ========== */
.device-center-wrap { display:flex; align-items:center; justify-content:center; height:100%; min-height:60vh }
.device-center-inner { text-align:center }

/* ========== 设备中心（运行总览 + IoT 管理 + 视频监控宫格）— 浅色农户风 ========== */
.device-entry-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px }
.device-entry {
  display:flex; align-items:center; gap:16px;
  background:#FFFFFF; border:1px solid #E3EAF0;
  border-radius:12px; padding:22px 24px; cursor:pointer; transition:all .25s; position:relative; overflow:hidden;
  box-shadow:0 1px 4px rgba(0,0,0,0.05);
}
.device-entry:hover { border-color:#22B573; transform:translateY(-2px); box-shadow:0 6px 16px rgba(0,0,0,0.08) }
.device-entry .de-icon { width:56px; height:56px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:28px; flex-shrink:0 }
.device-entry .de-body { flex:1; min-width:0 }
.de-title { font-size:20px; font-weight:700; color:#1F2D3D; margin-bottom:2px }
.de-count { font-size:16px; color:#475867; margin-bottom:6px }
.de-status { font-size:15px; font-weight:600; margin-bottom:6px }
.de-desc { font-size:15px; color:#66788A; line-height:1.5 }
.de-arrow { font-size:15px; color:#22B573; font-weight:600; white-space:nowrap }

.device-alert-item { display:flex; align-items:center; gap:12px; padding:11px 0; border-bottom:1px solid #EBEFF4 }
.device-alert-item:last-child { border-bottom:none }
.dai-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0 }
.dai-dot.warning { background:#F2A62B }
.dai-dot.offline { background:#E05252 }
.dai-device { font-size:16px; color:#1F2D3D; font-weight:600 }
.dai-issue { font-size:15px; color:#66788A }
.dai-time { margin-left:auto; font-size:15px; color:#8A97A5; flex-shrink:0 }

.device-filter-tabs { display:flex; gap:8px; flex-wrap:wrap }
.device-filter-btn { padding:8px 18px; border-radius:999px; border:1px solid #E3EAF0; background:#FFFFFF; color:#66788A; font-size:15px; cursor:pointer; transition:all .2s }
.device-filter-btn:hover { border-color:#22B573; color:#22B573 }
.device-filter-btn.active { background:#22B573; border-color:#22B573; color:#fff; font-weight:600 }

.device-search { display:flex; align-items:center; gap:6px; background:#FFFFFF; border:1px solid #E3EAF0; border-radius:8px; padding:8px 12px; min-width:220px }
.device-search span { font-size:14px }
.device-search input { background:none; border:none; outline:none; color:#1F2D3D; font-size:15px; width:100% }
.device-search input::placeholder { color:#A0AFC0 }

.device-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px }
.device-card { display:flex; flex-direction:column; gap:6px; background:#FFFFFF; border:1px solid #E3EAF0; border-radius:12px; padding:16px; cursor:pointer; transition:all .2s; box-shadow:0 1px 3px rgba(0,0,0,0.04) }
.device-card:hover { border-color:#22B573; transform:translateY(-2px); box-shadow:0 6px 16px rgba(0,0,0,0.08) }
.devc-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:2px }
.devc-icon { width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0 }
.devc-name { font-size:17px; font-weight:700; color:#1F2D3D; line-height:1.35 }
.devc-meta { font-size:13px; color:#8A97A5 }
.devc-metric { font-size:15px; color:#475867; font-weight:600; flex:1 }
.devc-foot { display:flex; align-items:center; justify-content:space-between; margin-top:4px; padding-top:10px; border-top:1px solid #EBEFF4 }
.devc-time { font-size:13px; color:#8A97A5 }
.devc-go { font-size:14px; color:#22B573; font-weight:600 }
.device-empty { grid-column:1/-1; text-align:center; padding:40px 0; color:#66788A; font-size:16px; background:#FAFBFC; border:1px dashed #D0D8E2; border-radius:12px }
@media (max-width:1400px) { .device-grid { grid-template-columns:repeat(3,1fr) } }
@media (max-width:1000px) { .device-grid { grid-template-columns:repeat(2,1fr) } }
@media (max-width:640px) { .device-grid { grid-template-columns:1fr } }

.camera-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px }
.camera-card { background:#FFFFFF; border:1px solid #E3EAF0; border-radius:12px; overflow:hidden; cursor:pointer; transition:all .2s; box-shadow:0 1px 3px rgba(0,0,0,0.04) }
.camera-card:hover { border-color:#22B573; transform:translateY(-2px); box-shadow:0 6px 16px rgba(0,0,0,0.08) }
.cam-preview { position:relative; aspect-ratio:16/9; overflow:hidden; background:#0a0d10 }
.cam-scene { position:absolute; inset:0 }
.cam-scene svg { display:block; width:100%; height:100% }
.cam-osd { position:absolute; inset:0; padding:7px 9px; display:flex; flex-direction:column; justify-content:space-between; pointer-events:none }
.cam-osd-top, .cam-osd-bot { display:flex; align-items:center; justify-content:space-between }
.cam-osd-id { font-size:11px; font-family:"Consolas","SF Mono",monospace; color:#fff; background:rgba(0,0,0,0.5); padding:2px 6px; border-radius:3px; letter-spacing:.5px }
.cam-osd-live { font-size:11px; font-weight:700; color:#fff; display:inline-flex; align-items:center; gap:5px; background:rgba(0,0,0,0.5); padding:2px 7px; border-radius:3px }
.cam-osd-live .dot { display:inline-block; width:7px; height:7px; border-radius:50% }
.cam-osd-live.on .dot { background:#ff4d4f; animation:camBlink 1.1s infinite }
.cam-osd-live.off .dot { background:#9aa7b0 }
.cam-osd-time { font-size:11px; font-family:"Consolas","SF Mono",monospace; color:#fff; background:rgba(0,0,0,0.5); padding:2px 6px; border-radius:3px; letter-spacing:.5px }
.cam-osd-res { font-size:11px; color:#fff; background:rgba(0,0,0,0.5); padding:2px 6px; border-radius:3px }
@keyframes camBlink { 0%,100% { opacity:1 } 50% { opacity:.15 } }
.cam-foot { padding:12px 14px }
.cam-name { font-size:16px; font-weight:700; color:#1F2D3D; margin-bottom:2px }
.cam-loc { font-size:14px; color:#66788A; margin-bottom:8px }
.cam-btn { display:inline-block; font-size:15px; color:#22B573; font-weight:600 }

@media (max-width:1400px) { .camera-grid { grid-template-columns:repeat(3,1fr) } }
@media (max-width:1000px) { .camera-grid { grid-template-columns:repeat(2,1fr) } .device-entry-grid { grid-template-columns:1fr } }
@media (max-width:640px) { .camera-grid { grid-template-columns:1fr } }

/* ========== DETAIL PANEL ========== */
.detail-panel {
  position:fixed; top:0; right:0; bottom:0; width:420px; z-index:200;
  background:rgba(6,20,44,0.97); border-left:1px solid rgba(40,199,111,0.10);
  transform:translateX(100%); transition:transform .35s cubic-bezier(.4,0,.2,1);
  display:flex; flex-direction:column; backdrop-filter:blur(16px);
  box-shadow:-8px 0 40px rgba(0,0,0,.5);
}
.detail-panel.open { transform:translateX(0) }
.detail-hd {
  flex-shrink:0; display:flex; align-items:center; justify-content:space-between;
  padding:14px 18px; border-bottom:1px solid rgba(40,199,111,0.06); position:relative;
}
.detail-hd h3 { font-size:15px; font-weight:700; color:var(--text-bright); letter-spacing:1px }
.detail-close {
  width:30px; height:30px; border-radius:50%; border:1px solid rgba(40,199,111,0.10);
  background:rgba(10,60,130,.2); color:var(--text); cursor:pointer;
  display:flex; align-items:center; justify-content:center; font-size:16px; transition:.2s;
}
.detail-close:hover { background:rgba(239,68,68,.2); border-color:var(--accent4); color:var(--accent4) }
.detail-bd { flex:1; overflow-y:auto; padding:16px 18px }
.detail-bd::-webkit-scrollbar { width:3px }
.detail-bd::-webkit-scrollbar-thumb { background:rgba(57,217,138,0.12); border-radius:2px }
.detail-section { margin-bottom:18px }
.detail-section h4 { font-size:12px; font-weight:700; color:var(--accent); margin-bottom:8px; letter-spacing:1px; display:flex; align-items:center; gap:6px }
.detail-section h4::before { content:''; width:3px; height:12px; background:var(--accent); border-radius:2px }
.detail-field { display:flex; justify-content:space-between; padding:7px 0; border-bottom:1px solid rgba(14,165,233,0.06); font-size:11px }
.df-lbl { color:var(--text-dim) }
.df-val { color:var(--text-bright); font-weight:500; text-align:right }
.detail-actions { display:flex; gap:8px; margin-top:16px }

/* ========== MODAL ========== */
.modal {
  position:fixed; inset:0; z-index:300; display:flex; align-items:center; justify-content:center;
  opacity:0; pointer-events:none; transition:opacity .3s;
}
.modal.show { opacity:1; pointer-events:auto }
.modal-bg { position:absolute; inset:0; background:rgba(0,0,0,.6) }
.modal-box {
  position:relative; background:rgba(6,22,46,.98); border:1px solid var(--panel-border);
  border-radius:8px; padding:24px; width:500px; max-width:90vw; max-height:80vh; overflow-y:auto;
  box-shadow:0 20px 60px rgba(0,0,0,.6);
}
.modal-box h3 { font-size:16px; font-weight:700; color:var(--text-bright); margin-bottom:16px; letter-spacing:1px }

/* ========== 告警详情弹窗（数字孪生科技风）========== */
.modal-box.modal-alert {
  border-radius:0; padding:22px 24px 20px; width:430px;
  border:1px solid rgba(0,234,255,0.18);
  background:linear-gradient(180deg, rgba(11,34,66,0.98), rgba(6,22,46,0.98));
  box-shadow:0 20px 60px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(0,234,255,0.04);
}
.modal-box.modal-alert::before {
  content:''; position:absolute; top:0; left:0; right:0; height:1px;
  background:linear-gradient(90deg, transparent, rgba(0,234,255,0.55), transparent);
}
.ad-head { display:flex; align-items:center; gap:10px; padding-right:34px; padding-bottom:14px; margin-bottom:14px; border-bottom:1px solid rgba(0,234,255,0.10); }
.ad-ico { font-size:20px; flex-shrink:0; }
.ad-title { font-size:17px; font-weight:700; color:var(--text-bright); letter-spacing:1px; }
.ad-badge { margin-left:auto; flex-shrink:0; font-size:11px; font-weight:600; padding:3px 11px; border-radius:10px; border:1px solid; letter-spacing:1px; }
.ad-sec { margin-bottom:16px; }
.ad-sec-hd { font-size:12px; font-weight:700; color:var(--cyan); letter-spacing:1px; margin-bottom:6px; display:flex; align-items:center; gap:6px; }
.ad-sec-hd::before { content:''; width:3px; height:12px; background:var(--cyan); border-radius:2px; }
.ad-field { display:flex; justify-content:space-between; align-items:center; padding:7px 2px; border-bottom:1px solid rgba(0,234,255,0.06); font-size:12px; }
.ad-field:last-child { border-bottom:none; }
.ad-lbl { color:var(--text-dim); flex-shrink:0; }
.ad-val { color:var(--text-bright); text-align:right; font-weight:500; }
.ad-prog { display:flex; align-items:center; padding:8px 2px; }
.ad-step { display:flex; align-items:center; gap:6px; flex-shrink:0; }
.ad-dot { width:9px; height:9px; border-radius:50%; background:rgba(109,138,168,0.30); flex-shrink:0; }
.ad-step-t { font-size:12px; letter-spacing:1px; }
.ad-line { flex:1; height:1px; background:rgba(109,138,168,0.22); margin:0 12px; min-width:20px; }
.ad-actions { display:flex; justify-content:flex-end; gap:10px; margin-top:6px; padding-top:4px; }
.modal-box.modal-alert .btn-primary { background:linear-gradient(135deg, rgba(0,234,255,0.85), rgba(0,180,220,0.90)); box-shadow:0 2px 10px rgba(0,234,255,0.18); }
.modal-box.modal-alert .btn-primary:hover { box-shadow:0 4px 18px rgba(0,234,255,0.32); }
.modal-box.modal-alert .btn-outline { border-color:rgba(0,234,255,0.30); color:#00eaff; }
.modal-box.modal-alert .btn-outline:hover { background:rgba(0,234,255,0.08); }

/* ========== TOAST ========== */
.toast-container { position:fixed; top:20px; right:20px; z-index:999; display:flex; flex-direction:column; gap:8px; pointer-events:none }
.toast {
  padding:10px 18px; border-radius:6px; font-size:12px; font-weight:600;
  color:#fff; pointer-events:auto; box-shadow:0 8px 24px rgba(0,0,0,.4);
  max-width:320px; animation:slideIn .3s ease;
}
.toast-info { background:linear-gradient(135deg,#28C7FA,#0AB4E8) }
.toast-success { background:linear-gradient(135deg,#39D98A,#28C76F) }
.toast-warn { background:linear-gradient(135deg,#d97706,#f59e0b) }
.toast-error { background:linear-gradient(135deg,#dc2626,#ef4444) }
@keyframes slideIn { from { transform:translateX(120%); opacity:0 } to { transform:translateX(0); opacity:1 } }

/* ========== ANIMATIONS ========== */
.page-content { animation:pageIn .45s cubic-bezier(.25,.46,.45,.94) }
@keyframes pageIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
@keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }

/* ========== GOVERNANCE QUICK BAR ========== */
.gov-quick-bar { display:flex; gap:10px; margin-bottom:12px; flex-wrap:wrap }
.gov-qbtn {
  flex:1; min-width:120px; display:flex; align-items:center; justify-content:center; gap:6px;
  padding:12px 16px; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer;
  transition:all .25s; font-family:inherit; letter-spacing:.5px;
  background:rgba(8,24,48,0.88); border:1px solid rgba(40,199,111,0.12); color:#B7D3E8;
}
.gov-qbtn:hover { background:rgba(14,165,233,.10); border-color:rgba(40,199,111,0.30); color:#fff; transform:translateY(-2px); box-shadow:0 4px 16px rgba(0,0,0,.30) }
.gov-qbtn.primary { background:linear-gradient(135deg,rgba(57,217,138,0.20),rgba(40,199,111,0.12)); border-color:rgba(57,217,138,0.25); color:#39D98A }
.gov-qbtn.primary:hover { background:linear-gradient(135deg,rgba(57,217,138,0.30),rgba(40,199,111,0.20)) }
.qbtn-icon { font-size:16px }

/* ========== REPORT QUICK CATEGORIES ========== */
.report-cat-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:10px }
.report-cat {
  display:flex; flex-direction:column; align-items:center; gap:4px;
  padding:10px 8px; background:#FFFFFF; border:1px solid #E3EAF0; border-radius:10px;
  cursor:pointer; transition:all .2s; text-align:center;
}
.report-cat:hover { background:rgba(25,185,138,0.05); border-color:#19B98A; transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.06) }
.report-cat .rc-icon { font-size:24px; line-height:1 }
.report-cat .rc-label { font-size:12px; font-weight:600; color:#1F2D3D }
@media (max-width:640px) { .report-cat-grid { grid-template-columns:repeat(2, 1fr) } .leader-grid-wrap { grid-template-columns:1fr } .guide-grid { grid-template-columns:repeat(2,1fr) } }

/* ========== GOVERNANCE NEWS ITEMS ========== */
.gov-news-item {
  display:flex; align-items:center; gap:10px; padding:8px 10px;
  background:rgba(10,36,68,0.40); border-radius:6px; margin-bottom:6px;
  cursor:pointer; transition:all .2s; border:1px solid transparent;
}
.gov-news-item:hover { background:rgba(14,165,233,.08); border-color:rgba(40,199,111,0.15) }
.gov-news-item:last-child { margin-bottom:0 }
.gni-left { flex-shrink:0 }
.gni-type { display:inline-block; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:600; color:#fff }
.gni-icon-big { font-size:20px }
.gni-mid { flex:1; min-width:0 }
.gni-loc { font-size:11px; color:#D0E4F5; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis }
.gni-time { font-size:10px; color:#6F91A8; margin-top:1px }
.gni-right { flex-shrink:0 }


/* ========== GRID WORKER CARD ========== */
.grid-worker-card {
  display:flex; align-items:center; gap:14px; flex-wrap:wrap;
  padding:4px 0;
}
.gw-avatar {
  width:52px; height:52px; border-radius:50%;
  background:linear-gradient(135deg,#28C7FA,#39D98A);
  display:flex; align-items:center; justify-content:center;
  font-size:20px; font-weight:700; color:#fff; flex-shrink:0;
  box-shadow:0 0 16px rgba(40,199,111,0.25);
}
.gw-info { flex:1; min-width:180px }
.gw-name { font-size:14px; font-weight:700; color:#fff; margin-bottom:4px }
.gw-role { font-size:10px; font-weight:400; color:#28C7FA; background:rgba(40,199,250,0.10); padding:2px 8px; border-radius:10px; margin-left:6px }
.gw-meta { display:flex; gap:12px; flex-wrap:wrap; font-size:10px; color:#6F91A8 }
.gw-actions { flex-shrink:0; display:flex; gap:8px }

/* ========== BUTTON SIZE VARIANTS ========== */
.btn-sm { padding:6px 14px; font-size:11px; border-radius:16px }
.btn-xs { padding:3px 10px; font-size:10px; border-radius:12px }

/* ========== RESPONSIVE ========== */
@media (max-width:1200px) {
  .dash-grid { flex-direction:column }
  .dash-col { width:100% }
  .sidebar { transform:translateX(calc(var(--sidebar-w) * -1)) }
  .sidebar.open { transform:translateX(0) }
  .main-wrap { margin-left:0 }
  .stat-grid { grid-template-columns:repeat(2,1fr) }
  .module-grid { grid-template-columns:1fr }
  .five-grid { grid-template-columns:repeat(2,1fr) }
  .detail-panel { width:100% }
  .leader-grid-wrap { grid-template-columns:repeat(2,1fr) }
  .guide-grid { grid-template-columns:repeat(3,1fr) }
  .grid-worker-card { flex-direction:column; text-align:center }
  .gw-meta { justify-content:center }
  .gw-actions { justify-content:center }
}


/* ========== GOVERNANCE LIGHT THEME (scoped, high specificity) ========== */
/* ========== GOVERNANCE LIGHT THEME ========== */
.gov-theme { background:#F4F7FA }
.gov-theme .panel {
  background:#FFFFFF; border:1px solid #E3EAF0;
  box-shadow:0 1px 4px rgba(0,0,0,0.06); backdrop-filter:none;
}
.gov-theme .panel-hd { color:#1F2D3D }
.gov-theme .panel-hd .extra { color:#66788A }

/* hd-bars */
.gov-theme .hd-bar { background:#19B98A; box-shadow:0 0 7px rgba(25,185,138,0.20) }
.gov-theme .hd-bar.g { background:#22B573; box-shadow:0 0 7px rgba(34,181,115,0.20) }
.gov-theme .hd-bar.y { background:#F2A62B; box-shadow:0 0 7px rgba(242,166,43,0.20) }
.gov-theme .hd-bar.r { background:#E05252; box-shadow:0 0 7px rgba(224,82,82,0.20) }

/* stat cards */
.gov-theme .stat-card {
  background:#FFFFFF; border:1px solid #E3EAF0;
  box-shadow:0 1px 3px rgba(0,0,0,0.05); backdrop-filter:none;
}
.gov-theme .stat-card:hover { background:rgba(25,185,138,0.04); border-color:#19B98A; box-shadow:0 4px 12px rgba(0,0,0,0.08) }
.gov-theme .sc-val { color:#1F2D3D }
.gov-theme .sc-lbl { color:#66788A }
.gov-theme .sc-sub { color:#66788A; opacity:.65 }
.gov-theme .stat-card.g .sc-val { color:#22B573 }
.gov-theme .stat-card.y .sc-val { color:#F2A62B }
.gov-theme .stat-card.r .sc-val { color:#E05252 }

/* data-table */
.gov-theme .data-table th { background:#F0F3F8; color:#66788A; border-bottom:2px solid #E3EAF0 }
.gov-theme .data-table td { border-bottom:1px solid #EBEFF4; color:#1F2D3D }
.gov-theme .data-table tr:hover td { background:rgba(25,185,138,0.04) }

/* status badges */
.gov-theme .st.online, .gov-theme .st.info { background:rgba(34,181,115,0.10); color:#22B573 }
.gov-theme .st.warning { background:rgba(242,166,43,0.10); color:#F2A62B }
.gov-theme .st.offline { background:rgba(224,82,82,0.10); color:#E05252 }

/* buttons */
.gov-theme .btn-primary { background:linear-gradient(135deg,#19B98A,#16A37A); color:#fff; box-shadow:0 2px 8px rgba(25,185,138,0.25) }
.gov-theme .btn-primary:hover { box-shadow:0 4px 14px rgba(25,185,138,0.35); transform:translateY(-2px) }
.gov-theme .btn-outline { border:1px solid #C8D4E0; color:#66788A }
.gov-theme .btn-outline:hover { background:rgba(25,185,138,0.06); border-color:#19B98A; color:#19B98A }

/* input */
.gov-theme .input { background:#FFFFFF; border:1px solid #D0D8E2; color:#1F2D3D }
.gov-theme .input:focus { border-color:#19B98A; box-shadow:0 0 0 3px rgba(25,185,138,0.08) }
.gov-theme .input::placeholder { color:#A0AFC0 }

/* gov quick bar */
.gov-theme .gov-qbtn { background:#FFFFFF; border:1px solid #E3EAF0; color:#1F2D3D }
.gov-theme .gov-qbtn:hover { background:rgba(25,185,138,0.06); border-color:#19B98A; color:#19B98A; box-shadow:0 2px 8px rgba(0,0,0,0.06) }
.gov-theme .gov-qbtn.primary { background:#19B98A; border-color:#19B98A; color:#FFFFFF }
.gov-theme .gov-qbtn.primary:hover { background:#17a87c }

/* gov news items */
.gov-theme .gov-news-item { background:#FAFBFC; border:1px solid #E3EAF0 }
.gov-theme .gov-news-item:hover { background:rgba(25,185,138,0.05); border-color:#B8D8CC }
.gov-theme .gni-loc { color:#1F2D3D }
.gov-theme .gni-time { color:#66788A }

/* grid worker */
.gov-theme .gw-name { color:#1F2D3D }
.gov-theme .gw-role { color:#19B98A; background:rgba(25,185,138,0.08) }
.gov-theme .gw-meta { color:#66788A }

/* chat */
.gov-theme .chat-wrapper { background:#FAFBFC; border:1px solid #E3EAF0 }
.gov-theme .chat-msg.ai { background:rgba(25,185,138,0.06); color:#1F2D3D; border:1px solid rgba(25,185,138,0.10) }
.gov-theme .chat-msg.user { background:rgba(25,185,138,0.12); color:#1F2D3D; border:1px solid rgba(25,185,138,0.18) }

/* mini stats */
.gov-theme .mini-s { background:#FAFBFC; border:1px solid #E3EAF0 }
.gov-theme .ms-v { color:#1F2D3D }
.gov-theme .ms-l { color:#66788A }
.gov-theme .mini-s.g .ms-v { color:#22B573 }
.gov-theme .mini-s.y .ms-v { color:#F2A62B }
.gov-theme .mini-s.r .ms-v { color:#E05252 }

/* module cards */
.gov-theme .module-card { background:#FFFFFF; border:1px solid #E3EAF0; backdrop-filter:none; box-shadow:0 1px 3px rgba(0,0,0,0.05) }
.gov-theme .module-card:hover { background:#FFFFFF; border-color:#19B98A; box-shadow:0 4px 12px rgba(0,0,0,0.08) }
.gov-theme .module-card h4 { color:#1F2D3D }
.gov-theme .module-card p { color:#66788A }

/* tags */
.gov-theme .tag.blue { background:rgba(25,185,138,0.10); color:#19B98A }
.gov-theme .tag.green { background:rgba(34,181,115,0.12); color:#22B573 }
.gov-theme .tag.yellow { background:rgba(242,166,43,0.12); color:#F2A62B }
.gov-theme .tag.red { background:rgba(224,82,82,0.12); color:#E05252 }

/* alert list */
.gov-theme .alert-item { background:#FFFFFF; border-left:2px solid #F2A62B }
.gov-theme .alert-item:hover { background:rgba(25,185,138,0.04) }
.gov-theme .ai-title { color:#1F2D3D }
.gov-theme .ai-desc { color:#66788A }
.gov-theme .ai-time { color:#66788A; opacity:.6 }

/* tabs */
.gov-theme .tabs { background:#F4F7FA }
.gov-theme .tab { color:#66788A }
.gov-theme .tab.active { background:#19B98A; color:#fff }
.gov-theme .tab:hover { color:#1F2D3D }

/* review */
.gov-theme .review-item { background:#FFFFFF }
.gov-theme .review-name { color:#1F2D3D }
.gov-theme .review-text { color:#66788A }

/* detail section */
.gov-theme .detail-section h4 { color:#22B573 }
.gov-theme .detail-section h4::before { background:#22B573 }
.gov-theme .df-lbl { color:#66788A }
.gov-theme .df-val { color:#1F2D3D }

/* marquee */
.gov-theme .marquee-bar { background:#FFFFFF; border-color:#E3EAF0; backdrop-filter:none }
.gov-theme .marquee-text { color:#19B98A }
.gov-theme .float-badge { background:rgba(25,185,138,0.12); color:#19B98A; border-color:rgba(25,185,138,0.20) }

/* progress */
.gov-theme .progress-bar { background:rgba(25,185,138,0.06) }
.gov-theme .progress-fill.g { background:linear-gradient(90deg,#19B98A,#22B573) }

/* tech grid */
.gov-theme .tech-label { color:#66788A }
.gov-theme .tech-val { color:#1F2D3D }

/* bot row */
.gov-theme .bot-card { background:#FFFFFF; border-color:#E3EAF0; backdrop-filter:none; box-shadow:0 1px 3px rgba(0,0,0,0.05) }
.gov-theme .bot-card:hover { background:#FFFFFF; border-color:#19B98A }
.gov-theme .bot-card::before { background:linear-gradient(90deg,transparent,rgba(25,185,138,0.2),transparent) }
.gov-theme .bv { color:#1F2D3D }
.gov-theme .bl { color:#66788A }
.gov-theme .bs { color:#66788A; opacity:.6 }
.gov-theme .bot-card.g .bv { color:#22B573 }
.gov-theme .bot-card.y .bv { color:#F2A62B }
.gov-theme .bot-card.r .bv { color:#E05252 }

/* svc cards */
.gov-theme .svc-card { background:#FAFBFC; border-color:#E3EAF0 }
.gov-theme .svc-card:hover { background:rgba(25,185,138,0.04); border-color:#19B98A }
.gov-theme .svc-card .sn { color:#1F2D3D }
.gov-theme .svc-card .sd { color:#66788A }

/* map */
.gov-theme .map-wrap { border-color:#E3EAF0 }
.gov-theme .map-lg { color:#66788A }

/* iot */
.gov-theme .iot-st { color:#66788A }
.gov-theme .iot-st.warn { color:#F2A62B }
.gov-theme .iot-st.offline { color:#E05252 }
.gov-theme .dot.online { background:#22B573; box-shadow:0 0 5px #22B573 }
.gov-theme .dot.warn { background:#F2A62B; box-shadow:0 0 5px #F2A62B }
.gov-theme .dot.offline { background:#E05252 }
.gov-theme .iot-row:hover { background:rgba(25,185,138,0.04) }

/* 治理中心统计栏：4 张卡等宽铺满整行 */
.gov-theme .stat-grid { grid-template-columns:repeat(4,1fr); gap:10px }
@media (max-width:1200px) { .gov-theme .stat-grid { grid-template-columns:repeat(2,1fr) } }
/* ========== GOVERNANCE FONT SCALE — 村民可读字号 ========== */
.gov-theme {
  --gv-title: 18px;
  --gv-body: 16px;
  --gv-secondary: 14px;
  --gv-button: 15px;
  --gv-stat-num: 32px;
  --gv-stat-lbl: 17px;
  line-height: 1.55;
}
.gov-theme .panel-hd { font-size: var(--gv-title); letter-spacing: 0 }
.gov-theme .panel-hd .extra { font-size: var(--gv-secondary) }
.gov-theme .stat-card { padding: 16px 20px }
.gov-theme .sc-val { font-size: var(--gv-stat-num) }
.gov-theme .sc-lbl { font-size: var(--gv-stat-lbl) }
.gov-theme .sc-sub { font-size: var(--gv-secondary) }
.gov-theme .sc-icon { font-size: 22px; width: 46px; height: 46px }
.gov-theme .report-cat { padding: 14px 10px }
.gov-theme .report-cat .rc-icon { font-size: 30px }
.gov-theme .report-cat .rc-label { font-size: var(--gv-title) }
.gov-theme .gov-news-item { padding: 11px 10px }
.gov-theme .gni-loc { font-size: var(--gv-body) }
.gov-theme .gni-time { font-size: var(--gv-secondary) }
.gov-theme .gni-type { font-size: var(--gv-secondary); padding: 3px 10px }
.gov-theme .gni-icon-big { font-size: 24px }
.gov-theme .st { font-size: var(--gv-secondary); padding: 4px 12px }
.gov-theme .gw-name { font-size: 20px }
.gov-theme .gw-role { font-size: var(--gv-secondary) }
.gov-theme .gw-meta { font-size: 15px }
.gov-theme .gw-avatar { font-size: 22px }
.gov-theme .btn { font-size: var(--gv-button) }
.gov-theme .btn-sm { font-size: var(--gv-button); padding: 8px 16px }
.gov-theme .chat-msg { font-size: var(--gv-secondary) }
.gov-theme .input { font-size: var(--gv-button) }

/* ========== 我的产业 · 个人产业工作台 ========== */
.farm-wrap { max-width:1120px; margin:0 auto; padding:20px 24px 40px; min-height:100%; box-sizing:border-box }
.farm-head { margin-bottom:16px }
.farm-title { font-size:22px; font-weight:700; color:#1F2D3D; margin-bottom:4px }
.farm-sub { font-size:13px; color:#66788A }
.farm-stats { margin-bottom:16px }
.farm-tabs { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:18px }
@media (max-width:900px){ .farm-tabs { grid-template-columns:repeat(2,1fr) } }
.farm-tab { display:flex; align-items:center; gap:12px; padding:14px 16px; background:#FFFFFF; border:1px solid #E3EAF0; border-radius:10px; cursor:pointer; transition:all .2s; text-align:left; font-family:inherit }
.farm-tab:hover { border-color:#19B98A; box-shadow:0 4px 12px rgba(0,0,0,0.06) }
.farm-tab.on { background:linear-gradient(135deg,#19B98A,#16A37A); border-color:#19B98A }
.ft-icon { width:38px; height:38px; border-radius:9px; background:rgba(25,185,138,.10); display:flex; align-items:center; justify-content:center; font-size:19px; flex-shrink:0 }
.farm-tab.on .ft-icon { background:rgba(255,255,255,.20) }
.ft-text { display:flex; flex-direction:column; min-width:0 }
.ft-label { font-size:15px; font-weight:700; color:#1F2D3D }
.farm-tab.on .ft-label { color:#fff }
.ft-sub { font-size:11px; color:#66788A; margin-top:1px }
.farm-tab.on .ft-sub { color:rgba(255,255,255,.82) }
.farm-sec-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px }
.fsh-title { font-size:16px; font-weight:700; color:#1F2D3D }
.fsh-link { font-size:13px; color:#19B98A; cursor:pointer; font-weight:500 }
.fsh-link:hover { text-decoration:underline }
.farm-card-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:12px; margin-bottom:14px }
.farm-card { background:#FFFFFF; border:1px solid #E3EAF0; border-radius:12px; padding:16px; box-shadow:0 1px 3px rgba(0,0,0,0.05); transition:all .2s }
.farm-card:hover { border-color:#19B98A; box-shadow:0 6px 16px rgba(0,0,0,0.08); transform:translateY(-2px) }
.fc-top { display:flex; align-items:center; gap:8px; margin-bottom:10px }
.fc-emoji { font-size:22px; line-height:1 }
.fc-name { font-size:16px; font-weight:700; color:#1F2D3D }
.fc-tag { margin-left:auto; font-size:12px; padding:2px 9px; border-radius:6px; background:rgba(34,181,115,.12); color:#22B573 }
.fc-area { font-size:26px; font-weight:700; color:#1F2D3D; margin-bottom:12px; font-family:"SF Mono","DIN Alternate","Consolas",monospace }
.fc-area small { font-size:13px; color:#66788A; font-weight:400; margin-left:4px; font-family:inherit }
.fc-rows { border-top:1px solid #EBEFF4; padding-top:10px }
.fc-row { display:flex; justify-content:space-between; align-items:center; padding:4px 0; font-size:13px }
.fc-row .lr-l { color:#66788A }
.fc-row .lr-v { color:#1F2D3D; font-weight:500 }
.fc-row .lr-v.ok { color:#22B573 }
.fc-row .lr-v.warn { color:#F2A62B }
.fc-foot { margin-top:12px; padding-top:10px; border-top:1px dashed #EBEFF4; text-align:right; font-size:13px; color:#19B98A; cursor:pointer; font-weight:500 }
.fc-foot:hover { text-decoration:underline }
.farm-bottom { display:grid; grid-template-columns:1fr 1fr; gap:12px }
@media (max-width:900px){ .farm-bottom { grid-template-columns:1fr } }
.stage-row { display:flex; align-items:center; gap:10px; padding:7px 0; font-size:13px }
.sr-name { width:60px; color:#1F2D3D; font-weight:500; flex-shrink:0 }
.sr-bar { flex:1; height:8px; background:rgba(25,185,138,.10); border-radius:4px; overflow:hidden }
.sr-fill { display:block; height:100%; background:linear-gradient(90deg,#19B98A,#22B573); border-radius:4px }
.sr-count { width:44px; text-align:right; color:#66788A; flex-shrink:0 }
.att-item { padding:8px 0; border-bottom:1px solid #EBEFF4 }
.att-item:last-child { border-bottom:none }
.att-title { font-size:14px; font-weight:600; color:#1F2D3D }
.att-desc { font-size:12px; color:#66788A; margin-top:2px }

/* ========== ECOLOGY LIGHT THEME (生态绿 #22B573) ========== */
.eco-theme { background:#F4F7FA }
.eco-theme .panel {
  background:#FFFFFF; border:1px solid #E3EAF0;
  box-shadow:0 1px 4px rgba(0,0,0,0.06); backdrop-filter:none;
}
.eco-theme .panel-hd { color:#1F2D3D }
.eco-theme .panel-hd .extra { color:#66788A }

/* hd-bars — ecology green primary */
.eco-theme .hd-bar { background:#22B573; box-shadow:0 0 7px rgba(34,181,115,0.20) }
.eco-theme .hd-bar.g { background:#22B573; box-shadow:0 0 7px rgba(34,181,115,0.20) }
.eco-theme .hd-bar.y { background:#F2A62B; box-shadow:0 0 7px rgba(242,166,43,0.20) }
.eco-theme .hd-bar.r { background:#E05252; box-shadow:0 0 7px rgba(224,82,82,0.20) }

/* stat cards */
.eco-theme .stat-card {
  background:#FFFFFF; border:1px solid #E3EAF0;
  box-shadow:0 1px 3px rgba(0,0,0,0.05); backdrop-filter:none;
}
.eco-theme .stat-card:hover { background:rgba(34,181,115,0.04); border-color:#22B573; box-shadow:0 4px 12px rgba(0,0,0,0.08) }
.eco-theme .sc-val { color:#1F2D3D }
.eco-theme .sc-lbl { color:#66788A }
.eco-theme .sc-sub { color:#66788A; opacity:.65 }
.eco-theme .stat-card.g .sc-val { color:#22B573 }
.eco-theme .stat-card.y .sc-val { color:#F2A62B }
.eco-theme .stat-card.r .sc-val { color:#E05252 }

/* value tag (优) */
.eco-theme .sc-tag {
  display:inline-block; margin-left:8px; padding:2px 10px; border-radius:8px;
  font-size:14px; font-weight:600; vertical-align:middle; line-height:1.4;
  background:rgba(34,181,115,0.12); color:#22B573;
}

/* buttons */
.eco-theme .btn-primary { background:linear-gradient(135deg,#22B573,#1BA366); color:#fff; box-shadow:0 2px 8px rgba(34,181,115,0.25) }
.eco-theme .btn-primary:hover { box-shadow:0 4px 14px rgba(34,181,115,0.35); transform:translateY(-2px) }
.eco-theme .btn-outline { background:#FFFFFF; border:1px solid #C8D4E0; color:#66788A }
.eco-theme .btn-outline:hover { background:rgba(34,181,115,0.06); border-color:#22B573; color:#22B573 }

/* alert list */
.eco-theme .alert-item { background:#FFFFFF; border-left:2px solid #F2A62B }
.eco-theme .alert-item.r { border-left-color:#E05252 }
.eco-theme .alert-item:hover { background:rgba(34,181,115,0.04) }
.eco-theme .ai-title { color:#1F2D3D }
.eco-theme .ai-desc { color:#66788A }
.eco-theme .ai-time { color:#66788A; opacity:.6 }

/* data-table */
.eco-theme .data-table th { background:#F0F3F8; color:#66788A; border-bottom:2px solid #E3EAF0 }
.eco-theme .data-table td { border-bottom:1px solid #EBEFF4; color:#1F2D3D }
.eco-theme .data-table tr:hover td { background:rgba(34,181,115,0.04) }

/* status badges */
.eco-theme .st.online, .eco-theme .st.info { background:rgba(34,181,115,0.10); color:#22B573 }
.eco-theme .st.warning { background:rgba(242,166,43,0.10); color:#F2A62B }
.eco-theme .st.offline { background:rgba(224,82,82,0.10); color:#E05252 }

/* 生态中心统计栏：4 张卡等宽铺满整行 */
.eco-theme .stat-grid { grid-template-columns:repeat(4,1fr); gap:10px }
@media (max-width:1200px) { .eco-theme .stat-grid { grid-template-columns:repeat(2,1fr) } }

/* ========== ECOLOGY FONT SCALE — 村民可读字号 ========== */
.eco-theme {
  --eco-title: 20px;
  --eco-body: 16px;
  --eco-secondary: 15px;
  --eco-button: 15px;
  --eco-stat-num: 32px;
  --eco-stat-lbl: 17px;
  line-height: 1.55;
}
.eco-theme .panel-hd { font-size: var(--eco-title); letter-spacing: 0 }
.eco-theme .panel-hd .extra { font-size: var(--eco-secondary) }
.eco-theme .stat-card { padding: 16px 20px }
.eco-theme .sc-val { font-size: var(--eco-stat-num) }
.eco-theme .sc-lbl { font-size: var(--eco-stat-lbl) }
.eco-theme .sc-sub { font-size: var(--eco-secondary) }
.eco-theme .sc-icon { font-size: 22px; width: 46px; height: 46px }
.eco-theme .alert-item { padding: 11px 12px }
.eco-theme .ai-ico { font-size: 20px }
.eco-theme .ai-title { font-size: var(--eco-body) }
.eco-theme .ai-desc { font-size: var(--eco-secondary) }
.eco-theme .ai-time { font-size: var(--eco-secondary) }
.eco-theme .data-table th, .eco-theme .data-table td { font-size: var(--eco-body) }
.eco-theme .st { font-size: var(--eco-secondary); padding: 4px 12px }
.eco-theme .btn { font-size: var(--eco-button) }

/* ===== 数据中心（农户端：我的数据 / 本村公开数据查询）===== */
.dc-sec { margin-bottom:16px }
.dc-sec-hd { font-size:18px; font-weight:700; color:#1F2D3D; margin-bottom:8px }
.dc-sec-sub { font-size:13px; font-weight:400; color:#8A97A5; margin-left:10px }
.dc-my-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px }
.dc-card { background:#FFFFFF; border:1px solid #E3EAF0; border-radius:10px; padding:16px; cursor:pointer; transition:all .2s; display:flex; flex-direction:column; box-shadow:0 1px 4px rgba(0,0,0,0.05) }
.dc-card:hover { border-color:#22B573; box-shadow:0 6px 16px rgba(0,0,0,0.08); transform:translateY(-2px) }
.dc-card-ic { font-size:26px; margin-bottom:10px }
.dc-card-t { font-size:16px; font-weight:700; color:#1F2D3D; margin-bottom:4px }
.dc-card-d { font-size:13px; color:#66788A; line-height:1.5; flex:1 }
.dc-card-ft { display:flex; align-items:center; justify-content:space-between; margin-top:12px }
.dc-card-n { font-size:12px; color:#22B573; font-weight:600; background:rgba(34,181,115,0.10); padding:2px 8px; border-radius:10px }
.dc-card-go { font-size:13px; color:#22B573; font-weight:600 }
.dc-pub-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:12px }
.dc-pub { background:#FFFFFF; border:1px solid #E3EAF0; border-radius:10px; padding:18px 8px; cursor:pointer; text-align:center; transition:all .2s }
.dc-pub:hover { border-color:#22B573; box-shadow:0 4px 12px rgba(0,0,0,0.08) }
.dc-pub-ic { font-size:26px; margin-bottom:8px }
.dc-pub-name { font-size:14px; font-weight:600; color:#1F2D3D }
.dc-pub-more { background:#F0F7F3; border-color:#CBE4D8 }
.dc-rowcard { display:flex; align-items:center; gap:14px; background:#FFFFFF; border:1px solid #E3EAF0; border-radius:10px; padding:16px 18px; cursor:pointer; margin-bottom:12px; transition:all .2s }
.dc-rowcard:hover { border-color:#22B573; box-shadow:0 4px 12px rgba(0,0,0,0.08) }
.dc-row-ic { font-size:26px; flex-shrink:0 }
.dc-row-body { flex:1; min-width:0 }
.dc-row-t { font-size:16px; font-weight:700; color:#1F2D3D; margin-bottom:2px }
.dc-row-d { font-size:13px; color:#66788A }
.dc-row-go { font-size:14px; color:#22B573; font-weight:600; flex-shrink:0 }
@media (max-width:1200px) { .dc-my-grid { grid-template-columns:repeat(2,1fr) } .dc-pub-grid { grid-template-columns:repeat(3,1fr) } }
@media (max-width:640px) { .dc-my-grid { grid-template-columns:1fr } .dc-pub-grid { grid-template-columns:repeat(2,1fr) } }

/* ========== SETTINGS PANEL（管理员端后台配置中心）========== */
.settings-panel { background:var(--panel-bg); border:1px solid var(--panel-border); border-radius:12px; padding:22px 24px 26px; backdrop-filter:blur(12px) }
/* 设置首页入口卡片固定 3×2 */
.settings-grid { grid-template-columns:repeat(3,1fr) }
@media (max-width:1200px) { .settings-grid { grid-template-columns:repeat(2,1fr) } }
@media (max-width:720px) { .settings-grid { grid-template-columns:1fr } }
.sp-hd { margin-bottom:18px }
.sp-back { display:inline-flex; align-items:center; gap:4px; background:none; border:none; color:var(--text-dim); font-size:12px; cursor:pointer; padding:4px 0; margin-bottom:12px; font-family:inherit; transition:.2s }
.sp-back:hover { color:var(--accent) }
.sp-title { font-size:20px; font-weight:700; color:var(--text-bright); letter-spacing:.5px }
.sp-desc { font-size:12px; color:var(--text-dim); margin-top:4px }

.sp-toolbar { display:flex; align-items:center; gap:10px; margin-bottom:12px; flex-wrap:wrap }
.sp-search { width:230px; flex:none; border-radius:8px }
.sp-select { background:rgba(10,60,130,.15); border:1px solid rgba(14,165,233,0.18); color:var(--text); border-radius:8px; padding:7px 10px; font-size:12px; font-family:inherit; outline:none; cursor:pointer }
.sp-select:focus { border-color:rgba(14,165,233,.5) }
.sp-select option { background:#0a2430; color:#B7D3E8 }
.sp-table { margin-top:4px }
.sp-name { font-weight:600; color:var(--text-bright) }
.sp-link { color:var(--accent); font-size:12px; cursor:pointer; font-weight:600 }
.sp-link:hover { text-decoration:underline }

.sp-section { margin-bottom:20px }
.sp-section-hd { font-size:13px; font-weight:700; color:var(--accent); letter-spacing:1px; margin-bottom:10px; padding-left:10px; position:relative }
.sp-section-hd::before { content:''; position:absolute; left:0; top:50%; transform:translateY(-50%); width:3px; height:14px; background:var(--accent); border-radius:2px }

.sp-mod-list { display:flex; flex-direction:column; gap:10px }
.sp-mod-card { background:rgba(10,36,68,0.55); border:1px solid rgba(40,199,111,0.08); border-radius:10px; padding:14px 16px; transition:.2s }
.sp-mod-card:hover { border-color:rgba(57,217,138,0.25) }
.sp-mod-card.disabled { opacity:.72 }
.sp-mod-top { display:flex; align-items:flex-start; justify-content:space-between; gap:12px }
.sp-mod-name { font-size:14px; font-weight:700; color:var(--text-bright) }
.sp-mod-desc { font-size:11px; color:var(--text-dim); margin-top:3px }
.sp-mod-right { display:flex; align-items:center; gap:10px; flex-shrink:0 }
.sp-mod-status { font-size:11px; font-weight:600 }
.sp-mod-status.on { color:var(--accent2) }
.sp-mod-status.off { color:var(--text-dim) }
.sp-mod-roles { display:flex; align-items:center; gap:8px; margin-top:12px; flex-wrap:wrap; padding-top:10px; border-top:1px solid rgba(255,255,255,0.04) }
.sp-role-lbl { font-size:11px; color:var(--text-dim) }
.sp-role-chip { font-size:11px; padding:4px 12px; border-radius:14px; background:rgba(255,255,255,0.05); color:var(--text-dim); cursor:pointer; transition:.2s; border:1px solid transparent }
.sp-role-chip.on { background:rgba(57,217,138,0.14); color:var(--accent); border-color:rgba(57,217,138,0.3) }
.sp-role-hint { font-size:10px; color:var(--text-dim); opacity:.7 }

.sp-switch { position:relative; width:42px; height:22px; border-radius:11px; background:rgba(255,255,255,0.12); cursor:pointer; transition:.25s; flex-shrink:0; display:inline-block; vertical-align:middle }
.sp-switch i { position:absolute; top:3px; left:3px; width:16px; height:16px; border-radius:50%; background:#8A97A5; transition:.25s }
.sp-switch.on { background:rgba(57,217,138,0.5) }
.sp-switch.on i { left:23px; background:#28C76F }
.sp-switch.dis { opacity:.4; cursor:not-allowed }

.sp-channel-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px }
.sp-channel { display:flex; align-items:center; gap:8px; background:rgba(10,36,68,0.55); border:1px solid rgba(40,199,111,0.08); border-radius:10px; padding:12px 14px }
.sp-channel-icon { font-size:20px }
.sp-channel-name { font-size:12px; color:var(--text); flex:1 }

.sp-form-row { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.04); font-size:12px }
.sp-form-lbl { color:var(--text-dim); flex-shrink:0 }
.sp-form-val { color:var(--text-bright); font-weight:500; display:flex; align-items:center; justify-content:flex-end; text-align:right }

.sp-actions { display:flex; gap:10px; margin-top:16px }
.sp-backup-status { background:rgba(10,36,68,0.55); border:1px solid rgba(40,199,111,0.08); border-radius:10px; padding:6px 16px }
.sp-backup-line { display:flex; align-items:center; justify-content:space-between; padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.04); font-size:12px }
.sp-backup-line:last-child { border-bottom:none }

@media (max-width:760px) {
  .sp-channel-grid { grid-template-columns:repeat(2,1fr) }
  .sp-search { width:100% }
}

/* ========== 个人设置 / 系统管理 · 浅色主题（与生态治理中心一致）========== */
.settings-page {
  background:#F5F7FA;
  --text-bright:#1F2D3D; --text-dim:#66788A; --text:#475867;
  --panel-bg:#FFFFFF; --panel-border:#E3EAF0;
  --accent:#22B573; --accent2:#22B573; --accent3:#F2A62B; --accent4:#E05252;
}
.settings-page .settings-panel { background:#FFFFFF; border:1px solid #E3EAF0; backdrop-filter:none; box-shadow:0 1px 4px rgba(0,0,0,0.06) }
.settings-page .module-card { background:#FFFFFF; border:1px solid #E3EAF0; backdrop-filter:none; box-shadow:0 1px 3px rgba(0,0,0,0.05) }
.settings-page .module-card:hover { background:rgba(34,181,115,0.04); border-color:#22B573; box-shadow:0 4px 12px rgba(0,0,0,0.08) }
.settings-page .input { background:#FFFFFF; border:1px solid #D0D8E2; color:#1F2D3D }
.settings-page .input:focus { border-color:#22B573; box-shadow:0 0 8px rgba(34,181,115,0.12) }
.settings-page .sp-select { background:#FFFFFF; border:1px solid #D0D8E2; color:#1F2D3D }
.settings-page .sp-select option { background:#FFFFFF; color:#1F2D3D }
.settings-page .sp-mod-card { background:#FFFFFF; border:1px solid #E3EAF0 }
.settings-page .sp-mod-card:hover { border-color:#22B573 }
.settings-page .sp-channel { background:#FFFFFF; border:1px solid #E3EAF0 }
.settings-page .sp-backup-status { background:#FFFFFF; border:1px solid #E3EAF0 }
.settings-page .sp-mod-roles { border-top:1px solid #EBEFF4 }
.settings-page .sp-form-row { border-bottom:1px solid #EBEFF4 }
.settings-page .sp-backup-line { border-bottom:1px solid #EBEFF4 }
.settings-page .sp-role-chip { background:#F4F7FA }
.settings-page .sp-role-chip.on { background:rgba(34,181,115,0.10) }
.settings-page .sp-switch { background:#C8D4E0 }
.settings-page .sp-switch.on { background:rgba(34,181,115,0.5) }
.settings-page .sp-switch.on i { background:#22B573 }
</style>