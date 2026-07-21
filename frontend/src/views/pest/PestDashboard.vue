<template>
<div class="pd" :class="{emb:embedded}">

<!-- 标题 -->
<div style="margin-bottom:8px">
<div style="font-size:15px;font-weight:700;color:#fff">病虫害智能预警</div>
<div style="font-size:10px;color:#6F91A8;margin-top:2px">融合AI识别、气象数据、人工巡查</div>
</div>

<!-- 1. 实时风险动态 -->
<div class="pn" style="border-left:4px solid #E74C3C;margin-bottom:8px">
<div class="tt" style="color:#E74C3C">🔴 实时风险动态</div>
<div v-if="activeWarnings.length">
<div v-for="w in activeWarnings" :key="w.id" style="padding:8px 10px;background:rgba(10,36,68,.55);border-radius:6px;margin-bottom:4px">
<span style="font-weight:600;color:#fff;font-size:11px">{{w.land}}</span>
<span style="color:#E74C3C;font-size:11px;margin:0 6px">{{w.disease}}</span>
<span :class="'t r'">{{w.level}}</span>
<span :class="'t '+(w.source==='AI识别'?'g':w.source==='气象预警'?'b':'y')" style="margin-left:10px">{{w.source||'AI识别'}}</span>
<span style="font-size:9px;color:#6F91A8;margin-left:6px">{{w.time}}</span>
<span :class="'t y'" style="margin-left:10px">{{w.status}}</span>
</div></div>
<div v-else style="text-align:center;padding:10px;color:#6F91A8;font-size:11px">✅ 当前无活跃风险</div>
</div>

<!-- 2. 当前风险提醒 -->
<div class="pn" style="margin-bottom:8px"><div class="tt">⚠ 🌡 环境风险预测 <span style="font-size:9px;color:#6F91A8;font-weight:400">基于气象环境数据分析</span></div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
<div v-for="r in riskReminders" :key="r.land" style="padding:10px;background:rgba(10,36,68,.55);border-radius:8px">
<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span style="width:8px;height:8px;border-radius:50%;background:#E74C3C;box-shadow:0 0 6px #E74C3C"></span><span style="font-weight:600;color:#fff;font-size:11px">{{r.land}}</span><span :class="'t '+(r.level==='高风险'?'r':'y')" style="margin-left:auto">{{r.level}}</span></div>
<div style="color:#E74C3C;font-size:11px;font-weight:600;margin-bottom:3px">{{r.disease}}风险升高</div>
<div style="font-size:9px;color:#6F91A8;margin-bottom:2px">{{r.cause}}</div>
<div style="font-size:9px;color:#28C76F;margin-bottom:4px">💡 {{r.advice}}</div>
<div style="display:flex;gap:10px;font-size:8px;color:#6F91A8"><span>🕐 {{r.time}}</span><span>📡 {{r.source}}</span></div>
</div></div></div>

<!-- 3. AI识别 -->
<div class="pn" style="margin-bottom:8px"><div class="tt">🔬 AI图像诊断</div>
<input type="file" ref="fileInput" accept="image/*" style="display:none" @change="onFileChange">
<div v-if="!previewUrl" style="text-align:center;padding:12px 0">
  <button class="bp" style="padding:10px 24px;font-size:13px;border-radius:8px" @click="$refs.fileInput.click()">🔬 AI图像诊断</button>
  <div style="font-size:10px;color:#6F91A8;margin-top:6px">上传作物/动物异常图片 · AI自动匹配病害知识库 · 生成处理建议</div>
</div>
<div v-if="previewUrl" style="display:flex;gap:12px;align-items:flex-start">
  <img :src="previewUrl" style="width:160px;max-height:140px;border-radius:6px;object-fit:cover">
  <div style="flex:1">
    <button class="bp bps" @click="$refs.fileInput.click()">📷 重新上传</button>
    <div v-if="aiResult" style="margin-top:8px;padding:10px;background:rgba(10,36,68,.55);border-radius:8px">
      <div style="font-weight:600;color:#E74C3C;font-size:14px">AI判断：{{aiResult.diseaseName}}</div>
      <div style="height:4px;background:rgba(40,199,111,.1);border-radius:2px;margin:6px 0;overflow:hidden"><div style="height:100%;background:#28C76F" :style="{width:aiResult.confidence+'%'}"></div></div>
      <div style="font-size:11px;color:#B7D3E8">置信度 <b style="color:#28C76F">{{aiResult.confidence}}%</b></div>
      <div style="font-size:10px;color:#28C76F;margin-top:4px">💊 {{aiResult.recommendation}}</div>
      <div style="display:flex;gap:6px;margin-top:8px">
        <button v-if="!aiConfirmed" class="bp bps" @click="confirmAiResult">✅ 确认结果</button><span v-else style="color:#28C76F;font-size:11px">✅ 已确认</span>
        <button class="bo2 bps" @click="$refs.fileInput.click()">📷 重新上传</button>
      </div>
    </div>
    <div v-else style="margin-top:8px;padding:10px;background:rgba(10,36,68,.55);border-radius:8px;color:#6F91A8;font-size:11px">AI分析中...</div>
  </div>
