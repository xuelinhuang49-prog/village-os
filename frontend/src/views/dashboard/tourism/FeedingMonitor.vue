<template>
<div style="padding:14px 18px">
<div class="tbanner" style="border-left-color:#22B573;color:#22B573">🍽 投喂管理 · 今日投喂状态<span style="font-size:12px;color:#66788A;font-weight:400;margin-left:8px">📍 中堰村</span></div>

<!-- ===== 一、顶部统计（仅一套） ===== -->
<div class="srow" style="margin-bottom:12px">
  <div class="scard"><div class="sv">{{areas.length}}</div><div class="sl">今日任务</div></div>
  <div class="scard g"><div class="sv">{{areas.filter(a=>a.status==='已完成').length}}</div><div class="sl">已完成</div></div>
  <div class="scard y"><div class="sv">{{areas.filter(a=>a.status==='待投喂').length}}</div><div class="sl">待投喂</div></div>
  <div class="scard b"><div class="sv">{{areas.filter(a=>a.status==='自动投喂中').length}}</div><div class="sl">进行中</div></div>
  <div v-if="areas.filter(a=>a.status==='已超时').length>0" class="scard r"><div class="sv">{{areas.filter(a=>a.status==='已超时').length}}</div><div class="sl">超时未投</div></div>
</div>

<!-- ===== 二、操作栏 ===== -->
<div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center">
  <button class="btn btn-p btn-s" @click="openAdd">+ 记录投喂</button>
  <span style="flex:1"></span>
  <select v-model="filterStatus" class="fs"><option value="">全部状态</option><option value="已完成">已完成</option><option value="待投喂">待投喂</option><option value="自动投喂中">自动投喂中</option><option value="已超时">已超时</option></select>
  <button class="btn btn-o btn-s" @click="doExport">📤 导出</button>
</div>

<!-- ===== 三、今日饲料消耗汇总 ===== -->
<div class="panel" style="padding:14px;margin-bottom:12px">
  <div class="panel-hd-inline"><span class="hd-bar g"></span>📊 今日实际饲料消耗</div>
  <div style="display:flex;gap:12px;flex-wrap:wrap">
    <div v-for="f in feedSummary" :key="f.name" class="feed-sum-item">
      <div class="feed-sum-name">{{f.name}}</div>
      <div class="feed-sum-val">{{f.total}}kg</div>
      <div class="feed-sum-bar"><div class="feed-sum-fill" :style="{width:(f.total/maxFeed*100)+'%'}"></div></div>
    </div>
    <div class="feed-sum-item" style="border-left:2px solid #22B573;padding-left:14px">
      <div class="feed-sum-name" style="color:#22B573">总计</div>
      <div class="feed-sum-val" style="color:#22B573">{{totalFeed}}kg</div>
    </div>
  </div>
</div>

<!-- ===== 四、任务卡片 ===== -->
<div style="font-size:15px;font-weight:700;color:#1F2D3D;margin-bottom:8px;display:flex;align-items:center;gap:8px">
  <span class="hd-bar g" style="display:inline-block;width:3px;height:12px;border-radius:2px;background:#22B573"></span>今日投喂任务
</div>

