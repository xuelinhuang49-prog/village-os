// Fix modal height v2: all-inline styles + DOM-pin modal-box dimensions
// Scoped CSS cannot reach v-html content, so everything must be inline.
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. Replace showMyReports — all inline, no class dependencies =====
const oldFunc = `function showMyReports(filter) {
  if (filter) _myReportsFilter = filter
  var filters = ['全部', '待受理', '处理中', '已办结', '已驳回']
  var statusMap = { '待受理': '待受理', '处理中': '处理中', '已办结': '已办结', '已驳回': '已驳回' }
  var filtered = myEvents
  if (_myReportsFilter !== '全部') {
    filtered = myEvents.filter(function(e) { return e.status === statusMap[_myReportsFilter] })
  }
  // Fixed-height flex container — no height jumping between filters
  var h = '<div class="my-reports-container">'
  // Header: count
  h += '<div class="mr-header">'
  h += '<span style="font-size:12px;color:#B7D3E8">共 <b style="color:#39D98A">' + filtered.length + '</b> 条记录' + (_myReportsFilter !== '全部' ? '（已筛选）' : '') + '</span>'
  h += '</div>'
  // Filter tabs
  h += '<div class="mr-filters">'
  filters.forEach(function(f) {
    var isActive = _myReportsFilter === f
    var count = f === '全部' ? myEvents.length : myEvents.filter(function(e) { return e.status === statusMap[f] }).length
    h += '<button onclick="window._svc.filterMyReports(\\'' + f + '\\')" class="mr-filter-btn' + (isActive ? ' active' : '') + '" data-active="' + isActive + '">' + f + ' <span class="mr-filter-count">' + count + '</span></button>'
  })
  h += '</div>'
  // Scrollable list area — this is the part that scrolls
  h += '<div class="mr-list">'
  if (filtered.length === 0) {
    h += '<div class="mr-empty">📭 ' + (_myReportsFilter !== '全部' ? '该状态下暂无上报记录' : '暂无上报记录') + '</div>'
  } else {
    filtered.forEach(function(e) {
      var sc = { '处理中': '#f59e0b', '已办结': '#39D98A', '已驳回': '#E74C3C', '待受理': '#28C7FA', '已提交': '#28C7FA', '已受理': '#28C7FA' }
      var color = sc[e.status] || '#6F91A8'
      h += '<div onclick="window._svc.showMyEventDetailById(\\'' + e.id + '\\')" class="mr-card">'
      h += '<div class="mr-card-inner">'
      h += '<div class="mr-card-left">'
      h += '<div class="mr-card-title">' + e.type + '</div>'
      h += '<div class="mr-card-meta">'
      h += '<span>📅 ' + e.time + '</span><span>📍 ' + e.location + '</span>'
      if (e.latitude && e.longitude) h += '<span class="mr-gps-tag">🛰️ 已定位</span>'
      if (e.photos && e.photos.length > 0) h += '<span>📸 ' + e.photos.length + '张</span>'
      h += '</div></div>'
      h += '<div class="mr-card-right">'
      h += '<span class="mr-status" style="background:rgba(' + (e.status === '已办结' ? '57,217,138' : e.status === '处理中' ? '245,158,11' : e.status === '已驳回' ? '231,76,60' : '40,199,250') + ',0.12);color:' + color + '">' + e.status + '</span>'
      h += '<span class="mr-arrow">查看详情 →</span>'
      h += '</div></div></div>'
    })
    h += '<div class="mr-end-hint">— 共 ' + filtered.length + ' 条记录 —</div>'
  }
  h += '</div>'
  h += '</div>'
  openModal('📋 我的上报', h)
}`;

