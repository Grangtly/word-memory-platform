const express = require('express');
const cors = require('cors');
const path = require('path');
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
// Express 5 不能用 *，改用正则匹配所有路径
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