<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:12px">
<div v-for="a in filteredAreas" :key="a.key" class="panel dw-panel" style="padding:16px;margin:0;cursor:pointer" @click="showDetail(a)">

  <!-- 头部：区域 + 状态徽章 -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
    <div>
      <div style="font-size:17px;font-weight:700;color:#1F2D3D;margin-bottom:3px">{{a.area}}</div>
      <div style="font-size:12px;color:#66788A">{{a.batchName}}</div>
    </div>
    <span :class="'dw-status '+statusCls(a.status)">{{statusIcon(a.status)}} {{a.status}}</span>
  </div>

  <div class="dw-divider"></div>

  <!-- 信息区：根据状态展示不同内容 -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:13px;margin-bottom:8px">
    <div><span style="color:#66788A">🕐 投喂时间</span><span style="color:#1F2D3D;margin-left:4px;font-weight:500">{{a.feedTime||a.planTime||'--'}}</span></div>
    <div><span style="color:#66788A">👤 负责人</span><span style="color:#1F2D3D;margin-left:4px">{{a.manager||'--'}}</span></div>
    <div><span style="color:#66788A">🍽 饲料</span><span style="color:#1F2D3D;margin-left:4px">{{a.feedName||'--'}}</span></div>
    <div><span style="color:#66788A">⚖ 计划量</span><span style="color:#1F2D3D;margin-left:4px;font-weight:500">{{a.amount||'--'}} kg</span></div>
  </div>

  <!-- 待投喂：倒计时 -->
  <div v-if="a.status==='待投喂'" style="padding:8px 10px;background:rgba(242,166,43,.10);border-radius:6px;margin-bottom:8px">
    <div style="display:flex;align-items:center;gap:8px">
      <span style="font-size:12px;color:#F2A62B">⏳ 距离开始</span>
      <span style="font-size:16px;font-weight:700;color:#F2A62B;font-family:monospace">{{countdowns[a.key]||'--'}}</span>
    </div>
  </div>

  <!-- 自动投喂中：设备状态 -->
  <div v-if="a.status==='自动投喂中'" style="padding:8px 10px;background:#EBEFF4;border-radius:6px;margin-bottom:8px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:12px">
      <div><span style="color:#66788A">📡 设备</span><span style="color:#22B573;margin-left:4px;font-weight:600">在线</span></div>
      <div><span style="color:#66788A">📶 通信</span><span style="color:#22B573;margin-left:4px">正常</span></div>
      <div><span style="color:#66788A">🔋 剩余饲料</span><span style="color:#1F2D3D;margin-left:4px;font-weight:500">{{a.remainFeed||'65%'}}</span></div>
      <div v-if="a.progress!==undefined"><span style="color:#66788A">⏳ 投喂进度</span><span style="color:#0EA5E9;margin-left:4px;font-weight:600">{{a.progress}}% ({{a.actualAmount}}/{{a.amount}}kg)</span></div>
    </div>
  </div>

  <!-- 已完成：完成信息 -->
  <div v-if="a.status==='已完成'" style="padding:8px 10px;background:rgba(34,181,115,.08);border-radius:6px;margin-bottom:8px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:12px">
      <div><span style="color:#66788A">✅ 完成时间</span><span style="color:#22B573;margin-left:4px;font-weight:500">{{a.feedTime||'--'}}</span></div>
      <div><span style="color:#66788A">⚖ 实际投喂</span><span style="color:#1F2D3D;margin-left:4px">{{a.actualAmount||a.amount||'--'}} kg</span></div>
      <div v-if="a.deviation!==undefined"><span style="color:#66788A">📏 误差</span><span style="margin-left:4px" :style="{color:a.deviation===0?'#22B573':'#F2A62B'}">{{a.deviation===0?'0kg (精准)':a.deviation+'kg'}}</span></div>
    </div>
  </div>

  <!-- 已超时：告警信息 -->
  <div v-if="a.status==='已超时'" style="padding:8px 10px;background:rgba(224,82,82,.10);border-radius:6px;margin-bottom:8px">
    <span style="font-size:12px;color:#E05252">⚠ 已超出计划投喂时间，请立即处理</span>
  </div>

  <div class="dw-divider"></div>

  <!-- 底部操作按钮（按状态区分） -->
  <div style="display:flex;gap:6px;justify-content:flex-end;margin-top:4px">
    <button v-if="a.status==='待投喂'" class="btn btn-p btn-s" @click.stop="quickFeed(a)">⚡ 立即投喂</button>
    <button v-if="a.status==='自动投喂中'" class="btn btn-b btn-s" @click.stop="toast('设备运行正常，编号：TF-001','info')">📡 查看设备</button>
    <button v-if="a.status==='已超时'" class="btn btn-d btn-s" @click.stop="quickFeed(a)">⚠ 紧急处理</button>
    <button class="btn btn-o btn-s" @click.stop="showDetail(a)">📋 查看记录</button>
  </div>
</div>
</div>

<!-- ===== 五、历史投喂记录表 ===== -->
<div class="panel" style="padding:14px;margin-top:14px">
  <div class="panel-hd-inline"><span class="hd-bar"></span>📋 投喂记录<span style="font-size:12px;color:#66788A;font-weight:400;margin-left:8px">共 {{records.length}} 条</span></div>
  <div style="overflow-x:auto">
    <table class="dw-table">
      <thead><tr><th>区域</th><th>批次</th><th>投喂时间</th><th>饲料</th><th>计划量</th><th>实际量</th><th>方式</th><th>负责人</th><th>状态</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="r in records" :key="r.id" @click="showDetail(areas.find(a=>a.archiveId===r.archiveId)||r)">
          <td style="color:#1F2D3D;font-weight:500">{{r.area}}</td>
          <td style="font-size:12px;color:#66788A">{{r.batchName}}</td>
          <td style="font-family:monospace;font-size:12px">{{r.feedTime||r.planTime||'--'}}</td>
          <td>{{r.feedName||'--'}}</td>
          <td>{{r.amount||'--'}} kg</td>
          <td :style="{color:r.actualAmount&&r.actualAmount<r.amount?'#F2A62B':'#1F2D3D'}">{{r.actualAmount||'--'}} kg</td>
          <td>{{r.method||'--'}}</td>
          <td>{{r.manager||'--'}}</td>
          <td><span :class="'dw-status2 '+statusCls(r.status)">{{statusIcon(r.status)}} {{r.status}}</span></td>
          <td>
            <button class="btn btn-o btn-s" @click.stop="showDetail(areas.find(a=>a.archiveId===r.archiveId)||r)">查看</button>
            <button v-if="r.status==='待投喂'" class="btn btn-p btn-s" @click.stop="quickFeed(r)">投喂</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<!-- ================================================================ -->
