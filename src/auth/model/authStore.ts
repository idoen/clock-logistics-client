import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AuthGateway } from './authGateway';
import localAuthGateway from './localAuthGateway';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);

  const login = async (gateway: AuthGateway = localAuthGateway) => {
    await gateway.login();
    isAuthenticated.value = true;
  };

  const logout = async (gateway: AuthGateway = localAuthGateway) => {
    await gateway.logout();
    isAuthenticated.value = false;
  };

  return {
    isAuthenticated,
    login,
    logout,
  };
});
