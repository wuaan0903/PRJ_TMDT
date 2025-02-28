import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ["percent", "fixed"], required: true },
  value: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

const Voucher = mongoose.model("Voucher", voucherSchema);
export default Voucher;
