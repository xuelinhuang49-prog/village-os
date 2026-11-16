// Fix elderly health chart: dual Y-axis, proper ranges, cleaner grid, better sizing
const fs = require('fs');
const path = require('path');
const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0;

// === 1. Increase chart height from 200px to 340px ===
const hOld = 'id="chart_elder_health" style="width:100%;height:200px"';
const hNew = 'id="chart_elder_health" style="width:100%;height:340px"';
if (s.includes(hOld)) {
  s = s.replace(hOld, hNew);
  ok++; console.log('OK: 1-height 200→340');
} else { console.log('FAIL: 1-height'); }

// === 2. Replace entire chart config ===
const chartOld = `chartInstance.setOption({title:{text:'老人健康趋势（近7天）',textStyle:{color:'#6b7a8d',fontSize:11,fontWeight:400},left:0,top:-6},tooltip:{trigger:'axis',backgroundColor:'#ffffff',borderColor:'rgba(57,217,138,0.30)',textStyle:{color:'#1e293b',fontSize:10}},grid:{left:8,right:20,top:30,bottom:24},legend:{data:['心率','睡眠'],textStyle:{color:'#6b7a8d',fontSize:9},top:0,right:0},xAxis:{type:'category',data:['6/12','6/13','6/14','6/15','6/16','6/17','6/18'],axisLabel:{color:'#6b7a8d',fontSize:9}},yAxis:[{type:'value',name:'bpm',axisLabel:{color:'#6b7a8d',fontSize:9},splitLine:{lineStyle:{color:'rgba(14,165,233,0.06)'}}},{type:'value',name:'h',axisLabel:{color:'#6b7a8d',fontSize:9}}],series:[{name:'心率',type:'line',data:[72,75,70,78,88,95,88],yAxisIndex:0,smooth:true,lineStyle:{color:'#E74C3C',width:2},itemStyle:{color:'#E74C3C'}},{name:'睡眠',type:'bar',data:[6.5,6.2,5.8,5.5,4.2,5.1,5.0],yAxisIndex:1,barWidth:12,itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#28C7FA'},{offset:1,color:'rgba(139,92,246,.2)'}]),borderRadius:[3,3,0,0]}}]})`;

const chartNew = `chartInstance.setOption({title:{text:'近7天健康趋势',textStyle:{color:'#D0E4F5',fontSize:13,fontWeight:600},left:0,top:2},tooltip:{trigger:'axis',backgroundColor:'rgba(7,27,45,0.95)',borderColor:'rgba(14,165,233,0.20)',textStyle:{color:'#D0E4F5',fontSize:11},formatter:function(p){var r=p[0].axisValue;for(var i=0;i<p.length;i++){r+=p[i].marker+' '+p[i].seriesName+'：'+p[i].value+' '+(p[i].seriesName==='心率'?'bpm':'h')}return r}},grid:{left:42,right:48,top:38,bottom:28},legend:{data:['心率','睡眠时长'],textStyle:{color:'#6F91A8',fontSize:10},top:0,right:0,itemWidth:16,itemHeight:8},xAxis:{type:'category',data:['6/12','6/13','6/14','6/15','6/16','6/17','6/18'],axisLabel:{color:'#6F91A8',fontSize:10},axisTick:{show:false},axisLine:{lineStyle:{color:'rgba(14,165,233,0.10)'}}},yAxis:[{type:'value',name:'心率 (bpm)',nameTextStyle:{color:'#E74C3C',fontSize:10},min:60,max:100,interval:10,axisLabel:{color:'#E74C3C',fontSize:10},splitLine:{show:true,lineStyle:{color:'rgba(14,165,233,0.06)'}}},{type:'value',name:'睡眠 (h)',nameTextStyle:{color:'#28C7FA',fontSize:10},min:0,max:8,interval:2,axisLabel:{color:'#28C7FA',fontSize:10},splitLine:{show:false}}],series:[{name:'心率',type:'line',data:[72,75,70,78,88,95,88],yAxisIndex:0,smooth:true,symbol:'circle',symbolSize:5,lineStyle:{color:'#E74C3C',width:1.5},itemStyle:{color:'#E74C3C'},z:2},{name:'睡眠时长',type:'bar',data:[6.5,6.2,5.8,5.5,4.2,5.1,5.0],yAxisIndex:1,barWidth:16,barGap:'30%',itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(40,199,250,0.30)'},{offset:1,color:'rgba(40,199,250,0.06)'}]),borderRadius:[4,4,0,0],borderColor:'rgba(40,199,250,0.20)',borderWidth:1},z:1}]})`;

if (s.includes(chartOld)) {
  s = s.replace(chartOld, chartNew);
  ok++; console.log('OK: 2-chart config');
} else { console.log('FAIL: 2-chart config'); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== FINAL ===');
console.log('Changes:', ok, '/ 2');
console.log('Length:', s.length);
