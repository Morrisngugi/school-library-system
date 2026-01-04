const Transaction = require('../models/Transaction.model');
const Book = require('../models/Book.model');
const User = require('../models/User.model');
const Fine = require('../models/Fine.model');
const Reservation = require('../models/Reservation.model');
const asyncHandler = require('../middleware/async.middleware');

// @desc    Get dashboard statistics
// @route   GET /api/v1/reports/dashboard
// @access  Private/Librarian/Admin
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  // Total books
  const totalBooks = await Book.countDocuments();
  const availableBooks = await Book.countDocuments({ availableCopies: { $gt: 0 } });
  
  // Total users
  const totalUsers = await User.countDocuments();
  const activeMembers = await User.countDocuments({ membershipStatus: 'active' });
  
  // Active transactions
  const activeLoans = await Transaction.countDocuments({ status: 'active' });
  const overdueLoans = await Transaction.countDocuments({ status: 'overdue' });
  
  // Fines
  const finesData = await Fine.aggregate([
    {
      $group: {
        _id: null,
        totalFines: { $sum: '$amount' },
        totalCollected: { $sum: '$amountPaid' },
        pendingFines: { 
          $sum: { 
            $cond: [{ $in: ['$status', ['pending', 'partial']] }, '$amountDue', 0] 
          } 
        }
      }
    }
  ]);
  
  // Reservations
  const activeReservations = await Reservation.countDocuments({ status: 'pending' });
  
  // Recent activity
  const recentCheckouts = await Transaction.find({ type: 'checkout' })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'firstName lastName')
    .populate('book', 'title authors');
  
  res.status(200).json({
    success: true,
    data: {
      totalBooks: totalBooks,
      availableBooks: availableBooks,
      issuedBooks: totalBooks - availableBooks,
      totalUsers: totalUsers,
      activeUsers: activeMembers,
      activeLoans: activeLoans,
      totalLoans: activeLoans,
      overdueBooks: overdueLoans,
      activeReservations: activeReservations,
      books: {
        total: totalBooks,
        available: availableBooks,
        issued: totalBooks - availableBooks
      },
      users: {
        total: totalUsers,
        activeMembers
      },
      circulation: {
        activeLoans,
        overdueLoans,
        activeReservations
      },
      fines: finesData[0] || { totalFines: 0, totalCollected: 0, pendingFines: 0 },
      recentActivity: recentCheckouts
    }
  });
});

// @desc    Get overdue books report
// @route   GET /api/v1/reports/overdue
// @access  Private/Librarian/Admin
exports.getOverdueReport = asyncHandler(async (req, res, next) => {
  const overdueTransactions = await Transaction.find({
    status: { $in: ['active', 'overdue'] },
    dueDate: { $lt: new Date() }
  })
    .populate('user', 'firstName lastName email phone membershipId')
    .populate('book', 'title authors isbn barcode')
    .sort({ dueDate: 1 });
  
  // Calculate overdue days and fines for each
  const overdueWithCalculations = overdueTransactions.map(trans => {
    const daysOverdue = Math.floor((new Date() - trans.dueDate) / (1000 * 60 * 60 * 24));
    const fineAmount = daysOverdue * parseFloat(process.env.FINE_PER_DAY || 10);
    
    return {
      ...trans.toObject(),
      daysOverdue,
      calculatedFine: fineAmount
    };
  });
  
  res.status(200).json({
    success: true,
    count: overdueWithCalculations.length,
    data: overdueWithCalculations
  });
});

// @desc    Get popular books report
// @route   GET /api/v1/reports/popular-books
// @access  Private/Librarian/Admin
exports.getPopularBooks = asyncHandler(async (req, res, next) => {
  const { limit = 10, startDate, endDate } = req.query;
  
  let matchQuery = { type: 'checkout' };
  
  if (startDate && endDate) {
    matchQuery.checkoutDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  const popularBooks = await Transaction.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$book',
        checkoutCount: { $sum: 1 }
      }
    },
    { $sort: { checkoutCount: -1 } },
    { $limit: parseInt(limit) },
    {
      $lookup: {
        from: 'books',
        localField: '_id',
        foreignField: '_id',
        as: 'bookDetails'
      }
    },
    { $unwind: '$bookDetails' }
  ]);
  
  res.status(200).json({
    success: true,
    count: popularBooks.length,
    data: popularBooks
  });
});

