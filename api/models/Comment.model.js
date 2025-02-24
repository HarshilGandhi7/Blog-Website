import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    blogid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Blog",
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", CommentSchema, "Comments");

export default Comment;
