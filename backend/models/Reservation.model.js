const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  // User and Book
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
  
  // Reservation Details
  reservationDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'available', 'fulfilled', 'expired', 'cancelled'],
    default: 'pending'
  },
  
  // Priority in queue
  queuePosition: {
    type: Number,
    default: 1
  },
  
  // Notification
  notificationSent: {
    type: Boolean,
    default: false
  },
  notifiedAt: {
    type: Date
  },
  
  // Fulfillment
  fulfilledDate: {
    type: Date
  },
  
  // Notes
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Indexes
reservationSchema.index({ book: 1, status: 1, queuePosition: 1 });
reservationSchema.index({ user: 1, status: 1 });
reservationSchema.index({ expiryDate: 1 });

// Check if reservation has expired
reservationSchema.methods.checkExpiry = function() {
  if (this.status === 'pending' && this.expiryDate < new Date()) {
    this.status = 'expired';
    return true;
  }
  return false;
};

module.exports = mongoose.model('Reservation', reservationSchema);
