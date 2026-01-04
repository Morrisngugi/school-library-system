<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between mb-6">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
          Books Management
        </h2>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <button @click="showCreateModal = true" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Book
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white shadow rounded-lg p-4 mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <input v-model="filters.search" @input="fetchBooks" type="text" placeholder="Search title, author, ISBN..." class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        </div>
        <div>
          <select v-model="filters.category" @change="fetchBooks" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
          </select>
        </div>
        <div>
          <select v-model="filters.status" @change="fetchBooks" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
            <option value="reserved">Reserved</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <button @click="resetFilters" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          Reset
        </button>
      </div>
    </div>

    <!-- Books Grid -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="books.length === 0" class="bg-white shadow rounded-lg p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No books found</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by adding a new book to the catalog.</p>
    </div>

    <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ISBN/Barcode</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Copies</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="book in books" :key="book._id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-16 w-12 bg-gray-200 rounded flex items-center justify-center">
                  <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ book.title }}</div>
                  <div class="text-sm text-gray-500">{{ book.authors?.join(', ') }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                {{ book.category?.name || 'N/A' }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              <div>ISBN: {{ book.isbn || 'N/A' }}</div>
              <div>{{ book.barcode }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">{{ book.availableCopies }}/{{ book.totalCopies }}</div>
              <div class="text-xs text-gray-500">Available/Total</div>
            </td>
            <td class="px-6 py-4">
              <span :class="getStatusClass(book.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ book.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-right text-sm font-medium space-x-2">
              <button @click="editBook(book)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
              <button @click="deleteBook(book._id)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination.pages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Page {{ pagination.page }} of {{ pagination.pages }}
          </div>
          <div class="space-x-2">
            <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1" class="px-3 py-1 border rounded text-sm">Previous</button>
            <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.pages" class="px-3 py-1 border rounded text-sm">Next</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="closeModal"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form @submit.prevent="saveBook">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[80vh] overflow-y-auto">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                {{ editingBook ? 'Edit Book' : 'Add New Book' }}
              </h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700">Title *</label>
                  <input v-model="formData.title" required type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700">Authors * (comma separated)</label>
                  <input v-model="authorsInput" required type="text" placeholder="John Doe, Jane Smith" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">ISBN</label>
                  <input v-model="formData.isbn" type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Barcode *</label>
                  <input v-model="formData.barcode" required type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Category *</label>
                  <select v-model="formData.category" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="">Select Category</option>
                    <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Publisher</label>
                  <input v-model="formData.publisher" type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Publication Year</label>
                  <input v-model.number="formData.publicationYear" type="number" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Language</label>
                  <input v-model="formData.language" type="text" placeholder="English" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Total Copies *</label>
                  <input v-model.number="formData.totalCopies" required type="number" min="1" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Available Copies</label>
                  <input v-model.number="formData.availableCopies" type="number" min="0" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Status</label>
                  <select v-model="formData.status" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="available">Available</option>
                    <option value="borrowed">Borrowed</option>
                    <option value="reserved">Reserved</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea v-model="formData.description" rows="3" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                </div>

                <div class="col-span-2">
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Location</h4>
                  <div class="grid grid-cols-3 gap-2">
                    <div>
                      <label class="block text-xs text-gray-500">Shelf</label>
                      <input v-model="formData.location.shelf" type="text" placeholder="A1" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm">
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500">Rack</label>
                      <input v-model="formData.location.rack" type="text" placeholder="R5" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm">
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500">Floor</label>
                      <input v-model.number="formData.location.floor" type="number" placeholder="1" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm">
                    </div>
                  </div>
                </div>

                <div class="col-span-2">
                  <label class="flex items-center">
                    <input v-model="formData.isPopular" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                    <span class="ml-2 text-sm text-gray-700">Mark as Popular Book</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="submit" :disabled="submitting" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">
                {{ submitting ? 'Saving...' : 'Save Book' }}
              </button>
              <button type="button" @click="closeModal" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">
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
import axios from 'axios'

const books = ref([])
const categories = ref([])
const loading = ref(false)
const submitting = ref(false)
const showCreateModal = ref(false)
const editingBook = ref(null)
const authorsInput = ref('')

const filters = ref({
  search: '',
  category: '',
  status: '',
  page: 1
})

const pagination = ref({
  page: 1,
  limit: 10,
  pages: 1
})

const formData = ref({
  title: '',
  authors: [],
  isbn: '',
  barcode: '',
  category: '',
  publisher: '',
  publicationYear: new Date().getFullYear(),
  language: 'English',
  totalCopies: 1,
  availableCopies: 1,
  status: 'available',
  description: '',
  location: { shelf: '', rack: '', floor: 1 },
  isPopular: false
})

onMounted(() => {
  fetchCategories()
  fetchBooks()
})

async function fetchCategories() {
  try {
    const response = await axios.get('/api/v1/catalog/categories')
    categories.value = response.data.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

async function fetchBooks() {
  loading.value = true
  try {
    const params = {
      page: filters.value.page,
      limit: pagination.value.limit,
      ...(filters.value.search && { search: filters.value.search }),
      ...(filters.value.category && { category: filters.value.category }),
      ...(filters.value.status && { status: filters.value.status })
    }
    
    const response = await axios.get('/api/v1/catalog/books', { params })
    books.value = response.data.data
    pagination.value = response.data.pagination
  } catch (error) {
    console.error('Error fetching books:', error)
    alert('Failed to load books')
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  filters.value = { search: '', category: '', status: '', page: 1 }
  fetchBooks()
}

function changePage(page) {
  filters.value.page = page
  fetchBooks()
}

function editBook(book) {
  editingBook.value = book
  authorsInput.value = book.authors?.join(', ') || ''
  formData.value = {
    title: book.title,
    authors: book.authors || [],
    isbn: book.isbn || '',
    barcode: book.barcode,
    category: book.category?._id || '',
    publisher: book.publisher || '',
    publicationYear: book.publicationYear || new Date().getFullYear(),
    language: book.language || 'English',
    totalCopies: book.totalCopies,
    availableCopies: book.availableCopies,
    status: book.status,
    description: book.description || '',
    location: book.location || { shelf: '', rack: '', floor: 1 },
    isPopular: book.isPopular || false
  }
  showCreateModal.value = true
}

async function saveBook() {
  submitting.value = true
  try {
    // Parse authors from comma-separated input
    formData.value.authors = authorsInput.value.split(',').map(a => a.trim()).filter(a => a)
    
    if (editingBook.value) {
      await axios.put(`/api/v1/catalog/books/${editingBook.value._id}`, formData.value)
    } else {
      await axios.post('/api/v1/catalog/books', formData.value)
    }
    closeModal()
    fetchBooks()
    alert(`Book ${editingBook.value ? 'updated' : 'added'} successfully!`)
  } catch (error) {
    console.error('Error saving book:', error)
    alert(error.response?.data?.error || 'Failed to save book')
  } finally {
    submitting.value = false
  }
}

async function deleteBook(bookId) {
  if (!confirm('Are you sure you want to delete this book?')) return
  
  try {
    await axios.delete(`/api/v1/catalog/books/${bookId}`)
    fetchBooks()
    alert('Book deleted successfully!')
  } catch (error) {
    console.error('Error deleting book:', error)
    alert('Failed to delete book')
  }
}

function closeModal() {
  showCreateModal.value = false
  editingBook.value = null
  authorsInput.value = ''
  formData.value = {
    title: '',
    authors: [],
    isbn: '',
    barcode: '',
    category: '',
    publisher: '',
    publicationYear: new Date().getFullYear(),
    language: 'English',
    totalCopies: 1,
    availableCopies: 1,
    status: 'available',
    description: '',
    location: { shelf: '', rack: '', floor: 1 },
    isPopular: false
  }
}

function getStatusClass(status) {
  const classes = {
    available: 'bg-green-100 text-green-800',
    borrowed: 'bg-yellow-100 text-yellow-800',
    reserved: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}
</script>
