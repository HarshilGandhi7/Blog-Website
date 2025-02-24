import mongoose from "mongoose";

const Schema = mongoose.Schema;

const LikeSchema = new Schema(
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
    }
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.model("Like", LikeSchema, "Likes");

export default Like;
