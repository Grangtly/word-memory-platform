# 任务计划：艾宾浩斯遗忘曲线英语单词学习系统

## 目标
构建一个基于艾宾浩斯遗忘曲线的自适应英语单词学习与智能复习系统，支持注册登录、单词学习、智能复习调度。

## 当前阶段
全部完成 ✅

## 各阶段

### 阶段 1：JSON 文件版后端开发
- [x] 1.1 初始化项目 (npm init + 安装依赖)
- [x] 1.2 创建目录结构
- [x] 1.3 编写入口文件 index.js
- [x] 1.4 编写单词库 data/words.json
- [x] 1.5 编写工具函数 (readJSON/writeJSON)
- [x] 1.6 编写认证路由 routes/auth.js
- [x] 1.7 编写遗忘曲线算法 utils/schedule.js
- [x] 1.8 编写单词路由 routes/words.js
- [x] 1.9 后端自测
- **状态：** complete

### 阶段 2：Vue 3 前端开发
- [x] 2.1 初始化 Vite + Vue 3 项目 + 安装依赖
- [x] 2.2 配置代理 vite.config.js
- [x] 2.3 创建 API 封装 api.js
- [x] 2.4 创建 Pinia Store stores/user.js
- [x] 2.5 创建路由 router/index.js
- [x] 2.6 创建登录页 Login.vue
- [x] 2.7 创建学习页 Learn.vue
- [x] 2.8 创建首页 Home.vue
- [x] 2.9 修改 App.vue + main.js + 构建验证
- **状态：** complete

### 阶段 3：前后端联调
- [x] 3.1 启动后端 + 前端
- [x] 3.2 全流程测试（注册→登录→获取单词→提交复习）
- [x] 3.3 验证通过
- **状态：** complete

### 阶段 4：部署上线
- [x] 4.1 初始化 git + 推送 GitHub（Grangtly/word-memory-platform）
- [x] 4.2 尝试 Wispbyte → 放弃（文件上传路径不匹配）
- [x] 4.3 切换到 Railway，多次修复构建配置
  - nixpacks.toml → 失败（$NIXPACKS_PATH 平台 bug）
  - railway.json → 失败（同样 nixpacks 问题）
  - railway.toml builder="docker" → 失败（必须大写 DOCKERFILE）
  - railway.toml builder="DOCKERFILE" + 多阶段 Dockerfile → 成功
- [x] 4.4 统一前后端：Dockerfile 构建前端 dist + 复制到 server/public
- [x] 4.5 server/index.js 改造：PORT 环境变量 + 托管静态文件 + SPA 回退
- [x] 4.6 修复 Express 5 不兼容：`app.get('*')` → 正则匹配
- [x] 4.7 部署成功，一个 Railway 地址同时服务前后端
- **状态：** complete

### 阶段 4.5：新增功能（学习统计 + 单词列表 + 打卡 + 测验）
- [x] 后端：新增 4 个 API（stats / list / quiz GET / quiz POST）
- [x] 前端：Home.vue 统计面板 + 打卡徽章
- [x] 前端：Words.vue 单词列表 + 状态筛选
- [x] 前端：Quiz.vue 选择题测验 + 自动评分
- [x] 本地测试 + 构建验证 + 推 Railway 部署
- **状态：** complete

### 阶段 5：升级到 MongoDB
- [x] 5.1 安装 mongoose
- [x] 5.2 创建 db.js + 三个模型（User/Word/Record）
- [x] 5.3 重写 auth.js 使用 MongoDB
- [x] 5.4 重写 words.js 使用 MongoDB（7 个 API 全部改造）
- [x] 5.5 seed.js 种子脚本 + index.js 自动种子
- [x] 5.6 MongoDB Atlas 创建集群 + 配置白名单
- [x] 5.7 Railway 设置 MONGODB_URI + 部署验证
- **状态：** complete

### 阶段 5.5：词库扩展 + 保活
- [x] words.json 从 20 词 → 200 个四六级核心词汇
- [x] 种子改为增量模式（按 word 字段查重）
- [x] UptimeRobot 配置 5 分钟保活监控
- **状态：** complete

## 已做决策
| 决策 | 理由 |
|------|------|
| 先用 JSON 文件存储 | 快速跑通流程，无需安装数据库 |
| JWT 认证 | 无状态，适合前后端分离 |
| Vite 代理解决跨域 | 开发环境简单，无需额外配置 CORS |
| Railway 取代 Vercel+Wispbyte | Vercel 需手机验证，Wispbyte 部署失败；Railway 一个服务同时托管前后端更简单 |
| Dockerfile 多阶段构建 | Railway nixpacks 有 bug，Dockerfile 构建更可控 |
| 前端暖调学院风重设计 | 用户体验差，统一 Playfair Display + DM Sans + 奶油底琥珀金 |
| 测验从已学单词出题 | 避免用户遇到没学过的单词，保证测验有效性 |
| MongoDB Atlas 免费 M0 集群 | 512MB 免费，数据与容器分离，永久不丢 |
| 增量种子代替全量 | 后续加词不改已有数据，按 word 查重 |
| UptimeRobot 保活 | Railway 免费实例 15 分钟无请求就休眠，外部定时 ping 解决 |

## 遇到的错误
| 错误 | 尝试次数 | 解决方案 |
|------|---------|---------|
| Wispbyte 找不到 index.js | 2 | 上传方式不支持；换 Railway |
| Railway $NIXPACKS_PATH 报错 | 3 | nixpacks 平台 bug；改用 Dockerfile 构建 |
| railway.toml builder 值错误 | 1 | `"docker"` 改为 `"DOCKERFILE"` (必须大写) |
| Express 5 `app.get('*')` 崩溃 | 1 | 改用正则 `/^\/(?!api\/).*/` |
| Atlas 连接被拒 | 2 | Network Access 加 `0.0.0.0/0` |
| 连接字符串 `w=majority` 报错 | 1 | 去掉 query string |
| Railway 冷启动超慢 | 1 | UptimeRobot 每 5 分钟保活 |
