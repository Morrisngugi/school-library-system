const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^(\+254|0)[17]\d{8}$/, 'Please provide a valid Kenyan phone number']
  },
  
  // User Role and Membership
  role: {
    type: String,
    enum: ['student', 'teacher', 'librarian', 'admin'],
    default: 'student'
  },
  membershipId: {
    type: String,
    unique: true,
    required: true
  },
  membershipStatus: {
    type: String,
    enum: ['active', 'suspended', 'expired', 'inactive'],
    default: 'active'
  },
  
  // Student/Teacher specific fields
  studentId: {
    type: String,
    sparse: true
  },
  staffId: {
    type: String,
    sparse: true
  },
  class: {
    type: String  // e.g., "Form 1A", "Form 4B"
  },
  department: {
    type: String  // For teachers
  },
  
  // Borrowing Privileges
  maxBooksAllowed: {
    type: Number,
    default: function() {
      // Teachers can borrow 5 books, students 3 books
      return this.role === 'teacher' ? 5 : 3;
    }
  },
  currentBooksCount: {
    type: Number,
    default: 0
  },
  
  // Fines and Penalties
  totalFines: {
    type: Number,
    default: 0
  },
  
  // Account status
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    default: null
  },
  
  // Timestamps
  lastLogin: {
    type: Date
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Check if user can borrow more books
userSchema.methods.canBorrowMore = function() {
  return this.currentBooksCount < this.maxBooksAllowed && 
         this.membershipStatus === 'active' &&
         this.totalFines < 500; // Max fine threshold
};

module.exports = mongoose.model('User', userSchema);
