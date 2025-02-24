import express from "express";
import { addComment, commentCount, deleteComment, getAllComments, getComments } from "../controllers/Comment.controller.js";
import { authenticate } from "../middlewares/authenticate.js";


const CommentRoute = express.Router();

CommentRoute.post("/add-comment",authenticate, addComment);
CommentRoute.get("/get-comments/:id", getComments);
CommentRoute.get("/comment-count/:blogid", commentCount);
CommentRoute.get("/get-all-comments",authenticate, getAllComments);
CommentRoute.delete("/delete/:commentid",authenticate, deleteComment);


export default CommentRoute;
