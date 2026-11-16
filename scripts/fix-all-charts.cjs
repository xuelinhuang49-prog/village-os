// Fix all 3 charts: insurance trend, subsidy pie, elderly health
const fs = require('fs');
const path = require('path');
const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0;

// ===== 1. INSURANCE: height 200→240 =====
const insHOld = 'id="chart_ins_trend" style="width:100%;height:200px"';
const insHNew = 'id="chart_ins_trend" style="width:100%;height:240px"';
if (s.includes(insHOld)) { s = s.replace(insHOld, insHNew); ok++; console.log('OK: 1-insurance height'); }
else { console.log('FAIL: 1-insurance height'); }

// ===== 2. INSURANCE: replace chart config (bars only, Y-axis with real labels) =====
const insChartOld = `chartInstance.setOption({title:{text:'我的报销趋势（近6个月）',textStyle:{color:'#6b7a8d',fontSize:11,fontWeight:400},left:0,top:-6},tooltip:{trigger:'axis',backgroundColor:'#ffffff',borderColor:'rgba(57,217,138,0.30)',textStyle:{color:'#1e293b',fontSize:10}},grid:{left:8,right:20,top:28,bottom:24},xAxis:{type:'category',data:['1月','2月','3月','4月','5月','6月'],axisLabel:{color:'#6b7a8d',fontSize:9},axisLine:{lineStyle:{color:'rgba(4,62,107,0.12)'}}},yAxis:{type:'value',name:'¥',axisLabel:{color:'#6b7a8d',fontSize:9},splitLine:{lineStyle:{color:'rgba(14,165,233,0.06)'}}},series:[{type:'bar',data:[180,0,320,860,125,1250],barWidth:16,itemStyle:{borderRadius:[3,3,0,0],color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#28C7FA'},{offset:1,color:'rgba(57,217,138,0.20)'}])}},{type:'line',data:[180,0,320,860,125,1250],smooth:true,lineStyle:{color:'#39D98A',width:2},itemStyle:{color:'#39D98A'},symbol:'circle',symbolSize:6}]})`;
const insChartNew = `chartInstance.setOption({title:{text:'近6个月医保报销趋势',textStyle:{color:'#D0E4F5',fontSize:13,fontWeight:600},left:0,top:2},tooltip:{trigger:'axis',backgroundColor:'rgba(7,27,45,0.95)',borderColor:'rgba(14,165,233,0.20)',textStyle:{color:'#D0E4F5',fontSize:11},formatter:function(p){return p[0].axisValue+'<br/>'+p[0].marker+' 报销金额：\\u00a5'+p[0].value.toLocaleString()}},grid:{left:46,right:20,top:36,bottom:28},xAxis:{type:'category',data:['1月','2月','3月','4月','5月','6月'],axisLabel:{color:'#6F91A8',fontSize:10},axisTick:{show:false},axisLine:{lineStyle:{color:'rgba(14,165,233,0.10)'}}},yAxis:{type:'value',name:'金额（元）',nameTextStyle:{color:'#6F91A8',fontSize:10},axisLabel:{color:'#6F91A8',fontSize:10,formatter:function(v){return v>=1000?'\\u00a5'+(v/1000).toFixed(0)+'k':'\\u00a5'+v}},splitLine:{lineStyle:{color:'rgba(14,165,233,0.06)'}}},series:[{type:'bar',data:[180,0,320,860,125,1250],barWidth:22,itemStyle:{borderRadius:[4,4,0,0],color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#28C7FA'},{offset:1,color:'rgba(40,199,250,0.15)'}])}}]})`;
if (s.includes(insChartOld)) { s = s.replace(insChartOld, insChartNew); ok++; console.log('OK: 2-insurance chart'); }
else { console.log('FAIL: 2-insurance chart'); }

// ===== 3. SUBSIDY TEMPLATE: replace with flex layout (left pie + right detail) =====
const subTplOld = `<div class="chart-block chart-block-sm" v-if="curTab==='subsidy'"><div id="chart_sub_pie" style="width:100%;height:180px"></div></div>`;
const subTplNew = `<div class="chart-block chart-block-sm" v-if="curTab==='subsidy'" style="display:flex;align-items:center;gap:20px;padding:14px 20px">
          <div id="chart_sub_pie" style="width:170px;height:170px;flex-shrink:0"></div>
          <div class="subsidy-chart-detail" style="flex:1;min-width:0">
            <div v-for="d in subsidyChartDetail" :key="d.name" style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
              <span style="font-size:12px;color:#D0E4F5"><span :style="{display:'inline-block',width:'8px',height:'8px',borderRadius:'2px',background:d.color,marginRight:'8px'}"></span>{{ d.name }}</span>
              <span style="text-align:right;font-size:12px"><span style="color:#D0E4F5;font-family:monospace">&yen;{{ d.amount.toLocaleString() }}</span> <span style="color:#6F91A8;font-size:10px;margin-left:4px">{{ d.pct }}%</span></span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;font-weight:600;font-size:13px;color:#fff;border-top:1px solid rgba(40,199,250,0.12);margin-top:2px">
              <span>累计获得</span><span style="font-family:monospace">&yen;{{ subsidyTotal.toLocaleString() }}</span>
            </div>
          </div>
        </div>`;
