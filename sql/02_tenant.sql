-- =============================================
-- Sprint 1: 租户 + 角色 + 权限 种子数据
-- =============================================

-- 租户：中堰村
INSERT INTO tenant (id, name, code, status)
VALUES (1, '中堰村', 'ZYC001', 1)
ON CONFLICT (id) DO NOTHING;

-- 角色
INSERT INTO sys_role (id, tenant_id, name, code, description, status) VALUES
(1, 1, '超级管理员', 'super_admin', '平台超级管理员，拥有全部权限', 1),
(2, 1, '村管理员',   'village_admin', '村庄管理员', 1),
(3, 1, '网格员',     'grid_worker', '网格工作人员', 1)
ON CONFLICT (id) DO NOTHING;

-- 权限
INSERT INTO sys_permission (id, name, code, parent_id, type, path, icon, sort_order) VALUES
(1,  '驾驶舱',   'dashboard',    0, 'menu', '/dashboard', 'Monitor',     1),
(2,  'GIS地图',  'gis',          0, 'menu', '/gis',        'MapLocation', 2),
(3,  'IoT监控',  'iot',          0, 'menu', '/iot',        'Cpu',         3),
(4,  '产业管理', 'industry',     0, 'menu', '/industry',   'Office',      4),
(5,  '资产管理', 'asset',        0, 'menu', '/asset',      'Box',         5),
(6,  '乡村治理', 'governance',   0, 'menu', '/governance', 'Stamp',       6),
(7,  '系统管理', 'system',       0, 'menu', '/system',     'Setting',     9),
(8,  '用户管理', 'system:user',  7, 'menu', '/system/user','User',        1),
(9,  '角色管理', 'system:role',  7, 'menu', '/system/role','Avatar',      2)
ON CONFLICT (code) DO NOTHING;

-- 角色-权限关联（超级管理员拥有全部权限）
INSERT INTO sys_role_permission (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9)
ON CONFLICT (role_id, permission_id) DO NOTHING;

SELECT setval('tenant_id_seq', COALESCE((SELECT MAX(id) FROM tenant), 1));
SELECT setval('sys_role_id_seq', COALESCE((SELECT MAX(id) FROM sys_role), 1));
SELECT setval('sys_permission_id_seq', COALESCE((SELECT MAX(id) FROM sys_permission), 1));
