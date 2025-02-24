import mongoose from 'mongoose';
import Quantity_Product from "../models/Quantity_Product.js";

const productQuantitySchema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true,
    collection: 'product_quantity'
});

// Tạo compound index để đảm bảo không có sự trùng lặp size cho cùng một sản phẩm
productQuantitySchema.index({ product_id: 1, size: 1 }, { unique: true });

const ProductQuantity = mongoose.model('ProductQuantity', productQuantitySchema);

export const createQuantityProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        req.body.product_id = productId
        const quantityProduct = await Quantity_Product.create(req.body);
        res.status(201).json(quantityProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getQuantityByProductId = async (req, res) => {
};

export const deleteQuantityProduct = async (req, res) => {
    try {
        const quantity = await Quantity_Product.findByIdAndDelete(req.params.id);
        if (!quantity) return res.status(404).json({ message: 'Quantity not found' });
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
export const editQuantityByProductId = async (req, res) => {
    const { productId } = req.params;
    const { size, quantity } = req.body;

    if (!size) {
      return res.status(400).json({ message: 'Size and quantity are required' });
    }

  try {
    const existingQuantity = await Quantity_Product.findOne({
        product_id: productId,
        size: size,
      });

    if(existingQuantity) {
      //Update quantity
        existingQuantity.quantity = quantity;
       const updatedQuantity = await existingQuantity.save();
        res.status(200).json(updatedQuantity);
    }else {
        const newQuantity = new Quantity_Product({
        product_id: productId,
        size: size,
        quantity: quantity,
      });
     const savedQuantity = await newQuantity.save();
      res.status(201).json(savedQuantity);
    }
    
  } catch (error) {
    console.error("Error updating/creating quantity:", error);
    res.status(500).json({ message: 'Failed to update product quantity.', error: error.message });
  }
};

export const getQuantityByProductIdAndSize = async (req, res) => {
    try {
        const { productId } = req.params;
        const { size } = req.query;
        
        let quantity
        if(size){
            quantity = await Quantity_Product.findOne({ product_id: productId, size: size });
        } else{
             quantity = await Quantity_Product.find({ product_id: productId });
        }

        if (!quantity) {
            return res.status(404).json({ message: 'Quantity not found for this product and size' });
        }

        res.status(200).json(quantity);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const addNewSize = async (req, res) => {
    try {
        const { productId } = req.params;
        const { size, quantity } = req.body;

        // Validate đầu vào
        if (!size || quantity === undefined) {
            return res.status(400).json({
                status: 'error',
                message: 'Size và số lượng là bắt buộc!'
            });
        }

        // Kiểm tra size đã tồn tại chưa
        const existingSize = await Quantity_Product.findOne({
            product_id: productId,
            size: size
        });

        if (existingSize) {
            return res.status(400).json({
                status: 'error',
                message: 'Size này đã tồn tại cho sản phẩm!'
            });
        }

        // Tạo mới size
        const newQuantity = new Quantity_Product({
            product_id: productId,
            size: size,
            quantity: quantity
        });

        const savedQuantity = await newQuantity.save();

        res.status(201).json({
            status: 'success',
            message: 'Thêm size mới thành công!',
            data: savedQuantity
        });

    } catch (error) {
        console.error('Lỗi khi thêm size mới:', error);
        res.status(500).json({
            status: 'error',
            message: 'Đã xảy ra lỗi khi thêm size mới!',
            error: error.message
        });
    }
};
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('MongoDB Connected:', conn.connection.host);
        
        // Thêm các event listeners
        mongoose.connection.on('error', err => {
            console.error('MongoDB error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;