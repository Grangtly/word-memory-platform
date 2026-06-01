# 进度日志

## 会话：2026-05-25

### 阶段 1：JSON 文件版后端开发
- **状态：** complete
- **开始时间：** 2026-05-25 22:15
- **完成时间：** 2026-05-25 22:25
- 执行的操作：
  - 创建 CLAUDE.md 架构文档
  - 创建 task_plan.md / findings.md / progress.md 规划文件
  - npm init + 安装 express cors jsonwebtoken bcryptjs
  - 创建完整目录结构 server/{routes,data,utils}
  - 编写 20 个单词的单词库 words.json
  - 编写遗忘曲线算法 schedule.js（9 级间隔）
  - 编写认证路由 auth.js（注册/登录/JWT 中间件）
  - 编写单词路由 words.js（获取今日单词/提交复习）
  - 编写入口文件 index.js
  - 7 个接口全部自测通过
- 创建/修改的文件：
  - CLAUDE.md, task_plan.md, findings.md, progress.md
  - server/package.json, server/index.js
  - server/routes/auth.js, server/routes/words.js
  - server/utils/schedule.js
  - server/data/words.json, users.json, records.json

## 测试结果
| 测试 | 输入 | 预期结果 | 实际结果 | 状态 |
|------|------|---------|---------|------|
| 注册 | test/123456 | 注册成功 | 注册成功 | ✅ |
| 重复注册 | test/123456 | 用户名已存在 | 用户名已存在 | ✅ |
| 登录 | test/123456 | 返回 token | 返回 JWT token | ✅ |
| 获取单词 | 带 token | 返回 10 个新单词 | 返回 10 个单词 type:new | ✅ |
| 记住复习 | wordId=1, true | 保存记录 stage=1 | stage=1 保存成功 | ✅ |
| 忘记复习 | wordId=2, false | 保存记录 stage=0 | stage=0 保存成功 | ✅ |
| 无认证访问 | 不带 token | 未登录 | 未登录 401 | ✅ |

## 五问重启检查
| 问题 | 答案 |
|------|------|
| 我在哪里？ | 阶段 1 完成，准备进入阶段 2 |
| 我要去哪里？ | 阶段 2：Vue 3 前端开发 |
| 目标是什么？ | 构建基于遗忘曲线的单词学习复习系统 |
| 我学到了什么？ | Railway 部署踩坑；暖调学院风设计；测验算法从已学单词出题 |
| 我做了什么？ | 后端 + 前端 + 联调 + 部署 + 4 个新功能 + 前端重设计 |

## 五问重启检查
| 问题 | 答案 |
|------|------|
| 我在哪里？ | 阶段 4.5 完成，准备进入阶段 5 |
| 我要去哪里？ | 阶段 5：升级到 MongoDB |
| 目标是什么？ | 构建基于遗忘曲线的单词学习复习系统 |
| 我学到了什么？ | 见 findings.md |
| 我做了什么？ | 7 API + 5 页面 + 暖调学院风设计 + Railway 部署 |

## 会话：2026-05-31

### 阶段 4：部署上线
- **状态：** complete
- **开始时间：** 2026-05-31
- **完成时间：** 2026-05-31
- 执行的操作：
  - 创建 GitHub 仓库 Grangtly/word-memory-platform，推送代码
  - 尝试 Wispbyte 部署 → 文件上传路径问题，放弃
  - 注册 Railway，GitHub 导入仓库
  - Railway nixpacks 构建反复报 $NIXPACKS_PATH → 创建 nixpacks.toml/railway.json 无效 → 确认是 Railway 平台 bug
  - 换 Dockerfile 方案：创建多阶段 Dockerfile（先编 client 再编 server）
  - 修改 server/index.js：PORT 环境变量 + 托管 public/ 静态文件 + SPA 正则回退
  - railway.toml builder 写错 "docker" → 改为 "DOCKERFILE"
  - 客户端 Dockerfile 损坏 → Express 5 `app.get('*')` 不兼容 → 改正则
  - 部署成功：前后端统一在 Railway 一个服务
- 创建/修改的文件：
  - Dockerfile, railway.toml, client/Dockerfile
  - server/index.js（PORT + 静态托管 + SPA 回退）
  - nixpacks.toml, railway.json（过程中创建→后续删除）

