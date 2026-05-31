const express = require('express');
const Word = require('../models/Word');
const Record = require('../models/Record');
const { calculateNextReview } = require('../utils/schedule');

const router = express.Router();

// GET /api/words/today
router.get('/today', async (req, res) => {
  try {
    const now = Date.now();
    const dueRecords = await Record.find({
      userId: req.userId,
      nextReviewAt: { $lte: now },
    }).populate('wordId');

    if (dueRecords.length > 0) {
      const words = dueRecords.map(r => ({
        id: r.wordId._id,
        word: r.wordId.word,
        phonetic: r.wordId.phonetic,
        meaning: r.wordId.meaning,
        example: r.wordId.example,
        stage: r.stage,
        reviewCount: r.reviewCount,
      }));
      return res.json({ words, type: 'review' });
    }

    const learnedIds = (await Record.find({ userId: req.userId }).distinct('wordId')).map(String);
    const allWords = await Word.find({});
    const newWords = allWords.filter(w => !learnedIds.includes(String(w._id))).slice(0, 10);
    res.json({ words: newWords.map(w => ({ id: w._id, word: w.word, phonetic: w.phonetic, meaning: w.meaning, example: w.example })), type: 'new' });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// POST /api/words/:id/review
router.post('/:id/review', async (req, res) => {
  try {
    const wordId = req.params.id;
    const { remembered } = req.body;
    if (typeof remembered !== 'boolean') return res.status(400).json({ message: '请提供复习结果' });

    const word = await Word.findById(wordId);
    if (!word) return res.status(404).json({ message: '单词不存在' });

    let record = await Record.findOne({ userId: req.userId, wordId });
    const currentStage = record ? record.stage : 0;
    const currentCount = record ? record.reviewCount : 0;
    const { stage, nextReviewAt } = calculateNextReview(currentStage, remembered);

    if (record) {
      record.stage = stage;
      record.nextReviewAt = nextReviewAt;
      record.reviewCount = currentCount + 1;
      record.lastReviewAt = Date.now();
      await record.save();
    } else {
      await Record.create({ userId: req.userId, wordId, stage, nextReviewAt, reviewCount: 1, lastReviewAt: Date.now() });
    }
    res.json({ message: '复习记录已保存', stage, nextReviewAt });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// ——— 统计 / 列表 / 测验 ———

function dayStart(offset = 0) {
  const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - offset); return d.getTime();
}

// GET /api/words/stats
router.get('/stats', async (req, res) => {
  try {
    const totalWords = await Word.countDocuments();
    const userRecords = await Record.find({ userId: req.userId }).lean();
    const learnedCount = userRecords.length;
    const masteredCount = userRecords.filter(r => r.stage >= 3).length;
    const masteryRate = learnedCount > 0 ? Math.round((masteredCount / learnedCount) * 100) : 0;
    const todayStart = dayStart();
    const todayReviews = userRecords.filter(r => r.lastReviewAt >= todayStart).length;

    const reviewDates = new Set(userRecords.map(r => new Date(r.lastReviewAt).toISOString().slice(0, 10)));
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const ds = new Date(); ds.setDate(ds.getDate() - i);
      if (reviewDates.has(ds.toISOString().slice(0, 10))) streak++;
      else if (i > 0) break;
    }

    res.json({ totalWords, learnedCount, masteredCount, masteryRate, todayReviews, streak });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// GET /api/words/list
router.get('/list', async (req, res) => {
  try {
    const allWords = await Word.find({}).lean();
    const userRecords = await Record.find({ userId: req.userId }).lean();
    const recordMap = {}; userRecords.forEach(r => { recordMap[String(r.wordId)] = r; });

    const list = allWords.map(w => {
      const r = recordMap[String(w._id)];
      return {
        id: w._id, word: w.word, phonetic: w.phonetic, meaning: w.meaning, example: w.example,
        learned: !!r, stage: r ? r.stage : -1, reviewCount: r ? r.reviewCount : 0,
        nextReviewAt: r ? r.nextReviewAt : null,
        status: !r ? 'new' : r.stage >= 5 ? 'mastered' : 'learning',
      };
    });
    res.json({ words: list });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// GET /api/words/quiz
router.get('/quiz', async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 5;
    const allWords = await Word.find({}).lean();
    const learnedIds = (await Record.find({ userId: req.userId }).distinct('wordId')).map(String);
    const pool = learnedIds.length >= count ? allWords.filter(w => learnedIds.includes(String(w._id))) : allWords;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    const questions = selected.map(w => {
      const others = allWords.filter(o => String(o._id) !== String(w._id)).sort(() => Math.random() - 0.5);
      const options = [{ meaning: w.meaning, correct: true }, ...others.slice(0, 3).map(o => ({ meaning: o.meaning, correct: false }))].sort(() => Math.random() - 0.5);
      return { wordId: w._id, word: w.word, phonetic: w.phonetic, options };
    });
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// POST /api/words/quiz
router.post('/quiz', async (req, res) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers)) return res.status(400).json({ message: '请提供答案' });
    const wordIds = answers.map(a => a.wordId);
    const words = await Word.find({ _id: { $in: wordIds } }).lean();
    const wordMap = {}; words.forEach(w => { wordMap[String(w._id)] = w; });

    let correct = 0;
    const details = answers.map(a => {
      const word = wordMap[String(a.wordId)];
      const isCorrect = word && word.meaning === a.meaning;
      if (isCorrect) correct++;
      return { wordId: a.wordId, correct: isCorrect, correctMeaning: word ? word.meaning : '' };
    });
    res.json({ score: correct, total: answers.length, details });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
