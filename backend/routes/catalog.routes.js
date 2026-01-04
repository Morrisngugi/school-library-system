const express = require('express');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  advancedSearch,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
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

// Subjects routes
router
  .route('/subjects')
  .get(getSubjects)
  .post(protect, authorize('admin', 'librarian'), createSubject);

router
  .route('/subjects/:id')
  .put(protect, authorize('admin', 'librarian'), updateSubject)
  .delete(protect, authorize('admin'), deleteSubject);

module.exports = router;
