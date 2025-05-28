const routes = [
  // Main App Shell
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'explore',
        component: () => import('pages/ExplorePage.vue'),
        meta: {
          breadcrumb: 'Explore',
          icon: 'sym_o_explore',
          dynamic: 'explore',
        },
      },
      {
        path: 'my-universes/:user_id',
        component: () => import('src/pages/universe/MyUniverses.vue'),
        meta: {
          breadcrumb: 'Universe',
          icon: 'sym_o_explore',
          dynamic: 'explore',
          requiresAuth: true,
        },
      },
      {
        path: 'profile',
        component: () => import('pages/ProfilePage.vue'),
        meta: {
          breadcrumb: 'Profile',
          icon: 'sym_o_profile',
          dynamic: 'profile',
          requiresAuth: true,
        },
      },
      {
        path: 'universe/:id/view',
        component: () => import('pages/universe/UniverseView.vue'),
        meta: {
          breadcrumb: 'Universe',
          icon: 'sym_o_planet',
          dynamic: 'universe',
        },
      },
      {
        path: 'universe/:universeId/character/:characterId',
        component: () => import('pages/universe/CharacterPage.vue'),
        meta: {
          breadcrumb: 'Character',
          icon: 'sym_o_person',
          dynamic: 'character',
        },
      },
      {
        path: 'universe/:universeId/lore/:loreId',
        component: () => import('pages/universe/LorePage.vue'),
        meta: {
          breadcrumb: 'Lore',
          icon: 'sym_o_auto_stories',
          dynamic: 'lore',
        },
      },
    ],
    meta: {
      breadcrumb: 'Home',
      icon: 'sym_o_cottage',
      dynamic: 'home',
    },
  },

  // Auth
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/auth/LoginPage.vue') },
      { path: 'register', component: () => import('pages/auth/RegisterPage.vue') },
    ],
  },

  // Universe Builder
  {
    path: '/universe/:id',
    component: () => import('layouts/UniverseLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: 'overview' },
      {
        path: 'overview',
        component: () => import('src/pages/universe/OverviewPage.vue'),
        meta: {
          breadcrumb: 'Overview',
          icon: 'sym_o_overview_key',
          dynamic: 'explore',
        },
      },
      {
        path: 'stories',
        component: () => import('src/pages/universe/StoriesDashboard.vue'),
        meta: {
          breadcrumb: 'Stories',
          icon: 'sym_o_history_edu',
          dynamic: 'stories_dashboard',
        },
      },
      {
        path: 'stories/:storyId/overview',
        component: () => import('src/pages/universe/StoryOverview.vue'),
        meta: {
          breadcrumb: 'Story Overview',
          icon: 'sym_o_menu_book',
          dynamic: 'story_overview',
        },
      },
      {
        path: 'characters',
        component: () => import('src/pages/universe/CharactersDashboard.vue'),
        meta: {
          breadcrumb: 'Characters',
          icon: 'sym_o_group3',
          dynamic: 'characters_dashboard',
        },
      },
      {
        path: 'lore',
        component: () => import('src/pages/universe/LoreDashboard.vue'),
        meta: {
          breadcrumb: 'Lore Dashboard',
          icon: 'sym_o_explore',
          dynamic: 'lore_dashboard',
        },
      },
    ],
  },

  // Editor Mode
  {
    path: '/editor/:storyId',
    component: () => import('layouts/EditorLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('pages/editor/StoryEditor.vue'),
        meta: {
          breadcrumb: 'Story Editor',
          icon: 'sym_o_explore',
        },
      },
      {
        path: 'chapter/:chapterId',
        component: () => import('pages/editor/ChapterEditor.vue'),
        meta: {
          breadcrumb: 'Chapter Editor',
          icon: 'sym_o_edit_document',
          dynamic: 'chapter_editor',
          requiresAuth: true,
        },
      },
    ],
  },

  // Reader Mode
  {
    path: '/read/:storyId',
    component: () => import('layouts/ReaderLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/reader/ReaderPage.vue'),
        meta: {
          breadcrumb: 'Reader',
          icon: 'sym_o_menu_book',
        },
      },
    ],
  },

  // 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/ErrorNotFound.vue'),
        meta: {
          breadcrumb: 'Not Found',
          icon: 'sym_o_error',
        },
      },
    ],
  },
]

export default routes
