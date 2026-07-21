<template>
  <div class="dashboard-shell" :style="{ '--sidebar-w': sidebarCollapsed && !isMobile ? '0px' : '220px' }">
    <!-- Particles Background -->
    <canvas ref="particlesCvs" class="particles-bg"></canvas>

    <!-- Overlay (mobile) -->
    <div class="overlay" :class="{ show: sidebarOpen }" @click="closeSidebar"></div>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed && !isMobile, open: sidebarOpen }">
      <div class="side-hd">
        <div class="side-logo">🏘️</div>
        <span class="side-title">蓝匠数智数字乡村平台</span>
      </div>
      <nav class="side-nav">
        <div class="nav-item" :class="{ active: currentPage === 'dashboard' }" @click="switchPage('dashboard')">
          <span class="ni-icon">📊</span>乡村驾驶舱
        </div>
        <div class="nav-divider"></div>
        <div class="nav-item" :class="{ active: currentPage === 'industry' }" @click="switchPage('industry')">
          <span class="ni-icon">🏭</span>数字产业中心
        </div>
        <div class="nav-item" @click="router.push('/service')">
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
          <div class="nav-item nav-tree-parent" :class="{ open: treeOpen }" @click="treeOpen = !treeOpen">
            <span class="ni-icon">📶</span>设备中心<span class="nav-arrow">▶</span>
          </div>
          <div class="nav-tree-children" :class="{ open: treeOpen }">
            <div class="nav-sub" :class="{ active: currentPage === 'device' }" @click="switchPage('device')">
              <span class="ni-icon">🔵</span>IoT设备感知<span class="nav-badge">82</span>
            </div>
            <div class="nav-sub" :class="{ active: currentPage === 'monitor' }" @click="switchPage('monitor')">
              <span class="ni-icon">🟢</span>视频监控中心<span class="nav-badge">32</span>
            </div>
          </div>
        </div>
        <div class="nav-item" @click="toast('数据大屏功能开发中', 'info')">
          <span class="ni-icon">📺</span>数据大屏
        </div>
        <div class="nav-divider"></div>
        <div class="nav-item" :class="{ active: currentPage === 'settings' }" @click="switchPage('settings')">
          <span class="ni-icon">⚙️</span>系统管理
        </div>
      </nav>
      <div class="side-ft">
        <div class="side-user">
          <div class="side-av" style="background:#E74C3C">邓</div>
          <div>
            <div class="side-un">邓超书记</div>
            <div class="side-ur">党总支部书记·村委会主任</div>
          </div>
        </div>
        <div class="side-user" style="margin-top:4px">
          <div class="side-av" style="background:#F8B400">黄</div>
          <div>
            <div class="side-un">黄尊海副书记</div>
            <div class="side-ur">党总支部副书记</div>
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
          <router-link to="/admin" class="hdr-link">⚙️ 管理</router-link>
          <div class="breadcrumb"> / <span>{{ pageTitle }}</span></div>
        </div>
        <div class="hdr-right">
          <button class="btn-icon" title="消息" @click="toast('您有3条新消息', 'info')">🔔</button>
          <button class="btn-icon" title="全屏" @click="toggleFullscreen">⛶</button>
          <div class="hdr-time">
            <div class="tm">{{ clockTime }}</div>
            <div>{{ clockDate }}</div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="content-area" ref="contentArea">

        <!-- ==================== PAGE: Dashboard ==================== -->
        <div v-show="currentPage === 'dashboard'" class="page-content" key="dashboard">
          <div class="dash-grid">
            <!-- LEFT COLUMN -->
            <div class="dash-col">
              <div class="panel" style="flex:1">
                <div class="panel-hd"><span class="hd-bar"></span>人口概况</div>
                <div class="panel-bd">
                  <div class="mini-row">
                    <div class="mini-s"><div class="ms-v">2,910</div><div class="ms-l">户籍人口</div></div>
                    <div class="mini-s g"><div class="ms-v">816</div><div class="ms-l">总户数（估）</div></div>
                  </div>
                  <div class="mini-row">
                    <div class="mini-s y"><div class="ms-v">15.2%</div><div class="ms-l">老龄化率</div></div>
                    <div class="mini-s r"><div class="ms-v">68</div><div class="ms-l">重点关怀（估）</div></div>
                  </div>
                  <div ref="chartDashAge" class="chart-box" style="height:100px"></div>
                </div>
              </div>
              <div class="panel" style="flex:1">
                <div class="panel-hd"><span class="hd-bar g"></span>产业产值</div>
                <div class="panel-bd"><div ref="chartDashIndustry" class="chart-box" style="height:140px"></div></div>
              </div>
              <div class="panel" style="flex:0 0 auto;height:130px">
                <div class="panel-hd"><span class="hd-bar y"></span>环境实时监测</div>
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
                <div class="panel-hd"><span class="hd-bar"></span>GIS 数字孪生 · 中堰村全域态势感知<span class="extra">高德地图 · 15节点</span></div>
                <div class="panel-bd" style="padding:0;flex:1;position:relative">
                  <div class="map-wrap" ref="mapBox">
                    <a href="#" class="map-monitor-link" @click.prevent="switchPage('monitor')" title="监控中心">📡 监控中心</a>
                    <div ref="leafletMap" class="leaflet-map"></div>
                    <div class="map-legend">
                      <div class="map-lg"><span class="dot" style="background:#39D98A;box-shadow:0 0 5px #39D98A"></span>种植区</div>
                      <div class="map-lg"><span class="dot" style="background:#28C76F;box-shadow:0 0 5px #28C76F"></span>监测站</div>
                      <div class="map-lg"><span class="dot" style="background:#F5B83D;box-shadow:0 0 5px #F5B83D"></span>重点区</div>
                      <div class="map-lg"><span class="dot" style="background:#A77BFF;box-shadow:0 0 5px #A77BFF"></span>居住区</div>
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
              <div class="panel" style="flex:1">
                <div class="panel-hd"><span class="hd-bar r"></span>实时预警<span class="extra">4条</span></div>
                <div class="panel-bd">
                  <div class="alert-list">
                    <div class="alert-item" v-for="a in alertItems" :key="a.id" @click="openAlertDetail(a)">
                      <span class="ai-ico">{{ a.icon }}</span>
                      <div>
                        <div class="ai-title">{{ a.title }}</div>
                        <div class="ai-desc">{{ a.desc }}</div>
                        <div class="ai-time">{{ a.time }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="panel" style="flex:1">
                <div class="panel-hd"><span class="hd-bar"></span>🤖 AI数据分析<span class="extra" id="aiRefresh">30s刷新</span></div>
                <div class="panel-bd">
                  <div class="ai-row">
                    <div class="ai-cell"><div class="ai-cell-v" style="color:#39D98A">{{ aiEfficiency }}%</div><div class="ai-cell-l">治理效率</div></div>
                    <div class="ai-cell"><div class="ai-cell-v" style="color:#f59e0b">{{ aiRisk }}</div><div class="ai-cell-l">风险指数</div></div>
                    <div class="ai-cell"><div class="ai-cell-v" style="color:#3b82f6">{{ aiEvents }}</div><div class="ai-cell-l">事件数</div></div>
                  </div>
                  <div class="ai-summary">🧠 {{ aiSummary }}</div>
                  <div class="ai-warning" :style="{color: aiWarnColor}">{{ aiWarning }}</div>
                </div>
              </div>
              <div class="panel" style="flex:0 0 auto;height:160px">
                <div class="panel-hd"><span class="hd-bar g"></span>IoT设备状态<span class="extra">在线率90.4%</span></div>
                <div class="panel-bd" style="font-size:10px">
                  <div class="iot-row" v-for="d in iotDeviceList" :key="d.id" @click="toast('设备: '+d.name+' - '+d.statusText, 'info')">
                    <span class="dot" :class="d.status"></span>{{ d.name }}<span class="iot-st" :class="d.status">{{ d.statusText }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Bottom row -->
          <div class="bot-row">
            <div class="bot-card g" v-for="c in bottomCards" :key="c.label" @click="openStatDetail(c.label, c.value)">
              <div class="bv">{{ c.value }}</div><div class="bl">{{ c.label }}</div><div class="bs">{{ c.sub }}</div>
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
        <div v-show="currentPage === 'governance'" class="page-content" key="governance">
          <div class="stat-grid">
            <div class="stat-card r" v-for="s in govStats" :key="s.label" @click="openStatDetail(s.label, s.value)">
              <div><div class="sc-val">{{ s.value }}</div><div class="sc-lbl">{{ s.label }}</div><div class="sc-sub">{{ s.sub }}</div></div>
              <div class="sc-icon" :style="{background:s.iconBg}">{{ s.icon }}</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar"></span>📈 事件趋势（近7天）</div>
              <div class="panel-bd"><div ref="chartGovTrend" class="chart-box" style="height:180px"></div></div>
            </div>
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar g"></span>📊 事件分类统计</div>
              <div class="panel-bd"><div ref="chartGovPie" class="chart-box" style="height:180px"></div></div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar"></span>事件流转 — 待办事项</div>
              <div class="panel-bd" style="padding:8px">
                <table class="data-table">
                  <thead><tr><th>编号</th><th>类型</th><th>上报人</th><th>地点</th><th>状态</th><th>时间</th></tr></thead>
                  <tbody>
                    <tr v-for="e in eventItems" :key="e.id" @click="openEventDetail(e)">
                      <td>{{ e.id }}</td><td>{{ e.type }}</td><td>{{ e.reporter }}</td>
                      <td>{{ e.location }}</td><td><span class="st" :class="e.statusCls">{{ e.status }}</span></td><td>{{ e.time }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar g"></span>网格管理 · 五维数据库<span class="extra">人·房·地·事·物</span></div>
              <div class="panel-bd">
                <div class="five-grid">
                  <div class="svc-card" v-for="f in fiveDimData" :key="f.label" @click="openSvcDetail(f)">
                    <span class="sv">{{ f.icon }}</span><div class="sn">{{ f.label }}</div><div class="sd">{{ f.desc }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-hd"><span class="hd-bar y"></span>🤖 AI 乡村助手<span class="extra">Powered by 大语言模型</span></div>
            <div class="panel-bd">
              <div class="chat-wrapper">
                <div class="chat-area" ref="chatAreaRef">
                  <div v-for="(m,i) in chatMessages" :key="i" :class="['chat-msg', m.role]">{{ m.text }}</div>
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
        <div v-show="currentPage === 'ecology'" class="page-content" key="ecology">
          <div class="stat-grid">
            <div class="stat-card g" v-for="s in ecoStats" :key="s.label" @click="openStatDetail(s.label, s.value)">
              <div><div class="sc-val">{{ s.value }}</div><div class="sc-lbl">{{ s.label }}</div><div class="sc-sub">{{ s.sub }}</div></div>
              <div class="sc-icon" :style="{background:s.iconBg}">{{ s.icon }}</div>
            </div>
          </div>
          <div class="panel" style="margin-bottom:10px">
            <div class="panel-hd"><span class="hd-bar g"></span>⚡ 快捷操作</div>
            <div class="panel-bd">
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <button class="btn btn-primary" @click="toast('环境巡检任务已下发','success')">🔍 发起巡检</button>
                <button class="btn btn-outline" @click="toast('数据已上报环保部门','info')">📤 上报数据</button>
                <button class="btn btn-outline" @click="toast('垃圾分类统计已生成','info')">♻️ 垃圾分类统计</button>
                <button class="btn btn-outline" @click="toast('碳汇核算报告已导出','info')">🌳 碳汇核算</button>
              </div>
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
                  <div class="alert-item r" v-for="a in ecoAlerts" :key="a.id" @click="openAlertDetail(a)">
                    <span class="ai-ico">{{ a.icon }}</span>
                    <div><div class="ai-title">{{ a.title }}</div><div class="ai-desc">{{ a.desc }}</div><div class="ai-time">{{ a.time }}</div></div>
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
                <thead><tr><th>监测点</th><th>类型</th><th>当前值</th><th>标准值</th><th>状态</th><th>更新时间</th></tr></thead>
                <tbody>
                  <tr v-for="r in ecoTableData" :key="r.name">
                    <td>{{ r.name }}</td><td>{{ r.type }}</td><td>{{ r.value }}</td>
                    <td>{{ r.standard }}</td><td><span class="st" :class="r.statusCls">{{ r.status }}</span></td><td>{{ r.updateTime }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ==================== PAGE: Service ==================== -->
        <div v-show="currentPage === 'service'" class="page-content" key="service">
          <div class="stat-grid">
            <div class="stat-card" v-for="s in svcStats" :key="s.label" @click="openStatDetail(s.label, s.value)">
              <div><div class="sc-val">{{ s.value }}</div><div class="sc-lbl">{{ s.label }}</div><div class="sc-sub">{{ s.sub }}</div></div>
              <div class="sc-icon" :style="{background:s.iconBg}">{{ s.icon }}</div>
            </div>
          </div>
          <div class="module-grid">
            <div class="module-card" v-for="m in svcModules" :key="m.label" @click="openModuleDetail(m)">
              <div class="mc-icon" :style="{background:m.iconBg}">{{ m.icon }}</div>
              <h4>{{ m.label }}</h4><p>{{ m.desc }}</p>
              <div class="mc-tags"><span class="tag" v-for="t in m.tags" :key="t.text" :class="t.cls">{{ t.text }}</span></div>
              <span class="mc-arrow">→</span>
            </div>
          </div>
        </div>

        <!-- ==================== PAGE: IoT ==================== -->
        <div v-show="currentPage === 'iot'" class="page-content" key="iot">
          <div class="stat-grid">
            <div class="stat-card g" v-for="s in iotStats" :key="s.label" @click="openStatDetail(s.label, s.value)">
              <div><div class="sc-val">{{ s.value }}</div><div class="sc-lbl">{{ s.label }}</div><div class="sc-sub">{{ s.sub }}</div></div>
              <div class="sc-icon" :style="{background:s.iconBg}">{{ s.icon }}</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar g"></span>📡 设备状态分布</div>
              <div class="panel-bd"><div ref="chartIotStatus" class="chart-box" style="height:200px"></div></div>
            </div>
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar"></span>⚡ 快捷操作</div>
              <div class="panel-bd">
                <div class="iot-actions">
                  <button class="btn btn-primary" @click="toast('正在扫描新设备…','info')">🔍 扫描新设备</button>
                  <button class="btn btn-outline" @click="toast('设备重启指令已发送','success')">🔄 远程重启设备</button>
                  <button class="btn btn-outline" @click="toast('固件升级中…','info')">⬆️ 固件升级</button>
                  <button class="btn btn-outline" @click="toast('数据上报频率已调整','success')">⚙️ 配置上报频率</button>
                  <button class="btn btn-outline" @click="toast('设备告警阈值已保存','success')">🔔 告警阈值设置</button>
                </div>
              </div>
            </div>
          </div>
          <div class="panel" style="margin-bottom:10px">
            <div class="panel-hd"><span class="hd-bar y"></span>📶 数据上报趋势（今日）</div>
            <div class="panel-bd"><div ref="chartIotFlow" class="chart-box" style="height:150px"></div></div>
          </div>
          <div class="panel">
            <div class="panel-hd"><span class="hd-bar"></span>设备管理列表<span class="extra">共52台</span></div>
            <div class="panel-bd" style="padding:8px">
              <table class="data-table">
                <thead><tr><th>设备ID</th><th>设备名称</th><th>类型</th><th>位置</th><th>协议</th><th>状态</th><th>最后数据</th></tr></thead>
                <tbody>
                  <tr v-for="d in iotDevicesFull" :key="d.id">
                    <td>{{ d.id }}</td><td>{{ d.name }}</td><td>{{ d.type }}</td><td>{{ d.location }}</td>
                    <td>{{ d.protocol }}</td><td><span class="st" :class="d.statusCls">{{ d.statusText }}</span></td><td>{{ d.lastData }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ==================== PAGE: Data Center ==================== -->
        <div v-show="currentPage === 'data'" class="page-content" key="data">
          <div class="stat-grid">
            <div class="stat-card" v-for="s in dataStats" :key="s.label" @click="openStatDetail(s.label, s.value)">
              <div><div class="sc-val">{{ s.value }}</div><div class="sc-lbl">{{ s.label }}</div><div class="sc-sub">{{ s.sub }}</div></div>
              <div class="sc-icon" :style="{background:s.iconBg}">{{ s.icon }}</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar"></span>数据资产目录</div>
              <div class="panel-bd">
                <div class="asset-list">
                  <div class="asset-row" v-for="a in dataAssets" :key="a.label">
                    <span>{{ a.label }}</span>
                    <div class="progress-bar"><div class="progress-fill g" :style="{width:a.pct+'%'}"></div></div>
                    <b>{{ a.count }}</b>
                  </div>
                </div>
              </div>
            </div>
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar g"></span>技术架构</div>
              <div class="panel-bd" style="font-size:11px;line-height:2">
                <div class="tech-grid">
                  <span class="tech-label">前端框架</span><span class="tech-val">Vue 3 + TS</span>
                  <span class="tech-label">后端框架</span><span class="tech-val">Spring Boot</span>
                  <span class="tech-label">数据库</span><span class="tech-val">MySQL + Redis</span>
                  <span class="tech-label">物联网协议</span><span class="tech-val">MQTT</span>
                  <span class="tech-label">AI模型</span><span class="tech-val">DeepSeek / OpenAI</span>
                  <span class="tech-label">地图引擎</span><span class="tech-val">天地图 GIS</span>
                  <span class="tech-label">部署方式</span><span class="tech-val">政务云 / 阿里云</span>
                  <span class="tech-label">小程序</span><span class="tech-val">微信小程序</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== PAGE: Leadership ==================== -->
        <div v-show="currentPage === 'leadership'" class="page-content" key="leadership">
          <div class="leader-grid-wrap">
            <div class="panel leader-card-panel" v-for="l in leaders" :key="l.id"
              @click="showLeaderDetail(l)"
              @mouseenter="hoveredLeader = l.id"
              @mouseleave="hoveredLeader = null">
              <div class="leader-avatar" :style="{background:'linear-gradient(135deg,'+l.color+',transparent)',boxShadow:'0 0 20px '+l.color+'44'}">
                {{ l.avatar }}
              </div>
              <h3 class="leader-name">{{ l.name }}</h3>
              <div class="leader-title" :style="{color:l.color}">{{ l.title }}</div>
              <div class="leader-org">{{ l.org }}</div>
              <div class="leader-phone">📱 {{ l.phone }}</div>
              <div class="leader-qr" @click.stop="showQR(l)">💚 微信二维码</div>
              <div class="leader-stats">
                <div><div class="ls-v" style="color:#28C76F">{{ l.monthTasks }}</div><div class="ls-l">本月事项</div></div>
                <div class="ls-div"></div>
                <div><div class="ls-v" style="color:#39D98A">{{ doneRate(l) }}%</div><div class="ls-l">完成率</div></div>
                <div class="ls-div"></div>
                <div><div class="ls-v" style="color:#F5B83D">{{ l.satisfaction }}%</div><div class="ls-l">满意度</div></div>
              </div>
            </div>
          </div>
          <!-- Leader Detail Section -->
          <div v-if="selectedLeader" ref="leaderDetailSection" class="leader-detail-section">
            <div class="panel" style="margin-bottom:8px">
              <div class="panel-hd" style="display:flex;align-items:center;gap:12px">
                <span class="hd-bar"></span>履职档案 — {{ selectedLeader.name }} · {{ selectedLeader.title }}
                <span style="margin-left:12px;font-size:11px;color:#28C76F">📱 {{ selectedLeader.phone }}</span>
                <span style="margin-left:auto;font-size:10px;color:#6F91A8;cursor:pointer" @click="selectedLeader = null">✕ 关闭</span>
              </div>
            </div>
            <div style="margin-bottom:12px">
              <div class="section-label">📊 本月工作</div>
              <div class="stat-grid">
                <div class="stat-card"><div><div class="sc-val">{{ selectedLeader.monthTasks }}</div><div class="sc-lbl">本月事项</div></div></div>
                <div class="stat-card g"><div><div class="sc-val">{{ selectedLeader.monthDone }}</div><div class="sc-lbl">已完成</div></div></div>
                <div class="stat-card r"><div><div class="sc-val">{{ selectedLeader.monthPending }}</div><div class="sc-lbl">待处理</div></div></div>
                <div class="stat-card g"><div><div class="sc-val">{{ doneRate(selectedLeader) }}%</div><div class="sc-lbl">完成率</div></div></div>
              </div>
            </div>
            <div style="margin-bottom:12px">
              <div class="section-label">📈 满意度</div>
              <div class="stat-grid">
                <div class="stat-card g"><div><div class="sc-val">{{ selectedLeader.goodEvals }}</div><div class="sc-lbl">👍 满意</div></div></div>
                <div class="stat-card y"><div><div class="sc-val">{{ selectedLeader.midEvals }}</div><div class="sc-lbl">😐 一般</div></div></div>
                <div class="stat-card r"><div><div class="sc-val">{{ selectedLeader.badEvals }}</div><div class="sc-lbl">👎 待改进</div></div></div>
                <div class="stat-card"><div><div class="sc-val">{{ selectedLeader.satisfaction }}%</div><div class="sc-lbl">综合满意率</div></div></div>
              </div>
            </div>
            <div style="margin-bottom:12px">
              <div class="section-label">📋 年度累计</div>
              <div class="stat-grid">
                <div class="stat-card"><div><div class="sc-val">{{ selectedLeader.yearTasks }}</div><div class="sc-lbl">年度事项</div></div></div>
                <div class="stat-card g"><div><div class="sc-val">{{ selectedLeader.yearDone }}</div><div class="sc-lbl">年度完成</div></div></div>
                <div class="stat-card y"><div><div class="sc-val">{{ selectedLeader.totalEvals }}</div><div class="sc-lbl">群众反馈</div></div></div>
                <div class="stat-card"><div><div class="sc-val">{{ selectedLeader.feedbacks }}</div><div class="sc-lbl">新增留言</div></div></div>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
              <div class="panel">
                <div class="panel-hd"><span class="hd-bar g"></span>工作公开台账</div>
                <div class="panel-bd" style="padding:8px">
                  <table class="data-table">
                    <thead><tr><th>时间</th><th>工作内容</th><th>状态</th></tr></thead>
                    <tbody>
                      <tr v-for="w in selectedLeader.workLog" :key="w.date">
                        <td>{{ w.date }}</td><td>{{ w.content }}</td>
                        <td><span class="st" :class="w.status === '已完成' ? 'online' : 'warning'">{{ w.status }}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="panel">
                <div class="panel-hd"><span class="hd-bar y"></span>群众评价</div>
                <div class="panel-bd">
                  <div v-for="r in selectedLeader.reviews" :key="r.name" class="review-item">
                    <div class="review-header">
                      <span class="review-name">{{ r.name }}</span>
                      <span class="review-stars">{{ '★'.repeat(r.stars) }}{{ '☆'.repeat(5-r.stars) }}</span>
                    </div>
                    <div class="review-text">{{ r.text }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="panel">
              <div class="panel-hd"><span class="hd-bar r"></span>留言监督</div>
              <div class="panel-bd" style="padding:8px">
                <table class="data-table">
                  <thead><tr><th>来自</th><th>内容</th><th>状态</th><th>满意度</th></tr></thead>
                  <tbody>
                    <tr v-for="m in selectedLeader.messages" :key="m.from">
                      <td>{{ m.from }}</td><td>{{ m.text }}</td>
                      <td><span class="st" :class="m.status === '已办结' ? 'online' : m.status === '处理中' ? 'warning' : 'offline'">{{ m.status }}</span></td>
                      <td>{{ m.stars ? '★'.repeat(m.stars)+'☆'.repeat(5-m.stars) : '—' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== PAGE: Device Center ==================== -->
        <div v-show="currentPage === 'device'" class="page-content" key="device">
          <div class="device-center-wrap">
            <div class="device-center-inner">
              <div style="font-size:48px;margin-bottom:16px">📶</div>
              <div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:8px">设备中心</div>
              <div style="font-size:12px;color:#6F91A8;margin-bottom:24px">IoT设备感知 · 视频监控管理</div>
              <div style="display:flex;gap:16px;justify-content:center">
                <div class="module-card" style="width:220px" @click="switchPage('iot')">
                  <div class="mc-icon" style="background:rgba(79,172,254,.12)">📡</div>
                  <h4>IoT设备中心</h4><p>82台设备 · 实时监测 · 异常告警</p>
                  <div class="mc-tags"><span class="tag green">在线78</span><span class="tag yellow">异常3</span></div>
                  <span class="mc-arrow">→</span>
                </div>
                <div class="module-card" style="width:220px" @click="switchPage('monitor')">
                  <div class="mc-icon" style="background:rgba(57,207,123,.12)">📷</div>
                  <h4>监控中心</h4><p>32路摄像头 · 实时画面 · AI识别</p>
                  <div class="mc-tags"><span class="tag green">在线30</span><span class="tag red">离线2</span></div>
                  <span class="mc-arrow">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== PAGE: Settings ==================== -->
        <div v-show="currentPage === 'settings'" class="page-content" key="settings">
          <div class="module-grid">
            <div class="module-card" v-for="s in settingsModules" :key="s.label" @click="openSettingsDetail(s)">
              <div class="mc-icon" :style="{background:s.iconBg}">{{ s.icon }}</div>
              <h4>{{ s.label }}</h4><p>{{ s.desc }}</p>
              <div class="mc-tags"><span class="tag" v-for="t in s.tags" :key="t.text" :class="t.cls">{{ t.text }}</span></div>
              <span class="mc-arrow">→</span>
            </div>
          </div>
        </div>

        <!-- ==================== PAGE: Monitor ==================== -->
        <div v-show="currentPage === 'monitor'" class="page-content" key="monitor">
          <div class="device-center-wrap">
            <div class="device-center-inner">
              <div style="font-size:48px;margin-bottom:16px">📷</div>
              <div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:8px">视频监控中心</div>
              <div style="font-size:12px;color:#6F91A8;margin-bottom:24px">32路摄像头 · AI行为识别 · 实时预警</div>
              <div class="module-grid">
                <div class="module-card" v-for="c in monitorCameras" :key="c.id" @click="toast('摄像头 '+c.name+': '+c.status, 'info')">
                  <div class="mc-icon" :style="{background: c.status === '在线' ? 'rgba(57,217,138,0.12)' : 'rgba(239,68,68,0.12)'}">📹</div>
                  <h4>{{ c.name }}</h4><p>{{ c.location }} · {{ c.resolution }}</p>
                  <div class="mc-tags"><span class="tag" :class="c.status === '在线' ? 'green' : 'red'">{{ c.status }}</span></div>
                </div>
              </div>
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
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import PestWarningCenter from '@/views/industry/agriculture/PestWarningCenter.vue'
import IndustryPage from '@/views/dashboard/IndustryPage.vue'
const L = window.L

const router = useRouter()
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
const treeOpen = ref(false)
const currentPage = ref('dashboard')
const pageTitle = ref('乡村驾驶舱')
const clockTime = ref('00:00:00')
const clockDate = ref('')
const chatInput = ref('')
const toasts = ref([])
let toastId = 0

const hoveredLeader = ref(null)
const selectedLeader = ref(null)

const detailOpen = ref(false)
const detailTitle = ref('')
const detailContent = ref('')
const modalOpen = ref(false)
const modalContent = ref('')

const aiEfficiency = ref(92)
const aiRisk = ref('0.18')
const aiEvents = ref(36)
const aiSummary = ref('本月治理效率提升12%，无人机AI巡控系统投用')
const aiWarning = ref('农业用水异常波动')
const aiWarnColor = ref('#f59e0b')

const industryTab = ref('farming')

// ---- Refs ----
const particlesCvs = ref(null)
const contentArea = ref(null)
const leafletMap = ref(null)
const mapBox = ref(null)
const chatAreaRef = ref(null)
const leaderDetailSection = ref(null)

// Chart refs
const chartDashAge = ref(null)
const chartDashIndustry = ref(null)
const chartGovTrend = ref(null)
const chartGovPie = ref(null)
const chartEcoAir = ref(null)
const chartEcoWater = ref(null)
const chartEcoCarbon = ref(null)
const chartIotStatus = ref(null)
const chartIotFlow = ref(null)

// ---- Page titles ----
const pageTitles = {
  dashboard: '乡村驾驶舱', industry: '数字产业中心', governance: '数字治理中心',
  ecology: '生态治理中心', service: '数字服务中心', iot: '物联网接入',
  data: '数据中心', leadership: '村委班子', device: '设备中心', settings: '系统设置', monitor: '视频监控中心', pest: 'AI病虫害预警中心'
}

// ---- Computed ----
const doneRate = (l) => l.monthTasks > 0 ? Math.round(l.monthDone / l.monthTasks * 100) : 100

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
  pageTitle.value = pageTitles[key] || key
  sidebarOpen.value = false
  selectedLeader.value = null
  if (contentArea.value) contentArea.value.scrollTop = 0
  nextTick(() => { initCharts(); if (key === 'dashboard') initMap() })
}

// ---- Fullscreen ----
function toggleFullscreen() {
  if (document.fullscreenElement) { document.exitFullscreen() }
  else { document.documentElement.requestFullscreen() }
}

// ---- Detail Panel ----
function openDetail(title, content) {
  detailTitle.value = title; detailContent.value = content
  detailOpen.value = true
}
function closeDetail() { detailOpen.value = false }

// ---- Modal ----
function openModal(title, content) {
  modalContent.value = '<h3>' + title + '</h3>' + content
  modalOpen.value = true
}
function closeModal() { modalOpen.value = false }

// ---- Interactive handlers ----
function openStatDetail(label, value) {
  const c = '<div class="detail-section"><h4>数据概览</h4><div class="detail-field"><span class="df-lbl">指标</span><span class="df-val">' + label + '</span></div><div class="detail-field"><span class="df-lbl">当前值</span><span class="df-val">' + value + '</span></div></div><div class="detail-actions"><button class="btn btn-primary" onclick="window._toast && window._toast(\'趋势分析加载中…\',\'success\')">查看趋势</button><button class="btn btn-outline" onclick="window._toast && window._toast(\'报表导出中…\',\'info\')">导出数据</button></div>'
  openDetail(label, c)
}

function openModuleDetail(m) {
  const tagsHtml = m.tags ? m.tags.map(t => '<span class="tag ' + t.cls + '">' + t.text + '</span>').join('') : ''
  const c = '<div class="detail-section"><h4>基本信息</h4><div class="detail-field"><span class="df-lbl">模块名称</span><span class="df-val">' + m.label + '</span></div><div class="detail-field"><span class="df-lbl">状态</span><span class="df-val">运行中</span></div><div class="detail-field"><span class="df-lbl">标签</span><span class="df-val">' + tagsHtml + '</span></div></div><div class="detail-section"><h4>功能描述</h4><p style="font-size:11px;color:#6F91A8;line-height:1.6">' + (m.desc || '暂无描述') + '</p></div><div class="detail-actions"><button class="btn btn-primary" onclick="window._toast && window._toast(\'进入管理页面\',\'success\')">进入管理</button><button class="btn btn-outline" onclick="window._toast && window._toast(\'更多操作\',\'info\')">更多操作</button></div>'
  openDetail(m.label, c)
  toast('已打开：' + m.label, 'info')
}

function openAlertDetail(a) {
  const c = '<div class="detail-section"><h4>预警详情</h4><div class="detail-field"><span class="df-lbl">预警类型</span><span class="df-val">' + a.title + '</span></div><div class="detail-field"><span class="df-lbl">描述</span><span class="df-val">' + a.desc + '</span></div><div class="detail-field"><span class="df-lbl">时间</span><span class="df-val">' + a.time + '</span></div></div><div class="detail-actions"><button class="btn btn-primary" onclick="window._toast && window._toast(\'已派单处理\',\'success\')">派单处理</button><button class="btn btn-outline" onclick="window._toast && window._toast(\'已标记为已读\',\'info\')">标记已读</button></div>'
  openDetail(a.title, c)
}

function openEventDetail(e) {
  const c = '<div class="detail-section"><h4>事件详情</h4><div class="detail-field"><span class="df-lbl">事件编号</span><span class="df-val">' + e.id + '</span></div><div class="detail-field"><span class="df-lbl">事件类型</span><span class="df-val">' + e.type + '</span></div><div class="detail-field"><span class="df-lbl">上报人</span><span class="df-val">' + e.reporter + '</span></div><div class="detail-field"><span class="df-lbl">地点</span><span class="df-val">' + e.location + '</span></div><div class="detail-field"><span class="df-lbl">当前状态</span><span class="df-val">' + e.status + '</span></div></div><div class="detail-actions"><button class="btn btn-primary" onclick="window._toast && window._toast(\'事件处理中…\',\'success\')">处理事件</button><button class="btn btn-outline" onclick="window._toast && window._toast(\'已转交乡镇部门\',\'info\')">转交上级</button></div>'
  openDetail('事件 ' + e.id, c)
}

function openSvcDetail(s) {
  const c = '<div class="detail-section"><h4>服务详情</h4><div class="detail-field"><span class="df-lbl">服务名称</span><span class="df-val">' + s.label + '</span></div><div class="detail-field"><span class="df-lbl">当前状态</span><span class="df-val">' + s.desc + '</span></div></div><div class="detail-actions"><button class="btn btn-primary" onclick="window._toast && window._toast(\'正在打开…\',\'success\')">立即办理</button><button class="btn btn-outline" onclick="window._toast && window._toast(\'进度查询中…\',\'info\')">查询进度</button></div>'
  openDetail(s.label, c)
  toast('已打开服务：' + s.label, 'info')
}

function openSettingsDetail(s) {
  let formHtml = ''
  if (s.label === '用户管理') {
    formHtml = '<div class="detail-section"><h4>用户列表</h4><table class="data-table" style="width:100%"><thead><tr><th>姓名</th><th>角色</th><th>状态</th></tr></thead><tbody><tr><td>邓超</td><td>书记</td><td><span class="st online">活跃</span></td></tr><tr><td>黄尊海</td><td>副书记</td><td><span class="st online">活跃</span></td></tr><tr><td>王大爷</td><td>网格员</td><td><span class="st online">活跃</span></td></tr></tbody></table></div>'
  } else if (s.label === '模块配置') {
    formHtml = '<div class="detail-section"><h4>模块开关</h4><div class="detail-field"><span class="df-lbl">智慧农业</span><span class="df-val" style="color:#39D98A">✓ 已启用</span></div><div class="detail-field"><span class="df-lbl">农产品电商</span><span class="df-val" style="color:#39D98A">✓ 已启用</span></div><div class="detail-field"><span class="df-lbl">乡村文旅</span><span class="df-val" style="color:#28C76F">○ 可选</span></div><div class="detail-field"><span class="df-lbl">养老监测</span><span class="df-val" style="color:#F5B83D">△ 即将上线</span></div><div class="detail-field"><span class="df-lbl">碳汇管理</span><span class="df-val" style="color:#F5B83D">△ 规划中</span></div></div>'
  } else if (s.label === '通知设置') {
    formHtml = '<div class="detail-section"><h4>通知规则</h4><div class="detail-field"><span class="df-lbl">病虫害预警</span><span class="df-val">短信+APP推送</span></div><div class="detail-field"><span class="df-lbl">老人异常</span><span class="df-val">电话+短信+APP</span></div><div class="detail-field"><span class="df-lbl">设备离线</span><span class="df-val">APP推送</span></div></div>'
  } else {
    formHtml = '<div class="detail-section"><h4>' + (s.desc || '暂无描述') + '</h4></div>'
  }
  formHtml += '<div class="detail-actions"><button class="btn btn-primary" onclick="window._toast && window._toast(\'设置已保存\',\'success\')">保存设置</button><button class="btn btn-outline" onclick="window._toast && window._toast(\'已重置为默认\',\'info\')">恢复默认</button></div>'
  openDetail(s.label, formHtml)
  toast('已打开设置：' + s.label, 'info')
}

function showLeaderDetail(l) {
  selectedLeader.value = l
  nextTick(() => { if (leaderDetailSection.value) leaderDetailSection.value.scrollIntoView({ behavior: 'smooth' }) })
}

function showQR(l) {
  const qrMap = { '邓超': 'qr-deng.jpg', '黄尊海': 'qr-huang.jpg', '陈良敏': 'qr-chen.jpg', '廖邦洪': 'qr-liao.jpg', '龚磊': 'qr-gong.jpg', '李强强': 'qr-li.jpg' }
  const qr = qrMap[l.name] || 'qr-wechat.jpg'
  openModal('💚 ' + l.name + ' — 微信二维码', '<div style="text-align:center"><img src="' + qr + '" style="width:200px;height:200px;border-radius:12px;border:3px solid #28C76F;padding:8px;background:#fff"><div style="font-size:11px;color:#6F91A8;margin-top:8px">扫码添加微信</div></div><button class="btn btn-outline btn-sm" style="margin-top:12px;width:100%" onclick="window._closeModal && window._closeModal()">关闭</button>')
}

function sendChat() {
  const q = chatInput.value.trim()
  if (!q) return
  chatMessages.value.push({ role: 'user', text: q })
  chatInput.value = ''

  let reply = '收到您的问题，让我查询一下相关数据…<br><br>根据当前系统记录，相关信息如下：<br>• 您可以咨询村委会获取最新数据<br>• 或拨打便民服务热线：<b>12345</b><br>• 也可登录政务服务平台查询<br><br>请问还有其他需要帮您的吗？'
  if (q.includes('低保')) reply = '根据系统数据，中堰村目前共有 <b style="color:#f59e0b">24户 38人</b> 享受低保待遇。其中：<br>• 1组：8户 12人<br>• 2组：10户 16人<br>• 3组：6户 10人<br>最新审核日期：2026年6月。'
  else if (q.includes('补贴')) reply = '2026年度补贴发放情况：<br>• 耕地地力保护补贴：已发放 <b style="color:#39D98A">¥386,000</b><br>• 农机购置补贴：已发放 <b style="color:#39D98A">¥52,000</b><br>• 低保补助：已发放 <b style="color:#39D98A">¥124,000</b><br>• 养老金：已发放 <b style="color:#39D98A">¥268,000</b><br>发放进度：100%'
  else if (q.includes('会议纪要')) reply = '<b>中堰村2026年6月工作例会纪要</b><br>时间：6月15日 14:00<br>主持：邓超书记<br><br>一、上月工作总结<br>1. 小麦收割工作全面完成<br>2. 电商平台上线运行正常<br><br>二、本月工作安排<br>1. 蜂糖李夏季管护培训<br>2. 澳洲龙虾基地水质监测<br>3. 留守老人关爱走访'
  else if (q.includes('政策')) reply = '近期惠农政策速览：<br>• <b>2026年农机补贴</b>：补贴比例提高至35%<br>• <b>数字乡村试点</b>：省财政安排专项资金<br>• <b>农村电商扶持</b>：物流补贴+免费培训<br>• <b>耕地保护补贴</b>：每亩120元标准<br>详情咨询村委会或登录政务平台查询。'

  setTimeout(() => {
    chatMessages.value.push({ role: 'ai', text: reply })
    nextTick(() => { if (chatAreaRef.value) chatAreaRef.value.scrollTop = chatAreaRef.value.scrollHeight })
  }, 600 + Math.random() * 800)
}

// ==================== CLOCK ====================
let clockTimer
function updateClock() {
  const n = new Date()
  clockTime.value = String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0') + ':' + String(n.getSeconds()).padStart(2, '0')
  clockDate.value = n.getFullYear() + '年' + (n.getMonth() + 1) + '月' + n.getDate() + '日 星期' + ['日', '一', '二', '三', '四', '五', '六'][n.getDay()]
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
  return instance
}

function initDashboardCharts() {
  if (chartDashAge.value) {
    makeChart(chartDashAge.value, {
      tooltip: { trigger: 'item', backgroundColor: 'rgba(4,18,40,0.95)', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#c8daea', fontSize: 10 } },
      series: [{ type: 'pie', radius: ['55%', '75%'], center: ['50%', '55%'], itemStyle: { borderColor: 'rgba(8,28,58,0.92)', borderWidth: 2 }, label: { color: '#5e7a9a', fontSize: 9, formatter: '{b}\n{d}%' },
        data: [
          { value: 236, name: '0-18岁', itemStyle: { color: '#28C7FA' } },
          { value: 562, name: '19-45岁', itemStyle: { color: '#39D98A' } },
          { value: 250, name: '46-60岁', itemStyle: { color: '#f59e0b' } },
          { value: 238, name: '60岁以上', itemStyle: { color: '#E74C3C' } }
        ]
      }]
    })
  }
  if (chartDashIndustry.value) {
    makeChart(chartDashIndustry.value, {
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(4,18,40,0.95)', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#c8daea', fontSize: 10 } },
      grid: { left: 8, right: 28, top: 5, bottom: 16 },
      xAxis: { type: 'value', axisLine: { show: false }, axisTick: { show: false }, splitLine: { lineStyle: { color: 'rgba(57,217,138,0.06)' } }, axisLabel: { color: '#5e7a9a', fontSize: 9 } },
      yAxis: { type: 'category', data: ['电商', '旅游', '养殖', '种植'], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#c8daea', fontSize: 10 } },
      series: [{
        type: 'bar', barWidth: 13, itemStyle: { borderRadius: [0, 3, 3, 0] }, label: { show: true, position: 'right', color: '#c8daea', fontSize: 9, formatter: '¥{c}万' },
        data: [
          { value: 48, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: 'rgba(139,92,246,.4)' }, { offset: 1, color: '#28C7FA' }]) } },
          { value: 52, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: 'rgba(245,158,11,.4)' }, { offset: 1, color: '#f59e0b' }]) } },
          { value: 178, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: 'rgba(16,214,160,.4)' }, { offset: 1, color: '#39D98A' }]) } },
          { value: 245, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: 'rgba(57,217,138,0.30)' }, { offset: 1, color: '#28C7FA' }]) } }
        ]
      }]
    })
  }
}

