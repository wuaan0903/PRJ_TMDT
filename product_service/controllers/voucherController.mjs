import Voucher from '../models/Voucher.js';

// Hàm tạo voucher
export const createVoucher = async (req, res) => {
    try {
        const voucher = new Voucher(req.body);
        await voucher.save();
        res.status(201).json(voucher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Hàm lấy tất cả vouchers
export const getAllVouchers = async (req, res) => {
    try {
        const vouchers = await Voucher.find();
        res.status(200).json(vouchers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Hàm lấy voucher theo ID
export const getVoucherById = async (req, res) => {
    try {
        const voucher = await Voucher.findById(req.params.id);
        if (!voucher) return res.status(404).json({ message: 'Voucher not found' });
        res.status(200).json(voucher);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Hàm cập nhật voucher theo ID
export const updateVoucher = async (req, res) => {
    try {
        const voucher = await Voucher.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!voucher) return res.status(404).json({ message: 'Voucher not found' });
        res.status(200).json(voucher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Hàm xóa voucher theo ID
export const deleteVoucher = async (req, res) => {
    try {
        const voucher = await Voucher.findByIdAndDelete(req.params.id);
        if (!voucher) return res.status(404).json({ message: 'Voucher not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Hàm check voucher theo code
export const checkVoucher = async (req, res) => {
    const { code } = req.params;

    try {
        const voucher = await Voucher.findOne({ code });

        if (!voucher) {
            return res.status(404).json({ message: 'Mã giảm giá không tồn tại.' });
        }

        // Kiểm tra nếu voucher đã hết hạn
        const currentDate = new Date();
        if (new Date(voucher.expirationDate) < currentDate) {
            return res.status(400).json({ message: 'Mã giảm giá đã hết hạn.' });
        }

        // Kiểm tra nếu voucher không hoạt động
        if (!voucher.isActive) {
            return res.status(400).json({ message: 'Mã giảm giá không hoạt động.' });
        }

        res.json(voucher);
    } catch (error) {
        console.error('Lỗi khi kiểm tra mã giảm giá:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi kiểm tra mã giảm giá.' });
    }
};

export const updaeStage = async (req, res) => {

    const { code } = req.params;

    try {
        const voucher = await Voucher.findOne({ code });
        if (!voucher) {
            return res.status(404).json({ message: 'Voucher not found' });
        }

        voucher.usedCount += 1;
        await voucher.save();

        res.json(voucher);
    } catch (error) {
        console.error('Error updating voucher usage:', error);
        res.status(500).json({ message: 'Server error' });
    }
};