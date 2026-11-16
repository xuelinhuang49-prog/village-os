<template>
<div class="pc" :class="{emb:embedded}">
<div class="kr"><div class="kc" v-for="k in kpis" :key="k.l"><div class="kv" :class="k.c">{{k.v}}</div><div class="kl">{{k.l}}</div></div></div>
<div class="mr"><div class="pn" style="flex:1.6"><div class="tt">🗺️ 风险分布</div>
<div class="hg"><div v-for="a in riskAreas" :key="a.n" class="ha" :class="'r'+a.r" @click="selA=a;selE=null"><div class="hn">{{a.n}}</div><div class="hc">{{a.c}}</div><div class="hd" :class="a.r"></div></div></div>
<div class="hl"><span class="ld"><span class="d g"></span>正常</span><span class="ld"><span class="d y"></span>关注</span><span class="ld"><span class="d o"></span>预警</span><span class="ld"><span class="d r"></span>高风险</span></div></div>
<div class="pn" style="flex:1"><div class="tt">{{selE?'📋 预警详情':'📋 点击事件查看'}}</div>
<template v-if="selE">
<div class="dn" :class="'c'+selE.r">{{selE.disease}}</div>
<div class="dg"><div class="di"><span class="dl">风险</span><span :class="'t '+selE.r">{{selE.rl}}</span></div><div class="di"><span class="dl">区域</span><span class="dv">{{selE.a}}</span></div><div class="di"><span class="dl">时间</span><span class="dv">{{selE.tm}}</span></div><div class="di"><span class="dl">AI</span><span class="dv gn">{{selE.ai}}%</span></div><div class="di"><span class="dl">数量</span><span class="dv">{{selE.ct}}</span></div><div class="di"><span class="dl">负责人</span><span class="dv">{{selE.hd}}</span></div><div class="di" style="grid-column:span 2"><span class="dl">症状</span><span class="dv">{{selE.sy}}</span></div><div class="di" style="grid-column:span 2"><span class="dl">防治建议</span><span class="dv">{{selE.so||'立即喷施专用药剂'}}</span></div></div>
<div class="pb"><div class="pf" :style="{width:(selE.stp/7*100)+'%'}"></div></div><div class="pt">处置 {{selE.stp}}/7</div>
<div class="pl"><div class="ps" :class="selE.stp>=1?'dn':''">发现</div><span class="pa">→</span><div class="ps" :class="selE.stp>=2?'dn':''">AI识别</div><span class="pa">→</span><div class="ps" :class="selE.stp>=3?'dn':''">预警</div><span class="pa">→</span><div class="ps" :class="selE.stp>=4?'dn':''">派单</div><span class="pa">→</span><div class="ps" :class="selE.stp>=5?'dn':''">处理</div><span class="pa">→</span><div class="ps" :class="selE.stp>=6?'dn':''">复核</div><span class="pa">→</span><div class="ps" :class="selE.stp>=7?'dn':''">关闭</div></div>
<div class="da"><button class="bp" @click="openTreat(selE)">🔧 处理</button><button class="bo" @click="openScheme(selE)">📄 方案</button><button class="bd" @click="closeEvt(selE)">✅ 关闭</button></div>
</template>
<div v-else style="text-align:center;padding:30px;color:#66788A;font-size:12px">点击事件卡片<br>查看详情</div></div></div>
<div class="mr"><div class="pn" style="flex:1.3"><div class="tt">🚨 预警事件 <span style="font-size:9px;color:#66788A;font-weight:400">{{events.length}}条</span></div>
<div class="el"><div v-for="e in events" :key="e.id" class="ec" :class="['r'+e.r,{sel:selE?.id===e.id}]" @click="selE=e"><div class="et"><span class="en">{{e.disease}}</span><span :class="'t '+e.r">{{e.rl}}</span></div><div class="ea">{{e.a}}</div><div class="ed">{{e.sy}}</div><div class="em"><span>🕐 {{e.tm}}</span><span>🤖 AI {{e.ai}}%</span><span :class="'t '+(e.st==='处理中'?'y':'g')">{{e.st}}</span></div></div></div></div>
<div class="pn" style="flex:0.8"><div class="tt">📈 近30天趋势</div><div id="ct" style="height:160px"></div><div class="tt" style="margin-top:8px">🍩 病害占比</div><div id="cp" style="height:160px"></div></div></div>
<div class="pn"><div class="tt">📋 全部预警记录</div>
<div class="fb"><select v-model="fr" class="fs"><option value="">全部等级</option><option value="high">高风险</option><option value="mid">中风险</option><option value="low">低风险</option></select><select v-model="fst" class="fs"><option value="">全部状态</option><option value="处理中">处理中</option><option value="已处理">已处理</option></select><span style="flex:1"></span><button class="bp bps" @click="openAi">🤖 AI预警</button><button class="bo bps" @click="doExport">📤 导出</button></div>
<table class="tb"><thead><tr><th>病害</th><th>等级</th><th>区域</th><th>时间</th><th>AI</th><th>负责人</th><th>状态</th><th>操作</th></tr></thead><tbody><tr v-for="e in filtered" :key="e.id" :class="{hl:selE?.id===e.id}"><td style="font-weight:600;color:#1F2D3D">{{e.disease}}</td><td><span :class="'t '+e.r">{{e.rl}}</span></td><td>{{e.a}}</td><td>{{e.tm}}</td><td>{{e.ai}}%</td><td>{{e.hd}}</td><td><span :class="'t '+(e.st==='处理中'?'y':'g')">{{e.st}}</span></td><td><button class="bp bps" @click="selE=e">查看</button><button class="bo bps" @click="openTreat(e)">处理</button><button class="bo bps" @click="openScheme(e)">方案</button><button class="bd bps" @click="closeEvt(e)">关闭</button></td></tr></tbody></table></div>
<div class="mr"><div class="pn" style="flex:1"><div class="tt">🏆 高发区域</div><div v-for="(a,i) in areaRank" :key="a.n" class="ri"><span class="rn">{{i+1}}</span><span>{{a.n}}</span><span class="rc">{{a.c}}次</span></div></div><div class="pn" style="flex:1"><div class="tt">🦠 高发病种</div><div v-for="(d,i) in diseaseRank" :key="d.n" class="ri"><span class="rn">{{i+1}}</span><span>{{d.n}}</span><span class="rc">{{d.c}}次</span></div></div><div class="pn" style="flex:1"><div class="tt">🔮 AI预测</div><div v-for="p in preds" :key="p.d" class="pi"><div class="pn2">{{p.d}} <span :class="'t '+p.r">{{p.rl}}</span></div><div class="pinf">↑{{p.p}}% · {{p.c}}</div><div class="padv">💡 {{p.ad}}</div></div></div></div>

