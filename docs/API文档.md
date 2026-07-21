# 数字乡村平台 - API 文档 v1.0

> Base URL: `http://localhost:8080/api/v1`
> Auth: Bearer Token (JWT)

---

## 1. 认证模块 `/auth`

### 1.1 用户登录
```
POST /auth/login
Content-Type: application/json

Request:
{
  "username": "admin",
  "password": "admin123",
  "villageId": 1          // 可选，指定登录村庄
}

Response 200:
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "userId": 1,
    "username": "admin",
    "realName": "系统管理员",
    "tenantId": 1,
    "villageId": 1
  }
}
```

### 1.2 当前用户信息
```
GET /auth/me
Authorization: Bearer <token>

Response 200:
{
  "code": 200,
  "data": {
    "userId": 1,
    "username": "admin",
    "realName": "系统管理员",
    "phone": "13800000001",
    "email": "admin@village.local",
    "tenantId": 1,
    "villageId": 1
  }
}
```

---

## 2. 村庄管理 `/village`

### 2.1 村庄列表
```
GET /village/list

Response 200:
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "中堰村",
      "code": "ZY2024001",
      "province": "湖北省",
      "city": "武汉市",
      "district": "江夏区",
      "address": "江夏区乌龙泉街道中堰村",
      "longitude": 114.3055,
      "latitude": 30.3852,
      "area": 8.6,
      "population": 2156,
      "status": 1
    }
  ]
}
```

### 2.2 村庄详情
```
GET /village/{id}

Response 200:
{
  "code": 200,
  "data": { ... }
}
```

### 2.3 创建村庄
```
POST /village/create

Request:
{
  "name": "新村",
  "code": "XC2024002",
  "province": "湖北省",
  "city": "武汉市",
  "district": "江夏区",
  "address": "...",
  "longitude": 114.3000,
  "latitude": 30.3800
}
```

### 2.4 切换村庄
```
POST /village/switch

Request:
{
  "villageId": 2
}
```

---

## 3. GIS 地理信息 `/gis`

### 3.1 GIS点位列表
```
GET /gis/objects?village_id=1

Response 200:
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "党群服务中心",
      "type": "gov_center",
      "longitude": 114.3055,
      "latitude": 30.3852,
      "geometry": "POINT(114.3055 30.3852)",
      "extraJson": "{\"icon\":\"gov\",\"description\":\"...\"}"
    }
    // ... 共10个点位
  ]
}
```

### 3.2 创建GIS点位
```
POST /gis/object

Request:
{
  "villageId": 1,
  "name": "新点位",
  "type": "square",
  "longitude": 114.3100,
  "latitude": 30.3900,
  "extraJson": "{\"icon\":\"custom\"}"
}
```

**点位类型 (type) 枚举:**
| 值 | 含义 |
|----|------|
| gov_center | 党群服务中心 |
| industry_park | 产业园区 |
| greenhouse | 智慧大棚 |
| farmland | 农田/养殖区 |
| market | 市集 |
| apartment | 公寓 |
| hotel | 民宿/酒店 |
| clinic | 卫生室 |
| square | 广场 |

---

## 4. 驾驶舱 `/dashboard`

### 4.1 驾驶舱概览
```
GET /dashboard/overview

Response 200:
{
  "code": 200,
  "data": {
    "village_name": "中堰村",
    "village_area": 8.6,
    "village_population": 2156,
    "greenhouse_count": 3,
    "active_devices": 12,
    "today_alerts": 2,
    "visitor_count": 156,
    "iot_status": { "online": 10, "offline": 1, "warning": 1 },
    "event_stats": { "pending": 3, "processing": 5, "completed": 28, "total": 36 }
  }
}
```

---

## 5. WebSocket IoT `/ws/iot`

### 5.1 连接
```
ws://localhost:8080/ws/iot
```

### 5.2 推送消息格式
```json
{
  "type": "iot_update",
  "village_id": 1,
  "device_id": 1001,
  "device_type": "greenhouse",
  "status": "normal",
  "timestamp": 1719705600000,
  "data": {
    "temperature": 28.5,
    "humidity": 65.0,
    "soil_moisture": 30.0,
    "co2": 420.0,
    "light_intensity": 18500.0
  }
}
```

### 5.3 推送频率
- 每 5 秒推送 4 路设备数据
- 设备类型: greenhouse, weather_station, water_quality, smart_market

---

## 6. 通用说明

### 认证方式
所有 `/api/**` 接口需要在 Header 中携带:
```
Authorization: Bearer <jwt_token>
```

### 多租户 Header（可选）
```
X-Tenant-Id: 1
X-Village-Id: 1
```

### 错误响应
```json
{
  "code": 401,
  "message": "未登录",
  "data": null
}
```
