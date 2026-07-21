<template>
<div class="ec">
<header class="eh" v-if="!embedded"><router-link to="/dashboard">◀ 返回</router-link> 🛒 农产品电商中心 <span style="font-size:10px;color:#6F91A8;font-weight:400">商品发布—订单交易—质量溯源—直播营销—经营分析</span><span style="flex:1"></span><span class="clock">{{clock}}</span></header>
<div class="et"><button v-for="t in tabs" :key="t.k" :class="{on:cur===t.k}" @click="cur=t.k">{{t.i}} {{t.l}}</button></div>
<div class="eb">


<template v-if="cur==='products'">
<div>
<div class="sr">
<div class="sc"><div class="si">📦</div><div class="sv">{{prods.length}}<span class="st up">+2</span></div><div class="sl">商品总数 · 较上周</div></div>
<div class="sc g"><div class="si">✅</div><div class="sv">{{prods.filter(p=>p.status==='已上架').length}}<span class="st up">+1</span></div><div class="sl">已上架 · 较上周</div></div>
<div class="sc r"><div class="si">⚠️</div><div class="sv">{{prods.filter(p=>p.stock<50&&p.stock>0).length}}<span class="st">{{prods.filter(p=>p.stock===0).length}}售罄</span></div><div class="sl">库存预警 + 售罄</div></div>
<div class="sc"><div class="si">📊</div><div class="sv">¥{{prods.reduce((s,p)=>s+p.price*p.sales,0).toLocaleString()}}<span class="st up">12%</span></div><div class="sl">累计销售额 · 环比</div></div>
</div>
<div class="pn">
<div class="tt" style="justify-content:space-between"><span>📦 商品列表</span><div style="display:flex;gap:6px"><button class="bp bps" @click="openProdForm()">+ 新增</button><button class="bo bps" @click="batchAction('已上架')">批量上架</button><button class="bo bps" @click="batchAction('已下架')">批量下架</button><button class="bo bps" @click="exportProducts">导出</button></div></div>
<div class="fb"><input v-model="pf.search" placeholder="🔍 搜索商品..." class="fi" style="width:160px"><select v-model="pf.cat" class="fi"><option value="">全部分类</option><option v-for="c in cats" :key="c" :value="c">{{c}}</option></select><select v-model="pf.status" class="fi"><option value="">全部状态</option><option value="草稿">草稿</option><option value="待审核">待审核</option><option value="已上架">已上架</option><option value="已下架">已下架</option><option value="售罄">售罄</option></select><select v-model="pf.stockLevel" class="fi"><option value="">全部库存</option><option value="normal">正常</option><option value="low">偏低</option><option value="out">售罄</option></select><span style="flex:1"></span><label class="fl2"><input type="checkbox" v-model="pf.recommended"> 推荐</label><label class="fl2"><input type="checkbox" v-model="pf.certified"> 富硒认证</label></div>
<table class="tb"><thead><tr><th style="width:30px"><input type="checkbox" v-model="prodSelectAll" @change="toggleAllProds"></th><th>商品</th><th style="width:80px">价格</th><th style="width:100px">库存</th><th style="width:60px">销量</th><th style="width:80px">状态</th><th style="width:100px">操作</th></tr></thead>
<tbody><tr v-for="p in filteredProds" :key="p.id" :class="{rowWarn:p.stock<50&&p.stock>0,rowOut:p.stock===0}"><td><input type="checkbox" :value="p.id" v-model="prodSelected"></td>
<td @click="showProdDetail(p)" style="cursor:pointer"><div style="display:flex;align-items:center;gap:10px"><div class="pimg" :style="{background:p._color||'rgba(10,61,92,0.55)'}">{{p._icon||'📦'}}</div><div><div class="pn2">{{p.name}}<span v-for="tag in (p.tags||[]).slice(0,2)" :key="tag" class="t g" style="margin-left:4px;font-size:8px">{{tag}}</span></div><div class="pd">{{p.spec||''}} · {{p.origin||''}} · 批次{{p.batch||'--'}}</div></div></div></td>
<td style="color:#28C76F;font-weight:600">¥{{p.price}}</td>
<td><div class="stock-bar"><div class="stock-fill" :class="p.stock===0?'out':p.stock<20?'low':p.stock<50?'warn':'ok'" :style="{width:Math.min(100,p.stock/200*100)+'%'}"></div></div><div :class="p.stock===0?'c-red':p.stock<20?'c-red':p.stock<50?'c-yel':''" style="font-size:10px;margin-top:2px">{{p.stock}}{{p.unit||'件'}}<span v-if="p.stock===0" style="color:#E74C3C"> 售罄</span><span v-else-if="p.stock<20" style="color:#E74C3C"> 紧缺</span><span v-else-if="p.stock<50" style="color:#F5B83D"> 偏低</span></div></td>
<td>{{p.sales}}</td>
<td><span :class="'t '+statusCls(p.status)">{{p.status}}</span></td>
<td><button class="bp bps" @click="showProdDetail(p)">查看</button><button class="bo bps" @click="openProdForm(p.id)">编辑</button><div class="dd-wrap"><button class="bo bps" @click="p._more=!p._more">···</button><div v-if="p._more" class="dd-menu"><div @click="toggleProd(p.id);p._more=false">{{p.status==='已上架'?'下架':'上架'}}</div><div @click="p._more=false;toast('已复制','ok')">复制商品</div><div @click="p._more=false;toast('溯源码已生成','ok')">生成溯源码</div><div @click="delProd(p.id);p._more=false">删除</div></div></div></td></tr></tbody></table>
<div class="pg2"><span style="color:#6F91A8;font-size:10px">共 {{filteredProds.length}} 条</span></div>
</div>
</div>

