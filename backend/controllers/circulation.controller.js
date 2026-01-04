const Transaction = require('../models/Transaction.model');
const Reservation = require('../models/Reservation.model');
const Book = require('../models/Book.model');
const User = require('../models/User.model');
const Fine = require('../models/Fine.model');
const Notification = require('../models/Notification.model');
const asyncHandler = require('../middleware/async.middleware');
const ErrorResponse = require('../utils/errorResponse');
const { sendNotification } = require('../utils/notification');

// @desc    Checkout (Issue) a book
// @route   POST /api/v1/circulation/checkout
// @access  Private/Librarian
exports.checkoutBook = asyncHandler(async (req, res, next) => {
  const { userId, bookId, dueDate } = req.body;
  
  // Get user and book
  const user = await User.findById(userId);
  const book = await Book.findById(bookId);
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  
  if (!book) {
    return next(new ErrorResponse('Book not found', 404));
  }
  
  // Check if user can borrow more books
  if (!user.canBorrowMore()) {
    return next(new ErrorResponse('User cannot borrow more books. Check membership status or outstanding fines', 400));
  }
  
  // Check if user already has an active loan for this book
  const existingLoan = await Transaction.findOne({
    user: userId,
    book: bookId,
    status: { $in: ['active', 'overdue'] },
    approvalStatus: 'approved'
  });
  
  if (existingLoan) {
    return next(new ErrorResponse('User already has an active loan for this book', 400));
  }
  
  // Check if book is available
  if (book.availableCopies < 1 || book.isReference) {
    return next(new ErrorResponse('Book is not available for checkout', 400));
  }
  
  // Calculate due date if not provided
  const calculatedDueDate = dueDate || new Date(Date.now() + parseInt(process.env.LOAN_PERIOD_DAYS) * 24 * 60 * 60 * 1000);
  
  // Create transaction
  const transaction = await Transaction.create({
    type: 'checkout',
    user: userId,
    book: bookId,
    dueDate: calculatedDueDate,
    status: 'active',
    processedBy: req.user.id,
    conditionOnCheckout: book.condition
  });
  
  // Update book availability
  book.availableCopies -= 1;
  book.timesIssued += 1;
  book.updateAvailability();
  await book.save();
  
  // Update user's book count
  user.currentBooksCount += 1;
  await user.save();
  
  // Send notification
  await sendNotification(user, 'checkout', { book, transaction });
  
  // Populate and return
  await transaction.populate(['book', 'user']);
  
  res.status(201).json({
    success: true,
    data: transaction
  });
});

// @desc    Return a book
// @route   POST /api/v1/circulation/return
// @access  Private/Librarian
exports.returnBook = asyncHandler(async (req, res, next) => {
  const { transactionId, conditionOnReturn, notes } = req.body;
  
  const transaction = await Transaction.findById(transactionId).populate(['book', 'user']);
  
  if (!transaction) {
    return next(new ErrorResponse('Transaction not found', 404));
  }
  
  if (transaction.status === 'returned') {
    return next(new ErrorResponse('Book already returned', 400));
  }
  
  // Set return date
  transaction.returnDate = new Date();
  transaction.status = 'returned';
  transaction.conditionOnReturn = conditionOnReturn;
  transaction.notes = notes;
  
  // Calculate fine if overdue
  transaction.calculateFine();
  
  // Create fine record if applicable
  if (transaction.fineAmount > 0) {
    await Fine.create({
      user: transaction.user._id,
      transaction: transaction._id,
      amount: transaction.fineAmount,
      amountDue: transaction.fineAmount,
      reason: 'overdue',
      description: `Overdue fine for ${transaction.daysOverdue} days`,
      processedBy: req.user.id
    });
    
    // Update user's total fines
    await User.findByIdAndUpdate(transaction.user._id, {
      $inc: { totalFines: transaction.fineAmount }
    });
  }
  
  await transaction.save();
  
  // Update book availability
  const book = await Book.findById(transaction.book._id);
  book.availableCopies += 1;
  book.condition = conditionOnReturn;
  book.updateAvailability();
  await book.save();
  
  // Update user's book count
  await User.findByIdAndUpdate(transaction.user._id, {
    $inc: { currentBooksCount: -1 }
  });
  
  // Check if book is reserved
  const nextReservation = await Reservation.findOne({
    book: book._id,
    status: 'pending'
  }).sort({ queuePosition: 1 }).populate('user');
  
  if (nextReservation) {
    nextReservation.status = 'available';
    nextReservation.notifiedAt = new Date();
    nextReservation.notificationSent = true;
    await nextReservation.save();
    
    // Notify user
    await sendNotification(nextReservation.user, 'reservation_available', { book });
  }
  
  res.status(200).json({
    success: true,
    data: transaction,
    fine: transaction.fineAmount
  });
});

