// Fix 5 issues from user feedback on governance light theme:
// 1. 事件上报 step-1 option cards: dark-navy onmouseout -> white/light-green hover
// 2. Modal height: 我的上报 too tall (640->500); stale pinned height leaks to other modals
// 3. 村务公告 notice rows: dark-navy onmouseout -> white; broken tag background (solid color)
// 4. 事件详情: rewrite basic-info into a proper info card, merge GPS into it
// 5. 网格员信息 "查看我的网格" btn: .btn-outline renders white text on white -> scoped light buttons
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. openGovModal: reset pinned dimensions so stale height doesn't leak =====
const oldOpenGov = `function openGovModal(title, content) {
  openModal(title, content)
  nextTick(() => {
    var box = document.querySelector('.modal.show .modal-box')
    if (box) box.classList.add('modal-light')
  })
}`;
const newOpenGov = `function openGovModal(title, content) {
  openModal(title, content)
  nextTick(() => {
    var box = document.querySelector('.modal.show .modal-box')
    if (box) {
      box.classList.add('modal-light')
      // reset any pinned dimensions from a previous modal (avoid stale height/width leaking)
      box.style.width = ''; box.style.maxWidth = ''; box.style.height = ''
      box.style.maxHeight = ''; box.style.overflow = ''; box.style.padding = ''; box.style.boxSizing = ''
    }
  })
}`;
if (s.includes(oldOpenGov)) { s = s.replace(oldOpenGov, newOpenGov); check('1-openGovModal-reset', true); }
else { check('1-openGovModal-reset', false); }

// ===== 2. CSS: light buttons inside light modal (unscoped, after .detail-field rule) =====
const cssAnchor = '.modal-box.modal-light .detail-field { border-bottom-color:#EBEFF4 }';
const cssAdd = cssAnchor + `
.modal-box.modal-light .btn-outline { background:#FFFFFF; border:1px solid #C8D4E0; color:#1F2D3D }
.modal-box.modal-light .btn-outline:hover { background:#FFFFFF; border-color:#19B98A; color:#19B98A }
.modal-box.modal-light .btn-primary { background:linear-gradient(135deg,#19B98A,#16A37A); color:#fff; box-shadow:0 2px 8px rgba(25,185,138,0.25) }
.modal-box.modal-light .btn-primary:hover { box-shadow:0 4px 14px rgba(25,185,138,0.35) }`;
if (s.includes(cssAnchor)) { s = s.replace(cssAnchor, cssAdd); check('2-modal-light-buttons-css', true); }
else { check('2-modal-light-buttons-css', false); }

// ===== 3. 事件上报 step-1 option cards: light-green hover, white default =====
const oldOptHover = `onmouseover="this.style.background=\\'#E3EAF0\\';this.style.borderColor=\\'rgba(25,185,138,0.25)\\'" onmouseout="this.style.background=\\'rgba(10,36,68,0.55)\\';this.style.borderColor=\\'rgba(40,199,111,0.12)\\'"`;
const newOptHover = `onmouseover="this.style.background=\\'rgba(25,185,138,0.06)\\';this.style.borderColor=\\'rgba(25,185,138,0.35)\\'" onmouseout="this.style.background=\\'#FFFFFF\\';this.style.borderColor=\\'#E3EAF0\\'"`;
if (s.includes(oldOptHover)) { s = s.split(oldOptHover).join(newOptHover); check('3-option-card-hover', true); }
else { check('3-option-card-hover', false); }

// ===== 4. 我的上报 height: 640 -> 500 =====
if (s.includes('var CONTAINER_H = 640')) {
  s = s.replace('var CONTAINER_H = 640 // px — exact fixed height', 'var CONTAINER_H = 500 // px — fixed height (same across filter states)');
  check('4-my-reports-height', true);
} else { check('4-my-reports-height', false); }