if (s.includes(subTplOld)) { s = s.replace(subTplOld, subTplNew); ok++; console.log('OK: 3-subsidy template'); }
else { console.log('FAIL: 3-subsidy template'); }

// ===== 4. SUBSIDY: simplify echarts (remove legend, adjust center/radius) =====
const subChartFn = `function initSubPieChart(){
  const el=document.getElementById('chart_sub_pie');if(!el)return;chartInstance=echarts.init(el)
  const total=subsidy.reduce((s,r)=>s+Number(r.amount),0)
  const data=[`;
const subChartNewFn = `function initSubPieChart(){
  const el=document.getElementById('chart_sub_pie');if(!el)return;chartInstance=echarts.init(el)
  const total=subsidy.reduce((s,r)=>s+Number(r.amount),0)
  const data=[`;
// The function starts the same — the difference is in the setOption call
// Let me replace the setOption part instead

// Find the setOption call in initSubPieChart and replace it
const subOptOld = `chartInstance.setOption({
    title:{text:'补贴构成',textStyle:{color:'#6b7a8d',fontSize:11,fontWeight:400},left:0,top:-6},
    tooltip:{trigger:'item',backgroundColor:'rgba(7,27,45,0.95)',borderColor:'rgba(14,165,233,0.30)',textStyle:{color:'#D0E4F5',fontSize:11},formatter:'{b}: ¥{c} ({d}%)'},
    legend:{orient:'vertical',right:10,top:'middle',textStyle:{color:'#6F91A8',fontSize:10},itemWidth:10,itemHeight:10,itemGap:12},
    series:[
      {type:'pie',radius:['55%','72%'],center:['35%','50%'],itemStyle:{borderColor:'rgba(8,28,58,0.92)',borderWidth:2},label:{show:false},emphasis:{label:{show:true,fontSize:14,fontWeight:'bold'}},data:data},
      {type:'pie',radius:['0%','0%'],center:['35%','50%'],label:{show:true,position:'center',formatter:'累计获得\\n¥{c}',fontSize:12,color:'#D0E4F5',lineHeight:18},data:[{value:total,name:''}]}
    ]
  })`;
const subOptNew = `chartInstance.setOption({
    tooltip:{trigger:'item',backgroundColor:'rgba(7,27,45,0.95)',borderColor:'rgba(14,165,233,0.30)',textStyle:{color:'#D0E4F5',fontSize:11},formatter:'{b}: \\u00a5{c} ({d}%)'},
    series:[
      {type:'pie',radius:['60%','80%'],center:['50%','50%'],itemStyle:{borderColor:'rgba(8,28,58,0.92)',borderWidth:2},label:{show:false},emphasis:{label:{show:true,fontSize:14,fontWeight:'bold'}},data:data},
      {type:'pie',radius:['0%','0%'],center:['50%','50%'],label:{show:true,position:'center',formatter:'累计获得\\n\\u00a5{c}',fontSize:12,color:'#D0E4F5',lineHeight:18,fontWeight:600},data:[{value:total,name:''}]}
    ]
  })`;
if (s.includes(subOptOld)) { s = s.replace(subOptOld, subOptNew); ok++; console.log('OK: 4-subsidy chart'); }
else { console.log('FAIL: 4-subsidy chart'); }

// ===== 5. ELDERLY TEMPLATE: add elder selector + dynamic title =====
const eldTplOld = `<div class="chart-block" v-if="curTab==='elderly'"><div id="chart_elder_health" style="width:100%;height:340px"></div></div>`;
const eldTplNew = `<div class="chart-block" v-if="curTab==='elderly'">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div style="font-size:14px;font-weight:600;color:#D0E4F5">{{ selectedChartElderName }} · 近7天健康趋势</div>
            <select v-model="selectedChartElderId" @change="onChartElderSwitch" style="background:rgba(10,36,68,0.55);border:1px solid rgba(40,199,250,0.15);color:#D0E4F5;padding:4px 10px;border-radius:4px;font-size:11px;font-family:inherit;cursor:pointer;outline:none">
              <option v-for="e in elderly" :key="e.id" :value="e.id">{{ e.name }}（{{ e.relation }}）</option>
            </select>
          </div>
          <div id="chart_elder_health" style="width:100%;height:310px"></div>
        </div>`;
