import { handleErrors } from "../helpers/handleErrors.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import Blog from "../models/Blog.model.js";
import Comment from "../models/Comment.model.js";
import Like from "../models/Like.model.js";


export const getUser = async (req, res, next) => {
  try {
    const { userid } = req.params;
    const user = await User.findOne({ _id: userid }).lean().exec();
    if (!user) {
      return next(handleErrors(404, "User not found"));
    }
    res.status(200).json({
      success: true,
      userData: user,
    });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);
    const { userid } = req.params;
    const user = await User.findById(userid);
    user.name = data.name;
    user.email = data.email;
    user.bio = data.bio;
    if (data.password && data.password.length >= 8) {
      const hashedPassword = bcrypt.hashSync(data.password, 10);
      user.password = hashedPassword;
    }

    if (req.file) {
      const uploadResult = await cloudinary.uploader
        .upload(req.file.path, {
          folder: "blog-website",
          resource_type: "auto",
        })
        .catch((error) => {
          next(handleErrors(500, error.message));
        });

      user.avatar=uploadResult.secure_url;
    }
    await user.save();
    const newUser = user.toObject({ getters: true });
    newUser.password = undefined;
    res.status(200).json({
      success: true,
      message: "Data updated successfully",
      user: newUser,
    });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const getAllUsers = async (req, res, next) => {
  try{
    const users = await User.find().sort({createdAt:-1}).lean().exec();
    res.status(200).json({
      success: true,
      users,
    });
  }catch(error){
    next(handleErrors(500, error.message));
  }
}

export const deleteUser = async (req, res, next) => {
  try{
    const user = await User.findByIdAndDelete(req.params.userid);
    if(!user){
      return next(handleErrors(404, "User not found"));
    }
    await Comment.deleteMany({author:req.params.userid});
    await Blog.deleteMany({author: req.params.userid});
    await Like.deleteMany({author:req.params.userid})

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  }catch(error){
    next(handleErrors(500, error.message));
  }
}