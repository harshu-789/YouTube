import {Channel} from "../models/channel.models.js"
import mongoose from "mongoose";

// Create channel
const createChannel = async(req,res,next)=>{
    try {
        const {name,description} = req.body
        const channel = await Channel.create({
            name,
            description,
            owner : req.user._id
        })
        res.status(201).json({message:"Channel created Successfully",channel})
    } catch (error) {
        next(error)
    }
}

// Get Channel 

const getChannel = async(req, res, next) => {
    try {
      console.log("Requested ID:", req.params.channelId);
  
      const channel = await Channel.findById(req.params.channelId)
        .populate('owner', 'username email')
        .populate('subscribers', 'username');
  
      if (!channel) {
        return res.status(404).json({ message: "Channel Not Found" });
      }
  
      return res.status(200).json({ message: "Channel Found", channel });
    } catch (error) {
      console.error("Error in getChannel:", error);
      next(error);
    }
  }
  

// Updating channel

const updateChannel = async (req, res, next) => {
    try {
      const { channelId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(channelId)) {
        return res.status(400).json({ message: "Invalid Channel ID" });
      }
  
      const channel = await Channel.findById(channelId); // ✅ fixed
  
      if (!channel) {
        return res.status(404).json({ message: "Channel Not Found" });
      }
      const ownerId = channel.owner._id ? channel.owner._id.toString() : channel.owner.toString();
      if (ownerId !== req.user._id) {
        return res.status(403).json({ message: "You are not the owner of this channel" });
      }
// Update the channel with the new data
  
      Object.keys(req.body).forEach((key) => {
        channel.set(key, req.body[key]);
      });
  
      const updatedChannel = await channel.save();
  
      return res.status(201).json({ message: "Channel updated successfully", updatedChannel });
    } catch (error) {
      next(error);
    }
  };
  

export {createChannel,getChannel,updateChannel}