</div>
<!-- 最近识别结果 -->
<div v-if="aiHistory.length && !previewUrl" style="margin-top:10px;padding:10px;background:rgba(10,36,68,.55);border-radius:8px">
<div style="font-size:10px;color:#6F91A8;margin-bottom:4px">最近识别</div>
<div style="font-weight:600;color:#fff;font-size:12px">{{aiHistory[0].crop}} · {{aiHistory[0].disease}}</div>
<div style="font-size:10px;color:#28C76F">置信度 {{aiHistory[0].confidence}}% · {{aiHistory[0].time}}</div>
</div></div>

<!-- 4. KPI -->
<div class="pd-srow">
<div class="pd-sc"><div class="pd-sv">128</div><div class="pd-sl">本月诊断次数</div></div>
<div class="pd-sc"><div class="pd-sv green">{{Math.round(aiHistory.length?aiHistory.reduce((s,h)=>s+h.confidence,0)/aiHistory.length:94)}}%</div><div class="pd-sl">AI识别准确率</div></div>
<div class="pd-sc"><div class="pd-sv green">{{warningRecords.filter(w=>w.status==='已解决').length}}</div><div class="pd-sl">已解决事件</div></div>
</div>

<!-- 5. 本村产业风险库 -->
<div class="pn" style="margin-bottom:8px"><div class="tt">🏘 本村产业知识库</div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">
<div v-for="ind in villageProfile.industries" :key="ind" style="padding:8px;background:rgba(10,36,68,.55);border-radius:6px">
<div style="font-weight:600;color:#fff;font-size:11px">{{ind}}</div>
<div style="font-size:9px;color:#F5B83D;margin-top:3px">{{(villageProfile.keyRisks.find(r=>r.crop===ind)||{}).risks?.join('、')||'--'}}</div>
</div></div></div>

<!-- 6. 知识库 + AI历史 -->
<div style="display:flex;gap:8px;margin-bottom:8px">
<div class="pn" style="flex:1"><div class="tt">📚 病虫害知识库</div>
<div class="fb2"><select v-model="kFilter.type" class="fi"><option value="">全部类型</option><option value="植物病害">植物病害</option><option value="植物虫害">植物虫害</option><option value="动物疾病">动物疾病</option><option value="水产疾病">水产疾病</option></select><input v-model="kFilter.search" placeholder="搜索病害..." class="fi" style="width:120px"></div>
<div v-for="k in filteredKnowledge.slice(0,5)" :key="k.id" style="padding:8px;background:rgba(10,36,68,.55);border-radius:6px;margin-bottom:4px;cursor:pointer" @click="showKnowledge(k)">
<span :class="'t '+(k.level==='高风险'?'r':k.level==='中风险'?'y':'g')" style="margin-right:4px">{{k.level}}</span><span style="font-weight:600;color:#fff;font-size:11px">{{k.name}}</span><span style="font-size:9px;color:#6F91A8;margin-left:4px">{{k.targetType}}</span>
<div style="font-size:9px;color:#6F91A8;margin-top:3px">{{(k.symptoms||[]).slice(0,2).join('；')}}</div></div></div>

<div class="pn" style="flex:0.8"><div class="tt">🤖 AI诊断记录</div>
<div v-if="aiHistory.length">
<div v-for="h in aiHistory" :key="h.id" style="padding:8px;background:rgba(10,36,68,.55);border-radius:6px;margin-bottom:4px">
<div style="display:flex;justify-content:space-between;align-items:center"><span style="font-weight:600;color:#fff;font-size:10px">{{h.time?.slice(5)}}</span><span style="color:#28C76F;font-size:10px;font-weight:700">{{h.confidence}}%</span></div>
<div style="font-size:10px;color:#B7D3E8;margin-top:3px">{{h.crop}} → 识别：<b style="color:#E74C3C">{{h.disease}}</b></div>
<div v-if="h.advice" style="font-size:8px;color:#28C76F;margin-top:2px">💊 {{h.advice}}</div>
</div></div>
<div v-else style="text-align:center;padding:25px;color:#6F91A8;font-size:11px">暂无AI诊断记录<br><span style="font-size:9px;opacity:0.7">上传图片后，诊断结果将在这里保存</span></div></div></div>

