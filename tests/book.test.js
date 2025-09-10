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

// Import the app after mocking
import app from '../app.js';
// Import the mocked Book model
import Book from '../models/Book.js';

describe('Books API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('GET /books', () => {
    test('should return all books', async () => {
      // Arrange
      const mockBooks = [
        { id: 1, title: 'Book A', author: 'Author A', isbn: '111', quantity: 5, shelfLocation: 'A1' },
        { id: 2, title: 'Book B', author: 'Author B', isbn: '222', quantity: 3, shelfLocation: 'B1' },
      ];
      Book.findAll.mockResolvedValue(mockBooks);

      // Act
      const response = await request(app).get('/books');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBooks);
      expect(Book.findAll).toHaveBeenCalledOnce();
    });

    test('should handle database errors', async () => {
      // Arrange
      Book.findAll.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app).get('/books');

      // Assert
      expect(response.status).toBe(500);
      expect(Book.findAll).toHaveBeenCalledOnce();
    });
  });

  describe('POST /books', () => {
    test('should create a new book', async () => {
      // Arrange
      const newBook = {
        title: 'New Book',
        author: 'New Author',
        isbn: '999',
        quantity: 10,
        shelfLocation: 'C1'
      };
      const createdBook = { id: 3, ...newBook };
      Book.create.mockResolvedValue(createdBook);

      // Act
      const response = await request(app)
        .post('/books')
        .send(newBook);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdBook);
      expect(Book.create).toHaveBeenCalledWith(newBook);
    });

    test('should handle database errors', async () => {
      // Arrange
      const invalidBook = {
        author: 'Author without title',
        isbn: '123'
      };
      Book.create.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app)
        .post('/books')
        .send(invalidBook);

      // Assert
      expect(response.status).toBe(500);
      expect(Book.create).toHaveBeenCalledWith(invalidBook);
    });
  });


  describe('PUT /books/:id', () => {
    test('should update a book', async () => {
      // Arrange
      const updateData = { title: 'Updated Book' };
      Book.update.mockResolvedValue([1]); // Sequelize returns [affectedRows]

      // Act
      const response = await request(app)
        .put('/books/1')
        .send(updateData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Book updated' });
      expect(Book.update).toHaveBeenCalledWith(
        updateData,
        { where: { id: '1' } }
      );
    });

    test('should update even if book not found (current implementation)', async () => {
      // Note: Current implementation doesn't check if book exists before updating
      // Arrange
      const updateData = { title: 'Updated Book' };
      Book.update.mockResolvedValue([0]); // No rows affected

      // Act
      const response = await request(app)
        .put('/books/999')
        .send(updateData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Book updated' });
      expect(Book.update).toHaveBeenCalledWith(
        updateData,
        { where: { id: '999' } }
      );
    });
  });

  describe('DELETE /books/:id', () => {
    test('should delete a book', async () => {
      // Arrange
      Book.destroy.mockResolvedValue(1); // 1 row deleted

      // Act
      const response = await request(app).delete('/books/1');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Book deleted' });
      expect(Book.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    test('should delete even if book not found (current implementation)', async () => {
      // Note: Current implementation doesn't check if book exists before deleting
      // Arrange
      Book.destroy.mockResolvedValue(0); // No rows deleted

      // Act
      const response = await request(app).delete('/books/999');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Book deleted' });
      expect(Book.destroy).toHaveBeenCalledWith({ where: { id: '999' } });
    });
  });
});
