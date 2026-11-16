// Fix: make materials clickable in showServiceGuide, downloadTemplate, showReplayFor
// Add url fields to governmentServices, create placeholder files
const fs = require('fs');
const path = require('path');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/ServicePage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. Add url fields to governmentServices materials =====
const oldSvc1 = `{ id:'S1', name:'身份证换领', category:'证件办理', window:'户籍窗口', duration:'30分钟', guide:'请携带原身份证、户口本原件及近期一寸免冠照片2张，本人前往户籍窗口办理。办理时限：15个工作日。咨询电话：12345。', materials:[{name:'身份证换领申请表',fmt:'PDF'},{name:'证件照要求说明',fmt:'PDF'}] }`;
const newSvc1 = `{ id:'S1', name:'身份证换领', category:'证件办理', window:'户籍窗口', duration:'30分钟', guide:'请携带原身份证、户口本原件及近期一寸免冠照片2张，本人前往户籍窗口办理。办理时限：15个工作日。咨询电话：12345。', materials:[{name:'身份证换领申请表',fmt:'PDF',url:'/files/id-card-application.pdf'},{name:'证件照要求说明',fmt:'PDF',url:'/files/photo-requirements.pdf'}] }`;

if (s.includes(oldSvc1)) { s = s.replace(oldSvc1, newSvc1); check('1a-S1-urls', true); }
else { check('1a-S1-urls', false); }

const oldSvc2 = `{ id:'S2', name:'户口相关业务', category:'证件办理', window:'户籍窗口', duration:'30分钟', guide:'户口迁移、登记、注销等业务请携带相关证明材料。具体材料清单请查看材料模板。咨询电话：12345。', materials:[{name:'户口迁移申请表',fmt:'DOCX'},{name:'亲属关系证明模板',fmt:'DOCX'}] }`;
const newSvc2 = `{ id:'S2', name:'户口相关业务', category:'证件办理', window:'户籍窗口', duration:'30分钟', guide:'户口迁移、登记、注销等业务请携带相关证明材料。具体材料清单请查看材料模板。咨询电话：12345。', materials:[{name:'户口迁移申请表',fmt:'DOCX',url:'/files/hukou-transfer-application.docx'},{name:'亲属关系证明模板',fmt:'DOCX',url:'/files/kinship-certificate-template.docx'}] }`;

if (s.includes(oldSvc2)) { s = s.replace(oldSvc2, newSvc2); check('1b-S2-urls', true); }
else { check('1b-S2-urls', false); }

const oldSvc3 = `{ id:'S3', name:'耕地补贴咨询', category:'补贴申请', window:'农业窗口', duration:'20分钟', guide:'请携带土地承包经营权证、身份证原件。补贴标准以县级农业农村部门核定为准，通过惠民"一卡通"发放。咨询电话：12345。', materials:[{name:'耕地补贴申请表',fmt:'DOCX'},{name:'土地承包证明模板',fmt:'DOCX'}] }`;
const newSvc3 = `{ id:'S3', name:'耕地补贴咨询', category:'补贴申请', window:'农业窗口', duration:'20分钟', guide:'请携带土地承包经营权证、身份证原件。补贴标准以县级农业农村部门核定为准，通过惠民"一卡通"发放。咨询电话：12345。', materials:[{name:'耕地补贴申请表',fmt:'DOCX',url:'/files/farmland-subsidy-application.docx'},{name:'土地承包证明模板',fmt:'DOCX',url:'/files/land-contract-certificate.docx'}] }`;

if (s.includes(oldSvc3)) { s = s.replace(oldSvc3, newSvc3); check('1c-S3-urls', true); }
else { check('1c-S3-urls', false); }

const oldSvc4 = `{ id:'S4', name:'农业用地证明', category:'证明开具', window:'综合窗口', duration:'15分钟', guide:'请携带土地承包合同或村委会证明、身份证原件。办理时限：3个工作日。', materials:[{name:'农业用地证明申请表',fmt:'DOCX'},{name:'村委会证明模板',fmt:'DOCX'}] }`;
const newSvc4 = `{ id:'S4', name:'农业用地证明', category:'证明开具', window:'综合窗口', duration:'15分钟', guide:'请携带土地承包合同或村委会证明、身份证原件。办理时限：3个工作日。', materials:[{name:'农业用地证明申请表',fmt:'DOCX',url:'/files/ag-land-cert-application.docx'},{name:'村委会证明模板',fmt:'DOCX',url:'/files/village-committee-cert.docx'}] }`;

if (s.includes(oldSvc4)) { s = s.replace(oldSvc4, newSvc4); check('1d-S4-urls', true); }
else { check('1d-S4-urls', false); }

const oldSvc5 = `{ id:'S5', name:'低保业务咨询', category:'补贴申请', window:'综合窗口', duration:'20分钟', guide:'请携带身份证、户口本、收入证明等材料。低保标准根据当地政策执行，具体请咨询窗口工作人员。', materials:[{name:'低保申请表',fmt:'DOCX'},{name:'家庭收入申报表',fmt:'DOCX'}] }`;
const newSvc5 = `{ id:'S5', name:'低保业务咨询', category:'补贴申请', window:'综合窗口', duration:'20分钟', guide:'请携带身份证、户口本、收入证明等材料。低保标准根据当地政策执行，具体请咨询窗口工作人员。', materials:[{name:'低保申请表',fmt:'DOCX',url:'/files/dibao-application.docx'},{name:'家庭收入申报表',fmt:'DOCX',url:'/files/household-income-form.docx'}] }`;