<!-- 7. 历史预警记录 -->
<div class="pn"><div class="tt">📋 风险事件档案</div>
<div class="fb2"><select v-model="hFilter.status" class="fi"><option value="">全部状态</option><option value="处理中">处理中</option><option value="已解决">已解决</option></select></div>
<table class="tb2"><thead><tr><th>时间</th><th>村</th><th>地块</th><th>问题</th><th>来源</th><th>等级</th><th>状态</th></tr></thead>
<tbody><tr v-for="r in filteredHistory" :key="r.id" style="cursor:pointer" @click="showRecord(r)">
<td style="font-size:9px">{{r.time?.slice(5)}}</td><td style="font-size:9px">{{r.village}}</td><td style="font-size:9px">{{r.land}}</td><td style="font-size:9px;color:#fff">{{r.disease}}</td>
<td><span :class="'t '+(r.source==='AI识别'?'g':r.source==='人工上报'?'y':'b')" style="font-size:8px">{{r.source||'AI识别'}}</span></td>
<td><span :class="'t '+(r.level==='高风险'?'r':'y')">{{r.level}}</span></td><td><span :class="'t '+(r.status==='处理中'?'y':'g')">{{r.status}}</span></td></tr></tbody></table></div>

<!-- 知识详情弹窗 -->
<div class="mo2" :class="{on:detailOpen}" @click="detailOpen=false"><div class="mb2" @click.stop>
<div class="mh2">{{detailItem?.name}}<button class="mc2" @click="detailOpen=false">✕</button></div>
<template v-if="detailItem">
<div class="fl2"><label>类型</label><span :class="'t '+(detailItem.level==='高风险'?'r':'y')">{{detailItem.category}} · {{detailItem.level}}</span></div>
<div class="fl2"><label>适合作物</label><span style="color:#fff">{{detailItem.crop}}</span></div>
<div class="fl2"><label>症状表现</label><div style="color:#B7D3E8;font-size:10px"><div v-for="s in detailItem.symptoms" :key="s">• {{s}}</div></div></div>
<div class="fl2"><label>发生原因</label><div style="color:#B7D3E8;font-size:10px"><div v-for="c in detailItem.cause" :key="c">• {{c}}</div></div></div>
<div class="fl2"><label>防治方案</label><div v-for="s in detailItem.solution" :key="s.content" style="display:flex;gap:8px;padding:3px 0;font-size:10px"><span :class="'t g'">{{s.type}}</span><span style="color:#B7D3E8">{{s.content}}</span></div></div>
</template></div></div>
</div>
</template>

<script setup>
import {ref,reactive,computed} from 'vue'
import { diseaseLibrary, riskEvents as warningRecords, villageIndustries, simulateAiRecognize } from '@/api/pest.js'

const props = defineProps({embedded:Boolean})

const fileInput = ref(null), previewUrl = ref(null), aiResult = ref(null)
const aiHistory = reactive([])
async function onFileChange(e){
  const f = e.target.files[0]; if(!f) return
  previewUrl.value = URL.createObjectURL(f); aiResult.value = null
  const result = await simulateAiRecognize(f, '')
  aiResult.value = result
  aiHistory.unshift({id:Date.now(),disease:result.diseaseName,confidence:result.confidence,crop:result.crop||'未知',land:'--',time:new Date().toLocaleString(),advice:result.recommendation})
}

const riskReminders = [
  {land:'苹果园区A区',disease:'炭疽病',level:'高风险',cause:'近期湿度较高(78%)，温度28°C，条件适宜炭疽病发生',advice:'加强巡检，注意病斑出现',time:'2小时前',source:'环境模型'},
  {land:'养猪场A区',disease:'呼吸道综合征',level:'高风险',cause:'昼夜温差大(12°C→28°C)，通风不足，氨气浓度偏高',advice:'加强通风，补充维生素C',time:'3小时前',source:'AI识别'},
  {land:'葡萄园B区',disease:'霜霉病',level:'中风险',cause:'降雨后湿度持续偏高(>85%)，温度22-26°C',advice:'及时排水，检查叶片背面有无白色霉层',time:'5小时前',source:'环境模型'}
]

const villageProfile = { industries: villageIndustries.map(i => i.industryName), keyRisks: villageIndustries.map(i => ({ crop: i.industryName, risks: i.keyRisks })) }
const activeWarnings = computed(() => warningRecords.filter(w => w.status === '处理中'))
const highRiskCount = computed(() => warningRecords.filter(w => w.level === '高风险').length)

