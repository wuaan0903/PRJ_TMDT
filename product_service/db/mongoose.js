import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

//Local MongoDB URI
// const connectionString = 'mongodb://localhost:27017/product_service';

const connectionString = process.env.MONGODB_URI;


const connectDB = async () => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;