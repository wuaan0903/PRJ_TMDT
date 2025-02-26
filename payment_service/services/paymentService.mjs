import Order from '../models/Order.js';
import ProductOrder from '../models/ProductOrder.js';
import axios from 'axios';
import crypto from 'crypto';
import qs from 'qs';
import moment from 'moment-timezone';
import CryptoJS from 'crypto-js'; // npm install crypto-js
import { v1 as uuidv1 } from 'uuid'; // npm install uuid

export const createOrder = async (userId, address, phoneNumber, items) => {
  const order = new Order({
    userId,
    address,
    phoneNumber,
    status: 'pending'
  });

  await order.save();

  const productOrders = items.map(item => new ProductOrder({
    orderId: order._id,
    productId: item.productId,
    size: item.size,
    quantity: item.quantity
  }));

  await ProductOrder.insertMany(productOrders);

  //Fetch cart from api
  const cart = await axios.get(`http://localhost:3003/api/cart/user/${userId}`);
  //Delete cart from api
  await axios.delete(`http://localhost:3003/api/cart/${cart.data._id}`);

  return order;
};

//Update order satatus
export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  order.status = status;
  await order.save();
  return order;
}

export const processPayment = async (orderId, paymentDetails) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error('Order not found');
  }
  
  // Simulate payment processing
  const paymentResponse = await axios.post('http://payment-service-url/api/payments', paymentDetails);

  if (paymentResponse.data.status === 'success') {
    order.status = 'processing';
    await order.save();
  } else {
    throw new Error('Payment failed');
  }

  return order;
};

export const getOrderById = async (orderId) => {
  const order =  await Order.findById(orderId);
  if(!order){
    return null;
  }
  const items = await ProductOrder.find({orderId: orderId})
  return {...order.toObject(), items};
};


export const getOrdersByUser = async (userId) => {
  return await Order.find({ userId });
};

export const getOrders = async () => {
  return await Order.find();
};

export const getProductsByOrderId = async (orderId) => {
  return await ProductOrder.find({ orderId });
};


function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj){
      if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
      }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export const createVnPayPaymentUrl = async (orderId, clientIp) => {
    
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

      // Get the total amount from the product API.
      const items = await ProductOrder.find({orderId: orderId});
  
      let totalPrice = 0;
      for (const item of items) {
          try{
              const productPriceResponse = await axios.get(`http://localhost:3002/api/products/${item.productId}`);
              const price = productPriceResponse.data.price;
               totalPrice += price * item.quantity;
  
          } catch (error) {
              console.error(`Error fetching price for product ID ${item.productId}:`, error);
              // You might want to handle this error gracefully, 
              // e.g., by logging it, returning a default price, or setting a default message for the user.
              //For now, we are skip this product price
          }
       }
    // const totalPrice = 18060;

  const tmnCode = process.env.VNP_TMN_CODE;
  const secretKey = process.env.VNP_SECRET_KEY;
  const locale = 'vn';
  const currCode = 'VND';
  // const returnUrl = 'http://localhost:8080/api/payment/vnpay_return'; // Define your return url
  const returnUrl = 'http://localhost:3004/api/payments/vnpay/callback'; // Define your return url
  const amount = totalPrice;
  const createDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss');
  const orderInfo = `Thanh toan cho don hang ${orderId.toString()}`;
  const ipAddr = clientIp;
  
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId.toString();
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = "127.0.0.1";
  vnp_Params['vnp_CreateDate'] = createDate;
  // vnp_Params['vnp_ExpireDate'] = moment().add(1, 'days').tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss');
  
  vnp_Params = sortObject(vnp_Params);

  let signData = qs.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); // Changed line here
  vnp_Params['vnp_SecureHash'] = signed;

  const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: false })}`;

  return paymentUrl;
};  

export const createGenericPaymentUrl = async (orderId, clientIp, paymentGatewayConfig) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  // Get the total amount from the product API.
  const items = await ProductOrder.find({orderId: orderId});

  let totalPrice = 0;
  for (const item of items) {
      try{
          const productPriceResponse = await axios.get(`http://localhost:3002/api/products/${item.productId}`);
          const price = productPriceResponse.data.price;
          totalPrice += price * item.quantity;
      } catch (error) {
          console.error(`Error fetching price for product ID ${item.productId}:`, error);
          // You might want to handle this error gracefully, 
          // e.g., by logging it, returning a default price, or setting a default message for the user.
          //For now, we are skip this product price
      }
    }

  const {
    gatewayUrl,
    merchantId,
    secretKey,
    currencyCode,
    returnUrl,
    version,
    command,
    locale,
    orderType
  } = paymentGatewayConfig;
  
  const amount = totalPrice;
  const createDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss');
  const orderInfo = `Payment for order ${orderId.toString()}`;
  
  let params = {};
  params['version'] = version || '1.0'; //Default value
  params['command'] = command || 'pay'; //Default value
  params['merchantId'] = merchantId;
  params['locale'] = locale || 'en'; //Default value
  params['currencyCode'] = currencyCode || 'USD'; //Default value
  params['txnRef'] = orderId.toString();
  params['orderInfo'] = orderInfo;
  params['orderType'] = orderType || 'other'; //Default value
  params['amount'] = amount;
  params['returnUrl'] = returnUrl;
  params['ipAddr'] = clientIp;
  params['createDate'] = createDate;
  
  params = sortObject(params);

  let signData = qs.stringify(params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
  params['secureHash'] = signed;

  const paymentUrl = `${gatewayUrl}?${qs.stringify(params, { encode: false })}`;

  return paymentUrl;
};  

