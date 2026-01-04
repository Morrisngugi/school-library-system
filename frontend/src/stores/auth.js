import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isLibrarian = computed(() => user.value?.role === 'librarian')
  const isStudent = computed(() => user.value?.role === 'student')
  const isTeacher = computed(() => user.value?.role === 'teacher')
  const isStaff = computed(() => isAdmin.value || isLibrarian.value)

  const checkAuth = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  const login = async (credentials) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await authService.login(credentials)
      
      token.value = response.token
      user.value = response.user
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await authService.register(userData)
      
      token.value = response.token
      user.value = response.user
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    authService.logout()
    user.value = null
    token.value = null
  }

  const updateProfile = async (data) => {
    try {
      loading.value = true
      const response = await authService.updateProfile(data)
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Update failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async () => {
    try {
      const response = await authService.getMe()
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to fetch user data'
      throw err
    }
  }

  // Check auth on store initialization
  checkAuth()

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isLibrarian,
    isStudent,
    isTeacher,
    isStaff,
    checkAuth,
    login,
    register,
    logout,
    updateProfile,
    fetchUser
  }
})
