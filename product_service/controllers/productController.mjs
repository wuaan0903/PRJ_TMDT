import Product from "../models/Product.js";
import Image_Product from "../models/Image_Product.js";
import Quantity_Product from "../models/Quantity_Product.js";
import Categories from "../models/Categories.js";
import Collection from "../models/Collection.js";
import multer from "multer";
import path from 'path';
import slugify from 'slugify';
import fs from "fs/promises";

// Setup Multer for image uploading
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/product');
    },
    filename: function (req, file, cb) {
        cb(null, `img_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Create Product
export const createProduct = async (req, res) => {

};


// Get All Products
export const getAllProducts = async (req, res) => {

};

// Get Product by ID
export const getProductById = async (req, res) => {

};

// Get Product by category
export const getProductByCategory = async (req, res) => {

}

// Update Product
export const updateProduct = async (req, res) => {

};

// Delete Product
export const deleteProduct = async (req, res) => {

};

// Serve product's thumbnail image
export const serveThumbnail =  (req, res) => {

};