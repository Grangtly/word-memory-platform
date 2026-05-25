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
  } catch (err) {
    // silently retry — don't block the user
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="learn-container">
    <div v-if="loading" class="status">加载中...</div>

    <div v-else-if="done" class="status">
      <h2>今日任务完成</h2>
      <p>干得好，明天继续加油！</p>
      <button @click="router.push('/home')">返回首页</button>
    </div>

    <div v-else class="card">
      <div class="tag">{{ type === 'review' ? '复习' : '新词' }}</div>
      <h2 class="word">{{ currentWord().word }}</h2>
      <p class="phonetic">{{ currentWord().phonetic }}</p>
      <p class="meaning">{{ currentWord().meaning }}</p>
      <p class="example">{{ currentWord().example }}</p>

      <div class="progress">
        {{ currentIndex + 1 }} / {{ words.length }}
      </div>

      <div class="actions">
        <button class="forgot" :disabled="submitting" @click="handleReview(false)">没记住</button>
        <button class="remembered" :disabled="submitting" @click="handleReview(true)">记住了</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.learn-container {
  max-width: 440px;
  margin: 40px auto;
  padding: 0 16px;
}
.status {
  text-align: center;
  margin-top: 80px;
}
.status h2 { color: #27ae60; }
.status p { color: #888; margin: 12px 0 24px; }
.status button {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  background: #4a90d9;
  color: #fff;
  cursor: pointer;
  font-size: 15px;
}
.card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  text-align: center;
}
.tag {
  display: inline-block;
  background: #eef5ff;
  color: #4a90d9;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 13px;
  margin-bottom: 16px;
}
.word { font-size: 28px; color: #222; margin-bottom: 6px; }
.phonetic { color: #999; font-size: 14px; margin-bottom: 12px; }
.meaning { font-size: 18px; color: #555; margin-bottom: 8px; }
.example {
  font-size: 14px;
  color: #888;
  font-style: italic;
  margin-bottom: 24px;
  line-height: 1.5;
}
.progress { color: #bbb; font-size: 13px; margin-bottom: 24px; }
.actions { display: flex; gap: 12px; }
.actions button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
}
.actions button:disabled { opacity: 0.5; cursor: not-allowed; }
.forgot { background: #fde8e8; color: #e74c3c; }
.forgot:hover:not(:disabled) { background: #f5c6c6; }
.remembered { background: #d4edda; color: #27ae60; }
.remembered:hover:not(:disabled) { background: #b8dfc6; }
</style>
