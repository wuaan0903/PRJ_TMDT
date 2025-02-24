import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true } // Đường dẫn ảnh
}, { timestamps: true });

export default mongoose.model('Banner', bannerSchema);
