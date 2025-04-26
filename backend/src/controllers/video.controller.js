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
      console.log("channelID",channelId)
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
       console.log(title,description,category)
       if(!title || !description || !category){
        return res.status(400).json({message:"Title, description and category are required"})
       }
       console.log(req.files)
       const getVideoFile = req.files?.video?.[0]
       console.log(getVideoFile,"getVideoFile")



       if(!getVideoFile){
        

        return res.status(400).json({message:"Video file is required"})
       }
       const getThumbnailFile = req.files?.thumbnail?.[0]
       console.log(getThumbnailFile,"getThumbnailFile")
       if(!getThumbnailFile){
        return res.status(400).json({message:"Thumbnail file is required"})
       }
       const videoResult = await uploadVideoOnCloud(getVideoFile.path)
       const thumbnailResult = await uploadThumbnailOnCloud(getThumbnailFile.path)
       if (!videoResult?.secure_url || !thumbnailResult?.secure_url) {
        return res.status(500).json({ message: "Failed to upload media to cloud" });
    }
    
      const videoDoc = new Video({
        channel:      channel._id,                   
        url:          videoResult.secure_url,        
        thumbnailUrl: thumbnailResult.secure_url,
        title,
        description,
        category     
      });
       if(!Video){
        return res.status(500).json({message:"Failed to create video"})
       }
       const savedVideo = await videoDoc.save()
       if(!savedVideo){
        return res.status(500).json({message:"Failed to save video"})
       }
       res.status(201).json({message:"Video published successfully",Video:savedVideo})
    } catch (error) {
        next(error)
    }
}

// Get a video by its Id



const getVideoById = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    console.log("videoId:", videoId);

    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Valid video id is required" });
    }

    const videoData = await Video.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(videoId) },
      },
      {
        $lookup: {
          from: "channels",
          localField: "channel", 
          foreignField: "_id",
          as: "channel",
        },
      },
      {
        $unwind: "$channel",
      },
      {
        $lookup: {
          from: "comments",
          let: { videoId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$video", "$$videoId"] },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $addFields: {
                user: { $arrayElemAt: ["$user", 0] },
              },
            },
          ],
          as: "comments",
        },
      },
    ]);

    if (!videoData || videoData.length === 0) {
      return res.status(404).json({ message: "Video does not exist" });
    }

    await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

    return res.status(200).json({
      statusCode: 200,
      data: videoData[0],
      message: "Video retrieved successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Fetching all Videos with Filers

const fetchAllVideos = async (req, res, next) => {
  try {
    const { category, title, sortBy } = req.query;

    const filter = {};
    if (category && category !== "All") {
      filter.category = category;
    }

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    const sort = sortBy ? { [sortBy]: 1 } : { createdAt: -1 };

    const videos = await Video.find(filter)
      .select("-url") 
      .populate("channel") 
      .sort(sort);

    if (videos.length === 0) {
      return res.status(404).json({ message: "No videos found" });
    }

    return res.status(200).json({
      statusCode: 200,
      data: videos,
      message: "Videos retrieved successfully"
    });
  } catch (error) {
    next(error);
  }
};


// Delete a video by its ID

const deleteVideo = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    console.log(userId)
    const { videoId } = req.params;

    if (!userId || !videoId) {
      return res.status(400).json({ message: "Invalid Request" });
    }

    const video = await Video.findById(videoId);
    console.log(video,"video")
    if (!video) {
      return res.status(404).json({ message: "Video does not exist" });
    }
    console.log("User ID from request:", userId);
    console.log("Video publishedBy ID:", video.channel);

    const channel = await Channel.findById(video.channel);
    console.log(channel,"channel")
    if (!channel) {
      return res.status(404).json({ message: "Channel does not exist" });
    }
    
    if (channel.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this video" });
    }

    await Channel.findByIdAndUpdate(
      video.channel,
      { $pull: { videos: videoId } },
      { new: true }
    );

    const deleted = await Video.findByIdAndDelete(videoId);
    console.log(deleted,"deleted")

    if (!deleted) {
      return res.status(500).json({ message: "Error while deleting the video." });
    }

    return res.status(200).json({
      statusCode: 200,
      data: deleted,
      message: "Video deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};


// Updating Video Details

const updateVideo = async (req, res, next) => {
    try {
        const user = req.user?._id
        const {videoId} = req.params
        if(!user || !videoId){
            return res.status(400).json({message: "Invalid Request"})
        }
        const {title,description,category} = req.body
        if(!title && !description && !category){
            return res.status(400).json({message: "Please provide at least one field to update"})
        }
        const video = await Video.findById(videoId)
        console.log(video,"video")
        if(!video){
            return res.status(400).json({message: "Video does not Exist"})
        }
        
    const channel = await Channel.findById(video.channel);
    if (!channel) {
      return res.status(404).json({ message: "Channel does not exist" });
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
        if(channel.owner.toString()!== user.toString()){
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

const likeVideo = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { videoId } = req.params;

    if (!userId || !videoId) {
      return res.status(400).json({ message: "Invalid Request" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video does not exist" });
    }

    if (video.likedBy.includes(userId)) {
      return res.status(400).json({ message: "You have already liked this video" });
    }

    video.likedBy.push(userId);
    video.likes += 1;

    await video.save();

    return res.status(200).json({
      message: "Video liked successfully",
      likes: video.likes
    });
  } catch (error) {
    next(error);
  }
};



// unlilke Video

const unlikeVideo = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { videoId } = req.params;

    if (!userId || !videoId) {
      return res.status(400).json({ message: "Invalid Request" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video does not exist" });
    }

    if (!video.likedBy) {
      video.likedBy = [];
    }

    if (!video.likedBy.includes(userId)) {
      return res.status(400).json({ message: "You have not liked this video" });
    }

    video.likedBy = video.likedBy.filter(
      (id) => id.toString() !== userId.toString()
    );

    video.likes = Math.max(video.likes - 1, 0); 

    await video.save();

    return res.status(200).json({
      message: "Video disliked successfully",
      likes: video.likes,
    });
  } catch (error) {
    next(error);
  }
};

  
//   check user that liked video

const hasLikedVideo = async(req,res,next)=>{
    try {
        const user = req.user?._id
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