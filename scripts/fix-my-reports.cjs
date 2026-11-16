// Rewrite showMyReports as full modal + showMyEventDetail with GPS/photos/timeline
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. Add filter state variable =====
const oldStateLine = `let _reportPhotoInputId = 'reportPhotoInput_' + Date.now()`;
const newStateLine = `let _reportPhotoInputId = 'reportPhotoInput_' + Date.now()
let _myReportsFilter = '全部'`;
if (s.includes(oldStateLine)) {
  s = s.replace(oldStateLine, newStateLine);
  check('1-filterState', true);
} else { check('1-filterState', false); }

// ===== 2. Replace showMyReports =====
const oldShowMyReports = `function showMyReports() {
  const el = document.querySelector('.page-content[key="governance"]')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  toast('共 ' + myEvents.length + ' 条上报记录', 'info')
}`;

const newShowMyReports = `function showMyReports(filter) {
  if (filter) _myReportsFilter = filter
  renderMyReportsModal()
  openModal('📋 我的上报', '')
  // Replace modal content directly for full control
  setTimeout(function() {
    const box = document.querySelector('.modal-box')
    if (box) {
      const h3 = box.querySelector('h3')
      const content = renderMyReportsModal()
      if (h3) {
        // Keep h3, replace everything after
        box.innerHTML = ''
        box.appendChild(h3)
        const div = document.createElement('div')
        div.innerHTML = content
        box.appendChild(div)
      }
    }
  }, 50)
}

function renderMyReportsModal() {
  const filters = ['全部', '待受理', '处理中', '已办结', '已驳回']
  const statusMap = { '待受理': '待受理', '处理中': '处理中', '已办结': '已办结', '已驳回': '已驳回' }
  let filtered = myEvents
  if (_myReportsFilter !== '全部') {
    filtered = myEvents.filter(function(e) { return e.status === statusMap[_myReportsFilter] })
  }
  // Override openModal by using it directly
  let h = ''
  // Count line
  h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">'
  h += '<span style="font-size:12px;color:#B7D3E8">共 <b style="color:#39D98A">' + filtered.length + '</b> 条记录' + (_myReportsFilter !== '全部' ? '（已筛选）' : '') + '</span>'
  h += '</div>'
  // Filter tabs
  h += '<div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">'
  filters.forEach(function(f) {
    const isActive = _myReportsFilter === f
    const count = f === '全部' ? myEvents.length : myEvents.filter(function(e) { return e.status === statusMap[f] }).length
    h += '<button onclick="window._svc.filterMyReports(\\'' + f + '\\')" style="padding:5px 12px;border-radius:14px;font-size:11px;font-weight:' + (isActive ? '700' : '500') + ';cursor:pointer;font-family:inherit;transition:all 0.2s;border:1px solid ' + (isActive ? '#28C7FA' : 'rgba(40,199,111,0.12)') + ';background:' + (isActive ? 'rgba(40,199,250,0.15)' : 'rgba(10,36,68,0.55)') + ';color:' + (isActive ? '#28C7FA' : '#B7D3E8') + '" onmouseover="if(!this.dataset.active)this.style.borderColor=\\'rgba(40,199,111,0.30)\\';this.style.background=\\'rgba(14,165,233,0.08)\\'" onmouseout="if(!this.dataset.active){this.style.borderColor=\\'rgba(40,199,111,0.12)\\';this.style.background=\\'rgba(10,36,68,0.55)\\'}" data-active="' + isActive + '">' + f + ' <span style="font-size:10px;opacity:0.7">' + count + '</span></button>'
  })
  h += '</div>'
  // Event cards
  if (filtered.length === 0) {
    h += '<div style="text-align:center;padding:40px 0;color:#6F91A8;font-size:12px">📭 ' + (_myReportsFilter !== '全部' ? '该状态下暂无上报记录' : '暂无上报记录') + '</div>'
  } else {
    h += '<div style="display:flex;flex-direction:column;gap:8px;max-height:55vh;overflow-y:auto">'
    filtered.forEach(function(e, idx) {
      const statusColorMap = { '处理中': '#f59e0b', '已办结': '#39D98A', '已驳回': '#E74C3C', '待受理': '#28C7FA', '已提交': '#28C7FA', '已受理': '#28C7FA' }
      const statusColor = statusColorMap[e.status] || '#6F91A8'
      h += '<div onclick="window._svc.showMyEventDetailById(\\'' + e.id + '\\')" style="padding:12px 14px;background:rgba(10,36,68,0.40);border:1px solid rgba(40,199,111,0.08);border-radius:8px;cursor:pointer;transition:all 0.2s" onmouseover="this.style.background=\\'rgba(14,165,233,0.08)\\';this.style.borderColor=\\'rgba(40,199,111,0.20)\\'" onmouseout="this.style.background=\\'rgba(10,36,68,0.40)\\';this.style.borderColor=\\'rgba(40,199,111,0.08)\\'">'
      h += '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">'
      // Left: info
      h += '<div style="flex:1;min-width:0">'
      h += '<div style="font-size:13px;font-weight:600;color:#D0E4F5;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + e.type + ' · ' + (e.title || e.location) + '</div>'
      h += '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:10px;color:#6F91A8">'
      h += '<span>📅 ' + e.time + '</span>'
      h += '<span>📍 ' + e.location + '</span>'
      if (e.latitude && e.longitude) h += '<span style="color:#39D98A">🛰️ 已定位</span>'
      if (e.photos && e.photos.length > 0) h += '<span>📸 ' + e.photos.length + '张</span>'
      h += '</div></div>'
      // Right: status + arrow
      h += '<div style="flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:4px">'
      h += '<span style="display:inline-block;padding:3px 10px;border-radius:10px;font-size:10px;font-weight:600;background:rgba(' + (e.status === '已办结' ? '57,217,138' : e.status === '处理中' ? '245,158,11' : e.status === '已驳回' ? '231,76,60' : '40,199,250') + ',0.12);color:' + statusColor + '">' + e.status + '</span>'
      h += '<span style="font-size:9px;color:#6F91A8">查看详情 →</span>'
      h += '</div></div></div>'
    })
    h += '</div>'
  }
  // Hack: the openModal wraps content in h3, so we return inner content only
  // Actually we need to rebuild the modal completely
  return h
}`;

