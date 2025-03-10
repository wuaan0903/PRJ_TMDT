import express from 'express';
import { 

    createReview,
    getAllReviews,
    updateReview,
    deleteReview,
    getReviewsByProductId
} from '../controllers/reviewController.mjs';

const router = express.Router();

router.post('/',  createReview);
router.get('/',  getAllReviews);
router.get('/:id',  getReviewsByProductId);
router.put('/:id',  updateReview);
router.delete('/:id',  deleteReview);


export default router;