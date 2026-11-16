// Fix: Unify EcommercePage font sizes to match IndustryPage/ServiceCenter standards
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/industry/EcommercePage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// Page title: 17px -> 28px
const pgTtOld = '.pg-tt{font-size:17px;font-weight:700;color:#fff;margin-bottom:12px;margin-top:4px;padding:0}';
const pgTtNew = '.pg-tt{font-size:28px;font-weight:700;color:#fff;margin-bottom:12px;margin-top:4px;padding:0}';
if (s.includes(pgTtOld)) { s = s.replace(pgTtOld, pgTtNew); check('ec-1-pg-tt', true); }
else { check('ec-1-pg-tt', false); }

// .tt (section title): 12px -> 15px
const ttOld = '.pn{background:rgba(5,25,48,.96);border:1px solid rgba(190,214,234,.55);border-radius:10px;padding:12px 16px;margin-bottom:8px}.tt{font-size:12px;font-weight:700;color:#fff;margin-bottom:10px;display:flex;align-items:center;gap:6px}.tt::before{content:\'\';width:3px;height:11px;border-radius:2px;background:#28C76F}';
const ttNew = '.pn{background:rgba(5,25,48,.96);border:1px solid rgba(190,214,234,.55);border-radius:10px;padding:12px 16px;margin-bottom:8px}.tt{font-size:15px;font-weight:700;color:#fff;margin-bottom:10px;display:flex;align-items:center;gap:6px}.tt::before{content:\'\';width:3px;height:13px;border-radius:2px;background:#28C76F}';
if (s.includes(ttOld)) { s = s.replace(ttOld, ttNew); check('ec-2-tt', true); }
else { check('ec-2-tt', false); }

// .tb th/.tb td: 10px -> 12px
const tbTdOld = '.tb{width:100%;border-collapse:collapse}.tb th,.tb td{padding:8px 10px;text-align:left;font-size:10px}';
const tbTdNew = '.tb{width:100%;border-collapse:collapse}.tb th,.tb td{padding:8px 10px;text-align:left;font-size:12px}';
if (s.includes(tbTdOld)) { s = s.replace(tbTdOld, tbTdNew); check('ec-3-tb', true); }
else { check('ec-3-tb', false); }

// .tb th: 9px -> 12px
const tbThOld = '.tb th{background:rgba(10,36,68,.55);color:#6F91A8;border-bottom:2px solid rgba(40,199,111,.1);font-size:9px}';
const tbThNew = '.tb th{background:rgba(10,36,68,.55);color:#6F91A8;border-bottom:2px solid rgba(40,199,111,.1);font-size:12px}';
if (s.includes(tbThOld)) { s = s.replace(tbThOld, tbThNew); check('ec-4-th', true); }
else { check('ec-4-th', false); }

// .t (tags): 9px -> 10px
const tagOld = '.t{display:inline-block;padding:2px 6px;border-radius:9px;font-size:9px;font-weight:600}';
const tagNew = '.t{display:inline-block;padding:2px 6px;border-radius:9px;font-size:10px;font-weight:600}';
if (s.includes(tagOld)) { s = s.replace(tagOld, tagNew); check('ec-5-t', true); }
else { check('ec-5-t', false); }

// .pn2: no explicit size, but .pd: 9px -> 11px
const pdOld = '.pn2{font-weight:600;color:#fff}.pd{font-size:9px;color:#6F91A8;margin-top:1px}';
const pdNew = '.pn2{font-weight:600;color:#fff}.pd{font-size:11px;color:#6F91A8;margin-top:1px}';
if (s.includes(pdOld)) { s = s.replace(pdOld, pdNew); check('ec-6-pd', true); }
else { check('ec-6-pd', false); }

