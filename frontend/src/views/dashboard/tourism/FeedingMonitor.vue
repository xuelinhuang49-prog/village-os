<template>
<div style="padding:14px 18px">
<div class="tbanner" style="border-left-color:#28C76F;color:#28C76F">🍽 投喂管理 · 今日投喂状态<span style="font-size:10px;color:#6F91A8;font-weight:400;margin-left:8px">📍 中堰村</span></div>

<div class="srow" style="margin-bottom:10px"><div class="scard"><div class="sv">{{areas.length}}个</div><div class="sl">养殖区域</div></div><div class="scard g"><div class="sv">{{areas.filter(a=>a.status==='已完成').length}}个</div><div class="sl">已完成</div></div><div class="scard y"><div class="sv">{{areas.filter(a=>a.status==='待投喂').length}}个</div><div class="sl">待投喂</div></div><div class="scard"><div class="sv">{{areas.length}}项</div><div class="sl">今日计划</div></div></div>

<div style="display:flex;gap:10px;margin-bottom:10px"><button class="btn btn-p btn-s" @click="openAdd">记录投喂</button><span style="flex:1"></span></div>

<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:12px">
<div v-for="a in areas" :key="a.key" class="panel" style="padding:14px;margin:0;cursor:pointer" @click="showDetail(a)">
<div style="display:flex;justify-content:space-between;margin-bottom:10px"><div><span style="font-size:15px;font-weight:700;color:#fff">{{a.area}}</span><span style="font-size:10px;color:#6F91A8;margin-left:6px">{{a.batchName}}</span></div><span :class="'tag '+(a.status==='已完成'?'g':a.status==='待投喂'?'y':a.status==='自动投喂中'?'b':'r')" style="font-size:9px">{{a.status==='已完成'?'🟢 已完成':a.status==='待投喂'?'🟡 待投喂':a.status==='自动投喂中'?'🔵 自动投喂中':'🔴 已超时'}}</span></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px"><div><span style="color:#6F91A8">🍽 饲料</span><span style="color:#fff;margin-left:4px">{{a.feedName||'--'}}</span></div><div><span style="color:#6F91A8">⚖ 投喂量</span><span style="color:#fff;margin-left:4px">{{a.amount||'--'}}{{a.amount?'kg':''}}</span></div><div><span style="color:#6F91A8">🕐 时间</span><span style="color:#fff;margin-left:4px">{{a.feedTime||a.planTime||'--'}}</span></div><div><span style="color:#6F91A8">👤 负责人</span><span style="color:#fff;margin-left:4px">{{a.manager||'--'}}</span></div></div>
<div style="margin-top:8px;font-size:9px;color:#6F91A8">{{a.method||'--'}} · {{a.status==='已完成'?(a.feedTime||''):a.status==='待投喂'?'距离计划还有 '+(a.timeLeft||'--'):''}}</div>
<div v-if="a.status==='待投喂'" style="margin-top:8px"><button class="btn btn-p btn-s" @click.stop="quickFeed(a)">立即记录</button></div>
<div style="margin-top:8px;text-align:right"><span style="color:#28C76F;font-size:10px;cursor:pointer">查看详情 →</span></div>
</div>
</div>

