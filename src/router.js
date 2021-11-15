import { createRouter, createWebHistory } from 'vue-router'
import Top from './pages/Top'
import Checkout from './pages/Checkout'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Top
    },
    {
      path: '/stripe-checkout',
      component: Checkout
    }
  ]
})

export default router
