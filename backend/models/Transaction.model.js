const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Transaction Type
  type: {
    type: String,
    enum: ['checkout', 'return', 'renewal', 'reservation'],
    required: true
  },
  
  // Approval Status (for user-initiated requests)
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'not_required'],
    default: 'not_required'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  
  // User and Book Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
    index: true
  },
  
  // Checkout Details
  checkoutDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: function() {
      return this.type === 'checkout' || this.type === 'renewal';
    }
  },
  returnDate: {
    type: Date
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'returned', 'overdue', 'lost', 'cancelled'],
    default: 'active'
  },
  
  // Renewal Information
  renewalCount: {
    type: Number,
    default: 0
  },
  maxRenewals: {
    type: Number,
    default: 2
  },
  
  // Fine Information
  isOverdue: {
    type: Boolean,
    default: false
  },
  daysOverdue: {
    type: Number,
    default: 0
  },
  fineAmount: {
    type: Number,
    default: 0
  },
  finePaid: {
    type: Boolean,
    default: false
  },
  
  // Librarian who processed the transaction
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Book Condition
  conditionOnCheckout: {
    type: String,
    enum: ['new', 'good', 'fair', 'poor', 'damaged']
  },
  conditionOnReturn: {
    type: String,
    enum: ['new', 'good', 'fair', 'poor', 'damaged']
  },
  
  // Notes
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Indexes for query optimization
transactionSchema.index({ user: 1, status: 1 });
transactionSchema.index({ book: 1, status: 1 });
transactionSchema.index({ dueDate: 1, status: 1 });
transactionSchema.index({ checkoutDate: -1 });

// Check if transaction is overdue
transactionSchema.methods.checkOverdue = function() {
  if (this.status === 'active' && this.dueDate < new Date()) {
    this.isOverdue = true;
    this.daysOverdue = Math.floor((new Date() - this.dueDate) / (1000 * 60 * 60 * 24));
    this.fineAmount = this.daysOverdue * parseFloat(process.env.FINE_PER_DAY || 10);
    this.status = 'overdue';
    return true;
  }
  return false;
};

// Calculate fine
transactionSchema.methods.calculateFine = function() {
  if (this.returnDate && this.returnDate > this.dueDate) {
    const daysLate = Math.floor((this.returnDate - this.dueDate) / (1000 * 60 * 60 * 24));
    this.daysOverdue = daysLate;
    this.fineAmount = daysLate * parseFloat(process.env.FINE_PER_DAY || 10);
  }
  return this.fineAmount;
};

// Check if can renew
transactionSchema.methods.canRenew = function() {
  return this.renewalCount < this.maxRenewals && 
         this.status === 'active' && 
         !this.isOverdue;
};

module.exports = mongoose.model('Transaction', transactionSchema);
