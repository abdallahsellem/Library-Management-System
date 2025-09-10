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
// Import the mocked Borrower model
import Borrower from '../models/Borrower.js';

describe('Borrowers API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('GET /borrowers', () => {
    test('should return all borrowers', async () => {
      // Arrange
      const mockBorrowers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', registeredDate: '2023-01-01' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', registeredDate: '2023-01-02' },
      ];
      Borrower.findAll.mockResolvedValue(mockBorrowers);

      // Act
      const response = await request(app).get('/borrowers');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBorrowers);
      expect(Borrower.findAll).toHaveBeenCalledOnce();
    });

    test('should handle database errors', async () => {
      // Arrange
      Borrower.findAll.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app).get('/borrowers');

      // Assert
      expect(response.status).toBe(500);
      expect(Borrower.findAll).toHaveBeenCalledOnce();
    });
  });

  describe('POST /borrowers', () => {
    test('should create a new borrower', async () => {
      // Arrange
      const newBorrower = {
        name: 'Alice Johnson',
        email: 'alice@example.com'
      };
      const createdBorrower = { 
        id: 3, 
        ...newBorrower, 
        registeredDate: '2023-01-03T00:00:00.000Z' 
      };
      Borrower.create.mockResolvedValue(createdBorrower);

      // Act
      const response = await request(app)
        .post('/borrowers')
        .send(newBorrower);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdBorrower);
      expect(Borrower.create).toHaveBeenCalledWith(newBorrower);
    });

    test('should handle validation errors', async () => {
      // Arrange
      const invalidBorrower = {
        name: 'Bob Wilson'
        // Missing required email field
      };
      Borrower.create.mockRejectedValue(new Error('Validation error'));

      // Act
      const response = await request(app)
        .post('/borrowers')
        .send(invalidBorrower);

      // Assert
      expect(response.status).toBe(500);
      expect(Borrower.create).toHaveBeenCalledWith(invalidBorrower);
    });

    test('should handle duplicate email errors', async () => {
      // Arrange
      const duplicateBorrower = {
        name: 'Charlie Brown',
        email: 'john@example.com' // Duplicate email
      };
      Borrower.create.mockRejectedValue(new Error('Unique constraint error'));

      // Act
      const response = await request(app)
        .post('/borrowers')
        .send(duplicateBorrower);

      // Assert
      expect(response.status).toBe(500);
      expect(Borrower.create).toHaveBeenCalledWith(duplicateBorrower);
    });
  });

  describe('DELETE /borrowers/:id', () => {
    test('should delete a borrower', async () => {
      // Arrange
      Borrower.destroy.mockResolvedValue(1); // 1 row deleted

      // Act
      const response = await request(app).delete('/borrowers/1');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Borrower deleted' });
      expect(Borrower.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    test('should delete even if borrower not found (current implementation)', async () => {
      // Note: Current implementation doesn't check if borrower exists before deleting
      // Arrange
      Borrower.destroy.mockResolvedValue(0); // No rows deleted

      // Act
      const response = await request(app).delete('/borrowers/999');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Borrower deleted' });
      expect(Borrower.destroy).toHaveBeenCalledWith({ where: { id: '999' } });
    });

    test('should handle database errors during deletion', async () => {
      // Arrange
      Borrower.destroy.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app).delete('/borrowers/1');

      // Assert
      expect(response.status).toBe(500);
      expect(Borrower.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