// ===== 5. 我的上报 filter pills: inactive bg dark-navy -> white; onmouseout white =====
const oldPillBg = `var pillBg = isActive ? 'rgba(40,199,250,0.15)' : 'rgba(10,36,68,0.55)'`;
const newPillBg = `var pillBg = isActive ? 'rgba(25,185,138,0.12)' : '#FFFFFF'`;
if (s.includes(oldPillBg)) { s = s.replace(oldPillBg, newPillBg); check('5a-pill-bg', true); }
else { check('5a-pill-bg', false); }
const oldPillBorder = `var pillBorder = isActive ? '1px solid #28C7FA' : '1px solid rgba(40,199,111,0.12)'`;
const newPillBorder = `var pillBorder = isActive ? '1px solid #19B98A' : '1px solid #E3EAF0'`;
if (s.includes(oldPillBorder)) { s = s.replace(oldPillBorder, newPillBorder); check('5b-pill-border', true); }
else { check('5b-pill-border', false); }
const oldPillOut = `this.style.borderColor=\\'rgba(40,199,111,0.12)\\';this.style.background=\\'rgba(10,36,68,0.55)\\'`;
const newPillOut = `this.style.borderColor=\\'#E3EAF0\\';this.style.background=\\'#FFFFFF\\'`;
if (s.includes(oldPillOut)) { s = s.split(oldPillOut).join(newPillOut); check('5c-pill-onmouseout', true); }
else { check('5c-pill-onmouseout', false); }

// ===== 6. 我的上报 list items: onmouseout dark-navy -> #FAFBFC =====
const oldItemOut = `onmouseout="this.style.background=\\'rgba(10,36,68,0.40)\\';this.style.borderColor=\\'rgba(40,199,111,0.08)\\'"`;
const newItemOut = `onmouseout="this.style.background=\\'#FAFBFC\\';this.style.borderColor=\\'#EBEFF4\\'"`;
if (s.includes(oldItemOut)) { s = s.replace(oldItemOut, newItemOut); check('6-list-item-onmouseout', true); }
else { check('6-list-item-onmouseout', false); }

// ===== 7. 村务公告 notice rows: light-green hover, white default =====
const oldNoticeHover = `onmouseover="this.style.background=\\'#E3EAF0\\'" onmouseout="this.style.background=\\'rgba(10,36,68,0.55)\\'"`;
const newNoticeHover = `onmouseover="this.style.background=\\'rgba(25,185,138,0.05)\\'" onmouseout="this.style.background=\\'#FFFFFF\\'"`;
if (s.includes(oldNoticeHover)) { s = s.replace(oldNoticeHover, newNoticeHover); check('7-notice-row-hover', true); }
else { check('7-notice-row-hover', false); }

// ===== 8. Tag background: add tagBg to data, use it in both render sites =====
const tagData = [
  ["tag: '进行中', tagColor: '#22B573',", "tag: '进行中', tagColor: '#22B573', tagBg: 'rgba(34,181,115,0.12)',"],
  ["tag: '重要', tagColor: '#F5B83D',", "tag: '重要', tagColor: '#F5B83D', tagBg: 'rgba(245,184,61,0.12)',"],
  ["tag: '重要', tagColor: '#E05252',", "tag: '重要', tagColor: '#E05252', tagBg: 'rgba(224,82,82,0.12)',"],
];
let tagDataOk = 0;
tagData.forEach(function(p) { if (s.includes(p[0])) { s = s.replace(p[0], p[1]); tagDataOk++; } });
check('8a-tag-data (3 notices)', tagDataOk === 3);

const oldTagList = `;background:' + n.tagColor.replace(')', ',0.12)') + ';flex-shrink:0">' + n.tag + '</span>'`;
const newTagList = `;background:' + (n.tagBg || 'rgba(100,120,140,0.10)') + ';flex-shrink:0">' + n.tag + '</span>'`;
if (s.includes(oldTagList)) { s = s.replace(oldTagList, newTagList); check('8b-tag-list-render', true); }
else { check('8b-tag-list-render', false); }

const oldTagDetail = `;background:' + n.tagColor.replace(')', ',0.12)').replace('rgb', 'rgba').replace(')', ',0.12)') + '">' + n.tag + '</span>'`;
const newTagDetail = `;background:' + (n.tagBg || 'rgba(100,120,140,0.10)') + '">' + n.tag + '</span>'`;
if (s.includes(oldTagDetail)) { s = s.replace(oldTagDetail, newTagDetail); check('8c-tag-detail-render', true); }
else { check('8c-tag-detail-render', false); }

