import express from 'express';
import verifyOwner from '../middlewares/verifyOwner.js';
import verifyAccessToken from '../middlewares/verifyAccessToken.js';
import restaurantController from '../controllers/restaurant.controller.js';

const router = express.Router();

router.get('/:id', verifyAccessToken, restaurantController.getReservation);
router.put('/:id/', verifyAccessToken, restaurantController.updateReservation);

export default router;
