// Fix AI chat: send button reactive→ref, v-html for <br>, keyword matching with real actions
const fs = require('fs');
const fp = 'd:/数字乡村/数字乡村平台/village-os/frontend/src/views/dashboard/DashboardPage.vue';
let s = fs.readFileSync(fp, 'utf-8');
let ok = 0, total = 0;
function check(l, c) { total++; if (c) { ok++; console.log('OK:', l); } else { console.log('FAIL:', l); } }

// ===== 1. Fix reactive → ref for chatMessages (the `.value.push` bug) =====
const oldReactive = `// Update chatbot message for farmer context
const chatMessages = reactive([
  { role: 'ai', text: '👋 您好！我是中堰村AI助手，您可以问我：<br>• 我上报的事件处理进度如何？  • 村里最近有什么通知？<br>• 我的网格员是谁？  • 今年的惠农政策有哪些？' }
])`;

const newReactive = `// Update chatbot message for farmer context — MUST be ref() not reactive() for .value.push()
const chatIntroHtml = '<div style="font-size:13px;margin-bottom:10px"><span style="font-size:18px">👋</span> <b>您好！</b>我是中堰村AI助手，您可以问我：</div>' +
  '<div style="display:flex;flex-direction:column;gap:5px;font-size:11px;color:#B7D3E8;line-height:1.5">' +
  '<span style="display:flex;align-items:center;gap:6px"><span style="color:#39D98A">▸</span> 我上报的事件处理进度如何？</span>' +
  '<span style="display:flex;align-items:center;gap:6px"><span style="color:#39D98A">▸</span> 村里最近有什么通知？</span>' +
  '<span style="display:flex;align-items:center;gap:6px"><span style="color:#39D98A">▸</span> 我的网格员是谁？</span>' +
  '<span style="display:flex;align-items:center;gap:6px"><span style="color:#39D98A">▸</span> 今年的惠农政策有哪些？</span>' +
  '</div>'
const chatMessages = ref([
  { role: 'ai', text: chatIntroHtml }
])`;

if (s.includes(oldReactive)) {
  s = s.replace(oldReactive, newReactive);
  check('1-reactive-to-ref', true);
} else { check('1-reactive-to-ref', false); }

// ===== 2. Fix template: {{ m.text }} → v-html (was showing <br> as literal text) =====
const oldTemplate = `                  <div v-for="(m,i) in chatMessages" :key="i" :class="['chat-msg', m.role]">{{ m.text }}</div>`;
const newTemplate = `                  <div v-for="(m,i) in chatMessages" :key="i" :class="['chat-msg', m.role]"><span v-html="m.text"></span></div>`;
if (s.includes(oldTemplate)) {
  s = s.replace(oldTemplate, newTemplate);
  check('2-v-html-template', true);
} else { check('2-v-html-template', false); }

// ===== 3. Rewrite sendChat — keyword matching with real actions =====
const oldSendChat = `function sendChat() {
  const q = chatInput.value.trim()
  if (!q) return
  chatMessages.value.push({ role: 'user', text: q })
  chatInput.value = ''

  let reply = '收到您的问题，让我查询一下相关数据…<br><br>根据当前系统记录，相关信息如下：<br>• 您可以咨询村委会获取最新数据<br>• 或拨打便民服务热线：<b>12345</b><br>• 也可登录政务服务平台查询<br><br>请问还有其他需要帮您的吗？'
  if (q.includes('低保')) reply = '根据系统数据，中堰村目前共有 <b style="color:#f59e0b">24户 38人</b> 享受低保待遇。其中：<br>• 1组：8户 12人<br>• 2组：10户 16人<br>• 3组：6户 10人<br>最新审核日期：2026年6月。'
  else if (q.includes('补贴')) reply = '2026年度补贴发放情况：<br>• 耕地地力保护补贴：已发放 <b style="color:#39D98A">¥386,000</b><br>• 农机购置补贴：已发放 <b style="color:#39D98A">¥52,000</b><br>• 低保补助：已发放 <b style="color:#39D98A">¥124,000</b><br>• 养老金：已发放 <b style="color:#39D98A">¥268,000</b><br>发放进度：100%'
  else if (q.includes('会议纪要')) reply = '<b>中堰村2026年6月工作例会纪要</b><br>时间：6月15日 14:00<br>主持：邓超书记<br><br>一、上月工作总结<br>1. 小麦收割工作全面完成<br>2. 电商平台上线运行正常<br><br>二、本月工作安排<br>1. 蜂糖李夏季管护培训<br>2. 澳洲龙虾基地水质监测<br>3. 留守老人关爱走访'
  else if (q.includes('政策')) reply = '近期惠农政策速览：<br>• <b>2026年农机补贴</b>：补贴比例提高至35%<br>• <b>数字乡村试点</b>：省财政安排专项资金<br>• <b>农村电商扶持</b>：物流补贴+免费培训<br>• <b>耕地保护补贴</b>：每亩120元标准<br>详情咨询村委会或登录政务平台查询。'

  setTimeout(() => {
    chatMessages.value.push({ role: 'ai', text: reply })
    nextTick(() => { if (chatAreaRef.value) chatAreaRef.value.scrollTop = chatAreaRef.value.scrollHeight })
  }, 600 + Math.random() * 800)
}`;

