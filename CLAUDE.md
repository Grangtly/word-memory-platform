# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述
基于艾宾浩斯遗忘曲线的自适应英语单词学习与智能复习系统。前端 Vue 3 + Vite，后端 Node.js + Express，先用 JSON 文件存储，后升级 MongoDB + Mongoose。

## 开发命令

```bash
# 后端
cd server
npm install
node index.js                    # 启动后端 (port 3000)

# 前端
cd client
npm install
npm run dev                      # 启动前端 (port 5173, 代理 /api → 3000)
npm run build                    # 生产构建

# MongoDB 种子脚本（第五阶段）
cd server
node seed.js
```

## 架构

```
项目根目录/
├── server/                      # Express 后端
│   ├── index.js                 # 入口：Express + cors + json + 挂载路由
│   ├── routes/
│   │   ├── auth.js              # POST /api/auth/register, /api/auth/login, authMiddleware
│   │   └── words.js             # GET /api/words/today, POST /api/words/:id/review
│   ├── utils/
│   │   └── schedule.js          # 遗忘曲线算法：calculateNextReview(stage, remembered)
│   └── data/
│       ├── words.json           # 单词库 [{id, word, phonetic, meaning, example}]
│       ├── users.json           # 用户数据
│       └── records.json         # 学习记录 [{userId, wordId, stage, nextReviewAt, reviewCount}]
└── client/                      # Vue 3 前端
    ├── src/
    │   ├── api.js               # Axios 实例 + 拦截器 (baseURL: /api)
    │   ├── stores/user.js       # Pinia：token, username, login(), logout()
    │   ├── router/index.js      # /login → /home → /learn, beforeEach 鉴权
    │   └── views/
    │       ├── Login.vue        # 登录 + 注册表单
    │       ├── Home.vue         # 首页：统计 + 开始学习 + 退出
    │       └── Learn.vue        # 单词卡片：记住/没记住 → 提交复习
    └── vite.config.js           # proxy /api → localhost:3000
```

## 遗忘曲线算法

复习间隔：`[5分钟, 30分钟, 12小时, 1天, 2天, 4天, 7天, 15天, 30天]`
- 记住了 → stage+1，nextReviewAt = now + intervals[stage+1]
- 没记住 → stage=0，nextReviewAt = now + 5分钟

## 数据流

1. 用户登录 → JWT token 存入 Pinia + localStorage
2. GET /api/words/today → 后端查 records.json 找待复习单词，无则返回 10 个新单词
3. POST /api/words/:id/review → 调用 schedule.js 更新/创建记录
4. 前端 Axios 拦截器自动带 Authorization header

## 开发阶段

1. JSON 版后端（先做）→ 2. Vue 3 前端 → 3. 联调 → 4. 部署 → 5. 升级 MongoDB

详见 `项目计划.md`。
