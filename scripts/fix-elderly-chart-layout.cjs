// Fix elderly chart: legend in title row, grid spacing, narrower bars
const fs = require('fs');
const path = require('path');
const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0;

// === 1. Template: add legend inline next to title ===
const tplOld = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div style="font-size:14px;font-weight:600;color:#D0E4F5">{{ selectedChartElderName }} · 近7天健康趋势</div>
            <select v-model="selectedChartElderId" @change="onChartElderSwitch" style="background:rgba(10,36,68,0.55);border:1px solid rgba(40,199,250,0.15);color:#D0E4F5;padding:4px 10px;border-radius:4px;font-size:11px;font-family:inherit;cursor:pointer;outline:none">
              <option v-for="e in elderly" :key="e.id" :value="e.id">{{ e.name }}（{{ e.relation }}）</option>
            </select>
          </div>`;

const tplNew = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
            <div style="display:flex;align-items:center;gap:14px">
              <span style="font-size:14px;font-weight:600;color:#D0E4F5">{{ selectedChartElderName }} · 近7天健康趋势</span>
              <span style="display:flex;align-items:center;gap:4px;font-size:10px;color:#E74C3C;white-space:nowrap"><span style="display:inline-block;width:14px;height:2px;background:#E74C3C;border-radius:1px"></span>心率</span>
              <span style="display:flex;align-items:center;gap:4px;font-size:10px;color:#28C7FA;white-space:nowrap"><span style="display:inline-block;width:10px;height:10px;background:rgba(40,199,250,0.30);border:1px solid rgba(40,199,250,0.20);border-radius:2px"></span>睡眠时长</span>
            </div>
            <select v-model="selectedChartElderId" @change="onChartElderSwitch" style="background:rgba(10,36,68,0.55);border:1px solid rgba(40,199,250,0.15);color:#D0E4F5;padding:4px 10px;border-radius:4px;font-size:11px;font-family:inherit;cursor:pointer;outline:none">
              <option v-for="e in elderly" :key="e.id" :value="e.id">{{ e.name }}（{{ e.relation }}）</option>
            </select>
          </div>`;

if (s.includes(tplOld)) { s = s.replace(tplOld, tplNew); ok++; console.log('OK: 1-template'); }
else { console.log('FAIL: 1-template'); }

// === 2. ECharts: remove legend, increase grid.top, narrower+transparent bars ===
const chartOld = `chartInstance.setOption({tooltip:{trigger:'axis',backgroundColor:'rgba(7,27,45,0.95)',borderColor:'rgba(14,165,233,0.20)',textStyle:{color:'#D0E4F5',fontSize:11},formatter:function(p){var r=p[0].axisValue;for(var i=0;i<p.length;i++){r+=p[i].marker+' '+p[i].seriesName+'：'+p[i].value+' '+(p[i].seriesName==='心率'?'bpm':'h')}return r}},grid:{left:56,right:52,top:6,bottom:28},legend:{data:['心率','睡眠时长'],textStyle:{color:'#6F91A8',fontSize:10},top:0,left:8,itemWidth:16,itemHeight:8},`;

const chartNew = `chartInstance.setOption({tooltip:{trigger:'axis',backgroundColor:'rgba(7,27,45,0.95)',borderColor:'rgba(14,165,233,0.20)',textStyle:{color:'#D0E4F5',fontSize:11},formatter:function(p){var r=p[0].axisValue;for(var i=0;i<p.length;i++){r+=p[i].marker+' '+p[i].seriesName+'：'+p[i].value+' '+(p[i].seriesName==='心率'?'bpm':'h')}return r}},grid:{left:56,right:52,top:22,bottom:28},`;

if (s.includes(chartOld)) { s = s.replace(chartOld, chartNew); ok++; console.log('OK: 2-legend+grid'); }
else { console.log('FAIL: 2-legend+grid'); }

// === 3. Narrower bars, more transparent ===
const barOld = `barWidth:16,barGap:'30%',itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(40,199,250,0.50)'},{offset:1,color:'rgba(40,199,250,0.12)'}]),borderRadius:[4,4,0,0],borderColor:'rgba(40,199,250,0.30)',borderWidth:1},z:1}]})`;
const barNew = `barWidth:12,barGap:'40%',itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(40,199,250,0.35)'},{offset:1,color:'rgba(40,199,250,0.06)'}]),borderRadius:[3,3,0,0],borderColor:'rgba(40,199,250,0.18)',borderWidth:1},z:1}]})`;

if (s.includes(barOld)) { s = s.replace(barOld, barNew); ok++; console.log('OK: 3-bar'); }
else { console.log('FAIL: 3-bar'); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== FINAL ===');
console.log('Changes:', ok, '/ 3');
console.log('Length:', s.length);
