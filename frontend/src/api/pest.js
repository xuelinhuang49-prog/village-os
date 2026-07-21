/**
 * 病虫害智能预警模块 API
 * 数据库表: village_industry / disease_library / ai_diagnosis_record / risk_event / environment_warning / ai_disease_match
 */

// ===== 村产业库 =====
export const villageIndustries = [
  { id:1, villageId:'zhongyan', industryName:'蜂糖李', industryType:'植物', description:'中堰村核心产业', keyRisks:['褐腐病','蚜虫','细菌性穿孔病'] },
  { id:2, villageId:'zhongyan', industryName:'苹果', industryType:'植物', description:'苹果园区A/B区', keyRisks:['炭疽病','黑星病','蚜虫'] },
  { id:3, villageId:'zhongyan', industryName:'葡萄', industryType:'植物', description:'阳光玫瑰品种', keyRisks:['霜霉病','白粉病'] },
  { id:4, villageId:'zhongyan', industryName:'澳洲淡水龙虾', industryType:'水产', description:'智能水产养殖', keyRisks:['缺氧症','白斑病'] },
  { id:5, villageId:'zhongyan', industryName:'生猪', industryType:'动物', description:'养猪场A区', keyRisks:['呼吸道综合征','蓝耳病','猪瘟'] },
  { id:6, villageId:'zhongyan', industryName:'蛋鸡', industryType:'动物', description:'养鸡场1号', keyRisks:['禽流感','球虫病','新城疫'] }
]

// ===== 病害知识库 =====
export const diseaseLibrary = [
  // 植物病害
  { id:1, name:'稻瘟病', category:'植物病害', targetType:'水稻', symptoms:['叶片出现褐色斑点','叶尖枯黄','穗颈变黑'], cause:['高湿环境','氮肥过量','品种感病'], prevention:['选用抗病品种','合理施肥'], treatment:[{type:'药剂',content:'三环唑75%WP'},{type:'药剂',content:'稻瘟灵25%EC'},{type:'管理',content:'降低田间湿度'}], medicine:'三环唑/稻瘟灵', level:'高风险', source:'公共库', villageId:null },
  { id:2, name:'纹枯病', category:'植物病害', targetType:'水稻', symptoms:['叶鞘出现水渍状斑','叶片枯黄'], cause:['高温高湿','密植通风差'], prevention:['合理密植'], treatment:[{type:'药剂',content:'井冈霉素'},{type:'管理',content:'控制水肥'}], medicine:'井冈霉素', level:'中风险', source:'公共库', villageId:null },
  { id:3, name:'炭疽病', category:'植物病害', targetType:'苹果', symptoms:['果实出现褐色凹陷斑','叶片枯焦'], cause:['高温多雨','伤口感染'], prevention:['套袋保护','清除病源'], treatment:[{type:'药剂',content:'代森锰锌'},{type:'管理',content:'清除病果病叶'}], medicine:'代森锰锌', level:'高风险', source:'公共库', villageId:null },
  { id:4, name:'黑星病', category:'植物病害', targetType:'苹果', symptoms:['叶片出现黑色霉斑','果实畸形'], cause:['春季多雨','越冬菌源'], prevention:['清除落叶','萌芽前药剂'], treatment:[{type:'药剂',content:'氟硅唑'},{type:'管理',content:'清除落叶'}], medicine:'氟硅唑', level:'中风险', source:'公共库', villageId:null },
  { id:5, name:'霜霉病', category:'植物病害', targetType:'葡萄', symptoms:['叶片背面白色霉层','叶片枯黄脱落'], cause:['高湿低温','通风不良'], prevention:['合理修剪','排水沟'], treatment:[{type:'药剂',content:'霜脲氰·锰锌'},{type:'管理',content:'加强通风'}], medicine:'霜脲氰·锰锌', level:'中风险', source:'公共库', villageId:null },
  { id:6, name:'蚜虫', category:'植物虫害', targetType:'苹果', symptoms:['嫩叶卷曲','叶片发黄','可见蚜虫聚集'], cause:['干旱少雨','天敌减少'], prevention:['保护天敌'], treatment:[{type:'药剂',content:'吡虫啉'},{type:'生物',content:'释放瓢虫'}], medicine:'吡虫啉', level:'低风险', source:'公共库', villageId:null },
  // 动物疾病
  { id:7, name:'猪呼吸道综合征', category:'动物疾病', targetType:'猪', symptoms:['猪只咳嗽','采食量下降','呼吸困难'], cause:['通风不良','温差过大','密度过高'], prevention:['合理密度','定期消毒'], treatment:[{type:'药剂',content:'替米考星'},{type:'管理',content:'加强通风'}], medicine:'替米考星', level:'高风险', source:'公共库', villageId:null },
  { id:8, name:'蓝耳病', category:'动物疾病', targetType:'猪', symptoms:['母猪流产','仔猪呼吸困难','耳尖发绀'], cause:['病毒感染','免疫抑制'], prevention:['疫苗接种'], treatment:[{type:'疫苗',content:'PRRS弱毒苗'},{type:'管理',content:'全进全出'}], medicine:'PRRS弱毒苗', level:'高风险', source:'公共库', villageId:null },
  { id:9, name:'禽流感', category:'动物疾病', targetType:'鸡', symptoms:['鸡只突然死亡','头部肿胀','产蛋下降'], cause:['病毒感染','候鸟传播'], prevention:['疫苗接种','隔离'], treatment:[{type:'疫苗',content:'禽流感灭活苗'},{type:'管理',content:'严格消毒'}], medicine:'禽流感灭活苗', level:'高风险', source:'公共库', villageId:null },
  { id:10, name:'球虫病', category:'动物疾病', targetType:'鸡', symptoms:['粪便异常','精神不振','生长缓慢'], cause:['潮湿环境','卫生条件差'], prevention:['保持干燥'], treatment:[{type:'药剂',content:'地克珠利'},{type:'管理',content:'保持鸡舍干燥'}], medicine:'地克珠利', level:'中风险', source:'公共库', villageId:null },
  // 村库
  { id:11, name:'蜂糖李褐腐病', category:'植物病害', targetType:'蜂糖李', symptoms:['果实变褐腐烂','表面有灰色霉层'], cause:['花期多雨','伤口感染'], prevention:['套袋保护'], treatment:[{type:'药剂',content:'腐霉利'},{type:'管理',content:'套袋保护'}], medicine:'腐霉利', level:'中风险', source:'村库', villageId:'zhongyan' },
  { id:12, name:'龙虾缺氧症', category:'水产疾病', targetType:'龙虾', symptoms:['龙虾浮头','活力下降','大面积死亡'], cause:['水体缺氧','水质恶化'], prevention:['定期换水'], treatment:[{type:'管理',content:'增氧曝气'},{type:'管理',content:'换水稀释'}], medicine:'', level:'中风险', source:'村库', villageId:'zhongyan' }
]

