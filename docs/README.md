# 📚 Lynx 项目文档

## 目录结构

```
docs/
├── getting-started/     # 🚀 入门指南
├── guides/              # 📖 开发指南
└── troubleshooting/     # 🔧 问题排查
```

## 🚀 入门指南 (getting-started/)

新手入门，从这里开始！

1. **[快速开始](./getting-started/快速开始.md)** ⭐ **推荐首读**
   - 快速配置和启动项目
   - 环境配置步骤
   - 浏览器和 Lynx Explorer 测试
   - 常见问题快速解决

2. **[配置完成总结](./getting-started/配置完成总结.md)**
   - 已完成的配置清单
   - 文档导航和索引
   - 验证清单
   - 常用命令参考

3. **[环境变量配置说明](./getting-started/环境变量配置说明.md)**
   - 为什么需要环境变量？
   - 配置方法和优先级
   - 自动配置 vs 手动配置
   - 常见问题解答

## 📖 开发指南 (guides/)

深入了解项目的功能和实现。

1. **[API 使用说明](./guides/API使用说明.md)**
   - HTTP 请求封装原理
   - 如何调用 API
   - 环境检测和配置
   - 类型安全的 API 调用

2. **[性能监控说明](./guides/性能监控说明.md)**
   - 性能监控集成方法
   - `__lynx_timing_flag` 使用
   - `usePerformanceMetrics` Hook
   - 性能数据解读

3. **[Performance API 详细说明](./guides/Performance-API-说明.md)**
   - Performance API 完整介绍
   - 工作流程详解
   - 配置验证方法
   - 生产环境部署

## 🔧 问题排查 (troubleshooting/)

遇到问题？这里有答案。

1. **[Lynx 真机调试说明](./troubleshooting/Lynx真机调试说明.md)**
   - 真机环境配置
   - 常见错误和解决方案
   - URL 构建问题
   - window.location 不可用问题

2. **[Lynx 网络请求问题总结](./troubleshooting/Lynx网络请求问题总结.md)**
   - 为什么 `localhost` 不能用？
   - HTTP 499 错误解决
   - 代理配置问题
   - 完整的问题排查流程

3. **[Lynx Performance API 常见问题](./troubleshooting/Lynx-Performance-API-FAQ.md)** ⭐ **重要**
   - 为什么 Performance API 是 undefined？
   - 开发环境 vs 生产环境
   - 配置验证方法
   - 常见误解纠正

## 📋 快速导航

### 我是新手，从哪里开始？

```
1. 📖 快速开始.md          ← 从这里开始！
2. 📖 环境变量配置说明.md
3. 📖 API使用说明.md
```

### 遇到网络请求问题？

```
1. 🔧 Lynx网络请求问题总结.md
2. 🔧 Lynx真机调试说明.md
```

### Performance API 不可用？

```
1. 🔧 Lynx-Performance-API-FAQ.md  ← 常见问题
2. 📖 Performance-API-说明.md      ← 详细说明
```

### 想了解某个功能的实现？

```
1. 📖 API使用说明.md       ← HTTP 请求封装
2. 📖 性能监控说明.md      ← 性能监控集成
```

## 🎯 推荐阅读顺序

### 第一天：环境配置

1. ✅ [快速开始](./getting-started/快速开始.md)
2. ✅ [环境变量配置说明](./getting-started/环境变量配置说明.md)
3. ✅ [配置完成总结](./getting-started/配置完成总结.md)

### 第二天：功能开发

1. ✅ [API 使用说明](./guides/API使用说明.md)
2. ✅ [性能监控说明](./guides/性能监控说明.md)

### 遇到问题时：

1. 🔧 先查看 [Lynx 网络请求问题总结](./troubleshooting/Lynx网络请求问题总结.md)
2. 🔧 再查看 [Lynx 真机调试说明](./troubleshooting/Lynx真机调试说明.md)
3. 🔧 Performance API 问题查看 [FAQ](./troubleshooting/Lynx-Performance-API-FAQ.md)

## 🔗 外部资源

- [Lynx 官方文档](https://lynxjs.org/zh/)
- [Lynx Performance API](https://lynxjs.org/zh/api/lynx-api/performance-api/)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [React 官方文档](https://react.dev/)

## 💡 提示

- 📌 带 ⭐ 标记的是重点文档，建议优先阅读
- 📌 所有文档都包含实际代码示例和最佳实践
- 📌 遇到问题先查看"问题排查"分类下的文档
- 📌 配置问题 90% 都可以在"入门指南"中找到答案

## 🤝 贡献

如果你发现文档有问题或需要补充，欢迎提出建议！

