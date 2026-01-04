<template>
  <div class="bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">My Reservations</h1>
        <p class="mt-2 text-gray-600">Reserve books that are currently unavailable and get notified when they're ready</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Pending</p>
              <p class="text-2xl font-semibold text-gray-900">{{ pendingReservations.length }}</p>
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
              <p class="text-sm font-medium text-gray-500">Available</p>
              <p class="text-2xl font-semibold text-gray-900">{{ availableReservations.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-gray-100 rounded-md p-3">
              <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total</p>
              <p class="text-2xl font-semibold text-gray-900">{{ allReservations.length }}</p>
            </div>
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
            <h3 class="text-sm font-medium text-blue-800">How Reservations Work</h3>
            <p class="text-sm text-blue-700 mt-1">
              When a book you want is currently checked out, you can reserve it. We'll notify you when it becomes available. You'll have 3 days to check it out before the reservation expires.
            </p>
          </div>
        </div>
      </div>

      <!-- Reservations List -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Active Reservations</h2>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-6 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p class="mt-2 text-gray-600">Loading reservations...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="allReservations.length === 0" class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No reservations</h3>
          <p class="mt-1 text-sm text-gray-500">Reserve books from the catalog when they're unavailable</p>
          <div class="mt-6">
            <router-link to="/catalog" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Catalog
            </router-link>
          </div>
        </div>

        <!-- Reservations List -->
        <div v-else class="divide-y divide-gray-200">
          <div v-for="reservation in allReservations" :key="reservation._id" class="p-6 hover:bg-gray-50 transition-colors">
            <div class="flex items-start space-x-6">
              <!-- Book Cover -->
              <div class="flex-shrink-0">
                <img 
                  :src="getBookCover(reservation.book)" 
                  :alt="reservation.book?.title"
                  class="h-32 w-22 object-cover rounded-lg shadow-md"
                />
              </div>

              <!-- Reservation Details -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900">{{ reservation.book?.title }}</h3>
                    <p class="text-sm text-gray-600 mt-1">by {{ reservation.book?.author }}</p>
                    <p v-if="reservation.book?.isbn" class="text-xs text-gray-500 mt-1">ISBN: {{ reservation.book?.isbn }}</p>
                  </div>
                  
                  <!-- Status Badge -->
                  <span :class="getStatusBadgeClass(reservation.status)" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                    {{ getStatusText(reservation.status) }}
                  </span>
                </div>

                <!-- Reservation Information -->
                <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p class="text-xs text-gray-500">Reserved On</p>
                    <p class="text-sm font-medium text-gray-900">{{ formatDate(reservation.reservationDate) }}</p>
                  </div>
                  <div v-if="reservation.status === 'pending'">
                    <p class="text-xs text-gray-500">Queue Position</p>
                    <p class="text-sm font-medium text-gray-900">#{{ reservation.queuePosition || 1 }}</p>
                  </div>
                  <div v-if="reservation.status === 'available'">
                    <p class="text-xs text-gray-500">Expires On</p>
                    <p class="text-sm font-medium text-orange-600">{{ formatDate(reservation.expiryDate) }}</p>
                  </div>
                  <div v-if="reservation.notifiedAt">
                    <p class="text-xs text-gray-500">Notified</p>
                    <p class="text-sm font-medium text-gray-900">{{ formatTimeAgo(reservation.notifiedAt) }}</p>
                  </div>
                </div>

                <!-- Available Notice -->
                <div v-if="reservation.status === 'available'" class="mt-4 bg-green-50 border border-green-200 rounded-md p-3">
                  <div class="flex">
                    <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <div class="ml-3">
                      <p class="text-sm text-green-800">
                        <strong>Good news!</strong> This book is now available. Visit the circulation desk to check it out before {{ formatDate(reservation.expiryDate) }}.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="mt-4 flex items-center space-x-3">
                  <router-link 
                    :to="`/books/${reservation.book?._id}`"
                    class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Book
                  </router-link>
                  <button 
                    v-if="['pending', 'available'].includes(reservation.status)"
                    @click="handleCancelReservation(reservation._id)"
                    class="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                  >
                    <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel Reservation
                  </button>
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
import { useCirculationStore } from '@/stores/circulation'
import { useRouter } from 'vue-router'

const router = useRouter()
const circulationStore = useCirculationStore()

const loading = ref(true)

const allReservations = computed(() => circulationStore.myReservations || [])

const pendingReservations = computed(() => {
  return allReservations.value.filter(r => r.status === 'pending')
})

const availableReservations = computed(() => {
  return allReservations.value.filter(r => r.status === 'available')
})

const fetchData = async () => {
  try {
    loading.value = true
    await circulationStore.fetchMyReservations()
  } catch (error) {
    console.error('Error fetching reservations:', error)
  } finally {
    loading.value = false
  }
}

const handleCancelReservation = async (id) => {
  if (!confirm('Are you sure you want to cancel this reservation?')) return
  
  try {
    await circulationStore.cancelReservation(id)
    alert('Reservation cancelled successfully!')
    await fetchData()
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to cancel reservation')
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

const getStatusText = (status) => {
  const statusMap = {
    'pending': 'In Queue',
    'available': 'Ready to Pickup',
    'fulfilled': 'Fulfilled',
    'expired': 'Expired',
    'cancelled': 'Cancelled'
  }
  return statusMap[status] || status
}

const getStatusBadgeClass = (status) => {
  const classMap = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'available': 'bg-green-100 text-green-800',
    'fulfilled': 'bg-blue-100 text-blue-800',
    'expired': 'bg-gray-100 text-gray-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  fetchData()
})
</script>
