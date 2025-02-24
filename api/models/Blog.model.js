import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    category: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category',
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    blogContent: {
        type: String,
        required: true,
        trim: true
    },
    featuredImage: {
        type: String,
        required: true,
        trim: true
    },

},{
    timestamps: true
});

const Blog = mongoose.model('Blog', BlogSchema, 'Blogs');

export default Blog;