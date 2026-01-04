<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between mb-6">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Category Management
        </h2>
        <p class="mt-1 text-sm text-gray-500">Manage book categories and classifications</p>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <button @click="showCreateModal = true" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Categories</dt>
                <dd class="text-lg font-medium text-gray-900">{{ categories.length }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Active Categories</dt>
                <dd class="text-lg font-medium text-gray-900">{{ activeCategories }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Books</dt>
                <dd class="text-lg font-medium text-gray-900">{{ totalBooks }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Grid -->
    <div v-if="loading" class="bg-white shadow rounded-lg p-8 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="categories.length === 0" class="bg-white shadow rounded-lg p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No categories</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new category.</p>
      <div class="mt-6">
        <button @click="showCreateModal = true" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>
    </div>

    <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul class="divide-y divide-gray-200">
        <li v-for="category in categories" :key="category._id" class="px-6 py-4 hover:bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-3">
                <span class="inline-flex items-center justify-center h-10 w-10 rounded-lg" :style="{ backgroundColor: category.color || '#6366f1' }">
                  <span class="text-white font-semibold text-sm">{{ category.code }}</span>
                </span>
                <div>
                  <h3 class="text-sm font-medium text-gray-900">{{ category.name }}</h3>
                  <p class="text-sm text-gray-500">{{ category.description || 'No description' }}</p>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ category.bookCount || 0 }} books</p>
                <p class="text-xs text-gray-500">
                  <span :class="category.isActive ? 'text-green-600' : 'text-red-600'">
                    {{ category.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </p>
              </div>
              <div class="flex space-x-2">
                <button @click="editCategory(category)" class="text-indigo-600 hover:text-indigo-900">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="deleteCategory(category._id)" class="text-red-600 hover:text-red-900">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="saveCategory">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                {{ editingCategory ? 'Edit Category' : 'Create New Category' }}
              </h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Category Name *</label>
                  <input v-model="formData.name" required type="text" placeholder="e.g., Fiction, Science, Mathematics" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Category Code *</label>
                  <input v-model="formData.code" required type="text" placeholder="e.g., FIC, SCI, MAT" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <p class="mt-1 text-xs text-gray-500">Short code for classification (2-5 characters)</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea v-model="formData.description" rows="3" placeholder="Brief description of the category" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Color</label>
                  <div class="mt-1 flex items-center space-x-2">
                    <input v-model="formData.color" type="color" class="h-10 w-20 border-gray-300 rounded-md">
                    <span class="text-sm text-gray-500">{{ formData.color }}</span>
                  </div>
                </div>

                <div class="flex items-center">
                  <input v-model="formData.isActive" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                  <label class="ml-2 block text-sm text-gray-900">Active Category</label>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="submit" :disabled="submitting" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">
                {{ submitting ? 'Saving...' : 'Save' }}
              </button>
              <button type="button" @click="closeModal" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
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
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const categories = ref([])
const loading = ref(false)
const submitting = ref(false)
const showCreateModal = ref(false)
const editingCategory = ref(null)

const formData = ref({
  name: '',
  code: '',
  description: '',
  color: '#6366f1',
  isActive: true
})

const activeCategories = computed(() => categories.value.filter(c => c.isActive).length)
const totalBooks = computed(() => categories.value.reduce((sum, c) => sum + (c.bookCount || 0), 0))

onMounted(() => {
  fetchCategories()
})

async function fetchCategories() {
  loading.value = true
  try {
    const response = await axios.get('/api/v1/catalog/categories')
    categories.value = response.data.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    alert('Failed to load categories')
  } finally {
    loading.value = false
  }
}

function editCategory(category) {
  editingCategory.value = category
  formData.value = {
    name: category.name,
    code: category.code,
    description: category.description || '',
    color: category.color || '#6366f1',
    isActive: category.isActive
  }
  showCreateModal.value = true
}

async function saveCategory() {
  submitting.value = true
  try {
    if (editingCategory.value) {
      await axios.put(`/api/v1/catalog/categories/${editingCategory.value._id}`, formData.value)
    } else {
      await axios.post('/api/v1/catalog/categories', formData.value)
    }
    closeModal()
    fetchCategories()
    alert(`Category ${editingCategory.value ? 'updated' : 'created'} successfully!`)
  } catch (error) {
    console.error('Error saving category:', error)
    alert(error.response?.data?.error || 'Failed to save category')
  } finally {
    submitting.value = false
  }
}

async function deleteCategory(categoryId) {
  if (!confirm('Are you sure you want to delete this category? This cannot be undone.')) return
  
  try {
    await axios.delete(`/api/v1/catalog/categories/${categoryId}`)
    fetchCategories()
    alert('Category deleted successfully!')
  } catch (error) {
    console.error('Error deleting category:', error)
    alert(error.response?.data?.error || 'Failed to delete category')
  }
}

function closeModal() {
  showCreateModal.value = false
  editingCategory.value = null
  formData.value = {
    name: '',
    code: '',
    description: '',
    color: '#6366f1',
    isActive: true
  }
}
</script>
