const express = require('express');
const {
  checkoutBook,
  returnBook,
  renewBook,
  reserveBook,
  cancelReservation,
  getMyLoans,
  getMyReservations,
  getAllTransactions,
  requestBorrow,
  approveBorrowRequest,
  rejectBorrowRequest,
  getPendingRequests,
  getMyRequests
} = require('../controllers/circulation.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// User routes
router.get('/myloans', getMyLoans);
router.get('/myreservations', getMyReservations);
router.get('/my-requests', getMyRequests);
router.post('/reserve', reserveBook);
router.put('/reserve/:id/cancel', cancelReservation);
router.post('/renew/:transactionId', renewBook);
router.post('/request-borrow', requestBorrow);

// Librarian routes
router.post('/checkout', authorize('admin', 'librarian'), checkoutBook);
router.post('/return', authorize('admin', 'librarian'), returnBook);
router.get('/transactions', authorize('admin', 'librarian'), getAllTransactions);
router.get('/pending-requests', authorize('admin', 'librarian'), getPendingRequests);
router.put('/approve/:transactionId', authorize('admin', 'librarian'), approveBorrowRequest);
router.put('/reject/:transactionId', authorize('admin', 'librarian'), rejectBorrowRequest);

module.exports = router;
