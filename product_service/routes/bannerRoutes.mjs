import express from 'express';
import multer from 'multer';
import { createBanner, getBanners, getBannerById, updateBanner, deleteBanner } from '../controllers/bannerController.mjs';

const router = express.Router();

// Cấu hình multer để lưu ảnh vào thư mục "uploads"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/banner/'); // Lưu ảnh vào thư mục "uploads"
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// API Routes
router.get('/', getBanners);
router.get('/:id', getBannerById);
router.post('/', upload.single('image'), createBanner);  // Upload ảnh
router.put('/:id', upload.single('image'), updateBanner);
router.delete('/:id', deleteBanner);

export default router;
