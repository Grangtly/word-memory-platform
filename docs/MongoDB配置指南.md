# MongoDB Atlas 配置指南

免费云数据库，512MB 存储，够个人项目用。

---

## 步骤 1：注册 MongoDB Atlas

1. 打开 [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. 点击 **Try Free**，填写邮箱和密码
3. 邮箱验证后进入 **Organization**，点 **Create Organization**（随便命名）
4. 点 **Create Project**（命名 `word-memory`）

---

## 步骤 2：创建免费集群

1. 项目内点 **Create a Cluster**
2. 选 **M0**（Free tier，512MB 存储）
3. Provider 选 **AWS**，Region 选离你最近的（如 `Singapore` 或 `Hong Kong`）
4. 集群名默认 `Cluster0`，点 **Create**

> 创建需要 1-3 分钟，等状态变成绿色 ✅ 就继续。

---

## 步骤 3：创建数据库用户

1. 左侧菜单 → **Database Access** → **Add New Database User**
2. 密码方式选 **Password**
3. 填用户名（如 `admin`）和密码（自己设一个强的）
4. 权限选 **Read and write to any database**
5. 点 **Add User**

> **记住用户名和密码**，后面要用。

---

## 步骤 4：配置网络白名单

1. 左侧菜单 → **Network Access** → **Add IP Address**
2. 点 **Allow access from anywhere**（允许所有 IP，或者默认已经加了）
3. 点 **Confirm**

---

## 步骤 5：获取连接字符串

1. 左侧菜单 → **Database** → 你的集群右侧点 **Connect**
2. 弹出窗口选 **Drivers**
3. 复制连接字符串，格式如下：

```
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/word-memory
```

4. 把 `<password>` 替换成你的数据库用户密码
5. ⚠️ **重要**：如果 Atlas 给的连接串末尾有 `?retryWrites=true&w=majority`，**删掉它**。mongoose 某些版本会解析失败报 `URI option "retr" cannot be specified`。

---

## 步骤 6：在 Railway 设置环境变量

1. 打开 [Railway Dashboard](https://railway.app/dashboard) → 你的项目 → **点进服务卡片**
2. 顶部点 **Variables** 标签（不是项目首页的，是服务内的）
3. 添加：

| Key | Value |
|-----|-------|
| `MONGODB_URI` | 你的连接字符串 |

4. Railway 会自动重新部署

---

## 完成后

部署成功后：
- 服务首次启动会**自动导入单词数据**（`auto-seed`，无需手动运行）
- 用户注册、学习记录全部存入 MongoDB Atlas
- Railway 容器重启**数据不会丢失**

---

## 验证

打开你的 Railway 地址 `/login`，注册新用户、学几个单词。然后去 MongoDB Atlas → **Browse Collections**，检查 `word-memory` 数据库里是不是有 `users`、`words`、`records` 三个集合。
