import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from 'react-player';

import CommentSection from '../components/CommentSection';
import useAuthStore from '../store/authStore';








function Video(){
    const{id} = useParams
    const[video,setVideo] = useState(null)
    const [isLiked,setIsLiked] = useState(false)
    const [isDisliked,setIsDisliked] = useState(false)
    const{user} = useAuthStore()

    useEffect(()=>{
        const fetchVideo = async ()=>{
            try {
                const {data} = await axios.get(`/videos/${id}`)
                setVideo(data)
                if(user){
                    setIsLiked(data.likes.some((like)=>like._id===user._id))
                }
                setIsDisliked(data.disliked.some((dislike)=>dislike._id===user._id))

            } catch (error) {
                console.error('Error fetching video:', error);
            }
        }
        fetchVideo();
    },[id, user])

    const handleLike = async()=>{
        if(!user) return
        try {
            await axios.post(`/videos/${id}/like`)
            setIsLiked(!isLiked)
            if(isDisliked)setIsDisliked(false)
        } catch (error) {
            console.error('Error liking video:', error); 
        }
    }
    const handleDislike = async () => {
        if (!user) return;
        try {
          await axios.post(`/videos/${id}/dislike`);
          setIsDisliked(!isDisliked);
          if (isLiked) setIsLiked(false);
        } catch (error) {
          console.error('Error disliking video:', error);
        }
      };
    
      if (!video) return <div>Loading...</div>;
    

    return(
        <div className="max-w-6xl mx-auto px-4">
        <div className="aspect-video">
          <ReactPlayer
            url={video.url}
            width="100%"
            height="100%"
            controls
            playing
          />
        </div>
        <div className="mt-4">
          <h1 className="text-2xl font-bold">{video.title}</h1>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <img
                src={video.channel.avatar || 'https://via.placeholder.com/40'}
                alt={video.channel.name}
                className="h-10 w-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{video.channel.name}</h3>
                <p className="text-sm text-gray-600">{video.views} views</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 ${
                  isLiked ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                <span>{video.likes.length}</span>
                <span>👍</span>
              </button>
              <button
                onClick={handleDislike}
                className={`flex items-center gap-1 ${
                  isDisliked ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                <span>{video.dislikes.length}</span>
                <span>👎</span>
              </button>
            </div>
          </div>
          <p className="mt-4 text-gray-800">{video.description}</p>
        </div>
        <CommentSection videoId={id} comments={video.comments} />
      </div>
    )
}

export default Video;