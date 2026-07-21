-- =============================================
-- GIS 地理对象种子数据
-- 中堰村 11 个地标点位
-- geometry 使用 WKT 格式，开启 PostGIS 后自动转换
-- =============================================

INSERT INTO geo_object (id, tenant_id, village_id, name, type, longitude, latitude, geometry, status, extra_json) VALUES
(1,  1, 1, '党群服务中心',        'gov_center',    114.3055, 30.3852, 'POINT(114.3055 30.3852)', 1, '{"icon":"gov","description":"中堰村党群服务中心，村两委办公所在地"}'),
(2,  1, 1, '笃敬现代农业产业园',  'industry_park', 114.3082, 30.3881, 'POINT(114.3082 30.3881)', 1, '{"icon":"industry","description":"集智慧农业展示、技术培训、农产品加工于一体的现代农业产业园区"}'),
(3,  1, 1, '智慧大棚',            'greenhouse',    114.3105, 30.3868, 'POINT(114.3105 30.3868)', 1, '{"icon":"greenhouse","description":"配备IoT传感器的智慧农业大棚，实时监测温湿度、土壤墒情等"}'),
(4,  1, 1, '荷虾混养区',          'farmland',      114.3028, 30.3895, 'POINT(114.3028 30.3895)', 1, '{"icon":"farm","description":"荷花与小龙虾生态混养示范区，面积约200亩"}'),
(5,  1, 1, '智慧市集',            'market',        114.3045, 30.3835, 'POINT(114.3045 30.3835)', 1, '{"icon":"market","description":"线上线下融合的农产品交易市集"}'),
(6,  1, 1, '人才公寓',            'apartment',     114.3068, 30.3842, 'POINT(114.3068 30.3842)', 1, '{"icon":"apartment","description":"为乡村振兴人才提供的配套住宿公寓"}'),
(7,  1, 1, '半日闲舍',            'hotel',         114.3012, 30.3865, 'POINT(114.3012 30.3865)', 1, '{"icon":"hotel","description":"乡村民宿，提供休闲度假体验"}'),
(8,  1, 1, '凤鸣锦舍',            'hotel',         114.3005, 30.3838, 'POINT(114.3005 30.3838)', 1, '{"icon":"hotel","description":"高端乡村精品民宿"}'),
(9,  1, 1, '卫生室',              'clinic',        114.3058, 30.3845, 'POINT(114.3058 30.3845)', 1, '{"icon":"clinic","description":"中堰村卫生室，提供基础医疗服务"}'),
(10, 1, 1, '文化广场',            'square',        114.3062, 30.3858, 'POINT(114.3062 30.3858)', 1, '{"icon":"square","description":"村民文化活动和集会的中心广场"}')
ON CONFLICT (id) DO NOTHING;

SELECT setval('geo_object_id_seq', COALESCE((SELECT MAX(id) FROM geo_object), 1));
