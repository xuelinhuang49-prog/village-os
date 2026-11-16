// Ecology Center — turn 快捷操作 into real villager-facing service entries.
//   1. Swap the 4 buttons to: 环境问题上报 / 垃圾清运 / 水质问题 / 秸秆处理
//   2. Add ecology service functions (each opens a light-theme modal with real content)
//   3. Register requestGarbage/requestStraw on window._svc
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. Replace the 4 quick-action buttons =====
const oldBtns = `          <!-- 快捷操作 — 无卡片背景，按钮内联 -->
          <div style="margin-bottom:10px">
            <div class="panel-hd" style="padding:0 2px 6px"><span class="hd-bar g"></span>⚡ 快捷操作</div>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn btn-primary" @click="toast('环境巡检任务已下发','success')">🔍 发起巡检</button>
              <button class="btn btn-outline" @click="toast('数据已上报环保部门','info')">📤 上报数据</button>
              <button class="btn btn-outline" @click="toast('垃圾分类统计已生成','info')">♻️ 垃圾分类统计</button>
              <button class="btn btn-outline" @click="toast('碳汇核算报告已导出','info')">🌳 碳汇核算</button>
            </div>
          </div>`;
const newBtns = `          <!-- 快捷操作 — 村民生态服务入口 -->
          <div style="margin-bottom:10px">
            <div class="panel-hd" style="padding:0 2px 6px"><span class="hd-bar g"></span>⚡ 快捷操作</div>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn btn-primary" @click="showEcoReportForm()">📷 环境问题上报</button>
              <button class="btn btn-outline" @click="showGarbageService()">🗑 垃圾清运</button>
              <button class="btn btn-outline" @click="showWaterService()">💧 水质问题</button>
              <button class="btn btn-outline" @click="showStrawService()">🌾 秸秆处理</button>
            </div>
          </div>`;
if (s.includes(oldBtns)) { s = s.replace(oldBtns, newBtns); check('1-quick-action-buttons', true); }
else { check('1-quick-action-buttons', false); }

// ===== 2. Insert ecology service functions before the ecology data block =====
const anchor = `// Ecology
const ecoStats = [`;
const funcs = `// ==================== ECOLOGY SERVICE FUNCTIONS ====================
function ecoPill(text, tone) {
  const map = {
    green: 'background:rgba(34,181,115,0.12);color:#22B573',
    amber: 'background:rgba(242,166,43,0.14);color:#C07C00',
    red: 'background:rgba(224,82,82,0.12);color:#E05252'
  }
  return '<span style="display:inline-block;padding:3px 11px;border-radius:10px;font-size:14px;font-weight:600;' + map[tone] + '">' + text + '</span>'
}
function ecoRow(name, meta, tone, status) {
  return '<div style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:#FFFFFF;border:1px solid #E3EAF0;border-radius:8px">' +
    '<span style="font-size:16px;font-weight:600;color:#1F2D3D">' + name + '</span>' +
    '<span style="font-size:15px;color:#66788A;margin-left:auto">' + meta + '</span>' +
    ecoPill(status, tone) +
    '</div>'
}
function showEcoReportForm() {
  // 环境问题上报 — 复用事件上报流程，直接进入第2步并预设“环境卫生”类型
  selectReportType('environment')
}
function showGarbageService() {
  const h = '<div style="padding:12px 0">' +
    '<p style="color:#66788A;font-size:15px;margin:0 0 14px 0;line-height:1.6">查看本村各垃圾点清运情况，堆积可一键申请清运。</p>' +
    '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">' +
    ecoRow('🏘️ 村东收集点', '今日 07:30 已清运', 'green', '已清运') +
    ecoRow('📍 1组垃圾点', '已超 24h 未清运', 'amber', '待清运') +
    ecoRow('🎭 文化广场', '今日 18:00 清运', 'green', '正常') +
    '</div>' +
    '<div style="background:#FFF8EC;border:1px solid #F5E3C4;border-radius:8px;padding:12px 14px;margin-bottom:16px">' +
    '<span style="font-size:15px;color:#B37B1E;line-height:1.6">⚠️ 1组垃圾点已超 24 小时未清运，建议尽快申请清运。</span></div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-outline" onclick="window._toast && window._toast(\'已为您接通保洁员\',\'info\')">📞 联系保洁员</button>' +
    '<button class="btn btn-primary" onclick="window._svc.requestGarbage()">🚚 申请清运</button>' +
    '</div></div>'
  openGovModal('🗑 垃圾清运', h)
}
function requestGarbage() {
  toast('清运申请已提交，保洁员将尽快处理', 'success')
  closeModal()
}
function showWaterService() {
  const h = '<div style="padding:12px 0">' +
    '<p style="color:#66788A;font-size:15px;margin:0 0 14px 0;line-height:1.6">本村各水塘、河道水质情况，异常点位已标注。</p>' +
    '<div style="background:#FDECEC;border:1px solid #F5C4C4;border-radius:8px;padding:14px;margin-bottom:14px">' +
    '<div style="display:flex;align-items:center;gap:8px;font-size:16px;color:#C0392B;font-weight:700;margin-bottom:8px">💧 3号水塘 · 溶解氧偏低</div>' +
    '<div style="font-size:15px;color:#8A3F3A;line-height:1.7">当前值 3.2mg/L，标准应 ≥5mg/L。溶解氧偏低可能影响鱼虾存活，请勿在附近取水饮用。</div>' +
    '</div>' +
    '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">' +
    ecoRow('1号水塘', '溶解氧 6.8mg/L', 'green', '正常') +
    ecoRow('2号水塘', '溶解氧 5.5mg/L', 'green', '正常') +
    ecoRow('村北河', 'pH 6.2', 'green', '正常') +
    '</div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #F0F3F5;padding-top:14px">' +
    '<button class="btn btn-outline" onclick="window._svc.selectReportType(\'environment\')">📷 上报水质问题</button>' +
    '<button class="btn btn-primary" onclick="window._toast && window._toast(\'已通知水务员到场处理\',\'success\')">🚨 通知处理</button>' +
    '</div></div>'
  openGovModal('💧 水质问题', h)
}
function showStrawService() {
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
}

${anchor}`;
if (s.includes(anchor)) { s = s.replace(anchor, funcs); check('2-insert-service-functions', true); }
else { check('2-insert-service-functions', false); }

// ===== 3. Register requestGarbage/requestStraw on window._svc =====
const oldSvc = `    showMyEventDetailById, filterMyReports, previewPhoto,`;
const newSvc = `    showMyEventDetailById, filterMyReports, previewPhoto, requestGarbage, requestStraw,`;
if (s.includes(oldSvc)) { s = s.replace(oldSvc, newSvc); check('3-register-svc-handlers', true); }
else { check('3-register-svc-handlers', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== ECOLOGY QUICK ACTIONS ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
