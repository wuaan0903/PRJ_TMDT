import express from 'express';
import { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct,
    serveThumbnail,
    searchProducts,
    serveBanner
} from '../controllers/productController.mjs';

const router = express.Router();

router.post('/',  createProduct);
router.get('/',  getAllProducts);
router.get('/search',  searchProducts);
router.get('/:id',  getProductById);
router.put('/:id',  updateProduct);
router.delete('/:id',  deleteProduct);
router.get('/thumbnail/:filename', serveThumbnail);
router.get('/banner/:filename', serveBanner);

router.get('/api/products', getAllProducts);

    

export default router;