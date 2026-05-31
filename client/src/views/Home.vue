<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const router = useRouter();
const userStore = useUserStore();

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

    <p class="motto">每天坚持，让单词成为长期记忆</p>

    <button class="start-btn" @click="router.push('/learn')">
      <span class="icon">📖</span>
      开始今日学习
    </button>

    <div class="info-cards">
      <div class="info-card">
        <span class="info-num">20</span>
        <span class="info-label">词库单词</span>
      </div>
      <div class="info-card">
        <span class="info-num">9</span>
        <span class="info-label">复习等级</span>
      </div>
      <div class="info-card">
        <span class="info-num">30d</span>
        <span class="info-label">最长间隔</span>
      </div>
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

.greeting {
  margin-bottom: 8px;
}

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

.motto {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

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
  margin-bottom: 48px;
}

.start-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(200, 150, 62, 0.40);
}

.start-btn .icon {
  font-size: 22px;
}

.info-cards {
  display: flex;
  gap: 16px;
  margin-bottom: 36px;
}

.info-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 28px;
  box-shadow: var(--shadow-sm);
}

.info-num {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--heading);
}

.info-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
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

.logout-btn:hover {
  color: var(--danger);
}
</style>
