// Enhance event report step 2: GPS location board + real photo upload
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. Add GPS state variables =====
const oldStateVars = `let _reportStep = 0, _reportType = '', _reportDesc = '', _reportLocation = '', _reportPhotos = []`;
const newStateVars = `let _reportStep = 0, _reportType = '', _reportDesc = '', _reportLocation = '', _reportPhotos = []
let _reportLat = null, _reportLng = null, _reportAccuracy = null, _reportGpsStatus = 'idle' // idle | locating | located | failed
let _reportPhotoInputId = 'reportPhotoInput_' + Date.now()`;
if (s.includes(oldStateVars)) {
  s = s.replace(oldStateVars, newStateVars);
  check('1-stateVars', true);
} else { check('1-stateVars', false); }

// ===== 2. Replace renderReportForm step 2 =====
const oldStep2 = `  } else if (_reportStep === 2) {
    const typeLabels = { infrastructure: '🏗️ 基础设施', environment: '🧹 环境卫生', safety: '⚠️ 安全隐患', agriculture: '🌾 农业生产', elderly: '👴 老人关怀', other: '📌 其他事项' }
    let h = '<div style="padding:12px 0"><h4 style="color:#fff;margin:0 0 4px 0;font-size:14px">📝 事件上报 — 第2步：填写详情</h4><p style="color:#6F91A8;font-size:11px;margin:0 0 14px 0">类型：' + (typeLabels[_reportType] || _reportType) + '</p>'
    h += '<div style="margin-bottom:12px"><label style="display:block;font-size:11px;color:#B7D3E8;margin-bottom:4px">问题描述 <span style="color:#E74C3C">*</span></label>'
    h += '<textarea id="reportDescInput" placeholder="请详细描述您遇到的问题..." style="width:100%;height:100px;background:rgba(10,36,68,0.55);border:1px solid rgba(40,199,111,0.18);border-radius:6px;color:#D0E4F5;padding:8px 10px;font-size:12px;font-family:inherit;resize:vertical;box-sizing:border-box"></textarea></div>'
    h += '<div style="margin-bottom:12px"><label style="display:block;font-size:11px;color:#B7D3E8;margin-bottom:4px">发生地点 <span style="color:#E74C3C">*</span></label>'
    h += '<input id="reportLocInput" placeholder="例如：村东口路灯旁" style="width:100%;background:rgba(10,36,68,0.55);border:1px solid rgba(40,199,111,0.18);border-radius:6px;color:#D0E4F5;padding:8px 10px;font-size:12px;font-family:inherit;box-sizing:border-box" /></div>'
    h += '<div style="margin-bottom:12px"><label style="display:block;font-size:11px;color:#B7D3E8;margin-bottom:4px">现场照片（最多3张，选填）</label>'
    h += '<div style="display:flex;gap:8px;flex-wrap:wrap"><div onclick="window._svc.addReportPhoto()" style="width:64px;height:64px;border:1px dashed rgba(40,199,111,0.30);border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:24px;color:#6F91A8;transition:all 0.2s" onmouseover="this.style.borderColor=\\'#39D98A\\';this.style.color=\\'#39D98A\\'" onmouseout="this.style.borderColor=\\'rgba(40,199,111,0.30)\\';this.style.color=\\'#6F91A8\\'">📷</div>'
    for (let i = 0; i < _reportPhotos.length; i++) {
      h += '<div style="width:64px;height:64px;background:rgba(10,36,68,0.55);border:1px solid rgba(40,199,111,0.18);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;position:relative">📸<span onclick="window._svc.removeReportPhoto(' + i + ')" style="position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:#E74C3C;color:#fff;font-size:10px;display:flex;align-items:center;justify-content:center;cursor:pointer">✕</span></div>'
    }
    h += '</div></div>'
    h += '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px">'
    h += '<button class="btn btn-outline" onclick="window._svc.prevReportStep()">上一步</button>'
    h += '<button class="btn btn-primary" onclick="window._svc.submitReport()">提交上报</button>'
    h += '</div></div>'
    openModal('事件上报', h)
  }`;

