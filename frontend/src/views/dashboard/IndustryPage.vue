<template>
<div class="ind-page" :class="{embedded}">
<header class="hdr" v-if="!embedded"><div class="hdr-l"><router-link to="/dashboard">&#9664; 返回驾驶舱</router-link> &#127981; 数字产业中心</div><div class="hdr-r"><router-link to="/">&#127968; 首页</router-link><span>{{clock}}</span></div></header>
<div class="mod-tabs"><button v-for="m in modules" :key="m.key" :class="{on:curMod===m.key}" @click="switchMod(m.key)">{{m.icon}} {{m.label}}</button></div>
<div class="sub-tabs"><button v-for="s in subTabs" :key="s" :class="{on:curSub===s}" @click="switchSub(s)">{{subLabels[s]}}</button></div>
<div class="content" ref="contentRef">
<FoodList v-if="curMod==='tourism'&&curSub==='foods'" @detail="showFoodDetail" />
<h2 class="pg-tt" v-if="curMod!=='ecommerce'">{{subLabels[curSub]}}</h2>

<template v-if="curMod==='ecommerce'"><EcommercePage :embedded="true" :activeTab="curSub"/></template>
<template v-else-if="curMod==='livestock'">
	<EnvMonitor v-if="curSub==='env'" />
	<FeedingMonitor v-else-if="curSub==='feed'" />
	<DiseaseWarning v-else-if="curSub==='disease'" />		<!-- ===== 出栏管理（独立模块） ===== -->
		<template v-else-if="curSub==='slaughter'">
		<div class="tbanner" style="border-left-color:#F2A62B;color:#F2A62B">🐷 出栏管理 · 养殖生命周期出栏与销售<span style="font-size:10px;color:#66788A;font-weight:400;margin-left:8px">📍 中堰村</span></div>

		<!-- 统计卡 -->
		<div class="srow" style="margin-bottom:10px">
		<div class="scard"><div class="sv">{{slaughterStats.totalBatches}}批</div><div class="sl">出栏批次</div></div>
		<div class="scard g"><div class="sv">{{slaughterStats.completedBatches}}批</div><div class="sl">已完成</div></div>
		<div class="scard y"><div class="sv">{{slaughterStats.pendingBatches}}批</div><div class="sl">计划出栏</div></div>
		<div class="scard"><div class="sv">{{slaughterStats.totalCount}}</div><div class="sl">累计出栏</div></div>
		<div class="scard g"><div class="sv">¥{{slaughterStats.totalRevenue}}</div><div class="sl">销售收入</div></div>
		<div class="scard" style="min-width:110px"><div class="sv">{{slaughterStats.avgPrice}}</div><div class="sl">平均售价</div></div>
		</div>

		<!-- 操作栏 -->
		<div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;align-items:center">
		<button class="btn btn-p btn-s" @click="openSlaughterAdd">➕ 新增出栏记录</button>
		<button class="btn btn-o btn-s" @click="exportSlaughter">📤 导出</button>
		<span style="flex:1"></span>
		<select v-model="slaughterFilter" class="fs2"><option value="">全部状态</option><option value="completed">已完成</option><option value="pending">待出栏</option><option value="transporting">运输中</option><option value="planned">计划出栏</option></select>
		</div>

		<!-- 表格 -->
		<div class="panel" style="padding:10px 0 0 0"><div style="overflow-x:auto"><table class="dw-table"><thead><tr>
		<th>养殖批次</th><th>养殖区</th><th>品种</th><th>出栏数量</th><th>均重</th><th>总重</th><th>单价</th><th>销售金额</th><th>买方</th><th>状态</th><th style="width:80px">操作</th>
		</tr></thead><tbody>
		<tr v-for="r in filteredSlaughter" :key="r.id" @click="showSlaughterDetail(r)" style="cursor:pointer">
		<td style="color:#22B573;font-size:10px">{{r.batchNo||'--'}}</td>
		<td style="color:#1F2D3D;font-weight:500">{{r.name}}</td>
		<td>{{r.breed||'--'}}</td>
		<td style="font-weight:600">{{r.count}}{{r.unit||'头'}}</td>
		<td>{{r.avgWeight||r.weight||'--'}}</td>
		<td style="font-family:monospace">{{getSlaughterTotalWeight(r)||'--'}}kg</td>
		<td>{{r.price||'--'}}</td>
		<td style="color:#22B573;font-weight:600;font-family:monospace" v-if="r.status==='completed'">¥{{getSlaughterAmount(r).toLocaleString()||'--'}}</td>
		<td v-else style="color:#66788A">--</td>
		<td>{{r.buyer||'--'}}</td>
		<td><span :class="slaughterStatusTag(r.status)">{{slaughterStatusLabel(r.status)}}</span></td>
		<td style="white-space:nowrap"><button class="btn btn-s btn-o" @click.stop="showSlaughterDetail(r)">查看</button><button class="btn btn-s btn-p" @click.stop="editSlaughter(r.id)">编辑</button><button class="btn btn-s btn-d" @click.stop="delSlaughter(r.id)">删除</button></td>
		</tr></tbody></table></div></div>
		</template>
	<template v-else-if="curSub==='records2'">
		<div class="srow liv-arch"><div v-for="s in stats" :key="s.label" class="scard" :class="s.cls"><div class="sv">{{s.value}}</div><div class="sl">{{s.label}}</div></div></div>
		<div class="panel liv-arch"><div class="toolbar"><button class="btn btn-p btn-s" @click="addItem">➕ {{addBtnLabels[curSub]||'新增'}}</button><button class="btn btn-o btn-s" @click="exportCurrentTable">📤 导出</button><span class="spacer"></span><input v-model="filterText" placeholder="🔍 搜索..." @input="page=1"></div>
		<table><thead><tr><th v-for="c in tableCols" :key="c">{{c}}</th><th style="width:80px">操作</th></tr></thead><tbody><tr v-for="r in pagedData" :key="r.id" @click="showDetail(r)"><td v-for="(c,ci) in tableCols" :key="c" v-html="renderCell(r,ci)"></td><td><button class="btn btn-s btn-p" @click.stop="editItem(r.id)">编辑</button><button class="btn btn-s btn-d" @click.stop="delItem(r.id)">删除</button></td></tr></tbody></table>
		<div class="pg"><span style="color:#66788A">共{{filteredData.length}}条,{{page}}/{{totalPages}}页</span><button v-for="p in totalPages" :key="p" class="pg-btn" :style="{color:p===page?'#22B573':'',fontWeight:p===page?'600':''}" @click="page=p">{{p}}</button></div></div>
	</template>
</template>
<template v-else-if="curSub==='pest'"><PestDashboard :embedded="true" /></template><template v-else-if="curMod==='tourism'&&curSub==='spots'">
<div class="tbanner" style="border-left-color:#22B573;color:#22B573">🏞️ 景点游览 · 发现美丽乡村<span style="font-size:10px;color:#66788A;font-weight:400;margin-left:8px">📍 当前村庄：中堰村</span></div>
<div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center"><span style="position:relative;display:inline-flex;align-items:center"><input v-model="spotFilterText" placeholder="🔍 搜索景点名称、特色..." style="padding:6px 30px 6px 12px;border-radius:8px;border:1px solid #E3EAF0;background:rgba(34,181,115,0.06);color:#475867;font-size:12px;width:240px;font-family:inherit;outline:none"><span v-if="spotFilterText" @click="spotFilterText=''" style="position:absolute;right:6px;cursor:pointer;color:#66788A;font-size:14px;line-height:1" title="清空">×</span></span><div style="display:flex;gap:4px;flex-wrap:wrap"><button v-for="c in spotCategories" :key="c.v" :class="spotFilterCat===c.v?'btn btn-p btn-s':'btn btn-o btn-s'" @click="spotFilterCat=c.v">{{c.l||c.label}}<span v-if="c.v" style="font-size:9px;opacity:.7;margin-left:2px">({{tSpots.filter(s=>s.type===c.v).length}})</span></button></div></div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
<div v-for="s in filteredSpots" :key="s.id" class="spot-card" @click="showSpotDetail(s)">
<div class="spot-cover" :style="{background:s.coverUrl?'url('+s.coverUrl+') center/cover':tourismCover('spot',s.type,s.name)}"><div v-if="spotBadge(s)" class="spot-badge" :class="spotBadge(s).cls">{{spotBadge(s).icon}} {{spotBadge(s).label}}</div><div class="spot-cover-status">{{s.openStatus==='open'?'🟢 开放中':s.openStatus==='paused'?'🔴 暂停开放':'🟡 维护中'}}</div></div>
<div style="padding:12px 14px 14px;display:flex;flex-direction:column;flex:1"><div class="spot-card-name">{{s.name}}</div><div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span class="spot-tag" :style="{color:spotCatColor(s.type),borderColor:spotCatColor(s.type)}">{{s.type}}</span></div><div class="spot-card-rating" v-if="s.rating">⭐ {{s.rating}} <span style="color:#66788A;font-weight:400">· {{(s.visitors||0).toLocaleString()}}次浏览</span></div><div class="spot-card-desc">{{s.summary||(s.desc||'').slice(0,50)}}</div><div style="display:flex;gap:8px;margin:8px 0;font-size:10px;color:#66788A"><span>📍 {{(s.address||'').replace('中堰村','中堰村 · ')}}</span></div><div style="display:flex;gap:6px;margin-top:auto"><button class="btn btn-p btn-s" @click.stop="showSpotDetail(s)">查看详情</button><button class="btn btn-o btn-s" @click.stop="toast('导航到：'+s.address,'info')">🗺️ 导航</button><button class="btn btn-o btn-s" @click.stop="toast('链接已复制','ok')" title="分享景点">📤 分享</button><button class="btn btn-o btn-s" style="font-size:13px;padding:2px 6px" @click.stop="s._fav=!s._fav;toast(s._fav?'已收藏':'已取消收藏','ok')" :title="s._fav?'取消收藏':'添加收藏'">{{s._fav?'❤️':'♡'}}</button></div></div>
</div>
</div>
</template>
<template v-else-if="curMod==='tourism'&&curSub==='bnbs'">
<div class="tbanner" style="border-left-color:#22B573;color:#22B573">🏡 特色民宿 · 发现美丽乡村<span style="font-size:10px;color:#66788A;font-weight:400;margin-left:8px">📍 当前村庄：中堰村</span></div>
<div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center"><span style="position:relative;display:inline-flex;align-items:center"><input v-model="bnbFilterText" placeholder="🔍 搜索民宿..." style="padding:6px 30px 6px 12px;border-radius:8px;border:1px solid #E3EAF0;background:rgba(34,181,115,0.06);color:#475867;font-size:12px;width:240px;font-family:inherit;outline:none"><span v-if="bnbFilterText" @click="bnbFilterText=''" style="position:absolute;right:6px;cursor:pointer;color:#66788A;font-size:14px;line-height:1" title="清空">x</span></span><div style="display:flex;gap:4px;flex-wrap:wrap"><button v-for="c in bnbCats" :key="c.v" :class="bnbCat===c.v?'btn btn-p btn-s':'btn btn-o btn-s'" @click="bnbCat=c.v">{{c.l}}<span v-if="c.v" style="font-size:9px;opacity:.7;margin-left:2px">({{tBnBs.filter(b=>bnbType(b)===c.v).length}})</span></button></div></div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
<div v-for="b in filteredBnbs" :key="b.id" class="spot-card" @click="showBnbDetail(b.id)">
<div class="spot-cover" :style="{background:tourismCover('bnb','',b.name)}"><div class="spot-badge" style="background:rgba(34,181,115,0.88)" v-if="b.rating>=4.8">⭐ 高分</div><div class="spot-cover-status" :style="{background:b.status==='营业中'?'rgba(34,181,115,0.70)':'rgba(242,166,43,0.70)'}">{{b.status||'营业中'}}</div></div>
<div style="padding:12px 14px 14px;display:flex;flex-direction:column;flex:1"><div class="spot-card-name">{{b.name}}</div><div class="spot-tag" style="color:#8B5CF6;border-color:#8B5CF6;margin-bottom:4px;display:inline-block;width:fit-content">{{bnbType(b)}}</div>
<div style="font-size:15px;color:#22B573;font-weight:700;margin:3px 0">¥{{b.price}}<span style="font-size:10px;color:#66788A;font-weight:400"> 起/晚</span></div>
<div class="spot-card-rating">⭐ {{b.rating}} <span style="color:#66788A;font-weight:400">· 可住2-4人</span></div>
<div style="display:flex;gap:4px;flex-wrap:wrap;margin:4px 0"><span v-if="b.tags&&b.tags.includes('采摘')" class="t g" style="font-size:8px">🍳 含早餐</span><span class="t g" style="font-size:8px">🅿 停车</span><span class="t g" style="font-size:8px">📡 WiFi</span></div>
<div class="spot-card-desc">{{(b.desc||'').slice(0,50)}}</div>
<div style="display:flex;gap:8px;margin:8px 0;font-size:10px;color:#66788A"><span>📍 {{b.address||'中堰村'}}</span><span v-if="b._dist" style="color:#22B573">距景区{{b._dist}}</span></div>
<div style="display:flex;gap:4px;margin-top:auto"><button class="btn btn-p btn-s" @click.stop="showBnbDetail(b.id)">查看详情</button><button class="btn btn-o btn-s" @click.stop="toast('导航到：'+(b.address||'中堰村'),'info')">🗺️ 导航</button><button class="btn btn-o btn-s" @click.stop="toast('链接已复制','ok')">📤</button><button class="btn btn-o btn-s" style="font-size:13px;padding:2px 6px" @click.stop="b._fav=!b._fav;toast(b._fav?'已收藏':'已取消','ok')">{{b._fav?'❤️':'♡'}}</button></div></div>
</div>
</div>
</template>
<template v-else-if="curMod==='tourism'&&curSub==='activities'">
<div class="tbanner" style="border-left-color:#22B573;color:#22B573">🎉 活动体验 · 发现乡村精彩<span style="font-size:10px;color:#66788A;font-weight:400;margin-left:8px">📍 当前村庄：中堰村</span></div>
<div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center"><span style="position:relative;display:inline-flex;align-items:center"><input v-model="actFilterText" placeholder="🔍 搜索活动..." style="padding:6px 30px 6px 12px;border-radius:8px;border:1px solid #E3EAF0;background:rgba(34,181,115,0.06);color:#475867;font-size:12px;width:240px;font-family:inherit;outline:none"><span v-if="actFilterText" @click="actFilterText=''" style="position:absolute;right:6px;cursor:pointer;color:#66788A;font-size:14px;line-height:1" title="清空">x</span></span><div style="display:flex;gap:4px;flex-wrap:wrap"><button v-for="c in actCats" :key="c.v" :class="actCat===c.v?'btn btn-p btn-s':'btn btn-o btn-s'" @click="actCat=c.v">{{c.l}}<span v-if="c.v" style="font-size:9px;opacity:.7;margin-left:2px">({{activities.filter(a=>a.type===c.v).length}})</span></button></div></div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
<div v-for="a in filteredActs" :key="a.id" class="spot-card" @click="showActDetail(a)">
<div class="spot-cover" :style="{background:tourismCover('act',a.type,a.name)}"><div class="spot-cover-status" style="background:rgba(34,181,115,0.70)" v-if="a.status==='open'">🟢 报名中</div><div class="spot-cover-status" style="background:rgba(242,166,43,0.70)" v-if="a.status==='upcoming'">🟡 即将开始</div><div class="spot-cover-status" style="background:#66788A" v-if="a.status==='ended'">🔴 已结束</div></div>
<div style="padding:12px 14px 14px;display:flex;flex-direction:column;flex:1"><div class="spot-card-name">{{a.name}}</div><div class="spot-tag" style="color:#F2A62B;border-color:#F2A62B;margin-bottom:4px;display:inline-block;width:fit-content">{{a.type}}</div>
<div style="font-size:11px;color:#475867;margin:3px 0">📅 {{a.startTime}}<span v-if="a.endTime!==a.startTime"> - {{a.endTime}}</span><span v-if="a.duration" style="font-size:10px;color:#66788A;margin-left:6px">{{a.duration}}</span></div>
<div style="display:flex;gap:10px;font-size:10px;color:#66788A;margin:2px 0"><span>💰 {{a.price||'免费'}}</span><span>👥 {{a.currentPeople||0}}/{{a.limitPeople||'不限'}}人<span v-if="a.limitPeople&&a.currentPeople<a.limitPeople" style="color:#22B573;margin-left:3px">剩{{a.limitPeople-a.currentPeople}}席</span></span></div>
<div class="spot-card-desc">{{(a.desc||'').slice(0,50)}}</div>
<div style="display:flex;gap:8px;margin:8px 0;font-size:10px;color:#66788A"><span>📍 {{a.address||'中堰村'}}</span></div>
<div style="display:flex;gap:4px;margin-top:auto"><button class="btn btn-p btn-s" @click.stop="showActDetail(a)">查看详情</button><button class="btn btn-o btn-s" @click.stop="toast('导航到：'+(a.address||'中堰村'),'info')">🗺️ 导航</button><button class="btn btn-o btn-s" @click.stop="toast('链接已复制','ok')">📤</button><button class="btn btn-o btn-s" style="font-size:13px;padding:2px 6px" @click.stop="a._fav=!a._fav;toast(a._fav?'已收藏':'已取消','ok')">{{a._fav?'❤️':'♡'}}</button></div></div>
</div>
</div>
</template>
<template v-else-if="curSub==='lands'">
<div class="land-head"><div class="land-banner">🌍 地块管理 · 中堰村农业地块信息总览</div><button class="btn btn-p btn-s" @click="addItem">➕ 新增地块</button></div>
<div class="srow land-stats"><div v-for="s in landStats" :key="s.label" class="scard" :class="s.cls"><div class="sv">{{s.value}}</div><div class="sl">{{s.label}}</div></div></div>
<div class="land-mid">
	<div class="panel land-map-panel">
		<div class="tt">🗺 地块分布地图</div>
		<svg class="land-map" viewBox="0 0 660 440" preserveAspectRatio="xMidYMid meet">
			<rect x="0" y="0" width="660" height="440" rx="12" fill="#f1f7ec"/>
			<g stroke="#dfe9d6" stroke-width="1"><path d="M0 440 H660"/><path d="M330 0 V440"/><path d="M0 220 H660"/></g>
			<g v-for="s in mapSpots" :key="s.id" class="land-plot" :class="{sel: s.id === activeLand.id}" @click="selectLand(s)">
				<rect :x="s.x" :y="s.y" :width="s.w" :height="s.h" rx="10" :fill="s.color" fill-opacity="0.16" :stroke="s.color" stroke-width="1.5"/>
				<text :x="s.x + s.w / 2" :y="s.y + s.h / 2 - 6" text-anchor="middle" class="lp-name">{{ s.name }}</text>
				<text :x="s.x + s.w / 2" :y="s.y + s.h / 2 + 14" text-anchor="middle" class="lp-meta">{{ s.area }}亩 · {{ s.crop }}</text>
			</g>
			<text x="648" y="28" text-anchor="end" class="lp-n">🧭 北</text>
		</svg>
		<div class="land-legend"><span class="lg-hint">💡 点击地块查看详情</span><div class="lg-items"><span v-for="c in cropDist" :key="c.name" class="lg-item"><i :style="{background:c.color}"></i>{{ c.name }}</span></div></div>
	</div>
	<div class="panel land-struct">
		<div class="tt">📊 农业结构分析</div>
		<div class="land-sub-tt">作物分布</div>
		<div class="crop-bars"><div v-for="c in cropDist" :key="c.name" class="crop-bar-row"><span class="crop-name">{{ c.name }}</span><div class="crop-track"><div class="crop-fill" :style="{width: (c.area / maxCropArea * 100) + '%', background: c.color}"></div></div><span class="crop-area">{{ c.area }}亩</span></div></div>
		<div class="land-sub-tt" style="margin-top:14px">当前状态</div>
		<div class="status-row"><div v-for="s in landStatusDist" :key="s.name" class="status-chip"><span class="status-dot" :style="{background: landStatusColor[s.name] || '#22B573'}"></span><span class="status-name">{{ s.name }}</span><span class="status-count">{{ s.count }}块</span></div></div>
		<div class="land-pick">
			<div class="lp-head"><span class="lp-icon" :style="{background: cropColor(activeLand.crop)}">{{ landIcon(activeLand.crop) }}</span><div class="lp-head-t"><div class="lp-title">{{ activeLand.name }}</div><div class="lp-loc">📍 {{ activeLand.location }}</div></div></div>
			<div class="lp-grid">
				<div class="lp-item"><span class="lp-k">面积</span><span class="lp-v">{{ activeLand.area }}亩</span></div>
				<div class="lp-item"><span class="lp-k">作物</span><span class="lp-v">{{ activeLand.crop }}</span></div>
				<div class="lp-item"><span class="lp-k">负责人</span><span class="lp-v">{{ activeLand.manager || '--' }}</span></div>
				<div class="lp-item"><span class="lp-k">生长阶段</span><span class="lp-v">{{ activeLand.status }}</span></div>
				<div class="lp-item"><span class="lp-k">灌溉状态</span><span class="lp-v">{{ activeLand.irrigation ? '✅ 已覆盖' : '❌ 未覆盖' }}</span></div>
				<div class="lp-item"><span class="lp-k">传感器</span><span class="lp-v">{{ sensorDot(activeLand.sensor) }} {{ activeLand.sensor || '--' }}</span></div>
			</div>
		</div>
	</div>
</div>
<div class="panel">
	<div class="toolbar"><button class="btn btn-p btn-s" @click="addItem">➕ 新增地块</button><button class="btn btn-o btn-s" @click="toast('GIS标注功能','info')">📍 GIS标注</button><button class="btn btn-o btn-s" @click="toast('土壤检测记录','info')">🧪 土壤检测</button><button class="btn btn-o btn-s" @click="exportCurrentTable">📤 导出</button><span class="spacer"></span><input v-model="filterText" placeholder="🔍 搜索地块..." @input="page=1"></div>
	<div class="land-archive">
		<div v-for="l in filteredLands" :key="l.id" class="land-card" @click="selectLand(l)">
			<div class="lc-icon" :style="{background: cropColor(l.crop) + '1f', color: cropColor(l.crop)}">{{ landIcon(l.crop) }}</div>
			<div class="lc-body">
				<div class="lc-row"><span class="lc-name">{{ l.name }}</span><span class="tag" :class="landStatusTag(l.status)">{{ l.status }}</span></div>
				<div class="lc-meta">📍 {{ l.location }} · 土壤 {{ l.soil }}</div>
				<div class="lc-fields"><span>面积 {{ l.area }}亩</span><span>负责人 {{ l.manager || '--' }}</span><span>{{ l.irrigation ? '灌溉 ✓' : '灌溉 ✗' }}</span><span class="lc-sensor" :class="l.sensor === '在线' ? 'on' : l.sensor === '离线' ? 'off' : 'na'">传感器 {{ sensorDot(l.sensor) }} {{ l.sensor || '--' }}</span></div>
			</div>
			<button class="btn btn-s btn-p lc-view" @click.stop="showDetail(l)">查看</button>
		</div>
		<div v-if="!filteredLands.length" class="land-empty">暂无匹配地块</div>
	</div>
</div>
</template><template v-else-if="isDataPage">
<div v-if="curSub==='crops'" class="tbanner" style="border-left-color:#0EA5E9;color:#0EA5E9">🌱 作物档案 · 品种信息与生长周期追溯</div>
<div v-if="curSub==='records'" class="tbanner" style="border-left-color:#F2A62B;color:#F2A62B">📝 农事记录 · 施肥/灌溉/打药/修剪操作日志</div>
<div v-if="curSub==='irrigation'" class="tbanner" style="border-left-color:#22B573;color:#22B573">💧 水肥管理 · 智能灌溉控制与用水监测</div>
<div v-if="curSub!=='pest'" class="srow"><div v-for="s in stats" :key="s.label" class="scard" :class="s.cls"><div class="sv">{{s.value}}</div><div class="sl">{{s.label}}</div></div></div>
<div class="panel" v-if="showChart && curSub!=='pest'"><div class="tt">&#128202; {{chartTitles[curSub]}}</div><div :id="'chart_'+curSub" style="height:200px" ref="chartRef"></div></div>
<div class="panel" v-if="hasSecondary"><div class="tt">{{secondaryTitles[curSub]}}</div>
<div v-if="curSub==='lands'" class="sec-grid"><div v-for="l in lands" :key="l.id" class="sec-card"><div style="font-weight:600;color:#1F2D3D">{{l.name}}</div><div style="color:#66788A;font-size:10px;margin-top:3px">{{l.area}}亩 | {{l.soil}} | {{l.crop}}</div><span :class="'tag '+(l.status==='盛果期'||l.status==='采收中'?'g':l.status==='已收割'?'dim':'b')" style="margin-top:4px;display:inline-block">{{l.status}}</span></div></div>
<div v-if="curSub==='crops'" class="sec-list"><div v-for="c in crops" :key="c.id" class="tl-item"><div :class="'tl-dot'+(c.stage==='采收中'||c.stage==='已收割'?' g':'')"></div><div class="tl-content"><div class="tlt">{{c.name}} — {{c.stage}}</div><div class="tld">品种:{{c.variety}} | 播种:{{c.plantDate}} | 周期:{{c.cycle}}</div><div class="tltm">预计产量:{{c.expYield}} | {{c.fertilizer}}</div></div><span style="font-size:10px;color:#22B573;flex-shrink:0">{{c.area}}亩</span></div></div>
<div v-if="curSub==='records'" class="sec-list"><div v-for="r in records" :key="r.id" class="tl-item"><div :class="'tl-dot'+(r.type==='灌溉'?' g':r.type==='施肥'?'':' y')"></div><div class="tl-content"><div class="tlt">{{r.type}} — {{r.plot}}</div><div class="tld">{{r.detail}} | 操作人:{{r.operator}}</div><div class="tltm">{{r.date}} | {{r.weather}}</div></div><span :class="'tag '+(r.type==='施肥'?'b':r.type==='灌溉'?'g':r.type==='打药'?'r':'y')">{{r.type}}</span></div></div>
<div v-if="curSub==='irrigation'" class="sec-grid"><div v-for="l in lands.filter(x=>x.irrigation)" :key="l.id" class="sec-card"><div style="font-weight:600;color:#1F2D3D">{{l.name}}</div><div style="color:#66788A;font-size:10px;margin-top:3px">{{l.area}}亩 | 滴灌系统 | 最近:2026-06-15</div><span class="tag g" style="margin-top:4px;display:inline-block">灌溉正常</span></div></div>
</div>
<div class="panel" v-if="curSub==='irrigation'"><div class="tt">&#128225; 灌溉监测点切换</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button v-for="pt in irrigationPoints" :key="pt.id" class="btn" :class="irrigationPoint===pt.id?'btn-p':'btn-o'" style="font-size:12px" @click="switchIrrigationPoint(pt.id)">{{pt.icon}} {{pt.name}}</button></div><div style="font-size:10px;color:#66788A;margin-top:8px">&#128205; 位置:{{currentIrrigationPoint.loc}} | 设备:{{currentIrrigationPoint.device}} | 灌溉方式:{{currentIrrigationPoint.method}}</div></div>
<div class="panel" v-if="curSub==='irrigation'"><div class="tt">&#128167; 灌溉控制面板</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px"><div v-for="v in irrigationValves" :key="v.id" class="valve-card" :class="{selected:selectedValve===v.id}" @click="selectValve(v.id)"><div class="valve-info"><div class="valve-icon">{{v.icon}}</div><div><div class="valve-name">{{v.name}}</div><div class="valve-desc">{{v.desc}}</div></div></div><div class="valve-actions"><button class="valve-btn" :class="{on:v.on}" @click.stop="toggleValve(v.id)">{{v.on?'🟢 运行中':'⚫ 已停止'}}</button><div class="valve-runtime">&#9200; {{v.runtime||'--'}}</div></div></div></div></div>


