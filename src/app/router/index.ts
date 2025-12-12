import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import DashboardPage from '@/logistics/features/dashboard/DashboardPage.vue'
import ReorderPage from '@/logistics/features/reorder/ReorderPage.vue'
import PurchaseOrdersPage from '@/logistics/features/purchase-orders/PurchaseOrdersPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage,
  },
  {
    path: '/reorder',
    name: 'reorder',
    component: ReorderPage,
  },
  {
    path: '/purchase-orders',
    name: 'purchase-orders',
    component: PurchaseOrdersPage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
