// Fix: part 2 — downloadTemplate and showReplayFor material rows
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/ServicePage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 3. Rewrite downloadTemplate material rows =====
// The \\' becomes \' (actual backslash+quote in the .vue file)
// The \\u{2B07} becomes \u{2B07} (Unicode escape in the .vue file)
const oldDlTempMat = `      svc.materials.forEach(m=>{
        h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 8px;background:rgba(10,36,68,0.40);border-radius:4px;margin-bottom:3px">'
        h+='<span style="font-size:11px;color:#D0E4F5">\📄 '+m.name+'</span>'
        h+='<span style="font-size:10px;color:#6F91A8;margin:0 8px">'+m.fmt+'</span>'
        h+='<span style="font-size:10px;color:#28C7FA;cursor:pointer;flex-shrink:0" onclick="event.stopPropagation();window._svc.toast(\\'模板文件加载中，请稍后重试\\',\\'info\\')">\\u{2B07} 下载</span>'
        h+='</div>'
      })`;

// Check if this pattern exists in the file
if (s.includes(oldDlTempMat)) {
  const newDlTempMat = `      svc.materials.forEach(m=>{
        if(m.url){
          h+='<div onclick="window._svc.openResource(\\''+m.url+'\\')" style="display:flex;align-items:center;justify-content:space-between;padding:6px 8px;background:rgba(10,36,68,0.40);border-radius:4px;margin-bottom:3px;cursor:pointer;transition:background 0.2s" onmouseover="this.style.background=\\'rgba(40,199,250,0.10)\\';this.style.borderColor=\\'rgba(40,199,250,0.25)\\'" onmouseout="this.style.background=\\'rgba(10,36,68,0.40)\\';this.style.borderColor=\\'transparent\\'">'
          h+='<span style="font-size:11px;color:#D0E4F5">📄 '+m.name+'</span>'
          h+='<span style="font-size:10px;color:#6F91A8;margin:0 8px">'+m.fmt+'</span>'
          h+='<span style="font-size:10px;color:#28C7FA;flex-shrink:0">⬇ 下载</span>'
        }else{
          h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 8px;background:rgba(10,36,68,0.40);border-radius:4px;margin-bottom:3px">'
          h+='<span style="font-size:11px;color:#D0E4F5">📄 '+m.name+'</span>'
          h+='<span style="font-size:10px;color:#6F91A8;margin:0 8px">'+m.fmt+'</span>'
          h+='<span style="font-size:10px;color:#6F91A8;flex-shrink:0">暂未上传</span>'
        }
        h+='</div>'
      })`;
  s = s.replace(oldDlTempMat, newDlTempMat);
  check('3-downloadTemplate-materials', true);
} else { check('3-downloadTemplate-materials', false); }

// ===== 4. Update showReplayFor materials =====
// The \\u{1F4C4} becomes \u{1F4C4} (Unicode escape in the .vue file)
const oldReplayMat = `    mats.forEach(m=>{
      h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:rgba(10,36,68,0.40);border-radius:6px;margin-bottom:6px">'
      h+='<span style="font-size:12px;color:#D0E4F5">\\u{1F4C4} '+m.name+'</span>'
      h+='<span style="font-size:10px;color:#28C7FA;cursor:pointer" onclick="window._svc.openResource(\\''+m.url+'\\')">查看</span>'
      h+='</div>'
    })`;

if (s.includes(oldReplayMat)) {
  const newReplayMat = `    mats.forEach(m=>{
      if(m.url){
        h+='<div onclick="window._svc.openResource(\\''+m.url+'\\')" style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:rgba(10,36,68,0.40);border-radius:6px;margin-bottom:6px;cursor:pointer;transition:background 0.2s" onmouseover="this.style.background=\\'rgba(40,199,250,0.10)\\';this.style.borderColor=\\'rgba(40,199,250,0.25)\\'" onmouseout="this.style.background=\\'rgba(10,36,68,0.40)\\';this.style.borderColor=\\'transparent\\'">'
        h+='<span style="font-size:12px;color:#D0E4F5">📄 '+m.name+'</span>'
        h+='<span style="font-size:10px;color:#28C7FA">查看</span>'
      }else{
        h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:rgba(10,36,68,0.40);border-radius:6px;margin-bottom:6px">'
        h+='<span style="font-size:12px;color:#D0E4F5">📄 '+m.name+'</span>'
        h+='<span style="font-size:10px;color:#6F91A8">暂未上传</span>'
      }
      h+='</div>'
    })`;
  s = s.replace(oldReplayMat, newReplayMat);
  check('4-showReplayFor-materials', true);
} else { check('4-showReplayFor-materials', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== FINAL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