<div class="panel"><div class="toolbar"><button class="btn btn-p btn-s" @click="addItem">&#10133; {{addBtnLabels[curSub]||'新增'}}</button><button v-if="curSub==='lands'" class="btn btn-o btn-s" @click="toast('GIS标注功能','info')">&#128205; GIS标注</button><button v-if="curSub==='lands'" class="btn btn-o btn-s" @click="toast('土壤检测记录','info')">&#129514; 土壤检测</button><button v-if="curSub==='crops'" class="btn btn-o btn-s" @click="toast('扫码溯源','info')">&#128241; 生成溯源码</button><button v-if="curSub==='crops'" class="btn btn-o btn-s" @click="toast('种植计划','info')">&#128203; 种植计划</button><button v-if="curSub==='records'" class="btn btn-o btn-s" @click="toast('农事任务分配已发送','info')">&#128203; 任务分配</button><button v-if="curSub==='records'" class="btn btn-o btn-s" @click="toast('AI农事建议已生成','info')">&#129302; AI建议</button><button v-if="curSub==='irrigation'" class="btn btn-o btn-s" @click="toast('智能灌溉已启动','info')">&#128167; 智能灌溉</button><button v-if="curSub==='irrigation'" class="btn btn-o btn-s" @click="toast('水肥方案已生成','info')">&#129514; 水肥方案</button><button class="btn btn-o btn-s" @click="exportCurrentTable">&#128228; 导出</button><span class="spacer"></span><input v-model="filterText" placeholder="&#128269; 搜索..." @input="page=1"></div>
<table><thead><tr><th v-for="c in tableCols" :key="c">{{c}}</th><th style="width:80px">操作</th></tr></thead><tbody><tr v-for="r in pagedData" :key="r.id" @click="showDetail(r)"><td v-for="(c,ci) in tableCols" :key="c" v-html="renderCell(r,ci)"></td><td><button class="btn btn-s btn-p" @click.stop="editItem(r.id)">编辑</button><button class="btn btn-s btn-d" @click.stop="delItem(r.id)">删除</button></td></tr></tbody></table>
<div class="pg"><span style="color:#66788A">共{{filteredData.length}}条,{{page}}/{{totalPages}}页</span><button v-for="p in totalPages" :key="p" class="pg-btn" :style="{color:p===page?'#22B573':'',fontWeight:p===page?'600':''}" @click="page=p">{{p}}</button></div></div>
</template><template v-else-if="curSub==='monitor'">
<div class="srow"><div class="scard"><div class="sv">{{monitorData.temp}}&#176;C</div><div class="sl">温度</div></div><div class="scard g"><div class="sv">{{monitorData.hum}}%</div><div class="sl">空气湿度</div></div><div class="scard y"><div class="sv">{{monitorData.soil}}%</div><div class="sl">土壤湿度</div></div><div class="scard"><div class="sv">{{monitorData.light}}Lux</div><div class="sl">光照强度</div></div></div>
<div class="panel"><div class="tt">&#128225; 监测点切换</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button v-for="pt in monitorPoints" :key="pt.id" class="btn" :class="monitorPoint===pt.id?'btn-p':'btn-o'" style="font-size:12px" @click="switchMonitorPoint(pt.id)">{{pt.icon}} {{pt.name}}</button></div><div style="font-size:10px;color:#66788A;margin-top:8px">&#128205; 位置:{{currentMonitorPoint.loc}} | 设备:{{currentMonitorPoint.device}} | 坐标:{{currentMonitorPoint.coord}}</div></div>
<div class="panel"><div class="tt">&#128200; 24小时监测趋势 — {{currentMonitorPoint.name}}</div><div id="chart_monitor" style="height:200px" ref="chartRef2"></div></div>
<div class="panel"><div class="tt">&#128225; 最近告警</div><div class="alert-item" style="margin-bottom:4px" v-for="a in currentMonitorPoint.alerts" :key="a">{{a}}</div></div>
</template>
</div>

<div class="drawer-overlay" :class="{on:drawerOpen}" @click="drawerOpen=false"></div>
<div class="drawer" :class="{on:drawerOpen}"><div class="drawer-hd"><h3>{{drawerTitle}}</h3><button class="drawer-close" @click="drawerOpen=false">&#10005;</button></div><div class="drawer-bd">
<template v-if="actDetail&&curSub==='activities'">
<div class="spot-detail-cover" :style="{background:tourismCover('act',actDetail.type,actDetail.name)}"></div>
<div style="text-align:center;padding:14px 0 6px"><div style="font-size:17px;font-weight:700;color:#1F2D3D">{{actDetail.name}}</div><div style="margin-top:4px">{{actStatusLabel(actDetail.status)}}</div><div class="spot-tag" style="margin-top:4px;color:#F2A62B;border-color:#F2A62B;display:inline-block;width:fit-content">{{actDetail.type}}</div></div>
<div class="spot-info-grid"><div class="spot-info-item"><div class="spot-info-icon">📅</div><div><div class="spot-info-sub">活动时间</div><div class="spot-info-label">{{actDetail.startTime}}<span v-if="actDetail.endTime!==actDetail.startTime"> - {{actDetail.endTime}}</span></div></div></div><div class="spot-info-item"><div class="spot-info-icon">📍</div><div><div class="spot-info-sub">活动地点</div><div class="spot-info-label">{{actDetail.address||'中堰村'}}</div></div></div><div class="spot-info-item"><div class="spot-info-icon">👥</div><div><div class="spot-info-sub">活动人数</div><div class="spot-info-label">{{actDetail.currentPeople||0}}/{{actDetail.limitPeople||'不限'}}人</div></div></div><div class="spot-info-item"><div class="spot-info-icon">💰</div><div><div class="spot-info-sub">活动费用</div><div class="spot-info-label" style="color:#22B573">{{actDetail.price||'免费'}}</div></div></div><div class="spot-info-item"><div class="spot-info-icon">⏱</div><div><div class="spot-info-sub">活动时长</div><div class="spot-info-label">{{actDetail.duration||'--'}}</div></div></div></div>
<div class="spot-contact-row"><div style="display:flex;align-items:flex-start;gap:8px"><span style="font-size:16px">📞</span><div><div class="spot-info-sub">联系电话</div><div style="font-size:11px;color:#22B573;cursor:pointer" @click="actDetail._showPhone?null:actDetail._showPhone=true">{{actDetail._showPhone?(actDetail.contact||'--'):'点击查看'}}</div></div></div></div>
<div class="spot-desc-card" v-if="actDetail.desc"><div class="spot-info-sub" style="margin-bottom:6px">活动介绍</div><div style="color:#66788A;font-size:11px;line-height:1.7">{{actDetail.desc}}</div></div>
<div class="spot-desc-card" v-if="actDetail.process"><div class="spot-info-sub" style="margin-bottom:6px">活动流程</div><div style="color:#66788A;font-size:11px;line-height:1.7">{{actDetail.process}}</div></div>
<div class="spot-desc-card" v-if="actDetail.notice"><div class="spot-info-sub" style="margin-bottom:6px">注意事项</div><div style="color:#66788A;font-size:11px;line-height:1.7">{{actDetail.notice}}</div></div>
<div style="display:flex;gap:8px;margin-top:8px"><div class="spot-stat-card"><div style="font-size:16px;color:#22B573">{{actDetail.currentPeople||0}}<span v-if="actDetail.limitPeople" style="font-size:10px;color:#66788A">/{{actDetail.limitPeople}}</span></div><div style="font-size:9px;color:#66788A;margin-top:4px">已报名</div></div><div class="spot-stat-card"><div style="font-size:16px;color:#1F2D3D">{{actDetail.visitors||0}}</div><div style="font-size:9px;color:#66788A;margin-top:4px">浏览人数</div></div></div>
<div class="spot-detail-actions"><button class="btn btn-p" style="padding:6px 16px;font-size:11px" v-if="actDetail.status==='open'" @click="openSignup(actDetail)">📝 立即报名</button><button class="btn btn-o btn-s" @click="toast('导航到：'+(actDetail.address||'中堰村'),'info')">📍 导航</button><button class="btn btn-o btn-s" style="color:#E05252;border-color:rgba(224,82,82,0.30)" @click="actDetail._fav=!actDetail._fav;toast(actDetail._fav?'已收藏':'已取消','ok')">{{actDetail._fav?'❤️':'♡'}} 收藏</button><button class="btn btn-o btn-s" style="color:#66788A" @click="drawerOpen=false">关闭</button></div>
</template><template v-else-if="spotDetailData&&curSub==='spots'">
<div class="spot-detail-cover" :style="{background:tourismCover('spot',spotDetailData.type,spotDetailData.name)}"></div>
<div style="text-align:center;padding:14px 0 6px"><div style="font-size:17px;font-weight:700;color:#1F2D3D">{{spotDetailData.name}}</div><div style="color:#F2A62B;font-size:12px;margin-top:4px">{{starRating(spotDetailData.rating)}} <span style="color:#475867;font-weight:500">{{spotDetailData.rating||'4.5'}}</span></div><div class="spot-tag" style="margin-top:4px;color:#22B573;border-color:#22B573">{{spotDetailData.type}}</div></div>
<div class="spot-info-grid"><div class="spot-info-item"><div class="spot-info-icon">{{spotDetailData.openStatus==='open'?'🟢':spotDetailData.openStatus==='paused'?'🔴':'🟡'}}</div><div><div class="spot-info-sub">开放状态</div><div class="spot-info-label">{{spotDetailData.openStatus==='open'?'开放中':spotDetailData.openStatus==='paused'?'暂停':'维护'}}</div></div></div><div class="spot-info-item"><div class="spot-info-icon">🕗</div><div><div class="spot-info-sub">开放时间</div><div class="spot-info-label">{{spotDetailData.openingTime||'--'}}</div></div></div><div class="spot-info-item"><div class="spot-info-icon">🎫</div><div><div class="spot-info-sub">门票</div><div class="spot-info-label">{{spotDetailData.ticketType||'免费'}}</div></div></div><div class="spot-info-item"><div class="spot-info-icon">⏱</div><div><div class="spot-info-sub">建议游玩</div><div class="spot-info-label">{{spotDetailData.duration||'2小时'}}</div></div></div></div>
<div class="spot-contact-row"><div style="display:flex;align-items:flex-start;gap:8px"><span style="font-size:16px">📍</span><div><div class="spot-info-sub">地址</div><div style="font-size:11px;color:#475867">{{spotDetailData.address||'--'}}</div></div></div><div style="display:flex;align-items:flex-start;gap:8px;cursor:pointer" @click="spotDetailData._showPhone?null:spotDetailData._showPhone=true"><span style="font-size:16px">📞</span><div><div class="spot-info-sub">联系电话</div><div style="font-size:11px" :style="{color:'#22B573'}">{{spotDetailData._showPhone?(spotDetailData.contact||'--'):'点击查看'}}</div></div></div></div>
<div class="spot-desc-card" v-if="spotDetailData.desc"><div class="spot-info-sub" style="margin-bottom:6px">景区简介</div><div style="color:#66788A;font-size:11px;line-height:1.7">{{spotDetailData.desc}}</div></div>
<div v-if="spotDetailData.facilities&&spotDetailData.facilities.length" style="display:flex;gap:12px;flex-wrap:wrap;padding:8px 0"><span v-for="f in spotDetailData.facilities" :key="f" class="spot-fac-icon">{{f==='停车场'?'🅿':f==='卫生间'?'🚻':f==='餐饮'?'🍴':f==='休息区'?'☕':'📡'}} <span style="font-size:9px;color:#66788A">{{f}}</span></span></div>
<div style="display:flex;gap:8px;margin-top:8px"><div class="spot-stat-card"><div style="font-size:16px;color:#F2A62B">{{starRating(spotDetailData.rating)}}</div><div style="font-size:9px;color:#66788A;margin-top:4px">游客评分</div></div><div class="spot-stat-card"><div style="font-size:16px;color:#1F2D3D">{{(spotDetailData.visitors||0).toLocaleString()}}</div><div style="font-size:9px;color:#66788A;margin-top:4px">浏览人数</div></div></div>
<div class="spot-detail-actions"><button class="btn btn-p" style="padding:6px 16px;font-size:11px" @click="toast('导航到：'+spotDetailData.address,'info')">📍 立即导航</button><button class="btn btn-o btn-s" @click="toast('链接已复制','ok')">📤 分享</button><button class="btn btn-o btn-s" style="color:#E05252;border-color:rgba(224,82,82,0.30)" @click="spotDetailData._fav=!spotDetailData._fav;toast(spotDetailData._fav?'已收藏':'已取消','ok')">{{spotDetailData._fav?'❤️':'♡'}} 收藏</button><button class="btn btn-o btn-s" style="color:#66788A" @click="drawerOpen=false">关闭</button></div>
</template>
<template v-else-if="curSub==='records2' && detailLivestock">
<div style="display:grid;grid-template-columns:1fr 2fr;gap:2px 14px;font-size:11px;margin-bottom:10px"><span style="color:#66788A">档案编号</span><span style="color:#22B573;font-weight:600">{{detailLivestock.batchNo}}</span><span style="color:#66788A">批次名称</span><span style="color:#1F2D3D;font-weight:500">{{detailLivestock.batchName}}</span><span style="color:#66788A">养殖类别</span><span style="color:#475867">{{detailLivestock.category}} · {{detailLivestock.type}}（{{detailLivestock.breed}}）</span><span style="color:#66788A">养殖区域</span><span style="color:#475867">{{detailLivestock.area}}</span><span style="color:#66788A">负责人</span><span style="color:#475867">{{detailLivestock.manager}}（{{detailLivestock.phone}}）</span><span style="color:#66788A">生长阶段</span><span style="color:#1F2D3D;font-weight:500">{{detailLivestock.stage}}</span></div>
<div class="ds-title">📊 养殖动态</div>
<div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap"><div class="dyn-card"><div class="dyn-val">{{breedingDynamics.days}}</div><div class="dyn-label">养殖天数</div></div><div class="dyn-card g"><div class="dyn-val">{{breedingDynamics.survivalRate}}</div><div class="dyn-label">存活率</div></div><div class="dyn-card r"><div class="dyn-val">{{breedingDynamics.loss}}</div><div class="dyn-label">损耗数量</div></div><div class="dyn-card y"><div class="dyn-val">{{breedingDynamics.daysToHarvest}}</div><div class="dyn-label">距预计出栏</div></div></div>
<div class="ds-title">🌡️ 环境监测记录 <span style="font-size:10px;color:#66788A;font-weight:400">（共 {{relatedEnvRecords.length}} 条）</span></div>
<div v-if="relatedEnvRecords.length" style="margin-bottom:10px"><div v-for="e in relatedEnvRecords" :key="'env'+e.id" style="display:flex;gap:8px;align-items:center;padding:6px 10px;margin-bottom:4px;background:#F0F3F8;border-radius:6px;font-size:10px"><span style="color:#66788A;flex-shrink:0">{{(e.recordTime||'').slice(5,16)}}</span><span style="color:#22B573;flex-shrink:0">🌡{{e.waterTemp}}℃</span><span style="color:#0EA5E9;flex-shrink:0">pH{{e.ph}}</span><span style="color:#8B5CF6;flex-shrink:0">O₂{{e.oxygen}}</span><span :class="'tag '+(e.status==='正常'?'g':'r')" style="font-size:8px;flex-shrink:0;margin-left:auto">{{e.status}}</span></div></div>
<div v-else style="color:#66788A;font-size:10px;margin-bottom:10px;padding:6px 10px;background:#F0F3F8;border-radius:6px">暂无关联环境监测记录，请前往「环境监测」模块添加</div>
<div class="ds-title">🍽️ 投喂记录 <span style="font-size:10px;color:#66788A;font-weight:400">（共 {{relatedFeedRecords.length}} 条）</span></div>
<div v-if="relatedFeedRecords.length" style="margin-bottom:10px"><div v-for="f in relatedFeedRecords" :key="'feed'+f.id" style="display:flex;gap:8px;align-items:center;padding:6px 10px;margin-bottom:4px;background:#F0F3F8;border-radius:6px;font-size:10px"><span style="color:#66788A;flex-shrink:0">{{f.feedTime}}</span><span style="color:#475867;flex-shrink:0">{{f.feedName}}</span><span style="color:#22B573;flex-shrink:0">{{f.actualAmount||f.amount}}kg</span><span style="color:#66788A;flex-shrink:0">{{f.method}}</span><span :class="'tag '+(f.status==='已完成'?'g':'y')" style="font-size:8px;flex-shrink:0;margin-left:auto">{{f.status}}</span></div></div>
<div v-else style="color:#66788A;font-size:10px;margin-bottom:10px;padding:6px 10px;background:#F0F3F8;border-radius:6px">暂无关联投喂记录，请前往「投喂管理」模块添加</div>
<div class="ds-title" style="display:flex;align-items:center;gap:8px">📝 日常养殖记录 <span style="font-size:10px;color:#66788A;font-weight:400">（共 {{breedingRecords.length}} 条）</span><button v-if="!brFormOpen" class="btn btn-p" style="font-size:10px;padding:2px 10px;margin-left:auto" @click="openBrAddForm()">+ 新增记录</button></div>
<div v-if="brFormOpen" class="br-form-box"><div style="font-size:12px;font-weight:600;color:#22B573;margin-bottom:8px">{{ brFormMode==='add' ? '新增养殖记录' : '编辑养殖记录' }}</div><div class="frow2" style="margin-bottom:8px"><div class="fld"><label>记录类型</label><select v-model="brForm.type" class="fin2"><option v-for="t in brRecordTypes" :key="t" :value="t">{{t}}</option></select></div><div class="fld"><label>记录时间</label><input v-model="brForm.recordTime" class="fin2" placeholder="2026-08-05 07:30"></div></div><div class="frow2" style="margin-bottom:8px"><div class="fld"><label>记录人</label><input v-model="brForm.recorder" class="fin2" :placeholder="detailLivestock.manager||'管理员'"></div><div class="fld"></div></div><div class="fld" style="margin-bottom:8px"><label>详细内容</label><textarea v-model="brForm.content" class="fin2" style="height:60px" placeholder="请输入记录详情..."></textarea></div><div style="display:flex;gap:6px"><button class="btn btn-p btn-s" @click="submitBrForm">保存</button><button class="btn btn-o btn-s" @click="brFormOpen=false">取消</button></div></div>
<div v-if="breedingRecords.length" style="margin-bottom:10px"><div v-for="br in breedingRecords" :key="'br'+br.id" class="br-item" :style="{borderLeftColor:brTypeColor[br.type]||'#22B573'}"><div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span style="font-size:14px">{{brTypeIcon[br.type]||'📋'}}</span><span :style="{color:brTypeColor[br.type]||'#22B573',fontWeight:600,fontSize:12}">{{br.type}}</span><span style="font-size:9px;color:#66788A;margin-left:auto">{{br.recordTime}}</span></div><div style="color:#475867;font-size:11px;line-height:1.5;margin-bottom:4px">{{br.content}}</div><div style="display:flex;align-items:center;gap:12px;font-size:9px;color:#66788A"><span>👤 {{br.recorder}}</span><span style="margin-left:auto;display:flex;gap:4px"><button class="btn btn-o" style="font-size:9px;padding:1px 8px" @click="openBrEditForm(br)">编辑</button><button class="btn btn-d" style="font-size:9px;padding:1px 8px" @click="deleteBrRecord(br.id)">删除</button></span></div></div></div>
<div v-else style="color:#66788A;font-size:10px;padding:8px 10px;background:#F0F3F8;border-radius:6px;text-align:center">暂无日常养殖记录，点击上方按钮添加</div>
<div style="display:flex;gap:6px;margin-top:14px;border-top:1px solid #E3EAF0;padding-top:12px"><button class="btn btn-p btn-s" @click="editItem(detailLivestock.id);drawerOpen=false">✏️ 编辑档案</button><button class="btn btn-o btn-s" @click="drawerOpen=false">关闭</button></div>
</template>
<template v-else-if="drawerData"><div style="display:grid;grid-template-columns:1fr 2fr;gap:4px 16px;font-size:12px;margin-bottom:14px"><template v-for="(v,k) in drawerData" :key="k"><span v-if="k!=='id'&&k!=='rooms2'&&k!=='reviews'&&k!=='trend'&&k!=='sources'&&k!=='_hover'" style="color:#66788A">{{k}}</span><span v-if="k!=='id'&&k!=='rooms2'&&k!=='reviews'&&k!=='trend'&&k!=='sources'&&k!=='_hover'" style="color:#1F2D3D;font-weight:500">{{v||'--'}}</span></template></div><div style="display:flex;gap:6px;margin-top:12px"><button v-if="curSub!=='bnbs'&&curSub!=='spots'" class="btn btn-p btn-s" @click="editItem(drawerData.id);drawerOpen=false">编辑</button><button v-if="curSub!=='bnbs'&&curSub!=='spots'&&curSub!=='records2'" class="btn btn-d btn-s" @click="delItem(drawerData.id);drawerOpen=false">删除</button><button class="btn btn-o btn-s" @click="drawerOpen=false">关闭</button></div></template></div></div>

<div class="drawer-overlay" :class="{on:formOpen}" @click="formOpen=false"></div>
<div class="drawer" :class="{on:formOpen}"><div class="drawer-hd"><h3>{{formTitle}}</h3><button class="drawer-close" @click="formOpen=false">&#10005;</button></div><div class="drawer-bd">
<div v-if="curSub==='lands'||curSub==='irrigation'"><div class="fld"><label>地块名称</label><input v-model="form.name" class="fin2"></div><div class="frow2"><div class="fld"><label>面积(亩)</label><input v-model="form.area" type="number" class="fin2"></div><div class="fld"><label>土壤类型</label><input v-model="form.soil" class="fin2"></div></div><div class="frow2"><div class="fld"><label>位置</label><input v-model="form.location" class="fin2"></div><div class="fld"><label>种植作物</label><input v-model="form.crop" class="fin2"></div></div><div class="frow2"><div class="fld"><label>状态</label><select v-model="form.status" class="fin2"><option>生长期</option><option>盛果期</option><option>采收中</option><option>已收割</option></select></div><div class="fld"><label>灌溉</label><select v-model="form.irrigation" class="fin2"><option value="是">是</option><option value="否">否</option></select></div></div><div class="frow2"><div class="fld"><label>负责人</label><input v-model="form.manager" class="fin2" placeholder="如：赵大哥"></div><div class="fld"><label>传感器状态</label><select v-model="form.sensor" class="fin2"><option>在线</option><option>离线</option><option>未安装</option></select></div></div></div>
<div v-if="curSub==='crops'"><div class="fld"><label>作物名称</label><input v-model="form.name" class="fin2"></div><div class="frow2"><div class="fld"><label>品种</label><input v-model="form.variety" class="fin2"></div><div class="fld"><label>面积(亩)</label><input v-model="form.area" type="number" class="fin2"></div></div><div class="frow2"><div class="fld"><label>播种日期</label><input v-model="form.plantDate" class="fin2"></div><div class="fld"><label>周期</label><input v-model="form.cycle" class="fin2"></div></div><div class="frow2"><div class="fld"><label>生长阶段</label><select v-model="form.stage" class="fin2"><option>播种期</option><option>生长期</option><option>开花期</option><option>果实膨大期</option><option>着色期</option><option>采收中</option></select></div><div class="fld"><label>施肥方案</label><input v-model="form.fertilizer" class="fin2"></div></div></div>
<div v-if="curSub==='env'"><div class="frow2"><div class="fld"><label>档案编号</label><select v-model="form.archiveId" class="fin2"><option v-for="l in livestock" :key="l.id" :value="l.id">{{l.batchNo}} - {{l.batchName}}</option></select></div><div class="fld"><label>养殖区域</label><input :value="livestock.find(l=>l.id===form.archiveId)?.area||'--'" class="fin2" disabled style="color:#66788A"></div></div><div class="frow2"><div class="fld"><label>记录时间</label><input v-model="form.recordTime" class="fin2" placeholder="2026-08-04 15:20"></div><div class="fld"><label>数据来源</label><select v-model="form.source" class="fin2"><option>传感器自动采集</option><option>农户手工记录</option><option>管理员补录</option></select></div></div><div class="frow2"><div class="fld"><label>水温 (℃)</label><input v-model="form.waterTemp" type="number" class="fin2" placeholder="26.5" step="0.1"></div><div class="fld"><label>pH</label><input v-model="form.ph" type="number" class="fin2" placeholder="7.4" step="0.1"></div></div><div class="frow2"><div class="fld"><label>溶解氧 (mg/L)</label><input v-model="form.oxygen" type="number" class="fin2" placeholder="6.2" step="0.1"></div><div class="fld"><label>氨氮 (mg/L)</label><input v-model="form.ammonia" type="number" class="fin2" placeholder="0.18" step="0.01"></div></div><div class="frow2"><div class="fld"><label>浊度 (NTU)</label><input v-model="form.turbidity" type="number" class="fin2" placeholder="5.2" step="0.1"></div><div class="fld"><label>水位 (%)</label><input v-model="form.waterLevel" type="number" class="fin2" placeholder="95"></div></div><div class="fld"><label>备注</label><textarea v-model="form.remark" class="fin2" style="height:60px" placeholder="备注信息..."></textarea></div></div>
<div v-if="curSub==='records'"><div class="frow2"><div class="fld"><label>类型</label><select v-model="form.type" class="fin2"><option>施肥</option><option>灌溉</option><option>打药</option><option>修剪</option></select></div><div class="fld"><label>作物</label><input v-model="form.crop" class="fin2"></div></div><div class="frow2"><div class="fld"><label>地块</label><input v-model="form.plot" class="fin2"></div><div class="fld"><label>操作人</label><input v-model="form.operator" class="fin2"></div></div><div class="fld"><label>详情</label><textarea v-model="form.detail" class="fin2" style="height:60px"></textarea></div><div class="frow2"><div class="fld"><label>日期</label><input v-model="form.date" class="fin2"></div><div class="fld"><label>天气</label><select v-model="form.weather" class="fin2"><option>晴</option><option>多云</option><option>阴</option><option>雨</option></select></div></div></div>
<div v-if="curSub==='records2'"><div class="ds-title">📋 基本信息</div><div class="fld"><label>批次名称</label><input v-model="form.batchName" class="fin2" placeholder="2026年春季加州鲈批次"></div><div class="frow2"><div class="fld"><label>负责人</label><input v-model="form.manager" class="fin2"></div><div class="fld"><label>联系电话</label><input v-model="form.phone" class="fin2"></div></div><div class="ds-title">🐟 养殖信息</div><div class="frow2"><div class="fld"><label>养殖类别</label><select v-model="form.category" class="fin2"><option>水产</option><option>家禽</option><option>家畜</option></select></div><div class="fld"><label>品种</label><input v-model="form.type" class="fin2" placeholder="鲈鱼"></div></div><div class="frow2"><div class="fld"><label>品系</label><input v-model="form.breed" class="fin2" placeholder="加州鲈"></div><div class="fld"><label>养殖区域</label><input v-model="form.area" class="fin2" placeholder="荷虾混养区A塘"></div></div><div class="frow2"><div class="fld"><label>入栏日期</label><input v-model="form.startDate" class="fin2" placeholder="2026-03-15"></div><div class="fld"><label>预计出栏</label><input v-model="form.expectDate" class="fin2" placeholder="2026-09-15"></div></div><div class="ds-title">📊 数量信息</div><div class="frow2"><div class="fld"><label>初始数量 ({{form.unit||'尾'}})</label><input v-model="form.initialCount" type="number" class="fin2" placeholder="5500"></div><div class="fld"><label>当前存栏 ({{form.unit||'尾'}})</label><input v-model="form.count" type="number" class="fin2" placeholder="5000"></div></div><div class="frow2"><div class="fld"><label>单位</label><select v-model="form.unit" class="fin2"><option>尾</option><option>只</option><option>头</option><option>羽</option></select></div><div class="fld"></div></div><div class="ds-title">📈 养殖状态</div><div class="frow2"><div class="fld"><label>生长阶段</label><select v-model="form.stage" class="fin2"><option>幼苗期</option><option>成长期</option><option>育成期</option><option>育肥期</option><option>待出栏</option></select></div><div class="fld"><label>健康状态</label><select v-model="form.health" class="fin2"><option>正常</option><option>观察中</option><option>异常</option></select></div></div><div class="frow2"><div class="fld"><label>苗种来源</label><input v-model="form.source" class="fin2" placeholder="自繁/外购"></div><div class="fld"></div></div><div class="fld"><label>备注</label><textarea v-model="form.remark" class="fin2" style="height:80px" placeholder="备注信息..."></textarea></div></div>
<div v-if="curSub==='slaughter'"><div class="fld"><label>养殖区</label><input v-model="form.name" class="fin2" placeholder="养猪场A区"></div><div class="frow2"><div class="fld"><label>品种</label><input v-model="form.breed" class="fin2" placeholder="杜长大三元"></div><div class="fld"><label>数量</label><input v-model="form.count" type="number" class="fin2" placeholder="48"></div></div><div class="frow2"><div class="fld"><label>出栏日期</label><input v-model="form.date" class="fin2" placeholder="2026-07-05"></div><div class="fld"><label>均重</label><input v-model="form.weight" class="fin2" placeholder="110kg/头"></div></div><div class="frow2"><div class="fld"><label>单价</label><input v-model="form.price" class="fin2" placeholder="15元/kg"></div><div class="fld"><label>状态</label><select v-model="form.status" class="fin2"><option>已出栏</option><option>待出栏</option><option>育肥中</option></select></div></div></div>
	<div v-if="curSub==='spots'"><div class="fld"><label>景区名称</label><input v-model="form.name" class="fin2"></div><div class="frow2"><div class="fld"><label>类型</label><select v-model="form.type" class="fin2"><option>农业观光</option><option>采摘体验</option><option>研学教育</option><option>生态休闲</option><option>文化活动</option></select></div><div class="fld"><label>所属村庄</label><input v-model="form.villageName" class="fin2" placeholder="中堰村"></div></div><div class="frow2"><div class="fld"><label>位置</label><input v-model="form.address" class="fin2"></div><div class="fld"><label>负责人</label><input v-model="form.manager" class="fin2"></div></div><div class="frow2"><div class="fld"><label>联系方式</label><input v-model="form.contact" class="fin2"></div><div class="fld"><label>预约方式</label><select v-model="form.bookingType" class="fin2"><option>无需预约</option><option>电话预约</option><option>线上预约</option></select></div></div><div class="frow2"><div class="fld"><label>开放时间</label><input v-model="form.openingTime" class="fin2" placeholder="08:00-18:00"></div><div class="fld"><label>开放状态</label><select v-model="form.openStatus" class="fin2"><option value="open">开放</option><option value="paused">暂停</option><option value="closed">关闭</option></select></div></div><div class="fld"><label>介绍</label><textarea v-model="form.desc" class="fin2" style="height:60px" placeholder="景区介绍..."></textarea></div></div>
