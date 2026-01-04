<template>
  <div class="bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">My Fines</h1>
        <p class="mt-2 text-gray-600">View and manage your library fines</p>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-red-100 rounded-md p-3">
              <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Outstanding</p>
              <p class="text-2xl font-semibold text-red-600">${{ totalUnpaidFines.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-orange-100 rounded-md p-3">
              <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Unpaid Fines</p>
              <p class="text-2xl font-semibold text-gray-900">{{ unpaidFines.length }}</p>
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
              <p class="text-sm font-medium text-gray-500">Paid Fines</p>
              <p class="text-2xl font-semibold text-gray-900">{{ paidFines.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Warning Banner for Unpaid Fines -->
      <div v-if="unpaidFines.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Outstanding Fines</h3>
            <p class="text-sm text-red-700 mt-1">
              You have ${{ totalUnpaidFines.toFixed(2) }} in unpaid fines. Please contact the library to make a payment. Your borrowing privileges may be suspended until fines are paid.
            </p>
          </div>
        </div>
      </div>

      <!-- Info Banner -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">Fine Policy</h3>
            <p class="text-sm text-blue-700 mt-1">
              Late returns are charged $10.00 per day. To avoid fines, return books on or before the due date. You can renew books up to 2 times if they're not overdue.
            </p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              @click="activeTab = 'unpaid'"
              :class="[
                activeTab === 'unpaid'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              Unpaid Fines
              <span v-if="unpaidFines.length > 0" :class="[
                activeTab === 'unpaid' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-900',
                'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
              ]">
                {{ unpaidFines.length }}
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
              Payment History
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p class="mt-2 text-gray-600">Loading fines...</p>
          </div>

          <!-- Unpaid Fines Tab -->
          <div v-else-if="activeTab === 'unpaid'">
            <div v-if="unpaidFines.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No unpaid fines</h3>
              <p class="mt-1 text-sm text-gray-500">You're all caught up! Keep returning books on time.</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="fine in unpaidFines" :key="fine._id" class="bg-red-50 border border-red-200 rounded-lg p-6">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-start">
                      <div class="flex-shrink-0">
                        <img 
                          :src="getBookCover(fine.transaction?.book)" 
                          :alt="fine.transaction?.book?.title"
                          class="h-20 w-14 object-cover rounded shadow-sm"
                        />
                      </div>
                      <div class="ml-4 flex-1">
                        <h3 class="text-lg font-semibold text-gray-900">{{ fine.transaction?.book?.title }}</h3>
                        <p class="text-sm text-gray-600 mt-1">by {{ fine.transaction?.book?.author }}</p>
                        
                        <div class="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p class="text-xs text-gray-500">Fine Amount</p>
                            <p class="text-sm font-semibold text-red-600">${{ fine.amount?.toFixed(2) }}</p>
                          </div>
                          <div>
                            <p class="text-xs text-gray-500">Reason</p>
                            <p class="text-sm font-medium text-gray-900">{{ fine.reason || 'Late return' }}</p>
                          </div>
                          <div>
                            <p class="text-xs text-gray-500">Assessed Date</p>
                            <p class="text-sm font-medium text-gray-900">{{ formatDate(fine.assessedDate) }}</p>
                          </div>
                          <div>
                            <p class="text-xs text-gray-500">Days Overdue</p>
                            <p class="text-sm font-medium text-gray-900">{{ Math.ceil(fine.amount / 10) }} day(s)</p>
                          </div>
                        </div>

                        <div v-if="fine.notes" class="mt-3 text-sm text-gray-600">
                          <p class="font-medium">Notes:</p>
                          <p>{{ fine.notes }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Total Amount Due -->
              <div class="bg-gray-100 border-2 border-gray-300 rounded-lg p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600">Total Amount Due</p>
                    <p class="text-3xl font-bold text-red-600">${{ totalUnpaidFines.toFixed(2) }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-600 mb-2">Payment Options</p>
                    <p class="text-xs text-gray-500">Visit the library circulation desk</p>
                    <p class="text-xs text-gray-500">or contact the librarian</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment History Tab -->
          <div v-else-if="activeTab === 'history'">
            <div v-if="paidFines.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No payment history</h3>
              <p class="mt-1 text-sm text-gray-500">Paid fines will appear here</p>
            </div>

            <div v-else class="overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid On</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="fine in paidFines" :key="fine._id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <img :src="getBookCover(fine.transaction?.book)" :alt="fine.transaction?.book?.title" class="h-10 w-7 object-cover rounded" />
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ fine.transaction?.book?.title }}</div>
                          <div class="text-sm text-gray-500">{{ fine.transaction?.book?.author }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${{ fine.amount?.toFixed(2) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatDate(fine.paidDate) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ fine.paymentMethod || 'Cash' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusClass(fine.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                        {{ fine.status }}
                      </span>
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
import { fineService } from '@/services'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('unpaid')
const loading = ref(true)
const fines = ref([])

const unpaidFines = computed(() => {
  return fines.value.filter(fine => fine.status === 'unpaid')
})

const paidFines = computed(() => {
  return fines.value.filter(fine => ['paid', 'waived'].includes(fine.status))
})

const totalUnpaidFines = computed(() => {
  return unpaidFines.value.reduce((sum, fine) => sum + (fine.amount || 0), 0)
})

const fetchData = async () => {
  try {
    loading.value = true
    const response = await fineService.getMyFines()
    fines.value = response.data
  } catch (error) {
    console.error('Error fetching fines:', error)
  } finally {
    loading.value = false
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

const getStatusClass = (status) => {
  const statusClasses = {
    'paid': 'bg-green-100 text-green-800',
    'unpaid': 'bg-red-100 text-red-800',
    'waived': 'bg-blue-100 text-blue-800',
    'partial': 'bg-yellow-100 text-yellow-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  fetchData()
})
</script>
