import express from 'express';
import { 

    createReview,
    getAllReviews,
    updateReview,
    deleteReview,
    getReviewsByProductId,
    upload,
    createImageReview,
    serveImage
} from '../controllers/reviewController.mjs';

const router = express.Router();
// Route tạo review (hỗ trợ upload nhiều ảnh)
router.post('/', upload.array('images', 5), createReview); // Cho phép tải tối đa 5 ảnh

// Route lấy tất cả reviews
router.get('/', getAllReviews);

// Route lấy reviews theo product_id
router.get('/:id', getReviewsByProductId);

// Route cập nhật review (hỗ trợ upload nhiều ảnh)
router.put('/:id', upload.array('images', 5), updateReview);

// Route xóa review
router.delete('/:id', deleteReview);

router.post('/imageReview', createImageReview);
router.get('/imageReview/:filename', serveImage);


export default router;