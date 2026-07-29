<template>
<div class="ec">
<header class="eh" v-if="!embedded"><router-link to="/dashboard">◀ 返回</router-link> 🛒 农产品电商中心 <span style="font-size:10px;color:#6F91A8;font-weight:400">商品发布—订单交易—质量溯源—直播营销—经营分析</span><span style="flex:1"></span><span class="clock">{{clock}}</span></header>
<div class="et" v-if="!embedded"><button v-for="t in tabs" :key="t.k" :class="{on:cur===t.k}" @click="cur=t.k">{{t.l}}</button></div>
<h2 class="pg-tt">{{ currentTitle }}</h2>
<div class="eb">


<template v-if="cur==='products'">
<div>
<!-- 统计卡片 -->
<div class="sr">
<div class="sc"><div class="sc-title">商品总数</div><div class="sv">{{prods.length}}<span class="st up">+2</span></div><div class="sl">较上周</div></div>
<div class="sc g"><div class="sc-title">已上架商品</div><div class="sv">{{prods.filter(p=>p.status==='已上架').length}}<span class="st up">+1</span></div><div class="sl">较上周</div></div>
<div class="sc y"><div class="sc-title">库存预警</div><div class="sv">{{prods.filter(p=>p.stock>0&&stockPct(p)<=30).length}}<span class="st" style="color:#E74C3C">{{prods.filter(p=>p.stock===0).length}}售罄</span></div><div class="sl">低库存及售罄</div></div>
<div class="sc"><div class="sc-title">累计销售额</div><div class="sv">&yen;{{prods.reduce((s,p)=>s+p.price*p.sales,0).toLocaleString()}}<span class="st up">+12%</span></div><div class="sl">环比</div></div>
</div>

<!-- 筛选区 -->
<div class="pn"><div class="tt">🔍 搜索与筛选</div>
<div class="fb"><input v-model="pf.search" placeholder="搜索名称/编号..." class="fi" style="width:180px"><select v-model="pf.cat" class="fi"><option value="">全部分类</option><option v-for="c in cats" :key="c" :value="c">{{c}}</option></select><select v-model="pf.status" class="fi"><option value="">全部销售状态</option><option value="草稿">草稿</option><option value="待审核">待审核</option><option value="已上架">已上架</option><option value="已下架">已下架</option><option value="售罄">售罄</option><option value="已停用">已停用</option></select><select v-model="pf.stockLevel" class="fi"><option value="">全部库存</option><option value="normal">正常</option><option value="low">偏低</option><option value="out">售罄</option></select>
<div style="display:flex;gap:2px"><button v-for="c in certOptions" :key="c" :class="pf.certifications.includes(c)?'cert-tag on':'cert-tag'" @click="toggleCertFilter(c)">{{c}}</button></div>
<button class="bp" style="margin-left:4px;padding:5px 12px;font-size:10px">查询</button><button class="bo" style="padding:5px 12px;font-size:10px" @click="resetFilters">重置</button></div>
</div>

<!-- 批量操作 -->
<div class="pn"><div class="tt" style="justify-content:space-between"><span>📦 商品列表（共{{filteredProds.length}}条）<span v-if="prodSelected.length" style="color:#28C76F;font-size:11px;margin-left:8px">已选择 {{prodSelected.length}} 项</span></span><div style="display:flex;gap:6px"><button class="bp bps" @click="openProdForm()">+ 新增商品</button><button class="bo bps" :disabled="!prodSelected.length" @click="batchAction('已上架')">批量上架</button><button class="bo bps" :disabled="!prodSelected.length" @click="batchAction('已下架')">批量下架</button><button class="bd bps" :disabled="!prodSelected.length" @click="batchAction('删除')">批量删除</button><button class="bo bps" @click="exportProducts">导出</button></div></div>

<!-- 商品表格 -->
<table class="tb"><thead><tr><th style="width:30px"><input type="checkbox" v-model="prodSelectAll" @change="toggleAllProds"></th><th style="width:auto">商品信息</th><th style="width:80px;white-space:nowrap">分类</th><th style="width:75px;white-space:nowrap">售价</th><th style="width:105px;white-space:nowrap">库存</th><th style="width:50px;white-space:nowrap">销量</th><th style="width:70px;white-space:nowrap">上架状态</th><th style="width:80px;white-space:nowrap">更新时间</th><th style="width:100px;white-space:nowrap">操作</th></tr></thead>
<tbody><tr v-for="p in filteredProds" :key="p.id"><td><input type="checkbox" :value="p.id" v-model="prodSelected"></td>
<td @click="showProdDetail(p)" style="cursor:pointer"><div style="display:flex;align-items:center;gap:10px"><div class="pimg" :style="{background:p._color||'rgba(10,61,92,0.55)'}">{{p._icon||'📦'}}</div><div><div class="pn2">{{p.name}}<span v-for="(tag,i) in (p.tags||[]).slice(0,2)" :key="tag" class="t g" style="margin-left:3px;font-size:8px">{{tag}}</span><span v-if="(p.tags||[]).length>2" class="t dim" style="margin-left:3px;font-size:8px">+{{p.tags.length-2}}</span></div><div class="pd" style="color:#6F91A8">{{p.spec||'--'}}</div><div class="pd" style="font-size:8px">编号：{{p.productCode||'--'}}｜批次：{{p.batch||'--'}}</div></div></div></td>
<td>{{p.cat}}</td>
<td style="color:#28C76F;font-weight:600">&yen;{{p.price}}</td>
<td><div v-if="p.maxStock" class="stock-bar"><div class="stock-fill" :class="stockStatusLabel(p).cls==='r'?'low':stockStatusLabel(p).cls==='y'?'warn':'ok'" :style="{width:stockPct(p)+'%'}"></div></div><div :style="{color:stockStatusLabel(p).color,fontSize:'10px'}">{{p.stock}}{{p.unit||'件'}}｜{{stockStatusLabel(p).text}}</div></td>
<td>{{p.sales}}</td>
<td><span :class="'t '+statusCls(p.status)">{{statusLabel(p.status)}}</span></td>
<td style="font-size:10px;color:#6F91A8">{{(p.updatedAt||'').slice(0,10)}}</td>
<td style="white-space:nowrap"><button class="act-btn act-view" @click="showProdDetail(p)">查看</button><button class="act-btn act-edit" @click="openProdForm(p.id)">编辑</button><div class="dd-wrap"><button class="act-btn act-more" @click="p._more=!p._more">···</button><div v-if="p._more" class="dd-menu"><div @click="toggleProd(p.id);p._more=false">{{p.status==='已上架'?'下架商品':p.status==='已下架'?'上架商品':p.status==='售罄'?'重新上架':p.status==='已停用'?'启用商品':'上架商品'}}</div><div @click="p._more=false;copyProd(p)">复制商品</div><div @click="p._more=false;toast('溯源码已生成','ok')">查看溯源</div><div @click="p._more=false;toast('库存调整','ok')">库存调整</div><div @click="delProd(p.id);p._more=false" style="color:#E74C3C">删除</div></div></div></td></tr></tbody></table>
<div class="pg2"><span style="color:#6F91A8;font-size:10px">共 {{filteredProds.length}} 条</span></div>
</div>
</div>

<!-- Product Detail Drawer -->
<div class="dov2" :class="{on:prodDrawer}" @click="prodDrawer=false"></div>
<div class="dw2" :class="{on:prodDrawer}">
<div class="dwh2"><h3>{{prodDetail?.name||'商品详情'}}</h3><button class="mc" @click="prodDrawer=false">✕</button></div>
<div class="dwb2" v-if="prodDetail">
<div class="pimg-lg" :style="{background:prodDetail._color||'rgba(10,61,92,0.55)'}">{{prodDetail._icon||'📦'}}</div>
<div class="ds-title">📋 基本信息</div>
<div class="dg3"><span class="dl3">商品名称</span><div style="color:#fff;font-weight:600">{{prodDetail.name}}</div></div>
<div class="dg3"><span class="dl3">副标题</span><div>{{prodDetail.subTitle||'--'}}</div></div>
<div class="dg3"><span class="dl3">商品编号</span><div style="color:#28C76F">{{prodDetail.productCode||'--'}}</div></div>
<div class="dg3"><span class="dl3">分类</span><div>{{prodDetail.cat}}</div></div>
<div class="ds-title">💰 规格与价格</div>
<div class="dg3"><span class="dl3">规格</span><div>{{prodDetail.spec||'--'}}</div></div>
<div class="dg3"><span class="dl3">售价</span><div style="color:#28C76F;font-weight:600">&yen;{{prodDetail.price}} / {{prodDetail.unit||'件'}}</div></div>
<div class="dg3"><span class="dl3">市场价</span><div>&yen;{{prodDetail.marketPrice||'--'}}</div></div>
<div class="dg3"><span class="dl3">成本价</span><div>&yen;{{prodDetail.costPrice||'--'}}</div></div>
<div class="ds-title">📊 库存信息</div>
<div class="dg3"><span class="dl3">库存数量</span><div :style="{color:stockStatusLabel(prodDetail).color}">{{prodDetail.stock}}{{prodDetail.unit||'件'}} / {{stockStatusLabel(prodDetail).text}}</div></div>
<div class="dg3"><span class="dl3">库存上限</span><div>{{prodDetail.maxStock||200}}{{prodDetail.unit||'件'}}</div></div>
<div class="dg3"><span class="dl3">预警阈值</span><div>{{prodDetail.stockWarningThreshold||30}}{{prodDetail.unit||'件'}}</div></div>
<div class="dg3"><span class="dl3">销量</span><div>{{prodDetail.sales}}</div></div>
<div class="ds-title">🏭 生产来源</div>
<div class="dg3"><span class="dl3">产地</span><div>{{prodDetail.origin||'--'}}</div></div>
<div class="dg3"><span class="dl3">所属村</span><div>{{prodDetail.villageName||'--'}}</div></div>
<div class="dg3"><span class="dl3">所属产业</span><div>{{prodDetail.industryName||'--'}}</div></div>
<div class="dg3"><span class="dl3">生产基地</span><div>{{prodDetail.baseName||'--'}}</div></div>
<div class="dg3"><span class="dl3">供应商</span><div>{{prodDetail.supplier||'--'}}</div></div>
<div class="ds-title">🔍 溯源与认证</div>
<div class="dg3"><span class="dl3">溯源批次</span><div style="color:#28C76F">{{prodDetail.batch||'--'}}</div></div>
<div class="dg3"><span class="dl3">采摘日期</span><div>{{prodDetail.harvestDate||'--'}}</div></div>
<div class="dg3"><span class="dl3">销售渠道</span><div><span v-for="ch in (prodDetail.channels||[])" :key="ch" class="t g" style="margin-right:3px">{{ch}}</span><span v-if="!(prodDetail.channels||[]).length" style="color:#6F91A8">未设置</span></div></div>
<div class="dg3"><span class="dl3">认证标签</span><div><span v-for="tag in (prodDetail.tags||[])" :key="tag" class="t g" style="margin-right:3px">{{tag}}</span><span v-if="!(prodDetail.tags||[]).length" style="color:#6F91A8">无</span></div></div>
<div class="dg3"><span class="dl3">状态</span><div><span :class="'t '+statusCls(prodDetail.status)">{{prodDetail.status}}</span></div></div>
<div style="display:flex;gap:8px;margin-top:14px"><button class="bp bps" @click="openProdForm(prodDetail.id);prodDrawer=false">编辑商品</button><button class="bo bps" @click="toggleProd(prodDetail.id);prodDrawer=false">{{prodDetail.status==='已上架'?'下架':'上架'}}</button></div>
</div>
</div>

<!-- Product Form Drawer -->
<div class="dov2" :class="{on:prodFormOpen}" @click="confirmCloseForm"></div>
<div class="prod-form-drawer" :class="{on:prodFormOpen}">
<div class="dwh2"><h3>{{modalEditId?'编辑商品':'新增商品'}}</h3><button class="mc" @click="confirmCloseForm">✕</button></div>
<div class="prod-form-body">
<div class="fs-title">📋 基础信息</div>
<div class="fl"><label>商品名称 *</label><input v-model="pf2.name" class="fin" placeholder="请输入商品名称"></div>
<div class="fl"><label>商品副标题</label><input v-model="pf2.subTitle" class="fin" placeholder="一句话描述商品特色"></div>
<div class="fr3"><div class="fl"><label>商品分类 *</label><select v-model="pf2.cat" class="fin"><option v-for="c in cats" :key="c" :value="c">{{c}}</option></select></div>
<div class="fl"><label>商品图片</label><div v-if="pf2._previewUrl" class="img-preview-row"><img :src="pf2._previewUrl" class="img-preview"><button class="bo bps" @click="pf2._previewUrl='';pf2._imageFile=null" style="margin-left:6px">删除</button></div><div v-else class="img-placeholder" @click="triggerImageUpload">📷 点击上传 <span style="font-size:8px;color:#6F91A8">JPG/PNG, ≤2MB</span></div><input type="file" ref="imgInput" accept="image/jpeg,image/png" @change="onImageChange" style="display:none"></div></div>
<div class="fr3" v-if="modalEditId"><div class="fl"><label>商品编号</label><input :value="pf2._productCode||'--'" class="fin" disabled style="color:#6F91A8"></div><div class="fl"><label>更新时间</label><input :value="pf2._updatedAt||'--'" class="fin" disabled style="color:#6F91A8"></div></div>

<div class="fs-title">💰 规格与价格</div>
<div class="fr3"><div class="fl"><label>商品规格</label><input v-model="pf2.spec" class="fin" placeholder="例：大果 2.5kg/箱"></div><div class="fl"><label>销售单位</label><input v-model="pf2.unit" class="fin" placeholder="斤/盒/袋"></div></div>
<div class="fr3"><div class="fl"><label>售价 (元) *</label><input v-model.number="pf2.price" type="number" class="fin" placeholder="0" min="0" step="0.01"></div><div class="fl"><label>市场价 (元)</label><input v-model.number="pf2.marketPrice" type="number" class="fin" placeholder="0" min="0" step="0.01"></div></div>
<div class="fr3"><div class="fl"><label>成本价 (元)</label><input v-model.number="pf2.costPrice" type="number" class="fin" placeholder="0" min="0" step="0.01"></div><div class="fl"></div></div>

<div class="fs-title">📊 库存信息</div>
<div class="fr3"><div class="fl"><label>当前库存 *</label><input v-model.number="pf2.stock" type="number" class="fin" placeholder="0" min="0"></div><div class="fl"><label>库存上限</label><input v-model.number="pf2.maxStock" type="number" class="fin" placeholder="200" min="1"></div></div>
<div class="fr3"><div class="fl"><label>预警阈值</label><input v-model.number="pf2.stockWarningThreshold" type="number" class="fin" placeholder="30" min="0"></div><div class="fl"></div></div>

<div class="fs-title">🏭 来源信息</div>
<div class="fr3"><div class="fl"><label>所属村</label><input v-model="pf2.villageName" class="fin" placeholder="中堰村"></div><div class="fl"><label>产地</label><input v-model="pf2.origin" class="fin" placeholder="中堰村产业园东区"></div></div>
<div class="fr3"><div class="fl"><label>所属产业</label><input v-model="pf2.industryName" class="fin" placeholder="蜂糖李产业"></div><div class="fl"><label>生产基地</label><input v-model="pf2.baseName" class="fin" placeholder="蜂糖李基地"></div></div>
<div class="fr3"><div class="fl"><label>供应商</label><input v-model="pf2.supplier" class="fin"></div><div class="fl"><label>溯源批次号</label><input v-model="pf2.batch" class="fin"></div></div>
<div class="fl"><label>采摘日期</label><input v-model="pf2.harvestDate" class="fin" placeholder="2026-07-01"></div>

<div class="fs-title">🏷️ 销售信息</div>
<div class="fr3"><div class="fl"><label>上架状态</label><select v-model="pf2._saveStatus" class="fin"><option value="草稿">草稿</option><option value="待审核">待审核</option><option value="已上架">已上架</option><option value="已下架">已下架</option></select></div><div class="fl"><label>推荐商品</label><label class="fl2" style="margin-top:8px"><input type="checkbox" v-model="pf2.recommended"> 标记为推荐</label></div></div>
<div class="fl"><label>认证标签</label><input v-model="pf2.tagsStr" class="fin" placeholder="富硒认证,绿色食品（逗号分隔）"></div>
<div class="fl"><label>商品简介</label><textarea v-model="pf2._desc" class="fin" placeholder="商品详细介绍..." rows="2" style="resize:vertical"></textarea></div>
</div>
<div class="prod-form-footer">
<button class="bo" @click="confirmCloseForm">取消</button>
<span style="flex:1"></span>
<button class="bp" style="padding:6px 16px;font-size:11px" @click="saveProd()">保存修改</button>
</div>
</div>
</template>

<template v-if="cur==='orders'">
<div>
<!-- 统计卡片 -->
<div class="sr">
<div class="sc" style="cursor:pointer" @click="resetOrderFilters()"><div class="sc-title">订单总数</div><div class="sv">{{allOrders.length}}</div><div class="sl">全部</div></div>
<div class="sc y" style="cursor:pointer" @click="resetOrderFilters();of.orderStatus='pending_shipment';of.paymentStatus='paid'"><div class="sc-title">待发货</div><div class="sv">{{allOrders.filter(o=>o.orderStatus==='pending_shipment').length}}</div><div class="sl">已付款待发货</div></div>
<div class="sc g" style="cursor:pointer" @click="resetOrderFilters();of.orderStatus='completed'"><div class="sc-title">已完成</div><div class="sv">{{allOrders.filter(o=>o.orderStatus==='completed').length}}</div><div class="sl">已签收并完成</div></div>
<div class="sc r" style="cursor:pointer" @click="resetOrderFilters();of.afterSaleStatus='processing'"><div class="sc-title">售后处理中</div><div class="sv">{{allOrders.filter(o=>o.afterSaleStatus!=='none'&&o.afterSaleStatus!=='completed').length}}</div><div class="sl">退款/退货处理中</div></div>
<div class="sc"><div class="sc-title">实付金额</div><div class="sv">&yen;{{allOrders.filter(o=>o.paymentStatus==='paid').reduce((s,o)=>s+(o.paidAmount||0),0).toLocaleString()}}</div><div class="sl">已付款订单实付总额</div></div>
</div>

