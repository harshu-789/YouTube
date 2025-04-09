import jwt from "jsonwebtoken"
import {User} from "../models/user.models.js"
import bcrypt from "bcryptjs"
import {errorHandler} from "../middlewares/error.middleware.js"

const generateAccessToken = async(userId)=>{
    
       const accessToken = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
       return accessToken
    
}

// Registering User

const registerUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const userExist = await User.findOne({ $or: [{ email }, { username }] });
      if (userExist) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await User.create({
        username: username.toLowerCase(),
        email,
        profile: "https://default-avatar.com/avatar.png", 
        password: hashedPassword,
      });
  
      if (!newUser) {
        return res.status(400).json({ message: "Something went wrong" });
      }
  
      const createdUser = await User.findById(newUser._id).select("-password");
      if (!createdUser) {
        return res.status(400).json({ message: "User Not Found" });
      }
  
      const  accessToken  = await generateAccessToken(createdUser._id);
  
      return res.status(201).json({
        message: "User registered successfully",
        user: createdUser,
        token: accessToken,
      });
  
    } catch (error) {
      console.error("Error during Registration", error);
      // next(error);
    }
  };
  

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
        const isValidPassword = existingUser.comparePassword(password)
        if(!isValidPassword){
            return res.status(400).json({message:"Invalid Password"})
        }
        // Generating JWT Token
        const  accessToken  = await generateAccessToken(User._id);
           console.log(existingUser,"huhjbb")
        const safeUser = await User.findById(existingUser._id).select("-password");
           console.log(safeUser)
        return res.status(200).json({
          message: "Login successful",
          user: "existingUser",
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

const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      console.log(" [getUserProfile] No userId found in request.",userId);
      return res.status(401).json({ message: "Unauthorized. Please login and try again!" });
    }
    
    console.log(`[getUserProfile] Fetching user with ID: ${userId}`);


    const user = await User.findById(userId).select("-password"); 

    if (!user) {
      console.log("[getUserProfile] User not found in database.");
      return res.status(404).json({ message: "User not found!" });
    }
    console.log("[getUserProfile] User profile retrieved successfully:", user);

    return res.status(200).json({
      message: "User retrieved successfully",
      user,
      
    });
  } catch (error) {
    next(error);
  }
};

// Updating Account Details
const updateUserAccount = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      console.log("[updateUserAccount] No user ID found in request.");
      return res.status(401).json({ message: "Unauthorized. Please login again." });
    }

    const { username } = req.body;

    if (!username) {
      console.log("[updateUserAccount] Missing required fields in request body.");
      return res.status(400).json({ message: "All fields are required." });
    }

    console.log(`[updateUserAccount] Attempting to update user ID: ${userId}`);

    const user = await User.findById(userId);

    if (!user) {
      console.log("[updateUserAccount] User not found in database.");
      return res.status(404).json({ message: "User not found." });
    }

    user.username = username;

    const updatedUser = await user.save();

    console.log("[updateUserAccount] User updated successfully:", updatedUser);

    return res.status(200).json({
      message: "User account updated successfully",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        
      },
    });
  } catch (error) {
    console.error("[updateUserAccount] Error occurred:", error);
    next(error);
  }
};







export {registerUser,loginUser,logoutUser,getUserProfile,updateUserAccount}