if (s.includes(oldShowMyReports)) {
  s = s.replace(oldShowMyReports, newShowMyReports);
  check('2-showMyReports', true);
} else { check('2-showMyReports', false); }

// ===== 3. Now we need a better approach: let's write a dedicated modal function for my reports =====
const oldShowMyReportsFunc = `function showMyReports(filter) {
  if (filter) _myReportsFilter = filter
  renderMyReportsModal()
  openModal('📋 我的上报', '')
  // Replace modal content directly for full control
  setTimeout(function() {
    const box = document.querySelector('.modal-box')
    if (box) {
      const h3 = box.querySelector('h3')
      const content = renderMyReportsModal()
      if (h3) {
        // Keep h3, replace everything after
        box.innerHTML = ''
        box.appendChild(h3)
        const div = document.createElement('div')
        div.innerHTML = content
        box.appendChild(div)
      }
    }
  }, 50)
}`;

// Replace with cleaner version that uses openModal properly
const cleanShowMyReports = `function showMyReports(filter) {
  if (filter) _myReportsFilter = filter
  var filters = ['全部', '待受理', '处理中', '已办结', '已驳回']
  var statusMap = { '待受理': '待受理', '处理中': '处理中', '已办结': '已办结', '已驳回': '已驳回' }
  var filtered = myEvents
  if (_myReportsFilter !== '全部') {
    filtered = myEvents.filter(function(e) { return e.status === statusMap[_myReportsFilter] })
  }
  var h = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">'
  h += '<span style="font-size:12px;color:#B7D3E8">共 <b style="color:#39D98A">' + filtered.length + '</b> 条记录' + (_myReportsFilter !== '全部' ? '（已筛选）' : '') + '</span>'
  h += '</div>'
  // Filter tabs
  h += '<div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">'
  filters.forEach(function(f) {
    var isActive = _myReportsFilter === f
    var count = f === '全部' ? myEvents.length : myEvents.filter(function(e) { return e.status === statusMap[f] }).length
    h += '<button onclick="window._svc.filterMyReports(\\'' + f + '\\')" style="padding:5px 12px;border-radius:14px;font-size:11px;font-weight:' + (isActive ? '700' : '500') + ';cursor:pointer;font-family:inherit;transition:all 0.2s;border:1px solid ' + (isActive ? '#28C7FA' : 'rgba(40,199,111,0.12)') + ';background:' + (isActive ? 'rgba(40,199,250,0.15)' : 'rgba(10,36,68,0.55)') + ';color:' + (isActive ? '#28C7FA' : '#B7D3E8') + '" onmouseover="if(this.dataset.active===\\'false\\'){this.style.borderColor=\\'rgba(40,199,111,0.30)\\';this.style.background=\\'rgba(14,165,233,0.08)\\'}" onmouseout="if(this.dataset.active===\\'false\\'){this.style.borderColor=\\'rgba(40,199,111,0.12)\\';this.style.background=\\'rgba(10,36,68,0.55)\\'}" data-active="' + isActive + '">' + f + ' <span style="font-size:10px;opacity:0.7">' + count + '</span></button>'
  })
  h += '</div>'
  // Event cards
  if (filtered.length === 0) {
    h += '<div style="text-align:center;padding:40px 0;color:#6F91A8;font-size:12px">📭 ' + (_myReportsFilter !== '全部' ? '该状态下暂无上报记录' : '暂无上报记录') + '</div>'
  } else {
    h += '<div style="display:flex;flex-direction:column;gap:8px;max-height:55vh;overflow-y:auto">'
    filtered.forEach(function(e) {
      var sc = { '处理中': '#f59e0b', '已办结': '#39D98A', '已驳回': '#E74C3C', '待受理': '#28C7FA', '已提交': '#28C7FA', '已受理': '#28C7FA' }
      var color = sc[e.status] || '#6F91A8'
      h += '<div onclick="window._svc.showMyEventDetailById(\\'' + e.id + '\\')" style="padding:12px 14px;background:rgba(10,36,68,0.40);border:1px solid rgba(40,199,111,0.08);border-radius:8px;cursor:pointer;transition:all 0.2s" onmouseover="this.style.background=\\'rgba(14,165,233,0.08)\\';this.style.borderColor=\\'rgba(40,199,111,0.20)\\'" onmouseout="this.style.background=\\'rgba(10,36,68,0.40)\\';this.style.borderColor=\\'rgba(40,199,111,0.08)\\'">'
      h += '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">'
      h += '<div style="flex:1;min-width:0">'
      h += '<div style="font-size:13px;font-weight:600;color:#D0E4F5;margin-bottom:4px">' + e.type + '</div>'
      h += '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:10px;color:#6F91A8">'
      h += '<span>📅 ' + e.time + '</span><span>📍 ' + e.location + '</span>'
      if (e.latitude && e.longitude) h += '<span style="color:#39D98A">🛰️ 已定位</span>'
      if (e.photos && e.photos.length > 0) h += '<span>📸 ' + e.photos.length + '张</span>'
      h += '</div></div>'
      h += '<div style="flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:4px">'
      h += '<span style="display:inline-block;padding:3px 10px;border-radius:10px;font-size:10px;font-weight:600;color:' + color + '">' + e.status + '</span>'
      h += '<span style="font-size:9px;color:#6F91A8">查看详情 →</span>'
      h += '</div></div></div>'
    })
    h += '</div>'
  }
  openModal('📋 我的上报', h)
}

function filterMyReports(filter) {
  showMyReports(filter)
}`;

