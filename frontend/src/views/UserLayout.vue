<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Left side - Logo and Title -->
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <!-- Logo -->
              <div class="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <!-- Title -->
              <div>
                <h1 class="text-xl font-bold text-gray-900">School Library</h1>
                <p class="text-xs text-gray-500">Member Portal</p>
              </div>
            </div>

            <!-- Navigation Links -->
            <div class="hidden md:ml-10 md:flex md:space-x-1">
              <router-link v-if="isAuthenticated" to="/dashboard" exact-active-class="bg-indigo-50 text-indigo-700" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                Dashboard
              </router-link>
              <router-link to="/catalog" active-class="bg-indigo-50 text-indigo-700" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                Catalog
              </router-link>
              <router-link v-if="isAuthenticated" to="/dashboard/my-loans" active-class="bg-indigo-50 text-indigo-700" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                My Loans
              </router-link>
              <router-link v-if="isAuthenticated" to="/dashboard/my-reservations" active-class="bg-indigo-50 text-indigo-700" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                Reservations
              </router-link>
              <router-link v-if="isAuthenticated" to="/dashboard/my-fines" active-class="bg-indigo-50 text-indigo-700" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                Fines
              </router-link>
            </div>
          </div>

          <!-- Right side - User Menu -->
          <div class="flex items-center">
            <!-- Show login/register for guests -->
            <template v-if="!isAuthenticated">
              <router-link to="/login" class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Login
              </router-link>
              <router-link to="/register" class="ml-3 px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Register
              </router-link>
            </template>

            <!-- Show user menu for authenticated users -->
            <template v-else>
            <!-- Admin Panel Link (for staff) -->
            <router-link v-if="isStaff" to="/admin" class="hidden md:flex items-center mr-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin Panel
            </router-link>

            <!-- Notifications (Optional) -->
            <button class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 mr-2">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            <!-- User Profile Dropdown -->
            <div class="ml-3 relative">
              <div>
                <button @click="showUserMenu = !showUserMenu" class="flex items-center max-w-xs bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" id="user-menu-button">
                  <div class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <!-- User Avatar -->
                    <div class="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <span class="text-white font-semibold text-sm">{{ userInitials }}</span>
                    </div>
                    <!-- User Info -->
                    <div class="hidden lg:block text-left">
                      <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
                      <p class="text-xs text-gray-500 capitalize">{{ userRole }}</p>
                    </div>
                    <!-- Dropdown Icon -->
                    <svg class="hidden lg:block h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
              </div>

              <!-- Dropdown Menu -->
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="showUserMenu" @click.stop class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50">
                  <!-- User Info Section -->
                  <div class="px-4 py-3">
                    <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ userEmail }}</p>
                    <span class="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                      {{ userRole }}
                    </span>
                  </div>

                  <!-- Menu Items -->
                  <div class="py-1">
                    <router-link to="/dashboard/profile" class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Profile
                    </router-link>
                    <router-link to="/dashboard" class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </router-link>
                    <router-link to="/catalog" class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Browse Catalog
                    </router-link>
                  </div>

                  <!-- Logout Section -->
                  <div class="py-1">
                    <button @click="handleLogout" class="group flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900">
                      <svg class="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Mobile menu button -->
            <button @click="showMobileMenu = !showMobileMenu" class="ml-2 md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            </template>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link v-if="isAuthenticated" to="/dashboard" exact-active-class="bg-indigo-50 text-indigo-700" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
            Dashboard
          </router-link>
          <router-link to="/catalog" active-class="bg-indigo-50 text-indigo-700" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
            Catalog
          </router-link>
          <router-link v-if="isAuthenticated" to="/dashboard/my-loans" active-class="bg-indigo-50 text-indigo-700" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
            My Loans
          </router-link>
          <router-link v-if="isAuthenticated" to="/dashboard/my-reservations" active-class="bg-indigo-50 text-indigo-700" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
            Reservations
          </router-link>
          <router-link v-if="isAuthenticated" to="/dashboard/my-fines" active-class="bg-indigo-50 text-indigo-700" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
            Fines
          </router-link>
          <router-link v-if="isStaff" to="/admin" active-class="bg-indigo-50 text-indigo-700" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
            Admin Panel
          </router-link>
          <template v-if="!isAuthenticated">
            <router-link to="/login" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
              Login
            </router-link>
            <router-link to="/register" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
              Register
            </router-link>
          </template>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <router-view />

    <!-- Click outside to close dropdown -->
    <div v-if="showUserMenu" @click="showUserMenu = false" class="fixed inset-0 z-40"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)

const userName = computed(() => {
  if (authStore.user?.firstName && authStore.user?.lastName) {
    return `${authStore.user.firstName} ${authStore.user.lastName}`
  }
  return authStore.user?.name || 'User'
})

const userEmail = computed(() => authStore.user?.email || 'user@library.com')
const userRole = computed(() => authStore.user?.role || 'student')
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isStaff = computed(() => authStore.isAdmin || authStore.isLibrarian)

const userInitials = computed(() => {
  const name = userName.value
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