// .bp, .bo, .bd: 10px -> 12px
const btnOld = '.bp,.bo,.bd{padding:5px 10px;border-radius:7px;font-size:10px;font-weight:600;cursor:pointer;font-family:inherit}';
const btnNew = '.bp,.bo,.bd{padding:6px 12px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit}';
if (s.includes(btnOld)) { s = s.replace(btnOld, btnNew); check('ec-7-btn', true); }
else { check('ec-7-btn', false); }

// .bps: 8px -> 9px
const bpsOld = '.bps{padding:3px 6px;font-size:8px}';
const bpsNew = '.bps{padding:3px 6px;font-size:9px}';
if (s.includes(bpsOld)) { s = s.replace(bpsOld, bpsNew); check('ec-8-bps', true); }
else { check('ec-8-bps', false); }

// .dg3 .dl3: 9px -> 11px
const dl3Old = '.dg3{background:rgba(10,36,68,.55);padding:10px;border-radius:8px;margin-bottom:8px}.dl3{display:block;font-size:9px;color:#28C76F;margin-bottom:3px}.dg3 div:last-child{font-size:12px;color:#B7D3E8}';
const dl3New = '.dg3{background:rgba(10,36,68,.55);padding:10px;border-radius:8px;margin-bottom:8px}.dl3{display:block;font-size:11px;color:#28C76F;margin-bottom:3px}.dg3 div:last-child{font-size:14px;color:#B7D3E8}';
if (s.includes(dl3Old)) { s = s.replace(dl3Old, dl3New); check('ec-9-dl3', true); }
else { check('ec-9-dl3', false); }

// .dg2 .dl2: 9px -> 11px, last-child: 12px -> 14px
const dl2Old = '.dg2{background:rgba(10,36,68,.55);padding:10px;border-radius:8px;margin-bottom:8px}.dl2{display:block;font-size:9px;color:#28C76F;margin-bottom:3px}.dg2 div:last-child{font-size:12px;color:#B7D3E8}';
const dl2New = '.dg2{background:rgba(10,36,68,.55);padding:10px;border-radius:8px;margin-bottom:8px}.dl2{display:block;font-size:11px;color:#28C76F;margin-bottom:3px}.dg2 div:last-child{font-size:14px;color:#B7D3E8}';
if (s.includes(dl2Old)) { s = s.replace(dl2Old, dl2New); check('ec-10-dl2', true); }
else { check('ec-10-dl2', false); }

// .fi: 11px -> 12px
const fiOld = '.fi{background:rgba(57,217,138,.06);border:1px solid rgba(40,199,111,.1);color:#B7D3E8;border-radius:6px;padding:5px 8px;font-size:11px;font-family:inherit}';
const fiNew = '.fi{background:rgba(57,217,138,.06);border:1px solid rgba(40,199,111,.1);color:#B7D3E8;border-radius:6px;padding:5px 8px;font-size:12px;font-family:inherit}';
if (s.includes(fiOld)) { s = s.replace(fiOld, fiNew); check('ec-11-fi', true); }
else { check('ec-11-fi', false); }

// .ds-title: 11px -> 14px
const dsTOld = '.ds-title{font-size:11px;font-weight:700;color:#28C76F;margin:14px 0 8px;padding-bottom:4px;border-bottom:1px solid rgba(40,199,111,.1)}';
const dsTNew = '.ds-title{font-size:14px;font-weight:700;color:#28C76F;margin:14px 0 8px;padding-bottom:4px;border-bottom:1px solid rgba(40,199,111,.1)}';
if (s.includes(dsTOld)) { s = s.replace(dsTOld, dsTNew); check('ec-12-ds-title', true); }
else { check('ec-12-ds-title', false); }

// .fs-title: 11px -> 14px
const fsTOld = '.fs-title{font-size:11px;font-weight:700;color:#28C76F;margin:12px 0 8px;padding-bottom:4px;border-bottom:1px solid rgba(40,199,111,.1)}';
const fsTNew = '.fs-title{font-size:14px;font-weight:700;color:#28C76F;margin:12px 0 8px;padding-bottom:4px;border-bottom:1px solid rgba(40,199,111,.1)}';
if (s.includes(fsTOld)) { s = s.replace(fsTOld, fsTNew); check('ec-13-fs-title', true); }
else { check('ec-13-fs-title', false); }

