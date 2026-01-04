<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Fines Management</h1>
      <p class="mt-2 text-gray-600">View and manage library fines for all users</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-red-100 rounded-md p-3">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Outstanding</p>
            <p class="text-2xl font-semibold text-red-600">Ksh {{ totalUnpaidAmount.toFixed(2) }}</p>
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
            <p class="text-sm font-medium text-gray-500">Paid Today</p>
            <p class="text-2xl font-semibold text-gray-900">Ksh {{ paidTodayAmount.toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Users with Fines</p>
            <p class="text-2xl font-semibold text-gray-900">{{ usersWithFines.size }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search User</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email, or student ID..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            @input="handleSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
          <select
            v-model="statusFilter"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            @change="handleSearch"
          >
            <option value="">All Statuses</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="waived">Waived</option>
            <option value="partial">Partial</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">User Role</label>
          <select
            v-model="roleFilter"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            @change="handleSearch"
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Fines Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">All Fines</h2>
          <button @click="fetchFines" class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p class="mt-2 text-gray-600">Loading fines...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredFines.length === 0" class="p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No fines found</h3>
        <p class="mt-1 text-sm text-gray-500">{{ searchQuery ? 'Try adjusting your filters' : 'All users have paid their fines!' }}</p>
      </div>

      <!-- Fines Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessed Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="fine in filteredFines" :key="fine._id" class="hover:bg-gray-50">
              <!-- User -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span class="text-white font-semibold text-sm">{{ getUserInitials(fine.user) }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ getUserName(fine.user) }}</div>
                    <div class="text-sm text-gray-500">{{ fine.user?.email }}</div>
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {{ fine.user?.role }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Book -->
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <img 
                    :src="getBookCover(fine.transaction?.book)" 
                    :alt="fine.transaction?.book?.title"
                    class="h-12 w-8 object-cover rounded shadow-sm"
                  />
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ fine.transaction?.book?.title || 'N/A' }}</div>
                    <div class="text-sm text-gray-500">{{ fine.transaction?.book?.author || 'N/A' }}</div>
                  </div>
                </div>
              </td>

              <!-- Amount -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-gray-900">${{ fine.amount?.toFixed(2) }}</div>
                <div v-if="fine.amountPaid > 0" class="text-xs text-gray-500">
                  Paid: ${{ fine.amountPaid?.toFixed(2) }}
                </div>
              </td>

              <!-- Reason -->
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ fine.reason || 'Late return' }}</div>
                <div v-if="fine.notes" class="text-xs text-gray-500 mt-1">{{ fine.notes }}</div>
              </td>

              <!-- Assessed Date -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(fine.assessedDate) }}
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(fine.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ fine.status }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button 
                    v-if="fine.status === 'unpaid'"
                    @click="openPaymentModal(fine)"
                    class="text-green-600 hover:text-green-900"
                    title="Mark as Paid"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button 
                    v-if="fine.status === 'unpaid'"
                    @click="openWaiveModal(fine)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Waive Fine"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button 
                    @click="viewUserFines(fine.user?._id)"
                    class="text-indigo-600 hover:text-indigo-900"
                    title="View All User Fines"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Payment Modal -->
    <div v-if="showPaymentModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showPaymentModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-5">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Record Payment</h3>
              <div class="mt-4">
                <p class="text-sm text-gray-500 mb-4">Fine Amount: <span class="font-semibold text-gray-900">${{ selectedFine?.amount?.toFixed(2) }}</span></p>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 text-left mb-2">Payment Method</label>
                    <select v-model="paymentData.method" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="mobile_money">Mobile Money</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 text-left mb-2">Notes (Optional)</label>
                    <textarea v-model="paymentData.notes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Payment reference or notes..."></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button @click="handlePayFine" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:col-start-2 sm:text-sm">
              Confirm Payment
            </button>
            <button @click="showPaymentModal = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Waive Modal -->
    <div v-if="showWaiveModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showWaiveModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-5">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Waive Fine</h3>
              <div class="mt-4">
                <p class="text-sm text-gray-500 mb-4">Fine Amount: <span class="font-semibold text-gray-900">${{ selectedFine?.amount?.toFixed(2) }}</span></p>
                <div>
                  <label class="block text-sm font-medium text-gray-700 text-left mb-2">Reason for Waiving (Required)</label>
                  <textarea v-model="waiveReason" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Explain why this fine is being waived..." required></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button @click="handleWaiveFine" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:col-start-2 sm:text-sm">
              Waive Fine
            </button>
            <button @click="showWaiveModal = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm">
              Cancel
            </button>
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
const loading = ref(true)
const fines = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const roleFilter = ref('')

const showPaymentModal = ref(false)
const showWaiveModal = ref(false)
const selectedFine = ref(null)
const paymentData = ref({ method: 'cash', notes: '' })
const waiveReason = ref('')

const unpaidFines = computed(() => {
  return fines.value.filter(fine => fine.status === 'unpaid')
})

const totalUnpaidAmount = computed(() => {
  return unpaidFines.value.reduce((sum, fine) => sum + (fine.amount || 0), 0)
})

const paidTodayAmount = computed(() => {
  const today = new Date().toDateString()
  return fines.value
    .filter(fine => fine.status === 'paid' && new Date(fine.paidDate).toDateString() === today)
    .reduce((sum, fine) => sum + (fine.amount || 0), 0)
})

const usersWithFines = computed(() => {
  return new Set(unpaidFines.value.map(fine => fine.user?._id).filter(Boolean))
})

const filteredFines = computed(() => {
  let result = fines.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(fine => 
      fine.user?.firstName?.toLowerCase().includes(query) ||
      fine.user?.lastName?.toLowerCase().includes(query) ||
      fine.user?.email?.toLowerCase().includes(query) ||
      fine.user?.studentId?.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    result = result.filter(fine => fine.status === statusFilter.value)
  }

  if (roleFilter.value) {
    result = result.filter(fine => fine.user?.role === roleFilter.value)
  }

  return result
})

const fetchFines = async () => {
  try {
    loading.value = true
    const response = await fineService.getFines()
    fines.value = response.data
  } catch (error) {
    console.error('Error fetching fines:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // Filters are reactive, no need to do anything
}

const openPaymentModal = (fine) => {
  selectedFine.value = fine
  paymentData.value = { method: 'cash', notes: '' }
  showPaymentModal.value = true
}

const openWaiveModal = (fine) => {
  selectedFine.value = fine
  waiveReason.value = ''
  showWaiveModal.value = true
}

const handlePayFine = async () => {
  try {
    await fineService.payFine(selectedFine.value._id, {
      paymentMethod: paymentData.value.method,
      notes: paymentData.value.notes
    })
    alert('Payment recorded successfully!')
    showPaymentModal.value = false
    await fetchFines()
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to record payment')
  }
}

const handleWaiveFine = async () => {
  if (!waiveReason.value.trim()) {
    alert('Please provide a reason for waiving this fine')
    return
  }

  try {
    await fineService.waiveFine(selectedFine.value._id, waiveReason.value)
    alert('Fine waived successfully!')
    showWaiveModal.value = false
    await fetchFines()
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to waive fine')
  }
}

const viewUserFines = (userId) => {
  if (userId) {
    searchQuery.value = ''
    statusFilter.value = ''
    roleFilter.value = ''
    // Filter to show only this user's fines
    const user = fines.value.find(f => f.user?._id === userId)?.user
    if (user) {
      searchQuery.value = user.email
    }
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
  fetchFines()
})
</script>
