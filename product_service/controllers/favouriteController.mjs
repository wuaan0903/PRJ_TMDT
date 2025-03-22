import Favourite from '../models/Favourite.js';

// Thêm sản phẩm vào danh sách yêu thích
export const addFavourite = async (req, res) => {
    const { user_id, product_id } = req.body;

    try {
        let favourite = await Favourite.findOne({ user_id });

        if (!favourite) {
            favourite = new Favourite({ user_id, products: [] });
        }

        // Kiểm tra nếu sản phẩm đã tồn tại trong danh sách yêu thích
        const isProductExists = favourite.products.some(
            (item) => item.product_id.toString() === product_id
        );

        if (!isProductExists) {
            favourite.products.push({ product_id });
        }

        await favourite.save();
        res.status(200).json(favourite);
    } catch (error) {
        res.status(500).json({ message: 'Error adding product to favourites', error });
    }
};

// Xóa sản phẩm khỏi danh sách yêu thích
export const removeFavourite = async (req, res) => {
    const { user_id, product_id } = req.body;

    try {
        const favourite = await Favourite.findOne({ user_id });

        if (!favourite) {
            return res.status(404).json({ message: 'Favourite list not found' });
        }

        favourite.products = favourite.products.filter(
            (item) => item.product_id.toString() !== product_id
        );

        await favourite.save();
        res.status(200).json(favourite);
    } catch (error) {
        res.status(500).json({ message: 'Error removing product from favourites', error });
    }
};

// Lấy danh sách sản phẩm yêu thích
export const getFavourites = async (req, res) => {
    const { user_id } = req.params;

    try {
        const favourite = await Favourite.findOne({ user_id }).populate('products.product_id');

        if (!favourite) {
            return res.status(404).json({ message: 'Favourite list not found' });
        }

        res.status(200).json(favourite);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching favourites', error });
    }
};