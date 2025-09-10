import Book from '../models/Book.js';
import { Op } from 'sequelize';

// Create a book
export const createBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

// Get all books
export const getBooks = async (req, res, next) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    next(err);
  }
};
// search for a book
export const searchBooks = async (req, res, next) => {
  try {
    const { title, author, isbn } = req.query;

    const where = {};
    if (title) where.title = { [Op.iLike]: `%${title}%` };
    if (author) where.author = { [Op.iLike]: `%${author}%` };
    if (isbn) where.isbn = { [Op.iLike]: `%${isbn}%` };

    const books = await Book.findAll({ where });

    if (books.length === 0) {
      return res.status(404).json({ message: "No matching books found" });
    }

    res.json(books);
  } catch (err) {
    next(err);
  }
};

// Update a book
export const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Book.update(req.body, { where: { id } });
    res.json({ message: "Book updated" });
  } catch (err) {
    next(err);
  }
};

// Delete a book
export const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Book.destroy({ where: { id } });
    res.json({ message: "Book deleted" });
  } catch (err) {
    next(err);
  }
};
