// MongoDB initialization script
db = db.getSiblingDB('school_library');

// Create collections with validation
db.createCollection('users');
db.createCollection('books');
db.createCollection('transactions');
db.createCollection('reservations');
db.createCollection('fines');
db.createCollection('subjects');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ membershipId: 1 }, { unique: true });
db.books.createIndex({ barcode: 1 }, { unique: true });
db.books.createIndex({ isbn: 1 }, { unique: true, sparse: true });
db.books.createIndex({ title: 'text', authors: 'text', subjects: 'text' });
db.transactions.createIndex({ user: 1, status: 1 });
db.transactions.createIndex({ book: 1, status: 1 });
db.transactions.createIndex({ dueDate: 1, status: 1 });

print('MongoDB initialized successfully for School Library System');
