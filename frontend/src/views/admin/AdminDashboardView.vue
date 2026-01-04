<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Welcome Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-sm text-gray-600">Welcome back! Here's what's happening in your library today.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <!-- Total Books -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Books</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.totalBooks || 0 }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <router-link to="/admin/books" class="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all books
          </router-link>
        </div>
      </div>

      <!-- Total Users -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.totalUsers || 0 }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <router-link to="/admin/users" class="text-sm font-medium text-green-600 hover:text-green-500">
            View all users
          </router-link>
        </div>
      </div>

      <!-- Active Loans -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Active Loans</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.activeLoans || 0 }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <router-link to="/admin/circulation" class="text-sm font-medium text-yellow-600 hover:text-yellow-500">
            View circulation
          </router-link>
        </div>
      </div>

      <!-- Overdue Books -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Overdue Books</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.overdueBooks || 0 }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <span class="text-sm font-medium text-red-600">Requires attention</span>
        </div>
      </div>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <!-- Quick Actions -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div class="grid grid-cols-2 gap-4">
            <router-link to="/admin/users" class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <span class="absolute inset-0" aria-hidden="true"></span>
                <p class="text-sm font-medium text-gray-900">Add User</p>
              </div>
            </router-link>

            <router-link to="/admin/books" class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">Add Book</p>
              </div>
            </router-link>

            <router-link to="/admin/subjects" class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">Manage subjects</p>
              </div>
            </router-link>

            <router-link to="/admin/circulation" class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">Circulation Desk</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
          <div v-else-if="recentActivity.length === 0" class="text-center py-8 text-gray-500">
            No recent activity
          </div>
          <div v-else class="flow-root">
            <ul class="-mb-8">
              <li v-for="(activity, idx) in recentActivity" :key="idx">
                <div class="relative pb-8">
                  <span v-if="idx !== recentActivity.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                  <div class="relative flex space-x-3">
                    <div>
                      <span class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                        <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    </div>
                    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p class="text-sm text-gray-500">{{ activity.description }}</p>
                      </div>
                      <div class="text-right text-sm whitespace-nowrap text-gray-500">
                        <time>{{ formatDate(activity.date) }}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Subjects Overview -->
    <div v-if="subjects.length > 0" class="mt-8 bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Subjects Overview</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div v-for="subject in subjects.slice(0, 8)" :key="subject._id" class="text-center">
            <div class="inline-flex items-center justify-center h-12 w-12 rounded-full mb-2" :style="{ backgroundColor: subject.color || '#6366f1' }">
              <span class="text-white font-semibold">{{ subject.code }}</span>
            </div>
            <p class="text-sm font-medium text-gray-900">{{ subject.name }}</p>
            <p class="text-xs text-gray-500">{{ subject.bookCount || 0 }} books</p>
          </div>
        </div>
        <div v-if="subjects.length > 8" class="mt-4 text-center">
          <router-link to="/admin/subjects" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all {{ subjects.length }} subjects →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const stats = ref({
  totalBooks: 0,
  totalUsers: 0,
  activeLoans: 0,
  overdueBooks: 0
})

const subjects = ref([])
const recentActivity = ref([])
const loading = ref(false)

onMounted(() => {
  fetchDashboardData()
})

async function fetchDashboardData() {
  loading.value = true
  try {
    // Fetch multiple endpoints in parallel
    const [booksRes, usersRes, subjectsRes] = await Promise.all([
      axios.get('/api/v1/catalog/books?limit=1').catch(() => ({ data: { count: 0 } })),
      axios.get('/api/v1/users?limit=1').catch(() => ({ data: { count: 0 } })),
      axios.get('/api/v1/catalog/subjects').catch(() => ({ data: { data: [] } }))
    ])

    stats.value.totalBooks = booksRes.data.count || 0
    stats.value.totalUsers = usersRes.data.count || 0
    subjects.value = subjectsRes.data.data || []

    // Generate some sample recent activity (you can replace with real data later)
    recentActivity.value = [
      { description: 'System initialized', date: new Date() }
    ]
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

function formatDate(date) {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}
</script>