// @desc    Renew a book loan
// @route   POST /api/v1/circulation/renew/:transactionId
// @access  Private
exports.renewBook = asyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.transactionId).populate('book');
  
  if (!transaction) {
    return next(new ErrorResponse('Transaction not found', 404));
  }
  
  // Check if user owns this transaction
  if (transaction.user.toString() !== req.user.id && !['admin', 'librarian'].includes(req.user.role)) {
    return next(new ErrorResponse('Not authorized to renew this transaction', 403));
  }
  
  // Check if can renew
  if (!transaction.canRenew()) {
    return next(new ErrorResponse('Book cannot be renewed. Maximum renewals reached or book is overdue', 400));
  }
  
  // Check if book is reserved by someone else
  const hasReservation = await Reservation.countDocuments({
    book: transaction.book._id,
    status: 'pending',
    user: { $ne: transaction.user }
  });
  
  if (hasReservation > 0) {
    return next(new ErrorResponse('Book is reserved by another user', 400));
  }
  
  // Extend due date
  const newDueDate = new Date(transaction.dueDate.getTime() + parseInt(process.env.LOAN_PERIOD_DAYS) * 24 * 60 * 60 * 1000);
  transaction.dueDate = newDueDate;
  transaction.renewalCount += 1;
  
  await transaction.save();
  
  res.status(200).json({
    success: true,
    data: transaction
  });
});

// @desc    Reserve a book
// @route   POST /api/v1/circulation/reserve
// @access  Private
exports.reserveBook = asyncHandler(async (req, res, next) => {
  const { bookId } = req.body;
  const userId = req.user.id;
  
  const book = await Book.findById(bookId);
  
  if (!book) {
    return next(new ErrorResponse('Book not found', 404));
  }
  
  // Check if book is available
  if (book.availableCopies > 0) {
    return next(new ErrorResponse('Book is available. Please checkout directly', 400));
  }
  
  // Check if user already has an active reservation for this book
  const existingReservation = await Reservation.findOne({
    user: userId,
    book: bookId,
    status: { $in: ['pending', 'available'] }
  });
  
  if (existingReservation) {
    return next(new ErrorResponse('You already have a reservation for this book', 400));
  }
  
  // Get queue position
  const queueCount = await Reservation.countDocuments({
    book: bookId,
    status: 'pending'
  });
  
  // Create reservation
  const reservation = await Reservation.create({
    user: userId,
    book: bookId,
    queuePosition: queueCount + 1,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  });
  
  await reservation.populate(['book', 'user']);
  
  res.status(201).json({
    success: true,
    data: reservation
  });
});

// @desc    Cancel reservation
// @route   PUT /api/v1/circulation/reserve/:id/cancel
// @access  Private
exports.cancelReservation = asyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);
  
  if (!reservation) {
    return next(new ErrorResponse('Reservation not found', 404));
  }
  
  // Check if user owns this reservation
  if (reservation.user.toString() !== req.user.id && !['admin', 'librarian'].includes(req.user.role)) {
    return next(new ErrorResponse('Not authorized to cancel this reservation', 403));
  }
  
  reservation.status = 'cancelled';
  await reservation.save();
  
  // Update queue positions
  await Reservation.updateMany(
    { 
      book: reservation.book,
      status: 'pending',
      queuePosition: { $gt: reservation.queuePosition }
    },
    { $inc: { queuePosition: -1 } }
  );
  
  res.status(200).json({
    success: true,
    data: reservation
  });
});

// @desc    Get user's active loans
// @route   GET /api/v1/circulation/myloans
// @access  Private
exports.getMyLoans = asyncHandler(async (req, res, next) => {
  const transactions = await Transaction.find({
    user: req.user.id,
    status: { $in: ['active', 'overdue'] },
    approvalStatus: 'approved' // Only show approved transactions
  }).populate('book', 'title authors isbn barcode coverImage dueDate');
  
  res.status(200).json({
    success: true,
    count: transactions.length,
    data: transactions
  });
});

