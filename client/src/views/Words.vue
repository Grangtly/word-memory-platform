<script setup>
import { ref, onMounted } from 'vue';
import { getWordList } from '../api';

const words = ref([]);
const loading = ref(true);
const filter = ref('all'); // all | new | learning | mastered

onMounted(async () => {
  try {
    const res = await getWordList();
    words.value = res.data.words;
  } catch (_) {} finally { loading.value = false; }
});

const filtered = () => {
  if (filter.value === 'all') return words.value;
  return words.value.filter(w => w.status === filter.value);
};

const statusLabel = (s) => ({ new: '未学', learning: '学习中', mastered: '已掌握' }[s]);
const statusClass = (s) => ({ new: 'new', learning: 'learning', mastered: 'mastered' }[s]);
</script>

<template>
  <div class="words-page">
    <h1>单词列表</h1>

    <div class="filters">
      <button v-for="f in [{k:'all',l:'全部'},{k:'new',l:'未学'},{k:'learning',l:'学习中'},{k:'mastered',l:'已掌握'}]"
        :key="f.k" :class="['filter-btn', { active: filter === f.k }]" @click="filter = f.k">
        {{ f.l }}
      </button>
    </div>

    <p v-if="loading" class="loading">加载中...</p>

    <div v-else class="list">
      <div v-for="w in filtered()" :key="w.id" class="word-row">
        <div class="word-info">
          <span class="en">{{ w.word }}</span>
          <span class="zh">{{ w.meaning }}</span>
        </div>
        <span :class="['status', statusClass(w.status)]">{{ statusLabel(w.status) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.words-page {
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 20px;
}

h1 {
  font-family: var(--font-display);
  font-size: 28px;
  color: var(--heading);
  margin-bottom: 20px;
  text-align: center;
}

.filters {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 24px;
}

.filter-btn {
  padding: 7px 18px;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  background: var(--surface);
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background: var(--heading);
  color: #fff;
  border-color: var(--heading);
}

.loading { text-align: center; color: var(--text-secondary); font-size: 14px; }

.word-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  margin-bottom: 8px;
  box-shadow: var(--shadow-sm);
}

.word-info { display: flex; flex-direction: column; gap: 2px; }
.en { font-weight: 600; color: var(--heading); font-size: 15px; }
.zh { font-size: 13px; color: var(--text-secondary); }

.status {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
}
.status.new { background: #f2efe9; color: var(--accent); }
.status.learning { background: #e8edf5; color: var(--heading); }
.status.mastered { background: #e8f0e9; color: var(--success); }
</style>
