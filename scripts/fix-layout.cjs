// Fix ServicePage layout: full width, larger fonts, card system, breadcrumb→title
const fs = require('fs');
const path = require('path');

const fp = path.resolve(__dirname, '..', 'frontend/src/views/dashboard/ServicePage.vue');
let c = fs.readFileSync(fp, 'utf-8');

// === TEMPLATE CHANGES ===

// 1. Replace breadcrumb with page title bar
c = c.replace(
  '        <!-- Breadcrumb -->\r\n        <div class="bc">\r\n          <router-link to="/">首页</router-link> / <span>数字服务中心</span> /\r\n          <strong style="color:#39D98A">{{ activeTab.label }}</strong>\r\n        </div>',
  '        <!-- Page Title -->\r\n        <div class="page-title-bar">\r\n          <div class="page-title">{{ activeTab.label }}</div>\r\n          <div class="page-subtitle">{{ pageSubtitle }}</div>\r\n        </div>'
);

// 2. Add "快捷服务" label before quick actions
c = c.replace(
  '        <!-- Quick Actions -->\r\n        <div class="qa-row">',
  '        <!-- Quick Actions -->\r\n        <div class="qa-label">快捷服务</div>\r\n        <div class="qa-row">'
);

// 3. Wrap insurance "我的保障" in section-card
c = c.replace(
  '          <div class="section-title">&#x1F4CB; 我的保障</div>\r\n          <div class="insure-cards">',
  '          <div class="section-card">\r\n            <div class="section-title">&#x1F4CB; 我的保障</div>\r\n            <div class="insure-cards">'
);
// Close the card after insure-cards
c = c.replace(
  '          </div>\r\n          <div class="section-title" style="margin-top:16px">&#x1F3E5; 最近就诊记录</div>',
  '            </div>\r\n          </div>\r\n          <div class="section-card" style="margin-top:14px">\r\n            <div class="section-title">&#x1F3E5; 最近就诊记录</div>'
);
// Close card after medical records table
c = c.replace(
  '          </table>\r\n        </div>\r\n\r\n        <!-- Subsidy',
  '          </table>\r\n          </div>\r\n        </div>\r\n\r\n        <!-- Subsidy'
);

// 4. Wrap subsidy sections in cards
c = c.replace(
  '          <div class="section-title">&#x1F4CB; 可申请补贴</div>\r\n          <div class="subsidy-cards">',
  '          <div class="section-card">\r\n            <div class="section-title">&#x1F4CB; 可申请补贴</div>\r\n            <div class="subsidy-cards">'
);
c = c.replace(
  '          </div>\r\n          <div class="section-title" style="margin-top:16px">&#x1F4C4; 我的申请</div>',
  '            </div>\r\n          </div>\r\n          <div class="section-card" style="margin-top:14px">\r\n            <div class="section-title">&#x1F4C4; 我的申请</div>'
);
c = c.replace(
  '          </table>\r\n        </div>\r\n\r\n        <!-- Elderly',
  '          </table>\r\n          </div>\r\n        </div>\r\n\r\n        <!-- Elderly'
);

// 5. Wrap elderly in section-card
c = c.replace(
  '          <div class="section-title">&#x1F474; 家庭老人</div>\r\n          <div class="elder-cards">',
  '          <div class="section-card">\r\n            <div class="section-title">&#x1F474; 家庭老人</div>\r\n            <div class="elder-cards">'
);
c = c.replace(
  '          </div>\r\n        </div>\r\n\r\n        <!-- Telemed',
  '            </div>\r\n          </div>\r\n        </div>\r\n\r\n        <!-- Telemed'
);

// 6. Wrap telemed in section-card
c = c.replace(
  '          <div class="section-title">&#x1F4F9; 我的问诊记录</div>\r\n          <table class="data-table">',
  '          <div class="section-card">\r\n            <div class="section-title">&#x1F4F9; 我的问诊记录</div>\r\n            <table class="data-table">'
);
c = c.replace(
  '          </table>\r\n        </div>\r\n\r\n        <!-- Training',
  '          </table>\r\n          </div>\r\n        </div>\r\n\r\n        <!-- Training'
);

