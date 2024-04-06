import express from 'express';
import paginator from '../middlewares/paginator.js';
import userControler from '../controllers/user.controller.js';
import verifyAccessToken from '../middlewares/verifyAccessToken.js';

const router = express.Router();

router.get('/chat-box', verifyAccessToken, userControler.getChatBoxes);
router.get('/reservations', verifyAccessToken, paginator, userControler.getUserReservations);
router.get('/notifications', verifyAccessToken, paginator, userControler.getNotifications);
router.get('/:id', verifyAccessToken, userControler.getUser);

router.post('/reservation', verifyAccessToken, userControler.postReservation);
router.post('/chat-box', verifyAccessToken, userControler.postChatBox);
router.post('/review', verifyAccessToken, userControler.postReview);

router.put('/read-message', verifyAccessToken, userControler.putReadedMessageStatus);
router.put('/edit', verifyAccessToken, userControler.putChangeInfo);
router.put('/change-password', verifyAccessToken, userControler.putChangePassword);
router.put('/review/:id', verifyAccessToken, userControler.updateReview);
router.put(
  '/notifications/mark-as-readed',
  verifyAccessToken,
  userControler.putNotificationsStatus,
);

router.delete('/review/:id', verifyAccessToken, userControler.deleteReview);
router.delete('/notifications', verifyAccessToken, userControler.deleteNotifications);

export default router;
