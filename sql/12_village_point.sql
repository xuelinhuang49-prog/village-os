-- =============================================
-- Sprint 2+: village_point 村级资产点位表
-- 数据驱动的GIS资产系统
-- =============================================

CREATE TABLE IF NOT EXISTS village_point (
    id          BIGSERIAL           PRIMARY KEY,
    tenant_id   BIGINT              DEFAULT 1,
    village_id  BIGINT              NOT NULL,
    name        VARCHAR(100)        NOT NULL,
    type        VARCHAR(30)         NOT NULL,
    longitude   DOUBLE PRECISION,
    latitude    DOUBLE PRECISION,
    address     VARCHAR(255),
    status      VARCHAR(20)         DEFAULT 'normal',
    income      DECIMAL(12,2)       DEFAULT 0,
    output      DECIMAL(12,2)       DEFAULT 0,
    manager     VARCHAR(100),
    extra_json  JSONB,
    created_at  TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- 中堰村 10 个资产点位
INSERT INTO village_point (id, tenant_id, village_id, name, type, longitude, latitude, address, status, income, output, manager, extra_json) VALUES
(1,  1, 1, '党群服务中心',       'gov',         114.3055, 30.3852, '中堰村中心',    'normal', 0,      0,   '张书记', '{"icon":"gov","description":"村两委办公所在地"}'),
(2,  1, 1, '笃敬现代农业产业园', 'agriculture', 114.3082, 30.3881, '中堰村东侧',    'normal', 350000, 180, '李主任', '{"icon":"industry","description":"智慧农业展示+技术培训+农产品加工"}'),
(3,  1, 1, '智慧大棚',           'agriculture', 114.3105, 30.3868, '产业园A区',    'normal', 120000, 45,  '王技术员','{"icon":"greenhouse","sensors":["temperature","humidity","soil_moisture"]}'),
(4,  1, 1, '荷虾混养区',         'aquaculture', 114.3028, 30.3895, '中堰村西侧水域','normal', 200000, 12,  '赵养殖', '{"icon":"farm","area_mu":200,"species":"小龙虾,莲藕"}'),
(5,  1, 1, '智慧市集',           'residence',   114.3045, 30.3835, '中堰村南入口',  'normal', 80000,  0,   '钱运营', '{"icon":"market","stalls":25,"daily_visitors":287}'),
(6,  1, 1, '人才公寓',           'residence',   114.3068, 30.3842, '产业园旁',      'normal', 50000,  0,   '孙管理', '{"icon":"apartment","rooms":48,"occupied":32}'),
(7,  1, 1, '半日闲舍',           'tourism',     114.3012, 30.3865, '中堰村西',      'normal', 90000,  0,   '周经理', '{"icon":"hotel","rooms":12,"rating":4.8}'),
(8,  1, 1, '凤鸣锦舍',           'tourism',     114.3005, 30.3838, '中堰村西南',    'normal', 150000, 0,   '吴经理', '{"icon":"hotel","rooms":8,"rating":4.9}'),
(9,  1, 1, '卫生室',             'gov',         114.3058, 30.3845, '中堰村中心',    'normal', 0,      0,   '郑医生', '{"icon":"clinic","description":"基础医疗服务"}'),
(10, 1, 1, '文化广场',           'residence',   114.3062, 30.3858, '中堰村中心',    'normal', 0,      0,   '冯主任', '{"icon":"square","description":"文化活动和集会中心"}')
ON CONFLICT (id) DO NOTHING;

SELECT setval('village_point_id_seq', COALESCE((SELECT MAX(id) FROM village_point), 1));
