import cors from 'cors'
import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/database';
import { outputFile } from './swagger-autogen'; 
import adminRouter from './routes/admin'

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'x-access-token', 'X-Requested-With', 'Accept', 'Access-Control-Allow-Headers', 'Access-Control-Request-Headers', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Credentials'],
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require(outputFile))); // Use the generated Swagger file
app.use('/admin', adminRouter)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
