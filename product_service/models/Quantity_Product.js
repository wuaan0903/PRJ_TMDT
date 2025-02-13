import mongoose from "mongoose";

const quantityProductSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true }
}, { timestamps: true });

const Quantity_Product = mongoose.model('Quantity_Product', quantityProductSchema);
export default Quantity_Product;