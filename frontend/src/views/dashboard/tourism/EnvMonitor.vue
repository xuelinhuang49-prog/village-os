<template>
<div style="padding:14px 18px">
<div class="tbanner" style="border-left-color:#28C76F;color:#28C76F">🌡 环境监测 · 养殖区当前状态<span style="font-size:10px;color:#6F91A8;font-weight:400;margin-left:8px">📍 中堰村</span></div>

<!-- 统计卡 -->
<div class="srow" style="margin-bottom:10px"><div class="scard"><div class="sv">{{areas.length}}个</div><div class="sl">监测区域</div></div><div class="scard g"><div class="sv">{{areas.filter(a=>a.status==='正常').length}}个</div><div class="sl">正常区域</div></div><div class="scard r"><div class="sv">{{areas.filter(a=>a.status!=='正常').length}}个</div><div class="sl">异常区域</div></div><div class="scard"><div class="sv">{{records.length}}条</div><div class="sl">今日采集</div></div></div>

<!-- 操作区 -->
<div style="display:flex;gap:10px;margin-bottom:10px"><button class="btn btn-p btn-s" @click="openAdd">+ 新增监测</button><span style="flex:1"></span></div>

<!-- 区域卡片 -->
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:12px">
<div v-for="a in areas" :key="a.key" class="panel" style="padding:14px;margin:0;cursor:pointer" @click="showDetail(a)">
<div style="display:flex;justify-content:space-between;margin-bottom:10px"><div><span style="font-size:15px;font-weight:700;color:#fff">{{a.area}}</span><span style="font-size:10px;color:#6F91A8;margin-left:6px">{{a.batchName}}</span></div><span :class="'tag '+(a.status==='正常'?'g':'r')" style="font-size:9px">{{a.status==='正常'?'🟢 正常':'🔴 预警'}}</span></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px"><div><span style="color:#6F91A8">🌡 水温</span> <span :style="{color:a.waterTemp>30||a.waterTemp<20?'#E74C3C':'#fff'}">{{a.waterTemp}}℃</span></div><div><span style="color:#6F91A8">🧪 pH</span> <span :style="{color:a.ph>9||a.ph<6?'#E74C3C':a.ph>8.5||a.ph<6.5?'#F5B83D':'#fff'}">{{a.ph}}</span></div><div><span style="color:#6F91A8">💧 溶氧</span> <span :style="{color:a.oxygen<4?'#E74C3C':a.oxygen<5?'#F5B83D':'#fff'}">{{a.oxygen}}mg/L</span></div><div><span style="color:#6F91A8">⚠️ 氨氮</span> <span :style="{color:a.ammonia>0.5?'#E74C3C':a.ammonia>0.3?'#F5B83D':'#fff'}">{{a.ammonia}}mg/L</span></div></div>
<div style="margin-top:8px;font-size:9px;color:#6F91A8">🕐 {{a.recordTime?.slice(5,16)}} · {{a.source==='传感器自动采集'?'🤖自动':a.source==='农户手工记录'?'👨手工':'👨‍💼补录'}}</div>
<div v-if="a.status!=='正常'" style="margin-top:6px;padding:6px 8px;border-radius:6px;background:rgba(245,158,11,.1);font-size:10px;color:#F5B83D">💡 {{a.suggestion||'请检查水质'}}</div>
</div>
</div>

