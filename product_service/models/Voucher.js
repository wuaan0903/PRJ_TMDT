import mongoose from 'mongoose';

const VoucherSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // Mã giảm giá
    discount: { type: Number, required: true }, // Giảm giá (% hoặc số tiền)
    type: { type: String, enum: ['percentage', 'fixed'], required: true }, // Loại giảm giá
    expirationDate: { type: Date, required: true }, // Ngày hết hạn
    minOrderValue: { type: Number, default: 0 }, // Giá trị đơn hàng tối thiểu
    maxDiscount: { type: Number, default: null }, // Giảm giá tối đa (cho %)
    usageLimit: { type: Number, default: null }, // Giới hạn số lần sử dụng
    usedCount: { type: Number, default: 0 }, // Số lần đã sử dụng
    isActive: { type: Boolean, default: true } // Trạng thái
}, {
    timestamps: true
});

const Voucher = mongoose.model('Voucher', VoucherSchema);
export default Voucher;
