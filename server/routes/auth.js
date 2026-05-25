const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const JWT_SECRET = 'word-memory-secret-key-2024';

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: '密码长度不能少于6位' });
    }

    const users = readUsers();
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: '注册成功' });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    const users = readUsers();
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ message: '用户名或密码错误' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '用户名或密码错误' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 认证中间件
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未登录' });
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: '登录已过期，请重新登录' });
  }
}

module.exports = { router, authMiddleware };
