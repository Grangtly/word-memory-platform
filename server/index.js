const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const { router: authRouter, authMiddleware } = require('./routes/auth');
const wordsRouter = require('./routes/words');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API 路由
app.use('/api/auth', authRouter);
app.use('/api/words', authMiddleware, wordsRouter);

// 生产环境：托管前端静态文件
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// SPA 回退：非 API 请求都返回 index.html
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// 连接 MongoDB 后启动
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
