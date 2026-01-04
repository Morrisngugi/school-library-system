const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    index: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  authors: [{
    type: String,
    required: [true, 'At least one author is required']
  }],
  isbn: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  barcode: {
    type: String,
    unique: true,
    required: [true, 'Barcode is required'],
    trim: true
  },
  
  // Classification
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  form: {
    type: String,
    enum: ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'General'],
    required: true,
    default: 'General'
  },
  language: {
    type: String,
    default: 'English'
  },
  
  // Publication Details
  publisher: {
    type: String,
    trim: true
  },
  publicationYear: {
    type: Number
  },
  edition: {
    type: String
  },
  
  // Physical Details
  pages: {
    type: Number
  },
  coverImage: {
    type: String,
    default: null
  },
  
  // Library Management
  accessionNumber: {
    type: String,
    unique: true,
    required: true
  },
  totalCopies: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  availableCopies: {
    type: Number,
    required: true,
    default: 1,
    min: 0
  },
  
  // Location in Library
  location: {
    rack: {
      type: String,
      required: true
    },
    shelf: {
      type: String,
      required: true
    },
    floor: {
      type: String,
      default: 'Ground Floor'
    }
  },
  
  // Book Status
  status: {
    type: String,
    enum: ['available', 'issued', 'reserved', 'maintenance', 'lost', 'damaged'],
    default: 'available'
  },
  condition: {
    type: String,
    enum: ['new', 'good', 'fair', 'poor', 'damaged'],
    default: 'good'
  },
  
  // Acquisition Details
  acquisitionDate: {
    type: Date,
    default: Date.now
  },
  price: {
    type: Number
  },
  vendor: {
    type: String
  },
  
  // Description
  description: {
    type: String,
    maxlength: 2000
  },
  
  // Statistics
  timesIssued: {
    type: Number,
    default: 0
  },
  
  // Additional metadata
  tags: [{
    type: String
  }],
  isPopular: {
    type: Boolean,
    default: false
  },
  isReference: {
    type: Boolean,
    default: false  // Reference books cannot be borrowed
  }
}, {
  timestamps: true
});

// Indexes for search optimization
bookSchema.index({ title: 'text', authors: 'text', description: 'text' });
bookSchema.index({ subject: 1, form: 1, status: 1 });
bookSchema.index({ barcode: 1, isbn: 1 });

// Virtual for availability status
bookSchema.virtual('isAvailable').get(function() {
  return this.availableCopies > 0 && this.status === 'available';
});

// Update availability when copies change
bookSchema.methods.updateAvailability = function() {
  if (this.availableCopies > 0) {
    this.status = 'available';
  } else if (this.availableCopies === 0 && this.totalCopies > 0) {
    this.status = 'issued';
  }
};

module.exports = mongoose.model('Book', bookSchema);
