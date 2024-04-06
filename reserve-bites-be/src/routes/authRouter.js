import express from 'express';
import authController from '../controllers/auth.controller.js';
import verifyAccessToken from '../middlewares/verifyAccessToken.js';

const router = express.Router();

router.post('/refresh-token', authController.refreshToken);
router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);
router.post('/sign-out', verifyAccessToken, authController.signOut);
router.post('/send-reset-password-mail', authController.sendResetPasswordToken);
router.post('/reset-password/:uid/:token', authController.resetPassword);

export default router;