export const createZaloPayPaymentRequest = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
      throw new Error('Order not found');
  }

  // Get the total amount from the product API.
  const items = await ProductOrder.find({orderId: orderId});

    let totalPrice = 0;
    for (const item of items) {
        try{
            const productPriceResponse = await axios.get(`http://localhost:3002/api/products/${item.productId}`);
            const price = productPriceResponse.data.price;
             totalPrice += price * item.quantity;

        } catch (error) {
            console.error(`Error fetching price for product ID ${item.productId}:`, error);
            // You might want to handle this error gracefully, 
            // e.g., by logging it, returning a default price, or setting a default message for the user.
            //For now, we are skip this product price
        }
     }


  const zaloConfig = {
      appid: "554",
      key1: "8NdU5pG5R2spGHGhyO99HN1OhD8IQJBn",
      key2: "uUfsWgfLkRLzq6W2uNXTCxrfxs51auny",
      endpoint: 'https://sandbox.zalopay.com.vn/v001/tpe/createorder'
    };

    const embeddata = {
      merchantinfo: "Thoi Trang Nam",
      redirecturl: "http://localhost:3000/payment/success"
    };
    
    const zaloOrder = {
      appid: zaloConfig.appid,
      apptransid: `${moment().format('YYMMDD')}_${uuidv1()}`, // mã giao dich có định dạng yyMMdd_xxxx
      appuser: order.userId.toString(),
      apptime: Date.now(),
      item: JSON.stringify(items),
      embeddata: JSON.stringify(embeddata),
      amount: totalPrice,
      description: `Thanh toan cho don hang ${orderId.toString()}`,
      bank_code: ""
      
    };

    // appid|apptransid|appuser|amount|apptime|embeddata|item
    const data = zaloConfig.appid + "|" + zaloOrder.apptransid + "|" + zaloOrder.appuser + "|" + zaloOrder.amount + "|" + zaloOrder.apptime + "|" + zaloOrder.embeddata + "|" + zaloOrder.item;
    zaloOrder.mac = CryptoJS.HmacSHA256(data, zaloConfig.key1).toString();
    
    try {
      const response = await axios.post(zaloConfig.endpoint, null, { params: zaloOrder });
      const responseUrl = response.data.orderurl;
      return responseUrl; // Return the ZaloPay response data
    } catch (error) {
      console.error('Error creating ZaloPay payment request:', error);
      throw new Error('Failed to create ZaloPay payment request');
    }
  };

  // Delete order
export const deleteOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  await order.deleteOne({order: orderId});
  return order;
}