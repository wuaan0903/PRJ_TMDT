import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  comment: { type: String, required: true },
  rate: { type: Number, required: true, min: 1, max: 5 }, // Thêm trường rate
  image_review: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', ReviewSchema);
export default Review;
