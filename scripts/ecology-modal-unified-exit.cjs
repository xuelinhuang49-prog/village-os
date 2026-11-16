// 生态治理中心统一交互规范：所有弹窗右上角固定 ×；上下级/多步骤流程提供「上一步/返回」；
// × = 退出整个流程回主页面，上一步/返回 = 只退回上一层，两者含义分开。不依赖灰色遮罩作为唯一退出方式。
//   1. openModal 注入统一弹窗壳（标题 + 右上角 ×，所有弹窗共用）
//   2. 新增 .modal-x 样式（浅色/深色弹窗两套）
//   3. 事件上报第2步「上一步」加箭头；第3步成功页补「完成」
//   4. 事件详情补「返回我的上报」
//   5. 垃圾点详情补「返回垃圾清运」
//   6. 秸秆申请表单「取消」改为「上一步」（返回秸秆处理）
//   7. 秸秆申请成功页补「完成」
//   8. _svc 注册 backToMyReports / backToGarbage / strawFormBack
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }
function gsub(oldStr, newStr) { const before = s; s = s.split(oldStr).join(newStr); return s !== before; }

// ===== 1. openModal 注入统一弹窗壳（标题 + 右上角 ×） =====
check('1-modal-shell-x', gsub(
`function openModal(title, content) {
  modalContent.value = '<h3>' + title + '</h3>' + content
  modalOpen.value = true
}`,
`function openModal(title, content) {
  // 统一弹窗壳：标题 + 右上角固定关闭 ×（所有弹窗共用；× = 退出整个流程回主页面）
  modalContent.value = '<h3 style="padding-right:36px">' + title + '</h3><button class="modal-x" onclick="window._closeModal && window._closeModal()" title="关闭" aria-label="关闭">✕</button>' + content
  modalOpen.value = true
}`));

// ===== 2. 新增 .modal-x 样式（浅色/深色弹窗两套） =====
check('2-modal-x-css', gsub(
`.modal-box.modal-light .btn-primary { background:linear-gradient(135deg,#19B98A,#16A37A); color:#fff; box-shadow:0 2px 8px rgba(25,185,138,0.25) }
.modal-box.modal-light .btn-primary:hover { box-shadow:0 4px 14px rgba(25,185,138,0.35) }

</style>`,
`.modal-box.modal-light .btn-primary { background:linear-gradient(135deg,#19B98A,#16A37A); color:#fff; box-shadow:0 2px 8px rgba(25,185,138,0.25) }
.modal-box.modal-light .btn-primary:hover { box-shadow:0 4px 14px rgba(25,185,138,0.35) }

/* ===== 统一弹窗关闭 ×（右上角固定，所有弹窗共用）===== */
.modal-x { position:absolute; top:16px; right:16px; width:30px; height:30px; border:none; border-radius:50%; cursor:pointer; font-size:16px; line-height:30px; text-align:center; padding:0; background:rgba(255,255,255,0.08); color:#9FB0C0; transition:all .2s; z-index:20; font-family:inherit }
.modal-x:hover { background:rgba(255,255,255,0.18); color:#fff }
.modal-box.modal-light .modal-x { background:#F0F3F6; color:#66788A }
.modal-box.modal-light .modal-x:hover { background:#E3EAF0; color:#1F2D3D }

</style>`));

// ===== 3. 事件上报第2步「上一步」加箭头 =====
check('3-report-step2-back', gsub(
`    h += '<button class="btn btn-outline" onclick="window._svc.prevReportStep()">上一步</button>'`,
`    h += '<button class="btn btn-outline" onclick="window._svc.prevReportStep()">← 上一步</button>'`));

// ===== 4. 事件上报第3步成功页补「完成」 =====
check('4-report-step3-done', gsub(
`    h += '<p style="color:#66788A;font-size:11px;margin:0 0 20px 0">可在「我的上报」查看处理进度</p>'
    h += '<button class="btn btn-primary" onclick="window._svc.closeAndRefresh()">查看我的上报</button></div>'`,
`    h += '<p style="color:#66788A;font-size:11px;margin:0 0 20px 0">可在「我的上报」查看处理进度</p>'
    h += '<div style="display:flex;gap:8px;justify-content:center"><button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">完成</button><button class="btn btn-primary" onclick="window._svc.closeAndRefresh()">查看我的上报</button></div></div>'`));

