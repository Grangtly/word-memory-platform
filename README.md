# 词汇记忆 — 艾宾浩斯智能复习系统

基于艾宾浩斯遗忘曲线的自适应英语单词学习平台，200 个四六级核心词汇，支持智能复习调度、学习统计、测验模式。

> **在线地址**：https://word-memory-platform-production.up.railway.app/login

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | Vue 3 + Vite + Pinia + Vue Router + Axios |
| 后端 | Node.js + Express 5.x + JWT + bcryptjs |
| 数据库 | MongoDB Atlas (M0 免费集群) |
| 部署 | Railway (Dockerfile 多阶段构建) |
| 设计 | 暖调学院风 (Playfair Display + 奶油底 + 琥珀金) |

## 功能

| 功能 | 说明 |
|------|------|
| 📖 智能学习 | 遗忘曲线 9 级间隔，记住晋级、忘记重置 |
| 📊 学习统计 | 已学数/今日复习/掌握率/连续打卡天数 |
| 📋 单词列表 | 200 词浏览 + 状态筛选(未学/学习中/已掌握) |
| 🔥 每日打卡 | 有复习即算打卡，徽章显示连续天数 |
| 🎯 测验模式 | 5 道 4 选 1 选择题 + 自动评分 + 错题展示 |

## 快速开始

```bash
# 后端 (需要 MONGODB_URI 环境变量)
cd server && npm install && node index.js

# 前端
cd client && npm install && npm run dev
```

## 文档索引

| 文档 | 用途 |
|------|------|
| [CLAUDE.md](CLAUDE.md) | 架构说明（AI 助手使用） |
| [CHANGELOG.md](CHANGELOG.md) | 版本更新记录 (v0.1.0 → v0.5.1) |
| [项目计划.md](项目计划.md) | 原始计划 + 实际完成记录 |
| [task_plan.md](task_plan.md) | 分阶段任务跟踪 |
| [progress.md](progress.md) | 会话进度日志 + 测试结果 |
| [findings.md](findings.md) | 技术决策 + 踩坑记录 |
| [部署指南.md](部署指南.md) | Railway + UptimeRobot 部署步骤 |
| [MongoDB配置指南.md](MongoDB配置指南.md) | Atlas 集群配置 6 步走 |

## API 一览

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/register | 注册 |
| POST | /api/auth/login | 登录 |
| GET | /api/words/today | 今日待复习（或新词） |
| POST | /api/words/:id/review | 提交复习结果 |
| GET | /api/words/stats | 学习统计 |
| GET | /api/words/list | 全部单词 + 学习状态 |
| GET | /api/words/quiz | 生成测验题 |
| POST | /api/words/quiz | 提交测验答案 |