<!-- 筛选区 -->
<div class="pn"><div class="tt" style="justify-content:space-between"><span>📋 订单列表（共{{filteredOrders.length}}条）<span v-if="orderSelected.length" style="color:#28C76F;font-size:11px;margin-left:8px">已选择 {{orderSelected.length}} 单</span></span><div style="display:flex;gap:6px"><button class="bp bps" @click="openOrderForm()">手工录单</button><button class="bo bps" :disabled="!orderSelected.some(id=>eligibleForBatch(allOrders.find(o=>o.id===id)))" :title="!orderSelected.length?'请先选择订单':!orderSelected.some(id=>eligibleForBatch(allOrders.find(o=>o.id===id)))?'仅已支付待发货订单可批量发货':''" @click="batchShipOrders">批量发货</button><button class="bo bps" @click="exportOrders">导出</button></div></div>
<div class="fb"><input v-model="of.keyword" placeholder="订单号 / 买家姓名 / 手机号" class="fi" style="width:180px"><select v-model="of.orderStatus" class="fi"><option value="">全部订单状态</option><option value="pending_payment">待支付</option><option value="pending_shipment">待发货</option><option value="shipped">运输中</option><option value="completed">已完成</option><option value="cancelled">已取消</option><option value="closed">已关闭</option></select><select v-model="of.paymentStatus" class="fi"><option value="">全部支付状态</option><option value="unpaid">待支付</option><option value="paid">已支付</option><option value="refunded">已退款</option></select><select v-model="of.shipmentStatus" class="fi"><option value="">全部发货状态</option><option value="unshipped">待发货</option><option value="shipped">已发货</option><option value="signed">已签收</option></select><el-config-provider :locale="zhCn"><el-date-picker v-model="of._dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" size="small" style="width:240px" :panes="1" @change="onDateRangeChange"/></el-config-provider><button class="bp" style="padding:5px 12px;font-size:10px">查询</button><button class="bo" style="padding:5px 12px;font-size:10px" @click="resetOrderFilters">重置</button></div>

<!-- 订单表格 -->
<table class="tb order-table"><thead><tr><th style="width:30px"><input type="checkbox" v-model="orderSelectAll" @change="toggleAllOrders"></th><th style="white-space:nowrap;width:115px">订单号/时间</th><th style="min-width:130px">商品信息</th><th style="width:90px;white-space:nowrap">买家</th><th style="white-space:nowrap;width:75px">实付金额</th><th style="white-space:nowrap;width:65px">支付状态</th><th style="white-space:nowrap;width:65px">发货状态</th><th style="white-space:nowrap;width:70px">订单状态</th><th style="white-space:nowrap;width:105px">物流信息</th><th style="white-space:nowrap">操作</th></tr></thead>
<tbody><tr v-for="o in filteredOrders" :key="o.id" class="order-row" @click="showOrderDetail(o)" style="cursor:pointer"><td @click.stop><input type="checkbox" :value="o.id" v-model="orderSelected" :disabled="!eligibleForBatch(o)"></td>
<td><div style="color:#28C76F;font-weight:600;font-size:10px">{{o.orderNo}}</div><div style="font-size:9px;color:#6F91A8">{{(o.createdAt||'').slice(0,10)}}</div></td>
<td><div style="display:flex;align-items:center;gap:8px"><div class="order-prod-img" :style="{background:prods.find(p=>p.id===o.items?.[0]?.productId)?._color||'rgba(10,61,92,0.55)'}">{{prods.find(p=>p.id===o.items?.[0]?.productId)?._icon||'📦'}}</div><div><div class="pn2" style="font-size:11px">{{o.items?.[0]?.productName||'--'}}<span v-if="o.items?.length>1" style="color:#6F91A8;font-size:9px"> 等{{o.items.length}}件</span></div><div class="pd" v-if="o.items?.[0]">{{o.items[0].spec||''}} ×{{o.items[0].quantity||1}}</div></div></div></td>
<td><div>{{o.buyer}}</div><div class="pd">{{o.buyerPhone}}</div></td>
<td style="font-weight:600"><span v-if="o.paymentStatus==='paid'" style="color:#28C76F">&yen;{{o.paidAmount}}</span><span v-else-if="o.paymentStatus==='refunded'" style="color:#E74C3C">&yen;{{o.refundAmount}}<div style="font-size:9px">已退款</div></span><span v-else style="color:#F5B83D">&yen;{{o.productAmount}}<div style="font-size:9px">待支付</div></span></td>
<td><span :class="'t '+(o.paymentStatus==='paid'?'g':o.paymentStatus==='refunded'?'r':'y')" style="font-size:8px">{{payStatusLabel(o.paymentStatus)}}</span></td>
<td><span :class="'t '+shipStatusTagCls(o)" style="font-size:8px">{{shipStatusText(o)}}</span></td>
<td><span :class="'t '+orderStatusCls(o.orderStatus)">{{orderStatusLabel(o.orderStatus)}}</span></td>
<td><template v-if="typeof logisticsText(o)==='string'"><span style="color:#6F91A8;font-size:10px">{{logisticsText(o)}}</span></template><template v-else><div class="pd">{{logisticsText(o).company}}</div><div class="pd" style="color:#28C76F;font-size:9px">{{logisticsText(o).tracking}}{{logisticsText(o).signed}}</div></template></td>
<td style="white-space:nowrap" @click.stop><button v-for="a in getOrderActions(o)" :key="a.k" :class="a.k==='cancel'?'bd bps':a.k==='detail'?'bo bps':'bo bps'" style="margin-right:2px" @click="a.k==='detail'?showOrderDetail(o):a.k==='ship'?openShipModal(o):a.k==='cancel'?openCancelModal(o):a.k==='afterSale'?toast('售后详情','ok'):a.k==='viewLogistics'?toast('运单号：'+(o.trackingNo||'--'),'info'):null">{{a.l}}</button></td></tr></tbody></table>
</div>
</div>

<!-- 订单详情抽屉 -->
<div class="dov2" :class="{on:orderDrawerOpen}" @click="orderDrawerOpen=false"></div>
<div class="dw2" :class="{on:orderDrawerOpen}">
<div class="dwh2"><h3>订单详情 · {{orderDetail?.orderNo}}</h3><button class="mc" @click="orderDrawerOpen=false">✕</button></div>
<div class="dwb2" v-if="orderDetail">
<div class="ds-title">📋 基本信息</div>
<div class="dg3"><span class="dl3">订单号</span><div style="color:#28C76F;font-weight:600">{{orderDetail.orderNo}}</div></div>
<div class="dg3"><span class="dl3">下单时间</span><div>{{orderDetail.createdAt}}</div></div>
<div class="dg3"><span class="dl3">订单来源</span><div>{{orderDetail.source}}</div></div>
<div class="dg3"><span class="dl3">当前状态</span><div><span :class="'t '+orderStatusCls(orderDetail.orderStatus)">{{orderStatusLabel(orderDetail.orderStatus)}}</span></div></div>
<div class="ds-title">👤 买家与收货信息</div>
<div class="dg3"><span class="dl3">买家</span><div>{{orderDetail.buyer}} · {{orderDetail.buyerPhone}}</div></div>
<div class="dg3"><span class="dl3">收货地址</span><div>{{orderDetail.province}}{{orderDetail.city}}{{orderDetail.district}} {{orderDetail.address}}</div></div>
<div class="dg3"><span class="dl3">买家备注</span><div>{{orderDetail.buyerNote||'无'}}</div></div>
<div class="ds-title">📦 商品明细</div>
<div v-for="(item,i) in (orderDetail.items||[])" :key="i" class="dg3"><span class="dl3">{{item.productName}}</span><div>规格：{{item.spec}}｜单价：&yen;{{item.unitPrice}}｜×{{item.quantity}}｜小计：&yen;{{item.subtotal}}</div></div>
<div class="ds-title">💰 金额信息</div>
<div class="dg3"><span class="dl3">商品金额</span><div>&yen;{{orderDetail.productAmount}}</div></div>
<div class="dg3"><span class="dl3">运费</span><div>&yen;{{orderDetail.shippingFee}}</div></div>
<div class="dg3"><span class="dl3">优惠</span><div>-&yen;{{orderDetail.discountAmount}}</div></div>
<div class="dg3"><span class="dl3">实付金额</span><div style="color:#28C76F;font-weight:600">&yen;{{orderDetail.paidAmount}}</div></div>
<div class="dg3" v-if="orderDetail.refundAmount"><span class="dl3">退款金额</span><div style="color:#E74C3C">&yen;{{orderDetail.refundAmount}}</div></div>
<div class="ds-title">💳 支付信息</div>
<div class="dg3"><span class="dl3">支付方式</span><div>{{orderDetail.paymentMethod||'未支付'}}</div></div>
<div class="dg3"><span class="dl3">支付单号</span><div>{{orderDetail.paymentNo||'--'}}</div></div>
<div class="dg3"><span class="dl3">支付时间</span><div>{{orderDetail.paidAt||'--'}}</div></div>
<div class="ds-title">🚚 物流信息</div>
<div class="dg3"><span class="dl3">配送方式</span><div>{{orderDetail.shippingMethod||'待发货'}}</div></div>
<div class="dg3"><span class="dl3">物流公司</span><div>{{orderDetail.shippingCompany||'--'}}</div></div>
<div class="dg3"><span class="dl3">运单号</span><div style="color:#28C76F">{{orderDetail.trackingNo||'--'}}</div></div>
<div class="dg3"><span class="dl3">发货时间</span><div>{{orderDetail.shippedAt||'--'}}</div></div>
<div class="dg3"><span class="dl3">签收时间</span><div>{{orderDetail.signedAt||'--'}}</div></div>
<div class="ds-title">📝 操作记录</div>
<div v-for="(t,i) in (orderDetail.timeline||[])" :key="i" class="dg3"><span class="dl3">{{t.time}}</span><div>{{t.action}} · {{t.operator}}{{t.reason?' · '+t.reason:''}}</div></div>
<div style="display:flex;gap:8px;margin-top:14px"><button v-if="orderDetail.orderStatus==='pending_shipment'" class="bp bps" @click="openShipModal(orderDetail);orderDrawerOpen=false">发货</button><button v-if="orderDetail.orderStatus==='shipped'" class="bo bps" @click="toast('运单号：'+(orderDetail.trackingNo||'--'),'info')">查看物流</button></div>
</div>
</div>

<!-- 发货弹窗 -->
<div class="dov2" :class="{on:shipModalOpen}" @click="shipModalOpen=false"></div>
<div class="dw2" :class="{on:shipModalOpen}">
<div class="dwh2"><h3>🚚 发货</h3><button class="mc" @click="shipModalOpen=false">✕</button></div>
<div class="dwb2">
<div class="fl"><label>配送方式</label><select v-model="shipForm.shippingMethod" class="fin"><option>快递配送</option><option>村内配送</option><option>到店自提</option><option>无需物流</option></select></div>
<div class="fl"><label>物流公司</label><input v-model="shipForm.shippingCompany" class="fin" placeholder="顺丰速运"></div>
<div class="fl"><label>运单号</label><input v-model="shipForm.trackingNo" class="fin" placeholder="SF1234567890"></div>
<div class="fl"><label>发货备注</label><input v-model="shipForm.note" class="fin"></div>
<div class="ma"><button class="bp" @click="doShip">确认发货</button><button class="bo" @click="shipModalOpen=false">取消</button></div>
</div>
</div>

<!-- 取消弹窗 -->
<div class="dov2" :class="{on:cancelModalOpen}" @click="cancelModalOpen=false"></div>
<div class="dw2" :class="{on:cancelModalOpen}">
<div class="dwh2"><h3>❌ 取消订单</h3><button class="mc" @click="cancelModalOpen=false">✕</button></div>
<div class="dwb2">
<div class="fl"><label>取消原因</label><select v-model="cancelForm.reason" class="fin"><option value="">请选择</option><option v-for="r in cancelReasons" :key="r" :value="r">{{r}}</option></select></div>
<div class="fl"><label>备注</label><textarea v-model="cancelForm.note" class="fin" rows="2" style="resize:vertical"></textarea></div>
<div class="ma"><button class="bd" @click="doCancel">确认取消</button><button class="bo" @click="cancelModalOpen=false">返回</button></div>
</div>
</div>
</template>

<template v-if="cur==='trace'">
<div>
<!-- 统计卡片 -->
<div class="sr">
<div class="sc" style="cursor:pointer;border-top:2px solid #28C76F" @click="resetTraceFilters()"><div class="sc-title">📦 溯源批次</div><div class="sv">{{traces.length}}</div><div class="sl">批次档案</div></div>
<div class="sc" style="cursor:pointer;border-top:2px solid #28C76F" @click="resetTraceFilters()"><div class="sc-title">📝 待完善档案</div><div class="sv">{{traces.filter(t=>traceCompleteness(t).pct<80).length}}</div><div class="sl">完整度 < 100%</div></div>
<div class="sc" style="cursor:pointer;border-top:2px solid #E74C3C" @click="resetTraceFilters();tfFilter.batchStatus='recalled'"><div class="sc-title">⚠️ 异常批次</div><div class="sv">{{traces.filter(t=>t.batchStatus==='recalled'||t.batchStatus==='suspended'||t.inspectionStatus==='unqualified').length}}</div><div class="sl">不合格 / 暂停 / 召回</div></div>
</div>

<!-- 异常提醒 -->
<div v-if="traces.some(t=>t.batchStatus==='recalled'||t.batchStatus==='suspended'||t.inspectionStatus==='unqualified')" class="alert-bar">
<span>⚠️ 当前有 <b>{{traces.filter(t=>t.batchStatus==='recalled'||t.batchStatus==='suspended'||t.inspectionStatus==='unqualified').length}}</b> 个异常批次需要关注：</span>
<span v-for="t in traces.filter(t=>t.batchStatus==='recalled'||t.batchStatus==='suspended'||t.inspectionStatus==='unqualified')" :key="t.id" style="margin-left:8px">{{t.productName}} · {{batchStatusLabel(t.batchStatus)}}</span>
<button class="bo bps" style="margin-left:12px" @click="resetTraceFilters();tfFilter.batchStatus='recalled'">查看档案</button>
</div>

<!-- 溯源流程条 -->
<div class="trace-flow">
<div v-for="(step,i) in traceFlowSteps" :key="i" class="trace-flow-step" :class="{active:step.active,done:step.done,warn:step.warn}" @click="step.filter?step.filter():null" :style="{cursor:step.filter?'pointer':'default'}">
<div class="flow-dot"></div>
<div class="flow-label">{{step.label}}</div>
</div>
</div>

<!-- 筛选区 -->
<div class="pn"><div class="tt" style="justify-content:space-between"><span>📋 农产品溯源档案（共{{filteredTraces.length}}批）</span><div style="display:flex;gap:6px"><button class="bp bps" @click="openAddTrace()">+ 新建批次</button><button class="bo bps" @click="exportTraces">导出档案</button></div></div>
<div class="fb"><input v-model="tfFilter.keyword" placeholder="批次号 / 产品名称" class="fi" style="width:180px"><select v-model="tfFilter.inspectionStatus" class="fi"><option value="">全部检测状态</option><option value="pending">待检测</option><option value="qualified">合格</option><option value="unqualified">不合格</option></select><select v-model="tfFilter.batchStatus" class="fi"><option value="">全部批次状态</option><option value="draft">草稿</option><option value="incomplete">待完善</option><option value="normal">正常</option><option value="suspended">已暂停</option><option value="recalling">召回中</option><option value="recalled">已召回</option></select><el-config-provider :locale="zhCn"><el-date-picker v-model="tfFilter._dateRange" type="daterange" range-separator="至" start-placeholder="采收开始" end-placeholder="采收结束" format="YYYY-MM-DD" value-format="YYYY-MM-DD" size="small" style="width:220px" @change="onTraceDateChange"/></el-config-provider><button class="bp" style="padding:5px 12px;font-size:10px">查询</button><button class="bo" style="padding:5px 12px;font-size:10px" @click="resetTraceFilters">重置</button></div>

