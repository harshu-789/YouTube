import mongoose from "mongoose";
import {Channel} from "../models/channel.models.js"
import { User } from "../models/user.models.js";



// Subscribing Video

const subscribeVideo = async(req,res,next)=>{
    try {
        const user = req.user?.userId
        const {videoId} = req.params
        if(!user || !videoId){
            return res.status(400).json({message: "Invalid user or videoId"})
        }
        const channel = await channel.findById(videoId)
        if(!channel){
            return res.status(400).json({message: "Channel not found"})
        }
        if(channel.subscribers.includes(user._id)){
            return res.status(400).json({message: "User is already subscribed to this channel"})
        }
        channel.subscribers.push(user._id)
        await channel.save()
        res.json({message: "User subscribed to channel successfully"})
    } catch (error) {
        next(error)
    }
}

// Unsubscribe Video

const unsubscribeVideo = async(req,res,next)=>{
    try {
        const user = req.user?.userId
        const {videoId} = req.params
        if(!user || !videoId){
            return res.status(400).json({message: "Invalid user or videoId"})
        }
        const channel = await Channel.findById(videoId)
        if(!channel){
            return res.status(400).json({message: "Channel not found"})
        }
        if(!channel.subscribers.includes(user._id)){
            return res.status(400).json({message: "User is not subscribed to this channel"})
        }
        channel.subscribers.pull(user._id)
        await channel.save()
        res.json({message: "User unsubscribed from channel successfully"})

    } catch (error) {
        next(error)
    }
}

// To check Subscription Status

const hasSubscribed = async(req,res,next)=>{
    try {
        const user = req.user?.userId
        const {videoId} = req.params
        if(!user || !videoId){
            return res.status(400).json({message: "Invalid user or videoId"})
        }
        const channel = await channel.findById(videoId)
        if(!channel){
            return res.status(400).json({message: "Channel not found"})
        }
        if(channel.subscribers.includes(user._id)){
            return res.json({message: "User is subscribed to this channel"})
        }
        return res.json({message: "User is not subscribed to this channel"})
    } catch (error) {
        next(error)
    }
}


export{subscribeVideo,unsubscribeVideo,hasSubscribed}