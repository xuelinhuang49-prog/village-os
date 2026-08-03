<template>
<div class="ind-page" :class="{embedded}">
<header class="hdr" v-if="!embedded"><div class="hdr-l"><router-link to="/dashboard">&#9664; 返回驾驶舱</router-link> &#127981; 数字产业中心</div><div class="hdr-r"><router-link to="/">&#127968; 首页</router-link><span>{{clock}}</span></div></header>
<div class="mod-tabs"><button v-for="m in modules" :key="m.key" :class="{on:curMod===m.key}" @click="switchMod(m.key)">{{m.icon}} {{m.label}}</button></div>
<div class="sub-tabs"><button v-for="s in subTabs" :key="s" :class="{on:curSub===s}" @click="switchSub(s)">{{subLabels[s]}}</button></div>
<div class="content" ref="contentRef">
<h2 class="pg-tt" v-if="curMod!=='ecommerce'">{{subLabels[curSub]}}</h2>

<template v-if="curMod==='ecommerce'"><EcommercePage :embedded="true" :activeTab="curSub"/></template>
<template v-else-if="curSub==='pest'"><PestDashboard :embedded="true" /></template>
<template v-else-if="curMod==='tourism'&&curSub==='spots'">
<div class="tbanner" style="border-left-color:#28C76F;color:#28C76F">🏞️ 景点游览 · 发现美丽乡村<span style="font-size:10px;color:#6F91A8;font-weight:400;margin-left:8px">📍 当前村庄：中堰村</span></div>
<div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center"><span style="position:relative;display:inline-flex;align-items:center"><input v-model="spotFilterText" placeholder="🔍 搜索景点名称、特色..." style="padding:6px 30px 6px 12px;border-radius:8px;border:1px solid rgba(40,199,111,.1);background:rgba(57,217,138,.06);color:#B7D3E8;font-size:12px;width:240px;font-family:inherit;outline:none"><span v-if="spotFilterText" @click="spotFilterText=''" style="position:absolute;right:6px;cursor:pointer;color:#6F91A8;font-size:14px;line-height:1" title="清空">×</span></span><div style="display:flex;gap:4px;flex-wrap:wrap"><button v-for="c in spotCategories" :key="c.v" :class="spotFilterCat===c.v?'btn btn-p btn-s':'btn btn-o btn-s'" @click="spotFilterCat=c.v">{{c.l||c.label}}<span v-if="c.v" style="font-size:9px;opacity:.7;margin-left:2px">({{tSpots.filter(s=>s.type===c.v).length}})</span></button></div></div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
<div v-for="s in filteredSpots" :key="s.id" class="spot-card" @click="showSpotDetail(s)">
<div class="spot-cover" :style="{background:s.coverUrl?'url('+s.coverUrl+') center/cover':'linear-gradient(135deg,'+spotCatColor(s.type)+'22,rgba(10,61,92,.6))'}"><div class="spot-cover-icon">{{spotCatIcon(s.type)}}</div><div v-if="spotBadge(s)" class="spot-badge" :class="spotBadge(s).cls">{{spotBadge(s).icon}} {{spotBadge(s).label}}</div><div class="spot-cover-status">{{s.openStatus==='open'?'🟢 开放中':s.openStatus==='paused'?'🔴 暂停开放':'🟡 维护中'}}</div></div>
<div style="padding:12px 14px 14px;display:flex;flex-direction:column;flex:1"><div class="spot-card-name">{{s.name}}</div><div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span class="spot-tag" :style="{color:spotCatColor(s.type),borderColor:spotCatColor(s.type)}">{{s.type}}</span></div><div class="spot-card-rating" v-if="s.rating">⭐ {{s.rating}} <span style="color:#6F91A8;font-weight:400">· {{(s.visitors||0).toLocaleString()}}次浏览</span></div><div class="spot-card-desc">{{s.summary||(s.desc||'').slice(0,50)}}</div><div style="display:flex;gap:8px;margin:8px 0;font-size:10px;color:#6F91A8"><span>📍 {{(s.address||'').replace('中堰村','中堰村 · ')}}</span></div><div style="display:flex;gap:6px;margin-top:auto"><button class="btn btn-p btn-s" @click.stop="showSpotDetail(s)">查看详情</button><button class="btn btn-o btn-s" @click.stop="toast('导航到：'+s.address,'info')">🗺️ 导航</button><button class="btn btn-o btn-s" @click.stop="toast('链接已复制','ok')" title="分享景点">📤 分享</button><button class="btn btn-o btn-s" style="font-size:13px;padding:2px 6px" @click.stop="s._fav=!s._fav;toast(s._fav?'已收藏':'已取消收藏','ok')" :title="s._fav?'取消收藏':'添加收藏'">{{s._fav?'❤️':'♡'}}</button></div></div>
</div>
</div>
</template>
<template v-else-if="curMod==='tourism'&&curSub==='spots'">
<div class="tbanner" style="border-left-color:#28C76F;color:#28C76F">🏞️ 景点游览 · 发现美丽乡村<span style="font-size:10px;color:#6F91A8;font-weight:400;margin-left:8px">📍 当前村庄：中堰村</span></div>
<div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center"><input v-model="spotFilterText" placeholder="🔍 搜索景点名称、特色..." style="padding:8px 12px;border-radius:8px;border:1px solid rgba(40,199,111,.1);background:rgba(57,217,138,.06);color:#B7D3E8;font-size:12px;width:240px;font-family:inherit;outline:none"><div style="display:flex;gap:4px;flex-wrap:wrap"><button v-for="c in spotCategories" :key="c.v" :class="spotFilterCat===c.v?'btn btn-p btn-s':'btn btn-o btn-s'" @click="spotFilterCat=c.v">{{c.label}}</button></div></div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
<div v-for="s in filteredSpots" :key="s.id" class="spot-card" @click="showSpotDetail(s)">
<div class="spot-cover" :style="{background:s.coverUrl?'url('+s.coverUrl+') center/cover':'linear-gradient(135deg,rgba(40,199,111,.15),rgba(10,61,92,.5))'}"><div class="spot-cover-tag">{{s.type}}</div><div class="spot-cover-status" :class="s.openStatus==='open'?'g':''">{{s.openStatus==='open'?'开放中':'暂停'}}</div></div>
<div style="padding:12px 14px 14px"><div class="spot-card-name">{{s.name}}</div><div class="spot-card-desc">{{s.summary||s.desc||''}}</div><div style="display:flex;gap:8px;margin:8px 0;font-size:10px;color:#6F91A8"><span>📍 {{s.address}}</span><span>{{s.ticketType||'免费'}}</span></div><div style="display:flex;gap:6px"><button class="btn btn-p btn-s" @click.stop="showSpotDetail(s)">查看详情</button><button class="btn btn-o btn-s" @click.stop="toast('导航到：'+s.address,'info')">🗺️ 导航</button></div></div>
</div>
</div>
</template>
<template v-else-if="isDataPage">
<div v-if="curSub==='lands'" class="tbanner" style="border-left-color:#28C76F;color:#28C76F">🌍 地块管理 · 中堰村农业地块信息总览</div>
<div v-if="curSub==='crops'" class="tbanner" style="border-left-color:#28C7FA;color:#28C7FA">🌱 作物档案 · 品种信息与生长周期追溯</div>
<div v-if="curSub==='records'" class="tbanner" style="border-left-color:#F5B83D;color:#F5B83D">📝 农事记录 · 施肥/灌溉/打药/修剪操作日志</div>
<div v-if="curSub==='irrigation'" class="tbanner" style="border-left-color:#28C76F;color:#28C76F">💧 水肥管理 · 智能灌溉控制与用水监测</div>
<div v-if="curSub!=='pest'" class="srow"><div v-for="s in stats" :key="s.label" class="scard" :class="s.cls"><div class="sv">{{s.value}}</div><div class="sl">{{s.label}}</div></div></div>
<div class="panel" v-if="showChart && curSub!=='pest'"><div class="tt">&#128202; {{chartTitles[curSub]}}</div><div :id="'chart_'+curSub" style="height:200px" ref="chartRef"></div></div>
<div class="panel" v-if="hasSecondary"><div class="tt">{{secondaryTitles[curSub]}}</div>
<div v-if="curSub==='lands'" class="sec-grid"><div v-for="l in lands" :key="l.id" class="sec-card"><div style="font-weight:600;color:#fff">{{l.name}}</div><div style="color:#6F91A8;font-size:10px;margin-top:3px">{{l.area}}亩 | {{l.soil}} | {{l.crop}}</div><span :class="'tag '+(l.status==='盛果期'||l.status==='采收中'?'g':l.status==='已收割'?'dim':'b')" style="margin-top:4px;display:inline-block">{{l.status}}</span></div></div>
<div v-if="curSub==='crops'" class="sec-list"><div v-for="c in crops" :key="c.id" class="tl-item"><div :class="'tl-dot'+(c.stage==='采收中'||c.stage==='已收割'?' g':'')"></div><div class="tl-content"><div class="tlt">{{c.name}} — {{c.stage}}</div><div class="tld">品种:{{c.variety}} | 播种:{{c.plantDate}} | 周期:{{c.cycle}}</div><div class="tltm">预计产量:{{c.expYield}} | {{c.fertilizer}}</div></div><span style="font-size:10px;color:#28C76F;flex-shrink:0">{{c.area}}亩</span></div></div>
<div v-if="curSub==='records'" class="sec-list"><div v-for="r in records" :key="r.id" class="tl-item"><div :class="'tl-dot'+(r.type==='灌溉'?' g':r.type==='施肥'?'':' y')"></div><div class="tl-content"><div class="tlt">{{r.type}} — {{r.plot}}</div><div class="tld">{{r.detail}} | 操作人:{{r.operator}}</div><div class="tltm">{{r.date}} | {{r.weather}}</div></div><span :class="'tag '+(r.type==='施肥'?'b':r.type==='灌溉'?'g':r.type==='打药'?'r':'y')">{{r.type}}</span></div></div>
<div v-if="curSub==='irrigation'" class="sec-grid"><div v-for="l in lands.filter(x=>x.irrigation)" :key="l.id" class="sec-card"><div style="font-weight:600;color:#fff">{{l.name}}</div><div style="color:#6F91A8;font-size:10px;margin-top:3px">{{l.area}}亩 | 滴灌系统 | 最近:2026-06-15</div><span class="tag g" style="margin-top:4px;display:inline-block">灌溉正常</span></div></div>
</div>
<div class="panel" v-if="curSub==='irrigation'"><div class="tt">&#128225; 灌溉监测点切换</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button v-for="pt in irrigationPoints" :key="pt.id" class="btn" :class="irrigationPoint===pt.id?'btn-p':'btn-o'" style="font-size:12px" @click="switchIrrigationPoint(pt.id)">{{pt.icon}} {{pt.name}}</button></div><div style="font-size:10px;color:#6F91A8;margin-top:8px">&#128205; 位置:{{currentIrrigationPoint.loc}} | 设备:{{currentIrrigationPoint.device}} | 灌溉方式:{{currentIrrigationPoint.method}}</div></div>
<div class="panel" v-if="curSub==='irrigation'"><div class="tt">&#128167; 灌溉控制面板</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px"><div v-for="v in irrigationValves" :key="v.id" class="valve-card" :class="{selected:selectedValve===v.id}" @click="selectValve(v.id)"><div class="valve-info"><div class="valve-icon">{{v.icon}}</div><div><div class="valve-name">{{v.name}}</div><div class="valve-desc">{{v.desc}}</div></div></div><div class="valve-actions"><button class="valve-btn" :class="{on:v.on}" @click.stop="toggleValve(v.id)">{{v.on?'🟢 运行中':'⚫ 已停止'}}</button><div class="valve-runtime">&#9200; {{v.runtime||'--'}}</div></div></div></div></div>


