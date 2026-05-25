const express = require('express');
const cors = require('cors');
const { router: authRouter, authMiddleware } = require('./routes/auth');
const wordsRouter = require('./routes/words');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 认证路由（无需登录）
app.use('/api/auth', authRouter);

// 单词路由（需要登录）
app.use('/api/words', authMiddleware, wordsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
