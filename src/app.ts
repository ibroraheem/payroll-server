import cors from 'cors';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/database';
import adminRouter from './routes/admin';

dotenv.config();
connectDB();

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(helmet());
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Origin',
      'x-access-token',
      'X-Requested-With',
      'Accept',
      'Access-Control-Allow-Headers',
      'Access-Control-Request-Headers',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Credentials',
    ],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

// Hello World route
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello World!');
});

// Admin routes
app.use('/admin', adminRouter);

// Swagger UI setup
app.get('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start the server
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
