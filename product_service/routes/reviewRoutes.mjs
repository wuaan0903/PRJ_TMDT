import express from 'express';
import { 

    createReview,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview
} from '../controllers/reviewController.mjs';

const router = express.Router();

router.post('/',  createReview);
router.get('/',  getAllReviews);
router.get('/:id',  getReviewById);
router.put('/:id',  updateReview);
router.delete('/:id',  deleteReview);


export default router;