// 7. Wrap training sections in cards
c = c.replace(
  '          <div class="section-title">&#x1F393; 可报名课程</div>\r\n          <div class="course-cards">',
  '          <div class="section-card">\r\n            <div class="section-title">&#x1F393; 可报名课程</div>\r\n            <div class="course-cards">'
);
c = c.replace(
  '          </div>\r\n          <div class="section-title" style="margin-top:16px">&#x1F4DA; 我的学习</div>',
  '            </div>\r\n          </div>\r\n          <div class="section-card" style="margin-top:14px">\r\n            <div class="section-title">&#x1F4DA; 我的学习</div>'
);
c = c.replace(
  '          </table>\r\n        </div>\r\n\r\n        <!-- Appointment',
  '          </table>\r\n          </div>\r\n        </div>\r\n\r\n        <!-- Appointment'
);

// 8. Wrap appointment sections in cards
c = c.replace(
  '          <div class="apt-layout">',
  '          <div class="section-card">\r\n            <div class="apt-layout">'
);
c = c.replace(
  '          </div>\r\n        </div>\r\n\r\n        <!-- Chart Area -->',
  '            </div>\r\n          </div>\r\n        </div>\r\n\r\n        <!-- Chart Area -->'
);

// === SCRIPT CHANGES ===

// 9. Add pageSubtitle computed (after kpiCards computed closing)
c = c.replace(
  "  return []\r\n})\r\n\r\n// ===== QUICK ACTIONS =====",
  "  return []\r\n})\r\n\r\n// ===== PAGE SUBTITLE =====\r\nconst pageSubtitle = computed(() => {\r\n  const map = {\r\n    insurance: '为您提供个人医保、养老保险及就医服务',\r\n    subsidy: '查看可申请补贴项目，跟踪申请进度',\r\n    elderly: '关爱家庭老人健康，实时监测与预警',\r\n    telemed: '在线预约远程问诊，查看病历与处方',\r\n    training: '报名参加农技培训课程，随时学习',\r\n    appointment: '在线预约政务服务，查询办理进度'\r\n  }\r\n  return map[curTab.value] || ''\r\n})\r\n\r\n// ===== QUICK ACTIONS ====="
);

// === STYLE CHANGES ===

// 10. Main content: remove max-width, adjust padding
c = c.replace(
  '/* Main content */\r\n.main-content {\r\n  flex: 1;\r\n  overflow-y: auto;\r\n  padding: 14px 16px 24px;\r\n}\r\n.content {\r\n  max-width: 1100px;\r\n  margin: 0 auto;\r\n}',
  '/* Main content */\r\n.main-content {\r\n  flex: 1;\r\n  overflow-y: auto;\r\n  padding: 24px 28px 32px;\r\n}\r\n.content {\r\n  width: 100%;\r\n}'
);

// 11. Breadcrumb → page title bar
c = c.replace(
  '/* Breadcrumb */\r\n.bc {\r\n  font-size: 10px;\r\n  color: #6F91A8;\r\n  margin-bottom: 12px;\r\n}\r\n.bc a { color: #6F91A8; text-decoration: none; }\r\n.bc a:hover { color: #39D98A; }',
  '/* Page Title */\r\n.page-title-bar {\r\n  margin-bottom: 18px;\r\n}\r\n.page-title {\r\n  font-size: 20px;\r\n  font-weight: 700;\r\n  color: #fff;\r\n  letter-spacing: 0.5px;\r\n}\r\n.page-subtitle {\r\n  font-size: 13px;\r\n  color: #6F91A8;\r\n  margin-top: 4px;\r\n}'
);

