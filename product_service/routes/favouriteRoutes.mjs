import express from 'express';
import { addFavourite, removeFavourite, getFavourites } from '../controllers/favouriteController.mjs';

const router = express.Router();

// Thêm sản phẩm vào danh sách yêu thích
router.post('/', addFavourite);

// Xóa sản phẩm khỏi danh sách yêu thích
router.delete('/', removeFavourite);

// Lấy danh sách sản phẩm yêu thích của người dùng
router.get('/:user_id', getFavourites);

export default router;