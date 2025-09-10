import { describe, test, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';

// Mock all models to avoid relationship issues
vi.mock('../models/Book.js', () => ({
  default: {
    findAll: vi.fn(),
    create: vi.fn(),
    findByPk: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
    hasMany: vi.fn(),
    belongsTo: vi.fn(),
  }
}));

vi.mock('../models/Borrower.js', () => ({
  default: {
    findAll: vi.fn(),
    create: vi.fn(),
    findByPk: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
    hasMany: vi.fn(),
    belongsTo: vi.fn(),
  }
}));

vi.mock('../models/Borrow.js', () => ({
  default: {
    findAll: vi.fn(),
    create: vi.fn(),
    findByPk: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
    hasMany: vi.fn(),
    belongsTo: vi.fn(),
  }
}));

// Mock Sequelize operators
vi.mock('sequelize', async () => {
  const actual = await vi.importActual('sequelize');
  return {
    ...actual,
    Op: {
      lte: Symbol('lte'),
      gte: Symbol('gte'),
      iLike: Symbol('iLike'),
    },
  };
});

// Mock the database connection
vi.mock('../config/db.js', () => ({
  default: {
    define: vi.fn(),
    authenticate: vi.fn(),
    sync: vi.fn(),
  }
}));

// Mock the database connection helper
vi.mock('../models/connectDB.js', () => ({
  connectDB: vi.fn().mockResolvedValue()
}));

// Mock the auth middleware to bypass authentication in tests
vi.mock('../middlewares/auth.js', () => ({
  authMiddleware: (req, res, next) => next()
}));

// Mock rate limiter
vi.mock('../middlewares/rateLimiter.js', () => ({
  borrowerLimiter: (req, res, next) => next(),
  bookLimiter: (req, res, next) => next()
}));

// Import the app after mocking
import app from '../app.js';
// Import the mocked models
import Book from '../models/Book.js';
import Borrower from '../models/Borrower.js';
import Borrow from '../models/Borrow.js';

describe('Borrows API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('GET /borrows', () => {
    test('should return all borrow records', async () => {
      // Arrange
      const mockBorrows = [
        { 
          id: 1, 
          bookId: 1, 
          borrowerId: 1, 
          borrowDate: '2023-01-01',
          dueDate: '2023-01-15',
          returnDate: null,
          Book: { id: 1, title: 'Test Book' },
          Borrower: { id: 1, name: 'John Doe' }
        },
        { 
          id: 2, 
          bookId: 2, 
          borrowerId: 2, 
          borrowDate: '2023-01-02',
          dueDate: '2023-01-16',
          returnDate: null,
          Book: { id: 2, title: 'Another Book' },
          Borrower: { id: 2, name: 'Jane Smith' }
        },
      ];
      Borrow.findAll.mockResolvedValue(mockBorrows);

      // Act
      const response = await request(app).get('/borrows');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBorrows);
      expect(Borrow.findAll).toHaveBeenCalledWith({
        include: [Book, Borrower]
      });
    });

    test('should handle database errors', async () => {
      // Arrange
      Borrow.findAll.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app).get('/borrows');

      // Assert
      expect(response.status).toBe(500);
      expect(Borrow.findAll).toHaveBeenCalledWith({
        include: [Book, Borrower]
      });
    });
  });

  describe('POST /borrows', () => {
    test('should create a borrow record successfully', async () => {
      // Arrange
      const borrowData = {
        bookId: 1,
        borrowerId: 1,
        borrowDate: '2023-01-01',
        dueDate: '2023-01-15'
      };

      const mockBook = {
        id: 1,
        title: 'Test Book',
        availableCopies: 5,
        update: vi.fn().mockResolvedValue()
      };

      const mockBorrower = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      };

      const mockBorrow = {
        id: 1,
        ...borrowData
      };

      Book.findByPk.mockImplementation(() => Promise.resolve(mockBook));
      Borrower.findByPk.mockImplementation(() => Promise.resolve(mockBorrower));
      Borrow.create.mockResolvedValue(mockBorrow);

      // Act
      const response = await request(app)
        .post('/borrows')
        .send(borrowData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockBorrow);
      expect(Book.findByPk).toHaveBeenCalledWith(1);
      expect(Borrower.findByPk).toHaveBeenCalledWith(1);
      expect(mockBook.update).toHaveBeenCalledWith({ availableCopies: 4 });
      expect(Borrow.create).toHaveBeenCalledWith(borrowData);
    });

    test('should return 404 if book not found', async () => {
      // Arrange
      const borrowData = {
        bookId: 999,
        borrowerId: 1,
        borrowDate: '2023-01-01',
        dueDate: '2023-01-15'
      };

      Book.findByPk.mockImplementation(() => Promise.resolve(null));

      // Act
      const response = await request(app)
        .post('/borrows')
        .send(borrowData);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Book not found' });
      expect(Book.findByPk).toHaveBeenCalledWith(999);
    });

    test('should return 400 if no available copies', async () => {
      // Arrange
      const borrowData = {
        bookId: 1,
        borrowerId: 1,
        borrowDate: '2023-01-01',
        dueDate: '2023-01-15'
      };

      const mockBook = {
        id: 1,
        title: 'Test Book',
        availableCopies: 0
      };

      Book.findByPk.mockImplementation(() => Promise.resolve(mockBook));

      // Act
      const response = await request(app)
        .post('/borrows')
        .send(borrowData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'No available copies' });
      expect(Book.findByPk).toHaveBeenCalledWith(1);
    });

    test('should return 404 if borrower not found', async () => {
      // Arrange
      const borrowData = {
        bookId: 1,
        borrowerId: 999,
        borrowDate: '2023-01-01',
        dueDate: '2023-01-15'
      };

      const mockBook = {
        id: 1,
        title: 'Test Book',
        availableCopies: 5
      };

      Book.findByPk.mockImplementation(() => Promise.resolve(mockBook));
      Borrower.findByPk.mockImplementation(() => Promise.resolve(null));

      // Act
      const response = await request(app)
        .post('/borrows')
        .send(borrowData);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Borrower not found' });
      expect(Book.findByPk).toHaveBeenCalledWith(1);
      expect(Borrower.findByPk).toHaveBeenCalledWith(999);
    });
  });

  describe('GET /borrows/borrower/:borrowerId', () => {
    test('should return borrows for a specific borrower', async () => {
      // Arrange
      const borrowerId = '1';
      const mockBorrows = [
        { 
          id: 1, 
          bookId: 1, 
          borrowerId: 1, 
          borrowDate: '2023-01-01',
          dueDate: '2023-01-15',
          Book: { id: 1, title: 'Test Book' },
          Borrower: { id: 1, name: 'John Doe' }
        },
      ];
      Borrow.findAll.mockResolvedValue(mockBorrows);

      // Act
      const response = await request(app).get(`/borrows/borrower/${borrowerId}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBorrows);
      expect(Borrow.findAll).toHaveBeenCalledWith({
        where: { borrowerId },
        include: [Book, Borrower]
      });
    });

    test('should return empty array if no borrows found', async () => {
      // Arrange
      const borrowerId = '999';
      Borrow.findAll.mockResolvedValue([]);

      // Act
      const response = await request(app).get(`/borrows/borrower/${borrowerId}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(Borrow.findAll).toHaveBeenCalledWith({
        where: { borrowerId },
        include: [Book, Borrower]
      });
    });

    test('should handle database errors', async () => {
      // Arrange
      const borrowerId = '1';
      Borrow.findAll.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app).get(`/borrows/borrower/${borrowerId}`);

      // Assert
      expect(response.status).toBe(500);
      expect(Borrow.findAll).toHaveBeenCalledWith({
        where: { borrowerId },
        include: [Book, Borrower]
      });
    });
  });

  describe('POST /borrows/:id/return', () => {
    test('should return a book successfully', async () => {
      // Arrange
      const borrowId = '1';
      const mockBorrow = {
        id: 1,
        bookId: 1,
        borrowerId: 1,
        destroy: vi.fn().mockResolvedValue()
      };

      const mockBook = {
        id: 1,
        title: 'Test Book',
        availableCopies: 4,
        update: vi.fn().mockResolvedValue()
      };

      Borrow.findByPk.mockResolvedValue(mockBorrow);
      Book.findByPk.mockResolvedValue(mockBook);

      // Act
      const response = await request(app).post(`/borrows/${borrowId}/return`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Book returned successfully' });
      expect(Borrow.findByPk).toHaveBeenCalledWith(borrowId);
      expect(Book.findByPk).toHaveBeenCalledWith(1);
      expect(mockBook.update).toHaveBeenCalledWith({ availableCopies: 5 });
      expect(mockBorrow.destroy).toHaveBeenCalled();
    });

    test('should return 404 if borrow record not found', async () => {
      // Arrange
      const borrowId = '999';
      Borrow.findByPk.mockResolvedValue(null);

      // Act
      const response = await request(app).post(`/borrows/${borrowId}/return`);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Borrow record not found' });
      expect(Borrow.findByPk).toHaveBeenCalledWith(borrowId);
    });

    test('should handle case when book is not found during return', async () => {
      // Arrange
      const borrowId = '1';
      const mockBorrow = {
        id: 1,
        bookId: 1,
        borrowerId: 1,
        destroy: vi.fn().mockResolvedValue()
      };

      Borrow.findByPk.mockResolvedValue(mockBorrow);
      Book.findByPk.mockResolvedValue(null);

      // Act
      const response = await request(app).post(`/borrows/${borrowId}/return`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Book returned successfully' });
      expect(Borrow.findByPk).toHaveBeenCalledWith(borrowId);
      expect(Book.findByPk).toHaveBeenCalledWith(1);
      expect(mockBorrow.destroy).toHaveBeenCalled();
    });

    test('should handle database errors during return', async () => {
      // Arrange
      const borrowId = '1';
      Borrow.findByPk.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app).post(`/borrows/${borrowId}/return`);

      // Assert
      expect(response.status).toBe(500);
      expect(Borrow.findByPk).toHaveBeenCalledWith(borrowId);
    });
  });

  describe('GET /borrows/due', () => {
    test('should return due and overdue books', async () => {
      // Arrange
      const mockDueBooks = [
        { 
          id: 1, 
          bookId: 1, 
          borrowerId: 1, 
          borrowDate: '2023-01-01',
          dueDate: '2023-01-10', // Past due date
          Book: { id: 1, title: 'Overdue Book' },
          Borrower: { id: 1, name: 'John Doe' }
        },
      ];
      
      Borrow.findAll.mockResolvedValue(mockDueBooks);

      // Act
      const response = await request(app).get('/borrows/due');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDueBooks);
      expect(Borrow.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          dueDate: expect.any(Object)
        }),
        include: [Book, Borrower]
      }));
    });

    test('should return empty array if no due books', async () => {
      // Arrange
      Borrow.findAll.mockResolvedValue([]);

      // Act
      const response = await request(app).get('/borrows/due');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(Borrow.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          dueDate: expect.any(Object)
        }),
        include: [Book, Borrower]
      }));
    });

    test('should handle database errors', async () => {
      // Arrange
      Borrow.findAll.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app).get('/borrows/due');

      // Assert
      expect(response.status).toBe(500);
      expect(Borrow.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          dueDate: expect.any(Object)
        }),
        include: [Book, Borrower]
      }));
    });
  });
});