<!-- 表格 -->
<table class="tb"><thead><tr><th>批次号/时间</th><th>产品信息</th><th>来源地</th><th>生产主体</th><th>采收信息</th><th>检测状态</th><th>完整度</th><th>批次状态</th><th>操作</th></tr></thead>
<tbody><tr v-for="t in filteredTraces" :key="t.id" :class="['order-row',{'trace-row-abnormal':t.batchStatus==='recalled'||t.batchStatus==='recalling'||t.batchStatus==='suspended'}]" @click="showTraceDetail(t)" style="cursor:pointer"><td><div style="color:#28C76F;font-weight:600;font-size:10px">{{t.batchNo}}</div><div style="font-size:9px;color:#6F91A8">创建：{{t.createdAt?.slice(0,10)}}</div><div v-if="t.updatedAt&&t.updatedAt!==t.createdAt" style="font-size:8px;color:rgba(111,145,168,.6)">更新：{{(t.updatedAt||'').slice(0,10)}}</div></td>
<td><div class="pn2" style="font-size:11px">{{t.productName}}</div><div class="pd">品种：{{t.varietyName||'--'}}</div></td>
<td><div style="font-weight:600;color:#B7D3E8;font-size:11px">{{t.villageName}} · {{t.baseName}}</div><div class="pd">{{t.plotName||'--'}}</div></td>
<td><div style="font-weight:600;color:#B7D3E8;font-size:11px">{{t.producerName||'--'}}</div><div class="pd">{{t.producerType||''}} · 负责人：{{t.manager||'--'}}</div></td>
<td><div>{{t.harvestDate}}</div><div class="pd">{{t.harvestQuantity}}{{t.harvestUnit}}</div></td>
<td><span :class="'t '+inspStatusCls(t.inspectionStatus)" style="font-size:8px">{{inspStatusLabel(t.inspectionStatus)}}</span><div v-if="t.abnormalReason" style="font-size:8px;color:#E74C3C;margin-top:2px">{{t.abnormalReason}}</div></td>
<td :title="traceCompleteness(t).missing!=='完整'?'缺少：'+traceCompleteness(t).missing:''"><div class="completeness-bar"><div class="completeness-fill" :style="{width:traceCompleteness(t).pct+'%',background:traceCompleteness(t).pct>=80?'#28C76F':traceCompleteness(t).pct>=50?'#F5B83D':'#E74C3C'}"></div></div><div style="font-size:9px;color:#6F91A8;margin-top:2px">{{traceCompleteness(t).pct}}%</div></td>
<td><span :class="'t '+batchStatusCls(t.batchStatus)" style="font-size:8px">{{batchStatusLabel(t.batchStatus)}}</span><div v-if="t.totalScan" style="font-size:7px;color:rgba(111,145,168,.4);margin-top:1px">扫码{{t.totalScan}}次</div></td>
<td style="white-space:nowrap" @click.stop><button class="bo bps" style="margin-right:2px" @click="showTraceDetail(t)">查看档案</button><button v-if="getTraceActions(t).some(a=>a.k==='qrcode')" class="bp bps" style="margin-right:2px" @click="openQRModal(t)">二维码管理</button><button v-for="a in getTraceActions(t).filter(a=>a.k!=='detail'&&a.k!=='qrcode')" :key="a.k" :class="(a.cls||(a.k==='recall'||a.k==='suspend'?'bd':a.k==='archive'?'bo':'bo'))+' bps'" style="margin-right:2px" @click="a.k==='edit'?openAddTrace(t.id):a.k==='suspend'?doSuspendTrace(t):a.k==='resume'?doResumeTrace(t):a.k==='recall'?openRecallModal(t):a.k==='submitTest'?saveTrace('incomplete'):a.k==='addInspection'?addInspection(t):null">{{a.l}}</button></td></tr></tbody></table>
</div>
</div>

<!-- 详情抽屉 -->
<div class="dov2" :class="{on:traceDrawerOpen}" @click="traceDrawerOpen=false"></div>
<div class="dw2" :class="{on:traceDrawerOpen}">
<div class="dwh2"><h3>批次详情 · {{traceDetail?.batchNo}}</h3><button class="mc" @click="traceDrawerOpen=false">✕</button></div>
<div class="dwb2" v-if="traceDetail">
<div class="ds-title">📋 基本信息</div>
<div class="dg3"><span class="dl3">批次号</span><div style="color:#28C76F;font-weight:600">{{traceDetail.batchNo}}</div></div>
<div class="dg3"><span class="dl3">产品</span><div>{{traceDetail.productName}} · {{traceDetail.varietyName}}</div></div>
<div class="dg3"><span class="dl3">批次状态</span><div><span :class="'t '+batchStatusCls(traceDetail.batchStatus)">{{batchStatusLabel(traceDetail.batchStatus)}}</span></div></div>
<div class="dg3"><span class="dl3">创建时间</span><div>{{traceDetail.createdAt}}</div></div>
<div class="ds-title">🏭 来源信息</div>
<div class="dg3"><span class="dl3">所属村</span><div>{{traceDetail.villageName}}</div></div>
<div class="dg3"><span class="dl3">产业基地</span><div>{{traceDetail.industryName}} · {{traceDetail.baseName}}</div></div>
<div class="dg3"><span class="dl3">地块</span><div>{{traceDetail.plotName||'--'}}</div></div>
<div class="dg3"><span class="dl3">生产主体</span><div>{{traceDetail.producerType}} · {{traceDetail.producerName}}</div></div>
<div class="dg3"><span class="dl3">负责人</span><div>{{traceDetail.manager||'--'}}</div></div>
<div class="ds-title">🌾 采收信息</div>
<div class="dg3"><span class="dl3">采收日期</span><div>{{traceDetail.harvestDate}}</div></div>
<div class="dg3"><span class="dl3">采收数量</span><div>{{traceDetail.harvestQuantity}}{{traceDetail.harvestUnit}}</div></div>
<div class="ds-title">🔬 检测记录</div>
<div v-for="(ins,i) in (traceDetail.inspectionHistory||[])" :key="i" class="dg3"><span class="dl3">{{ins.type}}</span><div>{{ins.org}} · {{ins.date}} · <span :style="{color:ins.result==='合格'?'#28C76F':'#E74C3C'}">{{ins.result}}</span> · {{ins.reportNo}}</div></div>
<div v-if="!(traceDetail.inspectionHistory||[]).length" style="color:#6F91A8;font-size:10px;padding:6px">暂无检测记录</div>
<div class="ds-title">📦 包装信息</div>
<div class="dg3"><span class="dl3">包装日期</span><div>{{traceDetail.packDate||'--'}}</div></div>
<div class="dg3"><span class="dl3">包装规格</span><div>{{traceDetail.packSpec||'--'}}</div></div>
<div class="dg3"><span class="dl3">包装数量</span><div>{{traceDetail.packQty||0}}</div></div>
<div class="ds-title">📱 扫码情况</div>
<div class="dg3"><span class="dl3">累计扫码</span><div>{{traceDetail.totalScan||0}}次</div></div>
<div class="ds-title">📝 操作日志</div>
<div v-for="(tl,i) in (traceDetail.timeline||[])" :key="i" class="dg3"><span class="dl3">{{tl.time}}</span><div>{{tl.action}} · {{tl.operator}}{{tl.reason?' · '+tl.reason:''}}</div></div>
<div style="display:flex;gap:8px;margin-top:14px"><button v-if="traceDetail.batchStatus==='sellable'" class="bp bps" @click="openQRModal(traceDetail);traceDrawerOpen=false">生成二维码</button><button v-if="traceDetail.batchStatus==='sellable'" class="bo bps" @click="doSuspendTrace(traceDetail)">暂停</button></div>
</div>
</div>

<!-- 新增/编辑批次抽屉 -->
<div class="dov2" :class="{on:addTraceOpen}" @click="addTraceOpen=false"></div>
<div class="prod-form-drawer" :class="{on:addTraceOpen}">
<div class="dwh2"><h3>{{traceEditId?'编辑批次':'新增批次'}}</h3><button class="mc" @click="addTraceOpen=false">✕</button></div>
<div class="prod-form-body">
<div class="fs-title">📋 基础信息</div>
<div class="fr3"><div class="fl"><label>批次号</label><input v-model="traceForm.batchNo" class="fin" placeholder="自动生成"></div><div class="fl"><label>产品名称 *</label><input v-model="traceForm.productName" class="fin" placeholder="蜂糖李"></div></div>
<div class="fr3"><div class="fl"><label>品种</label><input v-model="traceForm.varietyName" class="fin" placeholder="蜂糖李1号"></div><div class="fl"><label>所属村</label><input v-model="traceForm.villageName" class="fin"></div></div>
<div class="fl"><label>所属产业</label><input v-model="traceForm.industryName" class="fin" placeholder="蜂糖李产业"></div>
<div class="fs-title">🏭 来源信息</div>
<div class="fr3"><div class="fl"><label>生产基地</label><input v-model="traceForm.baseName" class="fin" placeholder="蜂糖李基地"></div><div class="fl"><label>地块</label><input v-model="traceForm.plotName" class="fin" placeholder="产业园东区1号地"></div></div>
<div class="fr3"><div class="fl"><label>生产主体类型</label><select v-model="traceForm.producerType" class="fin"><option>合作社</option><option>农户</option><option>企业</option><option>村集体</option></select></div><div class="fl"><label>生产主体名称</label><input v-model="traceForm.producerName" class="fin"></div></div>
<div class="fl"><label>负责人</label><input v-model="traceForm.manager" class="fin">
</div>
<div class="fs-title">🌾 采收信息</div>
<div class="fr3"><div class="fl"><label>采收日期</label><input v-model="traceForm.harvestDate" class="fin" placeholder="2026-07-01"></div><div class="fl"><label>采收数量</label><input v-model="traceForm.harvestQuantity" type="number" class="fin" placeholder="500"></div></div>
<div class="fl"><label>单位</label><select v-model="traceForm.harvestUnit" class="fin"><option>斤</option><option>公斤</option><option>箱</option><option>只</option><option>头</option><option>羽</option></select></div>
<div class="fs-title">🔬 检测信息（可后续补录）</div>
<div class="fr3"><div class="fl"><label>检测机构</label><input v-model="traceForm.inspectionOrg" class="fin" placeholder="安康市检测中心"></div><div class="fl"><label>报告编号</label><input v-model="traceForm.reportNo" class="fin"></div></div>
<div class="fs-title">📦 包装信息</div>
<div class="fr3"><div class="fl"><label>包装日期</label><input v-model="traceForm.packDate" class="fin" placeholder="2026-07-03"></div><div class="fl"><label>包装规格</label><input v-model="traceForm.packSpec" class="fin" placeholder="大果 2.5kg/箱"></div></div>
<div class="fr3"><div class="fl"><label>包装数量</label><input v-model="traceForm.packQty" type="number" class="fin" placeholder="200"></div><div class="fl"><label>保质期</label><input v-model="traceForm.shelfLife" class="fin" placeholder="常温30天"></div></div>
</div>
<div class="prod-form-footer">
<button class="bo" @click="addTraceOpen=false">取消</button>
<span style="flex:1"></span>
<button class="bo" style="padding:6px 16px;font-size:11px" @click="saveTrace('draft')">保存草稿</button>
<button class="bp" style="padding:6px 16px;font-size:11px" @click="saveTrace('incomplete')">保存并提交检测</button>
</div>
</div>

<!-- 二维码弹窗 -->
<div class="dov2" :class="{on:qrModalOpen}" @click="qrModalOpen=false"></div>
<div class="dw2" :class="{on:qrModalOpen}">
<div class="dwh2"><h3>📱 产品溯源码</h3><button class="mc" @click="qrModalOpen=false">✕</button></div>
<div class="dwb2" v-if="traceDetail">
<div style="text-align:center;padding:20px 0"><div style="width:160px;height:160px;background:#fff;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-size:20px;font-family:monospace;color:#333">{{traceDetail.batchNo}}</div></div>
<div class="dg3"><span class="dl3">批次号</span><div>{{traceDetail.batchNo}}</div></div>
<div class="dg3"><span class="dl3">产品</span><div>{{traceDetail.productName}}</div></div>
<div class="dg3"><span class="dl3">溯源链接</span><div style="color:#28C76F">{{traceDetail.qrCodeUrl||'/trace/'+traceDetail.batchNo}}</div></div>
<div class="dg3"><span class="dl3">扫码次数</span><div>{{traceDetail.totalScan||0}}次</div></div>
<div class="dg3"><span class="dl3">当前状态</span><div><span :class="'t '+batchStatusCls(traceDetail.batchStatus)">{{batchStatusLabel(traceDetail.batchStatus)}}</span></div></div>
<div class="ma"><button class="bp bps" @click="toast('二维码已下载','ok')">下载二维码</button><button class="bo bps" @click="toast('已复制链接','ok')">复制链接</button><button class="bo bps" @click="toast('已发送至打印机','ok')">打印标签</button></div>
</div>
</div>

<!-- 召回弹窗 -->
<div class="dov2" :class="{on:recallModalOpen}" @click="recallModalOpen=false"></div>
<div class="dw2" :class="{on:recallModalOpen}">
<div class="dwh2"><h3>⚠️ 批次召回</h3><button class="mc" @click="recallModalOpen=false">✕</button></div>
<div class="dwb2">
<div class="fl"><label>召回原因 *</label><select v-model="recallForm.reason" class="fin"><option value="">请选择</option><option>检测不合格</option><option>农残超标</option><option>消费者投诉</option><option>包装问题</option><option>其他</option></select></div>
<div class="fl"><label>召回范围</label><select v-model="recallForm.scope" class="fin"><option>全部批次</option><option>部分批次</option><option>指定销售区域</option></select></div>
<div class="fr3"><div class="fl"><label>涉及数量</label><input v-model="recallForm.quantity" class="fin"></div><div class="fl"><label>已售数量</label><input v-model="recallForm.soldQty" class="fin"></div></div>
<div class="fr3"><div class="fl"><label>通知方式</label><select v-model="recallForm.notifyMethod" class="fin"><option>系统通知</option><option>短信通知</option><option>电话通知</option></select></div><div class="fl"><label>负责人</label><input v-model="recallForm.manager" class="fin"></div></div>
<div class="fl"><label>备注</label><textarea v-model="recallForm.note" class="fin" rows="2" style="resize:vertical"></textarea></div>
<div class="ma"><button class="bd" @click="doRecall">确认召回</button><button class="bo" @click="recallModalOpen=false">取消</button></div>
</div>
</div>
</template>

<template v-if="cur==='live'">
<div>
<!-- 统计卡片 -->
<div class="sr">
<div class="sc"><div class="sc-title">直播场次</div><div class="sv">{{lives.length}}</div><div class="sl">统计周期：累计</div></div>
<div class="sc g"><div class="sc-title">累计观看人数</div><div class="sv">{{lives.reduce((s,l)=>s+(l.views||0),0).toLocaleString()}}</div><div class="sl">统计周期：累计</div></div>
<div class="sc y"><div class="sc-title">直播成交额</div><div class="sv">{{(lives.reduce((s,l)=>s+(l.sales||0),0)/10000).toFixed(1)}}万</div><div class="sl">统计周期：累计</div></div>
</div>

<!-- 直播管理 -->
<div class="pn"><div class="tt" style="justify-content:space-between"><span>📺 直播管理（共{{lives.length}}场）</span><div style="display:flex;gap:6px"><button class="bp bps" @click="openLiveForm()">+ 创建直播</button><button class="bo bps" @click="toast('回放管理','info')">直播回放</button><button class="bo bps" @click="exportLives">导出数据</button></div></div>
<div class="fb"><input v-model="liveFilter.keyword" placeholder="直播名称/主播..." class="fi" style="width:180px"><select v-model="liveFilter.status" class="fi"><option value="">全部状态</option><option value="draft">草稿</option><option value="pending">待开播</option><option value="living">直播中</option><option value="ended">已结束</option><option value="cancelled">已取消</option></select><button class="bp" style="padding:5px 12px;font-size:10px">查询</button><button class="bo" style="padding:5px 12px;font-size:10px" @click="liveFilter.keyword='';liveFilter.status=''">重置</button></div>
<table class="tb"><thead><tr><th>直播名称</th><th>主播</th><th>时间</th><th>关联商品</th><th>观看人数</th><th>成交金额</th><th>状态</th><th>操作</th></tr></thead>
<tbody><tr v-for="l in filteredLives" :key="l.id" class="order-row" @click="showLiveDetail(l)" style="cursor:pointer"><td style="color:#fff;font-weight:600">{{l.title}}</td><td><div>{{l.host}}</div><div class="pd">{{l.manager||''}}</div></td><td><div>{{l.time}}</div><div class="pd">{{l.duration}}</div></td>
<td><div v-if="l.products&&l.products.length"><span v-for="(p,i) in l.products.slice(0,2)" :key="p" class="t g" style="margin-right:2px;font-size:8px">{{p}}</span><span v-if="l.products.length>2" class="t dim" style="font-size:8px">+{{l.products.length-2}}</span></div><span v-else style="color:#6F91A8;font-size:10px">未关联</span></td>
<td>{{(l.views||0).toLocaleString()}}</td><td style="color:#28C76F;font-weight:600">¥{{(l.sales||0).toLocaleString()}}<div v-if="l.orders" class="pd">共{{l.orders}}笔</div></td>
<td><span :class="'t '+liveStatusCls(l.status)" style="font-size:8px">{{liveStatusLabel(l.status)}}</span><div v-if="l.status==='已结束'&&l.replayUrl" style="font-size:7px;color:#28C76F;margin-top:2px">已上传回放</div><div v-else-if="l.status==='已结束'&&!l.replayUrl" style="font-size:7px;color:#6F91A8;margin-top:2px">未上传回放</div><div v-if="l.status==='已取消'&&l.cancelReason" style="font-size:7px;color:#E74C3C;margin-top:2px">{{l.cancelReason}}</div></td>
<td style="white-space:nowrap" @click.stop><button v-for="a in getLiveActions(l)" :key="a.k" :class="a.k==='cancel'?'bd bps':a.k==='enter'||a.k==='end'?'bp bps':'bo bps'" style="margin-right:2px" @click="a.k==='detail'?showLiveDetail(l):a.k==='edit'?openLiveForm(l.id):a.k==='cancel'?cancelLive(l.id):a.k==='enter'?toast('进入直播中...','ok'):a.k==='end'?endLive(l.id):a.k==='replay'?toast('查看回放','info'):null">{{a.l}}</button><button :class="(l.products&&l.products.length)?'bo bps':'bo bps'" style="margin-right:2px" @click="openLiveForm(l.id)">{{(l.products&&l.products.length)?'管理商品':'关联商品'}}</button></td></tr></tbody></table>
</div>
</div>