<!--                         详情抽屉                                   -->
<!-- ================================================================ -->
<div class="drawer-overlay" :class="{on:detailOpen}" @click="detailOpen=false"></div>
<div class="drawer" :class="{on:detailOpen}">
  <div class="drawer-hd"><h3>🍽 {{detailData?.area}}</h3><button class="drawer-close" @click="detailOpen=false">✕</button></div>
  <div class="drawer-bd" v-if="detailData">

    <!-- 状态徽章 -->
    <div style="text-align:center;padding:8px 0 14px">
      <span :class="'tag '+(detailData.status==='已完成'?'g':detailData.status==='待投喂'?'y':detailData.status==='自动投喂中'?'b':'r')" style="font-size:14px;padding:5px 16px">{{statusIcon(detailData.status)}} {{detailData.status}}</span>
    </div>

    <!-- 投喂信息 -->
    <div class="ds-title">🍽 投喂信息</div>
    <div class="dg3"><span class="dl3">投喂时间</span><div style="font-family:monospace">{{detailData.feedTime||detailData.planTime||'--'}}</div></div>
    <div class="dg3"><span class="dl3">饲料</span><div>{{detailData.feedName||'--'}}</div></div>
    <div class="dg3"><span class="dl3">计划投喂量</span><div style="font-weight:600">{{detailData.amount||'--'}} kg</div></div>
    <div v-if="detailData.actualAmount" class="dg3"><span class="dl3">实际投喂量</span><div style="font-weight:600" :style="{color:detailData.actualAmount<detailData.amount?'#F2A62B':'#22B573'}">{{detailData.actualAmount}} kg<span v-if="detailData.actualAmount<detailData.amount" style="font-size:11px;color:#F2A62B;margin-left:4px">投喂不足</span><span v-else style="font-size:11px;color:#22B573;margin-left:4px">完成率100%</span></div></div>
    <div class="dg3"><span class="dl3">投喂方式</span><div>{{detailData.method||'--'}}</div></div>
    <div class="dg3"><span class="dl3">负责人</span><div>{{detailData.manager||'--'}}</div></div>

    <!-- 环境信息 -->
    <div v-if="detailData.envNote" class="dg3"><span class="dl3">🌡 投喂前环境</span><div style="color:#22B573;font-size:12px">{{detailData.envNote}}</div></div>

    <!-- 养殖信息 -->
    <div class="ds-title">🐟 关联养殖档案</div>
    <div class="dg3"><span class="dl3">批次名称</span><div>{{detailData.batchName}}</div></div>
    <div class="dg3"><span class="dl3">档案编号</span><div style="color:#22B573">{{detailData.batchNo}}</div></div>
    <div class="dg3"><span class="dl3">养殖区域</span><div>{{detailData.area}}</div></div>

    <!-- 执行记录时间轴 -->
    <div v-if="detailData.execRecords?.length" class="ds-title">📝 执行记录</div>
    <div v-if="detailData.execRecords?.length" class="timeline">
      <div v-for="(t,i) in detailData.execRecords" :key="i" class="tl-node" :class="{last:i===detailData.execRecords.length-1}">
        <div class="tl-dot" :class="{active:true}"></div>
        <div class="tl-body">
          <div class="tl-time">{{t.time}}</div>
          <div class="tl-action">{{t.action}}</div>
          <div v-if="t.detail" class="tl-detail">{{t.detail}}</div>
        </div>
      </div>
    </div>

    <!-- 备注 -->
    <div v-if="detailData.remark" class="dg3"><span class="dl3">📝 备注</span><div>{{detailData.remark}}</div></div>

    <!-- 底部操作 -->
    <div style="display:flex;gap:8px;margin-top:14px">
      <button v-if="detailData.status==='待投喂'" class="btn btn-p" style="flex:1" @click="quickFeed(detailData);detailOpen=false">⚡ 立即投喂</button>
      <button v-if="detailData.status==='自动投喂中'" class="btn btn-b" style="flex:1" @click="toast('设备运行正常，编号：TF-001','info')">📡 查看设备</button>
      <button class="btn btn-o" style="flex:1" @click="toast('查看批次：'+detailData.batchName,'info')">📋 批次投喂历史</button>
      <button class="btn btn-o" style="flex:1" @click="detailOpen=false">关闭</button>
    </div>
  </div>
