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
  ],
})

export default router
