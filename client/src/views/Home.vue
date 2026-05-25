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
  <div class="home-container">
    <h1>欢迎，{{ userStore.username }}</h1>
    <p class="subtitle">每天坚持复习，单词记得更牢</p>
    <button class="start-btn" @click="router.push('/learn')">开始学习</button>
    <button class="logout-btn" @click="handleLogout">退出登录</button>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 400px;
  margin: 100px auto;
  text-align: center;
}
h1 { color: #333; margin-bottom: 8px; }
.subtitle { color: #888; margin-bottom: 40px; }
button {
  display: block;
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 12px;
}
.start-btn { background: #4a90d9; color: #fff; }
.start-btn:hover { background: #357abd; }
.logout-btn { background: #eee; color: #666; }
.logout-btn:hover { background: #ddd; }
</style>
