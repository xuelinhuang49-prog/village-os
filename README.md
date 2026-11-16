# 🏘️ 数字乡村平台 (Village OS)

> 智慧乡村数字化管理平台 —— 单仓库 · 多模块 · SaaS 级架构
>
> 覆盖「乡村治理 + 产业管理 + 民生服务」的一体化数字乡村解决方案。

---

## 📌 项目简介

数字乡村平台是一套面向乡镇/村庄的 **智慧乡村 SaaS 管理平台**，前端采用 Vue3 + Element Plus，后端采用 Spring Boot 3 微服务化单体架构，支持 **多租户（村庄）** 隔离、JWT 鉴权、GIS 数字孪生、IoT 设备实时监控等核心能力。平台围绕农村实际场景，沉淀了 **农业种植、畜禽养殖、农产品电商、文旅民宿、养老、便民政务、政策补贴、病虫害防治** 等 20+ 个业务模块。

---

## ✨ 功能模块

### 平台基础能力
| 模块 | 说明 |
|------|------|
| 📊 数字驾驶舱 | 村庄数据总览大屏，ECharts 可视化 |
| 🗺️ GIS 数字孪生 | 村庄地图、点位标注、边界管理（Leaflet） |
| 📡 IoT 实时监控 | 设备数据接入 + WebSocket 实时推送 |
| 🏘️ 多租户管理 | 村庄级数据隔离、切换 |
| 🔐 用户与权限 | JWT + Spring Security 鉴权 |
| 📋 事件管理 | 村务事件上报与流转 |

### 乡村产业
| 模块 | 说明 |
|------|------|
| 🌾 农业种植 | 作物、土地、灌溉、农事记录全流程管理 |
| 🐄 畜禽养殖 | 畜禽档案、养殖/繁育记录 |
| 🛒 农产品电商 | 商品、订单、评价（含统一电商字体/主题脚本） |
| 👨‍🌾 农户与经营主体 | 农户档案、经营业务管理 |
| 🐛 病虫害防治 | 病虫害识别与防治管理 |

### 乡村服务
| 模块 | 说明 |
|------|------|
| 🏨 文旅民宿 | 民宿、景区、旅游环境监测、投喂管理、美食推荐 |
| 👵 养老服务 | 老年人关怀管理 |
| 📄 便民政务 | 政务表格下载（低保、农地证、户口迁移等模板） |
| 🎓 技能培训 | 培训课程管理 |

### 乡村治理
| 模块 | 说明 |
|------|------|
| 📜 政策补贴 | 政策发布、农业补贴、农险管理 |
| 🏛️ 乡村治理 | 治理事务管理 |
| 💰 资产管理 | 集体资产运营 |
| 📈 统计分析 | 多维数据统计 |
| 🤖 AI 分析 | 智能数据分析（规划中） |

---

## 🏗️ 系统架构

```
┌──────────────────── 前端 (Vue3 + Vite) ────────────────────┐
│  src/modules/                                                │
│  ├── dashboard  驾驶舱   ├── gis 数字孪生  ├── iot 监控     │
│  ├── industry   产业     ├── asset 资产    ├── governance 治理│
│  ├── ai         智能     ├── event 事件    └── village 村庄  │
│  └── views/  dashboard · industry/agriculture · pest · home │
└────────────────────────────┬───────────────────────────────┘
                             │ REST / WebSocket
┌────────────────────────────▼───────────────────────────────┐
│  后端 (Spring Boot 3 · 单体分层)                             │
│  controller → service → mapper (MyBatis Plus)               │
│  ├── security/   JWT + Spring Security                      │
│  ├── tenant/     多租户上下文                                 │
│  ├── village/gis/iot/dashboard/event/governance/industry/… │
│  └── websocket/  实时推送                                    │
└──────────────┬────────────────────────────┬────────────────┘
               │                            │
        ┌──────▼──────┐              ┌──────▼──────┐
        │ H2 (开发)     │              │ Redis 缓存   │
        │ 生产外部DB     │              └─────────────┘
        └─────────────┘
```

---

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 后端框架 | Spring Boot 3.2 |
| ORM | MyBatis Plus（Spring Boot 3 Starter） |
| 安全 | Spring Security + JWT（JJWT） |
| 数据库 | H2（开发，文件模式）/ 生产环境外部数据库（环境变量注入） |
| 缓存 | Redis（Lettuce） |
| 实时通信 | Spring WebSocket |
| 前端框架 | Vue3 + Vite |
| UI 库 | Element Plus |
| 地图 | Leaflet / MapTalks |
| 状态管理 | Pinia |
| 图表 | ECharts |

