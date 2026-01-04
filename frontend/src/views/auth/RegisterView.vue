<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {{ error }}
        </div>
        
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="firstName"
                v-model="formData.firstName"
                type="text"
                required
                class="mt-1 input"
              />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="lastName"
                v-model="formData.lastName"
                type="text"
                required
                class="mt-1 input"
              />
            </div>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="mt-1 input"
            />
          </div>
          
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              placeholder="+254712345678"
              required
              class="mt-1 input"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              required
              minlength="6"
              class="mt-1 input"
            />
          </div>
          
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">I am a</label>
            <select
              id="role"
              v-model="formData.role"
              class="mt-1 input"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          
          <div v-if="formData.role === 'student'">
            <label for="studentId" class="block text-sm font-medium text-gray-700">Student ID</label>
            <input
              id="studentId"
              v-model="formData.studentId"
              type="text"
              class="mt-1 input"
            />
          </div>
          
          <div v-if="formData.role === 'student'">
            <label for="class" class="block text-sm font-medium text-gray-700">Class</label>
            <input
              id="class"
              v-model="formData.class"
              type="text"
              placeholder="e.g., Form 3A"
              class="mt-1 input"
            />
          </div>
          
          <div v-if="formData.role === 'teacher'">
            <label for="staffId" class="block text-sm font-medium text-gray-700">Staff ID</label>
            <input
              id="staffId"
              v-model="formData.staffId"
              type="text"
              class="mt-1 input"
            />
          </div>
          
          <div v-if="formData.role === 'teacher'">
            <label for="department" class="block text-sm font-medium text-gray-700">Department</label>
            <input
              id="department"
              v-model="formData.department"
              type="text"
              placeholder="e.g., Mathematics"
              class="mt-1 input"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn btn-primary disabled:opacity-50"
          >
            {{ loading ? 'Creating account...' : 'Register' }}
          </button>
        </div>
        
        <div class="text-center">
          <router-link to="/login" class="text-sm text-primary-600 hover:text-primary-500">
            Already have an account? Sign in
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  role: 'student',
  studentId: '',
  staffId: '',
  class: '',
  department: ''
})

const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''
    
    await authStore.register(formData.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.error || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
