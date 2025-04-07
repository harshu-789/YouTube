import { Comment } from "../models/comment.models.js";
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import mongoose from "mongoose"

// Creating comment
const createComment = async(req,res,next)=>{
    try {
        const user = req.user?.user.Id
        if(!user){
            return res.status(401).json({message:"User does not exist please login and try again!"})
        }
        const {VideoId} = req.params
        if(!VideoId){
            return res.status(400).json({message:"Please provide a VideoID"})
        }
        const video = await video.findById(VideoId)
        if(!video){
            return res.status(404).json({message:"Video does not exist!"})
        }
        const {content} = req.body
        if(!content){
            return res.status(400).json({message:"Please provide a content!"})
        }
        const comment = await comment.create({
            video: video._id,
            user: user._id,
            content,
        })
        if(!comment){
            return res.status(400).json({message:"Comment not created!"})
        }
        video.comments.push(comment._id);
        await video.save();
        res.status(201).json({message:"Comment created successfully!"})
    } catch (error) {
        next(error)
    }
}

// Updating Comment

const updatingComment = async(req,res,next)=>{
    try {
        const user = req.user?.userId
        if(!user){
            return res.status(401).json({message:"User does not exist please login and try again"})
        }
        const {commentId} = req.params
        if(!commentId){
            return res.status(400).json({message:"Please provide a commentId!"})
        }
        const {content} = req.body
        if(!content || content.trim()=== ""){
            return res.status(400).json({message:"Please provide a content!"})
        }
        const comment = await comment.findById(commentId)
        if(!comment){
            return res.status(404).json({message:"Comment does not exist!"})
        }
        if(String(comment.user)!==String(user._id)){
            return res.status(403).json({message:"You are not authorized to update this comment!"})
        }
        const updatedComment = await comment.findByIdAndUpdate(commentId,
            {content},{new: true})
            if(!updatedComment){
                return res.status(400).json({message:"Comment not updated!"})
            }
            res.status(200).json({message:"Comment updated successfully!"})
    } catch (error) {
        next(error)
    }
}

// Deleting Comment

const deleteComment = async(req,res,next)=>{
    try {
        const user = req.user?.userId
        if(!user){
            return res.status(401).json({message:"User does not exist please login and try again"})
        }
        const {commentId} = req.params
        if(!commentId){
            return res.status(400).json({message:"Please provide a commentId!"})
        }
        const comment = await comment.findById(commentId)
        if(!comment){
            return res.status(404).json({message:"Comment does not exist!"})
        }
        if(String(comment.user.toString())!==String(user._id)){
            return res.status(403).json({message:"You are not authorized to delete this comment!"})
        }
        const deletedComment = await comment.findByIdAndDelete(commentId)
        if(!deletedComment){
            return res.status(400).json({message:"Comment not deleted!"})
        }
        res.status(200).json({message:"Comment deleted successfully!"})
    } catch (error) {
        next(error)
    }
}












export{createComment,updatingComment,deleteComment}