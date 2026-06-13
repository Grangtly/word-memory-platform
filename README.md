# 忆词 (YiCi) — 基于艾宾浩斯遗忘曲线的英语单词学习平台

一个**永久免费**、**无需安装**、基于**科学记忆算法**的在线英语单词学习与智能复习系统。

![Tech Stack](https://img.shields.io/badge/Frontend-Vue%203-4FC08D?logo=vue.js)
![Tech Stack](https://img.shields.io/badge/Backend-Express%205-000000?logo=express)
![Tech Stack](https://img.shields.io/badge/DB-MongoDB%20Atlas-47A248?logo=mongodb)
![Deployment](https://img.shields.io/badge/Deploy-Railway-0B0D0E?logo=railway)
![License](https://img.shields.io/badge/License-MIT-green)

**在线地址**：[word-memory-platform-production.up.railway.app](https://word-memory-platform-production.up.railway.app)

---

## 核心特色

- 🧠 **科学算法** — 9 级艾宾浩斯遗忘曲线（5 分钟 → 30 天），记住晋级、忘记重置
- 💰 **永久免费** — 全部核心功能免费，无付费墙，无广告
- 🌐 **无需安装** — 浏览器打开即用，手机/电脑/平板全适配
- 🔓 **算法透明** — 9 级间隔表完全公开，代码开源可审查
- 🎨 **暖调学院风** — Playfair Display + DM Sans，奶油底 + 深海蓝 + 琥珀金配色

---

## 功能模块

| 功能 | 说明 |
|------|------|
| **智能学习** | 自动推送今日该复习的单词，卡片式交互（记住/忘了） |
| **学习统计** | 已学数量、掌握率、今日复习数、连续打卡天数 |
| **单词列表** | 270 个四六级核心词，标注未学/学习中/已掌握状态 |
| **每日打卡** | 有复习即自动打卡，连续天数可视化激励 |
| **测验模式** | 四选一选择题，自动评分，错题展示 |

---

## 技术架构

```
Browser (SPA)
    ↓
Express 5.x Backend (API + Static)
    ├── JWT 认证 (bcryptjs)
    ├── 9级遗忘曲线复习调度算法
    ├── Mongoose ODM
    └── Static Files (Vue 3 SPA)
         ↓
    MongoDB Atlas (M0 Free Tier)
```

| 层级 | 技术选型 |
|------|----------|
| **前端** | Vue 3 (Composition API) + Vite + Pinia + Vue Router 4 + Axios |
| **后端** | Node.js + Express 5.x + JWT + bcryptjs |
| **数据库** | MongoDB Atlas M0 (免费云集群, 512MB) |
| **部署** | Railway + Dockerfile 多阶段构建 |
| **设计** | 暖调学院风 — Playfair Display + DM Sans |

---

## 遗忘曲线算法

基于认知心理学艾宾浩斯遗忘曲线理论，实现 9 级自适应复习调度：

| Stage | 间隔 | 说明 |
|-------|------|------|
| 0 | 5 分钟 | 首次学习 / 忘记后重置 |
| 1 | 30 分钟 | |
| 2 | 12 小时 | |
| 3 | 1 天 | |
| 4 | 2 天 | |
| 5 | 4 天 | 达到此级 → 判定为"已掌握" |
| 6 | 7 天 | |
| 7 | 15 天 | |
| 8 | 30 天 | 最长间隔 |

- ✅ **记住了** → `stage + 1`，下次复习间隔按上表递增
- ❌ **忘了** → `stage = 0`，5 分钟后重新复习

---

## 本地开发

### 前置条件

- Node.js 18+
- MongoDB Atlas 账号（免费 M0 集群）或本地 MongoDB

### 环境变量

创建 `server/.env`：

```bash
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/word-memory
JWT_SECRET=your-secret-key
```

### 启动后端

```bash
cd server
npm install
node index.js          # 监听 http://localhost:3000
```

### 启动前端

```bash
cd client
npm install
npm run dev            # 监听 http://localhost:5173，API 代理到 3000
```

### 生产构建

```bash
cd client
npm run build          # 输出到 dist/
```

---

## API 一览

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| POST | `/api/auth/register` | — | 用户注册 |
| POST | `/api/auth/login` | — | 用户登录，返回 JWT |
| GET | `/api/words/today` | Bearer Token | 获取今日待复习/新词 |
| POST | `/api/words/:id/review` | Bearer Token | 提交复习结果 |
| GET | `/api/words/stats` | Bearer Token | 学习统计 + 打卡天数 |
| GET | `/api/words/list` | Bearer Token | 全部单词 + 学习状态 |
| GET | `/api/words/quiz` | Bearer Token | 生成测验题 |
| POST | `/api/words/quiz` | Bearer Token | 提交测验答案 |

---

## 项目结构

```
├── server/
│   ├── index.js              # Express 入口
│   ├── db.js                 # MongoDB 连接
│   ├── seed.js               # 词库种子脚本
│   ├── models/
│   │   ├── User.js           # 用户模型
│   │   ├── Word.js           # 单词模型
│   │   └── Record.js         # 复习记录模型
│   ├── routes/
│   │   ├── auth.js           # 认证路由
│   │   └── words.js          # 单词/复习/统计/测验路由
│   ├── utils/
│   │   └── schedule.js       # 遗忘曲线算法
│   └── data/
│       └── words.json        # 270 四六级核心词库
├── client/
│   └── src/
│       ├── views/
│       │   ├── Login.vue     # 登录/注册
│       │   ├── Home.vue      # 首页仪表盘
│       │   ├── Learn.vue     # 单词卡片学习
│       │   ├── Words.vue     # 单词列表
│       │   └── Quiz.vue      # 测验模式
│       ├── stores/user.js    # Pinia 用户状态
│       ├── router/index.js   # 路由 + 认证守卫
│       ├── api.js            # Axios API 封装
│       └── style.css         # 全局样式系统
├── Dockerfile                # 多阶段构建
└── railway.toml              # Railway 部署配置
```

---

## License

MIT © YiCi
