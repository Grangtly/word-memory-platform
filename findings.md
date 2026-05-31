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

## 资源
- 项目计划详见 `项目计划.md`
- 架构说明详见 `CLAUDE.md`
- GitHub: Grangtly/word-memory-platform
