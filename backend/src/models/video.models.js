import mongoose from "mongoose";

// const videoSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   description: {
//     type: String,
//     trim: true,
//   },
//   publishedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Channel",
//     required: true,
//   },
//   url: {
//     type: String,
//     required: true,
//   },
//   thumbnailUrl: {
//     type: String,
//     required: true,
//   },
//   channel: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Channel",
//     required: true,
//   },
//   views: {
//     type: Number,
//     default: 0,
//   },
//   likes: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   ],
//   dislikes: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   ],
//   comments: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Comment",
//     },
//   ],
//   category: {
//     type: String,
//     enum: ["All", "Music", "Funny", "Sports", "Movie", "News", "Study", "Cricket", "Kids", "Gaming","Automobile"],
//     required: true,
//   },
// }, { timestamps: true });




const videoSchema = new mongoose.Schema({
  channel:      { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  url:          { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  title:        { type: String, required: true },
  description:  { type: String },
 
  category: {
    type: String,
    enum: ['AutoMobile','Education','Gaming','Comedy','Music','Sports','News'],
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes : {
    type: Number,
    default: 0
  },
  likedBy: [
         {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User",
         },
       ],
       dislikedBy: [
         {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User",
         },
      ],
});

export const Video = mongoose.model("Video", videoSchema);