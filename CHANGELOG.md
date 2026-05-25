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

- 部署上线（后端 Railway/Render，前端 Vercel/Netlify）
- 升级 MongoDB 存储