</div>

<!-- ================================================================ -->
<!--                      记录投喂抽屉                                  -->
<!-- ================================================================ -->
<div class="drawer-overlay" :class="{on:addOpen}" @click="addOpen=false"></div>
<div class="drawer" :class="{on:addOpen}">
  <div class="drawer-hd"><h3>📝 记录投喂</h3><button class="drawer-close" @click="addOpen=false">✕</button></div>
  <div class="drawer-bd">
    <div class="ds-title">📋 选择养殖区域</div>
    <div class="fld"><label>养殖档案</label><select v-model="form.archiveId" class="fin" @change="onArchiveChange"><option value="">请选择</option><option v-for="l in breedingList" :key="l.id" :value="l.id">{{l.batchNo}} - {{l.area}}</option></select></div>
    <div class="frow2"><div class="fld"><label>批次名称</label><input :value="selectedArchive?.batchName||'--'" class="fin" disabled style="color:#66788A"></div><div class="fld"><label>养殖区域</label><input :value="selectedArchive?.area||'--'" class="fin" disabled style="color:#66788A"></div></div>

    <!-- 环境状态提示 -->
    <div v-if="form.archiveId" :class="envOk?'env-ok':'env-warn'" style="padding:8px 12px;border-radius:8px;font-size:12px;margin-bottom:10px">
      {{envOk?'🟢 当前环境适宜投喂':'🟡 当前溶氧偏低，建议延迟投喂'}}
    </div>

    <!-- AI智能推荐 -->
    <div v-if="form.archiveId && aiSuggestion" class="ai-suggest-box">
      <div class="ai-suggest-hd">🤖 AI智能推荐</div>
      <div style="font-size:12px;color:#66788A;margin-bottom:8px">依据：{{aiSuggestion.reason}}</div>
      <div style="display:flex;gap:16px;align-items:center">
        <div><div style="font-size:11px;color:#66788A">推荐投喂量</div><div style="font-size:20px;font-weight:700;color:#22B573">{{aiSuggestion.recommend}}kg</div></div>
        <div v-if="form.amount" style="border-left:1px solid #E3EAF0;padding-left:14px">
          <div style="font-size:11px;color:#66788A">当前填写</div>
          <div style="font-size:20px;font-weight:700" :style="{color:deviationPct<=5?'#22B573':'#F2A62B'}">{{form.amount}}kg</div>
          <div style="font-size:11px" :style="{color:deviationPct<=5?'#22B573':'#F2A62B'}">偏差 {{deviationPct}}%</div>
        </div>
      </div>
    </div>

    <div class="ds-title">🍽 投喂信息</div>
    <div class="frow2"><div class="fld"><label>饲料名称</label><input v-model="form.feedName" class="fin" placeholder="配合饲料1号"></div><div class="fld"><label>投喂量 (kg)</label><input v-model.number="form.amount" type="number" class="fin" placeholder="50" min="0" @input="updateDeviation"></div></div>
    <div class="frow2"><div class="fld"><label>投喂时间</label><input v-model="form.feedTime" class="fin" placeholder="07:00"></div><div class="fld"><label>投喂方式</label><select v-model="form.method" class="fin"><option>人工投喂</option><option>自动投喂</option></select></div></div>
    <div class="fld"><label>备注</label><textarea v-model="form.remark" class="fin" rows="2" placeholder="备注信息..." style="resize:vertical"></textarea></div>
    <div style="display:flex;gap:8px;margin-top:14px"><button class="btn btn-p" style="flex:1" @click="saveRecord">保存</button><button class="btn btn-o" style="flex:1" @click="addOpen=false">取消</button></div>
  </div>
</div>

<!-- Toast -->
<div style="position:fixed;top:16px;right:16px;z-index:999;display:flex;flex-direction:column;gap:6px;pointer-events:none">
  <div v-for="t in toasts" :key="t.id" :class="'toast '+t.type">{{t.msg}}</div>
</div>
</div>
</template>

<script setup>
import {ref,reactive,computed,onMounted,onUnmounted,watch} from 'vue'

// Toast
const toasts=reactive([])
function toast(m,t='info'){const id=Date.now();toasts.push({id,msg:m,type:t});setTimeout(()=>{const i=toasts.findIndex(x=>x.id===id);if(i>=0)toasts.splice(i,1)},2300)}

