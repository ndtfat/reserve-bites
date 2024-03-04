import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { initializeApp } from 'firebase/app';

import './utils/cron.js';
import routes from './routes.js';
import firebaseConfig from './config/firebase.config.js';
import { connectDb } from './config/mongo.config.js';

const app = express();
dotenv.config();

initializeApp(firebaseConfig);
connectDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

app.listen(3000, () => console.log('Listen on port 3000'));
