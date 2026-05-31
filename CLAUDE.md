# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述
基于艾宾浩斯遗忘曲线的自适应英语单词学习与智能复习系统。前端 Vue 3 + Vite，后端 Node.js + Express + MongoDB Atlas。设计风格：暖调学院风。

## 开发命令

```bash
# 后端 (需要 MONGODB_URI 环境变量)
cd server
npm install
node index.js                     # 启动后端 (port 3000)

# 前端
cd client
npm install
npm run dev                       # 启动前端 (port 5173, 代理 /api → 3000)
npm run build                     # 生产构建

# MongoDB 种子（自动，首次启动执行，或手动运行）
cd server
node seed.js
```

## 架构

```
https://xxx.up.railway.app
├── Express 5.x 后端
│   ├── db.js                       # MongoDB 连接
│   ├── models/User.js              # 用户模型 (username, password)
│   ├── models/Word.js              # 单词模型 (word, phonetic, meaning, example)
│   ├── models/Record.js            # 复习记录 (userId, wordId, stage, nextReviewAt)
│   ├── routes/auth.js              # 注册/登录 (JWT + bcryptjs)
│   ├── routes/words.js             # 7 个 API: today/review/stats/list/quiz
│   └── utils/schedule.js           # 遗忘曲线 9 级间隔
├── Vue 3 前端 (SPA, 暖调学院风)
│   ├── /login → Login.vue          # 登录/注册
│   ├── /home → Home.vue            # 统计 + 打卡 + 导航
│   ├── /learn → Learn.vue          # 单词卡片复习
│   ├── /words → Words.vue          # 200 词列表 + 状态筛选
│   └── /quiz → Quiz.vue            # 4 选 1 测验 + 自动评分
└── MongoDB Atlas (云端，M0 免费集群)
```

## 遗忘曲线算法

复习间隔：`[5分钟, 30分钟, 12小时, 1天, 2天, 4天, 7天, 15天, 30天]`
- 记住了 → stage+1（最大 8），nextReviewAt = now + intervals[nextStage]
- 没记住 → stage=0，nextReviewAt = now + 5分钟

## API 一览

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/register | 注册 |
| POST | /api/auth/login | 登录 |
| GET | /api/words/today | 今日待复习（或新词） |
| POST | /api/words/:id/review | 提交复习结果 |
| GET | /api/words/stats | 学习统计 + 打卡天数 |
| GET | /api/words/list | 全部单词 + 学习状态 |
| GET | /api/words/quiz | 生成测验题 |
| POST | /api/words/quiz | 提交测验答案 |

## 部署

- **Railway**：Dockerfile 多阶段构建，前后端一体
- **MongoDB Atlas**：M0 免费集群，MONGODB_URI 环境变量
- **UptimeRobot**：每 5 分钟保活，防止休眠
- **GitHub**：Grangtly/word-memory-platform

详见 `部署指南.md`、`MongoDB配置指南.md`。