function initGovCharts() {
  if (chartGovTrend.value) {
    makeChart(chartGovTrend.value, {
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(4,18,40,0.95)', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#c8daea', fontSize: 10 } },
      grid: { left: 8, right: 20, top: 10, bottom: 24 },
      xAxis: { type: 'category', data: ['6/12', '6/13', '6/14', '6/15', '6/16', '6/17', '6/18'], axisLabel: { color: '#5e7a9a', fontSize: 9 } },
      yAxis: { type: 'value', axisLabel: { color: '#5e7a9a', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(14,165,233,0.06)' } } },
      series: [
        { type: 'bar', data: [8, 12, 5, 9, 7, 6, 10], barWidth: 16, itemStyle: { borderRadius: [3, 3, 0, 0], color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#28C7FA' }, { offset: 1, color: 'rgba(57,217,138,0.20)' }]) } },
        { type: 'line', data: [8, 12, 5, 9, 7, 6, 10], smooth: true, lineStyle: { color: '#39D98A', width: 2 }, itemStyle: { color: '#39D98A' }, symbol: 'circle', symbolSize: 6 }
      ]
    })
  }
  if (chartGovPie.value) {
    makeChart(chartGovPie.value, {
      tooltip: { trigger: 'item', backgroundColor: 'rgba(4,18,40,0.95)', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#c8daea', fontSize: 10 } },
      series: [{ type: 'pie', radius: ['50%', '72%'], center: ['50%', '50%'], itemStyle: { borderColor: 'rgba(8,28,58,0.92)', borderWidth: 2 }, label: { color: '#5e7a9a', fontSize: 9 },
        data: [
          { value: 18, name: '基础设施', itemStyle: { color: '#28C7FA' } }, { value: 12, name: '环境卫生', itemStyle: { color: '#39D98A' } },
          { value: 8, name: '老人关怀', itemStyle: { color: '#f59e0b' } }, { value: 5, name: '农业生产', itemStyle: { color: '#E74C3C' } }, { value: 4, name: '其他', itemStyle: { color: '#28C7FA' } }
        ]
      }]
    })
  }
}

function initEcoCharts() {
  if (chartEcoAir.value) {
    makeChart(chartEcoAir.value, {
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(4,18,40,0.95)', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#c8daea', fontSize: 10 } },
      grid: { left: 8, right: 20, top: 10, bottom: 24 }, legend: { data: ['AQI', 'PM2.5'], textStyle: { color: '#5e7a9a', fontSize: 9 }, top: 0, right: 0 },
      xAxis: { type: 'category', data: ['6/12', '6/13', '6/14', '6/15', '6/16', '6/17', '6/18'], axisLabel: { color: '#5e7a9a', fontSize: 9 } },
      yAxis: [{ type: 'value', name: 'AQI', axisLabel: { color: '#5e7a9a', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(14,165,233,0.06)' } } }, { type: 'value', name: 'μg/m³', axisLabel: { color: '#5e7a9a', fontSize: 9 } }],
      series: [
        { name: 'AQI', type: 'line', data: [38, 45, 42, 48, 40, 44, 42], yAxisIndex: 0, smooth: true, lineStyle: { color: '#39D98A', width: 2 }, itemStyle: { color: '#39D98A' } },
        { name: 'PM2.5', type: 'bar', data: [12, 16, 15, 18, 14, 17, 15], yAxisIndex: 1, barWidth: 12, itemStyle: { borderRadius: [3, 3, 0, 0], color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#28C7FA' }, { offset: 1, color: 'rgba(57,217,138,0.20)' }]) } }
      ]
    })
  }
  if (chartEcoWater.value) {
    makeChart(chartEcoWater.value, {
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(4,18,40,0.95)', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#c8daea', fontSize: 10 } },
      grid: { left: 8, right: 20, top: 10, bottom: 24 },
      xAxis: { type: 'category', data: ['1号水塘', '2号水塘', '3号水塘', '灌溉渠', '村北河'], axisLabel: { color: '#5e7a9a', fontSize: 9, rotate: 15 } },
      yAxis: { type: 'value', name: 'mg/L', axisLabel: { color: '#5e7a9a', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(14,165,233,0.06)' } } },
      series: [{
        type: 'bar', barWidth: 20, itemStyle: { borderRadius: [3, 3, 0, 0] },
        data: [
          { value: 6.8, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#39D98A' }, { offset: 1, color: 'rgba(16,214,160,.2)' }]) } },
          { value: 5.5, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#39D98A' }, { offset: 1, color: 'rgba(16,214,160,.2)' }]) } },
          { value: 3.2, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#E74C3C' }, { offset: 1, color: 'rgba(239,68,68,.2)' }]) } },
          { value: 7.2, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#39D98A' }, { offset: 1, color: 'rgba(16,214,160,.2)' }]) } },
          { value: 6.2, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#28C7FA' }, { offset: 1, color: 'rgba(57,217,138,0.20)' }]) } }
        ],
        markLine: { silent: true, data: [{ yAxis: 5, label: { formatter: '标准线(5mg/L)', fontSize: 9, color: '#f59e0b' }, lineStyle: { color: '#f59e0b', type: 'dashed' } }] }
      }]
    })
  }
  if (chartEcoCarbon.value) {
    makeChart(chartEcoCarbon.value, {
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(4,18,40,0.95)', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#c8daea', fontSize: 10 } },
      grid: { left: 8, right: 20, top: 10, bottom: 24 },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'], axisLabel: { color: '#5e7a9a', fontSize: 9 } },
      yAxis: { type: 'value', name: '吨', axisLabel: { color: '#5e7a9a', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(14,165,233,0.06)' } } },
      series: [
        { name: '碳汇量', type: 'bar', stack: 'total', data: [68, 72, 75, 70, 80, 86], barWidth: 20, itemStyle: { color: '#39D98A', borderRadius: [3, 3, 0, 0] } },
        { name: '废弃物回收', type: 'bar', stack: 'total', data: [45, 48, 52, 50, 55, 58], barWidth: 20, itemStyle: { color: '#28C7FA' } }
      ]
    })
  }
}

function initIotCharts() {
  if (chartIotStatus.value) {
    makeChart(chartIotStatus.value, {
      tooltip: { trigger: 'item', backgroundColor: 'rgba(4,18,40,0.95)', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#c8daea', fontSize: 10 } },
      series: [{ type: 'pie', radius: ['55%', '75%'], center: ['50%', '50%'], itemStyle: { borderColor: 'rgba(8,28,58,0.92)', borderWidth: 2 }, label: { color: '#5e7a9a', fontSize: 10, formatter: '{b}: {c}台' },
        data: [{ value: 47, name: '在线', itemStyle: { color: '#39D98A' } }, { value: 3, name: '异常', itemStyle: { color: '#f59e0b' } }, { value: 2, name: '离线', itemStyle: { color: '#E74C3C' } }]
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
      series: [{ type: 'line', data: vals, smooth: true, lineStyle: { color: '#28C7FA', width: 2 }, itemStyle: { color: '#28C7FA' }, symbol: 'none', areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(57,217,138,0.25)' }, { offset: 1, color: 'rgba(14,165,233,.02)' }]) } }]
    })
  }
}

function initCharts() {
  const chartsMap = {
    dashboard: initDashboardCharts,
    governance: initGovCharts,
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

function makeDot(color, size) {
  return L.divIcon({
    html: '<div style="background:' + color + ';width:' + size + 'px;height:' + size + 'px;border-radius:50%;box-shadow:0 0 8px ' + color + ';position:relative"><div style="position:absolute;inset:-4px;border-radius:50%;border:2px solid ' + color + ';animation:livePulse 2s ease-out infinite"></div></div>',
    className: '', iconSize: [size + 8, size + 8], iconAnchor: [(size + 8) / 2, (size + 8) / 2]
  })
}

function initMap() {
  const mapEl = leafletMap.value
  if (!mapEl) return
  if (map) { map.remove(); map = null }

  map = L.map(mapEl, { center: [32.695, 109.025], zoom: 15, zoomControl: false, attributionControl: false })

  L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
    subdomains: ['1', '2', '3', '4'], maxZoom: 18
  }).addTo(map)

  const pois = [
    { lat: 32.695, lng: 109.025, label: '村委会', color: '#f59e0b', icon: '🏛️', type: 'gov' },
    { lat: 32.697, lng: 109.028, label: '蜂糖李基地', color: '#39D98A', icon: '🍎', type: 'farm' },
    { lat: 32.696, lng: 109.030, label: '富硒黄桃园', color: '#39D98A', icon: '🍎', type: 'farm' },
    { lat: 32.693, lng: 109.027, label: '油葵种植区', color: '#39D98A', icon: '🌾', type: 'farm' },
    { lat: 32.698, lng: 109.022, label: '阳光玫瑰葡萄园', color: '#39D98A', icon: '🌰', type: 'farm' },
    { lat: 32.694, lng: 109.032, label: '荷花种植区', color: '#39D98A', icon: '🍒', type: 'farm' },
    { lat: 32.692, lng: 109.023, label: '智能温室大棚', color: '#39D98A', icon: '🥬', type: 'farm' },
    { lat: 32.696, lng: 109.020, label: '澳洲龙虾基地', color: '#39D98A', icon: '🐖', type: 'farm' },
    { lat: 32.695, lng: 109.022, label: '1组居住区', color: '#28C7FA', icon: '🏠', type: 'home' },
    { lat: 32.693, lng: 109.029, label: '2组居住区', color: '#28C7FA', icon: '🏠', type: 'home' },
    { lat: 32.698, lng: 109.026, label: '3组居住区', color: '#28C7FA', icon: '🏠', type: 'home' },
    { lat: 32.697, lng: 109.025, label: '气象监测站', color: '#28C7FA', icon: '📡', type: 'mon' },
    { lat: 32.694, lng: 109.026, label: '土壤传感器#2', color: '#28C7FA', icon: '📡', type: 'mon' },
    { lat: 32.692, lng: 109.030, label: '水质监测#1', color: '#28C7FA', icon: '📡', type: 'mon' },
    { lat: 32.699, lng: 109.028, label: '观景台', color: '#f59e0b', icon: '🏞️', type: 'gov' }
  ]

  pois.forEach(p => {
    const marker = L.marker([p.lat, p.lng], { icon: makeDot(p.color, p.type === 'mon' ? 6 : 8) }).addTo(map)
    marker.bindTooltip(p.icon + ' ' + p.label, { permanent: true, direction: 'top', offset: [0, -10], className: 'map-tooltip' })
    marker.bindPopup('<div style="font-family:PingFang SC,Microsoft YaHei,sans-serif;font-size:13px"><b>' + p.icon + ' ' + p.label + '</b><br><span style="color:#8aa0b8;font-size:11px">类型：' + (p.type === 'farm' ? '种植区' : p.type === 'mon' ? '监测站' : p.type === 'home' ? '居住区' : '重点区域') + '</span></div>')
  })

  const govIcon = L.divIcon({
    html: '<div style="background:#f59e0b;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;box-shadow:0 0 20px rgba(245,158,11,.7);border:3px solid #fff">🏛️</div>',
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
    L.circle([f.lat, f.lng], { radius: f.radius, color: '#39D98A', fillColor: '#39D98A', fillOpacity: 0.08, weight: 1.5, dashArray: '6 4' })
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
  aiEfficiency.value = 88 + Math.floor(Math.random() * 8)
  aiRisk.value = (0.10 + Math.random() * 0.15).toFixed(2)
  aiEvents.value = 28 + Math.floor(Math.random() * 16)
  const tips = ['治理效率稳步提升，无人机AI巡控系统贡献显著', '事件响应时间持续下降，网格员巡查覆盖率100%', '农业产业数据正常，蜂糖李基地传感器运行良好', '本月群众满意度上升3个百分点，留言回复率98%']
  aiSummary.value = tips[Math.floor(Math.random() * tips.length)]
  const warns = ['无异常', '农业用水波动提醒', '3号水塘溶解氧需关注', '空气质量接近预警线', '无异常', '无异常']
  const w = warns[Math.floor(Math.random() * warns.length)]
  aiWarning.value = w === '无异常' ? '✅ 当前无风险预警' : ('⚠️ ' + w)
  aiWarnColor.value = w === '无异常' ? '#39D98A' : '#f59e0b'
}

// ==================== KEYBOARD SHORTCUTS ====================
function onKeydown(e) {
  if (e.key === 'Escape') { closeDetail(); closeModal() }
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
  isMobile.value = window.innerWidth <= 1200
  initParticles()
  updateClock()
  clockTimer = setInterval(updateClock, 1000)
  aiRefreshTimer = setInterval(refreshAI, 30000)
  window.addEventListener('resize', onResize)
  window.addEventListener('keydown', onKeydown)
  nextTick(() => { initDashboardCharts(); initMap() })
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  if (clockTimer) clearInterval(clockTimer)
  if (aiRefreshTimer) clearInterval(aiRefreshTimer)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('keydown', onKeydown)
  disposeCharts()
  if (map) { map.remove(); map = null }
})

// ==================== DATA ====================

// Alert items
const alertItems = [
  { id: 1, icon: '🌧️', title: '未来3天降雨概率80%', desc: '建议暂停灌溉', time: '10分钟前' },
  { id: 2, icon: '🐛', title: '苹果园区蚜虫预警', desc: '建议48h内防治', time: '25分钟前' },
  { id: 3, icon: '👴', title: '独居老人异常-张奶奶', desc: '24h未检测到活动', time: '1小时前' },
  { id: 4, icon: '💧', title: '3号水塘水质异常', desc: '溶解氧偏低', time: '2小时前' }
]

// IoT device list
const iotDeviceList = [
  { id: 1, name: '1号气象站', status: 'online', statusText: '在线' },
  { id: 2, name: '2号土壤传感器', status: 'online', statusText: '在线' },
  { id: 3, name: '1号水质监测仪', status: 'warn', statusText: '异常' },
  { id: 4, name: '村口监控摄像头', status: 'online', statusText: '在线' },
  { id: 5, name: '养殖场环境传感器', status: 'online', statusText: '在线' },
  { id: 6, name: '4号土壤传感器', status: 'offline', statusText: '离线' }
]

// Bottom cards
const bottomCards = [
  { label: '今日电商订单', value: '128', sub: '↑12%' },
  { label: '待处理事件', value: '3件', sub: '↓40%' },
  { label: '本月游客', value: '3,200', sub: '↑22%' },
  { label: '便民服务', value: '156', sub: '↑18%' },
  { label: '培训人次', value: '2.96', sub: '2024年数据' },
  { label: 'API调用/日', value: '2.3万', sub: '运行24h' }
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

// Governance
const govStats = [
  { label: '待处理事件', value: '3', sub: '↓40% 较上月', icon: '📋', iconBg: '#FDE8E8' },
  { label: '本月处理事件', value: '47', sub: '处理率 96%', icon: '✅', iconBg: 'rgba(57,217,138,0.12)' },
  { label: '网格员巡查次数', value: '128', sub: '覆盖率 100%', icon: '🚶', iconBg: '#FFF8E8' },
  { label: '网格分区', value: '10', sub: '10名网格员', icon: '🗺️', iconBg: 'rgba(14,165,233,.10)' }
]
const eventItems = [
  { id: '#EV0617', type: '基础设施', reporter: '王大爷', location: '村东口路灯', status: '处理中', statusCls: 'warning', time: '09:30' },
  { id: '#EV0616', type: '环境卫生', reporter: '刘阿姨', location: '3组晒场旁', status: '已完成', statusCls: 'online', time: '昨天' },
  { id: '#EV0615', type: '水管破裂', reporter: '张大叔', location: '村南灌溉渠', status: '已完成', statusCls: 'online', time: '6/15' },
  { id: '#EV0614', type: '老人关怀', reporter: '系统自动', location: '2组李奶奶家', status: '已完成', statusCls: 'online', time: '6/14' },
  { id: '#EV0613', type: '农业生产', reporter: '赵大哥', location: '苹果园区', status: '已完成', statusCls: 'online', time: '6/13' }
]
const fiveDimData = [
  { icon: '👤', label: '人口管理', desc: '2,910人建档' }, { icon: '🏠', label: '房屋管理', desc: '816户登记' },
  { icon: '🌍', label: '土地管理', desc: '3,850亩耕地' }, { icon: '📌', label: '事件管理', desc: '47件/月' },
  { icon: '📦', label: '物品管理', desc: '集体资产台账' }, { icon: '👴', label: '特殊群体', desc: '38人关怀' }
]
const chatMessages = reactive([
  { role: 'ai', text: '👋 您好！我是中堰村AI助手，您可以问我：<br>• 村里有多少低保户？  • 今年补贴资金发放情况？<br>• 帮我生成本月会议纪要。  • 最新的惠农政策有哪些？' }
])

// Ecology
const ecoStats = [
  { label: '空气质量指数', value: '42优', sub: 'PM2.5: 15μg/m³', icon: '🌬️', iconBg: 'rgba(57,217,138,0.12)' },
  { label: '水质综合指数', value: 'Ⅱ类', sub: '3号水塘需关注', icon: '💧', iconBg: 'rgba(14,165,233,.10)' },
  { label: '碳汇量估算', value: '860', sub: '吨CO₂当量/年', icon: '🌳', iconBg: '#FFF8E8' },
  { label: '秸秆综合利用率', value: '92%', sub: '↑5% 同比', icon: '♻️', iconBg: '#FDE8E8' }
]
const ecoAlerts = [
  { id: 1, icon: '💧', title: '3号水塘溶解氧偏低', desc: '当前值 3.2mg/L，标准≥5mg/L', time: '1小时前 · 已派单' },
  { id: 2, icon: '🌫️', title: 'PM10浓度接近预警值', desc: '当前值 48μg/m³，预警线50μg/m³', time: '2小时前 · 持续监测' },
  { id: 3, icon: '🗑️', title: '垃圾清运延迟提醒', desc: '1组垃圾点超过24h未清运', time: '3小时前 · 已通知保洁' }
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
const iotStats = [
  { label: '设备在线', value: '47/52', sub: '在线率 90.4%', icon: '📡', iconBg: 'rgba(57,217,138,0.12)' },
  { label: '总设备数', value: '52', sub: '6种类型', icon: '🔌', iconBg: 'rgba(14,165,233,.10)' },
  { label: '日均数据上报', value: '2.4万次', sub: 'MQTT协议', icon: '📶', iconBg: '#FFF8E8' }
]
const iotDevicesFull = [
  { id: 'IOT-001', name: '1号气象站', type: '气象监测', location: '村东果园', protocol: 'MQTT', statusText: '在线', statusCls: 'online', lastData: '1分钟前' },
  { id: 'IOT-002', name: '2号土壤传感器', type: '土壤墒情', location: '油葵种植区', protocol: 'MQTT', statusText: '在线', statusCls: 'online', lastData: '3分钟前' },
  { id: 'IOT-003', name: '1号水质监测仪', type: '水质监测', location: '3号水塘', protocol: 'MQTT', statusText: '异常', statusCls: 'warning', lastData: '10分钟前' },
  { id: 'IOT-004', name: '村口监控摄像头', type: '视频监控', location: '村东入口', protocol: 'RTSP', statusText: '在线', statusCls: 'online', lastData: '实时' },
  { id: 'IOT-005', name: '养殖场环境传感器', type: '环境监测', location: '养猪场A区', protocol: 'MQTT', statusText: '在线', statusCls: 'online', lastData: '2分钟前' },
  { id: 'IOT-008', name: '4号土壤传感器', type: '土壤墒情', location: '阳光玫瑰葡萄园', protocol: 'MQTT', statusText: '离线', statusCls: 'offline', lastData: '2小时前' }
]

// Data Center
const dataStats = [
  { label: '数据总量', value: '1.8GB', sub: '日增 ~5MB', icon: '🗄️', iconBg: 'rgba(14,165,233,.10)' },
  { label: '数据表', value: '86', sub: '14个业务域', icon: '📊', iconBg: 'rgba(57,217,138,0.12)' },
  { label: 'API接口', value: '124', sub: '日均2.3万次调用', icon: '🔌', iconBg: '#FFF8E8' }
]
const dataAssets = [
  { label: '人口数据', pct: 100, count: '1,286条' }, { label: '土地数据', pct: 78, count: '852条' },
  { label: '产业数据', pct: 65, count: '634条' }, { label: '环境数据', pct: 45, count: '2.4万条' },
  { label: 'IoT数据', pct: 92, count: '18.6万条' }
]

// Leadership
const leaders = [
  {
    id: 'deng', name: '邓超', title: '党总支部书记、村委会主任', org: '中堰村党总支部', avatar: '邓', color: '#E74C3C',
    photo: 'leader-deng.jpg', phone: '15929510089',
    duties: '负责村党总支部和村民委员会全面工作，统筹乡村振兴、基层党建、产业发展和村级治理等重点工作。',
    monthTasks: 22, monthDone: 20, monthPending: 2, yearTasks: 264, yearDone: 248,
    satisfaction: 97, totalEvals: 156, goodEvals: 150, midEvals: 5, badEvals: 1,
    feedbacks: 28, feedbackDone: 25, feedbackPending: 2, feedbackWait: 1,
    workLog: [
      { date: '7月1日', content: '党总支部庆"七一"主题党日活动', status: '已完成' },
      { date: '6月25日', content: '笃敬产业园澳洲龙虾项目推进会', status: '已完成' },
      { date: '6月15日', content: '省级"千万工程"示范村创建验收', status: '已完成' },
      { date: '6月5日', content: '数字乡村平台建设推进会', status: '已完成' },
      { date: '5月20日', content: '村集体经济半年总结会议', status: '已完成' }
    ],
    reviews: [
      { name: '村民张大叔', text: '邓书记带领村里发展得很好，产业园越做越大', stars: 5 },
      { name: '村民李婶', text: '村里变化太大了，路修好了，环境也漂亮了', stars: 5 },
      { name: '村民小王', text: '希望能继续引进更多产业项目', stars: 4 },
      { name: '村民老刘', text: '关心群众，经常到家里走访慰问', stars: 5 }
    ],
    messages: [
      { from: '村民张某', text: '建议在产业园附近增加停车位', status: '已办结', stars: 5 },
      { from: '村民赵某', text: '希望扩大澳洲龙虾养殖规模', status: '已办结', stars: 5 },
      { from: '村民刘某', text: '建议增加村公交班次', status: '处理中', stars: null }
    ]
  },
  {
    id: 'huang', name: '黄尊海', title: '党总支部副书记', org: '中堰村党总支部', avatar: '黄', color: '#F8B400',
    photo: 'leader-huang.jpg', phone: '15229151368',
    duties: '协助书记开展党建工作，负责党员管理、组织建设、党员包片联户及村级事务协调。',
    monthTasks: 14, monthDone: 13, monthPending: 1, yearTasks: 168, yearDone: 161,
    satisfaction: 95, totalEvals: 98, goodEvals: 94, midEvals: 4, badEvals: 0,
    feedbacks: 18, feedbackDone: 16, feedbackPending: 2, feedbackWait: 0,
    workLog: [
      { date: '6月28日', content: '"清洁家园·党员劳动日"第21次活动', status: '已完成' },
      { date: '6月20日', content: '党员包片联户走访 — 全覆盖完成', status: '已完成' },
      { date: '6月10日', content: '主题党日活动 — 学习乡村振兴政策', status: '已完成' },
      { date: '5月28日', content: '"和美庭院"示范户评选', status: '已完成' }
    ],
    reviews: [
      { name: '党员老张', text: '黄副书记工作细致，党建活动组织得很好', stars: 5 },
      { name: '村民刘婶', text: '党员劳动日活动很有意义，村子变干净了', stars: 5 },
      { name: '村民小赵', text: '包片联户制度落实到位，有问题能及时反映', stars: 4 }
    ],
    messages: [
      { from: '党员王某', text: '建议增加线上党员学习资源', status: '已办结', stars: 5 },
      { from: '村民陈某', text: '希望多组织一些文艺活动', status: '处理中', stars: null }
    ]
  },
  {
    id: 'chen', name: '陈良敏', title: '村委会副主任', org: '中堰村村民委员会', avatar: '陈', color: '#28C7FA',
    photo: 'leader-chen.jpg', phone: '15389513886',
    duties: '负责村务管理、公共服务、基础设施建设、人居环境整治及产业项目推进。',
    monthTasks: 30, monthDone: 27, monthPending: 3, yearTasks: 360, yearDone: 338,
    satisfaction: 94, totalEvals: 145, goodEvals: 136, midEvals: 8, badEvals: 1,
    feedbacks: 26, feedbackDone: 23, feedbackPending: 2, feedbackWait: 1,
    workLog: [
      { date: '6月30日', content: '智慧市集项目 — 主体工程完工验收', status: '已完成' },
      { date: '6月18日', content: '产业园道路硬化1.1公里 — 竣工验收', status: '已完成' },
      { date: '6月8日', content: '人居环境整治 — "扫干净、摆整齐"专项行动', status: '已完成' },
      { date: '5月25日', content: '污水管网铺设800米 — 完工', status: '已完成' }
    ],
    reviews: [
      { name: '村民老赵', text: '陈主任办事效率高，修路修渠都很及时', stars: 5 },
      { name: '村民周婶', text: '村里环境比以前好太多了', stars: 5 },
      { name: '村民小陈', text: '希望能加快智慧市集开业进度', stars: 4 }
    ],
    messages: [
      { from: '村民钱某', text: '村东排水管道需要疏通', status: '已办结', stars: 5 },
      { from: '村民孙某', text: '建议增加路灯密度', status: '处理中', stars: null }
    ]
  },
  {
    id: 'liao', name: '廖邦洪', title: '村委会副主任', org: '中堰村村民委员会', avatar: '廖', color: '#39D98A',
    photo: 'leader-liao.jpg', phone: '13679151313',
    duties: '负责产业发展、集体经济运营、资产盘活、招商引资及现代农业项目管理。',
    monthTasks: 26, monthDone: 24, monthPending: 2, yearTasks: 312, yearDone: 295,
    satisfaction: 95, totalEvals: 132, goodEvals: 126, midEvals: 5, badEvals: 1,
    feedbacks: 22, feedbackDone: 20, feedbackPending: 1, feedbackWait: 1,
    workLog: [
      { date: '6月28日', content: '澳洲淡水龙虾首批育苗成功 — 投放10万尾', status: '已完成' },
      { date: '6月22日', content: '人才公寓32套全部出租 — 年收入40万', status: '已完成' },
      { date: '6月12日', content: '蜂糖李采摘季筹备 — 对接电商平台', status: '已完成' },
      { date: '5月30日', content: '室内篮球馆运营合同续签 — 年收入22万', status: '已完成' }
    ],
    reviews: [
      { name: '村民老周', text: '廖主任搞产业有一套，集体经济涨了不少', stars: 5 },
      { name: '种植户小马', text: '帮忙对接了电商销路，蜂糖李卖得很好', stars: 5 },
      { name: '村民小杨', text: '希望能带动更多农户参与', stars: 4 }
    ],
    messages: [
      { from: '村民黄某', text: '建议增加蜂糖李深加工', status: '已办结', stars: 5 },
      { from: '村民杨某', text: '希望能引进更多适合本地的产业', status: '处理中', stars: null }
    ]
  },
  {
    id: 'gong', name: '龚磊', title: '监委会主任', org: '中堰村监督委员会', avatar: '龚', color: '#8b5cf6',
    photo: 'leader-gong.jpg', phone: '17889100100',
    duties: '负责村务监督、财务审计、工程招投标监督、村务公开及民主理财工作。',
    monthTasks: 10, monthDone: 9, monthPending: 1, yearTasks: 120, yearDone: 115,
    satisfaction: 93, totalEvals: 68, goodEvals: 63, midEvals: 5, badEvals: 0,
    feedbacks: 14, feedbackDone: 13, feedbackPending: 1, feedbackWait: 0,
    workLog: [
      { date: '6月30日', content: '第二季度村财务审计 — 完成公示', status: '已完成' },
      { date: '6月20日', content: '智慧市集工程招投标监督', status: '已完成' },
      { date: '6月8日', content: '"四议两公开"制度执行情况检查', status: '已完成' },
      { date: '5月15日', content: '村集体经济收益分配方案审核', status: '已完成' }
    ],
    reviews: [
      { name: '村民老吴', text: '龚主任监督很严格，财务公开透明', stars: 5 },
      { name: '村民小郑', text: '工程招投标都有监督，大家放心', stars: 4 }
    ],
    messages: [
      { from: '村民郑某', text: '建议增加财务公开的频次', status: '已办结', stars: 5 }
    ]
  },
  {
    id: 'li', name: '李强强', title: '村委会文书', org: '中堰村村民委员会', avatar: '李', color: '#0ea5e9',
    photo: 'leader-li.jpg', phone: '15991187663',
    duties: '负责文书记录、档案管理、数据统计、信息报送、会务组织及日常办公事务。',
    monthTasks: 16, monthDone: 15, monthPending: 1, yearTasks: 192, yearDone: 185,
    satisfaction: 96, totalEvals: 88, goodEvals: 85, midEvals: 3, badEvals: 0,
    feedbacks: 10, feedbackDone: 9, feedbackPending: 1, feedbackWait: 0,
    workLog: [
      { date: '6月30日', content: '数字乡村平台数据录入 — 完成2910人信息', status: '已完成' },
      { date: '6月22日', content: '上半年各类报表汇总上报', status: '已完成' },
      { date: '6月12日', content: '组织村民代表大会 — 会议记录归档', status: '已完成' },
      { date: '5月30日', content: '档案室规范化整理', status: '已完成' }
    ],
    reviews: [
      { name: '村民小朱', text: '小李工作认真，办事效率高', stars: 5 },
      { name: '村民小徐', text: '去村委会办事，态度很好', stars: 5 }
    ],
    messages: [
      { from: '村民吴某', text: '建议开通线上办事渠道', status: '已办结', stars: 5 },
      { from: '村民郑某', text: '希望能简化一些证明开具流程', status: '已办结', stars: 4 }
    ]
  }
]

// Settings
const settingsModules = [
  { label: '用户管理', icon: '👥', iconBg: 'rgba(14,165,233,.10)', desc: '村民、村干部、乡镇管理员等角色配置与权限分配', tags: [{ text: '6种角色', cls: 'blue' }] },
  { label: '模块配置', icon: '🧩', iconBg: 'rgba(57,217,138,0.12)', desc: '菜单式模块开关，按村庄类型灵活组合功能模块', tags: [{ text: '核心功能', cls: 'green' }] },
  { label: '通知设置', icon: '🔔', iconBg: '#FFF8E8', desc: '预警阈值配置、消息推送规则、短信/微信通知模板', tags: [{ text: '可配置', cls: 'yellow' }] },
  { label: '操作日志', icon: '📋', iconBg: 'rgba(139,92,246,.12)', desc: '系统操作审计日志、数据变更记录、安全合规管理', tags: [{ text: '审计', cls: 'blue' }] },
  { label: '安全设置', icon: '🔐', iconBg: '#FDE8E8', desc: '密码策略、登录限制、数据加密、访问控制管理', tags: [{ text: '安全', cls: 'red' }] },
  { label: '数据备份', icon: '💾', iconBg: 'rgba(14,165,233,.10)', desc: '自动备份策略、手动备份、数据恢复、异地容灾', tags: [{ text: '运维', cls: 'blue' }] }
]

// Monitor cameras
const monitorCameras = [
  { id: 1, name: '村口主摄像头', location: '村东入口', resolution: '1080P', status: '在线' },
  { id: 2, name: '产业园全景', location: '笃敬产业园', resolution: '4K', status: '在线' },
  { id: 3, name: '村委会大院', location: '村委会', resolution: '1080P', status: '在线' },
  { id: 4, name: '停车场监控', location: '村停车场', resolution: '720P', status: '离线' },
  { id: 5, name: '养殖场监控', location: '养猪场A区', resolution: '1080P', status: '在线' },
  { id: 6, name: '水塘监控', location: '3号水塘', resolution: '1080P', status: '在线' }
]

console.log('🏘️ 中堰村 · 蓝匠数智数字乡村平台 Vue3 全部功能已就绪')
</script>

<style>
@import '@/../public/design-tokens.css';

:root {
  --bg: #071B2D; --panel-bg: rgba(8,24,48,0.88);
  --panel-border: rgba(40,199,111,0.10); --accent: #28C76F;
  --accent2: #28C76F; --accent3: #F5B83D; --accent4: #E74C3C; --accent5: #A77BFF;
  --text: #B7D3E8; --text-dim: #6F91A8; --text-bright: #FFFFFF;
  --sidebar-w: 220px; --header-h: 52px;
  --pri: #28C76F; --td: #6F91A8; --tb: #fff;
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
  background: rgba(5, 24, 47, 0.96) !important;
  border: 1px solid rgba(190, 214, 234, 0.78) !important;
  border-radius: 10px !important;
  box-shadow: none !important;
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
  border-color: rgba(65, 185, 245, 0.95) !important;
  transform: translateY(-2px);
}
.page-industry-embed .srow,
.page-industry-embed .module-grid {
  gap: 14px !important;
}
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
.sidebar.collapsed { transform:translateX(calc(var(--sidebar-w) * -1)) }
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

/* ========== HEADER ========== */
.header {
  flex-shrink:0; height:var(--header-h); display:flex; align-items:center; justify-content:space-between;
  padding:0 16px; background:linear-gradient(180deg,rgba(10,60,130,0.2) 0%,rgba(6,24,52,0.05) 100%);
  border-bottom:1px solid rgba(0,0,0,0.06); position:relative;
}
.hdr-left { display:flex; align-items:center; gap:12px }
.hdr-right { display:flex; align-items:center; gap:16px }
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
  background:rgba(8,24,48,0.88); backdrop-filter:blur(12px);
  border:1px solid var(--panel-border); border-radius:8px;
  display:flex; flex-direction:column; overflow:hidden; position:relative;
}
.panel-hd {
  flex-shrink:0; padding:9px 14px 5px; font-size:12px; font-weight:700;
  color:var(--text-bright); display:flex; align-items:center; gap:7px; letter-spacing:1px;
}
.hd-bar { width:3px; height:13px; border-radius:1.5px; background:var(--accent); box-shadow:0 0 7px rgba(57,217,138,0.30); flex-shrink:0 }
.hd-bar.g { background:var(--accent2); box-shadow:0 0 7px rgba(16,214,160,.4) }
.hd-bar.y { background:var(--accent3); box-shadow:0 0 7px rgba(245,158,11,.4) }
.hd-bar.r { background:var(--accent4); box-shadow:0 0 7px rgba(239,68,68,.4) }
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
.dash-grid { display:flex; gap:8px; margin-bottom:8px; min-height:0 }
.dash-col { display:flex; flex-direction:column; gap:8px; min-height:0; width:24%; flex-shrink:0 }
.dash-center { flex:1; display:flex; flex-direction:column; gap:8px; min-width:0 }
.chart-box { width:100%; min-height:0 }
.mini-row { display:flex; gap:6px; margin-bottom:6px }
.mini-row:last-child { margin-bottom:0 }
.mini-s {
  flex:1; text-align:center; background:rgba(10,36,68,0.55);
  border:1px solid rgba(40,199,111,0.08); border-radius:6px; padding:8px 6px;
}
.ms-v { font-size:16px; font-weight:700; color:var(--accent); font-family:"SF Mono","DIN Alternate","Consolas",monospace }
.ms-l { font-size:9px; color:var(--text-dim); margin-top:1px }
.mini-s.g .ms-v { color:var(--accent2) }
.mini-s.y .ms-v { color:var(--accent3) }
.mini-s.r .ms-v { color:var(--accent4) }

/* ========== MAP ========== */
.map-wrap {
  flex:1; position:relative; border-radius:6px; overflow:hidden;
  background:radial-gradient(ellipse at center,rgba(8,60,120,.25) 0%,transparent 72%);
  border:1px solid rgba(40,199,111,0.08); min-height:300px;
}
.leaflet-map { width:100%; height:100%; position:absolute; top:0; left:0; border-radius:6px }
.map-monitor-link {
  position:absolute; top:10px; right:10px; z-index:999;
  background:rgba(0,0,0,0.7); color:#39D98A; padding:6px 12px;
  border-radius:6px; font-size:11px; text-decoration:none;
  border:1px solid rgba(57,217,138,0.3); backdrop-filter:blur(8px)
}
.map-legend { position:absolute; bottom:10px; left:50%; transform:translateX(-50%); display:flex; gap:16px; pointer-events:none }
.map-lg { display:flex; align-items:center; gap:4px; font-size:9px; color:var(--text-dim) }
.map-lg .dot { width:7px; height:7px; border-radius:50% }

@keyframes livePulse {
  0% { transform:scale(1); opacity:1 }
  100% { transform:scale(2.5); opacity:0 }
}

.marquee-bar {
  flex-shrink:0; height:24px; display:flex; align-items:center;
  background:rgba(8,24,48,0.88); backdrop-filter:blur(12px);
  border:1px solid var(--panel-border); border-radius:6px; padding:0 12px; overflow:hidden;
}
.marquee-text { font-size:10px; color:var(--accent); white-space:nowrap; animation:marquee 28s linear infinite }
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
.alert-list { display:flex; flex-direction:column; gap:6px }
.alert-item {
  display:flex; align-items:flex-start; gap:8px; padding:7px 9px; border-radius:6px;
  background:rgba(10,36,68,0.55); border-left:2px solid var(--accent3); cursor:pointer; transition:.2s;
}
.alert-item:hover { background:rgba(14,165,233,.08) }
.ai-ico { font-size:14px; flex-shrink:0 }
.ai-title { font-size:11px; font-weight:600; color:var(--text-bright) }
.ai-desc { font-size:10px; color:var(--text-dim) }
.ai-time { font-size:9px; color:var(--text-dim); opacity:.5 }

/* ========== AI PANEL ========== */
.ai-row { display:flex; gap:6px; margin-bottom:8px }
.ai-cell { flex:1; text-align:center; background:rgba(57,217,138,0.06); border-radius:6px; padding:6px }
.ai-cell-v { font-size:20px; font-weight:700 }
.ai-cell-l { font-size:9px; color:var(--td) }
.ai-summary {
  background:rgba(57,217,138,0.04); border-radius:6px; padding:8px;
  margin-bottom:5px; font-size:10px; color:var(--td); line-height:1.5;
}
.ai-warning { background:rgba(245,158,11,0.04); border-radius:6px; padding:6px 8px; font-size:10px }

/* ========== IOT ROW ========== */
.iot-row { display:flex; align-items:center; gap:6px; padding:3px 0; cursor:pointer }
.iot-row:hover { background:rgba(14,165,233,.05); border-radius:4px }
.iot-st { margin-left:auto; color:var(--text-dim) }
.iot-st.warn { color:var(--accent3) }
.iot-st.offline { color:var(--accent4) }
.dot { width:7px; height:7px; border-radius:50%; flex-shrink:0 }
.dot.online { background:var(--accent2); box-shadow:0 0 5px var(--accent2) }
.dot.warn { background:var(--accent3); box-shadow:0 0 5px var(--accent3) }
.dot.offline { background:var(--accent4) }

/* ========== BOTTOM ROW ========== */
.bot-row { display:flex; gap:8px; height:70px; flex-shrink:0 }
.bot-card {
  flex:1; background:rgba(8,24,48,0.88); backdrop-filter:blur(12px);
  border:1px solid var(--panel-border); border-radius:8px;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  text-align:center; position:relative; overflow:hidden; cursor:pointer; transition:all .25s;
}
.bot-card:hover { background:rgba(14,165,233,.10); border-color:rgba(14,165,233,.30); transform:translateY(-2px) }
.bot-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(14,165,233,.3),transparent) }
.bv { font-size:20px; font-weight:700; color:var(--accent); font-family:"SF Mono","DIN Alternate","Consolas",monospace }
.bl { font-size:10px; color:var(--text-dim); margin-top:2px }
.bs { font-size:9px; color:var(--text-dim); opacity:.5 }
.bot-card.g .bv { color:var(--accent2) }
.bot-card.y .bv { color:var(--accent3) }
.bot-card.r .bv { color:var(--accent4) }

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
.leader-grid-wrap { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:14px; margin-bottom:14px }
.leader-card-panel { padding:20px; text-align:center; cursor:pointer; transition:all .3s }
.leader-card-panel:hover { border-color:rgba(57,217,138,0.3)!important; box-shadow:0 8px 30px rgba(0,0,0,.3); transform:translateY(-3px) }
.leader-avatar {
  width:80px; height:80px; border-radius:50%; display:flex; align-items:center;
  justify-content:center; margin:0 auto 10px; font-size:30px; font-weight:800; color:#fff;
}
.leader-name { font-size:16px; font-weight:700; color:var(--tb); margin-bottom:3px }
.leader-title { font-size:11px; font-weight:600; margin-bottom:2px }
.leader-org { font-size:10px; color:var(--td); margin-bottom:4px }
.leader-phone { font-size:10px; color:var(--td); margin-bottom:4px }
.leader-qr { font-size:9px; color:var(--accent2); cursor:pointer; margin-bottom:8px }
.leader-qr:hover { text-decoration:underline }
.leader-stats { display:flex; gap:8px; justify-content:center }
.ls-v { font-size:15px; font-weight:700 }
.ls-l { font-size:9px; color:var(--td) }
.ls-div { width:1px; background:rgba(57,217,138,0.12) }

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
}
</style>