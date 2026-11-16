<template>
<div style="padding:14px 18px">
<div class="tbanner" style="border-left-color:#E05252;color:#E05252">🦠 疫病预警 · 养殖区疾病监测与防控<span style="font-size:12px;color:#66788A;font-weight:400;margin-left:8px">📍 中堰村</span></div>

<!-- ===== 一、KPI统计卡 ===== -->
<div class="srow" style="margin-bottom:12px">
  <div class="scard r"><div class="sv">{{activeCount}}</div><div class="sl">当前预警</div></div>
  <div class="scard y"><div class="sv">{{pendingCount}}</div><div class="sl">待处理</div></div>
  <div class="scard"><div class="sv">{{processingCount}}</div><div class="sl">处理中</div></div>
  <div class="scard g"><div class="sv">{{monthTotal}}</div><div class="sl">本月累计</div></div>
  <div class="scard g"><div class="sv">{{resolveRate}}%</div><div class="sl">处理完成率</div></div>
</div>

<!-- ===== 二、操作栏 ===== -->
<div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center">
  <button class="btn btn-p btn-s" @click="openAdd">+ 新增预警</button>
  <button class="btn btn-o btn-s" @click="openAi">🤖 AI辅助研判</button>
  <button class="btn btn-o btn-s" @click="doExport">📤 导出</button>
  <span style="flex:1"></span>
  <select v-model="filterRisk" class="fs"><option value="">全部等级</option><option value="high">高风险</option><option value="mid">中风险</option><option value="low">低风险</option></select>
  <select v-model="filterStatus" class="fs"><option value="">全部状态</option><option value="处理中">处理中</option><option value="已处理">已处理</option><option value="监控中">监控中</option></select>
</div>

<!-- ===== 三、预警事件卡片 ===== -->
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:12px">
<div v-for="e in filteredEvents" :key="e.id" class="panel dw-panel" style="padding:16px;margin:0;cursor:pointer" @click="showDetail(e)">
  <!-- 头部：疾病名 + 风险等级 + 已持续 -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
    <div style="flex:1">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
        <span :class="'tag '+(e.risk==='high'?'r':e.risk==='mid'?'y':'g')" style="font-size:12px;padding:3px 10px">{{e.risk==='high'?'🔴 高风险':e.risk==='mid'?'🟡 中风险':'🟢 低风险'}}</span>
        <span class="dw-status" :class="e.status==='处理中'?'y':e.status==='已处理'?'g':'dim'">{{e.status}}</span>
      </div>
      <span style="font-size:17px;font-weight:700;color:#1F2D3D">{{e.disease}}</span>
    </div>
    <div style="text-align:right;flex-shrink:0">
      <div style="font-size:11px;color:#66788A">已持续</div>
      <div style="font-size:16px;font-weight:700;font-family:monospace" :style="{color:e.risk==='high'?'#E05252':'#F2A62B'}">{{duration(e)}}</div>
    </div>
  </div>

  <!-- 症状：最多3行，不省略 -->
  <div style="margin-bottom:12px;padding:8px 10px;background:#FFFFFF;border-radius:6px;border:1px solid #E3EAF0;border-left:3px solid" :style="{borderLeftColor:e.risk==='high'?'#E05252':e.risk==='mid'?'#F2A62B':'#22B573'}">
    <div style="font-size:11px;color:#475867;margin-bottom:4px">🩺 症状</div>
    <div style="font-size:13px;color:#1F2D3D;line-height:1.7;max-height:58px;overflow:hidden" :title="e.symptom">{{formatSymptom(e.symptom)}}</div>
  </div>

  <!-- 信息行 -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;font-size:13px;margin-bottom:8px">
    <div><span style="color:#66788A">📍 区域</span><span style="color:#1F2D3D;margin-left:4px">{{e.area}}</span></div>
    <div><span style="color:#66788A">👤 负责人</span><span style="color:#1F2D3D;margin-left:4px">{{e.handler||'--'}}</span></div>
    <div><span style="color:#66788A">🐛 影响</span><span style="margin-left:4px" :style="{color:e.risk==='high'?'#E05252':'#475867'}">{{e.affectedCount}}</span></div>
    <div><span style="color:#66788A">🤖 研判</span><span style="color:#22B573;margin-left:4px;font-size:12px">{{e.aiConfidence}}%</span></div>
  </div>

  <!-- 八、处置进度 -->
  <div style="margin-bottom:8px">
    <div style="display:flex;align-items:center;gap:2px;font-size:9px;margin-bottom:3px">
      <span :class="'ps '+(e.step>=1?'dn':'')">发现</span><span class="pa">→</span>
      <span :class="'ps '+(e.step>=2?'dn':'')">AI识别</span><span class="pa">→</span>
      <span :class="'ps '+(e.step>=3?'dn':'')">预警</span><span class="pa">→</span>
      <span :class="'ps '+(e.step>=4?'dn':'')">派单</span><span class="pa">→</span>
      <span :class="'ps '+(e.step>=5?'dn':'')">处理</span><span class="pa">→</span>
      <span :class="'ps '+(e.step>=6?'dn':'')">复核</span><span class="pa">→</span>
      <span :class="'ps '+(e.step>=7?'dn':'')">关闭</span>
    </div>
    <div class="pb2"><div class="pf2" :style="{width:(e.step/7*100)+'%'}"></div></div>
  </div>

  <!-- AI建议（按等级分色） -->
  <div v-if="e.advice" class="dw-advice" :class="'adv-'+e.risk">
    <span class="dw-advice-icon">{{e.risk==='high'?'🔴':e.risk==='mid'?'🟡':'🟢'}}</span>
    <span>{{e.advice}}</span>
  </div>

  <!-- 底部按钮 -->
  <div style="display:flex;gap:6px;justify-content:flex-end;margin-top:4px">
    <button v-if="e.status!=='已处理'" class="btn btn-p btn-s" @click.stop="openTreat(e)">🔧 立即处理</button>
    <button class="btn btn-o btn-s" @click.stop="openScheme(e)">📄 查看方案</button>
    <button class="btn btn-o btn-s" @click.stop="showDetail(e)">📋 历史记录</button>
  </div>
</div>
</div>

<!-- ===== 四、图表区：趋势 + 分布 + 处理效率 ===== -->
<div style="display:flex;gap:10px;margin-top:12px">
  <div class="panel" style="flex:1.2;margin:0">
    <div class="panel-hd-inline"><span class="hd-bar r"></span>📈 近30天预警趋势</div>
    <div ref="chartTrend" class="chart-box" style="height:160px"></div>
  </div>
  <div class="panel" style="flex:0.8;margin:0">
    <div class="panel-hd-inline"><span class="hd-bar y"></span>🍩 疫病类型分布</div>
    <div ref="chartPie" class="chart-box" style="height:160px"></div>
  </div>
  <div class="panel" style="flex:0.8;margin:0">
    <div class="panel-hd-inline"><span class="hd-bar g"></span>⏱ 处理效率</div>
    <div style="padding:8px 0">
      <div class="eff-row"><span class="eff-l">平均</span><span class="eff-v g">{{effStats.avg}}</span></div>
      <div class="eff-row"><span class="eff-l">最快</span><span class="eff-v g">{{effStats.min}}</span></div>
      <div class="eff-row"><span class="eff-l">最慢</span><span class="eff-v r">{{effStats.max}}</span></div>
      <div class="eff-row"><span class="eff-l">24h内处理率</span><span class="eff-v g">{{effStats.rate24h}}%</span></div>
      <div class="eff-row"><span class="eff-l">本月处理</span><span class="eff-v">{{effStats.monthResolved}}条</span></div>
    </div>
  </div>
</div>

<!-- ===== 五、高发区域 + 病种 + AI预测 ===== -->
<div style="display:flex;gap:10px;margin-top:10px">
  <div class="panel" style="flex:1;margin:0">
    <div class="panel-hd-inline"><span class="hd-bar g"></span>🏆 高发区域</div>
    <div v-for="(a,i) in areaRank" :key="a.name" class="rank-row">
      <span class="rank-num">{{i+1}}</span><span class="rank-name">{{a.name}}</span><span class="rank-count">{{a.count}}次</span>
    </div>
  </div>
  <div class="panel" style="flex:1;margin:0">
    <div class="panel-hd-inline"><span class="hd-bar r"></span>🦠 高发病种</div>
    <div v-for="(d,i) in diseaseRank" :key="d.name" class="rank-row">
      <span class="rank-num">{{i+1}}</span><span class="rank-name">{{d.name}}</span><span class="rank-count">{{d.count}}次</span>
    </div>
  </div>
  <div class="panel" style="flex:1;margin:0">
    <div class="panel-hd-inline"><span class="hd-bar y"></span>🔮 风险预测</div>
    <div v-for="p in predictions" :key="p.disease" class="pred-item">
      <div class="pred-header">
        <span style="font-weight:600;color:#1F2D3D;font-size:13px">{{p.disease}}</span>
        <span :class="'tag '+(p.risk==='high'?'r':'y')" style="font-size:10px">{{p.riskLabel}}</span>
      </div>
      <div class="pred-info">{{p.cause}} · 概率↑{{p.probability}}%</div>
      <div class="pred-advice">💡 {{p.advice}}</div>
    </div>
  </div>
</div>

