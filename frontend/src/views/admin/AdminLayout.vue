<template>
  <div class="min-h-screen bg-gray-100">
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
                <h1 class="text-xl font-bold text-gray-900">Library Admin</h1>
                <p class="text-xs text-gray-500">Management Portal</p>
              </div>
            </div>

            <!-- Navigation Links -->
            <div class="hidden md:ml-10 md:flex md:space-x-1">
              <router-link to="/admin" exact-active-class="bg-indigo-50 text-indigo-700" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                Dashboard
              </router-link>
              <router-link to="/admin/books" active-class="bg-indigo-50 text-indigo-700" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                Books
              </router-link>
              <router-link to="/admin/users" active-class="bg-indigo-50 text-indigo-700" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                Users
              </router-link>
              <router-link to="/admin/subjects" active-class="bg-indigo-50 text-indigo-700" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                Subjects
              </router-link>
              <router-link to="/admin/circulation" active-class="bg-indigo-50 text-indigo-700" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                Circulation
              </router-link>
              <router-link to="/admin/fines" active-class="bg-indigo-50 text-indigo-700" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                Fines
              </router-link>
              <router-link to="/admin/reports" active-class="bg-indigo-50 text-indigo-700" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                Reports
              </router-link>
            </div>
          </div>

          <!-- Right side - User Menu -->
          <div class="flex items-center">
            <!-- Notifications -->
            <div class="relative mr-2">
              <button @click="showNotifications = !showNotifications" class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 relative">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <!-- Unread Badge -->
                <span v-if="notificationStore.unreadCount > 0" class="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {{ notificationStore.unreadCount }}
                </span>
              </button>

              <!-- Notifications Dropdown -->
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="showNotifications" @click.stop class="origin-top-right absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <!-- Header -->
                  <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h3 class="text-sm font-semibold text-gray-900">Notifications</h3>
                    <button v-if="notificationStore.unreadCount > 0" @click="markAllAsRead" class="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                      Mark all as read
                    </button>
                  </div>

                  <!-- Notifications List -->
                  <div class="max-h-96 overflow-y-auto">
                    <div v-if="notificationStore.notifications.length === 0" class="px-4 py-8 text-center text-gray-500 text-sm">
                      No notifications
                    </div>
                    <div v-else>
                      <div 
                        v-for="notification in notificationStore.notifications" 
                        :key="notification._id"
                        @click="handleNotificationClick(notification)"
                        :class="[
                          'px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100',
                          !notification.isRead ? 'bg-indigo-50' : ''
                        ]"
                      >
                        <div class="flex items-start">
                          <!-- Icon -->
                          <div :class="[
                            'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center',
                            getNotificationColor(notification.type)
                          ]">
                            <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                          </div>
                          
                          <!-- Content -->
                          <div class="ml-3 flex-1">
                            <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                            <p class="mt-1 text-sm text-gray-600">{{ notification.message }}</p>
                            <p class="mt-1 text-xs text-gray-400">{{ formatNotificationTime(notification.createdAt) }}</p>
                          </div>

                          <!-- Unread Indicator -->
                          <div v-if="!notification.isRead" class="ml-2 flex-shrink-0">
                            <div class="h-2 w-2 bg-indigo-600 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div v-if="notificationStore.notifications.length > 0" class="px-4 py-2 border-t border-gray-200 text-center">
                    <button class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              </transition>
            </div>

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
                    <router-link to="/profile" class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Profile
                    </router-link>
                    <router-link to="/catalog" class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      View Catalog
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
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link to="/admin" exact-active-class="bg-indigo-50 text-indigo-700" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
            Dashboard
          </router-link>
          <router-link to="/admin/books" active-class="bg-indigo-50 text-indigo-700" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
            Books
          </router-link>
          <router-link to="/admin/users" active-class="bg-indigo-50 text-indigo-700" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
            Users
          </router-link>
          <router-link to="/admin/subjects" active-class="bg-indigo-50 text-indigo-700" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
            Subjects
          </router-link>
          <router-link to="/admin/circulation" active-class="bg-indigo-50 text-indigo-700" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
            Circulation
          </router-link>
          <router-link to="/admin/fines" active-class="bg-indigo-50 text-indigo-700" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
            Fines
          </router-link>
          <router-link to="/admin/reports" active-class="bg-indigo-50 text-indigo-700" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
            Reports
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="py-6">
      <router-view />
    </div>

    <!-- Click outside to close dropdown -->
    <div v-if="showUserMenu" @click="showUserMenu = false" class="fixed inset-0 z-40"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const router = useRouter()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const showNotifications = ref(false)

const userName = computed(() => {
  if (authStore.user?.firstName && authStore.user?.lastName) {
    return `${authStore.user.firstName} ${authStore.user.lastName}`
  }
  return authStore.user?.name || 'Admin User'
})
const userEmail = computed(() => authStore.user?.email || 'admin@library.com')
const userRole = computed(() => authStore.user?.role || 'admin')
const userInitials = computed(() => {
  const name = userName.value
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

async function handleNotificationClick(notification) {
  if (!notification.isRead) {
    await notificationStore.markAsRead(notification._id)
  }
  showNotifications.value = false
}

async function markAllAsRead() {
  await notificationStore.markAllAsRead()
}

function getNotificationColor(type) {
  const colors = {
    'checkout': 'bg-green-500',
    'return': 'bg-blue-500',
    'overdue': 'bg-red-500',
    'reservation': 'bg-purple-500',
    'general': 'bg-gray-500'
  }
  return colors[type] || 'bg-gray-500'
}

function formatNotificationTime(date) {
  if (!date) return ''
  const now = new Date()
  const notifDate = new Date(date)
  const diffMs = now - notifDate
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return notifDate.toLocaleDateString()
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  const userMenuButton = document.getElementById('user-menu-button')
  if (userMenuButton && !userMenuButton.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Fetch notifications on mount
  notificationStore.fetchNotifications()
  // Poll for new notifications every 30 seconds
  const pollInterval = setInterval(() => {
    notificationStore.fetchNotifications()
  }, 30000)
  
  // Store interval ID to clear on unmount
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    clearInterval(pollInterval)
  })
})
</script>

