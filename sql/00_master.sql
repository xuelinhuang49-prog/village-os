-- =============================================
-- 数字乡村平台 - 数据库初始化主脚本
-- =============================================
-- 使用方法:
--   psql -U postgres -d village_os -f 00_master.sql
--
-- 按 Sprint 增量执行:
--   psql -U postgres -d village_os -f 01_init.sql
--   psql -U postgres -d village_os -f 02_tenant.sql
--   psql -U postgres -d village_os -f 03_village.sql
--   psql -U postgres -d village_os -f 04_gis.sql
--   psql -U postgres -d village_os -f 05_iot.sql
--   psql -U postgres -d village_os -f 06_event.sql
-- =============================================

\echo '============================================'
\echo '  数字乡村平台 - 数据库初始化'
\echo '  Sprint 1: 基础数据'
\echo '============================================'

\echo ''
\echo '[1/6] 创建表结构...'
\i 01_init.sql

\echo ''
\echo '[2/6] 租户数据...'
\i 02_tenant.sql

\echo ''
\echo '[3/6] 村庄数据 (中堰村)...'
\i 03_village.sql

\echo ''
\echo '[4/6] GIS 点位数据...'
\i 04_gis.sql

\echo ''
\echo '[5/6] IoT 设备数据...'
\i 05_iot.sql

\echo ''
\echo '[6/6] 事件数据...'
\i 06_event.sql

\echo ''
\echo '============================================'
\echo '  数据库 V1.0 初始化完成！'
\echo '============================================'
\echo ''
\echo '  默认登录: admin / admin123'
\echo '  村庄: 中堰村 (武汉市江夏区)'
\echo '  GIS点位: 10个'
\echo '  IoT设备: 4台'
\echo '  事件: 6条'
\echo ''
\echo '  下一步: 运行 11_seed_all.sql 加载全部种子数据'
\echo '============================================'