<div style="display:flex;gap:8px;margin-top:16px"><button class="btn btn-p" @click="submitForm">保存</button><button class="btn btn-o" @click="formOpen=false">取消</button></div></div></div>
<div style="position:fixed;top:16px;right:16px;z-index:999;display:flex;flex-direction:column;gap:6px;pointer-events:none"><div v-for="t in toasts" :key="t.id" :class="'toast '+t.type">{{t.msg}}</div></div>

<!-- ===== 出栏详情抽屉 ===== -->
<div class="drawer-overlay" :class="{on:slaughterDetailOpen}" @click="slaughterDetailOpen=false"></div>
<div class="drawer" :class="{on:slaughterDetailOpen}">
<div class="drawer-hd"><h3>🐷 出栏详情 — {{slaughterDetail?.name}}</h3><button class="drawer-close" @click="slaughterDetailOpen=false">✕</button></div>
<div class="drawer-bd" v-if="slaughterDetail">
<div style="text-align:center;padding:8px 0 12px"><span :class="slaughterStatusTag(slaughterDetail.status)" style="font-size:12px;padding:5px 16px">{{slaughterStatusLabel(slaughterDetail.status)}}</span></div>

<div class="ds-title">📋 关联档案</div>
<div class="dg3"><span class="dl3">养殖批次</span><div style="color:#22B573;font-weight:600">{{slaughterDetail.batchNo||'--'}}</div></div>
<div class="dg3"><span class="dl3">养殖区域</span><div>{{slaughterDetail.name||'--'}}</div></div>
<div class="dg3"><span class="dl3">品种</span><div>{{slaughterDetail.breed||'--'}}</div></div>

<div class="ds-title">📊 出栏信息</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:6px">
<div class="dg3"><span class="dl3">出栏数量</span><div style="font-weight:600;color:#1F2D3D">{{slaughterDetail.count}}{{slaughterDetail.unit||'头'}}</div></div>
<div class="dg3"><span class="dl3">出栏日期</span><div>{{slaughterDetail.date||'--'}}</div></div>
<div class="dg3"><span class="dl3">均重</span><div>{{slaughterDetail.avgWeight||slaughterDetail.weight||'--'}}</div></div>
<div class="dg3"><span class="dl3">总重量</span><div style="font-family:monospace">{{getSlaughterTotalWeight(slaughterDetail)||'--'}}kg</div></div>
</div>

<div class="ds-title" v-if="slaughterDetail.status==='completed'">💰 交易信息</div>
<div v-if="slaughterDetail.status==='completed'" style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:6px">
<div class="dg3"><span class="dl3">单价</span><div>{{slaughterDetail.price||'--'}}</div></div>
<div class="dg3"><span class="dl3">销售金额</span><div style="color:#22B573;font-weight:700;font-size:16px">¥{{getSlaughterAmount(slaughterDetail).toLocaleString()||'--'}}</div></div>
<div class="dg3"><span class="dl3">采购方</span><div>{{slaughterDetail.buyer||'--'}}</div></div>
<div class="dg3"><span class="dl3">联系电话</span><div>{{slaughterDetail.buyerPhone||'--'}}</div></div>
</div>

<div v-if="slaughterDetail.transport||slaughterDetail.plateNo||slaughterDetail.quarantineNo" class="ds-title">🚛 运输与检疫</div>
<div v-if="slaughterDetail.transport||slaughterDetail.plateNo||slaughterDetail.quarantineNo" style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:6px">
<div v-if="slaughterDetail.transport" class="dg3"><span class="dl3">运输方式</span><div>{{slaughterDetail.transport}}</div></div>
<div v-if="slaughterDetail.plateNo" class="dg3"><span class="dl3">运输车牌</span><div>{{slaughterDetail.plateNo}}</div></div>
<div v-if="slaughterDetail.quarantineNo" class="dg3"><span class="dl3">检疫证明编号</span><div style="color:#22B573">{{slaughterDetail.quarantineNo}}</div></div>
</div>

<div v-if="slaughterDetail.status==='completed'" class="ds-title">📈 成本收益</div>
<div v-if="slaughterDetail.status==='completed'" style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:6px">
<div class="dg3"><span class="dl3">销售收入</span><div style="color:#22B573;font-weight:600">¥{{slaughterDetail.amount||'--'}}</div></div>
<div class="dg3"><span class="dl3">预估利润</span><div style="color:#22B573;font-weight:600">¥{{Math.round((slaughterDetail.amount||0)*0.35)}}</div></div>
</div>

<div v-if="slaughterDetail.remark" class="dg3"><span class="dl3">备注</span><div>{{slaughterDetail.remark}}</div></div>

<div style="display:flex;gap:8px;margin-top:14px">
<button class="btn btn-p btn-s" @click="editSlaughter(slaughterDetail.id);slaughterDetailOpen=false">✏️ 编辑</button>
<button class="btn btn-d btn-s" @click="delSlaughter(slaughterDetail.id);slaughterDetailOpen=false">🗑 删除</button>
<button class="btn btn-o btn-s" @click="slaughterDetailOpen=false">关闭</button>
</div>
</div>
</div>


<!-- ===== 出栏表单抽屉 ===== -->
<div class="drawer-overlay" :class="{on:slaughterFormOpen}" @click="slaughterFormOpen=false"></div>
<div class="drawer" :class="{on:slaughterFormOpen}">
<div class="drawer-hd"><h3>{{slaughterFormMode==='add'?'📝 新增出栏记录':'✏️ 编辑出栏记录'}}</h3><button class="drawer-close" @click="slaughterFormOpen=false">✕</button></div>
<div class="drawer-bd">
<div class="ds-title">📋 关联养殖档案</div>
<div class="fld"><label>养殖批次 *</label><select v-model="slaughterForm.archiveId" class="fin2" @change="onSlaughterArchiveChange"><option value="">请选择养殖批次</option><option v-for="l in livestock" :key="l.id" :value="l.id">{{l.batchNo}} — {{l.batchName}} ({{l.area}})</option></select></div>
<div v-if="slaughterLinkedArchive" style="display:grid;grid-template-columns:1fr 1fr;gap:0 8px">
<div class="fld"><label>养殖区（自动）</label><input :value="slaughterLinkedArchive.area" class="fin2" disabled style="color:#66788A"></div>
<div class="fld"><label>品种（自动）</label><input :value="slaughterLinkedArchive.type+' · '+slaughterLinkedArchive.breed" class="fin2" disabled style="color:#66788A"></div>
</div>
<div v-if="slaughterLinkedArchive" style="padding:8px 10px;background:#FFFFFF;border-radius:6px;margin-bottom:10px;font-size:10px">
<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 8px">
<span style="color:#66788A">当前存栏</span><span style="color:#22B573;font-weight:600">{{slaughterLinkedArchive.count}} {{slaughterLinkedArchive.unit||'头'}}</span>
<span style="color:#66788A">养殖天数</span><span style="color:#1F2D3D">{{slaughterLinkedArchive._days||'--'}}天</span>
<span style="color:#66788A">建议出栏日期</span><span style="color:#F2A62B">{{slaughterLinkedArchive.expectDate||'--'}}</span>
</div>
</div>

<div class="ds-title">📊 出栏信息</div>
<div class="frow2"><div class="fld"><label>出栏数量 *</label><input v-model.number="slaughterForm.count" type="number" class="fin2" placeholder="48" @input="calcSlaughterTotal"><span v-if="slaughterStockWarning" style="font-size:9px;color:#E05252">⚠ 超过当前存栏数量</span><span v-else-if="slaughterLinkedArchive&&slaughterForm.count" style="font-size:9px;color:#22B573">出栏后剩余 {{(slaughterLinkedArchive.count||0)-slaughterForm.count}} {{slaughterForm.unit||'头'}}</span></div><div class="fld"><label>单位</label><select v-model="slaughterForm.unit" class="fin2" :disabled="!!slaughterLinkedArchive" :style="{color:slaughterLinkedArchive?'#66788A':''}"><option>头</option><option>只</option><option>尾</option><option>羽</option></select></div></div>
<div class="frow2"><div class="fld"><label>出栏日期</label><input v-model="slaughterForm.date" class="fin2" placeholder="2026-07-05"></div><div class="fld"><label>均重</label><div style="display:flex;align-items:center;gap:0"><input v-model="slaughterForm.avgWeight" type="number" class="fin2" placeholder="110" style="flex:1;border-radius:8px 0 0 8px" @input="calcSlaughterTotal"><span style="padding:8px 10px;background:#FFFFFF;border:1px solid #E3EAF0;border-left:none;border-radius:0 8px 8px 0;color:#66788A;font-size:11px;white-space:nowrap">kg/{{slaughterForm.unit||'头'}}</span></div></div></div>
<div class="frow2"><div class="fld"><label>总重量 (自动)</label><input :value="slaughterForm.totalWeight||'--'" class="fin2" disabled style="color:#66788A"></div><div class="fld"><label>状态</label><select v-model="slaughterForm.status" class="fin2"><option value="planned" v-if="slaughterFormMode==='edit'||slaughterForm.status==='planned'">计划出栏</option><option value="pending" v-if="slaughterFormMode==='edit'||slaughterForm.status==='pending'">待出栏</option><option value="transporting" v-if="slaughterFormMode==='edit'">运输中</option><option value="completed" v-if="slaughterFormMode==='edit'">已完成</option></select></div></div>

<div class="ds-title">💰 交易信息</div>
<div class="frow2"><div class="fld"><label>单价</label><div style="display:flex;align-items:center;gap:0"><input v-model="slaughterForm.price" type="number" class="fin2" placeholder="15" style="flex:1;border-radius:8px 0 0 8px" @input="calcSlaughterAmount"><span style="padding:8px 10px;background:#FFFFFF;border:1px solid #E3EAF0;border-left:none;border-radius:0 8px 8px 0;color:#66788A;font-size:11px;white-space:nowrap">元/kg</span></div></div><div class="fld"><label>销售金额 (自动)</label><input :value="slaughterForm.amount||'--'" class="fin2" disabled style="color:#66788A"></div></div>
<div class="frow2"><div class="fld"><label>采购方</label><input v-model="slaughterForm.buyer" class="fin2" placeholder="XX食品公司"></div><div class="fld"><label>联系电话</label><input v-model="slaughterForm.buyerPhone" class="fin2" placeholder="138****5678"></div></div>

<div class="ds-title">🚛 运输与检疫</div>
<div class="frow2"><div class="fld"><label>运输方式</label><input v-model="slaughterForm.transport" class="fin2" placeholder="冷链运输"></div><div class="fld"><label>运输车牌</label><input v-model="slaughterForm.plateNo" class="fin2" placeholder="川A·XXXXX"></div></div>
<div class="fld"><label>检疫证明编号</label><input v-model="slaughterForm.quarantineNo" class="fin2" placeholder="JY20260705001"></div>
<div class="fld"><label>备注</label><textarea v-model="slaughterForm.remark" class="fin2" style="height:60px" placeholder="备注信息..."></textarea></div>

<div style="display:flex;gap:8px;margin-top:14px"><button class="btn btn-p" style="flex:1" @click="submitSlaughterForm">保存</button><button class="btn btn-o" style="flex:1" @click="slaughterFormOpen=false">取消</button></div>
</div>
</div>

<div class="drawer-overlay" :class="{on:signupOpen}" @click="signupOpen=false"></div><div class="drawer" :class="{on:signupOpen}"><div class="drawer-hd"><h3>📝 活动报名</h3><button class="drawer-close" @click="signupOpen=false">x</button></div><div class="drawer-bd"><template v-if="!signupSuccess"><div class="ds-title">📋 活动信息</div><div class="dg3"><span class="dl3">活动名称</span><div>{{actDetail?actDetail.name:""}}</div></div><div class="dg3"><span class="dl3">活动时间</span><div>{{actDetail?actDetail.startTime:""}}</div><div style="font-size:10px;color:#66788A;margin-bottom:8px">📱 报名成功后工作人员将通过电话与您联系</div></div><div class="ds-title">👤 报名信息</div><div class="fl"><label>联系人 *</label><input v-model="signupForm.name" class="fin" placeholder="请输入姓名"></div><div class="fl"><label>联系电话 *</label><input v-model="signupForm.phone" class="fin" placeholder="请输入手机号"></div><div class="fl"><label>参与人数</label><div style="display:flex;align-items:center;gap:8px"><button class="bo bps" @click="signupForm.count=Math.max(1,signupForm.count-1)">-</button><span style="font-size:14px;font-weight:600;color:#1F2D3D;min-width:40px;text-align:center">{{signupForm.count}}人</span><button class="bo bps" @click="signupForm.count=Math.min(99,signupForm.count+1)">+</button></div></div><div class="fl"><label>备注<span style="font-size:9px;color:#66788A;margin-left:6px">可选</span></label><textarea v-model="signupForm.remark" class="fin" rows="2" placeholder="儿童同行、老人同行、过敏食物、停车需求等" style="resize:vertical"></textarea></div><label class="fl2" style="margin:8px 0"><input type="checkbox" v-model="signupForm.agree"> 我已阅读活动须知</label><div class="ma"><button class="bp" @click="submitSignup">提交报名</button><button class="bo" @click="signupOpen=false">取消</button></div></template><template v-else><div style="text-align:center;padding:20px 0"><div style="font-size:56px;margin-bottom:12px">🎉</div><div style="font-size:17px;font-weight:700;color:#1F2D3D;margin-bottom:4px">报名成功</div><div style="font-size:12px;color:#66788A;margin-bottom:16px">工作人员将尽快与您联系</div><div class="dg3"><span class="dl3">活动</span><div>{{actDetail?actDetail.name:""}}</div></div><div class="dg3"><span class="dl3">联系人</span><div>{{signupForm.name}}</div></div><div class="dg3"><span class="dl3">联系电话</span><div>{{signupForm.phone}}</div></div><div class="dg3"><span class="dl3">报名人数</span><div style="font-weight:600">{{signupForm.count}}人</div></div><div class="dg3" v-if="signupForm.remark"><span class="dl3">备注</span><div>{{signupForm.remark}}</div></div><div class="ma" style="justify-content:center"><button class="bp" style="padding:8px 32px" @click="signupOpen=false">完成</button></div></div></template></div></div>
</div>
<div class="drawer-overlay" :class="{on:regListView}" @click="regListView=false"></div><div class="drawer" :class="{on:regListView}"><div class="drawer-hd"><h3>📋 报名管理（共{{registrations.length}}条）</h3><button class="drawer-close" @click="regListView=false">✕</button></div><div class="drawer-bd"><table class="tb"><thead><tr><th>报名编号</th><th>活动名称</th><th>联系人</th><th>人数</th><th>状态</th><th>时间</th><th>操作</th></tr></thead><tbody><tr v-for="r in registrations" :key="r.id"><td style="color:#22B573;font-size:10px">{{r.no}}</td><td>{{r.activityName}}</td><td>{{r.name}}<div class="pd">{{r.phone}}</div></td><td>{{r.count}}人</td><td><span :class="'t '+regStatusCls(r.status)" style="font-size:8px">{{r.statusLabel}}</span></td><td style="font-size:9px;color:#66788A">{{r.createdAt}}</td><td style="white-space:nowrap"><button class="btn btn-p btn-s" @click="showRegDetail(r)">查看</button><button v-if="r.status==='pending'" class="btn btn-p btn-s" @click="confirmReg(r)">确认</button><button v-if="r.status==='pending'||r.status==='confirmed'" class="btn btn-d btn-s" @click="cancelReg(r)">取消</button><button v-if="r.status==='confirmed'" class="btn btn-o btn-s" @click="completeReg(r)">完成</button></td></tr></tbody></table></div></div><div class="drawer-overlay" :class="{on:regDetailOpen}" @click="regDetailOpen=false"></div><div class="drawer" :class="{on:regDetailOpen}"><div class="drawer-hd"><h3>报名详情 · {{regDetail?regDetail.no:''}}</h3><button class="drawer-close" @click="regDetailOpen=false">✕</button></div><div class="drawer-bd"><template v-if="regDetail"><div class="ds-title">📋 活动信息</div><div class="dg3"><span class="dl3">活动名称</span><div>{{regDetail.activityName}}</div></div><div class="ds-title">👤 报名信息</div><div class="dg3"><span class="dl3">联系人</span><div>{{regDetail.name}}</div></div><div class="dg3"><span class="dl3">联系电话</span><div>{{regDetail.phone}}</div></div><div class="dg3"><span class="dl3">参与人数</span><div style="font-weight:600">{{regDetail.count}}人</div></div><div class="dg3" v-if="regDetail.remark"><span class="dl3">备注</span><div>{{regDetail.remark}}</div></div><div class="dg3"><span class="dl3">报名时间</span><div>{{regDetail.createdAt}}</div></div><div class="ds-title">📊 处理信息</div><div class="dg3"><span class="dl3">当前状态</span><div><span :class="'t '+regStatusCls(regDetail.status)">{{regDetail.statusLabel}}</span></div></div><div class="dg3" v-if="regDetail.handledAt"><span class="dl3">处理时间</span><div>{{regDetail.handledAt}}</div></div><div class="dg3" v-if="regDetail.adminRemark"><span class="dl3">管理备注</span><div>{{regDetail.adminRemark}}</div></div><div class="ma"><button v-if="regDetail.status==='pending'" class="btn btn-p btn-s" @click="confirmReg(regDetail)">确认报名</button><button v-if="regDetail.status==='pending'||regDetail.status==='confirmed'" class="btn btn-d btn-s" @click="cancelReg(regDetail)">取消报名</button><button v-if="regDetail.status==='confirmed'" class="btn btn-o btn-s" @click="completeReg(regDetail)">标记完成</button></div></template></div></div>
</template>
<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import FoodList from '@/views/dashboard/tourism/FoodList.vue'
import EnvMonitor from '@/views/dashboard/tourism/EnvMonitor.vue'
import FeedingMonitor from '@/views/dashboard/tourism/FeedingMonitor.vue'
import DiseaseWarning from '@/views/dashboard/tourism/DiseaseWarning.vue'
import * as echarts from 'echarts'
import EcommercePage from '@/views/industry/EcommercePage.vue'
import PestDashboard from '@/views/pest/PestDashboard.vue'
import { listLivestock, createLivestock, updateLivestock, deleteLivestock } from '@/api/livestock'
import { listBreedingRecords, createBreedingRecord, updateBreedingRecord, deleteBreedingRecord } from '@/api/breedingRecord'
const props = defineProps({ embedded: { type: Boolean, default: false } })
const router = useRouter()

