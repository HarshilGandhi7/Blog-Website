import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', UserSchema, 'users');

export default User;