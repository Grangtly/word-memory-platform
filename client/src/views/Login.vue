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
  <div class="login-container">
    <h1>英语单词学习系统</h1>
    <div class="form-card">
      <h2>登录 / 注册</h2>
      <input v-model="username" placeholder="用户名" @keyup.enter="handleLogin" />
      <input v-model="password" type="password" placeholder="密码" @keyup.enter="handleLogin" />
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      <p v-if="successMsg" class="success">{{ successMsg }}</p>
      <div class="buttons">
        <button :disabled="loading" @click="handleLogin">登录</button>
        <button :disabled="loading" class="secondary" @click="handleRegister">注册</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 80px auto;
  text-align: center;
}
h1 { margin-bottom: 24px; color: #333; }
.form-card {
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
h2 { margin-bottom: 20px; color: #666; font-size: 18px; }
input {
  display: block;
  width: 100%;
  padding: 10px 14px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  box-sizing: border-box;
}
input:focus { outline: none; border-color: #4a90d9; }
.error { color: #e74c3c; font-size: 14px; margin: 4px 0; }
.success { color: #27ae60; font-size: 14px; margin: 4px 0; }
.buttons { display: flex; gap: 12px; margin-top: 8px; }
button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  background: #4a90d9;
  color: #fff;
}
button:hover { background: #357abd; }
button:disabled { opacity: 0.6; cursor: not-allowed; }
button.secondary { background: #95a5a6; }
button.secondary:hover { background: #7f8c8d; }
</style>