const clock = ref('')
let clockTimer = null
onMounted(() => { clockTimer = setInterval(() => { const d = new Date(); clock.value = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0') }, 1000)
  // 注册全局函数，使档案编号可点击打开详情
  window.__openArchiveDetail = (id) => {
    const r = livestock.find(x => x.id === id)
    if (r) showDetail(r)
    else toast('档案信息加载失败，请重试', 'warn')
  }
  // 优先从后端 API 加载养殖档案，失败则回退 localStorage
  loadLivestockFromApi()
  // 加载本地持久化数据（除养殖档案外，其他模块使用 localStorage）
  loadAllData()
  normalizeSlaughterData()
  // 初次进入即渲染当前子页图表（否则「地块分布分析」等默认图表在首次加载时为空白）
  nextTick(() => initChart())
})
onUnmounted(() => { clearInterval(clockTimer); delete window.__openArchiveDetail })

// Toast
const toasts = reactive([])
function toast(msg, type = 'info') { const id = Date.now(); toasts.push({ id, msg, type }); setTimeout(() => { const i = toasts.findIndex(t => t.id === id); if (i >= 0) toasts.splice(i, 1) }, 2300) }

// Modules
const modules = [{ key: 'farming', icon: '🌾', label: '智慧农业' }, { key: 'ecommerce', icon: '🛒', label: '农产品电商' }, { key: 'tourism', icon: '🏞️', label: '乡村文旅' }, { key: 'livestock', icon: '🐖', label: '智慧养殖' }]
const modLabels = { farming: '智慧农业', ecommerce: '农产品电商', tourism: '乡村文旅', livestock: '智慧养殖' }
const subLabels = { lands: '地块管理', crops: '作物档案', records: '农事记录', monitor: '生长监测', irrigation: '水肥管理', pest: '病虫害预警', products: '商品管理', orders: '订单管理', trace: '产品溯源', live: '直播中心', analytics: '经营分析', spots: '景点游览', bnbs: '特色民宿', activities: '活动体验', foods: '美食推荐', records2: '养殖档案', env: '环境监测', feed: '投喂管理', disease: '疫病预警', slaughter: '出栏管理' }
const subMap = { farming: ['lands', 'crops', 'records', 'monitor', 'irrigation', 'pest'], ecommerce: ['products', 'orders', 'trace', 'live', 'analytics'], tourism: ['spots', 'bnbs', 'activities', 'foods'], livestock: ['records2', 'env', 'feed', 'disease', 'slaughter'] }
const addBtnLabels = { lands: '新增地块', crops: '新增作物', records: '新增记录', irrigation: '新增计划', pest: '新增预警', products: '新增商品', orders: '新增订单', trace: '新增溯源', live: '创建直播', analytics: '导出报表', records2: '新增养殖批次', feed: '新增投喂计划', disease: '新增预警', slaughter: '新增出栏记录', foods: '新增商户' }
const chartTitles = { lands: '地块分布分析', crops: '作物阶段分布', records: '农事类型分布', products: '商品销量分布', records2: '养殖存栏统计' }
const secondaryTitles = { lands: '地块概况', crops: '种植日历', records: '最近农事', irrigation: '灌溉状态', pest: '病虫害监测', records2: '养殖概况', feed: '投喂状态', slaughter: '出栏记录' }
const stageColor = { '成长期': '#22B573', '育成期': '#0EA5E9', '幼苗期': '#8B5CF6', '育肥期': '#F2A62B', '待出栏': '#E05252' }
const healthColor = { '正常': '#22B573', '观察中': '#F2A62B', '异常': '#E05252' }
const curMod = ref('farming'), curSub = ref('lands'), page = ref(1), filterText = ref(''), bnbfilterText = ref(''), pageSize = 8
const drawerOpen = ref(false), drawerTitle = ref(''), drawerData = ref(null)
const contentRef = ref(null)
let chartInstance = null

const subTabs = computed(() => subMap[curMod.value] || [])
const isDataPage = computed(() => ['crops', 'records', 'irrigation', 'records2'].includes(curSub.value))
const showChart = computed(() => ['lands', 'crops', 'records', 'pest', 'products'].includes(curSub.value))
const hasSecondary = computed(() => ['lands', 'crops', 'records', 'irrigation'].includes(curSub.value))
const isMgmtPage = computed(() => ['products', 'orders', 'spots', 'bnbs', 'activities', 'trace', 'analytics', 'heritage', 'guide', 'planning'].includes(curSub.value))
const isOverview = computed(() => curSub.value === 'overview')

function switchMod(k) { curMod.value = k; curSub.value = subMap[k][0]; page.value = 1; filterText.value = ''; drawerOpen.value = false; nextTick(() => initChart()) }
function switchSub(s) { curSub.value = s; page.value = 1; filterText.value = ''; drawerOpen.value = false; nextTick(() => initChart()) }

// Data
let uidCounter = 300; function uid() { return ++uidCounter }
const lands = reactive([{ id: 1, name: '蜂糖李基地', area: 100, soil: '褐土', location: '产业园东区', crop: '蜂糖李', status: '盛果期', irrigation: true, manager: '王大叔', sensor: '在线', date: '2023-03-15' },
  { id: 2, name: '富硒黄桃园', area: 150, soil: '潮土', location: '产业园南区', crop: '富硒黄桃', status: '盛果期', irrigation: true, manager: '李婶', sensor: '在线', date: '2023-04-01' },
  { id: 3, name: '阳光玫瑰葡萄园', area: 50, soil: '褐土', location: '产业园西区', crop: '阳光玫瑰葡萄', status: '生长期', irrigation: true, manager: '赵大哥', sensor: '在线', date: '2024-02-20' },
  { id: 4, name: '智能温室大棚', area: 100, soil: '基质', location: '产业园核心区', crop: '高架草莓/圣女果', status: '采收中', irrigation: true, manager: '刘阿姨', sensor: '在线', date: '2024-09-01' },
  { id: 5, name: '荷花种植区', area: 50, soil: '水域', location: '产业园北区', crop: '荷花/荷虾混养', status: '生长期', irrigation: true, manager: '张大叔', sensor: '离线', date: '2024-05-01' },
  { id: 6, name: '油葵种植区', area: 150, soil: '潮土', location: '产业园西区', crop: '油葵', status: '生长期', irrigation: false, manager: '赵大哥', sensor: '未安装', date: '2025-03-01' }])

// ===== 地块管理驾驶舱：地图点位 / 作物分布 / 状态统计 =====
const selectedLand = ref(null)
const activeLand = computed(() => selectedLand.value || lands[0] || {})
function selectLand(l) { selectedLand.value = l }
function cropColor(c) {
  if (!c) return '#22B573'
  if (c.indexOf('蜂糖李') >= 0) return '#F2A62B'
  if (c.indexOf('黄桃') >= 0) return '#F2994A'
  if (c.indexOf('葡萄') >= 0) return '#8B5CF6'
  if (c.indexOf('草莓') >= 0 || c.indexOf('圣女果') >= 0) return '#E05252'
  if (c.indexOf('荷花') >= 0 || c.indexOf('荷虾') >= 0) return '#0EA5E9'
  if (c.indexOf('油葵') >= 0) return '#E5B93C'
  return '#22B573'
}
function landIcon(c) {
  if (!c) return '🌾'
  if (c.indexOf('蜂糖李') >= 0) return '🍈'
  if (c.indexOf('黄桃') >= 0) return '🍑'
  if (c.indexOf('葡萄') >= 0) return '🍇'
  if (c.indexOf('草莓') >= 0 || c.indexOf('圣女果') >= 0) return '🍓'
  if (c.indexOf('荷花') >= 0 || c.indexOf('荷虾') >= 0) return '🪷'
  if (c.indexOf('油葵') >= 0) return '🌻'
  return '🌾'
}
function sensorDot(s) { return s === '在线' ? '🟢' : s === '离线' ? '🔴' : '⚪' }
function landStatusTag(s) { return s === '盛果期' || s === '采收中' ? 'g' : s === '已收割' ? 'dim' : 'b' }
const landStatusColor = { '盛果期': '#22B573', '生长期': '#0EA5E9', '采收中': '#F2A62B', '已收割': '#66788A' }
const mapSpots = computed(() => {
  // 地块分布地图：按片区归类（location 可能带「产业园」等前缀，用 includes 匹配），
  // 同一片区内多地块自动网格平铺，避免重叠
  const REGIONS = [
    { key: '北区', box: { x: 230, y: 30, w: 200, h: 95 } },
    { key: '核心区', box: { x: 230, y: 155, w: 200, h: 110 } },
    { key: '南区', box: { x: 230, y: 295, w: 200, h: 110 } },
    { key: '西区', box: { x: 36, y: 70, w: 170, h: 290 } },
    { key: '东区', box: { x: 452, y: 90, w: 172, h: 190 } }
  ]
  const FALLBACK = { x: 452, y: 300, w: 172, h: 100 }
  const GAP = 6
  const buckets = REGIONS.map(r => ({ box: r.box, list: lands.filter(l => l.location.includes(r.key)) }))
  buckets.push({ box: FALLBACK, list: lands.filter(l => !REGIONS.some(r => l.location.includes(r.key))) })
  // 把一片「地盘」按 n 个格子平铺（竖长地盘上下排，横长地盘左右排）
  const cells = (box, n) => {
    const cols = n <= 1 ? 1 : (box.h > box.w ? 1 : 2)
    const rows = Math.ceil(n / cols)
    const cw = (box.w - GAP * (cols - 1)) / cols
    const ch = (box.h - GAP * (rows - 1)) / rows
    return Array.from({ length: n }, (_, i) => {
      const col = i % cols, row = Math.floor(i / cols)
      return { x: box.x + col * (cw + GAP), y: box.y + row * (ch + GAP), w: cw, h: ch }
    })
  }
  return buckets.flatMap(b => b.list.length
    ? cells(b.box, b.list.length).map((c, i) => ({ ...b.list[i], color: cropColor(b.list[i].crop), ...c }))
    : [])
})
const cropDist = computed(() => lands.map(l => ({ name: l.crop, area: l.area, color: cropColor(l.crop) })).sort((a, b) => b.area - a.area))
const maxCropArea = computed(() => Math.max(1, ...cropDist.value.map(c => c.area)))
const landStatusDist = computed(() => {
  const m = {}
  lands.forEach(l => { m[l.status] = (m[l.status] || 0) + 1 })
  return Object.entries(m).map(([name, count]) => ({ name, count }))
})
const landStats = computed(() => {
  const n = lands.length
  const total = lands.reduce((s, l) => s + (l.area || 0), 0)
  const irrig = lands.filter(l => l.irrigation).length
  const cover = n ? (irrig / n * 100).toFixed(1) : '0.0'
  return [
    { label: '地块总数', value: n + '块', cls: '' },
    { label: '总面积', value: total + '亩', cls: 'g' },
    { label: '灌溉覆盖', value: irrig + '块', cls: 'y' },
    { label: '灌溉覆盖率', value: cover + '%', cls: 'g' }
  ]
})
const filteredLands = computed(() => {
  const f = filterText.value.toLowerCase()
  if (!f) return lands
  return lands.filter(l => Object.values(l).some(v => String(v).toLowerCase().includes(f)))
})

const crops = reactive([{ id: 1, name: '蜂糖李', variety: '蜂糖李1号', plantDate: '2023-03-15', cycle: '210天', expYield: '1,800kg/亩', area: 100, stage: '果实膨大期', fertilizer: '有机肥+钾肥' },
  { id: 2, name: '富硒黄桃', variety: '锦绣黄桃', plantDate: '2023-04-01', cycle: '180天', expYield: '2,200kg/亩', area: 150, stage: '果实膨大期', fertilizer: '有机肥+硒肥' },
  { id: 3, name: '阳光玫瑰葡萄', variety: '阳光玫瑰', plantDate: '2024-02-20', cycle: '160天', expYield: '1,500kg/亩', area: 50, stage: '着色期', fertilizer: '有机肥+钙镁肥' },
  { id: 4, name: '油葵', variety: '矮大头', plantDate: '2025-03-01', cycle: '120天', expYield: '300kg/亩', area: 150, stage: '开花期', fertilizer: '复合肥' }])
const records = reactive([{ id: 1, type: '施肥', crop: '红富士苹果', plot: '苹果园区A区', date: '2026-06-15', detail: '追施复合肥 25kg/亩', operator: '赵大哥', weather: '晴 28°C' },
  { id: 2, type: '灌溉', crop: '番茄/黄瓜', plot: '蔬菜大棚区', date: '2026-06-15', detail: '滴灌 2小时，180m³', operator: '刘阿姨', weather: '多云 26°C' },
  { id: 3, type: '打药', crop: '红富士苹果', plot: '苹果园区A区', date: '2026-06-14', detail: '杀菌剂+杀虫剂', operator: '赵大哥', weather: '晴 30°C' },
  { id: 4, type: '修剪', crop: '红富士苹果', plot: '苹果园区B区', date: '2026-06-13', detail: '夏季修剪，疏除过密枝', operator: '张大叔', weather: '阴 25°C' }])
const products = reactive([{ id: 1, name: '富硒黄桃', cat: '水果类', price: 88, stock: 320, sales: 1560, status: '上架' },
  { id: 2, name: '蜂糖李', cat: '水果类', price: 128, stock: 180, sales: 980, status: '上架' },
  { id: 3, name: '阳光玫瑰葡萄', cat: '水果类', price: 68, stock: 150, sales: 720, status: '上架' },
  { id: 4, name: '澳洲淡水龙虾', cat: '水产类', price: 268, stock: 500, sales: 320, status: '上架' },
  { id: 5, name: '有机油葵籽', cat: '特色农产品', price: 35, stock: 450, sales: 680, status: '上架' }])
const tSpots = reactive([
  { id: 1, name: '笃敬现代农业产业园', type: '农业观光', address: '中堰村产业园核心区', villageName: '中堰村', desc: '集蜂糖李、富硒黄桃、阳光玫瑰葡萄种植与观光为一体的现代农业示范园区', cover: '', openStatus: 'open', bookingType: '无需预约', manager: '赵大哥', contact: '139****6789', openingTime: '08:00-18:00', tickets: 0, visitors: 8500, createdAt: '2025-03-01', updatedAt: '2026-07-15' },
  { id: 2, name: '休闲垂钓中心', type: '生态休闲', address: '中堰村南区', villageName: '中堰村', desc: '荷虾混养区配套垂钓体验，可现场加工品尝', cover: '', openStatus: 'open', bookingType: '电话预约', manager: '刘阿姨', contact: '138****8901', openingTime: '06:00-20:00', tickets: 20, visitors: 3200, createdAt: '2025-05-01', updatedAt: '2026-07-10' },
  { id: 3, name: '研学教育基地', type: '研学教育', address: '中堰村东区', villageName: '中堰村', desc: '面向中小学生开展农耕文化研学教育活动', cover: '', openStatus: 'open', bookingType: '线上预约', manager: '张大叔', contact: '137****2345', openingTime: '09:00-17:00', tickets: 15, visitors: 1800, createdAt: '2025-09-01', updatedAt: '2026-06-20' },
  { id: 4, name: '荷虾混养观光区', type: '生态休闲', address: '中堰村北区', villageName: '中堰村', desc: '荷花观赏与澳洲淡水龙虾生态养殖观光', cover: '', openStatus: 'paused', bookingType: '无需预约', manager: '李婶', contact: '136****3456', openingTime: '07:00-19:00', tickets: 0, visitors: 2400, createdAt: '2026-03-01', updatedAt: '2026-07-01' },
  { id: 5, name: '灯光音乐节广场', type: '文化活动', address: '中堰村中心', villageName: '中堰村', desc: '定期举办乡村音乐节和灯光秀活动', cover: '', openStatus: 'open', bookingType: '无需预约', manager: '刘管理员', contact: '135****4567', openingTime: '18:00-23:00', tickets: 30, visitors: 5200, createdAt: '2026-05-01', updatedAt: '2026-07-20' }
])
const foods=reactive([{id:1,name:"中堰农家乐",type:"农家菜",address:"中堰村中心",villageName:"中堰村",desc:"主打土灶炖鸡和蜂蜜烤鸡，食材均来自本村产业园。",pricePer:"68",phone:"139****6789",openTime:"10:00-21:00",specialDishes:["蜂蜜烤鸡","土灶炖鸡","蜂蜜李子","农家豆腐"],facilities:["停车","包厢","可团餐"],rating:"4.8",status:"开放",visitors:5600},{id:2,name:"李子农庄",type:"采摘体验",address:"中堰村产业园东区",villageName:"中堰村",desc:"集采摘和农家餐饮于一体，可体验蜂糖李采摘。",pricePer:"88",phone:"138****8901",openTime:"08:00-18:00",specialDishes:["蜂糖李鲜果","李子果酱","农家小炒"],facilities:["停车","儿童座椅"],rating:"4.6",status:"开放",visitors:3800},{id:3,name:"蜂蜜主题餐厅",type:"特色小吃",address:"中堰村产业园南区",villageName:"中堰村",desc:"以蜂蜜为主题的特色餐厅，蜂蜜系列甜品和饮品。",pricePer:"45",phone:"137****2345",openTime:"09:00-20:00",specialDishes:["蜂蜜蛋糕","蜂蜜柚子茶","蜂糖李冰沙"],facilities:["停车","WiFi"],rating:"4.9",status:"开放",visitors:7200},{id:4,name:"荷塘渔家",type:"农家菜",address:"中堰村北区",villageName:"中堰村",desc:"主打澳洲淡水龙虾和荷花鱼，可体验垂钓后现场加工。",pricePer:"98",phone:"136****3456",openTime:"11:00-22:00",specialDishes:["清蒸澳洲龙虾","荷花鱼汤","荷叶蒸鸡"],facilities:["停车","包厢","可团餐","儿童座椅"],rating:"4.7",status:"开放",visitors:4100}])
const tBnBs = reactive([{ id: 1, name: '田园居', _dist:'距产业园300m', address:'中堰村一组', owner: '王大爷', phone: '139****6789', rooms: 6, price: 188, rating: 4.8, bookings: 320, revenue: '¥3.8万', occupancy: '82%', status: '营业中', since: '2023-03', desc: '独栋小院，自带菜园，采摘体验，农家餐饮', tags: '采摘/农家饭', license: '陕旅备2024001', openTime: '07:00-22:00', todayIn: 4, monthOrders: 68, rooms2: [{ type: '标准间', area: '28㎡', beds: '2人', price: 188 },
  { type: '家庭房', area: '45㎡', beds: '4人', price: 288 }], reviews: [{ name: '张女士', text: '带孩子来体验采摘，很不错', stars: 5 },
  { name: '王先生', text: '农家菜很地道，蔬菜都是自己种的', stars: 5 },
  { name: '刘阿姨', text: '房间干净整洁，老板热情', stars: 4 }], trend: [60, 45, 55, 70, 82, 85, 90, 88, 78, 72, 65, 58] },
  { id: 2, name: '山景阁', _dist:'距观景区500m', address:'中堰村半山', owner: '李婶', phone: '138****8901', rooms: 4, price: 258, rating: 4.9, bookings: 186, revenue: '¥3.2万', occupancy: '76%', status: '营业中', since: '2023-06', desc: '半山腰观景民宿，山景观景台，日出观赏', tags: '山景/摄影', license: '陕旅备2024002', openTime: '06:00-21:00', todayIn: 3, monthOrders: 52, rooms2: [{ type: '标准间', area: '26㎡', beds: '2人', price: 258 },
  { type: '景观房', area: '38㎡', beds: '2人', price: 328 }], reviews: [{ name: '李先生', text: '山景房景色非常好，早上看日出太美了', stars: 5 },
  { name: '赵女士', text: '房间很大，阳台直接可以看到群山', stars: 5 },
  { name: '陈先生', text: '适合摄影爱好者，位置绝佳', stars: 5 }], trend: [40, 35, 50, 65, 72, 78, 82, 76, 68, 55, 48, 42] },
  { id: 3, name: '果园人家', _dist:'距采摘园200m', address:'中堰村果园旁', owner: '赵大哥', phone: '137****2345', rooms: 8, price: 158, rating: 4.6, bookings: 450, revenue: '¥4.2万', occupancy: '88%', status: '营业中', since: '2022-09', desc: '紧邻苹果园，含农家早餐，亲子采摘', tags: '亲子/采摘', license: '陕旅备2024003', openTime: '07:30-21:00', todayIn: 5, monthOrders: 86, rooms2: [{ type: '标准间', area: '30㎡', beds: '2人', price: 158 },
  { type: '家庭房', area: '48㎡', beds: '4人', price: 248 },
  { type: '亲子房', area: '42㎡', beds: '3人', price: 208 }], reviews: [{ name: '周女士', text: '果园采摘太有意思了', stars: 5 },
  { name: '吴先生', text: '早餐很丰盛', stars: 4 },
  { name: '郑女士', text: '整体不错', stars: 4 }], trend: [70, 55, 62, 78, 85, 90, 88, 92, 85, 80, 75, 68] }])
const livestock = reactive([
  { id: 1, batchNo:'ZY-SC-202603-001', batchName:'2026年春季加州鲈批次', category:'水产', type:'鲈鱼', breed:'加州鲈', initialCount:5500, count:5000, unit:'尾', area:'荷虾混养区A塘', startDate:'2026-03-15', expectDate:'2026-09-15', stage:'成长期', health:'正常', source:'自繁', manager:'赵大哥', phone:'139****6789', villageName:'中堰村', remark:'生长状况良好，定期换水', updatedAt:'2026-07-20' },
  { id: 2, batchNo:'ZY-SC-202604-001', batchName:'2026年澳洲淡水龙虾批次', category:'水产', type:'澳洲淡水龙虾', breed:'澳洲品系', initialCount:85000, count:80000, unit:'尾', area:'智能水产养殖基地1号池', startDate:'2026-04-01', expectDate:'2026-10-01', stage:'成长期', health:'正常', source:'外购虾苗', manager:'李婶', phone:'138****8901', villageName:'中堰村', remark:'定期检测水质，氨氮指标正常', updatedAt:'2026-07-18' },
  { id: 3, batchNo:'ZY-SC-202605-001', batchName:'2026年罗非鱼育成批次', category:'水产', type:'罗非鱼', breed:'吉富品系', initialCount:32000, count:30000, unit:'尾', area:'智慧渔业车间2号池', startDate:'2026-05-01', expectDate:'2026-11-01', stage:'育成期', health:'观察中', source:'自繁', manager:'张大叔', phone:'137****2345', villageName:'中堰村', remark:'近期出现少量死亡，已采样送检', updatedAt:'2026-07-22' },
  { id: 4, batchNo:'ZY-XQ-202603-001', batchName:'2026年春季杜长大三元批次', category:'家畜', type:'猪', breed:'杜长大三元', initialCount:120, count:83, unit:'头', area:'养猪场A区', startDate:'2026-03-20', expectDate:'2026-08-20', stage:'育肥期', health:'正常', source:'外购仔猪', manager:'王大叔', phone:'135****1122', villageName:'中堰村', remark:'育肥后期，预计8月下旬出栏', updatedAt:'2026-07-25' },
  { id: 5, batchNo:'ZY-XQ-202603-002', batchName:'2026年海兰褐蛋鸡批次', category:'家禽', type:'鸡', breed:'海兰褐', initialCount:2500, count:2300, unit:'只', area:'养鸡场1号', startDate:'2026-04-01', expectDate:'2026-10-01', stage:'育成期', health:'正常', source:'外购雏鸡', manager:'赵大哥', phone:'139****6789', villageName:'中堰村', remark:'产蛋率稳定在92%', updatedAt:'2026-07-24' },
  { id: 6, batchNo:'ZY-XQ-202602-001', batchName:'2026年西门塔尔牛育肥批次', category:'家畜', type:'牛', breed:'西门塔尔', initialCount:30, count:25, unit:'头', area:'养牛场', startDate:'2026-02-15', expectDate:'2026-09-15', stage:'育肥期', health:'正常', source:'外购犊牛', manager:'张大叔', phone:'137****2345', villageName:'中堰村', remark:'育肥效果良好，日均增重1.2kg', updatedAt:'2026-07-22' }
])
const bnbOrders = reactive([{ id: 'ORD0617', guest: '张女士', bnb: '田园居', room: '家庭房', checkIn: '2026-06-22', checkOut: '2026-06-24', amount: 576, status: '已入住', phone: '138****5678' },
  { id: 'ORD0618', guest: '李女士', bnb: '山景阁', room: '景观房', checkIn: '2026-06-25', checkOut: '2026-06-27', amount: 656, status: '待入住', phone: '139****8901' },
  { id: 'ORD0619', guest: '王先生', bnb: '果园人家', room: '标准间', checkIn: '2026-06-20', checkOut: '2026-06-22', amount: 316, status: '已退房', phone: '136****2345' },
  { id: 'ORD0620', guest: '赵女士', bnb: '田园居', room: '标准间', checkIn: '2026-06-28', checkOut: '2026-06-30', amount: 376, status: '待入住', phone: '135****6789' }])
const ecoOrders = reactive([{ id: 'ORD0617A', type: '特产', item: '红富士苹果', by: '张女士', amount: 204, status: '已发货', date: '2026-06-17' }, { id: 'ORD0618A', type: '特产', item: '有机核桃+大樱桃', by: '李先生', amount: 386, status: '待发货', date: '2026-06-16' }])
const activities = reactive([
  { id:1, name:'春季采摘节', type:'采摘体验', startTime:'2026-04-01', endTime:'2026-04-15', address:'中堰村果园', villageName:'中堰村', desc:'春暖花开，带上家人来中堰村体验亲手采摘新鲜水果的乐趣。', price:'免费', contact:'139****6789', currentPeople:36, limitPeople:50, status:'open', process:'9:00集合-9:30讲解-10:00采摘-12:00午餐-14:00自由活动', notice:'请穿舒适衣物，儿童需家长陪同', visitors:1280, duration:'半天' },
  { id:2, name:'乡村音乐节', type:'节庆活动', startTime:'2026-05-01', endTime:'2026-05-03', address:'中堰村文化广场', villageName:'中堰村', desc:'一年一度的乡村音乐盛会，邀请本地民谣歌手和乐队演出。', price:'¥39/人', contact:'138****8901', currentPeople:180, limitPeople:300, status:'open', process:'17:00入场-18:00开幕-19:00演出-21:00篝火晚会', notice:'请提前报名，1.2米以下儿童免费', visitors:5600, duration:'3天' },
  { id:3, name:'农耕研学营', type:'研学教育', startTime:'2026-07-10', endTime:'2026-07-12', address:'中堰村研学基地', villageName:'中堰村', desc:'三天两夜的农耕文化研学体验，适合中小学生暑期实践。', price:'¥198/人', contact:'137****2345', currentPeople:22, limitPeople:40, status:'open', process:'Day1:农耕播种-Day2:农事采摘-Day3:成果展示', notice:'提供食宿，自备洗漱用品', visitors:860, duration:'3天' },
  { id:4, name:'乡村摄影展', type:'文化活动', startTime:'2026-08-01', endTime:'2026-08-31', address:'中堰村全域', villageName:'中堰村', desc:'展示中堰村田园风光、农耕文化和乡村生活的摄影作品。', price:'免费', contact:'135****4567', currentPeople:85, limitPeople:0, status:'open', process:'作品征集-专家评选-获奖展示-颁奖', notice:'投稿须为原创，每人限投3幅', visitors:2100, duration:'31天' },
  { id:5, name:'中秋赏月晚会', type:'节庆活动', startTime:'2026-09-15', endTime:'2026-09-15', address:'中堰村文化广场', villageName:'中堰村', desc:'中秋佳节，邀您共赏明月，现场有月饼制作体验和烟花表演。', price:'免费', contact:'136****3456', currentPeople:0, limitPeople:200, status:'upcoming', process:'18:00入场-18:30月饼DIY-19:30赏月-20:30烟花', notice:'请提前报名以便准备材料', visitors:0, duration:'1晚' }
])
const traceSteps = [{ time: '2026-06-15 08:30', step: '采摘', detail: '苹果园区A区，人工采摘，成熟度90%' }, { time: '2026-06-15 14:00', step: '分选', detail: '自动分选线，直径≥75mm' }, { time: '2026-06-16 09:00', step: '包装', detail: '泡沫托+网套+彩箱，5kg/箱' }, { time: '2026-06-16 16:00', step: '检测', detail: '农残检测合格，报告 JC0616001' }, { time: '2026-06-17 10:00', step: '发货', detail: '顺丰冷链，预计2天送达' }]
const riskZones = [{n:'苹果园区A区',r:'高',desc:'稻瘟病高发 · 15亩',disease:'稻瘟病'},{n:'养猪场A区',r:'高',desc:'呼吸道综合征 · 52头',disease:'猪呼吸道综合征'},{n:'苹果园区B区',r:'中',desc:'蚜虫关注区 · 30亩',disease:'蚜虫'},{n:'葡萄园',r:'中',desc:'霜霉病风险 · 8亩',disease:'霜霉病'},{n:'蔬菜大棚区',r:'低',desc:'正常监测中',disease:'--'},{n:'养鸡场1号',r:'低',desc:'球虫病已处理',disease:'球虫病'}]
const selPestZone = ref(null)
const env = reactive({temp:'28.5',hum:'78',rain:'12.5',soil:'32'})
const pestZones = [{n:'苹果园区A区',c:12},{n:'养猪场A区',c:9},{n:'葡萄园',c:6},{n:'蔬菜大棚区',c:3},{n:'养鸡场1号',c:2}]
const pestDiseases = [{n:'稻瘟病',c:15},{n:'猪呼吸道综合征',c:9},{n:'蚜虫',c:7},{n:'球虫病',c:5},{n:'霜霉病',c:3}]
const pestRiskZones = [{n:'苹果园区A区',r:'高',desc:'稻瘟病·15亩'},{n:'养猪场A区',r:'高',desc:'呼吸道·52头'},{n:'葡萄园B区',r:'中',desc:'霜霉病·8亩'},{n:'苹果园区B区',r:'中',desc:'蚜虫·30亩'},{n:'大棚1号',r:'低',desc:'正常监测中'},{n:'蔬菜大棚区',r:'低',desc:'球虫病·已处理'}]
const pestPreviewUrl = ref(null)
const pestAiResult = ref(null)
function onPestFileChange(e){
  const f = e.target.files[0]; if(!f) return
  pestPreviewUrl.value = URL.createObjectURL(f)
  setTimeout(()=>{
    var diseases = [{disease:'稻瘟病',confidence:96,advice:'立即喷施稻瘟灵25%EC，每亩50ml'},{disease:'玉米大斑病',confidence:88,advice:'喷施苯醚甲环唑，每亩30ml'},{disease:'蚜虫灾害',confidence:82,advice:'释放瓢虫或喷施吡虫啉2000倍液'}]
    pestAiResult.value = diseases[Math.floor(Math.random()*diseases.length)]
    toast('AI识别完成','ok')
  }, 1500)
  toast('图片已上传，AI分析中...','info')
}
const diseaseAlerts = reactive([{ date: '2026-06-16', building: '养猪场A区', disease: '猪呼吸道综合征', risk: '中风险', symptom: '部分猪只咳嗽，采食量下降5%', action: '加强通风，添加维生素C', status: '监控中' }, { date: '2026-06-10', building: '养鸡场1号', disease: '球虫病预警', risk: '低风险', symptom: '个别鸡只粪便异常', action: '饲料中添加抗球虫药', status: '已处理' }])
const irrigationPoint = ref(1)
const irrigationPoints = reactive([
  { id:1, name:'苹果园区A区', icon:'🍎', loc:'产业园东区', device:'2号灌溉控制器', method:'滴灌', coord:'32.697, 109.028' },
  { id:2, name:'蔬菜大棚区', icon:'🥬', loc:'产业园核心区', device:'5号灌溉控制器', method:'滴灌+喷灌', coord:'32.692, 109.023' },
  { id:3, name:'阳光玫瑰葡萄园', icon:'🍇', loc:'产业园西区', device:'8号灌溉控制器', method:'滴灌', coord:'32.698, 109.022' },
  { id:4, name:'油葵种植区', icon:'🌻', loc:'产业园西区', device:'12号灌溉控制器', method:'喷灌', coord:'32.693, 109.027' }
])
const currentIrrigationPoint = computed(() => irrigationPoints.find(p => p.id === irrigationPoint.value) || irrigationPoints[0])
function switchIrrigationPoint(id) { irrigationPoint.value = id; toast('已切换到 ' + (irrigationPoints.find(p=>p.id===id)||{}).name, 'info') }
const selectedValve = ref(null)
const irrigationValves = reactive([
  { id:1, name:'1号阀门', icon:'🔧', desc:'苹果园区滴灌', on:true, runtime:'2h 15min', area:'苹果园区A区', soilMoisture:'28%', progress:'65%', flow:'2.8m³/h', pressure:'0.32MPa', dailyUse:'18.5m³', autoControl:true, npk:{n:'12',p:'8',k:'15'}, status:'normal' },
  { id:2, name:'2号阀门', icon:'🔧', desc:'蔬菜大棚滴灌', on:true, runtime:'1h 30min', area:'蔬菜大棚区', soilMoisture:'32%', progress:'48%', flow:'2.1m³/h', pressure:'0.28MPa', dailyUse:'12.3m³', autoControl:true, npk:{n:'15',p:'10',k:'20'}, status:'normal' },
  { id:3, name:'3号阀门', icon:'🔧', desc:'葡萄园滴灌', on:false, runtime:'--', area:'阳光玫瑰葡萄园', soilMoisture:'22%', progress:'0%', flow:'0m³/h', pressure:'0MPa', dailyUse:'0m³', autoControl:false, npk:{n:'0',p:'0',k:'0'}, status:'stopped' },
  { id:4, name:'水泵', icon:'⚡', desc:'主供水泵', on:true, runtime:'3h 45min', area:'全园区', soilMoisture:'--', progress:'--', flow:'8.5m³/h', pressure:'0.45MPa', dailyUse:'56.2m³', autoControl:true, npk:{n:'--',p:'--',k:'--'}, status:'normal' },
  { id:5, name:'施肥泵', icon:'🧪', desc:'水肥一体机', on:false, runtime:'--', area:'全园区', soilMoisture:'--', progress:'--', flow:'0m³/h', pressure:'0MPa', dailyUse:'0m³', autoControl:false, npk:{n:'10',p:'6',k:'12'}, status:'stopped' },
  { id:6, name:'4号阀门', icon:'🔧', desc:'油葵喷灌', on:true, runtime:'0h 45min', area:'油葵种植区', soilMoisture:'26%', progress:'30%', flow:'3.5m³/h', pressure:'0.30MPa', dailyUse:'8.2m³', autoControl:false, npk:{n:'8',p:'5',k:'10'}, status:'normal' }
])
const valveTimers = reactive({})
const runningLogs = ref([])
const logFilter = ref({ device: '', status: '', date: '' })

function toggleValve(id) { const v = irrigationValves.find(x=>x.id===id); if (!v) return; if (v.on) { stopValve(id) } else { startValve(id) } }
function selectValve(id) { selectedValve.value = selectedValve.value === id ? null : id }
async function startValve(id) {
  const v = irrigationValves.find(x=>x.id===id); if (!v) return
  try {
    const res = await fetch('/api/irrigation/start', { method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+(localStorage.getItem('token')||'')}, body:JSON.stringify({deviceName:v.name,deviceId:String(v.id),area:v.area,startMode:'手动',operator:'管理员',soilBefore:v.soilMoisture}) })
    if (res.ok) { const data = await res.json(); if (data.code===200) { v._recordId = data.data.recordId; v._startTime = Date.now() } }
  } catch(e) { /* offline mode */ v._startTime = Date.now() }
  v.on = true; v.status = 'normal'; v.runtime = '0h 0min'; v.flow = (1.5+Math.random()*3).toFixed(1)+'m³/h'; v.progress = '5%'; v.dailyUse = (5+Math.random()*15).toFixed(1)+'m³'
  startValveTimer(id)
  toast(v.name+' 已启动', 'ok')
}
function startValveTimer(id) {
  if (valveTimers[id]) return
  valveTimers[id] = setInterval(() => {
    const v = irrigationValves.find(x=>x.id===id)
    if (!v || !v.on) { clearInterval(valveTimers[id]); delete valveTimers[id]; return }
    if (v._startTime) {
      const elapsed = Math.floor((Date.now() - v._startTime) / 1000)
      const h = Math.floor(elapsed/3600); const m = Math.floor((elapsed%3600)/60); const s = elapsed%60
      v.runtime = h+'h '+m+'min '+s+'s'
    }
  }, 1000)
}
async function stopValve(id) {
  const v = irrigationValves.find(x=>x.id===id); if (!v) return
  const elapsedSec = v._startTime ? Math.floor((Date.now() - v._startTime) / 1000) : 0
  try {
    await fetch('/api/irrigation/stop', { method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+(localStorage.getItem('token')||'')}, body:JSON.stringify({deviceName:v.name,soilAfter:v.soilMoisture,waterUsage:String(v.dailyUse||'0'),avgFlow:String(v.flow||'0')}) })
  } catch(e) { /* offline */ }
  if (valveTimers[id]) { clearInterval(valveTimers[id]); delete valveTimers[id] }
  // Add to local log
  runningLogs.value.unshift({ id:Date.now(), deviceName:v.name, deviceId:String(v.id), area:v.area, startTime:new Date(v._startTime||Date.now()-elapsedSec*1000).toLocaleString(), stopTime:new Date().toLocaleString(), duration:elapsedSec, startMode:'手动', operator:'管理员', waterUsage:v.dailyUse||'0', avgFlow:v.flow||'0', soilBefore:v.soilMoisture, soilAfter:v.soilMoisture, status:'completed' })
  v.on = false; v.status = 'stopped'; v.runtime = '--'; v.flow = '0m³/h'; v.progress = '0%'; v.dailyUse = '0m³'; v._startTime = null
  toast(v.name+' 已停止 · 运行 '+formatDuration(elapsedSec), 'ok')
}
function formatDuration(sec) { const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60; return h+'时'+m+'分'+s+'秒' }
async function loadRunningLogs() {
  try {
    const res = await fetch('/api/irrigation/records', { headers:{'Authorization':'Bearer '+(localStorage.getItem('token')||'')} })
    if (res.ok) { const data = await res.json(); if (data.code===200 && data.data.length) { runningLogs.value = data.data.map(r=>({...r,id:r.id||Date.now(),startTime:r.startTime,stopTime:r.stopTime||'',duration:r.durationSeconds||0,waterUsage:r.waterUsage||'0'})); return } }
  } catch(e) {}
  // Load from localStorage fallback
  const saved = localStorage.getItem('irrigation_logs')
  if (saved) { try { runningLogs.value = JSON.parse(saved) } catch(e){} }
}
function saveRunningLogs() { localStorage.setItem('irrigation_logs', JSON.stringify(runningLogs.value.slice(0,200))) }
const filteredLogs = computed(() => {
  let logs = runningLogs.value
  if (logFilter.value.device) logs = logs.filter(l => l.deviceName === logFilter.value.device)
  if (logFilter.value.status) logs = logs.filter(l => l.status === logFilter.value.status)
  if (logFilter.value.date) logs = logs.filter(l => (l.startTime||'').startsWith(logFilter.value.date))
  return logs
})
// ===== Generic table export =====
function exportCurrentTable() {
  const cols = tableCols.value
  const data = filteredData.value
  if (!data.length) { toast('没有数据可导出', 'warn'); return }
  const esc = v => `"` + String(v||'').replace(/"/g,'""') + `"`
  const csv = '﻿' + cols.map(esc).join(',') + '\n' + data.map(r => cols.map(c => esc(String(r[c]||r[c==='名称'?'name':c==='类型'?'type':c]||''))).join(',')).join('\n')
  const fn = (subLabels[curSub.value]||'数据') + '_' + new Date().toISOString().slice(0,10) + '.csv'
  if (window.showSaveFilePicker) {
    window.showSaveFilePicker({suggestedName:fn,types:[{description:'CSV',accept:{'text/csv':['.csv']}}]})
      .then(h=>h.createWritable().then(w=>w.write(csv).then(()=>w.close())))
      .then(()=>toast('导出成功','ok'))
      .catch(e=>{if(e.name!=='AbortError'){const b=new Blob([csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=fn;a.click();URL.revokeObjectURL(a.href);toast('导出成功','ok')}})
  } else {
    const b=new Blob([csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=fn;a.click();URL.revokeObjectURL(a.href);toast('导出成功','ok')
  }
}

async function exportLogs() {
  try {
    const res = await fetch('/api/irrigation/export?'+new URLSearchParams(logFilter.value).toString(), { headers:{'Authorization':'Bearer '+(localStorage.getItem('token')||'')} })
    if (res.ok) { const data = await res.json(); if (data.code===200) { downloadCSV('﻿'+data.data, '灌溉记录_'+new Date().toISOString().slice(0,10)+'.csv'); return } }
  } catch(e) {}
  const csv = '设备名称,设备编号,区域,启动时间,停止时间,运行时长,方式,操作人,用水量,流量,启动湿度,停止湿度,状态\n' + runningLogs.value.map(l => [l.deviceName,l.deviceId,l.area,l.startTime,l.stopTime,formatDuration(l.duration||0),l.startMode,l.operator,l.waterUsage,l.avgFlow,l.soilBefore,l.soilAfter,l.status].join(',')).join('\n')
  downloadCSV('﻿'+csv, '灌溉记录_'+new Date().toISOString().slice(0,10)+'.csv')
}

// Restore running timers on page load
onMounted(() => {
  const savedStates = JSON.parse(localStorage.getItem('irrigation_states')||'{}')
  irrigationValves.forEach(v => {
    if (savedStates[v.id] && savedStates[v.id].on) {
      v.on = true; v.status = 'normal'; v._startTime = savedStates[v.id].startTime || Date.now()
      v.runtime = savedStates[v.id].runtime || '0h 0min'; v.flow = savedStates[v.id].flow || v.flow; v.dailyUse = savedStates[v.id].dailyUse || v.dailyUse
      startValveTimer(v.id)
    }
  })
  loadRunningLogs()
})
// Save states on unmount
onUnmounted(() => {
  const states = {}; irrigationValves.forEach(v => { if (v.on) states[v.id] = { on:true, startTime:v._startTime, runtime:v.runtime, flow:v.flow, dailyUse:v.dailyUse } })
  localStorage.setItem('irrigation_states', JSON.stringify(states))
  saveRunningLogs()
})

const monitorPoint = ref(1)
const monitorPoints = reactive([
  { id:1, name:'苹果园区A区', icon:'🍎', loc:'产业园东区', device:'2号传感器', coord:'32.697, 109.028', alerts:['⚠️ 温度超过30°C，请检查遮阳网','✅ 湿度正常','⚠️ 土壤湿度低于20%，建议灌溉'] },
  { id:2, name:'蔬菜大棚区', icon:'🥬', loc:'产业园核心区', device:'5号传感器', coord:'32.692, 109.023', alerts:['✅ 各项指标正常','📊 CO₂浓度偏高，需通风'] },
  { id:3, name:'阳光玫瑰葡萄园', icon:'🍇', loc:'产业园西区', device:'8号传感器', coord:'32.698, 109.022', alerts:['⚠️ 光照不足，建议补光','✅ 湿度和温度正常'] },
  { id:4, name:'油葵种植区', icon:'🌻', loc:'产业园西区', device:'12号传感器', coord:'32.693, 109.027', alerts:['✅ 所有指标正常'] }
])
const currentMonitorPoint = computed(() => monitorPoints.find(p => p.id === monitorPoint.value) || monitorPoints[0])
const monitorData = reactive({ temp: '26.5', hum: '62', soil: '28', light: '48500' })
function switchMonitorPoint(id) { monitorPoint.value = id; monitorData.temp = (26 + Math.random()*2).toFixed(1); monitorData.hum = (60 + Math.random()*5).toFixed(0); monitorData.soil = (26 + Math.random()*5).toFixed(0); monitorData.light = (46000 + Math.random()*5000).toFixed(0); nextTick(() => initChart()) }
const envData = reactive([
  { id:1, archiveId:1, batchNo:'ZY-SC-202603-001', batchName:'2026年春季加州鲈批次', area:'荷虾混养区A塘', waterTemp:26.5, ph:7.4, oxygen:6.2, ammonia:0.18, turbidity:5.2, waterLevel:95, status:'正常', source:'传感器自动采集', recordTime:'2026-08-04 15:20', updatedAt:'2026-08-04 15:20', remark:'' },
  { id:2, archiveId:2, batchNo:'ZY-SC-202604-001', batchName:'2026年澳洲淡水龙虾批次', area:'智能水产养殖基地1号池', waterTemp:28.2, ph:7.1, oxygen:5.5, ammonia:0.35, turbidity:6.8, waterLevel:88, status:'预警', source:'传感器自动采集', recordTime:'2026-08-04 14:00', updatedAt:'2026-08-04 14:00', remark:'溶解氧偏低，注意增氧' },
  { id:3, archiveId:3, batchNo:'ZY-SC-202605-001', batchName:'2026年罗非鱼育成批次', area:'智慧渔业车间2号池', waterTemp:25.8, ph:7.6, oxygen:6.8, ammonia:0.12, turbidity:4.1, waterLevel:92, status:'正常', source:'农户手工记录', recordTime:'2026-08-04 16:00', updatedAt:'2026-08-04 16:00', remark:'' },
  { id:4, archiveId:1, batchNo:'ZY-SC-202603-001', batchName:'2026年春季加州鲈批次', area:'荷虾混养区A塘', waterTemp:26.2, ph:7.3, oxygen:6.0, ammonia:0.20, turbidity:5.5, waterLevel:94, status:'正常', source:'传感器自动采集', recordTime:'2026-08-04 09:00', updatedAt:'2026-08-04 09:00', remark:'' }
])
const envLatest = computed(() => envData[0])

// Data map and computed
const feedData = reactive([{ id: 1, name: '养猪场A区', type: '自动投喂', time: '07:00', amount: '2.5kg/头', status: '已完成' }, { id: 2, name: '养鸡场1号', type: '自动投喂', time: '06:30', amount: '120g/只', status: '已完成' }, { id: 3, name: '养牛场', type: '手动投喂', time: '08:00', amount: '15kg/头', status: '进行中' }, { id: 4, name: '智能水产基地', type: '自动投喂', time: '07:30', amount: '50kg', status: '已完成' }])
const slaughterData = reactive([
  { id: 1, archiveId: 4, batchNo: 'ZY-XQ-202603-001', name: '养猪场A区', breed: '杜长大三元', count: 48, unit: '头', date: '2026-07-05', avgWeight: '110', totalWeight: '5280', price: '15', amount: 79200, buyer: '双汇食品有限公司', buyerPhone: '138****1234', transport: '冷链运输', plateNo: '川A·8K123', quarantineNo: 'JY20260705001', status: 'completed', remark: '' },
  { id: 2, archiveId: 5, batchNo: 'ZY-XQ-202603-002', name: '养鸡场1号', breed: '海兰褐', count: 200, unit: '只', date: '2026-07-12', avgWeight: '2.1', totalWeight: '420', price: '12', amount: 5040, buyer: '', buyerPhone: '', transport: '', plateNo: '', quarantineNo: '', status: 'pending', remark: '等待买方确认' },
  { id: 3, archiveId: 6, batchNo: 'ZY-XQ-202602-001', name: '养牛场', breed: '西门塔尔', count: 5, unit: '头', date: '2026-08-15', avgWeight: '650', totalWeight: '3250', price: '28', amount: 91000, buyer: '', buyerPhone: '', transport: '', plateNo: '', quarantineNo: '', status: 'planned', remark: '' },
  { id: 4, archiveId: 4, batchNo: 'ZY-XQ-202603-001', name: '养猪场A区', breed: '杜长大三元', count: 35, unit: '头', date: '2026-08-01', avgWeight: '115', totalWeight: '4025', price: '16', amount: 64400, buyer: '雨润集团', buyerPhone: '139****8765', transport: '专用运输车', plateNo: '川A·9M456', quarantineNo: 'JY20260801002', status: 'transporting', remark: '正在运输途中' }
])
// 投喂记录（用于养殖档案详情中的跨模块关联）
const crossFeedData = reactive([
  { id: 101, archiveId: 1, batchNo: 'ZY-SC-202603-001', batchName: '2026年春季加州鲈批次', area: '荷虾混养区A塘', feedName: '加州鲈专用饲料2号', amount: 42, actualAmount: 42, feedTime: '2026-08-05 07:30', method: '人工投喂', manager: '赵大哥', status: '已完成' },
  { id: 102, archiveId: 1, batchNo: 'ZY-SC-202603-001', batchName: '2026年春季加州鲈批次', area: '荷虾混养区A塘', feedName: '加州鲈专用饲料2号', amount: 40, actualAmount: 38, feedTime: '2026-08-04 07:30', method: '自动投喂', manager: '赵大哥', status: '已完成' },
  { id: 103, archiveId: 2, batchNo: 'ZY-SC-202604-001', batchName: '2026年澳洲淡水龙虾批次', area: '智能水产养殖基地1号池', feedName: '虾饲料', amount: 30, actualAmount: 30, feedTime: '2026-08-05 18:00', method: '人工投喂', manager: '李婶', status: '已完成' },
  { id: 104, archiveId: 3, batchNo: 'ZY-SC-202605-001', batchName: '2026年罗非鱼育成批次', area: '智慧渔业车间2号池', feedName: '鱼饲料2号', amount: 45, actualAmount: 45, feedTime: '2026-08-05 14:00', method: '自动投喂', manager: '张大叔', status: '已完成' }
])
// Spot management state & computed
const spotFilterText = ref('')
const spotFilterCat = ref('')
const spotCategories = [{v:'',label:'全部'},{v:'自然风光',l:'🌳 自然风光'},{v:'采摘体验',l:'🍑 采摘体验'},{v:'休闲娱乐',l:'🏕 休闲娱乐'},{v:'研学教育',l:'🎓 研学教育'},{v:'人文文化',l:'🏛 人文文化'}]
const filteredSpots = computed(()=>{let l=tSpots;const f=spotFilterText.value.toLowerCase();if(f)l=l.filter(s=>s.name.toLowerCase().includes(f)||(s.summary||'').toLowerCase().includes(f)||(s.desc||'').toLowerCase().includes(f));if(spotFilterCat.value)l=l.filter(s=>s.type===spotFilterCat.value);return l})
const spotDetailData=ref(null)
function showSpotDetail(s){spotDetailData.value=s;drawerTitle.value=s.name;drawerOpen.value=true}
function starRating(r){const n=Math.round(parseFloat(r)||0);return '★'.repeat(n)+'☆'.repeat(5-n)}
const bnbFilterText=ref(''),bnbCat=ref(''),bnbCats=[{v:'',l:'全部'},{v:'精品民宿',l:'精品民宿'},{v:'特色农家',l:'特色农家'},{v:'亲子家庭',l:'亲子家庭'},{v:'可停车',l:'可停车'},{v:'含早餐',l:'含早餐'}]
function bnbType(b){if(b.tags&&b.tags.includes('亲子'))return'亲子家庭';if(b.tags&&b.tags.includes('亲子'))return'亲子家庭';if(b.rating>=4.8)return'精品民宿';if(b.price<200)return'特色农家';return'精品民宿'}
const filteredBnbs=computed(()=>{let l=tBnBs;const f=bnbFilterText.value.toLowerCase();if(f)l=l.filter(b=>b.name.toLowerCase().includes(f)||(b.desc||'').toLowerCase().includes(f));if(bnbCat.value==='可停车')l=l.filter(b=>true);else if(bnbCat.value==='含早餐')l=l.filter(b=>b.tags&&b.tags.includes('采摘'));else if(bnbCat.value)l=l.filter(b=>bnbType(b)===bnbCat.value);return l})
function spotCatIcon(t){const m={'自然风光':'🌳','采摘体验':'🍑','休闲娱乐':'🏕','研学教育':'🎓','人文文化':'🏛','乡村文化':'🏛'};return m[t]||'📍'}
function spotCatColor(t){const m={'自然风光':'#22B573','采摘体验':'#F2A62B','休闲娱乐':'#0EA5E9','研学教育':'#8B5CF6','人文文化':'#E05252','乡村文化':'#8B5CF6'};return m[t]||'#22B573'}
function spotBadge(s){if(s.tag==='HOT')return {icon:'🔥',label:'热门',cls:'hot'};if(s.tag==='RECOMMEND')return {icon:'⭐',label:'推荐',cls:'rec'};if(s.tag==='NEW')return {icon:'🆕',label:'新上线',cls:'new'};if(s.visitors>5000)return {icon:'🔥',label:'热门',cls:'hot'};return null}
// ===== 乡村文旅：内嵌 SVG 场景插画封面（无外网依赖，离线可用） =====
const _encCover = s => 'url("data:image/svg+xml,' + encodeURIComponent(s) + '") center/cover'
const _tourScenes = {
  // 果园/采摘：朝阳 + 果园果林
  orchard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd9a0"/><stop offset=".55" stop-color="#ffe9c6"/><stop offset="1" stop-color="#eef7e6"/></linearGradient><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fce6c"/><stop offset="1" stop-color="#4f9d43"/></linearGradient></defs><rect width="800" height="500" fill="url(#sky)"/><circle cx="630" cy="116" r="52" fill="#ffe08a" opacity=".95"/><circle cx="630" cy="116" r="32" fill="#ffd25e"/><path d="M0 340 Q210 292 430 344 T800 336 L800 500 L0 500 Z" fill="#a6da80"/><path d="M0 392 Q220 330 470 400 T800 390 L800 500 L0 500 Z" fill="url(#g)"/><g><rect x="118" y="360" width="12" height="62" rx="4" fill="#3f7d3a"/><circle cx="124" cy="350" r="36" fill="#5aa448"/><rect x="318" y="352" width="12" height="70" rx="4" fill="#3f7d3a"/><circle cx="324" cy="340" r="42" fill="#67b253"/><rect x="518" y="366" width="12" height="56" rx="4" fill="#3f7d3a"/><circle cx="524" cy="356" r="34" fill="#5aa448"/><rect x="690" y="356" width="12" height="66" rx="4" fill="#3f7d3a"/><circle cx="696" cy="346" r="38" fill="#67b253"/></g><g fill="#ffb3b3"><circle cx="124" cy="350" r="7"/><circle cx="138" cy="356" r="7"/><circle cx="112" cy="360" r="7"/><circle cx="324" cy="340" r="8"/><circle cx="342" cy="346" r="8"/><circle cx="312" cy="350" r="8"/><circle cx="524" cy="356" r="7"/><circle cx="538" cy="362" r="7"/><circle cx="696" cy="346" r="8"/><circle cx="712" cy="352" r="8"/><circle cx="684" cy="356" r="8"/></g></svg>`,
  // 荷塘/垂钓：蓝天 + 绿水 + 荷花 + 栈桥
  pond: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#aedcf4"/><stop offset="1" stop-color="#e8f7ff"/></linearGradient><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fd2d4"/><stop offset="1" stop-color="#45a5bd"/></linearGradient></defs><rect width="800" height="500" fill="url(#sky)"/><circle cx="160" cy="104" r="46" fill="#fff3c4"/><circle cx="160" cy="104" r="28" fill="#ffe184"/><path d="M0 306 Q200 256 430 306 T800 296 L800 336 L0 336 Z" fill="#a9d98a"/><rect y="336" width="800" height="164" fill="url(#w)"/><g fill="#3f9d6b"><ellipse cx="160" cy="386" rx="54" ry="20"/><ellipse cx="308" cy="424" rx="62" ry="23"/><ellipse cx="566" cy="392" rx="56" ry="21"/><ellipse cx="686" cy="444" rx="50" ry="19"/></g><g fill="#ff8fc2"><ellipse cx="308" cy="418" rx="15" ry="27"/><ellipse cx="566" cy="386" rx="14" ry="25"/><ellipse cx="686" cy="438" rx="13" ry="23"/></g><path d="M622 350 L662 350 L652 420 L632 420 Z" fill="#b98a5a"/><path d="M610 350 L622 350 L622 420 L610 420 Z" fill="#a57a4c"/></svg>`,
  // 研学：清晨田野 + 红瓦研学楼 + 旗帜
  study: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bde6ff"/><stop offset="1" stop-color="#f2fbff"/></linearGradient><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd06e"/><stop offset="1" stop-color="#55a348"/></linearGradient></defs><rect width="800" height="500" fill="url(#sky)"/><circle cx="600" cy="110" r="44" fill="#ffe08a"/><path d="M0 300 Q200 250 420 302 T800 296 L800 340 L0 340 Z" fill="#a6da80"/><path d="M0 360 Q220 306 480 366 T800 356 L800 500 L0 500 Z" fill="url(#f)"/><rect x="300" y="236" width="220" height="120" rx="4" fill="#fdf6ec"/><path d="M280 236 L410 176 L540 236 Z" fill="#d95a4a"/><rect x="360" y="300" width="40" height="56" fill="#8a5a3a"/><rect x="326" y="262" width="28" height="24" fill="#8ecff0"/><rect x="466" y="262" width="28" height="24" fill="#8ecff0"/><line x1="560" y1="236" x2="560" y2="176" stroke="#777" stroke-width="4"/><path d="M560 176 L600 184 L560 192 Z" fill="#e05252"/></svg>`,
  // 灯光音乐节：夜空 + 星 + 灯串 + 舞台光
  night: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2340"/><stop offset=".6" stop-color="#3a2f63"/><stop offset="1" stop-color="#5c3f6e"/></linearGradient></defs><rect width="800" height="500" fill="url(#sky)"/><circle cx="140" cy="104" r="40" fill="#fff3c4"/><circle cx="140" cy="104" r="28" fill="#ffe184"/><g fill="#fff" opacity=".8"><circle cx="80" cy="70" r="2"/><circle cx="240" cy="60" r="2"/><circle cx="360" cy="96" r="2"/><circle cx="480" cy="60" r="2"/><circle cx="600" cy="90" r="2"/><circle cx="720" cy="70" r="2"/><circle cx="660" cy="150" r="2"/><circle cx="300" cy="150" r="2"/></g><path d="M0 210 Q400 150 800 210" stroke="#8a5aa8" stroke-width="3" fill="none"/><g><circle cx="120" cy="196" r="7" fill="#ffd25e"/><circle cx="240" cy="183" r="7" fill="#ff8fc2"/><circle cx="360" cy="176" r="7" fill="#7fd8e8"/><circle cx="480" cy="176" r="7" fill="#ffd25e"/><circle cx="600" cy="183" r="7" fill="#ff8fc2"/><circle cx="680" cy="194" r="7" fill="#7fd8e8"/></g><path d="M0 360 Q400 320 800 360 L800 500 L0 500 Z" fill="#241f3a"/><rect x="330" y="330" width="140" height="50" rx="6" fill="#f2a62b" opacity=".9"/><path d="M250 470 L330 360 L470 360 L550 470 Z" fill="#e0e6f0" opacity=".2"/></svg>`,
  // 山景：晨雾 + 层峦
  mountain: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffdfa6"/><stop offset=".6" stop-color="#ffeac6"/><stop offset="1" stop-color="#eaf6f0"/></linearGradient></defs><rect width="800" height="500" fill="url(#sky)"/><circle cx="600" cy="120" r="50" fill="#ffe08a" opacity=".9"/><circle cx="600" cy="120" r="30" fill="#ffd25e"/><path d="M0 320 L160 190 L300 320 Z" fill="#a8c9d8" opacity=".6"/><path d="M180 330 L360 180 L540 330 Z" fill="#6f9fb8" opacity=".8"/><path d="M360 340 L540 200 L720 340 Z" fill="#4f8299"/><path d="M0 360 Q300 320 800 370 L800 500 L0 500 Z" fill="#3f6f52"/><path d="M0 410 Q400 360 800 420 L800 500 L0 500 Z" fill="#2f5a42"/></svg>`,
  // 田园民宿：黄昏小院 + 暖灯
  courtyard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc9a0"/><stop offset=".6" stop-color="#ffe0c0"/><stop offset="1" stop-color="#f7e8d0"/></linearGradient></defs><rect width="800" height="500" fill="url(#sky)"/><circle cx="150" cy="120" r="48" fill="#ffd25e" opacity=".9"/><path d="M0 360 Q220 310 440 360 T800 352 L800 500 L0 500 Z" fill="#9ccf78"/><rect x="300" y="240" width="230" height="130" rx="4" fill="#fdf3e3"/><path d="M280 240 L415 178 L550 240 Z" fill="#c96a4a"/><rect x="360" y="308" width="44" height="62" fill="#6f4a32"/><g fill="#ffd25e"><rect x="322" y="264" width="26" height="24"/><rect x="368" y="264" width="26" height="24"/><rect x="438" y="264" width="26" height="24"/><rect x="484" y="264" width="26" height="24"/></g><rect x="440" y="330" width="26" height="40" fill="#9cd0f0"/><g><circle cx="140" cy="300" r="34" fill="#5aa448"/><circle cx="620" cy="310" r="40" fill="#67b253"/></g><path d="M0 430 Q400 380 800 430 L800 500 L0 500 Z" fill="#b98a5a"/></svg>`,
  // 节庆：彩旗 + 舞台
  festival: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd9a0"/><stop offset=".55" stop-color="#ffe9c6"/><stop offset="1" stop-color="#fdf0d8"/></linearGradient></defs><rect width="800" height="500" fill="url(#sky)"/><circle cx="620" cy="112" r="50" fill="#ffe08a"/><circle cx="620" cy="112" r="30" fill="#ffd25e"/><path d="M0 380 Q300 330 800 380 L800 500 L0 500 Z" fill="#9ccf78"/><path d="M120 210 Q400 160 680 210" stroke="#c98a5a" stroke-width="3" fill="none"/><g><path d="M120 210 L140 250 L100 250 Z" fill="#e05252"/><path d="M240 194 L260 234 L220 234 Z" fill="#f2a62b"/><path d="M360 184 L380 224 L340 224 Z" fill="#22b573"/><path d="M480 184 L500 224 L460 224 Z" fill="#0ea5e9"/><path d="M600 194 L620 234 L580 234 Z" fill="#8b5cf6"/></g><rect x="320" y="330" width="160" height="52" rx="6" fill="#e05252"/><rect x="336" y="344" width="128" height="16" rx="8" fill="#fff" opacity=".9"/><g><circle cx="180" cy="380" r="30" fill="#ffd25e"/><circle cx="640" cy="390" r="26" fill="#ff8fc2"/></g></svg>`
}
function tourismCover(kind, type, name){
  const n = name || '', t = type || ''
  if (kind === 'bnb') {
    if (/山景|半山|观景/.test(n)) return _encCover(_tourScenes.mountain)
    if (/果园/.test(n)) return _encCover(_tourScenes.orchard)
    return _encCover(_tourScenes.courtyard)
  }
  if (t === '生态休闲' || t === '休闲娱乐' || /垂钓|荷虾|荷塘|渔家/.test(n)) return _encCover(_tourScenes.pond)
  if (t === '研学教育') return _encCover(_tourScenes.study)
  if (t === '节庆活动') return _encCover(_tourScenes.festival)
  if (t === '文化活动' || t === '人文文化' || /灯光|音乐|赏月|烟花|摄影展/.test(n)) return _encCover(_tourScenes.night)
  if (t === '自然风光' || /山景/.test(n)) return _encCover(_tourScenes.mountain)
  return _encCover(_tourScenes.orchard)
}

const dataMap = { lands, crops, records, irrigation: lands, pest: diseaseAlerts, overview: products, records2: livestock, feed: feedData, disease: diseaseAlerts, slaughter: slaughterData, products, spots: tSpots, bnbs: tBnBs, activities, env: envData }
const currentData = computed(() => dataMap[curSub.value] || [])
const filteredData = computed(() => { const f = filterText.value.toLowerCase(); if (!f) return currentData.value; return currentData.value.filter(d => Object.values(d).some(v => String(v).toLowerCase().includes(f))) })
const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize) || 1)
const pagedData = computed(() => filteredData.value.slice((page.value - 1) * pageSize, page.value * pageSize))

