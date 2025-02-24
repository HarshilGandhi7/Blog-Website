import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
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
});

const Category = mongoose.model('Category', categorySchema, 'categories');

export default Category;