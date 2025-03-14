import express from 'express';
import { placeOrder, payOrder, getOrder, getUserOrders, getOrdersCon, getProductsByOrderIdCon, updateOrderStatusCon, vnpayCallback, updateOrderRating } from '../controllers/paymentController.mjs';

const router = express.Router();

router.post('/', placeOrder);
router.post('/pay', payOrder);
router.get('/:orderId', getOrder);
router.get('/user/:userId', getUserOrders);
router.get('/', getOrdersCon);
router.get('/productOrders/:orderId', getProductsByOrderIdCon);
router.put('/:orderId', updateOrderStatusCon);
router.put('/rating/:orderId', updateOrderRating); // Thêm route mới để cập nhật order.rating

//VNPAY CALLBACK
router.get('/vnpay/callback', vnpayCallback);

export default router;