import express from "express";
const router = express.Router();
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getCategoryByCollectionId
} from '../controllers/categoriesController.mjs';


router.post('/', createCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.get('/collection/:collection_id', getCategoryByCollectionId);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;