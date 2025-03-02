import express from 'express';
import { createVoucher, getAllVouchers, getVoucherById, updateVoucher, deleteVoucher, checkVoucher,updaeStage } from '../controllers/voucherController.mjs';

const router = express.Router();

// Route để tạo voucher
router.post('/', createVoucher);

// Route để lấy tất cả vouchers
router.get('/', getAllVouchers);

// Route để lấy voucher theo ID
router.get('/:id', getVoucherById);

// Route để cập nhật voucher theo ID
router.patch('/:id', updateVoucher);

// Route để xóa voucher theo ID
router.delete('/:id', deleteVoucher);

// Route để check voucher
router.get('/check/:code', checkVoucher);

// Route để check voucher
router.put('/updateUsage/:code', updaeStage);

export default router;