const express = require("express");
const router = express.Router();
const axios = require('axios');

const BACKEND_API_URL = 'http://localhost:3003';

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

// Create user cart
router.post('/api/cart', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/cart`, 'post');
});

// Add item to cart
router.post('/api/cart/item', async (req, res) => { 
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/cart/add`, 'post');
});

// Get user cart
router.get('/api/cart/:userId', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/cart/user/${req.params.userId}`);
});

// Update cart item quantity
router.put('/api/cart/:cartId/:id', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/cart/${req.params.cartId}/${req.params.id}`, 'put');
});


// Delete cart item
router.delete('/api/cart/:cartId/:id', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/cart/${req.params.cartId}/${req.params.id}`, 'delete');
});

// Delete cart
router.delete('/api/cart/:cartId', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/cart/${req.params.cartId}`, 'delete');
});



module.exports = router;