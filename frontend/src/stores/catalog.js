import { defineStore } from 'pinia'
import { ref } from 'vue'
import { bookService, subjectService } from '@/services'

export const useCatalogStore = defineStore('catalog', () => {
  const books = ref([])
  const subjects = ref([])
  const currentBook = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({})

  const fetchBooks = async (params = {}) => {
    try {
      loading.value = true
      error.value = null
      const response = await bookService.getBooks(params)
      books.value = response.data
      pagination.value = response.pagination
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to fetch books'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchBook = async (id) => {
    try {
      loading.value = true
      const response = await bookService.getBook(id)
      currentBook.value = response.data
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to fetch book'
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchBooks = async (searchData) => {
    try {
      loading.value = true
      const response = await bookService.searchBooks(searchData)
      books.value = response.data
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Search failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createBook = async (bookData) => {
    try {
      loading.value = true
      const response = await bookService.createBook(bookData)
      books.value.unshift(response.data)
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to create book'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateBook = async (id, bookData) => {
    try {
      loading.value = true
      const response = await bookService.updateBook(id, bookData)
      const index = books.value.findIndex(b => b._id === id)
      if (index !== -1) {
        books.value[index] = response.data
      }
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to update book'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteBook = async (id) => {
    try {
      loading.value = true
      await bookService.deleteBook(id)
      books.value = books.value.filter(b => b._id !== id)
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to delete book'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await subjectService.getSubjects()
      subjects.value = response.data
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to fetch subjects'
      throw err
    }
  }

  return {
    books,
    subjects,
    currentBook,
    loading,
    error,
    pagination,
    fetchBooks,
    fetchBook,
    searchBooks,
    createBook,
    updateBook,
    deleteBook,
    fetchSubjects
  }
})
