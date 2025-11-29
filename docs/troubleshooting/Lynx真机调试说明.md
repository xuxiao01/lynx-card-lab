# Lynx 真机调试说明

## 🐛 问题描述

在 Lynx Explorer 真机中加载 bundle 时，所有 API 请求都报错：
```
Error: HTTP 499 unsupported URL
```

**根本原因**：
- Lynx 真机环境中，`window` 和 `window.location` 都不可用
- 代码尝试通过 `window.location` 自动获取域名，导致拼接出非法 URL
- 例如：`lynx://xxxx:4000/api/shops` 或 `undefined:4000/api/shops`

## ✅ 解决方案

### 1. 修复 HTTP 请求（`src/utils/http.ts`）

**问题代码**：
```typescript
// ❌ 依赖 window.location，在真机中不可用
const { protocol, hostname } = window.location
return `${protocol}//${hostname}:${backendPort}`
```

**修复后**：
```typescript
// ✅ 直接使用配置的完整 URL
const apiHost = import.meta.env.VITE_API_HOST || 'http://192.168.0.100:4000'
return apiHost
```

### 2. 修复图片 URL（`src/utils/url.ts`）

**问题代码**：
```typescript
// ❌ 依赖 window.location
const { protocol, hostname, port } = window.location
```

**修复后**：
```typescript
// ✅ 直接使用配置的前端服务器地址
const frontendURL = import.meta.env.VITE_FRONTEND_URL || 'http://192.168.0.100:3000'
```

### 3. 环境变量配置（`.env.production`）

创建 `.env.production` 文件：

```bash
# 后端 API 地址（必须是完整 URL）
VITE_API_HOST=http://192.168.0.100:4000

# 前端服务器地址（用于静态资源）
VITE_FRONTEND_URL=http://192.168.0.100:3000
```

**注意**：
- ✅ 必须使用真实 IP（192.168.0.100）
- ❌ 不能使用 localhost
- ✅ 必须包含完整的协议和端口

## 🚀 构建和调试流程

### 步骤 1: 启动后端服务器

```bash
node mock/server.cjs
```

应该看到：
```
Mock API 运行在 http://localhost:4000
局域网访问: http://192.168.0.100:4000
```

**验证后端**：
```bash
curl http://192.168.0.100:4000/api/shops
# 应该返回 JSON 数据
```

### 步骤 2: 启动前端开发服务器

```bash
npm run dev
```

记下端口号（通常是 3000 或 3001）

**验证前端**：
```bash
# 访问 bundle
curl http://192.168.0.100:3000/main.lynx.bundle
# 应该可以下载 bundle 文件

# 访问静态资源
curl http://192.168.0.100:3000/static/image/default-cover.72a863cc.png
# 应该可以下载图片
```

### 步骤 3: 构建生产版本

```bash
pnpm build
```

检查构建产物：
```bash
ls -lh dist/main.lynx.bundle
# 应该看到约 114KB 的文件
```

### 步骤 4: 在 Lynx Explorer 中加载

1. 打开 Lynx Explorer App
2. 输入 bundle URL：
   ```
   http://192.168.0.100:3000/main.lynx.bundle
   ```
3. 点击加载

### 步骤 5: 查看调试日志

在 Lynx Explorer 的控制台中，应该看到：

```
[HTTP] Lynx 环境检测:
  - API Host: http://192.168.0.100:4000
  - 环境: 生产

[HTTP] 请求信息:
  - baseURL: http://192.168.0.100:4000
  - path: /api/shops
  - fullURL: http://192.168.0.100:4000/api/shops

✅ 获取餐厅数据成功！
```

## 🔍 常见问题排查

### Q1: 仍然报错 "HTTP 499 unsupported URL"

**检查清单**：

1. **检查 URL 格式**：
   ```javascript
   // 在控制台查看
   console.log('[HTTP] fullURL:', fullURL)
   
   // ✅ 正确：http://192.168.0.100:4000/api/shops
   // ❌ 错误：lynx://..., undefined:4000, http://192.168.0.100:3000
   ```

2. **检查环境变量**：
   ```bash
   # 查看构建时的环境变量
   cat .env.production
   ```

3. **重新构建**：
   ```bash
   # 清理并重新构建
   rm -rf dist
   pnpm build
   ```

### Q2: API 请求返回 404 或连接失败

**检查后端服务器**：

```bash
# 1. 检查后端是否运行
curl http://192.168.0.100:4000/api/shops

# 2. 检查端口是否监听 0.0.0.0
lsof -i :4000
# 应该看到 node 进程监听 *:4000

# 3. 检查防火墙
# macOS: 系统偏好设置 -> 安全性与隐私 -> 防火墙
```

### Q3: 图片无法显示

**检查静态资源**：

```bash
# 1. 检查图片路径
curl http://192.168.0.100:3000/static/image/default-cover.72a863cc.png

# 2. 查看控制台日志
[URL] 前端服务器地址: http://192.168.0.100:3000
处理后的图片路径: http://192.168.0.100:3000/static/image/xxx.png
```

### Q4: 不同开发者的 IP 不同怎么办？

**方案 1：每个人配置自己的 .env.production**

```bash
# .env.production（添加到 .gitignore）
VITE_API_HOST=http://YOUR_IP:4000
VITE_FRONTEND_URL=http://YOUR_IP:3000
```

**方案 2：使用脚本自动获取 IP**

创建 `scripts/get-ip.sh`:
```bash
#!/bin/bash
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
echo "VITE_API_HOST=http://$IP:4000" > .env.production
echo "VITE_FRONTEND_URL=http://$IP:3000" >> .env.production
echo "已生成 .env.production，IP: $IP"
```

使用：
```bash
chmod +x scripts/get-ip.sh
./scripts/get-ip.sh
pnpm build
```

## 📝 关键配置文件

### 1. `.env.production`

```bash
VITE_API_HOST=http://192.168.0.100:4000
VITE_FRONTEND_URL=http://192.168.0.100:3000
```

### 2. `mock/server.cjs`

```javascript
// 必须监听 0.0.0.0，允许局域网访问
app.listen(4000, '0.0.0.0', () => {
  console.log('Mock API 运行在 http://localhost:4000')
  console.log('局域网访问: http://192.168.0.100:4000')
})
```

### 3. `src/utils/http.ts`

```typescript
// 不依赖 window.location，直接使用环境变量
const apiHost = import.meta.env.VITE_API_HOST || 'http://192.168.0.100:4000'
return apiHost
```

## ✅ 验证成功的标志

1. **后端正常**：
   ```
   ✅ curl http://192.168.0.100:4000/api/shops 返回 JSON
   ```

2. **前端正常**：
   ```
   ✅ curl http://192.168.0.100:3000/main.lynx.bundle 可下载
   ✅ curl http://192.168.0.100:3000/static/image/xxx.png 可下载
   ```

3. **Lynx 真机正常**：
   ```
   ✅ 控制台显示正确的 fullURL
   ✅ API 请求成功
   ✅ 数据正常显示
   ✅ 图片正常加载
   ```

## 🎯 总结

**核心问题**：Lynx 真机中 `window` 不可用

**解决方案**：
1. 移除对 `window.location` 的依赖
2. 使用环境变量配置完整 URL
3. 在代码中添加详细日志便于调试

**关键点**：
- ✅ 使用真实 IP，不用 localhost
- ✅ 使用完整 URL（协议 + IP + 端口）
- ✅ 后端监听 0.0.0.0
- ✅ 检查防火墙设置