if (s.includes(oldShowMyReportsFunc)) {
  s = s.replace(oldShowMyReportsFunc, cleanShowMyReports);
  check('2b-cleanShowMyReports', true);
} else { check('2b-cleanShowMyReports', false); }

// Also remove the orphan renderMyReportsModal function
const orphanRender = `
function renderMyReportsModal() {
  const filters = ['全部', '待受理', '处理中', '已办结', '已驳回']
  const statusMap = { '待受理': '待受理', '处理中': '处理中', '已办结': '已办结', '已驳回': '已驳回' }
  let filtered = myEvents
  if (_myReportsFilter !== '全部') {
    filtered = myEvents.filter(function(e) { return e.status === statusMap[_myReportsFilter] })
  }
  // Override openModal by using it directly
  let h = ''
  // Count line
  h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">'
  h += '<span style="font-size:12px;color:#B7D3E8">共 <b style="color:#39D98A">' + filtered.length + '</b> 条记录' + (_myReportsFilter !== '全部' ? '（已筛选）' : '') + '</span>'
  h += '</div>'
  // Filter tabs
  h += '<div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">'
  filters.forEach(function(f) {
    const isActive = _myReportsFilter === f
    const count = f === '全部' ? myEvents.length : myEvents.filter(function(e) { return e.status === statusMap[f] }).length
    h += '<button onclick="window._svc.filterMyReports(\\'' + f + '\\')" style="padding:5px 12px;border-radius:14px;font-size:11px;font-weight:' + (isActive ? '700' : '500') + ';cursor:pointer;font-family:inherit;transition:all 0.2s;border:1px solid ' + (isActive ? '#28C7FA' : 'rgba(40,199,111,0.12)') + ';background:' + (isActive ? 'rgba(40,199,250,0.15)' : 'rgba(10,36,68,0.55)') + ';color:' + (isActive ? '#28C7FA' : '#B7D3E8') + '" onmouseover="if(!this.dataset.active)this.style.borderColor=\\'rgba(40,199,111,0.30)\\';this.style.background=\\'rgba(14,165,233,0.08)\\'" onmouseout="if(!this.dataset.active){this.style.borderColor=\\'rgba(40,199,111,0.12)\\';this.style.background=\\'rgba(10,36,68,0.55)\\'}" data-active="' + isActive + '">' + f + ' <span style="font-size:10px;opacity:0.7">' + count + '</span></button>'
  })
  h += '</div>'
  // Event cards
  if (filtered.length === 0) {
    h += '<div style="text-align:center;padding:40px 0;color:#6F91A8;font-size:12px">📭 ' + (_myReportsFilter !== '全部' ? '该状态下暂无上报记录' : '暂无上报记录') + '</div>'
  } else {
    h += '<div style="display:flex;flex-direction:column;gap:8px;max-height:55vh;overflow-y:auto">'
    filtered.forEach(function(e, idx) {
      const statusColorMap = { '处理中': '#f59e0b', '已办结': '#39D98A', '已驳回': '#E74C3C', '待受理': '#28C7FA', '已提交': '#28C7FA', '已受理': '#28C7FA' }
      const statusColor = statusColorMap[e.status] || '#6F91A8'
      h += '<div onclick="window._svc.showMyEventDetailById(\\'' + e.id + '\\')" style="padding:12px 14px;background:rgba(10,36,68,0.40);border:1px solid rgba(40,199,111,0.08);border-radius:8px;cursor:pointer;transition:all 0.2s" onmouseover="this.style.background=\\'rgba(14,165,233,0.08)\\';this.style.borderColor=\\'rgba(40,199,111,0.20)\\'" onmouseout="this.style.background=\\'rgba(10,36,68,0.40)\\';this.style.borderColor=\\'rgba(40,199,111,0.08)\\'">'
      h += '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">'
      // Left: info
      h += '<div style="flex:1;min-width:0">'
      h += '<div style="font-size:13px;font-weight:600;color:#D0E4F5;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + e.type + ' · ' + (e.title || e.location) + '</div>'
      h += '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:10px;color:#6F91A8">'
      h += '<span>📅 ' + e.time + '</span>'
      h += '<span>📍 ' + e.location + '</span>'
      if (e.latitude && e.longitude) h += '<span style="color:#39D98A">🛰️ 已定位</span>'
      if (e.photos && e.photos.length > 0) h += '<span>📸 ' + e.photos.length + '张</span>'
      h += '</div></div>'
      // Right: status + arrow
      h += '<div style="flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:4px">'
      h += '<span style="display:inline-block;padding:3px 10px;border-radius:10px;font-size:10px;font-weight:600;background:rgba(' + (e.status === '已办结' ? '57,217,138' : e.status === '处理中' ? '245,158,11' : e.status === '已驳回' ? '231,76,60' : '40,199,250') + ',0.12);color:' + statusColor + '">' + e.status + '</span>'
      h += '<span style="font-size:9px;color:#6F91A8">查看详情 →</span>'
      h += '</div></div></div>'
    })
    h += '</div>'
  }
  // Hack: the openModal wraps content in h3, so we return inner content only
  // Actually we need to rebuild the modal completely
  return h
}`;

