import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Database name
  process.env.DB_USER,     // DB username
  process.env.DB_PASS,     // DB password
  {
    host: process.env.DB_HOST,
    dialect: 'postgres', // postgres or mysql
    logging: false, // disable SQL logging in console
  }
);

export default sequelize;