<!-- Product Detail Drawer -->
<div class="dov2" :class="{on:prodDrawer}" @click="prodDrawer=false"></div>
<div class="dw2" :class="{on:prodDrawer}">
<div class="dwh2"><h3>{{prodDetail?.name||'商品详情'}}</h3><button class="mc" @click="prodDrawer=false">✕</button></div>
<div class="dwb2" v-if="prodDetail">
<div class="pimg-lg" :style="{background:prodDetail._color||'rgba(10,61,92,0.55)'}">{{prodDetail._icon||'📦'}}</div>
<div class="dg3"><span class="dl3">商品名称</span><div style="color:#fff;font-weight:600">{{prodDetail.name}}</div></div>
<div class="dg3"><span class="dl3">分类</span><div>{{prodDetail.cat}}</div></div>
<div class="dg3"><span class="dl3">价格</span><div style="color:#28C76F;font-weight:600">¥{{prodDetail.price}} / {{prodDetail.unit||'件'}}</div></div>
<div class="dg3"><span class="dl3">库存</span><div :class="prodDetail.stock===0?'c-red':prodDetail.stock<50?'c-yel':''">{{prodDetail.stock}}{{prodDetail.unit||'件'}}</div></div>
<div class="dg3"><span class="dl3">销量</span><div>{{prodDetail.sales}}</div></div>
<div class="dg3"><span class="dl3">规格</span><div>{{prodDetail.spec||'--'}}</div></div>
<div class="dg3"><span class="dl3">产地</span><div>{{prodDetail.origin||'--'}}</div></div>
<div class="dg3"><span class="dl3">批次号</span><div style="color:#28C76F">{{prodDetail.batch||'--'}}</div></div>
<div class="dg3"><span class="dl3">采摘日期</span><div>{{prodDetail.harvestDate||'--'}}</div></div>
<div class="dg3"><span class="dl3">认证标签</span><div><span v-for="tag in (prodDetail.tags||[])" :key="tag" class="t g" style="margin-right:3px">{{tag}}</span><span v-if="!(prodDetail.tags||[]).length" style="color:#6F91A8">无</span></div></div>
<div class="dg3"><span class="dl3">状态</span><div><span :class="'t '+statusCls(prodDetail.status)">{{prodDetail.status}}</span></div></div>
<div class="dg3"><span class="dl3">订单记录</span><div style="color:#6F91A8;font-size:10px">最近 {{allOrders.filter(o=>o.item&&o.item.includes(prodDetail.name)).length}} 笔订单</div></div>
</div>
</div>
</template>

<template v-if="cur==='orders'">
<div>
<div class="sr"><div class="sc"><div class="sv">{{allOrders.length}}</div><div class="sl">全部订单</div></div><div class="sc y"><div class="sv">{{allOrders.filter(o=>o.status==='待发货').length}}</div><div class="sl">待发货</div></div><div class="sc g"><div class="sv">{{allOrders.filter(o=>o.status==='已完成').length}}</div><div class="sl">已完成</div></div><div class="sc r"><div class="sv">{{allOrders.filter(o=>o.status==='售后退款').length}}</div><div class="sl">售后</div></div><div class="sc"><div class="sv">¥{{allOrders.reduce((s,o)=>s+(o.amount||0),0).toLocaleString()}}</div><div class="sl">总金额</div></div></div>
<div class="pn"><div class="tt">快捷操作</div><div style="display:flex;gap:6px;flex-wrap:wrap"><button class="bp" @click="openOrderForm()">+ 新增订单</button><button class="bo" @click="batchShip">批量发货</button><button class="bo" @click="exportOrders">导出订单</button></div></div>
<div class="pn"><div class="tt">订单列表</div>
<div class="fb"><select v-model="of.status" class="fi"><option value="">全部状态</option><option value="待付款">待付款</option><option value="待发货">待发货</option><option value="已发货">已发货</option><option value="已完成">已完成</option><option value="已取消">已取消</option><option value="售后退款">售后退款</option></select><input v-model="of.search" placeholder="搜索..." class="fi" style="width:180px"></div>
<table class="tb"><thead><tr><th>订单号</th><th>商品</th><th>买家</th><th>金额</th><th>物流</th><th>状态</th><th>操作</th></tr></thead>
<tbody><tr v-for="o in filteredOrders" :key="o.id"><td style="color:#28C76F">{{o.id}}</td><td>{{o.item}}</td><td>{{o.buyer}}<div class="pd">{{o.phone||''}} . {{o.addr||''}}</div></td><td>¥{{o.amount}}</td><td>{{o.logistics||'--'}}</td><td><span :class="'t '+orderCls(o.status)">{{o.status}}</span></td><td><button class="bp bps" @click="showOrderDetail(o)">详情</button><button class="bo bps" @click="advanceOrder(o)">流转</button><button class="bd bps" v-if="o.status==='待付款'||o.status==='待发货'" @click="cancelOrder(o)">取消</button></td></tr></tbody></table>
</div>
</div>
</template>

<template v-if="cur==='trace'">
<div>
<div class="sr"><div class="sc"><div class="sv">{{traces.length}}</div><div class="sl">溯源批次</div></div><div class="sc g"><div class="sv">{{traces.filter(t=>t.scans>0).reduce((s,t)=>s+t.scans,0)}}</div><div class="sl">扫码次数</div></div><div class="sc y"><div class="sv">{{traces.filter(t=>t.status==='异常').length}}</div><div class="sl">异常批次</div></div></div>
<div class="pn"><div class="tt">快捷操作</div><div style="display:flex;gap:6px;flex-wrap:wrap"><button class="bp" @click="openTraceForm()">+ 新增批次</button><button class="bo" @click="exportTraces">导出溯源数据</button></div></div>
<div class="pn"><div class="tt">溯源批次管理</div>
<div class="fb"><button class="bp bps" @click="openTraceForm()">新增</button><span style="flex:1"></span></div>
<table class="tb"><thead><tr><th>批次号</th><th>产品</th><th>产地</th><th>地块</th><th>采摘日期</th><th>检测</th><th>扫码</th><th>状态</th><th>操作</th></tr></thead>
<tbody><tr v-for="t in traces" :key="t.id"><td style="color:#28C76F">{{t.batch}}</td><td>{{t.product}}</td><td>{{t.origin}}</td><td>{{t.plot}}</td><td>{{t.harvestDate}}</td><td><span :class="'t '+(t.inspection==='合格'?'g':'r')">{{t.inspection}}</span></td><td>{{t.scans}}次</td><td><span :class="'t '+(t.status==='正常'?'g':'r')">{{t.status}}</span></td><td><button class="bp bps" @click="showTraceQR(t)">二维码</button><button class="bo bps" @click="showTraceDetail(t)">详情</button><button class="bd bps" v-if="t.status==='异常'" @click="recallTrace(t)">召回</button></td></tr></tbody></table>
</div>
</div>
</template>

