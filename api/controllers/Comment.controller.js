import { handleErrors } from "../helpers/handleErrors.js";
import Comment from "../models/Comment.model.js";

export const addComment = async (req, res, next) => {
  try {
    const { author, blogid, comment } = req.body;
    const newComment = new Comment({
      author,
      blogid,
      comment,
    });
    await newComment.save();
    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const getComments = async (req, res, next) => {
  try {
    const id = req.params.id;
    const comments = await Comment.find({ blogid: id })
      .sort({ createdAt: -1 })
      .populate("author", "name avatar")
      .lean()
      .exec();
    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const commentCount = async (req, res, next) => {
  try {
    const blogid = req.params.blogid;
    const commentCount = await Comment.countDocuments({ blogid });
    res.status(200).json({
      success: true,
      commentCount,
    });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find()
      .populate("blogid", "title")
      .populate("author", "name")
      .sort({ createdAt: -1 }) // Sorts by `createdAt` field in descending order
      .lean()
      .exec();
    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const deleteComment = async (req, res, next) => {
    try{
        const {commentid} = req.params;
        await Comment.findByIdAndDelete(commentid);
        res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });
    }catch(error){
        next(handleErrors(500, error.message));
    }
};
