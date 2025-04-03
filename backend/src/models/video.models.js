import mongoose from "mongoose";


const videoSchema = new videoSchema({
    title: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      url: {
        type: String,
        required: true,
      },
      thumbnailUrl: {
        type: String,
        required: true,
      },
      channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: true,
      },
      views: {
        type: Number,
        default: 0,
      },
      likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
      dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
},{timestamps: true})

export const Video = mongoose.model("Video", videoSchema)