if (s.includes(oldSvc5)) { s = s.replace(oldSvc5, newSvc5); check('1e-S5-urls', true); }
else { check('1e-S5-urls', false); }

const oldSvc6 = `{ id:'S6', name:'养老认证咨询', category:'其他', window:'综合窗口', duration:'15分钟', guide:'城乡居民养老保险待遇领取资格认证，每年一次。请携带身份证和社保卡。也可通过"陕西养老保险"APP自助认证。', materials:[{name:'养老认证操作指南',fmt:'PDF'}] }`;
const newSvc6 = `{ id:'S6', name:'养老认证咨询', category:'其他', window:'综合窗口', duration:'15分钟', guide:'城乡居民养老保险待遇领取资格认证，每年一次。请携带身份证和社保卡。也可通过"陕西养老保险"APP自助认证。', materials:[{name:'养老认证操作指南',fmt:'PDF',url:'/files/pension-auth-guide.pdf'}] }`;

if (s.includes(oldSvc6)) { s = s.replace(oldSvc6, newSvc6); check('1f-S6-urls', true); }
else { check('1f-S6-urls', false); }

// ===== 2. Rewrite showServiceGuide material rows to be clickable =====
// Note: in the .vue source, the onclick needs to contain \' which in JS is an escaped single quote
// The source string contains: window._svc.openResource(\''+m.url+'\')
// In this .cjs file, we write that exactly as it should appear in the .vue file
const oldSvcGuideMat = `    svc.materials.forEach(m=>{
      h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:rgba(10,36,68,0.40);border-radius:6px;margin-bottom:4px">'
      h+='<span style="font-size:11px;color:#D0E4F5">📄 '+m.name+'</span>'
      h+='<span style="font-size:10px;color:#28C7FA">'+m.fmt+'</span>'
      h+='</div>'
    })`;

const newSvcGuideMat = `    svc.materials.forEach(m=>{
      if(m.url){
        h+='<div onclick="window._svc.openResource(\\''+m.url+'\\')" style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:rgba(10,36,68,0.40);border-radius:6px;margin-bottom:4px;cursor:pointer;transition:background 0.2s" onmouseover="this.style.background=\\'rgba(40,199,250,0.10)\\';this.style.borderColor=\\'rgba(40,199,250,0.30)\\';this.style.border=\\'1px solid rgba(40,199,250,0.30)\\'" onmouseout="this.style.background=\\'rgba(10,36,68,0.40)\\';this.style.borderColor=\\'transparent\\';this.style.border=\\'1px solid transparent\\'">'
        h+='<span style="font-size:11px;color:#D0E4F5">📄 '+m.name+'</span>'
        h+='<span style="font-size:10px;color:#28C7FA">'+m.fmt+'</span>'
      }else{
        h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:rgba(10,36,68,0.40);border-radius:6px;margin-bottom:4px">'
        h+='<span style="font-size:11px;color:#D0E4F5">📄 '+m.name+'</span>'
        h+='<span style="font-size:10px;color:#6F91A8">暂未上传</span>'
      }
      h+='</div>'
    })`;

if (s.includes(oldSvcGuideMat)) { s = s.replace(oldSvcGuideMat, newSvcGuideMat); check('2-showServiceGuide-materials', true); }
else { check('2-showServiceGuide-materials', false); }

// ===== 3. Rewrite downloadTemplate material rows to be clickable =====
const oldDlTempMat = `      svc.materials.forEach(m=>{
        h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 8px;background:rgba(10,36,68,0.40);border-radius:4px;margin-bottom:3px">'
        h+='<span style="font-size:11px;color:#D0E4F5">📄 '+m.name+'</span>'
        h+='<span style="font-size:10px;color:#6F91A8;margin:0 8px">'+m.fmt+'</span>'
        h+='<span style="font-size:10px;color:#28C7FA;cursor:pointer;flex-shrink:0" onclick="event.stopPropagation();window._svc.toast(\\'模板文件加载中，请稍后重试\\',\\'info\\')">⬇ 下载</span>'
        h+='</div>'
      })`;

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

if (s.includes(oldDlTempMat)) { s = s.replace(oldDlTempMat, newDlTempMat); check('3-downloadTemplate-materials', true); }
else { check('3-downloadTemplate-materials', false); }

// ===== 4. Update showReplayFor materials to full-row clickable =====
const oldReplayMat = `    mats.forEach(m=>{
      h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:rgba(10,36,68,0.40);border-radius:6px;margin-bottom:6px">'
      h+='<span style="font-size:12px;color:#D0E4F5">📄 '+m.name+'</span>'
      h+='<span style="font-size:10px;color:#28C7FA;cursor:pointer" onclick="window._svc.openResource(\\''+m.url+'\\')">查看</span>'
      h+='</div>'
    })`;

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

if (s.includes(oldReplayMat)) { s = s.replace(oldReplayMat, newReplayMat); check('4-showReplayFor-materials', true); }
else { check('4-showReplayFor-materials', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\\n=== FINAL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
