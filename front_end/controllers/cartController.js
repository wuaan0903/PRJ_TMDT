const axios = require('axios');

//Render cart page
const renderCartPage = async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await axios.get('http://localhost:3003/api/cart/user/' + userId.toString());
    if (response.status !== 200) {
      return res.status(response.status).send('Failed to fetch cart');
    }
    const cart = response.data;
    res.render('cart', { cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).send('Failed to fetch cart');
  }
};

module.exports = {
    renderCartPage,
    };