<!-- 创建/编辑直播抽屉 -->
<div class="dov2" :class="{on:liveFormOpen}" @click="liveFormOpen=false"></div>
<div class="prod-form-drawer" :class="{on:liveFormOpen}">
<div class="dwh2"><h3>{{liveEditId?'编辑直播':'创建直播'}}</h3><button class="mc" @click="liveFormOpen=false">✕</button></div>
<div class="prod-form-body">
<div class="fs-title">📋 基本信息</div>
<div class="fl"><label>直播名称 *</label><input v-model="liveForm.title" class="fin" placeholder="例：中堰蜂糖李采摘专场"></div>
<div class="fr3"><div class="fl"><label>主播 *</label><select v-model="liveForm.host" class="fin"><option v-for="h in hosts" :key="h" :value="h">{{h}}</option></select></div><div class="fl"><label>负责人</label><input v-model="liveForm.manager" class="fin"></div></div>
<div class="fr3"><div class="fl"><label>开播时间</label><input v-model="liveForm.time" class="fin" placeholder="2026-07-30 19:00"></div><div class="fl"><label>预计时长</label><select v-model="liveForm.duration" class="fin"><option v-for="d in durationOptions" :key="d" :value="d">{{d}}</option></select></div></div>
<div class="fl"><label>直播简介 <span style="font-size:9px;color:#6F91A8;font-weight:400">{{(liveForm.desc||'').length}}/{{descMaxLen}}</span></label><textarea v-model="liveForm.desc" class="fin" rows="2" :maxlength="descMaxLen" placeholder="介绍直播内容..." style="resize:vertical"></textarea></div>
<div class="fl"><label>直播封面（可选）</label>
<div v-if="liveForm.cover" style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><div class="img-preview" :style="{background:'rgba(10,61,92,0.55)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px'}">🖼️</div><button class="bo bps" @click="liveForm.cover=''">删除</button></div>
<button class="bo bps" @click="toast('封面上传功能预留','info')">📷 上传封面</button></div>
<div class="fs-title">📦 关联商品（已选{{liveForm.products.length}}件）</div>
<div style="display:flex;flex-wrap:wrap;gap:8px">
<div v-for="p in prods" :key="p.id" class="live-prod-chip" :class="{on:liveForm.products.includes(p.name)}" @click="toggleLiveProduct(p.name)">
<span>{{liveForm.products.includes(p.name)?'☑':'☐'}} {{p._icon||'📦'}} {{p.name}}</span>
</div>
</div>
</div>
<div class="prod-form-footer">
<button class="bo" @click="liveFormOpen=false">取消</button>
<span style="flex:1"></span>
<button class="bo" style="padding:6px 16px;font-size:11px" @click="saveLive('draft')">保存草稿</button>
<button class="bp" style="padding:6px 16px;font-size:11px" @click="saveLive('pending')">创建直播</button>
</div>
</div>

<!-- 直播详情抽屉 -->
<div class="dov2" :class="{on:liveDrawerOpen}" @click="liveDrawerOpen=false"></div>
<div class="dw2" :class="{on:liveDrawerOpen}">
<div class="dwh2"><h3>📺 {{liveDetail?.title}}</h3><button class="mc" @click="liveDrawerOpen=false">✕</button></div>
<div class="dwb2" v-if="liveDetail">
<!-- 状态条 -->
<div style="text-align:center;padding:10px 0;margin-bottom:10px;border-radius:8px;background:rgba(10,36,68,.55)">
<span :class="'t '+liveStatusCls(liveDetail.status)" style="font-size:10px;padding:4px 12px">{{liveStatusLabel(liveDetail.status)}}</span>
<div v-if="liveDetail.status==='pending'" style="font-size:10px;color:#6F91A8;margin-top:4px">距离开播：即将开始</div>
<div v-if="liveDetail.status==='living'" style="font-size:10px;color:#28C76F;margin-top:4px">🟢 直播中 · 开始时间：{{liveDetail.time}}</div>
<div v-if="liveDetail.status==='ended'" style="font-size:10px;color:#6F91A8;margin-top:4px">直播时长：{{liveDetail.duration}}</div>
</div>

<div class="ds-title">📋 基本信息</div>
<div class="dg3"><span class="dl3">直播名称</span><div style="color:#fff;font-weight:600">{{liveDetail.title}}</div></div>
<div class="dg3"><span class="dl3">所属村庄</span><div>{{liveDetail.villageName||'中堰村'}}</div></div>
<div class="dg3"><span class="dl3">主播</span><div>{{liveDetail.host}}</div></div>
<div class="dg3"><span class="dl3">负责人</span><div>{{liveDetail.manager||'--'}}</div></div>
<div class="dg3"><span class="dl3">开播时间</span><div>{{liveDetail.time}}</div></div>
<div class="dg3"><span class="dl3">预计时长</span><div>{{liveDetail.duration}}</div></div>
<div class="dg3"><span class="dl3">创建时间</span><div>{{liveDetail.createdAt}}</div></div>
<div class="dg3" v-if="liveDetail.desc"><span class="dl3">直播简介</span><div>{{liveDetail.desc}}</div></div>

<div class="ds-title">📦 关联商品（{{(liveDetail.products||[]).length}}种）</div>
<div v-for="pName in (liveDetail.products||[])" :key="pName" class="dg3" style="cursor:default">
<span class="dl3">{{pName}}</span>
<div>
<div v-if="getProdByName(pName)" style="color:#28C76F;font-weight:500">¥{{getProdByName(pName)?.price}} / {{getProdByName(pName)?.unit||'件'}} · 库存{{getProdByName(pName)?.stock||0}}</div>
<div style="font-size:10px;color:#6F91A8">已售{{getProdByName(pName)?.sales||0}} · 来源：{{getProdByName(pName)?.origin||'--'}}</div>
</div>
</div>
<div v-if="!(liveDetail.products||[]).length" style="color:#6F91A8;font-size:10px;padding:6px">未关联商品</div>

<div class="ds-title">💰 销售情况</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
<div class="dg3"><span class="dl3">成交金额</span><div style="color:#28C76F;font-weight:600;font-size:15px">¥{{(liveDetail.sales||0).toLocaleString()}}</div></div>
<div class="dg3"><span class="dl3">成交订单</span><div style="color:#fff;font-weight:600;font-size:15px">{{liveDetail.orders||0}}笔</div></div>
<div class="dg3"><span class="dl3">销售品类</span><div>{{(liveDetail.products||[]).length}}种</div></div>
<div class="dg3"><span class="dl3">退款订单</span><div style="color:#E74C3C">{{liveDetail.refunds||0}}笔</div></div>
</div>

<div class="ds-title">👁️ 观看情况</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
<div class="dg3"><span class="dl3">累计观看人数</span><div style="color:#fff;font-weight:600">{{(liveDetail.views||0).toLocaleString()}}</div></div>
<div class="dg3"><span class="dl3">最高在线人数</span><div>{{liveDetail.peakViews||'--'}}</div></div>
<div class="dg3"><span class="dl3">平均观看时长</span><div>{{liveDetail.avgWatch||'8分钟'}}</div></div>
</div>

<div class="ds-title">🎬 直播回放</div>
<div v-if="liveDetail.replayUrl" class="dg3"><span class="dl3">回放状态</span><div style="color:#28C76F">✓ 已上传 · {{liveDetail.replayAt||''}}</div></div>
<div v-if="liveDetail.replayUrl" style="display:flex;gap:6px;margin-top:8px"><button class="bp bps" @click="toast('查看回放','info')">▶ 查看</button><button class="bo bps" @click="toast('回放已更新','ok')">更新</button><button class="bd bps" @click="liveDetail.replayUrl='';liveDetail.replayAt='';toast('已删除','ok')">删除</button></div>
<div v-if="!liveDetail.replayUrl" class="dg3"><span class="dl3">回放状态</span><div style="color:#6F91A8">待上传 · 直播结束后可上传</div></div>
<div v-if="!liveDetail.replayUrl" style="margin-top:6px"><button class="bo bps" @click="liveDetail.replayUrl='/replay/'+liveDetail.id;liveDetail.replayAt=new Date().toISOString().replace('T',' ').slice(0,16);toast('回放已上传','ok')">📤 上传回放</button></div>

<div class="ds-title">📝 操作记录</div>
<div v-for="(log,i) in (liveDetail.timeline||[{time:liveDetail.createdAt,action:'创建直播',operator:liveDetail.manager||'管理员'}])" :key="i" class="dg3"><span class="dl3">{{log.time||liveDetail.createdAt}}</span><div>{{log.operator||'管理员'}} · {{log.action}}</div></div>

<div style="display:flex;gap:8px;margin-top:14px">
<button v-if="liveDetail.status==='draft'||liveDetail.status==='pending'" class="bp bps" @click="toast('进入直播中...','ok')">开始直播</button>
<button v-if="liveDetail.status==='draft'||liveDetail.status==='pending'" class="bo bps" @click="openLiveForm(liveDetail.id);liveDrawerOpen=false">编辑直播</button>
<button v-if="liveDetail.status==='draft'||liveDetail.status==='pending'" class="bd bps" @click="cancelLive(liveDetail.id);liveDrawerOpen=false">取消直播</button>
<button v-if="liveDetail.status==='living'" class="bp bps" @click="endLive(liveDetail.id);liveDrawerOpen=false">结束直播</button>
<button v-if="liveDetail.status==='ended'" class="bo bps" @click="toast('查看回放','info')">查看回放</button>
</div>
</div>
</div>
</template>

<template v-if="cur==='analytics'">
<div>
<!-- 概览卡片 -->
<div class="sr">
<div class="sc"><div class="sc-title">累计销售额</div><div class="sv">&yen;{{analyticsTotalSales.toLocaleString()}}</div><div class="sl">全部有效订单</div></div>
<div class="sc g"><div class="sc-title">成交订单</div><div class="sv">{{analyticsTotalOrders}}笔</div><div class="sl">已支付订单</div></div>
<div class="sc"><div class="sc-title">销售产品</div><div class="sv">{{prods.filter(p=>p.sales>0).length}}种</div><div class="sl">产生销售的商品</div></div>
<div class="sc y"><div class="sc-title">直播成交</div><div class="sv">&yen;{{lives.reduce((s,l)=>s+(l.sales||0),0).toLocaleString()}}</div><div class="sl">直播渠道</div></div>
</div>

<!-- 时间筛选 -->
<div class="pn" style="margin-bottom:10px"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
<span style="font-size:11px;color:#6F91A8">统计周期：</span>
<button v-for="p in analyticsPeriods" :key="p.k" :class="analyticsPeriod===p.k?'bp bps':'bo bps'" @click="analyticsPeriod=p.k">{{p.label}}</button>
</div></div>

<!-- 销售趋势 + 商品排行 -->
<div style="display:flex;gap:10px;margin-bottom:10px">
<div class="pn" style="flex:1"><div class="tt">📈 销售趋势</div><div id="chart_analytics_sales" style="height:200px"></div></div>
<div class="pn" style="flex:1"><div class="tt">🏆 商品销售排行</div>
<div v-for="(p,i) in analyticsTopProds.slice(0,5)" :key="p.id" class="ri"><span class="rn" :style="{color:i===0?'#F5B83D':i===1?'#8FA8C0':i===2?'#C08A5C':'#6F91A8'}">{{i+1}}</span><span>{{p.name}}</span><span class="rc" style="color:#28C76F">¥{{(p.price*p.sales).toLocaleString()}}</span><span class="rc">{{p.sales}}件</span></div>
<div v-if="!analyticsTopProds.length" style="color:#6F91A8;font-size:10px;text-align:center;padding:20px">暂无销售数据</div>
</div>
</div>

<!-- 渠道 + 订单状态 -->
<div style="display:flex;gap:10px;margin-bottom:10px">
<div class="pn" style="flex:1"><div class="tt">📡 销售渠道</div>
<div class="dg3"><span class="dl3">线上商城</span><div style="color:#28C76F;font-weight:600">&yen;{{analyticsChannelOnline.toLocaleString()}}</div></div>
<div class="dg3"><span class="dl3">直播销售</span><div style="color:#28C76F;font-weight:600">&yen;{{lives.reduce((s,l)=>s+(l.sales||0),0).toLocaleString()}}</div></div>
<div class="dg3"><span class="dl3">其他渠道</span><div>¥0</div></div>
</div>
<div class="pn" style="flex:1"><div class="tt">📋 订单情况</div>
<div class="dg3"><span class="dl3">待支付</span><div style="color:#F5B83D;font-weight:600">{{allOrders.filter(o=>o.orderStatus==='pending_payment').length}}笔</div></div>
<div class="dg3"><span class="dl3">待发货</span><div style="color:#28C76F;font-weight:600">{{allOrders.filter(o=>o.orderStatus==='pending_shipment').length}}笔</div></div>
<div class="dg3"><span class="dl3">配送中</span><div>{{allOrders.filter(o=>o.orderStatus==='shipped').length}}笔</div></div>
<div class="dg3"><span class="dl3">已完成</span><div style="color:#28C76F;font-weight:600">{{allOrders.filter(o=>o.orderStatus==='completed').length}}笔</div></div>
<div class="dg3"><span class="dl3">已取消/退款</span><div style="color:#E74C3C">{{allOrders.filter(o=>o.orderStatus==='cancelled').length}}笔</div></div>
</div>
</div>

<!-- 溯源 + 直播 -->
<div style="display:flex;gap:10px">
<div class="pn" style="flex:1"><div class="tt">🔍 溯源情况</div>
<div class="dg3"><span class="dl3">溯源批次</span><div style="font-weight:600">{{traces.length}}批</div></div>
<div class="dg3"><span class="dl3">关联销售商品</span><div>{{prods.filter(p=>p.batch&&traces.some(t=>t.batchNo===p.batch)).length}}种</div></div>
<div class="dg3"><span class="dl3">异常批次</span><div style="color:#E74C3C;font-weight:600">{{traces.filter(t=>t.batchStatus==='recalled'||t.inspectionStatus==='unqualified').length}}批</div></div>
</div>
<div class="pn" style="flex:1"><div class="tt">📺 直播经营</div>
<div class="dg3"><span class="dl3">直播次数</span><div style="font-weight:600">{{lives.length}}场</div></div>
<div class="dg3"><span class="dl3">直播成交额</span><div style="color:#28C76F;font-weight:600">&yen;{{lives.reduce((s,l)=>s+(l.sales||0),0).toLocaleString()}}</div></div>
<div class="dg3"><span class="dl3">最高单场成交</span><div style="color:#28C76F;font-weight:600">&yen;{{Math.max(...lives.map(l=>l.sales||0),0).toLocaleString()}}</div></div>
</div>
</div>
</div>
</template>

</div>

<div class="mo" :class="{on:modal}" @click="modal=false"><div class="mb" @click.stop><div class="mh">{{modalTitle}}<button class="mc" @click="modal=false">x</button></div>
<div v-if="modalType==='prod'">
<div style="color:#6F91A8;font-size:12px;text-align:center;padding:20px">请使用表单抽屉编辑商品</div>
</div>
<div v-if="modalType==='order'">
<div class="fl"><label>商品</label><input v-model="of2.item" class="fin"></div><div class="fr3"><div class="fl"><label>买家</label><input v-model="of2.buyer" class="fin"></div><div class="fl"><label>金额</label><input v-model="of2.amount" type="number" class="fin"></div></div>
<div class="fr3"><div class="fl"><label>联系电话</label><input v-model="of2.phone" class="fin"></div><div class="fl"><label>地址</label><input v-model="of2.addr" class="fin"></div></div>
<div class="fl"><label>物流单号</label><input v-model="of2.logistics" class="fin"></div>
<div class="ma"><button class="bp" @click="saveOrder">保存</button><button class="bo" @click="modal=false">取消</button></div>
</div>
</div></div>

<div class="toast-area"><div v-for="t in toasts" :key="t.id" :class="'to '+t.type">{{t.msg}}</div></div>
</div>
</template>
<script setup>
import {ref,reactive,computed,watch,onMounted,nextTick} from 'vue'
import * as echarts from 'echarts'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
const props=defineProps({embedded:Boolean,activeTab:String})
const toasts=reactive([])
function toast(m,t='info'){const id=Date.now();toasts.push({id,msg:m,type:t});setTimeout(()=>{const i=toasts.findIndex(x=>x.id===id);if(i>=0)toasts.splice(i,1)},2300)}

