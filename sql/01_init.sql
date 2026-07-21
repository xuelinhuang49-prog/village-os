-- =============================================
-- 数字乡村平台 - Sprint 1 建表脚本
-- 数据库: village_os | PostgreSQL 15+
-- =============================================

DO $$ BEGIN
    CREATE EXTENSION IF NOT EXISTS postgis;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'PostGIS 不可用，使用文本格式存储地理信息';
END $$;

-- =============================================
-- 1. 租户表 (一个租户 = 一个村庄客户)
-- =============================================
CREATE TABLE IF NOT EXISTS tenant (
    id              BIGSERIAL       PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    code            VARCHAR(50)     NOT NULL UNIQUE,
    status          INT             DEFAULT 1,
    create_time     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    update_time     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 2. 村庄表
-- =============================================
CREATE TABLE IF NOT EXISTS village (
    id              BIGSERIAL       PRIMARY KEY,
    tenant_id       BIGINT          NOT NULL,
    name            VARCHAR(100)    NOT NULL,
    province        VARCHAR(50),
    city            VARCHAR(50),
    county          VARCHAR(50),
    address         VARCHAR(200),
    longitude       DOUBLE PRECISION,
    latitude        DOUBLE PRECISION,
    area            DOUBLE PRECISION,
    population      INT,
    households      INT,
    industry_type   VARCHAR(200),
    description     TEXT,
    contact_person  VARCHAR(50),
    contact_phone   VARCHAR(20),
    status          INT             DEFAULT 1,
    create_time     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    update_time     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    deleted         INT             DEFAULT 0
);

-- =============================================
-- 3. 系统角色表
-- =============================================
CREATE TABLE IF NOT EXISTS sys_role (
    id          BIGSERIAL       PRIMARY KEY,
    tenant_id   BIGINT,
    name        VARCHAR(50)     NOT NULL,
    code        VARCHAR(50)     NOT NULL,
    description VARCHAR(200),
    status      INT             DEFAULT 1,
    create_time TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 4. 系统权限表
-- =============================================
CREATE TABLE IF NOT EXISTS sys_permission (
    id          BIGSERIAL       PRIMARY KEY,
    name        VARCHAR(50)     NOT NULL,
    code        VARCHAR(100)    NOT NULL UNIQUE,
    parent_id   BIGINT          DEFAULT 0,
    type        VARCHAR(20)     DEFAULT 'menu',
    path        VARCHAR(200),
    icon        VARCHAR(50),
    sort_order  INT             DEFAULT 0,
    status      INT             DEFAULT 1,
    create_time TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 5. 角色-权限关联表
-- =============================================
CREATE TABLE IF NOT EXISTS sys_role_permission (
    id              BIGSERIAL       PRIMARY KEY,
    role_id         BIGINT          NOT NULL,
    permission_id   BIGINT          NOT NULL,
    UNIQUE (role_id, permission_id)
);

-- =============================================
-- 6. 系统用户表
-- =============================================
CREATE TABLE IF NOT EXISTS sys_user (
    id          BIGSERIAL       PRIMARY KEY,
    username    VARCHAR(50)     NOT NULL UNIQUE,
    password    VARCHAR(200)    NOT NULL,
    nickname    VARCHAR(50),
    tenant_id   BIGINT,
    village_id  BIGINT,
    role_id     BIGINT,
    phone       VARCHAR(20),
    email       VARCHAR(100),
    status      INT             DEFAULT 1,
    create_time TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 7. GIS 地理对象表
-- =============================================
CREATE TABLE IF NOT EXISTS geo_object (
    id          BIGSERIAL       PRIMARY KEY,
    tenant_id   BIGINT,
    village_id  BIGINT,
    name        VARCHAR(100)    NOT NULL,
    type        VARCHAR(50)     NOT NULL,
    longitude   DOUBLE PRECISION,
    latitude    DOUBLE PRECISION,
    geometry    TEXT,
    status      INT             DEFAULT 1,
    extra_json  JSONB,
    create_time TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    deleted     INT             DEFAULT 0
);
DO $$ DECLARE ok BOOLEAN;
BEGIN
    SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname='postgis') INTO ok;
    IF ok THEN
        ALTER TABLE geo_object ADD COLUMN IF NOT EXISTS geom GEOMETRY(POINT,4326);
        UPDATE geo_object SET geom = ST_GeomFromText(geometry,4326)
        WHERE geometry IS NOT NULL AND geometry!='' AND geom IS NULL;
        CREATE INDEX IF NOT EXISTS idx_geo_geom ON geo_object USING GIST(geom);
    END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_geo_village ON geo_object(village_id);
CREATE INDEX IF NOT EXISTS idx_geo_type ON geo_object(type);

-- =============================================
-- 8. IoT 设备表
-- =============================================
CREATE TABLE IF NOT EXISTS iot_device (
    id              BIGSERIAL       PRIMARY KEY,
    tenant_id       BIGINT,
    village_id      BIGINT,
    name            VARCHAR(100)    NOT NULL,
    device_type     VARCHAR(50)     NOT NULL,
    device_code     VARCHAR(100),
    device_status   VARCHAR(20)     DEFAULT 'normal',
    longitude       DOUBLE PRECISION,
    latitude        DOUBLE PRECISION,
    location        VARCHAR(200),
    extra_json      JSONB,
    create_time     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    update_time     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    deleted         INT             DEFAULT 0
);

-- =============================================
-- 9. IoT 数据表
-- =============================================
CREATE TABLE IF NOT EXISTS iot_data (
    id          BIGSERIAL       PRIMARY KEY,
    tenant_id   BIGINT,
    village_id  BIGINT,
    device_id   BIGINT          NOT NULL,
    device_type VARCHAR(50),
    data_json   JSONB,
    data_time   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_iot_dev ON iot_data(device_id, data_time DESC);
CREATE INDEX IF NOT EXISTS idx_iot_vil ON iot_data(village_id, data_time DESC);

-- =============================================
-- 10. 事件表
-- =============================================
CREATE TABLE IF NOT EXISTS event (
    id          BIGSERIAL       PRIMARY KEY,
    tenant_id   BIGINT,
    village_id  BIGINT,
    title       VARCHAR(200)    NOT NULL,
    event_type  VARCHAR(50),
    level       VARCHAR(20)     DEFAULT 'normal',
    event_status VARCHAR(20)    DEFAULT 'pending',
    description TEXT,
    location    VARCHAR(200),
    longitude   DOUBLE PRECISION,
    latitude    DOUBLE PRECISION,
    reporter_id BIGINT,
    handler_id  BIGINT,
    extra_json  JSONB,
    create_time TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    deleted     INT             DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_evt_village ON event(village_id);
CREATE INDEX IF NOT EXISTS idx_evt_status ON event(event_status);
