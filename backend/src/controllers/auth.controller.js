import jwt from "jsonwebtoken"
import {User} from "../models/user.models.js"
import bcrypt from "bcryptjs"

// Registering User

const registerUser = async(req,res,next)=>{
 try {
       const {username,email,password} = req.body
       if(!username || !email || !password){
           return res.status(400).json({message : "All fields are required"})
       }
       const userExist = await User.findOne({$or:[{email},{password}]})
       if(userExist){
           return res.status(400).json({message:"User already Exist"})
       }
       const hashedPassword = await bcrypt.hash(password,10)
       const newUser = new User({username,email,password})
       await newUser.save()
       const token = jwt.sign({userId: newUser.User_id},process.env.JWT_SECRET,{expiresIn:"24h"})
       return res.status(201).json({message: "User registered successfully", token})
 } catch (error) {
    console.error("Error during Registration",error)
    next(error)
 }
}

// Login User

const loginUser = async(req,res,next)=>{
    try {
        const {email,password}= req.body
        if(!email || !password){
          return res.status(401).json({message: "Please enter your Login Details"})  
        }
        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(404).json({message: "User not Found"})
        }
        if(!password || !existingUser.password){
            return res.status(400).json({message : "Password or hash is missing"})
        }
        const isValidPassword = await bcrypt.compare(password,existingUser.password)
        if(!isValidPassword){
            return res.status(400).json({message:"Invalid Password"})
        }
        // Generating JWT Token
        const token = jwt.sign({userId: existingUser._id},process.env.JWT_SECRET,{expiresIn: "24h"})
        return res.status(200).json({message: "Login Successful",token})
    } catch (error) {
        next(error)
    }
}


export {registerUser,loginUser}