### 阶段 5：MongoDB 升级
- **状态：** complete
- **完成时间：** 2026-05-31 15:30
- 执行的操作：安装 mongoose + 创建三个模型 + 重写所有路由 + Atlas 集群 + 部署验证
- 创建/修改的文件：server/db.js, models/, routes/auth.js, routes/words.js, seed.js, index.js, MongoDB配置指南.md

### 阶段 5.5：词库扩展 + 保活
- **状态：** complete
- **完成时间：** 2026-05-31 16:00
- 执行的操作：words.json 20→200 四六级核心词 + 增量种子 + UptimeRobot 保活

### 阶段 2：Vue 3 前端开发
- **状态：** complete
- **开始时间：** 2026-05-25 22:30
- **完成时间：** 2026-05-25 22:40
- 执行的操作：
  - Vite 创建 Vue 3 项目 + 安装 vue-router axios pinia
  - 配置 vite.config.js 代理 /api → localhost:3000
  - 创建 api.js (Axios 封装 + 拦截器)
  - 创建 stores/user.js (Pinia + localStorage 持久化)
  - 创建 router/index.js (路由 + beforeEach 守卫)
  - 创建 Login.vue / Home.vue / Learn.vue
  - 修改 App.vue + main.js
  - npm run build 验证通过
- 创建/修改的文件：
  - client/vite.config.js, client/src/main.js, client/src/App.vue
  - client/src/api.js, client/src/stores/user.js, client/src/router/index.js
  - client/src/views/Login.vue, Home.vue, Learn.vue

### 阶段 3：前后端联调
- **状态：** complete
- **完成时间：** 2026-05-25 22:40
- 执行的操作：
  - 启动后端 + 前端开发服务器
  - 全流程测试：注册 → 登录 → 获取单词 → 提交复习
  - 验证 records.json 记录正确生成
- 测试结果：全部通过

### 阶段 4.5：新增功能 + 前端重设计
- **状态：** complete
- **完成时间：** 2026-05-31 13:30
- 执行的操作：
  - 前端重设计：暖调学院风（Playfair Display + DM Sans，奶油底 + 深海蓝 + 琥珀金）
  - 后端新增 4 个 API：stats / list / quiz GET / quiz POST
  - 连续打卡算法：从今天往前扫描 lastReviewAt 的时间戳连续性
  - 测验选题：优先从已学单词中随机抽，不足从全词库补充
  - Home.vue 改造：实时统计面板 + 连续打卡徽章 + 单词列表/测验入口
  - 新建 Words.vue：20 个单词 + 状态标签(未学/学习中/已掌握) + 可筛选
  - 新建 Quiz.vue：5 道选择题 + 点选交互 + 提交评分 + 错题展示
  - 路由懒加载：Words/Quiz 按需加载减小首屏体积
  - 本地全流程测试通过，推 Railway 部署
- 创建/修改的文件：
  - server/routes/words.js（新增 100+ 行）
  - client/src/api.js（新增 4 个 API 调用）
  - client/src/views/Home.vue（全面改造）
  - client/src/views/Words.vue（新建）
  - client/src/views/Quiz.vue（新建）
  - client/src/router/index.js（新增 2 个路由）
  - client/index.html（Google Fonts）
  - client/src/style.css（全局设计变量）

### 阶段 4：部署上线
- **状态：** complete
- **开始时间：** 2026-05-31
- **完成时间：** 2026-05-31
- 执行的操作：
  - 创建 GitHub 仓库 Grangtly/word-memory-platform，推送代码
  - 尝试 Wispbyte 部署 → 文件上传路径问题，放弃
  - 注册 Railway，GitHub 导入仓库
  - Railway nixpacks 构建反复报 $NIXPACKS_PATH → 创建 nixpacks.toml/railway.json 无效 → 确认是 Railway 平台 bug
  - 换 Dockerfile 方案：创建多阶段 Dockerfile（先编 client 再编 server）
  - 修改 server/index.js：PORT 环境变量 + 托管 public/ 静态文件 + SPA 正则回退
  - railway.toml builder 写错 "docker" → 改为 "DOCKERFILE"
  - Express 5 `app.get('*')` 不兼容 → 改正则
  - 部署成功：前后端统一在 Railway 一个服务
- 创建/修改的文件：
  - Dockerfile, railway.toml, client/Dockerfile
  - server/index.js（PORT + 静态托管 + SPA 回退）
  - nixpacks.toml, railway.json（过程中创建→后续删除）
