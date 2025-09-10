import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Book = sequelize.define('Book', {
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  isbn: { type: DataTypes.STRING, unique: true, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  shelfLocation: { type: DataTypes.STRING }
}, { timestamps: true });

export default Book;
