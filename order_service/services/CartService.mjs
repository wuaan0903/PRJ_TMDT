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
    return await Cart.findOne({ userId }).populate('items');
};

export const removeFromCart = async (cartId, itemId) => {
  const cart = await Cart.findById(cartId);

  if (!cart) {
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(item => item._id.toString() !== itemId);

  await cart.save();
  return cart;
};


export const changeQuantityandSize = async (cartId, itemId, quantity, size) => {
  const cart = await Cart.findById(cartId);

  if (!cart) {
    throw new Error('Cart not found');
  }

  const item = cart.items.find(item => item._id.toString() === itemId);

  if (!item) {
    throw new Error('Item not found');
  }

  if(quantity === 0){
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
  } else if (quantity) {
    item.quantity = quantity;
  }

  if(size){
    item.size = size;
  }


  await cart.save();
  return cart;
};

// delete cart
export const deleteCart = async (cartId) => {
  const cart = await Cart.findById(cartId);

  if (!cart) {
    throw new Error('Cart not found');
  }

  await Cart.deleteOne({_id: cartId});
};