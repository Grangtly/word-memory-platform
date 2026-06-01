# 更新日志

## [0.1.0] — 2026-05-25

### 新增：JSON 文件版后端

- **项目初始化** — npm 项目初始化，安装 express / cors / jsonwebtoken / bcryptjs
- **Express 入口** (`server/index.js`) — 挂载认证路由和单词路由，监听 3000 端口
- **认证系统** (`server/routes/auth.js`)
  - `POST /api/auth/register` — 用户注册，bcrypt 加密存储密码
  - `POST /api/auth/login` — 用户登录，返回 JWT Token（7 天有效期）
  - `authMiddleware` — Bearer Token 认证中间件
- **遗忘曲线算法** (`server/utils/schedule.js`)
  - 9 级复习间隔：5分钟 → 30分钟 → 12小时 → 1天 → 2天 → 4天 → 7天 → 15天 → 30天
  - 记住 → 晋级下一阶段；忘记 → 重置回第 0 阶段
- **单词学习 API** (`server/routes/words.js`)
  - `GET /api/words/today` — 优先返回待复习单词，无则返回 10 个新单词
  - `POST /api/words/:id/review` — 提交复习结果（记住/没记住），更新复习记录
- **单词库** (`server/data/words.json`) — 20 个常用英语单词，含音标、释义、例句

### 技术栈

| 组件 | 选型 |
|------|------|
| 运行时 | Node.js |
| 框架 | Express 5.x |
| 认证 | JWT + bcryptjs |
| 存储 | JSON 文件（临时方案） |
| 端口 | 3000 |

---

## [0.2.0] — 2026-05-25

### 新增：Vue 3 前端

- **项目初始化** — Vite + Vue 3 项目，安装 vue-router / axios / pinia
- **代理配置** (`client/vite.config.js`) — `/api` 代理到 `localhost:3000`
- **API 封装** (`client/src/api.js`)
  - Axios 实例，请求拦截器自动附加 JWT Token
  - 导出 `register()` / `login()` / `getTodayWords()` / `submitReview()`
- **Pinia Store** (`client/src/stores/user.js`) — token / username 状态管理，token 持久化到 localStorage
- **路由** (`client/src/router/index.js`)
  - `/login` → 登录页，`/home` → 首页，`/learn` → 学习页
  - `beforeEach` 守卫：未登录跳转登录页，已登录跳转首页
- **登录页** (`client/src/views/Login.vue`) — 登录/注册表单，错误提示，回车提交
- **首页** (`client/src/views/Home.vue`) — 欢迎信息，开始学习按钮，退出登录
- **学习页** (`client/src/views/Learn.vue`)
  - 单词卡片：英文、音标、释义、例句
  - 记住/没记住按钮 → 提交复习 → 自动切下一个
  - 全部完成显示"今日任务完成"

### 联调验证

- 注册 → 登录 → 获取单词 → 提交复习，全流程通过
- 前端 `npm run build` 构建成功

### 技术栈

| 组件 | 选型 |
|------|------|
| 框架 | Vue 3 + Vite |
| 路由 | Vue Router 4 |
| 状态 | Pinia |
| HTTP | Axios |
| 端口 | 5173（开发模式） |

### 下一步计划

- 升级 MongoDB 存储

---

## [0.3.0] — 2026-05-31

### 新增：Railway 部署上线

- **GitHub 仓库** — Grangtly/word-memory-platform，代码已推送
- **Dockerfile 多阶段构建** — 先构建 Vue 前端 `dist/`，再打包到服务端 `server/public/`
- **server/index.js 改造**
  - `PORT` 改用 `process.env.PORT \|\| 3000`（兼容 Railway 动态端口）
  - 新增静态文件托管 + SPA 路由回退（正则匹配，兼容 Express 5）
- **railway.toml** — 指定 `builder = "DOCKERFILE"` 构建
- **统一部署架构** — 一个 Railway 服务同时提供前端页面和后端 API，无需 Vercel
- **部署指南** (`部署指南.md`) — 更新为实际 Railway 部署流程 + 踩坑记录

### 部署踩坑记录

