import express from 'express';
import connectDB from './config/database';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

connectDB()
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
