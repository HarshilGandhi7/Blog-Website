import { handleErrors } from "../helpers/handleErrors.js";
import Like from "../models/Like.model.js";

export const addLike = async (req, res, next) => {
  try {
    const { userid, blogid } = req.body;
    let like;
    like = await Like.findOne({ author: userid, blogid });
    if (like) {
      await Like.findByIdAndDelete(like._id);
    } else {
      const newLike = new Like({
        author: userid,
        blogid,
      });
      like = await newLike.save();
    }
    const totalLikes = await Like.countDocuments({ blogid });
    res.status(200).json({
      success: true,
      totalLikes,
    });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const getLikeCount = async (req, res, next) => {
  try {
    const { blogid , userid } = req.params;
    const totalLikes = await Like.countDocuments({ blogid });
    let userLike=false;
    if(userid){
      userLike = await Like.findOne({ author: userid, blogid });
      if(userLike>0){
        userLike=true;
      }
    }

    res.status(200).json({
      success: true,
      totalLikes,
      userLike
    });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};
