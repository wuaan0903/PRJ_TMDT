import Review from "../models/Review.js";
import mongoose from 'mongoose';
import axios from 'axios';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const USER_SERVICE_URL = 'http://localhost:3001'; // URL của user_service



// Cấu hình Multer để lưu ảnh vào thư mục "public/uploads/reviews"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/reviews'); // Thư mục lưu ảnh review
    },
    filename: function (req, file, cb) {
        cb(null, `review_${Date.now()}${path.extname(file.originalname)}`); // Định dạng tên file
    }
});

export const upload = multer({ storage });

// Hàm xử lý tải ảnh review
export const createImageReview = async (req, res) => {
    upload.array('images', 5)(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'Multer error: ' + err.message });
        } else if (err) {
            return res.status(500).json({ message: 'Server error: ' + err.message });
        }

        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'No images uploaded' });
            }

            // Lấy danh sách đường dẫn ảnh đã lưu
            const imagePaths = req.files.map(file => `${file.filename}`);

            res.status(201).json({ message: "Ảnh review đã được tải lên!", images: imagePaths });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi upload ảnh review." });
        }
    });
};

// Serve product's thumbnail image
export const serveImage =  (req, res) => {
    const thumbnailPath = path.resolve("public/uploads/reviews/" + req.params.filename);
    res.sendFile(thumbnailPath, (err) => {
        if (err) {
          res.status(404).json({ message: `Image not found + ${err}` });
        }
      });
};

export const createReview = async (req, res) => {
    try {
        const { product_id, user_id, comment, rate, image_review } = req.body;


        const review = await Review.create({
            product_id,
            user_id,
            comment,
            rate,
            image_review
        });

        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};



// Hàm lấy tất cả reviews
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Hàm lấy reviews theo product_id
export const getReviewsByProductId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        const reviews = await Review.find({ product_id: new mongoose.Types.ObjectId(id) });

        

        // Lấy thông tin người dùng từ user_service
        const userIds = reviews.map(review => review.user_id);
        const uniqueUserIds = [...new Set(userIds)]; // Loại bỏ các user_id trùng lặp

        const userResponses = await Promise.all(uniqueUserIds.map(userId => 
            axios.get(`${USER_SERVICE_URL}/api/users/${userId}`)
        ));

        const users = userResponses.reduce((acc, response) => {
            acc[response.data._id] = response.data;
            return acc;
        }, {});

        // Thêm thông tin người dùng vào review
        const reviewsWithUserInfo = reviews.map(review => ({
            ...review.toObject(),
            user: users[review.user_id]
        }));

        res.status(200).json(reviewsWithUserInfo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Hàm cập nhật review theo ID
export const updateReview = async (req, res) => {
    try {
        const { comment, rate } = req.body;

        // Lưu đường dẫn của tất cả các ảnh được tải lên
        const image_review = req.files ? req.files.map(file => `/uploads/reviews/${file.filename}`) : undefined;

        const updateData = { comment, rate };
        if (image_review) updateData.image_review = image_review;

        const review = await Review.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!review) return res.status(404).json({ message: 'Review not found' });

        res.status(200).json(review);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Hàm xóa review theo ID
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};