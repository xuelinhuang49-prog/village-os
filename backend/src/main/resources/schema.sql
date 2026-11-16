-- ============================================================
-- 数字乡村平台 · 自动建表脚本
-- spring.sql.init.mode: always → 每次启动自动执行
-- CREATE TABLE IF NOT EXISTS 保证重复执行安全
-- 引擎: H2 (MySQL兼容模式)
-- ============================================================

-- 管理员账号
CREATE TABLE IF NOT EXISTS admin_users (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  username     VARCHAR(64),
  password     VARCHAR(128),
  name         VARCHAR(64),
  role         VARCHAR(32),
  org          VARCHAR(64),
  phone        VARCHAR(32),
  status       VARCHAR(16),
  permissions  VARCHAR(255),
  grid_id      VARCHAR(64),
  avatar_color VARCHAR(16),
  last_login   VARCHAR(32),
  created_at   TIMESTAMP
);

-- 农户账号（村民登录：账号=姓名拼音+123，初始密码 123456）
CREATE TABLE IF NOT EXISTS farmer (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(64),
  password   VARCHAR(128),
  name       VARCHAR(64),
  farmer_id  VARCHAR(64),
  village    VARCHAR(64),
  zone       VARCHAR(64),
  grid       VARCHAR(64),
  grid_id    VARCHAR(64),
  phone      VARCHAR(32),
  role       VARCHAR(32),
  status     VARCHAR(16),
  last_login VARCHAR(32)
);

-- 地块
CREATE TABLE IF NOT EXISTS lands (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(128),
  area       DOUBLE,
  soil_type  VARCHAR(32),
  location   VARCHAR(128),
  crop       VARCHAR(64),
  status     VARCHAR(32),
  irrigation BOOLEAN,
  gis_lat    DOUBLE,
  gis_lng    DOUBLE,
  created_at VARCHAR(32),
  farmer_id  BIGINT
);

-- 作物档案
CREATE TABLE IF NOT EXISTS crops (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(64),
  variety        VARCHAR(64),
  plant_date     VARCHAR(32),
  cycle          VARCHAR(32),
  expected_yield VARCHAR(32),
  area           DOUBLE,
  stage          VARCHAR(32),
  fertilizer     VARCHAR(128),
  status         VARCHAR(32),
  description    TEXT,
  farmer_id      BIGINT
);

-- 农事记录
CREATE TABLE IF NOT EXISTS farming_records (
  id        BIGINT AUTO_INCREMENT PRIMARY KEY,
  type      VARCHAR(32),
  crop_name VARCHAR(64),
  plot      VARCHAR(128),
  date      VARCHAR(32),
  detail    TEXT,
  operator  VARCHAR(32),
  weather   VARCHAR(32)
);

-- 农产品
CREATE TABLE IF NOT EXISTS products (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(128),
  category     VARCHAR(64),
  price        DOUBLE,
  unit         VARCHAR(32),
  stock        INT,
  sales        INT,
  status       VARCHAR(16),
  description  TEXT,
  farmer       VARCHAR(32),
  plot         VARCHAR(128),
  trace_id     VARCHAR(32),
  plant_date   VARCHAR(32),
  harvest_date VARCHAR(32),
  owner_id     BIGINT,
  farmer_id    BIGINT,
  review_note  VARCHAR(255)
);

-- 订单
CREATE TABLE IF NOT EXISTS orders (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_no     VARCHAR(32),
  product_name VARCHAR(128),
  buyer        VARCHAR(64),
  quantity     INT,
  amount       DOUBLE,
  status       VARCHAR(16),
  date         VARCHAR(32),
  logistics    VARCHAR(64),
  address      VARCHAR(255),
  phone        VARCHAR(32),
  order_type   VARCHAR(32)
);

-- 民宿
CREATE TABLE IF NOT EXISTS bnbs (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(128),
  owner       VARCHAR(64),
  phone       VARCHAR(32),
  rooms       INT,
  price       DOUBLE,
  rating      DOUBLE,
  bookings    INT,
  revenue     VARCHAR(32),
  status      VARCHAR(16),
  since       VARCHAR(16),
  description TEXT,
  license_no  VARCHAR(64),
  tags        VARCHAR(128)
);

-- 景区
CREATE TABLE IF NOT EXISTS scenic_spots (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(128),
  type        VARCHAR(64),
  level       VARCHAR(16),
  tickets     DOUBLE,
  visitors    INT,
  description TEXT,
  open_time   VARCHAR(64),
  facilities  VARCHAR(128)
);

-- 培训课程
CREATE TABLE IF NOT EXISTS training_courses (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(128),
  category    VARCHAR(64),
  teacher     VARCHAR(64),
  teacher_bio VARCHAR(255),
  date        VARCHAR(32),
  time        VARCHAR(32),
  duration    VARCHAR(32),
  joined      INT,
  limit_count INT,
  status      VARCHAR(16),
  location    VARCHAR(128),
  format_type VARCHAR(32),
  description TEXT,
  outline     TEXT,
  materials   TEXT
);

