<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getTodayWords, submitReview } from '../api';

const router = useRouter();

const words = ref([]);
const type = ref('');
const currentIndex = ref(0);
const loading = ref(true);
const done = ref(false);
const submitting = ref(false);

onMounted(async () => {
  try {
    const res = await getTodayWords();
    words.value = res.data.words;
    type.value = res.data.type;
    if (words.value.length === 0) {
      done.value = true;
    }
  } catch (err) {
    if (err.response?.status === 401) {
      router.push('/login');
    }
  } finally {
    loading.value = false;
  }
});

const currentWord = () => words.value[currentIndex.value] || null;

async function handleReview(remembered) {
  if (submitting.value) return;
  const word = currentWord();
  if (!word) return;
  submitting.value = true;
  try {
    await submitReview(word.id, remembered);
    if (currentIndex.value < words.value.length - 1) {
      currentIndex.value++;
    } else {
      done.value = true;
    }
  } catch (_) {
    // silently retry
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="learn-page">
    <!-- Loading -->
    <div v-if="loading" class="center">
      <p class="loading-text">加载中...</p>
    </div>

    <!-- Done -->
    <div v-else-if="done" class="center">
      <div class="done-icon">&#10003;</div>
      <h2>今日任务完成</h2>
      <p class="sub">干得好，明天继续加油！</p>
      <button class="back-btn" @click="router.push('/home')">返回首页</button>
    </div>

    <!-- Word Card -->
    <div v-else class="card">
      <div class="card-top">
        <span class="type-badge">{{ type === 'review' ? '复习' : '新词' }}</span>
        <span class="progress">{{ currentIndex + 1 }} / {{ words.length }}</span>
      </div>

      <h2 class="word">{{ currentWord().word }}</h2>
      <p class="phonetic">{{ currentWord().phonetic }}</p>

      <div class="divider"></div>

      <p class="meaning">{{ currentWord().meaning }}</p>
      <p class="example">"{{ currentWord().example }}"</p>

      <div class="dots">
        <span
          v-for="(_, i) in words"
          :key="i"
          :class="['dot', { active: i === currentIndex, done: i < currentIndex }]"
        ></span>
      </div>

      <div class="actions">
        <button class="btn-forgot" :disabled="submitting" @click="handleReview(false)">
          没记住
        </button>
        <button class="btn-remembered" :disabled="submitting" @click="handleReview(true)">
          记住了
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.learn-page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
}

.center {
  text-align: center;
}

.loading-text {
  font-size: 15px;
  color: var(--text-secondary);
}

.done-icon {
  width: 72px;
  height: 72px;
  background: #e8f0e9;
  color: var(--success);
  font-size: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

h2 {
  font-family: var(--font-display);
  font-size: 28px;
  color: var(--heading);
  margin-bottom: 8px;
}

.sub {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 28px;
}

.back-btn {
  padding: 12px 36px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}

.back-btn:hover {
  background: var(--accent-hover);
}

.card {
  width: 100%;
  max-width: 440px;
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  padding: 36px 32px 28px;
  border: 1px solid var(--border);
  text-align: center;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.type-badge {
  font-size: 13px;
  padding: 5px 14px;
  border-radius: 20px;
  background: #f2efe9;
  color: var(--accent);
  font-weight: 500;
}

.progress {
  font-size: 13px;
  color: var(--text-secondary);
}

.word {
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 700;
  color: var(--heading);
  margin-bottom: 4px;
}

.phonetic {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.divider {
  width: 48px;
  height: 2px;
  background: var(--accent);
  margin: 0 auto 20px;
  border-radius: 1px;
  opacity: 0.5;
}

.meaning {
  font-size: 20px;
  color: var(--text);
  font-weight: 500;
  margin-bottom: 10px;
}

.example {
  font-size: 15px;
  color: var(--text-secondary);
  font-style: italic;
  line-height: 1.6;
  margin-bottom: 28px;
  padding: 0 8px;
}

.dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 28px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border);
  transition: all 0.3s;
}

.dot.active {
  background: var(--accent);
  width: 24px;
  border-radius: 4px;
}

.dot.done {
  background: var(--success);
  opacity: 0.4;
}

.actions {
  display: flex;
  gap: 14px;
}

.btn-forgot,
.btn-remembered {
  flex: 1;
  padding: 14px 0;
  border: none;
  border-radius: 12px;
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-forgot {
  background: #faf0f0;
  color: var(--danger);
}

.btn-forgot:hover:not(:disabled) {
  background: #f3dddd;
}

.btn-remembered {
  background: #e8f0e9;
  color: var(--success);
}

.btn-remembered:hover:not(:disabled) {
  background: #d4e6d5;
}

button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
