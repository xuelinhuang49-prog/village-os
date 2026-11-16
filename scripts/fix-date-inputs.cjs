const fs = require('fs');
const path = require('path');
const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');
let s = fs.readFileSync(fp, 'utf-8');

// Pattern: the old date input with type-swap trick
const oldDateInput = /<input id="(rb_date|reg_date|rr_start|rr_end)" type="text" placeholder="请选择日期" onfocus="this\.type=\'date\'" onblur="if\(!this\.value\)this\.type=\'text\'">/g;

// Replace with wrapper approach
s = s.replace(oldDateInput, (match, id) => {
  return '<div class="svc-date-wrap"><input type="date" id="' + id + '" onchange="this.parentElement.classList.toggle(\'has-val\',!!this.value)"><span class="svc-date-ph">请选择日期</span></div>';
});

// Now update the CSS section: replace the old date-related CSS with new wrapper CSS
const oldDateCss = '.svc-modal .svc-fld input[type="date"] { color-scheme:dark; }\n.svc-modal .svc-fld input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(0.65); }\n.svc-modal .svc-fld input[placeholder="请选择日期"] { background-image:url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236F91A8\' stroke-width=\'1.8\'%3e%3crect x=\'3\' y=\'4\' width=\'18\' height=\'18\' rx=\'2\'/%3e%3cline x1=\'16\' y1=\'2\' x2=\'16\' y2=\'6\'/%3e%3cline x1=\'8\' y1=\'2\' x2=\'8\' y2=\'6\'/%3e%3cline x1=\'3\' y1=\'10\' x2=\'21\' y2=\'10\'/%3e%3c/svg%3e"); background-repeat:no-repeat; background-position:right 12px center; background-size:15px; padding-right:36px; }';

const newDateCss = `/* Date input wrapper — hides browser default yyyy/mm/dd, shows custom placeholder */
.svc-modal .svc-date-wrap { position:relative; }
.svc-modal .svc-date-wrap input[type="date"] {
  width:100%; color-scheme:dark;
}
.svc-modal .svc-date-wrap input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(0.65); cursor:pointer; }
/* When no value selected, make input text transparent so overlay shows through */
.svc-modal .svc-date-wrap:not(.has-val) input[type="date"] { color:transparent; }
.svc-modal .svc-date-ph {
  position:absolute; left:14px; top:50%; transform:translateY(-50%);
  color:#6F91A8; font-size:13px; pointer-events:none; z-index:1;
  white-space:nowrap;
}
.svc-modal .svc-date-wrap.has-val .svc-date-ph { display:none; }`;

if (s.includes(oldDateCss)) {
  s = s.replace(oldDateCss, newDateCss);
} else {
  console.log('WARNING: Could not find old date CSS to replace. Trying partial match...');
  // Try to find the lines
  const idx1 = s.indexOf('.svc-modal .svc-fld input[type="date"] { color-scheme:dark; }');
  if (idx1 !== -1) {
    const idx2 = s.indexOf('padding-right:36px; }', idx1);
    if (idx2 !== -1) {
      const idxEnd = idx2 + 'padding-right:36px; }'.length;
      s = s.substring(0, idx1) + newDateCss + s.substring(idxEnd);
      console.log('Replaced via index search.');
    } else {
      console.log('ERROR: Could not find end of old date CSS.');
    }
  } else {
    console.log('ERROR: Could not find start of old date CSS.');
  }
}

fs.writeFileSync(fp, s, 'utf-8');
console.log('Done. File length:', s.length, 'chars');
