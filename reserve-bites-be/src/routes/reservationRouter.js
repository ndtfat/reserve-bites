import express from 'express';
import verifyOwner from '../middlewares/verifyOwner.js';
import userController from '../controllers/user.controller.js';
import verifyAccessToken from '../middlewares/verifyAccessToken.js';
import restaurantController from '../controllers/restaurant.controller.js';

const router = express.Router();

router.get('/:id', verifyAccessToken, restaurantController.getReservation);
router.put('/:id', verifyAccessToken, userController.updateReservation);
router.put(
  '/:id/response',
  verifyAccessToken,
  verifyOwner,
  restaurantController.responseReservation,
);

export default router;