// @desc    Get user's reservations
// @route   GET /api/v1/circulation/myreservations
// @access  Private
exports.getMyReservations = asyncHandler(async (req, res, next) => {
  const reservations = await Reservation.find({
    user: req.user.id,
    status: { $in: ['pending', 'available'] }
  }).populate('book', 'title authors isbn barcode coverImage');
  
  res.status(200).json({
    success: true,
    count: reservations.length,
    data: reservations
  });
});

// @desc    Get all active transactions (for librarian)
// @route   GET /api/v1/circulation/transactions
// @access  Private/Librarian
exports.getAllTransactions = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, status, userId, bookId } = req.query;
  
  let query = {};
  if (status) query.status = status;
  if (userId) query.user = userId;
  if (bookId) query.book = bookId;
  
  const transactions = await Transaction.find(query)
    .populate('user', 'firstName lastName email membershipId')
    .populate('book', 'title authors isbn barcode')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
  
  const count = await Transaction.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit)
    },
    data: transactions
  });
});

// @desc    Request to borrow a book (by student/teacher)
// @route   POST /api/v1/circulation/request-borrow
// @access  Private (Student/Teacher)
exports.requestBorrow = asyncHandler(async (req, res, next) => {
  const { bookId, requestedDueDate } = req.body;
  const userId = req.user.id;
  
  // Get user and book
  const user = await User.findById(userId);
  const book = await Book.findById(bookId);
  
  if (!book) {
    return next(new ErrorResponse('Book not found', 404));
  }
  
  // Check if user can borrow more books
  if (!user.canBorrowMore()) {
    return next(new ErrorResponse(`You have reached your borrowing limit of ${user.maxBooksAllowed} books or have outstanding fines`, 400));
  }
  
  // Check if book is available
  if (book.availableCopies < 1 || book.isReference) {
    return next(new ErrorResponse('Book is not available for checkout', 400));
  }
  
  // Check if user already has a pending request for this book
  const existingRequest = await Transaction.findOne({
    user: userId,
    book: bookId,
    approvalStatus: 'pending'
  });
  
  if (existingRequest) {
    return next(new ErrorResponse('You already have a pending request for this book', 400));
  }
  
  // Check if user already has an active loan for this book
  const existingLoan = await Transaction.findOne({
    user: userId,
    book: bookId,
    status: { $in: ['active', 'overdue'] },
    approvalStatus: 'approved'
  });
  
  if (existingLoan) {
    return next(new ErrorResponse('You already have an active loan for this book', 400));
  }
  
  // Calculate due date
  const calculatedDueDate = requestedDueDate || new Date(Date.now() + parseInt(process.env.LOAN_PERIOD_DAYS || 14) * 24 * 60 * 60 * 1000);
  
  // Create transaction with pending approval
  const transaction = await Transaction.create({
    type: 'checkout',
    user: userId,
    book: bookId,
    dueDate: calculatedDueDate,
    status: 'active',
    approvalStatus: 'pending',
    conditionOnCheckout: book.condition
  });
  
  // Temporarily reserve the book
  book.availableCopies -= 1;
  book.updateAvailability();
  await book.save();
  
  // Get all librarians and admins
  const librarians = await User.find({ 
    role: { $in: ['librarian', 'admin'] },
    membershipStatus: 'active'
  });
  
  // Create notifications for all librarians
  const notificationPromises = librarians.map(librarian => 
    Notification.create({
      recipient: librarian._id,
      sender: userId,
      type: 'borrow_request',
      title: 'New Borrow Request',
      message: `${user.firstName} ${user.lastName} has requested to borrow "${book.title}"`,
      relatedBook: bookId,
      relatedTransaction: transaction._id,
      relatedUser: userId,
      actionUrl: '/admin/circulation'
    })
  );
  
  // Send email notifications to librarians
  const emailPromises = librarians.map(librarian =>
    sendNotification(librarian, 'general', {
      message: `New borrow request from ${user.firstName} ${user.lastName} for "${book.title}"`
    })
  );
  
  await Promise.all([...notificationPromises, ...emailPromises]);
  
  await transaction.populate(['book', 'user']);
  
  res.status(201).json({
    success: true,
    message: 'Borrow request submitted. Awaiting librarian approval',
    data: transaction
  });
});

