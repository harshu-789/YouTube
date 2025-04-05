import jwt from "jsonwebtoken"
import {User} from "../models/user.models.js"
import bcrypt from "bcryptjs"

const generateAccessToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        if(!user){
            return res.status(400).json({message: "User Not Found"})
        }
        const accessToken = user.generateAccessToken()
        user.accessToken = accessToken()
        await user.save({validateBeforeSave: false})
        return{accessToken}
    } catch (error) {
        next(error)
    }
}

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
      const user = await user.create({
        username : username.toLowerCase(),
        email,
        password: hashedPassword
      })
      const createdUser = await user.findById(user._id).select("-password")
      if(!createdUser){
        return res.status(400).json({message: "User Not Found"})
      }
      const { accessToken } = await generateAccessToken(createdUser._id);

      return res.status(201).json({
        message: "User registered successfully",
        user: createdUser,
        token: accessToken,
      });
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
        const { accessToken } = await generateAccessToken(user._id);

        const safeUser = await User.findById(User._id).select("-password");
    
        return res.status(200).json({
          message: "Login successful",
          user: safeUser,
          token: accessToken,
        });
    } catch (error) {
        next(error)
    }
}

// logout User

const logoutUser = async(req,res,next)=>{
    try {
        const userId = req.user?.userId
        const user = await User.findById(userId)
        if(user){
            user.accessToken = null
            await user.save({validateBeforeSave: false})
        }
        return res.status(200).json({message:"Logged Out Successfully"})
    } catch (error) {
        console.error("Logout Error", error)
        next(error)
    }
}


// Get User profile

const getUserProfile = async(req,res,next)=>{
    try {
        const userId = req.user?.userId;
        if(!User){
            return res.status(404).json({message:"User not found, Please login and try again!"})
        }
        return res.status(200).json({message:"User Retrived Successfully"})
    } catch (error) {
        next(error)
    }
}

// Updating Account Details

const updateUserAccount = async(req,res,next)=>{
    try {
        const userId = req.user?.userId;
        if(!User){
            return res.status(404).json({message:"User not Found, Please try again"})
        }
        const {firstName,lastName} =req.body
        if(!firstName || !lastName){
            return res.status(401).json({message: "All fields are required."})
        }
       if(firstName){
        User.firstName = firstName
       }
       if(lastName){
        User.lastName = lastName
       }
     const updatedUser =   await User.save()
     if(!updatedUser){
        return res.status(500).json({message:"Something Went Wrong"})
     }
     updatedUser.password = hashedPassword
     return res.status(200).json({message:"User Account Updated Successfully"})
    } catch (error) {
        next(error)
    }
}







export {registerUser,loginUser,logoutUser,getUserProfile,updateUserAccount}