| 坑 | 原因 | 解决 |
|----|------|------|
| Wispbyte 找不到模块 | 文件路径层级不匹配 | 换 Railway |
| Railway nixpacks `$NIXPACKS_PATH` | 平台基础镜像 bug | 改用 Dockerfile |
| `railway.toml` 被拒 | `"docker"` 必须大写 | 改为 `"DOCKERFILE"` |
| Express 5 `app.get('*')` 崩溃 | path-to-regexp v8 不兼容 | 改用正则 |

---

## [0.4.0] — 2026-05-31

### 前端重设计：暖调学院风

- **字体**：Playfair Display（标题衬线）+ DM Sans（正文无衬线）
- **配色**：暖奶油底 #faf8f5 + 深海蓝 #2c3e6b + 琥珀金 #c8963e
- **三个页面**全面重写（Login / Home / Learn），卡片质感 + 过渡动画

### 新增功能

- **学习统计** (`GET /api/words/stats`)
  - 已学单词数 / 今日复习数 / 掌握率 / 连续打卡天数
  - 首页实时展示
- **单词列表** (`GET /api/words/list` + Words.vue)
  - 20 个单词学习状态一览（未学/学习中/已掌握）
  - 按状态筛选
- **每日打卡** (Home 页徽章)
  - 有复习记录即算打卡，显示连续天数
  - 算法：从今天往前扫描 lastReviewAt 连续性
- **测验模式** (`GET/POST /api/words/quiz` + Quiz.vue)
  - 优先从已学单词出题，4 选 1 选择题
  - 提交自动评分 + 展示错题
- **路由懒加载** — Words/Quiz 页面按需加载

---

## [0.5.0] — 2026-05-31

### 升级：MongoDB + Mongoose

- **MongoDB Atlas** — 免费 M0 集群，512MB，云端永久存储
- **数据模型** (`server/models/`)
  - `User.js` — username + bcrypt 密码
  - `Word.js` — word / phonetic / meaning / example
  - `Record.js` — userId + wordId (ObjectId 引用) + stage + 复习时间
- **路由改造**
  - `auth.js`：`readJSON/writeJSON` → `User.findOne()` / `User.create()`
  - `words.js`：手动数组过滤 → `Record.find().populate('wordId')` + 索引查询
  - 7 个 API 全部无缝迁移
- **自动种子** — 首次启动检测 Word 集合为空则自动导入 20 个单词
- **部署配置** — `MONGODB_URI` 环境变量 → Railway Variables

### 解决的核心问题

- **数据不丢失**：Railway 容器重建/重启不影响数据，MongoDB Atlas 独立存储
- **查询更高效**：索引 `{ userId, wordId }` 和 `{ userId, nextReviewAt }` 替代 JS 遍历
- **扩展性**：之后加功能改几行查询即可，不再需要手动过滤数组

### 踩坑记录

| 坑 | 解决 |
|----|------|
| Railway Variables 未读到 env | 确认加在服务级 Variables 里 |
| Atlas 连接被拒 (ECONNREFUSED) | Network Access 加 `0.0.0.0/0` |
| 连接字符串 `w=majority` 报错 | 去掉 query string，用干净 URI |

---

## [0.5.1] — 2026-05-31

### 新增：词库扩展 + 保活

- **词库扩至 200 词** — 覆盖四六级核心高频词汇
- **增量种子** — 按 word 字段查重，加新词不重复，不影响已有数据
- **UptimeRobot 保活** — 每 5 分钟 HTTP ping，解决 Railway 免费实例休眠问题，访问不再等待

### 项目最终状态

| 指标 | 值 |
|------|----|
| 词库 | 200 四六级核心词 |
| API | 7 个 |
| 页面 | 5 个（Login/Home/Learn/Words/Quiz） |
| 功能 | 学习/复习/统计/列表/打卡/测验 |
| 存储 | MongoDB Atlas M0 免费集群 |
| 部署 | Railway（Dockerfile 多阶段构建） |
| 保活 | UptimeRobot 每 5 分钟 |
| 设计 | 暖调学院风 |
