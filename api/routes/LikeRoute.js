import express from 'express';
import { addLike, getLikeCount } from '../controllers/Like.controller.js';
import { authenticate } from '../middlewares/authenticate.js';

const LikeRoute = express.Router();

LikeRoute.post('/add-like/:blogid',authenticate, addLike);
LikeRoute.get('/get-like/:blogid/:userid?', getLikeCount);

export default LikeRoute;