<div class="mo" :class="{on:aiMod}" @click="aiMod=false"><div class="mb" @click.stop><div class="mh">🤖 AI智能预警分析<button class="mc" @click="aiMod=false">✕</button></div>
<div class="fl"><label>上传图片</label><div class="uz" @click="openPicker"><input type="file" ref="afi" accept="image/*" style="display:none" @change="onFile">{{aiImg?aiImg.name:'📷 点击上传图片'}}<img v-if="aipv" :src="aipv" class="upv"></div></div>
<div class="fl"><label>区域</label><select v-model="aiFm.a" class="fin"><option v-for="a in riskAreas" :key="a.n" :value="a.n">{{a.n}}</option></select></div>
<div class="fl"><label>描述</label><textarea v-model="aiFm.d" class="fin" placeholder="描述异常情况..." style="height:50px"></textarea></div>
<div v-if="aiRs" class="arb"><div class="ad2">{{aiRs.d}}</div><div class="ab"><div class="af2" :style="{width:aiRs.c+'%'}"></div></div><div style="font-size:11px;color:#475867;margin-bottom:3px">置信度：<b style="color:#22B573">{{aiRs.c}}%</b></div><div style="font-size:9px;color:#F2A62B">⏱ {{aiRs.s}}</div><div v-if="aiRs.sol" style="font-size:11px;color:#22B573;margin-top:6px">💊 {{aiRs.sol}}</div></div>
<div class="ma"><button class="bp" @click="doAi" :disabled="aiLoading">{{aiLoading?'分析中...':'🔍 开始分析'}}</button><button class="bp" v-if="aiRs" @click="doNew">🚨 生成预警</button><button class="bo" @click="aiMod=false">取消</button></div></div></div>

