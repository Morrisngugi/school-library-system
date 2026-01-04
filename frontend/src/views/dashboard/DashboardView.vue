<template>
  <div class="bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Welcome Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Welcome, {{ user?.firstName }}!</h1>
            <p class="text-gray-600 mt-1">{{ user?.email }}</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">Books Borrowed</div>
            <div class="text-3xl font-bold" :class="getBorrowLimitColor()">
              {{ user?.currentBooksCount || 0 }} / {{ user?.maxBooksAllowed || 0 }}
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Active Loans</p>
              <p class="text-2xl font-semibold text-gray-900">{{ activeLoans.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Pending Requests</p>
              <p class="text-2xl font-semibold text-gray-900">{{ pendingRequests.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-red-100 rounded-md p-3">
              <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Outstanding Fines</p>
              <p class="text-2xl font-semibold text-gray-900">${{ totalFines.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Books Available</p>
              <p class="text-2xl font-semibold text-gray-900">{{ user?.maxBooksAllowed - user?.currentBooksCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Overdue Notice -->
      <div v-if="overdueLoans.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-start">
          <svg class="h-5 w-5 text-red-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div>
            <h3 class="text-sm font-medium text-red-800">Overdue Books</h3>
            <p class="text-sm text-red-700 mt-1">You have {{ overdueLoans.length }} overdue book(s). Please return them as soon as possible to avoid additional fines.</p>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Active Loans -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Active Loans -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Active Loans</h2>
                <router-link to="/dashboard/my-loans" class="text-sm text-indigo-600 hover:text-indigo-800">
                  View All
                </router-link>
              </div>
            </div>
            <div v-if="loading" class="p-6 text-center text-gray-500">
              Loading...
            </div>
            <div v-else-if="activeLoans.length === 0" class="p-6 text-center text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p class="mt-2">No active loans</p>
              <p class="text-sm mt-1">Browse the catalog to borrow books</p>
            </div>
            <div v-else class="divide-y divide-gray-200">
              <div v-for="loan in activeLoans.slice(0, 5)" :key="loan._id" class="p-6 hover:bg-gray-50 transition-colors">
                <div class="flex items-start justify-between">
                  <div class="flex space-x-4 flex-1">
                    <img 
                      :src="getBookCover(loan.book)" 
                      :alt="loan.book?.title"
                      class="h-24 w-16 object-cover rounded shadow-sm"
                    />
                    <div class="flex-1 min-w-0">
                      <h3 class="text-sm font-medium text-gray-900 truncate">{{ loan.book?.title }}</h3>
                      <p class="text-sm text-gray-500 mt-1">{{ loan.book?.author }}</p>
                      <div class="flex items-center space-x-4 mt-3">
                        <div class="text-xs">
                          <span class="text-gray-500">Due:</span>
                          <span :class="getDueDateClass(loan.dueDate)" class="font-medium ml-1">
                            {{ formatDate(loan.dueDate) }}
                          </span>
                        </div>
                        <span v-if="isOverdue(loan.dueDate)" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Overdue
                        </span>
                        <span v-else-if="isDueSoon(loan.dueDate)" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Due Soon
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="ml-4">
                    <button 
                      @click="handleRenewBook(loan._id)"
                      :disabled="!canRenewBook(loan)"
                      class="px-3 py-1 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      :class="canRenewBook(loan) ? 'text-indigo-600 hover:bg-indigo-50' : 'text-gray-400'"
                    >
                      Renew
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pending Borrow Requests -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Pending Borrow Requests</h2>
            </div>
            <div v-if="loading" class="p-6 text-center text-gray-500">
              Loading...
            </div>
            <div v-else-if="pendingRequests.length === 0" class="p-6 text-center text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="mt-2">No pending requests</p>
            </div>
            <div v-else class="divide-y divide-gray-200">
              <div v-for="request in pendingRequests" :key="request._id" class="p-6 hover:bg-gray-50 transition-colors">
                <div class="flex items-start justify-between">
                  <div class="flex space-x-4 flex-1">
                    <img 
                      :src="getBookCover(request.book)" 
                      :alt="request.book?.title"
                      class="h-24 w-16 object-cover rounded shadow-sm"
                    />
                    <div class="flex-1">
                      <h3 class="text-sm font-medium text-gray-900">{{ request.book?.title }}</h3>
                      <p class="text-sm text-gray-500 mt-1">{{ request.book?.author }}</p>
                      <div class="flex items-center space-x-2 mt-3">
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending Approval
                        </span>
                        <span class="text-xs text-gray-500">
                          Requested {{ formatTimeAgo(request.createdAt) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Quick Actions & Info -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div class="space-y-3">
              <router-link 
                to="/catalog" 
                class="flex items-center px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Catalog
              </router-link>
              
              <router-link 
                to="/dashboard/my-loans" 
                class="flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                View All Loans
              </router-link>
              
              <router-link 
                to="/dashboard/my-reservations" 
                class="flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                My Reservations
              </router-link>
              
              <router-link 
                to="/dashboard/my-fines" 
                class="flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Fines
              </router-link>

              <router-link 
                to="/dashboard/profile" 
                class="flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                My Profile
              </router-link>
            </div>
          </div>

          <!-- Library Information -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Library Information</h2>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Borrowing Limit:</span>
                <span class="font-medium text-gray-900">{{ user?.maxBooksAllowed }} books</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Loan Period:</span>
                <span class="font-medium text-gray-900">14 days</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Fine per day:</span>
                <span class="font-medium text-gray-900">$10.00</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Member Since:</span>
                <span class="font-medium text-gray-900">{{ formatDate(user?.createdAt) }}</span>
              </div>
              <div class="flex justify-between py-2">
                <span class="text-gray-600">Status:</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" 
                  :class="getMembershipStatusClass()">
                  {{ user?.membershipStatus }}
                </span>
              </div>
            </div>
          </div>

          <!-- Outstanding Fines -->
          <div v-if="myFines.length > 0" class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900">Outstanding Fines</h2>
              <router-link to="/dashboard/my-fines" class="text-sm text-indigo-600 hover:text-indigo-800">
                View All
              </router-link>
            </div>
            <div class="space-y-3">
              <div v-for="fine in myFines.slice(0, 3)" :key="fine._id" class="flex justify-between items-center py-2 border-b border-gray-100">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ fine.transaction?.book?.title }}</p>
                  <p class="text-xs text-gray-500">{{ fine.reason }}</p>
                </div>
                <span class="text-sm font-semibold text-red-600 ml-2">${{ fine.amount?.toFixed(2) }}</span>
              </div>
              <div class="pt-2 border-t-2 border-gray-200">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-semibold text-gray-900">Total:</span>
                  <span class="text-lg font-bold text-red-600">${{ totalFines.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCirculationStore } from '@/stores/circulation'
import { fineService } from '@/services'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const circulationStore = useCirculationStore()

const user = computed(() => authStore.user)
const loading = ref(true)
const myFines = ref([])

const activeLoans = computed(() => {
  return circulationStore.myLoans.filter(loan => loan.status === 'borrowed')
})

const overdueLoans = computed(() => {
  return activeLoans.value.filter(loan => isOverdue(loan.dueDate))
})

const pendingRequests = ref([])

const totalFines = computed(() => {
  return myFines.value.reduce((sum, fine) => sum + (fine.amount || 0), 0)
})

const fetchData = async () => {
  try {
    loading.value = true
    await Promise.all([
      circulationStore.fetchMyLoans(),
      fetchMyFines(),
      fetchMyRequests()
    ])
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const fetchMyFines = async () => {
  try {
    const response = await fineService.getMyFines()
    myFines.value = response.data.filter(fine => fine.status === 'unpaid')
  } catch (error) {
    console.error('Error fetching fines:', error)
  }
}

const fetchMyRequests = async () => {
  try {
    const response = await circulationStore.fetchMyRequests()
    pendingRequests.value = response.data.filter(req => req.approvalStatus === 'pending')
  } catch (error) {
    console.error('Error fetching requests:', error)
  }
}

const handleRenewBook = async (transactionId) => {
  try {
    await circulationStore.renewBook(transactionId)
    alert('Book renewed successfully!')
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to renew book')
  }
}

const getBookCover = (book) => {
  if (book?.coverImage) {
    return `http://localhost:5000/${book.coverImage}`
  }
  return 'https://via.placeholder.com/150x200?text=No+Cover'
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatTimeAgo = (date) => {
  if (!date) return 'N/A'
  const now = new Date()
  const past = new Date(date)
  const diffMs = now - past
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

const isOverdue = (dueDate) => {
  return new Date(dueDate) < new Date()
}

const isDueSoon = (dueDate) => {
  const due = new Date(dueDate)
  const today = new Date()
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
  return diffDays <= 3 && diffDays >= 0
}

const getDueDateClass = (dueDate) => {
  if (isOverdue(dueDate)) return 'text-red-600'
  if (isDueSoon(dueDate)) return 'text-yellow-600'
  return 'text-gray-900'
}

const canRenewBook = (loan) => {
  return !isOverdue(loan.dueDate) && loan.renewalCount < 2
}

const getBorrowLimitColor = () => {
  const ratio = (user.value?.currentBooksCount || 0) / (user.value?.maxBooksAllowed || 1)
  if (ratio >= 1) return 'text-red-600'
  if (ratio >= 0.8) return 'text-yellow-600'
  return 'text-green-600'
}

const getMembershipStatusClass = () => {
  const status = user.value?.membershipStatus?.toLowerCase()
  if (status === 'active') return 'bg-green-100 text-green-800'
  if (status === 'suspended') return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  fetchData()
})
</script>
