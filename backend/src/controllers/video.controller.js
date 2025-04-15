import mongoose from "mongoose"
import {Channel} from "../models/channel.models.js"
import {Video} from "../models/video.models.js"
import { uploadThumbnailOnCloud, uploadVideoOnCloud } from "../config/cloud.config.js"


// Publishing a new Video

const publishVideo = async(req,res,next)=>{
    try {
       const user = req.user?._id 
       if(!user){
        return res.status(401).json({message:"Unauthorized"})
       }
       const {channelId}  = req.params
       if(!channelId){
        return res.status(400).json({message:"Channel ID is required"})
       }
       const channel = await Channel.findById(channelId)
       if(!channel){
        return res.status(404).json({message:"Channel not found"})
       }
       if(user.toString()!==channel.owner.toString()){
        return res.status(403).json({message:"You are not the owner of this channel"})
       }
       const {title,description,category} = req.body
       if(!title || !description || !category){
        return res.status(400).json({message:"Title, description and category are required"})
       }
       const getVideoFile = req.files?.Video?.[0]


       if(!getVideoFile){


        return res.status(400).json({message:"Video file is required"})
       }
       const getThumbnailFile = req.files?.thumbnail?.[0]
       if(!getThumbnailFile){
        return res.status(400).json({message:"Thumbnail file is required"})
       }
       const videoResult = await uploadVideoOnCloud(getVideoFile.path)
       const thumbnailResult = await uploadThumbnailOnCloud(getThumbnailFile.path)
       if (!videoResult?.secure_url || !thumbnailResult?.secure_url) {
        return res.status(500).json({ message: "Failed to upload media to cloud" });
    }
    
       const video = new Video({
        publishedBy: channel._id,
        category,
        url: videoResult.secure_url, // Store video URL
        thumbnailUrl: thumbnailResult.secure_url, // Store thumbnail URL
        description,
        title,
       })
       if(!video){
        return res.status(500).json({message:"Failed to create video"})
       }
       const savedVideo = await video.save()
       if(!savedVideo){
        return res.status(500).json({message:"Failed to save video"})
       }
       res.status(201).json({message:"Video published successfully",video:savedVideo})
    } catch (error) {
        next(error)
    }
}

// Get a video by its Id

const getVideoById = async(req,res,next)=>{
    try {
        const {videoId} = req.params
        if(!videoId){
            return res.status(400).json({message:"Video id is required"})
        }
        const video = await Video.aggregate([
            {
                $match: {_id: new mongoose.Types.ObjectId(videoId)}
            },
            {
                $lookup:{
                    from : "Channels",
                    localField : "publishedBy",
                    foreignField : "_id",
                    as : "Channel"

                },
            },
            {
                $lookup:{
                    from : "Comments",
                    localField : "comments",
                    foreignField : "_id",
                    as : "Comments"
                },
            },
            {
                $unwind :{
                    path : "$comments",
                    preserveNullAndEmptyArrays : true,
                },
            },
            {
                $lookup : {
                    from : "Users",
                    localField : "comments.userId",
                    foreignField : "_id",
                    as : "comments.user"
                },
            },
            {
                $group: {
                    _id: "$_id",
                    videoUrl:{$first:"$videoUrl"},
                    title: { $first: "$title" },
                    description: { $first: "$description" },
                    Channel: { $first: "$Channel" },
                    comments: { $push: "$comments" },
                },
            },
        ])

        if(!video || video.length === 0){
            return res.status(400).json({message: "Video does not Exist"})
        }
        const videoDocu = await video.findById(videoId)
        if(!videoDocu){
            return res.status(400).json({message: "Video does not Exist"})
        }
        videoDocu.views += 1
        await videoDocu.save()

        return res.status(200).json(new ApiResponse(200, video, "Video retrieved successfully"));
    } catch (error) {
        next (error)
    }
}

// Fetching all Videos with Filers

const fetchAllVideos = async(req,res,next)=>{
    try {
        const {category ,title, sortBy} = req.query
        const filter = category && category !== "All" ? {category} : {}
        if(title){
            filter.title = { $regex: title, $options: 'i' }
        }
        const sort = sortBy ? {[sortBy]:1} : {createdAt : -1}
        const videos = await Video.find(filter).select("-url")
        .populate("publishedBy").sort(sort)
        if(videos.length === 0){
            return res.status(400).json({message: "No Videos found"})
        }
        return res.status(200).json(new ApiResponse(200, videos, "Videos retrieved successfully"));
    } catch (error) {
        next(error)
    }
}

