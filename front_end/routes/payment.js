const express = require("express");
const router = express.Router();
const axios = require('axios');

const BACKEND_API_URL = 'http://localhost:3004';

// Helper function to handle proxy requests
const handleProxyRequest = async (req, res, backendUrl, method = req.method, data = req.body, headers = {}) => {
    try {
        const response = await axios({
            method: method,
            url: backendUrl,
            headers: {
                'Content-Type': req.headers['content-type'],
                ...headers, // Include additional headers
            },
            data: data,
             params: {
                clientIp: req.ip,
             }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
         console.error(`Error proxying ${method} request to ${backendUrl}:`, error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            res.status(500).send('No response from backend');
        } else {
            res.status(500).send("An unexpected error occurred");
        }
    }
};

// Create user order
router.post('/api/order', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/payments`, 'post');
});

// Get orders
router.get('/api/orders', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/payments`, 'get');
});

// Get order by ID
router.get('/api/orders/:id', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/payments/${req.params.id}`, 'get');
});

// Get order by user ID
router.get('/api/orders/user/:id', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/payments/user/${req.params.id}`, 'get');
});

// Get Product Order by order ID
router.get('/api/payments/productOrders/:orderId', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/payments/productOrders/${req.params.orderId}`, 'get');
});

// Change order status
router.put('/api/orders/:id', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/payments/${req.params.id}`, 'put');
});

router.put('/api/orders/rating/:id', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/payments/rating/${req.params.id}`, 'put');
});


module.exports = router;