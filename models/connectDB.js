import sequelize from '../config/db.js';
import Book from './Book.js';
import Borrower from './Borrower.js';
import Borrow from './Borrow.js';

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync models (creates tables if not exist)
    await sequelize.sync({ alter: true }); 
    console.log('✅ Models synchronized');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export { connectDB, Book, Borrower, Borrow };
