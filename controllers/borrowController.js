import Borrow from '../models/Borrow.js';
import Book  from '../models/Book.js';
import Borrower  from '../models/Borrower.js';
import { Op } from 'sequelize';

// Create a borrow record
export const createBorrow = async (req, res, next) => {
  try {
    const { bookId, borrowerId, borrowDate, dueDate } = req.body;
    Book.findByPk(bookId).then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      if(book.availableCopies < 1) {
        return res.status(400).json({ message: 'No available copies' });
      }

      Borrower.findByPk(borrowerId).then(borrower => {
        if (!borrower) {
          return res.status(404).json({ message: 'Borrower not found' });
        }

        // Decrease available copies
        book.update({ availableCopies: book.availableCopies - 1 });

        Borrow.create({ bookId, borrowerId, borrowDate, dueDate })
          .then(borrow => res.status(201).json(borrow))
          .catch(err => next(err));
      });
    });
  } catch (err) {
    next(err);
  }
};
//get all borrow records
export const getBorrows = async (req, res, next) => {
  try {
    const borrows = await Borrow.findAll({
      include: [Book, Borrower]
    });
    res.json(borrows);
  } catch (err) {
    next(err);
  }
};

//get borrow for specific borrower 
export const getBorrowsByBorrower = async (req, res, next) => {
  try {
    const { borrowerId } = req.params;
    const borrows = await Borrow.findAll({
      where: { borrowerId },
      include: [Book, Borrower]
    });
    res.json(borrows);
  } catch (err) {
    next(err);
  }
};
// Return a book
export const returnBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const borrow = await Borrow.findByPk(id);
    if (!borrow) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    const book = await Book.findByPk(borrow.bookId);
    if (book) {
      // Increase available copies
      await book.update({ availableCopies: book.availableCopies + 1 });
    }

    await borrow.destroy();
    res.json({ message: 'Book returned successfully' });
  } catch (err) {
    next(err);
  }
};

// get DueDate books 
export const getDueDateBooks = async (req, res, next) => {
  try {
    const today = new Date();
    const dueBooks = await Borrow.findAll({
      where: {
        dueDate: {
          [Op.lte]: today
        }
      },
      include: [Book, Borrower]
    });
    res.json(dueBooks);
  } catch (err) {
    next(err);
  }
};