// ===== 5. 事件详情补「返回我的上报」 =====
check('5-event-detail-back', gsub(
`  h += '<div class="detail-actions">'
  h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">关闭</button>'
  if (e.status === '处理中' || e.status === '待受理') {`,
`  h += '<div class="detail-actions">'
  h += '<button class="btn btn-outline" onclick="window._svc.backToMyReports()">← 返回我的上报</button>'
  if (e.status === '处理中' || e.status === '待受理') {`));

// ===== 6. 新增 backToMyReports 函数 =====
check('6-backToMyReports-fn', gsub(
`  openGovModal('事件详情', h)
}

function previewPhoto(dataUrl) {`,
`  openGovModal('事件详情', h)
}

// 事件详情 → 返回「我的上报」列表（关闭 × 才是退出整个流程）
function backToMyReports() { showMyReports(_myReportsFilter) }

function previewPhoto(dataUrl) {`));

// ===== 7. 垃圾点详情补「返回垃圾清运」 =====
check('7-garbage-detail-back', gsub(
`    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' + garbageActions(p, idx) + '</div></div>'
  openGovModal(p.name, h)`,
`    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-outline" onclick="window._svc.backToGarbage()">← 返回垃圾清运</button>' + garbageActions(p, idx) + '</div></div>'
  openGovModal(p.name, h)`));

// ===== 8. 新增 backToGarbage 函数 =====
check('8-backToGarbage-fn', gsub(
`function openGarbagePointById(id) {
  const p = ecoGarbagePoints.value.find(function(x) { return x.id === id })
  if (p) openGarbagePoint(ecoGarbagePoints.value.indexOf(p))
}`,
`function openGarbagePointById(id) {
  const p = ecoGarbagePoints.value.find(function(x) { return x.id === id })
  if (p) openGarbagePoint(ecoGarbagePoints.value.indexOf(p))
}
// 垃圾点详情 → 返回「垃圾清运」列表（关闭 × 才是退出整个流程）
function backToGarbage() { showGarbageService() }`));

// ===== 9. 秸秆申请表单「取消」→「上一步」 =====
check('9-straw-form-back', gsub(
`  h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">取消</button>'
  h += '<button class="btn btn-primary" onclick="window._svc.submitStrawApply()">提交申请</button>'`,
`  h += '<button class="btn btn-outline" onclick="window._svc.strawFormBack()">← 上一步</button>'
  h += '<button class="btn btn-primary" onclick="window._svc.submitStrawApply()">提交申请</button>'`));

// ===== 10. 新增 strawFormBack 函数 =====
check('10-strawFormBack-fn', gsub(
`function showStrawApplyForm() {
  _strawType = '玉米秸秆'; _strawQty = ''; _strawLoc = ''; _strawExpect = '今天'; _strawRemark = ''
  _strawLat = null; _strawLng = null; _strawGpsStatus = 'idle'
  renderStrawForm()
}`,
`function showStrawApplyForm() {
  _strawType = '玉米秸秆'; _strawQty = ''; _strawLoc = ''; _strawExpect = '今天'; _strawRemark = ''
  _strawLat = null; _strawLng = null; _strawGpsStatus = 'idle'
  renderStrawForm()
}
// 申请表单 → 返回「秸秆处理」详情（关闭 × 才是退出整个流程）
function strawFormBack() { showStrawService() }`));

// ===== 11. 秸秆申请成功页补「完成」 =====
check('11-straw-success-done', gsub(
`    '<p style="color:#66788A;font-size:11px;margin:0 0 20px 0">回收人员确认后将与您联系。</p>' +
    '<button class="btn btn-primary" onclick="window._svc.openStrawApp()">查看申请进度</button></div>'`,
`    '<p style="color:#66788A;font-size:11px;margin:0 0 20px 0">回收人员确认后将与您联系。</p>' +
    '<div style="display:flex;gap:8px;justify-content:center"><button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">完成</button><button class="btn btn-primary" onclick="window._svc.openStrawApp()">查看申请进度</button></div></div>'`));

// ===== 12. _svc 注册 backToGarbage / strawFormBack / backToMyReports =====
check('12-svc-register', gsub(
`    openWaterBodyByIdx, reportWaterSupplement, viewWaterLocation, reportFromMonitor, setStrawType, setStrawExpect, getStrawLocation, submitStrawApply, openStrawApp,`,
`    openWaterBodyByIdx, reportWaterSupplement, viewWaterLocation, reportFromMonitor, setStrawType, setStrawExpect, getStrawLocation, submitStrawApply, openStrawApp, backToGarbage, strawFormBack, backToMyReports,`));

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== ECOLOGY MODAL UNIFIED EXIT ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