// ===== 风险事件档案 =====
export const riskEvents = [
  { id:1, time:'2026-07-21 09:30', village:'中堰村', villageId:'zhongyan', area:'苹果园区A区', eventType:'病虫害', diseaseId:3, disease:'炭疽病', source:'AI识别', level:'高风险', status:'处理中', handler:'张三' },
  { id:2, time:'2026-07-20 14:15', village:'中堰村', villageId:'zhongyan', area:'养猪场A区', eventType:'动物疾病', diseaseId:7, disease:'猪呼吸道综合征', source:'人工上报', level:'高风险', status:'处理中', handler:'李四' },
  { id:3, time:'2026-07-19 08:00', village:'中堰村', villageId:'zhongyan', area:'葡萄园B区', eventType:'病虫害', diseaseId:5, disease:'霜霉病', source:'环境模型', level:'中风险', status:'已解决', handler:'王五' },
  { id:4, time:'2026-07-18 16:30', village:'中堰村', villageId:'zhongyan', area:'蔬菜大棚区', eventType:'病虫害', diseaseId:10, disease:'球虫病', source:'AI识别', level:'中风险', status:'已解决', handler:'赵六' }
]

// ===== AI诊断模拟 =====
export function simulateAiRecognize(imageFile, villageId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const matches = diseaseLibrary
      const result = matches[Math.floor(Math.random() * matches.length)]
      resolve({
        diseaseId: result.id,
        diseaseName: result.name,
        confidence: 78 + Math.floor(Math.random() * 20),
        level: result.level,
        symptoms: result.symptoms,
        cause: result.cause,
        treatment: result.treatment,
        recommendation: result.treatment.map(s => s.content).join('；'),
        crop: result.targetType
      })
    }, 1500)
  })
}

// ===== API 接口预留 =====
/**
 * POST /api/ai/diagnosis
 * 参数: { image, villageId }
 * 返回: { disease, confidence, suggestion, matchedDiseaseId }
 */
export async function aiDiagnosis(formData) {
  // TODO: 接入真实AI接口
  return simulateAiRecognize(formData.image, formData.villageId)
}

/**
 * GET /api/disease/list?industry=苹果&villageId=zhongyan
 * 返回: 病害列表
 */
export function getDiseaseList(industry, villageId) {
  let list = diseaseLibrary
  if (industry) list = list.filter(d => d.targetType === industry)
  if (villageId) list = list.filter(d => !d.villageId || d.villageId === villageId)
  return list
}

/**
 * GET /api/risk/events?villageId=zhongyan
 * 返回: 风险事件列表
 */
export function getRiskEvents(villageId) {
  return villageId ? riskEvents.filter(r => r.villageId === villageId) : riskEvents
}

/**
 * GET /api/village/industry?villageId=zhongyan
 * 返回: 村产业列表
 */
export function getVillageIndustries(villageId) {
  return villageId ? villageIndustries.filter(i => i.villageId === villageId) : villageIndustries
}

/**
 * GET /api/ai/diagnosis/history?villageId=zhongyan
 * 返回: AI诊断记录列表
 */
export { riskEvents as warningRecords, villageIndustries as villageRiskData }
export const aiHistoryData = []
