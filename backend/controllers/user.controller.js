const User = require('../models/User.model');
const Transaction = require('../models/Transaction.model');
const Fine = require('../models/Fine.model');
const asyncHandler = require('../middleware/async.middleware');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin/Librarian
exports.getUsers = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, role, status, search } = req.query;
  
  let query = {};
  
  if (role) query.role = role;
  if (status) query.membershipStatus = status;
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { membershipId: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } }
    ];
  }
  
  const users = await User.find(query)
    .select('-password')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
  
  const count = await User.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit)
    },
    data: users
  });
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin/Librarian
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create new user
// @route   POST /api/v1/users
// @access  Private/Admin/Librarian
exports.createUser = asyncHandler(async (req, res, next) => {
  // Generate membership ID
  const membershipId = `MEM${Date.now()}${Math.floor(Math.random() * 1000)}`;
  
  const user = await User.create({
    ...req.body,
    membershipId
  });
  
  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin/Librarian
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }
  
  // Don't allow password update through this route
  delete req.body.password;
  
  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }
  
  // Check if user has active transactions
  const activeTransactions = await Transaction.countDocuments({
    user: req.params.id,
    status: { $in: ['active', 'overdue'] }
  });
  
  if (activeTransactions > 0) {
    return next(new ErrorResponse('Cannot delete user with active book loans', 400));
  }
  
  await user.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {},
    message: 'User deleted successfully'
  });
});

// @desc    Get user borrowing history
// @route   GET /api/v1/users/:id/history
// @access  Private
exports.getUserHistory = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  
  const transactions = await Transaction.find({ user: req.params.id })
    .populate('book', 'title authors isbn barcode coverImage')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
  
  const count = await Transaction.countDocuments({ user: req.params.id });
  
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

// @desc    Get user fines
// @route   GET /api/v1/users/:id/fines
// @access  Private
exports.getUserFines = asyncHandler(async (req, res, next) => {
  const fines = await Fine.find({ user: req.params.id })
    .populate('transaction')
    .sort({ createdAt: -1 });
  
  const totalFines = await Fine.aggregate([
    { $match: { user: req.params.id, status: { $ne: 'paid' } } },
    { $group: { _id: null, total: { $sum: '$amountDue' } } }
  ]);
  
  res.status(200).json({
    success: true,
    totalDue: totalFines.length > 0 ? totalFines[0].total : 0,
    data: fines
  });
});

// @desc    Update user membership status
// @route   PUT /api/v1/users/:id/membership
// @access  Private/Admin/Librarian
exports.updateMembershipStatus = asyncHandler(async (req, res, next) => {
  const { membershipStatus, maxBooksAllowed } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { membershipStatus, maxBooksAllowed },
    { new: true, runValidators: true }
  );
  
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});
