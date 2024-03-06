import multer from 'multer';

// middlewares
import paginator from './middlewares/paginator.js';
import verifyOwner from './middlewares/verifyOwner.js';
import verifyAccessToken from './middlewares/verifyAccessToken.js';

// controllers
import userControler from './controllers/user.controller.js';
import authController from './controllers/auth.controller.js';
import imageController from './controllers/image.controller.js';
import restaurantController from './controllers/restaurant.controller.js';

function routes(app) {
  // auth
  app.post('/auth/refresh-token', authController.refreshToken);
  app.post('/auth/sign-up', authController.signUp);
  app.post('/auth/sign-in', authController.signIn);
  app.post('/auth/sign-out', verifyAccessToken, authController.signOut);
  app.post('/auth/send-reset-password-mail', authController.sendResetPasswordToken);
  app.post('/auth/reset-password/:uid/:token', authController.resetPassword);

  // USER --------------------------------------------------------------------------------------------
  app.get('/user/reservations', verifyAccessToken, paginator, userControler.getUserReservations);
  app.get('/user/notifications', verifyAccessToken, paginator, userControler.getNotifications);
  app.get('/user/:id', verifyAccessToken, userControler.getUser);

  app.post('/user/reservation', verifyAccessToken, userControler.postReservation);
  app.post('/user/review', verifyAccessToken, userControler.postReview);

  app.put('/user/edit', verifyAccessToken, userControler.putChangeInfo);
  app.put('/user/change-password', verifyAccessToken, userControler.putChangePassword);
  app.put('/user/review/:id', verifyAccessToken, userControler.updateReview);
  app.put('/user/notifications', verifyAccessToken, userControler.putNotificationStatus);

  app.delete('/user/review/:id', verifyAccessToken, userControler.deleteReview);

  // upload image ------------------------------------------------------------------------------------
  app.post('/upload-image/single', multer().single('file'), imageController.uploadSingleImage);

  // RESTAURANT --------------------------------------------------------------------------------------
  app.post('/restaurant/register', restaurantController.postRegister);

  app.get('/restaurant/locations', restaurantController.getLocations);
  app.get('/restaurant/top-rate', restaurantController.getTopRestaurant);
  app.get(
    '/restaurant/suggest-for-user',
    verifyAccessToken,
    restaurantController.getSuggestForUser,
  );
  app.get('/restaurant/local', verifyAccessToken, restaurantController.geLocalRestaurants);
  app.get('/restaurant/search', restaurantController.search);
  app.get('/restaurant/:id/reviews', paginator, restaurantController.getReviews);
  app.get(
    '/restaurant/:id/reservations',
    verifyAccessToken,
    verifyOwner,
    paginator,
    restaurantController.getRestaurantReservations,
  );
  app.get('/restaurant/:id', restaurantController.getInfo);

  app.put('/restaurant', verifyAccessToken, verifyOwner, restaurantController.putUpdateRestaurant);
}

export default routes;