<!-- 详情抽屉 -->
<div class="drawer-overlay" :class="{on:detailOpen}" @click="detailOpen=false"></div>
<div class="drawer" :class="{on:detailOpen}">
<div class="drawer-hd"><h3>🍽 {{detailData?.area}}</h3><button class="drawer-close" @click="detailOpen=false">✕</button></div>
<div class="drawer-bd" v-if="detailData">
<div style="text-align:center;padding:10px 0 14px"><span :class="'tag '+(detailData.status==='已完成'?'g':detailData.status==='待投喂'?'y':detailData.status==='自动投喂中'?'b':'r')" style="font-size:11px;padding:4px 14px">{{detailData.status==='已完成'?'🟢 已完成':detailData.status==='待投喂'?'🟡 待投喂':detailData.status==='自动投喂中'?'🔵 自动投喂中':'🔴 已超时'}}</span></div>
<div class="ds-title">🍽 投喂信息</div>
<div class="dg3"><span class="dl3">投喂时间</span><div>{{detailData.feedTime||detailData.planTime||'--'}}</div></div>
<div class="dg3"><span class="dl3">饲料</span><div>{{detailData.feedName||'--'}}</div></div>
<div class="dg3"><span class="dl3">投喂量</span><div style="font-weight:600">{{detailData.amount||'--'}} kg</div></div>
<div class="dg3"><span class="dl3">投喂方式</span><div>{{detailData.method||'--'}}</div></div>
<div class="dg3"><span class="dl3">负责人</span><div>{{detailData.manager||'--'}}</div></div>
<div class="ds-title">🐟 养殖信息</div>
<div class="dg3"><span class="dl3">批次</span><div>{{detailData.batchName}}</div></div>
<div class="dg3"><span class="dl3">编号</span><div style="color:#28C76F">{{detailData.batchNo}}</div></div>
<div class="dg3"><span class="dl3">养殖区域</span><div>{{detailData.area}}</div></div>
<div class="dg3" v-if="detailData.remark"><span class="dl3">备注</span><div>{{detailData.remark}}</div></div>
<div style="display:flex;gap:8px;margin-top:14px"><button v-if="detailData.status==='待投喂'" class="btn btn-p btn-s" @click="quickFeed(detailData);detailOpen=false">记录投喂</button><button class="btn btn-o btn-s" @click="detailOpen=false">关闭</button></div>
</div>
</div>

<!-- 记录投喂抽屉 -->
<div class="drawer-overlay" :class="{on:addOpen}" @click="addOpen=false"></div>
<div class="drawer" :class="{on:addOpen}">
<div class="drawer-hd"><h3>📝 记录投喂</h3><button class="drawer-close" @click="addOpen=false">✕</button></div>
<div class="drawer-bd">
<div class="ds-title">📋 选择养殖区域</div>
<div class="fld"><label>养殖档案</label><select v-model="form.archiveId" class="fin"><option value="">请选择</option><option v-for="l in breedingList" :key="l.id" :value="l.id">{{l.batchNo}} - {{l.area}}</option></select></div>
<div class="fld"><label>批次名称</label><input :value="selectedArchive?.batchName||'--'" class="fin" disabled style="color:#6F91A8"></div>
<div class="fld"><label>养殖区域</label><input :value="selectedArchive?.area||'--'" class="fin" disabled style="color:#6F91A8"></div>
<div class="ds-title">🍽 投喂信息</div>
<div class="frow2"><div class="fld"><label>饲料名称</label><input v-model="form.feedName" class="fin" placeholder="配合饲料1号"></div><div class="fld"><label>投喂量 (kg)</label><input v-model.number="form.amount" type="number" class="fin" placeholder="50" min="0"></div></div>
<div class="frow2"><div class="fld"><label>投喂时间</label><input v-model="form.feedTime" class="fin" placeholder="07:00"></div><div class="fld"><label>投喂方式</label><select v-model="form.method" class="fin"><option>人工投喂</option><option>自动投喂</option></select></div></div>
<div class="fld"><label>备注</label><textarea v-model="form.remark" class="fin" rows="2" placeholder="备注信息..." style="resize:vertical"></textarea></div>
<div style="display:flex;gap:8px;margin-top:14px"><button class="btn btn-p" style="flex:1" @click="saveRecord">保存</button><button class="btn btn-o" style="flex:1" @click="addOpen=false">取消</button></div>
</div>
</div>
</div>
</template>

<script setup>
import {ref,reactive,computed} from 'vue'