if (s.includes(oldStep2)) {
  const newStep2 = `  } else if (_reportStep === 2) {
    const typeLabels = { infrastructure: '🏗️ 基础设施', environment: '🧹 环境卫生', safety: '⚠️ 安全隐患', agriculture: '🌾 农业生产', elderly: '👴 老人关怀', other: '📌 其他事项' }
    let h = '<div style="padding:12px 0"><h4 style="color:#fff;margin:0 0 4px 0;font-size:14px">📝 事件上报 — 第2步：填写详情</h4><p style="color:#6F91A8;font-size:11px;margin:0 0 14px 0">类型：' + (typeLabels[_reportType] || _reportType) + '</p>'
    // Problem description
    h += '<div style="margin-bottom:12px"><label style="display:block;font-size:12px;color:#D0E4F5;margin-bottom:6px;font-weight:600">📄 问题描述 <span style="color:#E74C3C">*</span></label>'
    h += '<textarea id="reportDescInput" placeholder="请详细描述您遇到的问题，例如：路灯不亮已持续3天，影响夜间出行安全..." style="width:100%;height:100px;background:rgba(10,36,68,0.55);border:1px solid rgba(40,199,111,0.18);border-radius:8px;color:#D0E4F5;padding:10px 12px;font-size:12px;font-family:inherit;resize:vertical;box-sizing:border-box"></textarea></div>'
    // Location text
    h += '<div style="margin-bottom:12px"><label style="display:block;font-size:12px;color:#D0E4F5;margin-bottom:6px;font-weight:600">📍 发生地点 <span style="color:#E74C3C">*</span></label>'
    h += '<input id="reportLocInput" placeholder="例如：村东口路灯旁" value="' + (_reportLocation || '') + '" style="width:100%;background:rgba(10,36,68,0.55);border:1px solid rgba(40,199,111,0.18);border-radius:8px;color:#D0E4F5;padding:10px 12px;font-size:12px;font-family:inherit;box-sizing:border-box" />'
    h += '<span style="font-size:10px;color:#6F91A8;margin-top:4px;display:block">填写人能看懂的文字位置，方便网格员快速找到</span></div>'
    // GPS board
    h += '<div style="margin-bottom:12px;background:rgba(10,36,68,0.30);border:1px solid rgba(40,199,111,0.12);border-radius:8px;padding:12px"><label style="display:flex;align-items:center;gap:6px;font-size:12px;color:#D0E4F5;margin-bottom:8px;font-weight:600">🛰️ GPS 定位</label>'
    if (_reportGpsStatus === 'idle') {
      h += '<button class="btn btn-primary btn-sm" onclick="window._svc.getCurrentLocation()" style="margin-bottom:4px">📍 获取当前位置</button>'
    } else if (_reportGpsStatus === 'locating') {
      h += '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;color:#28C7FA;font-size:12px"><span style="display:inline-block;width:14px;height:14px;border:2px solid #28C7FA;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite"></span>正在获取位置...</div>'
    } else if (_reportGpsStatus === 'located') {
      const latStr = _reportLat !== null ? _reportLat.toFixed(6) : '--'
      const lngStr = _reportLng !== null ? _reportLng.toFixed(6) : '--'
      const accStr = _reportAccuracy !== null ? '±' + Math.round(_reportAccuracy) + 'm' : ''
      h += '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><span style="display:inline-flex;align-items:center;gap:4px;background:rgba(57,217,138,0.12);color:#39D98A;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600">✅ 已定位</span><span style="font-size:11px;color:#B7D3E8">' + latStr + ', ' + lngStr + '</span><span style="font-size:10px;color:#6F91A8">' + accStr + '</span><button class="btn btn-outline btn-xs" onclick="window._svc.getCurrentLocation()" style="margin-left:4px">重新定位</button></div>'
    } else if (_reportGpsStatus === 'failed') {
      h += '<div style="margin-bottom:6px"><span style="display:inline-flex;align-items:center;gap:4px;background:rgba(245,158,11,0.12);color:#f59e0b;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600">⚠️ 定位失败</span><span style="font-size:11px;color:#6F91A8;margin-left:6px">未能获取当前位置，请检查浏览器定位权限，或手动填写发生地点</span></div>'
      h += '<button class="btn btn-outline btn-xs" onclick="window._svc.getCurrentLocation()">🔄 重新获取</button>'
    }
    h += '<div style="font-size:10px;color:#6F91A8;margin-top:8px;display:flex;align-items:center;gap:4px"><span>🔒</span> 定位仅用于帮助工作人员快速找到问题位置，不会用于其他用途</div></div>'
    // Photos
    h += '<div style="margin-bottom:12px"><label style="display:block;font-size:12px;color:#D0E4F5;margin-bottom:6px;font-weight:600">📸 现场照片<span style="font-size:10px;color:#6F91A8;font-weight:400">（最多3张，选填）</span></label>'
    h += '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-start">'
    // Photo thumbnails
    for (let i = 0; i < _reportPhotos.length; i++) {
      const p = _reportPhotos[i]
      if (p.dataUrl) {
        h += '<div style="width:72px;height:72px;border-radius:8px;overflow:hidden;position:relative;border:1px solid rgba(40,199,111,0.18)"><img src="' + p.dataUrl + '" style="width:100%;height:100%;object-fit:cover"><span onclick="window._svc.removeReportPhoto(' + i + ')" style="position:absolute;top:2px;right:2px;width:20px;height:20px;border-radius:50%;background:rgba(0,0,0,0.7);color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center;cursor:pointer;line-height:1" title="删除此照片">✕</span>'
        if (p.uploadStatus === 'uploading') h += '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff">上传中...</div>'
        if (p.uploadStatus === 'failed') h += '<div style="position:absolute;bottom:0;left:0;right:0;background:rgba(231,76,60,0.85);font-size:9px;color:#fff;text-align:center;padding:2px">上传失败</div>'
        h += '</div>'
      }
    }
    // Add photo button
    if (_reportPhotos.length < 3) {
      h += '<div onclick="window._svc.triggerPhotoUpload()" style="width:72px;height:72px;border:1px dashed rgba(40,199,111,0.30);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;font-size:22px;color:#6F91A8;transition:all 0.2s;gap:2px" onmouseover="this.style.borderColor=\\'#39D98A\\';this.style.color=\\'#39D98A\\';this.style.background=\\'rgba(40,199,111,0.05)\\'" onmouseout="this.style.borderColor=\\'rgba(40,199,111,0.30)\\';this.style.color=\\'#6F91A8\\';this.style.background=\\'transparent\\'">📷<span style="font-size:9px">拍照/上传</span></div>'
    }
    h += '</div><span style="font-size:9px;color:#6F91A8;margin-top:4px;display:block">支持手机拍照或相册选择，大图自动压缩</span></div>'
    // Buttons
    h += '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px;border-top:1px solid rgba(40,199,111,0.06);padding-top:14px">'
    h += '<button class="btn btn-outline" onclick="window._svc.prevReportStep()">上一步</button>'
    h += '<button class="btn btn-primary" onclick="window._svc.submitReport()" ' + (_reportGpsStatus === 'locating' ? 'disabled style="opacity:0.5;cursor:not-allowed"' : '') + '>提交上报</button>'
    h += '</div></div>'
    openModal('事件上报', h)
    // Create hidden file input after modal renders
    setTimeout(() => {
      let fi = document.getElementById('reportPhotoFileInput')
      if (!fi) {
        fi = document.createElement('input')
        fi.type = 'file'; fi.id = 'reportPhotoFileInput'; fi.accept = 'image/*'
        fi.multiple = false; fi.style.display = 'none'
        fi.onchange = function(e) { if (this.files && this.files[0]) window._svc.handlePhotoSelected(this.files[0]) }
        document.body.appendChild(fi)
      }
    }, 100)
  }`;

  s = s.replace(oldStep2, newStep2);
  check('2-renderStep2', true);
} else { check('2-renderStep2', false); }

