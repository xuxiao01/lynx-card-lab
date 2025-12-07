## douyin_search_lynx_exercise

抖音搜索培训营题目 - 基于 Lynx + TypeScript 的餐厅团购页面

## 🚀 快速开始

### 📋 完整启动流程（按顺序执行）

#### 步骤 1：安装依赖

```bash
pnpm install
```

#### 步骤 2：配置环境变量（首次必做）⚠️
**自动配置**
```bash
# 首次运行需要添加执行权限（只需执行一次）
chmod +x setup-env.sh

# 运行脚本，自动获取 IP 并生成 .env.local 文件
./setup-env.sh
```
脚本会自动检测你的 IP 并生成 `.env.local` 配置文件。

#### 步骤 3：启动后端服务（终端 1）

在对应的 mock 文件夹中打开一个终端窗口：

```bash
node mock/server.cjs
```

看到以下输出表示启动成功：
```
Mock API 运行在 http://localhost:4000
```

**保持这个终端窗口运行，不要关闭！**

#### 步骤 4：启动前端服务（终端 2）

打开第二个终端窗口：

```bash
pnpm run dev
```

看到以下输出表示启动成功：
```
➜  Local:   http://localhost:3000/
➜  Network: http://192.168.0.100:3000/  ← 记住这个 IP
```

**保持这个终端窗口运行，不要关闭！**

#### 步骤 5：访问应用

现在两个服务都在运行了，可以访问应用：

- **浏览器测试**：打开 `http://你的IP:3000`（使用步骤 4 中显示的 Network IP）
- **Lynx Explorer 测试**：输入 `http://你的IP:3000/main.lynx.bundle?fullscreen=true`

---

### 📝 启动流程总结

```
1. pnpm install                    # 安装依赖（只需一次）
2. ./setup-env.sh                  # 配置环境变量（首次必做）
3. node mock/server.cjs            # 启动后端（终端 1，保持运行）
4. pnpm run dev                    # 启动前端（终端 2，保持运行）
5. 浏览器访问 http://你的IP:3000   # 访问应用
```

### ⚠️ 注意事项

- **两个服务都要运行**：后端（端口 4000）和前端（端口 3000）必须同时运行
- **不要关闭终端**：关闭终端窗口会停止对应的服务
- **IP 地址**：Lynx 真机环境必须使用真实 IP，不能使用 `localhost`
- **修改配置后**：如果修改了 `.env.local`，需要重启前端服务（Ctrl+C 然后重新运行 `pnpm run dev`）

详见：[环境变量配置说明](./docs/getting-started/环境变量配置说明.md) 或 [快速开始](./docs/getting-started/快速开始.md)

## 📚 完整文档

详细文档请查看 [docs 目录](./docs/)：

### 🚀 入门指南
- **[快速开始](./docs/getting-started/快速开始.md)** ⭐ 推荐首读
- [配置完成总结](./docs/getting-started/配置完成总结.md)
- [环境变量配置说明](./docs/getting-started/环境变量配置说明.md)

### 📖 开发指南
- [API 使用说明](./docs/guides/API使用说明.md)
- [性能监控说明](./docs/guides/性能监控说明.md)
- [Performance API 详细说明](./docs/guides/Performance-API-说明.md)

### 🔧 问题排查
- [Lynx 真机调试说明](./docs/troubleshooting/Lynx真机调试说明.md)
- [Lynx 网络请求问题总结](./docs/troubleshooting/Lynx网络请求问题总结.md)
- [Lynx Performance API FAQ](./docs/troubleshooting/Lynx-Performance-API-FAQ.md) ⭐ 重要

## 📖 项目简介

本项目是抖音搜索 / Lynx 工程师训练营的练习项目，基于 **Lynx + TypeScript + React** 实现了一个完整的餐厅团购页面。

### 已实现功能

✅ **页面组件**
- 餐厅信息头部卡片（`RestaurantHeader`）
- 团购商品卡片（`DealCard`）
  - 支持多种角标类型（普通角标、倒计时角标）
  - 倒计时实时更新功能
- 横向滚动团购列表（`DealList`）

✅ **网络请求**
- HTTP 请求封装（`utils/http.ts`）
- 环境自动检测（Lynx / 浏览器）
- 完整的 TypeScript 类型支持
- API 服务层（`services/shop.ts`）

