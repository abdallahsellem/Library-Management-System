import Borrow from '../models/Borrow.js';
import Book from '../models/Book.js';
import Borrower from '../models/Borrower.js';
import { Op } from 'sequelize';
import ExcelJS from 'exceljs';
import { Parser } from 'json2csv';

// calculate date range
export const getDateRange = (period) => {
  const today = new Date();
  let startDate;

  switch (period) {
    case 'last_month':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      break;
    case 'last_week':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      break;
    default:
      startDate = new Date(0); 
  }

  return { startDate, endDate: today };
};

// format Sequelize result into plain objects
const formatData = (borrows) => borrows.map(b => ({
  BorrowID: b.id,
  BookTitle: b.Book.title,
  Borrower: b.Borrower.name,
  BorrowDate: b.borrowDate,
  DueDate: b.dueDate,
}));


export const buildCSV = (data) => {
  const parser = new Parser();
  return parser.parse(data);
};

// Build XLSX
export const buildXLSX = async (data, sheetName = 'Report') => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);
  sheet.columns = Object.keys(data[0] || {}).map(key => ({ header: key, key }));
  sheet.addRows(data);
  return workbook;
};

// Query for borrows in period
export const fetchBorrowReport = async (period) => {
  const { startDate, endDate } = getDateRange(period);

  return Borrow.findAll({
    where: { borrowDate: { [Op.between]: [startDate, endDate] } },
    include: [Book, Borrower],
  });
};

export const fetchOverdueReport = async (period) => {
  const { startDate, endDate } = getDateRange(period);

  return Borrow.findAll({
    where: {
      dueDate: { [Op.lte]: endDate },
      borrowDate: { [Op.gte]: startDate },
    },
    include: [Book, Borrower],
  });
};

// Generic exporter
export const exportReport = async (borrows, format, res, fileName, sheetName) => {
  const data = formatData(borrows);

  if (format === 'xlsx') {
    const workbook = await buildXLSX(data, sheetName);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } else {
    const csv = buildCSV(data);
    res.header('Content-Type', 'text/csv');
    res.attachment(`${fileName}.csv`);
    res.send(csv);
  }
};