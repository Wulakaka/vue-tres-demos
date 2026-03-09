import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/test-camera',
    },
    {
      name: 'test-camera',
      path: '/test-camera',
      component: () => import('@/views/TestCamera/ViewTestCamera.vue'),
    },
    {
      name: 'welcome',
      path: '/welcome',
      component: () => import('@/views/VueWelcome/ViewWelcome.vue'),
    },
  ],
})

export default router