const newFunc = `function showMyReports(filter) {
  if (filter) _myReportsFilter = filter
  var filters = ['全部', '待受理', '处理中', '已办结', '已驳回']
  var statusMap = { '待受理': '待受理', '处理中': '处理中', '已办结': '已办结', '已驳回': '已驳回' }
  var filtered = myEvents
  if (_myReportsFilter !== '全部') {
    filtered = myEvents.filter(function(e) { return e.status === statusMap[_myReportsFilter] })
  }
  // ===== INLINE-STYLE CONTAINER — all styles inline because scoped CSS cannot reach v-html =====
  var CONTAINER_H = 640 // px — exact fixed height
  // Count bar
  var h = '<div style="flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 0 10px 0">'
  h += '<span style="font-size:13px;color:#B7D3E8">共 <b style="color:#39D98A">' + filtered.length + '</b> 条记录' + (_myReportsFilter !== '全部' ? '<span style="font-size:10px;color:#6F91A8;margin-left:4px">（已筛选）</span>' : '') + '</span>'
  h += '</div>'
  // Filter tabs — inline pill buttons
  h += '<div style="flex-shrink:0;display:flex;gap:6px;flex-wrap:wrap;padding:0 0 12px 0">'
  filters.forEach(function(f) {
    var isActive = _myReportsFilter === f
    var count = f === '全部' ? myEvents.length : myEvents.filter(function(e) { return e.status === statusMap[f] }).length
    var pillBg = isActive ? 'rgba(40,199,250,0.15)' : 'rgba(10,36,68,0.55)'
    var pillBorder = isActive ? '1px solid #28C7FA' : '1px solid rgba(40,199,111,0.12)'
    var pillColor = isActive ? '#28C7FA' : '#B7D3E8'
    var pillWeight = isActive ? '700' : '500'
    h += '<button onclick="window._svc.filterMyReports(\\'' + f + '\\')" style="padding:6px 14px;border-radius:16px;font-size:11px;font-weight:' + pillWeight + ';cursor:pointer;font-family:inherit;transition:all 0.2s;border:' + pillBorder + ';background:' + pillBg + ';color:' + pillColor + ';line-height:1.4" onmouseover="if(this.dataset.active===\\'false\\'){this.style.borderColor=\\'rgba(40,199,250,0.40)\\';this.style.background=\\'rgba(14,165,233,0.10)\\'}" onmouseout="if(this.dataset.active===\\'false\\'){this.style.borderColor=\\'rgba(40,199,111,0.12)\\';this.style.background=\\'rgba(10,36,68,0.55)\\'}" data-active="' + isActive + '">' + f + ' <span style="font-size:10px;opacity:0.65;margin-left:2px">' + count + '</span></button>'
  })
  h += '</div>'
  // Scrollable list — fills remaining height
  h += '<div style="flex:1 1 0;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:8px">'
  if (filtered.length === 0) {
    h += '<div style="flex:1;display:flex;align-items:center;justify-content:center;color:#6F91A8;font-size:13px">📭 ' + (_myReportsFilter !== '全部' ? '该状态下暂无上报记录' : '暂无上报记录') + '</div>'
  } else {
    filtered.forEach(function(e) {
      var sc = { '处理中': '#f59e0b', '已办结': '#39D98A', '已驳回': '#E74C3C', '待受理': '#28C7FA', '已提交': '#28C7FA', '已受理': '#28C7FA' }
      var color = sc[e.status] || '#6F91A8'
      h += '<div onclick="window._svc.showMyEventDetailById(\\'' + e.id + '\\')" style="flex-shrink:0;padding:12px 14px;background:rgba(10,36,68,0.40);border:1px solid rgba(40,199,111,0.08);border-radius:8px;cursor:pointer;transition:all 0.2s" onmouseover="this.style.background=\\'rgba(14,165,233,0.08)\\';this.style.borderColor=\\'rgba(40,199,111,0.20)\\'" onmouseout="this.style.background=\\'rgba(10,36,68,0.40)\\';this.style.borderColor=\\'rgba(40,199,111,0.08)\\'">'
      h += '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">'
      h += '<div style="flex:1;min-width:0">'
      h += '<div style="font-size:13px;font-weight:600;color:#D0E4F5;margin-bottom:4px">' + e.type + '</div>'
      h += '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:10px;color:#6F91A8">'
      h += '<span>📅 ' + e.time + '</span><span>📍 ' + e.location + '</span>'
      if (e.latitude && e.longitude) h += '<span style="color:#39D98A">🛰️ 已定位</span>'
      if (e.photos && e.photos.length > 0) h += '<span>📸 ' + e.photos.length + '张</span>'
      h += '</div></div>'
      h += '<div style="flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:4px">'
      h += '<span style="display:inline-block;padding:3px 10px;border-radius:10px;font-size:10px;font-weight:600;background:rgba(' + (e.status === '已办结' ? '57,217,138' : e.status === '处理中' ? '245,158,11' : e.status === '已驳回' ? '231,76,60' : '40,199,250') + ',0.12);color:' + color + '">' + e.status + '</span>'
      h += '<span style="font-size:9px;color:#6F91A8">查看详情 →</span>'
      h += '</div></div></div>'
    })
    h += '<div style="flex-shrink:0;text-align:center;font-size:10px;color:rgba(111,145,168,0.45);padding:6px 0 2px 0">— 共 ' + filtered.length + ' 条记录 —</div>'
  }
  h += '</div>'
  // Wrap in flex column with explicit height
  h = '<div style="display:flex;flex-direction:column;width:100%;height:' + CONTAINER_H + 'px;overflow:hidden;box-sizing:border-box">' + h + '</div>'
  openModal('📋 我的上报', h)
  // Pin modal-box dimensions — override default 500px width + overflow-y:auto
  setTimeout(function() {
    var box = document.querySelector('.modal.show .modal-box')
    if (box) {
      box.style.width = '760px'
      box.style.maxWidth = '90vw'
      box.style.height = (CONTAINER_H + 72) + 'px' // 72 = h3 + padding
      box.style.maxHeight = '85vh'
      box.style.overflow = 'hidden'
      box.style.padding = '20px 24px'
      box.style.boxSizing = 'border-box'
    }
  }, 30)
}`;

