# 🏘️ 数字乡村平台 (Village OS)

> 智慧乡村数字化管理平台 — 单仓库 · 多模块 · SaaS级架构
>
> 开发周期: Sprint 1~8 (8周交付 V1.0) | 当前: Sprint 1 ✅

---

## 📁 目录结构

```
village-os/
│
├── backend/                     # Spring Boot 3.2 后端
│   └── src/main/java/com/village/os/
│       ├── common/              # 公共类 (Result, BaseEntity, TenantContext)
│       ├── config/              # 配置 (CORS, Redis, WebSocket, MyBatis Plus)
│       ├── security/            # JWT + Spring Security
│       ├── tenant/              # 多租户 (Entity, Mapper)
│       ├── village/             # 村庄管理 (Entity, Mapper, Service, Controller)
│       ├── gis/                 # GIS 地理信息 + PostGIS
│       ├── iot/                 # IoT 设备 + WebSocket 推送
│       ├── dashboard/           # 驾驶舱
│       ├── event/               # 事件管理
│       ├── governance/          # 乡村治理 (Sprint 7)
│       ├── industry/            # 产业管理 (Sprint 5)
│       ├── asset/               # 资产管理 (Sprint 6)
│       ├── ai/                  # AI 分析 (Sprint 8)
│       └── websocket/           # WebSocket 扩展
│
├── frontend/                    # Vue3 + Vite 前端
│   └── src/
│       ├── api/                 # API 请求层
│       ├── assets/              # 静态资源
│       ├── components/          # 公共组件
│       ├── config/              # 前端配置
│       ├── hooks/               # 组合式函数
│       ├── layouts/             # 布局组件
│       ├── modules/             # 业务模块
│       │   ├── dashboard/       # 驾驶舱 (Sprint 2)
│       │   ├── gis/             # GIS 地图 (Sprint 3)
│       │   ├── iot/             # IoT 监控 (Sprint 4)
│       │   ├── industry/        # 产业管理 (Sprint 5)
│       │   ├── asset/           # 资产管理 (Sprint 6)
│       │   ├── governance/      # 乡村治理 (Sprint 7)
│       │   ├── ai/              # AI 分析 (Sprint 8)
│       │   ├── village/         # 村庄管理
│       │   └── event/           # 事件管理
│       ├── router/              # 路由配置
│       ├── store/               # Pinia 状态管理
│       ├── styles/              # 全局样式
│       ├── utils/               # 工具函数
│       └── views/               # 页面入口
│
├── sql/                         # 数据库脚本 (独立于后端)
│   ├── 00_master.sql            # 一键初始化入口
│   ├── 01_init.sql              # 建表 (7张表)
│   ├── 02_tenant.sql            # 租户数据
│   ├── 03_village.sql           # 村庄种子数据
│   ├── 04_gis.sql               # GIS 点位数据
│   ├── 05_iot.sql               # IoT 设备数据
│   ├── 06_event.sql             # 事件种子数据
│   ├── 07_asset.sql             # 资产表 (Sprint 6)
│   ├── 08_industry.sql          # 产业表 (Sprint 5)
│   ├── 09_governance.sql        # 治理表 (Sprint 7)
│   ├── 10_ai.sql                # AI数据表 (Sprint 8)
│   └── 11_seed_all.sql          # 全量种子数据
│
├── mock/                        # 模拟数据 (前端可独立开发)
│   ├── iot/
│   │   ├── greenhouse.json      # 智慧大棚
│   │   ├── weather.json         # 气象站
│   │   ├── water_quality.json   # 水质监测
│   │   ├── smart_market.json    # 智慧市集
│   │   ├── iot_mock.json        # 设备快照
│   │   ├── sensor_stream.json   # 实时流格式
│   │   └── alarm_mock.json      # 告警模拟
│   ├── gis/
│   │   ├── geo_points.json      # 点位数据
│   │   └── village_boundary.json # 村庄边界
│   ├── dashboard/
│   │   └── overview.json        # 概览数据
│   └── event/
│       └── events.json          # 事件数据
│
├── docs/                        # 设计文档 (所有需求写这里)
│   ├── 产品需求说明书.md          # PRD
│   ├── 开发计划.md               # Sprint Plan
│   ├── 架构设计.md
│   ├── API文档.md
│   ├── 数据库设计.md
│   ├── 前端结构.md
│   └── 部署说明.md
│
├── config/                      # 环境配置 (统一管理)
│   ├── dev.yml                  # 开发环境
│   ├── test.yml                 # 测试环境
│   └── prod.yml                 # 生产环境
│
├── scripts/                     # 启动脚本
│   ├── start-backend.sh/.bat
│   ├── start-frontend.sh/.bat
│   ├── start-all.bat
│   └── docker-compose.yml
│
├── deploy/                      # 部署配置
│   └── Dockerfile               # 后端多阶段构建
│
├── logs/                        # 运行时日志 (gitignore)
├── .gitignore
└── README.md                    # 本文件
```

