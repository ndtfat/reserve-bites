import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(403).send({ message: 'Please login' });
    }

    const accessToken = authorization.split(' ')[1];
    if (!accessToken) {
      return res
        .status(400)
        .send({ message: 'No access token in request header' });
    }

    const verifyToken = await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_KEY,
    );
    const user = await User.findById(verifyToken.id);
    req.user = user;
    next();
  } catch (error) {
    // console.log({ message: 'Something wrong with verify accessToken', error });
    return res.status(401).json({ message: 'Token expired. Please login' });
  }
};
