import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Borrower = sequelize.define('Borrower', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  registeredDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { timestamps: true });

export default Borrower;
