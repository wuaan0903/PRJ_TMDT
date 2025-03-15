import Categories from "../models/Categories.js";

export const createCategory = async (req, res) => {
    try {
        const category = await Categories.create(req.body);
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Categories.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const category = await Categories.findById(req.params.id).populate('collection_id');
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getCategoryByCollectionId = async (req, res) => {
    try {
        const category = await Categories.find({ collection_id: req.params.collection_id });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const updateCategory = async (req, res) => {
    try {
        const category = await Categories.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Categories.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};