// ===== 3. Replace showEventReportForm to reset GPS state =====
const oldShowForm = `function showEventReportForm() {
  _reportStep = 1; _reportType = ''; _reportDesc = ''; _reportLocation = ''; _reportPhotos = []
  renderReportForm()
}`;
const newShowForm = `function showEventReportForm() {
  _reportStep = 1; _reportType = ''; _reportDesc = ''; _reportLocation = ''; _reportPhotos = []
  _reportLat = null; _reportLng = null; _reportAccuracy = null; _reportGpsStatus = 'idle'
  renderReportForm()
}`;
if (s.includes(oldShowForm)) {
  s = s.replace(oldShowForm, newShowForm);
  check('3-showForm', true);
} else { check('3-showForm', false); }

// ===== 4. Replace photo functions with real implementation =====
const oldPhotoFuncs = `function addReportPhoto() {
  if (_reportPhotos.length >= 3) { toast('最多上传3张照片', 'warn'); return }
  _reportPhotos.push({ name: 'photo_' + (_reportPhotos.length + 1) })
  renderReportForm()
  toast('照片已添加（演示）', 'info')
}

function removeReportPhoto(idx) {
  _reportPhotos.splice(idx, 1)
  renderReportForm()
}`;

const newPhotoFuncs = `function triggerPhotoUpload() {
  if (_reportPhotos.length >= 3) { toast('最多上传3张照片', 'warn'); return }
  const fi = document.getElementById('reportPhotoFileInput')
  if (fi) { fi.value = ''; fi.click() }
}

function handlePhotoSelected(file) {
  if (!file) return
  if (_reportPhotos.length >= 3) { toast('最多上传3张照片', 'warn'); return }
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) { toast('图片不能超过10MB', 'warn'); return }
  const idx = _reportPhotos.length
  _reportPhotos.push({ name: file.name, size: file.size, dataUrl: '', uploadStatus: 'uploading' })
  renderReportForm()
  // Compress and read
  const reader = new FileReader()
  reader.onload = function(e) {
    const img = new Image()
    img.onload = function() {
      const maxW = 1280, maxH = 1280
      let w = img.width, h = img.height
      if (w > maxW || h > maxH) {
        if (w > h) { h = Math.round(h * maxW / w); w = maxW }
        else { w = Math.round(w * maxH / h); h = maxH }
      }
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      const compressed = canvas.toDataURL('image/jpeg', 0.80)
      _reportPhotos[idx].dataUrl = compressed
      _reportPhotos[idx].uploadStatus = 'done'
      renderReportForm()
    }
    img.src = e.target.result
  }
  reader.onerror = function() {
    _reportPhotos[idx].uploadStatus = 'failed'
    renderReportForm()
    toast('照片读取失败，请重试', 'error')
  }
  reader.readAsDataURL(file)
}

function removeReportPhoto(idx) {
  if (idx >= 0 && idx < _reportPhotos.length) {
    _reportPhotos.splice(idx, 1)
    renderReportForm()
  }
}

function addReportPhoto() {
  triggerPhotoUpload()
}`;

