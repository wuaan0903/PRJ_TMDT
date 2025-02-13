import Image_Product from "../models/Image_Product.js";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

// Setup Multer for image uploading
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/product_images'); // Store images in a separate folder
    },
    filename: function (req, file, cb) {
        cb(null, `img_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Create Image_Product
export const createImageProduct = async (req, res) => {

};

// Get All Images for Product
export const getImagesByProductId = async (req, res) => {

};

// Delete Image_Product
export const deleteImageProduct = async (req, res) => {

};

// Serve Image
export const serveImage = (req, res) => {
    const { filename } = req.params;
    res.sendFile(path.resolve(`public/uploads/product_images/${filename}`));
};
