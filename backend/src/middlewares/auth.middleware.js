import jwt from "jsonwebtoken"
import { User } from '../models/user.models.js';

const authMiddleware = async(req,res,next)=>{
    try {
        const token = req.header.authorization?.split(' ')[1]
        if(!token){
            return res.status(401).json({message: "Unauthorized: No token is Provided"})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(401).json({message: "User Not Found"})
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({message:"Invalid Token"})
    }
}
export {authMiddleware}