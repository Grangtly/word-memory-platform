const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  phonetic: String,
  meaning: String,
  example: String,
});

module.exports = mongoose.model('Word', wordSchema);
