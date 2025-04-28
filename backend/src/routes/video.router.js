import { Router } from "express";
import {
  publishVideo,
  getVideoById,
  fetchAllVideos,
  deleteVideo,
  updateVideo,
  likeVideo,
  unlikeVideo,
  hasLikedVideo,
} from "../controllers/video.controller.js";

const router = Router();

// POST   /api/video/:channelId/publish
router.post("/:channelId/publish", publishVideo);

// GET    /api/video/:videoId
router.get("/:videoId", getVideoById);

// GET    /api/video
router.get("/", fetchAllVideos);

// DELETE /api/video/:videoId
router.delete("/:videoId", deleteVideo);

// PUT    /api/video/:videoId
router.put("/:videoId", updateVideo);

// POST   /api/video/:videoId/like
router.post("/:videoId/like", likeVideo);

// POST   /api/video/:videoId/unlike
router.post("/:videoId/unlike", unlikeVideo);

// GET    /api/video/:videoId/hasLiked
router.get("/:videoId/hasLiked", hasLikedVideo);

export default router;