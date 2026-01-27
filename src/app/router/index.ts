import { createRouter, createWebHistory } from 'vue-router';
import DashboardPage from '../../logistics/features/dashboard/DashboardPage.vue';
import ReorderPage from '../../logistics/features/reorder/ReorderPage.vue';
import PurchaseOrdersPage from '../../logistics/features/purchase-orders/PurchaseOrdersPage.vue';
import SalesReportPage from '../../sales/features/SalesReportPage.vue';
import LoginPage from '../../auth/features/login/LoginPage.vue';
import { useAuthStore } from '../../auth/model/authStore';

const routes = [
  { path: '/login', component: LoginPage, meta: { layout: 'auth' } },
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: DashboardPage, meta: { requiresAuth: true } },
  { path: '/reorder', component: ReorderPage, meta: { requiresAuth: true } },
  { path: '/purchase-orders', component: PurchaseOrdersPage, meta: { requiresAuth: true } },
  { path: '/sales-report', component: SalesReportPage, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { path: '/login' };
  }

  if (to.path === '/login' && authStore.isAuthenticated) {
    const lastRoute = localStorage.getItem('lastRoute');
    if (lastRoute && lastRoute !== '/login') {
      return { path: lastRoute };
    }
    return { path: '/dashboard' };
  }

  if (authStore.isAuthenticated && to.path !== '/login') {
    localStorage.setItem('lastRoute', to.fullPath);
  }

  return true;
});

export default router;
