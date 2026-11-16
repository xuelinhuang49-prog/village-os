// Fix: Unify Industry Center font sizes to match Service Center standards
// Only adjusts content area fonts; header, tabs, breadcrumbs, sidebar NOT affected
const fs = require('fs');

// ===== IndustryPage.vue =====
const indFp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/IndustryPage.vue';
let s = fs.readFileSync(indFp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// Page title: 17px -> 28px
if (s.includes('.pg-tt { font-size: 17px; font-weight: 700;')) {
  s = s.replace('.pg-tt { font-size: 17px; font-weight: 700;', '.pg-tt { font-size: 28px; font-weight: 700;');
  check('ind-1-pg-tt', true);
} else { check('ind-1-pg-tt', false); }

// Stat card value: 22px -> 30px
if (s.includes('.scard .sv { font-size: 22px; font-weight: 700;')) {
  s = s.replace('.scard .sv { font-size: 22px; font-weight: 700;', '.scard .sv { font-size: 30px; font-weight: 700;');
  check('ind-2-scard-sv', true);
} else { check('ind-2-scard-sv', false); }

// Stat card label: 10px -> 16px
if (s.includes('.scard .sl { font-size: 10px;')) {
  s = s.replace('.scard .sl { font-size: 10px;', '.scard .sl { font-size: 16px;');
  check('ind-3-scard-sl', true);
} else { check('ind-3-scard-sl', false); }

// Table: 12px -> 14px
if (s.includes('table { width: 100%; border-collapse: collapse; font-size: 12px; }')) {
  s = s.replace('table { width: 100%; border-collapse: collapse; font-size: 12px; }', 'table { width: 100%; border-collapse: collapse; font-size: 14px; }');
  check('ind-4a-table', true);
} else { check('ind-4a-table', false); }

// th/td: 11px -> 13px
if (s.includes('th, td { padding: 8px 12px; text-align: left; font-size: 11px; }')) {
  s = s.replace('th, td { padding: 8px 12px; text-align: left; font-size: 11px; }', 'th, td { padding: 8px 12px; text-align: left; font-size: 13px; }');
  check('ind-4b-th-td', true);
} else { check('ind-4b-th-td', false); }

// th: 10px -> 13px
if (s.includes('th { background: rgba(10,36,68,0.55); font-weight: 600; color: #6F91A8; border-bottom: 2px solid rgba(40,199,111,0.10); font-size: 10px; }')) {
  s = s.replace('th { background: rgba(10,36,68,0.55); font-weight: 600; color: #6F91A8; border-bottom: 2px solid rgba(40,199,111,0.10); font-size: 10px; }', 'th { background: rgba(10,36,68,0.55); font-weight: 600; color: #6F91A8; border-bottom: 2px solid rgba(40,199,111,0.10); font-size: 13px; }');
  check('ind-4c-th', true);
} else { check('ind-4c-th', false); }

// Tag: 10px -> 12px
if (s.includes('.tag { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; }')) {
  s = s.replace('.tag { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; }', '.tag { display: inline-block; padding: 3px 10px; border-radius: 10px; font-size: 12px; font-weight: 600; }');
  check('ind-5-tag', true);
} else { check('ind-5-tag', false); }

// Button: 11px -> 12px
if (s.includes('.btn { display: inline-block; padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 600;')) {
  s = s.replace('.btn { display: inline-block; padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 600;', '.btn { display: inline-block; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;');
  check('ind-6a-btn', true);
} else { check('ind-6a-btn', false); }

// btn-s: 10px -> 11px
if (s.includes('.btn-s { padding: 3px 9px; font-size: 10px; }')) {
  s = s.replace('.btn-s { padding: 3px 9px; font-size: 10px; }', '.btn-s { padding: 4px 10px; font-size: 11px; }');
  check('ind-6b-btn-s', true);
} else { check('ind-6b-btn-s', false); }

// Module title: 19px -> 22px
if (s.includes('.module-title { margin: 0 0 8px; color: #fff; font-size: 19px; font-weight: 700;')) {
  s = s.replace('.module-title { margin: 0 0 8px; color: #fff; font-size: 19px; font-weight: 700;', '.module-title { margin: 0 0 8px; color: #fff; font-size: 22px; font-weight: 700;');
  check('ind-7-module-title', true);
} else { check('ind-7-module-title', false); }

// Module desc: 14px keep, just verify
check('ind-8-module-desc-unchanged', s.includes('.module-desc { min-height: 44px; margin: 0 0 16px; color: rgba(159,187,207,0.82); font-size: 14px;'));

// Spot card name: 15px -> 18px
if (s.includes('.spot-card-name{font-size:15px;font-weight:700;')) {
  s = s.replace('.spot-card-name{font-size:15px;font-weight:700;', '.spot-card-name{font-size:18px;font-weight:700;');
  check('ind-9-spot-name', true);
} else { check('ind-9-spot-name', false); }

// Spot card desc: 11px -> 14px
if (s.includes('.spot-card-desc{font-size:11px;color:#6F91A8;')) {
  s = s.replace('.spot-card-desc{font-size:11px;color:#6F91A8;', '.spot-card-desc{font-size:14px;color:#6F91A8;');
  check('ind-10-spot-desc', true);
} else { check('ind-10-spot-desc', false); }

// Spot card rating: 10px -> 12px
if (s.includes('.spot-card-rating{font-size:10px;color:#F5B83D;')) {
  s = s.replace('.spot-card-rating{font-size:10px;color:#F5B83D;', '.spot-card-rating{font-size:12px;color:#F5B83D;');
  check('ind-11-spot-rating', true);
} else { check('ind-11-spot-rating', false); }

// Spot tag: 9px -> 11px
if (s.includes('.spot-tag{display:inline-block;font-size:9px;')) {
  s = s.replace('.spot-tag{display:inline-block;font-size:9px;', '.spot-tag{display:inline-block;font-size:11px;');
  check('ind-12-spot-tag', true);
} else { check('ind-12-spot-tag', false); }

// Spot info sub: 9px -> 11px
if (s.includes('.spot-info-sub{font-size:9px;color:#6F91A8;')) {
  s = s.replace('.spot-info-sub{font-size:9px;color:#6F91A8;', '.spot-info-sub{font-size:11px;color:#6F91A8;');
  check('ind-13-spot-info-sub', true);
} else { check('ind-13-spot-info-sub', false); }

// Valve name: 14px -> 16px
if (s.includes('.valve-name { font-weight: 600; color: #fff; font-size: 14px;')) {
  s = s.replace('.valve-name { font-weight: 600; color: #fff; font-size: 14px;', '.valve-name { font-weight: 600; color: #fff; font-size: 16px;');
  check('ind-14-valve-name', true);
} else { check('ind-14-valve-name', false); }

// Valve desc: 11px -> 13px
if (s.includes('.valve-desc { font-size: 11px;')) {
  s = s.replace('.valve-desc { font-size: 11px;', '.valve-desc { font-size: 13px;');
  check('ind-15-valve-desc', true);
} else { check('ind-15-valve-desc', false); }

// vd-val: 15px -> 24px
if (s.includes('.vd-val { font-size: 15px; font-weight: 700;')) {
  s = s.replace('.vd-val { font-size: 15px; font-weight: 700;', '.vd-val { font-size: 24px; font-weight: 700;');
  check('ind-16-vd-val', true);
} else { check('ind-16-vd-val', false); }

// vd-label: 10px -> 12px
if (s.includes('.vd-label { display: block; font-size: 10px;')) {
  s = s.replace('.vd-label { display: block; font-size: 10px;', '.vd-label { display: block; font-size: 12px;');
  check('ind-17-vd-label', true);
} else { check('ind-17-vd-label', false); }

// ds-title: 12px -> 14px
if (s.includes('.ds-title { font-size: 12px; font-weight: 700;')) {
  s = s.replace('.ds-title { font-size: 12px; font-weight: 700;', '.ds-title { font-size: 14px; font-weight: 700;');
  check('ind-18-ds-title', true);
} else { check('ind-18-ds-title', false); }

// dyn-val: 18px -> 24px
if (s.includes('.dyn-val{font-size:18px;font-weight:700;')) {
  s = s.replace('.dyn-val{font-size:18px;font-weight:700;', '.dyn-val{font-size:24px;font-weight:700;');
  check('ind-19-dyn-val', true);
} else { check('ind-19-dyn-val', false); }

// dyn-label: 10px -> 12px
if (s.includes('.dyn-label{font-size:10px;color:#6F91A8;')) {
  s = s.replace('.dyn-label{font-size:10px;color:#6F91A8;', '.dyn-label{font-size:12px;color:#6F91A8;');
  check('ind-20-dyn-label', true);
} else { check('ind-20-dyn-label', false); }

// tl-content: 11px -> 13px
if (s.includes('.tl-content { flex: 1; font-size: 11px; }')) {
  s = s.replace('.tl-content { flex: 1; font-size: 11px; }', '.tl-content { flex: 1; font-size: 13px; }');
  check('ind-21-tl-content', true);
} else { check('ind-21-tl-content', false); }

// tl-content .tld: 10px -> 12px
if (s.includes('.tl-content .tld { color: #6F91A8; font-size: 10px;')) {
  s = s.replace('.tl-content .tld { color: #6F91A8; font-size: 10px;', '.tl-content .tld { color: #6F91A8; font-size: 12px;');
  check('ind-22-tld', true);
} else { check('ind-22-tld', false); }

// tl-content .tltm: 9px -> 11px
if (s.includes('.tl-content .tltm { color: #6F91A8; font-size: 9px; }')) {
  s = s.replace('.tl-content .tltm { color: #6F91A8; font-size: 9px; }', '.tl-content .tltm { color: #6F91A8; font-size: 11px; }');
  check('ind-23-tltm', true);
} else { check('ind-23-tltm', false); }

// fld label: 11px -> 13px
if (s.includes('.fld label { display: block; font-size: 11px;')) {
  s = s.replace('.fld label { display: block; font-size: 11px;', '.fld label { display: block; font-size: 13px;');
  check('ind-24-fld-label', true);
} else { check('ind-24-fld-label', false); }

// fld input/select/textarea: 12px -> 13px
if (s.includes('.fld input, .fld select, .fld textarea { width: 100%; padding: 8px 10px; border-radius: 8px; font-size: 12px;')) {
  s = s.replace('.fld input, .fld select, .fld textarea { width: 100%; padding: 8px 10px; border-radius: 8px; font-size: 12px;', '.fld input, .fld select, .fld textarea { width: 100%; padding: 8px 10px; border-radius: 8px; font-size: 13px;');
  check('ind-25-fld-input', true);
} else { check('ind-25-fld-input', false); }

// fin: 12px -> 13px
if (s.includes('.fin { width: 100%; padding: 8px 10px; border-radius: 8px; font-size: 12px;')) {
  s = s.replace('.fin { width: 100%; padding: 8px 10px; border-radius: 8px; font-size: 12px;', '.fin { width: 100%; padding: 8px 10px; border-radius: 8px; font-size: 13px;');
  check('ind-26-fin', true);
} else { check('ind-26-fin', false); }

// drawer-hd h3: 14px -> 16px
if (s.includes('.drawer-hd h3 { font-size: 14px; font-weight: 700;')) {
  s = s.replace('.drawer-hd h3 { font-size: 14px; font-weight: 700;', '.drawer-hd h3 { font-size: 16px; font-weight: 700;');
  check('ind-27-drawer-h3', true);
} else { check('ind-27-drawer-h3', false); }

// fl label: 11px -> 13px
if (s.includes('.fl { margin-bottom: 10px; } .fl label { display: block; font-size: 11px;')) {
  s = s.replace('.fl { margin-bottom: 10px; } .fl label { display: block; font-size: 11px;', '.fl { margin-bottom: 10px; } .fl label { display: block; font-size: 13px;');
  check('ind-28-fl-label', true);
} else { check('ind-28-fl-label', false); }

// ds-sub-title: 12px -> 14px
const dsSubOld = '.ds-sub-title{font-size:12px;font-weight:600;color:#28C76F;margin-bottom:8px}';
const dsSubNew = '.ds-sub-title{font-size:14px;font-weight:600;color:#28C76F;margin-bottom:8px}';
if (s.includes(dsSubOld)) { s = s.replace(dsSubOld, dsSubNew); check('ind-29-ds-sub-title', true); }
else { check('ind-29-ds-sub-title', false); }

// module-tag: 12px -> 13px
if (s.includes('.module-tag { display: inline-flex; align-items: center; height: 25px; padding: 0 11px; color: #13df92; font-size: 12px;')) {
  s = s.replace('.module-tag { display: inline-flex; align-items: center; height: 25px; padding: 0 11px; color: #13df92; font-size: 12px;', '.module-tag { display: inline-flex; align-items: center; height: 25px; padding: 0 11px; color: #13df92; font-size: 13px;');
  check('ind-30-module-tag', true);
} else { check('ind-30-module-tag', false); }

// tb table: 10px -> 12px (the compact table variant)
const tbOld = '.tb{width:100%;border-collapse:collapse}.tb th,.tb td{padding:8px 10px;text-align:left;font-size:10px}';
const tbNew = '.tb{width:100%;border-collapse:collapse}.tb th,.tb td{padding:8px 10px;text-align:left;font-size:12px}';
if (s.includes(tbOld)) { s = s.replace(tbOld, tbNew); check('ind-31-tb', true); }
else { check('ind-31-tb', false); }

// pd: 9px -> 11px
const pdOld = '.pd{font-size:9px;color:#6F91A8;margin-top:1px}';
const pdNew = '.pd{font-size:11px;color:#6F91A8;margin-top:1px}';
if (s.includes(pdOld)) { s = s.replace(pdOld, pdNew); check('ind-32-pd', true); }
else { check('ind-32-pd', false); }

// npk-label: 11px -> 13px
if (s.includes('.npk-label { font-size: 11px;')) {
  s = s.replace('.npk-label { font-size: 11px;', '.npk-label { font-size: 13px;');
  check('ind-33-npk-label', true);
} else { check('ind-33-npk-label', false); }

// alert-item: 11px -> 13px
if (s.includes('.alert-item { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 8px; background: rgba(10,36,68,0.55); font-size: 11px; }')) {
  s = s.replace('.alert-item { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 8px; background: rgba(10,36,68,0.55); font-size: 11px; }', '.alert-item { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 8px; background: rgba(10,36,68,0.55); font-size: 13px; }');
  check('ind-34-alert-item', true);
} else { check('ind-34-alert-item', false); }

// fl2: 11px -> 13px
if (s.includes('.fl2 { display: flex; align-items: center; gap: 4px; font-size: 11px;')) {
  s = s.replace('.fl2 { display: flex; align-items: center; gap: 4px; font-size: 11px;', '.fl2 { display: flex; align-items: center; gap: 4px; font-size: 13px;');
  check('ind-35-fl2', true);
} else { check('ind-35-fl2', false); }

// pg: 11px -> 12px
if (s.includes('.pg { display: flex; justify-content: flex-end; gap: 4px; margin-top: 10px; font-size: 11px;')) {
  s = s.replace('.pg { display: flex; justify-content: flex-end; gap: 4px; margin-top: 10px; font-size: 11px;', '.pg { display: flex; justify-content: flex-end; gap: 4px; margin-top: 10px; font-size: 12px;');
  check('ind-36-pg', true);
} else { check('ind-36-pg', false); }

// Valve btn: 11px -> 12px
if (s.includes('.valve-btn { padding: 5px 16px; border-radius: 14px; border: none; cursor: pointer; font-size: 11px;')) {
  s = s.replace('.valve-btn { padding: 5px 16px; border-radius: 14px; border: none; cursor: pointer; font-size: 11px;', '.valve-btn { padding: 5px 16px; border-radius: 14px; border: none; cursor: pointer; font-size: 12px;');
  check('ind-37-valve-btn', true);
} else { check('ind-37-valve-btn', false); }

// valve-runtime: 10px -> 11px
if (s.includes('.valve-runtime { font-size: 10px;')) {
  s = s.replace('.valve-runtime { font-size: 10px;', '.valve-runtime { font-size: 11px;');
  check('ind-38-valve-runtime', true);
} else { check('ind-38-valve-runtime', false); }

// stat card min-height reduce (was 205px - too tall for the new font sizes)
// Actually, let's keep the card sizing but adjust to accommodate larger text
if (s.includes('min-height: 205px;')) {
  s = s.replace('min-height: 205px;', 'min-height: auto;');
  check('ind-39-stat-min-height', true);
} else { check('ind-39-stat-min-height', false); }

// module-icon: 23px -> 28px
if (s.includes('.module-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: rgba(10,61,92,0.72); font-size: 23px;')) {
  s = s.replace('.module-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: rgba(10,61,92,0.72); font-size: 23px;', '.module-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: rgba(10,61,92,0.72); font-size: 28px;');
  check('ind-40-module-icon', true);
} else { check('ind-40-module-icon', false); }

fs.writeFileSync(indFp, s, 'utf-8');
console.log('IndustryPage: ' + ok + '/' + total + ' passed');
console.log('Length:', s.length);
