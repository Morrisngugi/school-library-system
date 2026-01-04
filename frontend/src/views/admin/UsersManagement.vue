<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between mb-6">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          User Management
        </h2>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <button @click="showCreateModal = true" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white shadow rounded-lg p-4 mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Search</label>
          <input v-model="filters.search" @input="fetchUsers" type="text" placeholder="Name, email, ID..." class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Role</label>
          <select v-model="filters.role" @change="fetchUsers" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="librarian">Librarian</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Status</label>
          <select v-model="filters.status" @change="fetchUsers" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="resetFilters" class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
      
      <div v-else-if="users.length === 0" class="p-8 text-center text-gray-500">
        No users found
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                  <div class="text-sm text-gray-500">{{ user.membershipId }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getRoleBadgeClass(user.role)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ user.email }}</div>
              <div class="text-sm text-gray-500">{{ user.phone }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusBadgeClass(user.membershipStatus)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ user.membershipStatus }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(user.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="editUser(user)" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
              <button @click="deleteUser(user._id)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination.pages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.pages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Page <span class="font-medium">{{ pagination.page }}</span> of <span class="font-medium">{{ pagination.pages }}</span>
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.pages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <div v-if="showCreateModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="saveUser">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                {{ editingUser ? 'Edit User' : 'Create New User' }}
              </h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Full Name *</label>
                  <input v-model="formData.name" required type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Email *</label>
                  <input v-model="formData.email" required type="email" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>

                <div v-if="!editingUser">
                  <label class="block text-sm font-medium text-gray-700">Password *</label>
                  <input v-model="formData.password" required type="password" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Phone *</label>
                  <input v-model="formData.phone" required type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Role *</label>
                  <select v-model="formData.role" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="librarian">Librarian</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                  </select>
                </div>

                <div v-if="formData.role === 'student'">
                  <label class="block text-sm font-medium text-gray-700">Grade/Form</label>
                  <input v-model="formData.grade" type="text" placeholder="e.g., Form 1, Form 2..." class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Membership Status</label>
                  <select v-model="formData.membershipStatus" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                <div class="flex items-center">
                  <input v-model="formData.isActive" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                  <label class="ml-2 block text-sm text-gray-900">Active Account</label>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="submit" :disabled="submitting" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                {{ submitting ? 'Saving...' : 'Save' }}
              </button>
              <button type="button" @click="closeModal" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const users = ref([])
const loading = ref(false)
const submitting = ref(false)
const showCreateModal = ref(false)
const editingUser = ref(null)

const filters = ref({
  search: '',
  role: '',
  status: '',
  page: 1
})

const pagination = ref({
  page: 1,
  limit: 10,
  pages: 1
})

const formData = ref({
  name: '',
  email: '',
  password: '',
  phone: '',
  role: '',
  grade: '',
  membershipStatus: 'active',
  isActive: true
})

onMounted(() => {
  fetchUsers()
})

async function fetchUsers() {
  loading.value = true
  try {
    const params = {
      page: filters.value.page,
      limit: pagination.value.limit,
      ...(filters.value.search && { search: filters.value.search }),
      ...(filters.value.role && { role: filters.value.role }),
      ...(filters.value.status && { status: filters.value.status })
    }
    
    const response = await api.get('/users', { params })
    users.value = response.data.data
    pagination.value = response.data.pagination
  } catch (error) {
    console.error('Error fetching users:', error)
    const errorMsg = error.response?.data?.error || error.message || 'Failed to load users. Please try again.'
    alert(`Error: ${errorMsg}`)
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  filters.value = {
    search: '',
    role: '',
    status: '',
    page: 1
  }
  fetchUsers()
}

function changePage(page) {
  filters.value.page = page
  fetchUsers()
}

function editUser(user) {
  editingUser.value = user
  formData.value = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    grade: user.grade || '',
    membershipStatus: user.membershipStatus,
    isActive: user.isActive
  }
  showCreateModal.value = true
}

async function saveUser() {
  submitting.value = true
  try {
    if (editingUser.value) {
      await api.put(`/users/${editingUser.value._id}`, formData.value)
    } else {
      await api.post('/users', formData.value)
    }
    closeModal()
    fetchUsers()
    alert(`User ${editingUser.value ? 'updated' : 'created'} successfully!`)
  } catch (error) {
    console.error('Error saving user:', error)
    alert(error.response?.data?.error || 'Failed to save user')
  } finally {
    submitting.value = false
  }
}

async function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return
  
  try {
    await api.delete(`/users/${userId}`)
    fetchUsers()
    alert('User deleted successfully!')
  } catch (error) {
    console.error('Error deleting user:', error)
    alert('Failed to delete user')
  }
}

function closeModal() {
  showCreateModal.value = false
  editingUser.value = null
  formData.value = {
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    grade: '',
    membershipStatus: 'active',
    isActive: true
  }
}

function getRoleBadgeClass(role) {
  const classes = {
    admin: 'bg-purple-100 text-purple-800',
    librarian: 'bg-blue-100 text-blue-800',
    teacher: 'bg-green-100 text-green-800',
    student: 'bg-gray-100 text-gray-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

function getStatusBadgeClass(status) {
  const classes = {
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-red-100 text-red-800',
    expired: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
