import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bookRoutes from './routes/bookRoutes.js';
import borrowerRoutes from './routes/borrowerRoutes.js';
import borrowRoutes from './routes/borrowRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import reportRoutes from './routes/reportRoutes.js';
import { authMiddleware } from './middlewares/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

// for logging requests
app.use(morgan('dev'));

app.use(authMiddleware); 
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/books', bookRoutes); 
app.use('/borrowers', borrowerRoutes); 
app.use('/borrows', borrowRoutes); 
app.use('/reports', reportRoutes);

app.get('/', (req, res) => res.send('Library Management System running'));

export default app;