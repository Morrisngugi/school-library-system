# School Library Management System - Backend

## API Endpoints Documentation

### Authentication Service

#### POST /api/v1/auth/register
Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+254712345678",
  "role": "student",
  "studentId": "ST2024001",
  "class": "Form 3A"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "student",
    "membershipId": "MEM123456",
    "membershipStatus": "active"
  }
}
```

#### POST /api/v1/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register

---

### Catalog & Inventory Service

#### GET /api/v1/catalog/books
Get all books with pagination and filters.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search text
- `category` (string): Category ID
- `status` (string): Book status
- `author` (string): Author name
- `isbn` (string): ISBN number

**Response:**
```json
{
  "success": true,
  "count": 50,
  "pagination": {
    "page": 1,
    "limit": 10,
    "pages": 5
  },
  "data": [
    {
      "_id": "book_id",
      "title": "Introduction to Mathematics",
      "authors": ["John Smith"],
      "isbn": "978-3-16-148410-0",
      "barcode": "BOOK001",
      "category": {
        "_id": "cat_id",
        "name": "Mathematics"
      },
      "totalCopies": 5,
      "availableCopies": 3,
      "status": "available",
      "location": {
        "rack": "A1",
        "shelf": "S2",
        "floor": "Ground Floor"
      }
    }
  ]
}
```

#### POST /api/v1/catalog/books
Add a new book to the catalog (Admin/Librarian only).

**Request Body:**
```json
{
  "title": "Introduction to Physics",
  "authors": ["Jane Doe"],
  "isbn": "978-3-16-148410-1",
  "barcode": "BOOK002",
  "category": "category_id",
  "publisher": "Education Press",
  "publicationYear": 2023,
  "totalCopies": 3,
  "location": {
    "rack": "B1",
    "shelf": "S1",
    "floor": "Ground Floor"
  },
  "description": "Comprehensive physics textbook for Form 1-4"
}
```

---

### Circulation Service

#### POST /api/v1/circulation/checkout
Check out a book (Librarian only).

**Request Body:**
```json
{
  "userId": "user_id",
  "bookId": "book_id",
  "dueDate": "2024-02-01T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "transaction_id",
    "type": "checkout",
    "user": { ... },
    "book": { ... },
    "checkoutDate": "2024-01-18T10:00:00.000Z",
    "dueDate": "2024-02-01T00:00:00.000Z",
    "status": "active"
  }
}
```

#### POST /api/v1/circulation/return
Return a book (Librarian only).

**Request Body:**
```json
{
  "transactionId": "transaction_id",
  "conditionOnReturn": "good",
  "notes": "Book returned in good condition"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "fine": 0
}
```

#### POST /api/v1/circulation/reserve
Reserve a book (Any authenticated user).

**Request Body:**
```json
{
  "bookId": "book_id"
}
```

#### GET /api/v1/circulation/myloans
Get current user's active loans.

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "transaction_id",
      "book": {
        "title": "Mathematics Form 3",
        "authors": ["John Smith"],
        "barcode": "BOOK001"
      },
      "checkoutDate": "2024-01-10T00:00:00.000Z",
      "dueDate": "2024-01-24T00:00:00.000Z",
      "status": "active",
      "renewalCount": 0
    }
  ]
}
```

---

### Fines & Reporting Service

#### GET /api/v1/fines/my
Get current user's fines.

**Response:**
```json
{
  "success": true,
  "count": 1,
  "summary": [
    {
      "_id": "pending",
      "total": 100,
      "count": 1
    }
  ],
  "data": [
    {
      "_id": "fine_id",
      "amount": 100,
      "amountDue": 100,
      "reason": "overdue",
      "description": "Overdue fine for 10 days",
      "status": "pending",
      "issueDate": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/v1/fines/:id/pay
Pay a fine (Librarian only).

**Request Body:**
```json
{
  "amount": 100,
  "paymentMethod": "mpesa",
  "transactionReference": "REF123456"
}
```

#### GET /api/v1/reports/dashboard
Get dashboard statistics (Admin/Librarian only).

**Response:**
```json
{
  "success": true,
  "data": {
    "books": {
      "total": 500,
      "available": 350,
      "issued": 150
    },
    "users": {
      "total": 200,
      "activeMembers": 180
    },
    "circulation": {
      "activeLoans": 150,
      "overdueLoans": 10,
      "activeReservations": 25
    },
    "fines": {
      "totalFines": 5000,
      "totalCollected": 4000,
      "pendingFines": 1000
    }
  }
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## Rate Limiting

API requests are rate-limited to prevent abuse. Default limits are set per IP address.
