import mongoose from 'mongoose';

const ProductOrderSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  productId: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

const ProductOrder = mongoose.model('ProductOrder', ProductOrderSchema);

export default ProductOrder;