import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"


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
    profile: {
        type: String,
        required: true,
    },
    history: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
        }
    ],
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
    },
    subscribed: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Channel",
        }
    ],
    playlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
    }
    
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

// Generating Access Token

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        username : this.username,
        email : this.email
    })
},process.env.ACCESS_TOKEN_SECRET,{
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
}


// Exporting User model
export const User = mongoose.model("User", userSchema);
