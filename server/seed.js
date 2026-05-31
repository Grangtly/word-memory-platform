const mongoose = require('mongoose');
const Word = require('./models/Word');
const wordsData = require('./data/words.json');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/word-memory';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB connected');

  await Word.deleteMany({});
  const result = await Word.insertMany(wordsData);
  console.log(`Inserted ${result.length} words`);

  await mongoose.disconnect();
  console.log('Seed done');
}

seed().catch(err => { console.error(err); process.exit(1); });
