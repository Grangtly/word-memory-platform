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