if (s.includes(oldPhotoFuncs)) {
  s = s.replace(oldPhotoFuncs, newPhotoFuncs);
  check('4-photoFuncs', true);
} else { check('4-photoFuncs', false); }

// ===== 5. Add GPS location function before prevReportStep =====
const oldPrevStep = `function prevReportStep() {
  _reportStep = 1
  _reportType = ''
  renderReportForm()
}`;

const newPrevStep = `function getCurrentLocation() {
  _reportGpsStatus = 'locating'
  renderReportForm()
  if (!navigator.geolocation) {
    _reportGpsStatus = 'failed'
    renderReportForm()
    toast('浏览器不支持GPS定位，请手动填写位置', 'warn')
    return
  }
  navigator.geolocation.getCurrentPosition(
    function(pos) {
      _reportLat = pos.coords.latitude
      _reportLng = pos.coords.longitude
      _reportAccuracy = pos.coords.accuracy
      _reportGpsStatus = 'located'
      renderReportForm()
      toast('定位成功（精度：±' + Math.round(pos.coords.accuracy) + 'm）', 'success')
    },
    function(err) {
      _reportGpsStatus = 'failed'
      renderReportForm()
      const msgs = { 1: '定位被拒绝，请在浏览器设置中允许定位权限', 2: '定位暂时不可用，请检查GPS或网络', 3: '定位超时，请重试' }
      toast(msgs[err.code] || '定位失败，请手动填写位置', 'warn')
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
  )
}

function prevReportStep() {
  _reportStep = 1
  _reportType = ''
  renderReportForm()
}`;

