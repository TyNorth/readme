const routes = [
  // Main App Shell
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'explore', component: () => import('pages/ExplorePage.vue') },
      { path: 'my-universes', component: () => import('pages/MyUniverses.vue') },
      { path: 'profile', component: () => import('pages/ProfilePage.vue') },
    ],
  },

  // Auth (Login/Register)
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/auth/LoginPage.vue') },
      { path: 'register', component: () => import('pages/auth/RegisterPage.vue') },
    ],
  },

  // Universe Builder Section
  {
    path: '/universe/:id',
    component: () => import('layouts/UniverseLayout.vue'),
    children: [
      { path: '', redirect: 'overview' },
      { path: 'overview', component: () => import('pages/universe/Overview.vue') },
      { path: 'stories', component: () => import('pages/universe/Stories.vue') },
      { path: 'characters', component: () => import('pages/universe/Characters.vue') },
      { path: 'lore', component: () => import('pages/universe/Lore.vue') },
      { path: 'map', component: () => import('pages/universe/Map.vue') },
    ],
  },

  // Editor Mode
  {
    path: '/editor/:storyId',
    component: () => import('layouts/EditorLayout.vue'),
    children: [{ path: '', component: () => import('pages/editor/StoryEditor.vue') }],
  },

  // Reader Immersion Mode
  {
    path: '/read/:storyId',
    component: () => import('layouts/ReaderLayout.vue'),
    children: [{ path: '', component: () => import('pages/reader/ReaderPage.vue') }],
  },

  // 404 Catch-All
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
