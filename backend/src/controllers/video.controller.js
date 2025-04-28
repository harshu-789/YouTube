import mongoose from "mongoose"
import { Channel } from "../models/channel.models.js";
import { Video }   from "../models/video.models.js";
import {
  uploadThumbnailOnCloud,
  uploadVideoOnCloud,
} from "../config/cloud.config.js";

// Publish
const publishVideo = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ statusCode: 401, message: "Unauthorized" });

    const { channelId } = req.params;
    if (!channelId) return res.status(400).json({ statusCode: 400, message: "Channel ID required" });

    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ statusCode: 404, message: "Channel not found" });
    if (channel.owner.toString() !== userId.toString())
      return res.status(403).json({ statusCode: 403, message: "Not channel owner" });

    const { title, description, category } = req.body;
    if (!title || !description || !category)
      return res.status(400).json({ statusCode: 400, message: "Title, description, category required" });

    const videoFile = req.files?.video?.[0];
    const thumbFile = req.files?.thumbnail?.[0];
    if (!videoFile || !thumbFile)
      return res.status(400).json({ statusCode: 400, message: "Video & thumbnail required" });

    const videoResult = await uploadVideoOnCloud(videoFile.path);
    const thumbResult = await uploadThumbnailOnCloud(thumbFile.path);
    if (!videoResult.secure_url || !thumbResult.secure_url)
      return res.status(500).json({ statusCode: 500, message: "Cloud upload failed" });

    const videoDoc = new Video({
      channel:      channel._id,
      url:          videoResult.secure_url,
      thumbnailUrl: thumbResult.secure_url,
      title,
      description,
      category,
    });
    const savedVideo = await videoDoc.save();

    res.status(201).json({
      statusCode: 201,
      data: savedVideo,
      message: "Video published",
    });
  } catch (err) {
    next(err);
  }
};

// Get by ID
const getVideoById = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId))
      return res.status(400).json({ statusCode: 400, message: "Valid videoId required" });

    const results = await Video.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(videoId) } },
      {
        $lookup: {
          from: "channels",
          localField: "channel",
          foreignField: "_id",
          as: "channel",
        },
      },
      { $unwind: "$channel" },
      {
        $lookup: {
          from: "comments",
          let: { vid: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$video", "$$vid"] } } },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            { $addFields: { user: { $arrayElemAt: ["$user", 0] } } },
          ],
          as: "comments",
        },
      },
    ]);
    if (!results.length)
      return res.status(404).json({ statusCode: 404, message: "Video not found" });

    await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

    res.status(200).json({
      statusCode: 200,
      data: results[0],
      message: "Video retrieved",
    });
  } catch (err) {
    next(err);
  }
};

// Fetch All
// in src/controllers/video.controller.js
const fetchAllVideos = async (req, res, next) => {
  try {
    const { category, title, sortBy } = req.query;
    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (title) filter.title = { $regex: title, $options: "i" };
    const sort = sortBy ? { [sortBy]: 1 } : { createdAt: -1 };

    const videos = await Video.find(filter)
      .populate("channel")
      .sort(sort);

    console.log("⛳ [fetchAllVideos] returning:", videos.length, "videos");

    if (!videos.length) {
      return res
        .status(404)
        .json({ statusCode: 404, data: [], message: "No videos found" });
    }

    return res.status(200).json({
      statusCode: 200,
      data: videos,
      message: "Videos retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete
const deleteVideo = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { videoId } = req.params;
    if (!userId || !videoId)
      return res.status(400).json({ statusCode: 400, message: "Invalid request" });

    const video = await Video.findById(videoId);
    if (!video)
      return res.status(404).json({ statusCode: 404, message: "Video not exist" });

    const channel = await Channel.findById(video.channel);
    if (channel.owner.toString() !== userId.toString())
      return res.status(403).json({ statusCode: 403, message: "Not authorized" });

    await Channel.findByIdAndUpdate(channel._id, { $pull: { videos: videoId } });
    const deleted = await Video.findByIdAndDelete(videoId);

    res.status(200).json({
      statusCode: 200,
      data: deleted,
      message: "Video deleted",
    });
  } catch (err) {
    next(err);
  }
};

// Update
const updateVideo = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { videoId } = req.params;
    const { title, description, category } = req.body;
    if (!userId || !videoId)
      return res.status(400).json({ statusCode: 400, message: "Invalid request" });
    if (!title && !description && !category)
      return res.status(400).json({ statusCode: 400, message: "Nothing to update" });

    const video = await Video.findById(videoId);
    const channel = await Channel.findById(video.channel);
    if (channel.owner.toString() !== userId.toString())
      return res.status(403).json({ statusCode: 403, message: "Not authorized" });

    const upd = {};
    if (title)       upd.title = title;
    if (description) upd.description = description;
    if (category)    upd.category = category;

    const updated = await Video.findByIdAndUpdate(videoId, upd, { new: true });
    res.status(200).json({
      statusCode: 200,
      data: updated,
      message: "Video updated",
    });
  } catch (err) {
    next(err);
  }
};

// Like
const likeVideo = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { videoId } = req.params;
    if (!userId || !videoId)
      return res.status(400).json({ statusCode: 400, message: "Invalid request" });

    const video = await Video.findById(videoId);
    if (video.likedBy.includes(userId))
      return res.status(400).json({ statusCode: 400, message: "Already liked" });

    video.likedBy.push(userId);
    video.likes += 1;
    await video.save();

    res.status(200).json({
      statusCode: 200,
      data: { likes: video.likes },
      message: "Liked",
    });
  } catch (err) {
    next(err);
  }
};

// Unlike
const unlikeVideo = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { videoId } = req.params;
    if (!userId || !videoId)
      return res.status(400).json({ statusCode: 400, message: "Invalid request" });

    const video = await Video.findById(videoId);
    if (!video.likedBy.includes(userId))
      return res.status(400).json({ statusCode: 400, message: "Not liked yet" });

    video.likedBy = video.likedBy.filter((id) => id.toString() !== userId.toString());
    video.likes = Math.max(video.likes - 1, 0);
    await video.save();

    res.status(200).json({
      statusCode: 200,
      data: { likes: video.likes },
      message: "Unliked",
    });
  } catch (err) {
    next(err);
  }
};

// HasLiked
const hasLikedVideo = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { videoId } = req.params;
    if (!userId || !videoId)
      return res.status(400).json({ statusCode: 400, message: "Invalid request" });

    const video = await Video.findById(videoId);
    const has = video.likedBy.includes(userId);

    res.status(200).json({
      statusCode: 200,
      data: { hasLiked: has },
      message: has ? "Has liked" : "Has not liked",
    });
  } catch (err) {
    next(err);
  }
};

export {
  publishVideo,
  getVideoById,
  fetchAllVideos,
  deleteVideo,
  updateVideo,
  likeVideo,
  unlikeVideo,
  hasLikedVideo,
};
