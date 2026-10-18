import express from 'express';
import { createCategory, getCategories } from '../controllers/category.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, authorize('admin'), createCategory);
router.get('/', getCategories);
export default router;