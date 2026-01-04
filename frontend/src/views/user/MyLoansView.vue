<template>
  <div class="bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">My Loans</h1>
        <p class="mt-2 text-gray-600">View and manage your borrowed books</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
            <div class="flex-shrink-0 bg-red-100 rounded-md p-3">
              <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Overdue</p>
              <p class="text-2xl font-semibold text-gray-900">{{ overdueLoans.length }}</p>
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
              <p class="text-sm font-medium text-gray-500">Total History</p>
              <p class="text-2xl font-semibold text-gray-900">{{ allLoans.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              @click="activeTab = 'active'"
              :class="[
                activeTab === 'active'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              Active Loans
              <span v-if="activeLoans.length > 0" :class="[
                activeTab === 'active' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
              ]">
                {{ activeLoans.length }}
              </span>
            </button>
            <button
              @click="activeTab = 'history'"
              :class="[
                activeTab === 'history'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              Loan History
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p class="mt-2 text-gray-600">Loading loans...</p>
          </div>

          <!-- Active Loans Tab -->
          <div v-else-if="activeTab === 'active'">
            <div v-if="activeLoans.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No active loans</h3>
              <p class="mt-1 text-sm text-gray-500">Browse the catalog to borrow books</p>
              <div class="mt-6">
                <router-link to="/catalog" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Browse Catalog
                </router-link>
              </div>
            </div>

            <div v-else class="space-y-6">
              <div v-for="loan in activeLoans" :key="loan._id" class="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <div class="flex items-start space-x-6">
                  <!-- Book Cover -->
                  <div class="flex-shrink-0">
                    <img 
                      :src="getBookCover(loan.book)" 
                      :alt="loan.book?.title"
                      class="h-40 w-28 object-cover rounded-lg shadow-md"
                    />
                  </div>

                  <!-- Book Details -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-900">{{ loan.book?.title }}</h3>
                        <p class="text-sm text-gray-600 mt-1">by {{ loan.book?.author }}</p>
                        <p v-if="loan.book?.isbn" class="text-xs text-gray-500 mt-1">ISBN: {{ loan.book?.isbn }}</p>
                      </div>
                      
                      <!-- Status Badge -->
                      <span v-if="isOverdue(loan.dueDate)" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        Overdue
                      </span>
                      <span v-else-if="isDueSoon(loan.dueDate)" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        Due Soon
                      </span>
                      <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>

                    <!-- Loan Information -->
                    <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p class="text-xs text-gray-500">Checked Out</p>
                        <p class="text-sm font-medium text-gray-900">{{ formatDate(loan.checkoutDate) }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Due Date</p>
                        <p class="text-sm font-medium" :class="getDueDateClass(loan.dueDate)">
                          {{ formatDate(loan.dueDate) }}
                        </p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Days Remaining</p>
                        <p class="text-sm font-medium" :class="getDueDateClass(loan.dueDate)">
                          {{ getDaysRemaining(loan.dueDate) }}
                        </p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Renewals</p>
                        <p class="text-sm font-medium text-gray-900">{{ loan.renewalCount || 0 }} / 2</p>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="mt-4 flex items-center space-x-3">
                      <button 
                        @click="handleRenewBook(loan._id)"
                        :disabled="!canRenewBook(loan)"
                        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="canRenewBook(loan) ? 'text-white bg-indigo-600 hover:bg-indigo-700' : 'text-gray-400 bg-gray-200'"
                      >
                        <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Renew Book
                      </button>
                      <router-link 
                        :to="`/books/${loan.book?._id}`"
                        class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </router-link>
                    </div>

                    <!-- Overdue Warning -->
                    <div v-if="isOverdue(loan.dueDate)" class="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                      <div class="flex">
                        <svg class="h-5 w-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        <div class="ml-3">
                          <p class="text-sm text-red-800">
                            This book is overdue by {{ Math.abs(getDaysRemaining(loan.dueDate)) }} day(s). Please return it immediately to avoid additional fines (Ksh 5/day).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- History Tab -->
          <div v-else-if="activeTab === 'history'">
            <div v-if="historyLoans.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No loan history</h3>
              <p class="mt-1 text-sm text-gray-500">Your returned books will appear here</p>
            </div>

            <div v-else class="overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Checked Out</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returned</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="loan in historyLoans" :key="loan._id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <img :src="getBookCover(loan.book)" :alt="loan.book?.title" class="h-12 w-8 object-cover rounded" />
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ loan.book?.title }}</div>
                          <div class="text-sm text-gray-500">{{ loan.book?.author }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatDate(loan.checkoutDate) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatDate(loan.returnDate) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusClass(loan.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                        {{ loan.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <router-link :to="`/books/${loan.book?._id}`" class="text-indigo-600 hover:text-indigo-900">
                        View Book
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCirculationStore } from '@/stores/circulation'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const circulationStore = useCirculationStore()
const authStore = useAuthStore()

const activeTab = ref('active')
const loading = ref(true)

const allLoans = computed(() => circulationStore.myLoans || [])

const activeLoans = computed(() => {
  return allLoans.value.filter(loan => loan.status === 'active' || loan.status === 'overdue')
})

const historyLoans = computed(() => {
  return allLoans.value.filter(loan => loan.status === 'returned')
})

const overdueLoans = computed(() => {
  return activeLoans.value.filter(loan => isOverdue(loan.dueDate))
})

const fetchData = async () => {
  try {
    loading.value = true
    // Fetch fresh user data to get updated currentBooksCount
    await authStore.fetchUser()
    await circulationStore.fetchMyLoans()
  } catch (error) {
    console.error('Error fetching loans:', error)
  } finally {
    loading.value = false
  }
}

const handleRenewBook = async (transactionId) => {
  if (!confirm('Are you sure you want to renew this book?')) return
  
  try {
    await circulationStore.renewBook(transactionId)
    alert('Book renewed successfully!')
    await fetchData() // Refresh the data
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to renew book')
  }
}

const getBookCover = (book) => {
  if (book?.coverImage) {
    const baseURL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'
    const imagePath = book.coverImage.startsWith('/') ? book.coverImage : `/${book.coverImage}`
    return `${baseURL}${imagePath}`
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

const isOverdue = (dueDate) => {
  return new Date(dueDate) < new Date()
}

const isDueSoon = (dueDate) => {
  const due = new Date(dueDate)
  const today = new Date()
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
  return diffDays <= 3 && diffDays >= 0
}

const getDaysRemaining = (dueDate) => {
  const due = new Date(dueDate)
  const today = new Date()
  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return `${Math.abs(diffDays)} day(s) overdue`
  } else if (diffDays === 0) {
    return 'Due today'
  } else {
    return `${diffDays} day(s)`
  }
}

const getDueDateClass = (dueDate) => {
  if (isOverdue(dueDate)) return 'text-red-600 font-semibold'
  if (isDueSoon(dueDate)) return 'text-yellow-600 font-semibold'
  return 'text-gray-900'
}

const canRenewBook = (loan) => {
  return !isOverdue(loan.dueDate) && (loan.renewalCount || 0) < 2
}

const getStatusClass = (status) => {
  const statusClasses = {
    'returned': 'bg-green-100 text-green-800',
    'borrowed': 'bg-blue-100 text-blue-800',
    'overdue': 'bg-red-100 text-red-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  fetchData()
})
</script>
