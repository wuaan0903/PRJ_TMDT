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
    upload.array('images')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
             return res.status(400).json({ message: 'Multer error: ' + err.message });
           } else if (err) {
              return res.status(500).json({ message: 'Server error: ' + err.message });
           }
        try {
            const { product_id } = req.body;

            if(!req.files || req.files.length === 0){
                 return res.status(400).json({ message: 'No image file provided' });
            }
            
            const createdImages = [];
            for (const file of req.files) {
               const image_url = `${file.filename}`;
                const imageProduct = await Image_Product.create({
                    product_id,
                    image_url,
               });
               createdImages.push(imageProduct);
            }
           
            res.status(201).json(createdImages);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });
};

// Get All Images for Product
export const getImagesByProductId = async (req, res) => {
    try {
        const images = await Image_Product.find({ product_id: req.params.productId });
        res.status(200).json(images);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete Image_Product
export const deleteImageProduct = async (req, res) => {
    try {
        const image = await Image_Product.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Extract filename from image_url
        const filename = path.basename(image.image_url);
        const imagePath = path.join('public', 'uploads', 'product_images', filename);


        // Delete the image file
        try {
             await fs.unlink(imagePath);
             console.log(`Image file deleted successfully: ${imagePath}`)
        } catch (unlinkError) {
            console.error(`Error deleting image file: ${unlinkError.message}`);
        }
        await Image_Product.findByIdAndDelete(req.params.id);


        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Serve Image
export const serveImage = (req, res) => {
    const { filename } = req.params;
    res.sendFile(path.resolve(`public/uploads/product_images/${filename}`));
};