// @desc    Get circulation statistics
// @route   GET /api/v1/reports/circulation-stats
// @access  Private/Librarian/Admin
exports.getCirculationStats = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  
  let matchQuery = {};
  
  if (startDate && endDate) {
    matchQuery.checkoutDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  const stats = await Transaction.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: {
          year: { $year: '$checkoutDate' },
          month: { $month: '$checkoutDate' }
        },
        checkouts: { $sum: 1 },
        returns: {
          $sum: { $cond: [{ $eq: ['$status', 'returned'] }, 1, 0] }
        },
        overdue: {
          $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] }
        }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } }
  ]);
  
  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Get user activity report
// @route   GET /api/v1/reports/user-activity
// @access  Private/Librarian/Admin
exports.getUserActivityReport = asyncHandler(async (req, res, next) => {
  const { limit = 20, role } = req.query;
  
  let matchQuery = {};
  if (role) matchQuery.role = role;
  
  const userActivity = await Transaction.aggregate([
    {
      $group: {
        _id: '$user',
        totalCheckouts: { $sum: 1 },
        activeLoans: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        overdueBooks: {
          $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] }
        },
        lastCheckout: { $max: '$checkoutDate' }
      }
    },
    { $sort: { totalCheckouts: -1 } },
    { $limit: parseInt(limit) },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userDetails'
      }
    },
    { $unwind: '$userDetails' },
    {
      $match: matchQuery
    }
  ]);
  
  res.status(200).json({
    success: true,
    count: userActivity.length,
    data: userActivity
  });
});

// @desc    Get inventory report
// @route   GET /api/v1/reports/inventory
// @access  Private/Librarian/Admin
exports.getInventoryReport = asyncHandler(async (req, res, next) => {
  const { subject, status, condition } = req.query;
  
  let matchQuery = {};
  if (subject) matchQuery.subject = subject;
  if (status) matchQuery.status = status;
  if (condition) matchQuery.condition = condition;
  
  const inventory = await Book.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$subject',
        totalBooks: { $sum: '$totalCopies' },
        availableBooks: { $sum: '$availableCopies' },
        issuedBooks: { $sum: { $subtract: ['$totalCopies', '$availableCopies'] } },
        bookCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'subjects',
        localField: '_id',
        foreignField: '_id',
        as: 'subjectDetails'
      }
    },
    { $unwind: '$subjectDetails' }
  ]);
  
  const totalInventory = await Book.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalBooks: { $sum: '$totalCopies' },
        availableBooks: { $sum: '$availableCopies' },
        uniqueTitles: { $sum: 1 }
      }
    }
  ]);
  
  res.status(200).json({
    success: true,
    summary: totalInventory[0] || {},
    bySubject: inventory
  });
});

// @desc    Export data
// @route   GET /api/v1/reports/export
// @access  Private/Admin
exports.exportData = asyncHandler(async (req, res, next) => {
  const { type, format = 'json' } = req.query;
  
  let data;
  
  switch (type) {
    case 'books':
      data = await Book.find().populate('subject');
      break;
    case 'users':
      data = await User.find().select('-password');
      break;
    case 'transactions':
      data = await Transaction.find().populate(['user', 'book']);
      break;
    case 'fines':
      data = await Fine.find().populate(['user', 'transaction']);
      break;
    default:
      data = { message: 'Invalid export type' };
  }
  
  // For now, return JSON. Can be extended to CSV, Excel, etc.
  res.status(200).json({
    success: true,
    count: data.length,
    data
  });
});
