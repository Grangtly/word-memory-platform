const pptxgen = require('pptxgenjs');
const html2pptx = require('C:/Users/11598/.claude/skills/powerpoint/scripts/html2pptx');
const path = require('path');

const slidesDir = path.join(__dirname, 'slides');

async function main() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = '词汇记忆系统';
  pptx.title = '基于艾宾浩斯遗忘曲线的英语单词学习系统';

  for (let i = 1; i <= 9; i++) {
    await html2pptx(path.join(slidesDir, `s${i}.html`), pptx);
    console.log(`  Slide ${i} done`);
  }

  const outPath = path.join(__dirname, '演讲PPT.pptx');
  await pptx.writeFile({ fileName: outPath });
  console.log(`\nDone: ${outPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });
