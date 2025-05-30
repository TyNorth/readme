import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'

import routes from './routes' // Your route definitions
import { useUserStore } from '@/stores/user-store'

export default defineRouter(function (/* { store, ssrContext } */) {
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

  // Define your Admin User IDs here
  // IMPORTANT: Replace these with your actual admin user UUIDs from Supabase Auth
  const ADMIN_USER_IDS = [
    '9143b6ad-af63-4959-8ed9-f63f4c8ade65',
    '5682c3f9-883b-4052-8f6f-1700e05d4ea3',
    '860ada3e-d10b-4dd1-915e-2411227acac4',
    '4061b290-88f3-403b-a799-dcb1974f5a0b',
    // Add any other admin user IDs
  ]

  Router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()

    // Ensure user state is initialized (especially authUser)
    // This check ensures initialize() is called if authUser isn't set yet.
    // Make sure your userStore.initialize() is robust and can be called safely.
    if (!userStore.authUser) {
      await userStore.initialize()
    }

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

    // 1. Handle routes requiring admin access
    if (requiresAdmin) {
      if (!userStore.isLoggedIn) {
        // If not logged in, redirect to login, saving the intended admin route
        console.log('Admin route requires login. Redirecting to login for:', to.fullPath)
        return next({ path: '/auth/login', query: { redirect: to.fullPath } })
      }
      if (!ADMIN_USER_IDS.includes(userStore.authUser?.id || '')) {
        // If logged in but not an admin, redirect to home or an 'unauthorized' page
        console.warn('Admin access denied for user:', userStore.authUser?.id, 'to path:', to.path)
        return next('/') // Or consider next('/unauthorized') if you have such a page
      }
      // If admin checks pass, proceed to the route.
      // No further checks needed for admin routes once authorized.
      return next()
    }

    // 2. Handle routes requiring basic authentication (and are NOT admin routes)
    if (requiresAuth && !userStore.isLoggedIn) {
      // If not logged in, redirect to login, saving the intended route
      console.log('Route requires login. Redirecting to login for:', to.fullPath)
      return next({ path: '/auth/login', query: { redirect: to.fullPath } })
    }

    // 3. Prevent logged-in users from accessing general auth pages (like login/register)
    // Allow access to '/auth/check-email' even if logged in (e.g., after registration submit)
    if (to.path.startsWith('/auth') && userStore.isLoggedIn && to.path !== '/auth/check-email') {
      // If logged in and trying to access other auth pages, redirect to home
      return next('/')
    }

    // 4. If none of the above conditions are met, allow navigation
    next()
  })

  return Router
})
