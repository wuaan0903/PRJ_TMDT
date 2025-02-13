import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './db/mongoose.js';
import cartRoutes from './routes/cartRoutes.js'


const app = express();
const PORT = process.env.PORT || 3003;

app.use(bodyParser.json());
app.use('/api/cart', cartRoutes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
