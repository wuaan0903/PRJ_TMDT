import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    categories: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories' },
    description: { type: String },
    price: { type: Number, required: true },
    status: { type: Boolean },
    thumbnail: { type: String , required: false },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;