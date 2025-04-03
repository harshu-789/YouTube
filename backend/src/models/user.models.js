import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        unique: true,
        type: String,
        required: true,
        trim: true
    },
    email: {
        unique: true,
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: '',
    },
}, { timestamps: true });

// Hashing password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Comparing Password
userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
};

// Exporting User model
export const User = mongoose.model("User", userSchema);
