<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Use the same nav from CatalogView or create a shared component -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="text-xl font-bold text-primary-600">
              School Library
            </router-link>
          </div>
          <div class="flex items-center">
            <router-link to="/catalog" class="btn btn-secondary">
              Back to Catalog
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Loading book details...</p>
      </div>

      <div v-else-if="book" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Book Cover -->
        <div>
          <img
            :src="book.coverImage || '/placeholder-book.png'"
            :alt="book.title"
            class="w-full rounded-lg shadow-lg"
          />
        </div>

        <!-- Book Details -->
        <div class="md:col-span-2 space-y-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ book.title }}</h1>
            <p v-if="book.subtitle" class="text-xl text-gray-600 mb-4">{{ book.subtitle }}</p>
            <p class="text-lg text-gray-700">by {{ book.authors.join(', ') }}</p>
          </div>

          <!-- Availability Status -->
          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Availability</p>
                <p class="text-2xl font-bold" :class="book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'">
                  {{ book.availableCopies > 0 ? 'Available' : 'Not Available' }}
                </p>
                <p class="text-sm text-gray-600 mt-1">
                  {{ book.availableCopies }} of {{ book.totalCopies }} copies available
                </p>
              </div>
              <div v-if="isAuthenticated" class="space-x-2">
                <button
                  v-if="book.availableCopies > 0"
                  class="btn btn-primary"
                  disabled
                >
                  Visit Library to Borrow
                </button>
                <button
                  v-else
                  @click="handleReserve"
                  class="btn btn-primary"
                  :disabled="reserving"
                >
                  {{ reserving ? 'Reserving...' : 'Reserve Book' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Book Information -->
          <div class="card">
            <h2 class="text-xl font-bold mb-4">Book Information</h2>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-if="book.isbn">
                <dt class="text-sm font-medium text-gray-500">ISBN</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ book.isbn }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Barcode</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ book.barcode }}</dd>
              </div>
              <div v-if="book.publisher">
                <dt class="text-sm font-medium text-gray-500">Publisher</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ book.publisher }}</dd>
              </div>
              <div v-if="book.publicationYear">
                <dt class="text-sm font-medium text-gray-500">Year</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ book.publicationYear }}</dd>
              </div>
              <div v-if="book.pages">
                <dt class="text-sm font-medium text-gray-500">Pages</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ book.pages }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Language</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ book.language }}</dd>
              </div>
              <div v-if="book.category">
                <dt class="text-sm font-medium text-gray-500">Category</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ book.category.name }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Location</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ book.location.floor }}, Rack {{ book.location.rack }}, Shelf {{ book.location.shelf }}
                </dd>
              </div>
            </dl>
          </div>

          <!-- Description -->
          <div v-if="book.description" class="card">
            <h2 class="text-xl font-bold mb-4">Description</h2>
            <p class="text-gray-700">{{ book.description }}</p>
          </div>

          <!-- Subjects/Tags -->
          <div v-if="book.subjects && book.subjects.length" class="card">
            <h2 class="text-xl font-bold mb-4">Subjects</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="subject in book.subjects"
                :key="subject"
                class="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
              >
                {{ subject }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCatalogStore } from '@/stores/catalog'
import { useCirculationStore } from '@/stores/circulation'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const catalogStore = useCatalogStore()
const circulationStore = useCirculationStore()

const book = computed(() => catalogStore.currentBook)
const loading = computed(() => catalogStore.loading)
const isAuthenticated = computed(() => authStore.isAuthenticated)

const reserving = ref(false)

onMounted(async () => {
  await catalogStore.fetchBook(route.params.id)
})

const handleReserve = async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  try {
    reserving.value = true
    await circulationStore.reserveBook(book.value._id)
    alert('Book reserved successfully! You will be notified when it becomes available.')
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to reserve book')
  } finally {
    reserving.value = false
  }
}
</script>
