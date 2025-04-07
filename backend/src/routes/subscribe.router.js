import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import {subscribeVideo,unsubscribeVideo,hasSubscribed} from "../controllers/subscribe.controller.js"

const router = express.Router()

router.route("/:videoId")
.get(authMiddleware,hasSubscribed)
.post(authMiddleware,subscribeVideo)
.delete(authMiddleware,unsubscribeVideo)






export default router