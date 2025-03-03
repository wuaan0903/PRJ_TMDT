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
    upload.single('thumbnail')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: 'Multer error: ' + err.message });
        } else if (err) {
           return res.status(500).json({ message: 'Server error: ' + err.message });
        }

        try {
            const { name, description, price, categories } = req.body;

        //     if (!req.file) {
        //       return res.status(400).json({ message: 'No thumbnail file provided' });
        //     }
        //    const thumbnail = `/uploads/product/${req.file.filename}`

           const slug = slugify(name, { lower: true });

            const product = await Product.create({
                name,
                slug,
                description,
                price,
                categories
                // thumbnail,
            });

            res.status(201).json(product);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });
};


// Get All Products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('categories');
        res.status(200).json(products);

        
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get Product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('categories');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get Product by category
export const getProductByCategory = async (req, res) => {
    try {
        const products = await Product.find({ categories: req.params.id }).populate('categories');
        if (!products) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// Update Product
export const updateProduct = async (req, res) => {
    upload.single('thumbnail')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'Multer error: ' + err.message });
          } else if (err) {
             return res.status(500).json({ message: 'Server error: ' + err.message });
          }
        try {
            const { name, description, price, categories } = req.body;
            const status = req.body.status;
            let updateData = {
                name,
                 description,
                price,
                 categories,
                 status
            };


            if (req.file) {
               updateData.thumbnail = `${req.file.filename}`;
            }

            if(name){
              updateData.slug = slugify(name, { lower: true });
            }

            const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: false });
            if (!product) return res.status(404).json({ message: 'Product not found' });
            res.status(200).json(product);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });
};

// Delete Product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }


         // Delete thumbnail image if it exists
         if (product.thumbnail) {
            const thumbnailPath = path.join('public', 'uploads', 'product', product.thumbnail);
             try {
                  await fs.unlink(thumbnailPath);
                  console.log(`Thumbnail file deleted successfully: ${thumbnailPath}`)
              } catch (unlinkError) {
                   console.error(`Error deleting thumbnail file: ${unlinkError.message}`);
              }

        }


        // Delete associated images from Image_Product
        const productImages = await Image_Product.find({ product_id: req.params.id });
         for (const image of productImages) {
            const imagePath = path.join('public', 'uploads', 'product_images', image.image_url);
            try {
                await fs.unlink(imagePath);
                console.log(`Image file deleted successfully: ${imagePath}`)
           } catch (unlinkError) {
                 console.error(`Error deleting image file: ${unlinkError.message}`);
            }
            await Image_Product.findByIdAndDelete(image._id);
        }



        // Delete the product
        await Product.findByIdAndDelete(req.params.id);



        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Serve product's thumbnail image
export const serveThumbnail =  (req, res) => {
    const thumbnailPath = path.resolve("public/uploads/product/" + req.params.filename);
    res.sendFile(thumbnailPath, (err) => {
        if (err) {
          res.status(404).json({ message: `Thumbnail not found + ${err}` });
        }
      });
};


// Hàm loại bỏ dấu tiếng Việt
const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const searchProducts = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ message: "Thiếu từ khóa tìm kiếm" });

        // Chuẩn hóa từ khóa tìm kiếm
        const normalizedQuery = removeDiacritics(query).toLowerCase();

        // Tìm kiếm trực tiếp trong MongoDB thay vì lấy tất cả rồi lọc lại
        const products = await Product.find();

        // Lọc dữ liệu theo tên sản phẩm không dấu
        const filteredProducts = products.filter((product) => {
            const normalizedName = removeDiacritics(product.name).toLowerCase();
            return normalizedName.includes(normalizedQuery);
        });

        res.status(200).json(filteredProducts);
    } catch (err) {
        res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
    }
}

// Serve product's thumbnail image
export const serveBanner =  (req, res) => {
    const thumbnailPath = path.resolve("public/uploads/banner/" + req.params.filename);
    res.sendFile(thumbnailPath, (err) => {
        if (err) {
          res.status(404).json({ message: `Banner not found + ${err}` });
        }
      });
};

// 🛍️ API lấy danh sách sản phẩm theo danh mục
export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category });

        if (!products.length) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};