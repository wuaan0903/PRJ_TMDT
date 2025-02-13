import mongoose from "mongoose";

const imageProductSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    image_url: { type: String, required: true }
}, { timestamps: true });

const Image_Product = mongoose.model('Image_Product', imageProductSchema);
export default Image_Product;