// 12. KPI cards: vertical layout, larger
c = c.replace(
  '/* KPI */\r\n.kpi-row {\r\n  display: grid;\r\n  grid-template-columns: repeat(4, 1fr);\r\n  gap: 12px;\r\n  margin-bottom: 14px;\r\n}\r\n.kpi-card {\r\n  background: rgba(10,36,68,0.55);\r\n  border: 1px solid rgba(255,255,255,0.04);\r\n  border-radius: 12px;\r\n  padding: 14px;\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 12px;\r\n}\r\n.kpi-icon { font-size: 24px; }\r\n.kpi-val { font-size: 18px; font-weight: 700; color: #fff; }\r\n.kpi-lbl { font-size: 10px; color: #6F91A8; margin-top: 2px; }\r\n.kpi-card.g .kpi-val { color: #28C76F; }\r\n.kpi-card.b .kpi-val { color: #28C7FA; }\r\n.kpi-card.y .kpi-val { color: #F5B83D; }\r\n.kpi-card.r .kpi-val { color: #E74C3C; }\r\n.kpi-card.p .kpi-val { color: #A78BFA; }',
  '/* KPI */\r\n.kpi-row {\r\n  display: grid;\r\n  grid-template-columns: repeat(4, 1fr);\r\n  gap: 14px;\r\n  margin-bottom: 20px;\r\n}\r\n.kpi-card {\r\n  background: rgba(10,36,68,0.55);\r\n  border: 1px solid rgba(255,255,255,0.04);\r\n  border-radius: 12px;\r\n  padding: 18px 20px;\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 8px;\r\n}\r\n.kpi-icon { font-size: 28px; line-height: 1; }\r\n.kpi-val { font-size: 26px; font-weight: 700; color: #fff; line-height: 1.1; }\r\n.kpi-lbl { font-size: 12px; color: #6F91A8; }\r\n.kpi-card.g .kpi-val { color: #28C76F; }\r\n.kpi-card.b .kpi-val { color: #28C7FA; }\r\n.kpi-card.y .kpi-val { color: #F5B83D; }\r\n.kpi-card.r .kpi-val { color: #E74C3C; }\r\n.kpi-card.p .kpi-val { color: #A78BFA; }'
);

// 13. Quick actions: larger buttons, rectangular
c = c.replace(
  '/* Quick Actions */\r\n.qa-row {\r\n  display: flex;\r\n  gap: 8px;\r\n  margin-bottom: 14px;\r\n  flex-wrap: wrap;\r\n}\r\n.qa-btn {\r\n  background: rgba(40,199,111,0.06);\r\n  border: 1px solid rgba(40,199,111,0.12);\r\n  color: #39D98A;\r\n  padding: 7px 14px;\r\n  border-radius: 20px;\r\n  font-size: 11px;\r\n  cursor: pointer;\r\n  white-space: nowrap;\r\n  transition: all 0.2s;\r\n  font-family: inherit;\r\n}\r\n.qa-btn:hover {\r\n  background: rgba(40,199,111,0.14);\r\n  border-color: rgba(40,199,111,0.25);\r\n}',
  '/* Quick Actions */\r\n.qa-label {\r\n  font-size: 13px;\r\n  font-weight: 600;\r\n  color: #6F91A8;\r\n  margin-bottom: 10px;\r\n}\r\n.qa-row {\r\n  display: flex;\r\n  gap: 10px;\r\n  margin-bottom: 20px;\r\n  flex-wrap: wrap;\r\n}\r\n.qa-btn {\r\n  background: rgba(40,199,111,0.08);\r\n  border: 1px solid rgba(40,199,111,0.14);\r\n  color: #39D98A;\r\n  padding: 10px 18px;\r\n  border-radius: 8px;\r\n  font-size: 13px;\r\n  cursor: pointer;\r\n  white-space: nowrap;\r\n  transition: all 0.2s;\r\n  font-family: inherit;\r\n}\r\n.qa-btn:hover {\r\n  background: rgba(40,199,111,0.16);\r\n  border-color: rgba(40,199,111,0.30);\r\n}'
);

