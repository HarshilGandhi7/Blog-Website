import { handleErrors } from "../helpers/handleErrors.js";
import Blog from "../models/Blog.model.js";
import cloudinary from "../config/cloudinary.js";
import { encode } from "entities";
import Comment from "../models/Comment.model.js";
import Category from "../models/category.model.js";

export const addBlog = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);
    let featuredImage = "";
    if (req.file) {
      const uploadResult = await cloudinary.uploader
        .upload(req.file.path, {
          folder: "blog-website",
          resource_type: "auto",
        })
        .catch((error) => {
          next(handleErrors(500, error.message));
        });
      featuredImage = uploadResult.secure_url;
    }

    const blog = new Blog({
      author: data.author,
      category: data.category,
      title: data.title,
      slug: data.slug,
      featuredImage: featuredImage,
      blogContent: encode(data.blogContent),
    });

    await blog.save();
    return res.status(201).json({
      success: true,
      message: "Blog added successfully",
      blog: blog,
    });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const editBlog = async (req, res, next) => {
  try {
    const blogId = req.params.blogid;
    const data = await Blog.findById(blogId)
      .populate("category", "name")
      .lean()
      .exec();
    if (!data) {
      next(handleErrors(404, "Blog not found"));
    }
    res.status(200).json({
      success: true,
      message: "Blog found",
      blog: data,
    });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const blogId = req.params.blogid;
    const blog = await Blog.findById(blogId);
    const data = JSON.parse(req.body.data);
    blog.title = data.title;
    blog.slug = data.slug;
    blog.category = data.category;
    blog.blogContent = encode(data.blogContent);
    let featuredImage = blog.featuredImage;

    if (req.file) {
      const uploadResult = await cloudinary.uploader
        .upload(req.file.path, {
          folder: "blog-website",
          resource_type: "auto",
        })
        .catch((error) => {
          next(handleErrors(500, error.message));
        });
      featuredImage = uploadResult.secure_url;
    }

    blog.featuredImage = featuredImage;

    await blog.save();

    return res.status(201).json({
      success: true,
      message: "Blog Updated successfully",
      blog: blog,
    });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const blogId = req.params.blogid;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    const deleteBlog = await Blog.findByIdAndDelete(blogId);
    const deleteComment=await Comment.deleteMany({blogid:blogId});
    return res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const showAllBlog = async (req, res, next) => {
  try {
    const blog = await Blog.find()
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    res.status(200).json({
      success: true,
      blog: blog,
    });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const getBlogByUserId = async (req, res, next) => {
  try {
    const {userId}=req.params; 
    const blog = await Blog.find({author:userId})
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    res.status(200).json({
      success: true,
      blog: blog,
    });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const getBlog = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug: slug })
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .lean()
      .exec();
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const getRelatedBlogs = async (req, res, next) => {
  try {
    const { category, currentBlog } = req.params;
    const categoryData = await Category.findOne({ name: category });
    if (!categoryData) {
      return next(handleErrors(404, "Category not found"));
    }
    const blog = await Blog.find({
      category: categoryData._id.toString(),
      slug: { $ne: currentBlog },
    })
      .lean()
      .exec();
    res.status(200).json({ success: true, blog });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const getBlogByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const categoryData = await Category.findOne({ slug: category });
    if (!categoryData) {
      return next(handleErrors(404, "Category not found"));
    }
    const categoryid = categoryData._id;
    const blog = await Blog.find({ category: categoryid })
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    res.status(200).json({ success: true, blog });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const search = async (req, res, next) => {
  try {
    const { q } = req.query;
    const blog = await Blog.find({ title: { $regex: q, $options: "i" } })
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    res.status(200).json({ success: true, blog });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};