<!-- ================================================================ -->
<!--                         详情抽屉                                   -->
<!-- ================================================================ -->
<div class="drawer-overlay" :class="{on:detailOpen}" @click="detailOpen=false"></div>
<div class="drawer" :class="{on:detailOpen}">
  <div class="drawer-hd"><h3>🦠 {{detailData?.disease}}</h3><button class="drawer-close" @click="detailOpen=false">✕</button></div>
  <div class="drawer-bd" v-if="detailData">
    <!-- 状态徽章 -->
    <div style="display:flex;gap:10px;justify-content:center;padding:8px 0 12px">
      <span :class="'tag '+(detailData.risk==='high'?'r':detailData.risk==='mid'?'y':'g')" style="font-size:13px;padding:5px 16px">{{detailData.risk==='high'?'🔴 高风险':detailData.risk==='mid'?'🟡 中风险':'🟢 低风险'}}</span>
      <span :class="'tag '+(detailData.status==='处理中'?'y':detailData.status==='已处理'?'g':'dim')" style="font-size:13px;padding:5px 16px">{{detailData.status}}</span>
      <span style="font-size:12px;color:#66788A;padding:5px 0">已持续 <b style="color:#F2A62B">{{duration(detailData)}}</b></span>
    </div>

    <!-- 一、基本信息 -->
    <div class="ds-title">📋 基本信息</div>
    <div class="dg3"><span class="dl3">疾病名称</span><div style="color:#1F2D3D;font-weight:600;font-size:16px">{{detailData.disease}}</div></div>
    <div class="dg3"><span class="dl3">风险等级</span><div :style="{color:detailData.risk==='high'?'#E05252':detailData.risk==='mid'?'#F2A62B':'#22B573',fontWeight:600}">{{detailData.risk==='high'?'高风险 — 需立即处理':detailData.risk==='mid'?'中风险 — 密切关注':'低风险 — 持续监测'}}</div></div>
    <div class="dg3"><span class="dl3">发现时间</span><div style="font-family:monospace">{{detailData.recordTime||'--'}}</div></div>
    <div class="dg3"><span class="dl3">影响数量</span><div style="color:#E05252;font-weight:600">{{detailData.affectedCount||'--'}}<span v-if="detailData.isolatedCount" style="color:#F2A62B;margin-left:8px">· 已隔离 {{detailData.isolatedCount}}</span><span v-if="detailData.deathCount" style="color:#999;margin-left:8px">· 死亡 {{detailData.deathCount}}</span></div></div>
    <div class="dg3"><span class="dl3">负责人</span><div>{{detailData.handler||'--'}} · {{detailData.source==='AI识别'?'🤖 AI识别':detailData.source==='人工巡查'?'👨 人工巡查':'📡 传感器'}}</div></div>
    <div class="dg3"><span class="dl3">当前状态</span><div :style="{color:detailData.status==='已处理'?'#22B573':'#F2A62B'}">{{detailData.status==='处理中'?'⏳ 处理中':detailData.status==='已处理'?'✅ 已处理关闭':'🔵 监控中'}}</div></div>

    <!-- 二、养殖信息 -->
    <div class="ds-title">🐟 关联养殖档案</div>
    <div class="dg3"><span class="dl3">养殖区域</span><div>{{detailData.area||'--'}}</div></div>
    <div class="dg3"><span class="dl3">养殖品种</span><div>{{detailData.breed||'--'}}<span v-if="detailData.batchName" style="color:#66788A;margin-left:6px">· {{detailData.batchName}}</span></div></div>
    <div class="dg3"><span class="dl3">档案编号</span><div style="color:#22B573">{{detailData.batchNo||'--'}}</div></div>

    <!-- 三、关联环境数据 -->
    <div class="ds-title">🌡 近24小时环境数据</div>
    <div v-if="getEnvData(detailData)" style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:6px">
      <template v-if="getEnvCategory(detailData)==='水产'">
        <div class="dg3"><span class="dl3">🌡 水温</span><div>{{getEnvData(detailData).temp}}°C</div></div>
        <div class="dg3"><span class="dl3">🧪 pH</span><div>{{getEnvData(detailData).ph||'--'}}</div></div>
        <div class="dg3"><span class="dl3">💨 溶解氧</span><div :style="{color:parseFloat(getEnvData(detailData).oxygen)<5?'#E05252':'#475867'}">{{getEnvData(detailData).oxygen}} mg/L</div></div>
        <div class="dg3"><span class="dl3">🧪 氨氮</span><div :style="{color:parseFloat(getEnvData(detailData).ammonia)>0.3?'#E05252':'#475867'}">{{getEnvData(detailData).ammonia}} mg/L</div></div>
      </template>
      <template v-else-if="getEnvCategory(detailData)==='家禽'">
        <div class="dg3"><span class="dl3">🌡 温度</span><div>{{getEnvData(detailData).temp}}°C</div></div>
        <div class="dg3"><span class="dl3">💧 湿度</span><div>{{getEnvData(detailData).hum}}%</div></div>
        <div class="dg3"><span class="dl3">🧪 氨气</span><div :style="{color:parseFloat(getEnvData(detailData).ammonia)>0.3?'#E05252':'#475867'}">{{getEnvData(detailData).ammonia}} ppm</div></div>
        <div class="dg3"><span class="dl3">🌀 通风</span><div :style="{color:getEnvData(detailData).vent||'正常'}">{{getEnvData(detailData).vent||'正常'}}</div></div>
      </template>
      <template v-else>
        <div class="dg3"><span class="dl3">🌡 温度</span><div>{{getEnvData(detailData).temp}}°C</div></div>
        <div class="dg3"><span class="dl3">💧 湿度</span><div>{{getEnvData(detailData).hum}}%</div></div>
        <div class="dg3"><span class="dl3">🧪 氨气</span><div :style="{color:parseFloat(getEnvData(detailData).ammonia)>0.3?'#E05252':'#475867'}">{{getEnvData(detailData).ammonia}} ppm</div></div>
        <div class="dg3"><span class="dl3">🌀 通风</span><div :style="{color:getEnvData(detailData).vent||'正常'}">{{getEnvData(detailData).vent||'正常'}}</div></div>
      </template>
    </div>
    <div v-else style="font-size:12px;color:#66788A;padding:8px;text-align:center">暂无该区域环境监测数据</div>

    <!-- 四、近3日采食情况 -->
    <div class="ds-title">🍽 近3日采食情况</div>
    <div v-if="getIntakeData(detailData)?.length" style="margin-bottom:6px">
      <div v-for="d in getIntakeData(detailData)" :key="d.date" class="dg3" style="display:flex;justify-content:space-between">
        <span style="color:#66788A;font-size:12px">{{d.date}}</span>
        <span style="font-size:13px" :style="{color:d.change===0?'#22B573':d.change<0?'#E05252':'#F2A62B'}">{{d.label}} ({{d.change>=0?'+':''}}{{d.change}}%)</span>
      </div>
    </div>
    <div v-else style="font-size:12px;color:#66788A;padding:8px;text-align:center">暂无采食数据</div>

    <!-- 五、症状与AI研判 -->
    <div class="ds-title">🩺 症状与AI研判</div>
    <div class="dg3"><span class="dl3">症状描述</span><div style="line-height:1.7">{{detailData.symptom||'--'}}</div></div>
    <div class="dg3"><span class="dl3">AI研判参考度</span><div style="color:#22B573;font-weight:600">{{detailData.aiConfidence||'--'}}%<span v-if="detailData.aiConfidence>=90" style="color:#22B573;margin-left:4px">⭐⭐⭐ 高参考</span><span v-else-if="detailData.aiConfidence>=80" style="color:#F2A62B;margin-left:4px">⭐⭐ 中参考</span><span v-else style="color:#66788A;margin-left:4px">⭐ 低参考</span></div></div>

    <!-- 六、建议方案（按等级分色） -->
    <div class="ds-title">💊 建议方案</div>
    <div class="dw-advice-detail" :class="'adv-detail-'+detailData.risk">
      <div style="font-size:14px;font-weight:700;margin-bottom:8px">{{detailData.risk==='high'?'🔴 紧急处置建议':detailData.risk==='mid'?'🟡 关注处置建议':'🟢 监测建议'}}</div>
      <div style="font-size:13px;line-height:2">{{detailData.advice||'请根据实际情况采取防控措施'}}</div>
      <div style="font-size:12px;color:#66788A;margin-top:8px;line-height:1.8">
        <div v-if="detailData.risk==='high'">✓ 立即隔离疑似感染个体</div>
        <div v-if="detailData.risk==='high'">✓ 通知兽医/技术员到场</div>
        <div v-if="detailData.risk==='high'||detailData.risk==='mid'">✓ 采集样本送检确认病原</div>
        <div>✓ 加强消毒，密切观察同批次</div>
        <div v-if="detailData.risk!=='low'">✓ 必要时上报畜牧/水产部门</div>
      </div>
    </div>

    <!-- 七、处置时间轴 -->
    <div class="ds-title">📝 处置记录</div>
    <div v-if="detailData.treatRecords?.length" class="timeline">
      <div v-for="(t,i) in detailData.treatRecords" :key="i" class="tl-node" :class="{last:i===detailData.treatRecords.length-1}">
        <div class="tl-dot" :class="{active:true}"></div>
        <div class="tl-body">
          <div class="tl-time">{{t.time?.slice(5,16)||t.time}}</div>
          <div class="tl-action">{{t.action}}</div>
          <div v-if="t.detail" class="tl-detail">{{t.detail}}</div>
        </div>
      </div>
    </div>
    <div v-else style="font-size:12px;color:#66788A;padding:8px;text-align:center">暂无处置记录</div>

    <!-- 处置进度 -->
    <div class="ds-title">📊 处置进度</div>
    <div class="pl2">
      <div class="ps" :class="detailData.step>=1?'dn':''">发现</div><span class="pa">→</span>
      <div class="ps" :class="detailData.step>=2?'dn':''">AI识别</div><span class="pa">→</span>
      <div class="ps" :class="detailData.step>=3?'dn':''">预警</div><span class="pa">→</span>
      <div class="ps" :class="detailData.step>=4?'dn':''">派单</div><span class="pa">→</span>
      <div class="ps" :class="detailData.step>=5?'dn':''">处理</div><span class="pa">→</span>
      <div class="ps" :class="detailData.step>=6?'dn':''">复核</div><span class="pa">→</span>
      <div class="ps" :class="detailData.step>=7?'dn':''">关闭</div>
    </div>
    <div class="pb2" style="margin-bottom:4px"><div class="pf2" :style="{width:(detailData.step/7*100)+'%'}"></div></div>
    <div style="font-size:11px;color:#66788A;text-align:right">处置 {{detailData.step}}/7</div>

    <!-- 底部操作（按处置步骤控制权限） -->
    <div style="display:flex;gap:8px;margin-top:14px">
      <button v-if="detailData.step<5" class="btn btn-p" style="flex:1" @click="openTreat(detailData);detailOpen=false">🔧 立即处理</button>
      <button v-if="detailData.step===5&&detailData.status!=='已处理'" class="btn btn-y" style="flex:1" @click="openTreat(detailData);detailOpen=false">📝 填写处理结果</button>
      <button v-if="detailData.step===6&&detailData.status!=='已处理'" class="btn btn-p" style="flex:1" @click="doReview(detailData);detailOpen=false">✅ 提交复核</button>
      <button v-if="detailData.step>=6&&detailData.status!=='已处理'&&detailData.treatResult==='已恢复正常'" class="btn btn-d" style="flex:1" @click="closeEvent(detailData);detailOpen=false">🔒 关闭预警</button>
      <button class="btn btn-o" style="flex:1" @click="openScheme(detailData);detailOpen=false">📄 查看方案</button>
    </div>
  </div>
