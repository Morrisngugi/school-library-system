const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema({
  // User Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Related Transaction
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  
  // Fine Details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  reason: {
    type: String,
    enum: ['overdue', 'lost', 'damaged', 'other'],
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  notes: {
    type: String,
    maxlength: 500
  },
  assessedDate: {
    type: Date,
    default: Date.now
  },
  
  // Payment Status
  status: {
    type: String,
    enum: ['unpaid', 'partial', 'paid', 'waived'],
    default: 'unpaid'
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  amountDue: {
    type: Number,
    required: true
  },
  
  // Payment Details
  paymentDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'mobile_money', 'bank_transfer', 'waived'],
  },
  paidDate: {
    type: Date
  },
  transactionReference: {
    type: String
  },
  
  // Processing
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Waiver Information
  waivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  waiverReason: {
    type: String
  },
  waiverDate: {
    type: Date
  },
  
  // Dates
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
fineSchema.index({ user: 1, status: 1 });
fineSchema.index({ status: 1, issueDate: -1 });

// Calculate amount due
fineSchema.methods.calculateAmountDue = function() {
  this.amountDue = this.amount - this.amountPaid;
  return this.amountDue;
};

// Process payment
fineSchema.methods.processPayment = function(amount, method, reference) {
  this.amountPaid += amount;
  this.calculateAmountDue();
  
  if (this.amountDue <= 0) {
    this.status = 'paid';
    this.paymentDate = new Date();
  } else {
    this.status = 'partial';
  }
  
  this.paymentMethod = method;
  this.transactionReference = reference;
  
  return this;
};

module.exports = mongoose.model('Fine', fineSchema);
