import Banner from '../models/Banner.js';
import path from 'path';
import fs from "fs/promises";

// Lấy tất cả banner
export const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find();
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy banner theo ID
export const getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ message: "Banner not found" });
        res.json(banner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo banner mới
export const createBanner = async (req, res) => {
    try {
        const { title } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "Vui lòng tải lên hình ảnh banner" });
        }

        const imageUrls = `${req.file.filename}`;
        const newBanner = new Banner({ title, imageUrls });

        await newBanner.save();
        res.status(201).json(newBanner);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi tạo banner" });
    }
};

// Cập nhật banner
export const updateBanner = async (req, res) => {
    try {
        const { title} = req.body;
        const imageUrl = req.file ? `public/uploads/banner/${req.file.filename}` : req.body.imageUrl;

        const updatedBanner = await Banner.findByIdAndUpdate(
            req.params.id,
            { title, imageUrl},
            { new: true }
        );
        if (!updatedBanner) return res.status(404).json({ message: "Banner not found" });
        res.json(updatedBanner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa banner
export const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) return res.status(404).json({ message: "Banner not found" });
        res.json({ message: "Banner deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 //hiển thị ảnh thumbnail

export const servebanner =  (req, res) => {
    const bannerPath = path.resolve("public/uploads/banner/" + req.params.filename);
    res.sendFile(bannerPath, (err) => {
        if (err) {
          res.status(404).json({ message: `Thumbnail not found + ${err}` });
        }
      });
};

