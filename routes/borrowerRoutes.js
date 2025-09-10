import express from 'express';
import { createBorrower, getBorrowers, deleteBorrower } from '../controllers/borrowerController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Borrowers
 *   description: API for managing borrowers
 */

/**
 * @swagger
 * /borrowers:
 *   get:
 *     summary: Get all borrowers
 *     tags: [Borrowers]
 *     responses:
 *       200:
 *         description: List of borrowers
 */
router.get('/', getBorrowers);

/**
 * @swagger
 * /borrowers:
 *   post:
 *     summary: Register a new borrower
 *     tags: [Borrowers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *     responses:
 *       201:
 *         description: Borrower created
 */
router.post('/', createBorrower);

/**
 * @swagger
 * /borrowers/{id}:
 *   delete:
 *     summary: Delete a borrower
 *     tags: [Borrowers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID of the borrower
 *     responses:
 *       200:
 *         description: Borrower deleted
 *       404:
 *         description: Borrower not found
 */
router.delete('/:id', deleteBorrower);

export default router;
