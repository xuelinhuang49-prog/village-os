# Sprint 01 — 平台基础

> 周期: 5~7天 | 状态: 🟢 代码完成，待联调验收 | PO: 产品负责人 | Tech Lead: 技术架构师

---

## 一、Sprint 目标

完成平台地基：用户能登录 → 进Dashboard → 看到村庄名。

**不做任何业务功能，只打地基。**

---

## 二、数据库设计

### 第一批表（5张）

| 表名 | 说明 |
|------|------|
| tenant | 租户（一个村庄=一个租户） |
| village | 村庄详细信息 |
| sys_user | 系统用户 |
| sys_role | 角色 |
| sys_permission | 权限 |

### 种子数据

| 表 | 数据 |
|----|------|
| tenant | id=1, name=中堰村, code=ZYC001 |
| village | id=1, tenant_id=1, name=中堰村, 湖北武汉江夏 |
| sys_user | admin / 123456 |
| sys_role | 超级管理员 / 村管理员 / 网格员 |
| sys_permission | 基础权限项 |

---

## 三、后端任务

- [ ] 根路径 `/` 返回 `{"msg":"Village OS Backend Started"}`
- [ ] PostgreSQL 连接成功
- [ ] Redis 连接成功
- [ ] POST `/api/v1/auth/login` → JWT + user
- [ ] JWT 包含 userId / tenantId / villageId
- [ ] 所有接口自动解析 JWT（JwtFilter + TenantContext）

---

## 四、前端任务

- [ ] Vue3 + Vite 项目初始化
- [ ] `/login` 登录页（用户名 + 密码 + 按钮）
- [ ] 登录成功自动跳转 `/dashboard`
- [ ] Dashboard 显示：
  - 数字乡村综合运营平台
  - 欢迎：admin
  - 当前村庄：中堰村
- [ ] 未登录自动跳 `/login`

---

## 五、验收标准 (8项)

| # | 验收项 | 状态 |
|---|--------|------|
| 1 | 后端启动成功 (localhost:8080) | ✅ 代码完成 |
| 2 | PostgreSQL 连接成功 | ✅ 配置就绪 |
| 3 | Redis 连接成功 | ✅ 配置就绪 |
| 4 | 登录接口返回 JWT | ✅ POST /api/v1/auth/login |
| 5 | JWT 包含 tenantId + villageId | ✅ JwtTokenProvider |
| 6 | 前端登录页可用 | ✅ LoginPage.vue |
| 7 | 登录后跳转 Dashboard | ✅ 路由守卫 |
| 8 | Dashboard 显示"当前村庄：中堰村" | ✅ DashboardPage.vue |

---

## 六、目录检查

```
backend/src/main/java/com/village/os/
├── auth/           ← 认证模块
├── security/       ← JWT + Spring Security
├── tenant/         ← 租户
├── village/        ← 村庄
├── user/           ← 用户

frontend/src/
├── api/            ← 后端接口封装
├── router/         ← 路由
├── store/          ← Pinia
├── layouts/        ← 布局
├── views/
│   ├── login/      ← 登录页
│   └── dashboard/  ← 首页
```
