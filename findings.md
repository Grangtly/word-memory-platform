# 发现与决策

## 需求
- 基于艾宾浩斯遗忘曲线的自适应单词复习系统
- 用户注册登录 → 每日获取待复习单词 → 标记记住/没记住 → 算法调度下次复习时间
- 先用 JSON 文件存储，后升级 MongoDB

## 技术决策

| 决策 | 理由 |
|------|------|
| Express 5.x（实际安装） | npm 默认装最新版 5.2.1，API 与 4.x 基本兼容 |
| JWT (jsonwebtoken) | 无状态认证，适合 API 服务 |
| bcryptjs | 纯 JS 实现，无需编译，跨平台兼容 |
| 复习间隔 9 级 | 5分钟→30天，覆盖短期到长期记忆 |
| Railway 一个服务同时托管前后端 | 免去 Vercel 手机验证和双平台维护成本 |
| Dockerfile 多阶段构建 | Railway nixpacks 有 $NIXPACKS_PATH bug，Dockerfile 更可控 |

## 部署踩坑记录

| 问题 | 现象 | 根本原因 | 解决方案 |
|------|------|---------|---------|
| Wispbyte 找不到模块 | `MODULE_NOT_FOUND /home/container/index.js` | 文件上传到容器时路径层级不对 | 放弃 Wispbyte，换 Railway |
| Railway nixpacks 报错 | `UndefinedVar $NIXPACKS_PATH` | Railway 的 nixpacks 基础镜像有 bug | 改用 Dockerfile 构建 |
| Express 5 通配符崩溃 | `Missing parameter name at index 1: *` | Express 5 path-to-regexp v8 不再支持 `*` | 改用正则 `/^\/(?!api\/).*/` |
| railway.toml builder 值 | 配置被拒绝解析 | Railway 要求 `DOCKERFILE` 必须大写 | `"docker"` → `"DOCKERFILE"` |

## 实际部署架构

```
用户浏览器 → https://xxx.up.railway.app
  ├── /api/auth/*  → Express 后端 API
  ├── /api/words/* → Express 后端 API
  └── /*           → Vue 前端静态文件 (SPA)
```

- 前后端同一域名，前端 `api.js` 的 baseURL 用 `/api` 相对路径即可
- 不再需要 VITE_API_URL 环境变量
- 不再需要 Vercel

## MongoDB 升级决策

| 决策 | 理由 |
|------|------|
| Mongoose (非原生 driver) | Schema 定义清晰，populate 自动联表，代码量少一半 |
| wordId 用 ObjectId 引用 | 联表查询直接 `populate('wordId')`，不用手动 join |
| 自动种子代替手动 seed | 免去部署后额外操作，开箱即用 |
| MONGODB_URI 环境变量 | 本地/生产切换灵活，连接串不写死在代码里 |
| 单纯 URI 不加 query string | `w=majority` 等参数在某些 mongoose 版本报解析错误 |

## 项目最终架构

```
https://xxx.up.railway.app
├── Express 5.x 后端
│   ├── routes/auth.js → User 模型 (MongoDB)
│   ├── routes/words.js → Word/Record 模型 (MongoDB)
│   └── utils/schedule.js (遗忘曲线)
├── Vue 3 前端 (SPA)
│   ├── Login / Home / Learn / Words / Quiz
│   └── api.js → /api/*
└── MongoDB Atlas (云端，独立于容器)
```

## 新增功能设计决策

| 决策 | 理由 |
|------|------|
| 连续打卡用 lastReviewAt 扫描 | 不需要额外存储打卡记录，从现有复习记录推导 |
| 测验从已学单词出题 | 避免用户遇到没见过的单词，保证测验有效性 |
| 掌握率阈值 stage >= 3 | stage 3=1天间隔，说明已进入中期记忆 |
| 路由懒加载 Words/Quiz | 减少首屏 JS 体积，首页加载更快 |

## 资源
- 项目计划详见 `项目计划.md`
- 架构说明详见 `CLAUDE.md`
- GitHub: Grangtly/word-memory-platform
