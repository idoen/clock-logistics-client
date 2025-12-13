import { createRouter, createWebHistory } from 'vue-router';
import DashboardPage from '../../logistics/features/dashboard/DashboardPage.vue';
import ReorderPage from '../../logistics/features/reorder/ReorderPage.vue';
import PurchaseOrdersPage from '../../logistics/features/purchase-orders/PurchaseOrdersPage.vue';

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: DashboardPage },
  { path: '/reorder', component: ReorderPage },
  { path: '/purchase-orders', component: PurchaseOrdersPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