<div class="panel"><div class="toolbar"><button class="btn btn-p btn-s" @click="addItem">&#10133; {{addBtnLabels[curSub]||'新增'}}</button><button v-if="curSub==='lands'" class="btn btn-o btn-s" @click="toast('GIS标注功能','info')">&#128205; GIS标注</button><button v-if="curSub==='lands'" class="btn btn-o btn-s" @click="toast('土壤检测记录','info')">&#129514; 土壤检测</button><button v-if="curSub==='crops'" class="btn btn-o btn-s" @click="toast('扫码溯源','info')">&#128241; 生成溯源码</button><button v-if="curSub==='crops'" class="btn btn-o btn-s" @click="toast('种植计划','info')">&#128203; 种植计划</button><button v-if="curSub==='records'" class="btn btn-o btn-s" @click="toast('农事任务分配已发送','info')">&#128203; 任务分配</button><button v-if="curSub==='records'" class="btn btn-o btn-s" @click="toast('AI农事建议已生成','info')">&#129302; AI建议</button><button v-if="curSub==='irrigation'" class="btn btn-o btn-s" @click="toast('智能灌溉已启动','info')">&#128167; 智能灌溉</button><button v-if="curSub==='irrigation'" class="btn btn-o btn-s" @click="toast('水肥方案已生成','info')">&#129514; 水肥方案</button><button class="btn btn-o btn-s" @click="exportCurrentTable">&#128228; 导出</button><span class="spacer"></span><input v-model="filterText" placeholder="&#128269; 搜索..." @input="page=1"></div>
<table><thead><tr><th v-for="c in tableCols" :key="c">{{c}}</th><th style="width:80px">操作</th></tr></thead><tbody><tr v-for="r in pagedData" :key="r.id" @click="showDetail(r)"><td v-for="(c,ci) in tableCols" :key="c" v-html="renderCell(r,ci)"></td><td><button class="btn btn-s btn-p" @click.stop="editItem(r.id)">编辑</button><button class="btn btn-s btn-d" @click.stop="delItem(r.id)">删除</button></td></tr></tbody></table>
<div class="pg"><span style="color:#6F91A8">共{{filteredData.length}}条,{{page}}/{{totalPages}}页</span><button v-for="p in totalPages" :key="p" class="pg-btn" :style="{color:p===page?'#28C76F':'',fontWeight:p===page?'600':''}" @click="page=p">{{p}}</button></div></div>
</template>
<template v-else-if="curSub==='monitor'">
<div class="srow"><div class="scard"><div class="sv">{{monitorData.temp}}&#176;C</div><div class="sl">温度</div></div><div class="scard g"><div class="sv">{{monitorData.hum}}%</div><div class="sl">空气湿度</div></div><div class="scard y"><div class="sv">{{monitorData.soil}}%</div><div class="sl">土壤湿度</div></div><div class="scard"><div class="sv">{{monitorData.light}}Lux</div><div class="sl">光照强度</div></div></div>
<div class="panel"><div class="tt">&#128225; 监测点切换</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button v-for="pt in monitorPoints" :key="pt.id" class="btn" :class="monitorPoint===pt.id?'btn-p':'btn-o'" style="font-size:12px" @click="switchMonitorPoint(pt.id)">{{pt.icon}} {{pt.name}}</button></div><div style="font-size:10px;color:#6F91A8;margin-top:8px">&#128205; 位置:{{currentMonitorPoint.loc}} | 设备:{{currentMonitorPoint.device}} | 坐标:{{currentMonitorPoint.coord}}</div></div>
<div class="panel"><div class="tt">&#128200; 24小时监测趋势 — {{currentMonitorPoint.name}}</div><div id="chart_monitor" style="height:200px" ref="chartRef2"></div></div>
<div class="panel"><div class="tt">&#128225; 最近告警</div><div class="alert-item" style="margin-bottom:4px" v-for="a in currentMonitorPoint.alerts" :key="a">{{a}}</div></div>
</template>
</div>

