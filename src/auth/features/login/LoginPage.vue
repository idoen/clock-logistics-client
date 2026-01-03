<template>
  <section class="login-card">
    <div class="login-header">
      <p class="app-label">Clock Logistics</p>
      <h1>ברוכים הבאים</h1>
      <p class="subtitle">מערכת לוגיסטיקה שתאפשר ניהול חכם של מלאים והזמנות.</p>
    </div>
    <div class="login-panel">
      <button class="login-button" type="button" @click="handleLogin">כניסה</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../model/authStore';

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  await authStore.login();
  await router.push('/dashboard');
};
</script>

<style scoped>
.login-card {
  width: min(420px, 100%);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: #ffffff;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
}

.login-header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.app-label {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0ea5e9;
  margin: 0;
}

.login-header h1 {
  margin: 0;
  font-size: 1.75rem;
  color: #0f172a;
}

.subtitle {
  margin: 0;
  color: #475569;
  line-height: 1.6;
}

.login-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
}

.login-panel p {
  margin: 0;
  color: #64748b;
}

.login-button {
  align-self: stretch;
  padding: 0.75rem 1.5rem;
  border-radius: 0.85rem;
  border: none;
  background: #0ea5e9;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(14, 165, 233, 0.25);
}

.login-button:hover {
  background: #0284c7;
}
</style>