if (s.includes(orphanRender)) {
  s = s.replace(orphanRender, '');
  check('2c-removeOrphan', true);
} else { check('2c-removeOrphan', false); }

// ===== 4. Rewrite showMyEventDetail with GPS, photos, rich timeline =====
const oldShowEventDetail = `function showMyEventDetail(e) {
  const statusColors = { '处理中': '#f59e0b', '已办结': '#39D98A', '已驳回': '#E74C3C', '已提交': '#28C7FA', '已受理': '#28C7FA' }
  let timelineHtml = ''
  if (e.timeline && e.timeline.length > 0) {
    timelineHtml = '<div class="detail-section"><h4>流转记录</h4><div style="position:relative;padding-left:16px">'
    e.timeline.forEach((t, i) => {
      const isLast = i === e.timeline.length - 1
      const color = statusColors[t.status] || '#6F91A8'
      timelineHtml += '<div style="position:relative;padding-bottom:' + (isLast ? '0' : '16px') + '">'
      if (!isLast) timelineHtml += '<div style="position:absolute;left:-13px;top:8px;bottom:-8px;width:2px;background:rgba(40,199,111,0.12)"></div>'
      timelineHtml += '<div style="position:absolute;left:-16px;top:4px;width:8px;height:8px;border-radius:50%;background:' + color + ';box-shadow:0 0 6px ' + color + '"></div>'
      timelineHtml += '<div style="font-size:11px;color:#6F91A8;margin-bottom:2px">' + t.time + '</div>'
      timelineHtml += '<div style="font-size:12px;color:#D0E4F5"><span style="color:' + color + ';font-weight:600">' + t.status + '</span> · ' + t.desc + '</div>'
      timelineHtml += '</div>'
    })
    timelineHtml += '</div></div>'
  }
  const c = '<div class="detail-section"><h4>事件详情</h4><div class="detail-field"><span class="df-lbl">事件编号</span><span class="df-val">' + e.id + '</span></div><div class="detail-field"><span class="df-lbl">事项类型</span><span class="df-val">' + e.type + '</span></div><div class="detail-field"><span class="df-lbl">发生地点</span><span class="df-val">' + e.location + '</span></div><div class="detail-field"><span class="df-lbl">上报时间</span><span class="df-val">' + e.time + '</span></div><div class="detail-field"><span class="df-lbl">当前状态</span><span class="df-val"><span class="st ' + e.statusCls + '">' + e.status + '</span></span></div></div>' + timelineHtml + '<div class="detail-actions"><button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">关闭</button></div>'
  openDetail('事件 ' + e.id, c)
}`;