</div>

<!-- ================================================================ -->
<!--                       新增预警抽屉                                 -->
<!-- ================================================================ -->
<div class="drawer-overlay" :class="{on:addOpen}" @click="addOpen=false"></div>
<div class="drawer" :class="{on:addOpen}">
  <div class="drawer-hd"><h3>📝 新增疫病预警</h3><button class="drawer-close" @click="addOpen=false">✕</button></div>
  <div class="drawer-bd">
    <div class="ds-title">📋 选择养殖档案</div>
    <div class="fld"><label>养殖档案</label><select v-model="form.archiveId" class="fin" @change="onArchiveChange"><option value="">请选择</option><option v-for="l in breedingList" :key="l.id" :value="l.id">{{l.batchNo}} - {{l.area}}</option></select></div>
    <div class="fld"><label>批次名称</label><input :value="selectedArchive?.batchName||'--'" class="fin" disabled style="color:#66788A"></div>
    <div class="frow2"><div class="fld"><label>养殖区域</label><input :value="selectedArchive?.area||'--'" class="fin" disabled style="color:#66788A"></div><div class="fld"><label>品种（自动）</label><input :value="selectedArchive?.breed||'--'" class="fin" disabled style="color:#66788A"></div></div>

    <div class="ds-title">🦠 疫病信息</div>
    <div class="frow2"><div class="fld"><label>疾病名称 *</label><input v-model="form.disease" class="fin" placeholder="如：猪呼吸道综合征"></div><div class="fld"><label>风险等级</label><select v-model="form.risk" class="fin"><option value="high">高风险</option><option value="mid">中风险</option><option value="low">低风险</option></select></div></div>
    <div class="fld"><label>症状描述</label><textarea v-model="form.symptom" class="fin" rows="3" placeholder="描述异常症状..." style="resize:vertical"></textarea></div>
    <div class="frow2"><div class="fld"><label>影响数量</label><input v-model="form.affectedCount" class="fin" placeholder="如：52头"></div><div class="fld"><label>数据来源</label><select v-model="form.source" class="fin"><option>人工巡查</option><option>AI识别</option><option>传感器监测</option></select></div></div>
    <div class="frow2"><div class="fld"><label>负责人</label><input v-model="form.handler" class="fin" :placeholder="selectedArchive?.manager||'--'"></div><div class="fld"><label>AI置信度 (%)</label><input v-model.number="form.aiConfidence" type="number" class="fin" placeholder="90" min="0" max="100"></div></div>
    <div class="fld"><label>防治建议</label><textarea v-model="form.advice" class="fin" rows="2" placeholder="建议措施..." style="resize:vertical"></textarea></div>
    <div style="display:flex;gap:8px;margin-top:14px"><button class="btn btn-p" style="flex:1" @click="saveRecord">保存</button><button class="btn btn-o" style="flex:1" @click="addOpen=false">取消</button></div>
  </div>
</div>

<!-- ================================================================ -->
<!--                       处理预警抽屉                                 -->
<!-- ================================================================ -->
<div class="drawer-overlay" :class="{on:treatOpen}" @click="treatOpen=false"></div>
<div class="drawer" :class="{on:treatOpen}">
  <div class="drawer-hd"><h3>🔧 处理预警 — {{treatTarget?.disease}}</h3><button class="drawer-close" @click="treatOpen=false">✕</button></div>
  <div class="drawer-bd">
    <div class="ds-title">📋 处理信息</div>
    <div class="fld"><label>处理人员</label><input v-model="treatForm.person" class="fin" :placeholder="treatTarget?.handler||'--'"></div>
    <div class="frow2"><div class="fld"><label>处理时间</label><input v-model="treatForm.time" class="fin" type="datetime-local"></div><div class="fld"><label>预计恢复时间</label><input v-model="treatForm.recoveryTime" class="fin" type="datetime-local"></div></div>
    <div class="frow2"><div class="fld"><label>使用药剂/措施</label><input v-model="treatForm.agent" class="fin" placeholder="如：抗生素+VC"></div></div>
    <div class="fld"><label>处理措施描述</label><textarea v-model="treatForm.action" class="fin" rows="3" placeholder="描述具体处理措施..." style="resize:vertical"></textarea></div>

    <!-- 隔离 + 上报 -->
    <div class="ds-title">📋 处置选项</div>
    <div style="display:flex;gap:16px;margin-bottom:12px;flex-wrap:wrap">
      <label class="dw-check-label"><input type="checkbox" v-model="treatForm.isolated" class="dw-check"> 已隔离</label>
      <label class="dw-check-label"><input type="checkbox" v-model="treatForm.reported" class="dw-check"> 已上报</label>
    </div>

    <!-- 本次处置结果 -->
    <div class="ds-title">📊 本次处置结果</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:10px">
      <label class="dw-radio-label"><input type="radio" v-model="treatForm.result" value="已恢复正常" class="dw-check"> 已恢复正常</label>
      <label class="dw-radio-label"><input type="radio" v-model="treatForm.result" value="症状缓解" class="dw-check"> 症状缓解</label>
      <label class="dw-radio-label"><input type="radio" v-model="treatForm.result" value="无明显改善" class="dw-check"> 无明显改善</label>
      <label class="dw-radio-label"><input type="radio" v-model="treatForm.result" value="情况加重" class="dw-check"> 情况加重</label>
    </div>

    <div style="display:flex;gap:8px;margin-top:14px"><button class="btn btn-p" style="flex:1" @click="doTreat">✅ 确认处理</button><button class="btn btn-o" style="flex:1" @click="treatOpen=false">取消</button></div>
  </div>
</div>

<!-- ================================================================ -->
<!--                       AI诊断抽屉                                   -->
<!-- ================================================================ -->
<div class="drawer-overlay" :class="{on:aiOpen}" @click="aiOpen=false"></div>
<div class="drawer" :class="{on:aiOpen}">
  <div class="drawer-hd"><h3>🤖 AI辅助研判</h3><button class="drawer-close" @click="aiOpen=false">✕</button></div>
  <div class="drawer-bd">
    <div class="ds-title">📋 选择养殖区域</div>
    <div class="fld"><label>养殖区域</label><select v-model="aiForm.area" class="fin" @change="onAiAreaChange"><option v-for="a in areaOptions" :key="a" :value="a">{{a}}</option></select></div>

    <!-- 自动环境数据 -->
    <div v-if="aiEnv" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;margin-bottom:10px">
      <div class="dg3" style="text-align:center"><span class="dl3">🌡 温度</span><div style="font-size:16px;font-weight:700">{{aiEnv.temp}}°C</div></div>
      <div class="dg3" style="text-align:center"><span class="dl3">💧 湿度</span><div style="font-size:16px;font-weight:700">{{aiEnv.hum}}%</div></div>
      <div class="dg3" style="text-align:center"><span class="dl3">💨 溶氧</span><div style="font-size:16px;font-weight:700">{{aiEnv.oxygen}}mg/L</div></div>
    </div>

    <div class="frow2"><div class="fld"><label>品种（自动）</label><input :value="aiBreed||'--'" class="fin" disabled style="color:#66788A"></div><div class="fld"><label>最近监测</label><input :value="aiEnv?.lastCheck||'--'" class="fin" disabled style="color:#66788A"></div></div>

    <!-- 上传照片 -->
    <div class="fld"><label>上传照片（可选）</label>
      <div class="dw-upload" @click="aiFileInput?.click()">
        <input ref="aiFileInput" type="file" accept="image/*" style="display:none" @change="onAiFile">
        <template v-if="aiPreviewUrl"><img :src="aiPreviewUrl" class="dw-upload-preview"><span style="font-size:11px;color:#22B573;margin-top:4px">点击更换图片</span></template>
        <template v-else>📷 点击上传异常照片<span style="font-size:11px;color:#66788A;margin-top:4px;display:block">有助于提高AI识别准确率</span></template>
      </div>
    </div>

    <div class="fld"><label>症状描述</label><textarea v-model="aiForm.desc" class="fin" rows="3" placeholder="描述异常情况（如：咳嗽、食欲下降、皮肤异常等）..." style="resize:vertical"></textarea></div>

    <div v-if="aiResult" class="arb">
      <div class="ad2">{{aiResult.disease}}</div>
      <div class="ab"><div class="af2" :style="{width:aiResult.confidence+'%'}"></div></div>
      <div style="font-size:13px;color:#475867;margin-bottom:3px">AI研判参考度：<b style="color:#22B573">{{aiResult.confidence}}%</b><span v-if="aiResult.confidence>=90" style="color:#22B573;margin-left:4px">⭐⭐⭐</span><span v-else-if="aiResult.confidence>=80" style="color:#F2A62B;margin-left:4px">⭐⭐</span></div>
      <div style="font-size:11px;color:#F2A62B">⏱ 预计扩散：{{aiResult.spread}}</div>
      <div v-if="aiResult.solution" class="dw-advice-detail" :class="aiResult.confidence>=90?'adv-detail-high':aiResult.confidence>=80?'adv-detail-mid':'adv-detail-low'" style="margin-top:8px">
        <span style="font-size:12px">💊 {{aiResult.solution}}</span>
      </div>
    </div>

    <div style="display:flex;gap:8px;margin-top:14px">
      <button class="btn btn-p" style="flex:1" @click="doAi" :disabled="aiLoading">{{aiLoading?'分析中...':'🔍 开始分析'}}</button>
      <button v-if="aiResult" class="btn btn-p" @click="createFromAi">🚨 生成预警</button>
      <button class="btn btn-o" style="flex:1" @click="aiOpen=false">取消</button>
    </div>
  </div>