// Delete a video by its ID

const deleteVideo = async(req,res,next)=>{
    try {
        const user = req.user?.userId
        const {videoId} = req.params
        if(!user || !videoId){
            return res.status(400).json({message: "Invalid Request"})
        }
        const video = await Video.findById(videoId)
        if(!video){
            return res.status(400).json({message: "Video does not Exist"})
        }
        if(video.publishedBy.toString() !== user.channel.toString()){
            return res.status(400).json({message: "You are not authorized to delete this video"})
        }
        await Channel.findByIdAndUpdate(
            video.publishedBy,
            { $pull: { videos: videoId } },
            { new: true }
          );
          const deleteVideo = await Video.findByIdAndDelete(videoId)
          if (!deleteVideo) {
            return res.status(500).json(new ApiError(500, "Error while deleting the video."));
          }
          return res.status(200).json(new ApiResponse(200, deleteVideo, "Video deleted successfully"))

    } catch (error) {
        next(error)
    }
}

// Updating Video Details

const updateVideo = async (req, res, next) => {
    try {
        const user = req.user?.userId
        const videoId = req.params
        if(!user || !videoId){
            return res.status(400).json({message: "Invalid Request"})
        }
        const {title,description,category} = req.body
        if(!title && !description && !category){
            return res.status(400).json({message: "Please provide at least one field to update"})
        }
        const video = await video.findById(videoId)
        if(!video){
            return res.status(400).json({message: "Video does not Exist"})
        }
        const objectToUpdate = {}
        if(title){
          objectToUpdate.title=title
        }
        if(description){
          objectToUpdate.description=description
        }
        if(category){
          objectToUpdate.category=category
        }
        if(video.publishedBy.toString()!== user.channel.toString()){
            return res.status(400).json({message: "You are not authorized to update this video"})
        }
        const updatedVideo = await Video.findByIdAndUpdate(videoId,objectToUpdate,{new:true})
        if(!updatedVideo){
            return res.status(500).json({message: "Error while updating the video."})
        }
        return res.status(200).json({message: "Video updated successfully",updatedVideo})
    } catch (error) {
        next(error)
    }
}

// Like video

const likeVideo = async(req,res,next)=>{
try {
    const user = req.user?.userId
    const {videoId} = req.params
    if(!user || !videoId){
        return res.status(400).json({message: "Invalid Request"})
    }
    const video = await video.findById(videoId)
    if(!video){
        return res.status(400).json({message: "Video does not Exist"})
    }
    if(video.likedBy.includes(user._id)){
        return res.status(400).json({message: "You have already liked this video"})
    }
    video.likedBy.push(user._id)
    video.likes +=1
    await video.save()
    return res.status(200).json(new ApiResponse(200, { likes: video.likes }, "Video liked successfully"));
} catch (error) {
    next(error)
}
}


// unlilke Video

const unlikeVideo = async (req, res, next) => {
    try {
      const user = req.user?.userId;
      const { videoId } = req.params;
  
      if (!user || !videoId) {
        return res.status(400).json({ message: "Invalid Request" });
      }
  
      const video = await Video.findById(videoId);
      if (!video) {
        return res.status(400).json({ message: "Video does not exist" });
      }
  
      if (!video.likedBy.includes(user)) {
        return res.status(400).json({ message: "You have not liked this video" });
      }
  
      video.likedBy = video.likedBy.filter(userId => userId.toString() !== user.toString());
      video.likes -= 1;
      await video.save();
  
      return res.status(200).json({ message: "Video unliked successfully", likes: video.likes });
    } catch (error) {
      next(error);
    }
  };
  
//   check user that liked video

const hasLikedVideo = async(req,res,next)=>{
    try {
        const user = req.user?.userId
        const {videoId} = req.params
        if(!user || !videoId){
            return res.status(400).json({message: "Invalid Request"})
        }
        const video = await video.findById(videoId)
        if(!video){
            return res.status(400).json({message: "Video does not exist"})
        }
        const hasLiked = video.likedBy.includes(user._id)
        return res.status(200).json({hasLiked},hasLiked?"User has liked the video" : "User has not liked video")
    } catch (error) {
        next(error)
    }
}






export {publishVideo,getVideoById,fetchAllVideos,deleteVideo,updateVideo,likeVideo,unlikeVideo,hasLikedVideo}