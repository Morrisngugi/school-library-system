# School Library Management System

A comprehensive web-based library management system designed for Kenyan secondary schools, built with Node.js (Express) backend and Vue.js 3 frontend.

## Features

### User Management
- User registration and authentication with JWT
- Role-based access control (Admin, Librarian, Teacher, Student)
- Member profile management
- Membership status tracking
- Fine and penalty management

### Catalog Management
- Complete book cataloging system
- ISBN and barcode support
- Category and subject classification
- Book location tracking (rack, shelf, floor)
- Book cover image uploads
- Advanced search functionality
- Inventory management

### Circulation Management
- Book checkout and return
- Book reservations
- Loan renewals
- Due date tracking
- Overdue detection and fine calculation
- Queue management for reservations

### Reporting & Analytics
- Dashboard with key metrics
- Overdue books report
- Popular books analytics
- Circulation statistics
- User activity reports
- Inventory reports
- Data export functionality

### Notification System
- Email notifications
- SMS notifications (Kenya-focused with Africa's Talking API)
- Due date reminders
- Overdue notices
- Reservation availability alerts

### Additional Features
- Automated cron jobs for overdue checking
- Responsive design for mobile access
- OPAC (Online Public Access Catalog)
- Fine payment tracking
- Book condition monitoring

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Nodemailer** for email notifications
- **Africa's Talking API** for SMS (Kenya)
- **Node-cron** for scheduled tasks

### Frontend
- **Vue.js 3** with Composition API
- **Vue Router** for navigation
- **Pinia** for state management
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Vite** for build tooling

## Installation & Setup

### Prerequisites

**Option 1: Using Docker (Recommended)**
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+

**Option 2: Manual Setup**
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

---

## 🐳 Quick Start with Docker (Recommended)

### Development Mode with Hot Reload

1. Clone the repository:
```bash
cd E:\Source Code\school-library-system
```

2. Create environment file:
```bash
copy .env.docker .env
```

3. Update `.env` with your credentials (email, SMS API keys)

4. Start all services:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

6. View logs:
```bash
docker-compose -f docker-compose.dev.yml logs -f
```

7. Stop services:
```bash
docker-compose -f docker-compose.dev.yml down
```

### Production Mode

1. Build and start all services:
```bash
docker-compose up -d
```

2. View running containers:
```bash
docker-compose ps
```

3. Stop and remove everything:
```bash
docker-compose down -v
```

### Docker Commands Cheat Sheet

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service_name]

# Restart a service
docker-compose restart backend

# Execute command in container
docker-compose exec backend npm run migrate

# Remove all containers and volumes
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build
```

---

## 📦 Manual Installation (Without Docker)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file by copying `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
   - MongoDB connection string
   - JWT secret key
   - Email SMTP settings
   - SMS API credentials (Africa's Talking)
   - Library policies (loan period, fines, etc.)

5. Start MongoDB service

6. Run the backend server:
```bash
# Development
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update the `.env` file if needed:
```bash
VITE_API_URL=http://localhost:5000/api/v1
```

4. Start the development server:
```bash
npm run serve
```

The frontend will be available at `http://localhost:3000`

5. Build for production:
```bash
npm run build
```

## API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `PUT /auth/updateprofile` - Update profile
- `PUT /auth/updatepassword` - Change password

### User Management Endpoints
- `GET /users` - Get all users (Admin/Librarian)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users/:id/history` - Get user borrowing history
- `GET /users/:id/fines` - Get user fines

### Catalog Endpoints
- `GET /catalog/books` - Get all books
- `GET /catalog/books/:id` - Get book by ID
- `POST /catalog/books` - Add new book
- `PUT /catalog/books/:id` - Update book
- `DELETE /catalog/books/:id` - Delete book
- `POST /catalog/search` - Advanced search
- `GET /catalog/subjects` - Get all subjects
- `POST /catalog/subjects` - Create category

### Circulation Endpoints
- `POST /circulation/checkout` - Checkout book
- `POST /circulation/return` - Return book
- `POST /circulation/renew/:id` - Renew loan
- `POST /circulation/reserve` - Reserve book
- `GET /circulation/myloans` - Get user's active loans
- `GET /circulation/myreservations` - Get user's reservations
- `GET /circulation/transactions` - Get all transactions (Librarian)

### Fines Endpoints
- `GET /fines` - Get all fines
- `GET /fines/my` - Get user's fines
- `POST /fines/:id/pay` - Pay fine
- `PUT /fines/:id/waive` - Waive fine
- `GET /fines/summary` - Get fines summary

### Reports Endpoints
- `GET /reports/dashboard` - Dashboard statistics
- `GET /reports/overdue` - Overdue books report
- `GET /reports/popular-books` - Popular books report
- `GET /reports/circulation-stats` - Circulation statistics
- `GET /reports/inventory` - Inventory report

### Notification Endpoints
- `POST /notify/send` - Send custom notification
- `POST /notify/send-reminder` - Send due date reminders
- `POST /notify/send-overdue` - Send overdue notices

## Default Login Credentials

After setting up, you can create an admin account by registering or by directly inserting into MongoDB.

## Configuration

### Library Policies (.env)
```
MAX_BOOKS_PER_USER=3
LOAN_PERIOD_DAYS=14
FINE_PER_DAY=10
MAX_RENEWAL_TIMES=2
```

### SMS Configuration (Kenya)
For SMS notifications, sign up for Africa's Talking API:
1. Visit https://africastalking.com/
2. Create an account
3. Get your API Key and Username
4. Update `.env` with credentials

### Email Configuration
Configure SMTP settings in `.env`:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## Project Structure

```
school-library-system/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── public/           # Static files
│   ├── Dockerfile        # Production image
│   ├── Dockerfile.dev    # Development image
│   └── server.js         # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── assets/       # Static assets
│   │   ├── components/   # Vue components
│   │   ├── views/        # Page views
│   │   ├── stores/       # Pinia stores
│   │   ├── services/     # API services
│   │   ├── router/       # Vue Router config
│   │   └── main.js       # Entry point
│   ├── Dockerfile        # Production image
│   ├── Dockerfile.dev    # Development image
│   ├── nginx.conf        # Nginx configuration
│   └── index.html
│
├── docker-compose.yml       # Production orchestration
├── docker-compose.dev.yml   # Development orchestration
├── mongo-init.js            # MongoDB initialization
└── .env.docker              # Docker environment template
```

## 🐳 Docker Architecture

The Docker setup includes:

- **MongoDB Container**: Database with automatic initialization
- **Backend Container**: Node.js API server
- **Frontend Container**: Nginx serving Vue.js SPA
- **Shared Network**: Internal communication between services
- **Persistent Volumes**: MongoDB data and uploaded files

### Container Health Checks

All services include health checks to ensure proper startup order:
- MongoDB: Database ping check
- Backend: HTTP health endpoint check
- Frontend: Nginx status check

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.

## Acknowledgments

- Built for Kenyan secondary schools
- SMS integration via Africa's Talking
- Kenyan phone number validation included
