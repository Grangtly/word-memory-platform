<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { register as apiRegister } from '../api';

const router = useRouter();
const userStore = useUserStore();

const username = ref('');
const password = ref('');
const errorMsg = ref('');
const successMsg = ref('');
const loading = ref(false);

async function handleLogin() {
  errorMsg.value = '';
  successMsg.value = '';
  if (!username.value || !password.value) {
    errorMsg.value = '请输入用户名和密码';
    return;
  }
  loading.value = true;
  try {
    await userStore.login(username.value, password.value);
    router.push('/home');
  } catch (err) {
    errorMsg.value = err.response?.data?.message || '登录失败';
  } finally {
    loading.value = false;
  }
}

async function handleRegister() {
  errorMsg.value = '';
  successMsg.value = '';
  if (!username.value || !password.value) {
    errorMsg.value = '请输入用户名和密码';
    return;
  }
  if (password.value.length < 6) {
    errorMsg.value = '密码长度不能少于6位';
    return;
  }
  loading.value = true;
  try {
    await apiRegister(username.value, password.value);
    successMsg.value = '注册成功，请登录';
  } catch (err) {
    errorMsg.value = err.response?.data?.message || '注册失败';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <div class="hero">
      <h1>词汇记忆</h1>
      <p class="tagline">基于艾宾浩斯遗忘曲线的智能复习系统</p>
    </div>
    <div class="card">
      <div class="card-header">
        <span :class="['tab', !successMsg && 'active']">登录</span>
        <span class="divider">·</span>
        <span :class="['tab', successMsg && 'active']">注册</span>
      </div>
      <input
        v-model="username"
        placeholder="用户名"
        autocomplete="username"
        @keyup.enter="handleLogin"
      />
      <input
        v-model="password"
        type="password"
        placeholder="密码"
        autocomplete="current-password"
        @keyup.enter="handleLogin"
      />
      <p v-if="errorMsg" class="msg error">{{ errorMsg }}</p>
      <p v-if="successMsg" class="msg success">{{ successMsg }}</p>
      <div class="actions">
        <button class="btn-primary" :disabled="loading" @click="handleLogin">
          登录
        </button>
        <button class="btn-secondary" :disabled="loading" @click="handleRegister">
          注册
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
}

.hero {
  text-align: center;
  margin-bottom: 36px;
}

.hero h1 {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 700;
  color: var(--heading);
  letter-spacing: -0.5px;
  margin-bottom: 8px;
}

.tagline {
  font-size: 15px;
  color: var(--text-secondary);
}

.card {
  width: 100%;
  max-width: 400px;
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  padding: 36px 32px 28px;
  border: 1px solid var(--border);
}

.card-header {
  text-align: center;
  margin-bottom: 28px;
  font-size: 15px;
  color: var(--text-secondary);
}

.tab {
  color: var(--text-secondary);
  transition: color 0.2s;
}

.tab.active {
  color: var(--heading);
  font-weight: 600;
}

.divider {
  margin: 0 8px;
}

input {
  display: block;
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 14px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--text);
  background: var(--bg);
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(200, 150, 62, 0.12);
}

.msg {
  font-size: 13px;
  text-align: center;
  margin-bottom: 12px;
}

.msg.error { color: var(--danger); }
.msg.success { color: var(--success); }

.actions {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 13px 0;
  border: none;
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--accent);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-hover);
  box-shadow: 0 4px 16px rgba(200, 150, 62, 0.35);
}

.btn-secondary {
  background: var(--bg);
  color: var(--text);
  border: 1.5px solid var(--border);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--border);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