<div class="mo" :class="{on:trMod}" @click="trMod=false"><div class="mb" @click.stop><div class="mh">🔧 处理预警<button class="mc" @click="trMod=false">✕</button></div>
<div class="fl"><label>处理人员</label><input v-model="trFm.p" class="fin"></div><div class="fr2"><div class="fl"><label>时间</label><input v-model="trFm.tm" class="fin"></div><div class="fl"><label>药剂</label><input v-model="trFm.ag" class="fin"></div></div>
<div class="fl"><label>措施</label><textarea v-model="trFm.m" class="fin" placeholder="描述处理措施..." style="height:50px"></textarea></div>
<div class="fl"><label>现场图片</label><div class="uz">📸 点击上传现场照片</div></div>
<div class="ma"><button class="bp" @click="doTreat">✅ 确认处理</button><button class="bo" @click="trMod=false">取消</button></div></div></div>

<div class="dov" :class="{on:scOp}" @click="scOp=false"></div>
<div class="dw" :class="{on:scOp}"><div class="dwh"><h3>📄 防治方案 — {{scDt?.disease||''}}</h3><button class="mc" @click="scOp=false">✕</button></div>
<div class="dwb" v-if="scDt"><div class="dg2"><span class="dl2">病害</span><div style="color:#1F2D3D;font-weight:600">{{scDt.disease}}</div></div><div class="dg2"><span class="dl2">推荐药剂</span><div>稻瘟灵25%EC / 三环唑75%WP</div></div><div class="dg2"><span class="dl2">用量</span><div>每亩50ml，兑水30L</div></div><div class="dg2"><span class="dl2">方法</span><div>叶面喷雾，重点喷施病斑部位</div></div><div class="dg2"><span class="dl2">注意事项</span><div>1.避免高温施药<br>2.间隔7天重复<br>3.注意人畜安全<br>4.药后24h不浇水</div></div><div class="dg2"><span class="dl2">复查时间</span><div style="color:#22B573">2026-07-24</div></div></div></div>

<div class="ta"><div v-for="t in toasts" :key="t.id" :class="'to '+t.type">{{t.msg}}</div></div>
</div>
</template>

<script setup>
import {ref,reactive,computed,onMounted,nextTick} from 'vue'
import * as echarts from 'echarts'

const props=defineProps({embedded:Boolean})
const toasts=reactive([])
function toast(m,t='info'){const id=Date.now();toasts.push({id,msg:m,type:t});setTimeout(()=>{const i=toasts.findIndex(x=>x.id===id);if(i>=0)toasts.splice(i,1)},2300)}

const kpis=reactive([{l:'活跃预警',v:8,c:'red'},{l:'今日新增',v:3,c:'yellow'},{l:'高风险',v:4,c:'red'},{l:'已处理',v:52,c:'green'},{l:'平均处理',v:'1h15m',c:''}])
const riskAreas=reactive([{n:'苹果园区A区',c:'红富士苹果',r:'high'},{n:'苹果园区B区',c:'红富士苹果',r:'mid'},{n:'蔬菜大棚区',c:'番茄/黄瓜',r:'low'},{n:'蜂糖李基地',c:'蜂糖李',r:'low'},{n:'油葵种植区',c:'油葵',r:'mid'},{n:'葡萄园',c:'阳光玫瑰',r:'high'},{n:'养猪场A区',c:'生猪',r:'high'},{n:'养鸡场1号',c:'蛋鸡',r:'mid'},{n:'养牛场',c:'肉牛',r:'low'},{n:'荷虾混养区',c:'荷花/龙虾',r:'low'}])
const selA=ref(null)

