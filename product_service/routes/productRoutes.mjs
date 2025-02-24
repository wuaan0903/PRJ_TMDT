import express from 'express';
import { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct,
    serveThumbnail,
    getProductsByCategory,
    serveBanner
} from '../controllers/productController.mjs';

const router = express.Router();

router.post('/',  createProduct);
router.get('/',  getAllProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id',  getProductById);
router.put('/:id',  updateProduct);
router.delete('/:id',  deleteProduct);
router.get('/thumbnail/:filename', serveThumbnail);
router.get('/banner/:filename', serveBanner);

router.get('/api/products', getAllProducts);

    

export default router;