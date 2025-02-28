import Voucher from "../models/Voucher.js";

// Tạo mã giảm giá mới
export const createVoucher = async (req, res) => {
  try {
    const newVoucher = new Voucher(req.body);
    await newVoucher.save();
    res.status(201).json(newVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả mã giảm giá
export const getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy mã giảm giá theo mã code
export const getVoucherByCode = async (req, res) => {
  try {
    const voucher = await Voucher.findOne({ code: req.params.code });
    if (!voucher) return res.status(404).json({ message: "Mã giảm giá không tồn tại" });
    res.json(voucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật mã giảm giá
export const updateVoucher = async (req, res) => {
  try {
    const updatedVoucher = await Voucher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVoucher) return res.status(404).json({ message: "Mã giảm giá không tồn tại" });
    res.json(updatedVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa mã giảm giá
export const deleteVoucher = async (req, res) => {
  try {
    const deletedVoucher = await Voucher.findByIdAndDelete(req.params.id);
    if (!deletedVoucher) return res.status(404).json({ message: "Mã giảm giá không tồn tại" });
    res.json({ message: "Đã xóa mã giảm giá" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