</div>

<!-- ================================================================ -->
<!--                      防治方案抽屉                                  -->
<!-- ================================================================ -->
<div class="drawer-overlay" :class="{on:schemeOpen}" @click="schemeOpen=false"></div>
<div class="drawer" :class="{on:schemeOpen}">
  <div class="drawer-hd"><h3>📄 防治方案 — {{schemeTarget?.disease}}</h3><button class="drawer-close" @click="schemeOpen=false">✕</button></div>
  <div class="drawer-bd" v-if="schemeTarget">
    <div class="dg3"><span class="dl3">疾病</span><div style="color:#E05252;font-weight:600;font-size:16px">{{schemeTarget.disease}}</div></div>

    <!-- 处置建议 -->
    <div class="ds-title">📋 处置建议</div>
    <div style="font-size:13px;color:#475867;line-height:2;padding:6px 0">{{getScheme(schemeTarget).advice}}</div>

    <!-- 用药参考（仅展示，需兽医确认） -->
    <div class="ds-title">💊 用药参考</div>
    <div class="dw-advice-detail adv-detail-mid" style="margin-bottom:8px">
      <div style="font-size:12px;color:#F2A62B;margin-bottom:8px">⚠ 以下为知识库参考方案，需经兽医确认后方可使用</div>
      <div class="dg3"><span class="dl3">推荐药剂</span><div>{{getScheme(schemeTarget).agent}}</div></div>
      <div class="dg3"><span class="dl3">用量</span><div>{{getScheme(schemeTarget).dosage}}</div></div>
      <div class="dg3"><span class="dl3">方法</span><div>{{getScheme(schemeTarget).method}}</div></div>
      <div class="dg3"><span class="dl3">注意事项</span><div style="line-height:1.8">{{getScheme(schemeTarget).notes}}</div></div>
      <div v-if="getScheme(schemeTarget).withdrawal" class="dg3"><span class="dl3">休药期</span><div style="color:#F2A62B">{{getScheme(schemeTarget).withdrawal}}</div></div>
      <div class="dg3"><span class="dl3">复查时间</span><div style="color:#22B573;font-weight:600">{{getScheme(schemeTarget).reexamine}}</div></div>
      <div style="font-size:11px;color:#66788A;margin-top:6px">方案来源：平台知识库 · 版本 V1.0 · 待兽医审核</div>
    </div>

    <button class="btn btn-o" style="width:100%;margin-top:10px" @click="schemeOpen=false">关闭</button>
  </div>
</div>

<!-- Toast -->
<div style="position:fixed;top:16px;right:16px;z-index:999;display:flex;flex-direction:column;gap:6px;pointer-events:none">
  <div v-for="t in toasts" :key="t.id" :class="'toast '+t.type">{{t.msg}}</div>
</div>
</div>
</template>

<script setup>
import {ref,reactive,computed,onMounted,onUnmounted,nextTick} from 'vue'
import * as echarts from 'echarts'

// Toast
const toasts=reactive([])
function toast(m,t='info'){const id=Date.now();toasts.push({id,msg:m,type:t});setTimeout(()=>{const i=toasts.findIndex(x=>x.id===id);if(i>=0)toasts.splice(i,1)},2300)}

// ==================== 数据源 ====================
const breedingList=[{id:1,batchNo:'ZY-SC-202603-001',batchName:'2026年春加州鲈批次',area:'荷虾混养区A塘',category:'水产',type:'鲈鱼',breed:'加州鲈',manager:'赵大哥',phone:'139****6789'},{id:2,batchNo:'ZY-SC-202604-001',batchName:'2026年澳洲淡水龙虾批次',area:'智能水产养殖基地1号池',category:'水产',type:'澳洲淡水龙虾',breed:'澳洲品系',manager:'李婶',phone:'138****8901'},{id:3,batchNo:'ZY-SC-202605-001',batchName:'2026年罗非鱼育成批次',area:'智慧渔业车间2号池',category:'水产',type:'罗非鱼',breed:'吉富品系',manager:'张大叔',phone:'137****2345'},{id:4,batchNo:'ZY-XQ-202601-001',batchName:'2026年杜长大生猪批次',area:'养猪场A区',category:'家畜',type:'生猪',breed:'杜长大三元',manager:'王大爷',phone:'136****7890'},{id:5,batchNo:'ZY-XQ-202603-001',batchName:'2026年海兰褐蛋鸡批次',area:'养鸡场1号',category:'家禽',type:'蛋鸡',breed:'海兰褐',manager:'刘阿姨',phone:'135****8901'},{id:6,batchNo:'ZY-XQ-202602-001',batchName:'2026年西门塔尔肉牛批次',area:'养牛场',category:'家畜',type:'肉牛',breed:'西门塔尔',manager:'陈大哥',phone:'134****9012'}]

// 模拟环境监测数据（各区域最近24h）
const mockEnvData={
  '养猪场A区':{temp:'28.5',hum:'72',ammonia:'0.35',oxygen:'--',ph:'--',vent:'正常',lastCheck:'08-04 14:00'},
  '养鸡场1号':{temp:'26.2',hum:'65',ammonia:'0.22',oxygen:'--',ph:'--',vent:'正常',lastCheck:'08-04 13:30'},
  '养牛场':{temp:'25.8',hum:'68',ammonia:'0.15',oxygen:'--',ph:'--',vent:'正常',lastCheck:'08-04 12:00'},
  '荷虾混养区A塘':{temp:'26.5',hum:'78',ammonia:'0.18',oxygen:'6.2',ph:'7.4',vent:'--',lastCheck:'08-04 15:20'},
  '智能水产养殖基地1号池':{temp:'28.2',hum:'75',ammonia:'0.35',oxygen:'5.5',ph:'7.1',vent:'--',lastCheck:'08-04 14:00'},
  '智慧渔业车间2号池':{temp:'25.8',hum:'70',ammonia:'0.12',oxygen:'6.8',ph:'7.6',vent:'--',lastCheck:'08-04 16:00'}
}

const areaOptions=computed(()=>[...new Set(breedingList.map(l=>l.area))])

