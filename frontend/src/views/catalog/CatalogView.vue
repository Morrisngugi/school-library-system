<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="text-xl font-bold text-primary-600">
              School Library
            </router-link>
            <div class="ml-10 flex space-x-4">
              <router-link to="/catalog" class="text-gray-700 hover:text-primary-600 px-3 py-2">
                Catalog
              </router-link>
              <router-link v-if="isAuthenticated" to="/my-loans" class="text-gray-700 hover:text-primary-600 px-3 py-2">
                My Loans
              </router-link>
              <router-link v-if="isAuthenticated" to="/my-reservations" class="text-gray-700 hover:text-primary-600 px-3 py-2">
                Reservations
              </router-link>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <template v-if="isAuthenticated">
              <router-link v-if="isStaff" to="/admin" class="text-gray-700 hover:text-primary-600 px-3 py-2">
                Admin Panel
              </router-link>
              <router-link to="/profile" class="text-gray-700 hover:text-primary-600 px-3 py-2">
                {{ user?.firstName }}
              </router-link>
              <button @click="handleLogout" class="btn btn-secondary">
                Logout
              </button>
            </template>
            <template v-else>
              <router-link to="/login" class="btn btn-secondary">
                Login
              </router-link>
              <router-link to="/register" class="btn btn-primary">
                Register
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Book Catalog</h1>
        <p class="mt-2 text-gray-600">Search and discover books in our library</p>
      </div>

      <!-- Search and Filters -->
      <div class="card mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search books by title, author, ISBN..."
              class="input"
              @keyup.enter="handleSearch"
            />
          </div>
          <div>
            <select v-model="selectedCategory" class="input">
              <option value="">All subjects</option>
              <option v-for="cat in subjects" :key="cat._id" :value="cat._id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div>
            <button @click="handleSearch" class="btn btn-primary w-full">
              Search
            </button>
          </div>
        </div>
      </div>

      <!-- Books Grid -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Loading books...</p>
      </div>

      <div v-else-if="books.length === 0" class="text-center py-12">
        <p class="text-gray-600">No books found</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="book in books"
          :key="book._id"
          class="card hover:shadow-lg transition-shadow cursor-pointer"
          @click="goToBook(book._id)"
        >
          <div class="aspect-w-3 aspect-h-4 mb-4">
            <img
              :src="book.coverImage || '/placeholder-book.png'"
              :alt="book.title"
              class="object-cover rounded"
            />
          </div>
          <h3 class="font-semibold text-gray-900 mb-1">{{ book.title }}</h3>
          <p class="text-sm text-gray-600 mb-2">{{ book.authors.join(', ') }}</p>
          <div class="flex items-center justify-between">
            <span
              :class="[
                'px-2 py-1 text-xs rounded',
                book.availableCopies > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              ]"
            >
              {{ book.availableCopies > 0 ? 'Available' : 'Not Available' }}
            </span>
            <span class="text-xs text-gray-500">
              {{ book.availableCopies }}/{{ book.totalCopies }} copies
            </span>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.pages > 1" class="mt-8 flex justify-center space-x-2">
        <button
          v-for="page in pagination.pages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-4 py-2 rounded',
            page === pagination.page
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          ]"
        >
          {{ page }}
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCatalogStore } from '@/stores/catalog'

const router = useRouter()
const authStore = useAuthStore()
const catalogStore = useCatalogStore()

const searchQuery = ref('')
const selectedCategory = ref('')

const books = computed(() => catalogStore.books)
const subjects = computed(() => catalogStore.subjects)
const loading = computed(() => catalogStore.loading)
const pagination = computed(() => catalogStore.pagination)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isStaff = computed(() => authStore.isStaff)
const user = computed(() => authStore.user)

onMounted(async () => {
  await catalogStore.fetchBooks()
  await catalogStore.fetchsubjects()
})

const handleSearch = async () => {
  await catalogStore.fetchBooks({
    search: searchQuery.value,
    category: selectedCategory.value
  })
}

const goToPage = async (page) => {
  await catalogStore.fetchBooks({
    page,
    search: searchQuery.value,
    category: selectedCategory.value
  })
}

const goToBook = (id) => {
  router.push(`/books/${id}`)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
