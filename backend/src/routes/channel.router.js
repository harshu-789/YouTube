import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import {createChannel,getChannel,updateChannel} from "../controllers/channel.controller.js"
import multer from "multer"
import { upload } from "../middlewares/multer.middleware.js"

const router = express.Router()

router.route("")
.post( upload.single("profile"),authMiddleware,createChannel)

router.route("/:channelId")
.get(authMiddleware,getChannel)
.put(authMiddleware,updateChannel)


export default router
