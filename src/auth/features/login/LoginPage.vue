<template>
  <section class="login-card">
    <div class="login-header">
      <p class="app-label">Clock Logistics</p>
      <h1>ברוכים הבאים</h1>
      <p class="subtitle">מערכת ניהול לוגיסטיקה שמאפשרת ניהול חכם של מלאים והזמנות</p>
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
  width: min(450px, 100%);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: linear-gradient(145deg, #ffffff, #f9fcff);
  padding: 2.5rem;
  border-radius: 24px;
  border: 1px solid #e0eafc;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05);
}

.login-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
}

.app-label {
  font-size: 0.875rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #0ea5e9;
  margin: 0;
}

.login-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
}

.subtitle {
  margin: 0;
  color: #475569;
  line-height: 1.6;
  font-size: 1.05rem;
}

.login-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-button {
  padding: 0.85rem 1.5rem;
  border-radius: 12px;
  border: none;
  background: #0ea5e9;
  color: #ffffff;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.2);
  transition: all 0.3s ease;
}

.login-button:hover {
  background: #0284c7;
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(14, 165, 233, 0.25);
}
</style>
