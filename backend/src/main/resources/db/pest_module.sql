-- ============================================================
-- 病虫害智能预警模块 · 数据库设计
-- 面向多村复制 / AI接入 / 管理员扩展
-- 引擎: MySQL 5.7+ / H2 (MySQL兼容模式)
-- ============================================================

-- 1. 村产业库（多村复制的基础）
CREATE TABLE IF NOT EXISTS village_industry (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  village_id      VARCHAR(64)   NOT NULL COMMENT '村ID',
  industry_name   VARCHAR(128)  NOT NULL COMMENT '产业名称',
  industry_type   VARCHAR(32)   NOT NULL COMMENT '类型: 植物/动物/水产',
  description     TEXT          COMMENT '描述',
  cover_image     VARCHAR(512)  COMMENT '图片URL',
  status          VARCHAR(16)   DEFAULT 'active' COMMENT '状态: active/inactive',
  create_time     DATETIME      DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_village (village_id)
) COMMENT '村产业库';

-- 2. 病害知识库（公共+村级）
CREATE TABLE IF NOT EXISTS disease_library (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(128)  NOT NULL COMMENT '病害名称',
  category        VARCHAR(32)   NOT NULL COMMENT '一级分类: 植物病害/植物虫害/动物疾病/水产疾病',
  target_type     VARCHAR(32)   COMMENT '对象类型: 苹果/水稻/生猪/鸡',
  industry_id     BIGINT        COMMENT '所属产业ID, FK village_industry.id',
  symptoms        TEXT          COMMENT '症状描述(JSON数组)',
  cause           TEXT          COMMENT '发生原因(JSON数组)',
  prevention      TEXT          COMMENT '预防方案(JSON数组)',
  treatment       TEXT          COMMENT '治疗方案(JSON数组 [{type,content}])',
  medicine        VARCHAR(256)  COMMENT '推荐药剂',
  images          TEXT          COMMENT '图片URL(JSON数组)',
  level           VARCHAR(16)   DEFAULT '中风险' COMMENT '风险等级: 高风险/中风险/低风险',
  source          VARCHAR(16)   DEFAULT '公共库' COMMENT '来源: 公共库/村库',
  village_id      VARCHAR(64)   COMMENT '村ID（村库特有）',
  create_by       VARCHAR(64)   COMMENT '创建人',
  create_time     DATETIME      DEFAULT CURRENT_TIMESTAMP,
  update_time     DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status          VARCHAR(16)   DEFAULT 'active' COMMENT 'active/inactive',
  INDEX idx_industry (industry_id),
  INDEX idx_category (category),
  INDEX idx_village (village_id)
) COMMENT '病害知识库';

-- 3. AI诊断记录
CREATE TABLE IF NOT EXISTS ai_diagnosis_record (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  village_id      VARCHAR(64)   NOT NULL COMMENT '村ID',
  user_id         VARCHAR(64)   COMMENT '用户ID',
  image_url       VARCHAR(512)  COMMENT '上传图片URL',
  ai_result       VARCHAR(256)  COMMENT 'AI识别结果-病害名称',
  confidence      DECIMAL(5,2)  COMMENT '置信度 0-100',
  matched_disease_id BIGINT     COMMENT '匹配病害库ID, FK disease_library.id',
  suggestion      TEXT          COMMENT '处理建议',
  human_confirm   TINYINT       DEFAULT 0 COMMENT '人工确认: 0未确认/1正确/2错误',
  human_result    VARCHAR(256)  COMMENT '人工修正结果',
  create_time     DATETIME      DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_village (village_id),
  INDEX idx_user (user_id),
  INDEX idx_disease (matched_disease_id),
  INDEX idx_time (create_time)
) COMMENT 'AI诊断记录';

-- 4. 风险事件档案
CREATE TABLE IF NOT EXISTS risk_event (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  village_id      VARCHAR(64)   NOT NULL COMMENT '村ID',
  area            VARCHAR(128)  COMMENT '区域/地块',
  event_type      VARCHAR(32)   DEFAULT '病虫害' COMMENT '事件类型: 病虫害/气象/动物疫情',
  disease_id      BIGINT        COMMENT '关联病害ID, FK disease_library.id',
  source          VARCHAR(32)   NOT NULL COMMENT '来源: AI识别/人工上报/环境模型/传感器',
  level           VARCHAR(16)   DEFAULT '中风险' COMMENT '等级: 高风险/中风险/低风险',
  description     TEXT          COMMENT '描述',
  status          VARCHAR(16)   DEFAULT '处理中' COMMENT '状态: 待处理/处理中/已解决',
  handler         VARCHAR(64)   COMMENT '处理人',
  create_time     DATETIME      DEFAULT CURRENT_TIMESTAMP,
  finish_time     DATETIME      COMMENT '处理完成时间',
  INDEX idx_village (village_id),
  INDEX idx_status (status),
  INDEX idx_source (source)
) COMMENT '风险事件档案';