<div class="drawer-overlay" :class="{on:drawerOpen}" @click="drawerOpen=false"></div>
<div class="drawer" :class="{on:drawerOpen}"><div class="drawer-hd"><h3>{{drawerTitle}}</h3><button class="drawer-close" @click="drawerOpen=false">&#10005;</button></div><div class="drawer-bd">
<template v-if="spotDetailData&&curSub==='spots'">
<div class="spot-detail-cover" :style="{background:'linear-gradient(135deg,'+spotCatColor(spotDetailData.type)+'22,rgba(10,61,92,.6))'}"><div class="spot-detail-icon">{{spotCatIcon(spotDetailData.type)}}</div></div>
<div style="text-align:center;padding:8px 0"><div style="font-size:16px;font-weight:700;color:#fff">{{spotDetailData.name}}</div><div style="color:#F5B83D;font-size:11px;margin-top:2px">{{starRating(spotDetailData.rating)}} {{spotDetailData.rating||'4.5'}}</div><div class="spot-tag" style="margin-top:4px;color:#28C76F;border-color:#28C76F">{{spotDetailData.type}}</div></div>
<div class="ds-title">📋 游览信息</div>
<div class="dg3"><span class="dl3">开放状态</span><div>{{spotDetailData.openStatus==='open'?'🟢 开放中':spotDetailData.openStatus==='paused'?'🔴 暂停开放':'🟡 维护中'}}</div></div>
<div class="dg3"><span class="dl3">开放时间</span><div>{{spotDetailData.openingTime||'--'}}</div></div>
<div class="dg3"><span class="dl3">门票</span><div>{{(spotDetailData.ticketType||'免费')+' · '+(spotDetailData.ticketPrice||'')}}</div></div>
<div class="dg3"><span class="dl3">预计游玩</span><div>{{spotDetailData.duration||'2小时'}}</div></div>
<div class="dg3"><span class="dl3">联系电话</span><div><span v-if="spotDetailData._showPhone" style="color:#28C76F">{{spotDetailData.contact||'--'}}</span><span v-else style="color:#28C76F;cursor:pointer" @click="spotDetailData._showPhone=true;toast('联系方式已显示','info')">点击查看</span></div></div>
<div class="dg3"><span class="dl3">📍 位置</span><div>{{spotDetailData.address||'--'}}</div></div>
<div class="ds-title">📝 景区简介</div>
<div style="color:#B7D3E8;font-size:12px;line-height:1.7;padding:6px 0">{{spotDetailData.desc||'暂无介绍'}}</div>
<div class="ds-title">🏗 配套设施</div>
<div class="dg3"><span class="dl3">设施</span><div>{{(spotDetailData.facilities||[]).join('、')||'暂未完善'}}</div></div>
<div class="ds-title">📊 参考信息</div>
<div class="dg3"><span class="dl3">评分</span><div style="color:#F5B83D">{{starRating(spotDetailData.rating)}} {{spotDetailData.rating||'4.5'}}</div></div>
<div class="dg3"><span class="dl3">累计游客</span><div>{{(spotDetailData.visitors||0).toLocaleString()}}次</div></div>
<div style="display:flex;gap:8px;margin-top:14px"><button class="btn btn-p btn-s" @click="toast('导航到：'+spotDetailData.address,'info')">📍 导航</button><button class="btn btn-o btn-s" @click="toast('链接已复制','ok')">📤 分享</button><button class="btn btn-o btn-s" @click="spotDetailData._fav=!spotDetailData._fav;toast(spotDetailData._fav?'已收藏':'已取消','ok')">{{spotDetailData._fav?'❤️ 已收藏':'♡ 收藏'}}</button></div>
</template>
<template v-else-if="drawerData"><div style="display:grid;grid-template-columns:1fr 2fr;gap:4px 16px;font-size:12px;margin-bottom:14px"><template v-for="(v,k) in drawerData" :key="k"><span v-if="k!=='id'&&k!=='rooms2'&&k!=='reviews'&&k!=='trend'&&k!=='sources'&&k!=='_hover'" style="color:#6F91A8">{{k}}</span><span v-if="k!=='id'&&k!=='rooms2'&&k!=='reviews'&&k!=='trend'&&k!=='sources'&&k!=='_hover'" style="color:#fff;font-weight:500">{{v||'--'}}</span></template></div><div style="display:flex;gap:6px;margin-top:12px"><button class="btn btn-p btn-s" @click="editItem(drawerData.id);drawerOpen=false">编辑</button><button class="btn btn-d btn-s" @click="delItem(drawerData.id);drawerOpen=false">删除</button></div></template></div></div>

<div class="drawer-overlay" :class="{on:formOpen}" @click="formOpen=false"></div>
<div class="drawer" :class="{on:formOpen}"><div class="drawer-hd"><h3>{{formTitle}}</h3><button class="drawer-close" @click="formOpen=false">&#10005;</button></div><div class="drawer-bd">
<div v-if="curSub==='lands'||curSub==='irrigation'"><div class="fld"><label>地块名称</label><input v-model="form.name" class="fin2"></div><div class="frow2"><div class="fld"><label>面积(亩)</label><input v-model="form.area" type="number" class="fin2"></div><div class="fld"><label>土壤类型</label><input v-model="form.soil" class="fin2"></div></div><div class="frow2"><div class="fld"><label>位置</label><input v-model="form.location" class="fin2"></div><div class="fld"><label>种植作物</label><input v-model="form.crop" class="fin2"></div></div><div class="frow2"><div class="fld"><label>状态</label><select v-model="form.status" class="fin2"><option>生长期</option><option>盛果期</option><option>采收中</option><option>已收割</option></select></div><div class="fld"><label>灌溉</label><select v-model="form.irrigation" class="fin2"><option value="是">是</option><option value="否">否</option></select></div></div></div>
<div v-if="curSub==='crops'"><div class="fld"><label>作物名称</label><input v-model="form.name" class="fin2"></div><div class="frow2"><div class="fld"><label>品种</label><input v-model="form.variety" class="fin2"></div><div class="fld"><label>面积(亩)</label><input v-model="form.area" type="number" class="fin2"></div></div><div class="frow2"><div class="fld"><label>播种日期</label><input v-model="form.plantDate" class="fin2"></div><div class="fld"><label>周期</label><input v-model="form.cycle" class="fin2"></div></div><div class="frow2"><div class="fld"><label>生长阶段</label><select v-model="form.stage" class="fin2"><option>播种期</option><option>生长期</option><option>开花期</option><option>果实膨大期</option><option>着色期</option><option>采收中</option></select></div><div class="fld"><label>施肥方案</label><input v-model="form.fertilizer" class="fin2"></div></div></div>
<div v-if="curSub==='records'"><div class="frow2"><div class="fld"><label>类型</label><select v-model="form.type" class="fin2"><option>施肥</option><option>灌溉</option><option>打药</option><option>修剪</option></select></div><div class="fld"><label>作物</label><input v-model="form.crop" class="fin2"></div></div><div class="frow2"><div class="fld"><label>地块</label><input v-model="form.plot" class="fin2"></div><div class="fld"><label>操作人</label><input v-model="form.operator" class="fin2"></div></div><div class="fld"><label>详情</label><textarea v-model="form.detail" class="fin2" style="height:60px"></textarea></div><div class="frow2"><div class="fld"><label>日期</label><input v-model="form.date" class="fin2"></div><div class="fld"><label>天气</label><select v-model="form.weather" class="fin2"><option>晴</option><option>多云</option><option>阴</option><option>雨</option></select></div></div></div>
<div v-if="curSub==='spots'"><div class="fld"><label>景区名称</label><input v-model="form.name" class="fin2"></div><div class="frow2"><div class="fld"><label>类型</label><select v-model="form.type" class="fin2"><option>农业观光</option><option>采摘体验</option><option>研学教育</option><option>生态休闲</option><option>文化活动</option></select></div><div class="fld"><label>所属村庄</label><input v-model="form.villageName" class="fin2" placeholder="中堰村"></div></div><div class="frow2"><div class="fld"><label>位置</label><input v-model="form.address" class="fin2"></div><div class="fld"><label>负责人</label><input v-model="form.manager" class="fin2"></div></div><div class="frow2"><div class="fld"><label>联系方式</label><input v-model="form.contact" class="fin2"></div><div class="fld"><label>预约方式</label><select v-model="form.bookingType" class="fin2"><option>无需预约</option><option>电话预约</option><option>线上预约</option></select></div></div><div class="frow2"><div class="fld"><label>开放时间</label><input v-model="form.openingTime" class="fin2" placeholder="08:00-18:00"></div><div class="fld"><label>开放状态</label><select v-model="form.openStatus" class="fin2"><option value="open">开放</option><option value="paused">暂停</option><option value="closed">关闭</option></select></div></div><div class="fld"><label>介绍</label><textarea v-model="form.desc" class="fin2" style="height:60px" placeholder="景区介绍..."></textarea></div></div>
<div style="display:flex;gap:8px;margin-top:16px"><button class="btn btn-p" @click="submitForm">保存</button><button class="btn btn-o" @click="formOpen=false">取消</button></div></div></div>
<div style="position:fixed;top:16px;right:16px;z-index:999;display:flex;flex-direction:column;gap:6px;pointer-events:none"><div v-for="t in toasts" :key="t.id" :class="'toast '+t.type">{{t.msg}}</div></div>
</div>
</template>
<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import EcommercePage from '@/views/industry/EcommercePage.vue'
import PestDashboard from '@/views/pest/PestDashboard.vue'
const props = defineProps({ embedded: { type: Boolean, default: false } })
const router = useRouter()

