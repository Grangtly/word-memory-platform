<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { getStats } from '../api';

const router = useRouter();
const userStore = useUserStore();

const stats = ref(null);

onMounted(async () => {
  try {
    const res = await getStats();
    stats.value = res.data;
  } catch (_) {}
});

function handleLogout() {
  userStore.logout();
  router.push('/login');
}
</script>

<template>
  <div class="home-page">
    <div class="greeting">
      <p class="welcome">欢迎回来</p>
      <h1>{{ userStore.username }}</h1>
    </div>

    <div class="streak" v-if="stats">
      已连续打卡 <strong>{{ stats.streak }}</strong> 天
    </div>

    <button class="start-btn" @click="router.push('/learn')">
      <span class="icon">📖</span>
      开始今日学习
    </button>

    <div class="info-cards" v-if="stats">
      <div class="info-card">
        <span class="info-num">{{ stats.learnedCount }}</span>
        <span class="info-label">已学单词</span>
      </div>
      <div class="info-card">
        <span class="info-num">{{ stats.todayReviews }}</span>
        <span class="info-label">今日复习</span>
      </div>
      <div class="info-card">
        <span class="info-num">{{ stats.masteryRate }}%</span>
        <span class="info-label">掌握率</span>
      </div>
    </div>

    <div class="nav-btns">
      <button class="nav-btn" @click="router.push('/words')">📋 单词列表</button>
      <button class="nav-btn" @click="router.push('/quiz')">🎯 测验模式</button>
    </div>

    <button class="logout-btn" @click="handleLogout">退出登录</button>
  </div>
</template>

<style scoped>
.home-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  text-align: center;
}

.greeting { margin-bottom: 4px; }

.welcome {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.greeting h1 {
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 700;
  color: var(--heading);
}

.streak {
  font-size: 14px;
  color: var(--accent);
  margin-bottom: 28px;
  background: #fdf3e0;
  padding: 6px 20px;
  border-radius: 20px;
}

.streak strong { font-size: 18px; }

.start-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 48px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 4px 20px rgba(200, 150, 62, 0.30);
  margin-bottom: 36px;
}

.start-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(200, 150, 62, 0.40);
}

.start-btn .icon { font-size: 22px; }

.info-cards {
  display: flex;
  gap: 14px;
  margin-bottom: 28px;
}

.info-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 24px;
  box-shadow: var(--shadow-sm);
}

.info-num {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--heading);
}

.info-label {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.nav-btns {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
}

.nav-btn {
  padding: 10px 22px;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  border-color: var(--accent);
  background: #fdf8f0;
}

.logout-btn {
  background: none;
  border: none;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s;
}

.logout-btn:hover { color: var(--danger); }
</style>
