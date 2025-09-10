# 📚 Library Management System

A comprehensive REST API for managing a library system built with Node.js, Express.js, and PostgreSQL. This system provides complete functionality for managing books, borrowers, and borrowing operations with advanced features like reporting, rate limiting, and comprehensive testing.

## 🚀 Features

- **Book Management**: Add, view, update, and delete books
- **Borrower Management**: Register and manage library members
- **Borrowing System**: Handle book borrowing and returning operations
- **Due Date Tracking**: Monitor overdue books and send notifications
- **Search Functionality**: Search books by title, author, or ISBN
- **Report Generation**: Export borrowing data in CSV/Excel formats
- **Rate Limiting**: API protection against abuse
- **Authentication**: Basic authentication for secure access
- **Swagger Documentation**: Interactive API documentation
- **Comprehensive Testing**: Full test coverage with Vitest
- **Docker Support**: Containerized deployment


## 📋 Prerequisites

Make sure you have:

- Docker (v20+)

- Docker Compose (v2+)

(Local setup with Node/Postgres is also possible, but Docker is recommended for simplicity.)
## Run with Docker (Recommended)
This project comes with a ready-to-use docker-compose.yml that runs:

- db → PostgreSQL database

- app → Node.js Express server

#### 1. Clone the Repository
```
Bash

git clone https://github.com/abdallahsellem/Library-Management-System.git
cd Library-Management-System
```

#### 2. Configure Environment
Create a .env file in the root directory:
```env 
PORT=3000

DB_HOST=db
DB_PORT=5432
DB_USER=root
DB_PASSWORD=password
DB_NAME=library_db

# Basic Authentication
API_USER=admin
API_PASSWORD=secret123
```
#### 3. Start Services
```bash 
docker compose up --build
```

#### 4. Access Services
API → http://localhost:3000

Swagger → http://localhost:3000/api-docs

✅ Sequelize will automatically create the required tables in Postgres.

## 🗄️ Database Schema

The application will automatically create the following tables:

### Books Table
- `id` (Primary Key)
- `title` (String, Required)
- `author` (String, Required)
- `isbn` (String, Unique, Required)
- `quantity` (Integer, Default: 1)
- `shelfLocation` (String)
- `createdAt`, `updatedAt` (Timestamps)

### Borrowers Table
- `id` (Primary Key)
- `name` (String, Required)
- `email` (String, Unique, Required)
- `registeredDate` (Date, Default: Now)
- `createdAt`, `updatedAt` (Timestamps)

### Borrows Table
- `id` (Primary Key)
- `bookId` (Foreign Key → Books)
- `borrowerId` (Foreign Key → Borrowers)
- `borrowDate` (Date, Default: Now)
- `dueDate` (Date, Required)
- `returnDate` (Date, Nullable)
- `createdAt`, `updatedAt` (Timestamps)

## 📊 Populating Sample Data

After starting the server, you can populate the database with sample data:

```bash
# Make sure the server is running on http://localhost:3000
node utils/populate-dummy-data.js
```

This script will create:
- **10 sample books** (classics like "1984", "The Great Gatsby", etc.)
- **8 sample borrowers** with Egyptian names
- **13 sample borrow records** (including some overdue books)

### Sample Data Includes:
- Books from various genres and authors
- Borrowers with realistic profiles
- Current and overdue borrow records for testing

## 🔧 API Endpoints

### Authentication
Most endpoints require basic authentication:
- **Username**: admin (or value from `API_USER` env var)
- **Password**: secret123 (or value from `API_PASSWORD` env var)

### Books API
```
GET    /books              # Get all books
POST   /books              # Create a new book
PUT    /books/:id          # Update a book
DELETE /books/:id          # Delete a book
GET    /books/search       # Search books (query: title, author, isbn)
```

### Borrowers API
```
GET    /borrowers          # Get all borrowers
POST   /borrowers          # Register a new borrower
DELETE /borrowers/:id      # Delete a borrower
```

### Borrowing API
```
GET    /borrows                    # Get all borrow records
POST   /borrows                   # Create a borrow record
GET    /borrows/borrower/:id      # Get borrows for specific borrower
POST   /borrows/:id/return        # Return a borrowed book
GET    /borrows/due               # Get overdue books
```

### Reports API
```
GET    /reports/export/csv        # Export borrowing data as CSV
GET    /reports/export/excel      # Export borrowing data as Excel
```

## 📝 API Documentation

Interactive API documentation is available via Swagger UI:

**URL**: `http://localhost:3000/api-docs`

The documentation includes:
- Complete endpoint descriptions
- Request/response schemas
- Example requests and responses
- Authentication requirements

## 🧪 Testing

This project includes comprehensive test coverage using **Vitest**.

### Test Coverage
- **32 comprehensive tests** across all endpoints
- **Books API**: 8 tests
- **Borrowers API**: 8 tests  
- **Borrow/Return API**: 16 tests

### Running Tests

```bash
# Run all tests once
npm run test:run

# Run tests in watch mode
npm test

```
### Testing Rate Limit : 

```bash 
chmod +x ./tests/test_rate_limit.sh 
./tests/test_rate_limit.sh 
```

### Test Structure
```
tests/
├── book.test.js       # Books API tests
├── borrower.test.js   # Borrowers API tests
├── borrow.test.js     # Borrow/Return API tests
└── setup.js           # Test environment setup
```

### Testing Features
- **Complete API testing** with Supertest
- **Database mocking** for isolated testing
- **Error scenario testing**
- **Authentication bypass** for testing
- **Comprehensive assertions** for all endpoints

## 🔒 Security Features

### Rate Limiting
- **Books API**: 5 requests allowed per minute
- **Borrowers API**: only 2 requests allowed in 10 seconds

### Authentication
- Basic HTTP authentication required for all endpoints
- Configurable credentials via environment variables


## 🐳 Docker Deployment

### Using Docker Compose
```bash
# Start all services (app + PostgreSQL)
docker-compose up -d
```
## 📁 Project Structure

```
library-management/
├── config/                 # Configuration files
│   ├── db.js              # Database configuration
│   └── swagger.js         # Swagger documentation setup
├── controllers/           # Route controllers
│   ├── bookController.js
│   ├── borrowController.js
│   ├── borrowerController.js
│   └── reportController.js
├── middlewares/           # Custom middleware
│   ├── auth.js           # Authentication middleware
│   └── rateLimiter.js    # Rate limiting middleware
├── models/               # Sequelize models
│   ├── Book.js
│   ├── Borrower.js
│   ├── Borrow.js
│   └── connectDB.js
├── routes/               # API routes
│   ├── bookRoutes.js
│   ├── borrowRoutes.js
│   ├── borrowerRoutes.js
│   └── reportRoutes.js
├── services/             # Business logic services
│   └── reportService.js
├── tests/                # Test files
│   ├── book.test.js
│   ├── borrow.test.js
│   ├── borrower.test.js
│   └── setup.js
├── utils/                # Utility functions
│   └── populate-dummy-data.js
├── app.js                # Express app setup
├── server.js             # Server entry point
├── vitest.config.js      # Test configuration
└── docker-compose.yml    # Docker services
```


## Acknowledgments

- Built as part of Bosta's technical assessment

