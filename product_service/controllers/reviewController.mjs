import Review from "../models/Review.js";
import mongoose from 'mongoose';
import axios from 'axios';

const USER_SERVICE_URL = 'http://localhost:3001'; // URL của user_service

// Hàm tạo review
export const createReview = async (req, res) => {
    try {
        const review = await Review.create(req.body);
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
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
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