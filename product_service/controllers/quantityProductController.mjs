import Quantity_Product from "../models/Quantity_Product.js";

export const createQuantityProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        req.body.product_id = productId
        const quantityProduct = await Quantity_Product.create(req.body);
        res.status(201).json(quantityProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getQuantityByProductId = async (req, res) => {
    try {
        const quantities = await Quantity_Product.find({ product_id: req.params.productId });
        res.status(200).json(quantities);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteQuantityProduct = async (req, res) => {
    try {
        const quantity = await Quantity_Product.findByIdAndDelete(req.params.id);
        if (!quantity) return res.status(404).json({ message: 'Quantity not found' });
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
export const editQuantityByProductId = async (req, res) => {
    const { productId } = req.params;
    const { size, quantity } = req.body;

    if (!size) {
      return res.status(400).json({ message: 'Size and quantity are required' });
    }

  try {
    const existingQuantity = await Quantity_Product.findOne({
        product_id: productId,
        size: size,
      });

    if(existingQuantity) {
      //Update quantity
        existingQuantity.quantity = quantity;
       const updatedQuantity = await existingQuantity.save();
        res.status(200).json(updatedQuantity);
    }else {
        const newQuantity = new Quantity_Product({
        product_id: productId,
        size: size,
        quantity: quantity,
      });
     const savedQuantity = await newQuantity.save();
      res.status(201).json(savedQuantity);
    }
    
  } catch (error) {
    console.error("Error updating/creating quantity:", error);
    res.status(500).json({ message: 'Failed to update product quantity.', error: error.message });
  }
};

export const getQuantityByProductIdAndSize = async (req, res) => {
    try {
        const { productId } = req.params;
        const { size } = req.query;
        
        let quantity
        if(size){
            quantity = await Quantity_Product.findOne({ product_id: productId, size: size });
        } else{
             quantity = await Quantity_Product.find({ product_id: productId });
        }

        if (!quantity) {
            return res.status(404).json({ message: 'Quantity not found for this product and size' });
        }

        res.status(200).json(quantity);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
