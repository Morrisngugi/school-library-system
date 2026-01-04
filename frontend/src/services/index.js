import api from './api'

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  async getMe() {
    const response = await api.get('/auth/me')
    return response.data
  },

  async updateProfile(data) {
    const response = await api.put('/auth/updateprofile', data)
    return response.data
  },

  async updatePassword(data) {
    const response = await api.put('/auth/updatepassword', data)
    return response.data
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

export const bookService = {
  async getBooks(params) {
    const response = await api.get('/catalog/books', { params })
    return response.data
  },

  async getBook(id) {
    const response = await api.get(`/catalog/books/${id}`)
    return response.data
  },

  async searchBooks(searchData) {
    const response = await api.post('/catalog/search', searchData)
    return response.data
  },

  async createBook(bookData) {
    const response = await api.post('/catalog/books', bookData)
    return response.data
  },

  async updateBook(id, bookData) {
    const response = await api.put(`/catalog/books/${id}`, bookData)
    return response.data
  },

  async deleteBook(id) {
    const response = await api.delete(`/catalog/books/${id}`)
    return response.data
  },

  async uploadCover(id, formData) {
    const response = await api.put(`/catalog/books/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }
}

export const categoryService = {
  async getCategories() {
    const response = await api.get('/catalog/categories')
    return response.data
  },

  async createCategory(categoryData) {
    const response = await api.post('/catalog/categories', categoryData)
    return response.data
  },

  async updateCategory(id, categoryData) {
    const response = await api.put(`/catalog/categories/${id}`, categoryData)
    return response.data
  },

  async deleteCategory(id) {
    const response = await api.delete(`/catalog/categories/${id}`)
    return response.data
  }
}

export const circulationService = {
  async checkoutBook(data) {
    const response = await api.post('/circulation/checkout', data)
    return response.data
  },

  async returnBook(data) {
    const response = await api.post('/circulation/return', data)
    return response.data
  },

  async renewBook(transactionId) {
    const response = await api.post(`/circulation/renew/${transactionId}`)
    return response.data
  },

  async reserveBook(bookId) {
    const response = await api.post('/circulation/reserve', { bookId })
    return response.data
  },

  async cancelReservation(id) {
    const response = await api.put(`/circulation/reserve/${id}/cancel`)
    return response.data
  },

  async getMyLoans() {
    const response = await api.get('/circulation/myloans')
    return response.data
  },

  async getMyReservations() {
    const response = await api.get('/circulation/myreservations')
    return response.data
  },

  async getAllTransactions(params) {
    const response = await api.get('/circulation/transactions', { params })
    return response.data
  }
}

export const userService = {
  async getUsers(params) {
    const response = await api.get('/users', { params })
    return response.data
  },

  async getUser(id) {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  async createUser(userData) {
    const response = await api.post('/users', userData)
    return response.data
  },

  async updateUser(id, userData) {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  },

  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },

  async getUserHistory(id, params) {
    const response = await api.get(`/users/${id}/history`, { params })
    return response.data
  },

  async getUserFines(id) {
    const response = await api.get(`/users/${id}/fines`)
    return response.data
  },

  async updateMembership(id, data) {
    const response = await api.put(`/users/${id}/membership`, data)
    return response.data
  }
}

export const fineService = {
  async getFines(params) {
    const response = await api.get('/fines', { params })
    return response.data
  },

  async getMyFines() {
    const response = await api.get('/fines/my')
    return response.data
  },

  async payFine(id, paymentData) {
    const response = await api.post(`/fines/${id}/pay`, paymentData)
    return response.data
  },

  async waiveFine(id, reason) {
    const response = await api.put(`/fines/${id}/waive`, { reason })
    return response.data
  },

  async getFinesSummary() {
    const response = await api.get('/fines/summary')
    return response.data
  }
}

export const reportService = {
  async getDashboard() {
    const response = await api.get('/reports/dashboard')
    return response.data
  },

  async getOverdueReport() {
    const response = await api.get('/reports/overdue')
    return response.data
  },

  async getPopularBooks(params) {
    const response = await api.get('/reports/popular-books', { params })
    return response.data
  },

  async getCirculationStats(params) {
    const response = await api.get('/reports/circulation-stats', { params })
    return response.data
  },

  async getUserActivity(params) {
    const response = await api.get('/reports/user-activity', { params })
    return response.data
  },

  async getInventoryReport(params) {
    const response = await api.get('/reports/inventory', { params })
    return response.data
  },

  async exportData(params) {
    const response = await api.get('/reports/export', { params })
    return response.data
  }
}

export const notificationService = {
  async sendNotification(data) {
    const response = await api.post('/notify/send', data)
    return response.data
  },

  async sendDueReminders() {
    const response = await api.post('/notify/send-reminder')
    return response.data
  },

  async sendOverdueNotices() {
    const response = await api.post('/notify/send-overdue')
    return response.data
  }
}
