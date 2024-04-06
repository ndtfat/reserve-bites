import multer from 'multer';
import authRouter from './authRouter.js';
import userRouter from './userRouter.js';
import imageController from '../controllers/image.controller.js';
import restaurantRouter from './restaurantRouter.js';
import reservationRouter from './reservationRouter.js';

function routes(app) {
  app.post('/upload-image/single', multer().single('file'), imageController.uploadSingleImage);

  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/restaurant', restaurantRouter);
  app.use('/reservation', reservationRouter);
}

export default routes;