// ===== 9. 网格员信息 buttons: inline style for 查看我的网格 =====
const oldGridBtn = `<button class="btn btn-outline" onclick="window._svc.showMyGrid()" style="flex:1;justify-content:center">🗺️ 查看我的网格</button>`;
const newGridBtn = `<button class="btn btn-outline" onclick="window._svc.showMyGrid()" style="flex:1;justify-content:center;background:#FFFFFF;border:1px solid #19B98A;color:#19B98A">🗺️ 查看我的网格</button>`;
if (s.includes(oldGridBtn)) { s = s.replace(oldGridBtn, newGridBtn); check('9-grid-worker-btn', true); }
else { check('9-grid-worker-btn', false); }

// ===== 10. 事件详情: rewrite basic info into unified info card =====
const startMarker = "  var h = ''\n  // Header: event ID + type";
const gpsMarker = '未获取定位信息（上报时未开启定位或定位失败）';
const startIdx = s.indexOf(startMarker);
const gpsIdx = s.indexOf(gpsMarker, startIdx);
if (startIdx === -1 || gpsIdx === -1) {
  check('10-event-detail-card', false);
} else {
  const closeIdx = s.indexOf('}', gpsIdx); // closing } of the else block
  if (closeIdx === -1) {
    check('10-event-detail-card', false);
  } else {
    const newBlock = `  var h = ''
  // Header: event ID + type
  h += '<div style="text-align:center;padding:8px 0 16px 0">'
  h += '<div style="font-size:11px;color:#66788A;margin-bottom:4px">' + e.id + '</div>'
  h += '<h3 style="color:#1F2D3D;margin:0;font-size:15px">' + e.type + '</h3>'
  h += '</div>'
  // Unified basic info card (label left, value right, full-width)
  var statusColor = colors[e.status] || '#66788A'
  var gpsText = (e.latitude && e.longitude) ? '已定位（' + e.latitude.toFixed(6) + ', ' + e.longitude.toFixed(6) + '）' : '未获取'
  h += '<div style="background:#F0F3F6;border:1px solid #EBEFF4;border-radius:8px;overflow:hidden;margin-bottom:16px">'
  h += '<div style="display:flex;padding:10px 16px;border-bottom:1px solid #E6ECF2;font-size:12px"><span style="flex-shrink:0;width:76px;color:#66788A">问题类型</span><span style="color:#1F2D3D;font-weight:500">' + e.type + '</span></div>'
  h += '<div style="display:flex;padding:10px 16px;border-bottom:1px solid #E6ECF2;font-size:12px"><span style="flex-shrink:0;width:76px;color:#66788A">发生地点</span><span style="color:#1F2D3D;font-weight:500">📍 ' + e.location + '</span></div>'
  if (e.description) h += '<div style="display:flex;padding:10px 16px;border-bottom:1px solid #E6ECF2;font-size:12px"><span style="flex-shrink:0;width:76px;color:#66788A">问题描述</span><span style="color:#1F2D3D;font-weight:500;flex:1">' + e.description + '</span></div>'
  h += '<div style="display:flex;padding:10px 16px;border-bottom:1px solid #E6ECF2;font-size:12px"><span style="flex-shrink:0;width:76px;color:#66788A">上报时间</span><span style="color:#1F2D3D;font-weight:500">' + e.time + '</span></div>'
  h += '<div style="display:flex;padding:10px 16px;border-bottom:1px solid #E6ECF2;font-size:12px"><span style="flex-shrink:0;width:76px;color:#66788A">当前状态</span><span style="color:' + statusColor + ';font-weight:600">● ' + e.status + '</span></div>'
  h += '<div style="display:flex;padding:10px 16px;font-size:12px"><span style="flex-shrink:0;width:76px;color:#66788A">GPS位置</span><span style="color:#1F2D3D;font-weight:500">' + gpsText + '</span></div>'
  h += '</div>'
`;
    s = s.substring(0, startIdx) + newBlock + s.substring(closeIdx + 1);
    check('10-event-detail-card', true);
  }
}

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== GOV THEME 5-ISSUE FIX ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