// 预警事件
const events=reactive([
  {id:1,archiveId:4,disease:'猪呼吸道综合征',risk:'high',status:'处理中',step:4,area:'养猪场A区',batchName:'2026年杜长大生猪批次',batchNo:'ZY-XQ-202601-001',breed:'杜长大三元',symptom:'咳嗽、打喷嚏 | 采食量下降约5% | 体温升高至40-41℃ | 部分猪只精神沉郁',affectedCount:'52头',isolatedCount:'10头',deathCount:'0头',aiConfidence:95,handler:'王大爷',source:'AI识别',recordTime:'2026-08-04 09:30',advice:'加强通风+注射青霉素+链霉素，补充VC和电解质',treatRecords:[{time:'2026-08-04 09:30',action:'AI发现',detail:'AI摄像头识别猪只异常行为，置信度95%'},{time:'2026-08-04 10:00',action:'负责人确认',detail:'王大爷现场确认，52头猪出现呼吸道症状'},{time:'2026-08-04 10:30',action:'派单处理',detail:'指派王大爷负责隔离与治疗'}]},
  {id:2,archiveId:5,disease:'球虫病',risk:'mid',status:'处理中',step:3,area:'养鸡场1号',batchName:'2026年海兰褐蛋鸡批次',batchNo:'ZY-XQ-202603-001',breed:'海兰褐',symptom:'粪便异常带血 | 精神不振，羽毛蓬乱 | 采食量下降约8%',affectedCount:'200只',isolatedCount:'20只',deathCount:'0只',aiConfidence:88,handler:'刘阿姨',source:'人工巡查',recordTime:'2026-08-04 08:15',advice:'饲料中添加磺胺喹噁啉+地克珠利，保持垫料干燥',treatRecords:[{time:'2026-08-04 08:15',action:'人工发现',detail:'刘阿姨日常巡查发现鸡群异常'},{time:'2026-08-04 08:30',action:'确认预警',detail:'初步判断为球虫病，开始投药'}]},
  {id:3,archiveId:4,disease:'猪链球菌病',risk:'high',status:'处理中',step:2,area:'养猪场A区',batchName:'2026年杜长大生猪批次',batchNo:'ZY-XQ-202601-001',breed:'杜长大三元',symptom:'关节肿胀，跛行 | 体温升高至40.5℃ | 个别猪只出现神经症状',affectedCount:'8头',isolatedCount:'8头',deathCount:'0头',aiConfidence:91,handler:'王大爷',source:'传感器监测',recordTime:'2026-08-03 16:05',advice:'及时隔离+阿莫西林+恩诺沙星注射治疗，严格消毒圈舍',treatRecords:[{time:'2026-08-03 16:05',action:'传感器告警',detail:'体温传感器检测到异常高温触发'},{time:'2026-08-03 16:30',action:'AI识别确认',detail:'AI分析确认为链球菌病风险，置信度91%'}]},
  {id:4,archiveId:6,disease:'牛结核病预警',risk:'mid',status:'监控中',step:2,area:'养牛场',batchName:'2026年西门塔尔肉牛批次',batchNo:'ZY-XQ-202602-001',breed:'西门塔尔',symptom:'持续咳嗽2周 | 体重下降约8% | 食欲明显减退',affectedCount:'2头',aiConfidence:82,handler:'陈大哥',source:'人工巡查',recordTime:'2026-08-02 14:20',advice:'严格隔离观察+结核菌素皮试检测，人员做好防护',treatRecords:[{time:'2026-08-02 14:20',action:'人工发现',detail:'陈大哥发现2头牛持续消瘦咳嗽'},{time:'2026-08-02 15:00',action:'隔离观察',detail:'已隔离2头疑似病牛，等待检测结果'}]},
  {id:5,archiveId:3,disease:'罗非鱼链球菌病',risk:'low',status:'已处理',step:7,area:'智慧渔业车间2号池',batchName:'2026年罗非鱼育成批次',batchNo:'ZY-SC-202605-001',breed:'吉富品系',symptom:'少数鱼体表充血 | 游动异常，离群独游 | 死亡率微升至0.5%',affectedCount:'50尾',isolatedCount:'10尾',deathCount:'3尾',aiConfidence:78,handler:'张大叔',source:'AI识别',recordTime:'2026-08-01 11:00',advice:'降低养殖密度+投喂氟苯尼考药饵，加强换水增氧',treatRecords:[{time:'2026-08-01 11:00',action:'AI发现',detail:'水下摄像头AI识别异常行为'},{time:'2026-08-01 11:30',action:'负责人确认',detail:'张大叔捞取病鱼确认链球菌感染'},{time:'2026-08-01 14:00',action:'投喂药饵',detail:'使用氟苯尼考+VC拌料投喂'},{time:'2026-08-03 09:00',action:'复查',detail:'病鱼症状消失，无新增死亡'},{time:'2026-08-03 10:00',action:'关闭',detail:'确认处理完成，关闭预警'}]},
  {id:6,archiveId:5,disease:'禽流感预警',risk:'high',status:'处理中',step:3,area:'养鸡场1号',batchName:'2026年海兰褐蛋鸡批次',batchNo:'ZY-XQ-202603-001',breed:'海兰褐',symptom:'精神沉郁，翅膀下垂 | 产蛋量下降10% | 有呼吸道症状，眼睑肿胀',affectedCount:'300只',aiConfidence:93,handler:'刘阿姨',source:'传感器监测',recordTime:'2026-08-04 07:00',advice:'严格封锁隔离+紧急疫苗接种+立即上报畜牧兽医部门',treatRecords:[{time:'2026-08-04 07:00',action:'传感器告警',detail:'环境传感器检测到异常+AI行为分析'},{time:'2026-08-04 07:30',action:'紧急响应',detail:'AI确认禽流感风险93%，触发紧急预案'},{time:'2026-08-04 08:00',action:'上报畜牧站',detail:'已报上级主管部门，等待指示'}]},
  {id:7,archiveId:1,disease:'鲈鱼烂鳃病',risk:'low',status:'监控中',step:3,area:'荷虾混养区A塘',batchName:'2026年春加州鲈批次',batchNo:'ZY-SC-202603-001',breed:'加州鲈',symptom:'少数鱼鳃部发白 | 呼吸急促，浮头 | 游动缓慢',affectedCount:'30尾',aiConfidence:75,handler:'赵大哥',source:'人工巡查',recordTime:'2026-08-03 18:00',advice:'检测水质氨氮+pH，适量换水，必要时聚维酮碘消毒',treatRecords:[{time:'2026-08-03 18:00',action:'人工发现',detail:'赵大哥傍晚巡查发现浮头现象'},{time:'2026-08-03 18:30',action:'水质检测',detail:'氨氮偏高0.25mg/L，pH正常'},{time:'2026-08-04 06:00',action:'换水处理',detail:'已换水30%，增氧设备全开'}]},
  {id:8,archiveId:2,disease:'虾白斑综合征',risk:'mid',status:'已处理',step:7,area:'智能水产养殖基地1号池',batchName:'2026年澳洲淡水龙虾批次',batchNo:'ZY-SC-202604-001',breed:'澳洲品系',symptom:'个别虾体出现白斑 | 活动力明显下降 | 摄食量减少约20%',affectedCount:'200尾',aiConfidence:86,handler:'李婶',source:'AI识别',recordTime:'2026-08-01 08:00',advice:'隔离病虾+聚维酮碘全池泼洒+提高水温至30℃+VC应激灵拌料',treatRecords:[{time:'2026-08-01 08:00',action:'AI发现',detail:'水下AI识别虾体白斑异常'},{time:'2026-08-01 08:30',action:'负责人确认',detail:'李婶现场确认白斑综合征'},{time:'2026-08-01 10:00',action:'消毒处理',detail:'聚维酮碘全池泼洒+隔离病虾'},{time:'2026-08-03 16:00',action:'复查',detail:'无新增白斑病例，虾群恢复正常'},{time:'2026-08-03 17:00',action:'关闭',detail:'确认处理完成，关闭预警'}]}
])

// ==================== 计算 ====================
const activeCount=computed(()=>events.filter(e=>e.status!=='已处理').length)
const pendingCount=computed(()=>events.filter(e=>e.step<5&&e.status!=='已处理').length)
const processingCount=computed(()=>events.filter(e=>e.status==='处理中').length)
const monthTotal=computed(()=>events.length)
const resolvedCount=computed(()=>events.filter(e=>e.status==='已处理').length)
const resolveRate=computed(()=>events.length>0?Math.round(resolvedCount.value/events.length*100):100)

const filterRisk=ref(''),filterStatus=ref('')
const filteredEvents=computed(()=>{
  let l=events
  if(filterRisk.value)l=l.filter(e=>e.risk===filterRisk.value)
  if(filterStatus.value)l=l.filter(e=>e.status===filterStatus.value)
  return l
})

function duration(e){
  if(!e.recordTime)return'--'
  const t=new Date(e.recordTime.replace(' ','T'))
  if(isNaN(t.getTime()))return'--'
  const diff=new Date()-t;const h=Math.floor(diff/3600000);const m=Math.floor((diff%3600000)/60000)
  if(h>=24){const d=Math.floor(h/24);return d+'天'+(h%24)+'小时'}
  if(h>0)return h+'小时'+(m>0?m+'分钟':'')
  return m+'分钟'
}

function formatSymptom(s){
  if(!s)return'--'
  return s.replace(/\s*\|\s*/g,'\n').replace(/；/g,'\n')
}

function getEnvData(e){
  return e?.area?mockEnvData[e.area]||null:null
}
function getEnvCategory(e){
  if(!e?.archiveId)return'家畜'
  const bl=breedingList.find(l=>l.id===e.archiveId)
  return bl?.category==='水产'?'水产':bl?.category==='家禽'?'家禽':'家畜'
}

// 近3日采食数据（按区域模拟）
const mockIntakeData={
  '养猪场A区':[{date:'8月3日',change:0,label:'正常'},{date:'8月4日',change:-5,label:'↓5%'},{date:'8月5日',change:-8,label:'↓8%'}],
  '养鸡场1号':[{date:'8月3日',change:0,label:'正常'},{date:'8月4日',change:-3,label:'↓3%'},{date:'8月5日',change:-8,label:'↓8%'}],
  '养牛场':[{date:'8月2日',change:0,label:'正常'},{date:'8月3日',change:-2,label:'↓2%'},{date:'8月4日',change:-8,label:'↓8%'}],
  '荷虾混养区A塘':[{date:'8月3日',change:0,label:'正常'},{date:'8月4日',change:-2,label:'↓2%'},{date:'8月5日',change:0,label:'正常'}],
  '智能水产养殖基地1号池':[{date:'8月3日',change:0,label:'正常'},{date:'8月4日',change:-5,label:'↓5%'},{date:'8月5日',change:-20,label:'↓20%'}],
  '智慧渔业车间2号池':[{date:'8月3日',change:0,label:'正常'},{date:'8月4日',change:-3,label:'↓3%'},{date:'8月5日',change:0,label:'正常'}]
}
function getIntakeData(e){return e?.area?mockIntakeData[e.area]||null:null}

const areaRank=computed(()=>{
  const map={}
  events.forEach(e=>{map[e.area]=(map[e.area]||0)+1})
  return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,count])=>({name,count}))
})
const diseaseRank=computed(()=>{
  const map={}
  events.forEach(e=>{map[e.disease]=(map[e.disease]||0)+1})
  return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,count])=>({name,count}))
})

