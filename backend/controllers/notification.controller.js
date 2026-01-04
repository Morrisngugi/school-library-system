const asyncHandler = require('../middleware/async.middleware');
const Notification = require('../models/Notification.model');
const { sendEmail } = require('../utils/email');
const { sendSMS } = require('../utils/sms');

// @desc    Get user notifications
// @route   GET /api/v1/notify/my-notifications
// @access  Private
exports.getMyNotifications = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;
  
  let query = { recipient: req.user.id };
  if (unreadOnly === 'true') {
    query.isRead = false;
  }
  
  const notifications = await Notification.find(query)
    .populate('sender', 'firstName lastName')
    .populate('relatedBook', 'title coverImage')
    .populate('relatedUser', 'firstName lastName membershipId')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
  
  const count = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ 
    recipient: req.user.id, 
    isRead: false 
  });
  
  res.status(200).json({
    success: true,
    count,
    unreadCount,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit)
    },
    data: notifications
  });
});

// @desc    Mark notification as read
// @route   PUT /api/v1/notify/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);
  
  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }
  
  if (notification.recipient.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }
  
  await notification.markAsRead();
  
  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/v1/notify/mark-all-read
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { recipient: req.user.id, isRead: false },
    { isRead: true, readAt: new Date() }
  );
  
  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// @desc    Delete notification
// @route   DELETE /api/v1/notify/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);
  
  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }
  
  if (notification.recipient.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }
  
  await notification.deleteOne();
  
  res.status(200).json({
    success: true,
    message: 'Notification deleted'
  });
});

// @desc    Send notification (email or SMS)
// @route   POST /api/v1/notify/send
// @access  Private/Admin/Librarian
exports.sendNotification = asyncHandler(async (req, res, next) => {
  const { recipients, type, subject, message, channel } = req.body;
  
  let results = [];
  
  for (const recipient of recipients) {
    try {
      if (channel === 'email' || channel === 'both') {
        await sendEmail({
          to: recipient.email,
          subject: subject,
          text: message,
          html: `<p>${message}</p>`
        });
        
        results.push({ 
          recipient: recipient.email, 
          channel: 'email', 
          status: 'sent' 
        });
      }
      
      if (channel === 'sms' || channel === 'both') {
        await sendSMS({
          to: recipient.phone,
          message: message
        });
        
        results.push({ 
          recipient: recipient.phone, 
          channel: 'sms', 
          status: 'sent' 
        });
      }
    } catch (error) {
      results.push({ 
        recipient: recipient.email || recipient.phone, 
        status: 'failed', 
        error: error.message 
      });
    }
  }
  
  res.status(200).json({
    success: true,
    data: results
  });
});

// @desc    Send reminder for due books
// @route   POST /api/v1/notify/send-reminder
// @access  Private/Librarian
exports.sendDueReminder = asyncHandler(async (req, res, next) => {
  const Transaction = require('../models/Transaction.model');
  
  // Get transactions due in 2 days
  const twoDaysFromNow = new Date();
  twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
  
  const dueTransactions = await Transaction.find({
    status: 'active',
    dueDate: { $lte: twoDaysFromNow, $gte: new Date() }
  }).populate('user book');
  
  let sent = 0;
  let failed = 0;
  
  for (const transaction of dueTransactions) {
    try {
      const message = `Dear ${transaction.user.firstName}, your book "${transaction.book.title}" is due on ${transaction.dueDate.toDateString()}. Please return it on time to avoid fines.`;
      
      await sendEmail({
        to: transaction.user.email,
        subject: 'Library Book Due Reminder',
        text: message,
        html: `<p>${message}</p>`
      });
      
      sent++;
    } catch (error) {
      failed++;
    }
  }
  
  res.status(200).json({
    success: true,
    message: `Reminders sent: ${sent}, Failed: ${failed}`,
    total: dueTransactions.length
  });
});

// @desc    Send overdue notice
// @route   POST /api/v1/notify/send-overdue
// @access  Private/Librarian
exports.sendOverdueNotice = asyncHandler(async (req, res, next) => {
  const Transaction = require('../models/Transaction.model');
  
  const overdueTransactions = await Transaction.find({
    status: { $in: ['active', 'overdue'] },
    dueDate: { $lt: new Date() }
  }).populate('user book');
  
  let sent = 0;
  let failed = 0;
  
  for (const transaction of overdueTransactions) {
    try {
      const daysOverdue = Math.floor((new Date() - transaction.dueDate) / (1000 * 60 * 60 * 24));
      const fine = daysOverdue * parseFloat(process.env.FINE_PER_DAY || 10);
      
      const message = `Dear ${transaction.user.firstName}, your book "${transaction.book.title}" is ${daysOverdue} days overdue. Fine: KSH ${fine}. Please return immediately.`;
      
      await sendEmail({
        to: transaction.user.email,
        subject: 'Library Book Overdue Notice',
        text: message,
        html: `<p><strong>OVERDUE NOTICE</strong></p><p>${message}</p>`
      });
      
      // Also send SMS for overdue
      await sendSMS({
        to: transaction.user.phone,
        message: message.substring(0, 160) // SMS character limit
      });
      
      sent++;
    } catch (error) {
      failed++;
    }
  }
  
  res.status(200).json({
    success: true,
    message: `Overdue notices sent: ${sent}, Failed: ${failed}`,
    total: overdueTransactions.length
  });
});