<template v-if="cur==='live'">
<div>
<div class="sr"><div class="sc"><div class="sv">{{lives.length}}</div><div class="sl">直播场次</div></div><div class="sc g"><div class="sv">{{lives.reduce((s,l)=>s+(l.views||0),0).toLocaleString()}}</div><div class="sl">累计观看</div></div><div class="sc y"><div class="sv">{{(lives.reduce((s,l)=>s+(l.sales||0),0)/10000).toFixed(1)}}万</div><div class="sl">成交金额</div></div></div>
<div class="pn"><div class="tt">快捷操作</div><div style="display:flex;gap:6px;flex-wrap:wrap"><button class="bp" @click="addLive">+ 创建直播</button><button class="bo" @click="startSimLive">模拟开播</button><button class="bo" @click="exportLives">导出数据</button></div></div>
<div class="pn"><div class="tt">直播间管理</div>
<table class="tb"><thead><tr><th>主题</th><th>主播</th><th>时间</th><th>时长</th><th>观看</th><th>点赞</th><th>销售</th><th>状态</th><th>操作</th></tr></thead>
<tbody><tr v-for="l in lives" :key="l.id"><td style="color:#fff;font-weight:600">{{l.title}}</td><td>{{l.host}}</td><td>{{l.time}}</td><td>{{l.duration}}</td><td>{{(l.views||0).toLocaleString()}}</td><td>{{(l.likes||0).toLocaleString()}}</td><td style="color:#28C76F">{{(l.sales||0).toLocaleString()}}</td><td><span :class="'t '+(l.status==='预告'?'y':l.status==='进行中'?'g':'dim')">{{l.status}}</span></td><td><button class="bp bps" @click="editLive(l.id)">编辑</button><button class="bo bps" @click="showLiveDetail(l)">详情</button><button class="bd bps" @click="delLive(l.id)">删除</button></td></tr></tbody></table>
</div>
</div>
</template>

<template v-if="cur==='analytics'">
<div>
<div class="sr"><div class="sc"><div class="sv">{{allOrders.length}}</div><div class="sl">今日订单</div></div><div class="sc g"><div class="sv">¥{{allOrders.reduce((s,o)=>s+(o.amount||0),0).toLocaleString()}}</div><div class="sl">销售额</div></div><div class="sc y"><div class="sv">¥{{Math.round(allOrders.reduce((s,o)=>s+(o.amount||0),0)/Math.max(allOrders.length,1))}}</div><div class="sl">客单价</div></div><div class="sc r"><div class="sv">{{allOrders.filter(o=>o.status==='售后退款').length}}单</div><div class="sl">退款</div></div><div class="sc"><div class="sv">{{traces.reduce((s,t)=>s+t.scans,0)}}次</div><div class="sl">扫码次数</div></div></div>
<div style="display:flex;gap:8px;margin-bottom:8px"><div class="pn" style="flex:1"><div class="tt">销售趋势（测试A）</div><div id="ca1" style="height:180px"></div></div><div class="pn" style="flex:1"><div class="tt">商品销量占比</div><div id="ca2" style="height:180px"></div></div></div>
<div style="display:flex;gap:8px"><div class="pn" style="flex:1"><div class="tt">热销排行</div><div v-for="(p,i) in topProds" :key="p.id" class="ri"><span class="rn">{{i+1}}</span><span>{{p.name}}</span><span class="rc">¥{{(p.price*p.sales).toLocaleString()}}</span></div></div><div class="pn" style="flex:1"><div class="tt">库存预警</div><div v-for="p in prods.filter(p=>p.stock<50)" :key="p.id" class="ri"><span class="rn" style="color:#E74C3C">!</span><span>{{p.name}}</span><span class="rc" style="color:#E74C3C">{{p.stock}}件</span></div></div><div class="pn" style="flex:1"><div class="tt">客户地区分布</div><div class="ri" v-for="a in areaDist" :key="a.n"><span>{{a.n}}</span><span class="rc">{{a.c}}单</span></div></div></div>
</div>
</template>

</div>

