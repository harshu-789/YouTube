import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import channelRouter from "./routes/channel.router.js"
import userRouter from "../src/routes/user.router.js"
import commentRouter from "./routes/comment.router.js"
import videoRouter from "./routes/video.router.js"
import likeRouter from "./routes/video.router.js"
import subscribeRouter from "./routes/subscribe.router.js"
import { errorHandler } from "./middlewares/error.middleware.js"





dotenv.config()
const app = express()
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true ,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  
  




app.use(express.json())

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'))




// user route
app.use("/api/user",userRouter)
app.use("/api/channel",channelRouter)
app.use("/api/comment",commentRouter)
app.use("/api/video",videoRouter)
app.use("/api/like",likeRouter)
app.use("/api/subscribe",subscribeRouter)


app.use(errorHandler)


export default app







