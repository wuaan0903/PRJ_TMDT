import mongoose from 'mongoose';

const FavouriteSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Tham chiếu đến bảng User
    },
    products: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product', // Tham chiếu đến bảng Product
            },
            addedAt: {
                type: Date,
                default: Date.now, // Thời gian thêm sản phẩm vào danh sách yêu thích
            },
        },
    ],
}, { timestamps: true }); // Tự động thêm createdAt và updatedAt

export default mongoose.model('Favourite', FavouriteSchema);