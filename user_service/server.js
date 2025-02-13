import express from 'express';
import cors from 'cors';    
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.mjs'; // Make sure to import userRoutes
import authRoutes from './routes/authRoutes.mjs';
import connectDB from './db/mongoose.js';


dotenv.config(); // Load environment variables from .env file


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

connectDB().then(() => {  
  app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
  });
})  
.catch(err => {
  console.error('Failed to connect to MongoDB', err);
});