import express from 'express';
import { getBorrowReport, getOverdueReport } from '../controllers/reportController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Export reports in CSV/XLSX
 */

/**
 * @swagger
 * /reports/borrows:
 *   get:
 *     summary: Export borrow report
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema: { type: string, enum: [last_week, last_month, all] }
 *         description: Time period for report
 *       - in: query
 *         name: format
 *         schema: { type: string, enum: [csv, xlsx] }
 *         description: Output format
 *     responses:
 *       200:
 *         description: Borrow report file
 */
router.get('/borrows', getBorrowReport);

/**
 * @swagger
 * /reports/overdue:
 *   get:
 *     summary: Export overdue report
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema: { type: string, enum: [last_week, last_month, all] }
 *         description: Time period for report
 *       - in: query
 *         name: format
 *         schema: { type: string, enum: [csv, xlsx] }
 *         description: Output format
 *     responses:
 *       200:
 *         description: Overdue report file
 */
router.get('/overdue', getOverdueReport);

export default router;
