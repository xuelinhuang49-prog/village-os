// Ecology Center — 秸秆「申请上门回收」从"仅弹一句"升级为轻量流程：
//   表单（自动带入 + 填写/选择）→ 提交生成 JG 编号 → 成功态（待联系）→ 回收服务动态态 → 状态流转查看
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

const oldBlock = String.raw`function showStrawService() {
  const h = '<div style="padding:12px 0">' +
    '<p style="color:#66788A;font-size:15px;margin:0 0 14px 0;line-height:1.6">本村秸秆综合利用率已达 92%，秸秆可回收作饲料、还田或发电。</p>' +
    '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">' +
    ecoRow('🚜 秸秆回收点', '村南晒场东侧', 'green', '开放中') +
    ecoRow('📞 回收服务', '支持上门打包回收', 'green', '可预约') +
    '</div>' +
    '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px;margin-bottom:16px">' +
    '<span style="font-size:15px;color:#1E7A54;line-height:1.6">🌱 就近还田或交售回收点，可获秸秆综合利用补贴。</span></div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-outline" onclick="window._toast && window._toast(\'回收点已在地图标注\',\'info\')">📍 查看回收点</button>' +
    '<button class="btn btn-primary" onclick="window._svc.requestStraw()">🚜 申请上门回收</button>' +
    '</div></div>'
  openGovModal('🌾 秸秆处理', h)
}
function requestStraw() {
  toast('上门回收申请已提交，回收队将联系您', 'success')
  closeModal()
}`;