const newShowEventDetail = `function showMyEventDetailById(id) {
  var e = myEvents.find(function(x) { return x.id === id })
  if (e) showMyEventDetail(e)
}

function showMyEventDetail(e) {
  var colors = { '处理中': '#f59e0b', '已办结': '#39D98A', '已驳回': '#E74C3C', '待受理': '#28C7FA', '已提交': '#28C7FA', '已受理': '#28C7FA' }
  var h = ''
  // Header: event ID + type
  h += '<div style="text-align:center;padding:8px 0 16px 0">'
  h += '<div style="font-size:11px;color:#6F91A8;margin-bottom:4px">' + e.id + '</div>'
  h += '<h3 style="color:#fff;margin:0;font-size:15px">' + e.type + '</h3>'
  h += '</div>'
  // Basic info section
  h += '<div class="detail-section"><h4>基本信息</h4>'
  h += '<div class="detail-field"><span class="df-lbl">问题类型</span><span class="df-val">' + e.type + '</span></div>'
  h += '<div class="detail-field"><span class="df-lbl">问题描述</span><span class="df-val" style="max-width:200px;white-space:normal;text-align:right">' + (e.description || e.location) + '</span></div>'
  h += '<div class="detail-field"><span class="df-lbl">发生地点</span><span class="df-val">📍 ' + e.location + '</span></div>'
  h += '<div class="detail-field"><span class="df-lbl">上报时间</span><span class="df-val">' + e.time + '</span></div>'
  h += '<div class="detail-field"><span class="df-lbl">当前状态</span><span class="df-val"><span class="st ' + e.statusCls + '" style="font-size:11px">' + e.status + '</span></span></div>'
  h += '</div>'
  // GPS section
  if (e.latitude && e.longitude) {
    h += '<div class="detail-section"><h4>🛰️ GPS 位置</h4>'
    h += '<div style="background:rgba(10,36,68,0.55);border-radius:8px;padding:12px">'
    h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="background:rgba(57,217,138,0.12);color:#39D98A;padding:3px 8px;border-radius:4px;font-size:10px;font-weight:600">✅ 已定位</span></div>'
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px">'
    h += '<div><span style="color:#6F91A8">纬度</span><div style="color:#D0E4F5;font-weight:600">' + e.latitude.toFixed(6) + '</div></div>'
    h += '<div><span style="color:#6F91A8">经度</span><div style="color:#D0E4F5;font-weight:600">' + e.longitude.toFixed(6) + '</div></div>'
    if (e.location_accuracy) h += '<div style="grid-column:1/-1"><span style="color:#6F91A8">定位精度</span><div style="color:#D0E4F5">±' + Math.round(e.location_accuracy) + 'm</div></div>'
    h += '</div>'
    h += '<div style="font-size:10px;color:#6F91A8;margin-top:8px">📍 ' + e.location + '</div>'
    h += '</div></div>'
  } else {
    h += '<div class="detail-section"><h4>🛰️ GPS 位置</h4>'
    h += '<div style="font-size:11px;color:#6F91A8;padding:8px 0">未获取定位信息（上报时未开启定位或定位失败）</div>'
    h += '</div>'
  }
  // Photos section
  if (e.photos && e.photos.length > 0) {
    h += '<div class="detail-section"><h4>📸 现场照片（' + e.photos.length + '张）</h4>'
    h += '<div style="display:flex;gap:8px;flex-wrap:wrap">'
    e.photos.forEach(function(p) {
      if (p.dataUrl) {
        h += '<div style="width:80px;height:80px;border-radius:6px;overflow:hidden;border:1px solid rgba(40,199,111,0.18)"><img src="' + p.dataUrl + '" style="width:100%;height:100%;object-fit:cover" onclick="window._svc.previewPhoto(\\'' + p.dataUrl.replace(/'/g, "\\'") + '\\')" /></div>'
      } else {
        h += '<div style="width:80px;height:80px;border-radius:6px;background:rgba(10,36,68,0.55);border:1px solid rgba(40,199,111,0.12);display:flex;align-items:center;justify-content:center;font-size:24px">📄</div>'
      }
    })
    h += '</div></div>'
  }
  // Timeline section
  if (e.timeline && e.timeline.length > 0) {
    h += '<div class="detail-section"><h4>📋 处理进度</h4>'
    h += '<div style="position:relative;padding-left:20px">'
    e.timeline.forEach(function(t, i) {
      var isLast = i === e.timeline.length - 1
      var color = colors[t.status] || '#6F91A8'
      h += '<div style="position:relative;padding-bottom:' + (isLast ? '4px' : '20px') + '">'
      if (!isLast) h += '<div style="position:absolute;left:-17px;top:10px;bottom:-10px;width:2px;background:rgba(40,199,111,0.10)"></div>'
      // Dot
      h += '<div style="position:absolute;left:-20px;top:6px;width:8px;height:8px;border-radius:50%;background:' + color + ';box-shadow:0 0 8px ' + color + '"></div>'
      // Content
      h += '<div style="font-size:10px;color:#6F91A8;margin-bottom:2px">' + t.time + '</div>'
      h += '<div style="font-size:11px;color:#D0E4F5"><span style="display:inline-block;padding:1px 8px;border-radius:10px;font-size:9px;font-weight:600;color:' + color + ';margin-right:6px">● ' + t.status + '</span>' + t.desc + '</div>'
      h += '</div>'
    })
    h += '</div></div>'
  }
  // Action buttons
  h += '<div class="detail-actions">'
  h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">关闭</button>'
  if (e.status === '处理中' || e.status === '待受理') {
    h += '<button class="btn btn-outline" onclick="window._svc.toast(\\'催办已发送\\',\\'info\\')" style="color:#f59e0b;border-color:rgba(245,158,11,0.3)">⏳ 催办</button>'
  }
  h += '</div>'
  openModal('事件详情', h)
}

function previewPhoto(dataUrl) {
  var h = '<div style="text-align:center"><img src="' + dataUrl + '" style="max-width:100%;max-height:70vh;border-radius:8px" /></div>'
  h += '<div style="text-align:center;margin-top:10px"><button class="btn btn-outline btn-sm" onclick="window._closeModal && window._closeModal()">关闭</button></div>'
  openModal('📸 照片预览', h)
}`;

if (s.includes(oldShowEventDetail)) {
  s = s.replace(oldShowEventDetail, newShowEventDetail);
  check('3-showEventDetail', true);
} else { check('3-showEventDetail', false); }

// ===== 5. Update window._svc handlers =====
const oldSvc = `  window._svc = {
    selectReportType, prevReportStep, addReportPhoto, removeReportPhoto,
    triggerPhotoUpload, handlePhotoSelected, getCurrentLocation,
    submitReport, closeAndRefresh, callGridWorker, showNoticeDetailById,
    toast, openResource: function(url) { toast('打开资源：' + url, 'info') }
  }`;
const newSvc = `  window._svc = {
    selectReportType, prevReportStep, addReportPhoto, removeReportPhoto,
    triggerPhotoUpload, handlePhotoSelected, getCurrentLocation,
    submitReport, closeAndRefresh, callGridWorker, showNoticeDetailById,
    showMyEventDetailById, filterMyReports, previewPhoto,
    toast, openResource: function(url) { toast('打开资源：' + url, 'info') }
  }`;
if (s.includes(oldSvc)) {
  s = s.replace(oldSvc, newSvc);
  check('4-svcHandlers', true);
} else { check('4-svcHandlers', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== MY REPORTS OVERHAUL FINAL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