---

## 🚀 快速开始

### 环境要求

| 软件 | 版本 | 说明 |
|------|------|------|
| JDK | 17+ | 推荐 Eclipse Temurin 17 |
| Maven | 3.9+ | 构建后端 |
| Node.js | 18+ | 构建前端 |
| PostgreSQL | 15+ | 主数据库 |
| Redis | 7.x | 缓存服务 |

### 1. 初始化数据库

```bash
createdb -U postgres village_os
cd sql
psql -U postgres -d village_os -f 00_master.sql
```

### 2. 启动后端

```bash
cd backend
./mvnw spring-boot:run
# → http://localhost:8080
```

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### 4. Docker 一键部署

```bash
cd scripts
docker-compose up -d
```

---

## 🔑 默认账号

| 用户名 | 密码 | 默认村庄 |
|--------|------|---------|
| `admin` | `admin123` | 中堰村 (武汉市江夏区) |

---

## 📡 API 参考

| 模块 | 方法 | 端点 | 说明 |
|------|------|------|------|
| 认证 | POST | `/api/v1/auth/login` | 登录 |
| 认证 | GET | `/api/v1/auth/me` | 当前用户 |
| 村庄 | GET | `/api/v1/village/list` | 村庄列表 |
| 村庄 | GET | `/api/v1/village/{id}` | 村庄详情 |
| 村庄 | POST | `/api/v1/village/create` | 创建村庄 |
| 村庄 | POST | `/api/v1/village/switch` | 切换村庄 |
| GIS | GET | `/api/v1/gis/objects?village_id=1` | 点位列表 |
| GIS | POST | `/api/v1/gis/object` | 创建点位 |
| 驾驶舱 | GET | `/api/v1/dashboard/overview` | 概览数据 |
| IoT | WS | `ws://localhost:8080/ws/iot` | 实时数据推送 |

---

## 🏗️ 技术栈

| 层级 | 技术 |
|------|------|
| 后端框架 | Spring Boot 3.2.7 |
| ORM | MyBatis Plus 3.5.7 |
| 安全 | Spring Security + JWT (JJWT 0.12.6) |
| 数据库 | PostgreSQL 15 + PostGIS 3 |
| 缓存 | Redis 7 |
| 实时通信 | Spring WebSocket |
| 前端框架 | Vue3 + Vite |
| UI库 | Element Plus |
| 地图 | Leaflet / MapTalks |
| 状态管理 | Pinia |
| 图表 | ECharts |

---

## 📋 Sprint 开发计划

| Sprint | 模块 | 周期 | 状态 |
|--------|------|------|------|
| Sprint 1 | 用户·登录·多租户 | Week 1 | ✅ |
| Sprint 2 | 驾驶舱首页 | Week 2 | 🔜 |
| Sprint 3 | GIS 数字孪生 | Week 3 | 🔜 |
| Sprint 4 | IoT 实时数据 | Week 4 | 🔜 |
| Sprint 5 | 产业管理 | Week 5 | 🔜 |
| Sprint 6 | 资产运营 | Week 6 | 🔜 |
| Sprint 7 | 乡村治理 | Week 7 | 🔜 |
| Sprint 8 | AI 智能分析 | Week 8 | 🔜 |

详细计划见 [docs/开发计划.md](docs/开发计划.md)

---

## 📐 开发规范

### 强制规则
1. **所有代码在 `village-os/` 根目录下** — 禁止多项目散落
2. **前后端同仓库管理** — `backend/` + `frontend/`
3. **数据库脚本统一放 `sql/`** — 不在 backend 内放 SQL
4. **模拟数据统一放 `mock/`** — 前端可独立开发
5. **所有需求写在 `docs/`** — 不靠微信聊天找需求
6. **环境配置统一放 `config/`** — dev/test/prod 分离

### Git 规范
```
main ← develop ← sprint/N-name
Commit: feat/fix/docs/refactor/test
```

---

## 📖 文档索引

- [产品需求说明书](docs/产品需求说明书.md)
- [开发计划 (Sprint Plan)](docs/开发计划.md)
- [架构设计](docs/架构设计.md)
- [API 文档](docs/API文档.md)
- [数据库设计](docs/数据库设计.md)
- [前端结构](docs/前端结构.md)
- [部署说明](docs/部署说明.md)

---

**License:** Proprietary — 数字乡村平台专用
