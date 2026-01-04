const express = require('express');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  advancedSearch,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadBookPhoto
} = require('../controllers/catalog.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadImage } = require('../middleware/upload.middleware');

// Books routes
router
  .route('/books')
  .get(getBooks)
  .post(protect, authorize('admin', 'librarian'), createBook);

router.post('/search', advancedSearch);

router
  .route('/books/:id')
  .get(getBook)
  .put(protect, authorize('admin', 'librarian'), updateBook)
  .delete(protect, authorize('admin'), deleteBook);

router.put(
  '/books/:id/photo',
  protect,
  authorize('admin', 'librarian'),
  uploadImage.single('cover'),
  uploadBookPhoto
);

// Categories routes
router
  .route('/categories')
  .get(getCategories)
  .post(protect, authorize('admin', 'librarian'), createCategory);

router
  .route('/categories/:id')
  .put(protect, authorize('admin', 'librarian'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;
