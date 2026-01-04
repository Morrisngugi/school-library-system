const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject Name is required'],
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  bookCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema);
