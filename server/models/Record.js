const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wordId: { type: mongoose.Schema.Types.ObjectId, ref: 'Word', required: true },
  stage: { type: Number, default: 0 },
  nextReviewAt: { type: Number, required: true },
  reviewCount: { type: Number, default: 0 },
  lastReviewAt: { type: Number, default: Date.now },
});

recordSchema.index({ userId: 1, wordId: 1 }, { unique: true });
recordSchema.index({ userId: 1, nextReviewAt: 1 });

module.exports = mongoose.model('Record', recordSchema);