if (s.includes(eldTplOld)) { s = s.replace(eldTplOld, eldTplNew); ok++; console.log('OK: 5-elderly template'); }
else { console.log('FAIL: 5-elderly template'); }

// ===== 6. ELDERLY DATA: add trend field to each elder =====
const elder1Old = "device: '智能手环', status: '重点关注'";
const elder1New = "device: '智能手环', status: '重点关注', trend: { heartRate: [72,75,70,78,88,95,88], sleep: [6.5,6.2,5.8,5.5,4.2,5.1,5.0] }";
if (s.includes(elder1Old)) { s = s.replace(elder1Old, elder1New); ok++; console.log('OK: 6-elder1 trend'); }
else { console.log('FAIL: 6-elder1 trend'); }

const elder2Old = "device: '智能手表', status: '需关注'";
const elder2New = "device: '智能手表', status: '需关注', trend: { heartRate: [68,70,67,72,70,73,72], sleep: [7.0,6.8,7.2,6.5,7.0,6.8,6.5] }";
if (s.includes(elder2Old)) { s = s.replace(elder2Old, elder2New); ok++; console.log('OK: 7-elder2 trend'); }
else { console.log('FAIL: 7-elder2 trend'); }

// ===== 8. Add reactive state after _pendingElderAction =====
const stateOld = `let _pendingElderAction = null`;
const stateNew = `let _pendingElderAction = null
const selectedChartElderId = ref(21)
const selectedChartElderName = computed(() => {
  const e = elderly.find(x => x.id === selectedChartElderId.value)
  return e ? e.name : ''
})
function onChartElderSwitch(){
  setTimeout(() => {
    const el = document.getElementById('chart_elder_health')
    if (el && chartInstance) {
      const e = elderly.find(x => x.id === selectedChartElderId.value)
      if (e) {
        chartInstance.setOption({
          title: { text: e.name + ' · 近7天健康趋势' },
          series: [
            { data: e.trend.heartRate },
            { data: e.trend.sleep }
          ]
        })
      }
    }
  }, 50)
}`;
if (s.includes(stateOld)) { s = s.replace(stateOld, stateNew); ok++; console.log('OK: 8-state'); }
else { console.log('FAIL: 8-state'); }

// ===== 9. Add subsidy computed properties (before initCurChart or near subsidy data) =====
// Insert after subsidy reactive array
const subDataEnd = `{ id:13, appNo:"SB20260701003", name:"王友德", type:"低保补助", amount:4260, status:"发放中", date:"2026-07-01", node:"待发放", nodes:["已提交","村级初审","乡镇审核","部门复核","待发放","已发放"], currentNodeIdx:4 }
])`;
const subDataWithComputed = subDataEnd + `
const subsidyTotal = computed(() => subsidy.reduce((s, r) => s + Number(r.amount), 0))
const subsidyChartDetail = computed(() => {
  const groups = {}
  subsidy.forEach(r => { const k = r.type; if (!groups[k]) groups[k] = 0; groups[k] += Number(r.amount) })
  const colors = { '耕地地力保护补贴': '#28C7FA', '农机购置补贴': '#39D98A', '低保补助': '#f59e0b', '创业补贴': '#a78bfa' }
  const total = subsidyTotal.value || 1
  return Object.entries(groups).map(([name, amount]) => ({
    name, amount, pct: ((amount / total) * 100).toFixed(1), color: colors[name] || '#6F91A8'
  })).sort((a, b) => b.amount - a.amount)
})`;
if (s.includes(subDataEnd)) { s = s.replace(subDataEnd, subDataWithComputed); ok++; console.log('OK: 9-subsidy computed'); }
else { console.log('FAIL: 9-subsidy computed'); }