// 14. Section card system
c = c.replace(
  '/* Section title */\r\n.section-title {\r\n  font-size: 12px;\r\n  font-weight: 700;\r\n  color: #B7D3E8;\r\n  margin-bottom: 8px;\r\n}\r\n\r\n/* Tab content */\r\n.tab-content { margin-bottom: 14px; }',
  '/* Section card */\r\n.section-card {\r\n  background: rgba(10,36,68,0.55);\r\n  border: 1px solid rgba(255,255,255,0.04);\r\n  border-radius: 12px;\r\n  padding: 18px 20px;\r\n  margin-bottom: 14px;\r\n}\r\n\r\n/* Section title */\r\n.section-title {\r\n  font-size: 14px;\r\n  font-weight: 700;\r\n  color: #B7D3E8;\r\n  margin-bottom: 12px;\r\n}\r\n\r\n/* Tab content */\r\n.tab-content { }'
);

// 15. Data table larger
c = c.replace(
  '/* Data table (read-only, for personal records) */\r\n.data-table {\r\n  width: 100%;\r\n  border-collapse: collapse;\r\n  font-size: 11px;\r\n}\r\n.data-table th {\r\n  background: rgba(10,36,68,0.55);\r\n  color: #6F91A8;\r\n  font-size: 10px;\r\n  font-weight: 600;\r\n  padding: 8px 10px;\r\n  text-align: left;\r\n  border-bottom: 2px solid rgba(57,217,138,0.08);\r\n}\r\n.data-table td {\r\n  padding: 8px 10px;\r\n  border-bottom: 1px solid rgba(14,165,233,0.06);\r\n  color: #B7D3E8;\r\n}\r\n.data-table tr:hover td { background: rgba(57,217,138,0.04); }',
  '/* Data table (read-only, for personal records) */\r\n.data-table {\r\n  width: 100%;\r\n  border-collapse: collapse;\r\n  font-size: 13px;\r\n}\r\n.data-table th {\r\n  background: rgba(10,36,68,0.40);\r\n  color: #6F91A8;\r\n  font-size: 11px;\r\n  font-weight: 600;\r\n  padding: 10px 12px;\r\n  text-align: left;\r\n  border-bottom: 2px solid rgba(57,217,138,0.08);\r\n}\r\n.data-table td {\r\n  padding: 10px 12px;\r\n  border-bottom: 1px solid rgba(14,165,233,0.06);\r\n  color: #B7D3E8;\r\n}\r\n.data-table tr:hover td { background: rgba(57,217,138,0.04); }'
);

// 16. Tab bar larger
c = c.replace(
  '.tab-btn {\r\n  background: none;\r\n  border: none;\r\n  border-bottom: 2px solid transparent;\r\n  color: #6F91A8;\r\n  font-size: 11px;\r\n  padding: 10px 14px;\r\n  cursor: pointer;\r\n  white-space: nowrap;\r\n  transition: all 0.2s;\r\n  font-family: inherit;\r\n}',
  '.tab-btn {\r\n  background: none;\r\n  border: none;\r\n  border-bottom: 2px solid transparent;\r\n  color: #6F91A8;\r\n  font-size: 13px;\r\n  padding: 12px 18px;\r\n  cursor: pointer;\r\n  white-space: nowrap;\r\n  transition: all 0.2s;\r\n  font-family: inherit;\r\n}'
);

// 17. Insurance cards larger
c = c.replace(
  '.ic-type { font-size: 14px; font-weight: 700; color: #fff; }\r\n.ic-status { font-size: 10px; margin-top: 4px; }\r\n.ic-status.g { color: #28C76F; }\r\n.ic-status.y { color: #F5B83D; }\r\n.ic-extra { font-size: 12px; color: #28C76F; font-weight: 600; }',
  '.ic-type { font-size: 15px; font-weight: 700; color: #fff; }\r\n.ic-status { font-size: 11px; margin-top: 4px; }\r\n.ic-status.g { color: #28C76F; }\r\n.ic-status.y { color: #F5B83D; }\r\n.ic-extra { font-size: 13px; color: #28C76F; font-weight: 600; }'
);

