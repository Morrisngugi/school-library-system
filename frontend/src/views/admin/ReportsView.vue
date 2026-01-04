<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Library Reports</h1>
      <p class="mt-2 text-gray-600">Comprehensive analytics and statistics</p>
    </div>

    <!-- Date Range Selector -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">From Date</label>
          <input v-model="dateRange.from" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">To Date</label>
          <input v-model="dateRange.to" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div class="flex items-end">
          <button @click="fetchReports" class="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Generate Reports
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Reports Content -->
    <div v-else>
      <!-- Overview Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Books</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalBooks }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Active Users</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.activeUsers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-purple-100 rounded-md p-3">
              <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Circulations</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalCirculations }}</p>
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
              <p class="text-sm font-medium text-gray-500">Overdue Books</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.overdueBooks }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Popular Books -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Most Popular Books</h2>
        </div>
        <div class="p-6">
          <div v-if="popularBooks.length === 0" class="text-center py-8 text-gray-500">
            No circulation data available for the selected period
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Times Borrowed</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(book, index) in popularBooks" :key="book._id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ index + 1 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <img 
                        :src="getBookCover(book)" 
                        @error="(e) => e.target.src = 'https://via.placeholder.com/150x200?text=No+Cover'"
                        class="h-10 w-7 object-cover rounded" 
                        :alt="book.title"
                      />
                      <span class="ml-3 text-sm font-medium text-gray-900">{{ book.title }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ book.author }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{{ book.borrowCount || 0 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="book.availableCopies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ book.availableCopies || 0 }} / {{ book.totalCopies || 0 }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- User Activity -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Most Active Users</h2>
          </div>
          <div class="p-6">
            <div v-if="activeUsers.length === 0" class="text-center py-8 text-gray-500">
              No user activity data available
            </div>
            <div v-else class="space-y-4">
              <div v-for="user in activeUsers" :key="user._id" class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span class="text-white font-semibold text-sm">{{ getUserInitials(user) }}</span>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ getUserName(user) }}</p>
                    <p class="text-xs text-gray-500 capitalize">{{ user.role }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900">{{ user.borrowCount || 0 }} books</p>
                  <p class="text-xs text-gray-500">borrowed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Fine Collection Summary</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p class="text-sm font-medium text-gray-700">Total Collected</p>
                  <p class="text-2xl font-bold text-green-600">${{ finesSummary.totalCollected?.toFixed(2) || '0.00' }}</p>
                </div>
                <div class="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <p class="text-sm font-medium text-gray-700">Outstanding</p>
                  <p class="text-2xl font-bold text-red-600">${{ finesSummary.totalOutstanding?.toFixed(2) || '0.00' }}</p>
                </div>
                <div class="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p class="text-sm font-medium text-gray-700">Total Fines Issued</p>
                  <p class="text-2xl font-bold text-blue-600">${{ finesSummary.totalFines?.toFixed(2) || '0.00' }}</p>
                </div>
                <div class="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Overdue Books -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Overdue Books</h2>
        </div>
        <div class="p-6">
          <div v-if="overdueBooks.length === 0" class="text-center py-8 text-gray-500">
            No overdue books
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Overdue</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fine</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in overdueBooks" :key="item._id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ getUserName(item.user) }}</div>
                    <div class="text-sm text-gray-500">{{ item.user?.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.book?.title }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(item.dueDate) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {{ getDaysOverdue(item.dueDate) }} days
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                    ${{ (getDaysOverdue(item.dueDate) * 10).toFixed(2) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { reportService, fineService } from '@/services'

const loading = ref(true)
const dateRange = ref({
  from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
  to: new Date().toISOString().split('T')[0]
})

const stats = ref({
  totalBooks: 0,
  activeUsers: 0,
  totalCirculations: 0,
  overdueBooks: 0
})

const popularBooks = ref([])
const activeUsers = ref([])
const overdueBooks = ref([])
const finesSummary = ref({
  totalFines: 0,
  totalCollected: 0,
  totalOutstanding: 0
})

const fetchReports = async () => {
  try {
    loading.value = true
    
    // Fetch dashboard stats
    const dashboardData = await reportService.getDashboard()
    stats.value = {
      totalBooks: dashboardData.data?.books?.total || 0,
      activeUsers: dashboardData.data?.users?.activeMembers || 0,
      totalCirculations: dashboardData.data?.circulation?.activeLoans || 0,
      overdueBooks: dashboardData.data?.circulation?.overdueLoans || 0
    }
    
    // Fetch popular books
    const popularData = await reportService.getPopularBooks({ limit: 10 })
    // Transform the data structure from backend
    popularBooks.value = (popularData.data || []).map(item => ({
      _id: item.bookDetails._id,
      title: item.bookDetails.title,
      author: item.bookDetails.author,
      coverImage: item.bookDetails.coverImage,
      borrowCount: item.checkoutCount,
      availableCopies: item.bookDetails.availableCopies,
      totalCopies: item.bookDetails.totalCopies
    }))
    
    // Fetch overdue report
    const overdueData = await reportService.getOverdueReport()
    overdueBooks.value = overdueData.data || []
    
    // Fetch user activity
    const userActivityData = await reportService.getUserActivity({ limit: 5 })
    // Transform the data structure from backend
    activeUsers.value = (userActivityData.data || []).map(item => ({
      _id: item.userDetails._id,
      firstName: item.userDetails.firstName,
      lastName: item.userDetails.lastName,
      email: item.userDetails.email,
      role: item.userDetails.role,
      borrowCount: item.totalCheckouts
    }))
    
    // Fetch fines summary
    const finesData = await fineService.getFinesSummary()
    finesSummary.value = finesData.overall || {
      totalFines: 0,
      totalCollected: 0,
      totalOutstanding: 0
    }
  } catch (error) {
    console.error('Error fetching reports:', error)
  } finally {
    loading.value = false
  }
}

const getUserName = (user) => {
  if (!user) return 'Unknown User'
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`
  }
  return user.name || user.email || 'Unknown User'
}

const getUserInitials = (user) => {
  if (!user) return 'U'
  if (user.firstName && user.lastName) {
    return (user.firstName[0] + user.lastName[0]).toUpperCase()
  }
  const name = user.name || user.email || 'U'
  return name.substring(0, 2).toUpperCase()
}

const getBookCover = (book) => {
  if (book?.coverImage) {
    // Handle both absolute and relative paths
    const imagePath = book.coverImage.startsWith('/') ? book.coverImage : `/${book.coverImage}`
    return `http://localhost:5000${imagePath}`
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

const getDaysOverdue = (dueDate) => {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = today - due
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

onMounted(() => {
  fetchReports()
})
</script>
