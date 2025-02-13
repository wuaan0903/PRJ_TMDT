import express from "express";
const router = express.Router();
import {
    createCollection,
    getAllCollections,
    getCollectionById,
    updateCollection,
    deleteCollection
} from '../controllers/collectionController.mjs';

router.post('/', createCollection);
router.get('/', getAllCollections);
router.get('/:id', getCollectionById);
router.put('/:id', updateCollection);
router.delete('/:id', deleteCollection);

export default router;