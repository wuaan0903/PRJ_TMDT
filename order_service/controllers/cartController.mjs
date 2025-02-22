import { createCart, addToCart, getCartByUser, removeFromCart, changeQuantityandSize, deleteCart } from '../services/CartService.mjs';

export const createUserCart = async (req, res) => {
    const { userId } = req.body;

    try {
      const cart = await createCart(userId);
      res.json(cart);
    } catch (err) {
      res.status(500).send('Server error');
    }
};

export const addItemToCart = async (req, res) => {
    const { cartId, productId, quantity, size } = req.body;

    try {
      const cart = await addToCart(cartId, productId, quantity, size);
      res.json(cart);
    } catch (err) {
      res.status(500).send('Server error');
    }
};

export const getUserCart = async (req, res) => {
    const { userId } = req.params;

    try {
      const cart = await getCartByUser(userId);
      res.json(cart);
    } catch (err) {
      res.status(500).send('Server error');
    }
};

export const removeItemFromCart = async (req, res) => {

};

export const changeItemQuantityandSize = async (req, res) => {

}

export const deleteCartCon = async (req, res) => {

}