const newBlock = String.raw`// 当前登录农户档案（统一数据源 — 姓名/村/手机号脱敏展示）
const currentFarmer = { name: '张大姐', village: '中堰村', phone: '138****5678' }
// 秸秆上门回收申请（农户端当前会话，后续状态由管理员端推进）
const ecoStrawApplications = ref([])
let _strawSeq = 0
let _strawType = '玉米秸秆'
let _strawQty = ''
let _strawLoc = ''
let _strawExpect = '今天'
let _strawRemark = ''
let _strawLat = null, _strawLng = null, _strawGpsStatus = 'idle' // idle | locating | located

function showStrawService() {
  const active = ecoStrawApplications.value.find(function(a) { return a.status !== '已回收' })
  const recycleRow = active
    ? '<div onclick="window._svc.openStrawApp()" style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:#FFFFFF;border:1px solid #E3EAF0;border-radius:8px;cursor:pointer;transition:all .2s" onmouseover="this.style.borderColor=\'#F2A62B\';this.style.background=\'rgba(242,166,43,0.04)\'" onmouseout="this.style.borderColor=\'#E3EAF0\';this.style.background=\'#FFFFFF\'">' +
      '<span style="font-size:16px;font-weight:600;color:#1F2D3D">📞 回收服务</span>' +
      '<span style="font-size:15px;color:#66788A;margin-left:auto">已有申请</span>' +
      ecoPill('待联系', 'amber') +
      '</div>'
    : ecoRow('📞 回收服务', '支持上门打包回收', 'green', '可预约')
  const h = '<div style="padding:12px 0">' +
    '<p style="color:#66788A;font-size:15px;margin:0 0 14px 0;line-height:1.6">本村秸秆综合利用率已达 92%，秸秆可回收作饲料、还田或发电。</p>' +
    '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">' +
    ecoRow('🚜 秸秆回收点', '村南晒场东侧', 'green', '开放中') +
    recycleRow +
    '</div>' +
    '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:12px 14px;margin-bottom:16px">' +
    '<span style="font-size:15px;color:#1E7A54;line-height:1.6">🌱 就近还田或交售回收点，可获秸秆综合利用补贴。</span></div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-outline" onclick="window._toast && window._toast(\'回收点已在地图标注\',\'info\')">📍 查看回收点</button>' +
    '<button class="btn btn-primary" onclick="window._svc.requestStraw()">🚜 申请上门回收</button>' +
    '</div></div>'
  openGovModal('🌾 秸秆处理', h)
}
function requestStraw() {
  const active = ecoStrawApplications.value.find(function(a) { return a.status !== '已回收' })
  if (active) { openStrawApp(); return }
  showStrawApplyForm()
}
function showStrawApplyForm() {
  _strawType = '玉米秸秆'; _strawQty = ''; _strawLoc = ''; _strawExpect = '今天'; _strawRemark = ''
  _strawLat = null; _strawLng = null; _strawGpsStatus = 'idle'
  renderStrawForm()
}
function _syncStrawInputs() {
  const q = document.getElementById('strawQtyInput'); if (q) _strawQty = q.value
  const l = document.getElementById('strawLocInput'); if (l) _strawLoc = l.value
  const r = document.getElementById('strawRemarkInput'); if (r) _strawRemark = r.value
}
function renderStrawForm() {
  const types = ['玉米秸秆', '小麦秸秆', '油菜秸秆', '其他']
  const expects = ['今天', '明天', '其他日期']
  let typeBtns = ''
  types.forEach(function(t) {
    const act = _strawType === t
    typeBtns += '<button onclick="window._svc.setStrawType(\'' + t + '\')" style="flex:1;padding:9px 0;border-radius:8px;font-size:13px;font-weight:' + (act ? '700' : '500') + ';cursor:pointer;font-family:inherit;border:1px solid ' + (act ? '#19B98A' : '#D4DCE6') + ';background:' + (act ? 'rgba(25,185,138,0.10)' : '#FFFFFF') + ';color:' + (act ? '#19B98A' : '#475867') + '">' + t + '</button>'
  })
  let expectBtns = ''
  expects.forEach(function(t) {
    const act = _strawExpect === t
    expectBtns += '<button onclick="window._svc.setStrawExpect(\'' + t + '\')" style="flex:1;padding:9px 0;border-radius:8px;font-size:13px;font-weight:' + (act ? '700' : '500') + ';cursor:pointer;font-family:inherit;border:1px solid ' + (act ? '#19B98A' : '#D4DCE6') + ';background:' + (act ? 'rgba(25,185,138,0.10)' : '#FFFFFF') + ';color:' + (act ? '#19B98A' : '#475867') + '">' + t + '</button>'
  })
  const gpsHtml = _strawGpsStatus === 'located'
    ? '<div style="display:flex;align-items:center;gap:6px"><span style="display:inline-flex;align-items:center;gap:4px;background:rgba(34,181,115,0.10);color:#22B573;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:600">✅ 已定位</span><span style="font-size:11px;color:#475867">' + _strawLat.toFixed(6) + ', ' + _strawLng.toFixed(6) + '</span></div>'
    : (_strawGpsStatus === 'locating' ? '<span style="font-size:12px;color:#19B98A">📍 正在定位…</span>' : '<button class="btn btn-outline btn-sm" onclick="window._svc.getStrawLocation()">📍 获取当前位置</button>')
  let h = '<div style="padding:12px 0">'
  h += '<p style="color:#66788A;font-size:14px;margin:0 0 14px 0;line-height:1.6">申请后回收人员将与您联系并安排上门，以下信息已为您自动带入。</p>'
  h += '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:10px 12px;margin-bottom:14px">'
  h += '<div style="font-size:11px;color:#1E7A54;font-weight:700;margin-bottom:6px">✅ 已自动带入</div>'
  h += '<div style="font-size:12px;color:#475867">👤 申请人：' + currentFarmer.name + '</div>'
  h += '<div style="font-size:12px;color:#475867">🏘 所属村：' + currentFarmer.village + '</div>'
  h += '<div style="font-size:12px;color:#475867">📱 联系电话：' + currentFarmer.phone + '（脱敏）</div>'
  h += '</div>'
  h += '<div style="margin-bottom:14px"><label style="display:block;font-size:12px;color:#1F2D3D;margin-bottom:6px;font-weight:600">🌾 秸秆类型 <span style="color:#E05252">*</span></label>'
  h += '<div style="display:flex;gap:6px">' + typeBtns + '</div></div>'
  h += '<div style="margin-bottom:14px"><label style="display:block;font-size:12px;color:#1F2D3D;margin-bottom:6px;font-weight:600">📦 预计数量 <span style="color:#E05252">*</span></label>'
  h += '<input id="strawQtyInput" placeholder="例如：约500公斤 或 约2亩" value="' + (_strawQty || '') + '" style="width:100%;background:#FFFFFF;border:1px solid #D4DCE6;border-radius:8px;color:#1F2D3D;padding:10px 12px;font-size:12px;font-family:inherit;box-sizing:border-box" /></div>'
  h += '<div style="margin-bottom:14px"><label style="display:block;font-size:12px;color:#1F2D3D;margin-bottom:6px;font-weight:600">📍 堆放地点 <span style="color:#E05252">*</span></label>'
  h += '<input id="strawLocInput" placeholder="例如：中堰村3组晒场旁" value="' + (_strawLoc || '') + '" style="width:100%;background:#FFFFFF;border:1px solid #D4DCE6;border-radius:8px;color:#1F2D3D;padding:10px 12px;font-size:12px;font-family:inherit;box-sizing:border-box" /></div>'
  h += '<div style="margin-bottom:14px"><label style="display:block;font-size:12px;color:#1F2D3D;margin-bottom:6px;font-weight:600">🛰️ GPS 定位（选填）</label>' + gpsHtml + '</div>'
  h += '<div style="margin-bottom:14px"><label style="display:block;font-size:12px;color:#1F2D3D;margin-bottom:6px;font-weight:600">🗓 期望回收时间</label>'
  h += '<div style="display:flex;gap:6px">' + expectBtns + '</div>'
  if (_strawExpect === '其他日期') h += '<input id="strawDateInput" placeholder="请填写具体日期，如 8月15日" style="width:100%;margin-top:8px;background:#FFFFFF;border:1px solid #D4DCE6;border-radius:8px;color:#1F2D3D;padding:10px 12px;font-size:12px;font-family:inherit;box-sizing:border-box" />'
  h += '</div>'
  h += '<div style="margin-bottom:14px"><label style="display:block;font-size:12px;color:#1F2D3D;margin-bottom:6px;font-weight:600">📝 备注（选填）</label>'
  h += '<textarea id="strawRemarkInput" placeholder="例如：秸秆已打包，请电话联系" style="width:100%;height:60px;background:#FFFFFF;border:1px solid #D4DCE6;border-radius:8px;color:#1F2D3D;padding:10px 12px;font-size:12px;font-family:inherit;resize:vertical;box-sizing:border-box">' + (_strawRemark || '') + '</textarea></div>'
  h += '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">'
  h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">取消</button>'
  h += '<button class="btn btn-primary" onclick="window._svc.submitStrawApply()">提交申请</button>'
  h += '</div></div>'
  openGovModal('🌾 申请秸秆上门回收', h)
}
function setStrawType(t) { _syncStrawInputs(); _strawType = t; renderStrawForm() }
function setStrawExpect(t) { _syncStrawInputs(); _strawExpect = t; renderStrawForm() }
function getStrawLocation() {
  if (!navigator.geolocation) { toast('浏览器不支持GPS定位，请手动填写地点', 'warn'); return }
  _syncStrawInputs()
  _strawGpsStatus = 'locating'
  renderStrawForm()
  navigator.geolocation.getCurrentPosition(
    function(pos) { _strawLat = pos.coords.latitude; _strawLng = pos.coords.longitude; _strawGpsStatus = 'located'; renderStrawForm(); toast('定位成功', 'success') },
    function() { _strawGpsStatus = 'idle'; renderStrawForm(); toast('定位失败，可跳过', 'warn') },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
  )
}
function submitStrawApply() {
  const qty = (document.getElementById('strawQtyInput') ? document.getElementById('strawQtyInput').value : '').trim()
  const loc = (document.getElementById('strawLocInput') ? document.getElementById('strawLocInput').value : '').trim()
  const remark = (document.getElementById('strawRemarkInput') ? document.getElementById('strawRemarkInput').value : '').trim()
  if (!qty) { toast('请填写预计数量', 'warn'); return }
  if (!loc) { toast('请填写堆放地点', 'warn'); return }
  let expectTime = _strawExpect
  if (_strawExpect === '其他日期') {
    const d = document.getElementById('strawDateInput') ? document.getElementById('strawDateInput').value.trim() : ''
    if (!d) { toast('请填写具体日期', 'warn'); return }
    expectTime = d
  }
  _strawSeq++
  const now = new Date()
  const ymd = String(now.getFullYear()) + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0')
  const appId = 'JG' + ymd + String(_strawSeq).padStart(3, '0')
  const timeStr = (now.getMonth() + 1) + '月' + now.getDate() + '日 ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')
  ecoStrawApplications.value.unshift({
    id: appId, applicant: currentFarmer.name, village: currentFarmer.village, phone: currentFarmer.phone,
    type: _strawType, quantity: qty, location: loc, latitude: _strawLat, longitude: _strawLng,
    expectTime: expectTime, remark: remark, status: '待联系', createdAt: timeStr,
    timeline: [{ time: timeStr, status: '待联系', desc: '申请已提交，等待回收人员联系' }]
  })
  // 成功提示（不结束，明确告知编号与状态）
  const h = '<div style="text-align:center;padding:20px 0"><div style="font-size:48px;margin-bottom:12px">✅</div>' +
    '<h4 style="color:#22B573;margin:0 0 8px 0;font-size:15px">上门回收申请已提交</h4>' +
    '<p style="color:#66788A;font-size:12px;margin:0 0 4px 0">申请编号：<span style="color:#1F2D3D;font-weight:700">' + appId + '</span></p>' +
    '<p style="color:#66788A;font-size:12px;margin:0 0 16px 0">当前状态：<span style="color:#19B98A;font-weight:600">待联系</span></p>' +
    '<p style="color:#66788A;font-size:11px;margin:0 0 20px 0">回收人员确认后将与您联系。</p>' +
    '<button class="btn btn-primary" onclick="window._svc.openStrawApp()">查看申请进度</button></div>'
  openGovModal('🌾 申请秸秆上门回收', h)
}
function strawStepper(status) {
  const steps = ['待联系', '已确认', '待上门', '已回收']
  const curIdx = steps.indexOf(status)
  let html = '<div style="display:flex;align-items:flex-start">'
  steps.forEach(function(s, i) {
    const done = i < curIdx, cur = i === curIdx
    const color = (done || cur) ? '#22B573' : '#C4CDD6'
    html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center">'
    html += '<div style="display:flex;align-items:center;width:100%">'
    if (i > 0) html += '<div style="flex:1;height:2px;background:' + (i <= curIdx ? '#22B573' : '#E3EAF0') + '"></div>'
    html += '<div style="width:22px;height:22px;border-radius:50%;background:' + (cur ? '#22B573' : (done ? 'rgba(34,181,115,0.20)' : '#F0F3F6')) + ';border:2px solid ' + color + ';display:flex;align-items:center;justify-content:center;font-size:11px;color:' + (cur ? '#fff' : color) + ';flex-shrink:0">' + (done ? '✓' : (i + 1)) + '</div>'
    if (i < steps.length - 1) html += '<div style="flex:1;height:2px;background:' + (i < curIdx ? '#22B573' : '#E3EAF0') + '"></div>'
    html += '</div>'
    html += '<div style="font-size:11px;color:' + (cur ? '#1F2D3D' : '#66788A') + ';font-weight:' + (cur ? '700' : '400') + ';margin-top:5px">' + s + '</div>'
    html += '</div>'
  })
  html += '</div>'
  return html
}
function openStrawApp() {
  const a = ecoStrawApplications.value.find(function(x) { return x.status !== '已回收' }) || ecoStrawApplications.value[0]
  if (!a) { showStrawApplyForm(); return }
  let h = '<div style="padding:12px 0">'
  h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px"><span style="font-size:11px;color:#66788A">申请编号：' + a.id + '</span>' + ecoPill(a.status, a.status === '已回收' ? 'green' : 'amber') + '</div>'
  h += '<div style="background:#F0F3F6;border:1px solid #EBEFF4;border-radius:10px;padding:16px 12px;margin-bottom:16px">' + strawStepper(a.status) + '</div>'
  h += '<div style="display:flex;flex-direction:column;margin-bottom:16px">'
  h += ecoAlertField('👤 申请人', a.applicant)
  h += ecoAlertField('🏘 所属村', a.village)
  h += ecoAlertField('📱 联系电话', a.phone)
  h += ecoAlertField('🌾 秸秆类型', a.type)
  h += ecoAlertField('📦 预计数量', a.quantity)
  h += ecoAlertField('📍 堆放地点', a.location)
  h += ecoAlertField('🗓 期望时间', a.expectTime)
  if (a.remark) h += ecoAlertField('📝 备注', a.remark)
  h += '</div>'
  h += '<div style="background:#F0F7F3;border:1px solid #CBE4D8;border-radius:8px;padding:10px 12px;margin-bottom:16px">'
  h += '<span style="font-size:13px;color:#1E7A54;line-height:1.6">💡 回收人员确认后将与您联系，请保持电话畅通。</span></div>'
  h += '<div style="display:flex;gap:8px;justify-content:flex-end">'
  h += '<button class="btn btn-outline" onclick="window._closeModal && window._closeModal()">关闭</button>'
  h += '</div></div>'
  openGovModal('🌾 回收申请进度', h)
}`;

if (s.includes(oldBlock)) { s = s.replace(oldBlock, newBlock); check('1-straw-recycle-flow', true); }
else { check('1-straw-recycle-flow', false); }

// ===== 2. 注册新增 handler =====
const a2 = `    openWaterBodyByIdx, reportWaterSupplement, viewWaterLocation, reportFromMonitor,`;
const n2 = `    openWaterBodyByIdx, reportWaterSupplement, viewWaterLocation, reportFromMonitor, setStrawType, setStrawExpect, getStrawLocation, submitStrawApply, openStrawApp,`;
if (s.includes(a2)) { s = s.replace(a2, n2); check('2-register-straw-handlers', true); }
else { check('2-register-straw-handlers', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== ECOLOGY STRAW RECYCLE FORM ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