const clock=ref('')
onMounted(()=>{setInterval(()=>{const d=new Date();clock.value=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')+':'+String(d.getSeconds()).padStart(2,'0')},1000);nextTick(()=>initCharts())})

const tabs=[{k:'products',i:'📦',l:'商品管理'},{k:'orders',i:'📋',l:'订单管理'},{k:'trace',i:'🏷️',l:'产品溯源'},{k:'live',i:'📺',l:'直播中心'},{k:'analytics',i:'📊',l:'经营分析'}]
const cur=ref('products')
const currentTitle=computed(()=>{const t=tabs.find(t=>t.k===cur.value);return t?t.l:'商品管理'})
watch(()=>props.activeTab,v=>{if(v&&tabs.find(t=>t.k===v))cur.value=v})
const cats=['水果类','水产类','蔬菜类','特色农产品','粮油类']
const certOptions=['绿色食品','富硒认证','地理标志','推荐商品']
let uid=()=>Date.now()

// ===== API预留 =====
// GET    /api/ecommerce/products             列表查询
// GET    /api/ecommerce/products/:id         商品详情
// POST   /api/ecommerce/products             新增商品
// PUT    /api/ecommerce/products/:id         编辑商品
// PATCH  /api/ecommerce/products/:id/status  上下架/状态变更
// PATCH  /api/ecommerce/products/batch-status 批量状态
// POST   /api/ecommerce/products/:id/stock-adjustment 库存调整
// DELETE /api/ecommerce/products/:id         删除商品
// GET    /api/ecommerce/products/export      导出

const prods=reactive([
  {id:1,productCode:'SP2026001',name:'蜂糖李',subTitle:'中堰精选·大果',cat:'水果类',price:128,marketPrice:148,costPrice:88,stock:180,maxStock:200,unit:'斤',spec:'大果 2.5kg/箱',origin:'中堰村产业园东区',villageId:1,villageName:'中堰村',industryName:'蜂糖李产业',baseName:'蜂糖李基地',supplier:'中堰村合作社',batch:'P2026001',harvestDate:'2026-07-01',sales:980,status:'已上架',stockWarningThreshold:30,tags:['富硒认证','绿色食品'],channels:['小程序','直播'],recommended:true,createdBy:'管理员',updatedAt:'2026-07-28 15:30',_icon:'🍑',_color:'rgba(231,120,60,.25)'},
  {id:2,productCode:'SP2026002',name:'富硒黄桃',subTitle:'高山富硒·香甜多汁',cat:'水果类',price:88,marketPrice:108,costPrice:58,stock:320,maxStock:500,unit:'斤',spec:'精品 5kg/箱',origin:'中堰村产业园南区',villageId:1,villageName:'中堰村',industryName:'富硒黄桃产业',baseName:'富硒黄桃园',supplier:'中堰村合作社',batch:'P2026002',harvestDate:'2026-07-05',sales:1560,status:'已上架',stockWarningThreshold:50,tags:['富硒认证'],channels:['小程序','线下'],recommended:true,createdBy:'管理员',updatedAt:'2026-07-27 10:20',_icon:'🍑',_color:'rgba(248,180,0,.25)'},
  {id:3,productCode:'SP2026003',name:'阳光玫瑰葡萄',subTitle:'有机种植·玫瑰清香',cat:'水果类',price:68,marketPrice:88,costPrice:42,stock:15,maxStock:200,unit:'斤',spec:'1.5kg/箱',origin:'中堰村产业园西区',villageId:1,villageName:'中堰村',industryName:'葡萄产业',baseName:'阳光玫瑰葡萄园',supplier:'张大叔',batch:'P2026003',harvestDate:'2026-07-10',sales:720,status:'已上架',stockWarningThreshold:20,tags:[],channels:['直播'],recommended:false,createdBy:'管理员',updatedAt:'2026-07-26 08:15',_icon:'🍇',_color:'rgba(139,92,246,.25)'},
  {id:4,productCode:'SP2026004',name:'澳洲淡水龙虾',subTitle:'活虾现捞·肉质鲜美',cat:'水产类',price:268,marketPrice:328,costPrice:168,stock:0,maxStock:500,unit:'斤',spec:'活虾 1kg/袋',origin:'中堰村智能水产基地',villageId:1,villageName:'中堰村',industryName:'水产养殖',baseName:'智能水产基地',supplier:'水产养殖合作社',batch:'P2026004',harvestDate:'2026-07-15',sales:320,status:'售罄',stockWarningThreshold:30,tags:[],channels:['小程序','线下'],recommended:false,createdBy:'管理员',updatedAt:'2026-07-25 16:40',_icon:'🦞',_color:'rgba(231,76,60,.25)'},
  {id:5,productCode:'SP2026005',name:'农特产礼盒',subTitle:'中堰风味·送礼佳品',cat:'特色农产品',price:198,marketPrice:258,costPrice:128,stock:25,maxStock:100,unit:'盒',spec:'蜂糖李+黄桃+油葵籽',origin:'中堰村',villageId:1,villageName:'中堰村',industryName:'综合产业',baseName:'中堰村加工车间',supplier:'中堰村合作社',batch:'P2026005',harvestDate:'2026-07-16',sales:180,status:'已上架',stockWarningThreshold:10,tags:['限时','推荐'],channels:['小程序','直播','线下'],recommended:true,createdBy:'管理员',updatedAt:'2026-07-28 09:00',_icon:'🎁',_color:'rgba(40,199,111,.25)'}
])

const pf=reactive({search:'',cat:'',status:'',stockLevel:'',certifications:[]})
const prodSelected=ref([]),prodSelectAll=ref(false)
const pf2=reactive({name:'',subTitle:'',cat:'水果类',price:'',marketPrice:'',costPrice:'',stock:'',maxStock:'200',unit:'件',spec:'',origin:'',villageName:'中堰村',industryName:'',baseName:'',supplier:'',batch:'',harvestDate:'',tagsStr:'',channels:[],stockWarningThreshold:'30',recommended:false,_saveStatus:'已上架',_desc:'',_previewUrl:'',_imageFile:null,_productCode:'',_updatedAt:'',_originalData:''})
const modalEditId=ref(null)
const prodFormOpen=ref(false)
const prodFormDirty=ref(false)
const imgInput=ref(null)
const formInitialData=ref('')

function stockStatusLabel(p){
  const pct=p.maxStock?p.stock/p.maxStock:0
  if(p.stock===0)return {text:'售罄',cls:'r',color:'#E74C3C'}
  if(pct<=0.1)return {text:'紧缺',cls:'r',color:'#E74C3C'}
  if(pct<=0.3)return {text:'偏低',cls:'y',color:'#F5B83D'}
  return {text:'正常',cls:'g',color:'#28C76F'}
}
function stockPct(p){return p.maxStock?Math.min(100,Math.round(p.stock/p.maxStock*100)):0}

function statusCls(s){return s==='已上架'?'g':s==='草稿'?'dim':s==='待审核'?'y':s==='已下架'?'dim':s==='售罄'?'r':s==='已停用'?'dim':'dim'}
function statusLabel(s){return s==='已上架'?'已上架':s==='草稿'?'草稿':s==='待审核'?'待审核':s==='已下架'?'已下架':s==='售罄'?'售罄':s==='已停用'?'已停用':s}

const filteredProds=computed(()=>{
  let l=prods
  if(pf.search){const s=pf.search.toLowerCase();l=l.filter(p=>p.name.toLowerCase().includes(s)||p.productCode?.toLowerCase().includes(s)||p.batch?.toLowerCase().includes(s))}
  if(pf.cat)l=l.filter(p=>p.cat===pf.cat)
  if(pf.status)l=l.filter(p=>p.status===pf.status)
  if(pf.stockLevel==='normal')l=l.filter(p=>stockPct(p)>30)
  if(pf.stockLevel==='low')l=l.filter(p=>stockPct(p)>0&&stockPct(p)<=30)
  if(pf.stockLevel==='out')l=l.filter(p=>p.stock===0)
  if(pf.certifications.length)l=l.filter(p=>pf.certifications.every(c=>(p.tags||[]).includes(c)))
  return l
})
function toggleAllProds(){prodSelected.value=prodSelectAll.value?filteredProds.value.map(p=>p.id):[]}
const prodDrawer=ref(false),prodDetail=ref(null)
function showProdDetail(p){prodDetail.value=p;prodDrawer.value=true}

function openProdForm(id){
  if(id){
    const p=prods.find(x=>x.id===id)
    if(p){
      Object.assign(pf2,{name:p.name||'',subTitle:p.subTitle||'',cat:p.cat,price:p.price,marketPrice:p.marketPrice||'',costPrice:p.costPrice||'',stock:p.stock,maxStock:p.maxStock||'200',unit:p.unit||'件',spec:p.spec||'',origin:p.origin||'',villageName:p.villageName||'中堰村',industryName:p.industryName||'',baseName:p.baseName||'',supplier:p.supplier||'',batch:p.batch||'',harvestDate:p.harvestDate||'',tagsStr:(p.tags||[]).join(','),stockWarningThreshold:p.stockWarningThreshold||'30',recommended:!!p.recommended,_saveStatus:p.status||'已上架',_desc:'',_previewUrl:'',_imageFile:null,_productCode:p.productCode||'',_updatedAt:p.updatedAt||''})
      modalEditId.value=id
    }
  }else{
    Object.assign(pf2,{name:'',subTitle:'',cat:'水果类',price:'',marketPrice:'',costPrice:'',stock:'',maxStock:'200',unit:'件',spec:'',origin:'',villageName:'中堰村',industryName:'',baseName:'',supplier:'',batch:'',harvestDate:'',tagsStr:'',stockWarningThreshold:'30',recommended:false,_saveStatus:'已上架',_desc:'',_previewUrl:'',_imageFile:null,_productCode:'',_updatedAt:''})
    modalEditId.value=null
  }
  formInitialData.value=JSON.stringify(pf2)
  prodFormOpen.value=true
  prodFormDirty.value=false
}

function validateForm(){
  if(!pf2.name.trim()){toast('请输入商品名称','warn');return false}
  const stock=parseInt(pf2.stock)||0, max=parseInt(pf2.maxStock)||200, warn=parseInt(pf2.stockWarningThreshold)||30
  if(stock<0){toast('库存不能为负数','warn');return false}
  if(max<=0){toast('库存上限必须大于0','warn');return false}
  if(warn>max){toast('预警阈值不能大于库存上限('+max+')','warn');return false}
  const price=parseFloat(pf2.price)||0, mkt=parseFloat(pf2.marketPrice)||0, cost=parseFloat(pf2.costPrice)||0
  if(price<0||mkt<0||cost<0){toast('价格不能为负数','warn');return false}
  return true
}
function saveProd(){
  if(!validateForm())return
  const tags=pf2.tagsStr?pf2.tagsStr.split(',').map(t=>t.trim()).filter(Boolean):[]
  const status=pf2._saveStatus||'已上架'
  const obj={name:pf2.name||'未命名',subTitle:pf2.subTitle||'',productCode:modalEditId.value?(pf2._productCode||'SP'+Date.now().toString(36).toUpperCase()):'SP'+Date.now().toString(36).toUpperCase(),cat:pf2.cat,price:parseFloat(pf2.price)||0,marketPrice:parseFloat(pf2.marketPrice)||0,costPrice:parseFloat(pf2.costPrice)||0,stock:parseInt(pf2.stock)||0,maxStock:parseInt(pf2.maxStock)||200,unit:pf2.unit,spec:pf2.spec,origin:pf2.origin,villageName:pf2.villageName,industryName:pf2.industryName,baseName:pf2.baseName,supplier:pf2.supplier,batch:pf2.batch,harvestDate:pf2.harvestDate,tags,stockWarningThreshold:parseInt(pf2.stockWarningThreshold)||30,recommended:!!pf2.recommended,status,updatedAt:new Date().toISOString().replace('T',' ').slice(0,16)}
  if(modalEditId.value){
    const i=prods.findIndex(x=>x.id===modalEditId.value)
    if(i>=0){const old=prods[i];prods[i]={...obj,id:old.id,productCode:old.productCode,sales:old.sales,createdBy:old.createdBy||'管理员',_icon:pf2._previewUrl?pf2._previewUrl:old._icon||'📦',_color:old._color||'rgba(10,61,92,0.55)'}}
    toast('商品修改成功','ok')
  }else{
    prods.unshift({id:uid(),sales:0,createdBy:'管理员',_icon:'📦',_color:'rgba(10,61,92,0.55)',...obj})
    toast('商品新增成功','ok')
  }
  prodFormOpen.value=false;prodFormDirty.value=false
}

function toggleProd(id){const p=prods.find(x=>x.id===id);if(p){if(p.status==='已上架'||p.status==='售罄'){p.status='已下架'}else if(p.status==='已下架'||p.status==='已停用'){if(p.stock===0){toast('库存为0，无法上架','warn');return}p.status='已上架'}else{p.status='已上架'}p.updatedAt=new Date().toISOString().replace('T',' ').slice(0,16);toast('已变更为 '+p.status,'ok')}}
function delProd(id){
  const p=prods.find(x=>x.id===id);if(!p)return
  if(p.sales>0){if(!confirm('该商品已有'+p.sales+'笔订单，不可删除。是否停用？'))return;p.status='已停用';p.updatedAt=new Date().toISOString().replace('T',' ').slice(0,16);toast('已停用','ok');return}
  if(!confirm('确定删除该商品？此操作不可恢复。'))return;const i=prods.findIndex(x=>x.id===id);if(i>=0){prods.splice(i,1);toast('已删除','ok')}
}
function copyProd(p){const copy={...p,id:uid(),name:p.name+'（副本）',productCode:'SP'+Date.now().toString(36).toUpperCase(),sales:0,status:'草稿',updatedAt:new Date().toISOString().replace('T',' ').slice(0,16)};prods.unshift(copy);toast('已复制','ok')}
function batchAction(act){
  if(!prodSelected.value.length){toast('请先勾选商品','warn');return}
  if(act==='删除'){if(!confirm('确定批量删除已选择的'+prodSelected.value.length+'件商品？'))return;prodSelected.value.forEach(id=>{const i=prods.findIndex(x=>x.id===id);if(i>=0)prods.splice(i,1)});toast('已批量删除','ok');prodSelected.value=[];return}
  prodSelected.value.forEach(id=>{const p=prods.find(x=>x.id===id);if(p){p.status=act;p.updatedAt=new Date().toISOString().replace('T',' ').slice(0,16)}})
  toast('已批量'+act,'ok');prodSelected.value=[]
}
function exportProducts(){
  const data=filteredProds.value.length?filteredProds.value:prods
  const csv='编号,名称,分类,售价,库存,单位,销量,状态,更新时间\n'+data.map(p=>[p.productCode||'',p.name,p.cat,p.price,p.stock+'/'+(p.maxStock||200),p.unit||'',p.sales,p.status,p.updatedAt||''].join(',')).join('\n')
  downloadCSV('﻿'+csv,'商品数据_'+new Date().toISOString().slice(0,10)+'.csv')
}
function resetFilters(){Object.assign(pf,{search:'',cat:'',status:'',stockLevel:'',certifications:[]})}
function toggleCertFilter(cert){const i=pf.certifications.indexOf(cert);if(i>=0)pf.certifications.splice(i,1);else pf.certifications.push(cert)}

function confirmCloseForm(){
  if(prodFormDirty.value||JSON.stringify(pf2)!==formInitialData.value){
    if(!confirm('当前修改尚未保存，确定关闭吗？'))return
  }
  prodFormOpen.value=false;prodFormDirty.value=false
}
function triggerImageUpload(){imgInput.value?.click()}
function onImageChange(e){
  const f=e.target.files[0];if(!f)return
  if(f.size>2*1024*1024){toast('图片大小不能超过2MB','warn');return}
  pf2._previewUrl=URL.createObjectURL(f);pf2._imageFile=f
  prodFormDirty.value=true
}
// Track form changes
function markDirty(){prodFormDirty.value=true}

// ===== API预留 =====
// GET    /api/ecommerce/orders              订单列表
// GET    /api/ecommerce/orders/:id          订单详情
// POST   /api/ecommerce/orders/manual       手工录单
// POST   /api/ecommerce/orders/:id/ship     发货
// POST   /api/ecommerce/orders/batch-ship   批量发货
// POST   /api/ecommerce/orders/:id/cancel   取消订单
// POST   /api/ecommerce/orders/:id/refund   退款
// GET    /api/ecommerce/orders/:id/timeline 操作记录
// GET    /api/ecommerce/orders/export       导出

const allOrders=reactive([
  {id:'ORD0617',orderNo:'20260728150001',source:'小程序',createdAt:'2026-07-28 15:00',buyer:'张女士',buyerPhone:'138****1234',buyerPhoneRaw:'13812345678',province:'湖北省',city:'武汉市',district:'洪山区',address:'珞喻路100号',buyerNote:'请放快递柜',items:[{productId:1,productName:'蜂糖李礼盒',spec:'大果 2.5kg/箱',quantity:2,unitPrice:384,subtotal:768}],productAmount:768,shippingFee:0,discountAmount:0,paidAmount:768,refundAmount:0,paymentMethod:'微信支付',paymentNo:'WX20260728150001',paidAt:'2026-07-28 15:01',paymentStatus:'paid',shipmentStatus:'unshipped',orderStatus:'pending_shipment',afterSaleStatus:'none',shippingMethod:'',shippingCompany:'',trackingNo:'',shippedAt:'',signedAt:'',cancelReason:'',timeline:[{time:'2026-07-28 15:00',action:'订单创建',operator:'系统'},{time:'2026-07-28 15:01',action:'支付成功',operator:'微信支付'}]},
  {id:'ORD0618',orderNo:'20260727100001',source:'小程序',createdAt:'2026-07-27 10:00',buyer:'李先生',buyerPhone:'139****2345',buyerPhoneRaw:'13923456789',province:'陕西省',city:'安康市',district:'汉滨区',address:'金州路50号',items:[{productId:2,productName:'富硒黄桃',spec:'精品 5kg/箱',quantity:1,unitPrice:88,subtotal:88}],productAmount:88,shippingFee:16,discountAmount:0,paidAmount:104,refundAmount:0,paymentMethod:'支付宝',paymentNo:'ZFB20260727100001',paidAt:'2026-07-27 10:02',paymentStatus:'paid',shipmentStatus:'shipped',orderStatus:'shipped',afterSaleStatus:'none',shippingMethod:'快递配送',shippingCompany:'顺丰速运',trackingNo:'SF1234567890',shippedAt:'2026-07-27 14:00',signedAt:'',timeline:[{time:'2026-07-27 10:00',action:'订单创建',operator:'系统'},{time:'2026-07-27 10:02',action:'支付成功',operator:'支付宝'},{time:'2026-07-27 14:00',action:'商家发货',operator:'管理员'}]},
  {id:'ORD0619',orderNo:'20260725160001',source:'直播',createdAt:'2026-07-25 16:00',buyer:'王女士',buyerPhone:'136****3456',buyerPhoneRaw:'13634567890',province:'陕西省',city:'西安市',district:'雁塔区',address:'长安南路200号',items:[{productId:3,productName:'阳光玫瑰葡萄',spec:'1.5kg/箱',quantity:2,unitPrice:68,subtotal:136}],productAmount:136,shippingFee:0,discountAmount:0,paidAmount:136,refundAmount:0,paymentMethod:'微信支付',paymentNo:'WX20260725160001',paidAt:'2026-07-25 16:01',paymentStatus:'paid',shipmentStatus:'signed',orderStatus:'completed',afterSaleStatus:'none',shippingMethod:'快递配送',shippingCompany:'京东物流',trackingNo:'JD9876543210',shippedAt:'2026-07-25 18:00',signedAt:'2026-07-27 09:00',timeline:[{time:'2026-07-25 16:00',action:'订单创建',operator:'系统'},{time:'2026-07-25 16:01',action:'支付成功',operator:'微信支付'},{time:'2026-07-25 18:00',action:'商家发货',operator:'管理员'},{time:'2026-07-27 09:00',action:'物流签收',operator:'系统'}]},
  {id:'ORD0620',orderNo:'20260728180001',source:'小程序',createdAt:'2026-07-28 18:00',buyer:'赵大哥',buyerPhone:'135****4567',buyerPhoneRaw:'13545678901',province:'重庆市',city:'重庆市',district:'渝北区',address:'新南路88号',items:[{productId:4,productName:'澳洲淡水龙虾',spec:'活虾 1kg/袋',quantity:2,unitPrice:268,subtotal:536}],productAmount:536,shippingFee:0,discountAmount:0,paidAmount:0,refundAmount:0,paymentMethod:'',paymentNo:'',paidAt:'',paymentStatus:'unpaid',shipmentStatus:'unshipped',orderStatus:'pending_payment',afterSaleStatus:'none',shippingMethod:'',shippingCompany:'',trackingNo:'',shippedAt:'',signedAt:'',timeline:[{time:'2026-07-28 18:00',action:'订单创建',operator:'系统'}]},
  {id:'ORD0621',orderNo:'20260720120001',source:'小程序',createdAt:'2026-07-20 12:00',buyer:'陈先生',buyerPhone:'137****5678',buyerPhoneRaw:'13756789012',province:'四川省',city:'成都市',district:'武侯区',address:'人民南路300号',items:[{productId:5,productName:'农特产礼盒',spec:'蜂糖李+黄桃+油葵籽',quantity:2,unitPrice:198,subtotal:396}],productAmount:396,shippingFee:0,discountAmount:0,paidAmount:396,refundAmount:396,paymentMethod:'微信支付',paymentNo:'WX20260720120001',paidAt:'2026-07-20 12:02',paymentStatus:'refunded',shipmentStatus:'unshipped',orderStatus:'cancelled',afterSaleStatus:'completed',shippingMethod:'',shippingCompany:'',trackingNo:'',shippedAt:'',signedAt:'',cancelReason:'商品缺货',cancelNote:'用户申请退款，已全额退款',timeline:[{time:'2026-07-20 12:00',action:'订单创建',operator:'系统'},{time:'2026-07-20 12:02',action:'支付成功',operator:'微信支付'},{time:'2026-07-20 14:00',action:'售后申请',operator:'陈先生'},{time:'2026-07-20 15:00',action:'退款完成',operator:'管理员'}]}
])
const orderSelected=ref([]),orderSelectAll=ref(false)
const filteredOrders=computed(()=>{
  let l=allOrders
  if(of.keyword){const s=of.keyword.toLowerCase();l=l.filter(o=>o.orderNo.toLowerCase().includes(s)||o.buyer.toLowerCase().includes(s)||o.buyerPhone.includes(of.keyword)||o.items?.some(i=>i.productName.toLowerCase().includes(s)))}
  if(of.orderStatus)l=l.filter(o=>o.orderStatus===of.orderStatus)
  if(of.paymentStatus)l=l.filter(o=>o.paymentStatus===of.paymentStatus)
  if(of.shipmentStatus)l=l.filter(o=>o.shipmentStatus===of.shipmentStatus)
  if(of.afterSaleStatus==='processing')l=l.filter(o=>o.afterSaleStatus&&o.afterSaleStatus!=='none'&&o.afterSaleStatus!=='completed')
  if(of.dateFrom)l=l.filter(o=>o.createdAt>=of.dateFrom)
  if(of.dateTo)l=l.filter(o=>o.createdAt<=of.dateTo+' 23:59:59')
  return l
})
function toggleAllOrders(){orderSelected.value=orderSelectAll.value?filteredOrders.value.filter(o=>eligibleForBatch(o)).map(o=>o.id):[]}

// Order display helpers
function orderStatusLabel(s){const m={pending_payment:'待支付',pending_shipment:'待发货',shipped:'运输中',completed:'已完成',cancelled:'已取消',closed:'已关闭'};return m[s]||s}
function orderStatusCls(s){const m={pending_payment:'y',pending_shipment:'y',shipped:'g',completed:'g',cancelled:'dim',closed:'dim'};return m[s]||'dim'}
function payStatusLabel(s){const m={unpaid:'待支付',paid:'已支付',partial_refund:'部分退款',refunded:'已退款'};return m[s]||s}
function shipStatusLabel(s){const m={unshipped:'待发货',shipped:'已发货',signed:'已签收'};return m[s]||s}
function getOrderActions(o){
  const a=[]
  a.push({k:'detail',l:'详情'})
  if(o.orderStatus==='pending_payment'){a.push({k:'cancel',l:'取消订单'})}
  if(o.orderStatus==='pending_shipment'){a.push({k:'ship',l:'发货'})}
  if(o.orderStatus==='shipped'){a.push({k:'viewLogistics',l:'查看物流'})}
  if(o.orderStatus==='completed'){a.push({k:'viewLogistics',l:'查看物流'})}
  if(o.afterSaleStatus&&o.afterSaleStatus!=='none'&&o.afterSaleStatus!=='completed'){a.push({k:'afterSale',l:'处理售后'})}
  if(o.afterSaleStatus==='completed'&&(o.orderStatus==='cancelled'||o.orderStatus==='closed')){a.push({k:'afterSale',l:'售后记录'})}
  return a
}
function shipStatusText(o){
  if(o.orderStatus==='pending_payment')return '—'
  if(o.orderStatus==='cancelled'||o.orderStatus==='closed')return '无需发货'
  return shipStatusLabel(o.shipmentStatus)
}
function shipStatusTagCls(o){
  if(o.orderStatus==='pending_payment')return 'dim'
  if(o.orderStatus==='cancelled'||o.orderStatus==='closed')return 'dim'
  return o.shipmentStatus==='shipped'||o.shipmentStatus==='signed'?'g':'dim'
}
function logisticsText(o){
  if(o.orderStatus==='cancelled'||o.orderStatus==='closed')return '无需发货'
  if(o.orderStatus==='pending_payment')return '—'
  if(o.shipmentStatus==='shipped'||o.shipmentStatus==='signed'){
    const signed=(o.shipmentStatus==='signed')?' · 已签收':''
    return {company:o.shippingCompany||'--',tracking:o.trackingNo||'--',signed}
  }
  return '待发货'
}
function eligibleForBatch(o){return o.orderStatus==='pending_shipment'&&o.paymentStatus==='paid'}
const of=reactive({keyword:'',orderStatus:'',paymentStatus:'',shipmentStatus:'',afterSaleStatus:'',dateFrom:'',dateTo:'',_dateRange:null})
function onDateRangeChange(val){if(val&&val.length===2){of.dateFrom=val[0];of.dateTo=val[1]}else{of.dateFrom='';of.dateTo=''}}

// Drawer & modal state
const orderDrawerOpen=ref(false),orderDetail=ref(null)
const shipModalOpen=ref(false),cancelModalOpen=ref(false)
const shipForm=reactive({orderId:'',shippingMethod:'快递配送',shippingCompany:'',trackingNo:'',note:''})
const cancelForm=reactive({orderId:'',reason:'',note:''})
const cancelReasons=['买家主动取消','商品缺货','价格错误','地址无法配送','买家未付款','其他']

function showOrderDetail(o){orderDetail.value=o;orderDrawerOpen.value=true}
function openShipModal(o){Object.assign(shipForm,{orderId:o.id,shippingMethod:'快递配送',shippingCompany:'',trackingNo:'',note:''});shipModalOpen.value=true}
function doShip(){
  if(!shipForm.shippingCompany.trim()&&shipForm.shippingMethod==='快递配送'){toast('请填写物流公司','warn');return}
  if(!shipForm.trackingNo.trim()&&shipForm.shippingMethod==='快递配送'){toast('请填写运单号','warn');return}
  const o=allOrders.find(x=>x.id===shipForm.orderId);if(!o)return
  o.shipmentStatus='shipped';o.orderStatus='shipped';o.shippingMethod=shipForm.shippingMethod;o.shippingCompany=shipForm.shippingCompany;o.trackingNo=shipForm.trackingNo;o.shippedAt=new Date().toISOString().replace('T',' ').slice(0,16)
  o.timeline.push({time:o.shippedAt,action:'商家发货',operator:'管理员'})
  shipModalOpen.value=false;toast('发货成功','ok')
}
function openCancelModal(o){Object.assign(cancelForm,{orderId:o.id,reason:'',note:''});cancelModalOpen.value=true}
function doCancel(){
  if(!cancelForm.reason){toast('请选择取消原因','warn');return}
  const o=allOrders.find(x=>x.id===cancelForm.orderId);if(!o)return
  const now=new Date().toISOString().replace('T',' ').slice(0,16)
  if(o.orderStatus==='pending_payment'){o.orderStatus='cancelled';o.timeline.push({time:now,action:'订单取消',operator:'管理员',reason:cancelForm.reason,note:cancelForm.note})}
  else if(o.orderStatus==='pending_shipment'){o.orderStatus='cancelled';o.paymentStatus='refunded';o.refundAmount=o.paidAmount;o.timeline.push({time:now,action:'订单取消并退款',operator:'管理员',reason:cancelForm.reason,note:cancelForm.note})}
  cancelModalOpen.value=false;toast('订单已取消','ok')
}
function openOrderForm(){Object.assign(of2,{item:'',buyer:'',amount:'',phone:'',addr:'',logistics:''});modalTitle.value='手工录单';modalType.value='order';modal.value=true}
function saveOrder(){allOrders.unshift({id:'ORD'+Date.now().toString(36).toUpperCase(),orderNo:Date.now().toString(),source:'手工录入',createdAt:new Date().toISOString().replace('T',' ').slice(0,16),buyer:of2.buyer||'未填写',buyerPhone:of2.phone||'',province:'',city:'',address:of2.addr||'',items:[{productName:of2.item||'未填写',quantity:1,unitPrice:parseInt(of2.amount)||0,subtotal:parseInt(of2.amount)||0}],productAmount:parseInt(of2.amount)||0,shippingFee:0,discountAmount:0,paidAmount:0,refundAmount:0,paymentStatus:'unpaid',shipmentStatus:'unshipped',orderStatus:'pending_payment',afterSaleStatus:'none',shippingMethod:'',shippingCompany:'',trackingNo:'',timeline:[{time:new Date().toISOString().replace('T',' ').slice(0,16),action:'手工录单',operator:'管理员'}]});modal.value=false;toast('已录入','ok')}

function batchShipOrders(){
  const eligible=orderSelected.value.map(id=>allOrders.find(o=>o.id===id)).filter(o=>o&&o.orderStatus==='pending_shipment')
  if(!eligible.length){toast('所选订单中没有待发货订单','warn');return}
  const now=new Date().toISOString().replace('T',' ').slice(0,16)
  eligible.forEach(o=>{const t='SF'+Math.random().toString(36).slice(2,8).toUpperCase();o.shipmentStatus='shipped';o.orderStatus='shipped';o.shippingMethod='快递配送';o.shippingCompany='顺丰速运';o.trackingNo=t;o.shippedAt=now;o.timeline.push({time:now,action:'批量发货',operator:'管理员'})})
  toast('已批量发货 '+eligible.length+' 单','ok');orderSelected.value=[]
}

function exportOrders(){
  const data=filteredOrders.value.length?filteredOrders.value:allOrders
  const csv='订单号,下单时间,商品,买家,手机号,收货地址,实付金额,支付状态,发货状态,物流公司,运单号,订单状态\n'+data.map(o=>[o.orderNo,o.createdAt,o.items?.map(i=>i.productName+'×'+i.quantity).join(';')||'',o.buyer,o.buyerPhone,o.province+o.city+o.address,o.paidAmount,payStatusLabel(o.paymentStatus),shipStatusLabel(o.shipmentStatus),o.shippingCompany||'',o.trackingNo||'',orderStatusLabel(o.orderStatus)].join(',')).join('\n')
  downloadCSV('﻿'+csv,'订单数据_'+new Date().toISOString().slice(0,10)+'.csv')
}
function resetOrderFilters(){Object.assign(of,{keyword:'',orderStatus:'',paymentStatus:'',shipmentStatus:'',afterSaleStatus:'',dateFrom:'',dateTo:'',_dateRange:null})}
const of2=reactive({item:'',buyer:'',amount:'',phone:'',addr:'',logistics:''})

// ===== API预留 =====
// GET    /api/ecommerce/trace-batches              批次列表
// GET    /api/ecommerce/trace-batches/:id          批次详情
// POST   /api/ecommerce/trace-batches              新增批次
// PUT    /api/ecommerce/trace-batches/:id          编辑批次
// PATCH  /api/ecommerce/trace-batches/:id/status   状态变更
// GET    /api/ecommerce/trace-batches/:id/records  生产记录
// POST   /api/ecommerce/trace-batches/:id/inspections 录入检测
// GET    /api/ecommerce/trace-batches/:id/inspections 检测记录
// POST   /api/ecommerce/trace-batches/:id/qrcode   生成二维码
// GET    /api/ecommerce/trace-batches/:id/qrcode   获取二维码
// GET    /api/ecommerce/trace-batches/:id/scans    扫码统计
// POST   /api/ecommerce/trace-batches/:id/suspend  暂停
// POST   /api/ecommerce/trace-batches/:id/recall   召回
// POST   /api/ecommerce/trace-batches/:id/resume   恢复
// GET    /api/ecommerce/trace-batches/export       导出

const traces=reactive([
  {id:1,batchNo:'ZY-LI-20260701-001',villageId:1,villageName:'中堰村',industryName:'蜂糖李产业',productName:'蜂糖李',varietyName:'蜂糖李1号',baseName:'蜂糖李基地',plotName:'产业园东区1号地',producerType:'合作社',producerName:'中堰村蜂糖李合作社',manager:'赵大哥',harvestDate:'2026-07-01',harvestQuantity:500,harvestUnit:'斤',inspectionStatus:'qualified',inspectionHistory:[{type:'质量检测',org:'安康市农产品质量检测中心',date:'2026-07-02',result:'合格',reportNo:'JC20260702001'}],batchStatus:'normal',packDate:'2026-07-03',packSpec:'大果 2.5kg/箱',packQty:200,shelfLife:'常温30天',scanCount:128,totalScan:128,qrCodeUrl:'/trace/ZY-LI-20260701-001',createdBy:'管理员',createdAt:'2026-06-28 10:00',updatedAt:'2026-07-02 15:30',auditStatus:'approved',timeline:[{time:'2026-06-28 10:00',action:'批次创建',operator:'管理员'},{time:'2026-07-02 15:30',action:'检测通过',operator:'安康市检测中心'}]},
  {id:2,batchNo:'ZY-HT-20260705-001',villageId:1,villageName:'中堰村',industryName:'富硒黄桃产业',productName:'富硒黄桃',varietyName:'锦绣黄桃',baseName:'富硒黄桃园',plotName:'产业园南区2号地',producerType:'合作社',producerName:'中堰村合作社',manager:'刘阿姨',harvestDate:'2026-07-05',harvestQuantity:800,harvestUnit:'斤',inspectionStatus:'qualified',inspectionHistory:[{type:'质量检测',org:'安康市农产品质量检测中心',date:'2026-07-06',result:'合格',reportNo:'JC20260706002'}],batchStatus:'normal',packDate:'2026-07-06',packSpec:'精品 5kg/箱',packQty:160,shelfLife:'常温30天',scanCount:256,totalScan:256,qrCodeUrl:'/trace/ZY-HT-20260705-001',createdBy:'管理员',createdAt:'2026-07-03 09:00',updatedAt:'2026-07-06 14:00',auditStatus:'approved',timeline:[{time:'2026-07-03 09:00',action:'批次创建',operator:'管理员'},{time:'2026-07-06 14:00',action:'检测通过',operator:'安康市检测中心'}]},
  {id:3,batchNo:'ZY-PT-20260710-001',villageId:1,villageName:'中堰村',industryName:'葡萄产业',productName:'阳光玫瑰葡萄',varietyName:'阳光玫瑰',baseName:'阳光玫瑰葡萄园',plotName:'产业园西区3号地',producerType:'农户',producerName:'张大叔',manager:'张大叔',harvestDate:'2026-07-10',harvestQuantity:200,harvestUnit:'斤',inspectionStatus:'unqualified',inspectionHistory:[{type:'质量检测',org:'安康市农产品质量检测中心',date:'2026-07-11',result:'不合格',reportNo:'JC20260711003'}],batchStatus:'recalled',packDate:'',packSpec:'1.5kg/箱',packQty:0,shelfLife:'',scanCount:32,totalScan:32,qrCodeUrl:'',createdBy:'管理员',createdAt:'2026-07-08 08:00',updatedAt:'2026-07-11 11:00',abnormalReason:'农残超标',auditStatus:'pending',timeline:[{time:'2026-07-08 08:00',action:'批次创建',operator:'管理员'},{time:'2026-07-11 10:00',action:'检测不合格',operator:'安康市检测中心',reason:'农残超标'},{time:'2026-07-11 11:00',action:'批次召回',operator:'管理员'}]}
])
const tfFilter=reactive({keyword:'',inspectionStatus:'',batchStatus:'',dateFrom:'',dateTo:'',_dateRange:null})
const filteredTraces=computed(()=>{
  let l=traces
  if(tfFilter.keyword){const s=tfFilter.keyword.toLowerCase();l=l.filter(t=>t.batchNo.toLowerCase().includes(s)||t.productName.toLowerCase().includes(s)||t.villageName.toLowerCase().includes(s))}
  if(tfFilter.inspectionStatus)l=l.filter(t=>t.inspectionStatus===tfFilter.inspectionStatus)
  if(tfFilter.batchStatus)l=l.filter(t=>t.batchStatus===tfFilter.batchStatus)
  if(tfFilter.dateFrom)l=l.filter(t=>t.harvestDate>=tfFilter.dateFrom)
  if(tfFilter.dateTo)l=l.filter(t=>t.harvestDate<=tfFilter.dateTo)
  return l
})
function onTraceDateChange(val){if(val&&val.length===2){tfFilter.dateFrom=val[0];tfFilter.dateTo=val[1]}else{tfFilter.dateFrom='';tfFilter.dateTo=''}}
function resetTraceFilters(){Object.assign(tfFilter,{keyword:'',inspectionStatus:'',batchStatus:'',dateFrom:'',dateTo:'',_dateRange:null})}

function batchStatusLabel(s){const m={draft:'草稿',incomplete:'待完善',normal:'正常',suspended:'已暂停',recalling:'召回中',recalled:'已召回',archived:'已归档'};return m[s]||s}
function batchStatusCls(s){const m={draft:'dim',incomplete:'y',normal:'g',suspended:'y',recalling:'r',recalled:'r',archived:'dim'};return m[s]||'dim'}
function inspStatusLabel(s){const m={untested:'未检测',testing:'检测中',qualified:'合格',unqualified:'不合格',expired:'已过期'};return m[s]||s}
function inspStatusCls(s){const m={untested:'dim',testing:'b',qualified:'g',unqualified:'r',expired:'y'};return m[s]||'dim'}

function getTraceActions(t){
  const a=[]
  a.push({k:'detail',l:'查看档案'})
  if(t.batchStatus==='draft'||t.batchStatus==='incomplete'){a.push({k:'edit',l:'编辑'});a.push({k:'submitTest',l:'提交检测'})}
  if(t.batchStatus==='normal'){
    if(!t.qrCodeUrl){a.push({k:'qrcode',l:'生成溯源码',cls:'bp'})}else{a.push({k:'qrcode',l:'二维码管理',cls:'bp'})}
    a.push({k:'suspend',l:'暂停'})
  }
  if(t.batchStatus==='suspended'){a.push({k:'handleAbnormal',l:'处理异常'});a.push({k:'resume',l:'解除暂停'});a.push({k:'recall',l:'发起召回'})}
  if(t.batchStatus==='recalling'){a.push({k:'recallProgress',l:'召回进展'});a.push({k:'completeRecall',l:'完成召回'})}
  if(t.batchStatus==='recalled'){a.push({k:'recallRecord',l:'召回记录'});a.push({k:'archive',l:'归档'})}
  return a
}

function traceCompleteness(t){
  const items=[]
  if(t.batchNo&&t.productName)items.push({k:'基本信息',ok:true})
  else items.push({k:'基本信息',ok:false})
  if(t.villageName&&t.baseName&&t.plotName)items.push({k:'来源信息',ok:true})
  else items.push({k:'来源信息',ok:false})
  if(t.producerName&&t.manager)items.push({k:'生产主体',ok:true})
  else items.push({k:'生产主体',ok:false})
  if(t.harvestDate&&t.harvestQuantity)items.push({k:'采收记录',ok:true})
  else items.push({k:'采收记录',ok:false})
  if(t.inspectionHistory&&t.inspectionHistory.length)items.push({k:'检测记录',ok:true})
  else items.push({k:'检测记录',ok:false})
  if(t.qrCodeUrl||t.totalScan>0)items.push({k:'溯源码',ok:true})
  else items.push({k:'溯源码',ok:false})
  const pct=Math.round(items.filter(i=>i.ok).length/items.length*100)
  const missing=items.filter(i=>!i.ok).map(i=>i.k).join('、')
  return {pct,missing:missing||'完整',items}
}

// Trace state
const traceDrawerOpen=ref(false),traceDetail=ref(null)
const qrModalOpen=ref(false),recallModalOpen=ref(false),addTraceOpen=ref(false)
const traceForm=reactive({batchNo:'',productName:'',varietyName:'',villageName:'中堰村',industryName:'',baseName:'',plotName:'',producerType:'合作社',producerName:'',manager:'',harvestDate:'',harvestQuantity:'',harvestUnit:'斤',inspectionStatus:'pending',inspectionOrg:'',inspectionDate:'',inspectionResult:'',reportNo:'',packDate:'',packSpec:'',packQty:'',shelfLife:''})
const traceEditId=ref(null)
const recallForm=reactive({batchId:null,reason:'',scope:'',quantity:'',soldQty:'',notifyMethod:'',manager:'',note:''})

function showTraceDetail(t){traceDetail.value=t;traceDrawerOpen.value=true}
function openAddTrace(id){
  traceEditId.value=id||null
  if(id){const t=traces.find(x=>x.id===id);if(t)Object.assign(traceForm,{batchNo:t.batchNo,productName:t.productName,varietyName:t.varietyName,villageName:t.villageName,industryName:t.industryName,baseName:t.baseName,plotName:t.plotName,producerType:t.producerType,producerName:t.producerName,manager:t.manager,harvestDate:t.harvestDate,harvestQuantity:t.harvestQuantity,harvestUnit:t.harvestUnit,inspectionStatus:t.inspectionStatus,inspectionOrg:'',inspectionDate:'',inspectionResult:'',reportNo:'',packDate:t.packDate||'',packSpec:t.packSpec||'',packQty:t.packQty||'',shelfLife:t.shelfLife||''})}
  else{Object.assign(traceForm,{batchNo:'ZY-'+Date.now().toString(36).toUpperCase().slice(-6),productName:'',varietyName:'',villageName:'中堰村',industryName:'',baseName:'',plotName:'',producerType:'合作社',producerName:'',manager:'',harvestDate:'',harvestQuantity:'',harvestUnit:'斤',inspectionStatus:'pending',inspectionOrg:'',inspectionDate:'',inspectionResult:'',reportNo:'',packDate:'',packSpec:'',packQty:'',shelfLife:''})}
  addTraceOpen.value=true
}
function saveTrace(saveAsStatus){
  const status=saveAsStatus||'draft'
  const obj={batchNo:traceForm.batchNo||'ZY-'+Date.now().toString(36).toUpperCase().slice(-6),villageName:traceForm.villageName,industryName:traceForm.industryName,productName:traceForm.productName,varietyName:traceForm.varietyName,baseName:traceForm.baseName,plotName:traceForm.plotName,producerType:traceForm.producerType,producerName:traceForm.producerName,manager:traceForm.manager,harvestDate:traceForm.harvestDate,harvestQuantity:parseInt(traceForm.harvestQuantity)||0,harvestUnit:traceForm.harvestUnit,inspectionStatus:traceForm.inspectionStatus||'pending',inspectionHistory:[],batchStatus:status,packDate:traceForm.packDate,packSpec:traceForm.packSpec,packQty:parseInt(traceForm.packQty)||0,shelfLife:traceForm.shelfLife,scanCount:0,totalScan:0,qrCodeUrl:'',createdAt:new Date().toISOString().replace('T',' ').slice(0,16),updatedAt:new Date().toISOString().replace('T',' ').slice(0,16),timeline:[{time:new Date().toISOString().replace('T',' ').slice(0,16),action:'批次创建',operator:'管理员'}]}
  if(traceEditId.value){const i=traces.findIndex(x=>x.id===traceEditId.value);if(i>=0){const old=traces[i];traces[i]={...obj,id:old.id,batchNo:old.batchNo,createdAt:old.createdAt,createdBy:old.createdBy,scanCount:old.scanCount,totalScan:old.totalScan,updatedAt:new Date().toISOString().replace('T',' ').slice(0,16)};toast('已更新','ok')}}
  else{traces.unshift({id:uid(),createdBy:'管理员',...obj});toast('已新增','ok')}
  addTraceOpen.value=false
}
function openQRModal(t){if(!t.qrCodeUrl)t.qrCodeUrl='/trace/'+t.batchNo;traceDetail.value=t;qrModalOpen.value=true}
function openRecallModal(t){Object.assign(recallForm,{batchId:t.id,reason:'',scope:'全部批次',quantity:t.harvestQuantity||'',soldQty:t.packQty||'',notifyMethod:'系统通知',manager:t.manager||'',note:''});recallModalOpen.value=true}
function doRecall(){
  if(!recallForm.reason){toast('请填写召回原因','warn');return}
  const t=traces.find(x=>x.id===recallForm.batchId);if(!t)return
  t.batchStatus='recalled';t.updatedAt=new Date().toISOString().replace('T',' ').slice(0,16)
  t.timeline.push({time:t.updatedAt,action:'批次召回',operator:'管理员',reason:recallForm.reason})
  recallModalOpen.value=false;toast('批次已召回','warn')
}
function doSuspendTrace(t){t.batchStatus='suspended';t.updatedAt=new Date().toISOString().replace('T',' ').slice(0,16);t.timeline.push({time:t.updatedAt,action:'暂停展示',operator:'管理员'});toast('已暂停','ok')}
function doResumeTrace(t){t.batchStatus='normal';t.updatedAt=new Date().toISOString().replace('T',' ').slice(0,16);t.timeline.push({time:t.updatedAt,action:'解除暂停',operator:'管理员'});toast('已恢复','ok')}

const traceFlowSteps=computed(()=>{
  const hasAbnormal=traces.some(t=>t.batchStatus==='recalled'||t.batchStatus==='recalling'||t.inspectionStatus==='unqualified')
  if(hasAbnormal){
    return [
      {label:'建立批次',done:true,filter:null},
      {label:'完善档案',done:true,filter:null},
      {label:'检测不合格',warn:true,filter:()=>{resetTraceFilters();tfFilter.inspectionStatus='unqualified'}},
      {label:'暂停/召回',warn:true,filter:null}
    ]
  }
  return [
    {label:'建立批次',done:true,filter:null},
    {label:'完善档案',done:true,filter:null},
    {label:'录入检测',active:!traces.every(t=>t.inspectionStatus==='qualified'),filter:()=>{resetTraceFilters();tfFilter.inspectionStatus='pending'}},
    {label:'生成溯源码',active:true,filter:null}
  ]
})

function addInspection(t){
  const org=prompt('检测机构：','安康市农产品质量检测中心');if(!org)return
  const result=confirm('检测结果合格？(确定=合格, 取消=不合格)')?'合格':'不合格'
  t.inspectionHistory.push({type:'质量检测',org,date:new Date().toISOString().slice(0,10),result,reportNo:'JC'+Date.now().toString(36).toUpperCase().slice(-8)})
  t.inspectionStatus=result==='合格'?'qualified':'unqualified'
  if(result==='不合格')t.batchStatus='suspended'
  else if(t.batchStatus==='incomplete')t.batchStatus='normal'
  t.updatedAt=new Date().toISOString().replace('T',' ').slice(0,16)
  t.timeline.push({time:t.updatedAt,action:'检测录入',operator:'管理员',result})
  toast('检测已录入','ok')
}
function exportTraces(){
  const data=filteredTraces.value.length?filteredTraces.value:traces
  const csv='批次号,产品,所属村,基地,地块,生产主体,采收日期,采收数量,检测结果,批次状态,扫码次数,创建时间\n'+data.map(t=>[t.batchNo,t.productName,t.villageName,t.baseName,t.plotName,t.producerName,t.harvestDate,t.harvestQuantity+t.harvestUnit,inspStatusLabel(t.inspectionStatus),batchStatusLabel(t.batchStatus),t.totalScan,t.createdAt].join(',')).join('\n')
  downloadCSV('﻿'+csv,'溯源数据_'+new Date().toISOString().slice(0,10)+'.csv')
}

// ===== API预留 =====
// GET    /api/ecommerce/lives               直播列表
// GET    /api/ecommerce/lives/:id           直播详情
// POST   /api/ecommerce/lives               创建直播
// PUT    /api/ecommerce/lives/:id           编辑直播
// PATCH  /api/ecommerce/lives/:id/start     开播
// PATCH  /api/ecommerce/lives/:id/end       结束直播
// POST   /api/ecommerce/lives/:id/products  关联商品
// POST   /api/ecommerce/lives/:id/replay    上传回放
// GET    /api/ecommerce/lives/export        导出

const lives=reactive([
  {id:1,title:'中堰蜂糖李专场',host:'赵大哥',phone:'139****6789',manager:'刘管理员',time:'2026-07-20 19:00',duration:'预计2小时',views:3200,orders:38,sales:12800,status:'pending',platform:'微信视频号',products:['蜂糖李'],villageName:'中堰村',cover:'',desc:'介绍蜂糖李种植过程，现场采摘展示，限时优惠',replayUrl:'',cancelReason:'',createdAt:'2026-07-18 09:00',peakViews:860,refunds:0,timeline:[{time:'2026-07-18 09:00',action:'创建直播',operator:'刘管理员'},{time:'2026-07-18 10:00',action:'关联商品：蜂糖李',operator:'刘管理员'}]},
  {id:2,title:'富硒黄桃采摘直播',host:'赵大哥',phone:'138****8901',manager:'刘管理员',time:'2026-07-18 10:00',duration:'预计1.5小时',views:5600,orders:85,sales:25600,status:'ended',platform:'抖音',products:['富硒黄桃'],villageName:'中堰村',replayUrl:'/replay/002',desc:'高山富硒黄桃，现场品尝，采摘体验',cancelReason:'',createdAt:'2026-07-16 14:00',replayAt:'2026-07-19 10:00',peakViews:1200,refunds:1,timeline:[{time:'2026-07-16 14:00',action:'创建直播',operator:'刘管理员'},{time:'2026-07-18 10:00',action:'开播',operator:'赵大哥'},{time:'2026-07-18 11:30',action:'结束直播',operator:'赵大哥'},{time:'2026-07-19 10:00',action:'上传回放',operator:'刘管理员'}]},
  {id:3,title:'澳洲龙虾烹饪秀',host:'李婶',phone:'137****2345',manager:'刘管理员',time:'2026-07-19 15:00',duration:'预计3小时',views:8900,orders:142,sales:35800,status:'living',platform:'快手',products:['澳洲淡水龙虾','农特产礼盒'],villageName:'中堰村',replayUrl:'',desc:'现场烹饪澳洲淡水龙虾，展示养殖环境',cancelReason:'',createdAt:'2026-07-17 08:00',peakViews:1800,refunds:0,timeline:[{time:'2026-07-17 08:00',action:'创建直播',operator:'刘管理员'},{time:'2026-07-19 15:00',action:'开播',operator:'李婶'}]}
])
const liveDrawerOpen=ref(false),liveDetail=ref(null)
function liveStatusLabel(s){const m={draft:'草稿',pending:'待开播',living:'直播中',ended:'已结束',cancelled:'已取消'};return m[s]||s}
function liveStatusCls(s){const m={draft:'dim',pending:'y',living:'g',ended:'dim',cancelled:'r'};return m[s]||'dim'}
function getLiveActions(l){
  const a=[]
  a.push({k:'detail',l:'直播详情'})
  if(l.status==='draft'){a.push({k:'edit',l:'编辑'});a.push({k:'cancel',l:'取消直播'})}
  if(l.status==='pending'){a.push({k:'edit',l:'编辑'});a.push({k:'cancel',l:'取消直播'})}
  if(l.status==='living'){a.push({k:'enter',l:'进入直播'});a.push({k:'end',l:'结束直播'})}
  if(l.status==='ended'){if(l.replayUrl){a.push({k:'replay',l:'查看回放'})}else{a.push({k:'uploadReplay',l:'上传回放'})}}
  return a
}
const liveFilter=reactive({keyword:'',status:''})
const filteredLives=computed(()=>{
  let l=lives
  if(liveFilter.keyword){const s=liveFilter.keyword.toLowerCase();l=l.filter(x=>x.title.toLowerCase().includes(s)||x.host.toLowerCase().includes(s))}
  if(liveFilter.status)l=l.filter(x=>x.status===liveFilter.status)
  return l
})
function showLiveDetail(l){liveDetail.value=l;liveDrawerOpen.value=true}
function getProdByName(name){return prods.find(p=>p.name===name)}

// Live form drawer
const liveFormOpen=ref(false),liveEditId=ref(null)
const liveForm=reactive({title:'',host:'赵大哥',time:'',duration:'2小时',products:[],desc:'',manager:'刘管理员',cover:''})
const hosts=['赵大哥','李婶','张大叔','刘阿姨','中堰村合作社','刘管理员']
const durationOptions=['30分钟','1小时','1.5小时','2小时','3小时','4小时']
const descMaxLen=300

function openLiveForm(id){
  liveEditId.value=id||null
  if(id){
    const l=lives.find(x=>x.id===id)
    if(l)Object.assign(liveForm,{title:l.title,host:l.host,time:l.time.replace('T',' '),duration:l.duration,products:[...l.products],desc:l.desc||'',manager:l.manager||'',cover:l.cover||''})
  }else{
    const now=new Date();const t=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')+' '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0')
    Object.assign(liveForm,{title:'',host:'赵大哥',time:t,duration:'2小时',products:[],desc:'',manager:'刘管理员',cover:''})
  }
  liveFormOpen.value=true
}
function saveLive(saveStatus){
  if(!liveForm.title.trim()){toast('请输入直播名称','warn');return}
  if(!liveForm.host){toast('请选择主播','warn');return}
  if(!liveForm.products.length){toast('请选择至少1件关联商品','warn');return}
  const status=saveStatus||'pending'
  const obj={title:liveForm.title,host:liveForm.host,time:liveForm.time,duration:liveForm.duration,products:[...liveForm.products],desc:(liveForm.desc||'').slice(0,descMaxLen),manager:liveForm.manager,cover:liveForm.cover}
  if(liveEditId.value){
    const l=lives.find(x=>x.id===liveEditId.value);if(l){Object.assign(l,obj);toast('已更新','ok')}
  }else{
    lives.unshift({id:uid(),views:0,orders:0,sales:0,status,phone:'',villageName:'中堰村',platform:'',replayUrl:'',cancelReason:'',createdAt:new Date().toISOString().replace('T',' ').slice(0,16),...obj})
    toast('已创建','ok')
  }
  liveFormOpen.value=false
}
function toggleLiveProduct(name){
  const i=liveForm.products.indexOf(name)
  if(i>=0)liveForm.products.splice(i,1);else liveForm.products.push(name)
}
function cancelLive(id){const l=lives.find(x=>x.id===id);if(!l)return;const reasons=['天气原因','设备故障','主播请假','商品问题','其他'];const r=prompt('取消原因：\n1.天气原因 2.设备故障 3.主播请假 4.商品问题 5.其他','');if(r===null)return;const idx=parseInt(r);l.cancelReason=idx?reasons[idx-1]:r||'未填写';l.status='cancelled';toast('已取消：'+l.cancelReason,'warn')}
function endLive(id){const l=lives.find(x=>x.id===id);if(!l)return;if(!confirm('确定结束直播？'))return;l.status='ended';toast('已结束','ok')}
function exportLives(){const csv='主题,主播,时间,时长,观看,成交,状态,关联商品\n'+lives.map(l=>[l.title,l.host,l.time,l.duration,l.views,l.sales,l.status,(l.products||[]).join(';')].join(',')).join('\n');downloadCSV('﻿'+csv,'直播数据_'+new Date().toISOString().slice(0,10)+'.csv')}

const topProds=computed(()=>[...prods].sort((a,b)=>b.sales-a.sales).slice(0,5))
const areaDist=[{n:'安康市',c:58},{n:'西安市',c:42},{n:'武汉市',c:28},{n:'重庆市',c:22},{n:'成都市',c:16}]

// ===== 经营分析 =====
const analyticsPeriod=ref('all')
const analyticsPeriods=[{k:'7d',label:'近7天'},{k:'30d',label:'近30天'},{k:'all',label:'全部'}]
const analyticsTotalSales=computed(()=>allOrders.filter(o=>o.paymentStatus==='paid').reduce((s,o)=>s+(o.paidAmount||0),0))
const analyticsTotalOrders=computed(()=>allOrders.filter(o=>o.paymentStatus==='paid').length)
const analyticsTopProds=computed(()=>[...prods].filter(p=>p.sales>0).sort((a,b)=>b.sales-a.sales))
const analyticsChannelOnline=computed(()=>allOrders.filter(o=>o.paymentStatus==='paid'&&o.source!=='直播').reduce((s,o)=>s+(o.paidAmount||0),0))
function initAnalyticsChart(){
  const el=document.getElementById('chart_analytics_sales');if(!el)return
  const c=echarts.init(el)
  const days=[];const vals=[];for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push((d.getMonth()+1)+'/'+d.getDate());vals.push(Math.floor(Math.random()*3000+1000))}
  c.setOption({tooltip:{trigger:'axis',backgroundColor:'rgba(4,18,40,0.95)',borderColor:'rgba(57,217,138,0.30)',textStyle:{color:'#c8daea',fontSize:10}},grid:{left:8,right:16,top:8,bottom:20},xAxis:{type:'category',data:days,axisLabel:{color:'#5e7a9a',fontSize:9}},yAxis:{type:'value',axisLabel:{color:'#5e7a9a',fontSize:9},splitLine:{lineStyle:{color:'rgba(14,165,233,0.06)'}}},series:[{type:'line',data:vals,smooth:true,lineStyle:{color:'#28C76F',width:2},itemStyle:{color:'#28C76F'},symbol:'none',areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(40,199,111,.25)'},{offset:1,color:'rgba(40,199,111,.02)'}])}}]})
  if(window._analyticsCharts)window._analyticsCharts.forEach(x=>{try{x.dispose()}catch(e){}});window._analyticsCharts=[c]
}

function downloadCSV(csv,fn){if(window.showSaveFilePicker){const b=new Blob([csv],{type:'text/csv'});window.showSaveFilePicker({suggestedName:fn,types:[{description:'CSV',accept:{'text/csv':['.csv']}}]}).then(h=>h.createWritable().then(w=>w.write(csv).then(()=>w.close()))).catch(e=>{if(e.name!=='AbortError'){const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=fn;a.click();URL.revokeObjectURL(a.href);toast('已导出','ok')}})}else{const b=new Blob([csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=fn;a.click();URL.revokeObjectURL(a.href);toast('已导出','ok')}}

const modal=ref(false),modalTitle=ref(''),modalType=ref('')

let chartInsts=[]
function initCharts(){
  chartInsts.forEach(c=>{try{c.dispose()}catch(e){}});chartInsts=[]
  initAnalyticsChart()
}
</script>

<style scoped>
.ec{min-height:100vh;background:#06192b;color:#fff;font-size:12px}.eh{display:flex;align-items:center;gap:10px;padding:0 16px;height:48px;background:linear-gradient(180deg,rgba(10,50,100,.15),rgba(6,20,44,.05));border-bottom:1px solid rgba(0,0,0,.06)}.eh a{color:#6F91A8;text-decoration:none;font-size:13px}.clock{font-size:11px;color:#6F91A8;font-family:monospace}
.et{flex-shrink:0;display:flex;padding:0 16px;background:rgba(10,36,68,.55)}.et button{padding:4px 14px;font-size:11px;font-weight:500;color:#6F91A8;background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;transition:.2s}.et button:hover{color:#B7D3E8}.et button.on{color:#28C76F;border-bottom-color:#39D98A}
.eb{padding:14px 18px}
.pg-tt{font-size:17px;font-weight:700;color:#fff;margin-bottom:12px;margin-top:4px;padding:0}
.sr{display:flex;gap:10px;margin-bottom:10px;flex-wrap:wrap}.sc{flex:1;min-width:130px;height:104px;background:rgba(5,25,48,.96);border:1px solid rgba(190,214,234,.55);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;justify-content:center}.sc-title{font-size:11px;font-weight:700;color:#fff;margin-bottom:4px}.sc .sv{font-size:22px;font-weight:700;color:#28C76F;font-family:monospace}.sc .sl{font-size:10px;color:#6F91A8;margin-top:2px}.sc.g .sv{color:#28C76F}.sc.y .sv{color:#F5B83D}.sc.r .sv{color:#E74C3C}
.pn{background:rgba(5,25,48,.96);border:1px solid rgba(190,214,234,.55);border-radius:10px;padding:12px 16px;margin-bottom:8px}.tt{font-size:12px;font-weight:700;color:#fff;margin-bottom:10px;display:flex;align-items:center;gap:6px}.tt::before{content:'';width:3px;height:11px;border-radius:2px;background:#28C76F}
.fb{display:flex;gap:6px;margin-bottom:8px;align-items:center;flex-wrap:wrap}.fi{background:rgba(57,217,138,.06);border:1px solid rgba(40,199,111,.1);color:#B7D3E8;border-radius:6px;padding:5px 8px;font-size:11px;font-family:inherit}.fi:focus{border-color:#28C76F;outline:none}
.tb{width:100%;border-collapse:collapse}.tb th,.tb td{padding:8px 10px;text-align:left;font-size:10px}.tb th{background:rgba(10,36,68,.55);color:#6F91A8;border-bottom:2px solid rgba(40,199,111,.1);font-size:9px}.tb td{border-bottom:1px solid rgba(14,165,233,.06)}.tb tr:hover td{background:rgba(14,165,233,.04)}
.t{display:inline-block;padding:2px 6px;border-radius:9px;font-size:9px;font-weight:600}.t.g{background:rgba(16,214,160,.15);color:#28C76F}.t.y{background:rgba(245,158,11,.15);color:#F5B83D}.t.r{background:rgba(231,76,60,.15);color:#E74C3C}.t.b{background:rgba(40,199,111,.12);color:#28C76F}.t.dim{background:rgba(140,160,180,.2);color:#8FA8C0}
.pn2{font-weight:600;color:#fff}.pd{font-size:9px;color:#6F91A8;margin-top:1px}
.bp{background:linear-gradient(135deg,#39D98A,#28C76F);color:#fff}.bo{background:transparent;border:1px solid rgba(14,165,233,.28);color:#28C76F}.bd{background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.25);color:#E74C3C}.bp,.bo,.bd{padding:5px 10px;border-radius:7px;font-size:10px;font-weight:600;cursor:pointer;font-family:inherit}.bps{padding:3px 6px;font-size:8px}
.mo{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:.25s}.mo.on{opacity:1;pointer-events:auto}.mb{background:rgba(6,22,46,.98);border:1px solid rgba(40,199,111,.15);border-radius:12px;padding:20px 24px;width:540px;max-width:90vw;max-height:85vh;overflow-y:auto}.mh{font-size:15px;font-weight:700;color:#fff;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center}.mc{width:26px;height:26px;border-radius:50%;background:rgba(10,60,130,.2);border:1px solid rgba(40,199,111,.1);color:#B7D3E8;cursor:pointer;font-size:13px}.fl{margin-bottom:10px}.fl label{display:block;font-size:10px;color:#6F91A8;margin-bottom:3px}.fin{width:100%;padding:8px;border-radius:8px;background:rgba(57,217,138,.06);border:1px solid rgba(40,199,111,.1);color:#B7D3E8;outline:none;font-family:inherit;font-size:12px;box-sizing:border-box}.fr3{display:flex;gap:8px}.fr3 .fl{flex:1}.ma{display:flex;gap:6px;margin-top:14px}
.dg2{background:rgba(10,36,68,.55);padding:10px;border-radius:8px;margin-bottom:8px}.dl2{display:block;font-size:9px;color:#28C76F;margin-bottom:3px}.dg2 div:last-child{font-size:12px;color:#B7D3E8}
.ri{display:flex;align-items:center;padding:6px 0;border-bottom:1px solid rgba(14,165,233,.06);font-size:11px}.rn{width:20px;text-align:center;font-weight:700;color:#28C76F;font-family:monospace}.rc{margin-left:auto;color:#6F91A8;font-family:monospace}
.c-red{color:#E74C3C!important}.c-yel{color:#F5B83D!important}
.si{font-size:18px;margin-bottom:4px}.st{font-size:10px;margin-left:6px}.st.up{color:#28C76F}
.stock-bar{height:4px;background:rgba(40,199,111,.08);border-radius:2px;overflow:hidden;width:72px;flex-shrink:0}.stock-fill{height:100%;border-radius:2px;transition:width .5s}.stock-fill.ok{background:#28C76F}.stock-fill.warn{background:#F5B83D}.stock-fill.low{background:#E74C3C}.stock-fill.out{background:rgba(100,120,140,.3)}
.pimg{width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}.pimg-lg{width:80px;height:80px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:40px;margin:0 auto 14px}
.rowWarn td{background:rgba(245,158,11,.04)}.rowOut td{background:rgba(231,76,60,.04)}
.fl2{display:flex;align-items:center;gap:3px;font-size:10px;color:#6F91A8;cursor:pointer}
.dd-wrap{display:inline-block;position:relative}.dd-menu{position:absolute;right:0;top:100%;z-index:50;background:rgba(6,22,46,.98);border:1px solid rgba(40,199,111,.15);border-radius:8px;padding:4px 0;min-width:100px;box-shadow:0 4px 16px rgba(0,0,0,.4)}.dd-menu div{padding:6px 12px;font-size:10px;color:#B7D3E8;cursor:pointer;white-space:nowrap}.dd-menu div:hover{background:rgba(14,165,233,.1)}
.dov2{position:fixed;inset:0;z-index:180;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:.3s}.dov2.on{opacity:1;pointer-events:auto}.dw2{position:fixed;top:0;right:0;bottom:0;width:400px;z-index:190;background:rgba(6,20,44,.98);border-left:1px solid rgba(40,199,111,.1);transform:translateX(100%);transition:.3s;display:flex;flex-direction:column}.dw2.on{transform:translateX(0)}.dwh2{padding:14px 16px;border-bottom:1px solid rgba(40,199,111,.1);display:flex;justify-content:space-between;align-items:center}.dwh2 h3{font-size:14px;color:#fff}.dwb2{flex:1;overflow-y:auto;padding:14px}
.dg3{background:rgba(10,36,68,.55);padding:10px;border-radius:8px;margin-bottom:8px}.dl3{display:block;font-size:9px;color:#28C76F;margin-bottom:3px}.dg3 div:last-child{font-size:12px;color:#B7D3E8}
.pg2{display:flex;justify-content:flex-end;margin-top:8px}
.fs-title{font-size:11px;font-weight:700;color:#28C76F;margin:12px 0 8px;padding-bottom:4px;border-bottom:1px solid rgba(40,199,111,.1)}
.ds-title{font-size:11px;font-weight:700;color:#28C76F;margin:14px 0 8px;padding-bottom:4px;border-bottom:1px solid rgba(40,199,111,.1)}
.img-placeholder{width:100%;height:36px;border:1px dashed rgba(40,199,111,.25);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;color:#6F91A8;cursor:pointer;background:rgba(57,217,138,.03)}.img-placeholder:hover{border-color:#28C76F;color:#28C76F}
.bo:disabled{opacity:.45;cursor:not-allowed}.bd:disabled{opacity:.45;cursor:not-allowed}
.cert-tag{padding:3px 8px;border-radius:12px;font-size:9px;font-weight:500;cursor:pointer;background:transparent;border:1px solid rgba(111,145,168,.4);color:#6F91A8;font-family:inherit;transition:.15s}.cert-tag:hover{border-color:#28C76F;color:#B7D3E8}.cert-tag.on{background:#28C76F;border-color:#28C76F;color:#fff}
.prod-form-drawer{position:fixed;top:0;right:0;bottom:0;width:640px;max-width:90vw;z-index:190;background:rgba(6,20,44,.98);border-left:1px solid rgba(40,199,111,.1);transform:translateX(100%);transition:.3s;display:flex;flex-direction:column}.prod-form-drawer.on{transform:translateX(0)}
.prod-form-body{flex:1;overflow-y:auto;padding:0 20px 20px}.prod-form-footer{flex-shrink:0;padding:12px 20px;border-top:1px solid rgba(40,199,111,.1);display:flex;align-items:center;gap:10px;background:rgba(6,20,44,.98)}
.img-preview-row{display:flex;align-items:center}.img-preview{width:64px;height:64px;border-radius:8px;object-fit:cover;border:1px solid rgba(40,199,111,.15)}
.btn-text{padding:3px 6px;font-size:8px;font-weight:500;cursor:pointer;background:none;border:none;color:#28C76F;font-family:inherit}.btn-text:hover{color:#39D98A}
.act-btn{padding:3px 7px;font-size:9px;font-weight:500;cursor:pointer;border-radius:5px;font-family:inherit;white-space:nowrap;line-height:1.5}.act-view{background:transparent;border:1px solid rgba(40,199,111,.35);color:#28C76F}.act-view:hover{border-color:#28C76F}.act-edit{background:none;border:none;color:#6F91A8}.act-edit:hover{color:#28C76F}.act-more{background:none;border:none;color:#6F91A8;font-weight:700;letter-spacing:1px}.act-more:hover{color:#B7D3E8}
.order-prod-img{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.alert-bar{display:flex;align-items:center;padding:8px 14px;margin-bottom:10px;background:rgba(231,76,60,.06);border-left:3px solid #E74C3C;border-radius:0 8px 8px 0;font-size:11px;color:#B7D3E8;gap:4px;flex-wrap:wrap}
.trace-flow{display:flex;align-items:center;gap:0;padding:10px 16px;margin-bottom:10px;background:rgba(5,25,48,.96);border:1px solid rgba(190,214,234,.55);border-radius:10px;overflow-x:auto}
.trace-flow-step{display:flex;align-items:center;gap:6px;flex-shrink:0;font-size:10px;color:#6F91A8;padding:4px 10px;position:relative}.trace-flow-step::after{content:'→';margin-left:8px;color:rgba(111,145,168,.3)}.trace-flow-step:last-child::after{display:none}
.flow-dot{width:7px;height:7px;border-radius:50%;background:rgba(111,145,168,.3);flex-shrink:0}.trace-flow-step.active .flow-dot{background:#28C76F;box-shadow:0 0 6px rgba(40,199,111,.4)}.trace-flow-step.active .flow-label{color:#fff;font-weight:600}.trace-flow-step.done .flow-dot{background:#28C76F}.trace-flow-step.done .flow-label{color:#B7D3E8}.trace-flow-step.warn .flow-dot{background:#E74C3C;box-shadow:0 0 6px rgba(231,76,60,.4)}.trace-flow-step.warn .flow-label{color:#E74C3C;font-weight:600}
.completeness-bar{height:4px;background:rgba(40,199,111,.08);border-radius:2px;overflow:hidden;width:48px}.completeness-fill{height:100%;border-radius:2px;transition:width .5s}
.trace-row-abnormal{border-left:3px solid #E74C3C!important}.trace-row-abnormal:hover td{background:rgba(231,76,60,.06)!important}
.live-prod-chip{padding:6px 12px;border-radius:8px;font-size:11px;cursor:pointer;background:rgba(10,36,68,.55);border:1px solid rgba(111,145,168,.3);color:#B7D3E8;transition:.15s;user-select:none}.live-prod-chip:hover{border-color:#28C76F}.live-prod-chip.on{background:rgba(40,199,111,.15);border-color:#28C76F;color:#fff}
.order-row:hover td{background:rgba(14,165,233,.06)!important}
:deep(.el-date-editor--daterange.el-input__inner){background:rgba(57,217,138,.06);border:1px solid rgba(40,199,111,.1);border-radius:6px;height:auto;width:240px}:deep(.el-date-editor .el-range-input){background:transparent;color:#B7D3E8;font-size:11px;width:80px}:deep(.el-date-editor .el-range-separator){color:#8FA8C0;font-size:11px;line-height:22px}:deep(.el-date-editor .el-range__close-icon){display:none}:deep(.el-picker-panel){background:rgba(10,28,50,.98);border:1px solid rgba(40,199,111,.15);color:#B7D3E8;box-shadow:0 4px 20px rgba(0,0,0,.5)}:deep(.el-date-range-picker__header){color:#B7D3E8}:deep(.el-date-table th){color:#6F91A8;border:0}:deep(.el-date-table td){border:0}:deep(.el-date-table td.available:hover){color:#28C76F}:deep(.el-date-table td.in-range div){background:rgba(40,199,111,.15)}:deep(.el-date-table td.end-date div),:deep(.el-date-table td.start-date div){background:#28C76F;color:#fff}:deep(.el-date-table td.current:not(.disabled) div){color:#28C76F}:deep(.el-picker-panel__icon-btn:hover){color:#28C76F}:deep(.el-date-range-picker__header div){color:#B7D3E8;font-size:13px}:deep(.el-date-range-picker__content){padding:8px}:deep(.el-month-table td.current div){color:#28C76F}:deep(.el-year-table td.current div){color:#28C76F}
.toast-area{position:fixed;top:16px;right:16px;z-index:999;display:flex;flex-direction:column;gap:6px;pointer-events:none}.to{padding:8px 14px;border-radius:6px;font-size:11px;font-weight:600;color:#fff;animation:ti .3s,to2 .3s 2s forwards}.to.ok{background:linear-gradient(135deg,#059669,#39D98A)}.to.info{background:linear-gradient(135deg,#39D98A,#28C76F)}.to.warn{background:linear-gradient(135deg,#d97706,#f59e0b)}@keyframes ti{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes to2{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}
</style>
