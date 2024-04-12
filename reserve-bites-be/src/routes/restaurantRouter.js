import express from 'express';
import paginator from '../middlewares/paginator.js';
import verifyOwner from '../middlewares/verifyOwner.js';
import verifyAccessToken from '../middlewares/verifyAccessToken.js';
import restaurantController from '../controllers/restaurant.controller.js';

const router = express.Router();

router.post('/register', restaurantController.postRegister);
router.post('/event', verifyAccessToken, verifyOwner, restaurantController.postRestaurantEvent);

router.get('/locations', restaurantController.getLocations);
router.get('/top-rate', restaurantController.getTopRestaurant);
router.get('/suggest-for-user', verifyAccessToken, restaurantController.getSuggestForUser);
router.get('/local', verifyAccessToken, restaurantController.geLocalRestaurants);
router.get('/search', restaurantController.search);
router.get('/:id/reviews', paginator, restaurantController.getReviews);
router.get(
  '/:id/reservations',
  verifyAccessToken,
  verifyOwner,
  paginator,
  restaurantController.getRestaurantReservations,
);
router.get('/:id', restaurantController.getInfo);

router.put('', verifyAccessToken, verifyOwner, restaurantController.putUpdateRestaurant);

export default router;
