-- =============================================
-- 事件种子数据
-- 模拟村庄治理事件
-- =============================================

INSERT INTO event (id, tenant_id, village_id, title, event_type, level, event_status, description, location, longitude, latitude, reporter_id, extra_json) VALUES
(1, 1, 1, '智慧大棚温湿度异常告警',    'agriculture', 'urgent',   'completed', '智慧大棚A区温度超过35°C阈值，自动开启通风系统，已恢复正常',        '智慧大棚A区',   114.3105, 30.3868, 1, '{"alert_type":"temperature_high","threshold":35,"actual":37.2}'),
(2, 1, 1, '荷虾混养区水质监测报告',    'agriculture', 'normal',   'completed', '荷虾混养区pH值检测正常，溶解氧含量充足，水质良好',                  '荷虾混养区',    114.3028, 30.3895, 1, '{"ph":7.8,"dissolved_oxygen":6.5,"turbidity":3.2}'),
(3, 1, 1, '文化广场道路积水问题',      'environment', 'normal',   'processing','文化广场西侧排水沟堵塞，下雨后积水严重，需要疏通',                    '文化广场',      114.3062, 30.3858, 1, '{}'),
(4, 1, 1, '智慧市集客流量过大预警',    'safety',      'urgent',   'completed', '智慧市集当日客流量超过500人，启动分流措施',                          '智慧市集',      114.3045, 30.3835, 1, '{"visitor_count":523,"threshold":500}'),
(5, 1, 1, '村民投诉垃圾清运不及时',    'complaint',   'normal',   'pending',   '三组村民反映垃圾桶已满三天未清运，影响环境卫生',                      '中堰村三组',    114.3035, 30.3840, 1, '{}'),
(6, 1, 1, '笃敬产业园设备维护计划',    'other',       'normal',   'pending',   '笃敬现代农业产业园计划每月15日进行设备例行维护检查',                  '笃敬产业园',    114.3082, 30.3881, 1, '{"maintenance_date":"2026-07-15"}')
ON CONFLICT (id) DO NOTHING;

SELECT setval('event_id_seq', COALESCE((SELECT MAX(id) FROM event), 1));