// Stats
const stats = computed(() => {
  const arr = currentData.value; const k = curSub.value
  if (k === 'lands') return [{ label: '地块总数', value: arr.length + '块', cls: '' }, { label: '总面积', value: arr.reduce((s, l) => s + (l.area || 0), 0) + '亩', cls: 'g' }, { label: '灌溉覆盖', value: arr.filter(l => l.irrigation).length + '块', cls: 'y' }]
  if (k === 'crops') return [{ label: '作物种类', value: arr.length + '种', cls: '' }, { label: '种植面积', value: arr.reduce((s, c) => s + (c.area || 0), 0) + '亩', cls: 'g' }]
  if (k === 'records') return [{ label: '农事记录总数', value: arr.length + '条', cls: '' }, { label: '施肥条数', value: arr.filter(r => r.type === '施肥').length + '条', cls: 'g' }, { label: '灌溉条数', value: arr.filter(r => r.type === '灌溉').length + '条', cls: 'y' }]
  if (k === 'irrigation') return [{ label: '灌溉地块', value: lands.filter(l=>l.irrigation).length+'块', cls: '' }, { label: '今日用水', value: '1,280 m³', cls: 'g' }, { label: '灌溉覆盖率', value: Math.round(lands.filter(l=>l.irrigation).length/lands.length*100)+'%', cls: 'y' }]
  if (k === 'records2') return [{ label: '🐟 养殖批次', value: livestock.length+' 批', cls: '' }, { label: '🐠 当前存栏', value: livestock.reduce((s,l)=>s+(l.count||0),0).toLocaleString()+' '+(livestock[0]?.unit||'尾'), cls: 'g' }, { label: '✅ 正常养殖', value: livestock.filter(l=>l.health==='正常').length+' 批', cls: 'g' }, { label: '⚠️ 异常预警', value: livestock.filter(l=>l.health!=='正常').length+' 批', cls: 'r' }]
  if (k === 'feed') return [{ label: '今日投喂', value: feedData.length+'次', cls: '' }, { label: '已完成', value: feedData.filter(f=>f.status==='已完成').length+'次', cls: 'g' }, { label: '进行中', value: feedData.filter(f=>f.status==='进行中').length+'次', cls: 'y' }]
  if (k === 'slaughter') return [{ label: '出栏批次', value: slaughterData.length+'批', cls: '' }, { label: '计划出栏', value: slaughterData.filter(s=>s.status!=='completed').length+'批', cls: 'y' }, { label: '已出栏', value: slaughterData.filter(s=>s.status==='completed').length+'批', cls: 'g' }]
if (k === 'foods') return [{ label: '总餐饮商户', value: foods.length+'家', cls: '' }, { label: '营业中', value: foods.filter(f=>f.status==='开放').length+'家', cls: 'g' }, { label: '推荐商户', value: foods.filter(f=>parseFloat(f.rating)>=4.7).length+'家', cls: 'y' }, { label: '累计浏览', value: foods.reduce((s,f)=>s+(f.visitors||0),0)+'次', cls: '' }]
  if (k === 'pest') return [{ label: '活跃预警', value: diseaseAlerts.filter(a=>a.status==='监控中').length+'条', cls: 'y' }, { label: '已处理', value: diseaseAlerts.filter(a=>a.status==='已处理').length+'条', cls: 'g' }]
  if (k === 'disease') return [{ label: '🦠 活跃预警', value: diseaseAlerts.filter(a=>a.status==='监控中'||a.status==='处理中').length+'条', cls: 'r' }, { label: '🔴 高风险', value: diseaseAlerts.filter(a=>a.risk==='高'||a.risk==='中风险').length+'条', cls: 'r' }, { label: '✅ 已处理', value: diseaseAlerts.filter(a=>a.status==='已处理').length+'条', cls: 'g' }]
  if (k === 'env') return [{ label: '监测批次', value: new Set(envData.map(e=>e.archiveId)).size+' 批', cls: '' }, { label: '正常记录', value: envData.filter(e=>e.status==='正常').length+' 条', cls: 'g' }, { label: '异常预警', value: envData.filter(e=>e.status!=='正常').length+' 项', cls: 'r' }, { label: '今日采集', value: envData.length+' 条', cls: '' }]
  if (k === 'overview') return [{ label: '在售商品', value: products.length+'种', cls: '' }, { label: '累计销量', value: products.reduce((s,p)=>s+p.sales,0)+'件', cls: 'g' }, { label: '销售额', value: '¥'+products.reduce((s,p)=>s+p.price*p.sales,0).toLocaleString(), cls: 'y' }]
  return [{ label: '总数', value: arr.length, cls: '' }]
})

