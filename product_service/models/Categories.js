import mongoose from 'mongoose';

const categoriesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    collection_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true }
}, { timestamps: true });

const Categories = mongoose.model('Categories', categoriesSchema);
export default Categories;