const kFilter = reactive({type:'',search:''})
const filteredKnowledge = computed(() => {
  let list = diseaseLibrary.filter(k => k.category)
  if (kFilter.type) list = list.filter(k => k.category === kFilter.type)
  if (kFilter.search) { const s = kFilter.search.toLowerCase(); list = list.filter(k => k.name.toLowerCase().includes(s) || k.targetType.toLowerCase().includes(s)) }
  return list
})

const hFilter = reactive({status:''})
const filteredHistory = computed(() => {
  let list = warningRecords
  if (hFilter.status) list = list.filter(r => r.status === hFilter.status)
  return list
})

const detailOpen = ref(false), detailItem = ref(null)
const toasts = reactive([])
function toast(m,t='info'){ const id=Date.now(); toasts.push({id,msg:m,type:t}); setTimeout(()=>{ const i=toasts.findIndex(x=>x.id===id); if(i>=0) toasts.splice(i,1) },2300) }
function showKnowledge(k) { detailItem.value = k; detailOpen.value = true }
const aiConfirmed = ref(false)
function confirmAiResult(){ if(aiResult.value){ aiConfirmed.value = true; aiResult.value.confirmed = true } }
function showRecord(r) { detailItem.value = {name:r.disease,type:r.level,crop:r.land,symptoms:[r.land+' · '+r.time],cause:[r.village],solution:[{type:r.status,content:'处理人：'+(r.handler||'--')}]}; detailOpen.value = true }
</script>

<style scoped>
.pd{color:#fff;font-size:12px;width:100%}.pd.emb{min-height:0}
.pd-srow{display:flex;gap:10px;margin-bottom:8px}
.pd-sc{flex:1;min-width:130px;background:rgba(5,25,48,.96);border:1px solid rgba(190,214,234,.55);border-radius:10px;padding:12px;text-align:center}
.pd-sv{font-size:22px;font-weight:700;font-family:monospace}.pd-sv.red{color:#E74C3C}.pd-sv.green{color:#28C76F}.pd-sv.yellow{color:#F5B83D}
.pd-sl{font-size:10px;color:#6F91A8;margin-top:3px}
.pn{background:rgba(5,25,48,.96);border:1px solid rgba(190,214,234,.55);border-radius:10px;padding:10px 14px;margin-bottom:8px}
.tt{font-size:12px;font-weight:700;color:#fff;margin-bottom:8px;display:flex;align-items:center;gap:6px}
.tt::before{content:'';width:3px;height:11px;border-radius:2px;background:#28C76F;flex-shrink:0}
.fb2{display:flex;gap:6px;margin-bottom:8px;align-items:center;flex-wrap:wrap}
.fi{background:rgba(57,217,138,.06);border:1px solid rgba(40,199,111,.1);color:#B7D3E8;border-radius:6px;padding:4px 8px;font-size:10px;font-family:inherit}
.bp{background:linear-gradient(135deg,#39D98A,#28C76F);color:#fff;border:none;cursor:pointer;font-family:inherit}
.bps{padding:4px 8px;font-size:9px;border-radius:6px}.bo2{background:transparent;border:1px solid rgba(40,199,111,.3);color:#28C76F;cursor:pointer;font-family:inherit}
.t{display:inline-block;padding:2px 6px;border-radius:9px;font-size:9px;font-weight:600}.t.r{background:rgba(231,76,60,.15);color:#E74C3C}.t.y{background:rgba(245,158,11,.15);color:#F5B83D}.t.g{background:rgba(16,214,160,.15);color:#28C76F}.t.b{background:rgba(40,199,250,.12);color:#28C7FA}
.tb2{width:100%;border-collapse:collapse}.tb2 th,.tb2 td{padding:6px 8px;text-align:left;font-size:9px}.tb2 th{background:rgba(10,36,68,.55);color:#6F91A8;border-bottom:2px solid rgba(40,199,111,.1)}.tb2 td{border-bottom:1px solid rgba(14,165,233,.06)}
.mo2{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:.25s}.mo2.on{opacity:1;pointer-events:auto}
.mb2{background:rgba(6,22,46,.98);border:1px solid rgba(40,199,111,.15);border-radius:12px;padding:20px 24px;width:480px;max-width:90vw;max-height:80vh;overflow-y:auto}
.mh2{font-size:15px;font-weight:700;color:#fff;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center}
.mc2{width:26px;height:26px;border-radius:50%;background:rgba(10,60,130,.2);border:1px solid rgba(40,199,111,.1);color:#B7D3E8;cursor:pointer;font-size:13px}
.fl2{margin-bottom:10px}.fl2 label{display:block;font-size:10px;color:#6F91A8;margin-bottom:3px}
</style>