if (s.includes(oldFunc)) {
  s = s.replace(oldFunc, newFunc);
  check('1-showMyReports', true);
} else { check('1-showMyReports', false); }

// ===== 2. Replace showMyEventDetail to also pin modal size =====
const oldDetailFunc = `function showMyEventDetailById(id) {
  var e = myEvents.find(function(x) { return x.id === id })
  if (e) showMyEventDetail(e)
}`;

// Add modal-box pinning after event detail opens
const newDetailFunc = `function showMyEventDetailById(id) {
  var e = myEvents.find(function(x) { return x.id === id })
  if (e) showMyEventDetail(e)
  // Reset modal box to default for event detail
  setTimeout(function() {
    var box = document.querySelector('.modal.show .modal-box')
    if (box) {
      box.style.width = ''; box.style.maxWidth = ''; box.style.height = ''
      box.style.maxHeight = ''; box.style.overflow = ''; box.style.padding = ''
      box.style.boxSizing = ''
    }
  }, 30)
}`;

if (s.includes(oldDetailFunc)) {
  s = s.replace(oldDetailFunc, newDetailFunc);
  check('2-detailModal', true);
} else { check('2-detailModal', false); }

// ===== 3. Remove unused scoped CSS for mr-* classes =====
const oldMrCss = `
/* ========== MY REPORTS MODAL — fixed height ========== */
.my-reports-container {
  display:flex; flex-direction:column; height:560px; max-height:70vh;
  width:100%; min-width:0;
}
.mr-header { flex-shrink:0; margin-bottom:10px }
.mr-filters { flex-shrink:0; display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px }
.mr-filter-btn {
  padding:5px 12px; border-radius:14px; font-size:11px; font-weight:500;
  cursor:pointer; font-family:inherit; transition:all .2s;
  border:1px solid rgba(40,199,111,0.12); background:rgba(10,36,68,0.55); color:#B7D3E8;
}
.mr-filter-btn:hover { border-color:rgba(40,199,111,0.30); background:rgba(14,165,233,0.08) }
.mr-filter-btn.active { border-color:#28C7FA; background:rgba(40,199,250,0.15); color:#28C7FA; font-weight:700 }
.mr-filter-count { font-size:10px; opacity:0.7; margin-left:2px }

.mr-list { flex:1; overflow-y:auto; min-height:0; display:flex; flex-direction:column; gap:8px }
.mr-list::-webkit-scrollbar { width:3px }
.mr-list::-webkit-scrollbar-thumb { background:rgba(57,217,138,0.15); border-radius:2px }

.mr-empty { flex:1; display:flex; align-items:center; justify-content:center; color:#6F91A8; font-size:12px }

.mr-card {
  padding:12px 14px; background:rgba(10,36,68,0.40);
  border:1px solid rgba(40,199,111,0.08); border-radius:8px;
  cursor:pointer; transition:all .2s; flex-shrink:0;
}
.mr-card:hover { background:rgba(14,165,233,0.08); border-color:rgba(40,199,111,0.20) }
.mr-card-inner { display:flex; align-items:flex-start; justify-content:space-between; gap:10px }
.mr-card-left { flex:1; min-width:0 }
.mr-card-title { font-size:13px; font-weight:600; color:#D0E4F5; margin-bottom:4px }
.mr-card-meta { display:flex; align-items:center; gap:10px; flex-wrap:wrap; font-size:10px; color:#6F91A8 }
.mr-gps-tag { color:#39D98A }
.mr-card-right { flex-shrink:0; display:flex; flex-direction:column; align-items:flex-end; gap:4px }
.mr-status { display:inline-block; padding:3px 10px; border-radius:10px; font-size:10px; font-weight:600 }
.mr-arrow { font-size:9px; color:#6F91A8 }
.mr-end-hint { flex-shrink:0; text-align:center; font-size:10px; color:rgba(111,145,168,0.5); padding:8px 0 4px 0 }`;

if (s.includes(oldMrCss)) {
  s = s.replace(oldMrCss, '');
  check('3-removeUnusedCss', true);
} else { check('3-removeUnusedCss', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== FIXED MODAL HEIGHT V2 FINAL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