const breedingList=[{id:1,batchNo:'ZY-SC-202603-001',batchName:'2026年春季加州鲈批次',area:'荷虾混养区A塘',category:'水产',type:'鲈鱼',breed:'加州鲈',manager:'赵大哥',phone:'139****6789'},{id:2,batchNo:'ZY-SC-202604-001',batchName:'2026年澳洲淡水龙虾批次',area:'智能水产养殖基地1号池',category:'水产',type:'澳洲淡水龙虾',breed:'澳洲品系',manager:'李婶',phone:'138****8901'},{id:3,batchNo:'ZY-SC-202605-001',batchName:'2026年罗非鱼育成批次',area:'智慧渔业车间2号池',category:'水产',type:'罗非鱼',breed:'吉富品系',manager:'张大叔',phone:'137****2345'}]

const records=reactive([
{id:1,archiveId:1,batchNo:'ZY-SC-202603-001',batchName:'2026年春季加州鲈批次',area:'荷虾混养区A塘',feedName:'配合饲料1号',amount:50,feedTime:'07:00',method:'自动投喂',manager:'赵大哥',status:'已完成',remark:''},
{id:2,archiveId:2,batchNo:'ZY-SC-202604-001',batchName:'2026年澳洲淡水龙虾批次',area:'智能水产养殖基地1号池',feedName:'虾饲料',amount:30,planTime:'18:00',method:'人工投喂',manager:'李婶',status:'待投喂',remark:''},
{id:3,archiveId:3,batchNo:'ZY-SC-202605-001',batchName:'2026年罗非鱼育成批次',area:'智慧渔业车间2号池',feedName:'鱼饲料2号',amount:45,feedTime:'14:00',method:'自动投喂',manager:'张大叔',status:'自动投喂中',remark:'自动设备运行正常'}
])

const areas=computed(()=>{const seen=new Set();const result=[];records.forEach(r=>{if(!seen.has(r.archiveId)){seen.add(r.archiveId);const bl=breedingList.find(l=>l.id===r.archiveId);result.push({key:r.archiveId,archiveId:r.archiveId,area:r.area,batchName:r.batchName,batchNo:r.batchNo,feedName:r.feedName,amount:r.amount,feedTime:r.feedTime,planTime:r.planTime,method:r.method,manager:bl?.manager||r.manager,status:r.status,remark:r.remark,timeLeft:r.status==='待投喂'?'约2小时':'--'})}});return result})

const detailOpen=ref(false),detailData=ref(null),addOpen=ref(false)
function showDetail(a){detailData.value=a;detailOpen.value=true}

const form=reactive({archiveId:'',feedName:'',amount:'',feedTime:'',method:'人工投喂',remark:''})
const selectedArchive=computed(()=>breedingList.find(l=>l.id===form.archiveId))
function openAdd(){Object.assign(form,{archiveId:'',feedName:'',amount:'',feedTime:'',method:'人工投喂',remark:''});addOpen.value=true}
function quickFeed(a){form.archiveId=a.archiveId;form.feedName=a.feedName;form.amount=a.amount;form.method=a.method;form.feedTime=new Date().toTimeString().slice(0,5);addOpen.value=true}
function saveRecord(){
  if(!form.archiveId){alert('请选择养殖档案');return}
  const arch=breedingList.find(l=>l.id===form.archiveId)
  const now=new Date().toTimeString().slice(0,5)
  const r=records.find(r=>r.archiveId===form.archiveId)
  if(r){r.feedName=form.feedName||'--';r.amount=parseInt(form.amount)||0;r.feedTime=form.feedTime||now;r.method=form.method;r.status='已完成';r.remark=form.remark}else{
    records.unshift({id:Date.now(),archiveId:form.archiveId,batchNo:arch.batchNo,batchName:arch.batchName,area:arch.area,feedName:form.feedName||'--',amount:parseInt(form.amount)||0,feedTime:form.feedTime||now,method:form.method,manager:arch.manager,status:'已完成',remark:form.remark||''})
  }
  addOpen.value=false;alert('已记录')
}
</script>

