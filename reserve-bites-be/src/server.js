import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { initializeApp } from 'firebase/app';

import './utils/cron.js';
import routes from './routes/index.js';
import firebaseConfig from './config/firebase.config.js';
import soketController from './controllers/socketIO.controller.js';
import { connectDb } from './config/mongoose.config.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

dotenv.config();

initializeApp(firebaseConfig);
connectDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);
io.on('connection', (socket) => {
  soketController(io, socket);
});

server.listen(3000, () => console.log('Listen on port 3000'));
