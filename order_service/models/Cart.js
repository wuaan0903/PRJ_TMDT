import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  items: [
    {
      productId: {
        type: String,
        required: false
      },
      quantity: {
        type: Number,
        required: false
      },
      size:{
        type: String
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;