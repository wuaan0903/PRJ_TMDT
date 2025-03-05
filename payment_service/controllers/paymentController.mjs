// paymentController.mjs
import { createOrder, processPayment, getOrderById, getOrdersByUser, createVnPayPaymentUrl, getOrders, getProductsByOrderId, updateOrderStatus, createZaloPayPaymentRequest, deleteOrder } from '../services/paymentService.mjs';
import axios from 'axios';


export const placeOrder = async (req, res) => {
    const { userId,name,email, address, phoneNumber, items, paymentMethod, voucherCode } = req.body;
    const { clientIp } = req.params;

    try {
        // 1. Quantity check
        for (const item of items) {
            const { productId, size, quantity } = item;
            const quantityCheckUrl = `http://localhost:3002/api/quantityProduct/${productId}?size=${size}`;
            try {
                const quantityResponse = await axios.get(quantityCheckUrl);
                const availableQuantity = quantityResponse.data.quantity;
                if (availableQuantity < quantity) {
                    return res.status(400).json({ message: `Not enough stock for product ${productId} size ${size}. Available: ${availableQuantity}. Requested: ${quantity}` });
                }
            } catch (error) {
                console.error(`Error fetching quantity for product ID ${productId}:`, error);
                return res.status(500).json({ message: `Error checking stock for product ${productId} size ${size}` });
            }
        }

        // 2. Create order after stock check
        let order;
        if (paymentMethod === 'COD') {
            order = await createOrder(userId,name,email, address, phoneNumber, items, voucherCode, paymentMethod);
        } else if (paymentMethod === 'momo') {
            order = await createOrder(userId, address, phoneNumber, items, voucherCode,paymentMethod);
        } else if (paymentMethod === 'vnpay') {
            order = await createOrder(userId, address, phoneNumber, items, voucherCode,paymentMethod);
        } else if (paymentMethod === 'zalopay') {
            order = await createOrder(userId, address, phoneNumber, items, voucherCode,paymentMethod);
        }

        // 3. Reduce Quantity after order
        for (const item of items) {
            const { productId, size, quantity } = item;
            const quantityEditUrl = `http://localhost:3002/api/quantityProduct/edit/${productId}`;
            try {
                const quantityResponse = await axios.get(`http://localhost:3002/api/quantityProduct/${productId}?size=${size}`);
                const currentQuantity = quantityResponse.data.quantity;
                const newQuantity = currentQuantity - quantity;
                await axios.put(quantityEditUrl, { size: size, quantity: newQuantity });
            } catch (error) {
                console.error(`Error updating quantity for product ID ${productId}:`, error);
                // Consider how to handle a failure at this point.
                return res.status(500).json({ message: `Error updating stock for product ${productId} size ${size}` });
            }
        }


        // 4. Update voucher usage count if voucherCode is applied
        if (voucherCode) {
            const voucherUpdateUrl = `http://localhost:3002/api/vouchers/updateUsage/${voucherCode}`;
            try {
                await axios.put(voucherUpdateUrl);
            } catch (error) {
                console.error(`Error updating voucher usage for voucher code ${voucherCode}:`, error);
                return res.status(500).json({ message: `Error updating voucher usage for voucher code ${voucherCode}` });
            }
        }

        if (paymentMethod === 'COD') {
            return res.json({ ...order, paymentUrl: "http://localhost:3000/payment/success" });
        } else if (paymentMethod === 'momo') {
            return res.json({ orderId: order._id });
        } else if (paymentMethod === 'vnpay') {
            return res.json({ ...order, paymentUrl: (await createVnPayPaymentUrl(order._id, clientIp)).toString() });
        } else if (paymentMethod === 'zalopay') {
            return res.json({ ...order, paymentUrl: (await createZaloPayPaymentRequest(order._id)).toString() });
        }

        res.json(order);
    } catch (err) {
        console.error("Error in placeOrder:", err);
        res.status(500).send('Server error');
    }
};


export const payOrder = async (req, res) => {
  const { orderId, paymentDetails } = req.body;

  try {
    const order = await processPayment(orderId, paymentDetails);
    res.json(order);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

export const getOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await getOrderById(orderId);
    res.json(order);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

export const getUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await getOrdersByUser(userId);
    res.json(orders);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

export const getOrdersCon = async (req, res) => {
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

export const getProductsByOrderIdCon = async (req, res) => {
  const { orderId } = req.params;

  try {
    const products = await getProductsByOrderId(orderId);
    res.json(products);
  } catch (err) {
    res.status(500).send('Server error');
  }
}

export const updateOrderStatusCon = async (req, res) => {
  const { status } = req.body;
  const { orderId } = req.params;

  try {
    const order = await updateOrderStatus(orderId, status);
    res.json(order);
  } catch (err) {
    res.status(500).send('Server error');
  }
}

//VNPAY CALLBACK
export const vnpayCallback = async (req, res) => {
  const vnpayData = req.query;
  const orderId = vnpayData.vnp_TxnRef;
  // Check for vnp_ResponseCode = 00 if not then redirect to error view
  if (vnpayData.vnp_ResponseCode !== '00') {
    // Get order to restore quantity
    const order = await getOrderById(orderId);
     //Restore Quantity
     if (order && order.items) {
          for (const item of order.items) {
              const { productId, size, quantity } = item;
              const quantityEditUrl = `http://localhost:3002/api/quantityProduct/edit/${productId}`;
                try{
                    const quantityResponse = await axios.get(`http://localhost:3002/api/quantityProduct/${productId}?size=${size}`);
                    const currentQuantity = quantityResponse.data.quantity;
                    const newQuantity = currentQuantity + quantity;
                    await axios.put(quantityEditUrl, {size: size, quantity: newQuantity})
      
                } catch (error) {
                    console.error(`Error restoring quantity for product ID ${productId}:`, error);
                    // Consider how to handle a failure at this point.  
                }
            }
        }
    //Delete order
    await deleteOrder(orderId);
    return res.redirect('http://localhost:3000/payment/error');
  } else{
    return res.redirect('http://localhost:3000/payment/success');
  }
};