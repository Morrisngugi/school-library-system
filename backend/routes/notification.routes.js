const express = require('express');
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendNotification,
  sendDueReminder,
  sendOverdueNotice
} = require('../controllers/notification.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// User notification routes
router.get('/my-notifications', getMyNotifications);
router.put('/:id/read', markAsRead);
router.put('/mark-all-read', markAllAsRead);
router.delete('/:id', deleteNotification);

// Admin/Librarian routes
router.post('/send', authorize('admin', 'librarian'), sendNotification);
router.post('/send-reminder', authorize('admin', 'librarian'), sendDueReminder);
router.post('/send-overdue', authorize('admin', 'librarian'), sendOverdueNotice);

module.exports = router;