const clock = ref('')
let clockTimer = null
onMounted(() => { clockTimer = setInterval(() => { const d = new Date(); clock.value = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0') }, 1000) })
onUnmounted(() => { clearInterval(clockTimer) })

// Toast
const toasts = reactive([])
function toast(msg, type = 'info') { const id = Date.now(); toasts.push({ id, msg, type }); setTimeout(() => { const i = toasts.findIndex(t => t.id === id); if (i >= 0) toasts.splice(i, 1) }, 2300) }

// Modules
const modules = [{ key: 'farming', icon: '🌾', label: '智慧农业' }, { key: 'ecommerce', icon: '🛒', label: '农产品电商' }, { key: 'tourism', icon: '🏞️', label: '乡村文旅' }, { key: 'livestock', icon: '🐖', label: '智慧养殖' }]
const modLabels = { farming: '智慧农业', ecommerce: '农产品电商', tourism: '乡村文旅', livestock: '智慧养殖' }
const subLabels = { lands: '地块管理', crops: '作物档案', records: '农事记录', monitor: '生长监测', irrigation: '水肥管理', pest: '病虫害预警', products: '商品管理', orders: '订单管理', trace: '产品溯源', live: '直播中心', analytics: '经营分析', spots: '景点游览', bnbs: '民宿管理', activities: '活动管理', records2: '养殖档案', env: '环境监测', feed: '投喂管理', disease: '疫病预警', slaughter: '出栏管理' }
const subMap = { farming: ['lands', 'crops', 'records', 'monitor', 'irrigation', 'pest'], ecommerce: ['products', 'orders', 'trace', 'live', 'analytics'], tourism: ['spots', 'bnbs', 'activities'], livestock: ['records2', 'env', 'feed', 'disease', 'slaughter'] }
const addBtnLabels = { lands: '新增地块', crops: '新增作物', records: '新增记录', irrigation: '新增计划', pest: '新增预警', products: '新增商品', orders: '新增订单', trace: '新增溯源', live: '创建直播', analytics: '导出报表', records2: '新增养殖批次', feed: '新增投喂计划', slaughter: '新增出栏记录' }
const chartTitles = { lands: '地块分布分析', crops: '作物阶段分布', records: '农事类型分布', products: '商品销量分布', records2: '养殖存栏统计' }
const secondaryTitles = { lands: '地块概况', crops: '种植日历', records: '最近农事', irrigation: '灌溉状态', pest: '病虫害监测', records2: '养殖概况', feed: '投喂状态', slaughter: '出栏记录' }
const curMod = ref('farming'), curSub = ref('lands'), page = ref(1), filterText = ref(''), bnbfilterText = ref(''), pageSize = 8
const drawerOpen = ref(false), drawerTitle = ref(''), drawerData = ref(null)
const contentRef = ref(null)
let chartInstance = null

const subTabs = computed(() => subMap[curMod.value] || [])
const isDataPage = computed(() => ['lands', 'crops', 'records', 'irrigation', 'records2', 'feed', 'slaughter'].includes(curSub.value))
const showChart = computed(() => ['lands', 'crops', 'records', 'pest', 'products'].includes(curSub.value))
const hasSecondary = computed(() => ['lands', 'crops', 'records', 'irrigation'].includes(curSub.value))
const isMgmtPage = computed(() => ['products', 'orders', 'spots', 'bnbs', 'activities', 'trace', 'analytics', 'heritage', 'guide', 'planning'].includes(curSub.value))
const isOverview = computed(() => curSub.value === 'overview')

function switchMod(k) { curMod.value = k; curSub.value = subMap[k][0]; page.value = 1; filterText.value = ''; drawerOpen.value = false; nextTick(() => initChart()) }
function switchSub(s) { curSub.value = s; page.value = 1; filterText.value = ''; drawerOpen.value = false; nextTick(() => initChart()) }

// Data
let uidCounter = 300; function uid() { return ++uidCounter }
const lands = reactive([{ id: 1, name: '蜂糖李基地', area: 100, soil: '褐土', location: '产业园东区', crop: '蜂糖李', status: '盛果期', irrigation: true, date: '2023-03-15' },
  { id: 2, name: '富硒黄桃园', area: 150, soil: '潮土', location: '产业园南区', crop: '富硒黄桃', status: '盛果期', irrigation: true, date: '2023-04-01' },
  { id: 3, name: '阳光玫瑰葡萄园', area: 50, soil: '褐土', location: '产业园西区', crop: '阳光玫瑰葡萄', status: '生长期', irrigation: true, date: '2024-02-20' },
  { id: 4, name: '智能温室大棚', area: 100, soil: '基质', location: '产业园核心区', crop: '高架草莓/圣女果', status: '采收中', irrigation: true, date: '2024-09-01' },
  { id: 5, name: '荷花种植区', area: 50, soil: '水域', location: '产业园北区', crop: '荷花/荷虾混养', status: '生长期', irrigation: true, date: '2024-05-01' },
  { id: 6, name: '油葵种植区', area: 150, soil: '潮土', location: '产业园西区', crop: '油葵', status: '生长期', irrigation: false, date: '2025-03-01' }])
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
const tBnBs = reactive([{ id: 1, name: '田园居', owner: '王大爷', phone: '139****6789', rooms: 6, price: 188, rating: 4.8, bookings: 320, revenue: '¥3.8万', occupancy: '82%', status: '营业中', since: '2023-03', desc: '独栋小院，自带菜园，采摘体验，农家餐饮', tags: '采摘/农家饭', license: '陕旅备2024001', openTime: '07:00-22:00', todayIn: 4, monthOrders: 68, rooms2: [{ type: '标准间', area: '28㎡', beds: '2人', price: 188 },
  { type: '家庭房', area: '45㎡', beds: '4人', price: 288 }], reviews: [{ name: '张女士', text: '带孩子来体验采摘，很不错', stars: 5 },
  { name: '王先生', text: '农家菜很地道，蔬菜都是自己种的', stars: 5 },
  { name: '刘阿姨', text: '房间干净整洁，老板热情', stars: 4 }], trend: [60, 45, 55, 70, 82, 85, 90, 88, 78, 72, 65, 58] },
  { id: 2, name: '山景阁', owner: '李婶', phone: '138****8901', rooms: 4, price: 258, rating: 4.9, bookings: 186, revenue: '¥3.2万', occupancy: '76%', status: '营业中', since: '2023-06', desc: '半山腰观景民宿，山景观景台，日出观赏', tags: '山景/摄影', license: '陕旅备2024002', openTime: '06:00-21:00', todayIn: 3, monthOrders: 52, rooms2: [{ type: '标准间', area: '26㎡', beds: '2人', price: 258 },
  { type: '景观房', area: '38㎡', beds: '2人', price: 328 }], reviews: [{ name: '李先生', text: '山景房景色非常好，早上看日出太美了', stars: 5 },
  { name: '赵女士', text: '房间很大，阳台直接可以看到群山', stars: 5 },
  { name: '陈先生', text: '适合摄影爱好者，位置绝佳', stars: 5 }], trend: [40, 35, 50, 65, 72, 78, 82, 76, 68, 55, 48, 42] },
  { id: 3, name: '果园人家', owner: '赵大哥', phone: '137****2345', rooms: 8, price: 158, rating: 4.6, bookings: 450, revenue: '¥4.2万', occupancy: '88%', status: '营业中', since: '2022-09', desc: '紧邻苹果园，含农家早餐，亲子采摘', tags: '亲子/采摘', license: '陕旅备2024003', openTime: '07:30-21:00', todayIn: 5, monthOrders: 86, rooms2: [{ type: '标准间', area: '30㎡', beds: '2人', price: 158 },
  { type: '家庭房', area: '48㎡', beds: '4人', price: 248 },
  { type: '亲子房', area: '42㎡', beds: '3人', price: 208 }], reviews: [{ name: '周女士', text: '果园采摘太有意思了', stars: 5 },
  { name: '吴先生', text: '早餐很丰盛', stars: 4 },
  { name: '郑女士', text: '整体不错', stars: 4 }], trend: [70, 55, 62, 78, 85, 90, 88, 92, 85, 80, 75, 68] }])
const livestock = reactive([{ id: 1, type: '澳洲淡水龙虾', breed: '澳洲品系', count: 80000, building: '智能水产养殖基地', status: '成长期' }, { id: 2, type: '鲈鱼', breed: '加州鲈', count: 5000, building: '荷虾混养区', status: '成长期' }, { id: 3, type: '罗非鱼', breed: '吉富品系', count: 30000, building: '智慧渔业车间', status: '育成期' }])
const bnbOrders = reactive([{ id: 'ORD0617', guest: '张女士', bnb: '田园居', room: '家庭房', checkIn: '2026-06-22', checkOut: '2026-06-24', amount: 576, status: '已入住', phone: '138****5678' },
  { id: 'ORD0618', guest: '李女士', bnb: '山景阁', room: '景观房', checkIn: '2026-06-25', checkOut: '2026-06-27', amount: 656, status: '待入住', phone: '139****8901' },
  { id: 'ORD0619', guest: '王先生', bnb: '果园人家', room: '标准间', checkIn: '2026-06-20', checkOut: '2026-06-22', amount: 316, status: '已退房', phone: '136****2345' },
  { id: 'ORD0620', guest: '赵女士', bnb: '田园居', room: '标准间', checkIn: '2026-06-28', checkOut: '2026-06-30', amount: 376, status: '待入住', phone: '135****6789' }])
const ecoOrders = reactive([{ id: 'ORD0617A', type: '特产', item: '红富士苹果', by: '张女士', amount: 204, status: '已发货', date: '2026-06-17' }, { id: 'ORD0618A', type: '特产', item: '有机核桃+大樱桃', by: '李先生', amount: 386, status: '待发货', date: '2026-06-16' }])
const activities = reactive([{ name: '苹果采摘节', date: '2026-10-01', loc: '苹果采摘园', joined: 280, limit: 500, status: '即将开始' }, { name: '樱桃观赏季', date: '2026-03-20', loc: '樱桃谷', joined: 520, limit: 800, status: '已结束' }, { name: '乡村摄影大赛', date: '2026-08-15', loc: '中堰村全域', joined: 65, limit: 200, status: '报名中' }])
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
const envData = reactive([{ time: '10:00', temp: 27.2, hum: 68, nh3: 5.2, light: 480 }, { time: '10:05', temp: 27.5, hum: 67, nh3: 5.5, light: 490 }, { time: '10:10', temp: 27.8, hum: 66, nh3: 5.8, light: 500 }, { time: '10:15', temp: 28.0, hum: 65, nh3: 6.1, light: 510 }, { time: '10:20', temp: 28.1, hum: 64, nh3: 6.3, light: 515 }])
const envLatest = computed(() => envData[envData.length - 1])

// Data map and computed
const feedData = reactive([{ id: 1, name: '养猪场A区', type: '自动投喂', time: '07:00', amount: '2.5kg/头', status: '已完成' }, { id: 2, name: '养鸡场1号', type: '自动投喂', time: '06:30', amount: '120g/只', status: '已完成' }, { id: 3, name: '养牛场', type: '手动投喂', time: '08:00', amount: '15kg/头', status: '进行中' }, { id: 4, name: '智能水产基地', type: '自动投喂', time: '07:30', amount: '50kg', status: '已完成' }])
const slaughterData = reactive([{ id: 1, name: '养猪场A区', breed: '杜长大三元', count: 48, date: '2026-07-05', weight: '110kg/头', price: '15元/kg', status: '已出栏' }, { id: 2, name: '养鸡场1号', breed: '海兰褐', count: 200, date: '2026-07-10', weight: '2.1kg/只', price: '12元/kg', status: '待出栏' }, { id: 3, name: '养牛场', breed: '西门塔尔', count: 5, date: '2026-08-01', weight: '650kg/头', price: '28元/kg', status: '育肥中' }])
// Spot management state & computed
const spotFilterText = ref('')
const spotFilterCat = ref('')
const spotCategories = [{v:'',label:'全部'},{v:'自然风光',l:'🌳 自然风光'},{v:'采摘体验',l:'🍑 采摘体验'},{v:'休闲娱乐',l:'🏕 休闲娱乐'},{v:'研学教育',l:'🎓 研学教育'},{v:'人文文化',l:'🏛 人文文化'}]
const filteredSpots = computed(()=>{let l=tSpots;const f=spotFilterText.value.toLowerCase();if(f)l=l.filter(s=>s.name.toLowerCase().includes(f)||(s.summary||'').toLowerCase().includes(f)||(s.desc||'').toLowerCase().includes(f));if(spotFilterCat.value)l=l.filter(s=>s.type===spotFilterCat.value);return l})
const spotDetailData=ref(null)
function showSpotDetail(s){spotDetailData.value=s;drawerTitle.value=s.name;drawerOpen.value=true}
function starRating(r){const n=Math.round(parseFloat(r)||0);return '★'.repeat(n)+'☆'.repeat(5-n)}
function spotCatIcon(t){const m={'自然风光':'🌳','采摘体验':'🍑','休闲娱乐':'🏕','研学教育':'🎓','人文文化':'🏛','乡村文化':'🏛'};return m[t]||'📍'}
function spotCatColor(t){const m={'自然风光':'#28C76F','采摘体验':'#F5B83D','休闲娱乐':'#28C7FA','研学教育':'#A77BFF','人文文化':'#E74C3C','乡村文化':'#A77BFF'};return m[t]||'#28C76F'}
function spotBadge(s){if(s.tag==='HOT')return {icon:'🔥',label:'热门',cls:'hot'};if(s.tag==='RECOMMEND')return {icon:'⭐',label:'推荐',cls:'rec'};if(s.tag==='NEW')return {icon:'🆕',label:'新上线',cls:'new'};if(s.visitors>5000)return {icon:'🔥',label:'热门',cls:'hot'};return null}

const dataMap = { lands, crops, records, irrigation: lands, pest: diseaseAlerts, overview: products, records2: livestock, feed: feedData, slaughter: slaughterData, products, spots: tSpots, bnbs: tBnBs, activities }
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
  if (k === 'feed') return [{ label: '今日投喂', value: feedData.length+'次', cls: '' }, { label: '已完成', value: feedData.filter(f=>f.status==='已完成').length+'次', cls: 'g' }, { label: '进行中', value: feedData.filter(f=>f.status==='进行中').length+'次', cls: 'y' }]
  if (k === 'slaughter') return [{ label: '出栏批次', value: slaughterData.length+'批', cls: '' }, { label: '预计出栏', value: slaughterData.filter(s=>s.status!=='已出栏').length+'批', cls: 'y' }, { label: '已出栏', value: slaughterData.filter(s=>s.status==='已出栏').length+'批', cls: 'g' }]
  if (k === 'pest') return [{ label: '活跃预警', value: diseaseAlerts.filter(a=>a.status==='监控中').length+'条', cls: 'y' }, { label: '已处理', value: diseaseAlerts.filter(a=>a.status==='已处理').length+'条', cls: 'g' }]
  if (k === 'overview') return [{ label: '在售商品', value: products.length+'种', cls: '' }, { label: '累计销量', value: products.reduce((s,p)=>s+p.sales,0)+'件', cls: 'g' }, { label: '销售额', value: '¥'+products.reduce((s,p)=>s+p.price*p.sales,0).toLocaleString(), cls: 'y' }]
  return [{ label: '总数', value: arr.length, cls: '' }]
})

const tableCols = computed(() => {
  const k = curSub.value
  if (k === 'lands') return ['名称', '面积(亩)', '土壤', '作物', '状态']
  if (k === 'crops') return ['名称', '品种', '播种日期', '周期', '面积', '阶段']
  if (k === 'records') return ['类型', '作物', '地块', '日期', '详情', '操作人']
  if (k === 'records2') return ['类型', '品种', '存栏', '圈舍', '状态']
  if (k === 'irrigation') return ['地块', '灌水方式', '最近灌溉', '用水量', '状态']
  if (k === 'feed') return ['养殖区', '投喂方式', '时间', '投喂量', '状态']
  if (k === 'slaughter') return ['养殖区', '品种', '数量', '日期', '均重', '单价', '状态']
  if (k === 'pest') return ['预警类型', '风险等级', '影响区域', '症状', '状态']
  return ['名称', '状态']
})

function renderCell(r, ci) {
  const k = curSub.value
  if (k === 'lands') { const vals = [r.name, r.area, r.soil, r.crop, '<span class="tag ' + (r.status === '盛果期' || r.status === '采收中' ? 'g' : r.status === '已收割' ? 'dim' : 'b') + '">' + r.status + '</span>']; return vals[ci] || '--' }
  if (k === 'crops') { const vals = [r.name, r.variety, r.plantDate, r.cycle, r.area, r.stage]; return vals[ci] || '--' }
  if (k === 'records') { const vals = ['<span class="tag ' + (r.type === '施肥' ? 'b' : r.type === '灌溉' ? 'g' : r.type === '打药' ? 'r' : 'y') + '">' + r.type + '</span>', r.crop, r.plot, r.date, r.detail, r.operator]; return vals[ci] || '--' }
  if (k === 'records2') { const vals = [r.type, r.breed, typeof r.count === 'number' ? r.count.toLocaleString() : r.count, r.building, '<span class="tag b">' + r.status + '</span>']; return vals[ci] || '--' }
  if (k === 'irrigation') { const vals = [r.name||'--', '滴灌', r.date||'2026-06-15', '180m³', '<span class="tag g">正常</span>']; return vals[ci] || '--' }
  if (k === 'feed') { const vals = [r.name||'--', r.type||'--', r.time||'--', r.amount||'--', '<span class="tag '+(r.status==='已完成'?'g':r.status==='进行中'?'y':'dim')+'">'+r.status+'</span>']; return vals[ci] || '--' }
  if (k === 'slaughter') { const vals = [r.name||'--', r.breed||'--', r.count||'--', r.date||'--', r.weight||'--', r.price||'--', '<span class="tag '+(r.status==='已出栏'?'g':r.status==='待出栏'?'y':'dim')+'">'+r.status+'</span>']; return vals[ci] || '--' }
  if (k === 'pest') { const vals = ['<span class="tag y">'+r.disease+'</span>', '<span class="tag '+(r.risk==='中风险'?'y':'g')+'">'+r.risk+'</span>', r.building, r.symptom, '<span class="tag '+(r.status==='监控中'?'y':'g')+'">'+r.status+'</span>']; return vals[ci] || '--' }
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
const form = reactive({ name:'', area:'', soil:'', location:'', crop:'', status:'', irrigation:'' })
function resetForm() {
  Object.keys(form).forEach(k => form[k] = '')
  form.irrigation = '是'; form.status = '生长期'; form.type = '施肥'; form.weather = '晴'
  form.risk = '低风险'; form.stage = '生长期'; form.area = '100'; form.price = '188'; form.stock = '100'
  form.rooms = '6'; form.tickets = '0'
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
  Object.keys(r).forEach(k => { if (k in form) form[k] = String(r[k]||'') })
  if (r.irrigation !== undefined) form.irrigation = r.irrigation ? '是' : '否'
  formOpen.value = true
}
function submitForm() {
  const k = curSub.value; const m = formMode.value
  if (k === 'lands' || k === 'irrigation') {
    const obj = { id: m==='add'?uid():formEditId.value, name: form.name||'未命名', area: parseInt(form.area)||100, soil: form.soil||'褐土', location: form.location||'产业园', crop: form.crop||'--', status: form.status||'生长期', irrigation: form.irrigation==='是', date: new Date().toISOString().split('T')[0] }
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
    if (m === 'add') activities.unshift(obj); else { const idx = activities.findIndex(x => x.name === formEditId.value || x.name === (selected.value?.name)); if (idx >= 0) { activities[idx].name = obj.name; activities[idx].date = obj.date; activities[idx].loc = obj.loc; activities[idx].limit = obj.limit; activities[idx].status = obj.status } }
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
function delItem(id) { if (!confirm('确定删除？')) return; const arr = currentData.value; if (!arr) return; const i = arr.findIndex(x => x.id === id); if (i >= 0) { arr.splice(i, 1); toast('已删除', 'ok') } }

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
function showDetail(r) { drawerData.value = r; drawerTitle.value = subLabels[curSub.value] + ' — ' + (r.name || r.title || r.type || ''); drawerOpen.value = true }
function showBnbDetail(id) { const b = tBnBs.find(x => x.id === id); if (!b) return; drawerData.value = b; drawerTitle.value = b.name; drawerOpen.value = true }

// ECharts

function initPestCharts(){
  const el1=document.getElementById('chart_pest_trend')
  if(el1){
    const c=echarts.init(el1)
    var td=[2,3,5,1,4,2,6,3,5,2,4,3,5,1,4,2,3,5,2,4,3,5,1,3,2,4,1,5,3,2]
    c.setOption({tooltip:{trigger:'axis',backgroundColor:'rgba(4,18,40,0.95)',borderColor:'rgba(57,217,138,0.30)',textStyle:{color:'#c8daea',fontSize:10}},grid:{left:8,right:16,top:8,bottom:20},xAxis:{type:'category',data:Array.from({length:30},(_,i)=>String(i+1)),axisLabel:{color:'#5e7a9a',fontSize:7}},yAxis:{type:'value',axisLabel:{color:'#5e7a9a',fontSize:9},splitLine:{lineStyle:{color:'rgba(14,165,233,0.06)'}}},series:[{type:'line',data:td,smooth:true,lineStyle:{color:'#E74C3C',width:2},itemStyle:{color:'#E74C3C'},symbol:'none'}]})
  }
  const el2=document.getElementById('chart_pest_pie')
  if(el2){
    const c=echarts.init(el2)
    var pd=[{value:15,name:'稻瘟病',itemStyle:{color:'#E74C3C'}},{value:9,name:'猪呼吸道',itemStyle:{color:'#f59e0b'}},{value:7,name:'蚜虫',itemStyle:{color:'#28C7FA'}},{value:5,name:'球虫病',itemStyle:{color:'#39D98A'}},{value:3,name:'霜霉病',itemStyle:{color:'#A77BFF'}}]
    c.setOption({tooltip:{trigger:'item',backgroundColor:'rgba(4,18,40,0.95)',borderColor:'rgba(57,217,138,0.30)',textStyle:{color:'#c8daea',fontSize:10}},series:[{type:'pie',radius:['55%','78%'],center:['50%','52%'],itemStyle:{borderColor:'rgba(8,28,58,0.92)',borderWidth:2},label:{color:'#5e7a9a',fontSize:9},data:pd}]})
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
    else if (k === 'monitor') { const el = document.getElementById('chart_monitor'); if (el) { chartInstance = echarts.init(el); const bars = []; for (let i = 0; i < 24; i++) bars.push({ value: 35 + Math.random() * 65, itemStyle: { color: '#39D98A' } }); chartInstance.setOption({ grid: { left: 4, right: 4, top: 8, bottom: 4 }, xAxis: { show: false, data: Array.from({ length: 24 }, (_, i) => i) }, yAxis: { show: false }, series: [{ type: 'bar', barWidth: '70%', data: bars, itemStyle: { borderRadius: [2, 2, 0, 0], opacity: 0.8 } }] }) } }
    else if (k === 'env') { const el = document.getElementById('chart_env'); if (el) { chartInstance = echarts.init(el); chartInstance.setOption({ grid: { left: 4, right: 4, top: 8, bottom: 4 }, xAxis: { show: false, data: envData.map(d => d.time) }, yAxis: { show: false }, series: [{ type: 'bar', barWidth: '60%', data: envData.map(d => ({ value: 40 + (d.temp - 25) * 15, itemStyle: { color: '#39D98A' } })), itemStyle: { borderRadius: [2, 2, 0, 0], opacity: 0.7 } }] }) } }
  })
}
function initPieChart(id, data) {
  const el = document.getElementById(id); if (!el) return
  const colors = ['#28C7FA', '#39D98A', '#f59e0b', '#E74C3C', '#28C7FA', '#39D98A']
  chartInstance = echarts.init(el)
  chartInstance.setOption({
    tooltip: { trigger: 'item', backgroundColor: 'rgba(4,18,40,0.95)', borderColor: 'rgba(57,217,138,0.30)', textStyle: { color: '#c8daea', fontSize: 10 } },
    series: [{ type: 'pie', radius: ['50%', '72%'], center: ['50%', '50%'], itemStyle: { borderColor: 'rgba(8,28,58,0.92)', borderWidth: 2 }, label: { color: '#5e7a9a', fontSize: 9 }, data: data.map((d, i) => ({ ...d, itemStyle: { color: colors[i % colors.length] } })) }]
  })
}
function initLivestockChart() {
  const el = document.getElementById('chart_records2'); if (!el) return
  chartInstance = echarts.init(el)
  var g1=new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#f59e0b'},{offset:1,color:'rgba(245,158,11,.2)'}])
  var g2=new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#39D98A'},{offset:1,color:'rgba(16,214,160,.2)'}])
  var g3=new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#28C7FA'},{offset:1,color:'rgba(139,92,246,.2)'}])
  chartInstance.setOption({
    tooltip:{trigger:'axis',backgroundColor:'rgba(4,18,40,0.95)',borderColor:'rgba(57,217,138,0.30)',textStyle:{color:'#c8daea',fontSize:10}},
    grid:{left:8,right:20,top:10,bottom:24},
    xAxis:{type:'category',data:['澳洲淡水龙虾','鲈鱼','罗非鱼'],axisLabel:{color:'#5e7a9a',fontSize:9}},
    yAxis:{type:'value',name:'尾',axisLabel:{color:'#5e7a9a',fontSize:9},splitLine:{lineStyle:{color:'rgba(14,165,233,0.06)'}}},
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
  const data = { lands: [...lands], crops: [...crops], records: [...records], products: [...products], tSpots: [...tSpots], tBnBs: [...tBnBs], livestock: [...livestock], feedData: [...feedData], slaughterData: [...slaughterData], bnbOrders: [...bnbOrders], ecoOrders: [...ecoOrders], activities: [...activities], diseaseAlerts: [...diseaseAlerts], uidCounter }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
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
.ind-page { min-height: 100vh; background: #071B2D; color: #B7D3E8; display: flex; flex-direction: column; }
.hdr { flex-shrink: 0; height: 48px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; background: linear-gradient(180deg, rgba(10,50,100,0.15), rgba(6,20,44,0.05)); border-bottom: 1px solid rgba(0,0,0,0.06); color: #B7D3E8; }
.hdr-l { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: 1px; display: flex; align-items: center; gap: 10px; }
.hdr-l a { color: #6F91A8; text-decoration: none; font-size: 13px; }
.hdr-r { display: flex; align-items: center; gap: 14px; font-size: 10px; color: #6F91A8; }
.hdr-r a { color: #6F91A8; text-decoration: none; }

.mod-tabs { flex-shrink: 0; display: flex; background: rgba(8,28,58,0.65); border-bottom: 1px solid rgba(40,199,111,0.08); padding: 0 16px; }
.mod-tabs button { padding: 8px 18px; font-size: 12px; font-weight: 600; cursor: pointer; color: #6F91A8; border-bottom: 2px solid transparent; transition: all .2s; background: none; border-top: none; border-left: none; border-right: none; letter-spacing: .5px; font-family: inherit; }
.mod-tabs button:hover { color: #B7D3E8; }
.mod-tabs button.on { color: #28C76F; border-bottom-color: #39D98A; }

.sub-tabs { flex-shrink: 0; display: flex; padding: 0 16px; background: rgba(10,36,68,0.55); }
.sub-tabs button { padding: 4px 14px; font-size: 11px; font-weight: 500; cursor: pointer; color: #6F91A8; transition: all .2s; background: none; border: none; border-bottom: 2px solid transparent; font-family: inherit; }
.sub-tabs button:hover { color: #B7D3E8; }
.sub-tabs button.on { color: #28C76F; border-bottom-color: #39D98A; }

.content { flex: 1; overflow-y: auto; padding: 14px 18px; min-height: 0; }
.content::-webkit-scrollbar { width: 4px; }
.content::-webkit-scrollbar-thumb { background: rgba(57,217,138,0.12); border-radius: 2px; }
.bc { font-size: 10px; color: #6F91A8; margin-bottom: 4px; }
.bc a { color: #6F91A8; text-decoration: none; }
.bc span { color: #28C76F; }
.pg-tt { font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 12px; }

.srow { display: flex; gap: 14px; margin-bottom: 14px; flex-wrap: wrap; }
.scard { flex: 1; min-width: 130px; height: 145px; padding: 24px; display: flex; justify-content: space-between; align-items: flex-start; background: rgba(5,25,48,0.92); border: 1px solid rgba(205,224,241,0.78); border-radius: 10px; box-sizing: border-box; box-shadow: inset 0 0 18px rgba(25,101,147,0.08), 0 0 0 1px rgba(22,87,126,0.12); transition: transform .2s, border-color .2s, box-shadow .2s; }
.scard:hover { border-color: rgba(72,193,255,0.95); box-shadow: inset 0 0 22px rgba(20,135,196,0.12), 0 0 16px rgba(24,143,210,0.16); transform: translateY(-2px); }
.scard .sv { font-size: 22px; font-weight: 700; color: #28C76F; font-family: "SF Mono", Consolas, monospace; }
.scard .sl { font-size: 10px; color: rgba(159,187,207,0.82); margin-top: 2px; }
.scard.g .sv { color: #28C76F; }
.scard.y .sv { color: #F5B83D; }
.scard.r .sv { color: #E74C3C; }

.panel { background: rgba(8,24,48,0.88); backdrop-filter: blur(12px); border: 1px solid rgba(205,224,241,0.78); border-radius: 10px; padding: 14px 18px; margin-bottom: 14px; box-shadow: inset 0 0 18px rgba(25,101,147,0.08), 0 0 0 1px rgba(22,87,126,0.12); }
.panel .tt { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; letter-spacing: 1px; }
.panel .tt::before { content: ''; width: 3px; height: 13px; border-radius: 2px; background: #28C76F; }

/* Module cards */
.module-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px; padding: 14px 16px 20px; }
.module-card { position: relative; min-height: 218px; display: flex; flex-direction: column; width: 100%; background: linear-gradient(180deg, rgba(8,29,55,0.96) 0%, rgba(5,22,43,0.96) 100%); border: 1px solid rgba(205,224,241,0.78); border-radius: 10px; padding: 22px 22px 18px; box-sizing: border-box; box-shadow: inset 0 0 18px rgba(25,101,147,0.08), 0 0 0 1px rgba(22,87,126,0.12); transition: transform .2s, border-color .2s, box-shadow .2s; cursor: pointer; }
.module-card:hover { transform: translateY(-2px); border-color: rgba(72,193,255,0.95); box-shadow: inset 0 0 22px rgba(20,135,196,0.12), 0 0 16px rgba(24,143,210,0.16); }
.module-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: rgba(10,61,92,0.72); font-size: 23px; margin-bottom: 16px; }
.module-title { margin: 0 0 8px; color: #fff; font-size: 19px; font-weight: 700; line-height: 1.3; }
.module-desc { min-height: 44px; margin: 0 0 16px; color: rgba(159,187,207,0.82); font-size: 14px; line-height: 1.55; }
.module-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; }
.module-tag { display: inline-flex; align-items: center; height: 25px; padding: 0 11px; color: #13df92; font-size: 12px; border-radius: 14px; background: rgba(0,116,88,0.36); border: 1px solid rgba(6,174,126,0.10); }

.toolbar { display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap; align-items: center; }
.toolbar .spacer { flex: 1; }
.toolbar input { padding: 6px 10px; border-radius: 8px; font-size: 11px; font-family: inherit; background: rgba(57,217,138,0.06); border: 1px solid rgba(40,199,111,0.10); color: #B7D3E8; outline: none; width: 200px; }

table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 8px 12px; text-align: left; font-size: 11px; }
th { background: rgba(10,36,68,0.55); font-weight: 600; color: #6F91A8; border-bottom: 2px solid rgba(40,199,111,0.10); font-size: 10px; }
td { border-bottom: 1px solid rgba(14,165,233,0.06); }
tr:hover td { background: rgba(14,165,233,0.05); cursor: pointer; }

.tag { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; }
.tag.g { background: rgba(16,214,160,.15); color: #28C76F; }
.tag.b { background: rgba(57,217,138,0.12); color: #28C76F; }
.tag.y { background: rgba(245,158,11,.15); color: #F5B83D; }
.tag.r { background: rgba(239,68,68,.15); color: #E74C3C; }
.tag.dim { background: rgba(100,120,140,.15); color: #6F91A8; }

.btn { display: inline-block; padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer; border: none; font-family: inherit; }
.btn-p { background: linear-gradient(135deg, #39D98A, #28C76F); color: #fff; box-shadow: 0 2px 8px rgba(57,217,138,0.20); }
.btn-o { background: transparent; border: 1px solid rgba(14,165,233,0.28); color: #28C76F; }
.btn-d { background: rgba(239,68,68,.15); border: 1px solid rgba(239,68,68,.25); color: #E74C3C; }
.btn-s { padding: 3px 9px; font-size: 10px; }

.pg { display: flex; justify-content: flex-end; gap: 4px; margin-top: 10px; font-size: 11px; align-items: center; }
.pg-btn { padding: 4px 10px; border-radius: 6px; background: rgba(57,217,138,0.06); border: 1px solid rgba(40,199,111,0.10); color: #6F91A8; cursor: pointer; }
.pg-btn:hover { color: #B7D3E8; }

.drawer-overlay { position: fixed; inset: 0; z-index: 90; background: rgba(0,0,0,.5); opacity: 0; pointer-events: none; transition: opacity .3s; }
.drawer-overlay.on { opacity: 1; pointer-events: auto; }
.drawer { position: fixed; top: 0; right: 0; bottom: 0; width: 460px; z-index: 100; background: rgba(6,20,44,.98); border-left: 1px solid rgba(40,199,111,0.10); transform: translateX(100%); transition: transform .3s cubic-bezier(.4,0,.2,1); display: flex; flex-direction: column; box-shadow: -8px 0 32px rgba(0,0,0,.4); }
.drawer.on { transform: translateX(0); }
.drawer-hd { flex-shrink: 0; padding: 14px 18px; border-bottom: 1px solid rgba(40,199,111,0.10); display: flex; justify-content: space-between; align-items: center; }
.drawer-hd h3 { font-size: 14px; font-weight: 700; color: #fff; }
.drawer-close { width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(40,199,111,0.10); background: rgba(10,60,130,.2); color: #B7D3E8; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; }
.drawer-bd { flex: 1; overflow-y: auto; padding: 16px 18px; }

.tl-item { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px solid rgba(14,165,233,0.06); align-items: flex-start; }
.tl-dot { width: 8px; height: 8px; border-radius: 50%; background: #28C76F; flex-shrink: 0; margin-top: 4px; }
.tl-dot.g { background: #28C76F; }
.tl-dot.y { background: #F5B83D; }
.tl-content { flex: 1; font-size: 11px; }
.tl-content .tlt { color: #fff; font-weight: 600; }
.tl-content .tld { color: #6F91A8; font-size: 10px; margin-top: 1px; }
.tl-content .tltm { color: #6F91A8; font-size: 9px; }

.alert-item { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 8px; background: rgba(10,36,68,0.55); font-size: 11px; }

.fld { margin-bottom: 10px; }
.fld label { display: block; font-size: 11px; color: #6F91A8; margin-bottom: 4px; }
.fld input, .fld select, .fld textarea { width: 100%; padding: 8px 10px; border-radius: 8px; font-size: 12px; font-family: inherit; background: rgba(57,217,138,0.06); border: 1px solid rgba(40,199,111,0.10); color: #B7D3E8; outline: none; }
.fld input:focus, .fld select:focus, .fld textarea:focus { border-color: #28C76F; }

/* Valve control cards */
.valve-card { height: 78px; background: linear-gradient(180deg, rgba(12,30,52,0.92), rgba(8,22,40,0.92)); border: 1px solid rgba(190,214,234,0.50); border-radius: 10px; padding: 0 18px; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box; }
.valve-info { display: flex; align-items: center; gap: 12px; }
.valve-icon { font-size: 26px; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: rgba(10,61,92,0.60); border-radius: 10px; flex-shrink: 0; }
.valve-name { font-weight: 600; color: #fff; font-size: 14px; line-height: 1.2; }
.valve-desc { font-size: 11px; color: rgba(159,187,207,0.65); margin-top: 1px; }
.valve-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
.valve-btn { padding: 5px 16px; border-radius: 14px; border: none; cursor: pointer; font-size: 11px; font-weight: 600; color: #fff; background: rgba(100,120,140,.35); transition: all .2s; white-space: nowrap; }
.valve-btn.on { background: linear-gradient(135deg, #39D98A, #28C76F); box-shadow: 0 2px 10px rgba(40,199,111,0.25); }
.valve-btn:hover { opacity: 0.9; }
.valve-runtime { font-size: 10px; color: #6F91A8; min-width: 70px; text-align: right; }
.valve-card { cursor: pointer; }
.valve-card.selected { border-color: rgba(72,193,255,0.95) !important; box-shadow: 0 0 16px rgba(24,143,210,0.16); }
.valve-detail-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.vd-item { background: rgba(10,36,68,0.55); padding: 12px; border-radius: 8px; }
.vd-label { display: block; font-size: 10px; color: #6F91A8; margin-bottom: 4px; }
.vd-val { font-size: 15px; font-weight: 700; color: #fff; }
.vd-highlight { color: #28C76F !important; }
.vd-on { color: #28C76F !important; }
.vd-off { color: #6F91A8 !important; }
.npk-bar { flex: 1; background: rgba(10,36,68,0.55); border-radius: 8px; padding: 10px; position: relative; overflow: hidden; }
.npk-fill { position: absolute; left: 0; bottom: 0; height: 4px; background: linear-gradient(90deg, #28C76F, #39D98A); border-radius: 2px; transition: width .6s; }
.npk-label { font-size: 11px; color: #B7D3E8; position: relative; z-index: 1; }
.frow { display: flex; gap: 10px; }
.frow .fld { flex: 1; }
.toast { padding: 10px 18px; border-radius: 6px; font-size: 12px; font-weight: 600; color: #fff; pointer-events: auto; animation: ti .3s ease, to .3s ease 2s forwards; }
.toast.ok { background: linear-gradient(135deg, #059669, #39D98A); }
.toast.info { background: linear-gradient(135deg, #39D98A, #28C76F); }
.toast.warn { background: linear-gradient(135deg, #d97706, #f59e0b); }
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
  background: rgba(5, 24, 47, 0.96) !important;
  border: 1px solid rgba(190, 214, 234, 0.78) !important;
  border-radius: 10px !important;
  box-shadow: none !important;
  min-height: 205px;
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
  border-color: rgba(65, 185, 245, 0.95) !important;
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
.spot-card{background:rgba(5,25,48,.96);border:1px solid rgba(190,214,234,.55);border-radius:10px;overflow:hidden;cursor:pointer;transition:.2s}.spot-card:hover{border-color:rgba(72,193,255,.95);transform:translateY(-2px)}
.spot-cover{height:220px;position:relative;display:flex;align-items:center;justify-content:center;border-radius:10px 10px 0 0;overflow:hidden}
.spot-cover-icon{font-size:56px;opacity:.5}
.spot-badge{position:absolute;top:10px;left:10px;color:#fff;font-size:10px;padding:3px 10px;border-radius:12px;font-weight:600}.spot-badge.hot{background:rgba(245,158,11,.88)}.spot-badge.rec{background:rgba(40,199,111,.88)}.spot-badge.new{background:rgba(14,165,233,.88)}
.spot-cover-status{position:absolute;bottom:8px;right:8px;font-size:10px;padding:3px 10px;border-radius:10px;background:rgba(0,0,0,.55);color:#fff}
.spot-card-name{font-size:15px;font-weight:700;color:#fff;margin-bottom:2px}
.spot-tag{display:inline-block;font-size:9px;padding:1px 8px;border-radius:10px;border:1px solid;font-weight:500}
.spot-card-rating{font-size:10px;color:#F5B83D;font-weight:600;margin-bottom:6px}
.spot-card-desc{font-size:11px;color:#6F91A8;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:4px}
.spot-card{display:flex;flex-direction:column}
.spot-detail-cover{height:120px;display:flex;align-items:center;justify-content:center;border-radius:8px;margin-bottom:10px}.spot-detail-icon{font-size:48px;opacity:.5}
</style>