<div class="mo" :class="{on:modal}" @click="modal=false"><div class="mb" @click.stop><div class="mh">{{modalTitle}}<button class="mc" @click="modal=false">x</button></div>
<div v-if="modalType==='prod'">
<div class="fl"><label>商品名称</label><input v-model="pf2.name" class="fin"></div>
<div class="fr3"><div class="fl"><label>分类</label><select v-model="pf2.cat" class="fin"><option v-for="c in cats" :key="c" :value="c">{{c}}</option></select></div><div class="fl"><label>价格(元)</label><input v-model="pf2.price" type="number" class="fin"></div></div>
<div class="fr3"><div class="fl"><label>库存</label><input v-model="pf2.stock" type="number" class="fin"></div><div class="fl"><label>单位</label><input v-model="pf2.unit" class="fin"></div></div>
<div class="fr3"><div class="fl"><label>规格</label><input v-model="pf2.spec" class="fin"></div><div class="fl"><label>产地</label><input v-model="pf2.origin" class="fin"></div></div>
<div class="fr3"><div class="fl"><label>批次号</label><input v-model="pf2.batch" class="fin"></div><div class="fl"><label>采摘日期</label><input v-model="pf2.harvestDate" class="fin"></div></div>
<div class="fl"><label>标签</label><input v-model="pf2.tagsStr" class="fin" placeholder="富硒认证,绿色食品（逗号分隔）"></div>
<div class="ma"><button class="bp" @click="saveProd">保存</button><button class="bo" @click="modal=false">取消</button></div>
</div>
<div v-if="modalType==='order'">
<div class="fl"><label>商品</label><input v-model="of2.item" class="fin"></div><div class="fr3"><div class="fl"><label>买家</label><input v-model="of2.buyer" class="fin"></div><div class="fl"><label>金额</label><input v-model="of2.amount" type="number" class="fin"></div></div>
<div class="fr3"><div class="fl"><label>联系电话</label><input v-model="of2.phone" class="fin"></div><div class="fl"><label>地址</label><input v-model="of2.addr" class="fin"></div></div>
<div class="fl"><label>物流单号</label><input v-model="of2.logistics" class="fin"></div>
<div class="ma"><button class="bp" @click="saveOrder">保存</button><button class="bo" @click="modal=false">取消</button></div>
</div>
<div v-if="modalType==='trace'">
<div class="fl"><label>产品名称</label><input v-model="tf.product" class="fin"></div><div class="fr3"><div class="fl"><label>批次号</label><input v-model="tf.batch" class="fin"></div><div class="fl"><label>产地</label><input v-model="tf.origin" class="fin"></div></div>
<div class="fr3"><div class="fl"><label>地块</label><input v-model="tf.plot" class="fin"></div><div class="fl"><label>采摘日期</label><input v-model="tf.harvestDate" class="fin"></div></div>
<div class="fr3"><div class="fl"><label>检测结果</label><select v-model="tf.inspection" class="fin"><option>合格</option><option>不合格</option></select></div><div class="fl"><label>负责人</label><input v-model="tf.manager" class="fin"></div></div>
<div class="ma"><button class="bp" @click="saveTrace">保存</button><button class="bo" @click="modal=false">取消</button></div>
</div>
<div v-if="modalType==='orderDetail'"><div class="dg2"><span class="dl2">订单号</span><div style="color:#28C76F;font-weight:600">{{od?.id}}</div></div><div class="dg2"><span class="dl2">商品</span><div>{{od?.item}}</div></div><div class="dg2"><span class="dl2">买家</span><div>{{od?.buyer}} . {{od?.phone}} . {{od?.addr}}</div></div><div class="dg2"><span class="dl2">金额</span><div style="color:#28C76F;font-weight:600">¥{{od?.amount}}</div></div><div class="dg2"><span class="dl2">物流</span><div>{{od?.logistics||'未填写'}}</div></div><div class="dg2"><span class="dl2">状态</span><div><span :class="'t '+orderCls(od?.status)">{{od?.status}}</span></div></div><div class="ma"><button class="bo" @click="modal=false">关闭</button></div></div>
<div v-if="modalType==='liveDetail'"><div class="dg2"><span class="dl2">主题</span><div style="color:#fff;font-weight:600">{{ld?.title}}</div></div><div class="dg2"><span class="dl2">主播</span><div>{{ld?.host}}</div></div><div class="dg2"><span class="dl2">时间</span><div>{{ld?.time}} . {{ld?.duration}}</div></div><div class="dg2"><span class="dl2">观看/点赞</span><div>{{(ld?.views||0).toLocaleString()}}/{{(ld?.likes||0).toLocaleString()}}</div></div><div class="dg2"><span class="dl2">销售</span><div style="color:#28C76F;font-weight:600">{{(ld?.sales||0).toLocaleString()}}</div></div><div class="ma"><button class="bo" @click="modal=false">关闭</button></div></div>
<div v-if="modalType==='traceDetail'"><div class="dg2"><span class="dl2">批次号</span><div style="color:#28C76F">{{td?.batch}}</div></div><div class="dg2"><span class="dl2">产品</span><div>{{td?.product}}</div></div><div class="dg2"><span class="dl2">产地/地块</span><div>{{td?.origin}} . {{td?.plot}}</div></div><div class="dg2"><span class="dl2">采摘</span><div>{{td?.harvestDate}}</div></div><div class="dg2"><span class="dl2">检测</span><div><span :class="'t '+(td?.inspection==='合格'?'g':'r')">{{td?.inspection}}</span></div></div><div class="dg2"><span class="dl2">负责人</span><div>{{td?.manager}}</div></div><div class="ma"><button class="bo" @click="modal=false">关闭</button></div></div>
<div v-if="modalType==='qr'"><div style="text-align:center"><div style="width:180px;height:180px;background:#fff;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-size:24px;font-family:monospace">{{td?.batch}}</div><div style="margin-top:8px;color:#6F91A8;font-size:11px">模拟溯源码 . 扫码 {{td?.scans}} 次</div></div><div class="ma" style="justify-content:center"><button class="bp" @click="toast('溯源码已下载','ok')">下载二维码</button><button class="bo" @click="modal=false">关闭</button></div></div>
</div></div>

<div class="toast-area"><div v-for="t in toasts" :key="t.id" :class="'to '+t.type">{{t.msg}}</div></div>
</div>
</template>
<script setup>
import {ref,reactive,computed,onMounted,nextTick} from 'vue'
import * as echarts from 'echarts'
const props=defineProps({embedded:Boolean})
const toasts=reactive([])
function toast(m,t='info'){const id=Date.now();toasts.push({id,msg:m,type:t});setTimeout(()=>{const i=toasts.findIndex(x=>x.id===id);if(i>=0)toasts.splice(i,1)},2300)}

