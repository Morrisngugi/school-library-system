const express = require('express');
const {
  getFines,
  getFine,
  payFine,
  waiveFine,
  getMyFines,
  getFinesSummary
} = require('../controllers/fines.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

router.get('/my', getMyFines);
router.get('/summary', authorize('admin', 'librarian'), getFinesSummary);

router
  .route('/')
  .get(authorize('admin', 'librarian'), getFines);

router
  .route('/:id')
  .get(getFine);

router.post('/:id/pay', authorize('admin', 'librarian'), payFine);
router.put('/:id/waive', authorize('admin', 'librarian'), waiveFine);

module.exports = router;