// ===== 10. ELDERLY CHART: update config (per-elder data, legend left, brighter bars) =====
const eldChartOld = `chartInstance.setOption({title:{text:'近7天健康趋势',textStyle:{color:'#D0E4F5',fontSize:13,fontWeight:600},left:0,top:2},tooltip:{trigger:'axis',backgroundColor:'rgba(7,27,45,0.95)',borderColor:'rgba(14,165,233,0.20)',textStyle:{color:'#D0E4F5',fontSize:11},formatter:function(p){var r=p[0].axisValue;for(var i=0;i<p.length;i++){r+=p[i].marker+' '+p[i].seriesName+'：'+p[i].value+' '+(p[i].seriesName==='心率'?'bpm':'h')}return r}},grid:{left:42,right:48,top:38,bottom:28},legend:{data:['心率','睡眠时长'],textStyle:{color:'#6F91A8',fontSize:10},top:0,right:0,itemWidth:16,itemHeight:8},xAxis:{type:'category',data:['6/12','6/13','6/14','6/15','6/16','6/17','6/18'],axisLabel:{color:'#6F91A8',fontSize:10},axisTick:{show:false},axisLine:{lineStyle:{color:'rgba(14,165,233,0.10)'}}},yAxis:[{type:'value',name:'心率 (bpm)',nameTextStyle:{color:'#E74C3C',fontSize:10},min:60,max:100,interval:10,axisLabel:{color:'#E74C3C',fontSize:10},splitLine:{show:true,lineStyle:{color:'rgba(14,165,233,0.06)'}}},{type:'value',name:'睡眠 (h)',nameTextStyle:{color:'#28C7FA',fontSize:10},min:0,max:8,interval:2,axisLabel:{color:'#28C7FA',fontSize:10},splitLine:{show:false}}],series:[{name:'心率',type:'line',data:[72,75,70,78,88,95,88],yAxisIndex:0,smooth:true,symbol:'circle',symbolSize:5,lineStyle:{color:'#E74C3C',width:1.5},itemStyle:{color:'#E74C3C'},z:2},{name:'睡眠时长',type:'bar',data:[6.5,6.2,5.8,5.5,4.2,5.1,5.0],yAxisIndex:1,barWidth:16,barGap:'30%',itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(40,199,250,0.30)'},{offset:1,color:'rgba(40,199,250,0.06)'}]),borderRadius:[4,4,0,0],borderColor:'rgba(40,199,250,0.20)',borderWidth:1},z:1}]})`;
const eldChartNew = `const e=elderly.find(x=>x.id===selectedChartElderId.value)||elderly[0]
  const hrData=e.trend?e.trend.heartRate:[72,75,70,78,88,95,88]
  const slData=e.trend?e.trend.sleep:[6.5,6.2,5.8,5.5,4.2,5.1,5.0]
  chartInstance.setOption({title:{text:e.name+' · 近7天健康趋势',textStyle:{color:'#D0E4F5',fontSize:13,fontWeight:600},left:0,top:2},tooltip:{trigger:'axis',backgroundColor:'rgba(7,27,45,0.95)',borderColor:'rgba(14,165,233,0.20)',textStyle:{color:'#D0E4F5',fontSize:11},formatter:function(p){var r=p[0].axisValue;for(var i=0;i<p.length;i++){r+=p[i].marker+' '+p[i].seriesName+'：'+p[i].value+' '+(p[i].seriesName==='心率'?'bpm':'h')}return r}},grid:{left:44,right:52,top:12,bottom:28},legend:{data:['心率','睡眠时长'],textStyle:{color:'#6F91A8',fontSize:10},top:0,left:0,itemWidth:16,itemHeight:8},xAxis:{type:'category',data:['6/12','6/13','6/14','6/15','6/16','6/17','6/18'],axisLabel:{color:'#6F91A8',fontSize:10},axisTick:{show:false},axisLine:{lineStyle:{color:'rgba(14,165,233,0.10)'}}},yAxis:[{type:'value',name:'心率 (bpm)',nameTextStyle:{color:'#E74C3C',fontSize:10},min:60,max:100,interval:10,axisLabel:{color:'#E74C3C',fontSize:10},splitLine:{show:true,lineStyle:{color:'rgba(14,165,233,0.06)'}}},{type:'value',name:'睡眠时长 (h)',nameTextStyle:{color:'#28C7FA',fontSize:10},min:0,max:8,interval:2,axisLabel:{color:'#28C7FA',fontSize:10},splitLine:{show:false}}],series:[{name:'心率',type:'line',data:hrData,yAxisIndex:0,smooth:true,symbol:'circle',symbolSize:5,lineStyle:{color:'#E74C3C',width:1.5},itemStyle:{color:'#E74C3C'},z:2},{name:'睡眠时长',type:'bar',data:slData,yAxisIndex:1,barWidth:16,barGap:'30%',itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(40,199,250,0.50)'},{offset:1,color:'rgba(40,199,250,0.12)'}]),borderRadius:[4,4,0,0],borderColor:'rgba(40,199,250,0.30)',borderWidth:1},z:1}]})`;
if (s.includes(eldChartOld)) { s = s.replace(eldChartOld, eldChartNew); ok++; console.log('OK: 10-elderly chart'); }
else { console.log('FAIL: 10-elderly chart'); }

// ===== 11. Add CSS for subsidy-chart-detail =====
const cssAnchor = `.chart-block-sm { padding:14px 20px !important; }`;
const cssNewBlock = `.chart-block-sm { padding:14px 20px !important; }
.subsidy-chart-detail { min-width:0; }`;
if (s.includes(cssAnchor) && !s.includes('.subsidy-chart-detail')) {
  s = s.replace(cssAnchor, cssNewBlock);
  ok++; console.log('OK: 11-CSS');
} else { console.log('FAIL: 11-CSS'); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== FINAL ===');
console.log('Changes:', ok, '/ 11');
console.log('Length:', s.length);