const newSendChat = `function sendChat() {
  const q = chatInput.value.trim()
  if (!q) return
  chatMessages.value.push({ role: 'user', text: q })
  chatInput.value = ''

  // Keyword matching — prioritize actions over text replies
  const ql = q.toLowerCase()
  let reply = ''
  let actionDelay = 800

  if (ql.includes('上报') || ql.includes('事件') || ql.includes('进度') || ql.includes('处理')) {
    reply = '正在为您打开<b>我的上报</b>记录…<br><span style="font-size:10px;color:#6F91A8">共 ' + myEvents.length + ' 条上报记录，最近一条：' + (myEvents[0] ? myEvents[0].type + '（' + myEvents[0].status + '）' : '无') + '</span>'
    setTimeout(() => { closeModal(); showMyReports() }, actionDelay)
  }
  else if (ql.includes('通知') || ql.includes('公告') || ql.includes('村里最近')) {
    reply = '正在为您打开<b>村务公告</b>…<br><span style="font-size:10px;color:#6F91A8">共 ' + villageNotices.length + ' 条公告</span>'
    setTimeout(() => { closeModal(); showVillageNotices() }, actionDelay)
  }
  else if (ql.includes('网格') || ql.includes('网格员') || ql.includes('王大爷')) {
    reply = '正在为您打开<b>网格员信息</b>…<br><span style="font-size:10px;color:#6F91A8">第3网格 · 网格员：' + gridWorker.name + '</span>'
    setTimeout(() => { closeModal(); showGridWorkerInfo() }, actionDelay)
  }
  else if (ql.includes('政策') || ql.includes('惠农') || ql.includes('补贴')) {
    reply = '近期惠农政策速览：<br>• <b>2026年农机补贴</b>：补贴比例提高至35%<br>• <b>数字乡村试点</b>：省财政安排专项资金<br>• <b>农村电商扶持</b>：物流补贴+免费培训<br>• <b>耕地保护补贴</b>：每亩120元标准<br><br><span style="display:inline-block;padding:4px 12px;background:rgba(40,199,250,0.10);border:1px solid rgba(40,199,250,0.20);border-radius:4px;font-size:10px;color:#28C7FA;margin-top:4px">💡 如需申请补贴，可在<b>数字服务中心 → 补贴申请</b>办理</span>'
  }
  else if (ql.includes('低保')) {
    reply = '根据系统数据，中堰村目前共有 <b style="color:#f59e0b">24户 38人</b> 享受低保待遇。其中：<br>• 1组：8户 12人<br>• 2组：10户 16人<br>• 3组：6户 10人<br>最新审核日期：2026年6月。'
  }
  else if (ql.includes('会议') || ql.includes('纪要')) {
    reply = '<b>中堰村2026年6月工作例会纪要</b><br>时间：6月15日 14:00<br>主持：邓超书记<br><br>一、上月工作总结<br>1. 小麦收割工作全面完成<br>2. 电商平台上线运行正常<br><br>二、本月工作安排<br>1. 蜂糖李夏季管护培训<br>2. 澳洲龙虾基地水质监测<br>3. 留守老人关爱走访'
  }
  else {
    reply = '收到您的问题，我可以帮您查询以下内容：<br><br>' +
      '<span style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span style="color:#39D98A">▸</span> <b>我上报的事件</b> — 查看处理进度</span>' +
      '<span style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span style="color:#39D98A">▸</span> <b>村务公告</b> — 获取最新通知</span>' +
      '<span style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span style="color:#39D98A">▸</span> <b>网格员</b> — 联系服务人员</span>' +
      '<span style="display:flex;align-items:center;gap:6px"><span style="color:#39D98A">▸</span> <b>惠农政策</b> — 了解补贴信息</span>' +
      '<br><span style="font-size:10px;color:#6F91A8">请输入以上关键词，我会为您快速查询</span>'
  }

  setTimeout(() => {
    chatMessages.value.push({ role: 'ai', text: reply })
    nextTick(() => { if (chatAreaRef.value) chatAreaRef.value.scrollTop = chatAreaRef.value.scrollHeight })
  }, 400 + Math.random() * 500)
}`;

if (s.includes(oldSendChat)) {
  s = s.replace(oldSendChat, newSendChat);
  check('3-sendChat-rewrite', true);
} else { check('3-sendChat-rewrite', false); }

fs.writeFileSync(fp, s, 'utf-8');
console.log('\n=== AI CHAT FIX FINAL ===');
console.log('Passed:', ok, '/', total);
console.log('Length:', s.length);
