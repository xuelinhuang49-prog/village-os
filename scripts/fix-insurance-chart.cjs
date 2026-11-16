// Fix insurance chart: proper Y-axis intervals, responsive bar width
const fs = require('fs');
const path = require('path');
const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0;

// Find the exact chart config line
const anchor = 'function initInsTrendChart(){';
const idx = s.indexOf(anchor);
if (idx < 0) { console.log('FAIL: anchor not found'); process.exit(1); }

// Find the chartInstance.setOption call
const optStart = s.indexOf('chartInstance.setOption({', idx);
const optEnd = s.indexOf('})', optStart) + 2;

const oldOpt = s.substring(optStart, optEnd);
console.log('Old config length:', oldOpt.length);

// Build new config
const newOpt = "chartInstance.setOption({title:{text:'近6个月医保报销趋势',textStyle:{color:'#D0E4F5',fontSize:13,fontWeight:600},left:0,top:2},tooltip:{trigger:'axis',backgroundColor:'rgba(7,27,45,0.95)',borderColor:'rgba(14,165,233,0.20)',textStyle:{color:'#D0E4F5',fontSize:11},formatter:function(p){return p[0].axisValue+'<br/>'+p[0].marker+' 报销金额：\\u00a5'+p[0].value.toLocaleString()}},grid:{left:70,right:24,top:40,bottom:30},xAxis:{type:'category',boundaryGap:true,data:['1月','2月','3月','4月','5月','6月'],axisLabel:{color:'#6F91A8',fontSize:10},axisTick:{show:false},axisLine:{lineStyle:{color:'rgba(14,165,233,0.10)'}}},yAxis:{type:'value',name:'金额（元）',nameTextStyle:{color:'#6F91A8',fontSize:10},min:0,max:2000,interval:500,axisLabel:{color:'#6F91A8',fontSize:10,formatter:function(v){return '\\u00a5'+v}},splitLine:{lineStyle:{color:'rgba(14,165,233,0.06)'}}},series:[{name:'医保报销',type:'bar',data:[180,0,320,860,125,1250],barWidth:'40%',barMaxWidth:60,itemStyle:{borderRadius:[4,4,0,0],color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#28C7FA'},{offset:1,color:'rgba(40,199,250,0.15)'}])}}]})";

s = s.substring(0, optStart) + newOpt + s.substring(optEnd);
fs.writeFileSync(fp, s, 'utf-8');
console.log('OK: insurance chart replaced');
console.log('New length:', s.length);
