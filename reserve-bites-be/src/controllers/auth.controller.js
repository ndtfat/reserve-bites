import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../models/User.js';
import Token from '../models/Token.js';
import { sendMail } from '../config/mailer.config.js';

const generateAccessToken = (data) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_KEY, { expiresIn: '1d' });
};
const generateRefreshToken = (data) => {
  return jwt.sign(data, process.env.REFRESH_TOKEN_KEY, { expiresIn: '1d' });
};
const generateResetPasswordToken = (data) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_KEY + data.password, {
    expiresIn: '1h',
  });
};

export default {
  async signUp(req, res) {
    try {
      const { password, ...rest } = req.body;
      const info = {
        ...rest,
        password: await bcrypt.hash(password, 10),
      };

      const newUser = new User(info);
      await newUser.save();
      console.log(
        `${rest.firstName} ${rest.lastName} registered account: ${newUser.id}`,
      );
      return res.status(200).send({ message: 'Sign up success' });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).send({ message: 'Existed email' });
      } else {
        console.log({ message: 'Something wrong with sign up', error });
      }
    }
  },
  async signIn(req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const userAccount = await User.findOne({ email }).select('+password');

      // check user's email and password
      if (!userAccount)
        return res.status(404).send({ message: 'Email is not exist' });
      const isValidPassword = await bcrypt.compare(
        password,
        userAccount.password,
      );

      if (!isValidPassword)
        return res.status(403).send({ message: 'Password is not correct' });

      const accessToken = generateAccessToken({
        id: userAccount.id,
        firstName: userAccount.firstName,
        lastName: userAccount.lastName,
      });
      const refreshToken = generateRefreshToken({
        id: userAccount.id,
        firstName: userAccount.firstName,
        lastName: userAccount.lastName,
      });

      const userToken = await Token.findOne({ uid: userAccount.id });
      if (userToken) {
        userToken.accessToken = accessToken;
        userToken.refreshToken = refreshToken;
        await userToken.save();
      } else {
        const newUserToken = new Token({
          uid: userAccount.id,
          accessToken,
          refreshToken,
        });
        await newUserToken.save();
      }

      console.log(userAccount.id + ' signed in');
      return res.status(200).send({
        expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Something wrong with sign in', error });
    }
  },
  async signOut(req, res) {
    try {
      const user = req.user;
      await Token.deleteOne({ uid: user.id });

      console.log(user.id + ' signed out');
      return res.status(200).send({ message: 'Sign out success' });
    } catch (error) {
      res.status(500).send({ message: 'Something wrong with sign out', error });
    }
  },
  async refreshToken(req, res) {
    try {
      const token = req.body.refreshToken;
      if (!token)
        return res
          .status(403)
          .send({ message: 'Not found refresh-token in request body' });
      const userToken = await Token.findOne({ refreshToken: token });
      if (!userToken)
        return res.status(404).send({ message: 'Account signed out' });

      const verifyToken = await jwt.verify(
        token,
        process.env.REFRESH_TOKEN_KEY,
      );
      const { iat, exp, ...userData } = verifyToken;
      const newAccessToken = generateAccessToken(userData);

      userToken.accessToken = newAccessToken;
      await userToken.save();

      return res.status(400).send({
        expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        accessToken: newAccessToken,
      });
    } catch (error) {
      res
        .status(500)
        .send({ message: 'Something wrong with refresh token', error });
    }
  },
  async sendResetPasswordToken(req, res) {
    try {
      const email = req.body.email;

      if (!email) {
        return res.status(403).send({ message: 'No email in request' });
      }

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(404).send({ message: 'Email is not exist' });
      }

      const resetPasswordToken = generateResetPasswordToken(user.toObject());
      await Token.findOneAndUpdate({ uid: user.id }, { resetPasswordToken });

      await sendMail({
        to: 'ndtpptdn798789@gmail.com',
        subject: 'RESET PASSWORD [Book a Bite]',
        html: `
        <br>Hi <b>${user.firstName + ' ' + user.lastName}</b></br>,

        <br>There was a request to change your password!</br>
        <br/>
        <br>If you did not make this request then please ignore this email.</br>

        <br>
          Otherwise, please click this link to change your password: 
          ${process.env.CLIENT_URL}/auth/reset-password?id=${
          user.id
        }&token=${resetPasswordToken}
        </br>
        <br/>
        <br><b>DO NOT RESPONSE TO THIS EMAIL</b></br>
      `,
      });
      res.status(200).send({ message: 'Reset code is sent' });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: 'Something worong with send reset-password token' });
    }
  },
  async resetPassword(req, res) {
    const { token, uid } = req.params;
    const { password } = req.body;

    console.log({ token, password, uid });

    const user = await User.findById(uid).select('+password');
    if (!user) {
      return res
        .status(403)
        .send({ message: 'Can not find account have your email' });
    }

    const secret = process.env.ACCESS_TOKEN_KEY + user.toObject().password;
    try {
      await jwt.verify(token, secret);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }

    const hashedPw = await bcrypt.hash(password, 10);
    user.password = hashedPw;
    await user.save();
    return res.status(200).send({ message: 'Reset password successfully ' });
  },
};