// .cert-tag: 9px -> 10px
const certOld = '.cert-tag{padding:3px 8px;border-radius:12px;font-size:9px;';
const certNew = '.cert-tag{padding:3px 8px;border-radius:12px;font-size:10px;';
if (s.includes(certOld)) { s = s.replace(certOld, certNew); check('ec-14-cert-tag', true); }
else { check('ec-14-cert-tag', false); }

// .btn-text: 8px -> 10px
const btnTextOld = '.btn-text{padding:3px 6px;font-size:8px;';
const btnTextNew = '.btn-text{padding:3px 6px;font-size:10px;';
if (s.includes(btnTextOld)) { s = s.replace(btnTextOld, btnTextNew); check('ec-15-btn-text', true); }
else { check('ec-15-btn-text', false); }

// .act-btn: 9px -> 10px
const actBtnOld = '.act-btn{padding:3px 7px;font-size:9px;';
const actBtnNew = '.act-btn{padding:3px 7px;font-size:10px;';
if (s.includes(actBtnOld)) { s = s.replace(actBtnOld, actBtnNew); check('ec-16-act-btn', true); }
else { check('ec-16-act-btn', false); }

// .ri: 11px -> 13px
const riOld = '.ri{display:flex;align-items:center;padding:6px 0;border-bottom:1px solid rgba(14,165,233,.06);font-size:11px}';
const riNew = '.ri{display:flex;align-items:center;padding:6px 0;border-bottom:1px solid rgba(14,165,233,.06);font-size:13px}';
if (s.includes(riOld)) { s = s.replace(riOld, riNew); check('ec-17-ri', true); }
else { check('ec-17-ri', false); }

// .dd-menu div: 10px -> 11px
const ddOld = '.dd-menu div{padding:6px 12px;font-size:10px;';
const ddNew = '.dd-menu div{padding:6px 12px;font-size:11px;';
if (s.includes(ddOld)) { s = s.replace(ddOld, ddNew); check('ec-18-dd-menu', true); }
else { check('ec-18-dd-menu', false); }

// .live-prod-chip: 11px -> 12px
const lpcOld = '.live-prod-chip{padding:6px 12px;border-radius:8px;font-size:11px;';
const lpcNew = '.live-prod-chip{padding:6px 12px;border-radius:8px;font-size:12px;';
if (s.includes(lpcOld)) { s = s.replace(lpcOld, lpcNew); check('ec-19-live-prod-chip', true); }
else { check('ec-19-live-prod-chip', false); }

// .trace-flow-step: 10px -> 11px
const tfsOld = '.trace-flow-step{display:flex;align-items:center;gap:6px;flex-shrink:0;font-size:10px;';
const tfsNew = '.trace-flow-step{display:flex;align-items:center;gap:6px;flex-shrink:0;font-size:11px;';
if (s.includes(tfsOld)) { s = s.replace(tfsOld, tfsNew); check('ec-20-trace-flow', true); }
else { check('ec-20-trace-flow', false); }

// .st: 10px -> 11px
const stOld = '.st{font-size:10px;';
const stNew = '.st{font-size:11px;';
if (s.includes(stOld)) { s = s.replace(stOld, stNew); check('ec-21-st', true); }
else { check('ec-21-st', false); }

// .ec: overall font: 12px -> 13px
const ecOld = '.ec{min-height:100vh;background:#06192b;color:#fff;font-size:12px}';
const ecNew = '.ec{min-height:100vh;background:#06192b;color:#fff;font-size:13px}';
if (s.includes(ecOld)) { s = s.replace(ecOld, ecNew); check('ec-22-ec', true); }
else { check('ec-22-ec', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('EcommercePage: ' + ok + '/' + total + ' passed');
console.log('Length:', s.length);