const tableCols = computed(() => {
  const k = curSub.value
  if (k === 'lands') return ['名称', '面积(亩)', '土壤', '作物', '状态']
  if (k === 'crops') return ['名称', '品种', '播种日期', '周期', '面积', '阶段']
  if (k === 'records') return ['类型', '作物', '地块', '日期', '详情', '操作人']
  if (k === 'records2') return ['', '档案编号', '品种', '批次名称', '存栏数量', '养殖区域', '入栏日期', '生长阶段', '更新时间']
  if (k === 'irrigation') return ['地块', '灌水方式', '最近灌溉', '用水量', '状态']
  if (k === 'feed') return ['养殖区', '投喂方式', '时间', '投喂量', '状态']
  if (k === 'slaughter') return ['养殖批次', '养殖区', '品种', '出栏数量', '出栏日期', '均重', '总重', '单价', '销售金额', '买方', '状态']
  if (k === 'pest') return ['预警类型', '风险等级', '影响区域', '症状', '状态']
  if (k === 'disease') return ['预警类型', '风险等级', '影响区域', '症状', '状态']
  if (k === 'env') return ['记录时间', '档案编号', '批次名称', '养殖区域', '水温', 'pH', '溶解氧', '氨氮', '状态', '数据来源']
  if (k === 'foods') return ['店铺名称', '类型', '人均消费', '营业状态', '推荐', '浏览量']
  return ['名称', '状态']
})

function renderCell(r, ci) {
  const k = curSub.value
  if (k === 'lands') { const vals = [r.name, r.area, r.soil, r.crop, '<span class="tag ' + (r.status === '盛果期' || r.status === '采收中' ? 'g' : r.status === '已收割' ? 'dim' : 'b') + '">' + r.status + '</span>']; return vals[ci] || '--' }
  if (k === 'crops') { const vals = [r.name, r.variety, r.plantDate, r.cycle, r.area, r.stage]; return vals[ci] || '--' }
  if (k === 'records') { const vals = ['<span class="tag ' + (r.type === '施肥' ? 'b' : r.type === '灌溉' ? 'g' : r.type === '打药' ? 'r' : 'y') + '">' + r.type + '</span>', r.crop, r.plot, r.date, r.detail, r.operator]; return vals[ci] || '--' }
  if (k === 'records2') { const healthIcon={'正常':'🟢','观察中':'🟡','异常':'🔴'}; const stageColor={'成长期':'#22B573','育成期':'#0EA5E9','幼苗期':'#8B5CF6','育肥期':'#F2A62B','待出栏':'#E05252'}; const vals = [healthIcon[r.health]+' '+r.health, '<span style="color:#22B573;font-size:12px;cursor:pointer;text-decoration:underline" onclick="event.stopPropagation();window.__openArchiveDetail('+r.id+')">'+(r.batchNo||'--')+'</span>', '<span style="color:#1F2D3D;font-weight:500">'+r.type+'</span><div class="pd">'+r.breed+'</div>', r.batchName||'--', (r.count||0).toLocaleString()+' <span style="font-size:11px;color:#66788A">'+(r.unit||'尾')+'</span>', r.area||'--', r.startDate||'--', '<span class="tag" style="background:'+(stageColor[r.stage]||'#E3EAF0')+';color:#1F2D3D;font-size:10px">'+r.stage+'</span>', (r.updatedAt||'--').slice(0,10), '']; return vals[ci] || '--' }
  if (k === 'irrigation') { const vals = [r.name||'--', '滴灌', r.date||'2026-06-15', '180m³', '<span class="tag g">正常</span>']; return vals[ci] || '--' }
  if (k === 'feed') { const vals = [r.name||'--', r.type||'--', r.time||'--', r.amount||'--', '<span class="tag '+(r.status==='已完成'?'g':r.status==='进行中'?'y':'dim')+'">'+r.status+'</span>']; return vals[ci] || '--' }
  if (k === 'slaughter') { const tw=getSlaughterTotalWeight(r); const amt=getSlaughterAmount(r); const vals = [r.batchNo||'--', r.name||'--', r.breed||'--', (r.count||'--')+(r.unit||'头'), r.date||'--', r.avgWeight||r.weight||'--', (tw||'--')+(tw?'kg':''), r.price||'--', r.status==='completed'?'<span style="color:#22B573;font-weight:600">¥'+(amt||'--').toLocaleString()+'</span>':'<span style="color:#66788A">--</span>', r.buyer||'--', '<span class="tag '+(r.status==='completed'?'g':r.status==='transporting'?'b':r.status==='pending'?'y':'dim')+'">'+slaughterStatusLabel(r.status)+'</span>']; return vals[ci] || '--' }
  if (k === 'pest' || k === 'disease') { const vals = ['<span class="tag y">'+r.disease+'</span>', '<span class="tag '+(r.risk==='中风险'?'y':'g')+'">'+r.risk+'</span>', r.building, r.symptom, '<span class="tag '+(r.status==='监控中'?'y':'g')+'">'+r.status+'</span>']; return vals[ci] || '--' }
  if (k === 'env') { const statusIcon={'正常':'🟢','预警':'🟡','异常':'🔴'}; const statusCls={'正常':'g','预警':'y','异常':'r'}; const sourceIcon={'传感器自动采集':'🤖','农户手工记录':'👨','管理员补录':'👨‍💼'}; const vals = [(r.recordTime||'').slice(5,16), '<span style="color:#22B573;font-size:10px">'+(r.batchNo||'--')+'</span>', r.batchName||'--', r.area||'--', (r.waterTemp||'--')+'℃', (r.ph||'--'), (r.oxygen||'--')+' mg/L', (r.ammonia||'--')+' mg/L', '<span class="tag '+(statusCls[r.status]||'g')+'">'+(statusIcon[r.status]||'')+' '+r.status+'</span>', '<span class="t '+(r.source==='传感器自动采集'?'g':r.source==='农户手工记录'?'b':'dim')+'" style="font-size:8px">'+(sourceIcon[r.source]||'')+' '+(r.source==='传感器自动采集'?'自动采集':r.source==='农户手工记录'?'农户记录':'管理员')+'</span>', '']; return vals[ci] || '--' }
  if (k === 'foods') { const vals = ['<span style="color:#1F2D3D;font-weight:600">'+r.name+'</span>', r.type, '¥'+r.pricePer+'/人', '<span class="tag '+(r.status==='开放'?'g':'dim')+'">'+r.status+'</span>', '<span style="color:#F2A62B">⭐'+r.rating+'</span>', (r.visitors||0).toLocaleString(), '']; return vals[ci] || '--' }
  return r[tableCols.value[ci]] || '--'
}

// B&B computed
const totalBnBRooms = computed(() => tBnBs.reduce((s, b) => s + b.rooms, 0))
const totalBnBTodayIn = computed(() => tBnBs.reduce((s, b) => s + (b.todayIn || 0), 0))
const activeBnBOrders = computed(() => bnbOrders.filter(o => o.status === '已入住' || o.status === '待入住').length)
const avgBnBOccupancy = computed(() => Math.round(tBnBs.reduce((s, b) => s + parseInt(b.occupancy || '0'), 0) / tBnBs.length))
const totalBnBRevenue = computed(() => tBnBs.reduce((s, b) => { const v = parseFloat((b.revenue || '¥0').replace('¥', '').replace('万', '')); return s + v * 10000 }, 0))
const allBnBReviews = computed(() => { const revs = []; tBnBs.forEach(b => { if (b.reviews) b.reviews.forEach(r => revs.push({ bnb: b.name, ...r })) }); return revs })
const filteredBnBs = computed(() => { const f = bnbfilterText.value.toLowerCase(); if (!f) return tBnBs; return tBnBs.filter(b => Object.values(b).some(v => String(v).toLowerCase().includes(f))) })
const topProducts = computed(() => [...products].sort((a, b) => b.sales - a.sales).slice(0, 5))
const filteredProducts = computed(() => { const f = filterText.value.toLowerCase(); if (!f) return products; return products.filter(p => Object.values(p).some(v => String(v).toLowerCase().includes(f))) })
const pagedProducts = computed(() => filteredProducts.value.slice(0, pageSize))
const allOrders = computed(() => [...bnbOrders.map(o => ({ ...o, type: '民宿', by: o.guest, item: o.room, date: o.checkIn })), ...ecoOrders])

// CRUD
// ===== Form Modal System =====
const formOpen = ref(false)
const formTitle = ref('')
const formMode = ref('add')
const formEditId = ref(null)
// ===== 养殖记录（养殖档案详情中的养殖记录模块） =====
const detailLivestock = ref(null)
const breedingRecords = reactive([])
const brFormOpen = ref(false)
const brFormMode = ref('add')
const brFormEditId = ref(null)
const brForm = reactive({ type: '', content: '', recordTime: '', recorder: '' })
const brRecordTypes = ['投喂记录', '用药记录', '消毒记录', '转池记录', '死亡记录', '采样记录', '其他记录']
const brTypeIcon = { '投喂记录': '🍽️', '用药记录': '💊', '消毒记录': '🧹', '转池记录': '🔄', '死亡记录': '💀', '采样记录': '🔬', '其他记录': '📋' }
const brTypeColor = { '投喂记录': '#22B573', '用药记录': '#E05252', '消毒记录': '#0EA5E9', '转池记录': '#8B5CF6', '死亡记录': '#E05252', '采样记录': '#F2A62B', '其他记录': '#66788A' }
// 跨模块关联：环境监测记录
const relatedEnvRecords = computed(() => {
  if (!detailLivestock.value) return []
  return envData.filter(e => e.archiveId === detailLivestock.value.id)
})
// 跨模块关联：投喂记录
const relatedFeedRecords = computed(() => {
  if (!detailLivestock.value) return []
  return crossFeedData.filter(f => f.archiveId === detailLivestock.value.id)
})
// 养殖动态统计
const breedingDynamics = computed(() => {
  const l = detailLivestock.value
  if (!l) return { days: '--', survivalRate: '--', loss: '--', daysToHarvest: '--' }
  const calcDays = (dateStr) => {
    if (!dateStr) return null
    const d = new Date(dateStr.replace(/-/g, '/'))
    if (isNaN(d.getTime())) return null
    return Math.floor((new Date() - d) / (1000 * 60 * 60 * 24))
  }
  const daysSinceStart = calcDays(l.startDate)
  const daysToExpect = l.expectDate ? Math.floor((new Date(l.expectDate.replace(/-/g, '/')) - new Date()) / (1000 * 60 * 60 * 24)) : null
  const survivalRate = l.initialCount > 0 ? ((l.count / l.initialCount) * 100).toFixed(1) : '--'
  const loss = l.initialCount - l.count
  return {
    days: daysSinceStart !== null ? daysSinceStart + ' 天' : '--',
    survivalRate: survivalRate + '%',
    loss: loss >= 0 ? loss.toLocaleString() + ' ' + (l.unit || '尾') : '--',
    daysToHarvest: daysToExpect !== null ? (daysToExpect >= 0 ? daysToExpect + ' 天' : '已过 ' + Math.abs(daysToExpect) + ' 天') : '--'
  }
})
const form = reactive({ name:'', area:'', soil:'', location:'', crop:'', status:'', irrigation:'', manager:'', sensor:'' })
function resetForm() {
  Object.keys(form).forEach(k => form[k] = '')
  form.irrigation = '是'; form.status = '生长期'; form.type = '施肥'; form.weather = '晴'
  form.risk = '低风险'; form.stage = '生长期'; form.area = '100'; form.price = '188'; form.stock = '100'
  form.rooms = '6'; form.tickets = '0'; form.sensor = '在线'
}
function openAddForm() {
  resetForm(); formMode.value = 'add'; formEditId.value = null
  formTitle.value = '新增 ' + (subLabels[curSub.value]||'')
  formOpen.value = true
}
function openEditForm(id) {
  const arr = currentData.value; if (!arr) return
  const r = arr.find(x => x.id === id); if (!r) return
  resetForm(); formMode.value = 'edit'; formEditId.value = id
  formTitle.value = '编辑 ' + (subLabels[curSub.value]||'')
  if (curSub.value === 'records2') { Object.keys(r).forEach(k => { form[k] = r[k] }) }
  else { Object.keys(r).forEach(k => { if (k in form) form[k] = String(r[k]||'') }) }
  if (r.irrigation !== undefined) form.irrigation = r.irrigation ? '是' : '否'
  formOpen.value = true
}
async function submitForm() {
  const k = curSub.value; const m = formMode.value
  if (k === 'lands' || k === 'irrigation') {
    const obj = { id: m==='add'?uid():formEditId.value, name: form.name||'未命名', area: parseInt(form.area)||100, soil: form.soil||'褐土', location: form.location||'产业园', crop: form.crop||'--', status: form.status||'生长期', irrigation: form.irrigation==='是', manager: form.manager||'未分配', sensor: form.sensor||'在线', date: new Date().toISOString().split('T')[0] }
    if (m === 'add') lands.unshift(obj); else { const r = lands.find(x => x.id === formEditId.value); if (r) Object.assign(r, obj) }
  } else if (k === 'crops') {
    const obj = { id: m==='add'?uid():formEditId.value, name: form.name||'未命名', variety: form.variety||'--', plantDate: form.plantDate||'--', cycle: form.cycle||'--', expYield: '--', area: parseInt(form.area)||50, stage: form.stage||'生长期', fertilizer: form.fertilizer||'复合肥' }
    if (m === 'add') crops.unshift(obj); else { const r = crops.find(x => x.id === formEditId.value); if (r) Object.assign(r, obj) }
  } else if (k === 'records') {
    const obj = { id: m==='add'?uid():formEditId.value, type: form.type||'施肥', crop: form.crop||'--', plot: form.plot||'--', date: form.date||new Date().toISOString().split('T')[0], detail: form.detail||'--', operator: form.operator||'--', weather: form.weather||'晴' }
    if (m === 'add') records.unshift(obj); else { const r = records.find(x => x.id === formEditId.value); if (r) Object.assign(r, obj) }
  } else if (k === 'pest') {
    const obj = { date: new Date().toISOString().split('T')[0], building: form.building||'--', disease: form.disease||'未知', risk: form.risk||'低风险', symptom: form.symptom||'--', action: '待处理', status: '监控中' }
    if (m === 'add') diseaseAlerts.unshift(obj); else { const r = diseaseAlerts.find(x => x.date === formEditId.value); if (r) Object.assign(r, obj) }
  } else if (k === 'products') {
    const obj = { id: m==='add'?uid():formEditId.value, name: form.name||'未命名', cat: form.cat||'未分类', price: parseInt(form.price)||68, stock: parseInt(form.stock)||100, sales: 0, status: form.status||'上架' }
    if (m === 'add') products.unshift(obj); else { const r = products.find(x => x.id === formEditId.value); if (r) Object.assign(r, obj) }
  } else if (k === 'spots') {
    const obj = { id: m==='add'?uid():formEditId.value, name: form.name||'未命名', type: form.type||'农业观光', address: form.address||'', villageName: form.villageName||'中堰村', manager: form.manager||'', contact: form.contact||'', openingTime: form.openingTime||'', openStatus: form.openStatus||'open', bookingType: form.bookingType||'无需预约', desc: form.desc||'', cover: form.cover||'', tickets: parseInt(form.tickets)||0, visitors: 0, createdAt: new Date().toISOString().slice(0,10), updatedAt: new Date().toISOString().slice(0,10) }
    if (m === 'add') tSpots.unshift(obj); else { const r = tSpots.find(x => x.id === formEditId.value); if (r) Object.assign(r, obj) }
  } else if (k === 'bnbs') {
    const obj = { id: m==='add'?uid():formEditId.value, name: form.name||'未命名', owner: form.owner||'--', phone: form.phone||'--', rooms: parseInt(form.rooms)||6, price: parseInt(form.price)||188, rating: 5.0, bookings: 0, revenue: '¥0', occupancy: '0%', status: '营业中', since: new Date().toISOString().split('T')[0], desc: form.desc||'', tags: '', todayIn: 0, monthOrders: 0, rooms2: [], reviews: [], trend: [] }
    if (m === 'add') tBnBs.unshift(obj); else { const r = tBnBs.find(x => x.id === formEditId.value); if (r) Object.assign(r, obj) }
  } else if (k === 'activities') {
    const obj = { name: form.name||'未命名', date: form.date||'--', loc: form.loc||'--', joined: 0, limit: parseInt(form.limit)||100, status: form.status||'报名中' }
    if (m === 'add') activities.unshift(obj); else { const idx = activities.findIndex(x => x.id === formEditId.value); if (idx >= 0) { activities[idx].name = obj.name; activities[idx].date = obj.date; activities[idx].loc = obj.loc; activities[idx].limit = obj.limit; activities[idx].status = obj.status } }
  } else if (k === 'records2') {
    const obj = { id: m==='add'?uid():formEditId.value, batchNo:'ZY-SC-'+new Date().toISOString().slice(0,7).replace('-','')+'-'+String(Math.floor(Math.random()*900+100)), batchName:form.batchName||'未命名', category:form.category||'水产', type:form.type||'--', breed:form.breed||'--', initialCount:parseInt(form.initialCount)||0, count:parseInt(form.count)||0, unit:form.unit||'尾', area:form.area||'--', startDate:form.startDate||'--', expectDate:form.expectDate||'--', stage:form.stage||'成长期', health:form.health||'正常', source:form.source||'--', manager:form.manager||'--', phone:form.phone||'--', villageName:'中堰村', remark:form.remark||'', updatedAt:new Date().toISOString().slice(0,10) }
    if (m === 'add') {
      livestock.unshift(obj)
      // 异步调 API 持久化
      createLivestock(obj).then(res => {
        if (res && res.code === 200) refreshLivestockFromApi()
      }).catch(() => {})
    } else {
      const r = livestock.find(x => x.id === formEditId.value); if (r) Object.assign(r, obj)
      // 异步调 API 更新，成功后刷新获取服务端确认数据
      updateLivestock(formEditId.value, obj).then(res => {
        if (res && res.code === 200) refreshLivestockFromApi()
      }).catch(() => {})
    }
  } else if (k === 'slaughter') {
	    const obj = { id: m==='add'?uid():formEditId.value, name: form.name||'未命名', breed: form.breed||'--', count: parseInt(form.count)||0, date: form.date||'--', weight: form.weight||'--', price: form.price||'--', status: form.status||'待出栏' }
	    if (m === 'add') slaughterData.unshift(obj); else { const r = slaughterData.find(x => x.id === formEditId.value); if (r) Object.assign(r, obj) }
	  } else if (k === 'env') {
    const arch=livestock.find(l=>l.id===form.archiveId)
    const obj = { id: m==='add'?uid():formEditId.value, archiveId:form.archiveId||1, batchNo:arch?.batchNo||'--', batchName:arch?.batchName||'--', area:arch?.area||'--', waterTemp:parseFloat(form.waterTemp)||0, ph:parseFloat(form.ph)||0, oxygen:parseFloat(form.oxygen)||0, ammonia:parseFloat(form.ammonia)||0, turbidity:parseFloat(form.turbidity)||0, waterLevel:parseInt(form.waterLevel)||0, status:'正常', source:form.source||'农户手工记录', recordTime:form.recordTime||new Date().toISOString().replace('T',' ').slice(0,16), updatedAt:new Date().toISOString().replace('T',' ').slice(0,16), remark:form.remark||'' }
    if (m === 'add') envData.unshift(obj); else { const r = envData.find(x => x.id === formEditId.value); if (r) Object.assign(r, obj) }
  } else {
    const n = form.name; if (!n) { toast('请输入名称','warn'); return }
    if (m === 'add') { currentData.value.unshift({ id: uid(), name: n }) }
    else { const r = currentData.value.find(x => x.id === formEditId.value); if (r) r.name = n }
  }
  formOpen.value = false; toast(m==='add'?'已新增':'已更新', 'ok')
}
// Unified add/edit - all use modal form
function addItem() { openAddForm() }
function editItem(id) { openEditForm(id) }
function delItem(id) { if (!confirm('确定删除？')) return; const arr = currentData.value; if (!arr) return; const i = arr.findIndex(x => x.id === id); if (i >= 0) { arr.splice(i, 1); toast('已删除', 'ok') }
  // 养殖档案同步删除到后端
  if (curSub.value === 'records2') { deleteLivestock(id).catch(() => {}) }
}

// ===== 养殖记录 CRUD（养殖档案详情抽屉内） =====
const BR_STORAGE_KEY = 'ind_breeding_records'

async function loadBreedingRecordsForArchive(archiveId) {
  breedingRecords.splice(0, breedingRecords.length)
  try {
    const res = await listBreedingRecords(archiveId)
    if (res && res.code === 200 && Array.isArray(res.data)) {
      breedingRecords.splice(0, breedingRecords.length, ...res.data)
      saveBrToLocal(archiveId)
      return
    }
  } catch(e) { /* 后端未启动，从 localStorage 加载 */ }
  loadBrFromLocal(archiveId)
}

function loadBrFromLocal(archiveId) {
  try {
    const raw = localStorage.getItem(BR_STORAGE_KEY)
    if (!raw) return
    const all = JSON.parse(raw)
    const list = all[String(archiveId)] || []
    breedingRecords.splice(0, breedingRecords.length, ...list)
  } catch(e) {}
}

function saveBrToLocal(archiveId) {
  try {
    const raw = localStorage.getItem(BR_STORAGE_KEY)
    const all = raw ? JSON.parse(raw) : {}
    all[String(archiveId)] = [...breedingRecords]
    localStorage.setItem(BR_STORAGE_KEY, JSON.stringify(all))
  } catch(e) {}
}

function openBrAddForm() {
  brFormMode.value = 'add'; brFormEditId.value = null
  brForm.type = '投喂记录'; brForm.content = ''; brForm.recorder = ''
  const now = new Date()
  brForm.recordTime = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')+' '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0')
  brFormOpen.value = true
}

function openBrEditForm(r) {
  brFormMode.value = 'edit'; brFormEditId.value = r.id
  brForm.type = r.type || '投喂记录'; brForm.content = r.content || ''
  brForm.recordTime = r.recordTime || ''; brForm.recorder = r.recorder || ''
  brFormOpen.value = true
}

async function submitBrForm() {
  if (!brForm.content.trim()) { toast('请输入记录内容', 'warn'); return }
  const arch = detailLivestock.value
  if (!arch) return
  const now = new Date(); const ts = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')+' '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0')
  const obj = {
    archiveId: arch.id, batchNo: arch.batchNo, batchName: arch.batchName,
    type: brForm.type || '其他记录', content: brForm.content,
    recordTime: brForm.recordTime || ts, recorder: brForm.recorder || arch.manager || '管理员', createdAt: ts
  }
  if (brFormMode.value === 'add') {
    const tempId = Date.now()
    obj.id = tempId
    breedingRecords.unshift(obj)
    brFormOpen.value = false; toast('已新增养殖记录', 'ok')
    try {
      const res = await createBreedingRecord(obj)
      if (res && res.code === 200 && res.data) {
        const idx = breedingRecords.findIndex(x => x.id === tempId)
        if (idx >= 0) breedingRecords[idx] = res.data
      }
    } catch(e) {}
    saveBrToLocal(arch.id)
  } else {
    const idx = breedingRecords.findIndex(x => x.id === brFormEditId.value)
    if (idx >= 0) {
      obj.id = brFormEditId.value
      breedingRecords[idx] = obj
    }
    brFormOpen.value = false; toast('已更新养殖记录', 'ok')
    try { await updateBreedingRecord(brFormEditId.value, obj) } catch(e) {}
    saveBrToLocal(arch.id)
  }
}

async function deleteBrRecord(id) {
  if (!confirm('确定删除该养殖记录？')) return
  const idx = breedingRecords.findIndex(x => x.id === id)
  if (idx >= 0) { breedingRecords.splice(idx, 1); toast('已删除', 'ok') }
  try { await deleteBreedingRecord(id) } catch(e) {}
  if (detailLivestock.value) saveBrToLocal(detailLivestock.value.id)
}

// B&B specific delete (handles tBnBs directly)
function delBnb(id) { if (!confirm('确定删除？')) return; const i = tBnBs.findIndex(x => x.id === id); if (i >= 0) { tBnBs.splice(i, 1); toast('已删除', 'ok') } }

// Product/Spot delete
function delProduct(id) { if (!confirm('确定删除？')) return; const i = products.findIndex(x => x.id === id); if (i >= 0) { products.splice(i, 1); toast('已删除', 'ok') } }

