import express from "express";
import {
  createVoucher,
  getVouchers,
  getVoucherByCode,
  updateVoucher,
  deleteVoucher,
} from "../controllers/voucherController.mjs";

const router = express.Router();

// Tạo mã giảm giá mới
router.post("/", createVoucher);

// Lấy tất cả mã giảm giá
router.get("/", getVouchers);

// Lấy mã giảm giá theo mã code
router.get("/:code", getVoucherByCode);

// Cập nhật mã giảm giá
router.put("/:id", updateVoucher);

// Xóa mã giảm giá
router.delete("/:id", deleteVoucher);

export default router;
