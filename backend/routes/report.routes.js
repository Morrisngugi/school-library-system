const express = require('express');
const {
  getDashboardStats,
  getOverdueReport,
  getPopularBooks,
  getCirculationStats,
  getUserActivityReport,
  getInventoryReport,
  exportData
} = require('../controllers/report.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');

// All routes require authentication and librarian/admin role
router.use(protect);
router.use(authorize('admin', 'librarian'));

router.get('/dashboard', getDashboardStats);
router.get('/overdue', getOverdueReport);
router.get('/popular-books', getPopularBooks);
router.get('/circulation-stats', getCirculationStats);
router.get('/user-activity', getUserActivityReport);
router.get('/inventory', getInventoryReport);
router.get('/export', authorize('admin'), exportData);

module.exports = router;
