import express from "express";
import {
  addBlog,
  deleteBlog,
  editBlog,
  getBlog,
  getBlogByCategory,
  getBlogByUserId,
  getRelatedBlogs,
  search,
  showAllBlog,
  updateBlog,
} from "../controllers/Blog.controller.js";
import upload from "../config/multer.js";
import { authenticate } from "../middlewares/authenticate.js";

const BlogRoute = express.Router();

BlogRoute.post("/add", authenticate, upload.single("file"), addBlog);
BlogRoute.get("/edit/:blogid", authenticate ,editBlog);
BlogRoute.put("/update/:blogid", authenticate ,upload.single("file"), updateBlog);
BlogRoute.delete("/delete/:blogid",authenticate, deleteBlog);


BlogRoute.get("/all-blog", showAllBlog);
BlogRoute.get("/get-usersBlog/:userId", authenticate, getBlogByUserId);
BlogRoute.get("/get-blog/:slug", getBlog);
BlogRoute.get("/relatedBlog/:category/:currentBlog", getRelatedBlogs);
BlogRoute.get("/get-blog-by-category/:category", getBlogByCategory);
BlogRoute.get("/search", search);

export default BlogRoute;
