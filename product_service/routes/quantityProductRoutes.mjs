import express from "express";
const router = express.Router();
import {
    createQuantityProduct,
    getQuantityByProductId,
    deleteQuantityProduct,
    editQuantityByProductId,
    getQuantityByProductIdAndSize
} from '../controllers/quantityProductController.mjs';


router.post('/:productId', createQuantityProduct);
// router.get('/product/:productId', getQuantityByProductId);
router.put('/edit/:productId', editQuantityByProductId);
router.get('/:productId', getQuantityByProductIdAndSize);
router.delete('/:id', deleteQuantityProduct);


export default router;