import express from "express"
import multer from "multer"
import {publishVideo,getVideoById,fetchAllVideos,updateVideo,deleteVideo,likeVideo,unlikeVideo,hasLikedVideo} from "../controllers/video.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = express.Router()

router
  .route("/:videoId/like")
  .get(authMiddleware, hasLikedVideo)
  .post(authMiddleware, likeVideo)
  .delete(authMiddleware, unlikeVideo);


  router.route("").get(authMiddleware,fetchAllVideos);

router
  .route("/:channelId")
  .post(
    authMiddleware,
    upload.fields([
      { name: "video", maxCount: 1 }, // Max 1 video
      { name: "thumbnail", maxCount: 1 }, // Max 1 thumbnail
    ]),
    publishVideo
  )
  router.route("/:videoId")
  .put(authMiddleware,updateVideo)


  router.route("/:videoId").get(authMiddleware,getVideoById)
  .delete(authMiddleware,deleteVideo);








export default router;