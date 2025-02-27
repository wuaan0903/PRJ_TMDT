const express = require("express");
const router = express.Router();
const axios = require('axios');

const BACKEND_API_URL = 'http://localhost:3002';

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


// Proxy for fetching all products
router.get('/api/products', async (req, res) => {
    try {
        const response = await axios.get(`${BACKEND_API_URL}/api/products`);
        if (response.status === 200) {
            // Filter products with status true
            const activeProducts = response.data.filter(product => product.status === true);
            res.status(200).json(activeProducts);
        } else {
            res.status(response.status).json(response.data);
        }
    } catch (error) {
        console.error(`Error fetching products from ${BACKEND_API_URL}/api/products:`, error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            res.status(500).send('No response from backend');
        } else {
            res.status(500).send("An unexpected error occurred");
        }
    }
});

//Fetch product for admin page
router.get('/api/admin/products', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/products`);
});


// Proxy for fetching single product image
router.get('/api/product/image/:id', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/imageProduct/product/${req.params.id}`);
});

// Proxy for deleting product image
router.delete('/api/product/image/:id', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/imageProduct/${req.params.id}`, 'delete');
});

// Proxy for creating new product
router.post('/api/product', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/products`, 'post');
});

// Proxy for updating product status
router.put('/api/product/:id', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/products/${req.params.id}`, 'put');
});

// Proxy for deleting product
router.delete('/api/product/:id', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/products/${req.params.id}`, 'delete');
});

// Proxy for fetching single product for edit
router.get('/api/product/:id', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/products/${req.params.id}`);
});

//Proxy for fetching categories by collection id
router.get('/api/categories', async (req, res) => {
    try {
        const { collectionId } = req.query;
        const response = await axios.get(`${BACKEND_API_URL}/api/categories/collection/${collectionId}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories', message: error.message });
    }
});

// Proxy for fetching all collections
router.get('/api/collections', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/collection`);
});

// Proxy for deleting a collection
router.delete('/api/collection/:id', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/collection/${req.params.id}`, 'delete');
});

// Proxy for updating a collection
router.put('/api/collection/:id', async (req, res) => {
  await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/collection/${req.params.id}`, 'put');
});

// Proxy for creating a new collection
router.post('/api/collection', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/collection`, 'post');
});




// ****************************************************************************************
//                        QUANTITY MANAGEMENT ROUTES
// ****************************************************************************************

// Proxy for fetching all product quantities
router.get('/api/product-quantities', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/quantityProduct`);
});

// Proxy for fetching a single product quantity
router.get('/api/product-quantity/:productId', async (req, res) => {
    const { productId } = req.params;
    const { size } = req.query;
    let backendUrl = `${BACKEND_API_URL}/api/quantityProduct/${productId}`;
    if (size) {
        backendUrl = `${BACKEND_API_URL}/api/quantityProduct/${productId}?size=${size}`;
    }
    await handleProxyRequest(req, res, backendUrl);
});

// Proxy for updating product quantity
router.put('/api/product-quantity/:productId', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/quantityProduct/edit/${req.params.productId}`, 'put');
});

// Proxy for creating a product quantity entry
router.post('/api/product-quantity/:productId', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/quantityProduct/${req.params.productId}`, 'post');
});

// Proxy for creating a new category
router.post('/api/category', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/categories`, 'post');
});

// Proxy for deleting a category
router.delete('/api/category/:id', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/categories/${req.params.id}`, 'delete');
});

// Proxy for fetching a single category by id
router.get('/api/category/:id', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/categories/${req.params.id}`);
});

// Proxy for fetching a collection by id
router.get('/api/collection/:id', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/collection/${req.params.id}`);
});

// Proxy for fetching all reviews
router.get('/api/reviews', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/reviewProduct`);
});

// Proxy for fetching reviews by product_id
router.get('/api/reviewProduct/:product_id', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/reviewProduct/${req.params.product_id}`);
});

// Proxy for creating a new review
router.post('/api/review', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/reviewProduct`, 'post');
});

// Proxy for updating a review by id
router.put('/api/review/:id', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/reviewProduct/${req.params.id}`, 'put');
});

// Proxy for deleting a review by id
router.delete('/api/review/:id', async (req, res) => {
    await handleProxyRequest(req, res, `${BACKEND_API_URL}/api/reviewProduct/${req.params.id}`, 'delete');
});

module.exports = router;