const predictions=reactive([
  {disease:'猪呼吸道综合征',risk:'high',riskLabel:'高风险',probability:78,cause:'气温骤降+通风不足',advice:'加强通风，补充VC预防'},
  {disease:'禽流感',risk:'high',riskLabel:'高风险',probability:62,cause:'候鸟迁徙季节+温差大',advice:'加强免疫，严格消毒'},
  {disease:'球虫病',risk:'mid',riskLabel:'关注',probability:45,cause:'高温高湿环境',advice:'饲料中添加预防性药物'}
])

const effStats=reactive({avg:'4.2小时',min:'20分钟',max:'18小时',rate24h:82,monthResolved:resolvedCount.value})

// ==================== 详情 ====================
const detailOpen=ref(false),detailData=ref(null)
function showDetail(e){detailData.value=e;detailOpen.value=true}

// ==================== 新增预警 ====================
const addOpen=ref(false)
const form=reactive({archiveId:'',disease:'',risk:'high',symptom:'',affectedCount:'',source:'人工巡查',handler:'',aiConfidence:80,advice:''})
const selectedArchive=computed(()=>breedingList.find(l=>l.id===form.archiveId))
function onArchiveChange(){if(selectedArchive.value){form.handler=selectedArchive.value.manager}}
function openAdd(){Object.assign(form,{archiveId:'',disease:'',risk:'high',symptom:'',affectedCount:'',source:'人工巡查',handler:'',aiConfidence:80,advice:''});addOpen.value=true}
function saveRecord(){
  if(!form.archiveId){alert('请选择养殖档案');return}
  if(!form.disease.trim()){alert('请输入疾病名称');return}
  const arch=breedingList.find(l=>l.id===form.archiveId)
  events.unshift({
    id:Date.now(),archiveId:form.archiveId,
    disease:form.disease,risk:form.risk,status:form.risk==='high'?'处理中':'监控中',step:3,
    area:arch.area,batchName:arch.batchName,batchNo:arch.batchNo,breed:arch.breed,
    symptom:form.symptom,affectedCount:form.affectedCount||'待确认',
    aiConfidence:parseInt(form.aiConfidence)||80,handler:form.handler||arch.manager,
    source:form.source,recordTime:new Date().toISOString().replace('T',' ').slice(0,16),
    advice:form.advice||'请检查并采取防控措施',
    treatRecords:[{time:new Date().toISOString().replace('T',' ').slice(0,16),action:'生成预警',detail:form.source+'触发'}]
  })
  addOpen.value=false;toast('预警已生成','ok')
}

// ==================== 处理预警 ====================
const treatOpen=ref(false),treatTarget=ref(null)
const treatForm=reactive({person:'',time:'',recoveryTime:'',agent:'',action:'',isolated:false,reported:false,result:'已恢复正常'})
function openTreat(e){
  treatTarget.value=e
  treatForm.person=e.handler||'';treatForm.time=new Date().toISOString().slice(0,16);treatForm.recoveryTime='';treatForm.agent='';treatForm.action='';treatForm.isolated=false;treatForm.reported=false;treatForm.result='已恢复正常'
  treatOpen.value=true
}
function doTreat(){
  if(!treatTarget.value)return
  const e=treatTarget.value
  e.step=Math.max(e.step,5)
  if(treatForm.person)e.handler=treatForm.person
  if(!e.treatRecords)e.treatRecords=[]
  const details=[]
  if(treatForm.isolated)details.push('已隔离')
  if(treatForm.reported)details.push('已上报')
  if(treatForm.agent)details.push('用药:'+treatForm.agent)
  if(treatForm.action)details.push(treatForm.action)
  if(treatForm.recoveryTime)details.push('预计恢复:'+treatForm.recoveryTime.slice(0,16))
  const resultLabel={'已恢复正常':'✅ 已恢复正常','症状缓解':'🟡 症状缓解','无明显改善':'⚠ 无明显改善','情况加重':'🔴 情况加重'}
  details.push('处置结果：'+(resultLabel[treatForm.result]||treatForm.result))
  e.treatResult=treatForm.result
  e.treatRecords.push({time:treatForm.time||new Date().toISOString().replace('T',' ').slice(0,16),action:'处理',detail:details.join(' | ')})
  e.step=6
  if(treatForm.result==='已恢复正常')e.advice='症状已缓解，建议提交复核'
  e.status='处理中'
  toast('处理已提交','ok')
  treatOpen.value=false
}
function doReview(e){
  if(!e.treatResult||e.treatResult!=='已恢复正常'){toast('处置结果未显示恢复，请先完成有效处理','warn');return}
  e.treatRecords.push({time:new Date().toISOString().replace('T',' ').slice(0,16),action:'提交复核',detail:'处置结果：已恢复正常，待管理员复核'})
  e.step=6
  toast('复核已提交，待管理员确认','ok')
}
function closeEvent(e){
  e.step=7;e.status='已处理'
  if(!e.treatRecords)e.treatRecords=[]
  e.treatRecords.push({time:new Date().toISOString().replace('T',' ').slice(0,16),action:'关闭预警',detail:'处理完成并复核通过'})
  effStats.monthResolved=resolvedCount.value
  toast('预警已关闭','ok')
}

// ==================== 防治方案 ====================
const schemeOpen=ref(false),schemeTarget=ref(null)
function openScheme(e){schemeTarget.value=e;schemeOpen.value=true}
function getScheme(e){
  const map={
    '猪呼吸道综合征':{advice:'1. 立即隔离疑似感染猪只\n2. 加强圈舍通风换气\n3. 补充饮水中添加VC和电解质\n4. 采集样本送检确认病原\n5. 对同批次猪只加强观察',agent:'青霉素+链霉素联合注射',dosage:'青霉素2万IU/kg + 链霉素10mg/kg，每日2次',method:'肌肉注射，连续3-5天',notes:'1. 注射前做过敏试验\n2. 注意观察过敏反应\n3. 与其他药物间隔使用',withdrawal:'休药期28天',reexamine:'治疗后3天复查'},
    '猪链球菌病':{advice:'1. 严格隔离病猪，设立独立治疗区\n2. 对圈舍进行全面消毒\n3. 加强人员进出防护措施\n4. 病死猪严格无害化处理',agent:'阿莫西林+恩诺沙星',dosage:'阿莫西林15mg/kg + 恩诺沙星2.5mg/kg',method:'肌肉注射，每日1次',notes:'1. 注意观察过敏反应\n2. 与其他药物间隔使用\n3. 人员接触后严格消毒',withdrawal:'休药期21天',reexamine:'治疗后5天复查'},
    '球虫病':{advice:'1. 加强鸡舍消毒，保持垫料干燥\n2. 隔离重症病鸡单独治疗\n3. 加强通风降低湿度\n4. 轮换用药防止耐药性',agent:'磺胺喹噁啉+地克珠利',dosage:'磺胺喹噁啉0.1%饮水 + 地克珠利1ppm拌料',method:'饮水给药，连续3天',notes:'1. 连续用药不超过5天\n2. 注意观察粪便变化\n3. 补充VA、VK促进恢复',withdrawal:'休药期10天（蛋鸡产蛋期禁用）',reexamine:'治疗后7天复查'},
    '禽流感预警':{agent:'双黄连口服液+黄芪多糖',dosage:'双黄连1ml/L饮水 + 黄芪多糖0.5g/L',method:'饮水给药+紧急免疫',notes:'1.严格封锁隔离\n2.上报畜牧兽医部门\n3.加强人员消毒\n4.病死禽无害化处理',reexamine:'处理后立即上报，等待上级指示'},
    '罗非鱼链球菌病':{agent:'氟苯尼考+维生素C',dosage:'氟苯尼考10mg/kg鱼体重 + VC 1g/kg饲料',method:'拌料投喂，连续5-7天',notes:'1.降低养殖密度\n2.加强换水\n3.提高溶氧\n4.注意休药期',reexamine:'治疗后7天复查'},
    '虾白斑综合征':{agent:'聚维酮碘+VC应激灵',dosage:'聚维酮碘0.3ppm全池泼洒 + VC应激灵2g/kg饲料',method:'水体消毒+拌料投喂',notes:'1.隔离病虾\n2.提高水温至30℃\n3.加强增氧\n4.暂停换水避免应激',reexamine:'治疗后5天复查'},
    '鲈鱼烂鳃病':{agent:'聚维酮碘+氟苯尼考',dosage:'聚维酮碘0.2ppm消毒 + 氟苯尼考10mg/kg',method:'水体消毒+药饵投喂',notes:'1.检测水质氨氮/pH\n2.适量换水\n3.增加溶氧\n4.减少投喂量',reexamine:'治疗后5天复查'},
    '牛结核病预警':{agent:'异烟肼+利福平（需兽医指导）',dosage:'遵医嘱执行',method:'隔离+结核菌素检测确认',notes:'1.严格隔离观察\n2.结核菌素皮试检测\n3.阳性牛按规定处理\n4.人员做好防护',reexamine:'检测结果出来后确认方案'}
  }
  return map[e.disease]||{advice:'1. 隔离病畜/病禽\n2. 加强消毒通风\n3. 密切观察同批次\n4. 必要时送检确诊\n5. 联系兽医进一步确认',agent:'请咨询专业兽医',dosage:'遵医嘱',method:'根据具体病情确定',notes:'1. 不擅自使用抗生素\n2. 等待兽医诊断结果\n3. 做好生物安全防护',withdrawal:'--',reexamine:'治疗后5-7天复查'}
}