// Activity add (simple, uses its own page)
function addActivity() {
  resetForm(); formMode.value = 'add'; formEditId.value = null
  formTitle.value = '新增活动'; formOpen.value = true
}
// Activity submit handled in submitForm with generic else branch

// B&B order add
function addBnbOrder() { const g = prompt('游客姓名：'); if (!g) return; bnbOrders.unshift({ id: 'ORD'+Date.now().toString(36).toUpperCase(), guest: g, bnb: prompt('民宿：','田园居')||'田园居', room: prompt('房型：','标准间')||'标准间', checkIn: prompt('入住日期：',new Date().toISOString().split('T')[0])||'--', checkOut: prompt('退房日期：',new Date(Date.now()+86400000*2).toISOString().split('T')[0])||'--', amount: parseInt(prompt('金额：','188'))||188, status: '待入住', phone: '--' }); toast('已新增', 'ok') }
function batchShip() { const cnt = ecoOrders.filter(o=>o.status==='待发货').length; ecoOrders.filter(o=>o.status==='待发货').forEach(o=>o.status='已发货'); toast('已批量发货 '+cnt+' 单', 'ok') }
async function exportOrders() {
  const all = allOrders.value
  if (!all.length) { toast('没有订单数据', 'warn'); return }
  const headers = ['订单号','类型','项目','买家','金额','日期','状态'];
  const rows = all.map(o => {
    const type = o.type || (o.bnb ? '民宿' : '商品');
    const item = o.item || o.room || o.product || o.bnb || '--';
    const buyer = o.by || o.guest || '--';
    const amt = o.amount || 0;
    const date = o.date || o.checkIn || '--';
    return [o.id, type, item, buyer, amt, date, o.status || '--']
  });
  const esc = v => '"' + String(v || '').replace(/"/g, '""') + '"';
  const csv = '﻿' + headers.join(',') + '\n' + rows.map(r => r.map(esc).join(',')).join('\n');
  const filename = '订单报表_' + new Date().toISOString().slice(0,10) + '.csv';
  // Try native save dialog first
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({ suggestedName: filename, types: [{ description: 'CSV文件', accept: { 'text/csv': ['.csv'] } }] });
      const writable = await handle.createWritable();
      await writable.write(csv);
      await writable.close();
      toast('已导出 ' + all.length + ' 条订单', 'ok');
      return;
    } catch(e) { if (e.name === 'AbortError') return; }
  }
  // Fallback for browsers without File System Access API
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
  toast('已导出 ' + all.length + ' 条订单', 'ok');
}

const lives = reactive([
  { id:1, title:'中堰苹果专场', host:'黄雪琳书记', time:'2026-07-20 19:00', duration:'2h', views:3200, sales:12800, status:'预告' },
  { id:2, title:'深山核桃采摘直播', host:'赵大哥', time:'2026-07-15 10:00', duration:'1.5h', views:5600, sales:25600, status:'已结束' },
  { id:3, title:'蜂糖李热卖专场', host:'李婶', time:'2026-07-18 15:00', duration:'3h', views:8900, sales:35800, status:'进行中' }
])
const filteredLives = computed(() => {
  const f = filterText.value.toLowerCase(); if (!f) return lives
  return lives.filter(l => [l.title,l.host,l.status].some(v => String(v).toLowerCase().includes(f)))
})
const pagedLives = computed(() => filteredLives.value.slice(0, 50))

function addLive() {
  const n = prompt('直播主题：'); if (!n) return
  const host = prompt('主播：','管理员') || '管理员'
  const time = prompt('时间：',new Date().toISOString().slice(0,16)) || ''
  const dur = prompt('时长：','2h') || '2h'
  lives.unshift({ id:Date.now(), title:n, host, time, duration:dur, views:0, sales:0, status:'预告' })
  toast('已创建直播','ok')
}
function editLive(id) {
  const l = lives.find(x=>x.id===id); if (!l) return
  l.title = prompt('主题：',l.title) || l.title
  l.host = prompt('主播：',l.host) || l.host
  l.status = prompt('状态(预告/进行中/已结束)：',l.status) || l.status
  toast('已更新','ok')
}
function delLive(id) { if(!confirm('确定删除？'))return; const i=lives.findIndex(x=>x.id===id); if(i>=0){lives.splice(i,1);toast('已删除','ok')} }
function exportLives() {
  const csv='主题,主播,时间,时长,观看,销售额,状态\n'+lives.map(l=>[l.title,l.host,l.time,l.duration,l.views,l.sales,l.status].join(',')).join('\n')
  downloadCSV('﻿'+csv,'直播数据_'+new Date().toISOString().slice(0,10)+'.csv')
}
function exportAnalytics() {
  const csv='指标,数值\n累计销售额,'+products.reduce((s,x)=>s+x.price*x.sales,0)+'\n总销量,'+products.reduce((s,x)=>s+x.sales,0)+'件\n在售商品,'+products.filter(p=>p.status==='上架').length+'款\n直播场次,'+lives.length+'场\n订单总数,'+(ecoOrders.length+bnbOrders.length)+'单'
  downloadCSV('﻿'+csv,'经营报表_'+new Date().toISOString().slice(0,10)+'.csv')
}

// Spots export
function exportSpots() {
  if (!tSpots.length) { toast('没有景区数据', 'warn'); return }
  const esc = v => '"' + String(v || '').replace(/"/g, '""') + '"'
  const csv = '﻿名称,类型,门票,累计游客,状态\n' + tSpots.map(s => [s.name, s.type, s.tickets||0, s.visitors, s.status].map(esc).join(',')).join('\n')
  downloadCSV(csv, '景区数据_' + new Date().toISOString().slice(0,10) + '.csv')
}
// Bnbs export
function exportBnbs() {
  if (!tBnBs.length) { toast('没有民宿数据', 'warn'); return }
  const esc = v => '"' + String(v || '').replace(/"/g, '""') + '"'
  const csv = '﻿民宿名称,负责人,电话,房间数,均价,评分,预订数,月营收,入住率,状态\n' + tBnBs.map(b => [b.name, b.owner, b.phone, b.rooms, b.price, b.rating, b.bookings, b.revenue, b.occupancy, b.status].map(esc).join(',')).join('\n')
  downloadCSV(csv, '民宿数据_' + new Date().toISOString().slice(0,10) + '.csv')
}
// Activities export
function exportActivities() {
  if (!activities.length) { toast('没有活动数据', 'warn'); return }
  const esc = v => '"' + String(v || '').replace(/"/g, '""') + '"'
  const csv = '﻿活动名称,日期,地点,已报名,限额,状态\n' + activities.map(a => [a.name, a.date, a.loc, a.joined, a.limit, a.status].map(esc).join(',')).join('\n')
  downloadCSV(csv, '活动数据_' + new Date().toISOString().slice(0,10) + '.csv')
}

// Generic CSV download with save dialog
function downloadCSV(csv, filename) {
  if (window.showSaveFilePicker) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    window.showSaveFilePicker({ suggestedName: filename, types: [{ description: 'CSV', accept: { 'text/csv': ['.csv'] } }] })
      .then(handle => handle.createWritable().then(w => w.write(csv).then(() => w.close())))
      .then(() => toast('导出成功', 'ok'))
      .catch(e => { if (e.name !== 'AbortError') fallbackDownload(blob, filename) })
  } else {
    fallbackDownload(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), filename)
  }
}
function fallbackDownload(blob, filename) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click(); URL.revokeObjectURL(a.href); toast('导出成功', 'ok')
}

// Detail/Drawer
const foodFilterText=ref(''),foodCat=ref(''),foodCats=[{v:'',l:'全部'},{v:'农家菜',l:'农家菜'},{v:'特色小吃',l:'特色小吃'},{v:'采摘体验',l:'采摘体验'},{v:'时令美食',l:'时令美食'}]
const filteredFoods=computed(()=>{let l=foods;const f=foodFilterText.value.toLowerCase();if(f)l=l.filter(x=>x.name.toLowerCase().includes(f)||(x.desc||'').toLowerCase().includes(f));if(foodCat.value)l=l.filter(x=>x.type===foodCat.value);return l})
function showFoodDetail(f){drawerData.value={"店铺名称":f.name,"类型":f.type,"评分":f.rating,"人均":"¥"+f.pricePer+"/人","营业时间":f.openTime||"--","地址":f.address||"中堰村","联系电话":f.phone||"--","推荐菜品":(f.specialDishes||[]).join("、"),"店铺介绍":f.desc||"--","配套服务":(f.facilities||[]).join("、"),"浏览量":(f.visitors||0)+"次"};drawerTitle.value=f.name;drawerOpen.value=true} 
function showDetail(r) {
  if (curSub.value === 'env') {
    drawerData.value = {'id':r.id,'📋 记录时间':r.recordTime||'--','📋 数据来源':r.source||'--','📋 监测状态':r.status||'--','🐟 档案编号':r.batchNo||'--','🐟 批次名称':r.batchName||'--','🐟 养殖区域':r.area||'--','🌡 水温':(r.waterTemp||'--')+' ℃','🧪 pH':r.ph||'--','💧 溶解氧':(r.oxygen||'--')+' mg/L','⚠️ 氨氮':(r.ammonia||'--')+' mg/L','🌊 浊度':(r.turbidity||'--')+' NTU','📏 水位':(r.waterLevel||'--')+' %','📝 备注':r.remark||'--','🕐 更新时间':r.updatedAt||'--'}
  } else if (curSub.value === 'lands') {
    drawerData.value = { id: r.id, '地块名称': r.name || '--', '面积': (r.area || '--') + ' 亩', '土壤类型': r.soil || '--', '位置': r.location || '--', '种植作物': r.crop || '--', '生长阶段': r.status || '--', '负责人': r.manager || '--', '灌溉状态': r.irrigation ? '✅ 已覆盖' : '❌ 未覆盖', '传感器状态': r.sensor || '--', '建档日期': r.date || '--' }
  } else if (curSub.value === 'records2') {
    detailLivestock.value = r
    loadBreedingRecordsForArchive(r.id)
    drawerData.value = null
  } else {
    drawerData.value = r
  }
  if (curSub.value === 'records2') { drawerTitle.value = r.batchNo+' · '+r.batchName } else { drawerTitle.value = subLabels[curSub.value] + ' — ' + (r.name || r.title || r.type || '') }; drawerOpen.value = true
}
function showBnbDetail(id) { const b = tBnBs.find(x => x.id === id); if (!b) return; drawerData.value = {'民宿名称':b.name,'类型':bnbType(b),'⭐ 评分':starRating(b.rating)+' '+b.rating,'💰 价格':'¥'+b.price+' 起/晚','🕗 营业时间':b.openTime||'--','👥 可住人数':'2-4人 · '+b.rooms+'间房','📍 地址':b.address||'中堰村','👤 房东':b.owner||'--','📞 联系电话':b.phone||'--','📝 介绍':b.desc||'--','🏷 特色':(b.tags||'--'),'🚗 距景区':b._dist||'--','📊 累计入住':(b.bookings||0)+'人'}; drawerTitle.value = b.name; drawerOpen.value = true }

const actFilterText=ref(''),actCat=ref(''),actCats=[{v:'',l:'全部'},{v:'_open',l:'报名中'},{v:'节庆活动',l:'节庆活动'},{v:'采摘体验',l:'采摘体验'},{v:'文化活动',l:'文化活动'},{v:'研学教育',l:'研学教育'}]
function actStatusLabel(s){const m={open:'🟢 报名中',upcoming:'🟡 即将开始',ended:'🔴 已结束'};return m[s]||s}
const filteredActs=computed(()=>{let l=activities;const f=actFilterText.value.toLowerCase();if(f)l=l.filter(a=>a.name.toLowerCase().includes(f)||(a.desc||'').toLowerCase().includes(f));if(actCat.value==='_open')l=l.filter(a=>a.status==='open');else if(actCat.value)l=l.filter(a=>a.type===actCat.value);return l})
const actDetail=ref(null)
function showActDetail(a){actDetail.value=a;drawerTitle.value=a.name;drawerOpen.value=true}

const signupOpen=ref(false),signupSuccess=ref(false),signupForm=reactive({name:"",phone:"",count:1,remark:"",agree:false})
function openSignup(a){if(!a||a.status!=='open'){toast(a&&a.limitPeople&&a.currentPeople>=a.limitPeople?'人数已满':'暂未开放报名','warn');return}Object.assign(signupForm,{name:"",phone:"",count:1,remark:"",agree:false});signupSuccess.value=false;signupOpen.value=true}
const regIdCounter=ref(1000)
const registrations=reactive([])
function submitSignup(){if(!signupForm.name.trim()){toast('请输入姓名','warn');return}if(!signupForm.phone.trim()){toast('请输入联系电话','warn');return}if(!signupForm.agree){toast('请阅读并同意活动须知','warn');return}if(actDetail.value&&actDetail.value.limitPeople&&(actDetail.value.currentPeople||0)+signupForm.count>actDetail.value.limitPeople){toast('报名人数超过上限','warn');return}
signupSuccess.value=true;const a=actDetail.value
if(a){a.currentPeople=(a.currentPeople||0)+signupForm.count
const no='BM'+new Date().toISOString().slice(0,10).replace(/-/g,'')+String(++regIdCounter.value).padStart(3,'0')
registrations.unshift({id:regIdCounter.value,no,activityId:a.id,activityName:a.name,villageName:a.villageName||'中堰村',name:signupForm.name,phone:signupForm.phone,count:signupForm.count,remark:signupForm.remark||'',status:'pending',statusLabel:'待确认',createdAt:new Date().toISOString().replace('T',' ').slice(0,16),handledBy:'',handledAt:'',adminRemark:''})}
setTimeout(()=>{signupOpen.value=false;toast('报名已提交，等待工作人员确认','ok')},2000)}

const regListView=ref(false),regDetail=ref(null),regDetailOpen=ref(false)
function confirmReg(r){r.status='confirmed';r.statusLabel='已确认';r.handledAt=new Date().toISOString().replace('T',' ').slice(0,16);toast('已确认报名','ok')}
function cancelReg(r){r.status='cancelled';r.statusLabel='已取消';r.handledAt=new Date().toISOString().replace('T',' ').slice(0,16);if(!r.adminRemark)r.adminRemark=prompt('取消原因：')||'';const a=activities.find(x=>x.id===r.activityId);if(a)a.currentPeople=Math.max(0,(a.currentPeople||0)-r.count);toast('已取消报名','warn')}
function completeReg(r){r.status='completed';r.statusLabel='已完成';r.handledAt=new Date().toISOString().replace('T',' ').slice(0,16);toast('已标记完成','ok')}
function showRegDetail(r){regDetail.value=r;regDetailOpen.value=true}
function regStatusCls(s){const m={pending:'y',confirmed:'g',cancelled:'r',completed:'dim'};return m[s]||'dim'}

// ECharts

function initPestCharts(){
  const el1=document.getElementById('chart_pest_trend')
  if(el1){
    const c=echarts.init(el1)
    var td=[2,3,5,1,4,2,6,3,5,2,4,3,5,1,4,2,3,5,2,4,3,5,1,3,2,4,1,5,3,2]
    c.setOption({tooltip:{trigger:'axis',backgroundColor:'#FFFFFF',borderColor:'rgba(34,181,115,0.30)',textStyle:{color:'#475867',fontSize:10}},grid:{left:8,right:16,top:8,bottom:20},xAxis:{type:'category',data:Array.from({length:30},(_,i)=>String(i+1)),axisLabel:{color:'#66788A',fontSize:7}},yAxis:{type:'value',axisLabel:{color:'#66788A',fontSize:9},splitLine:{lineStyle:{color:'#EBEFF4'}}},series:[{type:'line',data:td,smooth:true,lineStyle:{color:'#E05252',width:2},itemStyle:{color:'#E05252'},symbol:'none'}]})
  }
  const el2=document.getElementById('chart_pest_pie')
  if(el2){
    const c=echarts.init(el2)
    var pd=[{value:15,name:'稻瘟病',itemStyle:{color:'#E05252'}},{value:9,name:'猪呼吸道',itemStyle:{color:'#F2A62B'}},{value:7,name:'蚜虫',itemStyle:{color:'#0EA5E9'}},{value:5,name:'球虫病',itemStyle:{color:'#22B573'}},{value:3,name:'霜霉病',itemStyle:{color:'#8B5CF6'}}]
    c.setOption({tooltip:{trigger:'item',backgroundColor:'#FFFFFF',borderColor:'rgba(34,181,115,0.30)',textStyle:{color:'#475867',fontSize:10}},series:[{type:'pie',radius:['55%','78%'],center:['50%','52%'],itemStyle:{borderColor:'#FFFFFF',borderWidth:2},label:{color:'#66788A',fontSize:9},data:pd}]})
}}
function initChart() {
  if (chartInstance) { chartInstance.dispose(); chartInstance = null }
  if (window._chartInst) { window._chartInst.forEach(c=>{try{c.dispose()}catch(e){}}); window._chartInst=[] }
  nextTick(() => {
    if (curSub.value === 'pest') { initPestCharts(); return }
    const k = curSub.value
    if (k === 'overview') initPieChart('chart_overview', products.map(p => ({ value: p.sales, name: p.name })))
    else if (k === 'products') initPieChart('chart_products', products.map(p => ({ value: p.sales, name: p.name })))
    else if (k === 'lands') initPieChart('chart_lands', lands.map(l => ({ value: l.area, name: l.name })))
    else if (k === 'crops') initPieChart('chart_crops', [{ value: 100, name: '果实膨大期' }, { value: 150, name: '果实膨大期' }, { value: 50, name: '着色期' }, { value: 150, name: '开花期' }])
    else if (k === 'records') initPieChart('chart_records', [{ value: 2, name: '施肥' }, { value: 1, name: '灌溉' }, { value: 1, name: '打药' }, { value: 1, name: '修剪' }])
    else if (k === 'records2') initLivestockChart()
    else if (k === 'monitor') { const el = document.getElementById('chart_monitor'); if (el) { chartInstance = echarts.init(el); const bars = []; for (let i = 0; i < 24; i++) bars.push({ value: 35 + Math.random() * 65, itemStyle: { color: '#22B573' } }); chartInstance.setOption({ grid: { left: 4, right: 4, top: 8, bottom: 4 }, xAxis: { show: false, data: Array.from({ length: 24 }, (_, i) => i) }, yAxis: { show: false }, series: [{ type: 'bar', barWidth: '70%', data: bars, itemStyle: { borderRadius: [2, 2, 0, 0], opacity: 0.8 } }] }) } }
    else if (k === 'env') { const el = document.getElementById('chart_env'); if (el) { chartInstance = echarts.init(el); chartInstance.setOption({ grid: { left: 4, right: 4, top: 8, bottom: 4 }, xAxis: { show: false, data: envData.map(d => d.recordTime) }, yAxis: { show: false }, series: [{ type: 'bar', barWidth: '60%', data: envData.map(d => ({ value: 40 + (d.waterTemp - 25) * 15, itemStyle: { color: '#22B573' } })), itemStyle: { borderRadius: [2, 2, 0, 0], opacity: 0.7 } }] }) } }
  })
}
function initPieChart(id, data) {
  const el = document.getElementById(id); if (!el) return
  const colors = ['#0EA5E9', '#22B573', '#F2A62B', '#E05252', '#0EA5E9', '#22B573']
  chartInstance = echarts.init(el)
  chartInstance.setOption({
    tooltip: { trigger: 'item', backgroundColor: '#FFFFFF', borderColor: 'rgba(34,181,115,0.30)', textStyle: { color: '#475867', fontSize: 10 } },
    series: [{ type: 'pie', radius: ['50%', '72%'], center: ['50%', '50%'], itemStyle: { borderColor: '#FFFFFF', borderWidth: 2 }, label: { color: '#66788A', fontSize: 9 }, data: data.map((d, i) => ({ ...d, itemStyle: { color: colors[i % colors.length] } })) }]
  })
}
function initLivestockChart() {
  const el = document.getElementById('chart_records2'); if (!el) return
  chartInstance = echarts.init(el)
  var g1=new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#F2A62B'},{offset:1,color:'rgba(245,158,11,.2)'}])
  var g2=new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#22B573'},{offset:1,color:'rgba(34,181,115,0.20)'}])
  var g3=new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#0EA5E9'},{offset:1,color:'rgba(139,92,246,.2)'}])
  chartInstance.setOption({
    tooltip:{trigger:'axis',backgroundColor:'#FFFFFF',borderColor:'rgba(34,181,115,0.30)',textStyle:{color:'#475867',fontSize:10}},
    grid:{left:8,right:20,top:10,bottom:24},
    xAxis:{type:'category',data:['澳洲淡水龙虾','鲈鱼','罗非鱼'],axisLabel:{color:'#66788A',fontSize:9}},
    yAxis:{type:'value',name:'尾',axisLabel:{color:'#66788A',fontSize:9},splitLine:{lineStyle:{color:'#EBEFF4'}}},
    series:[{type:'bar',barWidth:28,itemStyle:{borderRadius:[3,3,0,0]},data:[
      {value:80000,itemStyle:{color:g1}},
      {value:5000,itemStyle:{color:g2}},
      {value:30000,itemStyle:{color:g3}}
    ]}]
  })
}

watch([curMod, curSub], () => { chartInstance && chartInstance.dispose(); chartInstance=null; nextTick(() => initChart()) })
// ===== LocalStorage persistence =====
const STORAGE_KEY = 'ind_data'
function saveAllData() {
  const data = { lands: [...lands], crops: [...crops], records: [...records], products: [...products], tSpots: [...tSpots], tBnBs: [...tBnBs], livestock: [...livestock], feedData: [...feedData], slaughterData: [...slaughterData], bnbOrders: [...bnbOrders], ecoOrders: [...ecoOrders], activities: [...activities], foods: [...foods], diseaseAlerts: [...diseaseAlerts], uidCounter }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
// 从后端 API 加载养殖档案（失败则静默回退到 localStorage）
async function loadLivestockFromApi() {
  try {
    const res = await listLivestock()
    if (res && res.code === 200 && Array.isArray(res.data) && res.data.length > 0) {
      livestock.splice(0, livestock.length, ...res.data)
    }
  } catch(e) { /* 后端未启动，使用 localStorage 数据 */ }
}

// 从 API 刷新养殖档案列表（保存后调用，获取服务端确认数据）
async function refreshLivestockFromApi() {
  try {
    const res = await listLivestock()
    if (res && res.code === 200 && Array.isArray(res.data)) {
      livestock.splice(0, livestock.length, ...res.data)
    }
  } catch(e) { /* 静默失败，本地数据已更新 */ }
}


// ═══════════ 出栏管理独立逻辑 ═══════════
// Status labels
const SLABEL = { completed:'已完成', pending:'待出栏', transporting:'运输中', planned:'计划出栏' }
function slaughterStatusLabel(s) { return SLABEL[s] || s || '--' }
function slaughterStatusTag(s) { return 'tag '+(s==='completed'?'g':s==='transporting'?'b':s==='pending'?'y':'dim') }
// Normalize slaughter data: migrate old statuses + fill missing fields (call after loadAllData)
function normalizeSlaughterData() {
  const statusMap = { '已出栏':'completed','育肥中':'planned','待出栏':'pending','运输中':'transporting','计划出栏':'planned','已完成':'completed' }
  slaughterData.forEach(item => {
    // Migrate old Chinese status → English enum
    if (statusMap[item.status]) item.status = statusMap[item.status]
    // Fill missing fields with defaults
    if (!item.archiveId && item.archiveId !== 0) item.archiveId = ''
    if (!item.batchNo) item.batchNo = '--'
    if (!item.unit) item.unit = '头'
    item.count = parseInt(item.count) || 0
    if (!item.buyer) item.buyer = ''
    if (!item.buyerPhone) item.buyerPhone = ''
    if (!item.transport) item.transport = ''
    if (!item.plateNo) item.plateNo = ''
    if (!item.quarantineNo) item.quarantineNo = ''
    if (!item.remark) item.remark = ''
  })
}
// Dynamic computation helpers
function getSlaughterTotalWeight(r) {
  const cnt = parseInt(r.count) || 0
  const w = parseFloat(r.avgWeight) || 0
  return cnt > 0 && w > 0 ? Math.round(cnt * w) : 0
}
function getSlaughterAmount(r) {
  const tw = getSlaughterTotalWeight(r)
  const p = parseFloat(r.price) || 0
  return tw > 0 && p > 0 ? Math.round(tw * p) : 0
}
const slaughterFilter = ref('')
const filteredSlaughter = computed(() => {
  if (!slaughterFilter.value) return slaughterData
  return slaughterData.filter(s => s.status === slaughterFilter.value)
})

const slaughterStats = computed(() => {
  const completed = slaughterData.filter(s => s.status === 'completed')
  const totalCount = completed.reduce((sum, s) => sum + (parseInt(s.count) || 0), 0)
  const totalRevenue = completed.reduce((sum, s) => sum + getSlaughterAmount(s), 0)
  const totalWeight = completed.reduce((sum, s) => sum + getSlaughterTotalWeight(s), 0)
  const avgPrice = totalWeight > 0 ? (totalRevenue / totalWeight).toFixed(1) + '元/kg' : '--'
  const units = [...new Set(completed.map(s => s.unit).filter(Boolean))]
  const unitLabel = units.length === 1 ? units[0] : (units.length > 1 ? '头/只' : '')
  return {
    totalBatches: slaughterData.length,
    completedBatches: completed.length,
    pendingBatches: slaughterData.filter(s => s.status !== 'completed').length,
    totalCount: totalCount > 0 ? totalCount + unitLabel : '0',
    totalRevenue: totalRevenue.toLocaleString(),
    avgPrice
  }
})

// Slaughter detail drawer
const slaughterDetailOpen = ref(false), slaughterDetail = ref(null)
function showSlaughterDetail(r) { slaughterDetail.value = r; slaughterDetailOpen.value = true }

// Slaughter form
const slaughterFormOpen = ref(false), slaughterFormMode = ref('add'), slaughterFormEditId = ref(null)
const slaughterForm = reactive({
  archiveId: '', name: '', breed: '', count: '', unit: '头', date: '',
  avgWeight: '', totalWeight: '', price: '', amount: '', buyer: '', buyerPhone: '',
  transport: '', plateNo: '', quarantineNo: '', status: 'planned', remark: ''
})
const slaughterLinkedArchive = computed(() => {
  if (!slaughterForm.archiveId) return null
  const arch = livestock.find(l => l.id === slaughterForm.archiveId)
  if (arch) {
    const start = arch.startDate ? new Date(arch.startDate) : null
    arch._days = start ? Math.floor((new Date() - start) / 86400000) : '--'
  }
  return arch || null
})
const slaughterStockWarning = computed(() => {
  if (!slaughterLinkedArchive.value || !slaughterForm.count) return false
  return parseInt(slaughterForm.count) > (parseInt(slaughterLinkedArchive.value.count) || 0)
})

function openSlaughterAdd() {
  slaughterFormMode.value = 'add'; slaughterFormEditId.value = null
  Object.assign(slaughterForm, { archiveId: '', name: '', breed: '', count: '', unit: '头', date: '', avgWeight: '', totalWeight: '', price: '', amount: '', buyer: '', buyerPhone: '', transport: '', plateNo: '', quarantineNo: '', status: 'planned', remark: '' })
  slaughterFormOpen.value = true
}
function editSlaughter(id) {
  const r = slaughterData.find(x => x.id === id)
  if (!r) return
  slaughterFormMode.value = 'edit'; slaughterFormEditId.value = id
  Object.assign(slaughterForm, {
    archiveId: r.archiveId || '', name: r.name || '', breed: r.breed || '', count: r.count || '', unit: r.unit || '头', date: r.date || '',
    avgWeight: parseFloat(r.avgWeight) || parseFloat(r.weight) || '', totalWeight: getSlaughterTotalWeight(r) || '', price: parseFloat(r.price) || '', amount: getSlaughterAmount(r) || '',
    buyer: r.buyer || '', buyerPhone: r.buyerPhone || '', transport: r.transport || '', plateNo: r.plateNo || '',
    quarantineNo: r.quarantineNo || '', status: r.status || 'planned', remark: r.remark || ''
  })
  slaughterFormOpen.value = true
}
function onSlaughterArchiveChange() {
  const arch = slaughterLinkedArchive.value
  if (arch) {
    slaughterForm.name = arch.area || ''
    slaughterForm.breed = (arch.type || '') + ' · ' + (arch.breed || '')
    slaughterForm.unit = arch.unit || '头'
  }
}
function calcSlaughterTotal() {
  const tw = getSlaughterTotalWeight(slaughterForm)
  slaughterForm.totalWeight = tw || ''
  calcSlaughterAmount()
}
function calcSlaughterAmount() {
  slaughterForm.amount = getSlaughterAmount(slaughterForm) || ''
}
function submitSlaughterForm() {
  if (!slaughterForm.archiveId) { alert('请选择养殖批次'); return }
  if (!slaughterForm.count || parseInt(slaughterForm.count) <= 0) { alert('请输入有效出栏数量'); return }
  if (slaughterStockWarning.value) { alert('出栏数量超过当前存栏数量，请检查'); return }
  const arch = slaughterLinkedArchive.value
  const avgW = parseFloat(slaughterForm.avgWeight) || 0
  const pr = parseFloat(slaughterForm.price) || 0
  const tw = getSlaughterTotalWeight(slaughterForm)
  const amt = getSlaughterAmount(slaughterForm)
  const obj = {
    id: slaughterFormMode.value === 'add' ? uid() : slaughterFormEditId.value,
    archiveId: slaughterForm.archiveId,
    batchNo: arch?.batchNo || '--',
    name: slaughterForm.name || arch?.area || '未命名',
    breed: slaughterForm.breed || '--',
    count: parseInt(slaughterForm.count) || 0,
    unit: slaughterForm.unit || '头',
    date: slaughterForm.date || new Date().toISOString().slice(0, 10),
    avgWeight: avgW || '--',
    totalWeight: tw || 0,
    price: pr || '--',
    amount: amt || 0,
    buyer: slaughterForm.buyer || '',
    buyerPhone: slaughterForm.buyerPhone || '',
    transport: slaughterForm.transport || '',
    plateNo: slaughterForm.plateNo || '',
    quarantineNo: slaughterForm.quarantineNo || '',
    status: slaughterForm.status || 'planned',
    remark: slaughterForm.remark || ''
  }
  if (slaughterFormMode.value === 'add') {
    slaughterData.unshift(obj)
  } else {
    const r = slaughterData.find(x => x.id === slaughterFormEditId.value)
    if (r) Object.assign(r, obj)
  }
  slaughterFormOpen.value = false
  toast('出栏记录已保存', 'ok')
}
function delSlaughter(id) {
  if (!confirm('确定删除该出栏记录？')) return
  const idx = slaughterData.findIndex(x => x.id === id)
  if (idx >= 0) slaughterData.splice(idx, 1)
  slaughterDetailOpen.value = false
  toast('已删除', 'ok')
}
async function exportSlaughter() {
  const csv = '养殖批次,养殖区,品种,出栏数量,单位,出栏日期,均重,总重kg,单价,销售金额,买方,买方电话,运输方式,车牌,检疫编号,状态\n' +
    slaughterData.map(r => [r.batchNo,r.name,r.breed,r.count,r.unit,r.date,r.avgWeight,getSlaughterTotalWeight(r),r.price,getSlaughterAmount(r),r.buyer,r.buyerPhone,r.transport,r.plateNo,r.quarantineNo,SLABEL[r.status]||r.status].join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
  // 优先使用 File System Access API 弹出"另存为"对话框
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: '出栏记录.csv',
        types: [{ description: 'CSV文件', accept: { 'text/csv': ['.csv'] } }]
      })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
      toast('已导出', 'ok')
      return
    } catch (e) {
      if (e.name === 'AbortError') { toast('已取消导出', 'info'); return }
      // 其他错误：降级到自动下载
    }
  }
  // 降级：不支持 showSaveFilePicker 的浏览器（Firefox/Safari）自动下载
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = '出栏记录.csv'; a.click(); URL.revokeObjectURL(a.href)
  toast('已导出（浏览器不支持选择路径，已保存到默认下载目录）', 'ok')
}