const clock=ref('')
onMounted(()=>{setInterval(()=>{const d=new Date();clock.value=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')+':'+String(d.getSeconds()).padStart(2,'0')},1000);nextTick(()=>initCharts())})

const tabs=[{k:'products',i:'📦',l:'商品管理'},{k:'orders',i:'📋',l:'订单管理'},{k:'trace',i:'🏷️',l:'产品溯源'},{k:'live',i:'📺',l:'直播中心'},{k:'analytics',i:'📊',l:'数据分析'}]
const cur=ref('products')
const cats=['水果类','水产类','蔬菜类','特色农产品','粮油类']
let uid=()=>Date.now()

const prods=reactive([
  {id:1,name:'蜂糖李',cat:'水果类',price:128,stock:180,unit:'斤',spec:'大果 2.5kg/箱',origin:'中堰村产业园东区',batch:'P2026001',harvestDate:'2026-07-01',sales:980,status:'已上架',tags:['富硒认证','绿色食品'],_icon:'🍑',_color:'rgba(231,120,60,.25)'},
  {id:2,name:'富硒黄桃',cat:'水果类',price:88,stock:320,unit:'斤',spec:'精品 5kg/箱',origin:'中堰村产业园南区',batch:'P2026002',harvestDate:'2026-07-05',sales:1560,status:'已上架',tags:['富硒认证'],_icon:'🍑',_color:'rgba(248,180,0,.25)'},
  {id:3,name:'阳光玫瑰葡萄',cat:'水果类',price:68,stock:15,unit:'斤',spec:'1.5kg/箱',origin:'中堰村产业园西区',batch:'P2026003',harvestDate:'2026-07-10',sales:720,status:'已上架',tags:[],_icon:'🍇',_color:'rgba(139,92,246,.25)'},
  {id:4,name:'澳洲淡水龙虾',cat:'水产类',price:268,stock:0,unit:'斤',spec:'活虾 1kg/袋',origin:'中堰村智能水产基地',batch:'P2026004',harvestDate:'2026-07-15',sales:320,status:'售罄',tags:[],_icon:'🦞',_color:'rgba(231,76,60,.25)'},
  {id:5,name:'农特产礼盒',cat:'特色农产品',price:198,stock:25,unit:'盒',spec:'蜂糖李+黄桃+油葵籽',origin:'中堰村',batch:'P2026005',harvestDate:'2026-07-16',sales:180,status:'已上架',tags:['限时','推荐'],_icon:'🎁',_color:'rgba(40,199,111,.25)'}
])
const pf=reactive({search:'',cat:'',status:'',stockLevel:'',recommended:false,certified:false})
const prodSelected=ref([]),prodSelectAll=ref(false)
const pf2=reactive({name:'',cat:'水果类',price:'',stock:'',unit:'件',spec:'',origin:'',batch:'',harvestDate:'',tagsStr:''})
const modalEditId=ref(null)
function statusCls(s){return s==='已上架'?'g':s==='草稿'?'dim':s==='待审核'?'y':s==='已下架'?'dim':s==='售罄'?'r':'dim'}
const filteredProds=computed(()=>{let l=prods;if(pf.search){const s=pf.search.toLowerCase();l=l.filter(p=>p.name.toLowerCase().includes(s)||p.batch?.toLowerCase().includes(s))};if(pf.cat)l=l.filter(p=>p.cat===pf.cat);if(pf.status)l=l.filter(p=>p.status===pf.status);if(pf.stockLevel==='normal')l=l.filter(p=>p.stock>=50);if(pf.stockLevel==='low')l=l.filter(p=>p.stock>0&&p.stock<50);if(pf.stockLevel==='out')l=l.filter(p=>p.stock===0);if(pf.recommended)l=l.filter(p=>(p.tags||[]).includes('推荐'));if(pf.certified)l=l.filter(p=>(p.tags||[]).includes('富硒认证'));return l})
function toggleAllProds(){prodSelected.value=prodSelectAll.value?prods.map(p=>p.id):[]}
const prodDrawer=ref(false),prodDetail=ref(null)
function showProdDetail(p){prodDetail.value=p;prodDrawer.value=true}
function openProdForm(id){if(id){const p=prods.find(x=>x.id===id);if(p){Object.assign(pf2,{name:p.name,cat:p.cat,price:p.price,stock:p.stock,unit:p.unit||'件',spec:p.spec||'',origin:p.origin||'',batch:p.batch||'',harvestDate:p.harvestDate||'',tagsStr:(p.tags||[]).join(',')});modalEditId.value=id}}else{Object.assign(pf2,{name:'',cat:'水果类',price:'',stock:'',unit:'件',spec:'',origin:'',batch:'',harvestDate:'',tagsStr:''});modalEditId.value=null};modalTitle.value=id?'编辑商品':'新增商品';modalType.value='prod';modal.value=true}
function saveProd(){const tags=pf2.tagsStr?pf2.tagsStr.split(',').map(t=>t.trim()).filter(Boolean):[];const obj={name:pf2.name||'未命名',cat:pf2.cat,price:parseInt(pf2.price)||0,stock:parseInt(pf2.stock)||0,unit:pf2.unit,spec:pf2.spec,origin:pf2.origin,batch:pf2.batch,harvestDate:pf2.harvestDate,tags,sales:0,status:'上架'};if(modalEditId.value){const i=prods.findIndex(x=>x.id===modalEditId.value);if(i>=0)prods[i]={...prods[i],...obj};toast('已更新','ok')}else{prods.unshift({id:uid(),...obj});toast('已新增','ok')};modal.value=false}
function toggleProd(id){const p=prods.find(x=>x.id===id);if(p){p.status=p.status==='上架'?'下架':'上架';toast('已'+p.status,'ok')}}
function delProd(id){if(!confirm('确定删除？'))return;const i=prods.findIndex(x=>x.id===id);if(i>=0){prods.splice(i,1);toast('已删除','ok')}}
function batchAction(act){if(!prodSelected.value.length){toast('请先勾选商品','warn');return};prodSelected.value.forEach(id=>{const p=prods.find(x=>x.id===id);if(p)p.status=act});toast('已批量'+act,'ok');prodSelected.value=[]}
function exportProducts(){const csv='名称,分类,价格,库存,销量,状态\n'+prods.map(p=>[p.name,p.cat,p.price,p.stock,p.sales,p.status].join(',')).join('\n');downloadCSV('﻿'+csv,'商品数据_'+new Date().toISOString().slice(0,10)+'.csv')}

const allOrders=reactive([
  {id:'ORD0617',item:'蜂糖李礼盒',buyer:'张女士',amount:768,status:'待发货',phone:'138****1234',addr:'湖北省武汉市',logistics:''},
  {id:'ORD0618',item:'富硒黄桃',buyer:'李先生',amount:204,status:'已发货',phone:'139****2345',addr:'陕西省安康市',logistics:'SF123456'},
  {id:'ORD0619',item:'阳光玫瑰葡萄',buyer:'王女士',amount:136,status:'已完成',phone:'136****3456',addr:'陕西省西安市',logistics:'JT789012'},
  {id:'ORD0620',item:'澳洲淡水龙虾',buyer:'赵大哥',amount:536,status:'待付款',phone:'135****4567',addr:'重庆市渝北区',logistics:''},
  {id:'ORD0621',item:'农特产礼盒',buyer:'陈先生',amount:396,status:'售后退款',phone:'137****5678',addr:'四川省成都市',logistics:''}
])
const of=reactive({status:'',search:''})
const filteredOrders=computed(()=>{let l=allOrders;if(of.status)l=l.filter(o=>o.status===of.status);if(of.search){const s=of.search.toLowerCase();l=l.filter(o=>o.id.toLowerCase().includes(s)||o.buyer.toLowerCase().includes(s)||o.item.toLowerCase().includes(s))};return l})
function orderCls(s){return s==='已完成'?'g':s==='已发货'?'b':s==='待发货'?'y':s==='待付款'?'y':s==='售后退款'?'r':'dim'}
const of2=reactive({item:'',buyer:'',amount:'',phone:'',addr:'',logistics:''})
function openOrderForm(){Object.assign(of2,{item:'',buyer:'',amount:'',phone:'',addr:'',logistics:''});modalTitle.value='新增订单';modalType.value='order';modal.value=true}
function saveOrder(){allOrders.unshift({id:'ORD'+Date.now().toString(36).toUpperCase(),item:of2.item||'未填写',buyer:of2.buyer||'未填写',amount:parseInt(of2.amount)||0,status:'待发货',phone:of2.phone,addr:of2.addr,logistics:of2.logistics});modal.value=false;toast('已新增','ok')}
function batchShip(){allOrders.filter(o=>o.status==='待发货').forEach(o=>{o.status='已发货';o.logistics=o.logistics||'SF'+Math.random().toString(36).slice(2,8).toUpperCase()});toast('已批量发货','ok')}
function advanceOrder(o){const sts=['待付款','待发货','已发货','已完成'];const i=sts.indexOf(o.status);if(i>=0&&i<sts.length-1){o.status=sts[i+1];if(o.status==='已发货')o.logistics='SF'+Math.random().toString(36).slice(2,8).toUpperCase();toast('已流转为 '+o.status,'ok')}}
function cancelOrder(o){if(!confirm('确定取消？'))return;o.status='已取消';toast('已取消','ok')}
function exportOrders(){const csv='订单号,商品,买家,金额,状态\n'+allOrders.map(o=>[o.id,o.item,o.buyer,o.amount,o.status].join(',')).join('\n');downloadCSV('﻿'+csv,'订单数据_'+new Date().toISOString().slice(0,10)+'.csv')}
const od=ref(null)
function showOrderDetail(o){od.value=o;modalTitle.value='订单详情';modalType.value='orderDetail';modal.value=true}

const traces=reactive([
  {id:1,batch:'P2026001',product:'蜂糖李',origin:'中堰村产业园东区',plot:'蜂糖李基地',harvestDate:'2026-07-01',inspection:'合格',manager:'赵大哥',scans:128,status:'正常'},
  {id:2,batch:'P2026002',product:'富硒黄桃',origin:'中堰村产业园南区',plot:'富硒黄桃园',harvestDate:'2026-07-05',inspection:'合格',manager:'刘阿姨',scans:256,status:'正常'},
  {id:3,batch:'P2026003',product:'阳光玫瑰葡萄',origin:'中堰村产业园西区',plot:'阳光玫瑰葡萄园',harvestDate:'2026-07-10',inspection:'不合格',manager:'张大叔',scans:32,status:'异常'}
])
const tf=reactive({product:'',batch:'',origin:'',plot:'',harvestDate:'',inspection:'合格',manager:''})
const td=ref(null)
function openTraceForm(){Object.assign(tf,{product:'',batch:'T'+Date.now().toString(36).toUpperCase(),origin:'中堰村',plot:'',harvestDate:'',inspection:'合格',manager:''});modalTitle.value='新增批次';modalType.value='trace';modal.value=true}
function saveTrace(){traces.unshift({id:uid(),...tf,scans:0,status:tf.inspection==='不合格'?'异常':'正常'});modal.value=false;toast('已新增','ok')}
function showTraceDetail(t){td.value=t;modalTitle.value='溯源详情';modalType.value='traceDetail';modal.value=true}
function showTraceQR(t){td.value=t;t.scans++;modalTitle.value='产品溯源码';modalType.value='qr';modal.value=true}
function recallTrace(t){t.status='已召回';toast('已召回批次 '+t.batch,'warn')}
function exportTraces(){const csv='批次,产品,产地,地块,采摘,检测,扫码,状态\n'+traces.map(t=>[t.batch,t.product,t.origin,t.plot,t.harvestDate,t.inspection,t.scans,t.status].join(',')).join('\n');downloadCSV('﻿'+csv,'溯源数据_'+new Date().toISOString().slice(0,10)+'.csv')}

const lives=reactive([
  {id:1,title:'中堰蜂糖李专场',host:'黄雪琳书记',time:'2026-07-20 19:00',duration:'2h',views:3200,likes:15800,sales:12800,status:'预告'},
  {id:2,title:'富硒黄桃采摘直播',host:'赵大哥',time:'2026-07-18 10:00',duration:'1.5h',views:5600,likes:23400,sales:25600,status:'已结束'},
  {id:3,title:'澳洲龙虾烹饪秀',host:'李婶',time:'2026-07-19 15:00',duration:'3h',views:8900,likes:42000,sales:35800,status:'进行中'}
])
const ld=ref(null)
function addLive(){const n=prompt('直播主题：');if(!n)return;lives.unshift({id:uid(),title:n,host:prompt('主播：')||'管理员',time:prompt('时间：',new Date().toISOString().slice(0,16))||'',duration:'2h',views:0,likes:0,sales:0,status:'预告'});toast('已创建','ok')}
function editLive(id){const l=lives.find(x=>x.id===id);if(!l)return;l.title=prompt('主题：',l.title)||l.title;l.host=prompt('主播：',l.host)||l.host;l.status=prompt('状态：',l.status)||l.status;toast('已更新','ok')}
function delLive(id){if(!confirm('确定删除？'))return;const i=lives.findIndex(x=>x.id===id);if(i>=0){lives.splice(i,1);toast('已删除','ok')}}
function showLiveDetail(l){ld.value=l;modalTitle.value='直播详情';modalType.value='liveDetail';modal.value=true}
function startSimLive(){const live=lives.find(l=>l.status==='预告');if(live){live.status='进行中';live.views=100;live.likes=500;const t=setInterval(()=>{if(live.status!=='进行中')clearInterval(t);else{live.views+=Math.floor(Math.random()*50);live.likes+=Math.floor(Math.random()*200);live.sales+=Math.floor(Math.random()*500)}},3000);toast(live.title+' 已开播！','ok')}else{toast('没有预告中的直播','warn')}}
function exportLives(){const csv='主题,主播,时间,时长,观看,点赞,销售,状态\n'+lives.map(l=>[l.title,l.host,l.time,l.duration,l.views,l.likes,l.sales,l.status].join(',')).join('\n');downloadCSV('﻿'+csv,'直播数据_'+new Date().toISOString().slice(0,10)+'.csv')}

const topProds=computed(()=>[...prods].sort((a,b)=>b.sales-a.sales).slice(0,5))
const areaDist=[{n:'安康市',c:58},{n:'西安市',c:42},{n:'武汉市',c:28},{n:'重庆市',c:22},{n:'成都市',c:16}]

function downloadCSV(csv,fn){if(window.showSaveFilePicker){const b=new Blob([csv],{type:'text/csv'});window.showSaveFilePicker({suggestedName:fn,types:[{description:'CSV',accept:{'text/csv':['.csv']}}]}).then(h=>h.createWritable().then(w=>w.write(csv).then(()=>w.close()))).catch(e=>{if(e.name!=='AbortError'){const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=fn;a.click();URL.revokeObjectURL(a.href);toast('已导出','ok')}})}else{const b=new Blob([csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=fn;a.click();URL.revokeObjectURL(a.href);toast('已导出','ok')}}

const modal=ref(false),modalTitle=ref(''),modalType=ref('')

let chartInsts=[]
function initCharts(){
  chartInsts.forEach(c=>{try{c.dispose()}catch(e){}});chartInsts=[]
  const c1=document.getElementById('ca1')
  if(c1){
    const c=echarts.init(c1);chartInsts.push(c)
    const grad=new echarts.graphic.LinearGradient(0,0,0,1,[
      {offset:0,color:'rgba(40,199,111,.25)'},{offset:1,color:'rgba(40,199,111,.02)'}
    ])
    c.setOption({
      tooltip:{trigger:'axis',backgroundColor:'rgba(4,18,40,0.95)',borderColor:'rgba(57,217,138,0.30)',textStyle:{color:'#c8daea',fontSize:10}},
      grid:{left:8,right:16,top:8,bottom:20},
      xAxis:{type:'category',data:['7/11','7/12','7/13','7/14','7/15','7/16','7/17'],axisLabel:{color:'#5e7a9a',fontSize:9}},
      yAxis:{type:'value',axisLabel:{color:'#5e7a9a',fontSize:9},splitLine:{lineStyle:{color:'rgba(14,165,233,0.06)'}}},
      series:[{type:'line',data:[680,920,1150,1580,1320,2100,1860],smooth:true,lineStyle:{color:'#28C76F',width:2},itemStyle:{color:'#28C76F'},areaStyle:{color:grad}}]
    })
  }
  const c2=document.getElementById('ca2')
  if(c2){
    const c=echarts.init(c2);chartInsts.push(c)
    const colors=['#28C76F','#28C7FA','#f59e0b','#E74C3C','#A77BFF']
    const pieData=prods.map(function(p,i){return{value:p.sales,name:p.name,itemStyle:{color:colors[i%5]}}})
    c.setOption({
      tooltip:{trigger:'item',backgroundColor:'rgba(4,18,40,0.95)',borderColor:'rgba(57,217,138,0.30)',textStyle:{color:'#c8daea',fontSize:10}},
      series:[{type:'pie',radius:['55%','78%'],center:['50%','52%'],itemStyle:{borderColor:'rgba(8,28,58,0.92)',borderWidth:2},label:{color:'#5e7a9a',fontSize:9},data:pieData}]
    })
  }
}
</script>

<style scoped>
.ec{min-height:100vh;background:#06192b;color:#fff;font-size:12px}.eh{display:flex;align-items:center;gap:10px;padding:0 16px;height:48px;background:linear-gradient(180deg,rgba(10,50,100,.15),rgba(6,20,44,.05));border-bottom:1px solid rgba(0,0,0,.06)}.eh a{color:#6F91A8;text-decoration:none;font-size:13px}.clock{font-size:11px;color:#6F91A8;font-family:monospace}
.et{display:flex;background:rgba(8,28,58,.65);padding:0 16px}.et button{padding:10px 16px;font-size:11px;font-weight:600;color:#6F91A8;background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;transition:.2s}.et button:hover{color:#B7D3E8}.et button.on{color:#28C76F;border-bottom-color:#39D98A}
.eb{padding:14px 18px}
.sr{display:flex;gap:10px;margin-bottom:10px;flex-wrap:wrap}.sc{flex:1;min-width:120px;height:85px;background:rgba(5,25,48,.96);border:1px solid rgba(190,214,234,.55);border-radius:10px;padding:12px;display:flex;flex-direction:column;justify-content:center}.sc .sv{font-size:24px;font-weight:700;color:#28C76F;font-family:monospace}.sc .sl{font-size:10px;color:#6F91A8;margin-top:3px}.sc.g .sv{color:#28C76F}.sc.y .sv{color:#F5B83D}.sc.r .sv{color:#E74C3C}
.pn{background:rgba(5,25,48,.96);border:1px solid rgba(190,214,234,.55);border-radius:10px;padding:12px 16px;margin-bottom:8px}.tt{font-size:12px;font-weight:700;color:#fff;margin-bottom:10px;display:flex;align-items:center;gap:6px}.tt::before{content:'';width:3px;height:11px;border-radius:2px;background:#28C76F}
.fb{display:flex;gap:6px;margin-bottom:8px;align-items:center;flex-wrap:wrap}.fi{background:rgba(57,217,138,.06);border:1px solid rgba(40,199,111,.1);color:#B7D3E8;border-radius:6px;padding:5px 8px;font-size:11px;font-family:inherit}.fi:focus{border-color:#28C76F;outline:none}
.tb{width:100%;border-collapse:collapse}.tb th,.tb td{padding:8px 10px;text-align:left;font-size:10px}.tb th{background:rgba(10,36,68,.55);color:#6F91A8;border-bottom:2px solid rgba(40,199,111,.1);font-size:9px}.tb td{border-bottom:1px solid rgba(14,165,233,.06)}.tb tr:hover td{background:rgba(14,165,233,.04)}
.t{display:inline-block;padding:2px 6px;border-radius:9px;font-size:9px;font-weight:600}.t.g{background:rgba(16,214,160,.15);color:#28C76F}.t.y{background:rgba(245,158,11,.15);color:#F5B83D}.t.r{background:rgba(231,76,60,.15);color:#E74C3C}.t.b{background:rgba(40,199,111,.12);color:#28C76F}.t.dim{background:rgba(100,120,140,.15);color:#6F91A8}
.pn2{font-weight:600;color:#fff}.pd{font-size:9px;color:#6F91A8;margin-top:1px}
.bp{background:linear-gradient(135deg,#39D98A,#28C76F);color:#fff}.bo{background:transparent;border:1px solid rgba(14,165,233,.28);color:#28C76F}.bd{background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.25);color:#E74C3C}.bp,.bo,.bd{padding:5px 10px;border-radius:7px;font-size:10px;font-weight:600;cursor:pointer;font-family:inherit}.bps{padding:3px 6px;font-size:8px}
.mo{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:.25s}.mo.on{opacity:1;pointer-events:auto}.mb{background:rgba(6,22,46,.98);border:1px solid rgba(40,199,111,.15);border-radius:12px;padding:20px 24px;width:540px;max-width:90vw;max-height:85vh;overflow-y:auto}.mh{font-size:15px;font-weight:700;color:#fff;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center}.mc{width:26px;height:26px;border-radius:50%;background:rgba(10,60,130,.2);border:1px solid rgba(40,199,111,.1);color:#B7D3E8;cursor:pointer;font-size:13px}.fl{margin-bottom:10px}.fl label{display:block;font-size:10px;color:#6F91A8;margin-bottom:3px}.fin{width:100%;padding:8px;border-radius:8px;background:rgba(57,217,138,.06);border:1px solid rgba(40,199,111,.1);color:#B7D3E8;outline:none;font-family:inherit;font-size:12px;box-sizing:border-box}.fr3{display:flex;gap:8px}.fr3 .fl{flex:1}.ma{display:flex;gap:6px;margin-top:14px}
.dg2{background:rgba(10,36,68,.55);padding:10px;border-radius:8px;margin-bottom:8px}.dl2{display:block;font-size:9px;color:#28C76F;margin-bottom:3px}.dg2 div:last-child{font-size:12px;color:#B7D3E8}
.ri{display:flex;align-items:center;padding:6px 0;border-bottom:1px solid rgba(14,165,233,.06);font-size:11px}.rn{width:20px;text-align:center;font-weight:700;color:#28C76F;font-family:monospace}.rc{margin-left:auto;color:#6F91A8;font-family:monospace}
.c-red{color:#E74C3C!important}.c-yel{color:#F5B83D!important}
.si{font-size:18px;margin-bottom:4px}.st{font-size:10px;margin-left:6px}.st.up{color:#28C76F}
.stock-bar{height:5px;background:rgba(40,199,111,.08);border-radius:3px;overflow:hidden;width:100%}.stock-fill{height:100%;border-radius:3px;transition:width .5s}.stock-fill.ok{background:#28C76F}.stock-fill.warn{background:#F5B83D}.stock-fill.low{background:#E74C3C}.stock-fill.out{background:rgba(100,120,140,.3)}
.pimg{width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}.pimg-lg{width:80px;height:80px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:40px;margin:0 auto 14px}
.rowWarn td{background:rgba(245,158,11,.04)}.rowOut td{background:rgba(231,76,60,.04)}
.fl2{display:flex;align-items:center;gap:3px;font-size:10px;color:#6F91A8;cursor:pointer}
.dd-wrap{display:inline-block;position:relative}.dd-menu{position:absolute;right:0;top:100%;z-index:50;background:rgba(6,22,46,.98);border:1px solid rgba(40,199,111,.15);border-radius:8px;padding:4px 0;min-width:100px;box-shadow:0 4px 16px rgba(0,0,0,.4)}.dd-menu div{padding:6px 12px;font-size:10px;color:#B7D3E8;cursor:pointer;white-space:nowrap}.dd-menu div:hover{background:rgba(14,165,233,.1)}
.dov2{position:fixed;inset:0;z-index:180;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:.3s}.dov2.on{opacity:1;pointer-events:auto}.dw2{position:fixed;top:0;right:0;bottom:0;width:400px;z-index:190;background:rgba(6,20,44,.98);border-left:1px solid rgba(40,199,111,.1);transform:translateX(100%);transition:.3s;display:flex;flex-direction:column}.dw2.on{transform:translateX(0)}.dwh2{padding:14px 16px;border-bottom:1px solid rgba(40,199,111,.1);display:flex;justify-content:space-between;align-items:center}.dwh2 h3{font-size:14px;color:#fff}.dwb2{flex:1;overflow-y:auto;padding:14px}
.dg3{background:rgba(10,36,68,.55);padding:10px;border-radius:8px;margin-bottom:8px}.dl3{display:block;font-size:9px;color:#28C76F;margin-bottom:3px}.dg3 div:last-child{font-size:12px;color:#B7D3E8}
.pg2{display:flex;justify-content:flex-end;margin-top:8px}
.toast-area{position:fixed;top:16px;right:16px;z-index:999;display:flex;flex-direction:column;gap:6px;pointer-events:none}.to{padding:8px 14px;border-radius:6px;font-size:11px;font-weight:600;color:#fff;animation:ti .3s,to2 .3s 2s forwards}.to.ok{background:linear-gradient(135deg,#059669,#39D98A)}.to.info{background:linear-gradient(135deg,#39D98A,#28C76F)}.to.warn{background:linear-gradient(135deg,#d97706,#f59e0b)}@keyframes ti{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes to2{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}
</style>
