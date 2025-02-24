import express from 'express';
import { deleteUser, getAllUsers, getUser, updateUser } from '../controllers/User.controller.js';
import upload from '../config/multer.js';
import { authenticate } from '../middlewares/authenticate.js';

const UserRoute = express.Router();
UserRoute.use(authenticate);
UserRoute.get('/get-user/:userid', getUser);
UserRoute.put('/update-user/:userid',upload.single('file'), updateUser);
UserRoute.get('/get-all-users', getAllUsers);
UserRoute.delete('/delete-user/:userid', deleteUser);

export default UserRoute;