<!-- 详情抽屉 -->
<div class="drawer-overlay" :class="{on:detailOpen}" @click="detailOpen=false"></div>
<div class="drawer" :class="{on:detailOpen}">
<div class="drawer-hd"><h3>🌡 {{detailData?.area}}</h3><button class="drawer-close" @click="detailOpen=false">✕</button></div>
<div class="drawer-bd" v-if="detailData">
<div style="text-align:center;padding:10px 0 14px"><span :class="'tag '+(detailData.status==='正常'?'g':'r')" style="font-size:11px;padding:4px 14px">{{detailData.status==='正常'?'🟢 当前正常':'🔴 需要关注'}}</span><div style="font-size:11px;color:#6F91A8;margin-top:6px">更新时间 {{detailData.recordTime?.slice(0,16)}}</div></div>
<div class="ds-title">🌡 监测指标</div>
<div class="dg3"><span class="dl3">水温</span><div :style="{color:detailData.waterTemp>30||detailData.waterTemp<20?'#E74C3C':'#fff'}">{{detailData.waterTemp}}℃</div></div>
<div class="dg3"><span class="dl3">pH</span><div :style="{color:detailData.ph>9||detailData.ph<6?'#E74C3C':detailData.ph>8.5||detailData.ph<6.5?'#F5B83D':'#fff'}">{{detailData.ph}}</div></div>
<div class="dg3"><span class="dl3">溶解氧</span><div :style="{color:detailData.oxygen<4?'#E74C3C':detailData.oxygen<5?'#F5B83D':'#fff'}">{{detailData.oxygen}} mg/L</div></div>
<div class="dg3"><span class="dl3">氨氮</span><div :style="{color:detailData.ammonia>0.5?'#E74C3C':detailData.ammonia>0.3?'#F5B83D':'#fff'}">{{detailData.ammonia}} mg/L</div></div>
<div class="dg3"><span class="dl3">浊度</span><div>{{detailData.turbidity||'--'}} NTU</div></div>
<div class="dg3"><span class="dl3">水位</span><div>{{detailData.waterLevel||'--'}}%</div></div>
<div class="ds-title">🐟 养殖信息</div>
<div class="dg3"><span class="dl3">批次</span><div>{{detailData.batchName}}</div></div>
<div class="dg3"><span class="dl3">编号</span><div style="color:#28C76F">{{detailData.batchNo}}</div></div>
<div class="dg3"><span class="dl3">养殖区域</span><div>{{detailData.area}}</div></div>
<div class="dg3"><span class="dl3">数据来源</span><div>{{detailData.source==='传感器自动采集'?'🤖 自动采集':detailData.source==='农户手工记录'?'👨 农户记录':'👨‍💼 管理员补录'}}</div></div>
<div class="dg3" v-if="detailData.remark"><span class="dl3">备注</span><div>{{detailData.remark}}</div></div>
<div style="display:flex;gap:8px;margin-top:14px"><button class="btn btn-p btn-s" @click="openAdd();detailOpen=false">+ 新增记录</button><button class="btn btn-o btn-s" @click="detailOpen=false">关闭</button></div>
</div>
</div>

<!-- 新增记录抽屉 -->
<div class="drawer-overlay" :class="{on:addOpen}" @click="addOpen=false"></div>
<div class="drawer" :class="{on:addOpen}">
<div class="drawer-hd"><h3>📝 新增监测记录</h3><button class="drawer-close" @click="addOpen=false">✕</button></div>
<div class="drawer-bd">
<div class="ds-title">📋 选择养殖区域</div>
<div class="fld"><label>养殖档案</label><select v-model="form.archiveId" class="fin" @change="onArchiveChange"><option value="">请选择</option><option v-for="l in breedingList" :key="l.id" :value="l.id">{{l.batchNo}} - {{l.area}}</option></select></div>
<div class="fld"><label>批次名称</label><input :value="selectedArchive?.batchName||'--'" class="fin" disabled style="color:#6F91A8"></div>
<div class="fld"><label>养殖区域</label><input :value="selectedArchive?.area||'--'" class="fin" disabled style="color:#6F91A8"></div>
<div class="ds-title">🌡 监测数据</div>
<div class="frow2"><div class="fld"><label>水温 (℃)</label><input v-model.number="form.waterTemp" type="number" class="fin" step="0.1" placeholder="26.5"><span v-if="form.waterTemp>30" style="font-size:9px;color:#E74C3C">⚠ 水温偏高</span><span v-if="form.waterTemp<20" style="font-size:9px;color:#E74C3C">⚠ 水温偏低</span></div><div class="fld"><label>pH</label><input v-model.number="form.ph" type="number" class="fin" step="0.1" placeholder="7.4"><span v-if="form.ph>9" style="font-size:9px;color:#E74C3C">⚠ pH偏高</span><span v-if="form.ph<6" style="font-size:9px;color:#E74C3C">⚠ pH偏低</span></div></div>
<div class="frow2"><div class="fld"><label>溶解氧 (mg/L)</label><input v-model.number="form.oxygen" type="number" class="fin" step="0.1" placeholder="6.2"><span v-if="form.oxygen<4" style="font-size:9px;color:#E74C3C">⚠ 溶氧不足</span><span v-if="form.oxygen>=4&&form.oxygen<5" style="font-size:9px;color:#F5B83D">建议增氧</span></div><div class="fld"><label>氨氮 (mg/L)</label><input v-model.number="form.ammonia" type="number" class="fin" step="0.01" placeholder="0.18"><span v-if="form.ammonia>0.5" style="font-size:9px;color:#E74C3C">⚠ 氨氮偏高</span></div></div>
<div class="frow2"><div class="fld"><label>浊度 (NTU)</label><input v-model.number="form.turbidity" type="number" class="fin" step="0.1" placeholder="5.2"></div><div class="fld"><label>水位 (%)</label><input v-model.number="form.waterLevel" type="number" class="fin" placeholder="95"></div></div>
<div class="fld"><label>数据来源</label><select v-model="form.source" class="fin"><option>传感器自动采集</option><option>农户手工记录</option><option>管理员补录</option></select></div>
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
{id:1,archiveId:1,batchNo:'ZY-SC-202603-001',batchName:'2026年春季加州鲈批次',area:'荷虾混养区A塘',waterTemp:26.5,ph:7.4,oxygen:6.2,ammonia:0.18,turbidity:5.2,waterLevel:95,status:'正常',source:'传感器自动采集',recordTime:'2026-08-04 15:20',remark:''},
{id:2,archiveId:2,batchNo:'ZY-SC-202604-001',batchName:'2026年澳洲淡水龙虾批次',area:'智能水产养殖基地1号池',waterTemp:28.2,ph:7.1,oxygen:5.5,ammonia:0.35,turbidity:6.8,waterLevel:88,status:'预警',source:'传感器自动采集',recordTime:'2026-08-04 14:00',remark:'溶解氧偏低'},
{id:3,archiveId:3,batchNo:'ZY-SC-202605-001',batchName:'2026年罗非鱼育成批次',area:'智慧渔业车间2号池',waterTemp:25.8,ph:7.6,oxygen:6.8,ammonia:0.12,turbidity:4.1,waterLevel:92,status:'正常',source:'农户手工记录',recordTime:'2026-08-04 16:00',remark:''}
])

