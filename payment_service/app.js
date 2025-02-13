import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/mongoose.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));