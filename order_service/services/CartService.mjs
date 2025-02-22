import Cart from '../models/Cart.js';

export const createCart = async (userId) => {
    const cart = new Cart({
        userId,
        items: []
      });
    
      await cart.save();
      return cart;
};

export const addToCart = async (cartId, productId, quantity, size) => {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      throw new Error('Cart not found');
    }
  
   const existingItemIndex = cart.items.findIndex(item =>
     item.productId.toString() === productId && item.size === size
   );
  
  
   const quantityToAdd = Number(quantity); // convert quantity to number here
  
    if (existingItemIndex !== -1) {
       cart.items[existingItemIndex].quantity += quantityToAdd;
    } else {
       cart.items.push({ productId, quantity : quantityToAdd, size });
    }
  
    await cart.save();
    return cart;
};
export const getCartByUser = async (userId) => {

};

export const removeFromCart = async (cartId, itemId) => {
  
};


export const changeQuantityandSize = async (cartId, itemId, quantity, size) => {
  
};

// delete cart
export const deleteCart = async (cartId) => {
  
};