const areas=computed(()=>{const seen=new Set();const result=[];records.forEach(r=>{if(!seen.has(r.archiveId)){seen.add(r.archiveId);const s=r.status;result.push({key:r.archiveId,archiveId:r.archiveId,area:r.area,batchName:r.batchName,batchNo:r.batchNo,waterTemp:r.waterTemp,ph:r.ph,oxygen:r.oxygen,ammonia:r.ammonia,turbidity:r.turbidity,waterLevel:r.waterLevel,status:r.status,recordTime:r.recordTime,source:r.source,suggestion:r.status==='预警'?'溶解氧偏低，建议开启增氧机':r.status==='异常'?'请立即检查水质':''})}});return result})

const detailOpen=ref(false),detailData=ref(null),addOpen=ref(false)
function showDetail(a){detailData.value=a;detailOpen.value=true}

const form=reactive({archiveId:'',waterTemp:'',ph:'',oxygen:'',ammonia:'',turbidity:'',waterLevel:'',source:'农户手工记录',remark:''})
const selectedArchive=computed(()=>breedingList.find(l=>l.id===form.archiveId))
function onArchiveChange(){}
function openAdd(){form.archiveId='';form.waterTemp='';form.ph='';form.oxygen='';form.ammonia='';form.turbidity='';form.waterLevel='';form.source='农户手工记录';form.remark='';addOpen.value=true}
function saveRecord(){
  if(!form.archiveId){alert('请选择养殖档案');return}
  const arch=breedingList.find(l=>l.id===form.archiveId)
  const wt=parseFloat(form.waterTemp)||0;const p=parseFloat(form.ph)||0;const o=parseFloat(form.oxygen)||0;const a=parseFloat(form.ammonia)||0
  let status='正常';if(o<4||a>0.5||p>9||p<6)status='预警'
  records.unshift({id:Date.now(),archiveId:form.archiveId,batchNo:arch.batchNo,batchName:arch.batchName,area:arch.area,waterTemp:wt,ph:p,oxygen:o,ammonia:a,turbidity:parseFloat(form.turbidity)||0,waterLevel:parseInt(form.waterLevel)||0,status,source:form.source,recordTime:new Date().toISOString().replace('T',' ').slice(0,16),remark:form.remark||''})
  addOpen.value=false;alert('已保存')
}
</script>

<style scoped>
.tbanner{font-size:13px;font-weight:700;padding:8px 12px;border-radius:6px;background:rgba(40,199,111,.06);margin-bottom:12px}
.srow{display:flex;gap:10px;flex-wrap:wrap}.scard{flex:1;min-width:100px;height:85px;background:rgba(5,25,48,.96);border:1px solid rgba(190,214,234,.55);border-radius:10px;padding:12px;display:flex;flex-direction:column;justify-content:center}.scard .sv{font-size:22px;font-weight:700;color:#28C76F;font-family:monospace}.scard .sl{font-size:10px;color:#6F91A8;margin-top:3px}.scard.g .sv{color:#28C76F}.scard.r .sv{color:#E74C3C}
.panel{background:rgba(8,24,48,.88);border:1px solid rgba(205,224,241,.78);border-radius:10px;margin-bottom:10px}
.tag{display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600}.tag.g{background:rgba(16,214,160,.15);color:#28C76F}.tag.y{background:rgba(245,158,11,.15);color:#F5B83D}.tag.r{background:rgba(231,76,60,.15);color:#E74C3C}
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
