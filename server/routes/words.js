const express = require('express');
const path = require('path');
const fs = require('fs');
const { calculateNextReview } = require('../utils/schedule');

const router = express.Router();

const WORDS_FILE = path.join(__dirname, '..', 'data', 'words.json');
const RECORDS_FILE = path.join(__dirname, '..', 'data', 'records.json');

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET /api/words/today — 获取今日待复习单词，无则返回新单词
router.get('/today', (req, res) => {
  try {
    const words = readJSON(WORDS_FILE);
    const records = readJSON(RECORDS_FILE);
    const now = Date.now();

    // 找该用户所有待复习的记录（nextReviewAt <= now）
    const dueRecords = records.filter(
      r => r.userId === req.userId && r.nextReviewAt <= now
    );

    if (dueRecords.length > 0) {
      const dueWords = dueRecords.map(r => {
        const word = words.find(w => w.id === r.wordId);
        return { ...word, stage: r.stage, reviewCount: r.reviewCount };
      });
      return res.json({ words: dueWords, type: 'review' });
    }

    // 无待复习 → 返回 10 个新单词（用户从未学过的）
    const learnedWordIds = records
      .filter(r => r.userId === req.userId)
      .map(r => r.wordId);
    const newWords = words
      .filter(w => !learnedWordIds.includes(w.id))
      .slice(0, 10);

    res.json({ words: newWords, type: 'new' });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// POST /api/words/:id/review — 提交复习结果
router.post('/:id/review', (req, res) => {
  try {
    const wordId = parseInt(req.params.id);
    const { remembered } = req.body;

    if (typeof remembered !== 'boolean') {
      return res.status(400).json({ message: '请提供复习结果' });
    }

    const words = readJSON(WORDS_FILE);
    const word = words.find(w => w.id === wordId);
    if (!word) {
      return res.status(404).json({ message: '单词不存在' });
    }

    const records = readJSON(RECORDS_FILE);
    const existingIndex = records.findIndex(
      r => r.userId === req.userId && r.wordId === wordId
    );

    const currentStage = existingIndex >= 0 ? records[existingIndex].stage : 0;
    const currentCount = existingIndex >= 0 ? records[existingIndex].reviewCount : 0;
    const { stage, nextReviewAt } = calculateNextReview(currentStage, remembered);

    const record = {
      userId: req.userId,
      wordId,
      stage,
      nextReviewAt,
      reviewCount: currentCount + 1,
      lastReviewAt: Date.now(),
    };

    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.push(record);
    }

    writeJSON(RECORDS_FILE, records);
    res.json({ message: '复习记录已保存', stage, nextReviewAt });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;

// ——— 统计 / 列表 / 打卡 / 测验 ———

// 获取当天日期字符串 (YYYY-MM-DD)
function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

// 获取某日期的开始时间戳
function dayStart(offset = 0) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - offset);
  return d.getTime();
}

// GET /api/words/stats — 学习统计
router.get('/stats', (req, res) => {
  try {
    const words = readJSON(WORDS_FILE);
    const records = readJSON(RECORDS_FILE);
    const userRecords = records.filter(r => r.userId === req.userId);

    const totalWords = words.length;
    const learnedCount = userRecords.length;
    const masteredCount = userRecords.filter(r => r.stage >= 3).length;
    const masteryRate = learnedCount > 0 ? Math.round((masteredCount / learnedCount) * 100) : 0;

    // 今日复习数
    const todayStart = dayStart();
    const todayReviews = userRecords.filter(r => r.lastReviewAt >= todayStart).length;

    // 连续打卡天数
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const ds = dayStart(i);
      const de = dayStart(i - 1);
      const hasReview = userRecords.some(r => r.lastReviewAt >= ds && r.lastReviewAt < de);
      if (hasReview) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    // 如果今天还没复习，检查昨天
    if (streak === 0) {
      const yesterdayStart = dayStart(1);
      const todayEnd = dayStart(-1);
      const hasToday = userRecords.some(r => r.lastReviewAt >= todayStart && r.lastReviewAt < todayEnd);
      if (!hasToday) {
        // 从昨天开始算
        for (let i = 1; i < 365; i++) {
          const ds = dayStart(i);
          const de = dayStart(i - 1);
          if (userRecords.some(r => r.lastReviewAt >= ds && r.lastReviewAt < de)) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    res.json({ totalWords, learnedCount, masteredCount, masteryRate, todayReviews, streak });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// GET /api/words/list — 单词列表（含用户学习状态）
router.get('/list', (req, res) => {
  try {
    const words = readJSON(WORDS_FILE);
    const records = readJSON(RECORDS_FILE);
    const userRecords = records.filter(r => r.userId === req.userId);

    const list = words.map(w => {
      const r = userRecords.find(ur => ur.wordId === w.id);
      return {
        ...w,
        learned: !!r,
        stage: r ? r.stage : -1,
        reviewCount: r ? r.reviewCount : 0,
        nextReviewAt: r ? r.nextReviewAt : null,
        status: !r ? 'new' : r.stage >= 5 ? 'mastered' : 'learning',
      };
    });

    res.json({ words: list });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// GET /api/words/quiz — 生成测验题
router.get('/quiz', (req, res) => {
  try {
    const count = parseInt(req.query.count) || 5;
    const words = readJSON(WORDS_FILE);
    const records = readJSON(RECORDS_FILE);
    const userRecords = records.filter(r => r.userId === req.userId);
    const learnedIds = userRecords.map(r => r.wordId);

    // 从已学单词中选题，不够则从全部单词中选
    const pool = learnedIds.length >= count
      ? words.filter(w => learnedIds.includes(w.id))
      : words;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    const questions = selected.map(w => {
      // 4 个选项：1 正确 + 3 干扰
      const others = words.filter(o => o.id !== w.id).sort(() => Math.random() - 0.5);
      const options = [
        { meaning: w.meaning, correct: true },
        ...others.slice(0, 3).map(o => ({ meaning: o.meaning, correct: false })),
      ].sort(() => Math.random() - 0.5);

      return { wordId: w.id, word: w.word, phonetic: w.phonetic, options };
    });

    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// POST /api/words/quiz — 提交测验答案
router.post('/quiz', (req, res) => {
  try {
    const { answers } = req.body; // [{wordId, meaning}]
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: '请提供答案' });
    }

    const words = readJSON(WORDS_FILE);
    let correct = 0;
    const details = answers.map(a => {
      const word = words.find(w => w.id === a.wordId);
      const isCorrect = word && word.meaning === a.meaning;
      if (isCorrect) correct++;
      return { wordId: a.wordId, correct: isCorrect, correctMeaning: word ? word.meaning : '' };
    });

    res.json({ score: correct, total: answers.length, details });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});
