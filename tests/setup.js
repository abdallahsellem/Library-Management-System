import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Fallback to regular .env if .env.test doesn't exist
if (!process.env.NODE_ENV) {
  dotenv.config();
}

// Set test environment
process.env.NODE_ENV = 'test';