// 数据源
const breedingList=[{id:1,batchNo:'ZY-SC-202603-001',batchName:'2026年春加州鲈批次',area:'荷虾混养区A塘',category:'水产',type:'鲈鱼',breed:'加州鲈',manager:'赵大哥',phone:'139****6789'},{id:2,batchNo:'ZY-SC-202604-001',batchName:'2026年澳洲淡水龙虾批次',area:'智能水产养殖基地1号池',category:'水产',type:'澳洲淡水龙虾',breed:'澳洲品系',manager:'李婶',phone:'138****8901'},{id:3,batchNo:'ZY-SC-202605-001',batchName:'2026年罗非鱼育成批次',area:'智慧渔业车间2号池',category:'水产',type:'罗非鱼',breed:'吉富品系',manager:'张大叔',phone:'137****2345'}]

const records=reactive([
  {id:1,archiveId:1,batchNo:'ZY-SC-202603-001',batchName:'2026年春加州鲈批次',area:'荷虾混养区A塘',feedName:'配合饲料1号',amount:50,actualAmount:50,feedTime:'07:00',method:'自动投喂',manager:'赵大哥',status:'已完成',remark:'',deviation:0,execRecords:[{time:'06:55',action:'系统启动',detail:'自动投喂设备TF-001预热'},{time:'07:00',action:'开始投喂',detail:'目标50kg，投喂速率5kg/min'},{time:'07:03',action:'投喂完成',detail:'实际50kg，设备编号TF-001，无异常'}]},
  {id:2,archiveId:2,batchNo:'ZY-SC-202604-001',batchName:'2026年澳洲淡水龙虾批次',area:'智能水产养殖基地1号池',feedName:'虾饲料',amount:30,actualAmount:0,planTime:'18:00',method:'人工投喂',manager:'李婶',status:'待投喂',remark:'',countdownUpdate:null},
  {id:3,archiveId:3,batchNo:'ZY-SC-202605-001',batchName:'2026年罗非鱼育成批次',area:'智慧渔业车间2号池',feedName:'鱼饲料2号',amount:45,actualAmount:28,feedTime:'14:00',method:'自动投喂',manager:'张大叔',status:'自动投喂中',remark:'自动设备运行正常',remainFeed:'65%',progress:62,execRecords:[{time:'13:55',action:'系统启动',detail:'自动投喂设备TF-003预热'},{time:'14:00',action:'开始投喂',detail:'目标45kg，已投28kg，进度62%...'}]}
])

const filterStatus=ref('')
const filteredAreas=computed(()=>{
  let l=areas.value
  if(filterStatus.value)l=l.filter(a=>a.status===filterStatus.value)
  return l
})

// 倒计时更新（响应式存储 + 正确生命周期管理）
const countdowns=reactive({})  // 用 reactive 存储倒计时，Vue 才能追踪变化
const countdownTimers=ref({})
function startCountdown(a){
  if(!a.planTime||a.status!=='待投喂')return
  // 如果已有定时器先清除
  if(countdownTimers.value[a.key]){clearInterval(countdownTimers.value[a.key]);delete countdownTimers.value[a.key]}
  const update=()=>{
    const now=new Date()
    const [h,m]=a.planTime.split(':').map(Number)
    const target=new Date(now);target.setHours(h,m,0,0)
    if(target<now)target.setDate(target.getDate()+1)
    const diff=target-now
    if(diff<=0){
      countdowns[a.key]='已到投喂时间'
      // 通过 records 更新状态（records 是 reactive 的）
      const r=records.find(r=>r.archiveId===a.key)
      if(r)r.status='已超时'
      clearInterval(countdownTimers.value[a.key])
      delete countdownTimers.value[a.key]
      return
    }
    const hh=Math.floor(diff/3600000);const mm=Math.floor((diff%3600000)/60000);const ss=Math.floor((diff%60000)/1000)
    countdowns[a.key]=hh+'小时'+String(mm).padStart(2,'0')+'分钟'+String(ss).padStart(2,'0')+'秒'
  }
  update()
  countdownTimers.value[a.key]=setInterval(update,1000)
}

const areas=computed(()=>{
  const seen=new Set();const result=[]
  records.forEach(r=>{
    if(!seen.has(r.archiveId)){seen.add(r.archiveId);const bl=breedingList.find(l=>l.id===r.archiveId)
    const obj={key:r.archiveId,archiveId:r.archiveId,area:r.area,batchName:r.batchName,batchNo:r.batchNo,feedName:r.feedName,amount:r.amount,actualAmount:r.actualAmount||0,feedTime:r.feedTime,planTime:r.planTime,method:r.method,manager:bl?.manager||r.manager,status:r.status,remark:r.remark,deviation:r.deviation!==undefined?r.deviation:(r.actualAmount?r.amount-r.actualAmount:undefined),remainFeed:r.remainFeed,progress:r.progress,envNote:r.status==='已完成'?'水温 26.5℃ · 溶氧 6.2mg/L · 🟢 适宜投喂':'',execRecords:r.execRecords||[]}
    result.push(obj)}
  })
  return result
})

