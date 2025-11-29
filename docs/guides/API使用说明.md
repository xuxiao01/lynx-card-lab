# 📡 API 调用说明

## 🎯 为什么这样封装？

### 问题
Lynx 框架对网络请求有严格限制：

1. **不支持相对路径**
   ```
   ❌ fetch('/api/xxx') → HTTP 499: unsupported URL
   ```

2. **不能使用 localhost**
   ```
   ❌ fetch('http://localhost:4000/api/xxx') → Could not connect
   ```

3. **必须使用完整 URL + 真实 IP**
   ```
   ✅ fetch('http://192.168.0.100:4000/api/xxx') → 成功
   ```

**核心原因**：Lynx 是移动端渲染框架，运行在独立的客户端设备上，`localhost` 指向设备自己，无法访问开发机器的服务器。

### 解决方案
我们封装了 `http.ts`，它会：

1. **智能判断环境**
   - 在 **Lynx 环境**：自动使用完整 URL + 真实 IP (`http://192.168.0.100:4000/api/xxx`)
   - 在 **浏览器环境**：使用相对路径 (`/api/xxx`)，通过代理访问

2. **统一错误处理**
   - 自动检查 HTTP 状态码
   - 自动检查业务状态码
   - 统一的错误提示

3. **类型安全**
   - 完整的 TypeScript 类型支持
   - 自动推导返回值类型

## 📁 文件结构

```
src/
├── utils/
│   └── http.ts         # HTTP 请求封装
├── services/
│   └── shop.ts         # 商家相关 API
└── types/
    ├── common.ts       # 通用类型
    └── restaurant.ts   # 餐厅/团购类型
```

## 🔧 使用方法

### 1. 基础用法

```typescript
import { getShops, getDeals } from '@/services/shop'

// 获取商家列表
const shops = await getShops()
console.log(shops) // RestaurantInfo[]

// 获取团购商品
const deals = await getDeals('1')
console.log(deals) // DealItem[]
```

### 2. 在 React 组件中使用

```typescript
import { useEffect, useState } from 'react'
import { getShops } from '../../services/shop'
import type { RestaurantInfo } from '../../types/restaurant'

export function RestaurantPage() {
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const shops = await getShops()
        setRestaurant(shops[0])
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <view><text>加载中...</text></view>
  }

  if (error) {
    return <view><text>错误: {error}</text></view>
  }

  return (
    <view>
      <text>{restaurant?.restaurantName}</text>
    </view>
  )
}
```

### 3. 直接使用 http 工具（自定义 API）

```typescript
import { get, post } from '@/utils/http'

// GET 请求
const response = await get<User[]>('/api/users', { page: 1, size: 10 })
console.log(response.data)

// POST 请求
const result = await post<Order>('/api/orders', { 
  productId: '123',
  quantity: 2 
})
console.log(result.data)
```

## 🔍 工作原理

### 环境检测与配置

`http.ts` 中的关键代码：

```typescript
function getBaseURL(): string {
  // 检测是否在 Lynx 环境中
  const isLynx = typeof __MAIN_THREAD__ !== 'undefined'
  
  if (isLynx) {
    // ✅ Lynx 环境：使用环境变量配置的完整 URL
    // 注意：Lynx 真机中 window.location 不可用，必须使用配置
    const apiHost = import.meta.env.VITE_API_HOST || 'http://192.168.0.100:4000'
    return apiHost
  } else {
    // ✅ 浏览器环境：使用相对路径，通过代理访问
    return ''
  }
}
```

**关键点**：
- ⚠️ **Lynx 真机限制**：`window.location` 不可用，必须使用环境变量
- ✅ **环境变量配置**：通过 `.env.local` 配置完整 URL
- ✅ **环境自动检测**：使用 `typeof __MAIN_THREAD__` 判断 Lynx 环境
- ✅ **默认值兜底**：配置缺失时使用默认 IP
- 🔒 **必须真实 IP**：Lynx 中不能用 `localhost`
- 🌐 **浏览器代理**：浏览器使用相对路径，通过代理转发

### 请求流程