const events=reactive([{id:1,disease:'猪呼吸道综合征',r:'high',rl:'高风险',a:'养猪场A区',tm:'2026-07-17 09:30',ct:'52头',ai:95,hd:'张三',st:'处理中',so:'加强通风+VC+抗生素',stp:4,sy:'部分猪只咳嗽，采食量下降5%'},{id:2,disease:'稻瘟病',r:'high',rl:'高风险',a:'苹果园区东区',tm:'2026-07-17 08:15',ct:'15亩',ai:98,hd:'李四',st:'处理中',so:'稻瘟灵25%EC',stp:3,sy:'叶片出现褐色病斑，边缘发黄'},{id:3,disease:'球虫病',r:'mid',rl:'中风险',a:'养鸡场1号',tm:'2026-07-16 16:05',ct:'200只',ai:88,hd:'王五',st:'已处理',so:'饲料中添加抗球虫药',stp:7,sy:'粪便异常，精神不振'},{id:4,disease:'蚜虫灾害',r:'mid',rl:'中风险',a:'苹果园区B区',tm:'2026-07-16 14:20',ct:'30亩',ai:82,hd:'赵六',st:'已处理',so:'瓢虫+吡虫啉',stp:7,sy:'嫩叶卷曲可见蚜虫'},{id:5,disease:'霜霉病',r:'low',rl:'低风险',a:'蔬菜大棚区',tm:'2026-07-15 11:00',ct:'8亩',ai:76,hd:'陈七',st:'已处理',so:'通风降湿+霜脲氰',stp:7,sy:'叶片背面白色霜状霉层'}])
const selE=ref(null)
const fr=ref(''),fst=ref('')
const filtered=computed(()=>{let l=events;if(fr.value)l=l.filter(e=>e.r===fr.value);if(fst.value)l=l.filter(e=>e.st===fst.value);return l})
function closeEvt(e){e.stp=7;e.st='已处理';kpis[3].val++;kpis[0].val--;toast('已关闭','ok')}

const areaRank=[{n:'苹果园区A区',c:12},{n:'养猪场A区',c:9},{n:'葡萄园',c:6},{n:'蔬菜大棚区',c:3},{n:'养鸡场1号',c:2}]
const diseaseRank=[{n:'稻瘟病',c:15},{n:'猪呼吸道综合征',c:9},{n:'蚜虫',c:7},{n:'球虫病',c:5},{n:'霜霉病',c:3}]
const preds=reactive([{d:'稻瘟病',r:'high',rl:'高风险',p:83,c:'未来72h高温高湿',ad:'提前喷施三环唑预防'},{d:'猪呼吸道综合征',r:'mid',rl:'关注',p:45,c:'气温骤降+通风不足',ad:'加强通风补充VC'},{d:'蚜虫',r:'mid',rl:'关注',p:38,c:'持续干旱+天敌减少',ad:'释放瓢虫或吡虫啉'}])

const aiMod=ref(false),aiFm=reactive({a:'苹果园区A区',d:''}),aiRs=ref(null),aiImg=ref(null),aipv=ref(null),afi=ref(null)
function openAi(){aiRs.value=null;aiFm.d='';aiImg.value=null;aipv.value=null;aiMod.value=true}
function openPicker(){afi.value?.click()}
function onFile(e){const f=e.target.files[0];if(!f)return;aiImg.value=f;aipv.value=URL.createObjectURL(f);toast('已选择：'+f.name,'ok')}
const aiLoading=ref(false)
async function doAi(){
  if(!aiFm.d){toast('请先输入症状描述','warn');return}
  aiLoading.value=true
  try{
    const resp=await fetch('/deepseek/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer sk-22f075be9f3a451fac87d5ff0d75b2d2'},
      body:JSON.stringify({
        model:'deepseek-chat',
        messages:[
          {role:'system',content:'你是农作物病虫害诊断专家。根据症状描述，用JSON格式回复：{"disease":"病害名称","confidence":置信度数字(0-100),"spread":"预计扩散情况","solution":"防治建议"}'},
          {role:'user',content:'区域：'+aiFm.a+'。症状描述：'+aiFm.d}
        ],
        temperature:0.3
      })
    })
    const data=await resp.json()
    const text=data.choices?.[0]?.message?.content||''
    const jsonMatch=text.match(/\{[\s\S]*\}/)
    if(jsonMatch){
      const result=JSON.parse(jsonMatch[0])
      aiRs.value={d:result.disease||'未知病害',c:result.confidence||80,s:result.spread||'待评估',sol:result.solution||''}
    }else{
      aiRs.value={d:'分析结果',c:85,s:'请查看详细分析',sol:text}
    }
    toast('AI分析完成','ok')
  }catch(e){
    toast('API调用失败: '+e.message,'warn')
  }finally{
    aiLoading.value=false
  }
}
function doNew(){events.unshift({id:Date.now(),disease:aiRs.value.d,r:'high',rl:'高风险',a:aiFm.a,tm:new Date().toLocaleString(),ct:'待确认',ai:aiRs.value.c,hd:'待派单',st:'处理中',so:aiRs.value.d+'防治',stp:3,sy:aiFm.d||'AI识别触发'});kpis[0].val++;kpis[1].val++;aiMod.value=false;toast('预警已生成','ok')}

