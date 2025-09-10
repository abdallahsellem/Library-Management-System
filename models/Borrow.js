import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Book from './Book.js';
import Borrower from './Borrower.js';

const Borrow = sequelize.define('Borrow', {
  borrowDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  dueDate: { type: DataTypes.DATE, allowNull: false },
  returnDate: { type: DataTypes.DATE, allowNull: true }
}, { timestamps: true });

// Relationships
Book.hasMany(Borrow, { foreignKey: 'bookId' });
Borrow.belongsTo(Book, { foreignKey: 'bookId' });

Borrower.hasMany(Borrow, { foreignKey: 'borrowerId' });
Borrow.belongsTo(Borrower, { foreignKey: 'borrowerId' });

export default Borrow;