-- 5. 环境风险预测
CREATE TABLE IF NOT EXISTS environment_warning (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  village_id      VARCHAR(64)   NOT NULL COMMENT '村ID',
  area            VARCHAR(128)  COMMENT '区域',
  temperature     DECIMAL(5,1)  COMMENT '温度°C',
  humidity        DECIMAL(5,1)  COMMENT '湿度%',
  weather         VARCHAR(64)   COMMENT '天气状况',
  rainfall        DECIMAL(5,1)  COMMENT '降雨量mm',
  soil_moisture   DECIMAL(5,1)  COMMENT '土壤湿度%',
  risk_type       VARCHAR(128)  COMMENT '风险类型',
  risk_level      VARCHAR(16)   COMMENT '风险等级',
  disease_id      BIGINT        COMMENT '预测病害ID',
  suggestion      TEXT          COMMENT '防控建议',
  create_time     DATETIME      DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_village (village_id)
) COMMENT '环境风险预测';

-- 6. AI知识匹配表
CREATE TABLE IF NOT EXISTS ai_disease_match (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  diagnosis_id    BIGINT        NOT NULL COMMENT '关联诊断ID, FK ai_diagnosis_record.id',
  disease_id      BIGINT        NOT NULL COMMENT '匹配病害ID, FK disease_library.id',
  similarity      DECIMAL(5,2)  COMMENT '相似度 0-100',
  create_time     DATETIME      DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_diagnosis (diagnosis_id)
) COMMENT 'AI知识匹配表';

-- ===== 种子数据 =====
-- 中堰村产业
INSERT INTO village_industry (village_id, industry_name, industry_type, description) VALUES
('zhongyan', '蜂糖李', '植物', '中堰村核心产业，产业园东区'),
('zhongyan', '苹果', '植物', '苹果园区A/B区，红富士为主'),
('zhongyan', '葡萄', '植物', '阳光玫瑰品种，产业园西区'),
('zhongyan', '澳洲淡水龙虾', '水产', '智能水产养殖基地'),
('zhongyan', '生猪', '动物', '养猪场A区，杜长大三元'),
('zhongyan', '蛋鸡', '动物', '养鸡场1号，海兰褐');

-- 病害知识库（公共库）
INSERT INTO disease_library (name, category, target_type, symptoms, cause, treatment, medicine, level, source) VALUES
('稻瘟病', '植物病害', '水稻', '["叶片出现褐色斑点","叶尖枯黄","穗颈变黑"]', '["高湿环境","氮肥过量","品种感病"]', '[{"type":"药剂","content":"三环唑75%WP"},{"type":"药剂","content":"稻瘟灵25%EC"},{"type":"管理","content":"降低田间湿度"}]', '三环唑/稻瘟灵', '高风险', '公共库'),
('炭疽病', '植物病害', '苹果', '["果实出现褐色凹陷斑","叶片枯焦"]', '["高温多雨","伤口感染"]', '[{"type":"药剂","content":"代森锰锌"},{"type":"管理","content":"清除病果病叶"}]', '代森锰锌', '高风险', '公共库'),
('霜霉病', '植物病害', '葡萄', '["叶片背面白色霉层","叶片枯黄脱落"]', '["高湿低温","通风不良"]', '[{"type":"药剂","content":"霜脲氰·锰锌"},{"type":"管理","content":"加强通风"}]', '霜脲氰·锰锌', '中风险', '公共库'),
('猪呼吸道综合征', '动物疾病', '猪', '["猪只咳嗽","采食量下降","呼吸困难"]', '["通风不良","温差过大","密度过高"]', '[{"type":"药剂","content":"替米考星"},{"type":"管理","content":"加强通风"}]', '替米考星', '高风险', '公共库'),
('蜂糖李褐腐病', '植物病害', '蜂糖李', '["果实变褐腐烂","表面有灰色霉层"]', '["花期多雨","伤口感染"]', '[{"type":"药剂","content":"腐霉利"},{"type":"管理","content":"套袋保护"}]', '腐霉利', '中风险', '村库'),
('禽流感', '动物疾病', '鸡', '["鸡只突然死亡","头部肿胀","产蛋下降"]', '["病毒感染","候鸟传播"]', '[{"type":"疫苗","content":"禽流感灭活苗"},{"type":"管理","content":"严格消毒"}]', '禽流感灭活苗', '高风险', '公共库'),
('龙虾缺氧症', '水产疾病', '龙虾', '["龙虾浮头","活力下降","大面积死亡"]', '["水体缺氧","水质恶化"]', '[{"type":"管理","content":"增氧曝气"},{"type":"管理","content":"换水稀释"}]', '', '中风险', '村库');