function loadAllData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const data = JSON.parse(raw)
    lands.splice(0, lands.length, ...(data.lands||[]))
    crops.splice(0, crops.length, ...(data.crops||[]))
    records.splice(0, records.length, ...(data.records||[]))
    products.splice(0, products.length, ...(data.products||[]))
    tSpots.splice(0, tSpots.length, ...(data.tSpots||[]))
    tBnBs.splice(0, tBnBs.length, ...(data.tBnBs||[]))
    livestock.splice(0, livestock.length, ...(data.livestock||[]))
    if (data.feedData) feedData.splice(0, feedData.length, ...data.feedData)
    if (data.slaughterData) slaughterData.splice(0, slaughterData.length, ...data.slaughterData)
    bnbOrders.splice(0, bnbOrders.length, ...(data.bnbOrders||[]))
    ecoOrders.splice(0, ecoOrders.length, ...(data.ecoOrders||[]))
    activities.splice(0, activities.length, ...(data.activities||[]))
    diseaseAlerts.splice(0, diseaseAlerts.length, ...(data.diseaseAlerts||[]))
    uidCounter = data.uidCounter || 300
    return true
  } catch(e) { return false }
}

// Auto-save after mutations
watch([lands, crops, records, products, tSpots, tBnBs, livestock, feedData, slaughterData, bnbOrders, ecoOrders, activities, diseaseAlerts], () => { saveAllData() }, { deep: true })

// Hash routing
function handleHash() {
  const hash = window.location.hash.replace('#', '')
  if (!hash) return
  const parts = hash.split('/')
  if (parts.length >= 3) {
    const mod = parts[1], sub = parts[2]
    if (subMap[mod] && subMap[mod].includes(sub)) {
      curMod.value = mod; curSub.value = sub; page.value = 1; filterText.value = ''
    }
  }
}
// hashchange handled by router

// onMounted handled by main app
</script>

<style scoped>
@import '@/../public/design-tokens.css';
.ind-page { min-height: 100vh; background: #F5F7FA; color: #475867; display: flex; flex-direction: column; }
.hdr { flex-shrink: 0; height: 48px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; background: linear-gradient(180deg, #FFFFFF, #FFFFFF); border-bottom: 1px solid rgba(0,0,0,0.06); color: #475867; }
.hdr-l { font-size: 14px; font-weight: 700; color: #1F2D3D; letter-spacing: 1px; display: flex; align-items: center; gap: 10px; }
.hdr-l a { color: #66788A; text-decoration: none; font-size: 13px; }
.hdr-r { display: flex; align-items: center; gap: 14px; font-size: 10px; color: #66788A; }
.hdr-r a { color: #66788A; text-decoration: none; }

.mod-tabs { flex-shrink: 0; display: flex; background: #FFFFFF; border-bottom: 1px solid #EBEFF4; padding: 0 16px; }
.mod-tabs button { padding: 8px 18px; font-size: 12px; font-weight: 600; cursor: pointer; color: #66788A; border-bottom: 2px solid transparent; transition: all .2s; background: none; border-top: none; border-left: none; border-right: none; letter-spacing: .5px; font-family: inherit; }
.mod-tabs button:hover { color: #475867; }
.mod-tabs button.on { color: #22B573; border-bottom-color: #22B573; }

.sub-tabs { flex-shrink: 0; display: flex; padding: 0 16px; background: #FFFFFF; }
.sub-tabs button { padding: 4px 14px; font-size: 11px; font-weight: 500; cursor: pointer; color: #66788A; transition: all .2s; background: none; border: none; border-bottom: 2px solid transparent; font-family: inherit; }
.sub-tabs button:hover { color: #475867; }
.sub-tabs button.on { color: #22B573; border-bottom-color: #22B573; }

.content { flex: 1; overflow-y: auto; padding: 14px 18px; min-height: 0; }
.content::-webkit-scrollbar { width: 4px; }
.content::-webkit-scrollbar-thumb { background: rgba(34,181,115,0.12); border-radius: 2px; }
.bc { font-size: 10px; color: #66788A; margin-bottom: 4px; }
.bc a { color: #66788A; text-decoration: none; }
.bc span { color: #22B573; }
.pg-tt { font-size: 28px; font-weight: 700; color: #1F2D3D; margin-bottom: 12px; }

.srow { display: flex; gap: 14px; margin-bottom: 14px; flex-wrap: wrap; }
.scard { flex: 1; min-width: 130px; height: 145px; padding: 24px; display: flex; justify-content: space-between; align-items: flex-start; background: #FFFFFF; border: 1px solid #E3EAF0; border-radius: 10px; box-sizing: border-box; box-shadow: inset 0 0 18px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.04); transition: transform .2s, border-color .2s, box-shadow .2s; }
.scard:hover { border-color: #22B573; box-shadow: inset 0 0 22px rgba(0,0,0,0.05), 0 0 16px rgba(34,181,115,0.16); transform: translateY(-2px); }
.scard .sv { font-size: 30px; font-weight: 700; color: #22B573; font-family: "SF Mono", Consolas, monospace; }
.scard .sl { font-size: 16px; color: #66788A; margin-top: 2px; }
.scard.g .sv { color: #22B573; }
.scard.y .sv { color: #F2A62B; }
.scard.r .sv { color: #E05252; }

.panel { background: #FFFFFF; backdrop-filter: blur(12px); border: 1px solid #E3EAF0; border-radius: 10px; padding: 14px 18px; margin-bottom: 14px; box-shadow: inset 0 0 18px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.04); }
.panel .tt { font-size: 13px; font-weight: 700; color: #1F2D3D; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; letter-spacing: 1px; }
.panel .tt::before { content: ''; width: 3px; height: 13px; border-radius: 2px; background: #22B573; }

/* Module cards */
.module-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px; padding: 14px 16px 20px; }
.module-card { position: relative; min-height: 218px; display: flex; flex-direction: column; width: 100%; background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%); border: 1px solid #E3EAF0; border-radius: 10px; padding: 22px 22px 18px; box-sizing: border-box; box-shadow: inset 0 0 18px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.04); transition: transform .2s, border-color .2s, box-shadow .2s; cursor: pointer; }
.module-card:hover { transform: translateY(-2px); border-color: #22B573; box-shadow: inset 0 0 22px rgba(0,0,0,0.05), 0 0 16px rgba(34,181,115,0.16); }
.module-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: #E3EAF0; font-size: 28px; margin-bottom: 16px; }
.module-title { margin: 0 0 8px; color: #1F2D3D; font-size: 22px; font-weight: 700; line-height: 1.3; }
.module-desc { min-height: 44px; margin: 0 0 16px; color: #66788A; font-size: 14px; line-height: 1.55; }
.module-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; }
.module-tag { display: inline-flex; align-items: center; height: 25px; padding: 0 11px; color: #22B573; font-size: 13px; border-radius: 14px; background: rgba(34,181,115,0.10); border: 1px solid rgba(34,181,115,0.10); }

.toolbar { display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap; align-items: center; }
.toolbar .spacer { flex: 1; }
.toolbar input { padding: 6px 10px; border-radius: 8px; font-size: 11px; font-family: inherit; background: rgba(34,181,115,0.06); border: 1px solid #E3EAF0; color: #475867; outline: none; width: 200px; }

table { width: 100%; border-collapse: collapse; font-size: 14px; }
th, td { padding: 8px 12px; text-align: left; font-size: 13px; }
th { background: #FFFFFF; font-weight: 600; color: #66788A; border-bottom: 2px solid #E3EAF0; font-size: 13px; }
td { border-bottom: 1px solid #EBEFF4; }
tr:hover td { background: #EBEFF4; cursor: pointer; }

.tag { display: inline-block; padding: 3px 10px; border-radius: 10px; font-size: 12px; font-weight: 600; }
.tag.g { background: rgba(34,181,115,0.15); color: #22B573; }
.tag.b { background: rgba(34,181,115,0.12); color: #22B573; }
.tag.y { background: rgba(242,166,43,0.15); color: #F2A62B; }
.tag.r { background: rgba(224,82,82,0.15); color: #E05252; }
.tag.dim { background: #E3EAF0; color: #66788A; }

.btn { display: inline-block; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; font-family: inherit; }
.btn-p { background: linear-gradient(135deg, #22B573, #1BA366); color: #fff; box-shadow: 0 2px 8px rgba(34,181,115,0.20); }
.btn-o { background: transparent; border: 1px solid #D0D8E2; color: #22B573; }
.btn-d { background: rgba(224,82,82,0.15); border: 1px solid rgba(224,82,82,0.25); color: #E05252; }
.btn-s { padding: 4px 10px; font-size: 11px; }

.pg { display: flex; justify-content: flex-end; gap: 4px; margin-top: 10px; font-size: 12px; align-items: center; }
.pg-btn { padding: 4px 10px; border-radius: 6px; background: rgba(34,181,115,0.06); border: 1px solid #E3EAF0; color: #66788A; cursor: pointer; }
.pg-btn:hover { color: #475867; }

.drawer-overlay { position: fixed; inset: 0; z-index: 90; background: rgba(0,0,0,.5); opacity: 0; pointer-events: none; transition: opacity .3s; }
.drawer-overlay.on { opacity: 1; pointer-events: auto; }
.drawer { position: fixed; top: 0; right: 0; bottom: 0; width: 460px; z-index: 100; background: #FFFFFF; border-left: 1px solid #E3EAF0; transform: translateX(100%); transition: transform .3s cubic-bezier(.4,0,.2,1); display: flex; flex-direction: column; box-shadow: -8px 0 32px rgba(0,0,0,.4); }
.drawer.on { transform: translateX(0); }
.drawer-hd { flex-shrink: 0; padding: 14px 18px; border-bottom: 1px solid #E3EAF0; display: flex; justify-content: space-between; align-items: center; }
.drawer-hd h3 { font-size: 16px; font-weight: 700; color: #1F2D3D; }
.drawer-close { width: 28px; height: 28px; border-radius: 50%; border: 1px solid #E3EAF0; background: #F0F3F8; color: #475867; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; }
.drawer-bd { flex: 1; overflow-y: auto; padding: 16px 18px; }

.tl-item { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px solid #EBEFF4; align-items: flex-start; }
.tl-dot { width: 8px; height: 8px; border-radius: 50%; background: #22B573; flex-shrink: 0; margin-top: 4px; }
.tl-dot.g { background: #22B573; }
.tl-dot.y { background: #F2A62B; }
.tl-content { flex: 1; font-size: 13px; }
.tl-content .tlt { color: #1F2D3D; font-weight: 600; }
.tl-content .tld { color: #66788A; font-size: 12px; margin-top: 1px; }
.tl-content .tltm { color: #66788A; font-size: 11px; }

.alert-item { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 8px; background: #FFFFFF; font-size: 13px; }

.fld { margin-bottom: 10px; }
.fld label { display: block; font-size: 13px; color: #66788A; margin-bottom: 4px; }
.fld input, .fld select, .fld textarea { width: 100%; padding: 8px 10px; border-radius: 8px; font-size: 13px; font-family: inherit; background: rgba(34,181,115,0.06); border: 1px solid #E3EAF0; color: #475867; outline: none; }
.fld input:focus, .fld select:focus, .fld textarea:focus { border-color: #22B573; }

/* Valve control cards */
.valve-card { height: 78px; background: linear-gradient(180deg, #FFFFFF, #FFFFFF); border: 1px solid #E3EAF0; border-radius: 10px; padding: 0 18px; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box; }
.valve-info { display: flex; align-items: center; gap: 12px; }
.valve-icon { font-size: 26px; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: #E3EAF0; border-radius: 10px; flex-shrink: 0; }
.valve-name { font-weight: 600; color: #1F2D3D; font-size: 16px; line-height: 1.2; }
.valve-desc { font-size: 13px; color: #66788A; margin-top: 1px; }
.valve-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
.valve-btn { padding: 5px 16px; border-radius: 14px; border: none; cursor: pointer; font-size: 12px; font-weight: 600; color: #475867; background: #E3EAF0; transition: all .2s; white-space: nowrap; }
.valve-btn.on { background: linear-gradient(135deg, #22B573, #1BA366); color: #fff; box-shadow: 0 2px 10px rgba(34,181,115,0.25); }
.valve-btn:hover { opacity: 0.9; }
.valve-runtime { font-size: 11px; color: #66788A; min-width: 70px; text-align: right; }
.valve-card { cursor: pointer; }
.valve-card.selected { border-color: #22B573 !important; box-shadow: 0 0 16px rgba(34,181,115,0.16); }
.valve-detail-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.vd-item { background: #FFFFFF; padding: 12px; border-radius: 8px; }
.vd-label { display: block; font-size: 12px; color: #66788A; margin-bottom: 4px; }
.vd-val { font-size: 24px; font-weight: 700; color: #1F2D3D; }
.vd-highlight { color: #22B573 !important; }
.vd-on { color: #22B573 !important; }
.vd-off { color: #66788A !important; }
.npk-bar { flex: 1; background: #FFFFFF; border-radius: 8px; padding: 10px; position: relative; overflow: hidden; }
.npk-fill { position: absolute; left: 0; bottom: 0; height: 4px; background: linear-gradient(90deg, #22B573, #22B573); border-radius: 2px; transition: width .6s; }
.npk-label { font-size: 13px; color: #475867; position: relative; z-index: 1; }
.frow { display: flex; gap: 10px; }
.frow .fld { flex: 1; }
.fl { margin-bottom: 10px; } .fl label { display: block; font-size: 13px; color: #66788A; margin-bottom: 4px; }
.fin { width: 100%; padding: 8px 10px; border-radius: 8px; font-size: 13px; font-family: inherit; background: rgba(34,181,115,0.06); border: 1px solid #E3EAF0; color: #475867; outline: none; box-sizing: border-box; }
.fin:focus { border-color: #22B573; }
.fl2 { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #66788A; cursor: pointer; }
.ds-title { font-size: 14px; font-weight: 700; color: #22B573; margin: 12px 0 8px; padding-bottom: 4px; border-bottom: 1px solid #E3EAF0; }
.dg3 { background: #FFFFFF; padding: 10px; border-radius: 8px; margin-bottom: 6px; }
.dl3 { display: block; font-size: 9px; color: #22B573; margin-bottom: 3px; }
.dg3 div:last-child { font-size: 12px; color: #475867; }
.tb{width:100%;border-collapse:collapse}.tb th,.tb td{padding:8px 10px;text-align:left;font-size:12px}.tb th{background:#FFFFFF;color:#66788A;border-bottom:2px solid #E3EAF0}.tb td{border-bottom:1px solid #EBEFF4}.tb tr:hover td{background:#EBEFF4}.pd{font-size:11px;color:#66788A;margin-top:1px}
.toast { padding: 10px 18px; border-radius: 6px; font-size: 12px; font-weight: 600; color: #fff; pointer-events: auto; animation: ti .3s ease, to .3s ease 2s forwards; }
.toast.ok { background: linear-gradient(135deg, #22B573, #22B573); }
.toast.info { background: linear-gradient(135deg, #22B573, #22B573); }
.toast.warn { background: linear-gradient(135deg, #F2A62B, #F2A62B); }
@keyframes ti { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes to { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }

/* ========== OVERRIDE: 统一图二卡片风格 ========== */
:deep(.stat-card),
:deep(.scard),
:deep(.module-card),
:deep(.feature-card),
:deep(.business-card),
:deep(.industry-card),
:deep(.srow > div),
.scard,
.module-card,
.stat-card,
.srow > div {
  background: #FFFFFF !important;
  border: 1px solid #E3EAF0 !important;
  border-radius: 10px !important;
  box-shadow: none !important;
  min-height: auto;
  padding: 22px !important;
  box-sizing: border-box !important;
}

.stat-card,
.scard {
  min-height: auto;
  height: 145px;
  padding: 24px !important;
}

:deep(.module-card:hover),
:deep(.scard:hover),
:deep(.stat-card:hover),
.module-card:hover,
.scard:hover,
.stat-card:hover {
  border-color: #22B573 !important;
  transform: translateY(-2px);
}

:deep(.srow),
:deep(.module-grid),
.srow,
.module-grid {
  gap: 14px !important;
}

.stat-grid {
  gap: 14px !important;
}
.spot-card{background:#FFFFFF;border:1px solid #E3EAF0;border-radius:10px;overflow:hidden;cursor:pointer;transition:.2s}.spot-card:hover{border-color:#22B573;transform:translateY(-2px)}
.spot-cover{height:220px;position:relative;display:flex;align-items:center;justify-content:center;border-radius:10px 10px 0 0;overflow:hidden}
.spot-cover-icon{font-size:56px;opacity:.5}
.spot-badge{position:absolute;top:10px;left:10px;color:#fff;font-size:10px;padding:3px 10px;border-radius:12px;font-weight:600}.spot-badge.hot{background:rgba(242,166,43,0.88)}.spot-badge.rec{background:rgba(34,181,115,0.88)}.spot-badge.new{background:rgba(14,165,233,0.88)}
.spot-cover-status{position:absolute;bottom:8px;right:8px;font-size:10px;padding:3px 10px;border-radius:10px;background:rgba(0,0,0,.55);color:#fff}
.spot-card-name{font-size:18px;font-weight:700;color:#1F2D3D;margin-bottom:2px}
.spot-tag{display:inline-block;font-size:11px;padding:1px 8px;border-radius:10px;border:1px solid;font-weight:500}
.spot-card-rating{font-size:12px;color:#F2A62B;font-weight:600;margin-bottom:6px}
.spot-card-desc{font-size:14px;color:#66788A;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:4px}
.spot-card{display:flex;flex-direction:column}
.spot-detail-cover{height:120px;display:flex;align-items:center;justify-content:center;border-radius:8px;margin-bottom:10px}.spot-detail-icon{font-size:48px;opacity:.5}
.spot-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}
.spot-info-item{background:#FFFFFF;border-radius:8px;padding:10px;display:flex;align-items:center;gap:8px}.spot-info-icon{font-size:18px;flex-shrink:0}.spot-info-label{font-size:13px;color:#475867;font-weight:600}.spot-info-sub{font-size:11px;color:#66788A;margin-bottom:2px}
.spot-contact-row{display:flex;flex-direction:column;gap:10px;padding:12px 0;margin:8px 0}
.spot-desc-card{background:#FFFFFF;border-radius:8px;padding:12px;margin:8px 0}
.spot-fac-icon{display:inline-flex;align-items:center;gap:3px;font-size:14px}
.spot-stat-card{flex:1;background:#FFFFFF;border-radius:8px;padding:10px 12px;text-align:center}
.spot-detail-actions{display:flex;gap:8px;padding-top:10px;border-top:1px solid #EBEFF4;margin-top:10px;flex-wrap:wrap}
/* 养殖动态卡片 */
.dyn-card{flex:1;min-width:100px;padding:12px;background:#FFFFFF;border:1px solid #E3EAF0;border-radius:8px;text-align:center}
.dyn-card.g{border-color:rgba(34,181,115,0.25)}.dyn-card.r{border-color:rgba(224,82,82,0.25)}.dyn-card.y{border-color:rgba(242,166,43,0.25)}
.dyn-val{font-size:24px;font-weight:700;color:#1F2D3D;font-family:"SF Mono",Consolas,monospace}
.dyn-card.g .dyn-val{color:#22B573}.dyn-card.r .dyn-val{color:#E05252}.dyn-card.y .dyn-val{color:#F2A62B}
.dyn-label{font-size:12px;color:#66788A;margin-top:4px}
/* 养殖记录列表项 */
.br-item{padding:10px 12px;margin-bottom:6px;background:#FFFFFF;border-left:3px solid #22B573;border-radius:0 6px 6px 0}
.br-form-box{padding:10px 12px;margin-bottom:8px;background:rgba(34,181,115,0.04);border:1px solid #E3EAF0;border-radius:8px}
/* 子标题 */
.ds-sub-title{font-size:14px;font-weight:600;color:#22B573;margin-bottom:8px}
/* 养殖档案字号（与其余智慧养殖子页面对齐：表格13/统计22） */
.liv-arch th,.liv-arch td{font-size:13px}
.liv-arch .btn{font-size:13px}
.liv-arch .btn-s{font-size:12px}
.liv-arch .pg{font-size:12px}
.liv-arch .tag{font-size:12px}
.liv-arch .toolbar input{font-size:12px}
.liv-arch .pd{font-size:12px}
.liv-arch .scard .sv{font-size:22px}
.liv-arch .scard .sl{font-size:12px}
/* ===== 地块管理驾驶舱 ===== */
.land-head { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.land-head .land-banner { flex: 1; font-size: 15px; font-weight: 700; padding: 9px 14px; border-radius: 6px; background: rgba(34,181,115,0.08); border-left: 3px solid #22B573; color: #1F2D3D; }
.land-stats .scard { height: 100px !important; padding: 14px 18px !important; }
.land-stats .scard .sv { font-size: 24px; }
.land-stats .scard .sl { font-size: 13px; }
.land-mid { display: grid; grid-template-columns: 1.25fr 1fr; gap: 14px; align-items: stretch; }
.land-mid .panel { margin-bottom: 0; }
.land-map { width: 100%; height: auto; display: block; border-radius: 8px; }
.land-plot { cursor: pointer; }
.land-plot rect { transition: fill-opacity .18s, stroke-width .18s; }
.land-plot:hover rect { fill-opacity: 0.32; stroke-width: 2.5; }
.land-plot.sel rect { fill-opacity: 0.36; stroke-width: 3; }
.land-plot.sel { filter: drop-shadow(0 0 6px rgba(34,181,115,0.25)); }
.lp-name { font-size: 13px; font-weight: 700; fill: #1F2D3D; }
.lp-meta { font-size: 10px; fill: #66788A; }
.lp-n { font-size: 10px; fill: #8aa36f; font-weight: 600; }
.land-legend { display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: center; margin-top: 10px; }
.lg-hint { font-size: 11px; color: #66788A; }
.lg-items { display: flex; flex-wrap: wrap; gap: 6px 12px; margin-left: auto; }
.lg-item { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; color: #475867; }
.lg-item i { width: 8px; height: 8px; border-radius: 2px; display: inline-block; }
.land-sub-tt { font-size: 12px; font-weight: 700; color: #475867; margin-bottom: 8px; }
.crop-bars { display: flex; flex-direction: column; gap: 7px; }
.crop-bar-row { display: flex; align-items: center; gap: 8px; }
.crop-name { width: 84px; flex-shrink: 0; font-size: 11px; color: #475867; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.crop-track { flex: 1; height: 8px; background: #EBEFF4; border-radius: 4px; overflow: hidden; }
.crop-fill { height: 100%; border-radius: 4px; }
.crop-area { width: 40px; flex-shrink: 0; text-align: right; font-size: 11px; color: #66788A; font-family: "SF Mono", Consolas, monospace; }
.status-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.status-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #F5F7FA; border: 1px solid #E3EAF0; border-radius: 8px; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; }
.status-name { font-size: 12px; color: #475867; }
.status-count { font-size: 12px; font-weight: 700; color: #1F2D3D; }
.land-pick { border-top: 1px solid #EBEFF4; padding-top: 12px; }
.lp-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.lp-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #fff; flex-shrink: 0; }
.lp-head-t { min-width: 0; }
.lp-title { font-size: 14px; font-weight: 700; color: #1F2D3D; }
.lp-loc { font-size: 10px; color: #66788A; margin-top: 1px; }
.lp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.lp-item { background: #F5F7FA; border-radius: 8px; padding: 8px 10px; }
.lp-k { display: block; font-size: 9px; color: #66788A; margin-bottom: 2px; }
.lp-v { font-size: 12px; font-weight: 600; color: #1F2D3D; }
.land-archive { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.land-card { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: #FFFFFF; border: 1px solid #E3EAF0; border-radius: 10px; cursor: pointer; transition: border-color .2s, box-shadow .2s; }
.land-card:hover { border-color: #22B573; box-shadow: 0 4px 16px rgba(34,181,115,0.12); }
.lc-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
.lc-body { flex: 1; min-width: 0; }
.lc-row { display: flex; align-items: center; gap: 8px; }
.lc-name { font-size: 14px; font-weight: 700; color: #1F2D3D; }
.lc-meta { font-size: 11px; color: #66788A; margin: 3px 0 5px; }
.lc-fields { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 11px; color: #475867; }
.lc-sensor.on { color: #22B573; }
.lc-sensor.off { color: #E05252; }
.lc-sensor.na { color: #66788A; }
.lc-view { flex-shrink: 0; }
.land-empty { grid-column: 1 / -1; text-align: center; color: #66788A; font-size: 12px; padding: 20px; }
@media (max-width: 1100px) {
  .land-mid { grid-template-columns: 1fr; }
  .land-archive { grid-template-columns: 1fr; }
}
</style>