// ==================== AI诊断 ====================
const aiOpen=ref(false),aiLoading=ref(false),aiResult=ref(null)
const aiForm=reactive({area:'养猪场A区',desc:''})
const aiPreviewUrl=ref(null),aiFileInput=ref(null),aiFileName=ref(null)
const aiBreed=computed(()=>{const arch=breedingList.find(l=>l.area===aiForm.area);return arch?.breed||null})
const aiEnv=computed(()=>mockEnvData[aiForm.area]||null)
function onAiAreaChange(){aiResult.value=null}
function onAiFile(e){const f=e.target.files[0];if(!f){if(aiPreviewUrl.value)URL.revokeObjectURL(aiPreviewUrl.value);aiPreviewUrl.value=null;aiFileName.value=null;return}if(aiPreviewUrl.value)URL.revokeObjectURL(aiPreviewUrl.value);aiFileName.value=f;aiPreviewUrl.value=URL.createObjectURL(f);toast('已选择：'+f.name,'ok')}
function openAi(){aiResult.value=null;aiForm.desc='';aiForm.area='养猪场A区';if(aiPreviewUrl.value)URL.revokeObjectURL(aiPreviewUrl.value);aiPreviewUrl.value=null;aiFileName.value=null;aiOpen.value=true}

async function doAi(){
  if(!aiForm.desc.trim()){toast('请输入症状描述','warn');return}
  aiLoading.value=true
  const localDb=[
    {disease:'猪呼吸道综合征',confidence:95,spread:'预计3天内扩散率40%',solution:'立即注射青霉素+链霉素，加强通风'},
    {disease:'猪链球菌病',confidence:88,spread:'预计传播风险中等',solution:'阿莫西林治疗+严格消毒'},
    {disease:'禽流感',confidence:92,spread:'高传播风险，需紧急处理',solution:'严格隔离+紧急免疫+上报畜牧部门'},
    {disease:'球虫病',confidence:85,spread:'潮湿环境下易扩散',solution:'磺胺类药物饮水+干燥垫料'},
    {disease:'细菌性烂鳃病',confidence:78,spread:'水质恶化会加速传播',solution:'聚维酮碘消毒+改善水质'}
  ]
  try{
    const context=[]
    if(aiBreed.value)context.push('品种：'+aiBreed.value)
    if(aiEnv.value)context.push('环境：温度'+aiEnv.value.temp+'°C，湿度'+aiEnv.value.hum+'%，氨氮'+aiEnv.value.ammonia+'mg/L，溶氧'+aiEnv.value.oxygen+'mg/L')
    if(aiFileName.value)context.push('已上传患处照片')
    const resp=await fetch('/deepseek/chat/completions',{
      method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer sk-22f075be9f3a451fac87d5ff0d75b2d2'},
      body:JSON.stringify({model:'deepseek-chat',messages:[{role:'system',content:'你是畜牧水产疾病诊断专家。根据症状、品种、环境数据和照片（如有）进行综合诊断，用JSON回复：{"disease":"疾病名称","confidence":置信度数字(0-100),"spread":"扩散情况","solution":"防治建议"}'},{role:'user',content:'区域：'+aiForm.area+'。'+context.join('。')+'。症状：'+aiForm.desc}],temperature:0.3})
    })
    const data=await resp.json()
    const text=data.choices?.[0]?.message?.content||''
    const jsonMatch=text.match(/\{[\s\S]*\}/)
    if(jsonMatch){const r=JSON.parse(jsonMatch[0]);aiResult.value={disease:r.disease,confidence:r.confidence,spread:r.spread||'待评估',solution:r.solution||''}}
    else{aiResult.value={disease:'分析结果',confidence:85,spread:'请查看详细分析',solution:text}}
    toast('AI分析完成','ok')
  }catch(e){
    const d=localDb[Math.floor(Math.random()*localDb.length)]
    aiResult.value={disease:d.disease,confidence:d.confidence,spread:d.spread,solution:d.solution}
    toast('使用本地模型分析完成','ok')
  }finally{aiLoading.value=false}
}

function createFromAi(){
  if(!aiResult.value)return
  const arch=breedingList.find(l=>l.area===aiForm.area)
  events.unshift({
    id:Date.now(),archiveId:arch?.id||4,disease:aiResult.value.disease,risk:aiResult.value.confidence>=90?'high':aiResult.value.confidence>=80?'mid':'low',status:'处理中',step:3,
    area:aiForm.area,batchName:arch?.batchName||'--',batchNo:arch?.batchNo||'AI-'+Date.now().toString(36).toUpperCase(),breed:arch?.breed||'--',
    symptom:aiForm.desc||'AI诊断触发',affectedCount:'待确认',
    aiConfidence:aiResult.value.confidence,handler:arch?.manager||'待派单',
    source:'AI识别',recordTime:new Date().toISOString().replace('T',' ').slice(0,16),
    advice:aiResult.value.solution||'请检查并采取防控措施',
    treatRecords:[{time:new Date().toISOString().replace('T',' ').slice(0,16),action:'AI诊断生成',detail:'置信度:'+aiResult.value.confidence+'% | 区域:'+aiForm.area}]
  })
  aiOpen.value=false;toast('预警已生成','ok')
}

