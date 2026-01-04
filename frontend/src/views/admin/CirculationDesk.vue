<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
        Circulation Desk
      </h2>
      <p class="mt-1 text-sm text-gray-500">Manage book checkouts, returns, and borrow requests</p>
    </div>

    <!-- Tabs -->
    <div class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'issue'"
            :class="[
              activeTab === 'issue'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Issue Book
          </button>
          <button
            @click="activeTab = 'pending'"
            :class="[
              activeTab === 'pending'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center'
            ]"
          >
            Pending Requests
            <span v-if="pendingCount > 0" class="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-semibold">
              {{ pendingCount }}
            </span>
          </button>
          <button
            @click="activeTab = 'return'"
            :class="[
              activeTab === 'return'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Return Book
          </button>
          <button
            @click="activeTab = 'active'"
            :class="[
              activeTab === 'active'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Active Loans
          </button>
        </nav>
      </div>
    </div>

    <!-- Issue Book Tab -->
    <div v-if="activeTab === 'issue'" class="bg-white shadow sm:rounded-lg">
      <div class="px-6 py-5 border-b border-gray-200">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Issue Book to User</h3>
        <p class="mt-1 text-sm text-gray-500">Search and select a user and book to issue directly</p>
      </div>
      
      <div class="px-6 py-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Select User
            </span>
          </label>
          <input
            v-model="searchUser"
            @input="searchUsers"
            type="text"
            placeholder="Search by name, email, or membership ID..."
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <div v-if="userResults.length > 0" class="mt-2 border border-gray-200 rounded-md max-h-60 overflow-y-auto shadow-sm">
            <div
              v-for="user in userResults"
              :key="user._id"
              @click="selectUser(user)"
              class="px-4 py-3 hover:bg-indigo-50 cursor-pointer flex justify-between items-center border-b border-gray-100 last:border-0 transition-colors"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span class="text-sm font-medium text-indigo-800">{{ user.firstName[0] }}{{ user.lastName[0] }}</span>
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
                  <div class="text-xs text-gray-500">{{ user.membershipId }} • {{ user.email }}</div>
                </div>
              </div>
              <div class="text-xs flex items-center space-x-2">
                <span :class="getRoleBadgeClass(user.role)" class="px-2 py-1 rounded-full font-medium">{{ user.role }}</span>
                <span class="text-gray-600 font-medium">{{ user.currentBooksCount }}/{{ user.maxBooksAllowed }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedUser" class="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <span class="text-base font-medium text-indigo-800">{{ selectedUser.firstName[0] }}{{ selectedUser.lastName[0] }}</span>
              </div>
              <div class="ml-4">
                <h4 class="text-sm font-semibold text-gray-900">{{ selectedUser.firstName }} {{ selectedUser.lastName }}</h4>
                <p class="text-sm text-gray-600">{{ selectedUser.membershipId }} • {{ selectedUser.role }}</p>
                <p class="text-xs text-gray-500 mt-1">
                  <span class="font-medium">Books:</span> {{ selectedUser.currentBooksCount }}/{{ selectedUser.maxBooksAllowed }} • 
                  <span class="font-medium">Email:</span> {{ selectedUser.email }}
                </p>
              </div>
            </div>
            <button
              @click="selectedUser = null"
              class="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Change
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Select Book
            </span>
          </label>
          <input
            v-model="searchBook"
            @input="searchBooks"
            type="text"
            placeholder="Search by title, ISBN, or barcode..."
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <div v-if="bookResults.length > 0" class="mt-2 border border-gray-200 rounded-md max-h-60 overflow-y-auto shadow-sm">
            <div
              v-for="book in bookResults"
              :key="book._id"
              @click="selectBook(book)"
              class="px-4 py-3 hover:bg-green-50 cursor-pointer flex justify-between items-center border-b border-gray-100 last:border-0 transition-colors"
            >
              <div class="flex items-center flex-1">
                <div class="flex-shrink-0">
                  <img
                    v-if="book.coverImage"
                    :src="`http://localhost:5000${book.coverImage}`"
                    class="w-10 h-14 object-cover rounded shadow-sm"
                    :alt="book.title"
                  />
                  <div v-else class="w-10 h-14 bg-gray-200 rounded shadow-sm flex items-center justify-center">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">{{ book.title }}</div>
                  <div class="text-xs text-gray-500">{{ book.authors?.join(', ') || 'Unknown Author' }}</div>
                </div>
              </div>
              <span
                class="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="book.availableCopies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                <svg v-if="book.availableCopies > 0" class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                {{ book.availableCopies }} available
              </span>
            </div>
          </div>
        </div>

        <div v-if="selectedBook" class="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-start justify-between">
            <div class="flex items-start">
              <img
                v-if="selectedBook.coverImage"
                :src="`http://localhost:5000${selectedBook.coverImage}`"
                class="w-16 h-24 object-cover rounded shadow-md"
                :alt="selectedBook.title"
              />
              <div class="ml-4">
                <h4 class="text-sm font-semibold text-gray-900">{{ selectedBook.title }}</h4>
                <p class="text-sm text-gray-600 mt-1">{{ selectedBook.authors?.join(', ') || 'Unknown Author' }}</p>
                <p class="text-xs text-gray-500 mt-2">
                  <span class="font-medium">Available:</span> {{ selectedBook.availableCopies }} of {{ selectedBook.totalCopies }} copies
                </p>
              </div>
            </div>
            <button
              @click="selectedBook = null"
              class="text-sm text-green-600 hover:text-green-800 font-medium flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Change
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Due Date
            </span>
          </label>
          <input
            v-model="dueDate"
            type="date"
            :min="minDate"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            @click="resetIssueForm"
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          <button
            @click="issueBook"
            :disabled="!selectedUser || !selectedBook || submitting"
            class="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg v-if="!submitting" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ submitting ? 'Issuing Book...' : 'Issue Book' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Pending Requests Tab -->
    <div v-if="activeTab === 'pending'">
      <div v-if="loadingRequests" class="bg-white shadow sm:rounded-lg p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p class="mt-4 text-sm text-gray-600">Loading pending requests...</p>
      </div>

      <div v-else-if="pendingRequests.length === 0" class="bg-white shadow sm:rounded-lg p-12">
        <div class="text-center">
          <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">No pending requests</h3>
          <p class="mt-2 text-sm text-gray-500">All borrow requests have been processed or there are no new requests at this time.</p>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="request in pendingRequests"
          :key="request._id"
          class="bg-white shadow sm:rounded-lg p-6"
        >
          <div class="flex items-start justify-between">
            <div class="flex space-x-4 flex-1">
              <div class="flex-shrink-0">
                <img
                  v-if="request.book.coverImage"
                  :src="`http://localhost:5000${request.book.coverImage}`"
                  class="w-20 h-28 object-cover rounded shadow-md"
                  :alt="request.book.title"
                />
                <div v-else class="w-20 h-28 bg-gray-200 rounded shadow-md flex items-center justify-center">
                  <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <h4 class="text-lg font-semibold text-gray-900 mb-1">{{ request.book.title }}</h4>
                    <p class="text-sm text-gray-600">by {{ request.book.authors?.join(', ') || 'Unknown Author' }}</p>
                  </div>
                  <span class="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                    </svg>
                    Pending
                  </span>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Requested by</p>
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-indigo-800">{{ request.user.firstName[0] }}{{ request.user.lastName[0] }}</span>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">{{ request.user.firstName }} {{ request.user.lastName }}</p>
                        <p class="text-xs text-gray-500">{{ request.user.membershipId }}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Borrowing Status</p>
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="request.user.currentBooksCount < request.user.maxBooksAllowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                        {{ request.user.currentBooksCount }}/{{ request.user.maxBooksAllowed }} books
                      </span>
                      <span :class="getRoleBadgeClass(request.user.role)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                        {{ request.user.role }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">{{ request.user.email }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Request Details</p>
                    <p class="text-sm text-gray-900">Due: {{ formatDate(request.dueDate) }}</p>
                    <p class="text-xs text-gray-500 mt-1">Requested {{ formatTimeAgo(request.createdAt) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="ml-6 flex flex-col space-y-2 flex-shrink-0">
              <button
                @click="approveRequest(request._id)"
                class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Approve
              </button>
              <button
                @click="showRejectModal(request)"
                class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Return Book Tab -->
    <div v-if="activeTab === 'return'" class="bg-white shadow sm:rounded-lg">
      <div class="p-12 text-center">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Process Book Returns</h3>
        <p class="mt-2 text-sm text-gray-500 max-w-md mx-auto">
          Navigate to the <strong>Active Loans</strong> tab to view all currently borrowed books. 
          Click the <strong>Return</strong> button next to any loan to process the return.
        </p>
        <button
          @click="activeTab = 'active'"
          class="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          View Active Loans
          <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Active Loans Tab -->
    <div v-if="activeTab === 'active'">
      <div v-if="loadingLoans" class="bg-white shadow sm:rounded-lg p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p class="mt-4 text-sm text-gray-600">Loading active loans...</p>
      </div>

      <div v-else-if="activeLoans.length === 0" class="bg-white shadow sm:rounded-lg p-12">
        <div class="text-center">
          <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">No active loans</h3>
          <p class="mt-2 text-sm text-gray-500">All books have been returned or no books are currently checked out.</p>
        </div>
      </div>

      <div v-else class="bg-white shadow sm:rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">Active Loans</h3>
              <p class="mt-1 text-sm text-gray-500">{{ activeLoans.length }} books currently checked out</p>
            </div>
            <button
              @click="fetchActiveLoans"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Checkout Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="loan in activeLoans" :key="loan._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span class="text-sm font-medium text-indigo-800">{{ loan.user.firstName[0] }}{{ loan.user.lastName[0] }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ loan.user.firstName }} {{ loan.user.lastName }}</div>
                    <div class="text-sm text-gray-500">{{ loan.user.membershipId }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 font-medium">{{ loan.book.title }}</div>
                <div class="text-sm text-gray-500">{{ loan.book.isbn }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(loan.checkoutDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(loan.dueDate) }}</div>
                <div class="text-xs" :class="isOverdue(loan.dueDate) ? 'text-red-600 font-medium' : 'text-gray-500'">
                  {{ getDaysUntilDue(loan.dueDate) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(loan.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ loan.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="showReturnModal(loan)"
                  class="inline-flex items-center text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Return
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectForm" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showRejectForm = false"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Reject Borrow Request
            </h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
              <textarea
                v-model="rejectionReason"
                rows="4"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter reason for rejection..."
              ></textarea>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="confirmReject"
              :disabled="!rejectionReason || submitting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 disabled:bg-gray-400 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ submitting ? 'Rejecting...' : 'Reject Request' }}
            </button>
            <button
              @click="showRejectForm = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Return Modal -->
    <div v-if="showReturnForm" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showReturnForm = false"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Return Book
            </h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Book Condition on Return</label>
                <select
                  v-model="returnForm.conditionOnReturn"
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="new">New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                <textarea
                  v-model="returnForm.notes"
                  rows="3"
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Any notes about the return..."
                ></textarea>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="confirmReturn"
              :disabled="!returnForm.conditionOnReturn || submitting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 disabled:bg-gray-400 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ submitting ? 'Processing...' : 'Confirm Return' }}
            </button>
            <button
              @click="showReturnForm = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'

const activeTab = ref('pending')
const submitting = ref(false)

// Issue Book
const searchUser = ref('')
const searchBook = ref('')
const userResults = ref([])
const bookResults = ref([])
const selectedUser = ref(null)
const selectedBook = ref(null)
const dueDate = ref('')

// Pending Requests
const pendingRequests = ref([])
const pendingCount = ref(0)
const loadingRequests = ref(false)

// Active Loans
const activeLoans = ref([])
const loadingLoans = ref(false)

// Reject Modal
const showRejectForm = ref(false)
const rejectionReason = ref('')
const selectedRequest = ref(null)

// Return Modal
const showReturnForm = ref(false)
const returnForm = ref({
  transactionId: null,
  conditionOnReturn: 'good',
  notes: ''
})

const minDate = computed(() => {
  const today = new Date()
  today.setDate(today.getDate() + 1)
  return today.toISOString().split('T')[0]
})

onMounted(() => {
  setDefaultDueDate()
  fetchPendingRequests()
  fetchActiveLoans()
})

function setDefaultDueDate() {
  const date = new Date()
  date.setDate(date.getDate() + 14) // Default 14 days loan period
  dueDate.value = date.toISOString().split('T')[0]
}

async function searchUsers() {
  if (searchUser.value.length < 2) {
    userResults.value = []
    return
  }

  try {
    const response = await api.get('/users', {
      params: { 
        search: searchUser.value,
        limit: 10
      }
    })
    userResults.value = response.data.data.filter(u => 
      u.role === 'student' || u.role === 'teacher'
    )
  } catch (error) {
    console.error('Error searching users:', error)
  }
}

async function searchBooks() {
  if (searchBook.value.length < 2) {
    bookResults.value = []
    return
  }

  try {
    const response = await api.get('/catalog/books', {
      params: { 
        search: searchBook.value,
        limit: 10
      }
    })
    bookResults.value = response.data.data
  } catch (error) {
    console.error('Error searching books:', error)
  }
}

function selectUser(user) {
  selectedUser.value = user
  userResults.value = []
  searchUser.value = ''
}

function selectBook(book) {
  selectedBook.value = book
  bookResults.value = []
  searchBook.value = ''
}

function resetIssueForm() {
  selectedUser.value = null
  selectedBook.value = null
  searchUser.value = ''
  searchBook.value = ''
  userResults.value = []
  bookResults.value = []
  setDefaultDueDate()
}

async function issueBook() {
  if (!selectedUser.value || !selectedBook.value) return

  submitting.value = true
  try {
    await api.post('/circulation/checkout', {
      userId: selectedUser.value._id,
      bookId: selectedBook.value._id,
      dueDate: dueDate.value
    })

    alert('Book issued successfully!')
    resetIssueForm()
    fetchActiveLoans()
  } catch (error) {
    console.error('Error issuing book:', error)
    alert(error.response?.data?.error || 'Failed to issue book')
  } finally {
    submitting.value = false
  }
}

async function fetchPendingRequests() {
  loadingRequests.value = true
  try {
    const response = await api.get('/circulation/pending-requests')
    pendingRequests.value = response.data.data
    pendingCount.value = response.data.count
  } catch (error) {
    console.error('Error fetching pending requests:', error)
  } finally {
    loadingRequests.value = false
  }
}

async function approveRequest(transactionId) {
  if (!confirm('Approve this borrow request?')) return

  try {
    await api.put(`/circulation/approve/${transactionId}`)
    alert('Request approved successfully!')
    fetchPendingRequests()
    fetchActiveLoans()
  } catch (error) {
    console.error('Error approving request:', error)
    alert(error.response?.data?.error || 'Failed to approve request')
  }
}

function showRejectModal(request) {
  selectedRequest.value = request
  rejectionReason.value = ''
  showRejectForm.value = true
}

async function confirmReject() {
  if (!rejectionReason.value) return

  submitting.value = true
  try {
    await api.put(`/circulation/reject/${selectedRequest.value._id}`, {
      reason: rejectionReason.value
    })
    alert('Request rejected')
    showRejectForm.value = false
    fetchPendingRequests()
  } catch (error) {
    console.error('Error rejecting request:', error)
    alert(error.response?.data?.error || 'Failed to reject request')
  } finally {
    submitting.value = false
  }
}

async function fetchActiveLoans() {
  loadingLoans.value = true
  try {
    const response = await api.get('/circulation/transactions', {
      params: { status: 'active' }
    })
    activeLoans.value = response.data.data
  } catch (error) {
    console.error('Error fetching active loans:', error)
  } finally {
    loadingLoans.value = false
  }
}

function showReturnModal(loan) {
  returnForm.value = {
    transactionId: loan._id,
    conditionOnReturn: 'good',
    notes: ''
  }
  showReturnForm.value = true
}

async function confirmReturn() {
  submitting.value = true
  try {
    await api.post('/circulation/return', returnForm.value)
    alert('Book returned successfully!')
    showReturnForm.value = false
    fetchActiveLoans()
  } catch (error) {
    console.error('Error returning book:', error)
    alert(error.response?.data?.error || 'Failed to return book')
  } finally {
    submitting.value = false
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
    overdue: 'bg-red-100 text-red-800',
    returned: 'bg-gray-100 text-gray-800'
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

function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
  return formatDate(date)
}

function isOverdue(dueDate) {
  return new Date(dueDate) < new Date()
}

function getDaysUntilDue(dueDate) {
  const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24))
  
  if (days < 0) {
    return `${Math.abs(days)} days overdue`
  } else if (days === 0) {
    return 'Due today'
  } else if (days === 1) {
    return 'Due tomorrow'
  } else {
    return `Due in ${days} days`
  }
}

</script>
