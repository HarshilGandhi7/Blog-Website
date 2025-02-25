import { handleErrors } from "../helpers/handleErrors.js";
import Category from "../models/category.model.js";
import Blog from "../models/Blog.model.js"; 

export const addCategory = async (req, res, next) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return next(handleErrors(400, "Name and Slug are required"));
    }

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return next(handleErrors(400, "Category already exists"));
    }

    const category = new Category({ name, slug });
    await category.save();

    res.status(201).json({
      success: true,
      message: "Category Added Successfully",
      category,
    });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const showCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryid);
    if (!category) {
      return next(handleErrors(404, "Category not found"));
    }
    res.status(200).json({
      success: true,
      category,
    });

  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const {categoryid} = req.params;
    const category = await Category.findByIdAndDelete(categoryid);
    if (!category) {
      return next(handleErrors(404, "Category not found"));
    }
    res.status(200).json({
      success: true,
      message: "Category Deleted Successfully",
    });
    await Blog.deleteMany({ category: categoryid });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category_id = req.params.categoryid;
    const category = await Category.findById(category_id);
    if (!category) {
      return next(handleErrors(404, "Category not found"));
    }
    const { name, slug } = req.body;
    if (!name || !slug) {
      return next(handleErrors(400, "Name and Slug are required"));
    }
    const alreadyCategory = await Category.findOne({ slug });
    if (alreadyCategory && alreadyCategory._id.toString() !== category_id) {
      return next(handleErrors(400, "Category already exists"));
    }
    const newCategory = await Category.findByIdAndUpdate(
      category_id,
      { name, slug },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Category Updated Successfully",
      category: newCategory,
    });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const getAllCategory = async (req, res, next) => {
  try {
    const categoryData = await Category.find();
    res.status(200).json({
      success: true,
      categoryData,
    });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};
