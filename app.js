import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bookRoutes from './routes/bookRoutes.js';
import borrowerRoutes from './routes/borrowerRoutes.js';
import borrowRoutes from './routes/borrowRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
const app = express();

app.use(cors());
app.use(express.json());

// for logging requests
app.use(morgan('dev'));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/books', bookRoutes); // Register book routes
app.use('/borrowers', borrowerRoutes); // Register borrower routes
app.use('/borrows', borrowRoutes); // Register borrow routes

app.get('/', (req, res) => res.send('Library Management System running'));

export default app;