import express from "express"
const router = express.Router();
import {
    createImageProduct,
    getImagesByProductId,
    deleteImageProduct,
    serveImage

} from '../controllers/imageProductController.mjs';

router.post('/', createImageProduct);
router.get('/product/:productId', getImagesByProductId);
router.delete('/:id', deleteImageProduct);
router.get('/serve/:filename', serveImage);

export default router;