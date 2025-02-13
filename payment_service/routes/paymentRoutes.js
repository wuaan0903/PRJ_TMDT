import express from 'express';
import { placeOrder, payOrder, getOrder, getUserOrders, getOrdersCon, getProductsByOrderIdCon, updateOrderStatusCon, vnpayCallback } from '../controllers/paymentController.mjs';

const router = express.Router();

router.post('/', placeOrder);
router.post('/pay', payOrder);
router.get('/:orderId', getOrder);
router.get('/user/:userId', getUserOrders);
router.get('/', getOrdersCon);
router.get('/productOrders/:orderId', getProductsByOrderIdCon);
router.put('/:orderId', updateOrderStatusCon);

//VNPAY CALLBACK
router.get('/vnpay/callback', vnpayCallback);
export default router;