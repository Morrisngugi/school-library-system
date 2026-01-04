const express = require('express');
const {
  sendNotification,
  sendDueReminder,
  sendOverdueNotice
} = require('../controllers/notification.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');

// All routes require authentication and librarian/admin role
router.use(protect);
router.use(authorize('admin', 'librarian'));

router.post('/send', sendNotification);
router.post('/send-reminder', sendDueReminder);
router.post('/send-overdue', sendOverdueNotice);

module.exports = router;