-- 医保养老
CREATE TABLE IF NOT EXISTS insurances (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(64),
  id_card       VARCHAR(32),
  med_type      VARCHAR(32),
  med_status    VARCHAR(16),
  med_balance   VARCHAR(32),
  pension_type  VARCHAR(32),
  pen_status    VARCHAR(16),
  pen_balance   VARCHAR(32),
  pen_monthly   VARCHAR(32),
  last_med_pay  VARCHAR(32),
  last_visit    VARCHAR(32),
  hospital      VARCHAR(128),
  diagnosis     TEXT,
  reimburse     VARCHAR(32),
  farmer_id     BIGINT
);

-- 惠农补贴
CREATE TABLE IF NOT EXISTS subsidies (
  id       BIGINT AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(64),
  type     VARCHAR(64),
  amount   DOUBLE,
  status   VARCHAR(16),
  date     VARCHAR(32),
  progress INT,
  material VARCHAR(255),
  handler  VARCHAR(64),
  farmer_id BIGINT
);

-- 老人关怀
CREATE TABLE IF NOT EXISTS elders (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(64),
  age           INT,
  gender        VARCHAR(8),
  address       VARCHAR(64),
  living_type   VARCHAR(32),
  contact       VARCHAR(64),
  contact_phone VARCHAR(32),
  device        VARCHAR(32),
  status        VARCHAR(16),
  last_active   VARCHAR(32),
  health        VARCHAR(255),
  alert24h      INT,
  alert_month   INT,
  emergency     TEXT
);

-- 系统日志
CREATE TABLE IF NOT EXISTS system_logs (
  id     BIGINT AUTO_INCREMENT PRIMARY KEY,
  time   VARCHAR(32),
  user   VARCHAR(64),
  action TEXT,
  type   VARCHAR(32),
  ip     VARCHAR(32)
);

-- 养殖档案
CREATE TABLE IF NOT EXISTS livestock (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  batch_no      VARCHAR(64),
  batch_name    VARCHAR(128),
  category      VARCHAR(32),
  type          VARCHAR(64),
  breed         VARCHAR(64),
  initial_count INT,
  count         INT,
  unit          VARCHAR(16),
  area          VARCHAR(128),
  start_date    VARCHAR(32),
  expect_date   VARCHAR(32),
  stage         VARCHAR(32),
  health        VARCHAR(32),
  source        VARCHAR(32),
  manager       VARCHAR(32),
  phone         VARCHAR(32),
  village_name  VARCHAR(64),
  remark        TEXT,
  updated_at    VARCHAR(32),
  farmer_id     BIGINT
);

-- 养殖记录
CREATE TABLE IF NOT EXISTS breeding_record (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  archive_id  BIGINT,
  batch_no    VARCHAR(64),
  batch_name  VARCHAR(128),
  type        VARCHAR(32),
  content     TEXT,
  record_time VARCHAR(32),
  recorder    VARCHAR(32),
  created_at  VARCHAR(32)
);

-- 灌溉记录
CREATE TABLE IF NOT EXISTS irrigation_record (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  device_name      VARCHAR(128),
  device_id        VARCHAR(64),
  area             VARCHAR(128),
  start_time       TIMESTAMP,
  stop_time        TIMESTAMP,
  duration_seconds BIGINT,
  start_mode       VARCHAR(16),
  operator         VARCHAR(32),
  water_usage      DOUBLE,
  avg_flow         DOUBLE,
  soil_before      VARCHAR(32),
  soil_after       VARCHAR(32),
  status           VARCHAR(16),
  error_note       VARCHAR(255),
  create_time      TIMESTAMP
);

-- 村民诉求上报（私域数据，farmer_id 关联 farmer 表）
CREATE TABLE IF NOT EXISTS service_request (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  farmer_id     BIGINT NOT NULL,
  request_type  VARCHAR(64),
  content       TEXT,
  contact_phone VARCHAR(20),
  status        VARCHAR(32) DEFAULT 'PENDING',
  admin_reply   TEXT,
  create_time   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_time   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 惠农政策（公域数据，政府公开/互联网公开，全员可查、无需登录）
CREATE TABLE IF NOT EXISTS policy (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(128),
  category     VARCHAR(32),
  source       VARCHAR(64),
  publish_date VARCHAR(32),
  summary      VARCHAR(255),
  content      TEXT,
  status       VARCHAR(16),
  create_time  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 数据归属迁移：为既有业务表补 farmer_id（幂等，旧库无此列时自动新增）
-- ============================================================
ALTER TABLE lands      ADD COLUMN IF NOT EXISTS farmer_id BIGINT;
ALTER TABLE crops      ADD COLUMN IF NOT EXISTS farmer_id BIGINT;
ALTER TABLE insurances ADD COLUMN IF NOT EXISTS farmer_id BIGINT;
ALTER TABLE subsidies  ADD COLUMN IF NOT EXISTS farmer_id BIGINT;
ALTER TABLE livestock  ADD COLUMN IF NOT EXISTS farmer_id BIGINT;
