import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'

import routes from './routes'
import { useUserStore } from '@/stores/user-store'

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // ✅ Route Guard
  Router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()

    // Ensure user is initialized
    if (!userStore.authUser) {
      await userStore.initialize()
    }

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

    // ❌ Block access to protected routes if not logged in
    if (requiresAuth && !userStore.isLoggedIn) {
      return next('/auth/login')
    }

    // ❌ Block access to login/register if already logged in
    if (to.path.startsWith('/auth') && userStore.isLoggedIn) {
      return next('/')
    }

    next()
  })

  return Router
})
