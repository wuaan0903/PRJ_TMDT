import express from 'express';
import bodyParser from 'body-parser';
import productRoutes from './routes/productRoutes.mjs';
import connectDB from './db/mongoose.js';
import categoriesRoutes from './routes/categoriesRoutes.mjs';
import collectionRoutes from './routes/collectionRoutes.mjs';
import imageProductRoutes from './routes/imageProductRoutes.mjs';
import quantityProductRoutes from './routes/quantityProductRoutes.mjs';
import reviewRoutes from './routes/reviewRoutes.mjs';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware

app.use(bodyParser.json());
app.use(cors());
// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/collection', collectionRoutes);
app.use('/api/imageProduct', imageProductRoutes);
app.use('/api/quantityProduct', quantityProductRoutes);
app.use('/api/reviewProduct', reviewRoutes);

// MongoDB Connection
connectDB();

app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});