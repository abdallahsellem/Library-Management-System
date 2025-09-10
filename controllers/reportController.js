import { 
  fetchBorrowReport, 
  fetchOverdueReport, 
  exportReport 
} from '../services/reportService.js';

// Borrowing report
export const getBorrowReport = async (req, res, next) => {
  try {
    const { period, format = 'csv' } = req.query;
    const borrows = await fetchBorrowReport(period);
    await exportReport(borrows, format, res, 'borrows', 'Borrows');
  } catch (err) {
    next(err);
  }
};

// Overdue report
export const getOverdueReport = async (req, res, next) => {
  try {
    const { period, format = 'csv' } = req.query;
    const borrows = await fetchOverdueReport(period);
    await exportReport(borrows, format, res, 'overdue', 'Overdue');
  } catch (err) {
    next(err);
  }
};
