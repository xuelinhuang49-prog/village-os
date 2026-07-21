-- =============================================
-- IoT 设备种子数据
-- 4 台模拟设备，覆盖智慧大棚、气象、水质、市集
-- =============================================

INSERT INTO iot_device (id, tenant_id, village_id, name, device_type, device_code, device_status, longitude, latitude, location, extra_json) VALUES
(1001, 1, 1, '智慧大棚传感器-A1', 'greenhouse',     'GH-SENSOR-001',  'normal', 114.3105, 30.3868, '智慧大棚A区',   '{"sensors":["temperature","humidity","soil_moisture","co2","light"]}'),
(1002, 1, 1, '气象监测站-W1',     'weather_station', 'WS-MONITOR-001', 'normal', 114.3070, 30.3875, '产业园中心',     '{"sensors":["temperature","humidity","wind_speed","rainfall","air_pressure"]}'),
(1003, 1, 1, '水质监测器-Q1',     'water_quality',   'WQ-SENSOR-001',  'normal', 114.3028, 30.3895, '荷虾混养区',     '{"sensors":["ph","dissolved_oxygen","turbidity","ammonia_nitrogen","water_temperature"]}'),
(1004, 1, 1, '智慧市集终端-M1',   'smart_market',    'SM-TERMINAL-001','normal', 114.3045, 30.3835, '智慧市集入口',   '{"sensors":["visitor_count","transaction_count","total_amount","stall_active"]}')
ON CONFLICT (id) DO NOTHING;

SELECT setval('iot_device_id_seq', COALESCE((SELECT MAX(id) FROM iot_device), 1004));