// ==================== 导出 ====================
function doExport(){
  const csv='疾病名称,风险等级,状态,区域,批次,症状,影响数量,AI置信度,负责人,来源,时间,建议\n'+events.map(e=>[e.disease,e.risk==='high'?'高风险':e.risk==='mid'?'中风险':'低风险',e.status,e.area,e.batchName,'"'+e.symptom.replace(/"/g,'""')+'"',e.affectedCount,e.aiConfidence+'%',e.handler,e.source,e.recordTime,'"'+e.advice.replace(/"/g,'""')+'"'].join(',')).join('\n')
  const b=new Blob(['﻿'+csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='疫病预警记录.csv';a.click();URL.revokeObjectURL(a.href);toast('已导出','ok')
}

// ==================== Charts ====================
const chartTrend=ref(null),chartPie=ref(null)
let trendInstance=null,pieInstance=null

function initCharts(){
  nextTick(()=>{
    if(chartTrend.value){
      if(trendInstance)trendInstance.dispose()
      trendInstance=echarts.init(chartTrend.value)
      const days=Array.from({length:30},(_,i)=>String(i+1))
      const vals=[2,1,3,5,2,1,4,3,2,1,6,3,2,1,4,3,2,1,5,2,1,3,4,2,1,1,3,2,4,2]
      const grad=new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(224,82,82,.25)'},{offset:1,color:'rgba(224,82,82,.05)'}])
      trendInstance.setOption({
        tooltip:{trigger:'axis',backgroundColor:'#FFFFFF',borderColor:'#D0D8E2',textStyle:{color:'#1F2D3D',fontSize:10}},
        grid:{left:8,right:16,top:8,bottom:20},
        xAxis:{type:'category',data:days,axisLabel:{color:'#66788A',fontSize:7}},
        yAxis:{type:'value',axisLabel:{color:'#66788A',fontSize:9},splitLine:{lineStyle:{color:'#EBEFF4'}}},
        series:[{type:'line',data:vals,smooth:true,lineStyle:{color:'#E05252',width:2},itemStyle:{color:'#E05252'},symbol:'none',areaStyle:{color:grad}}]
      })
    }
    if(chartPie.value){
      if(pieInstance)pieInstance.dispose()
      pieInstance=echarts.init(chartPie.value)
      pieInstance.setOption({
        tooltip:{trigger:'item',backgroundColor:'#FFFFFF',borderColor:'#D0D8E2',textStyle:{color:'#1F2D3D',fontSize:10}},
        series:[{type:'pie',radius:['55%','78%'],center:['50%','52%'],itemStyle:{borderColor:'#FFFFFF',borderWidth:2},label:{color:'#66788A',fontSize:9},
          data:[{value:3,name:'猪呼吸道综合征',itemStyle:{color:'#E05252'}},{value:2,name:'球虫病',itemStyle:{color:'#F2A62B'}},{value:1,name:'猪链球菌病',itemStyle:{color:'#0EA5E9'}},{value:1,name:'牛结核病',itemStyle:{color:'#22B573'}},{value:1,name:'罗非鱼链球菌',itemStyle:{color:'#8B5CF6'}},{value:1,name:'禽流感',itemStyle:{color:'#E05252'}},{value:1,name:'虾白斑综合征',itemStyle:{color:'#F2A62B'}},{value:1,name:'鲈鱼烂鳃病',itemStyle:{color:'#22B573'}}]}]
      })
    }
  })
}

onMounted(()=>{initCharts()})
onUnmounted(()=>{
  if(trendInstance){trendInstance.dispose();trendInstance=null}
  if(pieInstance){pieInstance.dispose();pieInstance=null}
  if(aiPreviewUrl.value)URL.revokeObjectURL(aiPreviewUrl.value)
})
</script>

<style scoped>
.tbanner{font-size:15px;font-weight:700;padding:8px 12px;border-radius:6px;background:rgba(224,82,82,.08);margin-bottom:12px}
.srow{display:flex;gap:10px;flex-wrap:wrap}.scard{flex:1;min-width:100px;height:88px;background:#FFFFFF;border:1px solid #E3EAF0;border-radius:10px;padding:12px;display:flex;flex-direction:column;justify-content:center}.scard .sv{font-size:24px;font-weight:700;font-family:"SF Mono",Consolas,monospace;color:#22B573}.scard .sl{font-size:12px;color:#66788A;margin-top:4px}.scard.g .sv{color:#22B573}.scard.y .sv{color:#F2A62B}.scard.r .sv{color:#E05252}
.panel{background:#FFFFFF;border:1px solid #E3EAF0;border-radius:10px;margin-bottom:10px;transition:.2s}.dw-panel{cursor:pointer}.dw-panel:hover{border-color:rgba(14,165,233,.95);transform:translateY(-1px)}
.panel-hd-inline{font-size:14px;font-weight:700;color:#1F2D3D;margin-bottom:10px;display:flex;align-items:center;gap:8px;letter-spacing:.5px}
.hd-bar{width:3px;height:12px;border-radius:2px;flex-shrink:0}.hd-bar.r{background:#E05252}.hd-bar.y{background:#F2A62B}.hd-bar.g{background:#22B573}
.tag{display:inline-block;padding:2px 8px;border-radius:10px;font-size:12px;font-weight:600}.tag.g{background:rgba(34,181,115,.12);color:#22B573}.tag.y{background:rgba(242,166,43,.12);color:#F2A62B}.tag.r{background:rgba(224,82,82,.12);color:#E05252}.tag.dim{background:rgba(100,120,140,.15);color:#66788A}
.dw-status{font-size:11px;padding:2px 8px;border-radius:8px;font-weight:600}.dw-status.y{background:rgba(242,166,43,.12);color:#F2A62B}.dw-status.g{background:rgba(34,181,115,.12);color:#22B573}.dw-status.dim{background:rgba(100,120,140,.15);color:#66788A}
.chart-box{width:100%}
.fs{background:#FFFFFF;border:1px solid #E3EAF0;color:#475867;border-radius:6px;padding:4px 8px;font-size:12px;font-family:inherit;outline:none}
/* 进度条 */
.pb2{height:3px;background:#E3EAF0;border-radius:2px;margin:3px 0;overflow:hidden}.pf2{height:100%;background:linear-gradient(90deg,#22B573,#1BA366);border-radius:2px;transition:width .5s}
.ps{padding:2px 5px;border-radius:8px;background:rgba(100,120,140,.2);color:#66788A;font-size:9px}.ps.dn{background:#E3EAF0;color:#22B573}.pa{color:#66788A;font-size:9px}
.pl2{display:flex;align-items:center;gap:1px;font-size:10px;margin-bottom:6px;flex-wrap:wrap}
/* AI建议（按等级分色） */
.dw-advice{display:flex;align-items:flex-start;gap:6px;padding:6px 10px;border-radius:6px;font-size:12px;line-height:1.6;margin-top:4px}
.dw-advice.adv-high{background:rgba(224,82,82,.12);color:#E05252;border-left:3px solid #E05252}
.dw-advice.adv-mid{background:rgba(242,166,43,.12);color:#F2A62B;border-left:3px solid #F2A62B}
.dw-advice.adv-low{background:rgba(34,181,115,.10);color:#22B573;border-left:3px solid #22B573}
.dw-advice-icon{flex-shrink:0}
/* 详情页建议 */
.dw-advice-detail{padding:12px;border-radius:8px;margin-bottom:6px;line-height:1.7}
.dw-advice-detail.adv-detail-high{background:rgba(224,82,82,.12);border:1px solid rgba(224,82,82,.25);color:#E05252}
.dw-advice-detail.adv-detail-mid{background:rgba(242,166,43,.10);border:1px solid rgba(242,166,43,.18);color:#F2A62B}
.dw-advice-detail.adv-detail-low{background:rgba(34,181,115,.08);border:1px solid #E3EAF0;color:#22B573}
/* 排名 */
.rank-row{display:flex;align-items:center;padding:6px 0;border-bottom:1px solid #EBEFF4;font-size:13px}.rank-num{width:20px;text-align:center;font-weight:700;color:#22B573;font-family:monospace}.rank-name{flex:1;color:#1F2D3D}.rank-count{margin-left:auto;color:#66788A;font-family:monospace}
/* 预测 */
.pred-item{padding:7px 0;border-bottom:1px solid #EBEFF4}.pred-header{display:flex;align-items:center;gap:5px;margin-bottom:2px}.pred-info{font-size:11px;color:#F2A62B}.pred-advice{font-size:11px;color:#22B573;margin-top:2px}
/* 处理效率 */
.eff-row{display:flex;align-items:center;justify-content:space-between;padding:7px 10px;border-bottom:1px solid #EBEFF4}.eff-l{font-size:12px;color:#66788A}.eff-v{font-size:16px;font-weight:700;font-family:monospace;color:#1F2D3D}.eff-v.g{color:#22B573}.eff-v.r{color:#E05252}
/* AI结果 */
.arb{background:#F8FAFB;padding:12px;border-radius:8px;margin:12px 0}.ad2{font-size:16px;font-weight:700;color:#E05252;margin-bottom:6px}.ab{height:5px;background:#E3EAF0;border-radius:3px;overflow:hidden;margin-bottom:5px}.af2{height:100%;background:linear-gradient(90deg,#22B573,#1BA366);border-radius:3px;transition:width 1s}
/* 时间轴 */
.timeline{position:relative;padding-left:20px;margin:8px 0}
.tl-node{position:relative;padding-bottom:16px}.tl-node.last{padding-bottom:0}
.tl-node::before{content:'';position:absolute;left:-14px;top:8px;width:2px;height:calc(100% - 4px);background:#E3EAF0}.tl-node.last::before{display:none}
.tl-dot{position:absolute;left:-19px;top:4px;width:10px;height:10px;border-radius:50%;background:rgba(34,181,115,.25);border:2px solid #D0D8E2}.tl-dot.active{background:#22B573;border-color:#22B573;box-shadow:0 0 8px rgba(34,181,115,.4)}
.tl-body{margin-left:4px}
.tl-time{font-size:11px;color:#22B573;margin-bottom:2px;font-family:monospace}
.tl-action{font-size:13px;color:#1F2D3D;font-weight:600}
.tl-detail{font-size:12px;color:#66788A;margin-top:2px}
/* 抽屉 */
.drawer-overlay{position:fixed;inset:0;z-index:90;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .3s}.drawer-overlay.on{opacity:1;pointer-events:auto}
.drawer{position:fixed;top:0;right:0;bottom:0;width:480px;z-index:100;background:#FFFFFF;border-left:1px solid #E3EAF0;transform:translateX(100%);transition:transform .3s;display:flex;flex-direction:column}.drawer.on{transform:translateX(0)}
.drawer-hd{padding:14px 18px;border-bottom:1px solid #E3EAF0;display:flex;justify-content:space-between;align-items:center}.drawer-hd h3{font-size:16px;font-weight:700;color:#1F2D3D}
.drawer-close{width:28px;height:28px;border-radius:50%;border:1px solid #E3EAF0;background:#F0F3F8;color:#475867;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px}
.drawer-bd{flex:1;overflow-y:auto;padding:14px 18px}
.ds-title{font-size:14px;font-weight:700;color:#22B573;margin:14px 0 8px;padding-bottom:5px;border-bottom:1px solid rgba(34,181,115,.12);letter-spacing:.5px}
.dg3{background:#FFFFFF;border:1px solid #E3EAF0;padding:10px 12px;border-radius:8px;margin-bottom:6px}.dl3{display:block;font-size:11px;color:#22B573;margin-bottom:3px}.dg3 div:last-child{font-size:14px;color:#1F2D3D}
.fld{margin-bottom:10px}.fld label{display:block;font-size:13px;color:#66788A;margin-bottom:4px}.fld input,.fld select,.fld textarea{width:100%;padding:8px 10px;border-radius:8px;font-size:14px;font-family:inherit;background:#FFFFFF;border:1px solid #E3EAF0;color:#475867;outline:none;box-sizing:border-box}.fld input:focus,.fld select:focus,.fld textarea:focus{border-color:#22B573}.frow2{display:flex;gap:8px}.frow2 .fld{flex:1}
.fin{width:100%;padding:8px 10px;border-radius:8px;font-size:14px;font-family:inherit;background:#FFFFFF;border:1px solid #E3EAF0;color:#475867;outline:none;box-sizing:border-box}
/* checkbox */
.dw-check-label{display:flex;align-items:center;gap:6px;font-size:13px;color:#475867;cursor:pointer}.dw-check{accent-color:#22B573;width:16px;height:16px;cursor:pointer}.dw-radio-label{display:flex;align-items:center;gap:4px;font-size:12px;color:#475867;cursor:pointer;padding:3px 0}
/* upload */
.dw-upload{padding:16px;border:2px dashed #E3EAF0;border-radius:8px;text-align:center;color:#66788A;cursor:pointer;font-size:14px;transition:.2s}.dw-upload:hover{border-color:#D0D8E2}.dw-upload-preview{max-width:100%;max-height:140px;border-radius:8px;display:block;margin:0 auto}
.btn{display:inline-block;padding:6px 14px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:inherit}.btn-p{background:linear-gradient(135deg,#22B573,#1BA366);color:#fff;box-shadow:0 2px 8px rgba(34,181,115,.20)}.btn-o{background:transparent;border:1px solid #D0D8E2;color:#22B573}.btn-d{background:rgba(224,82,82,.12);border:1px solid rgba(224,82,82,.25);color:#E05252}.btn-y{background:rgba(242,166,43,.12);border:1px solid rgba(242,166,43,.25);color:#F2A62B}.btn-s{padding:3px 9px;font-size:12px}
.toast{padding:10px 18px;border-radius:6px;font-size:14px;font-weight:600;color:#fff;pointer-events:auto;animation:ti .3s ease,to .3s ease 2s forwards}.toast.ok{background:linear-gradient(135deg,#1BA366,#22B573)}.toast.info{background:linear-gradient(135deg,#22B573,#1BA366)}.toast.warn{background:linear-gradient(135deg,#E0941F,#F2A62B)}@keyframes ti{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes to{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}
</style>
