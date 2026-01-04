import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/catalog'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { guest: true }
  },
  {
    path: '/catalog',
    name: 'Catalog',
    component: () => import('@/views/catalog/CatalogView.vue')
  },
  {
    path: '/books/:id',
    name: 'BookDetail',
    component: () => import('@/views/catalog/BookDetailView.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my-loans',
    name: 'MyLoans',
    component: () => import('@/views/user/MyLoansView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my-reservations',
    name: 'MyReservations',
    component: () => import('@/views/user/MyReservationsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my-fines',
    name: 'MyFines',
    component: () => import('@/views/user/MyFinesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/user/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  // Admin/Librarian Routes
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresRole: ['admin', 'librarian'] },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/AdminDashboardView.vue')
      },
      {
        path: 'books',
        name: 'AdminBooks',
        component: () => import('@/views/admin/BooksManagement.vue')
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/UsersManagement.vue')
      },
      {
        path: 'circulation',
        name: 'AdminCirculation',
        component: () => import('@/views/admin/CirculationDesk.vue')
      },
      {
        path: 'fines',
        name: 'AdminFines',
        component: () => import('@/views/admin/FinesManagement.vue')
      },
      {
        path: 'reports',
        name: 'AdminReports',
        component: () => import('@/views/admin/ReportsView.vue')
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: () => import('@/views/admin/CategoriesManagement.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next('/dashboard')
  } else if (to.meta.requiresRole) {
    const userRole = authStore.user?.role
    if (to.meta.requiresRole.includes(userRole)) {
      next()
    } else {
      next('/dashboard')
    }
  } else {
    next()
  }
})

export default router
