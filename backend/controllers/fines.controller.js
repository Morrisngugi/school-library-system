const Fine = require('../models/Fine.model');
const User = require('../models/User.model');
const asyncHandler = require('../middleware/async.middleware');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all fines
// @route   GET /api/v1/fines
// @access  Private/Librarian/Admin
exports.getFines = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, status, userId } = req.query;
  
  let query = {};
  if (status) query.status = status;
  if (userId) query.user = userId;
  
  const fines = await Fine.find(query)
    .populate('user', 'firstName lastName email membershipId')
    .populate({
      path: 'transaction',
      populate: { path: 'book', select: 'title authors isbn' }
    })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
  
  const count = await Fine.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit)
    },
    data: fines
  });
});

// @desc    Get single fine
// @route   GET /api/v1/fines/:id
// @access  Private
exports.getFine = asyncHandler(async (req, res, next) => {
  const fine = await Fine.findById(req.params.id)
    .populate('user')
    .populate('transaction');
  
  if (!fine) {
    return next(new ErrorResponse('Fine not found', 404));
  }
  
  // Check authorization
  if (fine.user._id.toString() !== req.user.id && !['admin', 'librarian'].includes(req.user.role)) {
    return next(new ErrorResponse('Not authorized to view this fine', 403));
  }
  
  res.status(200).json({
    success: true,
    data: fine
  });
});

// @desc    Pay fine
// @route   POST /api/v1/fines/:id/pay
// @access  Private/Librarian
exports.payFine = asyncHandler(async (req, res, next) => {
  const { amount, paymentMethod, transactionReference } = req.body;
  
  let fine = await Fine.findById(req.params.id);
  
  if (!fine) {
    return next(new ErrorResponse('Fine not found', 404));
  }
  
  if (fine.status === 'paid') {
    return next(new ErrorResponse('Fine already paid', 400));
  }
  
  if (amount <= 0) {
    return next(new ErrorResponse('Payment amount must be greater than zero', 400));
  }
  
  if (amount > fine.amountDue) {
    return next(new ErrorResponse('Payment amount exceeds amount due', 400));
  }
  
  // Process payment
  fine.processPayment(amount, paymentMethod, transactionReference);
  fine.processedBy = req.user.id;
  await fine.save();
  
  // Update user's total fines
  if (fine.status === 'paid') {
    await User.findByIdAndUpdate(fine.user, {
      $inc: { totalFines: -amount }
    });
  }
  
  res.status(200).json({
    success: true,
    data: fine
  });
});

// @desc    Waive fine
// @route   PUT /api/v1/fines/:id/waive
// @access  Private/Admin
exports.waiveFine = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;
  
  const fine = await Fine.findById(req.params.id);
  
  if (!fine) {
    return next(new ErrorResponse('Fine not found', 404));
  }
  
  if (fine.status === 'paid' || fine.status === 'waived') {
    return next(new ErrorResponse('Fine already settled', 400));
  }
  
  const amountToWaive = fine.amountDue;
  
  fine.status = 'waived';
  fine.amountDue = 0;
  fine.waivedBy = req.user.id;
  fine.waiverReason = reason;
  fine.waiverDate = new Date();
  fine.paymentMethod = 'waived';
  
  await fine.save();
  
  // Update user's total fines
  await User.findByIdAndUpdate(fine.user, {
    $inc: { totalFines: -amountToWaive }
  });
  
  res.status(200).json({
    success: true,
    data: fine
  });
});

// @desc    Get my fines
// @route   GET /api/v1/fines/my
// @access  Private
exports.getMyFines = asyncHandler(async (req, res, next) => {
  const fines = await Fine.find({ user: req.user.id })
    .populate({
      path: 'transaction',
      populate: { path: 'book', select: 'title authors isbn' }
    })
    .sort({ createdAt: -1 });
  
  const summary = await Fine.aggregate([
    { $match: { user: req.user.id } },
    {
      $group: {
        _id: '$status',
        total: { $sum: '$amountDue' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  res.status(200).json({
    success: true,
    count: fines.length,
    summary,
    data: fines
  });
});

// @desc    Get fines summary
// @route   GET /api/v1/fines/summary
// @access  Private/Librarian/Admin
exports.getFinesSummary = asyncHandler(async (req, res, next) => {
  const summary = await Fine.aggregate([
    {
      $group: {
        _id: '$status',
        totalAmount: { $sum: '$amount' },
        totalPaid: { $sum: '$amountPaid' },
        totalDue: { $sum: '$amountDue' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  const overallTotal = await Fine.aggregate([
    {
      $group: {
        _id: null,
        totalFines: { $sum: '$amount' },
        totalCollected: { $sum: '$amountPaid' },
        totalOutstanding: { $sum: '$amountDue' }
      }
    }
  ]);
  
  res.status(200).json({
    success: true,
    summary,
    overall: overallTotal[0] || { totalFines: 0, totalCollected: 0, totalOutstanding: 0 }
  });
});
