import Banner from '../models/Banner.js';

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
        const imageUrl = req.file ? `public/uploads/banner/${req.file.filename}` : null; // Lưu đường dẫn ảnh

        const newBanner = new Banner({ title, imageUrl});
        await newBanner.save();
        res.status(201).json(newBanner);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