✅ **静态资源处理**
- 图片 URL 自动转换（`utils/url.ts`）
- Lynx 环境适配
- 降级图片支持

✅ **交互功能**
- 倒计时功能（`useCountdown` Hook）
  - 支持 "HH:MM:SS" 格式时间倒计时
  - 自动每秒更新，时间归零后停止
  - 优化样式避免倒计时更新时背景移动

✅ **性能监控**
- Lynx Performance API 集成（`usePerformanceMetrics` Hook）
  - 使用 `PerformanceObserver` 监听 Lynx 的 `actualFmp` 指标
  - 手动解析和打印性能数据（actualFmp、totalActualFmp）
  - 性能数据格式化输出和总结分析
- 自定义 FMP 时间检测（`DealList.tsx` 中实现）
  - 记录数据开始加载时间点
  - 使用 `useLayoutEffect` 检测首屏关键内容渲染完成
  - 计算从数据加载到首屏渲染完成的耗时
  - 输出自定义 FMP 性能数据（耗时、首屏卡片数量等）
- `__lynx_timing_flag` 标记集成
- 双重性能监控：Lynx 官方 API + 自定义实现

✅ **工程化能力（Rspeedy + Rspack）**
- 自定义静态资源命名规则
  - 图片文件命名：`[name].xuxiao.[contenthash:8][ext]`
  - 通过 `output.filename` 配置实现
- Rspack 插件集成
  - 使用 `tools.rspack` 集成 `BannerPlugin`
  - 为构建产物自动添加作者/功能注释
  - 加深对 Rspack 插件与打包产物结构的理解

✅ **Mock API 服务**
- 基于 Node.js + Express 实现
  - `GET /api/shops`：获取所有商家信息
  - `POST /api/deals`：根据商家 ID 获取团购商品
- 完整的错误处理和 CORS 支持
- JSON 数据文件管理（`mock/data/`）

✅ **开发体验**
- 环境变量配置
- 自动配置脚本（`setup-env.sh`）
- 完整的文档体系

### 技术栈

- **框架**: Lynx + React
- **语言**: TypeScript
- **构建**: Vite
- **API**: Express.js (Mock Server)
- **样式**: CSS

## Mock API 接口说明

项目提供了本地 Mock API 服务，用于模拟后端接口。Mock 服务位于 `mock/` 目录下。

### API 接口

#### 1. 获取所有商家信息
- **接口**: `GET /api/shops`
- **说明**: 获取所有商家信息列表
- **响应示例**:
```json
{
  "code": 200,
  "data": [
    {
      "restaurantId": "1",
      "restaurantName": "椒鸣椒麻馆(五道口店)",
      "restaurantCover": "/static/image/default-cover.72a863cc.png",
      "rating": 3.5,
      "ratingText": "可以一试",
      "reviewCount": 170,
      "category": "中餐",
      "area": "龙柏地区",
      "avgPrice": 220,
      "distance": "842m",
      "tags": ["心动榜2025年上榜餐厅", "多人聚餐", "生日轰趴", "可订桌"]
    }
  ],
  "message": "success"
}
```

#### 2. 获取商家团购商品
- **接口**: `POST /api/deals`
- **说明**: 通过商家 ID 获取对应的团购商品列表
- **请求参数**:
```json
{
  "restaurantId": "1"
}
```
- **响应示例**:
```json
{
  "code": 200,
  "data": [
    {
      "dealId": "1",
      "dealImage": "/static/image/food-default.b740debc.png",
      "badges": [
        {
          "text": "特惠补贴",
          "subText": "减10",
          "type": "normal"
        }
      ],
      // 或者倒计时类型：
      // "badges": [
      //   {
      //     "text": "限时秒杀",
      //     "subText": "06:39:50",
      //     "type": "countdown"
      //   }
      // ],
      "dealTitle": "【神仙下午茶】椒麻鸡+椒麻鱼+配菜+超大杯柠檬茶",
      "price": 168,
      "originalPrice": 298,
      "buttonText": "抢购"
    }
    // ... 更多商品
  ],
  "message": "success"
}
```

### 数据文件

Mock 数据存储在 `mock/data/` 目录下：
- `shop.json`: 商家信息数据（1 个商家）
- `products.json`: 团购商品数据（10 个商品）

### 代理配置