// @desc    Approve borrow request
// @route   PUT /api/v1/circulation/approve/:transactionId
// @access  Private/Librarian
exports.approveBorrowRequest = asyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.transactionId)
    .populate('user')
    .populate('book');
  
  if (!transaction) {
    return next(new ErrorResponse('Transaction not found', 404));
  }
  
  if (transaction.approvalStatus !== 'pending') {
    return next(new ErrorResponse('This request has already been processed', 400));
  }
  
  // Approve the transaction
  transaction.approvalStatus = 'approved';
  transaction.approvedBy = req.user.id;
  transaction.approvedAt = new Date();
  transaction.processedBy = req.user.id;
  transaction.checkoutDate = new Date();
  
  await transaction.save();
  
  // Update user's book count
  transaction.user.currentBooksCount += 1;
  await transaction.user.save();
  
  // Update book's issued count
  transaction.book.timesIssued += 1;
  await transaction.book.save();
  
  // Notify the user
  await Notification.create({
    recipient: transaction.user._id,
    sender: req.user.id,
    type: 'borrow_approved',
    title: 'Borrow Request Approved',
    message: `Your request to borrow "${transaction.book.title}" has been approved. Please collect the book.`,
    relatedBook: transaction.book._id,
    relatedTransaction: transaction._id,
    actionUrl: '/dashboard/my-loans'
  });
  
  await sendNotification(transaction.user, 'checkout', { 
    book: transaction.book, 
    transaction 
  });
  
  res.status(200).json({
    success: true,
    message: 'Borrow request approved',
    data: transaction
  });
});

// @desc    Reject borrow request
// @route   PUT /api/v1/circulation/reject/:transactionId
// @access  Private/Librarian
exports.rejectBorrowRequest = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;
  const transaction = await Transaction.findById(req.params.transactionId)
    .populate('user')
    .populate('book');
  
  if (!transaction) {
    return next(new ErrorResponse('Transaction not found', 404));
  }
  
  if (transaction.approvalStatus !== 'pending') {
    return next(new ErrorResponse('This request has already been processed', 400));
  }
  
  // Reject the transaction
  transaction.approvalStatus = 'rejected';
  transaction.status = 'cancelled';
  transaction.approvedBy = req.user.id;
  transaction.approvedAt = new Date();
  transaction.rejectionReason = reason || 'Not specified';
  
  await transaction.save();
  
  // Return book availability
  transaction.book.availableCopies += 1;
  transaction.book.updateAvailability();
  await transaction.book.save();
  
  // Notify the user
  await Notification.create({
    recipient: transaction.user._id,
    sender: req.user.id,
    type: 'borrow_rejected',
    title: 'Borrow Request Rejected',
    message: `Your request to borrow "${transaction.book.title}" has been rejected. Reason: ${transaction.rejectionReason}`,
    relatedBook: transaction.book._id,
    relatedTransaction: transaction._id
  });
  
  await sendNotification(transaction.user, 'general', {
    message: `Your borrow request for "${transaction.book.title}" was rejected. Reason: ${transaction.rejectionReason}`
  });
  
  res.status(200).json({
    success: true,
    message: 'Borrow request rejected',
    data: transaction
  });
});

// @desc    Get pending borrow requests
// @route   GET /api/v1/circulation/pending-requests
// @access  Private/Librarian
exports.getPendingRequests = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  
  const requests = await Transaction.find({
    approvalStatus: 'pending'
  })
    .populate('user', 'firstName lastName email membershipId phone currentBooksCount maxBooksAllowed')
    .populate('book', 'title authors isbn barcode coverImage availableCopies')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
  
  const count = await Transaction.countDocuments({ approvalStatus: 'pending' });
  
  res.status(200).json({
    success: true,
    count,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit)
    },
    data: requests
  });
});

// @desc    Get user's pending borrow requests
// @route   GET /api/v1/circulation/my-requests
// @access  Private
exports.getMyRequests = asyncHandler(async (req, res, next) => {
  const requests = await Transaction.find({
    user: req.user.id,
    approvalStatus: 'pending'
  }).populate('book', 'title authors isbn barcode coverImage');
  
  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests
  });
});
