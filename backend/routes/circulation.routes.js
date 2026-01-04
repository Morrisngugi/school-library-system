const express = require('express');
const {
  checkoutBook,
  returnBook,
  renewBook,
  reserveBook,
  cancelReservation,
  getMyLoans,
  getMyReservations,
  getAllTransactions
} = require('../controllers/circulation.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// User routes
router.get('/myloans', getMyLoans);
router.get('/myreservations', getMyReservations);
router.post('/reserve', reserveBook);
router.put('/reserve/:id/cancel', cancelReservation);
router.post('/renew/:transactionId', renewBook);

// Librarian routes
router.post('/checkout', authorize('admin', 'librarian'), checkoutBook);
router.post('/return', authorize('admin', 'librarian'), returnBook);
router.get('/transactions', authorize('admin', 'librarian'), getAllTransactions);

module.exports = router;