```
┌─────────────────────────────────────────────┐
│  组件: getShops()                            │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  services/shop.ts                           │
│  get<RestaurantInfo[]>('/api/shops')        │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  utils/http.ts                              │
│  环境检测 + 构建完整 URL                     │
└────────────────┬────────────────────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
      ▼                     ▼
┌────────────┐       ┌────────────┐
│ Lynx 环境   │       │ 浏览器环境  │
│ 完整 URL    │       │ 相对路径    │
└─────┬──────┘       └─────┬──────┘
      │                     │
      ▼                     ▼
┌────────────┐       ┌────────────┐
│ 直接访问    │       │ 通过代理    │
│ 后端服务器  │       │ 访问后端    │
└────────────┘       └────────────┘
```

## ✅ 优势

### 相比直接使用 fetch

❌ **直接使用 fetch**:
```typescript
// 在 Lynx 中会报错
const res = await fetch('/api/shops')
const data = await res.json()

// 每次都要处理错误
if (!res.ok) {
  throw new Error('...')
}
if (data.code !== 200) {
  throw new Error('...')
}
```

✅ **使用封装的 http**:
```typescript
// 自动适配环境，统一错误处理
const shops = await getShops()
// 直接使用数据，类型安全
```

### 相比 axios

✅ **不需要额外依赖**
- 项目中没有安装 axios
- fetch 是原生 API，更轻量
- 对 Lynx 环境更友好

✅ **更简单**
- 不需要创建实例
- 不需要配置拦截器
- 代码更少，维护更简单

## 🌍 环境配置

### 开发环境

⚠️ **必须配置环境变量**

由于 Lynx 真机环境中 `window.location` 不可用，必须通过 `.env.local` 配置：

**快速配置**：

```bash
# 方法 1：自动配置（推荐）
./setup-env.sh

# 方法 2：手动创建
cp env-template.txt .env.local
# 然后编辑 .env.local，替换为你的 IP
```

**配置内容**：

```bash
# 后端 API 地址（完整 URL）
VITE_API_HOST=http://192.168.0.100:4000

# 前端服务器地址（完整 URL，用于静态资源）
VITE_FRONTEND_URL=http://192.168.0.100:3000
```

**注意事项**：
- ✅ 必须使用真实 IP，不能用 `localhost`
- ✅ 必须包含完整 URL（协议 + IP + 端口）
- ✅ 修改后需要重启开发服务器
- ✅ IP 变化时重新运行 `./setup-env.sh`

详见：`环境变量配置说明.md` 和 `快速开始.md`

### 生产环境

生产环境同样需要配置环境变量（根据实际部署环境）：

```bash
VITE_API_HOST=https://api.example.com
VITE_FRONTEND_URL=https://cdn.example.com
```

## 🎯 总结

### Lynx 网络请求的关键点

1. **不能用相对路径**：必须是完整 URL
2. **不能用 localhost**：必须用真实 IP
3. **代理不起作用**：Lynx 运行在客户端，不经过开发服务器

详细原因和解决方案，请查看 `Lynx网络请求问题总结.md`

### 为什么要封装 http.ts？

✅ **应该封装 http.ts**（已实现）
- 自动检测 Lynx/浏览器环境
- 自动使用正确的 URL 格式
- 统一错误处理
- 类型安全
- 不需要额外依赖

❌ **不需要 axios**
- 项目中没有安装
- fetch 足够轻量
- 封装已解决所有问题

### 现在你可以

1. ✅ 使用 `getShops()` 获取商家数据
2. ✅ 使用 `getDeals()` 获取团购数据
3. ✅ 使用 `http.get/post` 调用其他 API
4. ✅ 代码自动适配 Lynx 和浏览器环境
5. ✅ 完整的 TypeScript 类型支持
6. ✅ 静态资源路径自动处理

**环境检测 + 智能适配 = 完美的跨端解决方案！** 🎉

### 相关文档

- **`Lynx网络请求问题总结.md`** - 完整的问题分析和解决方案
- **`环境变量配置说明.md`** - 自动获取域名的原理和可选配置
- **`API使用说明.md`** (本文档) - API 使用方法和最佳实践

