import User from '../models/User.js'; 
import bcrypt from "bcryptjs";
import { handleErrors } from '../helpers/handleErrors.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


export const Register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      next(handleErrors(400, "User already exists"));
    } else {
      const encpassword = await bcrypt.hash(password,10);
      const newUser = new User({
        name,
        email,
        password: encpassword,
      });
      await newUser.save();
      res.status(200).json({
        success: true,
        message: "User created successfully",
      });
    }
  } catch (err) {
    next(handleErrors(500, err.message));
  }
};

export const Login = async (req, res, next) => {
  dotenv.config();
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      next(handleErrors(404, "Invalid Login Credentials"));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      next(handleErrors(400, "Invalid login Credentials"));
    }
    const userRole = user.role || "user"; 
    const token = jwt.sign({
      _id:user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: userRole,
    }, process.env.JWT_SECRET, {expiresIn: '7d'});

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
      path:'/'
    });
    const newUser=user.toObject({getters:true});
    newUser.password=undefined;
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: newUser,
    });
    } catch (err) {
      next(handleErrors(500, err.message));
    }
};

export const GoogleLogin = async (req, res, next) => {
  try {
    const {name, email, avatar} = req.body;

    let user;
    user=await User.findOne({email});
    if(!user){
      //create a new user
      const password=Math.random().toString(36).slice(-12);
      const hashPassword=await bcrypt.hash(password,10);
      const newUser = new User({
        name,
        email,
        password: hashPassword,
        avatar,
      })
      await newUser.save();
      user=newUser;
    }
    const userRole = user.role || "user"; 
    const token = jwt.sign({
      _id:user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: userRole,
    }, process.env.JWT_SECRET, {expiresIn: '7d'});

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
      path:'/'
    });

    const newUser=user.toObject({getters:true});
    delete newUser.password;
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: newUser,
    });

  } catch (err) {
    next(handleErrors(500, err.message));
  }
};

export const Logout = async (req, res, next) => {
  try {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
      });
      res.status(200).json({
        success: true,
        message: "User logged out successfully",
        });
  }catch(error){
    next(handleErrors(500, error.message));
  }
}