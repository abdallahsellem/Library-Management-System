import express from 'express';
import { createBook,searchBooks, getBooks, updateBook, deleteBook } from '../controllers/bookController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API for managing books
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of books
 */
router.get('/', getBooks);

/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Search for books by title, author, or ISBN
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema: { type: string }
 *         description: Title of the book
 *       - in: query
 *         name: author
 *         schema: { type: string }
 *         description: Author of the book
 *       - in: query
 *         name: isbn
 *         schema: { type: string }
 *         description: ISBN of the book
 *     responses:
 *       200:
 *         description: List of matching books
 */
router.get('/search', searchBooks);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               author: { type: string }
 *               isbn: { type: string }
 *               quantity: { type: integer }
 *               shelfLocation: { type: string }
 *     responses:
 *       201:
 *         description: Book created
 */
router.post('/', createBook);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update book details
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID of the book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Book updated
 *       404:
 *         description: Book not found
 */
router.put('/:id', updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID of the book
 *     responses:
 *       200:
 *         description: Book deleted
 *       404:
 *         description: Book not found
 */
router.delete('/:id', deleteBook);

export default router;
