import express from 'express';
import { login, getMe } from '../controllers/auth.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.get(
    '/seller-test',
    protect,
    authorize('seller', 'admin'),
    (req, res) => {
        res.json({
            message: 'You have seller/admin access',
            user: req.user
        });
    }
);
export default router;
