const axios = require('axios');

const renderHomePage = async (req, res) => {
    try {
        // Fetch products
        const productResponse = await axios.get('http://localhost:3000/api/products');
        if (productResponse.status !== 200) {
            return res.status(productResponse.status).send('Failed to fetch products');
        }
        const products = productResponse.data;
        const totalProducts = products.length;

        // Fetch all orders
        const orderResponse = await axios.get('http://localhost:3000/api/orders');
        if (orderResponse.status !== 200) {
            return res.status(orderResponse.status).send('Failed to fetch orders');
        }
        let allOrders = orderResponse.data;

        // Filter orders for the current day
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        let orders = allOrders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= today && orderDate < tomorrow;
        });


         // Fetch user info for each order and add username
        orders = await Promise.all(orders.map(async order => {
            try {
                const userResponse = await axios.get(`http://localhost:3000/api/users/${order.userId}`);
                 if (userResponse.status !== 200) {
                    console.error("Failed to fetch user for order: ", order._id);
                     return {
                        ...order,
                        date: new Date(order.date).toLocaleString(),
                        username: 'Unknown User' //fallback
                     };
                }
                const user = userResponse.data;
                return {
                    ...order,
                    date: new Date(order.date).toLocaleString(),
                    username: user.username //add username
                };
            } catch(error) {
                console.error("Error fetching user data for order:", order._id, error);
                return {
                     ...order,
                        date: new Date(order.date).toLocaleString(),
                        username: 'Unknown User' //fallback
                 };
            }
        }));


        const totalOrders = orders.length;


        // Fetch collections
        const collectionResponse = await axios.get('http://localhost:3000/api/collections');
        if (collectionResponse.status !== 200) {
            return res.status(collectionResponse.status).send('Failed to fetch collections');
        }
        const collections = collectionResponse.data;

        // Calculate total revenue
        let totalRevenue = 0;
        for (const order of orders) {
            const productOrdersResponse = await axios.get(`http://localhost:3000/api/payments/productOrders/${order._id}`)
            if (productOrdersResponse.status !== 200) {
                console.error("Failed to fetch product orders for order: ", order._id)
                continue;
            }
            const productOrders = productOrdersResponse.data;
            for (const productOrder of productOrders) {
                const product = products.find(product => product._id === productOrder.productId)
                if (product) {
                    totalRevenue += product.price * productOrder.quantity;
                } else {
                    console.error("Product not found for product order: ", productOrder);
                }
            }
        }

        res.render('admin/home', {
            totalProducts,
            totalOrders,
            collections,
            orders,
            totalRevenue,
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Failed to fetch data');
    }
};

module.exports = {
    renderHomePage
};