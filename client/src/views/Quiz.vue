<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getQuiz, submitQuiz } from '../api';

const router = useRouter();

const questions = ref([]);
const selected = ref({});
const loading = ref(true);
const submitted = ref(false);
const result = ref(null);

onMounted(async () => {
  try {
    const res = await getQuiz(5);
    questions.value = res.data.questions;
  } catch (_) {} finally { loading.value = false; }
});

function select(wordId, meaning) {
  if (submitted.value) return;
  selected.value[wordId] = meaning;
}

async function handleSubmit() {
  if (submitted.value) return;
  const answers = questions.value.map(q => ({
    wordId: q.wordId,
    meaning: selected.value[q.wordId] || '',
  }));
  try {
    const res = await submitQuiz(answers);
    result.value = res.data;
    submitted.value = true;
  } catch (_) {}
}
</script>

<template>
  <div class="quiz-page">
    <div v-if="loading" class="center">加载中...</div>

    <div v-else-if="submitted && result" class="center">
      <div class="score-circle">{{ result.score }}/{{ result.total }}</div>
      <p class="score-label">
        {{ result.score === result.total ? '全部正确！' : result.score >= 3 ? '不错！' : '继续加油！' }}
      </p>
      <div class="result-details">
        <div v-for="d in result.details" :key="d.wordId" :class="['result-row', d.correct ? 'ok' : 'fail']">
          <span>{{ d.correct ? '✓' : '✗' }}</span>
          <span v-if="!d.correct" style="margin-left:8px;color:var(--text-secondary);font-size:13px">
            正确答案：{{ d.correctMeaning }}
          </span>
        </div>
      </div>
      <button class="btn" @click="router.push('/home')">返回首页</button>
    </div>

    <div v-else>
      <h1>测验模式</h1>
      <div v-for="q in questions" :key="q.wordId" class="quiz-card">
        <p class="q-word">{{ q.word }}</p>
        <p class="q-phonetic">{{ q.phonetic }}</p>
        <div class="options">
          <button
            v-for="(opt, i) in q.options"
            :key="i"
            :class="['opt', { picked: selected[q.wordId] === opt.meaning }]"
            @click="select(q.wordId, opt.meaning)"
          >
            {{ opt.meaning }}
          </button>
        </div>
      </div>
      <button class="btn submit" :disabled="Object.keys(selected).length < questions.length" @click="handleSubmit">
        提交答案
      </button>
    </div>
  </div>
</template>

<style scoped>
.quiz-page { max-width: 500px; margin: 0 auto; padding: 32px 20px; }
.center { text-align: center; margin-top: 60px; }

h1 {
  font-family: var(--font-display);
  font-size: 28px;
  color: var(--heading);
  text-align: center;
  margin-bottom: 28px;
}

.quiz-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
}

.q-word {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
  color: var(--heading);
  margin-bottom: 2px;
}

.q-phonetic { font-size: 13px; color: var(--text-secondary); margin-bottom: 16px; }

.options { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

.opt {
  padding: 11px 10px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text);
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
}

.opt:hover { border-color: var(--accent); background: #fdf8f0; }
.opt.picked { border-color: var(--accent); background: #fdf3e0; font-weight: 500; }

.submit {
  display: block;
  margin: 8px auto 0;
}

.btn {
  padding: 13px 48px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn:hover:not(:disabled) { background: var(--accent-hover); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }

.score-circle {
  width: 100px; height: 100px;
  border-radius: 50%;
  background: #e8f0e9;
  color: var(--success);
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 12px;
}

.score-label { font-size: 16px; color: var(--text); margin-bottom: 24px; }

.result-details { margin-bottom: 24px; }
.result-row { padding: 6px 0; font-size: 14px; }
.result-row.ok { color: var(--success); }
.result-row.fail { color: var(--danger); }
</style>