// 饲料消耗汇总（仅统计已完成和进行中的实际消耗）
const feedSummary=computed(()=>{
  const map={}
  records.forEach(r=>{if(r.feedName){if(r.status==='已完成'){map[r.feedName]=(map[r.feedName]||0)+(r.actualAmount||r.amount||0)}else if(r.status==='自动投喂中'){map[r.feedName]=(map[r.feedName]||0)+(r.actualAmount||0)}}})
  return Object.entries(map).map(([name,total])=>({name,total}))
})

// 挂载后为所有待投喂区域启动倒计时
onMounted(()=>{
  areas.value.forEach(a=>{if(a.status==='待投喂')startCountdown(a)})
})

// 当 areas 变化时（新增/修改记录），为新出现的待投喂项启动倒计时
watch(areas, (newAreas)=>{
  newAreas.forEach(a=>{
    if(a.status==='待投喂'&&!countdownTimers.value[a.key])startCountdown(a)
  })
})

const maxFeed=computed(()=>Math.max(...feedSummary.value.map(f=>f.total),1))
const totalFeed=computed(()=>feedSummary.value.reduce((s,f)=>s+f.total,0))

// 状态辅助
function statusCls(s){const m={'已完成':'g','待投喂':'y','自动投喂中':'b','已超时':'r'};return m[s]||''}
function statusIcon(s){const m={'已完成':'🟢','待投喂':'🟡','自动投喂中':'🔵','已超时':'🔴'};return m[s]||'⚪'}

// 详情
const detailOpen=ref(false),detailData=ref(null),addOpen=ref(false)
function showDetail(a){detailData.value=a;detailOpen.value=true}

// 表单
const form=reactive({archiveId:'',feedName:'',amount:'',feedTime:'',method:'人工投喂',remark:''})
const selectedArchive=computed(()=>breedingList.find(l=>l.id===form.archiveId))
const envOk=computed(()=>selectedArchive.value?.area!=='智能水产养殖基地1号池')
const aiSuggestion=computed(()=>{
  if(!selectedArchive.value)return null
  const area=selectedArchive.value.area
  const map={'荷虾混养区A塘':{recommend:48,reason:'鱼体均重0.8kg，水温26.5℃，历史采食量48kg/次'},'智能水产养殖基地1号池':{recommend:28,reason:'虾体均重35g，水温28.2℃，溶氧偏低建议减量'},'智慧渔业车间2号池':{recommend:45,reason:'鱼体均重0.5kg，水温25.8℃，采食正常'}}
  return map[area]||{recommend:40,reason:'根据养殖档案推荐'}
})
const deviationPct=computed(()=>{
  if(!aiSuggestion.value||!form.amount)return 0
  return Math.round(Math.abs(parseInt(form.amount)-(aiSuggestion.value.recommend))/(aiSuggestion.value.recommend)*100)
})
function onArchiveChange(){form.feedName='';form.amount='';updateDeviation()}
function updateDeviation(){}

function openAdd(){Object.assign(form,{archiveId:'',feedName:'',amount:'',feedTime:'',method:'人工投喂',remark:''});addOpen.value=true}
function quickFeed(a){form.archiveId=a.archiveId;form.feedName=a.feedName;form.amount=a.amount;form.method=a.method;form.feedTime=new Date().toTimeString().slice(0,5);addOpen.value=true}

function saveRecord(){
  if(!form.archiveId){alert('请选择养殖档案');return}
  const arch=breedingList.find(l=>l.id===form.archiveId)
  const now=new Date();const timeStr=now.toTimeString().slice(0,5);const dateTimeStr=now.toISOString().replace('T',' ').slice(0,16)
  const actualAmt=parseInt(form.amount)||0
  const r=records.find(r=>r.archiveId===form.archiveId)
  if(r){
    const planned=r.amount||0;r.feedName=form.feedName||'--';r.amount=planned||actualAmt;r.actualAmount=actualAmt;r.feedTime=form.feedTime||timeStr;r.method=form.method;r.status='已完成';r.remark=form.remark;r.deviation=planned?(planned-actualAmt):0
    if(!r.execRecords)r.execRecords=[]
    r.execRecords.push({time:timeStr,action:'手动记录完成',detail:'投喂'+actualAmt+'kg，方式：'+form.method})
    if(countdownTimers.value[r.archiveId]){clearInterval(countdownTimers.value[r.archiveId]);delete countdownTimers.value[r.archiveId];delete countdowns[r.archiveId]}
  }else{
    records.unshift({id:Date.now(),archiveId:form.archiveId,batchNo:arch.batchNo,batchName:arch.batchName,area:arch.area,feedName:form.feedName||'--',amount:actualAmt,actualAmount:actualAmt,feedTime:form.feedTime||timeStr,method:form.method,manager:arch.manager,status:'已完成',remark:form.remark||'',deviation:0,execRecords:[{time:timeStr,action:'手动记录',detail:'投喂'+actualAmt+'kg，方式：'+form.method}]})
  }
  addOpen.value=false;toast('已记录','ok')
}

// 导出
function doExport(){
  const csv='区域,批次,时间,饲料,计划量kg,实际量kg,方式,负责人,状态\n'+records.map(r=>[r.area,r.batchName,r.feedTime||r.planTime||'',r.feedName,r.amount||'',r.actualAmount||'',r.method||'',r.manager||'',r.status].join(',')).join('\n')
  const b=new Blob(['﻿'+csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='投喂记录.csv';a.click();URL.revokeObjectURL(a.href);toast('已导出','ok')
}

// 清理定时器
onUnmounted(()=>{Object.values(countdownTimers.value).forEach(t=>clearInterval(t))})
</script>

<style scoped>
.tbanner{font-size:15px;font-weight:700;padding:8px 12px;border-radius:6px;background:#EBEFF4;margin-bottom:12px}
.srow{display:flex;gap:10px;flex-wrap:wrap}.scard{flex:1;min-width:100px;height:88px;background:#FFFFFF;border:1px solid #E3EAF0;border-radius:10px;padding:12px;display:flex;flex-direction:column;justify-content:center}.scard .sv{font-size:24px;font-weight:700;color:#22B573;font-family:"SF Mono",Consolas,monospace}.scard .sl{font-size:12px;color:#66788A;margin-top:4px}.scard.g .sv{color:#22B573}.scard.y .sv{color:#F2A62B}.scard.r .sv{color:#E05252}.scard.b .sv{color:#0EA5E9}
.panel{background:#FFFFFF;border:1px solid #E3EAF0;border-radius:10px;margin-bottom:10px;transition:.2s}.dw-panel{cursor:pointer}.dw-panel:hover{border-color:rgba(14,165,233,.95);transform:translateY(-1px)}
.panel-hd-inline{font-size:14px;font-weight:700;color:#1F2D3D;margin-bottom:10px;display:flex;align-items:center;gap:8px;letter-spacing:.5px}
.hd-bar{width:3px;height:12px;border-radius:2px;flex-shrink:0;display:inline-block}.hd-bar.g{background:#22B573}
.dw-divider{height:1px;background:#EBEFF4;margin:8px 0}
.dw-status{font-size:12px;padding:3px 10px;border-radius:8px;font-weight:600}.dw-status.g{background:rgba(34,181,115,.12);color:#22B573}.dw-status.y{background:rgba(242,166,43,.12);color:#F2A62B}.dw-status.b{background:rgba(34,181,115,.12);color:#22B573}.dw-status.r{background:rgba(224,82,82,.12);color:#E05252}
.dw-status2{font-size:11px;padding:1px 7px;border-radius:8px;font-weight:600;white-space:nowrap}.dw-status2.g{background:rgba(34,181,115,.12);color:#22B573}.dw-status2.y{background:rgba(242,166,43,.12);color:#F2A62B}.dw-status2.b{background:#E3EAF0;color:#22B573}.dw-status2.r{background:rgba(224,82,82,.12);color:#E05252}
.tag{display:inline-block;padding:2px 8px;border-radius:10px;font-size:12px;font-weight:600}.tag.g{background:rgba(34,181,115,.12);color:#22B573}.tag.y{background:rgba(242,166,43,.12);color:#F2A62B}.tag.r{background:rgba(224,82,82,.12);color:#E05252}.tag.b{background:rgba(34,181,115,.12);color:#22B573}
/* 饲料消耗汇总 */
.feed-sum-item{padding:8px 12px;background:#F8FAFB;border-radius:8px;min-width:110px}.feed-sum-name{font-size:11px;color:#66788A;margin-bottom:2px}.feed-sum-val{font-size:18px;font-weight:700;color:#1F2D3D;font-family:monospace;margin-bottom:4px}.feed-sum-bar{height:3px;background:#E3EAF0;border-radius:2px;overflow:hidden}.feed-sum-fill{height:100%;background:linear-gradient(90deg,#22B573,#1BA366);border-radius:2px;transition:width .5s}
/* AI建议 */
.ai-suggest-box{padding:10px 12px;background:#EBEFF4;border:1px solid rgba(34,181,115,.12);border-radius:8px;margin-bottom:10px}.ai-suggest-hd{font-size:14px;font-weight:700;color:#22B573;margin-bottom:4px}
.env-ok{background:rgba(34,181,115,.08);border:1px solid #E3EAF0;color:#22B573}.env-warn{background:rgba(242,166,43,.08);border:1px solid rgba(242,166,43,.12);color:#F2A62B}
/* 时间轴 */
.timeline{position:relative;padding-left:20px;margin:8px 0}
.tl-node{position:relative;padding-bottom:16px}.tl-node.last{padding-bottom:0}
.tl-node::before{content:'';position:absolute;left:-14px;top:8px;width:2px;height:calc(100% - 4px);background:#E3EAF0}.tl-node.last::before{display:none}
.tl-dot{position:absolute;left:-19px;top:4px;width:10px;height:10px;border-radius:50%;background:rgba(34,181,115,.25);border:2px solid #D0D8E2}.tl-dot.active{background:#22B573;border-color:#22B573;box-shadow:0 0 8px rgba(34,181,115,.4)}
.tl-body{margin-left:4px}.tl-time{font-size:11px;color:#22B573;margin-bottom:2px;font-family:monospace}.tl-action{font-size:13px;color:#1F2D3D;font-weight:600}.tl-detail{font-size:12px;color:#66788A;margin-top:2px}
/* 表格 */
.dw-table{width:100%;border-collapse:collapse;font-size:13px}.dw-table th,.dw-table td{padding:7px 10px;text-align:left;font-size:12px}.dw-table th{background:#F8FAFB;color:#66788A;border-bottom:2px solid #E3EAF0;font-size:11px;white-space:nowrap}.dw-table td{border-bottom:1px solid #EBEFF4}.dw-table tr:hover td{background:#F0F3F8;cursor:pointer}
.fs{background:#FFFFFF;border:1px solid #E3EAF0;color:#475867;border-radius:6px;padding:4px 8px;font-size:12px;font-family:inherit;outline:none}
.btn{display:inline-block;padding:6px 14px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:inherit}.btn-p{background:linear-gradient(135deg,#22B573,#1BA366);color:#fff;box-shadow:0 2px 8px rgba(34,181,115,.20)}.btn-o{background:transparent;border:1px solid #D0D8E2;color:#22B573}.btn-d{background:rgba(224,82,82,.12);border:1px solid rgba(224,82,82,.25);color:#E05252}.btn-b{background:rgba(34,181,115,.12);border:1px solid rgba(34,181,115,.25);color:#22B573}.btn-s{padding:3px 9px;font-size:12px}
/* 抽屉 */
.drawer-overlay{position:fixed;inset:0;z-index:90;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .3s}.drawer-overlay.on{opacity:1;pointer-events:auto}
.drawer{position:fixed;top:0;right:0;bottom:0;width:480px;z-index:100;background:#FFFFFF;border-left:1px solid #E3EAF0;transform:translateX(100%);transition:transform .3s;display:flex;flex-direction:column}.drawer.on{transform:translateX(0)}
.drawer-hd{padding:14px 18px;border-bottom:1px solid #E3EAF0;display:flex;justify-content:space-between;align-items:center}.drawer-hd h3{font-size:16px;font-weight:700;color:#1F2D3D}
.drawer-close{width:28px;height:28px;border-radius:50%;border:1px solid #E3EAF0;background:#F0F3F8;color:#475867;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px}
.drawer-bd{flex:1;overflow-y:auto;padding:14px 18px}
.ds-title{font-size:14px;font-weight:700;color:#22B573;margin:14px 0 8px;padding-bottom:5px;border-bottom:1px solid rgba(34,181,115,.12);letter-spacing:.5px}
.dg3{background:#F8FAFB;padding:10px 12px;border-radius:8px;margin-bottom:6px}.dl3{display:block;font-size:11px;color:#22B573;margin-bottom:3px}.dg3 div:last-child{font-size:14px;color:#475867}
.fld{margin-bottom:10px}.fld label{display:block;font-size:13px;color:#66788A;margin-bottom:4px}.fld input,.fld select,.fld textarea{width:100%;padding:8px 10px;border-radius:8px;font-size:14px;font-family:inherit;background:#FFFFFF;border:1px solid #E3EAF0;color:#475867;outline:none;box-sizing:border-box}.frow2{display:flex;gap:8px}.frow2 .fld{flex:1}
.fin{width:100%;padding:8px 10px;border-radius:8px;font-size:14px;font-family:inherit;background:#FFFFFF;border:1px solid #E3EAF0;color:#475867;outline:none;box-sizing:border-box}
.toast{padding:10px 18px;border-radius:6px;font-size:14px;font-weight:600;color:#fff;pointer-events:auto;animation:ti .3s ease,to .3s ease 2s forwards}.toast.ok{background:linear-gradient(135deg,#1BA366,#22B573)}.toast.info{background:linear-gradient(135deg,#22B573,#1BA366)}.toast.warn{background:linear-gradient(135deg,#E0941F,#F2A62B)}@keyframes ti{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes to{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}
</style>