开发环境的代理配置在 `lynx.config.ts` 中：
- **浏览器环境**: `/api` 请求会自动代理到 `http://localhost:4000`
- **Lynx 环境**: 使用完整 URL（配置在 `.env.local`）

⚠️ **注意**：Lynx 真机环境不能使用代理，必须配置完整 URL！

## 🏗️ 项目结构

```
.
├── src/
│   ├── pages/
│   │   └── restaurant/           # 餐厅页面
│   │       ├── index.tsx         # 主页面
│   │       └── components/       # 页面组件
│   │           ├── RestaurantHeader.tsx  # 餐厅头部
│   │           ├── DealCard.tsx          # 团购卡片
│   │           └──  DealList.tsx         # 团购列表（含性能监控）
│   ├── utils/
│   │   ├── http.ts               # HTTP 请求封装
│   │   └── url.ts                # URL 处理工具
│   ├── services/
│   │   └── shop.ts               # 商家和团购 API
│   ├── hooks/
│   │   ├── useCountdown.ts           # 倒计时 Hook
│   │   └── usePerformanceMetrics.ts  # 性能监控 Hook
│   ├── types/
│   │   ├── common.ts             # 通用类型
│   │   └── restaurant.ts         # 餐厅/团购类型
│   └── assets/                   # 静态资源
├── mock/
│   ├── server.cjs                # Mock API 服务器
│   └── data/
│       ├── shop.json             # 商家数据
│       └── products.json         # 团购商品数据
├── docs/                         # 📚 完整文档
│   ├── getting-started/          # 🚀 入门指南
│   ├── guides/                   # 📖 开发指南
│   └── troubleshooting/          # 🔧 问题排查
├── .env.local                    # 环境配置（需要手动配置）
├── env-template.txt              # 环境变量模板
└── setup-env.sh                  # 自动配置脚本
```

## ⚠️ 重要提示

### Lynx 真机环境特殊限制

1. **`window.location` 不可用**
   - 无法自动获取域名和端口
   - 必须通过 `.env.local` 配置完整 URL

2. **不能使用 `localhost`**
   - Lynx 中 `localhost` 指向设备本身
   - 必须使用真实 IP 地址

3. **Performance API 仅生产可用**
   - 开发环境 `performance` 是 `undefined`（正常现象）
   - 性能数据只在真实 Lynx 容器（如抖音 App）中收集

详见：[Lynx 网络请求问题总结](./docs/troubleshooting/Lynx网络请求问题总结.md)

## 🔧 常见问题

### Q: API 请求失败，报 HTTP 499 错误？

**A**: 请检查 `.env.local` 配置：
1. IP 地址是否正确（不能是 `localhost`）
2. 端口是否正确（后端 4000，前端 3000）
3. 是否重启了开发服务器

详见：[Lynx 真机调试说明](./docs/troubleshooting/Lynx真机调试说明.md)

### Q: 图片不显示？

**A**: 检查 `VITE_FRONTEND_URL` 配置是否正确，前端服务器是否运行。

### Q: Performance API 是 undefined？

**A**: 这是正常的！开发环境不支持 Performance API，只在生产环境（抖音 App）中可用。

详见：[Lynx Performance API FAQ](./docs/troubleshooting/Lynx-Performance-API-FAQ.md)

### Q: 修改了 `.env.local` 不生效？

**A**: 需要重启开发服务器（Ctrl+C 然后 `npm run dev`）。

## 🎯 开发检查清单

在开始开发前，请确认：

- [ ] 已安装依赖（`pnpm install`）
- [ ] 已配置 `.env.local`（运行 `./setup-env.sh` 或手动配置）
- [ ] IP 地址是真实 IP，不是 `localhost`
- [ ] 后端服务正在运行（端口 4000）
- [ ] 前端服务正在运行（端口 3000）
- [ ] 浏览器测试通过
- [ ] Lynx Explorer 测试通过（可选）

## 📦 构建和部署

```bash
# 构建生产版本
pnpm build

# 检查构建产物
ls -lh dist/main.lynx.bundle

# 部署到 CDN（根据实际情况）
# 在 Lynx 容器中访问：http://your-cdn.com/main.lynx.bundle
```

## 🔗 相关资源

- [Lynx 官方文档](https://lynxjs.org/zh/)
- [Lynx Performance API](https://lynxjs.org/zh/api/lynx-api/performance-api/)
- [项目完整文档](./docs/)

---

**Happy Coding!** 🎉