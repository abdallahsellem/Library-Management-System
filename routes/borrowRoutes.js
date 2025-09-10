import express from 'express';
import { 
  createBorrow, 
  getBorrows, 
  getBorrowsByBorrower, 
  returnBook, 
  getDueDateBooks 
} from '../controllers/borrowController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Borrows
 *   description: API for borrowing and returning books
 */

/**
 * @swagger
 * /borrows:
 *   get:
 *     summary: Get all borrow records
 *     tags: [Borrows]
 *     responses:
 *       200:
 *         description: List of all borrow records
 */
router.get('/', getBorrows);

/**
 * @swagger
 * /borrows:
 *   post:
 *     summary: Create a borrow record (borrow a book)
 *     tags: [Borrows]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId: { type: integer }
 *               borrowerId: { type: integer }
 *               borrowDate: { type: string, format: date }
 *               dueDate: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Borrow record created
 *       400:
 *         description: No available copies
 *       404:
 *         description: Book or borrower not found
 */
router.post('/', createBorrow);

/**
 * @swagger
 * /borrows/borrower/{borrowerId}:
 *   get:
 *     summary: Get all borrow records for a specific borrower
 *     tags: [Borrows]
 *     parameters:
 *       - in: path
 *         name: borrowerId
 *         required: true
 *         schema: { type: integer }
 *         description: ID of the borrower
 *     responses:
 *       200:
 *         description: List of borrow records for the borrower
 *       404:
 *         description: Borrower not found
 */
router.get('/borrower/:borrowerId', getBorrowsByBorrower);

/**
 * @swagger
 * /borrows/{id}/return:
 *   post:
 *     summary: Return a borrowed book
 *     tags: [Borrows]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID of the borrow record
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       404:
 *         description: Borrow record not found
 */
router.post('/:id/return', returnBook);

/**
 * @swagger
 * /borrows/due:
 *   get:
 *     summary: Get all books that are due today or overdue
 *     tags: [Borrows]
 *     responses:
 *       200:
 *         description: List of due/overdue borrow records
 */
router.get('/due', getDueDateBooks);

export default router;
