import express from "express"
import {authMiddleware} from "../middlewares/auth.middleware.js"
import {createComment,updatingComment,deleteComment} from "../controllers/comment.controller.js"

const router = express.Router()

router.route("/:videoId")
.post(authMiddleware,createComment)

router.route("/:commentId")
.put(authMiddleware,updatingComment)
.delete(authMiddleware,deleteComment)






export default router