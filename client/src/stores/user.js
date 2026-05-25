import { defineStore } from 'pinia';
import { login as apiLogin } from '../api';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    username: localStorage.getItem('username') || '',
  }),
  actions: {
    async login(username, password) {
      const res = await apiLogin(username, password);
      this.token = res.data.token;
      this.username = res.data.username;
      localStorage.setItem('token', this.token);
      localStorage.setItem('username', this.username);
    },
    logout() {
      this.token = '';
      this.username = '';
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    },
  },
});
