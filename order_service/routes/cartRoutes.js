import express from 'express';
import { createUserCart, addItemToCart, getUserCart, removeItemFromCart, changeItemQuantityandSize, deleteCartCon} from '../controllers/cartController.mjs';

const router = express.Router();

router.post('/', createUserCart);
router.post('/add', addItemToCart);
router.get('/user/:userId', getUserCart);
router.delete('/:cartId/:itemId', removeItemFromCart);
router.put('/:cartId/:itemId', changeItemQuantityandSize);
router.delete('/:cartId', deleteCartCon);

export default router;