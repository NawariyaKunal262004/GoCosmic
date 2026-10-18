import express from 'express';
import { createProduct } from '../controllers/product.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post(
    '/',
    protect,
    authorize('seller', 'admin'),
    createProduct
);

export default router;