// 18. Subsidy cards larger
c = c.replace(
  '.sc-name { font-size: 12px; font-weight: 600; color: #fff; }\r\n.sc-desc { font-size: 10px; color: #6F91A8; margin-top: 2px; }\r\n.sc-amount { font-size: 13px; font-weight: 700; color: #28C76F; }',
  '.sc-name { font-size: 13px; font-weight: 600; color: #fff; }\r\n.sc-desc { font-size: 11px; color: #6F91A8; margin-top: 2px; }\r\n.sc-amount { font-size: 14px; font-weight: 700; color: #28C76F; }'
);

// 19. Elderly cards larger
c = c.replace(
  '.ec-name { font-size: 13px; font-weight: 600; color: #fff; }\r\n.ec-addr { font-size: 10px; color: #6F91A8; margin-top: 2px; }',
  '.ec-name { font-size: 14px; font-weight: 600; color: #fff; }\r\n.ec-addr { font-size: 11px; color: #6F91A8; margin-top: 2px; }'
);

// 20. Course cards larger
c = c.replace(
  '.cc-title { font-size: 12px; font-weight: 600; color: #fff; }\r\n.cc-body { flex: 1; }\r\n.cc-meta { font-size: 10px; color: #6F91A8; }',
  '.cc-title { font-size: 13px; font-weight: 600; color: #fff; }\r\n.cc-body { flex: 1; }\r\n.cc-meta { font-size: 11px; color: #6F91A8; }'
);

// 21. Chart block → align with section-card
c = c.replace(
  '/* Chart */\r\n.chart-block {\r\n  background: rgba(10,36,68,0.55);\r\n  border: 1px solid rgba(255,255,255,0.04);\r\n  border-radius: 12px;\r\n  padding: 14px 16px;\r\n  margin-bottom: 14px;\r\n}',
  '/* Chart */\r\n.chart-block {\r\n  background: rgba(10,36,68,0.55);\r\n  border: 1px solid rgba(255,255,255,0.04);\r\n  border-radius: 12px;\r\n  padding: 18px 20px;\r\n  margin-bottom: 14px;\r\n}'
);

// 22. Tags larger
c = c.replace(
  '.tag {\r\n  font-size: 9px;\r\n  padding: 2px 7px;\r\n  border-radius: 10px;\r\n  font-weight: 600;\r\n}',
  '.tag {\r\n  font-size: 11px;\r\n  padding: 2px 8px;\r\n  border-radius: 10px;\r\n  font-weight: 600;\r\n}'
);

// 23. Buttons larger
c = c.replace(
  '.btn {\r\n  border: none;\r\n  border-radius: 8px;\r\n  padding: 8px 16px;\r\n  font-size: 11px;\r\n  cursor: pointer;\r\n  font-family: inherit;\r\n  transition: all 0.2s;\r\n}',
  '.btn {\r\n  border: none;\r\n  border-radius: 8px;\r\n  padding: 8px 18px;\r\n  font-size: 12px;\r\n  cursor: pointer;\r\n  font-family: inherit;\r\n  transition: all 0.2s;\r\n}'
);

// 24. Elderly avatar & health values larger
c = c.replace(
  '.ec-avatar { font-size: 36px; }',
  '.ec-avatar { font-size: 40px; }'
);
c = c.replace(
  '.ech-val { font-size: 16px; font-weight: 700; }\r\n.ech-lbl { font-size: 9px; color: #6F91A8; }',
  '.ech-val { font-size: 18px; font-weight: 700; }\r\n.ech-lbl { font-size: 10px; color: #6F91A8; }'
);

// 25. Appointment items larger
c = c.replace(
  '.apt-item-meta { font-size: 10px; color: #6F91A8; margin-top: 4px; }',
  '.apt-item-meta { font-size: 11px; color: #6F91A8; margin-top: 4px; }'
);
c = c.replace(
  '.cal-day {\r\n  font-size: 11px;',
  '.cal-day {\r\n  font-size: 12px;'
);

// Write
fs.writeFileSync(fp, c, 'utf-8');
console.log('Layout/visual overhaul applied to ServicePage.vue');
console.log('Size:', c.length, 'chars');