if (s.includes(oldPrevStep)) {
  s = s.replace(oldPrevStep, newPrevStep);
  check('5-gpsFunc', true);
} else { check('5-gpsFunc', false); }

// ===== 6. Replace submitReport to collect GPS data =====
const oldSubmit = `function submitReport() {
  const descEl = document.getElementById('reportDescInput')
  const locEl = document.getElementById('reportLocInput')
  const desc = descEl ? descEl.value.trim() : ''
  const loc = locEl ? locEl.value.trim() : ''
  if (!desc) { toast('请填写问题描述', 'warn'); return }
  if (!loc) { toast('请填写发生地点', 'warn'); return }
  _reportDesc = desc
  _reportLocation = loc
  _reportStep = 3
  renderReportForm()
  toast('事件上报成功！', 'success')
}`;

const newSubmit = `function submitReport() {
  const descEl = document.getElementById('reportDescInput')
  const locEl = document.getElementById('reportLocInput')
  const desc = descEl ? descEl.value.trim() : ''
  const loc = locEl ? locEl.value.trim() : ''
  if (!desc) { toast('请填写问题描述', 'warn'); return }
  if (!loc) { toast('请填写发生地点', 'warn'); return }
  // Check photo upload status
  const failedPhotos = _reportPhotos.filter(function(p) { return p.uploadStatus === 'failed' })
  if (failedPhotos.length > 0) {
    toast('第' + (_reportPhotos.indexOf(failedPhotos[0]) + 1) + '张照片上传失败，请删除后重新上传', 'warn')
    return
  }
  const uploadingPhotos = _reportPhotos.filter(function(p) { return p.uploadStatus === 'uploading' })
  if (uploadingPhotos.length > 0) {
    toast('还有照片正在处理中，请稍候...', 'warn')
    return
  }
  _reportDesc = desc
  _reportLocation = loc
  // Build report data (reserved for API)
  const reportData = {
    event_id: '#EV' + String(new Date().getMonth() + 1).padStart(2, '0') + String(new Date().getDate()).padStart(2, '0'),
    village_id: 'zhongyan',
    farmer_id: 'farmer_001',
    category: _reportType,
    description: _reportDesc,
    location_text: _reportLocation,
    latitude: _reportLat,
    longitude: _reportLng,
    location_accuracy: _reportAccuracy,
    photos: _reportPhotos.map(function(p) { return { name: p.name, size: p.size } }),
    status: '已提交',
    created_at: new Date().toISOString()
  }
  console.log('Event report submitted:', reportData)
  _reportStep = 3
  renderReportForm()
  toast('事件上报成功！', 'success')
}`;

if (s.includes(oldSubmit)) {
  s = s.replace(oldSubmit, newSubmit);
  check('6-submit', true);
} else { check('6-submit', false); }

// ===== 7. Update window._svc handlers =====
const oldSvcHandlers = `  window._svc = {
    selectReportType, prevReportStep, addReportPhoto, removeReportPhoto,
    submitReport, closeAndRefresh, callGridWorker, showNoticeDetailById,
    toast, openResource: function(url) { toast('打开资源：' + url, 'info') }
  }`;
const newSvcHandlers = `  window._svc = {
    selectReportType, prevReportStep, addReportPhoto, removeReportPhoto,
    triggerPhotoUpload, handlePhotoSelected, getCurrentLocation,
    submitReport, closeAndRefresh, callGridWorker, showNoticeDetailById,
    toast, openResource: function(url) { toast('打开资源：' + url, 'info') }
  }`;

if (s.includes(oldSvcHandlers)) {
  s = s.replace(oldSvcHandlers, newSvcHandlers);
  check('7-svcHandlers', true);
} else { check('7-svcHandlers', false); }

// ===== 8. Add @keyframes spin to global CSS =====
const oldPageIn = `@keyframes pageIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }`;
const newPageIn = `@keyframes pageIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
@keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }`;
if (s.includes(oldPageIn)) {
  s = s.replace(oldPageIn, newPageIn);
  check('8-spinAnim', true);
} else { check('8-spinAnim', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== GPS + PHOTO OVERHAUL FINAL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