const trMod=ref(false),trFm=reactive({p:'',tm:new Date().toISOString().split('T')[0],ag:'',m:''}),trTg=ref(null)
function openTreat(e){trTg.value=e;trFm.p=e.hd;trFm.ag='';trFm.m='';trMod.value=true}
function doTreat(){if(trTg.value){trTg.value.stp=Math.max(trTg.value.stp,5);if(trFm.p)trTg.value.hd=trFm.p;toast('处理已提交','ok')};trMod.value=false}

const scOp=ref(false),scDt=ref(null)
function openScheme(e){scDt.value=e;scOp.value=true}

function doExport(){const csv='病害,风险,区域,时间,AI,负责人,状态\n'+events.map(e=>[e.disease,e.rl,e.a,e.tm,e.ai+'%',e.hd,e.st].join(',')).join('\n');const b=new Blob(['﻿'+csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='预警记录.csv';a.click();toast('已导出','ok')}

function initC(){
  const ct=document.getElementById('ct')
  if(ct){
    const c=echarts.init(ct)
    const d=[2,3,5,1,4,2,6,3,5,2,4,3,5,1,4,2,3,5,2,4,3,5,1,3,2,4,1,5,3,2]
    const grad=new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(224,82,82,.25)'},{offset:1,color:'rgba(224,82,82,.02)'}])
    c.setOption({
      tooltip:{trigger:'axis',backgroundColor:'#FFFFFF',borderColor:'#D0D8E2',textStyle:{color:'#1F2D3D',fontSize:10}},
      grid:{left:8,right:16,top:8,bottom:20},
      xAxis:{type:'category',data:Array.from({length:30},(_,i)=>String(i+1)),axisLabel:{color:'#66788A',fontSize:7}},
      yAxis:{type:'value',axisLabel:{color:'#66788A',fontSize:9},splitLine:{lineStyle:{color:'rgba(14,165,233,0.06)'}}},
      series:[{type:'line',data:d,smooth:true,lineStyle:{color:'#E05252',width:2},itemStyle:{color:'#E05252'},symbol:'none',areaStyle:{color:grad}}]
    })
  }
  const cp=document.getElementById('cp')
  if(cp){
    const c=echarts.init(cp)
    c.setOption({
      tooltip:{trigger:'item',backgroundColor:'#FFFFFF',borderColor:'#D0D8E2',textStyle:{color:'#1F2D3D',fontSize:10}},
      series:[{type:'pie',radius:['55%','78%'],center:['50%','52%'],itemStyle:{borderColor:'#FFFFFF',borderWidth:2},label:{color:'#66788A',fontSize:9},
        data:[
          {value:15,name:'稻瘟病',itemStyle:{color:'#E05252'}},
          {value:9,name:'猪呼吸道',itemStyle:{color:'#F2A62B'}},
          {value:7,name:'蚜虫',itemStyle:{color:'#0EA5E9'}},
          {value:5,name:'球虫病',itemStyle:{color:'#22B573'}},
          {value:3,name:'霜霉病',itemStyle:{color:'#8B5CF6'}}
        ]}]
    })
  }
}
onMounted(()=>{nextTick(()=>initC())})
</script>

<style scoped>
.pc{min-height:100vh;padding:18px 20px;background:#F5F7FA;color:#1F2D3D;font-size:12px}.pc.emb{min-height:auto;padding:0;background:transparent}
.kr{display:flex;gap:8px;margin-bottom:10px}.kc{flex:1;min-width:90px;height:80px;background:#FFFFFF;border:1px solid #E3EAF0;border-radius:10px;padding:8px;text-align:center;display:flex;flex-direction:column;justify-content:center}.kv{font-size:22px;font-weight:700;font-family:monospace}.kv.red{color:#E05252}.kv.green{color:#22B573}.kv.yellow{color:#F2A62B}.kl{font-size:9px;color:#66788A;margin-top:2px}
.pn{background:#FFFFFF;border:1px solid #E3EAF0;border-radius:10px;padding:10px 14px;margin-bottom:8px}.tt{font-size:12px;font-weight:700;color:#1F2D3D;margin-bottom:8px;display:flex;align-items:center;gap:6px}.tt::before{content:'';width:3px;height:11px;border-radius:2px;background:#22B573;flex-shrink:0}
.mr{display:flex;gap:8px;margin-bottom:8px}
.hg{display:grid;grid-template-columns:repeat(5,1fr);gap:5px}.ha{padding:8px 5px;border-radius:7px;text-align:center;cursor:pointer;background:#F8FAFB;border:2px solid transparent;transition:.2s}.ha:hover{transform:translateY(-1px)}.ha.rhigh{border-color:#E05252;box-shadow:0 0 8px rgba(224,82,82,.12)}.ha.rmid{border-color:#F2A62B}.hn{font-size:9px;font-weight:600;color:#1F2D3D}.hc{font-size:7px;color:#66788A;margin-top:1px}.hd{width:5px;height:5px;border-radius:50%;margin:4px auto 0}.hd.low{background:#22B573}.hd.mid{background:#F2A62B}.hd.high{background:#E05252}.hl{display:flex;gap:12px;justify-content:center;margin-top:6px;font-size:8px;color:#66788A}.ld{display:flex;align-items:center;gap:3px}.d{width:6px;height:6px;border-radius:50%}.d.g{background:#22B573}.d.y{background:#F2A62B}.d.o{background:#F2A62B}.d.r{background:#E05252}
.dn{font-size:14px;font-weight:700;margin-bottom:6px}.dn.chigh{color:#E05252}.dn.cmid{color:#F2A62B}.dn.clow{color:#22B573}
.dg{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:8px}.di{background:#F8FAFB;padding:6px 8px;border-radius:6px}.dl{display:block;font-size:8px;color:#66788A;margin-bottom:1px}.dv{font-size:11px;color:#1F2D3D;font-weight:500}.dv.gn{color:#22B573;font-weight:700}
.pb{height:3px;background:#E3EAF0;border-radius:2px;margin-bottom:3px}.pf{height:100%;background:#22B573;border-radius:2px;transition:width .5s}.pt{font-size:8px;color:#66788A;text-align:right;margin-bottom:8px}
.pl{display:flex;align-items:center;gap:1px;font-size:8px;margin-bottom:8px}.ps{padding:2px 5px;border-radius:8px;background:#E3EAF0;color:#66788A}.ps.dn{background:rgba(34,181,115,.15);color:#22B573}.pa{color:#66788A;font-size:7px}
.el{display:flex;flex-direction:column;gap:5px;max-height:280px;overflow-y:auto}.ec{background:#F8FAFB;padding:8px 10px;border-radius:7px;border-left:3px solid transparent;cursor:pointer}.ec:hover,.ec.sel{background:rgba(14,165,233,.08)}.ec.rhigh{border-left-color:#E05252}.ec.rmid{border-left-color:#F2A62B}.et{display:flex;align-items:center;gap:6px;margin-bottom:2px}.en{font-weight:600;color:#1F2D3D;font-size:11px;flex:1}.ea{font-size:9px;color:#22B573}.ed{font-size:8px;color:#66788A;margin:2px 0}.em{display:flex;align-items:center;gap:8px;font-size:8px;color:#66788A}
.fb{display:flex;gap:6px;margin-bottom:8px;align-items:center;flex-wrap:wrap}.fs{background:#FFFFFF;border:1px solid #E3EAF0;color:#475867;border-radius:6px;padding:4px 8px;font-size:10px}
.tb{width:100%;border-collapse:collapse}.tb th,.tb td{padding:7px 9px;text-align:left;font-size:10px}.tb th{background:#F8FAFB;color:#66788A;border-bottom:2px solid #E3EAF0;font-size:9px}.tb td{border-bottom:1px solid #EBEFF4}.tb tr.hl td{background:#EBEFF4}
.t{display:inline-block;padding:2px 6px;border-radius:9px;font-size:9px;font-weight:600}.t.high{background:rgba(224,82,82,.10);color:#E05252}.t.mid{background:rgba(242,166,43,.12);color:#F2A62B}.t.low,.t.g{background:rgba(34,181,115,.12);color:#22B573}.t.y{background:rgba(242,166,43,.12);color:#F2A62B}
.ri{display:flex;align-items:center;padding:5px 0;border-bottom:1px solid #EBEFF4;font-size:10px}.rn{width:18px;text-align:center;font-weight:700;color:#22B573;font-family:monospace}.rc{margin-left:auto;color:#66788A;font-family:monospace}
.pi{padding:6px 0;border-bottom:1px solid #EBEFF4}.pn2{font-size:11px;font-weight:600;color:#1F2D3D;margin-bottom:2px;display:flex;align-items:center;gap:5px}.pinf{font-size:9px;color:#F2A62B}.padv{font-size:8px;color:#22B573;margin-top:1px}
.mo{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:.25s}.mo.on{opacity:1;pointer-events:auto}.mb{background:#FFFFFF;border:1px solid rgba(34,181,115,.15);border-radius:12px;padding:20px 24px;width:520px;max-width:90vw;max-height:85vh;overflow-y:auto}.mh{font-size:15px;font-weight:700;color:#1F2D3D;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center}.mc{width:26px;height:26px;border-radius:50%;background:#F0F3F8;border:1px solid #E3EAF0;color:#475867;cursor:pointer;font-size:13px}.fl{margin-bottom:10px}.fl label{display:block;font-size:10px;color:#66788A;margin-bottom:3px}.fin{width:100%;padding:8px;border-radius:8px;background:#FFFFFF;border:1px solid #E3EAF0;color:#475867;outline:none;font-family:inherit;font-size:12px;box-sizing:border-box}.fr2{display:flex;gap:8px}.fr2 .fl{flex:1}.uz{padding:20px;border:2px dashed rgba(34,181,115,.15);border-radius:8px;text-align:center;color:#66788A;cursor:pointer;font-size:12px}.upv{max-width:100%;max-height:150px;margin-top:8px;border-radius:8px;display:block}.arb{background:#F8FAFB;padding:12px;border-radius:8px;margin:12px 0}.ad2{font-size:14px;font-weight:700;color:#E05252;margin-bottom:6px}.ab{height:5px;background:#E3EAF0;border-radius:3px;overflow:hidden;margin-bottom:5px}.af2{height:100%;background:linear-gradient(90deg,#22B573,#22B573);border-radius:3px;transition:width 1s}.ma{display:flex;gap:6px;margin-top:14px}
.dov{position:fixed;inset:0;z-index:180;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:.3s}.dov.on{opacity:1;pointer-events:auto}.dw{position:fixed;top:0;right:0;bottom:0;width:420px;z-index:190;background:#FFFFFF;border-left:1px solid #E3EAF0;transform:translateX(100%);transition:.3s;display:flex;flex-direction:column}.dw.on{transform:translateX(0)}.dwh{padding:14px 16px;border-bottom:1px solid #E3EAF0;display:flex;justify-content:space-between;align-items:center}.dwh h3{font-size:14px;color:#1F2D3D}.dwb{flex:1;overflow-y:auto;padding:14px}.dg2{background:#F8FAFB;padding:10px;border-radius:8px;margin-bottom:8px}.dl2{display:block;font-size:9px;color:#22B573;margin-bottom:3px}.dg2 div:last-child{font-size:11px;color:#475867;line-height:1.5}
.bp{background:linear-gradient(135deg,#22B573,#22B573);color:#1F2D3D}.bo{background:transparent;border:1px solid #D0D8E2;color:#22B573}.bd{background:rgba(224,82,82,.10);border:1px solid rgba(224,82,82,.25);color:#E05252}.bp,.bo,.bd{padding:5px 10px;border-radius:7px;font-size:9px;font-weight:600;cursor:pointer;font-family:inherit}.bps{padding:3px 6px;font-size:8px}.da{display:flex;gap:5px}
.ta{position:fixed;top:16px;right:16px;z-index:999;display:flex;flex-direction:column;gap:6px;pointer-events:none}.to{padding:8px 14px;border-radius:6px;font-size:11px;font-weight:600;color:#1F2D3D;animation:ti .3s,to .3s 2s forwards}.to.ok{background:linear-gradient(135deg,#22B573,#22B573)}.to.info{background:linear-gradient(135deg,#22B573,#22B573)}.to.warn{background:linear-gradient(135deg,#E0941F,#F2A62B)}@keyframes ti{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes to{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}
</style>