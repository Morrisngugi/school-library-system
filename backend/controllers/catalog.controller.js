const Book = require('../models/Book.model');
const Subject = require('../models/Subject.model');
const asyncHandler = require('../middleware/async.middleware');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Search and get all books
// @route   GET /api/v1/catalog/books
// @access  Public
exports.getBooks = asyncHandler(async (req, res, next) => {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    subject, 
    form,
    status, 
    author,
    isbn,
    barcode,
    isPopular,
    sortBy = '-createdAt'
  } = req.query;
  
  let query = {};
  
  // Text search
  if (search) {
    query.$text = { $search: search };
  }
  
  // Filters
  if (subject) query.subject = subject;
  if (form) query.form = form;
  if (status) query.status = status;
  if (author) query.authors = { $regex: author, $options: 'i' };
  if (isbn) query.isbn = isbn;
  if (barcode) query.barcode = barcode;
  if (isPopular) query.isPopular = isPopular === 'true';
  
  const books = await Book.find(query)
    .populate('subject', 'name code color')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort(sortBy);
  
  const count = await Book.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit)
    },
    data: books
  });
});

// @desc    Get single book
// @route   GET /api/v1/catalog/books/:id
// @access  Public
exports.getBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id).populate('subject');
  
  if (!book) {
    return next(new ErrorResponse(`Book not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: book
  });
});

// @desc    Add new book
// @route   POST /api/v1/catalog/books
// @access  Private/Admin/Librarian
exports.createBook = asyncHandler(async (req, res, next) => {
  // Generate accession number
  const accessionNumber = `ACC${Date.now()}`;
  
  // Set initial available copies equal to total copies
  if (!req.body.availableCopies) {
    req.body.availableCopies = req.body.totalCopies;
  }
  
  const book = await Book.create({
    ...req.body,
    accessionNumber
  });
  
  // Update subject book count
  await Subject.findByIdAndUpdate(book.subject, {
    $inc: { bookCount: 1 }
  });
  
  res.status(201).json({
    success: true,
    data: book
  });
});

// @desc    Update book
// @route   PUT /api/v1/catalog/books/:id
// @access  Private/Admin/Librarian
exports.updateBook = asyncHandler(async (req, res, next) => {
  let book = await Book.findById(req.params.id);
  
  if (!book) {
    return next(new ErrorResponse(`Book not found with id of ${req.params.id}`, 404));
  }
  
  book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  book.updateAvailability();
  await book.save();
  
  res.status(200).json({
    success: true,
    data: book
  });
});

// @desc    Delete book
// @route   DELETE /api/v1/catalog/books/:id
// @access  Private/Admin
exports.deleteBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  
  if (!book) {
    return next(new ErrorResponse(`Book not found with id of ${req.params.id}`, 404));
  }
  
  // Update subject book count
  await Subject.findByIdAndUpdate(book.subject, {
    $inc: { bookCount: -1 }
  });
  
  await book.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {},
    message: 'Book deleted successfully'
  });
});

// @desc    Advanced search books
// @route   POST /api/v1/catalog/search
// @access  Public
exports.advancedSearch = asyncHandler(async (req, res, next) => {
  const { title, author, isbn, subject, form, yearFrom, yearTo, language } = req.body;
  
  let query = {};
  
  if (title) query.title = { $regex: title, $options: 'i' };
  if (author) query.authors = { $regex: author, $options: 'i' };
  if (isbn) query.isbn = isbn;
  if (subject) query.subject = subject;
  if (form) query.form = form;
  if (language) query.language = language;
  
  if (yearFrom || yearTo) {
    query.publicationYear = {};
    if (yearFrom) query.publicationYear.$gte = yearFrom;
    if (yearTo) query.publicationYear.$lte = yearTo;
  }
  
  const books = await Book.find(query)
    .populate('subject', 'name code color')
    .sort({ title: 1 });
  
  res.status(200).json({
    success: true,
    count: books.length,
    data: books
  });
});

// @desc    Get all subjects
// @route   GET /api/v1/catalog/subjects
// @access  Public
exports.getSubjects = asyncHandler(async (req, res, next) => {
  const subjects = await Subject.find({ isActive: true }).sort({ name: 1 });
  
  res.status(200).json({
    success: true,
    count: subjects.length,
    data: subjects
  });
});

// @desc    Create subject
// @route   POST /api/v1/catalog/subjects
// @access  Private/Admin/Librarian
exports.createSubject = asyncHandler(async (req, res, next) => {
  const subject = await Subject.create(req.body);
  
  res.status(201).json({
    success: true,
    data: subject
  });
});

// @desc    Update subject
// @route   PUT /api/v1/catalog/subjects/:id
// @access  Private/Admin/Librarian
exports.updateSubject = asyncHandler(async (req, res, next) => {
  const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!subject) {
    return next(new ErrorResponse(`Subject not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: subject
  });
});

// @desc    Delete subject
// @route   DELETE /api/v1/catalog/subjects/:id
// @access  Private/Admin
exports.deleteSubject = asyncHandler(async (req, res, next) => {
  const subject = await Subject.findById(req.params.id);
  
  if (!subject) {
    return next(new ErrorResponse(`Subject not found with id of ${req.params.id}`, 404));
  }
  
  // Check if subject has books
  if (subject.bookCount > 0) {
    return next(new ErrorResponse('Cannot delete subject with books', 400));
  }
  
  await subject.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {},
    message: 'Subject deleted successfully'
  });
});

// @desc    Upload book cover image
// @route   PUT /api/v1/catalog/books/:id/photo
// @access  Private/Admin/Librarian
exports.uploadBookPhoto = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  
  if (!book) {
    return next(new ErrorResponse(`Book not found with id of ${req.params.id}`, 404));
  }
  
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }
  
  book.coverImage = `/uploads/books/${req.file.filename}`;
  await book.save();
  
  res.status(200).json({
    success: true,
    data: book.coverImage
  });
});