---

## 📁 目录结构

```
village-os/
├── backend/                     # Spring Boot 3 后端
│   └── src/main/java/com/village/os/
│       ├── common/              # 公共类 (Result, BaseEntity, TenantContext)
│       ├── config/              # 配置 (CORS, Redis, WebSocket, MyBatis Plus)
│       ├── security/            # JWT + Spring Security
│       ├── tenant/              # 多租户
│       ├── village/             # 村庄管理
│       ├── gis/                 # GIS 地理信息
│       ├── iot/                 # IoT 设备 + WebSocket 推送
│       ├── dashboard/           # 驾驶舱
│       ├── event/               # 事件管理
│       ├── governance/          # 乡村治理
│       ├── industry/            # 产业管理
│       ├── asset/               # 资产管理
│       ├── ai/                  # AI 分析
│       ├── util/                # 工具类
│       └── websocket/           # WebSocket 扩展
│
├── frontend/                    # Vue3 + Vite 前端
│   ├── src/api/                 # API 请求层
│   ├── src/modules/             # 业务模块 (dashboard/gis/iot/industry/...)
│   ├── src/views/               # 页面入口 (dashboard/industry/pest/home/...)
│   ├── src/router/              # 路由
│   ├── src/store/               # Pinia
│   └── src/utils/               # 工具
│
├── sql/                         # 数据库初始化脚本
├── mock/                        # 模拟数据（前端可独立开发）
├── docs/                        # 产品/架构/接口/部署 文档
├── config/                      # dev/test/prod 环境配置（敏感信息 env 注入）
├── scripts/                     # 启动脚本
├── deploy/                      # 部署配置（Dockerfile / nginx）
└── README.md
```

---

## 🚀 快速开始

### 环境要求

| 软件 | 版本 | 说明 |
|------|------|------|
| JDK | 17+ | 推荐 Eclipse Temurin |
| Maven | 3.9+ | 构建后端 |
| Node.js | 18+ | 构建前端 |
| Redis | 7.x | 缓存（可选，开发可关闭） |

> 开发环境默认使用 **H2 文件数据库**（`backend/data/`），无需单独安装数据库即可启动；生产环境通过 `config/prod.yml` + 环境变量注入外部数据库。

### 1. 启动后端

```bash
cd backend
./mvnw spring-boot:run        # 或 mvn spring-boot:run
# → http://localhost:8080
```

### 2. 启动前端

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### 3. 默认账号

| 用户名 | 密码 | 默认村庄 |
|--------|------|---------|
| `admin` | `admin123` | 中堰村（武汉市江夏区） |

---

## 📡 API 参考（节选）

| 模块 | 方法 | 端点 | 说明 |
|------|------|------|------|
| 认证 | POST | `/api/v1/auth/login` | 登录 |
| 认证 | GET | `/api/v1/auth/me` | 当前用户 |
| 村庄 | GET | `/api/v1/village/list` | 村庄列表 |
| GIS | GET | `/api/v1/gis/objects` | 点位列表 |
| 驾驶舱 | GET | `/api/v1/dashboard/overview` | 概览数据 |
| IoT | WS | `ws://localhost:8080/ws/iot` | 实时数据推送 |

> 完整接口见 [docs/API文档.md](docs/API文档.md)。

---

## 📋 开发规范

### 目录规范
1. 所有代码在 `village-os/` 根目录下，前后端同仓库（`backend/` + `frontend/`）。
2. 数据库脚本统一放 `sql/`，模拟数据统一放 `mock/`。
3. 所有需求与设计文档写入 `docs/`。
4. 环境配置统一放 `config/`（dev/test/prod 分离，敏感信息走环境变量）。

### Git 规范
```
main ← develop ← sprint/N-name
Commit: feat/fix/docs/refactor/test
```

---

## 📖 文档索引

- [产品需求说明书](docs/产品需求说明书.md)
- [开发计划](docs/开发计划.md)
- [架构设计](docs/架构设计.md)
- [API 文档](docs/API文档.md)
- [数据库设计](docs/数据库设计.md)
- [前端结构](docs/前端结构.md)
- [部署说明](docs/部署说明.md)

---

## ⚠️ 说明

- 开发环境 `application.yml` 中的 JWT 密钥为**演示用占位密钥**，生产环境请通过 `JWT_SECRET` 环境变量注入真实密钥。
- 运行产生的 H2 数据库文件（`backend/data/`）、Maven 生成物等均已通过 `.gitignore` 排除。

**License:** Proprietary — 数字乡村平台专用（个人作品，求职展示用）