<style scoped>
.tbanner{font-size:13px;font-weight:700;padding:8px 12px;border-radius:6px;background:rgba(40,199,111,.06);margin-bottom:12px}
.srow{display:flex;gap:10px;flex-wrap:wrap}.scard{flex:1;min-width:100px;height:85px;background:rgba(5,25,48,.96);border:1px solid rgba(190,214,234,.55);border-radius:10px;padding:12px;display:flex;flex-direction:column;justify-content:center}.scard .sv{font-size:22px;font-weight:700;color:#28C76F;font-family:monospace}.scard .sl{font-size:10px;color:#6F91A8;margin-top:3px}.scard.g .sv{color:#28C76F}.scard.y .sv{color:#F5B83D}.scard.r .sv{color:#E74C3C}
.panel{background:rgba(8,24,48,.88);border:1px solid rgba(205,224,241,.78);border-radius:10px;margin-bottom:10px;cursor:pointer}
.tag{display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600}.tag.g{background:rgba(16,214,160,.15);color:#28C76F}.tag.y{background:rgba(245,158,11,.15);color:#F5B83D}.tag.r{background:rgba(231,76,60,.15);color:#E74C3C}.tag.b{background:rgba(40,199,111,.12);color:#28C76F}
.ds-title{font-size:12px;font-weight:700;color:#28C76F;margin:12px 0 8px;padding-bottom:4px;border-bottom:1px solid rgba(40,199,111,.1)}
.dg3{background:rgba(10,36,68,.55);padding:10px;border-radius:8px;margin-bottom:6px}.dl3{display:block;font-size:9px;color:#28C76F;margin-bottom:3px}.dg3 div:last-child{font-size:12px;color:#B7D3E8}
.fld{margin-bottom:10px}.fld label{display:block;font-size:11px;color:#6F91A8;margin-bottom:4px}.fld input,.fld select{width:100%;padding:8px 10px;border-radius:8px;font-size:12px;font-family:inherit;background:rgba(57,217,138,.06);border:1px solid rgba(40,199,111,.1);color:#B7D3E8;outline:none;box-sizing:border-box}.frow2{display:flex;gap:8px}.frow2 .fld{flex:1}
.fin{width:100%;padding:8px 10px;border-radius:8px;font-size:12px;font-family:inherit;background:rgba(57,217,138,.06);border:1px solid rgba(40,199,111,.1);color:#B7D3E8;outline:none;box-sizing:border-box}
.btn{display:inline-block;padding:6px 14px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;border:none;font-family:inherit}.btn-p{background:linear-gradient(135deg,#39D98A,#28C76F);color:#fff;box-shadow:0 2px 8px rgba(57,217,138,.2)}.btn-o{background:transparent;border:1px solid rgba(14,165,233,.28);color:#28C76F}.btn-s{padding:3px 9px;font-size:10px}
.drawer-overlay{position:fixed;inset:0;z-index:90;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .3s}.drawer-overlay.on{opacity:1;pointer-events:auto}
.drawer{position:fixed;top:0;right:0;bottom:0;width:460px;z-index:100;background:rgba(6,20,44,.98);border-left:1px solid rgba(40,199,111,.1);transform:translateX(100%);transition:transform .3s;display:flex;flex-direction:column}.drawer.on{transform:translateX(0)}
.drawer-hd{padding:14px 18px;border-bottom:1px solid rgba(40,199,111,.1);display:flex;justify-content:space-between;align-items:center}.drawer-hd h3{font-size:14px;font-weight:700;color:#fff}
.drawer-close{width:28px;height:28px;border-radius:50%;border:1px solid rgba(40,199,111,.1);background:rgba(10,60,130,.2);color:#B7D3E8;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px}
.drawer-bd{flex:1;overflow-y:auto;padding:16px 18px}
</style>
