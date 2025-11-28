## douyin_search_lynx_exercise
抖音搜索培训营题目

## 使用方式

### 安装依赖
```bash
pnpm install
```

### 启动 Mock API 服务
```bash
node mock/server.cjs
```
Mock API 服务将在 `http://localhost:4000` 启动。

### 启动开发服务
```bash
pnpm run dev
```

开发服务已配置代理，所有 `/api` 请求会自动代理到 `http://localhost:4000`（见 `lynx.config.ts` 配置）。

## 项目简介

本项目是抖音搜索 / Lynx 工程师训练营的练习项目，基于 **Lynx + TypeScript** 实现了一组卡片类组件，包括餐厅信息卡片、优惠卡片以及横向滚动列表等，用于熟悉 Lynx 组件体系、样式能力以及组件拆分思路。

当前项目主要完成了：

- 基础页面搭建
- 餐厅头部信息卡片（`RestaurantHeader`）
- 单个优惠卡片组件（`DealCard`）
- 横向滚动优惠列表组件（`DealList`）
- 基于 TypeScript 的数据结构定义（`RestaurantInfo`、`DealItem` 等）

后续会在此基础上继续完善,根据笔记里面的规划,逐步填充项目

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
- 所有 `/api` 开头的请求会自动代理到 `http://localhost:4000`
- 确保在启动开发服务前先启动 Mock API 服务

---