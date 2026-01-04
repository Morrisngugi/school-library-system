import { defineStore } from 'pinia'
import { ref } from 'vue'
import { circulationService } from '@/services'

export const useCirculationStore = defineStore('circulation', () => {
  const myLoans = ref([])
  const myReservations = ref([])
  const transactions = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchMyLoans = async () => {
    try {
      loading.value = true
      const response = await circulationService.getMyLoans()
      myLoans.value = response.data
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to fetch loans'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchMyReservations = async () => {
    try {
      loading.value = true
      const response = await circulationService.getMyReservations()
      myReservations.value = response.data
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to fetch reservations'
      throw err
    } finally {
      loading.value = false
    }
  }

  const checkoutBook = async (data) => {
    try {
      loading.value = true
      const response = await circulationService.checkoutBook(data)
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Checkout failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const returnBook = async (data) => {
    try {
      loading.value = true
      const response = await circulationService.returnBook(data)
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Return failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const renewBook = async (transactionId) => {
    try {
      loading.value = true
      const response = await circulationService.renewBook(transactionId)
      // Update the loan in myLoans
      const index = myLoans.value.findIndex(l => l._id === transactionId)
      if (index !== -1) {
        myLoans.value[index] = response.data
      }
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Renewal failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const reserveBook = async (bookId) => {
    try {
      loading.value = true
      const response = await circulationService.reserveBook(bookId)
      myReservations.value.push(response.data)
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Reservation failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cancelReservation = async (id) => {
    try {
      loading.value = true
      await circulationService.cancelReservation(id)
      myReservations.value = myReservations.value.filter(r => r._id !== id)
    } catch (err) {
      error.value = err.response?.data?.error || 'Cancellation failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAllTransactions = async (params) => {
    try {
      loading.value = true
      const response = await circulationService.getAllTransactions(params)
      transactions.value = response.data
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to fetch transactions'
      throw err
    } finally {
      loading.value = false
    }
  }

  const requestBorrow = async (bookId, requestedDueDate = null) => {
    try {
      loading.value = true
      const response = await circulationService.requestBorrow({ bookId, requestedDueDate })
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Borrow request failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    myLoans,
    myReservations,
    transactions,
    loading,
    error,
    fetchMyLoans,
    fetchMyReservations,
    checkoutBook,
    returnBook,
    renewBook,
    reserveBook,
    cancelReservation,
    fetchAllTransactions,
    requestBorrow
  }
})
