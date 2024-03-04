import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendMail = async (maiInfo) => {
  try {
    const info = await transporter.sendMail({
      from: '"Book a Bite" <bookabite@fakeemail.com>', // sender address
      ...maiInfo,
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.log(error);
  }
};
